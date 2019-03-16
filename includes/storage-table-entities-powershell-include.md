---
author: tamram
ms.service: storage
ms.topic: include
ms.date: 10/26/2018
ms.author: tamram
---
<!--created by Robin Shahan to go in the articles for table storage w/powershell.
    There is one for Azure Table Storage and one for Azure Cosmos DB Table API -->

## Managing table entities

Now that you have a table, let's look at how to manage entities, or rows, in the table. 

An entity can have up to 255 properties, including 3 system properties: **PartitionKey**, **RowKey**, and **Timestamp**. You are responsible for inserting and updating the values of **PartitionKey** and **RowKey**. The server manages the value of **Timestamp**, which cannot be modified. Together the **PartitionKey** and **RowKey** uniquely identify every entity within a table.

* **PartitionKey**: Determines the partition that the entity is stored in.
* **RowKey**: Uniquely identifies the entity within the partition.

You may define up to 252 custom properties for an entity. 

### Add table entities

Add entities to a table using **Add-AzTableRow**. These examples use partition keys with values "partition1" and "partition2", and row keys equal to state abbreviations. The properties in each entity are username and userid. 

```powershell
$partitionKey1 = "partition1"
$partitionKey2 = "partition2"

# add four rows 
Add-AzTableRow `
    -table $cloudTable `
    -partitionKey $partitionKey1 `
    -rowKey ("CA") -property @{"username"="Chris";"userid"=1}

Add-AzTableRow `
    -table $cloudTable `
    -partitionKey $partitionKey2 `
    -rowKey ("NM") -property @{"username"="Jessie";"userid"=2}

Add-AzTableRow `
    -table $cloudTable `
    -partitionKey $partitionKey1 `
    -rowKey ("WA") -property @{"username"="Christine";"userid"=3}

Add-AzTableRow `
    -table $cloudTable `
    -partitionKey $partitionKey2 `
    -rowKey ("TX") -property @{"username"="Steven";"userid"=4}
```

### Query the table entities

There are several different ways to query the entities in a table which can be achieved by using **Get-AzTableRow** command.

> [!IMPORTANT]
>
> Starting with **AzureRmStorageTable** version 2.0, use **Get-AzTableRow** with different parameter sets for queries.
> The following cmdlets, **Get-AzureStorageTableRowAll**, **Get-AzureStorageTableRowByPartitionKey**, **Get-AzureStorageTableRowByColumnName**, **Get-AzureStorageTableRowByCustomFilter**
> are all deprecated and will be removed in a future version update.

#### Retrieve all entities

```powershell
Get-AzTableRowAll -table $cloudTable | ft
```

This command yields results similar to the following table:

| userid | username | partition | rowkey |
|----|---------|---------------|----|
| 1 | Chris | partition1 | CA |
| 3 | Christine | partition1 | WA |
| 2 | Jessie | partition2 | NM |
| 4 | Steven | partition2 | TX |

#### Retrieve entities for a specific partition

```powershell
Get-AzTableRow -table $cloudTable -partitionKey $partitionKey1 | ft
```

The results look similar to the following table:

| userid | username | partition | rowkey |
|----|---------|---------------|----|
| 1 | Chris | partition1 | CA |
| 3 | Christine | partition1 | WA |

#### Retrieve entities for a specific value in a specific column

```powershell
Get-AzTableRow -table $cloudTable `
    -columnName "username" `
    -value "Chris" `
    -operator Equal
```

This query retrieves one record.

|field|value|
|----|----|
| userid | 1 |
| username | Chris |
| PartitionKey | partition1 |
| RowKey      | CA |

#### Retrieve entities using a custom filter 

```powershell
Get-AzTableRow `
    -table $cloudTable `
    -customFilter "(userid eq 1)"
```

This query retrieves one record.

|field|value|
|----|----|
| userid | 1 |
| username | Chris |
| PartitionKey | partition1 |
| RowKey      | CA |

### Updating entities 

There are three steps for updating entities. First, retrieve the entity to change. Second, make the change. Third, commit the change using **Update-AzTableRow**.

Update the entity with username = 'Jessie' to have username = 'Jessie2'. This example also shows another way to create a custom filter using .NET types.

```powershell
# Create a filter and get the entity to be updated.
[string]$filter = `
    [Microsoft.Azure.Cosmos.Table.TableQuery]::GenerateFilterCondition("username",`
    [Microsoft.Azure.Cosmos.Table.QueryComparisons]::Equal,"Jessie")
$user = Get-AzTableRow `
    -table $cloudTable `
    -customFilter $filter

# Change the entity.
$user.username = "Jessie2"

# To commit the change, pipe the updated record into the update cmdlet.
$user | Update-AzTableRow -table $cloudTable

# To see the new record, query the table.
Get-AzTableRow -table $cloudTable `
    -customFilter "(username eq 'Jessie2')"
```

The results show the Jessie2 record.

|field|value|
|----|----|
| userid | 2 |
| username | Jessie2 |
| PartitionKey | partition2 |
| RowKey      | NM |

### Deleting table entities

You can delete one entity or all entities in the table.

#### Deleting one entity

To delete a single entity, get a reference to that entity and pipe it into **Remove-AzTableRow**.

```powershell
# Set filter.
[string]$filter = `
  [Microsoft.Azure.Cosmos.Table.TableQuery]::GenerateFilterCondition("username",`
  [Microsoft.Azure.Cosmos.Table.QueryComparisons]::Equal,"Jessie2")

# Retrieve entity to be deleted, then pipe it into the remove cmdlet.
$userToDelete = Get-AzTableRow `
    -table $cloudTable `
    -customFilter $filter
$userToDelete | Remove-AzTableRow -table $cloudTable

# Retrieve entities from table and see that Jessie2 has been deleted.
Get-AzTableRow -table $cloudTable | ft
```

#### Delete all entities in the table

To delete all entities in the table, you retrieve them and pipe the results into the remove cmdlet. 

```powershell
# Get all rows and pipe the result into the remove cmdlet.
Get-AzTableRow `
    -table $cloudTable | Remove-AzTableRow -table $cloudTable 

# List entities in the table (there won't be any).
Get-AzTableRow -table $cloudTable | ft
```
