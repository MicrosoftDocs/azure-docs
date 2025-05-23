---
title: How to migrate a cloud workload to another region
description: Learn how to migrate cloud workloads and applications to another region.
author: SomilGanguly
ms.author: ssumner
ms.date: 12/18/2023
ms.reviewer: ssumner
ms.topic: conceptual
ms.custom: internal
keywords: cloud adoption, cloud framework, cloud adoption framework
---
# Migrate a cloud workload to another region

The Migrate step of relocation is where you move the workload to the new region. Depending on your workload, you might have a few technical requirements to prepare, but the relocation strategy for the workload should be clear. You should be ready to execute the relocation.

:::image type="content" source="./media/relocate/relocate-migrate.svg" alt-text="Diagram showing the relocation process and highlights the Migrate step in the Move phase. In the relocation process, there are two phases and five steps. The first phase is the Initiate phase, and it has one step called Initiate. The second phase is the Move phase, and it has four steps that you repeat for each workload. The steps are Evaluate, Select, Migrate, and Cutover." lightbox="./media/relocate/relocate-migrate.svg" border="false":::

## Prepare

Before starting the workload relocation, you need to prepare the target region. As needed, follow these steps to prepare your workload environment before relocation. Doing so ensures you have core regional networking in place such as a regional hub and, if necessary, cross-premises connectivity.

**Establish a landing zone.** When planning your move, assess whether it expands the scope of your Azure landing zone. If expansion is necessary, consult the Azure landing zone guidance as a foundational step. This step ensures your approach aligns with established best practices. For more information, see [Add a new region to an existing Azure landing zone](/azure/cloud-adoption-framework/ready/considerations/regions#add-a-new-region-to-an-existing-landing-zone). Important considerations for setting up your new landing zone include:

- *Networking*: Evaluate the network structure, routing paths, and connectivity requirements for the landing zone in the new region.
- *Integration*: Determine if there's a need to integrate the new landing zone with the one in your source region.
- *Selective resource relocation*: Decide if all resources move to the new region. If some resources remain in the original location, plan for a sustainable cross-region network topology to manage these distributed resources effectively.

**Create new subscriptions only if needed.** Only create new subscriptions if you need to restructure the services and resources involved. Try to keep the workload in its existing subscription if possible because creating a new subscription adds complexity. Subscriptions serve as boundaries for budgets, policies, and role-based access controls (RBACs). For any new subscription, you need to validate budgets, policies, and RBACs. If you don't move all the resources in a subscription, then you need to rescope the identity and security policies to match the smaller grouping of resources. To create a new subscription, you need to create, scope, and implement the required Azure policies and RBAC roles in the target subscription. The goal is to maintain the governance and security posture.

**Configure a new domain name if needed.** When there's a change in the custom domain of the workload, you need to configure a new domain name. Create the new hostname, assign it to your application or service, and then validate the name resolution. You might also plan to lower and configure the time-to-live (TTL) and set it in the cutover stage for auto expiry. For more information, see [Add your custom domain](/azure/active-directory/fundamentals/add-custom-domain) and [Map DNS name to App Service plan](/azure/app-service/manage-custom-dns-buy-domain#prepare-the-app).

**Create new SSL/TLS certificates if needed.** You need to create new SSL/TLS certificates (X.509) for any new domain name. These certificates enable public-private key encryption and secure network communication (HTTPS). Use Azure Key Vault to create or import X.509 certificates. For more information, see [Azure Key Vault certificates](/azure/key-vault/certificates/about-certificates) and [Certificate creation methods](/azure/key-vault/certificates/create-certificate)

**Relocate Azure Key Vault.** You should relocate Azure Key Vault before moving your workload. You should have one key vault per application environment, and your key vault shouldn’t share secrets across regions to ensure confidentiality. You might need to create a new key vault in the new target region to align with this guidance.

**Create a new Log Analytics workspace.** You should have a separate Log Analytics workspace for each region. Create a new workspace in the target region. Since can't move a Log Analytics Workspace to another region, you need to create a new Log Analytics workspace in the target region. There are two options to preserve the data in the original workspace. You can keep the current workspace until you don't need the data, treating the data as read-only. You can also export the workspace data to a storage account in the new target Azure region.

## Migrate services

You can begin migrating the services in your workload. For execution, follow available guidance for the relocation automation you selected. Azure Resource Mover and Azure Site Recovery have step-by-step tutorials to follow for service relocation. For more information, see:

- [Azure Resource Mover tutorials](/azure/resource-mover/tutorial-move-region-virtual-machines)
- [Azure Site Recovery tutorials](/azure/site-recovery/azure-to-azure-how-to-enable-replication)

You can create infrastructure-as-code templates or scripts for resources you can't move. You can also execute deployments manually in the Azure portal. The specific steps you follow depend on the Azure services you use and their configuration. For more information, see [Infrastructure as code overview](/devops/deliver/what-is-infrastructure-as-code).

## Migrate data

This stage is only relevant when the workload requires data migration. Perform data migration with the chosen automation. Before the cutover to the workload in the target region, you must ensure that the related data is in sync with the source region. Data consistency is an important aspect that requires care. Here's guidance for migrating workload data.

1. *Migrate source region data.* The approach to migrating source-region data should follow the relocation method for the workload service. The hot, cold, and warm methods have different processes for managing the data in the source region.

1. *Synchronize data.* The synchronization technique depends on the architecture of the workload and the demand of the application. For example, in an on-demand sync, changes are pulled when data is accessed for the first time. Pulling and merging of changes occurs only in cases where there's a difference between last and current application access.

1. *Resolve synchronization conflicts.* Make sure the data in the source and target location are in sync and resolve any data conflicts. You only want users trying to access data that is available. For example, Azure Cosmos DB can serialize concurrent writes to ensure data consistency.

## Update connection strings

The connection string configuration depends on the service the application connects to. You can search for "connection string" on our documentation page to find the service-specific guidance and use that guidance to update the connection string. For more information, see the [Technical documentation](/docs/).

## Managed identities

System-assigned managed identities have a lifecycle bound to the Azure resource. So the relocation strategy of the Azure resource determines how the system-assigned managed identity is handled. If a new instance of the resource is created in the target, then you have to grant the new system-assigned managed identity the same permissions as the system-assigned managed identity in source region.

On the other hand, user-assigned managed identity have an independent lifecycle, and you can map the user-assigned managed identity to the new resource in the target region. For more information, see [Managed identity overview](/azure/active-directory/managed-identities-azure-resources/overview).

## Next steps

You migrated your workload services and data. Now you need to complete the relocation with a cutover.

> [!div class="nextstepaction"]
> [Cutover](./relocate-cutover.md)
	