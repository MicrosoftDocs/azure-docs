<properties
	pageTitle="Deploy Azure Stack POC | Microsoft Azure"
	description="Learn how to prepare the Azure Stack POC and run the PowerShell script to deploy Azure Stack POC."
	services="azure-stack"
	documentationCenter=""
	authors="ErikjeMS"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="09/27/2016"
	ms.author="erikje"/>

# Deploy Azure Stack POC
To deploy the Azure Stack POC, you first need to [prepare the deployment machine](#prepare-the-deployment-machine) and then [run the PowerShell deployment script](#run-the-powershell-deployment-script).

## Download and extract Microsoft Azure Stack POC TP2

Before you start, make sure that you at least 85 GB of space.

1. The download of Azure Stack POC TP2 is comprised of a zip file containing the following 12 files, totaling ~20GB:
    - 1 MicrosoftAzureStackPOC.EXE
    - 11 MicrosoftAzureStackPOC-N.BIN (where N is 1-11)
2. Extract these files into a single folder on your computer.
3. Right-Click on the MicrosoftAzureStackPOC.EXE > Run as an administrator.
4. Review the License Agreement screen and information of the Self-Extractor Wizard and then click **Next**.
5. Review the Privacy Statement screen and information of the Self-Extractor Wizard and then click **Next**.
6. Select the Destination for the files to be extracted, click **Next**.
    - The default is: <drive letter>:\<current folder>\Microsoft Azure Stack POC
7. Review the Destination location screen and information of the Self-Extractor Wizard, and then **click** Extract.
8. Extraction will take some time, because it is extracting: CloudBuilder.vhdx (~44.5GB) and ThirdPartyLicenses.rtf files.

## Prepare the deployment machine

1. Make sure that you can physically connect to the deployment machine, or have physical console access (such as KVM). You will need such access after you reboot the deployment machine in step 9.

2. Make sure the deployment machine meets the [minimum requirements](azure-stack-deploy.md). You can use the [Deployment Checker for Azure Stack Technical Preview 2](https://gallery.technet.microsoft.com/Deployment-Checker-for-50e0f51b) to confirm your requirements.

3. Log in as the Local Administrator to your POC machine.

4. Copy the CloudBuilder.vhdx file to C:\CloudBuilder.vhdx.

    > [AZURE.NOTE] If you choose not to use the recommended script to prepare your POC host computer (steps 5 – step 7), do not enter any license key at the activation page. Included is a trial version of Windows Server 2016 image and entering license key will result in expiration warning messages

5. Download these support files from [Github](https://aka.ms/azurestackdeploytools).

    - PrepareBootFromVHD.ps1
    - unattend.xml
    - unattend_NoKVM.xml 

6. Open an elevated PowerShell console and change the directory to where you copied the files.

7. Run the PrepareBootFromVHD.ps1 script. This and the unattend files are available with the other support scripts provided along with this build.
    There are five parameters for this PowerShell script:
    - CloudBuilderDiskPath (required) – path to the CloudBuilder.vhdx on the HOST.
    - DriverPath (optional) – allows you to add additional drivers for the host in the virtual HD.
    - ApplyUnattend (optional) – switch parameter, if specified, the configuration of the OS is automated, and the user will be prompted for the AdminPassword to configure at boot (requires provided accompanying file unattend_NoKVM.xml).
    If you do not use this parameter, the generic unattend.xml file is used without further customization. You will need KVM to complete customization after it reboots.
    - AdminPassword (optional) – only used when the ApplyUnattend parameter is set, requires a minimum of 6 characters.
    - VHDLanguage (optional) – specifies the VHD language, defaulted to “en-US”.
    The script is documented and contains example usage, though the most common usage is:
    
        `.\PrepareBootFromVHD.ps1 -CloudBuilderDiskPath C:\CloudBuilder.vhdx -ApplyUnattend`
    
        If you run this exact command, you will be prompted to enter the AdminPassword.

8. When the script is complete you will be asked to confirm reboot. If there are other users logged in, this command will fail. If this happens, run the following command: `Restart-Computer -force` 

9. The HOST will reboot into the OS of the CloudBuilder.vhdx, where the remainder of the deployment steps will take place.

> [AZURE.IMPORTANT] Azure Stack requires access to the Internet, either directly or through a transparent proxy. The TP2 POC deployment supports exactly one NIC for networking. If you have multiple NICs, make sure that only one is enabled (and all others are disabled) before running the deployment script below.

## Run the PowerShell deployment script

1. Log in as the Local Administrator to your POC machine. Use the credentials specified in the previous steps.

2. Open an elevated PowerShell console.

3. In PowerShell, run this command: `cd C:\CloudDeployment\Configuration`

4. Run the deploy command: `.\InstallAzureStackPOC.ps1`

5. At the **Enter the password** prompt, enter a password and then confirm it. This is the password to all the virtual machines. Be sure to record it.

6. Enter the credentials for your Azure Active Directory account. This user must be the Global Admin in the directory tenant.

7. The deployment process will take a couple of hours, during which one automated system reboot will occur. If you want to monitor the deployment progress, sign in as azurestack\AzureStackAdmin. If the deployment fails, you can try to [rerun it](azure-stack-rerun-deploy.md).

### Deployment script examples

If your AAD Identity is only associated with ONE AAD Directory:

    cd C:\CloudDeployment\Configuration
    $adminpass = ConvertTo-SecureString "<LOCAL ADMIN PASSWORD>" -AsPlainText -Force
    $aadpass = ConvertTo-SecureString "<AAD GLOBAL ADMIN ACCOUNT PASSWORD>" -AsPlainText -Force
    $aadcred = New-Object System.Management.Automation.PSCredential ("<AAD GLOBAL ADMIN ACCOUNT>", $aadpass)
    .\InstallAzureStackPOC.ps1 -AdminPassword $adminpass -AADAdminCredential $aadcred

If your AAD Identity is associated with GREATER THAN ONE AAD Directory:

    cd C:\CloudDeployment\Configuration
    $adminpass = ConvertTo-SecureString "<LOCAL ADMIN PASSWORD>" -AsPlainText -Force
    $aadpass = ConvertTo-SecureString "<AAD GLOBAL ADMIN ACCOUNT PASSWORD>" -AsPlainText -Force
    $aadcred = New-Object System.Management.Automation.PSCredential "<AAD GLOBAL ADMIN ACCOUNT> example: user@AADDirName.onmicrosoft.com>", $aadpass)
    .\InstallAzureStackPOC.ps1 -AdminPassword $adminpass -AADAdminCredential $aadcred -AADDirectoryTenantName "<SPECIFIC AAD DIRECTORY example: AADDirName.onmicrosoft.com>"

If your environment DOES NOT have DHCP enabled, you will need to include the following ADDITIONAL parameters to one of the options above (example usage provided):

    .\InstallAzureStackPOC.ps1 -AdminPassword $adminpass -AADAdminCredential $aadcred
    -NatIPv4Subnet 10.10.10.0/24 -NatIPv4Address 10.10.10.3 -NatIPv4DefaultGateway 10.10.10.1


### InstallAzureStackPOC.ps1 optional parameters

| Parameter | Required/Optional | Description |
| --------- | ----------------- | ----------- |
| AADAdminCredential | Optional | Sets the Azure Active Directory user name and password. These Azure credentials can be either an Org ID or a Microsoft Account. To use Microsoft Account credentials, do not include this parameter in the cmdlet, thus prompting the Azure Authentication popup during deployment (this will create the authentication and refresh tokens used during deployment). |
| AADDirectoryTenantName | Required | Sets the tenant directory. Use this parameter to specify a specific directory where the AAD account has permissions to manage multiple directories. Full Name of an AAD Directory Tenant in the format of <directoryName>.onmicrosoft.com. |
| AdminPassword | Required | Sets the local administrator account and all other user accounts on all the virtual machines that will be created as part of POC deployment. This must match the current local administrator password on the host. |
| AzureEnvironment | Optional | Select the Azure Environment with which you want to register this Azure Stack deployment. Options include *Public Azure*, *Azure - China*, *Azure - US Government*. |
| EnvironmentDNS | Optional | A DNS server is created as part of the Azure Stack deployment. To allow computers inside of the solution to resolve names outside of the stamp, provide your existing infrastructure DNS server. The in-stamp DNS server will forward unknown name resolution requests to this server. |
| NatIPv4Address | Required for DHCP NAT support | Sets a static IP address for the NAT VM. Only use this parameter if the DHCP can’t assign a valid IP address to access the Internet. |
| NatIPv4DefaultGateway | Required for DHCP NAT support | Sets the default gateway used with the static IP address for the NAT VM. Only use this parameter if the DHCP can’t assign a valid IP address to access the Internet.  |
| NatIPv4Subnet | Required for DHCP NAT support | IP Subnet prefix used for DHCP over NAT support. Only use this parameter if the DHCP can’t assign a valid IP address to access the Internet.  |
| NatSubnetPrefix | Required for DHCP NAT support | IP Subnet prefix to be used for DHCP over NAT support. Only use this parameter if the DHCP can’t assign a valid IP address to access the Internet. |
| PublicVLan | Optional | Sets the VLAN ID. Only use this parameter if the host and NATVM must configure VLAN ID to access the physical network (and Internet). For example, `.\InstallAzureStackPOC.ps1 –Verbose –PublicVLan 305` |
| Rerun | Optional | Use this flag to re-run deployment.  All previous input will be used. Re-entering data previously provided is not supported because several unique values are generated and used for deployment. |
| TimeServer | Optional | Use this parameter if you need to specify a specific time server. |

## Next steps

[Connect to Azure Stack](azure-stack-connect-azure-stack.md)
