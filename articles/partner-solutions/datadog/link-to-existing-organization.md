---
title: Link to an existing Datadog organization - Azure Native Integration
description: Learn how to connect your Azure subscription to an existing Datadog organization to monitor Azure resources using Datadog.
ms.topic: quickstart
ms.date: 05/25/2026
ms.custom:
  - references_regions
  - sfi-image-nochange
#customer intent: As a developer who already uses Datadog, I want to link my Azure subscription to my existing Datadog organization so I can monitor Azure resources without creating a new org.
---

# QuickStart: Link to an existing Datadog organization

If you have an existing Datadog organization on the US3 site and want to send Azure telemetry from a subscription to that organization, use this approach.

> [!NOTE]
> If you don't have an existing Datadog organization, [create a new Datadog organization](create.md) instead.

## Prerequisites

[!INCLUDE [create-prerequisites-owner](../includes/create-prerequisites-owner.md)]

- You must [configure your environment](prerequisites.md).
- You must have an existing Datadog organization on the **US3** site (`us3.datadoghq.com`) with admin access.

> [!IMPORTANT]
> Linking only works with Datadog organizations on the **US3** site. If your existing organization is on US1, US5, EU1, AP1, or any other Datadog site, you can't link it to an Azure subscription through this integration. In that case, [create a new Datadog organization](create.md) instead.

## Create a Datadog resource linked to an existing organization

Begin by signing in to the [Azure portal](https://portal.azure.com/).

1. Type the name of the service in the header search bar.

1. Choose the service from the *Services* search results.

1. Select the **+ Create** option under **Link Azure subscription to an existing Datadog org**.

The **Create** resource pane shows in the working pane with the *Basics* tab open by default.

### Basics tab

The *Basics* tab has three sections:

- Project details
- Azure resource details
- Datadog organization details

:::image type="content" source="media/create/link-existing-basics-tab.png" alt-text="A screenshot of the Link Azure subscription to an existing Datadog organization options inside of the Azure portal's working pane with the Basics tab displayed.":::

There are required fields (identified with a red asterisk) in the first two sections that you need to fill out.

1. Enter the values for each required setting under *Project details*.

    | Field               | Action                                                    |
    |---------------------|-----------------------------------------------------------|
    | Subscription        | Select a subscription from your existing subscriptions.   |
    | Resource group      | Use an existing resource group, or create a new one.       |

1. Enter the values for each required setting under *Azure Resource details*.

    | Field              | Action                                    |
    |--------------------|-------------------------------------------|
    | Resource name      | Specify a unique name for the resource.   |
    | Location           | Select a region to deploy your resource.  |

1. Select **Link to Datadog organization** under *Datadog organization details*.

    A new window appears for **Log in to Datadog**.

    > [!IMPORTANT]
    >
    > - By default, Azure links your current Datadog organization to your Datadog resource. If you'd like to link to a different organization, select the appropriate organization in the authentication window.
    > - You can't link the subscription to the same organization through a different Datadog resource if the subscription is already linked to an organization. This restriction prevents duplicate logs and metrics being shipped to the same organization for the same subscription.

    Once you finish authenticating, return to the Azure portal.

1. Select the **Next** button at the bottom of the page.

[!INCLUDE [datadog-create-tabs](../includes/datadog-create-tabs.md)]

## Verify the link

After creation, verify the link to your existing organization:

1. Navigate to your Datadog resource in the Azure portal.
2. In the **Overview** pane, confirm the **Datadog organization** field shows your expected organization name.
3. Select the **Datadog portal** link to open your organization. You should see your existing dashboards and monitors.
4. Check **Infrastructure** > **Host Map** in the Datadog portal to confirm Azure hosts are appearing.

> [!TIP]
> If you don't see Azure data flowing to your existing organization after 10 minutes, see [Troubleshooting](troubleshoot.md).

## Next steps

- [Manage settings for your Datadog resource](manage.md)
- [Configure metrics and logs](manage.md#reconfigure-rules-for-metrics-and-logs)
- [Monitor multiple subscriptions](manage.md#monitor-multiple-subscriptions)
