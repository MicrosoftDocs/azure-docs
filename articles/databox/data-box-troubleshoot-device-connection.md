---
title: Troubleshoot share connections in Azure Data Box
description: Describes how to identify network issues preventing share connections in Azure Data Box.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: pod
ms.topic: troubleshooting
ms.date: 07/30/2021
ms.author: alkohli
---

# Troubleshoot share connection issues in Azure Data Box

<!--[!INCLUDE [<title>](<filepath>)] - I will write to the Data Box SKU. Support document addresses also: Data Box Gateway, and Azure Stack Edge. Support document: https://internal.support.services.microsoft.com/en-us/help/4535661-->

This article describes how to troubleshoot network issues that can cause SMB data copy to fail on your Azure Data Box device.<!--Source KB is for Data Box, Data Box Gateway, and Azure Stack Edge devices. Make an include?-->

## Unable to connect to an SMB share

<!--GLOBAL: This article isn't about device connections. It's about share connections.-->

### Possible causes

The most common reasons for being unable to connect to an SMB share FROM A HOST COMPUTER are:

- a domain issue
- a group policy that's preventing a connection
- a permissions issue

### Troubleshoot a share connection problem

If you can't log in on your Data Box device, do the following steps to identify and fix the problem: 

1. To check for a domain issue, try to [connect to your device](data-box-quickstart-portal.md) entering your credentials in one of the following formats:<!--Part of the share path.-->

       - `<device IP address>\<user name>`
       - `\<user name>`

   If this doesn't work, the problem isn't a domain issue.

1. Next, check whether a group policy is preventing the connection. If possible, move the client/host machine to an organizational unit (OU) that doesn't have any group policies applied.<!--Sources: 1) StorSimple best practices, "Group policy" (https://docs.microsoft.com/en-us/azure/storsimple/storsimple-ova-best-practices#group-policy; 2) "Block inheritance" (https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc731076(v=ws.11). 3) Or look through the Group policy tree.-->

