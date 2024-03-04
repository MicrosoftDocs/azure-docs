---
title: Connect to SQL Managed Instance
titleSuffix: Azure Cognitive Search
description: Configure an indexer connection to access content in an Azure SQL Managed instance that's protected through a private endpoint.

author: mattmsft
ms.author: magottei
ms.service: cognitive-search
ms.topic: how-to
ms.date: 07/31/2023
---

# Create a shared private link for a SQL managed instance from Azure Cognitive Search

This article explains how to configure an indexer in Azure Cognitive Search for a private connection to a SQL managed instance that runs within a virtual network.

On a private connection to a managed instance, the fully qualified domain name (FQDN) of the instance must include the [DNS Zone](/azure/azure-sql/managed-instance/connectivity-architecture-overview#virtual-cluster-connectivity-architecture). Currently, only the Azure Cognitive Search Management REST API provides a `resourceRegion` parameter for accepting the DNS zone specification.

Although you can call the Management REST API directly, it's easier to use the Azure CLI `az rest` module to send Management REST API calls from a command line. This article uses the Azure CLI with REST to set up the private link.

> [!NOTE]
> This article refers to Azure portal for obtaining properties and confirming steps. However, when creating the shared private link for SQL Managed Instance, make sure you're using the REST API. Although the Networking tab lists `Microsoft.Sql/managedInstances` as an option, the portal doesn't currently support the extended URL format used by SQL Managed Instance.

## Prerequisites

+ [Azure CLI](/cli/azure/install-azure-cli)

+ Azure Cognitive Search, Basic or higher. If you're using [AI enrichment](cognitive-search-concept-intro.md) and skillsets, use Standard 2 (S2) or higher. See [Service limits](search-limits-quotas-capacity.md#shared-private-link-resource-limits) for details.

+ Azure SQL Managed Instance, configured to run in a virtual network.

+ You should have a minimum of Contributor permissions on both Azure Cognitive Search and SQL Managed Instance.

> [!NOTE]
> Azure Private Link is used internally, at no charge, to set up the shared private link.

## 1 - Retrieve connection information

Retrieve the FQDN of the managed instance, including the DNS zone. The DNS zone is part of the domain name of the SQL Managed Instance. For example, if the FQDN of the SQL Managed Instance is `my-sql-managed-instance.a1b22c333d44.database.windows.net`, the DNS zone is `a1b22c333d44`.

1. In Azure portal, find the SQL managed instance object.

1. On the **Overview** tab, locate the Host property. Copy the DNS zone portion of the FQDN for the next step.

1. On the **Connection strings** tab, copy the ADO.NET connection string for a later step. It's needed for the data source connection when testing the private connection.

For more information about connection properties, see [Create an Azure SQL Managed Instance](/azure/azure-sql/managed-instance/instance-create-quickstart?view=azuresql#retrieve-connection-details-to-sql-managed-instance&preserve-view=true).

## 2 - Create the body of the request

1. Using a text editor, create the JSON for the shared private link.

   ```json
   {
       "name": "{{shared-private-link-name}}",
       "properties": {
           "privateLinkResourceId": "/subscriptions/{{target-resource-subscription-ID}}/resourceGroups/{{target-resource-rg}}/providers/Microsoft.Sql/managedInstances/{{target-resource-name}}",
           "resourceRegion": "a1b22c333d44",
           "groupId": "managedInstance",
           "requestMessage": "please approve",
       }
   }
   ```

1. Provide a meaningful name for the shared private link. The shared private link appears alongside other private endpoints. A name like "shared-private-link-for-search" can remind you how it's used.

1. Paste in the DNS zone name in "resourceRegion" that you retrieved in an earlier step.

1. Edit the "privateLinkResourceId" to reflect the private endpoint of your managed instance. Provide the subscription ID, resource group name, and object name of the managed instance.

1. Save the file locally as *create-pe.json* (or use another name, remembering to update the Azure CLI syntax in the next step).

1. In the Azure CLI, type `dir` to note the current location of the file.

## 3 - Create a shared private link

1. From the command line, sign into Azure using `az login`.

1. If you have multiple subscriptions, make sure you're using the one you intend to use: `az account show`.

   To set the subscription, use `az account set --subscription {{subscription ID}}`

1. Call the `az rest` command to use the [Management REST API](/rest/api/searchmanagement/2021-04-01-preview/shared-private-link-resources/create-or-update) of Azure Cognitive Search. 

   Because shared private link support for SQL managed instances is still in preview, you need a preview version of the REST API. Use `2021-04-01-preview` for this step`.

   ```azurecli
   az rest --method put --uri https://management.azure.com/subscriptions/{{search-service-subscription-ID}}/resourceGroups/{{search service-resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}/sharedPrivateLinkResources/{{shared-private-link-name}}?api-version=2021-04-01-preview --body @create-pe.json
   ```

   Provide the subscription ID, resource group name, and service name of your Cognitive Search resource.

   Provide the same shared private link name that you specified in the JSON body.

   Provide a path to the *create-pe.json* file if you've navigated away from the file location. You can type `dir` at the command line to confirm the file is in the current directory.

1. Press Enter to run the command.

When you complete these steps, you should have a shared private link that's provisioned in a pending state. **It takes several minutes to create the link**. Once it's created, the resource owner needs to approve the request before it's operational.

## 4 - Approve the private endpoint connection

On the SQL Managed Instance side, the resource owner must approve the private connection request you created. 

1. In the Azure portal, open the **Private endpoint connections** tab of the managed instance.

1. Find the section that lists the private endpoint connections.

1. Select the connection, and then select **Approve**. It can take a few minutes for the status to be updated in the portal.

After the private endpoint is approved, Azure Cognitive Search creates the necessary DNS zone mappings in the DNS zone that's created for it.

## 5 - Check shared private link status

On the Azure Cognitive Search side, you can confirm request approval by revisiting the Shared Private Access tab of the search service **Networking** page. Connection state should be approved.

   ![Screenshot of the Azure portal, showing an "Approved" shared private link resource.](media\search-indexer-howto-secure-access\new-shared-private-link-resource-approved.png)

## 6 - Configure the indexer to run in the private environment

You can now configure an indexer and its data source to use an outbound private connection to your managed instance.

You could use the [**Import data**](search-get-started-portal.md) wizard for this step, but the indexer that's generated won't be valid for this scenario. You'll need to modify the indexer JSON property as described in this step to make it compliant for this scenario. You'll then need to [reset and rerun the indexer](search-howto-run-reset-indexers.md) to fully test the pipeline using the updated indexer.

This article assumes Postman or equivalent tool, and uses the REST APIs to make it easier to see all of the properties. Recall that REST API calls for indexers and data sources use the [Search REST APIs](/rest/api/searchservice/), not the [Management REST APIs](/rest/api/searchmanagement/) used to create the shared private link. The syntax and API versions are different between the two REST APIs.

1. [Create the data source definition](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md) as you would normally for Azure SQL. Although the format of the connection string is different, the data source type and other properties are valid for SQL Managed Instance.

    Provide the connection string that you copied earlier.

    ```http
    POST https://myservice.search.windows.net/datasources?api-version=2020-06-30
     Content-Type: application/json
     api-key: admin-key
     {
         "name" : "my-sql-datasource",
         "description" : "A database for testing Azure Cognitive Search indexes.",
         "type" : "azuresql",
         "credentials" : { 
             "connectionString" : "Server=tcp:contoso.public.0000000000.database.windows.net,1433; Persist Security Info=false; User ID=<your user name>; Password=<your password>;MultipleActiveResultsSets=False; Encrypt=True;Connection Timeout=30;" 
            },
         "container" : { 
             "name" : "Name of table or view to index",
             "query" : null (not supported in the Azure SQL indexer)
             },
         "dataChangeDetectionPolicy": null,
         "dataDeletionDetectionPolicy": null,
         "encryptionKey": null,
         "identity": null
     }
    ```

   > [!NOTE]
   > If you're familiar with data source definitions in Cognitive Search, you'll notice that data source properties don't vary when using a shared private link. That's because Search will always use a shared private link on the connection if one exists.

1. [Create the indexer definition](search-howto-create-indexers.md), setting the indexer execution environment to "private".

   [Indexer execution](search-indexer-securing-resources.md#indexer-execution-environment) occurs in either a private environment that's specific to the search service, or a multi-tenant environment that's used internally to offload expensive skillset processing for multiple customers. **When connecting over a private endpoint, indexer execution must be private.**

   ```http
    POST https://myservice.search.windows.net/indexers?api-version=2020-06-30
     Content-Type: application/json
     api-key: admin-key
       {
        "name": "indexer",
        "dataSourceName": "my-sql-datasource",
        "targetIndexName": "my-search-index",
        "parameters": {
            "configuration": {
                "executionEnvironment": "private"
            }
        },
        "fieldMappings": []
        }
    ```

1. Run the indexer. If the indexer execution succeeds and the search index is populated, the shared private link is working.

You can monitor the status of the indexer in Azure portal or by using the [Indexer Status API](/rest/api/searchservice/get-indexer-status).

You can use [**Search explorer**](search-explorer.md) in Azure portal to check the contents of the index.

## 7 - Test the shared private link

If you ran the indexer in the previous step and successfully indexed content from your managed instance, then the test was successful. However, if the indexer fails or there's no content in the index, you can modify your objects and repeat testing by choosing any client that can invoke an outbound request from an indexer. 

An easy choice is [running an indexer](search-howto-run-reset-indexers.md) in Azure portal, but you can also try Postman and REST APIs for more precision. Assuming that your search service isn't also configured for a private connection, the REST client connection to Search can be over the public internet.

Here are some reminders for testing:

+ If you use Postman or another web testing tool, use the [Management REST API](/rest/api/searchmanagement/) and the [2021-04-01-Preview API version](/rest/api/searchmanagement/management-api-versions) to create the shared private link. Use the [Search REST API](/rest/api/searchservice/) and a [stable API version](/rest/api/searchservice/search-service-api-versions) to create and invoke indexers and data sources.

+ You can use the Import data wizard to create an indexer, data source, and index. However, the generated indexer won't have the correct execution environment setting.

+ You can edit data source and indexer JSON in Azure portal to change properties, including the execution environment and the connection string.

+ You can reset and rerun the indexer in Azure portal. Reset is important for this scenario because it forces a full reprocessing of all documents.

+ You can use Search explorer to check the contents of the index.

## See also

+ [Make outbound connections through a private endpoint](search-indexer-howto-access-private.md)
+ [Indexer connections to Azure SQL Managed Instance through a public endpoint](search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers.md)
+ [Index data from Azure SQL](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [Management REST API](/rest/api/searchmanagement/)
+ [Search REST API](/rest/api/searchservice/)
+ [Quickstart: Get started with REST](search-get-started-rest.md)
