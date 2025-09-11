---
title: Understand creation and deletion in Azure Virtual Enclaves
titleSuffix: Azure Virtual Enclaves
description: Understand creation and deletion in Azure Virtual Enclaves.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 04/08/2025
---

# Understand creation and deletion in Azure Virtual Enclaves

As an administrator, you can [delete Azure Virtual Enclave (AVE) resources and resource groups that hold AVE resources](/azure/azure-resource-manager/management/delete-resource-group.md?tabs=azure-powershell). However, similar to other special Azure resources, AVE resources have protections and conditions surrounding create and delete operations. These outlined conditions must be met before creating or deleting AVE resources.

## Create conditions

- An Enclave can't be created in failed communities.
- A workload can't be created in failed Enclaves.
- An enclave endpoint can't be created in failed Enclaves.
- A Catalog can't be created in failed Enclaves.
- A Transit hub can't be created in failed communities or using failed Enclave endpoints.
- An enclave  can't be created in failed Enclaves or using failed Enclave endpoints.

## Delete conditions

Attempting to delete AVE resources while AVE resources are locked can lead to unexpected results. Some operations, which don't seem to modify a resource, require blocked actions. Locks prevent the POST method from sending data to the Azure Resource Manager (ARM) API.

- A community can't be deleted if there are enclaves in the community.
- A community can't be deleted if there are any existing transit hub in the community.
- An Enclave can't be deleted if there are workloads in the Enclave.
- An Enclave can't be deleted if there are enclave endpoints in the Enclave.
- An Enclave can't be deleted if there are Catalogs in the Enclave.
- When an Enclave is deleted, enclave connections or community endpoint between community and Enclave are also deleted along with Firewall rules.
- A workload can't be deleted in the workload resource group is locked.
- An enclave endpoint can't be deleted if there are active enclave connections using the enclave endpoint.
- community endpoints can't be deleted if there are active enclave connections using the community endpoint.
- Transit hubs can't be deleted if there are associated community endpoints.
