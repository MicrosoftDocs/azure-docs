---
title: Azure Arc-enabled data services - release versions
description: A log of versions by release date for Azure Arc-enabled data services
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.custom: event-tier1-build-2022
ms.date: 08/02/2022
ms.topic: conceptual
#Customer intent: As a data professional, I want to understand what versions of components align with specific releases.
---

# Version log

This article identifies the component versions with each release of Azure Arc-enabled data services.

## September 13, 2022

|Component|Value|
|-----------|-----------|
|Container images tag |`v1.11.0_2022-09-13`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2, v1beta3<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`sqlmanagedinstancereprovisionreplicatask.tasks.sql.arcdata.microsoft.com`: v1beta1<br/>`otelcollectors.arcdata.microsoft.com`: v1beta1<br/>`telemetryrouters.arcdata.microsoft.com`: v1beta1<br/>|
|Azure Resource Manager (ARM) API version|2022-03-01-preview (No change)|
|`arcdata` Azure CLI extension version|1.4.6 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc enabled Kubernetes helm chart extension version|1.11.0 (Note: This versioning scheme is new, starting from this release. The scheme follows the semantic versioning scheme of the container images.)|
|Arc Data extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.5.4 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.5.4 ([Download](https://aka.ms/ads-azcli-ext))|

## August 9, 2022

|Component|Value|
|-----------|-----------|
|Container images tag |`v1.10.0_2022-08-09`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2<br/>|
|Azure Resource Manager (ARM) API version|2022-03-01-preview (No change)|
|`arcdata` Azure CLI extension version|1.4.5 ([Download](https://arcdataazurecliextension.blob.core.windows.net/stage/arcdata-1.4.5-py2.py3-none-any.whl))|
|Arc enabled Kubernetes helm chart extension version|1.2.20381002|
|Arc Data extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.5.1 ([Download](https://azuredatastudioarcext.blob.core.windows.net/stage/arc-1.5.1.vsix))</br>1.5.1 ([Download](https://azuredatastudioarcext.blob.core.windows.net/stage/azcli-1.5.1.vsix))|

## July 12, 2022

|Component|Value|
|-----------|-----------|
|Container images tag |`v1.9.0_2022-07-12`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v5<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2<br/>|
|Azure Resource Manager (ARM) API version|2022-03-01-preview (No change)|
|`arcdata` Azure CLI extension version|1.4.3 ([Download](https://arcdataazurecliextension.blob.core.windows.net/stage/arcdata-1.4.3-py2.py3-none-any.whl))|
|Arc enabled Kubernetes helm chart extension version|1.2.20031002|
|Arc Data extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.3.0 ([Download](https://azuredatastudioarcext.blob.core.windows.net/stage/arc-1.3.0.vsix))</br>1.3.0 ([Download](https://azuredatastudioarcext.blob.core.windows.net/stage/azcli-1.3.0.vsix))|

## June 14, 2022

|Component|Value|
|-----------|-----------|
|Container images tag |`v1.8.0_2022-06-14`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v5<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2<br/>|
|ARM API version|2022-03-01-preview (No change)|
|`arcdata` Azure CLI extension version|1.4.2 ([Download](https://arcdataazurecliextension.blob.core.windows.net/stage/arcdata-1.4.2-py2.py3-none-any.whl))|
|Arc enabled Kubernetes helm chart extension version|1.2.19831003|
|Arc Data extension for Azure Data Studio|1.3.0 (No change)([Download](https://aka.ms/ads-arcdata-ext))|


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
