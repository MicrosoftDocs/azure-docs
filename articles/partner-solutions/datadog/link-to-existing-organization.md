---
title: Link to an existing Datadog organization - Azure Native Integration
description: Learn how to connect your Azure subscription to an existing Datadog organization to monitor Azure resources using Datadog.
ms.topic: quickstart
ms.date: 1/29/2026
ms.custom:
  - references_regions
  - sfi-image-nochange
#customer intent: As a developer who already uses Datadog, I want to link my Azure subscription to my existing Datadog organization so I can monitor Azure resources without creating a new org.
---

# QuickStart: Link to an existing Datadog organization

If your team already uses Datadog, you can link your Azure subscription to your existing Datadog organization instead of creating a new one. This approach lets you:

- Use your existing dashboards, monitors, and alerts with Azure data
- Keep all Azure and non-Azure monitoring in a single Datadog organization
- Consolidate Datadog billing through your Azure subscription

> [!NOTE]
> If you don't have an existing Datadog organization, [create a new Datadog resource](create.md) instead.

## When to link vs. create new

| Scenario | Recommended action |
|---------|-------------------|
| Your team already uses Datadog for other environments (AWS, GCP, on-premises) | **Link** to the existing organization |
| You want to keep Azure monitoring separate from other environments | **Create** a new organization |
| You have existing Datadog dashboards and alerts you want to reuse | **Link** to the existing organization |
| You need isolated billing per team or project | **Create** a new organization |

## Prerequisites

[!INCLUDE [create-prerequisites-owner](../includes/create-prerequisites-owner.md)]

- You must [configure your environment](prerequisites.md).
- You must [subscribe to Datadog](overview.md#subscribe-to-datadog).
- You must have an existing Datadog organization with admin access to authenticate the link.

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

### Metrics and logs tab (optional)

Configure which Azure resources send metrics and logs to your existing Datadog organization. You can change these settings at any time after creation.

For more information about what gets sent, see [Monitor & Observe Azure resources with Azure Native Integrations](../metrics-logs.md).

- Select **Silence monitoring for expected Azure VM Shutdowns**.
- Select **Collect custom metrics from App Insights**.
- Select **Send subscription activity logs**.
- Select **Send Azure resource logs for all defined sources**.

After you finish configuring metrics and logs, select **Next**.

### Security tab (optional)

The **Security** tab controls two features:

- **Enable resource collection** — *On by default.* Lets Datadog collect metadata (types, tags, configurations) about your Azure resources so they appear in the Datadog [Resource Catalog](https://docs.datadoghq.com/infrastructure/resource_catalog/). There's no additional Datadog charge for this.
- **Enable Datadog Cloud Security Posture Management** — *Optional, off by default.* Continuously assesses your Azure configuration against CIS, PCI DSS, SOC 2, HIPAA, and similar benchmarks. Learn more about [Cloud Security Posture Management](https://www.datadoghq.com/knowledge-center/cloud-security-posture-management/).

> [!IMPORTANT]
> Cloud Security Posture Management can be enabled only when **Enable resource collection** is selected. Disabling resource collection automatically disables the CSPM checkbox.

Select the **Next** button at the bottom of the page.

### Single sign-on tab (optional)

If your organization uses Microsoft Entra ID as its identity provider, you can establish single sign-on from the Azure portal to Datadog.

To establish single sign-on through Microsoft Entra ID:

1. Select the checkbox.

    The Azure portal retrieves the appropriate Datadog application from Microsoft Entra ID, which matches the Enterprise app you provided previously.

1. Select the Datadog app name.

Select the **Next** button at the bottom of the page.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

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
