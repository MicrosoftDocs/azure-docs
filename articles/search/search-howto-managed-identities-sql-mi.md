---
title: Connect to SQL Managed Instance using managed identity
titleSuffix: Azure Cognitive Search
description: Learn how to set up an Azure Cognitive Search indexer connection to a SQL managed instance using a managed identity

author: gmndrg
ms.author: gimondra
manager: liamca

ms.service: cognitive-search
ms.topic: conceptual
ms.date: 04/08/2022
---

# Set up an indexer connection to SQL Managed Instance using a managed identity

This article describes how to set up an Azure Cognitive Search indexer connection to SQL Managed Instance using a managed identity instead of providing credentials in the connection string.

You can use a system-assigned managed identity or a user-assigned managed identity (preview). Managed identities are Azure AD logins and require Azure role assignments to access data in SQL Managed Instance.

Before learning more about this feature, it is recommended that you have an understanding of what an indexer is and how to set up an indexer for your data source. More information can be found at the following links:

* [Indexer overview](search-indexer-overview.md)
* [SQL Managed Instance indexer](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)

## Prerequisites

* [Create a managed identity](search-howto-managed-identities-data-sources.md) for your search service.

* Azure AD admin role on SQL Managed Instance:

  To assign read permissions on SQL Managed Instance, you must be an Azure Global Admin with a SQL Managed Instance. See [Configure and manage Azure AD authentication with SQL Managed Instance](../azure-sql/database/authentication-aad-configure.md) and follow the steps to provision an Azure AD admin (SQL Managed Instance). 

* [Configure public endpoint and NSG in SQL Managed Instance](https://docs.microsoft.com/azure/search/search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers) to allow connections from Azure Cognitive Search.

## 1 - Assign permissions to read the database

Follow the below steps to assign the search service or user-assigned managed identity permission to read the database.

1. Connect to your SQL Managed Instance through SSMS by using one of the following methods:

    - [Configure a point-to-site connection from on-premises](https://docs.microsoft.com/azure/azure-sql/managed-instance/point-to-site-p2s-configure").
    - [Configure an Azure VM](https://docs.microsoft.com/azure/azure-sql/managed-instance/connect-vm-instance-configure).

2. Authenticate with your Azure AD account

    ![Authenticate](./media/search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers-with-managed-identity/sql-login.png "Authenticate")

3. Execute the following commands:

    Include the brackets around your search service name or user-assigned managed identity name.
    
    ```tsql
    CREATE USER [insert your search service name here or user-assigned managed identity name] FROM EXTERNAL PROVIDER;
    EXEC sp_addrolemember 'db_datareader', [insert your search service name here or user-assigned managed identity name];
    ```

    ![New query](./media/search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers-with-managed-identity/new-query.png "New query")

    ![Execute query](./media/search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers-with-managed-identity/execute-query.png "Execute query")

If you later change the search service identity or user-assigned identity after assigning permissions, you must remove the role membership and remove the user in the SQL database, then repeat the permission assignment. Removing the role membership and user can be accomplished by running the following commands:

 ```tsql
sp_droprolemember 'db_datareader', [insert your search service name or user-assigned managed identity name];

DROP USER IF EXISTS [insert your search service name or user-assigned managed identity name];
```

## 2 - Add a role assignment

In this step you will give your Azure Cognitive Search service permission to read data from your SQL Managed Instance.

1. In the Azure portal navigate to your SQL Managed Instance page.
2. Select **Access control (IAM)**
3. Select **Add** then **Add role assignment**

    ![Add role assignment](./media/search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers-with-managed-identity/sql-mi-iam-access.png "Add role assignment")

4. Select the appropriate **Reader** role.
5. Leave **Assign access to** as **Azure AD user, group or service principal**
6. If you're using a system-assigned managed identity, search for your search service, then select it. If you're using a user-assigned managed identity, search for the name of the user-assigned managed identity, then select it. Select **Save**.

    Example for SQL Managed Instance using a system-assigned managed identity:

    ![Add reader role assignment](./media/search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers-with-managed-identity/add-role-assignment.png "Add reader role assignment")

## 3 - Create the data source

Create the data source and provide either a system-assigned managed identity or a user-assigned managed identity (preview). 

### System-assigned managed identity

The [REST API](/rest/api/searchservice/create-data-source), Azure portal, and the [.NET SDK](/dotnet/api/azure.search.documents.indexes.models.searchindexerdatasourceconnection) support system-assigned managed identity. 

When you're connecting with a system-assigned managed identity, the only change to the data source definition is the format of the "credentials" property. You'll provide an Initial Catalog or Database name and a ResourceId that has no account key or password. The ResourceId must include the subscription ID of SQL Managed Instance, the resource group of SQL Managed instance, and the name of the SQL database. 

Here is an example of how to create a data source to index data from a storage account using the [Create Data Source](/rest/api/searchservice/create-data-source) REST API and a managed identity connection string. The managed identity connection string format is the same for the REST API, .NET SDK, and the Azure portal.  

```http
POST https://[service name].search.windows.net/datasources?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
    "name" : "sql-mi-datasource",
    "type" : "azuresql",
    "credentials" : { 
        "connectionString" : "Database=[SQL database name];ResourceId=/subscriptions/[subscription ID]/resourcegroups/[resource group name]/providers/Microsoft.Sql/managedInstances/[SQL Managed Instance name];Connection Timeout=100;"
    },
    "container" : { 
        "name" : "my-table" 
    }
} 
```

## 4 - Create the index

The index specifies the fields in a document, attributes, and other constructs that shape the search experience.

Here's a [Create Index](/rest/api/searchservice/create-index) REST API call with a searchable `booktitle` field:   

```http
POST https://[service name].search.windows.net/indexes?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
    "name" : "my-target-index",
    "fields": [
        { "name": "id", "type": "Edm.String", "key": true, "searchable": false },
        { "name": "booktitle", "type": "Edm.String", "searchable": true, "filterable": false, "sortable": false, "facetable": false }
    ]
}
```

## 5 - Create the indexer

An indexer connects a data source with a target search index, and provides a schedule to automate the data refresh. Once the index and data source have been created, you're ready to create the indexer.

Here's a [Create Indexer](/rest/api/searchservice/create-indexer) REST API call with an Azure SQL indexer definition. The indexer will run when you submit the request.

```http
POST https://[service name].search.windows.net/indexers?api-version=2020-06-30
Content-Type: application/json
api-key: [admin key]

{
    "name" : "sql-mi-indexer",
    "dataSourceName" : "sql-mi-datasource",
    "targetIndexName" : "my-target-index"
}
```    

## Troubleshooting

If you get an error when the indexer tries to connect to the data source that says that the client is not allowed to access the server, take a look at [common indexer errors](./search-indexer-troubleshooting.md).

You can also rule out any firewall issues by trying the connection with and without restrictions in place.

## See also

* [SQL Managed Instance and Azure SQL Database indexer](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
