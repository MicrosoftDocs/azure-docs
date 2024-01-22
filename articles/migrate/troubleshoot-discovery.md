---
title: Troubleshoot ongoing server discovery, software inventory, and SQL discovery
description: Get help with server discovery, software inventory, and SQL and web apps discovery.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: troubleshooting
ms.service: azure-migrate
ms.date: 04/20/2023
ms.custom: engagement-fy23
---

# Troubleshoot ongoing server discovery, software inventory, and SQL and web apps discovery

This article helps you troubleshoot issues with ongoing server discovery, software inventory, and discovery of SQL Server instances and databases.

## Discovered servers not showing in the portal

You get this error when you don't yet see the servers in the portal, and the discovery state is **Discovery in progress**.

### Remediation

If the servers don't appear in the portal, wait for a few minutes because it takes around 15 minutes for discovery of servers running on a vCenter server. It takes 2 minutes for each Hyper-V host added on the appliance for discovery of servers running on the host and 1 minute for discovery of each server added on the physical appliance.

If the state still doesn't change:

- Select **Refresh** on the **Servers** tab to see the count of the discovered servers in Azure Migrate: Discovery and assessment and Migration and modernization.

If the preceding step doesn't work and you're discovering VMware servers:

1. Verify that the vCenter account you specified has the permissions set correctly with access to at least one server.
1. Check on VMware if the vCenter account has access granted at the vCenter VM folder level. Azure Migrate can't discover servers on VMware. [Learn more](set-discovery-scope.md) about scoping discovery.

## Server data not updating in the portal

You get this error if the discovered servers don't appear in the portal or if the server data is outdated.

### Remediation

Wait for a few minutes because it takes up to 30 minutes for changes in discovered server configuration data to appear in the portal and a few hours for changes in software inventory data to appear. If there's no data after this time, refresh and follow these steps:

1. In **Windows, Linux, and SQL Servers** > **Azure Migrate: Discovery and assessment**, select **Overview**.
1. Under **Manage**, select **Appliances**.
1. Select **Refresh services**.
Wait for the refresh operation to finish. You should now see up-to-date information.

## Deleted servers appear in the portal

You get this error when the deleted servers continue to appear in the portal.

### Remediation

If the data continues to appear, wait for 30 minutes and follow these steps:

1. In **Windows, Linux, and SQL Servers** > **Azure Migrate: Discovery and assessment**, select **Overview**.
1. Under **Manage**, select **Appliances**.
1. Select **Refresh services**.
Wait for the refresh operation to finish. You should now see up-to-date information.

## You imported a CSV but see "Discovery is in progress"

This status appears if your CSV upload failed because of a validation failure.

### Remediation

Import the CSV again. Download the previous upload error report, and follow the file's remediation guidance to fix the errors. Download the error report from the **Import Details** section on the **Discover servers** page.

## You don't see software inventory details after you update guest credentials

You get this error when inventory details don't appear even after you update guest credentials.

### Remediation

The software inventory discovery runs once every 24 hours. This process might take a few minutes depending on the number of servers discovered. If you want to see the details immediately, refresh as follows:

1. In **Windows, Linux, and SQL Servers** > **Azure Migrate: Discovery and assessment**, select **Overview**.
1. Under **Manage**, select **Appliances**.
1. Select **Refresh services**.
Wait for the refresh operation to finish. You should now see up-to-date information.

## Unable to export software inventory data

You get this error when you don't have Contributor privileges.

### Remediation

Ensure the user downloading the inventory from the portal has Contributor privileges on the subscription.

## Export the software inventory errors

You can export all the errors and remediations for software inventory from portal by selecting **Export notifications**. The exported CSV file also contains additional information like the timestamp at which the error was encountered.

:::image type="content" source="./media/troubleshoot-discovery/export-notifications.png" alt-text="Screenshot of Export notifications screen.":::

## Common software inventory errors

Azure Migrate supports software inventory by using Azure Migrate: Discovery and assessment. [Learn more](how-to-discover-applications.md) about how software inventory is performed.

For VMware VMs, software inventory is performed by connecting to the servers via the vCenter Server using the VMware APIs. For Hyper-V VMs and physical servers, software inventory is performed by directly connecting to Windows servers using PowerShell remoting on port 5985 (HTTP) and to Linux servers using SSH connectivity on port 22 (TCP).

The table below summarizes all errors encountered when gathering software inventory data through VMware APIs or by directly connecting to servers:

> [!Note]
> The same errors can also be encountered with agentless dependency analysis because it follows the same methodology as software inventory to collect the required data.

