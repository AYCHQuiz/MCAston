import sys
import re
import subprocess
import os
from datetime import datetime

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
ls_lines.pop()
png_paths = []
dates = []
for line in ls_lines:
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

#print datetime.strptime('Jun 1 2005  1:33PM', '%b %d %Y %I:%M%p')
print sorted_pngs
