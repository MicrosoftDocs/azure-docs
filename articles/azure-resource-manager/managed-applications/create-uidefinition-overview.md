---
title: CreateUiDefinition.json file for portal pane
description: Describes how to create user interface definitions for the Azure portal. Used when defining Azure Managed Applications.
ms.topic: conceptual
ms.date: 03/26/2021
---

# CreateUiDefinition.json for Azure managed application's create experience

This document introduces the core concepts of the **createUiDefinition.json** file. The Azure portal uses this file to define the user interface when creating a managed application.

The template is as follows

```json
{
    "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
    "handler": "Microsoft.Azure.CreateUIDef",
    "version": "0.1.2-preview",
    "parameters": {
        "config": {
            "isWizard": false,
            "basics": { }
        },
        "basics": [ ],
        "steps": [ ],
        "outputs": { },
        "resourceTypes": [ ]
    }
}
```

A `CreateUiDefinition` always contains three properties:

* handler
* version
* parameters

The handler should always be `Microsoft.Azure.CreateUIDef`, and the latest supported version is `0.1.2-preview`.

The schema of the parameters property depends on the combination of the specified handler and version. For managed applications, the supported properties are `config`, `basics`, `steps`, and `outputs`. You use `config` only when you need to override the default behavior of the `basics` step. The basics and steps properties contain the [elements](create-uidefinition-elements.md) - like textboxes and dropdowns - to be displayed in the Azure portal. The outputs property is used to map the output values of the specified elements to the parameters of the Azure Resource Manager template.

Including `$schema` is recommended, but optional. If specified, the value for `version` must match the version within the `$schema` URI.

