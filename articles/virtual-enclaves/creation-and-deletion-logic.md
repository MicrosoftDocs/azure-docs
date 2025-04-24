---
title: Understanding Creation and Deletion in AVE
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

1. An Enclave can't be created in failed Communities
2. A Workload can't be created in failed Enclaves
3. An Enclave endpoint can't be created in failed Enclaves
4. A Catalog can't be created in failed Enclaves
5. A Transit hub can't be created in failed Communities or using failed Enclave endpoints
6. An Enclave connection can't be created in failed Enclaves or using failed Enclave endpoints 

## Delete conditions

Attempting to delete AVE resources while AVE resources are locked can lead to unexpected results. Some operations, which don't seem to modify a resource, require blocked actions. Locks prevent the POST method from sending data to the Azure Resource Manager (ARM) API.

1. A Community can't be deleted if there are Enclaves in the Community
2. A Community can't be deleted if there are any existing Transit Hubs in the Community
3. An Enclave can't be deleted if there are Workloads in the Enclave
4. An Enclave can't be deleted if there are Enclave Endpoints in the Enclave
5. An Enclave can't be deleted if there are Catalogs in the Enclave
6. When an Enclave is deleted, Enclave Connections or Community Endpoints between Community and Enclave are also deleted along with Firewall rules
7. A Workload can't be deleted in the Workload Resource group is locked
8. An Enclave endpoint can't be deleted if there are active Enclave connections using the Enclave endpoint
9. Community endpoints can't be deleted if there are active Enclave connections using the Community endpoint
10. Transit hubs can't be deleted if there are associated community endpoints
