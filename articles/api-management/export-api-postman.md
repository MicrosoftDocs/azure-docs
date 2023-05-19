---
title: Export API from Azure API Management to Postman for testing and monitoring | Microsoft Docs
description: Learn how to export an API definition from API Management to Postman and use Postman for API testing and monitoring
author: dlepow

ms.service: api-management
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 10/11/2022
ms.author: danlep
---
# Export API definition to Postman for API testing and monitoring

To enhance development of your APIs, you can export an API fronted in API Management to [Postman](https://www.postman.com/product/what-is-postman/). Export an API definition from API Management as a Postman [collection](https://learning.postman.com/docs/getting-started/creating-the-first-collection/) so that you can use Postman's tools to design, document, test, monitor, and collaborate on APIs. 

## Prerequisites

+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Make sure that your instance manages an API that you'd like to export to Postman. 

    > [!NOTE]
    > Currently, you can only export HTTP APIs from API Management directly to Postman.
    
    For testing authorization in Postman as outlined later in this article, the API should require a subscription.

+ A [Postman](https://www.postman.com) account, which you can use to access Postman for Web.
    * Optionally, [download and install](https://learning.postman.com/docs/getting-started/installation-and-updates/) the Postman desktop app locally.

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]


## Export an API to Postman

1. In the portal, under **APIs**, select an API.
1. In the context menu (**...**), select **Export** > **Postman**. 

    :::image type="content" source="media/export-api-postman/export-to-postman.png" alt-text="Screenshot of exporting an API to Postman in the Azure portal.":::

1. In the **Run in** dialog, select the Postman location to export to. You can select the option for the desktop app if you've installed it locally.
1. In Postman, select a Postman workspace to import the API to. The default is *My Workspace*.
1. In Postman, select **Generate collection from this API** to automatically generate a collection from the API definition. If needed, configure advanced import options, or accept default values. Select **Import**.

    The collection and documentation are imported to Postman.

    :::image type="content" source="media/export-api-postman/postman-collection-documentation.png" alt-text="Screenshot of collection imported to Postman."::: 

## Authorize requests in Postman  

If the API you exported requires a subscription, you'll need to configure a valid subscription key from your API Management instance to send requests from Postman. 

Use the following steps to configure a subscription key as a secret variable for the collection.

1. In your Postman workspace, select **Environments** > **Create environment**.
1. Enter a name for the environment such as *Azure API Management*.
1. Add a variable with the following values:
    1. Name -  *apiKey*
    1. Type - **secret**
    1. Initial value - a valid API Management subscription key for the API
1. Select **Save**.
1. Select **Collections** and the name of the collection that you imported.
1. Select the **Authorization** tab.
1. In the upper right, select the name of the environment you created, such as *Azure API Management*.
1. For the key **Ocp-Apim-Subscription-Key**, enter the variable name `{{apiKey}}`. Select **Save**.

    :::image type="content" source="media/export-api-postman/postman-api-authorization.png" alt-text="Screenshot of configuring secret API key in Postman.":::
1. Test your configuration by selecting an operation in your API such as a `GET` operation, and select **Send**.
    
    If correctly configured, the operation returns a `200 OK` status and some output.

## Next steps

* Learn more about [importing APIs to Postman](https://learning.postman.com/docs/designing-and-developing-your-api/importing-an-api/).
* Learn more about [authorizing requests in Postman](https://learning.postman.com/docs/sending-requests/authorization/).
