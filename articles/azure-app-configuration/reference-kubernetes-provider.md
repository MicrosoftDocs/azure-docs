---
title: Azure App Configuration Kubernetes Provider reference
description: "It describes the supported properties of AzureAppConfigurationProvider object in the Azure App Configuration Kubernetes Provider."
services: azure-app-configuration
author: junbchen
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 04/12/2023
ms.author: junbchen
#Customer intent: As an Azure Kubernetes Service user, I want to manage all my app settings in one place using Azure App Configuration.
---

# Azure App Configuration Kubernetes Provider reference

The following reference outlines the properties supported by the Azure App Configuration Kubernetes Provider `v1.3.0`. See [release notes](https://github.com/Azure/AppConfiguration/blob/main/releaseNotes/KubernetesProvider.md) for more information on the change.

## Properties

An `AzureAppConfigurationProvider` resource has the following top-level child properties under the `spec`. Either `endpoint` or `connectionStringReference` has to be specified.

|Name|Description|Required|Type|
|---|---|---|---|
|endpoint|The endpoint of Azure App Configuration, which you would like to retrieve the key-values from.|alternative|string|
|connectionStringReference|The name of the Kubernetes Secret that contains Azure App Configuration connection string.|alternative|string|
|replicaDiscoveryEnabled|The setting that determines whether replicas of Azure App Configuration are automatically discovered and used for failover. If the property is absent, a default value of `true` is used.|false|bool|
|target|The destination of the retrieved key-values in Kubernetes.|true|object|
|auth|The authentication method to access Azure App Configuration.|false|object|
|configuration|The settings for querying and processing key-values in Azure App Configuration.|false|object|
|secret|The settings for Key Vault references in Azure App Configuration.|conditional|object|
|featureFlag|The settings for feature flags in Azure App Configuration.|false|object|

The `spec.target` property has the following child property.

|Name|Description|Required|Type|
|---|---|---|---|
|configMapName|The name of the ConfigMap to be created.|true|string|
|configMapData|The setting that specifies how the retrieved data should be populated in the generated ConfigMap.|false|object|

If the `spec.target.configMapData` property is not set, the generated ConfigMap is populated with the list of key-values retrieved from Azure App Configuration, which allows the ConfigMap to be consumed as environment variables. Update this property if you wish to consume the ConfigMap as a mounted file. This property has the following child properties.

|Name|Description|Required|Type|
|---|---|---|---|
|type|The setting that indicates how the retrieved data is constructed in the generated ConfigMap. The allowed values include `default`, `json`, `yaml` and `properties`.|optional|string|
|key|The key name of the retrieved data when the `type` is set to `json`, `yaml` or `properties`. Set it to the file name if the ConfigMap is set up to be consumed as a mounted file.|conditional|string|
|separator|The delimiter that is used to output the ConfigMap data in hierarchical format when the type is set to `json` or `yaml`. The separator is empty by default and the generated ConfigMap contains key-values in their original form. Configure this setting only if the configuration file loader used in your application can't load key-values without converting them to the hierarchical format.|optional|string|

The `spec.auth` property isn't required if the connection string of your App Configuration store is provided by setting the `spec.connectionStringReference` property. Otherwise, one of the identities, service principal, workload identity, or managed identity, is used for authentication. The `spec.auth` has the following child properties. Only one of them should be specified. If none of them are set, the system-assigned managed identity of the virtual machine scale set is used.

|Name|Description|Required|Type|
|---|---|---|---|
|servicePrincipalReference|The name of the Kubernetes Secret that contains the credentials of a service principal. The secret must be in the same namespace as the Kubernetes provider.|false|string|
|workloadIdentity|The settings for using workload identity.|false|object|
|managedIdentityClientId|The client ID of user-assigned managed identity of virtual machine scale set.|false|string|

The `spec.auth.workloadIdentity` property has the following child properties. One of them must be specified.

|Name|Description|Required|Type|
|---|---|---|---|
|managedIdentityClientId|The client ID of the user-assigned managed identity associated with the workload identity.|alternative|string|
|managedIdentityClientIdReference|The client ID of the user-assigned managed identity can be obtained from a ConfigMap. The ConfigMap must be in the same namespace as the Kubernetes provider.|alternative|object|

The `spec.auth.workloadIdentity.managedIdentityClientIdReference` property has the following child properties.

|Name|Description|Required|Type|
|---|---|---|---|
|configMap|The name of the ConfigMap where the client ID of a user-assigned managed identity can be found.|true|string|
|key|The key name that holds the value for the client ID of a user-assigned managed identity.|true|string|

The `spec.configuration` has the following child properties. 
  
|Name|Description|Required|Type|
|---|---|---|---|
|selectors|The list of selectors for key-value filtering.|false|object array|
|trimKeyPrefixes|The list of key prefixes to be trimmed.|false|string array|
|refresh|The settings for refreshing key-values from Azure App Configuration. If the property is absent, key-values from Azure App Configuration are not refreshed.|false|object|

If the `spec.configuration.selectors` property isn't set, all key-values with no label are downloaded. It contains an array of *selector* objects, which have the following child properties. Note that the key-values of the last selector take precedence and override any overlapping keys from the previous selectors.

|Name|Description|Required|Type|
|---|---|---|---|
|keyFilter|The key filter for querying key-values. This property and the `snapshotName` property should not be set at the same time.|alternative|string|
|labelFilter|The label filter for querying key-values. This property and the `snapshotName` property should not be set at the same time.|false|string|
|snapshotName|The name of a snapshot from which key-values are loaded. This property should not be used in conjunction with other properties.|alternative|string|

The `spec.configuration.refresh` property has the following child properties.

|Name|Description|Required|Type|
|---|---|---|---|
|enabled|The setting that determines whether key-values from Azure App Configuration is automatically refreshed. If the property is absent, a default value of `false` is used.|false|bool|
|monitoring|The key-values monitored for change detection, aka sentinel keys. The key-values from Azure App Configuration are refreshed only if at least one of the monitored key-values is changed.|true|object|
|interval|The interval at which the key-values are refreshed from Azure App Configuration. It must be greater than or equal to 1 second. If the property is absent, a default value of 30 seconds is used.|false|duration string|

The `spec.configuration.refresh.monitoring.keyValues` is an array of objects, which have the following child properties.

|Name|Description|Required|Type|
|---|---|---|---|
|key|The key of a key-value.|true|string|
|label|The label of a key-value.|false|string|

The `spec.secret` property has the following child properties. It is required if any Key Vault references are expected to be downloaded. To learn more about the support for Kubernetes built-in types of Secrets, see [Types of Secret](#types-of-secret).

|Name|Description|Required|Type|
|---|---|---|---|
|target|The destination of the retrieved secrets in Kubernetes.|true|object|
|auth|The authentication method to access Key Vaults.|false|object|
|refresh|The settings for refreshing data from Key Vaults. If the property is absent, data from Key Vaults is not refreshed unless the corresponding Key Vault references are reloaded.|false|object|

The `spec.secret.target` property has the following child property.

|Name|Description|Required|Type|
|---|---|---|---|
|secretName|The name of the Kubernetes Secret to be created.|true|string|

If the `spec.secret.auth` property isn't set, the system-assigned managed identity is used. It has the following child properties.

|Name|Description|Required|Type|
|---|---|---|---|
|servicePrincipalReference|The name of the Kubernetes Secret that contains the credentials of a service principal used for authentication with Key Vaults that don't have individual authentication methods specified.|false|string|
|workloadIdentity|The settings of the workload identity used for authentication with Key Vaults that don't have individual authentication methods specified. It has the same child properties as `spec.auth.workloadIdentity`.|false|object|
|managedIdentityClientId|The client ID of a user-assigned managed identity of virtual machine scale set used for authentication with Key Vaults that don't have individual authentication methods specified.|false|string|
|keyVaults|The authentication methods for individual Key Vaults.|false|object array|

The authentication method of each *Key Vault* can be specified with the following properties. One of `managedIdentityClientId`, `servicePrincipalReference` or `workloadIdentity` must be provided.

|Name|Description|Required|Type|
|---|---|---|---|
|uri|The URI of a Key Vault.|true|string|
|servicePrincipalReference|The name of the Kubernetes Secret that contains the credentials of a service principal used for authentication with a Key Vault.|false|string|
|workloadIdentity|The settings of the workload identity used for authentication with a Key Vault. It has the same child properties as `spec.auth.workloadIdentity`.|false|object|
|managedIdentityClientId|The client ID of a user-assigned managed identity of virtual machine scale set used for authentication with a Key Vault.|false|string|

The `spec.secret.refresh` property has the following child properties.

|Name|Description|Required|Type|
|---|---|---|---|
|enabled|The setting that determines whether data from Key Vaults is automatically refreshed. If the property is absent, a default value of `false` is used.|false|bool|
|interval|The interval at which the data is refreshed from Key Vault. It must be greater than or equal to 1 minute. The Key Vault refresh is independent of the App Configuration refresh configured via `spec.configuration.refresh`.|true|duration string|

The `spec.featureFlag` property has the following child properties. It is required if any feature flags are expected to be downloaded.

|Name|Description|Required|Type|
|---|---|---|---|
|selectors|The list of selectors for feature flag filtering.|false|object array|
|refresh|The settings for refreshing feature flags from Azure App Configuration. If the property is absent, feature flags from Azure App Configuration are not refreshed.|false|object|

If the `spec.featureFlag.selectors` property isn't set, feature flags are not downloaded. It contains an array of *selector* objects, which have the following child properties. Note that the feature flags of the last selector take precedence and override any overlapping keys from the previous selectors.

|Name|Description|Required|Type|
|---|---|---|---|
|keyFilter|The key filter for querying feature flags. This property and the `snapshotName` property should not be set at the same time.|alternative|string|
|labelFilter|The label filter for querying feature flags. This property and the `snapshotName` property should not be set at the same time.|false|string|
|snapshotName|The name of a snapshot from which feature flags are loaded. This property should not be used in conjunction with other properties.|alternative|string|

The `spec.featureFlag.refresh` property has the following child properties.

|Name|Description|Required|Type|
|---|---|---|---|
|enabled|The setting that determines whether feature flags from Azure App Configuration are automatically refreshed. If the property is absent, a default value of `false` is used.|false|bool|
|interval|The interval at which the feature flags are refreshed from Azure App Configuration. It must be greater than or equal to 1 second. If the property is absent, a default value of 30 seconds is used.|false|duration string|

## Installation

Use the following `helm install` command to install the Azure App Configuration Kubernetes Provider. See [helm-values.yaml](https://github.com/Azure/AppConfiguration-KubernetesProvider/blob/main/deploy/parameter/helm-values.yaml) for the complete list of parameters and their default values. You can override the default values by passing the `--set` flag to the command.
 
```bash
helm install azureappconfiguration.kubernetesprovider \
    oci://mcr.microsoft.com/azure-app-configuration/helmchart/kubernetes-provider \
    --namespace azappconfig-system \
    --create-namespace
```

### Autoscaling

By default, autoscaling is disabled. However, if you have multiple `AzureAppConfigurationProvider` resources to produce multiple ConfigMaps/Secrets, you can enable horizontal pod autoscaling by setting `autoscaling.enabled` to `true`.

## Examples

### Authentication

#### Use system-assigned managed identity of virtual machine scale set

1. [Enable the system-assigned managed identity in the virtual machine scale set](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vmss#enable-system-assigned-managed-identity-on-an-existing-virtual-machine-scale-set) used by the Azure Kubernetes Service (AKS) cluster.

1. [Grant the system-assigned managed identity **App Configuration Data Reader** role](/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity#grant-access-to-app-configuration) in Azure App Configuration.

1. Deploy the following sample `AzureAppConfigurationProvider` resource to the AKS cluster.

    ``` yaml
    apiVersion: azconfig.io/v1
    kind: AzureAppConfigurationProvider
    metadata:
      name: appconfigurationprovider-sample
    spec:
      endpoint: <your-app-configuration-store-endpoint>
      target:
        configMapName: configmap-created-by-appconfig-provider
    ```

#### Use user-assigned managed identity of virtual machine scale set

1. [Create a user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity) and note down its client ID after creation.

1. [Assign the user-assigned managed identity to the virtual machine scale set](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vmss#user-assigned-managed-identity) used by the Azure Kubernetes Service (AKS) cluster.

1. [Grant the user-assigned managed identity **App Configuration Data Reader** role](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vmss#user-assigned-managed-identity) in Azure App Configuration.

1. Set the `spec.auth.managedIdentityClientId` property to the client ID of the user-assigned managed identity in the following sample `AzureAppConfigurationProvider` resource and deploy it to the AKS cluster.

    ``` yaml
    apiVersion: azconfig.io/v1
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

#### Use service principal

1. [Create a Service Principal](/azure/active-directory/develop/howto-create-service-principal-portal)

1. [Grant the service principal **App Configuration Data Reader** role](/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity#grant-access-to-app-configuration) in Azure App Configuration.

1. Create a Kubernetes Secret in the same namespace as the `AzureAppConfigurationProvider` resource and add *azure_client_id*, *azure_client_secret*, and *azure_tenant_id* of the service principal to the Secret.

1. Set the `spec.auth.servicePrincipalReference` property to the name of the Secret in the following sample `AzureAppConfigurationProvider` resource and deploy it to the Kubernetes cluster.

    ``` yaml
    apiVersion: azconfig.io/v1
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

#### Use workload identity

1. [Enable Workload Identity](/azure/aks/workload-identity-deploy-cluster#update-an-existing-aks-cluster) on the Azure Kubernetes Service (AKS) cluster.

1. [Get the OIDC issuer URL](/azure/aks/workload-identity-deploy-cluster#retrieve-the-oidc-issuer-url) of the AKS cluster.

1. [Create a user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity) and note down its client ID after creation.

1. Create the federated identity credential between the managed identity, OIDC issuer, and subject using the Azure CLI.

   ``` azurecli
   az identity federated-credential create --name "${FEDERATED_IDENTITY_CREDENTIAL_NAME}" --identity-name "${USER_ASSIGNED_IDENTITY_NAME}" --resource-group "${RESOURCE_GROUP}" --issuer "${AKS_OIDC_ISSUER}" --subject system:serviceaccount:azappconfig-system:az-appconfig-k8s-provider --audience api://AzureADTokenExchange
   ```

1. [Grant the user-assigned managed identity **App Configuration Data Reader** role](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vmss#user-assigned-managed-identity) in Azure App Configuration.

1. Set the `spec.auth.workloadIdentity.managedIdentityClientId` property to the client ID of the user-assigned managed identity in the following sample `AzureAppConfigurationProvider` resource and deploy it to the AKS cluster.

    ``` yaml
    apiVersion: azconfig.io/v1
    kind: AzureAppConfigurationProvider
    metadata:
      name: appconfigurationprovider-sample
    spec:
      endpoint: <your-app-configuration-store-endpoint>
      target:
        configMapName: configmap-created-by-appconfig-provider
      auth:
        workloadIdentity:
          managedIdentityClientId: <your-managed-identity-client-id>
    ```

#### Use connection string

1. Create a Kubernetes Secret in the same namespace as the `AzureAppConfigurationProvider` resource and add Azure App Configuration connection string with key *azure_app_configuration_connection_string* in the Secret.

1. Set the `spec.connectionStringReference` property to the name of the Secret in the following sample `AzureAppConfigurationProvider` resource and deploy it to the Kubernetes cluster.

    ``` yaml
    apiVersion: azconfig.io/v1
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
apiVersion: azconfig.io/v1
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
apiVersion: azconfig.io/v1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
spec:
  endpoint: <your-app-configuration-store-endpoint>
  target:
    configMapName: configmap-created-by-appconfig-provider
  configuration:
    selectors:
      - keyFilter: app1*
        labelFilter: common
      - keyFilter: app1*
        labelFilter: development
```

A snapshot can be used alone or together with other key-value selectors. In the following sample, you load key-values of common configuration from a snapshot and then override some of them with key-values for development.

``` yaml
apiVersion: azconfig.io/v1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
spec:
  endpoint: <your-app-configuration-store-endpoint>
  target:
    configMapName: configmap-created-by-appconfig-provider
  configuration:
    selectors:
      - snapshotName: app1_common_configuration
      - keyFilter: app1*
        labelFilter: development
```

### Key prefix trimming

The following sample uses the `trimKeyPrefixes` property to trim two prefixes from key names before adding them to the generated ConfigMap.

``` yaml
apiVersion: azconfig.io/v1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
spec:
  endpoint: <your-app-configuration-store-endpoint>
  target:
    configMapName: configmap-created-by-appconfig-provider
  configuration:
    trimKeyPrefixes: [prefix1, prefix2]
```

### Configuration refresh

When you make changes to your data in Azure App Configuration, you might want those changes to be refreshed automatically in your Kubernetes cluster. It's common to update multiple key-values, but you don't want the cluster to pick up a change midway through the update. To maintain configuration consistency, you can use a key-value to signal the completion of your update. This key-value is known as the sentinel key. The Kubernetes provider can monitor this key-value, and the ConfigMap and Secret will only be regenerated with updated data once a change is detected in the sentinel key.

In the following sample, a key-value named `app1_sentinel` is polled every minute, and the configuration is refreshed whenever changes are detected in the sentinel key.

``` yaml
apiVersion: azconfig.io/v1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
spec:
  endpoint: <your-app-configuration-store-endpoint>
  target:
    configMapName: configmap-created-by-appconfig-provider
  configuration:
    selectors:
      - keyFilter: app1*
        labelFilter: common
    refresh:
      enabled: true
      interval: 1m
      monitoring:
        keyValues:
          - key: app1_sentinel
            label: common
```

### Key Vault references

#### Authentication

In the following sample, one Key Vault is authenticated with a service principal, while all other Key Vaults are authenticated with a user-assigned managed identity.

``` yaml
apiVersion: azconfig.io/v1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
spec:
  endpoint: <your-app-configuration-store-endpoint>
  target:
    configMapName: configmap-created-by-appconfig-provider
  configuration:
    selectors:
      - keyFilter: app1*
  secret:
    target:
      secretName: secret-created-by-appconfig-provider
    auth:
      managedIdentityClientId: <your-user-assigned-managed-identity-client-id>
      keyVaults:
        - uri: <your-key-vault-uri>
          servicePrincipalReference: <name-of-secret-containing-service-principal-credentials>
```

#### Types of Secret

Two Kubernetes built-in [types of Secrets](https://kubernetes.io/docs/concepts/configuration/secret/#secret-types), Opaque and TLS, are currently supported. Secrets resolved from Key Vault references are saved as the [Opaque Secret](https://kubernetes.io/docs/concepts/configuration/secret/#opaque-secrets) type by default. If you have a Key Vault reference to a certificate and want to save it as the [TLS Secret](https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets) type, you can add a **tag** with the following name and value to the Key Vault reference in Azure App Configuration. By doing so, a Secret with the `kubernetes.io/tls` type will be generated and named after the key of the Key Vault reference.

|Name|Value|
|---|---|
|.kubernetes.secret.type|kubernetes.io/tls|

#### Refresh of secrets from Key Vault

Refreshing secrets from Key Vaults usually requires reloading the corresponding Key Vault references from Azure App Configuration. However, with the `spec.secret.refresh` property, you can refresh the secrets from Key Vault independently. This is especially useful for ensuring that your workload automatically picks up any updated secrets from Key Vault during secret rotation. Note that to load the latest version of a secret, the Key Vault reference must not be a versioned secret.

The following sample refreshes all non-versioned secrets from Key Vault every hour.

``` yaml
apiVersion: azconfig.io/v1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
spec:
  endpoint: <your-app-configuration-store-endpoint>
  target:
    configMapName: configmap-created-by-appconfig-provider
  configuration:
    selectors:
      - keyFilter: app1*
        labelFilter: common
  secret:
    target:
      secretName: secret-created-by-appconfig-provider
    auth:
      managedIdentityClientId: <your-user-assigned-managed-identity-client-id>
    refresh:
      enabled: true
      interval: 1h
```

### Feature Flags

In the following sample, feature flags with keys starting with `app1` and labels equivalent to `common` are downloaded and refreshed every 10 minutes.

``` yaml
apiVersion: azconfig.io/v1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
spec:
  endpoint: <your-app-configuration-store-endpoint>
  target:
    configMapName: configmap-created-by-appconfig-provider
  featureFlag:
    selectors:
      - keyFilter: app1*
        labelFilter: common
    refresh:
      enabled: true
      interval: 10m
```

### ConfigMap Consumption

Applications running in Kubernetes typically consume the ConfigMap either as environment variables or as configuration files. If the `configMapData.type` property is absent or is set to default, the ConfigMap is populated with the itemized list of data retrieved from Azure App Configuration, which can be easily consumed as environment variables. If the `configMapData.type` property is set to json, yaml or properties, data retrieved from Azure App Configuration is grouped into one item with key name specified by the `configMapData.key` property in the generated ConfigMap, which can be consumed as a mounted file.

The following examples show how the data is populated in the generated ConfigMap with different settings of the `configMapData.type` property.

Assuming an App Configuration store has these key-values:

|key|value|
|---|---|
|key1|value1|
|key2|value2|
|key3|value3|

#### [default](#tab/default)

And the `configMapData.type` property is absent or set to `default`,

``` yaml
apiVersion: azconfig.io/v1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
spec:
  endpoint: <your-app-configuration-store-endpoint>
  target:
    configMapName: configmap-created-by-appconfig-provider
```

The generated ConfigMap is populated with the following data:

``` yaml
data:
  key1: value1
  key2: value2
  key3: value3
```

#### [json](#tab/json)

And the `configMapData.type` property is set to `json`,

``` yaml
apiVersion: azconfig.io/v1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
spec:
  endpoint: <your-app-configuration-store-endpoint>
  target:
    configMapName: configmap-created-by-appconfig-provider
    configMapData:
      type: json
      key: appSettings.json
```

The generated ConfigMap is populated with the following data:

``` yaml
data:
  appSettings.json: >-
    {"key1":"value1","key2":"value2","key3":"value3"}
```

#### [yaml](#tab/yaml)

And the `configMapData.type` property is set to `yaml`,

``` yaml
apiVersion: azconfig.io/v1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
spec:
  endpoint: <your-app-configuration-store-endpoint>
  target:
    configMapName: configmap-created-by-appconfig-provider
    configMapData:
      type: yaml
      key: appSettings.yaml
```

The generated ConfigMap is populated with the following data:

``` yaml
data:
  appSettings.yaml: >-
    key1: value1
    key2: value2
    key3: value3
```

#### [properties](#tab/properties)

And the `configMapData.type` property is set to `properties`,

``` yaml
apiVersion: azconfig.io/v1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
spec:
  endpoint: <your-app-configuration-store-endpoint>
  target:
    configMapName: configmap-created-by-appconfig-provider
    configMapData:
      type: properties
      key: app.properties
```

The generated ConfigMap is populated with the following data:

``` yaml
data:
  app.properties: >-
    key1=value1
    key2=value2
    key3=value3
```

---