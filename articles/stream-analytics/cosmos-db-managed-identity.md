---
title: Use managed identities to access Azure Cosmos DB from an Azure Stream Analytics job
description: This article describes how to use managed identities to authenticate your Azure Stream Analytics job to an Azure Cosmos DB output.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: how-to
ms.date: 09/22/2022
ms.custom: subject-rbac-steps, ignite-2022
---

# Use managed identities to access Azure Cosmos DB from an Azure Stream Analytics job

Azure Stream Analytics supports managed identity authentication for Azure Cosmos DB output. Managed identities eliminate the limitations of user-based authentication methods, like the need to reauthenticate because of password changes or user token expirations that occur every 90 days. When you remove the need to manually authenticate, your Stream Analytics deployments can be fully automated.  

A managed identity is a managed application registered in Microsoft Entra ID that represents a given Stream Analytics job. The managed application is used to authenticate to a targeted resource. For more information on managed identities for Azure Stream Analytics, see [Managed identities for Azure Stream Analytics](stream-analytics-managed-identities-overview.md).

This article shows you how to enable system-assigned managed identity for an Azure Cosmos DB output of a Stream Analytics job through the Azure portal. Before you can enable system-assigned managed identity, you must first have a Stream Analytics job and an Azure Cosmos DB resource.

## Create a managed identity  

First, you create a managed identity for your Azure Stream Analytics job.  

1. In the Azure portal, open your Azure Stream Analytics job.  

2. From the left navigation menu, select **Managed Identity** located under *Configure*. Then, check the box next to **Use System-assigned Managed Identity** and select **Save**.

   :::image type="content" source="media/event-hubs-managed-identity/system-assigned-managed-identity.png" alt-text="System assigned managed identity":::  

3. A service principal for the Stream Analytics job's identity is created in Microsoft Entra ID. The life cycle of the newly created identity is managed by Azure. When the Stream Analytics job is deleted, the associated identity (that is, the service principal) is automatically deleted by Azure.  

   When you save the configuration, the Object ID (OID) of the service principal is listed as the Principal ID as shown below:  

   :::image type="content" source="media/event-hubs-managed-identity/principal-id.png" alt-text="Principal ID":::

   The service principal has the same name as the Stream Analytics job. For example, if the name of your job is `MyASAJob`, the name of the service principal is also `MyASAJob`.  

## Grant the Stream Analytics job permissions to access the Azure Cosmos DB account

For the Stream Analytics job to access your Azure Cosmos DB using managed identity, the service principal you created must have special permissions to your Azure Cosmos DB account. In this step, you can assign a role to your stream analytics job's system-assigned managed identity. Azure Cosmos DB has multiple built-in roles that you can assign to the managed identity. For this solution, you will use the following role:

|Built-in role  |
|---------|
| Cosmos DB Built-in Data Contributor|

> [!IMPORTANT]
> Azure Cosmos DB data plane built-in role-based access control (RBAC) is not exposed through the Azure Portal. To assign the Cosmos DB Built-in Data Contributor role, you must grant permission via Azure Powershell. For more information about role-based access control with Microsoft Entra ID for your Azure Cosmos DB account, please see [configure role-based access control with Microsoft Entra ID for your Azure Cosmos DB account documentation.](../cosmos-db/how-to-setup-rbac.md)

The following command can be used to authenticate your ASA job with Azure Cosmos DB. The `$accountName` and `$resourceGroupName` are for your Azure Cosmos DB account, and the `$principalId` is the value obtained in the previous step, in the Identity tab of your ASA job. You need to have "Contributor" access to your Azure Cosmos DB account for this command to work properly.

```azurecli-interactive
New-AzCosmosDBSqlRoleAssignment -AccountName $accountName -ResourceGroupName $resourceGroupName -RoleDefinitionId '00000000-0000-0000-0000-000000000002' -Scope "/" -PrincipalId $principalId

```

> [!NOTE]
> Due to global replication or caching latency, there may be a delay when permissions are revoked or granted. Changes should be reflected within 10 minutes. Even though test connection can pass initially, jobs may fail when they are started before the permissions fully propagate.


### Add Azure Cosmos DB as an output

Now that your managed identity is configured, you're ready to add the Azure Cosmos DB resource as an output to your Stream Analytics job. 

1. Go to your Stream Analytics job and navigate to the **Outputs** page under **Job Topology**.

1. Select **Add > Azure Cosmos DB**. In the output properties window, search and select your Azure Cosmos DB account and select **Managed Identity: System assigned** from the *Authentication mode* drop-down menu.

1. Fill out the rest of the properties and select **Save**.

## Next steps

* [Understand outputs from Azure Stream Analytics](stream-analytics-define-outputs.md)
* [Azure Cosmos DB Output](azure-cosmos-db-output.md)
* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
* [Azure Cosmos DB optimization](stream-analytics-documentdb-output.md)
