<properties 
	pageTitle="Connect domain-joined devices to Azure AD for Windows 10 experiences | Microsoft Azure" 
	description="Explains how administrators can configure group policies to enable devices to be domain-joined to the enterprise network." 
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

# Connect domain-joined devices to Azure AD for Windows 10 experiences

Domain Join is the traditional way organizations have connected devices for work for the last 15 years and more. It has enabled users to sign in to their devices using their AD work accounts and allowed IT to manage fully these devices. Organizations typically rely on imaging methods to provision devices to users and generally use System Center Configuration Manager (SCCM) or Group Policy to manage them.

Domain Join in Windows 10 will provide the following benefits after being connected to Azure AD:

- SSO (single sign-on) to Azure AD resources from anywhere.
- Access to enterprise Windows store using work accounts (no Microsoft account required).
- Enterprise compliant roaming of user settings across devices using work account (no Microsoft account required)
- Strong authentication and convenient sign-in for work account with Microsoft Passport and Windows Hello.
- Ability to restrict access to devices compliant with organizational device policies.

##Prerequisities

Domain Join continues to be the way it works, however to get the Azure AD benefits for SSO, roaming of settings with work account, access to Windows Store with work account, you will need the following:

- Azure AD subscription.
- Azure AD Connect to extend on-premises directory to Azure AD.
- Set policy to connect domain joined devices to Azure AD.
- Windows 10 build (build 10551 or newer) for devices.

To enable Microsoft Passport for Work and Windows Hello you will additionally need the following:

- PKI infrastructure for user certificates issuance.
- System Center Configuration Manager version 1509 for Technical Preview. For more information, see [Microsoft System Center Configuration Manager Technical Preview](https://technet.microsoft.com/library/dn965439.aspx#BKMK_TP3Update). and [System Center Configuration Manager Team Blog](http://blogs.technet.com/b/configmgrteam/archive/2015/09/23/now-available-update-for-system-center-config-manager-tp3.aspx). This is required to deploy user certificates based on Microsoft Passport keys.

As an alternative to the PKI deployment requirement, you can do the following:

- Have a few domain controllers with Windows Server 2016 Active Directory Domain Services.

To enable conditional access, you can create policy that allow access to ‘domain joined’ devices with no additional deployments. To manage access control based on compliance of device you will need the following:

- System Center Configuration Manager version 1509 for Technical Preview for Passport scenarios.

## Deployment instructions


## Step 1: Deploy Azure Active Directory Connect

Azure AD Connect will enable computers on-premises to be provisioned as device objects in the cloud. To deploy Azure AD Connect please refer to Enabling your directory for hybrid management with Azure AD Connect.

 - If you followed a [custom installation for Azure AD Connect](active-directory-aadconnect-get-started-custom.md) (not the Express installation), you must follow the procedure, **Create a service connection point (SCP) in on-premise Active Directory**, described below.
 - If you have a federated configuration with Azure AD before installing Azure AD Connect (for example, if you have deployed Active Directory Federation Services (AD FS) before) you will have to follow the **Configure AD FS claim rules** procedure below.

### Create a service connection point (SCP) in on-premises Active Directory

Domain joined devices will use this object to discover Azure AD tenant information at the time of auto-registration with Azure device registration service. On the Azure AD Connect server run the following PowerShell commands: 

    Import-Module -Name "C:\Program Files\Microsoft Azure Active Directory Connect\AdPrep\AdSyncPrep.psm1";

    $aadAdminCred = Get-Credential;

    Initialize-ADSyncDomainJoinedComputerSync –AdConnectorAccount [connector account name] -AzureADCredentials $aadAdminCred;

>[AZURE.NOTE]
 Replace [*connector account name*] with the domain account used as the AD connector account.

>[AZURE.NOTE]
The username of the credential entered when the Get-Credential pop-up shows, needs to be in the format *user@example.com*

### Configure AD FS claim rules
This enables instantaneous registration of a computer with Azure DRS by allowing computers to authenticate using Kerberos/NTLM via AD FS. Without this step, computers will get to Azure AD in a delayed manner (subject to Azure AD Connect sync’ times). 

>[AZURE.NOTE]
If you don’t have AD FS as the federation server on-premises please follow the instructions of your vendor to create the claim rules.

On the AD FS server run the following PowerShell commands (or on a session connected to the AD FS server):

      <#----------------------------------------------------------------------
     |   Modify the Azure AD Relying Party to include the claims needed 
     |   for DomainJoin++.  The rules include:
     |   -ObjectGuid
     |   -AccountType
     |   -ObjectSid
     +---------------------------------------------------------------------#>
 
    $existingRules = (Get-ADFSRelyingPartyTrust -Identifier urn:federation:MicrosoftOnline).IssuanceTransformRules
 
    $rule1 = '@RuleName = "Issue object GUID" 
          c1:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", Value =~ "515$", Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"] &&
          c2:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname", Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"] 
          => issue(store = "Active Directory", types = ("http://schemas.microsoft.com/identity/claims/onpremobjectguid"), query = ";objectguid;{0}", param = c2.Value);'
 
    $rule2 = '@RuleName = "Issue account type for domain joined computers" 
          c:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", Value =~ "515$", Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"] 
          => issue(Type = "http://schemas.microsoft.com/ws/2012/01/accounttype", Value = "DJ");'
 
    $rule3 = '@RuleName = "Pass through primary SID" 
          c1:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", Value =~ "515$", Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"] && 
          c2:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid", Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"] 
          => issue(claim = c2);'
 
    $updatedRules = $existingRules + $rule1 + $rule2 + $rule3
 
    $crSet = New-ADFSClaimRuleSet -ClaimRule $updatedRules
 
    Set-AdfsRelyingPartyTrust -TargetIdentifier urn:federation:MicrosoftOnline -IssuanceTransformRules $crSet.ClaimRulesString 

