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

> [!IMPORTANT]
> Cloud Services (extended support) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To ensure a successful Cloud Services (extended support) deployment review the below steps and complete each item prior to attempting any deployments. 

## Register the CloudServices feature
Register the feature for your subscription. The registration may take several minutes to complete. 

```powershell
Register-AzProviderFeature -FeatureName CloudServices -ProviderNamespace Microsoft.Compute
```

Check the status of registration using the following:  
```powershell
Get-AzProviderFeature 

#Sample output
FeatureName               ProviderName      RegistrationState
CloudServices           Microsoft.Compute    Registered
```

## Required Service Configuration (.cscfg) file updates

### 1) Virtual Network
Cloud Service (extended support) deployments must be in a virtual network. Virtual network can be created through [Azure portal](../virtual-network/quick-create-portal.md), [PowerShell](../virtual-network/quick-create-powershell.md), [Azure CLI](../virtual-network/quick-create-cli.md) or [ARM Template](../virtual-network/quick-create-template.md). The virtual network and subnets must also be referenced in the Service Configuration (.cscfg) under the [NetworkConfiguration](schema-cscfg-networkconfiguration.md) section. 

For a virtual networks belonging to the same resource group as the cloud service, referencing only the virtual network name in the Service Configuration (.cscfg) file is sufficient. If the virtual network and cloud service are in two different resource groups, then the complete Azure Resource Manager ID of the virtual network needs to be specified in the Service Configuration (.cscfg) file.
 
#### Virtual Network located in same resource group
```xml
<VirtualNetworkSite name="<vnet-name>"/> 
  <AddressAssignments> 
    <InstanceAddress roleName="<role-name>"> 
     <Subnets> 
       <Subnet name="<subnet-name>"/> 
     </Subnets> 
    </InstanceAddress> 
```

#### Virtual network located in different resource group
```xml
<VirtualNetworkSite name="/subscriptions/<sub-id>/resourceGroups/<rg-name>/providers/Microsoft.Network/virtualNetworks/<vnet-name>"/> 
   <AddressAssignments> 
     <InstanceAddress roleName="<role-name>"> 
       <Subnets> 
        <Subnet name="<subnet-name>"/> 
       </Subnets> 
     </InstanceAddress> 
```
### 2) Remove the old plugins

Remove old remote desktop settings from the Service Configuration (.cscfg) file.  

```xml
<Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.Enabled" value="true" /> 
<Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountUsername" value="gachandw" /> 
<Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountEncryptedPassword" value="XXXX" /> 
<Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountExpiration" value="2021-12-17T23:59:59.0000000+05:30" /> 
<Setting name="Microsoft.WindowsAzure.Plugins.RemoteForwarder.Enabled" value="true" /> 
```
Remove old diagnostics settings for each role in the Service Configuration (.cscfg) file.

```xml
<Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="UseDevelopmentStorage=true" />
```

## Required Service Definition file (.csdef) updates

### 1) Virtual Machine sizes
The following sizes are deprecated in Azure Resource Manager. However, if you want to continue to use them update the `vmsize` name with the associated Azure Resource Manager naming convention.  

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
> To retrieve a list of available sizes see [Resource Skus - List](/rest/api/compute/resourceskus/list) and apply the following filters: <br>
`ResourceType = virtualMachines ` <br>
`VMDeploymentTypes = PaaS `


### 2) Remove old remote desktop plugins
Deployments that utilized the old remote desktop plugins need to have the modules removed from the Service Definition (.csdef) file and any associated certificates. 

```xml
<Imports> 
<Import moduleName="RemoteAccess" /> 
<Import moduleName="RemoteForwarder" /> 
</Imports> 
```
Deployments that utilized the old diagnostics plugins need the settings removed for each role from the Service Definition (.csdef) file

```xml
<Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
```

## Key Vault creation 

Key Vault is used to store certificates that are associated to Cloud Services (extended support). Add the certificates to Key Vault, then reference the certificate thumbprints in Service Configuration file. You also need to enable Key Vault for appropriate permissions so that Cloud Services (extended support) resource can retrieve certificate stored as secrets from Key Vault. You can create a key vault in the [Azure portal](../key-vault/general/quick-create-portal.md) or by using [PowerShell](../key-vault/general/quick-create-powershell.md). The key vault must be created in the same region and subscription as the cloud service. For more information, see [Use certificates with Azure Cloud Services (extended support)](certificates-and-key-vault.md).

## Next steps 
- Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support).
- Deploy a Cloud Service (extended support) using the [Azure portal](deploy-portal.md), [PowerShell](deploy-powershell.md), [Template](deploy-template.md) or [Visual Studio](deploy-visual-studio.md).
- Review [frequently asked questions](faq.md) for Cloud Services (extended support).
- Visit the [Cloud Services (extended support) samples repository](https://github.com/Azure-Samples/cloud-services-extended-support)
