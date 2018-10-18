---
title: Configure hybrid Azure Active Directory joined devices manually | Microsoft Docs
description: Learn how to  manually configure hybrid Azure Active Directory joined devices.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman
editor: ''

ms.assetid: 54e1b01b-03ee-4c46-bcf0-e01affc0419d
ms.service: active-directory
ms.component: devices
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 08/25/2018
ms.author: markvi
ms.reviewer: sandeo

#Customer intent: As a IT admin, I want to setup hybrid Azure AD joined devices so that I can automatically bring AD domain-joined devices under control
---
# Tutorial: Configure hybrid Azure Active Directory joined devices manually 

With device management in Azure Active Directory (Azure AD), you can ensure that your users are accessing your resources from devices that meet your standards for security and compliance. For more details, see the [Introduction to device management in Azure Active Directory](overview.md).


> [!TIP]
> If using Azure AD Connect is an option for you, see [Select your scenario](hybrid-azuread-join-plan.md#select-your-scenario). By using Azure AD Connect, you can simplify the configuration of hybrid Azure AD join significantly.



If you have an on-premises Active Directory environment and you want to join your domain-joined devices to Azure AD, you can accomplish this by configuring hybrid Azure AD joined devices. In this tutorial, you learn how to manually configure hybrid Azure AD join for your devices.

> [!div class="checklist"]
> * Prerequisites
> * Configuration steps
> * Configure service connection point
> * Setup issuance of claims
> * Enable Windows down-level devices
> * Verify joined devices
> * Troubleshoot your implementation
 




## Prerequisites

This tutorial assumes that you are familiar with:
    
-  [Introduction to device management in Azure Active Directory](../device-management-introduction.md)
    
-  [How to plan your hybrid Azure Active Directory join implementation](hybrid-azuread-join-plan.md)

-  [How to control the hybrid Azure AD join of your devices](hybrid-azuread-join-control.md)


Before you start enabling hybrid Azure AD joined devices in your organization, you need to make sure that:

- You are running an up-to-date version of Azure AD connect.

- Azure AD connect has synchronized the computer objects of the devices you want to be hybrid Azure AD joined to Azure AD. If the computer objects belong to specific organizational units (OU), then these OUs need to be configured for synchronization in Azure AD connect as well.

  

Azure AD Connect:

- Keeps the association between the computer account in your on-premises Active Directory (AD) and the device object in Azure AD. 
- Enables other device related features like Windows Hello for Business.

Make sure that the following URLs are accessible from computers inside your organization network for registration of computers to Azure AD:

- https://enterpriseregistration.windows.net

- https://login.microsoftonline.com
Allow
- https://device.login.microsoftonline.com

- Your organization's STS (federated domains)

If not already done, your organization's STS (for federated domains) should be included in the user's local intranet settings.

If your organization is planning to use Seamless SSO, then the following URLs need to be reachable from the computers inside your organization and they must also be added to the user's local intranet zone:

- https://autologon.microsoftazuread-sso.com

- Also, the following setting should be enabled in the user's intranet zone: "Allow status bar updates via script."

If your organization uses managed (non-federated) setup with on-premises AD and does not use ADFS to federate with Azure AD, then hybrid Azure AD join on Windows 10 relies on the computer objects in AD to be sync'ed to Azure AD. Make sure that any Organizational Units (OU) that contain the computer objects that need to be hybrid Azure AD joined are enabled for sync in the Azure AD Connect sync configuration.

For Windows 10 devices on version 1703 or earlier, if your organization requires access to the Internet via an outbound proxy, you must implement Web Proxy Auto-Discovery (WPAD) to enable Windows 10 computers to register to Azure AD. 

Beginning with Windows 10 1803, even if hybrid Azure AD join attempt by a device in a federated domain using AD FS fails, and if Azure AD Connect is configured to sync the computer/device objects to Azure AD, then the device will attempt to complete the hybrid Azure AD join using the synced computer/device.

## Configuration steps

You can configure hybrid Azure AD joined devices for various types of Windows device platforms. This topic includes the required steps for all typical configuration scenarios.  

Use the following table to get an overview of the steps that are required for your scenario:  



| Steps                                      | Windows current and password hash sync | Windows current and federation | Windows down-level |
| :--                                        | :-:                                    | :-:                            | :-:                |
| Configure service connection point | ![Check][1]                            | ![Check][1]                    | ![Check][1]        |
| Setup issuance of claims           |                                        | ![Check][1]                    | ![Check][1]        |
| Enable non-Windows 10 devices      |                                        |                                | ![Check][1]        |
| Verify joined devices          | ![Check][1]                            | ![Check][1]                    | ![Check][1]        |



## Configure service connection point

The service connection point (SCP) object is used by your devices during the registration to discover Azure AD tenant information. In your on-premises Active Directory (AD), the SCP object for the hybrid Azure AD joined devices must exist in the configuration naming context partition of the computer's forest. There is only one configuration naming context per forest. In a multi-forest Active Directory configuration, the service connection point must exist in all forests containing domain-joined computers.

You can use the [**Get-ADRootDSE**](https://technet.microsoft.com/library/ee617246.aspx) cmdlet to retrieve the configuration naming context of your forest.  

For a forest with the Active Directory domain name *fabrikam.com*, the configuration naming context is:

`CN=Configuration,DC=fabrikam,DC=com`

In your forest, the SCP object for the auto-registration of domain-joined devices is located at:  

`CN=62a0ff2e-97b9-4513-943f-0d221bd30080,CN=Device Registration Configuration,CN=Services,[Your Configuration Naming Context]`

Depending on how you have deployed Azure AD Connect, the SCP object may have already been configured.
You can verify the existence of the object and retrieve the discovery values using the following Windows PowerShell script: 

    $scp = New-Object System.DirectoryServices.DirectoryEntry;

    $scp.Path = "LDAP://CN=62a0ff2e-97b9-4513-943f-0d221bd30080,CN=Device Registration Configuration,CN=Services,CN=Configuration,DC=fabrikam,DC=com";

    $scp.Keywords;

The **$scp.Keywords** output shows the Azure AD tenant information, for example:

    azureADName:microsoft.com
    azureADId:72f988bf-86f1-41af-91ab-2d7cd011db47

If the service connection point does not exist, you can create it by running the `Initialize-ADSyncDomainJoinedComputerSync` cmdlet on your Azure AD Connect server. Enterprise admin credential is required to run this cmdlet.  
The cmdlet:

- Creates the service connection point in the Active Directory forest Azure AD Connect is connected to. 
- Requires you to specify the `AdConnectorAccount` parameter. This is the account that is configured as Active Directory connector account in Azure AD connect. 


The following script shows an example for using the cmdlet. In this script, `$aadAdminCred = Get-Credential` requires you to type a user name. You need to provide the user name in the user principal name (UPN) format (`user@example.com`). 


    Import-Module -Name "C:\Program Files\Microsoft Azure Active Directory Connect\AdPrep\AdSyncPrep.psm1";

    $aadAdminCred = Get-Credential;

    Initialize-ADSyncDomainJoinedComputerSync –AdConnectorAccount [connector account name] -AzureADCredentials $aadAdminCred;

The `Initialize-ADSyncDomainJoinedComputerSync` cmdlet:

- Uses the Active Directory PowerShell module and AD DS Tools, which rely on Active Directory Web Services running on a domain controller. Active Directory Web Services is supported on domain controllers running Windows Server 2008 R2 and later.
- Is only supported by the **MSOnline PowerShell module version 1.1.166.0**. To download this module, use this [link](https://msconfiggallery.cloudapp.net/packages/MSOnline/1.1.166.0/).   
- If the AD DS tools are not installed, the `Initialize-ADSyncDomainJoinedComputerSync` will fail.  The AD DS tools can be installed through Server Manager under Features - Remote Server Administration Tools - Role Administration Tools.

For domain controllers running Windows Server 2008 or earlier versions, use the script below to create the service connection point.

In a multi-forest configuration, you should use the following script to create the service connection point in each forest where computers exist:
 
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

In the script above,

- `$verifiedDomain = "contoso.com"` is a placeholder you need to replace with one of your verified domain names in Azure AD. You will have to own the domain before you can use it.

For more details about verified domain names, see [Add a custom domain name to Azure Active Directory](../active-directory-domains-add-azure-portal.md).  
To get a list of your verified company domains, you can use the [Get-AzureADDomain](/powershell/module/Azuread/Get-AzureADDomain?view=azureadps-2.0) cmdlet. 

![Get-AzureADDomain](./media/hybrid-azuread-join-manual-steps/01.png)

## Setup issuance of claims

In a federated Azure AD configuration, devices rely on Active Directory Federation Services (AD FS) or a 3rd party on-premises federation service to authenticate to Azure AD. Devices authenticate to get an access token to register against the Azure Active Directory Device Registration Service (Azure DRS).

Windows current devices authenticate using Integrated Windows Authentication to an active WS-Trust endpoint (either 1.3 or 2005 versions) hosted by the on-premises federation service.

> [!NOTE]
> When using AD FS, either **adfs/services/trust/13/windowstransport** or **adfs/services/trust/2005/windowstransport** must be enabled. If you are using the Web Authentication Proxy, also ensure that this endpoint is published through the proxy. You can see what end-points are enabled through the AD FS management console under **Service > Endpoints**.
>
>If you don’t have AD FS as your on-premises federation service, follow the instructions of your vendor to make sure they support WS-Trust 1.3 or 2005 end-points and that these are published through the Metadata Exchange file (MEX).

The following claims must exist in the token received by Azure DRS for device registration to complete. Azure DRS will create a device object in Azure AD with some of this information which is then used by Azure AD Connect to associate the newly created device object with the computer account on-premises.

* `http://schemas.microsoft.com/ws/2012/01/accounttype`
* `http://schemas.microsoft.com/identity/claims/onpremobjectguid`
* `http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid`

If you have more than one verified domain name, you need to provide the following claim for computers:

* `http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid`

If you are already issuing an ImmutableID claim (e.g., alternate login ID) you need to provide one corresponding claim for computers:

* `http://schemas.microsoft.com/LiveID/Federation/2008/05/ImmutableID`

In the following sections, you find information about:
 
- The values each claim should have
- How a definition would look like in AD FS

The definition helps you to verify whether the values are present or if you need to create them.

> [!NOTE]
> If you don’t use AD FS for your on-premises federation server, follow your vendor's instructions to create the appropriate configuration to issue these claims.

### Issue account type claim

**`http://schemas.microsoft.com/ws/2012/01/accounttype`** - This claim must contain a value of **DJ**, which identifies the device as a domain-joined computer. In AD FS, you can add an issuance transform rule that looks like this:

    @RuleName = "Issue account type for domain-joined computers"
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

**`http://schemas.microsoft.com/identity/claims/onpremobjectguid`** - This claim must contain the **objectGUID** value of the on-premises computer account. In AD FS, you can add an issuance transform rule that looks like this:

    @RuleName = "Issue object GUID for domain-joined computers"
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

**`http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid`** - This claim must contain the **objectSid** value of the on-premises computer account. In AD FS, you can add an issuance transform rule that looks like this:

    @RuleName = "Issue objectSID for domain-joined computers"
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

**`http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid`** - This claim must contain the Uniform Resource Identifier (URI) of any of the verified domain names that connect with the on-premises federation service (AD FS or 3rd party) issuing the token. In AD FS, you can add issuance transform rules that look like the ones below in that specific order after the ones above. Please note that one rule to explicitly issue the rule for users is necessary. In the rules below, a first rule identifying user vs. computer authentication is added.

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
    
    @RuleName = "Issue issuerID for domain-joined computers"
    c:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
        Value =~ "-515$", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ]
    => issue(
        Type = "http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid", 
        Value = "http://<verified-domain-name>/adfs/services/trust/"
    );


In the claim above,

- `<verified-domain-name>` is a placeholder you need to replace with one of your verified domain names in Azure AD. For example, Value = "http://contoso.com/adfs/services/trust/"



For more details about verified domain names, see [Add a custom domain name to Azure Active Directory](../active-directory-domains-add-azure-portal.md).  

To get a list of your verified company domains, you can use the [Get-MsolDomain](/powershell/module/msonline/get-msoldomain?view=azureadps-1.0) cmdlet. 

![Get-MsolDomain](./media/hybrid-azuread-join-manual-steps/01.png)

### Issue ImmutableID for computer when one for users exist (e.g. alternate login ID is set)

**`http://schemas.microsoft.com/LiveID/Federation/2008/05/ImmutableID`** - This claim must contain a valid value for computers. In AD FS, you can create an issuance transform rule as follows:

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

The following script helps you with the creation of the issuance transform rules described above.

	$multipleVerifiedDomainNames = $false
    $immutableIDAlreadyIssuedforUsers = $false
    $oneOfVerifiedDomainNames = 'example.com'   # Replace example.com with one of your verified domains
    
    $rule1 = '@RuleName = "Issue account type for domain-joined computers"
    c:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
        Value =~ "-515$", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ]
    => issue(
        Type = "http://schemas.microsoft.com/ws/2012/01/accounttype", 
        Value = "DJ"
    );'

    $rule2 = '@RuleName = "Issue object GUID for domain-joined computers"
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

    $rule3 = '@RuleName = "Issue objectSID for domain-joined computers"
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
    $rule4 = '@RuleName = "Issue account type with the value User when it is not a computer"
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
    
    @RuleName = "Issue issuerID for domain-joined computers"
    c:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
        Value =~ "-515$", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ]
    => issue(
        Type = "http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid", 
        Value = "http://' + $oneOfVerifiedDomainNames + '/adfs/services/trust/"
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

### Remarks 

- This script appends the rules to the existing rules. Do not run the script twice because the set of rules would be added twice. Make sure that no corresponding rules exist for these claims (under the corresponding conditions) before running the script again.

- If you have multiple verified domain names (as shown in the Azure AD portal or via the Get-MsolDomains cmdlet), set the value of **$multipleVerifiedDomainNames** in the script to **$true**. Also make sure that you remove any existing issuerid claim that might have been created by Azure AD Connect or via other means. Here is an example for this rule:


        c:[Type == "http://schemas.xmlsoap.org/claims/UPN"]
        => issue(Type = "http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid", Value = regexreplace(c.Value, ".+@(?<domain>.+)",  "http://${domain}/adfs/services/trust/")); 

- If you have already issued an **ImmutableID** claim  for user accounts, set the value of **$immutableIDAlreadyIssuedforUsers** in the script to **$true**.

## Enable Windows down-level devices

If some of your domain-joined devices are Windows down-level devices, you need to:

- Set a policy in Azure AD to enable users to register devices.
 
- Configure your on-premises federation service to issue claims to support **Integrated Windows Authentication (IWA)** for device registration.
 
- Add the Azure AD device authentication end-point to the local Intranet zones to avoid certificate prompts when authenticating the device.

### Set policy in Azure AD to enable users to register devices

To register Windows down-level devices, you need to make sure that the setting to allow users to register devices in Azure AD is set. In the Azure portal, you can find this setting under:

`Azure Active Directory > Users and groups > Device settings`
    
The following policy must be set to **All**: **Users may register their devices with Azure AD**

![Register devices](./media/hybrid-azuread-join-manual-steps/23.png)


### Configure on-premises federation service 

Your on-premises federation service must support issuing the **authenticationmethod** and **wiaormultiauthn** claims when receiving an authentication request to the Azure AD relying party holding a resouce_params parameter with an encoded value as shown below:

    eyJQcm9wZXJ0aWVzIjpbeyJLZXkiOiJhY3IiLCJWYWx1ZSI6IndpYW9ybXVsdGlhdXRobiJ9XX0

    which decoded is {"Properties":[{"Key":"acr","Value":"wiaormultiauthn"}]}

When such a request comes, the on-premises federation service must authenticate the user using Integrated Windows Authentication and upon success, it must issue the following two claims:

    http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows
    http://schemas.microsoft.com/claims/wiaormultiauthn

In AD FS, you must add an issuance transform rule that passes-through the authentication method.  

**To add this rule:**

1. In the AD FS management console, go to `AD FS > Trust Relationships > Relying Party Trusts`.
2. Right-click the Microsoft Office 365 Identity Platform relying party trust object, and then select **Edit Claim Rules**.
3. On the **Issuance Transform Rules** tab, select **Add Rule**.
4. In the **Claim rule** template list, select **Send Claims Using a Custom Rule**.
5. Select **Next**.
6. In the **Claim rule name** box, type **Auth Method Claim Rule**.
7. In the **Claim rule** box, type the following rule:

    `c:[Type == "http://schemas.microsoft.com/claims/authnmethodsreferences"] => issue(claim = c);`

8. On your federation server, type the PowerShell command below after replacing **\<RPObjectName\>** with the relying party object name for your Azure AD relying party trust object. This object usually is named **Microsoft Office 365 Identity Platform**.
   
    `Set-AdfsRelyingPartyTrust -TargetName <RPObjectName> -AllowedAuthenticationClassReferences wiaormultiauthn`

### Add the Azure AD device authentication end-point to the Local Intranet zones

To avoid certificate prompts when users in register devices authenticate to Azure AD you can push a policy to your domain-joined devices to add the following URL to the Local Intranet zone in Internet Explorer:

`https://device.login.microsoftonline.com`


## Verify joined devices

You can check successful joined devices in your organization by using the [Get-MsolDevice](https://docs.microsoft.com/powershell/msonline/v1/get-msoldevice) cmdlet in the [Azure Active Directory PowerShell module](/powershell/azure/install-msonlinev1?view=azureadps-2.0).

The output of this cmdlet shows devices that are registered and joined with Azure AD. To get all devices, use the **-All** parameter, and then filter them using the **deviceTrustType** property. Domain joined devices have a value of **Domain Joined**.



## Troubleshoot your implementation

If you are experiencing issues with completing hybrid Azure AD join for domain joined Windows devices, see:

- [Troubleshooting Hybrid Azure AD join for Windows current devices](troubleshoot-hybrid-join-windows-current.md)
- [Troubleshooting Hybrid Azure AD join for Windows down-level devices](troubleshoot-hybrid-join-windows-legacy.md)

## Next steps

* [Introduction to device management in Azure Active Directory](overview.md)



<!--Image references-->
[1]: ./media/hybrid-azuread-join-manual-steps/12.png
