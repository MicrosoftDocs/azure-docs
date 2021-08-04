---
title: Troubleshoot share connection failure on Azure Data Box device
description: Describes how to identify network issues preventing share connections in Azure Data Box.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: pod
ms.topic: troubleshooting
ms.date: 08/04/2021
ms.author: alkohli
---

# Troubleshoot a share connection failure on an Azure Data Box device

This article describes what to do when you can't connect to a share on your Azure Data Box device.<!--Verifying: Is this during a data copy to the device, an upload from the device to the cloud, or both.-->

The most common reasons for being unable to connect to a share on a Data Box device are:

- [a domain issue](#check-for-a-domain-issue)
- [a group policy that's preventing a connection](#check-for-a-group-policy-issue)
- [a permissions issue](#check-for-a-permissions-issue)

## Check for a domain issue

To find out whether a domain issue is preventing share access:

1. When you access the share, enter the share password in one of the following formats:

    - `<device IP address>\<user name>`
    - `\<user name>`

    To access a share associated with your storage account from your host computer, open a command window. At the command prompt, type the following command. You'll be prompted for a password.<!--They already know this?-->

    `net use \\<IP address of the device>\<share name> /u:<IP address of the device>\<user name for the share>`<!--Check the raw data for this command. It's being truncated.-->

    For a procedure, see [Copy data to Data Box via SMB](data-box-deploy-copy-data.md).

## Check for a blocking group policy

Check whether a group policy on your client/host computer is preventing you from connecting to the share. If possible, move your client/host computer to an organizational unit (OU) that doesn't have any Group Policy objects (GPOs) applied.

To ensure that no group policies are preventing your access to shares on the Data Box:

* Ensure that your client/host computer is in its own organizational unit (OU) for Active Directory.

* Make sure  that no group policy objects (GPOs) are applied to your client/host computer. You can block inheritance to ensure that the client/host computer (child node) does not automatically inherit any GPOs from the parent. For more information, see [block inheritance](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc731076(v=ws.11)).

### Run diagnostics

To run diagnostics on your Data Box, do the following steps:<!--Diagnostics option is not available for Data Box. If there is not an equivalent step on Data Box, this goes.-->

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

    ![Screenshot showing the Security Options in the Local Security Policy editor. The "Network Security: LAN Manager authentication level" policy is highlighted.](media/data-box-troubleshoot-share-connection/security-policy-01.png)

1. Change the setting to **Send NTLMv2 response only. Refuse LM & NTLM**.

    ![Screenshot showing "Network Security: LAN Manager authentication level" policy in the Local Security Policy editor. The "Send NTLMv2 response only. Refuse LM & NTLM" option is highlighted.](media/data-box-troubleshoot-share-connection/security-policy-02.png)

### Update the registry to change the policy

If you can't change the LAN Manager authentication level in Local Security Policy, update the registry directly.

To update the registry, do these steps:

1. To open Registry Editor (regedit32.exe), on the **Start** screen, type `regedt32`, and then press Enter.

1. Navigate to: HKEY_LOCAL_MACHINE > SYSTEM > CurrentControlSet > Control > LSA.

    ![Screenshot showing the Registry Editor with the LSA folder highlighted.](media/data-box-troubleshoot-share-connection/security-policy-03.png)

1. In the LSA folder, open the LMCompatibilityLevel registry key, and change its value to 5.

    ![Screenshot of the Registry Editor, showing the dialog box to change the value of the LMCompatibilityLevel registry key.](media/data-box-troubleshoot-share-connection/security-policy-04.png)

1. Restart your computer so that the registry changes take effect.

## Next steps

- [Copy data via SMB](data-box-deploy-copy-data.md).
- [Troubleshoot data copy issues in Data Box](data-box-troubleshoot.md).