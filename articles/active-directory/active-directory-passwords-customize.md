<properties 
	pageTitle="Customize: Azure AD Password Management | Microsoft Azure" 
	description="How to customize Password Management look and feel, behavior, and notifications in Azure AD to meet your needs." 
	services="active-directory" 
	documentationCenter="" 
	authors="asteen" 
	manager="kbrint" 
	editor="billmath"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/08/2015" 
	ms.author="asteen"/>

# Customizing Password Management to fit your organization's needs
In order to give your users the best possible experience, we recommend that you explore and play with all of the Password Management configuration options available to you. In fact, you can start exploring this right away by going to the configuration tab of the **Active Directory extension** in the [Azure Management Portal](https://manage.windowsazure.com). This topic walks you through all of the different Password Management customizations you can make as an administrator from within **Configure** tab of your directory within the [Azure Management Portal](https://manage.windowsazure.com), including:

- [**Customizing Password Management Look and Feel**](#password-managment-look-and-feel)
- [**Customizing User Password Management Behavior**](#password-management-behavior)
- [**Customizing Password Management Notifications**](#password-management-notifications)

## Password managment look and feel
The following table describes how each control affects the experience for users registering for password reset and resetting their passwords.  You can configure these options under the **Directory Properties** section of your directory’s **Configure** tab within the [Azure Management Portal](https://manage.windowsazure.com).

<table>
            <tbody><tr>
              <td>
                <p>
                  <strong>Policy Control</strong>
                </p>
              </td>
              <td>
                <p>
                  <strong>Description</strong>
                </p>
              </td>
              <td>
                <p>
                  <strong>Affects?</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Directory Name</p>
              </td>
              <td>
                <p>Determines what organizational name users or admins see on password reset email communications</p>
              </td>
              <td>
                <p>
                  <strong>”Contact your administrator” emails:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Determines the from address friendly name, e.g. “Microsoft on behalf of <strong>Wingtip Toys</strong>”<br><br></li>
                  <li class="unordered">
												Determines the subject name of the email, e.g. “<strong>Wingtip Toys</strong> account email verification code”<br><br></li>
                </ul>
                <p>
                  <strong>Password reset emails:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Determines the from address friendly name, e.g. “Microsoft on behalf of <strong>Wingtip Toys</strong>”<br><br></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <p>Sign in and access panel page appearance</p>
              </td>
              <td>
                <p>Determines if users visiting the password reset page see the Microsoft logo or your own custom logo.  This configuration item also adds your branding to the access panel and sign in page.</p>
                <p>
                  
                </p>
                <p>You can learn more about the tenant branding and customization feature at <a href="https://technet.microsoft.com/library/dn532270.aspx">Add company branding to your Sign In and Access Panel pages</a>.</p>
              </td>
              <td>
                <p>
                  <strong>Password reset portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Determines whether or not your logo is shown at the top of the password reset portal instead of the default Microsoft logo.<br><br></li>
                  <li class="unordered">
                    <strong>Note:</strong> you may not see your logo on the first page of the password reset portal if you come to the password reset page directly.  Once a user enters his or her userID and clicks next, your logo will appear.  You can force your logo to appear on page load by passing the whr parameter to the password reset page, like this: <a href="https://passwordreset.microsoftonline.com?whr=wingtiptoysonline.com">https://passwordreset.microsoftonline.com?whr=wingtiptoysonline.com</a><br><br></li>
                </ul>
                <p>
                  <strong>”Contact your administrator” emails:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Determines whether or not your logo is shown at the bottom of the emails sent to admins when users choose to contact you by clicking the “contact your administrator” link on the password reset UI.<br><br></li>
                </ul>
                <p>
                  <strong>Password reset emails:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Determines whether or not your logo is shown at the bottom of the emails sent to users when they reset their passwords.<br><br></li>
                </ul>
              </td>
            </tr>
          </tbody></table>

## Password Management behavior
The following table describes how each control affects the experience for users registering for password reset and resetting their passwords.  You can configure these options under the **User Password Reset Policy** section of your directory’s **Configure** tab in the [Azure Management Portal](https://manage.windowsazure.com).

> [AZURE.NOTE] The administrator account you are using must have an AAD Premium license assigned in order to see these policy controls.<br><br>These policy controls only apply to end users resetting their passwords, not administrators.  **Administrators have a default policy of alternate email and/or mobile phone that is specified for them by Microsoft which cannot be changed.**

<table>
            <tbody><tr>
              <td>
                <p>
                  <strong>Policy Control</strong>
                </p>
              </td>
              <td>
                <p>
                  <strong>Description</strong>
                </p>
              </td>
              <td>
                <p>
                  <strong>Affects?</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Users enabled for password reset</p>
              </td>
              <td>
                <p>Determines if password reset is enabled for users in this directory. </p>
              </td>
              <td>
                <p>
                  <strong>Registration portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												If set to no, no users can register their own challenge data.<br><br></li>
                  <li class="unordered">
												If set to yes, any end user in the directory can register challenge data by going to the registration portal at <a href="http://aka.ms/ssprsetup">http://aka.ms/ssprsetup</a>.<br><br></li>
                  <li class="unordered">
                    <strong>Note:</strong> users must have an Azure AD Premium or Basic license assigned before they can register for password reset.<br><br></li>
                </ul>
                <p>
                  <strong>Password reset portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												If set to no, users see a message saying the must contact their admin to reset their password.<br><br></li>
                  <li class="unordered">
												If set to yes, users are able to reset their passwords automatically by going to  <a href="http://passwordreset.microsoftonline.com">http://passwordreset.microsoftonline.com</a>, or clicking on the <strong>can’t access your account</strong> link on any Organizational ID sign-in page.<br><br></li>
                  <li class="unordered">
                    <strong>Note:</strong> users must have an Azure AD Premium or Basic license assigned before they can reset their passwords.<br><br></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <p>Restrict access to password reset</p>
              </td>
              <td>
                <p>Determines whether only a particular group of users is allowed to use password reset. (Only visible if <strong>users enabled for password reset</strong> is set to <strong>yes</strong>).</p>
              </td>
              <td>
                <p>
                  <strong>Registration portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												If set to no, then all end users in your directory can register for password reset at <a href="http://aka.ms/ssprsetup">http://aka.ms/ssprsetup</a><br><br></li>
                  <li class="unordered">
												If set to yes, then only end users specified in the <strong>group that can perform password reset</strong> control can register for password reset at  <a href="http://aka.ms/ssprsetup">http://aka.ms/ssprsetup</a><br><br></li>
                </ul>
                <p>
                  <strong>Password reset portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												If set to no, then all end users in your directory can reset their passwords.<br><br></li>
                  <li class="unordered">
												If set to yes, then only end users specified in the <strong>group that can perform password reset</strong> control can reset their passwords.<br><br></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <p>Group that can perform password reset</p>
              </td>
              <td>
                <p>Determines what group of end users is allowed to use password reset. </p>
                <p>
                  
                </p>
                <p>(Only visible if <strong>restrict access to password reset</strong> is set to <strong>yes</strong>).</p>
              </td>
              <td>
                <p>
                  <strong>Note:</strong>
                </p>
                <ul>
                  <li class="unordered">
												If no group is specified and you click <strong>Save</strong>, an empty group called <strong>SSPRSecurityGroupUsers</strong> will be created for you.<br><br></li>
                  <li class="unordered">
												If you’d like to specify your own group, you can provide your own display name.<br><br></li>
                </ul>
                <p>
                  <strong>Registration portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												If <strong>restrict access to password reset</strong> is set to <strong>yes</strong>, then only end users in this group will be able to register for password reset. <br><br></li>
                </ul>
                <p>
                  <strong>Password reset portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												If <strong>restrict access to password reset</strong> is set to <strong>yes</strong>, then only end users in this group will be able to reset their passwords.<br><br></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <p>Authentication methods available to users</p>
              </td>
              <td>
                <p>Determines which challenges a user is allowed to use to reset his or her password.</p>
                <p>
                  
                </p>
                <p>(Only visible if <strong>users enabled for password reset</strong> is set to <strong>yes</strong>).</p>
              </td>
              <td>
                <p>
                  
                </p>
                <p>
                  
                </p>
                <p>
                  <strong>Note:</strong>
                </p>
                <ul>
                  <li class="unordered">
												At least one option must be selected.<br><br></li>
                  <li class="unordered">
												We highly recommend enabling at least 2 options to give your users the most flexibility when resetting their passwords.<br><br></li>
                  <li class="unordered">
												If you are using security questions, we highly recommend you use them in conjunction with another authentication method, as security questions can be less secure than phone or email-based password reset methods.<br><br></li>
                </ul>
                <p>
                  <strong>Which directory fields are used?</strong>
                </p>
                <ul>
                  <li class="unordered">
												Office Phone corresponds to the <strong>Office Phone</strong> attribute on a user object in the directory.<br><br></li>
                  <li class="unordered">
												Mobile Phone corresponds to either the <strong>Authentication Mobile</strong> attribute (which is not publically visible) or the <strong>Mobile Phone</strong> attribute (which is publically visible) on a user object in the directory.  The service first checks <strong>Authentication Phone</strong> for data, and if there is none present, falls back to the <strong>Mobile Phone</strong> attribute.<br><br></li>
                  <li class="unordered">
												Alternate Email Address corresponds to either the <strong>Authentication Email</strong> attribute (which is not publically visible) or the <strong>Alternate Email</strong> attribute on a user object in the directory.  The service first checks <strong>Authentication Email</strong> for data, and if there is none present, falls back to the <strong>Alternate Email</strong> attribute.<br><br></li>
                  <li class="unordered">
												Security Questions are stored privately and securely on a user object in the directory and can only be answered by users during registration.  For security purposes, there is currently no way for an administrator to edit or see these answers.<br><br></li>
                  <li class="unordered">
                    <strong>Note: </strong>by default, only the cloud attributes Office Phone and Mobile Phone are synchronized to your cloud directory from your on-premises directory.  To learn more about which on-premises attributes are synced to the cloud, see <a href="https://msdn.microsoft.com/library/azure/dn764938.aspx">Attributes synchronized to Azure AD.</a><br><br></li>
                </ul>
                <p>
                  <strong>Registration portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Affects which authentication methods are displayed when users are registering.  If you do not enable a given authentication method, users will not be able to self-register for that authentication method.<br><br></li>
                  <li class="unordered">
                    <strong>Note: </strong>users are currently not able to register their own office phone numbers; that authentication method must be defined by their administrator.<br><br></li>
                </ul>
                <p>
                  <strong>Password reset portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Determines which authentication methods a user can use as challenges for a given verification step.  For example, if a user has data in both the <strong>Office Phone</strong> and <strong>Authentication Phone</strong> fields in Azure Active Directory, then he or she can use either of these authentication methods to recover his or her password.<br><br></li>
                  <li class="unordered">
                    <strong>Note: </strong>users will be able to reset their password if and only if they have data present in the authentication methods you have enabled as an administrator.<br><br></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <p>Number of authentication methods required</p>
              </td>
              <td>
                <p>Determines the minimum number of the available authentication methods a user must go through to reset his or her password.</p>
                <p>
                  
                </p>
                <p>(Only visible if <strong>users enabled for password reset</strong> is set to <strong>yes</strong>).</p>
              </td>
              <td>
                <p>
                  <strong>Note:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Can be set to 1 or 2 authentication methods required.<br><br></li>
                </ul>
                <p>
                  <strong>Registration portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Determines the minimum number of authentication methods a user must register before being able to finish the registration experience.<br><br></li>
                </ul>
                <p>
                  <strong>Password reset portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Affects number of verification steps a user must go through before being able to reset a password.  A verification step is defined to be a user using one piece of authentication information (such as a call to their office phone, or an email to their alternate email) to verify their account.<br><br></li>
                  <li class="unordered">
                    <strong>Note:</strong> If a user does not have the required amount of authentication information defined on his or her account in order to be successful resetting his or her password in accordance with the policy you’ve set, he or she will see an error page which will direct them to request an administrator to reset his or her password.  <br><br></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <p>Number of question required to register</p>
              </td>
              <td>
                <p>Determines the minimum number of questions a user must answer when registering for the security questions option.</p>
                <p>(Only visible if the <strong>Security Questions</strong> checkbox is enabled).</p>
              </td>
              <td>
                <p>
                  <strong>Note:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Can be set to 3 – 5 questions required to register.<br><br></li>
                  <li class="unordered">
												Number of questions required to register must be greater than or equal to the number of questions required to reset.<br><br></li>
                  <li class="unordered">
												We recommend you set the number of questions required to register to be higher than the number required to reset so users have more flexibility when resetting their passwords.  This is also a more secure configuration because we will randomly select questions for the user to answer from the pool of all of the questions they have registered.<br><br></li>
                </ul>
                <p>
                  <strong>Registration portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Determines the minimum number of questions a user must answer before the user is considered fully registered for password reset.<br><br></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <p>Number of question required to reset </p>
              </td>
              <td>
                <p>Determines the minimum number of questions a user must answer when resetting a password.</p>
                <p>
                  
                </p>
                <p>(Only visible if the <strong>Security Questions</strong> checkbox is enabled).</p>
              </td>
              <td>
                <p>
                  <strong>Note:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Can be set to 3 – 5 questions required to reset.<br><br></li>
                  <li class="unordered">
												Number of questions required to reset must be less than or equal to the number of questions required to register.<br><br></li>
                </ul>
                <p>
                  <strong>Password reset portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Determines the minimum number of questions a user must answer before the user’s password can be reset.<br><br></li>
                  <li class="unordered">
												At the time of password reset, this number of questions will be selected at random from the user’s total list of registered questions.  For example, if the user has 5 questions registered, 3 of those 5 questions will be selected at random when the user comes to reset a password.  The user must then answer all of these questions correctly before the password can be reset.<br><br></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <p>Security question</p>
              </td>
              <td>
                <p>Defines the security questions your users may choose from when registering for password reset and when resetting their passwords.</p>
                <p>
                  
                </p>
                <p>(Only visible if the <strong>Security Questions</strong> checkbox is enabled).</p>
              </td>
              <td>
                <p>
                  <strong>Note:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Up to 20 questions can be defined.<br><br></li>
                  <li class="unordered">
												Max question character limit is 200 characters.<br><br></li>
                  <li class="unordered">
												Min answer character limit is 3 characters.<br><br></li>
                  <li class="unordered">
												Max answer character limit is 40 characters.<br><br></li>
                  <li class="unordered">
												Users may not answer the same question twice.<br><br></li>
                  <li class="unordered">
												Users may not provide the same answer to two different questions twice.<br><br></li>
                  <li class="unordered">
												Any character set may be used to define questions and answer (including Unicode characters).<br><br></li>
                  <li class="unordered">
												The number of questions defined must be greater than or equal to the number of questions required to register.<br><br></li>
                  <li class="unordered">
												Defining different questions for different locales is not yet supported, but will be in the future.<br><br></li>
                </ul>
                <p>
                  <strong>Registration portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Determines which questions a user is able to provide answers for when registering for password reset.<br><br></li>
                </ul>
                <p>
                  <strong>Password reset portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Determines which questions a user is able to use to reset a password.<br><br></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <p>Require users to register when signing in to the access panel?</p>
                <p>
                  
                </p>
              </td>
              <td>
                <p>Determines if a user is required to register contact data for password reset the next time he or she signs in to the access panel.</p>
                <p>
                  
                </p>
                <p>(Only visible if <strong>users enabled for password reset</strong> is set to <strong>yes</strong>).</p>
              </td>
              <td>
                <p>
                  
                </p>
                <p>
                  
                </p>
                <p>
                  <strong>Note:</strong>
                </p>
                <ul>
                  <li class="unordered">
												If you disable this feature, you can also manually send users to <a href="http://aka.ms/ssprsetup">http://aka.ms/ssprsetup</a> to register their contact data.  <br><br></li>
                  <li class="unordered">
												Users can also reach the registration portal by clicking the <strong>register for password reset</strong> link under the profile tab in the access panel.<br><br></li>
                  <li class="unordered">
												Registration via this method can be dismissed by clicking the cancel button or closing the window, but users will be nagged every time they sign in if they do not register.<br><br></li>
                </ul>
                <p>
                  <strong>Registration portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												This setting does not affect the behavior of the registration portal itself, rather, it determines whether or not the registration portal is shown to users when they sign in to the access panel.<br><br></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <p>Number of days before users must confirm their contact data</p>
              </td>
              <td>
                <p>When <strong>require users to register</strong> is turned on, this setting determines the period of time which can elapse before a user must re-confirm their data. </p>
                <p>
                  
                </p>
                <p>(Only visible if <strong>require users to register when signing in to the access panel</strong> is set to <strong>yes</strong>).</p>
              </td>
              <td>
                <p>
                  
                </p>
                <p>
                  
                </p>
                <p>
                  <strong>Note: </strong>
                </p>
                <ul>
                  <li class="unordered">
												Values between 0-730 days are accepted, with 0 days meaning that users will never be asked to re-confirm their contact data.<br><br></li>
                </ul>
                <p>
                  <strong>Registration portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												This setting does not affect the behavior of the registration portal itself, rather, it determines whether or not the registration portal is shown to users when their contact data needs to be reconfirmed. <br><br></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <p>Customize the contact your administrator link?</p>
              </td>
              <td>
                <p>Controls whether or not the contact your administrator link (shown to the left) that appears on the password reset portal when an error occurs or a user waits too long on an operation points to a custom URL or email address.</p>
                <p>
                  
                </p>
                <p>(Only visible if <strong>users enabled for password reset</strong> is set to <strong>yes</strong>).</p>
              </td>
              <td>
                <p>
                  <strong>Note: </strong>
                </p>
                <ul>
                  <li class="unordered">
												If you enable this setting, you must choose a custom URL or email address by filling out the <strong>custom email address or url</strong> field immediately below this setting.<br><br></li>
                </ul>
                <p>
                  <strong>Password reset portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												If set to no, users clicking the highlighted link will dispatch an email to the primary email address of all tenant administrators requesting that his or her password be reset.  This email is dispatched by following the logic below:<br><br></li>
                  <li class="unordered">
                    <ul>
                      <li class="unordered">
														If there are password administrators, send the email to all password administrators, up to a maximum of 100 total recipients.<br><br></li>
                      <li class="unordered">
														If there are no password administrators, send the email to all user administrators, up to a maximum of 100 total recipients.<br><br></li>
                      <li class="unordered">
														If there are no user administrators, send the email to all global administrators, up to a maximum of 100 total recipients.<br><br></li>
                    </ul>
                  </li>
                  <li class="unordered">
												If set to yes, this setting will customize the behavior of the highlighted link above to point to a custom URL or email address to which your users can navigate to get help with password reset.<br><br></li>
                  <li class="unordered">
												If you specify a URL, it will be opened in a new tab.<br><br></li>
                  <li class="unordered">
												If you specify an email address, we’ll create a mailto link to that email address.<br><br></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <p>Custom email address or URL</p>
              </td>
              <td>
                <p>Controls the email address or URL to which the <strong>contact your administrator</strong> link points. </p>
                <p>
                  
                </p>
                <p>(Only visible if <strong>customize contact your administrator link</strong> is set to <strong>yes</strong>).</p>
              </td>
              <td>
                <p>
                  <strong>Note:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Must be a valid intranet or extranet URL or email address.<br><br></li>
                </ul>
                <p>
                  <strong>Password reset portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												Changes where the <strong>contact your administrator</strong> link points.<br><br></li>
                  <li class="unordered">
												If you provide an email address, the link will become a “mailto” link to that email address.<br><br></li>
                  <li class="unordered">
												If you provide a URL, the link will become a standard href pointing to that URL which will open in a new tab.  <br><br></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <p>Write back password to on-premises directory</p>
              </td>
              <td>
                <p>Controls whether or not Password Writeback is enabled for this directory and, if writeback is on, indicates the status of the on-premises writeback service.</p>
                <p>
                  
                </p>
                <p>This is useful if you want to temporarily disable the service due to an outage.</p>
              </td>
              <td>
                <p>
                  
                </p>
                <p>
                  <strong>Note:</strong>
                </p>
                <ul>
                  <li class="unordered">
												This control only appears if you have installed Password Writeback by downloading the latest version of Azure AD Connect and enabling the <strong>Password Writeback</strong> option under the <strong>optional features</strong> selection screen.<br><br></li>
                  <li class="unordered">
												If you have enabled Password Writeback and feel there is a configuration issue with the service, you can come to this tab and look at the <strong>password write back service status</strong> label to see if something is wrong.<br><br></li>
                  <li class="unordered">
												Statuses that can be shown are:<br><br><ul><li class="unordered"><strong>Configured </strong>– everything is working as expected<br><br></li><li class="unordered"><strong>Not configured</strong> – you have writeback installed, but we can’t reach the service, check to make sure you are not blocking outbound connections to 443 and try re-installing the service if you still have problems.<br><br></li></ul></li>
                </ul>
                <p>
                  <strong>Registration portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												If writeback is deployed and configured and this switch is set to <strong>no</strong>, then writeback will be disabled, and federated and password hash sync’d users will not be able to register for password reset their passwords.<br><br></li>
                  <li class="unordered">
												If the switch is set to <strong>yes</strong>, then writeback will be enabled, and federated and password hash sync’d users will be able to reset their passwords.<br><br></li>
                </ul>
                <p>
                  <strong>Password reset portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												If writeback is deployed and configured and this switch is set to <strong>no</strong>, then writeback will be disabled, and federated and password hash sync’d users will not be able to reset their passwords.<br><br></li>
                  <li class="unordered">
												If the switch is set to <strong>yes</strong>, then writeback will be enabled, and federated and password hash sync’d users will be able to reset their passwords.<br><br></li>
                </ul>
              </td>
            </tr>
          </tbody></table>

## Password Management notifications
The following table describes how each control affects the experience for users and admins who receive password reset notifications.  You can configure these options under the **Notifications** section of your directory’s **Configure** tab in the [Azure Management Portal](https://manage.windowsazure.com).

<table>
            <tbody><tr>
              <td>
                <p>
                  <strong>Policy Control</strong>
                </p>
              </td>
              <td>
                <p>
                  <strong>Description</strong>
                </p>
              </td>
              <td>
                <p>
                  <strong>Affects?</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Notify admins when other admins reset their own passwords</p>
              </td>
              <td>
                <p>Determines whether or not all global admins will be notified via an email to their primary email address when another admin of any type resets his or her own password.</p>
              </td>
              <td>
                <p>
                  <strong>Password reset portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												If set to no, then no notifications will be sent.<br><br></li>
                  <li class="unordered">
												If set to yes, then all other global administrators will be notified when any single admin resets his or her own password.<br><br></li>
                  <li class="unordered">
												This notification is sent via an email to the primary email addresses of all other global admins in the organization.<br><br></li>
                </ul>
                <p>
                  <strong>Example:</strong>
                </p>
                <ul>
                  <li class="unordered">
												If this option was enabled when admin A resets his password, and there are 3 other admins in the tenant, B, C, and D, then admins B, C, and D would receive an email indicating admin A reset his password.<br><br></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <p>Notify users and admins when their own password has been reset</p>
              </td>
              <td>
                <p>Determines whether or not end users or admins who reset their own passwords will receive an email notification that their password has been reset.</p>
              </td>
              <td>
                <p>
                  <strong>Password reset portal:</strong>
                </p>
                <ul>
                  <li class="unordered">
												If set to no, then no notifications will be sent.<br><br></li>
                  <li class="unordered">
												If set to yes, then whenever a user or admin resets his own password, he or she will receive a notification indicating his or her password has been reset.<br><br></li>
                  <li class="unordered">
												This notification is sent via an email to the primary, and alternate (or authentication) email address of the user who reset his or her password.<br><br></li>
                </ul>
              </td>
            </tr>
          </tbody></table>


<br/>
<br/>
<br/>

**Additional Resources**


* [What is Password Management](active-directory-passwords.md)
* [How Password Management works](active-directory-passwords-how-it-works.md)
* [Getting started with Password Mangement](active-directory-passwords-getting-started.md)
* [Password Management Best Practices](active-directory-passwords-best-practices.md)
* [How to get Operational Insights with Password Management Reports](active-directory-passwords-get-insights.md)
* [Password Management FAQ](active-directory-passwords-faq.md)
* [Troubleshoot Password Management](active-directory-passwords-troubleshoot.md)
* [Learn More](active-directory-passwords-learn-more.md)
* [Password Management on MSDN](https://msdn.microsoft.com/library/azure/dn510386.aspx) 