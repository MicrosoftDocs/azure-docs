---
author: craigktreasure
ms.service: azure-spatial-anchors
ms.topic: include
ms.date: 1/2/2019
ms.author: crtreasu
---
The next step is to configure the app to use your account identifier and account key. You copied them into a text editor when [setting up the Spatial Anchors resource](#create-a-spatial-anchors-resource).

In the **Project** pane, navigate to `Assets\AzureSpatialAnchors.SDK\Resources`. Select `SpatialAnchorConfig`. Then, in the **Inspector** pane, enter the `Account Key` as the value for `Spatial Anchors Account Key` and the `Account ID` as the value for `Spatial Anchors Account Id`.

Next, open up `SpatialAnchorManager.cs`. Find `CreateSessionAsync()` and add the following line, substituting in your account domain from earlier: `session.Configuration.AccountDomain = "MyAccountDomain";`. You can add this line directly before this comment `// Configure authentication`.
