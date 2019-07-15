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

#  Cannot add custom domain using Key Vault Certificate in Azure API Management

This article describes how to troubleshoot problems that may occur when you add custom domain in the Azure API Management.

## Symptoms

 When you add a custom domain in API Management by using a certificate from Azure Key Vault, the operation fails with the following error message:

    Failed to update API Management service hostnames. Request to resource 'https://vaultname.vault.azure.net/secrets/secretname/?api-version=7.0' failed with StatusCode: Forbidden for RequestId: . Exception message: Operation returned an invalid status code 'Forbidden'.

## Cause

The API Management service principal does not have permissions to access the Azure Key Vault that you're trying to use for the custom domain.

## Solution

To resolve this issue, follow these steps:

1. go to the Azure portal, select your API Management instance, and then select **Managed identities**. Make sure that the **Register with Azure Active Directory** option is set to **Yes**. 
2. In the Azure portal, open the **Key vault** service, select the Key vault that you're trying to use for the custom domain.
3. Select **Access policies**,  check if there is a service principal that matches the name of the API Management service instance that has the issue. If you see the service principal for your API Management service instance in the list, select the service principal, and then make sure that it has **Get** permission under **Secret permissions**.  
4. If the API service principal is not in the list, Click **Add access policy**, and then create the access policy by using the following information: 
    - Configure from Template: None
    - Select principal: Select the service principal for your API Management service where you need to use the certificate. It will match the APIM service name. 
    - Key permissions: None
    - Secret permissions: Get
    - Certificate permissions: None
1. Select **OK** to create the access policy. 
1. Select **Save** to save the changes.

After that, try to create the custom domain in API Management using the Key Vault certificate, and see if the issue is resolved.

## Next steps
* Learn more about [Azure Active Directory and OAuth2.0](../active-directory/develop/authentication-scenarios.md).
* Check out more [videos](https://azure.microsoft.com/documentation/videos/index/?services=api-management) about API Management.
* For other ways to secure your back-end service, see [Mutual Certificate authentication](api-management-howto-mutual-certificates.md).

* [Create an API Management service instance](get-started-create-service-instance.md).

* [Manage your first API](import-and-publish.md).


