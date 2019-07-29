---
title: "Troubleshoot SSIS Integration Runtime Management in Azure Data Factory | Microsoft Docs"
description: "This article provides troubleshooting guidance for management issues of SSIS Integration Runtime (SSIS IR)"
services: data-factory
documentationcenter: ""
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 07/08/2019
author: chinadragon0515
ms.author: dashe
ms.reviewer: sawinark
manager: craigg
---

# Troubleshoot SSIS Integration Runtime Management in Azure Data Factory

This document provides troubleshooting guides for management issues of SSIS Integration Runtime (SSIS IR).

## Overview

There will be an error message in the ADF portal or returned from PowerShell cmdlet if there is any issue in provisioning or deprovisioning SSIS IR. The error is always in the format as an error code with a detailed error message.

It means service has some transient issues if the error code is InternalServerError. You may retry the operation later. Contact Azure Data Factory support team if retry doesn’t help.

There are three major external dependencies that may cause errors: Azure SQL Database server or Managed Instance, Custom Setup Script, and Virtual Network Configuration if the error code is not InternalServerError.

## Azure SQL Database server or managed instance issues

An Azure SQL Database server or Managed Instance is required if provisioning SSIS IR with SSIS catalog database. The Azure SQL Database server or Managed Instance should be accessible by the SSIS IR. The account of the Azure SQL Database server or Managed Instance should have the permission to create SSIS Catalog database (SSISDB). If there is any error, an error code with detail SQL exception message will be shown in the ADF portal. Follow the steps below to troubleshoot the error codes.

### AzureSqlConnectionFailure

You may see this issue when you are provisioning a new SSIS IR or during IR running.

It may be caused by following reasons if you see the error during IR provisioning, and you can get detail SqlException message in the error message.

* Network connection issue. Check the SQL Server or Managed Instance host name is accessible, and there is no firewall or NSG blocks SSIS IR to access the server.
* Login failed and SQL Authentication is used. It means the account provided can't log in to the SQL Server. Make sure the correct user account is provided.
* Login failed and AAD authentication (Managed Identity) is used. Add the Managed Identity of your factory into an AAD group, and make the Managed Identity has access permissions to your catalog database server.
* Connection timeout, it is always because of security-related configuration. It is recommended to create a new VM,  make the VM joining the same VNet of IR if IR is in a VNet, then install SSMS and check the Azure SQL Database server or Managed Instance status.

For other issues, refer to the detail SQL Exception error message and fix the issue shown in error message. Contact Azure SQL Database server or Managed Instance support team if you’re still having problems.

It’s likely there are some Network Security Group or firewall changes if you see the error during IR running, which causes the SSIS IR worker node cannot access the Azure SQL Database server or Managed Instance anymore. Unblock the SSIS IR worker node to access the Azure SQL Database server or Managed Instance.

### CatalogCapacityLimitError

The error message is like “The database 'SSISDB' has reached its size quota. Partition or delete data, drop indexes, or consult the documentation for possible resolutions.” The possible solutions are:
* Increase size quota of your SSISDB.
* Change the configurations of SSISDB to reduce the size like:
   * Reducing the retention period and number of project versions.
   * Reducing the retention period of log.
   * Changing the default level of the log and so on.

### CatalogDbBelongsToAnotherIR

This error means the Azure SQL Database server or Managed Instance already has an SSISDB created and used by another IR. You need either provide a different Azure SQL Database server or Managed Instance, or delete existing SSISDB and restart the new IR.

### CatalogDbCreationFailure

This error could be caused by below reasons,

* The user account that is configured for the SSIS IR has no permission to create the database. You can grant the user to have permission to create the database.
* Create database timeout like execution timeout, DB operation timeout and so on. You can retry later to see whether the issue is solved. Contact the Azure SQL Database server or Managed Instance support team if retry doesn’t work.

For other issues, check the SQL Exception error message and fix the issue mentioned in error message. If you’re still having problems, contact Azure SQL Database server or Managed Instance support team.

### InvalidCatalogDb

The error message is like “Invalid object name 'catalog.catalog_properties'.”, it means either you already have a database named SSISDB but it’s not created by SSIS IR, or the database is in invalid state that is caused by errors in last SSIS IR provisioning. You can drop existing database with the name SSISDB, or configure a new Azure SQL Database server or Managed Instance for the IR.

## Custom setup

