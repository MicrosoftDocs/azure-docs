---
title: Request just-in-time access for Azure Managed Applications
description: Describes how publishers of Azure Managed Applications request just-in-time access to a managed application.
author: tfitzmac
ms.service: managed-applications
ms.topic: conceptual
ms.date: 05/30/2019
ms.author: tomfitz
---
# Request just-in-time access for Azure Managed Applications

Not all consumers of Managed Applications want their service providers to have standing high-level access for their resources and not all service providers want standing high-level access for their support teams. Instead, Just-in-time (JIT) access allows service providers to request temporary elevated access to a managed application’s resources for troubleshooting or maintaining a customer’s Managed App. Publishers can now enable the JIT capability on their Managed Applications offerings to provide JIT enabled Managed Applications, giving them standing read-only access with the ability to elevate access for a period of time on request. 
Publishing JIT Capable Managed Applications
To learn more about publishing your first Managed Application offer to the Azure Marketplace, please read Azure Managed Applications in the Marketplace.

## Prepare your managed application Package for JIT access

Note: The schema mentioned in this section for CreateUiDefinition.json file is not final – there could be changes to this schema as appropriate in the future iterations.

To support JIT capability for your offer, add the following content to your CreateUiDefinition.json file:
 
In "steps":

```json
{
    "name": "jitConfiguration",
    "label": "JIT Configuration",
    "subLabel": {
        "preValidation": "Configure JIT settings for you application",
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
"jitAccessPolicy": "[parse(concat('{\"jitAccessEnabled\":', string(steps('jitConfiguration').jitConfigurationControl.jitEnabled), ',\"jitApprovalMode\":\"', steps('jitConfiguration').jitConfigurationControl.jitApprovalMode, '\",\"maximumJitAccessDuration\":\"', steps('jitConfiguration').jitConfigurationControl.maxAccessDuration, '\",\"jitApprovers\":', string(steps('jitConfiguration').jitConfigurationControl.approvers), '}'))]"
```

## Enable JIT access in marketplace

When defining your offering in the marketplace, make sure you enable JIT access.

1. Sign in to the [Cloud Partner publishing portal](https://cloudpartner.azure.com).

1. Provide values to publish your managed application in the marketplace. Select **Yes** for **Enable JIT Access**.

   ![Enable just-in-time access](./media/request-just-in-time-access/marketplace-enable.png)

## Request access

To send a JIT access request:

1. Select **JIT Access** for the managed application you need to access. 

1. Select **Eligible Roles**, and select **Activate** in the ACTION column for the role you want.

   ![Activate request for access](./media/request-just-in-time-access/send-request.png)

1. On the **Activate Role** form, select a start time and duration for your role to be active. Select **Activate** to send the request.

   ![Activate access](./media/request-just-in-time-access/activate-access.png) 

1. View the notifications to see that the new JIT request is successfully sent to the consumer.

   ![Notification](./media/request-just-in-time-access/in-progress.png)

1. To view the status of all JIT requests for a managed application, select **JIT Access** and **Request History**.

   ![View status](./media/request-just-in-time-access/view-status.png)

## Known issues

The principal ID of the account requesting JIT access must be explicitly included in the application package. The account can't only be included through a group that is specified in the package. This is a temporary limitation that will be fixed in a future release.

## Next steps

To learn about approving requests for JIT access, see [Approve just-in-time access in Azure Managed Applications](approve-just-in-time-access.md).
