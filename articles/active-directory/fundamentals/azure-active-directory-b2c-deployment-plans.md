---
title: Azure AD B2C Deployment
description: Azure Active Directory B2C Deployment guide

services: active-directory
ms.service: active-directory
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 7/12/2021

ms.author: gasinh
author: gargi-sinha
manager: martinco

ms.collection: M365-identity-device-management
---

# Azure Active Directory B2C deployment plans

Azure Active Directory B2C is a scalable identity and access management solution. Its high flexibility to meet your business expectations and smooth integration with existing infrastructure enables further digitalization.

To help organizations understand the business requirements and respect compliance boundaries, a step-by-step approach is recommended throughout an Azure Active Directory (Azure AD) B2C deployment.

| Capability | Description |
|:-----|:------|
| [Plan](#plan-an-azure-ad-b2c-deployment) | Prepare Azure AD B2C projects for deployment. Start by identifying the stakeholders and later defining a project timeline. |
| [Implement](#implement-an-azure-ad-b2c-deployment) | Start with enabling authentication and authorization and later perform full application onboarding. |
| [Monitor](#monitor-an-azure-ad-b2c-solution) | Enable logging, auditing, and reporting once an Azure AD B2C solution is in place. |

## Plan an Azure AD B2C deployment

This phase includes the following capabilities:

| Capability | Description |
|:------------|:------------|
|[Business requirements review](#business-requirements-review) | Assess your organization’s status and expectations |
| [Stakeholders](#stakeholders) |Build your project team |
|[Communication](#communication) | Communicate with your team about the project |
| [Timeline](#timeline) | Reminder of key project milestones  |

### Business requirements review

- Assess the primary reason to switch off existing systems and [move to Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/overview).

- For a new application, [plan and design](https://docs.microsoft.com/azure/active-directory-b2c/best-practices#planning-and-design) the Customer Identity Access Management (CIAM) system

- Identify customer's location and [create a tenant in the corresponding datacenter](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant).

- Check the type of applications you have
  - Check the platforms that are currently supported - [MSAL](https://docs.microsoft.com/azure/active-directory/develop/msal-overview) or [Open source](https://azure.microsoft.com/free/open-source/search/?OCID=AID2200277_SEM_f63bcafc4d5f1d7378bfaa2085b249f9:G:s&ef_id=f63bcafc4d5f1d7378bfaa2085b249f9:G:s&msclkid=f63bcafc4d5f1d7378bfaa2085b249f9).
  - For backend services, use the [client credentials flow](https://docs.microsoft.com/azure/active-directory/develop/msal-authentication-flows#client-credentials).

- If you intend to migrate from an existing Identity Provider (IdP)

  - Consider using the [seamless migration approach](https://docs.microsoft.com/azure/active-directory-b2c/user-migration#seamless-migration)
  - Learn [how to migrate the existing applications](https://github.com/azure-ad-b2c/user-migration)
  - Ensure the coexistence of multiple solutions at once.

- Decide the protocols you want to use

  - If you're currently using Kerberos, NTLM, and WS-Fed, [migrate and refactor your applications](https://www.bing.com/videos/search?q=application+migration+in+azure+ad+b2c&docid=608034225244808069&mid=E21B87D02347A8260128E21B87D02347A8260128&view=detail&FORM=VIRE). Once migrated, your applications can support modern identity protocols such as OAuth 2.0 and OpenID Connect (OIDC) to enable further identity protection and security.

### Stakeholders

When technology projects fail, it's typically because of mismatched expectations on impact, outcomes, and responsibilities. To avoid these pitfalls, [ensure that you're engaging the right
stakeholders](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-deployment-plans#include-the-right-stakeholders) and that stakeholders understand their roles.

- Identify the primary architect, project manager, and owner for the application.

- Consider providing a Distribution List (DL). Using this DL, you can communicate product issues with the Microsoft account team or engineering. You can ask questions, and receive important notifications.

- Identify a partner or resource outside of your organization who can support you.

### Communication

Communication is critical to the success of any new service. Proactively communicate to your users about the change. Timely inform them about how their experience will change, when it will change, and how to gain support if they experience issues.

### Timeline

Define clear expectations and follow up plans to meet key milestones:

- Expected pilot date

- Expected launch date

- Any dates that may affect project delivery date

## Implement an Azure AD B2C deployment

This phase includes the following capabilities:

| Capability | Description |
|:-------------|:--------------|
| [Deploy authentication and authorization](#deploy-authentication-and-authorization) | Understand the [authentication and authorization](https://docs.microsoft.com/azure/active-directory/develop/authentication-vs-authorization) scenarios |
| [Deploy applications and user identities](#deploy-applications-and-user-identities) | Plan to deploy client application and migrate user identities  |
| [Client application onboarding and deliverables](#client-application-onboarding-and-deliverables) | Onboard the client application and test the solution |
| [Security](#security) | Enhance the security of your Identity solution |
|[Compliance](#compliance) | Address regulatory requirements |
|[User experience](#user-experience) | Enable a user-friendly service |

### Deploy authentication and authorization

- Start with [setting up an Azure AD B2C tenant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant).

- For business driven authorization, use the [Azure AD  B2C Identity Experience Framework (IEF) sample user journeys](https://github.com/azure-ad-b2c/samples#local-account-policy-enhancements)

- Try [Open  policy agent](https://www.openpolicyagent.org/).

Learn more about Azure AD B2C in [this developer course](https://aka.ms/learnaadb2c).

Follow this sample checklist for more guidance:

- Identify the different personas that need access to your application.  

- Define how you manage permissions and entitlements in your existing system today and how to plan for the future.

- Check if you have a permission store and if there any permissions that need to be added to the directory.

- If you need delegated administration define how to solve it. For example, your customers' customers management.

- Check if your application calls directly an API Manager (APIM). There may be a need to call from the IdP before issuing a token to the application.

### Deploy applications and user identities

All Azure AD B2C projects start with one or more client applications, which may have different business goals.

1. [Create or configure client applications](https://docs.microsoft.com/azure/active-directory-b2c/app-registrations-training-guide). Refer to these [code samples](https://docs.microsoft.com/azure/active-directory-b2c/code-samples) for implementation.

2. Next, setup your user journey based on built-in or custom user flows. [Learn when to use user flows vs. custom policies](https://docs.microsoft.com/azure/active-directory-b2c/user-flow-overview#comparing-user-flows-and-custom-policies).

3. Setup IdPs based on your business need. [Learn how to add Azure Active Directory B2C as an IdP](https://docs.microsoft.com/azure/active-directory-b2c/add-identity-provider).

4. Migrate your users. [Learn about user migration approaches](https://docs.microsoft.com/azure/active-directory-b2c/user-migration). Refer to [Azure AD B2C IEF sample user journeys](https://github.com/azure-ad-b2c/samples) for advanced scenarios.  

Consider this sample checklist as you **deploy your applications**:

- Check the number of applications that are in scope for the CIAM deployment.

- Check the type of applications that are in use. For example, traditional web applications, APIs, Single page apps (SPA), or Native mobile applications.

- Check the kind of authentication that is in place. For example, forms based, federated with SAML, or federated with OIDC.
  - If OIDC, check the response type - code or id_token.

- Check if all the frontend and backend applications are hosted in on-premises, cloud, or hybrid-cloud.

- Check the platforms/languages used such as, [ASP.NET](https://docs.microsoft.com/azure/active-directory-b2c/quickstart-web-app-dotnet), Java, and Node.js.

- Check where the current user attributes are stored. It could be Lightweight Directory Access Protocol (LDAP) or databases.

Consider this sample checklist as you **deploy user identities**:

- Check the number of users accessing the applications.

- Check the type of IdPs that are needed. For example, Facebook, local account, and [Active Directory Federation Services (AD FS)](https://docs.microsoft.com/windows-server/identity/active-directory-federation-services).

- Outline the claim schema that is required from your application, [Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/claimsschema), and your IdPs if applicable.

- Outline the information that is required to capture during a [sign-in/sign-up flow](https://docs.microsoft.com/azure/active-directory-b2c/add-sign-up-and-sign-in-policy?pivots=b2c-user-flow).

### Client application onboarding and deliverables

Consider this sample checklist while you **onboard an application**:

|  Task | Description |
|:--------------------|:----------------------|
| Define the target group of the application | Check if this application is an end customer application, business customer application, or a digital service. Check if there is a need for employee login. |
| Identify the business value behind an application | Understand the full business case behind an application to find the best fit of Azure AD B2C solution and integration with further client applications.|
| Check the identity groups you have | Cluster identities in different types of groups with different types of requirements, such as **Business to Customer** (B2C) for end customers and business customers, **Business to Business** (B2B) for partners and suppliers, **Business to Employee** (B2E) for your employees and external employees, **Business to Machine** (B2M) for IoT device logins and service accounts.|
| Check the IdP you need for your business needs and processes | Azure AD B2C [supports several types of IdPs](https://docs.microsoft.com/azure/active-directory-b2c/add-identity-provider#select-an-identity-provider) and depending on the use case the right IdP should be chosen. For example, for a Customer to Customer mobile application a fast and easy user login is required. In another use case, for a Business to Customer with digital services additional compliance requirements are necessary. The user may need to log in with their business identity such as E-mail login. |
| Check the regulatory constraints | Check if there is any reason to have remote profiles or specific privacy policies.  |
| Design the sign-in and sign-up flow | Decide whether an email verification or email verification inside sign-ups will be needed. First check-out process such as Shop systems or [Azure AD Multi-Factor Authentication (MFA)](https://docs.microsoft.com/azure/active-directory/authentication/concept-mfa-howitworks) is needed or not. Watch [this video](https://www.youtube.com/watch?v=c8rN1ZaR7wk&list=PL3ZTgFEc7LyuJ8YRSGXBUVItCPnQz3YX0&index=4). |
| Check the type of application and authentication protocol used or that will be implemented | Information exchange about the implementation of client application such as Web application, SPA, or Native application. Authentication protocols for client application and Azure AD B2C could be OAuth, OIDC, and SAML. Watch [this video](https://www.youtube.com/watch?v=r2TIVBCm7v4&list=PL3ZTgFEc7LyuJ8YRSGXBUVItCPnQz3YX0&index=9)|
| Plan user migration | Discuss the possibilities of [user migration with Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/user-migration#:~:text=Pre%20Migration%20Flow%20in%20Azure%20AD%20B2C%20In,B2C%20directory%20with%20the%20current%20credentials.%20See%20More.). There are several scenarios possible such as Just In Times (JIT) migration, and bulk import/export. Watch [this video](https://www.youtube.com/watch?v=lCWR6PGUgz0&list=PL3ZTgFEc7LyuJ8YRSGXBUVItCPnQz3YX0&index=2). You can also consider using [Microsoft Graph API](https://www.youtube.com/watch?v=9BRXBtkBzL4&list=PL3ZTgFEc7LyuJ8YRSGXBUVItCPnQz3YX0&index=3) for user migration.|

Consider this sample checklist while you **deliver**.

| Capability | Description |
|:-----|:-------|
|Protocol information| Gather the base path, policies, metadata URL of both variants. Depending on the client application, specify the attributes such as sample login, client application ID, secrets, and redirects.|
| Application samples | Refer to the provided [sample codes](https://docs.microsoft.com/azure/active-directory-b2c/code-samples). |
|Pen testing | Before the tests, inform your operations team about the pen tests and then test all user flows including the OAuth implementation. Learn more about [Penetration testing](https://docs.microsoft.com/azure/security/fundamentals/pen-testing) and the [Microsoft Cloud unified penetration testing rules of engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement).
| Unit testing  | Perform unit testing and generate tokens [using Resource owner password credential (ROPC) flows](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth-ropc). If you hit the Azure AD B2C token limit, [contact the support team](https://docs.microsoft.com/azure/active-directory-b2c/support-options). Reuse tokens to reduce investigation efforts on your infrastructure. [Setup a ROPC flow](https://docs.microsoft.com/azure/active-directory-b2c/add-ropc-policy?tabs=app-reg-ga&pivots=b2c-user-flow).|
| Load testing | Expect reaching Azure AD B2C [service limits](https://docs.microsoft.com/azure/active-directory-b2c/service-limits). Evaluate the expected number of authentications per month your service will have. Evaluate the expected number of average user logins per month. Assess the expected high load traffic durations and business reason such as holidays, migrations, and events. Evaluate the expected peak sign-up rate, for example, number of requests per second. Evaluate the expected peak traffic rate with MFA, for example, requests per second. Evaluate the expected traffic geographic distribution and their peak rates.

### Security

Consider this sample checklist to enhance the security of your application depending on your business needs:

- Check if strong authentication method such as [MFA](https://docs.microsoft.com/azure/active-directory/authentication/concept-mfa-howitworks) is required. For users who trigger high value transactions or other risk events its suggested to use MFA. For example, for banking and finance applications, online shops - first checkout process.

- Check if MFA is required, [check the methods available to do MFA](https://docs.microsoft.com/azure/active-directory/authentication/concept-authentication-methods#:~:text=How%20each%20authentication%20method%20works%20%20%20,%20%20MFA%20%204%20more%20rows%20) such as  SMS/Phone, email, and third-party services.

- Check if any anti-bot mechanism is in use today with your applications.

- Assess the risk of attempts to create fraudulent accounts and log-ins. Use [Microsoft Dynamics 365 Fraud Protection assessment](https://docs.microsoft.com/azure/active-directory-b2c/partner-dynamics-365-fraud-protection) to block or challenge suspicious attempts to create new fake accounts or to compromise existing accounts.  

- Check for any special conditional postures that need to be applied as part of sign-in or sign-up for accounts with your application.

>[!NOTE]
>You can use [Conditional Access rules](https://docs.microsoft.com/azure/active-directory/conditional-access/overview) to adjust the difference between user experience and security based on your business goals.

For more information, see [Identity Protection and Conditional Access in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/conditional-access-identity-protection-overview).

### Compliance

To satisfy certain regulatory requirements you may consider using vNets, IP restrictions, Web Application Firewall (WAF), and similar services to enhance the security of your backend systems.

To address basic compliance requirements, consider:

- The specific regulatory compliance requirements, for example, PCI-DSS that you need to support.

- Check if it's required to store data into a separate database store. If so, check if this information must never be written into the directory.

### User experience

Consider the sample checklist to define the user experience (UX) requirements:

- Identify the required integrations to [extend CIAM capabilities and build seamless end-user experiences](https://docs.microsoft.com/azure/active-directory-b2c/partner-gallery).

- Provide screenshots and user stories to show the end-user experience for the existing application. For example, provide screenshots for sign-in, sign-up, combined sign-up sign-in (SUSI), profile edit, and password reset.

- Look for existing hints passed through using queryString parameters in your current CIAM solution.

- If you expect high UX customization such as pixel to pixel, you may need a front-end developer to help you.

## Monitor an Azure AD B2C solution

This phase includes the following capabilities:

| Capability | Description |
|:---------|:----------|
|  Monitoring  |[Monitor Azure AD B2C with Azure Monitor](https://docs.microsoft.com/azure/active-directory-b2c/azure-monitor). Watch [this video](https://www.youtube.com/watch?v=Mu9GQy-CbXI&list=PL3ZTgFEc7LyuJ8YRSGXBUVItCPnQz3YX0&index=1)|
| Auditing and Logging | [Access and review audit logs](https://docs.microsoft.com/azure/active-directory-b2c/view-audit-logs)

## More information

To accelerate Azure AD B2C deployments and monitor the service at scale, see these articles:

- [Manage Azure AD B2C with Microsoft Graph](../../active-directory-b2c/microsoft-graph-get-started.md)

- [Manage Azure AD B2C user accounts with Microsoft Graph](../../active-directory-b2c/microsoft-graph-operations.md)

- [Deploy custom policies with Azure Pipelines](../../active-directory-b2c/deploy-custom-policies-devops.md)

- [Manage Azure AD B2C custom policies with Azure PowerShell](../../active-directory-b2c/manage-custom-policies-powershell.md)

- [Monitor Azure AD B2C with Azure Monitor](../../active-directory-b2c/azure-monitor.md)

## Next steps

- [Azure AD B2C best practices](https://docs.microsoft.com/azure/active-directory-b2c/best-practices)

- [Azure AD B2C service limits](https://docs.microsoft.com/azure/active-directory-b2c/service-limits)
