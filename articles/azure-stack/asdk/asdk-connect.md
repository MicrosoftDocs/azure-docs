---
title: Connect to Azure Stack | Microsoft Docs
description: Learn how to connect to the ASDK.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 3cebbfa6-819a-41e3-9f1b-14ca0a2aaba3
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/25/2018
ms.author: jeffgilb
ms.reviewer: knithinc
---
# Connect to the ASDK

To manage resources, you must first connect to the Azure Stack Development Kit (ASDK). In this article, we describe the steps that you take to connect to the ASDK by using the following connection options:

* [Remote Desktop Connection (RDP)](#connect-with-rdp). When you connect by using Remote Desktop Connection, a single user can quickly connect to the development kit.
* [Virtual Private Network (VPN)](#connect-with-vpn). When you connect by using a VPN, multiple users can concurrently connect from clients outside the Azure Stack infrastructure. A VPN connection requires some setup.

<a name="connect-with-rdp"></a>
## Connect to Azure Stack using RDP

A single concurrent user can manage resources in the Azure Stack administration portal or the user portal through Remote Desktop Connection directly from the ASDK host computer. 

> [!TIP]
> This option also enables you to use RDP again while signed into the ASDK host computer to sign in to virtual machines created on the ASDK host computer. 

1. Open Remote Desktop Connection (mstc.exe) and connect to the development kit host computer IP address using an account authorized to sign in remotely to the ASDK host computer. By default, **AzureStack\AzureStackAdmin** has permissions to remote in to the ASDK host computer.  

2. On the development kit host computer, open Server Manager (ServerManager.exe). Select **Local Server**, turn off **IE Enhanced Security Configuration**, and close Server Manager.

3. Sign in to the administration portal as **AzureStack\CloudAdmin** or use other Azure Stack Operator credentials. The ASDK administration portal address is [https://adminportal.local.azurestack.external](https://adminportal.local.azurestack.external).

4. Sign in to the user portal as **AzureStack\CloudAdmin** or use other Azure Stack user credentials. The ASDK user portal address is [https://portal.local.azurestack.external](https://portal.local.azurestack.external).

> [!NOTE]
> For more information about when to use which account, see [ASDK administration basics](asdk-admin-basics.md#what-account-should-i-use).

<a name="connect-with-vpn"></a>
## Connect to Azure Stack using VPN

You can establish a split tunnel VPN connection to an ASDK host computer to access the Azure Stack portals and locally installed tools like Visual Studio and PowerShell. Using VPN connections, multiple users can connect at the same time to Azure Stack resources hosted by the ASDK.

VPN connectivity is supported for both Azure AD and Active Directory Federation Services (AD FS) deployments.

> [!NOTE]
> A VPN connection *does not* provide connectivity to Azure Stack VMs. You will not be able to RDP into Azure Stack VMs while connected via VPN.

### Prerequisites
Before setting up a VPN connection to the ASDK, ensure you have met the following prerequisites.

- Install [Azure Stack-compatible Azure PowerShell](asdk-post-deploy.md#install-azure-stack-powershell) on your local computer.  
- Download the [tools required to work with Azure Stack](asdk-post-deploy.md#download-the-azure-stack-tools).

### Set up VPN connectivity

To create a VPN connection to the ASDK, open PowerShell as an administrator on your local Windows-based computer. Then, run the following script (update the IP address and password values for your environment):

```PowerShell
# Change directories to the default Azure Stack tools directory
cd C:\AzureStack-Tools-master

# Configure Windows Remote Management (WinRM), if it's not already configured.
winrm quickconfig  

Set-ExecutionPolicy RemoteSigned

# Import the Connect module.
Import-Module .\Connect\AzureStack.Connect.psm1

# Add the development kit host computer’s IP address as the ASDK certificate authority (CA) to the list of trusted hosts. Make sure you update the IP address and password values for your environment.

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

![Network connections](media/asdk-connect/vpn.png)  

### Connect to Azure Stack

  Connect to the Azure Stack instance by using one of the following methods:  

  * Use the `Connect-AzsVpn ` command:
      
    ```PowerShell
    Connect-AzsVpn `
      -Password $Password
    ```

  * On your local computer, select **Network Settings** > **VPN** > **azurestack** > **connect**. At the sign-in prompt, enter the user name (**AzureStack\AzureStackAdmin**) and your password.

The first time you connect, you will be prompted to install the Azure Stack root certificate from **AzureStackCertificateAuthority** in your local computer’s certificate store. This step adds the ASDK certificate authority (CA) to the list of trusted hosts. Click **Yes** to install the certificate.

![Root certificate](media/asdk-connect/cert.png)  
  
  > [!IMPORTANT]
  > The prompt might be hidden by the PowerShell window or other applications.

### Test VPN connectivity

To test the portal connection, open a web browser, and then go to either the user portal (https://portal.local.azurestack.external/) or the administration portal (https://adminportal.local.azurestack.external/). 

Sign in with the appropriate subscription credentials to create and manage resources.  

## Next steps

[Troubleshooting](asdk-troubleshooting.md)
