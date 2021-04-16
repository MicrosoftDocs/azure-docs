---
title: Moving application authentication from AD FS to Azure Active Directory
description: Learn how to use Azure Active Directory to replace Active Directory Federation Services (AD FS), giving users single sign-on to all their applications.
services: active-directory
author: iantheninja
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 03/01/2021
ms.author: iangithinji
ms.reviewer: baselden
---

# Moving application authentication from Active Directory Federation Services to Azure Active Directory

[Azure Active Directory (Azure AD)](../fundamentals/active-directory-whatis.md) offers a universal identity platform that provides your people, partners, and customers a single identity to access applications and collaborate from any platform and device. Azure AD has a [full suite of identity management capabilities](../fundamentals/active-directory-whatis.md). Standardizing your application authentication and authorization to Azure AD provides these benefits.

> [!TIP]
> This article is written for a developer audience. Project managers and administrators planning to move an application to Azure AD should consider reading [Migrating application authentication to Azure AD](migrate-application-authentication-to-azure-active-directory.md).

## Azure AD benefits

If you have an on-premises directory that contains user accounts, you likely have many applications to which users authenticate. Each of these apps is configured for users to access using their identities.

Users may also authenticate directly with your on-premises Active Directory. Active Directory Federation Services (AD FS) is a standards-based on-premises identity service. It extends the ability to use single sign-on (SSO) functionality between trusted business partners so that users aren't required to sign in separately to each application. This is known as federated identity.

Many organizations have Software as a Service (SaaS) or custom line-of-business apps federated directly to AD FS, alongside Microsoft 365 and Azure AD-based apps.

  ![Applications connected directly on-premises](media/migrate-adfs-apps-to-azure/app-integration-before-migration-1.png)

> [!Important]
> To increase application security, your goal is to have a single set of access controls and policies across your on-premises and cloud environments.

  ![Applications connected through Azure AD](media/migrate-adfs-apps-to-azure/app-integration-after-migration-1.png)

## Types of apps to migrate

Migrating all your application authentication to Azure AD is optimal, as it gives you a single control plane for identity and access management.

Your applications may use modern or legacy protocols for authentication. When you plan your migration to Azure AD, consider migrating the apps that use modern authentication protocols (such as SAML and Open ID Connect) first. These apps can be reconfigured to authenticate with Azure AD either via a built-in connector from the Azure App Gallery, or by registering the application in Azure AD. Apps that use older protocols can be integrated using Application Proxy.

For more information, see:

* [Using Azure AD Application Proxy to publish on-premises apps for remote users](what-is-application-proxy.md).
* [What is application management?](what-is-application-management.md)
* [AD FS application activity report to migrate applications to Azure AD](migrate-adfs-application-activity.md).
* [Monitor AD FS using Azure AD Connect Health](../hybrid/how-to-connect-health-adfs.md).

### The migration process

During the process of moving your app authentication to Azure AD, test your apps and configuration. We recommend that you continue to use existing test environments for migration testing when you move to the production environment. If a test environment isn't currently available, you can set one up using [Azure App Service](https://azure.microsoft.com/services/app-service/) or [Azure Virtual Machines](https://azure.microsoft.com/free/virtual-machines/search/?OCID=AID2000128_SEM_lHAVAxZC&MarinID=lHAVAxZC_79233574796345_azure%20virtual%20machines_be_c__1267736956991399_kwd-79233582895903%3Aloc-190&lnkd=Bing_Azure_Brand&msclkid=df6ac75ba7b612854c4299397f6ab5b0&ef_id=XmAptQAAAJXRb3S4%3A20200306231230%3As&dclid=CjkKEQiAhojzBRDg5ZfomsvdiaABEiQABCU7XjfdCUtsl-Abe1RAtAT35kOyI5YKzpxRD6eJS2NM97zw_wcB), depending on the architecture of the application.

You may choose to set up a separate test Azure AD tenant on which to develop your app configurations.

Your migration process may look like this:

#### Stage 1 – Current state: The production app authenticates with AD FS

  ![Migration stage 1 ](media/migrate-adfs-apps-to-azure/stage1.jpg)

#### Stage 2 – (Optional) Point a test instance of the app to the test Azure AD tenant

