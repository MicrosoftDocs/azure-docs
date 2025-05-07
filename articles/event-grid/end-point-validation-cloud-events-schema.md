---
title: Endpoint validation with CloudEvents schema
description: This article describes WebHook event delivery and endpoint validation when using webhooks and CloudEvents v1.0 schema.
ms.topic: concept-article
ms.date: 09/25/2024
ms.custom: FY25Q1-Linter
#customer intent: As a developer, I want to know hw to validate a Webhook endpoint using the CloudEvents v1.0 schema.
---


# Endpoint validation with CloudEvents schema
Webhooks are one of the many ways to receive events from Azure Event Grid. When a new event is ready, Event Grid service POSTs an HTTP request to the configured endpoint with the event information in the request body.

Like many other services that support webhooks, Event Grid requires you to prove ownership of your Webhook endpoint before it starts delivering events to that endpoint. This requirement prevents a malicious user from flooding your endpoint with events. 

## Endpoint validation with CloudEvents v1.0
CloudEvents v1.0 implements its own abuse protection semantics using the **HTTP OPTIONS** method. When you use the CloudEvents schema for output, Event Grid uses the CloudEvents v1.0 abuse protection in place of the Event Grid validation event mechanism.

### CloudEvent v1.0 abuse protection
Any system that allows registration of and delivery of notifications to arbitrary HTTP endpoints can potentially be abused such that someone maliciously or inadvertently registers the address of a system that doesn't expect such requests and for which the registering party isn't authorized to perform such a registration. In extreme cases, a notification infrastructure could be abused to launch denial-of-service attacks against an arbitrary web-site.

To protect the sender from being abused in such a way, a legitimate delivery target needs to indicate that it agrees with notifications being delivered to it.

Reaching the delivery agreement is realized using the following validation handshake. The handshake can either be executed immediately at registration time
or as a "preflight" request immediately preceding a delivery.

It's important to understand that the handshake doesn't aim to establish an authentication or authorization context. It only serves to protect the sender
from being told to a push to a destination that isn't expecting the traffic. While this specification mandates use of an authorization model, this mandate isn't sufficient to protect any arbitrary website from unwanted traffic if that website doesn't implement access control and therefore ignores the `Authorization` header.

Delivery targets SHOULD support the abuse protection feature. If a target doesn't support the feature, the sender MAY choose not to send to the target, at all, or send only at a very low request rate.

### Validation request

The validation request uses the **HTTP OPTIONS** method. The request is directed to the exact resource target URI that is being registered. With the validation request, the sender asks the target for permission to send notifications, and it can declare a desired request rate (requests per minute). The delivery target will respond with a permission statement and the permitted request rate. Here's a couple of the header fields are for inclusion in the validation request.

#### WebHook-Request-Origin

The `WebHook-Request-Origin` header MUST be included in the validation request and requests permission to send notifications from this sender, and contains a
Domain Name System (DNS) expression that identifies the sending system, for example `eventemitter.example.com`. The value is meant to summarily identify all sender
instances that act on the behalf of a certain system, and not an individual host.

After the handshake and if permission has been granted, the sender MUST use the `Origin` request header for each delivery request, with the value matching that
of this header. 

Example:

```bash
WebHook-Request-Origin: eventemitter.example.com
```

### Validation response

If and only if the delivery target does allow delivery of the events, it MUST reply to the request by including the `WebHook-Allowed-Origin` and
`WebHook-Allowed-Rate` headers. If the delivery target chooses to grant permission by callback, it withholds the response headers.

If the delivery target doesn't allow delivery of the events or doesn't expect delivery of events and nevertheless handles the HTTP OPTIONS method, the
existing response ought not to be interpreted as consent, and therefore the handshake can't rely on status codes. If the delivery target otherwise doesn't
handle the HTTP OPTIONS method, it SHOULD respond with HTTP status code 405, as if OPTIONS weren't supported.

The OPTIONS response SHOULD include the `Allow` header indicating the POST method being permitted. Other methods MAY be permitted on the
resource, but their function is outside the scope of this specification.

### WebHook-Allowed-Origin

The `WebHook-Allowed-Origin` header MUST be returned when the delivery target agrees to notification delivery by the origin service. Its value MUST either be
the origin name supplied in the `WebHook-Request-Origin` header, or a singular asterisk character ('\*'), indicating that the delivery target supports
notifications from all origins.

```bash
WebHook-Allowed-Origin: eventemitter.example.com
```

Or

```bash
WebHook-Request-Origin: *
```

> [!IMPORTANT]
> For more information about the abuse protection, see [Abuse protection in the HTTP 1.1 Web Hooks for event delivery spec](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#4-abuse-protection). 


## Related content
See the following article to learn how to troubleshoot event subscription validations: [Troubleshoot event subscription validations](troubleshoot-subscription-validation.md).
