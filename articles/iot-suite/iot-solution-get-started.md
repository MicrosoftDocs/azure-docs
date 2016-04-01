<properties 
	pageTitle="MyDriving Azure IoT Example - Quick Start | Microsoft Azure" 
	description="Get started with an app that's a comprehensive demonstration of how to architect an IoT system with Microsoft Azure, including stream analytics, machine learning, event hubs." 
	services="application-insights" 
    documentationCenter=""
    suite="iot-suite"
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/25/2016" 
	ms.author="awills"/>

# MyDriving IoT system: Quick start

MyDriving is a system that demonstrates the design and implementation of a typical [Internet of Things](iot-suite-overview.md) (IoT) solution that gathers telemetry from devices, processes that data in the cloud, and applies machine learning to provide an adaptive response. The demonstration logs data about your car trips, using data both from your mobile phone and an On-board Diagnostics (OBD) adaptor that collects information from your car’s control system. It uses this data to provide feedback on your driving style in comparison to other users. 


![](./media/iot-solution-get-started/image5.png)

The real purpose of MyDriving is to get you started creating your own IoT solution. But before that, let’s get you going with the MyDriving app itself - as a member of our test user team. This gives you an experience of the app and the  system behind it as a consumer, before delving into the architecture. It also introduces you to HockeyApp — a cool way of managing the alpha and beta distributions of your apps to test users.

## Use the Mobile Experience

**Prerequisites**:

Android, iOS or Windows 10 device.

## Android and Windows Phone 10 installation

On your device:

1.  **Allow development apps**

    -   Android: In **Settings**, **Security**, allow apps from **Unknown sources**.

    -   Windows 10: In **Settings**, **Updates**, **For Developers**, set **Developer mode**.

2.  **Join our beta test team**.

    HockeyApp makes it easy to distribute early releases of your app to test users.

    On your mobile device:

    -   **Sign up/sign in to** HockeyApp at <https://rink.hockeyapp.net>.
    
        (If you’re using Windows 10, use the Edge browser.)

        *Build 2016 attendees* – sign in with the same MSA email you registered for the conference, using one of the Microsoft buttons. You’re already signed up to HockeyApp.

        ![](./media/iot-solution-get-started/image1.png)

3.  **Download and install** the app from here:

    -   Android: <http://rink.io/spMyDrivingAndroid>

    -   Windows 10 Phone: <http://rink.io/spMyDrivingUWP>
    
*Any issues launching on Windows 10 Phone?* Might be your phone is an update or two behind. Make sure you've got the latest updates, or install:

 - Microsoft.NET.Native.Framework.1.2.appx 
 - Microsoft.NET.Native.Runtime.1.1.appx 
 - Microsoft.VCLibs.ARM.14.00.appx 
   

## iOS installation

### Build 2016 Attendees

If you’re at Build 2016, download the app as a member of our test team on HockeyApp.

1.  On your iOS device, sign in to <https://rink.hockeyapp.net>.
    Use one of the Microsoft sign-in buttons, and sign in with the same MSA email you registered with the conference. (Don’t use the email and password fields.)

    ![](./media/iot-solution-get-started/image1.png)

2.  In the HockeyApp Dashboard, select MyDriving and download it.

3.  Authorize the beta release from HockeyApp:

    Go to **Settings** &gt;**General** &gt;**Profiles and Device Management.**

    Trust the **Bit Stadium GmbH** certificate.

### If you didn’t attend Build 2016

We’ll be releasing the app on the iOS Store soon.

For now, you can build and deploy the app yourself:

-   Download the code [from GitHub].

-   Build and deploy [using Xamarin].

