1. Login to the Windows Azure Management Portal [http://windows.azure.com]
(http://windows.azure.com) using your account. If you do not have a Windows Azure account visit [Windows Azure 3 Month free trial](http://www.windowsazure.com/en-us/pricing/free-trial/).
2. On the Windows Azure Management Portal, at the bottom left of the web page, click **+NEW**, click **VIRTUAL MACHINE**, and then click **FROM GALLERY**.
![Create a New Virtual Machine][Image1]
3. Select a CentOS virtual machine image, and then click the next arrow at the bottom right of the page.
4. On the **VM Configuration** page, provide the following information:
- Provide a **VIRTUAL MACHINE NAME**, such as "testlinuxvm".
- Specify a **NEW USER NAME**, such as "newuser", which will be added to the Sudoers list file.
- In the **NEW PASSWORD** box, type a [strong password](http://msdn.microsoft.com/en-us/library/ms161962.aspx).
- In the **CONFIRM PASSWORD** box, retype the password.
- Select the appropriate **SIZE** from the drop down list.
- Select the **SECURE USING SSH KEY**, click the **BROWSE** button, and specify a certificate.  This certificate will be used to authenticate the the SSH connection.

	Click the next arrow to continue.

	![VM Configuration] [Image2]
5. On the **VM Mode** page, provide the following information:

- Select **Standalone Virtual Machine**.
- In the **DNS NAME** box, type a valid DNS in the format **testlinuxvm.cloudapp.net**
- In the **REGION/AFFINITY GROUP/VIRTUAL NETWORK** box, select a region where this virtual image will be hosted.

   Click the next arrow to continue.

	![VM Configuration] [Image3]
6. On the **VM Options** page, select **(none)** in the **AVAILABILITY SET** box.
7. Click the check mark to continue.
8. Wait while Windows Azure prepares your virtual machine.

##Configure Endpoints
Once the virtual machine is created you must configure endpoints...

1. In the Windows Azure portal, click **Virtual Machines**, then click the name of your new VM, then click **Endpoints**.

2. Click **Edit Endpoint** at the bottom of the page, and edit the SSH endpoint so that its **Public Port** is 22.

3. Click **Add Endpoint** at the bottom of the page, and add an endpoint with name *mongo*, protocol *TCP*, and both *Public* and *Private* ports set to 27017. This will allow MongoDB (when it is installed) to be accessed remotely.

##Connect to the Virtual Machine
When the virtual machine has been provisioned and the endpoints configured you can connect to it using SSH or PuTTY.

###SSH
If you are using a linux computer, connect to the VM using SSH.  At the command prompt, run:

	$ ssh newuser@testlinuxvm.cloudapp.net -o ServerAliveInterval=180

Enter the user's password.

###PuTTY
If you are using a windows computer, connect to the VM using PuTTY. PuTTY can be downloaded from the [PuTTY Download Page][PuTTYDownLoad]. 

1. Download and save **putty.exe** to a directory on your computer. 
2. Open a command prompt, navigate to that folder, and execute putty.exe.
3. Enter "testlinuxvm.cloudapp.net" for the **Host Name** and "22" for the **Port**.

![PuTTY Screen][Image6]  

If you provided an SSH key for authentication you will need to provide the 
appropiate ppk key to putty in the Connection/SSH/ Auth Section. If you started with a PEM or PFX key you will need to translate these formats to the Putty ppk format. 

You can do this by using the putty key generation tool puttygen that you can download Here. You can use the tool by loading the key you have and later storing the key suing the tool's save option. 

## Create new user (optional)
After connecting to the VM through SSH or PuTTY, create a new user.

	# useradd <username>
	# passwd <username>

Type password, confirm password...
Add new user to sudoers list file

	# visudo

Navigate down to:

	## Allow root to run any commands anywhere
	root	ALL=(ALL)		ALL

and add the following line:
	
	newuser	ALL=(ALL)		ALL

and save the file.

##Update (optional)
Logout, login as new user.  Run:

	$ sudo yum update

Enter password again.  Wait while updates install.

[Image1]: ../../Shared/Media/CreateVM.png
[Image2]: ../../Shared/Media/VmConfiguration1.png
[Image3]: ../../Shared/Media/VmConfiguration2.png
[Image4]: ../../Shared/Media/VmConfiguration3.png
[Image6]: ../../Shared/Media/putty.png