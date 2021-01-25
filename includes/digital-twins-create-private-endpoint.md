---
author: baanders
description: include file for creating a private endpoint in the Azure portal
ms.service: digital-twins
ms.topic: include
ms.date: 1/25/2021
ms.author: baanders
---

This will open a page to enter the details of a new private endpoint.

:::image type="content" source="../articles/digital-twins/media/how-to-route-managed-identities/create-private-endpoint.png" alt-text="Screenshot of the Azure portal showing the Create private endpoint page. It contains the fields described below.":::

1. Fill in the first section with selections for your **Subscription**, **Resource group**, and **Location**, as well as a **Name** for the endpoint. For **Target sub-resources**, select *API*.

1. Next, select the **Virtual network** and **Subnet** you'd like to use to deploy the endpoint.

1. Finally, select whether to **Integrate with private DNS zone**. For help with this option, you can also use the link in the portal to [learn more about private DNS integration](../private-link/private-endpoint-overview.md#dns-configuration).

After filling out the configuration options, Hit **OK** to finish.
