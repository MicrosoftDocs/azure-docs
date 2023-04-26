---
title: Internet peering - FAQ
description: Internet peering frequently asked questions (FAQ)
services: internet-peering
author: halkazwini
ms.service: internet-peering
ms.topic: conceptual
ms.date: 03/29/2023
ms.author: halkazwini
ms.custom: engagement-fy23, template-concept
---

# Internet peering frequently asked questions (FAQ)


## What is the difference between Internet peering and Peering Service?

Peering Service provides enterprise-grade public IP connectivity to Microsoft for customers. Enterprise grade Internet includes connectivity through partner ISPs that have high throughput capacity to Microsoft and redundancy for reliable connectivity. Peering Service providers receive a customer’s registered traffic directly from Microsoft at locations that are selected by the customer.

## What is legacy peering?

Peering connections that were set up outside of the automated portal process and aren't shown as resources in your Azure subscription are considered legacy peerings. It's encouraged but not required to set up all peering connections in the Azure portal and to convert legacy peerings to Azure resources so that a peer can view and manage all of their peering connections to the Microsoft network. By utilizing the Azure portal, peers can also view performance metrics and submit support tickets. If a peer is interested in becoming a MAPS partner, then converting legacy peerings to Azure Resources is a requirement.

## What is the minimum link speed for an interconnect?

10 Gbps.

## When will peering IP addresses be allocated and displayed in the Azure portal?

Our automated process allocates IP addresses and sends the information via email to the PNI requestor after the port is configured on our side. This may take up to a week after the request has been submitted as the port has been cabled before it can be configured.

## What Microsoft routes will be advertised over Peering Service connections?

Microsoft advertises all of Microsoft's public service prefixes over the Peering Service connections. This will ensure not only communications, but other cloud services are accessible from the same connection.