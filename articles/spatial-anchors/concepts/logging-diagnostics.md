---
title: Logging and diagnostics
description: In-depth explanation of how to generate and retrieve logging and diagnostics in Azure Spatial Anchors.
author: ramonarguelles
manager: vriveras
services: azure-spatial-anchors

ms.author: rgarcia
ms.date: 02/22/2019
ms.topic: conceptual
ms.service: azure-spatial-anchors
---
# Logging and diagnostics in Azure Spatial Anchors

Azure Spatial Anchors provides a standard logging mechanism that's useful for app development. The Spatial Anchors diagnostics logging mode is useful when you need more information for debugging. Diagnostics logging stores images of the environment.

## Standard logging
In the Spatial Anchors API, you can subscribe to the logging mechanism to get useful logs for application development and debugging. The standard logging APIs don't store pictures of the environment on the device disk. The SDK provides these logs as event callbacks. It's up to you to integrate these logs into the application's logging mechanism.

### Configuration of log messages
There are two callbacks of interest for the user. The following sample shows how to configure the session.

```csharp
    cloudSpatialAnchorSession = new CloudSpatialAnchorSession();
    . . .
    // set up the log level for the runtime session
    cloudSpatialAnchorSession.LogLevel = SessionLogLevel.Information;

    // configure the callback for the debug log
    cloudSpatialAnchorSession.OnLogDebug += CloudSpatialAnchorSession_OnLogDebug;

    // configure the callback for the error log
    cloudSpatialAnchorSession.Error += CloudSpatialAnchorSession_Error;
```

### Events and properties

These event callbacks are provided to process logs and errors from the session:

- [LogLevel](https://docs.microsoft.com/dotnet/api/microsoft.azure.spatialanchors.cloudspatialanchorsession.loglevel): Specifies the level of detail for the events to receive from the runtime.
- [OnLogDebug](https://docs.microsoft.com/dotnet/api/microsoft.azure.spatialanchors.cloudspatialanchorsession.onlogdebug): Provides standard debug log events.
- [Error](https://docs.microsoft.com/dotnet/api/microsoft.azure.spatialanchors.cloudspatialanchorsession.error): Provides log events that the runtime considers to be errors.

## Diagnostics logging

In addition to the standard mode of operation for logging, Spatial Anchors also has a diagnostics mode. Diagnostics mode captures images of the environment and logs them to the disk. You can use this mode to debug certain kinds of issues, like failure to predictably locate an anchor. Enable diagnostics logging only to reproduce a specific issue. Then disable it. Don't enable diagnostics when you're running your apps normally.

During a support interaction with Microsoft, a Microsoft representative might ask if you're willing to submit a diagnostics bundle for further investigation. In this case, you might decide to enable diagnostics and reproduce the issue so you can submit the diagnostic bundle.

If you submit a diagnostics log to Microsoft without prior acknowledgement from a Microsoft representative, the submission will go unanswered.

The following sections show how to enable diagnostics mode and also how to submit diagnostics logs to Microsoft.

### Enable diagnostics logging

When you enable a session for diagnostics logging, all operations in the session have corresponding diagnostics logging in the local file system. During logging, images of the environment are saved to the disk.

```csharp
private void ConfigureSession()
{
    cloudSpatialAnchorSession = new CloudSpatialAnchorSession();
    . . .

    // set up the log level for the runtime session
    cloudSpatialAnchorSession.LogLevel = SessionLogLevel.Information;

    // configure the callbacks for logging and errors
    cloudSpatialAnchorSession.OnLogDebug += CloudSpatialAnchorSession_OnLogDebug;
    cloudSpatialAnchorSession.Error += CloudSpatialAnchorSession_Error;

    // opt in to diagnostics logging of environment images
    // if this is enabled, the diagnostics bundle includes images of the environment captured by the session
    cloudSpatialAnchorSession.Diagnostics.ImagesEnabled = true;

    // set the level of detail to be collected in the diagnostics log by the session
    cloudSpatialAnchorSession.Diagnostics.LogLevel = SessionLogLevel.All;

    // set the max bundle size to capture the bug information
    cloudSpatialAnchorSession.Diagnostics.MaxDiskSizeInMB = 200;
    . . .
}
```

### Submit the diagnostics bundle

The following code snippet shows how to submit a diagnostics bundle to Microsoft. This bundle will include images of the environment captured by the session after you enable diagnostics.

```csharp
// method to handle the diagnostics bundle submission
private async Task CreateAndSubmitBundle()
{
    // create the diagnostics bundle manifest to collect the session information
    string path = await cloudSpatialAnchorSession
                              .Diagnostics
                              .CreateManifestAsync("Description of the issue");

    // submit the manifest and data to send feedback to Microsoft
    await cloudSpatialAnchorSession.Diagnostics.SubmitManifestAsync(path);
}
```

### Parts of a diagnostics bundle
The diagnostics bundle might contain the following information:

- **Keyframe images**: Images of the environment captured during the session while diagnostics were enabled.
- **Logs**: Log events recorded by the runtime.
- **Session metadata**: Metadata that identifies the session.
