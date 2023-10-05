---
title: Secure Azure IoT MQ communication
# titleSuffix: Azure IoT MQ
description: Understand how to use the BrokerListener resource to secure Azure IoT MQ communications including authorization, authentication, and TLS.
author: PatAltimore
ms.author: patricka
ms.topic: concept-article
ms.date: 10/02/2023

#CustomerIntent: As an operator, I want understand options to secure MQTT communications for my IoT Operations solution.
---


<!--
Remove all the comments in this template before you sign-off or merge to the  main branch.

This template provides the basic structure of a Concept article pattern. See the [instructions - Concept](../level4/article-concept.md) in the pattern library.

You can provide feedback about this template at: https://aka.ms/patterns-feedback

Concept is an article pattern that defines what something is or explains an abstract idea.

There are several situations that might call for writing a Concept article, including:

* If there's a new idea that's central to a service or product, that idea must be explained so that customers understand the value of the service or product as it relates to their circumstances. A good recent example is the concept of containerization or the concept of scalability.
* If there's optional information or explanations that are common to several Tutorials or How-to guides, this information can be consolidated and single-sourced in a full-bodied Concept article for you to reference.
* If a service or product is extensible, advanced users might modify it to better suit their application. It's better that advanced users fully understand the reasoning behind the design choices and everything else "under the hood" so that their variants are more robust, thereby improving their experience.

-->

<!-- 1. H1
-----------------------------------------------------------------------------

Required. Set expectations for what the content covers, so customers know the content meets their needs. The H1 should NOT begin with a verb.

Reflect the concept that undergirds an action, not the action itself. The H1 must start with:

* "\<noun phrase\> concept(s)", or
* "What is \<noun\>?", or
* "\<noun\> overview"

Concept articles are primarily distinguished by what they aren't:

* They aren't procedural articles. They don't show how to complete a task.
* They don't have specific end states, other than conveying an underlying idea, and don't have concrete, sequential actions for the user to take.

One clear sign of a procedural article would be the use of a numbered list. With rare exception, numbered lists shouldn't appear in Concept articles.

-->

# Secure Azure IoT MQ communication

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

To customize the network access and security use the **BrokerListener** resource. A listener is a network endpoint that exposes the broker to the network. You can have one or more BrokerListener resources for each Broker resource, and thus multiple ports with different access control each.

Each listener can have its own authentication and authorization rules, which define who can connect to the listener and what actions they can perform on the broker. You can use BrokerAuthentication and BrokerAuthorization resources to specify the access control policies for each listener. This allows you to fine-tune the permissions and roles of your MQTT clients, based on their needs and use cases.


<!-- 4. H2s (Article body)
--------------------------------------------------------------------

Required: In a series of H2 sections, the article body should discuss the ideas that explain how "X is a (type of) Y that does Z":

* Give each H2 a heading that sets expectations for the content that follows.
* Follow the H2 headings with a sentence about how the section contributes to the whole.
* Describe the concept's critical features in the context of defining what it is.
* Provide an example of how it's used where, how it fits into the context, or what it does. If it's complex and new to the user, show at least two examples.
* Provide a non-example if contrasting it will make it clearer to the user what the concept is.
* Images, code blocks, or other graphical elements come after the text block it illustrates.
* Don't number H2s.

-->

## BrokerListener resource

The *BrokerListener* resource has these fields:

- `brokerRef`: The name of the Broker resource that this listener belongs to. This field is required and must match an existing Broker resource in the same namespace.
- `port`: The port number that this listener listens on. This field is required and must be a valid TCP port number.
- `serviceType`: The type of the Kubernetes Service created for this listener. This subfield is optional and defaults to `loadBalancer`. Must be either `loadBalancer`, `clusterIp`, or `nodePort`.
- `serviceName`: The name of Kubernetes Service created for this listener. Kubernetes will create DNS records for this `serviceName` which clients should use to connect to IoT MQ. This subfield is optional and defaults to `azedge-dmqtt-frontend`. If multiple service types are specified across different `BrokerListeners`, each `serviceType` must have a unique `serviceName`.
- `nodePort`: If `serviceType` is `nodePort`, specify the port to use as the `nodePort`. Has no effect for other service types.
- `authenticationEnabled`: A boolean flag that indicates whether this listener requires authentication from clients. If set to `true`, this listener uses any BrokerAuthentication resources associated with it to verify and authorize the clients. If set to `false`, this listener allows any client to connect without authentication. This field is optional and defaults to `false`.
- `authorizationEnabled`: A boolean flag that indicates whether to enable policy checking for the authorization policies. If set to `true`, the broker checks the BrokerAuthorization policies for each client and topic request, and deny any request that does not match any rule. If no BrokerAuthorization is provided, DenyAll is used and all requests will fail. If set to `false`, the broker allows any request that does not match any rule, as long as the client is authenticated. This field is optional and defaults to `false`.
- `tls`: The TLS settings for this listener. This field is optional and can be omitted to disable TLS for the listener. To configure TLS, set it one of these types:
  - `automatic`: Indicates that this listener uses cert-manager to get and renew a certificate for the listener. To use this type, specify an `issuerRef` field to reference the cert-manager Issuer.
  - `manual`: Indicates that this listener uses a manually provided certificate for the listener. To use this type, specify a `secret` field that references a Kubernetes Secret resource containing the certificate and the private key.

### Example configuration

This example shows how to create two BrokerListener resources for a Broker resource named `my-broker`. Each BrokerListener resource defines a port and a TLS setting for a listener that accepts MQTT connections from clients.

- The first BrokerListener resource, named `my-test-listener`, defines a listener on port 1883 with no TLS and authentication off. Clients can connect to the broker without encryption or authentication.
- The second BrokerListener resource, named `my-secure-listener`, defines a listener on port 8883 with TLS and authentication enabled. Only authenticated clients can connect to the broker with TLS encryption. The `tls` field to `automatic`, which means that the listener uses cert-manager to get and renew its server certificate.

To create these BrokerListener resources, apply this YAML manifest to your Kubernetes cluster:

```yaml
apiVersion: az-edge.com/v1alpha3
kind: BrokerListener
metadata:
  name: my-test-listener
  namespace: default
spec:
  authenticationEnabled: false
  authorizationEnabled: false
  brokerRef: my-broker
  port: 1883
---
apiVersion: az-edge.com/v1alpha3
kind: BrokerListener
metadata:
  name: my-secure-listener
  namespace: default
spec:
  authenticationEnabled: true
  authorizationEnabled: false
  brokerRef: my-broker
  port: 8883
  tls:
    automatic:
      issuerRef:
        name: e2e-cert-issuer
        kind: Issuer
```

## Related content

- Configure authentication for a BrokerListener
- Configure authorization for a BrokerListener
- Configure TLS for a BrokerListener

