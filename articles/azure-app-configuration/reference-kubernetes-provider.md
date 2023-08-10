---
title: Azure App Configuration Kubernetes Provider reference (preview) | Microsoft Docs
description: "It describes the supported properties of AzureAppConfigurationProvider object in the Azure App Configuration Kubernetes Provider."
services: azure-app-configuration
author: junbchen
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 04/12/2023
ms.author: junbchen
#Customer intent: As an Azure Kubernetes Service user, I want to manage all my app settings in one place using Azure App Configuration.
---

# Azure App Configuration Kubernetes Provider reference (preview)

The following reference outlines the properties supported by the Azure App Configuration Kubernetes Provider.

## Properties

An `AzureAppConfigurationProvider` resource has the following top-level child properties under the `spec`. Either `endpoint` or `connectionStringReference` has to be specified.

|Name|Description|Required|Type|
|---|---|---|---|
|endpoint|The endpoint of Azure App Configuration, which you would like to retrieve the key-values from|alternative|string|
|connectionStringReference|The name of the Kubernetes Secret that contains Azure App Configuration connection string|alternative|string|
|target|The destination of the retrieved key-values in Kubernetes|true|object|
|auth|The authentication method to access Azure App Configuration|false|object|
|keyValues|The settings for querying and processing key-values|false|object|

The `spec.target` property has the following child property.

|Name|Description|Required|Type|
|---|---|---|---|
|configMapName|The name of the ConfigMap to be created|true|string|

If the `spec.auth` property isn't set, the system-assigned managed identity is used. It has the following child properties. Only one authentication method should be set.

|Name|Description|Required|Type|
|---|---|---|---|
|managedIdentityClientId|The Client ID of user-assigned managed identity|false|string|
|servicePrincipalReference|The name of the Kubernetes Secret that contains the credentials of a service principal|false|string|

The `spec.keyValues` has the following child properties. The `spec.keyValues.keyVaults` property is required if any Key Vault references are expected to be downloaded.

|Name|Description|Required|Type|
|---|---|---|---|
|selectors|The list of selectors for key-value filtering|false|object array|
|trimKeyPrefixes|The list of key prefixes to be trimmed|false|string array|
|keyVaults|The settings for Key Vault references|conditional|object|
|refresh|The settings for refreshing the key-values in ConfigMap or Secret|false|object|

If the `spec.keyValues.selectors` property isn't set, all key-values with no label will be downloaded. It contains an array of *selector* objects, which have the following child properties.

|Name|Description|Required|Type|
|---|---|---|---|
|keyFilter|The key filter for querying key-values|true|string|
|labelFilter|The label filter for querying key-values|false|string|

The `spec.keyValues.keyVaults` property has the following child properties.

|Name|Description|Required|Type|
|---|---|---|---|
|target|The destination of resolved Key Vault references in Kubernetes|true|object|
|auth|The authentication method to access Key Vaults|false|object|

The `spec.keyValues.keyVaults.target` property has the following child property.

|Name|Description|Required|Type|
|---|---|---|---|
|secretName|The name of the Kubernetes Secret to be created|true|string|

If the `spec.keyValues.keyVaults.auth` property isn't set, the system-assigned managed identity is used. It has the following child properties.

|Name|Description|Required|Type|
|---|---|---|---|
|managedIdentityClientId|The client ID of a user-assigned managed identity used for authentication with vaults that don't have individual authentication methods specified|false|string|
|servicePrincipalReference|The name of the Kubernetes Secret that contains the credentials of a service principal used for authentication with vaults that don't have individual authentication methods specified|false|string|
|vaults|The authentication methods for individual vaults|false|object array|

The authentication method of each *vault* can be specified with the following properties. One of `managedIdentityClientId` and `servicePrincipalReference` must be provided.

|Name|Description|Required|Type|
|---|---|---|---|
|uri|The URI of a vault|true|string|
|managedIdentityClientId|The client ID of a user-assigned managed identity used for authentication with a vault|false|string|
|servicePrincipalReference|The name of the Kubernetes Secret that contains the credentials of a service principal used for authentication with a vault|false|string|

The `spec.keyValues.refresh` property has the following child properties.

|Name|Description|Required|Type|
|---|---|---|---|
|monitoring|The key-values that are monitored by the provider, provider automatically refreshes the ConfigMap or Secret if value change in any designated key-value|true|object|
|interval|The interval for refreshing, default value is 30 seconds, must be greater than 1 second|false|duration string|

The `spec.keyValues.refresh.monitoring.keyValues` is an array of objects, which have the following child properties.

|Name|Description|Required|Type|
|---|---|---|---|
|key|The key of a key-value|true|string|
|label|The label of a key-value|false|string|

## Examples

### Authentication

#### Use System-Assigned Managed Identity

