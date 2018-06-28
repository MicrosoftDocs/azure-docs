---
title: Risk-based MFA and SSPR with Azure Identity Protection
description: In this tutorial, you will enable Azure Identity Protection integrations, for Multi-Factor Authentication and self-service password reset, to reduce risky behavior.

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: tutorial
ms.date: 05/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: sahenry

# Customer intent: How, as an Azure AD Administrator, do I utilize Azure AD Identity Protection to better protect the sign-in process.
---
# Tutorial: Enable risk-based Multi-Factor Authentication and password changes

Azure Active Directory (Azure AD) Identity Protection is licensed as an Azure AD Premium P2 feature that is more than just a monitoring and reporting tool. To protect your organization's identities, you can configure risk-based policies that automatically respond to risky behaviors. These policies, can either automatically block or initiate remediation, including requiring password changes and enforcing Multi-Factor Authentication.

Azure AD Identity Protection policies can be used in addition to existing conditional access policies as an extra layer of protection. Your users may never trigger a risky behavior requiring one of these policies, but as an administrator you know they are protected.

Some items that may trigger a risk event include:

* Users with leaked credentials
* Sign-ins from anonymous IP addresses
* Impossible travel to atypical locations
* Sign-ins from infected devices
* Sign-ins from IP addresses with suspicious activity
* Sign-ins from unfamiliar locations

More information about Azure AD Identity Protection can be found in the article [What is Azure AD Identity Protection](../active-directory-identityprotection.md)

> [!div class="checklist"]
> * Enable Azure MFA registration
> * Enable risk-based password changes
> * Enable risk-based Multi-Factor Authentication

## Prerequisites

* Access to a working Azure AD tenant with at least a trial Azure AD Premium P2 license assigned.
* An account with Global Administrator privileges in your Azure AD tenant.
* Have completed the previous self-service password reset (SSPR) and Multi-Factor Authentication (MFA) tutorials.

## Enable risk-based policies for SSPR and MFA


Sign in to the Azure portal
Click on All services, then click on Azure AD Identity Protection

Click on MFA registration
Set Enforce Policy to On. Setting this policy will require all of your users to register methods to prepare to use by Multi-Factor Authentication.
Click **Save**

![Require users to register for MFA at sign-in using Azure AD Identity Protection](./media/tutorial-risk-based-sspr-mfa/risk-based-require-mfa-registration.png)

Click on User risk policy
Click on Conditions to select a risk level and choose "Medium and above"
Click "Select" then "Done"
Click on Access to select the controls to be enforced and make sure "Require password change" under allow access is selected.
Click "Select"
Set Enforce Policy to On.
Click **Save**

Click on Sign-in risk policy
Click on Conditions to select a sign-in risk level and choose "Medium and above"
Click "Select" then "Done"
Click on Access to select the controls to be enforced and make sure "Require multi-factor authentication" under allow access is selected.
Click "Select"
Set Enforce Policy to On.
Click **Save**