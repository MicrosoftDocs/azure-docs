---
title: "Quickstart: Create a Dell PowerScale Preview Resource"
description: Learn how to create a resource for Dell PowerScale by using the Azure portal.
author: ProfessorKendrick
ms.author: kkendrick
ms.topic: quickstart
ms.date: 12/09/2025

---
# Quickstart: Create a Dell PowerScale Preview resource

This quickstart shows you how to create a Dell PowerScale Preview resource by using the Azure portal.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [subscribe to Azure Native Dell PowerScale](overview.md#subscribe-to-dell-powerscale).
- Before you create the Dell PowerScale resource, ensure that the required Azure resource provider **Dell.Storage** is registered. For more information, see [Register resource provider](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).
- You must have a [dedicated subnet delegated](../../virtual-network/manage-subnet-delegation.md) to Dell PowerScale.

## Create a resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

### Basics tab

The **Basics** tab has three sections:

- **Project details**
- **Azure resource details**
- **Dell PowerScale file system details** 

:::image type="content" source="media/create/basics.png" alt-text="Screenshot that shows the Basics tab of the Create a Dell PowerScale resource page.":::

Enter values for each required setting.

1. **Project details:**

    | Setting        |Value                   |
    |----------|------------------|
    | **Subscription**   |   Select the subscription that you want to use.               |
    | **Resource group**   |Select an existing resource group, or create a new one by selecting **Create new**.       |

1. **Azure resource details:**

    | Setting        |Value                   |
    |----------|------------------|
    |**Resource name**|Enter a name for your resource.|
    |**Region**|Select the region in which you want to deploy the resource. |

1. **Dell PowerScale file system details:**

    | Setting   |Value    |
    |----------|------------------|
    |**Dell Reference Number**|Enter your Dell reference number. You can request a reference number by selecting the link in the **Plan** section.|

1. Select Next to go to the **Networking** tab.

### Networking tab

The **Networking** tab has two sections:
  
- **Networking details**
- **SmartConnect FQDN**

:::image type="content" source="media/create/networking.png" alt-text="Screenshot that shows the Networking tab of the Create a Dell PowerScale resource page.":::

Enter values for each required setting.

1. **Networking details:**

    | Setting   |Value    |
    |----------|------------------|
    |**Virtual network**|Select the delegated virtual network in which to deploy the resource.|
    |**Subnet**|Select the delegated subnet in which to deploy the resource. The subnet must be delegated to **Dell.Storage/filesystems** and have at least 256 IP addresses reserved for Dell PowerScale.|

1. **SmartConnect FQDN:** 
 
    | Setting   |Value    |
    |----------|------------------|
    |**SmartConnect service name**|Enter a fully qualified domain name to configure SmartConnect.|

1. If you want to create tags, select the **Tags** tab. See the next section. Otherwise, select the **Review + create** button at the bottom of the page.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next step

> [!div class="nextstepaction"]
> [Manage Dell PowerScale resources](manage.md)