Find more details in the [MyDriving Reference Guide](http://aka.ms/mydrivingdocs).

## Get an OBD Adaptor (optional)

This is the part that makes this a real Internet of Things system! You can use the app without one, but it’s more fun with the real thing, and they aren’t expensive.

On-Board Diagnostics (OBD) is the feature of your car that the garage uses to tune it up and diagnose odd noises and warning lamps. Unless your car is of great antiquity, you’ll find a socket under the dashboard. With the right connector, you can get metrics of the engine’s performance and make certain adjustments. An OBD connector can be purchased cheaply from the usual places. It connects using Bluetooth or WiFi to an app on your phone.

But in this case, we’re going to connect your car to the Cloud. OK, the direct connection from the OBD is to your phone; but our app works as a relay. Your car's telemetry is sent straight on to the MyDriving IoT Hub, where it's processed to log your road trips and assess your driving style.

### Connect an OBD device


1.  Check that your car has the OBD connector (it probably does unless you’re into vintage automobiles). It will be located somewhere in the cabin, typically behind a flap underneath the dashboard.

2.  Obtain an OBD adaptor. We used these types:

    If you are using:

    -   an **Android or Windows** phone, you need a **Bluetooth-enabled OBD II** adaptor. We used [BAFX Products 34t5 Bluetooth OBDII Scan Tool].

    -   an **iOS** phone, you need a **WiFi-enabled** OBD adaptor. We used [ScanTool OBDLink MX Wi-Fi: OBD Adapter/Diagnostic Scanner].

3.  Follow the instructions that come with your OBD adaptor to connect it to your phone.

    -   A Bluetooth adaptor must be paired with the phone, in the Settings page.

    -   A WiFi adaptor must have an address in the range 192.168.xxx.xxx.

4.  If you have several cars, you can get a separate adaptor for each (max 3).

If you don’t have an OBD adaptor, the app will still send location and speed data from the phone's GPS receiver to the backend and will ask if you want to simulate an OBD.

You can find out more about how the app uses data from the OBD adaptor and about options for creating your own OBD device in Section 2.1 "IoT Devices" in the [MyDriving Reference Guide](http://aka.ms/mydrivingdocs).

## Using the App

**Start** the app. There’s an initial Quickstart to walk you through how it works.

-   **Track your trips.** Tap the record button (big red circle at bottom of screen) to start a trip, and tap again to end.


    ![](./media/iot-solution-get-started/image2.png)

-   Each time you start a trip, if there’s no OBD device, you’ll be asked if you want to use the simulator. 

-   At the end of a trip, click the stop button, and you get a summary:

    ![](./media/iot-solution-get-started/image3.png)

-   **Review your trips:**

    ![](./media/iot-solution-get-started/image4.png)

-   **Review your profile**:

    ![](./media/iot-solution-get-started/image5.png)

-   **Send us your test feedback** using the button in the app, or just give your phone a shake! This will automatically attach a screenshot, so that we’ll know what you’re talking about. And if there should be any unfortunate crashes, HockeyApp collects the crash logs to tell us about them.

## Feedback 

Because we created MyDriving to help jumpstart your own IoT systems, we certainly want to hear from you about how well it works. Let us know if you run into difficulties or challenges, if there is an extension point that would make it more suitable to your scenario, if you find a more efficient way to accomplish certain needs, or if you have any other suggestions for improving MyDriving or this documentation.

Within the MyDriving app itself, you can use the built-in HockeyApp feedback mechanism: on iOS and Android just give your phone a shake, or use the Feedback menu command. You can also give feedback through the [HockeyApp portal].

You can also file an [issue on GitHub], or leave a comment below (en-us edition).

We look forward to hearing from you!

## Next steps

-   Explore the [MyDriving Reference Guide](http://aka.ms/mydrivingdocs) to understand how we’ve designed and built the entire MyDriving system.

-   [Create and deploy a system of your own](iot-solution-build-system.md) using our Azure Resource Manager scripts. The [MyDriving Reference Guide](http://aka.ms/mydrivingdocs) also guides you through areas where you’ll make the most customizations.

  [from GitHub]: https://github.com/Azure-Samples/MyDriving
  [using Xamarin]: https://developer.xamarin.com/guides/ios/getting_started/installation/
  [BAFX Products 34t5 Bluetooth OBDII Scan Tool]: http://www.amazon.com/gp/product/B005NLQAHS
  [ScanTool OBDLink MX Wi-Fi: OBD Adapter/Diagnostic Scanner]: http://www.amazon.com/gp/product/B00OCYXTYY/ref=s9_simh_gw_g263_i1_r?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=desktop-2&pf_rd_r=1MWRMKXK4KK9VYMJ44MP
  [HockeyApp portal]: https://rink.hockeyapp.org
  [issue on GitHub]: https://github.com/Azure-Samples/MyDriving/issues
