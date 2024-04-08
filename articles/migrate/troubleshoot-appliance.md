---
title: Troubleshoot the Azure Migrate appliance
description: Get help to troubleshoot problems that might occur with the Azure Migrate appliance.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: troubleshooting
ms.service: azure-migrate
ms.date: 01/23/2024
ms.custom: engagement-fy23
---


# Troubleshoot the Azure Migrate appliance

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

This article helps you troubleshoot issues when you deploy the [Azure Migrate](migrate-services-overview.md) appliance and use the appliance to discover on-premises servers.

## What's supported?

[Review](migrate-appliance.md) the appliance support requirements.

## "Invalid OVF manifest entry" error occurs during appliance setup

You get the error "The provided manifest file is invalid: Invalid OVF manifest entry" when you set up an appliance by using the OVA template.

### Remediation

1. Verify that the Azure Migrate appliance OVA file is downloaded correctly by checking its hash value. [Learn more](./tutorial-discover-vmware.md). If the hash value doesn't match, download the OVA file again and retry the deployment.
1. If deployment still fails and you're using the VMware vSphere client to deploy the OVF file, try deploying it through the vSphere web client. If deployment still fails, try using a different web browser.
1. If you're using the vSphere web client and trying to deploy it on vCenter Server 6.5 or 6.7, try to deploy the OVA directly on the ESXi host:
   - Connect to the ESXi host directly (instead of vCenter Server) with the web client (https://<*host IP Address*>/ui).
   - In **Home** > **Inventory**, select **File** > **Deploy OVF template**. Browse to the OVA and complete the deployment.
1. If the deployment still fails, contact Azure Migrate support.

## Connectivity check fails during the prerequisites setup

You get an error in the connectivity check on the appliance.

### Remediation

1. Ensure that you can connect to the required [URLs](./migrate-appliance.md#url-access) from the appliance.
1. Check if there's a proxy or firewall blocking access to these URLs. If you're required to create an allowlist, make sure that you include all of the URLs.
1. If there's a proxy server configured on-premises, enter the proxy details correctly by selecting **Setup proxy** in the same step. Enter the authorization credentials if the proxy needs them.
1. Ensure that the server hasn't been previously used to set up the [replication appliance](./migrate-replication-appliance.md) or that you have the mobility service agent installed on the server.

## Connectivity check fails for the aka.ms URL during the prerequisites setup

You get an error in the connectivity check on the appliance for the aka.ms URL.

### Remediation

1. Ensure that you have connectivity to the internet and have added the URL-aka.ms/* to the allowlist to download the latest versions of the services.
1. Check if there's a proxy or firewall blocking access to this URL. Ensure that you've provided the proxy details correctly in the prerequisites step of the configuration manager.
1. Go back to the appliance configuration manager and rerun prerequisites to initiate auto-update.
1. If retry doesn't help, download the *latestcomponents.json* file from [this website](https://aka.ms/latestapplianceservices) to check the latest versions of the services that are failing. Manually update them from the download links in the file.

 If you've enabled the appliance for **private endpoint connectivity** and don't want to allow access to this URL over the internet, [disable auto-update](./migrate-appliance.md#turn-off-auto-update) because the aka.ms link is required for this service.

 >[!Note]
 >If you disable the auto-update service, the services running on the appliance won't get the latest updates automatically. To get around this situation, [update the appliance services manually](./migrate-appliance.md#manually-update-an-older-version).

## Auto-update check fails during the prerequisites setup

You get an error in the auto-update check on the appliance.

### Remediation

1. Make sure that you created an allowlist for the [required URLs](./migrate-appliance.md#url-access) and that no proxy or firewall setting is blocking them.
1. If the update of any appliance component is failing, either rerun the prerequisites or [manually update the appliance services](./migrate-appliance.md#manually-update-an-older-version).

## Time sync check fails during the prerequisites setup

An error about time synchronization indicates that the server clock might be out of synchronization with the current time by more than five minutes.

### Remediation

- Ensure that the appliance server time is synchronized with the internet time by checking the date and time settings from Control Panel.
- You can also change the clock time on the appliance server to match the current time by following these steps:
     1. Open an admin command prompt on the server.
     1. To check the time zone, run **w32tm /tz**.
     1. To synchronize the time, run **w32tm /resync**.

## VDDK check fails during the prerequisites setup on the VMware appliance

The Virtual Disk Development Kit (VDDK) check failed because the appliance couldn't find the required VDDK installed on the appliance. This issue can result in failures with ongoing replication.

### Remediation

1. Ensure that you've downloaded VDDK 6.7 and have copied its files to- **C:\Program Files\VMware\VMware Virtual Disk Development Kit** on the appliance server.
1. Ensure that no other software or application is using another version of the VDDK on the appliance.

## Project key-related error occurs during appliance registration

 You're having issues when you try to register the appliance by using the Azure Migrate project key copied from the project.

### Remediation

1. Ensure that you've copied the correct key from the project. On the **Azure Migrate: Discovery and Assessment** card in your project, select **Discover**. Then select **Manage Existing appliance** in step 1. Select the appliance name for which you previously generated a key from the dropdown menu. Copy the corresponding key.
1. Ensure that you're pasting the key to the appliance of the right **cloud type** (Public/US Gov) and **appliance type** (VMware/Hyper-V/Physical or other). Check at the top of the appliance configuration manager to confirm the cloud and scenario type.

## "Failed to connect to the Azure Migrate project" error occurs during appliance registration

After a successful sign-in with an Azure user account, the appliance registration step fails with the message, "Failed to connect to the Azure Migrate project. Check the error detail and follow the remediation steps by clicking Retry."

This issue happens when the Azure user account that was used to sign in from the appliance configuration manager is different from the user account that was used to generate the Azure Migrate project key on the portal.

### Remediation

You have two options:

- To complete the registration of the appliance, use the same Azure user account that generated the Azure Migrate project key on the portal.
- You can also assign the required roles and [permissions](./tutorial-discover-vmware.md#prepare-an-azure-user-account) to the other Azure user account being used for appliance registration.

<a name='azure-active-directory-aad-operation-failed-with-status-forbidden-error-occurs-during-appliance-registration'></a>

## "Microsoft Entra operation failed with status Forbidden" error occurs during appliance registration

You're unable to complete registration because of insufficient Microsoft Entra ID privileges and get the error "Microsoft Entra operation failed with status Forbidden."

### Remediation

Ensure that you have the [required permissions](./tutorial-discover-vmware.md#prepare-an-azure-user-account) to create and manage Microsoft Entra applications in Azure. You should have the **Application Developer** role *or* the user role with **User can register applications** allowed at the tenant level.

## "Forbidden to access Key Vault" error occurs during appliance registration

The Azure Key Vault create or update operation failed for "{KeyVaultName}" because of the error "{KeyVaultErrorMessage}."

This issue usually happens when the Azure user account used to register the appliance is different from the account used to generate the Azure Migrate project key on the portal (that is, when the key vault was created).

### Remediation

1. Ensure that the currently signed-in user account on the appliance has the required permissions on the key vault mentioned in the error message. The user account needs permissions as mentioned at [this website](./tutorial-discover-vmware.md#prepare-an-azure-user-account).
1. Go to the key vault and ensure that your user account has an access policy with all the **Key**, **Secret**, and **Certificate** permissions assigned under **Key Vault Access Policy**. [Learn more](../key-vault/general/assign-access-policy-portal.md).
1. If you enabled the appliance for **private endpoint connectivity**, ensure that the appliance is either hosted in the same virtual network where the key vault was created or it's connected to the Azure virtual network where the key vault was created over a private link. Make sure that the key vault private link is resolvable from the appliance. Go to **Azure Migrate: Discovery and assessment** > **Properties** to find the details of private endpoints for resources like the key vault created during the Azure Migrate key creation. [Learn more](./troubleshoot-network-connectivity.md).
1. If you have the required permissions and connectivity, retry the registration on the appliance after some time.

## Unable to connect to vCenter Server during validation

If you get this connection error, you might be unable to connect to vCenter Server *Servername*.com:9443. The error details indicate there's no endpoint listening at `https://\*servername*.com:9443/sdk` that can accept the message.

### Remediation

- Check whether you're running the latest version of the appliance. If you're not, upgrade the appliance to the [latest version](./migrate-appliance.md).
- If the issue still occurs in the latest version, the appliance might be unable to resolve the specified vCenter Server name, or the specified port might be wrong. By default, if the port isn't specified, the collector tries to connect to port number 443.

    1. Ping *Servername*.com from the appliance.
    1. If step 1 fails, try to connect to the vCenter server by using the IP address.
    1. Identify the correct port number to connect to the vCenter server.
    1. Verify that the vCenter server is up and running.

## Server credentials (domain) fails validation on the VMware appliance

You get "Validation failed" for domain credentials added on the VMware appliance to perform software inventory and agentless dependency analysis.

### Remediation

1. Check that you've provided the correct domain name and credentials.
1. Ensure that the domain is reachable from the appliance to validate the credentials. The appliance might be having line-of-sight issues, or the domain name might not be resolvable from the appliance server.
1. Select **Edit** to update the domain name or credentials. Select **Revalidate credentials** to validate the credentials again after some time.

## "Access is denied" error occurs when you connect to Hyper-V hosts or clusters during validation

You're unable to validate the added Hyper-V host or cluster because of the error "Access is denied."

### Remediation

1. Ensure that you've met all the [prerequisites for the Hyper-V hosts](./migrate-support-matrix-hyper-v.md#hyper-v-host-requirements). 
1. Check the steps on [this website](./tutorial-discover-hyper-v.md#prepare-hyper-v-hosts) on how to prepare the Hyper-V hosts manually or by using a provisioning PowerShell script.

## "The server does not support WS-Management Identify operations" error occurs during validation

You're unable to validate Hyper-V clusters on the appliance because of the error "The server does not support WS-Management Identify operations. Skip the TestConnection part of the request and try again."

### Remediation

This error usually occurs when you've provided a proxy configuration on the appliance. The appliance connects to the clusters by using the short name for the cluster nodes, even if you've provided the FQDN of the node. Add the short name for the cluster nodes to the bypass proxy list on the appliance, the issue gets resolved, and validation of the Hyper-V cluster succeeds.

## "Can't connect to host or cluster" error occurs during validation on a Hyper-V appliance

The error "Can't connect to a host or cluster because the server name can't be resolved. WinRM error code: 0x803381B9" might occur if the Azure DNS service for the appliance can't resolve the cluster or host name you provided.

This issue usually happens when you've added the IP address of a host that can't be resolved by DNS. You might also see this error for hosts in a cluster. It indicates that the appliance can connect to the cluster, but the cluster returns host names that aren't FQDNs.

### Remediation

To resolve this error, update the hosts file on the appliance by adding a mapping of the IP address and host names.
1. Open Notepad as an admin.
1. Open the C:\Windows\System32\Drivers\etc\hosts file.
1. Add the IP address and host name in a row. Repeat for each host or cluster where you see this error.
1. Save and close the hosts file.
1. Check whether the appliance can connect to the hosts by using the appliance management app. After 30 minutes, you should see the latest information for these hosts in the Azure portal.

## "Unable to connect to server" error occurs during validation of physical servers

### Remediation

- Ensure there's connectivity from the appliance to the target server.
- If it's a Linux server, ensure password-based authentication is enabled by following these steps:
    1. Sign in to the Linux server, and open the ssh configuration file by using the command **vi /etc/ssh/sshd_config**.
    1. Set the **PasswordAuthentication** option to yes. Save the file.
    1. Restart the ssh service by running **service sshd restart**.
- If it's a Windows server, ensure the port 5985 is open to allow for remote WMI calls.
- If you're discovering a GCP Linux server and using a root user, use the following commands to change the default setting for the root login:
    1. Sign in to the Linux server, and open the ssh configuration file by using the command **vi /etc/ssh/sshd_config**.
    1. Set the **PermitRootLogin** option to yes.
    1. Restart the ssh service by running **service sshd restart**.

## "Failed to fetch BIOS GUID" error occurs for the server during validation

The validation of a physical server fails on the appliance with the error message "Failed to fetch BIOS GUID."

### Remediation

#### [Linux servers](#tab/linux)

Connect to the target server that's failing validation. Run the following commands to see if it returns the BIOS GUID of the server:

````
cat /sys/class/dmi/id/product_uuid
dmidecode | grep -i uuid | awk '{print $2}'
````
You can also run the commands from the command prompt on the appliance server by making an SSH connection with the target Linux server by using the following command:
````
ssh <username>@<servername>
````

Few Linux machines like Oracle/CentOS have a configuration value that requires **tty** option to be enabled by default which can cause an error. In such cases, you can disable this setting by adding **a "!"** character in the **/etc/sudoers** file. You can also add the following at the end of **/etc/sudoers/** file to ensure that no other configuration in the file can override this:
- Defaults    !visiblepw 
- Defaults    !requiretty 

#### [Windows servers](#tab/windows)

Run the following code in PowerShell from the appliance server for the target server that's failing validation to see if it returns the BIOS GUID of the server:

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

When you run the preceding code, you need to provide the hostname of the target server. It can be IP address/FQDN/hostname. After that, you're prompted to provide the credentials to connect to the server.

---

## "No suitable authentication method found" error occurs for the server during validation

You get the error "No suitable authentication method found" when you try to validate a Linux server through the physical appliance.

### Remediation

Ensure password-based authentication is enabled on the Linux server by following these steps:

1. Sign in to the Linux server. Open the ssh configuration file by using the command **vi /etc/ssh/sshd_config**.
1. Set the **PasswordAuthentication** option to **yes**. Save the file.
1. Restart the ssh service by running **service sshd restart**.

## "Access is denied" error occurs when you connect to physical servers during validation

You get the error "WS-Management service cannot process the request. The WMI service returned an access denied error" when you try to validate a Windows server through the physical appliance.

### Remediation

- If you get this error, make sure that the user account provided (domain/local) on the appliance configuration manager was added to these groups: Remote Management Users, Performance Monitor Users, and Performance Log Users.
- If the Remote Management Users group isn't present, add the user account to the group WinRMRemoteWMIUsers_.
- You can also check if the WS-Management protocol is enabled on the server by running the following command in the command prompt of the target server:
  `winrm qc`
- If you're still facing the issue, make sure that the user account has access permissions to CIMV2 Namespace and sub-namespaces in the WMI Control Panel. You can set the access by following these steps:

    1. Go to the server that's failing validation on the appliance.
    1. Search and select **Run** from the **Start** menu. In the **Run** dialog, enter **wmimgmt.msc** in the **Open** text box and select **Enter**.
    1. The wmimgmt console opens where you can find **WMI Control (Local)** in the left pane. Right-click it, and select **Properties** from the menu.
    1. In the **WMI Control (Local) Properties** dialog, select the **Securities** tab.
    1. On the **Securities** tab, expand the **Root** folder in the namespace tree and select the **cimv2** namespace.
    1. Select **Security** to open the **Security for ROOT\cimv2** dialog.
    1. Under the **Group or users names** section, select **Add** to open the **Select Users, Computers, Service Accounts or Groups** dialog.
    1. Search for the user account, select it, and select **OK** to return to the **Security for ROOT\cimv2** dialog.
    1. In the **Group or users names** section, select the user account just added. Check if the following permissions are allowed:<br/>
       - Enable account <br/>
       - Remote enable
    1. Select **Apply** to enable the permissions set on the user account.

- The same steps are also applicable on a local user account for non-domain/workgroup servers. In some cases, [UAC](/windows/win32/wmisdk/user-account-control-and-wmi) filtering might block some WMI properties as the commands run as a standard user, so you can either use a local administrator account or disable UAC so that the local user account isn't filtered and instead becomes a full administrator.
- Disabling Remote UAC by changing the registry entry that controls Remote UAC isn't recommended but might be necessary in a workgroup. The registry entry is HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\system\LocalAccountTokenFilterPolicy. When the value of this entry is zero (0), Remote UAC access token filtering is enabled. When the value is 1, remote UAC is disabled.

## Appliance is disconnected

You get an "Appliance is disconnected" error message when you try to enable replication on a few VMware servers from the portal.

This error can occur if the appliance is in a shut-down state or the DRA service on the appliance can't communicate with Azure.

### Remediation

 1. Go to the appliance configuration manager, and rerun prerequisites to see the status of the DRA service under **View appliance services**. 
 1. If the service isn't running, stop and restart the service from the command prompt by using the following commands:

    ````
    net stop dra
    net start dra
    ````

## Next steps

Set up an appliance for [VMware](how-to-set-up-appliance-vmware.md), [Hyper-V](how-to-set-up-appliance-hyper-v.md), or [physical servers](how-to-set-up-appliance-physical.md).
