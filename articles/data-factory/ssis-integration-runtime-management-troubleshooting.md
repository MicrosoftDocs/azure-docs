---
title: "SSIS Integration Runtime Management Troubleshooting | Microsoft Docs"
description: "This article provides troubleshooting guidance for management issues of SSIS Integration Runtime (SSIS IR)"
services: data-factory
documentationcenter: ""
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 07/8/2019
author: chinadragon0515
ms.author: dashe
ms.reviewer: sawinark
manager: craigg
---

#SSIS Integration Runtime Management Troubleshooting

This document provides troubleshooting guides for management issues of SSIS Integration Runtime (SSIS IR).

##Overview

If there is any issue in provisioning or deprovisioning SSIS IR, there will be an error message in the ADF portal or returned from PowerShell cmdlet. The error is always in the format as an error code with a detailed error message.

If the error code is InternalServerError, it means service has some transient issues. You may retry the operation later. If retry doesn’t help, please contact Azure Data Factory support team.

If the error code is not InternalServerError, there are three major external dependencies which may cause errors: Azure SQL Database server/Managed Instance, Custom Setup Script and Virtual Network Configuration.

##Azure SQL Database server or Managed Instance issues

If provisioning SSIS IR with SSIS catalog database, an Azure SQL Database server/Managed Instance is required. The Azure SQL Database server/Managed Instance should be accessible by the SSIS IR. The account of the Azure SQL Database server/Managed Instance should have the permission to create SSIS Catalog database (SSISDB). If there is any error, an error code with detail SQL exception message will be shown in the ADF portal. Follow the steps below to troubleshoot the error codes.

###AzureSqlConnectionFailure

You may see this issue when you are provisioning a new SSIS IR or during IR running.

If you see the error during IR provisioning, it may be caused by following reasons, and you can get detail SqlException message in the error message.

1. You may see this issue when you are provisioning a new SSIS IR or during IR running,
If you see the error during IR provisioning, it may be caused by following reasons, and you can get detail SqlException message in the error message.
2. Login failed and SQL Authentication is used. It means the account provide cannot login the SQL Server, make sure the correct user account is provided.
3. Login failed and AAD authentication (Managed Identity) is used. Please add the Managed Identity of your factory into an AAD group with access permissions to your catalog database server.
4. Connection timeout, it is always due to security related configuration. It is recommended to create a VM  (make the VM join the same VNet of IR if IR is in a VNet), install SSMS and check the Azure SQL Database server/Managed Instance status.

For other issues, refer to the detail SQL Exception error message and fix the issue shown in error message, if you’re still having problems, contact Azure SQL Database server/Managed Instance support team.

If you see the error during IR running, it’s likely there are some Network Security Group or firewall changes which causes the SSIS IR worker node cannot access the Azure SQL Database server/Managed Instance anymore. Please unblock the SSIS IR worker node to access the Azure SQL Database server/Managed Instance.

###CatalogCapacityLimitError

The error message is like “The database 'SSISDB' has reached its size quota. Partition or delete data, drop indexes, or consult the documentation for possible resolutions.” Please increase size quota of your SSISDB or change the configurations of SSISDB to reduce the size like reducing the retention period and number of project versions, reducing the retention period of log, changing the default level of the log, etc.

###CatalogDbBelongsToAnotherIR

This means the Azure SQL Database server/Managed Instance already has a SSISDB created and used by another IR. You need either provide a different Azure SQL Database server/Managed Instance or delete existing SSISDB and restart the new IR.

###CatalogDbCreationFailure

This could be caused by below reasons,

1. The user account which is configured for the SSIS IR has no permission to create the database. You can grant the user to have permission to create the database.
2. Create database timeout like execution timeout, DB operation timeout, etc. You can retry later to see whether the issue is solved. If retry doesn’t work, contact the Azure SQL Database server/Managed Instance support team.

For other issues, check the SQL Exception error message and fix the issue mentioned in error message. If you’re still having problems, contact Azure SQL Database server/Managed Instance support team.

###InvalidCatalogDb

The error message is like “Invalid object name 'catalog.catalog_properties'.”, it means either you already have a database named SSISDB but it’s not created by SSIS IR, or the database is in invalid state that is caused by errors in last SSIS IR provisioning. You can drop existing database with the name SSISDB, or configure a new Azure SQL Database server/Managed Instance for the IR.

##Custom Setup

