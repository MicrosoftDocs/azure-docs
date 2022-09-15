---
title: Run scripts in a Windows VM in Azure using managed Run Commands (preview)
description: This topic describes how to run scripts within an Azure Windows virtual machine by using the updated Run Command feature.
services: automation
ms.service: virtual-machines
ms.collection: windows
author: nikhilpatel909
ms.author: erd
ms.date: 09/07/2022
ms.topic: how-to  
ms.reviewer: erd
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---
# Preview: Run scripts in your Windows VM by using managed Run Commands

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 

> [!IMPORTANT]
> **Managed Run Command** is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The Run Command feature uses the virtual machine (VM) agent to scripts within an Azure Windows VM. You can use these scripts for general machine or application management. They can help you quickly diagnose and remediate VM access and network issues and get the VM back to a good state.

The *updated* managed Run Command uses the same VM agent channel to execute scripts and provides the following enhancements over the [original action orientated Run Command](run-command.md): 
- Support for updated Run Command through ARM deployment template 
- Parallel execution of multiple scripts 
- Sequential execution of scripts 
- RunCommand script can be canceled  
- User specified script timeout 
- Support for long running (hours/days) scripts 
- Passing secrets (parameters, passwords) in a secure manner


## Register for preview

You must register your subscription in order to use managed Run Command during public preview. Go to [set up preview features in Azure subscription](../../azure-resource-manager/management/preview-features.md) for registration instructions and use the feature name `RunCommandPreview`.

## Azure CLI 

The following examples use [az vm run-command](/cli/azure/vm/run-command) to run shell script on an Azure Windows VM.

### Execute a script with the VM
This command will deliver the script to the VM, execute it, and return the captured output.

```azurecli-interactive
az vm run-command create --name "myRunCommand" --vm-name "myVM" --resource-group "myRG" --script "Write-Host Hello World!"
```

### List all deployed RunCommand resources on a VM 
This command will return a full list of previously deployed Run Commands along with their properties. 

```azurecli-interactive
az vm run-command list --vm-name "myVM" --resource-group "myRG"
```

### Get execution status and results 
This command will retrieve current execution progress, including latest output, start/end time, exit code, and terminal state of the execution.

```azurecli-interactive
az vm run-command show --name "myRunCommand" --vm-name "myVM" --resource-group "myRG" --expand instanceView
```

### Delete RunCommand resource from the VM
Remove the RunCommand resource previously deployed on the VM. If the script execution is still in progress, execution will be terminated. 

```azurecli-interactive
az vm run-command delete --name "myRunCommand" --vm-name "myVM" --resource-group "myRG"
```


## PowerShell 

### Execute a script with the VM
This command will deliver the script to the VM, execute it, and return the captured output.

```powershell-interactive
Set-AzVMRunCommand -ResourceGroupName "myRG" -VMName "myVM" -Location "EastUS" -RunCommandName "RunCommandName" –SourceScript "echo Hello World!"
```
### Execute a script on the VM using SourceScriptUri parameter 
`OutputBlobUri` and `ErrorBlobUri` are optional parameters.

```powershell-interactive
Set-AzVMRunCommand -ResourceGroupName -VMName -RunCommandName -SourceScriptUri “< SAS URI of a storage blob with read access or public URI>" -OutputBlobUri “< SAS URI of a storage append blob with read, add, create, write access>” -ErrorBlobUri “< SAS URI of a storage append blob with read, add, create, write access>”
```


### List all deployed RunCommand resources on a VM 
This command will return a full list of previously deployed Run Commands along with their properties.

```powershell-interactive
Get-AzVMRunCommand -ResourceGroupName "myRG" -VMName "myVM"
```

### Get execution status and results 
This command will retrieve current execution progress, including latest output, start/end time, exit code, and terminal state of the execution.

```powershell-interactive
Get-AzVMRunCommand -ResourceGroupName "myRG" -VMName "myVM" -RunCommandName "RunCommandName" -Status
```

### Delete RunCommand resource from the VM
Remove the RunCommand resource previously deployed on the VM. If the script execution is still in progress, execution will be terminated. 

```powershell-interactive
Remove-AzVMRunCommand -ResourceGroupName "myRG" -VMName "myVM" -RunCommandName "RunCommandName"
```
 

## REST API 

To deploy a new Run Command, execute a PUT on the VM directly and specify a unique name for the Run Command instance. 

```rest
PUT /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/virtualMachines/<vmName>/runcommands/<runCommandName>?api-version=2019-12-01
```

