---
title: Use cases for custom Teams endpoint
titleSuffix: An Azure Communication Services concept document
description: This article describes use cases for a custom Teams endpoint.
author: tomaschladek
manager: nmurav
services: azure-communication-services

ms.author: tchladek
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Custom Teams Endpoint - Use cases

Microsoft Teams provides identities managed by Azure Active Directory and calling experienced controlled by Teams Admin Center and policies. User might have assigned licenses, to enable PSTN connectivity and advanced calling capabilities of Teams Phone System. Azure Communication Services are supporting Teams identities for managing Teams VoIP calls, Teams PSTN calls, and join Teams meetings. Developers might extend the Azure Communication Services with Graph API to provide contextual data from Microsoft 365 ecosystem. This page is providing inspiration how to leverage existing Microsoft technologies to provide end-to-end experience for calling scenarios with Teams users and Azure Comunication Services calling SDKs. 

## Use case 1: Make outbound Teams PSTN call
This scenario is showing multi-tenant use case, where company Contoso is providing SaaS to company Fabrikam. SaaS allows Fabrikam's users to make a Teams PSTN calls via custom website, that takes the identity of the Teams user and configuration of the PSTN connectivity assigned to that Teams user.

![Diagram is showing user experience of Alice making Teams PSTN call to customer Megan.](./interop/media/custom-teams-endpoint/end-to-end-use-cases/cte-e2e-cte-to-pstn-out-overview.svg)

The following sequence diagram is showing detailed steps of initiating a PSTN call:

:::image type="content" source="./interop/media/custom-teams-endpoint/end-to-end-use-cases/cte-e2e-cte-to-pstn-out-full.svg" alt-text="Sequence diagram is describing detailed set of steps, that happens to initiate a Teams PSTN call using Azure Communication Services and Teams." lightbox="./interop/media/custom-teams-endpoint/end-to-end-use-cases/cte-e2e-cte-to-pstn-out-full.svg":::

### Steps
1. Authenticate Alice from Fabrikam in Contoso's client application: Alice is using browser to open Fabrikam's web page and authenticates. You can find more details about [the authentication with Teams identity](./custom-teams-endpoint-authentication-overview.md). If the authentication is successful, Alice is redirected to initial page.
2. Load customer's and their PSTN numbers: Contoso provides custom logic to retrieve the list of customer's and their associated phone numbers. This list is rendered in the initial page to Alice.
3. Initiate a call to Megan: Alice selects button to initiate a PSTN call to Megan in the Contoso's Client application. Client application leverages Azure Communication Services calling SDK to provide calling capability. First it creates instance of callAgent, that holds the Azure Communication Services access token acquired during 1st step.

```js
const callClient = new CallClient(); 
tokenCredential = new AzureCommunicationTokenCredential('<AlICE_ACCESS_TOKEN>');
callAgent = await callClient.createCallAgent(tokenCredential)
```
Then user needs to start a call to the Megan's phone number.

```js
const pstnCallee = { phoneNumber: '<MEGAN_PHONE_NUMBER_E164_FORMAT>' }
const oneToOneCall = callAgent.startCall([pstnCallee], { threadId: '00000000-0000-0000-0000-000000000000' });
```
4. Connecting PSTN call to Megan: The call is routed through the Teams PSTN connectivity assigned to the Alice, reaching PSTN network and ringing phone associated with the provided phone number. Megan see's incoming call from phone number associated to Alice's Teams user. 
5. Megans accepts the call: Megan accepts the call and the connection between Alice and Megan is established.


## Use case 2: Receive inbound Teams PSTN call
This scenario is showing multi-tenant use case, where company Contoso is providing SaaS to company Fabrikam. SaaS allows Fabrikam's users to receive a Teams PSTN calls via custom website, that takes the identity of the Teams user and configuration of the PSTN connectivity assigned to that Teams user.

![Diagram is showing user experience of Alice receiving Teams PSTN call from customer Megan.](./interop/media/custom-teams-endpoint/end-to-end-use-cases/cte-e2e-cte-to-pstn-in-overview.svg)

The following sequence diagram is showing detailed steps of receiving a PSTN call:

:::image type="content" source="./interop/media/custom-teams-endpoint/end-to-end-use-cases/cte-e2e-cte-to-pstn-in-full.svg" alt-text="Sequence diagram is describing detailed set of steps, that happens to receive a Teams PSTN call using Azure Communication Services and Teams." lightbox="./interop/media/custom-teams-endpoint/end-to-end-use-cases/cte-e2e-cte-to-pstn-in-full.svg":::

### Steps
1. Authenticate Alice from Fabrikam in Contoso's client application: Alice is using browser to open Fabrikam's web page and authenticates. You can find more details about [the authentication with Teams identity](./custom-teams-endpoint-authentication-overview.md). If the authentication is successful, Alice is redirected to initial page.
2. Subscribe for receiving calls: Client application leverages Azure Communication Services calling SDK to provide calling capability. First it creates instance of callAgent, that holds the Azure Communication Services access token acquired during 1st step.

```js
const callClient = new CallClient(); 
tokenCredential = new AzureCommunicationTokenCredential('<AlICE_ACCESS_TOKEN>');
callAgent = await callClient.createCallAgent(tokenCredential)
```
Then user subscribes to incoming call event.

```js
const incomingCallHandler = async (args: { incomingCall: IncomingCall }) => {
    // Get information about caller
    var callerInfo = incomingCall.callerInfo
    
    showIncomingCall(callerInfo,incomingCall);
};
callAgent.on('incomingCall', incomingCallHandler);
```
The method _showIncomingCall_ is custom Contoso's method that will render user interface to indicate incoming call and two buttons to accept and decline the call. If user selects accept button then following code is used:

```js
// Accept the call
var call = await incomingCall.accept();
```

If user selects decline button, then following code is used


```js
// Reject the call
incomingCall.reject();
```

3. Megan start's a call to PSTN number assigned to Teams user Alice: Megan uses her phone to call Alice. The carrier network will connect to Teams PSTN connectivity assigned to Alice and it will ring all Teams endpoints registered for Alice. It includes existing Teams desktop, mobile, web clients, but also applications based on Azure Communication Services calling SDK authenticated as Alice.
4. Contoso's client application shows Megan's incoming call: Client application receives incoming call notification. _showIncomingCall_ method would use custom Contoso's logic to translate the phone number to customer's name (e.g. database storing key-value pairs phone number and customer name). When the information is retrieved the notification is shown to the Alice in Contoso's client application.
5. Alice accepts the call: Alice selects button to accept the call and the connection between Alice and Megan is established.
