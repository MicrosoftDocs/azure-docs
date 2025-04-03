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

Azure DevTest Labs *environments* consist of multiple infrastructure-as-a-service (IaaS) virtual machines (VMs) with platform-as-a-service (PaaS) resources installed. You can provision DevTest Labs environments by using Azure Resource Manager (ARM) templates.

This article describes using *nested templates* to deploy a DevTest Labs environment. A nested deployment runs secondary ARM templates from within a main template. Using a set of targeted, purpose-specific templates provides testing, reuse, and readability benefits. 

For general information about nested templates, including code samples, see [Use linked and nested templates when deploying Azure resources](/azure/azure-resource-manager/templates/linked-templates).

[!INCLUDE [direct-azure-deployment-environments](includes/direct-azure-deployment-environments.md)]  

## Nested template deployment with Visual Studio

The Azure Resource Group project template in Visual Studio makes it easy to develop and debug nested templates. In DevTest Labs, you can store ARM templates in a Git repository linked to a lab. When you use a repository template to create an environment, DevTest Labs copies the template files into the lab's Azure Storage container.

When you add a nested template to a lab repository and main *azuredeploy.json* template file, Visual Studio automatically takes the following actions:

- Adds a subfolder for the secondary template and parameters files, and copies the subfolder to the lab storage container.
- Adds variables for the nested template folder and files to the `variables` section of the main template file.
- Adds the `_artifactsLocation` and `_artifactsLocationSasToken` parameters to the main template file.
- Inserts the location and Shared Access Signature (SaS) token into the parameters file.

The following screenshot shows the project structure in Visual Studio. The Git repository folder has a subfolder, *nestedtemplates*, that contains the nested template files *NestOne.json* and *NestOne.parameters.json*. You can add more than one nested template subfolder, but at only one level of nesting.

:::image type="content" source="media/deploy-nested-template-environments/visual-studio-project-structure.png" alt-text="Screenshot that shows the nested template project structure in Visual Studio.":::

## Nested deployment example

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
