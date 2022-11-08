## Test the new API in the portal

Operations can be called directly from the portal, which provides a convenient way for administrators to view and test the operations of an API.  

1. Select the API you created in the previous step.
1. Select the **Test** tab.
1. Select an operation.

    The page displays fields for query parameters and fields for the headers.

    > [!NOTE]
    > In the test console, API Management automatically populates an **Ocp-Apim-Subscription-Key** header, and configures the subscription key of the built-in [all-access subscription](../articles/api-management/api-management-subscriptions.md#all-access-subscription). This key enables access to every API in the API Management instance. Optionally display the **Ocp-Apim-Subscription-Key** header by selecting the "eye" icon next to the **HTTP Request**.

1. Depending on the operation, enter query parameter values, header values, or a request body. Select **Send**.

    When the test is successful, the backend responds with **200 OK** and some data.

To debug an API, see [Tutorial: Debug your APIs using request tracing](../articles/api-management/api-management-howto-api-inspector.md).