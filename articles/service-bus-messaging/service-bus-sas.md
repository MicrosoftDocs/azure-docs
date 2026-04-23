---
title: Azure Service Bus Access Control with Shared Access Signatures
description: Learn about the use of shared access signatures for Azure Service Bus authorization.
ms.topic: concept-article
ms.date: 12/11/2024
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Service Bus access control with shared access signatures

This article discusses shared access signatures (SASs), how they work, and how to use them in a platform-agnostic way with Azure Service Bus.

A SAS guards access to Service Bus based on authorization rules that are configured on a namespace or in a messaging entity (queue or topic). An authorization rule has a name, is associated with specific rights, and carries a pair of cryptographic keys. You use the rule's name and keys via the Service Bus SDK or in your own code to generate a SAS token. A client can then pass the token to Service Bus to prove authorization for the requested operation.

## Preferred authorization method

Azure Service Bus supports authorizing access to a Service Bus namespace and its entities by using Microsoft Entra ID. Authorizing users or applications by using an OAuth 2.0 token returned by Microsoft Entra ID provides superior security and ease of use over shared access signatures. SAS keys lack fine access control, are difficult to manage and rotate, and don't have the audit capabilities to associate its use with a specific user or service principal.

For these reasons, we recommend using Microsoft Entra ID with your Azure Service Bus applications when possible. For more information, see the following articles:

- [Authenticate and authorize an application with Microsoft Entra ID to access Azure Service Bus entities](authenticate-application.md)
- [Authenticate a managed identity with Microsoft Entra ID to access Azure Service Bus resources](service-bus-managed-service-identity.md)

You can disable local or SAS key authentication for a Service Bus namespace and allow only Microsoft Entra authentication. For step-by-step instructions, see [Disable local authentication](disable-local-authentication.md).

## Overview of SAS

Shared access signatures are a claims-based authorization mechanism that uses simple tokens. When you use a SAS, keys are never passed on the wire. Keys are used to cryptographically sign information that the service can later verify.

You can use a SAS in a similar way to a username and password scheme, where the client is in immediate possession of an authorization rule name and a matching key. You can also use a SAS in a similar way to a federated security model, where the client receives a time-limited and signed access token from a security token service without ever coming into possession of the signing key.

