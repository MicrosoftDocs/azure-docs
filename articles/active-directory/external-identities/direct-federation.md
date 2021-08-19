---
title: Federation with a SAML/WS-Fed identity provider (IdP) for B2B - Azure AD
description: Directly federate with a SAML or WS-Fed identity provider so guests can sign in to your Azure AD apps

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 06/17/2021

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal
ms.custom: "it-pro"
ms.collection: M365-identity-device-management
---

# Federation with SAML/WS-Fed identity providers for guest users (preview)

> [!NOTE]
>- *Direct federation* in Azure Active Directory is now referred to as *SAML/WS-Fed identity provider (IdP) federation*.
>- SAML/WS-Fed IdP federation is a public preview feature of Azure Active Directory. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article describes how to set up federation with any organization whose identity provider (IdP) supports the SAML 2.0 or WS-Fed protocol. When you set up federation with a partner's IdP, new guest users from that domain can use their own IdP-managed organizational account to sign in to your Azure AD tenant and start collaborating with you. There's no need for the guest user to create a separate Azure AD account.

> [!IMPORTANT]
> - We've removed the limitation that required the authentication URL domain to match the target domain or be from an allowed IdP. For details, see [Step 1: Determine if the partner needs to update their DNS text records](#step-1-determine-if-the-partner-needs-to-update-their-dns-text-records).
>-  We now recommend that the partner set the audience of the SAML or WS-Fed based IdP to a tenanted audience. Refer to the [SAML 2.0](#required-saml-20-attributes-and-claims) and [WS-Fed](#required-ws-fed-attributes-and-claims) required attributes and claims sections below.

## When is a guest user authenticated with SAML/WS-Fed IdP federation?

After you set up federation with an organization's SAML/WS-Fed IdP, any new guest users you invite will be authenticated using that SAML/WS-Fed IdP. It’s important to note that setting up federation doesn’t change the authentication method for guest users who have already redeemed an invitation from you. Here are some examples:

 - If guest users have already redeemed invitations from you, and you subsequently set up federation with the organization's SAML/WS-Fed IdP, those guest users will continue to use the same authentication method they used before you set up federation.
 - If you set up federation with an organization's SAML/WS-Fed IdP and invite guest users, and then the partner organization later moves to Azure AD, the guest users who have already redeemed invitations will continue to use the federated SAML/WS-Fed IdP, as long as the federation policy in your tenant exists.
 - If you delete federation with an organization's SAML/WS-Fed IdP, any guest users currently using the SAML/WS-Fed IdP will be unable to sign in.

In any of these scenarios, you can update a guest user’s authentication method by [resetting their redemption status](reset-redemption-status.md).

SAML/WS-Fed IdP federation is tied to domain namespaces, such as contoso.com and fabrikam.com. When establishing federation with AD FS or a third-party IdP, organizations associate one or more domain namespaces to these IdPs.

## End-user experience 

With SAML/WS-Fed IdP federation, guest users sign into your Azure AD tenant using their own organizational account. When they are accessing shared resources and are prompted for sign-in, users are redirected to their IdP. After successful sign-in, users are returned to Azure AD to access resources. Their refresh tokens are valid for 12 hours, the [default length for passthrough refresh token](../develop/active-directory-configurable-token-lifetimes.md#configurable-token-lifetime-properties) in Azure AD. If the federated IdP has SSO enabled, the user will experience SSO and will not see any sign-in prompt after initial authentication.

## Sign-in endpoints

SAML/WS-Fed IdP federation guest users can now sign in to your multi-tenant or Microsoft first-party apps by using a [common endpoint](redemption-experience.md#redemption-and-sign-in-through-a-common-endpoint) (in other words, a general app URL that doesn't include your tenant context). During the sign-in process, the guest user chooses **Sign-in options**, and then selects **Sign in to an organization**. The user then types the name of your organization and continues signing in using their own credentials.

SAML/WS-Fed IdP federation guest users can also use application endpoints that include your tenant information, for example:

  * `https://myapps.microsoft.com/?tenantid=<your tenant ID>`
  * `https://myapps.microsoft.com/<your verified domain>.onmicrosoft.com`
  * `https://portal.azure.com/<your tenant ID>`

You can also give guest users a direct link to an application or resource by including your tenant information, for example `https://myapps.microsoft.com/signin/Twitter/<application ID?tenantId=<your tenant ID>`.

## Limitations

### DNS-verified domains in Azure AD
You can set up SAML/WS-Fed IdP federation with domains that aren't DNS-verified in Azure AD, including unmanaged (email-verified or "viral") Azure AD tenants. However, we block SAML/WS-Fed IdP federation for Azure AD verified domains in favor of native Azure AD managed domain capabilities. You'll see an error in the Azure portal or PowerShell if you try to set up SAML/WS-Fed IdP federation with a domain that is DNS-verified in Azure AD.

### Signing certificate renewal
If you specify the metadata URL in the IdP settings, Azure AD will automatically renew the signing certificate when it expires. However, if the certificate is rotated for any reason before the expiration time, or if you don't provide a metadata URL, Azure AD will be unable to renew it. In this case, you'll need to update the signing certificate manually.

### Limit on federation relationships
Currently, a maximum of 1,000 federation relationships is supported. This limit includes both [internal federations](/powershell/module/msonline/set-msoldomainfederationsettings) and SAML/WS-Fed IdP federations.

### Limit on multiple domains
We don’t currently support SAML/WS-Fed IdP federation with multiple domains from the same tenant.

## Frequently asked questions
### Can I set up SAML/WS-Fed IdP federation with a domain for which an unmanaged (email-verified) tenant exists? 
Yes. If the domain hasn't been verified and the tenant hasn't undergone an [admin takeover](../enterprise-users/domains-admin-takeover.md), you can set up federation with that domain. Unmanaged, or email-verified, tenants are created when a user redeems a B2B invitation or performs a self-service sign-up for Azure AD using a domain that doesn’t currently exist. You can set up SAML/WS-Fed IdP federation with these domains.
### If SAML/WS-Fed IdP federation and email one-time passcode authentication are both enabled, which method takes precedence?
When SAML/WS-Fed IdP federation is established with a partner organization, it takes precedence over email one-time passcode authentication for new guest users from that organization. If a guest user redeemed an invitation using one-time passcode authentication before you set up SAML/WS-Fed IdP federation, they'll continue to use one-time passcode authentication.
### Does SAML/WS-Fed IdP federation address sign-in issues due to a partially synced tenancy?
No, the [email one-time passcode](one-time-passcode.md) feature should be used in this scenario. A “partially synced tenancy” refers to a partner Azure AD tenant where on-premises user identities aren't fully synced to the cloud. A guest whose identity doesn’t yet exist in the cloud but who tries to redeem your B2B invitation won’t be able to sign in. The one-time passcode feature would allow this guest to sign in. The SAML/WS-Fed IdP federation feature addresses scenarios where the guest has their own IdP-managed organizational account, but the organization has no Azure AD presence at all.
### Once SAML/WS-Fed IdP federation is configured with an organization, does each guest need to be sent and redeem an individual invitation?
Setting up SAML/WS-Fed IdP federation doesn’t change the authentication method for guest users who have already redeemed an invitation from you. You can update a guest user’s authentication method by [resetting their redemption status](reset-redemption-status.md).

## Step 1: Determine if the partner needs to update their DNS text records

Depending on the partner's IdP, the partner might need to update their DNS records to enable federation with you. Use the following steps to determine if DNS updates are needed.

1. If the partner's IdP is one of these allowed IdPs, no DNS changes are needed (this list is subject to change):

     - accounts.google.com
     - pingidentity.com
     - login.pingone.com
     - okta.com
     - oktapreview.com
     - okta-emea.com
     - my.salesforce.com
     - federation.exostar.com
     - federation.exostartest.com
     - idaptive.app
     - idaptive.qa

2. If the IdP is not one of the allowed providers listed in the previous step, check the partner's IdP authentication URL to see if the domain matches the target domain or a host within the target domain. In other words, when setting up federation for `fabrikam.com`:

     - If the authentication URL is `https://fabrikam.com` or `https://sts.fabrikam.com/adfs` (a host in the same domain), no DNS changes are needed.
     - If the authentication URL is `https://fabrikamconglomerate.com/adfs` or `https://fabrikam.com.uk/adfs`, the domain doesn't match the fabrikam.com domain, so the partner will need to add a text record for the authentication URL to their DNS configuration; go to the next step.

3. If DNS changes are needed based on the previous step, ask the partner to add a TXT record to their domain's DNS records, like the following example:

   `fabrikam.com.  IN   TXT   DirectFedAuthUrl=https://fabrikamconglomerate.com/adfs`

## Step 2: Configure the partner organization’s IdP

Next, your partner organization needs to configure their IdP with the required claims and relying party trusts.

> [!NOTE]
> To illustrate how to configure a SAML/WS-Fed IdP for federation, we’ll use Active Directory Federation Services (AD FS) as an example. See the article [Configure SAML/WS-Fed IdP federation with AD FS](direct-federation-adfs.md), which gives examples of how to configure AD FS as a SAML 2.0 or WS-Fed IdP in preparation for federation.

### SAML 2.0 configuration

Azure AD B2B can be configured to federate with IdPs that use the SAML protocol with specific requirements listed below. For more information about setting up a trust between your SAML IdP and Azure AD, see  [Use a SAML 2.0 Identity Provider (IdP) for Single Sign-On](../hybrid/how-to-connect-fed-saml-idp.md).  

> [!NOTE]
> The target domain for SAML/WS-Fed IdP federation must not be DNS-verified in Azure AD. See the [Limitations](#limitations) section for details.

#### Required SAML 2.0 attributes and claims
The following tables show requirements for specific attributes and claims that must be configured at the third-party IdP. To set up federation, the following attributes must be received in the SAML 2.0 response from the IdP. These attributes can be configured by linking to the online security token service XML file or by entering them manually.

Required attributes for the SAML 2.0 response from the IdP:

|Attribute  |Value  |
|---------|---------|
|AssertionConsumerService     |`https://login.microsoftonline.com/login.srf`         |
|Audience     |`https://login.microsoftonline.com/<tenant ID>/` (Recommended tenanted audience.) Replace `<tenant ID>` with the tenant ID of the Azure AD tenant you're setting up federation with.<br><br>`urn:federation:MicrosoftOnline` (This value will be deprecated.)          |
|Issuer     |The issuer URI of the partner IdP, for example `http://www.example.com/exk10l6w90DHM0yi...`         |


Required claims for the SAML 2.0 token issued by the IdP:

|Attribute  |Value  |
|---------|---------|
|NameID Format     |`urn:oasis:names:tc:SAML:2.0:nameid-format:persistent`         |
|emailaddress     |`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`         |

### WS-Fed configuration

Azure AD B2B can be configured to federate with IdPs that use the WS-Fed protocol with some specific requirements as listed below. Currently, the two WS-Fed providers have been tested for compatibility with Azure AD include AD FS and Shibboleth. For more information about establishing a relying party trust between a WS-Fed compliant provider with Azure AD, see the "STS Integration Paper using WS Protocols" available in the [Azure AD Identity Provider Compatibility Docs](https://www.microsoft.com/download/details.aspx?id=56843).

> [!NOTE]
> The target domain for federation must not be DNS-verified on Azure AD. See the [Limitations](#limitations) section for details.

#### Required WS-Fed attributes and claims

The following tables show requirements for specific attributes and claims that must be configured at the third-party WS-Fed IdP. To set up federation, the following attributes must be received in the WS-Fed message from the IdP. These attributes can be configured by linking to the online security token service XML file or by entering them manually.

Required attributes in the WS-Fed message from the IdP:
 
|Attribute  |Value  |
|---------|---------|
|PassiveRequestorEndpoint     |`https://login.microsoftonline.com/login.srf`         |
|Audience     |`https://login.microsoftonline.com/<tenant ID>/` (Recommended tenanted audience.) Replace `<tenant ID>` with the tenant ID of the Azure AD tenant you're federating with.<br><br>`urn:federation:MicrosoftOnline` (This value will be deprecated.)          |
|Issuer     |The issuer URI of the partner IdP, for example `http://www.example.com/exk10l6w90DHM0yi...`         |

Required claims for the WS-Fed token issued by the IdP:

|Attribute  |Value  |
|---------|---------|
|ImmutableID     |`http://schemas.microsoft.com/LiveID/Federation/2008/05/ImmutableID`         |
|emailaddress     |`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`         |

## Step 3: Configure SAML/WS-Fed IdP federation in Azure AD

Next, you'll configure federation with the IdP configured in step 1 in Azure AD. You can use either the Azure AD portal or PowerShell. It might take 5-10 minutes before the federation policy takes effect. During this time, don't attempt to redeem an invitation for the federation domain. The following attributes are required:

- Issuer URI of partner IdP
- Passive authentication endpoint of partner IdP (only https is supported)
- Certificate

### To configure federation in the Azure AD portal

1. Go to the [Azure portal](https://portal.azure.com/). In the left pane, select **Azure Active Directory**. 
2. Select **External Identities** > **All identity providers**.
3. Select **New SAML/WS-Fed IdP**.

    ![Screenshot showing button for adding a new SAML or WS-Fed IdP](media/direct-federation/new-saml-wsfed-idp.png)

4. On the **New SAML/WS-Fed IdP** page, under **Identity provider protocol**, select **SAML** or **WS-FED**.

    ![Screenshot showing parse button on the SAML or WS-Fed IdP page](media/direct-federation/new-saml-wsfed-idp-parse.png)

5. Enter your partner organization’s domain name, which will be the target domain name for federation
6. You can upload a metadata file to populate metadata details. If you choose to input metadata manually, enter the following information:
   - Domain name of partner IdP
   - Entity ID of partner IdP
   - Passive requestor endpoint of partner IdP
   - Certificate
   > [!NOTE]
   > Metadata URL is optional, however we strongly recommend it. If you provide the metadata URL, Azure AD can automatically renew the signing certificate when it expires. If the certificate is rotated for any reason before the expiration time or if you do not provide a metadata URL, Azure AD will be unable to renew it. In this case, you'll need to update the signing certificate manually.

7. Select **Save**. 

### To configure SAML/WS-Fed IdP federation in Azure AD using PowerShell

1. Install the latest version of the Azure AD PowerShell for Graph module ([AzureADPreview](https://www.powershellgallery.com/packages/AzureADPreview)). If you need detailed steps, the Quickstart includes the guidance, [PowerShell module](b2b-quickstart-invite-powershell.md#prerequisites).
2. Run the following command:

   ```powershell
   Connect-AzureAD
   ```

3. At the sign-in prompt, sign in with the managed Global Administrator account.
4. Run the following commands, replacing the values from the federation metadata file. For AD FS Server and Okta, the federation file is federationmetadata.xml, for example: `https://sts.totheclouddemo.com/federationmetadata/2007-06/federationmetadata.xml`. 

   ```powershell
   $federationSettings = New-Object Microsoft.Open.AzureAD.Model.DomainFederationSettings
   $federationSettings.PassiveLogOnUri ="https://sts.totheclouddemo.com/adfs/ls/"
   $federationSettings.LogOffUri = $federationSettings.PassiveLogOnUri
   $federationSettings.IssuerUri = "http://sts.totheclouddemo.com/adfs/services/trust"
   $federationSettings.MetadataExchangeUri="https://sts.totheclouddemo.com/adfs/services/trust/mex"
   $federationSettings.SigningCertificate= <Replace with X509 signing cert’s public key>
   $federationSettings.PreferredAuthenticationProtocol="WsFed" OR "Samlp"
   $domainName = <Replace with domain name>
   New-AzureADExternalDomainFederation -ExternalDomainName $domainName  -FederationSettings $federationSettings
   ```

## Step 4: Test SAML/WS-Fed IdP federation in Azure AD
Now test your federation setup by inviting a new B2B guest user. For details, see [Add Azure AD B2B collaboration users in the Azure portal](add-users-administrator.md).
 
## How do I edit a SAML/WS-Fed IdP federation relationship?

1. Go to the [Azure portal](https://portal.azure.com/). In the left pane, select **Azure Active Directory**. 
2. Select **External Identities**.
3. Select **All identity providers**
4. Under **SAML/WS-Fed identity providers**, select the provider.
5. In the identity provider details pane, update the values.
6. Select **Save**.


## How do I remove federation?

You can remove your federation setup. If you do, federation guest users who have already redeemed their invitations won't be able to sign in. But you can give them access to your resources again by [resetting their redemption status](reset-redemption-status.md). 
To remove federation with an IdP in the Azure AD portal:

1. Go to the [Azure portal](https://portal.azure.com/). In the left pane, select **Azure Active Directory**.
2. Select **External Identities**.
3. Select **All identity providers**.
4. Select the identity provider, and then select **Delete**.
5. Select **Yes** to confirm deletion. 

To remove federation with an identity provider by using PowerShell:

1. Install the latest version of the Azure AD PowerShell for Graph module ([AzureADPreview](https://www.powershellgallery.com/packages/AzureADPreview)).
2. Run the following command:

   ```powershell
   Connect-AzureAD
   ```

3. At the sign-in prompt, sign in with the managed Global Administrator account.
4. Enter the following command:

   ```powershell
   Remove-AzureADExternalDomainFederation -ExternalDomainName  $domainName
   ```

## Next steps

Learn more about the [invitation redemption experience](redemption-experience.md) when external users sign in with various identity providers.
