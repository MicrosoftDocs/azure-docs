---
author: jkleinschnitz-msft
ms.author: jameskl
ms.service: azure-arc
ms.custom:
  - ignite-2023
ms.topic: include
ms.date: 11/1/2023
---

At this time, a test or preview build is not available for the next release.

<!--
 
Nov 2023 test release is now available.

|Component|Value|
|-----------|-----------|
|Container images registry/repository |`mcr.microsoft.com/arcdata/test`|
|Container images tag |`v1.25.0_2023-11-14`|
|**CRD names and version:**| |
|`activedirectoryconnectors.arcdata.microsoft.com`| v1beta1, v1beta2, v1, v2|
|`datacontrollers.arcdata.microsoft.com`| v1beta1, v1 through v5|
|`exporttasks.tasks.arcdata.microsoft.com`| v1beta1, v1, v2|
|`failovergroups.sql.arcdata.microsoft.com`| v1beta1, v1beta2, v1, v2|
|`kafkas.arcdata.microsoft.com`| v1beta1 through v1beta4|
|`monitors.arcdata.microsoft.com`| v1beta1, v1, v3|
|`postgresqls.arcdata.microsoft.com`| v1beta1 through v1beta6|
|`postgresqlrestoretasks.tasks.postgresql.arcdata.microsoft.com`| v1beta1|
|`sqlmanagedinstances.sql.arcdata.microsoft.com`| v1beta1, v1 through v13|
|`sqlmanagedinstancemonitoringprofiles.arcdata.microsoft.com`| v1beta1, v1beta2|
|`sqlmanagedinstancereprovisionreplicatasks.tasks.sql.arcdata.microsoft.com`| v1beta1|
|`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`| v1beta1, v1|
|`telemetrycollectors.arcdata.microsoft.com`| v1beta1 through v1beta5|
|`telemetryrouters.arcdata.microsoft.com`| v1beta1 through v1beta5|
|Azure Resource Manager (ARM) API version|2023-11-01-preview|
|`arcdata` Azure CLI extension version|1.5.7 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc-enabled Kubernetes helm chart extension version|1.25.0|
|Azure Arc Extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.8.0 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.8.0 ([Download](https://aka.ms/ads-azcli-ext))|
|SQL Database version | 957 |

### Release notes

#### Arc-enabled SQL Server

- Configure backups at instance level using custom schedule for SQL Server enabled by Azure Arc instances for both portal and CLI - public preview.
  - Configure Automated Backups with a custom schedule and custom retention period, on an Arc enabled SQL Server.
- Point-in-time-restore using Azure CLI and Azure portal - public preview.
  - Restore a database to a point-in-time restore of their databases, if automatic backups are enabled. Restore can be done either from Azure portal or via az CLI.

- Monitoring | Performance dashboards of an individual SQL Server enabled by Azure Arc in the Azure portal - public preview.

- Track the provision state and (extension service) status of Azure extension for SQL Server - general availability.
  - Beginning with this release, you can track the provisioning status of Azure Arc extension for SQL Server and Azure Arc guest agent in the properties tab for Arc enabled SQL Server. 

- High Availability | Manage Always On availability group - manual failover - public preview.
  - Perform a planned, manual failover on an availability group replica, using Azure portal.
- Availability group status - Track the availability upload status | public preview.
  - Beginning with this release, track the status and see the last time that the availability group inventory data is updated.  The portal shows two new properties, **Upload status** and **Last collected time**" in the **Availability Groups** tab of the Arc-enabled SQL Server. 
- Support for separate proxy bypass value for Arc SQL Server only - general availability.

-->
