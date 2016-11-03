---
title: Connect to Azure Stack | Microsoft Docs
description: Learn how to connect Azure Stack
services: azure-stack
documentationcenter: ''
author: ErikjeMS
manager: byronr
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 10/18/2016
ms.author: erikje

---
# Connect to Azure Stack
To manage resources, you must connect to the Azure Stack POC computer. You can use either of the following connection options:

* Remote Desktop: lets a single concurrent user quickly connect from the POC computer.
* Virtual Private Network (VPN):  lets multiple concurrent users connect from clients outside of the Azure Stack infrastructure (requires configuration).

## Connect with Remote Desktop
With a Remote Desktop connection, a single concurrent user can work with the portal to manage resources. You can also use tools on the MAS-CON01 virtual machine.

1. Log in to the Azure Stack POC physical machine.
2. Open a Remote Desktop Connection and connect to MAS-CON01. Enter **AzureStack\AzureStackAdmin** as the username, and the administrative password you provided during Azure Stack setup.  
3. On the MAS-CON01 desktop, double-click **Microsoft Azure Stack Portal** icon (https://portal.azurestack.local/) to open the [portal](azure-stack-key-features.md#portal).
   
   ![Azure stack portal icon](media/azure-stack-connect-azure-stack/image2.png)
4. Log in using the Azure Active Directory credentials specified during installation.

## Connect with VPN
Virtual Private Network connections let multiple concurrent users connect from clients outside of the Azure Stack infrastructure. You can use the portal to manage resoures. You can also use tools, such as Visual Studio and PowerShell, on your local client.

1. Install the AzureRM module by using the following command:
   
   ```PowerShell
   Install-Module -Name AzureRm -RequiredVersion 1.2.6 -Scope CurrentUser
   ```   
2. Download the Azure Stack Tools scripts.  These support files can be downloaded by either browsing to the [GitHub repository](https://github.com/Azure/AzureStack-Tools), or running the following Windows PowerShell script as an administrator:
   
   > [!NOTE]
   > The following steps require PowerShell 5.0.  To check your version, run $PSVersionTable.PSVersion and compare the "Major" version.  
   > 
   > 
   
    ```PowerShell
   
       #Download the tools archive
       invoke-webrequest https://github.com/Azure/AzureStack-Tools/archive/master.zip -OutFile master.zip
   
       #Expand the downloaded files. 
       expand-archive master.zip -DestinationPath . -Force
   
       #Change to the tools directory
       cd AzureStack-Tools-master
    ````
3. In the same PowerShell session, navigate to the **Connect** folder, and import the AzureStack.Connect.psm1 module:
   
   ```PowerShell
   cd Connect
   import-module .\AzureStack.Connect.psm1
   ```
4. To create the Azure Stack VPN connection, run the following Windows PowerShell. Before running, populate the admin password and Azure Stack host address fields. 
   
   ```PowerShell
   #Change the IP Address below to match your Azure Stack host
   $hostIP = "<HostIP>"
   
   # Change password below to reference the password provided for administrator during Azure Stack installation
   $Password = ConvertTo-SecureString "<Admin Password>" -AsPlainText -Force
   
   # Add Azure Stack One Node host & CA to the trusted hosts on your client computer
   Set-Item wsman:\localhost\Client\TrustedHosts -Value $hostIP -Concatenate
   Set-Item wsman:\localhost\Client\TrustedHosts -Value mas-ca01.azurestack.local -Concatenate  
   
   # Update Azure Stack host address to be the IP Address of the Azure Stack POC Host
   $natIp = Get-AzureStackNatServerAddress -HostComputer $hostIP -Password $Password
   
   # Create VPN connection entry for the current user
   Add-AzureStackVpnConnection -ServerAddress $natIp -Password $Password
   
   # Connect to the Azure Stack instance. This command (or the GUI steps in step 5) can be used to reconnect
   Connect-AzureStackVpn -Password $Password 
   ```
5. When prompted, trust the Azure Stack host.
6. When prompted, install a certificate (the prompt appears behind the Powershell session window).
7. To test the portal connection, in an Internet browser, navigate to *https://portal.azurestack.local*.
8. To review and manage the Azure Stack connection, use **Networks** on your client:
   
    ![Image of the network connect menu in Windows 10](media/azure-stack-connect-azure-stack/image1.png)

> [!NOTE]
> This VPN connection does not provide connectivity to VMs or other resources. For information on connectivity to resources, see [One Node VPN Connection](azure-stack-create-vpn-connection-one-node-tp2.md)
> 
> 

## Next steps
[First tasks](azure-stack-first-scenarios.md)

[Install and connect with PowerShell](azure-stack-connect-powershell.md)

[Install and connect with CLI](azure-stack-connect-cli.md)

