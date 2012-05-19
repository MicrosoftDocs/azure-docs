1. Login to the [Windows Azure (Preview) Management Portal][AzurePreviewPortal] using your account. If you do not have a Windows Azure account visit [Windows Azure 3 Month free trial](http://www.windowsazure.com/en-us/pricing/free-trial/).
2. In the Management Portal, at the bottom left of the web page, click **+New**, click **Virtual Machine**, and then click **From Gallery**.
![Create a New Virtual Machine][Image1]
3. Select a CentOS virtual machine image, and then click the next arrow at the bottom right of the page.
4. On the **VM Configuration** page, provide the following information:

- Provide a **Virtual Machine Name**, such as "testlinuxvm".
- Specify a **New User Name**, such as "newuser", which will be added to the Sudoers list file.
- In the **New Password** box, type a [strong password](http://msdn.microsoft.com/en-us/library/ms161962.aspx).
- In the **Confirm Password** box, retype the password.
- Select the appropriate **Size** from the drop down list.
- Do not select **Secure Using SSH Key**.

	Click the next arrow to continue.

	![VM Configuration] [Image2]
5. On the **VM Mode** page, provide the following information:
- Select **Standalone Virtual Machine**.
- In the **DNS Name** box, type a valid DNS address.  For example,  "testlinuxvm.cloudapp.net"
- In the **Region/Affinity Group/Virtual Network** box, select a region where this virtual image will be hosted.

   Click the next arrow to continue.

	![VM Configuration] [Image3]
6. On the **VM Options** page, select **(none)** in the **Availability Set** box.
7. Click the check mark to continue.
8. Wait while Windows Azure prepares your virtual machine.

##Configure Endpoints
Once the virtual machine is created you must configure endpoints in order to remotely connect.

1. In the Management Portal, click **Virtual Machines**, then click the name of your new VM, then click **Endpoints**.

2. Click **Edit Endpoint** at the bottom of the page, and edit the SSH endpoint so that its **Public Port** is 22.

##Connect to the Virtual Machine
When the virtual machine has been provisioned and the endpoints configured you can connect to it using SSH or PuTTY.

###Connecting Using SSH
If you are using a linux computer, connect to the VM using SSH.  At the command prompt, run:

	$ ssh newuser@testlinuxvm.cloudapp.net -o ServerAliveInterval=180

Enter the user's password.

###Connecting using PuTTY
If you are using a Windows computer, connect to the VM using PuTTY. PuTTY can be downloaded from the [PuTTY Download Page][PuTTYDownLoad]. 

1. Download and save **putty.exe** to a directory on your computer. Open a command prompt, navigate to that folder, and execute **putty.exe**.

2. Enter "testlinuxvm.cloudapp.net" for the **Host Name** and "22" for the **Port**.
![PuTTY Screen][Image6]  

##Update the Virtual Machine (optional)
Once you've connected to the virtual machine, you can optionally install updates. Run:

	$ sudo yum update

Enter the password again.  Wait while updates install.

[AzurePreviewPortal]: http://manage.windowsazure.com
[PuTTYDownload]: http://www.puttyssh.org/download.html

[Image1]: ../../Shared/Media/CreateVM.png
[Image2]: ../../Shared/Media/VmConfiguration1.png
[Image3]: ../../Shared/Media/VmConfiguration2.png
[Image4]: ../../Shared/Media/VmConfiguration3.png
[Image6]: ../../Shared/Media/putty.png
