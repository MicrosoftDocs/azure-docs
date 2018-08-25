---
title: Create a SQL Server Windows VM with Azure PowerShell | Microsoft Docs
description: This tutorial shows how to create a Windows SQL Server 2017 virtual machine with Azure PowerShell.
services: virtual-machines-windows
documentationcenter: na
author: rothja
manager: craigg
tags: azure-resource-manager
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: infrastructure-services
ms.date: 02/15/2018
ms.author: jroth
---

# Quickstart: Create a SQL Server Windows virtual machine with Azure PowerShell

This quickstart steps through creating a SQL Server virtual machine with Azure PowerShell.

> [!TIP]
> This quickstart provides a path for quickly provisioning and connecting to a SQL VM. For more information about other Azure PowerShell options for creating SQL VMs, see the [Provisioning guide for SQL Server VMs with Azure PowerShell](virtual-machines-windows-ps-sql-create.md).

> [!TIP]
> If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](virtual-machines-windows-sql-server-iaas-faq.md).

## <a id="subscription"></a> Get an Azure subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## <a id="powershell"></a> Get Azure PowerShell

This quickstart requires the Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

## Configure PowerShell

1. Open PowerShell and establish access to your Azure account by running the **Connect-AzureRmAccount** command.

   ```PowerShell
   Connect-AzureRmAccount
   ```

1. You should see a sign-in screen to enter your credentials. Use the same email and password that you use to sign in to the Azure portal.

## Create a resource group

1. Define a variable with a unique resource group name. To simplify the rest of the quickstart, the rest of the commands use this name as a basis for other resource names.

   ```PowerShell
   $ResourceGroupName = "sqlvm1"
   ```

1. Define a location of a target Azure region for all VM resources.

   ```PowerShell
   $Location = "East US"
   ```

1. Create the resource group.

   ```PowerShell
   New-AzureRmResourceGroup -Name $ResourceGroupName -Location $Location
   ```

## Configure network settings

1. Create a virtual network, subnet, and a public IP address. These resources are used to provide network connectivity to the virtual machine and connect it to the internet.

   ``` PowerShell
   $SubnetName = $ResourceGroupName + "subnet"
   $VnetName = $ResourceGroupName + "vnet"
   $PipName = $ResourceGroupName + $(Get-Random)

   # Create a subnet configuration
   $SubnetConfig = New-AzureRmVirtualNetworkSubnetConfig -Name $SubnetName -AddressPrefix 192.168.1.0/24

   # Create a virtual network
   $Vnet = New-AzureRmVirtualNetwork -ResourceGroupName $ResourceGroupName -Location $Location `
      -Name $VnetName -AddressPrefix 192.168.0.0/16 -Subnet $SubnetConfig

   # Create a public IP address and specify a DNS name
   $Pip = New-AzureRmPublicIpAddress -ResourceGroupName $ResourceGroupName -Location $Location `
      -AllocationMethod Static -IdleTimeoutInMinutes 4 -Name $PipName
   ```

1. Create a network security group. Configure rules to allow remote desktop (RDP) and SQL Server connections.

   ```PowerShell
   # Rule to allow remote desktop (RDP)
   $NsgRuleRDP = New-AzureRmNetworkSecurityRuleConfig -Name "RDPRule" -Protocol Tcp `
      -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * `
      -DestinationAddressPrefix * -DestinationPortRange 3389 -Access Allow

   #Rule to allow SQL Server connections on port 1433
   $NsgRuleSQL = New-AzureRmNetworkSecurityRuleConfig -Name "MSSQLRule"  -Protocol Tcp `
      -Direction Inbound -Priority 1001 -SourceAddressPrefix * -SourcePortRange * `
      -DestinationAddressPrefix * -DestinationPortRange 1433 -Access Allow

   # Create the network security group
   $NsgName = $ResourceGroupName + "nsg"
   $Nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName $ResourceGroupName `
      -Location $Location -Name $NsgName `
      -SecurityRules $NsgRuleRDP,$NsgRuleSQL
   ```

