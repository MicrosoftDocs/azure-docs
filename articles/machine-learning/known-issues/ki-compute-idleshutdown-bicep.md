---
title: Known issue - Compute |  Idleshutdown property in Bicep template causes error
description: Describe the known issue to provide for search optimization
author: s-polly
ms.author: scottpolly
ms.topic: troubleshooting  
ms.service: machine-learning
ms.subservice: core
ms.date: 08/04/2023
ms.custom: known-issue
---

# Known issue  - Compute | Idleshutdown property in bicep template causes error

When creating an Azure Machine Learning compute instance through Bicep, using the `idleTimeBeforeShutdown` property as described in the API reference [Microsoft.MachineLearningServices workspaces/computes API reference](/azure/templates/microsoft.machinelearningservices/workspaces/computes?pivots=deployment-language-bicep) results in an error.

 

[!INCLUDE [dev v2](../includes/machine-learning-dev-v2.md)]


**Status:** Open


**Problem area:** Compute

**Symptoms**

When creating an Azure Machine Learning compute instance through Bicep, using the `idleTimeBeforeShutdown` property as described in the API reference [Microsoft.MachineLearningServices workspaces/computes API reference](/azure/templates/microsoft.machinelearningservices/workspaces/computes?pivots=deployment-language-bicep) results in an error.



## Solutions and workarounds


 You can suppress warnings with the `#disable-next-line` directive by entering `#disable-next-line BCP037` in the template above the line with the warning: 

:::image type="content" source="media/ki-compute-idelshutdown-bicep/disable-next-line.png" alt-text="image depicting the use of the #disable-next-line directive":::

## Next steps

- [About known issues](azureml-known-issues.md)
