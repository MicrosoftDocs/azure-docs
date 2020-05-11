---
title: Troubleshoot latency using Storage Analytics logs
description: Identify and troubleshoot latency issues using Azure Storage Analytic logs, and optimize the client application.
author: v-miegge
ms.topic: troubleshooting
ms.author: kartup
manager: dcscontentpm
ms.date: 10/21/2019
ms.service: storage
ms.subservice: common
services: storage
tags: ''
---

# Troubleshoot latency using Storage Analytics logs

Diagnosing and troubleshooting is a key skill for building and supporting client applications with Azure Storage.

Because of the distributed nature of an Azure application, diagnosing and troubleshooting both errors and performance issues may be more complex than in traditional environments.

The following steps demonstrate how to identify and troubleshoot latency issues using Azure Storage Analytic logs, and optimize the client application.

## Recommended steps

1. Download the [Storage Analytics logs](https://docs.microsoft.com/azure/storage/common/storage-analytics-logging#download-storage-logging-log-data).

2. Use the following PowerShell script to convert the raw format logs into tabular format:

   ```Powershell
   $Columns = 
        (   "version-number",
            "request-start-time",
            "operation-type",
            "request-status",
            "http-status-code",
            "end-to-end-latency-in-ms",
            "server-latency-in-ms",
            "authentication-type",
            "requester-account-name",
            "owner-account-name",
            "service-type",
            "request-url",
            "requested-object-key",
            "request-id-header",
            "operation-count",
            "requester-ip-address",
            "request-version-header",
            "request-header-size",
            "request-packet-size",
            "response-header-size",
            "response-packet-size",
            "request-content-length",
            "request-md5",
            "server-md5",
            "etag-identifier",
            "last-modified-time",
            "conditions-used",
            "user-agent-header",
            "referrer-header",
            "client-request-id"
        )

   $logs = Import-Csv “REPLACE THIS WITH FILE PATH” -Delimiter ";" -Header $Columns

   $logs | Out-GridView -Title "Storage Analytic Log Parser"
   ```

3. The script will launch a GUI window where you can filter the information by columns, as shown below.

   ![Storage Analytic Log Parser Window](media/troubleshoot-latency-storage-analytics-logs/storage-analytic-log-parser-window.png)
 
4. Narrow down the log entries based on “operation-type”, and look for the log entry created during the issue's time frame.

   ![Operation-type log entries](media/troubleshoot-latency-storage-analytics-logs/operation-type.png)

5. During the time when the issue occurred, the following values are important:

   * Operation-type = GetBlob
   * request-status = SASNetworkError
   * End-to-End-Latency-In-Ms = 8453
   * Server-Latency-In-Ms = 391

   End-to-End Latency is calculated using the following equation:

   * End-to-End Latency = Server-Latency + Client Latency

   Calculate the Client Latency using the log entry:

   * Client Latency = End-to-End Latency – Server-Latency

          * Example: 8453 – 391 = 8062ms

   The following table provides information about the high latency OperationType and RequestStatus results:

   |   |RequestStatus=<br>Success|RequestStatus=<br>(SAS)NetworkError|Recommendation|
   |---|---|---|---|
   |GetBlob|Yes|No|[**GetBlob Operation:** RequestStatus = Success](#getblob-operation-requeststatus--success)|
   |GetBlob|No|Yes|[**GetBlob Operation:** RequestStatus = (SAS)NetworkError](#getblob-operation-requeststatus--sasnetworkerror)|
   |PutBlob|Yes|No|[**Put Operation:** RequestStatus = Success](#put-operation-requeststatus--success)|
   |PutBlob|No|Yes|[**Put Operation:** RequestStatus = (SAS)NetworkError](#put-operation-requeststatus--sasnetworkerror)|

## Status results

### GetBlob Operation: RequestStatus = Success

Check the following values as mentioned in step 5 of the "Recommended steps" section:

* End-to-End Latency
* Server-Latency
* Client-Latency

In a **GetBlob Operation** with **RequestStatus = Success**, if **Max Time** is spent in **Client-Latency**, this indicates that Azure Storage is spending a large volume of time writing data to the client. This delay indicates a Client-Side Issue.

**Recommendation:**

* Investigate the code in your client.
* Use Wireshark, Microsoft Message Analyzer, or Tcping to investigate network connectivity issues from the client. 

### GetBlob Operation: RequestStatus = (SAS)NetworkError

Check the following values as mentioned in step 5 of the "Recommended steps" section:

* End-to-End Latency
* Server-Latency
* Client-Latency

In a **GetBlob Operation** with **RequestStatus = (SAS)NetworkError**, if **Max Time** is spent in **Client-Latency**, the most common issue is that the client is disconnecting before a timeout expires in the storage service.

**Recommendation:**

* Investigate the code in your client to understand why and when the client disconnects from the storage service.
* Use Wireshark, Microsoft Message Analyzer, or Tcping to investigate network connectivity issues from the client. 

### Put Operation: RequestStatus = Success

Check the following values as mentioned in step 5 of the "Recommended steps" section:

* End-to-End Latency
* Server-Latency
* Client-Latency

In a **Put Operation** with **RequestStatus = Success**, if **Max Time** is spent in **Client-Latency**, this indicates that the Client is taking more time to send data to the Azure Storage. This delay indicates a Client-Side Issue.

**Recommendation:**

* Investigate the code in your client.
* Use Wireshark, Microsoft Message Analyzer, or Tcping to investigate network connectivity issues from the client. 

### Put Operation: RequestStatus = (SAS)NetworkError

Check the following values as mentioned in step 5 of the "Recommended steps" section:

* End-to-End Latency
* Server-Latency
* Client-Latency

In a **PutBlob Operation** with **RequestStatus = (SAS)NetworkError**, if **Max Time** is spent in **Client-Latency**, the most common issue is that the client is disconnecting before a timeout expires in the storage service.

**Recommendation:**

* Investigate the code in your client to understand why and when the client disconnects from the storage service.
* Use Wireshark, Microsoft Message Analyzer, or Tcping to investigate network connectivity issues from the client.

