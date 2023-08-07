---
author: jkleinschnitz-msft
ms.author: jameskl
ms.service: azure-arc
ms.topic: include
ms.date: 05/02/2023
---
<!--
At this time, a test or preview build is not available for the next release.
-->

Aug 2023 preview release is now available.

|Component|Value|
|-----------|-----------|
|Container images registry/repository |`mcr.microsoft.com/arcdata/preview`|
|Container images tag |`v1.22.0_2023-08-08`|
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
|Azure Resource Manager (ARM) API version|2023-01-15-preview|
|`arcdata` Azure CLI extension version|1.5.4 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc-enabled Kubernetes helm chart extension version|1.22.0|
|Azure Arc Extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.8.0 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.8.0 ([Download](https://aka.ms/ads-azcli-ext))|
|SQL Database version | 957 |

### Release notes

- Arc Enabled SQL Server | Automatic certificate rotation for certificates used for Azure Active Directory authentication is now supported.
    - For Service Managed Certificates the certificate rotation is automatic.
    - For Customer Managed Certificates user needs to upload the certificate to App Registration manually.
- Support for configuring and managing Azure Failover groups between two Arc enabled SQL managed instances using Azure portal. 
- Upgraded OpenSearch and OpenSearch Dashboards from 2.7.0 to 2.8.0




