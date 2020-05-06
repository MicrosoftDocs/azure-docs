---
# Mandatory fields.
title: Code a client app
titleSuffix: Azure Digital Twins
description: Tutorial to write the minimal code for a client app, using the C# SDK.
author: cschormann
ms.author: cschorm # Microsoft employees only
ms.date: 05/05/2020
ms.topic: tutorial
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Coding with the Azure Digital Twins APIs

This developer-focused tutorial provides an introduction to programming against the Azure Digital Twins service, using the C# service SDK. In the tutorial, you will write a minimal client application from scratch.

## Prerequisites

This tutorial uses the command line for setup and project work. Therefore, you can use any code editor to walk through the exercises.

What you need to begin:
* Any code editor
* .NET Core 3.1 on your development machine. You can download this version of the .NET Core SDK for multiple platforms from [Download .NET Core 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1).
* The Azure CLI

## Set up project

The first step is to set up a project. 

Open a command prompt or shell window on your machine, and create an empty project directory where you would like to store your work during this tutorial. Name the directory whatever you would like (for example, *DigitalTwinsCodeTutorial*).

Navigate into the new directory.

Once in the project directory, create an empty .NET console app project. In the command window, run the following command to create a minimal C# project for the console:

```bash
dotnet new console
```

Next, to use this project for developing against Azure Digital Twins, use the following commands to add two necessary dependencies:

```bash
dotnet add package Azure.IoT.DigitalTwins
dotnet add package Azure.identity
```

The first dependency is the Azure Digital Twins SDK for .Net. 
The second dependency provides tools to help with authentication against Azure.

Keep the command window open, as you'll continue to use it throughout the tutorial.

## Set up an Azure Digital Twins instance

To continue with the tutorial's development steps, you need to create an Azure Digital Twins service instance to program against. 

If you already have an Azure Digital Twins instance set up from previous work, you can use that instance, and skip to the next section.

Otherwise, you can run [this shell script](...) to run through the setup automatically. Take note of the `appId` that is printed out by the script; this is your *Application (client) ID*. Also note the `hostName`. You will use these values later.

> [!TIP]
> To see the steps for setting up an Azure Digital Twins instance in more detail, you can visit [How-to: Create an Azure Digital Twins instance](how-to-set-up-instance.md).

## Get started with project code

In this section, you will begin writing the code for your new app project to work with Azure Digital Twins. The actions convered include:
* Authenticating against the service
* Uploading a model
* Catching errors
* Creating digital twins
* Creating relationships
* Querying digital twins

To begin, open the file *Program.cs* in any code editor. You will see a minimal code template that looks like this:

```csharp
using System;

namespace FirstSteps
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
        }
    }
}
```

First, add some `using` lines at the top of the code to pull in necessary dependencies.

```csharp
using Azure.Iot.DigitalTwins;
using Azure.Identity;
```

Next, you'll add code to this file to fill out some functionality. 

### Authenticate against the service

The first thing your app will need to do is authenticate against the Azure Digital Twins service. Then, you can create a service client class to access the SDK functions.

In order to authenticate, you need three pieces of information:
* The *Directory (tenant) ID* for your subscription
* The *Application (client) ID* created when you set up the service instance earlier
* The *hostName* of your service instance

>[!TIP]
> If you don't know your *Directory (tenant) ID*, you can get it by running this command in [Azure Cloud Shell]((https://shell.azure.com)):
> 
> ```azurecli-interactive
> az account show --query tenantId
> ```

In *Program.cs*, paste the following code below the "Hello, World!" printout line. 
Set the value of `adtInstanceUrl` to your Azure Digital Twins instance *hostName*, `clientId` to your *Application ID*, and `tenantId` to your *Directory ID*.

```csharp
string clientId = "<your-application-ID>";
string tenantId = "<your-directory-ID>";
string adtInstanceUrl = "https://<your-Azure-Digital-Twins-instance-hostName>";
var credentials = new InteractiveBrowserCredential(tenantId, clientId);
DigitalTwinsClient client = new DigitalTwinsClient(new Uri(adtInstanceUrl), credentials);
Console.WriteLine($"Service client created – ready to go");
```

Save the file. 

Note that this example uses an interactive browser credential:
```csharp
var credentials = new InteractiveBrowserCredential(tenantId, clientId);
```

