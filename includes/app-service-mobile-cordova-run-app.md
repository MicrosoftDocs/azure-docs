
1. Visit the [Azure portal].
2. Click **Browse All** > **Mobile Apps** > the backend that you created.
3. In the mobile app settings, click **Quickstart** > **Cordova**.
4. Under **Configure your client application**, select **Create a New App**, then click **Download**.
2. Unpack the downloaded ZIP file to a directory on your hard drive, navigate to the solution file (.sln) and
    open it using Visual Studio.
3. In Visual Studio, choose the solution platform (Android, iOS, or Windows) from the drop-down next to the
    start arrow. Select a specific deployment device or emulator by clicking the drop-down on the green
    arrow. You can use the default Android platform and Ripple emulator. More advanced tutorials
    (for example, push notifications) require you to select a supported device or emulator.
4. To build and run your Cordova app, press F5 or click the green arrow. If you see a security dialog
    in the emulator requesting access to the network, accept it.
5. After the app is started on the device or emulator, type meaningful text in **Enter new text**, such
    as *Complete the tutorial* and then click the **Add** button.

The backend inserts data from the request into the TodoItem table in the SQL Database, and returns
information about the newly stored items back to the mobile app. The mobile app displays this data in
the list.

![](./media/app-service-mobile-cordova-quickstart/quickstart-startup.png)

You can repeat steps 3 through 5 for other platforms.

[Azure portal]: https://portal.azure.com/
