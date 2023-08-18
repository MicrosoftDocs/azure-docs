---
title: Troubleshoot VMware vCenter discovery failures in Azure Site Recovery 
description: This article describes how to troubleshooting VMware vCenter discovery failures in Azure Site Recovery. 
author: ankitaduttaMSFT
manager: gaggupta
ms.service: site-recovery
ms.topic: conceptual
ms.author: ankitadutta
ms.date: 05/27/2021

---
# Troubleshoot vCenter Server discovery failures

This article helps you to troubleshoot issues that occur because of VMware vCenter discovery failures.

## Non-numeric values in the maxSnapShots property

On versions prior to 9.20, vCenter disconnects when it retrieves a non-numeric value for the property  `snapshot.maxSnapShots` property on a VM.

This issue is identified by error ID 95126.

```output
ERROR :: Hit an exception while fetching the required informationfrom vCenter/vSphere.Exception details:
System.FormatException: Input string was not in a correct format.
    at System.Number.StringToNumber(String str, NumberStyles options, NumberBuffer& number, NumberFormatInfo info, Boolean parseDecimal)
    at System.Number.ParseInt32(String s, NumberStyles style, NumberFormatInfo info)
    at VMware.VSphere.Management.InfraContracts.VirtualMachineInfo.get_MaxSnapshots()
```

To resolve the issue:

- Identify the VM and set the value to a numeric value (VM Edit settings in vCenter).

Or

- Upgrade your configuration server to version 9.20 or later.

## Proxy configuration issues for vCenter connectivity

vCenter Discovery honors the System default proxy settings configured by the System user. The DRA service honors the proxy settings provided by the user during the installation of configuration server using the unified setup installer or OVA template. 

In general, the proxy is used to communicate to public networks; such as communicating with Azure. If the proxy is configured and vCenter is in a local environment, it won't be able to communicate with DRA.

The following situations occur when this issue is encountered:

- The vCenter server \<vCenter> is not reachable because of the error: The remote server returned an error: (503) Server Unavailable
- The vCenter server \<vCenter> is not reachable because of the error: The remote server returned an error: Unable to connect to the remote server.
- Unable to connect to vCenter/ESXi server.

To resolve the issue:

Download the [PsExec tool](/sysinternals/downloads/psexec). 

Use the PsExec tool to access the System user context and determine whether the proxy address is configured. You can then add vCenter to the bypass list using the following procedures.

For Discovery proxy configuration:

1. Open IE in system user context using the PsExec tool.
    
    psexec -s -i "%programfiles%\Internet Explorer\iexplore.exe"

2. Modify the proxy settings in Internet Explorer to bypass the vCenter IP address.
3. Restart the tmanssvc service.

For DRA proxy configuration:

1. Open a command prompt and open the Microsoft Azure Site Recovery Provider folder.
 
    **cd C:\Program Files\Microsoft Azure Site Recovery Provider**

3. From the command prompt, run the following command.
   
   **DRCONFIGURATOR.EXE /configure /AddBypassUrls [IP Address/FQDN of vCenter Server provided at the time of add vCenter]**

4. Restart the DRA provider service.

## Next steps

[Manage the configuration server for VMware VM disaster recovery](./vmware-azure-manage-configuration-server.md#refresh-configuration-server)