This type of credential will cause a browser window to open, asking you to provide your Azure credentials. 

>[!NOTE]
> For information on other types of credentials, see the documentation for the [Microsoft identity platform authentication libraries](../active-directory/develop/reference-v2-libraries.md).

In your command window, run the code with this command: 
```bash
dotnet run
```

This will restore the dependencies on first run, and then execute the program. 
* If no error occurs, the program will print *Service client created - ready to go*.
* Since there is not yet any error handling in this project, if anything goes wrong, you will see an exception thrown by the code.

### Upload a model

Azure Digital Twins service instances out of the box have no domain vocabulary. You need to upload model definitions (in form of JSON-DL DTDL, or Digital Twins Definition Language, files).

The next step is to create a model with a basic DTDL file. In the directory where you created your project, create a new *.json* file called *Simple.json*. Paste in the following file body: 

```json
{
  "@id": "urn:example:Simple:1",
  "@type": "Interface",
  "name": "Simple",
  "contents": [
    {
      "@type": "Relationship",
      "name": "contains",
      "target": "*"
    },
    {
      "@type": "Property",
      "name": "data",
      "schema": "string"
    }
  ],
  "@context": "http://azure.com/v3/contexts/Model.json"
}
```

Next, add some more code to *Program.cs* to upload the model you've just created into your Azure Digital Twins instance.

First, add a few using statements to the top of the file:

```csharp
using System.Threading.Tasks;
using System.IO;
using System.Collections.Generic;
using Azure;
using Azure.Iot.DigitalTwins.Models;
```

Next, prepare to use the asynchronous methods in the C# service SDK, by changing the `Main` method signature to allow for async execution. 

```csharp
static async Task Main(string[] args)
```

>[!NOTE]
> This is not strictly required, as the SDK also provides synchronous versions of all calls. This tutorial practices using async.

Next comes the first bit of code that interacts with the Azure Digital Twins service. You can load the DTDL file from disk and then upload it to your Azure Digital Twins service instance. 

Paste in the following code under the authorization code.
```csharp
Console.WriteLine();
Console.WriteLine($"Upload a model");
var typeList = new List<string>();
string dtdl = File.ReadAllText("Simple.json");
typeList.Add(dtdl);
// Upload the model to the service
client.CreateModelsAsync(typeList);
```

Run the program with 
```bash
dotnet run
```

Right now, there is no output for the successful call. Add some code to check if the model has actually been uploaded.

Add the following code right after the previous bit:

```csharp
// Read a list of models back from the service
AsyncPageable<ModelData> modelDataList = client.GetModelsAsync();
await foreach (ModelData md in modelDataList)
{
    Console.WriteLine($"Type name: {md.DisplayName}: {md.Id}");
}
```

Run the program with 
```bash
dotnet run
```

You will see an exception thrown. What happened?

### Catch errors

The exception happens because Azure Digital Twins will not let you upload the same model twice. Instead, the service returns a "bad request" error via the REST API. 
The Azure Digital Twins client SDK in turn will throw an exception for every service return code other than success. 

To keep the code from crashing, add an exception around the model upload code. Wrap the existing client call client.CreateModelsAsync in a try/catch handler:
```csharp
try {
    await client.CreateModelsAsync(typeList);
} catch (RequestFailedException rex) {
    Console.WriteLine($"Load model: {rex.Status}:{rex.Message}");
}
```

If you run the code now, you will see that you get an error code back:

```bash
Hello World!
Service client created - ready to go

Upload a model
Load model: 409:Service request failed.
Status: 409 (Conflict)

Content:
{"error":{"code":"DocumentAlreadyExists","message":"A document with same identifier already exists.","details":[]}}

Headers:
api-supported-versions: REDACTED
Date: Tue, 05 May 2020 01:57:51 GMT
Content-Length: 115
Content-Type: application/json; charset=utf-8

Type name: : urn:example:Simple:1
```

From this point on, the tutorial will wrap all calls to service methods in try/catch handlers.

### Create digital twins

Now that you have configured Azure Digital Twins with at least one model, you can create twin instances. This section creates a few twins using the uploaded model.

Add a new using statement at the top, as you will need the built-in .NET Json serializer in System.Text.Json:
```csharp
using System.Text.Json;
```

