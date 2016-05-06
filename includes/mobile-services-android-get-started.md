The final stage of this tutorial is to build and run your new app.

### Load project into Android Studio and sync Gradle

1. Browse to the location where you saved the compressed project files and expand the files on your computer into your Android Studio projects directory.

2. Open Android Studio. If you are working with a project and it appears, close the project (File => Close Project).

3. Select **Open an existing Android Studio project**, browse to the project location, and then click **OK.** This will load the project and start to sync it with Gradle.

 	![](./media/mobile-services-android-get-started/android-studio-import-project.png)

4. Wait for the Gradle sync activity to complete. If you see a "failed to find target" error, this is because the version used in Android Studio doesn't match that of the sample. The easiest way to fix this is to click the **Install missing platform(s) and sync project** link in the error message. You might get additional version error messages, and you simply repeat this process until no errors appear.
    - There is another way to fix this if you want to run with the "latest and greatest" version of Android. You can update the **targetSdkVersion** in the *build.gradle* file in the *app* directory to match the version already installed on your machine, which you can discover by clicking the **SDK Manager** icon and seeing what version is listed. Next you press the **Sync Project with Gradle Files**. You may get an error message for the version of Build Tools, and you fix that the same way.

### Running the app

You can run the app using the emulator, or using an actual device.

1. To run from a device, connect it to your computer with a USB cable. You must [set up the device for development](https://developer.android.com/training/basics/firstapp/running-app.html). If you are developing on a Windows machine, you must also download and install a USB driver.

2. To run using the Android emulator, you must define at least one Android Virtual Device (AVD). Click the AVD Manager icon to create and manage these devices.

3. From the **Run** menu, click **Run** to start the project. and choose a device or emulator from the dialog box that appears.

4. When the app appears, type meaningful text, such as _Complete the tutorial_, and then click **Add**.

   	![](./media/mobile-services-android-get-started/mobile-quickstart-startup-android.png)

   	This sends a POST request to the new mobile service hosted in Azure. Data from the request is inserted into the TodoItem table. Items stored in the table are returned by the mobile service, and the data is displayed in the list.

	> [AZURE.NOTE] You can review the code that accesses your mobile service to query and insert data, which is found in the ToDoActivity.java file.

8. Back in the Azure classic portal, click the **Data** tab and then click the **TodoItems** table.

   	![](./media/mobile-services-android-get-started/mobile-data-tab1.png)

   	This lets you browse the data inserted by the app into the table.

   	![](./media/mobile-services-android-get-started/mobile-data-browse.png)
