---
title: Use symbolic names in ARM templates
description: Describes how to use symbolic names in ARM templates.
ms.topic: conceptual
ms.date: 10/05/2021

---
# Use symbolic name in ARM templates

Resource symbolic name support changes the resources property in a template an object from array, allowing customers to assign symbolic name to template resources.


## Prerequisites

- Deployments apiVersion 2020-09-01 or later.
- template language version 1.9-experimental or later:

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "languageVersion": "1.9-experimental",
      "contentVersion": "1.0.0.0",
      ...
    }
    ```

## Syntax


- Symbolic names are case sensitive, and must be unique in a template. Allowed characters: letters, numbers, and _
- Resource property is changed from an array to an object.

    ```json
    "resources": [
      {
        "type": "Microsoft.ContainerService/managedClusters",
      ...
    ```

  Vs.

    ```json
    "resources": {
      "aks": {
        "type": "Microsoft.ContainerService/managedClusters",
        ...
    ```



## Next steps

* To create and deploy a template spec, see [Quickstart: Create and deploy template spec](quickstart-create-template-specs.md).

* For more information about linking templates in template specs, see [Tutorial: Create a template spec with linked templates](template-specs-create-linked.md).

* For more information about deploying a template spec as a linked template, see [Tutorial: Deploy a template spec as a linked template](template-specs-deploy-linked-template.md).
