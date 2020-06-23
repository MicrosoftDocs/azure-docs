---
title: Prepare Log Analytics workspace for Azure Monitor for VMs
description: 
ms.subservice:
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/22/2020

---

# Prepare Log Analytics workspace for Azure Monitor for VMs
Azure Monitor for VMs requires a Log Analytics workspace to store the data it collects. Before you onboard any agents, you must prepare this workspace by installing the **VMInsights** solution. This article describes different methods for preparing a Log Analytics workspace for Azure Monitor for VMs.

## Azure portal
Go to the **Azure Monitor** page in the Azure portal and then select **Virtual machines**. 

To configure multiple workspaces, select **Workspace configuration** from the **Get Started** page. Set the criteria at the top of the page to filter the list of workspaces. Select one or more workspaces and then select **Configure selected**.

[Configure multiple workspaces]()

To configure a single workspace, select **Other onboarding options** from the **Get Started** page. Select a subscription and workspace and then click **Configure**.

![Configure workspace](media/vminsights-enable-at-scale-policy/configure-workspace.png)


## Resource Manager template
This method includes a JSON template that specifies the configuration for enabling the solution components in your Log Analytics workspace.


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
                        "name": "[concat('VMInsights', '(', parameters('WorkspaceName'),')')]",
                        "type": "Microsoft.OperationsManagement/solutions",
                        "dependsOn": [
                            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('WorkspaceName'))]"
                        ],
                        "properties": {
                            "workspaceResourceId": "[resourceId('Microsoft.OperationalInsights/workspaces/', parameters('WorkspaceName'))]"
                        },

                        "plan": {
                            "name": "[concat('VMInsights', '(', parameters('WorkspaceName'),')')]",
                            "publisher": "Microsoft",
                            "product": "[Concat('OMSGallery/', 'VMInsights')]",
                            "promotionCode": ""
                        }
                    }
                ]
            }
        ]
    }
    ```

Use the following PowerShell commands in the folder that contains the template:

```powershell
New-AzResourceGroupDeployment -Name DeploySolutions -TemplateFile InstallSolutionsForVMInsights.json -ResourceGroupName <ResourceGroupName> -WorkspaceName <WorkspaceName> -WorkspaceLocation <WorkspaceLocation - example: eastus>
```

To run the following command by using the Azure CLI:

```azurecli
az login
az account set --subscription "Subscription Name"
az group deployment create --name DeploySolutions --resource-group <ResourceGroupName> --template-file InstallSolutionsForVMInsights.json --parameters WorkspaceName=<workspaceName> WorkspaceLocation=<WorkspaceLocation - example: eastus>
```


## Next steps

Now that monitoring is enabled for your virtual machines, this information is available for analysis with Azure Monitor for VMs.

- To view discovered application dependencies, see [View Azure Monitor for VMs Map](vminsights-maps.md).

- To identify bottlenecks and overall utilization with your VM's performance, see [View Azure VM Performance](vminsights-performance.md).
