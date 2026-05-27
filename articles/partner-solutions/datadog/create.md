---
title: Create a Datadog resource
description: Get started with Datadog on Azure by creating a new resource, configuring metrics and logs, and setting up single sign-on through Microsoft Entra ID.
author: pdjokar96
ms.author: piyushdash
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

# QuickStart: Create a new Datadog organization

In this quickstart, you create a new Datadog organization and resource in Azure.

## What to expect

After you complete this quickstart, you have:

- A Datadog resource (`Microsoft.Datadog/monitors`) in your chosen resource group
- A new Datadog organization with API keys provisioned
- Azure platform metrics flowing from your subscription to Datadog
- (Optional) Azure resource logs forwarded to Datadog
- (Optional) Single sign-on configured via Microsoft Entra ID

The entire process takes about 5-10 minutes.

## Prerequisites

[!INCLUDE [create-prerequisites-owner](../includes/create-prerequisites-owner.md)]
- You must [configure your environment](prerequisites.md).

> [!IMPORTANT]
> Azure free credits **can't** be used to purchase Azure Marketplace third-party offers, including Datadog. For details, see [Understand your Azure Marketplace charges](https://docs.azure.cn/en-us/cost-management-billing/understand/understand-azure-marketplace-charges#how-external-services-are-billed).

## Create the resource

> [!NOTE]
> If you already have a Datadog organization on the US3 site that you'd like to link to your Azure subscription, see [Link to an existing Datadog organization](link-to-existing-organization.md) instead.

::: zone pivot="azure-cli"

### Set up the Azure CLI

Start by preparing your environment for the Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

### Register the resource provider

The Azure portal registers the `Microsoft.Datadog` resource provider automatically when you create through the portal UI. For CLI or SDK deployments, you must register it yourself first:

```azurecli
az provider register --namespace Microsoft.Datadog --wait
```

Verify that registration succeeded:

```azurecli
az provider show --namespace Microsoft.Datadog --query registrationState -o tsv
# Expected output: Registered
```

### Create the resource

> [!IMPORTANT]
> Make sure the `Microsoft.Datadog` resource provider is registered on your subscription before you run the create command. Resource creation fails with a generic `ResourceCreationValidateFailed` error if the provider isn't registered. See [Register the resource provider](#register-the-resource-provider) above.

After you sign in, use the [az datadog monitor create](/cli/azure/datadog/monitor#az-datadog-monitor-create) command (from the `datadog` Azure CLI extension, version 3.0.0 or higher — the extension installs automatically the first time you run an `az datadog monitor` command; run `az extension update --name datadog` if you installed it previously) to create the new monitor resource.

**Create a new Datadog organization.** Replace the placeholder values with your own:

```azurecli
az datadog monitor create \
  --name "myDatadog" \
  --resource-group "myResourceGroup" \
  --location "West US 2" \
  --sku name="payg_v3_Monthly" \
  --org-properties name="my-datadog-org" \
  --user-info name="Jane Doe" email-address="jane@contoso.com" phone-number="123-456-7890" \
  --identity type="SystemAssigned" \
  --monitoring-status "Enabled" \
  --tags Environment="Dev" Team="Platform"
```

**Link to an existing Datadog organization** instead by using the `Linked` SKU and supplying the org's API key and application key:

```azurecli
az datadog monitor create \
  --name "myDatadog-link" \
  --resource-group "myResourceGroup" \
  --location "West US 2" \
  --sku name="Linked" \
  --org-properties api-key="<datadog-api-key>" application-key="<datadog-application-key>" \
  --user-info name="Jane Doe" email-address="jane@contoso.com" phone-number="123-456-7890" \
  --identity type="SystemAssigned"
```

| Parameter | Description |
|-----------|-------------|
| `--name` | A unique name for your Datadog resource. |
| `--resource-group` | The resource group to contain the Datadog resource. |
| `--location` | The Azure region. Use **West US 2** — see [region availability](overview.md#region-availability). |
| `--sku name=` | Marketplace plan SKU. Use `payg_v3_Monthly` for the public pay-as-you-go plan when creating a new Datadog org, or `Linked` when linking to an existing org. For private offers, supply the SKU name your Datadog account team shared with you. |
| `--org-properties` | For a new org: `name=<org-name>`. For linking: `api-key=` and `application-key=` from your existing Datadog org. |
| `--user-info` | Contact name, email, and phone for the Datadog organization admin. |
| `--identity` | Managed identity for the Datadog resource. `SystemAssigned` is recommended. |
| `--monitoring-status` | `Enabled` (default) or `Disabled`. |
| `--tags` | Optional Azure resource tags for organization and cost tracking. |

> [!TIP]
> Add `--no-wait` if you want the command to return immediately. The operation continues in the background until the Datadog monitor is created. Use `az datadog monitor wait` to check for completion.

### Verify the resource

After creation completes, verify your Datadog resource:

```azurecli
az datadog monitor show --name "myDatadog" --resource-group "myResourceGroup"
```

### List existing monitors

View all Datadog monitors in your subscription:

```azurecli
az datadog monitor list
```

Filter by resource group:

```azurecli
az datadog monitor list --resource-group "myResourceGroup"
```

### Wait for completion (optional)

To pause CLI execution until a monitor's specific event or condition occurs, use the [az datadog monitor wait](/cli/azure/datadog/monitor#az-datadog-monitor-wait) command:

```azurecli
az datadog monitor wait --name "myDatadog" --resource-group "myResourceGroup" --created
```

::: zone-end

::: zone pivot="azure-portal"

### Start the creation workflow

You can start the Datadog creation workflow from either entry point:

- **Azure portal**: open the [Datadog resource browse page](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Datadog%2Fmonitors) and select **Create**.
- **Azure Marketplace**: open the [Datadog – an Azure Native ISV Service offering](https://azuremarketplace.microsoft.com/marketplace/apps/datadog1591740804488.dd_liftr_v2?tab=Overview) and select **Get It Now**.

Alternatively, from the Azure portal global search bar, search for **Datadog** and select the **Datadog – An Azure Native ISV Service** result.

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
    | Datadog org name  | Enter a name for your new Datadog organization.   |

    Select the **Change plan** link to change your billing plan.

    The remaining fields update to reflect the details of the plan you selected for this new organization.

1. Choose your preferred billing term.

1. Select the **Next** button at the bottom of the page.

[!INCLUDE [datadog-create-tabs](../includes/datadog-create-tabs.md)]

::: zone-end

## Verify your deployment

After the resource is created, verify that data is flowing:

1. Navigate to your Datadog resource in the Azure portal.
2. In the **Overview** pane, confirm the **Status** shows as *Active*.
3. Select the **Datadog portal** link to open your Datadog organization.
4. In the Datadog portal, check **Infrastructure** > **Host Map** to confirm Azure hosts appear.
5. Check **Logs** > **Search** to verify log data is arriving (allow a few minutes for initial data).

> [!TIP]
> If metrics or logs aren't appearing after 10 minutes, see [Troubleshooting](troubleshoot.md) for common causes and solutions.

## Next steps

> [!div class="nextstepaction"]
> [Manage Datadog resources](manage.md)

- [Configure metrics and logs](manage.md#reconfigure-rules-for-metrics-and-logs)
- [Set up monitoring agents](manage.md#monitor-resources-with-datadog-agents)
- [Monitor multiple subscriptions](manage.md#monitor-multiple-subscriptions)

