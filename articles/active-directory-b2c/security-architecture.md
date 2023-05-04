---
title: Security architecture in Azure AD B2C
titleSuffix: Azure AD B2C
description: End to end guidance on how to secure your Azure AD B2C solution.
services: active-directory-b2c
author: rbinrais
manager: RideMo

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 05/05/2023
ms.author: rbinrais
ms.subservice: B2C
---

# How to secure your Azure AD B2C identity solution

This article provides the best practices in securing your Azure AD B2C solution. When building your identity solution using Azure AD B2C, there are many components to consider protecting and monitoring.

Depending on your solution, you will have one or more of the following components in scope:

- Azure AD B2C authentication endpoints
- Azure AD B2C User Flows or Custom Policies
  - Sign In
  - Sign Up
- Email OTP
- Multi factor authentication controls
- External REST API's

All of the above components must be protected and monitored to ensure your users can login to applications without disruption. Following the guidance in this article, you will be able to protect your solution from bot attacks, fraudulent account creation, international revenue share fraud (ISRF), password spray and more.

## How to secure your solution

Your identity solution will use multiple components to provide a smooth login experience. Each component is listed below with the recommended protection mechanism.

|Component |Endpoint|Why|How to protect|
|----|----|----|----|
|Azure AD B2C authentication endpoints|`/authorize`, `/token`, `/.well-known/openid-configuration`, `/discovery/v2.0/keys`|Prevent resource exhaustion.|Web Application Firewall, Azure Front Door|
|Sign In|NA|Malicious sign in's that may try to brute force accounts or use leaked credentials.|Identity Protection.|
|Sign Up|NA|Fraudlent sign up's that may try to exhaust resources.|Endpoint protection. Fraud prevention technologies, such as Dynamics Fraud Protection.|
|Email OTP|NA|Fraudlent attemempts to brute force or exhaust resources.|Endpoint protection. Authenticator App. |
|Multi factor authentication controls|NA|Nuisance phone calls or SMS's being placed, or resource exhaustion.|Endpoint protection. Authenticator App.|
|External REST API's|Your REST API endpoints.|Malicious usage of user flows or custom policies can lead to resource exhaustion at your API endpoints.|Web Application Firewall, Azure Front Door|

### Protection mechanisms

The following table provides an overview of the different protection mechanisms that can be used to protect different components.

