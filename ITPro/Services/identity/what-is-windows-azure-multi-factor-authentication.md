<properties umbracoNaviHide="0" pageTitle="What is Windows Azure Multi-Factor Authentication" metaKeywords="Windows Azure Multi-Factor Authentication, Windows Azure MFA, WAMFA" metaDescription="Learn about Windows Azure Multi-Factor Authentication." linkid="documentation-services-identity-what-is-windows-azure-multi-factor-authentication" urlDisplayName="What is Windows Azure Multi-Factor Authentication" headerExpose="" footerExpose="" disqusComments="0" writer="billmath" editor="lisatoft" manager="terrylan" />

<div chunk="../chunks/identity-left-nav.md" />

<h1 id="whatiswamfa">What is Windows Azure Multi-Factor Authentication?</h1>

Multi-factor or two-factor authentication is a method of authentication that requires the use of more than one verification method and adds a critical second layer of security to user sign-ins and transactions. It works by requiring any two or more of the following verification methods: 

* Something you know (typically a password)
* Something you have (a trusted device that is not easily duplicated, like a phone)
* Something you are (biometrics)

The security of multi-factor authentication lies in its layered approach. Compromising multiple authentication factors presents a significant challenge for attackers. Even if an attacker manages to learn the user’s password, it is useless without also having possession of the trusted device. Conversely, if the user happens to lose the device, the finder of that device won’t be able to use it unless he or she also knows the user’s password.
Windows Azure Multi-Factor Authentication is the multi-factor authentication service that requires users to also verify sign-ins using a mobile app, phone call or text message. It is available to use with Windows Azure Active Directory, to secure on-premise resources with the Windows Azure Multi-Factor Authentication Server, and with custom applications and directories using the SDK. 

<h3>Securing cloud Windows Azure Active Directory</h3>

Enable Multi-Factor Authentication for Windows Azure AD identities, and users will be prompted to set up additional verification the next time they sign in. Use Multi-Factor Authentication to secure access to Windows Azure, Microsoft Online Services like Office 365 and Dynamics CRM Online, as well as 3rd party cloud services that integrate Windows Azure AD with no additional set up. Multi-factor authentication can be rapidly enabled for large numbers of global users and applications.  [Learn more](http://technet.microsoft.com/en-us/library/dn249466.aspx)

<h3>Securing on-premises resources and Active Directory</h3>

Enable Multi-Factor Authentication for your on-premise resources such as IIS and Active Directory using the Windows Azure Multi-Factor Authentication Server.  The Windows Azure Multi-Factor Authentication Server allows the administrator integrate with IIS authentication to secure Microsoft IIS web applications, RADIUS authentication, LDAP authentication, and Windows authentication.  [Learn more](http://technet.microsoft.com/en-us/library/dn249467.aspx)
<h3>Securing custom applications</h3>

An SDK enables direct integration with your cloud services. Build Active Authentication phone call and text message verification into your application’s sign-in or transaction processes and leverage your application’s existing user database. [Learn more](http://technet.microsoft.com/en-us/library/dn249464.aspx)

**Additional Resources**

* [Sign up for Windows Azure as an organization](/en-us/manage/services/identity/organizational-account/)
* [Windows Azure Identity](/en-us/manage/windows/fundamentals/identity/)
* [Windows Azure Multi-Factor Authentication Library on TechNet](http://technet.microsoft.com/en-us/library/dn249471.aspx)
* [Windows Azure Multi-Factor Authentication AD Library on MSDN](http://msdn.microsoft.com/en-us/library/windowsazure/dn422962.aspx)
