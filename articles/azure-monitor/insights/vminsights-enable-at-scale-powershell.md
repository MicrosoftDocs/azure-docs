---
title: Enable Azure Monitor for VMs (preview) using Azure PowerShell or Resource Manager templates | Microsoft Docs
description: This article describes how you enable Azure Monitor for VMs for one or more Azure virtual machines or virtual machine scale sets by using Azure PowerShell or Azure Resource Manager templates.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: 
ms.assetid: 
ms.service: azure-monitor
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/09/2019
ms.author: magoedte
---

# Enable Azure Monitor for VMs (preview) using Azure PowerShell or Resource Manager templates

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

This article explains how to enable Azure Monitor for VMs (preview) for Azure virtual machines or virtual machine scale sets by using Azure PowerShell or Azure Resource Manager templates. At the end of this process, you will have successfully begun monitoring all of your virtual machines and learn if any are experiencing performance or availability issues.

## Set up a Log Analytics workspace 

If you don't have a Log Analytics workspace, you need to create one. Review the methods that are suggested in the [Prerequisites](vminsights-enable-overview.md#log-analytics) section before you continue with the steps to configure it. Then you can finish the deployment of Azure Monitor for VMs by using the Azure Resource Manager template method.

### Enable performance counters

If the Log Analytics workspace that's referenced by the solution isn't already configured to collect the performance counters required by the solution, you need to enable them. You can do so in one of two ways:
* Manually, as described in [Windows and Linux performance data sources in Log Analytics](../../azure-monitor/platform/data-sources-performance-counters.md)
* By downloading and running a PowerShell script that's available from the [Azure PowerShell Gallery](https://www.powershellgallery.com/packages/Enable-VMInsightsPerfCounters/1.1)

### Install the ServiceMap and InfrastructureInsights solutions
This method includes a JSON template that specifies the configuration for enabling the solution components in your Log Analytics workspace.

If you don't know how to deploy resources by using a template, see:
* [Deploy resources with Resource Manager templates and Azure PowerShell](../../azure-resource-manager/resource-group-template-deploy.md)
* [Deploy resources with Resource Manager templates and the Azure CLI](../../azure-resource-manager/resource-group-template-deploy-cli.md)

To use the Azure CLI, you first need to install and use the CLI locally. You must be running the Azure CLI version 2.0.27 or later. To identify your version, run `az --version`. To install or upgrade the Azure CLI, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

