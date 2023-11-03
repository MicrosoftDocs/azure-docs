---
title: Workload identities 
description: Understand the concepts and supported scenarios for using workload identity in Microsoft Entra.
author: rwike77
manager: CelesteDG
ms.service: active-directory
ms.subservice: workload-identities
ms.workload: identity
ms.topic: conceptual
ms.date: 08/08/2023
ms.author: ryanwi
ms.reviewer: arluca, ilanas, naha
ms.custom: aaddev 
#Customer intent: As a developer, I want workload identities so I can authenticate with Microsoft Entra ID and access Microsoft Entra protected resources.
---

# What are workload identities?

A workload identity is an identity you assign to a software workload (such as an application, service, script, or container) to authenticate and access other services and resources. The terminology is inconsistent across the industry, but generally a workload identity is something you need for your software entity to authenticate with some system.  For example, in order for GitHub Actions to access Azure subscriptions the action needs a workload identity which has access to those subscriptions.  A workload identity could also be an AWS service role attached to an EC2 instance with read-only access to an Amazon S3 bucket.

In Microsoft Entra, workload identities are applications, service principals, and managed identities.  

An [application](../develop/app-objects-and-service-principals.md?toc=/azure/active-directory/workload-identities/toc.json&bc=/azure/active-directory/workload-identities/breadcrumb/toc.json) is an abstract entity, or template, defined by its application object.  The application object is the *global* representation of your application for use across all tenants. The application object describes how tokens are issued, the resources the application needs to access, and the actions that the application can take.

A [service principal](../develop/app-objects-and-service-principals.md?toc=/azure/active-directory/workload-identities/toc.json&bc=/azure/active-directory/workload-identities/breadcrumb/toc.json) is the *local* representation, or application instance, of a global application object in a specific tenant. An application object is used as a template to create a service principal object in every tenant where the application is used.  The service principal object defines what the app can actually do in a specific tenant, who can access the app, and what resources the app can access.

A [managed identity](../managed-identities-azure-resources/overview.md?toc=/azure/active-directory/workload-identities/toc.json&bc=/azure/active-directory/workload-identities/breadcrumb/toc.json) is a special type of service principal that eliminates the need for developers to manage credentials.

Here are some ways that workload identities in Microsoft Entra ID are used:

- An app that enables a web app to access Microsoft Graph based on admin or user consent. This access could be either on behalf of the user or on behalf of the application.
- A managed identity used by a developer to provision their service with access to an Azure resource such as Azure Key Vault or Azure Storage.
- A service principal used by a developer to enable a CI/CD pipeline to deploy a web app from GitHub to Azure App Service.

## Workload identities, other machine identities, and human identities

At a high level, there are two types of identities: human and machine/non-human identities. Workload identities and device identities together make up a group called machine (or non-human) identities.  Workload identities represent software workloads while device identities represent devices such as desktop computers, mobile, IoT sensors, and IoT managed devices. Machine identities are distinct from human identities, which represent people such as employees (internal workers and front line workers) and external users (customers, consultants, vendors, and partners).  

:::image type="content" source="media/workload-identities-overview/identity-types.svg" alt-text="Diagram that shows different types of machine and human identities." border="false":::

## Need for securing workload identities

More and more, solutions are reliant on non-human entities to complete vital tasks and the number of non-human identities is increasing dramatically. Recent cyber attacks show that adversaries are increasingly targeting non-human identities over human identities.

Human users typically have a single identity used to access a broad range of resources. Unlike a human user, a software workload may deal with multiple credentials to access different resources and those credentials need to be stored
securely. It’s also hard to track when a workload identity is created or when it should be revoked. Enterprises risk their applications or services being exploited or breached because of difficulties in securing workload identities.

:::image type="content" source="media/workload-identities-overview/pain-points.png" alt-text="Diagram that shows pain points in securing workload identities." border="false":::

Most identity and access management solutions on the market today are focused only on securing human identities and not workload identities. Microsoft Entra Workload ID helps resolve these issues when securing workload identities.

## Key scenarios

Here are some ways you can use workload identities.

Secure access with adaptive policies:

- Apply Conditional Access policies to service principals owned by your organization using [Conditional Access for workload identities](../conditional-access/workload-identity.md?toc=/azure/active-directory/workload-identities/toc.json&bc=/azure/active-directory/workload-identities/breadcrumb/toc.json).
- Enable real-time enforcement of Conditional Access location and risk policies using [Continuous access evaluation for workload identities](../conditional-access/concept-continuous-access-evaluation-workload.md?toc=/azure/active-directory/workload-identities/toc.json&bc=/azure/active-directory/workload-identities/breadcrumb/toc.json).
- Manage [custom security attributes for an app](../manage-apps/custom-security-attributes-apps.md?toc=/azure/active-directory/workload-identities/toc.json&bc=/azure/active-directory/workload-identities/breadcrumb/toc.json)

Intelligently detect compromised identities:

- Detect risks (like leaked credentials), contain threats, and reduce risk to workload identities using [Identity Protection](../identity-protection/concept-workload-identity-risk.md?toc=/azure/active-directory/workload-identities/toc.json&bc=/azure/active-directory/workload-identities/breadcrumb/toc.json).

Simplify lifecycle management:

- Access Microsoft Entra protected resources without needing to manage secrets for workloads that run on Azure using [managed identities](../managed-identities-azure-resources/overview.md?toc=/azure/active-directory/workload-identities?toc=/azure/active-directory/workload-identities/toc.json&bc=/azure/active-directory/workload-identities/breadcrumb/toc.json).
- Access Microsoft Entra protected resources without needing to manage secrets using [workload identity federation](workload-identity-federation.md) for supported scenarios such as GitHub Actions, workloads running on Kubernetes, or workloads running in compute platforms outside of Azure.
- Review service principals and applications that are assigned to privileged directory roles in Microsoft Entra ID using [access reviews for service principals](../privileged-identity-management/pim-create-roles-and-resource-roles-review.md?toc=/azure/active-directory/workload-identities/toc.json&bc=/azure/active-directory/workload-identities/breadcrumb/toc.json).

## Next steps

- Get answers to [frequently asked questions about workload identities](workload-identities-faqs.md). 
