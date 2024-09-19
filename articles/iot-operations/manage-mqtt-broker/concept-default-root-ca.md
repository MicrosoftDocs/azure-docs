---
title: Azure IoT Operations Preview default root CA and issuer for TLS server certificates
description: Azure IoT Operations Preview has a default root CA and issuer for TLS server certificates to help you get started with secure communication between the MQTT broker and client.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-mqtt-broker
ms.topic: concept-article
ms.date: 09/09/2024

#CustomerIntent: As an operator, I want to configure MQTT broker to use TLS so that I have secure communication between the MQTT broker and client.
---

# Default root CA and issuer for TLS server certificates

To help you get started, Azure IoT Operations Preview is deployed with a default *quickstart* root CA and issuer for TLS server certificates. You can use this issuer for development and testing. 

* The CA certificate is self-signed and not trusted by any clients outside of Azure IoT Operations. The subject of the CA certificate is `CN = Azure IoT Operations Quickstart Root CA - Not for Production` and it expires in 30 days from the time of installation.

* The root CA certificate is stored in a Kubernetes secret called `aio-ca-key-pair-test-only`.

* The public portion of the root CA certificate is stored in a ConfigMap called `aio-ca-trust-bundle-test-only`. You can retrieve the CA certificate from the ConfigMap and inspect it with kubectl and openssl.

    ```bash
    kubectl get configmap aio-ca-trust-bundle-test-only -n azure-iot-operations -o json | jq -r '.data["ca.crt"]' | openssl x509 -text -noout
    ```

    ```Output
    Certificate:
        Data:
            Version: 3 (0x2)
            Serial Number:
                <SERIAL-NUMBER>
            Signature Algorithm: ecdsa-with-SHA256
            Issuer: CN = Azure IoT Operations Quickstart Root CA - Not for Production
            Validity
                Not Before: Nov  2 00:34:31 2023 GMT
                Not After : Dec  2 00:34:31 2023 GMT
            Subject: CN = Azure IoT Operations Quickstart Root CA - Not for Production
            Subject Public Key Info:
                Public Key Algorithm: id-ecPublicKey
                    Public-Key: (256 bit)
                    pub:
                        <PUBLIC-KEY>
                    ASN1 OID: prime256v1
                    NIST CURVE: P-256
            X509v3 extensions:
                X509v3 Basic Constraints: critical
                    CA:TRUE
                X509v3 Key Usage: 
                    Certificate Sign
                X509v3 Subject Key Identifier: 
                    <SUBJECT-KEY-IDENTIFIER>
        Signature Algorithm: ecdsa-with-SHA256
            [SIGNATURE]
    ```

* By default, there's already a CA issuer configured in the `azure-iot-operations` namespace called `aio-ca-issuer`. It's used as the common CA issuer for all TLS server certificates for IoT Operations. MQTT broker uses an issuer created from the same CA certificate to issue TLS server certificates for the default TLS listener on port 18883. You can inspect the issuer with the following command:

    ```bash
    kubectl get issuer aio-ca-issuer -n azure-iot-operations -o yaml
    ```

    ```Output
    apiVersion: cert-manager.io/v1
    kind: Issuer
    metadata:
      annotations:
        meta.helm.sh/release-name: azure-iot-operations
        meta.helm.sh/release-namespace: azure-iot-operations
      creationTimestamp: "2023-11-01T23:10:24Z"
      generation: 1
      labels:
        app.kubernetes.io/managed-by: Helm
      name: aio-ca-issuer
      namespace: azure-iot-operations
      resourceVersion: "2036"
      uid: <UID>
    spec:
      ca:
        secretName: aio-ca-key-pair-test-only
    status:
      conditions:
      - lastTransitionTime: "2023-11-01T23:10:59Z"
        message: Signing CA verified
        observedGeneration: 1
        reason: KeyPairVerified
        status: "True"
        type: Ready
    ```

For production, you must configure a CA issuer with a certificate from a trusted CA, as described in [Configure TLS with automatic certificate management to secure MQTT communication in MQTT broker](howto-configure-tls-auto.md).
