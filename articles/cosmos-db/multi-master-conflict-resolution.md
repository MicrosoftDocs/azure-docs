---
title: Multi-master conflict resolution in Azure Cosmos DB | Microsoft Docs
description: This article describes the conflict categories and conflict resolution modes such as Last-Writer-Wins (LWW), Custom – User-Defined Procedure, Custom – Asynchronous in Azure Comsos DB multi-master.
services: cosmos-db
author: markjbrown

ms.service: cosmos-db
ms.devlang: multiple
ms.topic: conceptual
ms.date: 09/18/2018
ms.author: mjbrown

---

# Multi-master conflict resolution in Azure Cosmos DB 

Azure Cosmos DB multi-master provides global conflict resolution modes to ensure data is consistent across all regions where it is replicated. There are different data conflict categories and you can choose among three different conflict resolution modes to fit your scenarios.

## Conflict categories

There are three categories of conflicts that can occur when working with Azure Cosmos DB data:

* **Insert conflicts:** This type of conflict happens when the application inserts two or more documents with the same unique index (for example, ID) from two or more regions simultaneously. In this case, all the writes may succeed initially, but based on the conflict resolution policy you choose, only one document with the original ID is committed.

* **Replace conflicts:** This type of conflict happens when the application updates a single document simultaneously from two or more regions.

* **Delete conflicts:** This type of conflict happens when the application deletes a document from one region and updates it from one or more regions. 

## Conflict resolution modes

There are three conflict resolution modes offered by Azure Cosmos DB. Conflict resolution modes are defined for each Collection.

### Last-Writer-Wins (LWW)

Last-Writer-Wins is default conflict resolution mode. In this mode, conflicts are resolved based on the value assigned to a user-defined integer property in the document. If this property does not exist within the document, then the conflict is resolved by using the timestamp(_ts) of the document. 

Below is a snippet that describes how to configure Last Writer Wins conflict resolution policy for a collection by using the path to a user-defined integer property. This user-defined integer property is also referred as conflict resolution path. In this example `/userDefinedId` is the conflict resolution path, and the document with the largest `userDefinedId` value will always win the conflict. 

To register a Last Writer Wins resolution mode, provision the collection with the ConflictResolutionPolicy as shown below.

```csharp
DocumentCollection lwwCollection = await myClient.CreateDocumentCollectionIfNotExistsAsync(UriFactory.CreateDatabaseUri("myDatabase"), new DocumentCollection 
{ 
   Id = "myCollection", 
   ConflictResolutionPolicy = new ConflictResolutionPolicy 
   { 
      Mode = ConflictResolutionMode.LastWriterWins, 
      ConflictResolutionPath = "/userDefinedId"
   } 
});
```

Last Writer Wins resolution mode is applied to different data conflict categories as follows:

* **Insert and update conflict:** If two or more documents collide on insert or replace operations, the document that contains the largest value for the conflict resolution path becomes the winner (that is, userDefinedId). If multiple documents have same integer value for the conflict resolution path, the selected winner is non-deterministic. However, all regions will converge to a single winner.

* **Delete conflict:** If there are delete conflicts involved, the delete always wins over other replace conflicts irrespective of the value of the conflict resolution path.

### Custom – User-Defined Procedure

In this mode, the user controls conflict resolution by registering a User Defined Procedure (UDP) to the collection. This UDP has a specific signature. If you select this option but fail to register a UDP, or if the UDP throws an exception at runtime, conflicts are written to the conflicts feed where they can be resolved individually. 

To register a custom – user-defined procedure resolution mode, provision the collection with the ConflictResolutionPolicy as shown below.

```csharp
DocumentCollection udpCollection = await myClient.CreateDocumentCollectionIfNotExistsAsync(UriFactory.CreateDatabaseUri("myDatabase"), new DocumentCollection
{
  Id = "myCollection",
  ConflictResolutionPolicy = new ConflictResolutionPolicy
  {
     Mode = ConflictResolutionMode.Custom,
     ConflictResolutionProcedure = UriFactory.CreateStoredProcedureUri("myDatabase","myCollection","myUdpStoredProcedure").ToString()
  }
}); 
```

