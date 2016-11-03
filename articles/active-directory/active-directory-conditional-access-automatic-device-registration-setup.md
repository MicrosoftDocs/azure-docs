---
title: Set up automatic registration of Windows domain-joined devices with Azure Active Directory | Microsoft Docs
description: Set up your domain-joined Windows devices to register automatically and silently with Azure Active Directory.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/24/2016
ms.author: markvi

---
# Set up automatic registration of Windows domain-joined devices with Azure Active Directory
To use [Azure Active Directory device-based conditional access](active-directory-conditional-access.md), your Windows domain-joined computers must be registered with Azure Active Directory (Azure AD). In this article, you can learn what you need to do to set up registration of Windows domain-joined devices with Azure AD in your organization.

Using conditional access in Azure AD gives you these advantages:

* Enhanced single sign-on (SSO) experience in Azure AD apps through work or school accounts
* Enterprise roaming of settings across devices
* Access to Windows Store for Business
* Stronger authentication and convenient sign-in with Windows Hello

> [!NOTE]
> The Windows 10 November Update offers some of the enhanced user experiences in Azure AD, but the Windows 10 Anniversary Update fully supports device-based conditional access. For more information about conditional access, see [Azure Active Directory device-based conditional access](active-directory-conditional-access.md). For more information about Windows 10 devices in the workplace and how a user registers a Windows 10 device with Azure AD, see [Windows 10 for the enterprise: Use devices for work](active-directory-azureadjoin-windows10-devices-overview.md).
> 
> 

You can register some earlier versions of Windows, including these versions:

* Windows 8.1
* Windows 7

If you are using a Windows Server computer as a desktop, you can register these platforms:

* Windows Server 2016
* Windows Server 2012 R2
* Windows Server 2012
* Windows Server 2008 R2

## Prerequisites
The main requirement for automatic registration of domain-joined devices by using Azure AD is to have an up-to-date version of Azure Active Directory Connect (Azure AD Connect).

Depending on how you deployed Azure AD Connect, and whether you used an express or custom installation or an in-place upgrade, the following prerequisites might have been configured automatically:

* **Service connection point in on-premises Active Directory**. For discovery of Azure AD tenant information by computers that register for Azure AD.
* **Active Directory Federation Services (AD FS) issuance transform rules**. For computer authentication on registration (applicable to federated configurations).

If some devices in your organizations are not Windows 10 domain-joined devices, make sure you do the following tasks:

* Set a policy in Azure AD so that users can register devices
* Set Integrated Windows Authentication (IWA) as a valid alternative to multi-factor authentication in AD FS

## Set a service connection point for discovery of the Azure AD tenant
A service connection point object must exist in the configuration naming context partition of the forest of the domain where computers are joined. The service connection point holds discovery information about the Azure AD tenant where computers register. In a multi-forest Active Directory configuration, the service connection point must exist in all forests that have domain-joined computers.

Set the service connection point at these locations in Active Directory:

    CN=62a0ff2e-97b9-4513-943f-0d221bd30080,CN=Device Registration Configuration,CN=Services,[Configuration Naming Context]

> [!NOTE]
> For a forest with the Active Directory domain name *example.com*, the configuration naming context is CN=Configuration,DC=example,DC=com.
> 
> 

You can check for the Azure AD tenant object and discovery values by using the following Windows PowerShell script. (Replace the configuration naming context in the example with your configuration naming context.)

    $scp = New-Object System.DirectoryServices.DirectoryEntry;

    $scp.Path = "LDAP://CN=62a0ff2e-97b9-4513-943f-0d221bd30080,CN=Device Registration Configuration,CN=Services,CN=Configuration,DC=example,DC=com";

    $scp.Keywords;

The `$scp.Keywords` output shows the Azure AD tenant information:

    azureADName:microsoft.com

    azureADId:72f988bf-86f1-41af-91ab-2d7cd011db47

If the service connection point doesn’t exist, create it by running the following PowerShell script on the Azure AD Connect server:

    Import-Module -Name "C:\Program Files\Microsoft Azure Active Directory Connect\AdPrep\AdSyncPrep.psm1";

    $aadAdminCred = Get-Credential;

    Initialize-ADSyncDomainJoinedComputerSync –AdConnectorAccount [connector account name] -AzureADCredentials $aadAdminCred;


> [!NOTE]
> When you run `$aadAdminCred = Get-Credential`, use the format *user@example.com* for the user name in the **Get-Credential** dialog box.  
> When you run the Initialize-ADSyncDomainJoinedComputerSync cmdlet, replace [*connector account name*] with the domain account that's used in the Active Directory connector account.  
> The cmdlet uses the Active Directory PowerShell module, which relies on Active Directory Web Services in a domain controller. Active Directory Web Services is supported in domain controllers in Windows Server 2008 R2 and later versions. For domain controllers in Windows Server 2008 or earlier versions, use the System.DirectoryServices API via PowerShell to create the service connection point, and then assign the Keywords values.
> 
> 