Then, add the following code to the end of the main method:
```csharp
// Initialize twin metadata
var meta = new Dictionary<string, object>
{
    { "$model", "urn:example:Simple:1" },
};
// Initialize the twin properties
var initData = new Dictionary<string, object>
{
    { "$metadata", meta },
    { "data", "Hello World!" }
};
string prefix="sampleTwin-";
for(int i=0; i<3; i++) {
    try {
        await client.CreateDigitalTwinAsync($"{prefix}{i}", JsonSerializer.Serialize(initData));
        Console.WriteLine($"Created twin: {prefix}{i}");
    } catch(RequestFailedException rex) {
        Console.WriteLine($"Create twin: {rex.Status}:{rex.Message}");  
    }
}
```

Run this code twice. No error is thrown when the twins are created, although the twins already exist after the first run. Why is this? Unlike model creation, twin creation is, on the REST level, a put call with upsert semantics - if the twin already exists, it will be replaced and no error is thrown.

### Create relationships

Relationships are created between twins in order to connect them into a twin graph.

Add a using statement for the edge base types in the SDK:
```csharp
using Azure.Iot.DigitalTwins.Edges;
```

Add a new static method to the Program class:
```csharp
public async static Task CreateRelationship(DigitalTwinsClient client, string srcId, string targetId)
{
    var edge = new BasicEdge
    {
        TargetId = targetId,
    };

    try
    {
        string edgeId = $"{srcId}-contains->{targetId}";
        await client.CreateEdgeAsync(srcId, "contains", edgeId, JsonSerializer.Serialize(edge));
        Console.WriteLine("Created relationship successfully");
    }
    catch (RequestFailedException rex) {
        Console.WriteLine($"Create relationship error: {rex.Status}:{rex.Message}");
    }
}
```

And add the following code to the main method:
```csharp
// Connect the twins with relationships
await CreateRelationship(client, "sampleTwin-0", "sampleTwin-1");
await CreateRelationship(client, "sampleTwin-0", "sampleTwin-2");
```

Run the program with 
```bash
dotnet run
```

### List and display twins and relationships

It would be good to see the list of relationships.

In order to do that, add the following new method to Program.cs:
```csharp
public async static Task ListRelationships(DigitalTwinsClient client, string srcId)
{
    try {
        AsyncPageable<string> results = client.GetEdgesAsync(srcId);
        Console.WriteLine($"Twin {srcId} is connected to:");
        await foreach (string rel in results)
        {
            var edge = JsonSerializer.Deserialize<BasicEdge>(rel);
            Console.WriteLine($" -{edge.Relationship}->{edge.TargetId}");
        }
    } catch (RequestFailedException rex) {
        Console.WriteLine($"Relationship retrieval error: {rex.Status}:{rex.Message}");   
    }
}
```

And the following line right before the end of the main method:
```csharp
//List the relationships
await ListRelationships(client, "sampleTwin-0");
```

Run the program with 
```bash
dotnet run
```

Note that if you run the code multiple times, you will see exceptions on edge creation, as Azure Digital Twins will not let you create an edge if one with the same ID already exists. This code catches the exceptions and ignores them. 

### Query digital twins

The final code example runs a query against Azure Digital Twins. 

Add the following code:
```csharp
// Run a query    
AsyncPageable<string> result = client.QueryAsync("Select * From DigitalTwins");
await foreach (string twin in result)
{
    object jsonObj = JsonSerializer.Deserialize<object>(twin);
    string prettyTwin = JsonSerializer.Serialize(jsonObj, new JsonSerializerOptions { WriteIndented = true });
    Console.WriteLine(prettyTwin);
    Console.WriteLine("---------------");
}
```

## Complete code example

