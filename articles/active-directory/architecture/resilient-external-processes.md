---
title: Resilient interfaces with external processes using Azure AD B2C
description: Methods to build resilient interfaces with external processes
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

# Resilient interfaces with external processes

In this article, we provide you guidance on how to plan for and implement the RESTful APIs in the user journey and make your application more resilient to API failures.

![Image shows interfaces with external process components](media/resilient-external-processes/external-processes-architecture.png)

## Ensure correct placement of the APIs

Identity experience framework (IEF) policies allow you to call an external system using a [RESTful API technical profile](/azure/active-directory-b2c/restful-technical-profile). External systems aren't controlled by the IEF runtime environment and are a potential failure point.

### How to manage external systems using APIs

- While calling an interface to access certain data, check whether the data is going to drive the authentication decision. Assess whether the information is essential to the core functionality of the application. For example, an e-commerce vs. a secondary functionality such as an administration. If the information isn't needed for authentication and only required for secondary scenarios, then consider moving the call to the application logic.

- If the data that is necessary for authentication is relatively static and small, and has no other business reason to be externalized from the directory, then consider having it in the directory.

- Remove API calls from the pre-authenticated path whenever possible. If you can't, then you must place strict protections for Denial of Service (DoS) and Distributed Denial of Service (DDoS) attacks in front of your APIs. Attackers can load the sign-in page and try to flood your API with DoS attacks and disable your application. For example, using CAPTCHA in your sign in, sign up flow can help.

- Use [API connectors of built-in sign-up user flow](/azure/active-directory-b2c/api-connectors-overview) wherever possible to integrate with web APIs either After federating with an identity provider during sign-up or before creating the user. Since the user flows are already extensively tested, it's likely that you don't have to perform user flow-level functional, performance, or scale testing. You still need to test your applications for functionality, performance, and scale.

- Azure AD B2C RESTful API [technical profiles](/azure/active-directory-b2c/restful-technical-profile) don't provide any caching behavior. Instead, RESTful API profile implements a retry logic and a timeout that is built into the policy.

- For APIs that need writing data, queue up a task to have such tasks executed by a background worker. Services like [Azure queues](/azure/storage/queues/storage-queues-introduction) can be used. This practice will make the API return efficiently and increase the policy execution performance.  

## API error handling

As the APIs live outside the Azure AD B2C system, it's needed to have proper error handling within the technical profile. Make sure the end user is informed appropriately and the application can deal with failure gracefully.

### How to gracefully handle API errors

- An API could fail for various reasons, make your application resilient to such failures. [Return an HTTP 4XX error message](/azure/active-directory-b2c/restful-technical-profile#returning-validation-error-message) if the API is unable to complete the request. In the Azure AD B2C policy, try to gracefully handle the unavailability of the API and perhaps render a reduced experience.

- [Handle transient errors gracefully](/azure/active-directory-b2c/restful-technical-profile#error-handling). The RESTful API profile allows you to configure error messages for various [circuit breakers](/azure/architecture/patterns/circuit-breaker).

- Proactively monitor and using Continuous Integration/Continuous Delivery (CICD), rotate the API access credentials such as passwords and certificates used by the [Technical profile engine](/azure/active-directory-b2c/restful-technical-profile).

## API management - best practices

While you deploy the REST APIs and configure the RESTful technical profile, following the recommended best practices will help you from not making common mistakes and things being overlooked.

### How to manage APIs

- API Management (APIM) publishes, manages, and analyzes your APIs. APIM also handles authentication to provide secure access to backend services and microservices. Use an API gateway to scale out API deployments, caching, and load balancing.

- Recommendation is to get the right token at the beginning of the user journey instead of calling multiple times for each API and [secure an Azure APIM API](/azure/active-directory-b2c/secure-api-management?tabs=app-reg-ga).

## Next steps

- [Resilience resources for Azure AD B2C developers](resilience-b2c.md)
  - [Resilient end-user experience](resilient-end-user-experience.md)
  - [Resilience through developer best practices](resilience-b2c-developer-best-practices.md)
  - [Resilience through monitoring and analytics](resilience-with-monitoring-alerting.md)
- [Build resilience in your authentication infrastructure](resilience-in-infrastructure.md)
- [Increase resilience of authentication and authorization in your applications](resilience-app-development-overview.md)
