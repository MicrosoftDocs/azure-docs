---
title: How to set up and use deterministic outbound APIs in Azure Managed Grafana
description: Learn how to set up and use deterministic outbound APIs in Azure Managed Grafana
ms.service: managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 08/24/2022
--- 

# Use deterministic outbound IPs

In this guide, learn how to activate deterministic outbound IP support used by Azure Managed Grafana to communicate with its data sources, and set up a firewall rule to allow inbound requests from your Grafana instance.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance with the deterministic outbound IP option set to enabled. If you don't have one yet, [create an Azure Managed Grafana instance](./quickstart-managed-grafana-portal.md).
- A data source. For example, an [Azure Data Explorer database](/azure/data-explorer/create-cluster-database-portal).

## Enable deterministic outbound IPs

API keys are disabled by default in Azure Managed Grafana. There are two ways you can enable API keys:

- During the creation of the Azure Managed Grafana workspace, enable **Deterministic outbound IP** in the **Advanced** tab.
- In your Managed Grafana workspace.

    ### [Portal](#tab/portal)

    In the Azure portal, under **Settings** select **Configuration**, and then under **Deterministic outbound IP**, select **Enable**.

    :::image type="content" source="media/deterministic-ips/enable-deterministic-IP-support.png" alt-text="Screenshot of the Azure platform. Enable deterministic IPs.":::

    #### [Azure CLI](#tab/azcli)

    Run the [az grafana update](/cli/azure/grafana?view=azure-cli-latest) command to update your Azure Managed Grafana instance and enable deterministic outbound IPs.

    ```azurecli-interactive
    az grafana update --name --deterministic-outbound-ip Enabled
    ```

    ---

On the **Configuration** page, Azure Managed Grafana lists two outbound static IP addresses assigned to your instance.

## Disable public access to a data source and allow Azure Managed Grafana IP addresses

This example demonstrates how to disable public access to Azure Data Explorer and set up private endpoints. This process is similar for other Azure data sources.

### [Portal](#tab/azure-portal)

1. Open an Azure Data Explorer Cluster instance in the Azure portal, and under **Settings**, select **Networking**.
1. In the **Public Access** tab, select **Disabled** to disable public access to the data source.
1. Under **Firewall**, check the box  **Add your client IP address ('88.126.99.17')** and under **Address range**, enter the IP addresses found in your Azure Managed Grafana workspace.
1. Select **Save** to finish adding the Azure Managed Grafana outbound IP addresses to the allowlist.

    :::image type="content" source="media/deterministic-ips/add-IPs-data-source-firewall.png" alt-text="Screenshot of the Azure platform. Add Azure Managed Grafana outbound IPs to datasource firewall allowlist.":::

You have limited access to your data source by disabling public access, activating a firewall and allowing access from Azure Managed Grafana IP addresses.

## Check access to the data source

Check if your Azure Managed Grafana endpoint can still access your data source by going to your Grafana endpoint, then **Configuration > Data Source > Azure Data Explorer Datasource > Settings**. At the bottom of the page, select **Save & test**:

- If the message "Success" is displayed, Azure Managed Grafana can access your data source.
- If the following error messages are displayed: "Error updating Azure Data Explorer schema" and "Post "https://<Azure-Data-Explorer URI>/v1/rest/query": dial tcp 13.90.24.175:443: i/o timeout", Grafana cannot access the data source. Make sure that you have entered the IP addresses correctly in the data source firewall allowlist.

## Next steps

> [!div class="nextstepaction"]
> [Call Grafana APIs](how-to-api-calls.md)
