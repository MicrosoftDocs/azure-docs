#How to Debug a Linux VM

There are several issues that could lead  a VM to not operate propertly inside of Azure.
These can span from platform issues to changes inside the VM in some of the critical components that ensure that the VMs Operate Correctly.

This How to document will provide a brief description of a Linux VM wunning in Azure and will then proceed to highlight the different resources available to a customer debugging a malfucntioning VM.

Please notice that this document and all the instructions listed here are independent of the additional support that our partners will provide during GA. 

That escalation process will be detailed in a different document. 

* [Basic VM Concepts](#concepts)
* [Escalation Path](#escalation)
* [Portal Messages](#portalerrors)
* [Agent Generated Logs](#agentlogs)
* [Serial Console Output](#serialconsole)
* [How to perform offline disk operations for debugging in the cloud](#debugging)


<h2 id="concepts">Basic  VM Concepts</h2>
Every LInux VM running in azure will need to have met the [Create your own Linux VM instructions](https://www.windowsazure.com/en-us/manage/linux/common-tasks/upload-a-VHD/) whether they were performed by the customer directly or the partner that published an image in the gallery. 
These steps result in the Vm or personal image containing three very important components:

- A Kernel that is compatible with the Azure Hepervisor: This is a kernel that:

	- Is able to fit in the bootloader Limititations of the Hypervisor ( < 40 MB )
	
	- Has the latest ATA PiiX stack that allows the system to mount a provisioning ISO that is recognized by the platform and presented to the WALinuxAgent that will use this infomration to Provision the image
	
	- Has components that make it compatible with the Linux Integration Services ( the Virtualization Drivers released by Microsoft)
- A set of Linux Integration services or Virtualization Drivers that:
		
	- Ensure that the Guest OS in the virtual machine is able to correctly identify that all the virtualized resources provided by the platform
	- Allows the Azure platform to perform some basic level of monitoring on the health of the VM
- A Windows Azure Linux Agent tha is responsible for:

	- Performing all the provisioning tasks when the VM is booted for the first time while consuming the configuration presented as a CDROM through the platform and the LISt drivers to a comaptible kernel
	- Monitor the health of the VM as well as any changes that could geopardize its stability  as it moves from one Node to another in the event of a Service heal operation.
	-Monitor certain operations such as hostname change to apraise the Platform about this changes and keep the resolution up to date

As you can infer from the information above. If any of the three componets fails or is modified  the VM will beocme compromissed. 
Critical to these components is their intrinsice interdepence that could result in one or more of the components malfucntioning as a result of an update or change to a particular component. 

All of these components deliver detailed logging about their activities that can be used by a customer to attempt to diagnose failures.

-	The agent generates errors that are surfaced all the way to the API but also captures an even more detialed set of Logs that are stored in the VM.  

-	The LIS components themselves log to the local logs inside the VM.

-	The Kernel asside form its own internal logs redirects the console output to the serial port that is captured in the platform (this assumes that you have followed the instructions to enable the serial console output  as aprt of the kernel boot string as per the [instructions to create a Linux Image](https://www.windowsazure.com/en-us/manage/linux/common-tasks/upload-a-VHD/))

In the next sections we will explore how to access these error reports from the outermost layer eposed to the customer to the VHD itself hsoting an image.

<h2 id="escalation">Escalation Path</h2>
Before we move to explore the different logs .. weshoudl discuss the escalation path for  the support request for a linux VM.

- The first stop for any customer debugging an image during preview and afterwards shoudl be the [Support Forum for Linux VMs](http://social.msdn.microsoft.com/Forums/en/WAVirtualMachinesforLinux/)
-	Most of the questions surfaced in this forum are resolved there directly but some are escalted to formal azure support during preview or after GA could be directly escalated by the customer.
-	When customer support is invovled they are able to carefully consiuder the issue raised by the customer and determine if there is aplatform failure. 
-	After GA depending on the type of image that the customer is runing ( suported by a partner over the phone or not) they will be able to escalte to the partner for further debugging or retrieve and share some logs with the customer directly ( msot important of which is the serial console output) 

<h2 id="portalerrors">Portal Messages</h2>

The portal surface mostly   provisioning errors that could be due to platform failures or the fact that one of the key components mentioned above is malfunctioning or incompatible.

These errors are typically best suited to showcase platform or surbscription based errors such as not enough cores left in the subscription or platform allocation errors that are visible at this level and not to the VM. 

There are some errors showcased here that might signal a failure inside the VM  e.g Provisioning failed could be a due to a resource allocation proiblem or the fact that the agent or other component in the VM failed to complete the provisioning steps

<h2 id="agentlogs">Agent Generated Logs</h2>

The agent captures all the configuration that it receives in : /var/lib/waagent protected with access through sudo only

The agent also stores detialed logs of all the operations it conducts  at: /var/log/waagent.log  ( you can see any Agent provisioning failures there)

You can read more about the agent fucntionality on the [Agent User guide](https://www.windowsazure.com/en-us/manage/linux/how-to-guides/linux-agent-guide/)

<h2 id="serialconsole">Serial Console Output</h2>

Serial console output is only avaialbe is the console=ttys0 line was added to the Kernel boot options. 

All the images provided by partners as of Dec 20th 2012 include this feature  but you can also enable this in your own images by following the [Create your own Linux VM instructions](https://www.windowsazure.com/en-us/manage/linux/common-tasks/upload-a-VHD/).

The only way to access this output until GA is to contact Azure support and request that they retrieve the serial console output for your VM and share it with you.

This can be requested at any point after the failure has occurred but it is better to repro the fault condition shortly before asking for the console output. 

Before GA we do not encourage that you direct other traffic to console as the ciclyc buffer used to store the outout is limited at this point .

<h2 id="debugging">How to perform offline disk operations for debugging in the cloud</h2>

In the worst case scenario you might need to perform a debugging operation on top of the OS disk that supports a VM indepent of the VM Because:
-	The VM  crashes or is not able to boot and you cannot seem to make sense of the reasson through the serial console output
-	Or in some cases it might be that the VM boots but you cannot acees it through SSH even when the end poitn was created 
-	Or Fianlly the Disk might need for you to run fsck 

In these cases you will need to create a new vm and delete the old VM. The Delete operation will leave the os and data disks intact and accessible to you htorugh the portal.
At this point you can attach the faulty OS disk to the new running VM as a data disk suing the instructions in teh [Attach a Data Disk](https://www.windowsazure.com/en-us/manage/linux/how-to-guides/attach-a-disk/) document.

At this point you can run FSCK on the disk or mount it to explore its contesnt s and look at kernel logs or agent logs and try to debug the issue.
 
Once you have identified and corrected the issue you can [Detach the Data Disk](https://www.windowsazure.com/en-us/manage/linux/how-to-guides/howto-detach-disk/).

At this poitn you can recreate your VM by Creating the VM from a Disk instead of an image using the portal and choosing New virtual machine-> from gallery  and then the  My Disks tab. 