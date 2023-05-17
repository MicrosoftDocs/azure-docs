---
title: Azure App Configuration Kubernetes Provider (preview) | Microsoft Docs
description: "It describes the supported properties of AzureAppConfigurationProvider object in the Azure App Configuration Kubernetes Provider."
services: azure-app-configuration
author: junbchen
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 04/12/2023
ms.author: junbchen
#Customer intent: As an Azure Kubernetes Service user, I want to manage all my app settings in one place using Azure App Configuration.
---

# Azure App Configuration Kubernetes Provider (preview)

The following reference describes the supported properties of `AzureAppConfigurationProvider` object in the Azure App Configuration Kubernetes Provider.

## Properties

Following is the references of properties that user can specify in `spec` of `AzureAppConfigurationProvider`.

|Name|Description|Required|type|
|---|---|---|---|
|endpoint|Endpoint of Azure App Configuration, which you would like to retrieve the key-values from |true|string|
|target|The destination of the retrieved key-values in Kubernetes|true|object|
|auth|The authentication method to access Azure App Configuration |false|object|
|keyValues|The rule of retrieving the key-values from the Azure App Configuration store|false|object|

The `spec.target` property has the following child property.

|Name|Description| Required|type|
|---|---|---|---|
|configMapName|The name of destination configMap| true| string|

If the `spec.auth` property is not set, the system-assigned managed identity will be used. It has the following child properties.

|Name|Description| Required|type|
|---|---|---|---|
|managedIdentityClientId|Client ID of system-assigned or user-assigned managed identity|false|string|
|servicePrincipalReference|Name of the Kubernetes Secret, which contains the credentials used for service principal authentication|false|string|

The `spec.keyValues` has the following child properties.

|Name|Description|Required|type|
|---|---|---|---|
|selectors|List of selectors for key-value filtering|false|object array|
|trimKeyPrefixes|List of key prefixes to be trimmed|false|string array|
|keyVaults|Settings for Key Vault references|conditional|object|

If the `spec.keyValues.selectors` property is not set, all key-values with no label will be downloaded. It contains an array of *selector* objects, which have the following child properties.

|Name|Description|Required|type|
|---|---|---|---|
|keyFilter|Key filter to get a subset of key-value pairs|true|string|
|labelFilter|Label filter to get a subset of key-value pairs|false|string|


`spec.keyValues.keyVaults` is an object that can be specified conditionally depends on whether there are Key Vault reference content type items in retrieved key-values. If there are Key Vault reference content type items, `spec.keyValues.keyVaults` is required. It has following child properties.

|Name|Description|Required|type|
|---|---|---|---|
|target|The destination of resolved key-values of key vault reference items|true|object|
|auth|The authentication method to resolve key vault reference items|false|object|

`spec.keyValues.keyVaults.target` is required if `spec.keyValues.keyVaults` is specified. It has the following child property.

|Name|Description|Required|type|
|---|---|---|---|
|secretName|The name of destination Secret|true|string|

`spec.keyValues.keyVaults.auth` is optional. One of `managedIdentityClientId` and `servicePrincipalReference` can be specified as the default authentication method for all key vaults, if both aren't specified, the system assigned managed identity would be used. 
   
|Name|Description|Required|type|
|---|---|---|---|
|managedIdentityClientId|System assigned or user-assigned managed identity client ID for accessing key vaults by default| false| string|
|servicePrincipalReference|Name of Secret that contains the credentials used for service principal authentication for accessing key vaults by default| false| string|
|vaults|List of object which user can specify authentication method for each key vault uri|false|object array|

`spec.keyValues.keyVaults.auth.vaults` is an optional *vault* array. No specifying `spec.keyValues.keyVaults.auth.vaults` means that all key vaults are accessed through the default authentication method that specified in `spec.keyValues.keyVaults.auth`. If there are any key vaults that need to be accessed through different authentication method, user can specify the authentication method for each *vault* with following properties.

Note `uri` is required in each *vault* item and one of `managedIdentityClientId` and `servicePrincipalReference` must be specified.

|Name|Description|Required|type|
|---|---|---|---|
|uri|Array of object which user can specify authentication method for each key vault uri|true|string|
|managedIdentityClientId|user-assigned managed identity client ID for accessing specified key vault uri|conditional| string|
|servicePrincipalReference|Name of Secret that contains the credentials used for service principal authentication for accessing specified key vault uri|conditional| string|

## Examples

### Authenticate Azure App Configuration

