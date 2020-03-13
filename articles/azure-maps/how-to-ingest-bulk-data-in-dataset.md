---
title: Bulk import data into a dataset | Microsoft Azure Maps
description: In this article, you'll learn how to use the Dataset Import API to bulk import data into a dataset. It will also show you how to upload the data that you want to be imported.
author: farah-alyasari
ms.author: v-faalya
ms.date: 03/13/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Bulk import data into a dataset

This guide will show you how to use the [Dataset Import API]() to bulk import data into a dataset. It will also show you how to upload the data that you want to be imported.

## Prerequisites

You need to [obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account) by [making an Azure Maps account](quick-demo-map-app.md#create-an-account-with-azure-maps). The primary subscription key is a required parameter for all Azure Maps APIs, including the indoor maps APIs.

In this article, the [Postman](https://www.postman.com/) application is used to call the Azure Maps APIs, but you may use any API development environment.

Before you feed data into the Azure Maps resources, make sure that your DWG package meets to the [DWG package requirements](dwg-requirements.md).

## Creating an initial data set

The instructions below start with the overview the process of uploading, converting a DWG package, and creating a data set. If you already have a data set to import the bulk data into, then skip this section and continue to the next section.

1. Upload a DWG package to the Azure Maps service, and obtain a `udid` of the uploaded package. This procedure is detailed in the [Data Upload section of the Indoor Data Management](indoor-data-management.md#data-upload-process) article.

2. Once you obtain the uploaded packaged `udid`, convert the uploaded packaged using the conversion service, and obtain the conversion `udid` of the converted package. This ID may also be called the conversion ID. Similar to the previous step, this procedure is detailed in the [Data Conversion section of the Indoor Data Management](indoor-data-management.md#data-conversion-process) article.

3. Create an initial data set, and obtain the data set ID, also known as the data set `udid`. For more information on how to obtain the data set ID, see the [Data sets section of the Indoor Data Management](indoor-data-management.md#Data-sets) article. Copy the data set ID to use in the next section.

## Bulk import data into a dataset

This section assumes that you already have a data set. It shows you how to import bulk data into an existing data set.

1. Prepare your bulk data by placing your GeoJSON files in a zip folder.

2. Open the Postman app. Near the top of the Postman app, select **New**. In the **Create New** window, select **Collection**. Name the collection and select the **Create** button.

3. To create the request, select **New** again. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous step, and then select **save**.

4. Upload your zip folder using the Data Upload API. Select the **POST** HTTP method in the builder tab and enter the URL below. In the **Headers** tab, specify a value for the `Content-Type` key to be `application/vnd.geo+json`

    ```http
    https://atlas.microsoft.com/mapData/upload?api-version=1.0&dataFormat=zip&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

5. In the **Body** tab, select **binary**. Click on **Select File** and choose the zip folder that contains your bulk data. When you're done, select the blue **Send** button.

    <center>

    ![Upload data folder](./media/how-to-ingest-bulk-data-in-dataset/data-upload.png)

    </center>

6. Upon a successful post request, the response **Headers** tab will contain a **Location** key with a URL. Make a **GET** request at this URL to obtain the zip folder ID, also known as the upload `udid`. The code block below shows the expected format for this URL, and remember to append your Azure Maps key for authentication.

    ```http
    https://atlas.microsoft.com/mapData/<unique-alphanumeric-value>/status?api-version=1.0&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

7. If the get request was successful, the response body will contain the `resourceLocation` element. The upload `udid` is in the URL of the `resourceLocation` element, as seen in the image below. Copy the upload ID for this zip folder.

    <center>

    ![Upload data folder](./media/how-to-ingest-bulk-data-in-dataset/upload-id.png)

    </center>

8. Call the [Dataset Import API]() to import bulk data from the zip folder resource to the dataset resource. You'll need the data set ID and the zip folder upload ID, to import the zip folder data into the data set. For the `type` parameter, use the `fixture` value. The **PATCH** request URL should look similar to the one below.

    ```http
    https://atlas.microsoft.com/dataset/import/<datasetId>?api-version=1.0&subscription-key=<Azure-Maps-Primary-Subscription-key>&udid=<upload-udid>&type=fixture
    ```

9. After making the **PATCH** request call, you'll receive a response header containing the status URL, highlighted in the image below. You can use this URL to query the status of the import request.

    <center>

    ![Upload data folder](./media/how-to-ingest-bulk-data-in-dataset/status-uri.png)

    </center>

10. To query the status URL, append you Azure Maps subscription key, and make a **GET** request. The response body lets you know, if your data bulk import failed or succeeded. If it failed, you'll see a message with more details.

    ```http
    https://atlas.microsoft.com/dataset/operations/<unique-alphanumeric-value>?api-version=1.0&subscription-key=TdexqUMLfpcl0Dl9mhBmmVe2g1fqTenJMl3qai-73KE
    ```

## Next steps

Learn more about the different APIs mentioned in this application:

> [!div class="nextstepaction"]
> [Data Upload API]()

> [!div class="nextstepaction"]
> [Conversion API]()

> [!div class="nextstepaction"]
> [Dataset API]()

> [!div class="nextstepaction"]
> [Dataset Import API]()