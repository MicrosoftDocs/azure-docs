<properties 
	pageTitle="Injecting Custom Data into Azure Virtual Machines" 
	description="This topic describes how to inject custom data into an Azure Virtual Machine when the instance is created and how to locate the custom data on either Windows or Linux." 
	services="virtual-machines" 
	documentationCenter="" 
	authors="squillace" 
	manager="timlt" 
	editor="tysonn"/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-windows" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/07/2015" 
	ms.author="rasquill"/>


#Injecting Custom Data into an Azure Virtual Machine 

Injecting a script or other data into an Azure Virtual Machine when it is being provisioned is a very common scenario, regardless whether the operating system is Microsoft Windows or a Linux distribution. This topic describes how to:

- Inject data into an Azure Virtual Machine when it is being provisioned

- Retrieve it for both Windows and Linux, and 

- Use special tools available on some systems to detect and handle custom data automatically.

> [AZURE.NOTE] This topic expands upon [this Azure blog post](http://azure.microsoft.com/blog/2014/04/21/custom-data-and-cloud-init-on-windows-azure/) about this feature, and will be kept up-to-date as more functionality appears.

## Injecting the custom data into your Azure Virtual Machine

This feature is currently supported only in the [Microsoft Azure Cross-Platform Command-Line Interface](https://github.com/Azure/azure-sdk-tools-xplat). Although you may use any of the options for the `azure vm create` command, the following approach demonstrates one very basic approach. 

```
    PASSWORD='AcceptablePassword -- more than 8 chars, a cap, a num, a special'
    VMNAME=mycustomdataubuntu
    USERNAME=username
    VMIMAGE= An image chosen from among those listed by azure vm image list
    azure vm create $VMNAME $VMIMAGE $USERNAME $PASSWORD --location "West US" --json -d ./custom-data.txt -e 22
```


## Using Custom Data in the Virtual Machine
 
+ If your Azure Virtual Machine is a Windows Virtual Machine, then the custom data file is saved to `%SYSTEMDRIVE%\AzureData\CustomData.bin` and although it was base64-encoded to transfer from the local computer to the new Virtual Machine, it is automatically decoded and can be opened or used immediately. 

   > [AZURE.NOTE] If the file exists, it is overwritten. The security on directory is set to **System:Full Control** and **Administrators:Full Control**.

+ If your Azure Virtual Machine is a Linux Virtual Machine, then the custom data file will be located in the following two places, but the data will be base64-encoded, so you will need to decode the data first.

    + At `/var/lib/waagent/ovf-env.xml`
    + At `/var/lib/waagent/CustomData` 



## Cloud-Init on Azure

If your Azure Virtual Machine is from an Ubuntu or CoreOS image, then you can use CustomData to send a cloud-config to cloud-init. Or if your custom data file is a script then cloud-init can simply execute it.

### Ubuntu Cloud Images

In most Azure Linux images you would edit "/etc/waagent.conf" to configure the temporary resource disk and swap file. See [Azure Linux Agent User Guide](./virtual-machines-linux-agent-user-guide.md) for more information.

However, on the Ubuntu Cloud Images we must use cloud-init to configure the resource disk (aka "ephemeral" disk) and swap partition.  Please see the following page on the Ubuntu wiki for more details:

 - [Ubuntu Wiki: Configure Swap Partitions](http://go.microsoft.com/fwlink/?LinkID=532955&clcid=0x409)


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps: Using cloud-init

For further information, see the [cloud-init documentation for Ubuntu](https://help.ubuntu.com/community/CloudInit).

<!--Link references-->
[Add Role Service Management REST API Reference](http://msdn.microsoft.com/library/azure/jj157186.aspx)

[Microsoft Azure Cross-Platform Command-line Interface](https://github.com/Azure/azure-sdk-tools-xplat)

