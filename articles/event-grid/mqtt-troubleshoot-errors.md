---
title: Azure Event Grid namespace MQTT functionality - Troubleshooting guide
description: This article provides guidance on how to troubleshoot MQTT functionality related issues. 
ms.topic: conceptual
ms.date: 05/08/2023
author: veyaddan
ms.author: veyaddan
---

# Troubleshooting guide for Azure Event Grid namespace MQTT functionality

This guide provides you with information on what you can do to troubleshoot things before you submit a support ticket.

## Unable to connect an MQTT client to your Event Grid namespace

If your client doesn't connect to your Event Grid namespace, a few things to verify:

1. Do you have the client metadata created with the service?
    - You should have a client identity entry with the service before the client can connect.  Review the quick start guide to [publish and subscribe MQTT messages](mqtt-publish-and-subscribe-portal.md) using Event Grid namespace.
1. Verify in the client metadata that the client connection status is enabled.
1. Are the authentication credentials configured correctly?
    - One of the following two conditions must be met
        - Username field in the client connect packet matches the client authentication name in client metadata.
        - Or, one of the five supported certificate fields have the client authentication name.  As the client authentication name isn't provided in the username field, an alternative source must be chosen on the Configuration page under Settings of namespace.  Learn more about [client authentication configuration](mqtt-client-authentication.md).
    - If you're using the CA certificate chain based authentication, ensure the client certificate is signed by one of the CA certificates uploaded to the service.  Learn more about [certificate chain based client authentication](mqtt-certificate-chain-client-authentication.md).
    - If you're using self-signed X.509 certificate thumbprint to authenticate the client, check that the thumbprint in the client metadata matches with thumbprint in the certificate you're using in connect packet.
1. Make sure the port 8883 is open in your firewall.
1. Ensure the Client ID is unique across all the clients in the namespace.  If you use same client ID for a new client connection, the existing client connection is replaced.

## MQTT client gets disconnected

If your client gets disconnected from your Event Grid namespace, a few things to verify:

1. Ensure the namespace is still available in the region.
1. Ensure the client metadata is still intact, with client authentication name
1. Ensure the topic to which the client is publishing actually exists.
1. If client disconnects when publishing, ensure the client has permission to publish to the topic.  Client needs to be part of a client group with publish permissions on the topic.  Learn more about [access controls](mqtt-access-control.md)
1. Ensure Client ID is unique across clients in a namespace.  If a new client is connected with the same Client ID, the client that's already using the Client ID is disconnected.  Learn more about [establishing multiple sessions per client](mqtt-establishing-multiple-sessions-per-client.md).
1. Ensure the keep alive time is optimized to fit the message activity patterns of the client. Learn more about [keep alive time](mqtt-support.md) support.

## Client isn't able to receive MQTT messages

If your client is connected but it isn't receiving any MQTT messages, a few things to verify:

1. If you're using custom client groups (not the $all) to provide permission, ensure that the client belongs to the correct client group.  Learn more about [client groups](mqtt-client-groups.md).
1. Ensure the client group has the subscribe permissions configured to the topic spaces.  Learn more about [permission bindings](mqtt-access-control.md).
1. Also, make sure the topic(s) that client is subscribing to, are included in the topic space to which the client has subscribe access.  Learn more about [configuring topic spaces](mqtt-topic-spaces.md)
1. Ensure the message expiry interval is optimized for the client's connectivity patterns.
1. If the maximum message size property is configured, ensure that the published messages meet the size requirements of the subscribing client.  Learn more about the [message size limits](mqtt-support.md)
1. If response topics are used, ensure that the client is subscribing to the response topics before publishing on the request topic.
1. Use QoS 1 setting to have service guarantee the delivery of messages at least once.  And, ensure the client sends acknowledgment on receipt of messages.  If acknowledgment isn't receive, service will stop sending messages to the client after 16 unacknowledged messages.

## Failing to route the MQTT messages to an endpoint

If you aren't receiving MQTT messages on the configured routing endpoint, a few things to verify:

1. Ensure the Data Sender role is enabled on the routing topic.
1. Ensure to use the Cloud Event Schema V1.0 is used.  Learn more about [routing event schema](mqtt-routing-event-schema.md).
1. Ensure the data isn't filtered out.  Learn more about [filtering message while routing](mqtt-routing-filtering.md).

## Next steps
Learn about [MQTT monitoring metrics](monitor-mqtt-delivery-reference.md)
