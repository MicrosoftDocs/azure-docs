---
 title: Custom data and Azure virtual machines
 description: This article gives details on using custom data and cloud-init on Azure virtual machines.
 services: virtual-machines
 author: mimckitt
 ms.service: virtual-machines
 ms.topic: how-to
 ms.date: 02/24/2023
 ms.author: mimckitt
 ms.reviewer: mattmcinnes
---

# Custom data and cloud-init on Azure Virtual Machines

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets

You might need to inject a script or other metadata into a Microsoft Azure virtual machine (VM) at provisioning time. In other clouds, this concept is often called  *user data*. Microsoft Azure has a similar feature called *custom data*. 

Custom data is made available to the VM during first startup or setup, which is called *provisioning*. Provisioning is the process where VM creation parameters (for example, host name, username, password, certificates, custom data, and keys) are made available to the VM. A provisioning agent, such as the [Linux Agent](./extensions/agent-linux.md) or [cloud-init](./linux/using-cloud-init.md#troubleshooting-cloud-init), processes those parameters. 

## Pass custom data to the VM
To use custom data, you must Base64-encode the contents before passing the data to the API--unless you're using a CLI tool that does the conversion for you, such as the Azure CLI. The size can't exceed 64 KB.

In the CLI, you can pass your custom data as a file, as the following example shows. The file is converted to Base64.

```azurecli
az vm create \
  --resource-group myResourceGroup \
  --name centos74 \
  --image OpenLogic:CentOS-CI:7-CI:latest \
  --custom-data cloud-init.txt \
  --generate-ssh-keys
```

In Azure Resource Manager, there's a [base64 function](../azure-resource-manager/templates/template-functions-string.md#base64):

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

## Process custom data
The provisioning agents installed on the VMs handle communication with the platform and placing data on the file system. 

### Windows
Custom data is placed in *%SYSTEMDRIVE%\AzureData\CustomData.bin* as a binary file, but it isn't processed. If you want to process this file, you need to build a custom image and write code to process *CustomData.bin*.

### Linux  
On Linux operating systems, custom data is passed to the VM via the *ovf-env.xml* file. That file is copied to the */var/lib/waagent* directory during provisioning. Newer versions of the Linux Agent copy the Base64-encoded data to */var/lib/waagent/CustomData* for convenience.

Azure currently supports two provisioning agents:

* **Linux Agent**. By default, the agent doesn't process custom data. You need to build a custom image with the data enabled. The [relevant settings](https://github.com/Azure/WALinuxAgent#configuration) are:
  
  * `Provisioning.DecodeCustomData`
  * `Provisioning.ExecuteCustomData`

  When you enable custom data and run a script, the virtual machine will not report a successful VM provision until the script has finished executing. If the script exceeds the total VM provisioning time limit of 40 minutes, VM creation fails. 
  
  If the script fails to run, or errors happen during execution, that's not a fatal provisioning failure. You need to create a notification path to alert you for the completion state of the script.

  To troubleshoot custom data execution, review */var/log/waagent.log*.

* **cloud-init**. By default, this agent processes custom data. It accepts [multiple formats](https://cloudinit.readthedocs.io/en/latest/topics/format.html) of custom data, such as cloud-init configuration and scripts. 

  Similar to the Linux Agent, if errors happen during execution of the configuration processing or scripts when cloud-init is processing the custom data, that's not a fatal provisioning failure. You need to create a notification path to alert you for the completion state of the script. 
  
  However, unlike the Linux Agent, cloud-init doesn't wait for custom data configurations from the user to finish before reporting to the platform that the VM is ready. For more information on cloud-init on Azure, including troubleshooting, see [cloud-init support for virtual machines in Azure](./linux/using-cloud-init.md).


## FAQ
### Can I update custom data after the VM has been created?
For single VMs, you can't update custom data in the VM model. But for Virtual Machine Scale Sets, you can update custom data. For more information, see [Modify a Scale Set](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-scale-set.md#how-to-update-global-scale-set-properties). When you update custom data in the model for a Virtual Machine Scale Set:

* Existing instances in the scale set don't get the updated custom data until they're updated to the lastest model and reimaged.
* New instances receive the new custom data.

### Can I place sensitive values in custom data?
We advise *not* to store sensitive data in custom data. For more information, see [Azure data security and encryption best practices](../security/fundamentals/data-encryption-best-practices.md).

### Is custom data made available in IMDS?
Custom data isn't available in Azure Instance Metadata Service (IMDS). We suggest using user data in IMDS instead. For more information, see [User data through Azure Instance Metadata Service](./linux/instance-metadata-service.md?tabs=linux#get-user-data).
