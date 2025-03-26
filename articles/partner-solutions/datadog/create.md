---
title: Create a Datadog resource
description: Get started with Datadog on Azure by creating a new resource, configuring metrics and logs, and setting up single sign-on through Microsoft Entra ID.
ms.topic: quickstart
ms.date: 03/10/2025
ms.custom:
  - references_regions
  - ai-gen-docs-bap
  - ai-gen-desc
  - ai-seo-date:12/03/2024
---

# QuickStart: Get started with Datadog

In this quickstart, you create a new instance of Datadog. 

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [configure your environment](prerequisites.md).
- You must [subscribe to Datadog](overview.md#subscribe-to-datadog).

## Create a Datadog resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

> [!NOTE] 
> The steps in this article are for creating a new Datadog organization.  See [link to an existing Datadog organization](link-to-existing-organization.md) if you have an existing Datadog organization you'd prefer to link your Azure subscription to.

### Basics tab

The *Basics* tab has three sections:

- Project details
- Azure resource details
- Datadog organization details
 
:::image type="content" source="media/create/basics-tab.png" alt-text="A screenshot of the Create a Datadog resource in Azure options inside of the Azure portal's working pane with the Basics tab displayed.":::

There are required fields (identified with a red asterisk) in each section that you need to fill out.

1. Enter the values for each required setting under *Project details*.

    | Field               | Action                                                    |
    |---------------------|-----------------------------------------------------------|
    | Subscription        | Select a subscription from your existing subscriptions.   |
    | Resource group      | Use an existing resource group or create a new one.       |

1. Enter the values for each required setting under *Azure Resource details*.

    | Field              | Action                                    |
    |--------------------|-------------------------------------------|
    | Resource name      | Specify a unique name for the resource.   |
    | Location           | Select a region to deploy your resource.  |

1. Enter the values for each required setting under *Datadog organization details*.

    | Field             | Action                                                                                           |
    |-------------------|--------------------------------------------------------------------------------------------------|
    | Datadog org name  | Choose to create a new organization, or associate your resource with an existing organization.   | 

    Select the **Change plan** link to change your billing plan.

    The remaining fields update to reflect the details of the plan you selected for this new organization.

1. Choose your preferred billing term. 

1. Select the **Next** button at the bottom of the page.

### Metrics and logs tab (optional)

If you wish, you can configure resources to send metrics/logs to Datadog.

Enter the names and values for each *Action* listed under Metrics and Logs.

- Select **Silence monitoring for expected Azure VM Shutdowns**.
- Select **Collect custom metrics from App Insights**.
- Select **Send subscription activity logs**.
- Select **Send Azure resource logs for all defined sources**.

#### Inclusion and exclusion rules for metrics and logs

To filter the set of Azure resources that send logs to Datadog, use inclusion and exclusion rules and set Azure resource tags.

- All Azure resources with tags defined in include rules send logs to Datadog.
- All Azure resources with tags defined in exclude rules don't send logs to Datadog.

> [!NOTE]
> If there's a conflict between inclusion and exclusion rules, exclusion takes priority.

Select the **Next** button at the bottom of the page.

### Security tab (optional)

If you wish to enable Datadog Cloud Security Posture management, select the checkbox.

Select the **Next** button at the bottom of the page.

### Single sign-on tab (optional)

[!INCLUDE [sso](../includes/sso.md)]

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next steps

- [Manage Datadog resources](manage.md)

