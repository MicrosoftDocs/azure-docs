---
title: Troubleshoot self-service password reset writeback- Azure Active Directory
description: Learn how to troubleshoot common problems and resolution steps for self-service password reset writeback in Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: troubleshooting
ms.date: 08/26/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: rhicock

ms.collection: M365-identity-device-management
---
# Troubleshoot self-service password reset writeback in Azure Active Directory


## Troubleshoot password writeback

| Error | Solution |
| --- | --- |
| The password reset service does not start on-premises. Error 6800 appears in the Azure AD Connect machine’s application event log. <br> <br> After onboarding, federated, pass-through authentication, or password-hash-synchronized users can't reset their passwords. | When password writeback is enabled, the sync engine calls the writeback library to perform the configuration (onboarding) by communicating to the cloud onboarding service. Any errors encountered during onboarding or while starting the Windows Communication Foundation (WCF) endpoint for password writeback results in errors in the event log, on your Azure AD Connect machine. <br> <br> During restart of the Azure AD Sync (ADSync) service, if writeback was configured, the WCF endpoint starts up. But, if the startup of the endpoint fails, we will log event 6800 and let the sync service start up. The presence of this event means that the password writeback endpoint did not start up. Event log details for this event 6800, along with event log entries generate by the PasswordResetService component, indicate why you can't start up the endpoint. Review these event log errors and try to restart the Azure AD Connect if password writeback still isn’t working. If the problem persists, try to disable and then re-enable password writeback.
| When a user attempts to reset a password or unlock an account with password writeback enabled, the operation fails. <br> <br> In addition, you see an event in the Azure AD Connect event log that contains: “Synchronization Engine returned an error hr=800700CE, message=The filename or extension is too long” after the unlock operation occurs. | Find the Active Directory account for Azure AD Connect and reset the password so that it contains no more than 256 characters. Then open the **Synchronization Service** from the **Start** menu. Browse to **Connectors** and find the **Active Directory Connector**. Select it and then select **Properties**. Browse to the **Credentials** page and enter the new password. Select **OK** to close the page. |
| At the last step of the Azure AD Connect installation process, you see an error indicating that password writeback couldn't be configured. <br> <br> The Azure AD Connect application event log contains error 32009 with the text “Error getting auth token.” | This error occurs in the following two cases: <br><ul><li>You have specified an incorrect password for the global administrator account specified at the beginning of the Azure AD Connect installation process.</li><li>You have attempted to use a federated user for the global administrator account specified at the beginning of the Azure AD Connect installation process.</li></ul> To fix this problem, ensure that you're not using a federated account for the global administrator you specified at the beginning of the installation process. Also ensure that the password specified is correct. |
| The Azure AD Connect machine event log contains error 32002 that is thrown by running PasswordResetService. <br> <br> The error reads: “Error Connecting to ServiceBus. The token provider was unable to provide a security token.” | Your on-premises environment isn't able to connect to the Azure Service Bus endpoint in the cloud. This error is normally caused by a firewall rule blocking an outbound connection to a particular port or web address. See [Connectivity prerequisites](../hybrid/how-to-connect-install-prerequisites.md) for more info. After you have updated these rules, reboot the Azure AD Connect machine and password writeback should start working again. |
| After working for some time, federated, pass-through authentication, or password-hash-synchronized users can't reset their passwords. | In some rare cases, the password writeback service can fail to restart when Azure AD Connect has restarted. In these cases, first, check whether password writeback appears to be enabled on-premises. You can check by using either the Azure AD Connect wizard or PowerShell (See the previous HowTos section). If the feature appears to be enabled, try enabling or disabling the feature again either through the UI or PowerShell. If this doesn’t work, try a complete uninstall and reinstall of Azure AD Connect. |
| Federated, pass-through authentication, or password-hash-synchronized users who attempt to reset their passwords see an error after attempting to submit their password. The error indicates that there was a service problem. <br ><br> In addition to this problem, during password reset operations, you might see an error that the management agent was denied access in your on-premises event logs. | If you see these errors in your event log, confirm that the Active Directory Management Agent (ADMA) account that was specified in the wizard at the time of configuration has the necessary permissions for password writeback. <br> <br> After this permission is given, it can take up to one hour for the permissions to trickle down via the `sdprop` background task on the domain controller (DC). <br> <br> For password reset to work, the permission needs to be stamped on the security descriptor of the user object whose password is being reset. Until this permission shows up on the user object, password reset continues to fail with an access denied message. |
| Federated, pass-through authentication, or password-hash-synchronized users who attempt to reset their passwords, see an error after they submit their password. The error indicates that there was a service problem. <br> <br> In addition to this problem, during password reset operations, you might see an error in your event logs from the Azure AD Connect service indicating an “Object could not be found” error. | This error usually indicates that the sync engine is unable to find either the user object in the Azure AD connector space or the linked metaverse (MV) or Azure AD connector space object. <br> <br> To troubleshoot this problem, make sure that the user is indeed synchronized from on-premises to Azure AD via the current instance of Azure AD Connect and inspect the state of the objects in the connector spaces and MV. Confirm that the Active Directory Certificate Services (AD CS) object is connected to the MV object via the “Microsoft.InfromADUserAccountEnabled.xxx” rule.|
| Federated, pass-through authentication, or password-hash-synchronized users who attempt to reset their passwords see an error after they submit their password. The error indicates that there was a service problem. <br> <br> In addition to this problem, during password reset operations, you might see an error in your event logs from the Azure AD Connect service that indicates that there is a “Multiple matches found” error. | This indicates that the sync engine detected that the MV object is connected to more than one AD CS object via “Microsoft.InfromADUserAccountEnabled.xxx”. This means that the user has an enabled account in more than one forest. This scenario isn't supported for password writeback. |
| Password operations fail with a configuration error. The application event log contains Azure AD Connect error 6329 with the text "0x8023061f (The operation failed because password synchronization is not enabled on this Management Agent)". | This error occurs if the Azure AD Connect configuration is changed to add a new Active Directory forest (or to remove and readd an existing forest) after the password writeback feature has already been enabled. Password operations for users in these recently added forests fail. To fix the problem, disable and then re-enable the password writeback feature after the forest configuration changes have been completed. |