SAS authentication in Service Bus is configured with named [shared access authorization policies](#shared-access-authorization-policies) that have associated access rights, along with a pair of primary and secondary cryptographic keys. The keys are 256-bit values in Base64 representation. You can configure rules at the namespace level, on Service Bus [queues](service-bus-messaging-overview.md#queues) and [topics](service-bus-messaging-overview.md#topics).

> [!NOTE]
> These keys are plain text strings that use a Base64 representation. They must not be decoded before they're used.

The SAS token contains:

- The name of the chosen authorization policy.
- The URI of the resource to be accessed.
- An expiry instant.
- An HMAC-SHA256 cryptographic signature computed over these fields through either the primary or the secondary cryptographic key of the chosen authorization rule.

## Shared access authorization policies

Each Service Bus namespace and each Service Bus entity has a shared access authorization policy that consists of rules. The policy at the namespace level applies to all entities in the namespace, irrespective of their individual policy configuration.

For each authorization policy rule, you decide on three pieces of information:

- **Name**. A unique name within the scope.

- **Scope**. The URI of the resource in question. For a Service Bus namespace, the scope is the fully qualified namespace, such as `https://<yournamespace>.servicebus.windows.net/`.

- **Rights**. The rights that the policy rule confers. They can be a combination of:

  - **Send**. Grants the right to send messages to the entity.
  - **Listen**. Grants the right to receive messages (queues and subscriptions) and all related message handling.
  - **Manage**. Grants the right to manage the topology of the namespace, including creating and deleting entities. The Manage right includes the Send and Listen rights.

A namespace or entity policy can hold up to 12 shared access authorization rules to provide room for three sets of rules. Each set of rules covers the basic rights, along with the combination of Send and Listen. This limit is per entity, so the namespace and each entity can have up to 12 shared access authorization rules.

The rule limit is a reminder that the SAS policy store isn't intended to be a user or service account store. If your application needs to grant access to Service Bus based on user or service identities, it should implement a security token service that issues SAS tokens after an authentication and access check.

An authorization rule is assigned a *primary key* and a *secondary key*. These keys are cryptographically strong keys, so be sure to protect them. They're always available in the [Azure portal].

You can use either of the generated keys, and you can regenerate them at any time. If you regenerate or change a key in the policy, all previously issued tokens based on that key become instantly invalid. However, ongoing connections that are based on such tokens continue to work until the tokens expire.

When you create a Service Bus namespace, a policy rule named `RootManageSharedAccessKey` is automatically created for the namespace. This policy has Manage permissions for the entire namespace. We recommend that you treat this rule like an administrative root account and don't use it in your application. You can create more policy rules on the **Shared access policies** tab for the namespace in the portal, via Azure PowerShell or the Azure CLI.

We recommend that you periodically regenerate the keys used in the [SharedAccessAuthorizationRule](/dotnet/api/azure.messaging.servicebus.administration.sharedaccessauthorizationrule) object. The primary and secondary key slots exist so that you can rotate keys gradually. If your application generally uses the primary key, you can copy the primary key into the secondary key slot and only then regenerate the primary key. The new primary key value can then be configured into the client applications, which have continued access via the old primary key in the secondary slot. After all clients are updated, you can regenerate the secondary key to finally retire the old primary key.

If you know or suspect that a key is compromised and you have to revoke the keys, you can regenerate both the [PrimaryKey](/dotnet/api/azure.messaging.servicebus.administration.sharedaccessauthorizationrule.primarykey) and [SecondaryKey](/dotnet/api/azure.messaging.servicebus.administration.sharedaccessauthorizationrule.secondarykey) values of [SharedAccessAuthorizationRule](/dotnet/api/azure.messaging.servicebus.administration.sharedaccessauthorizationrule) to replace them with new keys. This procedure invalidates all tokens signed with the old keys.

## Best practices for using shared access signatures

When you use shared access signatures in your applications, you need to be aware of two potential risks:

- If a SAS is leaked, anyone who obtains it can use it. This risk can potentially compromise your Service Bus resources.
- If a SAS provided to a client application expires and the application can't retrieve a new SAS from your service, the expiration might hinder the application's functionality.

The following recommendations for using shared access signatures can help mitigate these risks:

- **Have clients automatically renew the SAS if necessary**. Clients should renew the SAS well before expiration, to allow time for retries if the service that provides the SAS is unavailable.

  If your SAS is meant to be used for a few immediate, short-lived operations that you expect to finish within the expiration period, renewal might be unnecessary because the SAS isn't expected to be renewed. However, if you have a client that routinely makes requests via SAS, the possibility of expiration comes into play.

  The key consideration is to balance the need for the SAS to be short lived with the need to ensure that the client is requesting renewal early enough. This balance helps avoid disruption due to the SAS expiring before a successful renewal.

- **Be careful with the SAS start time**. If you set the start time for SAS to **now**, you might see failures intermittently for the first few minutes. The reason is *clock skew*: differences in current time according to different machines.

  In general, set the start time to be at least 15 minutes in the past. Or don't set it at all, which will make it valid immediately in all cases. The same general best practice also applies to the expiry time. Remember that you might observe up to 15 minutes of clock skew in either direction on any request.

- **Be specific with the resource to be accessed**. A security best practice is to give a user the minimum required privileges. If a user needs only read access to a single entity, grant them read access to that single entity and not read/write/delete access to all entities. This practice also helps lessen the damage if a SAS is compromised because the SAS has less power in the hands of an attacker.

- **Don't always use a SAS**. Sometimes the risks associated with a particular operation against Service Bus outweigh the benefits of a SAS. For such operations, create a middle-tier service that writes to Service Bus after business rule validation, authentication, and auditing.

- **Always use HTTPS to create or distribute a SAS**. If a SAS is passed over HTTP and intercepted, an attacker who performs a man-in-the-middle attack can read the SAS and then use it just as the intended user could have. This situation can potentially compromise sensitive data or allow the malicious user to corrupt the data.

## Configuration for SAS authentication

You can configure the SAS policy on Service Bus namespaces, queues, or topics. Configuring it on a Service Bus subscription is currently not supported, but you can use rules configured on a namespace or topic to help secure access to subscriptions.

In the following example, the `manageRuleNS`, `sendRuleNS`, and `listenRuleNS` authorization rules apply to both queue Q1 and topic T1. The `listenRuleQ` and `sendRuleQ` rules apply only to queue Q1. The `sendRuleT` rule applies only to topic T1.

:::image type="content" source="./media/service-bus-sas/service-bus-namespace.png" alt-text="Diagram that shows an example namespace with a few authorization rules.":::

## Generation of a SAS token

Any client that has access to the name of an authorization rule and one of its signing keys can generate a SAS token. The client generates the token by crafting a string in the following format:

```
SharedAccessSignature sig=<signature-string>&se=<expiry>&skn=<keyName>&sr=<URL-encoded-resourceURI>
```

- `se`: Token expiry instant. The integer reflects seconds since the epoch `00:00:00 UTC` on January 1, 1970 (UNIX epoch) when the token expires.
- `skn`: Name of the authorization rule.
- `sr`: URL-encoded URI of the resource being accessed.
- `sig`: URL-encoded HMAC-SHA256 signature. The hash computation looks similar to the following pseudocode and returns Base64 of raw binary output.

  ```
  urlencode(base64(hmacsha256(urlencode('https://<yournamespace>.servicebus.windows.net/') + "\n" + '<expiry instant>', '<signing key>')))
  ```

The token contains the non-hashed values so that the recipient can recompute the hash with the same parameters and verify that the issuer is in possession of a valid signing key.

The resource URI is the full URI of the Service Bus resource to which access is claimed. For example: `http://<namespace>.servicebus.windows.net/<entityPath>` or `sb://<namespace>.servicebus.windows.net/<entityPath>`; that is, `http://contoso.servicebus.windows.net/contosoTopics/T1/Subscriptions/S3`. The URI must be [percent encoded](/dotnet/api/system.web.httputility.urlencode).

The shared access authorization rule for signing must be configured on the entity that this URI specifies, or by one of its hierarchical parents. In the previous example, the entity is `http://contoso.servicebus.windows.net/contosoTopics/T1` or `http://contoso.servicebus.windows.net`.

A SAS token is valid for all resources prefixed with the `<resourceURI>` value in `signature-string`.

For examples of generating a SAS token by using various programming languages, see [Generate SAS token](/rest/api/eventhub/generate-sas-token).

## Regeneration of keys

We recommend that you periodically regenerate the keys in the shared access authorization policy. The primary and secondary key slots exist so that you can rotate keys gradually. If your application generally uses the primary key, you can copy the primary key into the secondary key slot and only then regenerate the primary key. The new primary key value can then be configured into the client applications, which have continued access via the old primary key in the secondary slot. After all clients are updated, you can regenerate the secondary key to finally retire the old primary key.

If you know or suspect that a key is compromised and you have to revoke the keys, you can regenerate both the primary key and the secondary key of a shared access authorization policy to replace them with new keys. This procedure invalidates all tokens signed with the old keys.

To regenerate primary and secondary keys in the Azure portal, use one of the following methods.

### Azure portal

1. In the [Azure portal](https://portal.azure.com), go to the Service Bus namespace.

1. On the left menu, select **Shared access policies**.

1. Select the policy from the list. These steps use **RootManageSharedAccessKey** as an example.

1. To regenerate the primary key, on the **SAS Policy: RootManageSharedAccessKey** pane, select **Regenerate Primary Key** on the command bar.

    :::image type="content" source="./media/service-bus-sas/regenerate-primary-key.png" alt-text="Screenshot that shows steps for regenerating a primary key.":::

1. To regenerate the secondary key, on the **SAS Policy: RootManageSharedAccessKey** pane, select the ellipsis (**...**) on the command bar, and then select **Regenerate Secondary Key**.

    :::image type="content" source="./media/service-bus-sas/regenerate-keys.png" alt-text="Screenshot that shows steps for regenerating a secondary key.":::

### Azure PowerShell

If you're using Azure PowerShell, use the [`New-AzServiceBusKey`](/powershell/module/az.servicebus/new-azservicebuskey) cmdlet to regenerate primary and secondary keys for a Service Bus namespace. You can also use the `-KeyValue` parameter to specify values for the regenerated primary and secondary keys.

### Azure CLI

If you're using the Azure CLI, use the [`az servicebus namespace authorization-rule keys renew`](/cli/azure/servicebus/namespace/authorization-rule/keys#az-servicebus-namespace-authorization-rule-keys-renew) command to regenerate primary and secondary keys for a Service Bus namespace. You can also use the `--key-value` parameter to specify values for the regenerated primary and secondary keys.

## SAS authentication with Service Bus

The following scenario includes configuration of authorization rules, generation of SAS tokens, and client authorization.

For a sample of a Service Bus application that illustrates the configuration and uses SAS authorization, see [CRUD operations](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/samples/Sample07_CrudOperations.md).

### Access SAS rules on an entity

Use the *get* or *update* operation on queues or topics in the [management libraries for Service Bus](service-bus-management-libraries.md) to access and update the corresponding shared access authorization rules. You can also add the rules when you're creating the queues or topics by using these libraries.

### Use SAS authorization

Applications that use any of the Service Bus SDKs in any of the officially supported languages can make use of SAS authorization through the connection strings passed to the client constructor. Supported languages include .NET, Java, JavaScript, and Python.

Connection strings can include a rule name (`SharedAccessKeyName`) and rule key (`SharedAccessKey`) or a previously issued token (`SharedAccessSignature`). When those items are present in the connection string passed to any constructor or factory method that accepts a connection string, the SAS token provider is automatically created and populated.

To use SAS authorization with Service Bus subscriptions, you can use SAS keys configured on a Service Bus namespace or on a topic.

### Use the shared access signature at the HTTP level

Now that you know how to create shared access signatures for any entities in Service Bus, you're ready to perform an HTTP `POST` request:

```http
POST https://<yournamespace>.servicebus.windows.net/<yourentity>/messages
Content-Type: application/json
Authorization: SharedAccessSignature sr=https%3A%2F%2F<yournamespace>.servicebus.windows.net%2F<yourentity>&sig=<yoursignature from code above>&se=1438205742&skn=KeyName
ContentType: application/atom+xml;type=entry;charset=utf-8
```

Remember, this method works for everything. You can create a SAS for a queue, topic, or subscription.

If you give a sender or client a SAS token, it doesn't have the key directly and can't reverse the hash to obtain it. You have control over what the sender or client can access, and for how long. An important thing to remember is that if you change the primary key in the policy, any shared access signatures created from it are invalidated.

### Use the shared access signature at the AMQP level

The previous section showed how to use the SAS token with an HTTP `POST` request for sending data to Service Bus. You can access Service Bus by using the Advanced Message Queuing Protocol (AMQP). AMQP is the preferred protocol to use for performance reasons, in many scenarios. The SAS token usage with AMQP is described in the document [AMQP Claim-Based Security Version 1.0](https://docs.oasis-open.org/amqp/amqp-cbs/v1.0/csd01/amqp-cbs-v1.0-csd01.docx).

Before the publisher starts to send data to Service Bus, it must send the SAS token inside an AMQP message to a well-defined AMQP node named `$cbs`. It's a special queue that the service uses to acquire and validate all the SAS tokens.

The publisher must specify the `ReplyTo` field inside the AMQP message. It's the node in which the service replies to the publisher with the result of the token validation (a simple request/reply pattern between publisher and service). This reply node is created dynamically, as the AMQP 1.0 specification describes. After the publisher checks that the SAS token is valid, the publisher can start to send data to the service.

The following steps show how to send the SAS token with the AMQP protocol by using the [AMQP.NET Lite](https://github.com/Azure/amqpnetlite) library. This library is useful if you can't use the official Service Bus SDK (for example, on WinRT, .NET Compact Framework, .NET Micro Framework, and Mono) while developing in C#. The library is also useful in understanding how claims-based security works at the AMQP level. You saw how it works at the HTTP level, with an HTTP `POST` request and the SAS token sent inside the `Authorization` header.

If you don't need such deep knowledge about AMQP, you can use the official Service Bus SDK in any of the supported languages, like .NET, Java, JavaScript, Python, and Go. The SDK will do it for you.

#### C&#35;

```csharp
/// <summary>
/// Send claim-based security (CBS) token
/// </summary>
/// <param name="shareAccessSignature">Shared access signature (token) to send</param>
private bool PutCbsToken(Connection connection, string sasToken)
{
    bool result = true;
    Session session = new Session(connection);

    string cbsClientAddress = "cbs-client-reply-to";
    var cbsSender = new SenderLink(session, "cbs-sender", "$cbs");
    var cbsReceiver = new ReceiverLink(session, cbsClientAddress, "$cbs");

    // construct the put-token message
    var request = new Message(sasToken);
    request.Properties = new Properties();
    request.Properties.MessageId = Guid.NewGuid().ToString();
    request.Properties.ReplyTo = cbsClientAddress;
    request.ApplicationProperties = new ApplicationProperties();
    request.ApplicationProperties["operation"] = "put-token";
    request.ApplicationProperties["type"] = "servicebus.windows.net:sastoken";
    request.ApplicationProperties["name"] = Fx.Format("amqp://{0}/{1}", sbNamespace, entity);
    cbsSender.Send(request);

    // receive the response
    var response = cbsReceiver.Receive();
    if (response == null || response.Properties == null || response.ApplicationProperties == null)
    {
        result = false;
    }
    else
    {
        int statusCode = (int)response.ApplicationProperties["status-code"];
        if (statusCode != (int)HttpStatusCode.Accepted && statusCode != (int)HttpStatusCode.OK)
        {
            result = false;
        }
    }

    // the sender/receiver might be kept open for refreshing tokens
    cbsSender.Close();
    cbsReceiver.Close();
    session.Close();

    return result;
}
```

The `PutCbsToken()` method receives the *connection* (AMQP connection class instance, as provided by the [AMQP .NET Lite library](https://github.com/Azure/amqpnetlite)). This instance represents the TCP connection to the service and the `sasToken` parameter that is the SAS token to send.

> [!NOTE]
> It's important to create the connection with the Simple Authentication and Security Layer (SASL) authentication mechanism set to `ANONYMOUS`. Don't set the mechanism to the default `PLAIN` with the username and password used when you don't need to send the SAS token.

Next, the publisher creates two AMQP links for sending the SAS token and receiving the reply (the token validation result) from the service.

The AMQP message contains a set of properties and more information than a simple message:

- The SAS token is the body of the message (using its constructor).
- The `ReplyTo` property is set to the node name for receiving the validation result on the receiver link. You can change its name if you want, and the service creates it dynamically.
- The service uses the last three application/custom properties to indicate what kind of operation it has to execute. As described by the AMQP Claim-Based Security draft specification, they must be:
  - Operation name (`put-token`)
  - Type of token (in this case, `servicebus.windows.net:sastoken`)
  - Name of the audience to which the token applies (the entire entity)

After the publisher sends the SAS token on the sender link, the publisher must read the reply on the receiver link. The reply is a simple AMQP message with an application property named `status-code`. This property can contain the same values as an HTTP status code.

## Rights required for Service Bus operations

The following table shows the access rights required for various operations on Service Bus resources.

| Operation | Claim required | Claim scope |
| --- | --- | --- |
| **Namespace** | | |
| Configure an authorization rule on a namespace | Manage | Any namespace address |
| **Service registry** | | |
| Enumerate private policies | Manage | Any namespace address |
| Begin listening on a namespace | Listen | Any namespace address |
| Send messages to a listener at a namespace | Send | Any namespace address |
| **Queue** | | |
| Create a queue | Manage | Any namespace address |
| Delete a queue | Manage | Any valid queue address |
| Enumerate queues | Manage | `/$Resources/Queues` |
| Get the queue description | Manage | Any valid queue address |
| Configure an authorization rule for a queue | Manage | Any valid queue address |
| Get queue exists or not | Manage | Any valid queue address |
| Send into to the queue | Send | Any valid queue address |
| Receive messages from a queue | Listen | Any valid queue address |
| Abandon or complete messages after receiving the message in peek-lock mode | Listen | Any valid queue address |
| Defer a message for later retrieval | Listen | Any valid queue address |
| Deadletter a message | Listen | Any valid queue address |
| Get the state associated with a message queue session | Listen | Any valid queue address |
| Set the state associated with a message queue session | Listen | Any valid queue address |
| Schedule a message for later delivery | Listen | Any valid queue address |
| **Topic** | | |
| Create a topic | Manage | Any namespace address |
| Delete a topic | Manage | Any valid topic address |
| Enumerate topics | Manage | `/$Resources/Topics` |
| Get the topic description | Manage | Any valid topic address |
| Configure authorization rule for a topic | Manage | Any valid topic address |
| Send to the topic | Send | Any valid topic address |
| **Subscription** | | |
| Create a subscription | Manage | Any namespace address |
| Delete a subscription | Manage | `../myTopic/Subscriptions/mySubscription` |
| Enumerate subscriptions | Manage | `../myTopic/Subscriptions` |
| Get a subscription description | Manage | `../myTopic/Subscriptions/mySubscription` |
| Abandon or complete messages after receiving the message in peek-lock mode | Listen | `../myTopic/Subscriptions/mySubscription` |
| Defer a message for later retrieval | Listen | `../myTopic/Subscriptions/mySubscription` |
| Deadletter a message | Listen | `../myTopic/Subscriptions/mySubscription` |
| Get the state associated with a topic session | Listen | `../myTopic/Subscriptions/mySubscription` |
| Set the state associated with a topic session | Listen | `../myTopic/Subscriptions/mySubscription` |
| **Rules** | | |
| Create a rule | Listen | `../myTopic/Subscriptions/mySubscription` |
| Delete a rule | Listen | `../myTopic/Subscriptions/mySubscription` |
| Enumerate rules | Manage or Listen | `../myTopic/Subscriptions/mySubscription/Rules` |

## Related content

To learn more about Service Bus messaging, see the following topics:

- [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
- [Send and receive messages from an Azure Service Bus queue](service-bus-dotnet-get-started-with-queues.md)
- [Get started with Azure Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)

[Azure portal]: https://portal.azure.com
