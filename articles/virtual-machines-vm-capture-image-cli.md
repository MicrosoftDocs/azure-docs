<properties
	pageTitle="Capture an image of a virtual machine running Linux using the CLI"
	description="Learn how to capture an image of an Azure virtual machine (VM) running Linux."
	services="virtual-machines"
	documentationCenter=""
	authors="karthmut"
	manager="madhana"
	editor="tysonn"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/20/2015"
	ms.author="karthmut"/>




# How to Capture a Linux Virtual Machine to Use as a Template with the CLI##



This article shows you how to capture an Azure virtual machine running Linux so you can use it like a template to create other virtual machines. This template includes the OS disk and any data disks attached the virtual machine. It doesn't include networking configuration, so you'll need to configure that when you create the other virtual machines that use the template.



Azure treats this template as an image and stores it in your image list. This is also where any images you've uploaded are stored. For more information about images, see [About Virtual Machine Images in Azure] [].



##Before You Begin##



These steps assume that you've already created an Azure virtual machine and configured the operating system, including attaching any data disks. If you haven't done this yet, see these instructions:



- [How to Create a Custom Virtual Machine] []

- [How to Attach a Data Disk to a Virtual Machine] []



##Capture the Virtual Machine##



1. Connect to the virtual machine. For details, see [How to Log on to a Virtual Machine Running Linux][].



2. The VM can only be captured if the state is **StoppedDeallocated**. In the SSH window, type the following command to shutdown your VM:



        vm shutdown [options] <vm-name>



    Note that one of the options for `vm shutdown` is `-p`, which will keep the compute resource upon showdown. Do **not** enable this, as the VM must be deprovisioned in order to capture it.



3. Run the following command to capture your VM image:



        vm capture <vm-name> <target-image-name> --deleted



    The VM must be deleted in order to capture the image. You can use `--deleted` or `-t` to do so.



4. You can confirm that your image has been captured by checking your VM image list:



        vm image list | grep <target-image-name>



    The `| grep <target-image-name>` portion is optional, but will help you find your image more easily in the list.



Here is a sample walkthrough of capturing a virtual machine including terminal output:


    ~$ azure vm list

    info:    Executing command vm list

    + Getting virtual machines

    data:    Name         Status            Location  DNS Name                  IP Address

    data:    -----------  ----------------  --------  ------------------------  ------------

    data:    kmorig       RoleStateUnknown  West US   kmorig.cloudapp.net       100.92.56.16

    info:    vm list command OK

    ~$ azure vm shutdown kmorig

    info:    Executing command vm shutdown

    + Getting virtual machines

    + Shutting down VM

    info:    vm shutdown command OK

    ~$ azure vm list

    info:    Executing command vm list

    + Getting virtual machines

    data:    Name         Status              Location  DNS Name                  IP Address

    data:    -----------  ------------------  --------  ------------------------  ----------

    data:    kmorig       StoppedDeallocated  West US   kmorig.cloudapp.net

    info:    vm list command OK

    ~$ azure vm capture kmorig kmcaptured --deleted

    info:    Executing command vm capture

    + Getting virtual machines

    + Checking image with name kmcaptured exists

    + Capturing VM

    info:    vm capture command OK

    ~$ azure vm image list | grep kmcaptured

    data:    kmcaptured



Visit the [Azure CLI documentation page][] for more details and additional commands.


[Azure CLI documentation page]: virtual-machines-command-line-tools.md

[How to Log on to a Virtual Machine Running Linux]: virtual-machines-linux-how-to-log-on.md

[About Virtual Machine Images in Azure]: http://msdn.microsoft.com/library/azure/dn790290.aspx

[How to Create a Custom Virtual Machine]: virtual-machines-create-custom.md

[How to Attach a Data Disk to a Virtual Machine]: storage-windows-attach-disk.md
