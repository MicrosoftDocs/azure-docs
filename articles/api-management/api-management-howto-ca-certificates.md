---
title: Add a Custom CA Certificate - API Management | Microsoft Docs
description: Learn how to add a custom CA certificate in Azure API Management. Also learn how to delete a certificate.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 02/17/2026
ms.author: danlep 
ms.custom:
  - sfi-image-nochange

#customer intent: As an API developer, I want to add a custom CA certificate in API Management. 
---

# How to add a custom CA certificate in Azure API Management

**APPLIES TO: Developer | Basic | Standard | Premium**

Azure API Management allows you to upload and install CA certificates on the machine inside the trusted root and intermediate certificate stores. Use this functionality if your services require a custom CA certificate.

This article shows how to manage CA certificates of an API Management instance in the Azure portal. For example, if you use self-signed client certificates, you can upload custom trusted root certificates to API Management. 

> [!IMPORTANT]
> **CA certificates are installed into the machine-wide certificate store.** Once installed, a CA certificate immediately participates in TLS certificate chain building for all communications on the API Management infrastructure node — including the API gateway's host certificate chain, custom domain certificate chains, management API, developer portal, and internal services. If the uploaded certificate's issuer key matches certificates used by existing chains, the operating system automatically includes the new CA certificate, which can alter the intermediate certificates presented during TLS handshakes. This can unexpectedly change TLS behavior for host certificates, backend connections, and client certificate validation. **Test CA certificate changes in a non-production environment first**, and review the [safety considerations](#safety-considerations) section before uploading.

[!INCLUDE [api-management-ca-certificate-v2-tiers](../../includes/api-management-ca-certificate-v2-tiers.md)]

CA certificates uploaded to API Management can be used for certificate validation only by the managed API Management gateway. If you use the [self-hosted gateway](self-hosted-gateway-overview.md), you can learn how to [create a custom CA for self-hosted gateway](#create-custom-ca-for-a-self-hosted-gateway) later in this article.

[!INCLUDE [api-management-workspace-availability](../../includes/api-management-workspace-availability.md)]

[!INCLUDE [api-management-service-update-behavior](../../includes/api-management-service-update-behavior.md)]

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

## Safety considerations

CA certificates uploaded to API Management are installed into the machine-wide certificate store on the underlying infrastructure. It's important to understand the following implications before uploading a CA certificate.

### How certificate chain building works

When a TLS connection is established, the operating system builds a certificate chain from the server (leaf) certificate up to a trusted root. During this process, the system searches the machine certificate store for intermediate and root CA certificates. If a newly uploaded CA certificate's issuer key matches any certificate in a chain being built, the operating system **automatically includes** it — even if that chain is used by a different process or for a different purpose than you intended.

### What can be affected

Because all services on an API Management node share the same machine certificate store, uploading a CA certificate can affect:

- **Host certificate chain** — The default SSL certificate that API Management uses for its built-in hostnames (such as `<service-name>.azure-api.net`) has its own certificate chain. If the uploaded CA certificate's issuer key matches a certificate in the host certificate's chain, the operating system may silently substitute or extend the chain with the new certificate. This can change the intermediate certificate that the gateway presents during TLS handshakes, potentially breaking certificate pinning or thumbprint-based validation performed by clients.
- **Custom domain certificate chains** — Certificates configured for [custom domain names](configure-custom-domain.md) are also affected because they share the same certificate store.
- **API gateway** — TLS handshakes for inbound API requests and outbound backend connections.
- **Management API** — Internal management plane communications.
- **Developer portal** — Portal-to-backend connectivity.
- **Internal services** — Certificate validation for service-to-service communication.

### Before you upload

- **Test first** — Upload the CA certificate to a Developer-tier or non-production instance and verify that all services continue to operate correctly.
- **Verify the issuer** — Check that the certificate's issuer name and key don't conflict with existing certificates used by the API Management instance.
- **Plan for rollback** — Know how to [delete the CA certificate](#delete-a-ca-certificate) quickly if the upload causes unexpected issues.
- **Monitor after upload** — After uploading, monitor the API gateway, management API, and developer portal for TLS errors or unexpected certificate validation failures.

### Troubleshooting

If you experience issues after uploading a CA certificate:

- **Unexpected 502 or 503 errors** — The new CA certificate might have changed TLS certificate chains, causing handshake failures. Delete the recently uploaded certificate and verify that operations return to normal.
- **Certificate validation failures** — Chain building might now include the new CA certificate where it wasn't expected. Check certificate thumbprints and chain composition.
- **Backend connectivity issues** — Outbound TLS connections to backend services might be using a different certificate chain after the upload.

## Limits

API Management currently enforces a limit of 10 CA certificates per instance.

## Related content

-   [How to secure backend services using client certificate authentication](./api-management-howto-mutual-certificates.md)
-   [How to secure APIs using client certificate authentication](./api-management-howto-mutual-certificates-for-clients.md)

[Upload a CA certificate]: #step1
[Delete a CA certificate]: #step1a
