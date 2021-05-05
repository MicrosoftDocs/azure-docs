---
title: Azure Arc enabled data services - Release notes
description: Latest release notes 
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 04/29/2021
ms.topic: conceptual
# Customer intent: As a data professional, I want to understand why my solutions would benefit from running with Azure Arc enabled data services so that I can leverage the capability of the feature.
---

# Release notes - Azure Arc enabled data services (Preview)

This article highlights capabilities, features, and enhancements recently released or improved for Azure Arc enabled data services. 

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## April 2021

This preview release is published on April 29, 2021.

### What's new

This section describes the new features introduced or enabled for this release. 

#### Platform

- Direct connected clusters automatically upload telemetry information automatically Azure. 

#### 	Azure Arc enabled PostgreSQL Hyperscale

- Azure Arc enabled PostgreSQL Hyperscale is now supported in Direct connect mode. You now can deploy Azure Arc enabled PostgreSQL Hyperscale from the Azure Market Place in the Azure portal. 
- Azure Arc enabled PostgreSQL Hyperscale ships with the Citus 10.0 extension which features columnar table storage
- Azure Arc enabled PostgreSQL Hyperscale  now supports full user/role management.
- Azure Arc enabled PostgreSQL Hyperscale  now supports additional extensions with `Tdigest` and  `pg_partman`.
- Azure Arc enabled PostgreSQL Hyperscale  now supports configuring vCore and memory settings per role of the PostgreSQL instance in the server group.
- Azure Arc enabled PostgreSQL Hyperscale  now supports configuring database engine/server settings per role of the PostgreSQL instance in the server group.

#### Azure Arc enabled SQL Managed Instance

- Restore a database to SQL Managed Instance with three replicas and it will be automatically added to the availability group. 
- Connect to a secondary read-only endpoint on SQL Managed Instances deployed with three replicas. Use `azdata arc sql endpoint list` to see the secondary read-only connection endpoint.

### Known issues

- You can create a data controller in direct connect mode with the Azure portal. Deployment with other Azure Arc enabled data services tools are not supported. Specifically, you can't deploy a data controller in direct connect mode with any of the following tools during this release.
   - Azure Data Studio
   - Azure Data CLI (`azdata`)
   - Kubernetes native tools (`kubectl`)

   [Deploy Azure Arc data controller | Direct connect mode](deploy-data-controller-direct-mode.md) explains how to create the data controller in the portal. 

- In direct connected mode, upload of usage, metrics, and logs using `azdata arc dc upload` is currently blocked. Usage is automatically uploaded. Upload for data controller created in indirect connected mode should continue to work.
- Automatic upload of usage data in direct connectivity mode will not succeed if using proxy via `–proxy-cert <path-t-cert-file>`.
- Azure Arc enabled SQL Managed instance and Azure Arc enabled PostgreSQL Hyperscale are not GB18030 certified.

#### Azure Arc enabled SQL Managed Instance

- Deployment of Azure Arc enabled SQL Managed Instance in direct mode can only be done from the Azure portal, and not available from tools such as azdata, Azure Data Studio, or kubectl.

#### Azure Arc enabled PostgreSQL Hyperscale

- Point in time restore is not supported for now on NFS storage.
- It is not possible to enable and configure the `pg_cron` extension at the same time. You need to use two commands for this. One command to enable it and one command to configure it. For example:

   1. Enable the extension:
   
      ```console
      azdata arc postgres server edit -n myservergroup --extensions pg_cron 
      ```

   1. Restart the server group.

   1. Configure the extension:
   
      ```console
      azdata arc postgres server edit -n myservergroup --engine-settings cron.database_name='postgres'
      ```

   If you execute the second command before the restart has completed it will fail. If that is the case, simply wait for a few more moments and execute the second command again.

- Passing  an invalid value to the `--extensions` parameter when editing the configuration of a server group to enable additional extensions incorrectly resets the list of enabled extensions to what it was at the create time of the server group and prevents user from creating additional extensions. The only workaround available when that happens is to delete the server group and redeploy it.

## March 2021

The March 2021 release was initially introduced on April 5th 2021, and the final stages of release were completed April 9th 2021.

Azure Data CLI (`azdata`) version number: 20.3.2. You can install `azdata` from [Install Azure Data CLI (`azdata`)](/sql/azdata/install/deploy-install-azdata).

### Data controller

- Deploy Azure Arc enabled data services data controller in direct connect mode from the portal. Start from [Deploy data controller - direct connect mode - prerequisites](deploy-data-controller-direct-mode-prerequisites.md).

### Azure Arc enabled PostgreSQL Hyperscale

Both custom resource definitions (CRD) for PostgreSQL have been consolidated into a single CRD. See the following table.

|Release |CRD |
|-----|-----|
|February 2021 and prior| postgresql-11s.arcdata.microsoft.com<br/>postgresql-12s.arcdata.microsoft.com |
|Beginning March 2021 | postgresqls.arcdata.microsoft.com

