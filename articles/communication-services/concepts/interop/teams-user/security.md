---
title: Security of communication as Teams user
titleSuffix: An Azure Communication Services concept document
description: This article describes the security of communication as a Teams user with Azure Communication Services.
author: tomaschladek
manager: chpalmer
services: azure-communication-services

ms.author: tchladek
ms.date: 02/02/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---
# Security of communication as Teams user
In this article, you'll learn about the security measures and frameworks implemented by Microsoft Teams, Azure Communication Services, and Azure Active Directory to provide a secure collaboration environment. The products implement data encryption, secure real-time communication, two-factor authentication, user authentication, and authorization to prevent common security threats. The security frameworks for these services are based on industry standards and best practices. 

## Microsoft Teams
Microsoft Teams handles security using a combination of technologies and processes to mitigate common security threats and provide a secure collaboration environment. Teams implement multiple layers of security, including data encryption in transit and at rest, secure real-time communication through Microsoft's global network, and two-factor authentication for added protection. The security framework for Teams is built on the Microsoft Security Development Lifecycle (SDL), a comprehensive and standardized approach to software security covering all stages of development. Teams also undergo regular security assessments and audits to ensure that the platform meets industry standards for security and privacy. Additionally, Teams integrates with Microsoft's suite of security products and services, such as Azure Active Directory, to provide customers with a comprehensive security solution. You can learn here more about [security in Microsoft Teams](/microsoftteams/teams-security-guide). Additionally, you can find more about Microsoft's [resiliency and continuity here](/compliance/assurance/assurance-data-resiliency-overview).

## Azure Communication Services
Azure Communication Services handles security by implementing various security measures to prevent and mitigate common security threats. These measures include data encryption in transit and at rest, secure real-time communication through Microsoft's global network, and authentication mechanisms to verify the identity of users. The security framework for Azure Communication Services is based on industry standards and best practices. Azure also undergoes regular security assessments and audits to ensure that the platform meets industry standards for security and privacy. Additionally, Azure Communication Services integrates with other Azure security services, such as Azure Active Directory, to provide customers with a comprehensive security solution. Customers can also control access to the services and manage their security settings through the Azure portal. You can learn here more about [Azure security baseline](/security/benchmark/azure/baselines/azure-communication-services-security-baseline?toc=/azure/communication-services/toc.json), about security of [call flows](../../call-flows.md) and [call flow topologies](../../detailed-call-flows.md).

## Azure Active Directory
Azure Active Directory provides a range of security features for Microsoft Teams to help handle common security threats and provide a secure collaboration environment. Azure AD helps to secure user authentication and authorization, allowing administrators to manage user access to Teams and other applications through a single, centralized platform. Azure AD also integrates with Teams to provide multi-factor authentication and conditional access policies, which can be used to enforce security policies and control access to sensitive information. The security framework for Azure Active Directory is based on the Microsoft Security Development Lifecycle (SDL), a comprehensive and standardized approach to software security that covers all stages of development. Azure AD undergoes regular security assessments and audits to ensure that the platform meets industry standards for security and privacy. Additionally, Azure AD integrates with other Azure security services, such as Azure Information Protection, to provide customers with a comprehensive security solution. You can learn here more about [Azure identity management security](../../../../security/fundamentals/identity-management-overview.md).