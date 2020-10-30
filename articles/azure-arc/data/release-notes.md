---
title: Azure Arc enabled data services - Release notes
description: Latest release notes 
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 09/22/2020
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

### Known issues

The following issues apply to this release:

* **Deleting PostgreSQL Hyperscale server group**: If you have changed the configuration of your server group or instance, wait for the edit operation to complete before you delete a PostgreSQL Hyperscale server group.

* **`azdata notebook run` may fail**: To work round this problem, run `azdata notebook run` in a Python virtual environment. This problem also manifests in a failed attempt to create a SQL managed instance or PostgreSQL Hyperscale server group using the Azure Data Studio deployment wizard. In this case, you can open the notebook and click the **Run all** button at the top of the notebook.

## Next steps

> **Just want to try things out?**  
> Get started quickly with [Azure Arc Jumpstart](https://github.com/microsoft/azure_arc#azure-arc-enabled-data-services) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM.

[Install the client tools](install-client-tools.md)

[Create the Azure Arc data controller](create-data-controller.md) (requires installing the client tools first)

[Create an Azure SQL managed instance on Azure Arc](create-sql-managed-instance.md) (requires creation of an Azure Arc data controller first)

[Create an Azure Database for PostgreSQL Hyperscale server group on Azure Arc](create-postgresql-hyperscale-server-group.md) (requires creation of an Azure Arc data controller first)

## Known limitations and issues

- SQL managed instance names can not be greater than 13 characters
- No in-place upgrade for the Azure Arc data controller or database instances.
- Arc enabled data services container images are not signed.  You may need to configure your Kubernetes nodes to allow unsigned container images to be pulled.  For example, if you are using Docker as the container runtime, you can set the DOCKER_CONTENT_TRUST=0 environment variable and restart.  Other container runtimes have similar options such as in [OpenShift](https://docs.openshift.com/container-platform/4.5/openshift_images/image-configuration.html#images-configuration-file_image-configuration).
- Cannot create Azure Arc enabled SQL Managed instances or PostgreSQL Hyperscale server groups from the Azure portal.
- For now, if you are using NFS, you need to set allowRunAsRoot to true in your deployment profile file before creating the Azure Arc data controller.
- SQL and PostgreSQL login authentication only.  No support for Azure Active Directory or Active Directory.
- Creating a data controller on OpenShift requires relaxed security constraints.  See documentation for details.
- Scaling the number of Postgres Hyperscale worker nodes _down_ is not supported.
- If you are using Azure Kubernetes Service Engine (AKS Engine) on Azure Stack Hub with Azure Arc data controller and database instances, upgrading to a newer Kubernetes version is not supported. Uninstall Azure Arc data controller and all the database instances before upgrading the Kubernetes cluster.
- Preview does not support backup/restore for Postgres version 11 engine. It only supports backup/restore for Postgres version 12.
- Azure Kubernetes Service (AKS), clusters that span [multiple availability zones](../../aks/availability-zones.md) are not currently supported for Azure Arc enabled data services. To avoid this issue, when you create the AKS cluster in Azure portal, if you select a region where zones are available, clear all the zones from the selection control. See the following image:

   :::image type="content" source="media/release-notes/aks-zone-selector.png" alt-text="Clear the checkboxes for each zone to specify none.":::

  
