---
title: Manual configuration for hybrid Azure Active Directory join devices
description: Learn how to manually configure hybrid Azure Active Directory join devices.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: tutorial
ms.date: 07/05/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: sandeo

ms.collection: M365-identity-device-management
---
# Configure hybrid Azure Active Directory join manually

If using Azure AD Connect is an option for you, see the guidance in [Configure hybrid Azure AD join](how-to-hybrid-join.md). Using the automation in Azure AD Connect, will significantly simplify the configuration of hybrid Azure AD join.

This article covers the manual configuration of requirements for hybrid Azure AD join including steps for managed and federated domains.

## Prerequisites

- [Azure AD Connect](https://www.microsoft.com/download/details.aspx?id=47594) version 1.1.819.0 or later.
   - To get device registration sync join to succeed, as part of the device registration configuration, don't exclude the default device attributes from your Azure AD Connect sync configuration. To learn more about default device attributes synced to Azure AD, see [Attributes synchronized by Azure AD Connect](../hybrid/reference-connect-sync-attributes-synchronized.md#windows-10).
   - If the computer objects of the devices you want to be hybrid Azure AD joined belong to specific organizational units (OUs), configure the correct OUs to sync in Azure AD Connect. To learn more about how to sync computer objects by using Azure AD Connect, see [Organizational unit–based filtering](../hybrid/how-to-connect-sync-configure-filtering.md#organizational-unitbased-filtering).
- Global Administrator credentials for your Azure AD tenant.
- Enterprise administrator credentials for each of the on-premises Active Directory Domain Services forests.
- (**For federated domains**) Windows Server 2012 R2 with Active Directory Federation Services installed.
- Users can register their devices with Azure AD. More information about this setting can be found under the heading **Configure device settings**, in the article, [Configure device settings](manage-device-identities.md#configure-device-settings).

Hybrid Azure AD join requires devices to have access to the following Microsoft resources from inside your organization's network:  

- `https://enterpriseregistration.windows.net`
- `https://login.microsoftonline.com`
- `https://device.login.microsoftonline.com`
- `https://autologon.microsoftazuread-sso.com` (If you use or plan to use seamless SSO)
- Your organization's Security Token Service (STS) (**For federated domains**)

> [!WARNING]
> If your organization uses proxy servers that intercept SSL traffic for scenarios like data loss prevention or Azure AD tenant restrictions, ensure that traffic to these URLs are excluded from TLS break-and-inspect. Failure to exclude these URLs may cause interference with client certificate authentication, cause issues with device registration, and device-based Conditional Access.

If your organization requires access to the internet via an outbound proxy, you can use [Web Proxy Auto-Discovery (WPAD)](/previous-versions/tn-archive/cc995261(v=technet.10)) to enable Windows 10 or newer computers for device registration with Azure AD. To address issues configuring and managing WPAD, see [Troubleshooting Automatic Detection](/previous-versions/tn-archive/cc302643(v=technet.10)).

If you don't use WPAD, you can configure WinHTTP proxy settings on your computer beginning with Windows 10 1709. For more information, see [WinHTTP Proxy Settings deployed by GPO](/archive/blogs/netgeeks/winhttp-proxy-settings-deployed-by-gpo).

> [!NOTE]
> If you configure proxy settings on your computer by using WinHTTP settings, any computers that can't connect to the configured proxy will fail to connect to the internet.

If your organization requires access to the internet via an authenticated outbound proxy, make sure that your Windows 10 or newer computers can successfully authenticate to the outbound proxy. Because Windows 10 or newer computers run device registration by using machine context, configure outbound proxy authentication by using machine context. Follow up with your outbound proxy provider on the configuration requirements.

Verify devices can access the required Microsoft resources under the system account by using the [Test Device Registration Connectivity](/samples/azure-samples/testdeviceregconnectivity/testdeviceregconnectivity/) script.

## Configuration

You can configure hybrid Azure AD joined devices for various types of Windows device platforms.

- For managed and federated domains, you must [configure a service connection point or SCP](#configure-a-service-connection-point).
- For federated domains, you must ensure that your [federation service is configured to issue the appropriate claims](#set-up-issuance-of-claims).

After these configurations are complete, follow the guidance to [verify registration](how-to-hybrid-join-verify.md) and [enable downlevel operating systems](how-to-hybrid-join-downlevel.md) where necessary.

### Configure a service connection point

Your devices use a service connection point (SCP) object during the registration to discover Azure AD tenant information. In your on-premises Active Directory instance, the SCP object for the hybrid Azure AD joined devices must exist in the configuration naming context partition of the computer's forest. There's only one configuration naming context per forest. In a multi-forest Active Directory configuration, the service connection point must exist in all forests that contain domain-joined computers.

The SCP object contains two keywords values – `azureADid:<TenantID>` and `azureADName:<verified domain>`. The `<verified domain>` value in the `azureADName` keyword dictates the type of the device registration flow (federated or managed) the device will follow after reading the SCP value from your on-premises Active Directory instance. More about the managed and federated flows can be found in the article [How Azure AD device registration works](device-registration-how-it-works.md).    

You can use the [**Get-ADRootDSE**](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/ee617246(v=technet.10)) cmdlet to retrieve the configuration naming context of your forest.  

For a forest with the Active Directory domain name *fabrikam.com*, the configuration naming context is:

`CN=Configuration,DC=fabrikam,DC=com`

In your forest, the SCP object for the autoregistration of domain-joined devices is located at:  

`CN=62a0ff2e-97b9-4513-943f-0d221bd30080,CN=Device Registration Configuration,CN=Services,[Your Configuration Naming Context]`

Depending on how you have deployed Azure AD Connect, the SCP object might have already been configured.
You can verify the existence of the object and retrieve the discovery values by using the following Windows PowerShell script:

   ```PowerShell
   $scp = New-Object System.DirectoryServices.DirectoryEntry;

   $scp.Path = "LDAP://CN=62a0ff2e-97b9-4513-943f-0d221bd30080,CN=Device Registration Configuration,CN=Services,CN=Configuration,DC=fabrikam,DC=com";

   $scp.Keywords;
   ```

The **$scp.Keywords** output shows the Azure AD tenant information. Here's an example:

   ```
   azureADName:microsoft.com
   azureADId:72f988bf-86f1-41af-91ab-2d7cd011db47
   ```

### Set up issuance of claims

In a federated Azure AD configuration, devices rely on AD FS or an  on-premises federation service from a Microsoft partner to authenticate to Azure AD. Devices authenticate to get an access token to register against the Azure Active Directory Device Registration Service (Azure DRS).

Windows current devices authenticate by using integrated Windows authentication to an active WS-Trust endpoint (either 1.3 or 2005 versions) hosted by the on-premises federation service.

When you're using AD FS, you need to enable the following WS-Trust endpoints

- `/adfs/services/trust/2005/windowstransport`
- `/adfs/services/trust/13/windowstransport`
- `/adfs/services/trust/2005/usernamemixed`
- `/adfs/services/trust/13/usernamemixed`
- `/adfs/services/trust/2005/certificatemixed`
- `/adfs/services/trust/13/certificatemixed`

> [!WARNING]
> Both **adfs/services/trust/2005/windowstransport** and **adfs/services/trust/13/windowstransport** should be enabled as intranet facing endpoints only and must NOT be exposed as extranet facing endpoints through the Web Application Proxy. To learn more on how to disable WS-Trust Windows endpoints, see [Disable WS-Trust Windows endpoints on the proxy](/windows-server/identity/ad-fs/deployment/best-practices-securing-ad-fs#disable-ws-trust-windows-endpoints-on-the-proxy-ie-from-extranet). You can see what endpoints are enabled through the AD FS management console under **Service** > **Endpoints**.

> [!NOTE]
> If you don’t have AD FS as your on-premises federation service, follow the instructions from your vendor to make sure they support WS-Trust 1.3 or 2005 endpoints and that these are published through the Metadata Exchange file (MEX).

For device registration to finish, the following claims must exist in the token that Azure DRS receives. Azure DRS will create a device object in Azure AD with some of this information. Azure AD Connect then uses this information to associate the newly created device object with the computer account on-premises.

* `http://schemas.microsoft.com/ws/2012/01/accounttype`
* `http://schemas.microsoft.com/identity/claims/onpremobjectguid`
* `http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid`

If you require more than one verified domain name, you need to provide the following claim for computers:

* `http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid`

If you're already issuing an ImmutableID claim (for example, using `mS-DS-ConsistencyGuid` or another attribute as the source value for the ImmutableID), you need to provide one corresponding claim for computers:

* `http://schemas.microsoft.com/LiveID/Federation/2008/05/ImmutableID`

In the following sections, you find information about:

* The values that each claim should have.
* What a definition would look like in AD FS.

The definition helps you to verify whether the values are present or if you need to create them.

> [!NOTE]
> If you don’t use AD FS for your on-premises federation server, follow your vendor's instructions to create the appropriate configuration to issue these claims.

#### Issue account type claim

The `http://schemas.microsoft.com/ws/2012/01/accounttype` claim must contain a value of **DJ**, which identifies the device as a domain-joined computer. In AD FS, you can add an issuance transform rule that looks like this:

   ```
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
   ```

#### Issue objectGUID of the computer account on-premises

The `http://schemas.microsoft.com/identity/claims/onpremobjectguid` claim must contain the **objectGUID** value of the on-premises computer account. In AD FS, you can add an issuance transform rule that looks like this:

   ```
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
   ```

#### Issue objectSID of the computer account on-premises

The `http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid` claim must contain the **objectSid** value of the on-premises computer account. In AD FS, you can add an issuance transform rule that looks like this:

   ```
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
   ```

#### Issue issuerID for the computer when multiple verified domain names are in Azure AD

The `http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid` claim must contain the Uniform Resource Identifier (URI) of any of the verified domain names that connect with the on-premises federation service (AD FS or partner) issuing the token. In AD FS, you can add issuance transform rules that look like the following ones in that specific order, after the preceding ones. One rule to explicitly issue the rule for users is necessary. In the following rules, a first rule that identifies user versus computer authentication is added.

   ```
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
   ```

In the preceding claim, `<verified-domain-name>` is a placeholder. Replace it with one of your verified domain names in Azure AD. For example, use `Value = "http://contoso.com/adfs/services/trust/"`.

For more information about verified domain names, see [Add a custom domain name to Azure Active Directory](../fundamentals/add-custom-domain.md).  

To get a list of your verified company domains, you can use the [Get-MsolDomain](/powershell/module/msonline/get-msoldomain) cmdlet.

![List of company domains](./media/hybrid-join-manual/01.png)

#### Issue ImmutableID for the computer when one for users exists (for example, using mS-DS-ConsistencyGuid as the source for ImmutableID)

The `http://schemas.microsoft.com/LiveID/Federation/2008/05/ImmutableID` claim must contain a valid value for computers. In AD FS, you can create an issuance transform rule as follows:

   ```
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
   ```

#### Helper script to create the AD FS issuance transform rules

The following script helps you with the creation of the issuance transform rules described earlier.

   ```
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
   ```

#### Remarks

* This script appends the rules to the existing rules. Don't run the script twice, because the set of rules would be added twice. Make sure that no corresponding rules exist for these claims (under the corresponding conditions) before running the script again.
* If you have multiple verified domain names (as shown in the Azure portal or via the **Get-MsolDomain** cmdlet), set the value of **$multipleVerifiedDomainNames** in the script to **$true**. Also make sure that you remove any existing **issuerid** claim that might have been created by Azure AD Connect or via other means. Here's an example for this rule:

   ```
   c:[Type == "http://schemas.xmlsoap.org/claims/UPN"]
   => issue(Type = "http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid", Value = regexreplace(c.Value, ".+@(?<domain>.+)",  "http://${domain}/adfs/services/trust/")); 
   ```

If you've already issued an **ImmutableID** claim  for user accounts, set the value of **$immutableIDAlreadyIssuedforUsers** in the script to **$true**.

#### Configure federation service for downlevel devices

Downlevel devices require your on-premises federation service to issue claims to support integrated Windows authentication (IWA) for device registration.

Your on-premises federation service must support issuing the **authenticationmethod** and **wiaormultiauthn** claims when it receives an authentication request to the Azure AD relying party holding a resource_params parameter with the following encoded value:

   ```
   eyJQcm9wZXJ0aWVzIjpbeyJLZXkiOiJhY3IiLCJWYWx1ZSI6IndpYW9ybXVsdGlhdXRobiJ9XX0

   which decoded is {"Properties":[{"Key":"acr","Value":"wiaormultiauthn"}]}
   ```

When such a request comes, the on-premises federation service must authenticate the user by using integrated Windows authentication. When authentication is successful, the federation service must issue the following two claims:

   `http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows`
   `http://schemas.microsoft.com/claims/wiaormultiauthn`

In AD FS, you must add an issuance transform rule that passes through the authentication method. To add this rule:

1. In the AD FS management console, go to **AD FS** > **Trust Relationships** > **Relying Party Trusts**.
1. Right-click the Microsoft Office 365 Identity Platform relying party trust object, and then select **Edit Claim Rules**.
1. On the **Issuance Transform Rules** tab, select **Add Rule**.
1. In the **Claim rule** template list, select **Send Claims Using a Custom Rule**.
1. Select **Next**.
1. In the **Claim rule name** box, enter **Auth Method Claim Rule**.
1. In the **Claim rule** box, enter the following rule:

   `c:[Type == "http://schemas.microsoft.com/claims/authnmethodsreferences"] => issue(claim = c);`

1. On your federation server, enter the following PowerShell command. Replace **\<RPObjectName\>** with the relying party object name for your Azure AD relying party trust object. This object usually is named **Microsoft Office 365 Identity Platform**.

   `Set-AdfsRelyingPartyTrust -TargetName <RPObjectName> -AllowedAuthenticationClassReferences wiaormultiauthn`

## Troubleshoot your implementation

If you experience issues completing hybrid Azure AD join for domain-joined Windows devices, see:

- [Troubleshooting devices using dsregcmd command](./troubleshoot-device-dsregcmd.md)
- [Troubleshooting hybrid Azure Active Directory joined devices](troubleshoot-hybrid-join-windows-current.md)
- [Troubleshooting hybrid Azure Active Directory joined down-level devices](troubleshoot-hybrid-join-windows-legacy.md)

## Next steps

- [Hybrid Azure AD join verification](how-to-hybrid-join-verify.md)
- [Downlevel device enablement](how-to-hybrid-join-downlevel.md)
- [Plan your hybrid Azure Active Directory join implementation](hybrid-join-plan.md)
- [Use Conditional Access to require compliant or hybrid Azure AD joined device](../conditional-access/howto-conditional-access-policy-compliant-device.md)
