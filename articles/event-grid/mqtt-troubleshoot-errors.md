---
title: Azure Event Grid’s MQTT broker feature - Troubleshooting guide
description: This article provides guidance on how to troubleshoot MQTT broker related issues. 
ms.topic: conceptual
ms.custom: build-2023
ms.date: 05/23/2023
author: veyaddan
ms.author: veyaddan
---

# Guide to troubleshoot issues with Azure Event Grid’s MQTT broker feature

This guide provides you with information on what you can do to troubleshoot things before you submit a support ticket.

[!INCLUDE [mqtt-preview-note](./includes/mqtt-preview-note.md)]

## Unable to connect an MQTT client to your Event Grid namespace

If your client doesn't connect to your Event Grid namespace, a few things to verify:

- Do you have the client metadata created with the service?
    - You should have a client identity entry with the service before the client can connect.  Review the quick start guide to [publish and subscribe MQTT messages](mqtt-publish-and-subscribe-portal.md) using Event Grid namespace.
- Verify in the client metadata that the client connection status is enabled.
- Are the authentication credentials configured correctly?
    - One of the following two conditions must be met
        - Username field in the client connect packet matches the client authentication name in client metadata.
        - Or, one of the five supported certificate fields have the client authentication name.  As the client authentication name isn't provided in the username field, an alternative source must be chosen on the Configuration page under Settings of namespace.  Learn more about [client authentication configuration](mqtt-client-authentication.md).
    - If you're using the CA certificate chain based authentication, ensure the client certificate is signed by one of the CA certificates uploaded to the service.  Learn more about [certificate chain based client authentication](mqtt-certificate-chain-client-authentication.md).
    - If you're using self-signed X.509 certificate thumbprint to authenticate the client, check that the thumbprint in the client metadata matches with thumbprint in the certificate you're using in connect packet.
- Make sure the port 8883 is open in your firewall.
- Ensure the Client ID is unique across all the clients in the namespace.  If you use same client ID for a new client connection, the existing client connection is replaced.
- Check the [limits](quotas-limits.md) on number of clients that can connect to a namespace.

## MQTT client gets disconnected

If your client gets disconnected from your Event Grid namespace, a few things to verify:

- Ensure the namespace is available in the region.
- Ensure the client metadata is still intact, with client authentication name
- Ensure the topic to which the client is publishing actually exists.
- If client disconnects when publishing, ensure the client has permission to publish to the topic.  Client needs to be part of a client group with publish permissions on the topic.  Learn more about [access controls](mqtt-access-control.md)
- Ensure Client ID is unique across clients in a namespace.  If a new client is connected with the same Client ID, the client that's already using the Client ID is disconnected.  Learn more about [establishing multiple sessions per client](mqtt-establishing-multiple-sessions-per-client.md).
- Ensure the keep alive time is optimized to fit the message activity patterns of the client. Learn more about [keep alive time](mqtt-support.md) support.
- When using MQTT V5, check the disconnect packet for the reason for disconnection of the client.  Server communicates the reason (in most scenarios) for disconnect to the client, to help client handle the disconnect better.
- Consider configuring client life cycle events to see the disconnection reasons.  To learn more life cycle events, see [MQTT client life cycle events](mqtt-client-life-cycle-events.md).
- Check the [limits](quotas-limits.md) on number of clients that can connect to a namespace.

## Client isn't able to publish or receive MQTT messages

If your client is connected but it isn't receiving any MQTT messages, a few things to verify:

- If you're using custom client groups (not the $all), ensure that the client belongs to the correct client group.  Learn more about [client groups](mqtt-client-groups.md).
- Ensure the client group has the publish or subscribe permissions configured to the topic spaces.  Learn more about [permission bindings](mqtt-access-control.md).
- If using MQTT V5, negative acknowledgments are supported.  Server also notifies the publishing client, if the server can't currently process the message, along with the reason.
- Also, make sure the topic(s) that client is subscribing to, are included in the topic space to which the client has subscribe access.  Learn more about [configuring topic spaces](mqtt-topic-spaces.md)
- Ensure the message expiry interval is optimized for the client's connectivity patterns.
- If the maximum message size property is configured, ensure that the published messages meet the size requirements of the subscribing client.  Learn more about the [message size limits](mqtt-support.md)
- If response topics are used, ensure that the client is subscribing to the response topics before publishing on the request topic.
- Use QoS 1 setting to have service guarantee the delivery of messages at least once.  And, ensure the client sends acknowledgment on receipt of messages.  If acknowledgment isn't received, service will stop sending messages to the client after 16 unacknowledged messages.
- Check the [limits](quotas-limits.md) on publishing messages.

## Failing to route the MQTT messages to an endpoint

If you aren't receiving MQTT messages on the configured routing endpoint, a few things to verify:

- Ensure the Data Sender role is enabled on the routing topic.
- Ensure to use the Cloud Event Schema V1.0 is used.  Learn more about [routing event schema](mqtt-routing-event-schema.md).
- Ensure the data isn't filtered out.  Learn more about [filtering message while routing](mqtt-routing-filtering.md).

## Next steps
Learn about [MQTT monitoring metrics](monitor-mqtt-delivery-reference.md)
