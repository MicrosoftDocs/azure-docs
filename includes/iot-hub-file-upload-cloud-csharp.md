## Provision an Azure Storage account
Since the simulated device will upload a file in an Azure Storage blob, you must have an Azure Storage account. You can use an existing one, or follow the instructions in [About Azure Storage] to create a new one. Take note of the storage account connection string.

## Send an Azure blob URI to the simulated device

In this section, you'll modify the **SendCloudtoDevice** console app you created in [Send Cloud-to-Device messages with IoT Hub] to include an Azure blob URI with a shared access signature. This allows the cloud back end to grant write access to the blob only to the recipient of the cloud-to-device message.

1. In Visual Studio, right-click the **SendCloudtoDevice** project, and then click **Manage NuGet Packages...**. 

    This displays the Manage NuGet Packages window.

2. Search for `WindowsAzure.Storage`, click **Install**, and accept the terms of use. 

    This downloads, installs, and adds a reference to the [Microsoft Azure Storage SDK](https://www.nuget.org/packages/WindowsAzure.Storage/).

3. In the **Program.cs** file, add the following statements at the top of the file:

        using Microsoft.WindowsAzure.Storage;
        using Microsoft.WindowsAzure.Storage.Blob;

4. In the **Program** class, add the following class fields, substituting the connection string for your storage account.

        static string storageConnectionString = "{storage connection string}";

    Then add the following method (you can substitute any blob container name, this tutorial uses **iothubfileuploadtutorial**):
   
        private static async Task<string> GenerateBlobUriAsync()
        {
            var storageAccount = CloudStorageAccount.Parse(storageConnectionString);
            var blobClient = storageAccount.CreateCloudBlobClient();
            var blobContainer = blobClient.GetContainerReference("iothubfileuploadtutorial");
            await blobContainer.CreateIfNotExistsAsync();

            var blobName = String.Format("deviceUpload_{0}", Guid.NewGuid().ToString());
            CloudBlockBlob blob = blobContainer.GetBlockBlobReference(blobName);

            SharedAccessBlobPolicy sasConstraints = new SharedAccessBlobPolicy();
            sasConstraints.SharedAccessStartTime = DateTime.UtcNow.AddMinutes(-5);
            sasConstraints.SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24);
            sasConstraints.Permissions = SharedAccessBlobPermissions.Read | SharedAccessBlobPermissions.Write;
            string sasBlobToken = blob.GetSharedAccessSignature(sasConstraints);

            return blob.Uri + sasBlobToken;
        }

    This method creates a new blob reference and generates a shared access signature URI as described in [Create and use a SAS with Blob storage](../storage/storage-dotnet-shared-access-signature-part-2.md). Note that the method above generates a signature URI that is valid for 24 hours. If the target device needs more time to upload the file (e.g. it connects infrequently, it has unreliable connectivity to upload a large file), you might consider longer expiration times for the signatures.

5. Modify the **SendCloudToDeviceMessageAsync** in the following way:

        private async static Task SendCloudToDeviceMessageAsync()
        {
            var commandMessage = new Message();
            commandMessage.Properties["command"] = "FileUpload";
            commandMessage.Properties["fileUri"] = await GenerateBlobUriAsync();
            commandMessage.Ack = DeliveryAcknowledgement.Full;

            await serviceClient.SendAsync("myFirstDevice", commandMessage);
        }

    This method sends a cloud-to-device message that contains two application properties: one identifying this message as a command to upload a file, the other holding the blob URI. It also requests full delivery acknowledgments. Note that the information in the two application properties can be serialized in a message body, but that would incur additional processing to serialize and deserialize the information.

<!-- Links -->

[About Azure Storage]: ../storage/storage-create-storage-account.md#create-a-storage-account

[IoT Hub Developer Guide - C2D]: iot-hub-devguide.md#c2d
[Azure IoT - Service SDK NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.Devices/
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
[Get started with IoT Hub]: iot-hub-csharp-csharp-getstarted.md

<!-- Images -->







