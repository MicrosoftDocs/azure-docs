---
title: Troubleshoot Blob storage for Azure Stack Edge Pro GPU| Microsoft Docs 
description: Describes how to troubleshoot issues with Blob storage for an Azure Stack Edge device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: troubleshooting
ms.date: 06/10/2021
ms.author: alkohli
ms.custom: "contperf-fy21q4"
---
# Troubleshoot Blob storage issues for an Azure Stack Edge device 

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to troubleshoot issues with Blob storage for your Azure Stack Edge device. 

## Errors for Blob storage on device 

Here are the errors related to Blob storage for an Azure Stack Edge device.

| **Issue / Errors** |  **Resolution** | 
|--------------------|-----------------|
|Unable to retrieve child resources. The value for one of the HTTP headers is not in the correct format.| From the **Edit** menu, select **Target Azure Stack APIs**. Then, restart Azure Storage Explorer.|
|`getaddrinfo ENOTFOUND <accountname>.blob.<serialnumber>.microsoftdatabox.com`|Check that the endpoint name `<accountname>.blob.<serialnumber>.microsoftdatabox.com` is added to the hosts file at this path, `C:\Windows\System32\drivers\etc\hosts`, on Windows, or at `/etc/hosts` on Linux.|
|Unable to retrieve child resources.<br> Details: self-signed certificate |Import the SSL certificate for your device into Azure Storage Explorer: <ol><li>[Generate and download the certificate](azure-stack-edge-gpu-deploy-configure-certificates.md#generate-device-certificates).</li><li>From the **Edit** menu, select SSL Certificates and then select **Import Certificates**.</li></ol>|
|AzCopy command appears to stop responding for a minute before displaying this error:<br>`Failed to enumerate directory https://… The remote name could not be resolved <accountname>.blob.<serialnumber>.microsoftdatabox.com`|Check that the endpoint name `<accountname>.blob.<serialnumber>.microsoftdatabox.com` is added to the hosts file at: `C:\Windows\System32\drivers\etc\hosts`.|
|AzCopy command appears to stop responding for a minute before displaying this error:<br>`Error parsing source location. The underlying connection was closed: Could not establish trust relationship for the SSL/TLS secure channel`. |Import the SSL certificate for your device into Azure Storage Explorer: <ol><li>[Generate and download the certificate](azure-stack-edge-gpu-deploy-configure-certificates.md#generate-device-certificates).</li><li>From the **Edit** menu, select SSL Certificates and then select **Import Certificates**.</li></ol>|
|AzCopy command appears to stop responding for 20 minutes before displaying this error:<br>`Error parsing source location https://<accountname>.blob.<serialnumber>.microsoftdatabox.com/<cntnr>. No such device or address`. |Check that the endpoint name `<accountname>.blob.<serialnumber>.microsoftdatabox.com` is added to the hosts file at: `/etc/hosts`.|
|AzCopy command appears to stop responding for 20 minutes before displaying this error:<br>`Error parsing source location… The SSL connection could not be established`. |Import the SSL certificate for your device into Azure Storage Explorer: <ol><li>[Generate and download the certificate](azure-stack-edge-gpu-deploy-configure-certificates.md#generate-device-certificates).</li><li>From the **Edit** menu, select SSL Certificates and then select **Import Certificates**.</li></ol>|
|AzCopy command appears to stop responding for 20 minutes before displaying this error:<br>`Error parsing source location https://<accountname>.blob.<serialnumber>.microsoftdatabox.com/<cntnr>. No such device or address`|Check that the endpoint name `<accountname>.blob.<serialnumber>.microsoftdatabox.com` is added to the hosts file at: `/etc/hosts`.|
|AzCopy command appears to stop responding for 20 minutes before displaying this error: `Error parsing source location… The SSL connection could not be established`.|Import the SSL certificate for your device into the system's certificate store. For more information, see [Download the certificate](../databox/data-box-deploy-copy-data-via-rest.md#download-certificate).|
|The value for one of the HTTP headers is not in the correct format.|The installed version of the Microsoft Azure Storage Library for Python is not supported by Azure Stack Edge. For supported library versions, see [Supported Azure client libraries](azure-stack-edge-gpu-system-requirements-rest.md#supported-azure-client-libraries).|
|… [SSL: CERTIFICATE_VERIFY_FAILED] …| Before running Python, set the REQUESTS_CA_BUNDLE environment variable to the path of the Base64-encoded SSL certificate file (see how to [Download the certificate](azure-stack-edge-gpu-deploy-configure-certificates.md#generate-device-certificates)). For example, run:<br>`export REQUESTS_CA_BUNDLE=/tmp/mycert.cer`<br>`python`<br>Alternately, add the certificate to the system's certificate store, and then set this environment variable to the path of that store. For example, on Ubuntu, run:<br>`export REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt`<br>`python`|
|The connection times out.|Sign in on your device, and then check whether it's unlocked. Anytime the device restarts, it stays locked until someone signs in.|
|Could not create or update storageaccount. Ensure that the access key for your storage account is valid. If needed, update the key on the device.|Sync the storage account keys. Follow the steps outlined [here](azure-stack-edge-gpu-manage-storage-accounts.md#sync-storage-keys).|

## Next steps

- [Troubleshoot device upload and refresh errors](azure-stack-edge-gpu-troubleshoot.md#troubleshoot-device-upload-and-refresh-errors).