| **Error** | **Cause** | **Action** |
|--|--|--|
| **60001**:UnableToConnectToPhysicalServer | Either the [prerequisites](./migrate-support-matrix-physical.md) to connect to the server have not been met or there are network issues in connecting to the server, for instance some proxy settings.| - Ensure that the server meets the prerequisites and [port access requirements](./migrate-support-matrix-physical.md). <br/> - Add the IP addresses of the remote machines (discovered servers) to the WinRM TrustedHosts list on the Azure Migrate appliance, and retry the operation. This is to allow remote inbound connections on servers - _Windows:_ WinRM port 5985 (HTTP) and _Linux:_ SSH port 22 (TCP). <br/>- Ensure that you have chosen the correct authentication method on the appliance to connect to the server. <br/> - If the issue persists, submit a Microsoft support case, providing the appliance machine ID (available in the footer of the appliance configuration manager).|
| **60002**:InvalidServerCredentials| Unable to connect to server. Either you have provided incorrect credentials on the appliance or the credentials previously provided have expired.| - Ensure that you have provided the correct credentials for the server on the appliance. You can check that by trying to connect to the server using those credentials.<br/> - If the credentials added are incorrect or have expired, edit the credentials on the appliance and revalidate the added servers. If the validation succeeds, the issue is resolved.<br/> - If the issue persists, submit a Microsoft support case, providing the appliance machine ID (available in the footer of the appliance configuration manager).|
| **60005**:SSHOperationTimeout | The operation took longer than expected either due to network latency issues or due to the lack of latest updates on the server.| - Ensure that the impacted server has the latest kernel and OS updates installed.<br/>- Ensure that there is no network latency between the appliance and the server. It is recommended to have the appliance and source server on the same domain to avoid latency issues.<br/> - Connect to the impacted server from the appliance and run the commands [documented here](./troubleshoot-appliance.md) to check if they return null or empty data.<br/>- If the issue persists, submit a Microsoft support case providing the appliance machine ID (available in the footer of the appliance configuration manager). |
| **9000**: VMware tools status on the server can't be detected. | VMware tools might not be installed on the server, or the installed version is corrupted. | Ensure that VMware tools later than version 10.2.1 are installed and running on the server. |
| **9001**: VMware tools aren't installed on the server. | VMware tools might not be installed on the server, or the installed version is corrupted. | Ensure that VMware tools later than version 10.2.1 are installed and running on the server. |
| **9002**: VMware tools aren't running on the server. | VMware tools might not be installed on the server, or the installed version is corrupted. | Ensure that VMware tools later than version 10.2.0 are installed and running on the server. |
| **9003**: Operating system type running on the server isn't supported. | The operating system running on the server isn't Windows or Linux. | Only Windows and Linux OS types are supported. If the server is running Windows or Linux OS, check the operating system type specified in vCenter Server. |
| **9004**: Server isn't in a running state. | The server is in a powered-off state. | Ensure that the server is in a running state. |
| **9005**: Operating system type running on the server isn't supported. | The operating system running on the server isn't Windows or Linux. | Only Windows and Linux OS types are supported. The \<FetchedParameter> operating system isn't supported currently. |
| **9006**: The URL needed to download the discovery metadata file from the server is empty. | This issue could be transient because the discovery agent on the appliance isn't working as expected. | The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **9007**: The process that runs the script to collect the metadata isn't found in the server. | This issue could be transient because the discovery agent on the appliance isn't working as expected. | The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **9008**: The status of the process running on the server to collect the metadata can't be retrieved. | This issue could be transient because of an internal error. | The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **9009**: Windows User Account Control (UAC) is preventing the execution of discovery operations on the server. | Windows UAC settings are restricting the discovery of installed applications from the server. | On the affected server, lower the level of the **User Account Control** settings in Control Panel. |
| **9010**: The server is powered off. | The server is in a powered-off state. | Ensure that the server is in a powered-on state. |
| **9011**: The file containing the discovered metadata can't be found on the server. | This issue could be transient because of an internal error. | The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **9012**: The file containing the discovered metadata on the server is empty. | This issue could be transient because of an internal error. | The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **9013**: A new temporary user profile is created on logging in to the server each time. | A new temporary user profile is created on logging in to the server each time. | Submit a Microsoft support case to help troubleshoot this issue. |
| **9014**: Unable to retrieve the file containing the discovered metadata because of an error encountered on the ESXi host. Error code: %ErrorCode; Details: %ErrorMessage | Encountered an error on the ESXi host \<HostName>. Error code: %ErrorCode; Details: %ErrorMessage | Ensure that port 443 is open on the ESXi host on which the server is running.<br/><br/> [Learn more](troubleshoot-discovery.md#error-9014-httpgetrequesttoretrievefilefailed) on how to remediate the issue.|
| **9015**: The vCenter Server user account provided for server discovery doesn't have guest operations privileges enabled. | The required privileges of guest operations haven't been enabled on the vCenter Server user account. | Ensure that the vCenter Server user account has privileges enabled for **Virtual Machines** > **Guest Operations**: to interact with the server and pull the required data. <br/><br/> [Learn more](tutorial-discover-vmware.md#prepare-vmware) on how to set up the vCenter Server account with required privileges. |
| **9016**: Unable to discover the metadata because the guest operations agent on the server is outdated. | Either the VMware tools aren't installed on the server or the installed version isn't up to date. | Ensure that the VMware tools are installed and running up to date on the server. The VMware Tools version must be version 10.2.1 or later. |
| **9017**: The file containing the discovered metadata can't be found on the server. | This issue could be transient because of an internal error. | Submit a Microsoft support case to help troubleshoot this issue. |
| **9018**: PowerShell isn't installed on the server. | PowerShell can't be found on the server. | Ensure that PowerShell version 2.0 or later is installed on the server. <br/><br/> [Learn more](troubleshoot-discovery.md#error-9018-powershellnotfound) on how to remediate the issue.|
| **9019**: Unable to discover the metadata because of guest operation failures on the server. | VMware guest operations failed on the server. The issue was encountered when you tried the following credentials on the server: ```<FriendlyNameOfCredentials>.``` | Ensure that the server credentials provided on the appliance are valid and the username provided in the credentials is in the user principal name (UPN) format. (Find the friendly name of the credentials tried by Azure Migrate in the possible causes.) |
| **9020**: Unable to create the file required to contain the discovered metadata on the server. | The role associated to the credentials provided on the appliance or a group policy on-premises is restricting the creation of a file in the required folder. The issue was encountered when you tried the following credentials on the server: ```<FriendlyNameOfCredentials>.``` | 1. Check if the credentials provided on the appliance have created file permission on the folder \<folder path/folder name> in the server. <br/>2. If the credentials provided on the appliance don't have the required permissions, either provide another set of credentials or edit an existing one. (Find the friendly name of the credentials tried by Azure Migrate in the possible causes.) |
| **9021**: Unable to create the file required to contain the discovered metadata at the right path on the server. | VMware tools are reporting an incorrect file path to create the file. | Ensure that VMware tools later than version 10.2.0 are installed and running on the server. |
| **9022**: The access is denied to run the Get-WmiObject cmdlet on the server. | The role associated to the credentials provided on the appliance or a group policy on-premises is restricting access to the WMI object. The issue was encountered when you tried the following credentials on the server: \<FriendlyNameOfCredentials>. | 1. Check if the credentials provided on the appliance have created file administrator privileges and have WMI enabled. <br/> 2. If the credentials on the appliance don't have the required permissions, either provide another set of credentials or edit an existing one. (Find the friendly name of the credentials tried by Azure Migrate in the possible causes.)<br/><br/> [Learn more](troubleshoot-discovery.md#error-9022-getwmiobjectaccessdenied) on how to remediate the issue.|
| **9023**: Unable to run PowerShell because the %SystemRoot% environment variable value is empty. | The value of the %SystemRoot% environment variable is empty for the server. | 1. Check if the environment variable is returning an empty value by running the echo %systemroot% command on the affected server. <br/> 2. If the issue persists, submit a Microsoft support case. |
| **9024**: Unable to perform discovery because the %TEMP% environment variable value is empty. | The value of the %TEMP% environment variable is empty for the server. | 1. Check if the environment variable is returning an empty value by running the echo %temp% command on the affected server. <br/> 2. If the issue persists, submit a Microsoft support case. |
| **9025**: Unable to perform discovery because PowerShell is corrupted on the server. | PowerShell is corrupted on the server. | Reinstall PowerShell and verify that it's running on the affected server. |
| **9026**: Unable to run guest operations on the server. | The current state of the server isn't allowing the guest operations to run. | 1. Ensure that the affected server is up and running.<br/> 2. If the issue persists, submit a Microsoft support case. |
| **9027**: Unable to discover the metadata because the guest operations agent isn't running on the server. | Unable to contact the guest operations agent on the server. | Ensure that VMware tools later than version 10.2.0 are installed and running on the server. |
| **9028**: Unable to create the file required to contain the discovered metadata because of insufficient storage on the server. | There's a lack of sufficient storage space on the server disk. | Ensure that enough space is available on the disk storage of the affected server. |
| **9029**: The credentials provided on the appliance don't have access permissions to run PowerShell. | The credentials provided on the appliance don't have access permissions to run PowerShell. The issue was encountered when you tried the following credentials on the server: \<FriendlyNameOfCredentials>. | 1. Ensure that the credentials on the appliance can access PowerShell on the server.<br/> 2. If the credentials on the appliance don't have the required access, either provide another set of credentials or edit an existing one. (Find the friendly name of the credentials tried by Azure Migrate in the possible causes.) |
| **9030**: Unable to gather the discovered metadata because the ESXi host where the server is hosted is in a disconnected state. | The ESXi host on which the server is residing is in a disconnected state. | Ensure that the ESXi host running the server is in a connected state. |
| **9031**: Unable to gather the discovered metadata because the ESXi host where the server is hosted isn't responding. | The ESXi host on which the server is residing is in an invalid state. | Ensure that the ESXi host running the server is in a running and connected state. |
| **9032**: Unable to discover because of an internal error. | The issue encountered is because of an internal error. | Follow the steps on [this website](troubleshoot-discovery.md#error-9032-invalidrequest) to remediate the issue. If the issue persists, open a Microsoft support case. |
| **9033**: Unable to discover because the username of the credentials provided on the appliance for the server has invalid characters. | The credentials provided on the appliance contain invalid characters in the username. The issue was encountered when you tried the following credentials on the server: \<FriendlyNameOfCredentials>. | Ensure that the credentials provided on the appliance don't have any invalid characters in the username. Go back to the appliance configuration manager to edit the credentials. (Find the friendly name of the credentials tried by Azure Migrate in the possible causes.) |
| **9034**: Unable to discover because the username of the credentials provided on the appliance for the server isn't in the UPN format. | The credentials on the appliance don't have the username in the UPN format. The issue was encountered when you tried the following credentials on the server: \<FriendlyNameOfCredentials>. | Ensure that the credentials on the appliance have their username in the UPN format. Go back to the appliance configuration manager to edit the credentials. (Find the friendly name of the credentials tried by Azure Migrate in the possible causes.) |
| **9035**: Unable to discover because the PowerShell language mode isn't set correctly. | PowerShell language mode isn't set to **Full language**. | Ensure that the PowerShell language mode is set to **Full language**. |
| **9036**: Unable to discover because the username of the credentials provided on the appliance for the server isn't in the UPN format. | The credentials on the appliance don't have the username in the UPN format. The issue was encountered when you tried the following credentials on the server: \<FriendlyNameOfCredentials>. | Ensure that the credentials on the appliance have their username in the UPN format. Go back to the appliance configuration manager to edit the credentials. (Find the friendly name of the credentials tried by Azure Migrate in the possible causes.) |
| **9037**: The metadata collection is temporarily paused because of a high response time from the server. | The server is taking too long to respond. | The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **10000**: The operation system type running on the server isn't supported. | The operating system running on the server isn't Windows or Linux. | Only Windows and Linux OS types are supported. The \<GuestOSName> operating system isn't supported currently. |
| **10001**: The script required to gather discovery metadata isn't found on the server. | The script required to perform discovery might have been deleted or removed from the expected location. | Submit a Microsoft support case to help troubleshoot this issue. |
| **10002**: The discovery operations timed out on the server. | This issue could be transient because the discovery agent on the appliance isn't working as expected. | The issue should automatically resolve in the next cycle within 24 hours. If it isn't resolved, follow the steps on [this website](troubleshoot-discovery.md#error-10002-scriptexecutiontimedoutonvm) to remediate the issue. If the issue persists, open a Microsoft support case.|
| **10003**: The process executing the discovery operations exited with an error. | The process executing the discovery operations exited abruptly because of an error.| The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **10004**: Credentials aren't provided on the appliance for the server OS type. | The credentials for the server OS type weren't added on the appliance. | 1. Ensure that you add the credentials for the OS type of the affected server on the appliance.<br/> 2. You can now add multiple server credentials on the appliance. |
| **10005**: Credentials provided on the appliance for the server are invalid. | The credentials provided on the appliance aren't valid. The issue was encountered when you tried the following credentials on the server: ```\<FriendlyNameOfCredentials>.``` | 1. Ensure that the credentials provided on the appliance are valid and the server is accessible by using the credentials.<br/> 2. You can now add multiple server credentials on the appliance.<br/> 3. Go back to the appliance configuration manager to either provide another set of credentials or edit an existing one. (Find the friendly name of the credentials tried by Azure Migrate in the possible causes.) <br/><br/> [Learn more](troubleshoot-discovery.md#error-10005-guestcredentialnotvalid) on how to remediate the issue.|
| **10006**: The operation system type running on the server isn't supported. | The operating system running on the server isn't Windows or Linux. | Only Windows and Linux OS types are supported. The \<GuestOSName> operating system isn't supported currently. |
| **10007**: Unable to process the discovered metadata from the server. | An error occurred when parsing the contents of the file containing the discovered metadata. | Submit a Microsoft support case to help troubleshoot this issue. |
| **10008**: Unable to create the file required to contain the discovered metadata on the server. | The role associated to the credentials provided on the appliance or a group policy on-premises is restricting the creation of a file in the required folder. The issue was encountered when you tried the following credentials on the server: ```<FriendlyNameOfCredentials>.``` | 1. Check if the credentials provided on the appliance have created file permissions on the folder \<folder path/folder name> in the server.<br/> 2. If the credentials provided on the appliance don't have the required permissions, either provide another set of credentials or edit an existing one. (Find the friendly name of the credentials tried by Azure Migrate in the possible causes.) |
| **10009**: Unable to write the discovered metadata in the file on the server. | The role associated to the credentials provided on the appliance or a group policy on-premises is restricting writing in the file on the server. The issue was encountered when you tried the following credentials on the server: \<FriendlyNameOfCredentials>. | 1. Check if the credentials provided on the appliance have write file permissions on the folder <folder path/folder name> in the server.<br/> 2. If the credentials provided on the appliance don't have the required permissions, either provide another set of credentials or edit an existing one. (Find the friendly name of the credentials tried by Azure Migrate in the possible causes.) |
| **10010**: Unable to discover because the command- %CommandName; required to collect some metadata is missing on the server. | The package containing the command %CommandName; isn't installed on the server. | Ensure that the package containing the command %CommandName; is installed on the server. |
| **10011**: The credentials provided on the appliance were used to log in and log off for an interactive session. | The interactive login and log-off forces the registry keys to be unloaded in the profile of the account being used. This condition makes the keys unavailable for future use. | Use the resolution methods documented on [this website](/sharepoint/troubleshoot/administration/800703fa-illegal-operation-error#resolutionus/sharepoint/troubleshoot/administration/800703fa-illegal-operation-error). |
| **10012**: Credentials haven't been provided on the appliance for the server. | Either no credentials were provided for the server or you provided domain credentials with an incorrect domain name on the appliance. [Learn more](troubleshoot-discovery.md#error-10012-credentialnotprovided) about the cause of this error. | 1. Ensure that the credentials are provided on the appliance for the server and the server is accessible by using the credentials. <br/> 2. You can now add multiple credentials on the appliance for servers. Go back to the appliance configuration manager to provide credentials for the server.|

## Error 9014: HTTPGetRequestToRetrieveFileFailed

### Cause
The issue happens when the VMware discovery agent in the appliance tries to download the output file containing dependency data from the server file system through the ESXi host on which the server is hosted.

### Remediation
- You can test TCP connectivity to the ESXi host _(name provided in the error message)_ on port 443 (required to be open on ESXi hosts to pull dependency data) from the appliance by opening PowerShell on the appliance server and running the following command:

   ````
   Test -NetConnection -ComputeName <Ip address of the ESXi host> -Port 443
   ````

- If the command returns successful connectivity, go to the **Azure Migrate project** > **Discovery and assessment** > **Overview** > **Manage** > **Appliances**, select the appliance name, and select **Refresh services**.

## Error 9018: PowerShellNotFound

### Cause
The error usually appears for servers running Windows Server 2008 or lower.

### Remediation
Install Windows PowerShell 5.1 at this location on the server. Following the instructios in [Install and Configure WMF 5.1](/previous-versions/powershell/scripting/windows-powershell/install/installing-windows-powershell) about how to install PowerShell in Windows Server.

After you install the required PowerShell version, verify if the error was resolved by following the steps on [this website](troubleshoot-discovery.md#mitigation-verification).

## Error 9022: GetWMIObjectAccessDenied

### Remediation
Make sure that the user account provided in the appliance has access to WMI namespace and subnamespaces. To set the access:

1.    Go to the server that's reporting this error.
1. Search and select **Run** from the **Start** menu. In the **Run** dialog, enter **wmimgmt.msc** in the **Open** text box and select **Enter**.
1. The wmimgmt console opens where you can find **WMI Control (Local)** in the left pane. Right-click it, and select **Properties** from the menu.
1. In the **WMI Control (Local) Properties** dialog, select the **Securities** tab.
1. Select **Security** to open the **Security for ROOT** dialog.
1. Select **Advanced** to open the **Advanced Security Settings for Root** dialog.
1. Select **Add** to open the **Permission Entry for Root** dialog.
1. Click **Select a principal** to open the **Select Users, Computers, Service Accounts or Groups** dialog.
1. Select the usernames or groups you want to grant access to the WMI, and select **OK**.
1. Ensure you grant execute permissions, and select **This namespace and subnamespaces** in the **Applies to** dropdown list.
1. Select **Apply** to save the settings and close all dialogs.

After you get the required access, verify if the error was resolved by following the steps on [this website](troubleshoot-discovery.md#mitigation-verification).

## Error 9032: InvalidRequest

### Cause
There can be multiple reasons for this issue. One reason is when the username provided (server credentials) on the appliance configuration manager has invalid XML characters. Invalid characters cause an error in parsing the SOAP request.

### Remediation
- Make sure the username of the server credentials doesn't have invalid XML characters and is in the username@domain.com format. This format is popularly known as the UPN format.
- After you edit the credentials on the appliance, verify if the error was resolved by following the steps on [this website](troubleshoot-discovery.md#mitigation-verification).


## Error 10002: ScriptExecutionTimedOutOnVm

### Cause
- This error occurs when the server is slow or unresponsive and the script executed to pull the dependency data starts timing out.
- After the discovery agent encounters this error on the server, the appliance doesn't attempt agentless dependency analysis on the server thereafter to avoid overloading the unresponsive server.
- You'll continue to see the error until you check the issue with the server and restart the discovery service.

### Remediation

1. Sign in to the server encountering this error.
1. Run the following commands on PowerShell:

   ````
   Get-WMIObject win32_operatingsystem;
   Get-WindowsFeature  | Where-Object {$_.InstallState -eq 'Installed' -or ($_.InstallState -eq $null -and $_.Installed -eq 'True')};
   Get-WmiObject Win32_Process;
   netstat -ano -p tcp | select -Skip 4;
   ````
1. If the commands output the result in a few seconds, go to the **Azure Migrate project** > **Discovery and assessment** > **Overview** > **Manage** > **Appliances**, select the appliance name, and select **Refresh services** to restart the discovery service.
1. If the commands are timing out without giving any output, you need to:

   - Figure out which process is consuming high CPU or memory on the server.
   - Try to provide more cores or memory to that server and run the commands again.

## Error 10005: GuestCredentialNotValid

### Remediation
- Ensure the validity of credentials _(friendly name provided in the error)_ by selecting **Revalidate credentials** on the appliance configuration manager.
- Ensure that you can sign in to the affected server by using the same credential provided in the appliance.
- You can try by using another user account (for the same domain, in case the server is domain joined) for that server instead of an administrator account.
- The issue can happen when Global Catalog <-> Domain Controller communication is broken. Check for this problem by creating a new user account in the domain controller and providing the same in the appliance. You might also need to restart the domain controller.
- After you take the remediation steps, verify if the error was resolved by following the steps on [this website](troubleshoot-discovery.md#mitigation-verification).

## Error 10012: CredentialNotProvided

### Cause
This error occurs when you've provided a domain credential with the wrong domain name on the appliance configuration manager. For example, if you provided a domain credential with the username user@abc.com but provided the domain name as def.com, those credentials won't be attempted if the server is connected to def.com and you'll get this error message.

### Remediation
- Go to the appliance configuration manager to add a server credential or edit an existing one as explained in the cause.
- After you take the remediation steps, verify if the error was resolved by following the steps on [this website](troubleshoot-discovery.md#mitigation-verification).

## Mitigation verification
After you use the mitigation steps for the preceding errors, verify if the mitigation worked by running a few PowerCLI commands from the appliance server. If the commands succeed, it means that the issue is resolved. Otherwise, check and follow the remediation steps again.

### For VMware VMs _(using VMware pipe)_
1. Run the following commands to set up PowerCLI on the appliance server:
   ````
   Install-Module -Name VMware.PowerCLI -AllowClobber
   Set-PowerCLIConfiguration -InvalidCertificateAction Ignore
   ````
1. Connect to vCenter Server from the appliance by providing the vCenter Server IP address in the command and credentials in the prompt:
   ````
   Connect-VIServer -Server <IPAddress of vCenter Server>
   ````
1. Connect to the target server from the appliance by providing the server name and server credentials (as provided on the appliance):
   ````
   $vm = get-VM <VMName>
   $credential = Get-Credential
   ````
1. For software inventory, run the following commands to see if you get a successful output:

   - For Windows servers:

      ````
        Invoke-VMScript -VM $vm -ScriptText "powershell.exe 'Get-WMIObject win32_operatingsystem'" -GuestCredential $credential

        Invoke-VMScript -VM $vm -ScriptText "powershell.exe Get-WindowsFeature" -GuestCredential $credential
      ````
   - For Linux servers:
      ````
      Invoke-VMScript -VM $vm -ScriptText "ls" -GuestCredential $credential
      ````

### For Hyper-V VMs and physical servers _(using direct connect pipe)_
For Windows servers:

1. Connect to Windows server by running the command:
   ````
   $Server = New-PSSession –ComputerName <IPAddress of Server> -Credential <user_name>
   ````
   and input the server credentials in the prompt.

2. Run the following commands to validate for software inventory to see if you get a successful output:
   ````
   Invoke-Command -Session $Server -ScriptBlock {Get-WMIObject win32_operatingsystem}
   Invoke-Command -Session $Server -ScriptBlock {Get-WindowsFeature}
   ````

For Linux servers:

1. Install the OpenSSH client
   ````
   Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
   ````
2. Install the OpenSSH server
   ````
   Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
   ````
3. Start and configure OpenSSH Server
   ````
   Start-Service sshd
   Set-Service -Name sshd -StartupType 'Automatic'
   ````
4. Connect to OpenSSH Server
   ````
   ssh username@servername
   ````
5. Run the following commands to validate for software inventory to see if you get a successful output:
   ````
   ls
   ````

After you verify that the mitigation worked, go to the **Azure Migrate project** > **Discovery and assessment** > **Overview** > **Manage** > **Appliances**, select the appliance name, and select **Refresh services** to start a fresh discovery cycle.
## Discovered SQL Server instances and databases not in the portal

After you've initiated discovery on the appliance, it might take up to 24 hours to start showing the inventory data in the portal.

If you haven't provided Windows authentication or SQL Server authentication credentials on the appliance configuration manager, add the credentials so that the appliance can use them to connect to the respective SQL Server instances.

After the appliance is connected, it gathers configuration and performance data of SQL Server instances and databases. The SQL Server configuration data is updated once every 24 hours, and the performance data is captured every 30 seconds. Any change to the properties of the SQL Server instance and databases, such as database status and compatibility level, can take up to 24 hours to update on the portal.

## SQL Server instance is showing up in a "Not connected" state on the portal

To view the issues encountered during discovery of SQL Server instances and databases, select the **Not connected** status in the connection status column on the **Discovered servers** page in your project.

Creating assessment on top of servers containing SQL instances that weren't discovered completely or are in a not-connected state might lead to readiness being marked as **Unknown**.

## Common SQL Server instances and database discovery errors

Azure Migrate supports discovery of SQL Server instances and databases running on on-premises machines by using Azure Migrate: Discovery and assessment. See the [Discovery](tutorial-discover-vmware.md) tutorial to get started.

Typical SQL discovery errors are summarized in the following table.

| **Error** | **Cause** | **Action** | **Guide**
|--|--|--|--|
|**30000**: Credentials associated with this SQL server didn't work.|Either manually associated credentials are invalid or auto-associated credentials can no longer access the SQL server.|Add credentials for SQL Server on the appliance and wait until the next SQL discovery cycle or force refresh.| - |
|**30001**: Unable to connect to SQL Server from the appliance.|1. The appliance doesn't have a network line of sight to SQL Server.<br/>2. The firewall is blocking the connection between SQL Server and the appliance.|1. Make SQL Server reachable from the appliance.<br/>2. Allow incoming connections from the appliance to SQL Server.| - |
|**30003**: Certificate isn't trusted.|A trusted certificate isn't installed on the computer running SQL Server.|Set up a trusted certificate on the server. [Learn more](/troubleshoot/sql/connect/error-message-when-you-connect).| [View](/troubleshoot/sql/connect/error-message-when-you-connect) |
|**30004**: Insufficient permissions.|This error could occur because of the lack of permissions required to scan SQL Server instances. |Grant the sysadmin role to the credentials/ account provided on the appliance for discovering SQL Server instances and databases. [Learn more](/sql/t-sql/statements/grant-server-permissions-transact-sql).| [View](/sql/t-sql/statements/grant-server-permissions-transact-sql) |
|**30005**: SQL Server login failed to connect because of a problem with its default master database.|Either the database itself is invalid or the login lacks CONNECT permission on the database.|Use ALTER LOGIN to set the default database to master database.<br/>Grant the sysadmin role to the credentials/ account provided on the appliance for discovering SQL Server instances and databases. [Learn more](/sql/relational-databases/errors-events/mssqlserver-4064-database-engine-error).| [View](/sql/relational-databases/errors-events/mssqlserver-4064-database-engine-error) |
|**30006**: SQL Server login can't be used with Windows authentication.|1. The login might be a SQL Server login, but the server only accepts Windows authentication.<br/>2. You're trying to connect by using SQL Server authentication, but the login used doesn't exist on SQL Server.<br/>3. The login might use Windows authentication, but the login is an unrecognized Windows principal. An unrecognized Windows principal means that the login can't be verified by Windows. This issue could occur because the Windows login is from an untrusted domain.|If you try to connect by using SQL Server authentication, verify that SQL Server is configured in Mixed authentication mode and that the SQL Server login exists.<br/>If you try to connect by using Windows authentication, verify that you're properly logged in to the correct domain. [Learn more](/sql/relational-databases/errors-events/mssqlserver-18452-database-engine-error).| [View](/sql/relational-databases/errors-events/mssqlserver-18452-database-engine-error) |
|**30007**: Password expired.|The password of the account has expired.|The SQL Server login password might have expired. Reset the password or extend the password expiration date. [Learn more](/sql/relational-databases/native-client/features/changing-passwords-programmatically).| [View](/sql/relational-databases/native-client/features/changing-passwords-programmatically) |
|**30008**: Password must be changed.|The password of the account must be changed.|Change the password of the credential provided for SQL Server discovery. [Learn more](/previous-versions/sql/sql-server-2008-r2/cc645934(v=sql.105)).| [View](/previous-versions/sql/sql-server-2008-r2/cc645934(v=sql.105)) |
|**30009**: An internal error occurred.|An internal error occurred while discovering SQL Server instances and databases. |Contact Microsoft support if the issue persists.| - |
|**30010**: No databases found.|Unable to find any databases from the selected server instance.|Grant the sysadmin role to the credentials/ account provided on the appliance for discovering SQL databases.| - |
|**30011**: An internal error occurred while assessing a SQL instance or database.|An internal error occurred while performing assessment.|Contact Microsoft support if the issue persists.| - |
|**30012**: SQL connection failed.|1. The firewall on the server has refused the connection.<br/>2. The SQL Server Browser service (sqlbrowser) isn't started.<br/>3. SQL Server didn't respond to the client request because the server probably isn't started.<br/>4. The SQL Server client can't connect to the server. This error could occur because the server isn't configured to accept remote connections.<br/>5. The SQL Server client can't connect to the server. This error could occur because either the client can't resolve the name of the server or the name of the server is incorrect.<br/>6. The TCP or named pipe protocols aren't enabled.<br/>7. The specified SQL Server instance name isn't valid.|Use [this interactive user guide](/troubleshoot/sql/connect/resolving-connectivity-errors) to troubleshoot the connectivity issue. Wait for 24 hours after following the guide for the data to update in the service. If the issue persists, contact Microsoft support.| [View](https://go.microsoft.com/fwlink/?linkid=2153317) |
|**30013**: An error occurred while establishing a connection to the SQL Server instance.|1. The SQL Server name can't be resolved from the appliance.<br/>2. SQL Server doesn't allow remote connections.|If you can ping SQL Server from the appliance, wait 24 hours to check if this issue autoresolves. If it doesn't, contact Microsoft support. [Learn more](/sql/relational-databases/errors-events/mssqlserver-53-database-engine-error).| [View](/sql/relational-databases/errors-events/mssqlserver-53-database-engine-error) |
|**30014**: Username or password is invalid.| This error could occur because of an authentication failure that involves a bad password or username.|Provide a credential with a valid username and password. [Learn more](/sql/relational-databases/errors-events/mssqlserver-18456-database-engine-error).| [View](/sql/relational-databases/errors-events/mssqlserver-18456-database-engine-error) |
|**30015**: An internal error occurred while discovering the SQL Server instance.|An internal error occurred while discovering the SQL Server instance.|Contact Microsoft support if the issue persists.| - |
|**30016**: Connection to instance '%instance;' failed because of a timeout.| This problem could occur if the firewall on the server refuses the connection.|Verify whether the firewall on the SQL server is configured to accept connections. If the error persists, contact Microsoft support. [Learn more](/sql/relational-databases/errors-events/mssqlserver-neg2-database-engine-error).| [View](/sql/relational-databases/errors-events/mssqlserver-neg2-database-engine-error) |
|**30017**: Internal error occurred.|Unhandled exception.|Contact Microsoft support if the issue persists.| - |
|**30018**: Internal error occurred.|An internal error occurred while collecting data such as the Temp DB size and the file size of the SQL instance.|Wait for 24 hours and contact Microsoft support if the issue persists.| - |
|**30019**: Internal error occurred.|An internal error occurred while collecting performance metrics such as memory utilization of a database or an instance.|Wait for 24 hours and contact Microsoft support if the issue persists.| - |

## Common web apps discovery errors

Azure Migrate supports discovery of web apps running on on-premises machines by using Azure Migrate: Discovery and assessment. See the [Discovery](tutorial-discover-vmware.md) tutorial to get started.

Typical web apps discovery errors are summarized in the following table.

| **Error** | **Cause** | **Action** |
|--|--|--|
| **40001:** IIS Management console feature isn't enabled. | IIS web app discovery uses the management API that's included with the local version of IIS to read the IIS configuration. This API is available when the IIS Management Console feature of IIS is enabled. Either this feature isn't enabled or the OS isn't a supported version for IIS web app discovery.| Ensure that the Web Server (IIS) role including the IIS Management Console feature (part of Management Tools) is enabled and that the server OS is Windows Server 2008 R2 or later version.|
| **40002:** Unable to connect to the server from the appliance. | Connection to the server failed because of invalid login credentials or an unavailable machine. | Ensure that the login credentials provided for the server are correct and that the server is online and accepting WS-Management PowerShell remote connections. |
| **40003:** Unable to connect to the server because of invalid credentials. | Connection to the server failed because of invalid login credentials. | Ensure that the login credentials provided for the server are correct and that WS-Management PowerShell remoting is enabled. |
| **40004:** Unable to access the IIS configuration. | No permissions or insufficient permissions. | Confirm that the user credentials provided for the server are administrator-level credentials and that the user has permission to access files under the IIS directory (%windir%\System32\inetsrv) and IIS server configuration directory (%windir%\System32\inetsrv\config). |
| **40005:** Unable to complete IIS discovery. | Failed to complete discovery on the VM. This issue might occur because of issues with accessing configuration on the server. The error was '%detailedMessage;'. | Confirm that the user credentials provided for the server are administrator-level credentials and that the user has permission to access files under the IIS directory (%windir%\System32\inetsrv) and IIS server configuration directory (%windir%\System32\inetsrv\config). Then contact Microsoft support with the error details. |
| **40006:** Uncategorized exception. | New error scenario. | Contact Microsoft support with error details and logs. Logs can be found on the appliance server under the path C:\ProgramData\Microsoft Azure\Logs. |
| **40007:** No web apps found for the web server. | The web server doesn't have any hosted applications. | Check the web server configuration. |

## Next steps

Set up an appliance for [VMware](how-to-set-up-appliance-vmware.md), [Hyper-V](how-to-set-up-appliance-hyper-v.md), or [physical servers](how-to-set-up-appliance-physical.md).
