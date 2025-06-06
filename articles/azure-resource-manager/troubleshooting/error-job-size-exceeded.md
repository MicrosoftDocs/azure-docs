---
title: Job size exceeded error
description: Describes how to troubleshoot errors for job size exceeded or if the template is too large for deployments using a Bicep file or Azure Resource Manager template (ARM template).
ms.topic: troubleshooting
ms.custom: devx-track-bicep, devx-track-arm-template
ms.date: 04/28/2025
---

# Resolve errors for job size exceeded

This article describes how to resolve the `JobSizeExceededException` and `DeploymentJobSizeExceededException` errors. The job size exceeded errors can occur when you deploy a Bicep file or Azure Resource Manager template (ARM template).

## Symptom

When deploying a template, you receive an error stating the deployment has exceeded limits.

## Cause

This error occurs when the deployment exceeds the allowed size limits. It usually appears when the template or the deployment job is too large. Note that templates are compressed before their sizes are verified for deployment, so the effective limits may be larger than the template's actual size.

The deployment job size limit is 1 MB after compression, including metadata about the request. For large templates, the combined size of metadata and the template may surpass this limit.

The compressed template size itself can’t exceed 4 MB, and each individual resource definition can’t exceed 1 MB after compression. These limits apply to the template's final state after expansion for any resource definitions that use loops to create multiple instances, which includes resolved values for all variables and parameters.

Other template limits are:

- 256 parameters
- 256 variables
- 800 resources (including copy count)
- 64 output values
- 24,576 characters in a template expression

## Solution 1: Reduce name size

# [Bicep](#tab/bicep)

Try to shorten the length of the names you use for [parameters](../bicep/parameters.md), [variables](../bicep/variables.md), and [outputs](../bicep/outputs.md). When these values are repeated in loops, a long name gets multiplied many times.

# [JSON](#tab/json)

Try to shorten the length of the names you use for [parameters](../templates/parameters.md), [variables](../templates/variables.md), and [outputs](../templates/outputs.md). When these values are repeated through copy loops, a long name gets multiplied many times.

---

## Solution 2: Simplify template

# [Bicep](#tab/bicep)

When your file deploys lots of different resource types, consider dividing it into [modules](../bicep/modules.md). Divide your resource types into logical groups and add a module for each group. For example, if you need to deploy lots of networking resources, you can move those resources to a module.

You can set other resources as implicit dependencies, and [get values from the output of modules](../bicep/outputs.md#outputs-from-modules).

Use [template specs](../bicep/template-specs.md) rather than [Bicep modules](../bicep/modules.md). Bicep modules are converted into a single ARM template with nested templates.

# [JSON](#tab/json)

When your template deploys lots of different resource types, consider dividing it into [linked templates](../templates/linked-templates.md). Divide your resource types into logical groups and add a linked template for each group. For example, if you need to deploy lots of networking resources, you can move those resources to a linked template.

You can set other resources as dependent on the linked template, and [get values from the output of the linked template](../templates/linked-templates.md#get-values-from-linked-template).

Use [template specs](../templates/linked-templates.md#template-specs) rather than [nested templates](../templates/linked-templates.md#nested-template).

---

## Solution 3: Use dependencies carefully

# [Bicep](#tab/bicep)

Use an [implicit dependency](../bicep/resource-dependencies.md#implicit-dependency) that's created when a resource references another resource by its symbolic name. For most deployments, it's not necessary to use `dependsOn` and create an [explicit dependency](../bicep/resource-dependencies.md#explicit-dependency).

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

Complex dependencies can quickly consume the data limits. For example, if a loop of *n* resources depends on another loop of *n* resources, it results in storing *O(n²)* data. By contrast, if each resource in one loop only depends on its counterpart in the other loop, it results in *O(n)* data. This difference may seem subtle, but the storage impact grows very quickly.

## Solution 4: Reduce incompressible data

Including large amounts of incompressible data, such as certificates or binaries, or data with a low compression ratio in a template or parameters will quickly consume the size limit.
