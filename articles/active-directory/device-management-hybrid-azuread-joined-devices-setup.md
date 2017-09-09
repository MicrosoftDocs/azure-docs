---
title: Set up hybrid Azure Active Directory-joined devices | Microsoft Docs
description: Learn how to set up hybrid Azure Active Directory-joined devices.
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
ms.date: 09/07/2017
ms.author: markvi
ms.reviewer: jairoc

---
# Set up hybrid Azure Active Directory-joined devices

Device management in Azure Active Directory (Azure AD) can help you ensure that users access your resources from devices that meet your security and compliance standards. For more information, see [Introduction to device management in Azure Active Directory](device-management-introduction.md).

If you have an on-premises Windows Server Active Directory (Windows Server AD) environment, and you want to join your domain-joined devices to Azure AD, you can set up hybrid Azure AD-joined devices. In this article, we describe the steps you can take to do this. 


## Before you begin

Before you begin configuring hybrid Azure AD-joined devices in your environment, you should familiarize yourself with supported scenarios and constraints.  

To improve the readability of the descriptions in this article, we use the following terms: 

- **Windows current devices**.  This term refers to domain-joined devices that are running Windows 10 or Windows Server 2016.
- **Windows down-level devices**. This term refers to all *supported* domain-joined Windows devices that are running neither Windows 10 nor Windows Server 2016.  


### Windows current devices

- For devices running the Windows desktop operating system, we recommend using Windows 10 Anniversary Update (version 1607) or a later version. 
- The registration of Windows current devices *is* supported in non-federated environments, such as password hash sync configurations.  


### Windows down-level devices

- The following Windows down-level devices are supported:
    - Windows 8.1
    - Windows 7
    - Windows Server 2012 R2
    - Windows Server 2012
    - Windows Server 2008 R2
- The registration of Windows down-level devices *is* supported in non-federated environments through [Azure Active Directory Seamless Single Sign-On](./connect/active-directory-aadconnect-sso.md).
- The registration of Windows down-level devices *is not* supported for devices that use roaming profiles. If you rely on roaming profiles or settings, use Windows 10.



## Prerequisites

Before you begin using hybrid Azure AD-joined devices in your organization, ensure that you are running an up-to-date version of Azure Active Directory Connect.

Azure AD Connect does the following:

- Keeps the association between the computer account in your on-premises Windows Server AD instance and the device object in Azure AD. 
- Makes other device-related features, like Windows Hello for Business, accessible to device users.



## Setup

You can set up hybrid Azure AD-joined devices for various types of Windows device platforms. In this article, we describe the required steps for all typical configuration scenarios.  

For an overview of the steps that are required for your scenario, see the following table:  



| Steps                                      | Windows current and password hash sync | Windows current and federation | Windows down-level |
| :--                                        | :-:                                    | :-:                            | :-:                |
| Step 1: Set up a service connection point | ![Check][1]                            | ![Check][1]                    | ![Check][1]        |
| Step 2: Set up claims issuance           |                                        | ![Check][1]                    | ![Check][1]        |
| Step 3: Enable non-Windows 10 devices      |                                        |                                | ![Check][1]        |
| Step 4: Control deployment and rollout     | ![Check][1]                            | ![Check][1]                    | ![Check][1]        |
| Step 5: Verify joined devices          | ![Check][1]                            | ![Check][1]                    | ![Check][1]        |



## Step 1: Set up a service connection point

Your devices use the service connection point object during registration to discover Azure AD tenant information. In your on-premises Windows Server AD instance, the service connection point object for hybrid Azure AD-joined devices must exist in the configuration naming context partition of the computer's forest. Each forest has one configuration naming context. In a multi-forest Windows Server AD configuration, the service connection point must exist in all forests that have domain-joined computers.

