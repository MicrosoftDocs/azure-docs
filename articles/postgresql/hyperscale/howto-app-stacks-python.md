---
title: Python app to connect and query Hyperscale (Citus) 
description: Learn building a simple app on Hyperscale (Citus) using python
ms.author: sasriram
author: saimicrosoft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 05/19/2022
---

# Python app to connect and query Hyperscale (Citus)

## Overview

In this document, you'll learn how to connect to the database on Hyperscale (Citus) and run SQL statements to query using Python on macOS, Ubuntu Linux, or Windows.

> [!TIP]
>
> Below experience to create a python app with Hyperscale (Citus) is same as working with PostgreSQL.

## Setup

### Prerequisites

For this QuickStart you need:
* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free)
* Create a Hyperscale (Citus) database using this link [Create Hyperscale (Citus) server group](quickstart-create-portal.md)
*    [Python](https://www.python.org/downloads/) 2.7 or 3.6+.
*    Latest [pip](https://pip.pypa.io/en/stable/installing/) package installer.
*    Install [psycopg2](https://pypi.python.org/pypi/psycopg2-binary/) using pip install psycopg2-binary in a terminal or command prompt window. For more information, see [how to install psycopg2](https://www.psycopg.org/docs/install.html).

### Get Database Connection Information

To get the database credentials, you can use the **Connection strings** tab in the Azure portal. See below screenshot.

![Diagram showing python connection string](../media/howto-app-stacks/01-python-connection-string.png)

Replace the following values:
* \<host> with the value you copied from the Azure portal.
* \<password> with your server password.
* Default admin user is *citus*
* Default database is *citus*

## Step 1: Connect, Create Table, Insert Data

The following code example connects to your Hyperscale (Citus) database using:
* [psycopg2.connect](https://www.psycopg.org/docs/connection.html) function and loads data with a SQL INSERT statement, distributing the data.
* [cursor.execute](https://www.psycopg.org/docs/cursor.html#execute) function executes the SQL query against the database.

```python
import psycopg2

# Update connection string information
host = "<host>"
dbname = "citus"
user = "citus"
password = "<password>"
sslmode = "require"

# Construct connection string
conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4}".format(host, user, dbname, password, sslmode)
conn = psycopg2.connect(conn_string)
print("Connection established")

cursor = conn.cursor()

# Drop previous table of same name if one exists
cursor.execute("DROP TABLE IF EXISTS pharmacy;")
print("Finished dropping table (if existed)")

# Create a table
cursor.execute("CREATE TABLE pharmacy (pharmacy_id integer ,pharmacy_name text,city text,state text,zip_code integer);")
print("Finished creating table")

# Create a index
cursor.execute("CREATE INDEX idx_pharmacy_id ON pharmacy(pharmacy_id);")
print("Finished creating index")

# Insert some data into the table
cursor.execute("INSERT INTO pharmacy  (pharmacy_id,pharmacy_name,city,state,zip_code) VALUES (%s, %s, %s, %s,%s);", (1,"Target","Sunnyvale","California",94001))
cursor.execute("INSERT INTO pharmacy (pharmacy_id,pharmacy_name,city,state,zip_code) VALUES (%s, %s, %s, %s,%s);", (2,"CVS","San Francisco","California",94002))
print("Inserted 2 rows of data")

# Clean up
conn.commit()
cursor.close()
conn.close()
```
When the code runs successfully, it produces the following output:
```dotnetcli
Connection established
Finished dropping table
Finished creating table
Finished creating index
Inserted 2 rows of data
```

## Step 2: Super power of Distributed Tables

Citus gives you [the super power of distributing your table](overview.md#the-superpower-of-distributed-tables) across multiple nodes for scalability. Below command enables you to distribute a table. More on create_distributed_table and distribution column [here](howto-build-scalable-apps-concepts.md#distribution-column-also-known-as-shard-key).

> [!TIP]
>
> Distributing your tables is optional if you are using single node citus (basic tier).

```python
# Create distribute table
cursor.execute("select create_distributed_table('pharmacy','pharmacy_id');")
print("Finished distributing the table")
```

## Step 3: Read Data

The following code example uses the below APIs:
* [cursor.execute](https://www.psycopg.org/docs/cursor.html#execute) with the SQL SELECT statement to read data.
* [cursor.fetchall()](https://www.psycopg.org/docs/cursor.html#cursor.fetchall) accepts a query and returns a result set to iterate over by using

```python
# Fetch all rows from table
cursor.execute("SELECT * FROM pharmacy;")
rows = cursor.fetchall()

# Print all rows
for row in rows:
    print("Data row = (%s, %s)" %(str(row[0]), str(row[1])))
```

## Step 4: Update Data

The following code example uses [cursor.execute](https://www.psycopg.org/docs/cursor.html#execute) with the SQL UPDATE statement to update data.
```python
# Update a data row in the table
cursor.execute("UPDATE pharmacy SET city = %s WHERE pharmacy_id = %s;", ("guntur",1))
print("Updated 1 row of data")
```

## Step 5: Delete Data

The following code example runs [cursor.execute](https://www.psycopg.org/docs/cursor.html#execute) with the SQL DELETE statement to delete the data.
```python
# Delete data row from table
cursor.execute("DELETE FROM pharmacy WHERE pharmacy_name = %s;", ("Target",))
print("Deleted 1 row of data")
```

## COPY command for super fast ingestion

COPY command can yield [tremendous throughput](https://www.citusdata.com/blog/2016/06/15/copy-postgresql-distributed-tables) while ingesting data into Hyperscale (Citus). COPY command can ingest data in files. You can also micro-batch data in memory and use COPY for real-time ingestion.

### COPY command to load data from a file

The following code is an example for copying data from csv file to table using COPY command.

```python
with open('pharmacies.csv', 'r') as f:
    # Notice that we don't need the `csv` module.
    next(f) # Skip the header row.
    cursor.copy_from(f, 'pharmacy', sep=',')
print("copying data completed")

```
### COPY command to load data in-memory

The following code is an example for copying the data from in-memory to table.
```python
data = [[3,"Walgreens","Sunnyvale","California",94006], [4,"Target","Sunnyvale","California",94016]]
buf = io.StringIO()
writer = csv.writer(buf)
writer.writerows(data)

buf.seek(0)
with conn.cursor() as cur:
    cur.copy_from(buf, "pharmacy", sep=",")

conn.commit()
conn.close()
```