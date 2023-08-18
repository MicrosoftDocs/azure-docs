---
author: baanders
ms.service: digital-twins
description: include for accessing Azure Digital Twins Explorer
ms.topic: include
ms.date: 10/03/2022
ms.author: baanders
---

Next, select the **Open Azure Digital Twins Explorer (preview)** button.

:::image type="content" source="../articles/digital-twins/media/includes/azure-digital-twins-explorer-portal-access.png" alt-text="Screenshot of the Azure portal showing the Overview page for an Azure Digital Twins instance. There's a highlight around the Open Azure Digital Twins Explorer (preview) button." lightbox="../articles/digital-twins/media/includes/azure-digital-twins-explorer-portal-access.png":::

This will open Azure Digital Twins Explorer in a new tab. If this is your first time using the Explorer, you'll see a welcome modal summarizing its key features.

Azure Digital Twins Explorer might automatically connect to your instance. If not, you'll see the following screen asking you to specify an Azure Digital Twins URL. (If you don't see this box on your screen, Azure Digital Twins Explorer has already completed this step automatically.)

:::image type="content" source="../articles/digital-twins/media/includes/azure-digital-twins-explorer-no-environment.png" alt-text="Screenshot of Azure Digital Twins Explorer. The Azure Digital Twins URL modal displays an empty editable box for the Azure Digital Twins URL." lightbox="../articles/digital-twins/media/includes/azure-digital-twins-explorer-no-environment.png":::

If you see this box, enter *https://* into the field, followed by the host name of your instance (this can be found back on the instance's **Overview** page in the portal). These values together make up the instance URL. Select **Save** to connect to your instance.

>[!NOTE]
> The hosted Azure Digital Twins Explorer can only access Azure Digital Twins instances with public access enabled. If you're using [Private Link](../articles/digital-twins/concepts-security.md#private-network-access-with-azure-private-link) to restrict access to your instance through a private endpoint, you can use Azure functions to deploy the Azure Digital Twins Explorer codebase privately in the cloud. For instructions on how to do this, see [Azure Digital Twins Explorer: Running in the cloud](https://github.com/Azure-Samples/digital-twins-explorer#running-in-the-cloud).
