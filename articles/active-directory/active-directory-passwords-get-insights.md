<properties 
	pageTitle="Get Insights: Azure AD Password Management Reports | Microsoft Azure" 
	description="This article describes how to use reports to get insight into Password Management operations in your organization." 
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

# How to get operational insights with Password Management reports
This section describes how you can use Azure Active Directory’s Password Management reports to view how users are using password reset and change in your organization.

- [**Password Management reports overview**](#overview-of-password-management-reports)
- [**How to view Password Management reports**](#how-to-view-password-management-reports)
- [**View password reset registration activity in your organization**](#view-password-reset-registration-activity)
- [**View password reset activity in your organization**](#view-password-reset-activity)

## Overview of Password Management reports
Once you deploy password reset, one of the most common next steps is to see how it is being used in your organization.  For example, you may want to get insight into how users are registering for password reset, or how many password resets have been done in the last few days.  Here are some of the common questions that you will be able to answer with the Password Management reports that exist in the [Azure Management Portal](https://manage.windowsazure.com) today:

- How many people have registered for password reset?
- Who has registered for password reset?
- What data are people registering?
- How many people reset their passwords in the last 7 days?
- What are the most common methods users or admins use to reset their passwords?
- What are common issues users or admins face when attempting to use password reset?
- What admins are resetting their own passwords frequently?
- Is there any suspicious activity going on with password reset?


## How to view Password Management reports
To find the Password Management reports, follow the steps below:

1.	Click on the **Active Directory** extension in the [Azure Management Portal](https://manage.windowsazure.com).
2.	Select your directory from the list that appears in the portal.
3.	Click on the **Reports** tab.
4.	Look under the **Activity Logs** section.
5.	Select either the **Password reset activity** report or the **Password reset registration activity** report.

    ![][001]

## View password Reset registration activity

The password reset registration activity report shows all password reset registrations that have occurred in your organization.  A password reset registration is displayed in this report for any user who has successfully registered authentication information at the password reset registration portal ([http://aka.ms/ssprsetup](http://aka.ms/ssprsetup)).

- **Max time range**: 1 month
- **Max number of rows**: unlimited
- **Downloadable**: Yes, via CSV file

    ![][002]

### Description of report columns
The following list explains each of the report columns in detail:

- **User** – the user who attempted a password reset registration operation.
- **Role** – the role of the user in the directory.
- **Date and Time** – the date and time of the attempt.
- **Data Registered** – what authentication data the user provided during password reset registration.

### Description of report values
The following table describes the different values allowed for each column:

<table>
            <tbody><tr>
              <td>
                <p>
                  <strong>Column</strong>
                </p>
              </td>
              <td>
                <p>
                  <strong>Allowed values and their meanings</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Data Registered</p>
              </td>
              <td>
                <ul>
                  <li class="unordered">
                    <strong>Alternate Email</strong> – user used alternate email or authentication email to authenticate<br><br></li>
                </ul>
                <ul>
                  <li class="unordered">
                    <strong>Office Phone</strong> – user used office phone to authenticate<br><br></li>
                </ul>
                <ul>
                  <li class="unordered">
                    <strong>Mobile Phone</strong> – user used mobile phone or authentication phone to authenticate<br><br></li>
                </ul>
                <ul>
                  <li class="unordered">
                    <strong>Security Questions</strong> – user used security questions to authenticate<br><br></li>
                </ul>
                <ul>
                  <li class="unordered">
                    <strong>Any combination of the above (e.g. Alternate Email + Mobile Phone)</strong> – occurs when a 2 gate policy is specified and shows which two methods the user used to authentication his password reset request.<br><br></li>
                </ul>
              </td>
            </tr>
          </tbody></table>

## View password reset activity

This report shows all password reset attempts that have occurred in your organization.

- **Max time range**: 1 month
- **Max number of rows**: unlimited
- **Downloadable**: Yes, via CSV file

    ![][003]

### Description of report columns
The following list explains each of the report columns in detail:

1. **User** – the user who attempted a password reset operation (based on the User ID field provided when the user comes to reset a password).
2. **Role** – the role of the user in the directory.
3. **Date and Time** – the date and time of the attempt.
4. **Method(s) Used** – what authentication methods the user used for this reset operation.
5. **Result** – the end result of the password reset operation.
6. **Details** – the details of why the password reset resulted in the value it did.  Also includes any mitigation steps you might take to resolve an unexpected error.

### Description of report values
The following table describes the different values allowed for each column:

<table>
            <tbody><tr>
              <td>
                <p>
                  <strong>Column</strong>
                </p>
              </td>
              <td>
                <p>
                  <strong>Allowed values and their meanings</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Methods Used</p>
              </td>
              <td>
                <ul>
                  <li class="unordered">
                    <strong>Alternate Email</strong> – user used alternate email or authentication email to authenticate<br><br></li>
                </ul>
                <ul>
                  <li class="unordered">
                    <strong>Office Phone</strong> – user used office phone to authenticate<br><br></li>
                </ul>
                <ul>
                  <li class="unordered">
                    <strong>Mobile Phone</strong> – user used mobile phone or authentication phone to authenticate<br><br></li>
                </ul>
                <ul>
                  <li class="unordered">
                    <strong>Security Questions</strong> – user used security questions to authenticate<br><br></li>
                </ul>
                <ul>
                  <li class="unordered">
                    <strong>Any combination of the above (e.g. Alternate Email + Mobile Phone)</strong> – occurs when a 2 gate policy is specified and shows which two methods the user used to authentication his password reset request.<br><br></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <p>Result</p>
              </td>
              <td>
                <ul>
                  <li class="unordered">
                    <strong>Abandoned</strong> – user started password reset but then stopped halfway through without completing<br><br></li>
                </ul>
                <ul>
                  <li class="unordered">
                    <strong>Blocked</strong> – user’s account was prevented to use password reset due to attempting to use the password reset page or a single password reset gate too many times in a 24 hour period<br><br></li>
                </ul>
                <ul>
                  <li class="unordered">
                    <strong>Cancelled</strong> – user started password reset but then clicked the cancel button to cancel the session part way through <br><br></li>
                </ul>
                <ul>
                  <li class="unordered">
                    <strong>Contacted Admin</strong> – user had a problem during his session that he could not resolve, so the user clicked the “Contact your administrator” link instead of finishing the password reset flow<br><br></li>
                </ul>
                <ul>
                  <li class="unordered">
                    <strong>Failed</strong> – user was not able to reset a password, likely because the user was not configured to use the feature (e.g. no license, missing authentication info, password managed on-prem but writeback is off).<br><br></li>
                </ul>
                <ul>
                  <li class="unordered">
                    <strong>Succeeded</strong> – password reset was successful.<br><br></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <p>Details</p>
              </td>
              <td>
                <p>See table below</p>
              </td>
            </tr>
          </tbody></table>

### Allowed values for details column
Below is the list of result types you may expect when using the password reset activity report:

<table>
            <tbody><tr>
              <td>
                <p>
                  <strong>Details</strong>
                </p>
              </td>
              <td>
                <p>
                  <strong>Result Type</strong>
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User abandoned after completing the email verification option</p>
              </td>
              <td>
                <p>Abandoned</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User abandoned after completing the mobile SMS verification option</p>
              </td>
              <td>
                <p>Abandoned</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User abandoned after completing the mobile voice call verification option</p>
              </td>
              <td>
                <p>Abandoned</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User abandoned after completing the office voice call verification option</p>
              </td>
              <td>
                <p>Abandoned</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User abandoned after completing the security questions option</p>
              </td>
              <td>
                <p>Abandoned</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User abandoned after entering their user ID</p>
              </td>
              <td>
                <p>Abandoned</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User abandoned after starting the email verification option</p>
              </td>
              <td>
                <p>Abandoned</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User abandoned after starting the mobile SMS verification option</p>
              </td>
              <td>
                <p>Abandoned</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User abandoned after starting the mobile voice call verification option</p>
              </td>
              <td>
                <p>Abandoned</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User abandoned after starting the office voice call verification option</p>
              </td>
              <td>
                <p>Abandoned</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User abandoned after starting the security questions option</p>
              </td>
              <td>
                <p>Abandoned</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User abandoned before selecting a new password</p>
              </td>
              <td>
                <p>Abandoned</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User abandoned while selecting a new password</p>
              </td>
              <td>
                <p>Abandoned</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User entered too many invalid email verification codes and is blocked for 24 hours</p>
              </td>
              <td>
                <p>Blocked</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User entered too many invalid SMS verification codes and is blocked for 24 hours</p>
              </td>
              <td>
                <p>Blocked</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User tried mobile phone voice verification too many times and is blocked for 24 hours</p>
              </td>
              <td>
                <p>Blocked</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User tried office phone voice verification too many times and is blocked for 24 hours</p>
              </td>
              <td>
                <p>Blocked</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User tried to answer security questions too many times and is blocked for 24 hours</p>
              </td>
              <td>
                <p>Blocked</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User tried to verify a phone number too many times and is blocked for 24 hours</p>
              </td>
              <td>
                <p>Blocked</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User cancelled before passing the required authentication methods</p>
              </td>
              <td>
                <p>Cancelled</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User cancelled before submitting a new password</p>
              </td>
              <td>
                <p>Cancelled</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User contacted an admin after trying the email verification option</p>
              </td>
              <td>
                <p>Contacted admin</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User contacted an admin after trying the mobile SMS verification option</p>
              </td>
              <td>
                <p>Contacted admin</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User contacted an admin after trying the mobile voice call verification option</p>
              </td>
              <td>
                <p>Contacted admin</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User contacted an admin after trying the office voice call verification option</p>
              </td>
              <td>
                <p>Contacted admin</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User contacted an admin after trying the security question verification option</p>
              </td>
              <td>
                <p>Contacted admin</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Password reset is not enabled for this user. Enable password reset under the configure tab to resolve this</p>
              </td>
              <td>
                <p>Failed</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User does not have a license. You can add a license to the user to resolve this</p>
              </td>
              <td>
                <p>Failed</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User tried to reset from a device without cookies enabled</p>
              </td>
              <td>
                <p>Failed</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User's account has insufficient authentication methods defined. Add authentication info to resolve this</p>
              </td>
              <td>
                <p>Failed</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User's password is managed on-premises. You can enable Password Writeback to resolve this</p>
              </td>
              <td>
                <p>Failed</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>We could not reach your on-premises password reset service. Check your sync machine's event log</p>
              </td>
              <td>
                <p>Failed</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>We encountered a problem while resetting the user's on-premises password. Check your sync machine's event log</p>
              </td>
              <td>
                <p>Failed</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>This user is not a member of the password reset users group. Add this user to that group to resolve this.</p>
              </td>
              <td>
                <p>Failed</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Password reset has been disabled entirely for this tenant. See <a href="http://aka.ms/ssprtroubleshoot">http://aka.ms/ssprtroubleshoot</a> to resolve this.</p>
              </td>
              <td>
                <p>Failed</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>User successfully reset password</p>
              </td>
              <td>
                <p>Succeeded</p>
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
* [Customize Password Management](active-directory-passwords-customize.md)
* [Password Management Best Practices](active-directory-passwords-best-practices.md)
* [Password Management FAQ](active-directory-passwords-faq.md)
* [Troubleshoot Password Management](active-directory-passwords-troubleshoot.md)
* [Learn More](active-directory-passwords-learn-more.md)
* [Password Management on MSDN](https://msdn.microsoft.com/library/azure/dn510386.aspx)



[001]: ./media/active-directory-passwords-get-insights/001.jpg "Image_001.jpg"
[002]: ./media/active-directory-passwords-get-insights/002.jpg "Image_002.jpg"
[003]: ./media/active-directory-passwords-get-insights/003.jpg "Image_003.jpg"
 