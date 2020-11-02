---
# Mandatory fields.
title: 'Tutorial: Code a client app'
titleSuffix: Azure Digital Twins
description: Tutorial to write the minimal code for a client app, using the .NET (C#) SDK.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 11/02/2020
ms.topic: tutorial
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Tutorial: Coding with the Azure Digital Twins APIs

It is common for developers working with Azure Digital Twins to write a client application for interacting with their instance of the Azure Digital Twins service. This developer-focused tutorial provides an introduction to programming against the Azure Digital Twins service, using the [Azure Digital Twins SDK for .NET (C#)](/dotnet/api/overview/azure/digitaltwins/client?view=azure-dotnet-preview&preserve-view=true). It walks you through writing a C# console client app step by step, starting from scratch.

> [!div class="checklist"]
> * Set up project
> * Get started with project code   
> * Complete code sample
> * Clean up resources
> * Next steps

## Prerequisites

This tutorial uses the command line for setup and project work. Therefore, you can use any code editor to walk through the exercises.

What you need to begin:
* Any code editor
* **.NET Core 3.1** on your development machine. You can download this version of the .NET Core SDK for multiple platforms from [Download .NET Core 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1).

### Prepare an Azure Digital Twins instance

[!INCLUDE [Azure Digital Twins: instance prereq](../../includes/digital-twins-prereq-instance.md)]

[!INCLUDE [Azure Digital Twins: local credentials prereq (outer)](../../includes/digital-twins-local-credentials-outer.md)]

## Set up project

Once you are ready to go with your Azure Digital Twins instance, start setting up the client app project. 

Open a command prompt or other console window on your machine, and create an empty project directory where you would like to store your work during this tutorial. Name the directory whatever you would like (for example, *DigitalTwinsCodeTutorial*).

Navigate into the new directory.

Once in the project directory, **create an empty .NET console app project**. In the command window, you can run the following command to create a minimal C# project for the console:

```cmd/sh
dotnet new console
```

This will create several files inside your directory, including one called *Program.cs* where you will write most of your code.

Keep the command window open, as you'll continue to use it throughout the tutorial.

Next, **add two dependencies to your project** that will be needed to work with Azure Digital Twins. You can use the links below to navigate to the packages on NuGet, where you can find the console commands (including for .NET CLI) to add the latest version of each to your project.
* [**Azure.DigitalTwins.Core**](https://www.nuget.org/packages/Azure.DigitalTwins.Core). This is the package for the [Azure Digital Twins SDK for .NET](/dotnet/api/overview/azure/digitaltwins/client?view=azure-dotnet-preview&preserve-view=true). 
* [**Azure.Identity**](https://www.nuget.org/packages/Azure.Identity). This library provides tools to help with authentication against Azure.

## Get started with project code

In this section, you will begin writing the code for your new app project to work with Azure Digital Twins. The actions covered include:
* Authenticating against the service
* Uploading a model
* Catching errors
* Creating digital twins
* Creating relationships
* Querying digital twins

There is also a section showing the complete code at the end of the tutorial. You can use this as a reference to check your program as you go.

To begin, open the file *Program.cs* in any code editor. You will see a minimal code template that looks like this:

```csharp
using System;

namespace DigitalTwinsCodeTutorial
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
using Azure.DigitalTwins.Core;
using Azure.Identity;
```

Next, you'll add code to this file to fill out some functionality. 

### Authenticate against the service

The first thing your app will need to do is authenticate against the Azure Digital Twins service. Then, you can create a service client class to access the SDK functions.

In order to authenticate, you need the *hostName* of your Azure Digital Twins instance.

In *Program.cs*, paste the following code below the "Hello, World!" printout line in the `Main` method. 
Set the value of `adtInstanceUrl` to your Azure Digital Twins instance *hostName*.

```csharp
string adtInstanceUrl = "https://<your-Azure-Digital-Twins-instance-hostName>"; 
var credential = new DefaultAzureCredential();
DigitalTwinsClient client = new DigitalTwinsClient(new Uri(adtInstanceUrl), credential);
Console.WriteLine($"Service client created – ready to go");
```

Save the file. 

In your command window, run the code with this command: 

```cmd/sh
dotnet run
```

This will restore the dependencies on first run, and then execute the program. 
* If no error occurs, the program will print *Service client created - ready to go*.
* Since there is not yet any error handling in this project, if there are any issues, you will see an exception thrown by the code.

### Upload a model

Azure Digital Twins has no intrinsic domain vocabulary. The types of elements in your environment that you can represent in Azure Digital Twins are defined by you, using **models**. [Models](concepts-models.md) are similar to classes in object-oriented programming languages; they provide user-defined templates for [digital twins](concepts-twins-graph.md) to follow and instantiate later. They are written in a JSON-like language called **Digital Twins Definition Language (DTDL)**.

The first step in creating an Azure Digital Twins solution is defining at least one model in a DTDL file.

In the directory where you created your project, create a new *.json* file called *SampleModel.json*. Paste in the following file body: 

```json
{
  "@id": "dtmi:example:SampleModel;1",
  "@type": "Interface",
  "displayName": "SampleModel",
  "contents": [
    {
      "@type": "Relationship",
      "name": "contains"
    },
    {
      "@type": "Property",
      "name": "data",
      "schema": "string"
    }
  ],
  "@context": "dtmi:dtdl:context;2"
}
```

> [!TIP]
> If you're using Visual Studio for this tutorial, you may want to select the newly-created JSON file and set the *Copy to Output Directory* property in the Property inspector to *Copy if Newer* or *Copy Always*. This will enable Visual Studio to find the JSON file with the default path when you run the program with **F5** during the rest of the tutorial.

> [!TIP] 
> There is a language-agnostic [DTDL Validator sample](/samples/azure-samples/dtdl-validator/dtdl-validator) that you can use to check model documents to make sure the DTDL is valid. It is built on the DTDL parser library, which you can read more about in [*How-to: Parse and validate models*](how-to-parse-models.md).

Next, add some more code to *Program.cs* to upload the model you've just created into your Azure Digital Twins instance.

First, add a few `using` statements to the top of the file:

```csharp
using System.Threading.Tasks;
using System.IO;
using System.Collections.Generic;
using Azure;
```

Next, prepare to use the asynchronous methods in the C# service SDK, by changing the `Main` method signature to allow for async execution. 

```csharp
static async Task Main(string[] args)
```

> [!NOTE]
> Using `async` is not strictly required, as the SDK also provides synchronous versions of all calls. This tutorial practices using `async`.

Next comes the first bit of code that interacts with the Azure Digital Twins service. This code loads the DTDL file you created from your disk, and then uploads it to your Azure Digital Twins service instance. 

Paste in the following code under the authorization code you added earlier.

```csharp
Console.WriteLine();
Console.WriteLine($"Upload a model");
var typeList = new List<string>();
string dtdl = File.ReadAllText("SampleModel.json");
typeList.Add(dtdl);
// Upload the model to the service
await client.CreateModelsAsync(typeList);
```

In your command window, run the program with this command: 

```cmd/sh
dotnet run
```
"Upload a model" will be printed in the output, indicating that this code was reached, but there is no output yet to indicate whether the upload was successful.

To add a print statement showing all models that have been successfully uploaded to the instance, add the following code right after the previous section:

```csharp
// Read a list of models back from the service
Console.WriteLine("Models uploaded to the instance:");
AsyncPageable<DigitalTwinsModelData> modelDataList = client.GetModelsAsync();
await foreach (DigitalTwinsModelData md in modelDataList)
{
    Console.WriteLine($"{md.Id}");
}
```

**Before you run the program again to test this new code**, recall that the last time you ran the program, you uploaded your model already. Azure Digital Twins will not let you upload the same model twice, so if you attempt to upload the same model again, the program should throw an exception.

With this in mind, run the program again with this command in your command window:

```cmd/sh
dotnet run
```

The program should throw an exception. When you attempt to upload a model that has been uploaded already, the service returns a "bad request" error via the REST API. As a result, the Azure Digital Twins client SDK will in turn throw an exception, for every service return code other than success. 

The next section talks about exceptions like this and how to handle them in your code.

### Catch errors

To keep the program from crashing, you can add exception code around the model upload code. Wrap the existing client call `await client.CreateModelsAsync(typeList)` in a try/catch handler, like this:

```csharp
try {
    await client.CreateModelsAsync(typeList);
} catch (RequestFailedException rex) {
    Console.WriteLine($"Load model: {rex.Status}:{rex.Message}");
}
```

Now, if you run the program with `dotnet run` in your command window now, you will see that you get an error code back. The output from the model creation code shows this error:

:::image type="content" source= "media/tutorial-code/model-error.png" alt-text="Program output, showing a message that says '409:Service request failed. Status: 409 (Conflict). Content:{"error":{"code":"ModelIdAlreadyExists","message":"Some of the model ids already exist: dtmi:example:SampleModel;1. Use Model_List API to view models that already exist. See the Swagger example (http://aka.ms/ModelListSwSmpl)."}}'":::

From this point forward, the tutorial will wrap all calls to service methods in try/catch handlers.

### Create digital twins

Now that you have uploaded a model to Azure Digital Twins, you can use this model definition to create **digital twins**. [Digital twins](concepts-twins-graph.md) are instances of a model, and represent the entities within your business environment—things like sensors on a farm, rooms in a building, or lights in a car. This section creates a few digital twins based on the model you uploaded earlier.

Add the following code to the end of the `Main` method to create and initialize three digital twins based on this model.

```csharp
// Initialize twin data
BasicDigitalTwin twinData = new BasicDigitalTwin();
twinData.Metadata.ModelId = "dtmi:example:SampleModel;1";
twinData.Contents.Add("data", $"Hello World!");

string prefix="sampleTwin-";
for(int i=0; i<3; i++) {
    try {
        twinData.Id = $"{prefix}{i}";
        await client.CreateOrReplaceDigitalTwinAsync<BasicDigitalTwin>(twinData.Id, twinData);
        Console.WriteLine($"Created twin: {prefix}{i}");
    } catch(RequestFailedException rex) {
        Console.WriteLine($"Create twin error: {rex.Status}:{rex.Message}");  
    }
}
```

In your command window, run the program with `dotnet run`. In the output, look for the print messages that *sampleTwin-0*, *sampleTwin-1*, and *sampleTwin-2* were created. 

Then, run the program again. 

Notice that no error is thrown when the twins are created the second time, even though the twins already exist after the first run. Unlike model creation, twin creation is, on the REST level, a *PUT* call with *upsert* semantics. This means that if a twin already exists, an attempt to create the same twin again will just replace the original twin. No error is thrown.

### Create relationships

Next, you can create **relationships** between the twins you've created, to connect them into a **twin graph**. [Twin graphs](concepts-twins-graph.md) are used to represent your entire environment.

Add a **new static method** to the `Program` class, underneath the `Main` method (the code now has two methods):

```csharp
public async static Task CreateRelationship(DigitalTwinsClient client, string srcId, string targetId)
{
    var relationship = new BasicRelationship
    {
        TargetId = targetId,
        Name = "contains"
    };

    try
    {
        string relId = $"{srcId}-contains->{targetId}";
        await client.CreateOrReplaceRelationshipAsync(srcId, relId, relationship);
        Console.WriteLine("Created relationship successfully");
    }
    catch (RequestFailedException rex) {
        Console.WriteLine($"Create relationship error: {rex.Status}:{rex.Message}");
    }
}
```

Next, add the following code to the end of the `Main` method, to call the `CreateRelationship` method and use the code you just wrote:

```csharp
// Connect the twins with relationships
await CreateRelationship(client, "sampleTwin-0", "sampleTwin-1");
await CreateRelationship(client, "sampleTwin-0", "sampleTwin-2");
```

In your command window, run the program with `dotnet run`. In the output, look for print statements saying that the two relationships were created successfully.

Note that Azure Digital Twins will not let you create a relationship if another relationship with the same ID already exists—so if you run the program multiple times, you will see exceptions on relationship creation. This code catches the exceptions and ignores them. 

### List relationships

The next code you'll add allows you to see the list of relationships you've created.

Add the following **new method** to the `Program` class:

```csharp
public async static Task ListRelationships(DigitalTwinsClient client, string srcId)
{
    try {
        AsyncPageable<BasicRelationship> results = client.GetRelationshipsAsync<BasicRelationship>(srcId);
        Console.WriteLine($"Twin {srcId} is connected to:");
        await foreach (BasicRelationship rel in results)
        {
            Console.WriteLine($" -{rel.Name}->{rel.TargetId}");
        }
    } catch (RequestFailedException rex) {
        Console.WriteLine($"Relationship retrieval error: {rex.Status}:{rex.Message}");   
    }
}
```

Then, add the following code to the end of the `Main` method to call the `ListRelationships` code:

```csharp
//List the relationships
await ListRelationships(client, "sampleTwin-0");
```

In your command window, run the program with `dotnet run`. You should see a list of all the relationships you have created in an output statement that looks like this:

:::image type="content" source= "media/tutorial-code/list-relationships.png" alt-text="Program output, showing a message that says 'Twin sampleTwin-0 is connected to: contains->sampleTwin-1, -contains->sampleTwin-2'":::

### Query digital twins

A main feature of Azure Digital Twins is the ability to [query](concepts-query-language.md) your twin graph easily and efficiently to answer questions about your environment.

The last section of code to add in this tutorial runs a query against the Azure Digital Twins instance. The query used in this example returns all the digital twins in the instance.

Add this `using` statement to enable use of the `JsonSerializer` class to help present the digital twin information:

```csharp
using System.Text.Json;
```

Then, add the following code to the end of the `Main` method:

```csharp
// Run a query for all twins   
string query = "SELECT * FROM digitaltwins";
AsyncPageable<BasicDigitalTwin> result = client.QueryAsync<BasicDigitalTwin>(query);

await foreach (BasicDigitalTwin twin in result)
{
    Console.WriteLine(JsonSerializer.Serialize(twin));
    Console.WriteLine("---------------");
}
```

In your command window, run the program with `dotnet run`. You should see all the digital twins in this instance in the output.

## Complete code example

At this point in the tutorial, you have a complete client app, capable of performing basic actions against Azure Digital Twins. For reference, the full code of the program in *Program.cs* is listed below:

```csharp
using System;
using Azure.DigitalTwins.Core;
using Azure.Identity;
using System.Threading.Tasks;
using System.IO;
using System.Collections.Generic;
using Azure;
using System.Text.Json;

namespace minimal
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            
            string adtInstanceUrl = "https://<your-Azure-Digital-Twins-instance-hostName>"; 
            
            var credential = new DefaultAzureCredential();
            DigitalTwinsClient client = new DigitalTwinsClient(new Uri(adtInstanceUrl), credential);
            Console.WriteLine($"Service client created – ready to go");

            Console.WriteLine();
            Console.WriteLine($"Upload a model");
            var typeList = new List<string>();
            string dtdl = File.ReadAllText("SampleModel.json");
            typeList.Add(dtdl);

            // Upload the model to the service
            try {
                await client.CreateModelsAsync(typeList);
            } catch (RequestFailedException rex) {
                Console.WriteLine($"Load model: {rex.Status}:{rex.Message}");
            }
            // Read a list of models back from the service
            Console.WriteLine("Models uploaded to the instance:");
            AsyncPageable<DigitalTwinsModelData> modelDataList = client.GetModelsAsync();
            await foreach (DigitalTwinsModelData md in modelDataList)
            {
                Console.WriteLine($"{md.Id}");
            }

            // Initialize twin data
            BasicDigitalTwin twinData = new BasicDigitalTwin();
            twinData.Metadata.ModelId = "dtmi:example:SampleModel;1";
            twinData.Contents.Add("data", $"Hello World!");
            
            string prefix="sampleTwin-";
            for(int i=0; i<3; i++) {
                try {
                    twinData.Id = $"{prefix}{i}";
                    await client.CreateOrReplaceDigitalTwinAsync<BasicDigitalTwin>(twinData.Id, twinData);
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

            // Run a query for all twins   
            string query = "SELECT * FROM digitaltwins";
            AsyncPageable<BasicDigitalTwin> result = client.QueryAsync<BasicDigitalTwin>(query);
            
            await foreach (BasicDigitalTwin twin in result)
            {
                Console.WriteLine(JsonSerializer.Serialize(twin));
                Console.WriteLine("---------------");
            }
        }

        public async static Task CreateRelationship(DigitalTwinsClient client, string srcId, string targetId)
        {
            var relationship = new BasicRelationship
            {
                TargetId = targetId,
                Name = "contains"
            };
        
            try
            {
                string relId = $"{srcId}-contains->{targetId}";
                await client.CreateOrReplaceRelationshipAsync(srcId, relId, relationship);
                Console.WriteLine("Created relationship successfully");
            }
            catch (RequestFailedException rex) {
                Console.WriteLine($"Create relationship error: {rex.Status}:{rex.Message}");
            }
        }
        
        public async static Task ListRelationships(DigitalTwinsClient client, string srcId)
        {
            try {
                AsyncPageable<BasicRelationship> results = client.GetRelationshipsAsync<BasicRelationship>(srcId);
                Console.WriteLine($"Twin {srcId} is connected to:");
                await foreach (BasicRelationship rel in results)
                {
                    Console.WriteLine($" -{rel.Name}->{rel.TargetId}");
                }
            } catch (RequestFailedException rex) {
                Console.WriteLine($"Relationship retrieval error: {rex.Status}:{rex.Message}");   
            }
        }

    }
}
```
## Clean up resources
 
The instance used in this tutorial can be reused in the next tutorial, [*Tutorial: Explore the basics with a sample client app*](tutorial-command-line-app.md). If you plan to continue to the next tutorial, you can keep the Azure Digital Twins instance you set up here.
 
[!INCLUDE [digital-twins-cleanup-basic.md](../../includes/digital-twins-cleanup-basic.md)]

Finally, delete the project folder you created on your local machine.

## Next steps

In this tutorial, you created a .NET console client application from scratch. You wrote code for this client app to perform the basic actions on an Azure Digital Twins instance.

Continue to the next tutorial to explore the things you can do with such a sample client app: 

> [!div class="nextstepaction"]
> [*Tutorial: Explore the basics with a sample client app*](tutorial-command-line-app.md)
