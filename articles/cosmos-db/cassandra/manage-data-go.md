---
title: Build a Go app with Azure Cosmos DB for Apache Cassandra using the gocql client
description: This quickstart shows how to use a Go client to interact with Azure Cosmos DB for Apache Cassandra
ms.service: cosmos-db
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.subservice: apache-cassandra
ms.devlang: golang
ms.topic: quickstart
ms.date: 07/14/2020
ms.custom: mode-api, ignite-2022, devx-track-go
---

# Quickstart: Build a Go app with the `gocql` client to manage Azure Cosmos DB for Apache Cassandra data
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

> [!div class="op_single_selector"]
> * [.NET](manage-data-dotnet.md)
> * [.NET Core](manage-data-dotnet-core.md)
> * [Java v3](manage-data-java.md)
> * [Java v4](manage-data-java-v4-sdk.md)
> * [Node.js](manage-data-nodejs.md)
> * [Python](manage-data-python.md)
> * [Golang](manage-data-go.md)
>  

Azure Cosmos DB is a multi-model database service that lets you quickly create and query document, table, key-value, and graph databases with global distribution and horizontal scale capabilities. In this quickstart, you will start by creating an Azure Cosmos DB for Apache Cassandra account. You will then run a Go application to create a Cassandra keyspace, table, and execute a few operations. This Go app uses [gocql](https://github.com/gocql/gocql), which is a Cassandra client for the Go language. 

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=cassandrago-docs-abhishgu). Or [try Azure Cosmos DB for free](https://azure.microsoft.com/try/cosmosdb/?WT.mc_id=cassandrago-docs-abhishgu) without an Azure subscription.
- [Go](https://go.dev/) installed on your computer, and a working knowledge of Go.
- [Git](https://git-scm.com/downloads).

## Create a database account

Before you can create a database, you need to create a Cassandra account with Azure Cosmos DB.

[!INCLUDE [cosmos-db-create-dbaccount-cassandra](../includes/cosmos-db-create-dbaccount-cassandra.md)]

## Clone the sample application

Start by cloning the application from GitHub.

1. Open a command prompt and create a new folder named `git-samples`.

    ```bash
    md "C:\git-samples"
    ```

2. Open a git terminal window, such as git bash. Use the `cd` command to change into the new folder and install the sample app.

    ```bash
    cd "C:\git-samples"
    ```

3. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/Azure-Samples/azure-cosmos-db-cassandra-go-getting-started.git
    ```

## Review the code

This step is optional. If you're interested to learn how the code creates the database resources, you can review the following code snippets. Otherwise, you can skip ahead to [Run the application](#run-the-application)

The `GetSession` function (part of `utils\utils.go`) returns a [`*gocql.Session`](https://godoc.org/github.com/gocql/gocql#Session) that is used to execute cluster operations such as insert, find etc.

```go
func GetSession(cosmosCassandraContactPoint, cosmosCassandraPort, cosmosCassandraUser, cosmosCassandraPassword string) *gocql.Session {
    clusterConfig := gocql.NewCluster(cosmosCassandraContactPoint)
    port, err := strconv.Atoi(cosmosCassandraPort)
    
    clusterConfig.Authenticator = gocql.PasswordAuthenticator{Username: cosmosCassandraUser, Password: cosmosCassandraPassword}
    clusterConfig.Port = port
    clusterConfig.SslOpts = &gocql.SslOptions{Config: &tls.Config{MinVersion: tls.VersionTLS12}}
    clusterConfig.ProtoVersion = 4
    
    session, err := clusterConfig.CreateSession()
    ...
    return session
}
```

The Azure Cosmos DB Cassandra host is passed to the [`gocql.NewCluster`](https://godoc.org/github.com/gocql/gocql#NewCluster) function to get a [`*gocql.ClusterConfig`](https://godoc.org/github.com/gocql/gocql#ClusterConfig) struct that is then configured to use the username, password, port, and appropriate TLS version ([HTTPS/SSL/TLS encryption Security requirement](../database-security.md?WT.mc_id=cassandrago-docs-abhishgu#how-does-azure-cosmos-db-secure-my-database))

The `GetSession` function is then called from the `main` function (`main.go`).

```go
func main() {
    session := utils.GetSession(cosmosCassandraContactPoint, cosmosCassandraPort, cosmosCassandraUser, cosmosCassandraPassword)
    defer session.Close()
    ...
}
```

The connectivity information and credentials are accepted in the form of environment variables (resolved in the `init` method)

```go
func init() {
    cosmosCassandraContactPoint = os.Getenv("COSMOSDB_CASSANDRA_CONTACT_POINT")
    cosmosCassandraPort = os.Getenv("COSMOSDB_CASSANDRA_PORT")
    cosmosCassandraUser = os.Getenv("COSMOSDB_CASSANDRA_USER")
    cosmosCassandraPassword = os.Getenv("COSMOSDB_CASSANDRA_PASSWORD")

    if cosmosCassandraContactPoint == "" || cosmosCassandraUser == "" || cosmosCassandraPassword == "" {
        log.Fatal("missing mandatory environment variables")
    }
}
```

It is then used to execute various operations (part of `operations\setup.go`) on Azure Cosmos DB starting with `keyspace` and `table` creation.

As the name suggests, the `DropKeySpaceIfExists` function  drops the `keyspace` only if it exists.

```go
const dropKeyspace = "DROP KEYSPACE IF EXISTS %s"

func DropKeySpaceIfExists(keyspace string, session *gocql.Session) {
    err := utils.ExecuteQuery(fmt.Sprintf(dropKeyspace, keyspace), session)
    if err != nil {
        log.Fatal("Failed to drop keyspace", err)
    }
    log.Println("Keyspace dropped")
}
```

`CreateKeySpace` function is used to create the `keyspace` (`user_profile`)

```go
const createKeyspace = "CREATE KEYSPACE %s WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 1 }"

func CreateKeySpace(keyspace string, session *gocql.Session) {
    err := utils.ExecuteQuery(fmt.Sprintf(createKeyspace, keyspace), session)
    if err != nil {
        log.Fatal("Failed to create keyspace", err)
    }
    log.Println("Keyspace created")
}
```

This is followed by table creation (`user`) which is taken care of `CreateUserTable` function

```go
const createTable = "CREATE TABLE %s.%s (user_id int PRIMARY KEY, user_name text, user_bcity text)"

func CreateUserTable(keyspace, table string, session *gocql.Session) {
    err := session.Query(fmt.Sprintf(createTable, keyspace, table)).Exec()
    if err != nil {
        log.Fatal("failed to create table ", err)
    }
    log.Println("Table created")
}
```

Once the keyspace and table are created, we invoke CRUD operations (part of `operations\crud.go`). 

`InsertUser` is used to create a `User`. It sets the user info (ID, name, and city) as the query arguments using [`Bind`](https://godoc.org/github.com/gocql/gocql#Query.Bind)

```go
const createQuery = "INSERT INTO %s.%s (user_id, user_name , user_bcity) VALUES (?,?,?)"

func InsertUser(keyspace, table string, session *gocql.Session, user model.User) {
    err := session.Query(fmt.Sprintf(createQuery, keyspace, table)).Bind(user.ID, user.Name, user.City).Exec()
    if err != nil {
        log.Fatal("Failed to create user", err)
    }
    log.Println("User created")
}
```

`FindUser` is used to search for a user (`model\user.go`) using a specific user ID while [`Scan`](https://godoc.org/github.com/gocql/gocql#Iter.Scan) binds the user attributes (returned by Cassandra) to individual variables (`userid`, `name`, `city`) -it is just one of the ways in which you can use the result obtained as the search query result

```go
const selectQuery = "SELECT * FROM %s.%s where user_id = ?"

func FindUser(keyspace, table string, id int, session *gocql.Session) model.User {
    var userid int
    var name, city string
    err := session.Query(fmt.Sprintf(selectQuery, keyspace, table)).Bind(id).Scan(&userid, &name, &city)

    if err != nil {
        if err == gocql.ErrNotFound {
            log.Printf("User with id %v does not exist\n", id)
        } else {
            log.Printf("Failed to find user with id %v - %v\n", id, err)
        }
    }
    return model.User{ID: userid, Name: name, City: city}
}
```

`FindAllUsers` is used to fetch all the users. [`SliceMap`](https://godoc.org/github.com/gocql/gocql#Iter.SliceMap) is used as a shorthand to get all the user's info in the form of a slice of `map`s. Think of each `map` as key-value pairs where column name (for example, `user_id`) is the key along with its respective value.

```go
const findAllUsersQuery = "SELECT * FROM %s.%s"

func FindAllUsers(keyspace, table string, session *gocql.Session) []model.User {
    var users []model.User
    results, _ := session.Query(fmt.Sprintf(findAllUsersQuery, keyspace, table)).Iter().SliceMap()

    for _, u := range results {
        users = append(users, mapToUser(u))
    }
    return users
}
```

Each `map` of user info is converted to a `User` using `mapToUser` function that simply extracts the value from its respective column and uses it to create an instance of the `User` struct

```go
func mapToUser(m map[string]interface{}) model.User {
    id, _ := m["user_id"].(int)
    name, _ := m["user_name"].(string)
    city, _ := m["user_bcity"].(string)

    return model.User{ID: id, Name: name, City: city}
}
```

## Run the application

As previously mentioned, the application accepts connectivity and credentials in the form the environment variables. 

1. In your Azure Cosmos DB account in the [Azure portal](https://portal.azure.com/), select **Connection String**. 

    :::image type="content" source="./media/manage-data-go/copy-username-connection-string-azure-portal.png" alt-text="View and copy details from the Connection String page in Azure portal":::

Copy the values for the following attributes (`CONTACT POINT`, `PORT`, `USERNAME` and `PRIMARY PASSWORD`) and set them to the respective environment variables

```shell
set COSMOSDB_CASSANDRA_CONTACT_POINT=<value for "CONTACT POINT">
set COSMOSDB_CASSANDRA_PORT=<value for "PORT">
set COSMOSDB_CASSANDRA_USER=<value for "USERNAME">
set COSMOSDB_CASSANDRA_PASSWORD=<value for "PRIMARY PASSWORD">
```

In the terminal window, change to the correct folder. For example:

```shell
cd "C:\git-samples\azure-cosmosdb-cassandra-go-getting-started"
```

2. In the terminal, run the following command to start the application.

```shell
go run main.go
```

3. The terminal window displays notifications for the various operations including keyspace and table setup, user creation etc.

4. In the Azure portal, open **Data Explorer** to query, modify, and work with this new data. 

    :::image type="content" source="./media/manage-data-go/view-data-explorer-go-app.png" alt-text="View the data in Data Explorer - Azure Cosmos DB":::

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../includes/cosmos-db-tutorial-review-slas.md)]

## Clean up resources

[!INCLUDE [cosmosdb-delete-resource-group](../includes/cosmos-db-delete-resource-group.md)]

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB account with API for Cassandra, and run a  Go app that creates a Cassandra database and container. You can now import additional data into your Azure Cosmos DB account. 

> [!div class="nextstepaction"]
> [Import Cassandra data into Azure Cosmos DB](migrate-data.md)
