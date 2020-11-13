---
title: Authenticate against Azure resources with Arc enabled servers
description: This article describes Azure Instance Metadata Service support for Arc enabled servers and how you can authenticate against Azure resources and local using a secret.
ms.topic: conceptual
ms.date: 11/13/2020
---

# Authenticate against Azure resources with Arc enabled servers

Applications or processes running directly on an Azure Arc enabled servers can leverage managed identities to access other Azure resources which support Azure Active Directory-based authentication. An application can obtain an [access token](../../active-directory/develop/developer-glossary.md#access-token) representing its identity, which is system-assigned for Arc enabled servers, and use it as a 'bearer' token to authenticate itself to another service.

Refer to the [managed identity overview](../../active-directory/managed-identities-azure-resources/overview.md) documentation for a detailed description of managed identities, as well as the distinction between system-assigned and user-assigned identities.

In this article, we show you how a server can use a system-assigned managed identity to access Azure [Key Vault](../../key-vault/general/overview.md). Serving as a bootstrap, Key Vault makes it possible for your client application to then use a secret to access resources not secured by Azure Active Directory (AD). For example, TLS/SSL certificates used by your IIS web servers can be stored in Azure Key Vault, and securely deploy these certificates to Windows or Linux servers or virtual machines outside of Azure.

## Security overview

While onboarding your server to Azure Arc enabled servers, several actions are performed to configure the resource to support using a managed identity, similar to what is performed for an Azure VM:

- Azure Resource Manager receives a request to enable the system-assigned managed identity on the Arc enabled server.

- Azure Resource Manager creates a service principal in Azure AD for the identity of the server. The service principal is created in the Azure AD tenant that's trusted by the subscription.

- Azure Resource Manager configures the identity on the server by updating the Azure Instance Metadata Service (IMDS) identity endpoint for [Windows](../../virtual-machines/windows/instance-metadata-service.md) or [Linux](../../virtual-machines/linux/instance-metadata-service.md) with the service principal client ID and certificate. The endpoint is a REST endpoint accessible only from within the server using a well-known, non-routable IP address. This service provides a subset of metadata information about the Arc enabled server to help manage and configure it.

The environment of a managed-identity-enabled server will be configured with the following variables:

- **IDMS_ENDPOINT**: The IDMS endpoint IP address `127.0.0.1:40342` for Arc enabled servers.

- **IDENTITY_ENDPOINT**: the localhost endpoint corresponding to service's managed identity `http://127.0.0.1:40342/metadata/identity/oauth2/token`.

Your code that's running on the server can request a token from the Azure Instance Metadata service endpoint, accessible only from within the server.

The system environment variable **IDENTITY_ENDPOINT** is used to discover the identity endpoint by applications. Applications should try to retrieve **IDENTITY_ENDPOINT** and **IMDS_ENDPOINT** values and use them. Applications with any access level are allowed to make requests to the endpoints. Metadata responses are handled as normal and given to any process on the machine. However, when a request is made that would expose a token, we require the client to provide a secret to attest that they are able to access data only available to higher-privileged users.

## Prerequisites

- An understanding of Managed identities.
- A server connected and registered with Arc enabled servers.
- "Owner" permissions at the appropriate scope (your subscription or resource group) to perform required resource creation and role management steps. If you need assistance with role assignment, see [Use Role-Based Access Control](../../role-based-access-control/role-assignments-portal.md) to manage access to your Azure subscription resources.
- An Azure Key Vault to store and retrieve your credential. and assign the Azure Arc identity access to the KeyVault.

    - If you don't have a Key Vault created, see [Create Key Vault](../../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-nonaad.md#create-a-key-vault-).
    - To configure access by the managed identity used by the server, see [Grant access for Linux](../../active-directory/managed-identities-azure-resources/tutorial-linux-vm-access-nonaad.md#grant-access) or [Grant access for Windows](../../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-nonaad.md#grant-access). For step number 5, you are going to enter the name of the Arc enabled server.

## Acquiring an access token using REST API

The method to obtain and use a system-assigned managed identity to authenticate with Azure resources is very similar to how it is performed with an Azure VM.

For an Arc enabled server, the steps to use the token are:

1. In PowerShell, invoke the web request to get the token for the local host in the specific port for the server by specifying the following request using the uri or the environment variable **IDENTITY_ENDPOINT**:

    ```powershell
    Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:40342/metadata/identity/oauth2/token?api-version=2019-11-01&resource=https%3A%2F%2Fmanagement.azure.com%2F" -Headers @{ Metadata = "true" }
    ```

