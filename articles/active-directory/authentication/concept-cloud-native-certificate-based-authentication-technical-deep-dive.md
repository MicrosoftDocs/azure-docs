---
title: Cloud-native certificate-based authentication technical deep dive - Azure Active Directory
description: Learn how cloud-native certificate-based authentication works in Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 01/18/2022

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: tommma

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---

# Cloud-native certificate-based authentication technical deep dive

This article is an overview of how cloud-native certificate-based authentication (CBA) against Azure AD (Azure Active Directory) works.

## How does Azure Active Directory certificate-based authentication work?

When a user tries to sign into an application secured by Azure AD, and if Certificate-based Authentication is enabled on the tenant, the following steps occur:

1. The user tries to access an application, for example, Office.
1. If the user is not already signed in, the user is redirected to the Azure AD User Sign-in page.
1. The user enters their username into the Azure AD sign in page, and then selects the Next button.
1. Azure AD checks whether Certificate-based Authentication (CBA) is enabled for the tenant.
1. If CBA is enabled, the user sees a link to **Sign in with a certificate** on the password page. If you do not see the sign in link, please make sure Certificate-based Authentication is enabled on the tenant. <Link to faq section>
1. The user clicks on the link which will bring up client certificate picker UI. 
Note: We currently do not have support for CA hints so that the list of certs in the 	 client 	certificate picker UI is not scoped down for users to easily pick the client	certificate.
1. The user selects the client certificate and clicks ok.
1. Azure AD identifies the user in the tenant by using the username binding configured <link to Getting started username binding section) on the tenant by mapping the certificate field value to user attribute value.
1. If a unique user is found successfully, Azure AD signs the user in immediately otherwise the sign in fails.
1. If the user has a conditional access policy and needs Multi-Factor Authentication (MFA) and the certificate authentication binding rule <Link to Getting started Authentication binding section> satisfies MFA, then Azure AD signs the user in immediately. If the certificate satisfies only a single factor, then it requests the user to complete Azure AD Multi-Factor Authentication.
1. If the user sign-in is successful, the user can access the application.

The following diagram illustrates all the components and the steps involved:
<!---Link to a diagram like the one in Azure AD Connect: Pass-through Authentication - How it works | Microsoft Docs--->

## Next steps

- [Overview of cloud-native certificate-based authentication](concept-cloud-native-certificate-based-authentication.md)   
- [Limitations with cloud-native certificate-based authentication](concept-cloud-native-certificate-based-authentication-limitations.md)
- [Get started with cloud-native certificate-based authentication](how-to-certificate-based-authentication.md)
- [FAQ](cloud-native-certificate-based-authentication-faq.yml)
- [Troubleshoot cloud-native certificate-based authentication](troubleshoot-cloud-native-certificate-based-authentication.md)

