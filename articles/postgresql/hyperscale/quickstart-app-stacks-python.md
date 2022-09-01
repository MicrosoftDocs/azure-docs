---
title: Python app to connect and query Hyperscale (Citus)
description: Learn to query Hyperscale (Citus) using Python
ms.author: sasriram
author: saimicrosoft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: quickstart
recommendations: false
ms.date: 08/24/2022
---

# Python app to connect and query Hyperscale (Citus)

[!INCLUDE[applies-to-postgresql-hyperscale](../includes/applies-to-postgresql-hyperscale.md)]

In this article, you'll learn how to connect to the database on Hyperscale (Citus) and run SQL statements to query using Python on macOS, Ubuntu Linux, or Windows.

> [!TIP]
>
> The process of creating a Python app with Hyperscale (Citus) is the same as working with ordinary PostgreSQL.

## Setup

### Prerequisites

For this article you need:

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* Create a Hyperscale (Citus) server group using this link [Create Hyperscale (Citus) server group](quickstart-create-portal.md).
* [Python](https://www.python.org/downloads/) 2.7 or 3.6+.
* The latest [pip](https://pip.pypa.io/en/stable/installing/) package installer.
* Install [psycopg2](https://pypi.python.org/pypi/psycopg2-binary/) using pip in a terminal or command prompt window. For more information, see [how to install psycopg2](https://www.psycopg.org/docs/install.html).

### Get database connection information

To get the database credentials, you can use the **Connection strings** tab in the Azure portal:

![Diagram showing python connection string.](../media/howto-app-stacks/01-python-connection-string.png)

Replace the following values:

* \<host\> with the value you copied from the Azure portal.
* \<password\> with the server password you created.
* Use the default admin user, which is `citus`.
* Use the default database, which is `citus`.

## Step 1: Connect, create table, and insert data

The following code example creates a connection pool to your Postgres database using
the [psycopg2.pool](https://www.psycopg.org/docs/pool.html) library. **pool.getconn()** is used to get a connection from the pool.
[cursor.execute](https://www.psycopg.org/docs/cursor.html#execute) function executes the SQL query against the database.

[!INCLUDE[why-connection-pooling](includes/why-connection-pooling.md)]

```python
import psycopg2
from psycopg2 import pool

# NOTE: fill in these variables for your own server group
host = "<host>"
dbname = "citus"
user = "citus"
password = "<password>"
sslmode = "require"

# now we'll build a connection string from the variables
conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4}".format(host, user, dbname, password, sslmode)

postgreSQL_pool = psycopg2.pool.SimpleConnectionPool(1, 20,conn_string)
if (postgreSQL_pool):
    print("Connection pool created successfully")

# Use getconn() to Get Connection from connection pool
conn = postgreSQL_pool.getconn()

cursor = conn.cursor()

# Drop previous table of same name if one exists
cursor.execute("DROP TABLE IF EXISTS pharmacy;")
print("Finished dropping table (if existed)")

# Create a table
cursor.execute("CREATE TABLE pharmacy (pharmacy_id integer, pharmacy_name text, city text, state text, zip_code integer);")
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

```
Connection established
Finished dropping table
Finished creating table
Finished creating index
Inserted 2 rows of data
```

## Step 2: Use the super power of distributed tables

Hyperscale (Citus) gives you [the super power of distributing tables](overview.md#the-superpower-of-distributed-tables) across multiple nodes for scalability. The command below enables you to distribute a table. You can learn more about `create_distributed_table` and the distribution column [here](quickstart-build-scalable-apps-concepts.md#distribution-column-also-known-as-shard-key).

> [!TIP]
>
> Distributing your tables is optional if you are using the Basic Tier of Hyperscale (Citus), which is a single-node server group.

```python
# Create distribute table
cursor.execute("select create_distributed_table('pharmacy','pharmacy_id');")
print("Finished distributing the table")
```

## Step 3: Read data

The following code example uses these APIs:

* [cursor.execute](https://www.psycopg.org/docs/cursor.html#execute) with the SQL SELECT statement to read data.
* [cursor.fetchall()](https://www.psycopg.org/docs/cursor.html#cursor.fetchall) accepts a query and returns a result set to iterate

```python
# Fetch all rows from table
cursor.execute("SELECT * FROM pharmacy;")
rows = cursor.fetchall()

# Print all rows
for row in rows:
    print("Data row = (%s, %s)" %(str(row[0]), str(row[1])))
```

## Step 4: Update data

The following code example uses [cursor.execute](https://www.psycopg.org/docs/cursor.html#execute) with the SQL UPDATE statement to update data.

```python
# Update a data row in the table
cursor.execute("UPDATE pharmacy SET city = %s WHERE pharmacy_id = %s;", ("guntur",1))
print("Updated 1 row of data")
```

## Step 5: Delete data

The following code example runs [cursor.execute](https://www.psycopg.org/docs/cursor.html#execute) with the SQL DELETE statement to delete the data.

```python
# Delete data row from table
cursor.execute("DELETE FROM pharmacy WHERE pharmacy_name = %s;", ("Target",))
print("Deleted 1 row of data")
```

## COPY command for super fast ingestion

The COPY command can yield [tremendous throughput](https://www.citusdata.com/blog/2016/06/15/copy-postgresql-distributed-tables) while ingesting data into Hyperscale (Citus). The COPY command can ingest data in files, or from micro-batches of data in memory for real-time ingestion.

### COPY command to load data from a file

The following code is an example for copying data from a CSV file to a database table.

It requires the file [pharmacies.csv](https://download.microsoft.com/download/d/8/d/d8d5673e-7cbf-4e13-b3e9-047b05fc1d46/pharmacies.csv).

```python
with open('pharmacies.csv', 'r') as f:
    # Notice that we don't need the `csv` module.
    next(f) # Skip the header row.
    cursor.copy_from(f, 'pharmacy', sep=',')
print("copying data completed")
```

### COPY command to load data in-memory

The following code is an example for copying in-memory data to table.

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
## App retry during database request failures

[!INCLUDE[app-stack-next-steps](includes/app-stack-retry-intro.md)]

```python
import psycopg2
import time
from psycopg2 import pool

host = "<host>"
dbname = "citus"
user = "citus"
password = "{your password}"
sslmode = "require"

conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4}".format(
        host, user, dbname, password, sslmode)
postgreSQL_pool = psycopg2.pool.SimpleConnectionPool(1, 20, conn_string)

def executeRetry(query, retryCount):
    for x in range(retryCount):
        try:
            if (postgreSQL_pool):
                # Use getconn() to Get Connection from connection pool
                conn = postgreSQL_pool.getconn()
                cursor = conn.cursor()
                cursor.execute(query)
                return cursor.fetchall()
            break
        except Exception as err:
            print(err)
            postgreSQL_pool.putconn(conn)
            time.sleep(60)
    return None

print(executeRetry("select 1", 5))
```

## Next steps

[!INCLUDE[app-stack-next-steps](includes/app-stack-next-steps.md)]
