## Receive a file upload notification

In this section, you write a Windows console app that receives file upload notification messages from IoT Hub.

1. In the current Visual Studio solution, create a new Visual C# Windows project by using the **Console Application** project template. Name the project **ReadFileUploadNotification**.

    ![New project in Visual Studio][2]

2. In Solution Explorer, right-click the **ReadFileUploadNotification** project, and then click **Manage NuGet Packages**.

    This displays the Manage NuGet Packages window.

2. Search for `Microsoft.Azure.Devices`, click **Install**, and accept the terms of use. 

	This downloads, installs, and adds a reference to the [Azure IoT - Service SDK NuGet package] in the **ReadFileUploadNotification** project.

3. In the **Program.cs** file, add the following statements at the top of the file:

        using Microsoft.Azure.Devices;

4. Add the following fields to the **Program** class. Substitute the placeholder value with the IoT hub connection string from [Get started with IoT Hub]:

		static ServiceClient serviceClient;
        static string connectionString = "{iot hub connection string}";
        
5. Add the following method to the **Program** class:
   
        private async static Task ReceiveFileUploadNotificationAsync()
        {
            var notificationReceiver = serviceClient.GetFileNotificationReceiver();

            Console.WriteLine("\nReceiving file upload notification from service");
            while (true)
            {
                var fileUploadNotification = await notificationReceiver.ReceiveAsync();
                if (fileUploadNotification == null) continue;

                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine("Received file upload noticiation: {0}", string.Join(", ", fileUploadNotification.BlobName));
                Console.ResetColor();

                await notificationReceiver.CompleteAsync(fileUploadNotification);
            }
        }

    Note that the receive pattern is the same one used to receive cloud-to-device messages from the device app.

6. Finally, add the following lines to the **Main** method:

        Console.WriteLine("Receive file upload notifications\n");
        serviceClient = ServiceClient.CreateFromConnectionString(connectionString);
        ReceiveFileUploadNotificationAsync().Wait();
        Console.ReadLine();

<!-- Links -->

[IoT Hub Developer Guide - C2D]: ../articles/iot-hub/iot-hub-devguide.md#c2d
[Azure IoT - Service SDK NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.Devices/
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
[Get started with IoT Hub]: ../articles/iot-hub/iot-hub-csharp-csharp-getstarted.md

<!-- Images -->
[2]: ./media/iot-hub-c2d-cloud-csharp/create-identity-csharp1.png
