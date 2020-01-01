---
title: Troubleshoot Azure Migrate appliance deployment
description: Get help with deploying the Azure Migrate appliance.
ms.topic: troubleshooting
ms.date: 11/21/2019
---

# Troubleshoot the Azure Migrate appliance

This article helps you troubleshoot issues when deploying the [Azure Migrate](migrate-services-overview.md) appliance.


## What's supported?

[Review](migrate-appliance.md) the appliance support requirements.


## Error "Invalid OVF manifest entry"

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
- If you're using a URL-based firewall proxy to control outbound connectivity, add these URLs to an allow list:

    - [URLs for VMware assessment](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-vmware#assessment-url-access-requirements)
    - [URLs for Hyper-V assessment](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-hyper-v#assessment-appliance-url-access)
    - [URLs for VMware agentless migration](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-vmware#agentless-migration-url-access-requirements)
    - [URLS for VMware agent-based migration](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-vmware#replication-appliance-url-access)
    - [URLs for Hyper-V migration](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-hyper-v#migration-hyper-v-host-url-access)

- If you're using an intercepting proxy to connect to the internet, import the proxy certificate onto the appliance VM using [these steps](https://docs.microsoft.com/azure/migrate/concepts-collector).

## Error: Date/time synchronization

An error about date and time synchronization (802) indicates that the server clock might be out of synchronization with the current time by more than five minutes. Change the clock time on the collector VM to match the current time:

1. Open an admin command prompt on the VM.
2. To check the time zone, run **w32tm /tz**.
3. To synchronize the time, run **w32tm /resync**.


## Error: UnableToConnectToServer

If you get this connection error, you might be unable to connect to vCenter Server *Servername*.com:9443. The error details indicate that there's no endpoint listening at https://*servername*.com:9443/sdk that can accept the message.

- Check whether you're running the latest version of the appliance. If you're not, upgrade the appliance to the [latest version](https://docs.microsoft.com/azure/migrate/concepts-collector).
- If the issue still occurs in the latest version, the appliance might be unable to resolve the specified vCenter Server name, or the specified port might be wrong. By default, if the port is not specified, the collector will try to connect to port number 443.

    1. Ping *Servername*.com from the appliance.
    2. If step 1 fails, try to connect to the vCenter server using the IP address.
    3. Identify the correct port number to connect to vCenter Server.
    4. Verify that vCenter Server is up and running.


## Error: Appliance might not be registered

- Error 60052, "The appliance might not be registered successfully to the Azure Migrate project" occurs if the Azure account used to register the appliance has insufficient permissions.
    - Make sure that the Azure user account used to register the appliance has at least Contributor permissions on the subscription.
    - [Learn more](https://docs.microsoft.com/azure/migrate/migrate-appliance#appliance-deployment-requirements) about required Azure roles and permissions.
- Error 60039, "The appliance might not be registered successfully to the Azure Migrate project" can occur if registration fails because the Azure Migrate project used to the register the appliance can't be found.
    - In the Azure portal and check whether the project exists in the resource group.
    - If the project doesn't exist, create a new Azure Migrate project in your resource group and register the appliance again. [Learn how to](https://docs.microsoft.com/azure/migrate/how-to-add-tool-first-time#create-a-project-and-add-a-tool) create a new project.

## Error: Key Vault management operation failed

If you receive the error 60030 or 60031, "An Azure Key Vault management operation failed", do the following:
- Make sure the Azure user account used to register the appliance has at least Contributor permissions on the subscription.
- Make sure the account has access to the key vault specified in the error message, and then retry the operation.
- If the issue persists, contact Microsoft support.
- [Learn more](https://docs.microsoft.com/azure/migrate/migrate-appliance#appliance-deployment-requirements) about the required Azure roles and permissions.

## Error: Discovery couldn't be initiated

Error 60028: "Discovery couldn't be initiated because of an error. The operation failed for the specified list of hosts or clusters" indicates that discovery couldn't be started on the hosts listed in the error because of a problem in accessing or retrieving VM information. The rest of the hosts were successfully added.

- Add the hosts listed in the error again, using the **Add host** option.
- If there's a validation error, review the remediation guidance to fix the errors, and then try the **Save and start discovery** option again.

## Error: Azure AD operation failed (60025)

Error 60025: "An Azure AD operation failed. The error occurred while creating or updating the Azure AD application" occurs when the Azure user account used to initiate the discovery is different from the account used to register the appliance. Do one of the following:

- Ensure that the user account initiating the discovery is same as the one used to register the appliance.
- Provide Azure Active Directory application access permissions to the user account for which the discovery operation is failing.
- Delete the resource group previously created for the Azure Migrate project. Create another resource group to start again.
- [Learn more](https://docs.microsoft.com/azure/migrate/migrate-appliance#appliance-deployment-requirements) about Azure Active Directory application permissions.



## Error: Can't connect to host or cluster

Error 50004: "Can't connect to a host or cluster because the server name can't be resolved. WinRM error code: 0x803381B9" might occur if the Azure DNS service for the appliance can't resolve the cluster or host name you provided.

- If you see this error on the cluster, cluster FQDN.
- You might also see this error for hosts in a cluster. This indicates that the appliance can connect to the cluster, but the cluster returns host names that aren't FQDNs. To resolve this error, update the hosts file on the appliance by adding a mapping of the IP address and host names:
    1. Open Notepad as an admin.
    2. Open the C:\Windows\System32\Drivers\etc\hosts file.
    3. Add the IP address and host name in a row. Repeat for each host or cluster where you see this error.
    4. Save and close the hosts file.
    5. Check whether the appliance can connect to the hosts, using the appliance management app. After 30 minutes, you should see the latest information for these hosts in the Azure portal.

## Next steps
Set up an appliance for [VMware](how-to-set-up-appliance-vmware.md), [Hyper-V](how-to-set-up-appliance-hyper-v.md), or [physical servers](how-to-set-up-appliance-physical.md).