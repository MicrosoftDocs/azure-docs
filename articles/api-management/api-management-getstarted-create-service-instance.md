---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Create an API Management service | Microsoft Docs
description: Follow the steps of this tutorial to create a new API Management service.
services: api-management
documentationcenter: ''
author: vladvino
manager: anneta
editor: ''

ms.service: api-management
ms.workload: integration
ms.topic: article
ms.date: 08/17/2017
ms.author: apimpm
---

# Create a new API Management service
This tutorial describes the steps for creating a new API Management service using the Azure portal.

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).
2. From the left menu, select **New > Enterprise Integration > API Management**.

    > [!TIP]
    > You can also choose **New**, then in the search box,
    > type `API management`, and press Enter.
    > Then choose **Create**.

3. Choose **Create**.
4. Enter a unique **name** for your API Management service. This name can't be changed later.

    > [!TIP]
    > Service name is used to generate a default domain name in the form of *{name}.azure-api.net.*
    > Service name is used to refer to the service and the corresponding Azure resource.

5. Select a **subscription** and **resource group**.
6. Choose a **location** where the API Management service should be created.
7. Enter an **organization name**. This name is used in a number of places like the title of the developer portal and sender of notification emails.
8. Change the **administrator email**, if you wish. Administrator email notifications are sent to this address.
9. Select the **pricing tier**. We suggest starting with the Developer tier. You can always change it later.
10. Choose **Create**.

    > [!TIP]
    > It usually takes between 20 and 30 minutes to create an API Management service.
    > Selecting **Pin to dashboard** makes finding a newly created service easier.

## Next steps
[Publish an API with Azure API Management](#api-management-getstarted-publish-api.md)