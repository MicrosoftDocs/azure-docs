---
title: Use autoscale to send email and webhook alert notifications
description: Learn how to use autoscale actions to call web URLs or send email notifications in Azure Monitor.
author: EdB-MSFT
ms.author: edbaynash
ms.topic: conceptual
ms.date: 06/21/2023
ms.subservice: autoscale
ms.reviewer: akkumari
---
# Use autoscale actions to send email and webhook alert notifications in Azure Monitor
This article shows you how to set up notifications so that you can call specific web URLs or send emails based on autoscale actions in Azure.

## Webhooks
Webhooks allow you to send HTTP requests to a specific URL endpoint (callback URL) when a certain event or trigger occurs. Using webhooks, you can automate and streamline processes by enabling the automatic exchange of information between different systems or applications. Use webhooks to trigger custom code, notifications, or other actions to run when an autoscale event occurs.

## Email
You can send email to any valid email address when an autoscale event occurs. Administrators and co-administrators of the subscription where the rule is running are also notified.

## Configure Notifications

Use the Azure portal, CLI, PowerShell, or Resource Manager templates to configure notifications.

### [Portal](#tab/portal)

### Set up notifications using the Azure portal.

Select the **Notify** tab on the autoscale settings page to configure notifications.

Select the check boxes to send an email to the subscription administrator or co-administrators.   You can also enter a list of email addresses to send notifications to.
  
Enter a webhook URI to send a notification to a web service. You can also add custom headers to the webhook request. For example, you can add an authentication token in the header, query parameters, or add a custom header to identify the source of the request.

:::image type="content" source="./media/autoscale-webhook-email/autoscale-notify.png" lightbox="./media/autoscale-webhook-email/autoscale-notify.png" alt-text="A screenshot showing the notify tab on the autoscale settings page.":::


### [CLI](#tab/cli)

### Use CLI to configure notifications.

Use the `az monitor autoscale update` or the `az monitor autoscale create` command to configure notifications using Azure CLI.  

The following parameters are used to configure notifications:

+ `--add-action` - The action to take when the autoscale rule is triggered. The value must be `email` or `webhook`.
+ `--email-administrator {false, true}` - Send email to the subscription administrator.
+ `--email-coadministrators {false, true}` - Send email to the subscription co-administrators.
+ `--remove-action` - Remove an action previously added by `--add-action`. The value must be `email` or `webhook`. The parameter is only relevant for the  `az monitor autoscale update` command.


For example, the following command adds an email notification and a webhook notification to and existing autoscale setting. The command also sends email to the subscription administrator.  

```azurecli
 az monitor autoscale update \
--resource-group <resource group name> \
--name <autoscale setting name> \
--email-administrator true \
--add-action email pdavis@contoso.com \
--add-action webhook http://myservice.com/webhook-listerner-123
```

> [!NOTE]
> You can add mote than one email or webhook notification by using the `--add-action` parameter multiple times. While multiple webhook notifications are supported and can be seen in the JSON, the portal only shows the first webhook.


For more information, see [az monitor autoscale](/cli/azure/monitor/autoscale).



### [PowerShell](#tab/powershell)

### Use PowerShell to configure notifications. 

The following example shows how to configure a webhook and email notification.

1. Create the webhook object.

1. Create the notification object.
1. Add the notification object to the autoscale setting using `New-AzAutoscaleSetting` or `Update-AzAutoscaleSetting` cmdlets.

```powershell
# Assumining you have already created a profile object and have a vmssName, resourceGroup, and subscriptionId

 $webhook=New-AzAutoscaleWebhookNotificationObject  `
-Property @{"method"='GET'; "headers"= '"Authorization", "tokenvalue-12345678abcdef"'} `
-ServiceUri "http://myservice.com/webhook-listerner-123"

$notification=New-AzAutoscaleNotificationObject `
-EmailCustomEmail "pdavis@contoso.com" `
-EmailSendToSubscriptionAdministrator $true ` -EmailSendToSubscriptionCoAdministrator $true `
-Webhook $webhook


New-AzAutoscaleSetting -Name autoscalesetting2 `
-ResourceGroupName $resourceGroup `
-Location eastus `
-Profile $profile `
-Enabled -Notification $notification `
-PropertiesName "autoscalesetting" `
-TargetResourceUri "/subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/$vmssName"
```


### [Resource Manager](#tab/resourcemanager)

### Use Resource Manager templates to configure notifications.

