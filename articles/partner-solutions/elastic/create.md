---
title: Create Elastic application
description: This article describes how to use the Azure portal to create an instance of Elastic.
ms.topic: quickstart
ms.date: 03/18/2025



---

# QuickStart: Get started with Elastic

In this quickstart, you use the Azure portal to integrate an instance of Elastic with your Azure solutions.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [subscribe to Elastic](overview.md#subscribe-to-elastic).

> [!NOTE]
> The ability to automatically navigate between the Azure portal and Elastic Cloud is enabled via single sign-on (SSO). This option is automatically enabled and turned on for all Azure users.

## Create an Elastic resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

### Basics tab

The *Basics* tab has one section:

- Plan details
 
:::image type="content" source="media/create/basics-tab.png" alt-text="A screenshot of the Create Elastic resource in Azure options inside of the Azure portal's working pane with the Basics tab displayed.":::

There are required fields (identified with a red asterisk) in each section that you need to fill out.

1. Enter the values for each required setting under *Plan details*.

    | Field               | Action                                                    |
    |---------------------|-----------------------------------------------------------|
    | Subscription        | Select a subscription from your existing subscriptions.   |
    | Resource group      | Use an existing resource group or create a new one.       |
    | Resource name       | Specify a unique name for the resource.                   |
    | Region              | Select a region to deploy your resource.                  |

1. Select the **Next: Logs & metrics** button at the bottom of the page.

### Logs & metrics tab (optional)

If you wish, you can configure resources to send metrics/logs to Elastic.

- Select **Send subscription activity logs**.
- Select **Send Azure resource logs for all defined sources**.

Enter the names and values for each *Action* listed under Metrics and Logs.

Select the **Next: Azure OpenAI configuration** button at the bottom of the page.

### Azure OpenAI configuration tab

1. Select an existing **Azure OpenAI Resource**.

1. Select an existing **Azure OpenAI Deployment**.

1. Select the **Next: Tags** button at the bottom of the page.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next steps

> [!div class="nextstepaction"]
> [Manage Elastic resources](manage.md)