---
title: Prerequisites for deploying Cloud Services (extended support)
description: Learn about the prerequisites for deploying Azure Cloud Services (extended support).
ms.topic: article
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 07/24/2024
---

# Prerequisites for deploying Azure Cloud Services (extended support)

To help ensure a successful Azure Cloud Services (extended support) deployment, review the following steps. Complete each prerequisitive before you begin to create a deployment.

## Required configuration file updates

Use the information in the following sections to make required updates to the configuration (.cscfg) file for your Cloud Services (extended support) deployment.

### Virtual network

Cloud Services (extended support) deployments must be in a virtual network. You can create a virtual network by using the [Azure portal](../virtual-network/quick-create-portal.md), [Azure PowerShell](../virtual-network/quick-create-powershell.md), the [Azure CLI](../virtual-network/quick-create-cli.md), or an [Azure Resource Manager template (ARM template)](../virtual-network/quick-create-template.md). The virtual network and subnets must be referenced in the [NetworkConfiguration](schema-cscfg-networkconfiguration.md) section of the configuration (.cscfg) file.

For a virtual network that is in the same resource group as the cloud service, referencing only the virtual network name in the configuration (.cscfg) file is sufficient. If the virtual network and Cloud Services (extended support) are in two different resource groups, specify the complete Azure Resource Manager ID of the virtual network in the configuration (.cscfg) file.

> [!NOTE]
> If the virtual network and Cloud Services (extended support) are located in different resource groups, you can't use Visual Studio 2019 for your deployment. For this scenario, consider using an ARM template or the Azure portal to create your deployment.

#### Virtual network in the same resource group

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

#### Virtual network in a different resource group

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

### Remove earlier versions of plugins

Remove earlier versions of remote desktop settings from the configuration (.cscfg) file:

```xml
<Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.Enabled" value="true" /> 
<Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountUsername" value="gachandw" /> 
<Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountEncryptedPassword" value="XXXX" /> 
<Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountExpiration" value="2021-12-17T23:59:59.0000000+05:30" /> 
<Setting name="Microsoft.WindowsAzure.Plugins.RemoteForwarder.Enabled" value="true" /> 
```

Remove earlier versions of diagnostics settings for each role in the configuration (.cscfg) file:

```xml
<Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="UseDevelopmentStorage=true" />
```

## Required definition file updates

> [!NOTE]
> If you make changes to the definition (.csdef) file, you must generate the package (.cspkg or .zip) file again. Build and repackage your package (.cspkg or .zip) file after you make the following changes in the definition (.csdef) file to get the latest settings for your cloud service.

### Virtual machine sizes

The following table lists deprecated virtual machine sizes and updated naming conventions through which you can continue to use the sizes.

The sizes listed in the left column of the table are deprecated in Azure Resource Manager. If you want to continue to use the virtual machine sizes, update the `vmsize` value to use the new naming convention from the right column.  

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

For example, `<WorkerRole name="WorkerRole1" vmsize="Medium">` becomes `<WorkerRole name="WorkerRole1" vmsize="Standard_A2">`.

> [!NOTE]
> To retrieve a list of available sizes, see the [list of resource SKUs](/rest/api/compute/resourceskus/list). Apply the following filters:
>
> `ResourceType = virtualMachines`
> `VMDeploymentTypes = PaaS`

### Remove earlier versions of remote desktop plugins

For deployments that use earlier versions of remote desktop plugins, remove the modules from the definition (.csdef) file and from any associated certificates:

```xml
<Imports> 
<Import moduleName="RemoteAccess" /> 
<Import moduleName="RemoteForwarder" /> 
</Imports> 
```

For deployments that use earlier versions of diagnostics plugins, remove the settings for each role from the definition (.csdef) file:

```xml
<Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
```

## Access control

The subscription that contains networking resources must have the [Network Contributor](../role-based-access-control/built-in-roles.md#network-contributor) or greater role for Cloud Services (extended support). For more information, see [RBAC built-in roles](../role-based-access-control/built-in-roles.md).

## Key vault creation

Azure Key Vault stores certificates that are associated with Cloud Services (extended support). Add the certificates to a key vault, and then reference the certificate thumbprints in the configuration (.cscfg) file for your deployment. You also must enable the key vault access policy (in the portal) for **Azure Virtual Machines for deployment** so that the Cloud Services (extended support) resource can retrieve the certificate stored as secrets in the key vault. You can create a key vault in the [Azure portal](../key-vault/general/quick-create-portal.md) or by using [PowerShell](../key-vault/general/quick-create-powershell.md). You must create the key vault in the same region and subscription as the cloud service. For more information, see [Use certificates with Cloud Services (extended support)](certificates-and-key-vault.md).

## Related content

- Deploy a Cloud Services (extended support) by using the [Azure portal](deploy-portal.md), [PowerShell](deploy-powershell.md), an [ARM template](deploy-template.md), or [Visual Studio](deploy-visual-studio.md).
- Review [frequently asked questions](faq.yml) for Cloud Services (extended support).
- Visit the [Cloud Services (extended support) samples repository](https://github.com/Azure-Samples/cloud-services-extended-support).
