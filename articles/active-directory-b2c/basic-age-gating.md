---
title: Enable age gating in Azure Active Directory B2C | Microsoft Docs
description: Learn about how to identify minors using your application.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 11/13/2018
ms.author: marsma
ms.subservice: B2C
---

# Enable Age Gating in Azure Active Directory B2C

>[!IMPORTANT]
>This feature is in public preview. Do not use feature for production applications. 
>

Age gating in Azure Active Directory (Azure AD) B2C enables you to identify minors that want to use your application. You can choose to block the minor from signing into the application. Users can also go back to the application and identify their age group and their parental consent status. Azure AD B2C can block minors without parental consent. Azure AD B2C can also be set up to allow the application to decide what to do with minors.

After you enable age gating in your [user flow](active-directory-b2c-reference-policies.md), users are asked when they were born and what country/region they live in. If a user signs in that hasn't previously entered the information, they'll need to enter it the next time they sign in. The rules are applied every time a user signs in.

Azure AD B2C uses the information that the user enters to identify whether they're a minor. The **ageGroup** field is then updated in their account. The value can be `null`, `Undefined`, `Minor`, `Adult`, and `NotAdult`.  The **ageGroup** and **consentProvidedForMinor** fields are then used to calculate the value of **legalAgeGroupClassification**.

Age gating involves two age values: the age that someone is no longer considered a minor, and the age at which a minor must have parental consent. The following table lists the age rules that are used for defining a minor and a minor requiring consent.

| Country/Region | Country/Region name | Minor consent age | Minor age |
| -------------- | ------------------- | ----------------- | --------- |
| Default | None | None | 18 |
| AE | United Arab Emirates | None | 21 |
| AT | Austria | 14 | 18 |
| BE | Belgium | 14 | 18 |
| BG | Bulgaria | 16 | 18 |
| BH | Bahrain | None | 21 |
| CM | Cameroon | None | 21 |
| CY | Cyprus | 16 | 18 |
| CZ | Czech Republic | 16 | 18 |
| DE | Germany | 16 | 18 |
| DK | Denmark | 16 | 18 |
| EE | Estonia | 16 | 18 |
| EG | Egypt | None | 21 |
| ES | Spain | 13 | 18 |
| FR | France | 16 | 18 |
| GB | United Kingdom | 13 | 18 |
| GR | Greece | 16 | 18 |
| HR | Croatia | 16 | 18 |
| HU | Hungary | 16 | 18 |
| IE | Ireland | 13 | 18 |
| IT | Italy | 16 | 18 |
| KR | Korea, Republic of | 14 | 18 |
| LT | Lithuania | 16 | 18 |
| LU | Luxembourg | 16 | 18 |
| LV | Latvia | 16 | 18 |
| MT | Malta | 16 | 18 |
| NA | Namibia | None | 21 |
| NL | Netherlands | 16 | 18 |
| PL | Poland | 13 | 18 |
| PT | Portugal | 16 | 18 |
| RO | Romania | 16 | 18 |
| SE | Sweden | 13 | 18 |
| SG | Singapore | None | 21 |
| SI | Slovenia | 16 | 18 |
| SK | Slovakia | 16 | 18 |
| TD | Chad | None | 21 |
| TH | Thailand | None | 20 |
| TW | Taiwan | None | 20 | 
| US | United States | 13 | 18 |

## Age gating options
 
### Allowing minors without parental consent

For user flows that allow either sign-up, sign-in, or both, you can choose to allow minors without consent into your application. Minors without parental consent are allowed to sign in or sign up as normal and Azure AD B2C issues an ID token with the **legalAgeGroupClassification** claim. This claim defines the experience that users have, such as collecting parental consent and updating the **consentProvidedForMinor** field.

### Blocking minors without parental consent

For user flows that allow either sign-up, sign-in or both, you can choose to block minors without consent from the application. The following options are available for handling blocked users in Azure AD B2C:

- Send a JSON back to the application - this option sends a response back to the application that a minor was blocked.
- Show an error page -  the user is shown a page informing them that they can't access the application.

## Set up your tenant for age gating

To use age gating in a user flow, you need to configure your tenant to have additional properties.

1. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu. Select the directory that contains your tenant. 
2. Select **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
3. Select **Properties** for your tenant in the menu on the left.
2. Under the **Age gating** section, click on **Configure**.
3. Wait for the operation to complete and your tenant will be set up for age gating.

## Enable age gating in your user flow

After your tenant is set up to use age gating, you can then use this feature in [user flows](user-flow-versions.md) where it's enabled. You enable age gating with the following steps:

1. Create a user flow that has age gating enabled.
2. After you create the user flow, select **Properties** in the menu.
3. In the **Age gating** section, select **Enabled**.
4. You then decide how you want to manage users that identify as minors. For **Sign-up or sign-in**, you select `Allow minors to access your application` or `Block minors from accessing your application`. If blocking minors is selected, you select `Send a JSON back to the application` or `Show an error message`. 




