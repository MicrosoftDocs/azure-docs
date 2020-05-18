---
title: Use Azure Cosmos DB resource tokens with the Gremlin SDK
description: Learn how to create resource tokens and use them to access the Graph database. 
author: luisbosquez
ms.author: lbosq
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: conceptual
ms.date: 09/06/2019
---

# Use Azure Cosmos DB resource tokens with the Gremlin SDK

This article explains how to use [Azure Cosmos DB resource tokens](secure-access-to-data.md) to access the Graph database through the Gremlin SDK.

## Create a resource token

The Apache TinkerPop Gremlin SDK doesn't have an API to use to create resource tokens. The term *resource token* is an Azure Cosmos DB concept. To create resource tokens, download the [Azure Cosmos DB SDK](sql-api-sdk-dotnet.md). If your application needs to create resource tokens and use them to access the Graph database, it requires two separate SDKs.

The object model hierarchy above resource tokens is illustrated in the following outline:

- **Azure Cosmos DB account** - The top-level entity that has a DNS associated with it (for example, `contoso.gremlin.cosmos.azure.com`).
  - **Azure Cosmos DB database**
    - **User**
      - **Permission**
        - **Token** - A Permission object property that denotes what actions are allowed or denied.

A resource token uses the following format: `"type=resource&ver=1&sig=<base64 string>;<base64 string>;"`. This string is opaque for the clients and should be used as is, without modification or interpretation.

```csharp
// Notice that document client is created against .NET SDK endpoint, rather than Gremlin.
DocumentClient client = new DocumentClient(
  new Uri("https://contoso.documents.azure.com:443/"), 
  "<master key>", 
  new ConnectionPolicy 
  {
    EnableEndpointDiscovery = false, 
    ConnectionMode = ConnectionMode.Direct 
  });

  // Read specific permission to obtain a token.
  // The token isn't returned during the ReadPermissionReedAsync() call.
  // The call succeeds only if database id, user id, and permission id already exist. 
  // Note that <database id> is not a database name. It is a base64 string that represents the database identifier, for example "KalVAA==".
  // Similar comment applies to <user id> and <permission id>.
  Permission permission = await client.ReadPermissionAsync(UriFactory.CreatePermissionUri("<database id>", "<user id>", "<permission id>"));

  Console.WriteLine("Obtained token {0}", permission.Token);
}
```

## Use a resource token
You can use resource tokens directly as a "password" property when you construct the GremlinServer class.

```csharp
// The Gremlin application needs to be given a resource token. It can't discover the token on its own.
// You can obtain the token for a given permission by using the Azure Cosmos DB SDK, or you can pass it into the application as a command line argument or configuration value.
string resourceToken = GetResourceToken();

// Configure the Gremlin server to use a resource token rather than a master key.
GremlinServer server = new GremlinServer(
  "contoso.gremlin.cosmosdb.azure.com",
  port: 443,
  enableSsl: true,
  username: "/dbs/<database name>/colls/<collection name>",

  // The format of the token is "type=resource&ver=1&sig=<base64 string>;<base64 string>;".
  password: resourceToken);

  using (GremlinClient gremlinClient = new GremlinClient(server, new GraphSON2Reader(), new GraphSON2Writer(), GremlinClient.GraphSON2MimeType))
  {
      await gremlinClient.SubmitAsync("g.V().limit(1)");
  }
```

The same approach works in all TinkerPop Gremlin SDKs.

```java
Cluster.Builder builder = Cluster.build();

AuthProperties authenticationProperties = new AuthProperties();
authenticationProperties.with(AuthProperties.Property.USERNAME,
    String.format("/dbs/%s/colls/%s", "<database name>", "<collection name>"));

// The format of the token is "type=resource&ver=1&sig=<base64 string>;<base64 string>;".
authenticationProperties.with(AuthProperties.Property.PASSWORD, resourceToken);

builder.authProperties(authenticationProperties);
```

## Limit

With a single Gremlin account, you can issue an unlimited number of tokens. However, you can use only up to 100 tokens concurrently within 1 hour. If an application exceeds the token limit per hour, an authentication request is denied, and you receive the following error message: "Exceeded allowed resource token limit of 100 that can be used concurrently." It doesn't work to close active connections that use specific tokens to free up slots for new tokens. The Azure Cosmos DB Gremlin database engine keeps track of unique tokens during the hour immediately prior to the authentication request.

## Permission

A common error that applications encounter while they're using resource tokens is, "Insufficient permissions provided in the authorization header for the corresponding request. Please retry with another authorization header." This error is returned when a Gremlin traversal attempts to write an edge or a vertex but the resource token grants *Read* permissions only. Inspect your traversal to see whether it contains any of the following steps: *.addV()*, *.addE()*, *.drop()*, or *.property()*.

## Next steps
* [Role-based access control](role-based-access-control.md) in Azure Cosmos DB
* [Learn how to secure access to data](secure-access-to-data.md) in Azure Cosmos DB
