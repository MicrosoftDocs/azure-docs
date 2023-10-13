---
title: Troubleshoot self-service password reset writeback
description: Learn how to troubleshoot common problems and resolution steps for self-service password reset writeback in Microsoft Entra ID

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: troubleshooting
ms.date: 10/05/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: tilarso

ms.collection: M365-identity-device-management
---
# Troubleshoot self-service password reset writeback in Microsoft Entra ID

Microsoft Entra self-service password reset (SSPR) lets users reset their passwords in the cloud. Password writeback is a feature enabled with [Microsoft Entra Connect](../hybrid/whatis-hybrid-identity.md) or [cloud sync](tutorial-enable-cloud-sync-sspr-writeback.md) that allows password changes in the cloud to be written back to an existing on-premises directory in real time.

If you have problems with SSPR writeback, the following troubleshooting steps and common errors may help. If you can't find the answer to your problem, [our support teams are always available](#contact-microsoft-support) to assist you further.

## Troubleshoot connectivity

If you have problems with password writeback for Microsoft Entra Connect, review the following steps that may help resolve the problem. To recover your service, we recommend that you follow these steps in order:

* [Confirm network connectivity](#confirm-network-connectivity)
* [Restart the Microsoft Entra Connect Sync service](#restart-the-azure-ad-connect-sync-service)
* [Disable and re-enable the password writeback feature](#disable-and-re-enable-the-password-writeback-feature)
* [Install the latest Microsoft Entra Connect release](#install-the-latest-azure-ad-connect-release)
* [Troubleshoot password writeback](#common-password-writeback-errors)

### Confirm network connectivity

The most common point of failure is that firewall or proxy ports, or idle timeouts are incorrectly configured.

For Azure AD Connect version *1.1.443.0* and above, *outbound HTTPS* access is required to the following addresses:

* *\*.passwordreset.microsoftonline.com*
* *\*.servicebus.windows.net*

Azure [GOV endpoints](/azure/azure-government/compare-azure-government-global-azure#guidance-for-developers):

* *\*.passwordreset.microsoftonline.us*
* *\*.servicebus.usgovcloudapi.net*

If you need more granularity, see the [list of Microsoft Azure IP Ranges and Service Tags for Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519).

For Azure GOV, see the [list of Microsoft Azure IP Ranges and Service Tags for US Government Cloud](https://www.microsoft.com/download/details.aspx?id=57063).

These files are updated weekly.

To determine if access to a URL and port are restricted in an environment, run the following cmdlet:

```powershell
Test-NetConnection -ComputerName ssprdedicatedsbprodscu.servicebus.windows.net -Port 443
```

Or run the following:

```powershell
Invoke-WebRequest -Uri https://ssprdedicatedsbprodscu.servicebus.windows.net -Verbose
```

For more information, see the [connectivity prerequisites for Microsoft Entra Connect](../hybrid/connect/how-to-connect-install-prerequisites.md).

<a name='restart-the-azure-ad-connect-sync-service'></a>

### Restart the Microsoft Entra Connect Sync service

To resolve connectivity issues or other transient problems with the service, complete the following steps to restart the Microsoft Entra Connect Sync service:

1. As an administrator on the server that runs Microsoft Entra Connect, select **Start**.
1. Enter *services.msc* in the search field and select **Enter**.
1. Look for the *Azure AD Sync* entry.
1. Right-click the service entry, select **Restart**, and wait for the operation to finish.

    :::image type="content" source="./media/troubleshoot-sspr-writeback/service-restart.png" alt-text="Restart the Azure AD Sync service using the GUI" border="false":::

These steps re-establish your connection with Microsoft Entra ID and should resolve your connectivity issues.

If restarting the Microsoft Entra Connect Sync service doesn't resolve your problem, try to disable and then re-enable the password writeback feature in the next section.

### Disable and re-enable the password writeback feature

To continue to troubleshoot issues, complete the following steps to disable and then re-enable the password writeback feature:

1. As an administrator on the server that runs Microsoft Entra Connect, open the **Microsoft Entra Connect Configuration wizard**.
1. In **Connect to Microsoft Entra ID**, enter your Microsoft Entra Global Administrator credentials.
1. In **Connect to AD DS**, enter your on-premises Active Directory Domain Services admin credentials.
1. In **Uniquely identifying your users**, select the **Next** button.
1. In **Optional features**, clear the **Password writeback** check box.
1. Select **Next** through the remaining dialog pages without changing anything until you get to the **Ready to configure** page.
1. Check that the **Ready to configure page** shows the *Password writeback* option as *disabled*. Select the green **Configure** button to commit your changes.
1. In **Finished**, clear the **Synchronize now** option, and then select **Finish** to close the wizard.
1. Reopen the **Microsoft Entra Connect Configuration wizard**.
1. Repeat steps 2-8, this time selecting the *Password writeback* option on the **Optional features** page to re-enable the service.

These steps re-establish your connection with Microsoft Entra ID and should resolve your connectivity issues.

If disabling and then re-enabling the password writeback feature doesn't resolve your problem, reinstall Microsoft Entra Connect in the next section.

<a name='install-the-latest-azure-ad-connect-release'></a>

### Install the latest Microsoft Entra Connect release

Reinstalling Microsoft Entra Connect can resolve configuration and connectivity issues between Microsoft Entra ID and your local Active Directory Domain Services environment. We recommend that you perform this step only after you attempt the previous steps to verify and troubleshoot connectivity.

> [!WARNING]
> If you've customized the out-of-the-box sync rules, *back them up before you proceed with the upgrade, then manually redeploy them after you're finished.*

1. Download the latest version of Microsoft Entra Connect from the [Microsoft Download Center](https://go.microsoft.com/fwlink/?LinkId=615771).
1. As you've already installed Microsoft Entra Connect, perform an in-place upgrade to update your Microsoft Entra Connect installation to the latest version.

    Run the downloaded package and follow the on-screen instructions to update Microsoft Entra Connect.

These steps should re-establish your connection with Microsoft Entra ID and resolve your connectivity issues.

If installing the latest version of the Microsoft Entra Connect server doesn't resolve your problem, try disabling and then re-enabling password writeback as a final step after you install the latest release.

<a name='verify-that-azure-ad-connect-has-the-required-permissions'></a>

## Verify that Microsoft Entra Connect has the required permissions

Microsoft Entra Connect requires AD DS **Reset password** permission to perform password writeback. To check if Microsoft Entra Connect has the required permission for a given on-premises AD DS user account, use the **Windows Effective Permission** feature:

1. Sign in to the Microsoft Entra Connect server and start the **Synchronization Service Manager** by selecting **Start** > **Synchronization Service**.
1. Under the **Connectors** tab, select the on-premises **Active Directory Domain Services** connector, and then select **Properties**.

    :::image type="content" source="./media/troubleshoot-sspr-writeback/synchronization-service-manager.png" alt-text="Synchronization Service Manager showing how to edit properties" border="false":::
  
1. In the pop-up window, select **Connect to Active Directory Forest** and make note of the **User name** property. This property is the AD DS account used by Microsoft Entra Connect to perform directory synchronization.

    For Microsoft Entra Connect to perform password writeback, the AD DS account must have reset password permission. You check the permissions on this user account in the following steps.

    :::image type="content" source="./media/troubleshoot-sspr-writeback/synchronization-service-manager-properties.png" alt-text="Finding the synchronization service Active Directory user account" border="false":::
  
1. Sign in to an on-premises domain controller and start the **Active Directory Users and Computers** application.
1. Select **View** and make sure the **Advanced Features** option is enabled.  

    :::image type="content" source="./media/troubleshoot-sspr-writeback/view-advanced-features.png" alt-text="Active Directory Users and Computers show Advanced Features" border="false":::
  
1. Look for the AD DS user account you want to verify. Right-click the account name and select **Properties**.  
1. In the pop-up window, go to the **Security** tab and select **Advanced**.  
1. In the **Advanced Security Settings for Administrator** pop-up window, go to the **Effective Access** tab.
1. Choose **Select a user**, select the AD DS account used by Microsoft Entra Connect, and then select **View effective access**.

    :::image type="content" source="./media/troubleshoot-sspr-writeback/view-effective-access.png" alt-text="Effective Access tab showing the Synchronization Account" border="false":::
  
1. Scroll down and look for **Reset password**. If the entry has a check mark, the AD DS account has permission to reset the password of the selected Active Directory user account.  

    :::image type="content" source="./media/troubleshoot-sspr-writeback/check-permissions.png" alt-text="Validating that the sync account has the Reset password permission" border="false":::

## Common password writeback errors

The following more specific issues may occur with password writeback. If you have one of these errors, review the proposed solution and check if password writeback then works correctly.

| Error | Solution |
| --- | --- |
| The password reset service doesn't start on-premises. Error 6800 appears in the Microsoft Entra Connect machine's application event log. <br> <br> After onboarding, federated, pass-through authentication, or password-hash-synchronized users can't reset their passwords. | When password writeback is enabled, the sync engine calls the writeback library to perform the configuration (onboarding) by communicating to the cloud onboarding service. Any errors encountered during onboarding or while starting the Windows Communication Foundation (WCF) endpoint for password writeback results in errors in the event log, on your Microsoft Entra Connect machine. <br> <br> During restart of the Azure AD Sync (ADSync) service, if writeback was configured, the WCF endpoint starts up. But, if the startup of the endpoint fails, we log event 6800 and let the sync service start up. The presence of this event means that the password writeback endpoint didn't start up. Event log details for this event 6800, along with event log entries generate by the PasswordResetService component, indicate why you can't start up the endpoint. Review these event log errors and try to restart the Microsoft Entra Connect if password writeback still isn't working. If the problem persists, try to disable and then re-enable password writeback.
| When a user attempts to reset a password or unlock an account with password writeback enabled, the operation fails. <br> <br> In addition, you see an event in the Microsoft Entra Connect event log that contains: "Synchronization Engine returned an error hr=800700CE, message=The filename or extension is too long" after the unlock operation occurs. | Find the Active Directory account for Microsoft Entra Connect and reset the password so that it contains no more than 256 characters. Next, open the **Synchronization Service** from the **Start** menu. Browse to **Connectors** and find the **Active Directory Connector**. Select it and then select **Properties**. Browse to the **Credentials** page and enter the new password. Select **OK** to close the page. |
| At the last step of the Microsoft Entra Connect installation process, you see an error indicating that password writeback couldn't be configured. <br> <br> The Microsoft Entra Connect application event log contains error 32009 with the text "Error getting auth token." | This error occurs in the following two cases: <br><ul><li>You specified an incorrect password for the global administrator account provided at the beginning of the Microsoft Entra Connect installation process.</li><li>You attempted to use a federated user for the global administrator account specified at the beginning of the Microsoft Entra Connect installation process.</li></ul> To fix this problem, make sure that you're not using a federated account for the global administrator you specified at the beginning of the installation process, and that the password specified is correct. |
| The Microsoft Entra Connect machine event log contains error 32002 that is thrown by running PasswordResetService. <br> <br> The error reads: "Error Connecting to ServiceBus. The token provider was unable to provide a security token." | Your on-premises environment isn't able to connect to the Azure Service Bus endpoint in the cloud. This error is normally caused by a firewall rule blocking an outbound connection to a particular port or web address. See [Connectivity prerequisites](../hybrid/connect/how-to-connect-install-prerequisites.md) for more info. After you update these rules, restart the Microsoft Entra Connect server and password writeback should start working again. |
| After working for some time, federated, pass-through authentication, or password-hash-synchronized users can't reset their passwords. | In some rare cases, the password writeback service can fail to restart when Microsoft Entra Connect has restarted. In these cases, first check if password writeback is enabled on-premises. You can check by using either the Microsoft Entra Connect wizard or PowerShell. If the feature appears to be enabled, try enabling or disabling the feature again either. If this troubleshooting step doesn't work, try a complete uninstall and reinstall of Microsoft Entra Connect. |
| Federated, pass-through authentication, or password-hash-synchronized users who attempt to reset their passwords see an error after attempting to submit their password. The error indicates that there was a service problem. <br ><br> In addition to this problem, during password reset operations, you might see an error that the management agent was denied access in your on-premises event logs. | If you see these errors in your event log, confirm that the Active Directory Management Agent (ADMA) account that was specified in the wizard at the time of configuration has the necessary permissions for password writeback. <br> <br> After this permission is given, it can take up to one hour for the permissions to trickle down via the `sdprop` background task on the domain controller (DC). <br> <br> For password reset to work, the permission needs to be stamped on the security descriptor of the user object whose password is being reset. Until this permission shows up on the user object, password reset continues to fail with an access denied message. |
| Federated, pass-through authentication, or password-hash-synchronized users who attempt to reset their passwords, see an error after they submit their password. The error indicates that there was a service problem. <br> <br> In addition to this problem, during password reset operations, you might see an error in your event logs from the Microsoft Entra Connect service indicating an "Object could not be found" error. | This error usually indicates that the sync engine is unable to find either the user object in the Microsoft Entra connector space or the linked metaverse (MV) or Microsoft Entra connector space object. <br> <br> To troubleshoot this problem, make sure that the user is indeed synchronized from on-premises to Microsoft Entra ID via the current instance of Microsoft Entra Connect and inspect the state of the objects in the connector spaces and MV. Confirm that the Active Directory Certificate Services (AD CS) object is connected to the MV object via the "Microsoft.InfromADUserAccountEnabled.xxx" rule.|
| Federated, pass-through authentication, or password-hash-synchronized users who attempt to reset their passwords see an error after they submit their password. The error indicates that there was a service problem. <br> <br> In addition to this problem, during password reset operations, you might see an error in your event logs from the Microsoft Entra Connect service that indicates that there's a "Multiple matches found" error. | This indicates that the sync engine detected that the MV object is connected to more than one AD CS object via "Microsoft.InfromADUserAccountEnabled.xxx". This means that the user has an enabled account in more than one forest. This scenario isn't supported for password writeback. |
| Password operations fail with a configuration error. The application event log contains Microsoft Entra Connect error 6329 with the text "0x8023061f (The operation failed because password synchronization is not enabled on this Management Agent)". | This error occurs if the Microsoft Entra Connect configuration is changed to add a new Active Directory forest (or to remove and readd an existing forest) after the password writeback feature has already been enabled. Password operations for users in these recently added forests fail. To fix the problem, disable and then re-enable the password writeback feature after the forest configuration changes have been completed.
| SSPR_0029: We are unable to reset your password due to an error in your on-premises configuration. Please contact your admin and ask them to investigate. | Problem: Password writeback has been enabled following all of the required steps, but when attempting to change a password you receive "SSPR_0029: Your organization hasn’t properly set up the on-premises configuration for password reset." Checking the event logs on the Microsoft Entra Connect system shows that the management agent credential was denied access.Possible Solution: Use RSOP on the Microsoft Entra Connect system and your domain controllers to see if the policy "Network access: Restrict clients allowed to make remote calls to SAM" found under Computer Configuration > Windows Settings > Security Settings > Local Policies > Security Options is enabled. Edit the policy to include the MSOL_XXXXXXX management account as an allowed user. For more information, see [Troubleshoot error SSPR_0029: Your organization hasn't properly set up the on-premises configuration for password reset](/troubleshoot/azure/active-directory/password-writeback-error-code-sspr-0029).|

## Password writeback event log error codes

A best practice when you troubleshoot problems with password writeback is to inspect the application event log, on your Microsoft Entra Connect machine. This event log contains events from two sources for password writeback. The *PasswordResetService* source describes operations and problems related to the operation of password writeback. The *ADSync* source describes operations and problems related to setting passwords in your Active Directory Domain Services environment.

### If the source of the event is ADSync

| Code | Name or message | Description |
| --- | --- | --- |
| 6329 | BAIL: MMS(4924) 0x80230619: "A restriction prevents the password from being changed to the current one specified." | This event occurs when the password writeback service attempts to set a password on your local directory that doesn't meet the password age, history, complexity, or filtering requirements of the domain. <br> <br> If you have a minimum password age and have recently changed the password within that window of time, you're not able to change the password again until it reaches the specified age in your domain. For testing purposes, the minimum age should be set to 0. <br> <br> If you have password history requirements enabled, then you must select a password that hasn't been used in the last *N* times, where *N* is the password history setting. If you do select a password that has been used in the last *N* times, then you see a failure in this case. For testing purposes, the password history should be set to 0. <br> <br> If you have password complexity requirements, all of them are enforced when the user attempts to change or reset a password. <br> <br> If you have password filters enabled and a user selects a password that doesn't meet the filtering criteria, then the reset or change operation fails. |
| 6329 | MMS(3040): admaexport.cpp(2837): The server doesn't contain the LDAP password policy control. | This problem occurs if LDAP_SERVER_POLICY_HINTS_OID control (1.2.840.113556.1.4.2066) isn't enabled on the DCs. To use the password writeback feature, you must enable the control. To do so, the DCs must be on Windows Server 2016 or later. |
| HR 8023042 | Synchronization Engine returned an error hr=80230402, message=An attempt to get an object failed because there are duplicated entries with the same anchor. | This error occurs when the same user ID is enabled in multiple domains. An example is if you're syncing account and resource forests and have the same user ID present and enabled in each forest. <br> <br> This error can also occur if you use a non-unique anchor attribute, like an alias or UPN, and two users share that same anchor attribute. <br> <br> To resolve this problem, ensure that you don't have any duplicated users within your domains and that you use a unique anchor attribute for each user. |

### If the source of the event is PasswordResetService

| Code | Name or message | Description |
| --- | --- | --- |
| 31001 | PasswordResetStart | This event indicates that the on-premises service detected a password reset request for a federated, pass-through authentication, or password-hash-synchronized user that originates from the cloud. This event is the first event in every password-reset writeback operation. |
| 31002 | PasswordResetSuccess | This event indicates that a user selected a new password during a password-reset operation. We determined that this password meets corporate password requirements. The password has been successfully written back to the local Active Directory environment. |
| 31003 | PasswordResetFail | This event indicates that a user selected a password and the password arrived successfully to the on-premises environment. But when we attempted to set the password in the local Active Directory environment, a failure occurred. This failure can happen for several reasons: <br><ul><li>The user's password doesn't meet the age, history, complexity, or filter requirements for the domain. To resolve this problem, create a new password.</li><li>The ADMA service account doesn't have the appropriate permissions to set the new password on the user account in question.</li><li>The user's account is in a protected group, such as domain or enterprise admin group, which disallows password set operations.</li></ul>|
| 31004 | OnboardingEventStart | This event occurs if you enable password writeback with Microsoft Entra Connect and we've started onboarding your organization to the password writeback web service. |
| 31005 | OnboardingEventSuccess | This event indicates that the onboarding process was successful and that the password writeback capability is ready to use. |
| 31006 | ChangePasswordStart | This event indicates that the on-premises service detected a password change request for a federated, pass-through authentication, or password-hash-synchronized user that originates from the cloud. This event is the first event in every password-change writeback operation. |
| 31007 | ChangePasswordSuccess | This event indicates that a user selected a new password during a password change operation, we determined that the password meets corporate password requirements, and that the password has been successfully written back to the local Active Directory environment. |
| 31008 | ChangePasswordFail | This event indicates that a user selected a password and that the password arrived successfully to the on-premises environment, but when we attempted to set the password in the local Active Directory environment, a failure occurred. This failure can happen for several reasons: <br><ul><li>The user's password doesn't meet the age, history, complexity, or filter requirements for the domain. To resolve this problem, create a new password.</li><li>The ADMA service account doesn't have the appropriate permissions to set the new password on the user account in question.</li><li>The user's account is in a protected group, such as domain or enterprise admins, which disallow password set operations.</li></ul> |
| 31009 | ResetUserPasswordByAdminStart | The on-premises service detected a password reset request for a federated, pass-through authentication, or password-hash-synchronized user originating from the administrator on behalf of a user. This event is the first event in every password-reset writeback operation that is initiated by an administrator. |
| 31010 | ResetUserPasswordByAdminSuccess | The admin selected a new password during an admin-initiated password-reset operation. We determined that this password meets corporate password requirements. The password has been successfully written back to the local Active Directory environment. |
| 31011 | ResetUserPasswordByAdminFail | The admin selected a password on behalf of a user. The password arrived successfully to the on-premises environment. But when we attempted to set the password in the local Active Directory environment, a failure occurred. This failure can happen for several reasons: <br><ul><li>The user's password doesn't meet the age, history, complexity, or filter requirements for the domain. Try a new password to resolve this problem.</li><li>The ADMA service account doesn't have the appropriate permissions to set the new password on the user account in question.</li><li>The user's account is in a protected group, such as domain or enterprise admins, which disallow password set operations.</li></ul>  |
| 31012 | OffboardingEventStart | This event occurs if you disable password writeback with Microsoft Entra Connect and indicates that we started offboarding your organization to the password writeback web service. |
| 31013| OffboardingEventSuccess| This event indicates that the offboarding process was successful and that password writeback capability has been successfully disabled. |
| 31014| OffboardingEventFail| This event indicates that the offboarding process wasn't successful. This might be due to a permissions error on the cloud or on-premises administrator account specified during configuration. The error can also occur if you're attempting to use a federated cloud global administrator when disabling password writeback. To fix this problem, check your administrative permissions and ensure that you're not using a federated account while configuring the password writeback capability.|
| 31015| WriteBackServiceStarted| This event indicates that the password writeback service has started successfully. It is ready to accept password management requests from the cloud.|
| 31016| WriteBackServiceStopped| This event indicates that the password writeback service has stopped. Any password management requests from the cloud won't be successful.|
| 31017| AuthTokenSuccess| This event indicates that we successfully retrieved an authorization token for the Global Administrator specified during Microsoft Entra Connect setup to start the offboarding or onboarding process.|
| 31018| KeyPairCreationSuccess| This event indicates that we successfully created the password encryption key. This key is used to encrypt passwords from the cloud to be sent to your on-premises environment.|
| 31019| ServiceBusHeartBeat| This event indicates that we successfully sent a request to your tenant's Service Bus instance.|
| 31034| ServiceBusListenerError| This event indicates that there was an error connecting to your tenant's Service Bus listener. If the error message includes "The remote certificate is invalid", check to make sure that your Microsoft Entra Connect server has all the required Root CAs as described in [Azure TLS certificate changes](/azure/security/fundamentals/tls-certificate-changes). |
| 31044| PasswordResetService| This event indicates that password writeback is not working. The Service Bus listens for requests on two separate relays for redundancy. Each relay connection is managed by a unique Service Host. The writeback client returns an error if either Service Host is not running.|
| 32000| UnknownError| This event indicates an unknown error occurred during a password management operation. Look at the exception text in the event for more details. If you're having problems, try disabling and then re-enabling password writeback. If this doesn't help, include a copy of your event log along with the tracking ID specified when you open a support request.|
| 32001| ServiceError| This event indicates there was an error connecting to the cloud password reset service. This error generally occurs when the on-premises service was unable to connect to the password-reset web service.|
| 32002| ServiceBusError| This event indicates there was an error connecting to your tenant's Service Bus instance. This can happen if you're blocking outbound connections in your on-premises environment. Check your firewall to ensure that you allow connections over TCP 443 and to https://ssprdedicatedsbprodncu.servicebus.windows.net, and then try again. If you're still having problems, try disabling and then re-enabling password writeback.|
| 32003| InPutValidationError| This event indicates that the input passed to our web service API was invalid. Try the operation again.|
| 32004| DecryptionError| This event indicates that there was an error decrypting the password that arrived from the cloud. This might be due to a decryption key mismatch between the cloud service and your on-premises environment. To resolve this problem, disable and then re-enable password writeback in your on-premises environment.|
| 32005| ConfigurationError| During onboarding, we save tenant-specific information in a configuration file in your on-premises environment. This event indicates that there was an error saving this file or that when the service was started, there was an error reading the file. To fix this problem, try disabling and then re-enabling password writeback to force a rewrite of the configuration file.|
| 32007| OnBoardingConfigUpdateError| During onboarding, we send data from the cloud to the on-premises password-reset service. That data is then written to an in-memory file before it is sent to the sync service to be stored securely on disk. This event indicates that there's a problem with writing or updating that data in memory. To fix this problem, try disabling and then re-enabling password writeback to force a rewrite of this configuration file.|
| 32008| ValidationError| This event indicates we received an invalid response from the password-reset web service. To fix this problem, try disabling and then re-enabling password writeback.|
| 32009| AuthTokenError| This event indicates that we couldn't get an authorization token for the global administrator account specified during Microsoft Entra Connect setup. This error can be caused by a bad username or password specified for the Global Administrator account. This error can also occur if the Global Administrator account specified is federated. To fix this problem, rerun the configuration with the correct username and password and ensure that the administrator is a managed (cloud-only or password-synchronized) account.|
| 32010| CryptoError| This event indicates there was an error generating the password encryption key or decrypting a password that arrives from the cloud service. This error likely indicates a problem with your environment. Look at the details of your event log to learn more about how to resolve this problem. You can also try disabling and then re-enabling the password writeback service.|
| 32011| OnBoardingServiceError| This event indicates that the on-premises service couldn't properly communicate with the password-reset web service to initiate the onboarding process. This can happen as a result of a firewall rule or if there's a problem getting an authentication token for your tenant. To fix this problem, ensure that you're not blocking outbound connections over TCP 443 and TCP 9350-9354 or to https://ssprdedicatedsbprodncu.servicebus.windows.net. Also ensure that the Microsoft Entra admin account you're using to onboard isn't federated.|
| 32013| OffBoardingError| This event indicates that the on-premises service couldn't properly communicate with the password-reset web service to initiate the offboarding process. This can happen as a result  of a firewall rule or if there's a problem getting an authorization token for your tenant. To fix this problem, ensure that you're not blocking outbound connections over 443 or to https://ssprdedicatedsbprodncu.servicebus.windows.net, and that the Microsoft Entra admin account you're using to offboard isn't federated.|
| 32014| ServiceBusWarning| This event indicates that we had to retry to connect to your tenant's Service Bus instance. Under normal conditions, this should not be a concern, but if you see this event many times, consider checking your network connection to Service Bus, especially if it's a high-latency or low-bandwidth connection.|
| 32015| ReportServiceHealthError| In order to monitor the health of your password writeback service, we send heartbeat data to our password-reset web service every five minutes. This event indicates that there was an error when sending this health information back to the cloud web service. This health information doesn't include any personal data, and is purely a heartbeat and basic service statistics so that we can provide service status information in the cloud.|
| 33001| ADUnKnownError| This event indicates that there was an unknown error returned by Active Directory. Check the Microsoft Entra Connect server event log for events from the ADSync source for more information.|
| 33002| ADUserNotFoundError| This event indicates that the user who is trying to reset or change a password was not found in the on-premises directory. This error can occur when the user has been deleted on-premises but not in the cloud. This error can also occur if there's a problem with sync. Check your sync logs and the last few sync run details for more information.|
| 33003| ADMutliMatchError| When a password reset or change request originates from the cloud, we use the cloud anchor specified during the setup process of Microsoft Entra Connect to determine how to link that request back to a user in your on-premises environment. This event indicates that we found two users in your on-premises directory with the same cloud anchor attribute. Check your sync logs and the last few sync run details for more information.|
| 33004| ADPermissionsError| This event indicates that the Active Directory Management Agent (ADMA) service account doesn't have the appropriate permissions on the account in question to set a new password. Ensure that the ADMA account in the user's forest has reset password permissions on all objects in the forest. For more information on how to set the permissions, see Step 4: Set up the appropriate Active Directory permissions. This error could also occur when the user's attribute AdminCount is set to 1.|
| 33005| ADUserAccountDisabled| This event indicates that we attempted to reset or change a password for an account that was disabled on-premises. Enable the account and try the operation again.|
| 33006| ADUserAccountLockedOut| This event indicates that we attempted to reset or change a password for an account that was locked out on-premises. Lockouts can occur when a user has tried a change or reset password operation too many times in a short period. Unlock the account and try the operation again.|
| 33007| ADUserIncorrectPassword| This event indicates that the user specified an incorrect current password when performing a password change operation. Specify the correct current password and try again.|
| 33008| ADPasswordPolicyError| This event occurs when the password writeback service attempts to set a password on your local directory that doesn't meet the password age, history, complexity, or filtering requirements of the domain. <br> <br> If you have a minimum password age and have recently changed the password within that window of time, you're not able to change the password again until it reaches the specified age in your domain. For testing purposes, the minimum age should be set to 0. <br> <br> If you have password history requirements enabled, then you must select a password that has not been used in the last *N* times, where *N* is the password history setting. If you do select a password that has been used in the last *N* times, then you see a failure in this case. For testing purposes, the password history should be set to 0. <br> <br> If you have password complexity requirements, all of them are enforced when the user attempts to change or reset a password. <br> <br> If you have password filters enabled and a user selects a password that doesn't meet the filtering criteria, then the reset or change operation fails.|
| 33009| ADConfigurationError| This event indicates there was a problem writing a password back to your on-premises directory because of a configuration issue with Active Directory. Check the Microsoft Entra Connect machine's application event log for messages from the ADSync service for more information on which error occurred.|

<a name='azure-ad-forums'></a>

## Microsoft Entra forums

If you have general questions about Microsoft Entra ID and self-service password reset, you can ask the community for assistance on the [Microsoft Q&A question page for Microsoft Entra ID](/answers/tags/455/entra-id). Members of the community include engineers, product managers, MVPs, and fellow IT professionals.

## Contact Microsoft support

If you can't find the answer to a problem, our support teams are always available to assist you further.

To properly assist you, we ask that you provide as much detail as possible when opening a case. These details include the following:

* **General description of the error**: What is the error? What was the behavior that was noticed? How can we reproduce the error? Provide as much detail as possible.
* **Page**: What page were you on when you noticed the error? Include the URL if you're able to and a screenshot of the page.
* **Support code**: What was the support code that was generated when the user saw the error?
   * To find this code, reproduce the error, then select the **Support code** link at the bottom of the screen and send the support engineer the GUID that results.

    :::image type="content" source="./media/troubleshoot-sspr-writeback/view-support-code.png" alt-text="The support code is located at the bottom right of the web browser window.":::

  * If you're on a page without a support code at the bottom, select F12 and search for the SID and CID and send those two results to the support engineer.
* **Date, time, and time zone**: Include the precise date and time *with the time zone* that the error occurred.
* **User ID**: Who was the user who saw the error? An example is *user\@contoso.com*.
   * Is this a federated user?
   * Is this a pass-through authentication user?
   * Is this a password-hash-synchronized user?
   * Is this a cloud-only user?
* **Licensing**: Does the user have a Microsoft Entra ID license assigned?
* **Application event log**: If you're using password writeback and the error is in your on-premises infrastructure, include a zipped copy of your application event log from the Microsoft Entra Connect server.

## Next steps

To learn more about SSPR, see [How it works: Microsoft Entra self-service password reset](concept-sspr-howitworks.md) or [How does self-service password reset writeback work in Microsoft Entra ID?](concept-sspr-writeback.md).
