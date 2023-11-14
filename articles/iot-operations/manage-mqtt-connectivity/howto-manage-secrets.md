---
title: Manage secrets using Azure Key Vault or Kubernetes secrets
# titleSuffix: Azure IoT MQ
description: Learn how to manage secrets using Azure Key Vault or Kubernetes secrets.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/30/2023

#CustomerIntent: As an operator, I want to configure IoT MQ to use Azure Key Vault or Kubernetes secrets so that I can securely manage secrets.
---

# Manage secrets using Azure Key Vault or Kubernetes secrets

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

You can use [Azure Key Vault](/azure/key-vault/general/basic-concepts) to manage secrets for your Azure IoT MQ distributed MQTT broker instead of Kubernetes secrets. This article shows you how to set up Key Vault for your broker and use it to manage secrets.

## Prerequisites

- [An Azure Key Vault instance](/azure/key-vault/quick-create-portal) with a secret.
- [An Microsoft Entra service principal](/entra/identity-platform/howto-create-service-principal-portal) with `get` and `list` permissions for secrets in the Key Vault instance. To configure the service principal for Key Vault permissions, see [Assign a Key Vault access policy](/azure/key-vault/general/assign-access-policy?tabs=azure-portal).
- [A Kubernetes secret](https://kubernetes.io/docs/concepts/configuration/secret/) with the service principal's credentials, like this example:

    ```yaml
    apiVersion: v1
    kind: Secret
    metadata:
      name: "my-akv-sp-secret"
      namespace: {{% namespace %}}
    type: Opaque
    data:
      clientid: <base64 encoded client id>
      clientsecret: <base64 encoded client secret>
    ```
- [The Azure Key Vault Provider for Secrets Store CSI Driver](/azure/azure-arc/kubernetes/tutorial-akv-secrets-provider)

## Use Azure Key Vault for secret management

The `keyVault` field is available wherever Kubernetes secrets (`secretName`) are used. The following table describes the properties of the `keyVault` field.

| Property | Required | Description |
| --- | --- | --- |
| vault | Yes | Specifies the Azure Key Vault that contains the secrets. |
| vault.name | Yes | Specifies the name of the Azure Key Vault. To get the Key Vault name from Azure portal, navigate to the Key Vault instance and copy the name from the Overview page. |
| vault.directoryId | Yes | Specifies the Microsoft Entra tenant ID. To get the tenant ID from Azure portal, navigate to the Key Vault instance and copy the tenant ID from the Overview page. |
| vault.credentials.servicePrincipalLocalSecretName | Yes | Specifies the name of the secret that contains the service principal credentials. |
| vaultSecret | Yes | Specifies the secret in the Azure Key Vault. |
| vaultSecret.name | Yes | Specifies the name of the secret. |
| vaultSecret.version | No | Specifies the version of the secret. |

## Examples

For example, to create a TLS *BrokerListener* that uses Azure Key Vault for secret the server certificate, use the following YAML:

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: BrokerListener
metadata:
  name: "tls-listener-manual"
  namespace: default
spec:
  brokerRef: "my-broker"
  authenticationEnabled: true
  authorizationEnabled: false
  port: 8883
  tls:
    manual:
      keyVault:
        vault:
          name: "my-key-vault"
          directoryId: "<AKV directory ID>"
          credentials:
            servicePrincipalLocalSecretName: "my-akv-sp-secret"
        vaultSecret:
          name: "my-server-certificate"
          version: "latest"
```

This next example shows how to use Azure Key Vault for the `usernamePassword` field in a BrokerAuthentication resource:

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: BrokerAuthentication
metadata:
  name: "my-authentication"
  namespace: default
spec:
  listenerRef: 
    - "tls-listener-manual"
  authenicationMethods:
    - usernamePassword:
        keyVault:
          vault:
            name: "my-key-vault"
            directoryId: "<AKV directory ID>"
            credentials:
              servicePrincipalLocalSecretName: "my-akv-sp-secret"
          vaultSecret:
            name: "my-username-password-db"
            version: "latest"
```

This example shows how to use Azure Key Vault for MQTT bridge remote broker credentials:

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: MqttBridgeConnector
metadata:
  name: "my-bridge"
  namespace: default
spec:
  image:
    repository: mcr.microsoft.com/azureiotoperations/mqttbridge
    tag: 0.1.0-preview
    pullPolicy: IfNotPresent
  protocol: v5
  bridgeInstances: 1
  clientIdPrefix: "factory-gateway-"
  logLevel: "debug"
  remoteBrokerConnection:
    endpoint: "example.westeurope-1.ts.eventgrid.azure.net:8883"
    tls:
      tlsEnabled: true
    authentication:
      x509:
        keyVault:
          vault:
            name: "my-key-vault"
            directoryId: "<AKV directory ID>"
            credentials:
              servicePrincipalLocalSecretName: "my-akv-sp-secret"
          vaultSecret:
            name: "my-remote-broker-certificate"
            version: "latest"
```

## Related content

- About [BrokerListener resource](howto-configure-brokerlistener.md)
- [Configure authorization for a BrokerListener](./howto-configure-authorization.md)
- [Configure authentication for a BrokerListener](./howto-configure-authentication.md)
