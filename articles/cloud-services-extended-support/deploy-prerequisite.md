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

## Required Service Configuration (.cscfg) file updates

### 1) Virtual Network
Cloud Service (extended support) deployments must be in a virtual network. Virtual network can be created through [Azure portal](../virtual-network/quick-create-portal.md), [PowerShell](../virtual-network/quick-create-powershell.md), [Azure CLI](../virtual-network/quick-create-cli.md) or [ARM Template](../virtual-network/quick-create-template.md). The virtual network and subnets must also be referenced in the Service Configuration (.cscfg) under the [NetworkConfiguration](schema-cscfg-networkconfiguration.md) section. 

For a virtual networks belonging to the same resource group as the cloud service, referencing only the virtual network name in the Service Configuration (.cscfg) file is sufficient. If the virtual network and cloud service are in two different resource groups, then the complete Azure Resource Manager ID of the virtual network needs to be specified in the Service Configuration (.cscfg) file.

> [!NOTE]
> Virtual Network and cloud service located in a different resource groups is not supported in Visual Studio 2019. Please consider using the ARM template or Portal for successful deployments in such scenarios
 
#### Virtual Network located in same resource group
```xml
<VirtualNetworkSite name="<vnet-name>"/> 
  <AddressAssignments> 
    <InstanceAddress roleName="<role-name>"> 
     <Subnets> 
       <Subnet name="<subnet-name>"/> 
     </Subnets> 
    </InstanceAddress> 
  </AddressAssignments> 
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
   </AddressAssignments>
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

> [!NOTE]
> Changes in service definition file (.csdef) requires the package file (.cspkg) to be generated again. Please build and repackage your .cspkg post making the following changes in the .csdef file to get the latest settings for your cloud service

### 1) Virtual Machine sizes
The sizes listed in the left column below are deprecated in Azure Resource Manager. However, if you want to continue to use them update the `vmsize` name with the associated Azure Resource Manager naming convention.  

| Previous size name | Updated size name | 
|---|---|
| ExtraSmall | Standard_A1_v2 | 
| Small | Standard_A1_v2 |
| Medium | Standard_A2_v2 | 
| Large | Standard_A4_v2 | 
| ExtraLarge | Standard_A8_v2 | 
| A5 | Standard_A2m_v2 | 
| A6 | Standard_A4m_v2 | 
| A7 | Standard_A8m_v2 |  
| A8 | Deprecated | 
| A9 | Deprecated |
| A10 | Deprecated | 
| A11 | Deprecated | 
| MSODSG5 | Deprecated | 

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
## Access Control

The subscription containing networking resources needs to have [network contributor](../role-based-access-control/built-in-roles.md#network-contributor) access or above for Cloud Services (extended support). For more details on please refer to [RBAC built in roles](../role-based-access-control/built-in-roles.md)

## Key Vault creation 

Key Vault is used to store certificates that are associated to Cloud Services (extended support). Add the certificates to Key Vault, then reference the certificate thumbprints in Service Configuration file. You also need to enable Key Vault 'Access policies' (in portal) for  'Azure Virtual Machines for deployment' so that Cloud Services (extended support) resource can retrieve certificate stored as secrets from Key Vault. You can create a key vault in the [Azure portal](../key-vault/general/quick-create-portal.md) or by using [PowerShell](../key-vault/general/quick-create-powershell.md). The key vault must be created in the same region and subscription as the cloud service. For more information, see [Use certificates with Azure Cloud Services (extended support)](certificates-and-key-vault.md).

## Next steps 
- Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support).
- Deploy a Cloud Service (extended support) using the [Azure portal](deploy-portal.md), [PowerShell](deploy-powershell.md), [Template](deploy-template.md) or [Visual Studio](deploy-visual-studio.md).
- Review [frequently asked questions](faq.yml) for Cloud Services (extended support).
- Visit the [Cloud Services (extended support) samples repository](https://github.com/Azure-Samples/cloud-services-extended-support)
