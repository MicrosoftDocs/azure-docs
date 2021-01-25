---
# Mandatory fields.
title: Enable private access with Private Link
titleSuffix: Azure Digital Twins
description: See how to enable private access for Azure Digital Twins solutions with Private Link
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 1/25/2021
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Enable private access with Private Link

...

## Prerequisites

...

## Enable Private Link for an Azure Digital Twins instance 

You can turn on Private Link for an Azure Digital Twins instance as part of the instance's initial setup, or enable it later on an instance that already exists. You can set it up on an existing instance using that instance's options in the Azure Portal, or through Private Link options in the Azure portal.

Any of these creation methods will give the same configuration options and the same end result for your instance. This section describes how to do each one.

### Enable Private Link during instance creation

In this section, you'll learn how to enable Private Link on an Azure Digital Twins instance that is currently being created. This section focuses on the networking step of the creation process; for a complete walkthrough of creating a new Azure Digital Twins instance, see [*How-to: Set up an instance and authentication*](how-to-set-up-instance-portal.md).

The Private Link options are located in the **Networking** tab of instance setup.

In this tab, you can enable private endpoints by selecting the **Private endpoint** option for the **Connectivity method**.

This will add a section called **Private endpoint connections** where you can configure the details of your private endpoint. Select the **+ Add** button to continue.

:::image type="content" source="media/how-to-route-managed-identities/create-instance-networking-1.png" alt-text="Screenshot of the Azure portal showing the Networking tab of the Create Resource dialog for Azure Digital Twins. There's a highlight around the tab name, the Private endpoint option for Connectivity method, and the + Add button to create a new private endpoint connection.":::

[!INCLUDE [digital-twins-create-private-endpoint.md](../../includes/digital-twins-create-private-endpoint.md)]

This will return you to the **Networking** tab of the Azure Digital Twins instance setup, where your new endpoint should be visible under **Private endpoint connections.

:::image type="content" source="media/how-to-route-managed-identities/create-instance-networking-2.png" alt-text="Screenshot of the Azure portal showing the Networking tab of the Create Resource dialog for Azure Digital Twins. There's a highlight around the new private endpoint connection, and the navigation buttons (Review + create, Previous, Next: Advanced).":::

You can then use the bottom navigation buttons to continue with the rest of instance setup.

### Enable Private Link on an existing instance

In this section, you'll learn how to enable Private Link for an Azure Digital Twins instance that already exists.

You can do this either through the Azure Digital Twins instance's options in the Azure Portal, or through the Private Link options in the Azure portal. There is no difference in the result.

#### Through the Azure Digital Twins instance

...

#### Through Private Link

...

## Enabling / disabling public network access flags

...

## Next steps