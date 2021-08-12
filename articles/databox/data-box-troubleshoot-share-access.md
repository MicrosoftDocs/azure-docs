---
title: Troubleshoot share connection failure during data copy to Azure Data Box | Microsoft Docs
description: Describes how to identify network issues preventing SMB share connections during data copy to an Azure Data Box.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: pod
ms.topic: troubleshooting
ms.date: 08/12/2021
ms.author: alkohli
---

# Troubleshoot share connection failure during data copy to Azure Data Box

This article describes what to do when you can't connect to an SMB share on your Azure Data Box device because of a network issue.

The most common reasons for being unable to connect to a share on your device are:

- [a domain issue](#check-for-a-domain-issue)
- [account is locked out of the share](#account-locked-out-of-share)
- [a group policy is preventing a connection](#check-for-a-blocking-group-policy)
- [a permissions issue](#check-for-permissions-issues)

## Check for a domain issue

*MAYA: What are they actually checking for? Is this actually a domain issue?* 

To find out whether a domain issue is preventing a share connection:

1. Start by making sure you have the right share password. On a Windows Server client/host computer, go to **Connect and copy** in the local web UI, and select **SMB** to find access credentials for the shares associated with your storage account. For detailed steps, see [Copy data to Data Box via SMB](data-box-deploy-copy-data.md).

1. When you access the share, enter the share password in one of the following formats:

    - `<device IP address>\<user name>`
    - `\<user name>`

    To access a share associated with your storage account from your client/host computer, open a command window. At the command prompt, type the following command. You'll be prompted for a password.

    `net use \\<IP address of the device>\<share name> /u:<IP address of the device>\<user name for the share>`

    For a procedure, see [Copy data to Data Box via SMB](data-box-deploy-copy-data.md#connect-to-data-box).

## Account locked out of share

If you see the following error when you try to connect to an SMB share on your device, the share user account has been locked after multiple attempts to connect with an incorrect password:

"The referenced account is currently locked out and may not be logged on to."

After five attempts to connect to a share with an incorrect share password, the share will be locked, and you won't be able to connect to the share for 15 minutes. The failed connection attempts may include background processes, such as retries, which you may not be aware of.

The following example shows the output from one such connection attempt.

```
C:\Users\Databoxuser>net use \\10.126.167.22\podpmresourcesa_BlockBlob /u:10.126.167.22\podpmresourcesa
Enter the password for '10.126.167.22\podpmresourcesa' to connect to '10.126.167.22':
System error 1909 has occurred.

The referenced account is currently locked out and may not be logged on to.
```

In the local web UI, you'll see the following notification on the **Connect and copy** pane when the user account for a share is locked.

![Screenshot of the Connect and Copy pane in the local Web UI for a Data Box. A locked share account notification is highlighted.](media/data-box-troubleshoot-share-access/share-lock-01.png)

After 15 minutes, the lock will clear, and you'll be able to provide the user account credentials to access the share on the **Copy data** pane. 

![Screenshot of the Copy Data pane in the local Web UI for a Data Box. A notification that the share user account has been unlocked is highlighted.](media/data-box-troubleshoot-share-access/share-lock-02.png)


To connect to an SMB share after a share account lockout, do these steps:

1. Verify the SMB credentials for the share. In the local web UI of your device, go to **Connect and copy**, and select **SMB** for the share. You'll see the following dialog box.

    ![Screenshot of Access Share And Copy Data screen for an SMB share on a Data Box. Copy icons for the account, username, and password are highlighted.](media/data-box-troubleshoot-share-access/get-share-credentials-01.png)

1. After 15 minutes, the lock will clear. You can connect to the share using either of the following methods:

   - To connect to the share via SMB from your host computer, run the following command:  
  
     `net use \\<IP address of the device>\<share name> /u:<IP address of the device>\<user name for the share>`

     For a procedure, see [Copy data to Data Box via SMB](data-box-deploy-copy-data.md#connect-to-data-box).

   - To connect to a share using the data copy service, open the **Copy data** pane in the local web UI. A notification will indicate the user account has been unlocked. You can [copy data to the Data Box](data-box-deploy-copy-data-via-copy-service.md#copy-data-to-data-box), providing the needed share credentials.

    ![Screenshot of the Copy Data pane in the local Web UI for a Data Box. A notification that the share user account has been unlocked is highlighted.](media/data-box-troubleshoot-share-access/share-lock-02.png)


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