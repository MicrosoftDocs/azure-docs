---
title: What is a cloud subscription?
description: Learn about cloud subscriptions, how they help manage Microsoft products and services, and the benefits of organizing resources with multiple subscriptions.
author: Nicholak-MS
ms.author: nicholak
ms.reviewer: nicholak
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: concept-article
ms.date: 08/13/2025
ms.custom:
- build-2025
---

# What is a cloud subscription?

A cloud subscription is a way to manage the products and services that you buy from Microsoft. Cloud subscriptions get created when you acquire Azure resources and sometimes when you acquire products outside of Azure services. For example, they include the Microsoft Azure Consumption Commitment benefit, credits, discounts, some Microsoft 365 subscriptions, and benefits like Enterprise Support.

The term cloud subscription is synonymous with Azure subscription.

- **No cost for cloud subscriptions** - Cloud subscriptions themselves don't cost any money. They're used to organize and manage the things you buy. While products like virtual machines or Enterprise Support managed within a cloud subscription might incur charges, the subscription itself doesn't.
- **Multiple subscriptions** - You can create multiple cloud subscriptions to delegate management to different users in your organization or to apply policies for security, budgeting, and compliance.
- **Familiar management tools** - If you used Azure subscriptions before, you can manage cloud subscriptions similarly, with more manageability for a broader set of products and services.

## Frequently asked questions

Here are some common questions and answers about cloud subscriptions.

### Why is Microsoft creating cloud subscriptions?

Cloud subscriptions are synonymous with Azure subscriptions, which already exist. Microsoft is expanding the role cloud subscriptions play in order to provide a consistent platform management story across all products and services that can be acquired commercially by Microsoft. Cloud subscriptions allow for a single way to acquire and manage eventually all commercial acquisitions using existing management capabilities already used for Azure services.

### Where can I find my cloud subscription?

In the Azure portal, you can see all your cloud subscriptions on the Subscriptions page.

If you're signing in for the first time, search for **Subscriptions** in the search bar.

:::image type="content" source="./media/cloud-subscription/subscription-search-portal.png" border="true" alt-text="Screenshot showing search for subscriptions." lightbox="./media/cloud-subscription/subscription-search-portal.png" :::


### Do I get charged for creating and using cloud subscriptions?

No. Cloud subscriptions get created on the back end and are used to manage the things that you buy. They don't incur charges or cost money.

### How do I manage my cloud subscriptions?

To see your cloud subscriptions, navigate to your list of subscriptions in the Azure portal. From there, you can manage them using the tools you’re already familiar with.

### Who has access to the cloud subscription?

Cloud subscriptions are created either in an acquisition process like proposal acceptance or can be created as Azure subscriptions today. Cloud subscriptions, as Azure subscriptions, are owned by the creating individual or anyone they [delegate management](/azure/lighthouse/how-to/view-manage-customers#view-and-manage-delegations) to. If the subscription was created in a purchase process like proposal acceptance, the subscription is owned by the person making the purchase. You can use the Access Control (IAM) page for an individual cloud subscription to see and manage access.

### What is the impact of cloud subscriptions?

A cloud subscription is a container that allows customers to manage the things they acquire from Microsoft commercially. You can use cloud subscriptions to [delegate management](/azure/lighthouse/how-to/view-manage-customers#view-and-manage-delegations) of the resources they contain to different teams or individuals, to [manage policies and controls for security and compliance](../../governance/policy/tutorials/create-and-manage.md), to [track budget and spend](../costs/tutorial-acm-create-budgets.md) or to do [other management activities](manage-azure-subscription-policy.md) available to existing Azure subscriptions today. If a particular resource doesn't support a particular manage action (self-service cancellation, transfer between different scopes like billing accounts or tenants) that operation will be blocked at the subscription level until that resource is moved or removed.

### Can cloud subscriptions be canceled?

Yes, cloud subscriptions can be canceled so long as all resources contained in the cloud subscription and its resource groups allow self-service cancellation. If a particular resource like the Microsoft Azure Consumption Commitment (MACC) doesn't support self-service cancellation, it will block cancellation and deletion of the subscription until it is move or removed. Resources that do not allow self-service cancellation frequently have unique requirements to enable cancellation. Check product documentation for resources requiring special cancellation handling for more specific instructions.

### Can I choose not to use cloud subscriptions?

No, cloud subscriptions are a technical requirement for the services that use them and provide important management capabilities those resources and resource providers rely on. Any product that requires cloud subscriptions will not be available without their dependent cloud subscription container.

### Why do I see so many cloud subscriptions?

Cloud subscriptions are created either when someone creates a cloud subscription directly or when someone makes a purchase that requires a cloud subscription. In some of these cases cloud subscriptions are created and named by the person creating them and in some cases they are named automatically and created as part of the purchase process. You can view all the cloud subscriptions in the Azure portal Subscriptions view.

## Related content

- [Create a new cloud subscription](create-subscription.md)
- [Manage role assignments and permissions](../../role-based-access-control/rbac-and-directory-admin-roles.md)
- [Manage your cloud subscriptions](manage-azure-subscription-policy.md)
- [Transfer your cloud subscription](../../role-based-access-control/transfer-subscription.md)
- [Filter and view your subscriptions](filter-view-subscriptions.md)
- [Delegate management](/azure/lighthouse/how-to/view-manage-customers#view-and-manage-delegations)
- [Organize costs](../costs/allocate-costs.md)
- [Track budget and spend](../costs/tutorial-acm-create-budgets.md)
- [Organize products and services](/azure/cloud-adoption-framework/ready/azure-setup-guide/organize-resources)
- [Manage policies and controls for security and compliance](../../governance/policy/tutorials/create-and-manage.md)
- [Add tags to your subscriptions](../../azure-resource-manager/management/tag-resources-portal.md)
- [Cancel and delete your subscriptions](cancel-azure-subscription.md)
