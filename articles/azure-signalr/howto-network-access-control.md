---
title: Configure network access control
titleSuffix: Azure SignalR Service
description: Configure network access control for your Azure SignalR Service.
services: signalr
author: vicancy
ms.service: signalr
ms.topic: conceptual
ms.date: 03/29/2023
ms.author: lianwei
---

# Configure network access control

Azure SignalR Service enables you to secure and control the level of access to your service endpoint based on the request type and subset of networks. When network rules are configured, only applications requesting data over the specified set of networks can access your SignalR Service.

SignalR Service has a public endpoint that is accessible through the internet. You can also create [private endpoints for your Azure SignalR Service](howto-private-endpoints.md). A private endpoint assigns a private IP address from your VNet to the SignalR Service, and secures all traffic between your VNet and the SignalR Service over a private link. The SignalR Service network access control provides access control for both public and private endpoints.

Optionally, you can choose to allow or deny certain types of requests for the public endpoint and each private endpoint. For example, you can block all [Server Connections](signalr-concept-internals.md#application-server-connections) from public endpoint and make sure they only originate from a specific VNet.

An application that accesses a SignalR Service when network access control rules are in effect still requires proper authorization for the request.

## Scenario A - No public traffic

To completely deny all public traffic, first configure the public network rule to allow no request type. Then, you can configure rules that grant access to traffic from specific VNets. This configuration enables you to build a secure network boundary for your applications.

## Scenario B - Only client connections from public network

In this scenario, you can configure the public network rule to only allow [Client Connections](signalr-concept-internals.md#client-connections) from the public network. You can then configure private network rules to allow other types of requests originating from a specific VNet. This configuration hides your app servers from the public network and establishes secure connections between your app servers and SignalR Service.

## Managing network access control

You can manage network access control for SignalR Service through the Azure portal.

1. Go to the SignalR Service instance you want to secure.
1. Select **Network access control** from the left side menu.

    ![Network ACL on portal](media/howto-network-access-control/portal.png)

1. To edit default action, toggle the **Allow/Deny** button.

    > [!TIP]
    > The default action is the action the service takes when no access control rule matches a request. For example, if the default action is **Deny**, then the request types that are not explicitly approved will be denied.

1. To edit public network rule, select allowed types of requests under **Public network**.

    ![Edit public network ACL on portal ](media/howto-network-access-control/portal-public-network.png)

1. To edit private endpoint network rules, select allowed types of requests in each row under **Private endpoint connections**.

    ![Edit private endpoint ACL on portal ](media/howto-network-access-control/portal-private-endpoint.png)

1. Select **Save** to apply your changes.

## Next steps

Learn more about [Azure Private Link](../private-link/private-link-overview.md).
