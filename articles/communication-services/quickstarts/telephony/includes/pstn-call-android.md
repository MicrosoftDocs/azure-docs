---
author: nikuklic
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/10/2021
ms.author: nikuklic
---
[!INCLUDE [Emergency Calling Notice](../../../includes/emergency-calling-notice-include.md)]

## Sample Code

Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/Add%20Telephone%20Calling)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A [phone number acquired](../get-phone-number.md) in your Communication Services resource, or Azure Communication Services [Direct Routing configured](../../../concepts/telephony/direct-routing-provisioning.md). If you have a free subscription, you can [get a trial phone number](../../telephony/get-trial-phone-number.md).
- A `User Access Token` to enable the call client. For more information on [how to get a `User Access Token`](../../identity/access-tokens.md)
- Complete the quickstart for [getting started with adding calling to your application](../../voice-video-calling/getting-started-with-calling.md)

### Prerequisite check

- To view the phone numbers associated with your Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/), locate your Communication Services resource and open the **phone numbers** tab from the left navigation pane.

## Setting up

### Add PSTN functionality to your app

Add the `PhoneNumber` type to your app by modifying **MainActivity.java**:

```java
import com.azure.android.communication.common.PhoneNumberIdentifier;
```

## Start a call to phone

Specify the phone number you acquired from within your Communication Services resource. This number is used as a caller ID to start the call:

> [!WARNING]
> Note that phone numbers should be provided in E.164 international standard format. (e.g.: +12223334444)

Modify `startCall()` event handler in **MainActivity.java**, so that it handles phone calls:

```java
    private void startCall() {
        EditText calleePhoneView = findViewById(R.id.callee_id);
        String calleePhone = calleePhoneView.getText().toString();
        PhoneNumberIdentifier callerPhone = new PhoneNumberIdentifier("+12223334444");
        StartCallOptions options = new StartCallOptions();
        options.setAlternateCallerId(callerPhone);
        options.setVideoOptions(new VideoOptions(null));
        call = agent.startCall(
                getApplicationContext(),
                new PhoneNumberIdentifier[] {new PhoneNumberIdentifier(calleePhone)},
                options);
    }
```

## Launch the app and call the echo bot

The app can now be launched using the "Run App" button on the toolbar (Shift+F10). To make a call, provide a phone number in the added text field and select the **CALL** button.
> [!WARNING]
> Note that phone numbers should be provided in E.164 international standard format. (e.g.: +12223334444)

![Screenshot showing the completed application.](../media/pstn-call/quickstart-android-call-pstn.png)
