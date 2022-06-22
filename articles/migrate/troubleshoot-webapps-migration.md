---
title: Troubleshoot web apps migration issues
description: Troubleshoot web apps migration issues
author: vineetvikram
ms.author: vivikram
ms.date: 6/22/2022
ms.topic: troubleshooting
---

# Troubleshooting web apps migration issues

This article describes some common issues and specific errors you might encounter when trying to migrate web apps using Azure Migrate.

|Error code|Troubleshooting steps|
|-----------|-------------|
|AccessDenied ("Access denied.")|Check error details. This may be due to a change since last web app discovery. Confirm that web app discovery is still successful and/or troubleshoot web app discovery access issues first.|
|AppContentAlreadyExists ("Application content appContent.zip already present on storage before content copy.")|Retry the migration using a new storage account. Please contact support if this occurs persistently.|
|AppZipUploadFailed ("Error uploading application content to storage account")|Please retry in case of a transient issue, and confirm connectivity between the appliance and the Azure storage account specified for the migration.|
|CopyAppContentToApplianceFailure ("Error occurred copying content from IIS web server to appliance.")|Check error details for more information. Confirm connectivity between appliance and web server such as by looking for recently successful web app discovery.|
|IISWebAppExceededMaxContentSize ("Content size exceeded max content size (2 GB) for migration using this tool.")|The deployment method used only supports content up to 2 GB in size. If uncompressed content is larger than 2 GB migration will not be attempted with this error. This should be flagged in the web app assessment, and may indicate file content size changes since last web app discovery was completed.|
|IISWebAppFailureCompressingSiteContent ("Exception occurred compressing site content")|Please check error details for more information. This could be related to physical file permissions, including if access is blocked for the Administrator account used for web app discovery and migration on the site content.|
|IISWebAppMigrationError ("Error occurred during app content copy operation")|Please check the error message for additional details.|
|IISWebAppNotFoundOnServer ("Web application matching site name not found on web server")|This may be due to changes on the web server since last web app discovery was completed, such as site delete or rename operations. Please confirm that web app discovery was completed recently and that site still exists on the web server.|
|IISWebAppUNCContentDirectory ("Web app contains only UNC directory content. UNC directories are not currently supported for migration.")| Migration is not currently supported for content on UNC shares. This error will occur if all site content is on UNC shares, if there are non-UNC share content directories those will be migrated.|
|IISWebServerAccessFailedError ("Unable to access the IIS configuration")|This can be caused by insufficient access to IIS configuration and management API locations. Web app migration uses the same identity and connection mechanism as web app discovery. Check if settings have changed since last successful web app discovery and that discovery is still successful for this web server.|
|IISWebServerIISNotFoundError ("IIS Management Console feature is not enabled")|This error indicates that the IIS Management Console feature is not enabled on the web server, and is likely a change to the web server since last successful web app discovery was completed. Ensure that the Web Server (IIS) role including the IIS Management Console feature (part of Management Tools) are enabled and that web app discovery is able to discover web apps for the target web server.|
|IISWebServerInvalidSiteConfig ("Invalid IIS configuration encountered, the site has no root application defined.")|This indicates that there was invalid site configuration for one or more sites on the IIS server. Add a root "/" application for all web sites on the IIS server, or remove the associated (non-functional) sites.|
|IISWebServerPowerShellError ("Error occurred during PowerShell operation")|Check the error message for more details. Remote PowerShell is used to package the site content from the web server without requiring install of any products or machine changes on the web server.|  
|IISWebServerPowerShellVersionLessThan4 ("PowerShell version on IIS web server was less than minimum required PowerShell version 4")|Migration is only supported for IIS web servers with PowerShell V4 or later versions. Update the web server with PowerShell v4 to enable this migration.|
|IISWebServerUnableToConnect ("Unable to connect to the server.")| Check error details. This may be due to a change since last successful web app discovery. Confirm that web app discovery is still successful and/or troubleshoot web app discovery access issues first.|
|IISWebServerZeroWebAppsFound|("No web apps were found on the target IIS server.")|The may indicate that the web server was modified after the last web app discovery was completed. Please confirm that web app discovery was recently completed and that web apps were not removed from the web server.|
|NullResult ("PowerShell script returned no results.")|Remote PowerShell is used to package the site content from the web server without requiring install of any products or persistent files on the server. This error may indicate the MaxMemoryPerShell value on the IIS server is too low, or has been changed since web app discovery was completed. Try increasing the the MaxMemoryPerShell value on the IIS server using a command like:  Set-Item WSMan:\localhost\Shell\MaxMemoryPerShellMB 4096|
|ResultFileContentJSONParseError (Results in unexpected format)|Please contact support if you are seeing this error.|
|ScriptExecutionTimedOutOnVm ("Operation timed out.")|This may indicate a change on the server since last web app discovery. Please check if web app discovery is still running and successful.|
|StorageAuthenticationFailed ("Failed to authenticate with Azure Storage container.")|Please check the error details for more information.|
|StorageBlobAlreadyExists ("App content blob already present before upload of app content.")|Please try the migration again using a new storage account.|
|StorageGenericError ("Azure Storage related error")|The ARM deployment step will complete only when the content (appContent.zip) or an error file (error.json) appear in the site’s storage container – if the NuGet is unable to upload the error.json file in error cases, the ARM deployment will continue until it times out, waiting for the content. This may indicate an issue with connectivity between the appliance and the specified storage account being used by migration.|  
|UnableToConnectToPhysicalServer ("Connecting to the remote server failed.")|Check error details. This may be due to a change since last web app discovery. Check for web app discovery errors and troubleshoot web app discovery connection issues first.|
|UnableToConnectToServer ("Connecting to the remote server failed.")| Check error details. This may be due to a change since last web app discovery. Check for web app discovery errors and troubleshoot web app discovery connection issues first.|

## Next steps

* Continue to [perform at-scale agentless migration of ASP.NET web apps to Azure App Service](./tutorials-migrate-webapps.md).
