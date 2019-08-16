---
title: Use Go language to connect to Azure Database for PostgreSQL - Single Server
description: This quickstart provides a Go programming language sample you can use to connect and query data from Azure Database for PostgreSQL - Single Server.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.custom: mvc
ms.devlang: go
ms.topic: quickstart
ms.date: 5/6/2019
---

# Azure Database for PostgreSQL - Single Server: Use Go language to connect and query data
This quickstart demonstrates how to connect to an Azure Database for PostgreSQL using code written in the [Go](https://golang.org/) language (golang). It shows how to use SQL statements to query, insert, update, and delete data in the database. This article assumes you are familiar with development using Go, but that you are new to working with Azure Database for PostgreSQL.

## Prerequisites
This quickstart uses the resources created in either of these guides as a starting point:
- [Create DB - Portal](quickstart-create-server-database-portal.md)
- [Create DB - Azure CLI](quickstart-create-server-database-azure-cli.md)

## Install Go and pq connector
Install [Go](https://golang.org/doc/install) and the [Pure Go Postgres driver (pq)](https://github.com/lib/pq) on your own machine. Depending on your platform, follow the appropriate steps:

### Windows
1. [Download](https://golang.org/dl/) and install Go for Microsoft Windows according to the [installation instructions](https://golang.org/doc/install).
2. Launch the command prompt from the start menu.
3. Make a folder for your project, such as `mkdir  %USERPROFILE%\go\src\postgresqlgo`.
4. Change directory into the project folder, such as `cd %USERPROFILE%\go\src\postgresqlgo`.
5. Set the environment variable for GOPATH to point to the source code directory. `set GOPATH=%USERPROFILE%\go`.
6. Install the [Pure Go Postgres driver (pq)](https://github.com/lib/pq) by running the `go get github.com/lib/pq` command.

   In summary, install Go, then run these commands in the command prompt:
   ```cmd
   mkdir  %USERPROFILE%\go\src\postgresqlgo
   cd %USERPROFILE%\go\src\postgresqlgo
   set GOPATH=%USERPROFILE%\go
   go get github.com/lib/pq
   ```

### Linux (Ubuntu)
1. Launch the Bash shell. 
2. Install Go by running `sudo apt-get install golang-go`.
3. Make a folder for your project in your home directory, such as `mkdir -p ~/go/src/postgresqlgo/`.
4. Change directory into the folder, such as `cd ~/go/src/postgresqlgo/`.
5. Set the GOPATH environment variable to point to a valid source directory, such as your current home directory's go folder. At the bash shell, run `export GOPATH=~/go` to add the go directory as the GOPATH for the current shell session.
6. Install the [Pure Go Postgres driver (pq)](https://github.com/lib/pq) by running the `go get github.com/lib/pq` command.

   In summary, run these bash commands:
   ```bash
   sudo apt-get install golang-go
   mkdir -p ~/go/src/postgresqlgo/
   cd ~/go/src/postgresqlgo/
   export GOPATH=~/go/
   go get github.com/lib/pq
   ```

### Apple macOS
1. Download and install Go according to the [installation instructions](https://golang.org/doc/install)  matching your platform. 
2. Launch the Bash shell. 
3. Make a folder for your project in your home directory, such as `mkdir -p ~/go/src/postgresqlgo/`.
4. Change directory into the folder, such as `cd ~/go/src/postgresqlgo/`.
5. Set the GOPATH environment variable to point to a valid source directory, such as your current home directory's go folder. At the bash shell, run `export GOPATH=~/go` to add the go directory as the GOPATH for the current shell session.
6. Install the [Pure Go Postgres driver (pq)](https://github.com/lib/pq) by running the `go get github.com/lib/pq` command.

   In summary, install Go, then run these bash commands:
   ```bash
   mkdir -p ~/go/src/postgresqlgo/
   cd ~/go/src/postgresqlgo/
   export GOPATH=~/go/
   go get github.com/lib/pq
   ```

## Get connection information
Get the connection information needed to connect to the Azure Database for PostgreSQL. You need the fully qualified server name and login credentials.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, click **All resources**, and then search for the server you have created (such as **mydemoserver**).
3. Click the server name.
4. From the server's **Overview** panel, make a note of the **Server name** and **Server admin login name**. If you forget your password, you can also reset the password from this panel.
 ![Azure Database for PostgreSQL server name](./media/connect-go/1-connection-string.png)

## Build and run Go code 
1. To write Golang code, you can use a plain text editor, such as Notepad in Microsoft Windows, [vi](https://manpages.ubuntu.com/manpages/xenial/man1/nvi.1.html#contenttoc5) or [Nano](https://www.nano-editor.org/) in Ubuntu, or TextEdit in macOS. If you prefer a richer Interactive Development Environment (IDE) try [Gogland](https://www.jetbrains.com/go/) by Jetbrains, [Visual Studio Code](https://code.visualstudio.com/) by Microsoft, or [Atom](https://atom.io/).
2. Paste the Golang code from the following sections into text files, and save into your project folder with file extension \*.go, such as Windows path `%USERPROFILE%\go\src\postgresqlgo\createtable.go` or Linux path `~/go/src/postgresqlgo/createtable.go`.
3. Locate the `HOST`, `DATABASE`, `USER`, and `PASSWORD` constants in the code, and replace the example values with your own values.  
4. Launch the command prompt or bash shell. Change directory into your project folder. For example, on Windows `cd %USERPROFILE%\go\src\postgresqlgo\`. On Linux `cd ~/go/src/postgresqlgo/`. Some of the IDE environments mentioned offer debug and runtime capabilities without requiring shell commands.
5. Run the code by typing the command `go run createtable.go` to compile the application and run it. 
6. Alternatively, to build the code into a native application, `go build createtable.go`, then launch `createtable.exe` to run the application.

## Connect and create a table
Use the following code to connect and create a table using **CREATE TABLE** SQL statement, followed by **INSERT INTO** SQL statements to add rows into the table.

The code imports three packages: the [sql package](https://golang.org/pkg/database/sql/), the [pq package](https://godoc.org/github.com/lib/pq) as a driver to communicate with the PostgreSQL server, and the [fmt package](https://golang.org/pkg/fmt/) for printed input and output on the command line.

The code calls method [sql.Open()](https://godoc.org/github.com/lib/pq#Open) to connect to Azure Database for PostgreSQL database, and checks the connection using method [db.Ping()](https://golang.org/pkg/database/sql/#DB.Ping). A [database handle](https://golang.org/pkg/database/sql/#DB) is used throughout, holding the connection pool for the database server. The code calls the [Exec()](https://golang.org/pkg/database/sql/#DB.Exec) method several times to run several SQL commands. Each time a custom checkError() method checks if an error occurred and panic to exit if an error does occur.

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
	HOST     = "mydemoserver.postgres.database.azure.com"
	DATABASE = "mypgsqldb"
	USER     = "mylogin@mydemoserver"
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

The code imports three packages: the [sql package](https://golang.org/pkg/database/sql/), the [pq package](https://godoc.org/github.com/lib/pq) as a driver to communicate with the PostgreSQL server, and the [fmt package](https://golang.org/pkg/fmt/) for printed input and output on the command line.

The code calls method [sql.Open()](https://godoc.org/github.com/lib/pq#Open) to connect to Azure Database for PostgreSQL database, and checks the connection using method [db.Ping()](https://golang.org/pkg/database/sql/#DB.Ping). A [database handle](https://golang.org/pkg/database/sql/#DB) is used throughout, holding the connection pool for the database server. The select query is run by calling method [db.Query()](https://golang.org/pkg/database/sql/#DB.Query), and the resulting rows are kept in a variable of type 
[rows](https://golang.org/pkg/database/sql/#Rows). The code reads the column data values in the current row using method [rows.Scan()](https://golang.org/pkg/database/sql/#Rows.Scan) and loops over the rows using the iterator [rows.Next()](https://golang.org/pkg/database/sql/#Rows.Next) until no more rows exist. Each row's column values are printed to the console out. Each time a custom checkError() method is used to check if an error occurred and panic to exit if an error does occur.

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
	HOST     = "mydemoserver.postgres.database.azure.com"
	DATABASE = "mypgsqldb"
	USER     = "mylogin@mydemoserver"
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
	defer rows.Close()

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
Use the following code to connect and update the data using an **UPDATE** SQL statement.

The code imports three packages: the [sql package](https://golang.org/pkg/database/sql/), the [pq package](https://godoc.org/github.com/lib/pq) as a driver to communicate with the Postgres server, and the [fmt package](https://golang.org/pkg/fmt/) for printed input and output on the command line.

The code calls method [sql.Open()](https://godoc.org/github.com/lib/pq#Open) to connect to Azure Database for PostgreSQL database, and checks the connection using method [db.Ping()](https://golang.org/pkg/database/sql/#DB.Ping). A [database handle](https://golang.org/pkg/database/sql/#DB) is used throughout, holding the connection pool for the database server. The code calls the [Exec()](https://golang.org/pkg/database/sql/#DB.Exec) method to run the SQL statement that updates the table. A custom checkError() method is used to check if an error occurred and panic to exit if an error does occur.

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
	HOST     = "mydemoserver.postgres.database.azure.com"
	DATABASE = "mypgsqldb"
	USER     = "mylogin@mydemoserver"
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
Use the following code to connect and delete the data using a **DELETE** SQL statement. 

The code imports three packages: the [sql package](https://golang.org/pkg/database/sql/), the [pq package](https://godoc.org/github.com/lib/pq) as a driver to communicate with the Postgres server, and the [fmt package](https://golang.org/pkg/fmt/) for printed input and output on the command line.

The code calls method [sql.Open()](https://godoc.org/github.com/lib/pq#Open) to connect to Azure Database for PostgreSQL database, and checks the connection using method [db.Ping()](https://golang.org/pkg/database/sql/#DB.Ping). A [database handle](https://golang.org/pkg/database/sql/#DB) is used throughout, holding the connection pool for the database server. The code calls the [Exec()](https://golang.org/pkg/database/sql/#DB.Exec) method to run the SQL statement that deletes a row from the table. A custom checkError() method is used to check if an error occurred and panic to exit if an error does occur.

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
	HOST     = "mydemoserver.postgres.database.azure.com"
	DATABASE = "mypgsqldb"
	USER     = "mylogin@mydemoserver"
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
