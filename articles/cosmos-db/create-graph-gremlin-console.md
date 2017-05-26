---
title: 'Azure Cosmos DB tutorial: Create, query, and traverse in Apache TinkerPops Gremlin Console | Microsoft Docs'
description: An Azure Cosmos DB quickstart to creates vertices, edges, and queries using the Azure Cosmos DB Graph API.
services: cosmosdb
author: AndrewHoh
manager: jhubbard
editor: monicar

ms.assetid: bf08e031-718a-4a2a-89d6-91e12ff8797d
ms.service: cosmosdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: terminal
ms.topic: hero-article
ms.date: 05/19/2017
ms.author: anhoh

---
# Azure Cosmos DB: Create, query, and traverse a graph in the Gremlin console

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This quick start demonstrates how to create an Azure Cosmos DB account, database, and graph (container) using the Azure portal and then use the [Gremlin Console](https://tinkerpop.apache.org/docs/current/reference/#gremlin-console) from  [Apache TinkerPop](http://tinkerpop.apache.org) to work with Graph API (preview) data. In this tutorial, you'll create and query vertices and edges, updating a vertex property, query vertices, traverse the graph, and drop a vertex.

![Azure Cosmos DB from the Apache Gremlin console](./media/create-graph-gremlin-console/gremlin-console.png)

The Gremlin console is Groovy/Java based and runs on Linux, Mac, and Windows. You can download it from the [Apache TinkerPop site](https://www.apache.org/dyn/closer.lua/tinkerpop/3.2.4/apache-tinkerpop-gremlin-console-3.2.4-bin.zip).

## Prerequisites

You need to have an Azure subscription to create an Azure Cosmos DB account for this quickstart.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

You also need to install the [Gremlin Console](http://tinkerpop.apache.org/). Use version 3.2.4 or above.

## Create a database account

[!INCLUDE [cosmosdb-create-dbaccount-graph](../../includes/cosmosdb-create-dbaccount-graph.md)]

## Add a graph

[!INCLUDE [cosmosdb-create-graph](../../includes/cosmosdb-create-graph.md)]

## <a id="ConnectAppService"></a>Connect to your app service
1. Before starting the Gremlin Console, create or modify your *remote-secure.yaml* configuration file in your *apache-tinkerpop-gremlin-console-3.2.4/conf* directory.
2. Fill in your *host*, *port*, *username*, *password*, *connectionPool*, and *serializer* configurations:

    Setting|Suggested value|Description
    ---|---|---
    Hosts|***.graphs.azure.com|Your graph service URI, which you can retrieve from the Azure portal
    Port|443|Set to 443
    Username|*Your username*|The resource of the form `/dbs/<db>/colls/<coll>`.
    Password|*Your primary master key*|Your primary master key for the Azure Cosmos DB
    ConnectionPool|{enableSsl: true}|Your connection pool setting for SSL
    Serializer|{ className:org.apache.tinkerpop.gremlin.<br>driver.ser.GraphSONMessageSerializerV1d0,<br> config: { serializeResultToString: true }}|Set to this value

3. In your terminal, run *bin/gremlin.bat* or *bin/gremlin.sh* to start the [Gremlin Console](http://tinkerpop.apache.org/docs/3.2.4/tutorials/getting-started/).
4. In your terminal, run *:remote connect tinkerpop.server conf/remote-secure.yaml* to connect to your app service.

Great! Now that we finished the setup, let's start running some console commands.

## Create vertices and edges

Let's begin by adding four person vertices for *Thomas*, *Mary Kay*, *Robin*, and *Ben*.

Input (Thomas):

```
:> g.addV('person').property('firstName', 'Thomas').property('lastName', 'Andersen').property('age', 44)
```

Output:

```
==>[id:1eb91f79-94d7-4fd4-b026-18f707952f21,label:person,type:vertex,properties:[firstName:[[id:ec5fcfbe-040e-48c3-b961-31233c8b1801,value:Thomas]],lastName:[[id:86e5b580-0bca-4bc2-bc53-a46f92c1a182,value:Andersen]],age:[[id:2caeab3c-c66d-4098-b673-40a8101bb72a,value:44]]]]
```
Input (Mary Kay):

```
:> g.addV('person').property('firstName', 'Mary Kay').property('lastName', 'Andersen').property('age', 39)
```

Output:

```
==>[id:899a9d37-6701-48fc-b0a1-90950be7e0f4,label:person,type:vertex,properties:[firstName:[[id:c79c5599-8646-47d1-9a49-3456200518ce,value:Mary Kay]],lastName:[[id:c1362095-9dcc-479d-ab21-86c1b6d4ffc1,value:Andersen]],age:[[id:0b530408-bfae-4e8f-98ad-c160cd6e6a8f,value:39]]]]
```

Input (Robin):

```
:> g.addV('person').property('firstName', 'Robin').property('lastName', 'Wakefield')
```

Output:

```
==>[id:953aefd9-5a54-4033-9b3a-d4dc3049f720,label:person,type:vertex,properties:[firstName:[[id:bbda02e0-8a96-4ca1-943e-621acbb26824,value:Robin]],lastName:[[id:f0291ad3-05a3-40ec-aabb-6538a7c331e3,value:Wakefield]]]]
```

Input (Ben):

```
:> g.addV('person').property('firstName', 'Ben').property('lastName', 'Miller')
```

Output:

```
==>[id:81c891d9-beca-4c87-9009-13a826c9ed9a,label:person,type:vertex,properties:[firstName:[[id:3a3b53d3-888c-46da-bb54-1c42194b1e18,value:Ben]],lastName:[[id:48c6dd50-79c4-4585-ab71-3bf998061958,value:Miller]]]]
```

Next, let's add edges for relationships between our people.

Input (Thomas -> Mary Kay):

```
:> g.V().hasLabel('person').has('firstName', 'Thomas').addE('knows').to(g.V().hasLabel('person').has('firstName', 'Mary Kay'))
```

Output:

```
==>[id:c12bf9fb-96a1-4cb7-a3f8-431e196e702f,label:knows,type:edge,inVLabel:person,outVLabel:person,inV:0d1fa428-780c-49a5-bd3a-a68d96391d5c,outV:1ce821c6-aa3d-4170-a0b7-d14d2a4d18c3]
```

Input (Thomas -> Robin):

```
:> g.V().hasLabel('person').has('firstName', 'Thomas').addE('knows').to(g.V().hasLabel('person').has('firstName', 'Robin'))
```

Output:

```
==>[id:58319bdd-1d3e-4f17-a106-0ddf18719d15,label:knows,type:edge,inVLabel:person,outVLabel:person,inV:3e324073-ccfc-4ae1-8675-d450858ca116,outV:1ce821c6-aa3d-4170-a0b7-d14d2a4d18c3]
```

Input (Robin -> Ben):

```
:> g.V().hasLabel('person').has('firstName', 'Robin').addE('knows').to(g.V().hasLabel('person').has('firstName', 'Ben'))
```

Output:

```
==>[id:889c4d3c-549e-4d35-bc21-a3d1bfa11e00,label:knows,type:edge,inVLabel:person,outVLabel:person,inV:40fd641d-546e-412a-abcc-58fe53891aab,outV:3e324073-ccfc-4ae1-8675-d450858ca116]
```

## Update a vertex

Let's update the *Thomas* vertex with a new age of *45*.

Input:
```
:> g.V().hasLabel('person').has('firstName', 'Thomas').property('age', 45)
```
Output:

```
==>[id:ae36f938-210e-445a-92df-519f2b64c8ec,label:person,type:vertex,properties:[firstName:[[id:872090b6-6a77-456a-9a55-a59141d4ebc2,value:Thomas]],lastName:[[id:7ee7a39a-a414-4127-89b4-870bc4ef99f3,value:Andersen]],age:[[id:a2a75d5a-ae70-4095-806d-a35abcbfe71d,value:45]]]]
```

## Query your graph

Now, let's run a variety of queries against your graph.

First, let's try a query with a filter to return only people who are older than 40 years old.

Input (filter query):

```
:> g.V().hasLabel('person').has('age', gt(40))
```

Output:

```
==>[id:ae36f938-210e-445a-92df-519f2b64c8ec,label:person,type:vertex,properties:[firstName:[[id:872090b6-6a77-456a-9a55-a59141d4ebc2,value:Thomas]],lastName:[[id:7ee7a39a-a414-4127-89b4-870bc4ef99f3,value:Andersen]],age:[[id:a2a75d5a-ae70-4095-806d-a35abcbfe71d,value:45]]]]
```

Next, let's project the first name for the people who are older than 40 years old.

Input (filter + projection query):

```
:> g.V().hasLabel('person').has('age', gt(40)).values('firstName')
```

Output:

```
==>Thomas
```

## Traverse your graph

Let's traverse the graph to return all of Thomas's friends.

Input (friends of Thomas):

```
:> g.V().hasLabel('person').has('firstName', 'Thomas').outE('knows').inV().hasLabel('person')
```

Output: 

```
==>[id:f04bc00b-cb56-46c4-a3bb-a5870c42f7ff,label:person,type:vertex,properties:[firstName:[[id:14feedec-b070-444e-b544-62be15c7167c,value:Mary Kay]],lastName:[[id:107ab421-7208-45d4-b969-bbc54481992a,value:Andersen]],age:[[id:4b08d6e4-58f5-45df-8e69-6b790b692e0a,value:39]]]]
==>[id:91605c63-4988-4b60-9a30-5144719ae326,label:person,type:vertex,properties:[firstName:[[id:f760e0e6-652a-481a-92b0-1767d9bf372e,value:Robin]],lastName:[[id:352a4caa-bad6-47e3-a7dc-90ff342cf870,value:Wakefield]]]]
```

Next, let's get the next layer of vertices. Traverse the graph to return all the friends of Thomas's friends.

Input (friends of friends of Thomas):

```
:> g.V().hasLabel('person').has('firstName', 'Thomas').outE('knows').inV().hasLabel('person').outE('knows').inV().hasLabel('person')
```
Output:

```
==>[id:a801a0cb-ee85-44ee-a502-271685ef212e,label:person,type:vertex,properties:[firstName:[[id:b9489902-d29a-4673-8c09-c2b3fe7f8b94,value:Ben]],lastName:[[id:e084f933-9a4b-4dbc-8273-f0171265cf1d,value:Miller]]]]
```

## Drop a vertex

Let's now delete a vertex from the graph database.

Input (drop Robin vertex):

```
:> g.V().hasLabel('person').has('firstName', 'Robin').drop()
```

## Clear your graph

Finally, let's clear the database of all vertices and edges.

Input:

```
:> g.V().drop()
```

Congratulations! You've completed this Azure Cosmos DB: Graph API tutorial!

## Review SLAs in the Azure portal

[!INCLUDE [cosmosdb-tutorial-review-slas](../../includes/cosmosdb-tutorial-review-slas.md)]

## Clean up resources

If you're not going to continue to use this app, delete all resources created by this quickstart in the Azure portal with the following steps:  

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click the name of the resource you created. 
2. On your resource group page, click **Delete**, type the name of the resource to delete in the text box, and then click **Delete**.

## Next steps

In this quickstart, you've learned how to create an Azure Cosmos DB account, create a graph using the Data Explorer, create vertices and edges, and traverse your graph using the Gremlin console. You can now build more complex queries and implement powerful graph traversal logic using Gremlin. 

> [!div class="nextstepaction"]
> [Query using Gremlin](tutorial-query-graph.md)