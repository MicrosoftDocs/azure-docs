
<properties
	pageTitle="Azure Authenticator for Android | Microsoft Azure"
	description="Microsoft Azure Authenticator app can be used to sign-in to access work resources. The Azure Authenticator app notifies you of a pending two-factor verification request by displaying an alert to your mobile device."
	services="active-directory"
	documentationCenter=""
	authors="femila"
	manager="swadhwa"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/23/2016"
	ms.author="femila"/>

# Azure Authenticator for Android

Your IT administrator may have recommended you to use the Microsoft Azure Authenticator to sign-in to access your work resources. This application provides these two sign-in options:

* Multi-Factor Authentication allows you to secure your work or school accounts with two-step verification. You sign-in using something you know (for example, your password) and protect the account even further with something you have (a security key from this app). The Azure Authenticator app notifies you of a pending two-factor verification request by displaying an alert to your mobile device. You need to simply view the request in the app and tap verify or cancel. Alternately, you may be prompted to enter the passcode displayed in the app.

* Work Account allows you to turn your Android phone or tablet into a trusted device and provide Single Sign-On (SSO) to company applications. Your IT administrator may require you to add a work account in order to access company resources. SSO lets you sign in once and automatically avail of signing in across all applications your company has made available to you.

## Installing the Azure Authenticator app

You can install the Azure Authenticator app from Google Play Store.
The instructions to add work account from Samsung Android device vs a non-Samsung Android device are slightly different. The instructions for both are listed below.

Adding the work account from Samsung Android device
----------------------------------------------------------------------------------------------------------------
###Adding the work account through the app home screen

The following instructions are applicable to Samsung GS3 and above phones or Note2 and above tablets.

1. On the home screen of the app, accept the end user license agreement (EULA).
2. On the Activate Account screen, click the context menu on the right and select **Work account**.
3. On the Add Account screen, select** Work Account**.
4. On Activate device administrator screen, click **Activate**.
5. On the Privacy Policy screen, select the checkbox and click **Confirm**.
6. On the Workplace Join screen, enter the userID provided by your organization and click **Join**.
7. To sign in to the Azure Authenticator app, enter your organizational a****ccount and password and click **Sign in**.
8. The next screen that displays information about multi-factor authentication (MFA) is for added security and is optional. You will see this screen if your work or school requires second-factor authentication for creating work account. It provides instructions to further verify your account.
9. The Workplace Join screen displays the message, “**Joining your workplace**”. The Azure authenticator app is attempting to join your device to your workplace.
10. You should see the Workplace Joined message on the next screen.

>[AZURE.NOTE]
> You are allowed a single work account on your device.

### Adding the work account from the settings menu
After you have installed the Azure Authenticator app, you can also create a work account from the Android Account Manager.

1. From the Settings menu, navigate to **Accounts** and click **Add Account**.
2. Follow steps 3-10 in the procedure, Adding the work account through the app home screen, to add a work account.

Adding the work account from a non-Samsung Android device
------------------------------------------------------------------------------------------------------------------
### Adding the work account through the app home screen

1. On the home screen of the app, accept the end user license agreement (EULA).
2. On the Activate Account screen, click the context menu on the right and select **Work account**.
3. On the Accounts screen, click **Add Account**.
4. If you see the Accounts screen, click **Add account**. If a work account is already created previously, you will see a Sync screen showing the existing work account. You can retain the work account by simply tapping the back arrow to the home screen. Alternately, you can select the account to remove and recreate a new work account
On the Workplace Join screen, enter the userID provided by your organization and click Join.
5. To sign in to the Azure Authenticator app, enter your organizational account and password and click **Sign in**.
7. The next screen that displays information about multi-factor authentication (MFA) is for added security and is optional. You will see this screen if your work or school requires second-factor authentication for creating work account. It provides instructions to further verify your account.
8. Click **OK** on the next screen. Do not change the certificate name.
the message, “Joining your workplace”. The Azure authenticator app is attempting to join your device to your workplace.
You should see the Workplace Joined message on the next screen.

>[AZURE.NOTE]
> You are allowed a single work account on your device.

After you have installed the Azure Authenticator app, you can also create a work account from the Android Account Manager.

1. From the **Settings** menu, navigate to Accounts and click **Add Account**.
2. Follow steps 2-7 in the procedure, Adding the work account through the app home screen**, to add a work account.

### How to find out which version is installed

1. You can find out which version of the Azure Authenticator app and associated service versions are installed on your device.
2. From the pop up menu, click **About**.
3. The About screen displays the services of the app and the versions installed on your device.
 
### Sending log files to report issues

1. Follow the guidance on Microsoft Support to report an incident with the Azure Authenticator app, obtain an incident number, and send log files against the assigned incident number as follows:
2. From the pop up menu, click **Logging**.
3. If you have an open incident with Microsoft Support, make note of the incident number (you'll need it for a later step). If you have not already created a support incident and would like assistance, follow the guidance at [Microsoft Support](https://support.microsoft.com/en-us/contactus) to open a new incident.
4. On the logging screen, click **Send Now**.
5. Select the email provider you want to use.
7. If you already have an open incident Microsoft Support, contact the Support Engineer assigned to your issue to find out how to send the log data and have it associated with your incident. The Support Engineer will provide you with information for the email address and subject line. If you do not already have a support incident, please follow the guidance at Microsoft Support to open a new incident.
9. Edit the **To** line and **Subject** line with the information you have received from Microsoft Support.
10. The Azure Authenticator app attaches the log file to the email you are sending. Describe the problem you are experiencing, update recipient list (optional), and send the email.

### Deleting the work account and leaving your workplace

You can remove the work account you created at any time as follows:

**To delete the work account from the Settings menu**

1. From the accounts manager, select **Work account**.
2. On the Work Account screen, in **General Settings**, select **Account Settings – Leave your workplace network**.
3. Select **Leave** on the **Workplace Join** screen.
4. Click **OK** when the message “Are you sure you want to leave workplace” is displayed.
5. This ensures that you have deleted your work account from your workplace.

>[AZURE.NOTE]
>It is recommended that you do not use the Remove Account option to delete a work account as this option might not work in some earlier versions of Android.

##Uninstalling the app

On a Samsung Android device, device administrator privileges must be removed as follows prior to uninstalling the 
1. From **Settings**, under **System**, select **Security**.
2. Within D**evice Administration**, click **Device administrators**. Ensure that the check box next to **Azure Authenticator** is cleared.

##Troubleshooting

If you see the  **Keystore Error**, this could be because you don’t have the lock screen set up with a PIN. To work around this issue, uninstall the Azure Authenticator app, configure a PIN for your lock screen, and reinstall the app.