You can use a JSON editor to create your createUiDefinition then test it in the [createUiDefinition Sandbox](https://portal.azure.com/?feature.customPortal=false&#blade/Microsoft_Azure_CreateUIDef/SandboxBlade) to preview it. For more information about the sandbox, see [Test your portal interface for Azure Managed Applications](test-createuidefinition.md).

## Config

The `config` property is optional. Use it to either override the default behavior of the basics step, or to set your interface as a step-by-step wizard. If `config` is used, it's the first property in the **createUiDefinition.json** file's `parameters` section. The following example shows the available properties.

```json
"config": {
    "isWizard": false,
    "basics": {
        "description": "Customized description with **markdown**, see [more](https://www.microsoft.com).",
        "subscription": {
            "constraints": {
                "validations": [
                    {
                        "isValid": "[not(contains(subscription().displayName, 'Test'))]",
                        "message": "Can't use test subscription."
                    },
                    {
                        "permission": "Microsoft.Compute/virtualmachines/write",
                        "message": "Must have write permission for the virtual machine."
                    },
                    {
                        "permission": "Microsoft.Compute/virtualMachines/extensions/write",
                        "message": "Must have write permission for the extension."
                    }
                ]
            },
            "resourceProviders": [
                "Microsoft.Compute"
            ]
        },
        "resourceGroup": {
            "constraints": {
                "validations": [
                    {
                        "isValid": "[not(contains(resourceGroup().name, 'test'))]",
                        "message": "Resource group name can't contain 'test'."
                    }
                ]
            },
            "allowExisting": true
        },
        "location": {
            "label": "Custom label for location",
            "toolTip": "provide a useful tooltip",
            "resourceTypes": [
                "Microsoft.Compute/virtualMachines"
            ],
            "allowedValues": [
                "eastus",
                "westus2"
            ],
            "visible": true
        }
    }
},
```

For the `isValid` property, write an expression that resolves to either true or false. For the `permission` property, specify one of the [resource provider actions](../../role-based-access-control/resource-provider-operations.md).

### Wizard

The `isWizard` property enables you to require successful validation of each step before proceeding to the next step. When the `isWizard` property isn't specified, the default is **false**, and step-by-step validation isn't required.

When `isWizard` is enabled, set to **true**, the **Basics** tab is available and all other tabs are disabled. When the **Next** button is selected the tab's icon indicates if a tab's validation passed or failed. After a tab's required fields are completed and validated, the **Next** button allows navigation to the next tab. When all tabs pass validation, you can go to the **Review and Create** page and select the **Create** button to begin the deployment.

:::image type="content" source="./media/create-uidefinition-overview/tab-wizard.png" alt-text="Tab wizard":::

### Override basics

The basics config lets you customize the basics step.

For `description`, provide a markdown-enabled string that describes your resource. Multi-line format and links are supported.

The `subscription` and `resourceGroup` elements enable you to specify more validations. The syntax for specifying validations is identical to the custom validation for [text box](microsoft-common-textbox.md). You can also specify `permission` validations on the subscription or resource group.

The subscription control accepts a list of resource provider namespaces. For example, you can specify **Microsoft.Compute**. It shows an error message when the user selects a subscription that doesn't support the resource provider. The error occurs when the resource provider isn't registered on that subscription, and the user doesn't have permission to register the resource provider.

The resource group control has an option for `allowExisting`. When `true`, the users can select resource groups that already have resources. This flag is most applicable to solution templates, where default behavior mandates users must select a new or empty resource group. In most other scenarios, specifying this property isn't necessary.

For `location`, specify the properties for the location control you wish to override. Any properties not overridden are set to their default values. `resourceTypes` accepts an array of strings containing fully qualified resource type names. The location options are restricted to only regions that support the resource types. `allowedValues` accepts an array of region strings. Only those regions appear in the dropdown. You can set both `allowedValues` and `resourceTypes`. The result is the intersection of both lists. Lastly, the `visible` property can be used to conditionally or completely disable the location dropdown. 

## Basics

The **Basics** step is the first step generated when the Azure portal parses the file. By default, the basics step lets users choose the subscription, resource group, and location for deployment.

:::image type="content" source="./media/create-uidefinition-overview/basics.png" alt-text="Basics default":::

You can add more elements in this section. When possible, add elements that query deployment-wide parameters, like the name of a cluster or administrator credentials.

The following example shows a text box that has been added to the default elements.

```json
"basics": [
    {
        "name": "textBox1",
        "type": "Microsoft.Common.TextBox",
        "label": "Textbox on basics",
        "defaultValue": "my text value",
        "toolTip": "",
        "visible": true
    }
]
```

## Steps

The steps property contains zero or more steps to display after basics. Each step contains one or more elements. Consider adding steps per role or tier of the application being deployed. For example, add a step for primary node inputs, and a step for the worker nodes in a cluster.

```json
"steps": [
    {
        "name": "demoConfig",
        "label": "Configuration settings",
        "elements": [
          ui-elements-needed-to-create-the-instance
        ]
    }
]
```

## Outputs

The Azure portal uses the `outputs` property to map elements from `basics` and `steps` to the parameters of the Azure Resource Manager deployment template. The keys of this dictionary are the names of the template parameters, and the values are properties of the output objects from the referenced elements.

To set the managed application resource name, you must include a value named `applicationResourceName` in the outputs property. If you don't set this value, the application assigns a GUID for the name. You can include a textbox in the user interface that requests a name from the user.

```json
"outputs": {
    "vmName": "[steps('appSettings').vmName]",
    "trialOrProduction": "[steps('appSettings').trialOrProd]",
    "userName": "[steps('vmCredentials').adminUsername]",
    "pwd": "[steps('vmCredentials').vmPwd.password]",
    "applicationResourceName": "[steps('appSettings').vmName]"
}
```

## Resource types

To filter the available locations to only those locations that support the resource types to deploy, provide an array of the resource types. If you provide more than one resource type, only those locations that support all of the resource types are returned. This property is optional.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
    "handler": "Microsoft.Azure.CreateUIDef",
    "version": "0.1.2-preview",
    "parameters": {
        "resourceTypes": ["Microsoft.Compute/disks"],
        "basics": [
          ...
```

## Functions

CreateUiDefinition provides [functions](create-uidefinition-functions.md) for working with elements' inputs and outputs, and features such as conditionals. These functions are similar in both syntax and functionality to Azure Resource Manager template functions.

## Next steps

The createUiDefinition.json file itself has a simple schema. The real depth of it comes from all the supported elements and functions. Those items are described in greater detail at:

- [Elements](create-uidefinition-elements.md)
- [Functions](create-uidefinition-functions.md)

A current JSON schema for createUiDefinition is available here: `https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json`.

For an example user interface file, see [createUiDefinition.json](https://github.com/Azure/azure-managedapp-samples/blob/master/Managed%20Application%20Sample%20Packages/201-managed-app-using-existing-vnet/createUiDefinition.json).
