---
title: Shared access signature authorization for Event Hubs
description: Learn about authorizing access to Azure Event Hubs resources using shared access signatures (SAS), including authorization rules, policies, and best practices.
ms.topic: concept-article
ms.date: 05/04/2026
#customer intent: As an Azure Event Hubs user, I want to understand how SAS authorization works so that I can securely control access to my event hubs.
---

# Shared access signature authorization for Event Hubs

A shared access signature (SAS) provides a way to grant limited access to resources in your Event Hubs namespace. SAS guards access to Event Hubs resources based on authorization rules. You configure these rules on either a namespace or an event hub. This article provides an overview of the SAS model and reviews SAS best practices.

> [!NOTE]
> This article covers authorizing access to Event Hubs resources using SAS. To learn about **authenticating** access to Event Hubs resources using SAS, see [Authenticate with SAS](authenticate-shared-access-signature.md). 

## What are shared access signatures?
A shared access signature (SAS) provides delegated access to Event Hubs resources based on authorization rules. An authorization rule has a name, is associated with specific rights, and carries a pair of cryptographic keys. Use the rule’s name and key through the Event Hubs clients or in your own code to generate SAS tokens. A client can then pass the token to Event Hubs to prove authorization for the requested operation.

SAS is a claim-based authorization mechanism that uses simple tokens. When you use SAS, you never pass keys on the wire. Instead, you use keys to cryptographically sign information that the service can later verify. You can use SAS similar to a username and password scheme where the client is in immediate possession of an authorization rule name and a matching key. You can also use SAS similar to a federated security model, where the client receives a time-limited and signed access token from a security token service without ever coming into possession of the signing key.

> [!NOTE]
> Azure Event Hubs also supports authorizing to Event Hubs resources by using Microsoft Entra ID. Authorizing users or applications by using OAuth 2.0 token returned by Microsoft Entra ID provides superior security and ease of use over shared access signatures (SAS). By using Microsoft Entra ID, there's no need to store the tokens in your code and risk potential security vulnerabilities.
>
> Microsoft recommends using Microsoft Entra ID with your Azure Event Hubs applications when possible. For more information, see [Authorize access to Azure Event Hubs resource using Microsoft Entra ID](authorize-access-azure-active-directory.md).

> [!IMPORTANT]
> SAS tokens are critical to protecting your resources. While providing granularity, SAS grants clients access to your Event Hubs resources. Don't share them publicly. When sharing, if required for troubleshooting reasons, consider using a reduced version of any log files or deleting the SAS tokens (if present) from the log files. Make sure the screenshots don't contain the SAS information either.

## Shared access authorization policies
Each Event Hubs namespace and each Event Hubs entity (an event hub or a Kafka topic) has a shared access authorization policy made up of rules. The policy at the namespace level applies to all entities inside the namespace, irrespective of their individual policy configuration.

For each authorization policy rule, you decide on three pieces of information: name, scope, and rights. The name is a unique name in that scope. The scope is the URI of the resource in question. For an Event Hubs namespace, the scope is the fully qualified domain name (FQDN), such as `https://<yournamespace>.servicebus.windows.net/`.

The rights provided by the policy rule can be a combination of:

- **Send** – Gives the right to send messages to the entity
- **Listen** – Gives the right to listen or receive messages from the entity
- **Manage** – Gives the right to manage the topology of the namespace, including creation and deletion of entities. The **Manage** right includes the **Send** and **Listen** rights.

A namespace or entity policy can hold up to 12 shared access authorization rules, providing room for the three sets of rules, each covering the basic rights, and the combination of Send and Listen. This limit underlines that the SAS policy store isn't intended to be a user or service account store. If your application needs to grant access to Event Hubs resources based on user or service identities, it should implement a security token service that issues SAS tokens after an authentication and access check.

An authorization rule is assigned a **primary key** and a **secondary key**. These keys are cryptographically strong keys. Don’t lose them or leak them. They’re always available in the Azure portal. You can use either of the generated keys, and you can regenerate them at any time. If you regenerate or change a key in the policy, all previously issued tokens based on that key become instantly invalid. However, ongoing connections created based on such tokens continue to work until the token expires.

When you create an Event Hubs namespace, a policy rule named **RootManageSharedAccessKey** is automatically created for the namespace. This policy has **manage** permissions for the entire namespace. Treat this rule like an administrative root account and don't use it in your application. You can create more policy rules in the **Configure** tab for the namespace in the portal, via PowerShell, or Azure CLI.

## Best practices when using SAS
When you use shared access signatures in your applications, be aware of two potential risks:

- If a SAS leaks, anyone who obtains it can use it, which can potentially compromise your Event Hubs resources.
- If a SAS provided to a client application expires and the application can't retrieve a new SAS from your service, the application's functionality might be hindered.

The following recommendations for using shared access signatures can help mitigate these risks:

- **Have clients automatically renew the SAS if necessary**: Clients should renew the SAS well before expiration to allow time for retries if the service providing the SAS is unavailable. If your SAS is meant for a small number of immediate, short-lived operations that are expected to complete within the expiration period, then renewal might be unnecessary. However, if you have a client that routinely makes requests via SAS, then the possibility of expiration comes into play. The key consideration is to balance the need for the SAS to be short-lived (as previously stated) with the need to ensure that the client requests renewal early enough (to avoid disruption due to the SAS expiring before a successful renewal).
- **Be careful with the SAS start time**: If you set the start time for SAS to **now**, then due to clock skew (differences in current time according to different machines), failures might occur intermittently for the first few minutes. In general, set the start time to be at least 15 minutes in the past. Or, don't set it at all, which makes it valid immediately in all cases. The same generally applies to the expiry time as well. Remember that you might observe up to 15 minutes of clock skew in either direction on any request. 
- **Be specific with the resource to be accessed**: A security best practice is to provide users with the minimum required privileges. If a user only needs read access to a single entity, grant them read access to that single entity, and not read, write, or delete access to all entities. This approach also helps lessen the damage if a SAS is compromised because the SAS has less power in the hands of an attacker.
- **Don't always use SAS**: Sometimes the risks associated with a particular operation against your Event Hubs outweigh the benefits of SAS. For such operations, create a middle-tier service that writes to your event hubs after business rule validation, authentication, and auditing.
- **Always use HTTPS**: Always use HTTPS to create or distribute a SAS. If a SAS is passed over HTTP and intercepted, an attacker performing a man-in-the-middle attack can read the SAS and then use it just as the intended user could, potentially compromising sensitive data or allowing for data corruption by the malicious user.

## Conclusion
Shared access signatures are useful for providing limited permissions to Event Hubs resources to your clients. They're a vital part of the security model for any application using Azure Event Hubs. If you follow the best practices listed in this article, you can use SAS to provide greater flexibility of access to your resources, without compromising the security of your application.

## Related content
See the following related articles: 

- [Authenticate requests to Azure Event Hubs using Shared Access Signatures](authenticate-shared-access-signature.md)
- [Authenticate requests to Azure Event Hubs from an application using Microsoft Entra ID](authenticate-application.md)
- [Authenticate a managed identity with Microsoft Entra ID to access Event Hubs Resources](authenticate-managed-identity.md)
