---
title: Troubleshoot Azure Resource Manager configuration on an Azure Stack Edge Pro GPU device| Microsoft Docs 
description: Describes how to troubleshoot the Azure Resource Manager configuration on your Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: troubleshooting
ms.date: 06/02/2021
ms.author: alkohli
---
# Troubleshoot Azure Resource Manager configuration on an Azure Stack Edge Pro GPU device 

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to troubleshoot issues that may show up while you're configuring Azure Resource Manager to access your Azure Stack Edge Pro GPU device.

ARE THE ERRORS IN THE PORTAL OR IN A LOG?

LINK TO ARM CONFIGURATION?

 
## Azure Resource Manager configuration errors

Here are the errors that may show up during the configuration of Azure Resource Manager to access your device. 

| **Issue / Errors** |  **Resolution** | 
|------------|-----------------|
|General issues|<li>[Verify that the Edge device is configured properly](#verify-the-device-is-configured-properly).<li> [Verify that the client is configured properly](#verify-the-client-is-configured-properly)|
|Add-AzureRmEnvironment: An error occurred while sending the request.<br>At line:1 char:1<br>+ Add-AzureRmEnvironment -Name Az3 -ARMEndpoint "https://management.dbe ...|This error means that your Azure Stack Edge Pro device is not reachable or configured properly. Verify that the Edge device and the client are configured correctly. For guidance, see the **General issues** row in this table.|
|Service returned error. Check InnerException for more details: The underlying connection was closed: Could not establish trust relationship for the SSL/TLS secure channel. |   This error is likely due to one or more bring your own certificate steps incorrectly performed. You can find guidance [here](./azure-stack-edge-gpu-connect-resource-manager.md#step-2-create-and-install-certificates). |
|Operation returned an invalid status code 'ServiceUnavailable' <br> Response status code does not indicate success: 503 (Service Unavailable). | This error could be the result of any of these conditions.<li>ArmStsPool is in stopped state.</li><li>Either of the Azure Resource Manager/Security token services websites are down.</li><li>The Azure Resource Manager cluster resource is down.</li><br><strong>Note:</strong> Restarting the appliance might fix the issue, but you should collect the support package so that you can debug it further.|
|AADSTS50126: Invalid username or password.<br>Trace ID: 29317da9-52fc-4ba0-9778-446ae5625e5a<br>Correlation ID: 1b9752c4-8cbf-4304-a714-8a16527410f4<br>Timestamp: 2019-11-15 09:21:57Z: The remote server returned an error: (400) Bad Request.<br>At line:1 char:1 |This error could be the result of any of these conditions.<li>For an invalid username and password, validate that the customer has changed the password from Azure portal by following the steps [here](./azure-stack-edge-gpu-set-azure-resource-manager-password.md) and then by using the correct password.<li>For an invalid tenant ID, the tenant ID is a fixed GUID and should be set to `c0257de7-538f-415c-993a-1b87a031879d`</li>|
|connect-AzureRmAccount: AADSTS90056: The resource is disabled or does not exist. Check your app's code to ensure that you have specified the exact resource URL for the resource you are trying to access.<br>Trace ID: e19bdbc9-5dc8-4a74-85c3-ac6abdfda115<br>Correlation ID: 75c8ef5a-830e-48b5-b039-595a96488ff9 Timestamp: 2019-11-18 07:00:51Z: The remote server returned an error: (400) Bad |The resource endpoints used in the `Add-AzureRmEnvironment` command are incorrect.|
|Unable to get endpoints from the cloud.<br>Please ensure you have network connection. Error detail: HTTPSConnectionPool(host='management.dbg-of4k6suvm.microsoftdatabox.com', port=30005): Max retries exceeded with url: /metadata/endpoints?api-version=2015-01-01 (Caused by SSLError(SSLError("bad handshake: Error([('SSL routines', 'tls_process_server_certificate', 'certificate verify failed')],)",),)) |This error appears mostly in a Mac/Linux environment, and is due to the following issues:<li>A PEM format certificate wasn't added to the python certificate store.</li> |

## Verify the device is configured properly
<!--I'm promoting these subsections to include them in the right nav pane. Add intro sentence to each to make this hang together.-->

1. From the local UI, verify that the device network is configured correctly.

2. Verify that certificates are updated for all the endpoints as mentioned [here](./azure-stack-edge-gpu-connect-resource-manager.md#step-2-create-and-install-certificates).

3. Get the Azure Resource Manager management and login endpoint from the **Device** page in local UI.

4. Verify that the device is activated and registered in Azure.


## Verify the client is configured properly

1. Validate that the correct PowerShell version is installed as mentioned [here](./azure-stack-edge-gpu-connect-resource-manager.md#step-3-install-powershell-on-the-client).

2. Validate that the correct PowerShell modules are installed as mentioned [here](./azure-stack-edge-gpu-connect-resource-manager.md#step-4-set-up-azure-powershell-on-the-client).

3. Validate that Azure Resource Manager and login endpoints are reachable. You can try to ping the endpoints. For example:

   `ping management.28bmdw2-bb9.microsoftdatabox.com`
   `ping login.28bmdw2-bb9.microsoftdatabox.com`
   
   If they aren't reachable, add DNS / host file entries as mentioned [here](./azure-stack-edge-gpu-connect-resource-manager.md#step-5-modify-host-file-for-endpoint-name-resolution).
   
4. Validate that client certificates are installed as mentioned [here](./azure-stack-edge-gpu-connect-resource-manager.md#import-certificates-on-the-client-running-azure-powershell).

5. If the customer is using PowerShell, you should enable the debug preference to see detailed messages by running this PowerShell command. 

    `$debugpreference = "continue"`


## Next steps

- Learn more on how to [Troubleshoot device activation issues](azure-stack-edge-gpu-troubleshoot-activation.md).<!--List not yet updated.-->