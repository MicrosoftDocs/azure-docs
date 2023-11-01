---
author: jkleinschnitz-msft
ms.author: jameskl
ms.service: azure-arc
ms.topic: include
ms.date: 10/10/2023
---

<!--
At this time, a test or preview build is not available for the next release.

-->
 
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
- Arc SQL Server | Restore | Point-in-time-restore using Azure CLI and Portal | Public Preview
  - This feature allows customers to do a point-in-time restore of their databases, if Automated Backups is enabled. Restore can be done either from Azure portal or via az CLI.
- Arc SQL Server | Monitoring | Performance dashboards of an individual Arc-enabled SQL Server in the Azure Portal | Public Preview
- Arc SQL Server | I can track the provision state and (extension service) status of Azure extension for SQL Server | GA
  - With release onwards, customers can easily track the provisioning status of Azure Arc extension for SQL Server and Azure Arc guest agent in the properties tab for Arc enabled SQL Server. 
- Arc SQL Server | Backups | Configure backups at Instance level using custom schedule for Arc enabled SQL Server for Both Portal and CLI| Public Preview
  - Configure Automated Backups with a custom schedule and custom retention period, on an Arc enabled SQL Server.
- Arc SQL Server | High Availability | Availability Group Management - Manual Failover | Public Preview
  - This Public Preview feature allows customers to perform a planned, manual failover on an Always on Availability Group replica, using Azure portal.
- Arc SQL Server | Availability Groups Upload Status - I can track the availability upload status | Public Preview
  - Starting from this release customers can track the status and when is the last time that the Always on Availabilities inventory data is updated.  You can find two new properties, "Upload status" and "Last collected time" in the "Availability Groups" tab of the Arc-enabled SQL Server. 
- Arc SQL Server | Add support for separate proxy bypass value for Arc SQL Server only | GA
