---
title: Azure Arc enabled data services - known issues
description: Latest known issues
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 03/02/2021
ms.topic: conceptual
# Customer intent: As a data professional, I want to understand why unexpected behaviors of the current system.
---

# Known issues - Azure Arc enabled data services (Preview)

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## March 2021

### Data controller

- You can create a data controller in direct connect mode with the Azure portal. Deployment with other Azure Arc enabled data services tools are not supported. Specifically, you can't deploy a data controller in direct connect mode with any of the following tools during this release.
   - Azure Data Studio
   - Azure Data CLI (`azdata`)
   - Kubernetes native tools

   [Deploy Azure Arc data controller | Direct connect mode](deploy-data-controller-direct-mode.md) explains how to create the data controller in the portal. 

### Azure Arc enabled PostgreSQL Hyperscale

- It is not supported to deploy an Azure Arc enabled Postgres Hyperscale server group in an Arc data controller enabled for direct connect mode.
- Passing  an invalid value to the `--extensions` parameter when editing the configuration of a server group to enable additional extensions incorrectly resets the list of enabled extensions to what it was at the create time of the server group and prevents user from creating additional extensions. The only workaround available when that happens is to delete the server group and redeploy it.

## February 2021

### Data controller

- Direct connect cluster mode is disabled

### Azure Arc enabled PostgreSQL Hyperscale

- Point in time restore is not supported for now on NFS storage.
- It is not possible to enable and configure the pg_cron extension at the same time. You need to use two commands for this. One command to enable it and one command to configure it. 

   For example:
   ```console
   § azdata arc postgres server edit -n myservergroup --extensions pg_cron 
   § azdata arc postgres server edit -n myservergroup --engine-settings cron.database_name='postgres'
   ```

   The first command requires a restart of the server group. So, before executing the second command, make sure the state of the server group has transitioned from updating to ready. If you execute the second command before the restart has completed it will fail. If that is the case, simply wait for a few more moments and execute the second command again.

## Introduced prior to February 2021

### Data controller

- On Azure Kubernetes Service (AKS), Kubernetes version 1.19.x is not supported.
- On Kubernetes 1.19 `containerd` is not supported.
- The data controller resource in Azure is currently an Azure resource. Any updates such as delete is not propagated back to the kubernetes cluster.
- Instance names can't be greater than 13 characters
- No in-place upgrade for the Azure Arc data controller or database instances.
- Arc enabled data services container images are not signed.  You may need to configure your Kubernetes nodes to allow unsigned container images to be pulled.  For example, if you are using Docker as the container runtime, you can set the DOCKER_CONTENT_TRUST=0 environment variable and restart.  Other container runtimes have similar options such as in [OpenShift](https://docs.openshift.com/container-platform/4.5/openshift_images/image-configuration.html#images-configuration-file_image-configuration).
- Cannot create Azure Arc enabled SQL Managed instances or PostgreSQL Hyperscale server groups from the Azure portal.
- For now, if you are using NFS, you need to set `allowRunAsRoot` to `true` in your deployment profile file before creating the Azure Arc data controller.
- SQL and PostgreSQL login authentication only.  No support for Azure Active Directory or Active Directory.
- Creating a data controller on OpenShift requires relaxed security constraints.  See documentation for details.
- If you are using Azure Kubernetes Service (AKS) Engine on Azure Stack Hub with Azure Arc data controller and database instances, upgrading to a newer Kubernetes version is not supported. Uninstall Azure Arc data controller and all the database instances before upgrading the Kubernetes cluster.
- AKS clusters that span [multiple availability zones](../../aks/availability-zones.md) are not currently supported for Azure Arc enabled data services. To avoid this issue, when you create the AKS cluster in Azure portal, if you select a region where zones are available, clear all the zones from the selection control. See the following image:

   :::image type="content" source="media/release-notes/aks-zone-selector.png" alt-text="Clear the checkboxes for each zone to specify none.":::


## Next steps

> **Just want to try things out?**  
> Get started quickly with [Azure Arc Jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_data/) on AKS, AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM.

- [Install the client tools](install-client-tools.md)
- [Create the Azure Arc data controller](create-data-controller.md) (requires installing the client tools first)
- [Create an Azure SQL managed instance on Azure Arc](create-sql-managed-instance.md) (requires creation of an Azure Arc data controller first)
- [Create an Azure Database for PostgreSQL Hyperscale server group on Azure Arc](create-postgresql-hyperscale-server-group.md) (requires creation of an Azure Arc data controller first)
- [Resource providers for Azure services](../../azure-resource-manager/management/azure-services-resource-providers.md)
- [Release notes - Azure Arc enabled data services (Preview)](release-notes.md)
