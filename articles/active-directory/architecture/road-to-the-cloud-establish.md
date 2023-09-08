---
title: Road to the cloud - Establish a footprint for moving identity and access management from Active Directory to Azure AD
description: Establish an Azure AD footprint as part of planning your migration of IAM from Active Directory to Azure AD.
documentationCenter: ''
author: janicericketts
manager: martinco
ms.service: active-directory
ms.topic: how-to
ms.subservice: fundamentals
ms.date: 07/27/2023
ms.author: jricketts
ms.custom: references_regions
---
# Establish an Azure AD footprint

Before you migrate identity and access management (IAM) from Active Directory to Azure Active Directory (Azure AD), you need to set up Azure AD.

## Required tasks

If you're using Microsoft Office 365, Exchange Online, or Teams, then you're already using Azure AD. Your next step is to establish more Azure AD capabilities:

* Establish hybrid identity synchronization between Active Directory and Azure AD by using [Azure AD Connect](../hybrid/whatis-azure-ad-connect.md) or [Azure AD Connect cloud sync](../cloud-sync/what-is-cloud-sync.md).

* [Select authentication methods](../hybrid/choose-ad-authn.md). We strongly recommend password hash synchronization.

* Secure your hybrid identity infrastructure by following [Five steps to securing your identity infrastructure](../../security/fundamentals/steps-secure-identity.md).

## Optional tasks

The following functions aren't specific or mandatory to move from Active Directory to Azure AD, but we recommend incorporating them into your environment. These items are also recommended in the [Zero Trust](/security/zero-trust/) guidance.

### Deploy passwordless authentication

In addition to the security benefits of [passwordless credentials](../authentication/concept-authentication-passwordless.md), passwordless authentication simplifies your environment because the management and registration experience is already native to the cloud. Azure AD provides passwordless credentials that align with various use cases. Use the information in this article to plan your deployment: [Plan a passwordless authentication deployment in Azure Active Directory](../authentication/howto-authentication-passwordless-deployment.md).

After you roll out passwordless credentials to your users, consider reducing the use of password credentials. You can use the [reporting and insights dashboard](../authentication/howto-authentication-methods-activity.md) to continue to drive the use of passwordless credentials and reduce the use of passwords in Azure AD.

>[!IMPORTANT]
>During your application discovery, you might find applications that have a dependency or assumptions around passwords. Users of these applications need to have access to their passwords until those applications are updated or migrated.

### Configure hybrid Azure AD join for existing Windows clients

You can configure hybrid Azure AD join for existing Active Directory-joined Windows clients to benefit from cloud-based security features such as [co-management](/mem/configmgr/comanage/overview), Conditional Access, and Windows Hello for Business. New devices should be Azure AD joined and not hybrid Azure AD joined.

To learn more, check [Plan your hybrid Azure Active Directory join implementation](../devices/hybrid-join-plan.md).

## Next steps

* [Introduction](road-to-the-cloud-introduction.md)
* [Cloud transformation posture](road-to-the-cloud-posture.md)
* [Implement a cloud-first approach](road-to-the-cloud-implement.md)
* [Transition to the cloud](road-to-the-cloud-migrate.md)
