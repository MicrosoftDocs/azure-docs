---
author: conceptdev
ms.service: app-service-mobile
ms.topic: include
ms.date: 08/23/2018
ms.author: crdun
---

1. Open the downloaded client project using Xcode.

2. Go to the [Azure portal](https://portal.azure.com/) and navigate to the mobile app that you created. On the `Overview` blade, look for the URL which is the public endpoint for your mobile app. Example - the sitename for my app name "test123" will be https://test123.azurewebsites.net.

3. For Swift project, open the file `ToDoTableViewController.swift` in this folder - ZUMOAPPNAME/ZUMOAPPNAME/ToDoTableViewController.swift. The application name is `ZUMOAPPNAME`.

4. In `viewDidLoad()` method, replace `ZUMOAPPURL` parameter with public endpoint above.

    `let client = MSClient(applicationURLString: "ZUMOAPPURL")`

    becomes
    
    `let client = MSClient(applicationURLString: "https://test123.azurewebsites.net")`
    
5. For Objective-C project, open the file `QSTodoService.m` in this folder - ZUMOAPPNAME/ZUMOAPPNAME. The application name is `ZUMOAPPNAME`.

6. In `init` method, replace `ZUMOAPPURL` parameter with public endpoint above.

    `self.client = [MSClient clientWithApplicationURLString:@"ZUMOAPPURL"];`

    becomes
    
    `self.client = [MSClient clientWithApplicationURLString:@"https://test123.azurewebsites.net"];`

7. Press the **Run** button to build the project and start the app in the iOS simulator.

8. In the app, click the plus (**+**) icon, type meaningful text, such as *Complete the tutorial*, and then click the save button. This sends a POST request to the Azure backend you deployed earlier. The backend inserts data from the request into the TodoItem SQL table, and returns information about the newly stored items back to the mobile app. The mobile app displays this data in the list.

   ![Quickstart app running on iOS](./media/app-service-mobile-ios-quickstart/mobile-quickstart-startup-ios.png)

[Azure portal]: https://portal.azure.com/
