<properties
	pageTitle="Configure automatic device registration for Windows 8.1 domain joined devices| Microsoft Azure"
	description=" Steps to configure group policy for Windows 8.1 domain-joined devices to automatically register with Azure AD. "
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

# Configure automatic device registration for Windows 8.1 domain joined devices

You can use an Active Directory Group Policy to configure your Windows 8.1 domain joined devices to automatically register with Azure AD. To configure the Group Policy, you must have at least one domain joined Windows Server 2012 R2 or Windows 8.1 machine with the Group Policy Management feature installed. Once this Group Policy is enabled for your domain, any domain user that logs into the machine will be automatically and silently registered with a device object in Azure AD. There will be one device object in Azure AD for every registered user of the physical device.Be sure to read through and complete the prerequisites from the Automatic Device Registration with Azure Active Directory for Windows Domain-Joined Devices.

## Configure the Group Policy for your Windows 8.1 domain joined devices

1. Open Server Manager and navigate to **Tools** > **Group Policy Management**.
2. From Group Policy Management, navigate to the domain node that corresponds to the domain in which you would like to enable **Automatic Workplace Join**.
3. Right-click **Group Policy Objects** and select **New**. Give your Group Policy object a name, for example, **Automatic Workplace Join**. Click **OK**.
4. Right-click on your new Group Policy object and then select **Edit**.
5. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Workplace Join**.
6. Right-click Automatically workplace join client computers and then select **Edit**.
7. Select the Enabled radio button and then click Apply. Click **OK**.
8. You may now link the Group Policy object to a location of your choice. To enable this policy for all of the domain joined Windows 8.1 devices at your organization, link the Group Policy to the domain.

## Unregistering your Windows 8.1 domain joined devices

You may choose unregister your domain joined Windows 8.1 devices by doing the following:
Modify the Workplace Join Group Policy settings created in the previous section. Set the Automatically workplace join client computers policy to disabled. This will prevent new devices from automatically joining the workplace.

Unregister the existing domain joined Windows 8.1 machines by following one of the two options below:

* Option 1: **Unregister a Windows 8.1 domain joined device using PC Settings**
  1. On the Windows 8.1 device, navigate to **PC Settings** > **Network** > **Workplace**
  2. Select **Leave**.
This process must be repeated for each domain user that has signed into the machine and has been automatically workplace joined.

* Option 2: Unregister a Windows 8.1 domain joined device using a script
  	1. Open a command prompt on the Windows 8.1 machine and execute the following command:
   ` %SystemRoot%\System32\AutoWorkplace.exe leave`
   
This command must be run in the context of each domain user that has signed into the machine.

##Event Viewer & Errors for Windows 8.1 domain joined devices

The Windows Event Log on a Windows 8.1 machine displays messages related to device registration. You will find messages for both successful and unsuccessful events. 

The Event Log can be found in the Event Viewer under Applications and Services **Logs** > **Microsoft** > **Windows > Workplace Join**.

##Additional details

The Group Policy enables a Scheduled Task on the system that runs in the user’s context and is triggered on user sign-in. The task will silently register the user and device with Azure AD after the sign-in is complete. The Scheduled Task can be found on Windows 8.1 devices in the Task Scheduler Library under **Microsoft** > **Windows** > **Workplace Join**. The task will run and register any and all Active Directory users that sign-into. 

## Additional topics
- [Azure Active Directory Device Registration overview](active-directory-conditional-access-device-registration-overview.md)
- [Automatic device registration with Azure Active Directory for Windows 10 domain-joined devices](active-directory-conditional-access-automatic-device-registration.md)
- [Configure automatic device registration for Windows 7 domain joined devices](active-directory-conditional-access-automatic-device-registration-windows7.md)

