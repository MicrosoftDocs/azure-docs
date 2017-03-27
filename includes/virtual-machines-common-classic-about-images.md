

Images are used in Azure to provide a new virtual machine with an operating system. An image might also have one or more data disks. Images are available from several sources:

* Azure offers images in the [Marketplace](https://azure.microsoft.com/gallery/virtual-machines/). There are recent versions of Windows Server and distributions of the Linux operating system. Some images also contain applications, such as SQL Server. MSDN Benefit and MSDN Pay-as-You-Go subscribers have access to additional images.
* The open source community offers images through [VM Depot](http://vmdepot.msopentech.com/List/Index).
* You also can store and use your own images in Azure, by either capturing an existing Azure virtual machine for use as an image or uploading an image.

## About VM images and OS images
Two types of images can be used in Azure: *VM image* and *OS image*. A VM image includes an operating system and all disks attached to a virtual machine when the image is created. A VM image is the newer type of image. Before VM images were introduced, an image in Azure could have only a generalized operating system and no additional disks. A VM image that contains only a generalized operating system is basically the same as the original type of image, the OS image.

You can create your own images, based on a virtual machine in Azure, or a virtual machine running elsewhere that you copy and upload. If you want to use an image to create more than one virtual machine, you need to prepare it for use as an image by generalizing it. To create a Windows Server image, run the Sysprep command on the server to generalize it before you upload the .vhd file. For details about Sysprep, see [How to Use Sysprep: An Introduction](http://go.microsoft.com/fwlink/p/?LinkId=392030) and [Sysprep Support for Server Roles](https://msdn.microsoft.com/windows/hardware/commercialize/manufacture/desktop/sysprep-support-for-server-roles). Back up the VM before running Sysprep. Creating a Linux image varies by distribution. Typically, you need to run a set of commands that are specific to the distribution, and run the Azure Linux Agent.
