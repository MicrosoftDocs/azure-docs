---
title: Use managed identities to access Event Hubs from an Azure Stream Analytics job
description: This article describes how to use managed identities to authenticate your Azure Stream Analytics job to Azure Event Hubs input and output.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: how-to
ms.date: 05/15/2023
ms.custom: subject-rbac-steps
---

# Use managed identities to access Event Hubs  from an Azure Stream Analytics job

Azure Stream Analytics supports Managed Identity authentication for both Azure Event Hubs input and output. Managed identities eliminate the limitations of user-based authentication methods, like the need to reauthenticate because of password changes or user token expirations that occur every 90 days. When you remove the need to manually authenticate, your Stream Analytics deployments can be fully automated.  

A managed identity is a managed application registered in Microsoft Entra ID that represents a given Stream Analytics job. The managed application is used to authenticate to a targeted resource, including event hubs that are behind a firewall or virtual network (VNet). For more information about how to bypass firewalls, see [Allow access to Azure Event Hubs namespaces via private endpoints](../event-hubs/private-link-service.md#trusted-microsoft-services).

This article shows you how to enable Managed Identity for an event hub input or output of a Stream Analytics job through the Azure portal. Before you enabled Managed Identity, you must first have a Stream Analytics job and an Event Hubs resource.

## Create a managed identity  

First, you create a managed identity for your Azure Stream Analytics job.  

1. In the Azure portal, open your Azure Stream Analytics job.  

1. From the left navigation menu, select **Managed Identity** located under *Configure*. Then, check the box next to **Use System-assigned Managed Identity** and select **Save**.

   :::image type="content" source="media/event-hubs-managed-identity/system-assigned-managed-identity.png" alt-text="System assigned managed identity":::  

1. A service principal for the Stream Analytics job's identity is created in Microsoft Entra ID. The life cycle of the newly created identity is managed by Azure. When the Stream Analytics job is deleted, the associated identity (that is, the service principal) is automatically deleted by Azure.  

   When you save the configuration, the Object ID (OID) of the service principal is listed as the Principal ID as shown below:  

   :::image type="content" source="media/event-hubs-managed-identity/principal-id.png" alt-text="Principal ID":::

   The service principal has the same name as the Stream Analytics job. For example, if the name of your job is `MyASAJob`, the name of the service principal is also `MyASAJob`.  

## Grant the Stream Analytics job permissions to access Event Hubs

For the Stream Analytics job to access your event hub using managed identity, the service principal you created must have special permissions to the event hub.

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

> [!NOTE]
> When giving access to any resource, you should give the least needed access. Depending on whether you are configuring Event Hubs as an input or output, you may not need to assign the Azure Event Hubs Data Owner role which would grant more than needed access to your Eventhub resource. For more information see [Authenticate an application with Microsoft Entra ID to access Event Hubs resources](../event-hubs/authenticate-application.md)

 | Setting | Value |
 | --- | --- |
 | Role | Azure Event Hubs Data Owner |
 | Assign access to | User, group, or service principal |
 | Members | \<Name of your Stream Analytics job> |

 ![Screenshot that shows Add role assignment page in Azure portal.](../../includes/role-based-access-control/media/add-role-assignment-page.png)

You can also grant this role at the Event Hubs Namespace level, which will naturally propagate the permissions to all event hubs created under it. That is, all event hubs under a Namespace can be used as a managed-identity-authenticating resource in your Stream Analytics job.

> [!NOTE]
> Due to global replication or caching latency, there may be a delay when permissions are revoked or granted. Changes should be reflected within 8 minutes.

## Create an Event Hubs input or output  

Now that your managed identity is configured, you're ready to add the event hub  resource as an input or output to your Stream Analytics job.  

### Add Event Hubs as an input 

1. Go to your Stream Analytics job and navigate to the **Inputs** page under **Job Topology**.

1. Select **Add Stream Input > Event Hub**. In the input properties window, search and select your event hub and select **Managed Identity** from the *Authentication mode* drop-down menu.

1. Fill out the rest of the properties and select **Save**.

### Add Event Hubs as an output

1. Go to your Stream Analytics job and navigate to the **Outputs** page under **Job Topology**.

1. Select **Add > Event Hub**. In the output properties window, search and select your event hub and select **Managed Identity** from the *Authentication mode* drop-down menu.

1. Fill out the rest of the properties and select **Save**.

## Next steps

* [Event Hubs output from Azure Stream Analytics](event-hubs-output.md)
* [Stream data from Event Hubs](stream-analytics-define-inputs.md#stream-data-from-event-hubs)
