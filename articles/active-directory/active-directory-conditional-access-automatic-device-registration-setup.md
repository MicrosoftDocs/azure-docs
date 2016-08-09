<properties
	pageTitle="How to setup automatic Registration of Windows domain joined devices with Azure Active Directory| Microsoft Azure"
	description="IT admins can choose to have their domain-joined Windows devices to register automatically and silently with Azure Active Directory (Azure AD) ."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/09/2016"
	ms.author="markvi"/>



# How to setup automatic registration of Windows domain joined devices with Azure Active Directory 

Registration of Windows domain joined computers with Azure AD is required to enable [Azure Active Directory device-based conditional access](active-directory-conditional-access.md).

Update like allowing the use of the work or school account to get an enhanced SSO experience to Azure AD apps, enterprise roaming of settings across devices, use of the Windows Store for Business and have a stronger authentication and convenient sign-in with Windows Hello. 

> [AZURE.NOTE] Windows 10 November 2015 Update supports some of the enhanced user experiences, however it is the Anniversary Update which has full support for Device-based Conditional Access.  
For more information on conditional access, see [Azure Active Directory device-based conditional access](active-directory-conditional-access.md).  
For more information on Windows 10 devices in the workplace and the  experiences users get when registered with Azure AD please see [Windows 10 for the enterprise: Ways to use devices for work](active-directory-azureadjoin-windows10-devices-overview.md). 


Registration is supported in previous versions of Windows including: 

- Windows 8.1 

- Windows 8.0 

- Windows 7 

For the use case of Windows Server computers used as a desktop (for example, a developer using a Windows Server as the primary computer) the following platforms can be registered: 

- Windows Server 2016 

- Windows Server 2012 R2 

- Windows Server 2012 

- Windows Server 2008 R2 

Below, you find what you need to do in your environment to enable registration of Windows domain joined devices with Azure AD in your organization. You will see: 

1. Prerequisites 

2. Deployment and roll-out 

3. Troubleshooting 

4. FAQ 

 

## Prerequisites 

The main requirement to enable automatic registration of domain joined devices with Azure AD is to have an up to date version of Azure AD Connect. 

Depending on how you deployed Azure AD Connect, whether Express or Custom installation or an in-place upgrade, the following prerequisites may have been configured automatically: 

1. Service Connection Point (SCP) in on-premises Active Directory for discovery of Azure AD tenant information by computers registering to Azure AD. 

2. AD FS Issuance Transform Rules for computer authentication upon registration (applicable to federated configurations). 

If you have non-Windows 10 domain joined computers in your organization, you need the following: 

1. Ensure that the policy for allowing users to register devices is enabled in Azure AD. 

2. Ensure Windows Integrated authentication (WIA) is set as a valid alternative to Multifactor authentication (MFA) in AD FS. 

 

## Service Connection Point for discovery of Azure AD tenant 

An SCP object that holds discovery information about the Azure AD tenant where computers will register, must exist in the Configuration Naming Context partition of the forest of the domain where computers are joined to. In a multi-forest configuration of Active Directory, the SCP must exist in all forests where computers have joined. 

The SCP should be found at the following location in Active Directory: 

	CN=62a0ff2e-97b9-4513-943f-0d221bd30080,CN=Device Registration Configuration,CN=Services,[Configuration Naming Context] 

> [AZURE.NOTE] For a forest with an Active Directory domain name of example.com the Configuration Naming Context is CN=Configuration,DC=example,DC=com 

You can check the existence of the object and the values for discovery of the Azure AD tenant using the following PowerShell script (replace the Configuration Naming Context in the example with yours): 

	$scp = New-Object System.DirectoryServices.DirectoryEntry; 

	$scp.Path = "LDAP://CN=62a0ff2e-97b9-4513-943f-0d221bd30080,CN=Device Registration Configuration,CN=Services,CN=Configuration,DC=example,DC=com"; 

	$scp.Keywords; 

The output of $scp.Keywords shows the Azure AD tenant information like follows: 

	azureADName:microsoft.com 

	azureADId:72f988bf-86f1-41af-91ab-2d7cd011db47 

If the SCP doesn’t exist, you can create it by running the following PowerShell script on the Azure AD Connect server: 

	Import-Module -Name "C:\Program Files\Microsoft Azure Active Directory Connect\AdPrep\AdSyncPrep.psm1"; 

	$aadAdminCred = Get-Credential; 

	Initialize-ADSyncDomainJoinedComputerSync –AdConnectorAccount [connector account name] -AzureADCredentials $aadAdminCred; 


> [AZURE.NOTE] When running $aadAdminCred = Get-Credential, use the format user@example.com for the user name of the credential that's entered when the Get-Credential pop-up appears.  
> When running the cmdlet Initialize-ADSyncDomainJoinedComputerSync, replace [connector account name] with the domain account that's used as the Active Directory connector account.  
> The cmdlet above uses the Active Directory PowerShell module which relies on Active Directory Web Services (ADWS) in domain controllers (DCs). ADWS is supported in Windows Server 2008 R2 or above DCs. If you only have Windows Server 2008 DCs or below you can use System.DirectoryServices API via PowerShell to create the SCP and assign the appropriate Keywords values. 

