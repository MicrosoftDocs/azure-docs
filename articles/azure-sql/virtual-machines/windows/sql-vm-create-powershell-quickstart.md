---
title: Create SQL Server on a Windows virtual machine with Azure PowerShell | Microsoft Docs
description: This tutorial shows how to use Azure PowerShell to create a Windows virtual machine running SQL Server 2017.
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
tags: azure-resource-manager
ms.service: virtual-machines-sql

ms.topic: quickstart
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: infrastructure-services
ms.date: 12/21/2018
ms.author: mathoma
ms.reviewer: jroth
---

# Quickstart: Create SQL Server on a Windows virtual machine with Azure PowerShell

[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This quickstart steps through creating a SQL Server virtual machine (VM) with Azure PowerShell.

> [!TIP]
> - This quickstart provides a path for quickly provisioning and connecting to a SQL VM. For more information about other Azure PowerShell options for creating SQL VMs, see the [Provisioning guide for SQL Server VMs with Azure PowerShell](create-sql-vm-powershell.md).
> - If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.md).

## <a id="subscription"></a> Get an Azure subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## <a id="powershell"></a> Get Azure PowerShell

[!INCLUDE [updated-for-az.md](../../../../includes/updated-for-az.md)]

## Configure PowerShell

1. Open PowerShell and establish access to your Azure account by running the **Connect-AzAccount** command.

   ```powershell
   Connect-AzAccount
   ```

1. When you see the sign-in window, enter your credentials. Use the same email and password that you use to sign in to the Azure portal.

## Create a resource group

1. Define a variable with a unique resource group name. To simplify the rest of the quickstart, the remaining commands use this name as a basis for other resource names.

   ```powershell
   $ResourceGroupName = "sqlvm1"
   ```

1. Define a location of a target Azure region for all VM resources.

   ```powershell
   $Location = "East US"
   ```

1. Create the resource group.

   ```powershell
   New-AzResourceGroup -Name $ResourceGroupName -Location $Location
   ```

## Configure network settings

1. Create a virtual network, subnet, and a public IP address. These resources are used to provide network connectivity to the virtual machine and connect it to the internet.

   ``` PowerShell
   $SubnetName = $ResourceGroupName + "subnet"
   $VnetName = $ResourceGroupName + "vnet"
   $PipName = $ResourceGroupName + $(Get-Random)

   # Create a subnet configuration
   $SubnetConfig = New-AzVirtualNetworkSubnetConfig -Name $SubnetName -AddressPrefix 192.168.1.0/24

   # Create a virtual network
   $Vnet = New-AzVirtualNetwork -ResourceGroupName $ResourceGroupName -Location $Location `
      -Name $VnetName -AddressPrefix 192.168.0.0/16 -Subnet $SubnetConfig

   # Create a public IP address and specify a DNS name
   $Pip = New-AzPublicIpAddress -ResourceGroupName $ResourceGroupName -Location $Location `
      -AllocationMethod Static -IdleTimeoutInMinutes 4 -Name $PipName
   ```

1. Create a network security group. Configure rules to allow remote desktop (RDP) and SQL Server connections.

   ```powershell
   # Rule to allow remote desktop (RDP)
   $NsgRuleRDP = New-AzNetworkSecurityRuleConfig -Name "RDPRule" -Protocol Tcp `
      -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * `
      -DestinationAddressPrefix * -DestinationPortRange 3389 -Access Allow

   #Rule to allow SQL Server connections on port 1433
   $NsgRuleSQL = New-AzNetworkSecurityRuleConfig -Name "MSSQLRule"  -Protocol Tcp `
      -Direction Inbound -Priority 1001 -SourceAddressPrefix * -SourcePortRange * `
      -DestinationAddressPrefix * -DestinationPortRange 1433 -Access Allow

   # Create the network security group
   $NsgName = $ResourceGroupName + "nsg"
   $Nsg = New-AzNetworkSecurityGroup -ResourceGroupName $ResourceGroupName `
      -Location $Location -Name $NsgName `
      -SecurityRules $NsgRuleRDP,$NsgRuleSQL
   ```

