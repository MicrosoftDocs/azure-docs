---
title: Manage certificates
description: Azure IoT Operations uses TLS to encrypt communication. Learn how to manage certificates for internal and external communications, and how to bring your own certificate authority (CA) issuer for a production deployment.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 01/27/2026

#CustomerIntent: As an operator, I want to configure Azure IoT Operations components to use TLS so that I have secure communication between all components.
---

# Manage certificates for your Azure IoT Operations deployment

Azure IoT Operations uses TLS to encrypt communication between all components. This article describes how to manage certificates for internal and external communications, and how to bring your own certificate authority (CA) issuer for internal communications in a production deployment.

## Prerequisites

To manage certificates for external communications, you need an Azure IoT Operations instance deployed with secure settings. If you deployed Azure IoT Operations with test settings, you need to first [enable secure settings](../deploy-iot-ops/howto-enable-secure-settings.md).

## Manage certificates for internal communications

All communications within Azure IoT Operations are encrypted using TLS. To help you get started, Azure IoT Operations is deployed with a default root CA and issuer for TLS server certificates. You can use the default setup for development and testing purposes. For a production deployment, we recommend [using your own CA issuer](#bring-your-own-issuer) and an enterprise PKI solution.

### Default self-signed issuer and root CA certificate for TLS server certificates

To help you get started, Azure IoT Operations is deployed with a default self-signed issuer and root CA certificate for TLS server certificates. You can use this issuer for development and testing. Azure IoT Operations uses [cert-manager](https://cert-manager.io/docs/) to manage TLS certificates, and [trust-manager](https://cert-manager.io/docs/trust/) to distribute trust bundles to components.

- The CA certificate is self-signed and no clients outside of Azure IoT Operations trust it. The subject of the CA certificate is `CN=Azure IoT Operations Quickstart Root CA - Not for Production`. Cert-manager automatically rotates the CA certificate.

- The root CA certificate is stored in a Kubernetes secret called `azure-iot-operations-aio-ca-certificate` under the `cert-manager` namespace.

- A ConfigMap called `azure-iot-operations-aio-ca-trust-bundle` under the `azure-iot-operations` namespace stores the public portion of the root CA certificate. You can retrieve the CA certificate from the ConfigMap and inspect it with kubectl and openssl. Trust-manager keeps the ConfigMap updated when cert-manager rotates the CA certificate.

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

- By default, there's already an issuer configured in the `azure-iot-operations namespace` called `azure-iot-operations-aio-certificate-issuer`. It's used as the common issuer for all TLS server certificates for IoT Operations. MQTT broker uses an issuer created from the same CA certificate, which is signed by the self-signed issuer to issue TLS server certificates for the default TLS listener on port 18883. You can inspect the issuer with the following command:

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

### Bring your own issuer

For production deployments, we recommend that you set up Azure IoT Operations with an enterprise PKI to manage certificates, and that you bring your own CA issuer that works with your enterprise PKI, instead of using the default self-signed issuer to issue TLS certificates for internal communications.

To set up Azure IoT Operations with your own issuer for internal communications, use the following steps **before deploying an instance to your cluster**:

1. Follow the steps in [Prepare your cluster](../deploy-iot-ops/howto-prepare-cluster.md) to set up your cluster.
  
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

1. Follow steps in [Deploy Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md) to deploy, *with a few changes*.

   1. Add the `--user-trust` parameter while preparing cluster. For example:

      ```bash
      az iot ops init --subscription <SUBSCRIPTION_ID> --cluster <CLUSTER_NAME>  -g <RESOURCE_GROUP> --user-trust
      ```

   1. Add the `--trust-settings` parameter with the necessary information while deploying Azure IoT Operations. For example:

      ```bash
      az iot ops create --subscription <SUBSCRIPTION_ID> -g <RESOURCE_GROUP> --cluster <CLUSTER_NAME> --custom-location <CUSTOM_LOCATION> -n <INSTANCE_NAME> --sr-resource-id <SCHEMAREGISTRY_RESOURCE_ID> --trust-settings configMapName=<CONFIGMAP_NAME> configMapKey=<CONFIGMAP_KEY_WITH_PUBLICKEY_VALUE> issuerKind=<CLUSTERISSUER_OR_ISSUER> issuerName=<ISSUER_NAME>
      ```

    > [!NOTE]
    > The custom location name has a maximum length of 63 characters.

## Manage certificates for external communications

Azure IoT Operations uses Azure Key Vault as the managed vault solution on the cloud, and uses [Azure Key Vault secret store extension for Kubernetes](/azure/azure-arc/kubernetes/secret-store-extension) to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets.

> [!IMPORTANT]
> Although Azure IoT Operations uses certificates to secure external communications, these certificates are stored as secrets in Azure Key Vault. When you add a certificate to Azure Key Vault, make sure to add it as a secret, not as a certificate resource.

### Configure Azure Key Vault permissions

[!INCLUDE [key-vault-permissions](../includes/key-vault-permissions.md)]

### Add and use certificates

Connectors use the certificate management experience to configure application authentication to external servers. To learn more about how connectors use certificates to establish mutual trust with external servers, see the connector-specific certificate management documentation such as [Understand the OPC UA certificates infrastructure](../discover-manage-assets/overview-opc-ua-connector-certificates-management.md).

When you [deploy Azure IoT Operations with secure settings](../deploy-iot-ops/overview-deploy.md#secure-settings-deployment), you can start adding certificates to Azure Key Vault, and sync them to the Kubernetes cluster to be used in the *Trust list* and *Issuer list* stores for external connections. Each connector has its own trust list to store the certificates of the external servers it trusts and connects to.

To manage certificates for external communications, follow these steps:

1. Go to [Azure IoT Operations experience](https://iotoperations.azure.com), and choose your site and Azure IoT Operations instance.
1. In the left navigation pane, select **Devices**.
1. Select on **Manage certificates and secrets**.

    :::image type="content" source="media/howto-manage-certificates/manage-certificates.png" lightbox="media/howto-manage-certificates/manage-certificates.png" alt-text="Screenshot that shows the Manage certificates and secrets option in the left navigation pane.":::

1. In the Certificates and Secrets page, select on **Add new certificate**.

    :::image type="content" source="media/howto-manage-certificates/add-new-certificate.png" lightbox="media/howto-manage-certificates/add-new-certificate.png" alt-text="Screenshot that shows the Add new certificate button in the devices page.":::

1. You can add a new certificate in two ways:

    - **Upload Certificate**: Uploads a certificate to add as a secret to Azure Key Vault and automatically synchronize to the cluster using secret store extension.

        - View the certificate details once uploaded, to ensure you have the correct certificate before adding to Azure Key Vault and synchronizing to the cluster.
        - Use an intuitive name so that you can recognize which secret represents your secret in the future.
        - Select the appropriate certificate store for the connector that uses the certificate. For example, **OPC UA trust list**.

        :::image type="content" source="media/howto-manage-certificates/upload-certificate.png" lightbox="media/howto-manage-certificates/upload-certificate.png" alt-text="Screenshot that shows the Upload certificate option when adding a new certificate to the devices page.":::

        > [!NOTE]
        > Simply uploading the certificate doesn't add the secret to Azure Key Vault and synchronize to the cluster, you must select **Apply** for the changes to be applied.

    - **Add from Azure Key Vault**: Add an existing secret from the Azure Key vault to be synchronized to the cluster.

        :::image type="content" source="media/howto-manage-certificates/add-from-key-vault.png" lightbox="media/howto-manage-certificates/add-from-key-vault.png" alt-text="Screenshot that shows the Add from Azure Key Vault option when adding a new certificate to the devices page.":::

        > [!NOTE]
        > Make sure to select the secret that holds the certificate you would like to synchronize to the cluster. Selecting a secret that isn't the correct certificate causes the connection to fail.

1. Using the list view you can manage the synchronized certificates. You can view all the synchronized certificates, and which certificate store it's synchronized to:

    :::image type="content" source="media/howto-manage-certificates/list-certificates.png" lightbox="media/howto-manage-certificates/list-certificates.png" alt-text="Screenshot that shows the list of certificates in the devices page and how to filter by Trust List and Issuer List.":::

You can delete synced certificates as well. When you delete a synced certificate, it only deletes the synced certificate from the Kubernetes cluster, and doesn't delete the contained secret reference from Azure Key Vault. You must delete the certificate secret manually from the key vault.

## Use CLI commands to create certificates

The previous sections explained how to manage certificates using the operations experience web UI and the Azure portal. You can also use the Azure CLI to manage the certificates in the connector for OPC UA trust and issuer lists. For more information, see [az iot ops connector opcua trust](/cli/azure/iot/ops/connector/opcua/trust) and [az iot ops connector opcua issuer](/cli/azure/iot/ops/connector/opcua/issuer) commands.

> [!TIP]
> Remember, these certificates must be stored as secrets in Azure Key Vault.