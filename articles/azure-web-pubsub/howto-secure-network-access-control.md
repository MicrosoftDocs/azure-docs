---
title: Secure and control network access to an Azure Web PubSub endpoint
description: Learn how to control network access to your Azure Web PubSub resource.
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: how-to 
ms.date: 08/16/2024
---

# Configure network access control for Azure Web PubSub

Azure Web PubSub enables you to secure and control the level of access to your service endpoint, based on the request type and subset of networks used. When network rules are configured, only applications that request data over the specified set of networks can access your Web PubSub resource.

Azure Web PubSub service has a public endpoint that is accessible through the internet. You can also create a [private endpoint for your Web PubSub resource](howto-secure-private-endpoints.md). A private endpoint assigns a private IP address from your virtual network to the Web PubSub resource. It also secures all traffic between your virtual network and the Web PubSub resource over a private link. The Web PubSub network access control provides access control for both a public endpoint and for private endpoints.

Optionally, you can choose to allow or deny certain types of requests for a public endpoint and for each private endpoint.

An application that accesses a Web PubSub resource when network access control rules are in effect still requires proper authorization for the request.

## Scenario A: Deny all public traffic

To completely deny all public traffic, first configure the public network rule to allow no request type. Then, configure rules that grant access to traffic from specific virtual networks. This configuration enables you to build a secure network boundary for your applications.

## Scenario B: Allow only client connections from a public network

In this scenario, you can configure the public network rule to allow only client connections from a public network. You can then configure private network rules to allow other types of requests that originate from a specific virtual network. This configuration hides your app servers on a public network and establishes secure connections between your app servers and Azure Web PubSub.

## Manage network access control

You can manage network access control for Azure Web PubSub by using the Azure portal.

1. In the Azure portal, go to the Azure Web PubSub service you want to secure.

1. On the left menu under **Settings**, select **Network access control**.

    :::image type="content" source="./media/howto-secure-network-access-control/portal-network-access-control.png" alt-text="Network Access Control in the Azure portal.":::

1. To edit the default action, switch the **Allow/Deny** button.

    > [!TIP]
    > The default action is the action that you take when no access control list (ACL) rules match. For example, if the default action is **Deny**, request types that are not explicitly approved are denied.

1. To edit a public network rule, under **Public network**, select allowed types of requests.

    :::image type="content" source="./media/howto-secure-network-access-control/portal-public-network.png" alt-text="Edit s public network ACL in the Azure portal.":::

1. To edit private endpoint network rules, under **Private endpoint connections**, select the allowed types of requests in each row.

1. Select **Save** to apply your changes.
