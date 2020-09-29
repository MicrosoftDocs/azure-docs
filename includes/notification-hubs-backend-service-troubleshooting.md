---
 author: mikeparker104
 ms.author: miparker
 ms.date: 06/02/2020
 ms.service: notification-hubs
 ms.topic: include
---

#### No response from the backend service

When testing locally, ensure that the backend service is running and is using the correct port.

If testing against the **Azure API App**, check the service is running and has been deployed and has started without error.

Be sure to check you've specified the base address correctly in **[Postman](https://www.postman.com/downloads)** or in the mobile app configuration when testing via the client. The base address should indicatively be `https://<api_name>.azurewebsites.net/` or `https://localhost:5001/` when testing locally.

#### Not receiving notifications on Android after starting or stopping a debug session

Ensure you register again after starting or stopping a debug session. The debugger will cause a new **Firebase** token to be generated. The notification hub installation must be updated as well.

#### Receiving a 401 status code from the backend service

Validate that you're setting the **apikey** request header and this value matches the one you had configured for the backend service.

If you receive this error when testing locally, ensure the key value you defined in the client config, matches the **Authentication:ApiKey** user-setting value used by the [API](#create-the-api-app).

If you're testing with an **API App**, ensure the key value in the client config file matches the **Authentication:ApiKey** application setting you're using in the [API App](#create-the-api-app).

> [!NOTE]
> If you had created or changed this setting after you had deployed the backend service then you must restart the service in order for it take effect.

If you chose not to complete the [Authenticate clients using an API Key](#authenticate-clients-using-an-api-key-optional) section, ensure that you didn't apply the **Authorize** attribute to the **NotificationsController** class.

#### Receiving a 404 status code from the backend service

Validate that the endpoint and HTTP request method is correct. For example, the endpoints should indicatively be:

- **[PUT]** `https://<api_name>.azurewebsites.net/api/notifications/installations`
- **[DELETE]** `https://<api_name>.azurewebsites.net/api/notifications/installations/<installation_id>`
- **[POST]** `https://<api_name>.azurewebsites.net/api/notifications/requests`

Or when testing locally:

- **[PUT]** `https://localhost:5001/api/notifications/installations`
- **[DELETE]** `https://localhost:5001/api/notifications/installations/<installation_id>`
- **[POST]** `https://localhost:5001/api/notifications/requests`

When specifying the base address in the client app, ensure it ends with a `/`. The base address should indicatively be `https://<api_name>.azurewebsites.net/` or `https://localhost:5001/` when testing locally.

#### Unable to register and a notification hub error message is displayed

Verify that the test device has network connectivity. Then, determine the Http response status code by setting a breakpoint to inspect the **StatusCode** property value in the **HttpResponse**.

Review the previous troubleshooting suggestions where applicable based on the status code.

Set a breakpoint on the lines that return these specific status codes for the respective API. Then try calling the backend service when debugging locally.

Validate the backend service is working as expected via **[Postman](https://www.postman.com/downloads)** using the appropriate payload. Use the actual payload created by the client code for the platform in question.

Review the platform-specific configuration sections to ensure that no steps have been missed. Check that suitable values are being resolved for `installation id` and `token` variables for the appropriate platform.

#### Unable to resolve an ID for the device error message is displayed

Review the platform-specific configuration sections to ensure that no steps have been missed.