1. Copy and paste the following JSON syntax into your file:

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "WorkspaceName": {
                "type": "string"
            },
            "WorkspaceLocation": {
                "type": "string"
            }
        },
        "resources": [
            {
                "apiVersion": "2017-03-15-preview",
                "type": "Microsoft.OperationalInsights/workspaces",
                "name": "[parameters('WorkspaceName')]",
                "location": "[parameters('WorkspaceLocation')]",
                "resources": [
                    {
                        "apiVersion": "2015-11-01-preview",
                        "location": "[parameters('WorkspaceLocation')]",
                        "name": "[concat('ServiceMap', '(', parameters('WorkspaceName'),')')]",
                        "type": "Microsoft.OperationsManagement/solutions",
                        "dependsOn": [
                            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('WorkspaceName'))]"
                        ],
                        "properties": {
                            "workspaceResourceId": "[resourceId('Microsoft.OperationalInsights/workspaces/', parameters('WorkspaceName'))]"
                        },

                        "plan": {
                            "name": "[concat('ServiceMap', '(', parameters('WorkspaceName'),')')]",
                            "publisher": "Microsoft",
                            "product": "[Concat('OMSGallery/', 'ServiceMap')]",
                            "promotionCode": ""
                        }
                    },
                    {
                        "apiVersion": "2015-11-01-preview",
                        "location": "[parameters('WorkspaceLocation')]",
                        "name": "[concat('InfrastructureInsights', '(', parameters('WorkspaceName'),')')]",
                        "type": "Microsoft.OperationsManagement/solutions",
                        "dependsOn": [
                            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('WorkspaceName'))]"
                        ],
                        "properties": {
                            "workspaceResourceId": "[resourceId('Microsoft.OperationalInsights/workspaces/', parameters('WorkspaceName'))]"
                        },
                        "plan": {
                            "name": "[concat('InfrastructureInsights', '(', parameters('WorkspaceName'),')')]",
                            "publisher": "Microsoft",
                            "product": "[Concat('OMSGallery/', 'InfrastructureInsights')]",
                            "promotionCode": ""
                        }
                    }
                ]
            }
        ]
    }
    ```

1. Save this file as *installsolutionsforvminsights.json* to a local folder.

1. Capture the values for *WorkspaceName*, *ResourceGroupName*, and *WorkspaceLocation*. The value for *WorkspaceName* is the name of your Log Analytics workspace. The value for *WorkspaceLocation* is the region the workspace is defined in.

1. You're ready to deploy this template.
 
    * Use the following PowerShell commands in the folder that contains the template:

        ```powershell
        New-AzResourceGroupDeployment -Name DeploySolutions -TemplateFile InstallSolutionsForVMInsights.json -ResourceGroupName <ResourceGroupName> -WorkspaceName <WorkspaceName> -WorkspaceLocation <WorkspaceLocation - example: eastus>
        ```

        The configuration change can take a few minutes to finish. When it's finished, a message displays that's similar to the following and includes the result:

        ```powershell
        provisioningState       : Succeeded
        ```

    * To run the following command by using the Azure CLI:
    
        ```azurecli
        az login
        az account set --subscription "Subscription Name"
        az group deployment create --name DeploySolutions --resource-group <ResourceGroupName> --template-file InstallSolutionsForVMInsights.json --parameters WorkspaceName=<workspaceName> WorkspaceLocation=<WorkspaceLocation - example: eastus>
        ```

        The configuration change can take a few minutes to finish. When it's finished, a message is displayed that's similar to the following and includes the result:

        ```azurecli
        provisioningState       : Succeeded
        ```

## Enable with Azure Resource Manager templates
We have created example Azure Resource Manager templates for onboarding your virtual machines and virtual machine scale sets. These templates include scenarios you can use to enable monitoring on an existing resource and create a new resource that has monitoring enabled.

>[!NOTE]
>The template needs to be deployed in the same resource group as the resource to be brought on board.

If you don't know how to deploy resources by using a template, see:
* [Deploy resources with Resource Manager templates and Azure PowerShell](../../azure-resource-manager/resource-group-template-deploy.md)
* [Deploy resources with Resource Manager templates and the Azure CLI](../../azure-resource-manager/resource-group-template-deploy-cli.md)

To use the Azure CLI, you first need to install and use the CLI locally. You must be running the Azure CLI version 2.0.27 or later. To identify your version, run `az --version`. To install or upgrade the Azure CLI, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

### Download templates

The Azure Resource Manager templates are provided in an archive file (.zip) that you can [download](https://aka.ms/VmInsightsARMTemplates) from our GitHub repo. Contents of the file include folders that represent each deployment scenario with a template and parameter file. Before you run them, modify the parameters file and specify the values required. Don't modify the template file unless you need to customize it to support your particular requirements. After you have modified the parameter file, you can deploy it by using the following methods described later in this article. 

The download file contains the following templates for different scenarios:

- **ExistingVmOnboarding** template enables Azure Monitor for VMs if the virtual machine already exists.
- **NewVmOnboarding** template creates a virtual machine and enables Azure Monitor for VMs to monitor it.
- **ExistingVmssOnboarding** template enables Azure Monitor for VMs if the virtual machine scale set already exists.
- **NewVmssOnboarding** template creates virtual machine scale sets and enables Azure Monitor for VMs to monitor them.
- **ConfigureWorksapce** template configures your Log Analytics workspace to support Azure Monitor for VMs by enabling the solutions and collection of Linux and Windows operating system performance counters.

>[!NOTE]
>If virtual machine scale sets were already present and the upgrade policy is set to **Manual**, Azure Monitor for VMs won't be enabled for instances by default after running the **ExistingVmssOnboarding** Azure Resource Manager template. You have to manually upgrade the instances.

### Deploy by using Azure PowerShell

The following step enables monitoring by using Azure PowerShell.

```powershell
New-AzResourceGroupDeployment -Name OnboardCluster -ResourceGroupName <ResourceGroupName> -TemplateFile <Template.json> -TemplateParameterFile <Parameters.json>
```
The configuration change can take a few minutes to finish. When it's finished, a message displays that's similar to the following and includes the result:

```powershell
provisioningState       : Succeeded
```
### Deploy by using the Azure CLI

The following step enables monitoring by using the Azure CLI.

```azurecli
az login
az account set --subscription "Subscription Name"
az group deployment create --resource-group <ResourceGroupName> --template-file <Template.json> --parameters <Parameters.json>
```

The output resembles the following:

```azurecli
provisioningState       : Succeeded
```

## Enable with PowerShell

To enable Azure Monitor for VMs for multiple VMs or virtual machine scale sets, use the PowerShell script [Install-VMInsights.ps1](https://www.powershellgallery.com/packages/Install-VMInsights/1.0). It's available from the Azure PowerShell Gallery. This script iterates through:

- Every virtual machine and virtual machine scale set in your subscription.
- The scoped resource group that's specified by *ResourceGroup*. 
- A single VM or virtual machine scale set that's specified by *Name*.

For each VM or virtual machine scale set, the script verifies whether the VM extension is already installed. If the VM extension isn't installed, the script tries to reinstall it. If the VM extension is installed, the script installs the Log Analytics and Dependency agent VM extensions.

This script requires Azure PowerShell module Az version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the version. If you need to upgrade, see [Install Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

To get a list of the script's argument details and example usage, run `Get-Help`.

```powershell
Get-Help .\Install-VMInsights.ps1 -Detailed

