---
title: 'Smart detection rule settings: Application Insights'
description: Automate management and configuration of Application Insights smart detection rules with Azure Resource Manager templates.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 02/14/2021
ms.reviewer: yagil
---
# Manage Application Insights smart detection rules by using Azure Resource Manager templates

>[!NOTE]
>You can migrate your Application Insight resources to alerts-based smart detection (preview). The migration creates alert rules for the different smart detection modules. After you create the rules, you can manage and configure them like any other Azure Monitor alert rules. You can also configure action groups for these rules to enable multiple methods of taking actions or triggering notification on new detections.
>
> For more information on the migration process and the behavior of smart detection after the migration, see [Smart detection alerts migration](./alerts-smart-detections-migration.md).
>

 You can manage and configure smart detection rules in Application Insights by using [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md).

You can use this method when you deploy new Application Insights resources with Resource Manager automation or when you modify the settings of existing resources.

## Smart detection rule configuration

You can configure the following settings for a smart detection rule:
- If the rule is enabled. (The default is **true**.)
- If emails should be sent to users associated to the subscription's [Monitoring Reader](../../role-based-access-control/built-in-roles.md#monitoring-reader) and [Monitoring Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) roles when a detection is found. (The default is **true**.)
- Any other email recipients who should get a notification when a detection is found.
    - Email configuration isn't available for smart detection rules marked as _preview_.

To allow configuring the rule settings via Resource Manager, the smart detection rule configuration is available as an inner resource within the Application Insights resource. It's named **ProactiveDetectionConfigs**.

For maximal flexibility, you can configure each smart detection rule with unique notification settings.

## Examples

The following examples show how to configure the settings of smart detection rules by using Resource Manager templates.

All samples refer to an Application Insights resource named _"myApplication"_. They also refer to the "long dependency duration smart detection rule." It's internally named _"longdependencyduration"_.

Make sure to replace the Application Insights resource name and to specify the relevant smart detection rule internal name. Check the following table for a list of the corresponding internal Resource Manager names for each smart detection rule.

### Disable a smart detection rule

```json
{
      "apiVersion": "2018-05-01-preview",
      "name": "myApplication",
      "type": "Microsoft.Insights/components",
      "location": "[resourceGroup().location]",
      "properties": {
        "Application_Type": "web"
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
        "Application_Type": "web"
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

### Add more email recipients for a smart detection rule

```json
{
      "apiVersion": "2018-05-01-preview",
      "name": "myApplication",
      "type": "Microsoft.Insights/components",
      "location": "[resourceGroup().location]",
      "properties": {
        "Application_Type": "web"
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
            "customEmails": ["alice@contoso.com", "bob@contoso.com"],
            "enabled": true
          }
        }
      ]
    }

```

## Smart detection rule names

The following table shows smart detection rule names as they appear in the portal. The table also shows their internal names to use in the Resource Manager template.

> [!NOTE]
> Smart detection rules marked as _preview_ don't support email notifications. You can only set the _enabled_ property for these rules.

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
| Abnormal rise in daily data volume (preview) | extension_billingdatavolumedailyspikeextension |

### Failure Anomalies alert rule

This Resource Manager template demonstrates how to configure a Failure Anomalies alert rule with a severity of 2.

> [!NOTE]
> Failure Anomalies is a global service, so rule location is created on the global location.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "microsoft.alertsmanagement/smartdetectoralertrules",
            "apiVersion": "2019-03-01",
            "name": "Failure Anomalies - my-app",
            "location": "global", 
            "properties": {
                  "description": "Failure Anomalies notifies you of an unusual rise in the rate of failed HTTP requests or dependency calls.",
                  "state": "Enabled",
                  "severity": "2",
                  "frequency": "PT1M",
                  "detector": {
                  "id": "FailureAnomaliesDetector"
                  },
                  "scope": ["/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/MyResourceGroup/providers/microsoft.insights/components/my-app"],
                  "actionGroups": {
                        "groupIds": ["/subscriptions/00000000-1111-2222-3333-444444444444/resourcegroups/MyResourceGroup/providers/microsoft.insights/actiongroups/MyActionGroup"]
                  }
            }
        }
    ]
}
```

> [!NOTE]
> This Resource Manager template is unique to the Failure Anomalies alert rule and is different from the other classic smart detection rules described in this article. If you want to manage Failure Anomalies manually, use Azure Monitor alerts. All other smart detection rules are managed in the **Smart Detection** pane of the UI.

## Next steps

Learn more about automatically detecting:

- [Failure anomalies](./proactive-failure-diagnostics.md)
- [Memory leaks](./proactive-potential-memory-leak.md)
- [Performance anomalies](./smart-detection-performance.md)
