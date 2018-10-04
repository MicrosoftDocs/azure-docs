
1. Sign in to your Azure subscription using the steps listed in [Connect to Azure from the Azure classic CLI](/cli/azure/authenticate-azure-cli).

2. Make sure you are in the Classic deployment mode as follows:

    ```azurecli
    azure config mode asm
    ```

3. Find out the Linux image that you want to load from the available images as follows:

   ```azurecli   
    azure vm image list | grep "Linux"
    ```
   
    In a Windows command-prompt window, use **find** instead of grep.
   
4. Use `azure vm create` to create a VM with the Linux image from the previous list. This step creates a cloud service and storage account. You could also connect this VM to an existing cloud service with a `-c` option. Create an SSH endpoint to log in to the Linux virtual machine with the `-e` option. The following example creates a VM named `myVM` using the `Ubuntu-14_04_4-LTS` image in the `West US` location, and adds a user name `ops`:
   
    ```azurecli
    azure vm create myVM \
        b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_04_4-LTS-amd64-server-20160516-en-us-30GB \
        -g ops -p P@ssw0rd! -z "Small" -e -l "West US"
    ```

    The output is similar to the following example:

    ```azurecli
    info:    Executing command vm create
    + Looking up image b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_04_4-LTS-amd64-server-20160516-en-us-30GB
    + Looking up cloud service
    info:    cloud service myVM not found.
    + Creating cloud service
    + Retrieving storage accounts
    + Creating VM
    info:    vm create command OK
    ```
   
   > [!NOTE]
   > For a Linux virtual machine, you must provide the `-e` option in `vm create`. It is not possible to enable SSH after the virtual machine has been created. For more details on SSH, read [How to Use SSH with Linux on Azure](../articles/virtual-machines/linux/mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

5. You can verify the attributes of the VM by using the `azure vm show` command. The following example lists information for the VM named `myVM`:

    ```azurecli   
    azure vm show myVM
    ```

6. Start your VM with the `azure vm start` command as follows:

    ```azurecli
    azure vm start myVM
    ```

## Next steps
For details on all these Azure classic CLI virtual machine commands, read the [Using the Azure classic CLI with the Classic deployment API](https://docs.microsoft.com/cli/azure/get-started-with-az-cli2).

