---
title: Concept - Create and locate anchors using Azure Spatial Anchors | Microsoft Docs
description: In-depth explanation of how to create and locate anchors using Azure Spatial Anchors.
author: ramonarguelles
manager: vicenterivera
services: azure-spatial-anchors

ms.author: ramonarguelles
ms.date: 1/30/2019
ms.topic: concept
ms.service: azure-spatial-anchors
# ms.reviewer: MSFT-alias-of-reviewer
#Customer intent: As a Mixed Reality developer, I want and in-depth explanation of how to create and locate anchors using Azure Spatial Anchors.
---
# Concept: Create and locate anchors using Azure Spatial Anchors

## Getting Started

Azure Spatial Anchors allow you share anchors in the world between different devices.

It has been tuned to work well with your choice of development environment.

- C# on Unity for HoloLens.
- C# on Unity for iOS.
- C# on Unity for Android.
- Java on Android.
- Native C SDK on Android.
- Objective-C on iOS.
- Swift on iOS.

## Using the Azure Spatial Anchors

### Setting up the library

The main entry point for the library is the class representing the session. Typically you will declare a field in the class that manages your view and native AR session.

[C#]

```c#
    CloudSpatialAnchorSession session;
    // in your view load handler
    session = new CloudSpatialAnchorSession();
    session.Start();
```

[ObjC]

```objc
    SSCCloudSpatialAnchorSession *cloudSession;
    // in your view init handler
    cloudSession = [SSCCloudSpatialAnchorSession new];
    cloudSession.session = arSession;
    cloudSession.delegate = self;
    [cloudSession start];
```

You should invoke Start() to enable the session to process environment data.

In C#, you can handle events raised by the session by directly attaching an event handler.

In Objective-C, you can handle events raised by the session by implementing the SSCCloudSpatialAnchorSessionDelegate protocol on an object, for example your view, and then assigning the delegate property of the session to this object.

The cloud spatial anchor session works by mapping the space around the user to determine where anchors are located. To do this, on non-HoloLens platforms, you should provide frames from your platform's AR library.

On iOS, you can have the delegate to your view provide frames from the callback for - `(void)session:(ARSession *)session didUpdateFrame:(ARFrame *)frame;`.

[ObjC]

```objc
    [cloudSession processFrame:frame];
```

To handle the case when the session information is lost, you should process the sessionWasInterrupted event.

[ObjC]

```objc
    [cloudSession reset];
```

### Authentication

To provide a token to access the service, you need to provide an account key, access token, or AAD auth token.

To set an account key

[C#]

```c#
    cloudSesssion.Configuration.AccountKey = @"MyAccountKey";
```

To set an access token

[C#]

```c#
    cloudSesssion.Configuration.AccessToken = @"MyAccessToken";
```

To set an AAD auth token

[C#]

```c#
    cloudSesssion.Configuration.AuthenticationToken = @"MyAuthenticationToken";
```

If none of these tokens is set, you must handle the TokenRequired event, or implement the tokenRequired method on the delegate protocol.

You can handle the event synchronously by simply setting the property on the event arguments.

There are two properties you can set, AccessToken or AuthenticationToken, you only need to set one of them.

[C#]

```c#
    cloudSesssion.TokenRequired += (object sender, TokenRequiredEventArgs args) =>
    {
        args.AccessToken = @"MyAccessToken"; // Or args.AuthenticationToken = @"MyAuthenticationToken";
    };
```

[ObjC]

```objc
    - (void)tokenRequired:(SSCCloudSpatialAnchorSession *)cloudSpatialAnchorSession :(SSCTokenRequiredEventArgs *)args {
        args.accessToken = @"MyAccessToken"; // Or args.authenticationToken = @"MyAuthenticationToken";
    }
```

If you need to perform asynchronous work in your handler, you can defer setting the token by requesting a deferral object and then completing it, as in the following example.

[C#]

```c#
    cloudSesssion.TokenRequired += async (object sender, TokenRequiredEventArgs args) =>
    {
        var deferral = args.GetDeferral();
        string myToken = await MyGetTokenAsync();
        args.AccessToken = myToken;
        deferral.Complete();
    };
```

[ObjC]

```objc
    - (void)tokenRequired:(SSCCloudSpatialAnchorSession *)cloudSpatialAnchorSession :(SSCTokenRequiredEventArgs *)args {
        SSCCloudSpatialAnchorSessionDeferral *deferral = [args getDeferral];
        [someAsyncCall callback:^(NSString *token, NSError *err) {
            if (token) args.accessToken = token;
            [deferral complete];
        }];
    }
```

### Providing feedback to the user

To provide feedback to the user as the device moves and the session updates its environment understanding, you can write code to handle the session updated event.

You should also use this event to determine at what point there is enough tracked data perform creation or location operations.

    [C#]
    session.SessionUpdated += (object sender, SessionUpdatedEventArgs args) {
        // SpatialDataFeedback is an enumeration with values such as NotEnoughMotion
        // or MotionTooQuick.
        var status = args.Status;
        if (status.UserFeedback == SessionUserFeedback.None) return;
        feedbackLabel.Text = status.UserFeedback.ToString();
    };

    [ObjC]
    - (void)sessionUpdated:(SSCCloudSpatialAnchorSession *)cloudSpatialAnchorSession :(SSCSessionStatus *)status {
        // SSCSessionUserFeedback is an enumeration with values such as
        // SSCSessionUserFeedbackNotEnoughMotion or SSCSessionUserFeedbackMotionTooQuick.
        if (status.UserFeedback == SSCSessionUserFeedbackNone) return;
        feedbackLabel.text = [NSString
            stringWithFormat:@"feedback: %@ - create ready=%.0f%%,recommend=%.0f%%, locate ready=%.0f%%,recommend=%.0f%%",
            FeedbackToString(status.userFeedback),
            status.readyForCreateProgress * 100.f, status.recommendedForCreateProgress * 100.f,
            status.readyForLocateProgress * 100.f, status.recommendedForLocateProgress * 100.f];
    }

You can also request information as to whether enough spatial data has been collected to visually locate saved spatial anchors, or to create a new spatial anchor - we'll see these at a later step.

### Creating a cloud spatial anchor

To create a cloud anchor, you first create an anchor in your platform's AR system, and then request that a cloud counterpart be created. You use the CreateAnchorAsync / createAnchorAsync method for this.

[C#]

```c#
    // Create a local anchor, perhaps by hit-testing into a ARSCNView
    SpatialAnchor anchor = /* create a spatial anchor within the scene */;

    // If the user is placing some application content in their environment,
    // you might show content at this anchor for a while, then save when
    // the user confirms placement.
    CloudSpatialAnchor anchor = new CloudSpatialAnchor() { LocalAnchor = anchor };
    await cloudSession.CreateAnchorAsync(anchor);
    Trace.WriteLine("created a cloud anchor with ID=" + anchor.Identifier);
```

[ObjC]

```objc
    // Create a local anchor, perhaps by hit-testing into a ARSCNView
    NSArray<HitTestResult *> *hits = [_view.session.currentFrame hitTest:center type:ARHitTestResultTypeEstimatedHorizontalPlane];
    if ([hits count] == 0) return;
    ARAnchor *anchor = [[ARAnchor alloc] initWithTransform:hits[0].worldTransform];
    [_view.session addAnchor:anchor];

    // If the user is placing some application content in their environment,
    // you might show content at this anchor for a while, then save when
    // the user confirms placement.
    SSCCloudSpatialAnchor *cloudAnchor = [SSCCloudSpatialAnchor new];
    cloudAnchor.localAnchor = anchor;
    [cloudSession createAnchorAsync:anchor callback:^(NSError *err) {
        if (err) {
            NSLog("%@", err);
            return;
        }
        NSLog("created a cloud anchor with ID=%@", cloudAnchor.identifier);
    }];
```

It's a good idea to make sure that there's sufficient data before attempting to create a new cloud anchor.

[C#]

```c#
    // On a timer perhaps, see if we should proceed to creating our anchor.
    SSCSessionStatus sessionStatus = await cloudSession.GetAnchorCreationDataStatusAsync();
    if (sessionStatus.RecommendedForCreateProgress < 1.0f) return;
    // issue the creation request ...
```

[ObjC]

```objc
    [cloudSession getSessionStatusAsyncWithCompletionHandler:^(SSCSessionStatus *value, NSError *error) {
        if (err) {
            NSLog("%@", err);
            return;
        }
        if (!createStatus.isDataSufficent) {
            return;
        }
        // issue the creation request ...
    }];
```

You may choose to add some properties when saving your cloud anchors, for example the type of object that is being saved and basic properties like whether it should be enabled for interaction. This can be useful upon discovery, if you can immediately render the object for the user, for example a picture frame with blank content, while a different download can be made in the background to get additional state details (for example, the picture to display in the frame).

[C#]

```c#
    CloudSpatialAnchor anchor = new CloudSpatialAnchor() { LocalAnchor = anchor };
    anchor.Properties["model-type"] = "frame";
    anchor.Properties["label"] = "my latest picture";
    CloudSpatialAnchor created = await cloudSession.CreateAsync(anchor);
```

[ObjC]

```objc
    SSCCloudSpatialAnchor *cloudAnchor = [SSCCloudSpatialAnchor new];
    cloudAnchor.localAnchor = anchor;
    cloudAnchor.properties = @{ @"model-type" : @"frame", @"label" : @"my latest picture" };
    [cloudSession createAnchorAsync:anchor callback:^(NSError *err) {
        // ...
    });
```

### Locating a cloud spatial anchor

To locate cloud spatial anchors, you will need to know their identity values. Typically these are stored in a service that's accessible to all devices.

Instantiate an AnchorLocateCriteria object, set the identity values you are looking for, and invoke the CreateWatcher method on the session by providing your AnchorLocateCriteria.

[C#]

```c#
    AnchorLocateCriteria anchorLocateCriteria = new AnchorLocateCriteria();
    anchorLocateCriteria.Identifiers = new string[] { id1, id2, id3 };
    cloudSession.CreateWatcher(anchorLocateCriteria);
```

[ObjC]

```objc
    NSArray *ids = @[_targetId];
    SSCAnchorLocateCriteria *criteria = [SSCAnchorLocateCriteria new];
    criteria.identifiers = ids;
    [_cloudSession createWatcher:criteria];
```

After your watcher is created, the AnchorLocated will fire for every anchor requested, and then the LocateAnchorsCompleted event will fire. Note that AnchorLocated will also fire when the anchor cannot be successfully located, in which case the reason will be stated in the status.

[C#]

```c#
    void OnAnchorLocated(object sender, AnchorLocatedEventArgs args) {
        switch (args.Status) {
            case LocateAnchorStatus.AlreadyTracked:
                // we were already tracking this - nevermind then
                break;
            case LocateAnchorStatus.Located:
                CloudSpatialAnchor foundAnchor = args.Anchor;
                // Go add foundAnchor.LocalAnchor to the scene...
                break;
            case LocateAnchorStatus.NotLocatedNeedsMoreData:
                // couldn't find it - maybe more data will help
                // show UI to tell user to keep looking around
                break;
            case LocateAnchorStatus.NotLocatedAnchorOrphaned:
                // we won't be able to find this content again, space data is missing
                // you can issue a query for properties if you keep
                // metadata there to help user re-anchor content somewhere
                break;
            case LocateAnchorStatus.NotLocatedAnchorDoesNotExist:
                // we won't be able to find this content again, it was deleted
                // drop it, or show UI to ask user to anchor the content anew
                break;
        }
    }
```

[ObjC]

```objc
    - (void)anchorLocated:(SSCCloudSpatialAnchorSession *)cloudSpatialAnchorSession :(SSCCloudSpatialAnchor *)anchor :(NSString *)identifier :(SSCLocateAnchorStatus)status {
        switch (status) {
        case SSCLocateAnchorStatusLocated: {
            NSLog(@"spatialAnchorAdded - %p at %@", anchor, matrix_to_string(anchor.localAnchor.transform));
            _foundAnchor = anchor;
            [_sceneView.session addAnchor:anchor.localAnchor];
            NSString *message = [NSString stringWithFormat:@"anchor found: %@", anchor.identifier];
            ViewController *me = self;
            dispatch_async(dispatch_get_main_queue(), ^{
                me->_feedbackText.text = message;
            });
        }
        break;
        case SSCLocateAnchorStatusAlreadyTracked:
            // This anchor has already been reported and is being tracked.
            break;
        case SSCLocateAnchorStatusNotLocatedAnchorDoesNotExist:
            // The anchor was deleted or never exited in the first place.
            break;
        case SSCLocateAnchorStatusNotLocatedAnchorOrphaned:
            // The anchor hasn't been found in a long time - currently a placeholder.
            break;
        case SSCLocateAnchorStatusNotLocatedNeedsMoreData:
            // The anchor hasn't been found given the location data.
            // Possibly the user is in the wrong location altogether.
            break;
        }
    }
```

### Updating an existing cloud spatial anchor

There are two kinds of updates you can make: update properties on an anchor, or delete the anchor altogether.

To update the properties on an anchor, you use the UpdateAnchorPropertiesAsync method.

[C#]

```c#
    CloudSpatialService anchor = /* create or locate */;
    anchor.Properties["last-user-access"] = @"me";
    await cloudSession.UpdateAnchorPropertiesAsync(anchor);
```

[ObjC]

```objc
    SSCCloudAnchorSession *anchor = /* create or locate */;
    NSMutableDictionary *d = [NSMutableDictionary new];
    [d setDictionary:result.properties];
    [d setValue:@"just now" forKey:@"last-user-access];
    result.properties = d;
    [cloudSession updateAnchorPropertiesAsync:result callback:^(NSError *updateErr) {
        if (updateErr) NSLog("@%", updateErr);
    }];
```

You cannot change the location of an anchor - you must create a new anchor and delete the old one to track a new position.

The library cannot update or delete an anchor just based on its identifier, as conflict detection is built-into the service, to avoid accidentally overwriting data from a different device.

If you don't care to locate an anchor to update it, you can use the GetAnchorPropertiesAsync method, which returns a CloudSpatialAnchor object with properties and version information.

[C#]

```c#
    var anchor = await cloudSession.GetAnchorPropertiesAsync(TheAnchorId);
    anchor.Properties["last-user-access"] = @"me";
    await cloudSession.UpdateAnchorPropertiesAsync(anchor);
```

[ObjC]

```objc
    [cloudSession getAnchorPropertiesAsync:theAnchorId callback:^(SCCCloudAnchorSession *result, NSError *err) {
        if (err) {
            NSLog("@%", err);
            return;
        }
        result.properties[@"last-user-access"] = @"me";
        [cloudSession updateAnchorPropertiesAsync:result callback:^(NSError *updateErr) {
            if (updateErr) NSLog("@%", updateErr);
        }];
    }];
```

### Pausing or stopping the session

To stop the session temporarily, you can invoke the Stop method. This will stop any watchers and environment processing, even if you invoke ProcessFrame(). You can then invoke Start() to resume processing.

[C#]

```c#
    cloudSession.Stop();
```

[ObjC]

```objc
    [cloudSession stop];
```

To clean up properly after a session, invoke the Dispose() method in C#, or simply release all references in Objective-C and Swift.

[C#]

```c#
    cloudSession.Dispose();
```

[ObjC]

```objc
    cloudSession = nil;
```

## Reference

To view API reference, see the specific documentation for your target.
