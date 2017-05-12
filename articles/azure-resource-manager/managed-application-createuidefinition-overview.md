---
title: Understand creating UI definition for Azure Managed Applications | Microsoft Docs
description: Describes how to create UI definitions for Azure Managed Applications
services: azure-resource-manager
documentationcenter: na
author: tabrezm
manager: timlt
editor: tysonn

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/11/2017
ms.author: tabrezm;tomfitz

---
# Getting started with CreateUiDefinition
This document introduces the core concepts of a CreateUiDefinition, which is used by the Azure portal to generate the user interface for creating a managed application.

```json
{
   "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json",
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

## Basics
The Basics step is always the first step of the wizard generated when the Azure portal parses a CreateUiDefinition. In addition to displaying the elements specified in `basics`, the portal injects elements for users to choose the subscription, resource group, and location for the deployment. Generally, elements that query for deployment-wide parameters, like the name of a cluster or administrator credentials, should go in this step.

If an element's behavior depends on the user's subscription, resource group, or location, then that element can't be used in basics. For example, **Microsoft.Compute.SizeSelector** depends on the user's subscription and location to determine the list of available sizes. Therefore, **Microsoft.Compute.SizeSelector** can only be used in steps. Generally, only elements in the **Microsoft.Common** namespace can be used in basics. Although some elements in other namespaces (like **Microsoft.Compute.Credentials**) that don't depend on the user's context, are still allowed.

## Steps
The steps property can contain zero or more additional steps to display after basics, each of which contains one or more elements. Consider adding steps per role or tier of the application being deployed. For example, add a step for inputs for the master nodes, and a step for the worker nodes in a cluster.

## Outputs
The Azure portal uses the `outputs` property to map elements from `basics` and `steps` to the parameters of the Azure Resource Manager deployment template. The keys of this dictionary are the names of the template parameters, and the values are properties of the output objects from the referenced elements.

## Functions
Similar to [template functions](resource-group-template-functions.md) in Azure Resource Manager (both in syntax and functionality), CreateUiDefinition provides functions for working with elements' inputs and outputs, as well as features such as conditionals.

## Next steps
CreateUiDefinition itself has a simple schema. The real depth of it comes from all the supported elements and functions, which the following documents describe in wondrous detail:

- [Elements](managed-application-createuidefinition-elements.md)
- [Functions](managed-application-createuidefinition-functions.md)

A current JSON schema for CreateUiDefinition is available here: https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json. 

Later versions will be available at the same location. Replace the `0.1.2-preview` portion of the URL and the `version` value with the version identifier you intend to use. The currently supported version identifiers are `0.0.1-preview`, `0.1.0-preview`, `0.1.1-preview`, and `0.1.2-preview`.