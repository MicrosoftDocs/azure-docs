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

## Preparation

Let's first setup a project. Open a command prompt or shell window and create an empty directory, for example called "firstSteps" at a convenient location.
Then change directory into the newly created location.

Next, let's create an empty .NET console app project. In a command prompt or shell window, type:
```bash
dotnet new console
```

This will create a minimal C# project. To develop against Azure Digital Twins, we need to add two dependencies to the project:

```bash
dotnet add package Azure.IoT.DigitalTwins
dotnet add package Azure.identity
```

The first is the Azure Digital Twins SDK for .Net. The second dependency provides tools that make authentication against Azure a lot more comfortable.

## Set up an Azure Digital Twins instance

Before you can follow the development steps in this tutorial, you will have to create an Azure Digital Twins service instance. For this tutorial, there are two options to do so:
* You can follow the manual steps described in this how-to document [point to how-to]. 
* You can run a shell script that handles the basic setup automatically. 

ToDo - Need to figure out how to get the script. FOr this exercise, my preference would be to just have a script that is short enough to fit in right here:
```bash
***
*** In an ideal world, we would be able 
*** to have the setups script included right here *** ready for a simple cut and past step. 
*** The script needs to:
- Register the resource provider
- Create an app registration
- Create a resource group
- Create the service instance 
- Add permissions for Azure Digital Twins
- Set environment variables 
***
```

## Get started with coding against Azure Digital Twins

To begin, open the file Program.cs in any code editor. You will see a minimal code template:

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

Over the course of this tutorial, we will add code that illustrates some of the basic techniques of programming against Azure Digital Twins. 

### Authenticate against the service

First, let's add som "using" lines at the top of the code.

```csharp
using Azure.Iot.DigitalTwins;
using Azure.Identity;
```

Before we do anything else, we need to be able to create a service client class to access the SDK functions. To do so, we need to be able to9 authenticate against the service. 

To do so, we need three pieces of information:
* The tenant id for your subscription
* The client id (or app registration) created when you set up the service instance. It would have been printed out by the script if you used it.
* The access URL of your service instance.

The following code sample assumes that you wrote these three values into environment variables for future convenience. You can also copy them directly into the variable declarations below for the clientId, tenantId and adtInstanceUrl variables.

Paste the following code below the "Hello, World!" printout line in Program.cs.

```csharp
string clientId = Environment.GetEnvironmentVariable("AZURE_CLIENT_ID");
string tenantId = Environment.GetEnvironmentVariable("AZURE_TENANT_ID");
string adtInstanceUrl = Environment.GetEnvironmentVariable("ADT_SERVICE_URL");
var credentials = new InteractiveBrowserCredential(tenantId, clientId);
DigitalTwinsClient client = new DigitalTwinsClient(new Uri(adtInstanceUrl), credentials);
Console.WriteLine($"Service client created – ready to go");
```

Run the code by typing: 
```bash
dotnet run
```

This will restore the dependencies on first run, and then execute the program. If no error occurs, the program will print "Service client created - ready to go".
In this simple example, we have not added any error handling. If anything is going wrong, you will see an exception thrown by the code.

Note that this example uses an interactive browser credential:
```csharp
var credentials = new InteractiveBrowserCredential(tenantId, clientId);
```

This will cause a browser to open, asking you to provide your Azure credentials. If you need other types of credentials, see the documentation for the Azure identity library for more information (ToDo - add link) 

### Upload a model

Azure Digital Twins service instances out of the box have no domain vocabulary. You need to upload model definitions (in form of JSON-DL DTDL, or Digital Twins Definition Language, files).

Let's create a simple DTDL file. In the directory where you created your project, create a json file "Simple.json" and paste in the following content. 

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

Next, add a few using statements.
```csharp
using System.Threading.Tasks;
using System.IO;
using System.Collections.Generic;
using Azure;
using Azure.Iot.DigitalTwins.Models;
```

As we are going to use async methods on the service SDK, change the main method signature to allow us to allow for async execution. This is not strictly required as the SDK also provides synchronous versions of all calls, but it is good to practice.
```csharp
static async Task Main(string[] args)
```

Finally, our first bit of real Azure Digital Twins code. We will load the DTDL file from disk and then upload it to your Azure Digital Twins service instance. 

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

There is no output for the successful call. That isn ot very satisfying. So, let's add some code to check if the model has actually been uploaded.

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

To keep our code from crashing, let's add an exception around the model upload code. Wrap the existing client call client.CreateModelsAsync in a try/catch handler:
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

From now on, we will wrap all calls to service methods in try/catch handlers.

### Create digital twins

Now that we have configured Azure Digital Twins with at least one model, we can create twin instances. Let's quickly create a few twins using the uploaded model.

Add a new using statement at the top, as we will need the built-in .NET Json serializer in System.Text.Json:
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

What would a twins graph be without relationships? Let's connect some twins into a graph.

Add a using statement for the edge base types in the SDK:
```csharp
using Azure.Iot.DigitalTwins.Edges;
```

Let's add a new static method to the Program class:
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

Let's do that. Add the following new method to Program.cs:
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

Note that if you run the code multiple times, you will see exceptions on edge creation, as Azure Digital Twins will not let you create an edge if one with the same id already exists. We are catching the exceptions and ignoring them in the code. 

### Query digital twins

Finally, one last example. Let's run a query against Azure Digital Twins. 

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

In this example, we have uploaded models, created twins, set relationships, listed relationships and ran a simple query.

As an exercise for the reader, see the how-to document on patching twins [ToDo add link]. Then, add code to this tutorial sample to patch the data property on each of the twins in this simple twin graph.

### More Tutorials

To see a more complete example that demonstrates more coding patterns against the C# SDK, see... [ToDo]

To see  an end-to-end example that demonstrates how to drive Azure Digital Twins with data from IoT Hub and process the data using Azure Functions please see... [ToDo]