---
title: Azure Service Bus authentication with Shared Access Signatures | Microsoft Docs
description: Overview of Service Bus Authentication using Shared Access Signatures overview, details about SAS authentication with Azure Service Bus.
services: service-bus-messaging
documentationcenter: na
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: ''
ms.service: service-bus-messaging
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/17/2017
ms.author: sethm

---

# Service Bus authentication with Shared Access Signatures

*Shared Access Signatures* (SAS) are the primary security mechanism for Service Bus messaging. This article discusses SAS, how they work, and how to use them in a platform-agnostic way.

SAS authentication enables applications to authenticate to Service Bus using an access key configured on the namespace, or on the messaging entity (queue or topic) with which specific rights are associated. You can then use this key to generate a SAS token that clients can in turn use to authenticate to Service Bus.

SAS authentication support is included in the Azure SDK version 2.0 and later.

## Overview of SAS

Shared Access Signatures are an authentication mechanism based on SHA-256 secure hashes or URIs. SAS is an extremely powerful mechanism that is used by all Service Bus services. In actual use, SAS has two components: a *shared access policy* and a *Shared Access Signature* (often called a *token*).

SAS authentication in Service Bus involves the configuration of a cryptographic key with associated rights on a Service Bus resource. Clients claim access to Service Bus resources by presenting a SAS token. This token consists of the resource URI being accessed, and an expiry signed with the configured key.

