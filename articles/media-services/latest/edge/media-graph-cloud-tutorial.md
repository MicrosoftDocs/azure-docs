---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Manage Media Graphs in the cloud for RTSP ingest - Azure
titleSuffix: Azure Media Services
description:  
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 02/10/2020
ms.author: juliako

---

# Tutorial: manage Media Graphs in the cloud for RTSP ingest

A **Media Graph** is a new Azure Media Services entity that enables you to receive and archive a stream from an RTSP source.

For details about Media Graph, see [Concept: Media Graph](media-graph-concept.md) and the entity definition in the [Open API specification](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/mediaservices/resource-manager/Microsoft.Media/preview/2019-09-01-preview/MediaGraphs.json).

When you start your Media Graph, the media that is being sent by your RTSP source is being archived in an asset using the new `MediaGraphAssetSink` entity. You can then playback the stream using a player that can stream HLS or DASH formats.

> [!NOTE]
> Review the [Limitations](#limitations).

This topic demonstrates how to manage a Media Graph in the Azure cloud using REST. For information on how to create and manage a Media Graph in Azure IoT Edge, see [How-to: Initial setup for Live Video Analytics on IoT Edge](edge-setup.md)

The tutorial shows you how to:

- Create a Media Services account.
- Access the Media Services API.
- Create a **MediaGraph** using REST.
- Create a streaming URL.
- Test the streaming URL.
- Clean up resources.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Limitations

- RTSP source needs to be on a public IP address / not behind a firewall.
- Current maximum of 24-hour archive
- Max of 50 Media Graphs per Azure Media Services account
- In this preview, cloud ingestion is only supported in the `eastus` region. Storage and Media Services account can be located in any region.
- In this preview, we do not support security options, although you can pass the `username` and `password` credentials.

## Create an Azure Storage account

You will need to have an Azure Storage account created to attach to your Media Services account. You can either use an existing account, or we recommend creating a new storage account using the command below:

```azurecli
az storage account create --name <storage_account_name> --kind StorageV2 --sku Standard_LRS -l <region> -g <resource_group>
```

For additional information on using Storage Accounts with Media Services, see [Create a storage account](https://docs.microsoft.com/azure/media-services/latest/create-account-cli-how-to#create-a-storage-account)

## Create an Azure Media Services account

### Create a Media Services Account

To create an Azure Media Services account, with an attached service principle, use the commands below.

```azurecli
az ams account create --name <media_services_account_name> -g <resource_group> --storage-account <storage_account_name> -l <region>
```

### Create a service principle for the Media Services account

Creates an Azure AD application and attaches a service principal to the Media Services account.

```azurecli
az ams account sp create --account-name <media_services_account_name> --resource-group <resource_group>
```

Take note of the resulting json information displayed to be used during Media Graph configuration, similar to the example below.

```json
{
  "AadClientId": "00000000-0000-0000-0000-000000000000",
  "AadEndpoint": "https://login.microsoftonline.com",
  "AadSecret": "00000000-0000-0000-0000-000000000000",
  "AadTenantId": "00000000-0000-0000-0000-000000000000",
  "AccountName": "media_services_account_name",
  "ArmAadAudience": "https://management.core.windows.net/",
  "ArmEndpoint": "https://management.azure.com/",
  "Region": "region",
  "ResourceGroup": "resource_group",
  "SubscriptionId": "00000000-0000-0000-0000-000000000000"
}
```

## Install and configure Postman files

### Install Postman

Install the [Postman](https://www.getpostman.com/) REST client to execute the REST APIs shown in this tutorial.

> [!NOTE] 
> We are using **Postman** but any REST tool would be suitable. Other alternatives are: **Visual Studio Code** with the REST plugin or **Telerik Fiddler**.

### Access a repository

Clone a GitHub repository that contains the Postman collection and environment files.

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-rest-postman.git
 ```

> [!NOTE]
> After cloning the `https://github.com/Azure-Samples/media-services-v3-rest-postman.git` repository, make sure to switch to the `lva-preview` branch that contains calls to the Media Graph APIs.

### Configure Postman

This section imports and configures the Postman environment and collection files.

#### Configure the environment

1. Open **Postman**.
1. On the right of the screen, select the **Manage environment** option.

    ![Manage env](./media/develop-with-postman/postman-import-env.png)

1. From the **Manage environment** dialog, click **Import**.
1. Browse to the `Azure Media Service v3 Environment.postman_environment.json` file that was downloaded when you cloned `https://github.com/Azure-Samples/media-services-v3-rest-postman.git`.
1. The **Azure Media Service v3 Environment** environment is added.

    > [!NOTE] 
    > Make sure to update access variables with values you got from the **Access the Media Services API** section above.
1. Double-click on the selected env file and enter values that you got by following the [accessing API](#create-a-service-principle-for-the-media-services-account) steps. <!-- replace and add with a better image ./media/develop-with-postman/configure-env.png -->
1. Close the dialog.
1. Select the **Azure Media Service v3 Environment** environment from the dropdown.

    ![Choose env](./media/develop-with-postman/choose-env.png)

#### Configure the collection

1. Click **Import** to import the collection file.
1. Browse to the `Media Services v3.postman_collection.json` file that was downloaded when you cloned `https://github.com/Azure-Samples/media-services-v3-rest-postman.git`
1. Choose the **Media Services v3.postman_collection.json** file.

## Create a Media Graph with REST

This section shows what HTTP requests should be sent to create and manage a MediaGraph object. It also shows how to create URLs so you can stream your content.

> [!NOTE]
> In the following HTTP requests you will notice items that are preceded by a colon “:”. These items represent variables defined in your environment json file. For example `https://login.microsoftonline.com/:tenantId/oauth2/token`.

### Get Azure AD Token

1. In the left window of the Postman app, select "Step 1: Get AAD Auth token".
1. Then, select "Get Azure AD Token for Service Principal Authentication".
1. Press **Send**.

    The following **POST** operation is sent.

    ```
    https://login.microsoftonline.com/:tenantId/oauth2/token
    ```

1. The response comes back with the token and sets the `AccessToken` environment variable to the token value. To see the code that sets `AccessToken`, click on the **Tests** tab.

    ```json
    {
        "token_type": "Bearer",
        "expires_in": "3600",
        "ext_expires_in": "3600",
        "expires_on": "1571376416",
        "not_before": "1571372516",
        "resource": "https://management.core.windows.net/",
        "access_token": "<access token value>"
    }
    ```

### Start a streaming endpoint

Later in this article you will be streaming the recorded video back using the Apple HLS protocol. To enable streaming, you first have to start the [streaming endpoint](https://docs.microsoft.com/azure/media-services/latest/streaming-endpoint-concept) from which you want to stream the video.

> [!NOTE]
> You are only billed when your streaming endpoint is in the running state.

1. In the left window of the Postman app, select "Streaming and Live".
1. Then, select "Start StreamingEndpoint".
1. Press **Send**.

    - The following **POST** operation is sent:

        ```
        https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaservices/:accountName/streamingEndpoints/:streamingEndpointName/start?api-version={{api-version}}
        ```
    - If the request is successful, the `Status: 202 Accepted` is returned.

        This status means that the request has been accepted for processing; however, the processing has not been completed. You can query for the operation status based on the value in the `Azure-AsyncOperation` response header.

        For example, the following GET operation returns the status of your operation:

        `https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/<resourceGroupName>/providers/Microsoft.Media/mediaservices/<accountName>/streamingendpointoperations/1be71957-4edc-4f3c-a29d-5c2777136a2e?api-version=2018-07-01`

        The [track asynchronous Azure operations](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-async-operations) article explains in depth how to track the status of asynchronous Azure operations through values returned in the response.

### Create an asset for archiving

This section shows how to create an [asset](https://docs.microsoft.com/azure/media-services/latest/assets-concept) that you will later associate with `MediaGraphAssetSink`. Your Media Graph stream is archived into this asset. 

1. In the left window of the Postman app, select "Assets".
1. Then, select "Create or update an Asset".
1. Press **Send**.

    - The following **PUT** operation is sent:

        ```
        https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaServices/:accountName/assets/:assetName?api-version={{api-version}}
        ```

    - The operation has a body. In this example, we just set the description:

        ```json
        {
        "properties": {
            "description": "My Media Graph asset"
         }
        }
        ```

    - If the request is successful, the `Status: 200 OK` is returned with a response similar to the following:

        ```json
        {
          "name": "testAsset1",
          "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/<resourceGroupName>/providers/Microsoft.Media/mediaservices/<accountName>/assets/testAsset1",
          "type": "Microsoft.Media/mediaservices/assets",
          "properties": {
            "assetId": "8b96e9cc-e53d-4910-b253-b6f2d78c23bf",
            "created": "2019-10-16T06:09:52.61Z",
            "lastModified": "2019-10-18T06:55:57.807Z",
            "description": "My Media Graph asset",
            "container": "asset-8b96e9cc-e53d-4910-b253-b6f2d78c23bf",
            "storageAccountName": "<storageAccountName>",
            "storageEncryptionFormat": "None"
          }
        }
        ```

### Create a Media Graph

1. In the left window of the Postman app, select "Media Graphs".
1. Then, select "Create or update a Media Graph (password authenticated)".

    > [!NOTE]
    > Currently, the MediaGraph's create and update operations are synchronous.
1. Press **Send**.

    - The following **PUT** operation is sent:

        ```
        https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaServices/:accountName/mediaGraphs/:mediaGraphName?api-version={{api-version-lva}}
        ```

    - The operation has a body where you set the `MediaGraphRtspSource` source and the asset's name you want to archive your source into.

        ```json
        {
            "properties": {
                "description": "My Media Graph",
                "sources": [
                    {
                        "@odata.type": "#Microsoft.Media.MediaGraphRtspSource",
                        "name": "rtspSource",
                        "rtspUrl": "rtsp:<your url>",
                        "credentials": {
                            "username": "exampleusername",
                            "password": "examplepassword"
                        }
                    }
                ],
                "sinks": [
                    {
                        "@odata.type": "#Microsoft.Media.MediaGraphAssetSink",
                        "name": "AssetSink",
                        "inputs": [
                            "rtspSource"
                        ],
                        "assetName": "testAsset1"
                    }
                ]
            }
        }
        ```

    - If the request is successful, the `Status: 200 OK` is returned with a response similar to the following:

        ```json
        {
          "name": "testMediaGraph",
          "properties": {
            "description": "My first Media Graph",
            "state": "Stopped",
            "created": "2019-10-17T22:32:58.5233333Z",
            "lastModified": "2019-10-17T22:32:58.5233333Z",
            "sources": [
              {
                "@odata.type": "#Microsoft.Media.MediaGraphRtspSource",
                "name": "rtspSource",
                "rtspUrl": "rtsp://<your url>"
              }
            ],
            "sinks": [
              {
                "@odata.type": "#Microsoft.Media.MediaGraphAssetSink",
                "name": "AssetSink",
                "inputs": [
                  "rtspSource"
                ],
                "assetName": "testAsset1"
              }
            ]
          }
        }
        ```

To start pulling the content from your RTSP camera source and to begin archiving it into the asset, you need to start the Media Graph, as described in the next section.

### Start a Media Graph

1. In the left window of the Postman app, select "Media Graphs".
2. Then, select "Start a Media Graph".
3. Press **Send**.

    - The following **POST** operation is sent:

        ```
        https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaServices/:accountName/mediaGraphs/:mediaGraphName/start?api-version={{api-version-lva}}
        ```

    - If the request is successful, the `Status: 202 Accepted` is returned.

        This status means that the request has been accepted for processing; however, the processing has not been completed. You can query for the operation status based on the value in the `Azure-AsyncOperation` response header.

        The [track asynchronous Azure operations](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-async-operations) article explains in depth how to track the status of asynchronous Azure operations through values returned in the response.

        If you switch to the **Test** tab, you will see how this Postman collection extracts the value of the `Azure-AsyncOperation` response header and assigns the values to the `operationStatus` environment var. The following section shows how to get the status of the operation.

### Get the status of the start operation

1. In the left window of the Postman app, select "Media Graphs".
2. Then, select "Get a Media Graph async operation status".
3. Press **Send**.

    - The `GET {{operationStatus}}` operation is sent:

        In this case, the `operationStatus` value is `https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/<resourceGroupName>/providers/Microsoft.Media/mediaservices/<accountName>/mediaGraphs/testMediaGraph/operationsStatus/ddacd176-928d-4e59-8623-e838be8212c5?api-version=2019-09-01-preview`

    - If the request is successful, the `Status: 200 OK` is returned with a response similar to the following:

        ```json
        {
          "name": "ddacd176-928d-4e59-8623-e838be8212c5",
          "status": "Succeeded"
        }
        ```

### Create a streaming locator

After the encoding job is complete, the next step is to make the video in the output **Asset** available to clients for playback. You can accomplish this in two steps: first, create a [StreamingLocator](https://docs.microsoft.com/rest/api/media/streaminglocators), and second, build the streaming URLs that clients can use.

The process of creating a streaming locator is called publishing. By default, the streaming locator is valid immediately after you make the API calls, and lasts until it is deleted, unless you configure the optional start and end times.

When creating a [StreamingLocator](https://docs.microsoft.com/rest/api/media/streaminglocators), you need to specify the desired **StreamingPolicyName**. In this example, you will be streaming in-the-clear (or non-encrypted) content, so the predefined clear streaming policy "Predefined_ClearStreamingOnly" is used.

> [!IMPORTANT]
> When using a custom [StreamingPolicy](https://docs.microsoft.com/rest/api/media/streamingpolicies), you should design a limited set of such policies for your Media Service account, and re-use them for your StreamingLocators whenever the same encryption options and protocols are needed. 

Your Media Service account has a quota for the number of **Streaming Policy** entries. You should not be creating a new **Streaming Policy** for each streaming locator.

1. In the left window of the Postman app, select "Streaming Policies and Locators".
1. Then, select "Create a Streaming Locator (clear)".
1. Press **Send**.

    - The following **PUT** operation is sent.

        ```
        https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaServices/:accountName/streamingLocators/:streamingLocatorName?api-version={{api-version}}
        ```

    - The operation has the following body:

        ```json
        {
          "properties": {
            "streamingPolicyName": "Predefined_ClearStreamingOnly",
            "assetName": "testAsset1",
            "contentKeys": [],
            "filters": []
         }
        }
        ```

### List paths and build streaming URLs

#### List paths

Now that the [Streaming Locator](https://docs.microsoft.com/rest/api/media/streaminglocators) has been created, you can get the streaming URLs.

1. In the left window of the Postman app, select "Streaming Policies".
1. Then, select "List Paths".
1. Press **Send**.

    - The following **POST** operation is sent.

        ```
        https://management.azure.com/subscriptions/:subscriptionId/resourceGroups/:resourceGroupName/providers/Microsoft.Media/mediaServices/:accountName/streamingLocators/:streamingLocatorName/listPaths?api-version={{api-version}}
        ```

    - The operation has no body:
1. Note the "HLS" path you will use for streaming in the next section. In this case, the following paths were returned:

    ``` json
    "streamingPaths": [
        {
            "streamingProtocol": "Hls",
            "encryptionScheme": "NoEncryption",
            "paths": [
                "/cdb80234-1d94-42a9-b056-0eefa78e5c63/Ignite-short.ism/manifest(format=m3u8-aapl)"
            ]
        },
        {
            "streamingProtocol": "Dash",
            "encryptionScheme": "NoEncryption",
            "paths": [
                "/cdb80234-1d94-42a9-b056-0eefa78e5c63/Ignite-short.ism/manifest(format=mpd-time-csf)"
            ]
        },
        {
            "streamingProtocol": "SmoothStreaming",
            "encryptionScheme": "NoEncryption",
            "paths": [
                "/cdb80234-1d94-42a9-b056-0eefa78e5c63/Ignite-short.ism/manifest"
            ]
        }
    ]
    ```

If for some reason your content is not being archived into the asset, there won’t be any paths listed (because the asset container is empty).

#### Build the streaming URLs

In this section, let's build an HLS URL. URLs consist of the following values:

1. The protocol over which data is sent. In this case "https".

    > [!NOTE]
    > If a player is hosted on an https site, make sure to update the URL to "https".
1. Streaming Endpoint hostname. In this case, the name is "amsaccount-usea.streaming.media.azure.net".

    To get the hostname, you can use the following GET operation:

    ```
    https://management.azure.com/subscriptions/00000000-0000-0000-0000-0000000000000/resourceGroups/amsResourceGroup/providers/Microsoft.Media/mediaservices/amsaccount/streamingEndpoints/default?api-version={{api-version}}
    ```

1. The path that you retrieved in the previous List paths section for the “HLS” streaming protocol. Append `.m3u8` to the URL.

As a result, the following HLS URL was built

```
https://amsaccount-usea.streaming.media.azure.net/fad5dd84-3bd6-4d7c-b594-48a513730d3d/manifest.ism/manifest(format=m3u8-aapl).m3u8
```

## Test the streaming URL

> [!NOTE]
> Make sure the streaming endpoint from which you want to stream is running.

To test the stream, you can paste the earlier created HLS URL in Safari or use an HLS player of your choice.

## Clean up resources when finished

After you are done using the product, generally you should clean up everything except objects that you are planning to reuse. If you want your account to be clean after experimenting, you should delete the resources that you do not plan to reuse.

- To delete a single resource, follow the instructions for [az resource delete](https://docs.microsoft.com/cli/azure/resource?view=azure-cli-latest#az-resource-delete)
- If you no longer need any of the resources in your resource group, including the Media Services and storage accounts you created for this tutorial, delete the resource group you created earlier. Execute the following CLI command:

```azurecli
az group delete --name amsResourceGroup
```

## Billing implications

During the preview, the media graph is not emitting any billing meters. As we reach public preview, we will be announcing the pricing model for both the cloud media graph and the edge.

For Playback, you will start getting billed for playback as soon as you start the Streaming Endpoint. You are also billed for egress bandwidth and storage space.

For more information, see [Billing and availability](faqs.md#billing-and-availability) in the [FAQ: Live Video Analytics](faqs.md).

## See also

- [Sample: Media Graph swagger examples](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/mediaservices/resource-manager/Microsoft.Media/preview/2019-09-01-preview/examples)
- [FAQ: Live Video Analytics](faqs.md)
  
## Next steps

- To set up **Edge ingest**, follow [How-to: Initial setup for Live Video Analytics on IoT Edge](edge-setup.md)
