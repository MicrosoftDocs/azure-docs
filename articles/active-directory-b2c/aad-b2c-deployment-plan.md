---
title: Plan a Azure Active Directory B2C deployment
titleSuffix: Azure AD B2C
description: End-to-end guidance and recommendations about how to desgin and deploy many Azure Active Directory B2C (Azure AD B2C) capabilities. 
services: active-directory-b2c
author: felixroh
manager: sovisan

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 06/04/2020
ms.author: sovisan
ms.subservice: B2C
---

# Plan a Azure Active Directory B2C deployment

Azure Active Directory B2C is a horizontal and vertical scalable Identity Access Management solution with  high flexibility to integrate smoothly with  your business model and existing infrastructure enabling further digitalization

To best address your business need you must clear about the growing directions of your system. Based on that we propose different starting point of deployments but we can design our B2C in a way that it’s easy extendable.

**Vertical growing**
Vertical scaling means we have high numbers of accounts and less or similar numbers of applications and account types.
Examples a traditional reseller business with one or multiple consumer shops and an app. 

**Horizontal and vertical growing**
Horizontal scaling means that we have a huge amount of client applications, multiple types of customer account types. Often this scenarios starts with apps with a small user base.
I.e.  big enterprise with business units in the Business to Business and Business to Consumer section.

Both scenarios have different point of evaluating because on one side (vertical) we plan to ramp up single application with a high number of users and on the other side (horizontal and vertical) we are planning with application as an MVP to migrate and consolidate a full ecosystem.

Often in a only vertical growing scenario are “BuiltIn” policies good to go and fulfill business requirements if you are combining B2C with other Azure technologies. On that way for example you can build easily Invite flows.

Much more complex are the horizontal and vertical solutions. To deploy a B2C in this kind of scenarios it’s good to have an Identity Relationship Model as a foundation for the existing B2C and/or design the B2C to be used as an Identity Relationship Management system that fits your business needs.

| Capability | Description|
| -| -|
|[Setup a B2C](tutorial-create-tenant.md)|Explains you how to create a new B2C and in following the base functions of it.|
|Deploy Authentication and Authorization|Guidance of authentication and authorization scenarios and further information about the setup.|
|Deploy Client Applications and Identities|Guidance and checklists about the on boarding of client applications which want to use a B2C.|
|Client Application on boarding|Example of important questions and information which you should discuss with every client application.|
|Security|Enhance the security of your Identity solution.|
|Deploy Operations and Monitoring|Guidance of setting up a operations and monitoring in Azure AD B2C.|


## Authentication and Authorization 
Authentication and authorization goes hand in hand. Depends on your client applications, business and architecture it is necessary to deploy services solutions.

An overview about Authentication scenarios you will find here: [Deployment plans - Azure Active Directory](../active-directory/fundamentals/active-directory-deployment-plans.md)

An overview about Authorization you will find here: [Authentication vs. authorization - Microsoft identity platform](../active-directory/develop/authentication-vs-authorization.md))

