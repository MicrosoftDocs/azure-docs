---
title: Extensibility of precall for Microsoft Teams Virtual appointments
description: Extend Microsoft Teams Virtual appointments precall activities with Azure Communication Services
author: tchladek
manager: chpalm
services: azure-communication-services

ms.author: tchladek
ms.date: 05/22/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Extend precall activities
A successful Virtual appointment experience requires the device to be prepared for the audio and video experience. Azure Communication Services provides a set of tools that help to validate the device prerequisites before the Virtual appointment guided support.

## Prerequisites
The reader of this article is expected to have a solid understanding of the following topics:
-	[Microsoft Teams Virtual appointments](https://www.microsoft.com/microsoft-teams/premium/virtual-appointments) product and provided [user experience](https://guidedtour.microsoft.com/guidedtour/industry-longform/virtual-appointments/1/1) 
-	[Microsoft Graph Booking API](/graph/api/resources/booking-api-overview) to manage [Microsoft Booking](https://www.microsoft.com/microsoft-365/business/scheduling-and-booking-app) via [Microsoft Graph API](/graph/overview)
-	[Microsoft Graph Online meeting API](/graph/api/resources/onlinemeeting) to manage [Microsoft Teams meetings](https://www.microsoft.com/microsoft-teams/online-meetings) via [Microsoft Graph API](/graph/overview)
-	[Azure Communication Services](/azure/communication-services/) [Chat](/azure/communication-services/concepts/chat/concepts), [Calling](/azure/communication-services/concepts/voice-video-calling/calling-sdk-features) and [user interface library](/azure/communication-services/concepts/ui-library/ui-library-overview)

## Background validation
Azure Communication Services provides [precall diagnostic APIs](/azure/communication-services/concepts/voice-video-calling/pre-call-diagnostics) for validating device readiness, such as browser compatibility, network, and call quality. The following code snippet runs a 30-second test on the device.

Create CallClient and get [PreCallDiagnostics](/javascript/api/azure-communication-services/@azure/communication-calling/precalldiagnosticsfeature) feature:

```js
const callClient = new CallClient(); 
const preCallDiagnostics = callClient.feature(Features.PreCallDiagnostics);
```

Start precall test with an access token:

```js
const tokenCredential = new AzureCommunicationTokenCredential("<ACCESS_TOKEN>");
const preCallDiagnosticsResult = await preCallDiagnostics.startTest(tokenCredential);
```

Review the diagnostic results to determine if the device is ready for the Virtual appointment. Here's an example of how to validate readiness for browser and operating system support:

```js
const browserSupport =  await preCallDiagnosticsResult.browserSupport;
  if(browserSupport) {
    console.log(browserSupport.browser) // "Supported" | "NotSupported" | "Unknown"
    console.log(browserSupport.os) // "Supported" | "NotSupported" | "Unknown"
  }
```

Additionally, you can validate [MediaStatsCallFeature](/javascript/api/azure-communication-services/@azure/communication-calling/mediastatscallfeature), [DeviceCompatibility](/javascript/api/azure-communication-services/@azure/communication-calling/devicecompatibility), [DeviceAccess](/javascript/api/azure-communication-services/@azure/communication-calling/deviceaccess), [DeviceEnumeration](/javascript/api/azure-communication-services/@azure/communication-calling/deviceenumeration), [InCallDiagnostics](/javascript/api/azure-communication-services/@azure/communication-calling/incalldiagnostics) . You can also look at the [tutorial that implements pre-call diagnostics with a user interface library](/azure/communication-services/tutorials/call-readiness/call-readiness-overview).

Azure Communication Services has a ready-to-use tool called [Network Diagnostics](https://azurecommdiagnostics.net/) for developers to ensure that their device and network conditions are optimal for connecting to the service.

## Guided validation
Azure Communication Services has a dedicated bot for validating client's audio settings. The bot plays a prerecorded message and prompts the customer to record their own message. With proper microphone and speaker settings, customers can hear both the prerecorded message and their own recorded message played back to them.

Use the following code snippet to start the call to test the bot
```js
const callClient = new CallClient(); 
const tokenCredential = new AzureCommunicationTokenCredential("<ACCESS_TOKEN>");
callAgent = await callClient.createCallAgent(tokenCredential, {displayName: 'Adele Vance'})
call = callAgent.startCall([{id: '8:echo123'}],{});
```

## Next steps
-	Learn what [extensibility options](./overview.md) do you have for Virtual appointments.
-	Learn how to customize [scheduling experience](./schedule.md)
-	Learn how to customize [before and after appointment](./before-and-after-appointment.md)
-	Learn how to customize [call experience](./call.md)
