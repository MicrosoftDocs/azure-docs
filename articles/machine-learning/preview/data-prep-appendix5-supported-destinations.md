---
title: Supported data destinations/outputs available with Azure Machine Learning Data Preparation  | Microsoft Docs
description: This document provides a complete list of supported destinations/outputs available for Azure ML data prep
services: machine-learning
author: euangMS
ms.author: euang
manager: lanceo
ms.reviewer: 
ms.service: machine-learning
ms.workload: data-services
ms.custom: 
ms.devlang: 
ms.topic: article 
ms.date: 09/07/2017
---

# Supported data exports for this preview 
It is possible to export to several different formats. These formats can be used to retain intermediate results of data prep before integrating into the rest of the Machine Learning workflow.

## Types 
### CSV File 
Write a Comma-Separated Value file to storage

#### Options
- Line Endings
- Replace Nulls With
- Replace Errors with 
- Separator


### Parquet
Write a Parquet file to storage

#### Options
- Replace Errors With
- Rows Per Row Group


## Locations 
### Local 
Local hard drive or mapped network storage location

### Azure BLOB 
Azure Storage (BLOB), requires an Azure subscription

