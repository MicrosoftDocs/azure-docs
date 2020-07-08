---
title: Creating a commercial ready Azure Remote Rendering application
description: Strategies and considerations for creating a commercial ready application using Azure Remote Rendering
author: m-the-hoff
ms.author: v-michof
ms.date: 06/15/2020
ms.topic: tutorial
---

# Tutorial: Creating a commercial ready Azure Remote Rendering application

In this tutorial, you learn about:

> [!div class="checklist"]
>
> * Session management for commercial applications
> * Tracking sessions for billing
> * Optimizing the user experience around session loading time
> * Considerations around network latency

## Prerequisites

* This tutorial builds on [Tutorial: Securing Azure Remote Rendering and model storage](../security/security.md).

## Introduction to Commercial Readiness

Azure Remote Rendering expands what’s possible with mixed reality. Once the basics are integrated into your solution, there are a number of additional considerations to ensure your solution is secure, scalable, and ready to deliver value.

This module introduces you to some additional capabilities you may need to consider for your commercial application.

For a broad overview of systems-wide architecture best practices, visit:

* [Azure Architecture Center](https://docs.microsoft.com/azure/architecture/)
* [Get Started Guide for Azure Developers](https://docs.microsoft.com/azure/guides/developer/azure-developer-guide)

## Analytics

Integrating analytics tools can help manage, track, and improve your solution.

For a comprehensive list of the analytics resources available to you, visit:

* [Azure Analytics Services](https://azure.microsoft.com/product-categories/analytics/)

### Tracking usage for billing

Tracking the consumption of Azure Remote Rendering by multiple internal teams or external clients becomes an important consideration, especially in multi-tenant situations.

To achieve this, Azure offers a service called resource tagging, which associates consumption of the Azure Remote Rendering service with each client.

For more information on resource naming and tagging, a good place to start is:

* [Resource Naming and Tagging Decision Guide](https://docs.microsoft.com/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json)

### Diagnostics

Powerful tools such as Event Tracing for Windows (ETW) and Event Trace Logging (ETL) make it easy to generate trace events within your application and can help diagnose network, content ingestion, session, application, and other issues that may arise in a commercial solution deployment.

For more information, visit:

* [Create Client-side Performance Traces](https://docs.microsoft.com/azure/remote-rendering/how-tos/performance-tracing)
* [How to Collect Event Tracing for Windows (ETW) data](https://docs.microsoft.com/visualstudio/profiling/how-to-collect-event-tracing-for-windows-etw-data)
* [Using the Windows Device Portal: Logging](https://docs.microsoft.com/windows/mixed-reality/using-the-windows-device-portal)

### Usage analysis

Azure Application Insights helps you understand how people use your Azure Remote Rendering application. Every time you update your app, you can assess how well it works for users and enhance your solution accordingly. With this knowledge, you can make data-driven decisions about your next development cycles.

For more information, visit:

* [Usage Analysis with Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/usage-overview)

## Fast startup time strategies

Your use case may require fast startup from application launch to 3D model viewing. For example, during an important meeting where it’s critical to have everything up and running ahead of time. Another example is during a CAD 3D model review where fast design iteration between a CAD application and mixed reality is key to efficiency.

Azure Remote Rendering requires preprocessed 3D models, and Azure currently takes several minutes to create a VM and load a model for rendering. Making this process as seamless and fast as possible requires preparation of the 3D model data and ARR session ahead of time.

The suggestions shared here aren’t currently part of the standard Azure Remote Rendering, but you can implement them on your own for faster startup times.

### Initiate early

To reduce startup time, the simplest solution is to move the creation and initialization of the VM as early as possible in the user workflow. One strategy is to initialize the session as soon as it’s known that an ARR session will be needed. This will often be when the user starts to upload a 3D model to Azure Blob Storage to use with Azure Remote Rendering. In this case, session creation and VM initialization can be initiated at the same time as the 3D model upload such that both work streams run in parallel.

This process can be streamlined further by ensuring that the chosen Azure Blob Storage input and output containers are in the same regional data center as the Azure Remote Rendering session.

### Scheduling

If you know you have a future need for Azure Remote Rendering, you can schedule a specific date and time to start up the Azure Remote Rendering session.

This option could be offered through a web portal where people can both upload a 3D model and schedule a time to view it in the future. This would also be a good place to ask for other preferences like Standard or Premium rendering. Premium rendering may be suitable if there’s a desire to show a mix of assets where the ideal size is harder to automatically determine or a need to ensure that the Azure region has VMs available at that specified time.

### Session pooling

In the most demanding situations, another option is session pooling, where one or more sessions are created and initialized at all times. This creates a session pool for immediate use by a requesting user. The downside of this approach is that once the VM is initialized, billing for the service starts. It may not be cost-effective to keep a session pool running at all times, but based on analytics, it may be possible to predict peak loads or can be combined with the scheduling strategy above to predict when sessions will be needed and ramp up and down the session pool accordingly.

This strategy also helps with optimizing the choice between Standard and Premium sessions in a more dynamic fashion because it would be much quicker to switch between the two types within a single user session such as the case where a Premium complexity model is viewed first, followed by one that can work within Standard. If these user sessions are quite lengthy, there can be significant cost savings.

For more on Azure Remote Rendering sessions, check out:

* [Remote Rendering Sessions](https://docs.microsoft.com/azure/remote-rendering/concepts/sessions)

## Standard vs. Premium VM routing strategies

Needing to select whether to create a Standard or Premium VM presents a challenge in designing your user experience and end-to-end system. Although using only Premium sessions is an option, Standard sessions use much less Azure compute resources and are less expensive than Premium. This provides a strong motivation to use Standard sessions whenever possible and only use Premium when needed.

Here we share several options, from least to most comprehensive, to address the desire to manage session choices.

### Use only Standard or Premium

If you’re certain that your needs will *always* fall below the threshold between Standard and Premium, then this simplifies your decision considerably. Just use Standard. Keep in mind though that the impact on the user experience is significant if the sum total complexity of the loaded assets is rejected as too complex for a Standard session.

Likewise, if you expect a large portion of uses to exceed the threshold between Standard and Premium, or cost isn’t a key factor in your use case, then always choosing Premium is also an option to keep it simple.

### Ask the user

If you do wish to support both Standard and Premium, the easiest way to determine which type of VM session to instantiate is to ask the user when they select 3D assets to view. The challenge with this approach is that it requires the user to understand the complexity of the 3D asset or even multiple assets that will be viewed. Typically, this is not recommended for that reason. If the user selects wrong and chooses Standard, the resulting user experience could be compromised at an inopportune moment.

### Analyze the 3D model

Another relatively simple approach is to analyze the complexity of the selected 3D assets. If the model complexity is below the threshold for Standard, initiate a Standard session, otherwise initiate a Premium session. Here, the challenge is that a single session may ultimately be used to view multiple models of which some may exceed the complexity threshold of a Standard session, resulting in the inability to seamlessly use the same session for a sequence of different 3D assets.

### Automatic switching

Automatic switching between Standard and Premium sessions can make a lot of sense in a system design that also includes session pooling. This strategy allows for further optimization of resource utilization. As the user loads models for viewing, the complexity is determined, and the correct session size is requested from the session pooling service.

## Working with networks

### Diagnostics

Azure Remote Rendering requires a fast internet connection with low latency. The quality of the user’s network can have a significant impact on the quality of the experience. Given that your clients are likely to have different network configurations and only occasionally poor network latency, diagnostic tools are key.  

To ensure that you can deliver a consistently high quality experience, we recommend that you integrate server-side and client-side analytics tools into your Azure Remote Rendering applications. Doing so arms you with the information you’ll need to diagnose and mitigate any network issues your clients may be experiencing.

### Client network configurations

One of the biggest challenges in developing robust collaboration solutions that are deployed into a wide variety of enterprise environments is being prepared for the differing network topology and enterprise firewall configurations your clients may use.

Many enterprises block all peer-to-peer traffic within a LAN. This makes it difficult to take advantage of the simplicity and streamlined UX of automatic LAN discovery to establish a local shared session among all discovered instances of your mixed reality application.

Other potential failure points are routers configured to intentionally throttle bandwidth and firewalls that block most TCP/IP ports.

Whenever you’re planning to use Azure Remote Rendering on an unfamiliar network, we recommend the following:

* Provide a pre-meeting checklist to assess network readiness.
* Ensure that the appropriate regional data center can service the request.
* Allow plenty of time to diagnose any issues.
* Bring a mobile hotspot with a high-bandwidth data plan as backup.

### End-to-end bandwidth

It’s important to assess the bandwidth capabilities for each leg of the network that may exist between the Azure Remote Rendering VM and the end client. Keep in mind that the network segment from the Azure data center to the client’s ISP may be more of a limiting factor than from the ISP to the client. The Blob Download Speed Test can be used to help diagnose such issues.

### Bandwidth competition

When designing your mixed reality application, keep in mind that different features of the app may compete with Azure Remote Rendering for bandwidth. The most likely unanticipated example is when many participants in a single room are all expecting to simultaneously use ARR to view a 3D asset. Each leg of the network data flow will need to have capacity to transport the sum total of all ARR data streams combined.

Other examples include streamed video, simultaneous background uploads of other related content, and voice chat, particularly where there are many participants and the system is using a distributed peer-to-peer approach as opposed to an audio mixing server in the middle approach.

For more information on network analytics, view:

* [Azure Storage Blob Download Speed Test](https://www.azurespeed.com/Azure/Download)
* [Azure Network Round Trip Latency Statistics](https://docs.microsoft.com/azure/networking/azure-network-latency)
* [Server-side Performance Traces](https://docs.microsoft.com/azure/remote-rendering/overview/features/performance-queries)
* [Client-side Performance Traces](https://docs.microsoft.com/azure/remote-rendering/how-tos/performance-tracing)

## Collaboration considerations

Some of the most valuable uses of Azure Remote Rendering involve collaboration between multiple participants viewing the same 3D experience at the same time. In these shared sessions, it’s important to recognize that each participant will need a unique Azure Remote Rendering session, regardless of whether they are located in the same place on the same network or not.

This is true because each participant is actually seeing the same experience from different vantage points, which requires the same 3D assets to be rendered from each of those perspectives simultaneously.

### Multiple Azure Remote Rendering Sessions

If you intend to support shared experiences with Azure Remote Rendering, the systems you put in place to create and manage ARR sessions will need to be prepared to initiate multiple sessions. These sessions may need to be initialized in different Azure data centers if the participants are geographically dispersed.

Your system must also manage the possibility that one or more of the participants may be in a geographic region that currently isn’t supported by Azure Remote Rendering or currently has no Azure Remote Rendering VM instances available.

This management of multiple simultaneous sessions can be further streamlined when combined with session pooling and other strategies discussed in this document.

### Azure Blob Storage considerations

All simultaneous ARR sessions can reference the same SAS URI for the converted model to be viewed. This makes it possible to upload and convert the desired 3D assets once and then share it across all sessions. This is especially true when the participants are co-located and using the same data center where there are no performance concerns related to the Azure Blob Storage being located in a different data center than the Azure Remote Rendering server and the user.

If 3D assets are typically uploaded for a single viewing session and then discarded, such as in a design review session, the geographic region of the Azure Blob Storage relative to the Azure Remote Rendering server is also less critical.

However, for 3D assets that will be used repeatedly, such as in a training use case, we recommend keeping ready-to-go 3D assets in blob storage in each regional data center where you plan to use Azure Remote Rendering. This can be automated using Azure Storage Redundancy. CDN is often used for this purpose as well, but this isn’t yet an option for Azure Remote Rendering.

For more information:

* [Shared Experiences in Mixed Reality](https://docs.microsoft.com/windows/mixed-reality/shared-experiences-in-mixed-reality)
* [Azure Storage Redundancy](https://docs.microsoft.com/azure/storage/common/storage-redundancy)

## Managing model access

Leveraging Azure Remote Rendering fully requires careful consideration of the end-to-end infrastructure for managing 3D models.

An advantage of using Azure Remote Rendering is that large 3D assets never need to be transmitted directly to the mixed reality device before being viewed.  Furthermore, once a 3D asset has been uploaded and converted for use with Azure Remote Rendering, any number of users can share that single instance of the 3D model.

### Considerations for 3D model access

Here are a few key considerations when deciding on your model access strategy.

Based on the anticipated use case, determine the best place or combination of places to allow a user to select the 3D assets for viewing. Some common options are:

* Directly within the mixed reality experience
* Via a companion web portal
* In a companion desktop or mobile application

If your use case has usage patterns where the same 3D asset may be uploaded multiple times, the back-end will track which models are already converted for use with ARR such that a model is only pre-processed one time for multiple future selections. A design review example would be where a team has access to a common original 3D asset. Each team member is expected to review the model using ARR at some point in their work stream. Only the first view would then trigger the pre-processing step. The subsequent views would look up the associated post-processed file in the SAS output container.

Depending on the use case, you’ll likely want to determine and potentially persist the correct Azure Remote Rendering VM size, Standard or Premium, for each 3D asset or group of assets that will be viewed together in the same session.  

### On-device model selection list

In many use cases, such as a training, task guidance, or marketing application, the set of 3D assets to be commonly viewed in Azure Remote Rendering may be fairly static. In these situations, a curated set of 3D assets can be pre-converted and made available via a database that contains the necessary information to populate a selection list of curated assets. This data can then be retrieved from the mixed reality application to populate a selection menu.

This can be taken a step further by also offering a way to upload private 3D assets, unique to each individual or group. That list of private assets could then be combined with the list of common, curated assets in the user experience for picking 3D assets to view.

### On-device OneDrive access

Given that a OneDrive file picker is built natively into Microsoft’s mixed reality devices, selecting 3D assets on-device from OneDrive is appealing, particularly for use cases where it’s common to load different or modified 3D models. In this scenario, the user would select one or more 3D assets via the OneDrive file picker within your mixed reality application. The 3D assets would then be migrated to a SAS input container, converted to a SAS output container, and attached to the ARR session. Ideally, the mixed reality application would invoke a cloud-based process to perform these steps as opposed to moving all of the bits from OneDrive to the device and back down to Azure Blob Storage.

This approach could be taken one step further by persisting an association between 3D assets that have been previously viewed such that when the same model is chosen again from OneDrive, the application can bypass the conversion process and directly load the associated converted 3D asset via its SAS URI.

For more information:

* [Microsoft Power Automate Template for OneDrive to Azure Storage Replication](https://flow.microsoft.com/galleries/public/templates/2f90b5d3-029b-4e2e-ad37-1c0fe6d187fe/when-a-file-is-uploaded-to-onedrive-copy-it-to-azure-storage-container/)
* [OneDrive File Storage API Overview](https://docs.microsoft.com/graph/onedrive-concept-overview)

### Direct CAD access

One compelling use case for mixed reality is design reviews of CAD work-in-progress. In this scenario, the fastest load time from desktop to mixed reality is key. An ideal solution could involve developing plugins for specific CAD applications. These plugins would directly manage every aspect of the load, convert, and view process:

* Provide a UX to:
  * Pair the CAD application with a specific mixed reality device (one time).
  * Request that the selected geometry be viewed on that mixed reality device.
* If not already running, spin up the Azure Remote Rendering session so that it can process in parallel while uploading and converting the CAD file
* Normalize CAD geometry data to one of the formats supported by Azure Remote Rendering
* Transmit the normalized data directly to the Azure Blob Storage input container
* Initiate the model conversion process
* Link the model’s output container SAS URI to the Azure Remote Rendering session
* Notify the paired mixed reality application that model is available and ready for viewing and provide the output container SAS URI so the application can attach it to the session.

A much simpler but slightly less streamlined approach could automate the process of saving the 3D model to a local hard drive and then initiate a process to transmit that saved file to the SAS input container.

### Azure Marketplace

Many enterprise clients mandate that your Azure Stack can be deployed under their own Azure accounts and credentials for security reasons. To make this possible, you’ll want to consider packaging your Azure managed application such that it can be published on the Azure Marketplace as an Azure Application Offer.

For more information:

* [Azure Marketplace](https://azure.microsoft.com/marketplace/)
* [Tutorial: Publish Azure managed applications in the Marketplace](https://docs.microsoft.com/azure/azure-resource-manager/managed-applications/publish-marketplace-app)

### Security

It’s critical to build your end-to-end Azure Remote Rendering solution for security from the ground up. There are many aspects of security to consider in the design of your end-to-end solution including:

* Authentication strategies
* Access management – groups, policies, and permissions
* Multi-tenancy
* Data storage and transfer encryption
* Temporary use tokens
* Distributed denial of service (DDoS) attacks
* Threat detection
* VPNs and secure networks
* Firewalls
* Certificate and secret key management
* Application vulnerability and exploits

For authentication, it’s wise to move as much of the ARR authentication and session management to an Azure Web Service as possible. This will result in a better managed and more secure solution.

For more information:

* [Azure AD Service Authentication](https://docs.microsoft.com/azure/spatial-anchors/concepts/authentication?tabs=csharp#azure-ad-service-authentication)
* [Strengthen Your Security Posture with Azure](https://azure.microsoft.com/overview/security/)
* [Cloud Security](https://azure.microsoft.com/product-categories/security/)
