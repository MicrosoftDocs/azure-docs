---
title: Creating Web service endpoints
titleSuffix: Azure Machine Learning Studio
description: Creating Web service endpoints in Azure Machine Learning. Each endpoint in the Web service is independently addressed, throttled, and managed.
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: article

author: ericlicoding
ms.author: amlstudiodocs
ms.custom: seodec18
ms.date: 02/12/2019
---
# Creating endpoints for deployed Azure Machine Learning Studio web services

> [!NOTE]
> This topic describes techniques applicable to a **Classic** Machine Learning Web service.

After a web service is deployed, a default endpoint is created for that service. The default endpoint can be called by using its API key. You can add more endpoints with their own keys from the Web Services portal.
Each endpoint in the Web service is independently addressed, throttled, and managed. Each endpoint is a unique URL with an authorization key that you can distribute to your customers.

## Adding endpoints to a Web service

You can add an endpoint to a Web service using the Azure Machine Learning Web Services portal. Once the endpoint is created, you can consume it through synchronous APIs, batch APIs, and excel worksheets.

> [!NOTE]
> If you have added additional endpoints to the Web service, you cannot delete the default endpoint.

1. In Machine Learning Studio, on the left navigation column, click Web Services.
2. At the bottom of the Web service dashboard, click **Manage endpoints**. The Azure Machine Learning Web Services portal opens to the endpoints page for the Web service.
3. Click **New**.
4. Type a name and description for the new endpoint. Endpoint names must be 24 character or less in length, and must be made up of lower-case alphabets or numbers. Select the logging level and whether sample data is enabled. For more information on logging, see [Enable logging for Machine Learning Web services](web-services-logging.md).

## Next steps

[How to consume an Azure Machine Learning Web service](consume-web-services.md).
