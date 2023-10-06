---
title: How to set up and use deterministic outbound APIs in Azure Managed Grafana
description: Learn how to set up and use deterministic outbound APIs in Azure Managed Grafana
ms.service: managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 03/23/2022
--- 

# Use deterministic outbound IPs

In this guide, learn how to activate deterministic outbound IP support used by Azure Managed Grafana to communicate with data sources, disable public access and set up a firewall rule to allow inbound requests from your Grafana instance.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- A data source. For example, an [Azure Data Explorer database](/azure/data-explorer/create-cluster-database-portal).

## Enable deterministic outbound IPs

Deterministic outbound IP support is disabled by default in Azure Managed Grafana. You can enable this feature during the creation of the instance, or you can activate it on an existing instance.

### Create an Azure Managed Grafana workspace with deterministic outbound IPs enabled

#### [Portal](#tab/portal)

When creating an instance, in the **Advanced** tab, set **Deterministic outbound IP** to **Enable**. 

For more information about creating a new instance, go to [Quickstart: Create an Azure Managed Grafana instance](quickstart-managed-grafana-portal.md).

#### [Azure CLI](#tab/azure-cli)

Run the [az grafana create](/cli/azure/grafana#az-grafana-create) command to create an Azure Managed Grafana instance with deterministic outbound IPs enabled. Replace `<azure-managed-grafana-name>` and `<resource-group>` with the name of the new Azure Managed Grafana instance and a resource group.

```azurecli
az grafana create --name <azure-managed-grafana-name> --resource-group <resource-group> --deterministic-outbound-ip Enabled
```

---

### Activate deterministic outbound IPs on an existing Azure Managed Grafana instance

#### [Portal](#tab/portal)

  1. In the Azure portal, under **Settings** select **Configuration**, and then under **General settings** > **Deterministic outbound IP**, select **Enable**.

      :::image type="content" source="media/deterministic-ips/enable-deterministic-ip-addresses.png" alt-text="Screenshot of the Azure platform. Enable deterministic IPs.":::
  1. Select **Save** to confirm the activation of deterministic outbound IP addresses.
  1. Select **Refresh** to display the list of IP addresses under **Static IP address**.

#### [Azure CLI](#tab/azure-cli)

Run the [az grafana update](/cli/azure/grafana#az-grafana-update) command to update your Azure Managed Grafana instance and enable deterministic outbound IPs. Replace `<azure-managed-grafana-name>` with the name of your Azure Managed Grafana instance.

```azurecli
az grafana update --name <azure-managed-grafana-name> --deterministic-outbound-ip Enabled
```

The deterministic outbound IPs are listed under `outboundIPs` in the output of the Azure CLI.

---

## Disable public access to a data source and allow Azure Managed Grafana IP addresses

This example demonstrates how to disable public access to Azure Data Explorer and set up private endpoints. This process is similar for other Azure data sources.

1. Open an Azure Data Explorer Cluster instance in the Azure portal, and under **Settings**, select **Networking**.
1. In the **Public Access** tab, select **Disabled** to disable public access to the data source.
1. Under **Firewall**, check the box  **Add your client IP address ('88.126.99.17')** and under **Address range**, enter the IP addresses found in your Azure Managed Grafana workspace.
1. Select **Save** to finish adding the Azure Managed Grafana outbound IP addresses to the allowlist.

    :::image type="content" source="media/deterministic-ips/add-ip-data-source-firewall.png" alt-text="Screenshot of the Azure platform. Add Azure Managed Grafana outbound IPs to datasource firewall allowlist.":::

You have limited access to your data source by disabling public access, activating a firewall and allowing access from Azure Managed Grafana IP addresses.

## Check access to the data source

Check if the Azure Managed Grafana endpoint can still access your data source.

### [Portal](#tab/portal)

1. In the Azure portal, go to your instance's **Overview** page and select the **Endpoint** URL.

1. Go to **Configuration > Data Source > Azure Data Explorer Datasource > Settings** and at the bottom of the page, select **Save & test**:
   - If the message "Success" is displayed, Azure Managed Grafana can access your data source.
   - If the following error message is displayed, Azure Managed Grafana can't access the data source: `Post "https://<Azure-Data-Explorer-URI>/v1/rest/query": dial tcp 13.90.24.175:443: i/o timeout`. Make sure that you've entered the IP addresses correctly in the data source firewall allowlist.

### [Azure CLI](#tab/azure-cli)

Run the [az grafana data-source query](/cli/azure/grafana/data-source#az-grafana-data-source-query) command to query the data source. Replace `<azure-managed-grafana-name>` and `<data-source-name>` with the name of your Azure Managed Grafana instance and the name of your data source.

```azurecli
az grafana data-source query --name <azure-managed-grafana-name> --data-source <data-source-name> --output table
```

If the following error message is displayed, Azure Managed Grafana can't access the data source: `"error": "Post \\"https://<Azure-Data-Explorer-URI>/v1/rest/query\\": dial tcp 13.90.24.175:443: i/o timeout"`. Make sure that you've entered the IP addresses correctly in the data source firewall allowlist.

> [!TIP]
> You can get the name of your data sources by running `az grafana data-source list --name <azure-managed-grafana-instance-name> --output table` 

---

## Next steps

> [!div class="nextstepaction"]
> [Set up private access](how-to-set-up-private-access.md)
