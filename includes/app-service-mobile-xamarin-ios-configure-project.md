###In Xamarin Studio

1. In Xamarin.Studio, open **Info.plist**, and update the **Bundle Identifier** with the ID that you created earlier.

    ![][121]

2. Scroll down to **Background Modes** and check the **Enable Background Modes** box and the **Remote notifications** box. 

    ![][122]

3. Double click your project in the Solution Panel to open **Project Options**.

4.  Choose **iOS Bundle Signing** under **Build**, and select the corresponding **Identity** and **Provisioning profile** you had just set up for this project. 

    ![][120]

    This ensures that the project uses the new profile for code signing. For the official Xamarin device provisioning documentation, see [Xamarin Device Provisioning].

### In Visual Studio

1. In Visual Studio, right-click the project, and then click **Properties**.

3. In the properties pages, click the **iOS Application** tab, and update the **Identifier** with the ID that you created earlier.

    ![][123]

4. In the **iOS Bundle Signing** tab, select the corresponding **Identity** and **Provisioning profile** you had just set up for this project. 

    ![][124]

    This ensures that the project uses the new profile for code signing. For the official Xamarin device provisioning documentation, see [Xamarin Device Provisioning].

[120]:./media/app-service-mobile-xamarin-ios-configure-project/mobile-services-ios-push-20.png
[121]:./media/app-service-mobile-xamarin-ios-configure-project/mobile-services-ios-push-21.png
[122]:./media/app-service-mobile-xamarin-ios-configure-project/mobile-services-ios-push-22.png
[123]:./media/app-service-mobile-xamarin-ios-configure-project/mobile-services-ios-push-23.png
[124]:./media/app-service-mobile-xamarin-ios-configure-project/mobile-services-ios-push-24.png

[Xamarin Device Provisioning]: http://developer.xamarin.com/guides/ios/getting_started/installation/device_provisioning/