---
author: conceptdev
ms.service: app-service-mobile
ms.topic: include
ms.date: 05/09/2019
ms.author: crdun
---
1. Open the project using **Android Studio**, using **Import project (Eclipse ADT, Gradle, etc.)**. Make sure you make this import selection to avoid any JDK errors.

2. Open the file `ToDoActivity.java` in this folder - ZUMOAPPNAME/app/src/main/java/com/example/zumoappname. The application name is `ZUMOAPPNAME`.

3. Go to the [Azure portal](https://portal.azure.com/) and navigate to the mobile app that you created. On the `Overview` blade, look for the URL which is the public endpoint for your mobile app. Example - the sitename for my app name "test123" will be https://test123.azurewebsites.net.

4. In `onCreate()` method, replace `ZUMOAPPURL` parameter with public endpoint above.
    
    `new MobileServiceClient("ZUMOAPPURL", this).withFilter(new ProgressFilter());` 
    
    becomes
    
    `new MobileServiceClient("https://test123.azurewebsites.net", this).withFilter(new ProgressFilter());`
    
5. Press the **Run 'app'** button to build the project and start the app in the Android simulator.

4. In the app, type meaningful text, such as *Complete the tutorial* and then click the 'Add' button. This sends a POST request to the Azure backend you deployed earlier. The backend inserts data from the request into the TodoItem SQL table, and returns information about the newly stored items back to the mobile app. The mobile app displays this data in the list.
    ![Quickstart Android](./media/app-service-mobile-android-quickstart/mobile-quickstart-startup-android.png)