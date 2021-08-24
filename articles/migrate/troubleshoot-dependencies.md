---
title: Troubleshoot issues with agentless and agent-based dependency analysis
description: Get help with dependency visualization in Azure Migrate.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: troubleshooting
ms.date: 07/01/2020
---

# Troubleshoot dependency visualization

This article helps you troubleshoot issues with agent-based and agentless dependency analysis _(only available for VMware servers)_. [Learn more](concepts-dependency-visualization.md) about the types of dependency visualization supported in Azure Migrate.


## Visualize dependencies for > 1 hour with agentless dependency analysis

With agentless dependency analysis, you can visualize dependencies or export them in a map for a duration of up to 30 days.

## Visualized dependencies for > 10 servers with agentless dependency analysis

Azure Migrate offers a Power BI template that you can use to visualize network connections of many servers at once, and filter by process and server. [Learn more](how-to-create-group-machine-dependencies-agentless.md#visualize-network-connections-in-power-bi) on how to visualize the dependencies for many servers together.

## Dependencies export CSV shows "Unknown process" with agentless dependency analysis
In agentless dependency analysis, the process names are captured on a best-effort basis. In certain scenarios, although the source and destination server names and the destination port are captured, it is not feasible to determine the process names at both ends of the dependency. In such cases, the process is marked as "_Unknown process_".

## Common agentless dependency analysis errors

Azure Migrate supports agentless dependency analysis, using Azure Migrate: Discovery and assessment. agentless dependency analysis is currently supported for VMware only. [Learn more](how-to-create-group-machine-dependencies-agentless.md) about the requirements for agentless dependency analysis.

The list of agentless dependency analysis errors is summarized in the table below.

> [!Note]
> Same errors can also be encountered with software inventory as it follows the same methodology as agentless dependency analysis to collect the required data.

| **Error** | **Cause** | **Action** |
|--|--|--|
| **9000:** VMware tools status on the server cannot be detected | VMware tools might not be installed on the server or the installed version is corrupted. | Ensure that VMware tools later than version 10.2.1 is installed and running on the server. |
| **9001:** VMware tools not installed on the server. | VMware tools might not be installed on the server or the installed version is corrupted. | Ensure that VMware tools later than version 10.2.1 is installed and running on the server. |
| **9002:** VMware tools not running on the server. | VMware tools might not be installed on the server or the installed version is corrupted. | Ensure that VMware tools later than version 10.2.0 is installed and running on the server. |
| **9003:** Operation system type running on the server is not supported. | Operating system running on the server is neither Windows nor Linux. | Only Windows and Linux OS types are supported. If the server is indeed running Windows or Linux OS, check the operating system type specified in vCenter Server. |
| **9004:** Server is not a running state. | Server is in powered off state. | Ensure that the server is in a running state. |
| **9005:** Operation system type running on the server is not supported. | Operating system running on the server is neither Windows nor Linux. | Only Windows and Linux OS types are supported. \<FetchedParameter> operating system is not supported currently. |
| **9006:** The URL needed to download the discovery metadata file from the server is empty. | This could be a transient issue due to the discovery agent on the appliance not working as expected. | The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **9007:** The process that runs the script to collect the metadata is not found in the server. | This could be a transient issue due to the discovery agent on the appliance not working as expected. | The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **9008:** The status of the process running on the server to collect the metadata cannot be retrieved. | This could be a transient issue due to an internal error. | The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **9009:** Window User Account Control (UAC) is preventing the execution of discovery operations on the server. | Windows User Account Control (UAC) settings are restricting the discovery of installed applications from the server. | On the impacted server, lower the level of the 'User Account Control' settings on Control Panel. |
| **9010:** Server is powered off. | Server is in powered off state. | Ensure that the server is in a powered on state. |
| **9011:** The file containing the discovered metadata cannot be found on the server. | This could be a transient issue due to an internal error. | The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **9012:** The file containing the discovered metadata on the server is empty. | This could be a transient issue due to an internal error. | The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **9013:** A new temporary user profile is getting created on logging in the server each time. | A new temporary user profile is getting created on logging in the server each time. | Please submit a Microsoft support case to help troubleshoot this issue. |
| **9014:** Unable to retrieve the file containing the discovered metadata due to an error encountered on the ESXi host.  Error code: %ErrorCode; Details: %ErrorMessage | Encountered an error on the ESXi host \<HostName>.  Error code: %ErrorCode; Details: %ErrorMessage | Ensure that port 443 is open on the ESXi host on which the server is running.<br/><br/> [Learn more](troubleshoot-dependencies.md#error-9014-httpgetrequesttoretrievefilefailed) on how to remediate the issue.|
| **9015:** The vCenter Server user account provided for server discovery does not have Guest operations privileges enabled. | The required privileges of Guest Operations has not been enabled on the vCenter Server user account. | Ensure that the vCenter Server user account has privileges enabled for Virtual Machines > Guest Operations, in order to interact with the server and pull the required data. <br/><br/> [Learn more](tutorial-discover-vmware.md#prepare-vmware) on how to set up the vCenter Server account with required privileges. |
| **9016:** Unable to discover the metadata as the guest operations agent on the server is outdated. | Either the VMware tools is not installed on the server or the installed version is not up-to-date. | Ensure that the VMware tools is installed and running up-to-date on the server. The VMware Tools version must be version 10.2.1 or later. |
| **9017:** The file containing the discovered metadata cannot be found on the server. | This could be a transient issue due to an internal error. | Please submit a Microsoft support case to help troubleshoot this issue. |
| **9018:** PowerShell is not installed on the server. | PowerShell cannot be found on the server. | Ensure that PowerShell version 2.0 or later is installed on the server. <br/><br/> [Learn more](troubleshoot-dependencies.md#error-9018-powershellnotfound) on how to remediate the issue.|
| **9019:** Unable to discover the metadata due to guest operation failures on the server. | VMware guest operations failed on the server.The issue was encountered when trying the following credentials on the server: <FriendlyNameOfCredentials>. | Ensure that the server credentials provided on the appliance are valid and username provided in the credentials is in UPN format. (find the friendly name of the credentials tried by Azure Migrate in the possible causes) |
| **9020:** Unable to create the file required to contain the discovered metadata on the server. | The role associated to the credentials provided on the appliance or a group policy on-premises is restricting the creation of file in the required folder. The issue was encountered when trying the following credentials on the server: <FriendlyNameOfCredentials>. | 1. Check if the credentials provided on the appliance has create file permission on the folder \<folder path/folder name> in the server. <br/>2. If the credentials provided on the appliance do not have the required permissions, either provide another set of credentials or edit an existing one. (find the friendly name of the credentials tried by Azure Migrate in the possible causes) |
| **9021:** Unable to create the file required to contain the discovered metadata at right path on the server. | VMware tools is reporting an incorrect file path to create the file. | Ensure that VMware tools later than version 10.2.0 is installed and running on the server. |
| **9022:** The access is denied to run the Get-WmiObject cmdlet on the server. | The role associated to the credentials provided on the appliance or a group policy on-premises is restricting access to WMI object. The issue was encountered when trying the following credentials on the server: \<FriendlyNameOfCredentials>. | 1. Check if the credentials provided on the appliance has create file Administrator privileges and has WMI enabled. <br/> 2. If the credentials provided on the appliance do not have the required permissions, either provide another set of credentials or edit an existing one. (find the friendly name of the credentials tried by Azure Migrate in the possible causes).<br/><br/> [Learn more](troubleshoot-dependencies.md#error-9022-getwmiobjectaccessdenied) on how to remediate the issue.|
| **9023:** Unable to run PowerShell as the %SystemRoot% environment variable value is empty. | The value of %SystemRoot% environment variable is empty for the server. | 1. Check if the environment variable is returning an empty value by running echo %systemroot% command on the impacted server. <br/> 2. If issue persists, submit a Microsoft support case. |
| **9024:** Unable to perform discovery as the %TEMP% environment variable value is empty. | The value of %TEMP% environment variable is empty for the server. | 1. Check if the environment variable is returning an empty value by running echo %temp% command on the impacted server. <br/> 2. If issue persists, submit a Microsoft support case. |
| **9025:** Unable to perform discovery PowerShell is corrupted on the server. | PowerShell is corrupted on the server. | Reinstall PowerShell and verify that it is running on the impacted server. |
| **9026:** Unable to run guest operations on the server. | The current state of the server is not allowing the guest operations to be run. | 1. Ensure that the impacted server is up and running.<br/> 2. If issue persists, submit a Microsoft support case. |
| **9027:** Unable to discover the metadata as the guest operations agent is not running on the server. | Unable to contact the guest operations agent on the server. | Ensure that VMware tools later than version 10.2.0 is installed and running on the server. |
| **9028:** Unable to create the file required to contain the discovered metadata due to insufficient storage on the server. | There is lack of sufficient storage space on the server disk. | Ensure that enough space is available on disk storage of the impacted server. |
| **9029:** The credentials provided on the appliance do not have access permissions to run PowerShell. | The credentials provided on the appliance do not have access permissions to run PowerShell. The issue was encountered when trying the following credentials on the server: \<FriendlyNameOfCredentials>. | 1. Ensure that the credentials provided on the appliance can access PowerShell on the server.<br/> 2. If the credentials provided on the appliance do not have the required access, either provide another set of credentials or edit an existing one. (find the friendly name of the credentials tried by Azure Migrate in the possible causes) |
| **9030:** Unable to gather the discovered metadata as the ESXi host where the server is hosted is in a disconnected state. | The ESXi host on which server is residing is in a disconnected state. | Ensure that the ESXi host running the server is in a connected state. |
| **9031:** Unable to gather the discovered metadata as the ESXi host where the server is hosted is not responding. | The ESXi host on which server is residing is in an invalid state. | Ensure that the ESXi host running the server is in a running and connected state. |
| **9032:** Unable to discover due to an internal error. | The issue encountered is due to an internal error. | Follow the steps [here](troubleshoot-dependencies.md#error-9032-invalidrequest) to remediate the issue. If the issue persists, open a Microsoft support case. |
| **9033:** Unable to discover as the username of the credentials provided on the appliance for the server have invalid characters. | The credentials provided on the appliance contain invalid characters in the username. The issue was encountered when trying the following credentials on the server: \<FriendlyNameOfCredentials>. | Ensure that the credentials provided on the appliance do not have any invalid characters in the username. You can go back to the appliance configuration manager to edit the credentials. (find the friendly name of the credentials tried by Azure Migrate in the possible causes). |
| **9034:** Unable to discover as the username of the credentials provided on the appliance for the server is not in UPN format. | The credentials provided on the appliance do not have the username in the UPN format. The issue was encountered when trying the following credentials on the server: \<FriendlyNameOfCredentials>. | Ensure that the credentials provided on the appliance have their username in the User Principal Name (UPN) format. You can go back to the appliance configuration manager to edit the credentials. (find the friendly name of the credentials tried by Azure Migrate in the possible causes). |
| **9035:** Unable to discover as PowerShell language mode in not set correctly. | PowerShell language mode is not set to 'Full language'. | Ensure that PowerShell language mode is set to 'Full Language'. |
| **9036:** Unable to discover as the username of the credentials provided on the appliance for the server is not in UPN format. | The credentials provided on the appliance do not have the username in the UPN format. The issue was encountered when trying the following credentials on the server: \<FriendlyNameOfCredentials>. | Ensure that the credentials provided on the appliance have their username in the User Principal Name (UPN) format. You can go back to the appliance configuration manager to edit the credentials. (find the friendly name of the credentials tried by Azure Migrate in the possible causes). |
| **9037:** The metadata collection is temporarily paused due to high response time from the server. | The server is taking too long to respond. | The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **10000:** Operation system type running on the server is not supported. | Operating system running on the server is neither Windows nor Linux. | Only Windows and Linux OS types are supported. \<GuestOSName> operating system is not supported currently. |
| **10001:** The script required to gather discovery metadata is not found on the server. | The script required to perform discovery may have been deleted or removed from the expected location. | Please submit a Microsoft support case to help troubleshoot this issue. |
| **10002:** The discovery operations timed out on the server. | This could be a transient issue due to the discovery agent on the appliance not working as expected. | The issue should automatically resolve in the next cycle within 24 hours. If it isnt resolved, follow the steps [here](troubleshoot-dependencies.md#error-10002-scriptexecutiontimedoutonvm) to remediate the issue. If the issue still persists, open a Microsoft support case.|
| **10003:** The process executing the discovery operations exited with an error. | The process executing the discovery operations exited abruptly due to an error.| The issue should automatically resolve in the next cycle within 24 hours. If the issue persists, submit a Microsoft support case. |
| **10004:** Credentials not provided on the appliance for the server OS type. | The credentials for the server OS type were not added on the appliance. | 1. Ensure that you add the credentials for the OS type of the impacted server on the appliance.<br/> 2. You can now add multiple server credentials on the appliance. |
| **10005:** Credentials provided on the appliance for the server are invalid. | The credentials provided on the appliance are not valid. The issue was encountered when trying the following credentials on the server: \<FriendlyNameOfCredentials>. | 1. Ensure that the credentials provided on the appliance are valid and the server is accessible using the credentials.<br/> 2. You can now add multiple server credentials on the appliance.<br/> 3. Go back to the appliance configuration manager to either provide another set of credentials or edit an existing one. (find the friendly name of the credentials tried by Azure Migrate in the possible causes). <br/><br/> [Learn more](troubleshoot-dependencies.md#error-10005-guestcredentialnotvalid) on how to remediate the issue.|
| **10006:** Operation system type running on the server is not supported. | Operating system running on the server is neither Windows nor Linux. | Only Windows and Linux OS types are supported. \<GuestOSName> operating system is not supported currently. |
| **10007:** Unable to process the discovered metadata from the server. | An error ocuured when parsing the contents of the file containing the discovered metadata. | Please submit a Microsoft support case to help troubleshoot this issue. |
| **10008:** Unable to create the file required to contain the discovered metadata on the server. | The role associated to the credentials provided on the appliance or a group policy on-premises is restricting the creation of file in the required folder. The issue was encountered when trying the following credentials on the server: <FriendlyNameOfCredentials>. | 1. Check if the credentials provided on the appliance has create file permission on the folder \<folder path/folder name> in the server.<br/> 2. If the credentials provided on the appliance do not have the required permissions, either provide another set of credentials or edit an existing one. (find the friendly name of the credentials tried by Azure Migrate in the possible causes) |
| **10009:** Unable to write the discovered metadata in the file on the server. | The role associated to the credentials provided on the appliance or a group policy on-premises is restricting writing in the file on the server. The issue was encountered when trying the following credentials on the server: \<FriendlyNameOfCredentials>. | 1. Check if the credentials provided on the appliance has write file permission on the folder <folder path/folder name> in the server.<br/> 2. If the credentials provided on the appliance do not have the required permissions, either provide another set of credentials or edit an existing one. (find the friendly name of the credentials tried by Azure Migrate in the possible causes) |
| **10010:** Unable to discover as the command- %CommandName; required to collect some metadata is missing on the server. | The package containing the command  %CommandName; is not installed on the server. | Ensure that the package containing the command  %CommandName; is installed on the server. |
| **10011:** The credentials provided on the appliance were used to log in and log off for an interactive session. | The interactive log in and log off forces the registry keys to be unloaded in the profile of the account, being used.This condition makes the keys unavailable for future use. | Use the resolution methods documented [here](/sharepoint/troubleshoot/administration/800703fa-illegal-operation-error#resolutionus/sharepoint/troubleshoot/administration/800703fa-illegal-operation-error) |
| **10012:** Credentials have not been provided on the appliance for the server. | Either no credentials have been provided for the server or you have provided domain credentials with incorrect domain name on the appliance.[Learn more](troubleshoot-dependencies.md#error-10012-credentialnotprovided) about the cause of this error. | 1. Ensure that the credentials are provided on the appliance for the server and the server is accessible using the credentials. <br/> 2. You can now add multiple credentials on the appliance for servers.Go back to the appliance configuration manager to provide credentials for the server.|


## Error 970: DependencyMapInsufficientPrivilegesException

### Cause
The error usually comes for Linux servers when you have not provided credentials with the required privileges on the appliance.

### Remediation
- Ensure that you have either provided a root user account OR
- An account that has these permissions on /bin/netstat and /bin/ls files:
   - CAP_DAC_READ_SEARCH
   - CAP_SYS_PTRACE
- To check if the user account provided on the appliance has the required privileges, perform these steps:
1. Login in to the server where you have encountered this error with the same user account as mentioned in the error message.
2. Run the following commands in Shell. You will get errors if you don't have the required privileges for agentless dependency analysis:

   ````
   ps -o pid,cmd | grep -v ]$
   netstat -atnp | awk '{print $4,$5,$7}'
   ````
3. Set the required permissions on /bin/netstat and /bin/ls files by running the following commands:

   ````
   sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep /bin/ls
   sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep /bin/netstat
   ````
4. You can validate if the above commands assigned the required permissions to the user account or not:

   ````
   getcap /usr/bin/ls
   getcap /usr/bin/netstat
   ````
5. Rerun the commands provided in step 2 to get a successful output.


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

After installing the required PowerShell version, you can verify if the error was resolved by following steps [here](troubleshoot-dependencies.md#mitigation-verification-using-vmware-powercli).

## Error 9022: GetWMIObjectAccessDenied

### Remediation
Make sure that the user account provided in the appliance has access to WMI Namespace and subnamespaces. You can set the access by following these steps:
1.	Go to the server which is reporting this error.
2.	Search and select ‘Run’ from the Start menu. In the ‘Run’ dialog box, type wmimgmt.msc in the ‘Open:’ text field and press enter.
3.	The wmimgmt console will open where you can find “WMI Control (Local)” in the left panel. Right click on it and select ‘Properties’ from the menu.
4.	In the ‘WMI Control (Local) Properties’ dialog box, select ‘Securities’ tab.
5.	On the Securities tab, select 'Security' button which will open ‘Security for ROOT’ dialog box.
7.	Select 'Advanced' button to open 'Advanced Security Settings for Root' dialog box. 
8.	Select 'Add' button which opens the 'Permission Entry for Root' dialog box.
9.	Click on ‘Select a principal’ to open ‘Select Users, Computers, Service Accounts or Groups’ dialog box.
10.	Select the user name(s) or group(s) you want to grant access to the WMI and click 'OK'.
11. Ensure you grant execute permissions and select "This namespace and subnamespaces" in the 'Applies to:' drop-down.
12. Select 'Apply' button to save the settings and close all dialog boxes.

After getting the required access, you can verify if the error was resolved by following steps [here](troubleshoot-dependencies.md#mitigation-verification-using-vmware-powercli).

## Error 9032: InvalidRequest

### Cause
There can be multiple reasons for this issue, one of the reason is when the username provided (server credentials) on the appliance configuration manager is having invalid XML characters, which causes error in parsing the SOAP request.

### Remediation
- Make sure the username of the server credentials does not have invalid XML characters and is in username@domain.com format popularly known as UPN format.
- After editing the credentials on the appliance, you can verify if the error was resolved by following steps [here](troubleshoot-dependencies.md#mitigation-verification-using-vmware-powercli).


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
3. If commands output the result in few seconds, then you can go to the Azure Migrate project> Discovery and assessment>Overview>Manage>Appliances, select the appliance name and select **Refresh services** to restart the discovery service.
4. If the commands are timing out without giving any output, then 
- You need to figure out which process are consuming high CPU or memory on the server.
- You can try and provide more cores/memory to that server and execute the commands again.

## Error 10005: GuestCredentialNotValid

### Remediation
- Ensure the validity of credentials _(friendly name provided in the error)_ by clicking on "Revalidate credentials" on the appliance config manager.
- Ensure that you are able to login into the impacted server using the same credential provided in the appliance.
- You can try using another user account (for the same domain, in case server is domain-joined) for that server instead of Administrator account .
- The issue can happen when Global Catalog <-> Domain Controller communication is broken. You can check this by creating a new user account in the domain controller and providing the same in the appliance. This might also require restarting the Domain controller.
- After taking the remediation steps, you can verify if the error was resolved by following steps [here](troubleshoot-dependencies.md#mitigation-verification-using-vmware-powercli).

## Error 10012: CredentialNotProvided

### Cause
This error occurs when you have provided a domain credential with a wrong domain name on the appliance configuration manager. For example, if you have provided a domain credentials with username user@abc.com but provided a the domain name as def.com, those credentials will not be attempted if the server is connected to def.com and you will get this error message.

### Remediation
- Go to appliance configuration manager to add a server credential or edit an existing one as explained in the cause.
- After taking the remediation steps, you can verify if the error was resolved by following steps [here](troubleshoot-dependencies.md#mitigation-verification-using-vmware-powercli).

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
4. For agentless dependency analysis, run the following commands to see you get a successful output:

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
5. After verifying that the mitigation worked, you can go to the Azure Migrate project> Discovery and assessment>Overview>Manage>Appliances, select the appliance name and select **Refresh services** to start a fresh discovery cycle.


## My Log Analytics workspace is not listed when trying to configure the workspace in Azure Migrate for agent-based dependency analysis
Azure Migrate currently supports creation of OMS workspace in East US, Southeast Asia and West Europe regions. If the workspace is created outside of Azure Migrate in any other region, it currently cannot be associated with a project.

## Agent-based dependency visualization in Azure Government

Agent-based dependency analysis is not supported in Azure Government. Please use agentless dependency analysis _(only available for VMware servers)_.

## Agent-based dependencies don't show after agent install

After you've installed the dependency visualization agents on on-premises VMs, Azure Migrate typically takes 15-30 minutes to display the dependencies in the portal. If you've waited for more than 30 minutes, make sure that the Microsoft Monitoring Agent (MMA) can connect to the Log Analytics workspace.

For Windows VMs:
1. In the Control Panel, start MMA.
2. In the **Microsoft Monitoring Agent properties** > **Azure Log Analytics (OMS)**, make sure that the **Status** for the workspace is green.
3. If the status isn't green, try removing the workspace and adding it again to MMA.

    ![MMA status](./media/troubleshoot-assessment/mma-properties.png)

For Linux VMs, make sure that the installation commands for MMA and the dependency agent succeeded. Refer to more troubleshooting guidance [here](../azure-monitor/vm/service-map.md#post-installation-issues).

## Supported operating systems for agent-based dependency analysis

- **MMS agent**: Review the supported [Windows](../azure-monitor/agents/agents-overview.md#supported-operating-systems), and [Linux](../azure-monitor/agents/agents-overview.md#supported-operating-systems) operating systems.
- **Dependency agent**: the supported [Windows and Linux](../azure-monitor/vm/vminsights-enable-overview.md#supported-operating-systems) operating systems.

## Visualize dependencies for > 1 hour with agent-based dependency analysis

With agent-based dependency analysis, Although Azure Migrate allows you to go back to a particular date in the last month, the maximum duration for which you can visualize the dependencies is one hour. For example, you can use the time duration functionality in the dependency map to view dependencies for yesterday, but you can view them for a one-hour period only. However, you can use Azure Monitor logs to [query the dependency data](./how-to-create-group-machine-dependencies.md) over a longer duration.

## Visualized dependencies for > 10 servers with agent-based dependency analysis

In Azure Migrate, with agent-based dependency analysis, you can [visualize dependencies for groups](./how-to-create-a-group.md#refine-a-group-with-dependency-mapping) with up to 10 VMs. For larger groups, we recommend that you split the VMs into smaller groups to visualize dependencies.

## Servers show "Install agent" for agent-based dependency analysis

After migrating servers with dependency visualization enabled to Azure, servers might show "Install agent" action instead of "View dependencies" due to the following behavior:

- After migration to Azure, on-premises servers are turned off and equivalent VMs are spun up in Azure. These servers acquire a different MAC address.
- Servers might also have a different IP address, based on whether you've retained the on-premises IP address or not.
- If both MAC and IP addresses are different from on-premises, Azure Migrate doesn't associate the on-premises servers with any Service Map dependency data. In this case, it will show the option to install the agent rather than to view dependencies.
- After a test migration to Azure, on-premises servers remain turned on as expected. Equivalent servers spun up in Azure acquire different MAC address and might acquire different IP addresses. Unless you block outgoing Azure Monitor log traffic from these servers, Azure Migrate won't associate the on-premises servers with any Service Map dependency data, and thus will show the option to install agents, rather than to view dependencies.

## Capture network traffic

Collect network traffic logs as follows:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Press F12 to start Developer Tools. If needed, clear the  **Clear entries on navigation** setting.
3. Select the **Network** tab, and start capturing network traffic:
   - In Chrome, select **Preserve log**. The recording should start automatically. A red circle indicates that traffic is being captured. If the red circle doesn't appear, select the black circle to start.
   - In Microsoft Edge and Internet Explorer, recording should start automatically. If it doesn't, select the green play button.
4. Try to reproduce the error.
5. After you've encountered the error while recording, stop recording, and save a copy of the recorded activity:
   - In Chrome, right-click and select **Save as HAR with content**. This action compresses and exports the logs as a HTTP Archive (har) file.
   - In Microsoft Edge or Internet Explorer, select the **Export captured traffic** option. This action compresses and exports the log.
6. Select the **Console** tab to check for any warnings or errors. To save the console log:
   - In Chrome, right-click anywhere in the console log. Select **Save as**, to export, and zip the log.
   - In Microsoft Edge or Internet Explorer, right-click the errors and select **Copy all**.
7. Close Developer Tools.


## Next steps

[Create](how-to-create-assessment.md) or [customize](how-to-modify-assessment.md) an assessment.