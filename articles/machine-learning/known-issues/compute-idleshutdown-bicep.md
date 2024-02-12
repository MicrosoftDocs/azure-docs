---
title: Known issue - Compute |  Idleshutdown property in Bicep template causes error
titleSuffix: Azure Machine Learning
description: When creating an Azure Machine Learning compute instance through Bicep compiled using MSBuild NuGet, using the `idleTimeBeforeShutdown` property as described in the API reference results in an error.
author: s-polly
ms.author: scottpolly
ms.topic: troubleshooting  
ms.service: machine-learning
ms.subservice: core
ms.date: 08/04/2023
ms.custom: known-issue, devx-track-bicep
---

# Known issue  - Idleshutdown property in Bicep template causes error

[!INCLUDE [dev v2](../includes/machine-learning-dev-v2.md)]

When creating an Azure Machine Learning compute instance through Bicep compiled using [MSBuild/NuGet](../../azure-resource-manager/bicep/msbuild-bicep-file.md), using the `idleTimeBeforeShutdown` property as described in the API reference [Microsoft.MachineLearningServices workspaces/computes API reference](/azure/templates/microsoft.machinelearningservices/workspaces/computes?pivots=deployment-language-bicep) results in an error.

 

**Status:** Open


**Problem area:** Compute

## Symptoms

When creating an Azure Machine Learning compute instance through Bicep compiled using [msbuild/nuget](../../azure-resource-manager/bicep/msbuild-bicep-file.md), using the `idleTimeBeforeShutdown` property as described in the API reference [Microsoft.MachineLearningServices workspaces/computes API reference](/azure/templates/microsoft.machinelearningservices/workspaces/computes?pivots=deployment-language-bicep) results in an error.


## Solutions and workarounds

To allow the property to be set, you can suppress warnings with the `#disable-next-line` directive. Enter `#disable-next-line BCP037` in the template above the line with the warning: 

:::image type="content" source="media/compute-idleshutdown-bicep/disable-next-line.png" alt-text="Screenshot depicting the use of the #disable-next-line directive.":::

## Next steps

- [About known issues](azure-machine-learning-known-issues.md)
