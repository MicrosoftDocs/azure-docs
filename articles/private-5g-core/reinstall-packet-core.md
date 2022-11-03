---
title: Reinstall a packet core instance
titleSuffix: Azure Private 5G Core Preview
description: In this how-to guide, you'll learn how to reinstall a packet core instance using the Azure portal. 
author: b-branco
ms.author: biancabranco
ms.service: private-5g-core
ms.topic: how-to
ms.date: 11/03/2022
ms.custom: template-how-to
---

# Reinstall the packet core instance in a site - Azure portal

Each Azure Private 5G Core Preview site contains a packet core instance, which is a cloud-native implementation of the 3GPP standards-defined 5G Next Generation Core (5G NGC or 5GC).

If you're experiencing issues with your deployment, reinstalling packet core may help return it to a good state. In this how-to guide, you'll learn how to reinstall a packet core instance using the Azure portal.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.

## Reinstall the packet core instance

To reinstall your packet core instance:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

3. In the **Resource** menu, select **Sites**.
4. Select the site containing the packet core instance you're interested in.
5. Under the **Network function** heading, select the name of the **Packet Core Control Plane** resource shown next to **Packet Core**.

    :::image type="content" source="media/upgrade-packet-core-azure-portal/packet-core-field.png" alt-text="Screenshot of the Azure portal showing the Packet Core field.":::

6. Select **Reinstall packet core**.

<!-- TODO: add image
    :::image type="content" source="media/upgrade-packet-core-azure-portal/upgrade-version.png" alt-text="Screenshot of the Azure portal showing the Reinstall packet core option."::: -->

7. In the **Confirm reinstall** field, type *Yes*.

<!-- TODO: add image
    :::image type="content" source="media/upgrade-packet-core-azure-portal/upgrade-packet-core-version.png" alt-text="Screenshot of the Azure portal showing the Reinstall packet core screen."::: -->

8. Select **Reinstall**.
9. Azure will now uninstall and reinstall the packet core instance. The Azure portal will display the following confirmation screen when this deployment is complete.

    :::image type="content" source="media/site-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of a packet core instance.":::

## Next steps

You may want to use Log Analytics or the packet core dashboards to confirm your packet core instance is operating normally after the reinstallation.

- [Monitor Azure Private 5G Core with Log Analytics](monitor-private-5g-core-with-log-analytics.md)
- [Packet core dashboards](packet-core-dashboards.md)
