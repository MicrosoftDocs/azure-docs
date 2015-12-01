
1. Visit the [Azure Portal]. Click **Browse All** > **Mobile Apps** > the backend that you just created. In the mobile app settings, click **Quickstart** > **Android)**. Under **Configure your client applicatoin**, click **Download**. This downloads a complete Android project for an app pre-configured to connect to your backend. Open the project using Android Studio, Import project (Eclipse ADT, Gradle, etc.).

2. Press the **Run 'app'** button to build the project and start the app in the Android simulator.

3. In the app, type meaningful text, such as _Complete the tutorial_ and then click the 'Add' button. This sends a POST request to the Azure backend you deployed earlier. The backend inserts data from the request is into the TodoItem SQL table, and returns information about the newly stored items back to the mobile app. The mobile app displays this data in the list. 

    ![](./media/mobile-services-android-get-started/mobile-quickstart-startup-android.png)

[Azure Portal]: https://portal.azure.com/
