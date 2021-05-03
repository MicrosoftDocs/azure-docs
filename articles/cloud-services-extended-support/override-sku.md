---
title: Override SKU information over CSCFG/CSDEF for Azure Cloud Services (extended support)
description: Override SKU information over CSCFG/CSDEF for Azure Cloud Services (extended support)
ms.topic: how-to
ms.service: cloud-services-extended-support
author: surbhijain
ms.author: surbhijain
ms.reviewer: gachandw
ms.date: 04/05/2021
ms.custom: 
---

# Override SKU information over CSCFG/CSDEF in Cloud Services (extended support) 

This feature will allow the user to update the role size and instance count in their Cloud Service using the **allowModelOverride** property without having to update the service configuration and service definition files, thereby allowing the cloud service to scale up/down/in/out without doing a repackage and redeploy.

## Set allowModelOverride property
The allowModelOverride property can be set in the following ways:
* When allowModelOverride = true , the API call will update the role size and instance count for the cloud service without validating the values with the csdef and cscfg files. 
> [!Note]
> The cscfg will be updated  to reflect the role instance count but the csdef (within the cspkg) will retain the old values
* When allowModelOverride = false , the API call would throw an error when the role size and instance count values do not match with the csdef and cscfg files   respectively

Default value is set to be false. If the property is reset to false back from true, the csdef and cscfg files would again be checked for validation.

Please go through the below samples to apply the property in PowerShell, template and SDK

### Azure Resource Manager template
Setting the property “allowModelOverride” = true here will update the cloud service with the role properties defined in the roleProfile section
```json
"properties": {
        "packageUrl": "[parameters('packageSasUri')]",
        "configurationUrl": "[parameters('configurationSasUri')]",
        "upgradeMode": "[parameters('upgradeMode')]",
        “allowModelOverride” : true,
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
Setting the switch “AllowModelOverride” on the new New-AzCloudService cmdlet, will update the cloud service with the SKU properties defined in the RoleProfile
```powershell
New-AzCloudService ` 
-Name “ContosoCS” ` 
-ResourceGroupName “ContosOrg” ` 
-Location “East US” `
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
Setting the variable AllowModelOverride= true will update the cloud service with the SKU properties defined in the RoleProfile

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
CloudService createOrUpdateResponse = m_CrpClient.CloudServices.CreateOrUpdate(“ContosOrg”, “ContosoCS”, cloudService);
```
### Azure portal
The portal does not allow the above property to override the role size and instance count in the csdef and cscfg. 


## Next steps 
- Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support).
- Review [frequently asked questions](faq.md) for Cloud Services (extended support).
