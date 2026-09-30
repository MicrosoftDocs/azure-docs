---
title: Troubleshoot VMware vCenter Discovery Failures in Azure Site Recovery
ms.reviewer: v-gajeronika
description: This article describes how to troubleshoot VMware vCenter discovery failures in Azure Site Recovery.
ms.service: azure-site-recovery
ms.topic: troubleshooting
ms.date: 12/09/2025
author: Jeronika-MS
ms.author: v-gajeronika 

# Customer intent: As a system administrator troubleshooting VMware vCenter discovery failures, I want to understand the common issues and resolutions so that I can ensure seamless connectivity and operation of Azure Site Recovery.
---
# Troubleshoot vCenter Server discovery failures

This article helps you to troubleshoot issues that occur because of VMware vCenter discovery failures.

## Non-numeric values in the maxSnapShots property

On versions earlier than 9.20, vCenter disconnects when it retrieves a non-numeric value for the `snapshot.maxSnapShots` property on a virtual machine (VM).

The error ID 95126 identifies this issue.

```output
ERROR :: Hit an exception while fetching the required informationfrom vCenter/vSphere.Exception details:
System.FormatException: Input string was not in a correct format.
    at System.Number.StringToNumber(String str, NumberStyles options, NumberBuffer& number, NumberFormatInfo info, Boolean parseDecimal)
    at System.Number.ParseInt32(String s, NumberStyles style, NumberFormatInfo info)
    at VMware.VSphere.Management.InfraContracts.VirtualMachineInfo.get_MaxSnapshots()
```

To resolve the issue, you have two options:

- Identify the VM and set the value to a numeric value. (Use the VM edit settings in vCenter.)
- Upgrade your configuration server to version 9.20 or later.

## Proxy configuration issues for vCenter connectivity

vCenter discovery honors the system default proxy settings configured by the system user. The disaster recovery architecture (DRA) service honors the proxy settings that you provided during the installation of the configuration server. You can use the Unified Setup installer or the Open Virtual Appliance template for installation.

In general, the proxy is used to communicate to public networks, such as communicating with Azure. If the proxy is configured and vCenter is in a local environment, it can't communicate with DRA.

The following situations occur when this issue is encountered:

- The vCenter server \<vCenter> isn't reachable because of the following error: "The remote server returned an error: (503) Server Unavailable."
- The vCenter server \<vCenter> isn't reachable because of the following error: "The remote server returned an error: Unable to connect to the remote server."
- The proxy is unable to connect to the vCenter/ESXi server.

To resolve the issue, download the [PsExec tool](/sysinternals/downloads/psexec).

Use the `PsExec` tool to access the system user context and determine whether the proxy address is configured. You can then add vCenter to the bypass list by using the following procedures.

For discovery proxy configuration:

1. Open Internet Explorer in system user context by using the `PsExec` tool:

    `psexec -s -i "%programfiles%\Internet Explorer\iexplore.exe"`

1. Modify the proxy settings in Internet Explorer to bypass the vCenter IP address.
1. Restart the `tmanssvc` service.

For DRA proxy configuration:

1. Open a command prompt and open the Microsoft Azure Site Recovery Provider folder:
 
    `cd C:\Program Files\Microsoft Azure Site Recovery Provider`

1. From the command prompt, run the following command:

   `DRCONFIGURATOR.EXE /configure /AddBypassUrls [IP Address/FQDN of vCenter Server provided at the time of add vCenter]`

1. Restart the DRA provider service.

## Related content

- [Manage the configuration server for VMware VM disaster recovery](./vmware-azure-manage-configuration-server.md#refresh-configuration-server)
