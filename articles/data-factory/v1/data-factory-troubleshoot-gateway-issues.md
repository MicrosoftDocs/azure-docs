---
title: Troubleshoot Data Management Gateway issues 
description: Provides tips to troubleshoot issues related to Data Management Gateway.
author: nabhishek
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: abnarain
robots: noindex
---
# Troubleshoot issues with using Data Management Gateway
This article provides information on troubleshooting issues with using Data Management Gateway.

> [!NOTE]
> This article applies to version 1 of Azure Data Factory. If you are using the current version of the Data Factory service, see [self-hosted integration runtime in Data Factory](../create-self-hosted-integration-runtime.md).

See the [Data Management Gateway](data-factory-data-management-gateway.md) article for detailed information about the gateway. See the [Move data between on-premises and cloud](data-factory-move-data-between-onprem-and-cloud.md) article for a walkthrough of moving data from a SQL Server database to Microsoft Azure Blob storage by using the gateway.

## Failed to install or register gateway
### 1. Problem
You see this error message when installing and registering a gateway, specifically, while downloading the gateway installation file.

`Unable to connect to the remote server". Please check your local settings (Error Code: 10003).`

#### Cause
The machine on which you are trying to install the gateway has failed to download the latest gateway installation file from the download center due to a network issue.

#### Resolution
Check your firewall proxy server settings to see whether the settings block the network connection from the computer to the [download center](https://download.microsoft.com/), and update the settings accordingly.

Alternatively, you can download the installation file for the latest gateway from the [download center](https://www.microsoft.com/download/details.aspx?id=39717) on other machines that can access the download center. You can then copy the installer file to the gateway host computer and run it manually to install and update the gateway.

### 2. Problem
You see this error when you're attempting to install a gateway by clicking **install directly on this computer** in the Azure portal.

`Error:  Abort installing a new gateway on this computer because this computer has an existing installed gateway and a computer without any installed gateway is required for installing a new gateway.`  

#### Cause
A gateway is already installed on the machine.

#### Resolution
Uninstall the existing gateway on the machine and click the **install directly on this computer** link again.

### 3. Problem
You might see this error when registering a new gateway.

`Error: The gateway has encountered an error during registration.`

#### Cause
You might see this message for one of the following reasons:

* The format of the gateway key is invalid.
* The gateway key has been invalidated.
* The gateway key has been regenerated from the portal.  

#### Resolution
Verify whether you are using the right gateway key from the portal. If needed, regenerate a key and use the key to register the gateway.

### 4. Problem
You might see the following error message when you're registering a gateway.

`Error: The content or format of the gateway key "{gatewayKey}" is invalid, please go to azure portal to create one new gateway or regenerate the gateway key.`



:::image type="content" source="media/data-factory-troubleshoot-gateway-issues/invalid-format-gateway-key.png" alt-text="Content or format of key is invalid":::

#### Cause
The content or format of the input gateway key is incorrect. One of the reasons can be that you copied only a portion of the key from the portal or you're using an invalid key.

#### Resolution
Generate a gateway key in the portal, and use the copy button to copy the whole key. Then paste it in this window to register the gateway.

### 5. Problem
You might see the following error message when you're registering a gateway.

`Error: The gateway key is invalid or empty. Specify a valid gateway key from the portal.`

:::image type="content" source="media/data-factory-troubleshoot-gateway-issues/gateway-key-is-invalid-or-empty.png" alt-text="Screenshot that highlights the error message that indicates the gateway key is invalid or empty.":::

#### Cause
The gateway key has been regenerated or the gateway has been deleted in the Azure portal. It can also happen if the Data Management Gateway setup is not latest.

#### Resolution
Check if the Data Management Gateway setup is the latest version, you can find the latest version on the Microsoft [download center](https://go.microsoft.com/fwlink/p/?LinkId=271260).

If setup is current/ latest and gateway still exists on Portal, regenerate the gateway key in the Azure portal, and use the copy button to copy the whole key, and then paste it in this window to register the gateway. Otherwise, recreate the gateway and start over.

### 6. Problem
You might see the following error message when you're registering a gateway.

`Error: Gateway has been online for a while, then shows "Gateway is not registered" with the status "Gateway key is invalid"`

:::image type="content" source="media/data-factory-troubleshoot-gateway-issues/gateway-not-registered-key-invalid.png" alt-text="Gateway key is invalid or empty":::

#### Cause
This error might happen because either the gateway has been deleted or the associated gateway key has been regenerated.

#### Resolution
If the gateway has been deleted, re-create the gateway from the portal, click **Register**, copy the key from the portal, paste it, and try to register the gateway.

If the gateway still exists but its key has been regenerated, use the new key to register the gateway. If you don't have the key, regenerate the key again from the portal.

### 7. Problem
When you're registering a gateway, you might need to enter path and password for a certificate.

:::image type="content" source="media/data-factory-troubleshoot-gateway-issues/specify-certificate.png" alt-text="Screenshot that shows where you enter the path and password for the certificate.":::

#### Cause
The gateway has been registered on other machines before. During the initial registration of a gateway, an encryption certificate has been associated with the gateway. The certificate can either be self-generated by the gateway or provided by the user.  This certificate is used to encrypt credentials of the data store (linked service).  

:::image type="content" source="media/data-factory-troubleshoot-gateway-issues/export-certificate.png" alt-text="Export certificate":::

When restoring the gateway on a different host machine, the registration wizard asks for this certificate to decrypt credentials previously encrypted with this certificate.  Without this certificate, the credentials cannot be decrypted by the new gateway and subsequent copy activity executions associated with this new gateway will fail.  

#### Resolution
If you have exported the credential certificate from the original gateway machine by using the **Export** button on the **Settings** tab in Data Management Gateway Configuration Manager, use the certificate here.

You cannot skip this stage when recovering a gateway. If the certificate is missing, you need to delete the gateway from the portal and re-create a new gateway.  In addition, update all linked services that are related to the gateway by reentering their credentials.

### 8. Problem
You might see the following error message.

`Error: The remote server returned an error: (407) Proxy Authentication Required.`

#### Cause
This error happens when your gateway is in an environment that requires an HTTP proxy to access Internet resources, or your proxy's authentication password is changed but it's not updated accordingly in your gateway.

#### Resolution
Follow the instructions in the Proxy server considerations section of this article, and configure proxy settings with Data Management Gateway Configuration Manager.

## Gateway is online with limited functionality
### 1. Problem
You see the status of the gateway as online with limited functionality.

#### Cause
You see the status of the gateway as online with limited functionality for one of the following reasons:

* Gateway cannot connect to cloud service through Azure Service Bus.
* Cloud service cannot connect to gateway through Service Bus.

When the gateway is online with limited functionality, you might not be able to use the Data Factory Copy Wizard to create data pipelines for copying data to or from on-premises data stores. As a workaround, you can use Data Factory Editor in the portal, Visual Studio, or Azure PowerShell.

#### Resolution
Resolution for this issue (online with limited functionality) is based on whether the gateway cannot connect to the cloud service or the other way. The following sections provide these resolutions.

### 2. Problem
You see the following error.

`Error: Gateway cannot connect to cloud service through service bus`

:::image type="content" source="media/data-factory-troubleshoot-gateway-issues/gateway-cannot-connect-to-cloud-service.png" alt-text="Gateway cannot connect to cloud service":::

#### Cause
Gateway cannot connect to the cloud service through Service Bus.

#### Resolution
Follow these steps to get the gateway back online:

1. Allow IP address outbound rules on the gateway machine and the corporate firewall. You can find IP addresses from the Windows Event Log (ID == 401): An attempt was made to access a socket in a way forbidden by its access permissions XX.XX.XX.XX:9350.
1. Configure proxy settings on the gateway. See the Proxy server considerations section for details.
1. Enable outbound ports 5671 and 9350-9354 on both the Windows Firewall on the gateway machine and the corporate firewall. See the Ports and firewall section for details. This step is optional, but we recommend it for performance consideration.

### 3. Problem
You see the following error.

`Error: Cloud service cannot connect to gateway through service bus.`

#### Cause
A transient error in network connectivity.

#### Resolution
Follow these steps to get the gateway back online:

1. Wait for a couple of minutes, the connectivity will be automatically recovered when the error is gone.
1. If the error persists, restart the gateway service.

## Failed to author linked service
### Problem
You might see this error when you try to use Credential Manager in the portal to input credentials for a new linked service, or update credentials for an existing linked service.

`Error: The data store '<Server>/<Database>' cannot be reached. Check connection settings for the data source.`

When you see this error, the settings page of Data Management Gateway Configuration Manager might look like the following screenshot.

:::image type="content" source="media/data-factory-troubleshoot-gateway-issues/database-cannot-be-reached.png" alt-text="Database cannot be reached":::

#### Cause
The TLS/SSL certificate might have been lost on the gateway machine. The gateway computer cannot load the certificate currently that is used for TLS encryption. You might also see an error message in the event log that is similar to the following message.

 `Unable to get the gateway settings from cloud service. Check the gateway key and the network connection. (Certificate with thumbprint cannot be loaded.)`

#### Resolution
Follow these steps to solve the problem:

1. Start Data Management Gateway Configuration Manager.
2. Switch to the **Settings** tab.  
3. Click the **Change** button to change the TLS/SSL certificate.

   :::image type="content" source="media/data-factory-troubleshoot-gateway-issues/change-button-ssl-certificate.png" alt-text="Change certificate button":::
4. Select a new certificate as the TLS/SSL certificate. You can use any TLS/SSL certificate that is generated by you or any organization.

   :::image type="content" source="media/data-factory-troubleshoot-gateway-issues/specify-http-end-point.png" alt-text="Specify certificate":::

## Copy activity fails
### Problem
You might notice the following "UserErrorFailedToConnectToSqlserver" failure after you set up a pipeline in the portal.

`Error: Copy activity encountered a user error: ErrorCode=UserErrorFailedToConnectToSqlServer,'Type=Microsoft.DataTransfer.Common.Shared.HybridDeliveryException,Message=Cannot connect to SQL Server`

#### Cause
This can happen for different reasons, and mitigation varies accordingly.

#### Resolution
Allow outbound TCP connections over port TCP/1433 on the Data Management Gateway client side before connecting to a SQL database.

If the target database is in Azure SQL Database, check SQL Server firewall settings for Azure as well.

See the following section to test the connection to the on-premises data store.

## Data store connection or driver-related errors
If you see data store connection or driver-related errors, complete the following steps:

1. Start Data Management Gateway Configuration Manager on the gateway machine.
2. Switch to the **Diagnostics** tab.
3. In **Test Connection**, add the gateway group values.
4. Click **Test** to see if you can connect to the on-premises data source from the gateway machine by using the connection information and credentials. If the test connection still fails after you install a driver, restart the gateway for it to pick up the latest change.

:::image type="content" source="media/data-factory-troubleshoot-gateway-issues/test-connection-in-diagnostics-tab.png" alt-text="Test Connection in Diagnostics tab":::

## Gateway logs
### Send gateway logs to Microsoft
When you contact Microsoft Support to get help with troubleshooting gateway issues, you might be asked to share your gateway logs. With the release of the gateway, you can share required gateway logs with two button clicks in Data Management Gateway Configuration Manager.    

1. Switch to the **Diagnostics** tab in Data Management Gateway Configuration Manager.

    :::image type="content" source="media/data-factory-troubleshoot-gateway-issues/data-management-gateway-diagnostics-tab.png" alt-text="Data Management Gateway Diagnostics tab":::
2. Click **Send Logs** to see the following dialog box.

    :::image type="content" source="media/data-factory-troubleshoot-gateway-issues/data-management-gateway-send-logs-dialog.png" alt-text="Data Management Gateway Send logs":::
3. (Optional) Click **view logs** to review logs in the event viewer.
4. (Optional) Click **privacy** to review Microsoft web services privacy statement.
5. When you are satisfied with what you are about to upload, click **Send Logs** to actually send the logs from the last seven days to Microsoft for troubleshooting. You should see the status of the send-logs operation as shown in the following screenshot.

    :::image type="content" source="media/data-factory-troubleshoot-gateway-issues/data-management-gateway-send-logs-status.png" alt-text="Screenshot that shows where to view the status of the send-logs operation.":::
6. After the operation is complete, you see a dialog box as shown in the following screenshot.

    :::image type="content" source="media/data-factory-troubleshoot-gateway-issues/data-management-gateway-send-logs-result.png" alt-text="Data Management Gateway Send logs status":::
7. Save the **Report ID** and share it with Microsoft Support. The report ID is used to locate the gateway logs that you uploaded for troubleshooting.  The report ID is also saved in the event viewer.  You can find it by looking at the event ID "25", and check the date and time.

    :::image type="content" source="media/data-factory-troubleshoot-gateway-issues/data-management-gateway-send-logs-report-id.png" alt-text="Data Management Gateway Send logs report ID":::    

### Archive gateway logs on gateway host machine
There are some scenarios where you have gateway issues and you cannot share gateway logs directly:

* You manually install the gateway and register the gateway.
* You try to register the gateway with a regenerated key in Data Management Gateway Configuration Manager.
* You try to send logs and the gateway host service cannot be connected.

For these scenarios, you can save gateway logs as a zip file and share it when you contact Microsoft support. For example, if you receive an error while you register the gateway as shown in the following screenshot.   

:::image type="content" source="media/data-factory-troubleshoot-gateway-issues/data-management-gateway-registration-error.png" alt-text="Data Management Gateway Registration error":::

Click the **Archive gateway logs** link to archive and save logs, and then share the zip file with Microsoft support.

:::image type="content" source="media/data-factory-troubleshoot-gateway-issues/data-management-gateway-archive-logs.png" alt-text="Data Management Gateway Archive logs":::

### Locate gateway logs
You can find detailed gateway log information in the Windows event logs.

1. Start Windows **Event Viewer**.
2. Locate logs in the **Application and Services Logs** > **Data Management Gateway** folder.

   When you're troubleshooting gateway-related issues, look for error level events in the event viewer.

:::image type="content" source="media/data-factory-troubleshoot-gateway-issues/gateway-logs-event-viewer.png" alt-text="Data Management Gateway logs in event viewer":::
