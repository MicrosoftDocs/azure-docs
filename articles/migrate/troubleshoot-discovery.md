---
title: Troubleshoot the ongoing server discovery, software inventory and SQL discovery
description: Get help with server discovery, software inventory and SQL and web apps discovery
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: troubleshooting
ms.date: 07/01/2020
---

# Troubleshoot the ongoing server discovery, software inventory, SQL, and web app discovery

This article helps you troubleshoot issues with ongoing server discovery, software inventory and discovery of SQL Server instances and databases.

## Discovered servers not showing in portal

**Error**

You get this error when you don’t yet see the servers in the portal, and the discovery state is **Discovery in progress.**
 
**Remediation**

If the servers don’t appear in the portal, wait for few minutes as it takes around 15 minutes for discovery of servers running on a vCenter Server, 2 minutes for each Hyper-V host, added on appliance for discovery of servers running on the host and a minute for discovery of each server added on the physical appliance.

If the state still doesn’t change, do as follows:

- Select **Refresh** on the **Servers** tab to see the count of the discovered servers in Azure Migrate: Discovery and assessment and Azure Migrate: Server Migration.

If the above step doesn’t work and you are discovering VMware servers:

1. Verify that the vCenter account you specified has the permissions set correctly with access to at least one server.
1. Check on VMware if the vCenter account has access granted at vCenter VM folder level. Azure Migrate can’t discover servers on VMware [Learn more](set-discovery-scope.md) about scoping discovery.

## Server data not updating in portal

**Error**

You get this error if the discovered servers don't appear in the portal or if the server data is outdated. 

**Remediation**

Wait for few minutes as it takes up to 30 minutes for changes in discovered server configuration data to appear in the portal and few hours for changes in software inventory data to appear. If there's no data after this time, refresh and do as follows:

1. In **Windows, Linux and SQL Servers**, **Azure Migrate: Discovery and assessment**, select **Overview**.
1. Under **Manage**, select **Appliances**.
1. Select **Refresh services**.
Wait for the refresh operation to complete. You should now see up-to-date information.

## Deleted servers appear in portal

**Error**
You get this error when the deleted servers continue to appear in the portal.

**Remediation**
If the data continues to appear, wait for 30 minutes and do as follows:

In **Windows, Linux and SQL Servers**, **Azure Migrate: Discovery and assessment**, select **Overview**.
1. Under **Manage**, select **Appliances**.
1. Select **Refresh services**.
Wait for the refresh operation to complete. You should now see up-to-date information.

## I imported a CSV but I see "Discovery is in progress"

This status appears if your CSV upload failed due to a validation failure. 

**Remediation**

Import the CSV again. You can download the previous upload error report and follow the file's remediation guidance to fix the errors. Download the error report from the **Import Details** section on **Discover servers** page.

## Do not see software inventory details even after updating guest credentials

**Remediation**
The software inventory discovery runs once every 24 hours. This may take a few minutes depending on the number of servers discovered. If you would like to see the details immediately, refresh as follows.

1. In **Windows, Linux and SQL Servers**, **Azure Migrate: Discovery and assessment**, select **Overview**.
1. Under **Manage**, select **Appliances**.
1. Select **Refresh services**.
Wait for the refresh operation to complete. You should now see up-to-date information.

## Unable to export software inventory

**Error**
You get this error when you don't have Contributor privileges

**Remediation**

Ensure the user downloading the inventory from the portal has Contributor privileges on the subscription.

## Common software inventory errors

Azure Migrate supports software inventory, using Azure Migrate: Discovery and assessment. Software inventory is currently supported for VMware only. [Learn more](how-to-discover-applications.md) about the requirements for software inventory.

The list of software inventory errors is summarized in the table below.

> [!Note]
> Same errors can also be encountered with agentless dependency analysis as it follows the same methodology as software inventory to collect the required data.

