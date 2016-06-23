<properties
	pageTitle="Connect domain-joined devices to Azure AD for Windows 10 experiences | Microsoft Azure"
	description="Explains how administrators can configure Group Policy to enable devices to be domain-joined to the enterprise network."
	services="active-directory"
	documentationCenter=""
	authors="femila"
	manager="swadhwa"
	editor=""
	tags="azure-classic-portal"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/23/2016"
	ms.author="femila"/>

# Connect domain-joined devices to Azure AD for Windows 10 experiences

Domain join is the traditional way organizations have connected devices for work for the last 15 years and more. It has enabled users to sign in to their devices by using their Windows Server Active Directory (Active Directory) work or school accounts and allowed IT to fully manage these devices. Organizations typically rely on imaging methods to provision devices to users and generally use System Center Configuration Manager (SCCM) or Group Policy to manage them.

Domain join in Windows 10 will provide the following benefits after you connect devices to Azure Active Directory (Azure AD):

- Single sign-on (SSO) to Azure AD resources from anywhere
- Access to the enterprise Windows Store by using work or school accounts (no Microsoft account required)
- Enterprise-compliant roaming of user settings across devices by using work or school accounts (no Microsoft account required)
- Strong authentication and convenient sign-in for work or school accounts with Microsoft Passport and Windows Hello
- Ability to restrict access only to devices that comply with organizational device Group Policy settings

## Prerequisites

Domain join continues to be useful. However, to get the Azure AD benefits of SSO, roaming of settings with work or school accounts, and access to Windows Store with work or school accounts, you will need the following:

- Azure AD subscription
- Azure AD Connect to extend the on-premises directory to Azure AD
- Policy that's set to connect domain-joined devices to Azure AD
- Windows 10 build (build 10551 or newer) for devices

To enable Microsoft Passport for Work and Windows Hello, you will also need the following:

- Public key infrastructure (PKI) for user certificates issuance.
- System Center Configuration Manager version 1509 for Technical Preview. For more information, see [Microsoft System Center Configuration Manager Technical Preview](https://technet.microsoft.com/library/dn965439.aspx#BKMK_TP3Update) and [System Center Configuration Manager Team Blog](http://blogs.technet.com/b/configmgrteam/archive/2015/09/23/now-available-update-for-system-center-config-manager-tp3.aspx). This is required to deploy user certificates based on Microsoft Passport keys.

As an alternative to the PKI deployment requirement, you can do the following:

- Have a few domain controllers with Windows Server 2016 Active Directory Domain Services.

To enable conditional access, you can create Group Policy settings that allow access to domain-joined devices with no additional deployments. To manage access control based on compliance of the device, you will need the following:

- System Center Configuration Manager version 1509 for Technical Preview for Passport scenarios

## Deployment instructions



### Step 1: Deploy Azure Active Directory Connect

Azure AD Connect will enable you to provision computers on-premises as device objects in the cloud. To deploy Azure AD Connect, refer to "Install Azure AD Connect" in the article [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md#install-azure-ad-connect).

 - If you followed a [custom installation for Azure AD Connect](active-directory-aadconnect-get-started-custom.md) (not the Express installation), then follow the procedure **Create a service connection point in on-premises Active Directory**, later in this step.
 - If you have a federated configuration with Azure AD before installing Azure AD Connect (for example, if you have deployed Active Directory Federation Services (AD FS) before), then follow the **Configure AD FS claim rules** procedure, later in this step.

#### Create a service connection point in on-premises Active Directory

Domain-joined devices will use the service connection point to discover Azure AD tenant information at the time of automatic registration with the Azure device registration service.

On the Azure AD Connect server, run the following PowerShell commands:

    Import-Module -Name "C:\Program Files\Microsoft Azure Active Directory Connect\AdPrep\AdSyncPrep.psm1";

    $aadAdminCred = Get-Credential;

    Initialize-ADSyncDomainJoinedComputerSync –AdConnectorAccount [connector account name] -AzureADCredentials $aadAdminCred;


When running the cmdlet $aadAdminCred = Get-Credential, use the format *user@example.com* for the user name of the credential that's entered when the Get-Credential pop-up appears.

When running the cmdlet Initialize-ADSyncDomainJoinedComputerSync ..., replace [*connector account name*] with the domain account that's used as the Active Directory connector account.

#### Configure AD FS claim rules
Configuring the AD FS claim rules enables instantaneous registration of a computer with Azure device registration service by allowing computers to authenticate by using Kerberos/NTLM via AD FS. Without this step, computers will get to Azure AD in a delayed manner (subject to Azure AD Connect sync times).

>[AZURE.NOTE]
If you don’t have AD FS as the federation server on-premises, follow the instructions of your vendor to create the claim rules.

On the AD FS server (or on a session connected to the AD FS server), run the following PowerShell commands:

      <#----------------------------------------------------------------------
     |   Modify the Azure AD Relying Party to include the claims needed
     |   for DomainJoin++. The rules include:
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
Windows 10 computers will authenticate by using Windows Integrated authentication to an active WS-Trust endpoint hosted by AD FS. Ensure that this endpoint is enabled. If you are using the Web Authentication Proxy, also ensure that this endpoint is published through the proxy. You can do this by checking the adfs/services/trust/13/windowstransport. It should show as enabled in the AD FS management console under **Service** > **Endpoints**.


### Step 2: Configure automatic device registration via Group Policy in Active Directory

You can use Group Policy in Active Directory to configure your Windows 10 domain-joined devices to automatically register with Azure AD. To do this, use the following step-by-step instructions:

1. 	Open Server Manager and navigate to **Tools** > **Group Policy Management**.
2.	From Group Policy Management, navigate to the domain node that corresponds to the domain in which you would like to enable Azure AD Join.
3.	Right-click **Group Policy Objects**, and then select **New**. Give your Group Policy object a name, for example, Automatic Azure AD Join. Click **OK**.
4.	Right-click your new Group Policy object, and then select **Edit**.
5.	Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Workplace Join**.
6.	Right-click **Automatically workplace join client computers**, and then select **Edit**.
7.	Select the **Enabled** option button, and then click **Apply**. Click **OK**.
8.	Link the Group Policy object to a location of your choice. To enable this policy for all of the domain-joined Windows 10 devices at your organization, link the Group Policy object to the domain. For example:
 - A specific organizational unit (OU) in Active Directory where Windows 10 domain-joined computers will be located
 - A specific security group containing Windows 10 domain-joined computers that will be auto-registered with Azure AD

>[AZURE.NOTE]
This Group Policy template has been renamed in Windows 10. If you are running the Group Policy tool from a Windows 10 computer, the policy will appear as: <br>
**Register domain joined computers as devices**<br>
The policy is in the following location:<br>
***Computer Configuration/Policies/Administrative Templates/Windows Components/Device Registration***


## Additional information
* [Windows 10 for the enterprise: Ways to use devices for work](active-directory-azureadjoin-windows10-devices-overview.md)
* [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-user-upgrade.md)
* [Learn about usage scenarios for Azure AD Join](active-directory-azureadjoin-deployment-aadjoindirect.md)
* [Connect domain-joined devices to Azure AD for Windows 10 experiences](active-directory-azureadjoin-devices-group-policy.md)
* [Set up Azure AD Join](active-directory-azureadjoin-setup.md)
