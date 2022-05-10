---
title: Use managed identities to access Cosmos DB from an Azure Stream Analytics job
description: This article describes how to use managed identities to authenticate your Azure Stream Analytics job to an Azure CosmosDB output.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: how-to
ms.date: 05/04/2022
ms.custom: subject-rbac-steps
---

# Use managed identities to access Cosmos DB from an Azure Stream Analytics job (preview)

Azure Stream Analytics supports managed identity authentication for Azure Cosmos DB output. Managed identities eliminate the limitations of user-based authentication methods, like the need to reauthenticate because of password changes or user token expirations that occur every 90 days. When you remove the need to manually authenticate, your Stream Analytics deployments can be fully automated.  

A managed identity is a managed application registered in Azure Active Directory that represents a given Stream Analytics job. The managed application is used to authenticate to a targeted resource. For more information on managed identities for Azure Stream Analytics, see [Managed identities for Azure Stream Analytics](stream-analytics-managed-identities-overview.md).

This article shows you how to enable system-assigned managed identity for a Cosmos DB output of a Stream Analytics job through the Azure portal. Before you can enable system-assigned managed identity, you must first have a Stream Analytics job and an Azure Cosmos DB resource.

## Create a managed identity  

First, you create a managed identity for your Azure Stream Analytics job.  

1. In the Azure portal, open your Azure Stream Analytics job.  

2. From the left navigation menu, select **Managed Identity** located under *Configure*. Then, check the box next to **Use System-assigned Managed Identity** and select **Save**.

   :::image type="content" source="media/event-hubs-managed-identity/system-assigned-managed-identity.png" alt-text="System assigned managed identity":::  

3. A service principal for the Stream Analytics job's identity is created in Azure Active Directory. The life cycle of the newly created identity is managed by Azure. When the Stream Analytics job is deleted, the associated identity (that is, the service principal) is automatically deleted by Azure.  

   When you save the configuration, the Object ID (OID) of the service principal is listed as the Principal ID as shown below:  

   :::image type="content" source="media/event-hubs-managed-identity/principal-id.png" alt-text="Principal ID":::

   The service principal has the same name as the Stream Analytics job. For example, if the name of your job is `MyASAJob`, the name of the service principal is also `MyASAJob`.  

## Grant the Stream Analytics job permissions to access the Azure Cosmos DB account

For the Stream Analytics job to access your Cosmos DB using managed identity, the service principal you created must have special permissions to your Azure Cosmos DB account. In this step, you can assign a role to your stream analytics job's system-assigned managed identity. Azure Cosmos DB has multiple built-in roles that you can assign to the managed identity. For this solution, you can use the following two roles:

|Built-in role  |Description  |
|---------|---------|
|[DocumentDB Account Contributor](../role-based-access-control/built-in-roles.md#documentdb-account-contributor)|Can manage Azure Cosmos DB accounts. Allows retrieval of read/write keys. |
|[Cosmos DB Account Reader Role](../role-based-access-control/built-in-roles.md#cosmos-db-account-reader-role)|Can read Azure Cosmos DB account data. Allows retrieval of read keys. |

> [!TIP] 
> When you assign roles, assign only the needed access. If your service requires only reading data, then assign the **Cosmos DB Account Reader** role to the managed identity. For more information about the importance of least privilege access, see the [Lower exposure of privileged accounts](../security/fundamentals/identity-management-best-practices.md#lower-exposure-of-privileged-accounts) article.

1. Select **Access control (IAM)**.

2. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

3. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

    | Setting | Value |
    | --- | --- |
    | Role | DocumentDB Account Contributor |
    | Assign access to | User, group, or service principal |
    | Members | \<Name of your Stream Analytics job> |

    ![Screenshot that shows Add role assignment page in Azure portal.](../../includes/role-based-access-control/media/add-role-assignment-page.png)

> [!NOTE]
> Due to global replication or caching latency, there may be a delay when permissions are revoked or granted. Changes should be reflected within 8 minutes.


### Add the Cosmos DB as an output

Now that your managed identity is configured, you're ready to add the Cosmos DB resource as an output to your Stream Analytics job. 

1. Go to your Stream Analytics job and navigate to the **Outputs** page under **Job Topology**.

1. Select **Add > Cosmos DB**. In the output properties window, search and select your Cosmos DB account and select **Managed Identity: System assigned** from the *Authentication mode* drop-down menu.

1. Fill out the rest of the properties and select **Save**.

## Next steps

* [Understand outputs from Azure Stream Analytics](stream-analytics-define-outputs.md)
* [Azure Cosmos DB Output](azure-cosmos-db-output.md)
* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
* [Cosmos DB Optimization](stream-analytics-documentdb-output.md)