## Password writeback event-log error codes

A best practice when you troubleshoot problems with password writeback is to inspect the application event log, on your Azure AD Connect machine. This event log contains events from two sources of interest for password writeback. The PasswordResetService source describes operations and problems related to the operation of password writeback. The ADSync source describes operations and problems related to setting passwords in your Active Directory environment.

### If the source of the event is ADSync

| Code | Name or message | Description |
| --- | --- | --- |
| 6329 | BAIL: MMS(4924) 0x80230619: “A restriction prevents the password from being changed to the current one specified.” | This event occurs when the password writeback service attempts to set a password on your local directory that does not meet the password age, history, complexity, or filtering requirements of the domain. <br> <br> If you have a minimum password age and have recently changed the password within that window of time, you're not able to change the password again until it reaches the specified age in your domain. For testing purposes, the minimum age should be set to 0. <br> <br> If you have password history requirements enabled, then you must select a password that has not been used in the last *N* times, where *N* is the password history setting. If you do select a password that has been used in the last *N* times, then you see a failure in this case. For testing purposes, the password history should be set to 0. <br> <br> If you have password complexity requirements, all of them are enforced when the user attempts to change or reset a password. <br> <br> If you have password filters enabled and a user selects a password that does not meet the filtering criteria, then the reset or change operation fails. |
| 6329 | MMS(3040): admaexport.cpp(2837): The server does not contain the LDAP password policy control. | This problem occurs if LDAP_SERVER_POLICY_HINTS_OID control (1.2.840.113556.1.4.2066) isn't enabled on the DCs. To use the password writeback feature, you must enable the control. To do so, the DCs must be on Windows Server 2008R2 or later. |
| HR 8023042 | Synchronization Engine returned an error hr=80230402, message=An attempt to get an object failed because there are duplicated entries with the same anchor. | This error occurs when the same user ID is enabled in multiple domains. An example is if you're syncing account and resource forests and have the same user ID present and enabled in each forest. <br> <br> This error can also occur if you use a non-unique anchor attribute, like an alias or UPN, and two users share that same anchor attribute. <br> <br> To resolve this problem, ensure that you don't have any duplicated users within your domains and that you use a unique anchor attribute for each user. |

