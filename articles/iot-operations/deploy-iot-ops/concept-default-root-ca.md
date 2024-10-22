---
title: Certificate management for Azure IoT Operations Preview internal communication
description: Azure IoT Operations Preview uses TLS to encrypt communication. Learn about the default setup and also how to bring your own CA for production.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-mqtt-broker
ms.topic: concept-article
ms.date: 10/01/2024

#CustomerIntent: As an operator, I want to configure Azure IoT Operations components to use TLS so that I have secure communication between all components.
ms.service: azure-iot-operations
---

# Certificate management for Azure IoT Operations Preview internal communication

All communication within Azure IoT Operations Preview is encrypted using TLS. To help you get started, Azure IoT Operations is deployed with a default root CA and issuer for TLS server certificates. You can use the default setup for development and testing purposes. For a production deployment, we recommend using your own CA issuer and an enterprise PKI solution. 

## Default root CA and issuer for TLS server certificates

To help you get started, Azure IoT Operations Preview is deployed with a default root CA and issuer for TLS server certificates. You can use this issuer for development and testing. Azure IoT Operations uses [cert-manager](https://cert-manager.io/docs/) to manage TLS certificates, and [trust-manager](https://cert-manager.io/docs/trust/) to distribute trust bundles to components. 

* The CA certificate is self-signed and not trusted by any clients outside of Azure IoT Operations. The subject of the CA certificate is `CN=Azure IoT Operations Quickstart Root CA - Not for Production`. The CA certificate is automatically rotated by cert-manager.

* The root CA certificate is stored in a Kubernetes secret called `azure-iot-operations-aio-ca-certificate` under the `cert-manager` namespace.

* The public portion of the root CA certificate is stored in a ConfigMap called `azure-iot-operations-aio-ca-trust-bundle` under the `azure-iot-operations` namespace. You can retrieve the CA certificate from the ConfigMap and inspect it with kubectl and openssl. The ConfigMap is kept updated by trust-manager when the CA certificate is rotated by cert-manager. 

    ```bash
    kubectl get configmap azure-iot-operations-aio-ca-trust-bundle -n azure-iot-operations -o "jsonpath={.data['ca\.crt']}" | openssl x509 -text -noout
    ```

    ```Output
    Certificate: 
        Data: 
            Version: 3 (0x2) 
            Serial Number: 
                <SERIAL-NUMBER> 
            Signature Algorithm: sha256WithRSAEncryption 
            Issuer: O=Microsoft, CN=Azure IoT Operations Quickstart Root CA - Not for Production 
            Validity 
                Not Before: Sep 18 20:42:19 2024 GMT 
                Not After : Sep 18 20:42:19 2025 GMT 
            Subject: O=Microsoft, CN=Azure IoT Operations Quickstart Root CA - Not for Production 
            Subject Public Key Info: 
                Public Key Algorithm: rsaEncryption 
                    Public-Key: (2048 bit) 
                    Modulus: <MODULUS> 
                                        Exponent: 65537 (0x10001) 
            X509v3 extensions: 
                X509v3 Key Usage: critical 
                    Certificate Sign, CRL Sign 
                X509v3 Basic Constraints: critical 
                    CA:TRUE 
                X509v3 Subject Key Identifier: 
                    <SUBJECT-KEY-IDENTIFIER> 
        Signature Algorithm: sha256WithRSAEncryption 
    [Signature] 
    ```
    
* By default, there's already a CA issuer configured in the `azure-iot-operations namespace` called `azure-iot-operations-aio-certificate-issuer`. It's used as the common CA issuer for all TLS server certificates for IoT Operations. MQTT broker uses an issuer created from the same CA certificate to issue TLS server certificates for the default TLS listener on port 18883. You can inspect the issuer with the following command: 

    ```bash
    kubectl get clusterissuer azure-iot-operations-aio-certificate-issuer -o yaml
    ```

    ```Output
    apiVersion: cert-manager.io/v1 
    kind: ClusterIssuer 
    metadata: 
      creationTimestamp: "2024-09-18T20:42:17Z" 
      generation: 1 
      name: azure-iot-operations-aio-certificate-issuer 
      resourceVersion: "36665" 
      uid: 592700a6-95e0-4788-99e4-ea93934bd330 
    spec: 
      ca: 
        secretName: azure-iot-operations-aio-ca-certificate 
    status: 
      conditions: 
      - lastTransitionTime: "2024-09-18T20:42:22Z" 
        message: Signing CA verified 
        observedGeneration: 1 
        reason: KeyPairVerified 
        status: "True" 
        type: Ready 
    ```
