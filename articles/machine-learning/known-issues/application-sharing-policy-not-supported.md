---
title: Known issue - Application Sharing Policy isn't supported 
titleSuffix: Azure Machine Learning
description: Configuring the applicationSharingPolicy property for a compute instance has no effect
author: s-polly
ms.author: scottpolly
ms.topic: troubleshooting  
ms.service: machine-learning
ms.subservice: core
ms.date: 08/14/2023
ms.custom: known-issue
---

# Known issue  - The ApplicationSharingPolicy property isn't supported for compute instances

[!INCLUDE [dev v2](../includes/machine-learning-dev-v2.md)]

Configuring the `applicationSharingPolicy` property for a compute instance has no effect as that property isn't supported

 
**Status:** Open

**Problem area:** Compute


## Symptoms

When creating a compute instance, the documentation lists an `applicationSharingPolicy` property with the options of: 

- Personal only the creator can access applications on this compute instance.
- Shared, any workspace user can access applications on this instance depending on their assigned role.

Neither of these configurations have any effect on the compute instance.

## Solutions and workarounds

There's no workaround as this property isn't supported. The documentation will be updated to remove reference to this property.
 
## Next steps

- [About known issues](azure-machine-learning-known-issues.md)
