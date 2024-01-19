---
title: Troubleshoot Validation For Schema Failed Error
titleSuffix: Azure Machine Learning
description: Troubleshooting steps when you get the "Validation for schema failed" error message in Azure Machine Learning v2 CLI 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: s-polly
ms.author: scottpolly
ms.reviewer: sgilley
ms.topic: troubleshooting 
ms.date: 01/06/2023
---

# Troubleshoot Validation For Schema Failed Error

This article helps fix all categories of Validation for Schema Failed errors that a user may encounter after submitting a **create** or **update** command for a YAML file while using Azure Machine Learning v2 CLI. The list of commands that can generate this error include:

Create
* `az ml job create`
* `az ml data create`
* `az ml datastore create`
* `az ml compute create`
* `az ml batch-endpoint create`
* `az ml batch-deployment create`
* `az ml online-endpoint create`
* `az ml online-deployment create`
* `az ml online-deployment create`
* `az ml component create`
* `az ml environment create`
* `az ml model create`
* `az ml connection create`
* `az ml schedule create`
* `az ml registry create`
* `az ml workspace create`

Update
* `az ml online-endpoint update`
* `az online-deployment update`
* `az batch-deployment update`
* `az datastore update`
* `az compute update`
* `az data update`

## Symptoms

When the user submits a YAML file via a **create** or **update** command using Azure Machine Learning v2 CLI to complete a particular task (for example, create a data asset, submit a training job, or update an online deployment), they can encounter a “Validation for Schema Failed” error. 

## Cause

“Validation for Schema Failed” errors occur because the submitted YAML file didn't match the prescribed schema for the asset type (workspace, data, datastore, component, compute, environment, model, job, batch-endpoint, batch-deployment, online-endpoint, online-deployment, schedule, connection, or registry) that the user was trying to create or update. This might happen due to several causes. 

*The general procedure for fixing this error is to first go to the location where the YAML file is stored, open it and make the necessary edits, save the YAML file, then go back to the terminal and resubmit the command. The sections below will detail the changes necessary based on the cause.*

## Error - Invalid Value

The submitted YAML file contains one or more parameters whose value is of the incorrect type. For example – for ml data create (that is, data schema), the “path” parameter expects a URL value. Providing a number or string that’s not a file path would be considered invalid. The parameter might also have a range of acceptable values, and the value provided isn't in that range. For example – for ml data create, the “type” parameter only accepts uri_file, uri_folder, or ml_table. Any other value would be considered invalid. 

### Solution - Invalid Value

If the type of value provided for a parameter is invalid, check the prescribed schema and change the value to the correct type (note: this refers to the data type of the value provided for the parameter, not to be confused with the “type” parameter in many schemas). If the value itself is invalid, select a value from the expected range of values (you'll find that in the error message). Save the YAML file and resubmit the command. [Here's a list of schemas](reference-yaml-overview.md) for all different asset types in Azure Machine Learning v2.

## Error - Unknown Field

The submitted YAML file contains one or more parameters, which isn't part of the prescribed schema for that asset type. For example – for ml job create (that is, `commandjob` schema), if a parameter called “name” is provided, this error will be encountered because the `commandjob` schema has no such parameter.

### Solution - Unknown Field

In the submitted YAML file, delete the field that is invalid. Save the YAML file and resubmit the command.

## Error - File or Folder Not Found

The submitted YAML file contains a “path” parameter. The file or folder path provided as a value for that parameter, is either incorrect (spelled wrong, missing extension, etc.), or the file / folder doesn't exist.

### Solution - File or Folder Not Found

In the submitted YAML file, go to the “path” parameter and double check whether the file / folder path provided is written correctly (that is, path is complete, no spelling mistakes, no missing file extension, special characters, etc.). Save the YAML file and resubmit the command. If the error still persists, the file / folder doesn't exist in the location provided.

## Error - Missing Field

The submitted YAML file is missing a required parameter. For example – for ml job create (that is, `commandjob` schema), if the “compute” parameter isn't provided, this error will be encountered because compute is required to run a command job.

### Solution - Missing Field

Check the prescribed schema for the asset type you're trying to create or update – check what parameters are required and what their correct value types are. [Here's a list of schemas](reference-yaml-overview.md) for different asset types in Azure Machine Learning v2. Ensure that the submitted YAML file has all the required parameters needed. Also ensure that the values provided for those parameters are of the correct type, or in the accepted range of values. Save the YAML file and resubmit the command.

## Error - Cannot Parse

The submitted YAML file can't be read, because either the syntax is wrong, formatting is wrong, or there are unwanted characters somewhere in the file. For example – a special character (like a colon or a semicolon) that has been entered by mistake somewhere in the YAML file.

### Solution - Cannot Parse

Double check the contents of the submitted YAML file for correct syntax, unwanted characters, and wrong formatting. Fix all of these, save the YAML file and resubmit the command.

## Error - Resource Not Found

One or more of the resources (for example, file / folder) in the submitted YAML file doesn't exist, or you don't have access to it.

### Solution - Resource Not Found

Double check whether the name of the resource has been specified correctly, and that you have access to it. Make changes if needed, save the YAML file and resubmit the command.

## Error - Cannot Serialize

One or more fields in the YAML can't be serialized (converted) into objects.

### Solution - Cannot Serialize

Double check that your YAML file isn't corrupted and that the file’s contents are properly formatted.
