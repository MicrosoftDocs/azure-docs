---
title: Use Python to connect and run SQL on Azure Cosmos DB for PostgreSQL
description: See how to use Python to connect and run SQL statements on Azure Cosmos DB for PostgreSQL.
ms.author: sasriram
author: saimicrosoft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: quickstart
recommendations: false
ms.date: 09/28/2022
---

# Use Python to connect and run SQL commands on Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

[!INCLUDE [App stack selector](includes/quickstart-selector.md)]

This quickstart shows you how to use Python code on macOS, Ubuntu Linux, or Windows to connect to a cluster, and use SQL statements to create a table and insert, query, update, and delete data. The steps in this article assume that you're familiar with Python development, and are new to working with Azure Cosmos DB for PostgreSQL.

> [!TIP]
> The process of creating a Python app with Azure Cosmos DB for PostgreSQL is the same as working with ordinary PostgreSQL.

## Prerequisites

- An Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free).
- [Python](https://www.python.org/downloads) 2.7 or 3.6+.
- The latest [pip](https://pip.pypa.io/en/stable/installing) package installer. Most versions of Python already install `pip`.
- [psycopg2](https://pypi.python.org/pypi/psycopg2-binary) installed by using `pip` in a terminal or command prompt window. For more information, see [How to install psycopg2](https://www.psycopg.org/docs/install.html).
- An Azure Cosmos DB for PostgreSQL cluster. To create a cluster, see [Create a cluster in the Azure portal](quickstart-create-portal.md).

The code samples in this article use your cluster name and password. In the Azure portal, your cluster name appears at the top of your cluster page.

:::image type="content" source="media/howto-app-stacks/cluster-name.png" alt-text="Screenshot of the cluster name in the Azure portal.":::

## Connect, create a table, and insert data

The following code example creates a connection pool to your Postgres database by using the [psycopg2.pool](https://www.psycopg.org/docs/pool.html) library, and uses `pool.getconn()` to get a connection from the pool. The code then uses [cursor.execute](https://www.psycopg.org/docs/cursor.html#execute) functions with SQL CREATE TABLE and INSERT INTO statements to create a table and insert data.

[!INCLUDE[why-connection-pooling](includes/why-connection-pooling.md)]

In the following code, replace \<cluster> with your cluster name and \<password> with your administrator password.

> [!NOTE]
>  This example closes the connection at the end, so if you want to run the other samples in the article in the same session, don't include the `# Clean up` section when you run this sample.

```python
import psycopg2
from psycopg2 import pool

# NOTE: fill in these variables for your own cluster
host = "c.<cluster>.postgres.database.azure.com"
dbname = "citus"
user = "citus"
password = "<password>"
sslmode = "require"

# Build a connection string from the variables
conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4}".format(host, user, dbname, password, sslmode)

postgreSQL_pool = psycopg2.pool.SimpleConnectionPool(1, 20,conn_string)
if (postgreSQL_pool):
    print("Connection pool created successfully")

# Use getconn() to get a connection from the connection pool
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

```output
Connection established
Finished dropping table
Finished creating table
Finished creating index
Inserted 2 rows of data
```

## Distribute tables

Azure Cosmos DB for PostgreSQL gives you [the super power of distributing tables](introduction.md) across multiple nodes for scalability. The command below enables you to distribute a table. You can learn more about `create_distributed_table` and the distribution column [here](quickstart-build-scalable-apps-concepts.md#distribution-column-also-known-as-shard-key).

> [!NOTE]
> Distributing tables lets them grow across any worker nodes added to the cluster.

```python
# Create distributed table
cursor.execute("select create_distributed_table('pharmacy','pharmacy_id');")
print("Finished distributing the table")
```

## Read data

The following code example uses the following APIs to read data from the database:

- [cursor.execute](https://www.psycopg.org/docs/cursor.html#execute) with the SQL SELECT statement to read data.
- [cursor.fetchall()](https://www.psycopg.org/docs/cursor.html#cursor.fetchall) to accept a query and return a result set to iterate.

```python
# Fetch all rows from table
cursor.execute("SELECT * FROM pharmacy;")
rows = cursor.fetchall()

# Print all rows
for row in rows:
    print("Data row = (%s, %s)" %(str(row[0]), str(row[1])))
```

## Update data

The following code example uses `cursor.execute` with the SQL UPDATE statement to update data.

```python
# Update a data row in the table
cursor.execute("UPDATE pharmacy SET city = %s WHERE pharmacy_id = %s;", ("guntur",1))
print("Updated 1 row of data")
```

## Delete data

The following code example runs `cursor.execute` with the SQL DELETE statement to delete the data.

```python
# Delete data row from table
cursor.execute("DELETE FROM pharmacy WHERE pharmacy_name = %s;", ("Target",))
print("Deleted 1 row of data")
```

## COPY command for fast ingestion

The COPY command can yield [tremendous throughput](https://www.citusdata.com/blog/2016/06/15/copy-postgresql-distributed-tables) while ingesting data into Azure Cosmos DB for PostgreSQL. The COPY command can ingest data in files, or from micro-batches of data in memory for real-time ingestion.

### COPY command to load data from a file

The following code copies data from a CSV file to a database table. The code requires the file [pharmacies.csv](https://download.microsoft.com/download/d/8/d/d8d5673e-7cbf-4e13-b3e9-047b05fc1d46/pharmacies.csv).

```python
with open('pharmacies.csv', 'r') as f:
    # Notice that we don't need the `csv` module.
    next(f) # Skip the header row.
    cursor.copy_from(f, 'pharmacy', sep=',')
    print("copying data completed")
```

### COPY command to load in-memory data

The following code copies in-memory data to a table.

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
## App retry for database request failures

[!INCLUDE[app-stack-next-steps](includes/app-stack-retry-intro.md)]

In this code, replace \<cluster> with your cluster name and \<password> with your administrator password.

```python
import psycopg2
import time
from psycopg2 import pool

host = "c.<cluster>.postgres.database.azure.com"
dbname = "citus"
user = "citus"
password = "<password>"
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