```json
{ 
"location": "<location>", 
"properties": { 
    "source": { 
        "script": "Write-Host Hello World!", 
        "scriptUri": "<SAS URI of a storage blob with read access or public URI>",  
        "commandId": "<Id>"  
        }, 
    "parameters": [ 
        { 
            "name": "param1",
            "value": "value1" 
            }, 
        { 
            "name": "param2", 
            "value": "value2" 
            } 
        ], 
    "protectedParameters": [ 
        { 
            "name": "secret1", 
            "value": "value1" 
            }, 
        { 
            "name": "secret2", 
            "value": "value2" 
            } 
        ], 
    "runAsUser": "userName",
    "runAsPassword": "userPassword", 
    "timeoutInSeconds": 3600, 
    "outputBlobUri": "< SAS URI of a storage append blob with read, add, create, write access>", 
    "errorBlobUri": "< SAS URI of a storage append blob with read, add, create, write access >"  
    }
}
```

### Notes
 
- You can provide an inline script, a script URI, or a built-in script [command ID](run-command.md#available-commands) as the input source. Script URI is either storage blob SAS URI with read access or public URI.
- Only one type of source input is supported for one command execution.  
- Run Command supports writing output and error to Storage blobs using outputBlobUri and errorBlobUri parameters, which can be used to store large script outputs. Use SAS URI of a storage append blob with read, add, create, write access. The blob should be of type AppendBlob. Writing the script output or error blob would fail otherwise. The blob will be overwritten if it already exists. It will be created if it does not exist.


### List running instances of Run Command on a VM 

```rest
GET /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/virtualMachines/<vmName>/runcommands?api-version=2019-12-01
``` 

### Get output details for a specific Run Command deployment 

```rest
GET /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/virtualMachines/<vmName>/runcommands/<runCommandName>?$expand=instanceView&api-version=2019-12-01 
```

### Cancel a specific Run Command deployment 

To cancel a running deployment, you can PUT or PATCH on the running instance of Run Command and specify a blank script in the request body. This will cancel the ongoing execution. 

You can also delete the instance of Run Command.  

```rest
DELETE /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/virtualMachines/<vmName>/runcommands/<runCommandName>?api-version=2019-12-01 
```

### Deploy scripts in an ordered sequence 

To deploy scripts sequentially, use a deployment template, specifying a `dependsOn` relationship between sequential scripts. 

```json
{ 
    "type": "Microsoft.Compute/virtualMachines/runCommands", 
    "name": "secondRunCommand", 
    "apiVersion": "2019-12-01", 
    "location": "[parameters('location')]", 
    "dependsOn": <full resourceID of the previous other Run Command>, 
    "properties": { 
        "source": {  
            "script": "Write-Host Hello World!"  
        }, 
        "timeoutInSeconds": 60  
    }
} 
```

### Execute multiple Run Commands sequentially 

By default, if you deploy multiple RunCommand resources using deployment template, they will be executed simultaneously on the VM. If you have a dependency on the scripts and a preferred order of execution, you can use the `dependsOn` property to make them run sequentially. 

In this example, **secondRunCommand** will execute after **firstRunCommand**. 

```json
{
   "$schema":"https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion":"1.0.0.0",
   "resources":[
      {
         "type":"Microsoft.Compute/virtualMachines/runCommands",
         "name":"[concat(parameters('vmName'),'/firstRunCommand')]",
         "apiVersion":"2019-12-01",
         "location":"[parameters('location')]",
         "dependsOn":[
            "[concat('Microsoft.Compute/virtualMachines/', parameters('vmName'))]"
         ],
         "properties":{
            "source":{
               "script":"Write-Host First: Hello World!"
            },
            "parameters":[
               {
                  "name":"param1",
                  "value":"value1"
               },
               {
                  "name":"param2",
                  "value":"value2"
               }
            ],
            "timeoutInSeconds":20
         }
      },
      {
         "type":"Microsoft.Compute/virtualMachines/runCommands",
         "name":"[concat(parameters('vmName'),'/secondRunCommand')]",
         "apiVersion":"2019-12-01",
         "location":"[parameters('location')]",
         "dependsOn":[
            "[concat('Microsoft.Compute/virtualMachines/', parameters('vmName'),'runcommands/firstRunCommand')]"
         ],
         "properties":{
            "source":{
               "scriptUri":"http://github.com/myscript.ps1"
            },
            "timeoutInSeconds":60
         }
      }
   ]
}
```


## Next steps

To learn about other ways to run scripts and commands remotely in your VM, see [Run scripts in your Windows VM](run-scripts-in-vm.md).
