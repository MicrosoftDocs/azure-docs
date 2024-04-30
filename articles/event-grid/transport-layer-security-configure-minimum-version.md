---
title: Configure the minimum TLS version for an Event Grid topic or domain
description: Configure an Azure Event Grid topic or domain to use a minimum version of Transport Layer Security (TLS).
ms.service: event-grid
author: spelluru
ms.author: spelluru
ms.topic: how-to
ms.date: 01/24/2024
---

# Configure the minimum TLS version for an Event Grid topic or domain

Azure Event Grid topics or domains permit clients to send and receive data with TLS 1.0 and above. To enforce stricter security measures, you can configure your Event Grid topic or domain to require that clients send and receive data with a newer version of TLS. If an Event Grid topic or domain requires a minimum version of TLS, then any requests made with an older version fail. For conceptual information about this feature, see [Enforce a minimum required version of Transport Layer Security (TLS) for requests to an Event Grid topic or domain](transport-layer-security-enforce-minimum-version.md).

When creating a Web Hook event subscription, you can configure it to use the same TLS version as the topic or explicitly specify the minimum TLS version. If you do so, Event Grid fails to deliver events to a Web Hook that doesn't support the minimum version of TLS or higher.

You can configure the minimum TLS version using the Azure portal or Azure Resource Manager (ARM) template. 

> [!NOTE]
> The screenshots and the sample Resource Manager templates are for Event Grid topics. The screenshots and template for domains are similar. 

## Configure minimum TLS version for a topic or a domain in the Azure portal
You can specify the minimum TLS version when creating an Event Grid topic or a domain in the Azure portal on the **Security** tab. The screenshots are for an Event Grid topic and the user interface for configuring this property for a domain is similar. 

:::image type="content" source="./media/transport-layer-security-configure-minimum-version/create-topic-tls.png" alt-text="Screenshot showing the page to set the minimum TLS version when creating an Event Grid topic.":::

You can also specify the minimum TLS version for an existing topic on the **Configuration** page.

:::image type="content" source="./media/transport-layer-security-configure-minimum-version/existing-topic-tls.png" alt-text="Screenshot showing the page to set the minimum TLS version for an existing Event Grid topic.":::

## Configure minimum TLS version for a topic or a domain using Resource Manager template

To configure the minimum TLS version for an Event Grid topic or domain with a template, create a template with the  `MinimumTlsVersion`  property set to 1.0, 1.1, or 1.2. When you create an Event Grid topic or domain with an Azure Resource Manager template, the `MinimumTlsVersion` property is set to 1.2 by default, unless explicitly set to another version  The sample template in this article is for an Event Grid topic and the template for configuring the TLS version for a domain is similar. 

The following steps describe how to create a template in the Azure portal.

1. In the Azure portal, choose  **Create a resource**.
2. In  **Search the Marketplace** , type  **custom deployment** , and then press  **ENTER**.
3. Choose **Custom deployment (deploy using custom templates) (preview)**, choose  **Create** , and then choose  **Build your own template in the editor**.
4. In the template editor, paste in the following JSON to create a new topic and set the minimum TLS version to TLS 1.2. Remember to update the value for the `topic_name` parameter with your own value.


    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "topic_name": {
                "defaultValue": "spcustomtopic0123",
                "type": "String"
            }
        },
        "resources": [
            {
                "type": "Microsoft.EventGrid/topics",
                "apiVersion": "2023-12-15-preview",
                "name": "[parameters('topic_name')]",
                "location": "eastus",
                "properties": {
                    "minimumTlsVersionAllowed": "1.2"
                }
            }
        ]
    }
    ```
5. Save the template.
6. Specify resource group parameter, then choose the  **Review + create**  button to deploy the template and create a topic or domain with the  `MinimumTlsVersion`  property configured.

> [!NOTE]
> After you update the minimum TLS version for the Event Grid topic or domain, it may take up to 30 seconds before the change is fully propagated.


## Configure minimum TLS version for a Web Hook event subscription
When creating a Web Hook event subscription, you can configure it to use the same TLS version as the topic or explicitly specify the minimum TLS version. 

:::image type="content" source="./media/transport-layer-security-configure-minimum-version/create-subscription-tls-settings.png" alt-text="Screenshot showing the page to set the minimum TLS version when creating an event subscription to an Event Grid topic.":::

For an existing Web Hook event subscription, navigate to the **Event Subscription** page and then you can update the TLS setting on the **Additional features** tab. By default, the event subscription uses the same TLS version as the topic. 

 
## Next steps

For more information, see the following article: [Enforce a minimum required version of Transport Layer Security (TLS) for requests to an Event Grid topic or domain](transport-layer-security-enforce-minimum-version.md).
