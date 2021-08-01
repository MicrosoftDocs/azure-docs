---
title: Use Azure Private Link to connect networks to Azure Monitor
description: Set up an Azure Monitor Private Link Scope to securely connect networks to Azure Monitor.
author: noakup
ms.author: noakuper
ms.topic: conceptual
ms.date: 10/05/2020
---

# Use Azure Private Link to connect networks to Azure Monitor

With [Azure Private Link](../../private-link/private-link-overview.md), you can securely link Azure platform as a service (PaaS) services to your virtual network by using private endpoints. For many services, you just set up an endpoint for each resource. However, Azure Monitor is a constellation of different interconnected services that work together to monitor your workloads. 

You can use a resource called an Azure Monitor Private Link Scope to define the boundaries of your monitoring network and connect to your virtual network. This article covers when to use and how to set up an Azure Monitor Private Link Scope.

This article uses the following abbreviations in examples:

- AMPLS: Azure Monitor Private Link Scope
- VNet: virtual network
- AI: Application Insights
- LA: Log Analytics

## Advantages

With Private Link, you can:

- Connect privately to Azure Monitor without opening any public network access.
- Ensure that your monitoring data is accessed only through authorized private networks.
- Prevent data exfiltration from your private networks by defining specific Azure Monitor resources that connect through your private endpoint.
- Securely connect your private on-premises network to Azure Monitor by using Azure ExpressRoute.
- Keep all traffic inside the Microsoft Azure backbone network.

For more information, see [Key benefits of Private Link](../../private-link/private-link-overview.md#key-benefits).

## How it works

An Azure Monitor Private Link Scope connects private endpoints (and the virtual networks they're contained in) to one or more Azure Monitor resources. These resources are Log Analytics workspaces and Application Insights components.

![Diagram of a basic resource topology.](./media/private-link-security/private-link-basic-topology.png)

* The private endpoint allows your virtual network to reach Azure Monitor endpoints through private IPs from your network's pool, instead of using the public IPs of these endpoints. That allows you to keep using your Azure Monitor resources without opening your virtual network to unrequired outbound traffic. 
* Traffic from the private endpoint to your Azure Monitor resources will go over the Microsoft Azure backbone and not be routed to public networks. 
* You can configure each of your workspaces or components to allow or deny ingestion and queries from public networks. That provides a resource-level protection, so that you can control traffic to specific resources.

> [!NOTE]
> A single Azure Monitor resource can belong to multiple Azure Monitor Private Link Scopes, but you can't connect a single virtual network to more than one Azure Monitor Private Link Scope. 

### Azure Monitor Private Links and DNS: It's all or nothing

Some Azure Monitor services use global endpoints, meaning that they serve requests targeting any workspace or component. When you set up a Private Link connection, your DNS is updated to map Azure Monitor endpoints to private IPs, in order to send traffic through Private Link. 

For global endpoints, setting up a Private Link instance (even to a single resource) affects traffic to all resources. In other words, it's impossible to create a Private Link connection for only a specific component or workspace.

#### Global endpoints

Traffic to the following global endpoints will be sent through Private Link:
* All Application Insights endpoints. Endpoints that handle ingestion, live metrics, profiler, and debugger (for example) to Application Insights endpoints are global.
* The query endpoint. The endpoint that handles queries to both Application Insights and Log Analytics resources is global.

Effectively, all Application Insights traffic will be sent to Private Link. All queries, to both Application Insights and Log Analytics resources, will be sent to Private Link.

Traffic to Application Insights resources that aren't added to your Azure Monitor Private Link Scope will not pass the Private Link validation, and will fail.

![Diagram of all-or-nothing behavior.](./media/private-link-security/all-or-nothing.png)

#### Resource-specific endpoints

All Log Analytics endpoints, except the query endpoint, are workspace specific. Creating a Private Link connection to a specific Log Analytics workspace won't affect ingestion (or other) traffic to other workspaces, which will continue to use the public Log Analytics endpoints. All queries, however, will be sent through Private Link.

### Private Link applies to all networks that share the same DNS

Some networks consist of multiple virtual networks or other connected networks. If these networks share the same DNS, setting up a Private Link instance on any of them would update the DNS and affect traffic across all networks. That's especially important to note, because of the all-or-nothing behavior described earlier.

In the following diagram, virtual network 10.0.1.x first connects to AMPLS1 and maps the Azure Monitor global endpoints to IPs from its range. Later, virtual network 10.0.2.x connects to AMPLS2, and it overrides the DNS mapping of the *same global endpoints* with IPs from its range. Because these virtual networks aren't peered, the first virtual network now fails to reach these endpoints.

![Diagram of DNS overrides in multiple virtual networks.](./media/private-link-security/dns-overrides-multiple-vnets.png)

## Next steps

- [Plan your Private Link setup](private-links-planning.md)
