---
title: Use of Custom Script Extensions for VMs on your Azure Stack Edge Pro device
description: Describes how to install custom script extensions on virtual machines (VMs) running on an Azure Stack Edge Pro device using templates.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 12/15/2020
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create and manage virtual machines (VMs) on my Azure Stack Edge Pro device using APIs so that I can efficiently manage my VMs.
---

# Custom Script Extension for VMs running on your Azure Stack Edge Pro device

The Custom Script Extension downloads and runs scripts on virtual machines running on your Azure Stack Edge Pro devices. This article details how to install and run the Custom Script Extension by using an Azure Resource Manager template. 

This article applies to Azure Stack Edge Pro GPU, Azure Stack Edge Pro R, and Azure Stack Edge Mini R devices.

## About custom script extension

The Custom Script Extension is useful for post-deployment configuration, software installation, or any other configuration/management task. You can download scripts from Azure Storage or another accessible internet location, or you can provide them to the extension runtime.

The Custom Script Extension integrates with Azure Resource Manager templates. You can also run it by using Azure CLI, PowerShell, or the Azure Virtual Machines REST API.

## OS for Custom Script Extension

#### Supported OS for Custom Script Extension on Windows

The Custom Script Extension for Windows will run on the following OSs. Other versions may work but have not been tested in-house on VMs running on Azure Stack Edge Pro devices.

| Distribution | Version |
|---|---|
| Windows Server 2019 | Core |
| Windows Server 2016 | Core |

#### Supported OS for Custom Script Extension on Linux

The Custom Script Extension for Linux will run on the following OSs. Other versions may work but have not been tested in-house on VMs running on Azure Stack Edge Pro devices.

| Distribution | Version |
|---|---|
| Linux: Ubuntu | 18.04 LTS |
| Linux: Red Hat Enterprise Linux | 7.4 |

### Script location

You can configure the extension to use your Azure Blob storage credentials to access Azure Blob storage. The script location can be anywhere, as long as the VM can route to that end point, such as GitHub or an internal file server. <!-- confirm with Rajesh -->

### Internet Connectivity

To download a script externally such as from GitHub or Azure Storage, make sure that the port on which you enable compute network, is connected to the internet. 

If your script is on a local server, then you may still need additional firewall and Network Security Group ports need to be opened.

> [!NOTE]
> Before you install the Custom Script extension, make sure that the port enabled for compute network on your device is connected to Internet and has access. 

<!--### Tips and Tricks

* The highest failure rate for this extension is because of syntax errors in the script, test the script runs without error, and also put in additional logging into the script to make it easier to find where it failed.
* Write scripts that are idempotent. This ensures that if they run again accidentally, it will not cause system changes.
* Ensure the scripts don't require user input when they run.
* There's 90 minutes allowed for the script to run, anything longer will result in a failed provision of the extension.
* Don't put reboots inside the script, this action will cause issues with other extensions that are being installed. Post reboot, the extension won't continue after the restart.
* If you have a script that will cause a reboot, then install applications and run scripts, you can schedule the reboot using a Windows Scheduled Task, or use tools such as DSC, Chef, or Puppet extensions.
* It is not recommended to run a script that will cause a stop or update of the VM Agent. This can let the extension in a Transitioning state, leading to a timeout.
* The extension will only run a script once, if you want to run a script on every boot, then you need to use the extension to create a Windows Scheduled Task.
* If you want to schedule when a script will run, you should use the extension to create a Windows Scheduled Task.
* When the script is running, you will only see a 'transitioning' extension status from the Azure portal. If you want more frequent status updates of a running script, you'll need to create your own solution.
* Custom Script extension does not natively support proxy servers, however you can use a file transfer tool that supports proxy servers within your script, such as *Curl*
* Be aware of non-default directory locations that your scripts or commands may rely on, have logic to handle this situation.
* Custom Script Extension will run under the LocalSystem Account
* If you plan to use the *storageAccountName* and *storageAccountKey* properties, these properties must be collocated in *protectedSettings*.-->

## Extension schema

The Custom Script Extension configuration specifies things like script location and the command to be run. You can store this configuration in configuration files, specify it on the command line, or specify it in an Azure Resource Manager template.

You can store sensitive data in a protected configuration, which is encrypted and only decrypted inside the virtual machine. The protected configuration is useful when the execution command includes secrets such as a password.

