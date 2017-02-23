---
title: How to configure automatic registration of Windows domain joined devices with Azure Active Directory | Microsoft Docs
description: Set up your domain joined Windows devices to register automatically and silently with Azure Active Directory.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: 54e1b01b-03ee-4c46-bcf0-e01affc0419d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/23/2017
ms.author: markvi

---
# How to configure automatic registration of Windows domain joined devices with Azure Active Directory

To use [Azure Active Directory device-based conditional access](active-directory-conditional-access.md), your  computers must be registered with Azure Active Directory (Azure AD). This article provides you with the steps for configuring the automatic registration of Windows domain joined devices with Azure AD in your organization.

> [!NOTE]
> The Windows 10 November Update offers some of the enhanced user experiences in Azure AD, however is recommended that you use Windows 10 Anniversary Update or later. For more information about conditional access, see [Azure Active Directory device-based conditional access](active-directory-conditional-access.md). For more information about Windows 10 devices in the workplace and how a user registers a Windows 10 device with Azure AD, see [Windows 10 for the enterprise: Use devices for work](active-directory-azureadjoin-windows10-devices-overview.md).

For devices running Windows, you can register some earlier versions of Windows, including:

- Windows 8.1
- Windows 7

For devices running Windows Server, you can register the following platforms:

- Windows Server 2016
- Windows Server 2012 R2
- Windows Server 2012
- Windows Server 2008 R2

> [!NOTE]
> Registration on non-Windows 10 domain joined devices (e.g. Windows 7/8.1) is not supported if using romaing profiles. If relying on roaming of profiles or settings you may consider Windows 10.

## Prerequisites

The main requirement for automatic registration of domain joined devices by using Azure AD is to have an up-to-date version of Azure Active Directory Connect (Azure AD Connect). Azure AD Connect is required to keep the association between the computer account in on-premises Active Directory (AD) and the device object in Azure AD. It is also needed to enable other device related features like Windows Hello for Business.

Depending on how you deployed Azure AD Connect, and whether you used an express or custom installation or an in-place upgrade, the following prerequisites for device auto-registration might have been configured automatically:

- **Service Connection Point object in Active Directory for discovery** - Used by devices to discover Azure AD tenant information when registering to Azure AD.
 
