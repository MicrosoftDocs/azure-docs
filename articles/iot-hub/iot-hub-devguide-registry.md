<properties
 pageTitle="Azure IoT Hub Developer guide registry | Microsoft Azure"
 description="Describes how to use IoT Hub device identity registry"
 services="azure-iot"
 documentationCenter=".net"
 authors="fsautomata"
 manager="timlt"
 editor=""/>

<tags
 ms.service="azure-iot"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="tbd"
 ms.date="09/04/2015"
 ms.author="dobett"/>

# Device identity registry
Each IoT hub has a device identity registry that is used to create per-device resources in the service such as a queue containing in-flight cloud-to-device messages, and allows access to the device-facing endpoints, as explained in the [Access Control][lnk-accesscontrol] section.

At a high level the device identity registry is a RESTful collection of device identity resources. The following sections detail the device identity resource properties, and the operations allowed on identities by the registry.

**Note**: You can refer to [IoT Hub APIs and SDKs][lnk-apis-sdks]  for more details on the HTTP protocol and SDKs available to interact with the device identity registry.

## Device identity properties <a id="deviceproperties"></a>
Device identities are represented as JSON documents with the following properties.

| Property | Options | Description |
| -------- | ------- | ----------- |
| deviceId | required, read-only on updates | A case-sensitive string ( up to 128 char long) of ASCII 7-bit alphanumeric chars + **{'-', ':', '.', '+', '%', '_', '#', '*', '?', '!', '(', ')', ',', '=', '@', ';', '$', '''}`. |
| generationId | required, read-only | A hub-generated case-sensitive string up to 128 characters long. This is used to distinguish devices with the same **deviceId** when they have been deleted and recreated. |
| etag | required, read-only | A string representing a weak etag for the device identity, as per [RFC7232][lnk-rfc7232].|
| auth | optional | A composite object containing authentication information and security materials. |
| auth.symkey | optional | A composite object containing a primary and a secondary keys, stored in base64 format. |
| status | required | Can be **Enabled** or **Disabled**. If **Enabled**, the device is allowed to connect. If **Disabled** this device cannot access any device-facing endpoint. |
| statusReason | optional | A 128 char-long string storing the reason of the device identity status. All UTF-8 characters allowed. |
| statusUpdateTime | read-only | Date and time of last time the status was updated. |
| connectionState | read-only | **Connected** or **Disconnected**, represents the IoT Hub view of the device connection status. |
| connectionStateUpdatedTime | read-only | Date and time of last time the connection state was updated. |
| lastActivityTime  | read-only | Date and time of last time the device connected, received or sent a message. |

**Note**: Connection state can only represent the IoT Hub view of the status of the connection. This state can be delayed depending on network conditions and configurations.

## Device identity operations
The Azure IoT Hub device identity registry exposes the following operations:

* Create device identity
* Update device identity
* Retrieve device identity by id
* Delete device identity
* List up to 1000 identities

All the above operations allow the use optimistic concurrency as specified in [RFC7232][lnk-rfc7232].

**Important**: The only way to retrieve all identities in a hub's identity registry is to use the [Import/Export](#importexport) functionality.

A hub's device identity registry does not contain any application metadata, can be accessed like a dictionary (using the **deviceId** as the key), and has no support for expressive queries. Any IoT solution will have a solution-specific *device registry*, which contains application specific metadata such as the deployed room, for a temperature sensor in a smart building solution. Refer to [Azure IoT Reference Architecture][lnk-reference-architecture] for more information on how to integrate an identity registry into your IoT solution.

## Disabling devices
You can disable devices by updating the **status** property of an identity in the registry. Typically, this is used in two scenarios:

1. During a provisioning orchestration process. Refer to [Azure IoT Hub Guidance - Provisioning][lnk-guidance-provisioning] for more information.
2. If, for any reason, you consider a device is  compromised or temporarily unauthorized.

## Import/Export device identities <a id="importexport"></a>
You can import and export device identities in bulk from an IoT hub's identity registry. This is currently done with asynchronous operations on the Azure IoT Hub Resource provider endpoint ([Endpoints][lnk-endpoints]).

Imports and exports are long running jobs that use a customer-supplied blob container to read and write device identity data.

These are the operations that are possible on import/export jobs:

* Create an import or export job
* Retrieve the status of a running job
* Cancel a running job

**Important**: Each hub can have only a single job running at any given time.

For detailed information on the import and export APIs, refer to [Azure IoT Hub - Resource Provider APIs][lnk-resource-provider-apis].

### Jobs
All import/export jobs have the following properties:

| Property | Options | Description |
| -------- | ------- | ----------- |
| jobId | system-generated, ignored at creation | |
| creationTime | system-generated, ignored at creation | |
| endOfProcessingTime | system-generated, ignored at creation | |
| type | read-only | **Import** or **Export** |
| status | system-generated, ignored at creation | **Enqueued**, **Started**, **Completed**, **Failed** |
| progress | system-generated, ignored at creation | Integer value of the percentage of completion. |
| importBlobURI | required for import jobs | Blob Shared Access Signature URI with read access to a blob (refer to [Create and Use a SAS with the Blob Service][lnk-createuse-sas], and [Creating a Shared Access Signature in Java][lnk-sas-java]) |
| outputBlobContainerURI | required for all jobs | Blob Shared Access Signature URI with write access to a blob container. This is used to output the status of the job and the results. |
| includeKeysInExport | optional for export jobs, ignored for other jobs | If **true** keys are included in export output; keys are exported as null otherwise. Default: **false**. |
| failureReason | system-generated, ignored at creation | If status is **Failed**, a string containing the reason. |

### Import jobs
Import jobs take, as a parameter, a blob Shared Access Signature URI that links to a blob that contains the list of device identities to import into the hub's identity registry. The signature must grant read access to the blob.

Device identities are serialized in a text file, in their JSON format (as per section [Device identity properties](#deviceproperties)), one per line.

The **etag** property has the following meaning. If not present, the import job will create the identity if no other identity exists. If **etag** is set to *****, then device identities will be created or overwritten, if **etag** has another value, then the identity will be created if non-existing, or updated *only* if an existing one exists with the specified **etag**.

**Example**:

    {"deviceId":"devA","auth":{"symKey":{"primaryKey":"123"}},"status":"enabled"}
    {"deviceId":"devB","auth":{"symKey":{"primaryKey":"234"}},"status":"enabled"}
    {"deviceId":"devC","auth":{"symKey":{"primaryKey":"345"}},"status":"enabled"}
    {"deviceId":"devD","auth":{"symKey":{"primaryKey":"456"}},"status":"enabled"}

Import jobs also take, as a parameter, another blob Shared Access Signature URI that grants write access to a container. The job uses this container to output the results of the job.

#### Results format <a id="results"></a>
Each import job outputs in the output blob container a file called `job_{job_id}_importErrors.log`, which contains errors for individual device identity import operations.

### Export jobs
Export jobs take, as a parameter, a blob Shared Access Signature URI that grants write access to a blob container. This is used to output the result of the operation.

The output results are written in the specified blob container in a file called `job_{job_id}_devices.txt`. This file will contain device identities serialized as JSON as specified in [Device identity properties](#deviceproperties)). The security materials will be set to **null** in case the **includeKeysInExport** is set to **false**.

[lnk-accesscontrol]: iot-hub-devguide-security.md#accesscontrol
[lnk-apis-sdks]: TBD
[lnk-rfc7232]: https://tools.ietf.org/html/rfc7232
[lnk-reference-architecture]: TBD
[lnk-guidance-provisioning]: TBD
[lnk-endpoints]: iot-hub-devguide-endpoints.md
[lnk-resource-provider-apis]: TBD
[lnk-createuse-sas]: https://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-shared-access-signature-part-2/
[lnk-sas-java]: https://msdn.microsoft.com/en-us/library/azure/Hh875756.aspx
