---
title: Automatically scale Windows Virtual Desktop Preview session hosts - Azure
description: Describes how to set up the automatic scaling script for Windows Virtual Desktop Preview session hosts.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 03/21/2019
ms.author: helohr
---
# Automatically scale session hosts

For many Windows Virtual Desktop Preview deployments in Azure, the virtual machine costs represent significant portion of the total Windows Virtual Desktop deployment cost. To reduce costs, it's best to shut down and deallocate session host virtual machines (VMs) during off-peak usage hours, then restart them during peak usage hours.

This article uses a simple scaling script to automatically scale session host virtual machines in your Windows Virtual Desktop environment. To learn more about how the scaling script works, see the [How the scaling script works](#how-the-scaling-script-works) section.

## Prerequisites

The environment where you run the script must have the following things:

- A Windows Virtual Desktop tenant and account or a service principal with permissions to query that tenant (such as RDS Contributor).
- Session host pool VMs configured and registered with the Windows Virtual Desktop service.
- An additional virtual machine that runs the scheduled task via Task Scheduler and has network access to session hosts. This will be referred to later in the document as scaler VM.
- The [Microsoft Azure Resource Manager PowerShell module](https://docs.microsoft.com/powershell/azure/azurerm/install-azurerm-ps) installed on the VM running the scheduled task.
- The [Windows Virtual Desktop PowerShell module](https://docs.microsoft.com/powershell/windows-virtual-desktop/overview) installed on the VM running the scheduled task.

## Recommendations and limitations

When running the scaling script, keep the following things in mind:

- This scaling script can only handle one host pool per instance of the scheduled task that is running the scaling script.
- The scheduled tasks that run scaling scripts must be on a VM that is always on.
- Create a separate folder for each instance of the scaling script and its configuration.
- This script doesn't support signing in as an admin to Windows Virtual Desktop with Azure AD user accounts that require multi-factor authentication. We recommend you use service principals to access the Windows Virtual Desktop service and Azure. Follow [this tutorial](create-service-principal-role-powershell.md) to create a service principal and a role assignment with PowerShell.
- Azure's SLA guarantee applies only to VMs in an availability set. The current version of the document describes an environment with a single VM doing the scaling, which may not meet availability requirements.

## Deploy the scaling script

The following procedures will tell you how to deploy the scaling script.

### Prepare your environment for the scaling script

First, prepare your environment for the scaling script:

1. Sign in to the VM (scaler VM) that will run the scheduled task with a domain administrative account.
2. Create a folder on the scaler VM to hold the scaling script and its configuration (for example, **C:\\scaling-HostPool1**).
3. Download the **basicScale.ps1**, **Config.xml**, and **Functions-PSStoredCredentials.ps1** files, and the **PowershellModules** folder from the [scaling script repository](https://github.com/Azure/RDS-Templates/tree/master/wvd-sh/WVD%20scaling%20script) and copy them to the folder you created in step 2. There are two primary ways to obtain the files before copying them to the scaler VM:
    - Clone the git repository to your local machine.
    - View the **Raw** version of each file, copy and paste the content of each file to a text editor, then save the files with the corresponding file name and file type. 

### Create securely stored credentials

Next, you'll need to create the securely stored credentials:

1. Open PowerShell ISE as an administrator.
2. Import the RDS PowerShell module by running the following cmdlet:

    ```powershell
    Install-Module Microsoft.RdInfra.RdPowershell
    ```
    
3. Open the edit pane and load the **Function-PSStoredCredentials.ps1** file.
4. Run the following cmdlet:
    
    ```powershell
    Set-Variable -Name KeyPath -Scope Global -Value <LocalScalingScriptFolder>
    ```
    
    For example, **Set-Variable -Name KeyPath -Scope Global -Value "c:\\scaling-HostPool1"**
5. Run the **New-StoredCredential -KeyPath \$KeyPath** cmdlet. When prompted, enter your Windows Virtual Desktop credentials with permissions to query the host pool (the host pool is specified in the **config.xml**).
    - If you use different service principals or standard account, run the **New-StoredCredential -KeyPath \$KeyPath** cmdlet once for each account to create local stored credentials.
6. Run **Get-StoredCredential -List** to confirm the credentials were created successfully.

### Configure the config.xml file

Enter the relevant values into the following fields to update the scaling script settings in config.xml:

| Field                     | Description                    |
|-------------------------------|------------------------------------|
| AADTenantId                   | Azure AD Tenant ID that associates the subscription where the session host VMs run     |
| AADApplicationId              | Service principal application ID                                                       |
| AADServicePrincipalSecret     | This can be entered during the testing phase but is to be kept empty once you create credentials with **Functions-PSStoredCredentials.ps1**    |
| currentAzureSubscriptionId    | The ID of the Azure subscription where the session host VMs run                        |
| tenantName                    | Windows Virtual Desktop tenant name                                                    |
| hostPoolName                  | Windows Virtual Desktop host pool name                                                 |
| RDBroker                      | URL to the WVD service, default value https:\//rdbroker.wvd.microsoft.com             |
| Username                      | The service principal application ID (it’s possible to have the same service principal as in AADApplicationId) or standard user without multi-factor authentication |
| isServicePrincipal            | Accepted values are **true** or **false**. Indicates whether the second set of credentials being used is a service principal or a standard account. |
| BeginPeakTime                 | When peak usage time begins                                                            |
| EndPeakTime                   | When peak usage time ends                                                              |
| TimeDifferenceInHours         | Time difference between local time and UTC, in hours                                   |
| SessionThresholdPerCPU        | Maximum number of sessions per CPU threshold used to determine when a new session host VM needs to be started during peak hours.  |
| MinimumNumberOfRDSH           | Minimum number of host pool VMs to keep running during off-peak usage time             |
| LimitSecondsToForceLogOffUser | Number of seconds to wait before forcing users to sign out. If set to 0, users aren’t forced to sign out.  |
| LogOffMessageTitle            | Title of the message sent to a user before they’re forced to sign out                  |
| LogOffMessageBody             | Body of the warning message sent to users before they’re signed out. For example, "This machine will shut down in X minutes. Please save your work and sign out.” |

### Configure the Task Scheduler

After configuring the configuration .xml file, you'll need to configure the Task Scheduler to run the basicScaler.ps1 file at a regular interval.

1. Start **Task Scheduler**.
2. In the **Task Scheduler** window, select **Create Task…**
3. In **the Create Task** dialog, select the **General** tab, enter a **Name** (for example, “Dynamic RDSH”), select **Run whether user is logged on or not** and **Run with highest privileges**.
4. Go to the **Triggers** tab, then select **New…**
5. In the **New Trigger** dialog, under **Advanced settings**, check **Repeat task every** and select the appropriate period and duration (for example, **15 minutes** or **Indefinitely**).
6. Select the **Actions** tab and **New…**
7. In the **New Action** dialog, enter **powershell.exe** into the **Program/script** field, then enter **C:\\scaling\\RDSScaler.ps1** into the **Add arguments (optional)** field.
8. Go to the **Conditions** and **Settings** tabs and select **OK** to accept the default settings for each.
9. Enter the password for the administrative account where you plan to run the scaling script.

## How the scaling script works

This scaling script reads settings from a config.xml file, including the start and end of the peak usage period during the day.

During peak usage time, the script checks the current number of sessions and the current running RDSH capacity for each host pool. It calculates if the running session host VMs have enough capacity to support existing sessions based on the SessionThresholdPerCPU parameter defined in the config.xml file. If not, the script starts additional session host VMs in the host pool.

During the off-peak usage time, the script determines which session host VMs should shut down based on the MinimumNumberOfRDSH parameter in the config.xml file. The script will set the session host VMs to drain mode to prevent new sessions connecting to the hosts. If you set the **LimitSecondsToForceLogOffUser** parameter in the config.xml file to a non-zero positive value, the script will notify any currently signed in users to save work, wait the configured amount of time, and then force the users to sign out. Once all user sessions have been signed off on a session host VM, the script will shut down the server.

If you set the **LimitSecondsToForceLogOffUser** parameter in the config.xml file to zero, the script will allow the session configuration setting in the host pool properties to handle signing off user sessions. If there are any sessions on a session host VM, it will leave the session host VM running. If there aren't any sessions, the script will shut down the session host VM.

The script is designed to run periodically on the scaler VM server using Task Scheduler. Select the appropriate time interval based on the size of your Remote Desktop Services environment, and remember that starting and shutting down virtual machines can take some time. We recommend running the scaling script every 15 minutes.

## Log files

The scaling script creates two log files, **WVDTenantScale.log** and **WVDTenantUsage.log**. The **WVDTenantScale.log** file will log the events and errors (if any) during each execution of the scaling script.

The **WVDTenantUsage.log** file will record the active number of cores and active number of virtual machines each time you execute the scaling script. You can use this information to estimate the actual usage of Microsoft Azure VMs and the cost. The file is formatted as comma-separated values, with each item containing the following information:

>time, host pool, cores, VMs

The file name can also be modified to have a .csv extension, loaded into Microsoft Excel, and analyzed.
