---
author: jkleinschnitz-msft
ms.author: jameskl
ms.service: azure-arc
ms.topic: include
ms.date: 05/02/2023
---

<!---
At this time, a test or preview build is not available for the next release.
-->

May 2023 preview release is now available.

|Component|Value|
|-----------|-----------|
|Container images registry/repository |`mcr.microsoft.com/arcdata/preview`|
|Container images tag |`v1.19.0_2023-05-09`|
|**CRD names and version:**| |
|`activedirectoryconnectors.arcdata.microsoft.com`| v1beta1, v1beta2, v1|
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
|`arcdata` Azure CLI extension version|1.5.0 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc-enabled Kubernetes helm chart extension version|1.19.0|
|Azure Arc Extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.8.0 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.8.0 ([Download](https://aka.ms/ads-azcli-ext))|

### Release notes

- Arc SQL MI GP | Customer-Managed TDE | Preview
- Arc SQL MI | Configuration Manager | sp_configure support
- Arc SQL MI | Service-Managed Credential Rotation
- Arc Data Services | Upgrade to OpenSearch | GA
- Arc Data Services | Arc Data Controller | az CLI | Improved Arc data controller upgrade reliability

