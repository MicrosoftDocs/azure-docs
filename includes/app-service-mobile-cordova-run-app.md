
1. Visit the [Azure Portal]. Click **Browse All** > **Mobile Apps** > the backend that you just created. In the mobile
app settings, click **Quickstart** > **Cordova**. Under **Configure your client application**, select **Create a New App**,
then click **Download**. This downloads a complete Cordova project for an app pre-configured to connect to your backend.

2. Unpack the downloaded ZIP file to a directory on your hard drive.

3. Open the project using **Visual Studio**.  Click on **Open** > **Project/Solution...**.

4. Find the _sitename_.sln file and click **Open**.

5. The default emulator is **Ripple - Nexus (Galaxy)**.  Click the drop-down arrow next to the emulator and select **Google Android Emulator**.

6. Click on **Google Android Emulator**.  The project will be built and then run.  You may see a network security warning from the
Google Android Emulator requesting access to the network.  Eventually, the Google Android Emulator will be shown and your application will run.

7. In the app, type meaningful text, such as _Complete the tutorial_ and then click the 'Add' button. This sends a POST request to the
Azure backend you deployed earlier. The backend inserts data from the request is into the TodoItem SQL table, and returns information
about the newly stored items back to the mobile app. The mobile app displays this data in the list.

    ![](./media/app-service-mobile-cordova-quickstart/quickstart-startup.png)

[Azure Portal]: https://portal.azure.com/
