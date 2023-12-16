---
title: 'Using your data with Azure OpenAI securely'
titleSuffix: Azure OpenAI
description: Use this article to learn about securely using your data for text generation in Azure OpenAI.
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

Use this article to learn how to use Azure OpenAI on Your Data securely by protecting data and resources with Microsoft Entra ID role based access control, virtual networks and private endpoints.

This article is only applicable for [text data / model](/azure/ai-services/openai/concepts/use-your-data), not applicable for [image data / model](/azure/ai-services/openai/concepts/use-your-image-data).

## Data ingestion architecture 

When you use Azure OpenAI on your data to ingest data into Azure AI Search, the following process is used to process the data and store it in blob storage and Azure AI Search. This applies to the following data sources:
* Azure blob storage
* Local files
* URLs

:::image type="content" source="../media/use-your-data/ingestion-architecture.png" alt-text="A diagram showing the process of ingesting data." lightbox="../media/use-your-data/ingestion-architecture.png":::

* The first 2 steps are only used for file upload.
* Downloading URLs to your blob storage is not illustrated on this diagram. After the web pages are downloaded from Internet, and uploaded to blob storage, everything is the same from step 3.
* Ingestion assets, including 2 indexers, 2 indexes, 2 data sources, a [custom skill](/azure/search/cognitive-search-custom-skill-interface) are created in the Azure AI Search resource, and the chunk container is created in the blob storage.
* If the ingestion is triggered by a [scheduled refresh](../concepts/use-your-data.md#schedule-automatic-index-refreshes), the ingestion process starts from step `[7]`.
*  Azure OpenAI's `preprocessing-jobs` API implements the [Azure AI Search customer skill web API protocol](/azure/search/cognitive-search-custom-skill-web-api), and processes the documents in a queue. 
* Azure OpenAI:
    1. Internally uses the first indexer created earlier to crack the documents.
    1. Uses a heuristic-based algorithm to perform chunking, honoring table layouts and other formatting elements in the chunk boundary to ensure the best chunking quality.
    1. If you choose to enable vector search, uses the selected embedding deployment to vectorize the chunks within your Azure OpenAI.
* When all the data that the service is monitoring are processed, Azure OpenAI triggers the second indexer.
* The indexer stores the processed data into an Azure AI Search service.

For the managed identities used in service calls, only system assigned managed identities are supported. User assigned managed identities aren't supported.

## Inference architecture

:::image type="content" source="../media/use-your-data/inference-architecture.png" alt-text="A diagram showing the process of using the inference API." lightbox="../media/use-your-data/inference-architecture.png":::

When you send API calls to chat with an Azure OpenAI model on your data, the service needs to retrieve the index fields during inference to perform fields mapping automatically if the fields mapping isn't explicitly set in the request. Therefore the service requires the Azure OpenAI identity to have the `Search Service Contributor` role for the search service even during inference.

If embedding deployment is provided in the inference request, the rewritten query will be vectorized within your Azure OpenAI, and send both query and vector to Azure AI Search for vector search.


## Resources configuration

Use the following sections to configure your resources for the best secure usage. If you plan to only secure part of your resources, you can skip unrelated sections.

## Create resource group

Create a resource group, so you can organize all resources below. To clean up all the resources afterward, you can easily delete the resource group. The resources in the resource group will include but not limited to:
* 1 Virtual network
* 3 key services: 1 Azure OpenAI, 1 Azure AI Search, 1 Storage Account
* 3 Private endpoints, each is linked to one key service above
* 3 Network interfaces, each is associated with one private endpoint above
* 1 Virtual network gateway, for the access from on-premises client machines
* 1 Web App with virtual network integrated
* 1 Private DNS zone, so the Web App find the IP of your Azure OpenAI

## Create virtual network

The virtual network will have 3 subnets. 

1. The first subnet is created by you, and will be used for the private IPs of the 3 private endpoints.
1. The second subnet will be created automatically when you create the virtual network gateway. See the virtual network architecture below. 
1. The third subnet will be created as an empty one for Web App outbound virtual network integration.

See the diagram below:

:::image type="content" source="../media/use-your-data/virtual-network.png" alt-text="A diagram showing the virtual network architecture." lightbox="../media/use-your-data/virtual-network.png":::

Please note the Microsoft managed virtual network is created by Microsoft, and you cannot see it. That is used for Azure OpenAI to securely access your Azure AI Search.

## Configure Azure OpenAI

### Enabled custom subdomain.

If you created the Azure OpenAI via Azure portal, the [custom subdomain](/azure/ai-services/cognitive-services-custom-subdomains) should had been created already. The custom subdomain is required for Microsoft Entra ID based authentication, and private DNS zone.

### Enable managed identity

To allow your Azure AI Search and Storage Account to recognize your Azure OpenAI service via Microsoft Entra ID authentication, you need to assign a managed identity for your Azure OpenAI service. The easiest way is to toggle on system assigned managed identity on Azure portal.
:::image type="content" source="../media/use-your-data/openai-managed-identity.png" alt-text="A screenshot showing the system assigned managed identity option in the Azure portal." lightbox="../media/use-your-data/openai-managed-identity.png":::

> [!NOTE]
> User assigned managed identities is only supported by the inference API, not in the ingestion API.

To set the managed identities via the management API, see [the management API reference documentation](/rest/api/cognitiveservices/accountmanagement/accounts/update#identity).

```json

"identity": {
  "principalId": "12345678-abcd-1234-5678-abc123def",
  "tenantId": "1234567-abcd-1234-1234-abcd1234",
  "type": "SystemAssigned, UserAssigned", 
  "userAssignedIdentities": {
    "/subscriptions/1234-5678-abcd-1234-1234abcd/resourceGroups/my-resource-group",
    "principalId": "12345678-abcd-1234-5678-abcdefg1234", 
    "clientId": "12345678-abcd-efgh-1234-12345678"
  }
}
```

### Enable trusted service

To allow your Azure AI Search to call your Azure OpenAI `preprocessing-jobs` as custom skill web API, while Azure OpenAI has no public network access, you need to set up Azure OpenAI to bypass Azure AI Search as a trusted service based on managed identity. Azure OpenAI will identify the traffic from your Azure AI Search by verifying the claims in the JSON Web Token (JWT). Azure AI Search must use the system assigned managed identity authentication to call the custom skill web API. 

Set `networkAcls.bypass` as `AzureServices` from the management API. See [Virtual networks article](/azure/ai-services/cognitive-services-virtual-networks?tabs=portal#grant-access-to-trusted-azure-services-for-azure-openai) for more information.

### Disable public network access

You can disable public network access of your Azure OpenAI resource in the Azure portal. 

To allow access to your Azure OpenAI service from your client machines, like using Azure OpenAI Studio, you need to create [private endpoint connections](/azure/ai-services/cognitive-services-virtual-networks?tabs=portal#use-private-endpoints) that connect to your Azure OpenAI resource.


## Configure Azure AI Search

### Enable managed identity

To allow your Azure OpenAI services and Storage Account to recognize the Azure AI Search using Microsoft Entra ID authentication, you need to assign a managed identity for your Azure AI Search service. The easiest way is to toggle on the system assigned managed identity in the Azure portal.

:::image type="content" source="../media/use-your-data/outbound-managed-identity-ai-search.png" alt-text="A screenshot showing the managed identity setting for Azure AI Search in the Azure portal." lightbox="../media/use-your-data/outbound-managed-identity-ai-search.png":::

User assigned managed identities aren't supported by ingestion API.

### Enable role-based access control
As Azure OpenAI will use managed identity to access Azure AI Search, you need to enable role-based access control in your Azure AI Search. To do it on Azure portal, select **Both** in the **Keys** tab in the Azure portal.

:::image type="content" source="../media/use-your-data/managed-identity-ai-search.png" alt-text="A screenshot showing the managed identity option for Azure AI search in the Azure portal." lightbox="../media/use-your-data/managed-identity-ai-search.png":::

To enable role-based access control via the REST API, set `authOptions` as `aadOrApiKey`. See the [Azure AI Search RBAC article](/azure/search/search-security-rbac?tabs=config-svc-rest%2Croles-portal%2Ctest-portal%2Ccustom-role-portal%2Cdisable-keys-portal#configure-role-based-access-for-data-plane) for more information.

```json
"disableLocalAuth": false,
"authOptions": { 
    "aadOrApiKey": { 
        "aadAuthFailureMode": "http401WithBearerChallenge"
    }
}
```

To use Azure OpenAI Studio, you can't disable the API key based authentication for Azure AI Search, because Azure OpenAI Studio uses the API key to call the Azure AI Search API from your browser. 

> [!TIP]
> For the best security, when you are ready for production and no longer need to use Azure OpenAI Studio for testing, we recommend that you disable the API key. See the [Azure AI Search RBAC article](/azure/search/search-security-rbac?tabs=config-svc-portal%2Croles-portal%2Ctest-portal%2Ccustom-role-portal%2Cdisable-keys-portal#disable-api-key-authentication) for details. 

### Disable public network access

You can disable public network access of your Azure AI Search resource in the Azure portal. 

To allow access to your Azure AI Search service from your client machines, like using Azure OpenAI Studio, you need to create [private endpoint connections](/azure/search/service-create-private-endpoint) that connect to your Azure AI Search resource.

To allow access to your Azure AI Search service from Azure OpenAI service, you need to submit an [application form](https://aka.ms/applyacsvpnaoaioyd). The application will be reviewed in ten business days and you will be contacted via email about the results. If you are eligible, we will provision the private endpoint in Microsoft managed virtual network, and send a private endpoint connection request to your search service, and you will need to approve the request.

:::image type="content" source="../media/use-your-data/approve-private-endpoint.png" alt-text="A screenshot showing private endpoint approval screen." lightbox="../media/use-your-data/approve-private-endpoint.png":::

Learn more about the [manual approval workflow](/azure/private-link/private-endpoint-overview#access-to-a-private-link-resource-using-approval-workflow).


## Configure Storage Account

### Enable trusted service

To allow access to your Storage Account from Azure OpenAI and Azure AI Search, while the Storage Account has disabled public network access, you need to set up Storage Account to bypass your Azure OpenAI and Azure AI Search as [trusted services based on managed identity](/azure/storage/common/storage-network-security?tabs=azure-portal#trusted-access-based-on-a-managed-identity).

In the Azure portal, navigate to your storage account networking tab, choose "Selected networks", and then select **Allow Azure services on the trusted services list to access this storage account** and click Save.

### Disable public network access

You can disable public network access of your Storage Account in the Azure portal. 

To allow access to your Storage Account from your client machines, like using Azure OpenAI Studio, you need to create [private endpoint connections](/azure/storage/common/storage-private-endpoints) that connect to your blob storage.



## Role assignments

So far you have already setup each resource work independently. Next you will need to allow the services to authorize each other. The minimum requirements are listed below.

|Role| Assignee | Resource | Description |
|--|--|--|--|
| `Search Index Data Reader` | Azure OpenAI | Azure AI Search | Inference service queries the data from the index. |
| `Search Service Contributor` | Azure OpenAI | Azure AI Search | Inference service queries the index schema for auto fields mapping. Data ingestion service creates index, data sources, skill set, indexer, and queries the indexer status. |
| `Storage Blob Data Contributor` | Azure OpenAI | Storage Account | Reads from the input container, and writes the pre-process result to the output container. |
| `Cognitive Services OpenAI Contributor` | Azure AI Search | Azure OpenAI | Custom skill |
| `Storage Blob Data Contributor` | Azure AI Search | Storage Account | Reads blob and writes knowledge store |
| `Cognitive Services OpenAI Contributor` | Signed-in User | Azure OpenAI | Calls public ingestion or inference API from Azure OpenAI Studio.|
| `Contributor` | Signed-in User | Azure AI Search | List API-Keys to list indexes from Azure OpenAI Studio.|
| `Contributor` | Signed-in User | Storage Account | List Account SAS to upload files from Azure OpenAI Studio.|

In the above table, the `Assignee` means the system assigned managed identity of that resource.

The admin needs to have the `Owner` role on these resources to add role assignments.

See the [Azure RBAC documentation](/azure/role-based-access-control/role-assignments-portal) for instructions on setting these roles in the Azure portal. You can use the [available script on GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/blob/main/scripts/role_assignment.sh) to add the role assignments programmatically.

To enable the developers to use these resources to build applications, the admin need to add the developers identity with the following role assignments to the resources.

|Role| Resource | Description |
|--|--|--|
| `Cognitive Services OpenAI Contributor` | Azure OpenAI | Calls public ingestion API from Azure OpenAI Studio. The `Contributor` role is not enough, because if you only has `Contributor` role, you cannot call data plane API via Microsoft Entra ID authentication, and Microsoft Entra ID authentication is required in the secure setup described in this article. Using API key to call ingestion API will fail. |
| `Contributor` | Azure AI Search | List API-Keys to list indexes from Azure OpenAI Studio.|
| `Contributor` | Storage Account | List Account SAS to upload files from Azure OpenAI Studio.|
| `Contributor` | The resource group or Azure subscription where the developer need to deploy the web app to | Deploy web app to the developer's Azure subscription.|

## Configure Gateway and Client

To access the Azure OpenAI service from your on-premises client machines, one of the approaches is to configure Azure VPN Gateway and Azure VPN Client.

Follow [this guideline](/azure/vpn-gateway/tutorial-create-gateway-portal#VNetGateway) to create virtual network gateway for your virtual network.

Follow [this guideline](/azure/vpn-gateway/openvpn-azure-ad-tenant#enable-authentication) to add point-to-site configuration, and enable Microsoft Entra ID based authentication. Download the Azure VPN Client profile configuration package, unzip, and import the `AzureVPN/azurevpnconfig.xml` file to your Azure VPN client.

:::image type="content" source="../media/use-your-data/vpn-client.png" alt-text="A screenshot showing where to import Azure VPN Client profile." lightbox="../media/use-your-data/vpn-client.png":::

Configure your local machine `hosts` file point your resources host names to the private IPs in your virtual network. The `hosts` is at `C:\Windows\System32\drivers\etc` for Windows, and at `/etc/hosts` on Linux. Example:

```
10.0.0.5 contoso.openai.azure.com
10.0.0.6 contoso.search.windows.net
10.0.0.7 contoso.blob.core.windows.net
```

## Azure OpenAI Studio

You should be able to use all Azure OpenAI Studio features, including both ingestion and inference, from your on-premises client machines.

## Web app
The web app will communicate with your Azure OpenAI. Since your Azure OpenAI has public network disabled, the web app need to be set up to use the private endpoint in your virtual network to access your Azure OpenAI.

The web app needs to resolve your Azure OpenAI host name to the private IP of the private endpoint for Azure OpenAI. So, you need to configure the private DNS zone for your virtual network first.

1. [Create private DNS zone](/azure/dns/private-dns-getstarted-portal#create-a-private-dns-zone) in your resource group. 
1. [Add A-record](/azure/dns/private-dns-getstarted-portal#create-an-additional-dns-record). The IP is the private IP of the private endpoint for your Azure OpenAI resource, and you can get the IP address from the network interface associated with the private endpoint for your Azure OpenAI.
1. [Link the private DNS zone to your virtual network](/azure/dns/private-dns-getstarted-portal#link-the-virtual-network). So the web app integrated in this virtual network can use this private DNS zone.

When deploying the web app from Azure OpenAI Studio, select the same location with the virtual network, and select a SKU that is above `Basic`, so it can support [virtual network integration feature](/azure/app-service/overview-vnet-integration). 

After web app is deployed, from the Azure portal networking tab, configure the web app outbound traffic vitual network integration, choose the third subnet that you reserved for web app.

:::image type="content" source="../media/use-your-data/web-app-configure-outbound-traffic.png" alt-text="A screenshot showing outbound traffic configuration for the web app." lightbox="../media/use-your-data/web-app-configure-outbound-traffic.png":::

## Using the API

Make sure your sign-in credential has `Cognitive Services OpenAI Contributor` role on your Azure OpenAI resource, and run `az login` first.

:::image type="content" source="../media/use-your-data/api-local-test-setup-credential.png" alt-text="A screenshot showing the cognitive services OpenAI contributor role in the Azure portal." lightbox="../media/use-your-data/api-local-test-setup-credential.png":::

### Ingestion API


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
curl -i -X PUT https://my-resource.openai.azure.com/openai/extensions/on-your-data/ingestion-jobs/vpn1025a?api-version=2023-10-01-preview \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $accessToken" \
-H "storageEndpoint: https://mystorage.blob.core.windows.net/" \
-H "storageConnectionString: ResourceId=/subscriptions/1234567-abcd-1234-5678-1234abcd/resourceGroups/my-resource/providers/Microsoft.Storage/storageAccounts/mystorage" \
-H "storageContainer: my-container" \
-H "searchServiceEndpoint: https://mysearch.search.windows.net" \
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
curl -i -X GET https://my-resource.openai.azure.com/openai/extensions/on-your-data/ingestion-jobs/abc1234?api-version=2023-10-01-preview \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $accessToken"
```

### Inference API

See the [inference API reference article](/azure/ai-services/openai/reference#completions-extensions) for details on the request and response objects used by the inference API.   

Additional notes:

* **Do not** set `dataSources[0].parameters.key`. The service will use system assigned managed identity to authenticate the Azure AI Search.
* **Do not** set `embeddingEndpoint` or `embeddingKey`. Instead, to enable vector search (with `queryType` set properly), use `embeddingDeploymentName`.

Example:

```bash
accessToken=$(az account get-access-token --resource https://cognitiveservices.azure.com/ --query "accessToken" --output tsv)
curl -i -X POST https://my-resource.openai.azure.com/openai/deployments/turbo/extensions/chat/completions?api-version=2023-10-01-preview \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $accessToken" \
-d \
'
{
    "dataSources": [
        {
            "type": "AzureCognitiveSearch",
            "parameters": {
                "endpoint": "https://my-search-service.search.windows.net",
                "indexName": "my-index",
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
