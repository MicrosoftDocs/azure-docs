---
title: Authentication (preview) - Azure Monitor Application Insights for Java
description: Learn to configure agent to generate token credentials that are required for AAD authentication.
ms.topic: conceptual
ms.date: 5/19/2021
author: kryalama
ms.custom: devx-track-java
ms.author: kryalama
---

# Authentication (preview) - Azure Monitor Application Insights for Java

> [!NOTE]
> The Authentication feature is in preview.
> Authentication feature is available starting from version 3.2.0-BETA

Application insights Java agent support Azure active directory based authentication. It is the responsibility of the user of the Java agent to provide the necessary details for the agent to build the [TokenCredentials](https://go.microsoft.com/fwlink/?linkid=2163810) required for authentication with AAD.

## Prerequisites

We assume users to be familiar with the following concepts before enabling authentication with AAD.
- [Managed Identities](/azure/active-directory/managed-identities-azure-resources/overview) for Azure resources.
- [Assign Azure roles](/azure/role-based-access-control/role-assignments-portal?tabs=current) using the Azure portal.

## Steps to enable AAD authentication

Following is a high level view of the steps involved in enabling AAD authentication on Java agent to securely send telemetry to Azure Application Insights resource:

1. The first step depends on the type of authentication used by the user. 
    -   If using System-assigned managed identity or User-assigned managed identity, follow these [steps](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm) to configure managed identities for Azure resources on a VM using Azure portal. 
    -   If using service principal, follow these [steps](/azure/active-directory/develop/howto-create-service-principal-portal) to create an Azure AD application and service principal that can access resources. We recommend to use this type of authentication only during development.
2. Follow these [steps](/azure/role-based-access-control/role-assignments-portal?tabs=current) to add `"Monitoring Metrics Publisher"` role from the Application Insights resource to the Azure resource from which the telemetry is sent.
3. Add the authentication related [configuration](#supported-types-of-authentication) to the ApplicationInsights.json configuration file.

## Supported types of authentication

The following are types of authentication that are supported by Java agent. 

> [!NOTE]
> We recommend using managed identities, since the ultimate goal is to eliminate secrets and also to eliminate the need for developers to manage credentials.

### System-assigned managed identity

Here is an example on how to configure Java agent to use System-assigned managed identity for authentication with AAD.

```json
"preview" : {
    "authentication" : {
      "enabled": true,
      "type": "SAMI"
    }
}
```

### User-assigned managed identity

Here is an example on how to configure Java agent to use User-assigned managed identity for authentication with AAD.

```json
"preview" : {
    "authentication" : {
      "enabled": true,
      "type": "UAMI",
      "clientId":"<User-assigned MANAGED IDENTITY CLIENT ID>"
    }
}
```

:::image type="content" source="media/java-ipa/authentication/user-assigned-managed-identity.png" alt-text="Screenshot of User-assigned managed identity." lightbox="media/java-ipa/authentication/user-assigned-managed-identity.png":::

### Client secret

Here is an example on how to configure Java agent to use service principal for authentication with AAD.

```json
"preview" : {
    "authentication" : {
      "enabled": true,
      "type": "CLIENTSECRET",
      "clientId":"<YOUR CLIENT ID>",
      "clientSecret":"<YOUR CLIENT SECRET>",
      "tenantId":"<YOUR TENANT ID>"
    }
}
```

:::image type="content" source="media/java-ipa/authentication/client-secret-tenant-id.png" alt-text="Screenshot of Client secret with tenantID and ClientID." lightbox="media/java-ipa/authentication/client-secret-tenant-id.png":::

:::image type="content" source="media/java-ipa/authentication/client-secret-cs.png" alt-text="Screenshot of Client secret with client secret." lightbox="media/java-ipa/authentication/client-secret-cs.png":::