When you use the Resource Manager templates or REST API, include the `notifications` element in your [autoscale settings](/azure/templates/microsoft.insights/autoscalesettings?pivots=deployment-language-arm-template#resource-format-1), for example:

```JSON
"notifications": [
      {
        "operation": "Scale",
        "email": {
          "sendToSubscriptionAdministrator": false,
          "sendToSubscriptionCoAdministrators": false,
          "customEmails": [
              "user1@mycompany.com",
              "user2@mycompany.com"
              ]
        },
        "webhooks": [
          {
            "serviceUri": "https://my.webhook.example.com?token=abcd1234",
            "properties": {
              "optional_key1": "optional_value1",
              "optional_key2": "optional_value2"
            }
          }
        ]
      }
    ]
```

| Field | Mandatory | Description |
| --- | --- | --- |
| operation |Yes |Value must be "Scale." |
| sendToSubscriptionAdministrator |Yes |Value must be "true" or "false." |
| sendToSubscriptionCoAdministrators |Yes |Value must be "true" or "false." |
| customEmails |Yes |Value can be null [] or a string array of emails. |
| webhooks |Yes |Value can be null or valid URI. |
| serviceUri |Yes |Valid HTTPS URI. |
| properties |Yes |Value must be empty {} or can contain key-value pairs. |

---

## Authentication in webhooks
The webhook can authenticate by using token-based authentication, where you save the webhook URI with a token ID as a query parameter. For example,  `https://mysamplealert/webcallback?tokenid=123-abc456-7890&myparameter2=value123`.

## Autoscale notification webhook payload schema
When the autoscale notification is generated, the following metadata is included in the webhook payload:

```JSON
{
    "version": "1.0",
    "status": "Activated",
    "operation": "Scale Out",
    "context": {
        "timestamp": "2023-06-22T07:01:47.8926726Z",
        "id": "/subscriptions/123456ab-9876-a1b2-a2b1-123a567b9f8767/resourceGroups/rg-001/providers/microsoft.insights/autoscalesettings/AutoscaleSettings-002",
        "name": "AutoscaleSettings-002",
        "details": "Autoscale successfully started scale operation for resource 'ScaleableAppServicePlan' from capacity '1' to capacity '2'",
        "subscriptionId": "123456ab-9876-a1b2-a2b1-123a567b9f8767",
        "resourceGroupName": "rg-001",
        "resourceName": "ScaleableAppServicePlan",
        "resourceType": "microsoft.web/serverfarms",
        "resourceId": "/subscriptions/123456ab-9876-a1b2-a2b1-123a567b9f8767/resourceGroups/rg-001/providers/Microsoft.Web/serverfarms/ScaleableAppServicePlan",
        "portalLink": "https://portal.azure.com/#resource/subscriptions/123456ab-9876-a1b2-a2b1-123a567b9f8767/resourceGroups/rg-001/providers/Microsoft.Web/serverfarms/ScaleableAppServicePlan",
        "resourceRegion": "West Central US",
        "oldCapacity": "1",
        "newCapacity": "2"
    },
    "properties": {
        "key1": "value1",
        "key2": "value2"
    }   
}
```

| Field | Mandatory | Description |
| --- | --- | --- |
| status |Yes |Status that indicates that an autoscale action was generated. |
| operation |Yes |For an increase of instances, it's' "Scale Out." For a decrease in instances, it's' "Scale In." |
| context |Yes |Autoscale action context. |
| timestamp |Yes |Time stamp when the autoscale action was triggered. |
| id |Yes |Resource Manager ID of the autoscale setting. |
| name |Yes |Name of the autoscale setting. |
| details |Yes |Explanation of the action that the autoscale service took and the change in the instance count. |
| subscriptionId |Yes |Subscription ID of the target resource that's being scaled. |
| resourceGroupName |Yes |Resource group name of the target resource that's being scaled. |
| resourceName |Yes |Name of the target resource that's being scaled. |
| resourceType |Yes |Three supported values: "microsoft.classiccompute/domainnames/slots/roles" - Azure Cloud Services roles, "microsoft.compute/virtualmachinescalesets" - Azure Virtual Machine Scale Sets, and "Microsoft.Web/serverfarms" - Web App feature of Azure Monitor. |
| resourceId |Yes |Resource Manager ID of the target resource that's being scaled. |
| portalLink |Yes |Azure portal link to the summary page of the target resource. |
| oldCapacity |Yes |Current (old) instance count when autoscale took a scale action. |
| newCapacity |Yes |New instance count to which autoscale scaled the resource. |
| properties |No |Optional. Set of <Key, Value> pairs (for example, Dictionary <String, String>). The properties field is optional. In a custom user interface or logic app-based workflow, you can enter keys and values that can be passed by using the payload. An alternate way to pass custom properties back to the outgoing webhook call is to use the webhook URI itself (as query parameters). |
