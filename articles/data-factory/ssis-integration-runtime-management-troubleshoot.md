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

This article provides troubleshooting guidance for management issues in Azure-SQL Server Integration Services (SSIS) Integration Runtime (IR), also known as SSIS IR.

## Overview

If you run into any issue while provisioning or deprovisioning SSIS IR, you'll see an error message in the Azure Data Factory (ADF) portal or returned from a PowerShell cmdlet. The error always appears in the format of an error code with a detailed error message.

If the error code is InternalServerError, this means that the service has transient issues and that you should retry the operation later. If a retry doesn’t help, contact the Azure Data Factory support team.

Otherwise, there are three major external dependencies that can cause errors: an Azure SQL Database server or managed instance, a custom setup script, and a virtual network configuration (if the error code is not InternalServerError).

## Azure SQL Database server or managed instance issues

An Azure SQL Database server or managed instance is required if you're provisioning SSIS IR with an SSIS catalog database. The SSIS IR must be able to access the Azure SQL Database server or managed instance. Also, the account of the Azure SQL Database server or managed instance should have permission to create an SSIS catalog database (SSISDB). If there's an error, an error code with a detailed SQL exception message will be shown in the ADF portal. Use the information in the following list to troubleshoot the error codes.

### AzureSqlConnectionFailure

You might see this issue when you're provisioning a new SSIS IR or while IR is running. If you experience this error during IR provisioning, and if you get a detailed SqlException message in the error message, it might indicate one of the following problems:

* A network connection issue. Check whether the SQL Server or managed instance host name is accessible. Also verify that no firewall or network security group (NSG) is blocking SSIS IR access to the server.
* Login failed during SQL authentication. This means the account provided can't log in to the SQL Server database. Make sure you provide the correct user account.
* Login failed during AAD authentication (managed identity). Add the managed identity of your factory to an AAD group, and make sure the managed identity has access permissions to your catalog database server.
* Connection timeout. This is always caused by a security-related configuration. We recommend that you create a new VM; join the VM to the same VNet of IR if IR is in a VNet; and then install SSMS and check the Azure SQL Database server or managed instance status.

For other problems, fix the issue shown in the detailed SQL Exception error message. If you’re still having problems, contact the Azure SQL Database server or managed instance support team.

If you see the error when IR is running, it’s likely that network security group or firewall changes are preventing the SSIS IR worker node from accessing the Azure SQL Database server or managed instance. Unblock the SSIS IR worker node so that it can access the Azure SQL Database server or managed instance.

### CatalogCapacityLimitError

Here's what this kind of error message might look like: “The database 'SSISDB' has reached its size quota. Partition or delete data, drop indexes, or consult the documentation for possible resolutions.” 

Possible solutions:
* Increase the quota size of your SSISDB.
* Change the configuration of SSISDB to reduce the size by:
   * Reducing the retention period and number of project versions.
   * Reducing the retention period of the log.
   * Changing the default level of the log.

### CatalogDbBelongsToAnotherIR

This error means the Azure SQL Database server or managed instance already has an SSISDB and that it's being used by another IR. You need to either provide a different Azure SQL Database server or managed instance or else delete the existing SSISDB and restart the new IR.

### CatalogDbCreationFailure

This error can occur for one of the following reasons:

* The user account that's configured for the SSIS IR doesn't have permission to create the database. You can grant the user permission to create the database.
* A timeout that occurs during database creation, such as an execution timeout or a DB operation timeout. You should retry the operation later. If the retry doesn’t work, contact the Azure SQL Database server or Managed Instance support team.

For other issues, check the SQL Exception error message and fix the issue mentioned in the error details. If you’re still having problems, contact Azure SQL Database server or managed instance support team.

### InvalidCatalogDb

This kind of error message looks like this: “Invalid object name 'catalog.catalog_properties'.” In this situation, you either already have a database named SSISDB but it wasn't created by SSIS IR, or the database is in an invalid state that's caused by errors in the last SSIS IR provisioning. You can drop the existing database with the name SSISDB, or you can configure a new Azure SQL Database server or managed instance for the IR.

## Custom setup issues

