---
title: Logging and diagnostics in Azure Spatial Anchors | Microsoft Docs
description: In-depth explanation of how to generate and retrieve logging and diagnostics in Azure Spatial Anchors.
author: ramonarguelles
manager: vicenterivera
services: azure-spatial-anchors

ms.author: ramonarguelles
ms.date: 02/22/2019
ms.topic: conceptual
ms.service: azure-spatial-anchors
---
# Logging and diagnostics in Azure Spatial Anchors

Azure Spatial Anchors provides a standard logging mechanism useful for app development. Additionally, there's a diagnostics logging mode useful when even more information is required for debugging. Diagnostics logging includes storing images of the environment.

## Standard logging in Azure Spatial Anchors
The Azure Spatial Anchors API provides a logging mechanism that applications can subscribe to for receiving useful logs for application development and debugging. The standard logging APIs don't persist pictures of the environment to the device disk. The SDK provides these logs as event callbacks. It's up to you to integrate these logs into the application's logging mechanism.

### How to configure the log messages
There are two callbacks of interest for the user. In the sample below, you can see how to configure the session.

```csharp
    cloudSpatialAnchorSession = new CloudSpatialAnchorSession();
    . . .
    // setup the log level for the runtime session
    cloudSpatialAnchorSession.LogLevel = SessionLogLevel.Information;

    // configure the callback for the debug log
    cloudSpatialAnchorSession.OnLogDebug += CloudSpatialAnchorSession_OnLogDebug;

    // configure the callback for the error log
    cloudSpatialAnchorSession.Error += CloudSpatialAnchorSession_Error;
```

### Events & properties

Event callbacks provided to process logs and errors from the session.

- [LogLevel](https://docs.microsoft.com/dotnet/api/microsoft.azure.spatialanchors.cloudspatialanchorsession.loglevel): Specifies the level of detail for the events to receive from the runtime.
- [OnLogDebug](https://docs.microsoft.com/dotnet/api/microsoft.azure.spatialanchors.cloudspatialanchorsession.onlogdebug): This event callback provides standard debug log events.
- [Error](https://docs.microsoft.com/dotnet/api/microsoft.azure.spatialanchors.cloudspatialanchorsession.error): This event callback provides log events considered errors by the runtime.

## Diagnostics logging in Azure Spatial Anchors

In addition to the standard mode of operation for logging discussed above, Azure Spatial Anchors also has a diagnostics mode that developers can opt into. Diagnostics captures images of the environment and logs them to the disk. This mode is useful for debugging certain kinds of issues like when you aren't able to predictably locate an anchor. Only enable diagnostics logging to reproduce a specific issue and then disable it. Don't run your apps normally with diagnostics enabled.

During a support interaction with Microsoft, a Microsoft representative MAY ask if you're willing to submit a diagnostics bundle to Microsoft for further investigation. In this case, you may decide to enable diagnostics, reproduce the issue, and submit the diagnostic bundle to Microsoft for further investigation. Diagnostics logs submitted to Microsoft without prior acknowledgement by a Microsoft representative will go unanswered.

The following code snippets show you how to enable diagnostics mode and also how you can submit diagnostics logs to Microsoft.

### Enabling diagnostics logging

While a session is enabled for diagnostics logging, all operations on the session will have corresponding diagnostics logging on the local file system. Logging includes saving images of the environment to disk.

```csharp
private void ConfigureSession()
{
    cloudSpatialAnchorSession = new CloudSpatialAnchorSession();
    . . .

    // setup the log level for the runtime session
    cloudSpatialAnchorSession.LogLevel = SessionLogLevel.Information;

    // configure the callbacks for logging and errors
    cloudSpatialAnchorSession.OnLogDebug += CloudSpatialAnchorSession_OnLogDebug;
    cloudSpatialAnchorSession.Error += CloudSpatialAnchorSession_Error;

    // Opt-in to diagnostics logging of environment images.
    // If this is enabled, the diagnostics bundle will include images of the environment captured by the session
    cloudSpatialAnchorSession.Diagnostics.ImagesEnabled = true;

    // set the level of detail to be collected in the diagnostics log by the session
    cloudSpatialAnchorSession.Diagnostics.LogLevel = SessionLogLevel.All;

    // set the max bundle size to capture the bug information
    cloudSpatialAnchorSession.Diagnostics.MaxDiskSizeInMB = 200;
    . . .
}
```

### Submitting the diagnostic bundle

The following code snippet shows how to submit a diagnostics bundle to Microsoft. Note, this will includes images of the environment captured by the session after enabling diagnostics. Additionally, diagnostics bundles submitted to Microsoft without prior acknowledgement by a Microsoft representative will go unanswered.

```csharp
// method to handle the diagnostics bundle submission
private async Task CreateAndSubmitBundle()
{
    // create the diagnostics bundle manifest  to collect the session information
    string path = await cloudSpatialAnchorSession
                              .Diagnostics
                              .CreateManifestAsync("Description of the issue");

    // submit the manifest and data to send feedback to Microsoft
    await cloudSpatialAnchorSession.Diagnostics.SubmitManifestAsync(path);
}
```

### Anatomy of the diagnostics bundle
The following information may be present in a diagnostics bundle:

- KeyFrame Images - images of the environment captured during the session while diagnostics were enabled.
- Logs - Log events recorded by the runtime.
- Session metadata - metadata that identifies the session.
