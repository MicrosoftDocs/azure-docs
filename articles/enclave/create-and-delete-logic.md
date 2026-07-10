---
title: Understand creation and deletion
titleSuffix: Azure Enclave
description: Understand creation and deletion in Azure Enclave.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 9/30/2025
---

# Understand creation and deletion in Azure Enclave

As an administrator, you can [delete Azure Enclave resources and resource groups that hold Azure Enclave resources](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-powershell). However, similar to other special Azure resources, Azure Enclave resources have protections and conditions surrounding create and delete operations. These outlined conditions must be met before creating or deleting Azure Enclave resources.

## Create conditions

- You can't create an enclave in failed communities.
- You can't create a workload in failed enclaves.
- You can't create an enclave endpoint in failed enclaves.
- You can't create a transit hub in failed communities or use failed enclave endpoints.

## Delete conditions

Attempting to delete Azure Enclave resources while Azure Enclave resources are locked can lead to unexpected results. Some operations, which don't seem to modify a resource, require blocked actions. Locks prevent the POST method from sending data to the Azure Resource Manager (ARM) API.

- A community can't be deleted if there are enclaves in the community.
- A community can't be deleted if there are any existing transit hub in the community.
- You can't delete an enclave if the enclave contains workloads.
- You can't delete an enclave if the enclave contains enclave endpoints.
- You can't delete an enclave if the enclave contains workload resource groups that aren't empty.
- You can't delete a workload if the workload contains workload resource groups that aren't empty.
- When you delete an enclave, you also delete enclave connections or community endpoints between the community and enclave along with firewall rules.
- A workload can't be deleted in the workload resource group is locked.
- An enclave endpoint can't be deleted if there are active enclave connections using the enclave endpoint.
- community endpoints can't be deleted if there are active enclave connections using the community endpoint.
- Transit hubs can't be deleted if there are associated community endpoints.
