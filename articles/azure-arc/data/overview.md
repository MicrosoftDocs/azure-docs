---
title: What are Azure Arc enabled data services
description: Introduces Azure Arc enabled data services 
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 08/04/2020
ms.topic: overview
# Customer intent: As a data professional, I want to understand why my solutions would benefit from running with Azure Arc enabled so that I can leverage the capability of the feature.
---

# What are Azure Arc enabled data services?

Azure Arc enables running Azure data services on-premises, at the edge, and in public clouds using Kubernetes and the infrastructure of your choice.  

## Azure Arc enabled data services are in preview

Currently, the following Azure Arc enabled data services are available in preview:

- SQL Managed Instance
- PostgreSQL Hyperscale

## Always current
Azure Arc enabled data services such as Azure SQL managed instance and Postgres Hyperscale receive updates on a frequent basis including servicing patches and new features similar to the experience in Azure.  Updates from the Microsoft Container Registry are provided to customers and deployment cadences are set by customers in accordance with their policies. This way, on-premises databases can stay up to date while ensuring customers maintain control.  Because Azure Arc enabled data services are a subscription service, customers will no longer face end-of-support situations for their databases.

## Elastic scale
Cloud-like elasticity on-premises enables customers to scale their databases up or down dynamically in much the same way as they do in Azure, based on the available capacity of their infrastructure. This capability can satisfy burst scenarios that have volatile needs, including scenarios that require ingesting and querying data in real time, at any scale, with subsecond response time. In addition, customers can also scale out database instances using Postgres Hyperscale's unique hyper-scale deployment option of Azure Database for PostgreSQL. This capability gives data workloads an additional boost on capacity optimization, using unique scale-*out* reads and writes.

## Self-service provisioning
Azure Arc also provides other cloud benefits such as fast deployment and automation at scale. Thanks to Kubernetes-based orchestration, customers can deploy a database in seconds using either GUI or CLI tools.

## Unified management
Using familiar tools such as the Azure portal, Azure Data Studio, and the Azure Data CLI, customers can now gain a unified view of all their data assets deployed with Azure Arc. Customers are able to not only view and manage a variety of relational databases across their environment and Azure, but also get logs and telemetry from Kubernetes APIs to analyze the underlying infrastructure capacity and health. Besides having localized log analytics and performance monitoring, customers can now leverage Azure Monitor for comprehensive operational insights across their entire estate.

## Support for disconnected scenarios

Many of the services such as self-service provisioning, automated backups/restore, and monitoring can run locally in your infrastructure with or without a direct connection to Azure.  Connecting directly to Azure opens up additional options for integration with other Azure services such as Azure Monitor and the ability to use the Azure portal and Azure ARM APIs from anywhere in the world to manage your Azure Arc enabled data services.


## Next steps

[Deploy the Azure Arc data controller](create-data-controller.md)

[Deploy an Azure SQL managed instance on Azure Arc](create-sql-managed-instance.md) (requires deployment of an Azure Arc data controller first)

[Deploy an Azure Database for PostgreSQL Hyperscale server group on Azure Arc](create-postgresql-instances.md) (requires deployment of an Azure Arc data controller first)