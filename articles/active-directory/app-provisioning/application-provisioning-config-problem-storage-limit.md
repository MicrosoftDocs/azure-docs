---
title: Problem saving admin credentials configuring Azure AD gallery app
description: How to troubleshoot common issues faced when configuring user provisioning to an application already listed in the Azure AD Application Gallery
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: troubleshooting
ms.date: 02/21/2018
ms.author: kenwith
ms.reviewer: arvinh
---

# Problem saving administrator credentials while configuring user provisioning to an Azure Active Directory Gallery application 

When using the Azure portal to configure [automatic user provisioning](user-provisioning.md) for an enterprise application, you may encounter a situation where:

* The **Admin Credentials** entered for the application are valid, and the **Test Connection** button works. However, the credentials cannot be saved, and the Azure portal returns a generic error message.

If SAML-based single sign-on is also configured for the same application, the most likely cause of the error is that Azure AD's internal, per-application storage limit for certificates and credentials has been exceeded.

Azure AD currently has a maximum storage capacity of 1024 bytes for all certificates, secret tokens, credentials, and related configuration data associated with a single instance of an application (also known as a service principal record in Azure AD).

When SAML-based single sign-on is configured, the certificate used to sign the SAML tokens is stored here, and often consumes over 50% percent of the space.

Any secret tokens, URIs, notification email addresses, user names, and passwords that get entered during setup of user provisioning can cause the storage limit to be exceeded.

## How to work around this issue 

There are two possible ways to work around this issue today:

1. **Use two gallery application instances, one for single sign-on and one for user provisioning** - Taking the gallery application [LinkedIn Elevate](../saas-apps/linkedinelevate-tutorial.md) as an example, you can add LinkedIn Elevate from the gallery and configure it for single sign-on. For provisioning, add another instance of LinkedIn Elevate from the Azure AD app gallery, and name it "LinkedIn Elevate (Provisioning)." For this second instance, configure [provisioning](../saas-apps/linkedinelevate-provisioning-tutorial.md), but not single sign-on. When using this workaround, the same users and groups need to be [assigned](../manage-apps/assign-user-or-group-access-portal.md) to both applications. 

2. **Reduce the amount of configuration data stored** - All data entered in the [Admin credentials](user-provisioning.md#how-do-i-set-up-automatic-provisioning-to-an-application) section of the provisioning tab is stored in the same place as the SAML certificate. While it may not be possible to reduce the length of all of this data, some optional configuration fields like the **Notification Email** can be removed.

## Next steps
[Configure user provisioning and de-provisioning to SaaS applications](user-provisioning.md)