### If the source of the event is PasswordResetService

| Code | Name or message | Description |
| --- | --- | --- |
| 31001 | PasswordResetStart | This event indicates that the on-premises service detected a password reset request for a federated, pass-through authentication, or password-hash-synchronized user that originates from the cloud. This event is the first event in every password-reset writeback operation. |
| 31002 | PasswordResetSuccess | This event indicates that a user selected a new password during a password-reset operation. We determined that this password meets corporate password requirements. The password has been successfully written back to the local Active Directory environment. |
| 31003 | PasswordResetFail | This event indicates that a user selected a password and the password arrived successfully to the on-premises environment. But when we attempted to set the password in the local Active Directory environment, a failure occurred. This failure can happen for several reasons: <br><ul><li>The user’s password does not meet the age, history, complexity, or filter requirements for the domain. To resolve this problem, create a new password.</li><li>The ADMA service account does not have the appropriate permissions to set the new password on the user account in question.</li><li>The user’s account is in a protected group, such as domain or enterprise admin group, which disallows password set operations.</li></ul>|
| 31004 | OnboardingEventStart | This event occurs if you enable password writeback with Azure AD Connect and we have started onboarding your organization to the password writeback web service. |
| 31005 | OnboardingEventSuccess | This event indicates that the onboarding process was successful and that the password writeback capability is ready to use. |
| 31006 | ChangePasswordStart | This event indicates that the on-premises service detected a password change request for a federated, pass-through authentication, or password-hash-synchronized user that originates from the cloud. This event is the first event in every password-change writeback operation. |
| 31007 | ChangePasswordSuccess | This event indicates that a user selected a new password during a password change operation, we determined that the password meets corporate password requirements, and that the password has been successfully written back to the local Active Directory environment. |
| 31008 | ChangePasswordFail | This event indicates that a user selected a password and that the password arrived successfully to the on-premises environment, but when we attempted to set the password in the local Active Directory environment, a failure occurred. This failure can happen for several reasons: <br><ul><li>The user’s password does not meet the age, history, complexity, or filter requirements for the domain. To resolve this problem, create a new password.</li><li>The ADMA service account does not have the appropriate permissions to set the new password on the user account in question.</li><li>The user’s account is in a protected group, such as domain or enterprise admins, which disallow password set operations.</li></ul> |
| 31009 | ResetUserPasswordByAdminStart | The on-premises service detected a password reset request for a federated, pass-through authentication, or password-hash-synchronized user originating from the administrator on behalf of a user. This event is the first event in every password-reset writeback operation that is initiated by an administrator. |
| 31010 | ResetUserPasswordByAdminSuccess | The admin selected a new password during an admin-initiated password-reset operation. We determined that this password meets corporate password requirements. The password has been successfully written back to the local Active Directory environment. |
| 31011 | ResetUserPasswordByAdminFail | The admin selected a password on behalf of a user. The password arrived successfully to the on-premises environment. But when we attempted to set the password in the local Active Directory environment, a failure occurred. This failure can happen for several reasons: <br><ul><li>The user’s password does not meet the age, history, complexity, or filter requirements for the domain. Try a new password to resolve this problem.</li><li>The ADMA service account does not have the appropriate permissions to set the new password on the user account in question.</li><li>The user’s account is in a protected group, such as domain or enterprise admins, which disallow password set operations.</li></ul>  |
| 31012 | OffboardingEventStart | This event occurs if you disable password writeback with Azure AD Connect and indicates that we started offboarding your organization to the password writeback web service. |
| 31013| OffboardingEventSuccess| This event indicates that the offboarding process was successful and that password writeback capability has been successfully disabled. |
| 31014| OffboardingEventFail| This event indicates that the offboarding process was not successful. This might be due to a permissions error on the cloud or on-premises administrator account specified during configuration. The error can also occur if you're attempting to use a federated cloud global administrator when disabling password writeback. To fix this problem, check your administrative permissions and ensure that you're not using a federated account while configuring the password writeback capability.|
| 31015| WriteBackServiceStarted| This event indicates that the password writeback service has started successfully. It is ready to accept password management requests from the cloud.|
| 31016| WriteBackServiceStopped| This event indicates that the password writeback service has stopped. Any password management requests from the cloud will not be successful.|
| 31017| AuthTokenSuccess| This event indicates that we successfully retrieved an authorization token for the global admin specified during Azure AD Connect setup to start the offboarding or onboarding process.|
| 31018| KeyPairCreationSuccess| This event indicates that we successfully created the password encryption key. This key is used to encrypt passwords from the cloud to be sent to your on-premises environment.|
| 32000| UnknownError| This event indicates an unknown error occurred during a password management operation. Look at the exception text in the event for more details. If you're having problems, try disabling and then re-enabling password writeback. If this does not help, include a copy of your event log along with the tracking ID specified insider to your support engineer.|
| 32001| ServiceError| This event indicates there was an error connecting to the cloud password reset service. This error generally occurs when the on-premises service was unable to connect to the password-reset web service.|
| 32002| ServiceBusError| This event indicates there was an error connecting to your tenant’s Service Bus instance. This can happen if you're blocking outbound connections in your on-premises environment. Check your firewall to ensure that you allow connections over TCP 443 and to https://ssprdedicatedsbprodncu.servicebus.windows.net, and then try again. If you're still having problems, try disabling and then re-enabling password writeback.|
| 32003| InPutValidationError| This event indicates that the input passed to our web service API was invalid. Try the operation again.|
| 32004| DecryptionError| This event indicates that there was an error decrypting the password that arrived from the cloud. This might be due to a decryption key mismatch between the cloud service and your on-premises environment. To resolve this problem, disable and then re-enable password writeback in your on-premises environment.|
| 32005| ConfigurationError| During onboarding, we save tenant-specific information in a configuration file in your on-premises environment. This event indicates that there was an error saving this file or that when the service was started, there was an error reading the file. To fix this problem, try disabling and then re-enabling password writeback to force a rewrite of the configuration file.|
| 32007| OnBoardingConfigUpdateError| During onboarding, we send data from the cloud to the on-premises password-reset service. That data is then written to an in-memory file before it is sent to the sync service to be stored securely on disk. This event indicates that there is a problem with writing or updating that data in memory. To fix this problem, try disabling and then re-enabling password writeback to force a rewrite of this configuration file.|
| 32008| ValidationError| This event indicates we received an invalid response from the password-reset web service. To fix this problem, try disabling and then re-enabling password writeback.|
| 32009| AuthTokenError| This event indicates that we couldn't get an authorization token for the global administrator account specified during Azure AD Connect setup. This error can be caused by a bad username or password specified for the global admin account. This error can also occur if the global admin account specified is federated. To fix this problem, rerun the configuration with the correct username and password and ensure that the administrator is a managed (cloud-only or password-synchronized) account.|
| 32010| CryptoError| This event indicates there was an error generating the password encryption key or decrypting a password that arrives from the cloud service. This error likely indicates a problem with your environment. Look at the details of your event log to learn more about how to resolve this problem. You can also try disabling and then re-enabling the password writeback service.|
| 32011| OnBoardingServiceError| This event indicates that the on-premises service couldn't properly communicate with the password-reset web service to initiate the onboarding process. This can happen as a result of a firewall rule or if there is a problem getting an authentication token for your tenant. To fix this problem, ensure that you're not blocking outbound connections over TCP 443 and TCP 9350-9354 or to https://ssprdedicatedsbprodncu.servicebus.windows.net. Also ensure that the Azure AD admin account you're using to onboard isn't federated.|
| 32013| OffBoardingError| This event indicates that the on-premises service couldn't properly communicate with the password-reset web service to initiate the offboarding process. This can happen as a result  of a firewall rule or if there is a problem getting an authorization token for your tenant. To fix this problem, ensure that you're not blocking outbound connections over 443 or to https://ssprdedicatedsbprodncu.servicebus.windows.net, and that the Azure Active Directory admin account you're using to offboard isn't federated.|
| 32014| ServiceBusWarning| This event indicates that we had to retry to connect to your tenant’s Service Bus instance. Under normal conditions, this should not be a concern, but if you see this event many times, consider checking your network connection to Service Bus, especially if it’s a high-latency or low-bandwidth connection.|
| 32015| ReportServiceHealthError| In order to monitor the health of your password writeback service, we send heartbeat data to our password-reset web service every five minutes. This event indicates that there was an error when sending this health information back to the cloud web service. This health information does not include any personal data, and is purely a heartbeat and basic service statistics so that we can provide service status information in the cloud.|
| 33001| ADUnKnownError| This event indicates that there was an unknown error returned by Active Directory. Check the Azure AD Connect server event log for events from the ADSync source for more information.|
| 33002| ADUserNotFoundError| This event indicates that the user who is trying to reset or change a password was not found in the on-premises directory. This error can occur when the user has been deleted on-premises but not in the cloud. This error can also occur if there is a problem with sync. Check your sync logs and the last few sync run details for more information.|
| 33003| ADMutliMatchError| When a password reset or change request originates from the cloud, we use the cloud anchor specified during the setup process of Azure AD Connect to determine how to link that request back to a user in your on-premises environment. This event indicates that we found two users in your on-premises directory with the same cloud anchor attribute. Check your sync logs and the last few sync run details for more information.|
| 33004| ADPermissionsError| This event indicates that the Active Directory Management Agent (ADMA) service account does not have the appropriate permissions on the account in question to set a new password. Ensure that the ADMA account in the user’s forest has reset password permissions on all objects in the forest. For more information on how to set the permissions, see Step 4: Set up the appropriate Active Directory permissions. This error could also occur when the user's attribute AdminCount is set to 1.|
| 33005| ADUserAccountDisabled| This event indicates that we attempted to reset or change a password for an account that was disabled on-premises. Enable the account and try the operation again.|
| 33006| ADUserAccountLockedOut| This event indicates that we attempted to reset or change a password for an account that was locked out on-premises. Lockouts can occur when a user has tried a change or reset password operation too many times in a short period. Unlock the account and try the operation again.|
| 33007| ADUserIncorrectPassword| This event indicates that the user specified an incorrect current password when performing a password change operation. Specify the correct current password and try again.|
| 33008| ADPasswordPolicyError| This event occurs when the password writeback service attempts to set a password on your local directory that does not meet the password age, history, complexity, or filtering requirements of the domain. <br> <br> If you have a minimum password age and have recently changed the password within that window of time, you're not able to change the password again until it reaches the specified age in your domain. For testing purposes, the minimum age should be set to 0. <br> <br> If you have password history requirements enabled, then you must select a password that has not been used in the last *N* times, where *N* is the password history setting. If you do select a password that has been used in the last *N* times, then you see a failure in this case. For testing purposes, the password history should be set to 0. <br> <br> If you have password complexity requirements, all of them are enforced when the user attempts to change or reset a password. <br> <br> If you have password filters enabled and a user selects a password that does not meet the filtering criteria, then the reset or change operation fails.|
| 33009| ADConfigurationError| This event indicates there was a problem writing a password back to your on-premises directory because of a configuration issue with Active Directory. Check the Azure AD Connect machine’s application event log for messages from the ADSync service for more information on which error occurred.|

