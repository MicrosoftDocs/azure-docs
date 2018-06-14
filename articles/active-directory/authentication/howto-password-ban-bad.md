---
title: How to ban passwords in Azure AD
description: Ban weak passwords from your envirionment with Azure AD dynamically banned passwrords

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: article
ms.date: 06/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: rogoya

---
# Configuring the custom banned password list

In addition to Microsoft's global banned password list organizations can create a custom banned password list. Many organizations find that their users combine common local words such as a city, state, company name, school, sports team, or famous person in their passwords. This practice can make passwords susceptible to compromize by attackers.

![Modify the custom banned password list under Authentication Methods in the Azure portal](./media/howto-password-ban-bad/authentication-methods-password-protection.png)