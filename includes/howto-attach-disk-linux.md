
For more details about disks, see [About Disks and VHDs for Virtual Machines](../articles/virtual-machines-disks-vhds.md).

<a id="attachempty"></a>
## How to: Attach an empty disk
Attaching an empty disk is the simpler way to add a data disk, because Azure creates the .vhd file for you and stores it in the storage account.

1.  Open Azure CLI for Mac, Linux, and Windows and connect to your Azure subscription. See [Connect
    to Azure from Azure CLI](../articles/xplat-cli-connect.md) for more details.

2.  Make sure you are in Azure Service Management mode, which is the default by typing `azure config
 	mode asm`.

3.  Use the command `azure vm disk attach-new` to create and attach a new disk as shown below. Note that the
    _ubuntuVMasm_ will be replaced by the name of the Linux Virtual Machine that you have created in your subscription. The number 30 is the size of the disk in GB in this example.

        azure vm disk attach-new ubuntuVMasm 30

4.	After the data disk is created and attached, it's listed in the output of `azure vm disk list
    <virtual-machine-name>` like this:

        $ azure vm disk list ubuntuVMasm
        info:    Executing command vm disk list
        + Fetching disk images
        + Getting virtual machines
        + Getting VM disks
        data:    Lun  Size(GB)  Blob-Name                         OS
        data:    ---  --------  --------------------------------  -----
        data:         30        ubuntuVMasm-2645b8030676c8f8.vhd  Linux
        data:    0    30        ubuntuVMasm-76f7ee1ef0f6dddc.vhd
        info:    vm disk list command OK

<a id="attachexisting"></a>
## How to: Attach an existing disk

Attaching an existing disk requires that you have a .vhd available in a storage account.

1. 	Open Azure CLI for Mac, Linux, and Windows and connect to your Azure subscription. See [Connect
    to Azure from Azure CLI](../articles/xplat-cli-connect.md) for more details.

2.  Make sure you are in Azure Service Management mode, which is the default. If you have changed
    mode to Resource Management, simply revert by typing `azure config mode asm`.

3.	Find out if the VHD you want to attach is already uploaded to your Azure subscription by using:

        $azure vm disk list
    	info:    Executing command vm disk list
    	+ Fetching disk images
    	data:    Name                                          OS
    	data:    --------------------------------------------  -----
    	data:    myTestVhd                                     Linux
    	data:    ubuntuVMasm-ubuntuVMasm-0-201508060029150744  Linux
    	data:    ubuntuVMasm-ubuntuVMasm-0-201508060040530369
    	info:    vm disk list command OK

4.  If you don't find the disk that you want to use, you may upload a local VHD to your subscription by using
    `azure vm disk create` or `azure vm disk upload`. An example would be this:

        $azure vm disk create myTestVhd2 .\TempDisk\test.VHD -l "East US" -o Linux
		info:    Executing command vm disk create
		+ Retrieving storage accounts
		info:    VHD size : 10 GB
		info:    Uploading 10485760.5 KB
		Requested:100.0% Completed:100.0% Running:   0 Time:   25s Speed:    82 KB/s
		info:    Finishing computing MD5 hash, 16% is complete.
		info:    https://portalvhdsq1s6mc7mqf4gn.blob.core.windows.net/disks/test.VHD was
		uploaded successfully
		info:    vm disk create command OK

	You may also use the `azure vm disk upload` command to upload a VHD to a specific storage account. Read more about the commands to manage your Azure virtual machine data disks [over here](../virtual-machines-command-line-tools.md#commands-to-manage-your-azure-virtual-machine-data-disks).

5.  Type the following command to attach the desired uploaded VHD to your virtual machine:

		$azure vm disk attach ubuntuVMasm myTestVhd
		info:    Executing command vm disk attach
		+ Getting virtual machines
		+ Adding Data-Disk
		info:    vm disk attach command OK

	Make sure to replace _ubuntuVMasm_ with the name of your virtual machine, and _myTestVhd_ with your desired VHD.

6.	You can verify if the disk is attached to the virtual machine with the command `azure vm disk list
 	<virtual-machine-name>` as:

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


> [AZURE.NOTE]
> After you add a data disk, you'll need to log on to the virtual machine and initialize the disk so the virtual machine can use the disk for storage.
