## Upload a file from a simulated device

In this section, you'll modify the simulated device application you created in [Send Cloud-to-Device messages with IoT Hub] to receive cloud-to-device messages from the IoT hub.

1. In Visual Studio, right-click the **SimulatedDevice** project, and then click **Manage NuGet Packages...**. 

    This displays the Manage NuGet Packages window.

2. Search for `WindowsAzure.Storage`, click **Install**, and accept the terms of use. 

    This downloads, installs, and adds a reference to the [Microsoft Azure Storage SDK](https://www.nuget.org/packages/WindowsAzure.Storage/).

3. In the **Program.cs** file, add the following statements at the top of the file:

        using System.IO;
        using Microsoft.WindowsAzure.Storage;
        using Microsoft.WindowsAzure.Storage.Blob;

4. In the **Program** class, change the **ReceiveC2dAsync** method in the following way:
         
        private static async void ReceiveC2dAsync()
        {
            Console.WriteLine("\nReceiving cloud to device messages from service");
            while (true)
            {
                Message receivedMessage = await deviceClient.ReceiveAsync();
                if (receivedMessage == null) continue;

                if (receivedMessage.Properties.ContainsKey("command") && receivedMessage.Properties["command"] == "FileUpload")
                {
                    UploadFileToBlobAsync(receivedMessage);
                    continue;
                }

                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine("Received message: {0}", Encoding.ASCII.GetString(receivedMessage.GetBytes()));
                Console.ResetColor();
            }
        }

    This makes the **ReceiveC2dAsync** differentiate messages with the `command` property set to `FileUpload`, which will be handled by the **UploadFileToBlobAsync** method.

    Add the method below to handle the file upload commands.
   
        private static async Task UploadFileToBlobAsync(Message fileUploadCommand)
        {
            var fileUri = fileUploadCommand.Properties["fileUri"];
            var blob = new CloudBlockBlob(new Uri(fileUri));

            byte[] data = new byte[10 * 1024 * 1024];
            Random rng = new Random();
            rng.NextBytes(data);

            MemoryStream msWrite = new MemoryStream(data);
            msWrite.Position = 0;
            using (msWrite)
            {
                await blob.UploadFromStreamAsync(msWrite);
            }
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("Uploaded file to: {0}", fileUri);
            Console.ResetColor();

            await deviceClient.CompleteAsync(fileUploadCommand);
        }

    This method uses the Azure Storage SDK to upload a randomly generated 10Mb blob to the specified URI. Refer to [Azure Storage - How to use blobs] for more information on how to upload blobs.

> [AZURE.NOTE] Note how this implementation of the simulated device completes the cloud-to-device message only after the blob has been uploaded. This approach simplifies the processing of the uploaded files in the back end because the delivery acknowledgment represents the availability of the uploaded file for processing. As explained in the [IoT Hub Developer Guide][IoT Hub Developer Guide - C2D], however, a message that is not completed before the *visibility timeout* (usually 1 minute) is put back in the device queue, and the **ReceiveAsync()** method will receive it again. For scenarios where the file upload can take longer, it might be preferable for the simulated device to keep a durable store of current upload jobs. This allows the simulated device to complete the cloud-to-device message before the file upload is complete, and then send a device-to-cloud message notifying the back end of completion.

<!-- Links -->
[IoT Hub Developer Guide - C2D]: iot-hub-devguide.md#c2d
[Azure Storage - How to use blobs]: ../storage/storage-dotnet-how-to-use-blobs.md#upload-a-blob-into-a-container

<!-- Images -->





