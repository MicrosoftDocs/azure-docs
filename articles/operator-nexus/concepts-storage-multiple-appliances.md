---
title: Azure Operator Nexus multiple storage appliances
description: Lean about Azure Operator Nexus support for multiple storage appliances.
author: pjw711
ms.author: speterwhiting
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 03/12/2025
ms.custom: template-concept
---

# Azure Operator Nexus multiple storage appliances

The storage appliance in Azure Operator Nexus provides highly available, persistent storage to containerized and virtualized workloads. Azure Operator Nexus hardware is organised into compute racks and an aggregator rack. The aggregator rack contains space for two storage appliances. Azure Operator Nexus instances always require one storage appliance; the second storage appliance is optional.

Customers can choose to deploy a second storage appliance when their workloads require more capacity than a single storage appliance can provide.

## Hardware pre-requisites

Azure Operator Nexus only supports a second storage appliance for instances that meet the following conditions:

- The instance is deployed with hardware that matches the 2.0.x or later bills of material (BOMs).
- All Pure storage appliances have R4 controllers.

The Azure Operator Nexus SKUs that support a second storage appliance are documented in the [supported SKUs documentation](/reference-operator-nexus-skus.md).

The storage appliances do not have to have the same capacity configurations. All supported capacity configurations are listed in [this document](/reference-near-edge-storage.md)

## Supported deployment models

Azure Operator Nexus only supports deploying a second storage storage appliance at initial Nexus instance install time. There is no support for adding a second storage appliance to an existing Nexus instance. Any existing instance that requires a second storage appliance must be reinstalled.

The deployment process for instances with one or two storage appliances is available in the [how-to documentation](./howto-azure-operator-nexus-prerequisites.md).



```yml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: testPvc
  namespace: default
  annotations:
    storageApplianceName: exampleStorageAppliance
```