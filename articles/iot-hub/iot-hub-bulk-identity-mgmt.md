---
title: Import and export Azure IoT Hub device identities
description: How to use the Azure IoT service SDK to run bulk operations against the identity registry to import and export device identities. Import operations enable you to create, update, and delete device identities in bulk.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: how-to
ms.date: 06/16/2023
ms.custom: devx-track-csharp, references_regions
---

# Import and export IoT Hub device identities in bulk

Each IoT hub has an identity registry you can use to create per-device resources in the service. The identity registry also enables you to control access to the device-facing endpoints. This article describes how to import and export device identities in bulk to and from an identity registry, using the ImportExportDeviceSample sample included with the [Microsoft Azure IoT SDK for .NET](https://github.com/Azure/azure-iot-sdk-csharp/tree/main). For more information about how you can use this capability when migrating an IoT hub to a different region, see [How to manually migrate an Azure IoT hub using an Azure Resource Manager template](migrate-hub-arm.md).

> [!NOTE]
> IoT Hub has recently added virtual network support in a limited number of regions. This feature secures import and export operations and eliminates the need to pass keys for authentication.  Initially, virtual network support is available only in these regions: *WestUS2*, *EastUS*, and *SouthCentralUS*. To learn more about virtual network support and the API calls to implement it, see [IoT Hub Support for virtual networks](virtual-network-support.md).

Import and export operations take place in the context of *Jobs* that enable you to execute bulk service operations against an IoT hub.

The **RegistryManager** class in the SDK includes the **ExportDevicesAsync** and **ImportDevicesAsync** methods that use the **Job** framework. These methods enable you to export, import, and synchronize the entirety of an IoT hub identity registry.

This topic discusses using the **RegistryManager** class and **Job** system to perform bulk imports and exports of devices to and from an IoT hub's identity registry. You can also use the Azure IoT Hub Device Provisioning Service to enable zero-touch, just-in-time provisioning to one or more IoT hubs without requiring human intervention. To learn more, see the [provisioning service documentation](../iot-dps/index.yml).

> [!NOTE]
> Some of the code snippets in this article are included from the ImportExportDevicesSample service sample provided with the [Microsoft Azure IoT SDK for .NET](https://github.com/Azure/azure-iot-sdk-csharp/tree/main). The sample is located in the `/iothub/service/samples/how to guides/ImportExportDevicesSample` folder of the SDK and, where specified, code snippets are included from the `ImportExportDevicesSample.cs` file for that SDK sample. For more information about the ImportExportDevicesSample sample and other service samples included in the Azure IoT SDK for.NET, see [Azure IoT hub service samples for C#](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/service/samples/how%20to%20guides).

## What are jobs?

Identity registry operations use the **Job** system when the operation:

* Has a potentially long execution time compared to standard run-time operations.

* Returns a large amount of data to the user.

Instead of a single API call waiting or blocking on the result of the operation, the operation asynchronously creates a **Job** for that IoT hub. The operation then immediately returns a **JobProperties** object.

The following C# code snippet shows how to create an export job:

```csharp
// Call an export job on the IoT Hub to retrieve all devices
JobProperties exportJob = await 
  registryManager.ExportDevicesAsync(containerSasUri, false);
```

> [!NOTE]
> To use the **RegistryManager** class in your C# code, add the **Microsoft.Azure.Devices** NuGet package to your project. The **RegistryManager** class is in the **Microsoft.Azure.Devices** namespace.

You can use the **RegistryManager** class to query the state of the **Job** using the returned **JobProperties** metadata. To create an instance of the **RegistryManager** class, use the **CreateFromConnectionString** method.

```csharp
RegistryManager registryManager =
  RegistryManager.CreateFromConnectionString("{your IoT Hub connection string}");
```

To find the connection string for your IoT hub, in the Azure portal:

- Navigate to your IoT hub.

- Select **Shared access policies**.

- Select a policy, taking into account the permissions you need.

- Copy the connection string from the panel on the right-hand side of the screen.

The following C# code snippet, from the **WaitForJobAsync** method in the SDK sample, shows how to poll every five seconds to see if the job has finished executing:

```csharp
// Wait until job is finished
while (true)
{
    job = await registryManager.GetJobAsync(job.JobId);
    if (job.Status == JobStatus.Completed
        || job.Status == JobStatus.Failed
        || job.Status == JobStatus.Cancelled)
    {
        // Job has finished executing
        break;
    }
    Console.WriteLine($"\tJob status is {job.Status}...");

    await Task.Delay(TimeSpan.FromSeconds(5));
}
```

> [!NOTE]
> If your storage account has firewall configurations that restrict IoT Hub's connectivity, consider using [Microsoft trusted first party exception](./virtual-network-support.md#egress-connectivity-from-iot-hub-to-other-azure-resources) (available in select regions for IoT hubs with managed service identity).

## Device import/export job limits

Only one active device import or export job is allowed at a time for all IoT Hub tiers. IoT Hub also has limits for rate of jobs operations. To learn more, see [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md).

## Export devices

Use the **ExportDevicesAsync** method to export the entirety of an IoT hub identity registry to an Azure Storage blob container using a shared access signature (SAS). For more information about shared access signatures, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../storage/common/storage-sas-overview.md).

This method enables you to create reliable backups of your device information in a blob container that you control.

The **ExportDevicesAsync** method requires two parameters:

* A *string* that contains a URI of a blob container. This URI must contain a SAS token that grants write access to the container. The job creates a block blob in this container to store the serialized export device data. The SAS token must include these permissions:

   ```csharp
   SharedAccessBlobPermissions.Write | SharedAccessBlobPermissions.Read 
     | SharedAccessBlobPermissions.Delete
   ```

* A *boolean* that indicates if you want to exclude authentication keys from your export data. If **false**, authentication keys are included in export output. Otherwise, keys are exported as **null**.

The following C# code snippet shows how to initiate an export job that includes device authentication keys in the export data and then poll for completion:

```csharp
// Call an export job on the IoT Hub to retrieve all devices
JobProperties exportJob = 
  await registryManager.ExportDevicesAsync(containerSasUri, false);

// Wait until job is finished
while(true)
{
    exportJob = await registryManager.GetJobAsync(exportJob.JobId);
    if (exportJob.Status == JobStatus.Completed || 
        exportJob.Status == JobStatus.Failed ||
        exportJob.Status == JobStatus.Cancelled)
    {
    // Job has finished executing
    break;
    }

    await Task.Delay(TimeSpan.FromSeconds(5));
}
```

You can find similar code in the **ExportDevicesAsync** method from the SDK sample. The job stores its output in the provided blob container as a block blob with the name **devices.txt**. The output data consists of JSON serialized device data, with one device per line.

The following example shows the output data:

```json
{"id":"Device1","eTag":"MA==","status":"enabled","authentication":{"symmetricKey":{"primaryKey":"abc=","secondaryKey":"def="}}}
{"id":"Device2","eTag":"MA==","status":"enabled","authentication":{"symmetricKey":{"primaryKey":"abc=","secondaryKey":"def="}}}
{"id":"Device3","eTag":"MA==","status":"disabled","authentication":{"symmetricKey":{"primaryKey":"abc=","secondaryKey":"def="}}}
{"id":"Device4","eTag":"MA==","status":"disabled","authentication":{"symmetricKey":{"primaryKey":"abc=","secondaryKey":"def="}}}
{"id":"Device5","eTag":"MA==","status":"enabled","authentication":{"symmetricKey":{"primaryKey":"abc=","secondaryKey":"def="}}}
```

If a device has twin data, then the twin data is also exported together with the device data. The following example shows this format. All data from the "twinETag" line until the end is twin data.

```json
{
   "id":"export-6d84f075-0",
   "eTag":"MQ==",
   "status":"enabled",
   "statusReason":"firstUpdate",
   "authentication":null,
   "twinETag":"AAAAAAAAAAI=",
   "tags":{
      "Location":"LivingRoom"
   },
   "properties":{
      "desired":{
         "Thermostat":{
            "Temperature":75.1,
            "Unit":"F"
         },
         "$metadata":{
            "$lastUpdated":"2017-03-09T18:30:52.3167248Z",
            "$lastUpdatedVersion":2,
            "Thermostat":{
               "$lastUpdated":"2017-03-09T18:30:52.3167248Z",
               "$lastUpdatedVersion":2,
               "Temperature":{
                  "$lastUpdated":"2017-03-09T18:30:52.3167248Z",
                  "$lastUpdatedVersion":2
               },
               "Unit":{
                  "$lastUpdated":"2017-03-09T18:30:52.3167248Z",
                  "$lastUpdatedVersion":2
               }
            }
         },
         "$version":2
      },
      "reported":{
         "$metadata":{
            "$lastUpdated":"2017-03-09T18:30:51.1309437Z"
         },
         "$version":1
      }
   }
}
```

If you need access to this data in code, you can easily deserialize this data using the **ExportImportDevice** class. The following C# code snippet, from the **ReadFromBlobAsync** method in the SDK sample, shows how to read device information that was previously exported from **ExportImportDevice** into a **BlobClient** instance:

```csharp
private static async Task<List<string>> ReadFromBlobAsync(BlobClient blobClient)
{
    // Read the blob file of devices, import each row into a list.
    var contents = new List<string>();

    using Stream blobStream = await blobClient.OpenReadAsync();
    using var streamReader = new StreamReader(blobStream, Encoding.UTF8);
    while (streamReader.Peek() != -1)
    {
        string line = await streamReader.ReadLineAsync();
        contents.Add(line);
    }

    return contents;
}
```

## Import devices

The **ImportDevicesAsync** method in the **RegistryManager** class enables you to perform bulk import and synchronization operations in an IoT hub identity registry. Like the **ExportDevicesAsync** method, the **ImportDevicesAsync** method uses the **Job** framework.

Take care using the **ImportDevicesAsync** method because in addition to provisioning new devices in your identity registry, it can also update and delete existing devices.

> [!WARNING]
> An import operation cannot be undone. Always back up your existing data using the **ExportDevicesAsync** method to another blob container before you make bulk changes to your identity registry.

The **ImportDevicesAsync** method takes two parameters:

* A *string* that contains a URI of an [Azure Storage](../storage/index.yml) blob container to use as *input* to the job. This URI must contain a SAS token that grants read access to the container. This container must contain a blob with the name **devices.txt** that contains the serialized device data to import into your identity registry. The import data must contain device information in the same JSON format that the **ExportImportDevice** job uses when it creates a **devices.txt** blob. The SAS token must include these permissions:

   ```csharp
   SharedAccessBlobPermissions.Read
   ```

* A *string* that contains a URI of an [Azure Storage](../storage/index.yml) blob container to use as *output* from the job. The job creates a block blob in this container to store any error information from the completed import **Job**. The SAS token must include these permissions:

   ```csharp
   SharedAccessBlobPermissions.Write | SharedAccessBlobPermissions.Read 
     | SharedAccessBlobPermissions.Delete
   ```

> [!NOTE]
> The two parameters can point to the same blob container. The separate parameters simply enable more control over your data as the output container requires additional permissions.

The following C# code snippet shows how to initiate an import job:

```csharp
JobProperties importJob = 
   await registryManager.ImportDevicesAsync(containerSasUri, containerSasUri);
```

This method can also be used to import the data for the device twin. The format for the data input is the same as the format shown in the **ExportDevicesAsync** section. In this way, you can reimport the exported data. The **$metadata** is optional.

## Import behavior

You can use the **ImportDevicesAsync** method to perform the following bulk operations in your identity registry:

* Bulk registration of new devices
* Bulk deletions of existing devices
* Bulk status changes (enable or disable devices)
* Bulk assignment of new device authentication keys
* Bulk automatic regeneration of device authentication keys
* Bulk update of twin data

You can perform any combination of the preceding operations within a single **ImportDevicesAsync** call. For example, you can register new devices and delete or update existing devices at the same time. When used along with the **ExportDevicesAsync** method, you can completely migrate all your devices from one IoT hub to another.

If the import file includes twin metadata, then this metadata overwrites the existing twin metadata. If the import file doesn't include twin metadata, then only the `lastUpdateTime` metadata is updated using the current time.

Use the optional **importMode** property in the import serialization data for each device to control the import process per-device. The **importMode** property has the following options:

| importMode | Description |
| --- | --- |
| **Create** |If a device doesn't exist with the specified **ID**, it's newly registered. If the device already exists, an error is written to the log file. |
| **CreateOrUpdate** |If a device doesn't exist with the specified **ID**, it's newly registered. If the device already exists, existing information is overwritten with the provided input data without regard to the **ETag** value. |
| **CreateOrUpdateIfMatchETag** |If a device doesn't exist with the specified **ID**, it's newly registered. If the device already exists, existing information is overwritten with the provided input data only if there's an **ETag** match. If there's an **ETag** mismatch, an error is written to the log file. |
| **Delete** |If a device already exists with the specified **ID**, it's deleted without regard to the **ETag** value. If the device doesn't exist, an error is written to the log file. |
| **DeleteIfMatchETag** |If a device already exists with the specified **ID**, it's deleted only if there's an **ETag** match. If the device doesn't exist, an error is written to the log file. If there's an ETag mismatch, an error is written to the log file. |
| **Update** |If a device already exists with the specified **ID**, existing information is overwritten with the provided input data without regard to the **ETag** value. If the device doesn't exist, an error is written to the log file. |
| **UpdateIfMatchETag** |If a device already exists with the specified **ID**, existing information is overwritten with the provided input data only if there's an **ETag** match. If the device doesn't exist or there's an **ETag** mismatch, an error is written to the log file. |
| **UpdateTwin** |If a twin already exists with the specified **ID**, existing information is overwritten with the provided input data without regard to the twin's **ETag** value. |
| **UpdateTwinIfMatchETag** |If a twin already exists with the specified **ID**, existing information is overwritten with the provided input data only if there's a match on the twin's **ETag** value. The twin's **ETag** is processed independently from the device's **ETag**. If there's a mismatch with the existing twin's **ETag**, an error is written to the log file. |

> [!NOTE]
> If the serialization data doesn't explicitly define an **importMode** flag for a device, it defaults to **createOrUpdate** during the import operation.

## Import troubleshooting

Using an import job to create devices may fail with a quota issue when it's close to the device count limit of the IoT hub. This failure can happen even if the total device count is still lower than the quota limit. The **IotHubQuotaExceeded (403002)** error is returned with the following error message: "Total number of devices on IotHub exceeded the allocated quota.”

If you get this error, you can use the following query to return the total number of devices registered on your IoT hub:

```sql
SELECT COUNT() as totalNumberOfDevices FROM devices
```

For information about the total number of devices that can be registered to an IoT hub, see [IoT Hub limits](iot-hub-devguide-quotas-throttling.md#other-limits).

If there's still quota available, you can examine the job output blob for devices that failed with the **IotHubQuotaExceeded (403002)** error. You can then try adding these devices individually to the IoT hub. For example, you can use the **AddDeviceAsync** or **AddDeviceWithTwinAsync** methods. Don't try to add the devices using another job as you may likely encounter the same error.

## Import devices example – bulk device provisioning

The following C# code snippet, from the **GenerateDevicesAsync** method in the SDK sample, illustrates how to generate multiple device identities that:

* Include authentication keys.
* Write that device information to a block blob.
* Import the devices into the identity registry.

```csharp
private async Task GenerateDevicesAsync(RegistryManager registryManager, int numToAdd)
{
    var stopwatch = Stopwatch.StartNew();

    Console.WriteLine($"Creating {numToAdd} devices for the source IoT hub.");
    int interimProgressCount = 0;
    int displayProgressCount = 1000;
    int totalProgressCount = 0;

    // generate reference for list of new devices we're going to add, will write list to this blob
    BlobClient generateDevicesBlob = _blobContainerClient.GetBlobClient(_generateDevicesBlobName);

    // define serializedDevices as a generic list<string>
    var serializedDevices = new List<string>(numToAdd);

    for (int i = 1; i <= numToAdd; i++)
    {
        // Create device name with this format: Hub_00000000 + a new guid.
        // This should be large enough to display the largest number (1 million).
        string deviceName = $"Hub_{i:D8}_{Guid.NewGuid()}";
        Debug.Print($"Adding device '{deviceName}'");

        // Create a new ExportImportDevice.
        var deviceToAdd = new ExportImportDevice
        {
            Id = deviceName,
            Status = DeviceStatus.Enabled,
            Authentication = new AuthenticationMechanism
            {
                SymmetricKey = new SymmetricKey
                {
                    PrimaryKey = GenerateKey(32),
                    SecondaryKey = GenerateKey(32),
                }
            },
            // This indicates that the entry should be added as a new device.
            ImportMode = ImportMode.Create,
        };

        // Add device to the list as a serialized object.
        serializedDevices.Add(JsonConvert.SerializeObject(deviceToAdd));

        // Not real progress as you write the new devices, but will at least show *some* progress.
        interimProgressCount++;
        totalProgressCount++;
        if (interimProgressCount >= displayProgressCount)
        {
            Console.WriteLine($"Added {totalProgressCount}/{numToAdd} devices.");
            interimProgressCount = 0;
        }
    }

    // Now have a list of devices to be added, each one has been serialized.
    // Write the list to the blob.
    var sb = new StringBuilder();
    serializedDevices.ForEach(serializedDevice => sb.AppendLine(serializedDevice));

    // Write list of serialized objects to the blob.
    using Stream stream = await generateDevicesBlob.OpenWriteAsync(overwrite: true);
    byte[] bytes = Encoding.UTF8.GetBytes(sb.ToString());
    for (int i = 0; i < bytes.Length; i += BlobWriteBytes)
    {
        int length = Math.Min(bytes.Length - i, BlobWriteBytes);
        await stream.WriteAsync(bytes.AsMemory(i, length));
    }
    await stream.FlushAsync();

    Console.WriteLine("Running a registry manager job to add the devices.");

    // Should now have a file with all the new devices in it as serialized objects in blob storage.
    // generatedListBlob has the list of devices to be added as serialized objects.
    // Call import using the blob to add the new devices.
    // Log information related to the job is written to the same container.
    // This normally takes 1 minute per 100 devices (according to the docs).

    // First, initiate an import job.
    // This reads in the rows from the text file and writes them to IoT Devices.
    // If you want to add devices from a file, you can create a file and use this to import it.
    //   They have to be in the exact right format.
    try
    {
        // The first URI is the container to import from; the file defaults to devices.txt, but may be specified.
        // The second URI points to the container to write errors to as a blob.
        // This lets you import the devices from any file name. Since we wrote the new
        // devices to [devicesToAdd], need to read the list from there as well.
        var importGeneratedDevicesJob = JobProperties.CreateForImportJob(
            _containerUri,
            _containerUri,
            _generateDevicesBlobName);
        importGeneratedDevicesJob = await registryManager.ImportDevicesAsync(importGeneratedDevicesJob);
        await WaitForJobAsync(registryManager, importGeneratedDevicesJob);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Adding devices failed due to {ex.Message}");
    }

    stopwatch.Stop();
    Console.WriteLine($"GenerateDevices, time elapsed = {stopwatch.Elapsed}.");
}
```
 
## Import devices example – bulk deletion

The following C# code snippet, from the **DeleteFromHubAsync** method in the SDK sample, shows you how to delete all of the devices from an IoT hub:

```csharp
private async Task DeleteFromHubAsync(RegistryManager registryManager, bool includeConfigurations)
{
    var stopwatch = Stopwatch.StartNew();

    Console.WriteLine("Deleting all devices from an IoT hub.");

    Console.WriteLine("Exporting a list of devices from IoT hub to blob storage.");

    // Read from storage, which contains serialized objects.
    // Write each line to the serializedDevices list.
    BlobClient devicesBlobClient = _blobContainerClient.GetBlobClient(_destHubDevicesImportBlobName);

    Console.WriteLine("Reading the list of devices in from blob storage.");
    List<string> serializedDevices = await ReadFromBlobAsync(devicesBlobClient);

    // Step 1: Update each device's ImportMode to be Delete
    Console.WriteLine("Updating ImportMode to be 'Delete' for each device and writing back to the blob.");
    var sb = new StringBuilder();
    serializedDevices.ForEach(serializedEntity =>
    {
        // Deserialize back to an ExportImportDevice and change import mode.
        ExportImportDevice device = JsonConvert.DeserializeObject<ExportImportDevice>(serializedEntity);
        device.ImportMode = ImportMode.Delete;

        // Reserialize the object now that we've updated the property.
        sb.AppendLine(JsonConvert.SerializeObject(device));
    });

    // Step 2: Write the list in memory to the blob.
    BlobClient deleteDevicesBlobClient = _blobContainerClient.GetBlobClient(_hubDevicesCleanupBlobName);
    await WriteToBlobAsync(deleteDevicesBlobClient, sb.ToString());

    // Step 3: Call import using the same blob to delete all devices.
    Console.WriteLine("Running a registry manager job to delete the devices from the IoT hub.");
    var importJob = JobProperties.CreateForImportJob(
        _containerUri,
        _containerUri,
        _hubDevicesCleanupBlobName);
    importJob = await registryManager.ImportDevicesAsync(importJob);
    await WaitForJobAsync(registryManager, importJob);

    // Step 4: delete configurations
    if (includeConfigurations)
    {
        BlobClient configsBlobClient = _blobContainerClient.GetBlobClient(_srcHubConfigsExportBlobName);
        List<string> serializedConfigs = await ReadFromBlobAsync(configsBlobClient);
        foreach (string serializedConfig in serializedConfigs)
        {
            try
            {
                Configuration config = JsonConvert.DeserializeObject<Configuration>(serializedConfig);
                await registryManager.RemoveConfigurationAsync(config.Id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to deserialize or remove a config.\n\t{serializedConfig}\n\n{ex.Message}");
            }
        }
    }

    stopwatch.Stop();
    Console.WriteLine($"Deleted IoT hub devices and configs: time elapsed = {stopwatch.Elapsed}");
}
```

## Get the container SAS URI

The following code sample shows you how to generate a [SAS URI](../storage/common/storage-sas-overview.md) with read, write, and delete permissions for a blob container:

```csharp
static string GetContainerSasUri(CloudBlobContainer container)
{
  // Set the expiry time and permissions for the container.
  // In this case no start time is specified, so the
  // shared access signature becomes valid immediately.
  var sasConstraints = new SharedAccessBlobPolicy();
  sasConstraints.SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24);
  sasConstraints.Permissions = 
    SharedAccessBlobPermissions.Write | 
    SharedAccessBlobPermissions.Read | 
    SharedAccessBlobPermissions.Delete;

  // Generate the shared access signature on the container,
  // setting the constraints directly on the signature.
  string sasContainerToken = container.GetSharedAccessSignature(sasConstraints);

  // Return the URI string for the container,
  // including the SAS token.
  return container.Uri + sasContainerToken;
}
```

## Next steps

In this article, you learned how to perform bulk operations against the identity registry in an IoT hub. Many of these operations, including how to move devices from one hub to another, are used in the **Manage devices registered to the IoT hub** section of [How to manually migrate an Azure IoT hub using an Azure Resource Manager template](migrate-hub-arm.md#manage-the-devices-registered-to-the-iot-hub).
