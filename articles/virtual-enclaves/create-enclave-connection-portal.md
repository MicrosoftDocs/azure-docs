---
title: Create an enclave connection from the Azure portal
description: Create an enclave connection from the Azure portal.
author: jadean-msft
ms.author: jadean
ai-usage: ai-assisted
ms.topic: how-to
ms.date: 06/16/2026
---

# Create an enclave connection from the Azure portal

Enclave connections enable network traffic to flow into, out of, and between Azure Enclave communities and enclaves. In this how-to guide, you create an enclave connection in the Azure portal.

## Prerequisites

- An Azure subscription. If needed, create a [free Azure account](https://azure.microsoft.com/free/).
- A [community](./create-community-portal.md) and an [enclave](./create-enclave-portal.md).
- An existing [enclave endpoint](./what-enclave-endpoint.md) or [community endpoint](./what-community-endpoint.md) in the same community.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create an enclave connection

1. Enter `Azure Enclave` in the search.

2. Under `Services`, select `Azure Enclave`.

3. In the `Azure Enclave` page, select `Enclaves` in the left menu.

4. On the `Enclaves` page, select your Enclave's name to open the enclave resource.

5. Select `Enclave Connections` on the left navigation and then select `Create`.

    ![Screenshot showing the highlighted create button for enclave connections.](./media/tutorial-step-five-fabrikam-connection-create.png)

6. Enter the following information:
   - `Enclave connection name`: Enter a name for the enclave connection.
   - `Community`: Select the existing community from the list.

## Configure an enclave source connection

If the connection source is `Transit Hub`, skip this section.

For connections where the source is `Enclave`, enter the required information:

1. Under `Source Type`, select `Enclave`.

2. Select the existing `Source Enclave` from the list.

3. Enter the `Source IP addresses/CIDR range(s)` for the enclave subnets that initiate traffic.

4. Under `Destination Endpoint Type`, select `Enclave Endpoint` or `Community Endpoint`.

5. Select the `Destination Endpoint` from the list.

    ![Screenshot showing enclave creation page with Enclave source selected.](./media/create-enclave-connection-tab-1-basics-enclave-source.png)

## Configure a transit hub source connection

If the connection source is `Enclave`, skip this section.

For connections where the source is `Transit Hub`, enter the required information:

1. Under `Source Type`, select `Transit Hub`.

2. Select the `Source transit hub` from the list.

3. Enter the `Source IP addresses/CIDR range(s)` for this connection.

4. Select the `Destination endpoint` from the list.

    ![Screenshot showing enclave creation page with transit hub source selected.](./media/create-enclave-connection-tab-1-basics-transit-hub-source.png)

5. Select `Review + create`, and then select `Create`.
