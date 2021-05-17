---
title: Troubleshoot virtual machine provisioning in Azure Stack Edge Pro GPU | Microsoft Docs 
description: Describes how to troubleshoot issues that occur when provisioning a new virtual machine in Azure Stack Edge Pro GPU.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: troubleshooting
ms.date: 05/17/2021
ms.author: alkohli
---
# Troubleshoot virtual machine provisioning in Azure Stack Edge Pro GPU

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to troubleshoot issues that occur when provisioning a new virtual machine (VM) on an Azure Stack Edge Pro GPU device.

SAMPLE SECTION<!--Format used in "Troubleshooting image uploads." May use a different one for this topic.--> 

## Error message

**Error Description:** XXX

**Suggested solution:** XXX


BEGIN SOURCE (Markdown formatting in progress, 05/17.)

## VM Console Connect

You can access the console and troubleshoot any issues experienced when deploying a virtual machine on your device. You can connect to the virtual machine console even if your VM has failed to provision. For more information, see [Connect to the virtual machine console on Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-connect-virtual-machine-console.md).


## Collect guest VM logs for a failed VM from Minishell

<!--This section is a prerequisite to the error descriptions.-->
VM Provisioning failure can be diagnosed further by collecting provisioning logs from within a virtual machine. The following command will:

* Collect the in guest logs for the failed VMs and 
* Include them in the support package.

To collect provisioning logs from within a virtual machine, do these steps:

1. [Connect to the minishell of the appliance](azure-stack-edge-gpu-connect-powershell-interface.md).<!--Link to a specific section.-->

2. Run the following commands from the minishell:

   ```powershell
   Get-VMInGuestLogs -FailedVM
   Get-HcsNodeSupportPackage -Path “\\<network path>” -Include InGuestVMLogFiles -Credential “domain_name\user”
   ```

3. Once you have the support package, you can check for the Guest logs under hcslogs\VmGuestLogs.

   Details about VM provisioning can be found in following logs

   **Linux:**
   /var/log/cloud-init-output.log
   /var/log/cloud-init.log
   /var/log/waagent.log

   **Windows:**
   C:\Windows\Azure\Panther\WaSetup.xml

In this document we will look at the common causes for:<!--Move this to the lead?-->
* VM Provisioning timeout<!--Add section links.-->
* Network Interface creation failure
* Image creation issues

## VM Provisioning Timeout

<!--Source provides a graphic of "Creation of virtual machine failed" error at this point.-->

* IP assigned to the VM is already in use (in case of static IP allocation)
* Image not prepared correctly
* Other VM provisioning issues

### IP assigned to the VM is already in use

**Error description:**  XXX 

1. Stop the VM from the portal (if it is running), and run the following commands:

   ```powershell
   ping <ip>
   tnc <ip>
   tnc <ip> -CommonTCPPort “RDP”
   ```

   There should be no response for the above commands.

**Suggested solution:**

Use a static IP that is not in use, or use dynamic IP address from DHCP server.

### Image not prepared correctly

**Error description:** The workflow requires you to create a virtual machine in Azure, customize the VM, generalize, and then download the VHD corresponding to that VM.

**Suggested solution:** Please refer to this document for image preparation:
[Create VM images for your Azure Stack Edge Pro GPU device]()

Generalized image from VHD:
Prepare generalized image from Windows VHD to deploy VMs on Azure Stack Edge Pro GPU | Microsoft Docs

Generalized image from ISO:
Prepare generalized image from ISO to deploy VMs on Azure Stack Edge Pro GPU | Microsoft Docs

Specialized image: (Link for specialized image once it is published)

3.	Other provisioning issues
These include issues such as:
1)	cloud init not being able to run/ issues while running cloud init (Linux image)
2)	Gateway and DNS is not reachable from the guest VM
3)	Provisioning flags set incorrectly /etc/waagent.conf (Linux image)
To further debug such issues we need to look at the in-guest logs for the VM:
1)	cloud init not being able to run/ issues while running cloud init (only for Linux images)

