---
title: Build resilience in Customer Identity and Access Management using Azure AD B2C
description: Methods to build resilience in Customer Identity and Access Management using Azure AD B2C
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals 
ms.workload: identity
ms.topic: how-to
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.date: 12/01/2022
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Build resilience in your customer identity and access management with Azure Active Directory B2C

[Azure AD B2C](/azure/active-directory-b2c/overview) is a Customer Identity and Access Management (CIAM) platform that is designed to help you launch your critical customer facing applications successfully. We have many built-in features for [resilience](https://azure.microsoft.com/blog/advancing-azure-active-directory-availability/) that are designed to help our service scale to your needs and improve resilience in the face of potential outage situations. In addition, when launching a mission critical application, it's important to consider various design and configuration elements in your application. Consider how the application is configured within Azure AD B2C to ensure that you get a resilient behavior in response to outage or failure scenarios. In this article, we'll discuss some of the best practices to help you increase resilience.

A resilient service is one that continues to function despite disruptions. You can help improve resilience in your service by:

- understanding all the components

- eliminating single points of failures

- isolating failing components to limit their impact

- providing redundancy with fast failover mechanisms and recovery paths

As you develop your application, we recommend considering how to [increase resilience of authentication and authorization in your applications](resilience-app-development-overview.md) with the identity components of your solution. This article attempts to address enhancements for resilience specific to Azure AD B2C applications. Our recommendations are grouped by CIAM functions.

![Image shows CIAM components](media/resilience-b2c/high-level-components.png)
In the subsequent sections, we'll guide you to build resilience in the following areas:

- [End-user experience](resilient-end-user-experience.md): Enable a fallback plan for your authentication flow and mitigate the potential impact from a disruption of Azure AD B2C authentication service.

- [Interfaces with external processes](resilient-external-processes.md): Build resilience in your applications and interfaces by recovering from errors.  

- [Developer best practices](resilience-b2c-developer-best-practices.md): Avoid fragility because of common custom policy issues and improve error handling in the areas like interactions with claims verifiers, third-party applications, and REST APIs.

- [Monitoring and analytics](resilience-with-monitoring-alerting.md): Assess the health of your service by monitoring key indicators and detect failures and performance disruptions through alerting.

- [Build resilience in your authentication infrastructure](resilience-in-infrastructure.md)

- [Increase resilience of authentication and authorization in your applications](resilience-app-development-overview.md)

Watch this video to know how to build resilient and scalable flows using Azure AD B2C.
>[!Video https://www.youtube.com/embed/8f_Ozpw9yTs]