- **Claims issued by on-premises federation server for auto-registration** - Used by devices when authenticating upon registration (applicable to federated configurations only, this is not needed in a password hash sync' configuration).

If some devices in your organizations are not Windows 10 (e.g. Windows 7 or 8.1), in addition, the following prerequisites are needed:

* Set policy in Azure AD to enable users to register devices.
* Configure on-premises federation service to issue claims to support Integrated Windows Authentication (IWA) for device registration
* Add the Azure AD device authentication end-point to the Local Intranet zones to avoid certificate prompts when authenticating the device.

> [!NOTE]
> Password hash sync' configurations (non-federated) only support auto-registration of Windows 10 devices. Non-Windows 10 devices (e.g. Windows 7/8.1) are not supported.

## Service Connection Point in AD for discovery of Azure AD tenant information

A service connection point (SCP) object must exist in the configuration naming context partition of the computer's forest. The service connection point holds discovery information about the Azure AD tenant where computers register.

> [!NOTE]
> The configuration naming context partition is one per Active Directory forest. The SCP will be used by computers in any domain in the forest.

> [!NOTE]
> In a multi-forest Active Directory configuration, the service connection point must exist in all forests with domain joined computers.

The SCP is located at:  

**CN=62a0ff2e-97b9-4513-943f-0d221bd30080,CN=Device Registration Configuration,CN=Services,[Your Configuration Naming Context]**

For a forest with the Active Directory domain name *example.com*, the configuration naming context is:

**CN=Configuration,DC=example,DC=com**

With the following Windows PowerShell script, you can verify the existence of the object and retrieve the discovery values: 

    $scp = New-Object System.DirectoryServices.DirectoryEntry;

    $scp.Path = "LDAP://CN=62a0ff2e-97b9-4513-943f-0d221bd30080,CN=Device Registration Configuration,CN=Services,CN=Configuration,DC=example,DC=com";

    $scp.Keywords;

The **$scp.Keywords** output shows the Azure AD tenant information, for example:

azureADName:microsoft.com  
azureADId:72f988bf-86f1-41af-91ab-2d7cd011db47

If the service connection point doesn’t exist, you can use Azure AD Connect PowerShell to create it by running the following script on your Azure AD Connect server:

    Import-Module -Name "C:\Program Files\Microsoft Azure Active Directory Connect\AdPrep\AdSyncPrep.psm1";

    $aadAdminCred = Get-Credential;

    Initialize-ADSyncDomainJoinedComputerSync –AdConnectorAccount [connector account name] -AzureADCredentials $aadAdminCred;

**Remarks:**

- When you run **$aadAdminCred = Get-Credential**, you are required to type a user name. For the user name, use the following format: **user@example.com** 

- When you run the **Initialize-ADSyncDomainJoinedComputerSync** cmdlet, replace [*connector account name*] with the domain account that's used in the Active Directory connector account.
  
- The cmdlet uses the Active Directory PowerShell module, which relies on Active Directory Web Services running on a domain controller. Active Directory Web Services is supported on domain controllers Windows Server 2008 R2 and later. For domain controllers in Windows Server 2008 or earlier versions, use the script below to create the service connection point.
  
- The cmdlet creates the service connection point in the Active Directory forest that connects with Azure AD. In a multi-forest configuration you should use the script below to create the service connection point in each forest where computers exist.
 
    $verifiedDomain = "contoso.com"    # Replace this with any of your verified domain names in Azure AD
    $tenantID = "72f988bf-86f1-41af-91ab-2d7cd011db47"    # Replace this with you tenant ID
    $configNC = "CN=Configuration,DC=corp,DC=contoso,DC=com"    # Replace this with your AD configuration naming context

    $de = New-Object System.DirectoryServices.DirectoryEntry
    $de.Path = "LDAP://CN=Services," + $configNC

    $deDRC = $de.Children.Add("CN=Device Registration Configuration", "container")
    $deDRC.CommitChanges()

    $deSCP = $deDRC.Children.Add("CN=62a0ff2e-97b9-4513-943f-0d221bd30080", "serviceConnectionPoint")
    $deSCP.Properties["keywords"].Add("azureADName:" + $verifiedDomain)
    $deSCP.Properties["keywords"].Add("azureADId:" + $tenantID)

    $deSCP.CommitChanges()

## Claims issued by federation server for authentication upon registration

In a federated Azure AD configuration, devices rely on Active Directory Federation Services (AD FS) or on a 3rd party on-premises federation service to authenticate to Azure AD. Devices authenticate to get an access token to register against the Azure Active Directory Device Registration Service (Azure DRS).

Windows 10 and Windows Server 2016 domain joined computers authenticate using Integrated Windows Authentication to an active WS-Trust endpoint (either 1.3 or 2005 versions) hosted by the on-premises federation service.

> [!NOTE]
> If using AD FS one of **adfs/services/trust/13/windowstransport** or 
> **adfs/services/trust/2005/windowstransport** must be enabled. If you are using the Web Authentication Proxy, also ensure that this endpoint is published through the proxy. You can see what end-points are enabled through the AD FS management console under **Service > Endpoints**.

> [!NOTE]
>If you don’t have AD FS as your on-premises federation service, follow the instructions of your vendor to make sure they support WS-Trust 1.3 or 2005 end-points and that these are published through the Metadata Exchange file (MEX).

The following claims must exist in the token received by Azure DRS for device registration to complete. Azure DRS will create a device object in Azure AD with some of this information which is then used by Azure AD Connect to associate the newly created device object with the computer account on-premises.

* http://schemas.microsoft.com/ws/2012/01/accounttype
* http://schemas.microsoft.com/identity/claims/onpremobjectguid
* http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid

If you have more than one verified domain name you will need to provide the following claim for computers:

* http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid

If you are already issuing an ImmutableID claim (e.g. have implemented alternate login ID) you will need to provide one corresponding claim for computers:

* http://schemas.microsoft.com/LiveID/Federation/2008/05/ImmutableID

Below you will learn what each claim should have as values and how a definition would look like in AD FS. This definition will help you checking whether these are present or creating them in case they are not.

> [!NOTE]
> If you don’t use AD FS for your on-premises federation server, follow your vendor's instructions to create the appropriate configuration to issue these claims.

### Issue account type claim

**http://schemas.microsoft.com/ws/2012/01/accounttype** which must contain a value of **DJ**, which identifies the device as a domain joined computer. In AD FS you can add an issuance transform rule that looks like this:

    @RuleName = "Issue account type for domain joined computers"
    c:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
        Value =~ "-515$", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ]
    => issue(
        Type = "http://schemas.microsoft.com/ws/2012/01/accounttype", 
        Value = "DJ"
    );

### Issue objectGUID of the computer account on-premises

