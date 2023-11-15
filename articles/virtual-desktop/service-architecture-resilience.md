---
title: Azure Virtual Desktop service architecture and resilience
description: Learn about the service architecture of Azure Virtual Desktop and how it has been designed to be resilient.
ms.topic: conceptual
author: dknappettmsft
ms.author: daknappe
ms.date: 10/19/2023
---

# Azure Virtual Desktop service architecture and resilience

Azure Virtual Desktop is designed to provide a resilient, reliable, and secure service for organizations and users. The architecture of Azure Virtual Desktop comprises many components that make up the service connecting users to their desktops and apps. Most components are Microsoft-managed, but some are customer-managed.

Microsoft provides the virtual desktop infrastructure (VDI) components for core functionality as a service. These components include:

- **Web service**: the user-facing web site and endpoint, and returns the connection information to the user's device.
- **Broker service**: orchestrates incoming connections.
- **Gateway service**: a websocket service that provides the Remote Desktop Protocol (RDP) connectivity from a user's device wherever they're connecting from to the session hosts providing their desktops and apps.
- **Resource directory**: provides information to instruct the web service which of the multiple geographical databases hosts the connection information required for each user.
- **Geographical database**: contains the connection files (`.rdp`) and icons for every resource that a user has been provisioned.

In addition, Azure Virtual Desktop uses other global Azure services, such as [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) and [Azure Front Door](../frontdoor/front-door-overview.md) to direct users to their closest Azure Virtual Desktop entry points.

You're responsible for creating and managing session hosts, including any operating system image customizations and applications, virtual network connectivity, the resiliency, and the backup and recovery of those session hosts. You also provide and manage user identities and control access to the service. You can use other Azure services to help you meet your requirements, such as:

- [Azure availability zones](https://azure.microsoft.com/explore/global-infrastructure/availability-zones) to distribute your session hosts across physically separate datacenter locations within an Azure region, each with independent power, cooling, and networking.
- [Azure Backup](https://azure.microsoft.com/products/backup) to back up and restore your session hosts.
- [Azure Site Recovery](https://azure.microsoft.com/products/site-recovery) to replicate your session hosts to another Azure region.
- [Azure Advisor](https://azure.microsoft.com/products/advisor) to help you optimize your Azure resources.

This high-level diagram shows the components and responsibilities:

:::image type="content" source="media/service-architecture-resilience/service-components-management.svg" border="false" alt-text="A diagram showing who manages the components of Azure Virtual Desktop.":::

## User connections

When a user wants to access their desktops and apps in Azure Virtual Desktop, multiple components are involved in making that connection successful. There are two separate sequences:

1. Feed discovery. The feed is the list of desktops and apps that are available to the user.
1. A connection using the Remote Desktop Protocol to a session host.

### Feed discovery

During feed discovery, the desktops and apps available to the user are populated in the app on their local device. The feed contains all the information needed to connect.

The feed discovery process is as follows:

1. The user might be located anywhere in the world. Azure Traffic Manager routes the user's device to the closest instance of the Azure Virtual Desktop web service based on the [geographic traffic-routing method](../traffic-manager/traffic-manager-routing-methods.md#geographic-traffic-routing-method), which uses source IP address of the user's device. 

1. The web service connects to the Azure Virtual Desktop broker service in the same Azure region to retrieve the RDP files and application icons for the user's feed. The broker service connects to the Azure Virtual Desktop geographical database and resource directory in the same region to retrieve the information.

1. The broker service returns the RDP files and application icons to the web service, which returns the information to the user's device.

   Here's a high-level diagram showing the feed discovery process in a single Azure region:

   :::image type="content" source="media/service-architecture-resilience/feed-discovery-single.svg" border="false" alt-text="A diagram showing the feed discovery process in a single Azure region." lightbox="media/service-architecture-resilience/feed-discovery-single.svg":::

   The geographical database only contains the information required for desktops and apps from host pools in the same Azure regions covered by the geography. If the user is assigned to desktops or apps from a host pool that is covered by a different geography, the resource directory tells the web service to connect to the broker service and geographical database in the correct Azure region.

   Here's a high-level diagram showing the feed discovery process for a host pool in an Azure region that's covered by a different geography:

   :::image type="content" source="media/service-architecture-resilience/feed-discovery-multi.svg" border="false" alt-text="A diagram showing the feed discovery process for a host pool in an Azure region that's covered by a different geography." lightbox="media/service-architecture-resilience/feed-discovery-multi.svg":::


### RDP connection

When a user connects to a desktop or app from their feed, the RDP connection is established as follows:

1. All remote sessions begin with a connection to [Azure Front Door](../frontdoor/front-door-overview.md), which provides the global entry point to Azure Virtual Desktop. Azure Front Door determines the Azure Virtual Desktop gateway service with the lowest latency for the user's device and directs the connection to it

1. The gateway service connects to the broker service in the same Azure region. The gateway service enables session hosts to be in any region and still be accessible to users.

1. The broker service takes over and orchestrates the connection between the user's device and the session host. The broker service instructs the Azure Virtual Desktop agent running on the session host to connect to the same gateway service that the user's device has connected through.

1. At this point, one of two connection types is made, depending on the configuration and available network protocols:

   1. **Reverse connect transport**: after both client and session host connected to the gateway service, it starts relaying the RDP traffic using Transmission Control Protocol (TCP) between the client and session host. Reverse connect transport is the default connection type.

   1. **RDP Shortpath**: a direct User Datagram Protocol (UDP)-based transport is created between the user's device and the session host, bypassing the gateway service.

Here's a high-level diagram showing the RDP connection process:

:::image type="content" source="media/service-architecture-resilience/rdp-connection.svg" border="false" alt-text="A diagram showing the RDP connection process." lightbox="media/service-architecture-resilience/rdp-connection.svg":::

> [!TIP]
> You can find more detailed technical information about network connectivity at [Understanding Azure Virtual Desktop network connectivity](network-connectivity.md) and [RDP Shortpath for Azure Virtual Desktop](rdp-shortpath.md).

## Service resilience

Azure Virtual Desktop is designed to be resilient to failures and provide a reliable service to users. The service is designed to be resilient to failures of individual components, and to be able to recover from failures quickly.

The Microsoft-managed components of Azure Virtual Desktop are currently located in around 40 Azure regions to be closer to users and provide a resilient service. Resiliency has been implemented globally, geographically, and within an Azure region in the following ways:

- [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) directs traffic for the web service and [Azure Front Door](../frontdoor/front-door-overview.md) directs traffic for the gateway service. If there's an outage that causes the web service or gateway service to be unavailable from one Azure region, or there's a full region outage, traffic is redirected to the next closest available instance in the nearest region. Redirection of the traffic enables users to still make new connections.

- The geographical database uses [Azure SQL Database](https://azure.microsoft.com/products/azure-sql/database) failover and data replication capabilities within each geography. If there's a database outage, the database fails over to the secondary replica and normal operation resumes. During failover, there's a short period of time where new connections fail until failover is complete, however this failover doesn't affect existing connections.

- The resource directory, broker service, web service, and gateway service are all available in each of the Azure regions where the Microsoft-managed components for Azure Virtual Desktop are located. Each component has multiple instances so that there isn't a single point of failure. Within each Azure region, there are at least six distinct and separate instances or clusters of each component that operates independently to withstand instance failures.

   For example, a region has enough instances of the gateway service to meet demand, but also with enough capacity to also accommodate failures of those instances. If an instance of the gateway service fails, any TCP-based RDP connections that are being relayed through that particular instance of the gateway service are dropped. When those disconnected users reconnect, the remaining instances handle requests and reconnect each user to their existing session. All other sessions handled by other instances of the gateway service are unaffected.

Here's a high-level diagram showing how the Microsoft-managed components are interconnected:

:::image type="content" source="media/service-architecture-resilience/service-architecture-resilience.svg" border="false" alt-text="A diagram showing how the Microsoft-managed components are interconnected." lightbox="media/service-architecture-resilience/service-architecture-resilience.svg":::

The other Azure services on which Azure Virtual Desktop relies are themselves designed to be resilient and reliable. For more information, see [Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) and [Azure Front Door](../frontdoor/front-door-overview.md).

## Global reach

Azure Virtual Desktop is a service that can help organizations adapt to the demands of their workers, particularly working remotely. It provides a secure, reliable, and flexible way to deliver desktops and applications virtually anywhere. Azure Virtual Desktop is designed to be resilient, using Azure features and services that help ensure a highly available service for your workloads.

Here's a map demonstrating the global reach of Azure Virtual Desktop:

:::image type="content" source="media/service-architecture-resilience/locations.svg" border="false" alt-text="A map demonstrating the global reach of Azure Virtual Desktop." lightbox="media/service-architecture-resilience/locations.svg":::

## Related content

To learn about the locations that Azure Virtual Desktop stored data for service objects, see [Data locations for Azure Virtual Desktop](data-locations.md).