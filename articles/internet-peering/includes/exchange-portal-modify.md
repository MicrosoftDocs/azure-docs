---
title: include file
titleSuffix: Azure
description: include file
services: internet-peering
author: halkazwini
ms.service: internet-peering
ms.topic: include
ms.date: 11/27/2019
ms.author: halkazwini
---

This section describes how to perform the following modification operations for Direct peering.

### Add Exchange peering connections

1. Select the **+ Add connections** button, and configure a new peering connection.
    > [!div class="mx-imgBorder"]
    > ![Peering resource view](../media/setup-exchange-modify-addconnection.png)
1. Fill out the **Exchange peering Connection** form, and select **Save**. For help with configuring a peering connection, review the steps in the "Create and provision a Direct peering" section.
    > [!div class="mx-imgBorder"]
    > ![Exchange Peering Connection form](../media/setup-exchange-modify-savenewconnection.png)

### Remove Exchange peering connections

1. Select a peering connection you want to delete, and then select **...** > **Delete connection**.
    > [!div class="mx-imgBorder"]
    > ![Delete connection button](../media/setup-exchange-modify-deleteconnection.png)
1. Enter the resource ID in the **Confirm Delete** box, and select **Delete**.
    > [!div class="mx-imgBorder"]
    > ![Delete confirmation](../media/setup-exchange-modify-deleteconnectionconfirm.png)

### Add an IPv4 or IPv6 session on Active connections

1. Select a peering connection you want to modify, and then select **...** > **Edit connection**.
    > [!div class="mx-imgBorder"]
    > ![Edit connection button](../media/setup-exchange-modify-editconnection.png)
1. Add **IPv4 address** or **IPv6 address** information, and select **Save**.
    > [!div class="mx-imgBorder"]
    > ![Peering connection modifications](../media/setup-exchange-modify-editconnectionsettings.png)

### Remove an IPv4 or IPv6 session on Active connections

Removing an IPv4 or IPv6 session from an existing connection isn't currently supported on the portal. For more information, contact [Microsoft peering](mailto:peeringexperience@microsoft.com).