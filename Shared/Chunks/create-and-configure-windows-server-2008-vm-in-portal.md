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

[Image1]: ../../Shared/Media/CreateVM.png
[Image2]: ../../Shared/Media/VmConfiguration1.png
[Image3]: ../../Shared/Media/VmConfiguration2.png