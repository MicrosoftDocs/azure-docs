####Configuring the iOS project in Xamarin Studio

1. In Xamarin.Studio, open **Info.plist**, and update the **Bundle Identifier** with the Bundle ID that you created earlier with your new App ID.

    ![](./media/app-service-mobile-xamarin-ios-configure-project/mobile-services-ios-push-21.png)

2. Scroll down to **Background Modes** and check the **Enable Background Modes** box and the **Remote notifications** box. 

    ![](./media/app-service-mobile-xamarin-ios-configure-project/mobile-services-ios-push-22.png)

3. Double click your project in the Solution Panel to open **Project Options**.

4.  Choose **iOS Bundle Signing** under **Build**, and select the corresponding **Identity** and **Provisioning profile** you had just set up for this project. 

    ![](./media/app-service-mobile-xamarin-ios-configure-project/mobile-services-ios-push-20.png)

    This ensures that the project uses the new profile for code signing. For the official Xamarin device provisioning documentation, see [Xamarin Device Provisioning].

####Configuring the iOS project in Visual Studio

1. In Visual Studio, right-click the project, and then click **Properties**.

2. In the properties pages, click the **iOS Application** tab, and update the **Identifier** with the ID that you created earlier.

    ![](./media/app-service-mobile-xamarin-ios-configure-project/mobile-services-ios-push-23.png)

3. In the **iOS Bundle Signing** tab, select the corresponding **Identity** and **Provisioning profile** you had just set up for this project. 

    ![](./media/app-service-mobile-xamarin-ios-configure-project/mobile-services-ios-push-24.png)

    This ensures that the project uses the new profile for code signing. For the official Xamarin device provisioning documentation, see [Xamarin Device Provisioning].

4. Double click Info.plist to open it and then enable **RemoteNotifications** under Background Modes. 



[Xamarin Device Provisioning]: http://developer.xamarin.com/guides/ios/getting_started/installation/device_provisioning/