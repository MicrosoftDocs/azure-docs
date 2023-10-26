---
title: 'SAML-based single sign-on: Configuration and Limitations'
description: This article explains how to configure an application for SAML-based SSO with Microsoft Entra ID, including user mapping, limitations, SAML signing certificates, token encryption, request signature verification, and custom claims providers.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 05/31/2023
ms.author: jomondi
ms.reviewer: gasinh
---
# SAML-based single sign-on: Configuration and Limitations

In this article, you learn how to configure an application for SAML-based single sign-on (SSO) with Microsoft Entra ID. This article covers mapping users to specific application roles based on rules, and limitations to keep in mind when mapping attributes. It also covers SAML signing certificates, SAML token encryption, SAML request signature verification, and custom claims providers.

Apps that use SAML 2.0 for authentication can be configured for [SAML-based single sign-on](what-is-single-sign-on.md) (SSO). With SAML-based SSO, you can map users to specific application roles based on rules that you define in your SAML claims.

To configure a SaaS application for SAML-based SSO, see [Quickstart: Set up SAML-based single sign-on](add-application-portal-setup-sso.md).

:::image type="content" source="media/migrate-adfs-saml-based-sso/sso-saml-user-attributes-claims.png" alt-text="Screenshot of the SAML SSO settings blade.":::

Many SaaS applications have an [application-specific tutorial](../saas-apps/tutorial-list.md) that steps you through the configuration for SAML-based SSO.

Some apps can be migrated easily. Apps with more complex requirements, such as custom claims, may require extra configuration in Microsoft Entra ID and/or [Microsoft Entra Connect Health](../hybrid/connect/whatis-azure-ad-connect.md). For information about supported claims mappings, see [How to: Customize claims emitted in tokens for a specific app in a tenant (Preview)](../develop/saml-claims-customization.md).

Keep in mind the following limitations when mapping attributes:

* Not all attributes that can be issued in AD FS show up in Microsoft Entra ID as attributes to emit to SAML tokens, even if those attributes are synced. When you edit the attribute, the **Value** dropdown list shows you the different attributes that are available in Microsoft Entra ID. Check [Microsoft Entra Connect Sync articles](../hybrid/connect/how-to-connect-sync-whatis.md) configuration to ensure that a required attribute—for example, **samAccountName**—is synced to Microsoft Entra ID. You can use the extension attributes to emit any claim that isn't part of the standard user schema in Microsoft Entra ID.
* In the most common scenarios, only the **NameID** claim and other common user identifier claims are required for an app. To determine if any extra claims are required, examine what claims you're issuing from AD FS.
* Not all claims can be issued, as some claims are protected in Microsoft Entra ID.
* The ability to use encrypted SAML tokens is now in preview. See [How to: customize claims issued in the SAML token for enterprise applications](../develop/saml-claims-customization.md).

## Software as a service (SaaS) apps

If your users sign in to SaaS apps such as Salesforce, ServiceNow, or Workday, and are integrated with AD FS, you're using federated sign-on for SaaS apps.