| **Error** | **Cause** | **Action** |
|--|--|--|
| **9000:** VMware tools status on the server cannot be detected | VMware tools might not be installed on the server or the installed version is corrupted. | Ensure that VMware tools later than version 10.2.1 is installed and running on the server. |
| **9001:** VMware tools not installed on the server. | VMware tools might not be installed on the server or the installed version is corrupted. | Ensure that VMware tools later than version 10.2.1 is installed and running on the server. |
| **9002:** VMware tools not running on the server. | VMware tools might not be installed on the server or the installed version is corrupted. | Ensure that VMware tools later than version 10.2.0 is installed and running on the server. |
| **9003:** Operating system type running on the server is not supported. | Operating system running on the server is neither Windows nor Linux. | Only Windows and Linux OS types are supported. If the server is indeed running Windows or Linux OS, check the operating system type specified in vCenter Server. |
| **9004:** Server is not a running state. | Server is in powered off state. | Ensure that the server is in a running state. |
| **9005:** Operating system type running on the server is not supported. | Operating system running on the server is neither Windows nor Linux. | Only Windows and Linux OS types are supported. \<FetchedParameter> operating system is not supported currently. |
| **9006:** The URL needed to download the discovery metadata file from the server is empty. | This could be a transient issue due to the discovery agent on the appliance not working as expected. | The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **9007:** The process that runs the script to collect the metadata is not found in the server. | This could be a transient issue due to the discovery agent on the appliance not working as expected. | The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **9008:** The status of the process running on the server to collect the metadata cannot be retrieved. | This could be a transient issue due to an internal error. | The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **9009:** Window User Account Control (UAC) is preventing the execution of discovery operations on the server. | Windows User Account Control (UAC) settings are restricting the discovery of installed applications from the server. | On the impacted server, lower the level of the 'User Account Control' settings on Control Panel. |
| **9010:** Server is powered off. | Server is in powered off state. | Ensure that the server is in a powered on state. |
| **9011:** The file containing the discovered metadata cannot be found on the server. | This could be a transient issue due to an internal error. | The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **9012:** The file containing the discovered metadata on the server is empty. | This could be a transient issue due to an internal error. | The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **9013:** A new temporary user profile is getting created on logging in the server each time. | A new temporary user profile is getting created on logging in the server each time. | Please submit a Microsoft support case to help troubleshoot this issue. |
| **9014:** Unable to retrieve the file containing the discovered metadata due to an error encountered on the ESXi host.  Error code: %ErrorCode; Details: %ErrorMessage | Encountered an error on the ESXi host \<HostName>.  Error code: %ErrorCode; Details: %ErrorMessage | Ensure that port 443 is open on the ESXi host on which the server is running.<br/><br/> [Learn more](troubleshoot-discovery.md#error-9014-httpgetrequesttoretrievefilefailed) on how to remediate the issue.|
| **9015:** The vCenter Server user account provided for server discovery does not have Guest operations privileges enabled. | The required privileges of Guest Operations have not been enabled on the vCenter Server user account. | Ensure that the vCenter Server user account has privileges enabled for Virtual Machines > Guest Operations, in order to interact with the server and pull the required data. <br/><br/> [Learn more](tutorial-discover-vmware.md#prepare-vmware) on how to set up the vCenter Server account with required privileges. |
| **9016:** Unable to discover the metadata as the guest operations agent on the server is outdated. | Either the VMware tools are not installed on the server or the installed version is not up to date. | Ensure that the VMware tools are installed and running up to date on the server. The VMware Tools version must be version 10.2.1 or later. |
| **9017:** The file containing the discovered metadata cannot be found on the server. | This could be a transient issue due to an internal error. | Please submit a Microsoft support case to help troubleshoot this issue. |
| **9018:** PowerShell is not installed on the server. | PowerShell cannot be found on the server. | Ensure that PowerShell version 2.0 or later is installed on the server. <br/><br/> [Learn more](troubleshoot-discovery.md#error-9018-powershellnotfound) on how to remediate the issue.|
| **9019:** Unable to discover the metadata due to guest operation failures on the server. | VMware guest operations failed on the server. The issue was encountered when trying the following credentials on the server: <FriendlyNameOfCredentials>. | Ensure that the server credentials provided on the appliance are valid and username provided in the credentials is in UPN format. (find the friendly name of the credentials tried by Azure Migrate in the possible causes) |
| **9020:** Unable to create the file required to contain the discovered metadata on the server. | The role associated to the credentials provided on the appliance or a group policy on-premises is restricting the creation of file in the required folder. The issue was encountered when trying the following credentials on the server: <FriendlyNameOfCredentials>. | 1. Check if the credentials provided on the appliance have create file permission on the folder \<folder path/folder name> in the server. <br/>2. If the credentials provided on the appliance do not have the required permissions, either provide another set of credentials or edit an existing one. (find the friendly name of the credentials tried by Azure Migrate in the possible causes) |
| **9021:** Unable to create the file required to contain the discovered metadata at right path on the server. | VMware tools are reporting an incorrect file path to create the file. | Ensure that VMware tools later than version 10.2.0 is installed and running on the server. |
| **9022:** The access is denied to run the Get-WmiObject cmdlet on the server. | The role associated to the credentials provided on the appliance or a group policy on-premises is restricting access to WMI object. The issue was encountered when trying the following credentials on the server: \<FriendlyNameOfCredentials>. | 1. Check if the credentials provided on the appliance have create file Administrator privileges and has WMI enabled. <br/> 2. If the credentials provided on the appliance do not have the required permissions, either provide another set of credentials or edit an existing one. (find the friendly name of the credentials tried by Azure Migrate in the possible causes).<br/><br/> [Learn more](troubleshoot-discovery.md#error-9022-getwmiobjectaccessdenied) on how to remediate the issue.|
| **9023:** Unable to run PowerShell as the %SystemRoot% environment variable value is empty. | The value of %SystemRoot% environment variable is empty for the server. | 1. Check if the environment variable is returning an empty value by running echo %systemroot% command on the impacted server. <br/> 2. If issue persists, submit a Microsoft support case. |
| **9024:** Unable to perform discovery as the %TEMP% environment variable value is empty. | The value of %TEMP% environment variable is empty for the server. | 1. Check if the environment variable is returning an empty value by running echo %temp% command on the impacted server. <br/> 2. If issue persists, submit a Microsoft support case. |
| **9025:** Unable to perform discovery PowerShell is corrupted on the server. | PowerShell is corrupted on the server. | Reinstall PowerShell and verify that it is running on the impacted server. |
| **9026:** Unable to run guest operations on the server. | The current state of the server is not allowing the guest operations to be run. | 1. Ensure that the impacted server is up and running.<br/> 2. If issue persists, submit a Microsoft support case. |
| **9027:** Unable to discover the metadata as the guest operations agent is not running on the server. | Unable to contact the guest operations agent on the server. | Ensure that VMware tools later than version 10.2.0 is installed and running on the server. |
| **9028:** Unable to create the file required to contain the discovered metadata due to insufficient storage on the server. | There is lack of sufficient storage space on the server disk. | Ensure that enough space is available on disk storage of the impacted server. |
| **9029:** The credentials provided on the appliance do not have access permissions to run PowerShell. | The credentials provided on the appliance do not have access permissions to run PowerShell. The issue was encountered when trying the following credentials on the server: \<FriendlyNameOfCredentials>. | 1. Ensure that the credentials provided on the appliance can access PowerShell on the server.<br/> 2. If the credentials provided on the appliance do not have the required access, either provide another set of credentials or edit an existing one. (find the friendly name of the credentials tried by Azure Migrate in the possible causes) |
| **9030:** Unable to gather the discovered metadata as the ESXi host where the server is hosted is in a disconnected state. | The ESXi host on which server is residing is in a disconnected state. | Ensure that the ESXi host running the server is in a connected state. |
| **9031:** Unable to gather the discovered metadata as the ESXi host where the server is hosted is not responding. | The ESXi host on which server is residing is in an invalid state. | Ensure that the ESXi host running the server is in a running and connected state. |
| **9032:** Unable to discover due to an internal error. | The issue encountered is due to an internal error. | Follow the steps [here](troubleshoot-discovery.md#error-9032-invalidrequest) to remediate the issue. If the issue persists, open a Microsoft support case. |
| **9033:** Unable to discover as the username of the credentials provided on the appliance for the server have invalid characters. | The credentials provided on the appliance contain invalid characters in the username. The issue was encountered when trying the following credentials on the server: \<FriendlyNameOfCredentials>. | Ensure that the credentials provided on the appliance do not have any invalid characters in the username. You can go back to the appliance configuration manager to edit the credentials. (find the friendly name of the credentials tried by Azure Migrate in the possible causes). |
| **9034:** Unable to discover as the username of the credentials provided on the appliance for the server is not in UPN format. | The credentials provided on the appliance do not have the username in the UPN format. The issue was encountered when trying the following credentials on the server: \<FriendlyNameOfCredentials>. | Ensure that the credentials provided on the appliance have their username in the User Principal Name (UPN) format. You can go back to the appliance configuration manager to edit the credentials. (find the friendly name of the credentials tried by Azure Migrate in the possible causes). |
| **9035:** Unable to discover as PowerShell language mode in not set correctly. | PowerShell language mode is not set to 'Full language'. | Ensure that PowerShell language mode is set to 'Full Language'. |
| **9036:** Unable to discover as the username of the credentials provided on the appliance for the server is not in UPN format. | The credentials provided on the appliance do not have the username in the UPN format. The issue was encountered when trying the following credentials on the server: \<FriendlyNameOfCredentials>. | Ensure that the credentials provided on the appliance have their username in the User Principal Name (UPN) format. You can go back to the appliance configuration manager to edit the credentials. (find the friendly name of the credentials tried by Azure Migrate in the possible causes). |
| **9037:** The metadata collection is temporarily paused due to high response time from the server. | The server is taking too long to respond. | The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **10000:** Operation system type running on the server is not supported. | Operating system running on the server is neither Windows nor Linux. | Only Windows and Linux OS types are supported. \<GuestOSName> operating system is not supported currently. |
| **10001:** The script required to gather discovery metadata is not found on the server. | The script required to perform discovery may have been deleted or removed from the expected location. | Please submit a Microsoft support case to help troubleshoot this issue. |
| **10002:** The discovery operations timed out on the server. | This could be a transient issue due to the discovery agent on the appliance not working as expected. | The issue should automatically resolve in the next cycle within 24 hours. If it isn't resolved, follow the steps [here](troubleshoot-discovery.md#error-10002-scriptexecutiontimedoutonvm) to remediate the issue. If the issue still persists, open a Microsoft support case.|
| **10003:** The process executing the discovery operations exited with an error. | The process executing the discovery operations exited abruptly due to an error.| The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **10004:** Credentials not provided on the appliance for the server OS type. | The credentials for the server OS type were not added on the appliance. | 1. Ensure that you add the credentials for the OS type of the impacted server on the appliance.<br/> 2. You can now add multiple server credentials on the appliance. |
| **10005:** Credentials provided on the appliance for the server are invalid. | The credentials provided on the appliance are not valid. The issue was encountered when trying the following credentials on the server: \<FriendlyNameOfCredentials>. | 1. Ensure that the credentials provided on the appliance are valid and the server is accessible using the credentials.<br/> 2. You can now add multiple server credentials on the appliance.<br/> 3. Go back to the appliance configuration manager to either provide another set of credentials or edit an existing one. (find the friendly name of the credentials tried by Azure Migrate in the possible causes). <br/><br/> [Learn more](troubleshoot-discovery.md#error-10005-guestcredentialnotvalid) on how to remediate the issue.|
| **10006:** Operation system type running on the server is not supported. | Operating system running on the server is neither Windows nor Linux. | Only Windows and Linux OS types are supported. \<GuestOSName> operating system is not supported currently. |
| **10007:** Unable to process the discovered metadata from the server. | An error occurred when parsing the contents of the file containing the discovered metadata. | Please submit a Microsoft support case to help troubleshoot this issue. |
| **10008:** Unable to create the file required to contain the discovered metadata on the server. | The role associated to the credentials provided on the appliance or a group policy on-premises is restricting the creation of file in the required folder. The issue was encountered when trying the following credentials on the server: <FriendlyNameOfCredentials>. | 1. Check if the credentials provided on the appliance have create file permission on the folder \<folder path/folder name> in the server.<br/> 2. If the credentials provided on the appliance do not have the required permissions, either provide another set of credentials or edit an existing one. (find the friendly name of the credentials tried by Azure Migrate in the possible causes) |
| **10009:** Unable to write the discovered metadata in the file on the server. | The role associated to the credentials provided on the appliance or a group policy on-premises is restricting writing in the file on the server. The issue was encountered when trying the following credentials on the server: \<FriendlyNameOfCredentials>. | 1. Check if the credentials provided on the appliance have write file permission on the folder <folder path/folder name> in the server.<br/> 2. If the credentials provided on the appliance do not have the required permissions, either provide another set of credentials or edit an existing one. (find the friendly name of the credentials tried by Azure Migrate in the possible causes) |
| **10010:** Unable to discover as the command- %CommandName; required to collect some metadata is missing on the server. | The package containing the command  %CommandName; is not installed on the server. | Ensure that the package containing the command  %CommandName; is installed on the server. |
| **10011:** The credentials provided on the appliance were used to log in and log off for an interactive session. | The interactive log in and log-off forces the registry keys to be unloaded in the profile of the account, being used. This condition makes the keys unavailable for future use. | Use the resolution methods documented [here](/sharepoint/troubleshoot/administration/800703fa-illegal-operation-error#resolutionus/sharepoint/troubleshoot/administration/800703fa-illegal-operation-error) |
| **10012:** Credentials have not been provided on the appliance for the server. | Either no credentials have been provided for the server or you have provided domain credentials with incorrect domain name on the appliance.[Learn more](troubleshoot-discovery.md#error-10012-credentialnotprovided) about the cause of this error. | 1. Ensure that the credentials are provided on the appliance for the server and the server is accessible using the credentials. <br/> 2. You can now add multiple credentials on the appliance for servers. Go back to the appliance configuration manager to provide credentials for the server.|

## Error 9014: HTTPGetRequestToRetrieveFileFailed

### Cause
The issue happens when VMware discovery agent in appliance tries to download the output file containing dependency data from the server file system through ESXi host on which the server is hosted.

### Remediation
- You can test TCP connectivity to the ESXi host _(name provided in the error message)_ on port 443 (required to be open on ESXi hosts to pull dependency data) from the appliance by opening PowerShell on appliance server and executing the following command:
    ````
    Test -NetConnection -ComputeName <Ip address of the ESXi host> -Port 443
    ````
- If command returns successful connectivity, you can go to the Azure Migrate project> Discovery and assessment>Overview>Manage>Appliances, select the appliance name and select **Refresh services**.

## Error 9018: PowerShellNotFound

### Cause
The error usually comes for servers running Windows Server 2008 or lower.

### Remediation
You need to install the required PowerShell version (2.0 or later) at this location on the server: ($SYSTEMROOT)\System32\WindowsPowershell\v1.0\powershell.exe. [Learn more](/powershell/scripting/windows-powershell/install/installing-windows-powershell) on how to install PowerShell in Windows Server.

After installing the required PowerShell version, you can verify if the error was resolved by following steps [here](troubleshoot-discovery.md#mitigation-verification-using-vmware-powercli).

## Error 9022: GetWMIObjectAccessDenied

### Remediation
Make sure that the user account provided in the appliance has access to WMI Namespace and subnamespaces. You can set the access by following these steps:
1.	Go to the server that is reporting this error.
1. Search and select **Run** from the Start menu. In the **Run** dialog box, type *wmimgmt.msc* in the **Open:** text field and press enter.
1. The wmimgmt console will open where you can find **WMI Control (Local)** in the left panel. Right-click on it and select **Properties** from the menu.
1. In the WMI Control (Local) Properties dialog box, select **Securities** tab.
1. Select **Security** button, and **Security for ROOT** dialog box appears.
1. Select **Advanced** button to open **Advanced Security Settings for Root** dialog box. 
1. Select **Add** button, to open the **Permission Entry for Root** dialog box.
1. Click **Select a principal** to open **Select Users, Computers, Service Accounts or Groups** dialog box.
1. Select the user name(s) or group(s) you want to grant access to the WMI and click OK.
1. Ensure you grant execute permissions and select *This namespace and subnamespaces* in the **Applies to:** drop-down.
1. Select **Apply** button to save the settings and close all dialog boxes.

After getting the required access, you can verify if the error was resolved by following steps [here](troubleshoot-discovery.md#mitigation-verification-using-vmware-powercli).

## Error 9032: InvalidRequest

### Cause
There can be multiple reasons for this issue, one of the reason is when the username provided (server credentials) on the appliance configuration manager is having invalid XML characters, which cause error in parsing the SOAP request.

### Remediation
- Make sure the username of the server credentials does not have invalid XML characters and is in username@domain.com format popularly known as UPN format.
- After editing the credentials on the appliance, you can verify if the error was resolved by following steps [here](troubleshoot-discovery.md#mitigation-verification-using-vmware-powercli).


## Error 10002: ScriptExecutionTimedOutOnVm

### Cause
- This error occurs when server is slow or unresponsive and the script executed to pull the dependency data starts timing out.
- Once the discovery agent encounters this error on the server, appliance does not attempt agentless dependency analysis on the server thereafter to avoid overloading the unresponsive server.
- Hence you will continue to see the error until you check the issue with the server and restart the discovery service.

### Remediation
1. Login into the server encountering this error.
1. Run following commands on PowerShell:
   ````
   Get-WMIObject win32_operatingsystem;
   Get-WindowsFeature  | Where-Object {$_.InstallState -eq 'Installed' -or ($_.InstallState -eq $null -and $_.Installed -eq 'True')};
   Get-WmiObject Win32_Process;
   netstat -ano -p tcp | select -Skip 4;
   ````
1. If commands output the result in few seconds, then you can go to the Azure Migrate project, Discovery and assessment, Overview, Manage, Appliances, select the appliance name and select **Refresh services** to restart the discovery service.
1. If the commands are timing out without giving any output, then 
- You need to figure out which process is consuming high CPU or memory on the server.
- You can try to provide more cores/memory to that server and execute the commands again.

## Error 10005: GuestCredentialNotValid

### Remediation
- Ensure the validity of credentials _(friendly name provided in the error)_ by clicking on "Revalidate credentials" on the appliance config manager.
- Ensure that you are able to log in into the impacted server using the same credential provided in the appliance.
- You can try using another user account (for the same domain, in case server is domain-joined) for that server instead of Administrator account.
- The issue can happen when Global Catalog <-> Domain Controller communication is broken. You can check this by creating a new user account in the domain controller and providing the same in the appliance. This might also require restarting the Domain controller.
- After taking the remediation steps, you can verify if the error was resolved by following steps [here](troubleshoot-discovery.md#mitigation-verification-using-vmware-powercli).

## Error 10012: CredentialNotProvided

### Cause
This error occurs when you have provided a domain credential with a wrong domain name on the appliance configuration manager. For example, if you have provided a domain credential with username user@abc.com but provided the domain name as def.com, those credentials will not be attempted if the server is connected to def.com and you will get this error message.

### Remediation
- Go to appliance configuration manager to add a server credential or edit an existing one as explained in the cause.
- After taking the remediation steps, you can verify if the error was resolved by following steps [here](troubleshoot-discovery.md#mitigation-verification-using-vmware-powercli).

## Mitigation verification using VMware PowerCLI
After using the mitigation steps on the errors listed above, you can verify if the mitigation worked by running few PowerCLI commands from the appliance server. If the commands succeed, it means that the issue is now resolved else you need to check and follow the remediation steps again.

1. Run the following commands to set up PowerCLI on the appliance server:
   ````
   Install-Module -Name VMware.PowerCLI -AllowClobber
   Set-PowerCLIConfiguration -InvalidCertificateAction Ignore
   ````
2. Connect to vCenter Server from appliance by providing the vCenter Server IP address in the command and credentials in the prompt:
   ````
   Connect-VIServer -Server <IPAddress of vCenter Server>
   ````
3. Connect to the target server from appliance by providing the server name and server credentials (as provided on appliance):
   ````
   $vm = get-VM <VMName>
   $credential = Get-Credential
   ````
4. For software inventory, run the following commands to see you get a successful output:

  - For Windows servers:

      ```` 
        Invoke-VMScript -VM $vm -ScriptText "powershell.exe 'Get-WMIObject win32_operatingsystem'" -GuestCredential $credential

        Invoke-VMScript -VM $vm -ScriptText "powershell.exe Get-WindowsFeature" -GuestCredential $credential
      ```` 
   - For Linux servers:
      ````
      Invoke-VMScript -VM $vm -ScriptText "ls" -GuestCredential $credential
      ````
5. For agentless dependency analysis, run the following commands to see you get a successful output:

  - For Windows servers:

      ```` 
      Invoke-VMScript -VM $vm -ScriptText "powershell.exe 'Get-WmiObject Win32_Process'" -GuestCredential $credential 
  
      Invoke-VMScript -VM $vm -ScriptText "powershell.exe 'netstat -ano -p tcp'" -GuestCredential $credential 
      ```` 
   - For Linux servers:
      ````
      Invoke-VMScript -VM $vm -ScriptText "ps -o pid,cmd | grep -v ]$" -GuestCredential $credential

      Invoke-VMScript -VM $vm -ScriptText "netstat -atnp | awk '{print $4,$5,$7}'" -GuestCredential $credential
      ````
6. After verifying that the mitigation worked, you can go to the Azure Migrate project> Discovery and assessment>Overview>Manage>Appliances, select the appliance name and select **Refresh services** to start a fresh discovery cycle.

## Discovered SQL Server instances and databases not in portal

After you have initiated discovery on the appliance, it may take up to 24 hours to start showing the inventory data in the portal.

If you have not provided Windows authentication or SQL Server authentication credentials on the appliance configuration manager, then add the credentials so that the appliance can use them to connect to respective SQL Server instances.

Once connected, appliance gathers configuration and performance data of SQL Server instances and databases. The SQL Server configuration data is updated once every 24 hours and the performance data are captured every 30 seconds. Hence any change to the properties of the SQL Server instance and databases such as database status, compatibility level etc. can take up to 24 hours to update on the portal.

## SQL Server instance is showing up in "Not connected" state on portal

To view the issues encountered during discovery of SQL Server instances and databases please click on "Not connected" status in connection status column on **Discovered servers** page in your project.

Creating assessment on top of servers containing SQL instances that were not discovered completely or are in not connected state, may lead to readiness being marked as "unknown".

## Common SQL Server instances and database discovery errors

Azure Migrate supports discovery of SQL Server instances and databases running on on-premises machines, using Azure Migrate: Discovery and assessment. SQL discovery is currently supported for VMware only. Refer to the [Discovery](tutorial-discover-vmware.md) tutorial to get started.

Typical SQL discovery errors are summarized in the table.

| **Error** | **Cause** | **Action** | **Guide**
|--|--|--|--|
|30000: Credentials associated with this SQL Server didn't work.|Either manually associated credentials are invalid or auto associated credentials can no longer access the SQL Server.|Add credentials for SQL Server on the appliance and wait until the next SQL discovery cycle or force refresh.| - |
|30001: Unable to connect to SQL Server from appliance.|1. Appliance doesn’t have network line of sight to SQL Server.<br/>2. Firewall blocking connection between SQL Server and appliance.|1. Make SQL Server reachable from appliance.<br/>2. Allow incoming connections from appliance to SQL Server.| - | 
|30003: Certificate is not trusted.|A trusted certificate is not installed on the computer running SQL Server.|Please set up a trusted certificate on the server. [Learn more](/troubleshoot/sql/connect/error-message-when-you-connect)| [View](/troubleshoot/sql/connect/error-message-when-you-connect) |
|30004: Insufficient Permissions.|This error could occur due to the lack of permissions required to scan SQL Server instances. |Grant sysadmin role to the credentials/ account provided on the appliance for discovering SQL Server instances and databases. [Learn more](/sql/t-sql/statements/grant-server-permissions-transact-sql)| [View](/sql/t-sql/statements/grant-server-permissions-transact-sql) |
|30005: SQL Server login failed to connect because of a problem with its default master database.|Either the database itself is invalid or the login lacks CONNECT permission on the database.|Use ALTER LOGIN to set the default database to master database.<br/>Grant sysadmin role to the credentials/ account provided on the appliance for discovering SQL Server instances and databases. [Learn more](/sql/relational-databases/errors-events/mssqlserver-4064-database-engine-error)| [View](/sql/relational-databases/errors-events/mssqlserver-4064-database-engine-error) |
|30006: SQL Server login cannot be used with Windows Authentication.|1. The login may be a SQL Server login but the server only accepts Windows Authentication.<br/>2. You are trying to connect using SQL Server Authentication but the login used does not exist on SQL Server.<br/>3. The login may use Windows Authentication but the login is an unrecognized Windows principal. An unrecognized Windows principal means that the login cannot be verified by Windows. This could be because the Windows login is from an untrusted domain.|If you are trying to connect using SQL Server Authentication, verify that SQL Server is configured in Mixed Authentication Mode and SQL Server login exists.<br/>If you are trying to connect using Windows Authentication, verify that you are properly logged into the correct domain. [Learn more](/sql/relational-databases/errors-events/mssqlserver-18452-database-engine-error)| [View](/sql/relational-databases/errors-events/mssqlserver-18452-database-engine-error) |
|30007: Password expired.|The password of the account has expired.|The SQL Server login password may have expired, reset the password and/ or extend the password expiration date. [Learn more](/sql/relational-databases/native-client/features/changing-passwords-programmatically)| [View](/sql/relational-databases/native-client/features/changing-passwords-programmatically) |
|30008: Password must be changed.|The password of the account must be changed.|Change the password of the credential provided for SQL Server discovery. [Learn more](/previous-versions/sql/sql-server-2008-r2/cc645934(v=sql.105))| [View](/previous-versions/sql/sql-server-2008-r2/cc645934(v=sql.105)) |
|30009: An internal error occurred.|Internal error occurred while discovering SQL Server instances and databases. |Please contact Microsoft support if the issue persists.| - |
|30010: No databases found.|Unable to find any databases from the selected server instance.|Grant sysadmin role to the credentials/ account provided on the appliance for discovering SQL databases.| - |
|30011: An internal error occurred while assessing a SQL instance or database.|Internal error occurred while performing assessment.|Please contact Microsoft support if the issue persists.| - |
|30012: SQL connection failed.|1. The firewall on the server has refused the connection.<br/>2. The SQL Server Browser service (sqlbrowser) is not started.<br/>3. SQL Server did not respond to the client request because the server is probably not started.<br/>4. The SQL Server client cannot connect to the server. This error could occur because the server is not configured to accept remote connections.<br/>5. The SQL Server client cannot connect to the server. The error could occur because either the client cannot resolve the name of the server or the name of the server is incorrect.<br/>6. The TCP, or named pipe protocols are not enabled.<br/>7. Specified SQL Server instance name is not valid.|Please use [this](https://go.microsoft.com/fwlink/?linkid=2153317) interactive user guide to troubleshoot the connectivity issue. Wait for 24 hours after following the guide for the data to update in the service. If the issue still persists, contact Microsoft support.| [View](https://go.microsoft.com/fwlink/?linkid=2153317) |
|30013: An error occurred while establishing a connection to the SQL server instance.|1. SQL Server’s name cannot be resolved from appliance.<br/>2. SQL Server does not allow remote connections.|If you can ping SQL server from appliance, please wait 24 hours to check if this issue auto resolves. If it doesn’t, please contact Microsoft support. [Learn more](/sql/relational-databases/errors-events/mssqlserver-53-database-engine-error)| [View](/sql/relational-databases/errors-events/mssqlserver-53-database-engine-error) |
|30014: Username or password is invalid.| This error could occur because of an authentication failure that involves a bad password or username.|Please provide a credential with a valid Username and Password. [Learn more](/sql/relational-databases/errors-events/mssqlserver-18456-database-engine-error)| [View](/sql/relational-databases/errors-events/mssqlserver-18456-database-engine-error) |
|30015: An internal error occurred while discovering the SQL instance.|An internal error occurred while discovering the SQL instance.|Please contact Microsoft support if the issue persists.| - |
|30016: Connection to instance '%instance;' failed due to a timeout.| This could occur if firewall on the server refuses the connection.|Verify whether firewall on the SQL Server is configured to accept connections. If the error persists, please contact Microsoft support. [Learn more](/sql/relational-databases/errors-events/mssqlserver-neg2-database-engine-error)| [View](/sql/relational-databases/errors-events/mssqlserver-neg2-database-engine-error) |
|30017: Internal error occurred.|Unhandled exception.|Please contact Microsoft support if the issue persists.| - |
|30018: Internal error occurred.|An internal error occurred while collecting data such as Temp DB size, File size etc. of the SQL instance.|Please wait for 24 hours and contact Microsoft support if the issue persists.| - |
|30019: An internal error occurred.|An internal error occurred while collecting performance metrics such as memory utilization, etc. of a database or an instance.|Please wait for 24 hours and contact Microsoft support if the issue persists.| - |

## Common web apps discovery errors

Azure Migrate supports discovery of ASP.NET web apps running on on-premises machines, using Azure Migrate: Discovery and assessment. Web apps discovery is currently supported for VMware only. Refer to the [Discovery](tutorial-discover-vmware.md) tutorial to get started.

Typical web apps discovery errors are summarized in the table.

| **Error** | **Cause** | **Action** |
|--|--|--|
| **40001:** IIS Management console feature is not enabled. | IIS web app discovery uses the management API that is included with the local version of IIS to read the IIS configuration. This API is available when the IIS Management Console feature of IIS is enabled. Either this feature is not enabled or the OS is not a supported version for IIS web app discovery.| Ensure that the Web Server (IIS) role including the IIS Management Console feature (part of Management Tools) is enabled, and that the server OS is version Windows Server 2008 R2 or later version.|
| **40002:** Unable to connect to the server from appliance. | Connection to the server failed due to invalid login credentials or unavailable machine. | Ensure that the login credentials provided for the server are correct and that the server is online and accepting WS-Management PowerShell remote connections. |
| **40003:** Unable to connect to server due to invalid credentials. | Connection to the server failed due to invalid login credentials. | Ensure that the login credentials provided for the server are correct, and that WS-Management PowerShell remoting is enabled. |
| **40004:** Unable to access the IIS configuration. | No or insufficient permissions. | Confirm that the user credentials provided for the server are administrator level credentials, and that the user has permissions to access files under the IIS directory (%windir%\System32\inetsrv) and IIS server configuration directory (%windir%\System32\inetsrv\config). |
| **40005:** Unable to complete IIS discovery. | Failed to complete discovery on the VM. This may be due to issues with accessing configuration on the server. The error was: '%detailedMessage;'. | Confirm that the user credentials provided for the server are administrator level credentials, and that the user has permissions to access files under the IIS directory (%windir%\System32\inetsrv) and IIS server configuration directory (%windir%\System32\inetsrv\config). Then contact support with the error details. |
| **40006:** Uncategorized exception. | New error scenario. | Contact Microsoft support with error details and logs. Logs can be found on appliance server under the path - C:\ProgramData\Microsoft Azure\Logs. |
| **40007:** No web apps found for the web server. | Web server does not have any hosted applications. | Check the web server configuration. |

## Next steps

Set up an appliance for [VMware](how-to-set-up-appliance-vmware.md), [Hyper-V](how-to-set-up-appliance-hyper-v.md), or [physical servers](how-to-set-up-appliance-physical.md).