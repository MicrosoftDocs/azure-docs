<properties title="virtual-machines-how-to-inject-custom-data" pageTitle="Injecting Custom Data into Azure Virtual Machines" description="This topic describes how to inject custom data into an Azure Virtual Machine when the instance is created and how to locate the custom data on either Windows or Linux." metaKeywords="Azure linux vm, linux vm, userdata vm, user data vm, custom data vm, windows custom data" services="virtual-machines" solutions="" documentationCenter="" authors="rasquill" manager="timlt" editor="tysonn" videoId="" scriptId="" />

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-windows" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="rasquill" />



#Injecting Custom Data into an Azure Virtual Machine 

Injecting a script or other data into an Azure Virtual Machine when it is being provisioned is a very common scenario, regardless whether the operating system is Microsoft Windows or a Linux distribution. This topic describes how to:

- Inject data into an Azure Virtual Machine when it is being provisioned

- Retrieve it for both Windows and Linux, and 

- Use special tools available on some systems to detect and handle custom data automatically.

> [WACOM.NOTE] This topic expands upon [this Azure blog post](http://azure.microsoft.com/blog/2014/04/21/custom-data-and-cloud-init-on-windows-azure/) about this feature, and will be kept up-to-date as more functionality appears.

<!--Table of contents for topic, the words in brackets must match the heading wording exactly-->
In this topic:

+ [Injecting the Custom Data into your Azure Virtual Machine](#injectingCustomData)

+ [Using Custom Data in the Virtual Machine](#usingCustomData)

+ [Next steps](#nextsteps)


## <a id="injectingCustomData"></a>Injecting the Custom Data into your Azure Virtual Machine

This feature is currently supported only in the [Microsoft Azure Cross-Platform Command-Line Interface](https://github.com/Azure/azure-sdk-tools-xplat). Although you may use any of the options for the `azure vm create` command, the following approach demonstates one very basic approach. 

```
    PASSWORD='AcceptablePassword -- more than 8 chars, a cap, a num, a special'
    VMNAME=mycustomdataubuntu
    USERNAME=username
    VMIMAGE= An image chosen from among those listed by azure vm image list
    azure vm create $VMNAME $VMIMAGE $USERNAME $PASSWORD --location "West US" --json -d ./custom-data.txt -e 22
```


## <a id="usingCustomData"></a>Using Custom Data in the Virtual Machine
 
+ If your Azure Virtual Machine is a Windows Virtual Machine, then the custom data file is saved to `%SYSTEMDRIVE%\AzureData\CustomData.bin` and although it was base64-encoded to transfer from the local computer to the new Virtual Machine, it is automatically decoded and can be opened or used immediately. 

   > [WACOM.NOTE] If the file exists, it is overwritten. The security on directory is set to **System:Full Control** and **Administrators:Full Control**.

+ If your Azure Virtual Machine is a Linux Virtual Machine, then the custom data file will be located in the following two places, but the data will be base64-encoded, so you will need to decode the data first.

    + At `/var/lib/waagent/ovf-env.xml`
    + At `/var/lib/waagent/CustomData` 

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## <a id="nextsteps"></a>Next steps: Using cloud-init

If your Azure Virtual Machine is an Ubuntu image, then you can use cloud-init to launch a script to use your custom data automatically (or, if your custom data file is a script, execute it). For further information, see the [cloud-init documentation for Ubuntu](https://help.ubuntu.com/community/CloudInit).

<!--Link references-->
[Add Role Service Management REST API Reference](http://msdn.microsoft.com/library/azure/jj157186.aspx)

[Microsoft Azure Cross-Platform Command-line Interface](https://github.com/Azure/azure-sdk-tools-xplat)