## Troubleshoot password writeback connectivity

If you're experiencing service interruptions with the password writeback component of Azure AD Connect, here are some quick steps you can take to resolve this problem:

* [Confirm network connectivity](#confirm-network-connectivity)
* [Restart the Azure AD Connect Sync service](#restart-the-azure-ad-connect-sync-service)
* [Disable and re-enable the password writeback feature](#disable-and-re-enable-the-password-writeback-feature)
* [Install the latest Azure AD Connect release](#install-the-latest-azure-ad-connect-release)
* [Troubleshoot password writeback](#troubleshoot-password-writeback)

In general, to recover your service in the most rapid manner, we recommend that you execute these steps in the order discussed previously.

### Confirm network connectivity

The most common point of failure is that firewall and or proxy ports and idle timeouts are incorrectly configured. 

For Azure AD Connect version 1.1.443.0 and above, you need outbound HTTPS access to the following:

* \*.passwordreset.microsoftonline.com
* \*.servicebus.windows.net

For more granularity, reference the updated list of [Microsoft Azure Datacenter IP Ranges](https://www.microsoft.com/download/details.aspx?id=41653) updated every Wednesday and put into effect the next Monday.

For more information, review the connectivity prerequisites in the [Prerequisites for Azure AD Connect](../hybrid/how-to-connect-install-prerequisites.md) article.

> [!NOTE]
> SSPR can also fail if the "Password never expires" or "User cannot change password" settings are configured on the account in AD DS on-premises. 

### Restart the Azure AD Connect Sync service

To resolve connectivity problems or other transient problems with the service, restart the Azure AD Connect Sync service:

1. As an administrator, select **Start** on the server running Azure AD Connect.
1. Enter **services.msc** in the search field and select **Enter**.
1. Look for the **Microsoft Azure AD Sync** entry.
1. Right-click the service entry, select **Restart**, and then wait for the operation to finish.

   ![Restart the Azure AD Sync service using the GUI][Service restart]

These steps re-establish your connection with the cloud service and resolve any interruptions you might be experiencing. If restarting the ADSync service does not resolve your problem, we recommend that you try to disable and then re-enable the password writeback feature.

### Disable and re-enable the password writeback feature

To resolve connectivity issues, disable and then re-enable the password writeback feature:

   1. As an administrator, open the Azure AD Connect Configuration wizard.
   1. In **Connect to Azure AD**, enter your Azure AD global admin credentials.
   1. In **Connect to AD DS**, enter your AD Domain Services admin credentials.
   1. In **Uniquely identifying your users**, select the **Next** button.
   1. In **Optional features**, clear the **Password writeback** check box.
   1. Select **Next** through the remaining dialog pages without changing anything until you get to the **Ready to configure** page.
   1. Ensure that the **Ready to configure page** shows the **Password writeback** option as **disabled** and then select the green **Configure** button to commit your changes.
   1. In **Finished**, clear the **Synchronize now** option, and then select **Finish** to close the wizard.
   1. Reopen the Azure AD Connect Configuration wizard.
   1. Repeat steps 2-8, except ensure you select the **Password writeback** option on the **Optional features** page to re-enable the service.

These steps re-establish your connection with our cloud service and resolve any interruptions you might be experiencing.

If disabling and then re-enabling the password writeback feature does not resolve your problem, we recommend that you reinstall Azure AD Connect.

### Install the latest Azure AD Connect release

Reinstalling Azure AD Connect can resolve configuration and connectivity issues between our cloud services and your local Active Directory environment.

We recommend that you perform this step only after you attempt the first two steps previously described.

> [!WARNING]
> If you have customized the out-of-the-box sync rules, *back them up before proceeding with upgrade and then manually redeploy them after you're finished.*

1. Download the latest version of Azure AD Connect from the [Microsoft Download Center](https://go.microsoft.com/fwlink/?LinkId=615771).
1. Because you have already installed Azure AD Connect, you need to perform an in-place upgrade to update your Azure AD Connect installation to the latest version.
1. Execute the downloaded package and follow the on-screen instructions to update your Azure AD Connect machine.

The previous steps should re-establish your connection with our cloud service and resolve any interruptions you might be experiencing.

If installing the latest version of the Azure AD Connect server does not resolve your problem, we recommend that you try disabling and then re-enabling password writeback as a final step after you install the latest release.

## Verify that Azure AD Connect has the required permission for password writeback

Azure AD Connect requires Active Directory **Reset password** permission to perform password writeback. To find out if Azure AD Connect has the required permission for a given on-premises Active Directory user account, you can use the Windows Effective Permission feature:

1. Sign in to the Azure AD Connect server and start the **Synchronization Service Manager** by selecting **Start** > **Synchronization Service**.
1. Under the **Connectors** tab, select the on-premises **Active Directory Domain Services** connector, and then select **Properties**.  
   ![Synchronization Service Manager showing how to edit properties](./media/active-directory-passwords-troubleshoot/checkpermission01.png)  
  
1. In the pop-up window, select **Connect to Active Directory Forest** and make note of the **User name** property. This property is the AD DS account used by Azure AD Connect to perform directory synchronization. For Azure AD Connect to perform password writeback, the AD DS account must have reset password permission.  

   ![Finding the synchronization service Active Directory user account](./media/active-directory-passwords-troubleshoot/checkpermission02.png)
  
1. Sign in to an on-premises domain controller and start the **Active Directory Users and Computers** application.
1. Select **View** and make sure the **Advanced Features** option is enabled.  

   ![Active Directory Users and Computers show Advanced Features](./media/active-directory-passwords-troubleshoot/checkpermission03.png)
  
1. Look for the Active Directory user account you want to verify. Right-click the account name and select **Properties**.  
1. In the pop-up window, go to the **Security** tab and select **Advanced**.  
1. In the **Advanced Security Settings for Administrator** pop-up window, go to the **Effective Access** tab.
1. Select **Select a user**, select the AD DS account used by Azure AD Connect (see step 3), and then select **View effective access**.

   ![Effective Access tab showing the Synchronization Account](./media/active-directory-passwords-troubleshoot/checkpermission06.png)
  
1. Scroll down and look for **Reset password**. If the entry has a check mark, the AD DS account has permission to reset the password of the selected Active Directory user account.  

   ![Validating that the sync account has the Reset password permission](./media/active-directory-passwords-troubleshoot/checkpermission07.png)

## Azure AD forums

If you have a general question about Azure AD and self-service password reset, you can ask the community for assistance on the [Microsoft Q&A question page for Azure Active Directory](/answers/topics/azure-active-directory.html). Members of the community include engineers, product managers, MVPs, and fellow IT professionals.

## Contact Microsoft support

If you can't find the answer to a problem, our support teams are always available to assist you further.

To properly assist you, we ask that you provide as much detail as possible when opening a case. These details include:

* **General description of the error**: What is the error? What was the behavior that was noticed? How can we reproduce the error? Provide as much detail as possible.
* **Page**: What page were you on when you noticed the error? Include the URL if you're able to and a screenshot of the page.
* **Support code**: What was the support code that was generated when the user saw the error?
   * To find this code, reproduce the error, then select the **Support code** link at the bottom of the screen and send the support engineer the GUID that results.

   ![Find the support code at the bottom of the screen][Support code]

  * If you're on a page without a support code at the bottom, select F12 and search for the SID and CID and send those two results to the support engineer.
* **Date, time, and time zone**: Include the precise date and time *with the time zone* that the error occurred.
* **User ID**: Who was the user who saw the error? An example is *user\@contoso.com*.
   * Is this a federated user?
   * Is this a pass-through authentication user?
   * Is this a password-hash-synchronized user?
   * Is this a cloud-only user?
* **Licensing**: Does the user have an Azure AD license assigned?
* **Application event log**: If you're using password writeback and the error is in your on-premises infrastructure, include a zipped copy of your application event log from the Azure AD Connect server.

[Service restart]: ./media/active-directory-passwords-troubleshoot/servicerestart.png "Restart the Azure AD Sync service"
[Support code]: ./media/active-directory-passwords-troubleshoot/supportcode.png "The support code is located at the bottom right of the window"

## Next steps
