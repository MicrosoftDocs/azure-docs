---
title: Security for communication as Teams external user
titleSuffix: An Azure Communication Services concept document
description: This article describes security for communication as a Teams external user with Azure Communication Services.
author: tomaschladek
manager: chpalmer
services: azure-communication-services

ms.author: tchladek
ms.date: 02/02/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---
# Security of communication as Teams external user

In this article, you'll learn about the security measures and frameworks implemented by Microsoft Teams and Azure Communication Services to provide a secure collaboration environment. The products implement data encryption, secure real-time communication, two-factor authentication, user authentication, and authorization to prevent common security threats. The security frameworks for these services are based on industry standards and best practices.

## Microsoft Teams
Microsoft Teams handles security using a combination of technologies and processes to mitigate common security threats and provide a secure collaboration environment. Teams implement multiple layers of security, including data encryption in transit and at rest, secure real-time communication through Microsoft's global network, and two-factor authentication for added protection. The security framework for Teams is built on the Microsoft Security Development Lifecycle (SDL), a comprehensive and standardized approach to software security covering all stages of development. Teams also undergo regular security assessments and audits to ensure that the platform meets industry standards for security and privacy. Additionally, Teams integrates with Microsoft's suite of security products and services, such as Microsoft Entra ID, to provide customers with a comprehensive security solution. You can learn here more about [security in Microsoft Teams](/microsoftteams/teams-security-guide). Additionally, you can find more about Microsoft's [resiliency and continuity here](/compliance/assurance/assurance-data-resiliency-overview).

Additionally, Microsoft Teams provides several policies and tenant configurations to control Teams external users joining and in-meeting experience. Teams administrators can use settings in the Microsoft Teams admin center or PowerShell to control whether Teams external users can join Teams meetings, bypass lobby, start a meeting, participate in chat, or default role assignment. You can learn more about the [policies here](./teams-administration.md).

## Microsoft Purview

Microsoft Purview provides robust data security features to protect sensitive information. One of the key features of Purview is [data loss prevention (DLP)](/microsoft-365/compliance/dlp-microsoft-teams), which helps organizations to prevent accidental or unauthorized sharing of sensitive data. Developers can use [Communication Services UI library](../../ui-library/ui-library-overview.md) or follow [how-to guide](../../../how-tos/chat-sdk/data-loss-prevention.md) to support data loss prevention in Teams meetings. In addition, Purview offers [Customer Key](/microsoft-365/compliance/customer-key-overview), which allows customers to manage the encryption keys used to protect their data fully. Chat messages sent by Teams external users are encrypted at rest with the Customer Key provided in Purview. These features help customers meet compliance requirements. 

## Azure Communication Services
Azure Communication Services handles security by implementing various security measures to prevent and mitigate common security threats. These measures include data encryption in transit and at rest, secure real-time communication through Microsoft's global network, and authentication mechanisms to verify the identity of users. The security framework for Azure Communication Services is based on industry standards and best practices. Azure also undergoes regular security assessments and audits to ensure that the platform meets industry standards for security and privacy. Additionally, Azure Communication Services integrates with other Azure security services, such as Microsoft Entra ID, to provide customers with a comprehensive security solution. Customers can also control access to the services and manage their security settings through the Azure portal. You can learn here more about [Azure security baseline](/security/benchmark/azure/baselines/azure-communication-services-security-baseline?toc=/azure/communication-services/toc.json), about security of [call flows](../../call-flows.md) and [call flow topologies](../../detailed-call-flows.md).
