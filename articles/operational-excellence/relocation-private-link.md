---
title: Relocation guidance for Azure Private Link
titleSufffix: Azure Private Link
description: Find out about relocation guidance for Azure Private Link
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 12/11/2023
ms.service: private-link
ms.topic: conceptual
ms.custom:
  - subject-relocation
---

# Relocate Azure Public IP to another region

This article shows you how to relocate [Azure Private Link](/azure/private-link/private-link-overview) when moving a Platform as a Service (PaaS) service to another region. 


## Relocate Azure Private Link Service


1. Deploy all the dependent resources used in the Private Link service, such as Application Insights, Storage, etc.

2. Prepare the Source Log Analytics Workspace for the move by using a Resource Manager template. Export the Source Log Analytics Workspace template from Azure portal.

3. Give the new reference used in the parameter file of Private Link service:

  - Mark the location as global.
  - Rename the name of the private link used in the `deploy.json`` file as per parameter file changed name.

4. Trigger the Push Pipeline for a successful relocation.


:::image type="content" source="media/relocation/consumer-provider-endpoint.png" alt-text="Diagram that illustrates relocation process for Private Link service.":::


## Azure Private Endpoint DNS Integration

It's important to correctly configure your DNS settings to resolve the private endpoint IP address to the fully qualified domain name (FQDN) of the connection
string.

Existing Microsoft Azure services might already have a DNS configuration for a public endpoint. This configuration must be overridden to connect using your private endpoint.

The network interface associated with the private endpoint contains the information to configure your DNS. The network interface information includes FQDN and private IP addresses for your private link resource.

You can use the following options to configure your DNS settings for private endpoints:

- **Use the host file (only recommended for testing).** You can use the host
  file on a virtual machine to override the DNS.
- **Use a private DNS zone.** You can use private DNS zones to override the DNS
  resolution for a private endpoint. A private DNS zone can be linked to your
  virtual network to resolve specific domains.
- **Use your DNS forwarder (optional).** You can use your DNS forwarder to
  override the DNS resolution for a private link resource. Create a DNS
  forwarding rule to use a private DNS zone on your DNS server hosted in a
  virtual network.