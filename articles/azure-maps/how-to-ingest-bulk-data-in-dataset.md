---
title: Bulk import data into a dataset | Microsoft Azure Maps
description: In this article, you'll learn how to use the Dataset Import API to bulk import data into a dataset from data that was uploaded to the Azure Maps Data service
author: farah-alyasari
ms.author: v-faalya
ms.date: 03/13/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Bulk import data into a dataset

This guide will show you how to use the [Dataset Import API]() to bulk import data into a dataset from data that was uploaded to the Azure Maps Data service.

## Prerequisites

You need to [obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account) by [making an Azure Maps account](quick-demo-map-app.md#create-an-account-with-azure-maps). The primary subscription key is a required parameter for all Azure Maps APIs, including the indoor maps APIs.

In this article, the [Postman](https://www.postman.com/) application is used to call the Azure Maps APIs. But, you may use any API development environment.

Before you feed data to the Azure Maps resources, make sure that your DWG package adheres to the [DWG package requirements](dwg-requirements.md).

## Creating an initial data set

The instructions below start with the overview the process of uploading and converting a DWG package. And creating a data set. If you already have a data set to import the bulk data into, then proceed to the next section.

1. Upload a DWG package to the Azure Maps service, and obtain a `udid` of the uploaded package. This procedure is detailed under the [Data Upload section of the Indoor Data Management article](indoor-data-management.md#data-upload-process).

2. Once you obtain the uploaded packaged `udid`, convert the uploaded packaged using the conversion service, and obtain the conversion `udid` of the converted package.This may also be called the conversion ID. Similar to the previous step, this procedure is detailed in the [Data Conversion section of the Indoor Data Management article](indoor-data-management.md#data-conversion-process).

3. Create an initial data set, and obtain the data set ID, also known as the data set `udid`. For more details on how to obtain the data set ID, see the [Data sets section of the Indoor Data Management article](indoor-data-management.md#Data-sets). Copy the data set ID, to import more data into this data set, as described in the next section.

## Bulk import data into a dataset

This section assumes that you already have a data set to import bulk data into this data set.

1. Prepare your bulk data by placing your GeoJSON files in a zipped folder.

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

6. Upon a successful post request, the response **Headers** tab will contain a **Location** key with a URL. Make a **GET** request at this URL to obtain the zip folder ID, also known as the upload `udid`. The code block belows shows the expected format for this URL, and remember to append you azure maps key for authentication.

    ```http
    https://atlas.microsoft.com/mapData/<unique-alphanumeric-value>/status?api-version=1.0&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

7. If the get request was successful, the response body will contain the `resourceLocation` element. The upload `udid` is embedded in the URL of the `resourceLocation` element, as seen in the image below. Copy the upload ID for this zip folder.

    <center>

    ![Upload data folder](./media/how-to-ingest-bulk-data-in-dataset/upload-id.png)

    </center>

8. Call the [Dataset Import API]() to import bulk data from the zip folder resource to the dataset resource. You'll need the data set ID and the zip folder upload ID, to import the zip folder data into the data set. Make **PATCH** request URL similar to the one below, and for the `type` parameter, use the `fixture` value.

    ```http
    <?>
    ```

9. After making the **PATCH** request call, you'll recieve a response containing a response status, like the one in the image below:

