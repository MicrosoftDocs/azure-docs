---
title: Connect to SQL Managed Instance
titleSuffix: Azure Cognitive Search
description: Configure an indexer connection to access content in an Azure SQL Managed instance that's protected through a private endpoint.

author: mattmsft
ms.author: magottei
ms.service: cognitive-search
ms.topic: how-to
ms.date: 04/12/2023
---

# Create a shared private link for a SQL Managed Instance from Azure Cognitive Search

This article explains how to configure an outbound indexer connection in Azure Cognitive Search to a SQL Managed Instance over a private endpoint.

On a private connection to a SQL Managed Instance, the fully qualified domain name (FQDN) of the instance must include the [DNS Zone](/azure/azure-sql/managed-instance/connectivity-architecture-overview#virtual-cluster-connectivity-architecture). Currently, only the Azure Cognitive Search Management REST API provides a `resourceRegion` parameter for accepting the DNS zone specification.

Although you can call the Management REST API directly, it's easier to use the Azure CLI `az rest` module to send Management REST API calls from a command line.

> [!NOTE]
> This article relies on Azure portal for obtaining properties and confirming steps. However, when creating the shared private link for SQL Managed Instance, be sure to use the REST API. Although the Networking tab lists `Microsoft.Sql/managedInstances` as an option, the portal doesn't currently support the extended URL format used by SQL Managed Instance.

## Prerequisites

+ [Azure CLI](/cli/azure/install-azure-cli)

+ Azure Cognitive Search, Basic tier or higher. If you're using [AI enrichment](cognitive-search-concept-intro.md) and skillsets, the tier must be Standard 2 (S2) or higher. See [Service limits](search-limits-quotas-capacity.md#shared-private-link-resource-limits) for details.

+ Azure SQL Managed Instance, configured to run in a virtual network, with a private endpoint created through Azure Private Link.

+ You should have a minimum of Contributor permissions on both Azure Cognitive Search and SQL Managed Instance.

## 1 - Private endpoint verification

Check whether the managed instance has a private endpoint.

1. [Sign in to Azure portal](https://portal.azure.com/).

1. Type "private link" in the top search bar, and then select **Private Link** to open the Private Link Center.

1. Select **Private endpoints** to view existing endpoints. You should see your SQL Managed Instance in this list.

## 2 - Retrieve connection information

Retrieve the FQDN of the managed instance, including the DNS zone. The DNS zone is part of the domain name of the SQL Managed Instance. For example, if the FQDN of the SQL Managed Instance is `my-sql-managed-instance.a1b22c333d44.database.windows.net`, the DNS zone is `a1b22c333d44`.

1. In Azure portal, find the SQL managed instance object.

1. On the **Overview** tab, locate the Host property. Copy the DNS zone portion of the FQDN for the next step.

1. On the **Connection strings** tab, copy the ADO.NET connection string for a later step. It's needed for the data source connection when testing the private connection.

For more information about connection properties, see [Create an Azure SQL Managed Instance](/azure/azure-sql/managed-instance/instance-create-quickstart?view=azuresql#retrieve-connection-details-to-sql-managed-instance&preserve-view=true).

## 3 - Create the body of the request

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

## 4 - Create a shared private link

1. From the command line, sign into Azure using `az login`.

1. If you have multiple subscriptions, make sure you're using the one you intend to use: `az account show`.

   To set the subscription, use `az account set --subscription {{subscription ID}}`

1. Call the `az rest` command to use the [Management REST API](/rest/api/searchmanagement/2021-04-01-preview/shared-private-link-resources/create-or-update) of Azure Cognitive Search. 

   Because shared private link support for SQL managed instances is still in preview, you need a preview version of the REST API. You can use either `2021-04-01-preview` or `2020-08-01-preview`.

   ```azurecli
   az rest --method put --uri https://management.azure.com/subscriptions/{{search-service-subscription-ID}}/resourceGroups/{{search service-resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}/sharedPrivateLinkResources/{{shared-private-link-name}}?api-version=2021-04-01-preview --body @create-pe.json
   ```

   Provide the subscription ID, resource group name, and service name of your Cognitive Search resource.

   Provide the same shared private link name that you specified in the JSON body.

   Provide a path to the create-pe.json file if you've navigated away from the file location. You can type `dir` at the command line to confirm the file is in the current directory.

1. Press Enter to run the command.

When you complete these steps, you should have a shared private link that's provisioned in a pending state. **It takes several minutes to create the link**. Once it's created, the resource owner needs to approve the request before it's operational.

## 5 - Approve the private endpoint connection

On the SQL Managed Instance side, the resource owner must approve the private connection request you created. 

1. In the Azure portal, open the **Private endpoint connections** tab of the managed instance.

1. Find the section that lists the private endpoint connections.

1. Select the connection, and then select **Approve**. It can take a few minutes for the status to be updated in the portal.

After the private endpoint is approved, Azure Cognitive Search creates the necessary DNS zone mappings in the DNS zone that's created for it.

## 6 - Check shared private link status

On the Azure Cognitive Search side, you can confirm request approval by revisiting the Shared Private Access tab of the search service **Networking** page. Connection state should be approved.

   ![Screenshot of the Azure portal, showing an "Approved" shared private link resource.](media\search-indexer-howto-secure-access\new-shared-private-link-resource-approved.png)

## 7 - Configure the indexer to run in the private environment

You can now configure an indexer and its data source to use an outbound private connection to your managed instance.

You can use the portal for this step, or any client that you would normally use for indexer setup. This article uses the REST APIs to make it easier to see all of the properties. Recall that REST API calls for indexers and data sources use the [Search REST APIs](/rest/api/searchservice/), not the [Management REST APIs](/rest/api/searchmanagement/). The syntax and API versions are different.

1. [Create the data source definition](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md) as you would normally for Azure SQL. There are no properties in any of these definitions that vary when using a shared private endpoint.

    Provide the connection string that you copied earlier.

    ```http
    POST https://myservice.search.windows.net/datasources?api-version=2020-06-30
     Content-Type: application/json
     api-key: admin-key
     {
         "name" : "my-sql-datasource",
         "description" : "A database for testing Azure Cognitive Search indexes.",
         "type" : "azuresql",
         "credentials" : { "connectionString" : "Server=tcp:contoso.public.0000000000.database.windows.net,1433; Persist Security Info=false; User ID=<your user name>; Password=<your password>;MultipleActiveResultsSets=False; Encrypt=True;Connection Timeout=30;" },
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

After the indexer is created successfully, it should connect over the private endpoint connection. You can monitor the status of the indexer by using the [Indexer Status API](/rest/api/searchservice/get-indexer-status).

## 8 - Test the shared private link

Choose a tool that can invoke an outbound request from an indexer. An easy choice is using the [**Import data**](search-get-started-portal.md) wizard in Azure portal, but you can also try the Postman and REST APIs for more precision. 

Assuming that your search service isn't also configured for a private connection, the REST client connection to Search can be over the public internet.

1. In the data source definition, set the connection string to the managed instance. The format of the connection string doesn't change for shared private link. The search service invokes the shared private link internally.

   ```http
    POST https://myservice.search.windows.net/datasources?api-version=2020-06-30
     Content-Type: application/json
     api-key: admin-key
    {
      "name": "my-sql-datasource",
      "type": "azuresql",
      "subtype": null,
      "credentials": {
        "connectionString": "..."
      }
   ```

1. In the indexer definition, remember to set the execution environment in the indexer definition:

   ```http
    POST https://myservice.search.windows.net/indexers?api-version=2020-06-30
     Content-Type: application/json
     api-key: admin-key
    {
       "name": "indexer",
       "dataSourceName": "my-sql-datasource",
       "targetIndexName": "my-index",
       "parameters": {
          "configuration": {
              "executionEnvironment": "private"
              }
          },
       "fieldMappings": []
       }
    }
   ```

1. Run the indexer. If the indexer execution succeeds and the search index is populated, the shared private link is working.

## See also

+ [Make outbound connections through a private endpoint](search-indexer-howto-access-private.md)
+ [Indexer connections to Azure SQL Managed Instance through a public endpoint](search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers.md)
+ [Index data from Azure SQL](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [Management REST API](/rest/api/searchmanagement/)
+ [Search REST API](/rest/api/searchservice/)