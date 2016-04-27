


This topic describes how to:

- Inject data into an Azure virtual machine (VM) when it is being provisioned.

- Retrieve it for both Windows and Linux.

- Use special tools available on some systems to detect and handle custom data automatically.

> [AZURE.NOTE] This article describes how custom data can be injected by using a VM created with the Azure Service Management API. To see how to use the Azure Resource Management API, see [the example template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-customdata).

## Injecting custom data into your Azure virtual machine

This feature is currently supported only in the [Azure Command-Line Interface](https://github.com/Azure/azure-xplat-cli). Here we create a `custom-data.txt` file that contains our data, then inject that in to the VM during provisioning. Although you may use any of the options for the `azure vm create` command, the following demonstrates one very basic approach:

```
    azure vm create <vmname> <vmimage> <username> <password> \  
    --location "West US" --ssh 22 \  
    --custom-data ./custom-data.txt  
```


## Using custom data in the virtual machine

+ If your Azure VM is a Windows-based VM, then the custom data file is saved to `%SYSTEMDRIVE%\AzureData\CustomData.bin`. Although it was base64-encoded to transfer from the local computer to the new VM, it is automatically decoded and can be opened or used immediately.

   > [AZURE.NOTE] If the file exists, it is overwritten. The security on the directory is set to **System:Full Control** and **Administrators:Full Control**.

+ If your Azure VM is a Linux-based VM, then the custom data file will be located in one of the following places depending on your distro. The data may be base64-encoded, so you may need to decode the data first:

    - `/var/lib/waagent/ovf-env.xml`
    - `/var/lib/waagent/CustomData`
    - `/var/lib/cloud/instance/user-data.txt` 



## Cloud-init on Azure

If your Azure VM is from an Ubuntu or CoreOS image, then you can use CustomData to send a cloud-config to cloud-init. Or if your custom data file is a script, then cloud-init can simply execute it.

### Ubuntu Cloud Images

In most Azure Linux images, you would edit "/etc/waagent.conf" to configure the temporary resource disk and swap file. See [Azure Linux Agent user guide](../articles/virtual-machines/virtual-machines-linux-agent-user-guide.md) for more information.

However, on the Ubuntu Cloud Images, you must use cloud-init to configure the resource disk (that is, the "ephemeral" disk) and swap partition. See the following page on the Ubuntu wiki for more details: [AzureSwapPartitions](https://wiki.ubuntu.com/AzureSwapPartitions).



<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps: Using cloud-init

For further information, see the [cloud-init documentation for Ubuntu](https://help.ubuntu.com/community/CloudInit).

<!--Link references-->
[Add Role Service Management REST API Reference](http://msdn.microsoft.com/library/azure/jj157186.aspx)

[Azure Command-line Interface](https://github.com/Azure/azure-xplat-cli)
