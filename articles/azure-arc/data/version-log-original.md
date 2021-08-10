---
title: Azure Arc-enabled data services - release versions
description: A log of versions by release date for Azure Arc-enabled data services
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 08/06/2021
ms.topic: conceptual
# Customer intent: As a data professional, I want to understand what versions of components align with specific releases.
---

# Version log

The following table describes the various versions over time as they change:

|Date|Release name|Container images tag|CRDs and versions|ARM API version|arcdata Azure CLI extension version|Arc enabled Kubernetes helm chart extension version|Arc Data extension for Azure Data Studio|
|---|---|---|---|---|---|---|---|
|July 30, 2021|Arc enabled SQL Managed Instance General Purpose and Arc enabled SQL Server General Availability|v1.0.0_2021-07-30|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 <br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1 <br/>`monitors.arcdata.microsoft.com`: v1beta1, v1 <br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 <br/>`postgresqls.arcdata.microsoft.com`: v1beta1 <br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1 <br/>`dags.sql.arcdata.microsoft.com`: v1beta1 <br/>|2021-08-01 (stable)|1.0|1.0.16701001, release train: stable|0.9.5|
|Aug 3, 2021|Update to Azure Arc extension for Azure Data Studio to align with July 30, General Availability|-|-|-|-|-|0.9.6|