## Create AD FS rules for instant device registration in federated organizations
In a federated Azure AD configuration, devices rely on AD FS (or on the on-premises federation server) to authenticate to Azure AD. Then, they register against Azure Active Directory Device Registration Service (Azure AD Device Registration Service).

> [!NOTE]
> In a non-federated configuration, user password hashes are synced to Azure AD, and Windows 10 and Windows Server 2016 domain-joined computers authenticate against Azure AD Device Registration Service. A user authenticates by using a credential that the user writes into their on-premises computer accounts, and which is relayed to Azure AD via Azure AD Connect. For non-Windows 10 and Windows Server 2016 computers in a non-federated configuration, you have options for setting a device-based certificate authority in your organization. For more information, see the section Download Windows Installer packages for non-Windows 10 computers in this article.
> 
> 

For Windows 10 and Windows Server 2016 computers, Azure AD Connect associates the device object in Azure AD with the on-premises computer account object. The following claims must exist during authentication for Azure AD Device Registration Service to complete registration and create the device object:

* http://schemas.microsoft.com/ws/2012/01/accounttype contains the DJ value, which identifies the principal authenticator as a domain-joined computer.
* http://schemas.microsoft.com/identity/claims/onpremobjectguid contains the value of the **objectGUID** attribute of the on-premises computer account.
* http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid contains the computer's primary security identifier (SID), which corresponds to the **objectSid** attribute value of the on-premises computer account.
* http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid contains the value that Azure AD uses to trust the token issued from AD FS or from the on-premises Security Token Service (STS). This is important in a multi-forest Active Directory configuration. In this configuration, computers might be joined to a forest other than the one that connects to Azure AD at the AD FS or on-premises STS. For the AD FS, use the value http://<*domain-name*>/adfs/services/trust/, where <*domain-name*> is the validated domain name in Azure AD.

To create these rules manually, in AD FS, use the following PowerShell script in a session that is connected to your server. Replace the first line with your validated organization domain name in Azure AD.

> [!NOTE]
> If you don’t use AD FS for your on-premises federation server, follow your vendor's instructions to create the rules that issue these claims.
> 
> 

    $validatedDomain = "example.com"      # Replace example.com with your organization's validated domain name in Azure AD

    $rule1 = '@RuleName = "Issue object GUID"

        c1:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", Value =~ "515$", Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"] &&

          c2:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname", Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"]

          => issue(store = "Active Directory", types = ("http://schemas.microsoft.com/identity/claims/onpremobjectguid"), query = ";objectguid;{0}", param = c2.Value);'

    $rule2 = '@RuleName = "Issue account type for domain-joined computers"

      c:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", Value =~ "515$", Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"]

      => issue(Type = "http://schemas.microsoft.com/ws/2012/01/accounttype", Value = "DJ");'

> [!NOTE]
> Use only the first three rules if your environment on-premises is a single forest. If your computers are in a different forest than the one synchronizing with Azure AD or if the you use alternate names to the ones in the synchronization configuration, you must also include the remaining rules.
> 
> 

    $rule3 = '@RuleName = "Pass through primary SID"

      c1:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", Value =~ "515$", Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"] &&

      c2:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid", Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"]

      => issue(claim = c2);'

    $rule4 = '@RuleName = "Issue AccountType with the value User when it’s not a computer account"

      NOT EXISTS([Type == "http://schemas.microsoft.com/ws/2012/01/accounttype", Value == "DJ"])

      => add(Type = "http://schemas.microsoft.com/ws/2012/01/accounttype", Value = "User");'

    $rule5 = '@RuleName = "Capture UPN when AccountType is User and issue the IssuerID"

      c1:[Type == "http://schemas.xmlsoap.org/claims/UPN"] &&

      c2:[Type == "http://schemas.microsoft.com/ws/2012/01/accounttype", Value == "User"]

      => issue(Type = "http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid", Value = regexreplace(c1.Value, ".+@(?<domain>.+)", "http://${domain}/adfs/services/trust/"));'

    $rule6 = '@RuleName = "Update issuer for DJ computer auth"

      c1:[Type == "http://schemas.microsoft.com/ws/2012/01/accounttype", Value == "DJ"]

      => issue(Type = "http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid", Value = "http://'+$validatedDomain+'/adfs/services/trust/");'

    $existingRules = (Get-ADFSRelyingPartyTrust -Identifier urn:federation:MicrosoftOnline).IssuanceTransformRules

    $updatedRules = $existingRules + $rule1 + $rule2 + $rule3 + $rule4 + $rule5 + $rule6

    $crSet = New-ADFSClaimRuleSet -ClaimRule $updatedRules

    Set-AdfsRelyingPartyTrust -TargetIdentifier urn:federation:MicrosoftOnline -IssuanceTransformRules $crSet.ClaimRulesString

> [!NOTE]
> Windows 10 and Windows Server 2016 domain-joined computers authenticate by using IWA to an active WS-Trust endpoint that is hosted by AD FS. Make sure that the endpoint is active. If you are using the Web Application Proxy, be sure that this endpoint is published through the proxy. The endpoint is adfs/services/trust/13/windowstransport. To check whether it's active, in the AD FS management console go to **Service** > **Endpoints**. If you don’t use AD FS for your on-premises federation server, follow your vendor's instructions to make sure that the corresponding endpoint is active.
> 
> 

