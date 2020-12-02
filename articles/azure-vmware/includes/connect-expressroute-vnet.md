---
title: Connect ExpressRoute to the virtual network gateway
description: Steps to connect ExpressRoute to the virtual network gateway.
ms.topic: include
ms.date: 09/28/2020
---

<!-- Used in deploy-azure-vmware-solution.md and tutorial-configure-networking.md -->

1. Navigate to the private cloud you created in the previous tutorial and select **Connectivity** under **Manage**, select the **ExpressRoute** tab.

1. Copy the authorization key. If there isn't an authorization key, you need to create one, select **+ Request an authorization key**.

   :::image type="content" source="../media/expressroute-global-reach/start-request-auth-key.png" alt-text="Copy the authorization key. If there isn't an authorization key, you need to create one, select + Request an authorization key." border="true" lightbox="../media/expressroute-global-reach/start-request-auth-key.png":::

1. Navigate to the Virtual Network Gateway you created
in the previous step and under **Settings**, select **Connections**. On the **Connections** page, select **+ Add**.

1. On the **Add connection** page, provide values for the fields, and select **OK**. 

   | Field | Value |
   | --- | --- |
   | **Name**  | Enter a name for the connection.  |
   | **Connection type**  | Select **ExpressRoute**.  |
   | **Redeem authorization**  | Ensure this box is selected.  |
   | **Virtual network gateway** | The Virtual Network gateway you created previously.  |
   | **Authorization key**  | Copy and paste the authorization key from the ExpressRoute tab for your Resource Group. |
   | **Peer circuit URI**  | Copy and paste the ExpressRoute ID from the ExpressRoute tab for your Resource Group.  |

   :::image type="content" source="../media/expressroute-global-reach/open-cloud-shell.png" alt-text="On the Add connection page, provide values for the fields, and select OK." border="true" lightbox="../media/expressroute-global-reach/open-cloud-shell.png":::

The connection between your ExpressRoute circuit and your Virtual Network is created.