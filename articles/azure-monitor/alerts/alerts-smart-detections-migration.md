---
title: Migrate Azure Monitor Application Insights Smart Detection to Smart Alerts (Preview) | Microsoft Docs
description: Learn about the steps required to upgrade your Azure Monitor Application Insights Smart Detection to the new Smart Alert-based detection. 
ms.topic: conceptual
ms.date: 01/30/2021
---

# Migrate Azure Monitor Application Insights Smart Detection to Smart Alerts (Preview)

## Overview

This article walks you through the process of migrating Application Insights Smart Detection to Smart Alerts. The migration  creates alert rules for the different Smart Alerts detectors. Once created, you can manage and configure these rules just like any other Azure Monitor alert rules. You can also configure action groups for these rules, thus enabling multiple methods of taking actions or triggering notification on new detections.

You can view Smart Alert detections for the fired alerts shown in the Azure portal alerts blade. In addition, you can still see them in the Application Insights Smart Detection blade.

> [!NOTE]
> Migration of Smart Detection to Smart Alerts is currently available for a private, invitation-only preview. Not all of the capabilities described below may be fully functional in the private preview version. If you want to participate in the private preview, please contact smart-alert-feedback@microsoft.com.

## Benefits of migration to Smart Alerts

Smart Alerts allow you to take advantage of the full capabilities of Azure Monitor alerts, including:

- **At-scale managment** of Smart Detection alerts using the Azure Monitor alerts experience and API.
- **Firing and amanagement of multiple notification actions**-  [Action groups](../alerts/action-groups.md) allow you to configure multiple types of notifications and actions which are triggered when an alert is fired. This includes notification by email, SMS, voice call or push notifications, and actions such as calling a secure webhook, Logic App, automation runbook, and more. Action groups further support management at scale by allowing you to configure actions once and use them across multiple alert rules
- **Rule based suppression of notifications** - [Action Rules](../alerts/alerts-action-rules?tabs=portal) help you define or suppress actions at any Azure Resource Manager scope (Azure subscription, resource group, or target resource). They have various filters that help you narrow down the specific subset of alert instances that you want to act on. They are especially helpful at reducing notification overload during times of system maintenance.  

## Migrated Smart Detection capabilities

A new set of Smart Alert rules is created when migrating an Application Insights resource.  One rule is created for each of the migrated Smart Detection capabilities. The following table maps the pre-migration Smart Detection capabilities to post-migration Smart Alert rules:

| Smart Detection rule name  <sup>(1)</sup>          | Smart Alert rule name <sup>(2)</sup> |
| -------------------------                          | ------------------------------ |
| Degradation in server response time                | Response latency degradation - *\<Application Insights resource name\>*  |
| Degradation in dependency duration                 | Dependency latency degradation - *\<Application Insights resource name\>*|
| Degradation in trace severity ratio (preview)      | Trace severity degradation - *\<Application Insights resource name\>*|
| Abnormal rise in exception volume (preview)        | Exception anomalies - *\<Application Insights resource name\>*|
| Potential memory leak detected (preview)           | Potential memory leak - *\<Application Insights resource name\>*|
| Slow page load time                                | *discontinued* <sup>(3)</sup>  |
| Slow server response time                          | *discontinued* <sup>(3)</sup>  |
| Long dependency duration                           | *discontinued* <sup>(3)</sup>  |
| Potential security issue detected (preview)        | *discontinued* <sup>(3)</sup>  |
| Abnormal rise in daily data volume (preview)       | *discontinued* <sup>(3)</sup>  |

<sup>(1)</sup> Name of rule as appears in Smart Detection Settings blade  
<sup>(2)</sup> Name of new Smart Alert rule after migration  
<sup>(3)</sup> These Smart Detection capabilities will not be converted to alerts, and will no longer be supported for this resource once its migration is completed. This is due to low usage and re-assessment of detection effectiveness 

The migration does not change the algorithmic design and behavior of Smart Detection. You should expect Smart Alerts to perform in an similar manner to respective Smart Detection capabilities.

The migration to Smart Alerts needs to be applied to each Application Insights resource separately. For resources that are not explicitly migrated, Smart Detection will continue to work.

### Action group configuration for the new smart alert rules

As part of the migration process, each new Smart Alert rule is automatically configured with an action group. The migration tool can assign a default action group for each rule. The default action group depends on the notification settings for the equivalent Smart Detection rule prior to the migration.

* If the **Smart Alert rule has the default email or no notifications configured** (as in preview detectors), then the new Smart Alert rule is configured with an action group named  “Application Insights Smart Detection".
    - If the system finds an existing action group with that name, it links the new Smart Alert rule to that group.  
    - Otherwise, it creates a new action group with that name. The new group in configured for "Email Azure Resource Manager Role" actions and sends notification to your Azure Resource Manager Monitoring Contributor and Monitoring Reader users.

* If the **default email was changed** before migration, then an action group called "Application Insights Smart Detection Custom" is created, with an email action sending notifications to the previously configured email addresses.

As an alternative, you can select not to use the default action group, and instead select an existing action group that will be configured for all the migrated alert rules.

## Executing Smart Detection migration process