These items should be treated as sensitive data and specified in the extensions protected setting configuration. Azure VM extension protected setting data is encrypted, and only decrypted on the target virtual machine.

```json
{
    "apiVersion": "2018-06-01",
    "type": "Microsoft.Compute/virtualMachines/extensions",
    "name": "virtualMachineName/config-app",
    "location": "[resourceGroup().location]",
    "dependsOn": [
        "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'),copyindex())]",
        "[variables('musicstoresqlName')]"
    ],
    "tags": {
        "displayName": "config-app"
    },
    "properties": {
        "publisher": "Microsoft.Compute",
        "type": "CustomScriptExtension",
        "typeHandlerVersion": "1.10",
        "autoUpgradeMinorVersion": true,
        "settings": {
            "fileUris": [
                "script location"
            ],
            "timestamp":123456789
        },
        "protectedSettings": {
            "commandToExecute": "myExecutionCommand",
            "storageAccountName": "myStorageAccountName",
            "storageAccountKey": "myStorageAccountKey",
            "managedIdentity" : {}
        }
    }
}
```

> [!NOTE]
> managedIdentity property **must not** be used in conjunction with storageAccountName or storageAccountKey properties

> [!NOTE]
> Only one version of an extension can be installed on a VM at a point in time, specifying custom script twice in the same Resource Manager template for the same VM will fail.

> [!NOTE]
> We can use this schema inside the VirtualMachine resource or as a standalone resource. The name of the resource has to be in this format "virtualMachineName/extensionName", if this extension is used as a standalone resource in the ARM template.

## Prerequisites

1. [Download the VM templates and parameters files](https://aka.ms/ase-vm-templates) to your client machine. Unzip it into a directory you’ll use as a working directory.

1. To create VMs, follow all the steps in the [Deploy VM on your Azure Stack Edge Pro using templates](azure-stack-edge-gpu-deploy-virtual-machine-templates.md).

    If you need to download a script externally such as from GitHub or Azure Storage, while configuring compute network, enable the port that is connected to the Internet, for compute. This allows you to download the script.

        Here is an example where Port 2 was connected to the internet and was used to enable the compute network. If you've identified that Kubernetes is not needed in the earlier step, you can skip the Kubernetes node IP and external service IP assignment.    

        ![Enable compute settings on port connected to internet](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/enable-compute-network-1.png)

## Install Custom Script Extension

Depending on the operating system for your VM, you could install Custom Script Extension for Windows or for Linux.
 

### Custom Script Extension for Windows

To deploy Custom Script Extension for Windows for a VM running on your device, edit the `addCSExtWindowsVM.parameters.json` parameters file and then deploy the template `addextensiontoVM.json`.

#### Edit parameters file

The file `addCSExtWindowsVM.parameters.json` takes the following parameters:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "value": "<Name of VM>" 
        },
        "extensionName": {
            "value": "<Name of extension>" 
        },
        "publisher": {
            "value": "Microsoft.Compute" 
        },
        "type": {
            "value": "CustomScriptExtension" 
        },
        "typeHandlerVersion": {
            "value": "1.10" 
        },
        "settings": {
            "value": {
                "commandToExecute" : "<Command to execute>"
            }
        }
    }
}
```
Provide your VM name, name for the extension and the command that you want to execute.

Here is a sample parameter file that was used in this article. 

```powershell
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "value": "VM5" 
        },
        "extensionName": {
            "value": "CustomScriptExtension" 
        },
        "publisher": {
            "value": "Microsoft.Compute" 
        },
        "type": {
            "value": "CustomScriptExtension" 
        },
        "typeHandlerVersion": {
            "value": "1.10" 
        },
        "settings": {
            "value": {
                "commandToExecute" : "md C:\\Users\\Public\\Documents\\test"
            }
        }
    }
}
```
#### Deploy template

Deploy the template `addextensiontoVM.json`. This template deploys extension to an existing VM. Run the following command:

```powershell
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "apiProfile": "2018-03-01-hybrid",
  "parameters": {
    "vmName": {
      "type": "string",
      "metadata": {
        "description": "Name of the existing VM to add custom script extension to"
      }
    },
    "extensionName": {
      "type": "string",
      "metadata": {
        "description": "Name of the extension"
      }
    },
    "publisher": {
      "type": "string",
      "metadata": {
        "description": "Publisher of the extension"
      }
    },
    "type": {
      "type": "string",
      "metadata": {
        "description": "Type of the extension"
      }
    },
    "typeHandlerVersion": {
      "type": "string",
      "metadata": {
        "description": "Type handler of the extension"
      }
    },
    "settings": {
      "type": "object",
      "metadata": {
        "description": "Settings for extension"
      }
    }
  },
  "variables": {
    "extensionName": "[concat(parameters('vmName'),'/',parameters('extensionName'))]"
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "name": "[variables('extensionName')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "publisher": "[parameters('publisher')]",
        "type": "[parameters('type')]",
        "typeHandlerVersion": "[parameters('typeHandlerVersion')]",
        "autoUpgradeMinorVersion": true,
        "settings": "[parameters('settings')]"
      }
    }
  ],
  "outputs": {}
}
```
> [!NOTE]
> The extension deployment is a long running job and takes about 10 minutes to complete.

Here is a sample output:

```powershell
PS C:\WINDOWS\system32> $templateFile = "C:\12-09-2020\ExtensionTemplates\addCSExtWindowsVM.parameters"
PS C:\WINDOWS\system32> $templateFile = "C:\12-09-2020\ExtensionTemplates\addExtensiontoVM.json"
PS C:\WINDOWS\system32> $templateParameterFile = "C:\12-09-2020\ExtensionTemplates\addCSExtWindowsVM.parameters.json"
PS C:\WINDOWS\system32> $RGName = "myasegpuvm1"
PS C:\WINDOWS\system32> New-AzureRmResourceGroupDeployment -ResourceGroupName $RGName -TemplateFile $templateFile -TemplateParameterFile $templateParameterFile -Name "deployment7"