## AD FS rules for instant computer registration (federated orgs) 

On a federated configuration of Azure AD, computers will rely on AD FS (or the on-premises federation server) to authenticate to Azure AD for registration against the Azure Device Registration Service (Azure DRS). 

> [AZURE.NOTE] On a non-federated configuration (i.e. user password hashes sync’ed to Azure AD), Windows 10 and Windows Server 2016 domain joined computers authenticate against Azure DRS using a credential they write into their computer accounts on-premises which is taken up to Azure AD via Azure AD Connect. For non-Windows 10/Windows Server 2016 computers on a non-federated configuration see the section Windows Installer package for registration of non-Windows 10/Windows Server 2016 domain joined computers under Deployment and roll-out below in this document for options you have to enable Device-based CA in your organization. 

For Windows 10 and Windows Server 2016 computers, Azure AD Connect associates the device object in Azure AD with the computer account object on-premises. For this to work, the following claims must exist during authentication for Azure DRS to complete registration and create the device object in the first place: 

- `http://schemas.microsoft.com/ws/2012/01/accounttype`  - containing the value of “DJ” which identifies the principal authenticating as a domain joined computer. 
- `http://schemas.microsoft.com/identity/claims/onpremobjectguid` - containing the value of the objectGUID attribute of the computer account on-premises. 
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid` - containing the computer primary SID, corresponding to the value of the objectSid attribute of the computer account on-premises. 
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid` - containing the appropriate value that allows Azure AD to trust the token issued from AD FS or the on-premises STS. This is important on a multi-forest Active Directory configuration where computers may be joined to a different forest than the one that connects to Azure AD where the AD FS or on-premises STS is. For the AD FS case the value should be `http://<domain-name>/adfs/services/trust/` where “\<domain-name\>” is the validated domain name in Azure AD. 

To create these rules manually, in AD FS you can use the following PowerShell script on session connected to your server. Please note that the first line needs to be replaced with the validated domain name in Azure AD for your organization. 

> [AZURE.NOTE] If you don’t have AD FS as your on-premises federation server, follow the instructions of your vendor to create the appropriate rules to issue these claims. 

	$validatedDomain = "example.com"      # Replace example.com with your validated domain name in Azure AD 

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

	$rule4 = '@RuleName = "Issue AccountType with the value User when it’s not a computer account" 

      NOT EXISTS([Type == "http://schemas.microsoft.com/ws/2012/01/accounttype", Value == "DJ"]) 

      => add(Type = "http://schemas.microsoft.com/ws/2012/01/accounttype", Value = "User");' 

	$rule5 = '@RuleName = "Capture UPN when AccountType is User and issue the IssuerID" 

      c1:[Type == "http://schemas.xmlsoap.org/claims/UPN"] && 

      c2:[Type == "http://schemas.microsoft.com/ws/2012/01/accounttype", Value == "User"] 

      => issue(Type = "http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid", Value = regexreplace(c1.Value, ".+@(?<domain>.+)", "http://${domain}/adfs/services/trust/"));' 

	$rule6 = '@RuleName = "Update issuer for DJ computer auth" 

      c1:[Type == "http://schemas.microsoft.com/ws/2012/01/accounttype", Value == "DJ"] 

      => issue(Type = "http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid", Value = "http://$validatedDomain/adfs/services/trust/");' 

	$existingRules = (Get-ADFSRelyingPartyTrust -Identifier urn:federation:MicrosoftOnline).IssuanceTransformRules 

	$updatedRules = $existingRules + $rule1 + $rule2 + $rule3 + $rule4 + $rule5 + $rule6 

	$crSet = New-ADFSClaimRuleSet -ClaimRule $updatedRules 
 
	Set-AdfsRelyingPartyTrust -TargetIdentifier urn:federation:MicrosoftOnline -IssuanceTransformRules $crSet.ClaimRulesString 

> [AZURE.NOTE] Windows 10 and Windows Server 2016 domain joined computers will authenticate using Windows Integrated authentication to an active WS-Trust endpoint hosted by AD FS. Ensure that this endpoint is enabled. If you are using the Web Authentication Proxy, also ensure that this endpoint is published through the proxy. The end-point is adfs/services/trust/13/windowstransport. It should show as enabled in the AD FS management console under Service > Endpoints. If you don’t have AD FS as your on-premises federation server, follow the instructions of your vendor to make sure the corresponding end-point is enabled. 

 

## Ensure AD FS is set up to support authentication of device for registration

You need to make sure that Windows Integrated authentication (WIA) is set as a valid alternative to multi-factor authentication (MFA) in AD FS for device registration.

