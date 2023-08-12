---
title: Authentication - Microsoft Threat Modeling Tool - Azure | Microsoft Docs
description: Learn about authentication mitigation in the Threat Modeling Tool. See mitigation information and view code examples.
services: security
documentationcenter: na
author: jegeib
manager: jegeib
editor: jegeib

ms.assetid: na
ms.service: information-protection
ms.subservice: aiplabels
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 02/07/2017
ms.author: jegeib
ms.custom: devx-track-csharp
---

# Security Frame: Authentication | Mitigations

| Product/Service | Article |
| --------------- | ------- |
| **Web Application**    | <ul><li>[Consider using a standard authentication mechanism to authenticate to Web Application](#standard-authn-web-app)</li><li>[Applications must handle failed authentication scenarios securely](#handle-failed-authn)</li><li>[Enable step up or adaptive authentication](#step-up-adaptive-authn)</li><li>[Ensure that administrative interfaces are appropriately locked down](#admin-interface-lockdown)</li><li>[Implement forgot password functionalities securely](#forgot-pword-fxn)</li><li>[Ensure that password and account policy are implemented](#pword-account-policy)</li><li>[Implement controls to prevent username enumeration](#controls-username-enum)</li></ul> |
| **Database** | <ul><li>[When possible, use Windows Authentication for connecting to SQL Server](#win-authn-sql)</li><li>[When possible use Azure Active Directory Authentication for Connecting to SQL Database](#aad-authn-sql)</li><li>[When SQL authentication mode is used, ensure that account and password policy are enforced on SQL server](#authn-account-pword)</li><li>[Don't use SQL Authentication in contained databases](#autn-contained-db)</li></ul> |
| **Azure Event Hub** | <ul><li>[Use per device authentication credentials using SaS tokens](#authn-sas-tokens)</li></ul> |
| **Azure Trust Boundary** | <ul><li>[Enable Azure AD Multi-Factor Authentication for Azure Administrators](#multi-factor-azure-admin)</li></ul> |
| **Service Fabric Trust Boundary** | <ul><li>[Restrict anonymous access to Service Fabric Cluster](#anon-access-cluster)</li><li>[Ensure that Service Fabric client-to-node certificate is different from node-to-node certificate](#fabric-cn-nn)</li><li>[Use AAD to authenticate clients to service fabric clusters](#aad-client-fabric)</li><li>[Ensure that service fabric certificates are obtained from an approved Certificate Authority (CA)](#fabric-cert-ca)</li></ul> |
| **Identity Server** | <ul><li>[Use standard authentication scenarios supported by Identity Server](#standard-authn-id)</li><li>[Override the default Identity Server token cache with a scalable alternative](#override-token)</li></ul> |
| **Machine Trust Boundary** | <ul><li>[Ensure that deployed application's binaries are digitally signed](#binaries-signed)</li></ul> |
| **WCF** | <ul><li>[Enable authentication when connecting to MSMQ queues in WCF](#msmq-queues)</li><li>[WCF-Do not set Message clientCredentialType to none](#message-none)</li><li>[WCF-Do not set Transport clientCredentialType to none](#transport-none)</li></ul> |
| **Web API** | <ul><li>[Ensure that standard authentication techniques are used to secure Web APIs](#authn-secure-api)</li></ul> |
| **Azure AD** | <ul><li>[Use standard authentication scenarios supported by Azure Active Directory](#authn-aad)</li><li>[Override the default MSAL token cache with a distributed cache](#msal-distributed-cache)</li><li>[Ensure that TokenReplayCache is used to prevent the replay of inbound authentication tokens](#tokenreplaycache-msal)</li><li>[Use MSAL libraries to manage token requests from OAuth2 clients to AAD (or on-premises AD)](#msal-oauth2)</li></ul> |
| **IoT Field Gateway** | <ul><li>[Authenticate devices connecting to the Field Gateway](#authn-devices-field)</li></ul> |
| **IoT Cloud Gateway** | <ul><li>[Ensure that devices connecting to Cloud gateway are authenticated](#authn-devices-cloud)</li><li>[Use per-device authentication credentials](#authn-cred)</li></ul> |
| **Azure Storage** | <ul><li>[Ensure that only the required containers and blobs are given anonymous read access](#req-containers-anon)</li><li>[Grant limited access to objects in Azure storage using SAS or SAP](#limited-access-sas)</li></ul> |

## <a id="standard-authn-web-app"></a>Consider using a standard authentication mechanism to authenticate to Web Application

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| Details | <p>Authentication is the process where an entity proves its identity, typically through credentials, such as a user name and password. There are multiple authentication protocols available which may be considered. Some of them are listed below:</p><ul><li>Client certificates</li><li>Windows based</li><li>Forms based</li><li>Federation - ADFS</li><li>Federation - Azure AD</li><li>Federation - Identity Server</li></ul><p>Consider using a standard authentication mechanism to identify the source process</p>|

## <a id="handle-failed-authn"></a>Applications must handle failed authentication scenarios securely

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| Details | <p>Applications that explicitly authenticate users must handle failed authentication scenarios securely. The authentication mechanism must:</p><ul><li>Deny access to privileged resources when authentication fails</li><li>Display a generic error message after failed authentication and access denied occurs</li></ul><p>Test for:</p><ul><li>Protection of privileged resources after failed logins</li><li>A generic error message is displayed on failed authentication and access denied event(s)</li><li>Accounts are disabled after an excessive number of failed attempts</li><ul>|

## <a id="step-up-adaptive-authn"></a>Enable step up or adaptive authentication

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| Details | <p>Verify the application has additional authorization (such as step up or adaptive authentication, via multi-factor authentication such as sending OTP in SMS, email etc. or prompting for re-authentication) so the user is challenged before being granted access to sensitive information. This rule also applies for making critical changes to an account or action</p><p>This also means that the adaptation of authentication has to be implemented in such a manner that the application correctly enforces context-sensitive authorization so as to not allow unauthorized manipulation by means of in example, parameter tampering</p>|

## <a id="admin-interface-lockdown"></a>Ensure that administrative interfaces are appropriately locked down

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| Details | The first solution is to grant access only from a certain source IP range to the administrative interface. If that solution wouldn't be possible then it's always recommended to enforce a step-up or adaptive authentication for logging in into the administrative interface |

## <a id="forgot-pword-fxn"></a>Implement forgot password functionalities securely

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| Details | <p>The first thing is to verify that forgot password and other recovery paths send a link including a time-limited activation token rather than the password itself. Additional authentication based on soft-tokens (e.g. SMS token, native mobile applications, etc.) can be required as well before the link is sent over. Second, you shouldn't lock out the users account whilst the process of getting a new password is in progress.</p><p>This could lead to a Denial of service attack whenever an attacker decides to intentionally lock out the users with an automated attack. Third, whenever the new password request was set in progress, the message you display should be generalized in order to prevent username enumeration. Fourth, always disallow the use of old passwords and implement a strong password policy.</p> |

## <a id="pword-account-policy"></a>Ensure that password and account policy are implemented

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| Details | <p>Password and account policy in compliance with organizational policy and best practices should be implemented.</p><p>To defend against brute-force and dictionary based guessing: Strong password policy must be implemented to ensure that users create complex password (e.g., 12 characters minimum length, alphanumeric and special characters).</p><p>Account lockout policies may be implemented in the following manner:</p><ul><li>**Soft lock-out:** This can be a good option for protecting your users against brute force attacks. For example, whenever the user enters a wrong password three times the application could lock down the account for a minute in order to slow down the process of brute forcing their password making it less profitable for the attacker to proceed. If you were to implement hard lock-out countermeasures for this example you would achieve a "DoS" by permanently locking out accounts. Alternatively, application may generate an OTP (One Time Password) and send it out-of-band (through email, sms etc.) to the user. Another approach may be to implement CAPTCHA after a threshold number of failed attempts is reached.</li><li>**Hard lock-out:** This type of lockout should be applied whenever you detect a user attacking your application and counter them by means of permanently locking out their account until a response team had time to do their forensics. After this process you can decide to give the user back their account or take further legal actions against them. This type of approach prevents the attacker from further penetrating your application and infrastructure.</li></ul><p>To defend against attacks on default and predictable accounts, verify that all keys and passwords are replaceable, and are generated or replaced after installation time.</p><p>If the application has to auto-generate passwords, ensure that the generated passwords are random and have high entropy.</p>|

## <a id="controls-username-enum"></a>Implement controls to prevent username enumeration

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web Application |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | All error messages should be generalized in order to prevent username enumeration. Also sometimes you can't avoid information leaking in functionalities such as a registration page. Here you need to use rate-limiting methods like CAPTCHA to prevent an automated attack by an attacker. |

## <a id="win-authn-sql"></a>When possible, use Windows Authentication for connecting to SQL Server

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database |
| **SDL Phase**               | Build |
| **Applicable Technologies** | OnPrem |
| **Attributes**              | SQL Version - All |
| **References**              | [SQL Server - Choose an Authentication Mode](/sql/relational-databases/security/choose-an-authentication-mode) |
| **Steps** | Windows Authentication uses Kerberos security protocol, provides password policy enforcement with regard to complexity validation for strong passwords, provides support for account lockout, and supports password expiration.|

## <a id="aad-authn-sql"></a>When possible use Azure Active Directory Authentication for Connecting to SQL Database

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database |
| **SDL Phase**               | Build |
| **Applicable Technologies** | SQL Azure |
| **Attributes**              | SQL Version - V12 |
| **References**              | [Connecting to SQL Database By Using Azure Active Directory Authentication](/azure/azure-sql/database/authentication-aad-overview) |
| **Steps** | **Minimum version:** Azure SQL Database V12 required to allow Azure SQL Database to use AAD Authentication against the Microsoft Directory |

## <a id="authn-account-pword"></a>When SQL authentication mode is used, ensure that account and password policy are enforced on SQL server

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [SQL Server password policy](/previous-versions/sql/sql-server-2012/ms161959(v=sql.110)) |
| **Steps** | When using SQL Server Authentication, logins are created in SQL Server that aren't based on Windows user accounts. Both the user name and the password are created by using SQL Server and stored in SQL Server. SQL Server can use Windows password policy mechanisms. It can apply the same complexity and expiration policies used in Windows to passwords used inside SQL Server. |

## <a id="autn-contained-db"></a>Do not use SQL Authentication in contained databases

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Database |
| **SDL Phase**               | Build |
| **Applicable Technologies** | OnPrem, SQL Azure |
| **Attributes**              | SQL Version - MSSQL2012, SQL Version - V12 |
| **References**              | [Security Best Practices with Contained Databases](/sql/relational-databases/databases/security-best-practices-with-contained-databases) |
| **Steps** | The absence of an enforced password policy may increase the likelihood of a weak credential being established in a contained database. Leverage Windows Authentication. |

## <a id="authn-sas-tokens"></a>Use per device authentication credentials using SaS tokens

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Event Hub |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Event Hubs authentication and security model overview](../../event-hubs/authenticate-shared-access-signature.md) |
| **Steps** | <p>The Event Hubs security model is based on a combination of Shared Access Signature (SAS) tokens and event publishers. The publisher name represents the DeviceID that receives the token. This would help associate the tokens generated with the respective devices.</p><p>All messages are tagged with originator on service side allowing detection of in-payload origin spoofing attempts. When authenticating devices, generate a per device SaS token scoped to a unique publisher.</p>|

## <a id="multi-factor-azure-admin"></a>Enable Azure AD Multi-Factor Authentication for Azure Administrators

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Trust Boundary |
| **SDL Phase**               | Deployment |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [What is Azure AD Multi-Factor Authentication?](../../active-directory/authentication/concept-mfa-howitworks.md) |
| **Steps** | <p>Multi-factor authentication (MFA) is a method of authentication that requires more than one verification method and adds a critical second layer of security to user sign-ins and transactions. It works by requiring any two or more of the following verification methods:</p><ul><li>Something you know (typically a password)</li><li>Something you have (a trusted device that isn't easily duplicated, like a phone)</li><li>Something you are (biometrics)</li><ul>|

## <a id="anon-access-cluster"></a>Restrict anonymous access to Service Fabric Cluster

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Service Fabric Trust Boundary |
| **SDL Phase**               | Deployment |
| **Applicable Technologies** | Generic |
| **Attributes**              | Environment - Azure  |
| **References**              | [Service Fabric cluster security scenarios](../../service-fabric/service-fabric-cluster-security.md) |
| **Steps** | <p>Clusters should always be secured to prevent unauthorized users from connecting to your cluster, especially when it has production workloads running on it.</p><p>While creating a service fabric cluster, ensure that the security mode is set to "secure" and configure the required X.509 server certificate. Creating an "insecure" cluster will allow any anonymous user to connect to it if it exposes management endpoints to the public Internet.</p>|

## <a id="fabric-cn-nn"></a>Ensure that Service Fabric client-to-node certificate is different from node-to-node certificate

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Service Fabric Trust Boundary |
| **SDL Phase**               | Deployment |
| **Applicable Technologies** | Generic |
| **Attributes**              | Environment - Azure, Environment - Stand alone |
| **References**              | [Service Fabric Client-to-node certificate security](../../service-fabric/service-fabric-cluster-security.md#client-to-node-certificate-security), [Connect to a secure cluster using client certificate](../../service-fabric/service-fabric-connect-to-secure-cluster.md) |
| **Steps** | <p>Client-to-node certificate security is configured while creating the cluster either through the Azure portal, Resource Manager templates or a standalone JSON template by specifying an admin client certificate and/or a user client certificate.</p><p>The admin client and user client certificates you specify should be different than the primary and secondary certificates you specify for Node-to-node security.</p>|

## <a id="aad-client-fabric"></a>Use AAD to authenticate clients to service fabric clusters

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Service Fabric Trust Boundary |
| **SDL Phase**               | Deployment |
| **Applicable Technologies** | Generic |
| **Attributes**              | Environment - Azure |
| **References**              | [Cluster security scenarios - Security Recommendations](../../service-fabric/service-fabric-cluster-security.md#security-recommendations) |
| **Steps** | Clusters running on Azure can also secure access to the management endpoints using Azure Active Directory (AAD), apart from client certificates. For Azure clusters, it is recommended that you use AAD security to authenticate clients and certificates for node-to-node security.|

## <a id="fabric-cert-ca"></a>Ensure that service fabric certificates are obtained from an approved Certificate Authority (CA)

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Service Fabric Trust Boundary |
| **SDL Phase**               | Deployment |
| **Applicable Technologies** | Generic |
| **Attributes**              | Environment - Azure |
| **References**              | [X.509 certificates and Service Fabric](../../service-fabric/service-fabric-cluster-security.md#x509-certificates-and-service-fabric) |
| **Steps** | <p>Service Fabric uses X.509 server certificates for authenticating nodes and clients.</p><p>Some important things to consider while using certificates in service fabrics:</p><ul><li>Certificates used in clusters running production workloads should be created by using a correctly configured Windows Server certificate service or obtained from an approved Certificate Authority (CA). The CA can be an approved external CA or a properly managed internal Public Key Infrastructure (PKI)</li><li>Never use any temporary or test certificates in production that are created with tools such as MakeCert.exe</li><li>You can use a self-signed certificate, but should only do so for test clusters and not in production</li></ul>|

## <a id="standard-authn-id"></a>Use standard authentication scenarios supported by Identity Server

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Identity Server |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [IdentityServer3 - The Big Picture](https://identityserver.github.io/Documentation/docsv2/overview/bigPicture.html) |
| **Steps** | <p>Below are the typical interactions supported by Identity Server:</p><ul><li>Browsers communicate with web applications</li><li>Web applications communicate with web APIs (sometimes on their own, sometimes on behalf of a user)</li><li>Browser-based applications communicate with web APIs</li><li>Native applications communicate with web APIs</li><li>Server-based applications communicate with web APIs</li><li>Web APIs communicate with web APIs (sometimes on their own, sometimes on behalf of a user)</li></ul>|

## <a id="override-token"></a>Override the default Identity Server token cache with a scalable alternative

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Identity Server |
| **SDL Phase**               | Deployment |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Identity Server Deployment - Caching](https://identityserver.github.io/Documentation/docsv2/advanced/deployment.html) |
| **Steps** | <p>IdentityServer has a simple built-in in-memory cache. While this is good for small scale native apps, it does not scale for mid tier and backend applications for the following reasons:</p><ul><li>These applications are accessed by many users at once. Saving all access tokens in the same store creates isolation issues and presents challenges when operating at scale: many users, each with as many tokens as the resources the app accesses on their behalf, can mean huge numbers and very expensive lookup operations</li><li>These applications are typically deployed on distributed topologies, where multiple nodes must have access to the same cache</li><li>Cached tokens must survive process recycles and deactivations</li><li>For all the above reasons, while implementing web apps, it is recommended to override the default Identity Server's token cache with a scalable alternative such as Azure Cache for Redis</li></ul>|

## <a id="binaries-signed"></a>Ensure that deployed application's binaries are digitally signed

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Machine Trust Boundary |
| **SDL Phase**               | Deployment |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Ensure that deployed application's binaries are digitally signed so that the integrity of the binaries can be verified|

## <a id="msmq-queues"></a>Enable authentication when connecting to MSMQ queues in WCF

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | WCF |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic, NET Framework 3 |
| **Attributes**              | N/A |
| **References**              | [MSDN](/previous-versions/msp-n-p/ff648500(v=pandp.10)) |
| **Steps** | Program fails to enable authentication when connecting to MSMQ queues, an attacker can anonymously submit messages to the queue for processing. If authentication is not used to connect to an MSMQ queue used to deliver a message to another program, an attacker could submit an anonymous message that is malicious.|

### Example
The `<netMsmqBinding/>` element of the WCF configuration file below instructs WCF to disable authentication when connecting to an MSMQ queue for message delivery.
```
<bindings>
    <netMsmqBinding>
        <binding>
            <security>
                <transport msmqAuthenticationMode=""None"" />
            </security>
        </binding>
    </netMsmqBinding>
</bindings>
```
Configure MSMQ to require Windows Domain or Certificate authentication at all times for any incoming or outgoing messages.

### Example
The `<netMsmqBinding/>` element of the WCF configuration file below instructs WCF to enable certificate authentication when connecting to an MSMQ queue. The client is authenticated using X.509 certificates. The client certificate must be present in the certificate store of the server.
```
<bindings>
    <netMsmqBinding>
        <binding>
            <security>
                <transport msmqAuthenticationMode=""Certificate"" />
            </security>
        </binding>
    </netMsmqBinding>
</bindings>
```

## <a id="message-none"></a>WCF-Do not set Message clientCredentialType to none

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | WCF |
| **SDL Phase**               | Build |
| **Applicable Technologies** | .NET Framework 3 |
| **Attributes**              | Client Credential Type - None |
| **References**              | [MSDN](/previous-versions/msp-n-p/ff648500(v=pandp.10)), [Fortify](https://community.microfocus.com/t5/UFT-Discussions/UFT-API-Test-with-WCF-wsHttpBinding/m-p/600927) |
| **Steps** | The absence of authentication means everyone is able to access this service. A service that does not authenticate its clients allows access to all users. Configure the application to authenticate against client credentials. This can be done by setting the message clientCredentialType to Windows or Certificate. |

### Example
```
<message clientCredentialType=""Certificate""/>
```

## <a id="transport-none"></a>WCF-Do not set Transport clientCredentialType to none

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | WCF |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic, .NET Framework 3 |
| **Attributes**              | Client Credential Type - None |
| **References**              | [MSDN](/previous-versions/msp-n-p/ff648500(v=pandp.10)), [Fortify](https://community.microfocus.com/t5/UFT-Discussions/UFT-API-Test-with-WCF-wsHttpBinding/m-p/600927) |
| **Steps** | The absence of authentication means everyone is able to access this service. A service that does not authenticate its clients allows all users to access its functionality. Configure the application to authenticate against client credentials. This can be done by setting the transport clientCredentialType to Windows or Certificate. |

### Example
```
<transport clientCredentialType=""Certificate""/>
```

## <a id="authn-secure-api"></a>Ensure that standard authentication techniques are used to secure Web APIs

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Web API |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Authentication and Authorization in ASP.NET Web API](https://www.asp.net/web-api/overview/security/authentication-and-authorization-in-aspnet-web-api), [External Authentication Services with ASP.NET Web API (C#)](https://www.asp.net/web-api/overview/security/external-authentication-services) |
| **Steps** | <p>Authentication is the process where an entity proves its identity, typically through credentials, such as a user name and password. There are multiple authentication protocols available which may be considered. Some of them are listed below:</p><ul><li>Client certificates</li><li>Windows based</li><li>Forms based</li><li>Federation - ADFS</li><li>Federation - Azure AD</li><li>Federation - Identity Server</li></ul><p>Links in the references section provide low-level details on how each of the authentication schemes can be implemented to secure a Web API.</p>|

## <a id="authn-aad"></a>Use standard authentication scenarios supported by Azure Active Directory

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure AD |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Authentication Scenarios for Azure AD](../../active-directory/develop/authentication-vs-authorization.md), [Azure Active Directory Code Samples](../../active-directory/azuread-dev/sample-v1-code.md), [Azure Active Directory developer's guide](../../active-directory/develop/index.yml) |
| **Steps** | <p>Azure Active Directory (Azure AD) simplifies authentication for developers by providing identity as a service, with support for industry-standard protocols such as OAuth 2.0 and OpenID Connect. Below are the five primary application scenarios supported by Azure AD:</p><ul><li>Web Browser to Web Application: A user needs to sign in to a web application that is secured by Azure AD</li><li>Single Page Application (SPA): A user needs to sign in to a single page application that is secured by Azure AD</li><li>Native Application to Web API: A native application that runs on a phone, tablet, or PC needs to authenticate a user to get resources from a web API that is secured by Azure AD</li><li>Web Application to Web API: A web application needs to get resources from a web API secured by Azure AD</li><li>Daemon or Server Application to Web API: A daemon application or a server application with no web user interface needs to get resources from a web API secured by Azure AD</li></ul><p>Please refer to the links in the references section for low-level implementation details</p>|

## <a id="msal-distributed-cache"></a>Override the default MSAL token cache with a distributed cache

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure AD |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Token cache serialization in MSAL.NET](../../active-directory/develop/msal-net-token-cache-serialization.md)  |
| **Steps** | <p>The default cache that MSAL (Microsoft Authentication Library) uses is an in-memory cache, and is scalable. However there are different options available that you can use as an alternative, such as a distributed token cache. These have L1/L2 mechanisms, where L1 is in memory and L2 is the distributed cache implementation. These can be accordingly configured to limit L1 memory, encrypt or set eviction policies. Other alternatives include Redis, SQL Server or Azure Comsos DB caches. An implementation of a distributed token cache can be found in the following [Tutorial: Get started with ASP.NET Core MVC](/aspnet/core/tutorials/first-mvc-app/start-mvc).</p>|

## <a id="tokenreplaycache-msal"></a>Ensure that TokenReplayCache is used to prevent the replay of MSAL authentication tokens

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure AD |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [Modern Authentication with Azure Active Directory for Web Applications](/archive/blogs/microsoft_press/new-book-modern-authentication-with-azure-active-directory-for-web-applications) |
| **Steps** | <p>The TokenReplayCache property allows developers to define a token replay cache, a store that can be used for saving tokens for the purpose of verifying that no token can be used more than once.</p><p>This is a measure against a common attack, the aptly called token replay attack: an attacker intercepting the token sent at sign-in might try to send it to the app again (“replay” it) for establishing a new session. E.g., In OIDC code-grant flow, after successful user authentication, a request to "/signin-oidc" endpoint of the relying party is made with "id_token", "code" and "state" parameters.</p><p>The relying party validates this request and establishes a new session. If an adversary captures this request and replays it, he/she can establish a successful session and spoof the user. The presence of the nonce in OpenID Connect can limit but not fully eliminate the circumstances in which the attack can be successfully enacted. To protect their applications, developers can provide an implementation of ITokenReplayCache and assign an instance to TokenReplayCache.</p>|

### Example
```csharp
// ITokenReplayCache defined in MSAL
public interface ITokenReplayCache
{
bool TryAdd(string securityToken, DateTime expiresOn);
bool TryFind(string securityToken);
}
```

### Example
Here is a sample implementation of the ITokenReplayCache interface. (Please customize and implement your project-specific caching framework)
```csharp
public class TokenReplayCache : ITokenReplayCache
{
    private readonly ICacheProvider cache; // Your project-specific cache provider
    public TokenReplayCache(ICacheProvider cache)
    {
        this.cache = cache;
    }
    public bool TryAdd(string securityToken, DateTime expiresOn)
    {
        if (this.cache.Get<string>(securityToken) == null)
        {
            this.cache.Set(securityToken, securityToken);
            return true;
        }
        return false;
    }
    public bool TryFind(string securityToken)
    {
        return this.cache.Get<string>(securityToken) != null;
    }
}
```
The implemented cache has to be referenced in OIDC options via the "TokenValidationParameters" property as follows.
```csharp
OpenIdConnectOptions openIdConnectOptions = new OpenIdConnectOptions
{
    AutomaticAuthenticate = true,
    ... // other configuration properties follow..
    TokenValidationParameters = new TokenValidationParameters
    {
        TokenReplayCache = new TokenReplayCache(/*Inject your cache provider*/);
    }
}
```

Please note that to test the effectiveness of this configuration, login into your local OIDC-protected application and capture the request to `"/signin-oidc"` endpoint in fiddler. When the protection is not in place, replaying this request in fiddler will set a new session cookie. When the request is replayed after the TokenReplayCache protection is added, the application will throw an exception as follows: `SecurityTokenReplayDetectedException: IDX10228: The securityToken has previously been validated, securityToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSIsImtpZCI6Ik1uQ1......`

## <a id="msal-oauth2"></a>Use MSAL libraries to manage token requests from OAuth2 clients to AAD (or on-premises AD)

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure AD |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | [MSAL](../../active-directory/develop/msal-overview.md) |
| **Steps** | <p>The Microsoft Authentication Library (MSAL) enables developers to acquire security tokens from the Microsoft identity platform to authenticate users and access secured web APIs. It can be used to provide secure access to Microsoft Graph, other Microsoft APIs, third-party web APIs, or your own web API. MSAL supports many different application architectures and platforms including .NET, JavaScript, Java, Python, Android, and iOS. 

MSAL gives you many ways to get tokens, with a consistent API for many platforms. There is no need to directly use the OAuth libraries or code against the protocol in your application, and can acquire tokens on behalf of a user or application (when applicable to the platform). 

MSAL also maintains a token cache and refreshes tokens for you when they're close to expiring. MSAL can also help you specify which audience you want your application to sign in, and help you set up your application from configuration files, and troubleshoot your app.

## <a id="authn-devices-field"></a>Authenticate devices connecting to the Field Gateway

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Field Gateway |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A  |
| **References**              | N/A  |
| **Steps** | Ensure that each device is authenticated by the Field Gateway before accepting data from them and before facilitating upstream communications with the Cloud Gateway. Also, ensure that devices connect with a per device credential so that individual devices can be uniquely identified.|

## <a id="authn-devices-cloud"></a>Ensure that devices connecting to Cloud gateway are authenticated

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Cloud Gateway |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic, C#, Node.JS,  |
| **Attributes**              | N/A, Gateway choice - Azure IoT Hub |
| **References**              | N/A, [Azure IoT hub with .NET](../../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-csharp), [Getting Started with IoT hub and Node JS](../../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-nodejs), [Securing IoT with SAS and certificates](../../iot-hub/iot-hub-dev-guide-sas.md), [Git repository](https://github.com/Azure/azure-iot-sdks/) |
| **Steps** | <ul><li>**Generic:** Authenticate the device using Transport Layer Security (TLS) or IPSec. Infrastructure should support using pre-shared key (PSK) on those devices that cannot handle full asymmetric cryptography. Leverage Azure AD, Oauth.</li><li>**C#:** When creating a DeviceClient instance, by default, the Create method creates a DeviceClient instance that uses the AMQP protocol to communicate with IoT Hub. To use the HTTPS protocol, use the override of the Create method that enables you to specify the protocol. If you use the HTTPS protocol, you should also add the `Microsoft.AspNet.WebApi.Client` NuGet package to your project to include the `System.Net.Http.Formatting` namespace.</li></ul>|

### Example
```csharp
static DeviceClient deviceClient;

static string deviceKey = "{device key}";
static string iotHubUri = "{iot hub hostname}";

var messageString = "{message in string format}";
var message = new Message(Encoding.ASCII.GetBytes(messageString));

deviceClient = DeviceClient.Create(iotHubUri, new DeviceAuthenticationWithRegistrySymmetricKey("myFirstDevice", deviceKey));

await deviceClient.SendEventAsync(message);
```

### Example
**Node.JS: Authentication**
#### Symmetric key
* Create an IoT hub on Azure
* Create an entry in the device identity registry
    ```javascript
    var device = new iothub.Device(null);
    device.deviceId = <DeviceId >
    registry.create(device, function(err, deviceInfo, res) {})
    ```
* Create a simulated device
    ```javascript
    var clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
    var Message = require('azure-iot-device').Message;
    var connectionString = 'HostName=<HostName>DeviceId=<DeviceId>SharedAccessKey=<SharedAccessKey>';
    var client = clientFromConnectionString(connectionString);
    ```
  #### SAS Token
* Gets internally generated when using symmetric key but we can generate and use it explicitly as well
* Define a protocol : `var Http = require('azure-iot-device-http').Http;`
* Create a sas token :
    ```javascript
    resourceUri = encodeURIComponent(resourceUri.toLowerCase()).toLowerCase();
    var deviceName = "<deviceName >";
    var expires = (Date.now() / 1000) + expiresInMins * 60;
    var toSign = resourceUri + '\n' + expires;
    // using crypto
    var decodedPassword = new Buffer(signingKey, 'base64').toString('binary');
    const hmac = crypto.createHmac('sha256', decodedPassword);
    hmac.update(toSign);
    var base64signature = hmac.digest('base64');
    var base64UriEncoded = encodeURIComponent(base64signature);
    // construct authorization string
    var token = "SharedAccessSignature sr=" + resourceUri + "%2fdevices%2f"+deviceName+"&sig="
  + base64UriEncoded + "&se=" + expires;
    if (policyName) token += "&skn="+policyName;
    return token;
    ```
* Connect using sas token:
    ```javascript
    Client.fromSharedAccessSignature(sas, Http);
    ```
  #### Certificates
* Generate a self signed X509 certificate using any tool such as OpenSSL to generate a .cert and .key files to store the certificate and the key respectively
* Provision a device that accepts secured connection using certificates.
    ```javascript
    var connectionString = '<connectionString>';
    var registry = iothub.Registry.fromConnectionString(connectionString);
    var deviceJSON = {deviceId:"<deviceId>",
    authentication: {
        x509Thumbprint: {
        primaryThumbprint: "<PrimaryThumbprint>",
        secondaryThumbprint: "<SecondaryThumbprint>"
        }
    }}
    var device = deviceJSON;
    registry.create(device, function (err) {});
    ```
* Connect a device using a certificate
    ```javascript
    var Protocol = require('azure-iot-device-http').Http;
    var Client = require('azure-iot-device').Client;
    var connectionString = 'HostName=<HostName>DeviceId=<DeviceId>x509=true';
    var client = Client.fromConnectionString(connectionString, Protocol);
    var options = {
        key: fs.readFileSync('./key.pem', 'utf8'),
        cert: fs.readFileSync('./server.crt', 'utf8')
    };
    // Calling setOptions with the x509 certificate and key (and optionally, passphrase) will configure the client //transport to use x509 when connecting to IoT Hub
    client.setOptions(options);
    //call fn to execute after the connection is set up
    client.open(fn);
    ```

## <a id="authn-cred"></a>Use per-device authentication credentials

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | IoT Cloud Gateway  |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | Gateway choice - Azure IoT Hub |
| **References**              | [Azure IoT Hub Security Tokens](../../iot-hub/iot-hub-dev-guide-sas.md) |
| **Steps** | Use per device authentication credentials using SaS tokens based on Device key or Client Certificate, instead of IoT Hub-level shared access policies. This prevents the reuse of authentication tokens of one device or field gateway by another |

## <a id="req-containers-anon"></a>Ensure that only the required containers and blobs are given anonymous read access

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Storage |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | StorageType - Blob |
| **References**              | [Manage anonymous read access to containers and blobs](../../storage/blobs/anonymous-read-access-configure.md), [Shared Access Signatures, Part 1: Understanding the SAS model](../../storage/common/storage-sas-overview.md) |
| **Steps** | <p>By default, a container and any blobs within it may be accessed only by the owner of the storage account. To give anonymous users read permissions to a container and its blobs, one can set the container permissions to allow public access. Anonymous users can read blobs within a publicly accessible container without authenticating the request.</p><p>Containers provide the following options for managing container access:</p><ul><li>Full public read access: Container and blob data can be read via anonymous request. Clients can enumerate blobs within the container via anonymous request, but cannot enumerate containers within the storage account.</li><li>Public read access for blobs only: Blob data within this container can be read via anonymous request, but container data is not available. Clients cannot enumerate blobs within the container via anonymous request</li><li>No public read access: Container and blob data can be read by the account owner only</li></ul><p>Anonymous access is best for scenarios where certain blobs should always be available for anonymous read access. For finer-grained control, one can create a shared access signature, which enables to delegate restricted access using different permissions and over a specified time interval. Ensure that containers and blobs, which may potentially contain sensitive data, are not given anonymous access accidentally</p>|

## <a id="limited-access-sas"></a>Grant limited access to objects in Azure storage using SAS or SAP

| Title                   | Details      |
| ----------------------- | ------------ |
| **Component**               | Azure Storage |
| **SDL Phase**               | Build |
| **Applicable Technologies** | Generic |
| **Attributes**              | N/A |
| **References**              | [Shared Access Signatures, Part 1: Understanding the SAS model](../../storage/common/storage-sas-overview.md), [Shared Access Signatures, Part 2: Create and use a SAS with Blob storage](../../storage/common/storage-sas-overview.md), [How to delegate access to objects in your account using Shared Access Signatures and Stored Access Policies](../../storage/blobs/security-recommendations.md#identity-and-access-management) |
| **Steps** | <p>Using a shared access signature (SAS) is a powerful way to grant limited access to objects in a storage account to other clients, without having to expose account access key. The SAS is a URI that encompasses in its query parameters all of the information necessary for authenticated access to a storage resource. To access storage resources with the SAS, the client only needs to pass in the SAS to the appropriate constructor or method.</p><p>You can use a SAS when you want to provide access to resources in your storage account to a client that can't be trusted with the account key. Your storage account keys include both a primary and secondary key, both of which grant administrative access to your account and all of the resources in it. Exposing either of your account keys opens your account to the possibility of malicious or negligent use. Shared access signatures provide a safe alternative that allows other clients to read, write, and delete data in your storage account according to the permissions you've granted, and without need for the account key.</p><p>If you have a logical set of parameters that are similar each time, using a Stored Access Policy (SAP) is a better idea. Because using a SAS derived from a Stored Access Policy gives you the ability to revoke that SAS immediately, it is the recommended best practice to always use Stored Access Policies when possible.</p>|
