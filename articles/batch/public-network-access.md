---
title: Configure public network access with Azure Batch accounts
description: Learn how to configure public network access with Azure Batch accounts, for example enable, disable, or manage network rules for public network access.
ms.topic: how-to
ms.date: 05/26/2022
---

# Configure public network access with Azure Batch accounts

By default, [Azure Batch accounts](accounts.md) have public endpoints and are publicly accessible. This article shows how to configure your Batch account to allow access from only specific public IP addresses or IP address ranges.

IP network rules are configured on the public endpoints. IP network rules do not apply to private endpoints configured with [Private Link](private-connectivity.md).

Each endpoint supports a maximum of 200 IP network rules.

## Batch account public endpoints

Batch accounts have two public endpoints:

- **Account endpoint**: this is the endpoint for [Batch Service REST API](/rest/api/batchservice/) (data plane), for example managing pools, compute nodes, jobs, tasks, etc.
- **Node management endpoint**: used by Batch pool nodes to access Batch node management service. This is only applicable when using [simplified compute node communication](simplified-compute-node-communication.md).

You can check both endpoints in account properties when you query Batch account with [Batch Management REST API](/rest/api/batchmanagement/batch-account/get). You can also check them in **Overview** for Batch account in Azure Portal:

   :::image type="content" source="media/public-access/public-endpoints.png" alt-text="Batch account endpoints":::

You can configure public network access to Batch account endpoints with following options:

- **All networks**: allow public network access with no restriction.
- **Selected networks**: allow public network access with allowed network rules.
- **Disabled**: disable public network access, and private endpoints will be required to access Batch account enpoints.

## Access from selected public networks

1. In the portal, navigate to your Batch account.
1. Under **Settings**, select **Networking**.
1. On the **Public access** tab, select to allow public access from **Selected networks**.
1. Under access for each endpoint, enter a public IP address or address range in CIDR notation one by one.
1. Select **Save**.

   :::image type="content" source="media/public-access/public-endpoints.png" alt-text="Batch account endpoints":::

> [!NOTE]
> After adding a rule, it takes a few minutes for the rule to take effect.

> [!TIP]
> To configure IP network rules for node management endpoint, you will need to know the public IP addresses or address ranges used by Batch pool's internet outbound access. This can typically be determined with Batch pools created in [virtual network](batch-virtual-network.md) or with [specified public IP addresses](create-pool-public-ip.md).

## Disable public network access

Optionally, disable public public network access to Batch account endpoints. Disabling the public network access overrides all IP network rules configurations. For example, you might want to disable public access to a Batch account secured in a virtual network using [Private Link](private-connectivity.md).

1. In the portal, navigate to your Batch account and select **Settings > Networking**.
1. On the **Public access** tab, select **Disabled**.
1. Select **Save**.

## Restore public network access

To re-enable the public network access, update the networking settings to allow public access. Enabling the public access overrides all IP network rule configurations, and will allow access from any IP addresses.

1. In the portal, navigate to your Batch account and select **Settings > Networking**.
1. On the **Public access** tab, select **All networks**.
1. Select **Save**.

## Next steps

- Learn how to [use private endpoints with Batch accounts](private-connectivity.md).
- Learn how to [use simplified compute node communication](simplified-compute-node-communication.md).
- Learn more about [creating pools in a virtual network](batch-virtual-network.md).
