---
title: Configure F5 BIG-IP Easy Button for SSO to Oracle PeopleSoft
description: Learn to implement SHA with header-based SSO to Oracle PeopleSoft using F5’s BIG-IP Easy Button guided configuration
services: active-directory
author: NishthaBabith-V
manager: martinco
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 02/26/2022
ms.author: v-nisba
ms.collection: M365-identity-device-management
---

# Tutorial: Configure F5’s BIG-IP Easy Button for SSO to Oracle PeopleSoft

In this article, learn to secure Oracle PeopleSoft (PeopleSoft) using Azure Active Directory (Azure AD), through F5’s BIG-IP Easy Button guided configuration.

Integrating a BIG-IP with Azure AD provides many benefits, including:

* [Improved Zero Trust governance](https://www.microsoft.com/security/blog/2020/04/02/announcing-microsoft-zero-trust-assessment-tool/) through Azure AD pre-authentication and [Conditional Access](/azure/active-directory/conditional-access/overview)

* Full SSO between Azure AD and BIG-IP published services

* Manage Identities and access from a single control plane, the [Azure portal](https://portal.azure.com/)

To learn about all the benefits, see the article on [F5 BIG-IP and Azure AD integration](/azure/active-directory/manage-apps/f5-aad-integration) and [what is application access and single sign-on with Azure AD](/azure/active-directory/active-directory-appssoaccess-whatis).

## Scenario description

This scenario looks at the classic **Oracle JDE application** using **HTTP authorization headers** to manage access to protected content.For this scenario, we have a **PeopleSoft application using HTTP authorization headers** to manage access to protected content.

Being legacy, the application lacks modern protocols to support a direct integration with Azure AD. The application can be modernized, but it is costly, requires careful planning, and introduces risk of potential downtime. Instead, an F5 BIG-IP Application Delivery Controller (ADC) is used to bridge the gap between the legacy application and the modern ID control plane, through protocol transitioning.

Having a BIG-IP in front of the app enables us to overlay the service with Azure AD pre-authentication and header-based SSO, significantly improving the overall security posture of the application.

## Scenario architecture

The secure hybrid access solution for this scenario is made up of several components:

**PeopleSoft Application:** BIG-IP published service to be protected by Azure AD SHA.

**Azure AD:** Security Assertion Markup Language (SAML) Identity Provider (IdP) responsible for verification of user credentials, Conditional Access (CA), and SAML based SSO to the BIG-IP. Through SSO, Azure AD provides the BIG-IP with any required session attributes.

**BIG-IP:** Reverse proxy and SAML service provider (SP) to the application, delegating authentication to the SAML IdP before performing header-based SSO to the PeopleSoft service.

SHA for this scenario supports both SP and IdP initiated flows. The following image illustrates the SP initiated flow.

![Image --Secure hybrid access - SP initiated flow](./media/f5-big-ip-easy-button-oracle-jde/sp-initiated-flow.png)

| Steps| Description |
| -------- |-------|
| 1| User connects to application endpoint (BIG-IP) |
| 2| BIG-IP APM access policy redirects user to Azure AD (SAML IdP) |
| 3| Azure AD pre-authenticates user and applies any enforced Conditional Access policies |
| 4| User is redirected back to BIG-IP (SAML SP) and SSO is performed using issued SAML token |
| 5| BIG-IP injects Azure AD attributes as headers in request to the application |
| 6| Application authorizes request and returns payload |

## Prerequisites

Prior BIG-IP experience isn’t necessary, but you need:

* An Azure AD free subscription or above

* An existing BIG-IP or [deploy a BIG-IP Virtual Edition (VE) in Azure](./f5-bigip-deployment-guide.md)

* Any of the following F5 BIG-IP license SKUs

  * F5 BIG-IP® Best bundle

  * F5 BIG-IP Access Policy Manager™ (APM) standalone license

  * F5 BIG-IP Access Policy Manager™ (APM) add-on license on an existing BIG-IP F5 BIG-IP® Local Traffic Manager™ (LTM)

  * 90-day BIG-IP full feature [trial license](https://www.f5.com/trial/big-ip-trial.php).

* User identities [synchronized](../hybrid/how-to-connect-sync-whatis.md) from an on-premises directory to Azure AD or created directly within Azure AD and flowed back to your on-premises directory

* An account with Azure AD application admin [permissions](/azure/active-directory/users-groups-roles/directory-assign-admin-roles#application-administrator)

* An [SSL Web certificate](./f5-bigip-deployment-guide.md#ssl-profile) for publishing services over HTTPS, or use default BIG-IP certs while testing

* An existing PeopleSoft environment

## BIG-IP configuration methods

There are many methods to configure BIG-IP for this scenario, including two template-based options and an advanced configuration. This tutorial covers the latest Guided Configuration 16.1 offering an Easy button template.

With the **Easy Button**, admins no longer go back and forth between Azure AD and a BIG-IP to enable services for SHA. The deployment and policy management is handled directly between the APM’s Guided Configuration wizard and Microsoft Graph. This rich integration between BIG-IP APM and Azure AD ensures that applications can quickly, easily support identity federation, SSO, and Azure AD Conditional Access, reducing administrative overhead.

>[!NOTE] 
> All example strings or values referenced throughout this guide should be replaced with those for your actual environment.

## Register Easy Button

Before a client or service can access Microsoft Graph, it must be trusted by the [Microsoft identity platform](../develop/quickstart-register-app.md). 

A BIG-IP must also be registered as a client in Azure AD, before it is allowed to establish a trust in between each SAML SP instance of a BIG-IP published application, and Azure AD as the SAML IdP.

1. Sign in to the [Azure AD portal](https://portal.azure.com/) with Application Administrative rights

2. From the left navigation pane, select the **Azure Active Directory** service

3. Under Manage, select **App registrations > New registration**

4. Enter a display name for your application. For example, *F5 BIG-IP Easy Button

5. Specify who can use the application > **Accounts in this organizational directory only**

6. Select **Register** to complete the initial app registration

7. Navigate to **API permissions** and authorize the following Microsoft Graph permissions:

   * Application.Read.All
   * Application.ReadWrite.All
   * Application.ReadWrite.OwnedBy
   * Directory.Read.All
   * Group.Read.All
   * IdentityRiskyUser.Read.All
   * Policy.Read.All
   * Policy.ReadWrite.ApplicationConfiguration
   * Policy.ReadWrite.ConditionalAccess
   * User.Read.All

8. Grant admin consent for your organization

9. Go to **Certificates & Secrets**, generate a new **Client secret** and note it down

10. Go to **Overview**, note the **Client ID** and **Tenant ID**

## Configure Easy Button

Initiate the **Easy Button** configuration to set up a SAML Service Provider (SP) and Azure AD as an Identity Provider (IdP) for your application.

1. Navigate to **Access > Guided Configuration > Microsoft Integration** and select **Azure AD Application**.

   ![Screenshot for Configure Easy Button- Install the template](./media/f5-big-ip-easy-button-ldap/easy-button-template.png)

2. Review the list of configuration steps and select **Next**

   ![Screenshot for Configure Easy Button - List configuration steps](./media/f5-big-ip-easy-button-ldap/config-steps.png)

3. Follow the sequence of steps required to publish your application.

   ![Configuration steps flow](./media/f5-big-ip-easy-button-ldap/config-steps-flow.png#lightbox)
