---
title: Concept - Create and locate anchors using Azure Spatial Anchors | Microsoft Docs
description: In-depth explanation of how to create and locate anchors using Azure Spatial Anchors.
author: ramonarguelles
manager: vicenterivera
services: azure-spatial-anchors

ms.author: ramonarguelles
ms.date: 1/31/2019
ms.topic: concept
ms.service: azure-spatial-anchors
# ms.reviewer: MSFT-alias-of-reviewer
#Customer intent: As a Mixed Reality developer, I want and in-depth explanation of how to create and locate anchors using Azure Spatial Anchors.
---
# Concept: Create and locate anchors using Azure Spatial Anchors

## Getting started

Azure Spatial Anchors allow you share anchors in the world between different devices.

It has been tuned to work well with your choice of development environment.

- C# on Unity
    - For HoloLens
    - For iOS
    - For Android
- Objective-C on iOS
- Swift on iOS
- Java on Android
- C++/NDK on Android
- C++/WinRT on HoloLens

## Initializing the session

The main entry point for the library is the class representing your session. Typically you'll declare a field in the class that manages your view and native AR session.

In CSharp:

```csharp
    CloudSpatialAnchorSession cloudSession;
    // In your view handler
    this.cloudSession = new CloudSpatialAnchorSession();
```

In Objective-C:

```objc
    SSCCloudSpatialAnchorSession *_cloudSession;
    // In your view handler
    _cloudSession = [[SSCCloudSpatialAnchorSession alloc] init];
```

In Swift:

```swift
    var _cloudSession : SSCCloudSpatialAnchorSession? = nil
    // In your view handler
    _cloudSession = SSCCloudSpatialAnchorSession()
```

In Java:

```java
    private CloudSpatialAnchorSession mCloudSession;
    // In your view handler
    mCloudSession = new CloudSpatialAnchorSession();
```

In C++:

```cpp
    std::shared_ptr<SpatialServices::CloudSpatialAnchorSession> cloudSession_;
    // In your view handler
    cloudSession_ = std::make_shared<CloudSpatialAnchorSession>();
```

## Setting up authentication

To access the service, you need to provide an account key, access token, or AAD auth token.

### Account Keys

Account Keys are a credential that allows your application to authenticate with the Azure Spatial Anchors service. The intended purpose of Account Keys is to help you get started quickly. Specially during the development phase of your application's integration with Azure Spatial Anchors. As such, you can use Account Keys by embedding them in your client applications during development. As you progress beyond development, it's highly recommended to move to an authentication mechanism that is production-level, supported by Access Tokens, or AAD-based user authentication. To get an Account Key for development, visit your Azure Spatial Anchors account, and navigate to the "Keys" tab.

In CSharp:

```csharp
    this.cloudSession.Configuration.AccountKey = @"MyAccountKey";
```

In Objective-C:

```objc
    _cloudSession.configuration.accountKey = @"MyAccountKey";
```

In Swift:

```swift
    _cloudSession!.configuration.accountKey = "MyAccountKey"
```

In Java:

```java
    mCloudSession.getConfiguration().setAccountKey("MyAccountKey");
```

In C++:

```cpp
    auto configuration = cloudSession_->Configuration();
    configuration->AccountKey(R"(MyAccountKey)");
```

### Access Tokens

Access Tokens are a more robust method to authenticate with Azure Spatial Anchors. Specially as you prepare your application for a production deployment. The summary of this approach is to set up a backend service that your client application can securely authenticate with. Your backend service interfaces with AAD at runtime and with the Azure Spatial Anchors STS service to request an Access Token. This token is then delivered to the client application and used in the SDK to authenticate with Azure Spatial Anchors.

In CSharp:

```csharp
    this.cloudSession.Configuration.AccessToken = @"MyAccessToken";
```

In Objective-C:

```objc
    _cloudSession.configuration.accessToken = @"MyAccessToken";
```

In Swift:

```swift
    _cloudSession!.configuration.accessToken = "MyAccessToken"
```

In Java:

```java
    mCloudSession.getConfiguration().setAccessToken("MyAccessToken");
```

In C++:

```cpp
    auto configuration = cloudSession_->Configuration();
    configuration->AccessToken(R"(MyAccessToken)");
```

If an access token isn't set, you must handle the TokenRequired event, or implement the tokenRequired method on the delegate protocol.

You can handle the event synchronously by setting the property on the event arguments.

In CSharp:

```csharp
    this.cloudSession.TokenRequired += (object sender, TokenRequiredEventArgs args) =>
    {
        args.AccessToken = @"MyAccessToken";
    };
```

In Objective-C:

```objc
    - (void)tokenRequired:(SSCCloudSpatialAnchorSession *)cloudSession :(SSCTokenRequiredEventArgs *)args {
        args.accessToken = @"MyAccessToken";
    }
```

In Swift:

```swift
    internal func tokenRequired(_ cloudSession:SSCCloudSpatialAnchorSession!, _ args:SSCTokenRequiredEventArgs!) {
        args.accessToken = "MyAccessToken"
    }
```

In Java:

```java
    mCloudSession.addTokenRequiredListener(args -> {
        args.setAccessToken("MyAccessToken");
    });
```

In C++:

```cpp
    auto accessTokenRequiredToken = cloudSession_->AccessTokenRequired([](auto&&, auto&& args) {
        args->AccessToken(R"(MyAccessToken)");
    });
```

If you need to execute asynchronous work in your handler, you can defer setting the token by requesting a deferral object and then completing it, as in the following example.

In CSharp:

```csharp
    this.cloudSession.TokenRequired += async (object sender, TokenRequiredEventArgs args) =>
    {
        var deferral = args.GetDeferral();
        string myToken = await MyGetTokenAsync();
        if (myToken != null) args.AccessToken = myToken;
        deferral.Complete();
    };
```

In Objective-C:

```objc
    - (void)tokenRequired:(SSCCloudSpatialAnchorSession *)cloudSession :(SSCTokenRequiredEventArgs *)args {
        SSCCloudSpatialAnchorSessionDeferral *deferral = [args getDeferral];
        [myGetTokenAsync callback:^(NSString *myToken) {
            if (myToken) args.accessToken = myToken;
            [deferral complete];
        }];
    }
```

