---
title: Troubleshoot issues with Entra Permissions Management
description: Troubleshoot issues with Entra Permissions Management
services: active-directory
author: mtillman
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: troubleshooting
ms.date: 02/23/2022
ms.author: mtillman
---

# Troubleshoot issues with Entra Permissions Management

> [!IMPORTANT]
> Entra Permissions Management (Entra) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

This section answers troubleshoot issues with Entra Permissions Management (Entra).

## One time passcode (OTP) email

### The user didn't receive the OTP email.

- Check your junk or Spam mail folder for the email.

## Reports

### The individual files are generated according to the authorization system (subscription/account/project).

- Select the **Collate** option in the **Custom Report** screen in the Entra **Reports** tab.

## Data collection in AWS

### Data collection > AWS Authorization system data collection status is offline. Upload and transform is also offline.

- Check the Entra-related role that exists in these accounts.
- Validate the trust relationship with the OpenID Connect (OIDC) role.

<!---Next steps--->