DeploymentName          : deployment7
ResourceGroupName       : myasegpuvm1
ProvisioningState       : Succeeded
Timestamp               : 12/17/2020 10:07:44 PM
Mode                    : Incremental
TemplateLink            :
Parameters              :
                          Name             Type                       Value
                          ===============  =========================  ==========
                          vmName           String                     VM5
                          extensionName    String                     CustomScriptExtension
                          publisher        String                     Microsoft.Compute
                          type             String                     CustomScriptExtension
                          typeHandlerVersion  String                     1.10
                          settings         Object                     {
                            "commandToExecute": "md C:\\Users\\Public\\Documents\\test"
                          }

Outputs                 :
DeploymentDebugLogLevel :

PS C:\WINDOWS\system32>
```
#### Track deployment

To check the deployment state of extensions for a given VM, run the following command: 

```powershell
Get-AzureRmVMExtension -ResourceGroupName <Name of resource group> -VMName <Name of VM> -Name <Name of the extension>
```
Here is a sample output:

```powershell
PS C:\WINDOWS\system32> Get-AzureRmVMExtension -ResourceGroupName myasegpuvm1 -VMName VM5 -Name CustomScriptExtension

ResourceGroupName       : myasegpuvm1
VMName                  : VM5
Name                    : CustomScriptExtension
Location                : dbelocal
Etag                    : null
Publisher               : Microsoft.Compute
ExtensionType           : CustomScriptExtension
TypeHandlerVersion      : 1.10
Id                      : /subscriptions/947b3cfd-7a1b-4a90-7cc5-e52caf221332/resourceGroups/myasegpuvm1/providers/Microsoft.Compute/virtualMachines/VM5/extensions/CustomScriptExtension
PublicSettings          : {
                            "commandToExecute": "md C:\\Users\\Public\\Documents\\test"
                          }
ProtectedSettings       :
ProvisioningState       : Creating
Statuses                :
SubStatuses             :
AutoUpgradeMinorVersion : True
ForceUpdateTag          :

