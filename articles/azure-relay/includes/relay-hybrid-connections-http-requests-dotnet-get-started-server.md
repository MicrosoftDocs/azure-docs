---
title: include file
description: include file
services: service-bus-relay
author: clemensv
ms.service: service-bus-relay
ms.topic: include
ms.date: 08/10/2023
ms.author: clemensv
ms.custom: include file

---

### Create a console application

In Visual Studio, create a new **Console App (.NET Framework)** project.

### Add the Relay NuGet package

1. Right-click the newly created project, and then select **Manage NuGet Packages**.
2. Select **Browse**, and then search for **Microsoft.Azure.Relay**. In the search results, select  **Microsoft Azure Relay**.
3. Select **Install** to complete the installation. Close the dialog box.

### Write code to receive messages

1. At the top of the Program.cs file, replace the existing `using` statements with the following `using` statements:
   
    ```csharp
    using System;
    using System.IO;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Azure.Relay;
    using System.Net;
    ```
2. Add constants to the `Program` class for the hybrid connection details. Replace the placeholders in brackets with the values that you obtained when you created the hybrid connection. Be sure to use the fully qualified namespace name.
   
    ```csharp
    // replace {RelayNamespace} with the name of your namespace
    private const string RelayNamespace = "{RelayNamespace}.servicebus.windows.net";

    // replace {HybridConnectionName} with the name of your hybrid connection
    private const string ConnectionName = "{HybridConnectionName}";

    // replace {SAKKeyName} with the name of your Shared Access Policies key, which is RootManageSharedAccessKey by default
    private const string KeyName = "{SASKeyName}";

    // replace {SASKey} with the primary key of the namespace you saved earlier
    private const string Key = "{SASKey}";
    ```

3. Add the `RunAsync` method to the `Program` class:
   
    ```csharp
    private static async Task RunAsync()
    {
        var cts = new CancellationTokenSource();
   
        var tokenProvider = TokenProvider.CreateSharedAccessSignatureTokenProvider(KeyName, Key);
        var listener = new HybridConnectionListener(new Uri(string.Format("sb://{0}/{1}", RelayNamespace, ConnectionName)), tokenProvider);
   
        // Subscribe to the status events.
        listener.Connecting += (o, e) => { Console.WriteLine("Connecting"); };
        listener.Offline += (o, e) => { Console.WriteLine("Offline"); };
        listener.Online += (o, e) => { Console.WriteLine("Online"); };

        // Provide an HTTP request handler
        listener.RequestHandler = (context) =>
        {
            // Do something with context.Request.Url, HttpMethod, Headers, InputStream...
            context.Response.StatusCode = HttpStatusCode.OK;
            context.Response.StatusDescription = "OK, This is pretty neat";
            using (var sw = new StreamWriter(context.Response.OutputStream))
            {
                sw.WriteLine("hello!");
            }
            
            // The context MUST be closed here
            context.Response.Close();
        };
            
        // Opening the listener establishes the control channel to
        // the Azure Relay service. The control channel is continuously 
        // maintained, and is reestablished when connectivity is disrupted.
        await listener.OpenAsync();
        Console.WriteLine("Server listening");
    
        // Start a new thread that will continuously read the console.
        await Console.In.ReadLineAsync();
        
        // Close the listener after you exit the processing loop.
        await listener.CloseAsync();
    }
    ```
5. Add the following line of code to the `Main` method in the `Program` class:
   
    ```csharp
    RunAsync().GetAwaiter().GetResult();
    ```
   
    The completed Program.cs file should look like this:
   
    ```csharp
    namespace Server
    {
        using System;
        using System.IO;
        using System.Threading;
        using System.Threading.Tasks;
        using Microsoft.Azure.Relay;
   
        public class Program
        {
            private const string RelayNamespace = "{RelayNamespace}.servicebus.windows.net";
            private const string ConnectionName = "{HybridConnectionName}";
            private const string KeyName = "{SASKeyName}";
            private const string Key = "{SASKey}";
   
            public static void Main(string[] args)
            {
                RunAsync().GetAwaiter().GetResult();
            }
   
            private static async Task RunAsync()
            {
                var tokenProvider = TokenProvider.CreateSharedAccessSignatureTokenProvider(KeyName, Key);
                var listener = new HybridConnectionListener(new Uri(string.Format("sb://{0}/{1}", RelayNamespace, ConnectionName)), tokenProvider);
           
                // Subscribe to the status events.
                listener.Connecting += (o, e) => { Console.WriteLine("Connecting"); };
                listener.Offline += (o, e) => { Console.WriteLine("Offline"); };
                listener.Online += (o, e) => { Console.WriteLine("Online"); };
        
                // Provide an HTTP request handler
                listener.RequestHandler = (context) =>
                {
                    // Do something with context.Request.Url, HttpMethod, Headers, InputStream...
                    context.Response.StatusCode = HttpStatusCode.OK;
                    context.Response.StatusDescription = "OK";
                    using (var sw = new StreamWriter(context.Response.OutputStream))
                    {
                        sw.WriteLine("hello!");
                    }
                    
                    // The context MUST be closed here
                    context.Response.Close();
                };
           
                // Opening the listener establishes the control channel to
                // the Azure Relay service. The control channel is continuously 
                // maintained, and is reestablished when connectivity is disrupted.
                await listener.OpenAsync();
                Console.WriteLine("Server listening");
           
                // Start a new thread that will continuously read the console.
                await Console.In.ReadLineAsync();
               
                // Close the listener after you exit the processing loop.
                await listener.CloseAsync();
            }
        }
    }
    ```