Custom Setup provides an interface to add your own setup steps during the provisioning or reconfiguration of your SSIS IR. For more information, see [Customize setup for the Azure-SSIS integration runtime](https://docs.microsoft.com/en-us/azure/data-factory/how-to-configure-azure-ssis-ir-custom-setup).

Please ensure that your container contains only the necessary custom setup files, as all the files in the container will be downloaded onto the SSIS IR worker node. It’s recommended to test the custom setup script on a local machine to fix any script execution issues before running the script in SSIS IR.

The custom setup script container will be checked during IR running too as SSIS IR is regular updated which need to access the container again to download the custom setup script and install again. The check will include whether the container is accessible and whether the main.cmd file exists.

Any error with custom setup, you will see an error with code CustomSetupScriptFailure, check the error message which has a sub error code.  Follow the steps below to troubleshoot the sub error codes.  

###CustomSetupScriptBlobContainerInaccessible

It means SSIS IR cannot access your Azure blob container for custom setup. Please check the SAS URI of the container is reachable and not expired.

If the IR is in running state, you need to stop the IR first, reconfigure the IR with new custom setup container SAS URI and then start the IR again.

###CustomSetupScriptNotFound

It means SSIS IR cannot find custom setup script (main.cmd) in your blob container. Please make sure main.cmd exists in the container which is the entry point for custom setup installation.

###CustomSetupScriptExecutionFailure

It means the execution of custom setup script (main.cmd) failed, you can try the script on your local machine first or check custom setup execution logs in your blob container.

###CustomSetupScriptTimeout

It means execute custom setup script timeout. Please ensure that your blob container contains only the necessary custom setup files. You can also check custom setup execution logs in your blob container. The maximum period for custom setup is currently set at 45 minutes before it times out and this includes the time to download all files from your container and install them on SSIS IR. If a longer period is needed, please raise a support ticket.

###CustomSetupScriptLogUploadFailure

It means uploading custom setup execution logs to your blob container failed, it is either due to SSIS IR has no write permission to your blob container or some storage/network issues. If custom setup is successful, this does not impact any SSIS function, but logs are missing. If custom setup failed with other error, and we fail to upload log, we will report this error first so log can be uploaded for analysis and after this issue is resolved, we will report more specified issue. If this is not solved after retry, contact Azure Data Factory support team.

##Virtual Network Configuration

When joining SSIS IR into a Virtual Network (VNet), it uses the VNet under user subscription. For more information, see [Join an Azure-SSIS integration runtime to a virtual network](https://docs.microsoft.com/azure/data-factory/join-azure-ssis-integration-runtime-virtual-network).

When there is VNet related issue, you will see error as below

###InvalidVnetConfiguration

It could be caused by variant reasons. Follow the steps below to troubleshoot the sub error codes.

###Forbidden

The error message is like “subnetId is not enabled for current account. Microsoft.Batch resource provider is not registered under the same subscription of VNet.”

It means Azure Batch cannot access your VNet. Register Microsoft.Batch resource provider under the same subscription of VNet.

###InvalidPropertyValue

The error message is like “Either the specified VNet does not exist, or the Batch service does not have access to it” or “The specified subnet xxx does not exist”.

It means the VNet does not exist or Azure Batch service cannot access it, or the subnet provided does not exist. Make sure the VNet and subnet exist and Azure Batch can access them.

###MisconfiguredDnsServerOrNsgSettings

The message is like “Failed to provision Integration Runtime in Vnet. If you have configured the DNS server or NSG settings, please make sure the DNS server is accessible and NSG is configured properly”

It’s very likely you have some customized configuration of DNS server or NSG settings which cause Azure Server name required by SSIS IR cannot be resolved or cannot be accessed. For more information, see [SSIS IR VNet configuration](https://docs.microsoft.com/azure/data-factory/join-azure-ssis-integration-runtime-virtual-network) document. If you’re still having problems, contact Azure Data Factory support team.

###VNetResourceGroupLockedDuringUpgrade

SSIS IR will be automatically updated in a regular basis, and a new Azure Batch pool is created during upgrade and old Azure Batch pool will be deleted, VNet related resource for old pool will be deleted and new VNet related resource will be created under your subscription. This error means deleting VNet related resource for old pool failed due to delete lock at subscription or resource group level. Please help to remove the delete lock.

###VNetResourceGroupLockedDuringStart

SSIS IR provisioning could be fail due to kinds of reason, and if a failure happens, all the resources created will be deleted. However, VNet resource are failed to be deleted due to there is resource delete lock at subscription or resource group level. Please remove the delete lock and restart the IR.

###VNetResourceGroupLockedDuringStop

When stopping SSIS IR, all the resource related to VNet will be deleted, but the deletion failed due to there is resource delete lock at subscription or resource group level. Please help to remove the delete lock and try the stop again.

###NodeUnavailable

This error occurs during IR running, it means IR is health before and become unhealthy, it is always due to the DNS Server or NSG configuration changed and cause SSIS IR cannot connect to depended service, please help to fix the DNS Server or NSG configuration issues, For more information, see [SSIS IR VNet configuration](https://docs.microsoft.com/azure/data-factory/join-azure-ssis-integration-runtime-virtual-network). If you’re still having problems, contact Azure Data Factory support team.
