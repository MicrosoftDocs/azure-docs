---
title: Azure Active Directory B2C deployment plans
description: Azure Active Directory B2C deployment guide for planning, implementation, and monitoring
services: active-directory
ms.service: active-directory
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 01/17/2023
ms.author: gasinh
author: gargi-sinha
manager: martinco
ms.collection: M365-identity-device-management
---
# Azure Active Directory B2C deployment plans

Azure Active Directory B2C (Azure AD B2C) is an identity and access management solution that can ease integration with your infrastructure. Use the following guidance to help understand requirements and compliance throughout an Azure AD B2C deployment.

## Plan an Azure AD B2C deployment

### Requirements

- Assess the primary reason to turn off systems
  - See, [What is Azure Active Directory B2C?](../../active-directory-b2c/overview.md)
- For a new application, plan the design of the Customer Identity Access Management (CIAM) system
  -  See, [Planning and design](../../active-directory-b2c/best-practices.md#planning-and-design) 
- Identify customer locations and create a tenant in the corresponding datacenter
  - See, [Tutorial: Create an Azure Active Directory B2C tenant](../../active-directory-b2c/tutorial-create-tenant.md)
- Confirm your application types and supported technologies:
  -  [Overview of the Microsoft Authentication Library (MSAL)](../develop/msal-overview.md)
  -  [Develop with open source languages, frameworks, databases, and tools in Azure](https://azure.microsoft.com/free/open-source/search/?OCID=AID2200277_SEM_f63bcafc4d5f1d7378bfaa2085b249f9:G:s&ef_id=f63bcafc4d5f1d7378bfaa2085b249f9:G:s&msclkid=f63bcafc4d5f1d7378bfaa2085b249f9).
  - For back-end services, use the [client credentials](../develop/msal-authentication-flows.md#client-credentials) flow
- To migrate from an identity provider (IdP):
  - [Seamless migration](../../active-directory-b2c/user-migration.md#seamless-migration)
  - Go to [azure-ad-b2c-user-migration](https://github.com/azure-ad-b2c/user-migration)
- Select protocols
  - If you use Kerberos, Microsoft Windows NT LAN Manager (NTLM), and Web Services Federation (WS-Fed), see the video, [Azure Active Directory: Application and identity migration to Azure AD B2C](https://www.bing.com/videos/search?q=application+migration+in+azure+ad+b2c&docid=608034225244808069&mid=E21B87D02347A8260128E21B87D02347A8260128&view=detail&FORM=VIRE)

After migration, your applications can support modern identity protocols such as OAuth 2.0 and OpenID Connect (OIDC).

### Stakeholders

Technology project success depends on managing expectations, outcomes, and responsibilities. 

- Identify the application architect, technical program manager, and owner
- Create a distribution list (DL) to communicate with the Microsoft account or engineering teams
  - Ask questions, get answers, and receive notifications
- Identify a partner or resource outside your organization to support you

Learn more: [Include the right stakeholders](deployment-plans.md)

### Communications

Communicate proactively and regularly with your users about pending and current changes. Inform them about how the experience changes, when it changes, and provide a contact for support.

### Timelines

Help set realistic expectations and make contingency plans to meet key milestones:

- Pilot date
- Launch date
- Dates that affect delivery
- Dependencies

## Implement an Azure AD B2C deployment

* **Deploy applications and user identities** - Deploy client application and migrate user identities 
* **Client application onboarding and deliverables** - Onboard the client application and test the solution
* **Security** - Enhance the identity solution security
* **Compliance** - Address regulatory requirements 
* **User experience** - Enable a user-friendly service 

### Deploy authentication and authorization

* Before your applications interact with Azure AD B2C, register them in a tenant you manage
  * See, [Tutorial: Create an Azure Active Directory B2C tenant](../../active-directory-b2c/tutorial-create-tenant.md)
* For authorization, use the Identity Experience Framework (IEF) sample user journeys
  * See, [Azure Active Directory B2C: Custom CIAM User Journeys](https://github.com/azure-ad-b2c/samples#local-account-policy-enhancements)
* Use policy-based control for cloud-native environments
  * Go to openpolicyagent.org to learn about [Open Policy Agent](https://www.openpolicyagent.org/) (OPA)

Learn more with the Microsoft Identity PDF, [Gaining expertise with Azure AD B2C](https://aka.ms/learnaadb2c), a course for developers.

### Checklist for personas, permissions, delegation, and calls

* Identify the personas that access to your application 
* Define how you manage system permissions and entitlements today, and in the future
* Confirm you have a permission store and if there are permissions to add to the directory
* Define how you manage delegated administration 
  * For example, your customers' customers management
* Verify your application calls an API Manager (APIM)
  * There might be a need to call from the IdP before the application is issued a token

### Deploy applications and user identities

Azure AD B2C projects start with one or more client applications.

* [The new App registrations experience for Azure Active Directory B2C](../../active-directory-b2c/app-registrations-training-guide.md)
  * Refer to [Azure Active Directory B2C code samples](../../active-directory-b2c/integrate-with-app-code-samples.md) for implementation
* Set up your user journey based on custom user flows
  *  [Comparing user flows and custom policies](../../active-directory-b2c/user-flow-overview.md#comparing-user-flows-and-custom-policies)
  *  [Add an identity provider to your Azure Active Directory B2C tenant](../../active-directory-b2c/add-identity-provider.md)
  *  [Migrate users to Azure AD B2C](../../active-directory-b2c/user-migration.md)
  *  [Azure Active Directory B2C: Custom CIAM User Journeys](https://github.com/azure-ad-b2c/samples) for advanced scenarios

### Application deployment checklist

* Applications included in the CIAM deployment
* Applications in use
  * For example, web applications, APIs, single-page apps (SPAs), or native mobile applications
* Authentication in use:
  * For example, forms federated with SAML, or federated with OIDC
  * If OIDC, confirm the response type: code or id_token
* Determine where front-end and back-end applications are hosted: on-premises, cloud, or hybrid-cloud
* Confirm the platforms or languages in use:
  * For example ASP.NET, Java, and Node.js
  * See, [Quickstart: Set up sign in for an ASP.NET application using Azure AD B2C](../../active-directory-b2c/quickstart-web-app-dotnet.md)
* Verify where user attributes are stored
  * For example, Lightweight Directory Access Protocol (LDAP) or databases

### User identity deployment checklist

* Confirm the number of users accessing applications
* Determine the IdP types needed:
  * For example, Facebook, local account, and Active Directory Federation Services (AD FS)
  * See, [Active Directory Federation Services](/windows-server/identity/active-directory-federation-services)
* Outline the claim schema required from your application, Azure AD B2C, and IdPs if applicable
  * See, [ClaimsSchema](../../active-directory-b2c/claimsschema.md)
* Determine the information to collect during sign-in and sign-up 
  * [Set up a sign-up and sign-in flow in Azure Active Directory B2C](../../active-directory-b2c/add-sign-up-and-sign-in-policy.md?pivots=b2c-user-flow)

### Client application onboarding and deliverables

Use the following checklist for onboarding an application

|Area|Description|
|---|---|
|Application target user group | Select among end customers, business customers, or a digital service. </br>Determine a need for employee sign-in.|
|Application business value| Understand the business need and/or goal to determine the best Azure AD B2C solution and integration with other client applications.|
|Your identity groups| Cluster identities into groups with requirements, such as business-to-consumer (B2C), business-to-business (B2B) business-to-employee (B2E), and business-to-machine (B2M) for IoT device sign-in and service accounts.|
|Identity provider (IdP)| See, [Select an identity provider](../../active-directory-b2c/add-identity-provider.md#select-an-identity-provider). For example, for a customer-to-customer (C2C) mobile app use an easy sign-in process. </br>B2C with digital services has compliance requirements. </br>Consider email sign-in. |
|Regulatory constraints | Determine a need for remote profiles or privacy policies. |
|Sign-in and sign-up flow | Confirm email verification or email verification during sign-up. </br>For check-out processes, see [How it works: Azure AD Multi-Factor Authentication](../authentication/concept-mfa-howitworks.md). </br>See the video, [Azure AD: Azure AD B2C user migration using Microsoft Graph API](https://www.youtube.com/watch?v=c8rN1ZaR7wk&list=PL3ZTgFEc7LyuJ8YRSGXBUVItCPnQz3YX0&index=4). |
|Application and authentication protocol| Implement client applications such as Web application, single-page application (SPA), or native. </br>Authentication protocols for client application and Azure AD B2C: OAuth, OIDC, and SAML. </br>See the video, [Azure AD: Protecting Web APIs with Azure AD](https://www.youtube.com/watch?v=r2TIVBCm7v4&list=PL3ZTgFEc7LyuJ8YRSGXBUVItCPnQz3YX0&index=9).|
| User migration | Confirm if you'll [migrate users to Azure AD B2C](../../active-directory-b2c/user-migration.md): Just-in-time (JIT) migration and bulk import/export. </br>See the video, [Azure Active Directory: Azure AD B2C user migration strategies](https://www.youtube.com/watch?v=lCWR6PGUgz0&list=PL3ZTgFEc7LyuJ8YRSGXBUVItCPnQz3YX0&index=2).|

Use the following checklist for delivery.

|Area| Description|
|---|---|
|Protocol information| Gather the base path, policies, and metadata URL of both variants. </br>Specify attributes such as sample sign-in, client application ID, secrets, and redirects.|
|Application samples | See, [Azure Active Directory B2C code samples](../../active-directory-b2c/integrate-with-app-code-samples.md).|
|Penetration testing | Inform your operations team about pen tests, then test user flows including the OAuth implementation. </br>See, [Penetration testing](../../security/fundamentals/pen-testing.md) and [Penetration testing rules of engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement).
| Unit testing  | Unit test and generate tokens. </br>See, [Microsoft identity platform and OAuth 2.0 Resource Owner Password Credentials](../develop/v2-oauth-ropc.md). </br>If you reach the Azure AD B2C token limit, see [Azure AD B2C: File Support Requests](../../active-directory-b2c/find-help-open-support-ticket.md). </br>Reuse tokens to reduce investigation on your infrastructure. </br>[Set up a resource owner password credentials flow in Azure Active Directory B2C](../../active-directory-b2c/add-ropc-policy.md?pivots=b2c-user-flow&tabs=app-reg-ga).|
| Load testing | Learn about [Azure AD B2C service limits and restrictions](../../active-directory-b2c/service-limits.md). </br>Calculate the expected authentications and user sign-ins per month. </br>Assess high load traffic durations and business reasons: holiday, migration, and event. </br>Determine expected peak rates for sign-up, traffic, and geographic distribution, for example per second.  

### Security

Use the following checklist to enhance application security.

* Authentication method, such as multi-factor authentication (MFA):
  * MFA is recommended for users that trigger high-value transactions or other risk events. For example, banking, finance, and check-out processes.
  * See, [What authentication and verification methods are available in Azure AD?](../authentication/concept-authentication-methods.md)
* Confirm use of anti-bot mechanisms
* Assess the risk of attempts to create a fraudulent account or sign-in 
  * See, [Tutorial: Configure Microsoft Dynamics 365 Fraud Protection with Azure Active Directory B2C](../../active-directory-b2c/partner-dynamics-365-fraud-protection.md) 
* Confirm needed conditional postures as part of sign-in or sign-up

#### Conditional Access and identity protection

* The modern security perimeter now extends beyond an organization's network. The perimeter includes user and device identity. 
  * See, [What is Conditional Access?](../conditional-access/overview.md)
* Enhance the security of Azure AD B2C with Azure AD identity protection
  * See, [Identity Protection and Conditional Access in Azure AD B2C](../../active-directory-b2c/conditional-access-identity-protection-overview.md)

### Compliance

To help comply with regulatory requirements and enhance back-end system security you can use virtual networks (VNets), IP restrictions, Web Application Firewall (WAF), etc. Consider the following requirements:

* Your regulatory compliance requirements
  * For example, Payment Card Industry Data Security Standard (PCI-DSS)
  * Go to pcisecuritystandards.org to learn more about the [PCI Security Standards Council](https://www.pcisecuritystandards.org/)
* Data storage into a separate database store
  * Determine if this information can't be written into the directory

### User experience

Use the following checklist to help define user experience requirements.

* Identify integrations to extend CIAM capabilities and build seamless end-user experiences
  * [Azure Active Directory B2C ISV partners](../../active-directory-b2c/partner-gallery.md)
* Use screenshots and user stories to show the application end-user experience
  * For example, screenshots of sign-in, sign-up, sign-up/sign-in (SUSI), profile edit, and password reset
* Look for hints passed through by using queryString parameters in your CIAM solution
* For high user-experience customization, consider a using front-end developer
* In Azure AD B2C, you can customize HTML and CSS
  * See, [Guidelines for using JavaScript](../../active-directory-b2c/javascript-and-page-layout.md?pivots=b2c-custom-policy#guidelines-for-using-javascript)
* Implement an embedded experience by using iframe support:
  * See, [Embedded sign-up or sign-in experience](../../active-directory-b2c/embedded-login.md?pivots=b2c-custom-policy) 
  * For a single-page application, use a second sign-in HTML page that loads into the `<iframe>` element

## Monitoring auditing, and logging

Use the following checklist for monitoring, auditing, and logging.

* Monitoring
  * [Monitor Azure AD B2C with Azure Monitor](../../active-directory-b2c/azure-monitor.md)
  * See the video [Azure Active Directory: Monitoring and reporting Azure AD B2C using Azure Monitor](https://www.youtube.com/watch?v=Mu9GQy-CbXI&list=PL3ZTgFEc7LyuJ8YRSGXBUVItCPnQz3YX0&index=1)
* Auditing and logging
  * [Accessing Azure AD B2C audit logs](../../active-directory-b2c/view-audit-logs.md)

## Resources

- [Register a Microsoft Graph application](../../active-directory-b2c/microsoft-graph-get-started.md)
- [Manage Azure AD B2C with Microsoft Graph](../../active-directory-b2c/microsoft-graph-operations.md)
- [Deploy custom policies with Azure Pipelines](../../active-directory-b2c/deploy-custom-policies-devops.md)
- [Manage Azure AD B2C custom policies with Azure PowerShell](../../active-directory-b2c/manage-custom-policies-powershell.md)

## Next steps

[Recommendations and best practices for Azure Active Directory B2C](../../active-directory-b2c/best-practices.md)
