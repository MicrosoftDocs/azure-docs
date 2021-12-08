---
title: Workload identities 
titleSuffix: Microsoft identity platform
description: 
services: active-directory
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
#Customer intent: As a developer, I want to learn what workload identities are and
---

# What are workload identities?

A workload identity is an identity used by a software workload (such as an application, service, script, or container) to authenticate and access other services and resources. The terminology for software, or workload, identities is inconsistent across the industry. Generally, a workload identity is anything you need for your software to authenticate with some system.  A workload identity could be a database account or a role in AWS that you need to access S3. Some examples of workload identities in Azure Active Directory (Azure AD) are:

- An application that enables access to Microsoft Graph based on admin or user consent. This access could be either on behalf of the user or on behalf of the application.
- A managed identity used by a developer to provision their service with access to an Azure resource such as Azure Key Vault or Azure Storage.
- A service principal used by a developer to enable CI/CD with GitHub Actions.

## Human and non-human/machine identities

At a high level, there are two types of identities: human and machine/non-human identities.  Human identities can be employees (internal workers, front line workers) and external users (customers, consultants, vendors, or partners). Machine, or non-human, identities can be devices (desktop computers, mobile, IoT sensors, or IoT managed devices) or workloads (applications, services, web apps, scripts, containers, virtual machines).

:::image type="content" source="media/workload-identities-overview/identity-types.svg" alt-text="Shows different types of machine and human identities" border="false":::

## Supported scenarios
- Review service principals and applications that are assigned to privileged directory roles in Azure AD using [access reviews for service principals](/azure/active-directory/privileged-identity-management/pim-create-azure-ad-roles-and-resource-roles-review).
- Access Azure AD protected resources without needing to manage secrets (for supported scenarios) using [workload identity federation](workload-identity-federation.md).

## Next steps