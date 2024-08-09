---
title: Configure Azure Monitor alerts for Application Gateway
description: Learn how to use ARM templates to configure Azure Monitor alerts for Application Gateway
author: greg-lindsay
ms.author: greglin
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 06/17/2024
---

# Configure Azure Monitor alerts for Application Gateway

Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address issues in your system before your customers notice them. For more information about Azure Monitor Alerts for Application Gateway, see [Monitoring Azure Application Gateway](monitor-application-gateway.md#alerts).

The templates for alerts described here are defined generically for settings like Severity, Aggregation Granularity, Frequency of Evaluation, Condition Type, and so on. You can modify the settings after deployment to meet your needs. See [detailed information about configuring a metric alert rule](../azure-monitor/alerts/alerts-create-new-alert-rule.md) for more information.

The templates for metric-based alerts use the  **Dynamic threshold** value with [high sensitivity](../azure-monitor/alerts/alerts-dynamic-thresholds.md#known-issues-with-dynamic-threshold-sensitivity). You can choose to adjust these settings based on your needs.

The following ARM templates are available to configure Azure Monitor alerts for Application Gateway. For the procedure to use these templates, see [Create a new alert rule using an ARM template](../azure-monitor/alerts/alerts-create-rule-cli-powershell-arm.md#create-a-new-alert-rule-using-an-arm-template).

- Alert for Backend Response Status as 5xx

  [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fdemos%2Fag-alert-backend-5xx%2Fazuredeploy.json)

  This notification is based on Metrics signal.

- Alert for average Unhealthy Host Count

  [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fdemos%2Fag-alert-unhealthy-host%2Fazuredeploy.json)

  This notification is based on Metrics signal.

- Alert for Backend Last Byte Response Time

  [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fdemos%2Fag-alert-backend-lastbyte-resp%2Fazuredeploy.json)

  This notification is based on Metrics signal.

- Alert for Key Vault integration issues

  [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fdemos%2Fag-alert-keyvault-advisor%2Fazuredeploy.json)

  This notification is based on its Azure Advisor recommendation.

## Related content

- See [Monitoring Application Gateway data reference](monitor-application-gateway-reference.md) for a reference of the metrics, logs, and other important values created by Application Gateway.

- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.
