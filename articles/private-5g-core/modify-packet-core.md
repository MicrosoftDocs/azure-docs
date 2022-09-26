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

# Modify the packet core instance in a site - Azure portal

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

    :::image type="content" source="media/upgrade-packet-core-azure-portal/packet-core-field.png" alt-text="Screenshot of the Azure portal showing the Packet Core field.":::

## Modify the packet core configuration

Refer to [Collect packet core configuration values](collect-required-information-for-a-site.md#collect-packet-core-configuration-values) and [Collect access network values](collect-required-information-for-a-site.md#collect-access-network-values) for the packet core configuration values you can modify in this step.

To modify the packet core configuration:

1. If you haven't already, navigate to the **Packet Core Control Plane** resource as described in [View the packet core instance](#view-the-packet-core-instance).
2. Select **Modify packet core**.
3. In the **Configuration** tab, fill out the fields with the new values.
4. If you also want to attach or detach a data network, go to ... .

## Add and delete attached data networks

1. If you haven't already, navigate to the **Packet Core Control Plane** resource as described in [View the packet core instance](#view-the-packet-core-instance).
1. Select **Modify packet core**.
1. Select the **Data networks** tab.
1. To attach a new data network, follow ... . To remove an attached data network, follow ... .

### Attach a data network to the packet core instance

### Detach a data network from the packet core instance

## Next steps

Use Log Analytics or the packet core dashboards to confirm your packet core instance is operating normally after you modify it.

- [Monitor Azure Private 5G Core with Log Analytics](monitor-private-5g-core-with-log-analytics.md)
- [Packet core dashboards](packet-core-dashboards.md)
