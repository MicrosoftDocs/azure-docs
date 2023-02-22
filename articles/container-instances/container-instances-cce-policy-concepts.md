---
title: Confidential containers Azure Confidential Container Instances
description: Learn more about confidential container groups. 
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.date: 02/28/2023
ms.custom: "seodec18, mvc"
---

# Confidential containers on Azure Contain Instances

This article introduces how confidential containers on Azure Container Instances can enable you to secure your workloads running in the cloud. This article will contain a detailed explanation of the  technical features that support confidential containers on Azure Container Instances. 

## Confidential workloads in the cloud

To discuss what is required to run confidential workloads in a cloud environment like Azure, we first need to discuss what is required to run confidential workloads in an environment that you fully control. From that basis, we can build an understanding of the various attributes any confidential solution must provide.

### Isolation and Trust

**Isolation** is a key concept when talking about confidential computing. It is important to ensure that a computational environment is isolated such that is isn't observable or can't be tampered with by external parties.
