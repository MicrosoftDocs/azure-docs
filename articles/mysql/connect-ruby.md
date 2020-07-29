---
title: 'Connect using Ruby - Azure Database for MySQL'
description: This quickstart provides several Ruby code samples you can use to connect and query data from Azure Database for MySQL.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.custom: mvc
ms.devlang: ruby
ms.topic: quickstart
ms.date: 5/26/2020
---

# Azure Database for MySQL: Use Ruby to connect and query data
This quickstart demonstrates how to connect to an Azure Database for MySQL using a [Ruby](https://www.ruby-lang.org) application and the [mysql2](https://rubygems.org/gems/mysql2) gem from Windows, Ubuntu Linux, and Mac platforms. It shows how to use SQL statements to query, insert, update, and delete data in the database. This topic assumes that you are familiar with development using Ruby and that you are new to working with Azure Database for MySQL.

## Prerequisites
This quickstart uses the resources created in either of these guides as a starting point:
- [Create an Azure Database for MySQL server using Azure portal](./quickstart-create-mysql-server-database-using-azure-portal.md)
- [Create an Azure Database for MySQL server using Azure CLI](./quickstart-create-mysql-server-database-using-azure-cli.md)

> [!IMPORTANT] 
> Ensure the IP address you're connecting from has been added the server's firewall rules using the [Azure portal](./howto-manage-firewall-using-portal.md) or [Azure CLI](./howto-manage-firewall-using-cli.md)

## Install Ruby
Install Ruby, Gem, and the MySQL2 library on your own computer. 

### Windows
1. Download and Install the 2.3 version of [Ruby](https://rubyinstaller.org/downloads/).
2. Launch a new command prompt (cmd) from the Start menu.
3. Change directory into the Ruby directory for version 2.3. `cd c:\Ruby23-x64\bin`
4. Test the Ruby installation by running the command `ruby -v` to see the version installed.
5. Test the Gem installation by running the command `gem -v` to see the version installed.
6. Build the Mysql2 module for Ruby using Gem by running the command `gem install mysql2`.

### MacOS
1. Install Ruby using Homebrew by running the command `brew install ruby`. For more installation options, see the Ruby [installation documentation](https://www.ruby-lang.org/en/documentation/installation/#homebrew).
2. Test the Ruby installation by running the command `ruby -v` to see the version installed.
3. Test the Gem installation by running the command `gem -v` to see the version installed.
4. Build the Mysql2 module for Ruby using Gem by running the command `gem install mysql2`.

### Linux (Ubuntu)
1. Install Ruby by running the command `sudo apt-get install ruby-full`. For more installation options, see the Ruby [installation documentation](https://www.ruby-lang.org/en/documentation/installation/).
2. Test the Ruby installation by running the command `ruby -v` to see the version installed.
3. Install the latest updates for Gem by running the command `sudo gem update --system`.
4. Test the Gem installation by running the command `gem -v` to see the version installed.
5. Install the gcc, make, and other build tools by running the command `sudo apt-get install build-essential`.
6. Install the MySQL client developer libraries by running the command `sudo apt-get install libmysqlclient-dev`.
7. Build the mysql2 module for Ruby using Gem by running the command `sudo gem install mysql2`.

## Get connection information
Get the connection information needed to connect to the Azure Database for MySQL. You need the fully qualified server name and login credentials.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, click **All resources**, and then search for the server you have created (such as **mydemoserver**).
3. Click the server name.
4. From the server's **Overview** panel, make a note of the **Server name** and **Server admin login name**. If you forget your password, you can also reset the password from this panel.
 ![Azure Database for MySQL server name](./media/connect-ruby/1_server-overview-name-login.png)

## Run Ruby code 
1. Paste the Ruby code from the sections below into text files, and then save the files into a project folder with file extension .rb (such as `C:\rubymysql\createtable.rb` or `/home/username/rubymysql/createtable.rb`).
2. To run the code, launch the command prompt or Bash shell. Change directory into your project folder `cd rubymysql`
3. Then type the Ruby command followed by the file name, such as `ruby createtable.rb` to run the application.
4. On the Windows OS, if the Ruby application is not in your path environment variable, you may need to use the full path to launch the node application, such as `"c:\Ruby23-x64\bin\ruby.exe" createtable.rb`

## Connect and create a table
Use the following code to connect and create a table by using **CREATE TABLE** SQL statement, followed by **INSERT INTO** SQL statements to add rows into the table.

The code uses a [mysql2::client](https://www.rubydoc.info/gems/mysql2/0.4.8) class .new() method to connect to Azure Database for MySQL. Then it calls method [query()](https://www.rubydoc.info/gems/mysql2/0.4.8#Usage) several times to run the DROP, CREATE TABLE, and INSERT INTO commands. Then it calls method [close()](https://www.rubydoc.info/gems/mysql2/0.4.8/Mysql2/Client#close-instance_method) to close the connection before terminating.

Replace the `host`, `database`, `username`, and `password` strings with your own values. 
```ruby
require 'mysql2'

begin
	# Initialize connection variables.
	host = String('mydemoserver.mysql.database.azure.com')
	database = String('quickstartdb')
    username = String('myadmin@mydemoserver')
	password = String('yourpassword')

	# Initialize connection object.
    client = Mysql2::Client.new(:host => host, :username => username, :database => database, :password => password)
    puts 'Successfully created connection to database.'

    # Drop previous table of same name if one exists
    client.query('DROP TABLE IF EXISTS inventory;')
    puts 'Finished dropping table (if existed).'

    # Drop previous table of same name if one exists.
    client.query('CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);')
    puts 'Finished creating table.'

    # Insert some data into table.
    client.query("INSERT INTO inventory VALUES(1, 'banana', 150)")
    client.query("INSERT INTO inventory VALUES(2, 'orange', 154)")
    client.query("INSERT INTO inventory VALUES(3, 'apple', 100)")
    puts 'Inserted 3 rows of data.'

# Error handling
rescue Exception => e
    puts e.message

# Cleanup
ensure
    client.close if client
    puts 'Done.'
end
```

## Read data
Use the following code to connect and read the data by using a **SELECT** SQL statement. 

The code uses a [mysql2::client](https://www.rubydoc.info/gems/mysql2/0.4.8) class.new() method to connect to Azure Database for MySQL. Then it calls method [query()](https://www.rubydoc.info/gems/mysql2/0.4.8#Usage) to run the SELECT commands. Then it calls method [close()](https://www.rubydoc.info/gems/mysql2/0.4.8/Mysql2/Client#close-instance_method) to close the connection before terminating.

Replace the `host`, `database`, `username`, and `password` strings with your own values. 

```ruby
require 'mysql2'

begin
	# Initialize connection variables.
	host = String('mydemoserver.mysql.database.azure.com')
	database = String('quickstartdb')
    username = String('myadmin@mydemoserver')
	password = String('yourpassword')

	# Initialize connection object.
    client = Mysql2::Client.new(:host => host, :username => username, :database => database, :password => password)
    puts 'Successfully created connection to database.'

    # Read data
    resultSet = client.query('SELECT * from inventory;')
    resultSet.each do |row|
        puts 'Data row = (%s, %s, %s)' % [row['id'], row['name'], row['quantity']]
    end
    puts 'Read ' + resultSet.count.to_s + ' row(s).'

# Error handling
rescue Exception => e
    puts e.message

# Cleanup
ensure
    client.close if client
    puts 'Done.'
end
```

## Update data
Use the following code to connect and update the data by using an **UPDATE** SQL statement.

The code uses a [mysql2::client](https://www.rubydoc.info/gems/mysql2/0.4.8) class .new() method to connect to Azure Database for MySQL. Then it calls method [query()](https://www.rubydoc.info/gems/mysql2/0.4.8#Usage) to run the UPDATE commands. Then it calls method [close()](https://www.rubydoc.info/gems/mysql2/0.4.8/Mysql2/Client#close-instance_method) to close the connection before terminating.

Replace the `host`, `database`, `username`, and `password` strings with your own values. 

```ruby
require 'mysql2'

begin
	# Initialize connection variables.
	host = String('mydemoserver.mysql.database.azure.com')
	database = String('quickstartdb')
    username = String('myadmin@mydemoserver')
	password = String('yourpassword')

	# Initialize connection object.
    client = Mysql2::Client.new(:host => host, :username => username, :database => database, :password => password)
    puts 'Successfully created connection to database.'

    # Update data
   client.query('UPDATE inventory SET quantity = %d WHERE name = %s;' % [200, '\'banana\''])
   puts 'Updated 1 row of data.'

# Error handling
rescue Exception => e
    puts e.message

# Cleanup
ensure
    client.close if client
    puts 'Done.'
end
```


## Delete data
Use the following code to connect and read the data by using a **DELETE** SQL statement. 

The code uses a [mysql2::client](https://www.rubydoc.info/gems/mysql2/0.4.8) class .new() method to connect to Azure Database for MySQL. Then it calls method [query()](https://www.rubydoc.info/gems/mysql2/0.4.8#Usage) to run the DELETE commands. Then it calls method [close()](https://www.rubydoc.info/gems/mysql2/0.4.8/Mysql2/Client#close-instance_method) to close the connection before terminating.

Replace the `host`, `database`, `username`, and `password` strings with your own values. 

```ruby
require 'mysql2'

begin
	# Initialize connection variables.
	host = String('mydemoserver.mysql.database.azure.com')
	database = String('quickstartdb')
    username = String('myadmin@mydemoserver')
	password = String('yourpassword')

	# Initialize connection object.
    client = Mysql2::Client.new(:host => host, :username => username, :database => database, :password => password)
    puts 'Successfully created connection to database.'

    # Delete data
    resultSet = client.query('DELETE FROM inventory WHERE name = %s;' % ['\'orange\''])
    puts 'Deleted 1 row.'

# Error handling
rescue Exception => e
    puts e.message

# Cleanup
ensure
    client.close if client
    puts 'Done.'
end
```

## Next steps
> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./concepts-migrate-import-export.md)
