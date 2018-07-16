---
title: Learn about two-step verification in Azure MFA | Microsoft Docs
description: What is Azure Multi-factor Authentication, why use MFA, and the different methods and versions available.

services: multi-factor-authentication
ms.service: active-directory
ms.component: authentication
ms.topic: conceptual
ms.date: 07/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: michmcla

---
# What is Azure Multi-Factor Authentication?

Two-step verification is a method of authentication that requires more than one verification method and adds a critical second layer of security to user sign-ins and transactions. It works by requiring any two or more of the following verification methods:

* Something you know (typically a password)
* Something you have (a trusted device that is not easily duplicated, like a phone)
* Something you are (biometrics)

<center>![Username and Password](./media/multi-factor-authentication/pword.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Certificates](./media/multi-factor-authentication/phone.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Smart Phone](./media/multi-factor-authentication/hware.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Smart Card](./media/multi-factor-authentication/smart.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Virtual Smart Card](./media/multi-factor-authentication/vsmart.png) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Username and Password](./media/multi-factor-authentication/cert.png)</center>

Azure Multi-Factor Authentication (MFA) is Microsoft's two-step verification solution. Azure MFA helps safeguard access to data and applications while meeting user demand for a simple sign-in process. It delivers strong authentication via a range of verification methods, including phone call, text message, or mobile app verification.

## Why use Azure Multi-Factor Authentication?
Today, more than ever, people are increasingly connected. With smart phones, tablets, laptops, and PCs, people have multiple options to access their accounts and applications from anywhere and stay connected at any time.

Azure Multi-Factor Authentication is an easy to use, scalable, and reliable solution that provides a second method of authentication to protect your users.

| ![Easy to Use](./media/multi-factor-authentication/simple.png) | ![Scalable](./media/multi-factor-authentication/scalable.png) | ![Always Protected](./media/multi-factor-authentication/protected.png) | ![Reliable](./media/multi-factor-authentication/reliable.png) |
|:---:|:---:|:---:|:---:|
| **Easy to use** |**Scalable** |**Always Protected** |**Reliable** |

* **Easy to Use** - Azure Multi-Factor Authentication is simple to set up and use. The extra protection that comes with Azure Multi-Factor Authentication allows users to manage their own devices. Best of all, in many instances it can be set up with just a few simple clicks.
* **Scalable** - Azure Multi-Factor Authentication uses the power of the cloud and integrates with your on-premises AD and custom apps. This protection is even extended to your high-volume, mission-critical scenarios.
* **Always Protected** - Azure Multi-Factor Authentication provides strong authentication using the highest industry standards.
* **Reliable** - Microsoft guarantees 99.9% availability of Azure Multi-Factor Authentication. The service is considered unavailable when it is unable to receive or process verification requests for the two-step verification.

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Windows-Azure-Multi-Factor-Authentication/player]


## Next steps

- Learn about [how Azure Multi-Factor Authentication works](concept-mfa-howitworks.md)

- Read about the different [versions and consumption methods for Azure Multi-Factor Authentication](concept-mfa-licensing.md)
