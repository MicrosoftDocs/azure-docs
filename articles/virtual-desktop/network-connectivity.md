---
title: Understanding Azure Virtual Desktop network connectivity
titleSuffix: Azure
description: Learn about Azure Virtual Desktop network connectivity.
author: femila
ms.topic: conceptual
ms.date: 11/16/2020
ms.author: femila
---

# Understanding Azure Virtual Desktop network connectivity

Azure Virtual Desktop hosts client sessions on session hosts running on Azure. Microsoft manages portions of the services on the customer's behalf and provides secure endpoints for connecting clients and session hosts. The following diagram gives a high-level overview of the network connections used by Azure Virtual Desktop.

:::image type="content" source="media/azure-virtual-desktop-network-connections.svg" alt-text="Diagram of Azure Virtual Desktop Network Connections" lightbox="media/azure-virtual-desktop-network-connections.svg":::

## Session connectivity

Azure Virtual Desktop uses Remote Desktop Protocol (RDP) to provide remote display and input capabilities over network connections. RDP was initially released with Windows NT 4.0 Terminal Server Edition and was continuously evolving with every Microsoft Windows and Windows Server release. From the beginning, RDP developed to be independent of its underlying transport stack, and today it supports multiple types of transport.

## Reverse connect transport

Azure Virtual Desktop is using reverse connect transport for establishing the remote session and for carrying RDP traffic. Unlike the on-premises Remote Desktop Services deployments, reverse connect transport doesn't use a TCP listener to receive incoming RDP connections. Instead, it's using outbound connectivity to the Azure Virtual Desktop infrastructure over the HTTPS connection.

## Session host communication channel

Upon startup of the Azure Virtual Desktop session host, the Remote Desktop Agent Loader service establishes the Azure Virtual Desktop broker's persistent communication channel. This communication channel is layered on top of a secure Transport Layer Security (TLS) connection and serves as a bus for service message exchange between session host and Azure Virtual Desktop infrastructure.

## Client connection sequence

The client connection sequence is as follows:

1. Using supported Azure Virtual Desktop client user subscribes to the Azure Virtual Desktop Workspace.

1. Microsoft Entra authenticates the user and returns the token used to enumerate resources available to a user.

1. Client passes token to the Azure Virtual Desktop feed subscription service.

1. Azure Virtual Desktop feed subscription service validates the token.

1. Azure Virtual Desktop feed subscription service passes the list of available desktops and applications back to the client in the form of digitally signed connection configuration.

1. Client stores the connection configuration for each available resource in a set of `.rdp` files.

1. When a user selects the resource to connect, the client uses the associated `.rdp` file and establishes a secure TLS 1.2 connection to an Azure Virtual Desktop gateway instance with the help of [Azure Front Door](../frontdoor/concept-end-to-end-tls.md#supported-cipher-suites) and passes the connection information. The latency from all gateways is evaluated, and the gateways are put into groups of 10 ms. The gateway with the lowest latency and then lowest number of existing connections is chosen.

1. Azure Virtual Desktop gateway validates the request and asks the Azure Virtual Desktop broker to orchestrate the connection.

1. Azure Virtual Desktop broker identifies the session host and uses the previously established persistent communication channel to initialize the connection.

1. Remote Desktop stack initiates a TLS 1.2 connection to the same Azure Virtual Desktop gateway instance as used by the client.

1. After both client and session host connected to the gateway, the gateway starts relaying the data between both endpoints. This connection establishes the base reverse connect transport for the RDP connection through a nested tunnel, using the mutually agreed TLS version supported and enabled between the client and session host, up to TLS 1.3.

1. After the base transport is set, the client starts the RDP handshake.

## Connection security

TLS is used for all connections. The version used depends on which connection is made and the capabilities of the client and session host:

- For all connections initiated from the clients and session hosts to the Azure Virtual Desktop infrastructure components, TLS 1.2 is used. Azure Virtual Desktop uses the same TLS 1.2 ciphers as [Azure Front Door](../frontdoor/concept-end-to-end-tls.md#supported-cipher-suites). It's important to make sure both client computers and session hosts can use these ciphers.

- For the reverse connect transport, both the client and session host connect to the Azure Virtual Desktop gateway. After the TCP connection for the base transport is established, the client or session host validates the Azure Virtual Desktop gateway's certificate. RDP then establishes a nested TLS connection between client and session host using the session host's certificates. The version of TLS uses the mutually agreed TLS version supported and enabled between the client and session host, up to TLS 1.3. TLS 1.3 is supported starting in Windows 11 (21H2) and in Windows Server 2022. To learn more, see [Windows 11 TLS support](/windows/win32/secauthn/tls-cipher-suites-in-windows-11). For other operating systems, check with the operating system vendor for TLS 1.3 support.

By default, the certificate used for RDP encryption is self-generated by the OS during the deployment. You can also deploy centrally managed certificates issued by the enterprise certification authority. For more information about configuring certificates, see [Remote Desktop listener certificate configurations](/troubleshoot/windows-server/remote/remote-desktop-listener-certificate-configurations).

## Next steps

* To learn about bandwidth requirements for Azure Virtual Desktop, see [Understanding Remote Desktop Protocol (RDP) Bandwidth Requirements for Azure Virtual Desktop](rdp-bandwidth.md).
* To get started with Quality of Service (QoS) for Azure Virtual Desktop, see [Implement Quality of Service (QoS) for Azure Virtual Desktop](rdp-quality-of-service-qos.md).
