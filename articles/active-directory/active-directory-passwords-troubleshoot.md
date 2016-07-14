<properties
	pageTitle="Troubleshooting: Azure AD Password Management | Microsoft Azure"
	description="Common troubleshooting steps for Azure AD Password Management, including reset, change, writeback, registration, and what information to include when looking for help."
	services="active-directory"
	documentationCenter=""
	authors="asteen"
	manager="femila"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/12/2016"
	ms.author="asteen"/>

# How to troubleshoot Password Management

> [AZURE.IMPORTANT] **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md).

If you are having issues with Password Management, we're here to help. Most problems you may run into can be solved with a few simple troubleshooting steps which you can read about below to troubleshoot your deployment:

* [**Information to include when you need help**](#information-to-include-when-you-need-help)
* [**Problems with Password Management configuration in the Azure Management Portal**](#troubleshoot-password-reset-configuration-in-the-azure-management-portal)
* [**Problems with Password Managment reports in the Azure Management Portal**](#troubleshoot-password-management-reports-in-the-azure-management-portal)
* [**Problems with the Password Reset Registration Portal**](#troubleshoot-the-password-reset-registration-portal)
* [**Problems with the Password Reset Portal**](#troubleshoot-the-password-reset-portal)
* [**Problems with Password Writeback**](#troubleshoot-password-writeback)
  - [Password Writeback event log error codes](#password-writeback-event-log-error-codes)
  - [Problems with Password Writeback connectivity](#troubleshoot-password-writeback-connectivity)

If you've tried the troubleshooting steps below and are still running into problems, you can post a question on the [Azure AD Forums](https://social.msdn.microsoft.com/forums/azure/home?forum=WindowsAzureAD) or contact support and we'll take a look at your problem as soon as we can.

## Information to include when you need help

If you cannot solve your issue with the guidance below, you can contact our support engineers. When you contact them, it is recommended to include the following information:

 - **General description of the error** – what exact error message did the user see?  If there was no error message, describe the unexpected behavior you noticed, in detail.
 - **Page** – what page were you on when you saw the error (include the URL)?
 - **Date / Time / Timezone** – what was the precise date and time you saw the error (include the timezone)?
 - **Support Code** – what was the support code generated when the user saw the error (to find this, reproduce the error, then click the Support Code link at the bottom of the screen and send the support engineer the GUID that results).
   - If you are on a page without a support code at the bottom, press F12 and search for SID and CID and send those two results to the support engineer.

    ![][001]

 - **User ID** – what was the ID of the user who saw the error (e.g. user@contoso.com)?
 - **Information about the user** – was the user federated, password hash synced, cloud only?  Did the user have an AAD Premium or AAD Basic license assigned?
 - **Application Event Log** – if you are using Password Writeback and the error is in your on-premises infrastructure, please zip up a copy of your application event log from your Azure AD Connect server and send along with your request.

Including this information will help us to solve your problem as quickly as possible.


## Troubleshoot password reset configuration in the Azure Management Portal
If you encounter an error when configuring password reset, you might be able to resolve it by following the troubleshooting steps below:

<table>
          <tbody><tr>
            <td>
              <p>
                <strong>Error Case</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>What error does a user see?</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>Solution</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>I don’t see the <strong>User Password Reset Policy </strong>section under the <strong>Configure</strong> tab in the Azure management portal</p>
            </td>
            <td>
              <p>The <strong>User Password Reset Policy </strong>section is not visible on the <strong>Configure</strong> tab in the Azure Management Portal.</p>
            </td>
            <td>
              <p>This can occur if you do not have an AAD Premium or AAD Basic license assigned to the admin performing this operation. </p>
              <p>To rectify this, assign an AAD Premium or AAD Basic license to the admin account in question by navigating to the <strong>Licenses</strong> tab and try again.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>I don’t see any of the configuration options under the <strong>User Password Reset Policy</strong> section that are described in the documentation.</p>
            </td>
            <td>
              <p>The <strong>User Password Reset Policy </strong>section is visible, but the only flag that appears under it is the <strong>Users Enabled for Password Reset</strong> flag.</p>
            </td>
            <td>
              <p>The rest of the UI will appear when you switch the <strong>Users Enabled for Password Reset</strong> flag to <strong>Yes.</strong></p>
            </td>
          </tr>
          <tr>
            <td>
              <p>I don’t see a particular configuration option.</p>
            </td>
            <td>
              <p>For example, I do not see the <strong>Number of days before a user must confirm their contact data</strong> option when I scroll through the <strong>User Password Reset Policy</strong> section (or other examples of the same issue).</p>
            </td>
            <td>
              <p>Many elements of UI are hidden until they are needed. Try enabling all the options on the page if you want to see.</p>
              <p>See <a href="active-directory-passwords-customize.md#password-management-behavior">Password Management behavior</a> for more info about all of the controls that are available to you.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>I don’t see the <strong>Write Back Passwords to On-Premises</strong> configuration option</p>
            </td>
            <td>
              <p>The <strong>Write Back Passwords to On-Premises</strong> option is not visible under the <strong>Configure</strong> tab in the Azure Management Portal</p>
            </td>
            <td>
              <p>This option is only visible if you have downloaded Azure AD Connect and configured Password Writeback. When you have done this, that option appears and allows you to enable or disable writeback from the cloud.</p>
              <p>See <a href="active-directory-passwords-getting-started.md#step-2-enable-password-writeback-in-azure-ad-connect">Enable Password Writeback in Azure AD Connect</a> for more information on how to do this.</p>
            </td>
          </tr>
        </tbody></table>

## Troubleshoot password management reports in the Azure Management Portal
If you encounter an error when using the password management reports, you might be able to resolve it by following the troubleshooting steps below:

<table>
          <tbody><tr>
            <td>
              <p>
                <strong>Error Case</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>What error does a user see?</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>Solution</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>I don’t see any password management reports</p>
            </td>
            <td>
              <p>The <strong>Password reset activity</strong> and <strong>Password reset registration activity</strong> reports are not visible under the <strong>Activity Log</strong> reports in the <strong>Reports</strong> tab.</p>
            </td>
            <td>
              <p>This can occur if you do not have an AAD Premium or AAD Basic license assigned to the admin performing this operation. </p>
              <p>To rectify this, assign an AAD Premium or AAD Basic license to the admin account in question by navigating to the <strong>Licenses</strong> tab and try again.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>User registrations show multiple times</p>
            </td>
            <td>
              <p>When a user registers alternate email, mobile phone, and security questions, they each show up as separate lines instead of a single line.</p>
            </td>
            <td>
              <p>Currently, when a user registers, we cannot assume that they will register everything present on the registration page. As a result, we currently log each individual piece of data that is registered as a separate event.</p>
              <p>If you want to aggregate this data, you can download the report and open the data as a pivot table in excel to have more flexibility.</p>
            </td>
          </tr>
        </tbody></table>

## Troubleshoot the password reset registration portal
If you encounter an error when registering a user for password reset, you might be able to resolve it by following the troubleshooting steps below:

<table>
          <tbody><tr>
            <td>
              <p>
                <strong>Error Case</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>What error does a user see?</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>Solution</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Directory is not enabled for password reset</p>
            </td>
            <td>
              <p>Your administrator has not enabled you to use this feature.</p>
            </td>
            <td>
              <p>Switch the <strong>Users Enabled for Password Reset</strong> flag to <strong>Yes</strong> and hit <strong>Save</strong> in the Azure Management Portal directory configuration tab. You must have an Azure AD Premium or Basic License assigned to the admin performing this operation.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>User does not have an AAD Premium or AAD Basic license assigned</p>
            </td>
            <td>
              <p>Your administrator has not enabled you to use this feature.</p>
            </td>
            <td>
              <p>Assign an Azure AD Premium or Azure AD Basic license to the user under the <strong>Licenses</strong> tab in the Azure Management Portal. You must have an Azure AD Premium or Basic License assigned to the admin performing this operation.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Error processing request</p>
            </td>
            <td>
              <p>User sees an error that states:</p>
              <p>

              </p>
              <p>Error processing request </p>
              <p>When attempting to reset a password.</p>
            </td>
            <td>
              <p>This can be caused by many issues, but generally this error is caused by either a service outage or configuration issue that cannot be resolved. </p>
              <p>If you see this error and it is impacting your business, please contact support and we will assist you ASAP. See <a href="#information-to-include-when-you-need-help">Information to include when you need help</a> to see what you should provide to the support engineer to aid in a speedy resolution.</p>
            </td>
          </tr>
        </tbody></table>

## Troubleshoot the password reset portal
If you encounter an error when resetting a password for a user, you might be able to resolve it by following the troubleshooting steps below:

<table>
          <tbody><tr>
            <td>
              <p>
                <strong>Error Case</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>What error does a user see?</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>Solution</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Directory is not enabled for password reset</p>
            </td>
            <td>
              <p>Your account is not enabled for password reset</p>
              <p>We're sorry, but your administrator has not set up your account for use with this service. </p>
              <p>

              </p>
              <p>If you'd like, we can contact an administrator in your organization to reset your password for you.</p>
            </td>
            <td>
              <p>Switch the <strong>Users Enabled for Password Reset</strong> flag to <strong>Yes</strong> and hit <strong>Save</strong> in the Azure Management Portal directory configuration tab. You must have an Azure AD Premium or Basic License assigned to the admin performing this operation.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>User does not have an AAD Premium or AAD Basic license assigned</p>
            </td>
            <td>
              <p>While we cannot reset non-admin account passwords automatically, we can contact your organization's admin to do it for you.</p>
            </td>
            <td>
              <p>Assign an Azure AD Premium or Azure AD Basic license to the user under the <strong>Licenses</strong> tab in the Azure Management Portal. You must have an Azure AD Premium or Basic License assigned to the admin performing this operation.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Directory is enabled for password reset, but user has missing or mal-formed authentication information</p>
            </td>
            <td>
              <p>Your account is not enabled for password reset</p>
              <p>We're sorry, but your administrator has not set up your account for use with this service. </p>
              <p>

              </p>
              <p>If you'd like, we can contact an administrator in your organization to reset your password for you.</p>
            </td>
            <td>
              <p>Ensure that user has properly formed contact data on file in the directory before proceeding. See <a href="active-directory-passwords-learn-more.md#what-data-is-used-by-password-reset">What data is used by password reset</a> for information on how to configure authentication information in the directory so that users do not see this error.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Directory is enabled for password reset, but a user only has one piece of contact data on file when policy is set to require two verification steps</p>
            </td>
            <td>
              <p>Your account is not enabled for password reset</p>
              <p>We're sorry, but your administrator has not set up your account for use with this service. </p>
              <p>

              </p>
              <p>If you'd like, we can contact an administrator in your organization to reset your password for you.</p>
            </td>
            <td>
              <p>Ensure that user has at least two properly configured contact methods (e.g., both Mobile Phone and Office Phone) before proceeding. See <a href="active-directory-passwords-learn-more.md#what-data-is-used-by-password-reset">What data is used by password reset</a> for information on how to configure authentication information in the directory so that users do not see this error.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Directory is enabled for password reset, and user is properly configured, but user is unable to be contacted </p>
            </td>
            <td>
              <p>Oops!  We encountered an unexpected error while contacting you.</p>
            </td>
            <td>
              <p>This could be the result of a temporary service error or misconfigured contact data that we could not properly detect. If the user waits 10 seconds, a try again and “contact your administrator” link appears. Clicking try again will re-dispatch the call, whereas clicking “contact your administrator” will send a form email to user, password, or global admins (in that precedence order) requesting a password reset to be performed for that user account.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>User never receives the password reset SMS or phone call</p>
            </td>
            <td>
              <p>User clicks “text me” or “call me” and then never receives anything.</p>
            </td>
            <td>
              <p>This could be the result of a mal-formed phone number in the directory. Make sure the phone number is in the format “+ccc xxxyyyzzzzXeeee”. To learn more about formatting phone numbers for use with password reset see <a href="active-directory-passwords-learn-more.md#what-data-is-used-by-password-reset">What data is used by password reset</a>.</p>
              <p>If you require an extension to be routed to the user in question, note that password reset does not support extensions, even if you specify one in the directory (they are stripped before the call is dispatched). Try using a number without an extension, or integrating the extension into the phone number in your PBX.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>User never receives password reset email</p>
            </td>
            <td>
              <p>User clicks “email me” and then never receives anything.</p>
            </td>
            <td>
              <p>The most common cause for this issue is that the message is rejected by a spam filter. Check your spam, junk, or deleted items folder for the email.</p>
              <p>Also ensure that you are checking the right email for the message…lots of people have very similar email addresses and end up checking the wrong inbox for the message. If neither of these options work, it’s also possible that the email address in the directory is malformed, check to make sure the email address is the right one and try again. To learn more about formatting email addresses for use with password reset see <a href="active-directory-passwords-learn-more.md#what-data-is-used-by-password-reset">What data is used by password reset</a>.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>I have set a password reset policy, but when an admin account uses password reset, that policy is not applied</p>
            </td>
            <td>
              <p>Admin accounts resetting their passwords see the same options enabled for password reset, email and mobile phone, no matter what policy is set under the <strong>User Password Reset Policy</strong> section of the <strong>Configure</strong> tab.</p>
            </td>
            <td>
              <p>The options configured under the <strong>User Password Reset Policy</strong> section of the <strong>Configure</strong> tab only apply to end users in your organization.</p>
              <p>Microsoft manages and controls the Admin password reset policy in order to ensure the highest level of security</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>User prevented from attempting password reset too many times in a day</p>
            </td>
            <td>
              <p>User sees an error stating:</p>
              <p>

              </p>
              <p>Please use another option.</p>
              <p>You've tried to verify your account too many times in the last 1 hour(s). For security reasons, you'll have to wait 24 hour(s) before you can try again. </p>
              <p>If you'd like, we can contact an administrator in your organization to reset your password for you.</p>
            </td>
            <td>
              <p>We implement an automatic throttling mechanism to block users from attempting to reset their passwords too many times in a short period of time. This occurs when:</p>
              <ol class="ordered">
                <li>
										User attempts to validate a phone number 5 times in one hour.<br\><br\></li>
                <li>
										User attempts to use the security questions gate 5 times in one hour.<br\><br\></li>
                <li>
										User attempts to reset a password for the same user account 5 times in one hour.<br\><br\></li>
              </ol>
              <p>To fix this, instruct the user to wait 24 hours after the last attempt, and the user will then be able to reset his or her password.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>User sees an error when validating his or her phone number</p>
            </td>
            <td>
              <p>When attempting to verify a phone to use as an authentication method, the user sees an error stating:</p>
              <p>

              </p>
              <p>Incorrect phone number specified.</p>
            </td>
            <td>
              <p>This error occurs when the phone number entered does not match the phone number on file.</p>
              <p>Make sure the user is entering the complete phone number, including area and country code, when attempting to use a phone-based method for password reset.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Error processing request</p>
            </td>
            <td>
              <p>User sees an error that states:</p>
              <p>

              </p>
              <p>Error processing request </p>
              <p>When attempting to reset a password.</p>
            </td>
            <td>
              <p>This can be caused by many issues, but generally this error is caused by either a service outage or configuration issue that cannot be resolved. </p>
              <p>If you see this error and it is impacting your business, please contact support and we will assist you ASAP. See <a href="#information-to-include-when-you-need-help">Information to include when you need help</a> to see what you should provide to the support engineer to aid in a speedy resolution.</p>
            </td>
          </tr>
        </tbody></table>

## Troubleshoot Password Writeback
If you encounter an error when enabling, disabling, or using Password Writeback, you might be able to resolve it by following the troubleshooting steps below:

<table>
          <tbody><tr>
            <td>
              <p>
                <strong>Error Case</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>What error does a user see?</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>Solution</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>General onboarding and startup failures</p>
            </td>
            <td>
              <p>Password reset service does not start on premises with error 6800 in the Azure AD Connect machine’s application event log.</p>
              <p>

              </p>
              <p>After onboarding, federated or password hash synced users cannot reset their passwords.</p>
            </td>
            <td>
              <p>When Password Writeback is enabled, the sync engine will call the writeback library to perform the configuration (onboarding) by talking to the cloud onboarding service. Any errors encountered during onboarding or while starting the WCF endpoint for Password Writeback will result in errors in the Event log in your Azure AD Connect machine’s event log.</p>
              <p>During restart of ADSync service, if writeback was configured, the WCF endpoint will be started up. However, if the startup of the endpoint fails, we will simply log event 6800 and let the sync service startup. Presence of this event means that the Password Writeback endpoint was not started up. Event log details for this event (6800) along with event log entries generate by PasswordResetService component will indicate why the endpoint could not be started up. Review these event log errors and try to re-start the Azure AD Connect if Password Writeback still isn’t working. If the problem persists, try to disable and re-enable Password Writeback.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Error configuring writeback during Azure AD Connect installation.</p>
            </td>
            <td>
              <p>At the last step of the Azure AD Connect installation process, you see an error indicating that Password Writeback could not be configured.</p>
              <p>

              </p>
              <p>The Azure AD Connect Application event log contains error 32009 with text “Error getting auth token”.</p>
            </td>
            <td>
              <p>This error occurs in the following two cases:</p>
              <ul>
                <li class="unordered">
										You have specified an incorrect password for the global administrator account specified at the beginning of the Azure AD Connect installation process.<br\><br\></li>
              </ul>
              <ul>
                <li class="unordered">
										You have attempted to use a federated user for the global administrator account specified at the beginning of the Azure AD Connect installation process.<br\><br\></li>
              </ul>
              <p>To fix this error, please ensure that you are not using a federated account for the global administrator you specified at the beginning of the Azure AD Connect installation process, and that the password specified is correct.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Error configuring writeback during Azure AD Connect installation.</p>
            </td>
            <td>
              <p>The Azure AD Connect machine event log contains error 32002 thrown by the PasswordResetService.</p>
              <p>

              </p>
              <p>The error reads: “Error Connecting to ServiceBus, The token provider was unable to provide a security token…”</p>
              <p>

              </p>
            </td>
            <td>
              <p>The root cause of this error is that the password reset service running in your on-premises environment is not able to connect to the service bus endpoint in the cloud. This error is normally normally caused by a firewall rule blocking an outbound connection to a particular port or web address.</p>
              <p>

              </p>
              <p>Make sure your firewall allows outbound connections for the following:</p>
              <ul>
                <li class="unordered">
										All traffic over TCP 443 (HTTPS)<br\><br\></li>
              </ul>
              <ul>
                <li class="unordered">
										Outbound connections to <br\><br\></li>
              </ul>
              <p>

              </p>
              <p>Once you have updated these rules, reboot the Azure AD Connect machine and Password Writeback should start working again.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Password Writeback endpoint on-prem not reachable</p>
            </td>
            <td>
              <p>After working for some time, federated or password hash synced users cannot reset their passwords.</p>
            </td>
            <td>
              <p>In some rare cases, the Password Writeback service may fail to re-start when Azure AD Connect has re-started. In these cases, first, check whether Password Writeback appears to be enabled on-prem. This can be done using the Azure AD Connect wizard or powershell (See HowTos section above).If the feature appears to be enabled, try enabling or disabling the feature again either through the UI or PowerShell. See “Step 2: Enable Password Writeback on your Directory Sync computer &amp; configure firewall rules” in <a href="active-directory-passwords-getting-started.md#enable-users-to-reset-or-change-their-ad-passwords">How to enable/disable Password Writeback</a> for more information on how to do this.</p>
              <p>

              </p>
              <p>If this doesn’t work, try completely uninstalling and re-installing Azure AD Connect.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Permissions errors</p>
            </td>
            <td>
              <p>Federated or password hash sync’d users who attempt to reset their passwords see an error after submitting the password indicating there was a service problem.</p>
              <p>

              </p>
              <p>In addition to this, during password reset operations, you may see an error regarding management agent was denied access in your on premises event logs.</p>
            </td>
            <td>
              <p>If you see these errors in your event log, confirm that the AD MA account (that was specified in the wizard at the time of configuration) has the necessary permissions for Password Writeback.</p>
              <p>

              </p>
              <p>NOTE that once this permission is given it can take up to 1 hour for the permissions to trickle down via sdprop background task on the DC. </p>
              <p>For password reset to work, the permission needs to be stamped on the security descriptor of the user object whose password is being reset. Until this permission shows up on the user object, password reset will continue to fail with access denied.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Error when configuring Password Writeback from the Azure AD Connect configuration wizard </p>
            </td>
            <td>
              <p>“Unable to Locate MA” error in Wizard while enabling/disabling Password Writeback</p>
            </td>
            <td>
              <p>There is a known bug in the released version of Azure AD Connect which manifests in the following situation:</p>
              <ol class="ordered">
                <li>
										You configure Azure AD Connect for tenant abc.com (Verified domain) using creds . This results in AAD connector with name “abc.com – AAD” being created.<br\><br\></li>
                <li>
										You then then change the AAD creds for the connector (using old sync UI) to  (note it’s the same tenant but different domain name). <br\><br\></li>
                <li>
										Now you try to enable/disable Password Writeback. The wizard will construct the name of the connector using the creds, as “abc.onmicrosoft.com – AAD” and pass to the Password Writeback cmdlet. This will fail because there is no connector created with this name.<br\><br\></li>
              </ol>
              <p>This has been fixed in our latest builds. If you have an older build, the one workaround is to use the powershell cmdlet to enable/disable the feature. See “Step 2: Enable Password Writeback on your Directory Sync computer &amp; configure firewall rules” in <a href="active-directory-passwords-getting-started.md#enable-users-to-reset-or-change-their-ad-passwords">How to enable/disable Password Writeback</a> for more information on how to do this.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Unable to reset password for users in special groups such as Domain Admins / Enterprise Admins etc.</p>
            </td>
            <td>
              <p>Federated or password hash sync’d users who are part of protected groups and attempt to reset their passwords see an error after submitting the password indicating there was a service problem.</p>
            </td>
            <td>
              <p>Privileged users in Active Directory are protected using AdminSDHolder. See <a href="https://technet.microsoft.com/magazine/2009.09.sdadminholder.aspx">http://technet.microsoft.com/magazine/2009.09.sdadminholder.aspx</a> for more details. </p>
              <p>

              </p>
              <p>This means the security descriptors on these objects are periodically checked to match the one specified in AdminSDHolder and are reset if they are different. The additional permissions that are needed for Password Writeback therefore do not trickle to such users. This can result in Password Writeback not working for such users.As a result, we do not support managing passwords for users within these groups because it breaks the AD security model.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Reset operations fails with Object could not be found</p>
            </td>
            <td>
              <p>Federated or password hash sync’d users who attempt to reset their passwords see an error after submitting the password indicating there was a service problem.</p>
              <p>

              </p>
              <p>In addition to this, during password reset operations, you may see an error in your event logs from the Azure AD Connect service indicating an “Object could not be found” error.</p>
            </td>
            <td>
              <p>This error usually indicates that the sync engine is unable to find either the user object in the AAD connector space or the linked MV or AD connector space object. </p>
              <p>

              </p>
              <p>To troubleshoot this, make sure that the user is indeed synced from on-prem to AAD via the current instance of Azure AD Connect and inspect the state of the objects in the connector spaces and MV. Confirm that the AD CS object is connector to the MV object via the “Microsoft.InfromADUserAccountEnabled.xxx” rule.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Reset operations fails with Multiple matches found eror</p>
            </td>
            <td>
              <p>Federated or password hash sync’d users who attempt to reset their passwords see an error after submitting the password indicating there was a service problem.</p>
              <p>

              </p>
              <p>In addition to this, during password reset operations, you may see an error in your event logs from the Azure AD Connect service indicating a “Multiple maches found” error.</p>
            </td>
            <td>
              <p>This indicates that the sync engine detected that the MV object is connected to more than one AD CS objects via the “Microsoft.InfromADUserAccountEnabled.xxx”. This means that the user has an enabled account in more than one forest. </p>
              <p>

              </p>
              <p>Currently this scenario is not supported for Password Writeback.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Password operations fail with a configuration error.</p>
            </td>
            <td>
              <p>Password operations fail with a configuration error. The application event log contains Azure AD Connect error 6329 with text: 0x8023061f (The operation failed because password synchronization is not enabled on this Management Agent.)</p>
            </td>
            <td>
              <p>This occurs if the Azure AD Connect configuration is changed to add&nbsp;a new AD forest (or to remove and re-add an existing forest) <strong>after</strong> the Password Writeback feature has already been enabled. Password operations for users in such newly added forests will fail. To fix the problem, disable and re-enable the Password Writeback feature after the forest configuration changes have been completed.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Writing back passwords that have been reset by users works properly, but writing back passwords changed by a user or reset for a user by an administrator fails.</p>
            </td>
            <td>
              <p>When attempting to reset a password on behalf of a user from the Azure Management Portal, you see a message stating: “The password reset service running in your on-premises environment does not support administrators resetting user passwords. Please upgrade to the latest version of Azure AD Connect to resolve this.”</p>
            </td>
            <td>
              <p>This occurs when the version of the synchronization engine does not support the particular Password Writeback operation that was used. Versions of Azure AD Connect later than 1.0.0419.0911 support all password management operations, including password reset writeback, password change writeback, and administrator-initiated password reset writeback from the Azure Management Portal.&nbsp; DirSync versions later than 1.0.6862 support password reset writeback only. To resolve this issue, we highly recommend that you install the latest version of Azure AD Connect or Azure Active Directory Connect (for more information, see <a href="active-directory-aadconnect">Directory Integration Tools</a>) to resolve this issue and to get the most out of Password Writeback in your organization.</p>
            </td>
          </tr>
        </tbody></table>


## Password Writeback event log error codes
A best practice when troubleshooting issues with Password Writeback is to inspect that Application Event Log on your Azure AD Connect machine. This event log will contain events from two sources of interest for Password Writeback. The PasswordResetService source will describe operations and issues related to the operation of Password Writeback. The ADSync source will describe operations and issues related to setting passwords in your AD environment.

<table>
          <tbody><tr>
            <td>
              <p>
                <strong>Code</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>Name / Message</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>Source</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>Description</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>6329</p>
            </td>
            <td>
              <p>BAIL: MMS(4924) 0x80230619 – “A restriction prevents the password from being changed to the current one specified.”</p>
            </td>
            <td>
              <p>ADSync</p>
            </td>
            <td>
              <p>This event occurs when the Password Writeback service attempts to set a password on your local directory which does not meet the password age, history, complexity, or filtering requirements of the domain.</p>
              <ul>
                <li class="unordered">
										If you have a minimum password age, and have recently changed the password within that window of time, you will not be able to change the password again until it reaches the specified age in your domain. For testing purposes, minimum age should be set to 0.<br\><br\></li>
              </ul>
              <ul>
                <li class="unordered">
										If you have password history requirements enabled, then you must select a password that has not been used in the last N times, where N is the password history setting. If you do select a password that has been used in the last N times, then you will see a failure in this case. For testing purposes, history should be set to 0.<br\><br\></li>
              </ul>
              <ul>
                <li class="unordered">
										If you have password complexity requirements, all of them will be enforced when the user attempts to change or reset a password.<br\><br\></li>
              </ul>
              <ul>
                <li class="unordered">
										If you have password filters enabled, and a user selects a password which does not meet the filtering criteria, then the reset or change operation will fail.<br\><br\></li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>
              <p>HR 8023042</p>
            </td>
            <td>
              <p>Synchronization Engine returned an error hr=80230402, message=An attempt to get an object failed because there are duplicated entries with the same anchor</p>
            </td>
            <td>
              <p>ADSync</p>
            </td>
            <td>
              <p>This event occurs when the same user id is enabled in multiple domains.  For example, if you are syncing Account/Resource forests, and have the same user id present and enabled in each, this error may occur.  </p>
              <p>This error can also occur if you are using a non-unique anchor attribute (like alias or UPN) and two users share that same anchor attribute.</p>
              <p>To resolve this issue, ensure that you do not have any duplicated users within your domains and that you are using a unique anchor attribute for each user.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>31001</p>
            </td>
            <td>
              <p>PasswordResetStart </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that the on-premises service detected a password reset request for a federated or password hash sync’d user originating from the cloud. This event is the first event in every password reset writeback operation.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>31002</p>
            </td>
            <td>
              <p>PasswordResetSuccess </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that a user selected a new password during a password reset operation, we determined that this password meets corporate password requirements, and that password has been successfully written back to the local AD environment.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>31003</p>
            </td>
            <td>
              <p>PasswordResetFail </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that a user selected a password, and that password arrived successfully to the on-premises environment, but when we attempted to set the password in the local AD environment, a failure occurred. This can happen for several reasons:</p>
              <ul>
                <li class="unordered">
										The user’s password does not meet the age, history, complexity, or filter requirements for the domain. Try a completely new password to resolve this.<br\><br\></li>
              </ul>
              <ul>
                <li class="unordered">
										The MA service account does not have the appropriate permissions to set the new password on the user account in question.<br\><br\></li>
              </ul>
              <ul>
                <li class="unordered">
										The user’s account is in a protected group, such as domain or enterprise admins, which disallows password set operations.<br\><br\></li>
              </ul>
              <p>See <a href="#troubleshoot-password-writeback">Troubleshoot Password Writeback</a> to learn more about what other situtions can cause this error.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>31004</p>
            </td>
            <td>
              <p>OnboardingEventStart </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event occurs if you enable Password Writeback with Azure AD Connect and indicates that we started onboarding your organization to the Password Writeback web service.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>31005</p>
            </td>
            <td>
              <p>OnboardingEventSuccess </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates the onboarding process was successful and that Password Writeback capability is ready to use.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>31006</p>
            </td>
            <td>
              <p>ChangePasswordStart </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that the on-premises service detected a password change request for a federated or password hash sync’d user originating from the cloud. This event is the first event in every password change writeback operation.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>31007</p>
            </td>
            <td>
              <p>ChangePasswordSuccess </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that a user selected a new password during a password change operation, we determined that this password meets corporate password requirements, and that password has been successfully written back to the local AD environment.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>31008</p>
            </td>
            <td>
              <p>ChangePasswordFail </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that a user selected a password, and that password arrived successfully to the on-premises environment, but when we attempted to set the password in the local AD environment, a failure occurred. This can happen for several reasons:</p>
              <ul>
                <li class="unordered">
										The user’s password does not meet the age, history, complexity, or filter requirements for the domain. Try a completely new password to resolve this.<br\><br\></li>
              </ul>
              <ul>
                <li class="unordered">
										The MA service account does not have the appropriate permissions to set the new password on the user account in question.<br\><br\></li>
              </ul>
              <ul>
                <li class="unordered">
										The user’s account is in a protected group, such as domain or enterprise admins, which disallows password set operations.<br\><br\></li>
              </ul>
              <p>See <a href="#troubleshoot-password-writeback">Troubleshoot Password Writeback</a> to learn more about what other situations can cause this error.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>31009</p>
            </td>
            <td>
              <p>ResetUserPasswordByAdminStart </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>The on-premises service detected a password reset request for a federated or password hash sync’d user originating from the administrator on behalf of a user. This event is the first event in every admin-initiated password reset writeback operation.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>31010</p>
            </td>
            <td>
              <p>ResetUserPasswordByAdminSuccess </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>The admin selected a new password during an admin-initiated password reset operation, we determined that this password meets corporate password requirements, and that password has been successfully written back to the local AD environment.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>31011</p>
            </td>
            <td>
              <p>ResetUserPasswordByAdminFail </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>The admin selected a password on behalf of a user, and that password arrived successfully to the on-premises environment, but when we attempted to set the password in the local AD environment, a failure occurred. This can happen for several reasons:</p>
              <ul>
                <li class="unordered">
										The user’s password does not meet the age, history, complexity, or filter requirements for the domain. Try a completely new password to resolve this.<br\><br\></li>
              </ul>
              <ul>
                <li class="unordered">
										The MA service account does not have the appropriate permissions to set the new password on the user account in question.<br\><br\></li>
              </ul>
              <ul>
                <li class="unordered">
										The user’s account is in a protected group, such as domain or enterprise admins, which disallows password set operations.<br\><br\></li>
              </ul>
              <p>See <a href="#troubleshoot-password-writeback">Troubleshoot Password Writeback</a> to learn more about what other situtions can cause this error.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>31012</p>
            </td>
            <td>
              <p>OffboardingEventStart </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event occurs if you disable Password Writeback with Azure AD Connect and indicates that we started offboarding your organization to the Password Writeback web service.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>31013</p>
            </td>
            <td>
              <p>OffboardingEventSuccess </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates the offboarding process was successful and that Password Writeback capability has been successfully disabled.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>31014</p>
            </td>
            <td>
              <p>OffboardingEventFail </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates the offboarding process was not successful. This could be due to a permissions error on the cloud or on-premises administrator account specified during configuration, or because you are attempting to use a federated cloud global administrator when disabling Password Writeback. To fix this, check your administrative permissions and that you are not using any federated account while configuring the Password Writeback capability.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>31015</p>
            </td>
            <td>
              <p>WriteBackServiceStarted </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that the Password Writeback service has started successfully and is ready to accept password management requests from the cloud.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>31016</p>
            </td>
            <td>
              <p>WriteBackServiceStopped </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that the Password Writeback service has stopped and that any password management requests from the cloud will not be successful.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>31017</p>
            </td>
            <td>
              <p>AuthTokenSuccess </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that we successfully retrieved an authorization token for the global admin specified during Azure AD Connect setup in order to start the offboarding or onboarding process.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>31018</p>
            </td>
            <td>
              <p>KeyPairCreationSuccess </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that we successfully created the password encryption key that will be used to encrypt passwords from the cloud to be sent to your on-premises environment.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>32000</p>
            </td>
            <td>
              <p>UnknownError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates an unknown error during a password management operation. Look at the exception text in the event for more details. If you are having problems, try disabling and re-enabling Password Writeback. If this does not help, include a copy of your event log along with the tracking id specified insider to your support engineer.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>32001</p>
            </td>
            <td>
              <p>ServiceError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates there was an error connecting to the cloud password reset service, and generally occurs when the on-premises service was unable to connect to the password reset web service. </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>32002</p>
            </td>
            <td>
              <p>ServiceBusError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates there was an error connecting to your tenant’s service bus instance. This could happen because you are blocking outbound connections in your on-premises environment. Check your firewall to ensure you allow connections over TCP 443 and to <a href="https://ssprsbprodncu-sb.accesscontrol.windows.net/">https://ssprsbprodncu-sb.accesscontrol.windows.net/</a>, and try again. If you are still having problems, try disabling and re-enabling Password Writeback.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>32003</p>
            </td>
            <td>
              <p>InPutValidationError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that the input passed to our web service API was invalid. Try the operation again.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>32004</p>
            </td>
            <td>
              <p>DecryptionError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that there was an error decrypting the password that arrived from the cloud. This could be because of a decryption key mismatch between the cloud service and your on-premises environment. In order to resolve this, disable and re-enable Password Writeback in your on-premises environment.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>32005</p>
            </td>
            <td>
              <p>ConfigurationError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>During onboarding, we save tenant-specific information in a configuration file in your on-premises environment. This event indicates there was an error saving this file or that when the service was started there was an error reading the file. To fix this issue, try disabling and re-enabling Password Writeback to force a re-write of this configuration file. </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>32006</p>
            </td>
            <td>
              <p>EndPointConfigurationError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>DEPRECATED – This event is not present in Azure AD Connect, only very early builds of DirSync which supported writeback.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>32007</p>
            </td>
            <td>
              <p>OnBoardingConfigUpdateError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>During onboarding, we send data from the cloud to the on-premises password reset service. That data is then written to an in-memory file before being sent to the sync service to store this information securely on disk. This event indicates a problem with writing or updating that data in memory. To fix this issue, try disabling and re-enabling Password Writeback to force a re-write of this configuration.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>32008</p>
            </td>
            <td>
              <p>ValidationError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates we received an invalid response from the password reset web service. To fix this issue, try disabling and re-enabling Password Writeback.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>32009</p>
            </td>
            <td>
              <p>AuthTokenError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that we could not get an authorization token for the global administrator account specified during Azure AD Connect setup. This error can be caused by a bad username or password specified for the global admin account or because the global admin account specified is federated. To fix this issue, re-run configuration with the correct username and password and ensure the administrator is a managed (cloud-only or password-sync’d) account.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>32010</p>
            </td>
            <td>
              <p>CryptoError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates there was an error when generating the password encryption key or decrypting a password that arrives from the cloud service. This error likely indicates an issue with your environment. Look at the details of your event log to learn more and resolve this issue. You may also try disabling and re-enabling the Password Writeback service to resolve this.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>32011</p>
            </td>
            <td>
              <p>OnBoardingServiceError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that the on-premises service could not properly communicate with the password reset web service to initiate the onboarding process. This may be because of a firewall rule or problem getting an auth token for your tenant. To fix this, ensure that you are not blocking outbound connections over TCP 443 and TCP 9350-9354 or to <a href="https://ssprsbprodncu-sb.accesscontrol.windows.net/">https://ssprsbprodncu-sb.accesscontrol.windows.net/</a>, and that the AAD admin account you are using to onboard is not federated. </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>32012</p>
            </td>
            <td>
              <p>OnBoardingServiceDisableError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>DEPRECATED – This event is not present in Azure AD Connect, only very early builds of DirSync which supported writeback.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>32013</p>
            </td>
            <td>
              <p>OffBoardingError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that the on-premises service could not properly communicate with the password reset web service to initiate the offboarding process. This may be because of a firewall rule or problem getting an authorization token for your tenant. To fix this, ensure that you are not blocking outbound connections over 443 or to <a href="https://ssprsbprodncu-sb.accesscontrol.windows.net/">https://ssprsbprodncu-sb.accesscontrol.windows.net/</a>, and that the AAD admin account you are using to offboard is not federated. </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>32014</p>
            </td>
            <td>
              <p>ServiceBusWarning </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that we had to retry to connect to your tenant’s service bus instance. Under normal conditions, this should not be a concern, but if you see this event many times, consider checking your network connection to service bus, especially if it’s a high latency or low-bandwidth connection.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>32015</p>
            </td>
            <td>
              <p>ReportServiceHealthError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>In order to monitor the health of your Password Writeback service, we send heartbeat data to our password reset web service every 5 minutes. This event indicates that there was an error when sending this health information back to the cloud web service. This health information does not include an OII or PII data, and is purely a heartbeat and basic service statistics so that we can provide service status information in the cloud.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>33001</p>
            </td>
            <td>
              <p>ADUnKnownError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that there was an unknown error returned by AD, check the Azure AD Connect server event log for events from the ADSync source for more information about this error.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>33002</p>
            </td>
            <td>
              <p>ADUserNotFoundError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that the user who is trying to reset or change a password was not found in the on-premises directory. This could occur when the user has been deleted on-premises but not in the cloud, or if there is an issue with sync. Check your sync logs, as well as the last few sync run details for more information.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>33003</p>
            </td>
            <td>
              <p>ADMutliMatchError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>When a password reset or change request originates from the cloud, we use the cloud anchor specified during the setup process of Azure AD Connect to determine how to link that request back to a user in your on-premises environment. This event indicates that we found two users in your on-premises directory with the same cloud anchor attribute. Check your sync logs, as well as the last few sync run details for more information.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>33004</p>
            </td>
            <td>
              <p>ADPermissionsError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that the Management Agent service account does not have the appropriate permissions on the account in question to set a new password. Ensure that the MA account in the user’s forest has Reset and Change password permissions on all objects in the forest.  For more information on how do to this, see <a href="active-directory-passwords-getting-started.md#step-4-set-up-the-appropriate-active-directory-permissions">Step 4: Set up the appropriate Active Directory permissions</a>.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>33005</p>
            </td>
            <td>
              <p>ADUserAccountDisabled </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that we attempted to reset or change a password for an account that was disabled on premises. Enable the account and try the operation again.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>33006</p>
            </td>
            <td>
              <p>ADUserAccountLockedOut </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>Event indicates that we attempted to reset or change a password for an account that was locked out on premises. Lockouts can occur when a user has tried a change or reset password operation too many times in a short period. Unlock the account and try the operation again.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>33007</p>
            </td>
            <td>
              <p>ADUserIncorrectPassword </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates that the user specified an incorrect current password when performing a password change operation. Specify the correct current password and try again.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>33008</p>
            </td>
            <td>
              <p>ADPasswordPolicyError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event occurs when the Password Writeback service attempts to set a password on your local directory which does not meet the password age, history, complexity, or filtering requirements of the domain.</p>
              <ul>
                <li class="unordered">
										If you have a minimum password age, and have recently changed the password within that window of time, you will not be able to change the password again until it reaches the specified age in your domain. For testing purposes, minimum age should be set to 0.<br\><br\></li>
              </ul>
              <ul>
                <li class="unordered">
										If you have password history requirements enabled, then you must select a password that has not been used in the last N times, where N is the password history setting. If you do select a password that has been used in the last N times, then you will see a failure in this case. For testing purposes, history should be set to 0.<br\><br\></li>
              </ul>
              <ul>
                <li class="unordered">
										If you have password complexity requirements, all of them will be enforced when the user attempts to change or reset a password.<br\><br\></li>
              </ul>
              <ul>
                <li class="unordered">
										If you have password filters enabled, and a user selects a password which does not meet the filtering criteria, then the reset or change operation will fail.<br\><br\></li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>
              <p>33009</p>
            </td>
            <td>
              <p>ADConfigurationError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>This event indicates there was an issue writing a password back to your on-premises directory due to a configuration issue with Active Directory. Check the Azure AD Connect machine’s Application event log for messages from the ADSync service for more information on what error occurred. </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>34001</p>
            </td>
            <td>
              <p>ADPasswordPolicyOrPermissionError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>DEPRECATED – This event is not present in Azure AD Connect, only very early builds of DirSync which supported writeback.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>34002</p>
            </td>
            <td>
              <p>ADNotReachableError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>DEPRECATED – This event is not present in Azure AD Connect, only very early builds of DirSync which supported writeback.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>34003</p>
            </td>
            <td>
              <p>ADInvalidAnchorError </p>
            </td>
            <td>
              <p>PasswordResetService</p>
            </td>
            <td>
              <p>DEPRECATED – This event is not present in Azure AD Connect, only very early builds of DirSync which supported writeback.</p>
            </td>
          </tr>
        </tbody></table>

## Troubleshoot Password Writeback connectivity

If you are experiencing service interruptions with the Password Writeback component of Azure AD Connect, here are some quick steps you can take to resolve this:

 - [Restart the Azure AD Connect Sync Service](#restart-the-azure-AD-Connect-sync-service)
 - [Disable and re-enable the Password Writeback feature](#disable-and-re-enable-the-password-writeback-feature)
 - [Install the latest Azure AD Connect release](#install-the-latest-azure-ad-connect-release)
 - [Troubleshoot Password Writeback](#troubleshoot-password-writeback)

In general, we recommend that you execute these steps in the order above in order to recover your service in the most rapid manner.

### Restart the Azure AD Connect Sync Service
Restarting the Azure AD Connect Sync Service can help to resolve connectivity issues or other transient issues with the service.

 1.	As an administrator, click **Start** on the server running **Azure AD Connect**.
 2.	Type **“services.msc”** in the search box and press **Enter**.
 3.	Look for the **Microsoft Azure AD Connect** entry.
 4.	Right-click on the service entry, click **Restart**, and wait for the operation to complete.

    ![][002]

These steps will re-establish your connection with the cloud service and resolve any interruptions you may be experiencing.  If restarting the Sync Service does not resolve your issue, we recommend that you try to disable and re-enable the Password Writeback feature as a next step.

### Disable and re-enable the Password Writeback feature
Disabling and re-enabling the Password Writeback feature can help to resolve connectivity issues.

 1.	As an administrator, open the **Azure AD Connect configuration wizard**.
 2.	On the **Connect to Azure AD** dialog, enter your **Azure AD global admin credentials**
 3.	On the **Connect to AD DS** dialog, enter your **AD Domain Services admin credentials**.
 4.	On the **Uniquely identifying your users** dialog, click the **Next** button.
 5.	On the **Optional features** dialog, uncheck the **Password write-back** checkbox.

    ![][003]

 6.	Click **Next** through the remaining dialog pages without changing anything until you get to the **Ready to configure** page.
 7.	Ensure that the configure page shows the **Password write-back option as disabled** and then click the green **Configure** button to commit your changes.
 8.	On the **Finished** dialog, deselect the **Synchronize now** option, and then click **Finish** to close the wizard.
 9.	Re-open the **Azure AD Connect configuration wizard**.
 10.	**Repeat steps 2-8**, except ensure you **check the Password write-back option** on the **Optional features** screen to re-enable the service.

    ![][004]

These steps will re-establish your connection with our cloud service and resolve any interruptions you may be experiencing.

If disabling and re-enabling the Password Writeback feature does not resolve your issue, we recommend that you try to re-install Azure AD Connect as a next step.

### Install the latest Azure AD Connect release
Re-installing the Azure AD Connect package will resolve any configuration issues which may be affecting your ability to either connect to our cloud services or to manage passwords in your local AD environment.
We recommend, you perform this step only after attempting the first two steps described above.

 1.	Download the latest version of Azure AD Connect [here](active-directory-aadconnect.md#install-azure-ad-connect).
 2.	Since you have already installed Azure AD Connect, you will only need to perform an in-place upgrade to update your Azure AD Connect installation to the latest version.
 3.	Execute the downloaded package and follow the on-screen instructions to update your Azure AD Connect machine.  No additional manual steps are required unless you have customized the out of box sync rules, in which case you should **back these up before proceeding with upgrade and manually re-deploy them after you are finished**.

These steps will re-establish your connection with our cloud service and resolve any interruptions you may be experiencing.

If installing the latest version of the Azure AD Connect server does not resolve your issue, we recommend that you try disabling and re-enabling Password Writeback as a final step after installing the latest sync QFE.

If that does not resolve your issue, then we recommend that you take a look at [Troubleshoot Password Writeback](#troubleshoot-password-writeback) and the [Azure AD password Management FAQ](active-directory-passwords-faq.md) to see if your issue may be discussed there.


<br/>
<br/>
<br/>

## Links to password reset documentation
Below are links to all of the Azure AD Password Reset documentation pages:

* **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md).
* [**How it works**](active-directory-passwords-how-it-works.md) - learn about the six different components of the service and what each does
* [**Getting started**](active-directory-passwords-getting-started.md) - learn how to allow you users to reset and change their cloud or on-premises passwords
* [**Customize**](active-directory-passwords-customize.md) - learn how to customize the look & feel and behavior of the service to your organization's needs
* [**Best practices**](active-directory-passwords-best-practices.md) - learn how to quickly deploy and effectively manage passwords in your organization
* [**Get insights**](active-directory-passwords-get-insights.md) - learn about our integrated reporting capabilities
* [**FAQ**](active-directory-passwords-faq.md) - get answers to frequently asked questions
* [**Learn more**](active-directory-passwords-learn-more.md) - go deep into the technical details of how the service works



[001]: ./media/active-directory-passwords-troubleshoot/001.jpg "Image_001.jpg"
[002]: ./media/active-directory-passwords-troubleshoot/002.jpg "Image_002.jpg"
[003]: ./media/active-directory-passwords-troubleshoot/003.jpg "Image_003.jpg"
[004]: ./media/active-directory-passwords-troubleshoot/004.jpg "Image_004.jpg"