* To use **System Assigned Managed Identity** to authenticate Azure App Configuration in Kubernetes, first you need to enable the System Assigned Managed identity of the corresponding Virtual Machine Scale Sets resource of AKS cluster, see this [doc](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vmss#enable-system-assigned-managed-identity-on-an-existing-virtual-machine-scale-set) to learn how to enable it.

    After [granting its read access](/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity#grant-access-to-app-configuration) to the Azure App Configuration, you can just deploy the following sample yaml, nothing more authentication information is required in this case.

    ``` yaml
    apiVersion: azconfig.io/v1beta1
    kind: AzureAppConfigurationProvider
    metadata:
      name: appconfigurationprovider-sample
      namespace: appconfig-sample
    spec:
      endpoint: https://<yourappconfig>.azconfig.io
      target:
        configMapName: configmap-name-to-create
    ```

* To use **User Assigned Managed Identity** to authenticate Azure App Configuration in Kubernetes, first, you need to [create a User Assigned Managed identity](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity), and [assign](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vmss#user-assigned-managed-identity) it to the corresponding Virtual Machine Scale Sets of your AKS cluster.

    After [granting its read access](/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity#grant-access-to-app-configuration) to the Azure App Configuration, you should set `spec.auth.managedIdentityClientId` to the Client ID of the managed identity, see the following yaml as an example:

    ``` yaml
    apiVersion: azconfig.io/v1beta1
    kind: AzureAppConfigurationProvider
    metadata:
      name: appconfigurationprovider-sample
      namespace: appconfig-sample
    spec:
      endpoint: https://<yourappconfig>.azconfig.io
      target:
        configMapName: configmap-name-to-create
      auth:
        managedIdentityClientId: <your-managed-identity-client-id>
    ```

* To use **Service Principal** to authenticate Azure App Configuration, you need to [create a Service Principal](/azure/active-directory/develop/howto-create-service-principal-portal) and [grant](/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity#grant-access-to-app-configuration) it with the `App Configuration Data Reader` role.

    Then you need create a Secret in the same namespace of `AzureAppConfigurationProvider` and set *azure_client_id*, *azure_client_secret* and *azure_tenant_id* in it. Set `spec.auth.servicePrincipalReference` to the name of the Secret, which contains the credentials of the service principal, see the following yaml as an example:

    ``` yaml
    apiVersion: azconfig.io/v1beta1
    kind: AzureAppConfigurationProvider
    metadata:
      name: appconfigurationprovider-sample
      namespace: appconfig-sample
    spec:
      endpoint: https://<yourappconfig>.azconfig.io
      target:
        configMapName: configmap-name-to-create
      auth:
        servicePrincipalReference: <your-service-principal-secret-name>
    ```

    > [!NOTE]
    > 1. Service Principal is the only authentication method that support authenticating Azure App Configuration in non-AKS cluster at this moment.
    > 2. Only one authentication method can be set in `auth` field, specifying more than one authentication method is not allowed

### Select a set of key-values from Azure App Configuration
You can set the `selectors` field to determine the set of key-values you would like to get from Azure App Configuration. 

This sample constructs all key-values with no label into the target ConfigMap:

``` yaml
apiVersion: azconfig.io/v1beta1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
  namespace: appconfig-sample
spec:
  endpoint: https://<yourappconfig>.azconfig.io
  target:
    configMapName: configmap-name-to-create
```

This sample uses selectors to select a subset of key-values from Azure App Configuration:

``` yaml
apiVersion: azconfig.io/v1beta1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
  namespace: appconfig-sample
spec:
  endpoint: https://<yourappconfig>.azconfig.io
  target:
    configMapName: configmap-name-to-create
  keyValues:
    selectors:
      - keyFilter: 'app1*'
      - keyFilter: 'app2*'
        labelFilter: 'sampleLabel'
```

> [!NOTE]
> If there is key overlap among the subsets of key-values returned from the selectors, the value of that key would be set by the last selector.

### Trim the prefix of the configuration setting key

This sample uses `trimKeyPrefixes` field to trim the prefix of a key before putting the key-value into ConfigMap.

``` yaml
apiVersion: azconfig.io/v1beta1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
  namespace: appconfig-sample
spec:
  endpoint: https://<yourappconfig>.azconfig.io
  target:
    configMapName: configmap-name-to-create
  keyValues:
    trimKeyPrefixes: ["prefix1", "prefix2"]
```

### Resolve keyVault reference content type items

This sample explicitly specifies using service principal to authenticate vault `yourKeyVault.vault.azure.net`. For vaults other than it, user assigned managed identity would be used.

``` yaml
apiVersion: azconfig.io/v1beta1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
  namespace: appconfig-sample
spec:
  endpoint: https://<yourappconfig>.azconfig.io
  target:
    configMapName: configmap-name-to-create
  keyValues:
    selectors:
      - keyFilter: 'app1*'
    keyVaults:
      target:
        secretName: secret-name-to-create
      auth:
        managedIdentityClientId: <your-user-assigned-managed-identity-client-id>
        vaults:
          - uri: https://yourKeyVault.vault.azure.net
            servicePrincipalReference: <name-of-secret-contains-service-principal-credentials>
```