1. Create the network interface.

   ```PowerShell
   $InterfaceName = $ResourceGroupName + "int"
   $Interface = New-AzureRmNetworkInterface -Name $InterfaceName `
      -ResourceGroupName $ResourceGroupName -Location $Location `
      -SubnetId $VNet.Subnets[0].Id -PublicIpAddressId $Pip.Id `
      -NetworkSecurityGroupId $Nsg.Id
   ```

## Create the SQL VM

1. Define your credentials to sign into the VM. The user name is "azureadmin". Make sure to change the password before running the command.

   ``` PowerShell
   # Define a credential object
   $SecurePassword = ConvertTo-SecureString 'Change.This!000' `
      -AsPlainText -Force
   $Cred = New-Object System.Management.Automation.PSCredential ("azureadmin", $securePassword)
   ```

1. Create a virtual machine configuration object and then create the VM. The following command creates a SQL Server 2017 Developer Edition VM on Windows Server 2016.

   ```PowerShell
   # Create a virtual machine configuration
   $VMName = $ResourceGroupName + "VM"
   $VMConfig = New-AzureRmVMConfig -VMName $VMName -VMSize Standard_DS13 | `
      Set-AzureRmVMOperatingSystem -Windows -ComputerName $VMName -Credential $Cred -ProvisionVMAgent -EnableAutoUpdate | `
      Set-AzureRmVMSourceImage -PublisherName "MicrosoftSQLServer" -Offer "SQL2017-WS2016" -Skus "SQLDEV" -Version "latest" | `
      Add-AzureRmVMNetworkInterface -Id $Interface.Id
   
   # Create the VM
   New-AzureRmVM -ResourceGroupName $ResourceGroupName -Location $Location -VM $VMConfig
   ```

   > [!TIP]
   > It takes several minutes to create the VM.

## Install the SQL Iaas Agent

To get portal integration and SQL VM features, you must install the [SQL Server IaaS Agent Extension](virtual-machines-windows-sql-server-agent-extension.md). To install the agent on the new VM, run the following command after it is created.

   ```PowerShell
   Set-AzureRmVMSqlServerExtension -ResourceGroupName $ResourceGroupName -VMName $VMName -name "SQLIaasExtension" -version "1.2" -Location $Location
   ```

## Remote desktop into the VM

1. Use the following command retrieves the Public IP address for the new VM.

   ```PowerShell
   Get-AzureRmPublicIpAddress -ResourceGroupName $ResourceGroupName | Select IpAddress
   ```

1. Then take the returned IP address and pass it as a command-line parameter to **mstsc** to start a Remote Desktop session into the new VM.

   ```
   mstsc /v:<publicIpAddress>
   ```

1. When prompted for credentials, choose to enter credentials for a different account. Enter the user name with a preceding backslash (for example, `\azureadmin`, and the password that you set previously in this quickstart.

## Connect to SQL Server

1. After logging into the Remote Desktop session, launch **SQL Server Management Studio 2017** from the start menu.

1. In the **Connect to Server** dialog, keep the defaults. The server name is the name of the VM. Authentication is set to **Windows Authentication**. Click **Connect**.

You are now connected to SQL Server locally. If you want to connect remotely, you have to [configure connectivity](virtual-machines-windows-sql-connect.md) from the portal or manually.

## Clean up resources

If you do not need the VM running continually, you can avoid unnecessary charges by stopping it when not in use. The following command stops the VM but leaves it available for future use.

```PowerShell
Stop-AzureRmVM -Name $VMName -ResourceGroupName $ResourceGroupName
```

You can also permanently delete all resources associated with the virtual machine with the **Remove-AzureRmResourceGroup** command. This permanently deletes the virtual machine as well, so use this command with care.

## Next steps

In this quickstart, you created a SQL Server 2017 virtual machine using Azure PowerShell. To learn more about how to migrate your data to the new SQL Server, see the following article.

> [!div class="nextstepaction"]
> [Migrate a database to a SQL VM](virtual-machines-windows-migrate-sql.md)
