---
title: Add a custom CA certificate - Azure API Management | Microsoft Docs
description: Learn how to add a custom CA certificate in Azure API Management. You can also see instructions to delete a certificate.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 06/01/2021
ms.author: danlep 
ms.custom:
---

# How to add a custom CA certificate in Azure API Management

Azure API Management allows installing CA certificates on the machine inside the trusted root and intermediate certificate stores. This functionality should be used if your services require a custom CA certificate.

The article shows how to manage CA certificates of an Azure API Management service instance in the Azure portal. For example, if you use self-signed client certificates, you can upload custom trusted root certificates to API Management. 

CA certificates uploaded to API Management can only be used for certificate validation by the managed API Management gateway. If you use the [self-hosted gateway](self-hosted-gateway-overview.md), learn how to [create a custom CA for self-hosted gateway](#create-custom-ca-for-self-hosted-gateway), later in this article.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## <a name="step1"> </a>Upload a CA certificate

:::image type="content" source="media/api-management-howto-ca-certificates/00.png" alt-text="CA certificates in the Azure portal":::

Follow the steps below to upload a new CA certificate. If you have not created an API Management service instance yet, see the tutorial [Create an API Management service instance](get-started-create-service-instance.md).

1. Navigate to your Azure API Management service instance in the Azure portal.

1. In the menu, under **Security**, select **Certificates > CA certificates > + Add**.

1. Browse for the certificate .cer file and decide on the certificate store. Only the public key is needed, so the password is optional.

    :::image type="content" source="media/api-management-howto-ca-certificates/02.png" alt-text="Add CA certificate in the Azure portal"::: 
1. Select **Save**. This operation may take a few minutes.

> [!NOTE]
> - The process of assigning the certificate might take 15 minutes or more depending on the size of the deployment. The Developer SKU has downtime during the process. The Basic and higher SKUs don't have downtime during the process.
> - You can also upload a CA certificate using the `New-AzApiManagementSystemCertificate` PowerShell command.

## <a name="step1a"> </a>Delete a CA certificate

Select the certificate, and select **Delete** in the context menu (**...**).

## Create custom CA for self-hosted gateway 

If you use a [self-hosted gateway](self-hosted-gateway-overview.md), validation of server and client certificates using CA root certificates uploaded to API Management service is not supported. To establish trust, configure a specific client certificate so that it's trusted by the gateway as a custom certificate authority.

Use the [Gateway Certificate Authority](/rest/api/apimanagement/current-ga/gateway-certificate-authority) REST APIs to create and manage custom CAs for a self-hosted gateway. To create a custom CA:

1. [Add a certificate](api-management-howto-mutual-certificates.md) .pfx file to your API Management instance.
1. Use the [Gateway Certificate Authority - Create Or Update](/rest/api/apimanagement/current-ga/gateway-certificate-authority/create-or-update) REST API to associate the certificate with the self-managed gateway.

[Upload a CA certificate]: #step1
[Delete a CA certificate]: #step1a
