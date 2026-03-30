---
title: Create a Datadog resource
description: Get started with Datadog on Azure by creating a new resource, configuring metrics and logs, and setting up single sign-on through Microsoft Entra ID.
ms.topic: quickstart
zone_pivot_groups: datadog-create
ms.date: 12/01/2025
ms.custom:
  - references_regions
  - ai-gen-docs-bap
  - ai-gen-desc
  - ai-seo-date:12/03/2024
  - sfi-image-nochange
---

# QuickStart: Get started with Datadog

In this quickstart, you create a new instance of Datadog. 

## Prerequisites

[!INCLUDE [create-prerequisites-owner](../includes/create-prerequisites-owner.md)]
- You must [configure your environment](prerequisites.md).
- You must [subscribe to Datadog](overview.md#subscribe-to-datadog).

## Create a Datadog resource

> [!NOTE] 
> The steps in this article are for creating a new Datadog organization.  See [Link to an existing Datadog organization](link-to-existing-organization.md) if you have an existing Datadog organization you'd prefer to link your Azure subscription to.

::: zone pivot="azure-cli"

Start by preparing your environment for the Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

After you sign in, use the [az datadog monitor create](/cli/azure/datadog/monitor#az-datadog-monitor-create) command to create the new monitor resource:

```azurecli
az datadog monitor create --name "myMonitor" --resource-group "myResourceGroup" \
 --location "my location" \ 
 --offer-detail id="string" plan-id="string" plan-name="string" publisher-id="string" term-unit="string" \ 
 --user-detail email-address="contoso@microsoft.com" first-name="string" last-name="string" \ 
 --tags Environment="Dev" 
```

> [!NOTE]
> If you want the command to return before the create operation completes, add the optional parameter `--no-wait`. The operation continues to run until the Datadog monitor is created.

To pause CLI execution until a monitor's specific event or condition occurs, use the [az datadog monitor wait](/cli/azure/datadog/monitor#az-datadog-monitor-wait) command. For example, to wait until a monitor is created:

```azurecli
az datadog monitor wait --name "myMonitor" --resource-group "myResourceGroup" --created
```

To see a list of existing monitors, use the [az datadog monitor list](/cli/azure/datadog/monitor#az-datadog-monitor-list) command.

You can view all of the monitors in your subscription:

```azurecli
az datadog monitor list
```

Or, view the monitors in a resource group:

```azurecli
az datadog monitor list --resource-group "myResourceGroup"
```

To see the properties of a specific monitor, use the [az datadog monitor show](/cli/azure/datadog/monitor#az-datadog-monitor-show) command.

You can view the monitor by name:

```azurecli
az datadog monitor show --name "myMonitor" --resource-group "myResourceGroup"
```

Or, view the monitor by resource ID:

```azurecli
az datadog monitor show --ids "/subscriptions/{SubID}/resourceGroups/{myResourceGroup}/providers/Microsoft.Datadog/monitors/{myMonitor}"

::: zone-end

::: zone pivot="azure-portal"

[!INCLUDE [create-resource](../includes/create-resource.md)]

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

If you wish, you can configure resources to send metrics/logs to Datadog. For more information, see [Monitor & Observe Azure resources with Azure Native Integrations](../metrics-logs.md).

Enter the names and values for each *Action* listed under Metrics and Logs.

- Select **Silence monitoring for expected Azure VM Shutdowns**.
- Select **Collect custom metrics from App Insights**.
- Select **Send subscription activity logs**.
- Select **Send Azure resource logs for all defined sources**.

After you finish configuring metrics and logs, select **Next**.

### Security tab (optional)

If you wish to enable Datadog Cloud Security Posture management, select the checkbox.

Select the **Next** button at the bottom of the page.

### Single sign-on tab (optional)

[!INCLUDE [sso](../includes/sso.md)]

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

::: zone-end

## Next step
> [!div class="nextstepaction"]
> [Manage Datadog resources](manage.md)

