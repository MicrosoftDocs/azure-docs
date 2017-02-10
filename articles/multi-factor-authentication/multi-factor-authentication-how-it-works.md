---
title: Azure Multi-Factor Authentication - How it works
description: Azure Multi-Factor Authentication helps safeguard access to data and applications while meeting user demand for a simple sign-in process. It provides additional security by requiring a second form of authentication and delivers strong authentication via a range of easy verification options.
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila
editor: curtland

ms.assetid: d14db902-9afe-4fca-b3a5-4bd54b3d8ec5
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/04/2016
ms.author: kgremban

---
# How Azure Multi-Factor Authentication works
The security of multi-factor authentication lies in its layered approach. Compromising multiple authentication factors presents a significant challenge for attackers. Even if an attacker manages to learn the user's password, it is useless without also having possession of the trusted device. Should the user lose the device, the person who finds it won't be able to use it unless he or she also knows the user's password.

![Proofup](./media/multi-factor-authentication-how-it-works/howitworks.png)

Azure Multi-Factor Authentication helps safeguard access to data and applications while meeting user demand for a simple sign-in process.  It provides additional security by requiring a second form of authentication and delivers strong authentication via a range of easy verification options:

* phone call
* text message
* mobile app notification—allowing users to choose the method they prefer
* mobile app verification code
* 3rd party OATH tokens

For detailed information on how it works see the following video.

> [!VIDEO https://channel9.msdn.com/Events/TechEd/Europe/2014/EM-B313/player]

## Methods available for two-step verification
When a user signs in, an additional verification is sent to the user.  The following are a list of methods that can be used for this second verification.

| Verification Method | Description |
| --- | --- |
| Phone Call |A call is placed to a user’s smart phone asking them to verify that they are signing in by pressing the # sign.  This will complete the verification process.  This option is configurable and can be changed to a code that you specify. |
| Text Message |A text message will be sent to a user’s smart phone with a 6 digit code.  Enter this code in to complete the verification process. |
| Mobile App Notification |A verification request will be sent to a user’s smart phone asking them complete the verification by selecting Verify from the mobile app. This will occur if you selected app notification as your primary verification method.  If they receive this when they are not signing in, they can choose to report it as fraud. |
| Verification code with Mobile App |A verification code will be sent to the mobile app that is running on a user’s smart phone.  This will occur if you selected a verification code as your primary verification method. |

Azure Multi-Factor Authentication provides selectable verification methods for both cloud and server. This means that you can choose which methods are available for your users: phone call, text, app notification, or app codes. For more information, see [selectable verification methods](multi-factor-authentication-whats-next.md#selectable-verification-methods).

## Next steps

- Read about the different [Versions and billing methods for Azure Multi-Factor Authentication](multi-factor-authentication-versions-billing.md)

- Choose whether to deploy Azure MFA [in the cloud or on-premises](multi-factor-authentication-get-started.md)