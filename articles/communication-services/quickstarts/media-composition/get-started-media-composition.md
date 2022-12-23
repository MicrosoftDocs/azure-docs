---
title: Azure Communication Services Quickstart - Create and manage a media composition
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to create a media composition within your Azure Communication Services resource.
services: azure-communication-services
author: peiliu
manager: alexokun

ms.author: peiliu
ms.date: 12/06/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: mode-other
---
# Quickstart: Create and manage a media composition resource

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

Get started with Azure Communication Services by using the Communication Services C# Media Composition SDK to compose and stream videos.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- The latest version of [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../create-communication-resource.md).

### Prerequisite check

- In a terminal or command window, run the `dotnet` command to check that the .NET SDK is installed.

## Set up the application environment

To set up an environment for using media composition, take the steps in the following sections.

### Create a new C# application

1. In a console window, such as cmd, PowerShell, or Bash, use the `dotnet new` command to create a new console app with the name `MediaCompositionQuickstart`. This command creates a simple "Hello World" C# project with a single source file, **Program.cs**.

   ```console
   dotnet new console -o MediaCompositionQuickstart
   ```

1. Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

   ```console
   cd MediaCompositionQuickstart
   dotnet build
   ```

### Install the package

1. While still in the application directory, install the Azure Communication Services MediaComposition SDK for .NET package by using the following command.

   ```console
   dotnet add package Azure.Communication.MediaCompositionQuickstart --version 1.0.0-beta.1
   ```

1. Add a `using` directive to the top of **Program.cs** to include the `Azure.Communication` namespace.

   ```csharp
   using System;
   using System.Collections.Generic;

   using Azure;
   using Azure.Communication;
   using Azure.Communication.MediaComposition;
   ```

## Authenticate the media composition client

Open **Program.cs** in a text editor and replace the body of the `Main` method with code to initialize a `MediaCompositionClient` with your connection string. The `MediaCompositionClient` will be used to create and manage media composition objects.

 You can find your Communication Services resource connection string in the Azure portal. For more information on connection strings, see [this page](../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).


```csharp
// Find your Communication Services resource in the Azure portal
var connectionString = "<connection_string>";
var mediaCompositionClient = new MediaCompositionClient(connectionString);
```

## Create a media composition

Create a new media composition by defining the `inputs`, `layout`, `outputs`, and a user-friendly `mediaCompositionId`. For more information on how to define the values, see [this page](./define-media-composition.md). These values are passed into the `CreateAsync` function exposed on the client. The code snippet below shows and example of defining a simple two by two grid layout:

```csharp
var layout = new GridLayout(
    rows: 2,
    columns: 2,
    inputIds: new List<List<string>>
    {
        new List<string> { "Jill", "Jack" }, new List<string> { "Jane", "Jerry" }
    })
    {
        Resolution = new(1920, 1080)
    };

var inputs = new Dictionary<string, MediaInput>()
{
    ["Jill"] = new ParticipantInput
    (
        id: new CommunicationUserIdentifier("8:acs:5110fbea-014a-45aa-a839-d6dc967b4175_00000080-fa91-402b-a3a5-42d74e113351"),
        call: "meeting")
    ,
    ["Jack"] = new ParticipantInput
    (
        id: new CommunicationUserIdentifier("8:acs:5110fbea-014a-45aa-a839-d6dc967b4175_00000090-20e2-430d-9c34-0e4b72c98636"),
        call: "meeting")
    ,
    ["Jane"] = new ParticipantInput
    (
        id: new CommunicationUserIdentifier("8:acs:5110fbea-014a-45aa-a839-d6dc967b4175_00000030-45lk-9dp0-04c8-3ed0023d0ds"),
        call: "meeting"
    ),
    ["Jerry"] = new ParticipantInput
    (
        id: new CommunicationUserIdentifier("8:acs:5110fbea-014a-45aa-a839-d6dc967b4175_00000080-09ce-4ac2-8dbf-00533d606db8"),
        call: "meeting"
    ),
    ["meeting"] = new GroupCallInput("d12d2277-ffec-4e22-9979-8c0d8c13d193")
};

var outputs = new Dictionary<string, MediaOutput>()
{
    ["acsGroupCall"] = new GroupCallOutput("d12d2277-ffec-4e22-9979-8c0d8c13d193")
};

var mediaCompositionId = "twoByTwoGridLayout"
var response = await mediaCompositionClient.CreateAsync(mediaCompositionId, layout, inputs, outputs);
```

