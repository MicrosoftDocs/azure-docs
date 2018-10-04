For more information about disks, see [About Disks and VHDs for Virtual Machines](../articles/virtual-machines/linux/about-disks-and-vhds.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

<a id="attachempty"></a>

## Attach an empty disk
1. Open Azure classic CLI and [connect to your Azure subscription](/cli/azure/authenticate-azure-cli). Make sure you are in Azure Service Management mode (`azure config mode asm`).
2. Enter `azure vm disk attach-new` to create and attach a new disk as shown in the following example. Replace *myVM* with the name of your Linux Virtual Machine and specify the size of the disk in GB, which is *100GB* in this example:

    ```azurecli
    azure vm disk attach-new myVM 100
    ```

3. After the data disk is created and attached, it's listed in the output of `azure vm disk list <virtual-machine-name>` as shown in the following example:
   
    ```azurecli
    azure vm disk list TestVM
    ```

    The output is similar to the following example:

    ```bash
    info:    Executing command vm disk list
   
   * Fetching disk images
   * Getting virtual machines
   * Getting VM disks
     data:    Lun  Size(GB)  Blob-Name                         OS
     data:    ---  --------  --------------------------------  -----
     data:         30        myVM-2645b8030676c8f8.vhd  Linux
     data:    0    100       myVM-76f7ee1ef0f6dddc.vhd
     info:    vm disk list command OK
    ```

<a id="attachexisting"></a>

## Attach an existing disk
Attaching an existing disk requires that you have a .vhd available in a storage account.

1. Open Azure classic CLI and [connect to your Azure subscription](/cli/azure/authenticate-azure-cli). Make sure you are in Azure Service Management mode (`azure config mode asm`).
2. Check if the VHD you want to attach is already uploaded to your Azure subscription:
   
    ```azurecli
    azure vm disk list
    ```

    The output is similar to the following example:

    ```azurecli
     info:    Executing command vm disk list
   
   * Fetching disk images
     data:    Name                                          OS
     data:    --------------------------------------------  -----
     data:    myTestVhd                                     Linux
     data:    TestVM-ubuntuVMasm-0-201508060029150744  Linux
     data:    TestVM-ubuntuVMasm-0-201508060040530369
     info:    vm disk list command OK
    ```

3. If you don't find the disk that you want to use, you may upload a local VHD to your subscription by using
   `azure vm disk create` or `azure vm disk upload`. An example of `disk create` would be as in the following example:
   
    ```azurecli
    azure vm disk create myVhd .\TempDisk\test.VHD -l "East US" -o Linux
    ```

    The output is similar to the following example:

    ```azurecli
    info:    Executing command vm disk create
    + Retrieving storage accounts
    info:    VHD size : 10 GB
    info:    Uploading 10485760.5 KB
    Requested:100.0% Completed:100.0% Running:   0 Time:   25s Speed:    82 KB/s
    info:    Finishing computing MD5 hash, 16% is complete.
    info:    https://mystorageaccount.blob.core.windows.net/disks/myVHD.vhd was
    uploaded successfully
    info:    vm disk create command OK
    ```
   
   You may also use `azure vm disk upload` to upload a VHD to a specific storage account. Read more about the commands to manage your Azure virtual machine data disks [over here](https://docs.microsoft.com/cli/azure/get-started-with-az-cli2).

4. Now you attach the desired VHD to your virtual machine:
   
    ```azurecli
    azure vm disk attach myVM myVhd
    ```
   
   Make sure to replace *myVM* with the name of your virtual machine, and *myVHD* with your desired VHD.

5. You can verify the disk is attached to the virtual machine with `azure vm disk list <virtual-machine-name>`:
   
    ```azurecli
    azure vm disk list myVM
    ```

    The output is similar to the following example:

    ```azurecli
     info:    Executing command vm disk list
   
   * Fetching disk images
   * Getting virtual machines
   * Getting VM disks
     data:    Lun  Size(GB)  Blob-Name                         OS
     data:    ---  --------  --------------------------------  -----
     data:         30        TestVM-2645b8030676c8f8.vhd  Linux
     data:    1    10        test.VHD
     data:    0    100        TestVM-76f7ee1ef0f6dddc.vhd
     info:    vm disk list command OK
    ```

> [!NOTE]
> After you add a data disk, you'll need to log on to the virtual machine and initialize the disk so the virtual machine can use the disk for storage (see the following steps for more information on how to do initialize the disk).
> 
> 

