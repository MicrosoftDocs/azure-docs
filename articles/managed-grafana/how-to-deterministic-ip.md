---
title: How to set up and use deterministic outbound IPs
titleSuffix: Azure Managed Grafana
description: Learn how to activate deterministic outbound IP support used by Azure Managed Grafana to communicate with data sources.
ms.service: azure-managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 08/28/2026
ms.custom: sfi-image-nochange
--- 

# Use deterministic outbound IPs

In this guide, learn how to activate deterministic outbound IP support for communication between Azure Managed Grafana and data sources. You also configure a data source firewall to allow requests from your Grafana workspace.

> [!NOTE]
> The deterministic outbound IPs feature is only accessible for customers with a Standard plan. For more information about plans, go to [pricing plans](overview.md#service-tiers).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A data source. For example, an [Azure Data Explorer database](/azure/data-explorer/create-cluster-database-portal).

## Enable deterministic outbound IPs

Deterministic outbound IP support is disabled by default in Azure Managed Grafana. You can enable this feature during the creation of the workspace, or you can activate it on an existing workspace.

### Create an Azure Managed Grafana workspace with deterministic outbound IPs enabled

#### [Portal](#tab/portal)

When creating a workspace, select the **Standard** pricing plan and then in the **Advanced** tab, set **Deterministic outbound IP** to **Enable**.

For more information about creating a new workspace, go to [Quickstart: Create an Azure Managed Grafana workspace](quickstart-managed-grafana-portal.md).

#### [Azure CLI](#tab/azure-cli)

Run the [az grafana create](/cli/azure/grafana#az-grafana-create) command to create an Azure Managed Grafana workspace with deterministic outbound IPs enabled. Replace `<azure-managed-grafana-name>` and `<resource-group>` with the name of the new Azure Managed Grafana workspace and a resource group.

```azurecli
az grafana create --name <azure-managed-grafana-name> --resource-group <resource-group> --deterministic-outbound-ip Enabled
```

---

### Activate deterministic outbound IPs on an existing Azure Managed Grafana workspace

#### [Portal](#tab/portal)

  1. In the Azure portal, under **Settings** select **Configuration**, and then under **General settings** > **Deterministic outbound IP**, select **Enable**.

      :::image type="content" source="media/deterministic-ips/enable-deterministic-ip-addresses.png" alt-text="Screenshot of the Azure platform. Enable deterministic IPs.":::
  1. Select **Save** to confirm the activation of deterministic outbound IP addresses.
  1. Select **Refresh** to display the list of IP addresses under **Static IP address**.

#### [Azure CLI](#tab/azure-cli)

Run the [az grafana update](/cli/azure/grafana#az-grafana-update) command to update your Azure Managed Grafana workspace and enable deterministic outbound IPs. Replace `<azure-managed-grafana-name>` with the name of your Azure Managed Grafana workspace.

```azurecli
az grafana update --name <azure-managed-grafana-name> --deterministic-outbound-ip Enabled
```

The deterministic outbound IPs are listed under `outboundIPs` in the output of the Azure CLI.

---

## Disable public access to a data source and allow Azure Managed Grafana IP addresses

This example demonstrates how to disable public access to Azure Data Explorer and set up private endpoints. This process is similar for other Azure data sources.

1. Open an Azure Data Explorer cluster in the Azure portal, and under **Settings**, select **Networking**.
1. In the **Public Access** tab, select **Disabled** to disable public access to the data source.

   :::image type="content" source="media/deterministic-ips/add-ip-data-source-firewall.png" alt-text="Screenshot of the Azure platform. Add Disable public network access.":::

1. Under **Firewall**, select **Add your client IP address**, and under **Address range**, enter the IP addresses found in your Azure Managed Grafana workspace.
1. Select **Save** to finish adding the Azure Managed Grafana outbound IP addresses to the allow list.

You have limited access to your data source by disabling public access, activating a firewall and allowing access from Azure Managed Grafana IP addresses.

## Check access to the data source

Check if the Azure Managed Grafana endpoint can still access your data source.

### [Portal](#tab/portal)

1. In the Azure portal, go to your workspace's **Overview** page and select the **Endpoint** URL.

1. Go to **Connections** > **Data sources**, select your Azure Data Explorer data source, and then select **Save & test** at the bottom of the **Settings** page:
   - If the message "Success" is displayed, Azure Managed Grafana can access your data source.
   - If the following error message is displayed, Azure Managed Grafana can't access the data source: `Post "https://<Azure-Data-Explorer-URI>/v1/rest/query": dial tcp ...: i/o timeout`. Make sure that you've entered the IP addresses correctly in the data source firewall allow list.

### [Azure CLI](#tab/azure-cli)

Run the [az grafana data-source query](/cli/azure/grafana/data-source#az-grafana-data-source-query) command to query the data source. Replace `<azure-managed-grafana-name>` and `<data-source-name>` with the name of your Azure Managed Grafana workspace and the name of your data source.

```azurecli
az grafana data-source query --name <azure-managed-grafana-name> --data-source <data-source-name> --output table
```

If the following error message is displayed, Azure Managed Grafana can't access the data source: `"error": "Post \\"https://<Azure-Data-Explorer-URI>/v1/rest/query\\": dial tcp <ip-address>:443: i/o timeout"`. Ensure that you enter the IP addresses correctly in the data source firewall allow list.

> [!TIP]
> Get the names of your data sources by running `az grafana data-source list --name <azure-managed-grafana-workspace-name> --output table`.

---

## Next steps

> [!div class="nextstepaction"]
> [Set up private access](how-to-set-up-private-access.md)