## Set up AD FS for authentication of device registration
Make sure that IWA is set as a valid alternative to multi-factor authentication for device registration in AD FS. To do this, you need to have an issuance transform rule that passes through the authentication method.

1. In the AD FS management console, go to **AD FS** > **Trust Relationships** > **Relying Party Trusts**.
2. Right-click the Microsoft Office 365 Identity Platform relying party trust object, and then select **Edit Claim Rules**.
3. On the **Issuance Transform Rules** tab, select **Add Rule**.
4. In the **Claim rule** template list, select **Send Claims Using a Custom Rule**.
5. Select **Next**.
6. In the **Claim rule name** box, enter **Auth Method Claim Rule**.
7. In the **Claim rule** box, enter this command:
   
   `c:[Type == "http://schemas.microsoft.com/claims/authnmethodsreferences"]
   => issue(claim = c);`.
8. On your federation server, enter this PowerShell command:
   
    `Set-AdfsRelyingPartyTrust -TargetName <RPObjectName> -AllowedAuthenticationClassReferences wiaormultiauthn`

<*RPObjectName*> is the relying party object name for your Azure AD relying party trust object. This object usually is named *Microsoft Office 365 Identity Platform*.

## Deployment and rollout
When domain-joined computers meet the prerequisites, they are ready to register with Azure AD.

The Windows 10 Anniversary Update and Windows Server 2016 domain-joined computers automatically register with Azure AD the next time the device restarts or when a user signs in to Windows. New computers that are joined to the domain register with Azure AD when the device restarts after the domain join operation.

> [!NOTE]
> Windows 10 domain-joined computers automatically register with Azure AD only if the rollout Group Policy object is set.
> 
> 

You can use a Group Policy object to control the rollout of automatic registration of Windows 10 and Windows Server 2016 domain-joined computers. To roll out automatic registration of non-Windows 10 domain-joined computers, you can deploy a Windows Installer package to computers that you select.

> [!NOTE]
> The Group Policy for rollout control also triggers the registration of Windows 8.1 domain-joined computers. You can use the policy for registering Windows 8.1 domain-joined computers. Or, if you have a mix of Windows versions, including Windows 7 or Windows Server versions, you can register all your non-Windows 10 and Windows Server 2016 computers by using a Windows Installer package.
> 
> 

### Create a Group Policy object to control the rollout of automatic registration
To control the rollout of automatic registration of domain-joined computers with Azure AD, you can deploy the **Register domain-joined computers as devices** Group Policy to the computers you want to register. For example, you can deploy the policy to an organizational unit or to a security group.

To set the policy, do these steps:

1. Open Server Manager, and then go to **Tools** > **Group Policy Management**.
2. Go to the domain node that corresponds to the domain where you want to activate auto-registration of Windows 10 or Windows Server 2016 computers.
3. Right-click **Group Policy Objects**, and then select **New**.
4. Enter a name for your Group Policy object. For example, *Automatic Registration to Azure AD*. Select **OK**.
5. Right-click your new Group Policy object, and then select **Edit**.
6. Go to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Device Registration**. Right-click **Register domain joined computers as devices**, and then select **Edit**.
   
   > [!NOTE]
   > This Group Policy template has been renamed from earlier versions of the Group Policy Management console. If you are using an earlier version of the console, go to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Workplace Join** > **Automatically workplace join client computers**.
   > 
   > 
7. Select **Enabled**, and then select **Apply**.
8. Select **OK**.
9. Link the Group Policy object to a location of your choice. For example, you can link it to a specific organizational unit. You also could link it to a specific security group of computers that automatically register with Azure AD. To set this policy for all domain-joined Windows 10 and Windows Server 2016 computers in your organization, link the Group Policy object to the domain.

### Download Windows Installer packages for non-Windows 10 computers
To register domain-joined computers running Windows 8.1, Windows 7, Windows Server 2012 R2, Windows Server 2012, or Windows Server 2008 R2, you can download and install these Windows Installer package (.msi) files:

* [x64](http://download.microsoft.com/download/C/A/7/CA79FAE2-8C18-4A8C-A4C0-5854E449ADB8/Workplace_x64.msi)
* [x86](http://download.microsoft.com/download/C/A/7/CA79FAE2-8C18-4A8C-A4C0-5854E449ADB8/Workplace_x86.msi)

Deploy the package by using a software distribution system like System Center Configuration Manager. The package supports the standard silent install options with the *quiet* parameter. System Center Configuration Manager 2016 offers additional benefits from earlier versions, like the ability to track completed registrations. For more information, see [System Center 2016](https://www.microsoft.com/en-us/cloud-platform/system-center).

The installer creates a scheduled task on the system that runs in the user’s context. The task is triggered when the user signs in to Windows. The task silently registers the device with Azure AD with the user credentials after authenticating through IWA. To see the scheduled task, go to **Microsoft** > **Workplace Join**, and then go to the Task Scheduler library.

## Next steps
* [Azure Active Directory conditional access](active-directory-conditional-access.md)

