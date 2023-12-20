---
title: Receive activity log alerts on Azure service notifications using Bicep
description: Get notified via SMS, email, or webhook when Azure service occurs using a Bicep file.
ms.date: 05/13/2022
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-bicep
---

# Quickstart: Create activity log alerts on service notifications using a Bicep file

This article shows you how to set up activity log alerts for service health notifications by using a Bicep file.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

Service health notifications are stored in the [Azure activity log](../azure-monitor/essentials/platform-logs-overview.md). Given the possibly large volume of information stored in the activity log, there is a separate user interface to make it easier to view and set up alerts on service health notifications.

You can receive an alert when Azure sends service health notifications to your Azure subscription. You can configure the alert based on:

- The class of service health notification (Service issues, Planned maintenance, Health advisories).
- The subscription affected.
- The service(s) affected.
- The region(s) affected.

> [!NOTE]
> Service health notifications does not send an alert regarding resource health events.

You also can configure who the alert should be sent to:

- Select an existing action group.
- Create a new action group (that can be used for future alerts).

To learn more about action groups, see [Create and manage action groups](../azure-monitor/alerts/action-groups.md).

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- To run the commands from your local computer, install Azure CLI or the Azure PowerShell modules. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli) and [Install Azure PowerShell](/powershell/azure/install-azure-powershell).

## Review the Bicep file

The following Bicep file creates an action group with an email target and enables all service health notifications for the target subscription. Save this Bicep as *CreateServiceHealthAlert.bicep*.

```bicep
param actionGroups_name string = 'SubHealth'
param activityLogAlerts_name string = 'ServiceHealthActivityLogAlert'
param emailAddress string

var alertScope = '/subscriptions/${subscription().subscriptionId}'

resource actionGroups_name_resource 'microsoft.insights/actionGroups@2019-06-01' = {
  name: actionGroups_name
  location: 'Global'
  properties: {
    groupShortName: actionGroups_name
    enabled: true
    emailReceivers: [
      {
        name: actionGroups_name
        emailAddress: emailAddress
      }
    ]
    smsReceivers: []
    webhookReceivers: []
  }
}

resource activityLogAlerts_name_resource 'microsoft.insights/activityLogAlerts@2017-04-01' = {
  name: activityLogAlerts_name
  location: 'Global'
  properties: {
    scopes: [
      alertScope
    ]
    condition: {
      allOf: [
        {
          field: 'category'
          equals: 'ServiceHealth'
        }
        {
          field: 'properties.incidentType'
          equals: 'Incident'
        }
      ]
    }
    actions: {
      actionGroups: [
        {
          actionGroupId: actionGroups_name_resource.id
          webhookProperties: {}
        }
      ]
    }
    enabled: true
  }
}

```

The Bicep file defines two resources:

- [Microsoft.Insights/actionGroups](/azure/templates/microsoft.insights/actiongroups)
- [Microsoft.Insights/activityLogAlerts](/azure/templates/microsoft.insights/activityLogAlerts)

## Deploy the Bicep file

Deploy the Bicep file using Azure CLI and Azure PowerShell. Replace the sample values for **Resource Group** and **emailAddress** with appropriate values for your environment.

# [CLI](#tab/CLI)

```azurecli
az login
az deployment group create --name CreateServiceHealthAlert --resource-group my-resource-group --template-file CreateServiceHealthAlert.bicep --parameters emailAddress='user@contoso.com'
```

# [PowerShell](#tab/PowerShell)

```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionName my-subscription
New-AzResourceGroupDeployment -Name CreateServiceHealthAlert -ResourceGroupName my-resource-group -TemplateFile CreateServiceHealthAlert.bicep -emailAddress user@contoso.com
```

---

## Validate the deployment

Verify that the workspace has been created using one of the following commands. Replace the sample values for **Resource Group** with the value you used above.

# [CLI](#tab/CLI)

```azurecli
az monitor activity-log alert show --resource-group my-resource-group --name ServiceHealthActivityLogAlert
```

# [PowerShell](#tab/PowerShell)

```powershell
Get-AzActivityLogAlert -ResourceGroupName my-resource-group -Name ServiceHealthActivityLogAlert
```

---

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the alert rule and the related resources. To delete the resource group by using Azure CLI or Azure PowerShell

# [CLI](#tab/CLI)

```azurecli
az group delete --name my-resource-group
```

# [PowerShell](#tab/PowerShell)

```powershell
Remove-AzResourceGroup -Name my-resource-group
```

---

## Next steps

- Learn about [best practices for setting up Azure Service Health alerts](https://www.microsoft.com/en-us/videoplayer/embed/RE2OtUa).
- Learn how to [setup mobile push notifications for Azure Service Health](https://www.microsoft.com/en-us/videoplayer/embed/RE2OtUw).
- Learn how to [configure webhook notifications for existing problem management systems](service-health-alert-webhook-guide.md).
- Learn about [service health notifications](service-notifications.md).
- Learn about [notification rate limiting](../azure-monitor/alerts/alerts-rate-limiting.md).
- Review the [activity log alert webhook schema](../azure-monitor/alerts/activity-log-alerts-webhook.md).
- Get an [overview of activity log alerts](../azure-monitor/alerts/alerts-overview.md), and learn how to receive alerts.
- Learn more about [action groups](../azure-monitor/alerts/action-groups.md).
