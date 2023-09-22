## Test the new API in the portal
Operations can be called directly from the portal, which provides a convenient way for administrators to view and test the operations of an API.  
1. Select the API you created in the previous step.
1. Select the **Test** tab.
1. Select an operation.
    The page displays fields for query parameters and fields for the headers.
    > [!NOTE]
    > In the test console, API Management automatically populates an **Ocp-Apim-Subscription-Key** header, and configures the subscription key of the built-in [all-access subscription](../articles/api-management/api-management-subscriptions.md#all-access-subscription). This key enables access to every API in the API Management instance. Optionally display the **Ocp-Apim-Subscription-Key** header by selecting the "eye" icon next to the **HTTP Request**.
1. Depending on the operation, enter query parameter values, header values, or a request body. Select **Send**.

    When the test is successful, the backend responds with a successful HTTP response code and some data.

    > [!TIP]
    > By default, the test console sends a request to API Management's CORS proxy, which forwards the request to the API Management instance, which then forwards it to the backend. This proxy uses public IP address 13.91.254.72 and can only reach public endpoints. If you want to send a request directly from the browser to the API Management service, select **Bypass CORS proxy**. Use this option when you want to use the test console and your API Management gateway is network-isolated or doesn't allow traffic from the CORS proxy.

To debug an API, see [Tutorial: Debug your APIs using request tracing](../articles/api-management/api-management-howto-api-inspector.md).