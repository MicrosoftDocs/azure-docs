---
title: Move an Azure Automanage Configuration Profile across regions
description: Learn how to move an Automanage Configuration Profile across regions
ms.service: automanage
ms.workload: infrastructure
ms.topic: how-to
ms.date: 12/10/2021
ms.custom: subject-moving-resources
# Customer intent: As a sysadmin, I want move my Automanage Configuration Profile to a different region.
---

# Move an Azure Automanage Configuration Profile to a different region
This article describes how to migrate an Automanage Configuration Profile to a different region. You might want to move your Configuration Profiles to another region for a number of reasons. For example, to take advantage of a new Azure region, to meet internal policy and governance requirements, or in response to capacity planning requirements. You may want to deploy Azure Automanage to some VMs that are in a new region, and may want to do so with a Configuration Profile local to that region..

## Prerequisites
* Ensure that your target region is [supported by Automanage](./automanage-virtual-machines.md#prerequisites).
* Ensure that your Log Analytics workspace region, Automation account region, and your target region are all regions supported by the region mappings [here](../automation/how-to/region-mappings.md).

## Download your desired Automanage Configuration Profile

This can be done by using PowerShell.  First, perform a `GET` using `Invoke-RestMethod` against the Automanage Resource Provider, substituting the values for your subscription.

```url
https://management.azure.com/subscriptions/<yourSubscription>/providers/Microsoft.Automanage/configurationProfiles?api-version=2021-04-30-preview
```

This will display a list of Automanage Configuration Profile information, including the settings and the ConfigurationProfile ID
```azurepowershell-interactive
$listConfigurationProfilesURI = "https://management.azure.com/subscriptions/<yourSubscription>/providers/Microsoft.Automanage/configurationProfiles?api-version=2021-04-30-preview"

Invoke-RestMethod `
    -URI $listConfigurationProfilesURI
```

This will result in a list of your Configuration Profiles created in this subscription, as seen below, edited for brevity.

```json
    {
        "id": "/subscriptions/yourSubscription/resourceGroups/yourResourceGroup/providers/Microsoft.Automanage/configurationProfiles/testProfile1",
        "name": "testProfile1",
        "type": "Microsoft.Automanage/configurationProfiles",
        "location": "westus",
        "properties": {
            "configuration": {
                "Antimalware/Enable": false,
                "Backup/Enable": true,
                "Backup/PolicyName": "dailyBackupPolicy",
            }
        }
    },
    {
        "id": "/subscriptions/yourSubscription/resourceGroups/yourResourceGroup/providers/Microsoft.Automanage/configurationProfiles/testProfile2",
        "name": "testProfile2",
        "type": "Microsoft.Automanage/configurationProfiles",
        "location": "eastus2euap",
        "properties": {
            "configuration": {
                "Antimalware/Enable": false,
                "Backup/Enable": true,
                "Backup/PolicyName": "dailyBackupPolicy",
            }
        }
    }
```

The next step is to do another `GET`, this time to retrieve the specific profile we would like to create in a new region.  For this example, we will retrieve 'testProfile1'.  We will perform a `GET` against the `id` value for the desired profile.

```azurepowershell-interactive
$profileId = "https://management.azure.com/subscriptions/yourSubscription/resourceGroups/yourResourceGroup/providers/Microsoft.Automanage/configurationProfiles/testProfile1?api-version=2021-04-30-preview"

$profile = Invoke-RestMethod `
    -URI $listConfigurationProfilesURI
```

## Adjusting the location

Creating the profile in a new location is as simple as changing the `Location` property to our desired Azure Region.

We also will need to create a new name for this profile.  Let's change this to profileUk.  This should be done for the `Name` property within the profile, and also in the URL.  We can use the `-replace` format operator to make this very simple.

```powershell
$profile.Location = "westeurope"
$profile.Name -replace "testProfile1", "profileUk"
$profileId -replace "testProfile1", "profileUk"
```

This will result in the ConfigurationProfile being created in Western Europe.

## Creating the new profile in the desired location

All that remains now is to `PUT` this new profile, using `Invoke-RestMethod` once more.

```powershell
$profile = Invoke-RestMethod `
    -Method PUT `
    -URI $profileId
```

## Enable Automanage on your VMs
For details on how to move your VMs, see this [article](../resource-mover/tutorial-move-region-virtual-machines.md).

Once you have moved your pofile to a new region, you may use it as a custom profile for any VM.  Details are available [here](./automanage-virtual-machines.md#enabling-automanage-for-vms-in-azure-portal).

## Next steps
* [Learn more about Azure Automanage](./automanage-virtual-machines.md)
* [View frequently asked questions about Azure Automanage](./faq.yml)
