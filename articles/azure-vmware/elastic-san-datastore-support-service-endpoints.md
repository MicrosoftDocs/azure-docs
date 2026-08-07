---
title: Azure Elastic SAN datastore support on AVS using service endpoints
description: Azure Elastic SAN on AVS with using service endpoints
ms.topic: how-to
ms.service: azure-vmware
author: jobingeorge-microsoft
ms.author: jobingeorge
ms.date: 08/07/2026
# Customer intent: "As a cloud or storage administrator, I want to attach elastic SAN with an Azure VMware Solution private cloud using a service endpoint."
---

# Elastic SAN datastore support on Azure VMware Solution using service endpoints


>[!IMPORTANT]
> Elastic SAN datastore support on Azure VMware Solution using service endpoints is only available for new datastores being attached to the private cloud and only for a private cloud architecture using AVS Gen 2 currently.

Azure Elastic SAN is a cloud-native storage area network (SAN) solution that provides high-performance, cost-effective block storage for Azure workloads. When you integrate it with Azure VMware Solution (AVS), Elastic SAN can serve as an external datastore. By using this architecture, AVS customers can scale storage capacity independently from compute resources while maintaining enterprise-grade performance and reliability.

This document describes how Azure VMware Solution ESXi hosts connect to Elastic SAN datastores by using **Azure Virtual Network service endpoints**. This approach provides secure, optimized connectivity over the Azure backbone network without traversing the public internet.

## Current approach: Private endpoint connectivity

Currently, you achieve Elastic SAN connectivity to AVS by using **Azure Private Endpoints**. While Private Endpoints provide secure, private connectivity, they come with associated costs and considerations.

## Private Endpoint architecture

ESXi Host (vmk0) → Management VNet → Private Endpoint → Elastic SAN

A Private Endpoint creates a private IP address from your VNet's address space and maps it to the Elastic SAN resource, enabling private connectivity.

## Cost example

For a typical AVS environment with Elastic SAN:
- Storage throughput: 10 TB/month read + 10 TB/month write = 20 TB/month
- Private Endpoint cost: $7.30/month
- **Data processing cost: 20,000 GB × $0.01 = $200/month**
- **Total monthly cost: ~$207.30**

For high-performance workloads with 100 TB/month throughput:
- **Data processing cost: 100,000 GB × $0.01 = $1,000/month**

These costs increase linearly with storage I/O, making Private Endpoints expensive for high-throughput scenarios.

## Why use service endpoints for Elastic SAN on AVS?

**Azure Virtual Network service endpoints** extend your VNet private address space to Azure services over an optimized route through the Azure backbone network. For AVS and Elastic SAN integration, service endpoints provide:

## Key benefits

-  **Private connectivity**
    - Elastic SAN traffic remains on the Azure backbone.
    - No public internet exposure.
    - Private IP addressing throughout the path.
-  **Optimized routing**
    - Direct path from ESXi hosts to Elastic SAN.
    - Lower latency compared to internet routing.
    - Consistent network performance.
-  **Enhanced security**
    - Service-level firewall rules restrict access to specific VNets.
    - Network traffic never leaves Microsoft network.
    - Eliminates public endpoint exposure.
-  **Simplified network architecture**
    - No need for NAT Gateway or Azure Firewall for storage traffic.
    - Simplified routing configuration.
    - Reduced network complexity.
-  **No bandwidth charges**
    - Traffic between VNet and Elastic SAN incurs no egress costs.
    - Cost-effective for large storage workloads.
    - Predictable networking costs.

## Use Cases

Elastic SAN datastores on AVS are ideal for:

- **Capacity Expansion**: Add storage without adding ESXi hosts

- **Performance-Intensive Workloads**: High IOPS/throughput requirements

- **Test/Dev Environments**: Rapidly provision and deprovision storage

- **Disaster Recovery**: Cost-effective storage for DR replicas

