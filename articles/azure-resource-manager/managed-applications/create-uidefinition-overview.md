---
title: CreateUiDefinition.json file for portal pane
description: Describes how to create user interface definitions for the Azure portal. Used when defining Azure Managed Applications.
author: tfitzmac

ms.topic: conceptual
ms.date: 08/06/2019
ms.author: tomfitz

---
# CreateUiDefinition.json for Azure managed application's create experience

This document introduces the core concepts of the **createUiDefinition.json** file which Azure portal uses to define the user interface when creating a managed application.

The template is as follows

```json
{
   "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
   "handler": "Microsoft.Azure.CreateUIDef",
   "version": "0.1.2-preview",
   "parameters": {
      "basics": [ ],
      "steps": [ ],
      "outputs": { },
      "resourceTypes": [ ]
   }
}
```

A CreateUiDefinition always contains three properties: 

* handler
* version
* parameters

The handler should always be `Microsoft.Azure.CreateUIDef`, and the latest supported version is `0.1.2-preview`.

The schema of the parameters property depends on the combination of the specified handler and version. For managed applications, the supported properties are `basics`, `steps`, and `outputs`. The basics and steps properties contain the [elements](create-uidefinition-elements.md) - like textboxes and dropdowns - to be displayed in the Azure portal. The outputs property is used to map the output values of the specified elements to the parameters of the Azure Resource Manager deployment template.

Including `$schema` is recommended, but optional. If specified, the value for `version` must match the version within the `$schema` URI.

You can use a JSON editor to create your createUiDefinition then test it in the [createUiDefinition Sandbox](https://portal.azure.com/?feature.customPortal=false&#blade/Microsoft_Azure_CreateUIDef/SandboxBlade) to preview it. For more information about the sandbox, see [Test your portal interface for Azure Managed Applications](test-createuidefinition.md).

## Basics

Basics is the first step generated when the Azure portal parses the file. In addition to displaying the elements specified in `basics`, the portal injects elements for users to choose the subscription, resource group, and location for the deployment. When possible, elements that query deployment-wide parameters, like the name of a cluster or administrator credentials, should go in this step.

## Steps

The steps property can contain zero or more additional steps to display after basics, each of which contains one or more elements. Consider adding steps per role or tier of the application being deployed. For example, add a step for master node inputs, and a step for the worker nodes in a cluster.

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