Most SaaS applications can be configured in Microsoft Entra ID. Microsoft has many preconfigured connections to SaaS apps in the  [Microsoft Entra app gallery](https://azuremarketplace.microsoft.com/marketplace/apps/category/azure-active-directory-apps), which makes your transition easier. SAML 2.0 applications can be integrated with Microsoft Entra ID via the Microsoft Entra app gallery or as [non-gallery applications](add-application-portal.md).

Apps that use OAuth 2.0 or OpenID Connect can be similarly integrated with Microsoft Entra ID as [app registrations](../develop/quickstart-register-app.md). Apps that use legacy protocols can use [Microsoft Entra application proxy](../app-proxy/application-proxy.md) to authenticate with Microsoft Entra ID.

For any issues with onboarding your SaaS apps, you can contact the [SaaS Application Integration support alias](mailto:SaaSApplicationIntegrations@service.microsoft.com).

## SAML signing certificates for SSO

Signing certificates are an important part of any SSO deployment. Microsoft Entra ID creates the signing certificates to establish SAML-based federated SSO to your SaaS applications. Once you add either gallery or non-gallery applications, you'll configure the added application using the federated SSO option. See [Manage certificates for federated single sign-on in Microsoft Entra ID](./tutorial-manage-certificates-for-federated-single-sign-on.md).

## SAML token encryption

Both AD FS and Microsoft Entra ID provide token encryption—the ability to encrypt the SAML security assertions that go to applications. The assertions are encrypted with a public key, and decrypted by the receiving application with the matching private key. When you configure token encryption, you upload X.509 certificate files to provide the public keys.

For information about Microsoft Entra SAML token encryption and how to configure it, see [How to: Configure Microsoft Entra SAML token encryption](howto-saml-token-encryption.md).

> [!NOTE]
> Token encryption is a Microsoft Entra ID P1 or P2 feature. To learn more about Microsoft Entra editions, features, and pricing, see [Microsoft Entra pricing](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).

## SAML request signature verification

This functionality validates the signature of signed authentication requests. An App Admin enables and disables the enforcement of signed requests and uploads the public keys that should be used to do the validation. For more information, see [How to enforce signed SAML authentication requests](howto-enforce-signed-saml-authentication.md).

## Custom claims providers (preview)

To migrate data from legacy systems such as ADFS, or data stores such as LDAP, your apps are dependent on certain data in the tokens. You can use custom claims providers to add claims into the token. For more information, see [Custom claims provider overview](../develop/custom-claims-provider-overview.md).

## Apps and configurations that can be moved today

Apps that you can move easily today include SAML 2.0 apps that use the standard set of configuration elements and claims. These standard items are:

* User Principal Name
* Email address
* Given name
* Surname
* Alternate attribute as SAML **NameID**, including the Microsoft Entra ID mail attribute, mail prefix, employee ID, extension attributes 1-15, or on-premises **SamAccountName** attribute. For more information, see [Editing the NameIdentifier claim](../develop/saml-claims-customization.md).
* Custom claims.

The following require more configuration steps to migrate to Microsoft Entra ID:

* Custom authorization or multi-factor authentication (MFA) rules in AD FS. You configure them using the [Microsoft Entra Conditional Access](../conditional-access/overview.md) feature.
* Apps with multiple Reply URL endpoints. You configure them in Microsoft Entra ID using PowerShell or the Microsoft Entra admin center interface.
* WS-Federation apps such as SharePoint apps that require SAML version 1.1 tokens. You can configure them manually using PowerShell. You can also add a preintegrated generic template for SharePoint and SAML 1.1 applications from the gallery. We support the SAML 2.0 protocol.
* Complex claims issuance transforms rules. For information about supported claims mappings, see:
  * [Claims mapping in Microsoft Entra ID](../develop/saml-claims-customization.md).
  * [Customizing claims issued in the SAML token for enterprise applications in Microsoft Entra ID](../develop/saml-claims-customization.md).

<a name='apps-and-configurations-not-supported-in-azure-ad-today'></a>

## Apps and configurations not supported in Microsoft Entra today

Apps that require certain capabilities can't be migrated today.

### Protocol capabilities

Apps that require the following protocol capabilities can't be migrated today:

* Support for the WS-Trust ActAs pattern
* SAML artifact resolution

<a name='map-app-settings-from-ad-fs-to-azure-ad'></a>

## Map app settings from AD FS to Microsoft Entra ID

Migration requires assessing how the application is configured on-premises, and then mapping that configuration to Microsoft Entra ID. AD FS and Microsoft Entra ID work similarly, so the concepts of configuring trust, sign-on and sign-out URLs, and identifiers apply in both cases. Document the AD FS configuration settings of your applications so that you can easily configure them in Microsoft Entra ID.

### Map app configuration settings

The following table describes some of the most common mapping of settings between an AD FS Relying Party Trust to Microsoft Entra Enterprise Application:

* AD FS—Find the setting in the AD FS Relying Party Trust for the app. Right-click the relying party and select Properties.
* Microsoft Entra ID—The setting is configured within [Microsoft Entra admin center](https://entra.microsoft.com/#home) in each application's SSO properties.

| Configuration setting| AD FS| How to configure in Microsoft Entra ID| SAML Token |
| - | - | - | - |
| **App sign-on URL** <p> The URL for the user to sign in to the app in a SAML flow initiated by a Service Provider (SP).| N/A| Open Basic SAML Configuration from SAML based sign-on| N/A |
| **App reply URL** <p> The URL of the app from the perspective of the identity provider (IdP). The IdP sends the user and token here after the user has signed in to the IdP. This is also known as **SAML assertion consumer endpoint**.| Select the **Endpoints** tab| Open Basic SAML Configuration from SAML based sign-on| Destination element in the SAML token. Example value: `https://contoso.my.salesforce.com` |
| **App sign-out URL** <p> This is the URL to which sign-out cleanup requests are sent when a user signs out from an app. The IdP sends the request to sign out the user from all other apps as well.| Select the **Endpoints** tab| Open Basic SAML Configuration from SAML based sign-on| N/A |
| **App identifier** <p> This is the app identifier from the IdP's perspective. The sign-on URL value is often used for the identifier (but not always). Sometimes the app calls this the *entity ID.* | Select the **Identifiers** tab|Open Basic SAML Configuration from SAML based sign-on| Maps to the **Audience** element in the SAML token. |
| **App federation metadata** <p> This is the location of the app's federation metadata. The IdP uses it to automatically update specific configuration settings, such as endpoints or encryption certificates.| Select the **Monitoring** tab| N/A. Microsoft Entra ID doesn't support consuming application federation metadata directly. You can manually import the federation metadata.| N/A |
| **User Identifier/ Name ID** <p> Attribute that is used to uniquely indicate the user identity from Microsoft Entra ID or AD FS to your app. This attribute is typically either the UPN or the email address of the user.| Claim rules. In most cases, the claim rule issues a claim with a type that ends with the **NameIdentifier**.| You can find the identifier under the header **User Attributes and Claims**. By default, the UPN is used| Maps to the **NameID** element in the SAML token. |
| **Other claims** <p> Examples of other claim information that is commonly sent from the IdP to the app include first name, last name, email address, and group membership.| In AD FS, you can find this as other claim rules on the relying party.| You can find the identifier under the header **User Attributes & Claims**. Select **View** and edit all other user attributes.| N/A |

### Map Identity Provider (IdP) settings

Configure your applications to point to Microsoft Entra ID versus AD FS for SSO. Here, we're focusing on SaaS apps that use the SAML protocol. However, this concept extends to custom line-of-business apps as well.

> [!NOTE]
> The configuration values for Microsoft Entra ID follows the pattern where your Azure Tenant ID replaces `{tenant-id}` and the Application ID replaces {application-id}. You find this information in the [Microsoft Entra admin center](https://entra.microsoft.com/#home) under **Microsoft Entra ID > Properties**:

* Select Directory ID to see your Tenant ID.
* Select Application ID to see your Application ID.

 At a high-level, map the following key SaaS apps configuration elements to Microsoft Entra ID.

| Element| Configuration Value |
| - | - |
| Identity provider issuer| `https://sts.windows.net/{tenant-id}/` |
| Identity provider sign-in URL| `https://login.microsoftonline.com/{tenant-id}/saml2` |
| Identity provider sign-out URL| `https://login.microsoftonline.com/{tenant-id}/saml2` |
| Federation metadata location| `https://login.windows.net/{tenant-id}/federationmetadata/2007-06/federationmetadata.xml?appid={application-id}` |

## Map SSO settings for SaaS apps

SaaS apps need to know where to send authentication requests and how to validate the received tokens. The following table describes the elements to configure SSO settings in the app, and their values or locations within AD FS and Microsoft Entra ID.

| Configuration setting| AD FS| How to configure in Microsoft Entra ID |
| - | - | - |
| **IdP Sign-on URL** <p> Sign-on URL of the IdP from the app's perspective (where the user is redirected for sign-in).| The AD FS sign-on URL is the AD FS federation service name followed by `/adfs/ls/`. <p> For example: `https://fs.contoso.com/adfs/ls/`| Replace `{tenant-id}` with your tenant ID. <p> For apps that use the SAML-P protocol: `https://login.microsoftonline.com/{tenant-id}/saml2` <p> For apps that use the WS-Federation protocol: `https://login.microsoftonline.com/{tenant-id}/wsfed` |
| **IdP sign-out URL** <p> Sign-out URL of the IdP from the app's perspective (where the user is redirected when they choose to sign out of the app).| The sign-out URL is either the same as the sign-on URL, or the same URL with `wa=wsignout1.0` appended. For example: `https://fs.contoso.com/adfs/ls/?wa=wsignout1.0`| Replace `{tenant-id}` with your tenant ID. <p> For apps that use the SAML-P protocol: <p> `https://login.microsoftonline.com/{tenant-id}/saml2` <p> For apps that use the WS-Federation protocol: `https://login.microsoftonline.com/common/wsfederation?wa=wsignout1.0` |
| **Token signing certificate** <p> The IdP uses the private key of the certificate to sign issued tokens. It verifies that the token came from the same IdP that the app is configured to trust.| Find the AD FS token signing certificate in AD FS Management under **Certificates**.| Find it in the Microsoft Entra admin center in the application's **Single sign-on properties** under the header **SAML Signing Certificate**. There, you can download the certificate for upload to the app. <p> If the application has more than one certificate, you can find all certificates in the federation metadata XML file. |
| **Identifier/ "issuer"** <p> Identifier of the IdP from the app's perspective (sometimes called the "issuer ID"). <p> In the SAML token, the value appears as the Issuer element.| The identifier for AD FS is usually the federation service identifier in AD FS Management under **Service > Edit Federation Service Properties**. For example: `http://fs.contoso.com/adfs/services/trust`| Replace `{tenant-id}` with your tenant ID. <p> `https://sts.windows.net/{tenant-id}/` |
| **IdP federation metadata** <p> Location of the IdP's publicly available federation metadata. (Some apps use federation metadata as an alternative to the administrator configuring URLs, identifier, and token signing certificate individually.)| Find the AD FS federation metadata URL in AD FS Management under **Service > Endpoints > Metadata > Type: Federation Metadata**. For example: `https://fs.contoso.com/FederationMetadata/2007-06/FederationMetadata.xml`| The corresponding value for Microsoft Entra ID follows the pattern `https://login.microsoftonline.com/{TenantDomainName}/FederationMetadata/2007-06/FederationMetadata.xml`. Replace {TenantDomainName} with your tenant's name in the format `contoso.onmicrosoft.com`. <p> For more information, see [Federation metadata](../develop/federation-metadata.md). |

## Next steps

- [Represent AD FS security policies in Microsoft Entra ID](migrate-adfs-represent-security-policies.md).
