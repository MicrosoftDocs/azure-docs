---
title: Configure Verified ID by AU10TIX as your Identity Verification Partner 
description: This article shows you the steps you need to follow to configure au10tix as your identity verification partner
services: active-directory
author: barclayn
manager: rkarlin
ms.service: decentralized-identity
ms.subservice: verifiable-credentials
ms.topic: how-to
ms.date: 08/10/2022
ms.author: barclayn
# Customer intent: As a developer, I'm looking for information about the open standards that are supported by Microsoft Entra Verified ID.
---

# Configure Verified ID by AU10TIX as your Identity Verification Partner

In this sample tutorial, we provide guidance on how to integrate Microsoft Entra Verified ID with [AU10TIX](https://www.au10tix.com/). AU10TIX is a global leader in identity verification enabling companies to scale up their business by accelerating employee / customer onboarding and ongoing verification throughout the customer lifecycle. It is a 100% automated solution processing verification of ID documents + biometrics in 8 seconds or less. AU10TIX supports the verification of documents for over 190 countries reading documents in their regional languages. To learn more about AU10TIX and its complete set of solutions, please visit https://www.au10tix.com/. 

## Pre-requisites

- [Configure your tenant](verifiable-credentials-configure-tenant.md) for Entra Verified ID service.
- If needed, [create an Azure account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Scenario description

Account onboarding can be used to enable faster onboarding by replacing manual identity verification often prone to errors. Verified IDs can be used to digitally onboard employees, students, citizens, or others to securely access resources and services. For example, rather than an employee needing to go to a central office to activate an employee badge, they can use a Verified ID to verify their identity to activate a badge that is delivered to them remotely. Rather than a citizen receiving a code they must redeem to access governmental services, they can use a Verified ID to prove their identity and gain access.

## Onboard with AU10TIX

1. To inquire about Verified ID by AU10TIX, please book a free demo by completing the form located at the bottom of this [page](https://www.au10tix.com/solutions/microsoft-azure-active-directory-verifiable-credentials-program/). One of our Sales experts will contact you within 24hrs (subject to business hours).

1. Once onboarding is complete, you will be assigned a Customer Success Manager who along with our integration experts will guide you through the configuration process to setup Verified ID by AU10TIX within your organization.

## Configure your Application to use Au10tix Verified ID

For incorporating identity verification into your Apps, using AU10TIX  “Government Issued ID -Global” Verified ID follow these steps:

1. As a developer you will provide these below steps to your tenant administrator to obtain the verification request URL and body for your application or website to request Verified IDs from your users.
1. Go to [Microsoft Entra portal -> Verified ID](https://entra.microsoft.com/#view/Microsoft_AAD_DecentralizedIdentity/ResourceOverviewBlade). Note: Make sure this is the tenant you set up for Verified ID per the pre-requisites.
1. Choose **Select Issuer**.
1. Look for AU10TIX in the **Search/select issuers** drop-down.

 