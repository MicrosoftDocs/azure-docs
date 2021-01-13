---
title: Azure Cloud Services (extended support)
description: Learn about the child elements of the Network Configuration element of the service configuration file, which specifies Virtual Network and DNS values.
ms.topic: article
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---
  
# Azure Cloud Services (extended support) overview

Cloud Services (extended support) is a new [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/management/overview) based deployment model for the [Azure Cloud Services](https://azure.microsoft.com/services/cloud-services/) product. The primary benefit of Cloud Services (extended support) is providing regional resiliency along with feature parity for Cloud Services in [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/management/overview). Cloud Services (extended support) also offers capabilities such as Role-based Access and Control (RBAC), tags and deployment templates. With this change, Azure Service Manager based deployment model for Cloud Services will be renamed as [Cloud Services (classic)](../cloud-services/cloud-services-choose-me.md).

Cloud Services (extended support) provides a path for customers to migrate away from the [Cloud Services (classic)](../cloud-services/cloud-services-choose-me.md) deployment model.

## Changes in deployment model

Minimal changes are required to cscfg and csdef files to deploy Cloud Services (extended support). No changes are required to runtime code however, deployment scripts will need to be updated to call new Azure Resource Manager based APIs. 

:::image type="content" source="media/overview-image-1.png" alt-text="Image shows classic cloud service configuration with addition of template section. ":::

- The Azure Resource Manager templates need to be maintained and kept consistent with the cscfg and csdef files for Cloud Services (extended support) deployments.
- Cloud Services (extended support) does not have a concept of hosted service. Each deployment is a separate Cloud Service.
- The concept of staging and production slots do not exist for Cloud Services (extended support).
- Assigning a [DNS label](https://docs.microsoft.com/azure/dns/dns-zones-records) to the Cloud Service is optional and the DNS label is tied to the public IP resource associated with the Cloud Service.
- [VIP Swap](cloud-services-swap.md) continues to be supported for Cloud Services (extended support). [VIP Swap](cloud-services-swap.md) can be used to swap between two Cloud Service (extended support) deployments.
- Cloud Services (extended support) requires [Key Vault](https://docs.microsoft.com/azure/key-vault/general/overview) to manage certificates. The cscfg file and templates require referencing the Key Vault to obtain the certificate information. 
- [Virtual networks](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview) are required to deploy Cloud Services (extended support).
- The Network Configuration File (netcfg) does not exist in [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/management/overview). Virtual networks and subnets in Azure Resource Manager are created through existing Azure Resource Manager APIs and referenced in the cscfg within the `NetworkConfiguration` section.


## Prerequisites for deployment

### 1) Register the feature for your subscription
Cloud Services (extended support) is currently in preview. Register the feature for your subscription as follows:

```powershell
Register-AzProviderFeature -FeatureName CloudServices -ProviderNamespace Microsoft.Compute
```

### 2) Update the Service Definition file
 
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
 

### 3) Update the Service Configuration file

All Cloud Service (extended support) deployments must be in a virtual network and referenced in the cscfg file. You can use an existing virtual network or create a new one using the [Azure portal](https://docs.microsoft.com/azure/virtual-network/quick-create-portal), [PowerShell](https://docs.microsoft.com/azure/virtual-network/quick-create-powershell), [CLI](https://docs.microsoft.com/azure/virtual-network/quick-create-cli) or [ARM template](https://docs.microsoft.com/azure/virtual-network/quick-create-template).
    
    ```xml
    <NetworkConfiguration> 
        <!-- Name of the target Virtual Network --> 
        <VirtualNetworkSite name="myVnet    "/> 
         <!-- Associating a Role to a Specific Subnet by name --> 
        <AddressAssignments> 
          <InstanceAddress roleName="WebRole1"> 
            <Subnets> 
              <Subnet name="WebTier"/> 
            </Subnets> 
          </InstanceAddress> 
        </AddressAssignments> 
      </NetworkConfiguration> 
    ```
 
Remove the following settings from the cscfg file.

    ```xml
    <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="UseDevelopmentStorage=true" /> 
    
    <Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.Enabled" value="true" /> 
    
    <Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountUsername" value="gachandw" /> 
    
    <Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountEncryptedPassword" value="XXXX" /> 
    
    <Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountExpiration" value="2021-12-17T23:59:59.0000000+05:30" /> 
    
    <Setting name="Microsoft.WindowsAzure.Plugins.RemoteForwarder.Enabled" value="true" /> 
    ```

## Next steps
Deploy a Cloud Service (extended support) using the [Azure portal](deploy-portal.md), [PowerShell](deploy-powershell.md), [Template](deploy-template.md) or [Visual Studio](deploy-visual-studio.md)