|What |Why |How|
|----|----|----|
|Web Application Firewall (WAF)|Web Application Firewall (WAF) serves as the first layer of defence against malicious requests made to Azure AD B2C endpoints. This provides centralized protection against common exploits and vulnerabilities such as DDoS, Bots, OWASP Top 10, and so on. It is strongly advised to use WAF to ensure that malicious requests are stopped even before they reach Azure AD B2C endpoints. </br></br> NOTE: To enable WAF you must first enable custom domains in Azure AD B2C using Azure Front Door.|<ul><li>[Configure Cloudflare Web Application Firewall with Azure Active Directory B2C](./partner-azure-web-application-firewall.md)</li></br><li>[Configure Akamai with Azure Active Directory B2C](./https://learn.microsoft.com/en-us/azure/active-directory-b2c/partner-cloudflare.md)</li></ul>|
|Azure Front Door (AFD)| AFD is a global, scalable entry-point that uses the Microsoft global edge network to create fast, secure, and widely scalable web applications. Among its key capabilites are:<ul><li>Ability to add/remove custom domains in a self-service fashion </li><li>Streamlined certificate management experience</li><li>Ability to bring your own certificate and get alert for expiring certificate with good rotation experience via Key Vault</li><li>AFD-provisioned certificate for quicker provisioning and autorotation on expiry </li> </ul>|<ul><li> [Enable custom domains for Azure Active Directory B2C](https://learn.microsoft.com/en-us/azure/active-directory-b2c/custom-domain)</li><ul>| 
|Identity Verification & Proofing / Fraud Protection|Identity verification and proofing is critical for creating a trusted user experience and protecting against account takeover and fraudulent account creation. This also contributes to tenant hygiene by ensuring that user objects reflect the actual users, which aligns with business scenarios. </br></br>Azure AD B2C enables the integration of identity verification and proofing, as well as fraud protection from a variety of software-vendor partners.| <ul><li> [Identity verification and proofing partners](https://learn.microsoft.com/en-us/azure/active-directory-b2c/identity-verification-proofing)</li><li>[Configure Microsoft Dynamics 365 Fraud Protection with Azure Active Directory B2C](./partner-dynamics-365-fraud-protection.md)  </li><li> [Configure Azure Active Directory B2C with the Arkose Labs platform](./partner-arkose-labs.md)</li><li> [Mitigate fraudulent MFA usage](./phone-based-mfa.md#mitigate-fraudulent-sign-ups)</li></ul>|
|Identity Protection|Identity Protection provides ongoing risk detection. When a risk is detected during sign-in, an Azure AD B2C conditional policy can be configured to allow the user to remediate the risk before proceeding with the sign-in. Administrators can also use identity protection reports to review risky users who are at risk and details about detections. The risk detections report includes information about each risk detection, such as its type,the location of the sign-in attempt, and more. Administrators can also confirm or deny that the user is compromised.|<ul><li>[Investigate risk with Identity Protection in Azure AD B2C](https://learn.microsoft.com/en-us/azure/active-directory-b2c/identity-protection-investigate-risk)</li><ul> | 
|Conditional Access (CA)|As a user attempts to sign in, CA gathers various signals, including risks from identity protection, to make decisions and enforce organizational policies. CA can assist administrators in developing policies that are consistent with their organization's security posture. This includes the ability to completely block user access or provide access after the user has completed additional autentication like MFA, etc.|<ul><li>[Add Conditional Access to user flows in Azure Active Directory B2C](https://learn.microsoft.com/en-us/azure/active-directory-b2c/conditional-access-user-flow)</li></ul>| 
|Multifactor Authentication (MFA)|MFA adds a second layer of security to the sign-up and sign-in process and is an essential component of improving the security posture of user authentication in Azure AD B2C. The Authenticator app - TOTP is the recommended MFA method in Azure AD B2C. | <ul><li>[Enable multifactor authentication in Azure Active Directory B2C](https://learn.microsoft.com/en-us/azure/active-directory-b2c/multi-factor-authentication)</li></ul> | 
|Security Information and Event management(SIEM)/ Security Orchestration, Automation and Response (SOAR) |It is critical to have a robust monitoring and alerting system in place to analyze usage patterns (sign-in, sign-up, etc.) and detect any signs of anomalous behavior that may be indicative of a cyberattack. This is an important step that adds an extra layer of security. It also aids in understanding patterns and trends that can only be captured and built upon over time. Alerting assists in determining factors such as the rate of change in overall sign-ins, an increase in failed sign-ins, and failed sign-up journeys, phone-based frauds such as IRSF attacks, and so on. All of these can be indicators of an ongoing cyberattack that requires immediate attention. Azure AD B2C supports both high level and fine grain logging, as well as the generation of reports (see below) and alerts. It is strongly advised that you implement monitoring and alerting in all production tenants. | <ul><li>[Monitor Azure AD B2C with Azure Monitor](https://learn.microsoft.com/en-us/azure/active-directory-b2c/azure-monitor)</li><li>[Azure AD B2C Reports & Alerts](https://github.com/azure-ad-b2c/siem)</li><li> [Monitor for fraudulent MFA usage](./phone-based-mfa)</li><li>[Collect Azure Active Directory B2C logs with Application Insights](https://learn.microsoft.com/en-us/azure/active-directory-b2c/troubleshoot-with-application-insights?pivots=b2c-user-flow)</li><li>[Configure security analytics for Azure Active Directory B2C data with Microsoft Sentinel](https://learn.microsoft.com/en-us/azure/active-directory-b2c/azure-sentinel)</li></ul>| 
  
![Azure AD B2C security architecture diagram.](./media/security-architecture/security-architecture-high-level.png)

## Protecting your External REST API's

Azure AD B2C may connect to your external systems via the API Connectors, or the REST API technical profile. These endpoints must be protected to handle the rate limits which Azure AD B2C exposes them to. You can prevent malicious requests to your REST API's by better protecting the Azure AD B2C authentication endpoints. You can protect these endpoints with a Web Application Firewall and Azure Front Door.
  
## Scenario 1: How to secure your Sign In experience
After creating a sign-in experience, or user flow, you will need to protect particular components of your flow from malicious activity depdning on which components it uses. Take the following sign in flow, with these attributes as an example:

- Local Account Email and Password authentication
- Azure Multi-Factor authentication using SMS or Phone call

The following table shows the components which require protection, and associated protection technique:

|Component |Endpoint|How to protect|
|----|----|----|
|Azure AD B2C authentication endpoints|`/authorize`, `/token`, `/.well-known/openid-configuration`, `/discovery/v2.0/keys`|Web Application Firewall, Azure Front Door|
|Sign In|NA|Identity Protection.|
|Multi factor authentication controls|NA|Authenticator app.|
|External REST API|Your API endpoint.|Authenticator app.|Web Application Firewall, Azure Front Door|
  
![Azure AD B2C security architecture diagram.](./media/security-architecture/protect-sign-in.png)
  
## Scenario 2: How to secure your Sign Up experience
After creating a sign-up experience, or user flow, you will need to protect particular components of your flow from malicious activity depdning on which components it uses. Take the following sign up flow, with these attributes as an example:

- Local Account Email and Password sign up
- Email verification via Email OTP
- Azure Multi-Factor authentication using SMS or Phone call

The following table shows the components which require protection, and associated protection technique:

|Component |Endpoint|How to protect|
|----|----|----|
|Azure AD B2C authentication endpoints|`/authorize`, `/token`, `/.well-known/openid-configuration`, `/discovery/v2.0/keys`|Web Application Firewall, Azure Front Door|
|Sign Up|NA|Dynamics Fraud Protection.|
|Email OTP|NA|Web Application Firewall, Azure Front Door.|
|Multi factor authentication controls|NA|Authenticator app.|

In this scenario, the introduction of the Web Application Firewall and Azure Front Door protection mechanisms will protect both the Azure AD B2C authenticaiton endpoints and the Email OTP components.
  
![Azure AD B2C security architecture diagram.](./media/security-architecture/protect-sign-up.png)

## Next steps 

- [Configure a Web application firewall](./partner-akamai) to protect Azure AD B2C authentication endpoints.
- [Configure Fraud prevention with Dynamics](./partner-dynamics-365-fraud-protection) to protect your authentication experiences.
- [Investigate risk with Identity Protection in Azure AD B2C](./identity-protection-investigate-risk) to discover, investigate, and remediate identity-based risks.
- [Securing phone-based multi-factor authentication (MFA)](./phone-based-mfa) to protect your phone based multi-factor authentication.
- [Configure Identity Protection](./conditional-access-user-flow) to protect your sign in experience.
- [Configure Monitoring and alerting](./azure-monitor) to be alerted to any threats.