You can use the `mediaCompositionId` to view or update the properties of a media composition object. Therefore, it is important to keep track of and persist the `mediaCompositionId` in your storage medium of choice.

## Get properties of an existing media composition

Retrieve the details of an existing media composition by referencing the `mediaCompositionId`.

```C# Snippet:GetMediaComposition
var gridMediaComposition = await mediaCompositionClient.GetAsync(mediaCompositionId);
```

## Updates

Updating the `layout` of a media composition can happen on-the-fly as the media composition is running. However, `input` updates while the media composition is running are not supported. The media composition will need to be stopped and restarted before any changes to the inputs are applied.

### Update layout

Updating the `layout` can be issued by passing in the new `layout` object and the `mediaCompositionId`. For example, we can update the grid layout to an auto-grid layout following the snippet below:

```csharp
var layout = new AutoGridLayout(new List<string>() { "meeting" })
{
    Resolution = new(720, 480),
};

var response = await mediaCompositionClient.UpdateLayoutAsync(mediaCompositionId, layout);
```

### Upsert or remove inputs

To upsert inputs from the media composition object, use the `UpsertInputsAsync` function exposed in the client. Note that multi-source inputs such as group call or rooms cannot be upserted or removed when the media composition is running.

```csharp
var inputsToUpsert = new Dictionary<string, MediaInput>()
{
    ["James"] = new ParticipantInput
    (
        id: new CommunicationUserIdentifier("8:acs:5110fbea-014a-45aa-a839-d6dc967b4175_00000030-91cc-4b24-9ae2-505161ad3ca7"),
        call: "meeting"
    ),
};

var response = await mediaCompositionClient.UpsertInputsAsync(mediaCompositionId, inputsToUpsert);
```

You can also explicitly remove inputs from the list.
```csharp
var inputIdsToRemove = new List<string>()
{
    "Jane", "Jerry"
};
var response = await mediaCompositionClient.RemoveInputsAsync(mediaCompositionId, inputIdsToRemove);
```

### Upsert or remove outputs

To upsert outputs, you can use the `UpsertOutputsAsync` function from the client. Note that outputs cannot be upserted or removed when the media composition is running.

```csharp
var outputsToUpsert = new Dictionary<string, MediaOutput>()
{
    ["youtube"] = new RtmpOutput("key", new(1920, 1080), "rtmp://a.rtmp.youtube.com/live2")
};

var response = await mediaCompositionClient.UpsertOutputsAsync(mediaCompositionId, outputsToUpsert);
```

You can remove outputs by following the snippet below:
```csharp
var outputIdsToRemove = new List<string>()
{
    "acsGroupCall"
};
var response = await mediaCompositionClient.RemoveOutputsAsync(mediaCompositionId, outputIdsToRemove);
```

## Start running a media composition

After defining the media composition with the correct properties, you can start composing the media by calling the `StartAsync` function using the `mediaCompositionId`.

```csharp
var compositionSteamState = await mediaCompositionClient.StartAsync(mediaCompositionId);
```

## Stop running a media composition

To stop a media composition, call the `StopAsync` function using the `mediaCompositionId`.

```csharp
var compositionSteamState = await mediaCompositionClient.StopAsync(mediaCompositionId);
```

## Delete a media composition

If you wish to delete a media composition, you may issue a delete request:
```csharp
await mediaCompositionClient.DeleteAsync(mediaCompositionId);
```

## Object model

The table below lists the main properties of media composition objects:

| Name                  | Description                               |
|-----------------------|-------------------------------------------|
| `mediaCompositionId`  | Media composition identifier that can be a user-friendly string. Must be unique across a Communication Service resource. |
| `layout`              | Specifies how the media sources will be composed into a single frame. |
| `inputs`              | Defines which media sources will be used in the layout composition. |
| `outputs`             | Defines where to send the composed streams to.|

## Next steps

In this section you learned how to:
> [!div class="checklist"]
> - Create a new media composition
> - Get the properties of a media composition
> - Update layout
> - Upsert and remove inputs
> - Upsert and remove outputs
> - Start and stop a media composition
> - Delete a media composition

You may also want to:
 - Learn about [media composition concept](../../concepts/voice-video-calling//media-comp.md)
 - Learn about [how to define a media composition](./define-media-composition.md)
