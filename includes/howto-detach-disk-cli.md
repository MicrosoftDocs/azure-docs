<properties writer="kathydav" editor="tysonn" manager="timlt" />



#How to Detach a Data Disk from a Virtual Machine with the CLI

When you no longer need a data disk that is attached to a virtual machine, you can easily detach it. This removes the disk from the virtual machine, but doesn't remove it from storage. If you want to use the existing data on the disk again, you can reattach it to the same virtual machine, or another one.

> [AZURE.NOTE] A virtual machine in Azure uses different types of disks: an operating system disk, a local temporary disk, and optional data disks. Data disks are the recommended way to store data for a virtual machine. For details about disks, see [About disks and images](http://go.microsoft.com/fwlink/p/?LinkId=263439). It is not currently possible to detach an operating system disk.


1. Get the list of disks attached to your VM:

        vm disk list <vm-name>

    If you omit `<vm-name>`, you will get a list of all disks in your subscription.


2. Detach a disk:

        vm disk detach <vm-name> <lun>

    `lun` identifies the disk to be detached, and will be a number which can be found in your VM's disk list.

Sample walkthrough including terminal output:

    ~$ azure vm disk list kmlinux
    info:    Executing command vm disk list
    + Fetching disk images
    + Getting virtual machines
    + Getting VM disks
    data:    Lun  Size(GB)  Blob-Name                               OS
    data:    ---  --------  --------------------------------------  -----
    data:         30        kmlinux-kmlinux-2015-02-05.vhd          Linux
    data:    1    5         kmlinux-f8ef0006ab182209.vhd
    data:    2    7         kmlinux-602362868dbb7439.vhd
    info:    vm disk list command OK
    ~$ azure vm disk detach kmlinux 2
    info:    Executing command vm disk detach
    + Getting virtual machines
    + Removing Data-Disk
    info:    vm disk detach command OK
    ~$ azure vm disk list kmlinux
    info:    Executing command vm disk list
    + Fetching disk images
    + Getting virtual machines
    + Getting VM disks
    data:    Lun  Size(GB)  Blob-Name                               OS
    data:    ---  --------  --------------------------------------  -----
    data:         30        kmlinux-kmlinux-2015-02-05.vhd          Linux
    data:    1    5         kmlinux-f8ef0006ab182209.vhd
    info:    vm disk list command OK
