---
# Required metadata
# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

title: Collecting User Feedback in the ACS UI Library
description: Enabling the Support Form and tooling, and handling support requests
author:      ahammer # GitHub alias
ms.author:   adamhammer # Microsoft alias
ms.service: azure-communication-services
ms.topic: conceptual
ms.date:     01/08/2024
ms.subservice: calling
---


# Overview of Enhanced Support Features

[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

The Calling UI Library incorporates a pre-designed Support Form to enhance customer support in your Calling Scenarios. This form auto-generates events that require third-party developers' attention. This guide outlines how to efficiently manage these events, improving the process of reporting and resolving user issues.

### For Third-party Application Developers:
Developers must register a handler for events triggered by the ACS UI Library Support Form. These events are vital for diagnosing and resolving user issues.

### Event Contents:
- **User Message**: Description of the issue by the user.
- **Call History Information**: Relevant call history details pertaining to the issue.
- **Log File Locations**: Paths to detailed log files.
- **Screenshot File**: User-provided optional screenshot.
- **SDK Version**: Calling SDK's version information.

### Handling Support Form Events

#### Registering an Event Handler
- Initialize the `CallComposite` with a `UserReportedIssueEvent` handler.

#### Processing the Event Data
Upon receiving the event, package and forward it to a ticketing system, and notify your support staff.

This process typically varies across organizations, but a common approach includes:

1. Create a POST request with necessary ticket creation information, using Multi-Part form for attaching log files and screenshots.

2. Upon request receipt:

   - **On the Server**:
     - Create a storage location for Issue Assets (Logs, Screenshots).
     - Generate a ticket with the following details:
       - Issue Received Time
       - Message
       - Call IDs
       - Calling UI Version
       - Calling SDK Version
       - Additional data (device, versions, etc.).
     - Upload files (Logs and Screenshot) to the storage location.
     - Attach/Link Log Files to the Ticket.
     - Notify users upon completion.

   - **On the Client**:
     - Post-server response, notify via platform notification about the Ticket outcome (Link, Success/Fail).
     - Enable users to access their active ticket results through a link or in-app/website page.

#### Collaborating with Microsoft
For support requests requiring escalation to Microsoft Azure support, sharing detailed information, including Logs and Call IDs, facilitates faster and more efficient resolution.

## Best Practices for Developers

- Ensure thorough ticket creation and link all relevant information.
- Considering storage constraints, retain Logs and Screenshots for no more than 30 days.
- Provide users with visibility into ticket status and updates.
- Integrate the Support Form with existing Ticket/Support systems.
- Create notification channels for Support to ensure timely issue awareness.