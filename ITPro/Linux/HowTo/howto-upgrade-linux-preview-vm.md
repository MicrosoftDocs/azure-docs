#How to Upgrade a Linux Preview VM or Personal Image to the new Hypervisor ( Dec 20th 2012 to Jan 21st 2013)

As part of our efforts to improve the experience for our customers running Linux workloads on top of Windows Azure; some changes have been introduced into the Virtualization layer of our platform that will improve performance and stability but will also require a mandatory update to critical components of the Linux VMs.

This is a concerted effort with our partners that as of Dec 20th have released images that include all of the changes and enhancements as well as the different resources needed to enable you to update your own VMs and personal images.

The changes primarily affect the ability to provision new images based on a personal image so it is critical that you update all your personal images as well as any running VMs that you might have **Before January 21st 2013**.

After that date we are afraid that updates to **your personal images** might fail and you will have to recreate any personal images from scratch using a gallery image.
All your current VMs will continue to run normally but you will need to update them if you would like to later [capture them as personal images](https://www.windowsazure.com/en-us/manage/linux/how-to-guides/capture-an-image/).

In this document we will provide you with:

 * [Basic FAQ about the Change](#FAQ)
 * [Set of Steps to perform the Update](#steps)

You can read the complete detail of these steps on  the [Windows Azure announcement that introduces this change](http://go.microsoft.com/fwlink/?LinkID=275187&clcid=0x409) as well as our partner Blogposts about the update for the different distributions:

-	[OpenLogic's Blogpost for CentOS](http://go.microsoft.com/fwlink/?LinkID=275183&clcid=0x409)
-	[Canonical's Blogpost for Ubuntu](http://go.microsoft.com/fwlink/?LinkID=275184&clcid=0x409)
-	[SUSE's blogpost for SLES and OpenSUSE](http://go.microsoft.com/fwlink/?LinkID=275185&clcid=0x409)


<h2 id="FAQ">Basic FAQ about the change</h2>

1.	**Will my current VMs stop working after January 21st?**
	

	-	**No; all your VMs will continue to run Normally**. This only affects the ability to provision your Personal images and any images you capture from a running VM that has not been updated.



2.	**Why am I being asked to update my VM if it will not stop working after January 21st?**

	-  You have the ability to [capture any running VM them as a personal image](https://www.windowsazure.com/en-us/manage/linux/how-to-guides/capture-an-image/). If you have not updated your pre Dec 20th VM before you capture it; the personal image that you create will fail to provision
3. **Why are you asking us to update the Kernel? What is the change?**

	-	We provision VMs in the platform by attaching an ISO with the configuration to each VM as a CDROM drive. The previous Hypervisor presented this CDROM as an SCSI device but the new one presents it as an IDE device. 
	
		The IDE stack for the CDROM is implemented through the ATA PiiX driver which in previous versions was not compatible with Windows Azure and was therefore disabled on all images. We have contributed a change to this driver to make it compatible with Windows Azure and the new driver has been backported and re-enabled in the kernel by our partners. You will therefore need to use this Kernel to  be able to provision correctly in the new Hypervisor.
		
		A change in the Windows Azure Linux Agent was also introduced with the latest version 1.2 to accommodate this change and correct several bugs that have been found during  the preview timeframe.
4. **What if I created a custom kernel for My VM**
	
	-	We have open sourced all the components that are part of this update and hence you can follow the steps on the [Create your own image](https://www.windowsazure.com/en-us/manage/linux/common-tasks/upload-a-VHD/) instructions to update your images. Please make sure that you are following all the recomendatiosn there but most importantly the following ones: 
		- You will need to ensure that you are running a kernel that either incorporates the latest LIS drivers for Hyper V or that you have successfully compiled them ( They have been Open Sourced). The Drivers can be found [at this location](http://go.microsoft.com/fwlink/p/?LinkID=254263&clcid=0x409)
		- Your kernel should also include the latest version of the ATA PiiX driver that is used to to provision the images and has the fixes committed to the kernel with commit cd006086fa5d91414d8ff9ff2b78fbb593878e3c Date:   Fri May 4 22:15:11 2012 +0100   ata_piix: defer disks to the Hyper-V drivers by default
		- You will need to install the Agent following the steps in the [Agent Guide](https://www.windowsazure.com/en-us/manage/linux/how-to-guides/linux-agent-guide/). The Agent has been released under the Apache 2 license and you can get the latest bits at the [Agent GitHub Location](http://go.microsoft.com/fwlink/p/?LinkID=250998&clcid=0x409)
5. **What if I miss the Update Window?**

	- The update window is from Dec  20th 2012 to January 21st 2013  for all **personal images** after January 21st you will not be able to update any personal images without downloading them and manually performing the steps to do this using Windows Hyper-V ( please visit the [Windows Azure Support Forums for Linux](http://social.msdn.microsoft.com/Forums/en/WAVirtualMachinesforLinux/) for details on how to do this.
	- All your running VMs will continue to operate normally so you will be able to update them even after January 21st. **Please make sure you have updated them before you capture them as personal images in the future**.


<h2 id="steps">Set of Steps to perform the update</h2>

The following steps assume that you start from a Personal Image but if you are updating a running VM you can follow these steps only from the Relevant section.
The main steps are:

* [Instantiate a new VM from a Personal Image](#createvm)
* [Update a Running VM's set of repositories](#repos)
* [Update a Running VM's Kernel](#kernel)
* [Update a Running VM's Windows Azure Linux Agent](#agent)
* [Capture running VM's as a Personal Image](#capturevm)
* [Delete old Personal Image from your repository](#deleteiamge)

<h5 id="createvm">Instantiate a new VM from a Personal Image</h5>
You will need to create a new instance of your personal image by following the instructions on [How to create a custom VM](https://www.windowsazure.com/en-us/manage/linux/how-to-guides/custom-create-a-vm/).

Please make sure that you **select your personal image under the My Images section in the gallery**.
 
<h5 id="createvm">Update a Running VM's set of repositories</h5>

You will need to replace the current repositories in your image to use the azure repositories that carry the kernel and agent package that you will use to upgrade the VM.

The steps for this are different depending on the distribution that you are using. Please refer to the specific Blog Posts for your distribution from the partner endorsing them below :

-	[OpenLogic's Blogpost for CentOS](http://go.microsoft.com/fwlink/?LinkID=275183&clcid=0x409)
-	[Canonical's Blogpost for Ubuntu](http://go.microsoft.com/fwlink/?LinkID=275184&clcid=0x409)
-	[SUSE's blogpost for SLES and OpenSUSE](http://go.microsoft.com/fwlink/?LinkID=275185&clcid=0x409)

<h5 id="createvm">Update a Running VM's Kernel</h5>

Once you have made sure that you have the right repositories in your path you will need to  follow the specific steps per distribution to install the kernel package:

-	[OpenLogic's Blogpost for CentOS](http://go.microsoft.com/fwlink/?LinkID=275183&clcid=0x409)
-	[Canonical's Blogpost for Ubuntu](http://go.microsoft.com/fwlink/?LinkID=275184&clcid=0x409)
-	[SUSE's blogpost for SLES and OpenSUSE](http://go.microsoft.com/fwlink/?LinkID=275185&clcid=0x409)

You will then need to Make sure that you have configured your kernel appropriately by following these instructions:

-  You should add the following lines to your Kernel Boot

	-	console=ttyS0
	-	rootdelay=300

-	It is recommended that you set /etc/sysconfig/network/dhcp or equivalent  from DHCLIENT_SET_HOSTNAME="yes" to DHCLIENT_SET_HOSTNAME="no"

-	You should Ensure that all SCSI devices mounted in your kernel include an I/O timeout of  300 seconds or more.


<h5 id="createvm">Update a Running VM's Windows Azure Linux Agent</h5>

You will then need to install the latest Windows Azure Linux Agent 1.2.x or higher for every distribution by following the steps below:

-	[OpenLogic's Blogpost for CentOS](http://go.microsoft.com/fwlink/?LinkID=275183&clcid=0x409)
-	[Canonical's Blogpost for Ubuntu](http://go.microsoft.com/fwlink/?LinkID=275184&clcid=0x409)
-	[SUSE's blogpost for SLES and OpenSUSE](http://go.microsoft.com/fwlink/?LinkID=275185&clcid=0x409)

<h5 id="createvm">Capture running VM's as a Personal Image</h5>

-	 **Only perform these steps if you  are replacing an existing personal image as this operation eliminates the running VM as it creates the personal image**.

Once you have properly updated the VM  you will need to [Capture the VM into a personal image](https://www.windowsazure.com/en-us/manage/linux/how-to-guides/capture-an-image/) by following the instructions in the link.

Please make sure that you use a name for the image that you can easily remember.  

<h5 id="createvm">Delete old Personal Image from your repository</h5>
Once you see the new Personal Image listed on your My images section of the Portal Gallery you will need to :

-	Go to the Virtual Machines tab on the left side menu  of the portal.
- 	Once you are in the Virtual Machines section select the images tab right below the title.
-	You will see the list of your images. Select **the old image** and click on the Delete Image (trash bin icon) on the bottom menu of the portal