---
title: Application Management certificates frequently asked questions
description: Learn answers to frequently asked questions (FAQ) about managing certificates for apps using Azure Active Directory as an Identity Provider (IdP).  
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: reference
ms.date: 03/03/2023
ms.author: jomondi
ms.reviewer: sureshja, saumadan
ms.custom: enterprise-apps
---

# Application Management certificates frequently asked questions

This page answers frequently asked questions about managing the certificates for apps using Azure Active Directory (Azure AD) as an Identity Provider (IdP).

## Is there a way to generate a list of expiring SAML signing certificates?

You can export all app registrations with expiring secrets, certificates and their owners for the specified apps from your directory in a CSV file through [PowerShell scripts](app-management-powershell-samples.md).

## Where can I find the information about soon to expire certificates renewal steps?

You can find the steps [here](manage-certificates-for-federated-single-sign-on.md#renew-a-certificate-that-will-soon-expire).

## How can I customize the expiration date for the certificates issued by Azure AD?

By default, Azure AD configures a certificate to expire after three years when it is created automatically during SAML single sign-on configuration. Because you can't change the date of a certificate after you save it, you need to create a new certificate. For steps on how to do so, please refer [Customize the expiration date for your federation certificate and roll it over to a new certificate](manage-certificates-for-federated-single-sign-on.md#customize-the-expiration-date-for-your-federation-certificate-and-roll-it-over-to-a-new-certificate).

> [!NOTE]
> The recommended way to create SAML applications is through the Azure AD Application Gallery, which will automatically create a three-year valid X509 certificate for you. 

## How can I automate the certificates expiration notifications?

Azure AD will send an email notification 60, 30, and 7 days before the SAML certificate expires. You may add more than one email address to receive notifications.

> [!NOTE]
> You can add up to 5 email addresses to the Notification list (including the email address of the admin who added the application). If you need more people to be notified, use the distribution list emails.

To specify the emails you want the notifications to be sent to, see [Add email notification addresses for certificate expiration](manage-certificates-for-federated-single-sign-on.md#add-email-notification-addresses-for-certificate-expiration).

There is no option to edit or customize these email notifications received from `aadnotification@microsoft.com`. However, you can export app registrations with expiring secrets and certificates through [PowerShell scripts](app-management-powershell-samples.md).

## Who can update the certificates?

The owner of the application or Global Administrator or Application Administrator can update the certificates through Azure portal UI, PowerShell or Microsoft Graph.

## I need more details about certificate signing options

In Azure AD, you can set up certificate signing options and the certificate signing algorithm. To learn more, see [Advanced SAML token certificate signing options for Azure AD apps](certificate-signing-options.md).

## What type of certificate can I use for configuring the SAML Certificate for single sign-on?

The recommendation for the SAML single sign-on certificate depends on your organization's security requirements and policies. 
If your organization has an internal certificate authority (PKI), using a certificate from the internal PKI can provide a higher level of security and trust. This is because the internal PKI is under the control of your organization and can be managed and monitored to ensure the security of the certificate.

On the other hand, if your organization doesn't have an internal certificate authority, using a certificate from an external certificate authority such as DigiCert can provide a higher level of trust and security. This is because external certificate authorities are trusted by many organizations and are subject to strict security and validation requirements.

## I need to replace the certificate for Azure AD Application Proxy applications and need more instructions

To replace certificates for Azure AD Application Proxy applications, see [PowerShell sample - Replace certificate in Application Proxy apps](../app-proxy/scripts/powershell-get-custom-domain-replace-cert.md).

## How do I manage certificates for custom domains in Azure AD Application Proxy?

To configure an on-premises app to use a custom domain, you need a verified Azure Active Directory custom domain, a PFX certificate for the custom domain, and an on-premises app to configure. To learn more, see [Custom domains in Azure AD Application Proxy](../app-proxy/application-proxy-configure-custom-domain.md).

## I need to update the token signing certificate on the application side. Where can I get it on Azure AD side?

You can renew a SAML X.509 Certificate, see [SAML Signing certificate](configure-saml-single-sign-on.md#saml-signing-certificate).

## What is Azure AD signing key rollover?

You can find more details [here](../develop/active-directory-signing-key-rollover.md).

## How do I renew application token encryption certificate?

To renew an application token encryption certificate, see [How to renew a token encryption certificate for an enterprise application](howto-saml-token-encryption.md).

## How do I renew application token signing certificate?

To renew an application token signing certificate, see [How to renew a token signing certificate for an enterprise application](manage-certificates-for-federated-single-sign-on.md).

## How do I update Azure AD after changing my federation certificates?

To update Azure AD after changing your federation certificates, see [Renew federation certificates for Microsoft 365 and Azure Active Directory](../hybrid/how-to-connect-fed-o365-certs.md).

## Can I use the same SAML certificate across different apps?

When it's the first time configuring SSO on an enterprise app, we do provide a default SAML certificate that is used across Azure AD. However, if you need to use the same certificate across multiple apps that aren't the default Azure AD one, then you need to use an external Certificate Authority and upload the PFX file. The reason is that Azure AD doesn't provide access to private keys from internally issued certificates.
