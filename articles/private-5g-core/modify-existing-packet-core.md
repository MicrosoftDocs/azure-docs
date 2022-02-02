---
title: Modify the packet core instance in an existing site
titlesuffix: Azure Private 5G Core Preview
description: Learn how to make changes to the packet core instance in an existing Azure Private 5G Core site.  
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/28/2022
ms.custom: template-how-to
---

# Modify the packet core instance in an existing site

A packet core instance is a cloud native implementation of the 3GPP standards-defined 5G Next Generation Core (5G NGC or 5GC). Each Azure Private 5G Core Preview site hosts a packet core instance.

In this how-to guide, you'll learn how to make changes to the packet core instance in an existing site. You may want to do this if you need to change the way the packet core instance connects to the access or data networks. You can also change configuration for Network Address and Port Translation (NAPT).

## Prerequisites

Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.

If you want to make changes to any of the following, you must first update the configuration on the Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster on the Azure Stack Edge Pro device in the site. 

- IP addresses for the packet core instance's N2 signaling, N3, and N6 interfaces.
- Network addresses and default gateways for the access and data subnets.

Contact your support representative for information on how you can make these changes. Once you've made them, you can then make the corresponding changes on the packet core instance as described below.

## Modify the packet core instance's configuration

In this step, you'll modify configuration for your chosen packet core instance in the Azure portal.

1. Sign in to the Azure portal at [https://aka.ms/AP5GCPortal](https://aka.ms/AP5GCPortal).
1. Search for and select the Mobile Network resource representing the private mobile network to which you want to add a site.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the resource menu, select **Sites**.

    :::image type="content" source="media/modify-existing-packet-core/sites-resource-menu-option.png" alt-text="Screenshot of the Azure portal. It shows the sites resource menu option for a mobile network resource.":::

1. From the list, select the site containing the packet core instance you want to update.

    :::image type="content" source="media/modify-existing-packet-core/sites-list.png" alt-text="Screenshot of the Azure portal. It shows a list of existing sites in a private mobile network.":::

1. In the resource menu, select **Network functions**.

    :::image type="content" source="media/modify-existing-packet-core/network-functions-resource-menu-option.png" alt-text="Screenshot of the Azure portal. It shows the network functions resource menu option for a site.":::

1. From the list, select the network function that matches the name of the site.

    :::image type="content" source="media/modify-existing-packet-core/network-functions-list.png" alt-text="Screenshot of the Azure portal. It shows a list of existing network functions for a site."::: 

1. Select **Configuration**.

    :::image type="content" source="media/modify-existing-packet-core/network-function-configuration-option.png" alt-text="Screenshot of the Azure portal. The configuration option for the packet core instance is highlighted."::: 

1. You'll now see the configuration for the packet core instance and can begin making your changes.

### Change access network configuration

The **Configuration** tab lets you set configuration for the packet core instance's connection to the access network. For information on each of the available fields, see [Collect access network values](collect-required-information-for-private-mobile-network.md#collect-access-network-values).

:::image type="content" source="media/modify-existing-packet-core/packet-core-configuration-tab.png" alt-text="Screenshot of the Azure portal. The configuration tab for a packet core instance is highlighted."::: 

### Change data network configuration

The **Data network** tab lets you set configuration for the packet core instance's connection to the data network. 

Select the data network from the list, and then make your changes under **Modify a data network**.

:::image type="content" source="media/modify-existing-packet-core/packet-core-data-network-tab.png" alt-text="Screenshot of the Azure portal. The data network tab for a packet core instance is shown. The network name and configuration fields are highlighted." lightbox="media/modify-existing-packet-core/packet-core-data-network-tab.png"::: 

For information on each of the available fields, see [Collect data network values](collect-required-information-for-private-mobile-network.md#collect-data-network-values).

Once you have made your changes, select **Modify**.

### Change NAPT configuration for the data network

Network Address and Port Translation (NAPT) lets you translate a large pool of private IP addresses for User Equipment (UEs) to a small number of public IP addresses. This translation is carried out when traffic enters the core network. NAPT maximizes the utility of a limited supply of public IP addresses.

The **Data network** tab lets you manage NAPT configuration.

Select the data network from the list, and then make your changes under **Modify a data network**.

:::image type="content" source="media/modify-existing-packet-core/packet-core-napt-configuration.png" alt-text="Screenshot of the Azure portal. The data network tab for a packet core instance is shown. The network name and N A P T fields are highlighted." lightbox="media/modify-existing-packet-core/packet-core-napt-configuration.png"::: 

You can enable or disable NAPT using the **Network address and port translation** toggle.

If NAPT is enabled, you can also set any of the following fields to determine how the packet core instance will perform NAPT.


| Field | Description |
|--|--|
| **Port range: Minimum** | The first port in the port range to use as translated ports on each translated address. Select an integer between 1024 and 65535. If you don't specify a value, this will default to 1024. |
| **Port range: Maximum** | The last port in the port range to use as translated ports on each translated address. Select an integer between 1025 and 65535 that is greater than value you chose for **Port range: Minimum**. If you don't specify a value, this will default to 65535. |
| **Port reuse hold time (seconds): TCP** | The minimum time (in seconds) that must pass before a port used by a closed pinhole handling TCP traffic can be recycled for use by another pinhole. Select an integer greater than 0. If you don't specify a value, this will default to 120. |
| **Port reuse hold time (seconds): UDP** | The minimum time (in seconds) that must pass before a port used by a closed pinhole handling UDP traffic can be recycled for use by another pinhole. Select an integer greater than 0. If you don't specify a value, this will default to 60. |
| **Pinhole timeouts (seconds): TCP** | The expiry time (in seconds) for an inactive NAPT pinhole handling TCP traffic. Select an integer greater than 0. If you don't specify a value, this will default to 7440, as recommended in Section 5 of RFC 5382. |
| **Pinhole timeouts (seconds): UDP** | The expiry time (in seconds) for an inactive NAPT pinhole handling UDP traffic. Select an integer greater than 0. If you don't specify a value, this will default to 300, as recommended in Section 4.3 of RFC 4787. |
| **Pinhole timeouts (seconds): ICMP** | The expiry time (in seconds) for an inactive NAPT pinhole handling ICMP traffic. Select an integer greater than 0. If you don't specify a value, this will default to 60, as recommended in Section 3.2 of RFC 5508. |
| **Pinhole limit** | <p>The maximum number of NAPT pinholes that can be open simultaneously on the core interface for each protocol. Select an integer between 1 and 65536. If you don't specify a value, this will default to 65536.</p><p>The packet core instance applies this limit separately to each protocol. For example, if you set this limit to 100, the packet core instance can have 100 ICMP pinholes, 100 TCP pinholes, and 100 UDP pinholes open simultaneously on the core interface.</p> |

Once you have made your changes to the NAPT configuration, select **Modify**.

## Apply your changes

You can now apply all of the changes you have made by selecting **Apply**.

:::image type="content" source="media/modify-existing-packet-core/packet-core-configuration-apply-option.png" alt-text="Screenshot of the Azure portal. The configuration tab for a packet core instance is shown. The apply option is highlighted."::: 

Azure will now deploy your changes. You'll see the following confirmation when the deployment is complete.

:::image type="content" source="media/modify-existing-packet-core/packet-core-configuration-change-confirmation.png" alt-text="Screenshot of the Azure portal. It shows confirmation that configuration changes have been successfully deployed.":::

## Next steps
- [Learn how to monitor your packet core instance using the packet core dashboards](packet-core-dashboards.md)