In Swift:

```swift
    internal func tokenRequired(_ cloudSession:SSCCloudSpatialAnchorSession!, _ args:SSCTokenRequiredEventArgs!) {
        let deferral = args.getDeferral()
        myGetTokenAsync( withCompletionHandler: { (myToken: String?) in
            if (myToken != nil) {
                args.accessToken = myToken
            }
            deferral?.complete()
        })
    }

```

In Java:

```java
    mCloudSession.addTokenRequiredListener(args -> {
        CloudSpatialAnchorSessionDeferral deferral = args.getDeferral();
        MyGetTokenAsync(myToken -> {
            if (myToken != null) args.setAccessToken(myToken);
            deferral.complete();
        });
    });
```

In C++:

```cpp
    auto accessTokenRequiredToken = cloudSession_->TokenRequired([this](auto&&, auto&& args) {
        std::shared_ptr<CloudSpatialAnchorSessionDeferral> deferral = args->GetDeferral();
        MyGetTokenAsync([&deferral, &args](std::string const& myToken) {
            if (myToken != nullptr) args->AccessToken(myToken);
            deferral->Complete();
        });
    });
```

### AAD User Authentication

Azure Spatial Anchors also allows applications to authenticate with user AAD tokens. For example, you can use AAD tokens to integrate with ASA. If an Enterprise maintains users in AAD, you can supply a user AAD token in the Azure Spatial Anchors SDK. Doing so allows you to authenticate directly to the ASA service for an account that's part of the same AAD tenant.

In CSharp:

```csharp
    this.cloudSession.Configuration.AuthenticationToken = @"MyAuthenticationToken";
```

In Objective-C:

```objc
    _cloudSession.configuration.authenticationToken = @"MyAuthenticationToken";
```

In Swift:

```swift
    _cloudSession!.configuration.authenticationToken = "MyAuthenticationToken"
```

In Java:

```java
    mCloudSession.getConfiguration().setAuthenticationToken("MyAuthenticationToken");
```

In C++:

```cpp
    auto configuration = cloudSession_->Configuration();
    configuration->AuthenticationToken(R"(MyAuthenticationToken)");
```

Like with access tokens, if an AAD token isn't set, you must handle the TokenRequired event, or implement the tokenRequired method on the delegate protocol.

You can handle the event synchronously by setting the property on the event arguments.

In CSharp:

```csharp
    this.cloudSession.TokenRequired += (object sender, TokenRequiredEventArgs args) =>
    {
        args.AuthenticationToken = @"MyAuthenticationToken";
    };
```

In Objective-C:

```objc
    - (void)tokenRequired:(SSCCloudSpatialAnchorSession *)cloudSession :(SSCTokenRequiredEventArgs *)args {
        args.authenticationToken = @"MyAuthenticationToken";
    }
```

In Swift:

```swift
    internal func tokenRequired(_ cloudSession:SSCCloudSpatialAnchorSession!, _ args:SSCTokenRequiredEventArgs!) {
        args.authenticationToken = "MyAuthenticationToken"
    }
```

In Java:

```java
    mCloudSession.addTokenRequiredListener(args -> {
        args.setAuthenticationToken("MyAuthenticationToken");
    });
```

In C++:

```cpp
    auto accessTokenRequiredToken = cloudSession_->AccessTokenRequired([](auto&&, auto&& args) {
        args->AuthenticationToken(R"(MyAuthenticationToken)");
    });
```

If you need to execute asynchronous work in your handler, you can defer setting the token by requesting a deferral object and then completing it, as in the following example.

In CSharp:

```csharp
    this.cloudSession.TokenRequired += async (object sender, TokenRequiredEventArgs args) =>
    {
        var deferral = args.GetDeferral();
        string myToken = await MyGetTokenAsync();
        if (myToken != null) args.AuthenticationToken = myToken;
        deferral.Complete();
    };
```

In Objective-C:

```objc
    - (void)tokenRequired:(SSCCloudSpatialAnchorSession *)cloudSession :(SSCTokenRequiredEventArgs *)args {
        SSCCloudSpatialAnchorSessionDeferral *deferral = [args getDeferral];
        [myGetTokenAsync callback:^(NSString *myToken) {
            if (myToken) args.authenticationToken = myToken;
            [deferral complete];
        }];
    }
```

In Swift:

```swift
    internal func tokenRequired(_ cloudSession:SSCCloudSpatialAnchorSession!, _ args:SSCTokenRequiredEventArgs!) {
        let deferral = args.getDeferral()
        myGetTokenAsync( withCompletionHandler: { (myToken: String?) in
            if (myToken != nil) {
                args.authenticationToken = myToken
            }
            deferral?.complete()
        })
    }

```

In Java:

```java
    mCloudSession.addTokenRequiredListener(args -> {
        CloudSpatialAnchorSessionDeferral deferral = args.getDeferral();
        MyGetTokenAsync(myToken -> {
            if (myToken != null) args.setAuthenticationToken(myToken);
            deferral.complete();
        });
    });
```

In C++:

```cpp
    auto accessTokenRequiredToken = cloudSession_->TokenRequired([this](auto&&, auto&& args) {
        std::shared_ptr<CloudSpatialAnchorSessionDeferral> deferral = args->GetDeferral();
        MyGetTokenAsync([&deferral, &args](std::string const& myToken) {
            if (myToken != nullptr) args->AuthenticationToken(myToken);
            deferral->Complete();
        });
    });
```

## Setting up the library

Invoke Start() to enable your session to process environment data.

To handle events raised by your session:

- In C#, Java and C++, attach an event handler.
- In Objective-C and Swift, set the `delegate` property of your session to an object, like your view. This object must implement the SSCCloudSpatialAnchorSessionDelegate protocol.

In CSharp:

```csharp
#if UNITY_IOS
    this.arkitSession = UnityARSessionNativeInterface.GetARSessionNativeInterface();
    this.cloudSession.Session = this.arkitSession.GetNativeSessionPtr();
#elif UNITY_ANDROID
    this.nativeSession = GoogleARCoreInternal.ARCoreAndroidLifecycleManager.Instance.NativeSession;
    this.cloudSession.Session = this.nativeSession.SessionHandle;
#elif UNITY_WSA || WINDOWS_UWP
    // No need to set a native session pointer for HoloLens.
#else
    throw new NotSupportedException("The platform is not supported.");
#endif

    this.cloudSession.Start();
```

