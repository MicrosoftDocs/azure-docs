---
title: Azure Multi-Factor Authentication - How it works
description: Azure Multi-Factor Authentication helps safeguard access to data and applications while meeting user demand for a simple sign-in process. It provides additional security by requiring a second form of authentication and delivers strong authentication via a range of easy verification options.
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila

ms.assetid: d14db902-9afe-4fca-b3a5-4bd54b3d8ec5
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/20/2017
ms.author: kgremban
ms.reviewer: yossib
ms.custom: it-pro
---
# How Azure Multi-Factor Authentication works
The security of two-step verification lies in its layered approach. Compromising multiple authentication factors presents a significant challenge for attackers. Even if an attacker manages to learn the user's password, it is useless without also having possession of the trusted device. 

![Proofup](./media/multi-factor-authentication-how-it-works/howitworks.png)

Azure Multi-Factor Authentication helps safeguard access to data and applications while meeting user demand for a simple sign-in process.  It provides additional security by requiring a second form of authentication and delivers strong authentication via a range of easy verification options.


## Methods available for two-step verification
When a user signs in, an additional verification is sent to the user.  The following are a list of methods that can be used for this second verification.

| Verification Method | Description |
| --- | --- |
| Phone call |A call is placed to a user’s registered phone. The user enters a PIN if necessary then presses the # key. |
| Text message |A text message is sent to a user’s mobile phone with a six-digit code. The user enters this code on the sign-in page. |
| Mobile app notification |A verification request is sent to a user’s smart phone. The user enters a PIN if necessary then selects **Verify** on the mobile app. |
| Mobile app verification code |The mobile app, which is running on a user’s smart phone, displays a verification code that changes every 30 seconds. The user finds the most recent code and enters it on the sign-in page. |
| Third-party OATH tokens | Azure Multi-Factor Authentication Server can be configured to accept third-party verification methods. |

Azure Multi-Factor Authentication provides selectable verification methods for both cloud and server. You can choose which methods are available for your users: phone call, text, app notification, or app codes. For more information, see [selectable verification methods](multi-factor-authentication-whats-next.md#selectable-verification-methods).

## Next steps

- Read about the different [versions and consumption methods for Azure Multi-Factor Authentication](multi-factor-authentication-versions-plans.md)

- Choose whether to deploy Azure MFA [in the cloud or on-premises](multi-factor-authentication-get-started.md)

- Read answers for [Frequently asked questions](multi-factor-authentication-faq.md)