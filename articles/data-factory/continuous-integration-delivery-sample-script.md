---
title: Continuous integration and delivery pre- and post-deployment scripts
description: Learn how to use a pre- and post-deployment script with continuous integration and delivery in Azure Data Factory from this sample.
ms.service: data-factory
ms.subservice: ci-cd
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.topic: conceptual
ms.date: 10/20/2023 
ms.custom: devx-track-azurepowershell
---

# Sample pre- and post-deployment script

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

The following sample demonstrates how to use a pre- and post-deployment script with continuous integration and delivery in Azure Data Factory.

## Install Azure PowerShell

Install the latest Azure PowerShell modules by following instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azure-powershell).

>[!WARNING]
>Make sure to use **PowerShell Core** in ADO task to run the script

## Pre- and post-deployment script 
The sample scripts to stop/ start triggers and update global parameters during release process (CICD) are located in the [Azure Data Factory Official GitHub page](https://github.com/Azure/Azure-DataFactory/tree/main/SamplesV2/ContinuousIntegrationAndDelivery).

> [!NOTE]
> Use the [PrePostDeploymentScript.Ver2.ps1](https://github.com/Azure/Azure-DataFactory/blob/main/SamplesV2/ContinuousIntegrationAndDelivery/PrePostDeploymentScript.Ver2.ps1) if you would like to turn off/ on only the triggers that have been modified instead of turning all triggers off/ on during CI/CD.


## Script execution and parameters

The following sample script can be used to stop triggers before deployment and restart them afterward. The script also includes code to delete resources that have been removed. Save the script in an Azure DevOps  git repository and reference it via an Azure PowerShell task the latest Azure PowerShell version.


When running a predeployment script, you need to specify a variation of the following parameters in the **Script Arguments** field.

`-armTemplate "$(System.DefaultWorkingDirectory)/<your-arm-template-location>" -ResourceGroupName <your-resource-group-name> -DataFactoryName <your-data-factory-name>  -predeployment $true -deleteDeployment $false`


When running a postdeployment script, you need to specify a variation of the following parameters in the **Script Arguments** field.

`-armTemplate "$(System.DefaultWorkingDirectory)/<your-arm-template-location>" -ResourceGroupName <your-resource-group-name> -DataFactoryName <your-data-factory-name>  -predeployment $false -deleteDeployment $true`

> [!NOTE]
> The `-deleteDeployment` flag is used to specify the deletion of the ADF deployment entry from the deployment history in ARM.

:::image type="content" source="media/continuous-integration-delivery/continuous-integration-image11.png" alt-text="Azure PowerShell task":::

## Script execution and parameters - YAML Pipelines
The following YAML code executes a script that can be used to stop triggers before deployment and restart them afterward. The script also includes code to delete resources that have been removed. If you're following the steps outlined in [New CI/CD Flow](continuous-integration-delivery-improvements.md), this script is exported as part of artifact created via the npm publish package.

### Stop ADF Triggers
```
 - task: AzurePowerShell@5
            displayName: Stop ADF Triggers
            inputs:
              scriptType: 'FilePath'
              ConnectedServiceNameARM: AzureDevServiceConnection
              scriptPath: ../ADFTemplates/PrePostDeploymentScript.ps1
              ScriptArguments: -armTemplate "<your-arm-template-location>" -ResourceGroupName <your-resource-group-name> -DataFactoryName <your-data-factory-name> -predeployment $true -deleteDeployment $false
              errorActionPreference: stop
              FailOnStandardError: False
              azurePowerShellVersion: 'LatestVersion'
              pwsh: True
              workingDirectory: ../
```

### Start ADF Triggers
```
          - task: AzurePowerShell@5
            displayName: Start ADF Triggers
            inputs:
              scriptType: 'FilePath'
              ConnectedServiceNameARM: AzureDevServiceConnection
              scriptPath: ../ADFTemplates/PrePostDeploymentScript.ps1
              ScriptArguments: -armTemplate "<your-arm-template-location>" -ResourceGroupName <your-resource-group-name> -DataFactoryName <your-data-factory-name>-predeployment $false -deleteDeployment $true
              errorActionPreference: stop
              FailOnStandardError: False
              azurePowerShellVersion: 'LatestVersion'
              pwsh: True
              workingDirectory: ../
```

## Next steps

- [Continuous integration and delivery overview](continuous-integration-delivery.md)
- [Automate continuous integration using Azure Pipelines releases](continuous-integration-delivery-automate-azure-pipelines.md)
- [Manually promote a Resource Manager template to each environment](continuous-integration-delivery-manual-promotion.md)
- [Use custom parameters with a Resource Manager template](continuous-integration-delivery-resource-manager-custom-parameters.md)
- [Linked Resource Manager templates](continuous-integration-delivery-linked-templates.md)
- [Using a hotfix production environment](continuous-integration-delivery-hotfix-environment.md)
