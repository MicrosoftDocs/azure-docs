---
title: Azure Arc-enabled data services - Release notes
description: This article provides highlights for the latest release, and a history of features introduced in previous releases.
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 03/12/2024
ms.topic: conceptual
ms.custom: references_regions, ignite-2023
#Customer intent: As a data professional, I want to understand why my solutions would benefit from running with Azure Arc-enabled data services so that I can leverage the capability of the feature.
---

# Release notes - Azure Arc-enabled data services

This article highlights capabilities, features, and enhancements recently released or improved for Azure Arc-enabled data services.

## March 12, 2024

**Image tag**:`v1.28.0_2024-03-12`|

For complete release version information, review [Version log](version-log.md#march-12-2024).

### SQL Managed Instance enabled by Azure Arc 

Database version for this release (964) has been upgraded beyond the database version for SQL Server 2022 (957). As a result, you can't restore databases from SQL Managed Instance enabled by Azure Arc to SQL Server 2022.

### Streamlined network endpoints

Prior to this release, Azure Arc data processing endpoint was at `san-af-<region>-prod.azurewebsites.net`.

Beginning with this release both Azure Arc data processing, and Azure Arc data telemetry use `*.<region>.arcdataservices.com`. 

## February 13, 2024

**Image tag**:`v1.27.0_2024-02-13`

For complete release version information, review [Version log](version-log.md#february-13-2024).

## December 12, 2023

**Image tag**: `v1.26.0_2023-12-12`

For complete release version information, review [Version log](version-log.md#december-12-2023).

## November 14, 2023

**Image tag**: `v1.25.0_2023-11-14`

For complete release version information, review [Version log](version-log.md#november-14-2023).

## October 10, 2023

**Image tag**: `v1.24.0_2023-10-10`

For complete release version information, review [Version log](version-log.md#october-10-2023).

## September 12, 2023

**Image tag**: `v1.23.0_2023-09-12`

For complete release version information, review [Version log](version-log.md#september-12-2023).

### Release notes

- Portal automatically refreshes status of failover group every 2 seconds. [Monitor failover group status in the portal](managed-instance-disaster-recovery-portal.md#monitor-failover-group-status-in-the-portal).

## August 8, 2023

**Image tag**: `v1.22.0_2023-08-08`

For complete release version information, review [Version log](version-log.md#august-8-2023).

### Release notes

- Support for configuring and managing Azure Failover groups between two instances using Azure portal. For details, review [Configure failover group - portal](managed-instance-disaster-recovery-portal.md).
- Upgraded OpenSearch and OpenSearch Dashboards from 2.7.0 to 2.8.0
- Improvements and examples to [Back up and recover controller database](backup-controller-database.md).

## July 11, 2023

**Image tag**: `v1.21.0_2023-07-11`

For complete release version information, review [Version log](version-log.md#july-11-2023).

### Release notes

- Proxy bypass is now supported for Arc SQL Server Extension. Starting this release, you can also specify services which shouldn't use the specified proxy server.

## June 13, 2023

**Image tag**: `v1.20.0_2023-06-13`

For complete release version information, review [Version log](version-log.md#june-13-2023).

### Release notes

- SQL Managed Instance enabled by Azure Arc
    -  [Added Azure CLI support to manage transparent data encryption (TDE)](configure-transparent-data-encryption-sql-managed-instance.md).

## May 9, 2023

**Image tag**: `v1.19.0_2023-05-09`

For complete release version information, review [Version log](version-log.md#may-9-2023).

New for this release:

### Release notes

- Arc data services
  - OpenSearch replaces Elasticsearch for log database
  - OpenSearch Dashboards replaces Kibana for logs interface
    - There's a known issue with user settings migration to OpenSearch Dashboards for some versions of Elasticsearch, including the version used in Arc data services. 
    
      > [!IMPORTANT]
      > Before upgrade, save any Kibana configuration externally so that it can be re-created in OpenSearch Dashboards.

  - Automatic upgrade is disabled for the Arc data services extension
  - Error-handling in the `az` CLI is improved during data controller upgrade
  - Fixed a bug to preserve the resource limits for Azure Arc Data Controller where the resource limits could get reset during an upgrade.

- SQL Managed Instance enabled by Azure Arc
  - General Purpose: Customer-managed TDE encryption keys (preview). For information, review [Enable transparent data encryption on SQL Managed Instance enabled by Azure Arc](configure-transparent-data-encryption-sql-managed-instance.md).
  - Support for customer-managed keytab rotation. For information, review [Rotate SQL Managed Instance enabled by Azure Arc customer-managed keytab](rotate-customer-managed-keytab.md).
  - Support for `sp_configure` to manage configuration. For information, review [Configure SQL Managed Instance enabled by Azure Arc](configure-managed-instance.md).
  - Service-managed credential rotation. For information, review [How to rotate service-managed credentials in a managed instance](rotate-sql-managed-instance-credentials.md#how-to-rotate-service-managed-credentials-in-a-managed-instance).

## April 12, 2023

**Image tag**: `v1.18.0_2023-04-11`

For complete release version information, see [Version log](version-log.md#april-11-2023).

New for this release:

- SQL Managed Instance enabled by Azure Arc
  - Direct mode for failover groups is generally available az CLI
  - Schedule the HA orchestrator replicas on different nodes when available

- Arc PostgreSQL
  - Ensure postgres extensions work per database/role
  - Arc PostgreSQL | Upload metrics/logs to Azure Monitor

- Bug fixes and optimizations in the following areas:
  - Deploying Arc data controller using the individual create experience has been removed as it sets the auto upgrade parameter incorrectly. Use the all-in-one create experience. This experience creates the extension, custom location, and data controller. It also sets all the parameters correctly. For specific information, see [Create Azure Arc data controller in direct connectivity mode using CLI](create-data-controller-direct-cli.md).

## March 14, 2023

**Image tag**: `v1.17.0_2023-03-14`

For complete release version information, see [Version log](version-log.md#march-14-2023).

New for this release:

- SQL Managed Instance enabled by Azure Arc 
  - [Rotate SQL Managed Instance enabled by Azure Arc service-managed credentials (preview)](rotate-sql-managed-instance-credentials.md) 
- Azure Arc-enabled PostgreSQL 
  - Require client connections to use SSL
  - Extended SQL Managed Instance enabled by Azure Arc authentication control plane to PostgreSQL

## February 14, 2023

**Image tag**: `v1.16.0_2023-02-14`

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

**Image tag**: `v1.15.0_2023-01-10`

For complete release version information, see [Version log](version-log.md#january-13-2023).

New for this release:

- Arc data services:
   - Kafka separate mode

- Arc-SQL MI
   - Time series functions are available.

## December 13, 2022

**Image tag**: `v1.14.0_2022-12-13`

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

**Image tag**: `v1.13.0_2022-11-08`

For complete release version information, see [Version log](version-log.md#november-8-2022).

New for this release:

- Arc-enabled PostgreSQL server
  - Add support for automated backups

- `arcdata` Azure CLI extension
  - CLI support for automated backups: Setting the `--storage-class-backups` parameter for the create command will enable automated backups

## October 11, 2022

**Image tag**: `v1.12.0_2022-10-11`

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

**Image tag**: `v1.11.0_2022-09-13`

For complete release version information, see [Version log](version-log.md#september-13-2022).

New for this release:

- Arc data controller
  - New extensions to monitoring stack to enable Kafka as a data cache and expose an OpenTelemetry endpoint for integration.  See documentation for more details.
  - Deleting an AD connector that is in use is now blocked.  First remove all database instances that are using it and then remove the AD connector.
  - New OpenTelemetry Router preview to make collected logs available for export to other SEIM systems.  See documentation for details.
  - AD connectors can now be created in Kubernetes via the Kubernetes API and synchronized to Azure via Resource Sync.
  - Added short name `arcdc` to the data controllers custom resource definition. You can now use `kubectl get arcdc` as short form for `kubectl get datacontrollers`.
  - The controller-external-svc is now only created when deploying using the indirect connectivity mode since it's only used for exporting logs/metrics/usage data in the indirect mode.
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

**Image tag**: `v1.10.0_2022-08-09`

For complete release version information, see [Version log](version-log.md#august-9-2022).

### Arc-enabled SQL Managed Instance

- AES encryption can now be enabled for AD authentication.

### `arcdata` Azure CLI extension

- The Azure CLI help text for the Arc data controller, Arc-enabled SQL Managed Instance, and Active Directory connector command groups has been updated to reflect new naming conventions. Indirect mode arguments are now referred to as _Kubernetes API - targeted_ arguments, and direct mode arguments are now referred to as _Azure Resource Manager - targeted_ arguments.

## July 12, 2022

This release is published July 12, 2022

**Image tag**: `v1.9.0_2022-07-12`

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

**Image tag**: `v1.8.0_2022-06-14`

For complete release version information, see [Version log](version-log.md#june-14-2022).

### Miscellaneous

- Canada Central and West US 3 regions are fully supported.

### Data controller

- Control DB SQL instance version is upgraded to latest version.
- Additional compatibility checks are run prior to executing an upgrade request.
- Upload status is now shown in the data controller list view in the Azure portal.
- Show the usage upload message value in the Overview blade banner in the Azure portal if the value isn't **Success**.

### SQL Managed Instance

  - You can now configure a SQL managed instance to use an AD connector at the time the SQL managed instance is provisioned from the Azure portal.
  - BACKUP DATABASE TO URL to S3-compatible storage is introduced for preview. Limited to COPY_ONLY. [Documentation](/sql/relational-databases/backup-restore/sql-server-backup-and-restore-with-s3-compatible-object-storage).
  - `az sql mi-arc create` and `update` commands have a new `--sync-secondary-commit` parameter which is the number of secondary replicas that must be synchronized to fail over. Default is `-1` which sets the number of required synchronized secondaries to (# of replicas - 1) / 2.  Allowed values: `-1`, `1`, or `2`.  Arc SQL MI custom resource property added called `syncSecondaryToCommit`.
  - Billing estimate in Azure portal is updated to reflect the number of readable secondaries that are selected.
  - Added SPNs for readable secondary service.

## May 24, 2022

This release is published May 24, 2022.

**Image tag**: `v1.7.0_2022-05-24`

For complete release version information, see [Version log](version-log.md#may-24-2022).

### Data controller reminders and warnings

Reminders and warnings are implemented in Azure portal, custom resource status, and through CLI when the billing data related to all resources managed by the data controller hasn't been uploaded or exported for an extended period.

### SQL Managed Instance

General Availability of Business Critical service tier.  SQL Managed Instance enabled by Azure Arc instances that have a version greater than or equal to v1.7.0 will be charged through Azure billing meters.

### User experience improvements

#### Azure portal

Added ability to create AD Connectors from Azure portal.

Preview expected costs for SQL Managed Instance enabled by Azure Arc Business Critical tier when you create new instances.

#### Azure Data Studio

Added ability to upgrade instances from Azure Data Studio in the indirect and direct connectivity modes.

Preview expected costs for SQL Managed Instance enabled by Azure Arc Business Critical tier when you create new instances.

## May 4, 2022

This release is published May 4, 2022.

**Image tag**: `v1.6.0_2022-05-02`

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

Notifications added in Azure portal if billing data hasn't been uploaded to Azure recently.

#### Azure Data Studio

Added upgrade experience for Data Controller in direct and indirect connectivity mode.

## April 6, 2022

This release is published April 6, 2022.

**Image tag**: `v1.5.0_2022-04-05`

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

### SQL Managed Instance enabled by Azure Arc

You can create a maintenance window on the data controller, and if you have SQL managed instances with a desired version set to `auto`, they will be upgraded in the next maintenance windows after a data controller upgrade. 

Metrics for each replica in a Business Critical instance are now sent to the Azure portal so you can view them in the monitoring charts.

AD authentication connectors can now be set up in an `automatic mode` or *system-managed keytab* which will use a service account to automatically create SQL service accounts, SPNs, and DNS entries as an alternative to the AD authentication connectors which use the *customer-managed keytab* mode.

> [!NOTE]
> In some early releases customer-managed keytab mode was called *bring your own keytab* mode.

Backup and point-in-time-restore when a database has Transparent Data Encryption (TDE) enabled is now supported.

Change Data Capture (CDC) is now enabled in SQL Managed Instance enabled by Azure Arc.

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

**Image tag**: `v1.4.1_2022-03-08`

For complete release version information, see [Version log](version-log.md#march-8-2022).

### Data Controller
- Fixed the issue "ConfigMap sql-config-[SQL MI] does not exist" from the February 2022 release. This issue occurs when deploying a SQL Managed Instance with service type of `loadBalancer` with certain load balancers. 

## February 2022

This release is published February 25, 2022.

**Image tag**: `v1.4.0_2022-02-25`

For complete release version information, see [Version log](version-log.md#february-25-2022).

> [!CAUTION] 
> There's a known issue with this release where deployment of Arc SQL MI hangs, and sends the controldb pods of Arc Data Controller into a
> `CrashLoopBackOff` state, when the SQL MI is deployed with `loadBalancer` service type. This issue is fixed in a release on March 08, 2022. 

### SQL Managed Instance

- Support for readable secondary replicas:
    - To set readable secondary replicas use `--readable-secondaries` when you create or update an Arc-enabled SQL Managed Instance deployment. 
    - Set `--readable-secondaries` to any value between 0 and the number of replicas minus 1.
    - `--readable-secondaries` only applies to Business Critical tier. 
- Automatic backups are taken on the primary instance in a Business Critical service tier when there are multiple replicas. When a failover happens, backups move to the new primary. 
- [ReadWriteMany (RWX) capable storage class](../../aks/concepts-storage.md#azure-disk) is required for backups, for both General Purpose and Business Critical service tiers. Specifying a non-ReadWriteMany storage class will cause the SQL Managed Instance to be stuck in "Pending" status during deployment.
- Billing support when using multiple read replicas.

For additional information about service tiers, see [High Availability with SQL Managed Instance enabled by Azure Arc (preview)](managed-instance-high-availability.md).

### User experience improvements

The following improvements are available in [Azure Data Studio](/azure-data-studio/download-azure-data-studio).

- Azure Arc and Azure CLI extensions now generally available. 
- Changed edit commands for SQL Managed Instance for Azure Arc dashboard to use `update`, reflecting Azure CLI changes. This works in indirect or direct mode. 
- Data controller deployment wizard step for connectivity mode is now earlier in the process.
- Removed an extra backups field in SQL MI deployment wizard.

## January 2022

This release is published January 27, 2022.

**Image tag**: `v1.3.0_2022-01-27`

For complete release version information, see [Version log](version-log.md#january-27-2022).

### Data controller

- Initiate an upgrade of the data controller from the portal in the direct connected mode
- Removed block on data controller upgrade if there are Business Critical instances that exist
- Better handling of delete user experiences in Azure portal

### SQL Managed Instance

- SQL Managed Instance enabled by Azure Arc Business Critical instances can be upgraded from the January release and going forward (preview)
- Business critical distributed availability group failover can now be done through a Kubernetes-native experience or the Azure CLI (indirect mode only) (preview)
- Added support for `LicenseType: DisasterRecovery` which will ensure that instances which are used for Business Critical distributed availability group secondary replicas:
    - Are not billed for
    - Automatically seed the system databases from the primary replica when the distributed availability group is created. (preview)
- New option added to `desiredVersion` called `auto` - automatically upgrades a given SQL instance when there is a new upgrade available (preview)
- Update the configuration of SQL instances using Azure CLI in the direct connected mode

## Related content

> **Just want to try things out?**
> Get started quickly with [Azure Arc Jumpstart](https://azurearcjumpstart.com/azure_arc_jumpstart/azure_arc_data) on AKS, AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM.

- [Install the client tools](install-client-tools.md)
- [Plan an Azure Arc-enabled data services deployment](plan-azure-arc-data-services.md) (requires installing the client tools first)
- [Create an Azure SQL Managed Instance on Azure Arc](create-sql-managed-instance.md) (requires creation of an Azure Arc data controller first)
- [Create an Azure Database for PostgreSQL server on Azure Arc](create-postgresql-server.md) (requires creation of an Azure Arc data controller first)
- [Resource providers for Azure services](../../azure-resource-manager/management/azure-services-resource-providers.md)
