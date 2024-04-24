---
title: OPC UA certificates infrastructure overview
description: Describe the security concepts of OPC UA and how they can be managed in the Azure IoT OPC UA Broker context.
author: cristipogacean
ms.author: crpogace
ms.subservice: opcua-broker
ms.topic: concept-article
ms.date: 03/01/2024

# CustomerIntent: As an industrial edge IT or operations user, I want to understand how the OPC UA industrial edge Kubernetes
# environment should be configured to enable mutual trust between OPC UA Broker and the OPC UA Servers downstream.
---

# OPC UA certificates infrastructure for Azure IoT OPC UA Broker Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Azure IoT OPC UA Broker acts as an OPC UA client application and enables you to connect securely to OPC UA server applications. In OPC UA, the security is built in multiple dimensions that cover: application authentication, message signing, data encryption, user authentication, and user authorization. This article gives an overview of application authentication and how to configure the OPC UA Broker to connect securely to your OPC UA servers at the edge.

OPC UA uses a concept conveying application authentication to allow applications that intend to communicate to identify each other. Each OPC UA application instance has an X.509 Certificate (ApplicationInstanceCertificate) assigned that is exchanged during secure channel establishment. The receiver of the certificate checks whether it trusts the certificate and based on this check it accepts or rejects the request or response message from the sender. This trust check is accomplished using the concept of a `TrustList`. A `TrustList` is implemented as a `CertificateStore` designated by an administrator. An administrator determines if the certificate is signed, validated, and trustworthy before placing it in a `TrustList`. A `TrustList` also stores Certificate Authorities (CA). A `TrustList` that includes CAs, also includes Certificate Revocation Lists (CRLs).

## OPC UA Broker's application instance certificate

The OPC UA Broker instance is an OPC UA client application. The OPC UA Broker instance makes use of a single OPC UA application instance certificate for all the sessions established to collect telemetry data. For a deployment of the OPC UA Broker with the default values, Kubernetes [cert-manager](https://cert-manager.io/) is used to manage the OPC UA Broker's application instance certificate for a deployment. Cert-manager generates a self-signed OPC UA compatible certificate and stores it as Kubernetes native secret. OPC UA Broker maps and uses this certificate for all the pods used to connect to OPC UA Servers and collect telemetry. Cert-manager ensures the certificate renewal before it's expiration. The default kubernetes secret name storing the application instance certificate is *aio-opc-opcuabroker-default-application-cert*.

OPC UA Broker connects to an OPC UA server using by default the endpoint with the highest level of security supported. Because of this, mutual trust handshake between the two OPC UA applications must be established beforehand. To enable mutual application authentication trust, you need to: first extract the public key of the OPC UA Broker's application instance certificate from the Kubernetes secret store and then explicitly add it into the OPC UA server's trusted certificates list. Next, you need to export the OPC UA Server's application instance certificate public key and add it to the OPC UA Broker's trusted certificate list. Now the mutual trust validation is successful and you can configure the AssetEndpointProfile for the OPC UA server in the Azure IoT Operations (preview) portal and start working with it.

## OPC UA Broker's trusted certificates list

A trusted certificate list containing certificates of the OPC UA servers that OPC UA Broker trusts, needs to be maintained. When a session is created to an OPC UA server, it sends its certificate's public key. This public key is validated against the OPC UA Broker's trusted certificates list. A similar validation of the OPC UA Broker certificate happens at the OPC UA server side. When validation on both sides succeeds, the session creation process can continue.

For a default deployment, the OPC UA Broker uses Azure Key Vault (AKV) to store the trusted certificate list and does use the Secrets Store CSI Driver to project the trusted certificates into the OPC UA Broker's containers. The certificates are stored in AKV secrets in .der or .pem format. For projection of the trusted certificates in AKV into the Kubernetes cluster, the user has to configure a Secret Provider Class (SPC) Custom Resource (CR). An SPC CR contains a list with all secret references associated with the certificates to be trusted. Based on the configured CSP CR OPC UA Broker maps the trusted certificates into OPC UA Broker containers and makes them available for validation. The default name for the SPC CR handling the trusted certificates list is *aio-opc-ua-broker-trust-list*. The projection of the AKV secrets and certificates into the cluster takes some time depending on the configured polling interval.

When a Certificate Authority (CA) is trusted, the OPC UA Broker automatically trusts all the servers that have a valid application instance certificate signed by this particular CA.

## OPC UA Broker's issuers certificates list

An Issuer certificate list is used to store the Certificate Authorities (CA) certificates, which OPC UA Broker should trust. If the application certificate of an OPC UA server was signed by an intermediate CA, OPC UA Broker validates the full chain of CAs up to the root CA. OPC UA Broker checks if all CA certs are in the issuer certificate list. You should add in this list the CA certificates of all CAs in the chain to ensure the validation of the OPC UA servers certificate is successful.

The mechanism of management of the issuer certificates list is identical to the one managing trusted certificates list described in the previous chapter. The default name for SPC handling the issuer certificates list is *aio-opc-ua-broker-issuer-list*.

## Next step
In this article, you learned about the basic principles of OPC UA Certificates and how they're managed in the context of the Azure IoT Operations OPC UA Broker. As a next step, learn how to establish trust with OPC UA Server to be able to securely connect.

> [!div class="nextstepaction"]
> [Configure OPC UA certificates infrastructure](howto-configure-opcua-certificates-infrastructure.md)
