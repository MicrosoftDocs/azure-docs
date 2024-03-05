---
title: Implementing Support Data Collection and Feedback in Calling SDK Applications
description: Understand how to access Log Files for the creation of effective support tools
author:      ahammer
ms.author:   adamhammer
ms.service:  azure-communication-services
ms.topic:    conceptual
ms.date:     07/17/2023
---

# Streamlining Support Data Collection and User Feedback in Calling SDK Applications

## Introduction

In the realm of modern, sandboxed applications, ensuring a smooth user experience is paramount, especially when issues arise. A critical aspect of providing support is the efficient collection of support data, such as log files, and enabling easy feedback mechanisms for users. This document outlines a structured approach to collecting support data from the system. Enabling feedback from customers and sending this crucial information to the server or ticketing system in order to be further triaged and handled by support specialists.

## 1. Collecting Support Data from the System

### Key Developer Actions for Effective Log Collection

- **Timely Collection**: Automate the collection of logs immediately after an issue occurs to ensure data relevance and usefulness.
- **Minimize User Effort**: Design the application to require minimal user interaction for log collection, enhancing the likelihood of issue reporting.
- **Privacy and Security**: Ensure that the collection and handling of logs prioritize user privacy and data security, adhering to best practices and regulations.

### Implementing Log Collection

Utilize the Calling SDK's APIs to automate the retrieval of logs and other support-related information. Support related information includes call IDs, error logs, and performance metrics. For applications using the Azure Communication Services Calling SDK, integrating direct log file access through the API facilitates this process, eliminating the need for users to manually locate and send logs.

## 2. Enabling Feedback from the Customer

### Integrating User Feedback Mechanisms

- **"Report an Issue" Feature**: Implement an intuitive interface within the application that prompts users to report issues. Automatically attaching logs and sending them to the support team.
- **End-of-Call Feedback**: Moments immediately following the call, solicit feedback about call quality and any issues experienced, offering an option to submit logs.
- **Shake-to-Report**: Introduce a shake-to-report feature, enabling users to easily initiate an issue report by shaking their device.

### Designing for User Consent and Awareness

It's crucial to design these feedback mechanisms with clear prompts for user consent, ensuring users are fully informed about the data being shared and its purpose. This transparency builds trust and encourages more users to report issues.

## 3. Sending Support and Customer Feedback to the Server or Ticket System

### Structuring the Data Submission Process

Once feedback is collected, the next step is transmitting this information to a server or ticketing system. This can be achieved by:

- **Automating Data Submission**: Develop the application to automatically send collected data to the designated support system upon user consent.
- **Ensuring Data Integrity and Security**: Implement secure data transmission methods to protect the confidentiality and integrity of the support data.

### Implementing in Calling SDK and UI Library Applications

For developers utilizing the Calling SDK or the ACS UI Library, consider the following tools and API's:

- **Calling SDK**: Use the SDK's capabilities to observe call IDs, retrieve logs, and gather other relevant support information programmatically.
    - [Retrieve Log Files](../../tutorials/log-file-retrieval-tutorial.md)
    - [Access Call IDs](../troubleshooting-info.md?tabs=csharp%2Cjavascript%2Cdotnet#access-your-client-call-id)
    - [UI Library Reference Integration](https://github.com/Azure/communication-ui-library-android/tree/main/azure-communication-ui/calling/src/main/java/com/azure/android/communication/ui/calling)

- **Calling UI Library**: Leverage the library's built-in support form feature to expose users to a straightforward method of submitting feedback and logs.
    - [Collecting User Feedback](../../tutorials/collecting-user-feedback/collecting-user-feedback.md)
    
## Conclusion

By implementing a structured approach to collecting support data, enabling user feedback, and efficiently sending this information to the support system, developers can significantly enhance the troubleshooting process and overall user experience in Calling SDK applications. This not only facilitates quicker issue resolution but also strengthens the feedback loop between users and developers, leading to more robust and user-friendly applications.
