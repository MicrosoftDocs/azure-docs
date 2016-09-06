<properties 
	pageTitle="How to secure back-end services using client certificate authentication in Azure API Management" 
	description="Learn how to secure back-end services using client certificate authentication in Azure API Management." 
	services="api-management" 
	documentationCenter="" 
	authors="steved0x" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="api-management" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/25/2016" 
	ms.author="sdanie"/>

# How to secure back-end services using client certificate authentication in Azure API Management

API Management provides the capability to secure access to the back-end service of an API using client certificates. This guide shows how to manage certificates in the API publisher portal, and how to configure an API to use a certificate to access its back-end service.

For information about managing certificates using the API Management REST API, see [Azure API Management REST API Certificate entity][].

## <a name="prerequisites"> </a>Prerequisites

This guide shows you how to configure your API Management service instance to use client certificate authentication to access the back-end service for an API. Before following the steps in this topic, you should have your back-end service configured for client certificate authentication ([to configure certificate authentication in Azure WebSites refer to this article][]), and have access to the certificate and the password for the certificate for uploading in the API Management publisher portal.

## <a name="step1"> </a>Upload a client certificate

To get started, click **Manage** in the Azure Classic Portal for your API Management service. This takes you to the API Management publisher portal.

![API Publisher portal][api-management-management-console]

>If you have not yet created an API Management service instance, see [Create an API Management service instance][] in the [Get started with Azure API Management][] tutorial.

Click **Security** from the **API Management** menu on the left, and click **Client certificates**.

![Client certificates][api-management-security-client-certificates]

To upload a new certificate, click **Upload certificate**.

![Upload certificate][api-management-upload-certificate]

Browse to your certificate, and then enter the password for the certificate.

>The certificate must be in **.pfx** format. Self-signed certificates are allowed.

![Upload certificate][api-management-upload-certificate-form]

Click **Upload** to upload the certificate.

>The certificate password is validated at this time. If it is incorrect an error message is displayed.

![Certificate uploaded][api-management-certificate-uploaded]

Once the certificate is uploaded, it appears on the **Client certificates** tab. If you have multiple certificates, make a note of the subject, or the last four characters of the thumbprint, which are used to select the certificate when configuring an API to use certificates, as covered in the following [Configure an API to use a client certificate for gateway authentication][] section.

## <a name="step1a"> </a>Delete a client certificate

To delete a certificate, click **Delete** beside the desired certificate.

![Delete certificate][api-management-certificate-delete]

Click **Yes, delete it** to confirm.

![Confirm delete][api-management-confirm-delete]

If the certificate is in use by an API, then a warning screen is displayed. To delete the certificate you must first remove the certificate from any APIs that are configured to use it.

![Confirm delete][api-management-confirm-delete-policy]

## <a name="step2"> </a>Configure an API to use a client certificate for gateway authentication

Click **APIs** from the **API Management** menu on the left, click the name of the desired API, and click the **Security** tab.

![API security][api-management-api-security]

Select **Client certificates** from the **With credentials** drop-down list.

![Client certificates][api-management-mutual-certificates]

Select the desired certificate from the **Client certificate** drop-down list. If there are multiple certificates you can look at the subject or the last four characters of the thumbprint as noted in the previous section to determine the correct certificate.

![Select certificate][api-management-select-certificate]

Click **Save** to save the configuration change to the API.

>This change is effective immediately, and calls to operations of that API will use the certificate to authenticate on the back-end server.

![Save API changes][api-management-save-api]

>When a certificate is specified for gateway authentication for the back-end service of an API, it becomes part of the policy for that API, and can be viewed in the policy editor.

![Certificate policy][api-management-certificate-policy]

## Next steps

For more information on other ways to secure your backend service, such as HTTP basic or shared secret authentication, see the following video.

> [AZURE.VIDEO last-mile-security]

[api-management-management-console]: ./media/api-management-howto-mutual-certificates/api-management-management-console.png
[api-management-security-client-certificates]: ./media/api-management-howto-mutual-certificates/api-management-security-client-certificates.png
[api-management-upload-certificate]: ./media/api-management-howto-mutual-certificates/api-management-upload-certificate.png
[api-management-upload-certificate-form]: ./media/api-management-howto-mutual-certificates/api-management-upload-certificate-form.png
[api-management-certificate-uploaded]: ./media/api-management-howto-mutual-certificates/api-management-certificate-uploaded.png
[api-management-api-security]: ./media/api-management-howto-mutual-certificates/api-management-api-security.png
[api-management-mutual-certificates]: ./media/api-management-howto-mutual-certificates/api-management-mutual-certificates.png
[api-management-select-certificate]: ./media/api-management-howto-mutual-certificates/api-management-select-certificate.png
[api-management-save-api]: ./media/api-management-howto-mutual-certificates/api-management-save-api.png
[api-management-certificate-policy]: ./media/api-management-howto-mutual-certificates/api-management-certificate-policy.png
[api-management-certificate-delete]: ./media/api-management-howto-mutual-certificates/api-management-certificate-delete.png
[api-management-confirm-delete]: ./media/api-management-howto-mutual-certificates/api-management-confirm-delete.png
[api-management-confirm-delete-policy]: ./media/api-management-howto-mutual-certificates/api-management-confirm-delete-policy.png



[How to add operations to an API]: api-management-howto-add-operations.md
[How to add and publish a product]: api-management-howto-add-products.md
[Monitoring and analytics]: ../api-management-monitoring.md
[Add APIs to a product]: api-management-howto-add-products.md#add-apis
[Publish a product]: api-management-howto-add-products.md#publish-product
[Get started with Azure API Management]: api-management-get-started.md
[Get started with advanced API configuration]: api-management-get-started-advanced.md
[API Management policy reference]: api-management-policy-reference.md
[Caching policies]: api-management-policy-reference.md#caching-policies
[Create an API Management service instance]: api-management-get-started.md#create-service-instance

[Azure API Management REST API Certificate entity]: http://msdn.microsoft.com/library/azure/dn783483.aspx
[WebApp-GraphAPI-DotNet]: https://github.com/AzureADSamples/WebApp-GraphAPI-DotNet
[to configure certificate authentication in Azure WebSites refer to this article]: https://azure.microsoft.com/en-us/documentation/articles/app-service-web-configure-tls-mutual-auth/

[Prerequisites]: #prerequisites
[Upload a client certificate]: #step1
[Delete a client certificate]: #step1a
[Configure an API to use a client certificate for gateway authentication]: #step2
[Test the configuration by calling an operation in the Developer Portal]: #step3
[Next steps]: #next-steps


 
