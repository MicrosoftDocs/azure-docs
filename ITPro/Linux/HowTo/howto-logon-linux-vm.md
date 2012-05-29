<properties umbracoNaviHide="0" pageTitle="How to Log on to a Virtual Machine Running Linux" metaKeywords="Windows Azure virtual machine, Azure virtual machine, log on, logon, log on to virtual machines" metaDescription="Learn how to log on to a virtual machine." linkid="manage-linux-how-to-guide-virtual-machines" urlDisplayName="How To Guides" headerExpose="" footerExpose="" disqusComments="1" />
#How to Log on to a Virtual Machine Running Linux #

For a virtual machine that is running the Linux operating system, you use a Secure Shell (SSH) client to logon.

You must install an SSH client on your computer that you want to use to log on to the virtual machine. There are many SSH client programs that you can choose from. The following are possible choices:

- If you are using a computer that is running a Windows operating system, you might want to use an SSH client such as PuTTY. For more information, see the [PuTTY Download Page](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).
- If you are using a computer that is running a Linux operating system, you might want to use an SSH client such as OpenSSH. For more information, see [OpenSSH](http://www.openssh.org/).

This procedure shows you how to use the PuTTY program to access the virtual machine.

1. Find the **Host Name** and **Port information** from the [Management Portal](http://manage.windowsazure.com). You can find the information that you need from the dashboard of the virtual machine. Click the virtual machine name and look for the **SSH Details** in the **Quick Glance** section of the dashboard.

	![Obtain SSH details] (../media/sshdetails.png)

2. Open the PuTTY program.

3. Enter the Host Name and the Port information that you collected from the dashboard, and then click **Open**.

	![Open PuTTY] (../media/putty.png)

4. Log on to the virtual machine using the account that you specified when the machine was created.

	![Log on to the virtual machine] (../media/sshlogin.png)

	You can now work with the virtual machine just as you would with any other server.