---
title: Troubleshoot virtual machine provisioning in Azure Stack Edge Pro GPU | Microsoft Docs 
description: Describes how to troubleshoot issues that occur when provisioning a new virtual machine in Azure Stack Edge Pro GPU.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: troubleshooting
ms.date: 05/24/2021
ms.author: alkohli
---
# Troubleshoot VM deployment in Azure Stack Edge Pro GPU

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to troubleshoot common errors when deploying virtual machines on an Azure Stack Edge Pro GPU device. It explains how to collect guest logs for failed VMs, and provides guidance for investigating VM provisioning timeouts and issues with network interface creation, VM images, VM creation, and GPU VMs.  

## Collect guest logs for a failed VM

To diagnose any VM provisioning failure, you'll review guest logs on the failed virtual machine.

To collect the guest logs, you'll need to connect to the VM console on the virtual machine. You can connect to the console even if provisioning of the VM failed.

To collect guest logs for failed virtual machines, do these steps:

1. [Connect to the PowerShell interface of your device](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface).

2. Collect in-guest logs for failed VMs, and include these logs in a support package, by running the following commands:

   ```powershell
   Get-VMInGuestLogs -FailedVM
   Get-HcsNodeSupportPackage -Path “\\<network path>” -Include InGuestVMLogFiles -Credential “domain_name\user”
   ```

   You'll find the logs in the `hcslogs\VmGuestLogs` folder.

3. To get VM provisioning history details, review the following logs:

   **Linux VMs:**
   /var/log/cloud-init-output.log
   /var/log/cloud-init.log
   /var/log/waagent.log

   **Windows VMs:**
   C:\Windows\Azure\Panther\WaSetup.xml<!--The Windows log is an outlier. Is it included in the support package?-->


## Troubleshoot VM deployment issues

The following sections provide common causes for the following issues, which occur during VM deployment on an Azure Stack Edge Pro GPU device:
 
