---
title: Microsoft Entra pass-through authentication security deep dive
description: Learn how Microsoft Entra pass-through authentication protects your on-premises accounts.
services: active-directory
keywords: Azure AD Connect pass-through authentication, install Active Directory, required components for Azure AD, SSO, Single Sign-on
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Microsoft Entra pass-through authentication security deep dive

This article provides a more detailed description of how Microsoft Entra pass-through authentication works. It focuses on the security aspects of the feature. This article is for security and IT administrators, chief compliance and security officers, and other IT professionals who are responsible for IT security and compliance at organizations or enterprises of any size.

The topics addressed include:

- Detailed technical information about how to install and register authentication agents.
- Detailed technical information about password encryption during user sign-in.
- The security of the channels between on-premises authentication agents and Microsoft Entra ID.
- Detailed technical information about how to keep the authentication agents operationally secure.

## Pass-through authentication key security capabilities

Pass-through authentication has these key security capabilities:

- It's built on a secure multi-tenanted architecture that provides isolation of sign-in requests between tenants.
- On-premises passwords are never stored in the cloud in any form.
- On-premises authentication agents that listen for and respond to password validation requests make only outbound connections from within your network. There's no requirement to install these authentication agents in a perimeter network (also known as *DMZ*, *demilitarized zone*, and *screened subnet*). As a best practice, treat all servers that are running authentication agents as Tier 0 systems (see [reference](/windows-server/identity/securing-privileged-access/securing-privileged-access-reference-material)).
- Only standard ports (port 80 and port 443) are used for outbound communication from the authentication agents to Microsoft Entra ID. You don't need to open inbound ports on your firewall.
  - Port 443 is used for all authenticated outbound communication.
  - Port 80 is used only for downloading certificate revocation lists (CRLs) to ensure that none of the certificates this feature uses have been revoked.
  - For the complete list of the network requirements, see the [Microsoft Entra pass-through authentication quickstart](how-to-connect-pta-quick-start.md#step-1-check-the-prerequisites).
- Passwords that users provide during sign-in are encrypted in the cloud before the on-premises authentication agents accept them for validation against Windows Server Active Directory (Windows Server AD).
- The HTTPS channel between Microsoft Entra ID and the on-premises authentication agent is secured by using mutual authentication.
- Pass-through authentication protects your user accounts by working seamlessly with [Microsoft Entra Conditional Access policies](../../conditional-access/overview.md), including multifactor authentication (MFA), [blocking legacy authentication](../../conditional-access/concept-conditional-access-conditions.md), and by [filtering out brute force password attacks](../../authentication/howto-password-smart-lockout.md).

## Components involved in pass-through authentication

For general details about operational, service, and data security for Microsoft Entra ID, see the [Trust Center](https://azure.microsoft.com/support/trust-center/). The following components are involved when you use pass-through authentication for user sign-in:

- **Microsoft Entra Security Token Service (Microsoft Entra STS)**: A stateless STS that processes sign-in requests and issues security tokens to user browsers, clients, or services as required.
- **Azure Service Bus**: Provides cloud-enabled communication with enterprise messaging and relays communication that helps you connect on-premises solutions with the cloud.
- **Microsoft Entra Connect Authentication Agent**: An on-premises component that listens for and responds to password validation requests.
- **Azure SQL Database**: Holds information about your tenant's authentication agents, including their metadata and encryption keys.
- **Windows Server AD**: On-premises Active Directory, where user accounts and their passwords are stored.

## Installation and registration of authentication agents

Authentication agents are installed and registered with Microsoft Entra ID when you take one of the following actions:

- [Enable pass-through authentication through Microsoft Entra Connect](./how-to-connect-pta-quick-start.md#step-2-enable-the-feature)
- [Add more authentication agents to ensure the high availability of sign-in requests](./how-to-connect-pta-quick-start.md#step-4-ensure-high-availability)

Getting an authentication agent operational involves three main phases:

- Installation
- Registration
- Initialization

The following sections discuss these phases in detail.

### Authentication agent installation

Only a Hybrid Identity Administrator account can install an authentication agent (by using Microsoft Entra Connect or a standalone instance) on an on-premises server.

Installation adds two new entries to the list in **Control Panel** > **Programs** > **Programs and Features**:

- The authentication agent application itself. This application runs with [NetworkService](/windows/win32/services/networkservice-account) privileges.
- The Updater application that's used to auto update the authentication agent. This application runs with [LocalSystem](/windows/win32/services/localsystem-account) privileges.

> [!IMPORTANT]
> From a security standpoint, administrators should treat the server running the pass-through authentication agent as if it were a domain controller. The pass-through authentication agent agent servers should be hardened as outlined in [Secure domain controllers against attack](/windows-server/identity/ad-ds/plan/security-best-practices/securing-domain-controllers-against-attack).

### Authentication agent registration

After you install the authentication agent, it registers itself with Microsoft Entra ID. Microsoft Entra ID assigns each authentication agent a unique, digital identity certificate that it can use for secure communication with Microsoft Entra ID.

The registration procedure also binds the authentication agent with your tenant. Then, Microsoft Entra ID knows that this specific authentication agent is the only one that's authorized to handle password validation requests for your tenant. This procedure is repeated for each new authentication agent that you register.

The authentication agents use the following steps to register themselves with Microsoft Entra ID:

:::image type="content" source="media/how-to-connect-pta-security-deep-dive/pta1.png" border="false" alt-text="Diagram that depicts authentication agent registration with Azure AD.":::

1. Microsoft Entra first requests that a hybrid identity administrator sign in to Microsoft Entra ID with their credentials. During sign-in, the authentication agent acquires an access token that it can use on behalf of the user.
1. The authentication agent then generates a key pair: a public key and a private key.
    - The key pair is generated through standard RSA 2,048-bit encryption.
    - The private key stays on the on-premises server where the authentication agent resides.
1. The authentication agent makes a registration request to Microsoft Entra ID over HTTPS, with the following components included in the request:
    - The access token that the agent acquired.
    - The public key that was generated.
    - A Certificate Signing Request (*CSR* or *Certificate Request*). This request applies for a digital identity certificate, with Microsoft Entra ID as its certificate authority (CA).
1. Microsoft Entra ID validates the access token in the registration request and verifies that the request came from a hybrid identity administrator.
1. Microsoft Entra ID then signs a digital identity certificate and sends it back to the authentication agent.
    - The root CA in Microsoft Entra ID is used to sign the certificate.

      > [!NOTE]
      > This CA is *not* in the Windows Trusted Root Certificate Authorities store.
    - The CA is used only by the pass-through authentication feature. The CA is used only to sign CSRs during the authentication agent registration.
    - No other Microsoft Entra service uses this CA.
    - The certificate’s subject (also called *Distinguished Name* or *DN*) is set to your tenant ID. This DN is a GUID that uniquely identifies your tenant. This DN scopes the certificate for use only with your tenant.
1. Microsoft Entra ID stores the public key of the authentication agent in a database in Azure SQL Database. Only Microsoft Entra ID can access the database.
1. The certificate that's issued is stored on the on-premises server in the Windows certificate store (specifically, in [CERT_SYSTEM_STORE_LOCAL_MACHINE](/windows/win32/seccrypto/system-store-locations#CERT_SYSTEM_STORE_LOCAL_MACHINE)). The certificate is used by both the authentication agent and the Updater application.

### Authentication agent initialization

When the authentication agent starts, either for the first time after registration or after a server restart, it needs a way to communicate securely with the Microsoft Entra service so that it can start to accept password validation requests.

:::image type="content" source="media/how-to-connect-pta-security-deep-dive/pta2.png" border="false" alt-text="Diagram that depicts authentication agent initialization.":::

Here's how authentication agents are initialized:

1. The authentication agent makes an outbound bootstrap request to Microsoft Entra ID.

    This request is made over port 443 and is over a mutually authenticated HTTPS channel. The request uses the same certificate that was issued during authentication agent registration.
1. Microsoft Entra ID responds to the request by providing an access key to a Service Bus queue that's unique to your tenant, and which is identified by your tenant ID.
1. The authentication agent makes a persistent outbound HTTPS connection (over port 443) to the queue.

The authentication agent is now ready to retrieve and handle password validation requests.

If you have multiple authentication agents registered on your tenant, the initialization procedure ensures that each agent connects to the same Service Bus queue.

## How pass-through authentication processes sign-in requests

The following diagram shows how pass-through authentication processes user sign-in requests:

:::image type="content" source="media/how-to-connect-pta-security-deep-dive/pta3.png" border="false" alt-text="Diagram that depicts how pass-through authentication processes user sign-in requests.":::

How pass-through authentication handles a user sign-in request:

1. A user tries to access an application, for example, [Outlook Web App](https://outlook.office365.com/owa).
1. If the user isn't already signed in, the application redirects the browser to the Microsoft Entra sign-in page.
1. The Microsoft Entra STS service responds back with the **User sign-in** page.
1. The user enters their username in the **User sign-in** page, and then selects the **Next** button.
1. The user enters their password in the **User sign-in** page, and then selects the **Sign-in** button.
1. The username and password are submitted to Microsoft Entra STS in an HTTPS POST request.
1. Microsoft Entra STS retrieves public keys for all the authentication agents that are registered on your tenant from Azure SQL Database and encrypts the password by using the keys.

   It produces one encrypted password value for each authentication agent registered on your tenant.
1. Microsoft Entra STS places the password validation request, which consists of the username and the encrypted password values, in the Service Bus queue that's specific to your tenant.
1. Because the initialized authentication agents are persistently connected to the Service Bus queue, one of the available authentication agents retrieves the password validation request.
1. The authentication agent uses an identifier to locate the encrypted password value that's specific to its public key. It decrypts the public key by using its private key.
1. The authentication agent attempts to validate the username and the password against Windows Server AD by using the [Win32 LogonUser API](/windows/win32/api/winbase/nf-winbase-logonusera) with the `dwLogonType` parameter set to `LOGON32_LOGON_NETWORK`.
    - This API is the same API that's used by Active Directory Federation Services (AD FS) to sign in users in a federated sign-in scenario.
    - This API relies on the standard resolution process in Windows Server to locate the domain controller.
1. The authentication agent receives the result from Windows Server AD, such as success, username or password is incorrect, or password is expired.

   > [!NOTE]
   > If the authentication agent fails during the sign-in process, the entire sign-in request is dropped. Sign-in requests aren't handed off from one on-premises authentication agent to another on-premises authentication agent. These agents communicate only with the cloud, and not with each other.

1. The authentication agent forwards the result back to Microsoft Entra STS over an outbound mutually authenticated HTTPS channel over port 443. Mutual authentication uses the certificate that was issued to the authentication agent during registration.
1. Microsoft Entra STS verifies that this result correlates with the specific sign-in request on your tenant.
1. Microsoft Entra STS continues with the sign-in procedure as configured. For example, if the password validation was successful, the user might be challenged for MFA or be redirected back to the application.

<a name="operational-security-of-the-authentication-agents"></a>

## Authentication agent operational security

To ensure that pass-through authentication remains operationally secure, Microsoft Entra ID periodically renews authentication agent certificates. Microsoft Entra ID triggers the renewals. The renewals aren't governed by the authentication agents themselves.

:::image type="content" source="media/how-to-connect-pta-security-deep-dive/pta4.png" border="false" alt-text="Diagram that depicts how operational security works with pass-through authentication.":::

To renew an authentication agent's trust with Microsoft Entra ID:

1. The authentication agent pings Microsoft Entra every few hours to check if it's time to renew its certificate. The certificate is renewed 30 days before it expires.

   This check is done over a mutually authenticated HTTPS channel and uses the same certificate that was issued during registration.
1. If the service indicates that it's time to renew, the authentication agent generates a new key pair: a public key and a private key.
    - These keys are generated through standard RSA 2,048-bit encryption.
    - The private key never leaves the on-premises server.
1. The authentication agent then makes a certificate renewal request to Microsoft Entra ID over HTTPS. The following components are included in the request:
    - The existing certificate that's retrieved from the CERT_SYSTEM_STORE_LOCAL_MACHINE location in the Windows certificate store. No global administrator is involved in this procedure, so no access token is required for a global administrator.
    - The public key generated in step 2.
    - A CSR. This request applies for a new digital identity certificate, with Microsoft Entra ID as its CA.
1. Microsoft Entra ID validates the existing certificate in the certificate renewal request. Then it verifies that the request came from an authentication agent that's registered on your tenant.
1. If the existing certificate is still valid, Microsoft Entra ID signs a new digital identity certificate and issues the new certificate back to the authentication agent.
1. If the existing certificate has expired, Microsoft Entra ID deletes the authentication agent from your tenant’s list of registered authentication agents. Then a global admin or a hybrid identity administrator must manually install and register a new authentication agent.
    - Use the Microsoft Entra ID root CA to sign the certificate.
    - Set the certificate’s DN to your tenant ID, a GUID that uniquely identifies your tenant. The DN scopes the certificate to your tenant only.
1. Microsoft Entra ID stores the new public key of the authentication agent in a database in Azure SQL Database that only it has access to. It also invalidates the old public key associated with the authentication agent.
1. The new certificate (issued in step 5) is then stored on the server in the Windows certificate store (specifically, in the [CERT_SYSTEM_STORE_CURRENT_USER](/windows/win32/seccrypto/system-store-locations#CERT_SYSTEM_STORE_CURRENT_USER) location).

   Because the trust renewal procedure happens non-interactively (without the presence of the global administrator or hybrid identity administrator), the authentication agent no longer has access to update the existing certificate in the CERT_SYSTEM_STORE_LOCAL_MACHINE location.

   > [!NOTE]
   > This procedure does not remove the certificate itself from the CERT_SYSTEM_STORE_LOCAL_MACHINE location.
1. From this point, the new certificate is used for authentication. Every subsequent renewal of the certificate replaces the certificate in the CERT_SYSTEM_STORE_LOCAL_MACHINE location.

## Authentication agent auto update

The Updater application automatically updates the authentication agent when a new version (with bug fixes or performance enhancements) is released. The Updater application doesn't handle any password validation requests for your tenant.

Microsoft Entra ID hosts the new version of the software as a signed Windows Installer package (MSI). The MSI is signed by using [Microsoft Authenticode](/previous-versions/windows/internet-explorer/ie-developer/platform-apis/ms537359(v=vs.85)) with SHA-256 as the digest algorithm.

:::image type="content" source="media/how-to-connect-pta-security-deep-dive/pta5.png" border="false" alt-text="Diagram that shows how an authentication agent is auto updated.":::

To auto update an authentication agent:

1. The Updater application pings Microsoft Entra every hour to check if a new version of the authentication agent is available.

   This check is done over a mutually authenticated HTTPS channel by using the same certificate that was issued during registration. The authentication agent and the Updater share the certificate that is stored on the server.
1. If a new version is available, Microsoft Entra ID returns the signed MSI back to the Updater.
1. The Updater verifies that the MSI is signed by Microsoft.
1. The Updater runs the MSI. In this process, the Updater application:

   > [!NOTE]
   > The Updater runs with [Local System](/windows/win32/services/localsystem-account) privileges.

   1. Stops the authentication agent service.
   1. Installs the new version of the authentication agent on the server.
   1. Restarts the authentication agent service.

> [!NOTE]
> If you have multiple authentication agents registered on your tenant, Microsoft Entra ID doesn't renew their certificates or update them at the same time. Instead, Microsoft Entra ID renews the certificates one at a time to ensure high availability for sign-in requests.

## Next steps

- [Current limitations](how-to-connect-pta-current-limitations.md): Learn what scenarios are supported.
- [Quickstart](how-to-connect-pta-quick-start.md): Get set up with Microsoft Entra pass-through authentication.
- [Migrate from AD FS to pass-through authentication](https://aka.ms/adfstoptadpdownload): Review this detailed guide that helps you migrate from AD FS or other federation technologies to pass-through authentication.
- [Smart Lockout](../../authentication/howto-password-smart-lockout.md): Configure the Smart Lockout capability on your tenant to protect user accounts.
- [How it works](how-to-connect-pta-how-it-works.md): Learn the basics of how Microsoft Entra pass-through authentication works.
- [Frequently asked questions](how-to-connect-pta-faq.yml): Find answers to common questions.
- [Troubleshoot](tshoot-connect-pass-through-authentication.md): Learn how to resolve common problems with pass-through authentication.
- [Microsoft Entra seamless SSO](how-to-connect-sso.md): Learn more about the complementary Microsoft Entra feature Seamless single sign-on.
