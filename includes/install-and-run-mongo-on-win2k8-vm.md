Follow these steps to install and run MongoDB on a virtual machine running Windows Server.

> [!IMPORTANT]
> MongoDB security features, such as authentication and IP address binding, are not enabled by default. Security features should be enabled before deploying MongoDB to a production environment.  For more information, see [Security and Authentication](http://www.mongodb.org/display/DOCS/Security+and+Authentication).
>
>

1. After you've connected to the virtual machine using Remote Desktop, open Internet Explorer from the **Start** menu on the virtual machine.
2. Select the **Tools** button in the upper right corner.  In **Internet Options**, select the **Security** tab, and then select the **Trusted Sites** icon, and finally click the **Sites** button. Add *https://\*.mongodb.org* to the list of trusted sites.
3. Go to [Downloads - MongoDB](https://www.mongodb.com/download-center#community).
4. Find the **Current Stable Release** of **Community Server**, select the latest **64-bit** version in the Windows column. Download, then run the MSI installer.
5. MongoDB is typically installed in C:\Program Files\MongoDB. Search for Environment Variables on the desktop and add the MongoDB binaries path to the PATH variable. For example, you might find the binaries at C:\Program Files\MongoDB\Server\3.4\bin on your machine.
6. Create MongoDB data and log directories in the data disk (such as drive **F:**) you created in the preceding steps. From **Start**, select **Command Prompt** to open a command prompt window.  Type:

        C:\> F:
        F:\> mkdir \MongoData
        F:\> mkdir \MongoLogs
7. To run the database, run:

        F:\> C:
        C:\> mongod --dbpath F:\MongoData\ --logpath F:\MongoLogs\mongolog.log

    All log messages are directed to the *F:\MongoLogs\mongolog.log* file as mongod.exe server starts and preallocates journal files. It may take several minutes for MongoDB to preallocate the journal files and start listening for connections. The command prompt stays focused on this task while your MongoDB instance is running.
8. To start the MongoDB administrative shell, open another command window from **Start** and type the following commands:

        C:\> cd \my_mongo_dir\bin  
        C:\my_mongo_dir\bin> mongo  
        >db  
        test
        > db.foo.insert( { a : 1 } )  
        > db.foo.find()  
        { _id : ..., a : 1 }  
        > show dbs  
        ...  
        > show collections  
        ...  
        > help  

    The database is created by the insert.
9. Alternatively, you can install mongod.exe as a service:

        C:\> mongod --dbpath F:\MongoData\ --logpath F:\MongoLogs\mongolog.log --logappend  --install

    A service is installed named MongoDB with a description of "Mongo DB". The `--logpath` option must be used to specify a log file, since the running service does not have a command window to display output.  The `--logappend` option specifies that a restart of the service causes output to append to the existing log file.  The `--dbpath` option specifies the location of the data directory. For more service-related command-line options, see [Service-related command-line options][MongoWindowsSvcOptions].

    To start the service, run this command:

        C:\> net start MongoDB
10. Now that MongoDB is installed and running, you need to open a port in Windows Firewall so you can remotely connect to MongoDB.  From the **Start** menu, select **Administrative Tools** and then **Windows Firewall with Advanced Security**.
11. a) In the left pane, select **Inbound Rules**.  In the **Actions** pane on the right, select **New Rule...**.

    ![Windows Firewall][Image1]

    b) In the **New Inbound Rule Wizard**, select **Port** and then click **Next**.

    ![Windows Firewall][Image2]

    c) Select **TCP** and then **Specific local ports**.  Specify a port of "27017" (the default port MongoDB listens on) and click **Next**.

    ![Windows Firewall][Image3]

    d) Select **Allow the connection** and click **Next**.

    ![Windows Firewall][Image4]

    e) Click **Next** again.

    ![Windows Firewall][Image5]

    f) Specify a name for the rule, such as "MongoPort", and click **Finish**.

    ![Windows Firewall][Image6]

12. If you didn't configure an endpoint for MongoDB when you created the virtual machine, you can do it now. You need both the firewall rule and the endpoint to be able to connect to MongoDB remotely.

  In the Azure portal, click **Virtual Machines (classic)**, click the name of your new virtual machine, and then click **Endpoints**.

    ![Endpoints][Image7]

13. Click **Add**.

14. Add an endpoint with name "Mongo", protocol **TCP**, and both **Public** and **Private** ports set to "27017". Opening this port allows MongoDB to be accessed remotely.

    ![Endpoints][Image9]

> [!NOTE]
> The port 27017 is the default port used by MongoDB. You can change this default port by specifying the `--port` parameter when starting the mongod.exe server. Make sure to give the same port number in the firewall and the "Mongo" endpoint in the preceding instructions.
>
>

[MongoDownloads]: http://www.mongodb.org/downloads

[MongoWindowsSvcOptions]: http://www.mongodb.org/display/DOCS/Windows+Service


[Image1]: ./media/install-and-run-mongo-on-win2k8-vm/WinFirewall1.png
[Image2]: ./media/install-and-run-mongo-on-win2k8-vm/WinFirewall2.png
[Image3]: ./media/install-and-run-mongo-on-win2k8-vm/WinFirewall3.png
[Image4]: ./media/install-and-run-mongo-on-win2k8-vm/WinFirewall4.png
[Image5]: ./media/install-and-run-mongo-on-win2k8-vm/WinFirewall5.png
[Image6]: ./media/install-and-run-mongo-on-win2k8-vm/WinFirewall6.png
[Image7]: ./media/install-and-run-mongo-on-win2k8-vm/menusendpointadd.png
<!-- Removed 03/08/2017. Not in new portal. -->
<!-- [Image8]: ./media/install-and-run-mongo-on-win2k8-vm/WinVmAddEndpoint2.png
-->
[Image9]: ./media/install-and-run-mongo-on-win2k8-vm/newendpointdetails.png
