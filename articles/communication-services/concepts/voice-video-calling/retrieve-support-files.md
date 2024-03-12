---
title: Collecting user feedback in native calling scenarios
description: Understand how to provide effective user feedback
author:      ahammer
ms.author:   adamhammer
ms.service:  azure-communication-services
ms.topic:    conceptual
ms.date:     07/17/2023
---

# Collecting user feedback in native calling scenarios

## Introduction

As a third-party library, we must acknowledge that diagnostic data, crucial for troubleshooting, resides on end user mobile devices. Our support model hinges on a symbiotic relationship: to assist your customers effectively, we must ensure you are equipped to do so. This documentation outlines the methodologies to collect diagnostic data when a user reports an issue.

### Key development concerns

- **Timely Collection**: Collection logs immediately after an issue occurs.
- **Minimize User Effort**: Ensure the user can easily report errors within your application.
- **Privacy and Security**: Store your user's information securely, engage for consent pro-actively before transmitting data.

## Important information to include with User Feedback

### Call IDs

Every Call made with the Calling SDK has a Call ID. These Call ID's can be used internally at Microsoft to diagnose issues with your call. Collecting and providing these is a first line of support, and can lead to faster investigations.

In both the Calling Native and UI Sdk, API exists to help collect and retrieve these ID's. 

[Access Call IDs with the Native Calling SDK](../troubleshooting-info.md?tabs=csharp%2Cjavascript%2Cdotnet#access-your-client-call-id)

### Log files

The Native Calling SDK and it's dependencies output encrypted `.blog` files into a temporary directory. These files can not be read outside of Microsoft. They are encrypted for privacy and compliance reasons. These files are the source of truth as to what is happening on that particular device with the Native SDK and it's dependencies. These files are a important resource to developers and troubleshooters within Microsoft.

Scenarios requiring `.blog` files should be more rare, however they form an important second line of defense, and it's encouraged that you pro-actively collect them via your support flows.

[Retrieve Log Files with the Native Calling SDK](../../tutorials/log-file-retrieval-tutorial.md)

## Enabling feedback from the customer

### Integrating user feedback tools

Once you know what data to collect, you'll need to satisfy the following user story

> As a user, I would like to report an issue

Each application can handle this freely, or use the built in mechanism within the Calling SDK. 

- **Report an Issue Form**: A button and a form, click to submit. This is also what is offered within the UI Library.
- **End-of-Call Feedback**: Solicit feedback at the end of a call. This gives the user the opportunity to share issues they may have had with the call.

It's crucial to design these feedback mechanisms with clear prompts for user consent, ensuring users are fully informed about the data being shared and its purpose. This transparency builds trust and encourages more users to report issues.

## Sending support and feedback to a server

### Transmitting the support information

Once feedback is collected, data needs to be submitted to somewhere off the end user's device, this would typically be a CRM or other tooling that can handle tasks like triaging, prioritizing and assigning work to support specialists.

While this document isn't meant to cover the entire premise of client/server communications and all the possible CRM's or Support tools out there, a basic overview would be.

- Use secure transmission protocols (i.e. HTTPS)
- Include the Logs and the Call ID's when creating support requests
- Include any User submitted information (i.e. Message, Time of error, Device specifications, etc)
- Provide the User follow up information for their issue (Options: Notify in App, Email, SMS Confirmation, etc).

It is completely up to the integrator to decide how to transmit this data as it leaves the end users device and enters a server on the cloud. For a simplified example you can reference the [collecting user feedback](../../tutorials/collecting-user-feedback/collecting-user-feedback.md) tutorial, which offers insight into both client and server implementations of this process.

### Implementing in Calling SDK and UI Library applications

For developers utilizing the Calling SDK or the ACS UI Library, consider the following tools and API's:

- **Calling SDK**: Use the SDK's capabilities to observe call IDs, retrieve logs, and gather other relevant support information programmatically.
    - [Retrieve Log Files](../../tutorials/log-file-retrieval-tutorial.md)
    - [Access Call IDs](../troubleshooting-info.md?tabs=csharp%2Cjavascript%2Cdotnet#access-your-client-call-id)
    - [UI Library Reference Integration](https://github.com/Azure/communication-ui-library-android/tree/main/azure-communication-ui/calling/src/main/java/com/azure/android/communication/ui/calling)

- **Calling UI Library**: Leverage the library's built-in support form feature to expose users to a straightforward method of submitting feedback and logs.
    - [Collecting User Feedback](../../tutorials/collecting-user-feedback/collecting-user-feedback.md)
    
## Conclusion

This guide emphasizes the necessity of efficiently collecting and transmitting diagnostic data for effective user support in native calling applications. Employing these strategies enables the rapid diagnosis and resolution of user issues, thereby improving the app's performance and user satisfaction. 