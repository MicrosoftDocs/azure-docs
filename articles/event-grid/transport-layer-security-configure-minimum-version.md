---
title: Configure the minimum TLS version for an Event Grid topic or domain
description: Configure an Azure Event Grid topic or domain to use a minimum version of Transport Layer Security (TLS).
author: spelluru
ms.author: spelluru
ms.topic: how-to
ms.date: 10/08/2026
---

# Configure the minimum TLS version for an Event Grid topic or domain

Azure Event Grid Basic resources can require a minimum version of Transport Layer Security (TLS) for inbound client connections. The supported resource types are custom topics, domains, and partner namespaces. If a client uses a protocol version below the configured minimum, Event Grid doesn't accept the request.

API version `2026-06-15-preview` adds the following minimum TLS behavior for these Event Grid Basic resources:

- The default minimum TLS version is TLS 1.2.
- TLS 1.0 and TLS 1.1 are rejected.
- TLS 1.2 is supported.
- TLS 1.3 can be selected as the minimum TLS version.

TLS 1.3 is an opt-in minimum version. Existing resources aren't automatically configured to require TLS 1.3, and TLS 1.3 isn't the default. To require TLS 1.3, explicitly configure the resource by using API version `2026-06-15-preview`. This API-version-specific behavior doesn't establish the default or supported property values for earlier API versions.

| API version           | Default minimum TLS   | TLS 1.0 and TLS 1.1 | TLS 1.2     | TLS 1.3 as minimum             |
| --------------------- | --------------------- | ------------------- | ----------- | ------------------------------ |
| `2026-06-15-preview`  | TLS 1.2               | Rejected            | Supported   | Supported as an opt-in setting |

> [!IMPORTANT]
> Before you configure TLS 1.3 as the minimum TLS version, verify that every client and service that connects to the Event Grid resource supports TLS 1.3. Clients that don't support TLS 1.3 can't communicate with a resource that requires TLS 1.3.

The resource-level minimum TLS setting applies to inbound client connections. A Web Hook event subscription has a separate setting for outbound event delivery. For more information about resource-level enforcement, see [Enforce a minimum TLS version for requests to Event Grid Basic resources](transport-layer-security-enforce-minimum-version.md).

## Configure minimum TLS version for a topic or a domain in the Azure portal

You can specify the minimum TLS version when creating an Event Grid topic or a domain in the Azure portal on the **Security** tab. The screenshots are for an Event Grid topic. The user interface for configuring this property for a domain is similar.

:::image type="content" source="./media/transport-layer-security-configure-minimum-version/create-topic-tls.png" alt-text="Screenshot showing the page to set the minimum TLS version when creating an Event Grid topic.":::

You can also specify the minimum TLS version for an existing topic on the **Configuration** page.

:::image type="content" source="./media/transport-layer-security-configure-minimum-version/existing-topic-tls.png" alt-text="Screenshot showing the page to set the minimum TLS version for an existing Event Grid topic.":::

## Require TLS 1.3 for a topic using a Resource Manager template

To require TLS 1.3 for a custom topic, use API version `2026-06-15-preview` and set the `minimumTlsVersionAllowed` property to `1.3`. The following example is for a custom topic. It doesn't apply to Event Grid namespaces.

The following steps describe how to create a template in the Azure portal.

1. In the Azure portal, select **Create a resource**.
1. In **Search the Marketplace**, enter **custom deployment**, and then press **Enter**.
1. Select **Custom deployment (deploy using custom templates) (preview)**, select **Create**, and then select **Build your own template in the editor**.
1. In the template editor, paste the following JSON to create a topic that requires TLS 1.3. Replace the default value of the `topic_name` parameter with your topic name.

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
                "apiVersion": "2026-06-15-preview",
                "name": "[parameters('topic_name')]",
                "location": "eastus",
                "properties": {
                    "minimumTlsVersionAllowed": "1.3"
                }
            }
        ]
    }
    ```

1. Save the template.
1. Specify the deployment values, and then select **Review + create** to deploy the template.

> [!NOTE]
> After you update the minimum TLS version for an Event Grid topic or domain, it can take up to 30 seconds for the change to fully propagate.

## Configure minimum TLS version for a Web Hook event subscription

The minimum TLS setting for a Web Hook event subscription controls outbound delivery from Event Grid to the webhook. It's separate from the minimum TLS setting for inbound connections to a topic, domain, or partner namespace.

When you create a Web Hook event subscription, you can configure it to use the same minimum TLS version as the topic or explicitly specify the minimum version.

:::image type="content" source="./media/transport-layer-security-configure-minimum-version/create-subscription-tls-settings.png" alt-text="Screenshot showing the page to set the minimum TLS version when creating an event subscription to an Event Grid topic.":::

For an existing Web Hook event subscription, go to the **Event Subscription** page and update the TLS setting on the **Additional Features** tab. By default, the event subscription uses the same minimum TLS version as the topic.

## Next step

For more information, see [Enforce a minimum TLS version for requests to Event Grid Basic resources](transport-layer-security-enforce-minimum-version.md).
