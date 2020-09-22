---
title: Set up direct federation with an AD FS for B2B - Azure AD
description: Learn how to set up AD FS as an identity provider for direct federation so guests can sign in to your Azure AD apps

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 07/01/2019

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal
ms.custom: "it-pro"
ms.collection: M365-identity-device-management
---

# Example: Direct federation with Active Directory Federation Services (AD FS) (preview)

> [!NOTE]
> Direct federation is a public preview feature of Azure Active Directory. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article describes how to set up [direct federation](direct-federation.md) using Active Directory Federation Services (AD FS) as either a SAML 2.0 or WS-Fed identity provider. To support direct federation, certain attributes and claims must be configured at the identity provider. To illustrate how to configure an identity provider for direct federation, we’ll use Active Directory Federation Services (AD FS) as an example. We’ll show how to set up AD FS both as a SAML identity provider and as a WS-Fed identity provider.

> [!NOTE]
> This article describes how to set up AD FS for both SAML and WS-Fed for illustration purposes. For direct federation integrations where the identity provider is AD FS, we recommend using WS-Fed as the protocol. 

## Configure AD FS for SAML 2.0 direct federation
Azure AD B2B can be configured to federate with identity providers that use the SAML protocol with specific requirements listed below. To illustrate the SAML configuration steps, this section shows how to set up AD FS for SAML 2.0. 