You can console connect to the VM and look at the logs under the below files to check for errors in cloud init execution.

/var/log/cloud-init-output.log
/var/log/cloud-init.log
/var/log/waagent/log

2)	Console connect to the VM and validate that 
a.	the default gateway is pingable from the VM.
b.	DNS server is reachable from within VM

3)	Make sure the Provisioning flags in the file /etc/waagent.conf are set to: (only for Linux images)
# Enable instance creation
Provisioning.Enabled=n

# Rely on cloud-init to provision
Provisioning.UseCloudInit=y

Further if you see the following logs, please contact Microsoft Support.
For Windows VMs: 
File: C:\Windows\Azure\Panther\WaSetup.xml
<Event time="2021-03-26T20:08:54.648Z" category="INFO" source="WireServer"><HttpRequest verb="GET" url="http://168.63.129.16/?comp=Versions"/></Event>
<Event time="2021-03-26T20:08:54.898Z" category="WARN" source="WireServer"><SendRequest>Received retriable HTTP client error: 8000000A for GET to http://168.63.129.16/?comp=Versions - attempt(1)</SendRequest></Event>
<Event time="2021-03-26T20:08:54.929Z" category="ERROR" source="WireServer"><UnhandledError><Message>GetGoalState: RefreshGoalState failed with ErrNo -2147221503</Message><Number>-2147221503</Number><Description>Not initialized</Description><Source>WireServer.wsf</Source></UnhandledError></Event>
For Linux VMs:
Files: 
/var/log/cloud-init-output.log
/var/log/cloud-init.log
/var/log/waagent.log
2021/04/02 20:55:00.899068 INFO Daemon Detect protocol endpoints
2021/04/02 20:55:01.043511 INFO Daemon Clean protocol
2021/04/02 20:55:01.094107 INFO Daemon WireServer endpoint is not found. Rerun dhcp handler
2021/04/02 20:55:01.188869 INFO Daemon Test for route to 168.63.129.16
2021/04/02 20:55:01.258709 INFO Daemon Route to 168.63.129.16 exists
2021/04/02 20:55:01.345640 INFO Daemon Wire server endpoint:168.63.129.16
2021/04/02 20:56:32.570904 INFO Daemon WireServer is not responding. Reset endpoint
2021/04/02 20:56:32.606973 INFO Daemon Protocol endpoint not found: WireProtocol, [ProtocolError] [Wireserver Exception] [HttpError] [HTTP Failed] GET http://168.63.129.16/?comp=versions -- IOError timed out -- 6 attempts made

2.	Network Interface Troubleshooting

1.	NIC creation timeout

Go to the Deployments tab on the left pane and navigate to the VM deployment. Check if the network interface got created successfully.
You will see an error like this on failure to create a network interface:

 
Resolution:
Please try creating the VM again with static IP. It could be that this is due to DHCP server issues on your environment.
3.	Image Creation issues:
Currently, we only support creation of Gen1 VMs on Azure Stack Edge. Along with this, the VHDs should be of “fixed” type with “VHD” extension and should be uploaded as a page blob to your storage account.

Please refer to this troubleshooting guide for more information on image creation issues.
Troubleshoot virtual machine image uploads in Azure Stack Edge Pro | Microsoft Docs 

4.	     Common VM creation issues:

1.	Not enough memory to create the VM
Error displayed:

 

Causes:
1.	Not enough memory left to create the VM.
2.	Check the available memory on the device and accordingly choose the VM size:
Supported virtual machine sizes on Azure Stack Edge | Microsoft Docs

Explanation:
If you have Azure Stack Edge Pro - GPU SKU you have a total memory of 128Gbs. 

	Total memory = 128 Gbs
	Memory available for compute = 85% of 128 = 108.8 Gbs