In Objective-C:

```objc0
    _cloudSession.session = self.sceneView.session;
    _cloudSession.delegate = self;
    [_cloudSession start];
```

In Swift:

```swift
    _cloudSession!.session = self.sceneView.session;
    _cloudSession!.delegate = self;
    _cloudSession!.start()
```

In Java:

```java
    mCloudSession.setSession(mSession);
    mCloudSession.start();
```

In C++:

```cpp
    cloudSession_->Session(ar_session_);
    cloudSession_->Start();
```

## Providing native frames to the library

The spatial anchor session works by mapping the space around the user. Doing so helps to determine where anchors are located. On non-HoloLens platforms, you should provide frames from your platform's AR library.

In CSharp:

```csharp
#if UNITY_ANDROID
    long latestFrameTimeStamp = this.nativeSession.FrameApi.GetTimestamp();
    bool newFrameToProcess = latestFrameTimeStamp > this.lastFrameProcessedTimeStamp;
    if (newFrameToProcess)
    {
        this.cloudSession.ProcessFrame(this.nativeSession.FrameHandle);
        this.lastFrameProcessedTimeStamp = latestFrameTimeStamp;
    }
#endif
#if UNITY_IOS
    UnityARSessionNativeInterface.ARFrameUpdatedEvent += UnityARSessionNativeInterface_ARFrameUpdatedEvent;

    void UnityARSessionNativeInterface_ARFrameUpdatedEvent(UnityARCamera camera)
    {
        this.cloudSession.ProcessFrame(this.arkitSession.GetNativeFramePtr());
    }
#endif
```

In Objective-C:

```objc
    [_cloudSession processFrame:_sceneView.session.currentFrame];
```

In Swift:

```swift
    _cloudSession?.processFrame(self.sceneView.session.currentFrame)
```

In Java:

```java
    mCloudSession.processFrame(mSession.update());
```

In C++:

```cpp
    cloudSession_->ProcessFrame(ar_frame_);
```

## Providing feedback to the user

You can write code to handle the session updated event. Doing so, allows you to:

- Provide feedback to the user as the device moves and the session updates its environment understanding.
- Determine at what point there's enough tracked spatial data to create or locate spatial anchors - we'll learn more at a later step.

In CSharp:

```csharp
    this.cloudSession.SessionUpdated += (object sender, SessionUpdatedEventArgs args)
    {
        var status = args.Status;
        if (status.UserFeedback == SessionUserFeedback.None) return;
        this.feedback = $"Feedback: {Enum.GetName(typeof(SessionUserFeedback), status.UserFeedback)} -" +
            $" Recommend Create={status.RecommendedForCreateProgress: 0.#%}";
    };
```

In Objective-C:

```objc
    - (void)sessionUpdated:(SSCCloudSpatialAnchorSession *)cloudSession :(SSCSessionUpdatedEventArgs *)args {
        SSCSessionStatus *status = [args status];
        if (status.userFeedback == SSCSessionUserFeedbackNone) return;
        _feedback = [NSString
            stringWithFormat:@"Feedback: %@ - Recommend Create=%.0f%%",
            FeedbackToString(status.userFeedback),
            status.recommendedForCreateProgress * 100.f];
    }
```

In Swift:

```swift
    internal func sessionUpdated(_ cloudSession:SSCCloudSpatialAnchorSession!, _ args:SSCSessionUpdatedEventArgs!) {
        let status = args.status!
        if (status.userFeedback.isEmpty) {
            return
        }
        _feedback = "Feedback: \(FeedbackToString(userFeedback:status.userFeedback)) - Recommend Create=\(status.recommendedForCreateProgress * 100)"
    }
```

In Java:

```java
    mCloudSession.addSessionUpdatedListener(args -> {
        auto status = args->Status();
        if (status->UserFeedback() == SessionUserFeedback::None) return;
        NumberFormat percentFormat = NumberFormat.getPercentInstance();
        percentFormat.setMaximumFractionDigits(1);
        mFeedback = String.format("Feedback: %s - Recommend Create=%s",
            FeedbackToString(status.getUserFeedback()),
            percentFormat.format(status.getRecommendedForCreateProgress()));
    });
```

In C++:

```cpp
    auto sessionUpdatedToken = cloudSession_->SessionUpdated([this](auto&&, auto&& args) {
        auto status = args->Status();
        std::ostringstream str;
        str << std::fixed << std::setw(2) << std::setprecision(0)
            << "Feedback: " << FeedbackToString(status.UserFeedback()) << " -"
            << " Create Ready=" << (status->ReadyForCreateProgress() * 100) << "%,"
            << " Recommend Create=" << (status->RecommendedForCreateProgress() * 100) << "%,"
            << " Locate Ready=" << (status->ReadyForLocateProgress() * 100) << "%,"
            << " Recommend Locate=" << (status->RecommendedForLocateProgress() * 100) << "%";
        feedback_ = str.str();
    });
```

## Creating a cloud spatial anchor

To create a cloud anchor, you first create an anchor in your platform's AR system, and then create a cloud counterpart. You use the CreateAnchorAsync method.

In CSharp:

