---
title: Provide risk feedback in Azure Active Directory Identity Protection
description: How and why should you provide feedback on Identity Protection risk detections.

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: how-to
ms.date: 06/05/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sahandle

ms.collection: M365-identity-device-management
---
# How To: Give risk feedback in Azure AD Identity Protection

Azure AD Identity Protection allows you to give feedback on its risk assessment. The following document lists the scenarios where you would like to give feedback on Azure AD Identity Protection’s risk assessment and how we incorporate it.

## What is a detection?

An Identity Protection detection is an indicator of suspicious activity from an identity risk perspective. These suspicious activities are called risk detections. These identity-based detections can be based on heuristics, machine learning or can come from partner products. These detections are used to determine sign-in risk and user risk,

* User risk represents the probability an identity is compromised.
* Sign-in risk represents the probability a sign-in is compromised (for example, the sign-in is not authorized by the identity owner).

## Why should I give risk feedback to Azure AD’s risk assessments? 

There are several reasons why you should give Azure AD risk feedback:

- **You found Azure AD’s user or sign-in risk assessment incorrect**. For example, a sign-in shown in ‘Risky sign-ins’ report was benign and all the detections on that sign-in were false positives.
- **You validated that Azure AD’s user or sign-in risk assessment was correct**. For example, a sign-in shown in ‘Risky sign-ins’ report was indeed malicious and you want Azure AD to know that all the detections on that sign-in were true positives.
- **You remediated the risk on that user outside of Azure AD Identity Protection** and you want the user’s risk level to be updated.

## How does Azure AD use my risk feedback?

Azure AD uses your feedback to update the risk of the underlying user and/or sign-in and the accuracy of these events. This feedback helps secure the end user. For example, once you confirm a sign-in is compromised, Azure AD immediately increases the user’s risk and sign-in’s aggregate risk (not real-time risk) to High. If this user is included in your user risk policy to force High risk users to securely reset their passwords, the user will automatically remediate itself the next time they sign-in.

## How should I give risk feedback and what happens under the hood?

Here are the scenarios and mechanisms to give risk feedback to Azure AD.

| Scenario | How to give feedback? | What happens under the hood? | Notes |
| --- | --- | --- | --- |
| **Sign-in not compromised (False positive)** <br> ‘Risky sign-ins’ report shows an at-risk sign-in [Risk state = At risk] but that sign-in was not compromised. | Select the sign-in and click on ‘Confirm sign-in safe’. | Azure AD will move the sign-in’s aggregate risk to none [Risk state = Confirmed safe; Risk level (Aggregate) = -] and will reverse its impact on the user risk. | Currently, the ‘Confirm sign-in safe’ option is only available in ‘Risky sign-ins’ report. |
| **Sign-in compromised (True positive)** <br> ‘Risky sign-ins’ report shows an at-risk sign-in [Risk state = At risk] with low risk [Risk level (Aggregate) = Low] and that sign-in was indeed compromised. | Select the sign-in and click on ‘Confirm sign-in compromised’. | Azure AD will move the sign-in’s aggregate risk and the user risk to High [Risk state = Confirmed compromised; Risk level = High]. | Currently, the ‘Confirm sign-in compromised’ option is only available in ‘Risky sign-ins’ report. |
| **User compromised (True positive)** <br> ‘Risky users’ report shows an at-risk user [Risk state = At risk] with low risk [Risk level = Low] and that user was indeed compromised. | Select the user and click on ‘Confirm user compromised’. | Azure AD will move the user risk to High [Risk state = Confirmed compromised; Risk level = High] and will add a new detection ‘Admin confirmed user compromised’. | Currently, the ‘Confirm user compromised’ option is only available in ‘Risky users’ report. <br> The detection ‘Admin confirmed user compromised’ is shown in the tab ‘Risk detections not linked to a sign-in’ in the ‘Risky users’ report. |
| **User remediated outside of Azure AD Identity Protection (True positive + Remediated)** <br> ‘Risky users’ report shows an at-risk user and I have subsequently remediated the user outside of Azure AD Identity Protection. | 1. Select the user and click ‘Confirm user compromised’. (This process confirms to Azure AD that the user was indeed compromised.) <br> 2. Wait for the user’s ‘Risk level’ to go to High. (This time gives Azure AD the needed time to take the above feedback to the risk engine.) <br> 3. Select the user and click ‘Dismiss user risk’. (This process confirms to Azure AD that the user is no longer compromised.) |  Azure AD moves the user risk to none [Risk state = Dismissed; Risk level = -] and closes the risk on all existing sign-ins having active risk. | Clicking ‘Dismiss user risk’ will close all risk on the user and past sign-ins. This action cannot be undone. |
| **User not compromised (False positive)** <br> ‘Risky users’ report shows at at-risk user but the user is not compromised. | Select the user and click ‘Dismiss user risk’. (This process confirms to Azure AD that the user is not compromised.) | Azure AD moves the user risk to none [Risk state = Dismissed; Risk level = -]. | Clicking ‘Dismiss user risk’ will close all risk on the user and past sign-ins. This action cannot be undone. |
| I want to close the user risk but I am not sure whether the user is compromised / safe. | Select the user and click ‘Dismiss user risk’. (This process confirms to Azure AD that the user is no longer compromised.) | Azure AD moves the user risk to none [Risk state = Dismissed; Risk level = -]. | Clicking ‘Dismiss user risk’ will close all risk on the user and past sign-ins. This action cannot be undone. We recommend you remediate the user by clicking on ‘Reset password’ or request the user to securely reset/change their credentials. |

Feedback on user risk detections in Identity Protection is processed offline and may take some time to update. The risk processing state column will provide the current state of feedback processing.

![Risk processing state for risky user report](./media/howto-identity-protection-risk-feedback/risky-users-provide-feedback.png)

## Next steps

- [Azure Active Directory Identity Protection risk detections reference](risk-events-reference.md)
