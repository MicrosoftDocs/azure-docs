---
title: Managed private endpoints
description: An article that explains Managed private endpoints in Azure Synapse Analytics
author: ashinMSFT
ms.service: azure-synapse-analytics
ms.topic: concept-article
ms.subservice: security
ms.date: 11/15/2024
ms.author: seshin
ms.reviewer: whhender
---

# Azure Synapse Analytics managed private endpoints

Managed private endpoints are private endpoints created in a Managed Virtual Network associated with your Azure Synapse workspace. Managed private endpoints establish a private link to Azure resources. Azure Synapse manages these private endpoints on your behalf. You can create Managed private endpoints from your Azure Synapse workspace to access Azure services (such as Azure Storage or Azure Cosmos DB) and Azure hosted customer/partner services.

When you use Managed private endpoints, traffic between your Azure Synapse workspace and other Azure resources traverse entirely over the Microsoft backbone network. Managed private endpoints protect against data exfiltration. A Managed private endpoint uses private IP address from your Managed Virtual Network to effectively bring the Azure service that your Azure Synapse workspace is communicating into your Virtual Network. Managed private endpoints are mapped to a specific resource in Azure and not the entire service. Customers can limit connectivity to a specific resource approved by their organization. 

Learn more about [private links and private endpoints](../../private-link/index.yml).

>[!IMPORTANT]
>Managed private endpoints are only supported in Azure Synapse workspaces with a Managed workspace Virtual Network.

>[!NOTE]
>When creating an Azure Synapse workspace, you can choose to associate a Managed Virtual Network to it. If you choose to have a Managed Virtual Network associated to your workspace, you can also choose to limit outbound traffic from your workspace to only approved targets. You must create Managed private endpoints to these targets. 

A private endpoint connection is created in a "Pending" state when you create a Managed private endpoint in Azure Synapse. An approval workflow is started. The private link resource owner is responsible to approve or reject the connection. If the owner approves the connection, the private link is established. But, if the owner doesn't approve the connection, then the private link won't be established. In either case, the Managed private endpoint will be updated with the status of the connection. Only a Managed private endpoint in an approved state can be used to send traffic to the private link resource that is linked to the Managed private endpoint.

## Managed private endpoints for dedicated SQL pool and serverless SQL pool

Dedicated SQL pool and serverless SQL pool are analytic capabilities in your Azure Synapse workspace. These capabilities use multitenant infrastructure that isn't deployed into the [Managed workspace Virtual Network](./synapse-workspace-managed-vnet.md).

When a workspace is created, Azure Synapse creates two Managed private endpoints in the workspace, one for dedicated SQL pool and one for serverless SQL pool.

These two Managed private endpoints are listed in Synapse Studio. Select **Manage** in the left navigation, then select **Managed private endpoints** to see them in the Studio.

The Managed private endpoint that targets SQL pool is called *synapse-ws-sql--\<workspacename\>* and the one that targets serverless SQL pool is called *synapse-ws-sqlOnDemand--\<workspacename\>*.

![Managed private endpoints for dedicated SQL pool and serverless SQL pool](./media/synapse-workspace-managed-private-endpoints/managed-pe-for-sql-1.png)

These two Managed private endpoints are automatically created for you when you create your Azure Synapse workspace. You aren't charged for these two Managed private endpoints.

## Supported data sources

Azure Synapse Spark supports over 25 data sources to connect to using managed private endpoints. Users need to specify the resource identifier, which can be found in the **Properties** settings page of their data source in the Azure portal.

| Service| Resource ID Format|
|:-----------|:--------------|
| Cognitive Services | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.CognitiveServices/accounts/{resource-name}|
| Azure Databricks | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Databricks/workspaces/{workspace-name}|
| Azure Database for MariaDB | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.DBforMariaDB/servers/{server-name}|
| Azure Database for MySQL | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.DBforMySQL/servers/{server-name}|
| Azure Database for PostgreSQL | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.DBforPostgreSQL/servers/{server-name}|
| Azure Cosmos DB for MongoDB | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.DocumentDB/databaseAccounts/{account-name}|
| Azure Cosmos DB for NoSQL | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.DocumentDB/databaseAccounts/{account-name}
| Azure Monitor Private Link Scopes | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Insights/privateLinkScopes/{scope-name}|
| Azure Key Vault | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.KeyVault/vaults/{vault-name}|
| Azure Data Explorer (Kusto) | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Kusto/clusters/{cluster-name}|
| Azure Machine Learning | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.MachineLearningServices/workspaces/{workspace-name}|
| Microsoft Purview | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Purview/accounts/{account-name}|
| Azure Search | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Search/searchServices/{service-name}|
| Azure SQL Database | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Sql/servers/{server-name}|
| Azure SQL Database (Azure SQL Managed Instance) | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Sql/managedInstances/{instance-name}|
| Azure Blob Storage | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Storage/storageAccounts/{storage-account-name}|
| Azure Data Lake Storage Gen2 | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Storage/storageAccounts/{storage-account-name}|
| Azure File Storage | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Storage/storageAccounts/{storage-account-name}|
| Azure Queue Storage | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Storage/storageAccounts/{storage-account-name}|
| Azure Table Storage | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Storage/storageAccounts/{storage-account-name}|
| Azure Synapse Analytics | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Synapse/workspaces/{workspace-name}|
| Azure Synapse Analytics (Artifacts) | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Synapse/workspaces/{workspace-name}|
| Azure Functions | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Web/sites/{function-app-name}|
| Azure Event Hubs | /subscriptions/{subscription-id}/resourcegroups/{resource-group-name}/providers/Microsoft.EventHub/namespaces/{namespace-name}
| Azure IoT Hub | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Devices/IotHubs/{iothub-name}
| Azure IoT Hub | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Devices/IotHubs/{iothub-name}
| Azure App Services | /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Web/sites/{app-service-name}


## Get started

To learn more, advance to the [create managed private endpoints to your data sources](./how-to-create-managed-private-endpoints.md) article.
