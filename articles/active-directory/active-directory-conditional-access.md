---
title: Conditional access in the Azure classic portal | Microsoft Docs
description: Use conditional access control in the Azure classic portal to check for specific conditions when authenticating for access to applications.
services: active-directory
keywords: conditional access to apps, conditional access with Azure AD, secure access to company resources, conditional access policies
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: da3f0a44-1399-4e0b-aefb-03a826ae4ead
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/07/2017
ms.author: markvi

---
# Conditional access in the Azure classic portal

This topic is about conditional access in the Azure classic portal. For the most recent information about conditional access in the Azure Active Directory, see [Conditional access in Azure Active Directory](active-directory-conditional-access-azure-portal.md).


The control capabilities in Azure Active Directory (Azure AD) conditional access offer simple ways to help secure resources in the cloud and on-premises. Conditional access policies like multi-factor authentication can help protect against the risk of stolen and phished credentials. Other conditional access policies can help keep your organization's data safe. For example, in addition to requiring credentials, you might have a policy that only devices that are enrolled in a mobile device management system like Microsoft Intune can access your organization's sensitive services.

## Prerequisites
Azure AD conditional access is a feature of [Azure Active Directory Premium](http://www.microsoft.com/identity). Each user who accesses an application that has conditional access policies applied must have an Azure AD Premium license. You can learn more about license requirements in [Unlicensed user report](https://aka.ms/utc5ix).

## How is conditional access control enforced?
With conditional access control in place, Azure AD checks for the specific conditions you set for a user to access an application. After access requirements are met, the user is authenticated and can access the application.  

![Conditional access overview](./media/active-directory-conditional-access/conditionalaccess-overview.png)

## Conditions
These are conditions that you can include in a conditional access policy:

* **Group membership**. Control a user's access based on membership in a group.
* **Location**. Use the location of the user to trigger multi-factor authentication, and use block controls when a user is not on a trusted network.
* **Device platform**. Use the device platform, such as iOS, Android, Windows Mobile, or Windows, as a condition for applying policy.
* **Device-enabled**. Device state, whether enabled or disabled, is validated during device policy evaluation. If you disable a lost or stolen device in the directory, it can no longer satisfy policy requirements.
* **Sign-in and user risk**. You can use [Azure AD Identity Protection](active-directory-identityprotection.md) for conditional access risk policies. Conditional access risk policies help give your organization advance protection based on risk events and unusual sign-in activities.

## Controls
These are controls that you can use to enforce a conditional access policy:

* **Multi-factor authentication**. You can require strong authentication through multi-factor authentication. You can use multi-factor authentication with Azure Multi-Factor Authentication or by using an on-premises multi-factor authentication provider, combined with Active Directory Federation Services (AD FS). Using multi-factor authentication helps protect resources from being accessed by an unauthorized user who might have gained access to the credentials of a valid user.
* **Block**. You can apply conditions like user location to block user access. For example, you can block access when a user is not on a trusted network.
* **Compliant devices**. You can set conditional access policies at the device level. You might set up a policy so that only computers that are domain-joined, or mobile devices that are enrolled in a mobile device management application, can access your organization's resources. For example, you can use Intune to check device compliance, and then report it to Azure AD for enforcement when the user attempts to access an application. For detailed guidance about how to use Intune to protect apps and data, see [Protect apps and data with Microsoft Intune](https://docs.microsoft.com/intune/deploy-use/protect-apps-and-data-with-microsoft-intune). You also can use Intune to enforce data protection for lost or stolen devices. For more information, see [Help protect your data with full or selective wipe using Microsoft Intune](https://docs.microsoft.com/intune/deploy-use/use-remote-wipe-to-help-protect-data-using-microsoft-intune).

## Applications
You can enforce a conditional access policy at the application level. Set access levels for applications and services in the cloud or on-premises. The policy is applied directly to the website or service. The policy is enforced for access to the browser, and to applications that access the service.

## Device-based conditional access
You can restrict access to applications from devices that are registered with Azure AD, and which meet specific conditions. Device-based conditional access protects an organization's resources from users who attempt to access the resources from:

* Unknown or unmanaged devices.
* Devices that don’t meet the security policies your organization set up.

You can set policies based on these requirements:

* **Domain-joined devices**. Set a policy to restrict access to devices that are joined to an on-premises Active Directory domain, and that also are registered with Azure AD. This policy applies to Windows desktops, laptops, and enterprise tablets.
  For more information about how to set up automatic registration of domain-joined devices with Azure AD, see [Set up automatic registration of Windows domain-joined devices with Azure Active Directory](active-directory-conditional-access-automatic-device-registration-setup.md).
* **Compliant devices**. Set a policy to restrict access to devices that are marked **compliant** in the management system directory. This policy ensures that only devices that meet security policies such as enforcing file encryption on a device are allowed access. You can use this policy to restrict access from the following devices:
  
  * **Windows domain-joined devices**. Managed by System Center Configuration Manager (in the current branch) deployed in a hybrid configuration.
  * **Windows 10 Mobile work or personal devices**. Managed by Intune or by a supported third-party mobile device management system.
  * **iOS and Android devices**. Managed by Intune.

Users who access applications that are protected by a device-based, certification authority policy must access the application from a device that meets this policy's requirements. Access is denied if attempted on a device that doesn’t meet policy requirements.

For information about how to configure a device-based, certification authority policy in Azure AD, see [Set device-based conditional access policy for Azure Active Directory-connected applications](active-directory-conditional-access-policy-connected-applications.md).

## Resources
See the following resource categories and articles to learn more about setting conditional access for your organization.

### Multi-factor authentication and location policies
* [Getting started with conditional access to Azure AD-connected apps based on group, location, and multi-factor authentication policies](active-directory-conditional-access-azuread-connected-apps.md)
* [Applications and browsers that are supported](active-directory-conditional-access-supported-apps.md)

### Device-based conditional access
* [Set device-based conditional access policy for access control to Azure Active Directory-connected applications](active-directory-conditional-access-policy-connected-applications.md)
* [Set up automatic registration of Windows domain-joined devices with Azure Active Directory](active-directory-conditional-access-automatic-device-registration-setup.md)
* [Troubleshooting for Azure Active Directory access issues](active-directory-conditional-access-device-remediation.md)
* [Help protect data on lost or stolen devices by using Microsoft Intune](https://docs.microsoft.com/intune/deploy-use/use-remote-wipe-to-help-protect-data-using-microsoft-intune)

### Protect resources based on sign-in risk
* [Azure AD identity protection](active-directory-identityprotection.md)

### Next steps
* [Conditional access FAQs](active-directory-conditional-faqs.md)
* [Technical reference](active-directory-conditional-access-technical-reference.md)

