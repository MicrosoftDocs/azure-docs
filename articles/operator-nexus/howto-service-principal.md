---
title: Azure Operator Nexus service principal best practices
description: Guidance how to properly use Service Principals in Operator Nexus.
ms.service: azure-operator-nexus
ms.custom: template-how-to
ms.topic: how-to
ms.date: 06/12/2024
author: matternst7258
ms.author: matthewernst
---

# Service principal best practices

Service principals in Azure are identity entities that are used by applications, services, and automation tools to access specific Azure resources. They can be thought of as 'users' for applications, allowing these applications to interact with Azure services. Service principals provide and control permissions to Azure resources within your subscription, allowing you to specify exactly what actions an application can perform in your environment. 

For more information on how to create a Service principal, an existing Azure Learn [documentation](/entra/architecture/service-accounts-principal) goes into Service Principal fundamentals.

## Service principals in Operator Nexus

A single customer-provided Service principal is used by Operator Nexus to facilitate the connectivity between Azure and the on-premises cluster.

## Creating a service principal

For information on how to rotate a service principal, reference [how to create a service principal](../active-directory/develop/howto-create-service-principal-portal.md).

## Rotating a service principal

For information on how to rotate a service principal, reference [how to rotate service principal](../operator-nexus/howto-service-principal-rotation.md).

## Best practices 

The list is a high-level list of recommended security considerations to take into account when managing a new service principal.

- **Least Privilege**: Assign the minimum permissions necessary for the service principal to perform its function. Avoid assigning broad permissions if they aren't needed.
- **Lifecycle Management**: Regularly review and update service principals. Remove or disable them when not required.
- **Use Managed Identities**: Where possible, use Azure Managed Identities instead of creating and managing service principals manually.
- **Secure Secrets**: If a service principal uses a password (client secret), ensure credentials are stored securely. Consider using Azure Key Vault.
- **Monitor Activity**: Use Azure Monitor and Azure Log Analytics to track the activities of your service principals.
- **Rotation of Secrets**: Regularly rotate and change the service principal's secrets. The maximum recommended duration is 180 days. 
- **Use Azure Policy**: Implement Azure policies to audit and enforce best practices for service principals.