* [VM provisioning timeout](#vm-provisioning-timeout)
* [Network interface creation issues](#network-interface-creation-issues)
* [VM image issues](#vm-image-issues)
* [VM creation issues](#vm-creation-issues)
* [GPU extension failed to be deployed (GPU VMs)](#gpu-extension-failed-to-be-deployed)

## VM provisioning timeout

When VM provisioning times out, you see the following error:

![Portal error displayed when VM provisioning times out](./media/azure-stack-edge-gpu-troubleshoot-virtual-machine-provisioning/vm-provisioning-timeout-01.png) 

<!--ASK: What did they intend? Is this something where they check the first issue, then the second (numbered steps?-->
This section provides troubleshooting guidance for some of the most common causes of aVM provisioning timeout:

* Static IP address assigned to the VM is already in use<!--Add section link-->
* VM image not prepared correctly
* Gateway and DNS server can't be reached from the VM<!--Bullets 3-5 are less common issues that were lumped together as "other issues." They are less common. >
* `cloud init` issues (Linux VMs)
* Provisioning flags set incorrectly (Linux VMs)
* Issues that require Support


### IP assigned to the VM is already in use

**Error description:**  If you assign ??????

ned a static IP address during virtual machine creation, and the IP address is already in use, VM provisioning will fail.<!--Is this error applicable to everything except the portal? The portal is -->

**Suggested solution:** Use a static IP address that is not in use, or use a dynamic IP address provided by the DHCP server.

To check for a duplicate IP address: 

1. Stop the VM from the portal (if it is running).<!--Ask Niharika: 1) Does this error apply to both portal and CLI procedures? Doesn't the portal check for duplicate IP addresses, and prevent them deploying if they have one? 2) How can the VM be running if provisioning just timed out. 3) Can issues other than an existing VM with an IP address produce this error? For example, address pool or subnet issue? 3) Why do they do this step from the portal" Next step is performed in PowerShell. PowerShell command OK for this step also?-->

1. Run the following `ping` and Test-NetConnection (`tnc`) commands:<!--Pinging from the device, not the VM.-->

   ```powershell
   ping <IP address>
   tnc <IP address>
   tnc <IP address> -CommonTCPPort “RDP”
   ```
  <!--If this moves to a table, just apply code formatting. Code block's not helpful; they won't cut & paste.-->
   If you get a response to any of these commands, the IP address that you assigned the new VM is already in use.

### VM image not prepared correctly

**Error description:** To prepare a VM image to use to deploy VMs on an Azure Stack Edge Pro GPU device, you must follow a specific workflow. You must create a virtual machine (VM) in Azure, customize the VM, and then generalize the VM. Then you'll download the VHD for that VM.<!--1) Convert to bullets for process visibility. 2) Final step is to upload the image to an Azure Storage account?-->

**Suggested solution:** Complete the workflow for preparing a VM image for use on Azure Stack Edge Pro GPU. For instructions, see one of the following articles. The procedures will vary depending on the type of source VHD and whether you're creating a generalized image (to deploy new VMs) or a specialized image (to migrate or restore an existing VM).

* [Create custom VM images for your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-create-virtual-machine-image.md) (Workflow for creating a VM image)
* [Prepare generalized image from Windows VHD to deploy VMs on Azure Stack Edge Pro GPU](azure-stack-edge-gpu-prepare-windows-vhd-generalized-image.md)
* [Prepare generalized image from ISO to deploy VMs on Azure Stack Edge Pro GPU](azure-stack-edge-gpu-prepare-windows-generalized-image-iso.md)
* [Use a specialized image to deploy VMs](azure-stack-edge-gpu-deploy-virtual-machine-portal.md)<!--Article not yet available?-->

### Gateway, DNS server couldn't be reached from guest VM

**Error description:** If the default gateway and DNS server can't be reached during VM deployment, VM provisioning will time out, and the VM deployment will fail.

**Suggested solution:** Verify that the default gateway and DNS server can be reached from the VM. Then repeat VM deployment.

To verify that the default gateway and DNS server can be reached:
1. [Connect to the VV console](CONNECT TO VM link). <!--Substitute a "Connect to the VM, and open PowerShell.-->
2. Run the following **ping** commands to verify that the default gateway and DNS server can be reached from the VM:

   ```powershell
   ping <default gateway IP address>
   ping <DNS server IP address>
   ```

### `cloud init` issues (Linux VMs)

<!--Questions: Source identifies this as a Linux BM issue, but cloud init also can be used to provision Windows VMs. Verify this has been tested.-->

**Error description:** `cloud init` did not run, or there were issues while `cloud init` was running. `cloud-init` is used to customize a Linux VM when the VM boots for the first time. <!--Link to the cloud init overview, Azure local.-->

**Suggested solution:** To find issues that occurred when `cloud init` was run:
1. Console connect to the VM.
1. Check for `cloud init` errors in the following log files:

   /var/log/cloud-init-output.log
   /var/log/cloud-init.log
   /var/log/waagent/log 

For help resolving `cloud init` issues, see [Troubleshooting VM provisioning with cloud-init](/azure/virtual-machines/linux/cloud-init-troubleshooting).

### Provisioning flags set incorrectly (Linux VMs)

**Error description:** To successfully deploy a Linux VM in Azure, provisioning must be enabled on the image, and provisioning using `cloud init' must be enabled. 

**Suggested solution:** Make sure the Provisioning flags in the `/etc/waagent.conf` file have the following values:<!--Where is this file discussed in Azure VM provisioning?-->

   | Capability                      | Required value                |
   |---------------------------------|-------------------------------|
   | Enable instance creation        | `Provisioning.Enabled=n`      |
   | Rely on cloud-init to provision | `Provisioning.UseCloudInit=y` |

### Contact Support for these log entries

If you see the following log entries, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md) for help.<!--Please verify: The issue is the entry, not the existence of the log itself?-->

#### Windows VM

<!--Code samples are working against the reader. Pull out the specific error. Don't use a code block.--> 
File: C:\Windows\Azure\Panther\WaSetup.xml

```output
<Event time="2021-03-26T20:08:54.648Z" category="INFO" source="WireServer"><HttpRequest verb="GET" url="http://168.63.129.16/?comp=Versions"/></Event>
<Event time="2021-03-26T20:08:54.898Z" category="WARN" source="WireServer"><SendRequest>Received retriable HTTP client error: 8000000A for GET to http://168.63.129.16/?comp=Versions - attempt(1)</SendRequest></Event>
<Event time="2021-03-26T20:08:54.929Z" category="ERROR" source="WireServer"><UnhandledError><Message>GetGoalState: RefreshGoalState failed with ErrNo -2147221503</Message><Number>-2147221503</Number><Description>Not initialized</Description><Source>WireServer.wsf</Source></UnhandledError></Event>
```

#### Linux VM

Files: 
* /var/log/cloud-init-output.log
* /var/log/cloud-init.log
* /var/log/waagent.log

```output
2021/04/02 20:55:00.899068 INFO Daemon Detect protocol endpoints
2021/04/02 20:55:01.043511 INFO Daemon Clean protocol
2021/04/02 20:55:01.094107 INFO Daemon WireServer endpoint is not found. Rerun dhcp handler
2021/04/02 20:55:01.188869 INFO Daemon Test for route to 168.63.129.16
2021/04/02 20:55:01.258709 INFO Daemon Route to 168.63.129.16 exists
2021/04/02 20:55:01.345640 INFO Daemon Wire server endpoint:168.63.129.16
2021/04/02 20:56:32.570904 INFO Daemon WireServer is not responding. Reset endpoint
2021/04/02 20:56:32.606973 INFO Daemon Protocol endpoint not found: WireProtocol, [ProtocolError] [Wireserver Exception] [HttpError] [HTTP Failed] GET http://168.63.129.16/?comp=versions -- IOError timed out -- 6 attempts made
```

##	Network interface creation issues

This section covers issues that creation of the network interface on a new VM to fail.

### NIC creation timeout

**Error description:** Creation of the network interface on the VM didn't complete within the allowed timeout period. This failure can be caused by DHCP server issues in your environment. 

To verify whether the network interface was created successfully, do these steps:

1. In the Azure portal, go to the Azure Stack Edge resource for your device (go to **Edge Services** > **Virtual machines**). Then select **Deployments**, and navigate to the VM deployment. 

1. If a network interface was not created successfully, you'll see the following error.

   ![Portal error displayed when network interface creation fails](./media/azure-stack-edge-gpu-troubleshoot-virtual-machine-provisioning/nic-creation-failed-01.png)

**Suggested solution:** Create the VM again, and assign it a static IP address.

##	VM image issues

VMs deployed on an Azure Stack Edge Pro GPU device must be Generation 1 virtual machines. The VM image used to create the VM must be a fixed-size VHD. The image must be uploaded as a page blob to your Azure Storage account. If these conditions are not met, VM provisioning on your device will fail.

<!--Make bullets for visibility of requirements.-->

For guidance on resolving image creation issues, see [Troubleshoot virtual machine image uploads in Azure Stack Edge Pro GPU](azure-stack-edge-gpu- troubleshoot-virtual-machine-image-upload.md).

## VM creation issues

This section covers common issues that occur during VM creation.

### Not enough memory to create the VM

**Error description:** When VM creation fails because of insufficient memory, you'll see the following error.
 
![Portal error displayed when VM creation fails](./media/azure-stack-edge-gpu-troubleshoot-virtual-machine-provisioning/vm-creation-failed-01.png)

**Suggested solution:** Check the available memory on the device, and choose the VM size accordingly. For more information, see [Supported virtual machine sizes on Azure Stack Edge](azure-stack-edge-gpu-virtual-machine-sizes.md).

#### Calculate memory available for VMs
<!--Memory requirements should link to technical requirements and/or deployment requirements. Available memory and available compute. The full set of requirements should be added to a new VM sizing best practies. Add a comment that this should move to sizing best practices.-->
- **Memory available for compute:**

   - An Azure Stack Edge Pro GPU device has a total memory of 128 Gbs. 

     Total memory = 128 Gbs
     Memory available for compute = 85% of 128 = 108.8 Gbs

   - A Tactical Mobile Appliance SKU<!--???--> has total memory of 48 Gbs. <!--Mini R - Link to Mini R technical requirements.-->

     Total memory = 48 Gbs
     Memory available for compute = 75% of 48 = 36 Gbs

- **Compute memory includes Kubernetes + VMs.** If you have enabled Kubernetes, Kubernetes requires 25 percent of the memory<!--"the memory" refers to memory available for compute? Is the assumption that this is 25% of 108.8 GBs?--> for the master VM, plus 4 Gb of memory for each worker VM - which is also expandable.<!--What is expandable? Find the memory requirements for Kubernetes.-->

   Memory available for VMs = Memory available for compute – Memory used by K8s<!--Meaning of K8s?-->

- **Hyper-V has some overhead memory for each VM.** So you may see new VM creations fail with the above error if there is not enough memory to create that VM.

**Suggested solutions:**

- Configure the VM with a smaller memory size.<!--Or configure it with "less XX memory"? Check how this is worded in deployment topics.-->
- Stop any VMs that aren't in use from the portal.
- Delete any VMs that are no longer in use.

### Insufficient number of GPUs to create GPU VM

Error displayed:

![Portal error displayed when creation of a GPU VM fails because of not enough GPUs](./media/azure-stack-edge-gpu-troubleshoot-virtual-machine-provisioning/gpu-vm-creation-failed-01.png)

**Possible causes:**
If Kubernetes is enabled before the VM is created, Kubernetes will use all the available GPUs and you won’t be able to create any GPU-size VMs. You can create as many GPU-size VMs as the number of GPUs (1 or 2 GPU SKU). 

**Suggested solution:** For troubleshooting guidance, see [Overview and deployment of GPU VMs on your Azure Stack Edge Pro device](azure-stack-edge-gpu-deploy-gpu-virtual-machine.md).<!--Link to a specific section. Somewhere around here: https://review.docs.microsoft.com/en-us/azure/databox-online/azure-stack-edge-gpu-deploy-gpu-virtual-machine?branch=pr-en-us-159155#for-2-gpu-device-->

## GPU extension failed to be deployed
Debugging steps:

### VM size is not GPU VM size

**Error description:** A GPU VM must be either Standard_NC4as_T4_v3 or Standard_NC8as_T4_v3 size. If any other VM size is used, the GPU extension will fail to be attached.

**Suggested solution:** Create a VM with the Standard_NC4as_T4_v3 or Standard_NC8as_T4_v3 VM size. For more information, see [Supported VM sizes for GPU VMs](azure-stack-edge-gpu-virtual-machine-sizes.md#ncast4_v3-series-preview).

### Image OS is not supported

**Error description:** The GPU extension doesn't support the operating system that's installed on the VM image. 

**Suggested solution:** Prepare a new VM image that has an operating system that the GPU extension supports. 

* For a list of supported operating systems, see [Supported OS and GPU drivers for GPU VMs](azure-stack-edge-gpu-deploy-gpu-virtual-machine.md#supported-os-and-gpu-drivers).

* For image preparation requirements for a GPU VM, see [Create GPU VMs](azure-stack-edge-gpu-deploy-gpu-virtual-machine.md#create-gpu-vms).


### Extension parameter is incorrect

**Error description:** Incorrect extension settings were used when deploying the GPU extension on a Linux VM.<!--Verify: This applies only to a Linux VM? Supporting materials apply only to a Linux VM.--> 

**Suggested solution:** Edit the parameters file before deploying the GPU extension. There are specific parameters files for the Ubuntu and Red Hat Enterprise Linux (RHEL) operating systems. For more information, see [GPU extension for Linux](azure-stack-edge-gpu-deploy-gpu-virtual-machine.md#gpu-extension-for-linux).


### VM extension installation failed in downloading package

**Error description:** Extension provisioning failed during extension installation or while in the Enable state.

1. Check the guest log for the associated error:

   On a Linux VM:
   * Look in `/var/log/waagent.log` or `/var/log/azure/nvidia-vmext-status`.

   On a Windows VM:
   * Find out the error status in `C:\Packages\Plugins\Microsoft.HpcCompute.NvidiaGpuDriverWindows\1.3.0.0\Status`.
   * Review the complete execution log: `C:\WindowsAzure\Logs\WaAppAgent.txt`.

1.	If installation fails while the package is being downloaded, that indicates the VM couldn't access the public network to download the driver.

**Suggested solution:**

1.	Reassign the compute port on the VM to the public network (Port 2).<!--Where are the instructions for configuring the port used for compute?-->

2.	De-allocate the existing, failed VM.<!--To do this, do they stop the VM in the portal?-->
 
3.	Create a new VM.

### VM Extension failed with error `dpkg is used/yum lock is used`

**Error description:** GPU extension deployment on a Linux VM failed because another process was using `dpkg` or another process has created a `yum` lock. 

<!--ORIGINAL TEXT - This error only happens on Linux builds. Check \var\log\azure\nvidia-vmext-status and look for the error. If the error is like “dpkg is used by another process”/”Another app is holding yum lock”. The customer needs to wait for whatever process that is using the lock to finish or kill the process, before you try to deploy the extension deployment again.-->

**Suggested solution:** To resolve the issue with the lock, do these steps:

1.	Find out what process(es) are using the lock,<!--How? Where?--> and either wait for the processes to complete or end the processes.

1.	Retry setting the extension.<!--What step are they performing again? Source article/procedure?-->

1.	If extension deployment fails again, create a new VM and make sure the lock isn't in use before you deploy the GPU extension.


## Next steps

* Learn how to "Troubleshoot image upload"
* Troubleshoot device issues > Azure Resource Manager
* Troubleshoot device issues > Collect a support package
* Contact Microsoft Support
