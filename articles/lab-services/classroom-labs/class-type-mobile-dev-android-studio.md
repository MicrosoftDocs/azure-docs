---
title: Set up a lab to teach mobile application development with Android Studio
titleSuffix: Azure Lab Services
description: Learn how to set up a lab to teach data mobile application development class that uses Android Studio.  Article will also discuss adjustments to make when using Android Studio on a virtual machine in Azure.
services: lab-services
author: emaher

ms.service: lab-services
ms.topic: article
ms.date: 1/23/2020
ms.author: enewman
---
# Set up a lab to teach data mobile application development with Android Studio

This article will show you how to set up an introductory mobile application development class.  This class focuses on Android mobile applications that can be published to the [Google Play Store](https://play.google.com/store/apps).  Students learn how to use [Android Studio](https://developer.android.com/studio) to build applications.  [Visual Studio Emulator for Android](https://visualstudio.microsoft.com/vs/msft-android-emulator/) is used to test the application locally.

## Lab configuration

To set up this lab, you need an Azure subscription and lab account to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. Once you get an Azure subscription, you can create a new lab account in Azure Lab Services. For more information about creating a new lab account, see [tutorial to set up a lab account](tutorial-setup-lab-account.md).  You can also use an existing lab account.

Follow the [set up classroom lab tutorial](tutorial-setup-classroom-lab.md) to create a new lab and then apply the following settings:

| Virtual machine size | Image |
| -------------------- | ----- |
| Medium (Nested Virtualization) | Windows Server 2019 Datacenter |

## Template machine configuration

When the template machine creation is complete, [start the machine and connect to it](how-to-create-manage-template.md#update-a-template-vm) to complete the following tasks:

1. Add Hyper-V role
2. Download and install Java.  
3. Download and install Visual Studio Emulator for Android.
4. Download and install Android Studio.
5. Configure Visual Studio Emulator for Android Studio.

## Add Hyper-V role

Hyper-V must be enabled for the successful installation of Visual Studio Emulator for Android.  Follow instructions in the [how to enable nested virtualization in a template virtual machine](how-to-enable-nested-virtualization-template-vm.md) article.

## Install Java

Android Studio requires Java.  Follow the steps below to download the latest version of Java.

1. Navigate to the [Java download page](https://www.java.com/download/). Click the **Java Download** button.
2. On the 64-bit Windows for Java web page, click the button labeled **Agree and Start Free Download**.
3. When **Java Setup** installer appears, click **Install**.
4. Wait until the installer title changes to **Java Setup – Complete**.  Click **Close** button.

## Install Visual Studio Emulator for Android

To test an Android application locally, it must use a virtualized version of an Android device.  There are a few Android emulators available that will allow a developer to test their application from their machine.  We are using Visual Studio Emulator for Android because it is an emulator that supports nested virtualization.  Because the Lab Service VM is already a virtual machine, we need an emulator that supports nested virtualization.  The built-in emulator for Android Studio does not support nested virtualization.  To see which emulators support nested virtualization, see [hardware acceleration for emulator performance (Hyper-V & HAXM)](https://docs.microsoft.com/xamarin/android/get-started/installation/android-emulator/hardware-acceleration).

Use the following instructions to download and install Visual Studio Emulator for Android.

1. Navigate to [Visual Studio Emulator for Android](https://visualstudio.microsoft.com/vs/msft-android-emulator/) home page.
2. Click the **Download the Emulator** button.
3. When vs_emulatorsetup.exe is downloaded, run the executable.
4. When the Visual Studio setup dialog appears, click the **Install** button.
5. Wait for installer to complete.  Click the **Restart Now** button to restart the computer and finish the installation.

Start the emulator first before deploying your application using Android Studio.  For more information about the Visual Studio Emulator for Android, see [Visual Studio Emulator for Android documentation](https://docs.microsoft.com/visualstudio/cross-platform/visual-studio-emulator-for-android).

## Install Android Studio

Follow instructions below to download and install [Android Studio](https://developer.android.com/studio).

1. Navigate to [Android Studio download page](https://developer.android.com/studio#downloads).  
    > [!NOTE]
    > Internet Explorer is not supported by this site.
2. Click the Windows (64-bit) executable Android Studio package.
3. Read the legal terms written in the pop-up.  When ready to continue, check **I have read and agree with the above terms and conditions** checkbox and click the **Download Android Studio for Windows** button.
4. Once on the Android Studio setup executable is downloaded, run the executable.
5. On the **Welcome to Android Studio Setup** page of the **Android Studio Setup** installer, click **Next**.
6. On the **Configuration Settings** page, click **Next**.
7. On the **Choose Start Menu Folder** page, click **Install**.
8. Wait for the setup to complete.
9. On the **Installation Complete** page, click **Next**.
10. On the **Completing Android Studio Setup** page.  Click **Finish**.
11. Android Studio will automatically start after the setup is finished.
12. On the **Import Android Settings From...** dialog, select **Do not import settings**. Click **OK**.
13. On the **Welcome** page of the **Android Studio Setup Wizard**, click **Next**.
14. On the **Install Type** page, choose **Standard**. Click **Next**.
15. On the **Select UI Theme** page, select desired theme. Click **Next**.
16. On the **Verify Settings** page, click **Next**.
17. On the **Downloading Components** page, wait until all components are downloaded.  Click **Finish**.

    > [!IMPORTANT]
    > It is expected that the HAXM installation fails.  HAXM does not support nested virtualization, which is why we installed Visual Studio Emulator for Android earlier in this article.

18. The **Welcome to Android Studio** dialog will appear when the setup wizard is complete.

## Configure Android Studio and Visual Studio Emulator for Android

Android Studio is almost ready for use.  We still need to tell Visual Studio Emulator for Android where the Android SDK is installed.  This will make any emulators running in Visual Studio for Android show as deployment targets for Android Studio debugging.

We need to set a specific registry key to tell Visual Studio Emulator for Android where the Android Sdk is located.  To set the needed registry key, run the script below.  The PowerShell script below assumes the default install location for the Android Sdk.  If you installed your Android Sdk in another location, modify the value for `$androidSdkPath` before running the script.

```powershell
$androidSdkPath = Resolve-Path $(Join-Path "$($env:APPDATA)" "../Local/Android/Sdk")

$registryKeyPath = "HKLM:Software\WOW6432NODE\Android Sdk Tools"
New-Item -Path $registryKeyPath
New-ItemProperty -Path $registryKeyPath -Name Path -PropertyType String -Value $androidSdkPath
```

> [!IMPORTANT]
> Restart Visual Studio Emulator for Android and Android Studio so the new setting is used.

Start the version you need in the Visual Studio Emulator.  It will show up as a deployment target for your Android app in Android studio.  The minimum version for the Android Studio project must support the version running in the Visual Studio Emulator for Android.  Now you are ready to create and debug projects using Android Studio and Visual Studio Emulator for Android.  If you have any issues, see Android emulator troubleshooting.

## Cost

If you would like to estimate the cost of this lab, you can follow the example below.
For a class of 25 students with 20 hours of scheduled class time and 10 hours of quota for homework or assignments, the price for the lab would be  

25 students \* (20 scheduled + 10 quota) hours * 55 Lab Units * 0.01 USD per hour = 412.5 USD

Further more details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Next steps

Next steps are common to setting up any lab.

- [Create and manage a template](how-to-create-manage-template.md)
- [Add users](tutorial-setup-classroom-lab.md#add-users-to-the-lab)
- [Set quota](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-classroom-lab.md#set-a-schedule-for-the-lab)
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users)
