---
title: Troubleshoot virtual machine provisioning in Azure Stack Edge Pro - table test GPU | Microsoft Docs 
description: Describes how to troubleshoot issues that occur when provisioning a new virtual machine in Azure Stack Edge Pro GPU. - table test
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: troubleshooting
ms.date: 05/25/2021
ms.author: alkohli
---
# Troubleshoot VM deployment in Azure Stack Edge Pro GPU - table test

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to troubleshoot common errors when deploying virtual machines on an Azure Stack Edge Pro GPU device. It explains how to collect guest logs for failed VMs, and provides guidance for investigating VM provisioning timeouts and issues with network interface creation, VM images, VM creation, and GPU VMs.  

## VM Provisioning Timeout with table

|Possible cause|Error description|Suggested resolution|
|--------------|-----------------|--------------------|
|IP assigned to the VM is already in use|The VM was assigned a static IP address that is already in use, and VM provisioning failed.|Use a static IP address that is not in use, or use a dynamic IP address provided by the DHCP server.<br>To check for a duplicate IP address:<br><ol><li>Stop the VM from the portal (if it is running).</li><li>Run the following `ping` and Test-NetConnection (`tnc`) commands:<br><ul><li>`ping <IP address>`</li><li>`tnc <IP address>`</li><li>`tnc <IP address> -CommonTCPPort “RDP”`</li></ul></ol><br>If you get a response, the IP address that you assigned to the new VM is already in use.|
|VM image not prepared correctly|To prepare a VM image for use on an Azure Stack Edge Pro GPU device, you must follow a specific workflow:<br><ol><li>Prepare the source VM from a fixed-size Windows VHD. The source VM must be a Gen1 VM.</li><li>Start the VM, and install the operating system.</li><li>Generalize the VHD using the *sysprep* utility.</li><li>Copy the generalized image to Blob storage.</li></ol><br>If any steps are left out, VM provisioning on your device will fail when you use that VM image.|Complete the workflow for preparing a VM image for use on Azure Stack Edge Pro GPU. For instructions, see one of the following articles:<br><ul><li>[Create custom VM images for your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-create-virtual-machine-image.md) (Workflow for creating a VM image)</li><li>[Prepare generalized image from Windows VHD to deploy VMs on Azure Stack Edge Pro GPU](azure-stack-edge-gpu-prepare-windows-vhd-generalized-image.md)</li><li>[Prepare generalized image from ISO to deploy VMs on Azure Stack Edge Pro GPU](azure-stack-edge-gpu-prepare-windows-generalized-image-iso.md)</li><li>[Use a specialized image to deploy VMs](azure-stack-edge-gpu-deploy-virtual-machine-portal.md)</li></ul>|
|Gateway, DNS server couldn't be reached from guest VM|If the default gateway and DNS server can't be reached during VM deployment, VM provisioning will time out, and the VM deployment will fail.|Verify that the default gateway and DNS server can be reached from the VM. Then repeat VM deployment.<br>To verify that the default gateway and DNS server can be reached, do the following steps:<br><ol><li>[Connect to the VM](azure-stack-edge-gpu-deploy-virtual-machine-portal.md#connect-to-a-vm), and open PowerShell.</li><li>Run the following **ping** commands to verify that the default gateway and DNS server can be reached from the VM:<br><ul><li>`ping <default gateway IP address>`</li><li>`ping <DNS server IP address>`</li></ul></ol>|
|`cloud init` issues (Linux VMs)|`cloud init` did not run, or there were issues while `cloud init` was running. `cloud-init` is used to customize a Linux VM when the VM boots for the first time. For more information, see [cloud-init support for virtual machines in Azure](/azure/virtual-machines/linux/using-cloud-init).|To find issues that occurred when `cloud init` was run:<br><ol><li>[Connect to the VM](azure-stack-edge-gpu-deploy-virtual-machine-portal.md#connect-to-a-vm), and open PowerShell.</li><li>Check for `cloud init` errors in the following log files:<ul><li>/var/log/cloud-init-output.log</li><li>/var/log/cloud-init.log</li><li>/var/log/waagent/log</li></ul></li></ol><br>For help resolving `cloud init` issues, see [Troubleshooting VM provisioning with cloud-init](/azure/virtual-machines/linux/cloud-init-troubleshooting).|
|Provisioning flags set incorrectly (Linux VMs)|To successfully deploy a Linux VM in Azure, provisioning must be enabled on the image, and provisioning using `cloud init' must be enabled.`|Make sure the Provisioning flags in the `/etc/waagent.conf` file have the following values:<br><ul><li>Enable instance creation: `Provisioning.Enabled=n`</li><li>Rely on cloud-init to provision: `Provisioning.UseCloudInit=y`</li></ul>|
|Contact Support for these log entries|The following errors require the help of Support.<br><ul><li>Windows VM:<ul><li>Log file: C:\Windows\Azure\Panther\WaSetup.xml</li><li>Error entries:<br>`<Event time="2021-03-26T20:08:54.648Z" category="INFO" source="WireServer"><HttpRequest verb="GET" url="http://168.63.129.16/?comp=Versions"/></Event>`
<br>`<Event time="2021-03-26T20:08:54.898Z" category="WARN" source="WireServer"><SendRequest>Received retriable HTTP client error: 8000000A for GET to http://168.63.129.16/?comp=Versions - attempt(1)</SendRequest></Event>`<br>
`<Event time="2021-03-26T20:08:54.929Z" category="ERROR" source="WireServer"><UnhandledError><Message>GetGoalState: RefreshGoalState failed with ErrNo -2147221503</Message><Number>-2147221503</Number><Description>Not initialized</Description><Source>WireServer.wsf</Source></UnhandledError></Event>`</li></ul></li><li>Linux VM:<ul><li>Log files:<ul><li>/var/log/cloud-init-output.log</li><li>/var/log/cloud-init.log</li><li>/var/log/waagent.log</li><br><li>`2021/04/02 20:55:00.899068 INFO Daemon Detect protocol endpoints`<br>
`2021/04/02 20:55:01.043511 INFO Daemon Clean protocol`<br>
`2021/04/02 20:55:01.094107 INFO Daemon WireServer endpoint is not found. Rerun dhcp handler`<br>
`2021/04/02 20:55:01.188869 INFO Daemon Test for route to 168.63.129.16`<br>
`2021/04/02 20:55:01.258709 INFO Daemon Route to 168.63.129.16 exists`<br>
`2021/04/02 20:55:01.345640 INFO Daemon Wire server endpoint:168.63.129.16`<br>
`2021/04/02 20:56:32.570904 INFO Daemon WireServer is not responding. Reset endpoint`<br>
`2021/04/02 20:56:32.606973 INFO Daemon Protocol endpoint not found: WireProtocol, [ProtocolError] [Wireserver
Exception] [HttpError] [HTTP Failed] GET http://168.63.129.16/?comp=versions -- IOError timed out -- 6 attempts made`</li></ol></li></ol>|To troubleshoot the issue:<br><ol><li>[Collect guest logs on the VM, and include them in a Support package.](./azure-stack-edge-gpu-troubleshoot-virtual-machine-provisioning.md#collect-guest-logs-for-a-failed-vm).</li><li>[Contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md)</li></ol>|


## VM Provisioning Timeout with subsections

## VM provisioning timeout

When VM provisioning times out, you see the following error:

![Portal error displayed when VM provisioning times out](./media/azure-stack-edge-gpu-troubleshoot-virtual-machine-provisioning/vm-provisioning-timeout-01.png) 

<!--1) Is it intended that the customer will work through these issues in linear fashion, from the most common cause to the less common ones? If so, should troubleshooting be set up as a series of steps? 3) To come: To make the information easier to navigate, we probably will convert this discussion to a table.-->
This section provides troubleshooting guidance for some of the most common causes of a VM provisioning timeout.


### IP assigned to the VM is already in use

**Error description:**  The VM was assigned a static IP address that is already in use, and VM provisioning failed.<!--1) Does this error apply to both portal and CLI procedures? Doesn't the portal check for duplicate IP addresses, and prevent them deploying if they have one? 2) Can issues other than an existing VM with an IP address produce this error? For example, address pool/subnet issue?-->

