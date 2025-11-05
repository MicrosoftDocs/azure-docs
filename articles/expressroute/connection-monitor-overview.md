---
title: 'Connection Monitor for Azure ExpressRoute overview'
description: Learn about Connection Monitor for ExpressRoute, how it works, test configuration, regional considerations, endpoint types, and pricing.
services: expressroute
author: dpremchandani
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 11/04/2025
ms.author: divyapr
ai-usage: ai-assisted
---

# Connection Monitor for Azure ExpressRoute overview

> [!NOTE]
> Connection Monitor for ExpressRoute is powered by [Azure Network Watcher Connection Monitor](../network-watcher/connection-monitor-overview.md). This article focuses on ExpressRoute-specific integration, regional considerations, and pricing. For comprehensive information about Connection Monitor capabilities, test configuration, and monitoring concepts, see the [Network Watcher Connection Monitor documentation](../network-watcher/connection-monitor-overview.md).

When investigating ExpressRoute connectivity issues, you're often left guessing where the problem is: your network, Azure's infrastructure, or somewhere in between. Connection Monitor provides true end-to-end visibility into your ExpressRoute connections.

## What is Connection Monitor?

Connection Monitor is an Azure Network Watcher feature that continuously tests your entire ExpressRoute path—from your on-premises servers through the ExpressRoute circuit to your Azure workloads. For ExpressRoute connections configured through the Azure portal, Connection Monitor is available at no additional charge.

Unlike resource metrics that only monitor individual components or open-source tools that detect failures without pinpointing their location, Connection Monitor provides comprehensive end-to-end monitoring with hop-by-hop path visualization to help you quickly identify and resolve connectivity issues.

### Key capabilities for ExpressRoute

Connection Monitor provides the following capabilities when monitoring ExpressRoute connections:

- **Detect connectivity and performance degradation** with continuous connectivity tests between your on-premises and Azure workloads
- **Pinpoint the exact problem location** with hop-by-hop network path visualization
- **Prove whether it's your issue or Azure's** by localizing failures within the Azure network or your infrastructure
- **Track performance over time** with historical latency and packet loss data
- **Get instant alerts** when thresholds are breached
- **No additional cost** when configured through the Azure portal for ExpressRoute connections

For detailed information about how Connection Monitor works, endpoint types, test directions, and monitoring capabilities, see [Connection Monitor overview](../network-watcher/connection-monitor-overview.md).

## Regional considerations

Connection Monitor has regional requirements that affect which endpoints can serve as test sources.

### Source endpoint requirements

Only endpoints in the same Azure region as your ExpressRoute connection can serve as source endpoints. This limitation affects the number and direction of tests that Connection Monitor creates.

**Key points:**

- Endpoints in any region can be destination endpoints
- Only endpoints in the ExpressRoute connection region can be source endpoints
- Each endpoint can be used as a source in one test and as a destination in another test

### Example scenario

Your ExpressRoute connection is in **East US** and you select the following endpoints:

**On-premises endpoints:**
- Arc-enabled server 1 in East US
- Arc-enabled server 2 in West US

**Azure endpoints:**
- Virtual network 1 in East US
- Virtual network 2 in West US

**Connection Monitor creates these tests:**

| Test direction | Source | Destination | Reason |
|----------------|--------|-------------|--------|
| Azure to on-premises | Virtual network 1 (East US) | Arc-enabled server 1 | Virtual network 1 is in the ExpressRoute connection region |
| Azure to on-premises | Virtual network 1 (East US) | Arc-enabled server 2 | Virtual network 1 is in the ExpressRoute connection region |
| On-premises to Azure | Arc-enabled server 1 (East US) | Virtual network 1 | Arc-enabled server 1 is in the ExpressRoute connection region |
| On-premises to Azure | Arc-enabled server 1 (East US) | Virtual network 2 | Arc-enabled server 1 is in the ExpressRoute connection region |

**Connection Monitor doesn't create these tests:**

- Arc-enabled server 2 to Azure endpoints because Arc-enabled server 2 is in West US, not the ExpressRoute connection region
- Virtual network 2 to Arc-enabled servers because virtual network 2 is in West US, not the ExpressRoute connection region

### Planning your endpoint selection

To maximize test coverage for your ExpressRoute connection:

1. **Place endpoints in the same region as your ExpressRoute connection** when possible to enable bi-directional testing
1. **Use Azure Arc** to enable bi-directional testing from on-premises endpoints
1. **Consider multiple ExpressRoute connections** in different regions if you need comprehensive multi-region monitoring

For complete details about endpoint types and test directions, see [Connection Monitor overview](../network-watcher/connection-monitor-overview.md).

## Azure endpoint configuration

Connection Monitor has specific behaviors and limitations when working with Azure endpoints.

### Automatic endpoint selection

Connection Monitor automatically selects endpoints in the same region as your ExpressRoute connection because they provide the most comprehensive test coverage. You can manually select or deselect endpoints from other regions as needed.

### Virtual network visibility

Only virtual networks that contain at least one virtual machine or Virtual Machine Scale Set appear in the endpoint list. If your virtual network only has other resources (like App Service, Azure Kubernetes Service, or databases), it won't be listed.

### Virtual machine sampling

Connection Monitor selects up to three virtual machines per virtual network and automatically installs the Network Watcher extension on them. You can't manually choose which specific VMs are used.

### Endpoint limits

You can select up to 30 Azure virtual networks as endpoints per Connection Monitor. If you need to monitor more endpoints, contact Azure support to discuss your requirements.

For detailed information about test configurations, monitoring status indicators, and analyzing test results, see [Connection Monitor overview](../network-watcher/connection-monitor-overview.md).

## Pricing

Connection Monitor tests created for ExpressRoute connections through the Azure portal are **free of charge**. This benefit applies when you enable Connection Monitor while creating a new ExpressRoute connection or add it to an existing connection through the portal.

The free benefit includes:
- All tests automatically created between your selected endpoints
- No limit on the number of tests
- No monthly charges for these ExpressRoute monitoring tests

The free benefit doesn't include:
- Connection Monitor tests created through other methods (PowerShell, CLI, ARM templates, or REST API)
- Connection Monitor tests for non-ExpressRoute scenarios
- Azure Alerts and Log Analytics workspace storage costs

For non-portal scenarios, standard [Azure Network Watcher Connection Monitor pricing](https://azure.microsoft.com/pricing/details/network-watcher/) applies. To take advantage of free monitoring, always configure Connection Monitor through the Azure portal when working with ExpressRoute connections.

## Next steps

- [Configure Connection Monitor for ExpressRoute](configure-connection-monitor.md)
- [Configure alerts for Connection Monitor](connection-monitor-alerts.md)
- [Monitor Azure ExpressRoute](monitor-expressroute.md)
