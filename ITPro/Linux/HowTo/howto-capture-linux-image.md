<properties umbracoNaviHide="0" pageTitle="How to Capture an Image of a Virtual Machine Running Linux" metaKeywords="Windows Azure virtual machine, Azure virtual machine, Azure image, capture an image, image" metaDescription="Learn how to capture your own images to create customized virtual machines." linkid="manage-linux-how-to-guide-virtual-machines" urlDisplayName="Virtual Machines" headerExpose="" footerExpose="" disqusComments="1" />
# How to Capture an Image of a Virtual Machine Running Linux ##

You can use images from the Image Gallery to easily create virtual machines, or you can capture and use your own images to create customized virtual machines. An image is a virtual hard disk (VHD) file that is used as a template for creating a virtual machine. An image is a template because it doesn’t have specific settings like a configured virtual machine, such as the computer name and user account settings. If you want to create multiple virtual machines that are set up the same way, you can capture an image of a configured virtual machine and use that image as a template.

1. Connect to the virtual machine by using the steps listed in [How to Log on to a Virtual Machine Running Linux][].

2. In the SSH window, type the following command, and then enter the password for the account that you created on the virtual machine:

	`sudo waagent –deprovision`

	![Deprovision the virtual machine][Deprovision the virtual machine]

3. Type **y** to continue.

	![Deprovision of virtual machine successful][Deprovision of virtual machine successful]

4. Type **Exit** to close the SSH client.

5. In the [Management Portal](http://manage.windowsazure.com), select the virtual machine, and then click **Shutdown**.

	![Shutdown the virtual machine][Shutdown the virtual machine]

6. Click **Yes** to acknowledge that you will continue to be billed for the virtual machine when it is not running.

7. When the virtual machine is stopped, on the command bar, click **Capture**.

	![Capture an image of the virtual machine][Capture an image of the virtual machine]

	The **Capture Virtual Machine** dialog box appears.
	
	![Enter the details of the capture][Enter the details of the capture]

8.	In **Image Name**, enter the name for the new image.

9.	All Linux images must be deprovisioned by running the waagent command with the –deprovision option. Click **I have run the de-provision command on the Virtual Machine** to indicate that the operating system is prepared to be an image.

10.	Click the check mark to capture the image.

	The new image is now available under **Images**. The virtual machine is deleted after the image is captured.

	![Image capture successful][Image capture successful]

	When you create a virtual machine by using the **From Gallery** method, you can use the image that you captured by clicking **My Images** on the **VM OS Selection** page.

	![Use the captured image][Use the captured image]

## <a id="nextsteps"> </a>Next Steps ##

Now that you have learned the basics of creating a virtual machine, follow these links to learn how to do more complex tasks.

- Deploy a Virtual Machine to a Virtual Network or Subnets
- Add a Virtual Machine to the Local Domain by Using on Premises DNS/AD
[How to Log on to a Virtual Machine Running Linux]: ./howto-log-into-VM/
[Deprovision the virtual machine]: ../media/linuxdeprovision.png
[Deprovision of virtual machine successful]:../media/linuxdeprovision2.png
[Shutdown the virtual machine]:../media/shutdownvm.png
[Capture an image of the virtual machine]:../../windows/media/capturevm.png
[Enter the details of the capture]:../media/capturelinux.png
[Image capture successful]:../../windows//media/capturesuccess.png
[Use the captured image]:../media/myimageslinux.png