SYNOPSIS
    This script installs VM extensions for Log Analytics and the Dependency agent as needed for VM Insights.


SYNTAX
    .\Install-VMInsights.ps1 [-WorkspaceId] <String> [-WorkspaceKey] <String> [-SubscriptionId] <String> [[-ResourceGroup]
    <String>] [[-Name] <String>] [[-PolicyAssignmentName] <String>] [-ReInstall] [-TriggerVmssManualVMUpdate] [-Approve] [-WorkspaceRegion] <String>
    [-WhatIf] [-Confirm] [<CommonParameters>]


DESCRIPTION
    This script installs or reconfigures the following on VMs and virtual machine scale sets:
    - Log Analytics VM extension configured to supplied Log Analytics workspace
    - Dependency agent VM extension

    Can be applied to:
    - Subscription
    - Resource group in a subscription
    - Specific VM or virtual machine scale set
    - Compliance results of a policy for a VM or VM extension

    Script will show you a list of VMs or virtual machine scale sets that will apply to and let you confirm to continue.
    Use -Approve switch to run without prompting, if all required parameters are provided.

    If the extensions are already installed, they will not install again.
    Use -ReInstall switch if you need to, for example, update the workspace.

    Use -WhatIf if you want to see what would happen in terms of installs, what workspace configured to, and status of the extension.


