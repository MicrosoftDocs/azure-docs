---
title: What is a cloud subscription?
description: Learn about cloud subscriptions, how they help manage Microsoft products and services, and the benefits of organizing resources with multiple subscriptions.
author: Nicholak-MS
ms.author: nicholak
ms.reviewer: nicholak
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: concept-article
ms.date: 12/29/2025
ms.custom:
- build-2025
service.tree.id: b69a7832-2929-4f60-bf9d-c6784a865ed8
---

# What is a cloud subscription?

A cloud subscription is a way to manage the products and services that you buy from Microsoft. A cloud subscription is created when you acquire various Azure resources and other products including Microsoft Azure Consumption Commitment, Enterprise Support, and Microsoft AI Cloud Partner Program. Over time cloud subscription scope will expand to include more Microsoft products and services including device or user license offers like Microsoft 365.

Key aspects of a cloud subscription:

- **No cost for cloud subscriptions** - Cloud subscriptions themselves don't cost any money. They're used to organize and manage the products and services you purchase. While products like virtual machines or Enterprise Support managed within a cloud subscription might incur charges, the subscription itself does't.
- **Multiple subscriptions** - You can create multiple cloud subscriptions to delegate management to different users in your organization or to apply policies for security, budgeting, and compliance.
- **Familiar management tools** - If you're familiar with Azure subscriptions, you'll manage cloud subscriptions similarly, with more manageability for a broader set of products and services.

## Frequently asked questions

Here are some common questions and answers about cloud subscriptions.

### Why is Microsoft creating cloud subscriptions?

Cloud subscriptions are synonymous with Azure subscriptions. Microsoft is expanding the role of cloud subscriptions to provide a consistent platform management story across all products and services that can be acquired commercially from Microsoft.

### Where can I find my cloud subscription?

In the Azure portal, you can see all your cloud subscriptions on the Subscriptions page.

If you're signing in for the first time, search for **Subscriptions** in the search bar.

:::image type="content" source="./media/cloud-subscription/subscription-search-portal.png" border="true" alt-text="Screenshot showing search for subscriptions." lightbox="./media/cloud-subscription/subscription-search-portal.png" :::


### Do I get charged for creating and using cloud subscriptions?

No. Cloud subscriptions don't incur charges, only the resources within. Cloud subscriptions are created and are used to manage the products and services that you purchase.

### How do I manage cloud subscriptions?

To see your cloud subscriptions, navigate to your list of subscriptions in the Azure portal. From there, you can manage them using the Azure tools and services you’re already familiar with.

### Who has access to the cloud subscription?

Cloud subscriptions are created either in an acquisition process like proposal acceptance or can be created as Azure subscriptions today. Cloud subscriptions, like Azure subscriptions, owners are the creating individual or anyone they [delegate management](/azure/lighthouse/how-to/view-manage-customers#view-and-manage-delegations) to. If the subscription was created during proposal acceptance, the purcahser is the subscription owner. You can use the Identity and Access Management (IAM) page for an individual cloud subscription to view and manage access.

### What is the impact of cloud subscriptions?

A cloud subscription is a management container that allows customers to manage the products and services they acquire from Microsoft commercially. You can use cloud subscriptions to:
- [Delegate management](/azure/lighthouse/how-to/view-manage-customers#view-and-manage-delegations) of the resources they contain to different teams or individuals
- [Manage policies and controls for security and compliance](../../governance/policy/tutorials/create-and-manage.md)
- [Track budget and spend](../costs/tutorial-acm-create-budgets.md)
- Perform [other management activities](manage-azure-subscription-policy.md) available to existing Azure subscriptions. 

If a specific resource doesn't support a particular manage action (self-service cancellation, transfer between different scopes like billing accounts or tenants) that operation is blocked at the subscription level until that resource is moved or removed.

### Can cloud subscriptions be canceled?

Yes, cloud subscriptions can be canceled so long as all resources contained in the cloud subscription and its resource groups allow self-service cancellation. If a particular resource like the Microsoft Azure Consumption Commitment (MACC) doesn't support self-service cancellation, it will block cancellation and deletion of the subscription until it's moved or removed. Resources that don't allow self-service cancellation frequently have unique requirements to enable cancellation. Check product documentation for resources requiring special cancellation handling for more specific instructions.

### Can I choose not to use cloud subscriptions?

No, cloud subscriptions are a requirement for the product and service resources that use them and provide important management capabilities those resources and resource providers rely on. Any product and service that requires cloud subscriptions won't be available without their dependent cloud subscription container.

### Why do I see so many cloud subscriptions?

Cloud subscriptions are created when someone creates a cloud subscription directly or when someone makes a purchase that requires a cloud subscription. In some of these cases cloud subscriptions are created and named by the person creating them and in some cases they're named automatically and created as part of the purchase process. You can view all the cloud subscriptions in the Azure portal Subscriptions view.

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
