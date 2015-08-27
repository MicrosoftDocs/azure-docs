<properties writer="kathydav" editor="tysonn" manager="timlt" />


When you no longer need a data disk that's attached to a virtual machine, you can easily detach it. This removes the disk from the virtual machine, but doesn't remove it from storage. If you want to use the existing data on the disk again, you can reattach it to the same virtual machine, or another one.  

> [AZURE.NOTE] A virtual machine in Azure uses different types of disks -- an operating system disk, a local temporary disk, and optional data disks. Data disks are the recommended way to store data for a virtual machine. For details, see [About Disks and VHDs for Virtual Machines](../../virtual-machines-disks-vhds.md). It's not possible to detach an operating system disk unless you also delete the virtual machine.

## Find the disk

Before you can detach a disk from a virtual machine, you need to find out the LUN number, which is an identifier for the disk to be detached. To do that, follow these steps:

1. 	Open Azure CLI for Mac, Linux, and Windows and connect to your Azure subscription. See [Connect
    to Azure from Azure CLI](../articles/xplat-cli-connect.md) for more details.

2.  Make sure you are in Azure Service Management mode, which is the default by typing `azure config
 	mode asm`.

3. 	Find out which disks are attached to your virtual machine by using `azure vm disk list
	<virtual-machine-name>` as follows:

		$azure vm disk list ubuntuVMasm
		info:    Executing command vm disk list
		+ Fetching disk images
		+ Getting virtual machines
		+ Getting VM disks
		data:    Lun  Size(GB)  Blob-Name                         OS
		data:    ---  --------  --------------------------------  -----
		data:         30        ubuntuVMasm-2645b8030676c8f8.vhd  Linux
		data:    1    10        test.VHD
		data:    0    30        ubuntuVMasm-76f7ee1ef0f6dddc.vhd
		info:    vm disk list command OK

4. 	Note the LUN or the **logical unit number** for the disk that you want to detach.


## Detach the disk

After you find the LUN number of the disk, you're ready to detach it:

1. 	Detach the selected disk from the virtual machine by running the command `azure vm disk detach
 	<virtual-machine-name> <LUN>` like this:

		$azure vm disk detach ubuntuVMasm 0
		info:    Executing command vm disk detach
		+ Getting virtual machines
		+ Removing Data-Disk
		info:    vm disk detach command OK

2. 	You can check if the disk got detached by running this command:

		$azure vm disk list ubuntuVMasm
		info:    Executing command vm disk list
		+ Fetching disk images
		+ Getting virtual machines
		+ Getting VM disks
		data:    Lun  Size(GB)  Blob-Name                         OS
		data:    ---  --------  --------------------------------  -----
		data:         30        ubuntuVMasm-2645b8030676c8f8.vhd  Linux
		data:    1    10        test.VHD
		info:    vm disk list command OK

The detached disk remains in storage but is no longer attached to a virtual machine.
