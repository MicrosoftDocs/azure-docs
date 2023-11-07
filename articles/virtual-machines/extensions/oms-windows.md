---
title: Log Analytics agent VM extension for Windows 
description: Learn how to deploy the Log Analytics agent on a Windows virtual machine by using a virtual machine extension.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
ms.author: gabsta
author: GabstaMSFT
ms.collection: windows
ms.date: 04/14/2023
---

# Log Analytics agent virtual machine extension for Windows

Azure Monitor Logs provides monitoring capabilities across cloud and on-premises assets. Microsoft publishes and supports the Log Analytics agent virtual machine (VM) extension for Windows. The extension installs the Log Analytics agent on Azure VMs, and enrolls VMs into an existing Log Analytics workspace. This article describes the supported platforms, configurations, and deployment options for the Log Analytics agent VM extension for Windows.

> [!IMPORTANT]
> The Log Analytics agent is on a **deprecation path** and won't be supported after **August 31, 2024**. If you use the Log Analytics agent to ingest data to Azure Monitor, [migrate to the new Azure Monitor agent](/azure/azure-monitor/agents/azure-monitor-agent-migration) prior to that date.

## Prerequisites

Review the following prerequisites for using the Log Analytics agent VM extension for Windows.

### Operating system

For details about the supported Windows operating systems, see the [Overview of Azure Monitor agents](/azure/azure-monitor/agents/agents-overview#supported-operating-systems) article.

### Agent and VM extension version

The following table provides a mapping of the version of the Windows Log Analytics VM extension and Log Analytics agent for each release. 

| Agent version | VM extension version | Release date | Release notes |
| --- | --- | --- | --- |
| 10.20.18069.0 | 1.0.18069   | September 2023 | - Rebuilt the agent to resign then and to replace and expired certificates, Added deprication message to installer |
| 10.20.18067.0 | 1.0.18067   | March 2022     | - Bug fix for performance counters <br> - Enhancements to Agent Troubleshooter |
| 10.20.18064.0 | 1.0.18064   | December 2021  | - Bug fix for intermittent crashes |
| 10.20.18062.0 | 1.0.18062   | November 2021  | - Minor bug fixes and stabilization improvements |
| 10.20.18053   | 1.0.18053.0 | October 2020   | - New Agent Troubleshooter <br> - Updates how the agent handles certificate changes to Azure services |
| 10.20.18040   | 1.0.18040.2 | August 2020    | - Resolves an issue on Azure Arc |
| 10.20.18038   | 1.0.18038   | April 2020     | - Enables connectivity over Azure Private Link by using Azure Monitor Private Link Scopes <br> - Adds ingestion throttling to avoid a sudden, accidental influx in ingestion to a workspace <br> - Adds support for more Azure Government clouds and regions <br> - Resolves a bug where HealthService.exe crashed |
| 10.20.18029   | 1.0.18029   | March 2020     | - Adds SHA-2 code signing support <br> - Improves VM extension installation and management <br> - Resolves a bug with Azure Arc-enabled servers integration <br> - Adds built-in troubleshooting tool for customer support <br> - Adds support for more Azure Government regions |
| 10.20.18018   | 1.0.18018   | October 2019   | -  Minor bug fixes and stabilization improvements  |
| 10.20.18011   | 1.0.18011   | July 2019      | -  Minor bug fixes and stabilization improvements <br> - Increases `MaxExpressionDepth` to 10,000  |
| 10.20.18001   | 1.0.18001   | June 2019      | -  Minor bug fixes and stabilization improvements <br> - Adds ability to disable default credentials when making proxy connection (support for `WINHTTP_AUTOLOGON_SECURITY_LEVEL_HIGH`) |
| 10.19.13515   | 1.0.13515   | March 2019     | - Minor stabilization fixes  |
| 10.19.10006   | n/a         | December 2018  | - Minor stabilization fixes  | 
| 8.0.11136     | n/a         | September 2018 | - Adds support for detecting resource ID change on VM move <br> - Adds support for reporting resource ID when using nonextension install | 
| 8.0.11103     | n/a         | April 2018     | |
| 8.0.11081     | 1.0.11081   | November 2017  | | 
| 8.0.11072     | 1.0.11072   | September 2017 | |
| 8.0.11049     | 1.0.11049   | February 2017  | |

### Microsoft Defender for Cloud

Microsoft Defender for Cloud automatically provisions the Log Analytics agent and connects it with the default Log Analytics workspace of the Azure subscription.

> [!IMPORTANT]
> If you're using Microsoft Defender for Cloud, don't follow the extension deployment methods described in this article. These deployment processes overwrite the configured Log Analytics workspace and break the connection with Microsoft Defender for Cloud.

### Azure Arc

You can use Azure Arc-enabled servers to deploy, remove, and update the Log Analytics agent VM extension to non-Azure Windows and Linux machines. This approach simplifies the management of your hybrid machine through their lifecycle. For more information, see [VM extension management with Azure Arc-enabled servers](/azure/azure-arc/servers/manage-vm-extensions).

### Internet connectivity

The Log Analytics agent VM extension for Windows requires that the target VM is connected to the internet. 

## Extension schema

The following JSON shows the schema for the Log Analytics agent VM extension for Windows. The extension requires the workspace ID and workspace key from the target Log Analytics workspace. These items can be found in the settings for the workspace in the Azure portal.

Because the workspace key should be treated as sensitive data, it should be stored in a protected setting configuration. Azure VM extension protected-setting data is encrypted, and it's only decrypted on the target VM.

> [!NOTE]
> The values for `workspaceId` and `workspaceKey` are case-sensitive.

```json
{
    "type": "extensions",
    "name": "OMSExtension",
    "apiVersion": "[variables('apiVersion')]",
    "location": "[resourceGroup().location]",
    "dependsOn": [
        "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]"
    ],
    "properties": {
        "publisher": "Microsoft.EnterpriseCloud.Monitoring",
        "type": "MicrosoftMonitoringAgent",
        "typeHandlerVersion": "1.0",
        "autoUpgradeMinorVersion": true,
        "settings": {
            "workspaceId": "myWorkSpaceId"
        },
        "protectedSettings": {
            "workspaceKey": "myWorkspaceKey"
        }
    }
}
```

### Property values

The JSON schema includes the following properties.

| Name | Value/Example |
| --- | --- |
| `apiVersion` | 2015-06-15 |
| `publisher` | Microsoft.EnterpriseCloud.Monitoring |
| `type` | MicrosoftMonitoringAgent |
| `typeHandlerVersion` | 1.0 |
| `workspaceId (e.g)`__*__ | 6f680a37-00c6-41c7-a93f-1437e3462574 |
| `workspaceKey (e.g)` | z4bU3p1/GrnWpQkky4gdabWXAhbWSTz70hm4m2Xt92XI+rSRgE8qVvRhsGo9TXffbrTahyrwv35W0pOqQAU7uQ== |

__\*__ The `workspaceId` schema property is specified as the `consumerId` property in the Log Analytics API.

## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager (ARM) templates. The JSON schema detailed in the previous section can be used in an ARM template to run the Log Analytics agent VM extension during an ARM template deployment. A sample template that includes the Log Analytics agent VM extension can be found on the [Azure Quickstart Gallery](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/oms-extension-windows-vm). 

> [!NOTE]
> The ARM template doesn't support specifying more than one workspace ID and workspace key when you want to configure the Log Analytics agent to report to multiple workspaces. To configure the Log Analytics agent VM extension to report to multiple workspaces, see [Add or remove a workspace](/azure/azure-monitor/agents/agent-manage?tabs=PowerShellLinux#add-or-remove-a-workspace).

The JSON for a VM extension can be nested inside the VM resource, or placed at the root or top level of a JSON ARM template. The placement of the JSON affects the value of the resource name and type. For more information, see [Set name and type for child resources](/azure/azure-resource-manager/templates/child-resource-name-type).

The following example assumes the Log Analytics agent VM extension is nested inside the VM resource. When you nest the extension resource, the JSON is placed in the `"resources": []` object of the VM.

```json
{
    "type": "extensions",
    "name": "OMSExtension",
    "apiVersion": "[variables('apiVersion')]",
    "location": "[resourceGroup().location]",
    "dependsOn": [
        "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]"
    ],
    "properties": {
        "publisher": "Microsoft.EnterpriseCloud.Monitoring",
        "type": "MicrosoftMonitoringAgent",
        "typeHandlerVersion": "1.0",
        "autoUpgradeMinorVersion": true,
        "settings": {
            "workspaceId": "myWorkSpaceId"
        },
        "protectedSettings": {
            "workspaceKey": "myWorkspaceKey"
        }
    }
}
```

When you place the extension JSON at the root of the ARM template, the resource `name` includes a reference to the parent VM, and the `type` reflects the nested configuration. 

```json
{
    "type": "Microsoft.Compute/virtualMachines/extensions",
    "name": "<parentVmResource>/OMSExtension",
    "apiVersion": "[variables('apiVersion')]",
    "location": "[resourceGroup().location]",
    "dependsOn": [
        "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]"
    ],
    "properties": {
        "publisher": "Microsoft.EnterpriseCloud.Monitoring",
        "type": "MicrosoftMonitoringAgent",
        "typeHandlerVersion": "1.0",
        "autoUpgradeMinorVersion": true,
        "settings": {
            "workspaceId": "myWorkSpaceId"
        },
        "protectedSettings": {
            "workspaceKey": "myWorkspaceKey"
        }
    }
}
```

## PowerShell deployment

The `Set-AzVMExtension` command can be used to deploy the Log Analytics agent VM extension to an existing VM. Before you run the command, store the public and private configurations in a [PowerShell hashtable](/powershell/scripting/learn/deep-dives/everything-about-hashtable). 

```powershell
$PublicSettings = @{"workspaceId" = "myWorkspaceId"}
$ProtectedSettings = @{"workspaceKey" = "myWorkspaceKey"}

Set-AzVMExtension -ExtensionName "MicrosoftMonitoringAgent" `
    -ResourceGroupName "myResourceGroup" `
    -VMName "myVM" `
    -Publisher "Microsoft.EnterpriseCloud.Monitoring" `
    -ExtensionType "MicrosoftMonitoringAgent" `
    -TypeHandlerVersion 1.0 `
    -Settings $PublicSettings `
    -ProtectedSettings $ProtectedSettings `
    -Location WestUS 
```

## <a name="troubleshoot-and-support"></a> Troubleshoot issues

Here are some suggestions for how to troubleshoot deployment issues.

### View extension status

Check the status of your extension deployment in the Azure portal, or by using PowerShell or the Azure CLI.

To see the deployment state of extensions for a given VM, run the following commands.

- Azure PowerShell:

   ```powershell
   Get-AzVMExtension -ResourceGroupName <myResourceGroup> -VMName <myVM> -Name <myExtensionName>
   ```

- The Azure CLI:

   ```azurecli
   az vm get-instance-view --resource-group <myResourceGroup> --name <myVM> --query "instanceView.extensions"
   ```

### Review output logs

View output logs for the Log Analytics agent VM extension for Windows under
`C:\WindowsAzure\Logs\Plugins\Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent\`.

### Get support

Here are some other options to help you resolve deployment issues:

- For assistance, contact the Azure experts on the [Q&A and Stack Overflow forums](https://azure.microsoft.com/support/community/). 


- You can also [Contact Microsoft Support](https://support.microsoft.com/contactus/). For information about using Azure support, read the [Azure support FAQ](https://azure.microsoft.com/support/legal/faq/).