```csharp
    // Create a local anchor, perhaps by hit-testing and spawning an object within the scene
    Vector3 hitPosition = new Vector3();
#if UNITY_IOS
    var screenPosition = Camera.main.ScreenToViewportPoint(new Vector3(0.5f, 0.5f));
    ARPoint point = new ARPoint
    {
        x = screenPosition.x,
        y = screenPosition.y
    };
    var hitResults = UnityARSessionNativeInterface.GetARSessionNativeInterface().HitTest(point, ARHitTestResultType.ARHitTestResultTypeEstimatedHorizontalPlane | ARHitTestResultType.ARHitTestResultTypeExistingPlaneUsingExtent);
    if (hitResults.Count > 0)
    {
        // The hitTest method sorts the resulting list by distance from the camera, increasing
        // The first hit result will usually be the most relevant when responding to user input
        ARHitTestResult hitResult = hitResults[0];
        hitPosition = UnityARMatrixOps.GetPosition(hitResult.worldTransform);
    }
#elif UNITY_ANDROID
    TrackableHit hit;
    TrackableHitFlags raycastFilter = TrackableHitFlags.PlaneWithinPolygon | TrackableHitFlags.FeaturePointWithSurfaceNormal;
    if (Frame.Raycast(0.5f, 0.5f, raycastFilter, out hit))
    {
        hitPosition = hit.Pose.position;
    }
#elif WINDOWS_UWP || UNITY_WSA
    RaycastHit hit;
    if (this.TryGazeHitTest(out hit))
    {
        hitPosition = hit.point;
    }
#endif

    Quaternion rotation = Quaternion.AngleAxis(0, Vector3.up);
    this.localAnchor = GameObject.Instantiate(/* some prefab */, hitPosition, rotation);
    this.localAnchor.AddARAnchor();

    // If the user is placing some application content in their environment,
    // you might show content at this anchor for a while, then save when
    // the user confirms placement.
    CloudSpatialAnchor cloudAnchor = new CloudSpatialAnchor();
    cloudAnchor.LocalAnchor = this.localAnchor.GetNativeAnchorPointer();
    await this.cloudSession.CreateAnchorAsync(cloudAnchor);
    this.feedback = $"Created a cloud anchor with ID={cloudAnchor.Identifier}");
```

In Objective-C:

```objc
    // Create a local anchor, perhaps by hit-testing and creating an ARAnchor
    NSArray<ARHitTestResult *> *hits = [_sceneView.session.currentFrame hitTest:CGPointMake(0.5, 0.5) types:ARHitTestResultTypeEstimatedHorizontalPlane];
    if ([hits count] == 0) return;
    // The hitTest method sorts the resulting list by distance from the camera, increasing
    // The first hit result will usually be the most relevant when responding to user input
    ARAnchor *localAnchor = [[ARAnchor alloc] initWithTransform:hits[0].worldTransform];
    [_sceneView.session addAnchor:localAnchor];

    // If the user is placing some application content in their environment,
    // you might show content at this anchor for a while, then save when
    // the user confirms placement.
    SSCCloudSpatialAnchor *cloudAnchor = [[SSCCloudSpatialAnchor alloc] init];
    cloudAnchor.localAnchor = localAnchor;
    [_cloudSession createAnchor:cloudAnchor withCompletionHandler:^(NSError *error) {
        if (error) {
            _feedback = [NSString stringWithFormat:@"Save Failed:%@", error.localizedDescription];
            return;
        }
        _feedback = [NSString stringWithFormat:@"Created a cloud anchor with ID=%@", cloudAnchor.identifier];
    }];
```

In Swift:

```swift
    // Create a local anchor, perhaps by hit-testing and creating an ARAnchor
    var localAnchor : ARAnchor? = nil
    let hits = self.sceneView.session.currentFrame?.hitTest(CGPoint(x:0.5, y:0.5), types: ARHitTestResult.ResultType.estimatedHorizontalPlane)
    if (hits!.count == 0) return
    // The hitTest method sorts the resulting list by distance from the camera, increasing
    // The first hit result will usually be the most relevant when responding to user input
    localAnchor = ARAnchor(transform:hits![0].worldTransform)
    self.sceneView.session.add(anchor: _localAnchor!)

    // If the user is placing some application content in their environment,
    // you might show content at this anchor for a while, then save when
    // the user confirms placement.
    var cloudAnchor : SSCCloudSpatialAnchor? = nil
    cloudAnchor = SSCCloudSpatialAnchor()
    cloudAnchor!.localAnchor = localAnchor
    _cloudSession?.createAnchor(cloudAnchor!, withCompletionHandler: { (error: Error?) in
        if (error != nil) {
            _feedback = "Save Failed:\(error!.localizedDescription)"
            return
        }
        _feedback = "Created a cloud anchor with ID=\(cloudAnchor!.identifier!)"
    })
```

In Java:

```java
    // Create a local anchor, perhaps by hit-testing and creating an ARAnchor
    Anchor localAnchor = null;
    List<HitResult> hitResults = mSession.update().hitTest(0.5f, 0.5f);
    for (HitResult hit : hitResults) {
        Trackable trackable = hit.getTrackable();
        if (trackable instanceof Plane) {
            if (((Plane) trackable).isPoseInPolygon(hit.getHitPose())) {
                localAnchor = hit.createAnchor();
                break;
            }
        }
    }

    // If the user is placing some application content in their environment,
    // you might show content at this anchor for a while, then save when
    // the user confirms placement.
    CloudSpatialAnchor cloudAnchor = new CloudSpatialAnchor();
    cloudAnchor.setLocalAnchor(localAnchor);
    Future createAnchorFuture = mCloudSession.createAnchorAsync(cloudAnchor);
    CheckForCompletion(createAnchorFuture, cloudAnchor);

    // ...

    private void CheckForCompletion(Future createAnchorFuture, CloudSpatialAnchor cloudAnchor) {
        new android.os.Handler().postDelayed(() -> {
            if (createAnchorFuture.isDone()) {
                try {
                    createAnchorFuture.get();
                    mFeedback = String.format("Created a cloud anchor with ID=%s", cloudAnchor.getIdentifier());
                }
                catch(InterruptedException e) {
                    mFeedback = String.format("Save Failed:%s", e.getMessage());
                }
                catch(ExecutionException e) {
                    mFeedback = String.format("Save Failed:%s", e.getMessage());
                }
            }
            else {
                CheckForCompletion(createAnchorFuture, cloudAnchor);
            }
        }, 500);
    }
```

In C++:

```cpp
    // Create a local anchor, perhaps by hit-testing and creating an ARAnchor
    ArAnchor* localAnchor;
    ArHitResultList* hit_result_list = nullptr;
    ArHitResultList_create(ar_session_, &hit_result_list);
    CHECK(hit_result_list);
    ArFrame_hitTest(ar_session_, ar_frame_, 0.5, 0.5, hit_result_list);
    int32_t hit_result_list_size = 0;
    ArHitResultList_getSize(ar_session_, hit_result_list, &hit_result_list_size);
    if (hit_result_list_size == 0) {
        ArHitResultList_destroy(hit_result_list);
        return;
    }
    ArHitResult* ar_hit = nullptr;
    ArHitResult_create(ar_session_, &ar_hit);
    // The hitTest method sorts the resulting list by distance from the camera, increasing
    // The first hit result will usually be the most relevant when responding to user input
    ArHitResultList_getItem(ar_session_, hit_result_list, 0, ar_hit);
    if (ArHitResult_acquireNewAnchor(ar_session_, ar_hit, &localAnchor) != AR_SUCCESS) return;
    ArTrackingState tracking_state = AR_TRACKING_STATE_STOPPED;
    ArAnchor_getTrackingState(ar_session_, localAnchor, &tracking_state);
    if (tracking_state != AR_TRACKING_STATE_TRACKING) {
        ArAnchor_release(localAnchor);
        ArHitResult_destroy(ar_hit);
        return;
    }
    ArHitResult_destroy(ar_hit);
    ar_hit = nullptr;
    ArHitResultList_destroy(hit_result_list);
    hit_result_list = nullptr;

    // If the user is placing some application content in their environment,
    // you might show content at this anchor for a while, then save when
    // the user confirms placement.
    std::shared_ptr<SpatialServices::CloudSpatialAnchor> cloudAnchor = std::make_shared<CloudSpatialAnchor>();
    cloudAnchor->LocalAnchor(localAnchor);
    cloudSession_->CreateAnchorAsync(cloudAnchor, [this, cloudAnchor](Status status) {
        std::ostringstream str;
        if (status != Status::OK) {
            str << "Save Failed: " << std::to_string(static_cast<uint32_t>(status));
            feedback_ = str.str();
            return;
        }
        str << "Created a cloud anchor with ID=" << cloudAnchor->Identifier();
        feedback_ = str.str();
    });
```

It's a good idea to make sure that there's sufficient environment data captured before trying to create a new cloud anchor.

In CSharp:

```csharp
    SessionStatus value = await this.cloudSession.GetSessionStatusAsync();
    if (value.RecommendedForCreateProgress < 1.0f) return;
    // Issue the creation request ...
```

In Objective-C:

```objc
    [_cloudSession getSessionStatusWithCompletionHandler:^(SSCSessionStatus *value, NSError *error) {
        if (error) {
            _feedback = [NSString stringWithFormat:@"Session status error:%@", error.localizedDescription];
            return;
        }
        if (value.readyForCreateProgress < 1.0f) return;
        // Issue the creation request ...
    }];
```

In Swift:

```swift
    _cloudSession?.getStatusWithCompletionHandler( { (value:SSCSessionStatus, error:Error?) in
        if (error != nil) {
            _feedback = "Session status error:\(error!.localizedDescription)"
            return
        }
        if (value!.readyForCreateProgress <> 1.0) {
            return
        }
        // Issue the creation request ...
    })
```

In Java:

```java
    Future<SessionStatus> sessionStatusFuture = mCloudSession.getSessionStatusAsync();
    CheckForCompletion(sessionStatusFuture);

    // ...

    private void CheckForCompletion(Future<SessionStatus> sessionStatusFuture) {
        new android.os.Handler().postDelayed(() -> {
            if (sessionStatusFuture.isDone()) {
                try {
                    SessionStatus value = sessionStatusFuture.get();
                    if (value.getRecommendedForCreateProgress() < 1.0f) return;
                    // Issue the creation request...
                }
                catch(InterruptedException e) {
                    mFeedback = String.format("Session status error:%s", e.getMessage());
                }
                catch(ExecutionException e) {
                    mFeedback = String.format("Session status error:%s", e.getMessage());
                }
            }
            else {
                CheckForCompletion(sessionStatusFuture);
            }
        }, 500);
    }
```

In C++:

```cpp
    cloudSession_->GetSessionStatusAsync([this](Status status, const std::shared_ptr<SessionStatus>& value) {
        if (status != Status::OK) {
            std::ostringstream str;
            str << "Session status error: " << std::to_string(static_cast<uint32_t>(status));
            feedback_ = str.str();
            return;
        }
        if (value->ReadyForCreateProgress() < 1.0f) return;
        // Issue the creation request ...
    });
```

## Setting anchor properties

You may choose to add some properties when saving your cloud anchors. Like the type of object being saved, or basic properties like whether it should be enabled for interaction. Doing so can be useful upon discovery: you can immediately render the object for the user, for example a picture frame with blank content. Then, a different download in the background gets additional state details, for example, the picture to display in the frame.

In CSharp:

```csharp
    CloudSpatialAnchor cloudAnchor = new CloudSpatialAnchor() { LocalAnchor = localAnchor };
    cloudAnchor.AppProperties[@"model-type"] = @"frame";
    cloudAnchor.AppProperties[@"label"] = @"my latest picture";
    await this.cloudSession.CreateAnchorAsync(cloudAnchor);
```

In Objective-C:

```objc
    SSCCloudSpatialAnchor *cloudAnchor = [[SSCCloudSpatialAnchor alloc] init];
    cloudAnchor.localAnchor = localAnchor;
    cloudAnchor.appProperties = @{ @"model-type" : @"frame", @"label" : @"my latest picture" };
    [_cloudSession createAnchor:cloudAnchor withCompletionHandler:^(NSError *error) {
        // ...
    });
```

In Swift:

```swift
    var cloudAnchor : SSCCloudSpatialAnchor? = nil
    cloudAnchor = SSCCloudSpatialAnchor()
    cloudAnchor!.localAnchor = localAnchor
    cloudAnchor!.appProperties = [ "model-type" : "frame", "label" : "my latest picture" ]
    _cloudSession?.createAnchor(cloudAnchor!, withCompletionHandler: { (error: Error?) in
        // ...
    })
```

In Java:

```java
    CloudSpatialAnchor cloudAnchor = new CloudSpatialAnchor();
    cloudAnchor.setLocalAnchor(localAnchor);
    Map<String,String> properties = cloudAnchor.getAppProperties();
    properties.put("model-type", "frame");
    properties.put("label", "my latest picture");
    Future createAnchorFuture = mCloudSession.createAnchorAsync(cloudAnchor);
    // ...
```