**Suggested solution:** Use a static IP address that is not in use, or use a dynamic IP address provided by the DHCP server.

To check for a duplicate IP address: 

1. Stop the VM from the portal (if it is running).<!--1) How can the VM be running if provisioning timed out? 2) Is there a reason why they are stopping the VM from the portal? Can they do this step, as well as the next, in PowerShell?-->

1. Run the following `ping` and Test-NetConnection (`tnc`) commands:<!--Ping from the device?-->

   ```powershell
   ping <IP address>
   tnc <IP address>
   tnc <IP address> -CommonTCPPort “RDP”
   ```

   If you get a response, the IP address that you assigned to the new VM is already in use.

### VM image not prepared correctly

**Error description:** To prepare a VM image for use on an Azure Stack Edge Pro GPU device, you must follow a specific workflow:

1. Prepare the source VM from a fixed-size Windows VHD. The source VM must be a Gen1 VM.
1. Start the VM, and install the Windows operating system.
1. Generalize the VHD using the *sysprep* utility.
1. Copy the generalized image to Blob storage.

If any steps are left out, VM provisioning on your device will fail when you use that VM image. 

**Suggested solution:** Complete the workflow for preparing a VM image for use on Azure Stack Edge Pro GPU. For instructions, see one of the following articles:

* [Create custom VM images for your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-create-virtual-machine-image.md) (Workflow for creating a VM image)
* [Prepare generalized image from Windows VHD to deploy VMs on Azure Stack Edge Pro GPU](azure-stack-edge-gpu-prepare-windows-vhd-generalized-image.md)
* [Prepare generalized image from ISO to deploy VMs on Azure Stack Edge Pro GPU](azure-stack-edge-gpu-prepare-windows-generalized-image-iso.md)
* [Use a specialized image to deploy VMs](azure-stack-edge-gpu-deploy-virtual-machine-portal.md)<!--Article not yet available?-->

