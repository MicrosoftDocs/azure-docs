---
title: OPC UA certificates infrastructure overview
description: Describe the security concepts of OPC UA and how they can be managed in the context of the connector for OPC UA.
author: dominicbetts
ms.author: dobett
ms.subservice: azure-opcua-connector
ms.topic: concept-article
ms.date: 05/12/2025

# CustomerIntent: As an industrial edge IT or operations user, I want to understand how the OPC UA industrial edge Kubernetes environment should be configured to enable mutual trust between the connector for OPC UA and the downstream OPC UA servers.
ms.service: azure-iot-operations
---

# OPC UA certificates infrastructure for the connector for OPC UA

The connector for OPC UA is an OPC UA client application that lets you connect securely to OPC UA servers. In OPC UA, the security includes:

- Application authentication
- Message signing
- Data encryption
- User authentication and authorization.

This article focuses on application authentication and how to configure the connector for OPC UA to connect securely to your OPC UA servers at the edge. In OPC UA, every application instance has an X.509 certificate that it uses to establish trust with the other OPC UA applications it communicates with.

To learn more about OPC UA application security, see [Application Authentication](https://reference.opcfoundation.org/Core/Part2/v105/docs/4.10).

The following diagram shows the sequence of events that occur when the connector for OPC UA connects to an OPC UA server. The sections later in this article discuss the details of each step in the sequence:

:::image type="content" source="media/overview-opcua-broker-certificates-management/mutual-trust.svg" alt-text="Diagram that summarizes the OPC UA connector connection handshake." border="false":::

<!-- ```mermaid
sequenceDiagram
    participant Connector as Connector for OPC UA
    participant OPCUA as OPC UA server

    Connector->>OPCUA: Presents connector for OPC UA application instance certificate

    OPCUA->>OPCUA: Validate connector for OPC UA<br>application instance certificate

    OPCUA->>Connector: Presents OPC UA server application instance certificate

    Connector->>Connector: Validate OPC UA server certificate against<br>connector for OPC UA trusted certificates list<br>or trusted issuers list.
``` -->

## Connector for OPC UA application instance certificate

The connector for OPC UA is an OPC UA client application. The connector for OPC UA makes use of a single OPC UA application instance certificate for all the sessions it establishes to collect messages and data from OPC UA servers. A default deployment of the connector for OPC UA uses [cert-manager](https://cert-manager.io/) to manage its application instance certificate:

- Cert-manager generates a self-signed OPC UA compatible certificate and stores it as Kubernetes native secret. The default name for this certificate is *aio-opc-opcuabroker-default-application-cert*.
- The connector for OPC UA maps and uses this certificate for all the pods it uses to connect to OPC UA servers.
- Cert-manager automatically renews certificates before they expire.

By default, the connector for OPC UA connects to an OPC UA server by using the endpoint with the highest supported level of security. Therefore, a mutual trust handshake between the two OPC UA applications must be established beforehand. To enable mutual application authentication trust, you need to:

- Export the public key of the connector for OPC UA application instance certificate from the Kubernetes secret store and then add it to trusted certificates list for the OPC UA server.
- Export the public key of the OPC UA server's application instance and then add it to trusted certificates list for the connector for OPC UA.

Mutual trust validation between the OPC UA server and the connector for OPC UA is now possible. You can now configure an `AssetEndpointProfile` for the OPC UA server in the operations experience web UI and start working with it.

## Use self-signed OPC UA server application instance certificates

In this scenario, you need to maintain a trusted certificate list that contains the certificates of all the OPC UA servers that the connector for OPC UA trusts. To create a session with an OPC UA server:

- The connector for OPC UA sends the public key of its application instance certificate to the OPC UA server.
- The OPC UA server validates the connector's certificate against its trusted certificates list.
- The connector validates the OPC UA server's certificate against its trusted certificates list.

To learn how to manage the trusted certificates list, see [Configure the trusted certificates list](howto-configure-opcua-certificates-infrastructure.md#configure-the-trusted-certificates-list).

The default name for the `SecretProviderClass` custom resource that handles the trusted certificates list is *aio-opc-ua-broker-trust-list*.

## Use OPC UA server application instance certificates signed by a certificate authority

In this scenario, you add the certificate authority's public key to the trusted certificates list for the connector for OPC UA. The connector for OPC UA automatically trusts any server that has a valid application instance certificate signed by the certificate authority.

You can also upload a certificate revocation list (CRL) to the trusted certificates list. The connector for OPC UA uses the CRL to check if the certificate authority has revoked the certificate of an OPC UA server.

To learn how to manage the trusted certificates list, see [Configure the trusted certificates list](howto-configure-opcua-certificates-infrastructure.md#configure-the-trusted-certificates-list).

## Use OPC UA server application instance certificates signed by an intermediate certificate authority

In this scenario, you want to trust a subset of the certificates issued by the certificate authority. You can use an _issuer certificate list_ to manage the trust relationship. This issuer certificate list stores the intermediate certificates that the connector for OPC UA trusts. The connector for OPC UA only trusts certificates signed by the intermediate certificates in the issuer certificate list.

You must also upload the root certificate authority's public key to the trusted certificates list for the connector for OPC UA. The connector for OPC UA uses the root certificate authority's public key to validate the intermediate certificates in the issuer certificate list.

You can also upload a certificate revocation list (CRL) to the issuer certificates list. The connector for OPC UA uses the CRL to check if the certificate authority has revoked the certificate of an OPC UA server.

The default name for the `SecretProviderClass` custom resource that handles the issuer certificates list is *aio-opc-ua-broker-issuer-list*.

To learn how to manage the issuer certificates list, see [Configure the issuer certificates list](howto-configure-opcua-certificates-infrastructure.md#configure-the-issuer-certificates-list).

## Features supported

The following table shows the feature support level for authentication in the current version of the connector for OPC UA:

| Features  | Meaning | Symbol |
|---------|---------|---------:|
| Configuration of OPC UA self-signed application instance certificate          | Supported   |   ✅     |
| Handling of OPC UA trusted certificates list                                  | Supported   |   ✅     |
| Handling of OPC UA issuer certificates lists                                  | Supported   |   ✅     |
| Configuration of OPC UA enterprise grade application instance certificate     | Supported   |   ✅     |
| Handling of OPC UA untrusted certificates                                     | Unsupported |   ❌     |
| Handling of OPC UA Global Discovery Service                             | Unsupported |   ❌     |
