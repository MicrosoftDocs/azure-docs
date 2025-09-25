---
title: Nested ARM templates for lab environments
description: Learn about using nested Azure Resource Manager (ARM) templates to deploy Azure DevTest Labs environments.
ms.topic: how-to
ms.custom: devx-track-arm-template, UpdateFrequency2
ms.author: rosemalcolm
author: RoseHJM
ms.date: 04/02/2025

#customer intent: As a DevTest labs user, I want to learn about using nested templates to deploy environments so I can take advantage of their testing, reuse, and readability benefits.
---

#  Nested templates in DevTest Labs environments

An Azure DevTest Labs *environment* consists of multiple infrastructure-as-a-service (IaaS) virtual machines (VMs) with platform-as-a-service (PaaS) resources installed. You can provision and deploy DevTest Labs environments by using Azure Resource Manager (ARM) templates.

To deploy complex solutions like environments, you can break a template into secondary templates, and deploy these templates through a main template. This article describes using *nested templates* to deploy a DevTest Labs environment. Using a set of targeted, purpose-specific templates to deploy an environment promotes testing, reuse, and readability.

For general information about nested templates, including code samples, see [Use linked and nested templates when deploying Azure resources](/azure/azure-resource-manager/templates/linked-templates).

[!INCLUDE [direct-azure-deployment-environments](includes/direct-azure-deployment-environments.md)]  

## Nested template deployment

In DevTest Labs, you can store ARM templates in a Git repository linked to a lab. When you use repository templates to create an environment, DevTest Labs copies all template and artifact files, including nested template files, into the lab's Azure Storage container.

The main *azuredeploy.json* template file for a nested template deployment uses `Microsoft.Resources/deployments` objects to call linked secondary templates. You provide URI values for the linked templates, and generate a Shared Access Signature (SaS) token for the deployment.

The deployment uses Azure PowerShell `New-AzResourceGroupDeployment` or Azure CLI `az deployment group create`, specifying the main template URI and the SaS token. For more information, see [Tutorial: Deploy a linked template](/azure/azure-resource-manager/templates/deployment-tutorial-linked-template).

## Nested template example

The following example *azuredeploy.json* main template file shows the code for a nested deployment. The main template file defines links to the nested template.

The link URI for the secondary template concatenates the artifacts location, nested template folder, nested template filename, and artifacts Shared Access Signature (SaS) token location. The URI for the secondary parameters file uses the artifacts location, nested template folder, nested parameter filename, and artifacts SaS token location.

```json

"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
"contentVersion": "1.0.0.0",
"parameters": {
    "_artifactsLocation": {
        "type": "string"
    },
    "_artifactsLocationSasToken": {
        "type": "securestring"
    }},
"variables": {
    "NestOneTemplateFolder": "nestedtemplates",
    "NestOneTemplateFileName": "NestOne.json",
    "NestOneTemplateParametersFileName": "NestOne.parameters.json"},
    "resources": [
    {
        "name": "NestOne",
        "type": "Microsoft.Resources/deployments",
        "apiVersion": "2016-09-01",
        "dependsOn": [ ],
        "properties": {
            "mode": "Incremental",
            "templateLink": {
                "uri": "[concat(parameters('_artifactsLocation'), '/', variables('NestOneTemplateFolder'), '/', variables('NestOneTemplateFileName'), parameters('_artifactsLocationSasToken'))]",
                "contentVersion": "1.0.0.0"
            },
            "parametersLink": {
                "uri": "[concat(parameters('_artifactsLocation'), '/', variables('NestOneTemplateFolder'), '/', variables('NestOneTemplateParametersFileName'), parameters('_artifactsLocationSasToken'))]",
                "contentVersion": "1.0.0.0"
            }
        }    
    }],
"outputs": {}
```

## Related content

- For more information about DevTest Labs environments, see [Use ARM templates to create DevTest Labs environments](devtest-lab-create-environment-from-arm.md).
- For more information about using the Visual Studio Azure Resource Group project template, including code samples, see [Create and deploy Azure resource groups through Visual Studio](/azure/azure-resource-manager/templates/create-visual-studio-deployment-project).
