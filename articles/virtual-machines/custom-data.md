---
 title: Custom data and Azure Virtual Machines
 description: Details on using Custom data and Cloud-Init on Azure Virtual Machines
 services: virtual-machines
 author: mimckitt
 ms.service: virtual-machines
 ms.topic: article
 ms.date: 03/06/2020
 ms.author: mimckitt
---

# Custom data and Cloud-Init on Azure Virtual Machines

You may need to inject a script or other metadata into a Microsoft Azure virtual machine at provisioning time.  In other clouds, this concept is often referred to as user data.  In Microsoft Azure, we have a similar feature called custom data. 

Custom data is only made available to the VM during first boot/initial setup, we call this 'provisioning'. Provisioning is the process where VM Create parameters (for example, hostname, username, password, certificates, custom data, keys etc.) are made available to the VM and a provisioning agent processes them, such as the [Linux Agent](https://docs.microsoft.com/azure/virtual-machines/extensions/agent-linux) and [cloud-init](https://docs.microsoft.com/azure/virtual-machines/linux/using-cloud-init#troubleshooting-cloud-init). 


## Passing custom data to the VM
To use custom data, you must base64 encode the contents first before passing it to the API, unless you are using a CLI tool that does the conversion for you, such as AZ CLI. The size cannot exceed 64 KB.

In CLI, you can pass your custom data as a file, and it will be converted to base64.
```bash
az vm create \
  --resource-group myResourceGroup \
  --name centos74 \
  --image OpenLogic:CentOS-CI:7-CI:latest \
  --custom-data cloud-init.txt \
  --generate-ssh-keys
```

In Azure Resource Manager (ARM), there is a [base64 function](https://docs.microsoft.com/azure/azure-resource-manager/templates/template-functions-string#base64).

```json
"name": "[parameters('virtualMachineName')]",
"type": "Microsoft.Compute/virtualMachines",
"apiVersion": "2019-07-01",
"location": "[parameters('location')]",
"dependsOn": [
..],
"variables": {
        "customDataBase64": "[base64(parameters('stringData'))]"
    },
"properties": {
..
    "osProfile": {
        "computerName": "[parameters('virtualMachineName')]",
        "adminUsername": "[parameters('adminUsername')]",
        "adminPassword": "[parameters('adminPassword')]",
        "customData": "[variables('customDataBase64')]"
    	},
```

## Processing custom data
The provisioning agents installed on the VMs handle interfacing with the platform and placing it on the file system. 

### Windows
Custom data is placed in *%SYSTEMDRIVE%\AzureData\CustomData.bin* as a binary file, but it is not processed. If you wish to process this file, you will need to build a custom image, and write code to process the CustomData.bin.

### Linux  
On Linux OS's, custom data is passed to the VM via the ovf-env.xml file, which is copied to the */var/lib/waagent* directory during provisioning.  Newer versions of the Microsoft Azure Linux Agent will also copy the base64-encoded data to */var/lib/waagent/CustomData* as well for convenience.

Azure currently supports two provisioning agents:
* Linux Agent - By default the agent will not process custom data, you will need to build a custom image with it enabled. The relevant settings, as per the [documentation](https://github.com/Azure/WALinuxAgent#configuration) are:
    * Provisioning.DecodeCustomData
    * Provisioning.ExecuteCustomData

When you enable custom data, and execute a script, it will delay the VM reporting that is it ready or that provisioning has succeeded until the script has completed. If the script exceeds the total VM provisioning time allowance of 40 mins, the VM Create will fail. Note, if the script fails to execute, or errors during executing, it is not deemed a fatal provisioning failure, you will need to create a notification path to alert you for the completion state of the script.

To troubleshoot custom data execution, review */var/log/waagent.log*

* cloud-init - By default will process custom data by default, cloud-init accepts [multiple formats](https://cloudinit.readthedocs.io/en/latest/topics/format.html) of custom data, such as cloud-init configuration, scripts etc. Similar to the Linux Agent, when cloud-init processes the custom data. If there are errors during execution of the configuration processing or scripts, it is not deemed a fatal provisioning failure, and you will need to create a notification path to alert you for the completion state of the script. However, different to the Linux Agent, cloud-init does not wait on user custom data configurations to complete before reporting to the platform that the VM is ready. For more information on cloud-init on azure, review the [documentation](https://docs.microsoft.com/azure/virtual-machines/linux/using-cloud-init).


To troubleshoot custom data execution, review the troubleshooting [documentation](https://docs.microsoft.com/azure/virtual-machines/linux/using-cloud-init#troubleshooting-cloud-init).


## FAQ
### Can I update custom data after the VM has been created?
For single VMs, custom data in the VM model cannot be updated, but for VMSS, you can update VMSS custom data via [REST API](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/update) (not applicable for PS or AZ CLI clients). When you update custom data in the VMSS model:
* Existing instances in the VMSS will not get the updated custom data, only until they are reimaged.
* Existing instances in the VMSS that are upgraded will not get the updated custom data.
* New instances will receive the new custom data.

### Can I place sensitive values in custom data?
We advise **not** to store sensitive data in custom data. For more information, see [Azure Security and encryption best practices](https://docs.microsoft.com/azure/security/fundamentals/data-encryption-best-practices).


### Is custom data made available in IMDS?
No, this feature is not currently available.
