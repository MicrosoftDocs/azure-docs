---
title: Set up networking in Azure Modeling and Simulation Workbench
description: In this how-to guide, you learn how to set up networking for a Modeling and Simulation Workbench connector.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 01/01/2023
# Customer intent: As a Modeling and Simulation Workbench Owner, I want to set up networking for chamber access.
---

# Set up networking in Azure Modeling and Simulation Workbench

The Workbench allows users to customize networking to meet their security and business requirements. Users can connect to the workbench using allowlisted Public IP addresses or VPN/Express Route. Each chamber has a dedicated connector. Each connector can support either of the above-mentioned protocols to establish network access between an onboarding customer's on-premises or cloud environment and the workbench.

## VPN or Azure Express Route

If your organization has set up an Azure network to oversee user access to the workbench, you can enforce stringent controls over the VNet and Subnet addresses employed to establish connections to the chamber. When you create the connector, the Workbench Owner (Subscription Owner) can link a virtual network with a VPN gateway and/or Express Route gateway.  This link ensures a secure connection between your on-premises network and the chamber.

### Add VPN/Express Route connection

1. Before you create a [connector](./concept-connector.md) for Private IP networking via VPN or Azure Express Route, perform this role assignment. The Azure Modeling and Simulation Workbench needs **Network Contributor** role set for the resource group in which you are hosting your virtual network connected with ExpressRoute or VPN.

   | Setting          | Value                                   |
   | :--------------- | :-------------------------------------- |
   | Role             | **Network Contributor**                 |
   | Assign access to | User, group, or service principal       |
   | Members          | Azure Modeling and Simulation Workbench |

1. When you create your connector, specify **VPN** or **Express Route** as your method to connect to on-premises network.

1. A list of available vNet subnets within your subscription are shown. Select a non gateway subnet within the same virtual network with the gateway subnet for VPN gateway or Express Route gateway.

## Allowlisted Public IP addresses

For organizations that don't have an Azure network setup or prefer to onboard with Public IP, the Azure portal allows IP addresses to be allowlisted to connect into the chamber.  To use this connectivity method, you need to specify at least one IP address for the connector object when you initially create the workbench. Workbench Owners and Chamber Admins can add to and edit the allowlisted Public addresses for a connector after the connector object is initially created.

### Edit Public IP addresses

To edit the allowed IP addresses list:

1. Go to the **Networking** blade for the connector object in the Azure portal.
1. Select **Edit allowed IP**. From here, you can delete existing IP addresses or add new ones.
1. Select **Submit** to save your changes.
1. Once submitted, refresh the view for connector networking and see your changes reflected.

   :::image type="content" source="./media/resources-troubleshoot/chamber-connector-networking-network-allowlist.png" alt-text="Screenshot of the Azure portal in a web browser, showing the chamber connector networking allowlist.":::

## Add redirect URIs for the application in Azure Active Directory

A *redirect URI* is the location where the Microsoft identity platform redirects a user's client and sends security tokens after authentication. Each time you create a new connector, you need to register the *redirect URIs* for your application registration in Azure Active Directory.

Follow these steps to get redirect URIs:

1. On the page for your new Modeling and Simulation Workbench workbench, select the left side menu **Connector**. Then select the connector shown from the right side resource list.

1. On the **Overview** page, locate and document the two connector properties, **Dashboard reply URL** and **Authentication reply URL**, using the copy to clipboard icon. If these properties aren't visible, select the **See More** button on page to expand the window.
   - **Dashboard reply URL**: For example, https://<*dashboardFqdn*>/etx/oauth2/code
   - **Authentication reply URL**: For example, https://<*authenticationFqdn*>/otdsws/login?authhandler=AzureOIDC

   :::image type="content" source="./media/quickstart-create-portal/update-aad-app-01.png" alt-text="Screenshot of the connector overview page showing where you select the reply URLs.":::

Follow these steps to add redirect URIs:

1. In the Azure portal, in **Azure Active Directory** > **App registrations**, select the application you created in your Azure Active Directory.

1. Under **Manage**, select **Authentication**.

1. Under **Platform configurations**, select **Add a platform**.

1. Under **Configure platforms**, select **Web** tile.

1. On the **Configure Web** pane, paste the **Dashboard reply URL** you documented in the previous step. Then select **Configure**.

1. Under **Platform configurations** > **Web** > **Redirect URIs**, select **Add URI**.

1. Paste the **Authentication reply URL** you documented in the previous step. Then select **Save**.

   :::image type="content" source="./media/quickstart-create-portal/update-aad-app-02.png" alt-text="Screenshot of the Azure AD app Authentication page showing where you select the Redirect URIs.":::

## Next steps

To learn how to import data into an Azure Modeling and Simulation Workbench chamber, check out [Import data.](./how-to-guide-upload-data.md)
