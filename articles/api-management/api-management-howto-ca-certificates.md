---
title: Add a Custom CA Certificate - API Management | Microsoft Docs
description: Learn how to add a custom CA certificate in Azure API Management. Also learn how to delete a certificate.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 05/16/2025
ms.author: danlep 
ms.custom:

#customer intent: As an API developer, I want to add a custom CA certificate in API Management. 
---

# How to add a custom CA certificate in Azure API Management

**APPLIES TO: Developer | Basic | Standard | Premium**

Azure API Management allows you to install CA certificates on the machine inside the trusted root and intermediate certificate stores. You should use this functionality if your services require a custom CA certificate.

This article shows how to manage CA certificates of an API Management instance in the Azure portal. For example, if you use self-signed client certificates, you can upload custom trusted root certificates to API Management. 

CA certificates uploaded to API Management can be used for certificate validation only by the managed API Management gateway. If you use the [self-hosted gateway](self-hosted-gateway-overview.md), you can learn how to [create a custom CA for self-hosted gateway](#create-custom-ca-for-a-self-hosted-gateway) later in this article.

[!INCLUDE [api-management-workspace-availability](../../includes/api-management-workspace-availability.md)]

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]


## Upload a CA certificate

Complete the following steps to upload a new CA certificate. If you haven't created an API Management instance yet, see [Create an API Management service instance](get-started-create-service-instance.md).

1. Go to your Azure API Management instance in the Azure portal.

1. In the left menu, under **Security**, select **Certificates**. On the **Certificates** page, select **CA certificates** > **+ Add**.

1. In the **Upload CA certificate** window, select the file icon and browse for the certificate .cer file. In the **Store** box, select a certificate store. Only the public key is needed, so the password is optional.

    :::image type="content" source="media/api-management-howto-ca-certificates/02.png" alt-text="Screenshot that shows the steps for adding a CA certificate in the Azure portal." lightbox="media/api-management-howto-ca-certificates/02.png"::: 

1. Select the **Add** button at the bottom of the window, and then select **Save**. This operation might take a few minutes.

> [!NOTE]
> You can also upload a CA certificate by using the `New-AzApiManagementSystemCertificate` PowerShell command.

## Delete a CA certificate

Select the certificate, and then select **Delete** in the **...** menu.

## Create custom CA for a self-hosted gateway 

If you use a [self-hosted gateway](self-hosted-gateway-overview.md), validation of server and client certificates via CA root certificates uploaded to API Management service isn't supported. To establish trust, configure a specific client certificate so that it's trusted by the gateway as a custom certificate authority.

Use the [Gateway Certificate Authority](/rest/api/apimanagement/current-ga/gateway-certificate-authority) REST APIs to create and manage custom CAs for a self-hosted gateway. To create a custom CA:

1. [Add a certificate](api-management-howto-mutual-certificates.md) .pfx file to your API Management instance.
1. Use the [Gateway Certificate Authority - Create Or Update](/rest/api/apimanagement/current-ga/gateway-certificate-authority/create-or-update) REST API to associate the certificate with the self-managed gateway.

[Upload a CA certificate]: #step1
[Delete a CA certificate]: #step1a