To get the configuration naming context of your forest, use the [Get-ADRootDSE](https://technet.microsoft.com/library/ee617246.aspx) cmdlet. 

For example, for a forest with the Windows Server AD domain name *fabrikam.com*, the configuration naming context is: 

`CN=Configuration,DC=fabrikam,DC=com`

In your forest, the service connection point object for the auto-registration of domain-joined devices is located at:  

`CN=62a0ff2e-97b9-4513-943f-0d221bd30080,CN=Device Registration Configuration,CN=Services,[your configuration naming context]`

Depending on how you deployed Azure AD Connect, the service connection point object might already have been configured.

You can verify the existence of the object and get the discovery values by using the following PowerShell script: 

    $scp = New-Object System.DirectoryServices.DirectoryEntry;

    $scp.Path = "LDAP://CN=62a0ff2e-97b9-4513-943f-0d221bd30080,CN=Device Registration Configuration,CN=Services,CN=Configuration,DC=fabrikam,DC=com";

    $scp.Keywords;

The **$scp.Keywords** output shows the Azure AD tenant information. For example:

    azureADName:microsoft.com
    azureADId:72f988bf-86f1-41af-91ab-2d7cd011db47

If the service connection point does not exist, you can create it by running the `Initialize-ADSyncDomainJoinedComputerSync` cmdlet on your Azure AD Connect server. Enterprise admin credentials are required to run this cmdlet. 

The `Initialize-ADSyncDomainJoinedComputerSync` cmdlet does the following:

- Creates the service connection point in the Windows Server AD forest that Azure AD Connect is connected to. 
- Requires you to specify the `AdConnectorAccount` parameter. This is the account that is configured as the Windows Server AD connector account in Azure AD Connect. 


The following script shows an example of how to use the cmdlet. In this script, `$aadAdminCred = Get-Credential` requires you to enter a user name. Enter the user name in the User Principal Name (UPN) format (user@example.com). 


    Import-Module -Name "C:\Program Files\Microsoft Azure Active Directory Connect\AdPrep\AdSyncPrep.psm1";

    $aadAdminCred = Get-Credential;

    Initialize-ADSyncDomainJoinedComputerSync –AdConnectorAccount [connector account name] -AzureADCredentials $aadAdminCred;

The `Initialize-ADSyncDomainJoinedComputerSync` cmdlet uses the Active Directory PowerShell module, which relies on Active Directory Web Services running on a domain controller. Active Directory Web Services is supported on domain controllers running Windows Server 2008 R2 and later versions.

The `Initialize-ADSyncDomainJoinedComputerSync` cmdlet is supported only by [MSOnline PowerShell module version 1.1.166.0](http://connect.microsoft.com/site1164/Downloads/DownloadDetails.aspx?DownloadID=59185).   

For domain controllers running Windows Server 2008 or earlier versions, to create the service connection point, use the following script. In a multi-forest configuration, use this script to create the service connection point in each forest where computers exist:
 
    $verifiedDomain = "contoso.com"    # Replace this with any of your verified domain names in Azure AD.
    $tenantID = "72f988bf-86f1-41af-91ab-2d7cd011db47"    # Replace this with your tenant ID.
    $configNC = "CN=Configuration,DC=corp,DC=contoso,DC=com"    # Replace this with your Windows Server Active Directory configuration naming context.

    $de = New-Object System.DirectoryServices.DirectoryEntry
    $de.Path = "LDAP://CN=Services," + $configNC

    $deDRC = $de.Children.Add("CN=Device Registration Configuration", "container")
    $deDRC.CommitChanges()

    $deSCP = $deDRC.Children.Add("CN=62a0ff2e-97b9-4513-943f-0d221bd30080", "serviceConnectionPoint")
    $deSCP.Properties["keywords"].Add("azureADName:" + $verifiedDomain)
    $deSCP.Properties["keywords"].Add("azureADId:" + $tenantID)

    $deSCP.CommitChanges()


## Step 2: Set up claims issuance

In a federated Azure AD configuration, devices rely on Active Directory Federation Services (AD FS) or on a third-party, on-premises federation service to authenticate to Azure AD. Devices authenticate to get an access token to register against the Azure Active Directory Device Registration Service.

Windows current devices authenticate by using Integrated Windows Authentication (IWA) to an active WS-Trust endpoint (1.3 or 2005 versions) hosted by the on-premises federation service.

> [!NOTE]
> When you use AD FS, you must enable either **adfs/services/trust/13/windowstransport** or **adfs/services/trust/2005/windowstransport**. If you are using the Web Authentication Proxy service, also ensure that this endpoint is published through the proxy. To see what endpoints are enabled, in the AD FS management console, go to **Service** > **Endpoints**.
>
> If you don’t use AD FS as your on-premises federation service, follow instructions from your vendor to ensure that the vendor support WS-Trust 1.3 or 2005 endpoints, and to ensure that these are published through the Metadata Exchange (MEX) file.
>

For device registration to be completed, the following claims must exist in the token that is received by the Azure AD Device Registration Service. The Azure AD Device Registration Service uses some of the information in these claims to create a device object in Azure AD. Then, Azure AD Connect uses the information to associate the newly created device object with the on-premises computer account.

* `http://schemas.microsoft.com/ws/2012/01/accounttype`
* `http://schemas.microsoft.com/identity/claims/onpremobjectguid`
* `http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid`

If you have more than one verified domain name, you must provide the following claim for computers:

* `http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid`

If you are already issuing an ImmutableID claim (an alternate sign-in ID), you must provide one corresponding claim for computers:

* `http://schemas.microsoft.com/LiveID/Federation/2008/05/ImmutableID`

In the following sections, you can get information about:
 
- Values required for each claim.
- What a definition in AD FS looks like.

The definition helps you verify whether the values are present, or if you need to create them.

> [!NOTE]
> If you don’t use AD FS for your on-premises federation server, follow your vendor's instructions to create the appropriate configuration to issue these claims.

### Issue account type claim

**`http://schemas.microsoft.com/ws/2012/01/accounttype`**.  This claim must contain a value of **DJ**, which identifies the device as a domain-joined computer. In AD FS, you can add an issuance transform rule that looks like this:

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

### Issue the object GUID of the on-premises computer account

**`http://schemas.microsoft.com/identity/claims/onpremobjectguid`**.  This claim must contain the **objectGUID** value of the on-premises computer account. In AD FS, you can add an issuance transform rule that looks like this:

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
 
### Issue the object SID of the on-premises computer account

**`http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid`**. This claim must contain the **objectSid** value of the on-premises computer account. In AD FS, you can add an issuance transform rule that looks like this:

    @RuleName = "Issue object SID for domain-joined computers"
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

### Issue issuer ID for computer for multiple verified domain names in Azure AD

**`http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid`**. This claim must contain the Uniform Resource Identifier (URI) of any of the verified domain names that connect with the on-premises federation service (AD FS or third party) that issues the token. In AD FS, you can add issuance transform rules that look like the following example, in the specific order listed. This claim must be placed after the ones that precede it. You also must create a rule to explicitly issue the rule for users. The following rules add a first rule that identifies the user, rather than computer authentication:

    @RuleName = "Issue account type with the value User when it's not a computer"
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
    
    @RuleName = "Capture UPN when AccountType is User and issue the issuer ID"
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
    
    @RuleName = "Issue issuer ID for domain-joined computers"
    c:[
        Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid", 
        Value =~ "-515$", 
        Issuer =~ "^(AD AUTHORITY|SELF AUTHORITY|LOCAL AUTHORITY)$"
    ]
    => issue(
        Type = "http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid", 
        Value = "http://<verified-domain-name>/adfs/services/trust/"
    );


In the preceding claim, the following is true:

- `$<domain>` is the AD FS service URL.
- `<verified-domain-name>` is a placeholder. Replace the placeholder with one of your verified domain names in Azure AD.

For more information about verified domain names, see [Add a custom domain name to Azure Active Directory](active-directory-add-domain.md).  

To get a list of your verified company domains, you can use the [Get-MsolDomain](/powershell/module/msonline/get-msoldomain?view=azureadps-1.0) cmdlet. 

![Get-MsolDomain](./media/active-directory-conditional-access-automatic-device-registration-setup/01.png)

### Issue immutable ID for a computer when one for users exists (alternate login ID is set)

**`http://schemas.microsoft.com/LiveID/Federation/2008/05/ImmutableID`**. This claim must contain a valid value for computers. In AD FS, you can create an issuance transform rule that looks like this:

    @RuleName = "Issue immutable ID for computers"
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

### Helper script to create AD FS issuance transform rules

You can use the following script to create the issuance transform rules described in the preceding sections:

	$multipleVerifiedDomainNames = $false
    $immutableIDAlreadyIssuedforUsers = $false
    $oneOfVerifiedDomainNames = 'example.com'   # Replace example.com with one of your verified domains.
    
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

    $rule3 = '@RuleName = "Issue object SID for domain-joined computers"
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
    
    @RuleName = "Capture UPN when AccountType is User and issue the issuer ID"
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
    
    @RuleName = "Issue issuer ID for domain-joined computers"
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
    $rule5 = '@RuleName = "Issue immutable ID for computers"
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

- The preceding script appends its rules to existing rules. Do not run the script twice. Running the script twice will add the set of rules twice. Make sure that no corresponding rules exist for these claims (under the corresponding conditions) before you run the script again.
- If you have multiple verified domain names (as shown in the Azure AD portal or via the `Get-MsolDomains` cmdlet), in the script, set the value of **$multipleVerifiedDomainNames** to **$true**. Also, ensure that you remove any existing issuer ID claim that might have been created by Azure AD Connect or by any other means. Here is an example for this rule:


        c:[Type == "http://schemas.xmlsoap.org/claims/UPN"]
        => issue(Type = "http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid", Value = regexreplace(c.Value, ".+@(?<domain>.+)",  "http://${domain}/adfs/services/trust/")); 

- If you have already issued an *immutable ID* claim  for user accounts, in the script, set the value of **$immutableIDAlreadyIssuedforUsers** to **$true**.

## Step 3: Enable Windows down-level devices

If some of your domain-joined devices are Windows down-level devices, you must do the following:

- Set a policy in Azure AD to allow users to register devices.
- Set up your on-premises federation service to issue claims to support *Integrated Windows Authentication (IWA)* for device registration.
- To avoid certificate prompts when authenticating a device, add the Azure AD device authentication endpoint to the Local Intranet zones.

### Set policy in Azure AD to allow users to register devices

To register Windows down-level devices, ensure that the setting to allow users to register devices in Azure AD is enabled. In the Azure portal, to find this setting, select **Azure Active Directory** > **Users and groups** > **Device settings**.
    
The **Users may register their devices with Azure AD** policy must be set to **All**.

![Register devices](./media/active-directory-conditional-access-automatic-device-registration-setup/23.png)


### Set up the on-premises federation service 

Your on-premises federation service must support issuing the **authenticationmethod** and **wiaormultiauthn** claims when it receives an authentication request to the Azure AD relying party that holds a *resouce_params* parameter. Use the encoded value, as follows:

    eyJQcm9wZXJ0aWVzIjpbeyJLZXkiOiJhY3IiLCJWYWx1ZSI6IndpYW9ybXVsdGlhdXRobiJ9XX0

    Decoded, this is {"Properties":[{"Key":"acr","Value":"wiaormultiauthn"}]}

When it receives this kind of request, the on-premises federation service must authenticate the user by using IWA. Upon success, it must issue the following two claims:

    http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows
    http://schemas.microsoft.com/claims/wiaormultiauthn

In AD FS, you must add an issuance transform rule to pass through the authentication method.  

To add an issuance transform rule:

1. In the AD FS management console, go to **AD FS** > **Trust Relationships** > **Relying Party Trusts**.
2. Right-click the Microsoft Office 365 Identity Platform relying party trust object, and then select **Edit Claim Rules**.
3. On the **Issuance Transform Rules** tab, select **Add Rule**.
4. In the **Claim rule** template list, select **Send Claims Using a Custom Rule**.
5. Select **Next**.
6. In the **Claim rule name** box, enter **Auth Method Claim Rule**.
7. In the **Claim rule** box, enter the following rule:

    `c:[Type == "http://schemas.microsoft.com/claims/authnmethodsreferences"] => issue(claim = c);`

8. On your federation server, type the following PowerShell command, after you replace **\<RPObjectName\>** with the relying party object name for your Azure AD relying party trust object. This object usually is named **Microsoft Office 365 Identity Platform**.
   
    `Set-AdfsRelyingPartyTrust -TargetName <RPObjectName> -AllowedAuthenticationClassReferences wiaormultiauthn`

### Add the Azure AD device authentication endpoint to the Local Intranet zones

To avoid certificate prompts when users on registered devices authenticate to Azure AD, you can push a policy to your domain-joined devices. The policy adds the following URL to the Local Intranet zone in Internet Explorer: https://device.login.microsoftonline.com.

## Step 4: Control deployment and rollout

After you have completed the required steps, domain-joined devices are ready to automatically join Azure AD:

- All domain-joined devices running Windows 10 Anniversary Update and Windows Server 2016 automatically register with Azure AD when the device restarts or the user signs in. 
- New devices register with Azure AD when the device restarts after the domain join operation is finished.
- Devices that previously were registered to Azure AD (for example, for Intune) transition to *Domain Joined, AAD Registered*. However, it takes some time for this process to complete across all devices due to the normal flow of domain and user activity.

### Remarks

- You can use a Group Policy object to control the rollout of automatic registration of Windows 10 and Windows Server 2016 domain-joined computers.
- Windows 10 November 2015 Update automatically joins with Azure AD *only* if the rollout Group Policy object is set.
- To roll out devices running earlier versions of Windows, you can deploy a [Windows Installer package](#windows-installer-packages-for-non-windows-10-computers) to devices that you select.
- If you push the Group Policy object to Windows 8.1 domain-joined devices, a join is attempted. However, we recommend that you use the [Windows Installer package](#windows-installer-packages-for-non-windows-10-computers) to join all your devices that are running earlier versions of Windows. 

### Create a Group Policy object 

To control the rollout of Windows current computers, you should deploy the **Register domain-joined computers as devices** Group Policy object to the devices that you want to register. For example, you can deploy the policy to an organizational unit or to a security group.

To set the policy:

1. Open **Server Manager**, and then go to **Tools** > **Group Policy Management**.
2. Go to the domain node that corresponds to the domain where you want to activate auto-registration of Windows current computers.
3. Right-click **Group Policy Objects**, and then select **New**.
4. Type a name for your Group Policy object. For example, **Hybrid Azure AD join**. 
5. Select **OK**.
6. Right-click your new Group Policy object, and then select **Edit**.
7. Go to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Device Registration**. 
8. Right-click **Register domain-joined computers as devices**, and then select **Edit**.
   
   > [!NOTE]
   > This Group Policy template has been renamed from earlier versions of the Group Policy Management console. If you are using an earlier version of the console, go to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Workplace Join** > **Automatically workplace join client computers**. 

7. Select **Enabled**, and then select **Apply**.
8. Select **OK**.
9. Link the Group Policy object to a location of your choice. For example, you can link it to a specific organizational unit. You also can link it to a specific security group of computers that automatically join with Azure AD. To set this policy for all domain-joined Windows 10 and Windows Server 2016 devices in your organization, link the Group Policy object to the domain.

### Windows Installer packages for non-Windows 10 computers

To join domain-joined Windows down-level computers in a federated environment, you can download and install these Windows Installer (.msi) files from the Microsoft Download Center at [Microsoft Workplace Join for non-Windows 10 computers](https://www.microsoft.com/en-us/download/details.aspx?id=53554).

You can deploy the package by using a software distribution system like System Center Configuration Manager. The package supports the standard silent install options, with the *quiet* parameter. System Center Configuration Manager Current Branch offers additional benefits over earlier versions, like the ability to track completed registrations. For more information, see [System Center Configuration Manager](https://www.microsoft.com/cloud-platform/system-center-configuration-manager).

The installer creates a scheduled task on the system that runs in the user’s context. The task is triggered when the user signs in to Windows. The task silently joins the device with Azure AD by using the user credentials, after authenticating by using IWA. To see the scheduled task, on the device, go to **Microsoft** > **Workplace Join**, and then go to the Task Scheduler library.

## Step 5: Verify joined devices

You can check successfully joined devices in your organization by using the [Get-MsolDevice](https://docs.microsoft.com/powershell/msonline/v1/get-msoldevice) cmdlet in the [Azure Active Directory PowerShell module](/powershell/azure/install-msonlinev1?view=azureadps-2.0).

The output of this cmdlet shows devices that are registered and joined with Azure AD. To get all devices, use the *-All* parameter. Then, you can filter the devices by using the **deviceTrustType** property. Domain-joined devices have a value of **Domain Joined**.

## Next steps

* [Introduction to device management in Azure Active Directory](device-management-introduction.md)



<!--Image references-->
[1]: ./media/active-directory-conditional-access-automatic-device-registration-setup/12.png
