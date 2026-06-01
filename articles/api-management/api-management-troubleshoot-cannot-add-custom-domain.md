---
title: Failed to Add Custom Domain Using Key Vault Certificate
titleSuffix: Azure API Management
description: Learn how to troubleshoot failure to add a custom domain in Azure API Management using a key vault certificate.
services: api-management
author: genlin
manager: dcscontentpm
ms.service: azure-api-management
ms.topic: troubleshooting-general
ms.date: 02/18/2026
ms.author: tehnoonr
ms.custom: sfi-image-nochange
---

# Troubleshoot: Failed to update API Management service hostnames

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article describes the "Failed to update API Management service hostnames" error, which might occur when you add a custom domain for the Azure API Management service. The following steps can help you resolve the issue.

## Symptom

When you try to add a custom domain for your API Management service by using a certificate from Azure Key Vault, you receive the following error message:

```output
Failed to update API Management service hostnames. Request to resource 'https://vaultname.vault.azure.net/secrets/secretname/?api-version=7.0' failed with StatusCode: Forbidden for RequestId: . Exception message: Operation returned an invalid status code 'Forbidden'.
```

## Cause

The API Management service doesn't have permission to access the key vault that you're trying to use for the custom domain.

## Solution

To resolve this issue, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com), then select your API Management instance. Under **Security** in the sidebar menu, select **Managed identities**. Make sure that the **Status** setting is set to **On**.

    :::image type="content" source="media/api-management-troubleshoot-cannot-add-custom-domain/register-with-entra.png" alt-text="Screenshot of managed identity setting to register with Entra ID.":::

1. From the Azure portal, open the **Key vaults** service, and select the key vault that you're trying to use for the custom domain.

1. Select **Access policies**, and check if a service principal matches the name of the API Management service instance. If so, select that service principal, and make sure that it has the **Get** permission listed under **Secret permissions**.

1. If the API Management service isn't in the list, select **Add access policy**, and then create the following access policy:
    - **Configure from Template**: None
    - **Select principal**: Search the name of the API Management service, and then select it from the list
    - **Key permissions**: None
    - **Secret permissions**: Get
    - **Certificate permissions**: None

1. Select **OK** to create the access policy.

1. Select **Save** to save the changes.

To check whether the issue is resolved, try to create the custom domain in the API Management service by using the Key Vault certificate.

## Related content

* [Secure backend services by using client certificate authentication in Azure API Management](api-management-howto-mutual-certificates.md)
* [Quickstart: Create a new Azure API Management instance by using the Azure portal](get-started-create-service-instance.md)
* [Tutorial: Import and publish your first API](import-and-publish.md)