### Gateway, DNS server couldn't be reached from guest VM

**Error description:** If the default gateway and DNS server can't be reached during VM deployment, VM provisioning will time out, and the VM deployment will fail.

**Suggested solution:** Verify that the default gateway and DNS server can be reached from the VM. Then repeat VM deployment.

To verify that the default gateway and DNS server can be reached, do the following steps:
1. [Connect to the VM](azure-stack-edge-gpu-deploy-virtual-machine-portal.md#connect-to-a-vm), and open PowerShell.
2. Run the following **ping** commands to verify that the default gateway and DNS server can be reached from the VM:

   ```powershell
   ping <default gateway IP address>
   ping <DNS server IP address>
   ```

### `cloud init` issues (Linux VMs)

<!--Error applies to Linux VMs only? Has the use of cloud init with Windows VMs been tested?-->

**Error description:** `cloud init` did not run, or there were issues while `cloud init` was running. `cloud-init` is used to customize a Linux VM when the VM boots for the first time. For more information, see [cloud-init support for virtual machines in Azure](/azure/virtual-machines/linux/using-cloud-init).

**Suggested solution:** To find issues that occurred when `cloud init` was run:
1. [Connect to the VM](azure-stack-edge-gpu-deploy-virtual-machine-portal.md#connect-to-a-vm), and open PowerShell.
1. Check for `cloud init` errors in the following log files:

   /var/log/cloud-init-output.log
   /var/log/cloud-init.log
   /var/log/waagent/log 

For help resolving `cloud init` issues, see [Troubleshooting VM provisioning with cloud-init](/azure/virtual-machines/linux/cloud-init-troubleshooting).

### Provisioning flags set incorrectly (Linux VMs)

**Error description:** To successfully deploy a Linux VM in Azure, provisioning must be enabled on the image, and provisioning using `cloud init' must be enabled. 

**Suggested solution:** Make sure the Provisioning flags in the `/etc/waagent.conf` file have the following values:<!--Where is this file discussed in relationship to Azure VM provisioning?-->

   | Capability                      | Required value                |
   |---------------------------------|-------------------------------|
   | Enable instance creation        | `Provisioning.Enabled=n`      |
   | Rely on cloud-init to provision | `Provisioning.UseCloudInit=y` |

### Contact Support for these log entries

If you see one of the errors highlighted (in bold) in the following log entries, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md) for help.<!--Please provide a brief explanation of the errors they are to contact support for, so readers will know what the issue is. Thanks.-->

#### Windows VM

Log file: C:\Windows\Azure\Panther\WaSetup.xml

Error entries:

![Log entries for a Windows VM that require a Support call](./media/azure-stack-edge-gpu-troubleshoot-virtual-machine-provisioning/vm-provisioning-timeout-02.png) 

<!--FORMATTING ISSUES IN MARKUP. CONVERTING TO A PNG. - `<Event time="2021-03-26T20:08:54.648Z" category="INFO" source="WireServer"><HttpRequest verb="GET" url="http://168.63.129.16/?comp=Versions"/></Event>`

`<Event time="2021-03-26T20:08:54.898Z" category="WARN" source="WireServer"><SendRequest>Received retriable HTTP client error: 8000000A for GET to http://168.63.129.16/?comp=Versions - attempt(1)</SendRequest></Event>`

`<Event time="2021-03-26T20:08:54.929Z" category="ERROR" source="WireServer"><UnhandledError><Message>GetGoalState: RefreshGoalState failed with ErrNo -2147221503</Message><Number>-2147221503</Number><Description>Not initialized</Description><Source>WireServer.wsf</Source></UnhandledError></Event>`-->

#### Linux VM

Log files: 
* /var/log/cloud-init-output.log
* /var/log/cloud-init.log
* /var/log/waagent.log

Error entries:

![Log entries for a Linux VM that require a Support call](./media/azure-stack-edge-gpu-troubleshoot-virtual-machine-provisioning/vm-provisioning-timeout-03.png) 

<!--FORMATTING ISSUES IN MARKUP. CONVERTING TO A PNG. -2021/04/02 20:55:00.899068 INFO Daemon Detect protocol endpoints

2021/04/02 20:55:01.043511 INFO Daemon Clean protocol

2021/04/02 20:55:01.094107 INFO Daemon WireServer endpoint is not found. Rerun dhcp handler

2021/04/02 20:55:01.188869 INFO Daemon Test for route to 168.63.129.16

2021/04/02 20:55:01.258709 INFO Daemon Route to 168.63.129.16 exists

2021/04/02 20:55:01.345640 INFO Daemon Wire server endpoint:168.63.129.16

2021/04/02 20:56:32.570904 INFO Daemon WireServer is not responding. Reset endpoint

2021/04/02 20:56:32.606973 INFO Daemon Protocol endpoint not found: WireProtocol, [ProtocolError] [Wireserver
Exception] [HttpError] [HTTP Failed] GET http://168.63.129.16/?comp=versions -- IOError timed out -- 6 attempts made-->

