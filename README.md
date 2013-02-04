Getting into node... Eventually a cool MCAS interface...

To load MCAS question data into the mongo datastore:
data.txt is a CSV file with header row:
    year,season,grade,imgur,answer
run:
    mongod --fork
    mongoimport -c mcas --file data.txt --type csv --headerline
