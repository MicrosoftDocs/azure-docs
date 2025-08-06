---
title: Reference linked templates and artifacts
description: Describes how publishers can refer to linked files in their Azure Applications offer packages.
ms.topic: how-to
ms.date: 05/12/2025
ms.custom:
  - build-2025
---

# Reference artifacts in Azure Applications offers

This article shows you how to refer to linked artifacts in an Azure Application offer using the ```_artifactsLocation``` and ```_artifactsLocationSasToken``` parameters in the _mainTemplate.json_ file. Solution Template and Managed Application offers that are published through Partner Center or Service Catalog must now use these parameters to reference linked artifacts in their offer package. An artifact is any additional file that you include in your offer package aside from the _mainTemplate.json_ and _createUIDefinition.json_ files, including scripts and nested templates. 

## How to use artifacts locations parameters

Let's define the relevant parameters:

```_artifactsLocation```: Base URI where all artifacts for the deployment will be staged. The defaultValue must include a trailing slash when providing a value for the parameter.

```_artifactsLocationSasToken```: SAS token required to access the location specified in the ```_artifactsLocation``` parameter. The defaultValue should be an empty string "". When the template is deployed with its accompanying artifacts, a SAS token will be automatically generated for them.

The following example shows a sample configuration of the ```_artifactsLocation``` and ```_artifactsLocationSasToken``` parameters that would be used in the _mainTemplate.json_ file:

```json
{
    "parameters": {
        "_artifactsLocation": {
            "type": "string",
            "metadata": {
                "description": "Base URI where all artifacts for the deployment will be staged. The defaultValue must include a trailing slash when providing a value for the parameter."
            },
            "defaultValue": "[deployment().properties.templateLink.uri]"
        },
        "_artifactsLocationSasToken": {
            "type": "securestring",
            "metadata": {
                "description": "SAS token required to access the location specified in the ```_artifactsLocation``` parameter. The defaultValue should be an empty string "". When the template is deployed with its accompanying artifacts, a SAS token will be automatically generated for them."
            },
            "defaultValue": ""
        }
    }
}
```
Once you have added the artifacts parameters to your mainTemplate.json file, you can construct URI variables for your artifacts. These variables must be created using the uri() function.
*** add link to uri function documentation***

The following example shows a sample configuration for a script and a nested template artifact that would be defined in the mainTemplate.json file:

```json
{
    "variables": {
        "scriptFileUri": "[uri(parameters('_artifactsLocation'), concat('scripts/configuration.sh', parameters('_artifactsLocationSasToken')))]",
        "nestedTemplateUri": "[uri(parameters('_artifactsLocation'), concat('nestedtemplates/jumpbox.json', parameters('_artifactsLocationSasToken')))]"
    }
}
```

## How these parameters work during deployment

During deployment, the Azure Applications service will update the value for the ```_artifactsLocationSasToken``` parameter with a SAS token that provides access to the artifacts you provide in your offer. This ensures that your files are accessible during your customers' deployments. It also allows the service to only provide access to the artifacts during deployment without making these files constantly available to the internet.

## Next steps

To learn more about the artifacts locations validations in Azure Applications, see [Test cases for ARM templates](../templates/template-test-cases.md#artifacts-parameter-defined-correctly).
