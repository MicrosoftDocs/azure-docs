---
title: Troubleshoot Blob storage on an Azure Stack Edge Pro with GPU device| Microsoft Docs 
description: Describes how to troubleshoot issues with Blob storage on an Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: troubleshooting
ms.date: 06/02/2021
ms.author: alkohli
---
# Troubleshoot Blob storage issues on an Azure Stack Edge Pro GPU device 

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-and-gateway-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-databox-gateway-sku.md)]


This article describes how to troubleshoot issues with Blob storage on your Azure Stack Edge Pro GPU or Data Box Gateway device. 

ERRORS DISPLAYED IN PORTAL?


## Errors for Blob storage on device 

Here are the errors related to Blob storage on an Azure Stack Edge Pro or Data Box Gateway device.

| **Issue / Errors** |  **Resolution** | 
|--------------------|-----------------|
|Unable to retrieve child resources. The value for one of the HTTP headers is not in the correct format.| From the **Edit** menu, select **Target Azure Stack APIs**. Then, restart Azure Storage Explorer.|
|`getaddrinfo ENOTFOUND <accountname>.blob.<serialnumber>.microsoftdatabox.com`|Check that the endpoint name `<accountname>.blob.<serialnumber>.microsoftdatabox.com` is added to the hosts file at this path: `C:\Windows\System32\drivers\etc\hosts` on Windows, or `/etc/hosts` on Linux.|
|Unable to retrieve child resources.<br> Details: self-signed certificate |Import the SSL certificate for your device into Azure Storage Explorer: <ol><li>Download the certificate from the Azure portal. For more information, see [Download the certificate](../databox/data-box-deploy-copy-data-via-rest.md#download-certificate).</li><li>From the **Edit** menu, select SSL Certificates and then select **Import Certificates**.</li></ol>|
|AzCopy command appears to stop responding for a minute before displaying this error:<br>`Failed to enumerate directory https://… The remote name could not be resolved <accountname>.blob.<serialnumber>.microsoftdatabox.com`|Check that the endpoint name `<accountname>.blob.<serialnumber>.microsoftdatabox.com` is added to the hosts file at: `C:\Windows\System32\drivers\etc\hosts`.|
|AzCopy command appears to stop responding for a minute before displaying this error:<br>`Error parsing source location. The underlying connection was closed: Could not establish trust relationship for the SSL/TLS secure channel`. |Import the SSL certificate for your device into the system's certificate store. For more information, see [Download the certificate](../databox/data-box-deploy-copy-data-via-rest.md#download-certificate).|
|AzCopy command appears to stop responding for 20 minutes before displaying this error:<br>`Error parsing source location https://<accountname>.blob.<serialnumber>.microsoftdatabox.com/<cntnr>. No such device or address`. |Check that the endpoint name `<accountname>.blob.<serialnumber>.microsoftdatabox.com` is added to the hosts file at: `/etc/hosts`.|
|AzCopy command appears to stop responding for 20 minutes before displaying this error:<br>`Error parsing source location… The SSL connection could not be established`. |Import the SSL certificate for your device into the system's certificate store. For more information, see [Download the certificate](../databox/data-box-deploy-copy-data-via-rest.md#download-certificate).|
|AzCopy command appears to stop responding for 20 minutes before displaying this error:<br>`Error parsing source location https://<accountname>.blob.<serialnumber>.microsoftdatabox.com/<cntnr>. No such device or address`|Check that the endpoint name `<accountname>.blob.<serialnumber>.microsoftdatabox.com` is added to the hosts file at: `/etc/hosts`.|
|AzCopy command appears to stop responding for 20 minutes before displaying this error: `Error parsing source location… The SSL connection could not be established`.|Import the SSL certificate for your device into the system's certificate store. For more information, see [Download the certificate](../databox/data-box-deploy-copy-data-via-rest.md#download-certificate).|
|The value for one of the HTTP headers is not in the correct format.|The installed version of the Microsoft Azure Storage Library for Python is not supported by Data Box. See Azure Data Box Blob storage requirements for supported versions.|
|… [SSL: CERTIFICATE_VERIFY_FAILED] …| Before running Python, set the REQUESTS_CA_BUNDLE environment variable to the path of the Base64-encoded SSL certificate file (see how to [Download the certificate](../databox/data-box-deploy-copy-data-via-rest.md#download-certificate). For example:<br>`export REQUESTS_CA_BUNDLE=/tmp/mycert.cer`<br>`python`<br>Alternately, add the certificate to the system's certificate store, and then set this environment variable to the path of that store. For example, on Ubuntu:<br>`export REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt`<br>`python`.|
|The connection times out.|Sign into the Azure Stack Edge Pro and then check that it's unlocked. Anytime the device restarts, it stays locked until someone signs in.|


## Next steps

- Learn more on how to [Troubleshoot device activation issues](azure-stack-edge-gpu-troubleshoot-activation.md).<!--List not updated.-->