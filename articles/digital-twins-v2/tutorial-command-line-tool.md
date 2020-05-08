---
# Mandatory fields.
title: Explore Azure Digital Twins with a command-line tool
titleSuffix: Azure Digital Twins
description: Tutorial that shows a command-line application to explore Azure Digital Twins SDKs in depth
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 5/8/2020
ms.topic: tutorial
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Explore Azure Digital Twins with a command-line tool

This tutorial introduces a sample application that implements a command-line tool for interacting with an Azure Digital Twins instance. You can use this tool to perform essential Azure Digital Twins actions such as uploading and listing models, creating and modifying twins and relationships or manage event routes. You can learn the Azure Digital Twins APIs by looking at the code, implementing the commands, and modifying it how you would like.

In this tutorial, you will...
* Set up an Azure Digital Twins instance
* Explore Azure Digital Twins using a command-line tool
* Explore the code behind the command-line tool and extend it

The tutorial is driven by a sample project written in C#. Get the sample project on your machine by [downloading the Azure Digital Twins samples repository as a ZIP file](https://github.com/Azure-Samples/digital-twins-samples/archive/master.zip).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

[!INCLUDE [Azure Digital Twins setup steps: instance creation and authentication](../../includes/digital-twins-setup-1.md)]

#### Register your application

[!INCLUDE [Azure Digital Twins setup steps: client app registration](../../includes/digital-twins-setup-2.md)]

[!INCLUDE [Azure Digital Twins setup steps: client app configuration](../../includes/digital-twins-setup-3.md)]

## Prerequisites

* Visual Studio 2019

## Get started with the command-line tool

In your cloned sample repo, navigate to the folder digital-twins-samples/buildingScenario/AdtSampleApp.

Open the solution file **AdtE2ESample.sln** with Visual Studio 2019.

Configure the sample application to work with the instance of Azure Digital Twins that you have previously set up. To do so:

* Copy the file serviceConfig.json.TEMPLATE to a new file called serviceConfig.json.
* Edit the newly created file. It contains a preset JSON file with three configuration variables:

```json
{
  "tenantId": "<your tenant ID here>",
  "clientId": "<your client ID here>",
  "instanceUrl": "<your instance URL here>"
}
```

Replace all three values with the values for your subscription, app registration, and Azure Digital Twins service instance.

Run the console application by pressing **F5** in Visual Studio.

When the application starts up, your default web browser will open and bring up an authentication prompt. Use this prompt to sign in to Azure.
You can then close the browser tab or window.

The command-line sample tool will show up as follows:

:::image type="content" source="media/tutorial-command-line-tool/command-line-tool-1.png" alt-text="Welcome message from the command-line tool":::

Enter `help` in the command line, and press return. You will see a list of all the possible commands:

:::image type="content" source="media/tutorial-command-line-tool/command-line-tool-2.png" alt-text="Help message from the command-line tool":::


## Use the command-line tool to explore Azure Digital Twins

In this section, yo will try out a few commands. 

### Load models

Before you can work with twins in Azure Digital Twins, you must configure your service instance with DTDL models that define your custom domain vocabulary. Let us load an example model.

In the command line, enter:
```cmd/sh
CreateModels Simple.json
```

Press return.

Generally, this command will upload one or more models to the service. In this case, it uploads a model with the ID **urn:example:Simple:1**.

>[!NOTE]
> The command names match the underlying SDK method names in the C# SDK. That should make it easy for you to find the relevant code in the source (all commands are in the file *CommandLoop.cs*).

You can check if the model successfully made it to the service using this command:

```cmd/sh
GetModels
```

:::image type="content" source="media/tutorial-command-line-tool/command-line-tool-3.png" alt-text="Output message from the GetModels command":::

Without any further options, the `GetModels` API only returns a list of model metadata. This can be useful, for example, to create UI that displays available models. To get the full model text, try:

```cmd/sh
GetModels true
```

### Create twins

Now that you have a model, you can create a twin. To do so, you'll need to specify the model ID, a unique ID for the new twin, and optionally, data to initialize properties on the twin.
The model you uploaded had the ID **urn:example:Simple:1** (you can also get it again by typing `GetModels` once more).

```cmd/sh
CreateDigitalTwin urn:example:Simple:1 twin1
```

