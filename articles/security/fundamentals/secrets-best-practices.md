---
title: Best practices for protecting secrets - Microsoft Azure | Microsoft Docs
description: This article links you to security best practices for protecting secrets.
services: security
documentationcenter: na
author: TerryLanfear
manager: rkarlin

ms.assetid: 1cbbf8dc-ea94-4a7e-8fa0-c2cb198956c5
ms.service: security
ms.subservice: security-fundamentals
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/09/2023
ms.author: terrylan

---
# Best practices for protecting secrets
This article provides guidance on protecting secrets. Follow this guidance to help ensure you do not log sensitive information, such as credentials, into GitHub repositories or continuous integration/continuous deployment (CI/CD) pipelines.

## Best practices

These best practices are intended to be a resource for IT pros. This might include designers, architects, developers, and testers who build and deploy secure Azure solutions.

- Azure Stack Hub: [Rotate secrets](/azure-stack/operator/azure-stack-rotate-secrets)
- Azure Key Vault: [Centralize storage of application secrets](../../key-vault/general/overview.md)
- Azure Communications Service: [Create and manage access tokens](../../communication-services/quickstarts/identity/access-tokens.md)
- Azure Service Bus: [Authenticate and authorize an application with Microsoft Entra ID to access Azure Service Bus entities](../../service-bus-messaging/authenticate-application.md)
- Azure App Service: [Learn to configure common settings for an App Service application](../../app-service/configure-common.md)
- Azure Pipelines: [Protecting secrets in Azure Pipelines](/azure/devops/pipelines/security/secrets)

## Next steps

Minimizing security risk is a shared responsibility. You need to be proactive in taking steps to secure your workloads. [Learn more about shared responsibility in the cloud](shared-responsibility.md).

See [Azure security best practices and patterns](best-practices-and-patterns.md) for more security best practices to use when you're designing, deploying, and managing your cloud solutions by using Azure.
