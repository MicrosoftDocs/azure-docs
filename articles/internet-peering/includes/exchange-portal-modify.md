---
title: include file
titleSuffix: Azure
description: include file
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: include
ms.date: 11/27/2019
ms.author: prmitiki
---

This section describes how to perform the following modification operations for Direct peering:

### Add Exchange peering connections

1. Click on the **+ Add connections** button on the top and configure a new peering connection.
    > [!div class="mx-imgBorder"]
    > ![Peering resource view](../media/setup-exchange-modify-addconnection.png)
1. Fill out the **Exchange peering Connection** form and click **Save**. For help with configuring a peering connection review the steps under "Create and provision a Direct peering" section above.
    > [!div class="mx-imgBorder"]
    > ![Peering resource view](../media/setup-exchange-modify-savenewconnection.png)

### Remove Exchange peering connections

1. Click on a peering connection you want to delete and then, click on the **...** > **Delete connection** button.
    > [!div class="mx-imgBorder"]
    > ![Peering Connection Delete](../media/setup-exchange-modify-deleteconnection.png)
1. Enter the resource ID into the **Confirm Delete** box as shown in the highlighted boxes and click **Delete**.
    > [!div class="mx-imgBorder"]
    > ![Peering Connection DeleteConfirm](../media/setup-exchange-modify-deleteconnectionconfirm.png)

### Add IPv4/IPv6 session on Active connections

1. Click on a peering connection you want to modify and then, click on the **...** > **Edit connection** button.
    > [!div class="mx-imgBorder"]
    > ![Peering Connection Edit](../media/setup-exchange-modify-editconnection.png)
1. Add **IPv4 address** or **IPv6 address** info and click **Save**.
    > [!div class="mx-imgBorder"]
    > ![Peering Connection Modify](../media/setup-exchange-modify-editconnectionsettings.png)

### Remove IPv4/IPv6 session on Active connections

Removing an IPv4/IPv6 session from an existing connection is not currently supported on portal. Contact [Microsoft peering](mailto:peeringexperience@microsoft.com).