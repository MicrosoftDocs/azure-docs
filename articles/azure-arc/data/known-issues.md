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

## February 2021

- Connected cluster mode is disabled

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

### PostgreSQL

- Azure Arc enabled PostgreSQL Hyperscale returns an inaccurate error message when it cannot restore to the relative point in time you indicate. For example, if you specified a point in time to restore that is older than what your backups contain, the restore will fail with an error message like:
`ERROR: (404). Reason: Not found. HTTP response body: {"code":404, "internalStatus":"NOT_FOUND", "reason":"Failed to restore backup for server...}`
When this happens, restart the command after indicating a point in time that is within the range of dates for which you have backups. You will determine this range by listing your backups and by looking at the dates at which they were taken.
- Point in time restore is supported only across server groups. The target server of a point in time restore operation cannot be the server from which you took the backup. It has to be a different server group. However, full restore is supported to the same server group.
- A backup-id is required when doing a full restore. By default, if you are not indicating a backup-id the latest backup will be used. This does not work in this release.

## Next steps

> **Just want to try things out?**  
> Get started quickly with [Azure Arc Jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_data/) on AKS, AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM.

- [Install the client tools](install-client-tools.md)
- [Create the Azure Arc data controller](create-data-controller.md) (requires installing the client tools first)
- [Create an Azure SQL managed instance on Azure Arc](create-sql-managed-instance.md) (requires creation of an Azure Arc data controller first)
- [Create an Azure Database for PostgreSQL Hyperscale server group on Azure Arc](create-postgresql-hyperscale-server-group.md) (requires creation of an Azure Arc data controller first)
- [Resource providers for Azure services](../../azure-resource-manager/management/azure-services-resource-providers.md)
- [Release notes - Azure Arc enabled data services (Preview)](release-notes.md)
