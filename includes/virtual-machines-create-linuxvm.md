
1. Sign in to your Azure subscription using the steps listed in [Connect to Azure from the Azure CLI](../articles/xplat-cli-connect.md).
2. Make sure you are in the Classic deployment mode by using:
   
        azure config mode asm
3. Find out the Linux image that you want to load from the available images:
   
        azure vm image list | grep "Linux"
   
   In a Windows command-prompt window, use **find** instead of grep.
4. Use `azure vm create` to create a new virtual machine with the Linux image from the previous list. This step creates a new cloud service and storage account. You could also connect this virtual machine to an existing cloud service with a `-c` option. It also creates an SSH endpoint to log in to the Linux virtual machine with the `-e` option.
   
        ~$ azure vm create "MyTestVM" b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_04_4-LTS-amd64-server-20160516-en-us-30GB -g adminUser -p P@ssw0rd! -z "Small" -e -l "West US"
        info:    Executing command vm create
        + Looking up image b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_04_4-LTS-amd64-server-20160516-en-us-30GB
        + Looking up cloud service
        info:    cloud service MyTestVM not found.
        + Creating cloud service
        + Retrieving storage accounts
        + Creating VM
        info:    vm create command OK
   
   > [!NOTE]
   > For a Linux virtual machine, you must provide the `-e` option in `vm create`. It is not possible to enable SSH after the virtual machine has been created. For more details on SSH, read [How to Use SSH with Linux on Azure](../articles/virtual-machines/virtual-machines-linux-mac-create-ssh-keys.md).
   > 
   > 
   
    The image *b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_04_4-LTS-amd64-server-20160516-en-us-30GB* is the one we chose from the image list in the previous step. *MyTestVM* is the name of our new virtual machine, and *adminUser* is the username to SSH into the virtual machine. You can replace these variables as per your requirement. For more details on this command, visit the [Using the Azure CLI with Classic deployment model](../articles/virtual-machines-command-line-tools.md).
5. The newly created Linux virtual machine appears in the list given by:
   
        azure vm list
6. You can verify the attributes of the virtual machine by using the command:
   
        azure vm show MyTestVM
7. The newly created virtual machine is ready to start with the `azure vm start` command.

## Next steps
For details on all these Azure CLI virtual machine commands, read the [Using the Azure CLI with the Classic deployment API](../articles/virtual-machines-command-line-tools.md).