**http://schemas.microsoft.com/identity/claims/onpremobjectguid** which must contains the value of the **objectGUID** attribute of the on-premises computer account. In AD FS you can add an issuance transform rule that looks like this:

    @RuleName = "Issue object GUID for domain joined computers"
    c1:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
        Value =~ "-515$", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ]
    && 
    c2:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ]
    => issue(
        store = "Active Directory", 
        types = ("http://schemas.microsoft.com/identity/claims/onpremobjectguid"), 
        query = ";objectguid;{0}", 
        param = c2.Value
    );
 
### Issue objectSID of the computer account on-premises

**http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid** which must contain the value of the **objectSid** attribute of the on-premises computer account. In AD FS you can add an issuance transform rule that looks like this:

    @RuleName = "Issue objectSID for domain joined computers"
    c1:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
        Value =~ "-515$", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ]
    && 
    c2:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ]
    => issue(claim = c2);

### Issue issuerID for computer when multiple verified domain names in Azure AD

**http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid** which must contain the Uniform Resource Identifier (URI) of any of the verified domain names that connect with the on-premises federation service (AD FS or 3rd party) issuing the token. In AD FS you can add issuance transform rules that looks like the ones below in that specific order after the ones above. Please note that one rule to explicitly issue the rule for users is necessary. In the rules below a first rule identifying user vs. computer authentication is added.

    @RuleName = "Issue account type with the value User when its not a computer"
    NOT EXISTS(
    [
        Type == "http://schemas.microsoft.com/ws/2012/01/accounttype", 
        Value == "DJ"
    ]
    )
    => add(
        Type = "http://schemas.microsoft.com/ws/2012/01/accounttype", 
        Value = "User"
    );
    
    @RuleName = "Capture UPN when AccountType is User and issue the IssuerID"
    c1:[
        Type == "http://schemas.xmlsoap.org/claims/UPN"
    ]
    && 
    c2:[
        Type == "http://schemas.microsoft.com/ws/2012/01/accounttype", 
        Value == "User"
    ]
    => issue(
        Type = "http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid", 
        Value = regexreplace(
        c1.Value, 
        ".+@(?<domain>.+)", 
        "http://${domain}/adfs/services/trust/"
        )
    );
    
    @RuleName = "Issue issuerID for domain joined computers"
    c:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
        Value =~ "-515$", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ]
    => issue(
        Type = "http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid", 
        Value = "http://<verified-domain-name>/adfs/services/trust/"
    );

> [!NOTE]
> The issuerID claim for computer in the rule above must contain one of the verified domain names in Azure AD. This is not the AD FS service URL.

For more details about verified domain names, see [Add a custom domain name to Azure Active Directory](active-directory-add-domain.md).  
To get a list of your verified company domains, you can use the [Get-MsolDomain](https://docs.microsoft.com/powershell/msonline/v1/get-msoldomain) cmdlet. 

![Get-MsolDomain](./media/active-directory-conditional-access-automatic-device-registration-setup/01.png)

### Issue ImmutableID for computer when one for users exist (e.g. alternate login ID is set)

**http://schemas.microsoft.com/LiveID/Federation/2008/05/ImmutableID** which must contain a valid value for computers. In AD FS you can create an issuance tranform rule as follows:

    @RuleName = "Issue ImmutableID for computers"
    c1:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
        Value =~ "-515$", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ] 
    && 
    c2:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ]
    => issue(
        store = "Active Directory", 
        types = ("http://schemas.microsoft.com/LiveID/Federation/2008/05/ImmutableID"), 
        query = ";objectguid;{0}", 
        param = c2.Value
    );

### Helper script to create the AD FS issuance transform rules

Use the following script to help you with the creation of the issuance transform rules described above.

> [!NOTE]
> Please notice that this script will append the rules to the existing created rules. Do not run the script twice otherwise the set of rules will be added twice. Make sure no correponding rules exist for these claims (under the corresponding conditions) exist before runnig the script again.

> [!NOTE]
> If you have multiple verified domain names (as shown in the Azure AD portal or via the Get-MsolDomains cmdlet) set the value of $multipleVerifiedDomainNames in the script to $true. Also make sure that you **remove any existing issuerid claim** that might have been created by Azure AD Connect or via other means. Here is an example for this rule:
>>c:[Type == "http://schemas.xmlsoap.org/claims/UPN"]
=> issue(Type = "http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid", Value = regexreplace(c.Value, ".+@(?<domain>.+)",  "http://${domain}/adfs/services/trust/")); 

