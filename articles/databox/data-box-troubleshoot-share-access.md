---
title: Troubleshoot share connection failure during data copy to Azure Data Box | Microsoft Docs
description: Describes how to identify network issues preventing SMB share connections during data copy to an Azure Data Box.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: pod
ms.topic: troubleshooting
ms.date: 08/06/2021
ms.author: alkohli
---

# Troubleshoot share connection failure during data copy to Azure Data Box

This article describes what to do when you can't connect to an SMB share on your Azure Data Box device because of a network issue.

The most common reasons for being unable to connect to a share on your device are:

- [a domain issue](#check-for-a-domain-issue)
- [a group policy that's preventing a connection](#check-for-a-blocking-group-policy)
- [a permissions issue](#check-for-permissions-issues)

## Check for a domain issue

To find out whether a domain issue is preventing a share connection:

1. Start by making sure you have the right share password. On a Windows Server client/host computer, go to **Connect and copy** in the local web UI, and select **SMB** to find access credentials for the shares associated with your storage account. For detailed steps, see [Copy data to Data Box via SMB](data-box-deploy-copy-data.md).

1. When you access the share, enter the share password in one of the following formats:

    - `<device IP address>\<user name>`
    - `\<user name>`

    To access a share associated with your storage account from your client/host computer, open a command window. At the command prompt, type the following command. You'll be prompted for a password.

    `net use \\<IP address of the device>\<share name> /u:<IP address of the device>\<user name for the share>`

    For a procedure, see [Copy data to Data Box via SMB](data-box-deploy-copy-data.md).

## Check for a blocking group policy

Check whether a group policy on your client/host computer is preventing you from connecting to the share. If possible, move your client/host computer to an organizational unit (OU) that doesn't have any Group Policy objects (GPOs) applied.

To ensure that no group policies are preventing your access to shares on the Data Box:

* Ensure that your client/host computer is in its own OU for Active Directory.

* Make sure that no GPOs are applied to your client/host computer. You can block inheritance to ensure that the client/host computer (child node) doesn't automatically inherit any GPOs from the parent. For more information, see [block inheritance](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc731076(v=ws.11)).

## Check for permissions issues

If there's no domain issue, and no group policies are blocking your access to the share, check for permissions issues on your device by reviewing audit logs and security event logs.

### Review security event logs

Review Windows security event logs on the device for errors that indicate an authentication failure.

You can review the `Smbserver.Security` event logs in the `etw` folder or view security errors in Event Viewer.

To review Windows Security event logs in Event Viewer, do these steps:

1. To open the Windows Event Viewer, on the **Start screen**, type **Event Viewer**, and press Enter.

1. In the Event Viewer navigation pane, expand **Windows**, and select the **Security** folder.

    ![Screenshot of the Windows Event Viewer with Security events displayed. The Windows folder and Security subfolder are highlighted.](media/data-box-troubleshoot-share-access/security-policy-04.png)

3. Look for one of the following errors:

    Error 1:

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
      
    Error 2:
    ```xml
     LmCompatibilityLevel value is different from the default.
    Configured LM Compatibility Level: 5
    Default LM Compatibility Level: 3   
    ```

    Either error indicates that you need to change the LAN Manager authentication level on your device.
 
### Change LAN Manager authentication level
 
To change the LAN Manager authentication level on your device, you can either [use Local Security Policy](#use-local-security-policy) or [update the registry directly](#update-the-registry).

#### Use Local Security Policy

To change LAN Manager authentication level using Local Security Policy, do these steps:
 
1. To open Local Security Policy, on the **Start** screen, type `secpol.msc`, and then press Enter.

1. Go to **Local Policies** > **Security Options**, and open **Network Security: LAN Manager authentication level**.

    ![Screenshot showing the Security Options in the Local Security Policy editor. The "Network Security: LAN Manager authentication level" policy is highlighted.](media/data-box-troubleshoot-share-access/security-policy-01.png)

1. Change the setting to **Send NTLMv2 response only. Refuse LM & NTLM**.

    ![Screenshot showing "Network Security: LAN Manager authentication level" policy in the Local Security Policy editor. The "Send NTLMv2 response only. Refuse LM & NTLM" option is highlighted.](media/data-box-troubleshoot-share-access/security-policy-02.png)

#### Update the registry

If you can't change the LAN Manager authentication level in Local Security Policy, update the registry directly.

To update the registry directly, do these steps:

1. To open Registry Editor (regedit32.exe), on the **Start** screen, type `regedt32`, and then press Enter.

1. Navigate to: HKEY_LOCAL_MACHINE > SYSTEM > CurrentControlSet > Control > LSA.

    ![Screenshot showing the Registry Editor with the LSA folder highlighted.](media/data-box-troubleshoot-share-access/security-policy-03.png)

1. In the LSA folder, open the LMCompatibilityLevel registry key, and change its value to 5.

    ![Screenshot of dialog box used to change LmcompatibilityLevel key in the registry. The Value Data field is highlighted.](media/data-box-troubleshoot-share-access/security-policy-04.png)

1. Restart your computer so that the registry changes take effect.

## Next steps

- [Copy data via SMB](data-box-deploy-copy-data.md).
- [Troubleshoot data copy issues in Data Box](data-box-troubleshoot.md).
- [Contact Microsoft support](data-box-disk-contact-microsoft-support.md).