---
title: Deploy Admin VM from the Service Catalog into a Workload
description: Deploy Admin VM from the Service Catalog into a Workload.
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: how-to
ms.date: 04/08/2025
---

# Deploy Admin VM from the Service Catalog into a Workload
The Admin VM template allows customers to install an application they want to publish to one or more users without installing that application on each users' desktop.

In this article, you:

- Deploy a Service Catalog template for a Admin VM into an existing Workload from the Portal.

> [!NOTE]
> 
> This sample deployment is just for demonstration purposes and doesn't represent all the best practices for network, systems, or applications administration.

## Deploy Options
The Admin VM template can be deployed in multiple configurations:
1. Virtual Machine (~10 min)
2. Virtual Machine domain-joined (~12 min)
3. Virtual Machine domain-joined and published as a Remote App (~20 min)
4. (future) Virtual Machine domain-joined and published as a Remote Desktop (~20 min)

## Before you begin
- This quickstart assumes a basic understanding of networking and Azure Virtual Enclaves concepts. For more information, see [Concepts and best practices of Azure Virtual Enclaves](./best-practices.md).

- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/).

- A [deployed Community](./what-community.md), [deployed Virtual Enclave](./what-enclave.md), and [deployed Workload](./what-workload.md) and permissions to create resources inside the workload.

## Prerequisites
Required:

1. An existing subnet. 
    - The default enclave subnet intended for resources can be used (ex: `AzureVirtualEnclaveSubnet`).
2. (optional) An existing domain to join if the Admin VM will be domain joined.
3. A `Key Vault` with `Customer Mananged Key (CMK)`, `User Managed Identity`, and `Disk Encryption Set`. You can create these using the [Common Dependencies Service Catalog template](./deploy-common-dependencies-service-catalog.md).
    - [Disk encryption options](https://learn.microsoft.com/azure/virtual-machines/disk-encryption-overview)
    - [How to create a user assigned managed identity](https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp)
    - [Manage User Assigned Identity](https://learn.microsoft.com/azure/operator-service-manager/how-to-create-user-assigned-managed-identity)
    - Create an Access Policy in the Key Vault for this identity with the following Key Permissions: `Unwrap Key, Wrap Key, Recover, Get`

## Deploy the template
1. Navigate to the workload for the intended deployment.
2. Select `+Add an Azure Service` button.
3. Select the `Admin VM` service template from the [Service Catalog](./what-service-catalog.md) of templates (the dropdown list).

![Screenshot showing the Service Catalog Admin VM selected from the list.](./media/service-catalog-list-admin-vm.png)

4. Enter all the required parameters on each of the tabs.
5. For `OS Disk Encryption Name` and `OS Disk Encryption Resource Group Name`, enter the names used in the prerequisites section.
6. Adjust the prepopulated parameters as needed. 
7. Select `Review + Create`, if all validations have passed, select `Create`

## Validate the deployment
Go to the specified Resource Group to confirm the intended resources were created. Including: VM, OS Disk, NIC.

## Connect to the Application VM
Via the [Admin VM](./understanding-admin-vm.md):
The Admin VM is used for administrator access the resources within the enclave boundary from outside the boundary. The Admin VM might also be called a "jumpbox".
1. Sign in to a desktop session on the [Admin VM](./understanding-admin-vm.md).
2. From the start menu, type `RDP`, and open the RDP window
3. Enter the Remote App VM IP address as the destination IP address for the RDP connection.
4. Enter Remote App VM credentials and select `Accept/Yes` to warnings about a new connection.
5. From the Remote App VM desktop, validate any VM settings set during the deployment or complete any custom configuration.
6. Assign a security group assignment to give users access to your RemoteApp(s).

Otherwise, start using the Remote App Virtual Machine

## Delete the deployment
If you don't plan on keeping these resources, clean up unnecessary resources to avoid Azure charges. If no other deployments exist in the Resource Group, the whole Resource Group can be deleted.

## Recommendations
- Session host or VM [Sizing](https://learn.microsoft.com/windows-server/remote/remote-desktop-services/virtual-machine-recs)
- [Add tags](../azure-resource-manager/management/tag-resources.md) to Service Catalog deployments to track important information for that resource such as:
  - Owner: `<main POC>`
  - Deployer: `<yourName>`
  - Purpose: `<publish abc app to users>`
  - Service Catalog Name: `<RemoteApp>`
  - Service Catalog Version: `<version you deployed>`
- Consider adding an [Azure Policy to enforce and inherit tags](../azure-resource-manager/management/tag-policies.md)
- [Collect Custom Logs](https://learn.microsoft.com/azure/azure-monitor/agents/data-sources-custom-logs) from applications
