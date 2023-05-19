---
title: Troubleshoot primary refresh token issues on Windows devices
description: Troubleshoot primary refresh token issues during authentication through Azure Active Directory (Azure AD) credentials on Azure AD-joined Windows devices.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: troubleshooting
ms.date: 5/24/2023

ms.author: v-dele
author: DennisLee-DennisLee
editor: v-jsitser
manager: amycolannino
ms.reviewer: azureidcic, gudlapreethi
---
# Troubleshoot primary refresh token issues on Windows devices

This article discusses how to troubleshoot issues that involve the primary refresh token (PRT) when you authenticate onto a Microsoft Azure Active Directory (Azure AD)-joined Windows device by using your Azure AD credentials.

On devices that are joined to Microsoft Azure Active Directory (Azure AD) or joined to Hybrid Azure AD, the main artifact of authentication is the PRT. You obtain this token by signing in to Windows 10 by using Azure AD credentials on an Azure AD-joined device for the first time. The PRT is cached on that device. For subsequent sign-ins, the cached token is used to let you use the desktop.

Once every four hours, as part of lock and unlock or signing in again to Windows, a background network authentication is tried to refresh the PRT. If there are problems in refreshing the token, the PRT eventually expires. Expiration affects single sign-on (SSO) to Azure AD resources. It also causes sign-in prompts to be shown.

If you suspect that there's a PRT problem, first collect Azure AD logs and follow the steps outlined in the troubleshooting checklist. We recommend that you collect Azure AD logs for any Azure AD client issue first, ideally within a repro session. Complete this process before you contact the PG or file an ICM.

## Troubleshooting checklist

### Step 1: Get the status of the PRT

1. Sign in to Windows under the user account in which you experience PRT issues.
1. On the Windows **Start** menu, search for and select **Command Prompt**.
1. Enter `dsregcmd /status` to run the [dsregcmd command](./troubleshoot-device-dsregcmd.md).
1. Locate the `SSO state` section of the command output. Here's an example of this output:

   ```output
   +----------------------------------------------------------------------+
   | SSO State                                                            |
   +----------------------------------------------------------------------+

                   AzureAdPrt : YES
         AzureAdPrtUpdateTime : 2020-07-12 22:57:53.000 UTC
         AzureAdPrtExpiryTime : 2020-07-26 22:58:35.000 UTC
          AzureAdPrtAuthority : https://login.microsoftonline.com/01234567-89ab-cdef-0123-456789abcdef
                EnterprisePrt : YES
      EnterprisePrtUpdateTime : 2020-07-12 22:57:54.000 UTC
      EnterprisePrtExpiryTime : 2020-07-26 22:57:54.000 UTC
       EnterprisePrtAuthority : https://msft.sts.microsoft.com:443/adfs

   +----------------------------------------------------------------------+
   ```

1. Check the value of the `AzureAdPrt` field. If it's set to `NO`, there was an error acquiring the PRT from Azure AD.

1. Check the value of the `AzureAdPrtUpdateTime` field. If the AzureAdPrtUpdateTime is more than 4 hours there is likely an issue refreshing PRT. Lock and unlock the device to force PRT refresh and check if the time got updated.

### Step 2: Get the error code



### Step 3: 



### Step 4: Collect the logs