> [!NOTE]
> If you are issuing an ImmutableID claim already for user accounts set the value of $oneOfVerifiedDomainNames in the script to $true.

	$multipleVerifiedDomainNames = $false
    $immutableIDAlreadyIssuedforUsers = $false
    $oneOfVerifiedDomainNames = 'example.com'   # Replace example.com with one of your verified domains
    
    $rule1 = '@RuleName = "Issue account type for domain joined computers"
    c:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
        Value =~ "-515$", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ]
    => issue(
        Type = "http://schemas.microsoft.com/ws/2012/01/accounttype", 
        Value = "DJ"
    );'

    $rule2 = '@RuleName = "Issue object GUID for domain joined computers"
    c1:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
        Value =~ "-515$", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ]
    && 
    c2:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ]
    => issue(
        store = "Active Directory", 
        types = ("http://schemas.microsoft.com/identity/claims/onpremobjectguid"), 
        query = ";objectguid;{0}", 
        param = c2.Value
    );'

    $rule3 = '@RuleName = "Issue objectSID for domain joined computers"
    c1:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
        Value =~ "-515$", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ]
    && 
    c2:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ]
    => issue(claim = c2);'

    $rule4 = ''
    if ($multipleVerifiedDomainNames -eq $true) {
    $rule4 = '@RuleName = "Issue account type with the value User when its not a computer"
    NOT EXISTS(
    [
        Type == "http://schemas.microsoft.com/ws/2012/01/accounttype", 
        Value == "DJ"
    ]
    )
    => add(
        Type = "http://schemas.microsoft.com/ws/2012/01/accounttype", 
        Value = "User"
    );
    
    @RuleName = "Capture UPN when AccountType is User and issue the IssuerID"
    c1:[
        Type == "http://schemas.xmlsoap.org/claims/UPN"
    ]
    && 
    c2:[
        Type == "http://schemas.microsoft.com/ws/2012/01/accounttype", 
        Value == "User"
    ]
    => issue(
        Type = "http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid", 
        Value = regexreplace(
        c1.Value, 
        ".+@(?<domain>.+)", 
        "http://${domain}/adfs/services/trust/"
        )
    );
    
    @RuleName = "Issue issuerID for domain joined computers"
    c:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
        Value =~ "-515$", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ]
    => issue(
        Type = "http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid", 
        Value = "http://<verified-domain-name>/adfs/services/trust/"
    );'
    }

    $rule5 = ''
    if ($immutableIDAlreadyIssuedforUsers -eq $true) {
    $rule5 = '@RuleName = "Issue ImmutableID for computers"
    c1:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
        Value =~ "-515$", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ] 
    && 
    c2:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ]
    => issue(
        store = "Active Directory", 
        types = ("http://schemas.microsoft.com/LiveID/Federation/2008/05/ImmutableID"), 
        query = ";objectguid;{0}", 
        param = c2.Value
    );'
    }

	$existingRules = (Get-ADFSRelyingPartyTrust -Identifier urn:federation:MicrosoftOnline).IssuanceTransformRules 

	$updatedRules = $existingRules + $rule1 + $rule2 + $rule3 + $rule4 + $rule5

	$crSet = New-ADFSClaimRuleSet -ClaimRule $updatedRules 

	Set-AdfsRelyingPartyTrust -TargetIdentifier urn:federation:MicrosoftOnline -IssuanceTransformRules $crSet.ClaimRulesString 

## Configuration to enable non-Windows 10 domain joined devices auto-registration (e.g. Windows 7/8.1)

If some devices in your organizations are not Windows 10 (e.g. Windows 7 or 8.1), in addition, the following prerequisites are needed:

* Set policy in Azure AD to enable users to register devices.
* Configure on-premises federation service to issue claims to support Integrated Windows Authentication (IWA) for device registration
* Add the Azure AD device authentication end-point to the Local Intranet zones to avoid certificate prompts when authenticating the device.

### Set policy in Azure AD to enable users to register devices

This section covers how to configure on-premises federation service to issue claims to support Integrated Windows Authentication for device registration.

Your on-premises federation service must support issuing authenticationmehod and wiaormultiauthn claims for the following two claims when receiving an authentication request to the Azure AD relying party holding a resouce_params parameter with an encoded value as shown below:

    eyJQcm9wZXJ0aWVzIjpbeyJLZXkiOiJhY3IiLCJWYWx1ZSI6IndpYW9ybXVsdGlhdXRobiJ9XX0

    which decoded is {"Properties":[{"Key":"acr","Value":"wiaormultiauthn"}]}

When such a request comes, the on-premises federation service must authenticate the user using Integrated Windows Authentication and upon success, it must issue the following two claims:

    http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows
    http://schemas.microsoft.com/claims/wiaormultiauthn

In AD FS you must add an issuance transform rule that passes through the authentication method. You can use the UI to do this:

