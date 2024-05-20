---
author: jkleinschnitz-msft
ms.author: jameskl
ms.service: azure-arc
ms.custom:
  - ignite-2023
ms.topic: include
ms.date: 04/30/2024
---

<!---
At this time, a test or preview build is not available for the next release.
-->

May, 2024 preview release is now available.

|Component|Value|
|-----------|-----------|
|Container images registry/repository |`mcr.microsoft.com/arcdata/preview`|
|Container images tag |`v1.30.0_2024-05-14`|
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
|`arcdata` Azure CLI extension version|1.5.14 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc-enabled Kubernetes helm chart extension version|1.30.0|
|Azure Arc Extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.8.0 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.8.0 ([Download](https://aka.ms/ads-azcli-ext))|
|SQL Database version | 970 |

Release Notes:
- Arc SQL Server | Migration | Run migration assessment on demand from the Azure portal | Public Preview
  - The SQL Server migration assessment runs on a default once-a-week schedule, every Sunday around 11 PM.  With this feature,  "Run assessment" users can initiate the SQL Server migration assessment whenever they want. This immediate assessment provides users with readiness evaluations and Azure SQL configuration assessments right away.
- Arc SQL Server | High Availability | Inventory and real-time status for Availability Groups | GA
- Arc SQL Server | High Availability | Availability Group Management - Manual Failover | GA
- Arc SQL Server | Arc enabled SQL Server FCI - View SQL Server FCI metadata in Azure portal | GA
