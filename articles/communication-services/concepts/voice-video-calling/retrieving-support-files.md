---
title: Azure Calling SDK - Log File Access   # Add a title for the browser tab
description: Learn how to access the Log Files to build support tooling
author:      ahammer
ms.author:   adamhammer
ms.service:  azure-communication-services
ms.topic:    conceptual
ms.date:     07/17/2023
---

# Log File Access Overview

[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

Log Sharing provides access to Log files, to help facilitate the creation of more effective support channels.

Especially on mobile devices, the Application Sandbox makes it difficult for an End User to retrieve and transmit these files. This feature provides a mechanism for the application developer to implement enhanced support mechanisms to make it easy for the user to Submit the necessary files to receive robust support.


## Accessing Log Files with Azure Calling SDK

In order to have effective support, occasionally log files will be requested. As an application developer it can be valuable to collect these files in your support and diagnostic flows. This method provide the foundation for enhanced support for end users.

The support files list includes all files that will enable Microsoft Support to thoroughly investigate a wide range of potential issues.

## How to Utilize this functionality

When designing a user-interface for the feature, keep these tips in mind. The key idea is to make it easy for users to report an error and share related log files.

Think about this scenario: "I'm using your app and encounter a problem. I want to report this error and send you the log files so your support team can look into it."

While every company is different, the aim is for your support team to receive these files as soon as possible. That way, if Microsoft asks for them, your team is ready.

## Common Use Cases

### Report an Issue Dialog

Implementing the ability for the user to report an issue with a call, and including the logs is the most straightforward way to implement such a feature. When the user reports an issue, the log files can be retrieved and submitted to a ticketing system.

### Collect via End of Call Survey

You can actively request users to report issues during the end of call survey. This is a good time for the end user to volunteer any issues with the call and include logs for further diagnostics.

### Request logs via Push Notification

For those that would not want to rely on User's providing logs, but a more automated retrieval push notifications can be used. In this flow, the application received a Push Notification that requests the logs. After the user receives the Push they can authorize the request and have the logs submitted. This approach is more pro-active on the application developers part, and allows them to actively request logs when required.

### Auto-Detection of Failures

When call issues/errors are detected, the Report an Issue prompt can be presented, or an automated collection of logs can occur. This is more pro-active versus relying on the users choice, however can lead to unnecessary log collection.

# Deciding on the right approach

Each organization will have varying needs in regards to this feature, it is useful to ask yourself some of the following questions: 

- Have logs been requested in the past? 
- Do you actively engage with Azure Support or Developers? 
- What resources are available to your support services? 
- Do you use any preview features?
- Is your use-case complicated?

Reflecting on these questions will help you decide the proper approach when it comes to support tools and the need to collect logs.

## More Reading

- [End of Call Survey Conceptual Document](../voice-video-calling/end-of-call-survey-concept.md)
- [Troubleshooting Info](../troubleshooting-info.md)
- [Log Sharing Tutorial](../../tutorials/log-sharing-tutorial.md)
- [Azure Devops Create Ticket](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/create?view=azure-devops-rest-7.0&tabs=HTTP)
- [Azure Devops Attach File](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/attachments/create?view=azure-devops-rest-7.0&tabs=HTTP)
