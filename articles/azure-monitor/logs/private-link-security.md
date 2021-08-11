---
title: Use Azure Private Link to securely connect networks to Azure Monitor
description: Use Azure Private Link to securely connect networks to Azure Monitor
author: noakup
ms.author: noakuper
ms.topic: conceptual
ms.date: 10/05/2020
---

# Use Azure Private Link to securely connect networks to Azure Monitor

[Azure Private Link](../../private-link/private-link-overview.md) allows you to securely link Azure PaaS services to your virtual network using private endpoints. For many services, you just set up an endpoint per resource. However, Azure Monitor is a constellation of different interconnected services that work together to monitor your workloads. As a result, we have built a resource called an Azure Monitor Private Link Scope (AMPLS). AMPLS allows you to define the boundaries of your monitoring network and connect to your virtual network. This article covers when to use and how to set up an Azure Monitor Private Link Scope.

## Advantages

With Private Link you can:

- Connect privately to Azure Monitor without opening up any public network access
- Ensure your monitoring data is only accessed through authorized private networks
- Prevent data exfiltration from your private networks by defining specific Azure Monitor resources that connect through your private endpoint
- Securely connect your private on-premises network to Azure Monitor using ExpressRoute and Private Link
- Keep all traffic inside the Microsoft Azure backbone network

For more information, see  [Key Benefits of Private Link](../../private-link/private-link-overview.md#key-benefits).

## How it works

Azure Monitor Private Link Scope (AMPLS) connects private endpoints (and the VNets they're contained in) to one or more Azure Monitor resources - Log Analytics workspaces and Application Insights components.

![Diagram of basic resource topology](./media/private-link-security/private-link-basic-topology.png)

* The Private Endpoint on your VNet allows it to reach Azure Monitor endpoints through private IPs from your network's pool, instead of using to the public IPs of these endpoints. That allows you to keep using your Azure Monitor resources without opening your VNet to unrequired outbound traffic. 
* Traffic from the Private Endpoint to your Azure Monitor resources will go over the Microsoft Azure backbone, and not routed to public networks. 
* You can configure each of your workspaces or components to allow or deny ingestion and queries from public networks. That provides a resource-level protection, so that you can control traffic to specific resources.

> [!NOTE]
> A single Azure Monitor resource can belong to multiple AMPLSs, but you cannot connect a single VNet to more than one AMPLS. 

### Azure Monitor Private Links and your DNS: It's All or Nothing
Some Azure Monitor services use global endpoints, meaning they serve requests targeting any workspace/component. When you set up a Private Link connection your DNS is updated to map Azure Monitor endpoints to private IPs, in order to send traffic through the Private Link. When it comes to global endpoints, setting up a Private Link (even to a single resource) affects traffic to all resources. In other words, it's impossible to create a Private Link connection only for a specific component or workspace.

#### Global endpoints
Most importantly, traffic to the below global endpoints will be sent through the Private Link:
* All Application Insights endpoints - endpoints handling ingestion, live metrics, profiler, debugger etc. to Application Insights endpoints are global.
* The Query endpoint - the endpoint handling queries to both Application Insights and Log Analytics resources is global.

That effectively means that all Application Insights traffic will be sent to the Private Link, and that all queries - to both Application Insights and Log Analytics resources - will be sent to the Private Link.

Traffic to Application Insights resource not added to your AMPLS will not pass the Private Link validation, and will fail.

![Diagram of All or Nothing behavior](./media/private-link-security/all-or-nothing.png)

#### Resource-specific endpoints
All Log Analytics endpoints except the Query endpoint, are workspace-specific. So, creating a Private Link to a specific Log Analytics workspace won't affect ingestion (or other) traffic to other workspaces, which will continue to use the public Log Analytics endpoints. All queries, however, will be sent through the Private Link.

### Azure Monitor Private Link applies to all networks that share the same DNS
Some networks are composed of multiple VNets or other connected networks. If these networks share the same DNS, setting up a Private Link on any of them would update the DNS and affect traffic across all networks. That's especially important to note due to the "All or Nothing" behavior described above.

![Diagram of DNS overrides in multiple VNets](./media/private-link-security/dns-overrides-multiple-vnets.png)

In the above diagram, VNet 10.0.1.x first connects to AMPLS1 and maps the Azure Monitor global endpoints to IPs from its range. Later, VNet 10.0.2.x connects to AMPLS2, and overrides the DNS mapping of the *same global endpoints* with IPs from its range. Since these VNets aren't peered, the first VNet now fails to reach these endpoints.


## Next steps
- [Design your Private Link setup](private-link-design.md)
- Learn how to [configure your Private Link](private-link-configure.md)

<a id="connect-to-a-private-endpoint"></a> 