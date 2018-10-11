---
title: Configure an Azure Virtual Network (classic) - Network configuration file | Microsoft Docs
description: Learn how to create and modify virtual networks (classic) by exporting, changing, and importing a network configuration file.
services: virtual-network
documentationcenter: ''
author: genlin
manager: cshepard
editor: ''
tags: azure-service-management

ms.assetid: c29b9059-22b0-444e-bbfe-3e35f83cde2f
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/23/2017
ms.author: genli
ms.custom: 

---
# Configure a virtual network (classic) using a network configuration file
> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources: [Resource Manager and classic](../resource-manager-deployment-model.md?toc=%2fazure%2fvirtual-network%2ftoc.json). This article covers using the classic deployment model. Microsoft recommends that most new deployments use the Resource Manager deployment model.

You can create and configure a virtual network (classic) with a network configuration file using the Azure classic command-line interface (CLI) or Azure PowerShell. You cannot create or modify a virtual network through the Azure Resource Manager deployment model using a network configuration file. You cannot use the Azure portal to create or modify a virtual network (classic) using a network configuration file, however you can use the Azure portal to create a virtual network (classic), without using a network configuration file.

Creating and configuring a virtual network (classic) with a network configuration file requires exporting, changing, and importing the file.

## <a name="export"></a>Export a network configuration file

You can use PowerShell or the Azure classic CLI to export a network configuration file. PowerShell exports an XML file, while the Azure classic CLI exports a json file.

### PowerShell
 
1. [Install Azure PowerShell and sign in to Azure](https://docs.microsoft.com/azure/azure-stack/azure-stack-powershell-install).
2. Change the directory (and ensure it exists) and filename in the following command as desired, then run the command to export the network configuration file:

    ```powershell
    Get-AzureVNetConfig -ExportToFile c:\azure\networkconfig.xml
    ```

### Azure classic CLI

1. [Install the Azure classic CLI](../cli-install-nodejs.md?toc=%2fazure%2fvirtual-network%2ftoc.json). Complete the remaining steps from a classic CLI command prompt.
2. Log in to Azure by entering the `azure login` command.
3. Ensure you're in asm mode by entering the `azure config mode asm` command.
4. Change the directory (and ensure it exists) and filename in the following command as desired, then run the command to export the network configuration file:
    
    ```azurecli
    azure network export c:\azure\networkconfig.json
    ```

## Create or modify a network configuration file

A network configuration file is an XML file (when using PowerShell) or a json file (when using the classic CLI). You can edit the file in any text, or XML/json editor. The [Network configuration file schema settings](https://msdn.microsoft.com/library/azure/jj157100.aspx) article includes details for all settings. For additional explanation of the settings, see [View virtual networks and settings](manage-virtual-network.md#view-virtual-networks-and-settings). The changes you make to the file:

- Must comply with the schema, or importing the network configuration file will fail.
- Overwrite any existing network settings for your subscription, so use extreme caution when making modifications. For example, reference the example network configuration files that follow. Say the original file contained two **VirtualNetworkSite** instances, and you changed it, as shown in the examples. When you import the file, Azure deletes the virtual network for the **VirtualNetworkSite** instance you removed in the file. This simplified scenario assumes no resources were in the virtual network, as if there were, the virtual network could not be deleted, and the import would fail.

> [!IMPORTANT]
> Azure considers a subnet that has something deployed to it as **in use**. When a subnet is in use, it cannot be modified. Before modifying subnet information in a network configuration file, move anything that you have deployed to the subnet to a different subnet that isn't being modified. See [Move a VM or Role Instance to a Different Subnet](virtual-networks-move-vm-role-to-subnet.md) for details.

### Example XML for use with PowerShell

The following example network configuration file creates a virtual network named *myVirtualNetwork* with an address space of *10.0.0.0/16* in the *East US* Azure region. The virtual network contains one subnet named *mySubnet* with an address prefix of *10.0.0.0/24*.

```xml
<?xml version="1.0" encoding="utf-8"?>
<NetworkConfiguration xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/ServiceHosting/2011/07/NetworkConfiguration">
  <VirtualNetworkConfiguration>
    <Dns />
    <VirtualNetworkSites>
      <VirtualNetworkSite name="myVirtualNetwork" Location="East US">
        <AddressSpace>
          <AddressPrefix>10.0.0.0/16</AddressPrefix>
        </AddressSpace>
        <Subnets>
          <Subnet name="mySubnet">
            <AddressPrefix>10.0.0.0/24</AddressPrefix>
          </Subnet>
        </Subnets>
      </VirtualNetworkSite>
    </VirtualNetworkSites>
  </VirtualNetworkConfiguration>
</NetworkConfiguration>
```

If the network configuration file you exported contains no contents, you can copy the XML in the previous example, and paste it into a new file.

### Example JSON for use with the classic CLI

The following example network configuration file creates a virtual network named *myVirtualNetwork* with an address space of *10.0.0.0/16* in the *East US* Azure region. The virtual network contains one subnet named *mySubnet* with an address prefix of *10.0.0.0/24*.

```json
{
   "VirtualNetworkConfiguration" : {
      "Dns" : "",
      "VirtualNetworkSites" : [
         {
            "AddressSpace" : [ "10.0.0.0/16" ],
            "Location" : "East US",
            "Name" : "myVirtualNetwork",
            "Subnets" : [
               {
                  "AddressPrefix" : "10.0.0.0/24",
                  "Name" : "mySubnet"
               }
            ]
         }
      ]
   }
}
```

If the network configuration file you exported contains no contents, you can copy the json in the previous example, and paste it into a new file.

## <a name="import"></a>Import a network configuration file

You can use PowerShell or the classic CLI to import a network configuration file. PowerShell imports an XML file, while the classic CLI imports a json file. If the import fails, confirm that the file complies with the [network configuration schema](https://msdn.microsoft.com/library/azure/jj157100.aspx). 

### PowerShell
 
1. [Install Azure PowerShell and sign in to Azure](https://docs.microsoft.com/azure/azure-stack/azure-stack-powershell-install).
2. Change the directory and filename in the following command as necessary, then run the command to import the network configuration file:
 
    ```powershell
    Set-AzureVNetConfig  -ConfigurationPath c:\azure\networkconfig.xml
    ```

### Azure classic CLI

1. [Install the Azure classic CLI](/cli/azure/install-cli-version-1.0.md?toc=%2fazure%2fvirtual-network%2ftoc.json). Complete the remaining steps from a classic CLI command prompt.
2. Log in to Azure by entering the `azure login` command.
3. Ensure you're in asm mode by entering the `azure config mode asm` command.
4. Change the directory and filename in the following command as necessary, then run the command to import the network configuration file:

    ```azurecli
    azure network import c:\azure\networkconfig.json
    ```
