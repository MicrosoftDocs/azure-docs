---
title: Storing your license keys in Azure Data Manager for Agriculture
description: Provides information on using third party keys 
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 06/23/2023
ms.custom: template-concept
---

# Store and use your own license keys

Azure Data Manager for Agriculture supports a range of data ingress connectors to centralize your fragmented accounts. These connections require the customer to populate their credentials in a Bring Your Own License (BYOL) model, so that the data manager may retrieve data on behalf of the customer.

[!INCLUDE [public-preview-notice.md](includes/public-preview-notice.md)]

## Prerequisites

To use BYOL, you need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.


## Overview

In BYOL model, you're  responsible for providing your own licenses for satellite and weather data connectors. In this model, you store the secret part of credentials in a customer managed Azure Key Vault. The URI of the secret must be shared with Azure Data Manager for Agriculture instance. Azure Data Manager for Agriculture instance should be given secrets read permissions so that the APIs can work seamlessly. This process is a one-time setup for each connector. Our Data Manager then refers to and reads the secret from the customers’ key vault as part of the API call with no exposure of the secret.

Flow diagram showing creation and sharing of credentials.
:::image type="content" source="./media/concepts-byol-and-credentials/vault-usage-flow.png" alt-text="Screenshot showing credential sharing flow.":::

Customer can optionally override credentials to be used for a data plane request by providing credentials as part of the data plane API request.

## Sequence of steps for setting up connectors 

### Step 1: Create or use existing Key Vault 
Customers can create a key vault or use an existing key vault to share license credentials for satellite (Sentinel Hub) and weather (IBM Weather). Customer [creates Azure Key Vault](/azure/key-vault/general/quick-create-portal) or reuses existing an existing key vault. 

Enable following properties:

:::image type="content" source="./media/concepts-byol-and-credentials/create-key-vault.png" alt-text="Screenshot showing key vault properties.":::

Data Manager for Agriculture is a Microsoft trusted service and supports private network key vaults in addition to publicly available key vaults. If you put your key vault behind a VNET, then you need to select the `“Allow trusted Microsoft services to bypass this firewall."`

:::image type="content" source="./media/concepts-byol-and-credentials/enable-access-to-keys.png" alt-text="Screenshot showing key vault access.":::

### Step 2: Store secret in Azure Key Vault
For sharing your satellite or weather service credentials, store secret part of credentials in the key vault, for example `ClientSecret` for `SatelliteSentinelHub` and `APIKey` for `WeatherIBM`. Customers are in control of secret name and rotation. 

Refer to [this guidance](/azure/key-vault/secrets/quick-create-portal#add-a-secret-to-key-vault) to store and retrieve your secret from the vault.

:::image type="content" source="./media/concepts-byol-and-credentials/store-your-credential-keys.png" alt-text="Screenshot showing storage of key values.":::

### Step 3: Enable system identity 
As a customer you have to enable system identity for your Data Manager for Agriculture instance. This identity is used while given secret read permissions for Azure Data Manager for Agriculture instance.

Follow one of the following methods to enable:
    
1. Via Azure portal UI

    :::image type="content" source="./media/concepts-byol-and-credentials/enable-system-via-ui.png" alt-text="Screenshot showing usage of UI to enable key.":::

2. Via Azure CLI

    ```azurecli
    az rest --method patch --url /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.AgFoodPlatform/farmBeats/{ADMA_instance_name}?api-version=2023-06-01-preview --body "{'identity': {'type': 'SystemAssigned'}}"
    ``` 

### Step 4: Access policy
Add an access policy in the key vault for your Data Manager for Agriculture instance.
    
1. Go to access policies tab in the key vault.

    :::image type="content" source="./media/concepts-byol-and-credentials/select-access-policies.png" alt-text="Screenshot showing selection of access policy.":::

2. Choose Secret GET and LIST permissions.

    :::image type="content" source="./media/concepts-byol-and-credentials/select-permissions.png" alt-text="Screenshot showing selection of permissions.":::

3. Select the next tab, and then select Data Manager for Agriculture instance name and then select the review + create tab to create the access policy.

    :::image type="content" source="./media/concepts-byol-and-credentials/access-policy-creation.png" alt-text="Screenshot showing selection create and review tab.":::

### Step 5: Invoke control plane API call
Use the [API call](/rest/api/data-manager-for-agri/controlplane-version2023-06-01-preview/data-connectors) to specify connector credentials. Key vault URI/ key name/ key version can be found after creating secret as shown in the following figure.

:::image type="content" source="./media/concepts-byol-and-credentials/details-key-vault.png" alt-text="Screenshot showing where key name and key version is available.":::

#### Following values should be used for the connectors while invoking above APIs:

| Scenario | DataConnectorName | Credentials | 
|--|--|--|
| For Satellite SentinelHub connector | SatelliteSentinelHub | OAuthClientCredentials |
| For Weather IBM connector | WeatherIBM | ApiKeyAuthCredentials |

## Overriding connector details
As part of Data plane APIs, customer can choose to override the connector details that need to be used for that request.

Customer can refer to API version `2023-06-01-preview` documentation where the Data plane APIs for satellite and weather take the credentials as part of the request body.

## How Azure Data Manager for Agriculture accesses secret
Following flow shows how Azure Data Manager for Agriculture accesses secret.
:::image type="content" source="./media/concepts-byol-and-credentials/key-access-flow.png" alt-text="Screenshot showing how the data manager accesses credentials.":::

If you disable and then re-enable system identity, then you have to delete the access policy in key vault and add it again. 

## Conclusion 
You can use your license keys safely by storing your secrets in the Azure Key Vault, enabling system identity and providing read access to our Data Manager. ISV solutions available with our Data Manager also use these credentials.

You can use our data plane APIs and reference license keys in your key vault. You can also choose to override default license credentials dynamically in our data plane API calls. Our Data Manager does basic validations including checking if it can access the secret specified in credentials object or not.

## Next steps

* Test our APIs [here](/rest/api/data-manager-for-agri).
