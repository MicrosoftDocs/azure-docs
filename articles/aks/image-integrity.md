---
title: Build, sign, and verify images using Notation in Azure Kubernetes Service (AKS)
description: Learn how to build, sign, and verify images using Notation in AKS.
author: schaffererin
ms.author: schaffererin
ms.service: azure-kubernetes-service
ms.topic: article
ms.date: 02/16/2023
---

# Build, sign, and verify images using Notation in Azure Kubernetes Service (AKS) (Preview)

Intro

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

## Prerequisites


## Limitations


## User flow

1. Store the signing certificate in AKV.
2. Build and sign image with Notation.
3. Create AKS cluster.
4. Assign the Image Integrity policy initiative.
5. Create identity with AKV and ACR permissions.
6. Create federated credential to bind with the Ratify add-on service account.
7. Dispatch Ratify Verify Config through CRDs.
8. Deploy application on AKS cluster.
9. If image wasn't signed with a trusted cert, the policy will show non-compliant.


## Next steps

