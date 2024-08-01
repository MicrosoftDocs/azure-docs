---
title: Link Oracle Database@Azure to multiple Azure subscriptions
description: Learn about how to link Oracle Database@Azure to multiple Azure subscriptions.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: how-to
ms.service: oracle-on-azure
ms.date: 08/01/2024
ms.custom: engagement-fy24
---

# Link Oracle Database@Azure to multiple Azure subscriptions
Learn about how to link Oracle Database@Azure to multiple Azure subscriptions.

You can use Oracle Database@Azure within two or more [Azure subscriptions](/azure/cloud-adoption-framework/ready/azure-setup-guide/organize-resources) within a single Azure account. This feature gives you the ability to isolate projects, environments, and application domains for security and cost allocation, while maintaining a single Azure account for simplified billing and account management. When using two or more Azure subscriptions with Oracle Database@Azure, all Azure subscriptions are linked to the OCI tenancy used for service onboarding.

## Prerequisites
- You must onboard with Oracle Database@Azure before you can link Azure subscriptions to the service as described in this article. For more information, see [Onboarding with Oracle Database@Azure](onboard-oracle-database.md) and [Prerequisites for Oracle Database@Azure](onboard-oracle-database.md#prerequisites) for more information.
- Add the ``Oracle.Database`` resource provider to the subscription you're adding to the service. To add the subscription, navigate to the Azure subscription details page, then select Resource providers under Settings. Select ``Oracle.Database`` in the list of providers, then select **Register**.
- Add the ``Microsoft.BareMetal``, ``Microsoft.Network``, and ``Microsoft.Compute`` resources providers to the subscription you're adding to the service. Add these resources from the Azure subscription details page, as you added the ``Oracle.Database`` resource provider described in the preceding prerequisite. 
>[!Note]
>You can't provision Oracle Database@Azure resources until these Azure resource providers are registered for the subscription you're adding.

## How multiple Azure subscriptions work in Oracle Database@Azure
During Oracle Database@Azure onboarding, you select an Azure subscription to use initially with the service. In this documentation, the subscription selected during onboarding is referred to as the primary subscription for Oracle Database@Azure. After onboarding is complete and your Azure account is linked to your OCI tenancy, the OCI tenancy has a new, automatically created [compartment](https://docs.oracle.com/en-us/iaas/Content/Identity/compartments/managingcompartments.htm) for the management of the service.

When you add more Azure subscriptions to your Oracle Database@Azure service, the service automatically creates a child compartment within the main Oracle Database@Azure compartment created during onboarding. You don't have to do any manual configuration of your OCI tenancy to add more Azure subscriptions to the service.

>[!Important]
> When adding Azure subscriptions to your Oracle Database@Azure service, the new subscriptions must use the same billing account as the primary Azure subscription selected during service onboarding.

After you add a new Azure subscription to the Oracle Database@Azure service, you can begin provisioning database resources in that subscription. For database systems with more than one component (for example, Exadata systems with an infrastructure resource and a VM cluster resource), all components must be provisioned within the same subscription. When users are working within an Azure subscription, they only see the Oracle Database@Azure resources provisioned within that subscription. Database resources provisioned in other subscriptions aren't visible to the user.

## Add an Azure subscription to the Oracle Database@Azure service

1. Sign in to the Azure portal and navigate to the details page of your primary Oracle Database@Azure subscription (this is the subscription selected during onboarding). For more information, see [Filter and view subscriptions](/azure/cost-management-billing/manage/filter-view-subscriptions) in the Azure documentation for details. If you don't know the name of the subscription, ask your Azure account administrator.
2. On the details page for your Oracle subscription, select **Add subscriptions**.
3. In the **Add Azure Subscriptions** panel, select one or more subscriptions to add to your service using the **Azure Subscriptions** selector, then select **Add**.
4. On the details page of the primary Oracle Database@Azure, you can see the number of active subscriptions for the service under **Account management**. When the subscriptions you added are ready for use, you see a **Validated** message in the **Account management** section.