### Migrate your Smart Detection using the Azure portal

Apply the migration to one specific Application Insights resource at a time.

To migrate take the following steps:

1. Select **Smart Detection** under the **Investigate** heading in your Application Insights resource left-side menu.

2. Click on the banner reading **"Migrate Smart Detection to Smart Alerts (preview)**. The migration dialog is opened.

![Smart Detections Feed Banner](media/alerts-smart-detections-migration/Smart-Detection-Feed-Banner.png)

3. Select **Migrate** to start the migration process.

![Smart Detection Migration Dialog](media/alerts-smart-detections-migration/Smart-Detection-Migration-Dialog.png)

After the migration, new Smart Alert rules are created for your Application Insight resource, as explained above. 

### Migrate your Smart Detection using Azure CLI

You can start the Smart Detection migration to alerts using the following Azure CLI command. This commend triggers an the automated, pre-configured migration process descripted previously. 

```azurecli
az rest --method POST --uri /subscriptions/{subscriptionId}/providers/Microsoft.AlertsManagement/migrateFromSmartDetection?api-version=2021-01-01-preview --body @body.txt
```

Where body.txt should include:

```json
{
      "scope": [
"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName} /providers/microsoft.insights/components/{resourceName} "
      ],
      "actionGroupCreationPolicy" : "{Auto/Custom}",
      "customActionGroupName" : "{actionGroupName}"           
}
```

**ActionGroupCreationPolicy** selects the policy for migrating the email settings in the Smart Detection rules into action groups. Allowed values are:

- **'Auto'**, which uses the default action groups as described in this document
- **'Custom'**, which creates all alert rules with the action group specified in **'customActionGroupName'**.
- *\<blank\>* - If **ActionGroupCreationPolicy** is not specified, the 'Auto' policy is used.

## Viewing your Smart Alerts after the migration

Following the migration process, you can view your Smart Detection alerts by selecting the Alerts entry in your Application Insights resource left-side menu. Select **Signal Type** to be **Smart Detector** to filter and present only the Smart Detector alert rules. You can select an alert to see its detection details.

![Smart Detection Alerts](media/alerts-smart-detections-migration/Smart-Detection-Alerts.png)

In addition, you can still see the available detections in the Smart Detections feed of your Application Insights resource.

![Smart Detection Feed](media/alerts-smart-detections-migration/Smart-Detection-Feed.png)

## Managing Smart Alert rules settings after the migration

### Managing Smart Alert rules settings using the Azure portal

After the migration is completed, you access the new Smart Alert rules in your Application Insight resource in a similar way to other alert rules defined for the resource:

1. Select **Alerts** under the **Monitoring** heading in your Application Insights resource left-side menu.

![Alerts Menu](media/alerts-smart-detections-migration/Application-Insights-Alerts.png)

2. Select **Manage Alert Rules**

![Manage Alert Rules](media/alerts-smart-detections-migration/Manage-Alert-Rules.png)

3. Select **Signal Type** to be **Smart Detector** in order to filter and present the Smart Detector alert rules.

![Smart Detector Rules](media/alerts-smart-detections-migration/Smart-Detector-Rules.png)

### Enabling / disabling Smart Alert rules 

As with any Azure Monitor alert rules, Smart Alert rules can be enabled or disabled through the portal UI or programmatically.

Note that if a specific Smart Detection capability was disabled prior to the migration, the new Smart Alert rule will be disabled as well.

### Configuring action group for your Smart Alert rules

You can create and manage action groups for the new Smart Alert rules just like for any other Azure Monitor alert rule. 

### Managing Smart Alert rule settings using Azure Resource Manager templates

After completing the migration, you can use Azure Resource Management templates to configure settings for Smart Alerts settings.

This Azure Resource Manager template example demonstrates configuring an **Response Latency Degradation** alert rule in an **Enabled** state with a severity of 2.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "microsoft.alertsmanagement/smartdetectoralertrules",
            "apiVersion": "2019-03-01",
            "name": "Response Latency Degradation - my-app",
            "location": "global", 
            "properties": {
                  "description": "Response Latency Degradation notifies you of an unusual increase in latency in your app response to requests.",
                  "state": "Enabled",
                  "severity": "2",
                  "frequency": "PT1M",
                  "detector": {
                  "id": "RequestPerformanceDegradationDetector"
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
> Smart Alerts are a global service therefore rule location is created on the global location.

> [!NOTE]
> "id" property should change according to the specific detector configured. Teh value must be one of:

> - **FailureAnomaliesDetector**
> - **RequestPerformanceDegradationDetector**
> - **DependencyPerformanceDegradationDetector**
> - **ExceptionVolumeChangedDetector**
> - **TraceSeverityDetector**  
> - **MemoryLeakDetector**

> [!NOTE]
> After completion of migration, Smart Detector settings must be configured using Smart Alerts templates, and can no longer be configured using the Application Insights Resource Manager template, as described [here](proactive-arm-config.md#smart-detection-rule-configuration).

## Next Steps

- [Learn more about alerts in Azure](./alerts-overview.md)
- [Learn more about Smart Alerts in Application Insights](./alerts-smart-detections-overview.md)
