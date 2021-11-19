---
title: Job size exceeded error
description: Describes how to troubleshoot errors when job size or template are too large.
ms.topic: troubleshooting
ms.date: 11/19/2021
---

# Resolve errors for job size exceeded

This article describes how to resolve the `JobSizeExceededException` and `DeploymentJobSizeExceededException` errors. The errors are possible when you deploy an Azure Resource Manager template (ARM template) or Bicep file.

## Symptom

When deploying a template, you receive an error stating the deployment has exceeded limits.

## Cause

You get this error when the deployment exceeds an allowed limit. Typically, you see this error when either your template or the job that runs the deployment is too large.

The deployment job can't exceed 1 MB and that includes metadata about the request. For large templates, the metadata combined with the template might exceed a job's allowed size.

The template can't exceed 4 MB. The 4-MB limit applies to the final state of the template after it has been expanded for resource definitions that use loops to create many instances. The final state also includes the resolved values for variables and parameters.

Other template limits are:

- 256 parameters
- 256 variables
- 800 resources (including copy count)
- 64 output values
- 24,576 characters in a template expression

# [Bicep](#tab/bicep)

Bicep uses `for` [loops](../bicep/loops.md) to iterate values in a collection. During deployment, resources might have [dependencies](../bicep/resource-declaration.md#dependencies) on other resources.

An [implicit dependency](../bicep/resource-declaration.md#implicit-dependency) is created when a resource references another resource by its symbolic name. For most deployments, it's not necessary to use `dependsOn` and create an [explicit dependency](../bicep/resource-declaration.md#explicit-dependency).

# [JSON](#tab/json)

When using [copy](../templates/copy-resources.md) loops to deploy resources, don't use the loop name as a dependency:

```json
dependsOn: [ "nicLoop" ]
```

Instead, use the instance of the resource from the loop that you need to depend on. For example:

```json
dependsOn: [
    "[resourceId('Microsoft.Network/networkInterfaces', concat('nic-', copyIndex()))]"
]
```

---

## Solution 1 - Simplify template

# [Bicep](#tab/bicep)

In Bicep, you use [modules](../bicep/modules.md) to deploy resources. A module is a Bicep file that's deployed from another Bicep file. When the Bicep file builds, it creates an ARM template with nested templates. To get output, see [Outputs from modules](../bicep/outputs.md#outputs-from-modules).

# [JSON](#tab/json)

Your first option is to simplify the template. This option works when your template deploys lots of different resource types. Consider dividing the template into [linked templates](../templates/linked-templates.md). Divide your resource types into logical groups and add a linked template for each group. For example, if you need to deploy lots of networking resources, you can move those resources to a linked template.

You can set other resources as dependent on the linked template, and [get values from the output of the linked template](../templates/linked-templates.md#get-values-from-linked-template).

---

## Solution 2 - Reduce name size

# [Bicep](#tab/bicep)

Try to shorten the length of the names you use for [parameters](../bicep/parameters.md), [variables](../bicep/variables.md), and [outputs](../bicep/outputs.md). When these values are repeated in loops, a long name gets multiplied many times.

# [JSON](#tab/json)

Try to shorten the length of the names you use for [parameters](../templates/parameters.md), [variables](../templates/variables.md), and [outputs](../templates/outputs.md). When these values are repeated through copy loops, a long name gets multiplied many times.

---