Custom Setup provides an interface to add your own setup steps during the provisioning or reconfiguration of your SSIS IR. For more information, see [Customize setup for the Azure-SSIS integration runtime](https://docs.microsoft.com/azure/data-factory/how-to-configure-azure-ssis-ir-custom-setup).

Ensure your container contains only the necessary custom setup files, as all the files in the container will be downloaded onto the SSIS IR worker node. It’s recommended to test the custom setup script on a local machine to fix any script execution issues before running the script in SSIS IR.

The custom setup script container will be checked during IR running too as SSIS IR is regular updated which need to access the container again to download the custom setup script and install again. The check will include whether the container is accessible and whether the main.cmd file exists.

Any error with custom setup, you will see an error with code CustomSetupScriptFailure, check the error message that has a sub error code.  Follow the steps below to troubleshoot the sub error codes.  

### CustomSetupScriptBlobContainerInaccessible

It means SSIS IR cannot access your Azure blob container for custom setup. Check the SAS URI of the container is reachable and not expired.

Stop the IR first if the IR is in running state, reconfigure the IR with new custom setup container SAS URI and then start the IR again.

### CustomSetupScriptNotFound

It means SSIS IR cannot find custom setup script (main.cmd) in your blob container. Make sure main.cmd exists in the container, which is the entry point for custom setup installation.

### CustomSetupScriptExecutionFailure

It means the execution of custom setup script (main.cmd) failed, you can try the script on your local machine first or check custom setup execution logs in your blob container.

### CustomSetupScriptTimeout

It means execute custom setup script timeout. Ensure that your blob container contains only the necessary custom setup files. You can also check custom setup execution logs in your blob container. The maximum period for custom setup is set at 45 minutes before it times out and the maximum period includes the time to download all files from your container and install them on SSIS IR. If a longer period is needed, raise a support ticket.

### CustomSetupScriptLogUploadFailure

It means uploading custom setup execution logs to your blob container failed, it is either because of SSIS IR has no write permission to your blob container, or some storage or network issues. If custom setup is successful, this error does not impact any SSIS function, but logs are missing. If custom setup failed with other error, and we fail to upload log, we will report this error first so log can be uploaded for analysis and after this issue is resolved, we will report more specified issue. If this issue is not solved after retry, contact Azure Data Factory support team.

## Virtual network configuration

When joining SSIS IR into a Virtual Network (VNet), it uses the VNet under user subscription. For more information, see [Join an Azure-SSIS integration runtime to a virtual network](https://docs.microsoft.com/azure/data-factory/join-azure-ssis-integration-runtime-virtual-network).

When there is VNet related issue, you will see error as below

### InvalidVnetConfiguration

It could be caused by variant reasons. Follow the steps below to troubleshoot the sub error codes.

### Forbidden

The error message is like “subnetId is not enabled for current account. Microsoft.Batch resource provider is not registered under the same subscription of VNet.”

It means Azure Batch cannot access your VNet. Register Microsoft.Batch resource provider under the same subscription of VNet.

### InvalidPropertyValue

The error message is like “Either the specified VNet does not exist, or the Batch service does not have access to it” or “The specified subnet xxx does not exist”.

It means the VNet does not exist or Azure Batch service cannot access it, or the subnet provided does not exist. Make sure the VNet and subnet exist and Azure Batch can access them.

### MisconfiguredDnsServerOrNsgSettings

The message is like “Failed to provision Integration Runtime in Vnet. If the DNS server or NSG settings are configured, make sure the DNS server is accessible and NSG is configured properly”

It’s likely you have some customized configuration of DNS server or NSG settings, which cause Azure Server name required by SSIS IR cannot be resolved or cannot be accessed. For more information, see [SSIS IR VNet configuration](https://docs.microsoft.com/azure/data-factory/join-azure-ssis-integration-runtime-virtual-network) document. If you’re still having problems, contact Azure Data Factory support team.

### VNetResourceGroupLockedDuringUpgrade

SSIS IR will be automatically updated in a regular basis, and a new Azure Batch pool is created during upgrade and old Azure Batch pool will be deleted, VNet related resource for old pool will be deleted, and new VNet related resource will be created under your subscription. This error means deleting VNet related resource for old pool failed because of delete lock at subscription or resource group level. Help to remove the delete lock.

### VNetResourceGroupLockedDuringStart

SSIS IR provisioning could be fail because of kinds of reason, and if a failure happens, all the resources created will be deleted. However, VNet resources are failed to be deleted because of there is resource delete lock at subscription or resource group level. Remove the delete lock and restart the IR.

### VNetResourceGroupLockedDuringStop

When stopping SSIS IR, all the resource related to VNet will be deleted, but the deletion failed because of there is resource delete lock at subscription or resource group level. Help to remove the delete lock and try the stop again.

### NodeUnavailable

This error occurs during IR running, it means IR is health before and become unhealthy, it is always because of the DNS Server or NSG configuration changed and cause SSIS IR cannot connect to depended service, help to fix the DNS Server or NSG configuration issues, For more information, see [SSIS IR VNet configuration](https://docs.microsoft.com/azure/data-factory/join-azure-ssis-integration-runtime-virtual-network). If you’re still having problems, contact Azure Data Factory support team.