Next, add the user-defined procedure to the collection as shown below.

```csharp
StoredProcedure myUdpStoredProc = new StoredProcedure
{
   Id = "myUdpStoredProcedure", 
   Body = myUdpStoredProcText
};
await myClient.UpsertStoredProcedureAsync(UriFactory.CreateDocumentCollectionUri("myDatabase", "myCollection"), myUdpStoredProc);
```

The stored procedure registered with the collection has a special signature:

```csharp
Function myUdpStoredProcedure (incomingDocument, existingDocument, isDeleteConflict, conflictingDocuments)
{
     //custom resolver code here
}
```

The procedure has four parameters:

* **incomingDocument:** specifies the conflicting version of the document. The conflict can be insert, replace, or delete conflict. For a delete conflict, this will be a delete image (tombstone) with no content.

* **existingDocument:** specifies the committed version of the document, that has the same rid as the incomingDocument. This parameter is set to null for an insert and delete conflict.

* **isDeleteConflict:** Boolean flag indicating if the incoming document is conflicting with a previously deleted document. When this parameter is set to true, existingDocument will also be null.

* **conflictingDocuments:** specifies a collection of the committed version of all documents in the database, which are conflicting with incomingDocument on ID column or any other unique index fields. These documents will have different "rid" value when compared to the incomingDocument.

The user-defined procedure has full access to the Cosmos DB partition key and can perform any store operations to resolve conflicts. If the user-defined procedure does not commit the conflict version, the system will drop the conflict and the existingDocument will remain committed. If the user-defined procedure fails or does not exist, Azure Cosmos DB will all add the conflict into the read-only conflicts feed where it can be processed asynchronously as shown in the [Asynchronous conflict resolution mode](). 

### Custom – Asynchronous  

In this mode, Azure Cosmos DB excludes all conflicts (insert, replace, and delete) from being committed and registers them in the read-only conflicts feed for deferred resolution by the user’s application. The application can perform conflict resolution asynchronously and use any logic or refer to any external source, application, or service to resolve the conflict.

To register a custom – asynchronous resolution mode, provision the collection with the ConflictResolutionPolicy as shown below.

```csharp
DocumentCollection manualCollection = await myClient.CreateDocumentCollectionIfNotExistsAsync(UriFactory.CreateDatabaseUri("myDatabase"), new DocumentCollection 
{ 
    Id = "myCollection", 		
    ConflictResolutionPolicy = new ConflictResolutionPolicy 
    { 
        Mode = ConflictResolutionMode.Custom 
    } 
});
```
 
To read and process any conflicts in the conflicts feed, implement the code shown below. Data stored in the conflicts feed adds some storage cost. So, it's recommended to delete the data stored in conflicts feed after they are processed.

```csharp
FeedResponse<Conflict> response = await myClient.ReadConflictFeedAsync(myCollectionUri); 
  foreach (Conflict conflict in response) 
  { 
      switch(conflict.OperationKind) 
      { 
         case OperationKind.Create: 
         //Process Insert Conflicts. 
         … 
         case OperationKind.Replace 
         //Process Replace Conflicts 
         … 
         case OperationKind.Delete 
         //Process Delete Conflicts 
         … 
      }
  //Optionally delete the conflict after processed
  await myClient.DeleteConflictAsync(conflict.SelfLink);
  }
```

> [!NOTE]
> The conflicts feed does not include a listener to send notifications for downstream processing like the change feed in Cosmos DB. You have to implement the logic to poll the conflicts feed and determine if conflicts are present.

## Next steps

In this article, you learned about Conflict Categories and Resolution Modes for Azure Cosmos DB. Next, take a look at the following resources:
•	Multi-master conflict resolution sample for .NET