Possibilities about business value driven authorization you will find here: [Azure AD B2C Identity Experience Framework sample User Journeys.](https://github.com/azure-ad-b2c/samples#local-account-policy-enhancements)

For complex business value driven authorization scenarios in big enterprises with a high amount of client application we propose the [Open Policy Agent](https://www.openpolicyagent.org/) Framework.

## Deploy Client Applications and Identities
All B2C projects are starting with one or multiple client applications. This applications has different reasons to change to B2C. Further they have different business goals what they want to achieve. 
It’s pretty important to know the business goals for the application because our Identity is our end customer.

The “Client Application onboarding guide” will help you to align the needs of the application and identity.

**Identities**
| Capability | Description|
| -| -|
|Choose user flows|Setup your user journey based on builtin or custom user flows.
[Learn when to use user flows vs. custom policies.](./user-flow-overview#comparing-user-flows-and-custom-policies.md)|
|Identity provider|Setup different types of identity provider based on your business need.
[Add an identity provider - Azure Active Directory B2C](./add-identity-provider.md)|
|User Migration|[Description of user migration possibilities.](./user-migration.md)|

**Client Application**
| Capability | Description|
| -| -|
|Create/ Configure Client Applications|Setup the client application based on the technical needs of this application:
[New App registrations experience in Azure AD B2C](./app-registrations-training-guide.md)|
|Security|Described the possibilities of enhancing the security of your Azure AD B2C solution.|
|Sample implementation|Sample Azure B2C Client application implementations to help developers to implement the protocols. You will find [here](https://github.com/azure-ad-b2c/samples).

## Client Application on boarding
For an initial deploy and continues application deployment on Azure B2C we need the technical and functional requirements.
To reduce effort and enhance security it’s important to handout material to enable the client application to implement everything in good straight way.
- Onboarding Checklist
- Client Application handout material

### Onboarding checklist
| Question | Description|
| -| -|
|How is the target group of the application?|Clarify with the application the customer types. Is this application an end customer app or is it a business customer app. Is it a digital services. Is there a need for employee login.|
|What is the business of the client application?|Understand the full business case of the application to find the best fit of Azure B2C solution and integration with futher client applications.|
|Which type of Identity groups you have?|You can cluster identities in different types of groups with different types requirements. Often are clarifications necessary. The following sample can help you to clarify that. <br/>- B2C = Business to Customer<br/>  -- End Customer<br/>  -- Business Customer<br/>-- ...<br/>- B2B = Business to Business<br/>-- Partners<br/>-- Suppliers<br/>-- ...<br/>- B2E = Business to Employee<br/>-- Your Employees<br/>-- External Employees<br/>-- ...<br/>- B2M = Business to Maschine<br/>-- IoT Device Login<br/>-- Service Accounts<br/>-- ...|
|Which Identity Provider you need and how is the business need and process?|Azure B2C offers several types of identity providers depending on the use case region it’s necessary to have right one. For example Consumer-Customer mobile application:<br/>Here it’s necessary to have a fast and easy login for the user because every step more increase the cancellation rate. It’s an option to use only:<br/>- Microsoft<br/>- Goolge<br/>- Apple<br/><br/>Business-Customer with a digital service:<br/> In this scenario it’s necessary to be compliant and often the company of the user takes responsibility. Here it’s makes sense that the customer can login with his business identity. For example, you can use<br/>- E-Mail Login<br/>- Microsoft Home-Discovery AAD Login<br/><br/>Digital services which run in China:<br/>China is a totally different world. Do you know that only around 20% of the citizens have a mail number? More common is here a phone number for login. A possible Identity provider setup could be:<br/>- Phone number login<br/>- WeChat|
|How are the regulatory rules?|This question is important to understand if there is any topic why you need remote profiles or you can handle that with a good that of Data Privacy Policies.  If you are not sure ask some expert. It’s more about legal then effort.|
|How should the SignIn and SignUp flow looks like? How are the requirements?|Discussion and requirements analyse about the needs of the SignIn and SignUp Flow. For example:<br/>- E-Mail verification (Yes/No)<br/>- E-Mail verification inside SignUp (Yes/No)<br/>- First CheckOut process (Shop systems)<br/>- MFA (Yes/ No)<br/>- ...|
|Which type of application is in use and which authentication protocol is or will be implemented?|Information exchange about the implementation of client application (Web Application, SPA, Native App,..) and authentication protocols od client application and Azure B2C (oAuth, OIDC, SAML).|
|Is a user migration planned?|Discuss the possibilities of user migration with B2C. There a several scenarios possible e.g. Just In Time (JIT) migration, Bulk Import/Export,...|

### Client Application handout material ###
| Capability | Description|
| -| -|
|Connection Information|<br/>- Base path, Policies, Metadata URL (both variants)<br/>- Sample Login<br/>- Does and don’t’s – e.g.<br/>-- What are the claims and what is the content<br/>-- Explain them why it’s not a good idea to use E-Mail as a unique identifier<br/>- …<br/><br/>Depending on Client app:<br/>- Sample Login<br/>- Client Application ID<br/>- Secrets<br/>- Redirects<br/>- Scopes|
|Azure B2C Client Applications Samples|[Azure Active Directory B2C code samples - Microsoft Docs](./code-samples.md)|
|Test information| **Security information of B2C** for the pen test of this app. A pen test is always recommended. Test of the all used flows including the oAuth implementation is important.<br/>*Important: Inform your (operations) team about pen tests so that they can prepare your system and inform us in case it's necessary.*<br/>Recommended readings:<br/>[What is Azure Active Directory Identity Protection?](../active-directory/identity-protection/overview-identity-protection.md)<br/><br/>**Unit test with ROPC flows**<br/>*Important: Using a ROPC flow to generate a token is a common why. Please keep in mind:<br/>- The identity protection incl. rate limits are in place. In the case that you reach rate limits of the AD B2C contact the support please.<br/>- Explain that they should reuse the token to reduce this risk and effort for investigation and on your infrastructure*<br/>[Set up a resource owner password credentials flow](./add-ropc-policy.md)<br/><br/>**Load testing of the B2C is recommended** from a client app perspective because every application has different requirements. In special you should ask for possible peaks of usage e.g. Push notifications, TV Spots, events.<br/>*Important: If client application has unpredictable usage which hits the Azure B2C [rate limits](./service-limits.md) then contact the support please. Further keep in mind that you can reduce the request to 3rd Party Identity providers via the Azure B2C in case that you are hitting this rate limits.*

## Security
Azure B2C will take care about a lot of security topics. A detail view about the Identity Protection you will find [here](../active-directory/identity-protection/overview-identity-protection.md).

But there are a lot of further topics which are depends on the business cases and you have to take care of.
| Capability | Description|
| -| -|
|Multi Factor Authentication| Do you require strong authentication for your users such as a multi-factor authentication (MFA)? For example, Finance cases, Online shops (first checkout process). If yes to MFA, what methods do you require and/or would like to be available? (ex. SMS/Phone, email, third-party service) Try to find the easiest one and think also about further option e.g. [TypingDNA](./typingdna.md)|
|Spam Protection| Do you use need anti-bot mechanism today with your application? For example if you are having only a mobile app this is not necessary.|
|Special Conditionals| Are there any special conditional postures that need to be applied as part of signing in or signing up for accounts with your application? You can use conditional access rules to adjust the delta between user friendliness and security based on your business goals.|

To get deeper inside and tutorials you should follow the [Identity Protection and Conditional Access in Azure AD B2C](./conditional-access-identity-protection-overview.md) article.

Often in horizontal scaled systems or/and in special compliance situations you will have a lot of user-based data inside your infrastructure. In those cases you might be thinking about vNets, IP Restrictions, Web Application Firewall (WAF) and similar services to enhance the security of your backend systems.

## Deploy Operations and Monitoring 
Setting up an operations and monitoring system is necessary for state of the art application to prevent downtime, have an high reaction rate and present KPIs of the solution.

[Monitor Azure AD B2C with Azure Monitor - Azure AD B2C](./azure-monitor.md)

Further you should take care of your risk flagged users and audit logs:
[Access and review audit logs - Azure AD B2C](./view-audit-logs.md)
