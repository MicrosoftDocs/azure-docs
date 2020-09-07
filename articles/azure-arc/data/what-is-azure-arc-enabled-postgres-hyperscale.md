--- 
title: What is Azure Arc enabled PostgreSQL Hyperscale?
description: What is Azure Arc enabled PostgreSQL Hyperscale?
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# What is Azure Arc enabled PostgreSQL Hyperscale?

Azure Arc enabled PostgreSQL Hyperscale is one of the database services available as part of Azure Arc enabled data services. Azure Arc makes it possible to run Azure data services on-premises, at the edge, and in public clouds using Kubernetes and the infrastructure of your choice. The value proposition of Azure Arc enabled data services articulates around:
- Always current
- Elastic scale
- Self-service provisioning
- Unified management
- Disconnected scenario support

Read more details in the [_overview_](overview.md) and the [_connectivity_ articles](connectivity.md).

## How does _Azure Arc enabled PostgreSQL Hyperscale_ differ from _Azure Database for PostgreSQL Hyperscale (Citus)_?

:::image type="icon" source="../../../media/PostgreSQL Hyperscale 4x.svg" border="false":::_Azure SQL Database for PostgreSQL Hyperscale (Citus)_

This is the hyperscale form factor of the Postgres database engine available as database as a service in Azure (PaaS). It is powered by the Citus extension that enables the Hyperscale experience. In this form factor, the service runs in the Microsoft datacenters and is operated by Microsoft.

:::image type="icon" source="../../../media/PostgreSQL Hyperscale Arc 4x.svg" border="false":::_Azure Arc enabled PostgreSQL Hyperscale_

This is the hyperscale form factor of the Postgres database engine offered available with Azure Arc enabled Data Service. In this form factor, our customers provide the infrastructure that host the systems and operate them.

## Next steps
- **Deploy**
   >- **Just want to try things out?**  
   > Quick starter and packaged deployment option: Get started quickly with [Azure Arc JumpStart](https://github.com/microsoft/azure_arc#azure-arc-enabled-data-services) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM.

   - **Deploy on your terms:**
      - [Install the client tools](install-client-tools.md)
      - [Deploy the Azure Arc data controller](create-data-controller.md) (requires installing the client tools first)
      - [Deploy an Azure Database for PostgreSQL Hyperscale server group on Azure Arc](create-postgresql-hyperscale-server-group.md) (requires deployment of an Azure Arc data controller first)
- [**Read more about Azure Arc enabled data services**](https://azure.microsoft.com/services/azure-arc/hybrid-data-services)
- [**Read about Azure Arc**](https://http://aka.ms/azurearc)
