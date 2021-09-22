---
title: Azure Policy built-in support in Media Services
description: This article discusses Azure Policy built-in support for Azure Media Services scenarios.
services: media-services
documentationcenter: ''
author: johndeu
manager: femila
editor: ''
ms.service: media-services
ms.workload: 
ms.topic: conceptual
ms.date: 08/31/2020
ms.author: johndeu
ms.custom: seodec18, devx-track-csharp
---

# Azure Policy for Media Services

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

Azure Media Services provides several built-in [Azure Policy](../../governance/policy/overview.md) definitions to help enforce organizational standards and compliance at-scale.
Common use cases for Azure Policy include implementing governance for resource consistency,regulatory compliance, security, cost and management.

Media Services provides several common use case definitions for Azure Policy that a built-in to help you get started.

## Built-in Azure Policy definitions for Media Services

Several built in policy use case definitions are available for use with Media Services to help get you started, and allow you to define your own custom policies.

[!INCLUDE [Azure Policy Media Services](../../../includes/policy/reference/bycat/policies-media-services.md)]

The [list of built-in policy definitions for Media Services](../../governance/policy/samples/built-in-policies.md#media-services) provides the latest definitions and links the code definitions and how to access them in the Portal.

## Common scenarios that require Azure Policy

* If your enterprise security requires you to ensure that all Media Services accounts are created with Private Links, you can use a policy definition to ensure that accounts are only created with the 2020-05-01 API (or later) to disable access to the legacy REST v2 API and access the Private Link feature.
* If you want to enforce specific options on the tokens used for Content Key Policies, an Azure Policy definition can be constructed to support the specific requirements.
* If your security goals require you to restrict a Job input source to only come from your trusted storage accounts, and restrict access to external HTTP(S) inputs through the use of JobInputHttp, an Azure policy can be constructed to limit the input URI pattern.

## Example policy definitions

Azure Media Services maintains and publishes a set of sample Azure Policy definitions in Git hub.
See the [built-in policy definitions for Media Services](https://github.com/Azure/azure-policy/tree/master/built-in-policies/policyDefinitions/Media%20Services) samples in the azure-policy Git hub repository.

See the following articles for more information:

- [What is Azure Policy](../../governance/policy/overview.md)
- [Quickstart:Create a policy in the Portal](../../governance/policy/assign-policy-portal.md)
- [List of built-in policy definitions for Media Services](../../governance/policy/samples/built-in-policies.md#media-services)

## Next steps

- [Developing with Media Services v3 APIs](media-services-apis-overview.md)
- [Role based access control in Media Services](security-rbac-concept.md)
- [Private link how-to with Media Services](security-private-link-how-to.md)