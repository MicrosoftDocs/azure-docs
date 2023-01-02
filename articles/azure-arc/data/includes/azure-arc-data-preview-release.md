---
author: jkleinschnitz-msft
ms.author: jameskl
ms.service: azure-arc
ms.topic: include
ms.date: 12/7/2022
---

<!---
At this time, a test or preview build is not available for the next release.
--->

January 2023 test release is now available.

|Component|Value|
|-----------|-----------|
|Container images registry/repository |`mcr.microsoft.com/arcdata/test`|
|Container images tag |`v1.15.0_2023-01-10 `|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v9<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3, v1beta4<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1 through v2<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`sqlmanagedinstancereprovisionreplicatask.tasks.sql.arcdata.microsoft.com`: v1beta1<br/>`telemetrycollectors.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3 *use to be otelcollectors*<br/>`telemetryrouters.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3, v1beta4<br/>`sqlmanagedinstancemonitoringprofiles.arcdata.microsoft.com`: v1beta1, v1beta2<br/>|
|Azure Resource Manager (ARM) API version|2022-06-15-preview|
|`arcdata` Azure CLI extension version|1.4.10 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc-enabled Kubernetes helm chart extension version|1.15.0|
|Azure Arc Extension for Azure Data Studio<br/>`arc`<br/>`azcli`|*No Changes*<br/>1.7.0 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.7.0 ([Download](https://aka.ms/ads-azcli-ext))|

New for this release:

- Kafka "Separate" controller mode : This feature describes the ability to set ".spec.kraftControllerMode" to combined on a Kafka custom resource which creates two stateful sets (one for brokers and one for controllers) instead of a single "server" statefulset that houses both. This feature also ships some health checking, the ability to run multiple kafka instances in a cluster, and security improvements.
