---
title: Binary drift protection (preview)
description: Learn how to detect runtime threat situations where there's a between the workload that came from the image, and the workload that is running in the container.
ms.topic: how-to
author: dcurwin
ms.author: dacurwin
ms.date: 06/17/2024
---

# Binary drift protection (preview)

A binary drift happens when a container is running an executable that didn’t come from the original image. This situation can either be intentional and legitimate, or it can indicate an attack.

Container images should be immutable. Any processes launched from binaries not included in the original image should be evaluated as suspicious activity.

Binary drift detection is a feature that alerts you when there's a difference between the workload that came from the image, and the workload running in the container.

## Onboarding

The feature is available on the Azure (AKS), Amazon (EKS), and Google (GKE) clouds. 




## Policy configuration




## Enhanced sensor capabilities



## New alerts



## Related resources