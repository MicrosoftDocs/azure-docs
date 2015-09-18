> [AZURE.IMPORTANT] To receive Push Notifications from Mobile Engagement, you need to enable `Silent Remote Notifications` in your application. You need to add the remote-notification value to the UIBackgroundModes array in your Info.plist file.

1. Open `info.plist` file in the project
2. Right click on the top item in the list (`Information Property List`) and add a new row

	![][1]

3. In the new row enter `Required background modes`

	![][2]

4. Click on the left arrow to expand the row
5. Add the following value to the item 0 `App downloads content in response to push notifications`

	![][3]

Once you make the change, the info.plist XML should contain the following key and value:

    <key>UIBackgroundModes</key>
        <array>
            <string>remote-notification</string>
        </array>
    ...
    
6. If you are using Xcode 7 and iOS 9, you have to perform the following additional steps:
• Set **Enable Bitcode** to **No** under Targets > Build Settings > set Enable Bitcode to Yes or No. (Make sure to select ALL from the top bar.) 
• Enable **Push Notifications** in Targets > Your Target Name > Capabilities.

<!-- Images. -->
[1]: ./media/mobile-engagement-ios-silent-push/xcode-plist-add-silent-push1.png
[2]: ./media/mobile-engagement-ios-silent-push/xcode-plist-add-silent-push2.png
[3]: ./media/mobile-engagement-ios-silent-push/xcode-plist-add-silent-push3.png
