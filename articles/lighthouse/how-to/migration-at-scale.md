---
title: Manage Azure Migrate projects at scale
description: Learn how to effectively use Azure Migrate on delegated customer resources.
ms.date: 01/29/2021
ms.topic: how-to
---

# Manage Azure Migrate projects at scale with Azure Lighthouse

This topic provides an overview of how [Azure Lighthouse](../overview.md) can help you use [Azure Migrate](../../migrate/migrate-services-overview.md) in a scalable way across multiple Azure Active Directory (Azure AD) tenants.

Azure Lighthouse allows service providers to perform operations at scale across several tenants at once, making management tasks more efficient.

Azure Migrate provides a centralized hub to assess and migrate to Azure on-premises servers, infrastructure, applications, and data. Typically, partners who performing assessments and migration at scale for multiple customers must access each customer subscription individually by using the [CSP (Cloud Solution Provider) subscription model](/partner-center/customers-revoke-admin-privileges) or by [creating a guest user in the customer tenant](../../active-directory/external-identities/what-is-b2b.md).

Azure Lighthouse integration with Azure Migrate lets service providers discover, assess, and migrate workloads for different customers at scale, while allowing customers to have full visibility and control of their environments. Through Azure delegated resource management, service providers have a single view of all of the Azure Migrate projects they manage across multiple customer tenants.

> [!NOTE]
> Via Azure Lighthouse, partners can perform discovery, assessment and migration for on-premises VMware VMs, Hyper-V VMs, physical servers and AWS/GCP instances. There are two options for [VMware VM migration](../../migrate/server-migrate-overview.md). Currently, only the agent-based method of migration can be used when working on a migration project in a delegated customer subscription; migration using agentless replication is not currently supported through delegated access to the customer's scope.

> [!TIP]
> Though we refer to service providers and customers in this topic, this guidance also applies to [enterprises using Azure Lighthouse to manage multiple tenants](../concepts/enterprise.md).

Depending on your scenario, you may wish to create the Azure Migrate in the customer tenant or in your managing tenant. Review the considerations below and determine which model best fits your customer's migration needs.

## Create an Azure Migrate project in the customer tenant

One option when using Azure Lighthouse is to create the Azure Migrate project in the customer tenant. Users in the managing tenant can then select the customer subscription when creating a migration project. From the managing tenant, the service provider can perform the necessary migration operations. This may include deploying the Azure Migrate appliance to discover the workloads, assessing workloads by grouping VMs and calculating cloud-related costs, reviewing VM readiness, and performing the migration.

In this scenario, no resources will be created and stored in the managing tenant, even though the discovery and assessment steps can be initiated and executed from that tenant. All of the resources, such as migration projects, assessment reports for on-prem workloads, and migrated resources at the target destination, will be deployed in the customer subscription. However, the service provider can access all customer projects from their own tenant and portal experience.

This approach minimizes context switching for service providers working across multiple customers, while letting customers keep all of their resources in their own tenants.

The workflow for this model will be similar to the following:

1. The customer is [onboarded to Azure Lighthouse](onboard-customer.md). The Contributor built-in role is required for the identity that will be used with Azure Migrate. See the [delegated-resource-management-azmigrate](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/delegated-resource-management-azmigrate) sample template for an example using this role.
1. The designated user signs into the managing tenant in the Azure portal, then goes to Azure Migrate. This user [creates an Azure Migrate project](../../migrate/create-manage-projects.md), selecting the appropriate delegated customer subscription.
1. The user then [performs steps for discovery and assessment](../../migrate/tutorial-discover-vmware.md).

   For VMware VMs, before you configure the appliance, you can limit discovery to vCenter Server datacenters, clusters, a folder of clusters, hosts, a folder of hosts, or individual VMs. To set the scope, assign permissions on the account that the appliance uses to access the vCenter Server. This is useful if multiple customers' VMs are hosted on the hypervisor. You can't limit the discovery scope of Hyper-V.

    > [!NOTE]
    > You can discover and assess VMware virtual machines for migration using Azure Migrate through the delegated access provided by Azure Lighthouse. For migration of VMware virtual machines, only the agent-based method is currently supported when working on a migration project in a delegated customer subscription.

1. When the target customer subscription is ready, proceed with the migration through the access granted by Azure Lighthouse. The migration project containing assessment results and migrated resources will be created in the customer tenant under the target subscription.

> [!TIP]
> Prior to migration, a landing zone will need to be deployed to provision the foundation infrastructure resources and prepare the subscription to which virtual machines will be migrated. To access or create some resources in this landing zone, the Owner built-in role may be required, which is not currently supported in Azure Lighthouse. For such scenarios, the customer may need to provide guest access role or delegate admin access via the CSP subscription model. For an approach to creating multi-tenant landing zones, see the [Multi-tenant-Landing-Zones demo solution](https://github.com/Azure/Multi-tenant-Landing-Zones) on GitHub.

## Create an Azure Migrate project in the managing tenant

In this scenario, migration-related operations such as discovery and assessment are still performed by users in the managing tenant. However, the migration project and all of the relevant resources will reside in the partner tenant, and the customer will not have direct visibility into the project (though assessments can be shared with customers if desired). The migration destination for each customer will be the customer's subscription.

This approach enables services providers to start migration discovery and assessment projects quickly, abstracting those initial steps from customer subscriptions and tenants.

The workflow for this model will be similar to the following:

1. The customer is [onboarded to Azure Lighthouse](onboard-customer.md). The Contributor built-in role is required for the identity that will be used with Azure Migrate. See the [delegated-resource-management-azmigrate](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/delegated-resource-management-azmigrate) sample template for an example using this role.
1. The designated user signs into the managing tenant in the Azure portal, then goes to Azure Migrate. This user [creates an Azure Migrate project](../../migrate/create-manage-projects.md) in a subscription belonging to the managing tenant.
1. The user then [performs steps for discovery and assessment](../../migrate/tutorial-discover-vmware.md). The on-premises VMs will be discovered and assessed within the migration project created in the managing tenant, then migrated from there.

   If you are managing multiple customers in the same Hyper-V host, you can discover all workloads at once. Customer-specific VMs can be selected in the same group, then an assessment can be created, and migration can be performed by selecting the appropriate customer's subscription as the target destination. There is no need to limit the discovery scope, and you can maintain a  full overview of all customer workloads in one migration project.

1. When ready, proceed with the migration by selecting the delegated customer subscription as the target destination for replicating and migrating the workloads. The newly created resources will exist in the customer subscription, while the assessment data and resources pertaining to the migration project will remain in the managing tenant.

NOTE: You must modify the parameter file to reflect your environment before deploying
https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/delegated-resource-management-azmigrate

## Partner recognition for customer migrations

As a member of the [Microsoft Partner Network](https://partner.microsoft.com), you can link your partner ID with the credentials used to manage delegated customer resources. This allows Microsoft to attribute influence and Azure consumed revenue to your organization based on the tasks you perform for customers, including migration projects.

For more information, see [Link your partner ID to track your impact on delegated resources](partner-earned-credit.md).

## Next steps

- Learn more about [Azure Migrate](../../migrate/migrate-services-overview.md).
- Learn about other [cross-tenant management experiences](../concepts/cross-tenant-management-experience.md) supported by Azure Lighthouse.
