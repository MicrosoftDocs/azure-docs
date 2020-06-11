---
title: Create & locate anchors in Java
description: In-depth explanation of how to create and locate anchors using Azure Spatial Anchors in Java.
author: ramonarguelles
manager: vriveras
services: azure-spatial-anchors

ms.author: rgarcia
ms.date: 02/24/2019
ms.topic: tutorial
ms.service: azure-spatial-anchors
---
# How to create and locate anchors using Azure Spatial Anchors in Java

> [!div  class="op_single_selector"]
> * [Unity](create-locate-anchors-unity.md)
> * [Objective-C](create-locate-anchors-objc.md)
> * [Swift](create-locate-anchors-swift.md)
> * [Android Java](create-locate-anchors-java.md)
> * [C++/NDK](create-locate-anchors-cpp-ndk.md)
> * [C++/WinRT](create-locate-anchors-cpp-winrt.md)

Azure Spatial Anchors allow you to share anchors in the world between different devices. It supports several different development environments. In this article, we'll dive into how to use the Azure Spatial Anchors SDK, in Java, to:

- Correctly set up and manage an Azure Spatial Anchors session.
- Create and set properties on local anchors.
- Upload them to the cloud.
- Locate and delete cloud spatial anchors.

## Prerequisites

To complete this guide, make sure you have:

- Read through the [Azure Spatial Anchors overview](../overview.md).
- Completed one of the [5-minute Quickstarts](../index.yml).
- Basic knowledge on Java.
- Basic knowledge on <a href="https://developers.google.com/ar/discover/" target="_blank">ARCore</a>.

[!INCLUDE [Start](../../../includes/spatial-anchors-create-locate-anchors-start.md)]

