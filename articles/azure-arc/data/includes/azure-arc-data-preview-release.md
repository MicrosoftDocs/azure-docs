---
author: MikeRayMSFT
ms.author: mikeray
ms.service: azure-arc
ms.topic: include
ms.date: 08/02/2022
---


The current preview release published on November 1, 2022.

|Component|Value|
|-----------|-----------|
|Container images registry/repository |`mcr.microsoft.com/arcdata/preview`|
|Container images tag |`v1.13.0_2022-11-08`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v7<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1 through v2<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`sqlmanagedinstancereprovisionreplicatask.tasks.sql.arcdata.microsoft.com`: v1beta1<br/>`telemetrycollectors.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3 *use to be otelcollectors*<br/>`telemetryrouters.arcdata.microsoft.com`: v1beta1, v1beta2<br/>|
|Azure Resource Manager (ARM) API version|2022-06-15-preview|
|`arcdata` Azure CLI extension version|1.4.8 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc-enabled Kubernetes helm chart extension version|1.13.0|
|Azure Arc Extension for Azure Data Studio<br/>`arc`<br/>`azcli`|*No Changes*<br/>1.5.4 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.5.4 ([Download](https://aka.ms/ads-azcli-ext))|



New for this release:
- Azure Arc data controller
  - Support database as resource in Azure Arc data resource provider 

<!--
- Arc-enabled SQL managed instance
-->

- Arc-enabled PostgreSQL server
  - Add support for automated backups

- `arcdata` Azure CLI extension
  - CLI support for automated backups: Setting the `--storage-class-backups` parameter for the create command will enable automated backups