You will delete the previous CRDs as you cleanup past installations. See [Cleanup from past installations](create-data-controller-using-kubernetes-native-tools.md#cleanup-from-past-installations).

### Azure Arc enabled SQL Managed Instance

- You can now create a SQL managed instance from the Azure portal in the direct connected mode.

- You can now restore a database to SQL Managed Instance with three replicas and it will be automatically added to the availability group. 

- You can now connect to a secondary read-only endpoint on SQL Managed Instances deployed with three replicas. Use `azdata arc sql endpoint list` to see the secondary read-only connection endpoint.

## February 2021

### New capabilities and features

Azure Data CLI (`azdata`) version number: 20.3.1. You can install `azdata` from [Install Azure Data CLI (`azdata`)](/sql/azdata/install/deploy-install-azdata).

Additional updates include:

- Azure Arc enabled SQL Managed Instance
   - High availability with Always On availability groups

- Azure Arc enabled PostgreSQL Hyperscale
   Azure Data Studio: 
   - The overview page shows the status of the server group itemized per node
   - A new properties page shows more details about the server group
   - Configure Postgres engine parameters from **Node Parameters** page

## January 2021

### New capabilities and features

Azure Data CLI (`azdata`) version number: 20.3.0. You can install `azdata` from [Install Azure Data CLI (`azdata`)](/sql/azdata/install/deploy-install-azdata).

Additional updates include:
- Localized portal available for 17 new languages
- Minor changes to Kube-native .yaml files
- New versions of Grafana and Kibana
- Issues with Python environments when using azdata in notebooks in Azure Data Studio resolved
- The pg_audit extension is now available for PostgreSQL Hyperscale
- A backup ID is no longer required when doing a full restore of a PostgreSQL Hyperscale database
- The status (health state) is reported for each of the PostgreSQL instances that constitute a sever group

   In earlier releases, the status was aggregated at the server group level and not itemized at the PostgreSQL node level.

- PostgreSQL deployments honor the volume size parameters indicated in create commands
- The engine version parameters are now honored when editing a server group
- The naming convention of the pods for Azure Arc enabled PostgreSQL Hyperscale has changed

    It is now in the form: `ServergroupName{c, w}-n`. For example, a server group with three nodes, one coordinator node and two worker nodes is represented as:
   - `Postgres01c-0` (coordinator node)
   - `Postgres01w-0` (worker node)
   - `Postgres01w-1` (worker node)

## December 2020

### New capabilities & features

Azure Data CLI (`azdata`) version number: 20.2.5. You can install `azdata` from [Install Azure Data CLI (`azdata`)](/sql/azdata/install/deploy-install-azdata).

View endpoints for SQL Managed Instance and PostgreSQL Hyperscale using the Azure Data CLI (`azdata`) with `azdata arc sql endpoint list` and `azdata arc postgres endpoint list` commands.

Edit SQL Managed Instance resource (CPU core and memory) requests and limits using Azure Data Studio.

Azure Arc enabled PostgreSQL Hyperscale now supports point in time restore in addition to full backup restore for both versions 11 and 12 of PostgreSQL. The point in time restore capability allows you to indicate a specific date and time to restore to.

The naming convention of the pods for Azure Arc enabled PostgreSQL Hyperscale has changed. It is now in the form: ServergroupName{r, s}-_n_. For example, a server group with three nodes, one coordinator node and two worker nodes is represented as:
- `postgres02r-0` (coordinator node)
- `postgres02s-0` (worker node)
- `postgres02s-1` (worker node)

### Breaking change

#### New resource provider

This release introduces an updated [resource provider](../../azure-resource-manager/management/azure-services-resource-providers.md) called `Microsoft.AzureArcData`. Before you can use this feature, you need to register this resource provider. 

To register this resource provider: 

1. In the Azure portal, select **Subscriptions** 
2. Choose your subscription
3. Under **Settings**, select **Resource providers** 
4. Search for `Microsoft.AzureArcData` and select **Register** 

You can review detailed steps at [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md). This change also removes all the existing Azure resources that you have uploaded to the Azure portal. In order to use the resource provider, you need to update the data controller and use the latest `azdata` CLI.  

### Platform release notes

#### Direct connectivity mode

This release introduces direct connectivity mode. Direct connectivity mode enables the data controller to automatically upload the usage information to Azure. As part of the usage upload, the Arc data controller resource is automatically created in the portal, if it is not already created via `azdata` upload.  

You can specify direct connectivity when you create the data controller. The following example creates a data controller with `azdata arc dc create` named `arc` using direct connectivity mode (`connectivity-mode direct`). Before you run the example, replace `<subscription id>` with your subscription ID.

```console
azdata arc dc create --profile-name azure-arc-aks-hci --namespace arc --name arc --subscription <subscription id> --resource-group my-resource-group --location eastus --connectivity-mode direct
```

## October 2020 

Azure Data CLI (`azdata`) version number: 20.2.3. You can install `azdata` from [Install Azure Data CLI (`azdata`)](/sql/azdata/install/deploy-install-azdata).

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

## Next steps

> **Just want to try things out?**  
> Get started quickly with [Azure Arc Jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_data/) on AKS, AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM.

- [Install the client tools](install-client-tools.md)
- [Create the Azure Arc data controller](create-data-controller.md) (requires installing the client tools first)
- [Create an Azure SQL managed instance on Azure Arc](create-sql-managed-instance.md) (requires creation of an Azure Arc data controller first)
- [Create an Azure Database for PostgreSQL Hyperscale server group on Azure Arc](create-postgresql-hyperscale-server-group.md) (requires creation of an Azure Arc data controller first)
- [Resource providers for Azure services](../../azure-resource-manager/management/azure-services-resource-providers.md)
