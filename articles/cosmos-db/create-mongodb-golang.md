---
title: Azure Cosmos DB: Build a MongoDB API console app with Golang and the Azure portal | Microsoft Docs
description: Presents a Golang code sample you can use to connect to and query Azure Cosmos DB
services: cosmosdb
documentationcenter: ''
author: durgaprasad
manager: ''
editor: ''

ms.assetid: 
ms.service: cosmosdb
ms.custom: quick start connect
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: golang
ms.topic: hero-article
ms.date: 05/26/2017
ms.author: durgaprasad

---

# Azure Cosmos DB: Build a MongoDB API console app with Golang and the Azure portal

Azure Cosmos DB is Microsoft’s globally distributed multi-model database
service. You can quickly create and query document, key/value, and graph
databases, all of which benefit from the global distribution and horizontal
scale capabilities at the core of Azure Cosmos DB.

This quick-start demonstrates how to use an existing
[MongoDB](https://docs.microsoft.com/en-us/azure/documentdb/documentdb-protocol-mongodb)
app written in Golang and connect it to your Azure Cosmos DB database, which
supports MongoDB client connections.

In other words, your Golang application only knows that it’s connecting to a
database using MongoDB APIs. It is transparent to the application that the data
is stored in Azure Cosmos DB.

We’ll cover:

* Prerequisites for this tutorial
* Creating and connecting to an Azure Cosmos DB account
* Setting up your application
* Connect to an Azure Cosmos DB account
* CRUD Operations

### Prerequisites for the Golang tutorial

1.  Basic knowledge of [GO ](https://golang.org/)language
1.  Azure subscription. (If you don’t have an Azure subscription, create a [free
account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you
begin.)
1.  IDE — [Gogland](https://www.jetbrains.com/go/) by Jetbrains or [Visual Studio
Code](https://code.visualstudio.com/) by Microsoft or [Atom](https://atom.io/)

### Creating and connecting to an Azure Cosmos DB account

1.  In a new window, sign in to the [Azure portal](https://portal.azure.com/).
1.  In the left menu, click **New**, click **Databases**, and then click **Azure
Cosmos DB**.

![](https://cdn-images-1.medium.com/max/800/1*e-QMvThW-2QZ3hEH3VvUQQ.png)

3. In the **New account** blade, specify the desired configuration for the Azure
Cosmos DB account.

With Azure Cosmos DB, you can choose one of four programming models: Gremlin
(graph), MongoDB, SQL (DocumentDB), and Table (key-value).

In this quick start we’ll be programming against the MongoDB API so you’ll
choose **MongoDB** as you fill out the form. But if you have graph data for a
social media mes New app, document data from a catalog app, or key/value (table)
data, realize that Azure Cosmos DB can provide a highly available,
globally-distributed database service platform for all your mission-critical
applications.

Fill out the New account blade using the information in the screenshot as a
guide . You will choose unique values as you set up your account so your values
will not match the screenshot exactly

![](https://cdn-images-1.medium.com/max/800/1*XdFlpeNKLe7o3FOtCZ17AQ.png)
<span class="figcaption_hack">Create Azure Cosmos DB Account</span>

4. Click **Create** to create the account.

5. On the toolbar, click **Notifications** to monitor the deployment process.

![](https://cdn-images-1.medium.com/max/800/1*WTGVkPwkSTxjUzKm2u09Eg.png)
<span class="figcaption_hack">Check Progress of Azure Cosmos DB Deployment</span>

6. Click on **golang-couch** resources.

7. Get connection string information which will be required by client
applications.

![](https://cdn-images-1.medium.com/max/800/1*XoslPMsWsv5vqK2vhYAJPw.png)
<span class="figcaption_hack">Connection information of MongoDB</span>

### Setting up your application

It’s time to make our hands dirty. Open your favorite editor (Gogland, VS Code
or Atom). For this article, I will use Gogland editor.

1.  Create folder CosmosDBAcces folder inside GOROOT\src folder
1.  Run below command to get mgo package

    go get gopkg.in/mgo.v2

### Connect to an Azure Cosmos DB account

[mgo](http://labix.org/mgo) (pronounced as *mango*) is a
[MongoDB](http://www.mongodb.org/) driver for the [Go
language](http://golang.org/) that implements a rich and well tested selection
of features under a very simple API following standard Go idioms.

Azure Cosmos DB supports the SSL-enabled MongoDB. To connect to an SSL-enabled
MongoDB, we need to define the **DialServer** function in
[mgo.DialInfo](http://gopkg.in/mgo.v2#DialInfo), and make use of the
[tls.*Dial*](http://golang.org/pkg/crypto/tls#Dial) to perform the connection.

The following code Golang code snippet connects Go app with Azure  MongoDB. 
*DialInfo* holds options for establishing a session with a MongoDB cluster.

```go
// DialInfo holds options for establishing a session with a MongoDB cluster.
dialInfo := &mgo.DialInfo{
    Addrs:    []string{"golang-couch.documents.azure.com:10255"}, // Get HOST + PORT
    Timeout:  60 * time.Second,
    Database: "golang-coach",                                                                             // It can be anything
    Username: "golang-coach",                                                                             // Username
    Password: "Azure database connect password from Azure Portal", // PASSWORD
    DialServer: func(addr *mgo.ServerAddr) (net.Conn, error) {
        return tls.Dial("tcp", addr.String(), &tls.Config{})
    },
}

// Create a session which maintains a pool of socket connections
// to our MongoDB.
session, err := mgo.DialWithInfo(dialInfo)

if err != nil {
    fmt.Printf("Can't connect to mongo, go error %v\n", err)
    os.Exit(1)
}

defer session.Close()

// SetSafe changes the session safety mode.
// If the safe parameter is nil, the session is put in unsafe mode, // and writes become fire-and-forget,
// without error checking. The unsafe mode is faster since operations won't hold on waiting for a confirmation.
// 
session.SetSafe(&mgo.Safe{})
```
**mgo.Dial()** method is used when there is no SSL connection and for SSL
connection **mgo.DialWithInfo()** method is required.

Instance of **DialWIthInfo{}** object will be used to create session object.
Once session is established, we can access collection by following code snippet

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

Azure Cosmos DB supports rich queries against JSON documents stored in each
collection. The following sample code shows a query that you can run against the
documents in your collection.

```go
// Get Document from collection
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
// update document
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
// delete document
query := bson.M{"_id": result.Id}
err = collection.Remove(query)
if err != nil {
    log.Fatal("Error deleting record: ", err)
    return
}
```

### Get the complete Golang tutorial solution

Please have a look at the entire source code at
[GitHub](https://github.com/Golang-Coach/Lessons/tree/master/CosmosDBAccess).
