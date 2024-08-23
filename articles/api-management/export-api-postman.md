---
title: Export API from Azure API Management to Postman for testing and monitoring | Microsoft Docs
description: Learn how to export an API definition from API Management to Postman and use Postman for API testing, monitoring, and development
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 08/06/2024
ms.author: danlep
---
# Export API definition to Postman for API testing, monitoring, and development

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

To enhance development of your APIs, you can export an API fronted in API Management to [Postman](https://www.postman.com/product/what-is-postman/). Export an API definition from API Management as a Postman [collection](https://learning.postman.com/docs/getting-started/creating-the-first-collection/) so that you can use Postman's tools to design, document, test, monitor, and collaborate on APIs. 

> [!NOTE]
> Only the API definition can be exported directly from API Management to Postman. Other information such as policies or subscription keys isn't exported.

## Prerequisites

+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Make sure that your instance manages an API that you'd like to export to Postman. 

    > [!NOTE]
    > Currently, you can only export HTTP APIs from API Management directly to Postman.
    
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

## API development with API Management and Postman  

API developers can rapidly iterate on API changes by using Postman's API testing, monitoring, and development capabilities.

APIs developed in Postman can then be exported and imported back into API Management as API revisions. This enables you to develop APIs in Postman and then deploy them to API Management for runtime access and management. [Learn more](https://learning.postman.com/docs/designing-and-developing-your-api/deploying-an-api/deploying-an-api-azure/)


> [!CAUTION]
> Use care when passing API Management subscription keys or other sensitive data in Postman. [Postman Vault](https://learning.postman.com/docs/sending-requests/postman-vault/postman-vault-secrets/) is recommended to store sensitive data as vault secrets in your instance of Postman, so you can safely reuse secrets in your collections and requests.

## Related content

* [Blog: Enhanced API developer experience with the Microsoft-Postman partnership](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/enhanced-api-developer-experience-with-the-microsoft-postman/ba-p/3650304)
* Learn more about [importing API definitions to Postman](https://learning.postman.com/docs/designing-and-developing-your-api/importing-an-api/).
* Learn more about [authorizing requests in Postman](https://learning.postman.com/docs/sending-requests/authorization/).
