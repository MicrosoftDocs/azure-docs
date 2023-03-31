---
title: Enable CORS policies to test Azure API Management custom connector 
description: How to enable CORS policies in Azure API Management and Power Platform to test a custom connector from Power Platform applications.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 03/24/2023
ms.author: danlep

---
# Enable CORS policies to test custom connector from Power Platform
Cross-origin resource sharing (CORS) is an HTTP-header based mechanism that allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources. Customers can add a [CORS policy](cors-policy.md) to their web APIs in Azure API Management, which adds cross-origin resource sharing support to an operation or an API to allow cross-domain calls from browser-based clients.

If you've exported an API from API Management as a [custom connector](export-api-power-platform.md) in the Power Platform and want to use the Power Apps or Power Automate test console to call the API, you need to configure your API to explicitly enable cross-origin requests from Power Platform applications. This article shows you how to configure the following two necessary policy settings:

* Add a CORS policy to your API

* Add a policy to your custom connector that sets an Origin header on HTTP requests

## Prerequisites 

+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)
+ Export an API from your API Management instance to a Power Platform environment as a [custom connector](export-api-power-platform.md)

## Add CORS policy to API in API Management

Follow these steps to configure the CORS policy in API Management.

1. Sign into [Azure portal](https://portal.azure.com) and go to your API Management instance.
1. In the left menu, select **APIs** and select the API that you exported as a custom connector. If you want to, select only an API operation to apply the policy to.
1. In the **Policies** section, in the **Inbound processing** section, select **+ Add policy**.
    1. Select **Allow cross-origin resource sharing (CORS)**.
    1. Add the following **Allowed origin**: `https://make.powerapps.com`.
    1. Select **Save**.

* For more information about configuring a policy, see [Set or edit policies](set-edit-policies.md).
* For details about the CORS policy, see the [cors](cors-policy.md) policy reference.

> [!NOTE]
> If you already have an existing CORS policy at the service (all APIs) level to enable the test console of the developer portal, you can add the `https://make.powerapps.com` origin to that policy instead of configuring a separate policy for the API or operation. 

> [!NOTE]
> Depending on how the custom connector gets used in Power Platform applications, you might need to configure additional origins in the CORS policy. If you experience CORS problems when running Power Platform applications, use developer tools in your browser, tracing in API Management, or Application Insights to investigate the issues.


## Add policy to custom connector to set Origin header

Add the following policy to your custom connector in your Power Platform environment. The policy sets an Origin header to match the CORS origin you allowed in API Management.

For details about editing settings of a custom connector, see [Create a custom connector from scratch](/connectors/custom-connectors/define-blank).

1. Sign in to Power Apps or Power Automate.
1. On the left pane, select **Data** > **Custom Connectors**. 
1. Select your connector from the list of custom connectors.
1. Select the pencil (Edit) icon to edit the custom connector. 
1. Select **3. Definition**.
1. In **Policies**, select **+ New policy**. Select or enter the following policy details.

    
    |Setting  |Value  |
    |---------|---------|
    |Name     |  A name of your choice, such as **set-origin-header**       |
    |Template     | **Set HTTP header**  |
    |Header name     | **Origin**        |
    |Header value     |    `https://make.powerapps.com` (same URL that you configured in API Management)     |
    |Action if header exists     |  **override**        |
    |Run policy on     |  **Request**        |

    :::image type="content" source="media/enable-cors-power-platform/cors-policy-power-platform.png" alt-text="Screenshot of creating policy in Power Platform custom connector to set an Origin header in HTTP requests.":::

1. Select **Update connector**.

1. After setting the policy, go to the **5. Test** page to test the custom connector.

## Next steps

* [Learn more about the Power Platform](https://powerplatform.microsoft.com/)
* [Learn more about creating and using custom connectors](/connectors/custom-connectors/)