The model "simple" has a single property named *data*, which is of type *twin*. You can set the property when creating the twin:

```cmd/sh
CreateDigitalTwin urn:example:Simple:1 twin2 data string "Hello!"
```

### Find twins

To verify that the twins have been created, you can run a query:

```cmd/sh
Query select * from digitaltwins
```

This will find all twins you currently have in your Azure Digital Twins service and list them with all their content. You might notice that there is quite a bit of extra content you have not specified yourself. The additional information is metadata about the twin that the DigitalTwins service captures and preserves for you.

```cmd/sh
{
  "$dtId": "twin2",
  "data": "Hello!",
  "$metadata": {
    "$model": "urn:example:Simple:1",
    "data": {
      "desiredValue": "Hello!",
      "desiredVersion": 1,
      "ackVersion": 1,
      "ackCode": 200,
      "ackDescription": "Auto-Sync"
    },
    "$kind": "DigitalTwin"
  }
}
```

Also note that twin2 contains a data property with the value "Hello!"

### Connect twins with relationships

The twin model "simple.json" also defines a relationship with the name "contains". Next, connect the two twins you created:

```cmd/sh
CreateEdge twin1 contains twin2 firstEdge
```

Relationships read like sentences: noun-verb-noun. A relationship is like a verb that connects a subject and an object in a sentence.

Next, verify that the relationship has been created using this command:

```cmd/sh
GetEdges twin1
```

This will list the outgoing edge from *twin1*. You can also find the incoming edges for twins. Try:

```cmd/sh
GetIncomingEdges twin2
```

That returns the perspective from "the other side".

## Modify a twin

You can also modify twin properties, using this command:

```cmd/sh
UpdateDigitalTwin twin1 add /data string Yes!
```

Run this command to verify that it worked:
```cmd/sh
GetDigitalTwin twin1
```

As you will see, the twin property data has been updated.

Note that the underlying REST API uses JSON Patch to define updates to a twin. The command-line tool reflects this format, so that you can experiment with what the underlying APIs actually expect.

### Errors

The sample application also handles errors from the service. Try to upload the same model you uploaded in the beginning again:

```cmd/sh
CreateModels Simple.json
```

As models cannot be overwritten, this will now return a service error:
```cmd/sh
Response 409: Service request failed.
Status: 409 (Conflict)

Content:
{"error":{"code":"DocumentAlreadyExists","message":"A document with same identifier already exists.","details":[]}}

Headers:
api-supported-versions: REDACTED
Date: Fri, 08 May 2020 01:53:52 GMT
Content-Length: 115
Content-Type: application/json; charset=utf-8
```

## Explore the commands and the code

From this point, feel free to experiment with the commands. You can look at the implementations of the commands, and start adding to or manipulating them howeer you would like..

* The file *Program.cs* contains the authentication logic
* The file *CommandLoop.cs* contains the bulk of the Azure Digital Twins commands

Here is an example that creates a twin:

```csharp
Dictionary<string, object> meta = new Dictionary<string, object>()
{
    { "$model", model_id},
    { "$kind", "DigitalTwin" }
};
Dictionary<string, object> twinData = new Dictionary<string, object>()
{
    { "$metadata", meta },
};
try
{
    await client.CreateDigitalTwinAsync(twin_id, 
                    JsonConvert.SerializeObject(twinData));
    Log.Ok($"Twin '{twin_id}' created successfully!");
}
catch (RequestFailedException e)
{
    Log.Error($"Error {e.Status}: {e.Message}");
}
catch (Exception ex)
{
    Log.Error($"Error: {ex}");
}
```

In the next tutorial, you will use the sample command-line tool as the centerpiece of an end to end application of Azure Digital Twins. 

## Next steps

Continue to the next tutorial to connect a sample Azure Digital Twins solution to other Azure services to complete a data-driven, end-to-end scenario: 

> [!div class="nextstepaction"]
> [Tutorial: Build an end-to-end solution](tutorial-end-to-end.md)

Next, start looking at the concept documentation to learn more about elements you worked with in the tutorial:
* [Concepts: Twin models](concepts-models.md)

Or, go more in-depth on the processes in this tutorial by starting the how-to articles:
* [How-to: Use the Azure Digital Twins CLI](how-to-use-cli.md)