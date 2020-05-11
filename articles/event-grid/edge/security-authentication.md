---
title: Security and authentication - Azure Event Grid IoT Edge | Microsoft Docs 
description: Security and authentication in Event Grid on IoT Edge.  
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 10/06/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Security and authentication

Security and authentication is an advanced concept and it requires familiarity with Event Grid basics first. Start [here](concepts.md) if you are new to Event Grid on IoT Edge. Event Grid module builds on the existing security infrastructure on IoT Edge. Refer to [this documentation](../../iot-edge/security.md) for details and setup.

The following sections describe in detail how these settings are secured and authenticated:

* TLS configuration
* Inbound client authentication
* Outbound server authentication
* Outbound client authentication

>[!IMPORTANT]
>Event Grid module security and authentication leverage's the existing  infrastructure available on IoT Edge. The assumption is that IoT Edge sub system is secure.

>[!IMPORTANT]
>Event Grid configuration is **secure by default**. The following subsections explain all the options and possible value(s) that you can use to override aspects of authentication. Understand the impact before making any changes. For any changes to take effect, the Event Grid module will need to be redeployed.

## TLS configuration (a.k.a server authentication)

Event Grid module hosts both HTTP and HTTPS endpoints. Every IoT Edge module is assigned a server certificate by the IoT Edge's security daemon. We use the server certificate to secure the endpoint. On expiration, the module automatically refreshes with a new certificate from the IoT Edge security daemon.

By default, only HTTPS communication is allowed. You can override this behavior via  **inbound__serverAuth__tlsPolicy** configuration. The following table captures the possible value(s) of this property.

| Possible Value(s) | Description |
| ---------------- | ------------ |
| Strict | Default. Enables HTTPS only
| Enabled | Enables both HTTP and HTTPS
| Disabled | Enables HTTP Only

## Inbound client authentication

Clients are entities doing management and/or runtime operations. Clients can be other IoT Edge modules, non-IoT Applications.

Event Grid module supports two types of client authentication:

* Shared Access Signature (SAS) key-based
* certificate-based

By default, the Event Grid module is configured to accept only certificate-based authentication. On startup, Event Grid module retrieves "TrustBundle" from IoT Edge security daemon and uses it to validate any client certificate. Client certificates that do not resolve to this chain will be rejected with `UnAuthorized`.

### Certificate-based client authentication

Certificate-based authentication is on by default. You can choose to disable certificate-based authentication via the property
**inbound__clientAuth__clientCert__enabled**. The following table captures possible value(s).

| Possible Value(s) | Description |
| ----------------  | ------------ |
| true | Default. Requires all requests into the Event Grid module to present a client certificate. Additionally, you will need to configure **inbound__clientAuth__clientCert__source**.
| false | Don't force a client to present certificate.

The following table captures possible value(s) for **inbound__clientAuth__clientCert__source**

| Possible Value(s) | Description |
| ---------------- | ------------ |
| IoT Edge | Default. Uses the IoT Edge's Trustbundle to validate all client certificates.

If a client presents a self-signed, by default, the Event Grid module will reject such requests. You can choose to allow self-signed client certificates via **inbound__clientAuth__clientCert__allowUnknownCA** property. The following table captures possible value(s).

| Possible Value(s) | Description |
| ----------------  | ------------|
| true | Default. Allows self-signed certificates to be presented successfully.
| false | Will fail requests if self-signed certificates are presented.

>[!IMPORTANT]
>In production scenarios, you may want to set **inbound__clientAuth__clientCert__allowUnknownCA** to **false**.

### SAS key-based client authentication

In addition to certificate-based authentication, the Event Grid module can also do SAS Key-based authentication. SAS key is like a secret configured in the Event Grid module that it should use to validate all incoming calls. Clients need to specify the secret in the HTTP Header 'aeg-sas-key'. Request will be rejected with `UnAuthorized` if it doesn't match.

The configuration to control SAS key-based authentication is
**inbound__clientAuth__sasKeys__enabled**.

| Possible Value(s) | Description  |
| ----------------  | ------------ |
| true | Allows SAS key-based authentication. Requires **inbound__clientAuth__sasKeys__key1** or **inbound__clientAuth__sasKeys__key2**
| false | Default. SAS Key based authentication is disabled.

 **inbound__clientAuth__sasKeys__key1** and **inbound__clientAuth__sasKeys__key2**
 are keys that you configure the Event Grid module to check against incoming requests. At least one of the keys needs to be configured. Client making the request will need to present the key as part of the request header '**aeg-sas-key**'. If both the keys are configured, the client can present either one of the keys.

