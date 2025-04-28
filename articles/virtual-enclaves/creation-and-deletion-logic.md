---
title: Understanding Creation and Deletion in AVE
titleSuffix: Azure Virtual Enclaves
description: Understanding Creation and Deletion in AVE.
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# Understanding Create/Delete in AVE

As an administrator, you can [delete Azure Virtual Enclave (AVE) resources and resource groups that hold AVE resources](../azure-resource-manager/management/delete-resource-group.md?tabs=azure-powershell). However, similar to other special Azure resources, AVE resources have protections and conditions surrounding create and delete operations. These outlined conditions must be met before creating or deleting AVE resources.

## Create conditions

- An Enclave can't be created in failed Communities.
- A Workload can't be created in failed Enclaves.
- An Enclave endpoint can't be created in failed Enclaves.
- A Catalog can't be created in failed Enclaves.
- A Transit hub can't be created in failed Communities or using failed Enclave endpoints.
- An Enclave connection can't be created in failed Enclaves or using failed Enclave endpoints.

## Delete conditions

Attempting to delete AVE resources while AVE resources are locked can lead to unexpected results. Some operations, which don't seem to modify a resource, require blocked actions. Locks prevent the POST method from sending data to the Azure Resource Manager (ARM) API.

- A Community can't be deleted if there are Enclaves in the Community.
- A Community can't be deleted if there are any existing Transit Hubs in the Community.
- An Enclave can't be deleted if there are Workloads in the Enclave.
- An Enclave can't be deleted if there are Enclave Endpoints in the Enclave.
- An Enclave can't be deleted if there are Catalogs in the Enclave.
- When an Enclave is deleted, Enclave Connections or Community Endpoints between Community and Enclave are also deleted along with Firewall rules.
- A Workload can't be deleted in the Workload Resource group is locked.
- An Enclave endpoint can't be deleted if there are active Enclave connections using the Enclave endpoint.
- Community endpoints can't be deleted if there are active Enclave connections using the Community endpoint.
- Transit hubs can't be deleted if there are associated community endpoints.
