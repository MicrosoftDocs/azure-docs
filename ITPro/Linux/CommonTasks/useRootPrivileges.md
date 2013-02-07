<properties linkid="manage-linux-common-tasks-user-root-privileges" urlDisplayName="Use root privileges" pageTitle="Use root privileges on Linux virtual machines in Windows Azure" metaKeywords="" metaDescription="Learn how to use root privileges on a Linux virtual machine in Windows Azure." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />


#Using root privileges on Linux virtual machines in Windows Azure

<div chunk="../../shared/chunks/disclaimer.md" />

You can gain root priviliges on your Linux virtual machine using one of the following methods, depending on how you provisioned your virtual machine.

1. **Uploaded an SSH Key** - when provisioning the virtual machine, you uploaded a certificate (`.CER` file) as well as a user name and password.
2. **User name and password only** - when provisioning the virtual machine, you only provided a user name and password; **No** SSH Key.


##Uploaded an SSH key

Once you are already logged into your virtual machine using the SSH Key, you can run commands using `sudo`, an example:

	sudo chmod +x myscript.py

You will be prompted for a password when this occurs. Put in the password you provided when provisioning the machine.

**Note:** The password is still required even when using an SSH Key. This may cause issues with certain scripts and tools, so make sure they can support challenged `sudo` commands.


##User name and password

Once you are already logged into your virtual machine using your user name and password, you can run commands using `sudo`, an example:

	sudo chmod +x myscript.py

You will be prompted for a password when this occurs. Put in the password you provided when provisioning the machine.