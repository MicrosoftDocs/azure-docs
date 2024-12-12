---
title: Azure Communication Services precall diagnostics
titleSuffix: An Azure Communication Services concept document
description: Overview of the precall diagnostic API feature.
author: yassirbisteni
manager: bobgao
services: azure-communication-services
ms.author: yassirb
ms.date: 12/12/2024
ms.topic: conceptual
ms.service: azure-communication-services
---

## Precall diagnostics

[!INCLUDE [Public Preview Disclaimer](../../../../includes/public-preview-include.md)]

The precall API feature allows developers to programmatically validate a client’s readiness to join an Azure Communication Services call. You can only access precall features using the Calling SDK. The precall diagnostic feature provides multiple diagnostics including device, connection, and call quality. Provide us with [feedback](../../../../support.md) about which platforms you want to see precall diagnostics enabled.

## Precall diagnostics access

To access precall diagnostics, you need to initialize a `CallClient`, and provision an Azure Communication Services access token. Then you can access the `PreCallDiagnostics` feature and the `startTest` method.

```swift
let acsToken: String;
do
{
    let options = CommunicationTokenRefreshOptions(initialToken: acsToken,
                                                    refreshProactively: true,
                                                    tokenRefresher: tokenRefresher)
    credentials = try CommunicationTokenCredential(withOptions: options)
}
catch
{
    return nil
}

let options = CallClientOptions()
callClient = CallClient(options: options)

preCallDiagnosticsFeature = callClient.feature(Features.preCallDiagnostics)

preCallDiagnosticsCallClientFeatureObserver = PreCallDiagnosticsCallClientFeatureObserver(view: self)
preCallDiagnosticsFeature.delegate = preCallDiagnosticsCallClientFeatureObserver
preCallDiagnosticsFeature.startTest(credentials, withCompletionHandler: { error in

})

class PreCallDiagnosticsCallClientFeatureObserver: NSObject, PreCallDiagnosticsCallClientFeatureDelegate
{
    private var view: HomeView

    init(view: HomeView)
    {
        self.view = view
    }
    
    func diagnosticsCallClientFeature(_ preCallDiagnosticsCallClientFeature: PreCallDiagnosticsCallClientFeature, 
                                      didDiagnosticsReady args: PreCallDiagnosticsReadyEventArgs)
    {
        view.onPreCallDiagnosticsReady(args: args)
    }
}
```

Once it finishes running, developers can access the result object.

## Diagnostic results

Pre-call diagnostics return a full diagnostic of the device including details like availability and compatibility, call quality statistics, and in-call diagnostics. The results are returned as a `PreCallDiagnosticsReadyEvent` object.

```swift
func onPreCallDiagnosticsReady(args: PreCallDiagnosticsReadyEventArgs) -> Void
{
    let diagnostics = args.diagnostics
    let mediaStatsReport = diagnostics.mediaStatisticsReport;

    if let outgoingStatsList = mediaStatsReport.outgoingStatistics
    {
        let videoStatsList = outgoingStatsList.videoStatistics;
        let screenShareStatsList = outgoingStatsList.screenShareStatistics;
        let audioStatsList = outgoingStatsList.audioStatistics;
    }

    if let incomingStatsList = mediaStatsReport.incomingStatistics
    {
        let videoStatsList = incomingStatsList.videoStatistics;
        let screenShareStatsList = incomingStatsList.screenShareStatistics;
        let audioStatsList = incomingStatsList.audioStatistics;
    }
}
```

You can access individual result objects using the `PreCallDiagnosticsReadyEvent` type. Results for individual tests are returned as they are completed with many of the test results being available immediately. The results might take up to 1 minute as the test validates the quality of the video and audio.

### Device permissions

The permission check determines whether video and audio devices are available from a permissions perspective. Provides `boolean` value for `audio` and `video` devices. 

```swift
let permissionList = preCallDiagnosticsFeature?.devicePermissions()
```