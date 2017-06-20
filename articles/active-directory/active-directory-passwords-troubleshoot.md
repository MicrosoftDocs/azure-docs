---
title: 'Troubleshoot: Azure AD SSPR | Microsoft Docs'
description: Troubleshooting Azure AD self-service password reset
services: active-directory
keywords: 
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/26/2017
ms.author: joflore

---

# How to troubleshoot self-service password reset

If you are having issues with self-service password reset, the items that follow may help you to get things working quickly.

## Troubleshoot password reset configuration in the Azure portal

| **Error** | Solution |
| --- | --- |
| I do not see the **Password Reset** section under Azure AD in the Azure portal | This can happen if you do not have an Azure AD Premium or Basic license assigned to the administrator performing the operation. <br> This can be resolved by assigning a license to the administrator account in question using the article [Assign, verify, and resolve problems with licenses](active-directory-licensing-group-assignment-azure-portal.md#step-1-assign-the-required-licenses) |
| I don't see a particular configuration option | Many elements of the UI are hidden until needed. Try enabling all the options you want to see. |
| I don't see the **On-premises integration** tab | This option only becomes visible if you have downloaded Azure AD Connect and configured password writeback. For more information about this topic, see the article [Getting started with Azure AD Connect using express settings](/connect/active-directory-aadconnect-get-started-express.md). |

## Troubleshoot password reset reporting

| **Error** | Solution |
| --- | --- |
| I don’t see any password management activity types appear in the **Self-Service Password Management** audit event category | This can happen if you do not have an Azure AD Premium or Basic license assigned to the administrator performing the operation. <br> This can be resolved by assigning a license to the administrator account in question using the article [Assign, verify, and resolve problems with licenses] |
| User registrations show multiple times | Currently, when a user registers, we currently log each individual piece of data that is registered as a separate event. <br> If you want to aggregate this data, you can download the report and open the data as a pivot table in excel to have more flexibility.

## Troubleshoot password reset registration portal

| **Error** | Solution |
| --- | --- |
| Directory is not enabled for password reset **Your administrator has not enabled you to use this feature** | Switch the **Self service password reset enabled** flag to **A group** or **Everybody** and click **Save** |
| User does not have an Azure AD Premium or Basic license assigned **Your administrator has not enabled you to use this feature** | This can happen if you do not have an Azure AD Premium or Basic license assigned to the administrator performing the operation. <br> This can be resolved by assigning a license to the administrator account in question using the article [Assign, verify, and resolve problems with licenses](active-directory-licensing-group-assignment-azure-portal.md#step-1-assign-the-required-licenses) |
| Error processing request | This can be caused by many issues, but generally this error is caused by either a service outage or configuration issue. If you see this error and it is impacting your business, contact Microsoft support for additional assistance. |

## Troubleshoot password reset portal

| **Error** | Solution |
| --- | --- |
| Directory is not enabled for password reset. | Switch the **Self service password reset enabled** flag to **A group** or **Everybody** and click **Save** |
| User does not have an Azure AD Premium or Basic license assigned | This can happen if you do not have an Azure AD Premium or Basic license assigned to the administrator performing the operation. <br> This can be resolved by assigning a license to the administrator account in question using the article [Assign, verify, and resolve problems with licenses](active-directory-licensing-group-assignment-azure-portal.md#step-1-assign-the-required-licenses) |
| Directory is enabled for password reset, but user has missing or mal-formed authentication information | Ensure that user has properly formed contact data on file in the directory before proceeding. For more information about this topic, see the article [Data used by Azure AD Self-Service Password Reset](active-directory-passwords-data.md). |
| Directory is enabled for password reset, but a user only has one piece of contact data on file when policy is set to require two verification steps | Ensure that user has at least two properly configured contact methods (Example: Mobile Phone **and** Office Phone) before proceeding. |
| Directory is enabled for password reset, and user is properly configured, but user is unable to be contacted | This could be the result of a temporary service error or incorrect contact data that we could not properly detect. <br> <br> If the user waits 10 seconds, a try again and “contact your administrator” link appears. Clicking try again retries the call, whereas clicking “contact your administrator” sends a form email to administrators requesting a password reset to be performed for that user account. |
| User never receives the password reset SMS or phone call | This could be the result of a mal-formed phone number in the directory. Make sure the phone number is in the format “+ccc xxxyyyzzzzXeeee”. <br> <br> Password reset does not support extensions, even if you specify one in the directory (they are stripped before the call is dispatched). Try using a number without an extension, or integrating the extension into the phone number in your PBX. |
| User never receives password reset email | The most common cause for this issue is that the message is rejected by a spam filter. Check your spam, junk, or deleted items folder for the email. <br> Also ensure that you are checking the right email for the message. |
| I have set a password reset policy, but when an admin account uses password reset, that policy is not applied | Microsoft manages and controls the administrator password reset policy to ensure the highest level of security. |
| User prevented from attempting password reset too many times in a day | We implement an automatic throttling mechanism to block users from attempting to reset their passwords too many times in a short period of time. This occurs when: <br> 1. User attempts to validate a phone number 5 times in one hour. <br> 2. User attempts to use the security questions gate 5 times in one hour. <br> 3. User attempts to reset a password for the same user account 5 times in one hour. <br> To fix this, instruct the user to wait 24 hours after the last attempt, and the user will then be able to reset their password. |
| User sees an error when validating their phone number | This error occurs when the phone number entered does not match the phone number on file. Make sure the user is entering the complete phone number, including area and country code, when attempting to use a phone-based method for password reset. |
| Error processing request | This can be caused by many issues, but generally this error is caused by either a service outage or configuration issue. If you see this error and it is impacting your business, contact Microsoft support for additional assistance. |

## Troubleshoot password writeback

| **Error** | Solution |
| --- | --- |
| Password reset service does not start on premises with error 6800 in the Azure AD Connect machine’s application event log. <br> <br> After onboarding, federated or password hash synchronized users cannot reset their passwords. | When Password Writeback is enabled, the sync engine calls the writeback library to perform the configuration (onboarding) by talking to the cloud onboarding service. Any errors encountered during onboarding or while starting the WCF endpoint for Password Writeback results in errors in the Event log in your Azure AD Connect machine’s event log. <br> <br> During restart of ADSync service, if writeback was configured, the WCF endpoint is started up. However, if the startup of the endpoint fails, we will log event 6800 and let the sync service startup. Presence of this event means that the Password Writeback endpoint was not started up. Event log details for this event (6800) along with event log entries generate by PasswordResetService component indicates why the endpoint could not be started up. Review these event log errors and try to restart the Azure AD Connect if Password Writeback still isn’t working. If the problem persists, try to disable and re-enable Password Writeback.
| When a user attempts to reset a password or unlock an account with password writeback enabled, the operation fails. <br> <br> In addition, you see an event in the Azure AD Connect event log containing: “Synchronization Engine returned an error hr=800700CE, message=The filename or extension is too long” after the unlock operation occurs. | Find the Active Directory account for Azure AD Connect and reset the password to contain no more than 127 characters. Then open Synchronization Service from the Start menu. Navigate to Connectors and find the Active Directory Connector. Select it and click Properties. Navigate to the page Credentials and enter the new password. Select OK to close the page. |
| At the last step of the Azure AD Connect installation process, you see an error indicating that Password Writeback could not be configured. <br> <br> The Azure AD Connect Application event log contains error 32009 with text “Error getting auth token”. | This error occurs in the following two cases:<br> <br> a. You have specified an incorrect password for the global administrator account specified at the beginning of the Azure AD Connect installation process.<br> b. You have attempted to use a federated user for the global administrator account specified at the beginning of the Azure AD Connect installation process.<br> <br> To fix this error, ensure that you are not using a federated account for the global administrator you specified at the beginning of the Azure AD Connect installation process, and that the password specified is correct. |
| The Azure AD Connect machine event log contains error 32002 thrown by the PasswordResetService. <br> <br> The error reads: “Error Connecting to ServiceBus, The token provider was unable to provide a security token…” | Your on-premises environment is not able to connect to the service bus endpoint in the cloud. This error is normally caused by a firewall rule blocking an outbound connection to a particular port or web address. See [Network requirements](active-directory-passwords-how-it-works.md#network-requirements) for more info. Once you have updated these rules, reboot the Azure AD Connect machine and Password Writeback should start working again. |
| After working for some time, federated or password hash synchronized users cannot reset their passwords. | In some rare cases, the Password Writeback service may fail to restart when Azure AD Connect has restarted. In these cases, first, check whether Password Writeback appears to be enabled on-prem. This can be done using the Azure AD Connect wizard or powershell (See HowTos section above).If the feature appears to be enabled, try enabling or disabling the feature again either through the UI or PowerShell. If this doesn’t work, try completely uninstalling and reinstalling Azure AD Connect. |
| Federated or password hash synchronized users who attempt to reset their passwords see an error after submitting the password indicating there was a service problem. <br ><br> In addition to this, during password reset operations, you may see an error regarding management agent was denied access in your on premises event logs. | If you see these errors in your event log, confirm that the AD MA account (that was specified in the wizard at the time of configuration) has the necessary permissions for password writeback. <br> <br> **Once this permission is given, it can take up to 1 hour for the permissions to trickle down via sdprop background task on the DC.** <br> <br> For password reset to work, the permission needs to be stamped on the security descriptor of the user object whose password is being reset. Until this permission shows up on the user object, password reset continues to fail with access denied. |
| Unable to reset password for users in special groups such as Domain Admins or Enterprise Admins | Privileged users in Active Directory are protected using AdminSDHolder. For more information, see [http://technet.microsoft.com/magazine/2009.09.sdadminholder.aspx](http://technet.microsoft.com/magazine/2009.09.sdadminholder.aspx) for more details. <br> <br> This means the security descriptors on these objects are periodically checked to match the one specified in AdminSDHolder and are reset if they are different. The additional permissions that are needed for Password Writeback therefore do not trickle to such users. This can result in Password Writeback not working for such users. As a result, **we do not support managing passwords for users within these groups because it breaks the AD security model.**
| Federated or password hash synchronized users who attempt to reset their passwords see an error after submitting the password indicating there was a service problem. <br> <br> In addition to this, during password reset operations, you may see an error in your event logs from the Azure AD Connect service indicating an “Object could not be found” error. | This error usually indicates that the sync engine is unable to find either the user object in the AAD connector space or the linked MV or AD connector space object. <br> <br> To troubleshoot this, make sure that the user is indeed synchronized from on-prem to AAD via the current instance of Azure AD Connect and inspect the state of the objects in the connector spaces and MV. Confirm that the AD CS object is connector to the MV object via the “Microsoft.InfromADUserAccountEnabled.xxx” rule.|
| Federated or password hash synchronized users who attempt to reset their passwords see an error after submitting the password indicating there was a service problem. <br> <br> In addition to this, during password reset operations, you may see an error in your event logs from the Azure AD Connect service indicating a “Multiple matches found” error. | This indicates that the sync engine detected that the MV object is connected to more than one AD CS objects via the “Microsoft.InfromADUserAccountEnabled.xxx”. This means that the user has an enabled account in more than one forest. **This scenario is not supported for password writeback.** |
| Password operations fail with a configuration error. The application event log contains <br> <br> Azure AD Connect error 6329 with text: 0x8023061f (The operation failed because password synchronization is not enabled on this Management Agent.) | This occurs if the Azure AD Connect configuration is changed to add a new AD forest (or to remove and readd an existing forest) after the Password Writeback feature has already been enabled. Password operations for users in such newly added forests fail. To fix the problem, disable and re-enable the Password Writeback feature after the forest configuration changes have been completed. |

## Password writeback event log error codes

A best practice when troubleshooting issues with Password Writeback is to inspect that Application Event Log on your Azure AD Connect machine. This event log contains events from two sources of interest for Password Writeback. The PasswordResetService source describes operations and issues related to the operation of Password Writeback. The ADSync source describes operations and issues related to setting passwords in your AD environment.

### Source of event is ADSync

| Code | Name/Message | Description |
| --- | --- | --- |
| 6329 | BAIL: MMS(4924) 0x80230619 – “A restriction prevents the password from being changed to the current one specified.” | This event occurs when the Password Writeback service attempts to set a password on your local directory that does not meet the password age, history, complexity, or filtering requirements of the domain. <br> <br> If you have a minimum password age, and have recently changed the password within that window of time, you are not able to change the password again until it reaches the specified age in your domain. For testing purposes, minimum age should be set to 0. <br> <br> If you have password history requirements enabled, then you must select a password that has not been used in the last N times, where N is the password history setting. If you do select a password that has been used in the last N times, then you see a failure in this case. For testing purposes, history should be set to 0. <br> <br> If you have password complexity requirements, all of them are enforced when the user attempts to change or reset a password. <br> <br> If you have password filters enabled, and a user selects a password that does not meet the filtering criteria, then the reset or change operation fails. |
| HR 8023042 | Synchronization Engine returned an error hr=80230402, message=An attempt to get an object failed because there are duplicated entries with the same anchor | This event occurs when the same user id is enabled in multiple domains. For example, if you are syncing Account/Resource forests, and have the same user id present and enabled in each, this error may occur. <br> <br> This error can also occur if you are using a non-unique anchor attribute (like alias or UPN) and two users share that same anchor attribute. <br> <br> To resolve this issue, ensure that you do not have any duplicated users within your domains and that you are using a unique anchor attribute for each user. |

### Source of event is PasswordResetService

| Code | Name/Message | Description |
| --- | --- | --- |
| 31001 | PasswordResetStart | This event indicates that the on-premises service detected a password reset request for a federated or password hash synchronized user originating from the cloud. This event is the first event in every password reset writeback operation. |
| 31002 | PasswordResetSuccess | This event indicates that a user selected a new password during a password reset operation, we determined that this password meets corporate password requirements, and that password has been successfully written back to the local AD environment. |
| 31003 | PasswordResetFail | This event indicates that a user selected a password, and that password arrived successfully to the on-premises environment, but when we attempted to set the password in the local AD environment, a failure occurred. This can happen for several reasons: <br> <br> The user’s password does not meet the age, history, complexity, or filter requirements for the domain. Try a completely new password to resolve this. <br> <br> The MA service account does not have the appropriate permissions to set the new password on the user account in question. <br> <br> The user’s account is in a protected group, such as domain or enterprise admins, which disallows password set operations. |
| 31004 | OnboardingEventStart | This event occurs if you enable Password Writeback with Azure AD Connect and indicates that we started onboarding your organization to the Password Writeback web service. |
| 31005 | OnboardingEventSuccess | This event indicates the onboarding process was successful and that Password Writeback capability is ready to use. |
| 31006 | ChangePasswordStart | This event indicates that the on-premises service detected a password change request for a federated or password hash synchronized user originating from the cloud. This event is the first event in every password change writeback operation. |
| 31007 | ChangePasswordSuccess | This event indicates that a user selected a new password during a password change operation, we determined that this password meets corporate password requirements, and that password has been successfully written back to the local AD environment. |
| 31008 | ChangePasswordFail | This event indicates that a user selected a password, and that password arrived successfully to the on-premises environment, but when we attempted to set the password in the local AD environment, a failure occurred. This can happen for several reasons: <br> <br> The user’s password does not meet the age, history, complexity, or filter requirements for the domain. Try a completely new password to resolve this. <br> <br> The MA service account does not have the appropriate permissions to set the new password on the user account in question. <br> <br> The user’s account is in a protected group, such as domain or enterprise admins, which disallows password set operations. |
| 31009 | ResetUserPasswordByAdminStart | The on-premises service detected a password reset request for a federated or password hash synchronized user originating from the administrator on behalf of a user. This event is the first event in every admin-initiated password reset writeback operation. |
| 31010 | ResetUserPasswordByAdminSuccess | The admin selected a new password during an admin-initiated password reset operation, we determined that this password meets corporate password requirements, and that password has been successfully written back to the local AD environment. |
| 31011 | ResetUserPasswordByAdminFail | The admin selected a password on behalf of a user, and that password arrived successfully to the on-premises environment, but when we attempted to set the password in the local AD environment, a failure occurred. This can happen for several reasons: <br> <br> The user’s password does not meet the age, history, complexity, or filter requirements for the domain. Try a completely new password to resolve this. <br> <br> The MA service account does not have the appropriate permissions to set the new password on the user account in question. <br> <br> The user’s account is in a protected group, such as domain or enterprise admins, which disallows password set operations. |
| 31012 | OffboardingEventStart | This event occurs if you disable Password Writeback with Azure AD Connect and indicates that we started offboarding your organization to the Password Writeback web service. |
| 31013| OffboardingEventSuccess| This event indicates the offboarding process was successful and that Password Writeback capability has been successfully disabled. |
| 31014| OffboardingEventFail| This event indicates the offboarding process was not successful. This could be due to a permissions error on the cloud or on-premises administrator account specified during configuration, or because you are attempting to use a federated cloud global administrator when disabling Password Writeback. To fix this, check your administrative permissions and that you are not using any federated account while configuring the Password Writeback capability.|
| 31015| WriteBackServiceStarted| This event indicates that the Password Writeback service has started successfully and is ready to accept password management requests from the cloud.|
| 31016| WriteBackServiceStopped| This event indicates that the Password Writeback service has stopped and that any password management requests from the cloud will not be successful.|
| 31017| AuthTokenSuccess| This event indicates that we successfully retrieved an authorization token for the global admin specified during Azure AD Connect setup to start the offboarding or onboarding process.|
| 31018| KeyPairCreationSuccess| This event indicates that we successfully created the password encryption key that is used to encrypt passwords from the cloud to be sent to your on-premises environment.|
| 32000| UnknownError| This event indicates an unknown error during a password management operation. Look at the exception text in the event for more details. If you are having problems, try disabling and re-enabling Password Writeback. If this does not help, include a copy of your event log along with the tracking id specified insider to your support engineer.|
| 32001| ServiceError| This event indicates there was an error connecting to the cloud password reset service, and generally occurs when the on-premises service was unable to connect to the password reset web service.|
| 32002| ServiceBusError| This event indicates there was an error connecting to your tenant’s service bus instance. This could happen because you are blocking outbound connections in your on-premises environment. Check your firewall to ensure you allow connections over TCP 443 and to https://ssprsbprodncu-sb.accesscontrol.windows.net/, and try again. If you are still having problems, try disabling and re-enabling Password Writeback.|
| 32003| InPutValidationError| This event indicates that the input passed to our web service API was invalid. Try the operation again.|
| 32004| DecryptionError| This event indicates that there was an error decrypting the password that arrived from the cloud. This could be because of a decryption key mismatch between the cloud service and your on-premises environment. To resolve this, disable and re-enable Password Writeback in your on-premises environment.|
| 32005| ConfigurationError| During onboarding, we save tenant-specific information in a configuration file in your on-premises environment. This event indicates there was an error saving this file or that when the service was started there was an error reading the file. To fix this issue, try disabling and re-enabling Password Writeback to force a rewrite of this configuration file.|
| 32007| OnBoardingConfigUpdateError| During onboarding, we send data from the cloud to the on-premises password reset service. That data is then written to an in-memory file before being sent to the sync service to store this information securely on disk. This event indicates a problem with writing or updating that data in memory. To fix this issue, try disabling and re-enabling Password Writeback to force a rewrite of this configuration.|
| 32008| ValidationError| This event indicates we received an invalid response from the password reset web service. To fix this issue, try disabling and re-enabling Password Writeback.|
| 32009| AuthTokenError| This event indicates that we could not get an authorization token for the global administrator account specified during Azure AD Connect setup. This error can be caused by a bad username or password specified for the global admin account or because the global admin account specified is federated. To fix this issue, rerun configuration with the correct username and password and ensure the administrator is a managed (cloud-only or password-synchronized) account.|
| 32010| CryptoError| This event indicates there was an error when generating the password encryption key or decrypting a password that arrives from the cloud service. This error likely indicates an issue with your environment. Look at the details of your event log to learn more and resolve this issue. You may also try disabling and re-enabling the Password Writeback service to resolve this.|
| 32011| OnBoardingServiceError| This event indicates that the on-premises service could not properly communicate with the password reset web service to initiate the onboarding process. This may be because of a firewall rule or problem getting an auth token for your tenant. To fix this, ensure that you are not blocking outbound connections over TCP 443 and TCP 9350-9354 or to https://ssprsbprodncu-sb.accesscontrol.windows.net/, and that the AAD admin account you are using to onboard is not federated.|
| 32013| OffBoardingError| This event indicates that the on-premises service could not properly communicate with the password reset web service to initiate the offboarding process. This may be because of a firewall rule or problem getting an authorization token for your tenant. To fix this, ensure that you are not blocking outbound connections over 443 or to https://ssprsbprodncu-sb.accesscontrol.windows.net/, and that the AAD admin account you are using to offboard is not federated.|
| 32014| ServiceBusWarning| This event indicates that we had to retry to connect to your tenant’s service bus instance. Under normal conditions, this should not be a concern, but if you see this event many times, consider checking your network connection to service bus, especially if it’s a high latency or low-bandwidth connection.|
| 32015| ReportServiceHealthError| In order to monitor the health of your Password Writeback service, we send heartbeat data to our password reset web service every 5 minutes. This event indicates that there was an error when sending this health information back to the cloud web service. This health information does not include an OII or PII data, and is purely a heartbeat and basic service statistics so that we can provide service status information in the cloud.|
| 33001| ADUnKnownError| This event indicates that there was an unknown error returned by AD, check the Azure AD Connect server event log for events from the ADSync source for more information about this error.|
| 33002| ADUserNotFoundError| This event indicates that the user who is trying to reset or change a password was not found in the on-premises directory. This could occur when the user has been deleted on-premises but not in the cloud, or if there is an issue with sync. Check your sync logs, and the last few sync run details for more information.|
| 33003| ADMutliMatchError| When a password reset or change request originates from the cloud, we use the cloud anchor specified during the setup process of Azure AD Connect to determine how to link that request back to a user in your on-premises environment. This event indicates that we found two users in your on-premises directory with the same cloud anchor attribute. Check your sync logs, and the last few sync run details for more information.|
| 33004| ADPermissionsError| This event indicates that the Management Agent service account does not have the appropriate permissions on the account in question to set a new password. Ensure that the MA account in the user’s forest has Reset and Change password permissions on all objects in the forest. For more information on how do to this, see Step 4: Set up the appropriate Active Directory permissions.|
| 33005| ADUserAccountDisabled| This event indicates that we attempted to reset or change a password for an account that was disabled on premises. Enable the account and try the operation again.|
| 33006| ADUserAccountLockedOut| Event indicates that we attempted to reset or change a password for an account that was locked out on premises. Lockouts can occur when a user has tried a change or reset password operation too many times in a short period. Unlock the account and try the operation again.|
| 33007| ADUserIncorrectPassword| This event indicates that the user specified an incorrect current password when performing a password change operation. Specify the correct current password and try again.|
| 33008| ADPasswordPolicyError| This event occurs when the Password Writeback service attempts to set a password on your local directory that does not meet the password age, history, complexity, or filtering requirements of the domain. <br> <br> If you have a minimum password age, and have recently changed the password within that window of time, you are not able to change the password again until it reaches the specified age in your domain. For testing purposes, minimum age should be set to 0. <br> <br> If you have password history requirements enabled, then you must select a password that has not been used in the last N times, where N is the password history setting. If you do select a password that has been used in the last N times, then you see a failure in this case. For testing purposes, history should be set to 0. <br> <br> If you have password complexity requirements, all of them are enforced when the user attempts to change or reset a password. <br> <br> If you have password filters enabled, and a user selects a password that does not meet the filtering criteria, then the reset or change operation fails.|
| 33009| ADConfigurationError| This event indicates there was an issue writing a password back to your on-premises directory due to a configuration issue with Active Directory. Check the Azure AD Connect machine’s Application event log for messages from the ADSync service for more information on what error occurred.|


## Troubleshoot Password Writeback connectivity

If you are experiencing service interruptions with the Password Writeback component of Azure AD Connect, here are some quick steps you can take to resolve this:

* [Restart the Azure AD Connect Sync Service](#restart-the-azure-AD-Connect-sync-service)
* [Disable and re-enable the Password Writeback feature](#disable-and-re-enable-the-password-writeback-feature)
* [Install the latest Azure AD Connect release](#install-the-latest-azure-ad-connect-release)
* [Troubleshoot Password Writeback](#troubleshoot-password-writeback)

In general, we recommend that you execute these steps in the order above to recover your service in the most rapid manner.

### Restart the Azure AD Connect Sync Service

Restarting the Azure AD Connect Sync Service can help to resolve connectivity issues or other transient issues with the service.

1. As an administrator, click **Start** on the server running **Azure AD Connect**.
2. Type **“services.msc”** in the search box and press **Enter**.
3. Look for the **Microsoft Azure AD Sync** entry.
4. Right-click on the service entry, click **Restart**, and wait for the operation to complete.

   ![Restart the Azure AD Sync service][Service Restart]

These steps re-establish your connection with the cloud service and resolve any interruptions you may be experiencing. If restarting the Sync Service does not resolve your issue, we recommend that you try to disable and re-enable the Password Writeback feature as a next step.

### Disable and re-enable the Password Writeback feature

Disabling and re-enabling the Password Writeback feature can help to resolve connectivity issues.

1. As an administrator, open the **Azure AD Connect configuration wizard**.
2. On the **Connect to Azure AD** dialog, enter your **Azure AD global admin credentials**
3. On the **Connect to AD DS** dialog, enter your **AD Domain Services admin credentials**.
4. On the **Uniquely identifying your users** dialog, click the **Next** button.
5. On the **Optional features** dialog, uncheck the **Password writeback** checkbox.
6. Click **Next** through the remaining dialog pages without changing anything until you get to the **Ready to configure** page.
7. Ensure that the configure page shows the **Password writeback option as disabled** and then click the green **Configure** button to commit your changes.
8. On the **Finished** dialog, deselect the **Synchronize now** option, and then click **Finish** to close the wizard.
9. Reopen the **Azure AD Connect configuration wizard**.
10. **Repeat steps 2-8**, except ensure you **check the Password writeback option** on the **Optional features** screen to re-enable the service.

These steps re-establish your connection with our cloud service and resolve interruptions you may be experiencing.

If disabling and re-enabling the Password Writeback feature does not resolve your issue, we recommend that you try to reinstall Azure AD Connect as a next step.

### Install the latest Azure AD Connect release

Reinstalling Azure AD Connect can resolve configuration and connectivity issues between our cloud services and your local AD environment.

We recommend, you perform this step only after attempting the first two steps described above.

> [!WARNING]
> If you have customized the out of box sync rules, **back these up before proceeding with upgrade and manually redeploy them after you are finished**.

1. Download the latest version of Azure AD Connect from the [Microsoft Download Center](http://go.microsoft.com/fwlink/?LinkId=615771).
2. Since you have already installed Azure AD Connect, you need to perform an in-place upgrade to update your Azure AD Connect installation to the latest version.
3. Execute the downloaded package and follow the on-screen instructions to update your Azure AD Connect machine.

These steps re-establish your connection with our cloud service and resolve any interruptions you may be experiencing.

If installing the latest version of the Azure AD Connect server does not resolve your issue, we recommend that you try disabling and re-enabling Password Writeback as a final step after installing the latest release.

## Azure AD forums

If you have a general question about Azure AD and self-service password reset, you can ask the community for assistance on the [Azure AD forums](https://social.msdn.microsoft.com/Forums/en-US/home?forum=WindowsAzureAD). Members of the community include Engineers, Product Managers, MVPs, and fellow IT Professionals.

## Contact Microsoft support

If you can't find the answer to an issue our support teams are always available to assist you further.

To properly assist, we ask that you provide as much detail as possible when opening a case including:

* **General description of the error** - What is the error? What was the behavior that was noticed? How can we reproduce the error? Please provide as much detail as possible.
* **Page** - What page were you on when you noticed the error? Please include the URL if you are able to and a screenshot.
* **Date, time, and timezone** - Please include the precise date and time **with the timezone** that the error occurred.
* **Support code** - What was the support code generated when the user saw the error? 
    * To find this, reproduce the error, then click the Support Code link at the bottom of the screen and send the support engineer the GUID that results.
    * If you are on a page without a support code at the bottom, press F12 and search for SID and CID and send those two results to the support engineer.
* **User ID** - Who was the user who saw the error? (user@contoso.com)
    * Is this a federated user?
    * Is this a password hash synchronized user?
    * Is this a cloud only user?
* **Licensing** - Does the user have an Azure AD Premium or Azure AD Basic license assigned?
* **Application event log** - If you are using password writeback and the error is in you on-premises infrastructure, include a zipped copy of your application event log from the Azure AD Connect server when contacting support.

[Service Restart]: ./media/active-directory-passwords-troubleshoot/servicerestart.png "Restart the Azure AD Sync service"

## Next steps

The following links provide additional information regarding password reset using Azure AD

* [**Quick Start**](active-directory-passwords-getting-started.md) - Get up and running with Azure AD self service password management 
* [**Licensing**](active-directory-passwords-licensing.md) - Configure your Azure AD Licensing
* [**Data**](active-directory-passwords-data.md) - Understand the data that is required and how it is used for password management
* [**Rollout**](active-directory-passwords-best-practices.md) - Plan and deploy SSPR to your users using the guidance found here
* [**Customize**](active-directory-passwords-customize.md) - Customize the look and feel of the SSPR experience for your company.
* [**Policy**](active-directory-passwords-policy.md) - Understand and set Azure AD password policies
* [**Password Writeback**](active-directory-passwords-writeback.md) - How does password writeback work with your on-premises directory
* [**Reporting**](active-directory-passwords-reporting.md) - Discover if, when, and where your users are accessing SSPR functionality
* [**Technical Deep Dive**](active-directory-passwords-how-it-works.md) - Go behind the curtain to understand how it works
* [**Frequently Asked Questions**](active-directory-passwords-faq.md) - How? Why? What? Where? Who? When? - Answers to questions you always wanted to ask
