---
title: OPC UA certificates infrastructure overview
description: Describe the security concepts of OPC UA and how they can be managed in the Azure IoT OPC UA Broker context.
author: dominicbetts
ms.author: dobett
ms.subservice: opcua-broker
ms.topic: concept-article
ms.date: 05/15/2024

# CustomerIntent: As an industrial edge IT or operations user, I want to understand how the OPC UA industrial edge Kubernetes environment should be configured to enable mutual trust between OPC UA Broker and the OPC UA Servers downstream.
---

# OPC UA certificates infrastructure for Azure IoT OPC UA Broker Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Azure IoT OPC UA Broker is an OPC UA client application that lets you connect securely to OPC UA servers. In OPC UA, the security includes:

- Application authentication
- Message signing
- Data encryption
- User authentication and authorization.

This article focuses on application authentication and how to configure the OPC UA Broker to connect securely to your OPC UA servers at the edge. In OPC UA, every application instance has an X.509 certificate that it uses to establish trust with the other OPC UA applications it communicates with.

To learn more about OPC UA application security, see [Application Authentication](https://reference.opcfoundation.org/Core/Part2/v105/docs/4.10).

## OPC UA Broker's application instance certificate

The OPC UA Broker instance is an OPC UA client application. The OPC UA Broker instance makes use of a single OPC UA application instance certificate for all the sessions it establishes to collect telemetry data from OPC UA servers. A default deployment of the OPC UA Broker uses [cert-manager](https://cert-manager.io/) to manage its application instance certificate:

- Cert-manager generates a self-signed OPC UA compatible certificate and stores it as Kubernetes native secret. The default name for this certificate is *aio-opc-opcuabroker-default-application-cert*.
- OPC UA Broker maps and uses this certificate for all the pods it uses to connect to OPC UA servers.
- Cert-manager automatically renews certificates before they expire.

By default, OPC UA Broker connects to an OPC UA server by using the endpoint with the highest supported level of security. Therefore, a mutual trust handshake between the two OPC UA applications must be established beforehand. To enable mutual application authentication trust, you need to:

- Export the public key of the OPC UA Broker's application instance certificate from the Kubernetes secret store and then add it to trusted certificates list for the OPC UA server.
- Export the public key of the OPC UA server's application instance and then add it to trusted certificates list for the OPC UA Broker.

Mutual trust validation between the OPC UA server and OPC UA Broker instance is now possible. You can now configure an `AssetEndpointProfile` for the OPC UA server in the Azure IoT Operations (preview) portal and start working with it.

## OPC UA Broker's trusted certificates list

You need to maintain a trusted certificate list that contains the certificates of all the OPC UA servers that OPC UA Broker trusts. To create a session with an OPC UA server:

- OPC UA Broker sends its certificate's public key.
- The OPC UA server validates against its trusted certificates list.
- A similar validation of the OPC UA server's certificate happens in the OPC UA Broker.

By default, the OPC UA Broker stores its trusted certificate list in Azure Key Vault and uses the [Secrets Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/) to project the trusted certificates into the OPC UA Broker pods. Azure Key Vault stores the certificates encoded in DER or PEM format.

If OPC UA Broker trusts a certificate authority, it automatically trusts any server that has a valid application instance certificate signed by the certificate authority.

To project the trusted certificates from Azure Key Vault into the Kubernetes cluster, you must configure a `SecretProviderClass` custom resource. This custom resource contains a list of all the secret references associated with the trusted certificates. The OPC UA Broker uses the custom resource to map the trusted certificates into OPC UA Broker containers and make them available for validation. The default name for the `SecretProviderClass` custom resource that handles the trusted certificates list is *aio-opc-ua-broker-trust-list*.

> [!NOTE]
> The time it takes to project Azure Key Vault certificates into the cluster depends on the configured polling interval.

## OPC UA Broker's issuers certificates list

If your OPC UA server's application instance certificate is signed by an intermediate certificate authority, but you don't want to automatically trust all the certificates issued by the certificate authority, you can use an issuer certificate list to manage the trust relationship.

An _issuer certificate list_ stores the certificate authority certificates that OPC UA Broker trusts. If the application certificate of an OPC UA server is signed by an intermediate certificate authority, OPC UA Broker validates the full chain of certificate authorities up to the root. The issuer certificate list should contain the certificates of all the certificate authorities in the chain to ensure that OPC UA Broker can validate the OPC UA servers.

You manage the issuer certificate list in the same way you manage the trusted certificates list. The default name for the `SecretProviderClass` custom resource that handles the issuer certificates list is *aio-opc-ua-broker-issuer-list*.

## Features supported

The following table shows the feature support level for authentication in the current version of OPC UA Broker:

| Features  | Meaning | Symbol |
|---------|---------|---------:|
| Configuration of OPC UA self-signed application instance certificate          | Supported   |   ✅     |
| Handling of OPC UA trusted certificates list                                  | Supported   |   ✅     |
| Handling of OPC UA issuer certificates lists                                  | Supported   |   ✅     |
| Configuration of OPC UA enterprise grade application instance certificate     | Supported   |   ✅     |
| Handling of OPC UA untrusted certificates                                     | Unsupported |   ❌     |
| Handling of OPC UA Global Discovery Service (GDS)                             | Unsupported |   ❌     |
