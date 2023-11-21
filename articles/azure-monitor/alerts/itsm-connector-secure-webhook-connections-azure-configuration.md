---
title: 'IT Service Management Connector: Secure Webhook in Azure Monitor - Azure configurations'
description: This article shows you how to configure Azure to connect your ITSM products or services with Secure Webhook in Azure Monitor to centrally monitor and manage ITSM work items.
ms.topic: conceptual
ms.date: 06/19/2023
ms.reviewer: nolavime

---

# Configure Azure to connect ITSM tools by using Secure Webhook

This article describes the required Azure configurations for using Secure Webhook.

<a name='register-with-azure-active-directory'></a>

## Register with Microsoft Entra ID

To register the application with Microsoft Entra ID:

1. Follow the steps in [Register an application with the Microsoft identity platform](../../active-directory/develop/quickstart-register-app.md).
1. In Microsoft Entra ID, select **Expose application**.
1. Select **Add** for **Application ID URI**.

   :::image type="content" source="media/itsm-connector-secure-webhook-connections-azure-configuration/azure-ad.png" lightbox="media/itsm-connector-secure-webhook-connections-azure-configuration/azure-ad.png" alt-text="Screenshot that shows the option for setting the U R I of the application I D.":::
1. Select **Save**.

## Define a service principal

The action group service is a first-party application. It has permission to acquire authentication tokens from your Microsoft Entra application to authenticate with ServiceNow.

As an optional step, you can define an application role in the created app's manifest. This way, you can further restrict access so that only certain applications with that specific role can send messages. This role has to be then assigned to the Action Group service principal. Tenant admin privileges are required.

You can do this step by using the same [PowerShell commands](../alerts/action-groups.md#secure-webhook-powershell-script).

## Create a Secure Webhook action group

After your application is registered with Microsoft Entra ID, you can create work items in your ITSM tool based on Azure alerts by using the Secure Webhook action in action groups.

Action groups provide a modular and reusable way of triggering actions for Azure alerts. You can use action groups with metric alerts, activity log alerts, and Log Analytics alerts in the Azure portal.

To learn more about action groups, see [Create and manage action groups in the Azure portal](../alerts/action-groups.md).

> [!NOTE]
> To map the configuration items to the ITSM payload when you define a Log Search alerts query, the query result must be included in the **Configuration items**, with one of these labels:
> - "Computer"
> - "Resource"
> - "_ResourceId"
> - "ResourceId”

To add a webhook to an action, follow these instructions for Secure Webhook:

1. In the [Azure portal](https://portal.azure.com/), search for and select **Monitor**. The **Monitor** pane consolidates all your monitoring settings and data in one view.
1. Select **Alerts** > **Manage actions**.
1. Select [Add action group](../alerts/action-groups.md#create-an-action-group-in-the-azure-portal) and fill in the fields.
1. Enter a name in the **Action group name** box and enter a name in the **Short name** box. The short name is used in place of a full action group name when notifications are sent by using this group.
1. Select **Secure Webhook**.
1. Select these details:
   1. Select the object ID of the Microsoft Entra instance that you registered.
   1. For the URI, paste in the webhook URL that you copied from the [ITSM tool environment](#configure-the-itsm-tool-environment).
   1. Set **Enable the common Alert Schema** to **Yes**.

   The following image shows the configuration of a sample Secure Webhook action:

   :::image type="content" source="media/itsm-connector-secure-webhook-connections-azure-configuration/secure-webhook.png" lightbox="media/itsm-connector-secure-webhook-connections-azure-configuration/secure-webhook.png" alt-text="Screenshot that shows a Secure Webhook action.":::

## Configure the ITSM tool environment
Secure Webhook supports connections with the following ITSM tools:
 * [ServiceNow](./itsmc-secure-webhook-connections-servicenow.md)
 * [BMC Helix](./itsmc-secure-webhook-connections-bmc.md)

To configure the ITSM tool environment:

1. Get the URI for the Secure Webhook definition.
1. Create definitions based on ITSM tool flow.

## Next steps

* [ServiceNow Secure Webhook configuration](./itsmc-secure-webhook-connections-servicenow.md)
* [BMC Secure Webhook configuration](./itsmc-secure-webhook-connections-bmc.md)