1. Create the network interface.

   ```powershell
   $InterfaceName = $ResourceGroupName + "int"
   $Interface = New-AzNetworkInterface -Name $InterfaceName `
      -ResourceGroupName $ResourceGroupName -Location $Location `
      -SubnetId $VNet.Subnets[0].Id -PublicIpAddressId $Pip.Id `
      -NetworkSecurityGroupId $Nsg.Id
   ```

## Create the SQL VM

1. Define your credentials to sign in to the VM. The username is "azureadmin". Make sure you change \<password> before running the command.

   ``` PowerShell
   # Define a credential object
   $SecurePassword = ConvertTo-SecureString '<password>' `
      -AsPlainText -Force
   $Cred = New-Object System.Management.Automation.PSCredential ("azureadmin", $securePassword)
   ```

1. Create a virtual machine configuration object and then create the VM. The following command creates a SQL Server 2017 Developer Edition VM on Windows Server 2016.

   ```powershell
   # Create a virtual machine configuration
   $VMName = $ResourceGroupName + "VM"
   $VMConfig = New-AzVMConfig -VMName $VMName -VMSize Standard_DS13_V2 |
      Set-AzVMOperatingSystem -Windows -ComputerName $VMName -Credential $Cred -ProvisionVMAgent -EnableAutoUpdate |
      Set-AzVMSourceImage -PublisherName "MicrosoftSQLServer" -Offer "SQL2017-WS2016" -Skus "SQLDEV" -Version "latest" |
      Add-AzVMNetworkInterface -Id $Interface.Id
   
   # Create the VM
   New-AzVM -ResourceGroupName $ResourceGroupName -Location $Location -VM $VMConfig
   ```

   > [!TIP]
   > It takes several minutes to create the VM.

## Install the SQL IaaS Agent

To get portal integration and SQL VM features, you must install the [SQL Server IaaS Agent Extension](sql-server-iaas-agent-extension-automate-management.md). To install the agent on the new VM, run the following command after the VM is created.

   ```powershell
   Set-AzVMSqlServerExtension -ResourceGroupName $ResourceGroupName -VMName $VMName -name "SQLIaasExtension" -version "2.0" -Location $Location
   ```

## Remote desktop into the VM

1. Use the following command to retrieve the public IP address for the new VM.

   ```powershell
   Get-AzPublicIpAddress -ResourceGroupName $ResourceGroupName | Select IpAddress
   ```

1. Pass the returned IP address as a command-line parameter to **mstsc** to start a Remote Desktop session into the new VM.

   ```
   mstsc /v:<publicIpAddress>
   ```

1. When prompted for credentials, choose to enter credentials for a different account. Enter the username with a preceding backslash (for example, `\azureadmin`), and the password that you set previously in this quickstart.

## Connect to SQL Server

1. After signing in to the Remote Desktop session, launch **SQL Server Management Studio 2017** from the start menu.

1. In the **Connect to Server** dialog box, keep the defaults. The server name is the name of the VM. Authentication is set to **Windows Authentication**. Select **Connect**.

You're now connected to SQL Server locally. If you want to connect remotely, you must [configure connectivity](ways-to-connect-to-sql.md) from the Azure portal or manually.

## Clean up resources

If you don't need the VM to run continuously, you can avoid unnecessary charges by stopping it when not in use. The following command stops the VM but leaves it available for future use.

```powershell
Stop-AzVM -Name $VMName -ResourceGroupName $ResourceGroupName
```

You can also permanently delete all resources associated with the virtual machine with the **Remove-AzResourceGroup** command. Doing so permanently deletes the virtual machine as well, so use this command with care.

## Next steps

In this quickstart, you created a SQL Server 2017 virtual machine using Azure PowerShell. To learn more about how to migrate your data to the new SQL Server, see the following article.

> [!div class="nextstepaction"]
> [Migrate a database to a SQL VM](migrate-to-vm-from-sql-server.md)