- **Data Migration**: Temporary storage during cloud migrations

**Architecture Overview**

The integration architecture consists of:

-  **ESXi Hosts**: VMware hypervisors running on Azure Fleet hardware

-  **vmk0 Interface**: ESXi management kernel port attached to Management VNet

-  **Service endpoint**: Microsoft.Storage endpoint enabled on vmk0 subnet

-  **Elastic SAN**: Block storage service with iSCSI targets

-  **iSCSI Connection**: ESXi Software iSCSI initiator connects to Elastic SAN volumes

  > [!NOTE]
  > Service endpoint support for Elastic SAN is available for **Enterprise Train on Fleet (AVS Gen 2)** deployments only. Traditional AVS deployments continue to use Private Endpoints.


## Proposed Changes for service endpoint Support

### Overview of Required Changes

In AVS Gen 2 architecture, Elastic SAN connectivity will use **service endpoints exclusively** instead of Private Endpoints. Service endpoints are always available on the Management VNet, eliminating the need for Private Endpoint resources and associated data processing charges.

### 2.1 Service endpoint Configuration

**Change**: Enable `Microsoft.Storage` service endpoint on the vmk0 subnet in Management VNet

```
Management VNet Configuration:
vmk0 Subnet (100.73.240.0/24):
Service endpoints:
    - Microsoft.Storage \# Existing (for backup)
    - Microsoft.KeyVault \# Existing (for KMS)
    - Microsoft.Storage.ElasticSan \# NEW - For Elastic SAN iSCSI connectivity
```

**Rationale**: Service endpoints provide optimized routing from ESXi hosts to Elastic SAN over the Azure backbone without requiring Private Endpoints.

### 2.2 Elastic SAN Firewall Configuration

**Change**: Configure Elastic SAN firewall to allow access from Management VNet

```
Elastic SAN Firewall Rules:
**Network Access:**
- Type: Virtual Network Rule
- VNet: Management VNet (SP Subscription)
- Subnet: vmk0 Subnet (100.73.240.0/24)
- Action: Allow
```

**Rationale**: Service endpoints require the Elastic SAN resource to explicitly allow traffic from the VNet/subnet.

### 2.3 ESXi iSCSI Configuration

**Change**: Configure ESXi Software iSCSI initiator to use vmk0 interface and connect to Elastic SAN using public hostname

```
ESXi iSCSI Configuration:
- Binding: vmk0 (100.73.240.x)
- Discovery: Dynamic Discovery / Static Target
- Target Portal: \<esan-name\>.z\<zone\>.blob.storage.azure.net:3260
- Target IQN: iqn.2023-01.com.microsoft.azure:\<volume-id\>
- Authentication: CHAP (if configured)
```

### Key Changes:

- ESXi connects using Elastic SAN **public hostname** (not Private Endpoint IP)
- Service endpoint routes traffic directly to Elastic SAN over Azure backbone
- Hostname format: \<elasticsan-name\>.z\<availability-zone\>.blob.storage.azure.net
- Port: 3260 (standard iSCSI port)

**Rationale**: Service endpoints resolve Elastic SAN public hostnames and route traffic optimally over Azure backbone, eliminating the need for private IPs from Private Endpoints.

### 2.4 Datastore API Changes

**Change**: Update datastore provisioning workflow to use service endpoint connectivity exclusively

**Previous flow**:

1. Customer creates Elastic SAN volume
1. Customer creates Private Endpoint in Customer VNet
1. Customer calls AVS API with elasticSanVolume.targetId
1. AVS makes S2S call to Elastic SAN via Private Endpoint
1. AVS retrieves iSCSI details (targetIqn, targetPortalEndpoints with Private IP)
1. AVS configures ESXi iSCSI initiator with Private Endpoint IP
1. ESXi connects to Elastic SAN via Private Endpoint
1. Datastore mounted in vCenter

**AVS Gen 2 Flow** (Service endpoint - Default):

