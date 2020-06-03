---
 author: mikeparker104
 ms.author: miparker
 ms.date: 06/02/2020
 ms.service: notification-hubs
 ms.topic: include
---

#### No response from the backend service

When testing locally, ensure that the backend service is running and is using port 5001 (or the request endpoint has been updated to use the port that you are using if this is not 5001).

If testing against the **Azure API App**, check this is running and has been deployed and has started without error.

Be sure to check you have specified the base address correctly in **Postman** or in the mobile app configuration when testing via the client. This should indicatively be `https://<api_name>.azurewebsites.net/` or `https://localhost:5001/` when testing locally.

#### Not receiving notifications on Android after starting or stopping a debug session

You must register again after starting or stopping a debug session to continue receiving notifications on Android as the debugger will cause a new **Firebase** token to be generated and the notification hub installation must be updated as well.

#### Receiving a 401 status code from the backend service

Validate that you are setting the **apikey** request header and this value matches the one you had configured for the backend service.

If you receive this error when testing locally, validate this by comparing the key value you have defined in the client config with the **Authentication:ApiKey** user-setting value you had defined in the [Create the API App](#create-the-api-app) section to ensure these match.

If you receive this error when testing against the deployed **API App**, validate this by comparing the key value you have defined in the client config file with the **Authentication:ApiKey** application setting you had created for the **API App** resource that you had created in the [Create the API App](#create-the-api-app) section.

> [!NOTE]
> If you had created or changed this setting after you had deployed the backend service then you must restart the service in order for it take effect.

If you chose not to complete the [Authenticate clients using an API Key](#authenticate-clients-using-an-api-key) section, ensure that you did not apply the **Authorize** attribute to the **NotificationsController** class.

#### Receiving a 404 status code from the backend service

Validate that the endpoint and HTTP request method is correct. For example, these should indicatively be:

- **[PUT]** `https://<api_name>.azurewebsites.net/api/notifications/installations`
- **[DELETE]** `https://<api_name>.azurewebsites.net/api/notifications/installations/<installation_id>`
- **[POST]** `https://<api_name>.azurewebsites.net/api/notifications/requests`

Or when testing locally:

- **[PUT]** `https://localhost:5001/api/notifications/installations`
- **[DELETE]** `https://localhost:5001/api/notifications/installations/<installation_id>`
- **[POST]** `https://localhost:5001/api/notifications/requests`

When specifying the base address in the client app, ensure this ends with a `/`. This should indicatively be `https://<api_name>.azurewebsites.net/` or `https://localhost:5001/` when testing locally.

#### Unable to register with notification hub error message is displayed

Verify that the test device has network connectivity and then determine the Http response status code by setting a breakpoint to inspect the **StatusCode** property value in the **HttpResponse**.

Review the previous troubleshooting suggestions where applicable based on the status code.

Try calling the backend service when debugging locally setting a breakpoint on the lines that return these specific status codes for the respective API.

Validate the backend service is working as expected via **Postman** using the payload that is created by the client code for the platform in question. Validate that the *templates* are in the correct format, do not contain typos such as unexpected escape characters etc., and are accepted by the backend service.

Review the platform-specific configuration sections to ensure that no steps have been missed and that suitable values are being resolved for **installation id** and **token** variables for the appropriate platform.

#### Unable to resolve an ID for the device error message is displayed

Review the platform-specific configuration sections to ensure that no steps have been missed.
