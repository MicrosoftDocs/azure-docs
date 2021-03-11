---
title: How to tag a VM using the Azure portal
description: Learn about tagging a virtual machine using the Azure portal.
ms.topic: how-to
ms.workload: infrastructure-services
author: cynthn
ms.service: virtual-machines
ms.date: 11/11/2020
ms.author: cynthn
---

# Tagging a VM using the portal

This article describes how to add tags to a VM using the portal. Tags are user-defined key/value pairs which can be placed directly on a resource or a resource group. Azure currently supports up to 50 tags per resource and resource group. Tags may be placed on a resource at the time of creation or added to an existing resource.


1. Navigate to your VM in the portal.
1. In **Essentials**, select **Click here to add tags**.

    :::image type="content" source="media/tag/azure-portal-tag.png" alt-text="Screenshot of the Essentials section of the VM page.":::

1. Add a value for **Name** and **Value**, and then select **Save**.

    :::image type="content" source="media/tag/key-value.png" alt-text="Screenshot of the page for adding a key value pair as a tag.":::

### Next steps

- To learn more about tagging your Azure resources, see [Azure Resource Manager Overview](../azure-resource-manager/management/overview.md) and [Using Tags to organize your Azure Resources](../azure-resource-manager/management/tag-resources.md).
- To see how tags can help you manage your use of Azure resources, see [Understanding your Azure Bill](../cost-management-billing/understand/review-individual-bill.md).
