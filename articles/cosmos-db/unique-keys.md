---
title: Unique keys in Azure Cosmos DB
description: Learn how to use unique keys in your Azure Cosmos DB database
services: cosmos-db
keywords: unique key constraint, violation of unique key constraint
author: rafats
manager: kfile
editor: monicar

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 10/30/2018
ms.author: rafats

---

# Unique keys in Azure Cosmos DB

Unique keys provide you with the ability to add a layer of data integrity to a Cosmos container. By creating a unique key policy when a Cosmos container is created, you ensure the uniqueness of one or more values within a logical partition (you guarantee uniqueness per [partition key](partition-data.md)). Once a container has been created with a unique key policy, it prevents the creation of any new (or updated) duplicate items within a logical partition, as specified by the unique key constraint. The partition key combined with the unique key is guaranteed to be unique within the scope of the container.

Consider a Cosmos container with a unique key constraint of email address, with `CompanyID` as the partition key. By making the user's email address a unique key, you ensure each item has a unique email address within a given `CompanyID`.  No two items can be created with duplicate email addresses with the same partition key value.  

If you want users to be able to create multiple items with the same email address, but not the same first name, last name and email address, you could add other paths to the unique key policy. Instead of creating a unique key based on an email address, you can create a unique key that is a combination of the first name, last name, and email address (a composite of the values). In this case, each unique combination of the three values within a given `CompanyID` is allowed. In this case, the container could contain items that have the following values, with each item honoring the unique key constraint.

|CompanyID|First name|Last name|Email address|
|---|---|---|---|
|Contoso|Gaby|Duperre|gaby@contoso.com |
|Contoso|Gaby|Duperre|gaby@fabrikam.com|
|Fabrikam|Gaby|Duperre|gaby@fabrikam.com|
|Fabrikam|Ivan|Duperre|gaby@fabrikam.com|
|Fabrkam|   |Duperre|gaby@fabraikam.com|
|Fabrkam|   |   |gaby@fabraikam.com|

If you attempted to insert another item with any of the combinations listed in the table above, you would receive an error indicating that the unique key constraint was not met. You will receive either "Resource with specified ID or name already exists" or "Resource with specified ID, name, or unique index already exists" return message.  

## Defining a unique key

Unique keys must be defined at the time of creation of a Cosmos container, and the unique key is scoped to a logical partition. In the above example, if you partition the container based on zipcode, you could have the items from the table duplicated in each logical partition. You cannot update an existing container to use unique keys. Once a container is created with a unique key policy, the policy cannot be changed.

If you have existing data for which you would like to implement unique keys, then create a new container with the unique key constraint and use the appropriate data migration tool to move the data to the new container. For SQL containers, use the [Data Migration Tool](import-data.md). For MongoDB containers, use [mongoimport.exe or mongorestore.exe](mongodb-migrate.md).

A maximum of 16 path values (for example: /firstName, /lastName, /address/zipCode) can be included in each unique key policy.

Each unique key policy can have a maximum of 10 unique key constraints or combinations and the combined paths for each unique index constraint should not exceed 60 bytes. The example above that uses first name, last name, and email address is just one constraint, and it uses three of the 16 possible paths available.

Request unit (RU) charges for creating, updating, and deleting an item are slightly higher when there is a unique key policy specified on the container.

Sparse unique keys are not supported. If values for some unique paths are missing, they are treated as a special null value, which takes part in the uniqueness constraint.

Unique key names are case-sensitive. For example, consider a container with the unique key constraint of /address/zipcode. If your data will have ZipCode, then it will insert "null" in unique key as zipcode is not equal to ZipCode. And because of this case sensitivity all other records with ZipCode will not be able to be inserted as duplicate "null" will violate the unique key constraint.

## Supported APIs and SDKs

This feature is currently supported by the following Cosmos DB APIs and client SDKs.  

|Client drivers|Azure CLI|SQL API|Cassandra API|MongoDB API|Gremlin API|Table API|
|---|---|---|---|---|---|---|
|.NET|NA|Yes|No|Yes|No|No|
|Java|NA|Yes|No|Yes|No|No|
|Python|NA|Yes|No|Yes|No|No|
|Node/JS|NA|Yes|No|Yes|No|No|

## Next steps

* Learn more about [logical partitions](partition-data.md)
* Learn more about [designing a partition key](TBD)
* Learn [how to specify unique key constraints using SQL API](TBD)
* Learn [how to specify unique key constraints using MongoDB API](TBD)
* Learn [how to specify unique key constraints using Azure portal](TBD)
