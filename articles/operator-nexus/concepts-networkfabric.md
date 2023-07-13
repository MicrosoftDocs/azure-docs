---
title: "Azure Operator Nexus: Network Fabric"
description: Overview of Network Fabric resources for Azure Operator Nexus.
author: surajmb
ms.author: surmb
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 07/10/2023
ms.custom: template-concept
---

# Azure Operator Nexus - Network Fabric
Azure Operator Nexus offers various capabilities to manage the lifecycle and configuration of the networking required to run the Operator's infrastucture and workloads. 

Operator Nexus enables you to -

* Single pane of glass to manage your on-premises networking devices and their configuration.
* Create infrastructure and workload networks which are isolated.
* Configure route policies to import and export specific routes to and from your existing infrastructure network.
* Monitor and audit device performance, health, and configuration changes and take action against them via metrics, logs, and alerts.
* Set access policies to govern who can manage the network.
* Manage the lifecycle of the network devices.
* Tap or mirror desired network data with Network Packet Broker.
* Get highly available and robust control plane for your network infrastructure.

Operator Nexus enables the above via the following Network Fabric resources -

* [Network Fabric Controller](#network-fabric-controller)
* [Network Fabric](#network-fabric)
* [Network Racks](#network-racks)
* [Network Devices](#network-devices)
* [Isolation Domains](#isolation-domains)
* [Route Policies](#route-policies)
* [Network Packet Broker](#network-packet-broker)

:::image type="content" source="media/networking-concepts-1.png" alt-text="Network Fabric Resource Types.":::

## Network Fabric Controller

Network Fabric Controller (NFC) is an Operator Nexus resource which runs in your subscription in your desired resource group. The Network Fabric Controller acts as a bridge between the Azure control plane and your on-premises infrastructure to manage the lifecycle and configuration of the Network Devices in a Network Fabric instance.

The Network Fabric Controller achieves this by establishing a private connectivity channel between your Azure environment and on-premises using Azure ExpressRoute and other supporting resources which are deployed in a managed resource group. The NFC is typically the first resource which you would create to establish this connectivity to bootstrap and configure your management and workload networks.

The Network Fabric Controller enables you to manage all the Network resources within your Operator Nexus instance like Network Fabric, Network Racks, Network Devices, Isolation Domains, Route Policies, etc.

You can manage the lifecycle of a Network Fabric Controller via Azure using any of the supported interfaces - Azure CLI, REST API, etc. See [how to create a Network Fabric Controller](./howto-configure-network-fabric-controller.md) to learn more.

## Network Fabric

Network Fabric (NF) is an Operator Nexus resource is a representation of your on-premises network topology in Azure. Every Network Fabric must be associated to and controlled by a Network Fabric Controller which is deployed in the same Azure region. You can associate up to 20 Network Fabric resources per Network Fabric Controller. A single deployment of Operator's infrastructure is considered a Network Fabric intance.

Operator Nexus allows you to create Network Fabrics based on specific SKU types, where each SKU represents the number of network racks and compute servers in each rack deployed on-premises. You can create Network Fabric of the following SKU types -

* M4-A400-A100-C16-aa for up to four compute racks and 16 servers in each rack
* M8-A400-A100-C16-aa for up to eight compute racks and 16 servers in each rack

Each Network Fabric resource can contain a collection of network racks, network devices, isolation domains for their interconnections. Once a Network Fabric is created and you've validated that your network devices are connected, then it can be Provisioned. Provisioning a Network Fabric is the process of bootstrapping the Network Fabric instance to get the management network up.

** Add NNI and Network Fabric unique features like multicast, SCTP, jumbo frames.

You can manage the lifecycle of a Network Fabric via Azure using any of the supported interfaces - Azure CLI, REST API, etc. See [how to create and provision a Network Fabric](./howto-configure-network-fabric.md) to learn more.

## Network Racks

Network Rack resource is a representation of your on-premises Racks from the networking perspective. The number of network racks in an Operator Nexus instance depends on the Network Fabric SKU which was chosen while creation. In a multi-rack setup, you can create up to either 4 compute racks + 1 aggregate rack or 8 compute racks + 1 aggregate rack.

Each network rack consists of Network Devices which are part of that rack. For example - Customer Edge (CE) routers, Top of Rack (ToR) Switches, Management Switches, Network Packet Brokers (NPB).

The lifecycle of Network Rack resources are tied to the Network Fabric resource. The Network Racks are automatically created when you create the Network Fabric and the number of racks depends on the SKU which was chosen. When the Network Fabric resource is deleted, all the associated Network Racks are also deleted along with it.

## Network Devices

Network Devices represent the Customer Edge (CE) routers, Top of Rack (ToR) Switches, Management Switches, Network Packet Brokers (NPB) which are deployed as part of the Network Fabric instance. Each Network Device resource is associated to a specific Network Rack where it is deployed.

Each network device resource has a SKU, Role, Host Name, and Serial Number as properties, and can have multiple network interfaces associated. Network Interfaces contain the IPv4 and IPv6 addresses, physical identifier, interface type, and the associated connections. Network Interfaces also has the administrativeState property which indicates whether the interface is enabled or disabled.

The lifecycle of the Network Interface depends on the Network Device and can exist as long as the parent network device resource exists. However, you can perform certain operations on a network interface resource like enable/disable the administrativeState via Azure using any of the supported interfaces - Azure CLI, REST API, etc.

The lifecycle of the Network Device resources depend on the network rack resource and will exist as long as the parent Network Fabric resource exists. However, before provisioning the Network Fabric, you can perform certain operations on a network device like setting a custom hostname and updating the serial number of the device via Azure using any of the supported interfaces - Azure CLI, REST API, etc.

## Isolation Domains

Isolation Domains enable east-west or north-south connectivity across Operator Nexus instance. They provide the required network connectivity between infrastructure components and also workload components. In principle, there are two types of networks which are established by isolation domains - management network and workload or tenant network. 

Management network is the private connectivity that enables communication between the Network Fabric instance which is deployed on-premises and Azure Virtual Network. You can create workload or tenant networks to enable communication between the workloads which are deployed across the Operator Nexus instance.

Each isolation domain is associated to a specific Network Fabric resource and has the option to be enabled/disabled. Only when an isolation domain is enabled, it's configured on the network devices and the configuration is removed once the isolation domain is removed.

Primarily, there are two types of isolation domains -

* Layer 2 or L2 Isolation Domains
* Layer 3 or L3 Isolation Domains

Layer 2 isolation domains enable your infrastructure and workloads communicate with each other within or across racks over a Layer 2 network. Layer 2 networks enable east-west communication within your Operator Nexus instance. You can configure an L2 isolation domain with a desired Vlan ID and MTU size. You can set MTU value anywhere from 1500 to 9000 (jumbo frames).

Layer 3 isolation domains enable your infrastructure and workloads communicate with each other within or across racks over a Layer 3 network. Layer 3 networks enable east-west and north-south communication within and outside your Operator Nexus instance.

There are two types of Layer 3 networks that you can create -

* Internal Network
* External Network

Internal networks enable layer 3 east-west connectivity across racks within the Operator Nexus instance and external networks enable layer 3 north-south connectivity from the Operator Nexus instance to networks outside the instance. A Layer 3 isolation domain must be configured with at least one internal network and external networks are optional.

## Route Policies

## Network Packet Broker

The Network Packet Broker resources represent the Network Packet Broker devices in your Operator Nexus instance.



