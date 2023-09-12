---
title: How to run Multivariate Anomaly Detector API (GA version) in Postman?
titleSuffix: Azure AI services
description: Learn how to detect anomalies in your data either as a batch, or on streaming data with Postman.
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-anomaly-detector
ms.topic: how-to
ms.date: 12/20/2022
ms.author: mbullwin
---

# How to run Multivariate Anomaly Detector API in Postman?

This article will walk you through the process of using Postman to access the Multivariate Anomaly Detection REST API.

## Getting started

Select this button to fork the API collection in Postman and follow the steps in this article to test.

[![Run in Postman](../media/postman/button.svg)](https://app.getpostman.com/run-collection/18763802-b90da6d8-0f98-4200-976f-546342abcade?action=collection%2Ffork&collection-url=entityId%3D18763802-b90da6d8-0f98-4200-976f-546342abcade%26entityType%3Dcollection%26workspaceId%3De1370b45-5076-4885-884f-e9a97136ddbc#?env%5BMVAD%5D=W3sia2V5IjoibW9kZWxJZCIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6ImRlZmF1bHQiLCJzZXNzaW9uVmFsdWUiOiJlNjQxZTJlYy01Mzg5LTExZWQtYTkyMC01MjcyNGM4YTZkZmEiLCJzZXNzaW9uSW5kZXgiOjB9LHsia2V5IjoicmVzdWx0SWQiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJkZWZhdWx0Iiwic2Vzc2lvblZhbHVlIjoiOGZkZTAwNDItNTM4YS0xMWVkLTlhNDEtMGUxMGNkOTEwZmZhIiwic2Vzc2lvbkluZGV4IjoxfSx7ImtleSI6Ik9jcC1BcGltLVN1YnNjcmlwdGlvbi1LZXkiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJzZWNyZXQiLCJzZXNzaW9uVmFsdWUiOiJjNzNjMGRhMzlhOTA0MjgzODA4ZjBmY2E0Zjc3MTFkOCIsInNlc3Npb25JbmRleCI6Mn0seyJrZXkiOiJlbmRwb2ludCIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6ImRlZmF1bHQiLCJzZXNzaW9uVmFsdWUiOiJodHRwczovL211bHRpLWFkLXRlc3QtdXNjeC5jb2duaXRpdmVzZXJ2aWNlcy5henVyZS5jb20vIiwic2Vzc2lvbkluZGV4IjozfSx7ImtleSI6ImRhdGFTb3VyY2UiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJkZWZhdWx0Iiwic2Vzc2lvblZhbHVlIjoiaHR0cHM6Ly9tdmFkZGF0YXNldC5ibG9iLmNvcmUud2luZG93cy5uZXQvc2FtcGxlLW9uZXRhYmxlL3NhbXBsZV9kYXRhXzVfMzAwMC5jc3YiLCJzZXNzaW9uSW5kZXgiOjR9XQ==)

## Multivariate Anomaly Detector API

1. Select environment as **MVAD**.

    :::image type="content" source="../media/postman/postman-initial.png" alt-text="Screenshot of Postman UI with MVAD selected." lightbox="../media/postman/postman-initial.png":::

2. Select **Environment**, paste your Anomaly Detector `endpoint`, `key` and dataSource `url` into the **CURRENT VALUE** column, select **Save** to let the variables take effect.

    :::image type="content" source="../media/postman/postman-key.png" alt-text="Screenshot of Postman UI with key, endpoint, and datasource filled in." lightbox="../media/postman/postman-key.png":::

3. Select **Collections**, and select the first API - **Create and train a model**, then select **Send**.

    > [!NOTE]
    > If your data is one CSV file, please set the dataSchema as **OneTable**, if your data is multiple CSV files in a folder, please set the dataSchema as **MultiTable.**

    :::image type="content" source="../media/postman/create-and-train.png" alt-text="Screenshot of create and train POST request." lightbox="../media/postman/create-and-train.png":::

4. In the response of the first API, copy the modelId and paste it in the `modelId` in **Environments**, select **Save**. Then go to **Collections**, select **Get model status**, and select **Send**.
    ![GIF of process of copying model identifier](../media/postman/model.gif)

5. Select **Batch Detection**, and select **Send**. This API will trigger a synchronous inference task, and you should use the Get batch detection results API several times to get the status and the final results.

    :::image type="content" source="../media/postman/result.png" alt-text="Screenshot of batch detection POST request." lightbox="../media/postman/result.png":::

6. In the response, copy the `resultId` and paste it in the `resultId` in **Environments**, select **Save**. Then go to **Collections**, select **Get batch detection results**, and select **Send**.

    ![GIF of process of copying result identifier](../media/postman/result.gif)

7. For the rest of the APIs calls, select each and then select Send to test out their request and response.

    :::image type="content" source="../media/postman/detection.png" alt-text="Screenshot of detect last POST result." lightbox="../media/postman/detection.png":::

## Next Steps

* [Create an Anomaly Detector resource](create-resource.md)
* [Quickstart: Detect anomalies in your time series data using the Anomaly Detector](../quickstarts/client-libraries.md)
