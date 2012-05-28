<properties umbracoNaviHide="0" pageTitle="What is a virtual machine in Windows Azure" metaKeywords="Windows Azure virtual machine, Azure virtual machine, Azure disks, Azure data disks, data disks, linux data disks, image, " metaDescription="Learn about virtual machines." linkid="manage-windows-how-to-guide-virtual-machines" urlDisplayName="How to: virtual machines" headerExpose="" footerExpose="" disqusComments="1" />
#What is a virtual machine in Windows Azure?

A virtual machine in Windows Azure is a server in the cloud that you can control and manage. After you create a virtual machine in Windows Azure, you can delete and recreate it whenever you need to, and you can log on to the virtual machine just as you do with any other server. Virtual hard disk (VHD) files are used to create a virtual machine. The following types of VHDs are used for a virtual machine in Windows Azure:

- **Image -** A VHD that is used as a template to create a new virtual machine. An image is a template because it doesn’t have specific settings like a running virtual machine, such as the computer name and user account settings. If you create a virtual machine using an image, an operating system disk is automatically created for the new virtual machine.
- **Disk -** A VHD that can be booted and mounted as a running version of an operating system. A disk is a runnable version of an image. Any VHD that is attached to virtualized hardware and running as part of a service is a disk. After an image is provisioned, it becomes a disk and a disk is always created when you use an image to create a virtual machine.

The following options are available for using images to create a virtual machine:

- Create a virtual machine by using an image that is provided in the Image Gallery of the Windows Azure Management Portal.
- Create and upload a VHD file that contains an image to Windows Azure, and then create a virtual machine using the image. For more information about creating and uploading a custom image, see the following topics:

	- [Creating and Uploading a Virtual Hard Disk that Contains the Linux Operating System](en-us/manage/linux/common-tasks/upload-vhd/)
	- [Creating and Uploading a Virtual Hard Disk that Contains the Windows Server Operating System](en-us/manage/linux/common-tasks/upload-vhd/)