---
title: Upgrade a packet core instance
titleSuffix: Azure Private 5G Core Preview
description: In this how-to guide, you'll learn how to upgrade a packet core instance using the Azure portal. 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 04/27/2022
ms.custom: template-how-to
---

# Upgrade the packet core instance in a site - Azure portal

Each Azure Private 5G Core Preview site contains a packet core instance, which is a cloud-native implementation of the 3GPP standards-defined 5G Next Generation Core (5G NGC or 5GC). You'll need to periodically upgrade your packet core instances to get access to the latest Azure Private 5G Core features and maintain support for your private mobile network. In this how-to guide, you'll learn how to upgrade a packet core instance using the Azure portal.

## Prerequisites

- Contact your Microsoft assigned trials engineer. They'll guide you through the upgrade process and provide you with the required information, including the amount of time you'll need to allow for the upgrade to complete.
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.

## View the current packet core version

To check which version your packet core instance is currently running, and whether there is a newer version available:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the **Resource** menu, select **Sites**.
1. Select the site containing the packet core instance you're interested in.
1. Under the **Network function** heading, select the name of the **Packet Core Control Plane** resource shown next to **Packet Core**.

    :::image type="content" source="media/upgrade-packet-core-azure-portal/packet-core-field.png" alt-text="Screenshot of the Azure portal showing the Packet Core field.":::

1. Check the **Version** field under the **Configuration** heading to view the current software version. If there's an attention icon next to this field, a new packet core version is available. If there's a warning that you're running an unsupported version, we advise that you upgrade your packet core instance to a version that Microsoft currently supports.

    :::image type="content" source="media/upgrade-packet-core-azure-portal/packet-core-control-plane-overview.png" alt-text="Screenshot of the Azure portal showing the Packet Core Control Plane resource overview." lightbox="media/upgrade-packet-core-azure-portal/packet-core-control-plane-overview.png":::

## Upgrade the packet core instance

1. If you haven't already, navigate to the **Packet Core Control Plane** resource that you're interested in upgrading.
1. Select **Upgrade version**.

    :::image type="content" source="media/upgrade-packet-core-azure-portal/upgrade-version.png" alt-text="Screenshot of the Azure portal showing the Upgrade version option.":::

1. From the **New version** dropdown list, select the recommended packet core version.
    > [!IMPORTANT]
    > You can upgrade or downgrade to any version of packet core. However, distributed tracing and packet core data might be lost when you move in or out of unsupported packet core versions.

    :::image type="content" source="media/upgrade-packet-core-azure-portal/upgrade-packet-core-version.png" alt-text="Screenshot of the Azure portal showing the New version field on the Upgrade packet core version screen.":::

1. Select **Modify**.
1. Azure will now redeploy the packet core instance at the new software version. The Azure portal will display the following confirmation screen when this deployment is complete.

    :::image type="content" source="media/site-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of a packet core instance.":::

1. Select **Go to resource group**, and then select the **Packet Core Control Plane** resource representing the control plane function of the packet core instance in the site.
1. Check the **Version** field under the **Configuration** heading to confirm that it displays the new software version. 

## Next steps

You may want to use Log Analytics or the packet core dashboards to confirm your packet core instance is operating normally after the upgrade.

- [Monitor Azure Private 5G Core with Log Analytics](monitor-private-5g-core-with-log-analytics.md)
- [Packet core dashboards](packet-core-dashboards.md)
