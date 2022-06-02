---
title: Ruby app to connect and query Hyperscale (Citus) 
description: Learn building a simple app on Hyperscale (Citus) using Node.js
ms.author: sasriram
author: saimicrosoft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 05/19/2022
---

# Ruby app to connect and query Hyperscale (Citus)

## Overview

In this document, you connect to a Hyperscale (Citus) database using a Ruby application. It shows how to use SQL statements to query, insert, update, and delete data in the database. The steps in this article assume that you're familiar with developing using ruby, and are new to working with Hyperscale(Citus).

> [!TIP]
>
> Below experience to create a Ruby app with Hyperscale (Citus) is same as working with PostgreSQL.

## Setup

### Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free)
* Create a Hyperscale (Citus) database using this link [Create Hyperscale (Citus) server group](quickstart-create-portal.md)
* [Ruby](https://www.ruby-lang.org/en/downloads/)
* [Ruby pg](https://rubygems.org/gems/pg/), the PostgreSQL module for Ruby

### Get Database Connection Information

To get the database credentials, you can use the **Connection strings** tab in the Azure portal. See below screenshot.

![Diagram showing ruby connection string](../media/howto-app-stacks/01-python-connection-string.png)

## Connect, create table, insert data

Use the following code to connect and create a table using CREATE TABLE SQL statement, followed by INSERT INTO SQL statements to add rows into the table.

The code uses a PG::Connection object with constructor new to connect to Azure Database for PostgreSQL. Then it calls method exec() to run the DROP, CREATE TABLE, and INSERT INTO commands. The code checks for errors using the PG::Error class. Then it calls method close() to close the connection before terminating. See Ruby Pg reference documentation for more information on these classes and methods.

Replace the following values:
* \<host> with the value you got from the **Get Database Connection Information** section
* \<password> with your server password.
* Default user is *citus*
* Default database is *citus*

```ruby
require 'pg'
begin
# Initialize connection variables.
    host = String('<host>')
    database = String('citus')
    user = String('citus')
    password = String('<password>')

    # Initialize connection object.
    connection = PG::Connection.new(:host => host, :user => user, :dbname => database, :port => '5432', :password => password, :sslmode => 'require')
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
    # Creating index.
    connection.exec("CREATE INDEX idx_pharmacy_id ON pharmacy(pharmacy_id);") 
    # Super power of Distributed Tables.
    connection.exec("select create_distributed_table('pharmacy','pharmacy_id');") 
rescue PG::Error => e
    puts e.message

ensure
    connection.close if connection
end
```

## Super power of Distributed Tables

Citus gives you [the super power of distributing your table](overview.md#the-superpower-of-distributed-tables) across multiple nodes for scalability. Below command enables you to distribute a table. More on create_distributed_table and distribution column [here](howto-build-scalable-apps-concepts.md#distribution-column-also-known-as-shard-key).

> [!TIP]
>
> Distributing your tables is optional if you are using single node citus (basic tier).
>
Use the following code to connect to the database and distribute the table.

```ruby
require 'pg'
begin
    # Initialize connection variables.
    host = String('<host>')
    database = String('citus')
    user = String('citus')
    password = String('<password>')
    # Initialize connection object.
    connection = PG::Connection.new(:host => host, :user => user, :dbname => database, :port => '5432', :password => password, :sslmode => 'require')
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

The code uses a PG::Connection object with constructor new to connect to Azure Database for PostgreSQL. Then it calls method exec() to run the SELECT command, keeping the results in a result set. The result set collection is iterated over using the resultSet.each do loop, keeping the current row values in the row variable. The code checks for errors using the PG::Error class. Then it calls method close() to close the connection before terminating. See Ruby Pg reference documentation for more information on these classes and methods.

```ruby
require 'pg'
begin
    # Initialize connection variables.
    host = String('<host>')
    database = String('citus')
    user = String('citus')
    password = String('<password>')
    # Initialize connection object.
    connection = PG::Connection.new(:host => host, :user => user, :dbname => database, :port => '5432', :password => password, :sslmode => 'require')
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
Use the following code to connect and update the data using a UPDATE SQL statement.

The code uses a PG::Connection object with constructor new to connect to Azure Database for PostgreSQL. Then it calls method exec() to run the UPDATE command. The code checks for errors using the PG::Error class. Then it calls method close() to close the connection before terminating. See [Ruby Pg reference documentation](https://rubygems.org/gems/pg) for more information on these classes and methods.
```ruby
require 'pg'
begin
    # Initialize connection variables.
    host = String('<host>')
    database = String('citus')
    user = String('citus')
    password = String('<password>')
    # Initialize connection object.
    connection = PG::Connection.new(:host => host, :user => user, :dbname => database, :port => '5432', :password => password, :sslmode => 'require')
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
Use the following code to connect and read the data using a DELETE SQL statement.

The code uses a PG::Connection object with constructor new to connect to Azure Database for PostgreSQL. Then it calls method exec() to run the UPDATE command. The code checks for errors using the PG::Error class. Then it calls method close() to close the connection before terminating.

```ruby
require 'pg'

begin
    # Initialize connection variables.
    host = String('<host>')
    database = String('citus')
    user = String('citus')
    password = String('<password>')
    # Initialize connection object.
    connection = PG::Connection.new(:host => host, :user => user, :dbname => database, :port => '5432', :password => password, :sslmode => 'require')
    puts 'Successfully created connection to database.'
    # Modify some data in table.
    connection.exec('DELETE FROM pharmacy WHERE city = %s;' % ['\'guntur\''])
    puts 'Deleted 1 row of data.'
    
rescue PG::Error => e
    puts e.message

ensure
    connection.close if connection
end
```

## COPY command for super fast ingestion

COPY command can yield [tremendous throughput](https://www.citusdata.com/blog/2016/06/15/copy-postgresql-distributed-tables) while ingesting data into Hyperscale (Citus). COPY command can ingest data in files. You can also micro-batch data in memory and use COPY for real-time ingestion.

### COPY command to load data from a file

The following code is an example for copying data from csv file to table.

```ruby
require 'pg'
begin
    # Initialize connection variables.
    host = String('<host>')
    database = String('citus')
    user = String('citus')
    password = String('<password>')
    val = String('pharmacies.csv')
   # Initialize connection object.
    connection = PG::Connection.new(:host => host, :user => user, :dbname => database, :port => '5432', :password => password, :sslmode => 'require')
    puts 'Successfully created connection to database.'
    # Copy the data from Csv to table.
    result = connection.copy_data "COPY pharmacy FROM STDIN with csv" do
        File.open(val , 'r').each do |line|
            connection.put_copy_data line
        end
    
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
    # Initialize connection variables.
    host = String('<host>')
    database = String('citus')
    user = String('citus')
    password = String('<password>')

    # Initialize connection object.
    connection = PG::Connection.new(:host => host, :user => user, :dbname => database, :port => '5432', :password => password, :sslmode => 'require')
    puts 'Successfully created connection to database.'
    enco = PG::TextEncoder::CopyRow.new
    connection.copy_data "COPY pharmacy FROM STDIN", enco do
     connection.put_copy_data [5000,'Target','Sunnyvale','California','94001']
     connection.put_copy_data [5001, 'CVS','San Francisco','California','94002']
end
    
rescue PG::Error => e
    puts e.message

ensure
    connection.close if connection
end
```