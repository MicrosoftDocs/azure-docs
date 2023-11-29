---
title: 'Using your data with Azure OpenAI securely'
titleSuffix: Azure OpenAI
description: Use this article to learn about seurely using your data for text generation in Azure OpenAI.
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: how-to
author: aahill
ms.author: aahi
ms.date: 11/29/2023
recommendations: false
---

# Securely use Azure OpenAI on your data

Use this article learn how to use Azure OpenAI on your data securely, for example with virtual networks and private endpoints.

## Data ingestion architecture 

When you ingest data into Azure OpenAI on your data, the following process is used to process the data and store it in blob storage.

:::image type="content" source="../media/use-your-data/ingestion-architecture.png" alt-text="A diagram showing the process of ingesting data." lightbox="../media/use-your-data/ingestion-architecture.png":::

1. The ingestion process is started when a client sends data to be processed.
1. Ingestion assets (indexers, indexes, data sources, a [custom skill](/azure/search/cognitive-search-custom-skill-interface) and container in the search resource) are created in Azure AI Search resource and Azure storage account.
1. If the ingestion is triggered by a [scheduled refresh](../concepts/use-your-data.md#schedule-automatic-index-refreshes-azure-ai-search-only), `[3]` is triggered before the above steps.
1.  Azure OpenAI's `preprocessing-jobs` API implements the [Azure AI Search customer skill web API protocal](https://learn.microsoft.com/en-us/azure/search/cognitive-search-custom-skill-web-api), and processes the documents in a queue. 
1. Azure OpenAI:
    1. Cracks the documents.
    1. Uses a heuristic-based algorithm to perform chunking, honoring table layouts and other formatting elements in the chunk boundary to ensure the best chunking quality.
    1. Uses the current embedding model to vectorize the chunks, if `embeddingDeploymentName` is specified in the request header.
1. Azure OpenAI triggers another indexer.
1. The indexer stores the processed data into an Azure AI Search service.

For the managed identities used in service calls, only system assigned managed identities are supported. User assigned managed identities are not supported.

## Inference architecture

:::image type="content" source="../media/use-your-data/inference-architecture.png" alt-text="A diagram showing the process of using the inference API." lightbox="../media/use-your-data/inference-architecture.png":::

When you send API calls to chat with an Azure OpenAI model on your data, the service needs to retrieve the index fields during inference to perform fields mapping automatically if the fields mapping is not explicitly set in the request. That's why the service requires the Azure OpenAI identity to have the `Search Service Contributor` role for the search service even during inference.



## Resources setup

Use the following sections to set your resources for secure usage.

## Azure OpenAI


### Inbound security: networking
 
You can set the Azure OpenAI service networking by allowing access from the **Selected Networks and Private Endpoints** section in the Azure portal.

:::image type="content" source="../media/use-your-data/networking-azure-portal.png" alt-text="A screenshot showing the networking menu in the Azure portal." lightbox="../media/use-your-data/networking-azure-portal.png":::


If you use [Azure Management REST API](/rest/api/cognitiveservices/accountmanagement/accounts/update), you can set `networkAcls.defaultAction` as `Deny`

```json
...
"networkAcls": {
    "defaultAction": "Deny",
    "ipRules": [
        {
            "value": "4.155.49.0/24"
        }
    ]
},
"privateEndpointConnections": [],
"publicNetworkAccess": "Enabled"
...
```

To use Azure OpenAI Studio, you cannot set `publicNetworkAccess` as `Disabled`, because you need to add your local IP to the IP rules, so Azure OpenAI Studio can call the Azure OpenAI API for both ingestion and inference from your browser.

### Inbound security: trusted service

To allow Azure AI Search to call Azure OpenAI, `preprocessing-jobs` is used as a custom skill web API (see step 4 in the [data ingestion architecture](#data-ingestion-architecture) section). While Azure OpenAI is network restricted, you will need to setup Azure OpenAI to bypass Azure AI Search as a trusted service. Azure OpenAI will identify the traffic from Azure AI Search by verifying the claims in the JSON Web Token (JWT), so Azure AI Search must use the system assigned managed identity authentication to call the custom skill web API. Set `networkAcls.bypass` as `AzureServices` from the management API. See [Virtual networks article](/azure/ai-services/cognitive-services-virtual-networks?tabs=portal#grant-access-to-trusted-azure-services-for-azure-openai) for more information.

### Outbound security: managed identity

To allow other services to recognize Azure OpenAI via Azure Active Directory (Azure AD) authentication, you need to assign a managed identity for your Azure OpenAI service. The easiest way is to toggle on system assigned managed identity on Azure Portal.
:::image type="content" source="../media/use-your-data/openai-managed-identity.png" alt-text="A screenshot showing the system assigned managed identity option in the Azure portal." lightbox="../media/use-your-data/openai-managed-identity.png":::

You can also add a user assigned managed identity, but using user assigned managed identities is only supported by the inference API, not in the ingestion API. Unless you are in an advanced stage of development and ready for production, we recommend using the system assigned managed identity.

To set the managed identities via the management API, see [the management API reference documentation](/rest/api/cognitiveservices/accountmanagement/accounts/update#identity).

```json

"identity": {
    "principalId": "12345678-abcd-1234-5678-abc123def", "tenantId": "1234567-abcd-1234-1234-abcd1234", "type": "SystemAssigned, UserAssigned", 
        "userAssignedIdentities": {
        "/subscriptions/1234-5678-abcd-1234-1234abcd/resourceGroups/my-resource-group",
            "principalId": "12345678-abcd-1234-5678-abcdefg1234", 
            "clientId": "12345678-abcd-efgh-1234-12345678"
        }
    }
```

## Azure AI Search

### Inbound security: authentication
As Azure OpenAI will use managed identity to access Azure AI Search, you need to enable Azure AD based authentication in your Azure AI Search. To do it on Azure portal, select **Both** in the **Keys** tab in the Azure portal.

:::image type="content" source="../media/use-your-data/managed-identity-ai-search.png" alt-text="A screenshot showing the managed identity option for Azure AI search in the Azure portal." lightbox="../media/use-your-data/managed-identity-ai-search.png":::

To enable AAD via REST API, set `authOptions` as `aadOrApiKey`. See the [Azure AI Search RBAC article](/azure/search/search-security-rbac?tabs=config-svc-rest%2Croles-portal%2Ctest-portal%2Ccustom-role-portal%2Cdisable-keys-portal#configure-role-based-access-for-data-plane) for more information.

```json
"disableLocalAuth": false,
"authOptions": { 
    "aadOrApiKey": { 
        "aadAuthFailureMode": "http401WithBearerChallenge"
    }
}
```

To use Azure OpenAI Studio, you cannot disable the API key based authentication for Azure AI Search, because Azure OpenAI Studio uses the API key to call the Azure AI Search API from your browser. For the best security, when you are ready for production and no longer need to use Azure OpenAI Studio for testing, we recommend that you disable the API key. See the [Azure AI Search RBAC article](/azure/search/search-security-rbac?tabs=config-svc-portal%2Croles-portal%2Ctest-portal%2Ccustom-role-portal%2Cdisable-keys-portal#disable-api-key-authentication) for details. 

### Inbound security: networking

Use **Selected networks** in the Azure portal. Azure AI Search doesn't support bypassing trusted services, so it is the most complex part in the setup. Create a private endpoint for theAzure OpenAI on your data (as a multi-tenant service managed by Microsoft), and link it to your Azure AI Search resource. This requires you to submit an [application form](/azure/ai-services/openai/concepts/use-your-data?tabs=ai-search#azure-ai-search-resources).

To use Azure OpenAI Studio, you cannot disable public network access, and you need to add your local IP to the IP rules, because Azure AI Studio calls the search API from your browser to list available indexes.

:::image type="content" source="../media/use-your-data/inbound-networking-security-azure-search.png" alt-text="A screenshot showing the network security for Azure AI search in the Azure portal." lightbox="../media/use-your-data/inbound-networking-security-azure-search.png":::

### Outbound security: managed identity

To allow other services to recognize the Azure AI Search using Azure AD authentication, you need to assign a managed identity for your Azure AI Search service. The easiest way is to toggle the system assigned managed identity in the Azure Portal to **on**.

:::image type="content" source="../media/use-your-data/outbound-managed-identity-ai-search.png" alt-text="A screenshot showing the managed identity setting for Azure AI Search in the Azure portal." lightbox="../media/use-your-data/outbound-managed-identity-ai-search.png":::

User assigned managed identities are not supported.

## Storage account

### Inbound security: networking
In the Azure portal, navigate to your storage account networking tab and select **Enabled from selected virtual networks and IP addresses**.

:::image type="content" source="../media/use-your-data/storage-networking-azure-portal.png" alt-text="A screenshot showing the networking options for Azure storage accounts in the Azure portal." lightbox="../media/use-your-data/storage-networking-azure-portal.png":::

Make sure **Allow Azure services on the trusted services list to access this storage account** is selected, so Azure OpenAI and Azure AI Search can bypass the network restriction of your storage account when using a managed identity for authentication.

To use Azure OpenAI Studio, make sure add your local IP to IP rules, so the Azure OpenAI Studio can upload files to the storage account from your browser.

## Role assignments

So far you have already setup each resource work independently. Next you will need to allow the services to authorize each other. The minimum requirements are listed below.

|Role| Assignee | Resource | Description |
|--|--|--|--|
| `Search Index Data Reader` | Azure OpenAI | Azure AI Search | Inference service queries the data from the index.  |
| `Search Service Contributor` | Azure OpenAI | Azure AI Search | Inference service queries the index schema for auto fields mapping. Data ingestion service creates index, data sources, skillset, indexer, and queries the indexer status. |
| `Storage Blob Data Contributor` | Azure OpenAI | Storage Account | Reads from the input container, and writes the pre-process result to the output container. |
| `Cognitive Services OpenAI Contributor` | Azure AI Search | Azure OpenAI | Custom skill |
| `Storage Blob Data Contributor` | Azure AI Search | Storage Account | Reads blob and writes knowledge store |
| `Cognitive Services OpenAI Contributor` | Signed-in User | Azure OpenAI | Calls public ingestion or inference API from Azure OpenAI Studio.|

See the [Azure RBAC documentation](/azure/role-based-access-control/role-assignments-portal) for instructions on setting these roles in the Azure portal. You can use the [available script onGitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/blob/main/scripts/role_assignment.sh) to add the role assignments programmatically. You need to have the `Owner` role on these resources to do role assignments.

## Using the API


### Local test setup

Make sure your login credential has `Cognitive Services OpenAI Contributor` role on your Azure OpenAI resource. 

:::image type="content" source="../media/use-your-data/api-local-test-setup-credential.png" alt-text="A screenshot showing roles for accounts in the Azure portal." lightbox="../media/use-your-data/api-local-test-setup-credential.png":::

Also, make sure that the IP your development machine is whitelisted in the IP rules, so you can call the Azure OpenAI API.

:::image type="content" source="../media/use-your-data/ip-rules-azure-portal.png" alt-text="A screenshot showing roles for accounts in the Azure portal." lightbox="../media/use-your-data/ip-rules-azure-portal.png":::

## Ingestion API


See the [ingestion API reference article](/azure/ai-services/openai/reference#start-an-ingestion-job) for details on the request and response objects used by the ingestion API.   

Additional notes:

* `JOB_NAME` in the API path will be used as the index name in Azure AI Search.
* Use the `Authorization` header rather than api-key.
* Explicitly set `storageEndpoint` header, this is required if the `storageConnectionString` is in keyless format. It starts with `ResourceId=`.
* Use `ResourceId=` format for `storageConnectionString`. This indicates that Azure OpenAI and Azure AI Search will use managed identity to authenticate the storage account, which is required to bypass network restrictions.
* **Do not** set the `searchServiceAdminKey` header. The system-assigned identity of the Azure OpenAI resource will be used to authenticate Azure AI Search.
* **Do not** set `embeddingEndpoint` or `embeddingKey`. Instead, use the `embeddingDeploymentName` header to enable text vectorization.


**Submit job example**

```bash
accessToken=$(az account get-access-token --resource https://cognitiveservices.azure.com/ --query "accessToken" --output tsv)
curl -i -X PUT https://wednesday-tip-vnet.openai.azure.com/openai/extensions/on-your-data/ingestion-jobs/vpn1025a?api-version=2023-10-01-preview \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $accessToken" \
-H "storageEndpoint: https://wednesdaypdtvpn.blob.core.windows.net/" \
-H "storageConnectionString: ResourceId=/subscriptions/e54a2925-af7f-4b05-9ba1-2155c5fe8a8e/resourceGroups/rg-project-wednesday/providers/Microsoft.Storage/storageAccounts/wednesdaypdtvpn" \
-H "storageContainer: azuredoc-5" \
-H "searchServiceEndpoint: https://wednesdaypdtvpn.search.windows.net" \
-H "embeddingDeploymentName: ada" \
-d \
'
{
}
'
```

**Get job status example**

```bash
accessToken=$(az account get-access-token --resource https://cognitiveservices.azure.com/ --query "accessToken" --output tsv)
curl -i -X GET https://wednesday-tip-vnet.openai.azure.com/openai/extensions/on-your-data/ingestion-jobs/vpn1025a?api-version=2023-10-01-preview \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $accessToken"
```

## Inference API

See the [inference API reference article](/azure/ai-services/openai/reference#completions-extensions) for details on the request and response objects used by the inference API.   

Additional notes:

* **Do not** set `dataSources[0].parameters.key`. The service will use system assigned managed identity to authenticate the Azure AI Search.
* **Do not** set `embeddingEndpoint` or `embeddingKey`. Instead, to enable vector search (with `queryType` set properly), use `embeddingDeploymentName`.

Example:

```bash
accessToken=$(az account get-access-token --resource https://cognitiveservices.azure.com/ --query "accessToken" --output tsv)
curl -i -X POST https://wednesday-test-usnc.openai.azure.com/openai/deployments/turbo/extensions/chat/completions?api-version=2023-10-01-preview \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $accessToken" \
-d \
'
{
    "dataSources": [
        {
            "type": "AzureCognitiveSearch",
            "parameters": {
                "endpoint": "https://wednesday-test.search.windows.net",
                "indexName": "unit-test-vector-index",
                "queryType": "vector",
                "embeddingDeploymentName": "ada"
            }
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "Who is the primary DRI for QnA v2 Authoring service?"
        }
    ]
}
'
```

# Azure OpenAI Studio

You should be able to use all Azure OpenAI Studio features, including both ingestion and inference.

# Web app
The web app published from the Studio will communicate with Azure OpenAI. If Azure OpenAI is network restricted, the web app need to be setup correctly for outbound networking.

1. Set Azure OpenAI allow inbound traffic from your virtual network.

    :::image type="content" source="../media/use-your-data/web-app-configure-inbound-traffic.png" alt-text="A screenshot showing inbound traffic configuration for the web app." lightbox="../media/use-your-data/web-app-configure-inbound-traffic.png":::

1. Configure the web app for outbound virtual network integration

    :::image type="content" source="../media/use-your-data/web-app-configure-outbound-traffic.png" alt-text="A screenshot showing outbound traffic configuration for the web app." lightbox="../media/use-your-data/web-app-configure-outbound-traffic.png":::


