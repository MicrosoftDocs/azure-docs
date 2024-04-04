---
title: Diagnose on-premises VPN connectivity with Azure
titleSuffix: Azure Network Watcher
description: Learn how to diagnose on-premises VPN connectivity with Azure using Azure Network Watcher VPN troubleshoot tool.
ms.author: halkazwini
author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 02/09/2024

#CustomerIntent: As an Azure administrator, I want to learn how to use VPN troubleshoot so I can troubleshoot my VPN virtual network gateways and their connections whenever resources in a virtual network can't communicate with on-premises resources over a VPN connection.
---

# Diagnose on-premises VPN connectivity with Azure

In this article, you learn how to use Azure Network Watcher VPN troubleshoot capability to diagnose and troubleshoot your VPN gateway and its connection to your on-premises VPN device. For a list of validated VPN devices and their configuration guides, see [VPN devices](../vpn-gateway/vpn-gateway-about-vpn-devices.md?toc=/azure/network-watcher/toc.json#devicetable).

VPN troubleshoot allows you to quickly diagnose issues with your gateway and connections. It checks for common issues and returns a list of diagnostic logs that can be used to further troubleshoot the issue. The logs are stored in a storage account that you specify.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A VPN device in your on-premises network represented by a local network gateway in Azure. For more information about local network gateways, see [Create a local network gateway](../vpn-gateway/tutorial-site-to-site-portal.md#LocalNetworkGateway). For a list of validated VPN devices, see [Validated VPN devices](../vpn-gateway/vpn-gateway-about-vpn-devices.md?toc=/azure/network-watcher/toc.json#devicetable). 

- A VPN virtual network gateway in Azure with a site-to-site connection. For more information about virtual network gateways, see [Create a VPN gateway](../vpn-gateway/tutorial-site-to-site-portal.md?toc=/azure/network-watcher/toc.json#VNetGateway) and [Default IPsec/IKE parameters](../vpn-gateway/vpn-gateway-about-vpn-devices.md?toc=/azure/network-watcher/toc.json#ipsec)


## Troubleshoot using Network Watcher VPN troubleshoot

Use the VPN troubleshoot capability of Network Watcher to diagnose and troubleshoot your VPN gateway and its connection to your on-premises network. 

1. In the search box at the top of the portal, enter ***network watcher***. Select **Network Watcher** in the search results.

    :::image type="content" source="./media/network-watcher-diagnose-on-premises-connectivity/portal-search.png" alt-text="Screenshot shows how to search for Network Watcher in the Azure portal." lightbox="./media/packet-capture-vm-portal/portal-search.png":::

1. Under **Network diagnostic tools**, select **VPN troubleshoot**.

1. In the **VPN troubleshoot**, select **Select storage account** to choose or create a Standard storage account to save the diagnostic files to.

1. Select the virtual network gateway and connection that you want to troubleshoot.

1. Select **Start troubleshooting**. 

1. Once the check is completed, the troubleshooting status of the gateway and connection is displayed. The **Unhealthy** status indicates that there's an issue with the resource.

1. Go to the **vpn** container in the storage account that you previously specified and download the zip file that was generated during the VPN troubleshoot check session. Network Watcher creates a zip folder that contains the following diagnostic log files:

    :::image type="content" source="./media/network-watcher-diagnose-on-premises-connectivity/vpn-troubleshoot-logs.png" alt-text="Screenshot shows log files created after running VPN troubleshoot check on a virtual network gateway.":::

    > [!NOTE]
    > - In some cases, only a subset of the log files is generated.
    > - For newer gateway versions, the IKEErrors.txt, Scrubbed-wfpdiag.txt and wfpdiag.txt.sum have been replaced by an IkeLogs.txt file that contains the whole IKE activity including any errors.

A common misconfiguration error is due to using incorrect shared keys where you can check the IKEErrors.txt to see the following error message:

```
Error: Authentication failed. Check shared key.
```

Another common error is due the misconfiguration of the IPsec parameters, where you can find the following error message in the IKEErrors.txt file:

```
Error: On-premises device rejected Quick Mode settings. Check values.
		based on log : Peer sent NO_PROPOSAL_CHOSEN notify
```

For a detailed list of fault types that Network Watcher can diagnose and their logs, see [Gateway faults](vpn-troubleshoot-overview.md#gateway) and [Connection faults](vpn-troubleshoot-overview.md#connection). 

## Next step

Learn how to monitor VPN gateways using Azure Automation:

> [!div class="nextstepaction"]
> [Monitor VPN gateways using VPN troubleshoot and Azure automation](network-watcher-monitor-with-azure-automation.md)