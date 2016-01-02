<properties 
	pageTitle="Enable Microsoft Passport for Work in the organization | Microsoft Azure" 
	description="Deployment instructions to enable Microsoft Passport in your organization." 
	services="active-directory" 
	documentationCenter="" 
	authors="femila" 
	manager="stevenpo" 
	editor=""
	tags="azure-classic-portal"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="11/19/2015" 
	ms.author="femila"/>

# Enable Microsoft Passport for work in the organization

After connecting Windows 10 domain joined devices with Azure AD do the following to enable Microsoft Passport for Work in the organization.

## Deploy System Center Configuration Manager version 1509 for Technical Preview
To deploy user certificates based on Microsoft Passport keys, you need the following:

- **System Center Configuration Manager version 1509 for Technical Preview**. For more information, see [Microsoft System Center Configuration Manager Technical Preview](https://technet.microsoft.com/library/dn965439.aspx#BKMK_TP3Update). and [System Center Configuration Manager Team Blog](http://blogs.technet.com/b/configmgrteam/archive/2015/09/23/now-available-update-for-system-center-config-manager-tp3.aspx).
- **PKI infrastructure**: To enable Microsoft Passport for Work using user certificates you must have a PKI infrastructure in place. If you don’t have one or you don’t want to use it for user certificates you can deploy a domain controllers (DC) of the new version of Windows Server:
 - **Deploy a DC of new version of Windows Server**: On a brand new Windows Server build 10551 or newer (The ISOs are available for download on [Signiant Media Exchange](https://datatransfer.microsoft.com/signiant_media_exchange/spring/main?sdkAccessible=true)) follow the steps to [install a replica DC in an existing domain](https://technet.microsoft.com/en-us/library/jj574134.aspx) or to [install a new Active Directory forest if creating a brand new environment](https://technet.microsoft.com/en-us/library/jj574134.aspx).

## Configure Microsoft Passport for work via Group Policy in Active Directory

 You can use an Active Directory Group Policy to configure your Windows 10 domain joined devices to provision user Microsoft Passport credentials upon user logon to Windows:

1. 	Open Server Manager and navigate to **Tools** > **Group Policy Management**.
2.	From Group Policy Management, navigate to the domain node that corresponds to the domain in which you would like to enable Azure AD Join.
3.	Right-click **Group Policy Objects** and select **New**. Give your Group Policy object a name, for example, **Enable Microsoft Passport**. Click **OK**.
4.	Right-click on your new Group Policy object and then select **Edit**.
5.	Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Passport for Work**.
6.	Right-click **Enable Passport for Work** and then select **Edit**.
7.	Select the **Enabled** radio button and then click **Apply**. Click **OK**.
8.	You may now link the Group Policy object to a location of your choice. To enable this policy for all of the domain joined Windows 10 devices at your organization, link the Group Policy to the domain. For example:
 - A specific Organizational Unit (OU) in AD where Windows 10 domain-joined computers will be located.
 - A specific security group containing Windows 10 domain-joined computers that will be auto-registered with Azure AD.

## Configure Microsoft Passport for work via deploying PowerShell through Configuration Manager 

Run the following PowerShell command:

    powershell.exe -ExecutionPolicy Bypass -NoLogo -NoProfile -Command "& {New-ItemProperty "HKLM:\Software\Policies\Microsoft\PassportForWork" -Name "Enabled" -Value 1 -PropertyType "DWord" -Force}"

## Configure certificate profile to enroll "Passport for work" enrollment certificate in Configuration manager
To use Passport for Work Certificate based logon/Microsoft Hello,  configure Certificate profile (Assets & Compliance -> Compliance Settings -> Company Resource Access -> Certificate Profiles) selecting a template that has Smart Card logon EKU.

##Setup a scheduled task, which gets triggered when the Passport for Work container is enabled and requests Certificate evaluation
This is a short term fix that admins need to create a scheduled task that listens for an Passport for Work container creation and requests certificate evaluation. This reduces the delay in setting up the container and PIN and its ability to be used on next logon.

**To create the scheduled task, use the below command or use the UI**
    schtasks /create /xml %0\..\<EnrollCertificate.xml> /tn <Task Name>

The sample xml is as below:

    <?xml version="1.0" encoding="UTF-16"?>
    <Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
       <RegistrationInfo>
         <Date>2015-09-04T17:48:45.9973761</Date>
          <Author><DomainName/UserName></Author>
        <URI>\Enroll Certificates</URI>
      </RegistrationInfo>
      <Triggers>
        <EventTrigger>
          <Enabled>true</Enabled>
          <Subscription>&lt;QueryList&gt;&lt;Query Id="0" Path="Microsoft-Windows-User Device Registration/Admin"&gt;&lt;Select Path="Microsoft-Windows-User Device Registration/Admin"&gt;*[System[Provider[@Name='Microsoft-Windows-User Device Registration'] and EventID=300]]&lt;/Select&gt;&lt;/Query&gt;&lt;/QueryList&gt;</Subscription>
        </EventTrigger>
      </Triggers>
      <Principals>
      </Principals>
      <Settings>
        <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
        <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
        <StopIfGoingOnBatteries>true</StopIfGoingOnBatteries>
        <AllowHardTerminate>true</AllowHardTerminate>
        <StartWhenAvailable>true</StartWhenAvailable>
        <RunOnlyIfNetworkAvailable>false</RunOnlyIfNetworkAvailable>
        <IdleSettings>
          <StopOnIdleEnd>true</StopOnIdleEnd>
          <RestartOnIdle>false</RestartOnIdle>
        </IdleSettings>
        <AllowStartOnDemand>true</AllowStartOnDemand>
        <Enabled>true</Enabled>
        <Hidden>false</Hidden>
        <RunOnlyIfIdle>false</RunOnlyIfIdle>
        <WakeToRun>false</WakeToRun>
        <ExecutionTimeLimit>PT1H</ExecutionTimeLimit>
        <Priority>7</Priority>
        <RestartOnFailure>
          <Interval>PT1M</Interval>
          <Count>3</Count>
        </RestartOnFailure>
      </Settings>
      <Actions Context="Author">
        <Exec>
          <Command>wmic</Command>
          <Arguments>/namespace:\\root\ccm\dcm path SMS_DesiredConfiguration call TriggerEvaluation 1,0,"ScopeId_73F3BB5E-5EDC-4928-87BD-4E75EB4BBC34/ConfigurationPolicy_db89c51e-1d1b-4a17-8e42-a5459b742ccd",8</Arguments>
        </Exec>
      </Actions>
    </Task>

Where the ScopeId_73F3BB5E-5EDC-4928-87BD-4E75EB4BBC34/ConfigurationPolicy_db89c51e-1d1b-4a17-8e42-a5459b742ccd is the ID for the certificate profile created in the step, "Configure certificate profile to enroll Passport for work enrollment certificate in Configuration manager" and <8> is the version.

## Additional Information
* [Windows 10 for the enterprise: Ways to use devices for work](active-directory-azureadjoin-windows10-devices-overview.md)
* [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-user-upgrade.md)
* [Authenticating identities without passwords through Microsoft Passport](active-directory-azureadjoin-passport.md)
* [Learn about usage scenarios for Azure AD Join](active-directory-azureadjoin-deployment-aadjoindirect.md)
* [Connect domain-joined devices to Azure AD for Windows 10 experiences](active-directory-azureadjoin-devices-group-policy.md)
* [Set up Azure AD Join](active-directory-azureadjoin-setup.md)