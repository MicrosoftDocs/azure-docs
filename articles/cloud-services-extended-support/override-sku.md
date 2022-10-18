---
title: Override SKU information over CSCFG/CSDEF for Azure Cloud Services (extended support)
description: This article describes how to override SKU information in .cscfg and .csdef files for Azure Cloud Services (extended support).
ms.topic: how-to
ms.service: cloud-services-extended-support
author: surbhijain
ms.author: surbhijain
ms.reviewer: gachandw
ms.date: 04/05/2021
ms.custom: devx-track-azurepowershell
---

# Override SKU settings in .cscfg and .csdef files for Cloud Services (extended support)

This article describes how to update the role size and instance count in Azure Cloud Services by using the **allowModelOverride** property. When you use this property, you don't need to update the service configuration (.cscfg) and service definition (.csdef) files. So you can scale the cloud service up, down, in, or out without repackaging and redeploying it.

## Set the allowModelOverride property
You can set the **allowModelOverride** property to `true` or `false`. 
* When **allowModelOverride** is set to `true`, an API call will update the role size and instance count for the cloud service without validating the values with the .csdef and .cscfg files. 
   > [!Note]
   > The .cscfg file will be updated  to reflect the role instance count. The .csdef file (embedded within the .cspkg) will retain the old values.

* When **allowModelOverride** is set to `false`, an API call throws an error if the role size and instance count values don't match the values in the .csdef and .cscfg files,   respectively.

The default value is `false`. If the property is reset to `false` after being set to `true`, the .csdef and .cscfg files will again be validated.

The following samples show how to set the **allowModelOverride** property by using an Azure Resource Manager (ARM) template, PowerShell, or the SDK.

### ARM template
Setting the **allowModelOverride** property to `true` here will update the cloud service with the role properties defined in the `roleProfile` section:
```json
"properties": {
        "packageUrl": "[parameters('packageSasUri')]",
        "configurationUrl": "[parameters('configurationSasUri')]",
        "upgradeMode": "[parameters('upgradeMode')]",
        "allowModelOverride": true,
        "roleProfile": {
          "roles": [
            {
              "name": "WebRole1",
              "sku": {
                "name": "Standard_D1_v2",
                "capacity": "1"
              }
            },
            {
              "name": "WorkerRole1",
              "sku": {
                "name": "Standard_D1_v2",
                "capacity": "1"
              }
            }
          ]
        },

```
### PowerShell
Setting the `AllowModelOverride` switch on the new `New-AzCloudService` cmdlet will update the cloud service with the SKU properties defined in the role profile:
```powershell
New-AzCloudService ` 
-Name "ContosoCS" ` 
-ResourceGroupName "ContosOrg" ` 
-Location "East US" `
-AllowModelOverride  ` 
-PackageUrl $cspkgUrl ` 
-ConfigurationUrl $cscfgUrl ` 
-UpgradeMode 'Auto' ` 
-RoleProfile $roleProfile ` 
-NetworkProfile $networkProfile  ` 
-ExtensionProfile $extensionProfile ` 
-OSProfile $osProfile `
-Tag $tag
```
### SDK
Setting the `AllowModelOverride` variable to `true` will update the cloud service with the SKU properties defined in the role profile:

```csharp
CloudService cloudService = new CloudService
    {
        Properties = new CloudServiceProperties
            {
                RoleProfile = cloudServiceRoleProfile
                Configuration = < Add Cscfg xml content here>
                PackageUrl = <Add cspkg SAS url here>,
                ExtensionProfile = cloudServiceExtensionProfile,
                OsProfile= cloudServiceOsProfile,
                NetworkProfile = cloudServiceNetworkProfile,
                UpgradeMode = 'Auto',
                AllowModelOverride = true
            },
                Location = m_location
            };
CloudService createOrUpdateResponse = m_CrpClient.CloudServices.CreateOrUpdate("ContosOrg", "ContosoCS", cloudService);
```
### Azure portal
The Azure portal doesn't allow you to use the **allowModelOverride** property to override the role size and instance count in the .csdef and .cscfg files. 


## Next steps 
- View the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support).
- View [frequently asked questions](faq.yml) for Cloud Services (extended support).
