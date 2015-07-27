
1. On your Mac, visit [Azure Portal]. Click **Browse All** > **Mobile Apps** > the backend that you just created. At the top of the blade, click **Add Client** > either **iOS (Objective-C)** or **iOS (Swift.)**. Click **Download and run your app** > **Download**. This downloads a complete Xcode project for an app pre-configured to connect to your backend. Open the project using Xcode.

2. Press the **Run** button to build the project and start the app in the iOS simulator.

3. In the app, type meaningful text, such as _Complete the tutorial_ and then click the plus (**+**) icon. This sends a POST request to the Azure backend you deployed earlier. The backend inserts data from the request is into the TodoItem SQL table, and returns information about the newly stored items back to the mobile app. The mobile app displays this data in the list. 

   	![](./media/mobile-services-ios-run-app/mobile-quickstart-startup-ios.png)

