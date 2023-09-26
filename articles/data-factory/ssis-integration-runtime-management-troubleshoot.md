---
title: Troubleshoot SSIS Integration Runtime management
description: "This article provides troubleshooting guidance for management issues of SSIS Integration Runtime (SSIS IR)"
ms.service: data-factory
ms.subservice: integration-services
ms.topic: conceptual
author: chinadragon0515
ms.author: dashe
ms.reviewer: chugugrace
ms.custom: seo-lt-2019
ms.date: 08/10/2023
---

# Troubleshoot SSIS Integration Runtime management

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides troubleshooting guidance for management issues in Azure-SQL Server Integration Services (SSIS) Integration Runtime (IR), also known as SSIS IR.

## Overview

If you run into any issue while provisioning or deprovisioning SSIS IR, you'll see an error message in the Microsoft Azure Data Factory portal or an error returned from a PowerShell cmdlet. The error always appears in the format of an error code with a detailed error message.

If the error code is InternalServerError, the service has transient issues, and you should retry the operation later. If a retry doesn’t help, contact the Azure Data Factory support team.

Otherwise, three major external dependencies can cause errors: Azure SQL Database or Azure SQL Managed Instance, a custom setup script, and a virtual network configuration.

## SQL Database or SQL Managed Instance issues

SQL Database or SQL Managed Instance is required if you're provisioning SSIS IR with an SSIS catalog database. The SSIS IR must be able to access SQL Database or SQL Managed Instance. Also, the login account for SQL Database or SQL Managed Instance must have permission to create an SSIS catalog database (SSISDB). If there's an error, an error code with a detailed SQL exception message will be shown in the Data Factory portal. Use the information in the following list to troubleshoot the error codes.

### AzureSqlConnectionFailure

You might see this issue when you're provisioning a new SSIS IR or while IR is running. If you experience this error during IR provisioning, you might get a detailed SqlException message in the error message that indicates one of the following problems:

* A network connection issue. Check whether the host name for SQL Database or SQL Managed Instance  is accessible. Also verify that no firewall or network security group (NSG) is blocking SSIS IR access to the server.
* Login failed during SQL authentication. The account provided can't sign in to the SQL Server database. Make sure you provide the correct user account.
* Login failed during Microsoft Azure Active Directory (Azure AD)
 authentication (managed identity). Add the managed identity of your factory to an AAD group, and make sure the managed identity has access permissions to your catalog database server.
* Connection timeout. This error is always caused by a security-related configuration. We recommend that you:
  1. Create a new VM.
  1. Join the VM to the same Microsoft Azure Virtual Network of IR if IR is in a virtual network.
  1. Install SSMS and check the SQL Database or SQL Managed Instance status.

For other problems, fix the issue shown in the detailed SQL Exception error message. If you’re still having problems, contact the SQL Database or SQL Managed Instance support team.

If you see the error when IR is running, network security group or firewall changes are likely preventing the SSIS IR worker node from accessing SQL Database or SQL Managed Instance. Unblock the SSIS IR worker node so that it can access SQL Database or SQL Managed Instance.

### CatalogCapacityLimitError

Here's what this kind of error message might look like: “The database 'SSISDB' has reached its size quota. Partition or delete data, drop indexes, or consult the documentation for possible resolutions.” 

The possible solutions are:
* Increase the quota size of your SSISDB.
* Change the configuration of SSISDB to reduce the size by:
   * Reducing the retention period and number of project versions.
   * Reducing the retention period of the log.
   * Changing the default level of the log.

### CatalogDbBelongsToAnotherIR

This error means SQL Database or SQL Managed Instance already has an SSISDB and that it's being used by another IR. You need to either provide a different SQL Database or SQL Managed Instance or else delete the existing SSISDB and restart the new IR.

### CatalogDbCreationFailure

This error can occur for one of the following reasons:

* The user account that's configured for the SSIS IR doesn't have permission to create the database. You can grant the user permission to create the database.
* A timeout occurs during database creation, such as an execution timeout or a DB operation timeout. You should retry the operation later. If the retry doesn’t work, contact the SQL Database or SQL Managed Instance support team.

For other issues, check the SQL Exception error message and fix the issue mentioned in the error details. If you’re still having problems, contact the SQL Database or SQL Managed Instance support team.

### InvalidCatalogDb

This kind of error message looks like this: “Invalid object name 'catalog.catalog_properties'.” In this situation, either you already have a database named SSISDB but it wasn't created by SSIS IR, or the database is in an invalid state that's caused by errors in the last SSIS IR provisioning. You can drop the existing database with the name SSISDB, or you can configure a new SQL Database or SQL Managed Instance for the IR.

## Custom setup issues

Custom setup provides an interface to add your own setup steps during the provisioning or reconfiguration of your SSIS IR. For more information, see [Customize setup for the Azure-SSIS Integration Runtime](./how-to-configure-azure-ssis-ir-custom-setup.md).

