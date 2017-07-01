---
title: Connect to Azure Database for PostgreSQL using Ruby | Microsoft Docs
description: This quickstart provides a Ruby code sample you can use to connect and query data from Azure Database for PostgreSQL.
services: postgresql
author: jasonwhowell
ms.author: jasonh
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql-database
ms.custom: mvc
ms.devlang: ruby
ms.topic: hero-article
ms.date: 06/30/2017
---

# Azure Database for PostgreSQL: Use Ruby to connect and query data
This quickstart demonstrates how to connect to an Azure Database for PostgreSQL using a [Ruby](https://www.ruby-lang.org) application. It shows how to use SQL statements to query, insert, update, and delete data in the database. This article assumes you are familiar with development using Ruby, but that you are new to working with Azure Database for PostgreSQL.

## Prerequisites
This quickstart uses the resources created in either of these guides as a starting point:
- [Create DB - Portal](quickstart-create-server-database-portal.md)
- [Create DB - Azure CLI](quickstart-create-server-database-azure-cli.md)

## Install Ruby
Install Ruby on your own machine. 

### Windows
- Download and Install the latest version of [Ruby](http://rubyinstaller.org/downloads/).
- On the finish screen of the MSI installer, check the box that says "Run 'ridk install' to install MSYS2 and development toolchain." Then click **Finish** to launch the next installer.
- The RubyInstaller2 for Windows installer launches. Type 2 to install the MSYS2 repository update. After it finishes and returns to the installation prompt, close the command window.
- Launch a new command prompt (cmd) from the Start menu.
- Test the Ruby installation `ruby -v` to see the version installed.
- Test the Gem installation `gem -v` to see the version installed.
- Build the PostgreSQL module for Ruby using Gem by running the command `gem install pg`.

### MacOS
- Install Ruby using Homebrew by running the command `brew install ruby`. For more installation options, see the Ruby [installation documentation](https://www.ruby-lang.org/en/documentation/installation/#homebrew)
- Test the Ruby installation `ruby -v` to see the version installed.
- Test the Gem installation `gem -v` to see the version installed.
- Build the PostgreSQL module for Ruby using Gem by running the command `gem install pg`.

### Linux (Ubuntu)
- Install Ruby by running the command `sudo apt-get install ruby-full`. For more installation options, see the Ruby [installation documentation](https://www.ruby-lang.org/en/documentation/installation/).
- Test the Ruby installation `ruby -v` to see the version installed.
- Install the latest updates for Gem by running the command `sudo gem update --system`.
- Test the Gem installation `gem -v` to see the version installed.
- Install the gcc, make, and other build tools by running the command `sudo apt-get install build-essential`.
- Install the PostgreSQL libraries by running the command `sudo apt-get install libpq-dev`.
- Build the Ruby pg module using Gem by running the command `sudo gem install pg`.

## Run Ruby code 
- Save the code into a text file, and save the file into a project folder with file extension .rb, such as `C:\rubypostgres\read.rb` or `/home/username/rubypostgres/read.rb`
- To run the code, launch the command prompt or bash shell. Change directory into your project folder `cd rubypostgres`, then type the command `ruby read.rb` to run the application.

## Get connection information
Get the connection information needed to connect to the Azure Database for PostgreSQL. You need the fully qualified server name and login credentials.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, click **All resources** and search for the server you have created, such as **mypgserver-20170401**.
3. Click the server name **mypgserver-20170401**.
4. Select the server's **Overview** page. Make a note of the **Server name** and **Server admin login name**.
 ![Azure Database for PostgreSQL - Server Admin Login](./media/connect-ruby/1-connection-string.png)
5. If you forget your server login information, navigate to the **Overview** page to view the Server admin login name. If necessary, reset the password.

## Connect and create a table
Use the following code to connect and create a table using **CREATE TABLE** SQL statement, followed by **INSERT INTO** SQL statements to add rows into the table.

The code uses a  [PG::Connection](http://www.rubydoc.info/gems/pg/PG/Connection) object with constructor [new()](http://www.rubydoc.info/gems/pg/PG%2FConnection:initialize) to connect to Azure Database for PostgreSQL. Then it calls method [exec()](http://www.rubydoc.info/gems/pg/PG/Connection#exec-instance_method) to run the DROP, CREATE TABLE, and INSERT INTO commands. The code checks for errors using the [PG::Error](http://www.rubydoc.info/gems/pg/PG/Error) class. Then it calls method [close()](http://www.rubydoc.info/gems/pg/PG/Connection#lo_close-instance_method) to close the connection before terminating.

Replace the `host`, `database`, `user`, and `password` strings with your own values. 
```ruby
require 'pg'

begin
	# Initialize connection variables.
	host = String('mypgserver-20170401.postgres.database.azure.com')
	dbname = String('postgres')
    user = String('mylogin@mypgserver-20170401')
	password = String('<server_admin_password>')

	# Initialize connection object.
    connection = PG::Connection.new(:host => host, :user => user, :dbname => dbname, :port => '5432', :password => password)
    puts 'Successfully created connection to database'

    # Drop previous table of same name if one exists
    connection.exec('DROP TABLE IF EXISTS inventory;')
    puts 'Finished dropping table (if existed).'

    # Drop previous table of same name if one exists.
    connection.exec('CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);')
    puts 'Finished creating table.'

    # Insert some data into table.
    connection.exec("INSERT INTO inventory VALUES(1, 'banana', 150)")
    connection.exec("INSERT INTO inventory VALUES(2, 'orange', 154)")
    connection.exec("INSERT INTO inventory VALUES(3, 'apple', 100)")
	puts 'Inserted 3 rows of data.'

rescue PG::Error => e
    puts e.message 
    
ensure
    connection.close if connection
end
```

## Read data
Use the following code to connect and read the data using a **SELECT** SQL statement. 

The code uses a  [PG::Connection](http://www.rubydoc.info/gems/pg/PG/Connection) object with constructor [new()](http://www.rubydoc.info/gems/pg/PG%2FConnection:initialize) to connect to Azure Database for PostgreSQL. Then it calls method [exec()](http://www.rubydoc.info/gems/pg/PG/Connection#exec-instance_method) to run the SELECT command, keeping the results in a result set. The result set collection is iterated over using the `resultSet.each do` loop, keeping the current row values in the `row` variable. The code checks for errors using the [PG::Error](http://www.rubydoc.info/gems/pg/PG/Error) class. Then it calls method [close()](http://www.rubydoc.info/gems/pg/PG/Connection#lo_close-instance_method) to close the connection before terminating.

Replace the `host`, `database`, `user`, and `password` strings with your own values. 

```ruby
require 'pg'

begin
	# Initialize connection variables.
	host = String('mypgserver-20170401.postgres.database.azure.com')
	dbname = String('postgres')
    user = String('mylogin@mypgserver-20170401')
	password = String('<server_admin_password>')

	# Initialize connection object.
    connection = PG::Connection.new(:host => host, :user => user, :dbname => dbname, :port => '5432', :password => password)
    puts 'Successfully created connection to database.'

    resultSet = connection.exec('SELECT * from inventory;')
    resultSet.each do |row|
        puts 'Data row = (%s, %s, %s)' % [row['id'], row['name'], row['quantity']]
    end

rescue PG::Error => e
    puts e.message 
    
ensure
    connection.close if connection
end
```

## Update data
Use the following code to connect and update the data using a **UPDATE** SQL statement.

The code uses a  [PG::Connection](http://www.rubydoc.info/gems/pg/PG/Connection) object with constructor [new()](http://www.rubydoc.info/gems/pg/PG%2FConnection:initialize) to connect to Azure Database for PostgreSQL. Then it calls method [exec()](http://www.rubydoc.info/gems/pg/PG/Connection#exec-instance_method) to run the UPDATE command. The code checks for errors using the [PG::Error](http://www.rubydoc.info/gems/pg/PG/Error) class. Then it calls method [close()](http://www.rubydoc.info/gems/pg/PG/Connection#lo_close-instance_method) to close the connection before terminating.

Replace the `host`, `database`, `user`, and `password` strings with your own values. 

```ruby
require 'pg'

begin
	# Initialize connection variables.
	host = String('mypgserver-20170401.postgres.database.azure.com')
	dbname = String('postgres')
    user = String('mylogin@mypgserver-20170401')
	password = String('<server_admin_password>')

	# Initialize connection object.
    connection = PG::Connection.new(:host => host, :user => user, :dbname => dbname, :port => '5432', :password => password)
    puts 'Successfully created connection to database.'

    # Modify some data in table.
    connection.exec('UPDATE inventory SET quantity = %d WHERE name = %s;' % [200, '\'banana\''])
    puts 'Updated 1 row of data.'

rescue PG::Error => e
    puts e.message 
    
ensure
    connection.close if connection
end
```


## Delete data
Use the following code to connect and read the data using a **DELETE** SQL statement. 

The code uses a  [PG::Connection](http://www.rubydoc.info/gems/pg/PG/Connection) object with constructor [new()](http://www.rubydoc.info/gems/pg/PG%2FConnection:initialize) to connect to Azure Database for PostgreSQL. Then it calls method [exec()](http://www.rubydoc.info/gems/pg/PG/Connection#exec-instance_method) to run the UPDATE command. The code checks for errors using the [PG::Error](http://www.rubydoc.info/gems/pg/PG/Error) class. Then it calls method [close()](http://www.rubydoc.info/gems/pg/PG/Connection#lo_close-instance_method) to close the connection before terminating.

Replace the `host`, `database`, `user`, and `password` strings with your own values. 

```ruby
require 'pg'

begin
	# Initialize connection variables.
	host = String('mypgserver-20170401.postgres.database.azure.com')
	dbname = String('postgres')
    user = String('mylogin@mypgserver-20170401')
	password = String('<server_admin_password>')

	# Initialize connection object.
    connection = PG::Connection.new(:host => host, :user => user, :dbname => dbname, :port => '5432', :password => password)
    puts 'Successfully created connection to database.'

    # Modify some data in table.
    connection.exec('DELETE FROM inventory WHERE name = %s;' % ['\'orange\''])
    puts 'Deleted 1 row of data.'

rescue PG::Error => e
    puts e.message 
    
ensure
    connection.close if connection
end
```

## Next steps
> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./howto-migrate-using-export-and-import.md)
