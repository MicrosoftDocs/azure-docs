---
title: Create Azure Native Dynatrace Service resource
description: This article describes how to use the Azure portal to create an instance of Dynatrace.

ms.topic: quickstart
ms.date: 03/13/2025

---

# Quickstart: Get started with Dynatrace

In this quickstart, you create a new instance of Dynatrace. 

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [configure your environment](configure-prerequisites.md).
- You must [subscribe to Dynatrace](overview.md#subscribe-to-dynatrace).

## Create a Dynatrace resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

> [!NOTE] 
> The steps in this article are for creating a new Dynatrace environment.  See [link to an existing Dynatrace environment](link-to-existing-resources.md) if you have an existing Dynatrace environment you'd prefer to link your Azure subscription to.

### Basics tab

The *Basics* tab has four sections:

- Project details
- Azure resource details
- Dynatrace details
- User account information
 
:::image type="content" source="media/create/basics-tab.png" alt-text="A screenshot of the Create a Dynatrace resource in Azure options inside of the Azure portal's working pane with the Basics tab displayed.":::

There are required fields (identified with a red asterisk) that you need to fill out.

1. Enter the values for each required setting under *Project details*.

    | Field               | Action                                                    |
    |---------------------|-----------------------------------------------------------|
    | Subscription        | Select a subscription from your existing subscriptions.   |
    | Resource group      | Use an existing resource group or create a new one.       |

1. Enter the values for each required setting under *Azure Resource details*.

    | Field              | Action                                    |
    |--------------------|-------------------------------------------|
    | Resource name      | Specify a unique name for the resource.   |
    | Region             | Select a region to deploy your resource.  |

1. Enter the values for each required setting under *Dynatrace details*.

    | Field             | Action                       |
    |-------------------|------------------------------|
    | User name         | Specify a user name.         |
    | Company name      | Specify your company's name. | 

1. Select **Next: Metrics and Logs**. 

### Metrics and logs tab (optional)

If you wish, you can configure resources to send metrics/logs to Dynatrace. 

- Select **Enable metrics collection** to set up monitoring of platform metrics.
- Select **Subscription activity logs** to send subscription-level logs to Dynatrace.
- Select **Azure resource logs** to send Azure resource lots to Dynatrace. 

Select the **Next** button at the bottom of the page.

### Single sign-on tab (optional)

[!INCLUDE [sso](../includes/sso.md)]

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next step

> [!div class="nextstepaction"]
> [Manage Dynatrace resources](manage.md)