Make sure your container contains only the necessary custom setup files; all the files in the container will be downloaded onto the SSIS IR worker node. We recommend that you test the custom setup script on a local machine to fix any script execution issues before you run the script in SSIS IR.

The custom setup script container will be checked while IR is running, because SSIS IR is regularly updated. This updating requires access to the container to download the custom setup script and install it again. The process also checks whether the container is accessible and whether the main.cmd file exists.

For any error that involves custom setup, you'll see a CustomSetupScriptFailure error code with sub code like CustomSetupScriptBlobContainerInaccessible or CustomSetupScriptNotFound.

### CustomSetupScriptBlobContainerInaccessible

This error means that SSIS IR can't access your Azure blob container for custom setup. Make sure the SAS URI of the container is reachable and has not expired.

Stop the IR if it's running, reconfigure the IR with new custom setup container SAS URI, and then restart the IR.

### CustomSetupScriptNotFound

This error means that SSIS IR can't find a custom setup script (main.cmd) in your blob container. Make sure that main.cmd exists in the container, which is the entry point for custom setup installation.

### CustomSetupScriptExecutionFailure

This error means the execution of custom setup script (main.cmd) failed. Try the script on your local machine first, or check the custom setup execution logs on your blob container.

### CustomSetupScriptTimeout

This error indicates an execute custom setup script timeout. Make sure that your script can be executed silently, and no interactive input needed, and make sure your blob container contains only the necessary custom setup files. It is recommended to test the script on local machine first. You should also check the custom setup execution logs in your blob container. The maximum period for custom setup is 45 minutes before it times out, and the maximum period includes the time to download all files from your container and install them on SSIS IR. If you need a longer period, raise a support ticket.

### CustomSetupScriptLogUploadFailure

This error means that the attempt to upload custom setup execution logs to your blob container failed. This problem occurs either because SSIS IR doesn't have write permissions to your blob container or because of storage or network issues. If custom setup is successful, this error won't affect any SSIS function, but the logs will be missing. If custom setup fails with another error, and the log isn't uploaded, we will report this error first so that the log can be uploaded for analysis. Also, after this issue is resolved, we will report any more specific issues. If this issue is not resolved after a retry, contact the Azure Data Factory support team.

## Virtual network configuration

When you join SSIS IR to Azure Virtual Network, SSIS IR uses the virtual network that's under the user subscription. For more information, see [Join an Azure-SSIS Integration Runtime to a virtual network](./join-azure-ssis-integration-runtime-virtual-network.md).
After SSIS IR starts successfully, if you encounter network connection problems, you can try to use [diagnose connectivity tool](ssis-integration-runtime-diagnose-connectivity-faq.md) to diagnose the problem yourself.
When there's a Virtual Network-related issue, you'll see one of the following errors.

### InvalidVnetConfiguration

