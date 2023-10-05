---
title: How to secure and control network access to the Azure Web PubSub service endpoint
description: Overview of how to control the network access of Azure Web PubSub service
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: how-to 
ms.date: 11/08/2021
---

# Configure network access control for Azure Web PubSub service

Azure Web PubSub service enables you to secure and control the level of access to your service endpoint, based on the request type and subset of networks used. When network rules are configured, only applications requesting data over the specified set of networks can access your Azure Web PubSub service.

Azure Web PubSub service has a public endpoint that is accessible through the internet. You can also create [Private Endpoints for your Azure Web PubSub service](howto-secure-private-endpoints.md). Private Endpoint assigns a private IP address from your VNet to the Azure Web PubSub service, and secures all traffic between your VNet and the Azure Web PubSub service over a private link. The Azure Web PubSub service network access control provides access control for both public endpoint and private endpoints.

Optionally, you can choose to allow or deny certain types of requests for public endpoint and each private endpoint. 

An application that accesses an Azure Web PubSub service when network access control rules are in effect still requires proper authorization for the request.

## Scenario A - No public traffic

To completely deny all public traffic, you should first configure the public network rule to allow no request type. Then, you should configure rules that grant access to traffic from specific VNets. This configuration enables you to build a secure network boundary for your applications.

## Scenario B - Only client connections from public network

In this scenario, you can configure the public network rule to only allow Client Connections from public network. You can then configure private network rules to allow other types of requests originating from a specific VNet. This configuration hides your app servers from public network and establishes secure connections between your app servers and Azure Web PubSub service.

## Managing network access control

You can manage network access control for Azure Web PubSub service through the Azure portal.

### Azure portal

1. Go to the Azure Web PubSub service you want to secure.

1. Select on the settings menu called **Network access control**.

    :::image type="content" source="./media/howto-secure-network-access-control/portal-network-access-control.png" alt-text="Network Access Control in Azure portal.":::

1. To edit default action, toggle the **Allow/Deny** button.

    > [!TIP]
    > Default action is the action we take when there is no ACL rule matches. For example, if the default action is **Deny**, then request types that are not explicitly approved below will be denied.

1. To edit public network rule, select allowed types of requests under **Public network**.

    :::image type="content" source="./media/howto-secure-network-access-control/portal-public-network.png" alt-text="Edit public network ACL in Azure portal.":::

1. To edit private endpoint network rules, select allowed types of requests in each row under **Private endpoint connections**.

1. Select **Save** to apply your changes.
