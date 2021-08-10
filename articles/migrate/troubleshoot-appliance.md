---
title: Troubleshoot Azure Migrate appliance
description: Get help to troubleshoot problems that might occur with the Azure Migrate appliance.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: troubleshooting
ms.date: 07/01/2020
---


# Troubleshoot the Azure Migrate appliance

This article helps you troubleshoot issues when deploying the [Azure Migrate](migrate-services-overview.md) appliance, and using the appliance to discover on-premises servers.

## What's supported?

[Review](migrate-appliance.md) the appliance support requirements.

## "Invalid OVF manifest entry" during appliance set up

**Error**

You are getting the error "The provided manifest file is invalid: Invalid OVF manifest entry" when setting up an appliance using OVA template.

**Remediation**

1. Verify that the Azure Migrate appliance OVA file is downloaded correctly by checking its hash value. [Learn more](./tutorial-discover-vmware.md). If the hash value doesn't match, download the OVA file again and retry the deployment.
2. If deployment still fails, and you're using the VMware vSphere client to deploy the OVF file, try deploying it through the vSphere web client. If deployment still fails, try using a different web browser.
3. If you're using the vSphere web client and trying to deploy it on vCenter Server 6.5 or 6.7, try to deploy the OVA directly on the ESXi host:
   - Connect to the ESXi host directly (instead of vCenter Server) with the web client (https://<*host IP Address*>/ui).
   - In **Home** > **Inventory**, select **File** > **Deploy OVF template**. Browse to the OVA and complete the deployment.
4. If the deployment still fails, contact Azure Migrate support.

## Connectivity check failing during 'Set up prerequisites'

**Error**

You are getting an error in the connectivity check on the appliance.

**Remediation**

1. Ensure that you can connect to the required [URLs](./migrate-appliance.md#url-access) from the appliance.
1. Check if there is a proxy or firewall blocking access to these URLs. If you are required to create an allowlist, make sure that you include all of the URLs.
1. If there is a proxy server configured on-premises, make sure that you provide the proxy details correctly by selecting **Setup proxy** in the same step. Make sure that you provide the authorization credentials if the proxy needs them.
1. Ensure that the server has not been previously used to set up the [replication appliance](./migrate-replication-appliance.md) or that you have the mobility service agent installed on the server.

## Connectivity check failing for aka.ms URL during 'Set up prerequisites'

**Error**

You are getting an error in the connectivity check on the appliance for aka.ms URL.

**Remediation**

1. Ensure that you have connectivity to internet and have allowlisted the URL-aka.ms/* to download the latest versions of the services.
2. Check if there is a proxy/firewall blocking access to this URL. Ensure that you have provided the proxy details correctly in the prerequisites step of the configuration manager.
3. You can go back to the appliance configuration manager and rerun prerequisites to initiate auto-update.
3. If retry doesn't help, you can download the *latestcomponents.json* file from [here](https://aka.ms/latestapplianceservices) to check the latest versions of the services that are failing and manually update them from the download links in the file.

 If you have enabled the appliance for **private endpoint connectivity**, and don't want to allow access to this URL over internet, you can [disable auto-update](./migrate-appliance.md#turn-off-auto-update), as the aka.ms link is required for this service.

 >[!Note]
 >If you disable auto-update service, the services running on the appliance will not get the latest updates automatically. To get around this, [update the appliance services manually](./migrate-appliance.md#manually-update-an-older-version).

## Auto Update check failing during 'Set up prerequisites'

**Error**

You are getting an error in the auto update check on the appliance.

**Remediation**

1. Make sure that you created an allowlist for the [required URLs](./migrate-appliance.md#url-access) and that no proxy or firewall setting is blocking them.
1. If the update of any appliance component is failing, either rerun the prerequisites or [manually update the appliance services](./migrate-appliance.md#manually-update-an-older-version).

## Time sync check failing during 'Set up prerequisites'

**Error**

An error about time synchronization indicates that the server clock might be out of synchronization with the current time by more than five minutes.

**Remediation**

- Ensure that the appliance server time is synchronized with the internet time by checking the date and time settings from control panel.
- You can also change the clock time on the appliance server to match the current time by following these steps:
     1. Open an admin command prompt on the server.
     2. To check the time zone, run **w32tm /tz**.
     3. To synchronize the time, run **w32tm /resync**.

## VDDK check failing during 'Set up prerequisites' on VMware appliance

**Error**

The VDDK check failed as appliance could not find the required VDDK kit installed on the appliance. This can result in failures with ongoing replication.

**Remediation**

1. Ensure that you have downloaded VDDK kit 6.7 and have copied its files to- **C:\Program Files\VMware\VMware Virtual Disk Development Kit** on the appliance server.
2. Ensure that no other software or application is using another version of the VDDK Kit on the appliance.

## Getting project key related error during appliance registration

**Error** 

You are having issues when you try to register the appliance using the Azure Migrate project key copied from the project.

**Remediation**

1. Ensure that you've copied the correct key from the project: On the **Azure Migrate: Discovery and Assessment** card in your project, select **Discover**, and then select **Manage Existing appliance** in step 1. Select the appliance name (for which you previously generated a key) from the drop-down menu and copy the corresponding key.
2. Ensure that you're pasting the key to the appliance of the right **cloud type** (Public/US Gov) and **appliance type** (VMware/Hyper-V/Physical or other). Check at the top of appliance configuration manager to confirm the cloud and scenario type.

## "Failed to connect to the Azure Migrate project" during appliance registration

**Error**

After a successful login with an Azure user account, the appliance registration step fails with the message, **"Failed to connect to the Azure Migrate project. Check the error detail and follow the remediation steps by clicking Retry"**.

This issue happens when the Azure user account that was used to log in from the appliance configuration manager is different from the user account that was used to generate the Azure Migrate project key on the portal.

**Remediation**
1. To complete the registration of the appliance, use the same Azure user account that generated the Azure Migrate project key on the portal 
   OR
1. Assign the required roles and [permissions](./tutorial-discover-vmware.md#prepare-azure) to the other Azure user account being used for appliance registration

## "Azure Active Directory (AAD) operation failed with status Forbidden" during appliance registration

**Error**

You are unable to complete registration due to insufficient AAD privileges and get the error, "Azure Active Directory (AAD) operation failed with status Forbidden".

**Remediation**

Ensure that you have the [required permissions](./tutorial-discover-vmware.md#prepare-azure) to create and manage AAD Applications in Azure. You should have the **Application Developer** role OR the user role with **User can register applications** allowed at the tenant level.

## "Forbidden to access Key Vault" during appliance registration

**Error**

Azure Key Vault create or update operation failed for "{KeyVaultName}" due to the error: "{KeyVaultErrorMessage}".

This usually happens when the Azure user account that was used to register the appliance is different from the account used to generate the Azure Migrate project key on the portal (that is, when the Key vault was created).

**Remediation**

1. Ensure that the currently logged in user account on the appliance has the required permissions on the Key Vault (mentioned in the error message). The user account needs permissions as mentioned [here](./tutorial-discover-vmware.md#prepare-an-azure-user-account).
2. Go to the Key Vault and ensure that your user account has an access policy with all the _Key, Secret and Certificate_ permissions assigned under Key vault Access Policy. [Learn more](../key-vault/general/assign-access-policy-portal.md)
3. If you have enabled the appliance for **private endpoint connectivity**, ensure that the appliance is either hosted in the same VNet where the Key Vault has been created or it is connected to the Azure VNet (where Key Vault has been created) over a private link. Make sure that the Key Vault private link is resolvable from the appliance. Go to **Azure Migrate**: **Discovery** and **assessment**> **Properties** to find the details of private endpoints for resources like the Key Vault created during the Azure Migrate key creation. [Learn more](./troubleshoot-network-connectivity.md)
4. If you have the required permissions and connectivity, re-try the registration on the appliance after some time.

## Unable to connect to vCenter Server during validation

**Error**

If you get this connection error, you might be unable to connect to vCenter Server *Servername*.com:9443. The error details indicate that there's no endpoint listening at `https://\*servername*.com:9443/sdk` that can accept the message.

**Remediation**

- Check whether you're running the latest version of the appliance. If you're not, upgrade the appliance to the [latest version](./migrate-appliance.md).
- If the issue still occurs in the latest version, the appliance might be unable to resolve the specified vCenter Server name, or the specified port might be wrong. By default, if the port is not specified, the collector will try to connect to port number 443.

    1. Ping *Servername*.com from the appliance.
    2. If step 1 fails, try to connect to the vCenter server using the IP address.
    3. Identify the correct port number to connect to vCenter Server.
    4. Verify that vCenter Server is up and running.

## Server credentials (domain) failing validation on VMware appliance

**Error**

You are getting "Validation failed" for domain credentials added on VMware appliance to perform software inventory, agentless dependency analysis.

**Remediation**

1. Check that you have provided the correct domain name and credentials
1. Ensure that the domain is reachable from the appliance to validate the credentials. The appliance may be having line of sight issues or the domain name may not be resolvable from the appliance server.
1. You can select **Edit** to update the domain name or credentials, and select **Revalidate credentials** to validate the credentials again after some time

## "Access is denied" when connecting to Hyper-V hosts or clusters during validation

**Error**

You are unable to validate the added Hyper-V host/cluster due to an error-"Access is denied".

**Remediation**

1. Ensure that you have met all the [prerequisites for the Hyper-V hosts](./migrate-support-matrix-hyper-v.md#hyper-v-host-requirements). 
1. Check the steps [**here**](./tutorial-discover-hyper-v.md#prepare-hyper-v-hosts) on how to prepare the Hyper-V hosts manually or using a provisioning PowerShell script.

## "The server does not support WS-Management Identify operations" during validation

**Error**

You are not able to validate Hyper-V clusters on the appliance due to the error: "The server does not support WS-Management Identify operations. Skip the TestConnection part of the request and try again."

**Remediation**

This is usually seen when you have provided a proxy configuration on the appliance. The appliance connects to the clusters using the short name for the cluster nodes, even if you have provided the FQDN of the node. Add the short name for the cluster nodes to the bypass proxy list on the appliance, the issue gets resolved and validation of the Hyper-V cluster succeeds.

## "Can't connect to host or cluster" during validation on Hyper-V appliance

**Error**

"Can't connect to a host or cluster because the server name can't be resolved. WinRM error code: 0x803381B9" might occur if the Azure DNS service for the appliance can't resolve the cluster or host name you provided.

This usually happens when you have added the IP address of a host which cannot be resolved by DNS. You might also see this error for hosts in a cluster. This indicates that the appliance can connect to the cluster, but the cluster returns host names that are not FQDNs.

**Remediation**

To resolve this error, update the hosts file on the appliance by adding a mapping of the IP address and host names:
1. Open Notepad as an admin.
1. Open the C:\Windows\System32\Drivers\etc\hosts file.
1. Add the IP address and host name in a row. Repeat for each host or cluster where you see this error.
1. Save and close the hosts file.
1. Check whether the appliance can connect to the hosts, using the appliance management app. After 30 minutes, you should see the latest information for these hosts in the Azure portal.

## "Unable to connect to server" during validation of Physical servers

**Remediation**

- Ensure there is connectivity from the appliance to the target server.
- If it is a Linux server, ensure password-based authentication is enabled using the following steps:
    1. Log in to the linux server and open the ssh configuration file using the command 'vi /etc/ssh/sshd_config'
    2. Set "PasswordAuthentication" option to yes. Save the file.
    3. Restart ssh service by running "service sshd restart"
- If it is a Windows server, ensure the port 5985 is open to allow for remote WMI calls.
- If you are discovering a GCP Linux server and using a root user, use the following commands to change the default setting for root login
    1. Log in to the linux server and open the ssh configuration file using the command 'vi /etc/ssh/sshd_config'
    2. Set "PermitRootLogin" option to yes.
    3. Restart ssh service by running "service sshd restart"

## "Failed to fetch BIOS GUID" for server during validation

**Error**

The validation of a physical server fails on the appliance with the error message-"Failed to fetch BIOS GUID".

**Remediation**

**Linux servers:**
Connect to the target server that is failing validation and run the following commands to see if it returns the BIOS GUID of the server:
````
cat /sys/class/dmi/id/product_uuid
dmidecode | grep -i uuid | awk '{print $2}'
````
You can also run the commands from command prompt on the appliance server by making an SSH connection with the target Linux server using the following command:
````
ssh <username>@<servername>
````

**Windows servers:**
Run the following code in PowerShell from the appliance server for the target server that is failing validation to see if it returns the BIOS GUID of the server:
````
[CmdletBinding()]
Param(
  [Parameter(Mandatory=$True,Position=1)]
   [string]$Hostname
)
$HostNS = "root\cimv2"
$error.Clear()

$Cred = Get-Credential
$Session = New-CimSession -Credential $Cred -ComputerName $Hostname

if ($Session -eq $null -or $Session.TestConnection() -eq $false)
{
    Write-Host "Connection failed with $Hostname due to $error"
    exit -1
}

Write-Host "Connection established with $Hostname"
#Get-WmiObject -Query "select uuid from Win32_ComputerSystemProduct" 

$HostIntance = $Session.QueryInstances($HostNS, "WQL", "Select UUID from Win32_ComputerSystemProduct")
$HostIntance | fl *
````

On executing the code above, you need to provide the hostname of the target server which can be IP address/FQDN/hostname. After that you will be prompted to provide the credentials to connect to the server.

## "No suitable authentication method found" for server during validation

**Error**

You are getting this error when you are trying to validate a Linux server through the physical appliance- “No suitable authentication method found”.

**Remediation**

Ensure password-based authentication is enabled on the linux server using the following steps:

1. Log in to the linux server and open the ssh configuration file using the command 'vi /etc/ssh/sshd_config'
2. Set "PasswordAuthentication" option to yes. Save the file.
3. Restart ssh service by running "service sshd restart"

## "Access is denied" when connecting to physical servers during validation

**Error**

You are getting this error when you are trying to validate a Windows server through the physical appliance- “WS-Management service cannot process the request. The WMI service returned an access denied error.”

**Remediation**

- If you are getting this error, make sure that the user account provided(domain/local) on the appliance configuration manager has been added to these groups: Remote Management Users, Performance Monitor Users, and Performance Log Users.
- If Remote management Users group isn't present then add user account to the group: WinRMRemoteWMIUsers_.
- You can also check if the WS-Management protocol is enabled on the server by running following command in the command prompt of the target server.
    
    ```` winrm qc ````
- If you are still facing the issue, make sure that the user account has access permissions to CIMV2 Namespace and sub-namespaces in WMI Control Panel. You can set the access by following these steps:
    1.	Go to the server which is failing validation on the appliance
    2.	Search and select ‘Run’ from the Start menu. In the ‘Run’ dialog box, type wmimgmt.msc in the ‘Open:’ text field and press enter.
    3.	The wmimgmt console will open where you can find “WMI Control (Local)” in the left panel. Right-click on it and select ‘Properties’ from the menu.
    4.	In the ‘WMI Control (Local) Properties’ dialog box, click on ‘Securities’ tab.
    5.	On the Securities tab, expand the “Root” folder in the namespace tree and select “cimv2” namespace.
    6.	Click on ‘Security’ button that will open ‘Security for ROOT\cimv2’ dialog box.
    7.	Under ‘Group or users names’ section, click on ‘Add’ button to open ‘Select Users, Computers, Service Accounts or Groups’ dialog box.
    8.	Search for the user account, select it and click on ‘OK’ button to return to the ‘Security for ROOT\cimv2’ dialog box.
    9.	In the ‘Group or users names’ section, select the user account just added and check if the following permissions are allowed:<br/>
    Enable account <br/>
    Remote enable
    10.	Click on “Apply” to enable the permissions set on the user account.

- The same steps are also applicable on a local user account for non-domain/workgroup servers but in some cases, [UAC](/windows/win32/wmisdk/user-account-control-and-wmi) filtering may block some WMI properties as the commands run as a standard user, so you can either use a local administrator account or disable UAC so that the local user account is not filtered and instead becomes a full administrator.
- Disabling Remote UAC by changing the registry entry that controls Remote UAC is not recommended but may be necessary in a workgroup. The registry entry is HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\system\LocalAccountTokenFilterPolicy. When the value of this entry is zero (0), Remote UAC access token filtering is enabled. When the value is 1, remote UAC is disabled.

## Appliance is disconnected

**Error**

You are getting "appliance is disconnected" error message when you try to enable replication on a few VMware servers from the portal.

This can happen if the appliance is in a shut-down state or the DRA service on the appliance cannot communicate with Azure.

**Remediation**

 1. Go to the appliance configuration manager and rerun prerequisites to see the status of the DRA service under **View appliance services**. 
 1. If the service is not running, stop and restart the service from the command prompt, using following commands:

    ````
    net stop dra
    net start dra
    ````

## Next steps

Set up an appliance for [VMware](how-to-set-up-appliance-vmware.md), [Hyper-V](how-to-set-up-appliance-hyper-v.md), or [physical servers](how-to-set-up-appliance-physical.md).