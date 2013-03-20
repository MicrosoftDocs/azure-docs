<properties umbracoNaviHide="0" pageTitle="Enable accounts for multi-factor authentication in Windows Azure AD" metaKeywords="Windows Azure Active Directory, Windows Azure AD, multi-factor authentication, 2FA" metaDescription="Learn how to enable 2FA for accounts in your Windows Azure AD tenant." linkid="documentation-services-identity-enable-accounts-for-2fa-in-windows-azure-ad" urlDisplayName="Enable accounts for multi-factor authentication" headerExpose="" footerExpose="" disqusComments="1" writer="nickp" />

#Enable accounts for multi-factor authentication in Windows Azure AD

<div chunk="../../Shared/Chunks/disclaimer.md" />

This tutorial provides a general overview of multi-factor authentication concepts and will walk you through how you can use multi-factor authentication in Windows Azure Active Directory to further protect your organization’s identity data in the cloud.

##Table of Contents##

* [How does multi-factor authentication work?](#howitworks)
* [How is it used with Windows Azure AD?](#howisitused)
* [Why use phones as a security verification method?](#whyusephones)
* [Things to consider before enabling multi-factor authentication](#considerations)
* [Enable multi-factor authentication for an account](#enable)

<h2><a id="howitworks"></a>How does multi-factor authentication work?</h2>

Multi-factor authentication adds a critical second layer of security to user sign-ins and transactions. It works by requiring any two or more of the following verification methods:

* Something you know (typically a password)
* Something you have (a trusted device that is not easily duplicated, like a phone)
* Something you are (biometrics)

The security of multi-factor authentication lies in its layered approach. Compromising multiple authentication factors presents a significant challenge for attackers. Even if an attacker manages to learn the user’s password, it is useless without also having possession of the trusted device. Conversely, if the user happens to lose the device, the finder of that device won’t be able to use it unless he or she also knows the user’s password.

By default, Windows Azure AD supports the use of passwords as its only authentication method for user sign-ins.

<h2><a id="howisitused"></a>How is it used with Windows Azure AD?</h2>

When you enable multi-factor authentication for a user account in Windows Azure AD, that user must then use their phone, in addition to their standard password credentials as their additional security verification method each time they need to sign in and use any of the services that your organization subscribes to. 

<h3><a id="whyusephones"></a>Why use phones as a security verification method?</h3>

Phone-based authentication systems leverage the user’s telephone as the trusted device for the second factor or authentication. Telephones are extremely difficult to duplicate and phone numbers are extremely difficult to intercept. They are also a widely adopted personal device that is normally carried everywhere by your employees/students and prevents additional IT costs for large purchases of smartcards or other hardware.

The combination of the phone and a username/password yields strong, multi-factor authentication results. However, enabling it will have an impact on the overall user experience as described in the next section.


<h2><a id="considerations"></a>Things to consider before enabling multi-factor authentication</h2>
It’s important that you read the following information before you enable this feature because it will have a broad impact on the accounts you enable.

* Use is restricted to admin accounts – Currently, multifactor authentication can only be enabled for select users who sign-in with administrative privileges to your tenant. Global admins who go to enable multi-factor authentication in the Windows Azure AD portal will see a list of users that is restricted to only those that are assigned to an admin role. For more information about the various admin roles, see Assigning administrator roles.

 **Important**  
 As a security best practice, we recommend that you don’t regularly use elevated privileged accounts, such as admin roles, for normal day-to-day activities like reading e-mail and working in SharePoint Online. This is especially true when the elevated account has privileges that, if they fell into the wrong hands of a malicious user, could severely impact productivity of the entire organization.
 

* Existing multi-factor authentication set up on-premises - If you are already using multi-factor authentication methods in your on-premises environment and have set up your tenant to use single sign-on, you will not be able to use the phone-based multi-authentication feature built-in to Windows Azure AD. However, your users can continue to leverage your existing multi-factor authentication methods for signing in to your Microsoft cloud services.

 **Note**  
 The Windows Azure Active Directory team is planning to enable phone-based multi-factor authentication functionality for this scenario in the Spring 2013 timeframe.
 
* No rich client application support - When you enable multifactor authentication for a user account, you will not be able to use rich client applications, such as Microsoft Outlook, Lync, Windows PowerShell or other installed applications on your computer, to send/receive data provided by the cloud services you have subscribed to in your tenant. For example, if your organization has subscribed to Office 365, the user will not be able to access their e-mail through Outlook that is installed locally but will be able to access their e-mail through a browser using Outlook Web Access.

* No Lync-based IP phone support – Once enabled, users will not be able to use a Lync-based IP phones with multi-factor authentication.

<h2><a id="enable"></a>Enable multi-factor authentication for an account</h2>
Only users who have been assigned the global administrator role in your Windows Azure AD tenant, can enable or disable multifactor authentication.

Enable multi-factor authentication for an account
Use the following procedure to enable multi-factor authentication for a user account.

1.	Sign in to the Windows Azure Management Portal.

2.	Click **Active Directory**, and then click the name of your directory.
![ADextension2FAConfigureStep2] (../media/ADextension2FAConfigureStep2.PNG)

3.	On the **Users** page, click the user you want to enable.
![ADextension2FAConfigureStep3] (../media/ADextension2FAConfigureStep3.PNG)

4.	On the settings page, under **role**, select the **Require Multi-factor Authentication** check box.
![ADextension2FAConfigureStep4] (../media/ADextension2FAConfigureStep4.PNG)

5.	Click **SAVE**. 
![ADextension2FAConfigureStep5] (../media/ADextension2FAConfigureStep5.PNG)

For information about what the user experience will be like after you enable mutlifactor authentication for an account, see the following resources:

* [How do I sign in using security verification?](http://technet.microsoft.com/library/jj874023.aspx)

* [Add or change your security verification settings](http://technet.microsoft.com/library/jj863118.aspx)

**Additional Resources**

* [What is Windows Azure AD?](./what-is-windows-azure-active-directory.md)
* [Windows Azure Identity](http://www.windowsazure.com/en-us/manage/windows/fundamentals/identity/)
* [Windows Azure AD Library on TechNet](http://technet.microsoft.com/en-us/library/hh967619.aspx)
* [Windows Azure AD Library on MSDN](http://msdn.microsoft.com/library/windowsazure/jj673460.aspx)