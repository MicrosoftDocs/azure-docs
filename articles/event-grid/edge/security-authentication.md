---
title: Security and Authentication - Azure Event Grid IoT Edge | Microsoft Docs 
description: Security and Authentication in Event Grid on IoT Edge.  
author: vkukke
manager: rajarv
ms.author: vkukke
ms.reviewer: 
ms.date: 07/18/two019
ms.topic: article
ms.service: event-grid-on-edge
services: event-grid-on-edge
---

## Event Grid IoT Edge security and authentication

Security and Authentication is an advanced topic and requires you to be familiar with Event Grid basics. Start [here](concepts.md) if you are new to Event Grid on edge. Event Grid module leverages the existing security infrastructure already available on IoT Edge. 

The following sections describe in detail how the following are secured and authentication:-

* TLS Configuration
* Inbound Client Authentication
* Outbound Server Authentication
* Outbound Client Authentication

>[!IMPORTANT]
Event Grid module security and authentication leverage's the existing  infrastructure available on IoT Edge. The assumption is that IoT edge sub system is secure.

>[!IMPORTANT]
Event Grid configuration is **secure by default**. The subsections below explain all the options and possible value(s) that you can use to override aspects of authentication. Please understand the impact before making any changes. For any changes to take effect Event Grid module will need to be redeployed.

## TLS Configuration (a.k.a Server Authentication)

Event Grid module hosts both HTTP and HTTPS endpoints. 
Every IoT Edge module is assigned a Server Certificate by the IoT Edge's security daemon. On startup, we retrieve this certificate and secure the endpoint. The validity of this certificate is 90 days. On expiration, the module automatically refreshes by requesting a new certificate from the IoT Edge security daemon.

By default only HTTPS communication is allowed. You can override this behavior via  **inbound:serverAuth:tlsPolicy** configuration. The below table captures the possible value(s) of this property.

| Possible Value(s) | Description |
| ---------------- | ------------ |
| Strict | Default. Enables HTTPS only
| Enabled | Enables both HTTP and HTTPS
| Disabled | Enables HTTP Only

## Inbound Client Authentication
Client in inbound context refers to modules, entities calling into Event Grid module. The operations being performed could be management (creating topic/subscriptions) and/or runtime (publishing events). Event Grid module is considered as the server.

Event Grid module supports two types of client authentication:-

* SASKey based
* certificate-based

By default Event Grid module is configured to accept only certificate-based authentication. On startup, Event Grid module retrieves "TrustBundle" from IoT Edge security daemon and uses that to validate any client certificate. Client certificates that do not resolve to this chain will be rejected with 'UnAuthorized'. 

### Certificate-based client Authentication
Certificate-based authentication is on by default. You can choose to disable this via the property
**inbound:clientAuth:clientCert:enabled**. Below table captures possible value(s).

| Possible Value(s) | Description |
| ----------------  | ------------ |
| true | Default. Requires all requests into Event Grid module to present a client certificate. Additionally will need to configure **inbound:clientAuth:clientCert:source**.
| false | Does not require/force a client to present certificate.

If **inbound:clientAuth:clientCert:enabled** is set to **true**, then the source for client certificate validation is controlled via the property
**inbound:clientAuth:clientCert:source**. Below table captures possible value(s).

| Possible Value(s) | Description |
| ---------------- | ------------ |
| IoTEdge | Default. Uses the IoT Edge's Trustbundle to validate all client certificates.

If a client presents a self-signed then by default Event Grid module will reject such requests. You can override this via **inbound:clientAuth:clientCert:allowUnknownCA** property. Below table captures possible value(s).

| Possible Value(s) | Description |
| ----------------  | ------------|
| true | Default. Allows self-signed certificates to be presented successfully.
| false | Will fail requests if self-signed certificates are presented.

>[!IMPORTANT]
In production scenarios you will want to set **inbound:clientAuth:clientCert:allowUnknownCA** to **false**.

### SAS key based client Authentication

In addition to certificate-based authentication, you can also configure SASKey based authentication. This is basically a secret that will be presented by the client making the request to the Event Grid module. Event Grid module can validate against configured keys and on match accept the request otherwise fail with an 'UnAuthorized'. You can configure up to two keys. A client will need to send this key as part of HTTP Header 'aeg-sas-key'.

The configuration to control SASKey based authentication is
**inbound:clientAuth:sasKeys:enabled**.

