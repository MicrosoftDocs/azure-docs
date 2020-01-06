---
title: Use unique keys in Azure Cosmos DB
description: Learn how to define and use unique keys for an Azure Cosmos database. This article also describes how unique keys add a layer of data integrity.
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 12/02/2019
ms.reviewer: sngun
---

# Unique key constraints in Azure Cosmos DB

Unique keys add a layer of data integrity to an Azure Cosmos container. You create a unique key policy when you create an Azure Cosmos container. With unique keys, you make sure that one or more values within a logical partition is unique. You also can guarantee uniqueness per [partition key](partition-data.md).

After you create a container with a unique key policy, the creation of a new or an update of an existing item resulting in a duplicate within a logical partition is prevented, as specified by the unique key constraint. The partition key combined with the unique key guarantees the uniqueness of an item within the scope of the container.

For example, consider an Azure Cosmos container with email address as the unique key constraint and `CompanyID` as the partition key. When you configure the user's email address with a unique key, each item has a unique email address within a given `CompanyID`. Two items can't be created with duplicate email addresses and with the same partition key value. 

To create items with the same email address, but not the same first name, last name, and email address, add more paths to the unique key policy. Instead of creating a unique key based on the email address only, you also can create a unique key with a combination of the first name, last name, and email address. This key is known as a composite unique key. In this case, each unique combination of the three values within a given `CompanyID` is allowed. 

For example, the container can contain items with the following values, where each item honors the unique key constraint.

|CompanyID|First name|Last name|Email address|
|---|---|---|---|
|Contoso|Gaby|Duperre|gaby@contoso.com |
|Contoso|Gaby|Duperre|gaby@fabrikam.com|
|Fabrikam|Gaby|Duperre|gaby@fabrikam.com|
|Fabrikam|Ivan|Duperre|gaby@fabrikam.com|
|Fabrkam|   |Duperre|gaby@fabraikam.com|
|Fabrkam|   |   |gaby@fabraikam.com|

If you attempt to insert another item with the combinations listed in the previous table, you receive an error. The error indicates that the unique key constraint wasn't met. You receive either `Resource with specified ID or name already exists` or `Resource with specified ID, name, or unique index already exists` as a return message. 

## Define a unique key

You can define unique keys only when you create an Azure Cosmos container. A unique key is scoped to a logical partition. In the previous example, if you partition the container based on the ZIP code, you end up with duplicated items in each logical partition. Consider the following properties when you create unique keys:

* You can't update an existing container to use a different unique key. In other words, after a container is created with a unique key policy, the policy can't be changed.

* To set a unique key for an existing container, create a new container with the unique key constraint. Use the appropriate data migration tool to move the data from the existing container to the new container. For SQL containers, use the [Data Migration tool](import-data.md) to move data. For MongoDB containers, use [mongoimport.exe or mongorestore.exe](mongodb-migrate.md) to move data.

* A unique key policy can have a maximum of 16 path values. For example, the values can be `/firstName`, `/lastName`, and `/address/zipCode`. Each unique key policy can have a maximum of 10 unique key constraints or combinations. The combined paths for each unique index constraint must not exceed 60 bytes. In the previous example, first name, last name, and email address together are one constraint. This constraint uses 3 out of the 16 possible paths.

* When a container has a unique key policy, [Request Unit (RU)](request-units.md) charges to create, update, and delete an item are slightly higher.

* Sparse unique keys are not supported. If some unique path values are missing, they're treated as null values, which take part in the uniqueness constraint. For this reason, there can be only a single item with a null value to satisfy this constraint.

* Unique key names are case-sensitive. For example, consider a container with the unique key constraint set to `/address/zipcode`. If your data has a field named `ZipCode`, Azure Cosmos DB inserts "null" as the unique key because `zipcode` isn't the same as `ZipCode`. Because of this case sensitivity, all other records with ZipCode can't be inserted because the duplicate "null" violates the unique key constraint.

## Next steps

* Learn more about [logical partitions](partition-data.md)
* Explore [how to define unique keys](how-to-define-unique-keys.md) when creating a container
