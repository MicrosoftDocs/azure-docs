---
title: Troubleshoot Azure Resource Manager configuration on Azure Stack Edge Pro GPU| Microsoft Docs
description: Describes how to troubleshoot issues with the Azure Resource Manager configuration on Azure Stack Edge devices.
services: databox
author: alkohli

ms.service: azure-stack-edge
ms.topic: troubleshooting
ms.date: 06/10/2021
ms.author: alkohli
ms.custom: devx-track-arm-template
---
# Troubleshoot Azure Resource Manager issues on an Azure Stack Edge device 

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to troubleshoot issues with Azure Resource Manager that may interfere with management of resources on your Azure Stack Edge device. Azure Resource Manager provides a management layer that enables you to create, update, and delete resources in your Azure account.
 
## Azure Resource Manager configuration errors

The following errors may indicate an issue with your Azure Resource Manager configuration. 

| **Issue / Errors** |  **Resolution** | 
|------------|-----------------|
|General issues|<li>[Verify that the device is configured properly](#verify-the-device-is-configured-properly).<li> [Verify that the client is configured properly](#verify-the-client-is-configured-properly).|
|Add-AzureRmEnvironment: An error occurred while sending the request.<br>At line:1 char:1<br>+ Add-AzureRmEnvironment -Name Az3 -ARMEndpoint "https://management.dbe ...|Your device isn't reachable or isn't configured properly. Verify that the device and the client are configured correctly. For guidance, see the **General issues** row in this table.|
|Service returned error. Check InnerException for more details: The underlying connection was closed: Could not establish trust relationship for the SSL/TLS secure channel. |  There was an error in the creation and installation of the certificate on your device. For more information, see [Create and install certificates](azure-stack-edge-gpu-connect-resource-manager.md#step-2-create-and-install-certificates). |
|Operation returned an invalid status code 'ServiceUnavailable' <br> Response status code does not indicate success: 503 (Service Unavailable). | This error could be the result of any of these conditions:<li>ArmStsPool is in stopped state.</li><li>Either Azure Resource Manager is down or the website for the Security Token Service is down.</li><li>The Azure Resource Manager cluster resource is down.</li><br>Restarting the device may fix the issue. To debug further, [collect a Support package](azure-stack-edge-gpu-troubleshoot.md#collect-support-package).|
|AADSTS50126: Invalid username or password.<br>Trace ID: 0000aaaa-11bb-cccc-dd22-eeeeee333333<br>Correlation ID: aaaa0000-bb11-2222-33cc-444444dddddd<br>Timestamp: 2019-11-15 09:21:57Z: The remote server returned an error: (400) Bad Request.<br>At line:1 char:1 |This error could be the result of any of these conditions:<li>For an invalid username and password, make sure that you have [reset the Azure Storage Manager password from the Azure portal](./azure-stack-edge-gpu-set-azure-resource-manager-password.md), and then use the correct password.<li>For an invalid tenant ID, make sure the tenant ID is set to `aaaabbbb-0000-cccc-1111-dddd2222eeee`</li>|
|connect-AzureRmAccount: AADSTS90056: The resource is disabled or does not exist. Check your app's code to ensure that you have specified the exact resource URL for the resource you are trying to access.<br>Trace ID: 3333dddd-44ee-ffff-aa55-bbbbbb666666<br>Correlation ID: cccc2222-dd33-4444-55ee-666666ffffff Timestamp: 2019-11-18 07:00:51Z: The remote server returned an error: (400) Bad |The Azure Resource Manager endpoints used in the `Add-AzureRmEnvironment` command are incorrect.<br>To find the Azure Resource Manager endpoints, check **Device endpoints** on the **Device** page of your device's local web UI.<br>For PowerShell instructions, see [Set Azure Resource Manager environment](azure-stack-edge-gpu-connect-resource-manager.md#step-7-set-azure-resource-manager-environment). |
|Unable to get endpoints from the cloud.<br>Ensure you have network connection. Error detail: HTTPSConnectionPool(host='management.dbg-of4k6suvm.microsoftdatabox.com', port=30005): Max retries exceeded with url: /metadata/endpoints?api-version=2015-01-01 (Caused by SSLError(SSLError("bad handshake: Error([('SSL routines', 'tls_process_server_certificate', 'certificate verify failed')],)",),)) |This error appears mostly in a Mac or Linux environment. The error occurs because a PEM format certificate wasn't added to the Python certificate store. |


## Troubleshoot general issues with Azure Resource Manager

For general issues with Azure Resource Manager, make sure that your device and the client are configured properly. For end-to-end procedures, see [Connect to Azure Resource Manager on your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-connect-resource-manager.md).


### Verify the device is configured properly

1. From the local UI, verify that the device network is configured correctly.

2. [Verify that certificates are updated for all the endpoints](./azure-stack-edge-gpu-connect-resource-manager.md#step-2-create-and-install-certificates).

3. Get the Azure Resource Manager management and login endpoint from the **Device** page in local UI.

4. Verify that the device is activated and registered in Azure.


### Verify the client is configured properly

1. [Validate that the correct PowerShell version is installed](./azure-stack-edge-gpu-connect-resource-manager.md#step-3-install-powershell-on-the-client).

2. [Validate that the correct PowerShell modules are installed](./azure-stack-edge-gpu-connect-resource-manager.md#step-4-set-up-azure-powershell-on-the-client).

3. Validate that Azure Resource Manager and login endpoints are reachable. You can try to ping the endpoints. For example:

   `ping management.28bmdw2-bb9.microsoftdatabox.com`
   `ping login.28bmdw2-bb9.microsoftdatabox.com`
   
   If they aren't reachable, [add DNS / host file entries](./azure-stack-edge-gpu-connect-resource-manager.md#step-5-modify-host-file-for-endpoint-name-resolution).
   
4. [Validate that client certificates are installed](./azure-stack-edge-gpu-connect-resource-manager.md#import-certificates-on-the-client-running-azure-powershell).

5. If you're using PowerShell, enable the debug preference to see detailed messages by running this PowerShell command: 

    `$debugpreference = "continue"`


## Next steps

- [Troubleshoot device activation issues](azure-stack-edge-gpu-troubleshoot-activation.md).
- [Troubleshoot device issues](azure-stack-edge-gpu-troubleshoot.md).
