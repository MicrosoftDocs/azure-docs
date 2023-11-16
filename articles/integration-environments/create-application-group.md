---
title: Create application groups to organize Azure resources
description: Create an application group to logically organize and manage Azure resources related to your integration solutions.
ms.service: azure
ms.topic: how-to
ms.reviewer: estfan, azla
ms.date: 11/15/2023
# CustomerIntent: As an integration developer, I want a way to logically organize and manage the Azure resoruces related to my organization's integration solutions.
---

# Create an application group (preview)

> [!IMPORTANT]
>
> This capability is in public preview and isn't ready yet for production use. For more information, see the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

After you create an integration environment, create one or more application groups to organize existing Azure resources related to your integration solutions. These groups help you break down your environment even further so that you can manage your resources at more a granular level.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [integration environment](create-integration-environment.md)

- Existing Azure resources to add and organize in your application group

  These resources and your integration environment must exist in the same Azure subscription. For information about supported resources, see [Supported Azure resources](overview.md#supported-resources).

- An existing or new [Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-and-database)

  This Azure resource is required to create an application group. Your application group uses this database to store specific business property values that you want to capture and track for business process tracking scenarios. After you create a business process in your application group, specify the key business properties to capture and track as data moves through deployed resources, map these properties to actual Azure resources, and deploy your business process, you specify a database table to create or use for storing the desired data.

  > [!NOTE]
  >
  > Although Azure Integration Environments doesn't incur charges during preview,  Azure Data 
  > Explorer incurs charges, based on the selected pricing option. For more information, see 
  > [Azure Data Explorer pricing](https://azure.microsoft.com/pricing/details/data-explorer/#pricing).

<a name="create-application-group"></a>

## Create an application group with resources

1. In the [Azure portal](https://portal.azure.com), find and open your integration environment.

1. On your integration environment menu, under **Environment**, select **Applications**.

1. On the **Applications** page toolbar, select **Create**.

   :::image type="content" source="media/create-application-group/create-application-group.png" alt-text="Screenshot shows Azure portal, integration environment shortcut menu with Applications selected, and toolbar with Create selected." lightbox="media/create-application-group/create-application-group.png":::

1. On the **Basics** tab, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Name** | Yes | <*application-name*> | Name for your application group that uses only alphanumeric characters, hyphens, underscores, or periods. |
   | **Description** | No | <*application-description*> | Purpose for your application group |

1. Select the **Resources** tab, and then select **Add resource**.

1. On the **Add resources to this application** pane that opens, follow these steps:

   1. Leave the selected option **Resources in this subscription**.

   1. From the **Resource type** list, select one of the following types, and then select the respective property values for the resource to add:

      | Resource type | Properties |
      |---------------|------------|
      | **Logic App** | **Name**: Name for the Standard logic app |
      | **API** | - **Name**: Name for the API Management instance <br>- **API**: Name for the API |
      | **Service Bus** | - **Name**: Name for the service bus to add <br>- **Topic**: Name for the topic <br>- **Queue**: Name for the queue to add |

1. When you're done, select **Add**.

1. To add another resource, repeat steps 4-6.

1. Select the **Business process tracking** tab, and provide the following information:

   | Property | Value |
   |----------|-------|
   | **Subscription** | Azure subscription for your Azure Data Explorer cluster and database |
   | **Cluster** | Name for your Azure Data Explorer cluster |
   | **Database** | Name for your Azure Data Explorer database |

1. Select the **Review + create** tab, and review all the information.

1. When you're done, select **Create**.

   Your integration environment now shows the application group that you created with the selected Azure resources.

   :::image type="content" source="media/create-application-group/application-group-created.png" alt-text="Screenshot shows Azure portal, application groups list, and new application group." lightbox="media/create-application-group/application-group-created.png":::

## Next steps

[Create a business process](create-business-process.md)
