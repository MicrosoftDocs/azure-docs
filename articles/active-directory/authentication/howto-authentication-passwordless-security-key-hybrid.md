---
title: Passwordless security key sign in hybrid Azure AD joined devices (preview) - Azure Active Directory
description: Enable passwordless security key sign in to hybrid Azure AD joined devices using FIDO2 security keys (preview)

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 08/05/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: librown

ms.collection: M365-identity-device-management
---
# Enable passwordless security key sign in for hybrid Azure AD joined devices (preview)

1.	Overview
This document focusses on enabling password less multi-factor authentication for hybrid environments and providing a seamless SSO to on prem resources using Microsoft-compatible security key. It allows Azure AD authentication on Windows 10 devices for both AAD joined and Hybrid AAD joined devices using FIDO2 security keys. 

For enterprises that use passwords today and have a shared PC environment, security keys provide a seamless way for workers to authenticate without entering a username or password. Unlike passwords, these security keys have lower IT management costs, provide improved productivity for workers, and have better security.

2.	Intended Audience 
Enterprise IT admins planning to deploy Microsoft-compatible security key in an AADJ / hybrid AADJ environment

3.	Background and Description
Windows Hello for Business provides a personal and password-less way to sign in to Windows 10 devices.  
If you are an employee with a dedicated computer, you’ll enter a password just once on your first day of work – and never deal with passwords again. This is achieved by enrolling biometrics/PIN on your device.

While this works great for users with dedicated computers, it is not ideal for users in Shared PC environments.
In these scenarios, workers move through many computing “stations” throughout the day, creating the need for an authentication method that is portable, does not require enrollment and is secure. 
Microsoft-compatible security key enable password less multi-factor authentication for shared PC environments. These keys work over USB and NFC transports and can provide true multi-factor unlock with built in biometric support/PIN. They also support offline unlock. Logon with security keys enables single sign-on (SSO) to your On-premises resources as well as your cloud apps and resources. Users can sign into Windows with modern credentials like FIDO2 keys and access traditional Active Directory(AD) based resources. Today, Windows Hello for Business lets user authenticate to AD using key or certificates, but process is complex and requires many customer managed components. With this solution, modern credentials like FIDO2 security keys can be traded for a credential that AD trusts and understands.

 
How SSO works for on prem resources using FIDO2 keys – Under the hood
You may choose to have Azure Active Directory issue Kerberos Ticket Granting Tickets (TGTs) for one or more of your Active Directory domains. This allows you to sign into Windows with modern credentials like FIDO and access your traditional Active Directory based resources. Kerberos Service Tickets and authorization will continue to be controlled by your on-premises Active Directory Domain Controllers.
An Azure AD Kerberos Server object will be created in your on-premises Active Directory and then securely published to Azure Active Directory. The object is not associated with any physical servers. It is simply a representation of a Domain Controller that can be used by Azure Active Directory to generate Kerberos Ticket Granting Tickets (TGTs) for your Active Directory Domain.
The object appears in the directory as a Read Only Domain Controller object. The same rules and restrictions used for Read Only Domain Controllers apply to the Azure AD Kerberos Server object.  

 

4.	Required Hardware
This scenario requires the following hardware or hardware features for successful completion:
Hardware	Description
Windows 10 supported desktop/tablet/laptops	•	One/multiple Windows 10 PCs 
Microsoft-compatible security keys	Should be FIDO2 Link

Network connectivity	Including internet access
NFC Reader if you’re working with NFC security keys	Recommended: HID Omnikey 5022 CL or equivalent

5.	Required Software
This scenario requires the following software or software features for successful validation:
Software	Minimum Version
Azure Active Directory(AAD) subscription
•	An AAD tenant that you’ll be creating accounts under 
(should be set up as part of the subscription) 	Azure AD Basic
Azure MFA (server or cloud) 	Refer public preview instructions: Link

Private build of Azure AD Connect available at this link
NOTE: Customers do NOT need to upgrade Azure AD Connect.	
Intune / Group Policy 	
Windows 10 Client running Vibranium build available at this  link
Insider Build# 18945 or newer; available 7/25 or later
[Optional] Insider skip ahead - Vibranium server build 
Patch for 2019 and 2016 Domain Controllers (DC’s) will be available for GA	Optional for this private preview
Needed for NTLM resources

 
6.	Risks
This scenario is only supported for test and small-scale production deployments due to the following risks:
•	The security keys are prototype versions and are in the process of going through FIDO certifications. We encourage you to discuss details with device vendors prior to deployment 
•	Check out the vendors with compatible keys: Link

