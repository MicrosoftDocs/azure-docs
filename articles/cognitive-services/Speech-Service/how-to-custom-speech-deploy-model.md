---
title: "Deploy a model for Custom Speech - Speech Services"
titlesuffix: Azure Cognitive Services
description: TBD
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/06/2019
ms.author: erhopf
---

# Deploy a custom model

After you've uploaded and inspected data, evaluated accuracy, and trained a custom model, you can deploy a custom endpoint to use with your apps, tools, and products. In this document, you'll learn how to create and deploy an endpoint using the Custom Speech portal.

## Create a custom endpoint

To create a new custom endpoint, select Deployment on the Custom Speech menu at the top of the page, which contains a table of current custom endpoints. If you have not yet created any endpoints, the table is empty. The current locale is reflected in the table title.

To create a new endpoint, select Add endpoint., Enter information in the Name and Description boxes of your custom deployment, and select the custom model you want to deploy

You can also select whether content logging is switched on or off. That is, you're selecting whether the endpoint traffic is stored. If it is not selected, storing the traffic will be suppressed. For all logged content you can find download links under Endpoint-> Details view

 Note

Be sure to accept the terms of use and pricing information by selecting the check box.
After you have selected your data, select Create. This action returns you to the Deployment page. The table now includes an entry that corresponds to your new endpoint. The endpoint’s status reflects its current state while it is being created. It can take up to 30 minutes to instantiate a new endpoint with your custom models. When the status of the deployment is Complete, the endpoint is ready for use.

When the deployment is ready, the endpoint name becomes a link. Selecting the link displays the Endpoint Information page, which displays the endpoint key, endpoint URLs, together with some sample code of your custom endpoint.


## Next steps

* [Prepare and test your data](how-to-custom-speech-test-data.md)
* [Inspect your data](how-to-custom-speech-inspect-data.md)
* [Evaluate your data](how-to-custom-speech-evaluate-data.md)
* [Train your model](how-to-custom-speech-train-model.md)
* [Deploy your model](how-to-custom-speech-deploy-model.md)
