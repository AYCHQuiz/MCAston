### An interface to [MCAS questions](https://github.com/ajschumacher/MCAS_math_mult)

To load MCAS question data into the mongo datastore:

    mongod --fork
    mongoimport -c mcas --file data.csv --type csv --headerline
