<properties 
    pageTitle="Shared Access Signature Authentication with Service Bus | Microsoft Azure"
    description="Details about SAS authentication with Service Bus."
    services="service-bus"
    documentationCenter="na"
    authors="sethmanheim"
    manager="timlt"
    editor="" />
<tags 
    ms.service="service-bus"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="na"
    ms.date="06/22/2016"
    ms.author="sethm" />

# Shared Access Signature Authentication with Service Bus

[Shared Access Signature (SAS)](service-bus-sas-overview.md) authentication enables applications to authenticate to Service Bus using an access key configured on the namespace, or on the messaging entity (queue or topic) with which specific rights are associated. You can then use this key to generate a SAS token that clients can in turn use to authenticate to Service Bus.

SAS authentication support is included in the Azure SDK version 2.0 and later. For more information about Service Bus authentication, see [Service Bus Authentication and Authorization](service-bus-authentication-and-authorization.md).

## Concepts

SAS authentication in Service Bus involves the configuration of a cryptographic key with associated rights on a Service Bus resource. Clients claim access to Service Bus resources by presenting a SAS token. This token consists of the resource URI being accessed, and an expiry signed with the configured key.

You can configure Shared Access Signature authorization rules on Service Bus [relays](service-bus-fundamentals-hybrid-solutions.md#relays), [queues](service-bus-fundamentals-hybrid-solutions.md#queues), [topics](service-bus-fundamentals-hybrid-solutions.md#topics), and [Event Hubs](service-bus-fundamentals-hybrid-solutions.md#event-hubs).

SAS authentication uses the following elements:

- [Shared Access authorization rule](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sharedaccessauthorizationrule.aspx): A 256-bit primary cryptographic key in Base64 representation, an optional secondary key, and a key name and associated rights (a collection of *Listen*, *Send*, or *Manage* rights).

- [Shared Access Signature](https://msdn.microsoft.com/library/azure/microsoft.servicebus.sharedaccesssignaturetokenprovider.sharedaccesssignature.aspx) token: Generated using the HMAC-SHA256 of a resource string, consisting of the URI of the resource that is accessed and an expiry, with the cryptographic key. The signature and other elements described in the following sections are formatted into a string to form the [SharedAccessSignature](https://msdn.microsoft.com/library/azure/microsoft.servicebus.sharedaccesssignaturetokenprovider.sharedaccesssignature.aspx) token.

## Configuration for Shared Access Signature authentication

You can configure the [SharedAccessAuthorizationRule](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sharedaccessauthorizationrule.aspx) rule on Service Bus namespaces, queues, or topics. Configuring a [SharedAccessAuthorizationRule](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sharedaccessauthorizationrule.aspx) on a Service Bus subscription is currently not supported, but you can use rules configured on a namespace or topic to secure access to subscriptions. For a working sample that illustrates this procedure, see the [Using Shared Access Signature (SAS) authentication with Service Bus Subscriptions](http://code.msdn.microsoft.com/Using-Shared-Access-e605b37c) sample.

A maximum of 12 such rules can be configured on a Service Bus namespace, queue, or topic. Rules that are configured on a Service Bus namespace apply to all entities in that namespace.

![SAS](./media/service-bus-shared-access-signature-authentication/IC676272.gif)

In this figure, the *manageRuleNS*, *sendRuleNS*, and *listenRuleNS* authorization rules apply to both queue Q1 and topic T1, while *listenRuleQ* and *sendRuleQ* apply only to queue Q1 and *sendRuleT* applies only to topic T1.

The key parameters of a [SharedAccessAuthorizationRule](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sharedaccessauthorizationrule.aspx) are as follows:

|Parameter|Description|
|---|---|
|*KeyName*|A string that describes the authorization rule.|
|*PrimaryKey*|A base64-encoded 256-bit primary key for signing and validating the SAS token.|
|*SecondaryKey*|A base64-encoded 256-bit secondary key for signing and validating the SAS token.|
|*AccessRights*|A list of access rights granted by the authorization rule. These rights can be any collection of Listen, Send, and Manage rights.|

When a Service Bus namespace is provisioned, a [SharedAccessAuthorizationRule](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sharedaccessauthorizationrule.aspx), with [KeyName](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sharedaccessauthorizationrule.keyname.aspx) set to **RootManageSharedAccessKey**, is created by default.

## Regenerate and revoke keys for Shared Access Authorization rules

It is recommended that you periodically regenerate the keys used in the [SharedAccessAuthorizationRule](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sharedaccessauthorizationrule.aspx) object. Applications should generally use the [PrimaryKey](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sharedaccessauthorizationrule.primarykey.aspx) to generate a SAS token. When regenerating the keys, you should replace the [SecondaryKey](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sharedaccessauthorizationrule.secondarykey.aspx) with the old primary key, and generate a new key as the new primary key. This enables you to continue using tokens for authorization that were issued with the old primary key, and that have not yet expired.

If a key is compromised and you have to revoke the keys, you can regenerate both the [PrimaryKey](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sharedaccessauthorizationrule.primarykey.aspx) and the [SecondaryKey](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sharedaccessauthorizationrule.secondarykey.aspx) of a [SharedAccessAuthorizationRule](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sharedaccessauthorizationrule.aspx), replacing them with new keys. This procedure invalidates all tokens signed with the old keys.

## Generating a Shared Access Signature token

Any client that has access to the signing keys specified in the shared access authorization rule can generate the SAS token. It is formatted as follows:

```
SharedAccessSignature sig=<signature-string>&se=<expiry>&skn=<keyName>&sr=<URL-encoded-resourceURI>
```

The **signature** for the SAS token is computed using the HMAC-SHA256 hash of a string-to-sign with the [PrimaryKey](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sharedaccessauthorizationrule.primarykey.aspx) property of an authorization rule. The string-to-sign consists of a resource URI and an expiry, formatted as follows:

```
StringToSign = <resourceURI> + "\n" + expiry;
```

Note that you should use the encoded resource URI for this operation. The resource URI is the full URI of the Service Bus resource to which access is claimed. For example, `http://<namespace>.servicebus.windows.net/<entityPath>` or `sb://<namespace>.servicebus.windows.net/<entityPath>`; that is, `http://contoso.servicebus.windows.net/contosoTopics/T1/Subscriptions/S3`.

The expiry is represented as the number of seconds since the epoch 00:00:00 UTC on 1 January 1970.

The shared access authorization rule used for signing must be configured on the entity specified by this URI, or by one of its hierarchical parents. For example, `http://contoso.servicebus.windows.net/contosoTopics/T1` or `http://contoso.servicebus.windows.net` in the previous example.

A SAS token is valid for all resources under the `<resourceURI>` used in the string-to-sign.

The [KeyName](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sharedaccessauthorizationrule.keyname.aspx) in the SAS token refers to the **keyName** of the shared access authorization rule used to generate the token.

The *URL-encoded-resourceURI* must be the same as the URI used in the string-to-sign during the computation of the signature. It should be [percent-encoded](https://msdn.microsoft.com/library/4fkewx0t.aspx).

## How to use Shared Access Signature authentication with Service Bus

The following scenarios include configuration of authorization rules, generation of SAS tokens, and client authorization.

For a full working sample of a Service Bus application that illustrates the configuration and uses SAS authorization, see [Shared Access Signature authentication with Service Bus](http://code.msdn.microsoft.com/Shared-Access-Signature-0a88adf8). A related sample that illustrates the use of SAS authorization rules configured on namespaces or topics to secure Service Bus subscriptions is available here: [Using Shared Access Signature (SAS) authentication with Service Bus Subscriptions](http://code.msdn.microsoft.com/Using-Shared-Access-e605b37c).

## Access Shared Access Authorization rules on a namespace

Operations on the Service Bus namespace root require certificate authentication. You must upload a management certificate for your Azure subscription. To upload a management certificate, click **Settings** in the left-hand pane of the [Azure classic portal][]. For more information about Azure management certificates, see the [Azure certificates overview](../cloud-services/cloud-services-certs-create.md#what-are-management-certificates).

The endpoint for accessing shared access authorization rules on a Service Bus namespace is as follows:

```
https://management.core.windows.net/{subscriptionId}/services/ServiceBus/namespaces/{namespace}/AuthorizationRules/
```

To create a [SharedAccessAuthorizationRule](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sharedaccessauthorizationrule.aspx) object on a Service Bus namespace, execute a POST operation on this endpoint with the rule information serialized as JSON or XML. For example:

```
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

```
https://management.core.windows.net/{subscriptionId}/services/ServiceBus/namespaces/{namespace}/AuthorizationRules/{KeyName}
```

## Accessing Shared Access Authorization rules on an entity

You can access a [Microsoft.ServiceBus.Messaging.SharedAccessAuthorizationRule](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.sharedaccessauthorizationrule.aspx) object configured on a Service Bus queue or topic through the [AuthorizationRules](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.authorizationrules.aspx) collection in the corresponding [QueueDescription](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.queuedescription.aspx), [TopicDescription](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.topicdescription.aspx), or [NotificationHubDescription](https://msdn.microsoft.com/library/azure/microsoft.servicebus.notifications.notificationhubdescription.aspx) objects.

The following code shows how to add authorization rules for a queue.

```
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

## Using Shared Access Signature authorization

Applications using the Azure .NET SDK with the Service Bus .NET libraries can use SAS authorization through the [SharedAccessSignatureTokenProvider](https://msdn.microsoft.com/library/azure/microsoft.servicebus.sharedaccesssignaturetokenprovider.aspx) class. The following code illustrates the use of the token provider to send messages to a Service Bus queue.

```
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

Note that to use SAS authorization with Service Bus relays, you can use SAS keys configured on the Service Bus namespace. If you explicitly create a relay on the namespace ([NamespaceManager](https://msdn.microsoft.com/library/azure/microsoft.servicebus.namespacemanager.aspx) with a [RelayDescription](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.relaydescription.aspx)) object, you can set the SAS rules just for that relay. To use SAS authorization with Service Bus subscriptions, you can use SAS keys configured on a Service Bus namespace or on a topic.

## Rights required for Service Bus operations

The following table shows the access rights required for various operations on Service Bus resources.

|Operation|Claim Required|Claim Scope|
|---|---|---|
|**Namespace**|||
|Configure authorization rule on a namespace|Manage|Any namespace address|
|**Service Registry**|||
|Enumerate Private Policies|Manage|Any namespace address|
|Relay|||
|Begin listening on a namespace|Listen|Any namespace address|
|Send messages to a listener at a namespace|Send|Any namespace address|
|**Queue**|||
|Create a queue|Manage|Any namespace address|
|Delete a queue|Manage|Any valid queue address|
|Enumerate queues|Manage|/$Resources/Queues|
|Get the queue description|Manage or Send|Any valid queue address|
|Configure authorization rule for a queue|Manage|Any valid queue address|
|Send into to the queue|Send|Any valid queue address|
|Receive messages from a queue|Listen|Any valid queue address|
|Abandon or complete messages after receiving the message in peek-lock mode|Listen|Any valid queue address|
|Defer a message for later retrieval|Listen|Any valid queue address|
|Deadletter a message|Listen|Any valid queue address|
|Get the state associated with a message queue session|Listen|Any valid queue address|
|Set the state associated with a message queue session|Listen|Any valid queue address|
|**Topic**|||
|Create a topic|Manage|Any namespace address|
|Delete a topic|Manage|Any valid topic address|
|Enumerate topics|Manage|/$Resources/Topics|
|Get the topic description|Manage or Send|Any valid topic address|
|Configure authorization rule for a topic|Manage|Any valid topic address|
|Send to the topic|Send|Any valid topic address|
|**Subscription**|||
|Create a subscription|Manage|Any namespace address|
|Delete subscription|Manage|../myTopic/Subscriptions/mySubscription|
|Enumerate subscriptions|Manage|../myTopic/Subscriptions|
|Get subscription description|Manage or Listen|../myTopic/Subscriptions/mySubscription|
|Abandon or complete messages after receiving the message in peek-lock mode|Listen|../myTopic/Subscriptions/mySubscription|
|Defer a message for later retrieval|Listen|../myTopic/Subscriptions/mySubscription|
|Deadletter a message|Listen|../myTopic/Subscriptions/mySubscription|
|Get the state associated with a topic session|Listen|../myTopic/Subscriptions/mySubscription|
|Set the state associated with a topic session|Listen|../myTopic/Subscriptions/mySubscription|
|**Rule**|||
|Create a rule|Manage|../myTopic/Subscriptions/mySubscription|
|Delete a rule|Manage|../myTopic/Subscriptions/mySubscription|
|Enumerate rules|Manage or Listen|../myTopic/Subscriptions/mySubscription/Rules|
|**Notification Hubs**|||
|Create a notification hub|Manage|Any namespace address|
|Create or update registration for an active device|Listen or Manage|../notificationHub/tags/{tag}/registrations|
|Update PNS information|Listen or Manage|../notificationHub/tags/{tag}/registrations/updatepnshandle|
|Send to a notification hub|Send|../notificationHub/messages|

## Next steps

For a high-level overview of SAS in Service Bus, see [Shared Access Signatures](service-bus-sas-overview.md).

See [Service Bus authentication and authorization](service-bus-authentication-and-authorization.md) for more background on Service Bus authentication.

[Azure classic portal]: http://manage.windowsazure.com