This error can occur for a variety of reasons. To troubleshoot it, see the [Forbidden](#forbidden), [InvalidPropertyValue](#invalidpropertyvalue), and [MisconfiguredDnsServerOrNsgSettings](#misconfigureddnsserverornsgsettings) sections.

### Forbidden

This kind of error might resemble this: “SubnetId is not enabled for current account. Microsoft.Batch resource provider is not registered under the same subscription of VNet.”

These details mean that Azure Batch can't access your virtual network. Register the Microsoft.Batch resource provider under the same subscription as Virtual Network.

### InvalidPropertyValue

This kind of error might resemble one of the following: 

- “Either the specified VNet does not exist, or the Batch service does not have access to it.”
- “The specified subnet xxx does not exist.”

These errors mean the virtual network doesn't exist, the Azure Batch service can't access it, or the subnet provided doesn't exist. Make sure the virtual network and subnet exist and that Azure Batch can access them.

### MisconfiguredDnsServerOrNsgSettings

This kind of error message can look like this: “Failed to provision Integration Runtime in VNet. If the DNS server or NSG settings are configured, make sure the DNS server is accessible and NSG is configured properly.”

In this situation, you probably have a customized configuration of DNS server or NSG settings, which prevents the Azure server name required by SSIS IR from being resolved or accessed. For more information, see [SSIS IR Virtual Network configuration](./join-azure-ssis-integration-runtime-virtual-network.md). If you’re still having problems, contact the Azure Data Factory support team.

### VNetResourceGroupLockedDuringUpgrade

SSIS IR will be automatically updated on a regular basis. A new Azure Batch pool is created during upgrade and the old Azure Batch pool is deleted. Also, Virtual Network-related resources for the old pool are deleted, and the new Virtual Network-related resources are created under your subscription. This error means that deleting Virtual Network-related resources for the old pool failed because of a delete lock at the subscription or resource group level. Because the customer controls and sets the delete lock, they must remove the delete lock in this situation.

### VNetResourceGroupLockedDuringStart

If SSIS IR provisioning fails, all the resources that were created are deleted. However, if there's a resource delete lock at the subscription or resource group level, Virtual Network resources are not deleted as expected. To fix this error, remove the delete lock and restart the IR.

### VNetResourceGroupLockedDuringStop/VNetDeleteLock

When you stop SSIS IR, all the resources related to Virtual Network are deleted. But deletion can fail if there's a resource delete lock at the subscription or resource group level. Here, too, the customer controls and sets the delete lock. Therefore, they must remove the delete lock and then stop SSIS IR again.

### NodeUnavailable

This error occurs when IR is running, and it means that IR has become unhealthy. This error is always caused by a change in the DNS server or NSG configuration that blocks SSIS IR from connecting to a necessary service. Because configuration of DNS server and NSG is controlled by the customer, the customer must fix the blocking issues on their end. For more information, see [SSIS IR Virtual Network configuration](./join-azure-ssis-integration-runtime-virtual-network.md). If you’re still having problems, contact the Azure Data Factory support team.

## Static public IP addresses configuration

When you join the Azure-SSIS IR to Azure Virtual Network, you are also able to bring your own static public IP addresses for the IR so that the IR can access data sources which limit access to specific IP addresses. For more information, see [Join an Azure-SSIS Integration Runtime to a virtual network](./join-azure-ssis-integration-runtime-virtual-network.md).

Besides the above virtual network issues, you may also meet static public IP addresses-related issue. Please check the following errors for help.

### <a name="InvalidPublicIPSpecified"></a>InvalidPublicIPSpecified

This error can occur for a variety of reasons when you start the Azure-SSIS IR:

| Error message | Solution|
|:--- |:--- |
| The provided static public IP address is already used, please provide two unused ones for your Azure-SSIS Integration Runtime. | You should select two unused static public IP addresses or remove current references to the specified public IP address, and then restart the Azure-SSIS IR. |
| The provided static public IP address has no DNS name, please provide two of them with DNS name for your Azure-SSIS Integration Runtime. | You can setup the DNS name of the public IP address in Azure portal, as the picture below shows. Specific steps are as follows: (1) Open Azure portal and goto the resource page of this public IP address; (2) Select the **Configuration** section and set up the DNS name, then click **Save** button; (3) Restart your Azure-SSIS IR. |
| The provided VNet and static public IP addresses for your Azure-SSIS Integration Runtime must be in the same location. | According to the Azure Network's requirements, the static public IP address and the virtual network should be in the same location and subscription. Please provide two valid static public IP addresses and restart the Azure-SSIS IR. |
| The provided static public IP address is a basic one, please provide two standard ones for your Azure-SSIS Integration Runtime. | Refer to [SKUs of Public IP Address](../virtual-network/ip-services/public-ip-addresses.md#sku) for help. |

:::image type="content" source="media/ssis-integration-runtime-management-troubleshoot/setup-publicipdns-name.png" alt-text="Azure-SSIS IR":::

### PublicIPResourceGroupLockedDuringStart

If Azure-SSIS IR provisioning fails, all the resources that were created are deleted. However, if there's a resource delete lock at the subscription or resource group (which contains your static public IP address) level, the network resources are not deleted as expected. To fix the error, please remove the delete lock and restart the IR.

### PublicIPResourceGroupLockedDuringStop

When you stop Azure-SSIS IR, all the network resources created in the resource group containing your public IP address will be deleted. But deletion can fail if there's a resource delete lock at the subscription or resource group (which contains your static public IP address) level. Remove the delete lock and restart the IR.

### PublicIPResourceGroupLockedDuringUpgrade

Azure-SSIS IR is automatically updated on a regular basis. New IR nodes are created during upgrade and the old nodes will be deleted. Also, the created network resources (e.g., the load balancer and the network security group) for the old nodes are deleted, and the new network resources are created under your subscription. This error means that deleting the network resources for the old nodes failed due to a delete lock at the subscription or resource group (which contains your static public IP address) level. Remove the delete lock so that we can clean up the old nodes and release the static public IP address for the old nodes. Otherwise the static public IP address cannot be released and we will not be able to upgrade your IR further.

### PublicIPNotUsableDuringUpgrade

When you want to bring your own static public IP addresses, two public IP addresses should be provided. One of them will be used to create the IR nodes immediately and another one will be used during upgrade of the IR. This error can occur when the other public IP address is unusable during upgrade. Refer to  [InvalidPublicIPSpecified](#InvalidPublicIPSpecified) for possible causes.

## Resource management

### Resource tag not updated

You can apply [tags](../azure-resource-manager/management/tag-resources.md) to your Azure resources to logically organize them into a taxonomy. While the SSIS IR is running, changes to SSIS IR parent data factory tags will not take effective until SSIS IR is restarted.