>[AZURE.NOTE]
Windows 10 computers will authenticate using Windows Integrated authentication to an active WS-Trust endpoint hosted by AD FS.  You must ensure this endpoint is enabled. If you are using the Web Authentication Proxy, you must also ensure this endpoint is published through the proxy. You can do this by checking that the adfs/services/trust/13/windowstransport shows as enabled in the AD FS management console under Service > Endpoints.


## Step 2: Configure automatic device registration via Group Policy in Active Directory

You can use an Active Directory Group Policy to configure your Windows 10 domain joined devices to automatically register with Azure AD. To do this please see the following step-by-step instructions:

1. 	Open Server Manager and navigate to **Tools** > **Group Policy Management**.
2.	From Group Policy Management, navigate to the domain node that corresponds to the domain in which you would like to enable Azure AD Join.
3.	Right-click **Group Policy Objects** and select **New**. Give your Group Policy object a name, for example, Automatic Azure AD Join. Click **OK**.
4.	Right-click on your new Group Policy object and then select **Edit**.
5.	Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Workplace Join**.
6.	Right-click **Automatically workplace join client computers** and then select **Edit**.
7.	Select the **Enabled** radio button and then click **Apply**. Click **OK**.
8.	You may now link the Group Policy object to a location of your choice. To enable this policy for all of the domain joined Windows 10 devices at your organization, link the Group Policy to the domain. For example:
 - A specific Organizational Unit (OU) in AD where Windows 10 domain-joined computers will be located.
 - A specific security group containing Windows 10 domain-joined computers that will be auto-registered with Azure AD.
 
>[AZURE.NOTE]
This Group Policy template has been renamed in Windows 10. If you are running the Group Policy tool from a Windows 10 computer, the policy will appear as: <br>
**Register domain joined computers as devices**
And the policy will be located under the following location:<br>
***Computer Configuration/Policies/Administrative Templates/Windows Components/Device Registration***

 
## Additional Information
* [Windows 10 for the enterprise: Ways to use devices for work](active-directory-azureadjoin-windows10-devices-overview.md)
* [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-user-upgrade.md)
* [Learn about usage scenarios for Azure AD Join](active-directory-azureadjoin-deployment-aadjoindirect.md)
* [Connect domain-joined devices to Azure AD for Windows 10 experiences](active-directory-azureadjoin-devices-group-policy.md)
* [Set up Azure AD Join](active-directory-azureadjoin-setup.md)
