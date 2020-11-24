---
 author: mikeparker104
 ms.author: miparker
 ms.date: 06/02/2020
 ms.service: notification-hubs
 ms.topic: include
---

### Send a test notification

1. Open a new tab in [Postman](https://www.postman.com/downloads/).

1. Set the request to **POST**, and enter the following address:

    ```xml
    https://<app_name>.azurewebsites.net/api/notifications/requests
    ```

1. If you chose to complete the [Authenticate clients using an API Key](#authenticate-clients-using-an-api-key-optional) section, be sure to configure the request headers to include your **apikey** value.

   | Key                            | Value                          |
   | ------------------------------ | ------------------------------ |
   | apikey                         | <your_api_key>                 |

1. Choose the **raw** option for the **Body**, then choose **JSON** from the list of format options, and then include some placeholder **JSON** content:

    ```json
    {
        "text": "Message from Postman!",
        "action": "action_a"
    }
    ```

1. Select the **Code** button, which is under the **Save** button on the upper right of the window. The request should look similar to the following example when displayed for **HTML** (depending on whether you included an **apikey** header):

    ```html
    POST /api/notifications/requests HTTP/1.1
    Host: https://<app_name>.azurewebsites.net
    apikey: <your_api_key>
    Content-Type: application/json

    {
        "text": "Message from backend service",
        "action": "action_a"
    }
    ```

1. Run the **PushDemo** application on one or both of the target platforms (**Android** and **iOS**).

    > [!NOTE]
    > If you are testing on **Android** ensure that you are not running in **Debug**, or if the app has been deployed by running the application then force close the app and start it again from the launcher.

1. In the **PushDemo** app, tap on the **Register** button.

1. Back in **[Postman](https://www.postman.com/downloads)**, close the **Generate Code Snippets** window (if you haven't done so already) then click the **Send** button.

1. Validate that you get a **200 OK** response in **[Postman](https://www.postman.com/downloads)** and the alert appears in the app showing **ActionA action received**.  

1. Close the **PushDemo** app, then click the **Send** button again in **[Postman](https://www.postman.com/downloads)**.

1. Validate that you get a **200 OK** response in **[Postman](https://www.postman.com/downloads)** again. Validate that a notification appears in the notification area for the **PushDemo** app with the correct message.

1. Tap on the notification to confirm that it opens the app and displayed the **ActionA action received** alert.

1. Back in **[Postman](https://www.postman.com/downloads)**, modify the previous request body to send a silent notification specifying *action_b* instead of *action_a* for the **action** value.

    ```json
    {
        "action": "action_b",
        "silent": true
    }
    ```

1. With the app still open, click the **Send** button in **[Postman](https://www.postman.com/downloads)**.

1. Validate that you get a **200 OK** response in **[Postman](https://www.postman.com/downloads)** and that the alert appears in the app showing **ActionB action received** instead of **ActionA action received**.

1. Close the **PushDemo** app, then click the **Send** button again in **[Postman](https://www.postman.com/downloads)**.

1. Validate that you get a **200 OK** response in **[Postman](https://www.postman.com/downloads)** and that the silent notification doesn't appear in the notification area.