1. If you can't connect to your device in an OU that doesn't have any group policies, it's time to run some diagnostics:

   1. In the local web UI for the device, go to **Troubleshooting**, and then to **Diagnostic test**. Run diagnostics and collect device logs.<!--SEE NOTES FROM 09/30 SYNC FOR GUIDANCE. "Tracking and event logging for your Azure Data Box and Azure Data Box Heavy import order" (https://docs.microsoft.com/en-us/azure/databox/data-box-logs#query-activity-logs-during-setup - MD:data-box-event-logs.md) doesn't discuss Smbserver.security event logs in the \etw folder.-->

   1. Review the `Smbserver.Security` event logs in the `etw` folder for an error similar to one of the errors identified (in bold) in the following sample entry.<!--1) Take a screenshot of the text in Word. 2) Make a quick check for other articles with log samples to see what text formats they use. 3) Add error text to search for in text. 4) Break the screenshots in two - one for each error?-->
   
      ```output
      SMB Session Authentication Failure
      Client Name: \\<ClientIP>
      Client Address: <ClientIP:Port>
      User Name:
      Session ID: 0x100000000021
      Status: *The attempted logon is invalid. This is either due to a bad username or authentication information.* (0xC000006D)
      SPN: session setup failed before the SPN could be queried
      SPN Validation Policy: SPN optional / no validation
      Guidance:
      You should expect this error when attempting to connect to shares using incorrect credentials.
      This error does not always indicate a problem with authorization, but mainly authentication. It is more common with non-Windows clients.
      This error can occur when using incorrect usernames and passwords with NTLM, mismatched LmCompatibility settings between client and server, an incorrect service principal name, duplicate Kerberos service principal names, incorrect Kerberos ticket-granting service tickets, or Guest accounts without Guest access enabled.
      You may also find the following error in the Smbserver.Security event logs :
      *LmCompatibilityLevel value is different from the default.*
      *Configured LM Compatibility Level: 5*
      *Default LM Compatibility Level: 3*
      Guidance:
      LAN Manager (LM) authentication is the protocol used to authenticate Windows clients for network operations. This includes joining a domain, accessing network resources, and authenticating users or computers. This determines which challenge/response authentication protocol is negotiated between the client and the server computers. Specifically, the LM authentication level determines which authentication protocols the client will try to negotiate or the server will accept. The value set for LmCompatibilityLevel determines which challenge/response authentication protocol is used for network logons. This value affects the level of authentication protocol that clients use, the level of session security negotiated, and the level of authentication accepted by servers.
      Value (Setting) - Description
      0 (Send LM & NTLM responses) - Clients use LM and NTLM authentication and never use NTLMv2 session security. Domain controllers accept LM, NTLM, and NTLMv2 authentication.
      1 (Send LM & NTLM - use NTLMv2 session security if negotiated) - Clients use LM and NTLM authentication, and use NTLMv2 session security if the server supports it. Domain controllers accept LM, NTLM, and NTLMv2 authentication.
      2 (Send NTLM response only) - Clients use NTLM authentication only and use NTLMv2 session security if the server supports it. Domain controllers accept LM, NTLM, and NTLMv2 authentication.
      3 (Send NTLM v2 response only) - Clients use NTLMv2 authentication only and use NTLMv2 session security if the server supports it. Domain controllers accept LM, NTLM, and NTLMv2 authentication.
      4 (Send NTLMv2 response only/refuse LM) - Clients use NTLMv2 authentication only and use NTLMv2 session security if the server supports it. Domain controllers refuse LM and accept only NTLM and NTLMv2 authentication.
      5 (Send NTLM v2 response only/refuse LM & NTLM) - Clients use NTLMv2 authentication only and use NTLMv2 session security if the server supports it. Domain controllers refuse LM and NTLM and accept only NTLMv2 authentication.
      Incompatibly configured LmCompatibility levels between a client and server (such as 0 on a client and 5 on a server) prevent access to the server. Non-Microsoft clients and servers also provide these configuration settings.
      ```     

 1.  If you find either of these errors in the `Smbserver.Security` event logs, do the following steps to resolve the issue:
 
     1. To open the Local Security Policy editor, start a PowerShell session, and run `secpol.msc`.

     1. Expand **Local Policies**, and go to **Security Options**. Then select **Network Security: LAN Manager authentication level**.

         ![Screenshot of Security Options with Network Security: LAN Manager authentication level selected](media/data-box-troubleshoot-device-connection/security-policy-01.png)

      1. To change the setting, select and click **Network Security: LAN Manager authentication level**. Then select **Send NTLMv2 response only. Refuse LM & NTLM**, and select **OK**.<!--Awkward wording. Check how registry updates are described elsewhere.-->

         ![Screenshot that shows the "Send NTLMv2 response only. Refuse LM & NTLM." option selected as the LAN Manager authentication level](media/data-box-troubleshoot-device-connection/security-policy-02.png)

1. If you can't change the LAN Manager authentication level using the Local Security Policy editor, use the Registry Editor to update the Registry directly:

    1. To open the Registry Editor, open a command prompt, and run `regedt32`.

    1. Go to **HKEY_LOCAL_MACHINE** > **SYSTEM** > **CurrentControlSet** > **Control** > **LSA**.

       ![Screenshot showing the location of the LSA folder in the Registry Editor](media/data-box-troubleshoot-device-connection/security-policy-03.png)

    1. In the **LSA** folder, select and click **LMCompatibilityLevel** to open a window for editing the value data.

    1. In **Value data**, change the setting to 5.

        ![Screenshot showing the dialog box for editing the value of a setting in Registry Editor](media/data-box-troubleshoot-device-connection/security-policy-04.png)

    1. Restart your computer so that the Registry changes take effect.

1. Connect to the share.

## Next steps

- [Copy data via SMB](data-box-deploy-copy-data.md)
- [Copy data via network-attached storage (NAS)](data-box-deploy-copy-data-via-copy-service.md)