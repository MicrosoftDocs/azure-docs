---
title: Configure Azure Monitor alerts for Application Gateway
description: Learn how to use ARM templates to configure Azure Monitor alerts for Application Gateway
author: greg-lindsay
ms.author: greglin
ms.service: application-gateway
ms.topic: how-to
ms.date: 03/03/2022
---

# Configure Azure Monitor alerts for Application Gateway


Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. For more information about Azure Monitor Alerts for Application Gateway, see [Monitoring Azure Application Gateway](monitor-application-gateway.md#alerts).

## Configure alerts using ARM templates

You can use ARM templates to quickly configure important alerts for Application Gateway. Before you begin, consider the following details:

- Azure Monitor alert rules are charged based on the type and number of signals it monitors. See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) before deploying for pricing information. Or you can see the estimated cost in the portal after deployment:
   :::image type="content" source="media/configure-alerts-with-templates/alert-pricing.png" alt-text="Image showing application gateway pricing details":::
- You need to create an Azure Monitor action group in advance and then use the Resource ID for as many alerts as you need. Azure Monitor alerts use this action group to notify users that an alert has been triggered. For more information, see [Create and manage action groups in the Azure portal](../azure-monitor/alerts/action-groups.md).
>[!TIP]
> You can manually form the ResourceID for your Action Group by following these steps.
> 1. Select Azure Monitor in your Azure portal.
> 1. Open the Alerts page and select Action Groups.
> 1. Select the action group to view its details.
> 1. Use the Resource Group Name, Action Group Name and Subscription Info here to form the ResourceID for the action group as shown here: <br>
> `/subscriptions/<subscription-id-from-your-account>/resourcegroups/<resource-group-name>/providers/microsoft.insights/actiongroups/<action-group-name>` 
- The templates for alerts described here are defined generically for settings like Severity, Aggregation Granularity, Frequency of Evaluation, Condition Type, and so on. You can modify the settings after deployment to meet your needs. See [detailed information about configuring a metric alert rule](../azure-monitor/alerts/alerts-create-new-alert-rule.md) for more information.
- The templates for metric-based alerts use the  **Dynamic threshold** value with [high sensitivity](../azure-monitor/alerts/alerts-dynamic-thresholds.md#known-issues-with-dynamic-threshold-sensitivity). You can choose to adjust these settings based on your needs.

## ARM templates

The following ARM templates are available to configure Azure Monitor alerts for Application Gateway.

### Alert for Backend Response Status as 5xx

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fdemos%2Fag-alert-backend-5xx%2Fazuredeploy.json)

This notification is based on Metrics signal.

### Alert for average Unhealthy Host Count

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fdemos%2Fag-alert-unhealthy-host%2Fazuredeploy.json)

This notification is based on Metrics signal.

### Alert for Backend Last Byte Response Time

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fdemos%2Fag-alert-backend-lastbyte-resp%2Fazuredeploy.json)

This notification is based on Metrics signal.

### Alert for Key Vault integration issues

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fdemos%2Fag-alert-keyvault-advisor%2Fazuredeploy.json)

This notification is based on its Azure Advisor recommendation.


## Next steps

<!-- Add additional links. You can change the wording of these and add more if useful.   -->

- See [Monitoring Application Gateway data reference](monitor-application-gateway-reference.md) for a reference of the metrics, logs, and other important values created by Application Gateway.

- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.
