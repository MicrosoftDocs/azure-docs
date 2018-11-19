---
title: Deploy Azure Stack - PowerShell | Microsoft Docs
description: In this article, you install the ASDK from the command line using PowerShell.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.custom: 
ms.date: 09/10/2018
ms.author: jeffgilb
ms.reviewer: misainat
---

# Deploy the ASDK from the command line
The ASDK is a testing and development environment that you can deploy to evaluate and demonstrate Azure Stack features and services. To get it up and running, you need to prepare the environment hardware and run some scripts (this will take several hours). After that, you can sign in to the admin and user portals to start using Azure Stack.

## Prerequisites 
Prepare the development kit host computer. Plan your hardware, software, and network. The computer that hosts the development kit (the development kit host) must meet hardware, software, and network requirements. You must also choose between using Azure Active Directory (Azure AD) or Active Directory Federation Services (AD FS). Be sure to comply with these prerequisites before starting your deployment so that the installation process runs smoothly. 

Before you deploy the ASDK, make sure your planned development kit host computer's hardware, operating system, account, and network configurations meet the minimum requirements for installing the ASDK.

**[Review the ASDK deployment planning considerations](asdk-deploy-considerations.md)**

> [!TIP]
> You can use the [Azure Stack deployment requirements check tool](https://gallery.technet.microsoft.com/Deployment-Checker-for-50e0f51b) after installing the operating system to confirm that your hardware meets all requirements.

## Download and extract the deployment package
After ensuring that your development kit host computer meets the basic requirements for installing the ASDK, the next step is to download and extract the ASDK deployment package. The deployment package includes the Cloudbuilder.vhdx file, which is a virtual hard drive that includes a bootable operating system and the Azure Stack installation files.

You can download the deployment package to the development kit host or to another computer. The extracted deployment files take up 60 GB of free disk space, so using another computer can help reduce the hardware requirements for the development kit host.

**[Download and extract the Azure Stack Development Kit (ASDK)](asdk-download.md)**

## Prepare the development kit host computer
Before you can install the ASDK on the host computer, the environment must be prepared and the system configured to boot from VHD. After this step, the development kit host will boot to the Cloudbuilder.vhdx (a virtual hard drive that includes a bootable operating system and the Azure Stack installation files).

Use PowerShell to configure the ASDK host computer to boot from CloudBuilder.vhdx. These commands configure your ASDK host computer to boot from the downloaded and extracted Azure Stack virtual harddisk (CloudBuilder.vhdx). After completing these steps, restart the ASDK host computer.

To configure the ASDK host computer to boot from CloudBuilder.vhdx:

  1. Launch a command prompt as administrator.
  2. Run `bcdedit /copy {current} /d "Azure Stack"`
  3. Copy (CTRL+C) the CLSID value returned, including the required {}'s. This value is referred to as {CLSID} and will need to be pasted in (CTRL+V or right-click) in the remaining steps.
  4. Run `bcdedit /set {CLSID} device vhd=[C:]\CloudBuilder.vhdx` 
  5. Run `bcdedit /set {CLSID} osdevice vhd=[C:]\CloudBuilder.vhdx` 
  6. Run `bcdedit /set {CLSID} detecthal on` 
  7. Run `bcdedit /default {CLSID}`
  8. To verify boot settings, run `bcdedit`. 
  9. Ensure that the CloudBuilder.vhdx file has been moved to the root of the C:\ drive (C:\CloudBuilder.vhdx) and restart the development kit host computer. When the ASDK host computer is restarted, it should boot from the CloudBuilder.vhdx virtual machine hard drive to begin ASDK deployment. 

> [!IMPORTANT]
> Ensure that you have direct physical or KVM access to the development kit host computer before restarting it. When the VM first starts, it prompts you to complete Windows Server Setup. Provide the same administrator credentials you used to log into the development kit host computer. 

### Prepare the development kit host using PowerShell 
After the development kit host computer successfully boots into the CloudBuilder.vhdx image, log in with the same local administrator credentials you used to log into the development kit host computer (and that you provided as part of finalizing Windows Server Setup when the host computer booted from VHD). 

> [!NOTE]
> Optionally, you can also configure [Azure Stack telemetry settings](asdk-telemetry.md#set-telemetry-level-in-the-windows-registry) *before* installing the ASDK.

Open an elevated PowerShell console and run the commands in this section to deploy the ASDK on the development kit host.

> [!IMPORTANT] 
> ASDK installation supports exactly one network interface card (NIC) for networking. If you have multiple NICs, make sure that only one is enabled (and all others are disabled) before running the deployment script.

You can deploy Azure Stack with Azure AD or Windows Server AD FS as the identity provider. Azure Stack, resource providers, and other applications work the same way with both.

> [!TIP]
> If you don't supply any setup parameters (see InstallAzureStackPOC.ps1 optional parameters and examples below), you are prompted for the required parameters.

### Deploy Azure Stack using Azure AD 
To deploy Azure Stack **using Azure AD as the identity provider**, you must have internet connectivity either directly or through a transparent proxy. 

Run the following PowerShell commands to deploy the development kit using Azure AD:

  ```powershell
  cd C:\CloudDeployment\Setup     
  $adminpass = Get-Credential Administrator     
  .\InstallAzureStackPOC.ps1 -AdminPassword $adminpass.Password
  ```

A few minutes into ASDK installation you will be prompted for Azure AD credentials. You must provide global administrator credentials for your Azure AD tenant. 

After deployment, Azure Active Directory global administrator permission is not required. However, some operations may require the global administrator credential. For example, a resource provider installer script or a new feature requiring a permission to be granted. You can either temporarily re-instate the account’s global administrator permissions or use a separate global administrator account that is an owner of the *default provider subscription*.

### Deploy Azure Stack using AD FS 
To deploy the development kit **using AD FS as the identity provider**, run the following PowerShell commands (you just need to add the -UseADFS parameter): 

  ```powershell
  cd C:\CloudDeployment\Setup     
  $adminpass = Get-Credential Administrator 
  .\InstallAzureStackPOC.ps1 -AdminPassword $adminpass.Password -UseADFS
  ```

In AD FS deployments, the default stamp Directory Service is used as the identity provider. The default account to sign in with is azurestackadmin@azurestack.local, and the password will be set to what you provided as part of the PowerShell setup commands.

The deployment process can take a few hours, during which time the system automatically reboots once. When the deployment succeeds, the PowerShell console displays: **COMPLETE: Action ‘Deployment’**. If the deployment fails, you can try running the script again using the -rerun parameter. Or, you can [redeploy ASDK](asdk-redeploy.md) from scratch.

> [!IMPORTANT]
> If you want to monitor the deployment progress after the ASDK host reboots, you must sign in as AzureStack\AzureStackAdmin. If you sign in as a local administrator after the host computer is restarted (and joined to the azurestack.local domain), you won't see the deployment progress. Do not rerun deployment, instead sign in as azurestack to validate that it's running.


#### Azure AD deployment script examples
You can script the entire Azure AD deployment. Here are a few commented examples that include some optional parameters.

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

If your environment does not have DHCP enabled, then you must include the following additional parameters to one of the options above (example usage provided): 

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


## Perform post-deployment configurations
After installing the ASDK, there are a few recommended post-installation checks and configuration changes that should be made. You can validate your installation was installed successfully using the test-AzureStack cmdlet, and install Azure Stack PowerShell and GitHub tools. 

You should also reset the password expiration policy to make sure that the password for the development kit host doesn't expire before your evaluation period ends.

> [!NOTE]
> Optionally, you can also configure [Azure Stack telemetry settings](asdk-telemetry.md#enable-or-disable-telemetry-after-deployment) *after* installing the ASDK.

**[Post ASDK deployment tasks](asdk-post-deploy.md)**

## Register with Azure
You must register Azure Stack with Azure so that you can [download Azure marketplace items](asdk-marketplace-item.md) to Azure Stack.

**[Register Azure Stack with Azure](asdk-register.md)**

## Next steps
Congratulations! After completing these steps, you’ll have a development kit environment with both [administrator](https://adminportal.local.azurestack.external) and [user](https://portal.local.azurestack.external) portals. 

[Post ASDK installation configuration tasks](asdk-post-deploy.md)

