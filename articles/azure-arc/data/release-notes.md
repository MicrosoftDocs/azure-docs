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

## Known limitations and issues

- SQL managed instance names can not be greater than 13 characters
- No in-place upgrade for the Azure Arc data controller or database instances.
- Arc enabled data services container images are not signed.  You may need to configure your Kubernetes nodes to allow unsigned container images to be pulled.  For example, if you are using Docker as the container runtime, you can set the DOCKER_CONTENT_TRUST=0 environment variable and restart.  Other container runtimes have similar options such as in [OpenShift](https://docs.openshift.com/container-platform/4.5/openshift_images/image-configuration.html#images-configuration-file_image-configuration).
- Cannot create Azure Arc enabled SQL Managed instances or PostgreSQL Hyperscale server groups from the Azure portal.
- SQL and PostgreSQL login authentication only.  No support for Azure Active Directory or Active Directory.
- Deploying on OpenShift requires relaxed security constraints.  See documentation for details.
- Scaling the number of Postgres Hyperscale worker nodes _down_ is not supported.
- If you are using Azure Kubernetes Service Engine (AKS Engine) on Azure Stack Hub with Azure Arc data controller and database instances, upgrading to a newer Kubernetes version is not supported. Uninstall Azure Arc data controller and all the database instances before upgrading the Kubernetes cluster. 