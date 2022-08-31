---
author: MikeRayMSFT
ms.author: mikeray
ms.service: azure-arc
ms.topic: include
ms.date: 08/02/2022
---
<!--
At this time, a test or preview build is not available for the next release.
-->


The current test release published on September 13, 2022.

|Component|Value|
|-----------|-----------|
|Container images registry/repository |`mcr.microsoft.com/arcdata/test`|
|Container images tag |`v1.11.0_2022-09-13`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`sqlmanagedinstancereprovisionreplicatask.tasks.sql.arcdata.microsoft.com`: v1beta1<br/>|
|Azure Resource Manager (ARM) API version|2022-03-01-preview (No change)|
|`arcdata` Azure CLI extension version|1.4.6 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc enabled Kubernetes helm chart extension version|1.10.0 (Note: This versioning scheme is new, starting from this release. The scheme follows the semantic versioning scheme of the container images.)|
|Arc Data extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.5.2 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.5.2 ([Download](https://aka.ms/ads-azcli-ext))|

New for this release:

- Arc data controller
  - New extensions to monitoring stack to enable Kafka as a data cache and expose an OpenTelemetry endpoint for integration.  See documentation for more details.
  - Deleting an AD connector that is in use is now blocked.  First remove all database instances that are using it and then remove the AD connector.

- Arc-enabled SQL managed instance
  - Added support for specifying multiple encryption types for AD connectors using the Azure CLI extension or Azure portal.

- Arc-enabled PostgreSQL server
  - Removed Hyperscale/Citus scale-out capabilities. Focus will be on providing a single node Postgres server service. All user experiences have had terms and concepts like 'Hyperscale', 'server groups', 'worker nodes', 'coordinator nodes', etc. removed.  **BREAKING CHANGE**
  - The postgresql container image is based on [CBL-Mariner](https://github.com/microsoft/CBL-Mariner) base OS image.
  - Only PostgreSQL version 14 is supported for now. Versions 11 and 12 have been removed.  Two new images are introduced: `arc-postgres-14` and `arc-postgresql-agent`.  The `arc-postgres-11` and `arc-postgres-12` container images are removed going forward.  If you use the container image sync script, get the latest image once this [pull request](https://github.com/microsoft/azure_arc/pull/1340) has merged.
  - The postgresql CRD version has been updated to v1beta3.  Some properties such as `workers` have been removed or changed.  Update any scripts or automation you have as needed to align to the new CRD schema. **BREAKING CHANGE**

- `arcdata` Azure CLI extension
  - Columns for desiredVersion and runningVersion are added to the following commands: `az sql mi-arc list` and `kubectl get sqlmi` to easily compare what the runningVersion and desiredVersion are.
  - Added more details on available upgrades to the `az arcdata dc list-upgrades` command.
  - The command group `az postgres arc-server` is renamed to `az postgres server-arc`. **BREAKING CHANGE**
  - Some of the `az postgres server-arc` commands have changed to remove things like `--workers`.  **BREAKING CHANGE**


