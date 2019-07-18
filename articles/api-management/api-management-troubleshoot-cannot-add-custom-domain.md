---
title: Cannot add custom domain using Key Vault Certificate in Azure API Management| Microsoft Docs
description: Learn how to troubleshoot the issue in which you can't add custom domain using Key Vault Certificate.
services: api-management
documentationcenter: ''
author: genlin
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/15/2019
ms.author: tehnoonr
---

# Failed to update API Management service hostnames
This article describes the "Failed to update API Management service hostnames" error that you may experience when you add a custom domain for Azure API Management service. It provides troubleshooting steps to help resolve the issues.

## Symptom

 When you try to add a custom domain for your API Management service by using a certificate from an Azure key vault, you receive the following error message:

- Failed to update API Management service hostnames. Request to resource 'https://vaultname.vault.azure.net/secrets/secretname/?api-version=7.0' failed with StatusCode: Forbidden for RequestId: . Exception message: Operation returned an invalid status code 'Forbidden'.

## Cause

The API Management service does not have permission to access the key vault that you're trying to use for the custom domain.

## Solution

To resolve this issue, follow these steps:

1. Go to the [Azure portal](Https://portal.azure.com), select your API Management instance, and then select **Managed identities**. Make sure that the **Register with Azure Active Directory** option is set to **Yes**. 
    ![An image about register with Azure Active Director](./media/api-management-troubleshoot-cannot-add-custom-domain/register-with-aad.png)
1. In the Azure portal, open the **Key vaults** service, select the key vault that you're trying to use for the custom domain.
1. Select **Access policies**, check if there is a service principal that matches the name of the API Management service instance. If yes, select the service principal, and then make sure that it has **Get** permission under **Secret permissions**.  
    ![A sample about add access policy for a service principal](./media/api-management-troubleshoot-cannot-add-custom-domain/access-policy.png)
1. If the API Management service is not in the list, select **Add access policy**, and then create the following access policy: 
    - **Configure from Template**: None
    - **Select principal**: Search the name of the API Management service, and then select it from the list.
    - **Key permissions**: None
    - **Secret permissions**: Get
    - **Certificate permissions**: None
1. Select **OK** to create the access policy. 
1. Select **Save** to save the changes.

After that, try to create the custom domain in API Management service using the Key Vault certificate, and see if the issue is resolved.

## Next steps
Learn more about API Management service:

- Check out more [videos](https://azure.microsoft.com/documentation/videos/index/?services=api-management) about API Management.
* For other ways to secure your back-end service, see [Mutual Certificate authentication](api-management-howto-mutual-certificates.md).

* [Create an API Management service instance](get-started-create-service-instance.md).
* [Manage your first API](import-and-publish.md).