| Possible Value(s) | Description  |
| ----------------  | ------------ |
| true | Allows SASKey based authentication. Requires **inbound:clientAuth:sasKeys:key1** and/or **inbound:clientAuth:sasKeys:keytwo**
| false | Default. Disallows SASKey based authentication

 **inbound:clientAuth:sasKeys:key1** and **inbound:clientAuth:sasKeys:key2**
 are keys that you configure Event Grid module with to check against incoming requests. At least one of the keys needs to be configured. Client making the request will need to present the key as part of the request header '**aeg-sas-key**'. If both the keys are configured, then client can present either one of the keys.

> [!NOTE]
>You can configure both authentication methods. In such a case SASKey is checked first and only if that fails certificate-based authentication is performed. For a request to succeed only one of the authentication methods needs to succeed.

## Outbound Client Authentication

Client in outbound context refers to Event Grid module.The operation being performed is delivering events to subscribers. Subscribing modules, entities are considered as the server.

Every IoT Edge module is assigned an Identity Certificate by the IoT Edge's security daemon. On startup, we retrieve this certificate and present that on outgoing calls. The validity of this certificate is 7 days. On expiration, the module automatically refreshes by requesting a new certificate from the IoT Edge security daemon. By default, Event Grid module is configured to present its identity certificate for all its outgoing calls.

The configuration to control outbound client authentication is
**outbound:clientAuth:clientCert:enabled**.

| Possible Value(s) | Description |
| ----------------  | ------------ |
| true | Default. Requires all outgoing requests from Event Grid module to present a certificate. Needs to configure **outbound:clientAuth:clientCert:source**.
| false | Does not require/force Event Grid module to present its certificate.

The configuration that controls the source for the certificate is
**outbound:clientAuth:clientCert:source**.

| Possible Value(s) | Description |
| ---------------- | ------------ |
| IoTEdge | Default. Uses the module's identity certificate configured by IoT Edge security daemon.

### Outbound Server Authentication
One of the destination types for an Event Grid subscriber is "Webhook". By default only HTTPS endpoints are accepted for such subscribers.

The configuration to control webhook destination policy **outbound:webhook:httpsOnly**.

| Possible Value(s) | Description |
| ----------------  | ------------ |
| true | Default. Allows only subscribers with HTTPS endpoint.
| false | Allows subscribers with either HTTP or HTTPS endpoint.

By default, Event Grid module will validate the subscriber's server certificate which means event delivery will succeed only if Event Grid module is able to validate the subscriber's server certificate. 
The configuration to control this is **outbound:webhook:skipServerCertValidation**. Possible values are:-

| Possible Value(s) | Description |
| ----------------  | ------------ |
| true | Do not validate subscriber's server certificate.
| false | Default. Validate subscriber's server certificate.

If subscriber's certificate is self-signed then by default Event Grid module will reject such subscribers. To override this, you can configure 
**outbound:webhook:allowUnknownCA**. Below table captures the possible value(s).

| Possible Value(s) | Description |
| ----------------  | ------------ |
| true | Default. Allows self-signed certificates to be presented successfully.
| false | Will fail requests if self-signed certificates are presented.

>[!IMPORTANT]
In production scenarios you will want to set **outbound:webhook:allowUnknownCA** to **false**.

> [!NOTE]
>IoT Edge environment generates self-signed certificates. Recommendation is to generate certificates issued by authorized CAs for production workloads and set **allowUnknownCA** property on both inbound and outbound to **false**.

## Summary

An Event Grid module is **secure by default**. We recommend keeping these defaults for your production deployments.

The following are the guiding principles to use while configuring:-

* Allow only HTTPS requests into the module.
* Allow only certificate-based client authentication. Allow only those certificates that are issued by well-known CAs. Disallow self-signed certificates.
* Do not allow SASKey based client authentication.
* Always present Event Grid module's identity certificate on outgoing calls.
* Allow only HTTPS subscribers for Webhook destination types.
* Always validate subscriber's server certificate for Webhook destination types. Allow only certificates issued by well-known CAs. Disallow self-signed certificates.

By default, Event Grid module is deployed with the following configuration:-

 ```json
 {
        "Env": [
            "inbound:serverAuth:tlsPolicy=strict",
            "inbound:serverAuth:serverCert:source=IoTEdge",
            "inbound:clientAuth:sasKeys:enabled=false",
            "inbound:clientAuth:clientCert:enabled=true",
            "inbound:clientAuth:clientCert:source=IoTEdge",
            "inbound:clientAuth:clientCert:allowUnknownCA=true",
            "outbound:clientAuth:clientCert:enabled=true",
            "outbound:clientAuth:clientCert:source=IoTEdge",
            "outbound:webhook:httpsOnly=true",
            "outbound:webhook:skipServerCertValidation=false",
            "outbound:webhook:allowUnknownCA=true",
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