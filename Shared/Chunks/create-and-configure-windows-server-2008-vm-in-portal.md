
1. Login to the [Windows Azure (Preview) Management Portal][AzurePreviewPortal] using your Windows Azure account.
2. In the Management Portal, at the bottom left of the web page, click **+New**, click **Virtual Machine**, and then click **From Gallery**.
![Create a New Virtual Machine][Image1]
3. Select a Windows Server 2008 R2 SP1 virtual machine image, and then click the next arrow at the bottom right of the page.
	![VM Configuration] [Image21]
4. On the **VM Configuration** page, provide the following information:

- Provide a **Virtual Machine Name**, such as "testwinvm".
- Leave the **New User Name** box as Administrator.
- In the **New Password** box, type a [strong password](http://msdn.microsoft.com/en-us/library/ms161962.aspx).
- In the **Confirm Password** box, retype the password.
- Select the appropriate **Size** from the drop down list.

	Click the next arrow to continue.

	![VM Configuration] [Image2]
5. On the **VM Mode** page, provide the following information:

- Select **Standalone Virtual Machine**.
- In the **DNS Name** box, type a valid DNS in the format **testwinvm.cloudapp.net**
- In the **Region/Affinity Group/Virtual Network** box, select a region where this virtual image will be hosted.

   Click the next arrow to continue.

	![VM Configuration] [Image3]
6. On the **VM Options** page, select **(none)** in the **Availability Set** box. Click the check mark to continue.
	![VM Configuration] [Image4]
8. Wait while Windows Azure prepares your virtual machine.


[Image1]: ../media/CreateWinVM.png
[Image21]: ../media/WinVmConfiguration0.png
[Image2]: ../media/WinVmConfiguration1.png
[Image3]: ../media/WinVmConfiguration2.png
[Image4]: ../media/WinVmConfiguration3.png

[AzurePreviewPortal]: http://manage.windowsazure.com