---
title: Set up VMware replication to Azure in multi-tenancy environment using Site Recovery and the Cloud Solution Provider (CSP) program | Microsoft Docs
description: Describes how to create and manage tenant subscriptions through CSP and deploy Azure Site Recovery in a multi-tenant setup
services: site-recovery
author: mayurigupta13
manager: rochakm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 10/16/2018
ms.author: mayg
---

# Set up VMware replication in a multi-tenancy environment with the Cloud Solution Provider (CSP) program

The [CSP program](https://partner.microsoft.com/en-US/cloud-solution-provider) fosters better-together stories for Microsoft cloud services, including Office 365, Enterprise Mobility Suite, and Microsoft Azure. With CSP, partners own the end-to-end relationship with customers, and become the primary relationship contact point. Partners can deploy Azure subscriptions for customers, and combine the subscriptions with their own value-added, customized offerings.

With [Azure Site Recovery](site-recovery-overview.md), as partners you can manage disaster recovery for customers directly through CSP. Alternately, you can use CSP to set up Site Recovery environments, and let customers manage their own disaster recovery needs in a self-service manner. In both scenarios, partners are the liaison between Site Recovery and their customers. Partners service the customer relationship, and bill customers for Site Recovery usage.

This article describes how you as a partner can create and manage tenant subscriptions through CSP, for a multi-tenant VMware replication scenario.

## Prerequisites

To set up VMware replication, you need to do the following:

- [Prepare](tutorial-prepare-azure.md) Azure resources, including an Azure subscription, an Azure virtual network, and a storage account.
- [Prepare](vmware-azure-tutorial-prepare-on-premises.md) on-premises VMware servers and VMs.
- For each tenant, create a separate management server that can communicate with the tenant VMs, and your vCenter servers. Only you as a partner should have access rights to this management server. Learn more about [multi-tenant environments](vmware-azure-multi-tenant-overview.md).

## Create a tenant account

1. Through [Microsoft Partner Center](https://partnercenter.microsoft.com/), sign in to your CSP account.
2. On the **Dashboard** menu, select **Customers**.
3. On the page that opens, click the **Add customer** button.
4. In **New Customer** page, fill in the account information details for the tenant.

	![The Account Info page](./media/vmware-azure-multi-tenant-csp-disaster-recovery/customer-add-filled.png)

5. Then click **Next: Subscriptions**.
6. On the subscriptions selection page, select **Microsoft Azure** check box. You can add other subscriptions now or at any other time.
7. On the **Review** page, confirm the tenant details, and then click **Submit**.
8. After you've created the tenant account, a confirmation page appears, displaying the details of the default account and the password for that subscription. Save the information, and change the password later as necessary, through the Azure portal sign-in page.

You can share this information with the tenant as is, or you can create and share a separate account if necessary.

## Access the tenant account

You can access the tenant’s subscription through the Microsoft Partner Center Dashboard.

1. On the **Customers** page, click the name of the tenant account.
2. In the **Subscriptions** page of the tenant account, you can monitor the existing account subscriptions and add more subscriptions, as required.
3. To manage the tenant’s disaster-recovery operations, select **All resources (Azure portal)**. This grants you access to the tenant’s Azure subscriptions.

	![The All Resources link](./media/vmware-azure-multi-tenant-csp-disaster-recovery/all-resources-select.png)  

4. You can verify access by clicking the Azure Active Directory link on the top right of the Azure portal.

	![Azure Active Directory link](./media/vmware-azure-multi-tenant-csp-disaster-recovery/aad-admin-display.png)

You can now perform and manage all Site Recovery operations for the tenant in the Azure portal. To access the tenant subscription through CSP for managed disaster recovery, follow the previously described process.

## Assign tenant access to the subscription

1. Ensure that the disaster recovery infrastructure is set up. Partners access tenant subscriptions through the CSP portal, regardless of whether disaster recovery is managed or self-service. Set up the vault and register infrastructure to the tenant subscriptions.
2. Provide the tenant with the [account you created](#create-a-tenant-account).
3. You can add a new user to the tenant subscription through the CSP portal as follows:

    a) Go to the tenant’s CSP subscription page, and then select the **Users and licenses** option.

	  ![The tenant's CSP subscription page](./media/vmware-azure-multi-tenant-csp-disaster-recovery/users-and-licences.png)

	  b) Now create a new user by entering the relevant details and selecting permissions, or by uploading the list of users in a CSV file.
    c) After you've created a new user, go back to the Azure portal. In the **Subscription** page, select the relevant subscription.
    d) Select **Access Control (IAM)**, and then click **Add**, to add a user with the relevant access level. The users that were created through the CSP portal are automatically displayed on the page that opens after you click an access level.

	  ![Add a user](./media/vmware-azure-multi-tenant-csp-disaster-recovery/add-user-subscription.png)

- For most management operations, the *Contributor* role is sufficient. Users with this access level can do everything on a subscription except change access levels (for which *Owner*-level access is required).
- Site Recovery also has three [predefined user roles](site-recovery-role-based-linked-access-control.md), that can be used to further restrict access levels as required.

## Multi-tenant environments

There are three major multi-tenant models:

* **Shared Hosting Services Provider (HSP)**: The partner owns the physical infrastructure, and uses shared resources (vCenter, datacenters, physical storage, and so on) to host multiple tenant VMs on the same infrastructure. The partner can provide disaster-recovery management as a managed service, or the tenant can own disaster recovery as a self-service solution.

* **Dedicated Hosting Services Provider**: The partner owns the physical infrastructure, but uses dedicated resources (multiple vCenters, physical datastores, and so on) to host each tenant’s VMs on a separate infrastructure. The partner can provide disaster-recovery management as a managed service, or the tenant can own it as a self-service solution.

* **Managed Services Provider (MSP)**: The customer owns the physical infrastructure that hosts the VMs, and the partner provides disaster-recovery enablement and management.

By setting up tenant subscriptions as described in this article, you can quickly start enabling customers in any of the relevant multi-tenant models. You can learn more about the different multi-tenant models and enabling on-premises access controls [here](vmware-azure-multi-tenant-overview.md).

## Next steps
- Learn more about [role-based access control](site-recovery-role-based-linked-access-control.md) to manage Azure Site Recovery deployments.
- Learn more about VMware to Azure [replication architecture](vmware-azure-architecture.md).
- [Review the tutorial](vmware-azure-tutorial.md) for replicating VMware VMs to Azure.
Learn more about [multi-tenant environments](vmware-azure-multi-tenant-overview.md) for replicating VMware VMs to Azure.
