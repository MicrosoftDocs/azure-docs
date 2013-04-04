<properties linkid="manage-windows-howto-capture-an-image" urlDisplayName="Capture an image" pageTitle="Capture an image of a virtual machine running Windows Server" metaKeywords="Azure capture image vm, capturing vm" metaDescription="Learn how to capture an image of a Windows Azure virtual machine (VM) running Windows Server 2008 R2. " metaCanonical="" disqusComments="1" umbracoNaviHide="0" />

<div chunk="../chunks/windows-left-nav.md" />

#How to Capture an Image of a Virtual Machine Running Windows Server 2008 R2 #

<div chunk="../../Shared/Chunks/disclaimer.md" />

You can use images from the Image Gallery to easily create virtual machines, or you can capture and use your own images to create customized virtual machines. An image is a virtual hard disk (VHD) file that is used as a template for creating a virtual machine. An image is a template because it doesn’t have specific settings like a configured virtual machine, such as the computer name and user account settings. If you want to create multiple virtual machines that are set up the same way, you can capture an image of a configured virtual machine and use that image as a template.


1. Connect to the virtual machine by using the steps listed in [How to Log on to a Virtual Machine Running Windows Server 2008 R2] [].

2.	Open a Command Prompt window as an administrator.

	![Run Sysprep.exe][Run Sysprep.exe]

3.	Change the directory to `%windir%\system32\sysprep`, and then run sysprep.exe.

	The **System Preparation Tool** dialog box appears.

	![Enter Sysprep.exe options][Enter Sysprep.exe options]

4.	In **System Cleanup Action**, select **Enter System Out-of-Box Experience (OOBE)** and make sure that **Generalize** is checked. For more information about using Sysprep, see [How to Use Sysprep: An Introduction][].

5.	In **Shutdown Options**, select **Shutdown**.

6.	Click **OK**.

7.	The sysprep command shuts down the virtual machine, which changes the status of the machine in the [Management Portal](http://manage.windowsazure.com) to **Stopped**.

	![The virtual machine is stopped][The virtual machine is stopped]

8.	Click **Virtual Machines**, and then select the virtual machine from which you want to capture an image.

9.	On the command bar, click **Capture**.

	![Capture an image of the virtual machine][Capture an image of the virtual machine]

	The **Capture Virtual Machine** dialog box appears.

	![Enter the image name][Enter the image name]

10.	In **Image Name**, enter the name for the new image.

11.	All Windows Server images must be generalized by running the sysprep command. Click **I have sysprepped the Virtual Machine** to indicate that the operating system is prepared to be an image.

12.	Click the check mark to capture the image. When you capture an image of a virtual machine, the machine is deleted.

	The new image is now available under **Images**. The virtual machine is deleted after the image is captured.

	![Image capture successful][Image capture successful]

	When you create a virtual machine by using the From Gallery method, you can use the image that you captured by clicking **My Images** on the **VM OS Selection** page.

	![Use the captured image][Use the captured image]


[How to Log on to a Virtual Machine Running Windows Server 2008 R2]:../log-on-a-windows-VM/
[How to Use Sysprep: An Introduction]:http://technet.microsoft.com/en-us/library/bb457073.aspx
[Run Sysprep.exe]:../media/sysprepcommand.png
[Enter Sysprep.exe options]:../media/sysprepgeneral.png
[The virtual machine is stopped]:../media/sysprepstopped.png
[Capture an image of the virtual machine]:../media/capturevm.png
[Enter the image name]:../media/capture.png
[Image capture successful]:../media/capturesuccess.png
[Use the captured image]:../media/myimagesWindows.png