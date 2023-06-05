---
title: Authorize access with a shared access signature in Azure Event Hubs
description: This article provides information about authorizing access to Azure Event Hubs resources by using Shared Access Signatures (SAS).
ms.topic: conceptual
ms.date: 03/13/2023
---

# Authorizing access to Event Hubs resources using Shared Access Signatures
A shared access signature (SAS) provides you with a way to grant limited access to resources in your Event Hubs namespace. SAS guards access to Event Hubs resources based on authorization rules. These rules are configured either on a namespace, or an event hub. This article provides an overview of the SAS model, and reviews SAS best practices.

> [!NOTE]
> This article covers authorizing access to Event Hubs resources using SAS. To learn about **authenticating** access to Event Hubs resources using SAS, see [Authenticate with SAS](authorize-access-shared-access-signature.md). 

## What are shared access signatures?
A shared access signature (SAS) provides delegated access to Event Hubs resources based on authorization rules. An authorization rule has a name, is associated with specific rights, and carries a pair of cryptographic keys. You use the rule’s name and key via the Event Hubs clients or in your own code to generate SAS tokens. A client can then pass the token to Event Hubs to prove authorization for the requested operation.

SAS is a claim-based authorization mechanism using simple tokens. When you use SAS, keys are never passed on the wire. Keys are used to cryptographically sign information that can later be verified by the service. SAS can be used similar to a username and password scheme where the client is in immediate possession of an authorization rule name and a matching key. SAS can be used similar to a federated security model, where the client receives a time-limited and signed access token from a security token service without ever coming into possession of the signing key.

> [!NOTE]
> Azure Event Hubs also supports authorizing to Event Hubs resources using Azure Active Directory (Azure AD). Authorizing users or applications using OAuth 2.0 token returned by Azure AD provides superior security and ease of use over shared access signatures (SAS). With Azure AD, there is no need to store the tokens in your code and risk potential security vulnerabilities.
>
> Microsoft recommends using Azure AD with your Azure Event Hubs applications when possible. For more information, see [Authorize access to Azure Event Hubs resource using Azure Active Directory](authorize-access-azure-active-directory.md).

> [!IMPORTANT]
> SAS (Shared Access Signatures) tokens are critical to protect your resources. While providing granularity, SAS grants clients access to your Event Hubs resources. They should not be shared publicly. When sharing, if required for troubleshooting reasons, consider using a reduced version of any log files or deleting the SAS tokens (if present) from the log files, and make sure the screenshots don’t contain the SAS information either.

## Shared access authorization policies
Each Event Hubs namespace and each Event Hubs entity (an event hub or a Kafka topic) has a shared access authorization policy made up of rules. The policy at the namespace level applies to all entities inside the namespace, irrespective of their individual policy configuration.
For each authorization policy rule, you decide on three pieces of information: name, scope, and rights. The name is a unique name in that scope. The scope is the URI of the resource in question. For an Event Hubs namespace, the scope is the fully qualified domain name (FQDN), such as `https://<yournamespace>.servicebus.windows.net/`.

The rights provided by the policy rule can be a combination of:
- **Send** – Gives the right to send messages to the entity
- **Listen** – Gives the right to listen or receive messages from the entity
- **Manage** – Gives the right to manage the topology of the namespace, including creation and deletion of entities. The **Manage** right includes the **Send** and **Listen** rights.

A namespace or entity policy can hold up to 12 shared access authorization rules, providing room for the three sets of rules, each covering the basic rights, and the combination of Send and Listen. This limit underlines that the SAS policy store isn't intended to be a user or service account store. If your application needs to grant access to Event Hubs resources based on user or service identities, it should implement a security token service that issues SAS tokens after an authentication and access check.

An authorization rule is assigned a **primary key** and a **secondary key**. These keys are cryptographically strong keys. Don’t lose them or leak them. They’ll always be available in the Azure portal. You can use either of the generated keys, and you can regenerate them at any time. If you regenerate or change a key in the policy, all previously issued tokens based on that key become instantly invalid. However, ongoing connections created based on such tokens will continue to work until the token expires.

When you create an Event Hubs namespace, a policy rule named **RootManageSharedAccessKey** is automatically created for the namespace. This policy has **manage** permissions for the entire namespace. It’s recommended that you treat this rule like an administrative root account and don’t use it in your application. You can create additional policy rules in the **Configure** tab for the namespace in the portal, via PowerShell or Azure CLI.

## Best practices when using SAS
When you use shared access signatures in your applications, you need to be aware of two potential risks:

- If a SAS is leaked, it can be used by anyone who obtains it, which can potentially compromise your Event Hubs resources.
- If a SAS provided to a client application expires and the application is unable to retrieve a new SAS from your service, then application’s functionality may be hindered.

The following recommendations for using shared access signatures can help mitigate these risks:

- **Have clients automatically renew the SAS if necessary**: Clients should renew the SAS well before expiration, to allow time for retries if the service providing the SAS is unavailable. If your SAS is meant to be used for a small number of immediate, short-lived operations that are expected to be completed within the expiration period, then it may be unnecessary as the SAS isn't expected to be renewed. However, if you have client that is routinely making requests via SAS, then the possibility of expiration comes into play. The key consideration is to balance the need for the SAS to be short-lived (as previously stated) with the need to ensure that client is requesting renewal early enough (to avoid disruption due to the SAS expiring prior to a successful renewal).
- **Be careful with the SAS start time**: If you set the start time for SAS to **now**, then due to clock skew (differences in current time according to different machines), failures may be observed intermittently for the first few minutes. In general, set the start time to be at least 15 minutes in the past. Or, don’t set it at all, which will make it valid immediately in all cases. The same generally applies to the expiry time as well. Remember that you may observe up to 15 minutes of clock skew in either direction on any request. 
- **Be specific with the resource to be accessed**: A security best practice is to provide user with the minimum required privileges. If a user only needs read access to a single entity, then grant them read access to that single entity, and not read/write/delete access to all entities. It also helps lessen the damage if a SAS is compromised because the SAS has less power in the hands of an attacker.
- **Don’t always use SAS**: Sometimes the risks associated with a particular operation against your Event Hubs outweigh the benefits of SAS. For such operations, create a middle-tier service that writes to your Event Hubs after business rule validation, authentication, and auditing.
- **Always use HTTPs**: Always use Https to create or distribute a SAS. If a SAS is passed over HTTP and intercepted, an attacker performing a man-in-the-middle attack is able to read the SAS and then use it just as the intended user could have, potentially compromising sensitive data or allowing for data corruption by the malicious user.

## Conclusion
Share access signatures are useful for providing limited permissions to Event Hubs resources to your clients. They're vital part of the security model for any application using Azure Event Hubs. If you follow the best practices listed in this article, you can use SAS to provide greater flexibility of access to your resources, without compromising the security of your application.

## Next steps
See the following related articles: 

- [Authenticate requests to Azure Event Hubs from an application using Azure Active Directory](authenticate-application.md)
- [Authenticate a managed identity with Azure Active Directory to access Event Hubs Resources](authenticate-managed-identity.md)
- [Authenticate requests to Azure Event Hubs using Shared Access Signatures](authenticate-shared-access-signature.md)
- [Authorize access to Event Hubs resources using Azure Active Directory](authorize-access-azure-active-directory.md)