For this you need to have an issuance transform rule that passes on the auth method.

1. Open the AD FS management console and navigate to **AD FS > Trust Relationships > Relying Party Trusts**. 

2. Right-click on the Microsoft Office 365 Identity Platform relying party trust object, and then select **Edit Claim Rules**.

2.	On the **Issuance Transform Rules** tab, select **Add Rule**.

3.	Select **Send Claims Using a Custom Rule** from the **Claim rule** template list. 

4.	Select **Next**.

4.	In the **Claim rule name** textbox, type **Auth Method Claim Rule**.

5.	In the **Claim rule** textbox, type `c:[Type == "http://schemas.microsoft.com/claims/authnmethodsreferences"]
=> issue(claim = c);`

6. On your federation server, open Windows PowerShell.

7. Type the following command:

	`Set-AdfsRelyingPartyTrust -TargetName <RPObjectName> -AllowedAuthenticationClassReferences wiaormultiauthn`

The **\<RPObjectName>\** is the relying party object name for your Azure Active Directory relying party trust object. This object is typically named Microsoft Office 365 Identity Platform.`




 

## Deployment and roll-out 

Once the prerequisites are complete domain joined computers are ready to register with Azure AD. 

Windows 10 Anniversary Update and Windows Server 2016 domain joined computers will automatically register to Azure AD in the next reboot or user sign-in to Windows. New computers that are joined to the domain will register with Azure AD in the reboot following the domain join operation. 

> [AZURE.NOTE] Windows 10 November 2015 Update domain joined computers will automatically register with Azure AD only if the roll-out Group Policy Object is set. For more information, please see the following section. 

To control roll-out of automatic registration of Windows 10/Windows Server 2016 domain joined computers there is a Group Policy object you can use for that purpose. Roll-out of automatic registration of non-Windows 10 domain joined computers there is a Windows Installer package that you can deploy to selected computers. 

> [AZURE.NOTE] The Group Policy for roll-out control also triggers registration of Windows 8.1 domain joined computers. You may choose to use the policy for registration of Windows 8.1 domain joined computers or if you have a mix of versions of Windows including 7 or 8.0, or Windows Server versions, you may choose to enable registration of all your non-Windows 10/Windows Server 2016 computers using the Windows Installer package. 

### Group Policy Object to control roll-out of automatic registration 

To control roll-out of automatic registration of domain joined computers with Azure AD you can deploy the Group Policy Register domain joined computers as devices to the computers you want to register e.g. you can deploy the policy based on a security group or to an organizational unit (OU). 

To set the policy, perform the following steps: 

1. Open Server Manager and navigate to **Tools > Group Policy Management**. 

2. From Group Policy Management, navigate to the domain node that corresponds to the domain in which you would like to enable auto-registration of Windows 10 or Windows Server 2016 computers. 

3. Right-click **Group Policy Objects**, and then select **New**. 

4. Enter your group policy object a name, for example, *Automatic Registration to Azure AD*. Click OK. 

4. Right-click your new group policy object, and then select **Edit**. 

5. Navigate to **Computer Configuration > Policies > Administrative Templates > Windows Components > Device Registration**, right-click **Register domain joined computers as devices**, and then select **Edit**. 

	> [AZURE.NOTE] This Group Policy template has been renamed from previous versions of the Group Policy Management console. If you are running a previous version of the console the policy will be under Computer Configuration > Policies > Administrative Templates > Windows Components > Workplace Join with the name Automatically workplace join client computers. 

6. Select the **Enabled** option button, and then click **Apply**. 

7. Click **OK**. 

7. Link the group policy object to a location of your choice. For example, a specific organizational unit (OU) were computers are located or a specific security group containing computers that will automatically register with Azure AD. To enable this policy for all of the domain joined Windows 10 and Windows Server 2016 computers at your organization, link the Group Policy object to the domain. 

## MSI package for non-Windows 10 computers  

To register domain joined computers running Windows 7, Windows 8.0, Windows 8.1, Windows Server 2008 R2, Windows Server 2012 or Windows Server 2012 R2 a Windows Installer package (.msi) is available for you to download under the following location. 

You should deploy this package using a software distribution system such as System Center Configuration Manager. The package supports the standard silent install options using the /quiet parameter. If you use System Center Configuration Manager 2016 you will enjoy additional benefits like the ability to track completed registrations. For more information, please see [System Center 2016](https://www.microsoft.com/cloud-platform/system-center-2016). 

The installer creates a Scheduled Task on the system that runs in the user’s context and is triggered on user sign-in to Windows. The task silently registers the device with Azure AD with the user credentials after authenticating using Windows Integrated authentication. The Scheduled Task can be found in the Task Scheduler Library under **Microsoft > Workplace Join**. 



## Additional topics

- [Azure Active Directory Conditional Access](active-directory-conditional-access.md)
