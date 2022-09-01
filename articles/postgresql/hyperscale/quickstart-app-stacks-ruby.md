---
title: Ruby app to connect and query Hyperscale (Citus) 
description: Learn to query Hyperscale (Citus) using Ruby
ms.author: sasriram
author: saimicrosoft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: quickstart
recommendations: false
ms.date: 08/24/2022
---

# Ruby app to connect and query Hyperscale (Citus)

[!INCLUDE[applies-to-postgresql-hyperscale](../includes/applies-to-postgresql-hyperscale.md)]

In this how-to article, you'll connect to a Hyperscale (Citus) server group using a Ruby application. We'll see how to use SQL statements to query, insert, update, and delete data in the database. The steps in this article assume that you're familiar with developing using Node.js, and are new to working with Hyperscale (Citus).

> [!TIP]
>
> The process of creating a Ruby app with Hyperscale (Citus) is the same as working with ordinary PostgreSQL.

## Setup

### Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free)
* Create a Hyperscale (Citus) database using this link [Create Hyperscale (Citus) server group](quickstart-create-portal.md)
* [Ruby](https://www.ruby-lang.org/en/downloads/)
* [Ruby pg](https://rubygems.org/gems/pg/), the PostgreSQL module for Ruby

### Get database connection information

To get the database credentials, you can use the **Connection strings** tab in the Azure portal. See below screenshot.

![Diagram showing ruby connection string.](../media/howto-app-stacks/01-python-connection-string.png)

## Connect, create table, insert data

Use the following code to connect and create a table using CREATE TABLE SQL statement, followed by INSERT INTO SQL statements to add rows into the table.

The code uses a `PG::Connection` object with constructor to connect to Hyperscale (Citus). Then it calls method `exec()` to run the DROP, CREATE TABLE, and INSERT INTO commands. The code checks for errors using the `PG::Error` class. Then it calls method `close()` to close the connection before terminating. For more information about these classes and methods, see the [Ruby pg reference documentation](https://rubygems.org/gems/pg).


```ruby
require 'pg'
begin
    # NOTE: Replace the host and password arguments in the connection string.
    # (The connection string can be obtained from the Azure portal)
    connection = PG::Connection.new("host=<server name> port=5432 dbname=citus user=citus password={your password} sslmode=require")
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

## Use the super power of distributed tables

Hyperscale (Citus) gives you [the super power of distributing tables](overview.md#the-superpower-of-distributed-tables) across multiple nodes for scalability. The command below enables you to distribute a table. You can learn more about `create_distributed_table` and the distribution column [here](quickstart-build-scalable-apps-concepts.md#distribution-column-also-known-as-shard-key).

> [!TIP]
>
> Distributing your tables is optional if you are using the Basic Tier of Hyperscale (Citus), which is a single-node server group.

Use the following code to connect to the database and distribute the table:

```ruby
require 'pg'
begin
    # NOTE: Replace the host and password arguments in the connection string.
    # (The connection string can be obtained from the Azure portal)
    connection = PG::Connection.new("host=<server name> port=5432 dbname=citus user=citus password={your password} sslmode=require")
    puts 'Successfully created connection to database'

    # Super power of Distributed Tables.
    connection.exec("select create_distributed_table('pharmacy','pharmacy_id');") 
rescue PG::Error => e
    puts e.message
ensure
    connection.close if connection
end
```

## Read data

Use the following code to connect and read the data using a SELECT SQL statement.

The code uses a `PG::Connection` object with constructor new to connect to Hyperscale (Citus). Then it calls method `exec()` to run the SELECT command, keeping the results in a result set. The result set collection is iterated using the `resultSet.each` do loop, keeping the current row values in the row variable. The code checks for errors using the `PG::Error` class. Then it calls method `close()` to close the connection before terminating. For more information about these classes and methods, see the [Ruby pg reference documentation](https://rubygems.org/gems/pg).

```ruby
require 'pg'
begin
    # NOTE: Replace the host and password arguments in the connection string.
    # (The connection string can be obtained from the Azure portal)
    connection = PG::Connection.new("host=<server name> port=5432 dbname=citus user=citus password={your password} sslmode=require")
    puts 'Successfully created connection to database'

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

Use the following code to connect and update the data using a UPDATE SQL statement.

The code uses a `PG::Connection` object with constructor to connect to Hyperscale (Citus). Then it calls method `exec()` to run the UPDATE command. The code checks for errors using the `PG::Error` class. Then it calls method `close()` to close the connection before terminating. For more information about these classes and methods, see the [Ruby pg reference documentation](https://rubygems.org/gems/pg).

```ruby
require 'pg'
begin
    # NOTE: Replace the host and password arguments in the connection string.
    # (The connection string can be obtained from the Azure portal)
    connection = PG::Connection.new("host=<server name> port=5432 dbname=citus user=citus password={your password} sslmode=require")
    puts 'Successfully created connection to database'

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

Use the following code to connect and read the data using a DELETE SQL statement.

The code uses a `PG::Connection` object with constructor new to connect to Hyperscale (Citus). Then it calls method `exec()` to run the DELETE command. The code checks for errors using the `PG::Error` class. Then it calls method `close()` to close the connection before terminating. For more information about these classes and methods, see the [Ruby pg reference documentation](https://rubygems.org/gems/pg).

```ruby
require 'pg'
begin
    # NOTE: Replace the host and password arguments in the connection string.
    # (The connection string can be obtained from the Azure portal)
    connection = PG::Connection.new("host=<server name> port=5432 dbname=citus user=citus password={your password} sslmode=require")
    puts 'Successfully created connection to database'

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

The COPY command can yield [tremendous throughput](https://www.citusdata.com/blog/2016/06/15/copy-postgresql-distributed-tables) while ingesting data into Hyperscale (Citus). The COPY command can ingest data in files, or from micro-batches of data in memory for real-time ingestion.

### COPY command to load data from a file

The following code is an example for copying data from a CSV file to a database table.

It requires the file [pharmacies.csv](https://download.microsoft.com/download/d/8/d/d8d5673e-7cbf-4e13-b3e9-047b05fc1d46/pharmacies.csv).

```ruby
require 'pg'
begin
    filename = String('pharmacies.csv')

    # NOTE: Replace the host and password arguments in the connection string.
    # (The connection string can be obtained from the Azure portal)
    connection = PG::Connection.new("host=<server name> port=5432 dbname=citus user=citus password={your password} sslmode=require")
    puts 'Successfully created connection to database'

    # Copy the data from Csv to table.
    result = connection.copy_data "COPY pharmacy FROM STDIN with csv" do
        File.open(filename , 'r').each do |line|
            connection.put_copy_data line
        end
    puts 'Copied csv data successfully .'
    end      
rescue PG::Error => e
    puts e.message
ensure
    connection.close if connection
end
```

### COPY command to load data in-memory

The following code is an example for copying in-memory data to a table.

```ruby
require 'pg'
begin
    # NOTE: Replace the host and password arguments in the connection string.
    # (The connection string can be obtained from the Azure portal)
    connection = PG::Connection.new("host=<server name> port=5432 dbname=citus user=citus password={your password} sslmode=require")
    puts 'Successfully created connection to database'

    enco = PG::TextEncoder::CopyRow.new
    connection.copy_data "COPY pharmacy FROM STDIN", enco do
        connection.put_copy_data [5000,'Target','Sunnyvale','California','94001']
        connection.put_copy_data [5001, 'CVS','San Francisco','California','94002']
        puts 'Copied inmemory data successfully .'
    end
rescue PG::Error => e
    puts e.message
ensure
    connection.close if connection
end
```
## App retry during database request failures

[!INCLUDE[app-stack-next-steps](includes/app-stack-retry-intro.md)]

```ruby
require 'pg'

def executeretry(sql,retryCount)
  begin
    for a in 1..retryCount do
      begin
        # NOTE: Replace the host and password arguments in the connection string.
        # (The connection string can be obtained from the Azure portal)
        connection = PG::Connection.new("host=<Server Name> port=5432 dbname=citus user=citus password={Your Password} sslmode=require")
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
