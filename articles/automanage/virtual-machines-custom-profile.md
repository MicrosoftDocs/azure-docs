---
title: Create a custom profile in Azure Automanage for VMs
description: Learn how to create a custom profile in Azure Automanage and select your services and settings.
author: johnmarco
ms.service: automanage
ms.workload: infrastructure
ms.custom: devx-track-arm-template
ms.topic: how-to
ms.date: 07/01/2023
ms.author: johnmarc
---


# Create a custom profile in Azure Automanage for VMs

Azure Automanage for Virtual Machines includes default best practice profiles that can't be edited. However, if you need more flexibility, you can pick and choose the set of services and settings by creating a custom profile.

Automanage supports toggling services ON and OFF. It also currently supports customizing settings on [Azure Backup](..\backup\backup-azure-arm-vms-prepare.md#create-a-custom-policy) and [Microsoft Antimalware](../security/fundamentals/antimalware.md#default-and-custom-antimalware-configuration). You can also specify an existing log analytics workspace. Also, for Windows machines only, you can modify the audit modes for the [Azure security baselines in Guest Configuration](../governance/machine-configuration/overview.md).

Automanage allows you to tag the following resources in the custom profile:
* Resource Group
* Automation Account
* Log Analytics Workspace
* Recovery Vault

Check out the [ARM template](#create-a-custom-profile-using-azure-resource-manager-templates) for modifying these settings.

## Create a custom profile in the Azure portal

### Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com/).


### Create a custom profile

1. In the search bar, search for and select **Automanage – Azure machine best practices**.

2. Select **Configuration Profiles** in the table of contents.

3. Select the **Create** button to create your custom profile

4. On the **Create new profile** blade, fill out the details:
    1. Profile Name
    1. Subscription
    1. Resource Group
    1. Region

    :::image type="content" source="media\virtual-machine-custom-profile\create-custom-profile.png" alt-text="Fill out custom profile details.":::

5. Adjust the profile with the desired services and settings and select **Create**.


## Create a custom profile using Azure Resource Manager Templates

The following ARM template creates an Automanage custom profile. Details on the ARM template and steps on how to deploy are located in the ARM template deployment [section](#arm-template-deployment).

> [!NOTE]
> If you want to use a specific log analytics workspace, specify the ID of the workspace like this: "/subscriptions/**subscriptionId**/resourceGroups/**resourceGroupName**/providers/Microsoft.OperationalInsights/workspaces/**workspaceName**"

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "customProfileName": {
        "type": "string"
      },
      "location": {
        "type": "string"
      },
      "azureSecurityBaselineAssignmentType": {
        "type": "string",
        "allowedValues": [
          "ApplyAndAutoCorrect",
          "ApplyAndMonitor",
          "Audit"
        ]
      },
        "logAnalyticsWorkspace": {
            "type": "String"
        },
        "LogAnalyticsBehavior": {
            "defaultValue": false,
            "type": "Bool"
        }
    },
    "resources": [
      {
        "type": "Microsoft.Automanage/configurationProfiles",
        "apiVersion": "2022-05-04",
        "name": "[parameters('customProfileName')]",
        "location": "[parameters('location')]",
        "properties": {
            "configuration": {
              "Antimalware/Enable": true,
              "Antimalware/EnableRealTimeProtection": true,
              "Antimalware/RunScheduledScan": true,
              "Antimalware/ScanType": "Quick",
              "Antimalware/ScanDay": "7",
              "Antimalware/ScanTimeInMinutes": "120",
              "AzureSecurityBaseline/Enable": true,
              "AzureSecurityBaseline/AssignmentType": "[parameters('azureSecurityBaselineAssignmentType')]",
              "Backup/Enable": true,
              "Backup/PolicyName": "dailyBackupPolicy",
              "Backup/TimeZone": "UTC",
              "Backup/InstantRpRetentionRangeInDays": "2",
              "Backup/SchedulePolicy/ScheduleRunFrequency": "Daily",
              "Backup/SchedulePolicy/ScheduleRunTimes": [
                  "2017-01-26T00:00:00Z"
              ],
              "Backup/SchedulePolicy/SchedulePolicyType": "SimpleSchedulePolicy",
              "Backup/RetentionPolicy/RetentionPolicyType": "LongTermRetentionPolicy",
              "Backup/RetentionPolicy/DailySchedule/RetentionTimes": [
                  "2017-01-26T00:00:00Z"
              ],
              "Backup/RetentionPolicy/DailySchedule/RetentionDuration/Count": "180",
              "Backup/RetentionPolicy/DailySchedule/RetentionDuration/DurationType": "Days",
              "BootDiagnostics/Enable": true,
              "ChangeTrackingAndInventory/Enable": true,
              "DefenderForCloud/Enable": true,
              "LogAnalytics/Enable": true,
              "LogAnalytics/Reprovision": "[parameters('LogAnalyticsBehavior')]",
              "LogAnalytics/Workspace": "[parameters('logAnalyticsWorkspace')]",
              "UpdateManagement/Enable": true,
              "VMInsights/Enable": true,
              "WindowsAdminCenter/Enable": true,
              "Tags/ResourceGroup": {
                "foo": "rg"
              },
              "Tags/AzureAutomation": {
                "foo": "automationAccount"
              },
              "Tags/LogAnalyticsWorkspace": {
                "foo": "workspace"
              },
              "Tags/RecoveryVault": {
                "foo": "recoveryVault"
              }
          }
        }
      }
    ]
  }
```

### ARM template deployment
This ARM template creates a custom configuration profile that you can assign to your specified machine.

The `customProfileName` value is the name of the custom configuration profile that you would like to create.

The `location` value is the region where you would like to store this custom configuration profile. Note, you can assign this profile to any supported machines in any region.

The `azureSecurityBaselineAssignmentType` is the audit mode that you can choose for the Azure server security baseline. Your options are

* ApplyAndAutoCorrect : This setting applies the Azure security baseline through the Guest Configuration extension, and if any setting within the baseline drifts, we'll auto-remediate the setting so it stays compliant.
* ApplyAndMonitor : This setting applies the Azure security baseline through the Guest Configuration extention when you first assign this profile to each machine. After it's applied, the Guest Configuration service will monitor the server baseline and report any drift from the desired state. However, it will not auto-remdiate.
* Audit : This setting installs the Azure security baseline using the Guest Configuration extension. You're able to see where your machine is out of compliance with the baseline, but noncompliance isn't automatically remediated.

You can also specify an existing log analytics workspace by adding this setting to the configuration section of properties below:
* "LogAnalytics/Workspace": "/subscriptions/**subscriptionId**/resourceGroups/**resourceGroupName**/providers/Microsoft.OperationalInsights/workspaces/**workspaceName**"
* "LogAnalytics/Reprovision": false
Specify your existing workspace in the `LogAnalytics/Workspace` line. Set the `LogAnalytics/Reprovision` setting to true if you would like this log analytics workspace to be used in all cases. Any machine with this custom profile then uses this workspace, even it's already connected to one. By default, the `LogAnalytics/Reprovision` is set to false. If your machine is already connected to a workspace, then that workspace is still used. If it's not connected to a workspace, then the workspace specified in `LogAnalytics\Workspace` will be used.

Also, you can add tags to resources specified in the custom profile like below:

```json
"Tags/ResourceGroup": {
    "foo": "rg"
},
"Tags/ResourceGroup/Behavior": "Preserve",
"Tags/AzureAutomation": {
  "foo": "automationAccount"
},
"Tags/AzureAutomation/Behavior": "Replace",
"Tags/LogAnalyticsWorkspace": {
  "foo": "workspace"
},
"Tags/LogAnalyticsWorkspace/Behavior": "Replace",
"Tags/RecoveryVault": {
  "foo": "recoveryVault"
},
"Tags/RecoveryVault/Behavior": "Preserve"
```
The `Tags/Behavior` can be set either to Preserve or Replace. If the resource you're tagging already has the same tag key in the key/value pair, you can replace that key with the specified value in the configuration profile by using the *Replace* behavior. By default, the behavior is set to *Preserve*, meaning that the tag key that is already associated with that resource is retained and not overwritten by the key/value pair specified in the configuration profile.

Follow these steps to deploy the ARM template:
1. Save this ARM template as `azuredeploy.json`
2. Run this ARM template deployment with `az deployment group create --resource-group myResourceGroup --template-file azuredeploy.json`
3. Provide the values for customProfileName, location, and azureSecurityBaselineAssignmentType when prompted
4. You're ready to deploy

As with any ARM template, it's possible to factor out the parameters into a separate `azuredeploy.parameters.json` file and use that as an argument when deploying.

## Next steps

Get the most frequently asked questions answered in our FAQ.

> [!div class="nextstepaction"]
> [Frequently Asked Questions](faq.yml)
