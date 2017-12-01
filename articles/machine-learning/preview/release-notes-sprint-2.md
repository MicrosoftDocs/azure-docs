---
title: Azure ML Workbench release notes for sprint 2 December 2017
description: This document details the updates for the sprint 2 release of Azure ML 
services: machine-learning
author: raymondlaghaeian
ms.author: raymondl
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 12/04/2017
---

# Sprint 2 - December 2017 

#### Version number: 0.1.1711.15243

>Here is how you can [find the version number](https://docs.microsoft.com/en-us/azure/machine-learning/preview/known-issues-and-troubleshooting-guide).

Welcome to the third update of Azure Machine Learning Workbench. We continue to make improvements around security, stability and maintainability in the workbench app, the CLI and the back end services layer. Thanks very much for sending us smiles and frowns. Many of the below updates are made as direct results of your feedback. Please keep them coming!

## Notable New Features
- Deep Learning on Spark with GPU support using MMLSpark
- Enabled Azure ML model management containers for Azure IoT Edge compatibility
- Registered model list and detail views available in the Azure portal

## Detailed Updates
Below is a list of detailed updates in each component area of Azure Machine Learning in this sprint.

### Installer
- Installer can self update so that bugs fixes and new features can be supported without user having to reinstall it

### Workbench
- Read-only file view now has light blue background
- Moved Edit button to the right to make it more discoverable.
- .dsource, .dprep, and .ipynb file can now be rendered in raw text format.

### MMLSpark
- Deep Learning on Spark with GPU support
- Support for ARM templates for easy resource deployment

### Data preparation 
- A Pattern Frequency Inspector to view the string patterns in a column. You can also filter your data using these patterns.

![Image of pattern frequency inspector on Product Number](media/release-notes-sprint-2/pattern-inspector-product-number.png)

- Performance improvements while recommending edge cases to review in the 'derive column by example' transformation

- Support for SQL Server as a data source

![Image of creating a new SQL server data source](media/release-notes-sprint-2/sql-server-data-source.png)

- Enabled "At a glance" view of row and column counts

![Image of row column count at a glace](media/release-notes-sprint-2/row-col-count.png)

- Fixed issue with converting multiple columns to date

- Fixed issue that user could select output column as a source in Derive Column By Example if user changed output column name in the advanced mode.

### Job execution
- Ability to access compute targets using key-based SSH in addition to username/password-based access.

### Visual Studio Tools for AI. 
- Added support for [Visual Studio Tools for AI](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.vstoolsai-vs2017). 

### Command Line Interface (CLI)
- Added `az ml datasource create` command allowing to create a data source file from the command-line.

### Model Management and Operationalization

- AML model management containers are compatible with Azure IoT Edge devices when operationalized (no extra steps required)
- Improvements of error messages in the o16n CLI
- Bug fixes in model management portal UX  
- Consistent letter casing for model management attributes in the detail page
- Realtime scoring calls timeout set to 60 seconds
- Registered model list and detail views available in the Azure portal

![model details in portal](media/release-notes-sprint-2/model-list.jpg)

![model overview in portal](media/release-notes-sprint-2/model-overview-portal.jpg)

### Sample projects
- Iris and SparkMML samples updated with the new Azure ML SDK version

## BREAKING CHANGES
We promoted the `--type` switch in `az ml computecontext attach` to a sub-command. 

- `az ml computecontext attach --type remotedocker` is now `az ml computecontext attach remotedocker`

- `az ml computecontext attach --type cluster` is now `az ml computecontext attach cluster`
