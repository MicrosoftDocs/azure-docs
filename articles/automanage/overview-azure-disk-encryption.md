---
title: Azure disk encryption
description: Learn about Azure disk encryption on Azure Automanaged enabled virtual machines.
author: mmccrory
ms.service: automanage
ms.workload: infrastructure
ms.topic: overview
ms.date: 9/07/2022
ms.author: memccror
ms.custom: references_regions
---

# Automanage and Azure Disk Encryption

Automanage is compatible with VMs that have Azure Disk Encryption (ADE) enabled.

## Azure Backup

If you are using the Production environment, you will also be onboarded to Azure Backup. There is one prerequisite to successfully using ADE and Azure Backup:
* Before you onboard your ADE-enabled VM to Automanage's Production environment, ensure that you have followed the steps located in the **Before you start** section of [this document](../backup/backup-azure-vms-encryption.md#before-you-start).

## Next steps

In this article, you learned that Automanage for machines provides a means for which you can eliminate the need for you to know of, onboard to, and configure best practices Azure services. In addition, if a machine you onboarded to Automanage for virtual machines drifts from the configuration profile, we will automatically bring it back into compliance.

Try enabling Automanage for Azure virtual machines or Arc-enabled servers in the Azure portal.

> [!div class="nextstepaction"]
> [Enable Automanage for virtual machines in the Azure portal](quick-create-virtual-machines-portal.md)