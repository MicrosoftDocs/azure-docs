---
title: Connect to Azure Database for PostgreSQL using Go language | Microsoft Docs
description: This quickstart provides a Go programming language sample you can use to connect and query data from Azure Database for PostgreSQL.
services: postgresql
author: jasonwhowell
ms.author: jasonh
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql-database
ms.custom: mvc
ms.devlang: NA
ms.topic: hero-article
ms.date: 06/29/2017
---

# Azure Database for MySQL: Use PHP to connect and query data
This quickstart demonstrates how to connect to an Azure Database for PostgreSQL using code written in the [Go](https://golang.org/) language. It shows how to use SQL statements to query, insert, update, and delete data in the database. This article assumes you are familiar with development using Go, but that you are new to working with Azure Database for PostgreSQL.

## Prerequisites
This quickstart uses the resources created in either of these guides as a starting point:
- [Create DB - Portal](quickstart-create-server-database-portal.md)
- [Create DB - Azure CLI](quickstart-create-server-database-azure-cli.md)

## Install Go and pq
- Download and install Go according to the [installation instructions](https://golang.org/doc/install) for matching your platform.
- Make a folder for your project such as C:\Postgresql\. Using the command line, change directory into the project folder, such as `cd C:\Postgres\`.
- Download the [Pure Go Postgres driver (pq)](https://github.com/lib/pq) into your project folder by typing the command `go get github.com/lib/pq` while in same directory.

## Build and run Go code 
- Save the code into a text file with extension *.go, and save it in your project folder, such as `C:\postgres\read.go`.
- To run the code, change directory into your project folder `cd postgres`, then type the command `go run read.go` to compile the application and run it.
- To build the code into a native application, `go build read.go`, then launch read.exe to run the application.

## Get connection information
Get the connection information needed to connect to the Azure Database for PostgreSQL. You need the fully qualified server name and login credentials.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, click **All resources** and search for the server you have created, such as **mypgserver-20170401**.
3. Click the server name **mypgserver-20170401**.
4. Select the server's **Overview** page. Make a note of the **Server name** and **Server admin login name**.
 ![Azure Database for PostgreSQL - Server Admin Login](./media/connect-go/1-connection-string.png)
5. If you forget your server login information, navigate to the **Overview** page, and view the Server admin login name. If necessary, reset the password.

## Connect and create a table
Use the following code to connect and create a table using **CREATE TABLE** SQL statement, followed by **INSERT INTO** SQL statements to add rows into the table.

The code imports three packages: the [sql package](https://golang.org/pkg/database/sql/), the [pq package](http://godoc.org/github.com/lib/pq) as a driver to communicate with the Postgres server, and the [fmt package](https://golang.org/pkg/fmt/) for printed input and output on the command line.

The code calls method [sql.Open()](http://godoc.org/github.com/lib/pq#Open) to connect to Azure Database for PostgreSQL, and checks the connection using method [db.Ping()](https://golang.org/pkg/database/sql/#DB.Ping). A [database handle](https://golang.org/pkg/database/sql/#DB) is used throughout, holding the connection pool for the database server. The code calls the [Exec()](https://golang.org/pkg/database/sql/#DB.Exec) method several times to run several SQL commands. Each time a custom checkError() method to check if an error occurred and panic to exit if an error occurs.


Replace the `HOST`, `DATABASE`, `USER`, and `PASSWORD` parameters with your own values. 

```go
package main

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

const (
	// Initialize connection constants.
	HOST     = "mypgserver-20170401.postgres.database.azure.com"
	DATABASE = "mypgsqldb"
	USER     = "mylogin@mypgserver-20170401"
	PASSWORD = "<server_admin_password>"
)

func checkError(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {
	// Initialize connection string.
	var connectionString string = fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=require", HOST, USER, PASSWORD, DATABASE)

	// Initialize connection object.
	db, err := sql.Open("postgres", connectionString)
	checkError(err)

	err = db.Ping()
	checkError(err)
	fmt.Println("Successfully created connection to database")

	// Drop previous table of same name if one exists.
	_, err = db.Exec("DROP TABLE IF EXISTS inventory;")
	checkError(err)
	fmt.Println("Finished dropping table (if existed)")

	// Create table.
	_, err = db.Exec("CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);")
	checkError(err)
	fmt.Println("Finished creating table")

	// Insert some data into table.
	sql_statement := "INSERT INTO inventory (name, quantity) VALUES ($1, $2);"
	_, err = db.Exec(sql_statement, "banana", 150)
	checkError(err)
	_, err = db.Exec(sql_statement, "orange", 154)
	checkError(err)
	_, err = db.Exec(sql_statement, "apple", 100)
	checkError(err)
	fmt.Println("Inserted 3 rows of data")
}
```

## Read data
Use the following code to connect and read the data using a **SELECT** SQL statement. 

The code imports three packages: the [sql package](https://golang.org/pkg/database/sql/), the [pq package](http://godoc.org/github.com/lib/pq) as a driver to communicate with the Postgres server, and the [fmt package](https://golang.org/pkg/fmt/) for printed input and output on the command line.

The code calls method [sql.Open()](http://godoc.org/github.com/lib/pq#Open) to connect to Azure Database for PostgreSQL, and checks the connection using method [db.Ping()](https://golang.org/pkg/database/sql/#DB.Ping). A [database handle](https://golang.org/pkg/database/sql/#DB) is used throughout, holding the connection pool for the database server. The select query is run by calling method [db.Query()](https://golang.org/pkg/database/sql/#DB.Query), and the resulting rows is kept in a variable of type 
[rows](https://golang.org/pkg/database/sql/#Rows). The code reads the column data values in the current row using method [rows.Scan()](https://golang.org/pkg/database/sql/#Rows.Scan) and loops over the rows using the iterator [rows.Next()](https://golang.org/pkg/database/sql/#Rows.Next)until no more rows exist. Each row's column values are printed to the console out. Each time a custom checkError() method to check if an error occurred and panic to exit if an error occurs.

Replace the `HOST`, `DATABASE`, `USER`, and `PASSWORD` parameters with your own values. 

```go
package main

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
)

const (
	// Initialize connection constants.
	HOST     = "mypgserver-20170401.postgres.database.azure.com"
	DATABASE = "mypgsqldb"
	USER     = "mylogin@mypgserver-20170401"
	PASSWORD = "<server_admin_password>"
)

func checkError(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {

	// Initialize connection string.
	var connectionString string = fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=require", HOST, USER, PASSWORD, DATABASE)

	// Initialize connection object.
	db, err := sql.Open("postgres", connectionString)
	checkError(err)

	err = db.Ping()
	checkError(err)
	fmt.Println("Successfully created connection to database")

	// Read rows from table.
	var id int
	var name string
	var quantity int

	sql_statement := "SELECT * from inventory;"
	rows, err := db.Query(sql_statement)
	checkError(err)

	for rows.Next() {
		switch err := rows.Scan(&id, &name, &quantity); err {
		case sql.ErrNoRows:
			fmt.Println("No rows were returned")
		case nil:
			fmt.Printf("Data row = (%d, %s, %d)\n", id, name, quantity)
		default:
			checkError(err)
		}
	}
}
```

## Update data
Use the following code to connect and update the data using a **UPDATE** SQL statement.

The code imports three packages: the [sql package](https://golang.org/pkg/database/sql/), the [pq package](http://godoc.org/github.com/lib/pq) as a driver to communicate with the Postgres server, and the [fmt package](https://golang.org/pkg/fmt/) for printed input and output on the command line.

The code calls method [sql.Open()](http://godoc.org/github.com/lib/pq#Open) to connect to Azure Database for PostgreSQL, and checks the connection using method [db.Ping()](https://golang.org/pkg/database/sql/#DB.Ping). A [database handle](https://golang.org/pkg/database/sql/#DB) is used throughout, holding the connection pool for the database server. The code calls the [Exec()](https://golang.org/pkg/database/sql/#DB.Exec) method to run the SQL statement that updates the table. A custom checkError() method to check if an error occurred and panic to exit if an error occurs.

Replace the `HOST`, `DATABASE`, `USER`, and `PASSWORD` parameters with your own values. 
```go
package main

import (
  "database/sql"
  _ "github.com/lib/pq"
  "fmt"
)

const (
	// Initialize connection constants.
	HOST     = "mypgserver-20170401.postgres.database.azure.com"
	DATABASE = "mypgsqldb"
	USER     = "mylogin@mypgserver-20170401"
	PASSWORD = "<server_admin_password>"
)

func checkError(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {
	
	// Initialize connection string.
	var connectionString string = 
		fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=require", HOST, USER, PASSWORD, DATABASE)

	// Initialize connection object.
	db, err := sql.Open("postgres", connectionString)
	checkError(err)

	err = db.Ping()
	checkError(err)
	fmt.Println("Successfully created connection to database")

	// Modify some data in table.
	sql_statement := "UPDATE inventory SET quantity = $2 WHERE name = $1;"
	_, err = db.Exec(sql_statement, "banana", 200)
	checkError(err)
	fmt.Println("Updated 1 row of data")
}
```

## Delete data
Use the following code to connect and read the data using a **DELETE** SQL statement. 

The code imports three packages: the [sql package](https://golang.org/pkg/database/sql/), the [pq package](http://godoc.org/github.com/lib/pq) as a driver to communicate with the Postgres server, and the [fmt package](https://golang.org/pkg/fmt/) for printed input and output on the command line.

The code calls method [sql.Open()](http://godoc.org/github.com/lib/pq#Open) to connect to Azure Database for PostgreSQL, and checks the connection using method [db.Ping()](https://golang.org/pkg/database/sql/#DB.Ping). A [database handle](https://golang.org/pkg/database/sql/#DB) is used throughout, holding the connection pool for the database server. The code calls the [Exec()](https://golang.org/pkg/database/sql/#DB.Exec) method to run the SQL statement that updates the table. A custom checkError() method to check if an error occurred and panic to exit if an error occurs.

Replace the `HOST`, `DATABASE`, `USER`, and `PASSWORD` parameters with your own values. 
```go
package main

import (
  "database/sql"
  _ "github.com/lib/pq"
  "fmt"
)

const (
	// Initialize connection constants.
	HOST     = "mypgserver-20170401.postgres.database.azure.com"
	DATABASE = "mypgsqldb"
	USER     = "mylogin@mypgserver-20170401"
	PASSWORD = "<server_admin_password>"
)

func checkError(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {
	
	// Initialize connection string.
	var connectionString string = 
		fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=require", HOST, USER, PASSWORD, DATABASE)

	// Initialize connection object.
	db, err := sql.Open("postgres", connectionString)
	checkError(err)

	err = db.Ping()
	checkError(err)
	fmt.Println("Successfully created connection to database")

	// Delete some data from table.
	sql_statement := "DELETE FROM inventory WHERE name = $1;"
	_, err = db.Exec(sql_statement, "orange")
	checkError(err)
	fmt.Println("Deleted 1 row of data")
}
```

## Next steps
> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./howto-migrate-using-export-and-import.md)
