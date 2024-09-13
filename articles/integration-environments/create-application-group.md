---
title: Create application groups to organize Azure resources
description: Create an application group to logically organize and manage Azure resources related to your integration solutions.
ms.service: integration-environments
ms.topic: how-to
ms.reviewer: estfan, azla
ms.date: 06/07/2024
# CustomerIntent: As an integration developer, I want a way to logically organize and manage the Azure resoruces related to my organization's integration solutions.
---

# Create an application group (Preview)

> [!NOTE]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

After you create an integration environment, create one or more application groups to organize existing Azure resources related to your integration solutions. These groups help you break down your environment even further so that you can manage your resources at more a granular level.

## Prerequisites

- The Azure account and subscription for the [integration environment](create-integration-environment.md) where you want to create an application group.

- Existing Azure resources to add and organize in your application group

  > [!NOTE]
  >
  > Your integration environment and *all* Azure resources that you want to organize 
  > into application groups must use the same Azure subscription, including any 
  > [**Business Process** resources](../business-process-tracking/overview.md) 
  > that you want to link your application group. See 
  > [Supported Azure resources](overview.md#supported-resources).

<a name="create-application-group"></a>

## Create an application group with resources

1. In the [Azure portal](https://portal.azure.com), find and open your integration environment.

1. On your integration environment menu, under **Environment**, select **Applications**.

1. On the **Applications** page toolbar, select **Create**.

   :::image type="content" source="media/create-application-group/create-application-group.png" alt-text="Screenshot shows Azure portal, integration environment shortcut menu with Applications selected, and toolbar with Create selected." lightbox="media/create-application-group/create-application-group.png":::

1. On the **Basics** tab, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Name** | Yes | <*application-name*> | A name for your application group that uses only alphanumeric characters, hyphens, underscores, or periods. |
   | **Description** | No | <*application-description*> | The purpose for your application group. |

1. Select the **Resources** tab, and then select **Add resource**.

1. On the **Add resources to this application** pane that opens, follow these steps:

   1. Leave the selected option **Resources in this subscription**.

   1. From the **Resource type** list, select one of the following types, and then select the respective property values for the resource to add:

      | Resource type | Properties |
      |---------------|------------|
      | **Logic App** | **Name**: The name for the Standard logic app resource. |
      | **API** | - **Name**: The name for the API Management instance. <br>- **API**: The name for the API. |
      | **Service Bus** | - **Name**: The name for the service bus. <br>- **Topic**: The name for the topic. <br>- **Queue**: The name for the queue. |
      | **Business Process** | - **Name**: The name for the business process. |

1. When you're done, select **Add**.

1. To add another resource, repeat steps 4-6.

1. Select the **Review + create** tab, and review all the information.

1. When you're done, select **Create**.

   Your integration environment now shows the application group that you created with the selected Azure resources.

   :::image type="content" source="media/create-application-group/application-group-created.png" alt-text="Screenshot shows Azure portal, application groups list, and new application group." lightbox="media/create-application-group/application-group-created.png":::

## View Azure resources in your application group

After you add resources to your application group, you can view those resources through either of the following views:

| View | Description |
|------|-------------|
| **Applications** | Organized by application group. |
| **Resources** | Organized by all the Azure resources across application groups in your integration environment. |

For a business process, you can view and open the process editor directly from an integration environment by following these steps:

In the Azure portal, on the integration environment menu, under **Environment**, select either option: 

- **Applications** > <*application-group-name*> > <*business-process-name*> > **Business process tracking** > **Editor**.

- **Resources** > <*business-process-name*> > **Business process tracking** > **Editor**.

## Related content

[What is Azure Integration Environments](overview.md)?
