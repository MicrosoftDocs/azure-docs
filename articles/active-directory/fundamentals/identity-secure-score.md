---
title: What is identity secure score? - Azure Active Directory
description: How you can use the identity secure score to improve the security posture of your directory

services: active-directory
ms.service: active-directory
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 05/20/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: tilarso

#Customer intent: As an IT admin, I want understand the identity secure score, so that I can maximize the security posture of my tenant.

ms.collection: M365-identity-device-management
---
# What is the identity secure score in Azure Active Directory?

How secure is your Azure AD tenant? If you don't know how to answer this question, this article explains how the identity secure score helps you to monitor and improve your identity security posture.

## What is an identity secure score?

The identity secure score is number between 1 and 223 that functions as an indicator for how aligned you are with Microsoft's best practice recommendations for security. Each improvement action in identity secure score is tailored to your specific configuration.  

![Secure score](./media/identity-secure-score/identity-secure-score-overview.png)

The score helps you to:

- Objectively measure your identity security posture
- Plan identity security improvements
- Review the success of your improvements

You can access the score and related information on the identity secure score dashboard. On this dashboard, you find:

- Your identity secure score
- A comparison graph showing how your Identity secure score compares to other tenants in the same industry and similar size
- A trend graph showing how your Identity secure score has changed over time
- A list of possible improvements

By following the improvement actions, you can:

- Improve your security posture and your score
- Take advantage the features available to your organization as part of your identity investments

## How do I get my secure score?

The identity secure score is available in all editions of Azure AD. To access your score, go to the [Azure AD Overview dashboard](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/IdentitySecureScore).

## How does it work?

Every 48 hours, Azure looks at your security configuration and compares your settings with the recommended best practices. Based on the outcome of this evaluation, a new score is calculated for your directory. It’s possible that your security configuration isn’t fully aligned with the best practice guidance and the improvement actions are only partially met. In these scenarios, you will only be awarded a portion of the max score available for the control.

Each recommendation is measured based on your Azure AD configuration. If you are using third-party products to enable a best practice recommendation, you can indicate this configuration in the settings of an improvement action. You also have the option to set recommendations to be ignored if they don't apply to your environment. An ignored recommendation does not contribute to the calculation of your score.

![Ignore or mark action as covered by third party](./media/identity-secure-score/identity-secure-score-ignore-or-third-party-reccomendations.png)

## How does it help me?

The secure score helps you to:

- Objectively measure your identity security posture
- Plan identity security improvements
- Review the success of your improvements

## What you should know

### Who can use the identity secure score?

The identity secure score can be used by the following roles:

- Global admin
- Security admin
- Security readers

### How are controls scored?

Controls can be scored in two ways. Some are scored in a binary fashion - you get 100% of the score if you have the feature or setting configured based on our recommendation. Other scores are calculated as a percentage of the total configuration. For example, if the improvement recommendation states you’ll get 30 points if you protect all your users with MFA and you only have 5 of 100 total users protected, you would be given a partial score around 2 points (5 protected / 100 total * 30 max pts = 2 pts partial score).

### What does [Not Scored] mean?

Actions labeled as [Not Scored] are ones you can perform in your organization but won't be scored because they aren't hooked up in the tool (yet!). So, you can still improve your security, but you won't get credit for those actions right now.

### How often is my score updated?

The score is calculated once per day (around 1:00 AM PST). If you make a change to a measured action, the score will automatically update the next day. It takes up to 48 hours for a change to be reflected in your score.

### My score changed. How do I figure out why?

Head over to the [Microsoft 365 security center](https://security.microsoft.com/), where you’ll find your complete Microsoft secure score. You can easily see all the changes to your secure score by reviewing the in-depth changes on the history tab.

### Does the secure score measure my risk of getting breached?

In short, no. The secure score does not express an absolute measure of how likely you are to get breached. It expresses the extent to which you have adopted features that can offset the risk of being breached. No service can guarantee that you will not be breached, and the secure score should not be interpreted as a guarantee in any way.

### How should I interpret my score?

You're given points for configuring recommended security features or performing security-related tasks (like reading reports). Some actions are scored for partial completion, like enabling multi-factor authentication (MFA) for your users. Your secure score is directly representative of the Microsoft security services you use. Remember that security must be balanced with usability. All security controls have a user impact component. Controls with low user impact should have little to no effect on your users' day-to-day operations.

To see your score history, head over to the [Microsoft 365 security center](https://security.microsoft.com/) and review your overall Microsoft secure score. You can review changes to your overall secure score be clicking on View History. Choose a specific date to see which controls were enabled for that day and what points you earned for each one.

### How does the identity secure score relate to the Office 365 secure score?

The [Microsoft secure score](https://docs.microsoft.com/office365/securitycompliance/microsoft-secure-score) contains five distinct control and score categories:

- Identity
- Data
- Devices
- Infrastructure
- Apps

The identity secure score represents the identity part of the Microsoft secure score. This overlap means that your recommendations for the identity secure score and the identity score in Microsoft are the same.

## Next steps

[Find out more about Microsoft secure score](https://docs.microsoft.com/office365/securitycompliance/microsoft-secure-score)
