---
 author: normesta
 ms.service: storage
 ms.topic: include
 ms.date: 01/3/2022
 ms.author: normesta
---

| Property | Description |
|:--- |:---|
|**time** | The Universal Time Coordinated (UTC) time when the request was received by storage. For example: `2018/11/08 21:09:36.6900118`.|
|**resourceId** | The resource ID of the storage account. For example: `/subscriptions/208841be-a4v3-4234-9450-08b90c09f4/resourceGroups/`<br>`myresourcegroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount/storageAccounts/blobServices/default`|
|**category** | The category of the requested operation. For example: `StorageRead`, `StorageWrite`, or `StorageDelete`.|
|**operationName** | The type of REST operation that was performed. <br> For a complete list of operations, see [Storage Analytics Logged Operations and Status Messages topic](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages). |
|**operationVersion** | The storage service version that was specified when the request was made. This is equivalent to the value of the **x-ms-version** header. For example: `2017-04-17`.|
|**schemaVersion** | The schema version of the log. For example: `1.0`.|
|**statusCode** | The HTTP or [SMB](/openspecs/windows_protocols/ms-cifs/8f11e0f3-d545-46cc-97e6-f00569e3e1bc) status code for the request. If the HTTP request is interrupted, this value might be set to `Unknown`. <br> For example: `206` |
|**statusText** | The status of the requested operation.  For a complete list of status messages, see [Storage Analytics Logged Operations and Status Messages topic](/rest/api/storageservices/storage-analytics-logged-operations-and-status-messages). In version 2017-04-17 and later, the status message `ClientOtherError` isn't used. Instead, this field contains an error code. For example: `SASSuccess`  |
|**durationMs** | The total time, expressed in milliseconds, to perform the requested operation. This includes the time to read the incoming request, and to send the response to the requester. For example: `12`.|
|**callerIpAddress** | The IP address of the requester, including the port number. For example: `192.100.0.102:4362`. |
|**correlationId** | The ID that is used to correlate logs across resources. For example: `b99ba45e-a01e-0042-4ea6-772bbb000000`. |
|**location** | The location of storage account. For example: `North Europe`. |
|**protocol**|The protocol that is used in the operation. For example: `HTTP`, `HTTPS`, `SMB`, or `NFS`|
| **uri** | Uniform resource identifier that is requested. |