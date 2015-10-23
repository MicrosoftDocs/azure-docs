<properties
	pageTitle="Using device conditions to secure access to resources"
	description="Enforce conditional access by configuring device policies to ensure compliant devices and disallow access from lost, stolen, non-compliant devices."
	services="active-directory, virtual-network"
	documentationCenter=""
	authors="femila"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.devlang="na"
	ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="identity" 
	ms.date="08/19/2015"
	ms.author="femila"/>

#Using device conditions to secure access to resources

Conditional access control in Azure Active Directory provides you the ability to secure access to your resources by specifying the conditions that meet your needs, and since this can be set on a per-application basis, you can set different conditions for different applications.
 
One of the conditions you can use is "**require compliant device**". Setting this in the access rules on an application will require the user to bring their device into compliance before they can access that application. This ensures that the only devices that adhere to your device policies are allowed to access the application. This enables you to enforce device policies such as requiring a pin lock on the device, and also allows you to remotely wipe the enterprise content on the device in case the device is lost or stolen.
 
Since many companies have a mix of domain joined Windows machines as well as mobile devices, Azure AD provides a way for both kinds of devices to be set in your access policies.
 
The first step in setting the device condition is to make sure that your device policies are created, and the devices can be registered in Azure AD. Use the following directions for this step:

1.	[Set the device policies in Intune for your mobile devices managed by Intune.](https://technet.microsoft.com/en-us/library/dn705843.aspx) 
2.	[Enable your domain joined machines to be automatically registered in Azure AD.]() This ensures that the devices are recognized when the device policies are enforced.
3.	[Enable the Azure AD device registration service]()

 After you have completed the above steps, visit the Azure AD portal and configure device policies.

## Configure device policies

1. Select the directory in which you have the application that needs to be secured, and pick the applications tab to give you a list of applications.  
Pick the application that you need to secure, and click on the “**configure**” tab.
2.  You can now turn on the device policies. You have the option to set this policy to apply to all users who use the application or only to a specific group of users. Applying to specific groups is especially handy if you want to pilot the policies to some users before rolling this out to all users. Click the Groups option, and then use “Add Group”, which gives you the group picker to pick the group you want to use. You can keep adding groups if you want to enforce this to more than one group.
  
3. You can also choose to exempt groups of users from being enforced with this policy.
4. Until the policy is saved, several of the changes you made show up in purple. You can make the change permanent by clicking the save button at the bottom.

5. Once saved, this color changes to blue to show the changes have been saved.
6.  You can either enforce the "require compliant device" policy always for all device platforms or only for the specific device platforms you pick among iOS, Android and Windows. Picking all platforms allows you to block the unsupported device platforms from accessing the application. 
7.  You have three options for how your Windows devices will be treated in regards to device compliance. Only domain joined machines are considered to be compliant. Only devices marked as compliant by Intune or SCCM are considered to be compliant. Or both domain joined and devices marked as compliant are considered to be compliant devices.
8.  Selecting the individual platforms will only enforce the policy on those platforms, allowing users from all other device platforms to access the application without needing to be compliant with your policies.
9. Some companies choose to make different enforcement decisions depending on whether the access if from a native mobile app or from a browser. So Azure AD provides the control for you to pick the enforcement of the policy, whether it applies to only native apps or for both native apps and browser.

 

>AZURE.NOTE
Native apps need to ensure that they can meet the needs of device authentication, since that will be required when the device conditions are set on the application. Azure AD Authentication library has built in capability to authenticate the device every time an access token is provided to client app.  Native apps that are not able to do the device authentication will result in access being denied. Always test to make sure your native apps work as desired with this policy turned on.

>AZURE.NOTE If you are setting this policy on any application other than Exchange Online or SharePoint online, and those applications also have native mobile apps that can do device auth, you will also need to ensure that the Azure Authenticator is installed on iOS devices. Use Intune policies to push the authenticator app on your iOS devices. <get pointer from intune>
 
If you are setting these policies on Exchange Online, you will also have the option to choose the options for Exchange ActiveSync to be enforced.

 
 

For EAS, you can choose to enforce this only on the supported EAS platforms, which results in the unsupported platforms to be unaffected by this policy.
Or you can choose all platforms, which requires every EAS access to be from a compliant device, blocking the unsupported platforms.

 

Once the device based rules are enabled in Azure AD for an application, when users access that application, they will be provided with instructions to get their device in compliance in order to access the application.
