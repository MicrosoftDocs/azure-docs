---
title: Azure Service Bus - Migrate to Shared Access Signature authorization
description: Learn about migrating from Azure Active Directory Access Control Service to Shared Access Signature authorization.
services: service-bus-messaging
documentationcenter: ''
author: axisc
editor: spelluru

ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/27/2020
ms.author: aschhab

---

# Service Bus - Migrate from Azure Active Directory Access Control Service to Shared Access Signature authorization

Service Bus applications have previously had a choice of using two different authorization models: the [Shared Access Signature (SAS)](service-bus-sas.md) token model provided directly by Service Bus, and a federated model where the management of authorization rules is managed inside by the [Azure Active Directory](/azure/active-directory/) Access Control Service (ACS), and tokens obtained from ACS are passed to Service Bus for authorizing access to the desired features.

The ACS authorization model has long been superseded by [SAS authorization](service-bus-authentication-and-authorization.md) as the preferred model, and all documentation, guidance, and samples exclusively use SAS today. Moreover, it is no longer possible to create new Service Bus namespaces that are paired with ACS.

SAS has the advantage in that it is not immediately dependent on another service, but can be used directly from a client without any intermediaries by giving the client access to the SAS rule name and rule key. SAS can also be easily integrated with an approach in which a client has to first pass an authorization check with another service and then is issued a token. The latter approach is similar to the ACS usage pattern, but enables issuing access tokens based on application-specific conditions that are difficult to express in ACS.

For all existing applications that are dependent on ACS, we urge customers to migrate their applications to rely on SAS instead.

## Migration scenarios

ACS and Service Bus are integrated through the shared knowledge of a *signing key*. The signing key is used by an ACS namespace to sign authorization tokens, and it's used by Service Bus to verify that the token has been issued by the paired ACS namespace. The ACS namespace holds service identities and authorization rules. The authorization rules define which service identity or which token issued by an external identity provider gets which type of access to a part of the Service Bus namespace graph, in the form of a longest-prefix match.

For example, an ACS rule might grant the **Send** claim on the path prefix `/` to a service identity, which means that a token issued by ACS based on that rule grants the client rights to send to all entities in the namespace. If the path prefix is `/abc`, the identity is restricted to sending to entities named `abc` or organized beneath that prefix. It is assumed that readers of this migration guidance are already familiar with these concepts.

The migration scenarios fall into three broad categories:

1.  **Unchanged defaults**. Some customers use a [SharedSecretTokenProvider](/dotnet/api/microsoft.servicebus.sharedsecrettokenprovider) object, passing the automatically generated **owner** service identity and its secret key for the ACS namespace, paired with the Service Bus namespace, and do not add new rules.

2.  **Custom service identities with simple rules**. Some customers add new service identities and grant each new service identity **Send**, **Listen**, and **Manage** permissions for one specific entity.

3.  **Custom service identities with complex rules**. Very few customers have complex rule sets in which externally issued tokens are mapped to rights on Relay, or where a single service identity is assigned differentiated rights on several namespace paths through multiple rules.

For assistance with the migration of complex rule sets, you can contact [Azure support](https://azure.microsoft.com/support/options/). The other two scenarios enable straightforward migration.

### Unchanged defaults

If your application has not changed ACS defaults, you can replace all [SharedSecretTokenProvider](/dotnet/api/microsoft.servicebus.sharedsecrettokenprovider) usage with a [SharedAccessSignatureTokenProvider](/dotnet/api/microsoft.servicebus.sharedaccesssignaturetokenprovider) object, and use the namespace preconfigured **RootManageSharedAccessKey** instead of the ACS **owner** account. Note that even with the ACS **owner** account, this configuration was (and still is) not generally recommended, because this account/rule provides full management authority over the namespace, including permission to delete any entities.

### Simple rules

If the application uses custom service identities with simple rules, the migration is straightforward in the case where an ACS service identity was created to provide access control on a specific queue. This scenario is often the case in SaaS-style solutions where each queue is used as a bridge to a tenant site or branch office, and the service identity is created for that particular site. In this case, the respective service identity can be migrated to a Shared Access Signature rule, directly on the queue. The service identity name can become the SAS rule name and the service identity key can become the SAS rule key. The rights of the SAS rule are then configured equivalent to the respectively applicable ACS rule for the entity.

You can make this new and additional configuration of SAS in-place on any existing namespace that is federated with ACS, and the migration away from ACS is subsequently performed by using [SharedAccessSignatureTokenProvider](/dotnet/api/microsoft.servicebus.sharedaccesssignaturetokenprovider) instead of [SharedSecretTokenProvider](/dotnet/api/microsoft.servicebus.sharedsecrettokenprovider). The namespace does not need to be unlinked from ACS.

### Complex rules

SAS rules are not meant to be accounts, but are named signing keys associated with rights. As such, scenarios in which the application creates many service identities and grants them access rights for several entities or the whole namespace still require a token-issuing intermediary. You can obtain guidance for such an intermediary by [contacting support](https://azure.microsoft.com/support/options/).

## Next steps

To learn more about Service Bus authentication, see the following topics:

* [Service Bus authentication and authorization](service-bus-authentication-and-authorization.md)
* [Service Bus authentication with Shared Access Signatures](service-bus-sas.md)

