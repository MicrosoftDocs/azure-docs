---
title: Troubleshoot Azure Migrate appliance deployment and discovery
description: Get help with deploying the Azure Migrate appliance and discovering machines.
author: musa-57
ms.manager: abhemraj
ms.author: hamusa
ms.topic: troubleshooting
ms.date: 01/02/2020
---


# Troubleshoot the Azure Migrate appliance and discovery

This article helps you troubleshoot issues when deploying the [Azure Migrate](migrate-services-overview.md) appliance, and using the appliance to discover on-premises machines.


## What's supported?

[Review](migrate-appliance.md) the appliance support requirements.


## "Invalid OVF manifest entry"

If you receive the error "The provided manifest file is invalid: Invalid OVF manifest entry", do the following:

1. Verify that the Azure Migrate appliance OVA file is downloaded correctly by checking its hash value. [Learn more](https://docs.microsoft.com/azure/migrate/tutorial-assessment-vmware). If the hash value doesn't match, download the OVA file again and retry the deployment.
2. If deployment still fails, and you're using the VMware vSphere client to deploy the OVF file, try deploying it through the vSphere web client. If deployment still fails, try using a different web browser.
3. If you're using the vSphere web client and trying to deploy it on vCenter Server 6.5 or 6.7, try to deploy the OVA directly on the ESXi host:
   - Connect to the ESXi host directly (instead of vCenter Server) with the web client (https://<*host IP Address*>/ui).
   - In **Home** > **Inventory**, select **File** > **Deploy OVF template**. Browse to the OVA and complete the deployment.
4. If the deployment still fails, contact Azure Migrate support.

## Can't connect to the internet

This can happen if the appliance machine is behind a proxy.

- Make sure you provide the authorization credentials if the proxy needs them.
- If you're using a URL-based firewall proxy to control outbound connectivity, add [these URLs](migrate-appliance.md#url-access) to an allow list.
- If you're using an intercepting proxy to connect to the internet, import the proxy certificate onto the appliance VM using [these steps](https://docs.microsoft.com/azure/migrate/concepts-collector).

## Can't sign into Azure from the appliance web app

The error "Sorry, but we're having trouble signing you in" appears if you're using the incorrect Azure account to sign into Azure. This error occurs for a couple of reasons:

- If you sign into the appliance web application for the public cloud, using user account credentials for the Government cloud portal.
- If you sign into the appliance web application for the government cloud using user account credentials for the private cloud portal.

Ensure you're using the correct credentials.

##  Date/time synchronization error

An error about date and time synchronization (802) indicates that the server clock might be out of synchronization with the current time by more than five minutes. Change the clock time on the collector VM to match the current time:

1. Open an admin command prompt on the VM.
2. To check the time zone, run **w32tm /tz**.
3. To synchronize the time, run **w32tm /resync**.


## "UnableToConnectToServer"

If you get this connection error, you might be unable to connect to vCenter Server *Servername*.com:9443. The error details indicate that there's no endpoint listening at `https://\*servername*.com:9443/sdk` that can accept the message.

- Check whether you're running the latest version of the appliance. If you're not, upgrade the appliance to the [latest version](https://docs.microsoft.com/azure/migrate/concepts-collector).
- If the issue still occurs in the latest version, the appliance might be unable to resolve the specified vCenter Server name, or the specified port might be wrong. By default, if the port is not specified, the collector will try to connect to port number 443.

    1. Ping *Servername*.com from the appliance.
    2. If step 1 fails, try to connect to the vCenter server using the IP address.
    3. Identify the correct port number to connect to vCenter Server.
    4. Verify that vCenter Server is up and running.


## Error 60052/60039: Appliance might not be registered

- Error 60052, "The appliance might not be registered successfully to the Azure Migrate project" occurs if the Azure account used to register the appliance has insufficient permissions.
    - Make sure that the Azure user account used to register the appliance has at least Contributor permissions on the subscription.
    - [Learn more](https://docs.microsoft.com/azure/migrate/migrate-appliance#appliance---vmware) about required Azure roles and permissions.
- Error 60039, "The appliance might not be registered successfully to the Azure Migrate project" can occur if registration fails because the Azure Migrate project used to the register the appliance can't be found.
    - In the Azure portal and check whether the project exists in the resource group.
    - If the project doesn't exist, create a new Azure Migrate project in your resource group and register the appliance again. [Learn how to](https://docs.microsoft.com/azure/migrate/how-to-add-tool-first-time#create-a-project-and-add-a-tool) create a new project.

## Error 60030/60031: Key Vault management operation failed

If you receive the error 60030 or 60031, "An Azure Key Vault management operation failed", do the following:
- Make sure the Azure user account used to register the appliance has at least Contributor permissions on the subscription.
- Make sure the account has access to the key vault specified in the error message, and then retry the operation.
- If the issue persists, contact Microsoft support.
- [Learn more](https://docs.microsoft.com/azure/migrate/migrate-appliance#appliance---vmware) about the required Azure roles and permissions.

## Error 60028: Discovery couldn't be initiated

Error 60028: "Discovery couldn't be initiated because of an error. The operation failed for the specified list of hosts or clusters" indicates that discovery couldn't be started on the hosts listed in the error because of a problem in accessing or retrieving VM information. The rest of the hosts were successfully added.

- Add the hosts listed in the error again, using the **Add host** option.
- If there's a validation error, review the remediation guidance to fix the errors, and then try the **Save and start discovery** option again.

## Error 60025: Azure AD operation failed 
Error 60025: "An Azure AD operation failed. The error occurred while creating or updating the Azure AD application" occurs when the Azure user account used to initiate the discovery is different from the account used to register the appliance. Do one of the following:

- Ensure that the user account initiating the discovery is same as the one used to register the appliance.
- Provide Azure Active Directory application access permissions to the user account for which the discovery operation is failing.
- Delete the resource group previously created for the Azure Migrate project. Create another resource group to start again.
- [Learn more](https://docs.microsoft.com/azure/migrate/migrate-appliance#appliance---vmware) about Azure Active Directory application permissions.


## Error 50004: Can't connect to host or cluster

Error 50004: "Can't connect to a host or cluster because the server name can't be resolved. WinRM error code: 0x803381B9" might occur if the Azure DNS service for the appliance can't resolve the cluster or host name you provided.

- If you see this error on the cluster, cluster FQDN.
- You might also see this error for hosts in a cluster. This indicates that the appliance can connect to the cluster, but the cluster returns host names that aren't FQDNs. To resolve this error, update the hosts file on the appliance by adding a mapping of the IP address and host names:
    1. Open Notepad as an admin.
    2. Open the C:\Windows\System32\Drivers\etc\hosts file.
    3. Add the IP address and host name in a row. Repeat for each host or cluster where you see this error.
    4. Save and close the hosts file.
    5. Check whether the appliance can connect to the hosts, using the appliance management app. After 30 minutes, you should see the latest information for these hosts in the Azure portal.

## Discovered VMs not in portal

If discovery state is "Discovery in progress", but don't yet see the VMs in the portal, wait a few minutes:
- It takes around 15 minutes for a VMware VM .
- It takes around two minutes for each added host for Hyper-V VM discovery.

If you wait and the state doesn't change, select **Refresh** on the **Servers** tab. This should show the count of the discovered servers in Azure Migrate: Server Assessment and Azure Migrate: Server Migration.

If this doesn't work and you're discovering VMware servers:

- Verify that the vCenter account you specified has permissions set correctly, with access to at least one VM.
- Azure Migrate can't discovered VMware VMs if the vCenter account has access granted at vCenter VM folder level. [Learn more](set-discovery-scope.md) about scoping discovery.

## VM data not in portal

If discovered VMs don't appear in the portal or if the VM data is outdated, wait a few minutes. It takes up to 30 minutes for changes in discovered VM configuration data to appear in the portal. It may take a few hours for changes in application data to appear. If there's no data after this time, try refreshing, as follows

1. In **Servers** > **Azure Migrate Server Assessment**, select **Overview**.
2. Under **Manage**, select **Agent Health**.
3. Select **Refresh agent**.
4. Wait for the refresh operation to complete. You should now see up-to-date information.

## Deleted VMs appear in portal

If you delete VMs and they still appear in the portal, wait 30 minutes. If they still appear, refresh as described above.

## Error: The file uploaded is not in the expected format
Some tools have regional settings that create the CSV file with semi-colon as a delimiter. Please change the settings to ensure the delimiter is a comma.

## I imported a CSV but I see "Discovery is in progress"
This status appears if your CSV upload failed due to a validation failure. Try to import the CSV again. You can download the error report of the previous upload and follow the remediation guidance in the file to fix the errors. The error report can be downloaded from the 'Import Details' section on 'Discover machines' page.

## Do not see application details even after updating guest credentials
The application discovery runs once every 24 hours. If you would like to see the details immediately, refresh as follows. This may take a few minutes depending on the no. of VMs discovered.

1. In **Servers** > **Azure Migrate Server Assessment**, select **Overview**.
2. Under **Manage**, select **Agent Health**.
3. Select **Refresh agent**.
4. Wait for the refresh operation to complete. You should now see up-to-date information.

## Unable to export application inventory
Ensure the user downloading the inventory from the portal has Contributor privileges on the subscription.

## Common app discovery errors

Azure Migrate supports discovery of applications, roles, and features, using Azure Migrate: Server Assessment. App discovery is currently supported for VMware only. [Learn more](how-to-discover-applications.md) about the requirements and steps for setting up app discovery.

Typical app discovery errors are summarized in the table. 

**Error** | **Cause** | **Action**
--- | --- | ---
9000: VMware tool status cannot be detected.	 | 	 VMWare tools might not be installed or is corrupted.	 | 	 Ensure VMware tools is installed and running on the VM.
9001: VMware tools is not installed.	 | 	 VMWare tools might not be installed or is corrupted.	 | 	 Ensure VMware tools is installed and running on the VM.
9002: VMware tools is not running.	 | 	 VMWare tools might not be installed or is corrupted.	 | 	 Ensure VMware tools is installed and running on the VM.
9003: Operating system type not supported for guest VM discovery.	 | 	 Operating system running on the server is neither Windows nor Linux.	 | 	 Supported operating system types are Windows and Linux only. If the server is indeed Windows or Linux, check the operating system type specified in vCenter Server.
9004: VM is not running.	 | 	 VM is powered off.	 | 	 Ensure the VM is powered on.
9005: Operating system type not supported for guest VM discovery.	 | 	 Operating system type not supported for guest VM discovery.	 | 	 Supported operating system types are Windows and Linux only.
9006: The URL to download the metadata file from guest is empty.	 | 	 This could happen if the discovery agent is not working as expected.	 | 	 The issue should automatically resolve in24 hours. If the issue persists, contact Microsoft Support.
9007: Process running the discovery task in the guest VM is not found.	 | 	 This could happen if the discovery agent is not working properly.	 | 	 The issue should automatically resolve in 24 hours. If the issue persists, contact Microsoft Support.
9008: Guest VM process status cannot be retrieved.	 | 	 The issue can occur due to an internal error.	 | 	 The issue should automatically resolve in 24 hours. If the issue persists, contact Microsoft Support.
9009: Windows UAC has prevented discovery task execution on the server.	 | 	 Windows User Account Control (UAC) settings on the server are restrictive and prevent discovery of installed applications.	 | 	 In 'User Account Control' settings on the server, configure the UAC setting to be at one of the lower two levels.
9010: VM is powered off.	 | 	 VM is powered off.	 | 	 Ensure the VM is powered on.
9011: Discovered metadata file not found in guest VM file system.	 | 	 The issue can occur due to an internal error.	 | 	 The issue should automatically resolve in 24 hours. If the issue persists, contact Microsoft Support.
9012: Discovered metadata file is empty.  	 | 	 The issue can occur due to an internal error.	 | 	 The issue should automatically resolve in 24 hours. If the issue persists, contact Microsoft Support.
9013: A new temporary profile is created for every login.	 | 	 A new temporary profile is created for every login to the VMware VM.	 | 	 Contact Microsoft Support for a resolution.
9014: Unable to retrieve metadata from guest VM file system.	 | 	 No connectivity to ESXi host	 | 	 Ensure the appliance can connect to port 443 on the ESXi host running the VM
9015: Guest Operations role is not enabled on the vCenter user account	 | 	 Guest Operations role is not enabled on the vCenter user account.	 | 	 Ensure Guest Operations role is enabled on the vCenter user account.
9016: Unable to discover as guest operations agent is out of date.	 | 	 Vmware tools is not properly installed or is not up to date.	 | 	 Ensure the VMware  tools is properly installed and up to date.
9017: File with discovered metadata is not found on the VM.	 | 	 The issue can occur due to an internal error.	 | 	 Contact Microsoft Support for a resolution.
9018: PowerShell is not installed in the Guest VMs.	 | 	 PowerShell is not available in the guest VM.	 | 	 Install PowerShell in the guest VM.
9019: Unable to discover due to guest VM operation failures.	 | 	 VMware Guest operation failed on the VM.	 | 	 Ensure that the VM credentials are valid and user name provided in the guest VM credentials is in UPN format.
9020: File creation permission is denied.	 | 	 The role associated to the user or the group policy is restricting the user from creating the file in folder 	 | 	 Check if the guest user provided has create permission for the file in folder. See **Notifications** in Server Assessment for the name of the folder.
9021: Unable to create file in System Temp path.	 | 	 VMware tool reports System Temp path instead of Users Temp Path.	 | 	 Upgrade your vmware tool version above 10287 (NGC/VI Client format).
9022: Access to WMI object is denied.	 | 	 The role associated to the user or the group policy is restricting the user from accessing WMI object.	 | 	 Please contact Microsoft Support.
9023: Unable to run PowerShell as SystemRoot environment variable value is empty.	 | 	 The value of SystemRoot environment variable is empty for the guest VM.	 | 	 Contact Microsoft Support for a resolution.
9024: Unable to discover as TEMP environment variable value is empty.	 | 	 The value of TEMP environment variable is empty for the guest VM.	 | 	 Please contact Microsoft Support.
9025: PowerShell is corrupted in the Guest VMs.	 | 	 PowerShell is corrupted in the guest VM.	 | 	 Reinstall PowerShell in the guest VM and verify PowerShell can be run on the guest VM.
9026: Unable to run guest operations on the VM.	 | 	 VM state does not allow guest operations to be run on the VM.	 | 	 Contact Microsoft Support for a resolution.
9027: Guest operations agent is not running in the VM.	 | 	 Failed to contact the guest operations agent running inside the virtual machine.	 | 	 Contact Microsoft Support for a resolution.
9028: File cannot be created due to insufficient disk storage in VM.	 | 	 Not enough space on the disk.	 | 	 Ensure enough space is available in the disk storage of the VM.
9029: No access to powershell on the guest VM credential provided.	 | 	 Access to Powershell is not available for the user.	 | 	 Ensure the user added on appliance can access PowerShell on the guest VM.
9030: Unable to gather discovered metadata as ESXi host is disconnected.	 | 	 The ESXi host is in a disconnected state.	 | 	 Ensure the ESXi host running the VM is connected.
9031: Unable to gather discovered metadata as the ESXi host is not responding.	 | 	 Remote host is in Invalid state.	 | 	 Ensure the ESXi host running the VM is running and connected.
9032: Unable to discover due to an internal error.	 | 	 The issue can occur due to an internal error.	 | 	 Contact Microsoft Support for a resolution.
9033: Unable to discover as the VM username contains invalid characters.	 | 	 Invalid characters were detected in the username.	 | 	 Provide the VM credential again ensuring there are no invalid characters.
9034: Username provided is not in UPN format.	 | 	 Username is not in UPN format.	 | 	 Ensure that the username is in User Principal Name (UPN) format.
9035: Unable to discover as Powershell language mode is not set to 'Full Language'.	 | 	 Language mode for Powershell in guest VM is not set to full language.	 | 	 Ensure that PowerShell language mode is set to 'Full Language'.
10000: Operating system type is not supported.	 | 	 Operating system running on the server is neither Windows nor Linux.	 | 	 Supported operating system types are Windows and Linux only.
10001: Script for server discovery is not found on the appliance.	 | 	 Discovery is not working as expected.	 | 	 Contact Microsoft Support for a resolution.
10002: Discovery task has not completed in time.	 | 	 Discovery agent is not working as expected.	 | 	 The issue should automatically resolve in 24 hours. If the issue persists, contact Microsoft Support.
10003: Process executing the discovery task exited with an error.	 | 	 Process executing the discovery task exited with an error.	 | 	 The issue should automatically resolve in 24 hours. If the issue still persists, please contact Microsoft Support.
10004: Credential not provided for the guest operating system type.	 | 	 Credentials to access machines of this OS type were not provided in the Azure Migrate appliance.	 | 	 Add credentials for machines on the appliance
10005: Credentials provided are not valid.	 | 	 Credentials provided for appliance to access the server are incorrect.	 | 	 Update the credentials provided in the appliance and ensure that the server is accessible using the credentials.
10006: Guest OS type not supported by credential store.	 | 	 Operating system running on the server is neither Windows nor Linux.	 | 	 Supported operating system types are Windows and Linux only.
10007: Unable to process the metadata discovered.	 | 	 Error occurred while trying to deserialize the JSON.	 | 	 Contact Microsoft Support for a resolution.
10008: Unable to create a file on the server.	 |  The issue may occur due to an internal error.	 | 	 Contact Microsoft Support for a resolution.
10009: Unable to write discovered metadata to a file on the server.	 | 	 The issue can occur due to an internal error.	 | 	 Contact Microsoft Support for a resolution.




## Next steps
Set up an appliance for [VMware](how-to-set-up-appliance-vmware.md), [Hyper-V](how-to-set-up-appliance-hyper-v.md), or [physical servers](how-to-set-up-appliance-physical.md).
