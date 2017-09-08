---
title: In depth guide on how to use Azure Machine Learning Data Preparation  | Microsoft Docs
description: This document provides the overview and details on solving data problems with Azure ML data prep
services: machine-learning
author: euangMS
ms.author: euang
manager: 
ms.reviewer: 
ms.service: 
ms.workload: 
ms.custom: 
ms.devlang: 
ms.topic: 
ms.date: 09/07/2017
---
# Data Preparation User Guide #

## Introduction ##


## Understanding how it all works ##
### Step Execution, History, and Caching ###
Data Prep step history maintains a series of caches for perf reasons. If you click on a step, and it hits a cache it does not re-execute. If you have a write block at the end of the step history and you flip back and forth on the steps but make no changes, then the write will not be triggered after the first time. If you 
- Make changes to the write block or
- Add a new transform block and move it above the write block generating a cache invalidation or
- If you change the properties of a block above the write block generating a cache invalidation or
- Select refresh on a sample(thus invalidating all the cache’s)

Then a new write occurs and overwrites the previous one.

### Error Values ###
### Sampling ###
### Forking, Merging, and Appending ###
### Filtering ###

### List of Appendices ###
[Appendix 1 - Supported Platforms](data-prep-appendix1-supported-platforms.md)  
[Appendix 2 - Supported Data Sources](data-prep-appendix2-supported-data-sources.md)  
[Appendix 3 - Supported Transforms](data-prep-appendix3-supported-transforms.md)  
[Appendix 4 - Supported Inspectors](data-prep-appendix4-supported-inspectors.md)  
[Appendix 5 - Supported Destinations](data-prep-appendix5-supported-destinations.md)  
[Appendix 6 - Sample Filter Expressions in Python](data-prep-appendix6-sample-filter-expressions-python.md)  
[Appendix 7 - Sample Transform Dataflow Expressions in Python](data-prep-appendix7-sample-transform-data-flow-python.md)  
[Appendix 8 - Sample Data Sources in Python](data-prep-appendix8-sample-source-connections-python.md)  
[Appendix 9 - Sample Destination Connections in Python](data-prep-appendix9-sample-destination-connections-python.md)  
[Appendix 10 - Sample Column Transforms in Python](data-prep-appendix10-sample-custom-column-transforms-python.md)  