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

## Enable deterministic outbound IPs

API keys are disabled by default in Azure Managed Grafana. There are two ways you can enable API keys:

- During the creation of the Azure Managed Grafana workspace, enable **Deterministic outbound IP** in the **Advanced** tab.
- In your Managed Grafana workspace, on the Azure platform, under **Settings** select **Configuration**, and then under **Deterministic outbound IP**, select **Enable**.

    :::image type="content" source="media/deterministic-ips/enable-deterministic-IP-support.png" alt-text="Screenshot of the Azure platform. Enable deterministic IPs.":::

On the **Configuration** page, Azure Managed Grafana lists two outbound static IP addresses assigned to your instance.

## Next steps

> [!div class="nextstepaction"]
> [Call Grafana APIs](how-to-api-calls.md)