```csharp
using System;
using Azure.Iot.DigitalTwins;
using Azure.Identity;
using System.Threading.Tasks;
using System.IO;
using System.Collections.Generic;
using Azure;
using Azure.Iot.DigitalTwins.Models;
using Azure.Iot.DigitalTwins.Edges;
using System.Text.Json;

namespace minimal
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("Hello World!");

            string clientId = Environment.GetEnvironmentVariable("AZURE_CLIENT_ID");
            string tenantId = Environment.GetEnvironmentVariable("AZURE_TENANT_ID");
            string adtInstanceUrl = Environment.GetEnvironmentVariable("ADT_SERVICE_URL");
            var credentials = new InteractiveBrowserCredential(tenantId, clientId);
            DigitalTwinsClient client = new DigitalTwinsClient(new Uri(adtInstanceUrl), credentials);
            Console.WriteLine($"Service client created – ready to go");

            Console.WriteLine();
            Console.WriteLine($"Upload a model");
            var typeList = new List<string>();
            string dtdl = File.ReadAllText("Simple.json");
            typeList.Add(dtdl);
            // Upload the model to the service
            try {
                await client.CreateModelsAsync(typeList);
            } catch (RequestFailedException rex) {
                Console.WriteLine($"Load model: {rex.Status}:{rex.Message}");
            }
            // Read a list of models back from the service
            AsyncPageable<ModelData> modelDataList = client.GetModelsAsync();
            await foreach (ModelData md in modelDataList)
            {
                Console.WriteLine($"Type name: {md.DisplayName}: {md.Id}");
            }

            // Initialize twin metadata
            var meta = new Dictionary<string, object>
            {
                { "$model", "urn:example:Simple:1" },
            };
            // Initialize the twin properties
            var initData = new Dictionary<string, object>
            {
                { "$metadata", meta },
                { "data", "Hello World!" }
            };
            string prefix="sampleTwin-";
            for(int i=0; i<3; i++) {
                try {
                    await client.CreateDigitalTwinAsync($"{prefix}{i}", JsonSerializer.Serialize(initData));
                    Console.WriteLine($"Created twin: {prefix}{i}");
                } catch(RequestFailedException rex) {
                    Console.WriteLine($"Create twin error: {rex.Status}:{rex.Message}");  
                }
            }

            // Connect the twins with relationships
            await CreateRelationship(client, "sampleTwin-0", "sampleTwin-1");
            await CreateRelationship(client, "sampleTwin-0", "sampleTwin-2");

            //List the relationships
            await ListRelationships(client, "sampleTwin-0");

            // Run a query    
            AsyncPageable<string> result = client.QueryAsync("Select * From DigitalTwins");
            await foreach (string twin in result)
            {
                object jsonObj = JsonSerializer.Deserialize<object>(twin);
                string prettyTwin = JsonSerializer.Serialize(jsonObj, new JsonSerializerOptions { WriteIndented = true });
                Console.WriteLine(prettyTwin);
                Console.WriteLine("---------------");
            }
        }

        public async static Task CreateRelationship(DigitalTwinsClient client, string srcId, string targetId)
        {
            var edge = new BasicEdge
            {
                TargetId = targetId,
            };

            try
            {
                string edgeId = $"{srcId}-contains->{targetId}";
                await client.CreateEdgeAsync(srcId, "contains", edgeId, JsonSerializer.Serialize(edge));
                Console.WriteLine("Created relationship successfully");
            }
            catch (RequestFailedException rex) {
                Console.WriteLine($"Create relationship error: {rex.Status}:{rex.Message}");
            }
        }

        public async static Task ListRelationships(DigitalTwinsClient client, string srcId)
        {
            try {
                AsyncPageable<string> results = client.GetEdgesAsync(srcId);
                Console.WriteLine($"Twin {srcId} is connected to:");
                await foreach (string rel in results)
                {
                    var edge = JsonSerializer.Deserialize<BasicEdge>(rel);
                    Console.WriteLine($" -{edge.Relationship}->{edge.TargetId}");
                }
            } catch (RequestFailedException rex) {
                Console.WriteLine($"Relationship retrieval error: {rex.Status}:{rex.Message}");   
            }
        }

    }
}
```

## Next steps

### An Exercise for the Reader

In this example, you have uploaded models, created twins, set relationships, listed relationships and run a simple query.

As an exercise for the reader, see the how-to document on patching twins [ToDo add link]. Then, add code to this tutorial sample to patch the data property on each of the twins in this simple twin graph.

### More Tutorials

To see a more complete example that demonstrates more coding patterns against the C# SDK, see... [ToDo]

To see  an end-to-end example that demonstrates how to drive Azure Digital Twins with data from IoT Hub and process the data using Azure Functions please see... [ToDo]