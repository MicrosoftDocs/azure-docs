---
title: How to Opt Out of Preview
description: Learn how to Opt Out of the Verifiable Credentials Preview
documentationCenter: ''
author: barclayn
manager: daveba
ms.service: identity
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 03/04/2021
ms.author: barclayn

#Customer intent: Why are we doing this?
---

# Opt out of the Verifiable Credentials Preview

In this article:
- Potential reasons for opting out
- How to opt out
- What happens to your data when you opt out
- Existing Verifiable Credential Implications
- Next Steps 

## Prerequisites

To opt out of the Verifiable Credentials Preview, you would have needed to previously enroll in the Preview .

- Complete Verifiable Credentials onboarding. 

## Potential reasons for opting out

In the article on how to link your DID to your domain, we mentioned that if you made an error entering the domain or decided you want to change the domain entered, we currently don't support that today. The only recourse is to opt out and start again. 

## How to opt out

1. Navigate to Settings in the Verifiable Credentials blade in AAD. 
2. Under the section, 'Reset your organization', select 'Delete all credentials and opt out of preview'. 

![settings reset org](media/how-to-optout/settings-reset.png) 

3. Read the warning message and to continue select 'Delete and opt out' 

![settings delete and opt out](media/how-to-optout/delete-and-optout.png) 

You have now opted out of the Verifiable Credentials Preview. Keep reading to understand what is happening under the hood. 

## What happens to your data when you opt out

When you complete opting out of the AAD Verifiable Credentials service, the following actions will take place:

- The DID keys in Key Vault will be soft deleted. <Soft deleted means?>
- The Issuer object will be deleted from our database.
- The tenant identifer will be deleted from our database. 
- All of the Contracts objects will be deleted from our database.

Once an opt out takes place, you will not be able to recover your DID or conduct any operations on your DID. This is a one way operations and you will need to opt in again which will result in a new DID being created.  

## Existing Verifiable Credential Implications

All of your currently issued Verifiable Credentials will still continue to exist in the world. They will not be cryptographically invalidated as your DID will still be resolvable through ION. 

However, when Relying Parties call the status API, they will always receive back a failure message. <need to confirm this?>

