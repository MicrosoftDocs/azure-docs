---
title: Test environments, throttling, and service limits
description: Learn about the throttling and service limits to consider while deploying a Microsoft Entra test environment and testing an app integrated with the Microsoft identity platform.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 03/07/2023
ms.author: ryanwi
ms.reviewer: arcrowe
#Customer intent: As a developer, I want to understand the throttling and service limits I might hit so that I can test my app without interruption.
---

# Throttling and service limits to consider for testing
As a developer, you want to test your application before releasing it to production. When testing applications protected by the Microsoft identity platform, you should set up a Microsoft Entra environment and tenant to be used for testing.  

Applications that integrate with Microsoft identity platform require directory objects (such as app registrations, service principals, groups, and users) to be created and managed in a Microsoft Entra tenant.  Any production tenant settings that affect your app's behavior should be replicated in the test tenant. Populate your test tenant with the needed Conditional Access, permission grant, claims mapping, token lifetime, and token issuance policies. Your application may also use Azure resources such as compute or storage, which need to be added to the test environment. Your test environment may require numerous resources, depending on the app to be tested.

In order to ensure reliable usage of services by all customers, Microsoft Entra ID and other services limit the number of resources that can be created per customer and per tenant. When setting up a test environment and deploying directory objects and Azure resources, you may hit some of these service limits and quotas.

Microsoft Entra ID, Microsoft Graph, and other Azure services also limit the number of concurrent calls to a service or limit the amount of compute load per customer in order to prevent overuse of resources. This is a practice known as throttling and ensures that Azure services can handle usage and incoming requests without service outages. Throttling can occur at the application, tenant, or entire service level. Throttling commonly occurs when an application has a large number of requests within or across tenants.  At runtime, your application can read or update Microsoft Entra directory objects through Microsoft Graph as part of it's business logic. For example, read or set user attributes, update a user’s calendar, or send emails on behalf of the user.  While running, your application could also deploy, access, update, and delete Azure resources as well. During testing, your application could hit these runtime throttling limits and the previously mentioned service limits while deploying resources or directory objects.

<a name='azure-ad-service-limits-relevant-to-testing'></a>

## Microsoft Entra service limits relevant to testing
General Microsoft Entra usage constraints and service limits can be found [here](../enterprise-users/directory-service-limits-restrictions.md).  General Azure subscription and service limits, quotas, and constraints can be found [here](../../azure-resource-manager/management/azure-subscription-service-limits.md).

The following table lists Microsoft Entra service limits to consider when setting up a test environment or running tests. 

| Category         | Limit   |
|-------------------|----------------|
| Tenants | A single user can create a maximum of 200 directories.|
| Resources | <ul><li>A maximum of 50,000 Microsoft Entra resources can be created in a single tenant by users of the Free edition of Microsoft Entra ID by default. If you've at least one verified domain, the default Microsoft Entra service quota for your organization is extended to 300,000 Microsoft Entra resources. Microsoft Entra service quota for organizations created by self-service sign-up remains 50,000 Microsoft Entra resources even after you performed an internal admin takeover and the organization is converted to a managed tenant with at least one verified domain. This service limit is unrelated to the pricing tier limit of 500,000 resources on the Microsoft Entra pricing page. To go beyond the default quota, you must contact Microsoft Support.</li><li>A non-admin user can create no more than 250 Microsoft Entra resources. Both active resources and deleted resources that are available to restore count toward this quota. Only deleted Microsoft Entra resources that were deleted fewer than 30 days ago are available to restore. Deleted Microsoft Entra resources that are no longer available to restore count toward this quota at a value of one-quarter for 30 days. If you have developers who are likely to repeatedly exceed this quota in the course of their regular duties, you can create and assign a custom role with permission to create a limitless number of app registrations.</li></ul>|
| Applications| <ul><li>A user, group, or service principal can have a maximum of 1,500 app role assignments.</li><li>A user can only have a maximum of 48 apps where they have username and password credentials configured.</li></ul>|
| Application manifest| A maximum of 1200 entries can be added in the Application Manifest. |
| Groups |  <ul><li>A non-admin user can create a maximum of 250 groups in a Microsoft Entra organization. Any Microsoft Entra admin who can manage groups in the organization can also create unlimited number of groups (up to the Microsoft Entra object limit). If you assign a role to remove the limit for a user, assign them to a less privileged built-in role such as User Administrator or Groups Administrator.</li><li>A Microsoft Entra organization can have a maximum of 5000 dynamic groups.</li><li>A maximum of 300 role-assignable groups can be created in a single Microsoft Entra organization (tenant).</li><li>Any number of Microsoft Entra resources can be members of a single group.</li><li>A user can be a member of any number of groups.</li></ul>|
| Microsoft Entra roles and permissions | <ul><li>A maximum of 30 Microsoft Entra custom roles can be created in a Microsoft Entra organization.</li><li>A maximum of 100 Microsoft Entra custom role assignments for a single principal at tenant scope.</li><li>A maximum of 100 Microsoft Entra built-in role assignments for a single principal at non-tenant scope (such as administrative unit or Microsoft Entra object). There is no limit for Microsoft Entra built-in role assignments at tenant scope.</li></ul>|


## Throttling limits relevant to testing

The following global Microsoft Graph throttling limits apply:

| Request type | Per app across all tenants |
|-------------------|----------------|
| Request type | Per app across all tenants |
| Any | 2000 requests per second| 

The following table lists Microsoft Entra throttling limits to consider when running tests. Throttling is based on a token bucket algorithm, which works by adding individual costs of requests. The sum of request costs is then compared against pre-determined limits. Only the requests exceeding the limits will be throttled. For more detailed information on request costs, see [Identity and access service limits](/graph/throttling#pattern). Other service-specific limits on Microsoft Graph can be found [here](/graph/throttling#service-specific-limits).

| Limit type | Resource unit quota | Write quota |
|-------------------|----------------|----------------|
| application+tenant pair | S: 3500, M:5000, L:8000 per 10 seconds | 3000 per 2 minutes and 30 seconds |
| application | 150,000 per 20 seconds | 35,000 per 5 minutes |
| tenant | Not Applicable | 18,000 per 5 minutes |

The application + tenant pair limit varies based on the number of users in the tenant requests are run against. The tenant sizes are defined as follows: S - under 50 users, M - between 50 and 500 users, and L - above 500 users.

## What happens when a throttling limit is exceeded? 
Throttling behavior can depend on the type and number of requests. For example, if you have a high volume of requests, all requests types are throttled. Threshold limits vary based on the request type. Therefore, you could encounter a scenario where writes are throttled but reads are still permitted.

When you exceed a throttling limit, you receive the HTTP status code `429 Too many requests` and your request fails. The response includes a `Retry-After` header value, which specifies the number of seconds your application should wait (or sleep) before sending the next request. Retry the request.  If you send a request before the retry value has elapsed, your request isn't processed and a new retry value is returned. If the request fails again with a 429 error code, you are still being throttled. Continue to use the recommended `Retry-After` delay and retry the request until it succeeds.

## Next steps
Learn how to [setup a test environment](test-setup-environment.md).
