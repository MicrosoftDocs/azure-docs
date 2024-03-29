---
title: "Quickstart: Propagate resources from an Azure Kuberentes Fleet Manager (Fleet) hub cluster to member clusters (Preview)"
description: In this quickstart, you learn how to propagate resources from an Azure Kubernetes Fleet Manager (Fleet) hub cluster to member clusters.
ms.date: 03/28/2024
author: schaffererin
ms.author: schaffererin
ms.service: kubernetes-fleet
ms.topic: quickstart
---

# Quickstart: Propagate resources from an Azure Kubernetes Fleet Manager (Fleet) hub cluster to member clusters

In this quickstart, you learn how to propagate resources from an Azure Kubernetes Fleet Manager (Fleet) hub cluster to member clusters.

## Prerequisites

* Read the [resource propagation conceptual overview](./concepts-resource-propagation.md) to understand the concepts and terminology used in this quickstart.
* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* You need a Fleet resource with a hub cluster and member clusters. If you don't have one, see [Create an Azure Kubernetes Fleet Manager resource and join member clusters using Azure CLI](quickstart-create-fleet-and-members.md).
* Member clusters must be labeled appropriately in the hub cluster to match the desired selection criteria. Example labels could include region, environment, team, availability zones, node availability, or anything else desired.
* You need access to the Kubernetes API of the hub cluster. If you don't have access, see [Access the Kubernetes API of the Fleet resource with Azure Kubernetes Fleet Manager](quickstart-access-kubernetes-api.md).
