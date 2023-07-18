---
title: Azure Calling SDK - Log File Access   
description: Understand how to access Log Files for the creation of effective support tools
author:      ahammer
ms.author:   adamhammer
ms.service:  azure-communication-services
ms.topic:    conceptual
ms.date:     07/17/2023
---

# Overview of Log File Access
[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

Log Sharing offers access to Log files, which help in building more effective support channels.

Especially on mobile devices, the Application Sandbox poses challenges for an End User when they attempt to retrieve and transmit these files. This feature provides an application developer with a mechanism to implement enhanced support tools, making it easy for users to submit the necessary files and receive robust support.

## Designing Effective Support Tools

Consider the following when implementing support tools:

1. **Time**: Retrieving logs close to the time of impact will yield the most relevant data.
1. **End User**: How would you like a user to escalate and report issues?
1. **Your Support**: How would they like to support the users and track these files?
1. **Azure Support**: Can you provide a Link or another quick way to access these files on request?

By thinking about these requirements you can implement an effective way of communicate support requests.

## Common Use Cases

### Report an Issue Dialog

The most straightforward way to implement this feature is to provide the user with the ability to report an issue with a call and include the logs. When the user reports an issue, the system can retrieve the log files and submit them to a ticketing system.

### End of Call Survey Collection

You can encourage users to report issues during the end-of-call survey. This period presents a good opportunity for the end user to volunteer any issues with the call and include logs for further diagnostics.

### Log Request via Push Notification

For organizations that prefer not to rely on user-submitted logs and would like a more automated retrieval, push notifications can be used. In this flow, the application receives a push notification requesting the logs. Upon the application receiving the notification, the end user can authorize the request and submit the logs. This approach is more proactive on the application developer's part, allowing them to actively request logs when necessary.

### Auto-Detection of Failures

When the system detects call issues/errors, it can present the Report an Issue prompt or initiate an automated collection of logs. This approach is more proactive as it doesn't rely on the user's choice, although it may lead to unnecessary log collection.

## Choosing the Right Approach

Every organization has different needs in relation to this feature. It may be useful to consider some of the following questions: 

- Have you needed logs in the past? 
- Do you actively engage with Azure Support or Developers? 
- What resources are available for your support services? 
- Do you use any preview features?
- Is your use-case complex?

Answering these questions help you decide the appropriate approach for support tools and log collection.

## Further Reading

- [End of Call Survey Conceptual Document](../voice-video-calling/end-of-call-survey-concept.md)
- [Troubleshooting Info](../troubleshooting-info.md)
- [Log Sharing Tutorial](../../tutorials/log-file-retrieval-tutorial.md)