---
title: Bulk import data into a dataset | Microsoft Azure Maps
description: In this article, you'll learn how to use the Dataset Import API to bulk import data into a dataset. This article also shows you how to upload the data that you want to be imported.
author: farah-alyasari
ms.author: v-faalya
ms.date: 03/13/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Bulk import data into a dataset

This guide will show you how to use the [Dataset Import API]() to bulk import data into a dataset. It will also show you how to upload the data that you want to import into an existing data set.

## Prerequisites

You need to [obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account) by [making an Azure Maps account](quick-demo-map-app.md#create-an-account-with-azure-maps).

In this article, the [Postman](https://www.postman.com/) application is used to call the Azure Maps APIs, but you may use any API development environment.

In this article, we assume that the bulk data you want to import into your existing data set is in GeoJSON format. If it's not, then use the [Azure Maps Conversion]() service to convert your bulk data into GeoJSON.

## Creating an initial data set

The instructions below overview the process of uploading a DWG package, converting the package, and creating a data set from the package. If you already have a data set to import the bulk data into, then skip this section and continue to the next section.

1. Before you upload data into the Azure Maps resources, make sure that your DWG package meets the [DWG package requirements](dwg-requirements.md).

2. Upload your DWG package to the Azure Maps service, and obtain a `udid` for the uploaded package. This procedure is detailed in the [Data Upload section of the Indoor Data Management](indoor-data-management.md#data-upload-process) article.

3. Once you obtain the `udid` for the uploaded packaged, convert the uploaded packaged using the Azure Maps Conversion service, and obtain the conversion `conversionId` for the converted package. This procedure is detailed in the [Data Conversion section of the Indoor Data Management](indoor-data-management.md#data-conversion-process) article.

4. Once you obtain the `conversionId` for the converted package, create an initial data set using the Azure Maps Dataset service, and obtain the `datasetId`. This procedure is detailed in the [Data sets section of the Indoor Data Management](indoor-data-management.md#data-sets) article. Copy the `datasetId`to use in the next section.

## Bulk import data into a dataset

This section assumes that you already have a data set. It shows you how to upload bulk data to Azure services, and then import the bulk data into an existing data set.

1. Prepare your bulk data by placing your GeoJSON files in a zip folder.

2. Open the Postman app. Near the top of the Postman app, select **New**. In the **Create New** window, select **Collection**. Name the collection and select the **Create** button.

3. To create the request, select **New** again. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous step, and then select **save**.

4. Upload your zip folder using the Data Upload API. Select the **POST** HTTP method in the builder tab and enter the following URL. In the **Headers** tab, specify the `Content-Type` key value to `application/octet-stream` because we're uploading a zipped folder.

    ```http
    https://atlas.microsoft.com/mapData/upload?api-version=1.0&dataFormat=zip&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

5. In the **Body** tab, select **binary**. Click on **Select File** and choose the zip folder that contains your bulk data. When you're done, select the blue **Send** button.

    <center>

    ![Upload data folder](./media/how-to-ingest-bulk-data-in-dataset/data-upload.png)

    </center>

6. Upon a successful post request, the response **Headers** tab will contain a **Location** key with a URL. Make a **GET** request at this URL to obtain the `udid` for the successfully uploaded data. The code block below shows the expected format for this URL, and remember to append your Azure Maps key for authentication.

    ```http
    https://atlas.microsoft.com/mapData/operations/<unique-alphanumeric-value>/status?api-version=1.0&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

7. If the get request was successful, the response body will contain the `resourceLocation` element. The upload `udid` is in the URL of the `resourceLocation` element, as seen in the image below. Copy the `udid` for the upload data.

    <center>

    ![Upload data folder](./media/how-to-ingest-bulk-data-in-dataset/upload-id.png)

    </center>

8. Call the [Dataset Import API]() to import bulk data from the zip folder resource to the dataset resource. You'll need the `datasetId` and the `udid` for the uploaded zip folder. Use the `type` parameter key with the `fixture` value. The **PATCH** request URL should look similar to the one below.

    ```http
    https://atlas.microsoft.com/dataset/import/<datasetId>?api-version=1.0&subscription-key=<Azure-Maps-Primary-Subscription-key>&udid=<upload-udid>&type=fixture
    ```

9. After making the **PATCH** request call, you'll receive a response header containing the status URL, highlighted in the image below. You can use this URL to query the status of the import request.

    <center>

    ![Upload data folder](./media/how-to-ingest-bulk-data-in-dataset/status-uri.png)

    </center>

10. To query the status URL, append you Azure Maps subscription key, and make a **GET** request.

    ```http
    https://atlas.microsoft.com/dataset/operations/<unique-alphanumeric-value>?api-version=1.0&subscription-key=TdexqUMLfpcl0Dl9mhBmmVe2g1fqTenJMl3qai-73KE
    ```

11. The response body will contain a status indicating if your data bulk import failed or succeeded. If the request failed, you'll see a message with the error details.

## Next steps

Learn more about the different services mentioned in this article:

> [!div class="nextstepaction"]
> [Azure Maps Data service]()

> [!div class="nextstepaction"]
> [Azure Maps Conversion service]()

> [!div class="nextstepaction"]
> [Azure Maps Dataset service]()
