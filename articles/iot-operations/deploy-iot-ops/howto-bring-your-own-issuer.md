---
title: Bring your own issuer
description: Set up your own certificate authority issuer for internal communications in Azure IoT Operations instead of using the default self-signed issuer.
author: huguesbouvier
ms.author: hubouvie
ms.topic: conceptual
ms.service: azure-iot-operations
ms.date: 04/21/2026
#CustomerIntent: As an IT administrator, I want to understand certificate management options for internal communications so I can decide whether to bring my own CA issuer before deploying Azure IoT Operations.
---

# Bring your own issuer

Decide before deployment whether you need to bring your own certificate authority (CA) issuer for internal communications, or whether the default self-signed issuer is sufficient for your use case.

## Default self-signed issuer and root CA certificate

To help you get started, Azure IoT Operations is deployed with a default self-signed issuer and root CA certificate for TLS server certificates. You can use this issuer for development and testing. Azure IoT Operations uses [cert-manager](https://cert-manager.io/docs/) to manage TLS certificates, and [trust-manager](https://cert-manager.io/docs/trust/) to distribute trust bundles to components.

- The CA certificate is self-signed and no clients outside of Azure IoT Operations trust it. The subject of the CA certificate is `CN=Azure IoT Operations Quickstart Root CA - Not for Production`. Cert-manager automatically rotates the CA certificate.

- The root CA certificate is stored in a Kubernetes secret called `azure-iot-operations-aio-ca-certificate` under the `cert-manager` namespace.

- A ConfigMap called `azure-iot-operations-aio-ca-trust-bundle` under the `azure-iot-operations` namespace stores the public portion of the root CA certificate. You can retrieve the CA certificate from the ConfigMap and inspect it with kubectl and openssl. Trust-manager keeps the ConfigMap updated when cert-manager rotates the CA certificate.

    ```bash
    kubectl get configmap azure-iot-operations-aio-ca-trust-bundle -n azure-iot-operations -o "jsonpath={.data['ca\.crt']}" | openssl x509 -text -noout
    ```

- By default, there's already an issuer configured in the `azure-iot-operations namespace` called `azure-iot-operations-aio-certificate-issuer`. It's used as the common issuer for all TLS server certificates for IoT Operations. MQTT broker uses an issuer created from the same CA certificate, which is signed by the self-signed issuer to issue TLS server certificates for the default TLS listener on port 18883.

## Bring your own issuer

For production deployments, we recommend that you set up Azure IoT Operations with an enterprise PKI to manage certificates, and that you bring your own CA issuer that works with your enterprise PKI, instead of using the default self-signed issuer to issue TLS certificates for internal communications.

To set up Azure IoT Operations with your own issuer for internal communications, use the following steps **before deploying an instance to your cluster**:

1. Follow the steps in [Prepare your cluster](howto-prepare-cluster.md) to set up your cluster.

1. Install [cert-manager](https://cert-manager.io/docs/installation/).
   Cert-manager manages TLS certificates.

1. Install [trust-manager](https://cert-manager.io/docs/trust/trust-manager/installation/).
   While installing trust manager, set the `trust namespace` to cert-manager. For example:

      ```bash
      helm upgrade trust-manager jetstack/trust-manager --install --namespace cert-manager --set app.trust.namespace=cert-manager --wait
      ```

      Trust-manager is used to distribute a trust bundle to components.

1. Create the Azure IoT Operations namespace.

    ```bash
    kubectl create namespace azure-iot-operations
    ```

1. Deploy an issuer that works with cert-manager. For a list of all supported issuers, see [cert-manager issuers](https://cert-manager.io/docs/configuration/issuers/).

   The issuer can be of type `ClusterIssuer` or `Issuer`. If using `Issuer`, the issuer resource must be created in the Azure IoT Operations namespace.

1. Set up trust bundle in the Azure IoT Operations namespace.

   1. To set up trust bundle, create a ConfigMap in the Azure IoT Operations namespace. Place the public key portion of your CA certificate into the config map with a key name of your choice.
   1. Get the public key portion of your CA certificate. The steps to acquire the public key depend on the issuer you choose.
   1. Create the ConfigMap. For example:

      ```bash
      kubectl create configmap -n azure-iot-operations <YOUR_CONFIGMAP_NAME> --from-file=<CA_CERTIFICATE_FILENAME_PEM_OR_DER>
      ```

1. Follow steps in [Deploy Azure IoT Operations](howto-deploy-iot-operations.md) to deploy, *with a few changes*.

   1. Add the `--user-trust` parameter while preparing cluster. For example:

      ```bash
      az iot ops init --subscription <SUBSCRIPTION_ID> --cluster <CLUSTER_NAME>  -g <RESOURCE_GROUP> --user-trust
      ```

   1. Add the `--trust-settings` parameter with the necessary information while deploying Azure IoT Operations. For example:

      ```bash
      az iot ops create --subscription <SUBSCRIPTION_ID> -g <RESOURCE_GROUP> --cluster <CLUSTER_NAME> --custom-location <CUSTOM_LOCATION> -n <INSTANCE_NAME> --sr-resource-id <SCHEMAREGISTRY_RESOURCE_ID> --trust-settings configMapName=<CONFIGMAP_NAME> configMapKey=<CONFIGMAP_KEY_WITH_PUBLICKEY_VALUE> issuerKind=<CLUSTERISSUER_OR_ISSUER> issuerName=<ISSUER_NAME>
      ```

For more information on managing certificates, see [Manage certificates for your Azure IoT Operations deployment](../secure-iot-ops/howto-manage-certificates.md).

## Next steps

- [Deploy to a production cluster](howto-deploy-iot-operations.md)