To set up direct federation, the following attributes must be received in the SAML 2.0 response from the identity provider. These attributes can be configured by linking to the online security token service XML file or by entering them manually. Step 12 in [Create a test AD FS instance](https://medium.com/in-the-weeds/create-a-test-active-directory-federation-services-3-0-instance-on-an-azure-virtual-machine-9071d978e8ed) describes how to find the AD FS endpoints or how to generate your metadata URL, for example `https://fs.iga.azure-test.net/federationmetadata/2007-06/federationmetadata.xml`. 

|Attribute  |Value  |
|---------|---------|
|AssertionConsumerService     |`https://login.microsoftonline.com/login.srf`         |
|Audience     |`urn:federation:MicrosoftOnline`         |
|Issuer     |The issuer URI of the partner IdP, for example `http://www.example.com/exk10l6w90DHM0yi...`         |

The following claims need to be configured in the SAML 2.0 token issued by the identity provider:


|Attribute  |Value  |
|---------|---------|
|NameID Format     |`urn:oasis:names:tc:SAML:2.0:nameid-format:persistent`         |
|emailaddress     |`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`         |


The next section illustrates how to configure the required attributes and claims using AD FS as an example of a SAML 2.0 identity provider.

### Before you begin

An AD FS server must already be set up and functioning before you begin this procedure. For help with setting up an AD FS server, see [Create a test AD FS 3.0 instance on an Azure virtual machine](https://medium.com/in-the-weeds/create-a-test-active-directory-federation-services-3-0-instance-on-an-azure-virtual-machine-9071d978e8ed).

### Add the claim description

1. On your AD FS server, select **Tools** > **AD FS management**.
2. In the navigation pane, select **Service** > **Claim Descriptions**.
3. Under **Actions**, select **Add Claim Description**.
4. In the **Add a Claim Description** window, specify the following values:

   - **Display Name**: Persistent Identifier
   - **Claim identifier**: `urn:oasis:names:tc:SAML:2.0:nameid-format:persistent` 
   - Select the check box for **Publish this claim description in federation metadata as a claim type that this federation service can accept**.
   - Select the check box for **Publish this claim description in federation metadata as a claim type that this federation service can send**.

5. Click **Ok**.

### Add the relying party trust and claim rules

1. On the AD FS server, go to **Tools** > **AD FS management**.
2. In the navigation pane, select **Trust Relationships** > **Relying Party Trusts**.
3. Under **Actions**, select **Add Relying Party Trust**. 
4. In the add relying party trust wizard for **Select Data Source**, use the option **Import data about the relying party published online or on a local network**. Specify this federation metadata URL- https://nexus.microsoftonline-p.com/federationmetadata/saml20/federationmetadata.xml. Leave other default selections. Select **Close**.
5. The **Edit Claim Rules** wizard opens.
6. In the **Edit Claim Rules** wizard, select **Add Rule**. In **Choose Rule Type**, select **Send LDAP Attributes as Claims**. Select **Next**.
7. In **Configure Claim Rule**, specify the following values: 

   - **Claim rule name**: Email claim rule 
   - **Attribute store**: Active Directory 
   - **LDAP Attribute**: E-Mail-Addresses 
   - **Outgoing Claim Type**: E-Mail Address

8. Select **Finish**.
9. The **Edit Claim Rules** window will show the new rule. Click **Apply**. 
10. Click **Ok**.  

### Create an email transform rule
1. Go to **Edit Claim Rules** and click **Add Rule**. In **Choose Rule Type**, select **Transform an Incoming Claim** and click **Next**. 
2. In **Configure Claim Rule**, specify the following values: 

   - **Claim rule name**: Email transform rule 
   - **Incoming claim type**: E-mail Address 
   - **Outgoing claim type**: Name ID 
   - **Outgoing name ID format**: Persistent Identifier 
   - Select **Pass through all claim values**.

3. Click **Finish**. 
4. The **Edit Claim Rules** window will show the new rules. Click **Apply**. 
5. Click **OK**. The AD FS server is now configured for direct federation using the SAML 2.0 protocol.

## Configure AD FS for WS-Fed direct federation 
Azure AD B2B can be configured to federate with identity providers that use the WS-Fed protocol with the specific requirements listed below. Currently, the two WS-Fed providers have been tested for compatibility with Azure AD include AD FS and Shibboleth. Here, we’ll use Active Directory Federation Services (AD FS) as an example of the WS-Fed identity provider. For more information about establishing a relying party trust between a WS-Fed compliant provider with Azure AD, download the Azure AD Identity Provider Compatibility Docs.

To set up direct federation, the following attributes must be received in the WS-Fed message from the identity provider. These attributes can be configured by linking to the online security token service XML file or by entering them manually. Step 12 in [Create a test AD FS instance](https://medium.com/in-the-weeds/create-a-test-active-directory-federation-services-3-0-instance-on-an-azure-virtual-machine-9071d978e8ed) describes how to find the AD FS endpoints or how to generate your metadata URL, for example `https://fs.iga.azure-test.net/federationmetadata/2007-06/federationmetadata.xml`.
 
|Attribute  |Value  |
|---------|---------|
|PassiveRequestorEndpoint     |`https://login.microsoftonline.com/login.srf`         |
|Audience     |`urn:federation:MicrosoftOnline`         |
|Issuer     |The issuer URI of the partner IdP, for example `http://www.example.com/exk10l6w90DHM0yi...`         |

Required claims for the WS-Fed token issued by the IdP:

|Attribute  |Value  |
|---------|---------|
|ImmutableID     |`http://schemas.microsoft.com/LiveID/Federation/2008/05/ImmutableID`         |
|emailaddress     |`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`         |

The next section illustrates how to configure the required attributes and claims using AD FS as an example of a WS-Fed identity provider.

### Before you begin
An AD FS server must already be set up and functioning before you begin this procedure. For help with setting up an AD FS server, see [Create a test AD FS 3.0 instance on an Azure virtual machine](https://medium.com/in-the-weeds/create-a-test-active-directory-federation-services-3-0-instance-on-an-azure-virtual-machine-9071d978e8ed).


### Add the relying party trust and claim rules 
1. On the AD FS server, go to **Tools** > **AD FS management**. 
1. In the navigation pane, select **Trust Relationships** > **Relying Party Trusts**. 
1. Under **Actions**, select **Add Relying Party Trust**.  
1. In the add relying party trust wizard, for **Select Data Source**, use the option **Import data about the relying party published online or on a local network**. Specify this federation metadata URL: `https://nexus.microsoftonline-p.com/federationmetadata/2007-06/federationmetadata.xml`.  Leave other default selections. Select **Close**.
1. The **Edit Claim Rules** wizard opens. 
1. In the **Edit Claim Rules** wizard, select **Add Rule**. In **Choose Rule Type**, select **Send Claims Using a Custom Rule**. Select *Next*. 
1. In **Configure Claim Rule**, specify the following values:

   - **Claim rule name**: Issue Immutable Id  
   - **Custom rule**: `c:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname"] => issue(store = "Active Directory", types = ("http://schemas.microsoft.com/LiveID/Federation/2008/05/ImmutableID"), query = "samAccountName={0};objectGUID;{1}", param = regexreplace(c.Value, "(?<domain>[^\\]+)\\(?<user>.+)", "${user}"), param = c.Value);`

1. Select **Finish**. 
1. The **Edit Claim Rules** window will show the new rule. Click **Apply**.  
1. In the same **Edit Claim Rules** wizard, select **Add Rule**. In **Cohose Rule Type**, select **Send LDAP Attributes as Claims**. Select **Next**.
1. In **Configure Claim Rule**, specify the following values: 

   - **Claim rule name**: Email claim rule  
   - **Attribute store**: Active Directory  
   - **LDAP Attribute**: E-Mail-Addresses  
   - **Outgoing Claim Type**: E-Mail Address 

1.	Select **Finish**. 
1.	The **Edit Claim Rules** window will show the new rule. Click **Apply**.  
1.	Click **OK**. The AD FS server is now configured for direct federation using WS-Fed.

## Next steps
Next, you'll [configure direct federation in Azure AD](direct-federation.md#step-2-configure-direct-federation-in-azure-ad) either in the Azure AD portal or by using PowerShell. 
