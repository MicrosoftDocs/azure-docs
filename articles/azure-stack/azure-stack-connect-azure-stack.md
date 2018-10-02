---
title: Connect to Azure Stack | Microsoft Docs
description: Learn how to connect to Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.assetid: 3cebbfa6-819a-41e3-9f1b-14ca0a2aaba3
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 09/28/2018
ms.author: mabrigg

---
# Connect to Azure Stack Development Kit

*Applies to: Azure Stack Development Kit*

To manage resources, you must first connect to the Azure Stack Development Kit. In this article, we describe the steps that you take to connect to the development kit. You can use one of the following connection options:

* [Remote Desktop Connection](#connect-with-remote-desktop). When you connect by using Remote Desktop Connection, a single user can quickly connect to the development kit.
* [Virtual private network (VPN)](#connect-with-vpn). When you connect by using a VPN, multiple users can concurrently connect from clients outside the Azure Stack infrastructure. A VPN connection requires some setup.

<a name="connect-to-azure-stack-with-remote-desktop"></a>
##  Connect to Azure Stack by using Remote Desktop Connection

A single concurrent user can manage resources in the operator portal or the user portal through Remote Desktop Connection.

1. Open Remote Desktop Connection and connect to the development kit. For the user name, enter **AzureStack\AzureStackAdmin**. Use the operator password that you specified when you set up Azure Stack.  

2. On the development kit computer, open Server Manager. Select **Local Server**, clear the **Internet Explorer Enhanced Security** check box, and then close Server Manager.

3. To open the [user portal](azure-stack-key-features.md#portal), go to https://portal.local.azurestack.external/. Sign in by using user credentials. To open the Azure Stack [operator portal](azure-stack-key-features.md#portal), go to https://adminportal.local.azurestack.external/. Sign in by using the Azure Active Directory (Azure AD) credentials that you specified during installation.

<a name="connect-to-azure-stack-with-vpn"></a>
## Connect to Azure Stack by using VPN

You can establish a split tunnel VPN connection to an Azure Stack Development Kit. You can use a VPN connection to access the Azure Stack operator portal, the user portal, and locally installed tools like Visual Studio and PowerShell to manage Azure Stack resources. VPN connectivity is supported in Azure AD and Active Directory Federation Services (AD FS) deployments. VPN connections make it possible for multiple clients to connect to Azure Stack at the same time.

> [!NOTE]
> A VPN connection does not provide connectivity to Azure Stack infrastructure VMs.

### Prerequisites

1. Install [Azure Stack-compatible Azure PowerShell](azure-stack-powershell-install.md) on your local computer.  
2. Download the [tools required to work with Azure Stack](azure-stack-powershell-download.md).

### Set up VPN connectivity

To create a VPN connection to the development kit, open Windows PowerShell as an administrator on your local Windows-based computer. Then, run the following script (update the IP address and password values for your environment):

```PowerShell
# Configure Windows Remote Management (WinRM), if it's not already configured.
winrm quickconfig  

Set-ExecutionPolicy RemoteSigned

# Import the Connect module.
Import-Module .\Connect\AzureStack.Connect.psm1

# Add the development kit computer’s host IP address and certificate authority (CA) to the list of trusted hosts. Make sure you update the IP address and password values for your environment.

$hostIP = "<Azure Stack host IP address>"

$Password = ConvertTo-SecureString `
  "<operator's password provided when deploying Azure Stack>" `
  -AsPlainText `
  -Force

Set-Item wsman:\localhost\Client\TrustedHosts `
  -Value $hostIP `
  -Concatenate

# Create a VPN connection entry for the local user.
Add-AzsVpnConnection `
  -ServerAddress $hostIP `
  -Password $Password

```

If setup succeeds, **azurestack** appears in your list of VPN connections.

![Network connections](media/azure-stack-connect-azure-stack/image3.png)  

### Connect to Azure Stack

Connect to the Azure Stack instance by using one of the following methods:  

* Use the `Connect-AzsVpn ` command:
    
  ```PowerShell
  Connect-AzsVpn `
    -Password $Password
  ```

  When prompted, trust the Azure Stack host and install the certificate from **AzureStackCertificateAuthority** in your local computer’s certificate store. (The prompt might be hidden by the PowerShell window.)

* On your local computer, select **Network Settings** > **VPN** > **azurestack** > **connect**. At the sign-in prompt, enter the user name (**AzureStack\AzureStackAdmin**) and your password.

### Test VPN connectivity

To test the portal connection, open a web browser, and then go to either the user portal (https://portal.local.azurestack.external/) or the operator portal (https://adminportal.local.azurestack.external/). Sign in and create resources.  

## Next steps

[Make virtual machines available to your Azure Stack users](azure-stack-tutorial-tenant-vm.md)
