---
title: Troubleshoot Azure Migrate appliance deployment and discovery
description: Get help with appliance deployment and server discovery.
author: vineetvikram
ms.author: vivikram
ms.manager: abhemraj
ms.topic: troubleshooting
ms.date: 01/02/2020
---


# Troubleshoot the Azure Migrate appliance and discovery

This article helps you troubleshoot issues when deploying the [Azure Migrate](migrate-services-overview.md) appliance, and using the appliance to discover on-premises servers.

## What's supported?

[Review](migrate-appliance.md) the appliance support requirements.

## "Invalid OVF manifest entry"

If you receive the error "The provided manifest file is invalid: Invalid OVF manifest entry", do the following:

1. Verify that the Azure Migrate appliance OVA file is downloaded correctly by checking its hash value. [Learn more](./tutorial-discover-vmware.md). If the hash value doesn't match, download the OVA file again and retry the deployment.
2. If deployment still fails, and you're using the VMware vSphere client to deploy the OVF file, try deploying it through the vSphere web client. If deployment still fails, try using a different web browser.
3. If you're using the vSphere web client and trying to deploy it on vCenter Server 6.5 or 6.7, try to deploy the OVA directly on the ESXi host:
   - Connect to the ESXi host directly (instead of vCenter Server) with the web client (https://<*host IP Address*>/ui).
   - In **Home** > **Inventory**, select **File** > **Deploy OVF template**. Browse to the OVA and complete the deployment.
4. If the deployment still fails, contact Azure Migrate support.

## Can't connect to the internet

This can happen if the appliance server is behind a proxy.

- Make sure you provide the authorization credentials if the proxy needs them.
- If you're using a URL-based firewall proxy to control outbound connectivity, add [these URLs](migrate-appliance.md#url-access) to an allowlist.
- If you're using an intercepting proxy to connect to the internet, import the proxy certificate onto the appliance using [these steps](./migrate-appliance.md).

## Can't sign into Azure from the appliance web app

The error "Sorry, but we're having trouble signing you in" appears if you're using the incorrect Azure account to sign into Azure. This error occurs for a couple of reasons:

- If you sign into the appliance web application for the public cloud, using user account credentials for the Government cloud portal.
- If you sign into the appliance web application for the government cloud using user account credentials for the private cloud portal.

Ensure you're using the correct credentials.

## Date/time synchronization error

An error about date and time synchronization (802) indicates that the server clock might be out of synchronization with the current time by more than five minutes. Change the clock time on the collector server to match the current time:

1. Open an admin command prompt on the server.
2. To check the time zone, run **w32tm /tz**.
3. To synchronize the time, run **w32tm /resync**.

## "UnableToConnectToServer"

If you get this connection error, you might be unable to connect to vCenter Server *Servername*.com:9443. The error details indicate that there's no endpoint listening at `https://\*servername*.com:9443/sdk` that can accept the message.

- Check whether you're running the latest version of the appliance. If you're not, upgrade the appliance to the [latest version](./migrate-appliance.md).
- If the issue still occurs in the latest version, the appliance might be unable to resolve the specified vCenter Server name, or the specified port might be wrong. By default, if the port is not specified, the collector will try to connect to port number 443.

    1. Ping *Servername*.com from the appliance.
    2. If step 1 fails, try to connect to the vCenter server using the IP address.
    3. Identify the correct port number to connect to vCenter Server.
    4. Verify that vCenter Server is up and running.

## Error 60052/60039: Appliance might not be registered

- Error 60052, "The appliance might not be registered successfully to the project" occurs if the Azure account used to register the appliance has insufficient permissions.
    - Make sure that the Azure user account used to register the appliance has at least Contributor permissions on the subscription.
    - [Learn more](./migrate-appliance.md#appliance---vmware) about required Azure roles and permissions.
- Error 60039, "The appliance might not be registered successfully to the project" can occur if registration fails because the project used to the register the appliance can't be found.
    - In the Azure portal and check whether the project exists in the resource group.
    - If the project doesn't exist, create a new project in your resource group and register the appliance again. [Learn how to](./create-manage-projects.md#create-a-project-for-the-first-time) create a new project.

## Error 60030/60031: Key Vault management operation failed

If you receive the error 60030 or 60031, "An Azure Key Vault management operation failed", do the following:

- Make sure the Azure user account used to register the appliance has at least Contributor permissions on the subscription.
- Make sure the account has access to the key vault specified in the error message, and then retry the operation.
- If the issue persists, contact Microsoft support.
- [Learn more](./migrate-appliance.md#appliance---vmware) about the required Azure roles and permissions.

## Error 60028: Discovery couldn't be initiated

Error 60028: "Discovery couldn't be initiated because of an error. The operation failed for the specified list of hosts or clusters" indicates that discovery couldn't be started on the hosts listed in the error because of a problem in accessing or retrieving server information. The rest of the hosts were successfully added.

- Add the hosts listed in the error again, using the **Add host** option.
- If there's a validation error, review the remediation guidance to fix the errors, and then try the **Save and start discovery** option again.

## Error 60025: Azure AD operation failed

Error 60025: "An Azure AD operation failed. The error occurred while creating or updating the Azure AD application" occurs when the Azure user account used to initiate the discovery is different from the account used to register the appliance. Do one of the following:

- Ensure that the user account initiating the discovery is same as the one used to register the appliance.
- Provide Azure Active Directory application access permissions to the user account for which the discovery operation is failing.
- Delete the resource group previously created for the project. Create another resource group to start again.
- [Learn more](./migrate-appliance.md#appliance---vmware) about Azure Active Directory application permissions.

## Error 50004: Can't connect to host or cluster

Error 50004: "Can't connect to a host or cluster because the server name can't be resolved. WinRM error code: 0x803381B9" might occur if the Azure DNS service for the appliance can't resolve the cluster or host name you provided.

- If you see this error on the cluster, cluster FQDN.
- You might also see this error for hosts in a cluster. This indicates that the appliance can connect to the cluster, but the cluster returns host names that aren't FQDNs. To resolve this error, update the hosts file on the appliance by adding a mapping of the IP address and host names:
    1. Open Notepad as an admin.
    2. Open the C:\Windows\System32\Drivers\etc\hosts file.
    3. Add the IP address and host name in a row. Repeat for each host or cluster where you see this error.
    4. Save and close the hosts file.
    5. Check whether the appliance can connect to the hosts, using the appliance management app. After 30 minutes, you should see the latest information for these hosts in the Azure portal.

## Error 60001: Unable to connect to server

- Ensure there is connectivity from the appliance to the server
- If it is a linux server, ensure password-based authentication is enabled using the following steps:
    1. Log in to the linux server and open the ssh configuration file using the command 'vi /etc/ssh/sshd_config'
    2. Set "PasswordAuthentication" option to yes. Save the file.
    3. Restart ssh service by running "service sshd restart"
- If it is a windows server, ensure the port 5985 is open to allow for remote WMI calls.
- If you are discovering a GCP linux server and using a root user, use the following commands to change the default setting for root login
    1. Log in to the linux server and open the ssh configuration file using the command 'vi /etc/ssh/sshd_config'
    2. Set "PermitRootLogin" option to yes.
    3. Restart ssh service by running "service sshd restart"

## Error: No suitable authentication method found

Ensure password-based authentication is enabled on the linux server using the following steps:
    1. Log in to the linux server and open the ssh configuration file using the command 'vi /etc/ssh/sshd_config'
    2. Set "PasswordAuthentication" option to yes. Save the file.
    3. Restart ssh service by running "service sshd restart"

## Discovered servers not in portal

If discovery state is "Discovery in progress", but don't yet see the servers in the portal, wait a few minutes:

- It takes around 15 minutes for a server on VMware.
- It takes around two minutes for each added host for servers on Hyper-V discovery.

If you wait and the state doesn't change, select **Refresh** on the **Servers** tab. This should show the count of the discovered servers in Azure Migrate: Discovery and assessment and Azure Migrate: Server Migration.

If this doesn't work and you're discovering VMware servers:

- Verify that the vCenter account you specified has permissions set correctly, with access to at least one server.
- Azure Migrate can't discover servers on VMware if the vCenter account has access granted at vCenter VM folder level. [Learn more](set-discovery-scope.md) about scoping discovery.

## Server data not in portal

If discovered servers don't appear in the portal or if the server data is outdated, wait a few minutes. It takes up to 30 minutes for changes in discovered server configuration data to appear in the portal. It may take a few hours for changes in software inventory data to appear. If there's no data after this time, try refreshing, as follows

1. In **Windows, Linux and SQL Servers** > **Azure Migrate: Discovery and assessment**, select **Overview**.
2. Under **Manage**, select **Agent Health**.
3. Select **Refresh agent**.
4. Wait for the refresh operation to complete. You should now see up-to-date information.

## Deleted servers appear in portal

If you delete servers and they still appear in the portal, wait 30 minutes. If they still appear, refresh as described above.

## Discovered software inventory and SQL Server instances and databases not in portal

After you have initiated discovery on the appliance, it may take up to 24 hours to start showing the inventory data in the portal.

If you have not provided Windows authentication or SQL Server authentication credentials on the appliance configuration manager, then add the credentials so that the appliance can use them to connect to respective SQL Server instances.

Once connected, appliance gathers configuration and performance data of SQL Server instances and databases. The SQL Server configuration data is updated once every 24 hours and the performance data is captured every 30 seconds. Hence any change to the properties of the SQL Server instance and databases such as database status, compatibility level etc. can take up to 24 hours to update on the portal.

## SQL Server instance is showing up in "Not connected" state on portal

To view the issues encountered during discovery of SQL Server instances and databases please click on "Not connected" status in connection status column on 'Discovered servers' page in your project.

Creating assessment on top of servers containing SQL instances that were not discovered completely or are in not connected state, may lead to readiness being marked as "unknown".

## I do not see performance data for some network adapters on my physical servers

This can happen if the physical server has Hyper-V virtualization enabled. Due to a product gap, the network throughput is captured on the virtual network adapters discovered.

## Error: The file uploaded is not in the expected format

Some tools have regional settings that create the CSV file with semi-colon as a delimiter. Please change the settings to ensure the delimiter is a comma.

## I imported a CSV but I see "Discovery is in progress"

This status appears if your CSV upload failed due to a validation failure. Try to import the CSV again. You can download the error report of the previous upload and follow the remediation guidance in the file to fix the errors. The error report can be downloaded from the 'Import Details' section on 'Discover servers' page.

## Do not see software inventory details even after updating guest credentials

The software inventory discovery runs once every 24 hours. If you would like to see the details immediately, refresh as follows. This may take a few minutes depending on the no. of servers discovered.

1. In **Windows, Linux and SQL Servers** > **Azure Migrate: Discovery and assessment**, select **Overview**.
2. Under **Manage**, select **Agent Health**.
3. Select **Refresh agent**.
4. Wait for the refresh operation to complete. You should now see up-to-date information.

## Unable to export software inventory

Ensure the user downloading the inventory from the portal has Contributor privileges on the subscription.

## No suitable authentication method found to complete authentication (publickey)

Key based authentication will not work, use password authentication.

## Common app discovery errors

Azure Migrate supports discovery of software inventory, using Azure Migrate: Discovery and assessment. App discovery is currently supported for VMware only. [Learn more](how-to-discover-applications.md) about the requirements and steps for setting up app discovery.

Typical app discovery errors are summarized in the table.

| **Error** | **Cause** | **Action** |
|--|--|--|
| 9000: VMware tool status cannot be detected. | VMware tools might not be installed or is corrupted. | Ensure VMware tools is installed and running on the server. |
| 9001: VMware tools is not installed. | VMware tools might not be installed or is corrupted. | Ensure VMware tools is installed and running on the server. |
| 9002: VMware tools is not running. | VMware tools might not be installed or is corrupted. | Ensure VMware tools is installed and running on the server. |
| 9003: Operating system type not supported for guest server discovery. | Operating system running on the server is neither Windows nor Linux. | Supported operating system types are Windows and Linux only. If the server is indeed Windows or Linux, check the operating system type specified in vCenter Server. |
| 9004: Server is not running. | Server is powered off. | Ensure the server is powered on. |
| 9005: Operating system type not supported for guest server discovery. | Operating system type not supported for guest server discovery. | Supported operating system types are Windows and Linux only. |
| 9006: The URL to download the metadata file from guest is empty. | This could happen if the discovery agent is not working as expected. | The issue should automatically resolve in24 hours. If the issue persists, contact Microsoft Support. |
| 9007: Process running the discovery task in the guest server is not found. | This could happen if the discovery agent is not working properly. | The issue should automatically resolve in 24 hours. If the issue persists, contact Microsoft Support. |
| 9008: Guest server process status cannot be retrieved. | The issue can occur due to an internal error. | The issue should automatically resolve in 24 hours. If the issue persists, contact Microsoft Support. |
| 9009: Windows UAC has prevented discovery task execution on the server. | Windows User Account Control (UAC) settings on the server are restrictive and prevent discovery of installed software inventory. | In 'User Account Control' settings on the server, configure the UAC setting to be at one of the lower two levels. |
| 9010: Server is powered off. | Server is powered off. | Ensure the server is powered on. |
| 9011: Discovered metadata file not found in guest server file system. | The issue can occur due to an internal error. | The issue should automatically resolve in 24 hours. If the issue persists, contact Microsoft Support. |
| 9012: Discovered metadata file is empty. | The issue can occur due to an internal error. | The issue should automatically resolve in 24 hours. If the issue persists, contact Microsoft Support. |
| 9013: A new temporary profile is created for every login. | A new temporary profile is created for every login to the server on VMware. | Contact Microsoft Support for a resolution. |
| 9014: Unable to retrieve metadata from guest server file system. | No connectivity to ESXi host | Ensure the appliance can connect to port 443 on the ESXi host running the server |
| 9015: Guest Operations role is not enabled on the vCenter user account | Guest Operations role is not enabled on the vCenter user account. | Ensure Guest Operations role is enabled on the vCenter user account. |
| 9016: Unable to discover as guest operations agent is out of date. | VMware tools is not properly installed or is not up to date. | Ensure the VMware  tools is properly installed and up to date. |
| 9017: File with discovered metadata is not found on the server. | The issue can occur due to an internal error. | Contact Microsoft Support for a resolution. |
| 9018: PowerShell is not installed in the Guest servers. | PowerShell is not available in the guest server. | Install PowerShell in the guest server. |
| 9019: Unable to discover due to guest server operation failures. | VMware Guest operation failed on the server. | Ensure that the server credentials are valid and user name provided in the guest server credentials is in UPN format. |
| 9020: File creation permission is denied. | The role associated to the user or the group policy is restricting the user from creating the file in folder | Check if the guest user provided has create permission for the file in folder. See **Notifications** in Azure Migrate: Discovery and assessment for the name of the folder. |
| 9021: Unable to create file in System Temp path. | VMware tool reports System Temp path instead of Users Temp Path. | Upgrade your VMware tool version above 10287 (NGC/VI Client format). |
| 9022: Access to WMI object is denied. | The role associated to the user or the group policy is restricting the user from accessing WMI object. | Please contact Microsoft Support. |
| 9023: Unable to run PowerShell as SystemRoot environment variable value is empty. | The value of SystemRoot environment variable is empty for the guest server. | Contact Microsoft Support for a resolution. |
| 9024: Unable to discover as TEMP environment variable value is empty. | The value of TEMP environment variable is empty for the guest server. | Please contact Microsoft Support. |
| 9025: PowerShell is corrupted in the guest servers. | PowerShell is corrupted in the guest server. | Reinstall PowerShell in the guest server and verify PowerShell can be run on the guest server. |
| 9026: Unable to run guest operations on the server. | Server state does not allow guest operations to be run on the server. | Contact Microsoft Support for a resolution. |
| 9027: Guest operations agent is not running in the server. | Failed to contact the guest operations agent running inside the virtual server. | Contact Microsoft Support for a resolution. |
| 9028: File cannot be created due to insufficient disk storage in server. | Not enough space on the disk. | Ensure enough space is available in the disk storage of the server. |
| 9029: No access to PowerShell on the guest server credential provided. | Access to PowerShell is not available for the user. | Ensure the user added on appliance can access PowerShell on the guest server. |
| 9030: Unable to gather discovered metadata as ESXi host is disconnected. | The ESXi host is in a disconnected state. | Ensure the ESXi host running the server is connected. |
| 9031: Unable to gather discovered metadata as the ESXi host is not responding. | Remote host is in Invalid state. | Ensure the ESXi host running the server is running and connected. |
| 9032: Unable to discover due to an internal error. | The issue can occur due to an internal error. | Contact Microsoft Support for a resolution. |
| 9033: Unable to discover as the server username contains invalid characters. | Invalid characters were detected in the username. | Provide the server credential again ensuring there are no invalid characters. |
| 9034: Username provided is not in UPN format. | Username is not in UPN format. | Ensure that the username is in User Principal Name (UPN) format. |
| 9035: Unable to discover as PowerShell language mode is not set to 'Full Language'. | Language mode for PowerShell in guest server is not set to full language. | Ensure that PowerShell language mode is set to 'Full Language'. |
| 9037: Data collection paused temporarily as server response time is too high. | The discovered server is taking too long to respond | No action required. A retry will be attempted in 24 hours for software inventory discovery and 3 hours for dependency analysis (agentless). |
| 10000: Operating system type is not supported. | Operating system running on the server is neither Windows nor Linux. | Supported operating system types are Windows and Linux only. |
| 10001: Script for server discovery is not found on the appliance. | Discovery is not working as expected. | Contact Microsoft Support for a resolution. |
| 10002: Discovery task has not completed in time. | Discovery agent is not working as expected. | The issue should automatically resolve in 24 hours. If the issue persists, contact Microsoft Support. |
| 10003: Process executing the discovery task exited with an error. | Process executing the discovery task exited with an error. | The issue should automatically resolve in 24 hours. If the issue still persists, please contact Microsoft Support. |
| 10004: Credential not provided for the guest operating system type. | Credentials to access servers of this OS type were not provided in the Azure Migrate appliance. | Add credentials for servers on the appliance |
| 10005: Credentials provided are not valid. | Credentials provided for appliance to access the server are incorrect. | Update the credentials provided in the appliance and ensure that the server is accessible using the credentials. |
| 10006: Guest OS type not supported by credential store. | Operating system running on the server is neither Windows nor Linux. | Supported operating system types are Windows and Linux only. |
| 10007: Unable to process the metadata discovered. | Error occurred while trying to deserialize the JSON. | Contact Microsoft Support for a resolution. |
| 10008: Unable to create a file on the server. | The issue may occur due to an internal error. | Contact Microsoft Support for a resolution. |
| 10009: Unable to write discovered metadata to a file on the server. | The issue can occur due to an internal error. | Contact Microsoft Support for a resolution. |

## Next steps

Set up an appliance for [VMware](how-to-set-up-appliance-vmware.md), [Hyper-V](how-to-set-up-appliance-hyper-v.md), or [physical servers](how-to-set-up-appliance-physical.md).
