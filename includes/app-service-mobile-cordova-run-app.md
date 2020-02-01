---
author: conceptdev
ms.service: app-service-mobile
ms.topic: include
ms.date: 05/06/2019
ms.author: crdun
---

1. Navigate to the solution file in the client project (.sln) and open it using Visual Studio.

2. In Visual Studio, choose the solution platform (Android, iOS, or Windows) from the drop-down next to the start arrow. Select a specific deployment device or emulator by clicking the drop-down on the green arrow. You can use the default Android platform and Ripple emulator. More advanced tutorials
    (for example, push notifications) require you to select a supported device or emulator.

3. Open the file `ToDoActivity.java` in this folder - ZUMOAPPNAME/app/src/main/java/com/example/zumoappname. The application name is `ZUMOAPPNAME`.

4. Go to the [Azure portal](https://portal.azure.com/) and navigate to the mobile app that you created. On the `Overview` blade, look for the URL which is the public endpoint for your mobile app. Example - the sitename for my app name "test123" will be https://test123.azurewebsites.net.

5. Go to the `index.js` file in ZUMOAPPNAME/www/js/index.js and in `onDeviceReady()` method, replace `ZUMOAPPURL` parameter with public endpoint above.

    `client = new WindowsAzure.MobileServiceClient('ZUMOAPPURL');`
    
    becomes
    
    `client = new WindowsAzure.MobileServiceClient('https://test123.azurewebsites.net');`
    
6. To build and run your Cordova app, press F5 or click the green arrow. If you see a security dialog in the emulator requesting access to the network, accept it.

7. After the app is started on the device or emulator, type meaningful text in **Enter new text**, such as *Complete the tutorial* and then click the **Add** button.

The backend inserts data from the request into the TodoItem table in the SQL Database, and returns information about the newly stored items back to the mobile app. The mobile app displays this data in the list.

You can repeat steps 3 through 5 for other platforms.