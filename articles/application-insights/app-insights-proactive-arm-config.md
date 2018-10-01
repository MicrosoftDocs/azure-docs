---
title: Configure Azure Application Insights smart detection rule settings with Azure Resource Manager templates | Microsoft Docs
description: Automate management and configuration of Azure Application Insights smart detection rules with Azure Resource Manager Templates
services: application-insights
documentationcenter: ''
author: harelbr
manager: carmonm

ms.assetid: ea2a28ed-4cd9-4006-bd5a-d4c76f4ec20b
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: conceptual
ms.date: 07/19/2018
ms.reviewer: mbullwin
ms.author: harelbr

---

# Manage Application Insights smart detection rules using Azure Resource Manager templates

Smart detection rules in Application Insights can be managed and configured using [Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md).
This method can be used when deploying new Application Insights resources with Azure Resource Manager automation, or for modifying the settings of existing resources.

## Smart detection rule configuration

You can configure the following settings for a smart detection rule:
- If the rule is enabled (the default is **true**.)
- If emails should be sent to the subscription owners, contributors and readers when a detection is found (the default is **true**.)
- Any additional email recipients who should get a notification when a detection is found.

To allow configuring the rule settings via Azure Resource Manager, the smart detection rule configuration is now available as an inner resource within the Application Insights resource, named **ProactiveDetectionConfigs**.
For maximal flexibility, each smart detection rule can be configured with unique notification settings.

## Examples

Below are a few examples showing how to configure the settings of smart detection rules using Azure Resource Manager templates.
All samples refer to an Application Insights resource named _“myApplication”_, and to the "long dependency duration smart detection rule", which is internally named _“longdependencyduration”_.
Make sure to replace the Application Insights resource name, and to specify the relevant smart detection rule internal name. Check the table below for a list of the corresponding internal Azure Resource Manager names for each smart detection rule.

### Disable a smart detection rule

```json
{
      "apiVersion": "2018-05-01-preview",
      "name": "myApplication",
      "type": "Microsoft.Insights/components",
      "location": "[resourceGroup().location]",
      "properties": {
        "ApplicationId": "myApplication"
      },
      "resources": [
        {
          "apiVersion": "2018-05-01-preview",
          "name": "longdependencyduration",
          "type": "ProactiveDetectionConfigs",
          "location": "[resourceGroup().location]",
          "dependsOn": [
            "[resourceId('Microsoft.Insights/components', 'myApplication')]"
          ],
          "properties": {
            "name": "longdependencyduration",
            "sendEmailsToSubscriptionOwners": true,
            "customEmails": [],
            "enabled": false
          }
        }
      ]
    }
```

### Disable sending email notifications for a smart detection rule

```json
{
      "apiVersion": "2018-05-01-preview",
      "name": "myApplication",
      "type": "Microsoft.Insights/components",
      "location": "[resourceGroup().location]",
      "properties": {
        "ApplicationId": "myApplication"
      },
      "resources": [
        {
          "apiVersion": "2018-05-01-preview",
          "name": "longdependencyduration",
          "type": "ProactiveDetectionConfigs",
          "location": "[resourceGroup().location]",
          "dependsOn": [
            "[resourceId('Microsoft.Insights/components', 'myApplication')]"
          ],
          "properties": {
            "name": "longdependencyduration",
            "sendEmailsToSubscriptionOwners": false,
            "customEmails": [],
            "enabled": true
          }
        }
      ]
    }
```

### Add additional email recipients for a smart detection rule

```json
{
      "apiVersion": "2018-05-01-preview",
      "name": "myApplication",
      "type": "Microsoft.Insights/components",
      "location": "[resourceGroup().location]",
      "properties": {
        "ApplicationId": "myApplication"
      },
      "resources": [
        {
          "apiVersion": "2018-05-01-preview",
          "name": "longdependencyduration",
          "type": "ProactiveDetectionConfigs",
          "location": "[resourceGroup().location]",
          "dependsOn": [
            "[resourceId('Microsoft.Insights/components', 'myApplication')]"
          ],
          "properties": {
            "name": "longdependencyduration",
            "sendEmailsToSubscriptionOwners": true,
            "customEmails": ['alice@contoso.com', 'bob@contoso.com'],
            "enabled": true
          }
        }
      ]
    }

```

## Smart detection rule names

Below is a table of smart detection rule names as they appear in the portal, along with their internal names, that should be used in the Azure Resource Manager template.

> [!NOTE]
> Smart detection rules marked as preview don’t support email notifications. Therefore, you can only set the enabled property for these rules. 

| Azure portal rule name | Internal name
|:---|:---|
| Slow page load time |	slowpageloadtime |
| Slow server response time | slowserverresponsetime |
| Long dependency duration | longdependencyduration |
| Degradation in server response time | degradationinserverresponsetime |
| Degradation in dependency duration | degradationindependencyduration |
| Degradation in trace severity ratio (preview) | extension_traceseveritydetector |
| Abnormal rise in exception volume (preview) | extension_exceptionchangeextension |
| Potential memory leak detected (preview) | extension_memoryleakextension |
| Potential security issue detected (preview) | extension_securityextensionspackage |
| Resource utilization issue detected (preview) | extension_resourceutilizationextensionspackage |

## Next Steps

Learn more about automatically detecting:

- [Failure anomalies](app-insights-proactive-failure-diagnostics.md)
- [Memory Leaks](app-insights-proactive-potential-memory-leak.md)
- [Performance anomalies](app-insights-proactive-performance-diagnostics.md)