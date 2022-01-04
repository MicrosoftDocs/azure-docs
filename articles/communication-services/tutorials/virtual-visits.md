---
title: Virtual Visits
description: Learn concepts for virtual visit apps
author: tophpalmer
manager: chpalm
services: azure-communication-services

ms.author: chpalm
ms.date: 01/10/2022
ms.topic: tutorial
ms.service: azure-communication-services
---

# Virtual Visits tutorial

This tutorial describes concepts for virtual visit applications. After completing this tutorial and the associated [Sample Builder](https://aka.ms/acs-sample-builder), you will understand common use cases that a virtual visits application delivers, the Microsoft technologies that can help you build those uses cases, and generate a sample application integrating Microsoft 365 and Azure that you can use to demo and explore further.

Virtual visits are a communication scenario where a consumer and a business assemble for a scheduled appointment. The **organizational boundary** between consumer and business, and **scheduled** nature of the interaction, are key attributes of virtual visits. Many industries may offer virtual visits: meetings with a healthcare provider, a loan officer, or a product support technician.

No matter the industry, there are at least three personas involved in a virtual visit and certain tasks they accomplish:
- **Office Manager.** The office manager configures the business’ availability and booking rules for providers and consumers.
- **Provider.** The provider gets on the call with the consumer. They must be able to:
 1. View upcoming virtual visits
 2. Join the virtual visit and engage in communication
- **Consumer**. The consumer who schedules and motivates the visit. They must:
 1. Schedule a visit
 2. Enjoy reminders of the visit, typically through SMS or email
 3. Join the virtual visit and engage in communication. 

 Azure and Teams are interoperable, and this allows organizations to deliver virtual visits from a flexible spectrum of solutions in Microsoft’s cloud such as:
 
1. **Microsoft 365** provides a zero-code suite for virtual visits using Microsoft Teams and Bookings. This is the easiest option but customization is limited. [Check out this video for an introduction.](https://www.youtube.com/watch?v=zqfGrwW2lEw)
2. **M365 + Azure hybrid.** Combine Microsoft 365 Teams and Bookings with a custom Azure application for the consumer experience. Organizations can advantage of M365 familiarity but customize the consumer visit experience and embed it in their own application.
3. **Azure custom.** Build the entire solution on Azure primitives: the business experience, the consumer experience, and scheduling systems.

These three examples are summarized in the table and diagram below.

| | **Use Case** | **Microsoft 365** | **M365 + Azure hybrid** | **Azure Custom** |
|--------------|------------|-----------|---------------|---------------|
| **Manager** | Configure Business Availability | Bookings | Bookings | Custom |
| **Provider** | Managing upcoming visits | Outlook & Teams | Outlook & Teams | Custom |
| Provider | Join the visit | Teams | Teams | Azure Communication Services Calling & Chat |
| **Consumer** | Schedule a visit | Bookings | Bookings | Azure Communication Services Rooms |
| Consumer| Be reminded of a visit | Bookings | Bookings | Azure Communication Services SMS |
| Consumer| Join the visit | Teams or Virtual Visits | Custom Azure Communication Services app | Azure Communication Services Calling & Chat |

![Diagram of virtual visit implementation options](./tutorials/media/sample-builder/virtual-visit-options.svg)


These are examples, and there are other ways to customize and combine Microsoft assets in a virtual visit scenario:
1. **Replace Bookings with a custom scheduling experience with Graph.** You can build your own consumer-facing scheduling experience that controls M365 meetings with Graph APIs.
2. **Replace Teams’ provider experience with Azure.** You can still use M365 and Bookings to manage meetings but have the business user launch a custom Azure application to join the Teams meeting. This might be useful where you want to split or customize virtual visit interactions from day-to-day employee Teams activity.

## Extend Microsoft 365 with Azure
The rest of this tutorial focuses on Microsoft 365 and Azure hybrid solutions. These hybrid configurations are popular because they combine employee familiarity of M365 with the ability to customize the consumer experience. They’re also a good launching point to understanding more complex and customized
architectures. The diagram below shows user steps for a virtual visit:
1. Consumer schedules the visit using M365 Bookings.
2. Consumer gets a visit reminder through SMS and Email.
3. Provider joins the visit using Microsoft Teams.
4. Consumer uses a link from the Bookings reminders to launch the Contoso consumer app and join the underlying Teams meeting.
5. The users communicate with each other using voice, video, and text in a call.


![High-level architecture of a hybrid virtual visits solution](./tutorials/media/sample-builder/virtual-visit-arch.svg)

# Building a virtual visit sample
In this section we’re going to use a Sample Builder tool to deploy an M365 + Azure hybrid virtual visits application to an Azure subscription. This application will be a desktop and mobile friendly browser experience, with code that you can use to explore and productionize.

### Step 1 - Configure bookings
This sample uses M365 to power the consumer scheduling experience and create meetings for providers. Thus the first step is creating a Bookings calendar and getting the Booking page URL from https://outlook.office.com/bookings/calendar.

![Booking configuration experience](./tutorials/media/sample-builder/bookings-url.png)

### Step 2 – Sample Builder
Use the Sample Builder to customize the consumer experience. You provide the Booking URL configured in the last step, and can configure if Chat or Screen Sharing should be enabled. You can preview your configuration live from the page in both Desktop and Mobile browser form-factors.

![Sample builder start page](./tutorials/media/sample-builder/sample-builder-start.png)

### Step 3 - Deploy
At the end of the Sample Builder wizard, you can \`Deploy to Azure\` or download the code as a zip. The sample builder code is publicly available on [GitHub](https://github.com/Azure-Samples/communication-services-virtual-visits-solution). 

![sample builder landing page](./tutorials/media/sample-builder/sample-builder-landing.png)

The deployment fires an Azure Resource Manager (ARM) template and deploys the themed application you configured to an Azure subscription of your choice. 

![Sample builder arm template](./tutorials/media/sample-builder/sample-builder-arm.png)

### Step 4 - Test
The Sample Builder creates three resources in the selected Azure subscriptions. The App Service is the consumer front end, powered by Azure Communication Services. 

![produced azure resources in azure portal](./tutorials/media/sample-builder/azure-resources.png) 

Opening the App Service’s URL and navigating to `https://<YOUR URL>/VISITS` allows you to try out the consumer experience and join a Teams meeting.  `https://<YOUR URL>/BOOK` embebs the Booking experience for consumer scheduling.

![final view of azure app service](./tutorials/media/sample-builder/azure-resource-final.png) 

# Going to production
The Sample Builder gives you the basics of a M365 and Azure virtual visit: consumer scheduling via Bookings, consumer joins via custom app, and the provider joins via Teams. However, there are several things to consider as you take this scenario to production.
- **Launching Patterns.** Consumers want to jump directly to the virtual visit from the scheduling reminders they receive from Booking. Bookings provides a configuration we used earlier in this tutorial to allow you to specify a link to your website or mobile app.
- **Integrate into your existing app.** The app service generated by the Sample Builder is a stand-alone artifact, designed for desktop and mobile browsers. However you may have a website or mobile application already and need to migrate these experiences to that existing codebase. The code generated by the Sample Builder should help, but you can also use:
1. **UI SDKs –** [Production Ready Web and Mobile](https://azure.github.io/communication-ui-library/?path=/story/overview--page) components to build graphical applications.
2. **Core SDKs –** The underlying [Call](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/voice-video-calling/get-started-teams-interop?pivots=platform-windows) and [Chat](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/chat/meeting-interop?pivots=platform-windows) services can be accessed and you can build any kind of user experience.
3. **Identity & Security.** The Sample Builder’s consumer experience does not authenticate the end-user, but provides [Azure Communication Services user access tokens](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/access-tokens?pivots=programming-language-csharp) to any random visitor. That isn’t realistic for most scenarios, and you will want to implement an authentication scheme.