1. [Enable the system-assigned managed identity in the virtual machine scale set](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vmss#enable-system-assigned-managed-identity-on-an-existing-virtual-machine-scale-set) used by the Azure Kubernetes Service (AKS) cluster.
1. [Grant the system-assigned managed identity **App Configuration Data Reader** role](/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity#grant-access-to-app-configuration) in Azure App Configuration.
1. Deploy the following sample `AzureAppConfigurationProvider` resource to the AKS cluster.

    ``` yaml
    apiVersion: azconfig.io/v1beta1
    kind: AzureAppConfigurationProvider
    metadata:
      name: appconfigurationprovider-sample
    spec:
      endpoint: <your-app-configuration-store-endpoint>
      target:
        configMapName: configmap-created-by-appconfig-provider
    ```

#### Use User-Assigned Managed Identity

1. [Create a user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity) and note down its client ID after creation.
1. [Assign the user-assigned managed identity to the virtual machine scale set](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vmss#user-assigned-managed-identity) used by the Azure Kubernetes Service (AKS) cluster.
1. [Grant the user-assigned managed identity **App Configuration Data Reader** role](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vmss#user-assigned-managed-identity) in Azure App Configuration.
1. Set the `spec.auth.managedIdentityClientId` property to the client ID of the user-assigned managed identity in the following sample `AzureAppConfigurationProvider` resource and deploy it to the AKS cluster.

    ``` yaml
    apiVersion: azconfig.io/v1beta1
    kind: AzureAppConfigurationProvider
    metadata:
      name: appconfigurationprovider-sample
    spec:
      endpoint: <your-app-configuration-store-endpoint>
      target:
        configMapName: configmap-created-by-appconfig-provider
      auth:
        managedIdentityClientId: <your-managed-identity-client-id>
    ```

#### Use Service Principal

1. [Create a Service Principal](/azure/active-directory/develop/howto-create-service-principal-portal)
1. [Grant the service principal **App Configuration Data Reader** role](/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity#grant-access-to-app-configuration) in Azure App Configuration.
1. Create a Kubernetes Secret in the same namespace as the `AzureAppConfigurationProvider` resource and add *azure_client_id*, *azure_client_secret*, and *azure_tenant_id* of the service principal to the Secret.
1. Set the `spec.auth.servicePrincipalReference` property to the name of the Secret in the following sample `AzureAppConfigurationProvider` resource and deploy it to the Kubernetes cluster.

    ``` yaml
    apiVersion: azconfig.io/v1beta1
    kind: AzureAppConfigurationProvider
    metadata:
      name: appconfigurationprovider-sample
    spec:
      endpoint: <your-app-configuration-store-endpoint>
      target:
        configMapName: configmap-created-by-appconfig-provider
      auth:
        servicePrincipalReference: <your-service-principal-secret-name>
    ```

#### Use Connection String

1. Create a Kubernetes Secret in the same namespace as the `AzureAppConfigurationProvider` resource and add Azure App Configuration connection string with key *azure_app_configuration_connection_string* in the Secret.
2. Set the `spec.connectionStringReference` property to the name of the Secret in the following sample `AzureAppConfigurationProvider` resource and deploy it to the Kubernetes cluster.

    ``` yaml
    apiVersion: azconfig.io/v1beta1
    kind: AzureAppConfigurationProvider
    metadata:
      name: appconfigurationprovider-sample
    spec:
      connectionStringReference: <your-connection-string-secret-name>
      target:
        configMapName: configmap-created-by-appconfig-provider
    ```

### Key-value selection

Use the `selectors` property to filter the key-values to be downloaded from Azure App Configuration.

The following sample downloads all key-values with no label.

``` yaml
apiVersion: azconfig.io/v1beta1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
spec:
  endpoint: <your-app-configuration-store-endpoint>
  target:
    configMapName: configmap-created-by-appconfig-provider
```

In following example, two selectors are used to retrieve two sets of key-values, each with unique labels. It's important to note that the values of the last selector take precedence and override any overlapping keys from the previous selectors.

``` yaml
apiVersion: azconfig.io/v1beta1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
spec:
  endpoint: <your-app-configuration-store-endpoint>
  target:
    configMapName: configmap-created-by-appconfig-provider
  keyValues:
    selectors:
      - keyFilter: app1*
        labelFilter: common
      - keyFilter: app1*
        labelFilter: development
```

### Key prefix trimming

The following sample uses the `trimKeyPrefixes` property to trim two prefixes from key names before adding them to the generated ConfigMap.

``` yaml
apiVersion: azconfig.io/v1beta1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
spec:
  endpoint: <your-app-configuration-store-endpoint>
  target:
    configMapName: configmap-created-by-appconfig-provider
  keyValues:
    trimKeyPrefixes: [prefix1, prefix2]
```

### Key Vault references

The following sample instructs using a service principal to authenticate with a specific vault and a user-assigned managed identity for all other vaults.

``` yaml
apiVersion: azconfig.io/v1beta1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
spec:
  endpoint: <your-app-configuration-store-endpoint>
  target:
    configMapName: configmap-created-by-appconfig-provider
  keyValues:
    selectors:
      - keyFilter: app1*
    keyVaults:
      target:
        secretName: secret-created-by-appconfig-provider
      auth:
        managedIdentityClientId: <your-user-assigned-managed-identity-client-id>
        vaults:
          - uri: <your-key-vault-uri>
            servicePrincipalReference: <name-of-secret-containing-service-principal-credentials>
```

### Dynamically refresh ConfigMap and Secret

Setting the `spec.keyValues.refresh` property enables dynamic configuration data refresh in ConfigMap and Secret by monitoring designated key-values. The provider periodically polls the key-values, if there is any value change, provider triggers ConfigMap and Secret refresh in accordance with the present data in Azure App Configuration.

The following sample instructs monitoring two key-values with 1 minute polling interval.

``` yaml
apiVersion: azconfig.io/v1beta1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
spec:
  endpoint: <your-app-configuration-store-endpoint>
  target:
    configMapName: configmap-created-by-appconfig-provider
  keyValues:
    selectors:
      - keyFilter: app1*
        labelFilter: common
      - keyFilter: app1*
        labelFilter: development
    refresh:
      interval: 1m
      monitoring:
        keyValues:
          - key: sentinelKey
            label: common
          - key: sentinelKey
            label: development
```