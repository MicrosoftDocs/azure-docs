---
title: Resource forest concepts for Azure AD Domain Services | Microsoft Docs
description: Learn what a resource forest is in Azure Active Directory Domain Services and how they benefit your organization in hybrid environment with limited user authentication options or security concerns.
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: conceptual
ms.date: 03/30/2020
ms.author: iainfou
---

# Resource forest concepts and features for Azure Active Directory Domain Services

Azure Active Directory Domain Services (Azure AD DS) provides a sign-in experience for legacy, on-premises, line-of-business applications. Users, groups, and password hashes of on-premises and cloud users are synchronized to the Azure AD DS managed domain. These synchronized password hashes are what gives users a single set of credentials they can use for the on-premises AD DS, Office 365, and Azure Active Directory.

Although secure and provides additional security benefits, some organizations can't synchronize those user passwords hashes to Azure AD or Azure AD DS. Users in an organization may not know their password because they only use smart card authentication. These limitations prevent some organizations from using Azure AD DS to lift and shift on-premises classic applications to Azure.

To address these needs and restrictions, you can create a managed domain that uses a resource forest. This conceptual article explains what forests are, and how they trust other resources to provide a secure authentication method. Azure AD DS resource forests are currently in preview.

> [!IMPORTANT]
> Azure AD DS resource forests don't currently support Azure HDInsight or Azure Files. The default Azure AD DS user forests do support both of these additional services.

## What are forests?

A *forest* is a logical construct used by Active Directory Domain Services (AD DS) to group one or more *domains*. The domains then store objects for user or groups, and provide authentication services.

In Azure AD DS, the forest only contains one domain. On-premises AD DS forests often contain many domains. In large organizations, especially after mergers and acquisitions, you may end up with multiple on-premises forests that each then contain multiple domains.

By default, a managed domain is created as a *user* forest. This type of forest synchronizes all objects from Azure AD, including any user accounts created in an on-premises AD DS environment. User accounts can directly authenticate against the managed domain, such as to sign in to a domain-joined VM. A user forest works when the password hashes can be synchronized and users aren't using exclusive sign-in methods like smart card authentication.

In an Azure AD DS *resource* forest, users authenticate over a one-way forest *trust* from their on-premises AD DS. With this approach, the user objects and password hashes aren't synchronized to Azure AD DS. The user objects and credentials only exist in the on-premises AD DS. This approach lets enterprises host resources and application platforms in Azure that depend on classic authentication such LDAPS, Kerberos, or NTLM, but any authentication issues or concerns are removed. Azure AD DS resource forests are currently in preview.

Resource forests also provide the capability to lift-and-shift your applications one component at a time. Many legacy on-premises applications are multi-tiered, often using a web server or front end and many database-related components. These tiers make it hard to lift-and-shift the entire application to the cloud in one step. With resource forests, you can lift your application to the cloud in phased approach, which makes it easier to move your application to Azure.

## What are trusts?

Organizations that have more than one domain often need users to access shared resources in a different domain. Access to these shared resources requires that users in one domain authenticate to another domain. To provide these authentication and authorization capabilities between clients and servers in different domains, there must be a *trust* between the two domains.

With domain trusts, the authentication mechanisms for each domain trust the authentications coming from the other domain. Trusts help provide controlled access to shared resources in a resource domain (the *trusting* domain) by verifying that incoming authentication requests come from a trusted authority (the *trusted* domain). Trusts act as bridges that only allow validated authentication requests to travel between domains.

How a trust passes authentication requests depends on how it's configured. Trusts can be configured in one of the following ways:

* **One-way** - provides access from the trusted domain to resources in the trusting domain.
* **Two-way** - provides access from each domain to resources in the other domain.

Trusts are also be configured to handle additional trust relationships in one of the following ways:

* **Nontransitive** - The trust exists only between the two trust partner domains.
* **Transitive** - Trust automatically extends to any other domains that either of the partners trusts.

In some cases, trust relationships are automatically established when domains are created. Other times, you must choose a type of trust and explicitly establish the appropriate relationships. The specific types of trusts used and the structure of those trust relationships depend on how the Active Directory directory service is organized, and whether different versions of Windows coexist on the network.

## Trusts between two forests

You can extend domain trusts within a single forest to another forest by manually creating a one-way or two-way forest trust. A forest trust is a transitive trust that exists only between a forest root domain and a second forest root domain.

