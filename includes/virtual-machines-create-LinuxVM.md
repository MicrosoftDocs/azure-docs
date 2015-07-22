1. Sign in to your Azure subscription using the steps listed in [Connect to Azure from the Azure CLI](../articles/xplat-cli-connect.md).
2. Make sure you are in the Service Management mode by using:

        azure config mode asm

3. Find out the Linux image that you want to load from the available images:

        azure vm image list | grep "Linux"

4. Use `azure vm create` to create a new virtual machine with the Linux image from the above list. For more details on this command, visit the [Using the Azure CLI with Azure Service Management](../articles/virtual-machines/virtual-machines-command-line-tools.md)

        ~$ azure vm create "MyTestVM" b4590d9e3ed742e4a1d46e5424aa335e__suse-opensuse-13.1-20141216-x86-64 "adminUser" -z "Small" -e -l "West US"
        info:    Executing command vm create
        + Looking up image b4590d9e3ed742e4a1d46e5424aa335e__suse-opensuse-13.1-20141216-x86-64
        Enter VM 'adminUser' password:*********
        Confirm password: *********
        + Looking up cloud service
        info:    cloud service MyTestVM not found.
        + Creating cloud service
        + Retrieving storage accounts
        + Creating a new storage account 'mytestvm1437604756125'
        + Creating VM
        info:    vm create command OK

This step creates a new cloud service as well as a new storage account. You could also connect this virtual machine to an existing cloud service with a `-c` option. It also creates an SSH endpoint to login to the Linux virtual machine with the `-e` option.

5. The newly created Linux virtual machine will appear in the list given by:

        azure vm list

6. You can verify the attributes of the virtual machine by using the command:

        azure vm show MyTestVM

7. The newly created virtual machine is ready to start with the `azure vm start` command.

For details on all these Azure CLI virtual machine commands, please read the [Using the Azure CLI with Azure Service Management](../articles/virtual-machines/virtual-machines-command-line-tools.md).
