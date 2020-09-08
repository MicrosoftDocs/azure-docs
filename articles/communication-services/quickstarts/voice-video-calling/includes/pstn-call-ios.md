> [!WARNING]
> This document is under construction and needs the following items to be addressed: 

## Prerequisites
To be able to place an outgoing telephone call, you need following:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- An Azure Communication Service resource. Further details can be found in the [Create an Azure Communication Resource](../../create-communication-resource.md) quickstart.
- Complete the quickstart for adding calling to your application [here](../getting-started-with-calling.md)
- A Communication Services configured telephone number(s). Further details can be found in the [Buy a telephone number](../../telephony-sms/get-phone-number.md) quickstart.

## Place an outgoing telephone call to users and PSTN

You can initiate a call out to a phone number using the Call method of the CallClient you initialized in the previous step. If you don't specify any Caller ID, one of your acquired numbers from the Azure Communication Service resource will be used as a Caller ID and that is what a callee will see.

```swift

let placeCallOptions = ACSPlaceCallOptions();
let groupCall = self.CallingApp.adHocCallClient.callWithParticipants(participants: [PHONE NUMBER TO CALL], options: placeCallOptions);

```

> [!WARNING]
> Available Soon

## Place an outgoing telephone call with explicitly selected Caller ID
In case you want to initiate a call out to a phone number using specific Caller ID, you can use following code to do so. Please note that the number you use as a Caller ID has to belong the to Azure Communication Service resource you used to initialize the CallClient, otherwise the call out will fail.

```swift

let placeCallOptions = ACSPlaceCallOptions(fromCallerId: OWNED PHONE NUMBER);
let groupCall = self.CallingApp.adHocCallClient.callWithParticipants(participants: [PHONE NUMBER TO CALL], options: placeCallOptions);

```

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You can find out more about cleaning up resources [here](../../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:
- Check out our calling hero sample [here](../../../samples/calling-hero-sample.md)
- Learn how to add video to your calls [here](../add-video-to-app.md)
- Learn more about how calling works [here](../../../concepts/voice-video-calling/about-call-types.md)
