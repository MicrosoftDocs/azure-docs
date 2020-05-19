---
title: Auth0 Partner Topics 
description: Send events from Auth0 to Azure services with Azure Event Grid.
services: event-grid
author: banisadr

ms.service: event-grid
ms.date: 05/18/2020
ms.author: babanisa
---

# Auth0 Partner Topics
![Auth0 Logo](./media/auth0-overview/auth0-logo.png)
Auth0, the identity platform for application builders, provides developers and enterprises with the building blocks they need to secure their applications.

The Auth0 Partner Topic allows you customers to leverage events emitted by Auth0’s system to accomplish a number of tasks, from engaging with users in meaningful and custom ways after the authentication to automating security and infrastructure tasks.

The integration allows you to stream your Auth0 log events with high reliability into Azure for consumption with any of your favorite Azure resources. This allows you to react to events, gain insights, monitor for security issues, and interact with other powerful data pipelines.

For organizations using Auth0 and Azure, this integration will allow you to seamlessly integrate data across your entire stack. 
 
## Available event types
The full list of available Auth0 event types and their descriptions is available [here](https://auth0.com/docs/logs/references/log-event-type-codes).

## Use cases

### Engage with Your Users
Delivering a strong user experience is critical to reducing churn and retaining users. Using Auth0 log events and Azure Functions and Azure Logic Apps, you can deliver more customized application experiences. 

### Understand User Behavior
Understanding when users access your product, where they are signed in from, and what devices they use are important pieces of information that can drive your product development. By keeping track of these signals, via the log events emitted by Auth0, you can develop an understanding of the product areas that you should be paying attention to. These signals can help you determine what browsers and devices to support, what languages to consider localizing your app in, and when your peak application traffic times are. 

### Manage User Data
Retaining and auditing user actions is crucial for maintaining security and complying with industry regulations. Besides, the ability to edit, remove, or export user data upon request is becoming increasingly important to comply with various data privacy laws, such as the European Union’s General Data Protection Regulation (GDPR).

### Secure Your Application
Consolidating security monitoring and incident response procedures is important when protecting a distributed system. For this reason it is important to keep all the data in one place and monitor the entire stack. 

## Next steps

- [Partner topics overview](partner-topics-overview.md)
- [How to use the Auth0 Partner Topic](auth0-how-to.md)
- [Auth0 Documentation](https://auth0.com/docs/logs/streams/azure-eventgrid)
- [Become an Event Grid partner](partner-onboarding-overview.md)

