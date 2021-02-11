---
title: Credential revokation 
description: 
services: active-directory
author: barclayn
manager: davba
ms.service: active-directory
ms.subservice: verifiable-credentials
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 02/08/2021
ms.author: barclayn
# Customer intent: As a developer I am looking for information on how to enable my users to control their own information 
---

# Credential revokation when working with Azure Verifiable credentials

After Verifiable Credentials have been issued to your users, you can invalidate credentials by using the Azure Portal.

## Revoke an individual credential

To revoke a single Verifiable Credentials, complete the following steps.

1. Navigate to the **Issued Credentials** tab for your credential in the Azure Portal.
2. Locate the credential of interest in the list of issued credentials. Click on the credential to view its detail.
3. Click the **Revoke Credential** button to invalidate the credential. The user will no longer be able to use the credential with any verifier.

## Revoke all issued credentials

To invalidate all credentials you've issued, complete the following steps.

1. Navigate to the **Overview** tab for your credential in the Azure Portal.
3. Click the **Delete & Revoke All Credentials** button. All users who have received Verifiable Credentials will no longer be able to use the credential with any verifier.

TODO: Screenshots