1. Customer creates Elastic SAN volume
1. Customer configures Elastic SAN firewall to allow Management VNet
1. Customer calls AVS API with elasticSanVolume.targetId
1. AVS makes S2S call to Elastic SAN (resolves public hostname via service endpoint)
1. AVS retrieves iSCSI details (targetIqn, targetPortalHostname)
1. AVS extracts public hostname from targetPortalHostname field
1. AVS configures ESXi iSCSI initiator with hostname and vmk0 binding
1. ESXi resolves hostname via DNS and connects via service endpoint (vmk0)
1. Datastore mounted in vCenter

**Key Changes**:

- **No Private Endpoint creation** required by customer
- **Hostname-based discovery**: Uses targetPortalHostname instead of targetPortalEndpoints with private IPs
- **DNS resolution**: ESXi resolves Elastic SAN public hostname to Azure backbone IPs
- **Service endpoint routing**: Traffic automatically routed over Azure backbone

**API Contract Changes**:

- Input: elasticSanVolume.targetId remains unchanged
- Processing: Extract hostname from Elastic SAN volume properties instead of private endpoint IP
- Output: Configure ESXi with hostname-based iSCSI target

### 2.5 Connectivity Path

Norway East fleet native routes through SE, while other regions route through the private endpoint. Otherwise, the private endpoint is used.

**Key Differences**:

- **No Private Endpoint resource** needed
- **Hostname-based addressing** instead of private IP
- **DNS-based discovery** using Azure-provided hostnames
- **Zero data processing charges**

### 2.6 Security Considerations

**No security degradation**:
- Traffic remains on Azure backbone (both approaches)
- No public internet exposure (both approaches)
- VNet-level access control (service endpoint firewall rules)
- Optional CHAP authentication for iSCSI
- TLS encryption for management API calls

**Service endpoint provides**:
- Simpler network topology (no Private Endpoint resources)
- Reduced operational overhead
- Same security posture as Private Endpoints

### 2.7 Limitations & Considerations

- **AVS Gen 2 Exclusive**: Service endpoint approach for Elastic SAN is:
    - **Default and only option** for AVS Gen 2 deployments
    - Service endpoints always available on vmk0 subnet in Management VNet
    - No Private Endpoint creation required

- **Not Supported**:
    - Traditional AVS (stretched cluster model) - continues using existing approaches
    - Private Endpoint connectivity for Elastic SAN in AVS Gen 2

- **Technical Requirements**:
    - Elastic SAN firewall must allow Management VNet subnet (100.73.240.0/24)
    - Elastic SAN and AVS must be in same Azure region
    - DNS resolution required for Elastic SAN public hostnames
    - vmk0 interface must have access to Azure DNS (100.72.x.x)

- **Hostname Resolution**:
    - Elastic SAN hostname format: `<elasticsan-name>.z<zone>.blob.storage.azure.net`
    - Resolved via Azure Managed DNS in Management VNet
    - Returns Azure backbone IPs for optimal routing

- **Regional Requirements**:
    - Elastic SAN and AVS must be in same Azure region
    - Cross-region connectivity not supported via service endpoints

## Add an Elastic SAN volume as a datastore

Configure all private endpoints before attaching a volume as a datastore. Adding private endpoints after a volume is attached as a datastore requires detaching the datastore and reconnecting it to the cluster. [Learn more](/azure/azure-vmware/configure-azure-elastic-san#add-an-elastic-san-volume-as-a-datastore).

## Configure an Azure Storage service endpoint

To configure an Azure Storage service endpoint from the virtual network where access is required, you must have permission to the `Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action` [Azure resource provider operation](/azure/role-based-access-control/permissions/networking#microsoftnetwork) via a custom Azure role to configure a service endpoint. [Learn more](/azure/storage/elastic-san/elastic-san-configure-service-endpoints?tabs=azure-portal#configure-an-azure-storage-service-endpoint).
