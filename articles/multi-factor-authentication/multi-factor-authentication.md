---
title: Learn about two-step verification in Azure MFA | Microsoft Docs
description: 'What is Azure Multi-factor Authentication, why use MFA, more information about the Multi-factor Authentication client and the different methods and versions available. '
keywords: introduction to MFA, mfa overview, what is mfa
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila
editor: yossib

ms.assetid: c40d7a34-1274-4496-96b0-784850c06e9b
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/03/2017
ms.author: kgremban

---
# What is Azure Multi-Factor Authentication?
Two-step verification is a method of authentication that requires more than one verification method and adds a critical second layer of security to user sign-ins and transactions. It works by requiring any two or more of the following verification methods:

* Something you know (typically a password)
* Something you have (a trusted device that is not easily duplicated, like a phone)
* Something you are (biometrics)

<center>![Username and Password](./media/multi-factor-authentication/pword.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Certificates](./media/multi-factor-authentication/phone.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Smart Phone](./media/multi-factor-authentication/hware.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Smart Card](./media/multi-factor-authentication/smart.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Virtual Smart Card](./media/multi-factor-authentication/vsmart.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Username and Password](./media/multi-factor-authentication/cert.png)</center>

Azure Multi-Factor Authentication (MFA) is Microsoft's two-step verification solution. Azure MFA helps safeguard access to data and applications while meeting user demand for a simple sign-in process. It delivers strong authentication via a range of verification methods, including phone call, text message, or mobile app verification.

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/WA-MFA-Overview/player]
>
>

## Why use Azure Multi-Factor Authentication?
Today, more than ever, people are increasingly connected. With smart phones, tablets, laptops, and PCs, people have several different options on how they are going to connect and stay connected at any time. People can access their accounts and applications from anywhere, which means that they can get more work done and serve their customers better.

Azure Multi-Factor Authentication is an easy to use, scalable, and reliable solution that provides a second method of authentication so your users are always protected.

| ![Easy to Use](./media/multi-factor-authentication/simple.png) | ![Scalable](./media/multi-factor-authentication/scalable.png) | ![Always Protected](./media/multi-factor-authentication/protected.png) | ![Reliable](./media/multi-factor-authentication/reliable.png) |
|:---:|:---:|:---:|:---:|
| **Easy to use** |**Scalable** |**Always Protected** |**Reliable** |

* **Easy to Use** - Azure Multi-Factor Authentication is simple to set up and use. The extra protection that comes with Azure Multi-Factor Authentication allows users to manage their own devices. Best of all, in many instances it can be set up with just a few simple clicks.
* **Scalable** - Azure Multi-Factor Authentication uses the power of the cloud and integrates with your on-premises AD and custom apps. This protection is even extended to your high-volume, mission-critical scenarios.
* **Always Protected** - Azure Multi-Factor Authentication provides strong authentication using the highest industry standards.
* **Reliable** - We guarantee 99.9% availability of Azure Multi-Factor Authentication. The service is considered unavailable when it is unable to receive or process verification requests for the two-step verification.

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Windows-Azure-Multi-Factor-Authentication/player]


## Next steps

- Learn about [how Azure Multi-Factor Authentication works](multi-factor-authentication-how-it-works.md)

- Read about the different [versions and consumption methods for Azure Multi-Factor Authentication](multi-factor-authentication-versions-plans.md)