* A one-way forest trust allows all users in one forest to trust all domains in the other forest.
* A two-way forest trust forms a transitive trust relationship between every domain in both forests.

The transitivity of forest trusts is limited to the two forest partners. The forest trust doesn't extend to additional forests trusted by either of the partners.

![Diagram of forest trust from Azure AD DS to on-premises AD DS](./media/concepts-resource-forest/resource-forest-trust-relationship.png)

You can create different domain and forest trust configurations depending on the Active Directory structure of the organization. Azure AD DS only supports a one-way forest trust. In this configuration, resources in Azure AD DS can trust all domains in an on-premises forest.

## Supporting technology for trusts

Trusts use various services and features, such as DNS to locate domain controllers in partnering forests. Trusts also depend on NTLM and Kerberos authentication protocols and on Windows-based authorization and access control mechanisms to help provide a secured communications infrastructure across Active Directory domains and forests. The following services and features help support successful trust relationships.

### DNS

AD DS needs DNS for domain controller (DC) location and naming. The following support from DNS is provided for AD DS to work successfully:

* A name resolution service that lets network hosts and services to locate DCs.
* A naming structure that enables an enterprise to reflect its organizational structure in the names of its directory service domains.

A DNS domain namespace is usually deployed that mirrors the AD DS domain namespace. If there's an existing DNS namespace before the AD DS deployment, the DNS namespace is typically partitioned for Active Directory, and a DNS subdomain and delegation for the Active Directory forest root is created. Additional DNS domain names are then added for each Active Directory child domain.

DNS is also used to support the location of Active Directory DCs. The DNS zones are populated with DNS resource records that enable network hosts and services to locate Active Directory DCs.

### Applications and Net Logon

Both applications and the Net Logon service are components of the Windows distributed security channel model. Applications integrated with Windows Server and Active Directory use authentication protocols to communicate with the Net Logon service so that a secured path can be established over which authentication can occur.

### Authentication Protocols

Active Directory DCs authenticate users and applications using one of the following protocols:

* **Kerberos version 5 authentication protocol**
    * The Kerberos version 5 protocol is the default authentication protocol used by on-premises computers running Windows and supporting third-party operating systems. This protocol is specified in RFC 1510 and is fully integrated with Active Directory, server message block (SMB), HTTP, and remote procedure call (RPC), as well as the client and server applications that use these protocols.
    * When the Kerberos protocol is used, the server doesn't have to contact the DC. Instead, the client gets a ticket for a server by requesting one from a DC in the server account domain. The server then validates the ticket without consulting any other authority.
    * If any computer involved in a transaction doesn't support the Kerberos version 5 protocol, the NTLM protocol is used.

* **NTLM authentication protocol**
    * The NTLM protocol is a classic network authentication protocol used by older operating systems. For compatibility reasons, it's used by Active Directory domains to process network authentication requests that come from applications designed for earlier Windows-based clients and servers, and third-party operating systems.
    * When the NTLM protocol is used between a client and a server, the server must contact a domain authentication service on a DC to verify the client credentials. The server authenticates the client by forwarding the client credentials to a DC in the client account domain.
    * When two Active Directory domains or forests are connected by a trust, authentication requests made using these protocols can be routed to provide access to resources in both forests.

## Authorization and access control

Authorization and trust technologies work together to provide a secured communications infrastructure across Active Directory domains or forests. Authorization determines what level of access a user has to resources in a domain. Trusts facilitate cross-domain authorization of users by providing a path for authenticating users in other domains so their requests to shared resources in those domains can be authorized.

When an authentication request made in a trusting domain is validated by the trusted domain, it's passed to the target resource. The target resource then determines whether to authorize the specific request made by the user, service, or computer in the trusted domain based on its access control configuration.

Trusts provide this mechanism to validate authentication requests that are passed to a trusting domain. Access control mechanisms on the resource computer determine the final level of access granted to the requestor in the trusted domain.

## Next steps

To learn more about trusts, see [How do forest trusts work in Azure AD DS?][concepts-trust]

To get started with creating an Azure AD DS managed domain with a resource forest, see [Create and configure an Azure AD DS managed domain][tutorial-create-advanced]. You can then [Create an outbound forest trust to an on-premises domain (preview)][create-forest-trust].

<!-- LINKS - INTERNAL -->
[concepts-trust]: concepts-forest-trust.md
[tutorial-create-advanced]: tutorial-create-instance-advanced.md
[create-forest-trust]: tutorial-create-forest-trust.md
