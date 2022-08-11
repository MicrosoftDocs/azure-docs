---
author: MikeRayMSFT
ms.author: mikeray
ms.service: azure-arc
ms.topic: include
ms.date: 08/02/2022
---

At this time, a test or preview build is not available for the next release.

<!--

The current test release published on Month #, ####.

|Component|Value|
|-----------|-----------|
|Container images registry/repository |`mcr.microsoft.com/arcdata/preview`|
|Container images tag |`v1.10.0_2022-08-09`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2<br/>|
|Azure Resource Manager (ARM) API version|2022-03-01-preview (No change)|
|`arcdata` Azure CLI extension version|1.4.5 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc enabled Kubernetes helm chart extension version|1.2.20381002|
|Arc Data extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.4.3 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.4.3 ([Download](https://aka.ms/ads-azcli-ext))|

New for this release:

- Arc-enabled SQL Managed Instance
  - AES encryption can now be enabled for AD authentication.

- `arcdata` Azure CLI extension
  - The Azure CLI help text for the Arc data controller, Arc-enabled SQL Managed Instance, and Active Directory connector command groups has been updated to reflect new naming conventions. Indirect mode arguments are now referred to as "Kubernetes API - targeted" arguments, and direct mode arguments are now referred to as "Azure Resource Manager - targeted" arguments.
-->

