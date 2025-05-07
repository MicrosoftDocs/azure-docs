---
title: Link Oracle Database@Azure to multiple Azure subscriptions
description: Learn how to link your Oracle Database@Azure resources to multiple Azure subscriptions.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: how-to
ms.service: oracle-on-azure
ms.date: 08/01/2024
ms.custom: engagement-fy24
---

# Link Oracle Database@Azure to multiple Azure subscriptions

In this article, learn how to link your Oracle Database@Azure resources to multiple Azure subscriptions.

You can use Oracle Database@Azure resources in multiple [Azure subscriptions](/azure/cloud-adoption-framework/ready/azure-setup-guide/organize-resources) within a single Azure account. You can isolate projects, environments, and application domains for security and cost allocation while maintaining a single Azure account for simplified billing and account management. When you use two or more Azure subscriptions with Oracle Database@Azure, all Azure subscriptions are linked to the Oracle Cloud Infrastructure (OCI) tenancy that you use to onboard the service instance.

## Prerequisites

- Oracle Database@Azure is onboarded before you link Azure subscriptions to the service instance.

  For more information, see [Onboard Oracle Database@Azure](onboard-oracle-database.md).

- The following resource providers are added to the subscription that you add to the service instance:

  - Oracle.Database
  - Microsoft.BareMetal
  - Microsoft.Network
  - Microsoft.Compute

  You can't provision Oracle Database@Azure resources until these Azure resource providers are registered for the subscription you add.

  To add a resource provider to a subscription:
  
  1. In the Azure portal, go to the Azure subscription that you want to add.
  1. In the service menu under **Settings**, select **Resource providers**.
  1. In the list of providers, select the resource provider, and then select **Register**.

## Use multiple Azure subscriptions with Oracle Database@Azure

When you onboard Oracle Database@Azure, you select an Azure subscription to initially use with the service instance. In Azure documentation, the subscription you select when you onboard Oracle Database@Azure is called the *primary subscription*.

When onboarding is complete and your Azure account is linked to your OCI tenancy, a new [compartment](https://docs.oracle.com/iaas/Content/Identity/compartments/managingcompartments.htm) is automatically created for the service instance. When you add an Azure subscription to your Oracle Database@Azure service instance, the service automatically creates a child compartment in the main Oracle Database@Azure compartment that was created in the onboarding process. No manual configuration of your OCI tenancy is required to add more Azure subscriptions.

> [!IMPORTANT]
> When you add another Azure subscription to your Oracle Database@Azure service instance, the new subscription must use the same billing account as the Azure primary subscription.

After you add a new Azure subscription to the Oracle Database@Azure service instance, you can begin provisioning database resources in that subscription. For database systems that have more than one component (for example, an Oracle Exadata system with an infrastructure resource and a virtual machine cluster resource), all components must be provisioned in the same subscription. When a user works in an Azure subscription, they can view only the Oracle Database@Azure resources that are provisioned in that subscription. Database resources that are provisioned in other subscriptions aren't visible to the user.

## Add an Azure subscription to your Oracle Database@Azure instance

1. In the Azure portal, go to the details pane of your primary subscription for Oracle Database@Azure (the subscription you selected during onboarding).

   For more information, see [Filter and view subscriptions](/azure/cost-management-billing/manage/filter-view-subscriptions). If you don't know the name of the subscription, contact your Azure account administrator.

1. Select **Add subscriptions**.
1. On the **Add Azure subscriptions** pane, select one or more Azure subscriptions to add to your service instance, and then select **Add**.
1. On the details pane for the Oracle Database@Azure primary subscription, under **Account management**, the number of active subscriptions for the service instance appears. When the subscription that you added is ready to use with the Oracle Database@Azure instance resources, a status of **Validated** for the subscription is shown.
