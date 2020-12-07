---
title: Azure Arc enabled data services - Release notes
description: Latest release notes 
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 12/09/2020
ms.topic: conceptual
# Customer intent: As a data professional, I want to understand why my solutions would benefit from running with Azure Arc enabled data services so that I can leverage the capability of the feature.
---

# Release notes - Azure Arc enabled data services (Preview)

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## December 2020

Azure Data CLI (`azdata`) version number: 20.2.5. Download at [https://aka.ms/azdata](https://aka.ms/azdata).

### Breaking change

This release introduces an updated [resource provider](../../azure-resource-manager/management/azure-services-resource-providers.md) called `Microsoft.AzureArcData`. Before you can use this feature, you need to register this resource provider. 

To register this resource provider: 

1. In the Azure portal, select **Subscriptions** 
2. Choose your subscription
3. Under **Settings**, select **Resource providers** 
4. Search for `Microsoft.AzureArcData` and select **Register** 

You can review detailed steps at [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md). This change also removes all your existing shadow resources that you have uploaded to the Azure portal. In order to use the resource provider, you need to update the data controller and use the latest `azdata` CLI.  

### Platform release notes

#### Direct connectivity mode

This release introduces direct connectivity mode. Direct connectivity mode enables the data controller to automatically upload the usage information to Azure. As part of the usage upload, the Arc data controller resource is automatically created in the portal, if it is not already created via `azdata` upload.  

You can specify direct connectivity when you create the data controller. The following example creates a data controller with `azdata arc dc create` named `azure-arc-aks-hci` using direct connectivity mode (`connectivity-mode direct`). Before you run the example, replace `<subscription id>` with your subscription ID.

```console
azdata arc dc create --profile-name azure-arc-aks-hci --namespace arc --name arc --subscription <subscription id> --resource-group my-resource-group --location eastus --connectivity-mode direct
```

## October 2020 

Azure Data CLI (`azdata`) version number: 20.2.3. Download at [https://aka.ms/azdata](https://aka.ms/azdata).

### Breaking changes

This release introduces the following breaking changes: 

* In the PostgreSQL custom resource definition (CRD), the term `shards` is renamed to `workers`. This term (`workers`) matches the command-line parameter name.

* `azdata arc postgres server delete` prompts for confirmation before deleting a postgres instance.  Use `--force` to skip prompt.

### Additional changes

* A new optional parameter was added to `azdata arc postgres server create` called `--volume-claim mounts`. The value is a comma-separated list of volume claim mounts. A volume claim mount is a pair of volume type and PVC name. The only volume type currently supported is `backup`.  In PostgreSQL, when volume type is `backup`, the PVC is mounted to `/mnt/db-backups`.  This enables sharing backups between PostgresSQL instances so that the backup of one PostgresSQL instance can be restored in another instance.

* New short names for PostgresSQL custom resource definitions: 

  * `pg11` 

  * `pg12`

* Telemetry upload provides user with either:

   * Number of points uploaded to Azure

     or 

   * If no data has been loaded to Azure, a prompt to try it again.

* `azdata arc dc debug copy-logs` now also reads from `/var/opt/controller/log` folder and collects PostgreSQL engine logs on Linux.

*	Display a working indicator during creating and restoring backup with PostgreSQL Hyperscale.

* `azdata arc postrgres backup list` now includes backup size information.

* SQL Managed Instance admin name property was added to right column of overview blade in the Azure portal.

* Azure Data Studio supports configuring number of worker nodes, vCore, and memory settings for PostgreSQL Hyperscale. 

* Preview supports backup/restore for Postgres version 11 and 12.

## September 2020

Azure Arc enabled data services is released for public preview. Arc enabled data services allow you to manage data services anywhere.

- SQL Managed Instance
- PostgreSQL Hyperscale

For instructions see [What are Azure Arc enabled data services?](overview.md)

## Known limitations and issues

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


### Known issues for Azure Arc Enabled PostgreSQL Hyperscale   

- Preview does not support backup/restore for PostgreSQL version 11 engine. It only supports backup/restore for PostgreSQL version 12.
- `azdata arc dc debug copy-logs` doesn't collect PostgreSQL engine logs on Windows.
- Recreating a server group with the name of a server group that was just deleted may fail or stop responding. 
   - **Workaround** Do not reuse the same name when you recreate a server group or wait for the load balancer/external service of previously deleted server group. Assuming that the name of the server group you deleted was `postgres01` and it was hosted in a namespace `arc`, before you recreate a server group with the same name, wait until `postgres01-external-svc` is not showing up in the output of the kubectl command `kubectl get svc -n arc`.
 - Loading the Overview page and Compute + Storage configuration page in Azure Data Studio is slow. 



## Next steps
  
> **Just want to try things out?**  
> Get started quickly with [Azure Arc Jumpstart](https://github.com/microsoft/azure_arc#azure-arc-enabled-data-services) on AKS, AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM.

- [Install the client tools](install-client-tools.md)
- [Create the Azure Arc data controller](create-data-controller.md) (requires installing the client tools first)
- [Create an Azure SQL managed instance on Azure Arc](create-sql-managed-instance.md) (requires creation of an Azure Arc data controller first)
- [Create an Azure Database for PostgreSQL Hyperscale server group on Azure Arc](create-postgresql-hyperscale-server-group.md) (requires creation of an Azure Arc data controller first)
- [Resource providers for Azure services](../../azure-resource-manager/management/azure-services-resource-providers.md)
