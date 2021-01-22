---
title: Prerequisites for deploying Azure Cloud Services (extended support)
description: Prerequisites for deploying Azure Cloud Services (extended support)
ms.topic: article
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Prerequisites for deploying Azure Cloud Services (extended support)

To ensure a successful Cloud Services (extended support) deployment review the below steps and complete each item prior to attempting any deployments. 


## 1) Register the feature for your subscription
Cloud Services (extended support) is currently in preview. Register the feature for your subscription as follows:

```powershell
Register-AzProviderFeature -FeatureName CloudServices -ProviderNamespace Microsoft.Compute
```

Check if the registration was successful for the CloudServices resource. This may take a few minutes.
```powershell
Get-AzProviderFeature 

FeatureName               ProviderName      RegistrationState
CloudServices           Microsoft.Compute    Registered
```

## 2) Update the Service Definition file

Update previous virtual machine size names to use the Azure Resource Manager naming conventions.

| Previous size name | Updated size name | 
|---|---|
| ExtraSmall | Standard_A0 | 
| Small | Standard_A1 |
| Medium | Standard_A2 | 
| Large | Standard_A3 | 
| ExtraLarge | Standard_A4 | 
| A5 | Standard_A5 | 
| A6 | Standard_A6 | 
| A7 | Standard_A7 |  
| A8 | Standard_A8 | 
| A9 | Standard_A9 |
| A10 | Standard_A10 | 
| A11 | Standard_A11 | 
| MSODSG5 | Standard_MSODSG5 | 

 For example, `<WorkerRole name="WorkerRole1" vmsize="Medium"` would become `<WorkerRole name="WorkerRole1" vmsize="Standard_A2"`.
 
> [!NOTE]
> To retrieve a list of available sizes see [Resource Skus - List](https://docs.microsoft.com/rest/api/compute/resourceskus/list) and apply the following filters: <br>
`ResourceType = virtualMachines ` <br>
`VMDeploymentTypes = PaaS `

Deployments that utilized the previous remote desktop plugins need to have the modules removed from the Service Definition file and any previously associated certificates. 

```xml
<Imports> 
<Import moduleName="RemoteAccess" /> 
<Import moduleName="RemoteForwarder" /> 
</Imports> 
```
## 3) Remove the following settings from the cscfg file.

Remove old certificate definitions (used for RDP plugin) from the Service Configuration (.cscfg) and Service Definition (.csdef) files. 

```xml
<Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="UseDevelopmentStorage=true" /> 
    
<Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.Enabled" value="true" /> 
    
<Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountUsername" value="gachandw" /> 
    
<Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountEncryptedPassword" value="XXXX" /> 

<Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountExpiration" value="2021-12-17T23:59:59.0000000+05:30" /> 
    
<Setting name="Microsoft.WindowsAzure.Plugins.RemoteForwarder.Enabled" value="true" /> 
```

## 4) Update the Service Configuration file

Cloud Service (extended support) deployments must be in a virtual network. Virtual network can be created through [Azure portal](https://docs.microsoft.com/azure/virtual-network/quick-create-portal), [PowerShell](https://docs.microsoft.com/azure/virtual-network/quick-create-powershell), [Azure CLI](https://docs.microsoft.com/azure/virtual-network/quick-create-cli) or [ARM Template](https://docs.microsoft.com/azure/virtual-network/quick-create-template). The virtual network and subnets must also be referenced in the Service Configuration (.cscfg) in the NetworkConfiguration section. 

For a virtual network belonging to the same resource group as the cloud service, referencing only the virtual network name in the cscfg is sufficient. If the virtual network and cloud service are in two different resource groups, then the virtual network needs to be specified in the cscfg file.
 
**Same resource group**
```json
<VirtualNetworkSite name="<vnet-name>"/> 
```

**Separate resource group**
```json
“/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.Network/virtualNetworks/<vnet-name>/> 
<AddressAssignments> 
<InstanceAddress roleName="<role-name>"> 
<Subnets> 
<Subnet name="<subnet-name>"/> 
</Subnets> 
</InstanceAddress> 
```
## 5) Key Vault creation 

Key Vault is used to store certificates that are associated to Cloud Services (extended support). Add the certificates to Key Vault, then reference the certificate thumbprints in Service Configuration file. You also need to enable Key Vault for appropriate permissions so that Cloud Services (extended support) resource can retrieve certificate stored as secrets from Key Vault. Key Vault can be created through [Azure portal](https://docs.microsoft.com/azure/key-vault/general/quick-create-portal)and  [PowerShell](https://docs.microsoft.com/azure/key-vault/general/quick-create-powershell). The Key Vault must be created in the same region and subscription as cloud service. For more information see [Use certificates with Azure Cloud Services (extended support)](certificates-and-key-vault.md).

## Next steps 
- Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support).
- Review [frequently asked questions](faq.md) for Cloud Services (extended support).
- Deploy a Cloud Service (extended support) using the [Azure portal](deploy-portal.md), [PowerShell](deploy-powershell.md), [Template](deploy-template.md) or [Visual Studio](deploy-visual-studio.md).