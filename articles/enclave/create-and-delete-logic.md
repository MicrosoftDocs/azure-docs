---
title: Understand creation and deletion
titleSuffix: Azure Enclave
description: Learn the conditions that must be met before you can create or delete Azure Enclave resources, including dependency and lock requirements.
author: jadean-msft
ms.author: jadean
ms.topic: concept
ms.date: 06/29/2026
---

# Understand creation and deletion in Azure Enclave

As an administrator, you can [delete Azure Enclave resources and resource groups that hold Azure Enclave resources](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-powershell). However, similar to other special Azure resources, Azure Enclave resources have protections and conditions surrounding create and delete operations. These outlined conditions must be met before creating or deleting Azure Enclave resources.

## Create conditions

- You can't create an enclave in failed communities.
- You can't create a workload in failed enclaves.
- You can't create an enclave endpoint in failed enclaves.
- You can't create a service catalog in failed enclaves.
- You can't create a transit hub in failed communities or use failed enclave endpoints.
- You can't create an enclave connection in failed enclaves or using failed enclave endpoints.

## Delete conditions

Azure Enclave resources have dependency requirements that must be met before deletion. You must remove dependent child resources before deleting a parent resource. Additionally, if a resource group is locked, delete operations will fail even for resources that appear unmodified.

- A community can't be deleted if there are enclaves in the community.
- A community can't be deleted if there are any existing transit hubs in the community.
- You can't delete an enclave if the enclave contains workloads.
- You can't delete an enclave if the enclave contains enclave endpoints.
- You can't delete an enclave if the enclave contains service catalogs.
- You can't delete an enclave if the enclave contains workload resource groups that aren't empty.
- You can't delete a workload if the workload contains workload resource groups that aren't empty.
- When you delete an enclave, enclave connections associated with the enclave are also deleted, along with their associated Azure Firewall network rules. The enclave managed resource group and all platform-managed resources within it are also deleted.
- A workload can't be deleted if the workload resource group is locked.
- An enclave endpoint can't be deleted if there are active enclave connections using the enclave endpoint.
- A community endpoint can't be deleted if there are active enclave connections using it.
- Transit hubs can't be deleted if there are associated community endpoints.