> [!NOTE]
>You can configure both authentication methods. In such a case SAS key is checked first and only if that fails, the certificate-based authentication is performed. For a request to succeed, only one of the authentication methods needs to succeed.

## Outbound client authentication

Client in outbound context refers to Event Grid module. The operation being done is delivering events to subscribers. Subscribing modules are considered as the server.

Every IoT Edge module is assigned an Identity Certificate by the IoT Edge's security daemon. We use the identity certificate for outgoing calls. On expiration, the module automatically refreshes with a new certificate from the IoT Edge security daemon.

The configuration to control outbound client authentication is
**outbound__clientAuth__clientCert__enabled**.

| Possible Value(s) | Description |
| ----------------  | ------------ |
| true | Default. Requires all outgoing requests from Event Grid module to present a certificate. Needs to configure **outbound__clientAuth__clientCert__source**.
| false | Don't require Event Grid module to present its certificate.

The configuration that controls the source for the certificate is
**outbound__clientAuth__clientCert__source**.

| Possible Value(s) | Description |
| ---------------- | ------------ |
| IoT Edge | Default. Uses the module's identity certificate configured by IoT Edge security daemon.

### Outbound Server Authentication

One of the destination types for an Event Grid subscriber is "Webhook". By default only HTTPS endpoints are accepted for such subscribers.

The configuration to control webhook destination policy **outbound__webhook__httpsOnly**.

| Possible Value(s) | Description |
| ----------------  | ------------ |
| true | Default. Allows only subscribers with HTTPS endpoint.
| false | Allows subscribers with either HTTP or HTTPS endpoint.

By default, Event Grid module will validate the subscriber's server certificate. You can skip validation by overriding **outbound__webhook__skipServerCertValidation**. Possible values are:

| Possible Value(s) | Description |
| ----------------  | ------------ |
| true | Don't validate subscriber's server certificate.
| false | Default. Validate subscriber's server certificate.

If subscriber's certificate is self-signed, then by default Event Grid module will reject such subscribers. To allow self-signed certificate, you can override **outbound__webhook__allowUnknownCA**. The following table captures the possible value(s).

| Possible Value(s) | Description |
| ----------------  | ------------ |
| true | Default. Allows self-signed certificates to be presented successfully.
| false | Will fail requests if self-signed certificates are presented.

>[!IMPORTANT]
>In production scenarios you will want to set **outbound__webhook__allowUnknownCA** to **false**.

> [!NOTE]
>IoT Edge environment generates self-signed certificates. Recommendation is to generate certificates issued by authorized CAs for production workloads and set **allowUnknownCA** property on both inbound and outbound to **false**.

## Summary

An Event Grid module is **secure by default**. We recommend keeping these defaults for your production deployments.

The following are the guiding principles to use while configuring:

* Allow only HTTPS requests into the module.
* Allow only certificate-based client authentication. Allow only those certificates that are issued by well-known CAs. Disallow self-signed certificates.
* Disallow SASKey based client authentication.
* Always present Event Grid module's identity certificate on outgoing calls.
* Allow only HTTPS subscribers for Webhook destination types.
* Always validate subscriber's server certificate for Webhook destination types. Allow only certificates issued by well-known CAs. Disallow self-signed certificates.

By default, Event Grid module is deployed with the following configuration:

 ```json
 {
  "Env": [
    "inbound__serverAuth__tlsPolicy=strict",
    "inbound__serverAuth__serverCert__source=IoTEdge",
    "inbound__clientAuth__sasKeys__enabled=false",
    "inbound__clientAuth__clientCert__enabled=true",
    "inbound__clientAuth__clientCert__source=IoTEdge",
    "inbound__clientAuth__clientCert__allowUnknownCA=true",
    "outbound__clientAuth__clientCert__enabled=true",
    "outbound__clientAuth__clientCert__source=IoTEdge",
    "outbound__webhook__httpsOnly=true",
    "outbound__webhook__skipServerCertValidation=false",
    "outbound__webhook__allowUnknownCA=true"
  ],
  "HostConfig": {
    "PortBindings": {
      "4438/tcp": [
        {
          "HostPort": "4438"
        }
      ]
    }
  }
}
```