In C++:

```cpp
    std::shared_ptr<SpatialServices::CloudSpatialAnchor> cloudAnchor = std::make_shared<CloudSpatialAnchor>();
    cloudAnchor->LocalAnchor(localAnchor);
    auto properties = cloudAnchor->AppProperties();
    properties->Insert(R"(model-type)", R"(frame)");
    properties->Insert(R"(label)", R"(my latest picture)");
    cloudSession_->CreateAnchorAsync(cloudAnchor, [this, cloudAnchor](Status status) {
        // ...
    });
```

## Updating properties on an existing cloud spatial anchor

To update the properties on an anchor, you use the UpdateAnchorPropertiesAsync method.

In CSharp:

```csharp
    CloudSpatialAnchor anchor = /* locate your anchor */;
    anchor.AppProperties[@"last-user-access"] = @"just now";
    await this.cloudSession.UpdateAnchorPropertiesAsync(anchor);
```

In Objective-C:

```objc
    SSCCloudSpatialAnchor *anchor = /* locate your anchor */;
    [anchor.appProperties setValue:@"just now" forKey:@"last-user-access"];
    [_cloudSession updateAnchorProperties:anchor withCompletionHandler:^(NSError *error) {
        if (error) _feedback = [NSString stringWithFormat:@"Updating Properties Failed:%@", error.localizedDescription];
    }];
```

In Swift:

```swift
    var anchor : SSCCloudSpatialAnchor? = /* locate your anchor */;
    anchor!.appProperties["last-user-access"] = "just now"
    _cloudSession?.updateAnchorProperties(anchor!, withCompletionHandler: { (error:Error?) in
        if (error != nil) {
            _feedback = "Updating Properties Failed:\(error!.localizedDescription)"
        }
    })
```

In Java:

```java
    CloudSpatialAnchor anchor = /* locate your anchor */;
    anchor.getAppProperties().put("last-user-access", "just now");
    Future updateAnchorPropertiesFuture = mCloudSession.updateAnchorPropertiesAsync(anchor);
    CheckForCompletion(updateAnchorPropertiesFuture);

    // ...

    private void CheckForCompletion(Future updateAnchorPropertiesFuture) {
        new android.os.Handler().postDelayed(() -> {
            if (updateAnchorPropertiesFuture.isDone()) {
                try {
                    updateAnchorPropertiesFuture.get();
                }
                catch(InterruptedException e) {
                    mFeedback = String.format("Updating Properties Failed:%s", e.getMessage());
                }
                catch(ExecutionException e) {
                    mFeedback = String.format("Updating Properties Failed:%s", e.getMessage());
                }
            }
            else {
                CheckForCompletion1(updateAnchorPropertiesFuture);
            }
        }, 500);
    }
```

In C++:

```cpp
    std::shared_ptr<SpatialServices::CloudSpatialAnchor> anchor = /* locate your anchor */;
    auto properties = anchor->AppProperties();
    properties->Lookup(R"(last-user-access)") = R"(just now)";
    cloudSession_->UpdateAnchorPropertiesAsync(anchor, [this](Status status) {
        if (status != Status::OK) {
            std::ostringstream str;
            str << "Updating Properties Failed: " << std::to_string(static_cast<uint32_t>(status));
            feedback_ = str.str();
        }
    });
```

You can't update the location of an anchor once it has been created on the service - you must create a new anchor and delete the old one to track a new position.

If you don't need to locate an anchor to update its properties, you can use the GetAnchorPropertiesAsync method, which returns a CloudSpatialAnchor object with properties.

In CSharp:

```csharp
    var anchor = await cloudSession.GetAnchorPropertiesAsync(@"anchorId");
    if (anchor != nullptr)
    {
        anchor.AppProperties[@"last-user-access"] = @"just now";
        await this.cloudSession.UpdateAnchorPropertiesAsync(anchor);
    }
```

In Objective-C:

```objc
    [_cloudSession getAnchorProperties:@"anchorId" withCompletionHandler:^(SCCCloudSpatialAnchor *anchor, NSError *error) {
        if (error) {
            _feedback = [NSString stringWithFormat:@"Getting Properties Failed:%@", error.localizedDescription];
            return;
        }
        if (anchor) {
            [anchor.appProperties setValue:@"just now" forKey:@"last-user-access"];
            [_cloudSession updateAnchorProperties:anchor withCompletionHandler:^(NSError *error) {
                // ...
            }];
        }
    }];
```

In Swift:

```swift
    _cloudSession?.getAnchorProperties("anchorId", withCompletionHandler: { (anchor:SCCCloudSpatialAnchor?, error:Error?) in
        if (error != nil) {
            _feedback = "Getting Properties Failed:\(error!.localizedDescription)"
        }
        if (anchor != nil) {
            anchor!.appProperties["last-user-access"] = "just now"
            _cloudSession?.updateAnchorProperties(anchor!, withCompletionHandler: { (error:Error?) in
                // ...
            })
        }
    })

```

In Java:

```java
    Future<CloudSpatialAnchor> getAnchorPropertiesFuture = mCloudSession.getAnchorPropertiesAsync("anchorId");
    CheckForCompletion(getAnchorPropertiesFuture);

    // ...

    private void CheckForCompletion(Future<CloudSpatialAnchor> getAnchorPropertiesFuture) {
        new android.os.Handler().postDelayed(() -> {
            if (getAnchorPropertiesFuture.isDone()) {
                try {
                    CloudSpatialAnchor anchor = getAnchorPropertiesFuture.get();
                    if (anchor != null) {
                        anchor.getAppProperties().put("last-user-access", "just now");
                        Future updateAnchorPropertiesFuture = mCloudSession.updateAnchorPropertiesAsync(anchor);
                        // ...
                    }
                } catch (InterruptedException e) {
                    mFeedback = String.format("Getting Properties Failed:%s", e.getMessage());
                } catch (ExecutionException e) {
                    mFeedback = String.format("Getting Properties Failed:%s", e.getMessage());
                }
            } else {
                CheckForCompletion(getAnchorPropertiesFuture);
            }
        }, 500);
    }
```

In C++:

