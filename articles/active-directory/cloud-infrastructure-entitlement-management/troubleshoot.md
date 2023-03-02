---
title: Troubleshoot issues with Permissions Management
description: Troubleshoot issues with Permissions Management
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: troubleshooting
ms.date: 02/23/2022
ms.author: jfields
---

# Troubleshoot issues with Permissions Management

This section answers troubleshoot issues with Permissions Management.

## One time passcode (OTP) email

### The user didn't receive the OTP email.

- Check your junk or Spam mail folder for the email.

## Reports

### The individual files are generated according to the authorization system (subscription/account/project).

- Select the **Collate** option in the **Custom Report** screen in the Permissions Management **Reports** tab.

## Data collection in AWS

### Data collection > AWS Authorization system data collection status is offline. Upload and transform is also offline.

- Check the Permissions Management-related role that exists in these accounts.
- Validate the trust relationship with the OpenID Connect (OIDC) role.

<!---Next steps--->