Learn more about the [CloudSpatialAnchorSession](https://docs.microsoft.com/java/api/com.microsoft.azure.spatialanchors.cloudspatialanchorsession) class.

```java
    private CloudSpatialAnchorSession mCloudSession;
    // In your view handler
    mCloudSession = new CloudSpatialAnchorSession();
```

[!INCLUDE [Account Keys](../../../includes/spatial-anchors-create-locate-anchors-account-keys.md)]

Learn more about the [SessionConfiguration](https://docs.microsoft.com/java/api/com.microsoft.azure.spatialanchors.sessionconfiguration) class.

```java
    mCloudSession.getConfiguration().setAccountKey("MyAccountKey");
```

[!INCLUDE [Access Tokens](../../../includes/spatial-anchors-create-locate-anchors-access-tokens.md)]

```java
    mCloudSession.getConfiguration().setAccessToken("MyAccessToken");
```

[!INCLUDE [Access Tokens Event](../../../includes/spatial-anchors-create-locate-anchors-access-tokens-event.md)]

Learn more about the [TokenRequiredListener](https://docs.microsoft.com/java/api/com.microsoft.azure.spatialanchors.tokenrequiredlistener) interface.

```java
    mCloudSession.addTokenRequiredListener(args -> {
        args.setAccessToken("MyAccessToken");
    });
```

[!INCLUDE [Asynchronous Tokens](../../../includes/spatial-anchors-create-locate-anchors-asynchronous-tokens.md)]

```java
    mCloudSession.addTokenRequiredListener(args -> {
        CloudSpatialAnchorSessionDeferral deferral = args.getDeferral();
        MyGetTokenAsync(myToken -> {
            if (myToken != null) args.setAccessToken(myToken);
            deferral.complete();
        });
    });
```

[!INCLUDE [Azure AD Tokens](../../../includes/spatial-anchors-create-locate-anchors-aad-tokens.md)]

```java
    mCloudSession.getConfiguration().setAuthenticationToken("MyAuthenticationToken");
```

[!INCLUDE [Azure AD Tokens Event](../../../includes/spatial-anchors-create-locate-anchors-aad-tokens-event.md)]

```java
    mCloudSession.addTokenRequiredListener(args -> {
        args.setAuthenticationToken("MyAuthenticationToken");
    });
```

[!INCLUDE [Asynchronous Tokens](../../../includes/spatial-anchors-create-locate-anchors-asynchronous-tokens.md)]

```java
    mCloudSession.addTokenRequiredListener(args -> {
        CloudSpatialAnchorSessionDeferral deferral = args.getDeferral();
        MyGetTokenAsync(myToken -> {
            if (myToken != null) args.setAuthenticationToken(myToken);
            deferral.complete();
        });
    });
```

[!INCLUDE [Setup](../../../includes/spatial-anchors-create-locate-anchors-setup-non-ios.md)]

Learn more about the [start](https://docs.microsoft.com/java/api/com.microsoft.azure.spatialanchors.cloudspatialanchorsession.start) method.

```java
    mCloudSession.setSession(mSession);
    mCloudSession.start();
```

[!INCLUDE [Frames](../../../includes/spatial-anchors-create-locate-anchors-frames.md)]

Learn more about the [processFrame](https://docs.microsoft.com/java/api/com.microsoft.azure.spatialanchors.cloudspatialanchorsession.processframe) method.

```java
    mCloudSession.processFrame(mSession.update());
```

[!INCLUDE [Feedback](../../../includes/spatial-anchors-create-locate-anchors-feedback.md)]

Learn more about the [SessionUpdatedListener](https://docs.microsoft.com/java/api/com.microsoft.azure.spatialanchors.sessionupdatedlistener) interface.

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

[!INCLUDE [Creating](../../../includes/spatial-anchors-create-locate-anchors-creating.md)]

Learn more about the [CloudSpatialAnchor](https://docs.microsoft.com/java/api/com.microsoft.azure.spatialanchors.cloudspatialanchor) class.

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

[!INCLUDE [Session Status](../../../includes/spatial-anchors-create-locate-anchors-session-status.md)]

Learn more about the [getSessionStatusAsync](https://docs.microsoft.com/java/api/com.microsoft.azure.spatialanchors.cloudspatialanchorsession.getsessionstatusasync) method.

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

[!INCLUDE [Setting Properties](../../../includes/spatial-anchors-create-locate-anchors-setting-properties.md)]

Learn more about the [getAppProperties](https://docs.microsoft.com/java/api/com.microsoft.azure.spatialanchors.cloudspatialanchor.getappproperties) method.

```java
    CloudSpatialAnchor cloudAnchor = new CloudSpatialAnchor();
    cloudAnchor.setLocalAnchor(localAnchor);
    Map<String,String> properties = cloudAnchor.getAppProperties();
    properties.put("model-type", "frame");
    properties.put("label", "my latest picture");
    Future createAnchorFuture = mCloudSession.createAnchorAsync(cloudAnchor);
    // ...
```

[!INCLUDE [Update Anchor Properties](../../../includes/spatial-anchors-create-locate-anchors-updating-properties.md)]

Learn more about the [updateAnchorPropertiesAsync](https://docs.microsoft.com/java/api/com.microsoft.azure.spatialanchors.cloudspatialanchorsession.updateanchorpropertiesasync) method.

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

[!INCLUDE [Getting Properties](../../../includes/spatial-anchors-create-locate-anchors-getting-properties.md)]

Learn more about the [getAnchorPropertiesAsync](https://docs.microsoft.com/java/api/com.microsoft.azure.spatialanchors.cloudspatialanchorsession.getanchorpropertiesasync) method.

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

[!INCLUDE [Expiration](../../../includes/spatial-anchors-create-locate-anchors-expiration.md)]

Learn more about the [setExpiration](https://docs.microsoft.com/java/api/com.microsoft.azure.spatialanchors.cloudspatialanchor.setexpiration) method.

```java
    Date now = new Date();
    Calendar cal = Calendar.getInstance();
    cal.setTime(now);
    cal.add(Calendar.DATE, 7);
    Date oneWeekFromNow = cal.getTime();
    cloudAnchor.setExpiration(oneWeekFromNow);
```

[!INCLUDE [Locate](../../../includes/spatial-anchors-create-locate-anchors-locating.md)]

Learn more about the [createWatcher](https://docs.microsoft.com/java/api/com.microsoft.azure.spatialanchors.cloudspatialanchorsession.createwatcher) method.

```java
    AnchorLocateCriteria criteria = new AnchorLocateCriteria();
    criteria.setIdentifiers(new String[] { "id1", "id2", "id3" });
    mCloudSession.createWatcher(criteria);
```

[!INCLUDE [Locate Events](../../../includes/spatial-anchors-create-locate-anchors-locating-events.md)]

Learn more about the [AnchorLocatedListener](https://docs.microsoft.com/java/api/com.microsoft.azure.spatialanchors.anchorlocatedlistener) interface.

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
                // The anchor was deleted or never existed in the first place
                // Drop it, or show UI to ask user to anchor the content anew
                break;
            case NotLocated:
                // The anchor hasn't been found given the location data
                // The user might in the wrong location, or maybe more data will help
                // Show UI to tell user to keep looking around
                break;
        }
    });
```

[!INCLUDE [Deleting](../../../includes/spatial-anchors-create-locate-anchors-deleting.md)]

Learn more about the [deleteAnchorAsync](https://docs.microsoft.com/java/api/com.microsoft.azure.spatialanchors.cloudspatialanchorsession.deleteanchorasync) method.

```java
    Future deleteAnchorFuture = mCloudSession.deleteAnchorAsync(cloudAnchor);
    // Perform any processing you may want when delete finishes (deleteAnchorFuture is done)
```

[!INCLUDE [Stopping](../../../includes/spatial-anchors-create-locate-anchors-stopping.md)]

Learn more about the [stop](https://docs.microsoft.com/java/api/com.microsoft.azure.spatialanchors.cloudspatialanchorsession.stop) method.

```java
    mCloudSession.stop();
```

[!INCLUDE [Resetting](../../../includes/spatial-anchors-create-locate-anchors-resetting.md)]

Learn more about the [reset](https://docs.microsoft.com/java/api/com.microsoft.azure.spatialanchors.cloudspatialanchorsession.reset) method.

```java
    mCloudSession.reset();
```

[!INCLUDE [Cleanup](../../../includes/spatial-anchors-create-locate-anchors-cleanup-java.md)]

Learn more about the [close](https://docs.microsoft.com/java/api/com.microsoft.azure.spatialanchors.cloudspatialanchorsession.close) method.

```java
    mCloudSession.close();
```

[!INCLUDE [Next Steps](../../../includes/spatial-anchors-create-locate-anchors-next-steps.md)]
