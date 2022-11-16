---
title: Use managed identities to access Azure Data Explorer from an Azure Stream Analytics job
description: This article describes how to use managed identities to authenticate your Azure Stream Analytics job to an Azure Data Explorer output.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: how-to
ms.date: 10/27/2022
ms.custom: subject-rbac-steps
---

# Use managed identities to access Azure Data Explorer from an Azure Stream Analytics job

Azure Stream Analytics supports managed identity authentication for Azure Data Explorer output. Managed identities for Azure resources is a cross-Azure feature that enables you to create a secure identity associated with the deployment under which your application code runs. You can then associate that identity with access-control roles that grant custom permissions for accessing specific Azure resources that your application needs.

With managed identities, the Azure platform manages this runtime identity. You do not need to store and protect access keys in your application code or configuration, either for the identity itself, or for the resources you need to access. For more information on managed identities for Azure Stream Analytics, see [Managed identities for Azure Stream Analytics](stream-analytics-managed-identities-overview.md).

This article shows you how to enable system-assigned managed identity for an Azure Data Explorer output of a Stream Analytics job through the Azure portal. Before you can enable system-assigned managed identity, you must first have a Stream Analytics job and an Azure Data Explorer resource.

> [!NOTE] 
> Azure Data Explorer supports only managed identities. You will not be able to authenticate to your Azure Data Explorer clusters with connection string.

## Create a managed identity  

First, you create a managed identity for your Azure Stream Analytics job.  

1. In the Azure portal, open your Azure Stream Analytics job.  

2. From the left navigation menu, select **Managed Identity** located under *Configure*. Then, check the box next to **Use System-assigned Managed Identity** and select **Save**.

   :::image type="content" source="media/event-hubs-managed-identity/system-assigned-managed-identity.png" alt-text="Screenshot of the Azure portal showing where to select managed identity in your stream analytics job.":::  

3. A service principal for the Stream Analytics job's identity is created in Azure Active Directory. The life cycle of the newly created identity is managed by Azure. When the Stream Analytics job is deleted, the associated identity (that is, the service principal) is automatically deleted by Azure.  

   When you save the configuration, the Object ID (OID) of the service principal is listed as the Principal ID as shown below:  

   :::image type="content" source="media/event-hubs-managed-identity/principal-id.png" alt-text="Screenshot of the Azure portal showing how to select the Principal ID of your stream analytics job.":::

   The service principal has the same name as the Stream Analytics job. For example, if the name of your job is `MyASAJob`, the name of the service principal is also `MyASAJob`.  

## Grant the Stream Analytics job permissions to access Azure Data Explorer

For the Stream Analytics job to access your Azure Data Explorer cluster using managed identity, the service principal you created must have special permissions to your Azure Data Explorer resource. In this step, you can assign a role to your stream analytics job's system-assigned managed identity. Azure provides the below Azure built-in roles for authorizing access to an Azure Data Explorer namespace. For Azure Stream Analytics you would need these roles:

| Role          | Permissions                                                                         |
|---------------|-------------------------------------------------------------------------------------|
| Data ingestor | Can ingest data into all existing tables in the database, but can't query the data. |
| Data monitor  | Can execute .show commands in the context of the database and its child entities.   |

1. Select **Access control (IAM)**.

2. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

3. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

    | Setting | Value |
    | --- | --- |
    | Role | Data ingestor and Data monitor |
    | Assign access to | User, group, or service principal |
    | Members | \<Name of your Stream Analytics job> |

    ![Screenshot that shows Add role assignment page in Azure portal.](../../includes/role-based-access-control/media/add-role-assignment-page.png)

> [!NOTE]
> Due to global replication or caching latency, there may be a delay when permissions are revoked or granted. Changes should be reflected within 8 minutes.


### Add Azure Data Explorer as an output

Now that your managed identity is configured, you're ready to add the Azure Data Explorer resource as an output to your Stream Analytics job. 

1. Go to your Stream Analytics job and navigate to the **Outputs** page under **Job Topology**.

1. Select **Add > Azure Data Explorer**. In the output properties window, search and select your Azure Data Explorer (kusto) cluster or type in the URL of your cluster and select **Managed Identity: System assigned** from the *Authentication mode* drop-down menu.

1. Fill out the rest of the properties and select **Save**.


## Next steps

* [Understand outputs from Azure Stream Analytics](stream-analytics-define-outputs.md)
* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
