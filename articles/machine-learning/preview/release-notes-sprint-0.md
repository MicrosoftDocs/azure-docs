---
title: Azure ML Workbench release notes for sprint 0 October 2017
description: This document details the updates for the sprint 0 release of Azure ML 
services: machine-learning
author: hning86
ms.author: haining
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 10/12/2017
---

# Sprint 0 - October 2017 

**Version number: 0.1.1710.04013**

Welcome to the first update of Azure Machine Learning Workbench following our initial public preview at the Microsoft Ignite 2017 conference. The main updates in this release are reliability and stabilization fixes.  Some of the critical issues we addressed include:

## New features
- macOS High Sierra is now supported

## Bug fixes
### Workbench experience
- Drag and drop a file into Workbench causes the Workbench to crash.
- The terminal window in VS Code configured as an IDE for Workbench does not recognize _az ml_ commands.

### Workbench authentication
We made a number of updates to improve various login and authentication issues reported.
- Authentication window keeps popping-up, particularly when Internet connection is not stable.
- Improved reliability issues around authentication token expiration.
- In some cases, authentication window appears twice.
- Workbench main window still displays "authenticating" message when the authentication process has actually finished and the pop-up dialog box already dismissed.
- If there is no Internet connection, the authentication dialog pops up with a blank screen.

### Data preparation 
- When a specific value is filtered, errors and missing values are also filtered out.
- Changing a sampling strategy removes subsequent existing join operations.
- Replacing Missing Value transform does not take NaN into consideration.
- Date type inference throws exception when null value encountered.

### Job execution
- There is no clear error message when job execution fails to upload project folder because it exceeded the size limit.
- If user's Python script changes the working directory, the files written to outputs folders are not tracked. 
- If the active Azure subscription is different than the one the current project belongs to, job submission results a 403 error.
- When Docker is not present, no clear error message is returned if user tries to use Docker as an execution target.
- .runconfig file is not saved automatically when user clicks on _Run_ button.

### Jupyter Notebook
- Notebook server cannot start if user uses with certain login types.
- Notebook server error messages do not surface in logs visible to user.

### Azure portal
- Selecting the dark theme of Azure portal causes Model Management blade to display as a black box.

### Operationalization
- Reusing a manifest to update a web service causes a new Docker image built with a random name.
- Web service logs cannot be retrieved from Kubernetes cluster.
- Misleading error message is printed when user attempts to create a Model Management account or an ML Compute account and encounters permissions issues.
