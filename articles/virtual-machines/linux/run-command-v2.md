---
title: Run PowerShell scripts in a Linux VM in Azure (preview)
description: This topic describes how to run PowerShell scripts within an Azure Linux virtual machine by using the updated Run Command feature.
ms.service: virtual-machines
ms.collection: linux
author: cynthn
ms.author: cynthn
ms.date: 10/20/2021
ms.topic: how-to  
ms.custom: devx-track-azurepowershell

---
# Preview: Run PowerShell scripts in your Linux VM by using the updated Run Command

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

> [!IMPORTANT]
> **Run Command v2** is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The Run Command feature uses the virtual machine (VM) agent to PowerShell scripts within an Azure Linux VM. You can use these scripts for general machine or application management. They can help you quickly diagnose and remediate VM access and network issues and get the VM back to a good state.

The *updated* Run Command uses the same VM agent channel to execute PowerShell scripts and provides the following enhancements over the [original Run Command](run-command.md): 
- Support for updated Run Command through ARM deployment template 
- Parallel execution of multiple scripts 
- Sequential execution of scripts 
- RunCommand script can be cancelled  
- User specified script timeout 
- Support for long running (hours/days) scripts 
- Passing secrets (parameters, passwords) in a secure manner


## Setting up the VM Agent 

Download and extract the [private VM Agent build](). Follow the instructions below to setup the VM Agent before enabling multi-config and the updated Run Command: 

> [!NOTE]
> This needs to be done with root privileges. The example below was done on an Ubuntu machine. 

1. Log into the VM and stop the Agent’s service (walinuxagent on Ubuntu, waagent on most other distros) 

    ```json
    # systemctl stop walinuxagent
    ``` 

1. Copy the attached ZIP to /var/lib/waagent/ and unzip it as WALinuxAgent-2.4.0.0 (the name of the target directory must be exactly WALinuxAgent-2.4.0.0) 

    ```json
    # ls /var/lib/waagent/WALinuxAgent-2.4.0.0.zip  
    /var/lib/waagent/WALinuxAgent-2.4.0.0.zip 
    # cd /var/lib/waagent 
    # unzip WALinuxAgent-2.4.0.0.zip -d WALinuxAgent-2.4.0.0 
    Archive:  WALinuxAgent-2.4.0.0.zip 
      inflating: WALinuxAgent-2.4.0.0/bin/WALinuxAgent-2.4.0.0-py2.7.egg   
      inflating: WALinuxAgent-2.4.0.0/HandlerManifest.json   
      inflating: WALinuxAgent-2.4.0.0/manifest.xml 
    ```

1. Restart the Agent’s service 

    ```json
    # systemctl start walinuxagent 
    ```

1. To verify that the private is running, either check the status of the Agent’s service or look for "Agent WALinuxAgent-2.4.0.0 is running as the goal state agent" in the agent’s log 

    ```json
    # systemctl status walinuxagent
    ``` 
    
    ```json
    # grep 2.4.0.0 /var/log/waagent.log
    ```

## Enable multiple script deployment 

THe updated Run Command allows multiple scripts to be executed in parallel. To enable this feature, your VM must have a specific Tag – `SupportsMultipleExtensions` added to it. 

A simple way to add a Tag to a VM is through the Azure portal. The steps are as follows: 
1. Open [Azure portal](https://portal.azure.com) 
1. Select the VM 
1. On the left navigation pane, click on the **Tags** option 
1. Add `SupportsMultipleExtensions` in the **Name** field and `True` in the **Value** field 
1. Press **Save** at the bottom of the screen 

Tags can also be added through [templates](../tag-template.md) and [PowerShell](../tag-powershell.md). 


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
        "scriptUri": "<URI>",  
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
    "outputBlobUri": "<URI>", 
    "errorBlobUri": "<URI>"  
    }
}
```

### Notes
 
- You can provide an inline script, a script URI, or a built-in script [command ID](run-command.md#available-commands) as the input source
- Only one type of source input is supported for one command execution 
- Run command supports output to Storage blobs, which can be used to store large script outputs
- Run command supports error output to Storage blobs 


## Template 

Use the following sample deployment template files:
- [Parameters]()
- [Deployment]()


## Deploy scripts in parallel 

To deploy multiple scripts, ensure that your VM has the Tag – `SupportsMultipleExtensions` added to it. Then simply deploy additional scripts through a new `runCommand` PUT call with a separate unique name and specify the request body: 

```rest
PUT /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/virtualMachines/<vmName>/runcommands/<runCommandName2>?api-version=2019-12-01 
```

The process above can be repeated as many times as required, as long as every new instance of Run Command is deployed with a unique name. 

## List running instances of Run Command on a VM 

```rest
GET /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/virtualMachines/<vmName>/runcommands?api-version=2019-12-01
``` 

## Get output details for a specific Run Command deployment 

```rest
GET /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/virtualMachines/<vmName>/runcommands/<runCommandName>?$expand=instanceView&api-version=2019-12-01 
```

## Cancel a specific Run Command deployment 

To cancel a running deployment, you can PUT or PATCH on the running instance of Run Command and specify a blank script in the request body. This will cancel the ongoing execution. 

You can also delete the instance of Run Command.  

```rest
DELETE /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/virtualMachines/<vmName>/runcommands/<runCommandName>?api-version=2019-12-01 
```

## Deploy scripts in an ordered sequence 

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

## Next steps

To learn about other ways to run scripts and commands remotely in your VM, see [Run scripts in your Linux VM](run-scripts-in-vm.md).
