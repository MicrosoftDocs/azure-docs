---
title: How to set up networking for a Modeling and Simulation Workbench chamber
description: In this how-to guide, you learn how to set up networking for a Modeling and Simulation Workbench connector.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 01/01/2023
# Customer intent: As a Modeling and Simulation Workbench Owner, I want to set up networking for chamber access.
---

# How to set up networking for a Modeling and Simulation Workbench chamber

The Workbench allows users to customize networking to meet their security and business requirements. Users can connect to the workbench using allowlisted Public IP addresses or VPN/Express Route. Each chamber has a dedicated connector, which can support either of the above-mentioned protocols to establish network access between an onboarding customer's on-premises or cloud environment and the workbench.

## VPN or Azure Express Route

If your organization has set up an Azure network to oversee user access to the workbench, you can enforce stringent controls over the VNet and Subnet addresses employed to establish connections to the chamber. When you're creating the connector, the Workbench Owner (Subscription Owner) has the capability to link a virtual network with a VPN gateway and/or ExpressRoute gateway, ensuring a secure connection between your on-premises network and the chamber.

Before you create a [connector](./concept-connector.md) for Private IP networking via VPN or Azure Express Route, perform this role assignment. The Azure Modeling and Simulation Workbench needs **Network Contributor** role set for the resource group in which you wish to deploy the Workbench.

   | Setting          | Value                                   |
   | :--------------- | :-------------------------------------- |
   | Role             | **Network Contributor**                 |
   | Assign access to | User, group, or service principal       |
   | Members          | Azure Modeling and Simulation Workbench |

When you create your connector, specify **VPN** or **Express Route** as your method to connect to on-premises network. A list of available vNet subnets within your subscription are shown. Select a non gateway subnet within the same virtual network with the gateway subnet for VPN gateway or ExpressRoute gateway.

## Allowlisted Public IP addresses

For organizations that don't have an Azure network setup or prefer to onboard to with Public IP – the Azure portal allows IP addresses to be allowlisted, which enables provisioned users to connect into the chamber via that protocol. At the time of initial workbench creation, at least one IP address needs to be specified for the connector object if Public IP is the chosen chamber connectivity method for incoming users. The connector object also allows the allowed IP list to be appended/edited dynamically after the connector object is initially created. Workbench Owners or Chamber Admins can edit the allowlisted Public IP addresses for a connector.

### Edit Public IP addresses

To edit the allowed IP addresses list, go to the **Networking** blade for the connector object in the Azure portal. Click on **Edit allowed IP**. From here, you can delete existing IP addresses or add new ones. Make sure to click **Submit** to save your changes. Once submitted, refresh the view for connector networking and see your changes reflected.

   :::image type="content" source="./media/howtoguide-troubleshooting/chamber-connector-networking-network-allowlist.png" alt-text="Screenshot of the Azure portal in a web browser, showing the chamber connector networking allowlist.":::

## Next steps

To learn how to import data into an Azure Modeling and Simulation Workbench chamber, check [How to Import Data](./how-to-guide-upload-data.md)
