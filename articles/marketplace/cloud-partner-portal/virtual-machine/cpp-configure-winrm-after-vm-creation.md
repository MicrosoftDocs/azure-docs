---
title: Configure WinRM after Azure virtual machine creation | Azure Marketplace
description: Explains how to configure Windows Remote Management (WinRM) after the creation of an Azure-hosted virtual machine.
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 11/27/2018
ms.author: dsindona
---

# Configure WinRM after virtual machine creation

> [!IMPORTANT]
> Starting April 13, 2020, we'll begin moving the management of your Azure Virtual Machine offers to Partner Center. After the migration, you'll create and manage your offers in Partner Center. Follow the instructions in [Create an Azure Virtual Machine offer](https://aka.ms/CreateAzureVMoffer) to manage your migrated offers.

This article explains how to configure an existing Azure-hosted virtual machine (VM) to enable WinRM over HTTPS.  This configuration applies only to Windows-based VMs and requires the following two-step process:

1. Enable port traffic for the WinRM over HTTPS protocol.  You will configure this setting for your VM in the Azure portal.
2. Configure the VM to enable WinRM by running the supplied PowerShell scripts.


## Enabling port traffic

The WinRM over HTTPS protocol uses port 5986, which is not enabled by default on pre-configured Windows VMs offered on the Azure Marketplace. To enable this protocol, use the following steps to add a new rule to the network security group (NSG) with the [Azure portal](https://portal.azure.com).  For more information about NSGs, see [Security Groups](https://docs.microsoft.com/azure/virtual-network/security-overview).

1.    Navigate to the blade **Virtual machines >**  <*vm-name*>  **> Settings/Networking**.
2.    Click on the NSG name (in this example, **testvm11002**) to display its properties:

    ![Network security group properties](./media/nsg-properties.png)
 
3. Under **Settings**, select **Inbound security rules** to display this blade.
4. Click **+Add** to create a new rule called `WinRM_HTTPS` for TCP port 5986.

    ![Add inbound network security rule](./media/nsg-new-rule.png)

5. Click **OK** when you are finished supplying values.  The list of inbound security rules should contain the following new entries.

    ![Listing of inbound network security rules](./media/nsg-new-inbound-listing.png)


## Configure VM to enable WinRM 

Use the following steps to enable and configure the Windows Remote Management feature on your Windows VM.   

1. Establish a Remote Desktop connection to your Azure-hosted VM.  For more information, see [How to connect and sign in to an Azure virtual machine running Windows](https://docs.microsoft.com/azure/virtual-machines/windows/connect-logon).  The remaining steps will be run on your VM.
2. Download the following files and save them to a folder on your VM:
    - [ConfigureWinRM.ps1](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vm-winrm-windows/ConfigureWinRM.ps1)
    - [makecert.exe](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vm-winrm-windows/makecert.exe)
    - [winrmconf.cmd](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vm-winrm-windows/winrmconf.cmd)
3. Open the **PowerShell Console** with elevated privileges (**Run as Administrator**). 
4. Run the following command, supplying the required parameter: the fully qualified domain name (FQDN) for your VM: <br/>
   `ConfigureWinRM.ps1 <vm-domain-name>`

    ![Powershell configuration script 1](./media/powershell-file1.png)

    This script depends upon the other two files being in the same folder.


## Next steps

Once you have configured WinRM, you are ready to [deploy your VM from its constituent VHDs](./cpp-deploy-vm-vhd.md).
