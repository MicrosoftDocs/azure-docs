---
author: MikeRayMSFT
ms.author: mikeray
ms.service: azure-arc
ms.topic: include
ms.date: 08/02/2022
---


At this time, a test or preview build is not available for the next release.

<!----

The current preview release published on October 4, 2022.

|Component|Value|
|-----------|-----------|
|Container images registry/repository |`mcr.microsoft.com/arcdata/preview`|
|Container images tag |`v1.12.0_2022-10-11`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v7<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1 through v2<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`sqlmanagedinstancereprovisionreplicatask.tasks.sql.arcdata.microsoft.com`: v1beta1<br/>`otelcollectors.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`telemetryrouters.arcdata.microsoft.com`: v1beta1, v1beta2<br/>|
|Azure Resource Manager (ARM) API version|2022-03-01-preview (No change)|
|`arcdata` Azure CLI extension version|1.4.7 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc enabled Kubernetes helm chart extension version|1.12.0|
|Arc Data extension for Azure Data Studio<br/>`arc`<br/>`azcli`|*No Changes*<br/>1.5.4 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.5.4 ([Download](https://aka.ms/ads-azcli-ext))|



New for this release:
- Arc data controller

- Arc-enabled SQL managed instance

<!--
- Arc-enabled PostgreSQL server
-->
<!--
- `arcdata` Azure CLI extension
-->
