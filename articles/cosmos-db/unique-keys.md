---
title: Unique keys in Azure Cosmos DB
description: Learn how to use unique keys in your Azure Cosmos DB database
author: aliuy

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 10/30/2018
ms.author: andrl

---

# Unique keys in Azure Cosmos DB

Unique keys provide you with the ability to add a layer of data integrity to a Cosmos container. You create a unique key policy when creating a Cosmos container. With unique keys, you ensure the uniqueness of one or more values within a logical partition (you can guarantee uniqueness per [partition key](partition-data.md)). Once you create a container with a unique key policy, it prevents creating any new (or updated) duplicate items within a logical partition, as specified by the unique key constraint. The partition key combined with the unique key guarantees uniqueness of an item within the scope of the container.

For example, consider a Cosmos container with email address as unique key constraint and `CompanyID` as the partition key. By configuring the user's email address a unique key, you ensure each item has a unique email address within a given `CompanyID`. Two items can't be created with duplicate email addresses and with the same partition key value.  

If you want to provide users the ability to create multiple items with the same email address, but not the same first name, last name and email address, you could add additional paths to the unique key policy. Instead of creating a unique key based on the email address, you can also create a unique key with a combination of the first name, last name, and email address (a composite unique key). In this case, each unique combination of the three values within a given `CompanyID` is allowed. For example, the container can contain items with the following values where each item is honoring the unique key constraint.

|CompanyID|First name|Last name|Email address|
|---|---|---|---|
|Contoso|Gaby|Duperre|gaby@contoso.com |
|Contoso|Gaby|Duperre|gaby@fabrikam.com|
|Fabrikam|Gaby|Duperre|gaby@fabrikam.com|
|Fabrikam|Ivan|Duperre|gaby@fabrikam.com|
|Fabrkam|   |Duperre|gaby@fabraikam.com|
|Fabrkam|   |   |gaby@fabraikam.com|

If you attempt to insert another item with the combinations listed in the above table, you will receive an error indicating that the unique key constraint was not met. You will receive either "Resource with specified ID or name already exists" or "Resource with specified ID, name, or unique index already exists" as a return message.  

## Defining a unique key

You can define unique keys only when creating a Cosmos container. A unique key is scoped to a logical partition. In the previous example, if you partition the container based on the zipcode, you will end up having duplicated items in each logical partition. Consider the following properties when creating unique keys:

* You cannot update an existing container to use a different unique key. In other words, once a container is created with a unique key policy, the policy cannot be changed.

* If you want to set unique key for an existing container, you have to create a new container with the unique key constraint and use the appropriate data migration tool to move the data from existing container to the new container. For SQL containers, use the [Data Migration Tool](import-data.md) to move data. For MongoDB containers, use [mongoimport.exe or mongorestore.exe](mongodb-migrate.md) to move data.

* A unique key policy can have a maximum of 16 path values (for example: /firstName, /lastName, /address/zipCode). Each unique key policy can have a maximum of 10 unique key constraints or combinations and the combined paths for each unique index constraint should not exceed 60 bytes. In the previous example, first name, last name, and email address together are just one constraint, and it uses three out of the 16 possible paths.

* When a container has a unique key policy, request unit (RU) charges to create, update, and delete an item are slightly higher.

* Sparse unique keys are not supported. If some unique path values are missing, they are treated as null values, which take part in the uniqueness constraint. Hence, there can only be a single item with null value to satisfy this constraint.

* Unique key names are case-sensitive. For example, consider a container with the unique key constraint set to /address/zipcode. If your data has a field named ZipCode, Cosmos DB inserts "null" as the unique key because "zipcode" is not same as "ZipCode". Due to this case sensitivity, all other records with ZipCode can't be inserted because the duplicate "null" will violate the unique key constraint.

## Next steps

* Learn more about [logical partitions](partition-data.md)
