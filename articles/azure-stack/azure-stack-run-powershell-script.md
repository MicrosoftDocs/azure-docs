---
title: Deploy Azure Stack development kit | Microsoft Docs
description: Learn how to prepare the Azure Stack development kit and run the PowerShell script to deploy Azure Stack development kit.
services: azure-stack
documentationcenter: ''
author: ErikjeMS
manager: byronr
editor: ''

ms.assetid: 0ad02941-ed14-4888-8695-b82ad6e43c66
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 4/6/2017
ms.author: erikje

---
# Deploy Azure Stack development kit
To deploy the Azure Stack development kit, you must complete the following steps:

1. [Download the deployment package](https://azure.microsoft.com/overview/azure-stack/try/?v=try) to get the Cloudbuilder.vhdx.
2. [Prepare the deployment machine](#prepare-the-deployment-machine) by running the PrepareBootFromVHD.ps1 script to configure the computer (the development kit host) on which you want to install Azure Stack development kit. After this step, the development kit host will boot to the Cloudbuilder.vhdx.
3. [Run the PowerShell deployment script](#run-the-powershell-deployment-script) on the development kit host to install the Azure Stack development kit.
4. **NEW step for Technical Preview 3**: If your deployment uses Azure Active Directory, [activate the portals](#activate-the-administrator-and-tenant-portals) to give the Azure Stack portal and Azure Resource Manager the correct permissions for all users of the directory .

> [!NOTE]
> For best results, even if you want to use a disconnected Azure Stack environment, it is best to deploy while connected to the internet. That way, the Windows Server 2016 evaluation version can be activated at deployment time. If the Windows Server 2016 evaluation version is not activated within 10 days, it shuts down.
> 
> 

## Download and extract Microsoft Azure Stack development kit
1. Before you start the download, make sure that your computer meets the following prerequisites:

   * The computer must have at least 60 GB of free disk space.
   * [.NET Framework 4.6 (or a later version)](https://aka.ms/r6mkiy) must be installed.

2. [Go to the Get Started page](https://azure.microsoft.com/overview/azure-stack/try/?v=try), provide your details, and click **Submit**.
3. Under **Download the software**, click **Azure Stack Technical Preview 3**.
4. Run the downloaded AzureStackDownloader.exe file.
5. In the **Azure Stack Development Kit Downloader** window, follow steps 1 through 5.
6. After the download completes, click **Run** to launch the MicrosoftAzureStackPOC.exe.
7. Review the License Agreement screen and information of the Self-Extractor Wizard and then click **Next**.
8. Review the Privacy Statement screen and information of the Self-Extractor Wizard and then click **Next**.
9. Select the Destination for the files to be extracted, click **Next**.
   * The default is: <drive letter>:\<current folder>\Microsoft Azure Stack POC
10. Review the Destination location screen and information of the Self-Extractor Wizard, and then click **Extract** to extract the CloudBuilder.vhdx (~35 GB) and ThirdPartyLicenses.rtf files. This will take some time to complete.

> [!NOTE]
> After you extract the files, you can delete the exe and bin files to recover space on the machine. Or, you can move these files to another location so that if you need to redeploy you don’t need to download the files again.
> 
> 

## Prepare the development kit host
1. Make sure that you can physically connect to the development kit host, or have physical console access (such as KVM). You will need such access after you reboot the development kit host in step 9 below.
2. Make sure the development kit host meets the [minimum requirements](azure-stack-deploy.md). You can use the [Deployment Checker for Azure Stack](https://gallery.technet.microsoft.com/Deployment-Checker-for-50e0f51b) to confirm your requirements.
3. Sign in as the Local Administrator to your development kit host.
4. Copy or move the CloudBuilder.vhdx file to the root of the C:\ drive (C:\CloudBuilder.vhdx).
   
   > [!NOTE]
   > If you choose not to use the recommended script to prepare your development kit host (steps 5 – step 7), do not enter any license key at the activation page. A trial version of Windows Server 2016 image is included, and entering a license key causes expiration warning messages.
   > 
   > 
5. On the development kit host, run the following PowerShell script to download the Azure Stack support files:
   
        # Variables
        $Uri = 'https://raw.githubusercontent.com/Azure/AzureStack-Tools/master/Deployment/'
        $LocalPath = 'c:\AzureStack_SupportFiles'
   
        # Create folder
        New-Item $LocalPath -type directory
   
        # Download files
        ( 'BootMenuNoKVM.ps1', 'PrepareBootFromVHD.ps1', 'Unattend.xml', 'unattend_NoKVM.xml') | `
        foreach { Invoke-WebRequest ($uri + $_) -OutFile ($LocalPath + '\' + $_) } 
   
    This script downloads the Azure Stack support files to the folder specified by the $LocalPath parameter.
6. Open an elevated PowerShell console and change the directory to where you copied the support files.
7. Run the PrepareBootFromVHD.ps1 script. This script and the unattend files are available with the other support scripts provided along with this build.
    There are five parameters for this PowerShell script:
    
    | Parameter | Required/Optional | Description |
    | --- | --- | --- |
    |CloudBuilderDiskPath|Required|The path to the CloudBuilder.vhdx on the development kit host.|
    |DriverPath|Optional|Lets you add additional drivers for the development kit host in the VHD.|
    |ApplyUnattend|Optional|Specify this switch parameter to automate the configuration of the operating system. If specified, the user must provide the AdminPassword to configure the OS at boot (requires provided accompanying file unattend_NoKVM.xml). If you do not use this parameter, the generic unattend.xml file is used without further customization. You'll need KVM access to complete customization after it reboots.|
    |AdminPassword|Optional|Only used when the ApplyUnattend parameter is set, requires a minimum of six characters.|
    |VHDLanguage|Optional|Specifies the VHD language, defaulted to “en-US.”|

    The script is documented and contains example usage, though the most common usage is:
     
    `.\PrepareBootFromVHD.ps1 -CloudBuilderDiskPath C:\CloudBuilder.vhdx -ApplyUnattend`
     
    If you run this exact command, you must enter the AdminPassword at the prompt.
8. When the script is complete, you must confirm the reboot. If there are other users logged in, this command will fail. If the command fails, run the following command: `Restart-Computer -force` 
9. The development kit host reboots into the OS of the CloudBuilder.vhdx, where the deployment continues.

## Run the PowerShell deployment script
1. Sign in as the Local Administrator to the development kit host. Use the credentials specified in the previous steps.

    > [!IMPORTANT]
    > Azure Stack requires access to the Internet, either directly or through a transparent proxy. The deployment supports exactly one NIC for networking. If you have multiple NICs, make sure that only one is enabled (and all others are disabled) before running the deployment script in the next section.
    
2. Open an elevated PowerShell console.
3. In PowerShell, run this command: `cd C:\CloudDeployment\Setup`. If you don't supply any parameters (see **InstallAzureStackPOC.ps1 optional parameters** below), you'll be prompted for the required parameters.
4. You can deploy Azure Stack with Azure Active Directory or Active Directory Federation Services. Azure Stack, resource providers, and other applications work the same way with both. To learn more about what is supported with AD FS in Azure Stack, see the [Key features and concepts](azure-stack-key-features.md) article.

    To deploy Azure Stack with Azure Active Directory, run the deploy command:
    
    ```powershell
    cd C:\CloudDeployment\Setup 
    $adminpass = ConvertTo-SecureString "〈LOCAL_ADMIN_PASSWORD〉" -AsPlainText -Force 
    .\InstallAzureStackPOC.ps1 -AdminPassword $adminpass
    ```

    To deploy the Azure Stack development kit with Active Directory Federation Services instead, run the following script (you just need to add the -UseADFS parameter):

    ```powershell
    cd C:\CloudDeployment\Setup 
    $adminpass = ConvertTo-SecureString "〈LOCAL_ADMIN_PASSWORD〉" -AsPlainText -Force 
    .\InstallAzureStackPOC.ps1 -AdminPassword $adminpass -UseADFS
    ```

    In this AD FS deployment, the default stamp Directory Service is used as the identity provider, the default account to sign in with is azurestackadmin@azurestack.local, and the password to use is the one you provided as part of the setup.

5. If you used the AAD option, enter the credentials for your Azure Active Directory account. This user must be the Global Admin in the directory tenant.
6. The deployment process can take a few hours, during which the system automatically reboots once.
   
   > [!IMPORTANT]
   > If you want to monitor the deployment progress, sign in as azurestack\AzureStackAdmin. If you sign in as a local admin after the machine is joined to the domain, you won't see the deployment progress. Do not rerun deployment, instead sign in as azurestack\AzureStackAdmin to validate that it's running.
   > 
   > 
   
    When the deployment succeeds, the PowerShell console displays: **COMPLETE: Action ‘Deployment’**.
   
    If the deployment fails, you can try run the script again using the -rerun parameter. Or, you can [redeploy](azure-stack-redeploy.md) it from scratch.

### AAD deployment script examples
You can script the entire AAD deployment. Here are some examples.

If your AAD Identity is only associated with ONE AAD Directory:

    cd C:\CloudDeployment\Setup
    $adminpass = ConvertTo-SecureString "<LOCAL ADMIN PASSWORD>" -AsPlainText -Force
    $aadpass = ConvertTo-SecureString "<AAD GLOBAL ADMIN ACCOUNT PASSWORD>" -AsPlainText -Force
    $aadcred = New-Object System.Management.Automation.PSCredential ("<AAD GLOBAL ADMIN ACCOUNT>", $aadpass)
    .\InstallAzureStackPOC.ps1 -AdminPassword $adminpass -InfraAzureDirectoryTenantAdminCredential $aadcred

If your AAD Identity is associated with GREATER THAN ONE AAD Directory:

    cd C:\CloudDeployment\Setup
    $adminpass = ConvertTo-SecureString "<LOCAL ADMIN PASSWORD>" -AsPlainText -Force
    $aadpass = ConvertTo-SecureString "<AAD GLOBAL ADMIN ACCOUNT PASSWORD>" -AsPlainText -Force
    $aadcred = New-Object System.Management.Automation.PSCredential ("<AAD GLOBAL ADMIN ACCOUNT> ` 
    example: user@AADDirName.onmicrosoft.com>", $aadpass)
    .\InstallAzureStackPOC.ps1 -AdminPassword $adminpass -InfraAzureDirectoryTenantAdminCredential $aadcred ` 
    -InfraAzureDirectoryTenantName "<SPECIFIC AAD DIRECTORY example: AADDirName.onmicrosoft.com>"

### Using static IP addresses

If your environment DOESN'T have DHCP enabled, you must include the following ADDITIONAL parameters to one of the options above (example usage provided):

    .\InstallAzureStackPOC.ps1 -AdminPassword $adminpass -InfraAzureDirectoryTenantAdminCredential $aadcred
    -NatIPv4Subnet 10.10.10.0/24 -NatIPv4Address 10.10.10.3 -NatIPv4DefaultGateway 10.10.10.1


### InstallAzureStackPOC.ps1 optional parameters
| Parameter | Required/Optional | Description |
| --- | --- | --- |
| InfraAzureDirectoryTenantAdminCredential |Optional |Sets the Azure Active Directory user name and password. These Azure credentials must be an Org ID.|
| InfraAzureDirectoryTenantName |Required |Sets the tenant directory. Use this parameter to specify a specific directory where the AAD account has permissions to manage multiple directories. Full Name of an AAD Directory Tenant in the format of <directoryName>.onmicrosoft.com. |
| AdminPassword |Required |Sets the local administrator account and all other user accounts on all the virtual machines created as part of development kit deployment. This password must match the current local administrator password on the host. |
| AzureEnvironment |Optional |Select the Azure Environment with which you want to register this Azure Stack deployment. Options include *Public Azure*, *Azure - China*, *Azure - US Government*. |
| EnvironmentDNS |Optional |A DNS server is created as part of the Azure Stack deployment. To allow computers inside the solution to resolve names outside of the stamp, provide your existing infrastructure DNS server. The in-stamp DNS server forwards unknown name resolution requests to this server. |
| NatIPv4Address |Required for DHCP NAT support |Sets a static IP address for MAS-BGPNAT01. Only use this parameter if the DHCP can’t assign a valid IP address to access the Internet. |
| NatIPv4DefaultGateway |Required for DHCP NAT support |Sets the default gateway used with the static IP address for MAS-BGPNAT01. Only use this parameter if the DHCP can’t assign a valid IP address to access the Internet. |
| NatIPv4Subnet |Required for DHCP NAT support |IP Subnet prefix used for DHCP over NAT support. Only use this parameter if the DHCP can’t assign a valid IP address to access the Internet. |
| PublicVLan |Optional |Sets the VLAN ID. Only use this parameter if the host and MAS-BGPNAT01 must configure VLAN ID to access the physical network (and Internet). For example, `.\InstallAzureStackPOC.ps1 –Verbose –PublicVLan 305` |
| Rerun |Optional |Use this flag to rerun deployment.  All previous input is used. Re-entering data previously provided is not supported because several unique values are generated and used for deployment. |
| TimeServer |Optional |Use this parameter if you need to specify a specific time server. |

## Activate the administrator and tenant portals

After deployments that use Azure Active Directory, you must activate both the administrator and tenant portals. This activation consents to giving the Azure Stack portal and Azure Resource Manager the correct permissions (listed on the consent page) for all users of the directory.

1. For the administrator portal, navigate to https://adminportal.local.azurestack.external/guest/signup, read the information, and then click **Accept**. After accepting, you can add service administrators who are not also directory tenant administrators.

2. For the tenant portal, navigate to https://portal.local.azurestack.external/guest/signup, read the information, and then click **Accept**. After accepting, users in the directory can sign in to the tenant portal.

> [!NOTE]
> If the portals are not activated, only the directory administrator can sign in and use the portals. If any other user signs in, they will see an error that tells them that the administrator has not granted permissions to other users.
> When the administrator does not natively belong to the directory Azure Stack is registered to, the Azure Stack directory must be appended to the activation URL. For example, if Azure Stack is registered to fabrikam.onmicrosoft.com and the admin user is admin@contoso.com, navigate to https://portal.local.azurestack.external/guest/signup/fabrikam.onmicrosoft.com to activate the portal.
> 
> 

## Reset the password expiration to 180 days

To make sure that the password for the development kit host doesn't expire too soon, follow these steps after you deploy:

1. Sign in to the development kit host as azurestack\azurestackadmin.

2. Run the following command to display the current MaxPasswordAge of 42 days: `Get-ADDefaultDomainPasswordPolicy`

3. Run the following command to update the MaxPasswordAge to 180 days:

    `Set-ADDefaultDomainPasswordPolicy -MaxPasswordAge 180.00:00:00 -Identity azurestack.local`   

4. Run the following command again to confirm the password age change: `Get-ADDefaultDomainPasswordPolicy`.

## Next steps
[Register Azure Stack with your Azure subscription](azure-stack-register.md)
[Connect to Azure Stack](azure-stack-connect-azure-stack.md)

