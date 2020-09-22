---
title: Azure Data Box troubleshooting for using the REST interface| Microsoft Docs 
description: Describes how to troubleshoot issues seen in Azure Data Box when data copy is via the REST interface.
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: troubleshooting
ms.date: 04/19/2019
ms.author: alkohli
---

# Troubleshoot issues related to Azure Data Box Blob storage

This article details information on how to troubleshoot issues you may see when using the Data Box Blob storage via the REST interface on your Data Box to copy data. These issues surface when you are using Data Box Blob storage with other applications or client libraries such as Azure Storage Explorer, AzCopy, or Azure Storage library for Python.

## Errors seen in Azure Storage Explorer

This section details some of the issues faced when using Azure Storage Explorer with Data Box Blob storage.

|Error message  |Recommended action |
|---------|---------|
|Unable to retrieve child resources. The value for one of the HTTP headers is not in the correct format.|From the **Edit** menu, select **Target Azure Stack APIs**. <br>Restart Azure Storage Explorer.|
|`getaddrinfo ENOTFOUND <accountname>.blob.<serialnumber>.microsoftdatabox.com` |Check that the endpoint name `<accountname>.blob.<serialnumber>.microsoftdatabox.com` is added to the hosts file at this path: <li>`C:\Windows\System32\drivers\etc\hosts` on Windows, or </li><li> `/etc/hosts` on Linux.</li>|
|Unable to retrieve child resources. <br>Details: self-signed certificate |Import the TLS/SSL certificate for your device into Azure Storage Explorer: <li>Download the certificate from the Azure portal. For more information, go to [Download the certificate](data-box-deploy-copy-data-via-rest.md#download-certificate).</li><li>From the **Edit** menu, select **SSL Certificates** and then select **Import Certificates**.</li>|

## Errors seen in AzCopy for Windows

This section details some of the issues faced when using AzCopy for Windows with Data Box Blob storage.

|Error message  |Recommended action |
|---------|---------|
|AzCopy command appears to stop responding for a minute before displaying this error: <br>Failed to enumerate directory https://… The remote name could not be resolved `<accountname>.blob.<serialnumber>.microsoftdatabox.com`|Check that the endpoint name `<accountname>.blob.<serialnumber>.microsoftdatabox.com` is added to the hosts file at: `C:\Windows\System32\drivers\etc\hosts`.|
|AzCopy command appears to stop responding for a minute before displaying this error: <br>Error parsing source location. The underlying connection was closed: Could not establish trust relationship for the SSL/TLS secure channel.|Import the TLS/SSL certificate for your device into the system’s certificate store. For more information, go to [Download the certificate](data-box-deploy-copy-data-via-rest.md#download-certificate).|


## Errors seen in AzCopy for Linux

This section details some of the issues faced when using AzCopy for Linux with Data Box Blob storage.

|Error message  |Recommended action |
|---------|---------|
|AzCopy command appears to stop responding for 20 minutes before displaying this error: <br>Error parsing source location `https://<accountname>.blob.<serialnumber>.microsoftdatabox.com/<cntnr>`. No such device or address|Check that the endpoint name `<accountname>.blob.<serialnumber>.microsoftdatabox.com` is added to the hosts file at: `/etc/hosts`.|
|AzCopy command appears to stop responding for 20 minutes before displaying this error: <br>Error parsing source location… The SSL connection could not be established.|Import the TLS/SSL certificate for your device into the system’s certificate store. For more information, go to [Download the certificate](data-box-deploy-copy-data-via-rest.md#download-certificate).|

## Errors seen in Azure Storage library for Python

This section details some of the top issues faced during deployment of Data Box Disk when using a Linux client for data copy.

|Error message  |Recommended action |
|---------|---------|
|The value for one of the HTTP headers is not in the correct format. |The installed version of the Microsoft Azure Storage Library for Python is not supported by Data Box. See Azure Data Box Blob storage requirements for supported versions.|
|… [SSL: CERTIFICATE_VERIFY_FAILED] …|Before running Python, set the REQUESTS_CA_BUNDLE environment variable to the path of the Base64-encoded TLS certificate file (see how to [Download the certificate](data-box-deploy-copy-data-via-rest.md#download-certificate)). <br>For example:<br>`export REQUESTS_CA_BUNDLE=/tmp/mycert.cer` <br>`python` <br>Alternately, add the certificate to the system’s certificate store and then set this environment variable to the path of that store. <br> For example, on Ubuntu: <br>`export REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt` <br>`python`|


## Common errors

These errors are not specific to any application.

|Error message  |Recommended action |
|---------|---------|
|The connection times out. |Sign into the Data Box device and check that it is unlocked. Any time the device restarts, it stays locked until someone signs in.|

## Next steps

- Learn about the [Data Box Blob storage system requirements](data-box-system-requirements-rest.md).
