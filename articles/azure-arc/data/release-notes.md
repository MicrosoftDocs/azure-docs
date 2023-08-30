---
title: Azure Arc-enabled data services - Release notes
description: This article provides highlights for the latest release, and a history of features introduced in previous releases.
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 08/10/2023
ms.topic: conceptual
ms.custom: references_regions, devx-track-azurecli, event-tier1-build-2022
#Customer intent: As a data professional, I want to understand why my solutions would benefit from running with Azure Arc-enabled data services so that I can leverage the capability of the feature.
---

# Release notes - Azure Arc-enabled data services

This article highlights capabilities, features, and enhancements recently released or improved for Azure Arc-enabled data services.

## August 8, 2023

### Image tag

`v1.22.0_2023-08-08`

For complete release version information, review [Version log](version-log.md#august-8-2023).

### Release notes

- Support for configuring and managing Azure Failover groups between two Azure Arc-enabled SQL managed instances using Azure portal. For details, review [Configure failover group - portal](managed-instance-disaster-recovery-portal.md).
- Upgraded OpenSearch and OpenSearch Dashboards from 2.7.0 to 2.8.0
- Improvements and examples to [Back up and recover controller database](backup-controller-database.md).

## July 11, 2023

### Image tag

`v1.21.0_2023-07-11`

For complete release version information, review [Version log](version-log.md#july-11-2023).

### Release notes

- Proxy bypass is now supported for Arc SQL Server Extension. Starting this release, you can also specify services which should not use the specified proxy server.

## June 13, 2023

### Image tag

`v1.20.0_2023-06-13`

For complete release version information, review [Version log](version-log.md#june-13-2023).

### Release notes

- Azure Arc-enabled SQL Managed Instance
    -  [Added Azure CLI support to manage transparent data encryption (TDE)](configure-transparent-data-encryption-sql-managed-instance.md).

## May 9, 2023

### Image tag

`v1.19.0_2023-05-09`

For complete release version information, review [Version log](version-log.md#may-9-2023).

New for this release:

### Release notes

- Arc data services
  - OpenSearch replaces Elasticsearch for log database
  - OpenSearch Dashboards replaces Kibana for logs interface
    - There is a known issue with user settings migration to OpenSearch Dashboards for some versions of Elasticsearch, including the version used in Arc data services. 
    
      > [!IMPORTANT]
      > Before upgrade, save any Kibana configuration externally so that it can be re-created in OpenSearch Dashboards.

  - Automatic upgrade is disabled for the Arc data services extension
  - Error-handling in the `az` CLI is improved during data controller upgrade
  - Fixed a bug to preserve the resource limits for Azure Arc Data Controller where the resource limits could get reset during an upgrade.

- Azure Arc-enabled SQL Managed Instance
  - General Purpose: Customer-managed TDE encryption keys (preview). For information, review [Enable transparent data encryption on Azure Arc-enabled SQL Managed Instance](configure-transparent-data-encryption-sql-managed-instance.md).
  - Support for customer-managed keytab rotation. For information, review [Rotate Azure Arc-enabled SQL Managed Instance customer-managed keytab](rotate-customer-managed-keytab.md).
  - Support for `sp_configure` to manage configuration. For information, review [Configure Azure Arc-enabled SQL managed instance](configure-managed-instance.md).
  - Service-managed credential rotation. For information, review [How to rotate service-managed credentials in a managed instance](rotate-sql-managed-instance-credentials.md#how-to-rotate-service-managed-credentials-in-a-managed-instance).

## April 12, 2023

### Image tag

`v1.18.0_2023-04-11`

For complete release version information, see [Version log](version-log.md#april-11-2023).

New for this release:

- Azure Arc-enabled SQL Managed Instance
  - Direct mode for failover groups is generally available az CLI
  - Schedule the HA orchestrator replicas on different nodes when available

- Arc PostgreSQL
  - Ensure postgres extensions work per database/role
  - Arc PostgreSQL | Upload metrics/logs to Azure Monitor

- Bug fixes and optimizations in the following areas:
  - Deploying Arc data controller using the individual create experience has been removed as it sets the auto upgrade parameter incorrectly. Use the all-in-one create experience. This experience creates the extension, custom location, and data controller. It also sets all the parameters correctly. For specific information, see [Create Azure Arc data controller in direct connectivity mode using CLI](create-data-controller-direct-cli.md).

## March 14, 2023

### Image tag

`v1.17.0_2023-03-14`

For complete release version information, see [Version log](version-log.md#march-14-2023).

New for this release:

- Azure Arc-enabled SQL Managed Instance 
  - [Rotate Azure Arc-enabled SQL Managed Instance service-managed credentials (preview)](rotate-sql-managed-instance-credentials.md) 
- Azure Arc-enabled PostgreSQL 
  - Require client connections to use SSL
  - Extended Azure Arc-enabled SQL Managed Instance authentication control plane to PostgreSQL

## February 14, 2023

### Image tag

`v1.16.0_2023-02-14`

For complete release version information, see [Version log](version-log.md#february-14-2023).

New for this release:

- Arc data services:
   - Initial Extended Events Functionality | (preview)

- Arc-SQL MI
   - [Enabled service managed Transparent Data Encryption (TDE) (preview)](configure-transparent-data-encryption-sql-managed-instance.md).
   - Backups | Produce automated backups from readable secondary
    - The built-in automatic backups are performed on secondary replicas when available.

- Arc PostgreSQL 
   - Automated Backups
   - Settings via configuration framework
   - Point-in-Time Restore
   - Turn backups on/off
   - Require client connections to use SSL
   - Active Directory |  Customer-managed bring your own keytab
   - Active Directory | Configure in Azure command line client
   - Enable Extensions via Kubernetes Custom Resource Definition

- Azure CLI Extension 
   - Optional `imageTag` for controller creation by defaulting to the image tag of the bootstrapper


## January 13, 2023

### Image tag

`v1.15.0_2023-01-10`

For complete release version information, see [Version log](version-log.md#january-13-2023).

New for this release:

- Arc data services:
   - Kafka separate mode

- Arc-SQL MI
   - Time series functions are available.

## December 13, 2022

### Image tag

`v1.14.0_2022-12-13`

For complete release version information, see [Version log](version-log.md#december-13-2022).

New for this release:

- Platform support
  - Add support for K3s

- Arc data controller.
  - Added defaults on HA supervisor pod to support resource quotas.
  - Update Grafana to version 9.

- Arc-enabled PostgreSQL server
  - Switch to Ubuntu based images.

- Bug fixes and optimizations in the following areas:
  - Arc enabling SQL Server onboarding.
  - Fixed confusing error messages when DBMail is configured.

## November 8, 2022

### Image tag

`v1.13.0_2022-11-08`

For complete release version information, see [Version log](version-log.md#november-8-2022).

New for this release:

- Arc-enabled PostgreSQL server
  - Add support for automated backups

- `arcdata` Azure CLI extension
  - CLI support for automated backups: Setting the `--storage-class-backups` parameter for the create command will enable automated backups

## October 11, 2022

### Image tag

`v1.12.0_2022-10-11`

For complete release version information, see [Version log](version-log.md#october-11-2022).

New for this release: 
- Arc data controller
  - Updates to TelemetryRouter implementation to include inbound and outbound TelemetryCollector layers alongside Kafka as a persistent buffer
  - AD connector will now be upgraded when data controller is upgraded

- Arc-enabled SQL managed instance
  - New reprovision replica task lets you rebuild a broken sql instance replica. For more information, see [Reprovision replica](reprovision-replica.md).
  - Edit Active Directory settings from the Azure portal

- `arcdata` Azure CLI extension
  - Columns for release information added to the following commands: `az sql mi-arc list` this makes it easy to see what instance may need to be updated.
  - Alternately you can run `az arcdata dc list-upgrades'
  - New command to list AD Connectors `az arcdata ad-connector list --k8s-namespace <namespace> --use-k8s`
  - Az CLI Polling for AD Connector create/update/delete: This feature changes the default behavior of `az arcdata ad-connector create/update/delete` to hang and wait until the operation finishes. To override this behavior, the user has to use the `--no-wait` flag when invoking the command. 

Deprecation and breaking changes notices:

The following properties in the Arc SQL Managed Instance status will be deprecated/moved in the _next_ release:
- `status.logSearchDashboard`: use `status.endpoints.logSearchDashboard` instead.
- `status.metricsDashboard`: use `status.endpoints.metricsDashboard` instead.
- `status.primaryEndpoint`: use `status.endpoints.primary` instead.
- `status.readyReplicas`: uses `status.roles.sql.readyReplicas` instead.

## September 13, 2022

### Image tag

`v1.11.0_2022-09-13`

For complete release version information, see [Version log](version-log.md#september-13-2022).

New for this release:

- Arc data controller
  - New extensions to monitoring stack to enable Kafka as a data cache and expose an OpenTelemetry endpoint for integration.  See documentation for more details.
  - Deleting an AD connector that is in use is now blocked.  First remove all database instances that are using it and then remove the AD connector.
  - New OpenTelemetry Router preview to make collected logs available for export to other SEIM systems.  See documentation for details.
  - AD connectors can now be created in Kubernetes via the Kubernetes API and synchronized to Azure via Resource Sync.
  - Added short name `arcdc` to the data controllers custom resource definition. You can now use `kubectl get arcdc` as short form for `kubectl get datacontrollers`.
  - The controller-external-svc is now only created when deploying using the indirect connectivity mode since it is only used for exporting logs/metrics/usage data in the indirect mode.
  - "Downgrades" - i.e. going from a higher major or minor version to a lower - is now blocked.  Examples of a blocked downgrade:  v1.10 -> v1.9 or v2.0 -> v1.20.

- Arc-enabled SQL managed instance
  - Added support for specifying multiple encryption types for AD connectors using the Azure CLI extension or Azure portal.

- Arc-enabled PostgreSQL server
   - Removed Hyperscale/Citus scale-out capabilities. Focus will be on providing a single node Postgres server service. All user experiences have had terms and concepts like `Hyperscale`, `server groups`, `worker nodes`, `coordinator nodes`, and so forth. removed.  **BREAKING CHANGE**

  - Only PostgreSQL version 14 is supported for now. Versions 11 and 12 have been removed.  Two new images are introduced: `arc-postgres-14` and `arc-postgresql-agent`.  The `arc-postgres-11` and `arc-postgres-12` container images are removed going forward.
  - The postgresql CRD version has been updated to v1beta3.  Some properties such as `workers` have been removed or changed.  Update any scripts or automation you have as needed to align to the new CRD schema. **BREAKING CHANGE**

- `arcdata` Azure CLI extension
  - Columns for desiredVersion and runningVersion are added to the following commands: `az sql mi-arc list` and `kubectl get sqlmi` to easily compare what the runningVersion and desiredVersion are.
  - The command group `az postgres arc-server` is renamed to `az postgres server-arc`. **BREAKING CHANGE**
  - Some of the `az postgres server-arc` commands have changed to remove things like `--workers`.  **BREAKING CHANGE**

## August 9, 2022

This release is published August 9, 2022.

### Image tag

`v1.10.0_2022-08-09`

For complete release version information, see [Version log](version-log.md#august-9-2022).

### Arc-enabled SQL Managed Instance

- AES encryption can now be enabled for AD authentication.

### `arcdata` Azure CLI extension

- The Azure CLI help text for the Arc data controller, Arc-enabled SQL Managed Instance, and Active Directory connector command groups has been updated to reflect new naming conventions. Indirect mode arguments are now referred to as _Kubernetes API - targeted_ arguments, and direct mode arguments are now referred to as _Azure Resource Manager - targeted_ arguments.

## July 12, 2022

This release is published July 12, 2022

### Image tag

`v1.9.0_2022-07-12`

For complete release version information, see [Version log](version-log.md#july-12-2022).

### Miscellaneous

- Extended the disk metrics reported in monitoring dashboards to include more queue length stats and more counters for IOPS. All disks are in scope for data collection that start with `vd` or `sd` now.

### Arc-enabled SQL Managed Instance

- Added buffer cache hit ratio to `collectd` and surface it in monitoring dashboards.
- Improvements to the formatting of the legends on some dashboards.
- Added process level CPU  and memory metrics to the monitoring dashboards for the SQL managed instance process.
- `syncSecondaryToCommit` property is now available to be viewed and edited in Azure portal and Azure Data Studio.
- Added ability to set the DNS name for the readableSecondaries service in Azure CLI and Azure portal.
- The service now collects the `agent.log`, `security.log` and `sqlagentstartup.log` for Arc-enabled SQL Managed instance to ElasticSearch so they're searchable via Kibana. If you choose, you can upload them to Azure Log Analytics.
- There are more additional notifications when provisioning new SQL managed instances is blocked due to not exporting/uploading billing data to Azure.

### Data controller

- Permissions required to deploy the Arc data controller have been reduced to a least-privilege level.
- When deployed via the Azure CLI, the Arc data controller is now installed via a K8s job that uses a helm chart to do the installation. There's no change to the user experience.
- Resource Sync rule is created automatically when Data Controller is deployed in Direct connected mode. This enables customers to deploy an Azure Arc enabled SQL Managed Instance by directly talking to the kubernetes APIs.

## June 14, 2022

This release is published June 14, 2022.

### Image tag

`v1.8.0_2022-06-14`

For complete release version information, see [Version log](version-log.md#june-14-2022).

### Miscellaneous

- Canada Central and West US 3 regions are fully supported.

### Data controller

- Control DB SQL instance version is upgraded to latest version.
- Additional compatibility checks are run prior to executing an upgrade request.
- Upload status is now shown in the data controller list view in the Azure portal.
- Show the usage upload message value in the Overview blade banner in the Azure portal if the value is not **Success**.

### SQL Managed Instance

  - You can now configure a SQL managed instance to use an AD connector at the time the SQL managed instance is provisioned from the Azure portal.
  - BACKUP DATABASE TO URL to S3-compatible storage is introduced for preview. Limited to COPY_ONLY. [Documentation](/sql/relational-databases/backup-restore/sql-server-backup-and-restore-with-s3-compatible-object-storage).
  - `az sql mi-arc create` and `update` commands have a new `--sync-secondary-commit` parameter which is the number of secondary replicas that must be synchronized to fail over. Default is `-1` which sets the number of required synchronized secondaries to (# of replicas - 1) / 2.  Allowed values: `-1`, `1`, or `2`.  Arc SQL MI custom resource property added called `syncSecondaryToCommit`.
  - Billing estimate in Azure portal is updated to reflect the number of readable secondaries that are selected.
  - Added SPNs for readable secondary service.

## May 24, 2022

This release is published May 24, 2022.

### Image tag

`v1.7.0_2022-05-24`

For complete release version information, see [Version log](version-log.md#may-24-2022).

### Data controller reminders and warnings

Reminders and warnings are implemented in Azure portal, custom resource status, and through CLI when the billing data related to all resources managed by the data controller has not been uploaded or exported for an extended period.

### SQL Managed Instance

General Availability of Business Critical service tier.  Azure Arc-enabled SQL Managed Instance instances that have a version greater than or equal to v1.7.0 will be charged through Azure billing meters.

### User experience improvements

#### Azure portal

Added ability to create AD Connectors from Azure portal.

Preview expected costs for Azure Arc-enabled SQL Managed Instance Business Critical tier when you create new instances.

#### Azure Data Studio

Added ability to upgrade Azure Arc-enabled SQL Managed Instances from Azure Data Studio in the indirect and direct connectivity modes.

Preview expected costs for Azure Arc-enabled SQL Managed Instance Business Critical tier when you create new instances.

## May 4, 2022

This release is published May 4, 2022.

### Image tag

`v1.6.0_2022-05-02`

For complete release version information, see [Version log](version-log.md#may-4-2022).

### Data controller

Added:

- Create, update, and delete AD connector 
- Create SQL Managed Instance with AD connectivity to the Azure CLI extension in direct connectivity mode.

Data controller sends controller logs to the Log Analytics Workspace if logs upload is enabled. 

Removed the `--ad-connector-namespace` parameter from `az sql mi-arc create` command because for now the AD connector resource must always be in the same namespace as the SQL Managed Instance resource.

Updated Elasticsearch to latest version `7.9.1-36fefbab37-205465`.  Also Grafana, Kibana, Telegraf, Fluent Bit, Go.

All container image sizes were reduced by approximately 40% on average.

Introduced new `create-sql-keytab.ps1` PowerShell script to aid in creation of keytabs.

### SQL Managed Instance

Separated the availability group and failover group status into two different sections on Kubernetes.

Updated SQL engine binaries to the latest version.

Add support for `NodeSelector`, `TopologySpreadConstraints` and `Affinity`.  Only available through Kubernetes yaml/json file create/edit currently.  No Azure CLI, Azure portal, or Azure Data Studio user experience yet.

Add support for specifying labels and annotations on the secondary service endpoint. `REQUIRED_SECONDARIES_TO_COMMIT` is now a function of the number of replicas.  

- If three replicas: `REQUIRED_SECONDARIES_TO_COMMIT = 1`.  
- If one or two replicas: `REQUIRED_SECONDARIES_TO_COMMIT = 0`.

In this release, the default value of the readable secondary service is `Cluster IP`.  The secondary service type can be set in the Kubernetes yaml/json at `spec.services.readableSecondaries.type`. In the next release, the default value will be the same as the primary service type.

### User experience improvements

Notifications added in Azure portal if billing data has not been uploaded to Azure recently.

#### Azure Data Studio

Added upgrade experience for Data Controller in direct and indirect connectivity mode.

## April 6, 2022

This release is published April 6, 2022.

### Image tag

`v1.5.0_2022-04-05`

For complete release version information, see [Version log](version-log.md#april-6-2022).

### Data controller

- Logs are retained in ElasticSearch for 2 weeks by default now.
- Upgrades are now limited to only upgrading to the next incremental minor or major version. For example:
   - Supported version upgrades: 
      - 1.1 -> 1.2 
      - 1.3 -> 2.0 
   - Not supported version upgrade.
      - 1.1. -> 1.4
         Not supported because one or more minor versions are skipped.
- Updates to open source projects included in Azure Arc-enabled data services to patch vulnerabilities.

### Azure Arc-enabled SQL Managed Instance

You can create a maintenance window on the data controller, and if you have SQL managed instances with a desired version set to `auto`, they will be upgraded in the next maintenance windows after a data controller upgrade. 

Metrics for each replica in a Business Critical instance are now sent to the Azure portal so you can view them in the monitoring charts.

AD authentication connectors can now be set up in an `automatic mode` or *system-managed keytab* which will use a service account to automatically create SQL service accounts, SPNs, and DNS entries as an alternative to the AD authentication connectors which use the *customer-managed keytab* mode.

> [!NOTE]
> In some early releases customer-managed keytab mode was called *bring your own keytab* mode.

Backup and point-in-time-restore when a database has Transparent Data Encryption (TDE) enabled is now supported.

Change Data Capture (CDC) is now enabled in Azure Arc-enabled SQL Managed Instance.

Bug fixes for replica scaling in Arc SQL MI Business Critical and database restore when there is insufficient disk space.

Distributed availability groups have been renamed to failover groups. The `az sql mi-arc dag` command group has been moved to `az sql instance-failover-group-arc`. Before upgrade, delete all resources of the `dag` resource type.

### User experience improvements

You can now use the Azure CLI `az arcdata dc create` command to create:
- A custom location
- A data services extension
- A data controller in one command.

New enforcements of constraints:

- The data controller and managed instance resources it manages must be in the same resource group.
- There can only be one data controller in a given custom location.

#### Azure Data Studio

During direct connected mode data controller creation, you can now specify the log analytics workspace information for auto sync upload of the logs.

## March 2022

This release is published March 8, 2022.

### Image tag

`v1.4.1_2022-03-08`

For complete release version information, see [Version log](version-log.md#march-8-2022).

### Data Controller
- Fixed the issue "ConfigMap sql-config-[SQL MI] does not exist" from the February 2022 release. This issue occurs when deploying a SQL Managed Instance with service type of `loadBalancer` with certain load balancers. 

## February 2022

This release is published February 25, 2022.

### Image tag

`v1.4.0_2022-02-25`

For complete release version information, see [Version log](version-log.md#february-25-2022).

> [!CAUTION] 
> There is a known issue with this release where deployment of Arc SQL MI hangs, and sends the controldb pods of Arc Data Controller into a
> `CrashLoopBackOff` state, when the SQL MI is deployed with `loadBalancer` service type. This issue is fixed in a release on March 08, 2022. 

### SQL Managed Instance

- Support for readable secondary replicas:
    - To set readable secondary replicas use `--readable-secondaries` when you create or update an Arc-enabled SQL Managed Instance deployment. 
    - Set `--readable-secondaries` to any value between 0 and the number of replicas minus 1.
    - `--readable-secondaries` only applies to Business Critical tier. 
- Automatic backups are taken on the primary instance in a Business Critical service tier when there are multiple replicas. When a failover happens, backups move to the new primary. 
- [ReadWriteMany (RWX) capable storage class](../../aks/concepts-storage.md#azure-disk) is required for backups, for both General Purpose and Business Critical service tiers. Specifying a non-ReadWriteMany storage class will cause the SQL Managed Instance to be stuck in "Pending" status during deployment.
- Billing support when using multiple read replicas.

For additional information about service tiers, see [High Availability with Azure Arc-enabled SQL Managed Instance (preview)](managed-instance-high-availability.md).

### User experience improvements

The following improvements are available in [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).

- Azure Arc and Azure CLI extensions now generally available. 
- Changed edit commands for SQL Managed Instance for Azure Arc dashboard to use `update`, reflecting Azure CLI changes. This works in indirect or direct mode. 
- Data controller deployment wizard step for connectivity mode is now earlier in the process.
- Removed an extra backups field in SQL MI deployment wizard.

## January 2022

This release is published January 27, 2022.

### Image tag

`v1.3.0_2022-01-27`

For complete release version information, see [Version log](version-log.md#january-27-2022).

### Data controller

- Initiate an upgrade of the data controller from the portal in the direct connected mode
- Removed block on data controller upgrade if there are Business Critical instances that exist
- Better handling of delete user experiences in Azure portal

### SQL Managed Instance

- Azure Arc-enabled SQL Managed Instance Business Critical instances can be upgraded from the January release and going forward (preview)
- Business critical distributed availability group failover can now be done through a Kubernetes-native experience or the Azure CLI (indirect mode only) (preview)
- Added support for `LicenseType: DisasterRecovery` which will ensure that instances which are used for Business Critical distributed availability group secondary replicas:
    - Are not billed for
    - Automatically seed the system databases from the primary replica when the distributed availability group is created. (preview)
- New option added to `desiredVersion` called `auto` - automatically upgrades a given SQL instance when there is a new upgrade available (preview)
- Update the configuration of SQL instances using Azure CLI in the direct connected mode

## December 2021

This release is published December 16, 2021.

### Data controller

- Secret rotation for metrics and logs dashboards using Azure CLI or Kubernetes .yaml file
- Ability to provide custom SSL certificates for metrics and logs dashboards using Azure CLI or Kubernetes yaml file
- Direct mode upgrade of data controller via Azure CLI

### SQL Managed Instance

- Active Directory authentication in preview for SQL Managed Instance
- Direct mode upgrade of SQL Managed Instance via Azure CLI
- Edit memory and CPU configuration in Azure portal in directly connected mode
- Ability to specify a single replica for a Business Critical instance using Azure CLI or Kubernetes yaml file
- Updated SQL binaries to latest Azure PaaS-compatible binary version
- Resolved issue where the point in time restore did not respect the configured time zone

## November 2021

This release is published November 3, 2021

### Tools

#### Azure Data Studio

Install or update to the latest version of [Arc extension for Azure Data Studio](/sql/azure-data-studio/extensions/azure-arc-extension).

#### Azure (`az`) CLI

Install or update `arcdata` extension for `az` CLI to support directly connected deployment.

The following `sql` commands now support directly connected mode:

```console
az arcdata dc create
az arcdata dc delete
az sql mi-arc create
az sql mi-arc delete
```
### Data controller

- Directly connected mode generally available
- Directly connected Azure Arc Data controller extensions on Azure Arc enabled Kubernetes clusters now use system generated managed identities instead of service principal name. The managed identity is automatically created when a new Azure Arc data controller extension is created. You still need to grant appropriate permissions to upload usage and metrics.
- Metrics upload leverages the system generated managed identity with a directly connected Azure Arc data controller. 
- Create directly connected mode Azure Arc data controller from Azure CLI (`az`).
- Automatically upload metrics to Azure Monitor
- Automatically upload logs to Azure Log Analytics
- Enable or disable automatic upload of Metrics and/or logs to Azure after deployment of Azure Arc data controller.
- Upgrade from July 2021 release in-place (only for generally available services such as Azure Arc data controller and General Purpose SQL Managed Instance) using Azure CLI.
- Set the metrics and logs dashboards usernames and passwords separately at DC deployment time using the new environment variables:

   ```console
   AZDATA_LOGSUI_USERNAME
   AZDATA_LOGSUI_PASSWORD
   AZDATA_METRICSUI_USERNAME
   AZDATA_METRICSUI_PASSWORD
   ```
- New command - `az arcdata dc list-upgrades` shows the list of available upgrades from the currently deployed data controller.

You can continue to use `AZDATA_USERNAME` and `AZDATA_PASSWORD` environment variables as before. If you only provide `AZDATA_USERNAME` and `AZDATA_PASSWORD` then the deployment uses them for both the logs and metrics dashboards.

### Region availability

This release introduces directly connected mode availability in the following Azure regions:

- North Central US
- West US
- West US 3

For complete list, see [Supported regions](overview.md#supported-regions).

### Azure Arc-enabled SQL Managed Instance

- Upgrade instances of Azure Arc-enabled SQL Managed Instance General Purpose in-place
- The SQL binaries are updated to a new version
- Direct connected mode deployment of Azure Arc enabled SQL Managed Instance using Azure CLI
- Point in time restore for Azure Arc enabled SQL Managed Instance is being made generally available with this release. Currently point in time restore is only supported for the General Purpose SQL Managed Instance. Point in time restore for Business Critical SQL Managed Instance is still under preview.
- New `--dry-run` option provided for point in time restore
- Recovery point objective is set to 5 minutes by default and is not configurable
- Backup retention period is set to 7 days by default. A new option to set the retention period to zero disables automatic backups for development and test instances that do not require backups
- Resolved issue where the point in time restore operation did not respect configured time zone 
- Restore to a point in time from Azure CLI or Azure Data Studio
 
### Known issues

#### Data controller upgrade

- At this time, upgrade of a directly connected data controller via CLI or the portal is not supported.
- You can only upgrade generally available services such as Azure Arc data controller and General Purpose SQL Managed Instance at this time. If you also have Business Critical SQL Managed Instance and/or Azure Arc enabled PostgreSQL server, remove them first, before proceeding to upgrade.

#### Commands

The following commands do not support directly connected mode at this time:

```console
az arcdata dc update
az arcdata sql mi-arc update
```

#### Azure Arc-enabled PostgreSQL server

- Backup and restore of Azure Arc-enabled PostgreSQL server is not supported in the current preview release.

- It is not possible to enable and configure the `pg_cron` extension at the same time. You need to use two commands for this. One command to enable it and one command to configure it. For example:

   1. Enable the extension:

      ```console
      az postgres server-arc update -n myservergroup --extensions pg_cron
      ```

   1. Restart the server group.

   1. Configure the extension:

      ```console
      az postgres server-arc update -n myservergroup --engine-settings cron.database_name='postgres'
      ```

   If you execute the second command before the restart has completed it will fail. If that is the case, simply wait for a few more moments and execute the second command again.

- Passing an invalid value to the `--extensions` parameter when editing the configuration of a server group to enable additional extensions incorrectly resets the list of enabled extensions to what it was at the create time of the server group and prevents user from creating additional extensions. The only workaround available when that happens is to delete the server group and redeploy it.

#### Azure Arc-enabled SQL Managed Instance

- When a pod is re-provisioned, SQL Managed Instance starts a new set of full backups for all databases.
- If your data controller is directly connected, before you can provision a SQL Managed Instance, you must upgrade your data controller to the most recent version first. Attempting to provision a SQL Managed Instance with a data controller imageVersion of `v1.0.0_2021-07-30` will not succeed.

##### Other limitations

- Transaction replication is currently not supported.
- Log shipping is currently blocked.
- Only SQL Server Authentication is supported.

## July 2021

This release is published July 30, 2021.

This release announces general availability for Azure Arc-enabled SQL Managed Instance [General Purpose service tier](service-tiers.md) in indirectly connected mode.

   > [!NOTE]
   > In addition, this release provides the following Azure Arc-enabled services in preview: 
   > - SQL Managed Instance in directly connected mode
   > - SQL Managed Instance [Business Critical service tier](service-tiers.md)
   > - PostgreSQL server

### Breaking changes

#### Tools

Use the following tools:
- [Insiders build of Azure Data Studio](https://github.com/microsoft/azuredatastudio#try-out-the-latest-insiders-build-from-main).
- [`arcdata` extension for Azure (`az`) CLI](install-arcdata-extension.md). 

#### Data controller

- `az arcdata dc create` parameter named `--azure-subscription` has been changed to use the standard `--subscription` parameter.
- Deployment on AKS HCI requires a special storage class configuration. See details under [Configure storage (Azure Stack HCI with AKS-HCI)](create-data-controller-indirect-cli.md#configure-storage-azure-stack-hci-with-aks-hci).
- There is a new requirement to allow non-SSL connections when exporting data. Set an environment variable to suppress the interactive prompt.

### What's new

#### Data controller

- Directly connected mode is in preview. 

- Directly connected mode (preview) is only available in the following Azure regions for this release:

   - North Central US *
   - Central US
   - East US
   - East US 2
   - West US *
   - West US 2
   - West US 3 *
   - UK South
   - West Europe
   - North Europe
   - Australia East
   - Southeast Asia
   - Korea Central
   - France Central
    \* Newly added for November, 2021.

- Currently, additional basic authentication users can be added to Grafana using the Grafana administrative experience. Customizing Grafana by modifying the Grafana .ini files is not supported.

- Currently, modifying the configuration of Elasticsearch and Kibana is not supported beyond what is available through the Kibana administrative experience. Only basic authentication with a single user is supported.
	
- Custom metrics in Azure portal - preview.

- Exporting usage/billing information, metrics, and logs using the command `az arcdata dc export` requires bypassing SSL verification for now.  You will be prompted to bypass SSL verification or you can set the `AZDATA_VERIFY_SSL=no` environment variable to avoid prompting.  There is no way to configure an SSL certificate for the data controller export API currently.

#### Azure Arc-enabled SQL Managed Instance

- Automated backup and point-in-time restore is in preview.
- Supports point-in-time restore from an existing database in an Azure Arc-enabled SQL Managed Instance to a new database within the same instance.
- If the current datetime is given as point-in-time in UTC format, it resolves to the latest valid restore time and restores the given database until last valid transaction.
- A database can be restored to any point-in-time where the transactions took place.
- To set a specific recovery point objective for an Azure Arc-enabled SQL Managed Instance, edit the SQL Managed Instance CRD to set the `recoveryPointObjectiveInSeconds` property. Supported values are from 300 to 600.
- To disable the automated backups, edit the SQL instance CRD and set the `recoveryPointObjectiveInSeconds` property to 0.

### Known issues

#### Platform

- You can create a data controller, SQL Managed Instance, or PostgreSQL server on a directly connected mode cluster with the Azure portal. Directly connected mode deployment is not supported with other Azure Arc-enabled data services tools. Specifically, you can't deploy a data controller in directly connect mode with any of the following tools during this release.
   - Azure Data Studio
   - Kubernetes native tools (`kubectl`)
   - The `arcdata` extension for the Azure CLI (`az`)

   [Create Azure Arc data controller in Direct connectivity mode from Azure portal](create-data-controller-direct-azure-portal.md) explains how to create the data controller in the portal.

- You can still use `kubectl` to create resources directly on a Kubernetes cluster, however they will not be reflected in the Azure portal if you are using direct connected mode.

- In directly connected mode, upload of usage, metrics, and logs using `az arcdata dc upload` is blocked by design. Usage is automatically uploaded. Upload for data controller created in indirect connected mode should continue to work.
- Automatic upload of usage data in direct connectivity mode will not succeed if using proxy via `–proxy-cert <path-t-cert-file>`.
- Azure Arc-enabled SQL Managed instance and Azure Arc-enabled PostgreSQL server are not GB18030 certified.
- Currently, only one Azure Arc data controller per Kubernetes cluster is supported.

#### Data controller

- When Azure Arc data controller is deleted from Azure portal, validation is done to block the delete if there any Azure Arc-enabled SQL Managed Instances deployed on this Arc data controller. Currently, this validation is applied only when the delete is performed from the Overview page of the Azure Arc data controller. 

#### Azure Arc-enabled PostgreSQL server

- At this time, PosgreSQL Hyperscale can't be used on Kubernetes version 1.22 and higher. 
- Backup and restore no longer work in the July 30 release. This is a temporary limitation. Use the June 2021 release for now if you need to do to back up or restore. This will be fixed in a future release.

- It is not possible to enable and configure the `pg_cron` extension at the same time. You need to use two commands for this. One command to enable it and one command to configure it. For example:

   1. Enable the extension:

      ```console
      azdata postgres server-arc update -n myservergroup --extensions pg_cron
      ```

   1. Restart the server group.

   1. Configure the extension:

      ```console
      azdata postgres server-arc update -n myservergroup --engine-settings cron.database_name='postgres'
      ```

   If you execute the second command before the restart has completed it will fail. If that is the case, simply wait for a few more moments and execute the second command again.

- Passing an invalid value to the `--extensions` parameter when editing the configuration of a server group to enable additional extensions incorrectly resets the list of enabled extensions to what it was at the create time of the server group and prevents user from creating additional extensions. The only workaround available when that happens is to delete the server group and redeploy it.

- Point in time restore is not supported for now on NFS storage.

#### Azure Arc-enabled SQL Managed Instance

##### Can't see resources in portal

- Portal does not show Azure Arc-enabled SQL Managed Instance resources created in the June release. Delete the SQL Managed Instance resources from the resource group list view. You may need to delete the custom location resource first.

##### Point-in-time restore(PITR) supportability and limitations:
- Doesn't support restore from one Azure Arc-enabled SQL Managed Instance to another Azure Arc-enabled SQL Managed Instance.  The database can only be restored to the same Azure Arc-enabled SQL Managed Instance where the backups were created.
- Renaming a database is currently not supported, for point in time restore purposes.
- Currently there is no CLI command or an API to provide the allowed time window information for point-in-time restore. You can provide a time within a reasonable window, since the time the database was created, and if the timestamp is valid the restore would work. If the timestamp is not valid, the allowed time window will be provided via an error message.
- No support for restoring a TDE enabled database.
- A deleted database cannot be restored currently.

#####	Automated backups

- Renaming database will stop the automated backups for this database.
- No retention enforced. Will preserve all backups as long as there's available space. 
- User databases with SIMPLE recovery model are not backed up.
- System database `model` is not backed up in order to prevent interference with creation/deletion of database. The DB gets locked when admin operations are performed. 
- Currently only `master` and `msdb` system databases are backed up. Only full backups are performed every 12 hours.
- Only `ONLINE` user databases are backup up.
- Default recovery point objective (RPO): 5 minutes. Can't be modified in current release.
- Backups are retained indefinitely. To recover space, manually delete backups.

##### Other limitations
- Transaction replication is currently not supported.
- Log shipping is currently blocked.
- Only SQL Server Authentication is supported.

## June 2021

This preview release is published July 13, 2021.

### Breaking changes

#### New deployment templates

- Kubernetes native deployment templates have been modified for data controller, bootstrapper, & SQL Managed Instance. Update your .yaml templates. [Sample yaml files](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/deploy/yaml)

#### New Azure CLI extension for data controller and Azure Arc-enabled SQL Managed Instance

This release introduces the `arcdata` extension to the Azure CLI. To add the extension, run the following command:

```azurecli
az extension add --name arcdata
```

The extension supports command-line interaction with data controller and SQL Managed Instance and PostgreSQL server resources.

To update your scripts for data controller, replace `azdata arc dc...` with `az arcdata dc...`.

To update your scripts for managed instance, replace `azdata arc sql mi...` with `az sql mi-arc...`.

For Azure Arc-enabled PostgreSQL server, replace `azdata arc sql postgres...` with `az postgres server-arc...`.

In addition to the parameters that have historically existed on the `azdata` commands, the same commands in the `arcdata` Azure CLI extension have some new parameters such as `--k8s-namespace` and `--use-k8s` are now required. The `--use-k8s` parameter will be used to differentiate when the command should be sent to the Kubernetes API or to the ARM API. For now all Azure CLI commands for Azure Arc-enabled data services target only the Kubernetes API.

Some of the short forms of the parameter names (e.g. `--core-limit` as `-cl`) have either been removed or changed. Use the new parameter short names or the long name.

The `azdata arc dc export` command is no longer functional. Use `az arcdata dc export` instead.

#### Required property: `infrastructure`

The `infrastructure` property is a new required property when deploying a data controller. Adjust your yaml files, azdata/az scripts, and ARM templates to account for specifying this property value. Allowed values are `alibaba`, `aws`, `azure`, `gpc`, `onpremises`, `other`.

#### Kibana login

The OpenDistro security pack has been removed. Log in to Kibana is now done through a generic browser username/password prompt. More information will be provided later how to configure additional authentication/authorization options.

#### CRD version bump to `v1beta1`

All CRDs have had the version bumped from `v1alpha1` to `v1beta1` for this release. Be sure to delete all CRDs as part of the uninstall process if you have deployed a version of Azure Arc-enabled data services prior to the June 2021 release. The new CRDs deployed with the June 2021 release will have v1beta1 as the version.

#### Azure Arc-enabled SQL Managed Instance

Automated backup service is available and on by default. Keep a close watch on space availability on the backup volume.

### What's new

This release introduces `az` CLI extensions for Azure Arc-enabled data services. See information in [Breaking change](#breaking-change) above.

#### Platform

#### Data controller

- Streamlined user experience for deploying a data controller in the direct connected mode from the Azure portal. Once a Kubernetes cluster has been Azure Arc-enabled, you can deploy the data controller entirely from the portal with the Arc data controller create wizard in one motion. This deployment also creates the custom location and Azure Arc-enabled data services extension (bootstrapper). You can also pre-create the custom location and/or extension and configure the data controller deployment to use them.
- New `Infrastructure` property is a required property when you deploy an Arc data controller. This property will be required for billing purposes. More information will be provided at general availability.
- Various usability improvements in the data controller user experience in the Azure portal including the ability to better see the deployment status of resources that are in the deployment process on the Kubernetes cluster.
- Data controller automatically uploads logs (optionally) and now also metrics to Azure in direct connected mode.
- The monitoring stack (metrics and logs databases/dashboards) has now been packaged into its own custom resource definition (CRD) - `monitors.arcdata.microsoft.com`. When this custom resource is created the monitoring stack pods are created. When it is deleted the monitoring stack pods are deleted. When the data controller is created the monitor custom resource is automatically created.
- New regions supported for direct connected mode (preview): East US 2, West US 2, South Central US, UK South, France Central, Southeast Asia, Australia East.
- The custom location resource chart on the overview blade now shows Azure Arc-enabled data services resources that are deployed to it.
- Diagnostics and solutions have been added to the Azure portal for data controller.
- Added new `Observed Generation` property to all Arc related custom resources.
- Credential manager service is now included and handles the automated distribution of certificates to all services managed by the data controller.

#### Azure Arc-enabled PostgreSQL server

- Azure Arc PostgreSQL server now supports NFS storage.
- Azure Arc PostgreSQL server now supports Kubernetes pods to nodes assignments strategies with nodeSelector, nodeAffinity and anti-affinity.
- You can now configure compute parameters (vCore & memory) per role (Coordinator or Worker) when you deploy a PostgreSQL server or after deployment from Azure Data Studio and from the Azure portal.
- From the Azure portal, you can now view the list of PostgreSQL extensions created on your PostgreSQL server.
- From the Azure portal, you can delete Azure Arc-enabled PostgreSQL server groups on a data controller that is directly connected to Azure.

#### Azure Arc-enabled SQL Managed Instance

- Automated backups are now enabled.
- You can now restore a database backup as a new database on the same SQL instance by creating a new custom resource based on the `sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com` custom resource definition (CRD). See documentation for details. There is no command-line interface (`azdata` or `az`), Azure portal, or Azure Data Studio experience for restoring a database yet.
- The version of SQL engine binaries included in this release is aligned to the latest binaries that are deployed globally in Azure SQL Managed Instance (PaaS in Azure). This alignment enables backup/restore back and forth between Azure SQL Managed Instance PaaS and Azure Arc-enabled Azure SQL Managed Instance. More details on the compatibility will be provided later.
- You can now delete Azure Arc SQL Managed Instances from the Azure portal in direct connected mode.
- You can now configure a SQL Managed Instance to have a pricing tier (`GeneralPurpose`, `BusinessCritical`), license type (`LicenseIncluded`, `BasePrice` (used for AHB pricing), and `developer`. There will be no charges incurred for using Azure Arc-enabled SQL Managed Instance until the General Availability date (publicly announced as scheduled for July 30, 2021) and until you upgrade to the General Availability version of the service.
- The `arcdata` extension for Azure Data Studio now has additional parameters that can be configured for deploying and editing SQL Managed Instances: enable/disable agent, admin login secret, annotations, labels, service annotations, service labels, SSL/TLS configuration settings, collation, language, and trace flags.
- New commands in `azdata`/custom resource tasks for setting up distributed availability groups. These commands are in early stages of preview, documentation will be provided soon.

   > [!NOTE]
   > These commands will migrate to the `az arcdata` extension.

- `azdata arc dc export` is deprecated. It is replaced by `az arcdata dc export` in the `arcdata` extension for the Azure CLI (`az`). It uses a different approach to export the data out. It does not connect directly to the data controller API anymore. Instead it creates an export task based on the `exporttasks.tasks.arcdata.microsoft.com` custom resource definition (CRD). The export task custom resource that is created drives a workflow to generate a downloadable package. The Azure CLI waits for the completion of this task and then retrieves the secure URL from the task custom resource status to download the package.
- Support for using NFS-based storage classes.
- Diagnostics and solutions have been added to the Azure portal for Arc SQL Managed Instance

## May 2021

This preview release is published on June 2, 2021.

As a preview feature, the technology presented in this article is subject to [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

### Breaking change

- Kubernetes native deployment templates have been modified. Update update your .yml templates.
    - Updated templates for data controller, bootstrapper, & SQL Managed instance: [GitHub microsoft/azure-arc pr 574](https://github.com/microsoft/azure_arc/pull/574)
    - Updated templates for PostgreSQL server: [GitHub microsoft/azure-arc pr 574](https://github.com/microsoft/azure_arc/pull/574)

### What's new

#### Platform

- Create and delete data controller, SQL Managed Instance, and PostgreSQL servers from Azure portal.
- Validate portal actions when deleting Azure Arc data services. For instance, the portal alerts when you attempt to delete the data controller when there are SQL Managed Instances deployed using the data controller.
- Create custom configuration profiles to support custom settings when you deploy Azure Arc-enabled data controller using the Azure portal.
- Optionally, automatically upload your logs to Azure Log analytics workspace in the directly connected mode.

#### Azure Arc-enabled PostgreSQL server

This release introduces the following features or capabilities:

- Delete an Azure Arc PostgreSQL server from the Azure portal when its Data Controller was configured for Direct connectivity mode.
- Deploy Azure Arc-enabled PostgreSQL server from the Azure database for Postgres deployment page in the Azure portal. See [Select Azure Database for PostgreSQL deployment option - Microsoft Azure](https://portal.azure.com/#create/Microsoft.PostgreSQLServer).
- Specify storage classes and PostgreSQL extensions when deploying Azure Arc-enabled PostgreSQL server from the Azure portal.
- Reduce the number of worker nodes in your Azure Arc-enabled PostgreSQL server. You can do this operation (known as scale in as opposed to scale out when you increase the number of worker nodes) from `azdata` command-line.

#### Azure Arc-enabled SQL Managed Instance

- New [Azure CLI extension](/cli/azure/azure-cli-extensions-overview) for Azure Arc-enabled SQL Managed Instance has the same commands as `az sql mi-arc <command>`. All Azure Arc-enabled SQL Managed Instance commands are located at `az sql mi-arc`. All Arc related `azdata` commands will be deprecated and moved to Azure CLI in a future release.

   To add the extension:

   ```azurecli
   az extension add --source https://azurearcdatacli.blob.core.windows.net/cli-extensions/arcdata-0.0.1-py2.py3-none-any.whl -y
   az sql mi-arc --help
   ```

- Manually trigger a failover of using Transact-SQL. Do the following commands in order:

   1. On the primary replica endpoint connection:

      ```sql
       ALTER AVAILABILITY GROUP current SET (ROLE = SECONDARY);
      ```

   1. On the secondary replica endpoint connection:

      ```sql
      ALTER AVAILABILITY GROUP current SET (ROLE = PRIMARY);
      ```

- Transact-SQL `BACKUP` command is blocked unless using `COPY_ONLY` setting. This supports point in time restore capability.

## April 2021

This preview release is published on April 29, 2021.

### What's new

This section describes the new features introduced or enabled for this release.

#### Platform

- Direct connected clusters automatically upload telemetry information automatically Azure.

#### 	Azure Arc-enabled PostgreSQL server

- Azure Arc-enabled PostgreSQL server is now supported in Direct connect mode. You now can deploy Azure Arc-enabled PostgreSQL server from the Azure Market Place in the Azure portal.
- Azure Arc-enabled PostgreSQL server ships with the Citus 10.0 extension which features columnar table storage
- Azure Arc-enabled PostgreSQL server  now supports full user/role management.
- Azure Arc-enabled PostgreSQL server  now supports additional extensions with `Tdigest` and  `pg_partman`.
- Azure Arc-enabled PostgreSQL server  now supports configuring vCore and memory settings per role of the PostgreSQL instance in the server group.
- Azure Arc-enabled PostgreSQL server  now supports configuring database engine/server settings per role of the PostgreSQL instance in the server group.

#### Azure Arc-enabled SQL Managed Instance

- Restore a database to SQL Managed Instance with three replicas and it will be automatically added to the availability group.
- Connect to a secondary read-only endpoint on SQL Managed Instances deployed with three replicas. Use `azdata arc sql endpoint list` to see the secondary read-only connection endpoint.

## Next steps

> **Just want to try things out?**
> Get started quickly with [Azure Arc Jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_data/) on AKS, AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM.

- [Install the client tools](install-client-tools.md)
- [Plan an Azure Arc-enabled data services deployment](plan-azure-arc-data-services.md) (requires installing the client tools first)
- [Create an Azure SQL Managed Instance on Azure Arc](create-sql-managed-instance.md) (requires creation of an Azure Arc data controller first)
- [Create an Azure Database for PostgreSQL server on Azure Arc](create-postgresql-server.md) (requires creation of an Azure Arc data controller first)
- [Resource providers for Azure services](../../azure-resource-manager/management/azure-services-resource-providers.md)


