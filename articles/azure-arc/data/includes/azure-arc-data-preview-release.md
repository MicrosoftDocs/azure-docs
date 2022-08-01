---
author: MikeRayMSFT
ms.author: mikeray
ms.service: azure-arc
ms.topic: include
ms.date: 07/26/2022
---

<!--At this time, a test or preview build is not available for the next release.-->

The current preview released on July 26, 2022.

|Component|Value|
|-----------|-----------|
|Container images registry/repository |`mcr.microsoft.com/arcdata/test`|
|Container images tag |`v1.10.0_2022-08-09`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2<br/>|
|Azure Resource Manager (ARM) API version|2022-03-01-preview (No change)|
|`arcdata` Azure CLI extension version|1.4.5 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc enabled Kubernetes helm chart extension version|1.2.20321000|
|Arc Data extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.4.2 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.4.2 ([Download](https://aka.ms/ads-azcli-ext))|

New for this release:

- Miscellaneous
  - More details on available upgrades when using Azure portal or `az arcdata dc list-upgrades` and `az sql mi-arc list` including a link to the release notes for more details on what has changed.

- Arc-enabled SQL Managed Instance
  - AES encryption can now be enabled for AD authentication.

- Data controller
  - Control DB error log is now also collected to the logs database and searchable in the logs dashboard.  Optionally, the log can also be sent to Log Analytics along with other logs.
