---
title: Azure Arc enabled data services - Release notes
description: Latest release notes 
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 08/04/2020
ms.topic: conceptual
# Customer intent: As a data professional, I want to understand why my solutions would benefit from running with Azure Arc enabled data services so that I can leverage the capability of the feature.
---

# Release notes - Azure Arc enabled data services (Preview)

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## September, 2020

Azure Arc enabled data services is released for public preview. Arc enabled data services allows you to manage data services anywhere.

- SQL Managed Instance
- PostgreSQL Hyperscale

For instructions see [What are Azure Arc enabled data services?](overview.md)

## Next steps

> **Just want to try things out?**  
> Get started quickly with [Azure Arc JumpStart](https://github.com/microsoft/azure_arc#azure-arc-enabled-data-services) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM.

[Install the client tools](install-client-tools.md)

[Deploy the Azure Arc data controller](create-data-controller.md) (requires installing the client tools first)

After you deploy the data controller, see [Deploy an Azure SQL managed instance on Azure Arc](create-sql-managed-instance.md) 

[Deploy an Azure Database for PostgreSQL Hyperscale server group on Azure Arc](create-postgresql-hyperscale-server-group.md) (requires deployment of an Azure Arc data controller first)