PS C:\WINDOWS\system32>
```

> [!NOTE]
> When the deployment is complete, the `ProvisioningState` changes to `Succeeded`.

Extension output is logged to files found under the following folder on the target virtual machine. 

```cmd
C:\WindowsAzure\Logs\Plugins\Microsoft.Compute.CustomScriptExtension
```

The specified files are downloaded into the following folder on the target virtual machine.

```cmd
C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\1.*\Downloads\<n>
```
where <n> is a decimal integer, which may change between executions of the extension. The 1.* value matches the actual, current `typeHandlerVersion` value of the extension. For example, the actual directory in this instance was `C:\Packages\Plugins\Microsoft.Compute.CustomScriptExtension\1.10.9\Downloads\0`. 


In this instance, the command to execute for the custom extension was: `md C:\\Users\\Public\\Documents\\test`. When the extension is successfully installed, you can verify that the directory was created in the VM at the specified path in the command. 


### Custom Script Extension for Linux

To deploy Custom Script Extension for Windows for a VM running on your device, edit the `addCSExtLinuxVM.parameters.json` parameters file and then deploy the template `addCSExtLinuxtoVM.json`.

#### Edit parameters file

The file `addCSExtLinuxVM.parameters.json` takes the following parameters:

```powershell
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "value": "<Name of your VM>" 
        },
        "extensionName": {
            "value": "<Name of your extension>" 
        },
        "publisher": {
            "value": "Microsoft.Azure.Extensions" 
        },
        "type": {
            "value": "CustomScript" 
        },
        "typeHandlerVersion": {
            "value": "2.0" 
        },
        "settings": {
            "value": {
                "commandToExecute" : "<Command to execute>"
            }
        }
    }
}
```
Provide your VM name, name for the extension and the command that you want to execute.

Here is a sample parameter file that was used in this article:

```powershell
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "value": "Linuxvm" 
        },
        "extensionName": {
            "value": "LinuxCustomScriptExtension" 
        },
        "publisher": {
            "value": "Microsoft.Azure.Extensions" 
        },
        "type": {
            "value": "CustomScript" 
        },
        "typeHandlerVersion": {
            "value": "2.0" 
        },
        "settings": {
            "value": {
                "commandToExecute" : "sudo echo 'some text' >> /home/Administrator/file2.txt"
            }
        }
    }
}
```
#### Deploy template

Deploy the template `addCSExtLinuxVM.json`. This template deploys extension to an existing VM. Run the following command:

```powershell
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "apiProfile": "2018-03-01-hybrid",
  "parameters": {
    "vmName": {
      "type": "string",
      "metadata": {
        "description": "Name of the existing VM to add custom script extension to"
      }
    },
    "extensionName": {
      "type": "string",
      "metadata": {
        "description": "Name of the extension"
      }
    },
    "publisher": {
      "type": "string",
      "metadata": {
        "description": "Publisher of the extension"
      }
    },
    "type": {
      "type": "string",
      "metadata": {
        "description": "Type of the extension"
      }
    },
    "typeHandlerVersion": {
      "type": "string",
      "metadata": {
        "description": "Type handler of the extension"
      }
    },
    "settings": {
      "type": "object",
      "metadata": {
        "description": "Settings for extension"
      }
    }
  },
  "variables": {
    "extensionName": "[concat(parameters('vmName'),'/',parameters('extensionName'))]"
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "name": "[variables('extensionName')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "publisher": "[parameters('publisher')]",
        "type": "[parameters('type')]",
        "typeHandlerVersion": "[parameters('typeHandlerVersion')]",
        "autoUpgradeMinorVersion": true,
        "settings": "[parameters('settings')]"
      }
    }
  ],
  "outputs": {}
}
```	

> [!NOTE]
> The extension deployment is a long running job and takes about 10 minutes to complete.

Here is a sample output:

```powershell

```

#### Track deployment status	
	
Template deployment is a long running job. To check the deployment state of extensions for a given VM, open another PowerShell session (run as administrator). Run the following command: 

```powershell
Get-AzureRmVMExtension -ResourceGroupName myResourceGroup -VMName <VM Name> -Name <Extension Name>
```
Here is a sample output: 

```powershell

```

> [!NOTE]
> When the deployment is complete, the `ProvisioningState` changes to `Succeeded`.

The extension execution output is logged to the following file: `/var/log/azure/nvidia-vmext-status`.


## Remove Custom Script Extension

To remove the Custom Script Extension, use the following command:

`Remove-AzureRmVMExtension -ResourceGroupName <Resource group name> -VMName <VM name> -Name <Extension name>`

Here is a sample output:

```powershell
PS C:\azure-stack-edge-deploy-vms> Remove-AzureRmVMExtension -ResourceGroupName rgl -VMName WindowsVM -Name windowsgpuext
Virtual machine extension removal operation
This cmdlet will remove the specified virtual machine extension. Do you want to continue? [Y] Yes [N] No [S] Suspend [?] Help (default is "Y"): y
Requestld IsSuccessStatusCode StatusCode ReasonPhrase
--------- ------------------- ---------- ------------    
          True                OK         OK
```


## Next steps

[Azure Resource Manager cmdlets](/powershell/module/azurerm.resources/?view=azurermps-6.13.0)