If you have Tactical Mobile Appliance SKU you have a total memory of 48Gbs. 

	Total memory = 48 Gbs
	Memory available for compute = 75% of 48 = 36 Gbs

(*compute memory includes Kubernetes + VMs. If you have enabled Kubernetes, it requires 25% of the memory for master VM + 4Gb for worker VM - which is also expandable ).

	Memory available for VMs = Memory available for compute – Memory used by K8s

Additionally, Hyper-V comes with some overhead memory for each VM. So you may see new VM creations fail with the above error if there is not enough memory to create that VM.

Resolution:
1)	Use smaller memory size VM
2)	Stop the VM which is not in use from the portal.
3)	Delete unused VMs 

2.	Insufficient number of GPUs to create GPU VM
Error displayed:
 

Causes:
If Kubernetes is enabled first, it will grab all the available GPUs and you won’t be able to create any GPU sized VMs. You can create as many GPU sized VMs as the number of GPUs (1 or 2 GPU SKU). 
Resolution: 
Refer to this detailed article about creating GPU VMs:
Overview and deployment of GPU VMs on your Azure Stack Edge Pro device | Microsoft Docs


DHCP Server Issues:
(Can be a separate document)

ASE runs DHCP proxy for cloud VMs and VNFs in tenant L2 network. This requires physical switch/router ports and DHCP server to allow source MAC address to be different with DHCP client MAC address. We observed some environment (I.e. Netgear cable modem wireless router, lab environment) drop DHCP packets if source mac address is different with client MAC address. This causes VM and VNFs running on ASE failed to provision due to no DHCP offer.  This article describes DHCP flow in working environment, and known failure cases. For failure cases, we recommend user to change physical switch/router setting and mark ASE's connected ports as trusted ports.
Problem Description:
We will illustrate DHCP flow in working (section A) and non-working (section B) cases.
DHCP flow in ASE working environment:
1) ASE DHCP client sent discover packet. Src MAC 00:15:5d:aa:28:02 belongs to DHCP host vNIC on ASE. Client MAC address in DHCP header 00:1d:d8:b7:af:71 belongs to VM vNIC. 
 
 
 
2) DHCP server replied DHCP offer with assigned IP 10.126.76.42, and client MAC address belongs to VM vNIC: 00:1d:d8:b7:af:71
 
 
3) ASE DHCP client sent DHCP request for IP 10.126.76.42, client MAC address = VM vNIC's mac address (00:1d:d8:b7:af:71)
 
 
4) DHCP server replied DHCP ACK with VM vNIC's MAC as client MAC address: 00:1d:d8:b7:af:71
 

DHCP flow in non-working environment:
Failure case #1:
When DHCP server replied DHCP offer packet(the 2nd packet in working workflow), client MAC address in DHCP header is ASE's DHCP host vNIC's mac address. In other words, DHCP server assumed two MAC addresses are same, and did not use client MAC address inside DHCP discover packet. When ASE receives this DHCP offer packet, ASE will drop it with error, as DHCP offer packet used unexpected MAC address
Failure case #2:
DHCP server silently dropped DHCP request packet, and did not reply DHCP ACK packet. The 4th packet in working workflow is missing in failure case #2.

Solution: DHCP physical environment requirement:
 For home wireless router (I.e. NETGEAR Nighthawk AC1900 WiFi DOCSIS 3.0 Cable Modem Router (C7000)), DHCP server by default assumed clients are _untrusted_, thus block DHCP spoofing packets. If home wireless router does not support DHCP proxy, ASE will not work for DHCP IP assignment. User shall config static IP on VM network interfaces as workaround. 
 
Physical switch/router has DHCP snooping feature. The ports that ASE connected shall be configured as _trusted_ ports, thus packets from ASE DHCP proxy won't be dropped. Configuration of DHCP snooping and trusted ports on physical switch/router shall refer to respective user manual. Reference has example of Cisco router configuration.   

