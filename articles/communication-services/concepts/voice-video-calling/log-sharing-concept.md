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

## Purpose of the Log Sharing feature

When issues arise in a calling experience, and that issue is escalated to Microsoft for support, Log files from the customer's device may be requested to assist in diagnosing and providing support on the issue.

However, it is not fair to ask end users to perform technical steps in order to provide these log files. These API's providing a starting point for an integrating partner to implement enhanced support that streamlines access to these files.

By providing access to a list of files that Microsoft customer support may request, the application will be able to know what files to bundle and link to corresponding support tickets.

These API's do not include remote storage or transfer. The application will need to call these API's when there is an error, and then transfer them to a accessible place for Microsoft support to access. 

## Api Functionalities

For each platform, a `getSupportFiles` method is offered. This method returns a list of files that should be included in a support request. 

This API does not package/transmit the files.

## Customer Support Requests

When Logs are requested, they are in the form of Calling and Media stack logs. The files on the device are .blog files, which are encrypted and can not be read outside of microsoft. On mobile devices, these files are stored within the applications sandbox, and on windows, it's in the applications local data.

Ideally, these logs are ready to be shared when the issue is escalated to microsoft. Additionally, collecting the logs as close to the incident is important to ensure relevant issue is there. I.e. you don't want to ask the Customer a week later for their logs for an issue they had a week ago, as the logs roll-over and aren't indefinitely stored.


### Network Usage / Storage Considerations

The support files, in total can be in the range of 5-50mb, depending on contents. As such, it's encouraged to notify the user of the transfer size so they can do it when on their desired network.

This size can also be prohibitive with certain transfer mechanisms, i.e. Sharing via Email may not work if > 25mb of log files is collected. 

Storage should generally be in a Cloud Storage bucket that can be readily accessed by Microsoft Support with a URL.

### Handing Over files to Microsoft Support

Once reaching Microsoft support, the files need to be handed over. Ideally a zip file including all logs should be linked and shared. 

## Integration Guidance

To add this feature to your own applications, you'll need to expose an interface to submit the files, and build out mechanisms to receive them. This is likely a combination of both backend/frontend features.

The recommendation is to create an API Endpoint for creating a ticket, creating the entries in Blob storage, and linking everything together. Your application ticketing system should include the User description of the issue, Call ID's, and a link to the zipped files that should support may request.

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
- Extend post-call survey
    1. Add "report an issue" checkbox
    1. Add "more info" for issues.
    1. When "report an issue" is checked, call your API to create the ticket and link the support files
- Integrate via Push-Notification
    1. Create a new Push-Type for requesting log files
    1. Present user with a notification requesting access to log files
    1. On user confirmation, call your API to Create a Ticket and Link the log files
- Direct Sharing
    1. Add an "Export Logs" function to the client application
    1. Package files on the client device.
    1. Use the systems built-in share functionality to transmit the files.

## More Reading

- End Call Survey Concept Docs
- Troubleshooting
- Azure Storage buckets
- Devops Create Ticket
- Devops Attach File
