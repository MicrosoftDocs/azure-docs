---
title: Move an Azure Automanage configuration profile across regions
description: Learn how to move an Automanage Configuration Profile across regions
ms.service: automanage
ms.workload: infrastructure
ms.topic: how-to
ms.date: 05/01/2022
ms.custom: subject-moving-resources
# Customer intent: As a sysadmin, I want move my Automanage Configuration Profile to a different region.
---

# Move an Azure Automanage configuration profile to a different region
This article describes how to migrate an Automanage Configuration Profile to a different region. You might want to move your Configuration Profiles to another region for many reasons. For example, to take advantage of a new Azure region, to meet internal policy and governance requirements, or in response to capacity planning requirements. You may want to deploy Azure Automanage to some VMs that are in a new region.  Some regions may require that you use Automanage Configuration Profiles  that are local to that region.

## Prerequisites
* Ensure that your target region is [supported by Automanage](./overview-about.md#prerequisites).
* Ensure that your Log Analytics workspace region, Automation account region, and your target region are all regions supported by the region mappings [here](../automation/how-to/region-mappings.md).

## Download your desired Automanage configuration profile

We'll begin by downloading our previous Configuration Profile using PowerShell.  First, perform a `GET` using `Invoke-RestMethod` against the Automanage Resource Provider, substituting the values for your subscription.

```url
https://management.azure.com/subscriptions/<yourSubscription>/providers/Microsoft.Automanage/configurationProfiles?api-version=2022-05-04
```

The GET command will display a list of Automanage Configuration Profile information, including the settings and the ConfigurationProfile ID
```azurepowershell-interactive
$listConfigurationProfilesURI = "https://management.azure.com/subscriptions/<yourSubscription>/providers/Microsoft.Automanage/configurationProfiles?api-version=2022-05-04"

Invoke-RestMethod `
    -URI $listConfigurationProfilesURI
```

Here are the results, edited for brevity.

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

The next step is to do another `GET`, this time to retrieve the specific profile we would like to create in a new region.  For this example, we'll retrieve 'testProfile1'.  We'll perform a `GET` against the `id` value for the desired profile.

```azurepowershell-interactive
$profileId = "https://management.azure.com/subscriptions/yourSubscription/resourceGroups/yourResourceGroup/providers/Microsoft.Automanage/configurationProfiles/testProfile1?api-version=2022-05-04"

$profile = Invoke-RestMethod `
    -URI $listConfigurationProfilesURI
```

## Adjusting the location

Creating the profile in a new location is as simple as changing the `Location` property to our desired Azure Region.

We also will need to create a new name for this profile.  Let's change the name of the Configuration Profile `profileUk`.  We should update the `Name` property within the profile, and also in the URL.  We can use the `-replace` format operator to make this simple.

```powershell
$profile.Location = "westeurope"
$profile.Name -replace "testProfile1", "profileUk"
$profileId -replace "testProfile1", "profileUk"
```

Now that we have changed the Location value, this updated Configuration Profile will be created in Western Europe when we submit it. 

## Creating the new profile in the desired location

All that remains now is to `PUT` this new profile, using `Invoke-RestMethod` once more.

```powershell
$profile = Invoke-RestMethod `
    -Method PUT `
    -URI $profileId
```

## Enable Automanage on your VMs
For details on how to move your VMs, see this [article](../resource-mover/tutorial-move-region-virtual-machines.md).

Once you've moved your profile to a new region, you may use it as a custom profile for any VM.  Details are available [here](./quick-create-virtual-machines-portal.md).

## Next steps
* [Learn more about Azure Automanage](./overview-about.md)
* [View frequently asked questions about Azure Automanage](./faq.yml)