Update the configuration to point your test instance of the app to a test Azure AD tenant, and make any required changes. The app can be tested with users in the test Azure AD tenant. During the development process, you can use tools such as [Fiddler](https://www.telerik.com/fiddler) to compare and verify requests and responses.

If it isn't feasible to set up a separate test tenant, skip this stage and point a test instance of the app to your production Azure AD tenant as described in Stage 3 below.

  ![Migration stage 2 ](media/migrate-adfs-apps-to-azure/stage2.jpg)

#### Stage 3 – Point a test instance of the app to the production Azure AD tenant

Update the configuration to point your test instance of the app to your production Azure AD tenant. You can now test with users in your production tenant. If necessary, review the section of this article on transitioning users.

  ![Migration stage 3 ](media/migrate-adfs-apps-to-azure/stage3.jpg)

#### Stage 4 – Point the production app to the production Azure AD tenant

Update the configuration of your production app to point to your production Azure AD tenant.

  ![Migration stage 4 ](media/migrate-adfs-apps-to-azure/stage4.jpg)

 Apps that authenticate with AD FS can use Active Directory groups for permissions. Use [Azure AD Connect sync](../hybrid/how-to-connect-sync-whatis.md) to sync identity data between your on-premises environment and Azure AD before you begin migration. Verify those groups and membership before migration so that you can grant access to the same users when the application is migrated.

### Line of business apps

Your line-of-business apps are those that your organization developed or those that are a standard packaged product. Examples include apps built on Windows Identity Foundation and SharePoint apps (not SharePoint Online).

Line-of-business apps that use OAuth 2.0, OpenID Connect, or WS-Federation can be integrated with Azure AD as [app registrations](../develop/quickstart-register-app.md). Integrate custom apps that use SAML 2.0 or WS-Federation as [non-gallery applications](add-application-portal.md) on the enterprise applications page in the [Azure portal](https://portal.azure.com/).

## SAML-based single sign-on

Apps that use SAML 2.0 for authentication can be configured for [SAML-based single sign-on](what-is-single-sign-on.md) (SSO). With SAML-based SSO, you can map users to specific application roles based on rules that you define in your SAML claims.

To configure a SaaS application for SAML-based SSO, see [Quickstart: Set up SAML-based single sign-on](add-application-portal-setup-sso.md).

  ![SSO SAML User Screenshots ](media/migrate-adfs-apps-to-azure/sso-saml-user-attributes-claims.png)

Many SaaS applications have an [application-specific tutorial](../saas-apps/tutorial-list.md) that steps you through the configuration for SAML-based SSO.

  ![app tutorial](media/migrate-adfs-apps-to-azure/app-tutorial.png)

Some apps can be migrated easily. Apps with more complex requirements, such as custom claims, may require additional configuration in Azure AD and/or Azure AD Connect. For information about supported claims mappings, see [How to: Customize claims emitted in tokens for a specific app in a tenant (Preview)](../develop/active-directory-claims-mapping.md).

Keep in mind the following limitations when mapping attributes:

* Not all attributes that can be issued in AD FS show up in Azure AD as attributes to emit to SAML tokens, even if those attributes are synced. When you edit the attribute, the **Value** dropdown list shows you the different attributes that are available in Azure AD. Check [Azure AD Connect sync topics](../hybrid/how-to-connect-sync-whatis.md) configuration to ensure that a required attribute—for example, **samAccountName**—is synced to Azure AD. You can use the extension attributes to emit any claim that isn't part of the standard user schema in Azure AD.
* In the most common scenarios, only the **NameID** claim and other common user identifier claims are required for an app. To determine if any additional claims are required, examine what claims you're issuing from AD FS.
* Not all claims can be issued, as some claims are protected in Azure AD.
* The ability to use encrypted SAML tokens is now in preview. See [How to: customize claims issued in the SAML token for enterprise applications](../develop/active-directory-saml-claims-customization.md).

### Software as a service (SaaS) apps

If your users sign in to SaaS apps such as Salesforce, ServiceNow, or Workday, and are integrated with AD FS, you're using federated sign-on for SaaS apps.

Most SaaS applications can be configured in Azure AD. Microsoft has many preconfigured connections to SaaS apps in the  [Azure AD app gallery](https://azuremarketplace.microsoft.com/marketplace/apps/category/azure-active-directory-apps), which makes your transition easier. SAML 2.0 applications can be integrated with Azure AD via the Azure AD app gallery or as [non-gallery applications](add-application-portal.md).

Apps that use OAuth 2.0 or OpenID Connect can be similarly integrated with Azure AD as [app registrations](../develop/quickstart-register-app.md). Apps that use legacy protocols can use [Azure AD Application Proxy](application-proxy.md) to authenticate with Azure AD.

For any issues with onboarding your SaaS apps, you can contact the [SaaS Application Integration support alias](mailto:SaaSApplicationIntegrations@service.microsoft.com).

### SAML signing certificates for SSO

Signing certificates are an important part of any SSO deployment. Azure AD creates the signing certificates to establish SAML-based federated SSO to your SaaS applications. Once you add either gallery or non-gallery applications, you'll configure the added application using the federated SSO option. See [Manage certificates for federated single sign-on in Azure Active Directory](manage-certificates-for-federated-single-sign-on.md).

### SAML token encryption

Both AD FS and Azure AD provide token encryption—the ability to encrypt the SAML security assertions that go to applications. The assertions are encrypted with a public key, and decrypted by the receiving application with the matching private key. When you configure token encryption, you upload X.509 certificate files to provide the public keys.

For information about Azure AD SAML token encryption and how to configure it, see [How to: Configure Azure AD SAML token encryption](howto-saml-token-encryption.md).  

> [!NOTE]
> Token encryption is an Azure Active Directory (Azure AD) premium feature. To learn more about Azure AD editions, features, and pricing, see [Azure AD pricing](https://azure.microsoft.com/pricing/details/active-directory/).

### Apps and configurations that can be moved today

Apps that you can move easily today include SAML 2.0 apps that use the standard set of configuration elements and claims. These standard items are:

* User Principal Name
* Email address
* Given name
* Surname
* Alternate attribute as SAML **NameID**, including the Azure AD mail attribute, mail prefix, employee ID, extension attributes 1-15, or on-premises **SamAccountName** attribute. For more information, see [Editing the NameIdentifier claim](../develop/active-directory-saml-claims-customization.md).
* Custom claims.

The following require additional configuration steps to migrate to Azure AD:

* Custom authorization or multi-factor authentication (MFA) rules in AD FS. You configure them using the [Azure AD Conditional Access](../conditional-access/overview.md) feature.
* Apps with multiple Reply URL endpoints. You configure them in Azure AD using PowerShell or the Azure portal interface.
* WS-Federation apps such as SharePoint apps that require SAML version 1.1 tokens. You can configure them manually using PowerShell. You can also add a pre-integrated generic template for SharePoint and SAML 1.1 applications from the gallery. We support the SAML 2.0 protocol.
* Complex claims issuance transforms rules. For information about supported claims mappings, see:
   *  [Claims mapping in Azure Active Directory](../develop/active-directory-claims-mapping.md).
   * [Customizing claims issued in the SAML token for enterprise applications in Azure Active Directory](../develop/active-directory-saml-claims-customization.md).

### Apps and configurations not supported in Azure AD today

Apps that require certain capabilities can't be migrated today.

#### Protocol capabilities

Apps that require the following protocol capabilities can't be migrated today:

* Support for the WS-Trust ActAs pattern
* SAML artifact resolution
* Signature verification of signed SAML requests
‎
  > [!Note]
  > Signed requests are accepted, but the signature isn't verified.

  ‎Given that Azure AD only returns the token to endpoints preconfigured in the application, signature verification probably isn't required in most cases.

#### Claims in token capabilities

Apps that require the following claims in token capabilities can't be migrated today.

* Claims from attribute stores other than the Azure AD directory, unless that data is synced to Azure AD. For more information, see the [Azure AD synchronization API overview](/graph/api/resources/synchronization-overview).
* Issuance of directory multiple-value attributes. For example, we can't issue a multivalued claim for proxy addresses at this time.

## Map app settings from AD FS to Azure AD

Migration requires assessing how the application is configured on-premises, and then mapping that configuration to Azure AD. AD FS and Azure AD work similarly, so the concepts of configuring trust, sign-on and sign-out URLs, and identifiers apply in both cases. Document the AD FS configuration settings of your applications so that you can easily configure them in Azure AD.

### Map app configuration settings

The following table describes some of the most common mapping of settings between an AD FS Relying Party Trust to Azure AD Enterprise Application:

* AD FS—Find the setting in the AD FS Relying Party Trust for the app. Right-click the relying party and select Properties.
* Azure AD—The setting is configured within [Azure portal](https://portal.azure.com/) in each application's SSO properties.

| Configuration setting| AD FS| How to configure in Azure AD| SAML Token |
| - | - | - | - |
| **App sign-on URL** <p>The URL for the user to sign in to the app in a SAML flow initiated by a Service Provider (SP).| N/A| Open Basic SAML Configuration from SAML based sign-on| N/A |
| **App reply URL** <p>The URL of the app from the perspective of the identity provider (IdP). The IdP sends the user and token here after the user has signed in to the IdP.  ‎This is also known as **SAML assertion consumer endpoint**.| Select the **Endpoints** tab| Open Basic SAML Configuration from SAML based sign-on| Destination element in the SAML token. Example value: `https://contoso.my.salesforce.com` |
| **App sign-out URL** <p>This is the URL to which sign-out cleanup requests are sent when a user signs out from an app. The IdP sends the request to sign out the user from all other apps as well.| Select the **Endpoints** tab| Open Basic SAML Configuration from SAML based sign-on| N/A |
| **App identifier** <p>This is the app identifier from the IdP's perspective. The sign-on URL value is often used for the identifier (but not always).  ‎Sometimes the app calls this the "entity ID."| Select the **Identifiers** tab|Open Basic SAML Configuration from SAML based sign-on| Maps to the **Audience** element in the SAML token. |
| **App federation metadata** <p>This is the location of the app's federation metadata. The IdP uses it to automatically update specific configuration settings, such as endpoints or encryption certificates.| Select the **Monitoring** tab| N/A. Azure AD doesn't support consuming application federation metadata directly. You can manually import the federation metadata.| N/A |
| **User Identifier/ Name ID** <p>Attribute that is used to uniquely indicate the user identity from Azure AD or AD FS to your app.  ‎This attribute is typically either the UPN or the email address of the user.| Claim rules. In most cases, the claim rule issues a claim with a type that ends with the **NameIdentifier**.| You can find the identifier under the header **User Attributes and Claims**. By default, the UPN is used| Maps to the **NameID** element in the SAML token. |
| **Other claims** <p>Examples of other claim information that is commonly sent from the IdP to the app include first name, last name, email address, and group membership.| In AD FS, you can find this as other claim rules on the relying party.| You can find the identifier under the header **User Attributes & Claims**. Select **View** and edit all other user attributes.| N/A |

### Map Identity Provider (IdP) settings

Configure your applications to point to Azure AD versus AD FS for SSO. Here, we're focusing on SaaS apps that use the SAML protocol. However, this concept extends to custom line-of-business apps as well.

> [!NOTE]
> The configuration values for Azure AD follows the pattern where your Azure Tenant ID replaces {tenant-id} and the Application ID replaces {application-id}. You find this information in the [Azure portal](https://portal.azure.com/) under **Azure Active Directory > Properties**:

* Select Directory ID to see your Tenant ID.
* Select Application ID to see your Application ID.

 At a high-level, map the following key SaaS apps configuration elements to Azure AD.

| Element| Configuration Value |
| - | - |
| Identity provider issuer| https:\//sts.windows.net/{tenant-id}/ |
| Identity provider login URL| [https://login.microsoftonline.com/{tenant-id}/saml2](https://login.microsoftonline.com/{tenant-id}/saml2) |
| Identity provider logout URL| [https://login.microsoftonline.com/{tenant-id}/saml2](https://login.microsoftonline.com/{tenant-id}/saml2) |
| Federation metadata location| [https://login.windows.net/{tenant-id}/federationmetadata/2007-06/federationmetadata.xml?appid={application-id}](https://login.windows.net/{tenant-id}/federationmetadata/2007-06/federationmetadata.xml?appid={application-id}) |

### Map SSO settings for SaaS apps

SaaS apps need to know where to send authentication requests and how to validate the received tokens. The following table describes the elements to configure SSO settings in the app, and their values or locations within AD FS and Azure AD

| Configuration setting| AD FS| How to configure in Azure AD |
| - | - | - |
| **IdP Sign-on URL** <p>Sign-on URL of the IdP from the app's perspective (where the user is redirected for login).| The AD FS sign-on URL is the AD FS federation service name followed by "/adfs/ls/." <p>For example: `https://fs.contoso.com/adfs/ls/`| Replace {tenant-id} with your tenant ID. <p> ‎For apps that use the SAML-P protocol: [https://login.microsoftonline.com/{tenant-id}/saml2](https://login.microsoftonline.com/{tenant-id}/saml2) <p>‎For apps that use the WS-Federation protocol: [https://login.microsoftonline.com/{tenant-id}/wsfed](https://login.microsoftonline.com/{tenant-id}/wsfed) |
| **IdP sign-out URL**<p>Sign-out URL of the IdP from the app's perspective (where the user is redirected when they choose to sign out of the app).| The sign-out URL is either the same as the sign-on URL, or the same URL with "wa=wsignout1.0" appended. For example: `https://fs.contoso.com/adfs/ls/?wa=wsignout1.0`| Replace {tenant-id} with your tenant ID.<p>For apps that use the SAML-P protocol:<p>[https://login.microsoftonline.com/{tenant-id}/saml2](https://login.microsoftonline.com/{tenant-id}/saml2) <p> ‎For apps that use the WS-Federation protocol: [https://login.microsoftonline.com/common/wsfederation?wa=wsignout1.0](https://login.microsoftonline.com/common/wsfederation?wa=wsignout1.0) |
| **Token signing certificate**<p>The IdP uses the private key of the certificate to sign issued tokens. It verifies that the token came from the same IdP that the app is configured to trust.| Find the AD FS token signing certificate in AD FS Management under **Certificates**.| Find it in the Azure portal in the application's **Single sign-on properties** under the header **SAML Signing Certificate**. There, you can download the certificate for upload to the app.  <p>‎If the application has more than one certificate, you can find all certificates in the federation metadata XML file. |
| **Identifier/ "issuer"**<p>Identifier of the IdP from the app's perspective (sometimes called the "issuer ID").<p>‎In the SAML token, the value appears as the Issuer element.| The identifier for AD FS is usually the federation service identifier in AD FS Management under **Service > Edit Federation Service Properties**. For example: `http://fs.contoso.com/adfs/services/trust`| Replace {tenant-id} with your tenant ID.<p>https:\//sts.windows.net/{tenant-id}/ |
| **IdP federation metadata**<p>Location of the IdP's publicly available federation metadata. (Some apps use federation metadata as an alternative to the administrator configuring URLs, identifier, and token signing certificate individually.)| Find the AD FS federation metadata URL in AD FS Management under **Service > Endpoints > Metadata > Type: Federation Metadata**. For example: `https://fs.contoso.com/FederationMetadata/2007-06/FederationMetadata.xml`| The corresponding value for Azure AD follows the pattern [https://login.microsoftonline.com/{TenantDomainName}/FederationMetadata/2007-06/FederationMetadata.xml](https://login.microsoftonline.com/{TenantDomainName}/FederationMetadata/2007-06/FederationMetadata.xml). Replace {TenantDomainName} with your tenant's name in the format "contoso.onmicrosoft.com."   <p>For more information, see [Federation metadata](../azuread-dev/azure-ad-federation-metadata.md). |

## Represent AD FS security policies in Azure AD

When moving your app authentication to Azure AD, create mappings from existing security policies to their equivalent or alternative variants available in Azure AD. Ensuring that these mappings can be done while meeting security standards required by your app owners makes the rest of the app migration significantly easier.

For each rule example, we show what the rule looks like in AD FS, the AD FS rule language equivalent code, and how this maps to Azure AD.

### Map authorization rules

The following are examples of various types of authorization rules in AD FS, and how you map them to Azure AD.

#### Example 1: Permit access to all users

Permit Access to All Users in AD FS:

  ![Screenshot shows the Set up Single Sign-On with SAML dialog box.](media/migrate-adfs-apps-to-azure/permit-access-to-all-users-1.png)

This maps to Azure AD in one of the following ways:

1. Set **User assignment required** to **No**.

    ![edit access control policy for SaaS apps ](media/migrate-adfs-apps-to-azure/permit-access-to-all-users-2.png)

    > [!Note]
    > Setting **User assignment required** to **Yes** requires that users are assigned to the application to gain access. When set to **No**, all users have access. This switch doesn't control what users see in the **My Apps** experience.

1. In the **Users and groups tab**, assign your application to the **All Users** automatic group. You must [enable Dynamic Groups](../enterprise-users/groups-create-rule.md) in your Azure AD tenant for the default **All Users** group to be available.

    ![My SaaS Apps in Azure AD ](media/migrate-adfs-apps-to-azure/permit-access-to-all-users-3.png)

#### Example 2: Allow a group explicitly

Explicit group authorization in AD FS:

  ![Screenshot shows the Edit Rule dialog box for the Allow domain admins Claim rule.](media/migrate-adfs-apps-to-azure/allow-a-group-explicitly-1.png)

To map this rule to Azure AD:

1. In the [Azure portal](https://portal.azure.com/), [create a user group](../fundamentals/active-directory-groups-create-azure-portal.md) that corresponds to the group of users from AD FS.
1. Assign app permissions to the group:

    ![Add Assignment ](media/migrate-adfs-apps-to-azure/allow-a-group-explicitly-2.png)

#### Example 3: Authorize a specific user

Explicit user authorization in AD FS:

  ![Screenshot shows the Edit Rule dialog box for the Allow a specific user Claim rule with an Incoming claim type of Primary S I D.](media/migrate-adfs-apps-to-azure/authorize-a-specific-user-1.png)

To map this rule to Azure AD:

* In the [Azure portal](https://portal.azure.com/), add a user to the app through the Add Assignment tab of the app as shown below:

    ![My SaaS apps in Azure ](media/migrate-adfs-apps-to-azure/authorize-a-specific-user-2.png)

### Map multi-factor authentication rules

An on-premises deployment of [Multi-Factor Authentication (MFA)](../authentication/concept-mfa-howitworks.md) and AD FS still works after the migration because you are federated with AD FS. However, consider migrating to Azure's built-in MFA capabilities that are tied into Azure AD's Conditional Access workflows.

The following are examples of types of MFA rules in AD FS, and how you can map them to Azure AD based on different conditions.

MFA rule settings in AD FS:

  ![Screenshot shows Conditions for Azure A D in the Azure portal.](media/migrate-adfs-apps-to-azure/mfa-settings-common-for-all-examples.png)

#### Example 1: Enforce MFA based on users/groups

The users/groups selector is a rule that allows you to enforce MFA on a per-group (Group SID) or per-user (Primary SID) basis. Apart from the users/groups assignments, all additional checkboxes in the AD FS MFA configuration UI function as additional rules that are evaluated after the users/groups rule is enforced.

Specify MFA rules for a user or a group in Azure AD:

1. Create a [new conditional access policy](../authentication/tutorial-enable-azure-mfa.md?bc=%2fazure%2factive-directory%2fconditional-access%2fbreadcrumb%2ftoc.json&toc=%2fazure%2factive-directory%2fconditional-access%2ftoc.json).
1. Select **Assignments**. Add the user(s) or group(s) for which you want to enforce MFA.
1. Configure the **Access controls** options as shown below:

    ‎![Screenshot shows the Grant pane where you can grant access.](media/migrate-adfs-apps-to-azure/mfa-users-groups.png)

 #### Example 2: Enforce MFA for unregistered devices

Specify MFA rules for unregistered devices in Azure AD:

1. Create a [new conditional access policy](../authentication/tutorial-enable-azure-mfa.md?bc=%2fazure%2factive-directory%2fconditional-access%2fbreadcrumb%2ftoc.json&toc=%2fazure%2factive-directory%2fconditional-access%2ftoc.json).
1. Set the **Assignments** to **All users**.
1. Configure the **Access controls** options as shown below:

    ![Screenshot shows the Grant pane where you can grant access and specify other restrictions.](media/migrate-adfs-apps-to-azure/mfa-unregistered-devices.png)

When you set the **For multiple controls** option to **Require one of the selected controls**, it means that if any one of the conditions specified by the checkbox are met by the user, the user is granted access to your app.

#### Example 3: Enforce MFA based on location

Specify MFA rules based on a user's location in Azure AD:

1. Create a [new conditional access policy](../authentication/tutorial-enable-azure-mfa.md?bc=%2fazure%2factive-directory%2fconditional-access%2fbreadcrumb%2ftoc.json&toc=%2fazure%2factive-directory%2fconditional-access%2ftoc.json).
1. Set the **Assignments** to **All users**.
1. [Configure named locations in Azure AD](../reports-monitoring/quickstart-configure-named-locations.md). Otherwise, federation from inside your corporate network is trusted.
1. Configure the **Conditions rules** to specify the locations for which you would like to enforce MFA.

    ![Screenshot shows the Locations pane for Conditions rules.](media/migrate-adfs-apps-to-azure/mfa-location-1.png)

1. Configure the **Access controls** options as shown below:

    ![Map access control policies](media/migrate-adfs-apps-to-azure/mfa-location-2.png)

### Map Emit attributes as Claims rule

Emit attributes as Claims rule in AD FS:

  ![Screenshot shows the Edit Rule dialog box for Emit attributes as Claims.](media/migrate-adfs-apps-to-azure/map-emit-attributes-as-claims-rule-1.png)

To map the rule to Azure AD:

1. In the [Azure portal](https://portal.azure.com/), select **Enterprise Applications** and then **Single sign-on** to view the SAML-based sign-on configuration:

    ![Screenshot shows the Single sign-on page for your Enterprise Application.](media/migrate-adfs-apps-to-azure/map-emit-attributes-as-claims-rule-2.png)

1. Select **Edit** (highlighted) to modify the attributes:

    ![This is the page to edit User Attributes and Claims](media/migrate-adfs-apps-to-azure/map-emit-attributes-as-claims-rule-3.png)

### Map built-In access control policies

Built-in access control policies in AD FS 2016:

  ![Azure AD built in access control](media/migrate-adfs-apps-to-azure/map-built-in-access-control-policies-1.png)

To implement built-in policies in Azure AD, use a [new conditional access policy](../authentication/tutorial-enable-azure-mfa.md?bc=%2fazure%2factive-directory%2fconditional-access%2fbreadcrumb%2ftoc.json&toc=%2fazure%2factive-directory%2fconditional-access%2ftoc.json) and configure the access controls, or use the custom policy designer in AD FS 2016 to configure access control policies. The Rule Editor has an exhaustive list of Permit and Except options that can help you make all kinds of permutations.

  ![Azure AD access control policies](media/migrate-adfs-apps-to-azure/map-built-in-access-control-policies-2.png)

In this table, we've listed some useful Permit and Except options and how they map to Azure AD.

| Option | How to configure Permit option in Azure AD?| How to configure Except option in Azure AD? |
| - | - | - |
| From specific network| Maps to [Named Location](../reports-monitoring/quickstart-configure-named-locations.md) in Azure AD| Use the **Exclude** option for [trusted locations](../conditional-access/location-condition.md) |
| From specific groups| [Set a User/Groups Assignment](assign-user-or-group-access-portal.md)| Use the **Exclude** option in Users and Groups |
| From Devices with Specific Trust Level| Set this from the **Device State** control under Assignments -> Conditions| Use the **Exclude** option under Device State Condition and Include **All devices** |
| With Specific Claims in the Request| This setting can't be migrated| This setting can't be migrated |

Here's an example of how to configure the Exclude option for trusted locations in the Azure portal:

  ![Screenshot of mapping access control policies](media/migrate-adfs-apps-to-azure/map-built-in-access-control-policies-3.png)

## Transition users from AD FS to Azure AD

### Sync AD FS groups in Azure AD

When you map authorization rules, apps that authenticate with AD FS may use Active Directory groups for permissions. In such a case, use [Azure AD Connect](https://go.microsoft.com/fwlink/?LinkId=615771) to sync these groups with Azure AD before migrating the applications. Make sure that you verify those groups and membership before migration so that you can grant access to the same users when the application is migrated.

For more information, see [Prerequisites for using Group attributes synchronized from Active Directory](../hybrid/how-to-connect-fed-group-claims.md).

### Set up user self-provisioning

Some SaaS applications support the ability to self-provision users when they first sign in to the application. In Azure AD, app provisioning refers to automatically creating user identities and roles in the cloud ([SaaS](https://azure.microsoft.com/overview/what-is-saas/)) applications that users need to access. Users that are migrated already have an account in the SaaS application. Any new users added after the migration need to be provisioned. Test [SaaS app provisioning](../app-provisioning/user-provisioning.md) once the application is migrated.

### Sync external users in Azure AD

Your existing external users can be set up in these two ways in AD FS:

* **External users with a local account within your organization**—You continue to use these accounts in the same way that your internal user accounts work. These external user accounts have a principle name within your organization, although the account's email may point externally. As you progress with your migration, you can take advantage of the benefits that [Azure AD B2B](../external-identities/what-is-b2b.md) offers by migrating these users to use their own corporate identity when such an identity is available. This streamlines the process of signing in for those users, as they're often signed in with their own corporate logon. Your organization's administration is easier as well, by not having to manage accounts for external users.
* **Federated external Identities**—If you are currently federating with an external organization, you have a few approaches to take:
  * [Add Azure Active Directory B2B collaboration users in the Azure portal](../external-identities/add-users-administrator.md). You can proactively send B2B collaboration invitations from the Azure AD administrative portal to the partner organization for individual members to continue using the apps and assets they're used to.
  * [Create a self-service B2B sign-up workflow](../external-identities/self-service-portal.md) that generates a request for individual users at your partner organization using the B2B invitation API.

No matter how your existing external users are configured, they likely have permissions that are associated with their account, either in group membership or specific permissions. Evaluate whether these permissions need to be migrated or cleaned up. Accounts within your organization that represent an external user need to be disabled once the user has been migrated to an external identity. The migration process should be discussed with your business partners, as there may be an interruption in their ability to connect to your resources.

## Migrate and test your apps

Follow the migration process detailed in this article. Then go to the [Azure portal](https://aad.portal.azure.com/) to test if the migration was a success.

Follow these instructions:

1. Select **Enterprise Applications** > **All applications** and find your app from the list.
1. Select **Manage** > **Users and groups** to assign at least one user or group to the app.
1. Select **Manage** > **Conditional Access**. Review your list of policies and ensure that you are not blocking access to the application with a [conditional access policy](../conditional-access/overview.md).

Depending on how you configure your app, verify that SSO works properly.

| Authentication type| Testing |
| :- | :- |
| OAuth / OpenID Connect| Select **Enterprise applications > Permissions** and ensure you have consented to the application in the user settings for your app.|
| SAML-based SSO | Use the [Test SAML Settings](debug-saml-sso-issues.md) button found under **Single Sign-On**. |
| Password-Based SSO |  Download and install the [MyApps Secure Sign](../user-help/my-apps-portal-end-user-access.md)[-](../user-help/my-apps-portal-end-user-access.md)[in Extension](../user-help/my-apps-portal-end-user-access.md). This extension helps you start any of your organization's cloud apps that require you to use an SSO process. |
| Application Proxy | Ensure your connector is running and assigned to your application. Visit the [Application Proxy troubleshooting guide](application-proxy-troubleshoot.md) for further assistance. |

> [!NOTE]
> Cookies from the old AD FS environment persist on the user machines. These cookies might cause problems with the migration, as users could be directed to the old AD FS login environment versus the new Azure AD login. You may need to clear the user browser cookies manually or using a script. You can also use the System Center Configuration Manager or a similar platform.

### Troubleshoot

If there are any errors from the test of the migrated applications, troubleshooting may be the first step before falling back to the existing AD FS Relying Parties. See [How to debug SAML-based single sign-on to applications in Azure Active Directory](debug-saml-sso-issues.md).

### Rollback migration

If the migration fails, we recommend that you leave the existing Relying Parties on the AD FS servers and remove access to the Relying Parties. This allows for a quick fallback if needed during the deployment.

### Employee communication

While the planned outage window itself can be minimal, you should still plan on communicating these timeframes proactively to employees while switching from AD FS to Azure AD. Ensure that your app experience has a feedback button, or pointers to your helpdesk for issues.

Once deployment is complete, you can inform users of the successful deployment and remind them of any steps that they need to take.

* Instruct users to use [My Apps](https://myapps.microsoft.com) to access all the migrated applications.
* Remind users they might need to update their MFA settings.
* If Self-Service Password Reset is deployed, users might need to update or verify their authentication methods. See [MFA](https://aka.ms/mfatemplates) and [SSPR](https://aka.ms/ssprtemplates) end-user communication templates.

### External user communication

This group of users is usually the most critically impacted in case of issues. This is especially true if your security posture dictates a different set of Conditional Access rules or risk profiles for external partners. Ensure that external partners are aware of the cloud migration schedule and have a timeframe during which they are encouraged to participate in a pilot deployment that tests out all flows unique to external collaboration. Finally, ensure they have a way to access your helpdesk in case there are problems.

## Next steps

* Read  [Migrating application authentication to Azure AD](https://aka.ms/migrateapps/whitepaper).
* Set up [Conditional Access](../conditional-access/overview.md) and [MFA](../authentication/concept-mfa-howitworks.md).
* Try a step-wise code sample:[AD FS to Azure AD application migration playbook for developers](https://aka.ms/adfsplaybook).
