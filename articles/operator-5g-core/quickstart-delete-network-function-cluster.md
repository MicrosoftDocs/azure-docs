---
title: Delete a network function deployment and/or ClusterServices in Azure Operator 5G Core
description: Learn the high-level process to delete a network function deployment and/or ClusterServices.
author: HollyCl
ms.author: HollyCl
ms.service: azure
ms.topic: quickstart #required; leave this attribute/value as-is
ms.date: 01/30/2024


#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.

This template provides the basic structure of a Quickstart - General article pattern. See the [instructions - Quickstart - General](../level4/article-quickstart.md) in the pattern library.

You can provide feedback about this template at: https://aka.ms/patterns-feedback

Quickstart is an article pattern that shows how a product or service solves a customer problem. These articles focus on what the product or service "can do" rather than "how to use" it. The goal is to help new customers evaluate whether the product or service will meet their needs.

-->

<!-- 1. H1 -----------------------------------------------------------------------------

Required: Use a "Quickstart: <verb> * <capability> * <product or service> * <scenario>" format for you H1. Pick an H1 that clearly conveys the product capability that's covered and how the capability will be demonstrated.

For example: "Quickstart: Demonstrate the incident response capabilities of Microsoft 365 Defender by simulating an attack".

* Include only a single H1 in the article.
* If the Quickstart is part of a numbered series, don't include the number in the H1.
* Don't start with a gerund.
* Don't add "Quickstart:" to the H1 of any article that's not a Quickstart.
* Don't include "Tutorial" in the H1.

-->

# Quickstart: Delete a network function deployment or ClusterServices in Azure Operator 5G Core

Use the following ArmClient commands to delete the AO5GC resources:
```
ARMClient.exe DELETE 
/subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/amfDeployments/${ResourceName}?api-version=2023-10-15-preview -verbose
```
```
ARMClient.exe DELETE 
/subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/smfDeployments/${ResourceName}?api-version=2023-10-15-preview -verbose
```
```
ARMClient.exe DELETE 
/subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/nrfDeployments/${ResourceName}?api-version=2023-10-15-preview -verbose
```
```
ARMClient.exe DELETE 
/subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/upfDeployments/${ResourceName}?api-version=2023-10-15-preview -verbose
```
```
ARMClient.exe DELETE 
/subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/nssfDeployments/${ResourceName}?api-version=2023-10-15-preview -verbose
```
```
ARMClient.exe DELETE 
/subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/clusterServices/${ResourceName}?api-version=2023-10-15-preview -verbose
```

## Related content

- [Update an existing deployment of Azure Operator 5G Core](how-to-update-existing-deployment.md)

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.
-->
