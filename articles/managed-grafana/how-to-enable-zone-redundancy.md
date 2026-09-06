---
title: How to enable zone redundancy in Azure Managed Grafana
description: Learn how to create a zone-redundant Azure Managed Grafana workspace for protection against datacenter failure.
ms.service: azure-managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.custom: engagement-fy23
ms.date: 08/28/2026

--- 

# Enable zone redundancy in Azure Managed Grafana

Azure Managed Grafana offers a zone-redundant option to protect your workspace against datacenter failure. Enabling zone redundancy for Azure Managed Grafana lets you deploy your Azure Managed Grafana resources across a minimum of three [Azure availability zones](/azure/reliability/availability-zones-region-support) within the same Azure region.

This guide shows you how to enable zone redundancy when you create an Azure Managed Grafana workspace.

> [!NOTE]
> Zone redundancy for Azure Managed Grafana is a billable option. [See prices](https://azure.microsoft.com/pricing/details/managed-grafana/#pricing). You can enable zone redundancy only when you create the workspace. You can't change this setting later.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Sign in to Azure

Sign in to Azure with the Azure portal or with the Azure CLI.

### [Portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.  

### [Azure CLI](#tab/azure-cli)

Open your CLI and run the `az login` command to sign in to Azure.

```azurecli
az login
```

This command prompts your web browser to launch and load an Azure sign-in page. If the browser fails to open, use device code flow with `az login --use-device-code`. For more sign-in options, go to [sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

---

## Create an Azure Managed Grafana workspace

Create a workspace and enable zone redundancy with the Azure portal or the CLI.

### [Portal](#tab/azure-portal)

1. In the upper-left corner of the home page, select **Create a resource**. In the **Search resources, services, and docs (G+/)** box, enter *Azure Managed Grafana* and select **Azure Managed Grafana**.

    :::image type="content" source="media/quickstart-portal/find-azure-portal-grafana.png" alt-text="Screenshot of the Azure platform. Find Azure Managed Grafana in the marketplace." :::

1. Select **Create**.

1. In the **Basics** pane, enter the following settings.

    | Setting             | Description                                                                                            | Example             |
    |---------------------|--------------------------------------------------------------------------------------------------------|---------------------|
    | Subscription ID     | Select the Azure subscription you want to use.                                                         | *my-subscription*   |
    | Resource group name | Create a resource group for your Azure Managed Grafana resources.                                      | *my-resource-group* |
    | Location            | Specify the geographic location in which to host your resource. Choose the location closest to you.    | *(US) East US*      |
    | Name                | Enter a unique resource name. It is used as the domain name in your Azure Managed Grafana workspace URL. | *my-grafana*        |
    | Pricing plan        | Select the **Standard** plan to get access to the zone redundancy feature. This feature is only available for customers using a [Standard plan](overview.md#service-tiers).                             | *Standard*          |
    | Zone Redundancy     | Set **Enable Zone Redundancy** to **Enable**.                                                          | *Enabled*           |

    Zone redundancy automatically provisions and manages a standby replica of the Azure Managed Grafana workspace in a different availability zone within one region. There's an [additional charge](https://azure.microsoft.com/pricing/details/managed-grafana/#pricing) for this option.

1. Keep all other options set to their default values and select **Review + create**.

1. On the page, zone redundancy is shown as set to enabled. After validation runs, select **Create**. Your Azure Managed Grafana resource is deploying.

    :::image type="content" source="media/zone-redundancy/create-form-validation.png" alt-text="Screenshot of the Azure portal. Create workspace form review page showing that zone redundancy is set to Enabled.":::

### [Azure CLI](#tab/azure-cli)

1. Run the code below to create a resource group to organize the Azure resources needed. Skip this step if you already have a resource group you want to use.

    | Parameter  | Description                                                                                                                                                                                           | Example      |
    |------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
    | --name     | Choose a unique name for your new resource group.                                                                                                                                                     | *grafana-rg* |
    | --location | Choose an Azure region where Azure Managed Grafana is available. For more info, go to [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=managed-grafana). | *eastus*     |

    ```azurecli
    az group create --location <location> --name <resource-group-name>
    ```

1. Run the code below to create an Azure Managed Grafana workspace.

    | Parameter         | Description                                                      | Example                     |
    |-------------------|------------------------------------------------------------------|-----------------------------|
    | --name            | Choose a unique name for your new Azure Managed Grafana workspace.      | *grafana-test*              |
    | --resource-group  | Choose a resource group for your Azure Managed Grafana workspace.       | *my-resource-group*         |
    | --zone-redundancy | Enter `enabled` to enable zone redundancy for this new workspace. | *--zone-redundancy enabled* |

    ```azurecli
    az grafana create --name <managed-grafana-resource-name> --resource-group <resource-group-name> --zone-redundancy enabled
    ```

When deployment is complete, the command output confirms that the workspace was created and provides more information about the deployment.

> [!NOTE]
> Azure Managed Grafana commands are part of the `amg` extension for Azure CLI version 2.30.0 or later. The extension installs automatically the first time you run an `az grafana` command.

---

## Check if zone redundancy is enabled

In the Azure portal, under **Settings**, go to **Configuration** and check if **Zone redundancy** is listed as enabled or disabled.

:::image type="content" source="media/zone-redundancy/configuration-status.png" alt-text="Screenshot of the Azure portal. Check zone redundancy.":::

## Next steps

> [!div class="nextstepaction"]
> [How to configure data sources](./how-to-data-source-plugins-managed-identity.md)