---
title: Troubleshoot issues with CloudKnox Permissions Management 
description: Troubleshoot issues with CloudKnox Permissions Management
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: faq
ms.date: 02/02/2022
ms.author: v-ydequadros
---

# Troubleshoot issues with CloudKnox Permissions Management

This section answers troubleshoot issues with CloudKnox Permissions Management (CloudKnox).

## One Time Passcode (OTP) email

### The user did not receive the OTP email.

- Check your junk or Spam mail folder for the email.  

## Reports

### The individual files are generated according to the authorization system (subscription/account/project).

- Select the **Collate** option in the **Custom report** screen in the CloudKnox **Reports** tab.  

## Data collection in AWS

### Data collection > AWS Authorization system data collection status is offline. Upload and transform is also offline. 

- Check the CloudKnox-related role that exists in these accounts. 
- Validate the trust relationship with the OpenID Connect (OIDC) role. 


