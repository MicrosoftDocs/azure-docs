<div chunk="././Shared/Chunks/intstalling_mongodb_on_a_windows_vm" />
# Installing MongoDB on a Windows Virtual Machine

The Windows Azure virtual machine gallery provides Windows Azure virtual machine images of Microsoft Windows Server 2008 R2, Service Pack 1 (64-bit). You can select one of the virtual machine images from the Windows Azure gallery, deploy the virtual machine to your Windows Azure environment, and install MongoDB.

You will learn:

- How to use the Windows Azure Management Portal to select and install a Windows Server 2008 R2 SP1 virtual machine from the gallery.
- How to connect to the virtual machine using Remote Desktop.
- How to install MongoDB on the virtual machine.

## Connect to the Windows Azure Management Portal and Provision a Virtual Machine Image

1. Login to the Windows Azure Management Portal [http://windows.azure.com](http://windows.azure.com) using your account. If you do not have a Windows Azure account visit [Windows Azure 3 Month free trial](http://www.windowsazure.com/en-us/pricing/free-trial/).
2. On the Windows Azure Management Portal, at the bottom left of the web page, click **+NEW**, click **VIRTUAL MACHINE**, and then click **FROM GALLERY**.
![Create a New Virtual Machine][Image1]
3. Select a Windows Server 2008 SP1 R2 virtual machine image, and then click the next arrow at the bottom right of the page.
4. On the **VM Configuration** page, provide the following information:

- Provide a **VIRTUAL MACHINE NAME**, such as "testwindowsvm".
- Leave the **NEW USER NAME** box as Administrator.
- In the **NEW PASSWORD** box, type a [strong password](http://msdn.microsoft.com/en-us/library/ms161962.aspx).
- In the **CONFIRM PASSWORD** box, retype the password.
- Select the appropriate **SIZE** from the drop down list.

	Click the next arrow to continue.

	![VM Configuration] [Image2]
5. On the **VM Mode** page, provide the following information:

- Select **Standalone Virtual Machine**.
- In the **DNS NAME** box, type a valid DNS in the format **testwindowsvm.cloudapp.net**
- In the **REGION/AFFINITY GROUP/VIRTUAL NETWORK** box, select a region where this virtual image will be hosted.

   Click the next arrow to continue.

	![VM Configuration] [Image3]
6. On the **VM Options** page, select **(none)** in the **AVAILABILITY SET** box.
7. Click the check mark to continue.
8. Wait while Windows Azure prepares your virtual machine.

##Configure Endpoints
Once the virtual machine is created you must configure endpoints.

1. In the Windows Azure portal, click **Virtual Machines**, then click the name of your new VM, then click **Endpoints**.
2. Click **Add Endpoint** at the bottom of the page, and add an endpoint with name *mongo*, protocol *TCP*, and both *Public* and *Private* ports set to 27017. This will allow MongoDB (when it is installed) to be accessed remotely.

##Connect to the Virtual Machine Using Remote Desktop and Complete Setup
1. After the virtual machine is provisioned, on the Windows Azure Management Portal, click on **VIRTUAL MACHINES**, and the click on your new virtual machine. Information about your virtual machine is presented.
	![Select VM] [Image4]
2. At the bottom of the page, click **CONNECT**. Choose to open the rpd file using the Windows Remote Desktop program (`%windir%\system32\mstsc.exe`).
	![Click Connect] [Image5]
3. At the **Windows Security** dialog box, provide the password for the **Administrator** account. (You might be asked to verify the credentials of the virtual machine.)
4. The first time you log on to this virtual machine, several processes may need to complete, including setup of your desktop, Windows updates, and completion of the Windows initial configuration tasks.

Once you are connected to the virtual machine with Windows Remote Desktop, the virtual machine works like any other computer.

## Install and Run MongoDB on the Virtual Machine 

1. After you've connected to the virtual machine using Remote Desktop, open Internet Explorer from the **Start** menu.
2. Select the **Tools** button in the upper right corner.  In **Internet Options**, select the **Security** tab, and then select the **Trusted Sites** icon, and finally click the **Sites** button. Add `*.mongodb.org` to the list of trusted sites.
3. Go to [Downloads- MongoDB] [MongoDownloads].
4. Find the most recent release in the Production Release (Recommended) section and click the ***2008+** link in the Windows 64-bit column.  Click **Save As** and save the zip file to the desktop.
5. Right-click on the zip file and select **Extract All...**  Specify `C:\` and click **Extract**.  After the files have been extracted, you may wish to rename the install folder to something simpler.  "mongodb", for example.
6. Create a data directory.  By default, MongoDB stores data in the `\data\db` directory but you must manually create the directory.  From **Start**, select **Command Prompt** to open a command prompt window.  Enter:

	`C:\> mkdir \data`

	`C:\> mkdir \data\db`
7. To run the database, run: 

	`C:\> cd \MongoDB\bin`

	`C:\my_mongo_dir\bin> mongod`

	You will see log messages displayed in this window as mongod.exe server starts and preallocates journal files. It may take several minutes to preallocate the journal files.
8. To start the MongoDB administrative shell, open another command window from **Start** and enter the following:

	`C:\> cd \my_mongo_dir\bin`  
	`C:\my_mongo_dir\bin> mongo`  
	`>db`  
	`test`  	  
	`> db.foo.insert( { a : 1 } )`  
	`> db.foo.find()`  
	`{ _id : ..., a : 1 }`  
	`> show dbs`  
	`...`  
	`> show collections`  
	`...`  
	`> help`  

The database is created by the insert.

## Run MongoDB as a Windows Service (optional)
mongod.exe has support for installing and running as a Windows service.  

To install mongod.exe as a service, run the following from the command prompt:

	C:\mongodb\bin>mongod --logpath "c:\mongodb\logs\logfile.log" --logappend --dbpath "c:\data" --install 

This creates a service named "Mongo DB" with a description of "Mongo DB". The --logpath option must be used to specify a log file, since the running service will not have a command window to display output.  The --logappend option specifies that a restart of the service will cause output to append to the existing log file.  The --dbpath option specifies the location of the data directory.

For more service-related command line options, see [Service-related command line options] [MongoWindowsSvcOptions].

For more information, see the [Windows Service] [MongoWindowsSvc]. 

##Summary

[MongoDownloads]: http://www.mongodb.org/downloads
[MongoWindowsSvc]: http://www.mongodb.org/display/DOCS/Windows
[MongoWindowsSvcOptions]: http://www.mongodb.org/display/DOCS/Windows+Service

[Image1]: ../../Shared/Media/CreateVM.png
[Image2]: ../../Shared/Media/VmConfiguration1.png
[Image3]: ../../Shared/Media/VmConfiguration2.png