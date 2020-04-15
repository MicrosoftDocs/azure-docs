---
title: Use Azure Resource Manager templates to create Automation account | Microsoft Docs
description: You can use an Azure Resource Manager template to create an Azure Automation account.
ms.service:  automation
ms.subservice: update-management
ms.topic: conceptual
author: mgoedtel
ms.author: magoedte
ms.date: 04/15/2020

---

# Create Automation account using Azure Resource Manager template

You can use [Azure Resource Manager templates](../azure-resource-manager/templates/template-syntax.md) to create an Azure Automation account in your resource group. This article provides a sample template that automates the following:

* Creation of a Azure Monitor Log Analytics workspace.
* Creation of an Azure Automation account.
* Links the Automation account to the Log Analytics workspace if not already linked.

The template does not automate the onboarding of one or more Azure or non-Azure VMs, or solutions.

## API versions

The following table lists the API version for the resources used in this example.

| Resource | Resource type | API version |
|:---|:---|:---|
| Workspace | workspaces | 2017-03-15-preview |
| Automation account | automation | 2015-10-31 | 

## Before using the template

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell Az module. Run `Get-Module -ListAvailable Az` to find the version. If you need to upgrade, see [Install the Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure. With Azure PowerShell, deployment uses [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment).

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.1.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest). With Azure CLI, this deployment uses [az group deployment create](https://docs.microsoft.com/cli/azure/group/deployment?view=azure-cli-latest#az-group-deployment-create). 

The JSON template is configured to prompt you for:

* The name of the workspace
* The region to create the workspace in
* The name of the Automation account
* The region to create the account in

The JSON template specifies a default value for the other parameters that would likely be used as a standard configuration in your environment. You can store the template in an Azure storage account for shared access in your organization. For further information about working with templates, see [Deploy resources with Resource Manager templates and Azure CLI](../azure-resource-manager/templates/deploy-cli.md).

The following parameters in the template are set with a default value for the Log Analytics workspace:

* sku - defaults to the new Per-GB pricing tier released in the April 2018 pricing model
* data retention - defaults to thirty days
* capacity reservation - defaults to 100 GB

>[!WARNING]
>If creating or configuring a Log Analytics workspace in a subscription that has opted into the new April 2018 pricing model, the only valid Log Analytics pricing tier is **PerGB2018**.
>

>[!NOTE]
>Before using this template, review [additional details](../azure-monitor/platform/template-workspace-configuration.md#create-a-log-analytics-workspace) to fully understand workspace configuration options such as access control mode, pricing tier, retention, and capacity reservation level. If you are new to Azure Monitor logs and have not deployed a workspace already, you should review the [workspace design](../azure-monitor/platform/design-logs-deployment.md) guidance to learn about access control, and an understanding of the design implementation strategies we recommend for your organization.

## Deploy template

1. Copy and paste the following JSON syntax into your file:

    ```json
    {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "workspaceName": {
            "type": "string",
            "metadata": {
                "description": "Workspace name"
            }
        },
        "sku": {
            "type": "string",
            "allowedValues": [
                "pergb2018",
                "Free",
                "Standalone",
                "PerNode",
                "Standard",
                "Premium"
            ],
            "defaultValue": "pergb2018",
            "metadata": {
                "description": "Pricing tier: perGB2018 or legacy tiers (Free, Standalone, PerNode, Standard or Premium) which are not available to all customers."
            }
        },
        "dataRetention": {
            "type": "int",
            "defaultValue": 30,
            "minValue": 7,
            "maxValue": 730,
            "metadata": {
                "description": "Number of days of retention. Workspaces in the legacy Free pricing tier can only have 7 days."
            }
        },
        "immediatePurgeDataOn30Days": {
            "type": "bool",
            "defaultValue": "[bool('false')]",
            "metadata": {
                "description": "If set to true when changing retention to 30 days, older data will be immediately deleted. Use this with extreme caution. This only applies when retention is being set to 30 days."
            }
        },
        "location": {
            "type": "string",
            "allowedValues": [
                "australiacentral",
                "australiaeast",
                "australiasoutheast",
                "brazilsouth",
                "canadacentral",
                "centralindia",
                "centralus",
                "eastasia",
                "eastus",
                "eastus2",
                "francecentral",
                "japaneast",
                "koreacentral",
                "northcentralus",
                "northeurope",
                "southafricanorth",
                "southcentralus",
                "southeastasia",
                "uksouth",
                "ukwest",
                "westcentralus",
                "westeurope",
                "westus",
                "westus2"
            ],
            "metadata": {
                "description": "Specifies the location in which to create the workspace."
            }
        },
        "automationAccountName": {
            "type": "string",
            "metadata": {
                "description": "Automation account name"
            }
        },
        "automationAccountLocation": {
            "type": "string",
            "metadata": {
                "description": "Specify the location in which to create the Automation account."
            }
        }
    },
    "resources": [
        {
        "type": "Microsoft.OperationalInsights/workspaces",
            "name": "[parameters('workspaceName')]",
            "apiVersion": "2017-03-15-preview",
            "location": "[parameters('location')]",
            "properties": {
                "sku": {
                    "Name": "[parameters('sku')]",
                    "name": "CapacityReservation",
                    "capacityReservationLevel": 100
                },
                "retentionInDays": "[parameters('dataRetention')]",
                "features": {
                    "searchVersion": 1,
                    "legacy": 0,
                    "enableLogAccessUsingOnlyResourcePermissions": true
                }
            },
        {
            "type": "Microsoft.Automation/automationAccounts",
            "apiVersion": "2015-01-01-preview",
            "name": "[parameters('automationAccountName')]",
            "location": "[parameters('automationAccountLocation')]",
            "dependsOn": [],
            "tags": {},
            "properties": {
                "sku": {
                    "name": "Basic"
                }
            },
        },
        {
            "apiVersion": "2015-11-01-preview",
            "type": "Microsoft.OperationalInsights/workspaces/linkedServices",
            "name": "[concat(parameters('workspaceName'), '/' , 'Automation')]",
            "location": "[resourceGroup().location]",
            "dependsOn": [
                "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]",
                "[concat('Microsoft.Automation/automationAccounts/', parameters('automationAccountName'))]"
            ],
            "properties": {
                "resourceId": "[resourceId('Microsoft.Automation/automationAccounts/', parameters('automationAccountName'))]"
            }
        }
      ]
    }
    ```

2. Edit the template to meet your requirements. Consider creating a [Resource Manager parameters file](../azure-resource-manager/templates/parameter-files.md) instead of passing parameters as inline values.

3. Save this file as deployAzAutomationAccttemplate.json to a local folder.

4. You are ready to deploy this template. You can use either PowerShell or the Azure CLI. When you're prompted for a workspace and Automation account name, provide a name that is globally unique across all Azure subscriptions.

    **PowerShell**

    ```powershell
    New-AzResourceGroupDeployment -Name <deployment-name> -ResourceGroupName <resource-group-name> -TemplateFile deployAzAutomationAccttemplate.json
    ```

    **Azure CLI**

    ```cli
    az group deployment create --resource-group <my-resource-group> --name <my-deployment-name> --template-file deployAzAutomationAccttemplate.json
    ```

    The deployment can take a few minutes to complete. When it finishes, you see a message similar to the following that includes the result:

    ![Example result when deployment is complete](media/automation-update-management-deploy-template/template-output.png)

## Next steps

Now that you have an Automation account, you can create runbooks and automate manual processes.
