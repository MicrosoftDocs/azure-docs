---
title: Create a custom profile in Azure Automanage for VMs
description: Learn how to create a custom profile in Azure Automanage and select your services and settings.
author: ju-shim
ms.service: automanage
ms.workload: infrastructure
ms.topic: how-to
ms.date: 03/22/2022
ms.author: jushiman
---


# Create a custom profile in Azure Automanage for VMs

Azure Automanage for machine best practices has default best practice profiles that cannot be edited. However, if you need more flexibility, you can pick and choose the set of services and settings by creating a custom profile.

We support toggling services ON and OFF. We also currently support customizing settings on [Azure Backup](..\backup\backup-azure-arm-vms-prepare.md#create-a-custom-policy) and [Microsoft Antimalware](../security/fundamentals/antimalware.md#default-and-custom-antimalware-configuration). Also, for Windows machines only, you can modify the audit modes for the [Azure security baselines in Guest Configuration](../governance/policy/concepts/guest-configuration.md). Check out the [ARM template](#create-a-custom-profile-using-azure-resource-manager-templates) for modifying the **azureSecurityBaselineAssignmentType**.



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

5. Adjust the profile with the desired services and settings and click **Create**.


## Create a custom profile using Azure Resource Manager Templates

The following ARM template will create an Automanage custom profile. Details on the ARM template and steps on how to deploy are located in the ARM template deployment [section](#arm-template-deployment).
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
      }
    },
    "resources": [
      {
        "type": "Microsoft.Automanage/configurationProfiles",
        "apiVersion": "2021-04-30-preview",
        "name": "[parameters('customProfileName')]",
        "location": "[parameters('location')]",
        "properties": {
            "configuration": {
              "Antimalware/Enable": "true",
              "Antimalware/EnableRealTimeProtection": "true",
              "Antimalware/RunScheduledScan": "true",
              "Antimalware/ScanType": "Quick",
              "Antimalware/ScanDay": "7",
              "Antimalware/ScanTimeInMinutes": "120",
              "AzureSecurityBaseline/Enable": true,
              "AzureSecurityBaseline/AssignmentType": "[parameters('azureSecurityBaselineAssignmentType')]",
              "AzureSecurityCenter/Enable": true,
              "Backup/Enable": "true",
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
              "LogAnalytics/Enable": true,
              "UpdateManagement/Enable": true,
              "VMInsights/Enable": true
          }
        }
      }
    ]
  }
```

### ARM template deployment
This ARM template will create a custom configuration profile that you can assign to your specified machine. 

The `customProfileName` value is the name of the custom configuration profile that you would like to create.

The `location` value is the region where you would like to store this custom configuration profile. Note, you can assign this profile to any supported machines in any region. 

The `azureSecurityBaselineAssignmentType` is the audit mode that you can choose for the Azure server security baseline. Your options are 

* ApplyAndAutoCorrect : This will apply the Azure security baseline through the Guest Configuration extention, and if any setting within the baseline drifts, we will auto-remediate the setting so it stays compliant.
* ApplyAndMonitor : This will apply the Azure security baseline through the Guest Configuration extention when you first assign this profile to each machine. After it is applied, the Guest Configuration service will monitor the sever baseline and report any drift from the desired state. However, it will not auto-remdiate.
* Audit : This will install the Azure security baseline using the Guest Configuration extension. You will be able to see where your machine is out of compliance with the baseline, but noncompliance won't be automatically remediated.

Follow these steps to deploy the ARM template:
1. Save this ARM template as `azuredeploy.json`
1. Run this ARM template deployment with `az deployment group create --resource-group myResourceGroup --template-file azuredeploy.json`
1. Provide the values for customProfileName, location, and azureSecurityBaselineAssignmentType when prompted
1. You're ready to deploy

As with any ARM template, it's possible to factor out the parameters into a separate `azuredeploy.parameters.json` file and use that as an argument when deploying.

## Next steps 

Get the most frequently asked questions answered in our FAQ. 

> [!div class="nextstepaction"]
> [Frequently Asked Questions](faq.yml)