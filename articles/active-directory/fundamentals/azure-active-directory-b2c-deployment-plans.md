---
title: Azure Active Directory B2C deployment plans
description: Azure Active Directory B2C deployment guide for planning, implementation, and monitoring
services: active-directory
ms.service: active-directory
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 1/5/2023
ms.author: gasinh
author: gargi-sinha
manager: martinco

ms.collection: M365-identity-device-management
---

# Azure Active Directory B2C deployment plans

Azure Active Directory B2C (Azure AD B2C) is an identity and access management solution that can ease integration with your infrastructure. Use the following guidance to help understand requirements and compliance throughout an Azure AD B2C deployment.

Learn more: [Azure Active Directory B2C deployment plans](#plan-an-azure-ad-b2c-deployment)

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
- To migrate from an Identity Provider (IdP)
  - [Seamless migration](../../active-directory-b2c/user-migration.md#seamless-migration)
  - Go to [azure-ad-b2c-user-migration](https://github.com/azure-ad-b2c/user-migration)
- Select protocols
  - If you use Kerberos, Microsoft Windows NT LAN Manager (NTLM), and Web Services Federation (WS-Fed), see the video, [Azure Active Directory: Application and identity migration to Azure AD B2C](https://www.bing.com/videos/search?q=application+migration+in+azure+ad+b2c&docid=608034225244808069&mid=E21B87D02347A8260128E21B87D02347A8260128&view=detail&FORM=VIRE). 

After migration, your applications can support modern identity protocols such as OAuth 2.0 and OpenID Connect (OIDC).

### Stakeholders

Technology project success depends on managing expectations, outcomes, and responsibilities. See, [Include the right
stakeholders](./active-directory-deployment-plans.md#include-the-right-stakeholders)

- Identify the application architect, technical program manager, and owner
- Create a distribution list (DL) to communicate with the Microsoft account or engineering teams
  - Ask questions, get answers, and receive notifications
- Identify a partner or resource outside your organization to support you

### Communications

Communicate proactively and regularly with your users about pending and current changes. Inform them about how the experience changes, when it changes, and provide a contact for support.

### Timelines

Help set realistic expectations and contingency plans to meet key milestones:

- Pilot date
- Launch date
- Dates that affect delivery

## Implement an Azure AD B2C deployment

* **Deploy applications and user identities** - Deploy client application and migrate user identities 
* **Client application onboarding and deliverables** - Onboard the client application and test the solution
* **Security** - Enhance the identity solution security
* **Compliance** Address regulatory requirements 
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
*  Set up your user journey based on custom user flows
  *  [Comparing user flows and custom policies](../../active-directory-b2c/user-flow-overview.md#comparing-user-flows-and-custom-policies)
*  [Add an identity provider to your Azure Active Directory B2C tenant](../../active-directory-b2c/add-identity-provider.md)
*  [Migrate users to Azure AD B2C](../../active-directory-b2c/user-migration.md). 
  *  See, [Azure Active Directory B2C: Custom CIAM User Journeys](https://github.com/azure-ad-b2c/samples) for advanced scenarios.  

### Application deployment checklist

* Applications included in the CIAM deployment
* Applications in use:
  * For example, web applications, APIs, single-page apps (SPA), or native mobile applications
* Authentication in use:
  * For example, forms, federated with SAML, or federated with OIDC
  * If OIDC, confirm the response type: code or id_token
* Determine where front-end and back-end applications are hosted: on-premises, cloud, or hybrid-cloud
* Confirm the platforms or languages in use:
  * For example ASP.NET, Java, and Node.js
  * See, [Quickstart: Set up sign in for an ASP.NET application using Azure AD B2C](../../active-directory-b2c/quickstart-web-app-dotnet.md)
* Verify where user attributes are stored:
  * For exaple, Lightweight Directory Access Protocol (LDAP) or databases

### User identity deployment checklist

- Check the number of users accessing the applications.

- Check the type of IdPs that are needed. For example, Facebook, local account, and [Active Directory Federation Services (AD FS)](/windows-server/identity/active-directory-federation-services).

- Outline the claim schema that is required from your application, [Azure AD B2C](../../active-directory-b2c/claimsschema.md), and your IdPs if applicable.

- Outline the information that is required to capture during a [sign-in/sign-up flow](../../active-directory-b2c/add-sign-up-and-sign-in-policy.md?pivots=b2c-user-flow).

### Client application onboarding and deliverables

Consider this sample checklist while you **onboard an application**:

|  Task | Description |
|:--------------------|:----------------------|
| Define the target group of the application | Check if this application is an end customer application, business customer application, or a digital service. Check if there is a need for employee login. |
| Identify the business value behind an application | Understand the full business case behind an application to find the best fit of Azure AD B2C solution and integration with further client applications.|
| Check the identity groups you have | Cluster identities in different types of groups with different types of requirements, such as **Business to Customer** (B2C) for end customers and business customers, **Business to Business** (B2B) for partners and suppliers, **Business to Employee** (B2E) for your employees and external employees, **Business to Machine** (B2M) for IoT device logins and service accounts.|
| Check the IdP you need for your business needs and processes | Azure AD B2C [supports several types of IdPs](../../active-directory-b2c/add-identity-provider.md#select-an-identity-provider) and depending on the use case the right IdP should be chosen. For example, for a Customer to Customer mobile application a fast and easy user login is required. In another use case, for a Business to Customer with digital services additional compliance requirements are necessary. The user may need to log in with their business identity such as E-mail login. |
| Check the regulatory constraints | Check if there is any reason to have remote profiles or specific privacy policies.  |
| Design the sign-in and sign-up flow | Decide whether an email verification or email verification inside sign-ups will be needed. First check-out process such as Shop systems or [Azure AD Multi-Factor Authentication (MFA)](../authentication/concept-mfa-howitworks.md) is needed or not. Watch [this video](https://www.youtube.com/watch?v=c8rN1ZaR7wk&list=PL3ZTgFEc7LyuJ8YRSGXBUVItCPnQz3YX0&index=4). |
| Check the type of application and authentication protocol used or that will be implemented | Information exchange about the implementation of client application such as Web application, SPA, or Native application. Authentication protocols for client application and Azure AD B2C could be OAuth, OIDC, and SAML. Watch [this video](https://www.youtube.com/watch?v=r2TIVBCm7v4&list=PL3ZTgFEc7LyuJ8YRSGXBUVItCPnQz3YX0&index=9)|
| Plan user migration | Discuss the possibilities of [user migration with Azure AD B2C](../../active-directory-b2c/user-migration.md). There are several scenarios possible such as Just In Times (JIT) migration, and bulk import/export. Watch [this video](https://www.youtube.com/watch?v=lCWR6PGUgz0&list=PL3ZTgFEc7LyuJ8YRSGXBUVItCPnQz3YX0&index=2). You can also consider using [Microsoft Graph API](https://www.youtube.com/watch?v=9BRXBtkBzL4&list=PL3ZTgFEc7LyuJ8YRSGXBUVItCPnQz3YX0&index=3) for user migration.|

Consider this sample checklist while you **deliver**.

| Capability | Description |
|:-----|:-------|
|Protocol information| Gather the base path, policies, metadata URL of both variants. Depending on the client application, specify the attributes such as sample login, client application ID, secrets, and redirects.|
| Application samples | Refer to the provided [sample codes](../../active-directory-b2c/integrate-with-app-code-samples.md). |
|Pen testing | Before the tests, inform your operations team about the pen tests and then test all user flows including the OAuth implementation. Learn more about [Penetration testing](../../security/fundamentals/pen-testing.md) and the [Microsoft Cloud unified penetration testing rules of engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement).
| Unit testing  | Perform unit testing and generate tokens [using Resource owner password credential (ROPC) flows](../develop/v2-oauth-ropc.md). If you hit the Azure AD B2C token limit, [contact the support team](../../active-directory-b2c/support-options.md). Reuse tokens to reduce investigation efforts on your infrastructure. [Setup a ROPC flow](../../active-directory-b2c/add-ropc-policy.md?pivots=b2c-user-flow&tabs=app-reg-ga).|
| Load testing | Expect reaching Azure AD B2C [service limits](../../active-directory-b2c/service-limits.md). Evaluate the expected number of authentications per month your service will have. Evaluate the expected number of average user logins per month. Assess the expected high load traffic durations and business reason such as holidays, migrations, and events. Evaluate the expected peak sign-up rate, for example, number of requests per second. Evaluate the expected peak traffic rate with MFA, for example, requests per second. Evaluate the expected traffic geographic distribution and their peak rates.

### Security

Consider this sample checklist to enhance the security of your application depending on your business needs:

- Check if strong authentication method such as [MFA](../authentication/concept-mfa-howitworks.md) is required. For users who trigger high value transactions or other risk events its suggested to use MFA. For example, for banking and finance applications, online shops - first checkout process.

- Check if MFA is required, [check the methods available to do MFA](../authentication/concept-authentication-methods.md) such as  SMS/Phone, email, and third-party services.

- Check if any anti-bot mechanism is in use today with your applications.

- Assess the risk of attempts to create fraudulent accounts and log-ins. Use [Microsoft Dynamics 365 Fraud Protection assessment](../../active-directory-b2c/partner-dynamics-365-fraud-protection.md) to block or challenge suspicious attempts to create new fake accounts or to compromise existing accounts.  

- Check for any special conditional postures that need to be applied as part of sign-in or sign-up for accounts with your application.

>[!NOTE]
>You can use [Conditional Access rules](../conditional-access/overview.md) to adjust the difference between user experience and security based on your business goals.

For more information, see [Identity Protection and Conditional Access in Azure AD B2C](../../active-directory-b2c/conditional-access-identity-protection-overview.md).

### Compliance

To satisfy certain regulatory requirements you may consider using vNets, IP restrictions, Web Application Firewall (WAF), and similar services to enhance the security of your backend systems.

To address basic compliance requirements, consider:

- The specific regulatory compliance requirements, for example, PCI-DSS that you need to support.

- Check if it's required to store data into a separate database store. If so, check if this information must never be written into the directory.

### User experience

Consider the sample checklist to define the user experience (UX) requirements:

- Identify the required integrations to [extend CIAM capabilities and build seamless end-user experiences](../../active-directory-b2c/partner-gallery.md).

- Provide screenshots and user stories to show the end-user experience for the existing application. For example, provide screenshots for sign-in, sign-up, combined sign-up sign-in (SUSI), profile edit, and password reset.

- Look for existing hints passed through using queryString parameters in your current CIAM solution.

- If you expect high UX customization such as pixel to pixel, you may need a front-end developer to help you.

- Azure AD B2C provides capabilities for customizing HTML and CSS, however, it has additional requirements for [JavaScript](../../active-directory-b2c/javascript-and-page-layout.md?pivots=b2c-custom-policy#guidelines-for-using-javascript).

- An embedded experience can be implemented [using iframe support](../../active-directory-b2c/embedded-login.md?pivots=b2c-custom-policy). For a single-page application, you'll also need a second "sign-in" HTML page that loads into the `<iframe>` element.

## Monitor an Azure AD B2C solution

This phase includes the following capabilities:

| Capability | Description |
|:---------|:----------|
|  Monitoring  |[Monitor Azure AD B2C with Azure Monitor](../../active-directory-b2c/azure-monitor.md). Watch [this video](https://www.youtube.com/watch?v=Mu9GQy-CbXI&list=PL3ZTgFEc7LyuJ8YRSGXBUVItCPnQz3YX0&index=1)|
| Auditing and Logging | [Access and review audit logs](../../active-directory-b2c/view-audit-logs.md)

## More information

To accelerate Azure AD B2C deployments and monitor the service at scale, see these articles:

- [Manage Azure AD B2C with Microsoft Graph](../../active-directory-b2c/microsoft-graph-get-started.md)

- [Manage Azure AD B2C user accounts with Microsoft Graph](../../active-directory-b2c/microsoft-graph-operations.md)

- [Deploy custom policies with Azure Pipelines](../../active-directory-b2c/deploy-custom-policies-devops.md)

- [Manage Azure AD B2C custom policies with Azure PowerShell](../../active-directory-b2c/manage-custom-policies-powershell.md)

- [Monitor Azure AD B2C with Azure Monitor](../../active-directory-b2c/azure-monitor.md)

## Next steps

- [Azure AD B2C best practices](../../active-directory-b2c/best-practices.md)

- [Azure AD B2C service limits](../../active-directory-b2c/service-limits.md)
