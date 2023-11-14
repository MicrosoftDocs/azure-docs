---
title: Azure Arc-enabled data services - release versions
description: A log of versions by release date for Azure Arc-enabled data services
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.custom:
  - event-tier1-build-2022
  - ignite-2023
ms.date: 10/10/2023
ms.topic: conceptual
#Customer intent: As a data professional, I want to understand what versions of components align with specific releases.
---

# Version log

This article identifies the component versions with each release of Azure Arc-enabled data services.

## November 14, 2023

|Component|Value|
|-----------|-----------|
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

## October 10, 2023

|Component|Value|
|-----------|-----------|
|Container images tag |`v1.24.0_2023-10-10`|
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
|`arcdata` Azure CLI extension version|1.5.6 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc-enabled Kubernetes helm chart extension version|1.24.0|
|Azure Arc Extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.8.0 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.8.0 ([Download](https://aka.ms/ads-azcli-ext))|
|SQL Database version | 957 |

## September 12, 2023

|Component|Value|
|-----------|-----------|
|Container images tag |`v1.23.0_2023-09-12`|
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
|`arcdata` Azure CLI extension version|1.5.5 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc-enabled Kubernetes helm chart extension version|1.23.0|
|Azure Arc Extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.8.0 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.8.0 ([Download](https://aka.ms/ads-azcli-ext))|
|SQL Database version | 957 |

## August 8, 2023

|Component|Value|
|-----------|-----------|
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

## July 11, 2023

|Component|Value|
|-----------|-----------|
|Container images tag |`v1.21.0_2023-07-11`|
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
|`arcdata` Azure CLI extension version|1.5.3 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc-enabled Kubernetes helm chart extension version|1.21.0|
|Azure Arc Extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.8.0 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.8.0 ([Download](https://aka.ms/ads-azcli-ext))|
|SQL Database version | 957 |

## June 13, 2023

|Component|Value|
|-----------|-----------|
|Container images tag |`v1.20.0_2023-06-13`|
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
|`arcdata` Azure CLI extension version|1.5.2 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc-enabled Kubernetes helm chart extension version|1.20.0|
|Azure Arc Extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.8.0 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.8.0 ([Download](https://aka.ms/ads-azcli-ext))|
|SQL Database version | 957 |

## May 9, 2023

|Component|Value|
|-----------|-----------|
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
| SQL Database version | 931 |

## April 11, 2023

|Component|Value|
|-----------|-----------|
|Container images tag |`v1.18.0_2023-04-11`|
|**CRD names and version:**| |
|`activedirectoryconnectors.arcdata.microsoft.com`| v1beta1, v1beta2, v1|
|`datacontrollers.arcdata.microsoft.com`| v1beta1, v1 through v5|
|`exporttasks.tasks.arcdata.microsoft.com`| v1beta1, v1, v2|
|`failovergroups.sql.arcdata.microsoft.com`| v1beta1, v1beta2, v1, v2|
|`kafkas.arcdata.microsoft.com`| v1beta1 through v1beta4|
|`monitors.arcdata.microsoft.com`| v1beta1, v1, v2|
|`postgresqls.arcdata.microsoft.com`| v1beta1 through v1beta6|
|`postgresqlrestoretasks.tasks.postgresql.arcdata.microsoft.com`| v1beta1|
|`sqlmanagedinstances.sql.arcdata.microsoft.com`| v1beta1, v1 through v12|
|`sqlmanagedinstancemonitoringprofiles.arcdata.microsoft.com`| v1beta1, v1beta2|
|`sqlmanagedinstancereprovisionreplicatasks.tasks.sql.arcdata.microsoft.com`| v1beta1|
|`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`| v1beta1, v1|
|`telemetrycollectors.arcdata.microsoft.com`| v1beta1 through v1beta5|
|`telemetryrouters.arcdata.microsoft.com`| v1beta1 through v1beta5|
|`redis.arcdata.microsoft.com`| v1beta1|
|Azure Resource Manager (ARM) API version|2023-01-15-preview|
|`arcdata` Azure CLI extension version|1.4.13 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc-enabled Kubernetes helm chart extension version|1.18.0|
|Azure Arc Extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.8.0 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.8.0 ([Download](https://aka.ms/ads-azcli-ext))|

## March 14, 2023

|Component|Value|
|-----------|-----------|
|Container images tag |`v1.17.0_2023-03-14 `|
|**CRD names and version:**| |
|`activedirectoryconnectors.arcdata.microsoft.com`| v1beta1, v1beta2, v1|
|`datacontrollers.arcdata.microsoft.com`| v1beta1, v1 through v5|
|`exporttasks.tasks.arcdata.microsoft.com`| v1beta1, v1, v2|
|`failovergroups.sql.arcdata.microsoft.com`| v1beta1, v1beta2, v1, v2|
|`kafkas.arcdata.microsoft.com`| v1beta1 through v1beta4|
|`monitors.arcdata.microsoft.com`| v1beta1, v1, v2|
|`postgresqls.arcdata.microsoft.com`| v1beta1 through v1beta5|
|`postgresqlrestoretasks.tasks.postgresql.arcdata.microsoft.com`| v1beta1|
|`sqlmanagedinstances.sql.arcdata.microsoft.com`| v1beta1, v1 through v11|
|`sqlmanagedinstancemonitoringprofiles.arcdata.microsoft.com`| v1beta1, v1beta2|
|`sqlmanagedinstancereprovisionreplicatasks.tasks.sql.arcdata.microsoft.com`| v1beta1|
|`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`| v1beta1, v1|
|`telemetrycollectors.arcdata.microsoft.com`| v1beta1 through v1beta5|
|`telemetryrouters.arcdata.microsoft.com`| v1beta1 through v1beta5|
|Azure Resource Manager (ARM) API version|2022-06-15-preview|
|`arcdata` Azure CLI extension version|1.4.12 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc-enabled Kubernetes helm chart extension version|1.17.0|
|Azure Arc Extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.8.0 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.8.0 ([Download](https://aka.ms/ads-azcli-ext))|

## February 14, 2023

|Component|Value|
|-----------|-----------|
|Container images tag |`v1.16.0_2023-02-14 `|
|**CRD names and version:**| |
|`activedirectoryconnectors.arcdata.microsoft.com`| v1beta1, v1beta2, v1|
|`datacontrollers.arcdata.microsoft.com`| v1beta1, v1 through v6|
|`exporttasks.tasks.arcdata.microsoft.com`| v1beta1, v1, v2|
|`failovergroups.sql.arcdata.microsoft.com`| v1beta1, v1beta2, v1, v2|
|`kafkas.arcdata.microsoft.com`| v1beta1, v1beta2, v1beta3|
|`monitors.arcdata.microsoft.com`| v1beta1, v1, v2|
|`postgresqls.arcdata.microsoft.com`| v1beta1, v1beta2, v1beta3, v1beta4, v1beta5|
|`postgresqlrestoretasks.tasks.postgresql.arcdata.microsoft.com`| v1beta1|
|`redis.arcdata.microsoft.com`| v1beta1, v1beta2|
|`sqlmanagedinstances.sql.arcdata.microsoft.com`| v1beta1, v1 through v10|
|`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`| v1beta1, v1|
|`sqlmanagedinstancereprovisionreplicatask.tasks.sql.arcdata.microsoft.com`| v1beta1|
|`sqlmanagedinstancemonitoringprofiles.arcdata.microsoft.com`| v1beta1, v1beta2|
|`telemetrycollectors.arcdata.microsoft.com`  *use to be otelcollectors*| v1beta1, v1beta2, v1beta3, v1beta4|
|`telemetryrouters.arcdata.microsoft.com`| v1beta1, v1beta2, v1beta3, v1beta4, v1beta4, v1beta5|
|Azure Resource Manager (ARM) API version|2022-06-15-preview|
|`arcdata` Azure CLI extension version|1.4.11 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc-enabled Kubernetes helm chart extension version|1.16.0|
|Azure Arc Extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.8.0 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.8.0 ([Download](https://aka.ms/ads-azcli-ext))|

## January 13, 2023

|Component|Value|
|-----------|-----------|
|Container images tag |`v1.15.0_2023-01-10`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v7<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1 through v2<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`sqlmanagedinstancereprovisionreplicatask.tasks.sql.arcdata.microsoft.com`: v1beta1<br/>`telemetrycollectors.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3 *use to be otelcollectors*<br/>`telemetryrouters.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3, v1beta4<br/>`sqlmanagedinstancemonitoringprofiles.arcdata.microsoft.com`: v1beta1, v1beta2<br/>|
|Azure Resource Manager (ARM) API version|2022-06-15-preview|
|`arcdata` Azure CLI extension version|1.4.10 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc-enabled Kubernetes helm chart extension version|1.15.0|
|Azure Arc Extension for Azure Data Studio<br/>`arc`<br/>`azcli`|*No Changes*<br/>1.7.0 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.7.0 ([Download](https://aka.ms/ads-azcli-ext))|

## December 13, 2022

|Component|Value|
|-----------|-----------|
|Container images tag |`v1.14.0_2022-12-13`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v7<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1 through v2<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`sqlmanagedinstancereprovisionreplicatask.tasks.sql.arcdata.microsoft.com`: v1beta1<br/>`telemetrycollectors.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3 *use to be otelcollectors*<br/>`telemetryrouters.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3, v1beta4<br/>`sqlmanagedinstancemonitoringprofiles.arcdata.microsoft.com`: v1beta1, v1beta2<br/>|
|Azure Resource Manager (ARM) API version|2022-06-15-preview|
|`arcdata` Azure CLI extension version|1.4.9 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc-enabled Kubernetes helm chart extension version|1.14.0|
|Azure Arc Extension for Azure Data Studio<br/>`arc`<br/>`azcli`|*No Changes*<br/>1.7.0 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.7.0 ([Download](https://aka.ms/ads-azcli-ext))|

## November 8, 2022


|Component|Value|
|-----------|-----------|
|Container images tag |`v1.13.0_2022-11-08`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v7<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1 through v2<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`sqlmanagedinstancereprovisionreplicatask.tasks.sql.arcdata.microsoft.com`: v1beta1<br/>`telemetrycollectors.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3 *use to be otelcollectors*<br/>`telemetryrouters.arcdata.microsoft.com`: v1beta1, v1beta2<br/>|
|Azure Resource Manager (ARM) API version|2022-06-15-preview|
|`arcdata` Azure CLI extension version|1.4.8 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc-enabled Kubernetes helm chart extension version|1.13.0|
|Azure Arc Extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.7.0 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.7.0 ([Download](https://aka.ms/ads-azcli-ext))|

## October 11, 2022

|Component|Value|
|-----------|-----------|
|Container images tag |`v1.12.0_2022-10-11`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v7<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1 through v2<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`sqlmanagedinstancereprovisionreplicatask.tasks.sql.arcdata.microsoft.com`: v1beta1<br/>`otelcollectors.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`telemetryrouters.arcdata.microsoft.com`: v1beta1, v1beta2<br/>|
|Azure Resource Manager (ARM) API version|2022-03-01-preview (No change)|
|`arcdata` Azure CLI extension version|1.4.7|
|Arc enabled Kubernetes helm chart extension version|1.12.0|
|Arc Data extension for Azure Data Studio<br/>`arc`<br/>`azcli`|*No Changes*<br/>1.5.4 </br>1.5.4 |

## September 13, 2022

|Component|Value|
|-----------|-----------|
|Container images tag |`v1.11.0_2022-09-13`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`sqlmanagedinstancereprovisionreplicatask.tasks.sql.arcdata.microsoft.com`: v1beta1<br/>`otelcollectors.arcdata.microsoft.com`: v1beta1<br/>`telemetryrouters.arcdata.microsoft.com`: v1beta1<br/>|
|Azure Resource Manager (ARM) API version|2022-03-01-preview (No change)|
|`arcdata` Azure CLI extension version|1.4.6|
|Arc enabled Kubernetes helm chart extension version|1.11.0 (Note: This versioning scheme is new, starting from this release. The scheme follows the semantic versioning scheme of the container images.)|
|Arc Data extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.5.4</br>1.5.4|

## August 9, 2022

|Component|Value|
|-----------|-----------|
|Container images tag |`v1.10.0_2022-08-09`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2<br/>|
|Azure Resource Manager (ARM) API version|2022-03-01-preview (No change)|
|`arcdata` Azure CLI extension version|1.4.5|
|Arc enabled Kubernetes helm chart extension version|1.2.20381002|
|Arc Data extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.5.1</br>1.5.1|

## July 12, 2022

|Component|Value|
|-----------|-----------|
|Container images tag |`v1.9.0_2022-07-12`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v5<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2<br/>|
|Azure Resource Manager (ARM) API version|2022-03-01-preview (No change)|
|`arcdata` Azure CLI extension version|1.4.3|
|Arc enabled Kubernetes helm chart extension version|1.2.20031002|
|Arc Data extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.3.0</br>1.3.0|

## June 14, 2022

|Component|Value|
|-----------|-----------|
|Container images tag |`v1.8.0_2022-06-14`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v5<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2<br/>|
|ARM API version|2022-03-01-preview (No change)|
|`arcdata` Azure CLI extension version|1.4.2|
|Arc enabled Kubernetes helm chart extension version|1.2.19831003|
|Arc Data extension for Azure Data Studio|1.3.0 (No change)|


## May 24, 2022

|Component  |Value  |
|--------------------------------------------------------|---------|
|Container images tag |`v1.7.0_2022-05-24`|
|CRD names and versions	|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6</br>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2</br>`kafkas.arcdata.microsoft.com`: v1beta1</br>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2</br>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v5</br>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2</br>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1</br>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1</br>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2|
|ARM API version|2022-03-01-preview (No change)|
|`arcdata` Azure CLI extension version|	1.4.1|
|Arc enabled Kubernetes helm chart extension version|1.2.19581002|
|Arc Data extension for Azure Data Studio|1.3.0|

## May 4, 2022

|Component  |Value  |
|--------------------------------------------------------|---------|
|Container images tag |`v1.6.0_2022-05-02`|
|CRD names and versions	|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v5</br>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2</br>`kafkas.arcdata.microsoft.com`: v1beta1</br>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2</br>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v5</br>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2</br>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1</br>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2</br>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2|
|ARM API version|2022-03-01-preview|
|`arcdata` Azure CLI extension version|	1.4.0|
|Arc enabled Kubernetes helm chart extension version|1.2.19481002|
|Arc Data extension for Azure Data Studio|1.2.0|

## April 6, 2022

|Component  |Value  |
|--------------------------------------------------------|---------|
|Container images tag |`v1.5.0_2022-04-05`|
|CRD names and versions	|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1, v2, v3, v4</br>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2</br>`kafkas.arcdata.microsoft.com`: v1beta1</br>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2</br>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1, v2, v3, v4</br>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2</br>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1</br>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2</br>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2|
|ARM API version|2021-11-01|
|`arcdata` Azure CLI extension version|	1.3.0|
|Arc enabled Kubernetes helm chart extension version|1.1.19211001|
|Arc Data extension for Azure Data Studio|1.1.0|

## March 8, 2022

|Component  |Value  |
|--------------------------------------------------------|---------|
|Container images tag |`v1.4.1_2022-03-08`
|CRD names and versions	|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1, v2, v3</br>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2</br>`kafkas.arcdata.microsoft.com`: v1beta1</br>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2</br>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1, v2, v3, v4</br>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2</br>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1</br>`dags.sql.arcdata.microsoft.com`: v1beta1, v2beta2</br>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1|
|ARM API version|2021-11-01|
|`arcdata` Azure CLI extension version|	1.2.3|
|Arc enabled Kubernetes helm chart extension version|1.1.18911000|
|Arc Data extension for Azure Data Studio|1.0|

## February 25, 2022

|Component  |Value  |
|--------------------------------------------------------|---------|
|Container images tag |`v1.4.0_2022-02-25`
|CRD names and versions	|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1, v2, v3</br>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2</br>`kafkas.arcdata.microsoft.com`: v1beta1</br>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2</br>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1, v2, v3, v4</br>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2</br>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1</br>`dags.sql.arcdata.microsoft.com`: v1beta1, v2beta2</br>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1|
|ARM API version|2021-11-01|
|`arcdata` Azure CLI extension version|	1.2.1|
|Arc enabled Kubernetes helm chart extension version|1.1.18791000|
|Arc Data extension for Azure Data Studio|1.0|

## January 27, 2022

|Component  |Value  |
|--------------------------------------------------------|---------|
|Container images tag |`v1.3.0_2022-01-27`
|CRD names and versions	|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1, v2</br>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2</br>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2</br>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1, v2, v3</br>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2</br>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1</br>`dags.sql.arcdata.microsoft.com`: v1beta1, v2beta2</br>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1|
|ARM API version|2021-11-01|
|`arcdata` Azure CLI extension version|	1.2.0|
|Arc enabled Kubernetes helm chart extension version|1.1.18501004|
|Arc Data extension for Azure Data Studio|1.0|

## December 16, 2021

The following table describes the components in this release.

|Component  |Value  |
|--------------------------------------------------------|---------|
|Container images tag                                    | `v1.2.0_2021-12-15` |
|CRD names and versions                                  | `datacontrollers.arcdata.microsoft.com`: v1beta1, v1, v2 <br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2 <br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2 <br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1, v2 <br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2 <br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1 <br/>`dags.sql.arcdata.microsoft.com`: v1beta1, v2beta2<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1 |
|ARM API version                                         | 2021-11-01 |
|`arcdata` Azure CLI extension version                   | 1.1.2 |
|Arc enabled Kubernetes helm chart extension version     | 1.1.18031001 |
|Arc Data extension for Azure Data Studio                | 0.11 |

## November 2, 2021

The following table describes the components in this release.

|Component  |Value  |
|--------------------------------------------------------|---------|
|Container images tag                                    | `v1.1.0_2021-11-02` |
|CRD names and versions                                  | `datacontrollers.arcdata.microsoft.com`: v1beta1, v1, v2 <br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2 <br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2 <br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1, v2 <br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2 <br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1 <br/>`dags.sql.arcdata.microsoft.com`: v1beta1, v2beta2 |
|ARM API version                                         | 2021-11-01 |
|`arcdata` Azure CLI extension version                   | 1.1.0 (Nov 3)</br>1.1.1 (Nov4) |
|Arc enabled Kubernetes helm chart extension version     | 1.0.17551005 - Required if upgrade from GA <br/><br/> 1.1.17561007 - GA+1/Nov release chart |
|Arc Data extension for Azure Data Studio                | 0.9.7 |

## August 3, 2021

This release provides an update for the Azure Arc extension for Azure Data Studio. The update aligns with July 30, general availability. The following table describes the updated component. 

|Component  |Value  |
|--------------------------------------------------------|---------|
|Arc Data extension for Azure Data Studio                | 0.9.6 |

All other components are the same as previously released.

## July 30, 2021

This release introduces general availability for Azure Arc-enabled SQL Managed Instance General Purpose and Azure Arc-enabled SQL Server. The following table describes the components in this release.

|Component  |Value  |
|--------------------------------------------------------|---------|
|Container images tag                                    | `v1.0.0_2021-07-30` |
|CRD names and versions                                  |`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 <br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1 <br/>`monitors.arcdata.microsoft.com`: v1beta1, v1 <br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 <br/>`postgresqls.arcdata.microsoft.com`: v1beta1 <br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1 <br/>`dags.sql.arcdata.microsoft.com`: v1beta1 <br/> |
|ARM API version                                         | 2021-08-01 (stable) |
|`arcdata` Azure CLI extension version                   | 1.0 |
|Arc enabled Kubernetes helm chart extension version     | 1.0.16701001, release train: stable |
|Arc Data extension for Azure Data Studio                | 0.9.5 |