1. In the AD FS management console, go to **AD FS** > **Trust Relationships** > **Relying Party Trusts**.
2. Right-click the Microsoft Office 365 Identity Platform relying party trust object, and then select **Edit Claim Rules**.
3. On the **Issuance Transform Rules** tab, select **Add Rule**.
4. In the **Claim rule** template list, select **Send Claims Using a Custom Rule**.
5. Select **Next**.
6. In the **Claim rule name** box, type **Auth Method Claim Rule**.
7. In the **Claim rule** box, type the following rule:

    **c:[Type == "http://schemas.microsoft.com/claims/authnmethodsreferences"] => issue(claim = c);**

8. On your federation server, type the PowerShell command after replacing **\<RPObjectName\>** with the relying party object name for your Azure AD relying party trust object. This object usually is named **Microsoft Office 365 Identity Platform**.
   
    `Set-AdfsRelyingPartyTrust -TargetName <RPObjectName> -AllowedAuthenticationClassReferences wiaormultiauthn`

### Add the Azure AD device authentication end-point to the Local Intranet zones

To avoid certificate prompts when users in register devices authenticate to Azure AD you can push a policy to your domain joined devices to add the following URL to the Local Intranet zone in Internet Explorer:

    https://device.login.microsoftonline.com

## Deployment and rollout

When the prerequisites described above are met, domain joined devices are ready to automatically register with Azure AD.

Domain joined devices running Windows 10 Anniversary Update and Windows Server 2016 automatically register with Azure AD at device restart or user sign-in. New devices register with Azure AD when the device restarts after the domain join operation completes.

> [!NOTE]
> Windows 10 November 2015 Update automatically registers with Azure AD only if the rollout Group Policy object is set.

You can use a Group Policy object to control the rollout of automatic registration of Windows 10 and Windows Server 2016 domain joined computers. 

To rollout automatic registration of non-Windows 10 domain joined computers (e.g. Windows 7/8.1), you can deploy a Windows Installer package to computers that you select.

> [!NOTE]
> If you push the Group Policy object to Windows 8.1 domain joined devices, registration will be attempted, however it is recommended that you use the Windows Installer package to register all your non-Windows 10 devices including Windows 8.1. 

### Create a Group Policy object to control registration of Windows 10 domain joined devices

To control the rollout of automatic registration of domain joined computers with Azure AD of Windows 10, you should deploy the **Register domain joined computers as devices** Group Policy object to your Windows 10 devices you want to register. For example, you can deploy the policy to an organizational unit or to a security group.

**To set the policy:**

1. Open Server Manager, and then go to **Tools** > **Group Policy Management**.
2. Go to the domain node that corresponds to the domain where you want to activate auto-registration of Windows 10 or Windows Server 2016 computers.
3. Right-click **Group Policy Objects**, and then select **New**.
4. Type a name for your Group Policy object. For example, *Automatic Registration to Azure AD*. Select **OK**.
5. Right-click your new Group Policy object, and then select **Edit**.
6. Go to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Device Registration**. Right-click **Register domain joined computers as devices**, and then select **Edit**.
   
   > [!NOTE]
   > This Group Policy template has been renamed from earlier versions of the Group Policy Management console. If you are using an earlier version of the console, go to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Workplace Join** > **Automatically workplace join client computers**. 

7. Select **Enabled**, and then select **Apply**.
8. Select **OK**.
9. Link the Group Policy object to a location of your choice. For example, you can link it to a specific organizational unit. You also could link it to a specific security group of computers that automatically register with Azure AD. To set this policy for all domain joined Windows 10 and Windows Server 2016 computers in your organization, link the Group Policy object to the domain.

### Windows Installer packages for non-Windows 10 computers (e.g. Windows 7/8.1)

To register domain joined computers running Windows 8.1, Windows 7, Windows Server 2012 R2, Windows Server 2012, or Windows Server 2008 R2 in a federated environment, you can download and install these Windows Installer package (.msi) from Download Center at the [Microsoft Workplace Join for non-Windows 10 computers](https://www.microsoft.com/en-us/download/details.aspx?id=53554) page.

You can deploy the package by using a software distribution system like System Center Configuration Manager. The package supports the standard silent install options with the *quiet* parameter. System Center Configuration Manager 2016 offers additional benefits from earlier versions, like the ability to track completed registrations. For more information, see [System Center 2016](https://www.microsoft.com/en-us/cloud-platform/system-center).

The installer creates a scheduled task on the system that runs in the user’s context. The task is triggered when the user signs in to Windows. The task silently registers the device with Azure AD with the user credentials after authenticating using Integrated Windows Authentication. To see the scheduled task, in the device, go to **Microsoft** > **Workplace Join**, and then go to the Task Scheduler library.

## Next steps

* [Azure Active Directory conditional access](active-directory-conditional-access.md)