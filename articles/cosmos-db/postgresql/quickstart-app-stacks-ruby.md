---
title: Use Ruby to connect and query Azure Cosmos DB for PostgreSQL 
description: See how to use Ruby to connect and run SQL statements on Azure Cosmos DB for PostgreSQL.
ms.author: nlarin
author: niklarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: quickstart
recommendations: false
ms.date: 06/05/2023
---

# Use Ruby to connect and run SQL commands on Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

[!INCLUDE [App stack selector](includes/quickstart-selector.md)]

This quickstart shows you how to use Ruby code to connect to a cluster, and use SQL statements to create a table. You'll then insert, query, update, and delete data in the database. The steps in this article assume that you're familiar with Ruby development, and are new to working with Azure Cosmos DB for PostgreSQL.

## Install PostgreSQL library

The code examples in this article require the [pg](https://rubygems.org/gems/pg) gem. You'll need to install pg with your language package manager (such as bundler).

## Connect, create a table, and insert data

Use the following code to connect and create a table by using the CREATE TABLE SQL statement, then add rows to the table by using the INSERT INTO SQL statement. The code uses a `PG::Connection` object with constructor to connect to Azure Cosmos DB for PostgreSQL. Then it calls method `exec()` to run the DROP, CREATE TABLE, and INSERT INTO commands. The code checks for errors using the `PG::Error` class. Then it calls method `close()` to close the connection before terminating.

In the code, replace \<cluster> with your cluster name and \<password> with your administrator password.

```ruby
require 'pg'
begin
    # NOTE: Replace <cluster> and <password> in the connection string.
    connection = PG::Connection.new("host=c-<cluster>.<uniqueID>.postgres.cosmos.azure.com port=5432 dbname=citus user=citus password=<password> sslmode=require")
    puts 'Successfully created connection to database'

    # Drop previous table of same name if one exists
    connection.exec('DROP TABLE IF EXISTS pharmacy;')
    puts 'Finished dropping table (if existed).'

    # Drop previous table of same name if one exists.
    connection.exec('CREATE TABLE pharmacy (pharmacy_id integer ,pharmacy_name text,city text,state text,zip_code integer);')
    puts 'Finished creating table.'

    # Insert some data into table.
    connection.exec("INSERT INTO pharmacy (pharmacy_id,pharmacy_name,city,state,zip_code) VALUES (0,'Target','Sunnyvale','California',94001);")
    connection.exec("INSERT INTO pharmacy (pharmacy_id,pharmacy_name,city,state,zip_code) VALUES (1,'CVS','San Francisco','California',94002);")
    puts 'Inserted 2 rows of data.'

    # Create index
    connection.exec("CREATE INDEX idx_pharmacy_id ON pharmacy(pharmacy_id);") 
rescue PG::Error => e
    puts e.message
ensure
    connection.close if connection
end
```

## Distribute tables

Azure Cosmos DB for PostgreSQL gives you [the super power of distributing tables](introduction.md) across multiple nodes for scalability. The command below enables you to distribute a table. You can learn more about `create_distributed_table` and the distribution column [here](quickstart-build-scalable-apps-concepts.md#distribution-column-also-known-as-shard-key).

> [!NOTE]
> Distributing tables lets them grow across any worker nodes added to the cluster.

Use the following code to connect to the database and distribute the table. In the code, replace \<cluster> with your cluster name and \<password> with your administrator password.

```ruby
require 'pg'
begin
    # NOTE: Replace <cluster> and <password> in the connection string.
    connection = PG::Connection.new("host=c-<cluster>.<uniqueID>.postgres.cosmos.azure.com port=5432 dbname=citus user=citus password=<password> sslmode=require")
    puts 'Successfully created connection to database.'

    # Super power of distributed tables.
    connection.exec("select create_distributed_table('pharmacy','pharmacy_id');") 
rescue PG::Error => e
    puts e.message
ensure
    connection.close if connection
end
```

## Read data

Use the following code to connect and read the data using a SELECT SQL statement.

The code calls method `exec()` to run the SELECT command, keeping the results in a result set. The result set collection is iterated using the `resultSet.each` do loop, keeping the current row values in the row variable. In the code, replace \<cluster> with your cluster name and \<password> with your administrator password.

```ruby
require 'pg'
begin
    # NOTE: Replace <cluster> and <password> in the connection string.
    connection = PG::Connection.new("host=c-<cluster>.<uniqueID>.postgres.cosmos.azure.com port=5432 dbname=citus user=citus password=<password> sslmode=require")
    puts 'Successfully created connection to database.'

    resultSet = connection.exec('SELECT * from pharmacy')
    resultSet.each do |row|
        puts 'Data row = (%s, %s, %s, %s, %s)' % [row['pharmacy_id'], row['pharmacy_name'], row['city'], row['state'], row['zip_code ']]
    end
rescue PG::Error => e
    puts e.message
ensure
    connection.close if connection
end
```

## Update data

Use the following code to connect and update the data by using a UPDATE SQL statement. In the code, replace \<cluster> with your cluster name and \<password> with your administrator password.

```ruby
require 'pg'
begin
    # NOTE: Replace <cluster> and <password> in the connection string.
    connection = PG::Connection.new("host=c-<cluster>.<uniqueID>.postgres.cosmos.azure.com port=5432 dbname=citus user=citus password=<password> sslmode=require")
    puts 'Successfully created connection to database.'

    # Modify some data in table.
    connection.exec('UPDATE pharmacy SET city = %s WHERE pharmacy_id = %d;' % ['\'guntur\'',100])
    puts 'Updated 1 row of data.'
rescue PG::Error => e
    puts e.message
ensure
    connection.close if connection
end
```

## Delete data

Use the following code to connect and delete data using a DELETE SQL statement. In the code, replace \<cluster> with your cluster name and \<password> with your administrator password.

```ruby
require 'pg'
begin
    # NOTE: Replace <cluster> and <password> in the connection string.
    connection = PG::Connection.new("host=c-<cluster>.<uniqueID>.postgres.cosmos.azure.com port=5432 dbname=citus user=citus password=<password> sslmode=require")
    puts 'Successfully created connection to database.'

    # Delete some data in table.
    connection.exec('DELETE FROM pharmacy WHERE city = %s;' % ['\'guntur\''])
    puts 'Deleted 1 row of data.'
rescue PG::Error => e
    puts e.message
ensure
    connection.close if connection
end
```

## COPY command for super fast ingestion

The COPY command can yield [tremendous throughput](https://www.citusdata.com/blog/2016/06/15/copy-postgresql-distributed-tables) while ingesting data into Azure Cosmos DB for PostgreSQL. The COPY command can ingest data in files, or from micro-batches of data in memory for real-time ingestion.

### COPY command to load data from a file

The following code copies data from a CSV file to a database table. It requires the file [pharmacies.csv](https://download.microsoft.com/download/d/8/d/d8d5673e-7cbf-4e13-b3e9-047b05fc1d46/pharmacies.csv). In the code, replace \<cluster> with your cluster name and \<password> with your administrator password.

```ruby
require 'pg'
begin
    filename = String('pharmacies.csv')

    # NOTE: Replace <cluster> and <password> in the connection string.
    connection = PG::Connection.new("host=c-<cluster>.<uniqueID>.postgres.cosmos.azure.com port=5432 dbname=citus user=citus password=<password> sslmode=require")
    puts 'Successfully created connection to database.'

    # Copy the data from Csv to table.
    result = connection.copy_data "COPY pharmacy FROM STDIN with csv" do
        File.open(filename , 'r').each do |line|
            connection.put_copy_data line
        end
    puts 'Copied csv data successfully.'
    end      
rescue PG::Error => e
    puts e.message
ensure
    connection.close if connection
end
```

### COPY command to load in-memory data

The following code copies in-memory data to a table. In the code, replace \<cluster> with your cluster name and \<password> with your administrator password.

```ruby
require 'pg'
begin
    # NOTE: Replace <cluster> and <password> in the connection string.
    connection = PG::Connection.new("host=c-<cluster>.<uniqueID>.postgres.cosmos.azure.com port=5432 dbname=citus user=citus password=<password> sslmode=require")
    puts 'Successfully created connection to database.'

    enco = PG::TextEncoder::CopyRow.new
    connection.copy_data "COPY pharmacy FROM STDIN", enco do
        connection.put_copy_data [5000,'Target','Sunnyvale','California','94001']
        connection.put_copy_data [5001, 'CVS','San Francisco','California','94002']
        puts 'Copied in-memory data successfully.'
    end
rescue PG::Error => e
    puts e.message
ensure
    connection.close if connection
end
```
## App retry for database request failures

[!INCLUDE[app-stack-next-steps](includes/app-stack-retry-intro.md)]

In the code, replace \<cluster> with your cluster name and \<password> with your administrator password.
```ruby
require 'pg'

def executeretry(sql,retryCount)
  begin
    for a in 1..retryCount do
      begin
        # NOTE: Replace <cluster> and <password> in the connection string.
        connection = PG::Connection.new("host=c-<cluster>.<uniqueID>.postgres.cosmos.azure.com port=5432 dbname=citus user=citus password=<password> sslmode=require")
        resultSet = connection.exec(sql)
        return resultSet.each
      rescue PG::Error => e
        puts e.message
        sleep 60
      ensure
        connection.close if connection
      end
    end
  end
  return nil
end

var = executeretry('select 1',5)

if var !=nil then
  var.each do |row|
    puts 'Data row = (%s)' % [row]
  end
end
```

## Next steps

[!INCLUDE[app-stack-next-steps](includes/app-stack-next-steps.md)]
