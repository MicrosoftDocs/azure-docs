
1. Visit the [Azure Portal]. Click **Browse All** > **Mobile Apps** > the backend that you just created. In the mobile app settings, click **Quickstart** > **Android**. Under **Configure your client application**, click **Download**. This downloads a complete Android project for an app pre-configured to connect to your backend. 
2. Open the project using **Android Studio**, using **Import project (Eclipse ADT, Gradle, etc.)**. Make sure you make this import selection to avoid any JDK errors.
3. Press the **Run 'app'** button to build the project and start the app in the Android simulator.
4. In the app, type meaningful text, such as *Complete the tutorial* and then click the 'Add' button. This sends a POST request to the Azure backend you deployed earlier. The backend inserts data from the request into the TodoItem SQL table, and returns information about the newly stored items back to the mobile app. The mobile app displays this data in the list. 
   
    ![](./media/app-service-mobile-android-quickstart/mobile-quickstart-startup-android.png)

[Azure Portal]: https://portal.azure.com/
