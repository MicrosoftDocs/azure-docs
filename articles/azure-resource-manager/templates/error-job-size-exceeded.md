---
title: Job size exceeded error
description: Describes how to troubleshoot errors when job size or template are too large.
ms.topic: troubleshooting
ms.date: 10/07/2020
---
# Resolve errors for job size exceeded

This article describes how to resolve the **JobSizeExceededException** and **DeploymentSizeExceededException** errors.

## Symptom

When deploying a template, you receive an error stating the deployment has exceeded limits.

## Cause

You can get this error when the size of your template exceeds 4 MB. The 4-MB limit applies to the final state of the template after it has been expanded for resource definitions that use [copy](copy-resources.md) to create many instances. The final state also includes the resolved values for variables and parameters.

The deployment job also includes metadata about the request. For large templates, the metadata combined with the template can exceed the allowed size for a job.

Other limits for the template are:

* 256 parameters
* 256 variables
* 800 resources (including copy count)
* 64 output values
* 24,576 characters in a template expression

## Solution 1 - Simplify template

Your first option is to simplify the template. This option works when your template deploys lots of different resource types. Consider dividing the template into [linked templates](linked-templates.md). Divide your resource types into logical groups and add a linked template for each group. For example, if you need to deploy lots of networking resources, you can move those resources to a linked template.

You can set other resources as dependent on the linked template, and [get values from the output of the linked template](linked-templates.md#get-values-from-linked-template).

## Solution 2 - Reduce name size

Try to shorten the length of the names you use for [parameters](template-parameters.md), [variables](template-variables.md), and [outputs](template-outputs.md). When these values are repeated through copy loops, a large name gets multiplied many times.

## Solution 3 - Use serial copy

Your second option is to change your copy loop from [parallel to serial processing](copy-resources.md#serial-or-parallel). Use this option only when you suspect the error comes from deploying a large number of resources through copy. This change can significantly increase your deployment time because the resources aren't deployed in parallel.
