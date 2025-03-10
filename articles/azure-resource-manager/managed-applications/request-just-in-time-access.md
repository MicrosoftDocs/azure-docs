---
title: Request just-in-time access
description: Describes how publishers of Azure Managed Applications request just-in-time access to a managed application.
ms.topic: conceptual
ms.date: 06/24/2024
---

# Enable and request just-in-time access for Azure Managed Applications

Consumers of your managed application might be reluctant to grant you permanent access to the managed resource group. As a publisher of a managed application, you might prefer that consumers know exactly when you need to access the managed resources. To give consumers greater control over granting access to managed resources, Azure Managed Applications provides a feature called just-in-time (JIT) access.

JIT access enables you to request elevated access to a managed application's resources for troubleshooting or maintenance. You always have read-only access to the resources, but for a specific time period you can have greater access.

The work flow for granting access is:

1. You add a managed application to the marketplace and specify that JIT access is available.

1. During deployment, the consumer enables JIT access for that instance of the managed application.

1. After deployment, the consumer can change the settings for JIT access.

1. You send a request for access when you need to troubleshoot or update the managed resources.

1. The consumer approves your request.

This article focuses on the actions publishers take to enable JIT access and submit requests. To learn about approving JIT access requests, see [Approve just-in-time access in Azure Managed Applications](approve-just-in-time-access.md).

## Add JIT access step to UI

In your CreateUiDefinition.json file, include a step that lets consumers enable JIT access. To support JIT capability for your offer, add the following content to your CreateUiDefinition.json file.

In "steps":

```json
{
  "name": "jitConfiguration",
  "label": "JIT Configuration",
  "subLabel": {
    "preValidation": "Configure JIT settings for your application",
    "postValidation": "Done"
  },
  "bladeTitle": "JIT Configuration",
  "elements": [
    {
      "name": "jitConfigurationControl",
      "type": "Microsoft.Solutions.JitConfigurator",
      "label": "JIT Configuration"
    }
  ]
}
```

In "outputs":

```json
"jitAccessPolicy": "[steps('jitConfiguration').jitConfigurationControl]"
```

## Enable JIT access

When creating your offer in Partner Center, make sure you enable JIT access.

1. Sign in to the Commercial Marketplace portal in [Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace/overview).

1. For guidance creating a new managed application, follow the steps in [Create an Azure application offer](../../marketplace/azure-app-offer-setup.md).

1. On the **Technical configuration** page, select the **Enable just-in-time (JIT) access** checkbox.

   :::image type="content" source="./media/request-just-in-time-access/enable-just-in-time-access.png" alt-text="Enable just-in-time access":::

You added a JIT configuration step to your UI, and enabled JIT access in the commercial marketplace offering. When consumers deploy your managed application, they can [turn on JIT access for their instance](approve-just-in-time-access.md#enable-during-deployment).

## Request access

When you need to access the consumer's managed resources, you send a request for a specific role, time, and duration. The consumer must then approve the request.

To send a JIT access request:

1. Select **JIT Access** for the managed application you need to access.

1. Select **Eligible Roles**, and select **Activate** in the ACTION column for the role you want.

   ![Activate request for access](./media/request-just-in-time-access/send-request.png)

1. On the **Activate Role** form, select a start time and duration for your role to be active. Select **Activate** to send the request.

   ![Activate access](./media/request-just-in-time-access/activate-access.png)

1. View the notifications to see that the new JIT request is successfully sent to the consumer.

   ![Notification](./media/request-just-in-time-access/in-progress.png)

   Now, you must wait for the consumer to [approve your request](approve-just-in-time-access.md#approve-requests).

1. To view the status of all JIT requests for a managed application, select **JIT Access** and **Request History**.

   ![View status](./media/request-just-in-time-access/view-status.png)

## Known issues

The principal ID of the account requesting JIT access must be explicitly included in the managed application definition. The account can't only be included through a group that is specified in the package. This limitation will be fixed in a future release.

## Next steps

To learn about approving requests for JIT access, see [Approve just-in-time access in Azure Managed Applications](approve-just-in-time-access.md).