7.	Limitations
•	The scenario is supported for Azure Active Directory Joined (AADJ) and Hybrid AADJ. 
o	Includes SSO to Cloud resources (Office 365 and SAML enabled applications)
o	Includes SSO to on-premises resources, and Windows Integrated authentication to web sites will work including web sites and SharePoint sites that require IIS Authentication and/or use NTLM.
•	Pure domain joined (on-prem only) deployment not supported
•	RDP, VDI and Citrix scenarios are not supported using security key
•	S/MIME not supported using security key
•	“Run as“ not supported using security key 
•	Login to a sever using security key is not supported 

8.	Deployment Instructions
The scenario is deployed by completing the following steps:
1.	Configure access to on-premises resources for users that sign into Windows using modern credentials like FIDO.
a.	Insiders can download the private build from this link and follow the instructions in section 8.1 below. You are NOT be required to upgrade current Azure AD Connect.
2.	If your enterprise uses NTLM auth, have at least one Domain Controller running latest Insider server build# 18945 available at this link
a.	Patch for 2019 and 2016 DC’s will be available for GA
Note: You can skip this step for preview if you’re unable to update DC’s.
3.	Enable FIDO for your Azure AD tenant via AAD Portal
a.	Enable end-user registration UX
4.	Push FIDO cred prov on clients to enable logon with security keys via Intune / Group Policy
5.	Update the PCs you will be piloting to latest Windows Update (Insider Build# 18945 or newer; available 7/23 or later)
	
	8.1 Configure access to on-premises resources for users that sign into Windows using modern credentials like FIDO.
Insiders
You will use a private set of tools that includes a new PowerShell module which you can access at this link. 
1.	Copy and extract the AzureADKerberosManagement.zip to a new directory on the server where you run Azure AD Connect. 

NOTE this will not upgrade or modify your existing AAD Connect installation, but the tools do need to run on the AAD Connect server.

2.	Open an elevated PowerShell prompt and navigate to \AzureADKerberosManagement\Microsoft Azure Active Directory Connect\AzureADKerberos

3.	Run the following PowerShell commands to create a new Azure AD Kerberos server object in both your on-premises Active Directory domain and Azure Active Directory tenant.

NOTE Replace "contoso.corp.com" with the name of your on-premises Active Directory domain.

Viewing and Verifying the Azure AD Kerberos Server
You can view and verify the newly created Azure AD Kerberos Server using the following command. 

This command will output the properties of the Azure AD Kerberos Server. You can review the properties to verify that everything is in good order.
Property	Description
Id	The unique Id of the AD Domain Controller object. This is sometimes referred to as it’s “slot” or it’s “branch Id”.
DomainDnsName	The DNS domain name of the Active Directory Domain.
ComputerAccount	The computer account object of the Azure AD Kerberos Server object (The DC). 
UserAccount	The disabled user account object that holds the Azure AD Kerberos Server TGT encryption key. The DN of this account will be: CN=krbtgt_AzureAD,CN=Users,<Domain-DN>
KeyVersion	The key version of the Azure AD Kerberos Server TGT encryption key. The version is assigned when the key is created. The version is then incremented every time the key is rotated. The increments are based on replication meta-data and will likely be greater than one. For example, the initial KeyVersion could be 192272. The first time the key is rotated, the version could advance to 212621. The important thing to verify is that the KeyVersion for the on-premises object and the CloudKeyVersion for the cloud object are the same.
KeyUpdatedOn	The date and time that the Azure AD Kerberos Server TGT encryption key was updated/created.
KeyUpdatedFrom	The Domain Controller where the Azure AD Kerberos Server TGT encryption key was last updated.

CloudId	The Id from the Azure AD Object. Must match the Id above.
CloudDomainDnsName	The DomainDnsName from the Azure AD Object. Must match the DomainDnsName above.
CloudKeyVersion	The KeyVersion from the Azure AD Object. Must match the KeyVersion above.
CloudKeyUpdatedOn	The KeyUpdatedOn from the Azure AD Object. Must match the KeyUpdatedOn above.

Removing the Azure AD Kerberos Server
If you would like to revert the scenario and remove the Azure AD Kerberos Server from both on-premises Active Directory and Azure Active Directory, run the following command.  


Rotating the Azure AD Kerberos Server Key

Just like any other Domain Controller, the Azure AD Kerberos Server encryption krbtgt keys should be rotated on a regular basis. It’s recommended you follow the same schedule you use to rotate all other Active Directory Domain Controller krbtgt keys. 

NOTE There are other tools that could rotate the krbtgt keys, however, you must use the tools mentioned in this document to rotate the krbtgt keys of your Azure AD Kerberos Server. This ensures the keys are updated in both on-premises AD and Azure AD.



	8.2 If your enterprise uses NTLM auth, update at least one Domain Controller with Vibranium build
How do I know if my enterprise uses NTLM Auth?
•	Recommend using this link to assess

In our experience, most enterprises use NTLM auth.
1.	Please install the Insider skip ahead - Vibranium server build <BUILD# 7/23 or later> on your DC

If updating a DC is not feasible, you can try this feature without NTLM. Flip the following reg keys to skip the NTLM aspect of the preview:
•	Key: HKLM\System\CurrentControlSet\Control\Lsa\Kerberos\Parameters
•	Value: KeyListReqSupportOverride: 0 – turn off NTLM, 1 or unset – turn on NTLM

	8.3 Enable FIDO for your Azure AD tenant via AAD Portal
1.	Use the new Authentication methods blade in Azure AD admin portal that allows you to assign passwordless credentials using FIDO2 security keys
2.	Enable the converged registration portal for users to create and manage FIDO2 security keys

	8.4 Push FIDO cred prov on clients to enable logon with security keys via Intune / GP
Intune (AADJ): 
1.	Go to your AAD Portal
2.	Search for Intune
3.	For Tenant wide configuration:
a.	Navigate to Device Enrollment > Profiles> Windows Hello for Business > Settings
i.	Set “Security key for sign-in” to “Enabled”

 
4.	For targeting specific device groups, use the following custom settings via Intune
a.	Follow instructions here
b.	Use the following for FIDO setup:
i.	Name: Turn on FIDO Security Keys for Windows Sign-In
ii.	Description: Enables FIDO Security Keys to be used during Windows Sign In
iii.	OMA-URI:
./Device/Vendor/MSFT/PassportForWork/SecurityKey/UseSecurityKeyForSignin
iv.	Data Type: Integer
v.	Value: 1 
 
Group Policy (hybrid AADJ): 
You can configure the following Group Policy settings to enable FIDO for your enterprise. These are available for both User configuration and Computer configuration under Policies > Administrative Templates > System > Logon
Policy	Options
AllowSecurityKeySignIn 	Not Configured: Security key is not available as an option for sign in
Enabled: Security key is available as an option for sign in
Disabled: Security key is not available as an option for sign in
	8.5 Update the PCs you will be piloting to latest Windows Insider Vibranium Build 
	Make sure the Client PC you are planning to try the scenarios out are running the Windows Insider Vibranium Build #18945 or newer, available starting 7/23.

9.	Test Scenarios
This section includes test scenarios from an end user persona that you may consider using and test the feature.
	9.1.  Provision a security key 
1.	Make sure you have a Microsoft-compatible FIDO2 security key
2.	Browse to https://myprofile.microsoft.com
3.	Sign in if not already
4.	Click Security Info 
a.	If the user already has at least one Azure Multi-Factor Authentication method registered, they can immediately register a FIDO2 security key.
b.	If they don’t have at least one Azure Multi-Factor Authentication method registered, they must add one.
5.	Add a FIDO2 Security key by clicking Add method and choosing Security key
6.	Choose USB device or NFC device
7.	Have your key ready and choose Next
8.	A box will appear and ask you to create/enter a PIN for your security key, then perform the required gesture for your key either biometric or touch.
9.	You will be returned to the combined registration experience and asked to provide a meaningful name for your token so you can identify which one if you have multiple. Click Next.
10.	Click Done to complete the process

	9.2.  First login to AADJ PC and verify Single Sign-On (SSO) to cloud resources and On-prem resources (Kerberos and NTLM)
1.	Make sure you have network / internet access
2.	On the lock screen, choose the FIDO sign-in option
3.	Follow instructions on the screen to proceed to login
4.	Access cloud resources to confirm you get SSO
•	E.g office.com
5.	Access on-premises resources to confirm you get SSO
•	Kerberos based resources
•	NTLM based resources
6.	Lock screen (Windows + L)

Note: Windows Hello Face is the intended best experience for a device where a user has it enrolled. But you can turn off Hello Face sign in by removing your Face Enrollment in Settings Sign-In Options if it's preventing you from trying the FIDO logon scenario.
	9.3.  First login to hybrid AADJ PC and verify Single Sign-On (SSO) to cloud resources and On-prem resources (Kerberos and NTLM)
1.	Make sure you have network / internet access
2.	For hybrid AADJ setup, make sure you are connected to your corporate network (have line of sight to your domain controller)
3.	On the lock screen, choose the FIDO sign-in option
4.	Follow instructions on the screen to proceed to login
5.	Access cloud resources to confirm you get SSO
•	E.g office.com
6.	Access on-premises resources to confirm you get SSO
•	Kerberos based resources
•	NTLM based resources
7.	Lock screen (Windows + L)

Note: Windows Hello Face is the intended best experience for a device where a user has it enrolled. But you can turn off Hello Face sign in by removing your Face Enrollment in Settings Sign-In Options if it's preventing you from trying the FIDO logon scenario.

	 9.4. Unlock PC using a security key
1.	Make sure you have signed into this PC before
2.	On the lock screen, choose the FIDO sign-in option
3.	Follow instructions on the screen to proceed to login
4.	Access cloud resources to confirm you get SSO
•	E.g office.com
5.	Access on-premises resources to confirm you get SSO
•	Kerberos based resources
•	NTLM based resources
6.	Lock screen (Windows + L)

	 9.5. Manage your security key via Settings
1.	Once you’ve unlocked your machine using FIDO, open the inbox “Settings” app
2.	Navigate to Accounts > Sign-in options > Security Key
3.	Click Manage and touch your security key.
4.	Based on the capability of your security key, various options may light up
 
5.	Try changing your security key PIN
6.	If your security key has biometric capability, try enrolling fingerprints
7.	Try resetting your security key by following instructions on the screen
•	Note: Resetting your key will wipe off ALL data and restore it to factory default
•	Resetting of keys may require you to unplug, re-plug and touch the blinking security key couple of times

	 9.6. Offline unlock
1.	Make sure you have signed into this PC before
2.	Turn off the network / put the PC in airplane mode
•	For hybrid AADJ machines, you can disconnect from your corporate network
3.	On the lock screen, choose the FIDO sign-in option
4.	Follow instructions on the screen to proceed to login
5.	You should be able to get to your desktop but not have access to cloud or on-premises resources
6.	Lock screen (Windows + L)

10.	Troubleshooting and feedback
If you would like to share feedback or encounter issues while previewing this feature, please share them via Feedback Hub
•	Launch Feedback Hub and make sure you're signed in
•	Submit feedback under 
•	Category: Security and Privacy 
•	Subcategory: FIDO
•	To capture logs use, Recreate my Problem
 

11.	Additional Material
	Scenario Webcast: https://www.yammer.com/wsscengineering/#/files/109518749

12.	Known Issues
•	Logon with FIDO will be blocked if users password has expired; expectation for user to reset password over lock screen before being able to login using FIDO


13.	Frequently asked questions

Does this work in my on-premises environment?
This feature does NOT work for a pure on-premises environment.
My organization requires two factor authentication to access resources, what can I do to support this?
Security keys come in a variety of form factors. Please contact the device manufacturer of interest to discuss how their devices can be enabled with a PIN or biometric as a second factor.
Can admins set up security keys?
We are working on this capability for GA of this feature.
Where can I go to find compliant Security Keys?
The following vendors provide security keys that work with our services. Please work with these vendors to get the correct set of keys for validation.
•	Yubico
•	Feitian
•	HID
•	Ensurity
•	eWBM

Check out this page to get a list of vendors that provide compatible keys
Can I use a phone as a Windows Hello security key?
We are investigating support for phones for future releases.
What do I do if I lose my Security Key?
You can remove keys from the Azure portal, by navigating to the security info page and removing the security key 
What do I do if Windows Hello Face is too quick and preventing me from trying FIDO?
Windows Hello Face is the intended best experience for a device where a user has it enrolled. But you can turn off Hello Face sign in by removing your Face Enrollment in Settings Sign-In Options if it's preventing you from trying the FIDO logon scenario.
I’m not able to use FIDO immediately after I create a hybrid AADJ machine
If clean installing a Hybrid AADJ machine, post domain join and restart you must sign in with a password and wait for policy to sync before being able to use FIDO to sign in
•	Check your current status by typing dsregcmd /status into a command window and check that both AzureAdJoined and DomainJoined are showing YES.
•	This is a known limitation for domain joined devices and not FIDO specific.

I’m unable to get SSO to my NTLM network resource after signing in with FIDO and get a credential prompt
There are known limitations based on how many servers have the new build and which will respond in time to service your resource request
To check if you can see a server that is running the feature, check the output of nltest /dsgetdc:redmond /keylist /kdc


14.	Other Questions 
	Urgent issues
If you’re stuck on a blocking issue, please reach out to FIDOHot@microsoft.com 

15.	Appendix

A.	Glossary
Abbreviation	 Definition
AAD	Azure Active Directory
AADJ	Azure Active Directory Joined
FIDO	Fast Identity Online
OOBE	Out of Box Experience

## Next steps
