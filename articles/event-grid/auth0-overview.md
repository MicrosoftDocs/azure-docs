---
title: Auth0 Partner Topics 
description: Send events from Auth0 to Azure services with Azure Event Grid.
services: event-grid
author: banisadr

ms.service: event-grid
ms.date: 05/18/2020
ms.author: babanisa
---

Partner Topics Page

Logo: We may just have to use the shield logo if our horizontal logo doesn’t fit since they use squares.
https://cdn.auth0.com/website/media/auth0-assets-logos-2019.zip


Blurb: Auth0, the identity platform for application builders, provides developers and enterprises with the building blocks they need to secure their applications.

Description

Partnering with Event Grid allows our customers to leverage events emitted by Auth0’s system to accomplish a number of use cases, from engaging with users in meaningful and custom ways after the authentication to automating security and infrastructure tasks.

The Auth0 Partner Topic integration allows you to stream your Auth0 log events with high reliability into Azure for consumption with any of your favorite Azure resources. This will allow you to react to events, gain insights, monitor for security issues, and interact with other powerful data pipelines.

For organizations using Auth0 and Azure, this integration will allow you to seamlessly integrate data across your entire stack. Here is a quick overview of the use cases this integration unlocks:
 

Engage with Your Users
Delivering a strong user experience is critical to reducing churn and retaining users. Using Auth0 log events and Azure Functions and Azure Logic Apps, you can deliver more customized application experiences. 
Understand User Behavior
Understanding when users access your product, where they are signed in from, and what devices they use are important pieces of information that can drive your product development. By keeping track of these signals, via the log events emitted by Auth0, you can develop an understanding of the product areas that you should be paying attention to. These signals can help you determine what browsers and devices to support, what languages to consider localizing your app in, and when your peak application traffic times are. 
Manage User Data
Retaining and auditing user actions is crucial for maintaining security and complying with industry regulations. Besides, the ability to edit, remove, or export user data upon request is becoming increasingly important to comply with various data privacy laws, such as the European Union’s General Data Protection Regulation (GDPR).
Secure Your Application
Consolidating security monitoring and incident response procedures is important when protecting a distributed system. For this reason it is important to keep all the data in one place and monitor the entire stack. 

Creating an Auth0 Partner Topic

Note the Azure Subscription and Resource Group you want the Partner Topic to be created in.
Log in to your Auth0 account dashboard. Navigate to Logs > Streams, click “Create Stream” and select the “Azure Event Grid” event stream.
Provide the Azure Subscription ID, Resource Group and other required information and click “Save”
View your pending Partner Topics in Azure and activate the topic to allow events to flow.

Go To Button Link: https://auth0.com/docs/logs/streams/azure-eventgrid

