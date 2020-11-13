---
title: Verify the health container instance
titleSuffix: Azure Cognitive Services
description: Learn how to verify the health container instance.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include
ms.date: 07/07/2020
ms.author: aahi
---

### Verify that a container is running

1. Select the **Overview** tab, and copy the IP address.
1. Open a new browser tab, and enter the IP address. For example, enter `http://<IP-address>:5000 (http://55.55.55.55:5000`). The container's home page is displayed, which lets you know the container is running.

    ![View the container home page to verify that it's running](../media/how-tos/container-instance/swagger-docs-on-container.png)

1. Select the **Service API Description** link to go to the container's Swagger page.

1. Choose any of the **POST** APIs, and select **Try it out**. The parameters are displayed, which includes example input.

There are several URLs you can also use to verify that the container is running.

|Request|Purpose|
|--|--|
|`http://localhost:5000/`|The container provides a home page.|
|`http://localhost:5000/ready`|Requested with GET, this provides a verification that the container is ready to accept a query against the model. This request can be used for Kubernetes [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/).|
|`http://localhost:5000/status`|Requested with GET, like the /ready endpoint, this validates that the container is running without incurring a query against the model. This request can be used for Kubernetes [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/).|
|`http://localhost:5000/swagger`|Through this URL, the container provides a full set of documentation for the endpoints and a `Try it now` feature. With this feature, you can enter your settings into a web-based HTML form and make the query without having to write any code. After the query returns, an example CURL command is provided to demonstrate the HTTP headers and body format that's required. |
|`http://localhost:5000/demo`| Requested through a browser, this feature provides an interactive visualization of the results from queries of input text samples or one you provide.  |

Use this request URL - `http://localhost:5000/text/analytics/v3.2-preview.1/entities/health` - to submit a query to the container.
