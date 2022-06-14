---
title: Deploy vSAN Stretched Clusters
description: Learn how to deploy vSAN Stretched Clusters.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 06/13/2022
ms.custom: references_regions
---

# Deploy vSAN Stretched Clusters

In this article you will learn how to implement a vSAN Stretched Cluster for an Azure VMware Solution private cloud.

## Deploy a Stretched Cluster SDDC

Currently, Azure VMware Solution Stretched Clusters is in a limited availability phase. In this phase, you must contact Microsoft to request and qualify for support.

## Prerequisites

To request support, send an email request to avsStretchedClusterLA@microsoft.com with the following details:

- Company name
- Point of contact (email)
- Subscription
- Region requested
- Number of nodes in first stretched cluster (minimum 6, maximum 16 - in multiples of 2)
- Estimated provisioning date (this will be used for billing purposes)

When the request support details are received, quota will be reserved for a stretched cluster environment in the region requested. The subscription gets enabled to deploy a stretched cluster SDDC through the Azure portal. A confirmation email will be sent to the designated point of contact within 2 business days upon which you should be able to self-deploy a stretched cluster SDDC using the Azure portal. Select **Hosts in two availability zones** to ensure that a stretched cluster gets deployed in the region of your choice.

When the SDDC