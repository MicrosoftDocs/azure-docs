---
title: Azure Communication Services Log Sharing overview
titleSuffix: An Azure Communication Services concept document
description: Learn about the End of Call Survey.
author: adamhammer
ms.author: adamhammer
manager: jamcheng

services: azure-communication-services
ms.date: 4/03/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Log Sharing overview


> [!NOTE] 
> Log Sharing is currently in Public Preview.

Log Sharing provides access to Log files, to help facilitate the creation of more effective support channels.

## Problem Statement

To facilitate support requests, occasionally log files are requested. For certain end-users, especially Android/iOS users providing these files can be a major hurdle as these files are stored within the Application's sandbox.

## Solution

Provide the application developer with the location of the files, so that they can implement share/export functionality in a more robust and reliable way.

## Api Functionalities

For each platform, a `getSupportFiles` method is offered. This method returns a list of files that should be included in a support request. 

This API does not package/transmit the files, and that functionality must be implemented in the application.

## Included Support Files

ACS Calling Logs as well as Media Stack Logs are listed out. In releases, these log files are encrypted and not in a format that an Application developer or End user can read.

## Integration Guidance

When creating a user-interface for this feature, the following suggestions can help guide direction.

Ultimately, you'll want to address this user story *"As an end user, I'd like to be able to Report and error, and attach the Log Files at the time of error"*.

While your approach may vary, the goal is to have your Support team have access to these files close to the time of issue, so that they can hand the files over to microsoft if requested.

The following is a suggestion on how a typical organization with a Ticket System and access to online Storage Blob's may proceed, however depending on your organizations tooling/support processes and resources this may vary.

### Backend Integration

It's sensible to create a back-end API that can be used to create Support Tickets, Upload files to a Bucket and link the Issues and files. It's important to encapsulate this on your back-end to help prevent resource abuse.

1. Add Multi-part POST API endpoint for "createCallSupportTicket" in your applications backend
1. Create Support Ticket (with customer data and call id's)
1. Upload Logs to Blob Storage from Server
1. Link URL of Logs to the Support Ticket

### Frontend Integration

Various options exist on how to integrate this into the UI of your applications. Any combination of approaches is valid, but remember it's best to collect this data as close to the issue as possible.

- Offer a "report issue" feature
    1. Add a screen/dialog to report issues for the user to invoke
    1. When submitting issue, call your API, and pass the log files to the Server
- Extend post-call survey to include "report an issue"
    1. Add "report an issue" checkbox
    1. Add "more info" for issues.
    1. When "report an issue" is checked, call your API to create the ticket and link the support files
- Integrate via Push-Notification
    1. Create a new Push-Type for requesting log files
    1. Support initiates push request for support files
    1. Present user with a notification requesting access to log files
    1. On user confirmation, call your API to Create or Link a Ticket and Log files
- Direct Sharing
    1. Add an "Export Logs" function to the client application
    1. Package files on the client device.
    1. Use the systems built-in share functionality to transmit the files.


## More Reading

- [End of Call Survey Conceptual Document](../voice-video-calling/end-of-call-survey-concept.md)
- [Troubleshooting Info](../troubleshooting-info.md)
- [Log Sharing Tutorial](../../tutorials/log-sharing-tutorial.md)
- [Azure Devops Create Ticket](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/work-items/create?view=azure-devops-rest-7.0&tabs=HTTP)
- [Azure Devops Attach File](https://learn.microsoft.com/en-us/rest/api/azure/devops/wit/attachments/create?view=azure-devops-rest-7.0&tabs=HTTP)