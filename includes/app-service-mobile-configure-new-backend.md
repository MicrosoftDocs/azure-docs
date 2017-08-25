
1. Click **App Services** > select your Mobile App backend > click **Quickstart** > your client platform (iOS, Android, Xamarin, Cordova).

![Azure Portal with Mobile Apps Quickstart highlighted][quickstart]

2. If the connection to the database is not configured, you must create one Data Connection.

![Azure Portal with Mobile Apps Connect to BD][connect]

  * Create new SQL Database and server.

  ![Azure Portal with Mobile Apps create new BD and server][server]

  * Wait until the data connection is successfully created.

  ![Azure Portal with Mobile Apps notification on data connection create][notification]

  * Data connection must be successful.

  ![Azure Portal with Mobile Apps notification on data connection create][already-connection]

3. Under **2. Create a table API**, select Node.js for **Backend language**. Accept the acknowledgment and click **Create TodoItem table**. This creates a new *TodoItem* table in your database. Remember that switching an existing backend to Node.js will overwrite all contents! To create a .NET backend instead, [follow these instructions][instructions].

<!-- Images. -->
[quickstart]: ./media/app-service-mobile-configure-new-backend/quickstart.png
[connect]: ./media/app-service-mobile-configure-new-backend/connect-to-bd.png
[notification]: ./media/app-service-mobile-configure-new-backend/notification-data-connection-create.png
[server]: ./media/app-service-mobile-configure-new-backend/create-new-server.png
[already-connection]: ./media/app-service-mobile-configure-new-backend/already-connection.png

<!-- URLs -->
[instructions]: ../articles/app-service-mobile/app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#create-app
