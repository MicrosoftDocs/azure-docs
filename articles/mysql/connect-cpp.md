---
title: 'Quickstart: Connect using C++ - Azure Database for MySQL'
description: This quickstart provides a C++ code sample you can use to connect and query data from Azure Database for MySQL.
author: savjani
ms.author: pariks
ms.service: mysql
ms.custom: mvc
ms.devlang: cpp
ms.topic: quickstart
ms.date: 5/26/2020
---

# Quickstart: Use Connector/C++ to connect and query data in Azure Database for MySQL

This quickstart demonstrates how to connect to an Azure Database for MySQL by using a C++ application. It shows how to use SQL statements to query, insert, update, and delete data in the database. This topic assumes you're familiar with developing using C++ and you're new to working with Azure Database for MySQL.

## Prerequisites

This quickstart uses the resources created in either of the following guides as a starting point:
- [Create an Azure Database for MySQL server using Azure portal](./quickstart-create-mysql-server-database-using-azure-portal.md)
- [Create an Azure Database for MySQL server using Azure CLI](./quickstart-create-mysql-server-database-using-azure-cli.md)

You also need to:
- Install [.NET Framework](https://dotnet.microsoft.com/download/dotnet-framework)
- Install [Visual Studio](https://www.visualstudio.com/downloads/)
- Install [MySQL Connector/C++](https://dev.mysql.com/downloads/connector/cpp/) 
- Install [Boost](https://www.boost.org/)

> [!IMPORTANT] 
> Ensure the IP address you're connecting from has been added the server's firewall rules using the [Azure portal](./howto-manage-firewall-using-portal.md) or [Azure CLI](./howto-manage-firewall-using-cli.md)

## Install Visual Studio and .NET
The steps in this section assume that you're familiar with developing using .NET.

### **Windows**
- Install Visual Studio 2019 Community. Visual Studio 2019 Community is a full featured, extensible, free IDE. With this IDE, you can create modern applications for Android, iOS, Windows, web and database applications, and cloud services. You can install either the full .NET Framework or just .NET Core: the code snippets in the Quickstart work with either. If you already have Visual Studio installed on your computer, skip the next two steps.
   1. Download the [Visual Studio 2019 installer](https://www.visualstudio.com/thank-you-downloading-visual-studio/?sku=Community&rel=15). 
   2. Run the installer and follow the installation prompts to complete the installation.

### **Configure Visual Studio**
1. From Visual Studio, Project -> Properties -> Linker -> General > Additional Library Directories, add the "\lib\opt" directory (for example: C:\Program Files (x86)\MySQL\MySQL Connector C++ 1.1.9\lib\opt) of the C++ connector.
2. From Visual Studio, Project -> Properties -> C/C++ -> General -> Additional Include Directories:
   - Add the "\include" directory of c++ connector (for example: C:\Program Files (x86)\MySQL\MySQL Connector C++ 1.1.9\include\).
   - Add the Boost library's root directory (for example: C:\boost_1_64_0\).
3. From Visual Studio, Project -> Properties -> Linker -> Input > Additional Dependencies, add **mysqlcppconn.lib** into the text field.
4. Either copy **mysqlcppconn.dll** from the C++ connector library folder in step 3 to the same directory as the application executable or add it to the environment variable so your application can find it.

## Get connection information
Get the connection information needed to connect to the Azure Database for MySQL. You need the fully qualified server name and login credentials.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, click **All resources**, and then search for the server you have created (such as **mydemoserver**).
3. Click the server name.
4. From the server's **Overview** panel, make a note of the **Server name** and **Server admin login name**. If you forget your password, you can also reset the password from this panel.
 :::image type="content" source="./media/connect-cpp/1_server-overview-name-login.png" alt-text="Azure Database for MySQL server name":::

## Connect, create table, and insert data
Use the following code to connect and load the data by using **CREATE TABLE** and **INSERT INTO** SQL statements. The code uses sql::Driver class with the connect() method to establish a connection to MySQL. Then the code uses method createStatement() and execute() to run the database commands. 

Replace the Host, DBName, User, and Password parameters. You can replace the parameters with the values that you specified when you created the server and database. 

```c++
#include <stdlib.h>
#include <iostream>
#include "stdafx.h"

#include "mysql_connection.h"
#include <cppconn/driver.h>
#include <cppconn/exception.h>
#include <cppconn/prepared_statement.h>
using namespace std;

//for demonstration only. never save your password in the code!
const string server = "tcp://yourservername.mysql.database.azure.com:3306";
const string username = "username@servername";
const string password = "yourpassword";

int main()
{
	sql::Driver *driver;
	sql::Connection *con;
	sql::Statement *stmt;
	sql::PreparedStatement *pstmt;

	try
	{
		driver = get_driver_instance();
		con = driver->connect(server, username, password);
	}
	catch (sql::SQLException e)
	{
		cout << "Could not connect to server. Error message: " << e.what() << endl;
		system("pause");
		exit(1);
	}

	//please create database "quickstartdb" ahead of time
	con->setSchema("quickstartdb");

	stmt = con->createStatement();
	stmt->execute("DROP TABLE IF EXISTS inventory");
	cout << "Finished dropping table (if existed)" << endl;
	stmt->execute("CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);");
	cout << "Finished creating table" << endl;
	delete stmt;

	pstmt = con->prepareStatement("INSERT INTO inventory(name, quantity) VALUES(?,?)");
	pstmt->setString(1, "banana");
	pstmt->setInt(2, 150);
	pstmt->execute();
	cout << "One row inserted." << endl;

	pstmt->setString(1, "orange");
	pstmt->setInt(2, 154);
	pstmt->execute();
	cout << "One row inserted." << endl;

	pstmt->setString(1, "apple");
	pstmt->setInt(2, 100);
	pstmt->execute();
	cout << "One row inserted." << endl;

	delete pstmt;
	delete con;
	system("pause");
	return 0;
}
```

## Read data

Use the following code to connect and read the data by using a **SELECT** SQL statement. The code uses sql::Driver class with the connect() method to establish a connection to MySQL. Then the code uses method prepareStatement() and executeQuery() to run the select commands. Next, the code uses next() to advance to the records in the results. Finally, the code uses getInt() and getString() to parse the values in the record.

Replace the Host, DBName, User, and Password parameters. You can replace the parameters with the values that you specified when you created the server and database. 

```c++
#include <stdlib.h>
#include <iostream>
#include "stdafx.h"

#include "mysql_connection.h"
#include <cppconn/driver.h>
#include <cppconn/exception.h>
#include <cppconn/resultset.h>
#include <cppconn/prepared_statement.h>
using namespace std;

//for demonstration only. never save your password in the code!
const string server = "tcp://yourservername.mysql.database.azure.com:3306";
const string username = "username@servername";
const string password = "yourpassword";

int main()
{
	sql::Driver *driver;
	sql::Connection *con;
	sql::PreparedStatement *pstmt;
	sql::ResultSet *result;

	try
	{
		driver = get_driver_instance();
		//for demonstration only. never save password in the code!
		con = driver->connect(server, username, password);
	}
	catch (sql::SQLException e)
	{
		cout << "Could not connect to server. Error message: " << e.what() << endl;
		system("pause");
		exit(1);
	}

	con->setSchema("quickstartdb");

	//select  
	pstmt = con->prepareStatement("SELECT * FROM inventory;");
	result = pstmt->executeQuery();

	while (result->next())
		printf("Reading from table=(%d, %s, %d)\n", result->getInt(1), result->getString(2).c_str(), result->getInt(3));

	delete result;
	delete pstmt;
	delete con;
	system("pause");
	return 0;
}
```

## Update data
Use the following code to connect and read the data by using an **UPDATE** SQL statement. The code uses sql::Driver class with the connect() method to establish a connection to MySQL. Then the code uses method prepareStatement() and executeQuery() to run the update commands. 

Replace the Host, DBName, User, and Password parameters. You can replace the parameters with the values that you specified when you created the server and database. 

```c++
#include <stdlib.h>
#include <iostream>
#include "stdafx.h"

#include "mysql_connection.h"
#include <cppconn/driver.h>
#include <cppconn/exception.h>
#include <cppconn/resultset.h>
#include <cppconn/prepared_statement.h>
using namespace std;

//for demonstration only. never save your password in the code!
const string server = "tcp://yourservername.mysql.database.azure.com:3306";
const string username = "username@servername";
const string password = "yourpassword";

int main()
{
	sql::Driver *driver;
	sql::Connection *con;
	sql::PreparedStatement *pstmt;

	try
	{
		driver = get_driver_instance();
		//for demonstration only. never save password in the code!
		con = driver->connect(server, username, password);
	}
	catch (sql::SQLException e)
	{
		cout << "Could not connect to server. Error message: " << e.what() << endl;
		system("pause");
		exit(1);
	}
	
	con->setSchema("quickstartdb");

	//update
	pstmt = con->prepareStatement("UPDATE inventory SET quantity = ? WHERE name = ?");
	pstmt->setInt(1, 200);
	pstmt->setString(2, "banana");
	pstmt->executeQuery();
	printf("Row updated\n");

	delete con;
	delete pstmt;
	system("pause");
	return 0;
}
```


## Delete data
Use the following code to connect and read the data by using a **DELETE** SQL statement. The code uses sql::Driver class with the connect() method to establish a connection to MySQL. Then the code uses method prepareStatement() and executeQuery() to run the delete commands.

Replace the Host, DBName, User, and Password parameters. You can replace the parameters with the values that you specified when you created the server and database. 

```c++
#include <stdlib.h>
#include <iostream>
#include "stdafx.h"

#include "mysql_connection.h"
#include <cppconn/driver.h>
#include <cppconn/exception.h>
#include <cppconn/resultset.h>
#include <cppconn/prepared_statement.h>
using namespace std;

//for demonstration only. never save your password in the code!
const string server = "tcp://yourservername.mysql.database.azure.com:3306";
const string username = "username@servername";
const string password = "yourpassword";

int main()
{
	sql::Driver *driver;
	sql::Connection *con;
	sql::PreparedStatement *pstmt;
	sql::ResultSet *result;

	try
	{
		driver = get_driver_instance();
		//for demonstration only. never save password in the code!
		con = driver->connect(server, username, password);
	}
	catch (sql::SQLException e)
	{
		cout << "Could not connect to server. Error message: " << e.what() << endl;
		system("pause");
		exit(1);
	}
	
	con->setSchema("quickstartdb");
		
	//delete
	pstmt = con->prepareStatement("DELETE FROM inventory WHERE name = ?");
	pstmt->setString(1, "orange");
	result = pstmt->executeQuery();
	printf("Row deleted\n");	
	
	delete pstmt;
	delete con;
	delete result;
	system("pause");
	return 0;
}
```

## Clean up resources

To clean up all resources used during this quickstart, delete the resource group using the following command:

```azurecli
az group delete \
    --name $AZ_RESOURCE_GROUP \
    --yes
```

## Next steps
> [!div class="nextstepaction"]
> [Migrate your MySQL database to Azure Database for MySQL using dump and restore](concepts-migrate-dump-restore.md)
