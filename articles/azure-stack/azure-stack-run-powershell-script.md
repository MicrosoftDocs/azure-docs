<properties 
	pageTitle="Prepare the physical machine" 
	description="Prepare the physical machine" 
	services="" 
	documentationCenter="" 
	authors="v-anpasi" 
	manager="v-kiwhit" 
	editor=""/>

<tags 
	ms.service="multiple" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="1/04/2016" 
	ms.author="v-anpasi"/>

# Prepare the physical machine

1.  On the Azure Stack POC machine, install Windows Server 2016 Datacenter Edition Technical Preview 4 EN-US (Full Edition).

2.  Run the Microsoft Azure Stack POC.exe.

    This creates the \\Microsoft Azure Stack POC\\ folder containing the following items:

	-   DeployAzureStack.ps1: Azure Stack POC installation PowerShell script
	
	-   MicrosoftAzureStackPOC.vhdx: Azure Stack data package
	
	-   SQLServer2014.vhdx: SQL Server VHD
	
	-   WindowsServer2012R2DatacenterEval.vhd
	
	-   WindowsServer2016Datacenter.vhdx: Windows Server 2016 Data Center VHD

## Run the PowerShell script

1.  Open PowerShell as an administrator.

2.  In PowerShell, go to the Azure Stack folder location (\\Microsoft Azure Stack POC\\ if you used the default).

3.  Run the deploy command:

    	.\DeployAzureStack.ps1 –verbose

    In China, use the following command instead:

    	.\DeployAzureStack.ps1 –verbose -UseAADChina $true

    The deploy process begins and various prerequisite checks are conducted. The Azure Stack POC domain name is hardcoded as azurestack.local.

4.  At the **Enter the password for the built-in administrator** prompt, enter a password and then confirm it. This is the password to all the virtual machines. Be sure to record this Service Admin password.

5.  At the **Please login to your Azure account in the pop-up Azure authentication page**, hit any key to open the Microsoft Azure sign-in dialog box.

6.  Enter the credentials for your Azure Active Directory Account. This user must be the Global Admin in the directory tenant

7.  Back in PowerShell, at the account selection confirmation prompt, enter *y*. This creates two users and three applications for Azure stack in that directory tenant: an admin user for Azure Stack, a tenant user for the TiP tests, and one application each for the Portal, API, and Monitoring resource providers. In addition to this, the installer adds consents for the Azure PowerShell, XPlat CLI, and Visual Studio to that Directory Tenant.

8.  At the **Microsoft Azure Stack POC is ready to deploy. Continue?** prompt, enter *y*.

9.  The deployment process will take a few hours, during which several automated system reboots will occur. Signing in during deployment will automatically launch a PowerShell window that will display deployment progress. The PowerShell window closes after deployment completes.

10. On the host, run the following command from an elevated Command Prompt window:

    	bcdedit /set testsigning on

11. In the `\Microsoft Azure Stack POC\Updates\` folder, run the `Windows10.0-KB625402-x64-InstallForTestingPurposesOnly.exe` file.

12. Accept the license.

13. At the **Do you want to restart your computer now?** prompt, type *y*.

14. After the computer reboots, confirm that the patch was installed on the host by following these steps:

    1.  Open a Command Prompt window and type appwiz.cpl.

    2.  In the **Installed Updates** window, click **View installed updates**.

    3.  Confirm that **Hotfix for Microsoft Windows (KB625402) (FOR TESTING PURPOSES ONLY)** is in the list.

**Note**: If the script fails, restart the script. If it continues to fail, wipe and restart.

You can find the script logs on the POC host `C:\ProgramData\microsoft\azurestack`.

## Turn off telemetry for Microsoft Azure Stack POC (optional)

### How to turn off telemetry for Microsoft Azure Stack before the deployment

Before deploying Microsoft Azure Stack POC, you can turn off telemetry for Microsoft Azure Stack on the machine from which the deployment is performed. To turn off this feature on a single machine, please refer to: <http://windows.microsoft.com/windows-10/feedback-diagnostics-privacy-faq>, and change the **Diagnostic and usage data** setting to **Basic**.

### How to turn off telemetry after the Microsoft Azure Stack deployment

After deploying Microsoft Azure Stack POC, you can turn off telemetry on all the virtual machines that joined the Azure Stack domain. To create a group policy and manage your telemetry settings on those virtual machines, please refer to: [https://technet.microsoft.com/library/mt577208(v=vs.85).aspx\#BKMK\_UTC](https://technet.microsoft.com/library/mt577208%28v=vs.85%29.aspx#BKMK_UTC), and select **0** or **1** for the **Allow Telemetry** group policy. There are two virtual machines (bgpvm and natvm) not joining the Azure Stack domain. To change the Feedback and Diagnostics settings on these virtual machines separately, please refer to:  <http://windows.microsoft.com/windows-10/feedback-diagnostics-privacy-faq>.
