---
title: Integrate TelecomManager into the UI Library
titleSuffix: An Azure Communication Services how-to guide
description: Use the Azure Communication Services UI Library to integrate TelecomManager.
author: iaulakh
ms.author: iaulakh
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 12/19/2023
ms.custom: template-how-to
zone_pivot_groups: acs-plat-android
---

# Integrate TelecomManager into the UI Library

The Azure Communication Services UI Library provides out-of-the-box support for TelecomManager. Developers can provide their own configuration for TelecomManager to be used for the UI Library.

In this article, you learn how to set up TelecomManager correctly by using the UI Library in your application.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the call client. [Get a user access token](../../quickstarts/identity/access-tokens.md).
- Optional: Completion of the [QuickStart for getting started with the UI Library composites](../../quickstarts/ui-library/get-started-composites.md).

For more information, see the [open-source Android UI Library](https://github.com/Azure/communication-ui-library-android) and the [sample application code](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-calling).

## Set up TelecomManager integration

The Azure Communication Services Calling SDK supports TelecomManager integration. You can enable this integration in the UI Library by configuring an instance of `CallCompositeTelecomManagerOptions`. For more information, see [Integrate with TelecomManager](../calling-sdk/telecommanager-integration.md).

`CallCompositeTelecomManagerIntegrationMode` provides options for `SDK_PROVIDED_TELECOM_MANAGER` and `APPLICATION_IMPLEMENTED_TELECOM_MANAGER`. `SDK_PROVIDED_TELECOM_MANAGER` requires `phoneAccountId` and use implementation from calling SDK. `APPLICATION_IMPLEMENTED_TELECOM_MANAGER` is for if TelecomManager is integrated in application.

#### [Kotlin](#tab/kotlin)

```kotlin
    val callComposite: CallComposite = CallCompositeBuilder()
        .telecomManagerOptions(CallCompositeTelecomManagerOptions(
            CallCompositeTelecomManagerIntegrationMode.SDK_PROVIDED_TELECOM_MANAGER,
            "app_id"
        )).build()
```

#### [Java](#tab/java)
```java
    CallComposite callComposite = new CallCompositeBuilder()
        .telecomManagerOptions(new CallCompositeTelecomManagerOptions(
                CallCompositeTelecomManagerIntegrationMode.SDK_PROVIDED_TELECOM_MANAGER,
                "PHONE_ACCOUNT_ID"
        )).build();
```

-----

## Hold and Resume API

For `APPLICATION_IMPLEMENTED_TELECOM_MANAGER` use `hold` and `resume` to manage call state.

#### [Kotlin](#tab/kotlin)

```kotlin
    callComposite.hold()?.whenComplete { _, error ->  }
    callComposite.resume()?.whenComplete { _, error ->  }
```

#### [Java](#tab/java)
```java
    callComposite.hold().whenComplete((aVoid, throwable) -> {
            // Handle error
        });

    callComposite.resume().whenComplete((aVoid, throwable) -> {
            // Handle error
        });
```

-----

## Next steps

- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)