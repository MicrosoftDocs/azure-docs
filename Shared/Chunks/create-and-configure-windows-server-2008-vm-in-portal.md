1. Login to the [Windows Azure (Preview) Management Portal][AzurePreviewPortal] using your account. If you do not have a Windows Azure account visit [Windows Azure 3 Month free trial](http://www.windowsazure.com/en-us/pricing/free-trial/).
2. In the Management Portal, at the bottom left of the web page, click **+New**, click **Virtual Machine**, and then click **From Gallery**.
![Create a New Virtual Machine][Image1]
3. Select a Windows Server 2008 SP1 R2 virtual machine image, and then click the next arrow at the bottom right of the page.
4. On the **VM Configuration** page, provide the following information:

- Provide a **Virtual Machine Name**, such as "testwindowsvm".
- Leave the **New User Name** box as Administrator.
- In the **New Password** box, type a [strong password](http://msdn.microsoft.com/en-us/library/ms161962.aspx).
- In the **Confirm Password** box, retype the password.
- Select the appropriate **Size** from the drop down list.

	Click the next arrow to continue.

	![VM Configuration] [Image2]
5. On the **VM Mode** page, provide the following information:

- Select **Standalone Virtual Machine**.
- In the **DNS Name** box, type a valid DNS in the format **testwindowsvm.cloudapp.net**
- In the **Region/Affinity Group/Virtual Network** box, select a region where this virtual image will be hosted.

   Click the next arrow to continue.

	![VM Configuration] [Image3]
6. On the **VM Options** page, select **(none)** in the **Availability Set** box.
7. Click the check mark to continue.
8. Wait while Windows Azure prepares your virtual machine.

##Connect to the Virtual Machine Using Remote Desktop and Complete Setup
1. After the virtual machine is provisioned, on the Management Portal, click on **Virtual Machines**, and the click on your new virtual machine. Information about your virtual machine is presented.	
2. At the bottom of the page, click **Connect**. Choose to open the rpd file using the Windows Remote Desktop program (`%windir%\system32\mstsc.exe`).	
3. At the **Windows Security** dialog box, provide the password for the **Administrator** account. (You might be asked to verify the credentials of the virtual machine.)
4. The first time you log on to this virtual machine, several processes may need to complete, including setup of your desktop, Windows updates, and completion of the Windows initial configuration tasks. Once you are connected to the virtual machine with Windows Remote Desktop, the virtual machine works like any other computer.

[Image1]: C:\Users\a-ryanwi\Desktop\InstallMongoOnWinVM\media\CreateWinVM.png
[Image2]: C:\Users\a-ryanwi\Desktop\InstallMongoOnWinVM\media\WinVmConfiguration1.png
[Image3]: C:\Users\a-ryanwi\Desktop\InstallMongoOnWinVM\media\WinVmConfiguration2.png

[AzurePreviewPortal]: http://manage.windowsazure.com