Custom setup provides an interface to add your own setup steps during the provisioning or reconfiguration of your SSIS IR. For more information, see [Customize setup for the Azure-SSIS integration runtime](https://docs.microsoft.com/en-us/azure/data-factory/how-to-configure-azure-ssis-ir-custom-setup).

Make sure your container contains only the necessary custom setup files, as all the files in the container will be downloaded onto the SSIS IR worker node. We recommend that you test the custom setup script on a local machine to fix any script execution issues before you run the script in SSIS IR.

The custom setup script container will be checked while IR is running, as SSIS IR is regularly updated. This updating requires access to the container to download the custom setup script and install it again. The process also checks whether the container is accessible and whether the main.cmd file exists.

For any error that involves custom setup, you'll see a CustomSetupScriptFailure code. In this case, check whether the error message has a "sub" error code. If it does, see the "Forbidden" and "InvalidPropertyValue" sections later in this article to troubleshoot "sub" error codes.  

### CustomSetupScriptBlobContainerInaccessible

This error means that SSIS IR can't access your Azure blob container for custom setup. Make sure the SAS URI of the container is reachable and has not expired.

Stop the IR if it's running, reconfigure the IR with new custom setup container SAS URI, and then restart the IR.

### CustomSetupScriptNotFound

This error means that SSIS IR can't find a custom setup script (main.cmd) in your blob container. Make sure that main.cmd exists in the container, which is the entry point for custom setup installation.

### CustomSetupScriptExecutionFailure

This error means the execution of custom setup script (main.cmd) failed. Try the script on your local machine first, or check the custom setup execution logs on your blob container.

### CustomSetupScriptTimeout

This error indicates an execute custom setup script timeout. Make sure that your blob container contains only the necessary custom setup files. You should also the check custom setup execution logs in your blob container. The maximum period for custom setup is 45 minutes before it times out, and the maximum period includes the time to download all files from your container and install them on SSIS IR. If you need a longer period, raise a support ticket.

### CustomSetupScriptLogUploadFailure

This error means that the attempt to upload custom setup execution logs to your blob container failed. This problem occurs either because SSIS IR doesn't have write permissions to your blob container or because of storage or network issues. If custom setup is successful, this error won't affect any SSIS function, but the logs will be missing. If custom setup fails with another error, and the log isn't uploaded, we will report this error first so that the log can be uploaded for analysis. Also, after this issue is resolved, we will report any more specific issues. If this issue is not resolved after a retry, contact the Azure Data Factory support team.

## Virtual network configuration issues

When you join SSIS IR to Azure Virtual Network (VNet), SSIS IR uses the VNet that's under the user subscription. For more information, see [Join an Azure-SSIS integration runtime to a virtual network](https://docs.microsoft.com/azure/data-factory/join-azure-ssis-integration-runtime-virtual-network).

When there's a VNet-related issue, you'll see one of the following errors:

### InvalidVnetConfiguration

This error can occur for a variety of reasons. To troubleshoot it, see the "Forbidden" and "InvalidPropertyValue" sections.

### Forbidden

This kind of error might resemble this: “SubnetId is not enabled for current account. Microsoft.Batch resource provider is not registered under the same subscription of VNet.”

These details mean that Azure Batch can't access your VNet. Register Microsoft.Batch resource provider under the same subscription as VNet.

### InvalidPropertyValue

This kind of error might resemble one of the following: 

- “Either the specified VNet does not exist, or the Batch service does not have access to it.”
- “The specified subnet xxx does not exist.”

These errors mean the VNet doesn't exist, the Azure Batch service can't access it, or the subnet provided doesn't exist. Make sure the VNet and subnet exist and that Azure Batch can access them.

### MisconfiguredDnsServerOrNsgSettings

This kind of error message can look like this: “Failed to provision Integration Runtime in Vnet. If the DNS server or NSG settings are configured, make sure the DNS server is accessible and NSG is configured properly.”

In this situation, you probably have a customized configuration of DNS server or NSG settings, which prevents the Azure Server name required by SSIS IR from being resolved or accessed. For more information, see [SSIS IR VNet configuration](https://docs.microsoft.com/azure/data-factory/join-azure-ssis-integration-runtime-virtual-network). If you’re still having problems, contact the Azure Data Factory support team.

### VNetResourceGroupLockedDuringUpgrade

SSIS IR will be automatically updated on a regular basis. A new Azure Batch pool is created during upgrade and the old Azure Batch pool is deleted. Also, VNet-related resources for the old pool are deleted, and the new VNet-related resources are created under your subscription. This error means that deleting VNet-related resources for the old pool failed because of a delete lock at the subscription or resource group level. Contact Help to remove the delete lock.

### VNetResourceGroupLockedDuringStart

If SSIS IR provisioning fails, all the resources that were created are deleted. However, if there's a resource delete lock at the subscription or resource group level, VNet resources are not deleted as expected. To fix this error, remove the delete lock and restart the IR.

### VNetResourceGroupLockedDuringStop

When you stop SSIS IR, all the resources related to VNet are deleted. But deletion can fail if there's a resource delete lock at the subscription or resource group level. Contact Help to remove the delete lock, and then stop SSIS IR again.

### NodeUnavailable

This error occurs when IR is running, and it means that IR has become unhealthy. This error is always caused by a change in the DNS server or NSG configuration that blocks SSIS IR from connecting to a necessary service. Contact Help to fix the DNS server or NSG configuration issues. For more information, see [SSIS IR VNet configuration](https://docs.microsoft.com/azure/data-factory/join-azure-ssis-integration-runtime-virtual-network). If you’re still having problems, contact the Azure Data Factory support team.