You can configure Shared Access Signature authorization rules on Service Bus [relays](service-bus-fundamentals-hybrid-solutions.md#relays), [queues](service-bus-fundamentals-hybrid-solutions.md#queues), and [topics](service-bus-fundamentals-hybrid-solutions.md#topics).

SAS authentication uses the following elements:

* [Shared Access authorization rule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule): A 256-bit primary cryptographic key in Base64 representation, an optional secondary key, and a key name and associated rights (a collection of *Listen*, *Send*, or *Manage* rights).
* [Shared Access Signature](/dotnet/api/microsoft.servicebus.sharedaccesssignaturetokenprovider) token: Generated using the HMAC-SHA256 of a resource string, consisting of the URI of the resource that is accessed and an expiry, with the cryptographic key. The signature and other elements described in the following sections are formatted into a string to form the SAS token.

## Shared access policy

An important thing to understand about SAS is that it starts with a policy. For each policy, you decide on three pieces of information: **name**, **scope**, and **permissions**. The **name** is just that; a unique name within that scope. The scope is easy enough: it's the URI of the resource in question. For a Service Bus namespace, the scope is the fully qualified domain name (FQDN), such as `https://<yournamespace>.servicebus.windows.net/`.

The available permissions for a policy are largely self-explanatory:

* Send
* Listen
* Manage

After you create the policy, it is assigned a *Primary Key* and a *Secondary Key*. These are cryptographically strong keys. Don't lose them or leak them - they'll always be available in the [Azure portal][Azure portal]. You can use either of the generated keys, and you can regenerate them at any time. However, if you regenerate or change the primary key in the policy, any Shared Access Signatures created from it will be invalidated.

When you create a Service Bus namespace, a policy is automatically created for the entire namespace called **RootManageSharedAccessKey**, and this policy has all permissions. You don't log on as **root**, so don't use this policy unless there's a really good reason. You can create additional policies in the **Configure** tab for the namespace in the portal. It's important to note that a single tree level in Service Bus (namespace, queue, etc.) can only have up to 12 policies attached to it.

## Configuration for Shared Access Signature authentication
You can configure the [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule) rule on Service Bus namespaces, queues, or topics. Configuring a [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule) on a Service Bus subscription is currently not supported, but you can use rules configured on a namespace or topic to secure access to subscriptions. For a working sample that illustrates this procedure, see the [Using Shared Access Signature (SAS) authentication with Service Bus Subscriptions](http://code.msdn.microsoft.com/Using-Shared-Access-e605b37c) sample.

A maximum of 12 such rules can be configured on a Service Bus namespace, queue, or topic. Rules that are configured on a Service Bus namespace apply to all entities in that namespace.

![SAS](./media/service-bus-sas/service-bus-namespace.png)

In this figure, the *manageRuleNS*, *sendRuleNS*, and *listenRuleNS* authorization rules apply to both queue Q1 and topic T1, while *listenRuleQ* and *sendRuleQ* apply only to queue Q1 and *sendRuleT* applies only to topic T1.

The key parameters of a [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule) are as follows:

| Parameter | Description |
| --- | --- |
| *KeyName* |A string that describes the authorization rule. |
| *PrimaryKey* |A base64-encoded 256-bit primary key for signing and validating the SAS token. |
| *SecondaryKey* |A base64-encoded 256-bit secondary key for signing and validating the SAS token. |
| *AccessRights* |A list of access rights granted by the authorization rule. These rights can be any collection of Listen, Send, and Manage rights. |

When a Service Bus namespace is provisioned, a [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule), with [KeyName](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule#Microsoft_ServiceBus_Messaging_SharedAccessAuthorizationRule_KeyName) set to **RootManageSharedAccessKey**, is created by default.

## Generate a Shared Access Signature (token)

The policy itself is not the access token for Service Bus. It is the object from which the access token is generated - using either the primary or secondary key. Any client that has access to the signing keys specified in the shared access authorization rule can generate the SAS token. The token is generated by carefully crafting a string in the following format:

```
SharedAccessSignature sig=<signature-string>&se=<expiry>&skn=<keyName>&sr=<URL-encoded-resourceURI>
```

Where `signature-string` is the SHA-256 hash of the scope of the token (**scope** as described in the previous section) with a CRLF appended and an expiry time (in seconds since the epoch: `00:00:00 UTC` on 1 January 1970). 

> [!NOTE]
> To avoid a short token expiry time, it is recommended that you encode the expiry time value as at least a 32-bit unsigned integer, or preferably a long (64-bit) integer.  
> 
> 

The hash looks similar to the following pseudo code and returns 32 bytes.

```
SHA-256('https://<yournamespace>.servicebus.windows.net/'+'\n'+ 1438205742)
```

The non-hashed values are in the **SharedAccessSignature** string so that the recipient can compute the hash with the same parameters, to be sure that it returns the same result. The URI specifies the scope, and the key name identifies the policy to be used to compute the hash. This is important from a security standpoint. If the signature doesn't match that which the recipient (Service Bus) calculates, then access is denied. At this point you can be sure that the sender had access to the key and should be granted the rights specified in the policy.

Note that you should use the encoded resource URI for this operation. The resource URI is the full URI of the Service Bus resource to which access is claimed. For example, `http://<namespace>.servicebus.windows.net/<entityPath>` or `sb://<namespace>.servicebus.windows.net/<entityPath>`; that is, `http://contoso.servicebus.windows.net/contosoTopics/T1/Subscriptions/S3`.

The shared access authorization rule used for signing must be configured on the entity specified by this URI, or by one of its hierarchical parents. For example, `http://contoso.servicebus.windows.net/contosoTopics/T1` or `http://contoso.servicebus.windows.net` in the previous example.

A SAS token is valid for all resources under the `<resourceURI>` used in the `signature-string`.

The [KeyName](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule#Microsoft_ServiceBus_Messaging_SharedAccessAuthorizationRule_KeyName) in the SAS token refers to the **keyName** of the shared access authorization rule used to generate the token.

The *URL-encoded-resourceURI* must be the same as the URI used in the string-to-sign during the computation of the signature. It should be [percent-encoded](https://msdn.microsoft.com/library/4fkewx0t.aspx).

It is recommended that you periodically regenerate the keys used in the [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule) object. Applications should generally use the [PrimaryKey](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule#Microsoft_ServiceBus_Messaging_SharedAccessAuthorizationRule_PrimaryKey) to generate a SAS token. When regenerating the keys, you should replace the [SecondaryKey](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule#Microsoft_ServiceBus_Messaging_SharedAccessAuthorizationRule_SecondaryKey) with the old primary key, and generate a new key as the new primary key. This enables you to continue using tokens for authorization that were issued with the old primary key, and that have not yet expired.

If a key is compromised and you have to revoke the keys, you can regenerate both the [PrimaryKey](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule#Microsoft_ServiceBus_Messaging_SharedAccessAuthorizationRule_PrimaryKey) and the [SecondaryKey](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule#Microsoft_ServiceBus_Messaging_SharedAccessAuthorizationRule_SecondaryKey) of a [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule), replacing them with new keys. This procedure invalidates all tokens signed with the old keys.

## How to use Shared Access Signature authentication with Service Bus

The following scenarios include configuration of authorization rules, generation of SAS tokens, and client authorization.

For a full working sample of a Service Bus application that illustrates the configuration and uses SAS authorization, see [Shared Access Signature authentication with Service Bus](http://code.msdn.microsoft.com/Shared-Access-Signature-0a88adf8). A related sample that illustrates the use of SAS authorization rules configured on namespaces or topics to secure Service Bus subscriptions is available here: [Using Shared Access Signature (SAS) authentication with Service Bus Subscriptions](http://code.msdn.microsoft.com/Using-Shared-Access-e605b37c).

## Access Shared Access Authorization rules on a namespace

Operations on the Service Bus namespace root require certificate authentication. You must upload a management certificate for your Azure subscription. To upload a management certificate, follow the steps [here](../cloud-services/cloud-services-configure-ssl-certificate-portal.md#step-3-upload-a-certificate), using the [Azure portal][Azure portal]. For more information about Azure management certificates, see the [Azure certificates overview](../cloud-services/cloud-services-certs-create.md#what-are-management-certificates).

The endpoint for accessing shared access authorization rules on a Service Bus namespace is as follows:

```http
https://management.core.windows.net/{subscriptionId}/services/ServiceBus/namespaces/{namespace}/AuthorizationRules/
```

To create a [SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule) object on a Service Bus namespace, execute a POST operation on this endpoint with the rule information serialized as JSON or XML. For example:

```csharp
// Base address for accessing authorization rules on a namespace
string baseAddress = @"https://management.core.windows.net/<subscriptionId>/services/ServiceBus/namespaces/<namespace>/AuthorizationRules/";

// Configure authorization rule with base64-encoded 256-bit key and Send rights
var sendRule = new SharedAccessAuthorizationRule("contosoSendAll",
    SharedAccessAuthorizationRule.GenerateRandomKey(),
    new[] { AccessRights.Send });

// Operations on the Service Bus namespace root require certificate authentication.
WebRequestHandler handler = new WebRequestHandler
{
    ClientCertificateOptions = ClientCertificateOption.Manual
};
// Access the management certificate by subject name
handler.ClientCertificates.Add(GetCertificate(<certificateSN>));

HttpClient httpClient = new HttpClient(handler)
{
    BaseAddress = new Uri(baseAddress)
};
httpClient.DefaultRequestHeaders.Accept.Add(
    new MediaTypeWithQualityHeaderValue("application/json"));
httpClient.DefaultRequestHeaders.Add("x-ms-version", "2015-01-01");

// Execute a POST operation on the baseAddress above to create an auth rule
var postResult = httpClient.PostAsJsonAsync("", sendRule).Result;
```

Similarly, use a GET operation on the endpoint to read the authorization rules configured on the namespace.

To update or delete a specific authorization rule, use the following endpoint:

```http
https://management.core.windows.net/{subscriptionId}/services/ServiceBus/namespaces/{namespace}/AuthorizationRules/{KeyName}
```

## Access Shared Access Authorization rules on an entity

You can access a [Microsoft.ServiceBus.Messaging.SharedAccessAuthorizationRule](/dotnet/api/microsoft.servicebus.messaging.sharedaccessauthorizationrule) object configured on a Service Bus queue or topic through the [AuthorizationRules](/dotnet/api/microsoft.servicebus.messaging.authorizationrules) collection in the corresponding [QueueDescription](/dotnet/api/microsoft.servicebus.messaging.queuedescription) or [TopicDescription](/dotnet/api/microsoft.servicebus.messaging.topicdescription).

The following code shows how to add authorization rules for a queue.

```csharp
// Create an instance of NamespaceManager for the operation
NamespaceManager nsm = NamespaceManager.CreateFromConnectionString(
    <connectionString> );
QueueDescription qd = new QueueDescription( <qPath> );

// Create a rule with send rights with keyName as "contosoQSendKey"
// and add it to the queue description.
qd.Authorization.Add(new SharedAccessAuthorizationRule("contosoSendKey",
    SharedAccessAuthorizationRule.GenerateRandomKey(),
    new[] { AccessRights.Send }));

// Create a rule with listen rights with keyName as "contosoQListenKey"
// and add it to the queue description.
qd.Authorization.Add(new SharedAccessAuthorizationRule("contosoQListenKey",
    SharedAccessAuthorizationRule.GenerateRandomKey(),
    new[] { AccessRights.Listen }));

// Create a rule with manage rights with keyName as "contosoQManageKey"
// and add it to the queue description.
// A rule with manage rights must also have send and receive rights.
qd.Authorization.Add(new SharedAccessAuthorizationRule("contosoQManageKey",
    SharedAccessAuthorizationRule.GenerateRandomKey(),
    new[] {AccessRights.Manage, AccessRights.Listen, AccessRights.Send }));

// Create the queue.
nsm.CreateQueue(qd);
```

## Use Shared Access Signature authorization

Applications using the Azure .NET SDK with the Service Bus .NET libraries can use SAS authorization through the [SharedAccessSignatureTokenProvider](/dotnet/api/microsoft.servicebus.sharedaccesssignaturetokenprovider) class. The following code illustrates the use of the token provider to send messages to a Service Bus queue.

```csharp
Uri runtimeUri = ServiceBusEnvironment.CreateServiceUri("sb",
    <yourServiceNamespace>, string.Empty);
MessagingFactory mf = MessagingFactory.Create(runtimeUri,
    TokenProvider.CreateSharedAccessSignatureTokenProvider(keyName, key));
QueueClient sendClient = mf.CreateQueueClient(qPath);

//Sending hello message to queue.
BrokeredMessage helloMessage = new BrokeredMessage("Hello, Service Bus!");
helloMessage.MessageId = "SAS-Sample-Message";
sendClient.Send(helloMessage);
```

Applications can also use SAS for authentication by using a SAS connection string in methods that accept connection strings.

Note that to use SAS authorization with Service Bus relays, you can use SAS keys configured on the Service Bus namespace. If you explicitly create a relay on the namespace ([NamespaceManager](/dotnet/api/microsoft.servicebus.namespacemanager) with a [RelayDescription](/dotnet/api/microsoft.servicebus.messaging.relaydescription)) object, you can set the SAS rules just for that relay. To use SAS authorization with Service Bus subscriptions, you can use SAS keys configured on a Service Bus namespace or on a topic.

## Use the Shared Access Signature (at HTTP level)

Now that you know how to create Shared Access Signatures for any entities in Service Bus, you are ready to perform an HTTP POST:

```http
POST https://<yournamespace>.servicebus.windows.net/<yourentity>/messages
Content-Type: application/json
Authorization: SharedAccessSignature sr=https%3A%2F%2F<yournamespace>.servicebus.windows.net%2F<yourentity>&sig=<yoursignature from code above>&se=1438205742&skn=KeyName
ContentType: application/atom+xml;type=entry;charset=utf-8
``` 

Remember, this works for everything. You can create SAS for a queue, topic, or subscription. 

If you give a sender or client a SAS token, they don't have the key directly, and they cannot reverse the hash to obtain it. As such, you have control over what they can access, and for how long. An important thing to remember is that if you change the primary key in the policy, any Shared Access Signatures created from it will be invalidated.

## Use the Shared Access Signature (at AMQP level)

In the previous section, you saw how to use the SAS token with an HTTP POST request for sending data to the Service Bus. As you know, you can access Service Bus using the Advanced Message Queuing Protocol (AMQP) that is the preferred protocol to use for performance reasons, in many scenarios. The SAS token usage with AMQP is described in the document [AMQP Claim-Based Security Version 1.0](https://www.oasis-open.org/committees/download.php/50506/amqp-cbs-v1%200-wd02%202013-08-12.doc) that is in working draft since 2013 but well-supported by Azure today.

Before starting to send data to Service Bus, the publisher must send the SAS token inside an AMQP message to a well-defined AMQP node named **$cbs** (you can see it as a "special" queue used by the service to acquire and validate all the SAS tokens). The publisher must specify the **ReplyTo** field inside the AMQP message; this is the node in which the service replies to the publisher with the result of the token validation (a simple request/reply pattern between publisher and service). This reply node is created "on the fly," speaking about "dynamic creation of remote node" as described by the AMQP 1.0 specification. After checking that the SAS token is valid, the publisher can go forward and start to send data to the service.

The following steps show how to send the SAS token with AMQP protocol using the [AMQP.Net Lite](https://github.com/Azure/amqpnetlite) library. This is useful if you can't use the official Service Bus SDK (for example on WinRT, .Net Compact Framework, .Net Micro Framework and Mono) developing in C\#. Of course, this library is useful to help understand how claims-based security works at the AMQP level, as you saw how it works at the HTTP level (with an HTTP POST request and the SAS token sent inside the "Authorization" header). If you don't need such deep knowledge about AMQP, you can use the official Service Bus SDK with .Net Framework applications, which will do it for you.

### C&#35;

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

    // the sender/receiver may be kept open for refreshing tokens
    cbsSender.Close();
    cbsReceiver.Close();
    session.Close();

    return result;
}
```

The `PutCbsToken()` method receives the *connection* (AMQP connection class instance as provided by the [AMQP .NET Lite library](https://github.com/Azure/amqpnetlite)) that represents the TCP connection to the service and the *sasToken* parameter that is the SAS token to send. 

> [!NOTE]
> It's important that the connection is created with **SASL authentication mechanism set to EXTERNAL** (and not the default PLAIN with username and password used when you don't need to send the SAS token).
> 
> 

Next, the publisher creates two AMQP links for sending the SAS token and receiving the reply (the token validation result) from the service.

The AMQP message contains a set of properties, and more information than a simple message. The SAS token is the body of the message (using its constructor). The **"ReplyTo"** property is set to the node name for receiving the validation result on the receiver link (you can change its name if you want, and it will be created dynamically by the service). The last three application/custom properties are used by the service to indicate what kind of operation it has to execute. As described by the CBS draft specification, they must be the **operation name** ("put-token"), the **type of token** (in this case, a "servicebus.windows.net:sastoken"), and the **"name" of the audience** to which the token applies (the entire entity).

After sending the SAS token on the sender link, the publisher must read the reply on the receiver link. The reply is a simple AMQP message with an application property named **"status-code"** that can contain the same values as an HTTP status code.

## Rights required for Service Bus operations

The following table shows the access rights required for various operations on Service Bus resources.

| Operation | Claim Required | Claim Scope |
| --- | --- | --- |
| **Namespace** | | |
| Configure authorization rule on a namespace |Manage |Any namespace address |
| **Service Registry** | | |
| Enumerate Private Policies |Manage |Any namespace address |
| Begin listening on a namespace |Listen |Any namespace address |
| Send messages to a listener at a namespace |Send |Any namespace address |
| **Queue** | | |
| Create a queue |Manage |Any namespace address |
| Delete a queue |Manage |Any valid queue address |
| Enumerate queues |Manage |/$Resources/Queues |
| Get the queue description |Manage |Any valid queue address |
| Configure authorization rule for a queue |Manage |Any valid queue address |
| Send into to the queue |Send |Any valid queue address |
| Receive messages from a queue |Listen |Any valid queue address |
| Abandon or complete messages after receiving the message in peek-lock mode |Listen |Any valid queue address |
| Defer a message for later retrieval |Listen |Any valid queue address |
| Deadletter a message |Listen |Any valid queue address |
| Get the state associated with a message queue session |Listen |Any valid queue address |
| Set the state associated with a message queue session |Listen |Any valid queue address |
| **Topic** | | |
| Create a topic |Manage |Any namespace address |
| Delete a topic |Manage |Any valid topic address |
| Enumerate topics |Manage |/$Resources/Topics |
| Get the topic description |Manage |Any valid topic address |
| Configure authorization rule for a topic |Manage |Any valid topic address |
| Send to the topic |Send |Any valid topic address |
| **Subscription** | | |
| Create a subscription |Manage |Any namespace address |
| Delete subscription |Manage |../myTopic/Subscriptions/mySubscription |
| Enumerate subscriptions |Manage |../myTopic/Subscriptions |
| Get subscription description |Manage |../myTopic/Subscriptions/mySubscription |
| Abandon or complete messages after receiving the message in peek-lock mode |Listen |../myTopic/Subscriptions/mySubscription |
| Defer a message for later retrieval |Listen |../myTopic/Subscriptions/mySubscription |
| Deadletter a message |Listen |../myTopic/Subscriptions/mySubscription |
| Get the state associated with a topic session |Listen |../myTopic/Subscriptions/mySubscription |
| Set the state associated with a topic session |Listen |../myTopic/Subscriptions/mySubscription |
| **Rules** | | |
| Create a rule |Manage |../myTopic/Subscriptions/mySubscription |
| Delete a rule |Manage |../myTopic/Subscriptions/mySubscription |
| Enumerate rules |Manage or Listen |../myTopic/Subscriptions/mySubscription/Rules 

## Next steps

To learn more about Service Bus messaging, see the following topics.

* [Service Bus fundamentals](service-bus-fundamentals-hybrid-solutions.md)
* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [How to use Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)

[Azure portal]: https://portal.azure.com