```cpp
    cloudSession_->GetAnchorPropertiesAsync(R"(anchorId)", [this](Status status, const std::shared_ptr<SpatialServices::CloudSpatialAnchor>& anchor) {
        if (status != Status::OK) {
            std::ostringstream str;
            str << "Getting Properties Failed: " << std::to_string(static_cast<uint32_t>(status));
            feedback_ = str.str();
            return;
        }
        if (anchor != nullptr) {
            auto properties = anchor->AppProperties();
            properties->Lookup(R"(last-user-access)") = R"(just now)";
            cloudSession_->UpdateAnchorPropertiesAsync(anchor, [this](Status status) {
                // ...
            });
        }
    });
```

## Setting anchor expiration

It's also possible to configure your anchor to expire automatically at a given date in the future. When an anchor expires, it will no longer be located or updated. Expiration can only be set when the anchor is created. Updating expiration afterwards isn't possible. So, you can set its expiration before saving it to the cloud.


In CSharp:

```csharp
    cloudAnchor.Expiration = DateTimeOffset.Now.AddDays(7);
```

In Objective-C:

```objc
    int secondsInAWeek = 60 * 60 * 24 * 7;
    NSDate *oneWeekFromNow = [[NSDate alloc] initWithTimeIntervalSinceNow: (NSTimeInterval) secondsInAWeek];
    cloudAnchor.expiration = oneWeekFromNow;
```

In Swift:

```swift
    let secondsInAWeek = 60.0 * 60.0 * 24.0 * 7.0
    let oneWeekFromNow = Date(timeIntervalSinceNow: secondsInAWeek)
    cloudAnchor!.expiration = oneWeekFromNow
```

In Java:

```java
    Date now = new Date();
    Calendar cal = Calendar.getInstance();
    cal.setTime(now);
    cal.add(Calendar.DATE, 7);
    Date oneWeekFromNow = cal.getTime();
    cloudAnchor.setExpiration(oneWeekFromNow);
```

In C++:

```cpp
    std::chrono::system_clock::time_point now = std::chrono::system_clock::now();
    std::chrono::system_clock::time_point oneWeekFromNow = now + std::chrono::hours(7 * 24);
    const int64_t oneWeekFromNowUnixEpochTimeMs = std::chrono::duration_cast<std::chrono::milliseconds>(oneWeekFromNow.time_since_epoch()).count();
    cloudAnchor->Expiration(oneWeekFromNowUnixEpochTimeMs);
```

## Locating a cloud spatial anchor

To locate cloud spatial anchors, you'll need to know their identifiers. Anchor IDs can be stored in your application’s backend service, and accessible to all devices that can properly authenticate to it. For an example of this see [Tutorial: Share Spatial Anchors across devices](../tutorials/tutorial-share-anchors-across-devices.md).

Instantiate an AnchorLocateCriteria object, set the identifiers you're looking for, and invoke the CreateWatcher method on the session by providing your AnchorLocateCriteria.

In CSharp:

```csharp
    AnchorLocateCriteria criteria = new AnchorLocateCriteria();
    criteria.Identifiers = new string[] { @"id1", @"id2", @"id3" };
    this.cloudSession.CreateWatcher(criteria);
```

In Objective-C:

```objc
    SSCAnchorLocateCriteria *criteria = [SSCAnchorLocateCriteria new];
    criteria.identifiers = @[ @"id1", @"id2", @"id3" ];
    [_cloudSession createWatcher:criteria];
```

In Swift:

```swift
    let criteria = SSCAnchorLocateCriteria()!
    criteria.identifiers = [ "id1", "id2", "id3" ]
    _cloudSession!.createWatcher(criteria)
```

In Java:

```java
    AnchorLocateCriteria criteria = new AnchorLocateCriteria();
    criteria.setIdentifiers(new String[] { "id1", "id2", "id3" });
    mCloudSession.createWatcher(criteria);
```

In C++:

```cpp
    auto criteria = std::make_shared<AnchorLocateCriteria>();
    criteria->Identifiers({ R"(id1)", R"(id2)", R"(id3)" });
    auto cloudSpatialAnchorWatcher = cloudSession_->CreateWatcher(criteria);
```

After your watcher is created, the AnchorLocated event will fire for every anchor requested. This event fires when an anchor is located, or if the anchor can't be located. If this situation happens, the reason will be stated in the status. After all anchors for a watcher are processed, found or not found, then the LocateAnchorsCompleted event will fire.

In CSharp:

```csharp
    this.cloudSession.AnchorLocated += (object sender, AnchorLocatedEventArgs args) =>
    {
        switch (args.Status)
        {
            case LocateAnchorStatus.Located:
                CloudSpatialAnchor foundAnchor = args.Anchor;
                // Go add your anchor to the scene...
                break;
            case LocateAnchorStatus.AlreadyTracked:
                // This anchor has already been reported and is being tracked
                break;
            case LocateAnchorStatus.NotLocatedAnchorDoesNotExist:
                // The anchor was deleted or never exited in the first place
                // Drop it, or show UI to ask user to anchor the content anew
                break;
            case LocateAnchorStatus.NotLocatedNeedsMoreData:
                // The anchor hasn't been found given the location data
                // The user might in the wrong location, or maybe more data will help
                // Show UI to tell user to keep looking around
                break;
            case LocateAnchorStatus.NotLocatedAnchorOrphaned:
                // The anchor hasn't been found in a long time, space data is missing
                // You can issue a query for properties if you keep
                // metadata there to help user re-anchor content somewhere
                break;
        }
    }
```

In Objective-C:

```objc
    - (void)anchorLocated:(SSCCloudSpatialAnchorSession *)cloudSession :(SSCAnchorLocatedEventArgs *)args {
        SSCLocateAnchorStatus status = [args status];
        switch (status) {
        case SSCLocateAnchorStatusLocated: {
            SSCCloudSpatialAnchor *foundAnchor = [args anchor];
            // Go add your anchor to the scene...
        }
            break;
        case SSCLocateAnchorStatusAlreadyTracked:
            // This anchor has already been reported and is being tracked
            break;
        case SSCLocateAnchorStatusNotLocatedAnchorDoesNotExist:
            // The anchor was deleted or never exited in the first place
            // Drop it, or show UI to ask user to anchor the content anew
            break;
        case SSCLocateAnchorStatusNotLocatedNeedsMoreData:
            // The anchor hasn't been found given the location data
            // The user might in the wrong location, or maybe more data will help
            // Show UI to tell user to keep looking around
            break;
        case SSCLocateAnchorStatusNotLocatedAnchorOrphaned:
            // The anchor hasn't been found in a long time, space data is missing
            // You can issue a query for properties if you keep
            // metadata there to help user re-anchor content somewhere
            break;
        }
    }
```

