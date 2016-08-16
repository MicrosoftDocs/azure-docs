<properties
	pageTitle="User remediation when accessing Azure AD device-based conditional access protected applications | Microsoft Azure"
	description="This topic helps you identify if there are remediation steps that you can follow to gain access to the application you want to get to."
	services="active-directory"
	keywords="device-based conditional access, device registration, enable device registration, device registration and MDM"
	documentationCenter=""
	authors="markusvi"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="08/15/2016"
	ms.author="markvi"/>


# User remediation when accessing Azure AD device-based conditional access protected applications

You got an access denied page when accessing an application like Office 365 SharePoint Online.  
Now, what do you do?

This guide helps you identify if there are remediation steps that you can follow to gain access to the application you want to get to.



What device platform is your device running on?
The answer to this question determines the right section in this topic for you:
 

-	Windows device

-	iOS device (iPhone or iPad)

-	Android device

## Access from a Windows device

If your device is one of Windows 10, Windows 8.1, Windows 8.0, Windows 7, Windows Server 2016, Windows Server 2012 R2, Windows Server 2012 or Windows Server 2008 R2 choose the appropriate cause by identifying the page you got when trying to access the application.

### Device is not registered

If your device is not registered with Azure Active Directory and the application is protected with a device based policy, you might see a page with the following content:

![Scenario](./media/active-directory-conditional-access-device-remediation/01.png "Scenario")

 

If your device is domain joined to your organization’s Active Directory you can try the following:

1.	Make sure you are signed in to Windows using your work account (Active Directory account).

2.	Connect to your corporate network via VPN or Direct Access.

3.	Once you are connected, lock your Windows session using the Windows key + ‘L’ key.

4.	Unlock your Windows session entering your work account credentials.

5.	Wait for a minute and try accessing the application again.

6.	If you get the same page, please contact your administrator and provide the details after clicking in the ‘More details’ link.

If your device is not domain joined and runs Windows 10 you have two options: 

1. Run Azure AD Join
2. Add your work or school account to Windows. 

For information about the differences between the two, see [Using Windows 10 devices in your workplace](active-directory-azureadjoin-windows10-devices.md).

To run Azure AD Join, do the following (not available in Windows Phone):

**Windows 10 Anniversary Update**	

1.	Launch the Settings app.

2.	Go to ‘Accounts’ and then to ‘Access work or school’.

3.	Click in ‘Connect’.

4.	Choose ‘Join this device to Azure AD’ at the bottom of the page.

5.	Authenticate to your organization, provide MFA proof if needed and follow the steps until completion.

6.	Sign out and sign in using your work account.

7.	Try accessing the application again.




**Windows 10 November 2015 Update**


1.	Launch the Settings app.

2.	Go to ‘System’ and then to ‘About’.
	
3.	Click in ‘Join Azure AD’.

4.	Authenticate to your organization, provide MFA proof if needed and follow the steps until completion.

5.	Sign out and sign in using your work account (Azure AD account).

6.	Try accessing the application again.


To add your work or school account, do the following:

**Windows 10 Anniversary Update**	

1.	Launch the Settings app.

2.	Go to ‘Accounts’ and then to ‘Access work or school’.

3.	Click in ‘Connect’.

4.	Authenticate to your organization, provide MFA proof if needed and follow the steps until completion.

5.	Try accessing the application again.	


**Windows 10 November 2015 Update**
	
1.	Launch the Settings app.
2.	Go to ‘Accounts’ and then to ‘Your accounts’.
3.	Click in ‘Add work or school account’.
4.	Authenticate to your organization, provide MFA proof if needed and follow the steps until completion.
5.	Try accessing the application again.

If your device is not domain joined and runs Windows 8.1 you can do Workplace Join and enroll into Microsoft Intune by doing the following:

1.	Launch PC Settings.

2.	Go to ‘Network’ and then to ‘Workplace’.

3.	Click on ‘Join’.

4.	Authenticate to your organization, provide MFA proof if needed and follow the steps until completion.

5.	Click on ‘Turn on’.

6.	Wait until completion.

7.	Try accessing the application again.


## Unsupported browser

If you are accessing the application from the following browsers your will see a page similar to the page shown below:

1.	Chrome, Firefox or any other browser that is not Microsoft Edge or Microsoft Internet Explorer in Windows 10 or Windows Server 2016.

2.	Firefox in Windows 8.1, Windows 7, Windows Server 2012 R2, Windows Server 2012 or Windows Server 2008 R2.
 

![Scenario](./media/active-directory-conditional-access-device-remediation/02.png "Scenario")


The only remediation is to use a browser that is supported for your device platform.

## Access from an iOS device

Check back soon for instructions for iPhones or iPads.

## Access from an Android device

Check back soon for instructions for Android phones or tablets.


## Next steps

[Azure Active Directory conditional access](active-directory-conditional-access.md)

