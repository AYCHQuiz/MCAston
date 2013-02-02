import sys
import re
import subprocess
import os
from datetime import datetime
import json
import csv

# "constants"
client_id = "e0fdb2264d15d2a"
client_secret = "e07c8659762da7a8ec2f3fcda9083499bd97f14a"
#client_id = "b6e3d408212d828"
#client_secret = "2a38dd8e341be9b5a785d420ef9cefc2c4700a71"
# not terribly secret here, is it...

dirname = sys.argv[1]
print "directory name: " + dirname
admin = dirname[0]
print "administration code: " + admin
year = dirname[1:5]
print "year: " + year
grade = re.search('(?<=g)\d+',dirname).group(0)
print "grade: " + grade

ls_lines = subprocess.check_output("ls " + dirname + "/*.png", shell=True)
ls_lines = ls_lines.split("\n")
png_paths = []
dates = []
for line in ls_lines:
    if "png" in line:
        png_paths.append(line)
        dates.append(datetime.strptime(line.split("/")[1],
                     'Screen Shot %Y-%m-%d at %I.%M.%S %p.png'))
datefiles = zip(dates,png_paths)
datefiles.sort()
sorted_dates, sorted_pngs = zip(*datefiles)

key_path = os.path.join(dirname,"key.txt")
key_file = open(key_path,'r')
key = []
for line in key_file:
    if "#" not in line:
        key.append(line[0])
key_file.close()

if len(png_paths)==len(key):
    print "matching number pngs and key items: " + str(len(png_paths))
else:
    raise Exception("mismatch pngs vs. key items")

print "go here:"
print("https://api.imgur.com/oauth2/authorize?client_id=" +
      client_id +
      "&response_type=pin")
pin = raw_input("and enter pin: ")

token_getter = ('curl -X POST -F "client_id=' +
                client_id +
                '" -F "client_secret=' +
                client_secret +
                '" -F "grant_type=pin" -F "pin=' +
                pin +
                '" https://api.imgur.com/oauth2/token')
with_token = subprocess.check_output(token_getter, shell=True)
token_dict = json.loads(with_token)
token = str(token_dict[u'data'][u'access_token'])

output_lines = list()
for i in range(len(sorted_pngs)):
    filename = sorted_pngs[i]
    file_loader = ('curl -X POST -H "Authorization: Bearer ' +
                   token +
                   '" -F "image=@' +
                   filename +
                   '" https://api.imgur.com/3/upload')
    print file_loader
    with_id = subprocess.check_output(file_loader, shell=True)
    id_dict = json.loads(with_id)
    id = str(id_dict[u'data'][u'id'])
    output_lines.append([year,admin,grade,id,key[i]])

out_path = os.path.join(dirname,"record.txt")
outfile = open(out_path,'w')
writer = csv.writer(outfile)
for line in output_lines:
    writer.writerow(line)
outfile.close()

print "SUCCESS!"