Debug with Wireshark Packet Capture:
User shall enter support session by running Enable-HcsSupportAccess in minishell. Then in powershell window, connect to Azure Resource Manager (Connect to Azure Resource Manager on your Azure Stack Edge Pro GPU device | Microsoft Docs).  Run ARM commands to create/remove NIC. Creating a NIC without specifying IPAddress will trigger DHCP request sent from ASE. Before NIC creation, user shall start packet capture session on switch side: 
 
On ASE create NIC to trigger DHCP:
Create NIC:
$ipcfgName = "ipconfig1"
 $nicName = "<nicName>"
 $rgname = "<resource group>"
 $subNetId = (Get-AzureRmVirtualNetwork).Subnets[0].Id
 $ipConfig = New-AzureRmNetworkInterfaceIpConfig -Name $ipcfgName -SubnetId $subNetId
 $Nic = New-AzureRmNetworkInterface -Name $nicName -ResourceGroupName $rgname -Location "dbelocal" -IpConfiguration $ipConfig
 
 
Check existing NIC:
$nics = Get-azurermnetworkinterface
 
 
Delete NIC:
$nics[0] | remove-azurermnetworkinterface   (example: delete1st NIC in $nics array, make sure $nics[0] is not used)




On switch side run packet capture
From Physical Switch UX:
Using Packet Capture to Troubleshoot Client-side DHCP Issues - Cisco Meraki
Using Wireshark for Packet Captures - Cisco Meraki
 
From Physical Switch Command-Line:
https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/16-9/configuration_guide/nmgmt/b_169_nmgmt_9300_cg/configuring_packet_capture.html
   
Reference:
https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol
How to Prevent DHCP Spoofing (slideshare.net), page 9
Security - Configuring DHCP Snooping  [Support] - Cisco Systems


Gpu Extension failed to be deployed
Debugging steps:
VM size is not Gpu vm size:
Right now, we only support Standard_NC4as_T4_v3 and Standard_NC8as_T4_v3 VM sizes to create Gpu vms. If any other vm size is used, attempting to attach gpu extension will fail. 

Image OS is not supported:
We only support Windows2019, Windows2016, Ubuntu18, and RHEL7.4 right now. Overview and deployment of GPU VMs on your Azure Stack Edge Pro device | Microsoft Docs

Extension parameter is incorrect:
Make sure the customer used the correct extension settings when deploying gpu extension. Overview and deployment of GPU VMs on your Azure Stack Edge Pro device | Microsoft Docs

VM extension installation failed in downloading package:
Extension provisioning could fail in extension installation or enable state. We need to check in guest log for the actual error:
1.	For linux:
a.	Check for errors in /var/log/waagent.log or /var/log/azure/nvidia-vmext-status
2.	For Windows:
a.	Check for the error status in C:\Packages\Plugins\Microsoft.HpcCompute.NvidiaGpuDriverWindows\1.3.0.0\Status
b.	Also look in C:\WindowsAzure\Logs\WaAppAgent.txt for the complete execution log.
3.	If the install process failed in downloading the package. Then it means the vm is not able to reach to public network to download the driver. 
Resolution:
1.	Move the compute port to public network (Port 2)
2.	Deallocate the existing failed VM. 
3.	Try to create another VM.
VM Extension failed with error dpkg is used/yum lock is used
This only happens on Linux builds. Check \var\log\azure\nvidia-vmext-status and look for the error. If the error is like “dpkg is used by another process”/”Another app is holding yum lock”. The customer needs to wait for whatever process that is using the lock to finish or kill the process, before retrying the extension deployment again.
Resolution:
1.	Find out what process is using the lock, wait for them to finish. Or kill them
2.	Retry setting the extension.
3.	If extension retry failed. Try creating another VM and make sure the lock is not used before deploying the extension.


## Next steps

* Learn how to XXX
* Learn how to XXX
