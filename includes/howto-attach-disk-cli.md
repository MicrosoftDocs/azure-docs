
For more information about disks, see [About Virtual Machine Disks in Azure](http://go.microsoft.com/fwlink/p/?LinkId=403697).

##<a id="cliattachempty"></a>How to: Attach an empty disk
Attaching an empty disk is the simpler way to add a data disk. Run the following command to attach a new empty disk:

    vm disk attach-new <vm-name> <size-in-gb> [blob-url]

Replace `vm-name` with the name of your virtual machine, and `size-in-gb` with the size of your new disk. You can optionally use a blob URL as the last argument to explicitly specify the target blob to create. If you do not specify a blob URL, a blob object will be automatically generated.  

Run the following command to verify that your disk has been created:

    vm disk list <vm-name>

Here is a sample walkthrough of the above commands including terminal output:

    ~$ azure vm disk attach-new pinkylinux 20 http://pinkylinux.blob.core.windows.net/vhds/pinkydisk1.vhd
    info:   Executing command vm disk attach-new
    + Getting virtual machines
    + Adding Data-Disk
    info:   vm disk attach-new command OK
    ~$ azure vm disk list pinkylinux
    info:    Executing command vm disk list
    + Fetching disk images
    + Getting virtual machines
    + Getting VM disks
    data:    Lun  Size(GB)  Blob-Name                               OS
    data:    ---  --------  --------------------------------------  -----
    data:         30        pinkylinux-pinkylinux-2015-02-05.vhd    Linux
    data:    0    5         pinkydisk1.vhd
    data:    1    20        pinkylinux-f8ef0006ab182209.vhd
    info:    vm disk list command OK
