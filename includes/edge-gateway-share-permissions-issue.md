---
title: Prerequisites include file shared by two tabs in the same file  | Microsoft Docs
description: Azure Data Box deploy ordered prerequisites
services: databox
author: v-dalc
ms.service: databox
ms.subservice: pod
ms.topic: include
ms.date: 08/04/2021
ms.author: alkohli
---
## Check for a permissions issue

If there's no domain issue, and no group policies are blocking your access to the share, check for permissions issues.

### Run diagnostics

Start by running diagnostics on your device.

To run diagnostics on your device, do the following steps:<!--Diagnostics option is not available for Data Box. If there is not an equivalent step on Data Box, this goes.-->

   1. In the local web UI, go to **Troubleshooting**, and then to **Diagnostic test**.

   1. Review the `Smbserver.Security` event logs in the `etw` folder for one of the following errors:
      
       ```xml
       SMB Session Authentication Failure
       Client Name: \\<ClientIP>
       Client Address: <ClientIP:Port>
       User Name:
       Session ID: 0x100000000021
       Status: The attempted logon is invalid. This is either due to a bad username or authentication information. (0xC000006D)
       SPN: session setup failed before the SPN could be queried
       SPN Validation Policy: SPN optional / no validation
       ```
      
       Or this error:

       ```xml
       LmCompatibilityLevel value is different from the default.
       Configured LM Compatibility Level: 5
       Default LM Compatibility Level: 3
       ```

If you find either of these errors, you'll need to update the LAN Manager authentication level on your device. Use the Local Security Policy editor. If that doesn't work, you can update the registry directly.

### Use Local Security Policy editor to change the policy

To change the policy in Local Security Policy, do these steps:
 
1. To open Local Security Policy, on the **Start** screen, type `secpol.msc`, and then press Enter.

1. Go to **Local Policies** > **Security Options**, and open **Network Security: LAN Manager authentication level**.

    ![Screenshot showing the Security Options in the Local Security Policy editor. The "Network Security: LAN Manager authentication level" policy is highlighted.](media/edge-gateway-share-permissions-issue/security-policy-01.png)

1. Change the setting to **Send NTLMv2 response only. Refuse LM & NTLM**.

    ![Screenshot showing "Network Security: LAN Manager authentication level" policy in the Local Security Policy editor. The "Send NTLMv2 response only. Refuse LM & NTLM" option is highlighted.](media/edge-gateway-share-permissions-issue/security-policy-02.png)

### Update the registry to change the policy

If you can't change the LAN Manager authentication level in Local Security Policy, update the registry directly.

To update the registry, do these steps:

1. To open Registry Editor (regedit32.exe), on the **Start** screen, type `regedt32`, and then press Enter.

1. Navigate to: HKEY_LOCAL_MACHINE > SYSTEM > CurrentControlSet > Control > LSA.

    ![Screenshot showing the Registry Editor with the LSA folder highlighted.](media/edge-gateway-share-permissions-issue/security-policy-03.png)

1. In the LSA folder, open the LMCompatibilityLevel registry key, and change its value to 5.

    ![Screenshot of the Registry Editor, showing the dialog box to change the value of the LMCompatibilityLevel registry key.](media/edge-gateway-share-permissions-issue/security-policy-04.png)

1. Restart your computer so that the registry changes take effect.
