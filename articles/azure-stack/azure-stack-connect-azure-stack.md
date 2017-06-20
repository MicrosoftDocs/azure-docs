---
title: Connect to Azure Stack | Microsoft Docs
description: Learn how to connect Azure Stack
services: azure-stack
documentationcenter: ''
author: SnehaGunda
manager: byronr
editor: ''

ms.assetid: 3cebbfa6-819a-41e3-9f1b-14ca0a2aaba3
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 3/29/2017
ms.author: sngun

---
# Connect to Azure Stack
To manage resources, you must connect to the Azure Stack POC computer. You can use either of the following connection options:

* [Remote Desktop](#connect-with-remote-desktop): lets a single concurrent user quickly connect from the POC computer.
* [Virtual Private Network (VPN)](#connect-with-vpn): lets multiple concurrent users connect from clients outside of the Azure Stack infrastructure (requires configuration).

## Connect with Remote Desktop
With a Remote Desktop connection, a single concurrent user can work with the portal to manage resources. You can also use tools on the MAS-CON01 virtual machine.

1. Log in to the Azure Stack POC physical machine.
2. Open a Remote Desktop Connection and connect to MAS-CON01. Enter **AzureStack\AzureStackAdmin** as the username, and the administrative password you provided during Azure Stack setup.  
3. On the MAS-CON01 desktop, open Server Manager, click **Local Server**, turn off Internet Explorer Enhanced Security, and
then close Server Manager.
4. To open the user [portal](azure-stack-key-features.md#portal), navigate to (https://portal.local.azurestack.external/) and sign in using user credentials.
    To open the administrator [portal](azure-stack-key-features.md#portal), navigate to (https://adminportal.local.azurestack.external/) and sign in using the Azure Active Directory credentials specified during installation.

## Connect with VPN

In an Azure Stack Proof of Concept (POC) environment, you can use a Virtual Private Network (VPN) to connect your local Windows-based computer to Azure Stack.VPN connectivity is supported for Azure Stack instances deployed through Azure Active Directory(AAD) or Active Directory Federation Services(AD FS) . VPN connections enable multiple clients to connect to Azure Stack at the same time.
 
Through the VPN connection, you can access the administrator portal, user portal, and locally installed tools such as Visual Studio and PowerShell to manage Azure Stack resources.

> [!NOTE] 
> This VPN connection does not provide connectivity to Azure Stack infrastructure VMs. 

The following sections describe the steps that are required to establish VPN connectivity to Azure Stack.

### Prerequisites

* [Install Azure Stack compatible Azure PowerShell on your local computer.](azure-stack-powershell-install.md)  
* [Download the tools required to work with Azure Stack to your local computer.](azure-stack-powershell-download.md)  

### Import the Connect PowerShell module

After you download the tools, navigate to the downloaded folder and import the **Connect** PowerShell module by using the following command:

```PowerShell
Import-Module .\Connect\AzureStack.Connect.psm1 
```
When you import the module, if you receive an error that says “**AzureStack.Connect.psm1** is not digitally signed. The script will not execute on the system”. To resolve this issue, run the following command in an elevated PowerShell session:

```PowerShell
Set-ExecutionPolicy Unrestricted
```

### Configure VPN to Azure Stack PoC computer

To create a VPN connection to the Azure Stack PoC computer, use the following steps:


1. Add the Azure Stack PoC computer’s host IP address & certificate authority (CA) to the list of trusted hosts on your client computer by running the following commands in an elevated PowerShell session:

    ```PowerShell
    #Change the IP address in the following command to match your Azure Stack host IP address
    $hostIP = "<Azure Stack host IP address>"
    
    # Change the password in the following command to administrator password that is provided when deploying Azure Stack. 
    $Password = ConvertTo-SecureString "<Administrator password provided when deploying Azure Stack>" -AsPlainText -Force
    
    #Add host IP and certificate authority to the to trusted hosts
    Set-Item wsman:\localhost\Client\TrustedHosts -Value $hostIP -Concatenate
    Set-Item wsman:\localhost\Client\TrustedHosts -Value mas-ca01.azurestack.local -Concatenate
    ```

2. Get the Azure Stack host computer’s NAT IP address. If you do not remember the NAT IP address of the Azure Stack PoC instance you are trying to connect to, you can get it by using the **Get-AzureStackNatServerAddress** command:

    ```PowerShell
    # Get host computer's NAT IP address
    $natIp = Get-AzureStackNatServerAddress -HostComputer $hostIP -Password $Password
    ```
    ![get NAT IP](media/azure-stack-connect-azure-stack/image1.png)  

    This command remotes into the **MAS-BGPNAT01** infrastructure VM and gets the NAT IP address.  

3. Create a VPN connection entry for your local user by using the **Add-AzureStackVpnConnection** command:

    ```PowerShell
    Add-AzureStackVpnConnection -ServerAddress $natIp -Password $Password
    ```
    ![get VPN connection](media/azure-stack-connect-azure-stack/image2.png)  

    If the connection succeeds, you should see **azurestack** in your list of VPN connections.

    ![Network connections](media/azure-stack-connect-azure-stack/image3.png)  


4.	Connect to the Azure Stack instance by using either of the following methods:  

    a.	**Connect-AzureStackVpn** command: 
    
    ```PowerShell
    Connect-AzureStackVpn -Password $Password
    ```
    
    ![connect with cmd](media/azure-stack-connect-azure-stack/image4.png)  

    When prompted, trust the Azure Stack host and install the certificate from **AzureStackCertificateAuthority** into your local computer’s certificate store. (the prompt might appear behind the PowerShell session window). 

    b.	Open your local computer’s **Network Settings** > **VPN** >click **azurestack** > **connect**

    ![connect with UI](media/azure-stack-connect-azure-stack/image5.png)  

    At the sign-in prompt, enter the username (AzureStack\AzureStackAdmin) and the password. If the connection succeeds, the azurestack VPN should be in a **connected** state.

### Validate the VPN connectivity

To test the portal connection, open an Internet browser and navigate to either the user portal (https://portal.local.azurestack.external/) or the administrator portal (https://adminportal.local.azurestack.external/), sign in and create resources.  

## Next steps
* [Add the Windows Server 2016 VM image to the Azure Stack marketplace](azure-stack-add-default-image.md)
* [Provision a virtual machine](azure-stack-provision-vm.md)
* [Provision a storage account](azure-stack-provision-storage-account.md)
* [Develop for Azure Stack](azure-stack-developer.md)

