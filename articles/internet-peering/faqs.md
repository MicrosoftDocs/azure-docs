---
title: Internet peering - FAQ
description: This article provides answers to some of the frequently asked questions asked about Internet peering.
services: internet-peering
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: faq
ms.date: 09/20/2023
---

# Internet peering frequently asked questions (FAQ)

## General

### What is the difference between Internet peering and Peering Service?

Peering Service provides enterprise-grade public IP connectivity to Microsoft for customers. Enterprise grade Internet includes connectivity through partner ISPs that have high throughput capacity to Microsoft and redundancy for reliable connectivity. Peering Service providers receive a customer’s registered traffic directly from Microsoft at locations that are selected by the customer.

### What is legacy peering?

Peering connections that were set up outside of the automated portal process and aren't shown as resources in your Azure subscription are considered legacy peerings. It's encouraged but not required to set up all peering connections in the Azure portal and to convert legacy peerings to Azure resources so that a peer can view and manage all of their peering connections to the Microsoft network. By utilizing the Azure portal, peers can also view performance metrics and submit support tickets. If a peer is interested in becoming a MAPS partner, then converting legacy peerings to Azure Resources is a requirement.

### What is the minimum link speed for an interconnect?

10 Gbps.

### When will peering IP addresses be allocated and displayed in the Azure portal?

Our automated process allocates IP addresses and sends the information via email to the PNI requestor after the port is configured on our side. This may take up to a week after the request has been submitted as the port has been cabled before it can be configured.

### What Microsoft routes will be advertised over Peering Service connections?

Microsoft advertises all of Microsoft's public service prefixes over the Peering Service connections. This will ensure not only communications, but other cloud services are accessible from the same connection.

### Can I move Internet peering resources across resource groups or subscriptions?

For a list of resources that can be moved, see [Move operation support for resources](../azure-resource-manager/management/move-support-resources.md#microsoftpeering).

## Peering Service

### Can a carrier use existing direct peering connections with Microsoft to support Peering Service?

Yes, a carrier may use existing Private Network Interconnects (PNIs) to support Peering Service. Another PNIs may be required to support local and geo diversity requirements. Primary and secondary connections must have equal capacity. In the Azure portal, carriers can request the conversion of existing PNIs to the Peering Service configuration and can also request new Peering Service connections PNIs.

### What are the diversity requirements on a direct peering to support Peering Service?

A PNI must support local-redundancy and geo-redundancy. Local-redundancy is defined as two diverse peering connections on two routers in the same facility or in different facilities in the same metro. Geo-redundancy requires that the carrier has additional connectivity at a different Microsoft edge site within the geo-region in case the primary site fails. The carrier routes customer traffic through the backup site selected by the customer.

### The carrier already offers enterprise-grade internet, how is this offering different?

Carriers that offer SLA and enterprise-grade internet are doing so on their part of the network. However, customer traffic may use several different carrier networks before reaching the last mile that the customer has internet access contracted through. In Peering Service, Microsoft offers a higher guarantee that customer traffic will ONLY route through the Microsoft network and handoff directly to the selected carrier network, thereby receiving a full end-to-end performance guarantee.

### If a service provider already peers with Microsoft, what kind of changes are required to support Peering Service?

Peering Service partners must have an Azure subscription and manage the Peering Service connections using the Azure portal as this is where customer prefixes are registered, performance metrics are viewed, and support tickets are logged, among other features. If a provider has existing peering with Microsoft but no Azure subscription, the resources must be added to your subscription before you're able to convert these to the Peering Service configuration. During the configuration change, Microsoft changes the policy group during a hard restart of the BGP session. No configuration changes are required on the partner’s side, unless the telco partner is supporting Peering Service for voice, then BFD configuration is required. For more information, see [Azure Internet peering for Communications Services walkthrough](walkthrough-communications-services-partner.md).

