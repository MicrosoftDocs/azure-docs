---
#customer intent: As a developer, I want to understand my secrets options for Azure Functions on Azure Container Apps so I can choose the right approach.
title: Manage secrets for Azure Functions on Azure Container Apps
description: Learn about the two categories of secrets for Azure Functions on Azure Container Apps - app-level secrets and access keys - and choose the right storage approach.
author: deepganguly
ms.author: deepganguly
ms.reviewer: cshoe
ms.service: azure-container-apps
ms.topic: overview
ms.date: 04/28/2026
---

# Manage secrets for Azure Functions on Azure Container Apps

When you run Azure Functions on Azure Container Apps, you work with two categories of secrets:

| Category | Description | Consumed by |
|----------|------------|-------------|
| **[App-level secrets](#app-level-secrets)** | Configuration values your function code reads at runtime, such as database connection strings, API keys, and trigger/binding credentials. | Your code and the Functions runtime bindings. |
| **[Functions access keys](#functions-access-keys)** | Authentication tokens ([access keys](/azure/azure-functions/function-keys-how-to#understand-keys)) that secure HTTP-triggered function endpoints, including master, host, function, and system keys. | External callers of your HTTP functions (services, webhooks, developers). |

These two categories differ in **direction**:

| | App-level secrets | Functions access keys |
|---|---|---|
| **Direction** | Outbound - your function authenticates to other services | Inbound - callers authenticate to your function |
| **Who holds the secret** | Your function app | The caller (webhook provider, service, developer) |
| **What it protects** | What your function connects to | Who can invoke your HTTP endpoint |
| **Validated by** | The target service | The Functions runtime |

## App-level secrets

App-level secrets are the credentials your function code and bindings need to connect to external services. You can store them in two ways:

| Option | Best for | Rotation | Audit | Guide |
|--------|---------|----------|-------|-------|
| **Container Apps secrets** | Dev/test, simple single-app workloads | Manual | Activity logs only | [Store app-level secrets](functions-secrets-app-level.md#use-container-apps-secrets) |
| **Key Vault references** | Production, multi-app, compliance | Automatic (versionless URI) | Full Key Vault diagnostics | [Store app-level secrets](functions-secrets-app-level.md#use-key-vault-references) |

> [!TIP]
> Start with Container Apps secrets for simplicity. Move to Key Vault references when you need centralized management, automatic rotation, or compliance-grade auditing.

## Functions access keys

Access keys provide lightweight shared-secret authentication for HTTP endpoints. Use [access keys](/azure/azure-functions/function-keys-how-to#understand-keys) when callers can't present Microsoft Entra ID tokens, such as third-party webhooks, service-to-service calls, or during development.

Set the `AzureWebJobsSecretStorageType` environment variable to choose a storage backend:

| Backend | Setting value | Best for | Guide |
|---------|--------------|---------|-------|
| **Container Apps secret store** | `containerapp` | Most workloads - no external dependencies (**Recommended**) | [Configure host keys](functions-secrets-host-keys.md#configure-the-container-apps-secret-store) |
| **Azure Key Vault** | `keyvault` | Centralized governance, compliance auditing | [Configure host keys](functions-secrets-host-keys.md#configure-key-vault) |
| **Azure Blob Storage** | `blob` | Legacy apps or existing `AzureWebJobsStorage` dependency | [Configure host keys](functions-secrets-host-keys.md#configure-blob-storage) |
| **Local file system** | `files` | **Not recommended on Container Apps** - see warning | N/A |

> [!WARNING]
> The Azure Functions host defaults to `files` (local file system) when `AzureWebJobsSecretStorageType` isn't set. On Azure Container Apps, the file system is **ephemeral**. Host keys stored with `files` are lost on every restart, scale-to-zero event, or revision deployment. Always configure one of the three production backends listed here.

## Next steps

Choose the guide that matches the type of secret you need to manage:

- [Store app-level secrets for Functions on Container Apps](functions-secrets-app-level.md)
- [Configure Functions host key storage on Container Apps](functions-secrets-host-keys.md)

## Related content

- [Store app-level secrets for Functions on Container Apps](functions-secrets-app-level.md)
- [Configure Functions host key storage on Container Apps](functions-secrets-host-keys.md)
- [Manage secrets in Azure Container Apps](manage-secrets.md)
- [Azure Functions on Azure Container Apps overview](functions-overview.md)
- [Managed identities in Container Apps](managed-identity.md)
