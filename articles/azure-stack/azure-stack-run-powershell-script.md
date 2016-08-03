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
	ms.date="06/29/2016"
	ms.author="erikje"/>

# Deploy Azure Stack POC
To deploy the Azure Stack POC, you first need to [prepare the deployment machine](#prepare-the-deployment-machine) and then [run the PowerShell deployment script](#run-the-powershell-deployment-script).

## Prepare the deployment machine

1. Make sure the deployment machine meets the [minimum requirements](azure-stack-deploy.md). You can use the [Deployment Checker for Azure Stack Technical Preview 1](https://gallery.technet.microsoft.com/Deployment-Checker-for-76d824e1) to confirm your requirements.

2.  [Download](http://aka.ms/ReqOSforAzureStack) and install Windows Server 2016 Datacenter Edition Technical Preview 4 EN-US (Full Edition).

3.  [Download](https://azure.microsoft.com/overview/azure-stack/try/?v=try) the Azure Stack POC deployment package to a folder on your C drive, (for example, c:\\AzureStack).

4.  Run the **Microsoft Azure Stack POC.exe** file.

    This creates the \\Microsoft Azure Stack POC\\ folder containing the following items:

	-   DeployAzureStack.ps1: Azure Stack POC installation PowerShell script

	-   MicrosoftAzureStackPOC.vhdx: Azure Stack data package

	-   SQLServer2014.vhdx: SQL Server VHD

	-   WindowsServer2012R2DatacenterEval.vhd

	-   WindowsServer2016Datacenter.vhdx: Windows Server 2016 Datacenter VHD (includes KB 3124262)

	> [AZURE.IMPORTANT] You must have at least 128GB of free space on the physical boot volume.

5. Copy WindowsServer2016Datacenter.vhdx to the C:\ drive and rename it MicrosoftAzureStackPOCBoot.vhdx.

6. In File Explorer, right-click MicrosoftAzureStackPOCBoot.vhdx and click **Mount**.

7. Open a Command Prompt window as an administrator and run the bcdboot command below. This command creates a dual boot environment. From this point, you should boot into the upper boot option.

    	bcdboot <mounted drive letter>:\windows

8. Reboot the machine. It will automatically run Windows Setup as the VHD system is prepared. When asked, provide your country, language, keyboard, and other preferences. If you're asked for the product key, you can find it [System Requirements and Installation](https://technet.microsoft.com/library/mt126134.aspx).

9. If your BIOS includes such an option, you should configure it to use the local time instead of UTC time.

10. Log in using a local account with administrator permissions.

11. Verify that **exactly** four drives for Azure Stack POC data:
  - Are visible in disk management
  - Are not in use
  - Show as Online, RAW

12. Verify that the host is not joined to a domain.

13. Using Internet Explorer, verify network connectivity to Azure.com.

> [AZURE.IMPORTANT] The TP1 POC deployment supports exactly four drives for the storage features and only one NIC for networking.
>
> - **For storage**, use device manager or WMI to disable all other drives (taking the disks offline through disk manager is not enough).
>
> - **For network**, if you have multiple NICs, make sure that only one is enabled (and all others are disabled) before running the deployment script below.
>
> If you used the VHD boot steps defined above, you’ll need to make these updates after booting into the VHD and before starting the deployment script.

## Run the PowerShell deployment script

1.  Open PowerShell as an administrator.

2.  In PowerShell, go to the Azure Stack folder location (\\Microsoft Azure Stack POC\\ if you used the default).

3.  Run the deploy command:

    	.\DeployAzureStack.ps1 –Verbose

    In China, use the following command instead:

    	.\DeployAzureStack.ps1 –Verbose -UseAADChina $true

    Deployment starts and the Azure Stack POC domain name is hardcoded as azurestack.local.

4.  At the **Enter the password for the built-in administrator** prompt, enter a password and then confirm it. This is the password to all the virtual machines. Be sure to record this Service Admin password.

5.  At the **Please login to your Azure account in the pop-up Azure authentication page**, hit any key to open the Microsoft Azure sign-in dialog box.

6.  Enter the credentials for your Azure Active Directory account. This user must be the Global Admin in the directory tenant

7.  Back in PowerShell, at the account selection confirmation prompt, enter *y*. This creates two users and three applications for Azure Stack in that directory tenant: an admin user for Azure Stack, a tenant user for the TiP tests, and one application each for the Portal, API, and Monitoring resource providers. In addition to this, the installer adds consents for the Azure PowerShell, XPlat CLI, and Visual Studio to that Directory Tenant.

8.  At the **Microsoft Azure Stack POC is ready to deploy. Continue?** prompt, enter *y*.

9.  The deployment process will take a few hours, during which several automated system reboots will occur. Signing in during deployment will automatically launch a PowerShell window that will display deployment progress. The PowerShell window closes after deployment completes.

10. On the Azure Stack POC machine, sign in as an AzureStack\administrator, open **Server Manager**, and turn off **IE Enhanced Security Configuration** for both admins and users.

If the deployment fails with a time or date error, configure the BIOS to use Local Time instead of UTC. Then redeploy.

If the script fails, restart the script. If it continues to fail, wipe and restart.

You can find the script logs on the POC host `C:\ProgramData\microsoft\azurestack`.

### DeployAzureStack.ps1 optional parameters

**AADCredential** (PSCredential) - Sets the Azure Active Directory user name and password. If this parameter is not provided, the script prompts for the user name and password.

**AADTenant** (string) - Sets the tenant directory. Use this parameter to specify a specific directory when the AAD account has permissions to manage multiple directories. If this parameter is not provided, the script prompts for the directory.

**AdminPassword** (SecureString) - Sets the default admin password. If this parameter is not provided, the script prompts for the password.

**Force** (Switch) - Sets the cmdlet to run without confirmations.

**NATVMStaticGateway** (String) - Sets the default gateway used in the static IP address for the NATVM. Only use this parameter if the DHCP can’t assign a valid IP address to access the Internet. If this parameter is used, then you must also use the NATVMStaticIP parameter.
For example, `.\DeployAzureStack.ps1 –Verbose -NATVMStaticIP 10.10.10.10/24 – NATVMStaticGateway 10.10.10.1`

**NATVMStaticIP** (string) - Sets an additional static IP address for the NATVM. Only use this parameter if the DHCP can’t assign a valid IP address to access the Internet.
For example, `.\DeployAzureStack.ps1 –Verbose -NATVMStaticIP 10.10.10.10/24`

**NoAutoReboot** (Switch) - Sets the script to run without automatic reboots.

**ProxyServer** (String) - Sets the proxy information. Only use this parameter if your environment must use a proxy to access the Internet. Proxy servers that require credentials are not supported.
For example, `.\DeployAzureStack.ps1 -Verbose -ProxyServer 172.11.1.1:8080`

**PublicVLan** (String) - Sets the VLAN ID. Only use this parameter if the host and NATVM must configure VLAN ID to access the physical network (and Internet).
For example, `.\DeployAzureStack.ps1 –Verbose –PublicVLan 305`

**TIPServiceAdminCredential** (PSCredential) - Sets the credentials of an existing service administrator Azure Active Directory account. This account is used by TiP (Test in Production). If this parameter is not provided, an account is automatically created.

**TIPTenantAdminCredential** (PSCredential) - Sets the credentials of an existing tenant administrator Azure Active Directory account. This account is used by TiP (Test in Production). If this parameter is not provided, an account is automatically created.

**UseAADChina**(Boolean) - Set this Boolean parameter to $true if you want to deploy the Microsoft Azure Stack POC with Azure China (Mooncake).

## Turn off automated TiP tests (optional)

Microsoft Azure Stack Technical Preview 1 includes a set of validation tests used during the deployment process and on a recurring daily schedule. They simulate actions taken by an Azure Stack tenant, and Test-in-POC (TiP) user accounts are created in your Azure Active Directory in order to run the tests. After a successful deployment, you can turn off these TiP tests. 

**To turn off TiP automated tests**

  - On the ClientVM, run the following cmdlet:

  `Disable-ScheduledTask -TaskName AzureStackSystemvalidationTask`

**To view the test results**

  - On the ClientVM, run the following cmdlet:

  `Get-AzureStackTiPTestsResult`



## Turn off telemetry for Microsoft Azure Stack POC (optional)


Before deploying Microsoft Azure Stack POC, you can turn off telemetry for Microsoft Azure Stack on the machine from which the deployment is performed. To turn off this feature on a single machine, please refer to: [http://windows.microsoft.com/en-us/windows-10/feedback-diagnostics-privacy-faq](http://windows.microsoft.com/en-us/windows-10/feedback-diagnostics-privacy-faq), and change the **Diagnostic and usage data** setting to **Basic**.



After deploying Microsoft Azure Stack POC, you can turn off telemetry on all the virtual machines that joined the Azure Stack domain. To create a group policy and manage your telemetry settings on those virtual machines, please refer to: [https://technet.microsoft.com/library/mt577208(v=vs.85).aspx\#BKMK\_UTC](https://technet.microsoft.com/library/mt577208%28v=vs.85%29.aspx#BKMK_UTC), and select **0** or **1** for the **Allow Telemetry** group policy. There are two virtual machines (bgpvm and natvm) not joining the Azure Stack domain. To change the Feedback and Diagnostics settings on these virtual machines separately, please refer to:  [http://windows.microsoft.com/en-us/windows-10/feedback-diagnostics-privacy-faq](http://windows.microsoft.com/en-us/windows-10/feedback-diagnostics-privacy-faq).

## Next steps

[Connect to Azure Stack](azure-stack-connect-azure-stack.md)
