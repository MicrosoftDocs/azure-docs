---
title: Azure Cosmos DB: Build a MongoDB API console app with Golang and the Azure portal | Microsoft Docs
description: Presents a Golang code sample you can use to connect to and query Azure Cosmos DB
services: cosmosdb
documentationcenter: ''
author: durgaprasad
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: cosmosdb
ms.custom: quick start connect
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: golang
ms.topic: hero-article
ms.date: 06/12/2017
ms.author: mimig

---

# Azure Cosmos DB: Build a MongoDB API console app with Golang and the Azure portal

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB.

This quick-start demonstrates how to use an existing [MongoDB](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-introduction) app written in [Golang](https://golang.org/) and connect it to your Azure Cosmos DB database, which supports MongoDB client connections.

In other words, your Golang application only knows that it’s connecting to a database using MongoDB APIs. It is transparent to the application that the data is stored in Azure Cosmos DB.

### Prerequisites

1.  Basic knowledge of [GO](https://golang.org/) language.
2.  Azure subscription. If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
3.  IDE — [Gogland](https://www.jetbrains.com/go/) by Jetbrains or [Visual Studio Code](https://code.visualstudio.com/) by Microsoft or [Atom](https://atom.io/).

<a id="create-account"></a>
## Create a database account

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/cosmos-db-create-dbaccount-mongodb.md)]

7. Click **Quick start** in the left navigation menu, and then click **Other** to get the connection string information required by client applications.

![Quick start pane, Other tab in the Azure portal showing the connection string information](./media/create-mongodb-golang/cosmos-db-golang-connection-string.png)

### Setting up your application

It’s time to play with the code. Open your favorite editor (Gogland, Visual Studio Code,
or Atom). In this article, I use Gogland editor.

1.  Create folder CosmosDBAcces folder inside GOROOT\src folder.
2.  Run below command to get the mgo package.

    ```
    go get gopkg.in/mgo.v2
    ```
### Connect to an Azure Cosmos DB account

The [mgo](http://labix.org/mgo) driver (pronounced as *mango*) is a [MongoDB](http://www.mongodb.org/) driver for the [Go language](http://golang.org/) that implements a rich and well tested selection of features under a very simple API following standard Go idioms.

Azure Cosmos DB supports the SSL-enabled MongoDB. To connect to an SSL-enabled MongoDB, you need to define the **DialServer** function in [mgo.DialInfo](http://gopkg.in/mgo.v2#DialInfo), and make use of the [tls.*Dial*](http://golang.org/pkg/crypto/tls#Dial) function to perform the connection.

The following Golang code snippet connects the Go app with Azure Cosmos DB MongoDB API. The *DialInfo* class holds options for establishing a session with a MongoDB cluster.

```go
// DialInfo holds options for establishing a session with a MongoDB cluster.
dialInfo := &mgo.DialInfo{
    Addrs:    []string{"golang-couch.documents.azure.com:10255"}, // Get HOST + PORT
    Timeout:  60 * time.Second,
    Database: "golang-coach", // It can be anything
    Username: "golang-coach", // Username
    Password: "Azure database connect password from Azure Portal", // PASSWORD
    DialServer: func(addr *mgo.ServerAddr) (net.Conn, error) {
        return tls.Dial("tcp", addr.String(), &tls.Config{})
    },
}

// Create a session which maintains a pool of socket connections
// to our Azure Cosmos DB MongoDB database.
session, err := mgo.DialWithInfo(dialInfo)

if err != nil {
    fmt.Printf("Can't connect to mongo, go error %v\n", err)
    os.Exit(1)
}

defer session.Close()

// SetSafe changes the session safety mode.
// If the safe parameter is nil, the session is put in unsafe mode, 
// and writes become fire-and-forget,
// without error checking. The unsafe mode is faster since operations won't hold on waiting for a confirmation.
// 
session.SetSafe(&mgo.Safe{})
```

The **mgo.Dial()** method is used when there is no SSL connection. For an SSL connection, the **mgo.DialWithInfo()** method is required.

An instance of the **DialWIthInfo{}** object is used to create the session object. Once the session is established, you can access the collection by using the following code snippet:

```go
   collection := session.DB(“golang-couch”).C(“package”)
```

### CRUD Operations

#### 1. Create Document

```go
// Model
type Package struct {
    Id bson.ObjectId  `bson:"_id,omitempty"`
    FullName      string
    Description   string
    StarsCount    int
    ForksCount    int
    LastUpdatedBy string
}

// insert Document in collection
err = collection.Insert(&Package{
    FullName:"react",
    Description:"A framework for building native apps with React.",
    ForksCount: 11392,
    StarsCount:48794,
    LastUpdatedBy:"shergin",

})

if err != nil {
    log.Fatal("Problem inserting data: ", err)
    return
}
```

#### 2. Query/Read Document

Azure Cosmos DB supports rich queries against JSON documents stored in each collection. The following sample code shows a query that you can run against the documents in your collection.

```go
// Get a Document from the collection
result := Package{}
err = collection.Find(bson.M{"fullname": "react"}).One(&result)
if err != nil {
    log.Fatal("Error finding record: ", err)
    return
}

fmt.Println("Description:", result.Description)
```


#### 3. Update Document

```go
// Update a document
updateQuery := bson.M{"_id": result.Id}
change := bson.M{"$set": bson.M{"fullname": "react-native"}}
err = collection.Update(updateQuery, change)
if err != nil {
    log.Fatal("Error updating record: ", err)
    return
}
```

#### 4. Delete Document

Azure Cosmos DB supports deleting JSON documents.

```go
// Delete a document
query := bson.M{"_id": result.Id}
err = collection.Remove(query)
if err != nil {
    log.Fatal("Error deleting record: ", err)
    return
}
```

### Get the complete Golang tutorial solution

The entire source code at for this quickstart is provided on [GitHub](https://github.com/Golang-Coach/Lessons/tree/master/CosmosDBAccess).

### Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account and run a Golang app using the API for MongoDB. You can now import additional data to your Cosmos DB account. 

> [!div class="nextstepaction"]
> [Import data into Azure Cosmos DB for the MongoDB API](mongodb-migrate.md)
