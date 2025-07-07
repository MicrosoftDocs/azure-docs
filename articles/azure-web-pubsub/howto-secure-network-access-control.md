---
title: Manage network access control to an endpoint
description: Learn how to control network access to your Azure Web PubSub resource.
author: ArchangelSDY
ms.author: dayshen
ms.service: azure-web-pubsub
ms.topic: how-to 
ms.date: 08/16/2024
---

# Manage network access control

Azure Web PubSub allows you to secure and manage access to your service endpoint based on request types and network subsets. When you configure network access control rules, only applications making requests from the specified networks can access your Azure Web PubSub instance.

You can configure Azure Web PubSub to secure and control the level of access to your service endpoint based on the request type and subset of networks used. When network rules are configured, only applications that request data over the specified set of networks can access your Web PubSub resource.

  :::image type="content" alt-text="Screenshot showing network access control decision flow chart." source="media\howto-secure-network-access-control\network-access-control-decision-flow-chart.png" :::


## Public network access

We offer a single, unified switch to simplify the configuration of public network access. The switch has following options:

* Disabled: Completely blocks public network access. All other network access control rules are ignored for public networks.
* Enabled: Allows public network access, which is further regulated by additional network access control rules.

### [Configure public network access via portal](#tab/azure-portal)

1. Go to the Azure Web PubSub instance you want to secure.
1. Select **Networking** from the left side menu. Select **Public access** tab:

  :::image type="content" alt-text="Screenshot showing how to configure public network access." source="media\howto-secure-network-access-control\portal-public-network-access.png" :::

1. Select **Disabled** or **Enabled**.

1. Select **Save** to apply your changes.

### [Configure public network access via bicep](#tab/bicep)

The following template disables public network access:

```bicep
resource webpubsub 'Microsoft.SignalRService/WebPubSub@2024-08-01-preview' = {
  name: 'foobar'
  location: 'eastus'
  properties: {
    publicNetworkAccess: 'Disabled'
  }
}
```

-----


## Default action

The default action is applied when no other rule matches.

### [Configure default action via portal](#tab/azure-portal)

1. Go to the Azure Web PubSub instance you want to secure.
1. Select **Network access control** from the left side menu.

  :::image type="content" alt-text="Screenshot showing default action on portal." source="media/howto-secure-network-access-control/portal-default-action.png" :::

1. To edit the default action, toggle the **Allow/Deny** button.
1. Select **Save** to apply your changes.

### [Configure default action via bicep](#tab/bicep)

The following template sets the default action to `Deny`.

```bicep
resource webpubsub 'Microsoft.SignalRService/WebPubSub@2024-08-01-preview' = {
  name: 'foobar'
  location: 'eastus'
  properties: {
    networkACLs: {
        defaultAction: 'Deny'
    }
}
```

-----


## Request type rules

You can configure rules to allow or deny specified request types for both the public network and each [private endpoint](howto-secure-private-endpoints.md).

For example, [REST API calls](reference-rest-api-data-plane.md) are typically high-privileged. To enhance security, you may want to restrict their origin. You can configure rules to block all REST API calls from public network, and only allow they originate from a specific virtual network.

If no rule matches, the default action is applied.

### [Configure request type rules via portal](#tab/azure-portal)

1. Go to the Azure Web PubSub instance you want to secure.
1. Select **Network access control** from the left side menu.

  :::image type="content" alt-text="Screenshot showing request type rules on portal." source="media/howto-secure-network-access-control/portal-request-type-rules.png" :::

1. To edit public network rule, select allowed types of requests under **Public network**.

  :::image type="content" alt-text="Screenshot of selecting allowed request types for public network on portal." source="media/howto-secure-network-access-control/portal-public-network.png" :::

1. To edit private endpoint network rules, select allowed types of requests in each row under **Private endpoint connections**.

  :::image type="content" alt-text="Screenshot of selecting allowed request types for private endpoints on portal." source="media/howto-secure-network-access-control/portal-private-endpoint.png" :::

1. Select **Save** to apply your changes.

### [Configure request type rules via bicep](#tab/bicep)

The following template denies all requests from the public network except Client Connections. Additionally, it allows only REST API calls, and Trace calls from a specific private endpoint.

The name of the private endpoint connection can be inspected in the `privateEndpointConnections` sub-resource. It's automatically generated by the system.

```bicep
resource webpubsub 'Microsoft.SignalRService/WebPubSub@2024-08-01-preview' = {
  name: 'foobar'
  location: 'eastus'
  properties: {
    networkACLs: {
        defaultAction: 'Deny'
        publicNetwork: {
            allow: ['ClientConnection']
        }
        privateEndpoints: [
            {
                name: 'foo.0000aaaa-11bb-cccc-dd22-eeeeee333333'
                allow: ['RESTAPI', 'Trace']
            }
        ]
    }
}
```

-----


## IP rules

IP rules allow you to grant or deny access to specific public internet IP address ranges. These rules can be used to permit access for certain internet-based services and on-premises networks or to block general internet traffic.

The following restrictions apply:

* You can configure up to 30 rules.
* Address ranges must be specified using [CIDR notation](https://tools.ietf.org/html/rfc4632), such as `16.17.18.0/24`. Both IPv4 and IPv6 addresses are supported.
* IP rules are evaluated in the order they are defined. If no rule matches, the default action is applied.
* IP rules apply only to public traffic and cannot block traffic from private endpoints.

### [Configure IP rules via portal](#tab/azure-portal)

1. Go to the Azure Web PubSub instance you want to secure.
1. Select **Networking** from the left side menu. Select **Access control rules** tab:

   :::image type="content" alt-text="Screenshot showing how to configure IP rules." source="media\howto-secure-network-access-control\portal-ip-rules.png" :::

1. Edit the list under **IP rules** section.

1. Select **Save** to apply your changes.

### [Configure IP rules via bicep](#tab/bicep)

The following template has these effects:

* Requests from `123.0.0.0/8` and `2603::/8` are allowed.
* Requests from all other IP ranges are denied.

```bicep
resource webpubsub 'Microsoft.SignalRService/WebPubSub@2024-08-01-preview' = {
  name: 'foobar'
  location: 'eastus'
  properties: {
    networkACLs: {
      defaultAction: 'Deny'
      ipRules: [
        {
          value: '123.0.0.0/8'
          action: 'Allow'
        }
        {
          value: '2603::/8'
          action: 'Allow'
        }
        {
          value: '0.0.0.0/0'
          action: 'Deny'
        }
        {
          value: '::/0'
          action: 'Deny'
        }
      ]
    }
  }
}
```

-----


## Next steps

Learn more about [Azure Private Link](../private-link/private-link-overview.md).
