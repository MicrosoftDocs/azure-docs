---
title: Modify a packet core instance
titleSuffix: Azure Private 5G Core Preview
description: In this how-to guide, you'll learn how to modify a packet core instance using the Azure portal. 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 09/26/2022
ms.custom: template-how-to
---

# Modify the packet core instance in a site

Each Azure Private 5G Core Preview site contains a packet core instance, which is a cloud-native implementation of the 3GPP standards-defined 5G Next Generation Core (5G NGC or 5GC). In this how-to guide, you'll learn how to modify a packet core instance configuration using the Azure portal. You'll also learn how to attach and detach data networks associated with the packet core instance.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.

## View the packet core instance

To view the site's packet core instance:

1. Sign in to the Azure portal at [https://aka.ms/AP5GCNewPortal](https://aka.ms/AP5GCNewPortal).
1. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the **Resource** menu, select **Sites**.
1. Select the site containing the packet core instance you want to modify.
1. Under the **Network function** heading, select the name of the **Packet Core Control Plane** resource shown next to **Packet Core**.

    :::image type="content" source="media/packet-core-field.png" alt-text="Screenshot of the Azure portal showing the Packet Core field.":::

## Modify the packet core configuration

1. If you haven't already, navigate to the **Packet Core Control Plane** resource as described in [View the packet core instance](#view-the-packet-core-instance).
2. Select **Modify packet core**.
3. In the **Configuration** tab, fill out the fields with the new values.
  
   - Refer to [Collect packet core configuration values](collect-required-information-for-a-site.md#collect-packet-core-configuration-values) for the configuration values you can modify under the main configuration.
   - Refer to [Collect access network values](collect-required-information-for-a-site.md#collect-access-network-values) for the configuration values you can modify under **Access network**.

    :::image type="content" source="media/modify-packet-core/modify-packet-core-configuration-tab.png" alt-text="Screenshot of the Azure portal showing the Configuration tab in the Modify packet core window.":::
    <!-- TODO: Update screenshot after bug where 4G and 5G names are swapped is fixed. -->

4. If you also want to attach or detach a data network, select the **Data networks** tab.

    :::image type="content" source="media/modify-packet-core/modify-packet-core-data-networks-tab.png" alt-text="Screenshot of the Azure portal showing the Data networks tab in the Modify packet core window.":::

   - To add a data network... Refer to ...
   - To remove a data network...

5. Select **Modify**.
6. Azure will now redeploy the packet core instance with the new configuration. The Azure portal will display the following confirmation screen when this deployment is complete.

    :::image type="content" source="media/site-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of a packet core instance.":::

## Next steps

Use Log Analytics or the packet core dashboards to confirm your packet core instance is operating normally after you modify it.

- [Monitor Azure Private 5G Core with Log Analytics](monitor-private-5g-core-with-log-analytics.md)
- [Packet core dashboards](packet-core-dashboards.md)
