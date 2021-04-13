---
title: "Azure Digital Twins request failed with Status: 404 (Not found)"
description: "Causes and resolutions for 'Service request failed. Status: 404 (Not found)' on Azure Digital Twins."
ms.service: digital-twins
author: baanders
ms.author: baanders
ms.topic: troubleshooting
ms.date: 4/13/2021
---

# Service request failed. Status: 404 (Not found)

This article describes causes and resolution steps for receiving a 404 error from service requests to Azure Digital Twins. 

## Symptoms

This error may occur when accessing an Azure Digital Twins instance using a principal or user account that lives in a different [Azure Active Directory (Azure AD) tenant](../active-directory/develop/quickstart-create-new-tenant.md) from the instance. The correct [roles](concepts-security.md) seem to be assigned to the identity, but API requests fail with an error status of `404 (Not found)`.

## Causes

### Cause #1

While [Azure AD B2B](../active-directory/external-identities/what-is-b2b.md) allows for the mapping of identities from one tenant into a second tenant, other Azure services may not support multiple tenants. Azure Digital Twins is a service that only supports one tenant: the main tenant from the subscription where the Azure Digital Twins instance is located.

## Solutions

### Solution #1

You can mitigate this issue by having each federated identity from another tenant request a **token** from the Azure Digital Twins instance's "home" tenant. One way to do this is with the following CLI command:

```azurecli-interactive
az account get-access-token --tenant <home-tenant-ID> --resource https://digitaltwins.azure.net
```

After requesting this, the identity will receive a token issued for the *https://digitaltwins.azure.net* Azure AD resource, which has a matching tenant ID claim to the Azure Digital Twins instance. Using this token in API requests or with the DefaultAzureCredential should allow the federated identity to access the Azure Digital Twins resource.

### Solution #2

If you're using the `DefaultAzureCredential` class in your code, you can specify the home tenant in the `DefaultAzureCredential` options, like with `InteractiveBrowserTenantId` in the following example:

:::image type="content" source="media/troubleshoot-error-404/defaultazurecredentialoptions.png" alt-text="Screenshot of code showing the DefaultAzureCredentialOptions method. The value of InteractiveBrowserTenantId is set to a sample tenant ID value.":::

There are similar options available to set a tenant for authentication with Visual Studio and Visual Studio Code. For more information on the options available, see the [DefaultAzureCredentialOptions documentation](/dotnet/api/azure.identity.defaultazurecredentialoptions?view=azure-dotnet&preserve-view=true).

## Next steps

Read more about security and permissions on Azure Digital Twins:
* [*Concepts: Security for Azure Digital Twins solutions*](concepts-security.md)