In Swift:

```swift
    internal func anchorLocated(_ cloudSession: SSCCloudSpatialAnchorSession!, _ args: SSCAnchorLocatedEventArgs!) {
        let status = args.status
        switch (status) {
        case SSCLocateAnchorStatus.located:
            let foundAnchor = args.anchor
            // Go add your anchor to the scene...
            break
        case SSCLocateAnchorStatus.alreadyTracked:
            // This anchor has already been reported and is being tracked
            break
        case SSCLocateAnchorStatus.notLocatedAnchorDoesNotExist:
            // The anchor was deleted or never exited in the first place
            // Drop it, or show UI to ask user to anchor the content anew
            break
        case SSCLocateAnchorStatus.notLocatedNeedsMoreData:
            // The anchor hasn't been found given the location data
            // The user might in the wrong location, or maybe more data will help
            // Show UI to tell user to keep looking around
            break
        case SSCLocateAnchorStatus.notLocatedAnchorOrphaned:
            // The anchor hasn't been found in a long time, space data is missing
            // You can issue a query for properties if you keep
            // metadata there to help user re-anchor content somewhere
            break
        }
    }
```

In Java:

```java
    mCloudSession.addAnchorLocatedListener(args -> {
        switch (args.getStatus()) {
            case Located:
                CloudSpatialAnchor foundAnchor = args.getAnchor();
                // Go add your anchor to the scene...
                break;
            case AlreadyTracked:
                // This anchor has already been reported and is being tracked
                break;
            case NotLocatedAnchorDoesNotExist:
                // The anchor was deleted or never exited in the first place
                // Drop it, or show UI to ask user to anchor the content anew
                break;
            case NotLocatedNeedsMoreData:
                // The anchor hasn't been found given the location data
                // The user might in the wrong location, or maybe more data will help
                // Show UI to tell user to keep looking around
                break;
            case NotLocatedAnchorOrphaned:
                // The anchor hasn't been found in a long time, space data is missing
                // You can issue a query for properties if you keep
                // metadata there to help user re-anchor content somewhere
                break;
        }
    });
```

In C++:

```cpp
    auto anchorLocatedToken = cloudSession_->AnchorLocated([this](auto &&, auto &&args) {
        switch (args->Status()) {
            case LocateAnchorStatus::Located: {
                std::shared_ptr<SpatialServices::CloudSpatialAnchor> foundAnchor = args->Anchor();
                // Go add your anchor to the scene...
            }
                break;
            case LocateAnchorStatus::AlreadyTracked:
                // This anchor has already been reported and is being tracked
                break;
            case LocateAnchorStatus::NotLocatedAnchorDoesNotExist:
                // The anchor was deleted or never exited in the first place
                // Drop it, or show UI to ask user to anchor the content anew
                break;
            case LocateAnchorStatus::NotLocatedNeedsMoreData:
                // The anchor hasn't been found given the location data
                // The user might in the wrong location, or maybe more data will help
                // Show UI to tell user to keep looking around
                break;
            case LocateAnchorStatus::NotLocatedAnchorOrphaned:
                // The anchor hasn't been found in a long time, space data is missing
                // You can issue a query for properties if you keep
                // metadata there to help user re-anchor content somewhere
                break;
        }
    });
```

## Deleting anchors

To delete a cloud spatial anchor, you use the DeleteAnchorAsync method.

In CSharp:

```csharp
    await this.cloudSession..DeleteAnchorAsync(cloudAnchor);
    // Perform any processing you may want when delete finishes
```

In Objective-C:

```objc
    [_cloudSession deleteAnchor:cloudAnchor withCompletionHandler:^(NSError *error) {
        // Perform any processing you may want when delete finishes
    }];
```

In Swift:

```swift
    _cloudSession?.delete(cloudAnchor!, withCompletionHandler: { (error: Error?) in
        // Perform any processing you may want when delete finishes
    })
```

In Java:

```java
    Future deleteAnchorFuture = mCloudSession.deleteAnchorAsync(cloudAnchor);
    // Perform any processing you may want when delete finishes (deleteAnchorFuture is done)
```

In C++:

```cpp
    cloudSession_->DeleteAnchorAsync(cloudAnchor, [this](Status status) {
        // Perform any processing you may want when delete finishes
    });
```

## Pausing, resetting, or stopping the session

To stop the session temporarily, you can invoke the Stop method. Doing so will stop any watchers and environment processing, even if you invoke ProcessFrame(). You can then invoke Start() to resume processing. When resuming, environment data already captured in the session is maintained.

In CSharp:

```csharp
    this.cloudSession.Stop();
```

In Objective-C:

```objc
    [_cloudSession stop];
```

In Swift:

```swift
    _cloudSession!.stop()
```

In Java:

```java
    mCloudSession.stop();
```

In C++:

```cpp
    cloudSession_->Stop();
```

To reset the environment data that has been captured in your session, you can invoke the Reset method.

In CSharp:

```csharp
    this.cloudSession.Reset();
```

In Objective-C:

```objc
    [_cloudSession reset];
```

In Swift:

```swift
    _cloudSession!.reset()
```

In Java:

```java
    mCloudSession.reset();
```

In C++:

```cpp
    cloudSession_->Reset();
```

To clean up properly after a session, invoke the Dispose() method in C#, close() on java, or release all references in other languages.

In CSharp:

```csharp
    this.cloudSession.Dispose();
```

In Objective-C:

```objc
    _cloudSession = NULL;
```

In Swift:

```swift
    _cloudSession = nil
```

In Java:

```java
    mCloudSession.close();
```

In C++:

```cpp
    cloudSession_ = nullptr;
```
