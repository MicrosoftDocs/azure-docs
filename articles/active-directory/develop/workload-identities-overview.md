---
title: Workload identities 
description: Understand the concepts and supported scenarios for using workload identity in Azure Active Directory.
author: rwike77
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 12/06/2021
ms.author: ryanwi
ms.reviewer: udayh, ilanas
ms.custom: aaddev 
#Customer intent: As a developer, I want workload identities so I can authenticate with Azure AD and access Azure AD protected resources.
---

# What are workload identities?

A workload identity is an identity used by a software workload (such as an application, service, script, or container) to authenticate and access other services and resources. The terminology is inconsistent across the industry, but generally a workload identity is something you need for your software entity to authenticate with some system.  For example, a workload identity could be a user account that your client authenticates as to access a MongoDB database.  A workload identity could also be an AWS service role attached to an EC2 instance with read-only access to an Amazon S3 bucket.

In Azure Active Directory (Azure AD), workload identities are applications, service principals, and managed identities.  

An [application](app-objects-and-service-principals.md#application-object) is an abstract entity, or template, defined by its application object.  The application object is the *global* representation of your application for use across all tenants. The application object describes how tokens are issued, the resources the application needs to access, and the actions that the application can take.

A [service principal](app-objects-and-service-principals.md#service-principal-object) is the *local* representation, or application instance, of a global application object in a specific tenant. An application object is used as a template to create a service principal object in every tenant where the application is used.  The service principal object defines what the app can actually do in a specific tenant, who can access the app, and what resources the app can access.

A [managed identity](../managed-identities-azure-resources/overview.md) is a special type of service principal that eliminates the need for developers to manage credentials.

Here are some ways that workload identities in Azure AD are used:

- An app that enables a web app to access Microsoft Graph based on admin or user consent. This access could be either on behalf of the user or on behalf of the application.
- A managed identity used by a developer to provision their service with access to an Azure resource such as Azure Key Vault or Azure Storage.
- A service principal used by a developer to enable a CI/CD pipeline to deploy a web app from GitHub to Azure App Service.

## Workload identities, other machine identities, and human identities

At a high level, there are two types of identities: human and machine/non-human identities. Workload identities and device identities together make up a group called machine (or non-human) identities.  Workload identities represent software workloads while device identities represent devices such as desktop computers, mobile, IoT sensors, and IoT managed devices. Machine identities are distinct from human identities, which represent people such as employees (internal workers and front line workers) and external users (customers, consultants, vendors, and partners).  

:::image type="content" source="media/workload-identities-overview/identity-types.svg" alt-text="Shows different types of machine and human identities" border="false":::

## Supported scenarios


Here are some ways you can use workload identities:

- Access Azure AD protected resources without needing to manage secrets for workloads that run on Azure using [managed identity](../managed-identities-azure-resources/overview.md).
- Access Azure AD protected resources without needing to manage secrets for scenarios such as GitHub Actions, workloads running on Kubernetes, or workloads running in compute platforms outside of Azure using [workload identity federation](workload-identity-federation.md).
- Review service principals and applications that are assigned to privileged directory roles in Azure AD using [access reviews for service principals](../privileged-identity-management/pim-create-azure-ad-roles-and-resource-roles-review.md).
- Apply Conditional Access policies to service principals owned by your organization using [Conditional Access for workload identities](../conditional-access/workload-identity.md).
- Secure workload identities with [Identity Protection](../identity-protection/concept-workload-identity-risk.md).


## Next steps

Learn how to [secure access of workload identities](../conditional-access/workload-identity.md) with adaptive policies.
