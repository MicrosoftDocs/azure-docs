## Upload a file from a simulated device

In this section, you'll modify the simulated device application you created in [Send Cloud-to-Device messages with IoT Hub] to receive cloud-to-device messages from the IoT hub.

1. In Visual Studio, right-click the **SimulatedDevice** project, click **Add**, and then click **Existing Item...**. Navigate to an image file and include it in your project. This tutorial assumes the image is named `image.jpg`.

2. Right-click on the image, and then click **Properties**. Make sure that **Copy to Output Directory** is set to **Copy always**.

    ![][1]

3. In the **Program.cs** file, add the following statements at the top of the file:

        using System.IO;

4. Add the following method to the **Program** class:
         
        private static async void SendToBlobAsync()
        {
            const string FilePath = "image.jpg";
            var fileStreamSource = new FileStream(FilePath, FileMode.Open);
            var fileName = Path.GetFileName(fileStreamSource.Name);

            Console.WriteLine("Uploading file: {0}", fileName);
            var watch = System.Diagnostics.Stopwatch.StartNew();
            await deviceClient.UploadToBlobAsync(fileName, fileStreamSource);
            watch.Stop();

            Console.WriteLine("Time to upload file: {0}ms\n", watch.ElapsedMilliseconds);
        }

    The `UploadToBlobAsync` method takes in the file name and stream source of the file to be uploaded and handles the upload to storage. The console application displays the time it takes to upload the file.

5. Add the following method in the **Main** method, right before the `Console.ReadLine()` line:
        SendToBlobAsync();

> [AZURE.NOTE] For simplicity's sake, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as exponential backoff), as suggested in the MSDN article [Transient Fault Handling].

<!-- Links -->
[IoT Hub Developer Guide - C2D]: iot-hub-devguide.md#c2d
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx

<!-- Images -->
[1]: ././media/iot-hub-csharp-csharp-file-upload/image-properties.png
