---
title: Understand creating UI definition for Azure managed applications | Microsoft Docs
description: Describes how to create UI definitions for Azure Managed Applications
services: managed-applications
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.service: managed-applications
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/26/2019
ms.author: tomfitz

---
# Create Azure portal user interface for your managed application
This document introduces the core concepts of the createUiDefinition.json file. The Azure portal uses this file to generate the user interface for creating a managed application.

```json
{
   "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
   "handler": "Microsoft.Compute.MultiVm",
   "version": "0.1.2-preview",
   "parameters": {
      "basics": [ ],
      "steps": [ ],
      "outputs": { }
   }
}
```

A CreateUiDefinition always contains three properties: 

* handler
* version
* parameters

For managed applications, handler should always be `Microsoft.Compute.MultiVm`, and the latest supported version is `0.1.2-preview`.

The schema of the parameters property depends on the combination of the specified handler and version. For managed applications, the supported properties are `basics`, `steps`, and `outputs`. The basics and steps properties contain the _elements_ - like textboxes and dropdowns - to be displayed in the Azure portal. The outputs property is used to map the output values of the specified elements to the parameters of the Azure Resource Manager deployment template.

Including `$schema` is recommended, but optional. If specified, the value for `version` must match the version within the `$schema` URI.

You can use a JSON editor to create your UI definition, or you can use the UI Definition Sandbox to create and preview the UI definition. For more information about the sandbox, see [Test your portal interface for Azure Managed Applications](test-createuidefinition.md).

## Basics
The Basics step is always the first step of the wizard generated when the Azure portal parses the file. In addition to displaying the elements specified in `basics`, the portal injects elements for users to choose the subscription, resource group, and location for the deployment. Generally, elements that query for deployment-wide parameters, like the name of a cluster or administrator credentials, should go in this step.

If an element's behavior depends on the user's subscription, resource group, or location, then that element can't be used in basics. For example, **Microsoft.Compute.SizeSelector** depends on the user's subscription and location to determine the list of available sizes. Therefore, **Microsoft.Compute.SizeSelector** can only be used in steps. Generally, only elements in the **Microsoft.Common** namespace can be used in basics. Although some elements in other namespaces (like **Microsoft.Compute.Credentials**) that don't depend on the user's context, are still allowed.

## Steps
The steps property can contain zero or more additional steps to display after basics, each of which contains one or more elements. Consider adding steps per role or tier of the application being deployed. For example, add a step for inputs for the master nodes, and a step for the worker nodes in a cluster.

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

## Functions
Similar to template functions in Azure Resource Manager (both in syntax and functionality), CreateUiDefinition provides functions for working with elements' inputs and outputs, and features such as conditionals.

## Next steps
The createUiDefinition.json file itself has a simple schema. The real depth of it comes from all the supported elements and functions. Those items are described in greater detail at:

- [Elements](create-uidefinition-elements.md)
- [Functions](create-uidefinition-functions.md)

A current JSON schema for createUiDefinition is available here: https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json.

For an example user interface file, see [createUiDefinition.json](https://github.com/Azure/azure-managedapp-samples/blob/master/samples/201-managed-app-using-existing-vnet/createUiDefinition.json).
