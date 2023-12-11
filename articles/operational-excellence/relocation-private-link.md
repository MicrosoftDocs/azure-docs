---
title: Relocation guidance for Azure Private Link
titleSufffix: Azure Database for Azure Private Link
description: Find out about relocation guidance for Azure Private Link
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 12/11/2023
ms.service: postgresql
ms.topic: conceptual
ms.custom:
  - references_regions
  - subject-reliability
---

# Relocation guidance for Azure Public IP

This article shows you how to relocate Azure Private Link when moving a Platform as a Service (PaaS) service to another region. 

The Azure Private Link service is the reference to your own service that's powered by Azure Private Link. Your service runs behind Azure Standard Load
Balancer and can enabled for Private Link access so that clients can get private access from their own VNets. Clients can create a private endpoint inside their VNet and map that endpoint to this service.

A private endpoint is a network interface that uses a private IP address from your virtual network. This network interface connects you privately and securely
to a service powered by Azure Private Link. By enabling a private endpoint, you're bringing the service into your virtual network.


## Relocate Azure Private Link Service


1. Deploy all the dependent resources used in the Private Link service, such as Application Insights, Storage, etc.

2. Prepare the Source Log Analytics Workspace for the move by using a Resource Manager template. Export the Source Log Analytics Workspace template from Azure portal.

3. Give the new reference used in the parameter file of Private Link service:

  - Mark the location as global.
  - Rename the name of the private link used in the `deploy.json`` file as per parameter file changed name.

4. Trigger the Push Pipeline for a successful relocation.


## Azure Private Endpoint DNS Integration