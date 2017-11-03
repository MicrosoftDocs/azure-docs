---
title: Filter network traffic with Azure network and application security groups (Preview) | Microsoft Docs
description: Learn how to create network and application security groups (Preview) to restrict the type of network traffic in and out of virtual machines.
services: virtual-network
documentationcenter: ''
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/03/2017
ms.author: jdial
ms.custom: 

---
# Filter network traffic with network and application security groups (Preview)

In this tutorial, learn how to create network security groups to filter network traffic to and from groups of virtual machines with application security groups. To learn more about network security groups and application security groups, see [Security overview](security-overview.md). 

The following sections include steps that you can take to create network security groups using the Azure command-line interface ([Azure CLI](#azure-cli)) and [Azure PowerShell](#powershell). The result is the same, regardless of which tool you use to create the network security groups. Click a tool link to go to that section of the tutorial. 

This article provides steps to create network security groups through the Resource Manager deployment model, which is the deployment model we recommend using when creating network security groups. If you need to create a network security group (classic), see [Create a network security group (classic)](virtual-networks-create-nsg-classic-ps.md). If you're not familiar with Azure's deployment models, see [Understand Azure deployment models](../azure-resource-manager/resource-manager-deployment-model.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

> [!NOTE]
> This tutorial utilizes network security group features that are currently in preview release. Features in preview release do not have the same availability and reliability as features in general release. While in preview, the features are available only in the following regions: WestCentralUS. If you want to implement network security groups using only features in general release, see [Create a network security group](virtual-networks-create-nsg-arm-pportal.md). 

## Azure CLI

Azure CLI commands are the same, whether you execute the commands from Windows, Linux, or macOS. However, there are scripting differences between operating system shells. The scripts in the following steps execute in a Bash shell. 

1. [Install and configure the Azure CLI](/cli/azure/install-azure-cli?toc=%2fazure%2fvirtual-network%2ftoc.json).
2. Ensure you are using version 2.0.18 or higher of the Azure CLI by entering the `az --version` command. If you are not, install the most recent version.
3. Log in to Azure with the `az login` command.
4. Register for the preview by entering the following commands:
    
    ```azurecli-interactive
    az feature register --name AllowApplicationSecurityGroups --namespace Microsoft.Network
    az provider register --namespace Microsoft.Network
    ``` 

5. Confirm that you are registered for the preview by entering the following command:

    ```azurecli-interactive
    az feature show --name AllowApplicationSecurityGroups --namespace Microsoft.Network
    ```

    > [!WARNING]
    > Registration can take up to an hour to complete. Do not continue with the remaining steps until *Registered* appears for **state** in the output returned from the previous command. If you continue before you're registered, remaining steps fail.

6. Run the following bash script to create a resource group:

    ```azurecli-interactive
    #!/bin/bash
    
    az group create \
      --name myResourceGroup \
      --location westcentralus
    ```

7. Create three application security groups, one for each server type:

    ```azurecli-interactive
    az network asg create \
      --resource-group myResourceGroup \
      --name WebServers \
      --location westcentralus  

    az network asg create \
      --resource-group myResourceGroup \
      --name AppServers \
      --location westcentralus

    az network asg create \
      --resource-group myResourceGroup \
      --name DatabaseServers \
      --location westcentralus
    ```

8. Create a network security group:

    ```azurecli-interactive
    az network nsg create \
      --resource-group myResourceGroup \
      --name myNsg \
      --location westcentralus
    ```

9. Create security rules within the NSG, setting the application security groups as the destination:
    
    ```azurecli-interactive    
    az network nsg rule create \
      --resource-group myResourceGroup \
      --nsg-name myNsg \
      --name WebRule \
      --priority 200 \
      --access "Allow" \
      --direction "inbound" \
      --source-address-prefixes "Internet" \
      --destination-asgs "WebServers" \
      --destination-port-ranges 80 \
      --protocol "TCP"

    az network nsg rule create \
      --resource-group myResourceGroup \
      --nsg-name myNsg \
      --name AppRule \
      --priority 300 \
      --access "Allow" \
      --direction "inbound" \
      --source-asgs "WebServers" \
      --destination-asgs "AppServers" \
      --destination-port-ranges 443 \
      --protocol "TCP"  

    az network nsg rule create \
      --resource-group myResourceGroup \
      --nsg-name myNsg \
      --name DatabaseRule \
      --priority 400 \
      --access "Allow" \
      --direction "inbound" \
      --source-asgs "AppServers" \
      --destination-asgs "DatabaseServers" \
      --destination-port-ranges 1336 \
      --protocol "TCP" 
    ``` 

10. Create a virtual network: 
    
    ```azurecli-interactive
    az network vnet create \
      --name myVnet \
      --resource-group myResourceGroup \
      --subnet-name mySubnet \
      --address-prefix 10.0.0.0/16 \
      --location westcentralus
    ```

11. Associate the network security group to the subnet in the virtual network:

    ```azurecli-interactive
    az network vnet subnet update \
      --name mySubnet \
      --resource-group myResourceGroup \
      --vnet-name myVnet \
      --network-security-group myNsg
    ```
    
12. Create three network interfaces, one for each server type: 

    ```azurecli-interactive
    az network nic create \
      --resource-group myResourceGroup \
      --name myNic1 \
      --vnet-name myVnet \
      --subnet mySubnet \
      --location westcentralus \
      --application-security-groups "WebServers" "AppServers"

    az network nic create \
      --resource-group myResourceGroup \
      --name myNic2 \
      --vnet-name myVnet \
      --subnet mySubnet \
      --location westcentralus \
      --application-security-groups "AppServers"

    az network nic create \
      --resource-group myResourceGroup \
      --name myNic3 \
      --vnet-name myVnet \
      --subnet mySubnet \
      --location westcentralus \
      --application-security-groups "DatabaseServers"
    ```

    Only the corresponding security rule you created in step 9 is applied to the network interface, based on the application security group the network interface is a member of. For example, only the *WebRule* is effective for *myNic1*, because the network interface is a member of the *WebServers* application security group and the rule specifies the *WebServers* application security group as its destination. The *AppRule* and *DatabaseRule* rules are not applied to *myNic1*, because the network interface is not a member of the *AppServers* and *DatabaseServers* application security groups.

13. Create one virtual machine for each server type, attaching the corresponding network interface to each virtual machine. This example creates Windows virtual machines, but you can change *win2016datacenter* to *UbuntuLTS* to create Linux virtual machines instead.

    ```azurecli-interactive
    # Update for your admin password
    AdminPassword=ChangeYourAdminPassword1

    az vm create \
      --resource-group myResourceGroup \
      --name myWebVm \
      --location westcentralus \
      --nics myNic1 \
      --image win2016datacenter \
      --admin-username azureuser \
      --admin-password $AdminPassword

    az vm create \
      --resource-group myResourceGroup \
      --name myAppVm \
      --location westcentralus \
      --nics myNic2 \
      --image win2016datacenter \
      --admin-username azureuser \
      --admin-password $AdminPassword

    az vm create \
      --resource-group myResourceGroup \
      --name myDatabaseVm \
      --location westcentralus \
      --nics myNic3 \
      --image win2016datacenter \
      --admin-username azureuser \
      --admin-password $AdminPassword    
    ```

14. **Optional**: Delete the resources that you create in this tutorial by completing the steps in [Delete resources](#delete-cli).

## PowerShell

1. Install and configure [PowerShell](/powershell/azure/install-azurerm-ps).
2. Ensure you have version 4.4.0 or higher of the AzureRm module installed. You can check your currently installed version by entering the `Get-Module -ListAvailable AzureRM` command. If you need to install or upgrade, install the latest version of the AzureRM module from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureRM).
3. In a PowerShell session, log in to Azure with your [Azure account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#account) using the `login-azurermaccount` command.
4. Register for the preview by entering the following commands:
    
    ```powershell
    Register-AzureRmProviderFeature -FeatureName AllowApplicationSecurityGroups -ProviderNamespace Microsoft.Network
    Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Network
    ``` 

5. Confirm that you are registered for the preview by entering the following command:

    ```powershell
    Get-AzureRmProviderFeature -FeatureName AllowApplicationSecurityGroups -ProviderNamespace Microsoft.Network
    ```

    > [!WARNING]
    > Registration can take up to an hour to complete. Do not continue with the remaining steps until *Registered* appears for **RegistrationState** in the output returned from the previous command. If you continue before you're registered, remaining steps fail.
        
6. Create a resource group:

    ```powershell
    New-AzureRmResourceGroup `
      -Name myResourceGroup `
      -Location westcentralus
    ```

7. Create three application security groups, one for each server type:

    ```powershell
    $webAsg = New-AzureRmApplicationSecurityGroup `
      -ResourceGroupName myResourceGroup `
      -Name WebServers `
      -Location westcentralus
  
    $appAsg = New-AzureRmApplicationSecurityGroup `
      -ResourceGroupName myResourceGroup `
      -Name AppServers `
      -Location westcentralus

    $databaseAsg = New-AzureRmApplicationSecurityGroup `
      -ResourceGroupName myResourceGroup `
      -Name DatabaseServers `
      -Location westcentralus
    ```

8. Create security rules for each server type.
    
    ```powershell
    $webRule = New-AzureRmNetworkSecurityRuleConfig `
      -Name "WebRule" `
      -Access Allow `
      -Protocol Tcp `
      -Direction Inbound `
      -Priority 200 `
      -SourceAddressPrefix Internet `
      -SourcePortRange * `
      -DestinationApplicationSecurityGroupId $webAsg.id `
      -DestinationPortRange 80	

    $appRule = New-AzureRmNetworkSecurityRuleConfig `
      -Name "AppRule" `
      -Access Allow `
      -Protocol Tcp `
      -Direction Inbound `
      -Priority 300 `
      -SourceApplicationSecurityGroupId $webAsg.id `
      -SourcePortRange * `
      -DestinationApplicationSecurityGroupId $appAsg.id `
      -DestinationPortRange 443	

    $databaseRule = New-AzureRmNetworkSecurityRuleConfig `
      -Name "DatabaseRule" `
      -Access Allow `
      -Protocol Tcp `
      -Direction Inbound `
      -Priority 400 `
      -SourceApplicationSecurityGroupId $appAsg.id `
      -SourcePortRange * `
      -DestinationApplicationSecurityGroupId $databaseAsg.id `
      -DestinationPortRange 1336	
    ``` 

9. Create a network security group:

    ```powershell
    $nsg = New-AzureRmNetworkSecurityGroup `
      -ResourceGroupName myResourceGroup `
      -Location westcentralus `
      -Name myNsg `
      -SecurityRules $WebRule,$AppRule,$DatabaseRule
    ```

10. Create a subnet configuration and associate the network security group to it:
    
    ```powershell
    $subnet = New-AzureRmVirtualNetworkSubnetConfig `
      -AddressPrefix 10.0.0.0/24 `
      -Name mySubnet `
      -NetworkSecurityGroup $nsg
    ```

11. Create a virtual network: 
    
    ```powershell
    $vNet = New-AzureRmVirtualNetwork `
      -Name myVnet `
      -AddressPrefix '10.0.0.0/16' `
      -Subnet $subnet `
      -ResourceGroupName myResourceGroup `
      -Location westcentralus
    ```

12. Create three network interfaces, one for each server type. 

    ```powershell
    $nic1 = New-AzureRmNetworkInterface `
      -Name myNic1 `
      -ResourceGroupName myResourceGroup `
      -Location westcentralus `
      -Subnet $vNet.Subnets[0] `
      -ApplicationSecurityGroup $webAsg,$appAsg

    $nic2 = New-AzureRmNetworkInterface `
      -Name myNic2 `
      -ResourceGroupName myResourceGroup `
      -Location westcentralus `
      -Subnet $vNet.Subnets[0] `
      -ApplicationSecurityGroup $appAsg

    $nic3 = New-AzureRmNetworkInterface `
      -Name myNic3 `
      -ResourceGroupName myResourceGroup `
      -Location westcentralus `
      -Subnet $vNet.Subnets[0] `
      -ApplicationSecurityGroup $databaseAsg
    ```

    Only the corresponding security rule you created in step 8 is applied to the network interface, based on the application security group the network interface is a member of. For example, only the *WebRule* is effective for *myNic1*, because the network interface is a member of the *WebServers* application security group and the rule specifies the *WebServers* application security group as its destination. The *AppRule* and *DatabaseRule* rules are not applied to *myNic1*, because the network interface is not a member of the *AppServers* and *DatabaseServers* application security groups.

13. Create one virtual machine for each server type, attaching the corresponding network interface to each virtual machine. This example creates Windows virtual machines, but before executing the script, you can change *-Windows* to *-Linux*, *MicrosoftWindowsServer* to *Canonical*, *WindowsServer* to *UbuntuServer* and *2016-Datacenter* to *14.04.2-LTS* to create Linux virtual machines instead.

    ```powershell
    # Create user object
    $cred = Get-Credential -Message "Enter a username and password for the virtual machine."
   
    # Create the web server virtual machine configuration and virtual machine.
    $webVmConfig = New-AzureRmVMConfig `
      -VMName myWebVm `
      -VMSize Standard_DS1_V2 | `
    Set-AzureRmVMOperatingSystem -Windows `
      -ComputerName myWebVm `
      -Credential $cred | `
    Set-AzureRmVMSourceImage `
      -PublisherName MicrosoftWindowsServer `
      -Offer WindowsServer `
      -Skus 2016-Datacenter `
      -Version latest | `
    Add-AzureRmVMNetworkInterface `
      -Id $nic1.Id
    New-AzureRmVM `
      -ResourceGroupName myResourceGroup `
      -Location westcentralus `
      -VM $webVmConfig

    # Create the app server virtual machine configuration and virtual machine.
    $appVmConfig = New-AzureRmVMConfig `
      -VMName myAppVm `
      -VMSize Standard_DS1_V2 | `
    Set-AzureRmVMOperatingSystem -Windows `
      -ComputerName myAppVm `
      -Credential $cred | `
    Set-AzureRmVMSourceImage `
      -PublisherName MicrosoftWindowsServer `
      -Offer WindowsServer `
      -Skus 2016-Datacenter `
      -Version latest | `
    Add-AzureRmVMNetworkInterface `
      -Id $nic2.Id
    New-AzureRmVM `
      -ResourceGroupName myResourceGroup `
      -Location westcentralus `
      -VM $appVmConfig

    # Create the database server virtual machine configuration and virtual machine.
    $databaseVmConfig = New-AzureRmVMConfig `
      -VMName myDatabaseVm `
      -VMSize Standard_DS1_V2 | `
    Set-AzureRmVMOperatingSystem -Windows `
      -ComputerName mydatabaseVm `
      -Credential $cred | `
    Set-AzureRmVMSourceImage `
      -PublisherName MicrosoftWindowsServer `
      -Offer WindowsServer `
      -Skus 2016-Datacenter `
      -Version latest | `
    Add-AzureRmVMNetworkInterface `
      -Id $nic3.Id
    New-AzureRmVM `
      -ResourceGroupName myResourceGroup `
      -Location westcentralus `
      -VM $databaseVmConfig
    ```

14. **Optional**: Delete the resources that you create in this tutorial by completing the steps in [Delete resources](#delete-cli).

## <a name="delete"></a>Delete resources

When you finish this tutorial, you might want to delete the resources that you created, so that you don't incur usage charges. Deleting a resource group also deletes all resources that are in the resource group.

### <a name="delete-portal"></a>Azure portal

1. In the portal search box, enter **myResourceGroup**. In the search results, click **myResourceGroup**.
2. On the **myResourceGroup** blade, click the **Delete** icon.
3. To confirm the deletion, in the **TYPE THE RESOURCE GROUP NAME** box, enter **myResourceGroup**, and then click **Delete**.

### <a name="delete-cli"></a>Azure CLI

In a CLI session, enter the following command:

```azurecli-interactive
az group delete --name myResourceGroup --yes
```

### <a name="delete-powershell"></a>PowerShell

In a PowerShell session, enter the following command:

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup -Force
```

