---
title: Deploy the Azure Stack Development Kit | Microsoft Docs
description: Learn how to prepare the Azure Stack Development Kit and run the PowerShell script to deploy it.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 0ad02941-ed14-4888-8695-b82ad6e43c66
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 02/27/2018
ms.author: jeffgilb
ms.reviewer: wfayed
---
# Deploy the Azure Stack Development Kit

*Applies to: Azure Stack Development Kit*

To deploy the [Azure Stack Development Kit](azure-stack-poc.md), you must complete the following steps:

1. [Download the deployment package](https://azure.microsoft.com/overview/azure-stack/try/?v=try) to get the Cloudbuilder.vhdx.
2. Prepare the cloudbuilder.vhdx to configure the computer (the development kit host) on which you want to install development kit. After this step, the development kit host will boot to the Cloudbuilder.vhdx.
3. Deploy the development kit on the development kit host.

> [!NOTE]
> For best results, even if you want to use a disconnected Azure Stack environment, it is best to deploy while connected to the internet. That way, the Windows Server 2016 evaluation version included with the development kit installation can be activated at deployment time.

## Download and extract the development kit
1. Before you start the download, make sure that your computer meets the following prerequisites:

  - The computer must have at least 60 GB of free disk space available on four separate, identical logical hard drives in addition to the operating system disk.
  - [.NET Framework 4.6 (or a later version)](https://aka.ms/r6mkiy) must be installed.

2. [Go to the Get Started page](https://azure.microsoft.com/overview/azure-stack/try/?v=try) where you can download the Azure Stack Development Kit, provide your details, and then click **Submit**.
3. Download and run the [Deployment Checker for Azure Stack Development Kit](https://go.microsoft.com/fwlink/?LinkId=828735&clcid=0x409) prerequisite checker script. This standalone script goes through the pre-requisites checks done by the setup for Azure Stack Development Kit. It provides a way to confirm you are meeting the hardware and software requirements, before downloading the larger package for Azure Stack Development Kit.
4. Under **Download the software**, click **Azure Stack Development Kit**.

  > [!NOTE]
  > The ASDK download (AzureStackDevelopmentKit.exe) is approximiately 10GB by itself. If you choose to also download the Windows Server 2016 evaluation version ISO file, the download size increases to approximately 17GB. You can use that ISO file to create and add a Windows Server 2016 virtual machine image to the Azure Stack Marketplace after ASDK installation completes. Note that this Windows Server 2016 evaluation image can only be used with the ASDK and is subject to the ASDK license terms.

5. After the download completes, click **Run** to launch the ASDK self-extractor (AzureStackDevelopmentKit.exe).
6. Review and accept the displayed license agreement from the **License Agreement** page of the Self-Extractor Wizard and then click **Next**.
7. Review the privacy statement information displayed on the **Important Notice** page of the Self-Extractor Wizard and then click **Next**.
8. Select the location for Azure Stack setup files to be extracted to on the **Select Destination Location** page of the Self-Extractor Wizard and then click **Next**. The default location is *current folder*\Azure Stack Development Kit. 
9. Review the destination location summary on the **Ready to Extract** page of the Self-Extractor Wizard, and then click **Extract** to extract the CloudBuilder.vhdx (approximately 25GB) and ThirdPartyLicenses.rtf files. This process will take some time to complete.
10. Copy or move the CloudBuilder.vhdx file to the root of the C:\ drive (C:\CloudBuilder.vhdx) on the ASDK host computer.

> [!NOTE]
> After you extract the files, you can delete the .EXE and .BIN files to recover hard disk space. Or, you can backup up these files so that you don’t need to download the files again if you need to redeploy the ASDK.

## Deploy the ASDK using a guided experience
The ASDK can be deployed using a graphical user interface (GUI) provided by downloading and running the asdk-installer.ps1 PowerShell script.

> [!NOTE]
> The installer user interface for the Azure Stack Development Kit is an open sourced script based on WCF and PowerShell.

### Prepare the development kit host using a guided user experience
Before you can install the ASDK on the host computer, the ASDK environment must be prepared.
1. Sign in as a Local Administrator to your ASDK host computer.
2. Ensure that the CloudBuilder.vhdx file has been moved to the root of the C:\ drive (C:\CloudBuilder.vhdx).
3. Run the following script to download the development kit installer file (asdk-installer.ps1) from the [Azure Stack GitHub tools repository](https://github.com/Azure/AzureStack-Tools) to the **C:\AzureStack_Installer** folder on your development kit host computer:

  ```powershell
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 
  # Variables
  $Uri = 'https://raw.githubusercontent.com/Azure/AzureStack-Tools/master/Deployment/asdk-installer.ps1'
  $LocalPath = 'C:\AzureStack_Installer'
  # Create folder
  New-Item $LocalPath -Type directory
  # Download file
  Invoke-WebRequest $uri -OutFile ($LocalPath + '\' + 'asdk-installer.ps1')
  ```

4. From an elevated PowerShell console, start the **C:\AzureStack_Installer\asdk-installer.ps1** script, and then click **Prepare Environment**.
5. On the **Select Cloudbuilder vhdx** page of the installer, browse to and select the **cloudbuilder.vhdx** file that you downloaded and extracted in the previous steps. On this page you can also, optionally, enable the **Add drivers** check box if you need to add additional drivers to the development kit host computer.  
6. On the **Optional settings** page, provide the local administrator account for the development kit host computer. 

  > [!IMPORTANT]
  > If you don't provide these credentials, you'll need direct or KVM access to the host after the computer restarts as part of setting up the development kit.

7. You can also provide these optional settings on the **Optional settings** page:
    - **Computername**: This option sets the name for the development kit host. The name must comply with FQDN requirements and must be 15 characters or less in length. The default is a random computer name generated by Windows.
    - **Time zone**: Sets the time zone for the development kit host. The default is (UTC-8:00) Pacific Time (US & Canada).
    - **Static IP configuration**: Sets your deployment to use a static IP address. Otherwise, when the installer reboots into the cloudbuilder.vhx, the network interfaces are configured with DHCP.
11. Click **Next**.
12. If you chose a static IP configuration in the previous step, you must now:
    - Select a network adapter. Make sure you can connect to the adapter before you click **Next**.
    - Make sure that the **IP address**, **Gateway**, and **DNS** values are correct and then click **Next**.
13. Click **Next** to start the preparation process.
14. When the preparation indicates **Completed**, click **Next**.
15. Click **Reboot now** to boot into the cloudbuilder.vhdx and continue the deployment process.


### Deploy the development kit using a guided experience
After preparing the ASDK host computer, the ASDK can be deployed into the CloudBuilder.vhdx image using the following steps. 
1. After the host computer successfully boots into the CloudBuilder.vhdx image, log in using the administrator credentials specified in the previous steps. 
2. Open an elevated PowerShell console and run the **\AzureStack_Installer\asdk-installer.ps1** script (which might now be on a different drive in the CloudBuilder.vhdx image). Click **Install**.
3. In the **Type** drop-down box, select **Azure Cloud** or **AD FS**.
    - **Azure Cloud**: Configures Azure Active Directory (Azure AD) as the identity provider. To use this option, you will need an internet connection, the full name of an Azure AD directory tenant in the form of *domainname*.onmicrosoft.com or an Azure AD verified custom domain name, and global admin credentials for the specified directory. 
    - **AD FS**: The default stamp Directory Service will be used as the identity provider. The default account to sign in with is azurestackadmin@azurestack.local, and the password to use is the one you provided as part of the setup.
4. Under **Local administrator password**, in the **Password** box, type the local administrator password (which must match the current configured local administrator password), and then click **Next**.
5. Select a network adapter to use for the development kit and then click **Next**.
6. Select DHCP or static network configuration for the BGPNAT01 virtual machine.
    - **DHCP** (default): The virtual machine gets the IP network configuration from the DHCP server.
    - **Static**: Only use this option if DHCP can’t assign a valid IP address for Azure Stack to access the Internet. A static IP address must be specified with the subnetmask length in CIDR format (for example, 10.0.0.5/24).
7. Optionally, set the following values:
    - **VLAN ID**: Sets the VLAN ID. Only use this option if the host and AzS-BGPNAT01 must configure VLAN ID to access the physical network (and internet). 
    - **DNS forwarder**: A DNS server is created as part of the Azure Stack deployment. To allow computers inside the solution to resolve names outside of the stamp, provide your existing infrastructure DNS server. The in-stamp DNS server forwards unknown name resolution requests to this server.
    - **Time server**: This required field sets the time server to be used by the development kit. This parameter must be provided as a valid time server IP address. Server names are not supported.
  
  > [!TIP]
  > To find a time server IP address, visit [pool.ntp.org](http:\\pool.ntp.org) or ping time.windows.com. 
  
8. Click **Next**. 
9. On the **Verifying network interface card properties** page, you'll see a progress bar. 
    - If it says **An update cannot be downloaded**, follow the instructions on the page.
    - When it says **Completed**, click **Next**.
10. On **Summary** page, click **Deploy**. Here you can also copy the PowerShell setup commands that will be used to install the development kit.
11. If you're using an Azure AD deployment, you'll be prompted to enter your Azure AD global administrator account credentials a few minutes after setup starts.
12. The deployment process can take a few hours, during which the system automatically reboots once. When the deployment succeeds, the PowerShell console displays: **COMPLETE: Action ‘Deployment’**. If the deployment fails, you can can [redeploy](azure-stack-redeploy.md) from scratch or use the following PowerShell commands, from the same elevated PowerShell window, to restart the deployment from the last successful step:

  ```powershell
  cd C:\CloudDeployment\Setup
  .\InstallAzureStackPOC.ps1 -Rerun
  ```

   > [!IMPORTANT]
   > If you want to monitor the deployment progress, sign in as azurestack\AzureStackAdmin when the development kit host restarts during setup. If you sign in as a local admin after the machine is joined to the domain, you won't see the deployment progress. Do not rerun deployment, instead sign in as azurestack\AzureStackAdmin to validate that it's running.
   

## Deploy the ASDK using PowerShell
The previous steps walked you through deploying the ASDK using a guided user experience. Alternatively, you can use PowerShell to deploy the ASDK on the development kit host by following the steps in this section.

### Configure the ASDK host computer to boot from CloudBuilder.vhdx
These commands will configure your ASDK host computer to boot from the downloaded and extracted Azure Stack virtual harddisk (CloudBuilder.vhdx). After completing these steps, restart the ASDK host computer.

1. Launch a command prompt as administrator.
2. Run `bcdedit /copy {current} /d "Azure Stack"`
3. Copy (CTRL+C) the CLSID value returned, including the required {}'s. This value is referred to as {CLSID} and will need to be pasted in (CTRL+V or right-click) in the remaining steps.
4. Run `bcdedit /set {CLSID} device vhd=[C:]\CloudBuilder.vhdx` 
5. Run `bcdedit /set {CLSID} osdevice vhd=[C:]\CloudBuilder.vhdx` 
6. Run `bcdedit /set {CLSID} detecthal on` 
7. Run `bcdedit /default {CLSID}`
8. To verify boot settings, run `bcdedit`. 
9. Ensure that the CloudBuilder.vhdx file has been moved to the root of the C:\ drive (C:\CloudBuilder.vhdx) and restart the development kit host computer. When the ASDK host is restarted it should now default to booting from the CloudBuilder.vhdx VM. 

### Prepare the development kit host using PowerShell 
After the development kit host computer successfully boots into the CloudBuilder.vhdx image, you can open an elevated PowerShell console and run the commands in this section to deploy the ASDK on the development kit host.

> [!IMPORTANT] 
> ASDK installation supports exactly one network interface card (NIC) for networking. If you have multiple NICs, make sure that only one is enabled (and all others are disabled) before running the deployment script.

You can deploy Azure Stack with Azure AD or AD FS as the identity provider. Azure Stack, resource providers, and other applications work the same way with both. To learn more about what is supported with AD FS in Azure Stack, see the [key features and concepts](.\azure-stack-key-features.md) article.

> [!TIP]
> If you don't supply any setup parameters (see InstallAzureStackPOC.ps1 optional parameters and examples below), you'll be prompted for the required parameters.

### Deploy Azure Stack using Azure AD 
To deploy Azure Stack **using Azure AD as the identity provider**, you must have internet connectivity either directly or through a transparent proxy. Run the following PowerShell commands to deploy the development kit using Azure AD:

  ```powershell
  cd C:\CloudDeployment\Setup     
  $adminpass = Get-Credential Administrator     
  .\InstallAzureStackPOC.ps1 -AdminPassword $adminpass.Password
  ```

  A few minutes into ASDK installation you will be prompted for Azure AD credentials. You must provide global administrator credentials for your Azure AD tenant. 

### Deploy Azure Stack using AD FS 
To deploy the development kit **using AD FS as the identity provider**, run the following PowerShell commands (you just need to add the -UseADFS parameter): 

  ```powershell
  cd C:\CloudDeployment\Setup     
  $adminpass = Get-Credential Administrator 
  .\InstallAzureStackPOC.ps1 -AdminPassword $adminpass.Password -UseADFS
  ```

In AD FS deployments, the default stamp Directory Service is used as the identity provider. The default account to sign in with is azurestackadmin@azurestack.local, and the password will be set to what you provided as part of the PowerShell setup commands.

The deployment process can take a few hours, during which time the system automatically reboots once. When the deployment succeeds, the PowerShell console displays: **COMPLETE: Action ‘Deployment’**. If the deployment fails, you can try running the script again using the -rerun parameter. Or, you can [redeploy ASDK](.\azure-stack-redeploy.md) from scratch.
> [!IMPORTANT]
> If you want to monitor the deployment progress after the ASDK host reboots, you must sign in as AzureStack\AzureStackAdmin. If you sign in as a local administrator after the host computer is restarted (and joined to the azurestack.local domain), you won't see the deployment progress. Do not rerun deployment, instead sign in as azurestack to validate that it's running.
>

#### Azure AD deployment script examples
You can script the entire Azure AD deployment. Here are some commented examples that include some optional parameters.

If your Azure AD identity is only associated with **one** Azure AD directory:
```powershell
cd C:\CloudDeployment\Setup 
$adminpass = Get-Credential Administrator 
$aadcred = Get-Credential "<Azure AD global administrator account name>" 
.\InstallAzureStackPOC.ps1 -AdminPassword $adminpass.Password -InfraAzureDirectoryTenantAdminCredential $aadcred -TimeServer 52.168.138.145 #Example time server IP address.
```

If your Azure AD identity is associated with **greater than one** Azure AD directory:
```powershell
cd C:\CloudDeployment\Setup 
$adminpass = Get-Credential Administrator 
$aadcred = Get-Credential "<Azure AD global administrator account name>" #Example: user@AADDirName.onmicrosoft.com 
.\InstallAzureStackPOC.ps1 -AdminPassword $adminpass.Password -InfraAzureDirectoryTenantAdminCredential $aadcred -InfraAzureDirectoryTenantName "<Azure AD directory in the form of domainname.onmicrosoft.com or an Azure AD verified custom domain name>" -TimeServer 52.168.138.145 #Example time server IP address.
```

If your environment **does not** have DHCP enabled then you must include the following additional parameters to one of the options above (example usage provided): 

```powershell
.\InstallAzureStackPOC.ps1 -AdminPassword $adminpass.Password -InfraAzureDirectoryTenantAdminCredential $aadcred -NatIPv4Subnet 10.10.10.0/24 -NatIPv4Address 10.10.10.3 -NatIPv4DefaultGateway 10.10.10.1 -TimeServer 10.222.112.26
```

### ASDK InstallAzureStackPOC.ps1 optional parameters
|Parameter|Required/Optional|Description|
|-----|-----|-----|
|AdminPassword|Required|Sets the local administrator account and all other user accounts on all the virtual machines created as part of development kit deployment. This password must match the current local administrator password on the host.|
|InfraAzureDirectoryTenantName|Required|Sets the tenant directory. Use this parameter to specify a specific directory where the AAD account has permissions to manage multiple directories. Full Name of an AAD Directory Tenant in the format of .onmicrosoft.com or an Azure AD verified custom domain name.|
|TimeServer|Required|Use this parameter to specify a specific time server. This parameter must be provided as a valid time server IP address. Server names are not supported.|
|InfraAzureDirectoryTenantAdminCredential|Optional|Sets the Azure Active Directory user name and password. These Azure credentials must be an Org ID.|
|InfraAzureEnvironment|Optional|Select the Azure Environment with which you want to register this Azure Stack deployment. Options include Public Azure, Azure - China, Azure - US Government.|
|DNSForwarder|Optional|A DNS server is created as part of the Azure Stack deployment. To allow computers inside the solution to resolve names outside of the stamp, provide your existing infrastructure DNS server. The in-stamp DNS server forwards unknown name resolution requests to this server.|
|NatIPv4Address|Required for DHCP NAT support|Sets a static IP address for MAS-BGPNAT01. Only use this parameter if the DHCP can’t assign a valid IP address to access the Internet.|
|NatIPv4Subnet|Required for DHCP NAT support|IP Subnet prefix used for DHCP over NAT support. Only use this parameter if the DHCP can’t assign a valid IP address to access the Internet.|
|PublicVlanId|Optional|Sets the VLAN ID. Only use this parameter if the host and MAS-BGPNAT01 must configure VLAN ID to access the physical network (and Internet). For example, .\InstallAzureStackPOC.ps1 -Verbose -PublicVLan 305|
|Rerun|Optional|Use this flag to rerun deployment. All previous input is used. Re-entering data previously provided is not supported because several unique values are generated and used for deployment.|

## Activate the administrator and tenant portals
After deployments that use Azure AD, you must activate both the Azure Stack administrator and tenant portals. This activation consents to giving the Azure Stack portal and Azure Resource Manager the correct permissions (listed on the consent page) for all users of the directory.

- For the administrator portal, navigate to https://adminportal.local.azurestack.external/guest/signup, read the information, and then click **Accept**. After accepting, you can add service administrators who are not also directory tenant administrators.

- For the tenant portal, navigate to https://portal.local.azurestack.external/guest/signup, read the information, and then click **Accept**. After accepting, users in the directory can sign in to the tenant portal. 

> [!NOTE] 
> If the portals are not activated, only the directory administrator can sign in and use the portals. If any other user signs in, they will see an error that tells them that the administrator has not granted permissions to other users. When the administrator does not natively belong to the directory Azure Stack is registered to, the Azure Stack directory must be appended to the activation URL. For example, if Azure Stack is registered to fabrikam.onmicrosoft.com and the admin user is admin@contoso.com, navigate to https://portal.local.azurestack.external/guest/signup/fabrikam.onmicrosoft.com to activate the portal. 

## Reset the password expiration policy 
To make sure that the password for the development kit host doesn't expire before your evaluation period ends, follow these steps after you deploy the ASDK.

### To change the password expiration policy from Powershell:
From an elevated Powershell console, run the command:

```powershell
Set-ADDefaultDomainPasswordPolicy -MaxPasswordAge 180.00:00:00 -Identity azurestack.local
```

### To change the password expiration policy manually:
1. On the development kit host, open **Group Policy Management** and navigate to **Group Policy Management** – **Forest: azurestack.local** – **Domains** – **azurestack.local**.
2. Right click **Default Domain Policy** and click **Edit**.
3. In the Group Policy Management Editor, navigate to **Computer Configuration** – **Policies** – **Windows Settings** – **Security Settings** – **Account Policies** – **Password Policy**.
4. In the right pane, double-click **Maximum password age**.
5. In the **Maximum password age Properties** dialog box, change the **Password will expire in** value to 180, then click **OK**.


## Next steps

[Connect to Azure Stack](azure-stack-connect-azure-stack.md)

[Setup PowerShell for Azure Stack environments](azure-stack-powershell-configure-quickstart.md)

[Register Azure Stack with your Azure subscription](azure-stack-register.md)