PARAMETERS
    -WorkspaceId <String>
        Log Analytics WorkspaceID (GUID) for the data to be sent to

    -WorkspaceKey <String>
        Log Analytics Workspace primary or secondary key

    -SubscriptionId <String>
        SubscriptionId for the VMs/VM Scale Sets
        If using PolicyAssignmentName parameter, subscription that VMs are in

    -ResourceGroup <String>
        <Optional> Resource Group to which the VMs or VM Scale Sets belong

    -Name <String>
        <Optional> To install to a single VM/VM Scale Set

    -PolicyAssignmentName <String>
        <Optional> Take the input VMs to operate on as the Compliance results from this Assignment
        If specified will only take from this source.

    -ReInstall [<SwitchParameter>]
        <Optional> If VM/VM Scale Set is already configured for a different workspace, set this to change to the new workspace

    -TriggerVmssManualVMUpdate [<SwitchParameter>]
        <Optional> Set this flag to trigger update of VM instances in a scale set whose upgrade policy is set to Manual

    -Approve [<SwitchParameter>]
        <Optional> Gives the approval for the installation to start with no confirmation prompt for the listed VMs/VM Scale Sets

    -WorkspaceRegion <String>
        Region the Log Analytics Workspace is in
        Supported values: "East US","eastus","Southeast Asia","southeastasia","West Central US","westcentralus","West Europe","westeurope"
        For Health supported is: "East US","eastus","West Central US","westcentralus"

    -WhatIf [<SwitchParameter>]
        <Optional> See what would happen in terms of installs.
        If extension is already installed will show what workspace is currently configured, and status of the VM extension

    -Confirm [<SwitchParameter>]
        <Optional> Confirm every action

    <CommonParameters>
        This cmdlet supports the common parameters: Verbose, Debug,
        ErrorAction, ErrorVariable, WarningAction, WarningVariable,
        OutBuffer, PipelineVariable, and OutVariable. For more information, see
        about_CommonParameters (https:/go.microsoft.com/fwlink/?LinkID=113216).

    -------------------------- EXAMPLE 1 --------------------------
    .\Install-VMInsights.ps1 -WorkspaceRegion eastus -WorkspaceId <WorkspaceId>-WorkspaceKey <WorkspaceKey> -SubscriptionId <SubscriptionId>
    -ResourceGroup <ResourceGroup>

    Install for all VMs in a resource group in a subscription

    -------------------------- EXAMPLE 2 --------------------------
    .\Install-VMInsights.ps1 -WorkspaceRegion eastus -WorkspaceId <WorkspaceId>-WorkspaceKey <WorkspaceKey> -SubscriptionId <SubscriptionId>
    -ResourceGroup <ResourceGroup> -ReInstall

    Specify to reinstall extensions even if already installed, for example, to update to a different workspace

    -------------------------- EXAMPLE 3 --------------------------
    .\Install-VMInsights.ps1 -WorkspaceRegion eastus -WorkspaceId <WorkspaceId>-WorkspaceKey <WorkspaceKey> -SubscriptionId <SubscriptionId>
    -PolicyAssignmentName a4f79f8ce891455198c08736 -ReInstall

    Specify to use a PolicyAssignmentName for source and to reinstall (move to a new workspace)
```

The following example demonstrates using the PowerShell commands in the folder to enable Azure Monitor for VMs and understand the expected output:

```powershell
$WorkspaceId = "<GUID>"
$WorkspaceKey = "<Key>"
$SubscriptionId = "<GUID>"
.\Install-VMInsights.ps1 -WorkspaceId $WorkspaceId -WorkspaceKey $WorkspaceKey -SubscriptionId $SubscriptionId -WorkspaceRegion eastus

Getting list of VMs or virtual machine scale sets matching criteria specified

VMs or virtual machine scale sets matching criteria:

db-ws-1 VM running
db-ws2012 VM running

This operation will install the Log Analytics and Dependency agent extensions on the previous two VMs or virtual machine scale sets.
VMs in a non-running state will be skipped.
Extension will not be reinstalled if already installed. Use -ReInstall if desired, for example, to update workspace.

Confirm
Continue?
[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): y

db-ws-1 : Deploying DependencyAgentWindows with name DAExtension
db-ws-1 : Successfully deployed DependencyAgentWindows
db-ws-1 : Deploying MicrosoftMonitoringAgent with name MMAExtension
db-ws-1 : Successfully deployed MicrosoftMonitoringAgent
db-ws2012 : Deploying DependencyAgentWindows with name DAExtension
db-ws2012 : Successfully deployed DependencyAgentWindows
db-ws2012 : Deploying MicrosoftMonitoringAgent with name MMAExtension
db-ws2012 : Successfully deployed MicrosoftMonitoringAgent

Summary:

Already onboarded: (0)

Succeeded: (4)
db-ws-1 : Successfully deployed DependencyAgentWindows
db-ws-1 : Successfully deployed MicrosoftMonitoringAgent
db-ws2012 : Successfully deployed DependencyAgentWindows
db-ws2012 : Successfully deployed MicrosoftMonitoringAgent

Connected to different workspace: (0)

Not running - start VM to configure: (0)

Failed: (0)
```

## Next steps

Now that monitoring is enabled for your virtual machines, this information is available for analysis with Azure Monitor for VMs.
 
- To learn how to use the health feature, see [View Azure Monitor for VMs health](vminsights-health.md). 
- To view discovered application dependencies, see [View Azure Monitor for VMs Map](vminsights-maps.md). 
- To identify bottlenecks and overall utilization with your VM's performance, see [View Azure VM Performance](vminsights-performance.md). 
- To view discovered application dependencies, see [View Azure Monitor for VMs Map](vminsights-maps.md).