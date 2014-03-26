<properties linkid="manage-windows-howto-capture-an-image" urlDisplayName="Capture an image" pageTitle="Capture an image of a virtual machine running Windows Server" metaKeywords="Azure capture image vm, capturing vm" description="Learn how to capture an image of an Azure virtual machine (VM) running Windows Server 2008 R2. " metaCanonical="" services="virtual-machines" documentationCenter="" title="How to Capture an Image of a Virtual Machine Running Windows Server" authors="kathydav" solutions="" manager="jeffreyg" editor="tysonn" />




#How to Capture an Image of a Virtual Machine Running Windows Server#

**IMPORTANT: In most cases, the following steps work as expected. In limited cases, the virtual machine restarts unexpectedly before Sysprep has completed if you choose Shutdown as directed in the steps. This prevents you from using RDP to access the virtual machine. You can avoid this issue by specifying Quit instead of Shutdown. For details, see the instructions in the following forum post: [http://social.msdn.microsoft.com/Forums/windowsazure/en-US/fafb9ee6-1e57-46ba-8440-27467ad986cf/image-capture-issue-vm-unexpectedly-started-after-guestinitiated-shutdown](http://social.msdn.microsoft.com/Forums/windowsazure/en-US/fafb9ee6-1e57-46ba-8440-27467ad986cf/image-capture-issue-vm-unexpectedly-started-after-guestinitiated-shutdown).**

You can use images from the Image Gallery to easily create virtual machines, or you can capture and use your own images to create customized virtual machines. An image is a virtual hard disk (.vhd) file that is used as a template for creating a virtual machine. An image is a template because it doesn’t have the specific settings that a configured virtual machine has, such as the computer name and user account settings. If you want to create multiple virtual machines that are set up the same way, you can capture an image of a configured virtual machine and use that image as a template.


1. Connect to the virtual machine by using the steps listed in [How to Log on to a Virtual Machine Running Windows Server] [].

2.	Open a Command Prompt window as an administrator.


3.	Change the directory to `%windir%\system32\sysprep`, and then run sysprep.exe.


4. 	The **System Preparation Tool** dialog box appears.


	In **System Cleanup Action**, select **Enter System Out-of-Box Experience (OOBE)** and make sure that **Generalize** is checked. For more information about using Sysprep, see [How to Use Sysprep: An Introduction][].

5.	In **Shutdown Options**, select **Shutdown**.

6.	Click **OK**.

7.	Sysprep shuts down the virtual machine, which changes the status of the machine in the [Management Portal](http://manage.windowsazure.com) to **Stopped**.


8.	Click **Virtual Machines**, and then select the virtual machine you want to capture.

9.	On the command bar, click **Capture**.

	The **Capture an Image from a Virtual Machine** dialog box appears.

10.	In **Image Name**, type a name for the new image.

11.	Before you add a Windows Server image to your set of custom images, it must be generalized by running Sysprep as instructed in the previous steps. Click **I have run Sysprep on the virtual machine** to indicate that you have done this.

12.	Click the check mark to capture the image. When you capture an image of a virtual machine, the machine is deleted.

	The new image is now available under **Images**.

	When you create a virtual machine by using the **From Gallery** method, you can use the image that you captured by clicking **My Images** on the **Choose an Image** page.

	

[How to Log on to a Virtual Machine Running Windows Server]:http://www.windowsazure.com/en-us/manage/windows/how-to-guides/log-on-a-windows-vm/
[How to Use Sysprep: An Introduction]:http://technet.microsoft.com/en-us/library/bb457073.aspx
[Run Sysprep.exe]: ./media/virtual-machines-capture-image-windows-server/SysprepCommand.png
[Enter Sysprep.exe options]: ./media/virtual-machines-capture-image-windows-server/SysprepGeneral.png
[The virtual machine is stopped]: ./media/virtual-machines-capture-image-windows-server/SysprepStopped.png
[Capture an image of the virtual machine]: ./media/virtual-machines-capture-image-windows-server/CaptureVM.png
[Enter the image name]: ./media/virtual-machines-capture-image-windows-server/Capture.png
[Image capture successful]: ./media/virtual-machines-capture-image-windows-server/CaptureSuccess.png
[Use the captured image]: ./media/virtual-machines-capture-image-windows-server/MyImagesWindows.png
