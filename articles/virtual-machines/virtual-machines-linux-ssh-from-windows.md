<properties 
	pageTitle="Use SSH keys with Windows for Linux VMs | Microsoft Azure" 
        description="Learn how to generate and use SSH keys on a Windows computer to connect to a Linux virtual machine on Azure." 
	services="virtual-machines-linux" 
	documentationCenter="" 
	authors="squillace" 
	manager="timlt" 
	editor=""
	tags="azure-service-management,azure-resource-manager" />

<tags 
	ms.service="virtual-machines-linux" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-linux" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/18/2016" 
	ms.author="rasquill"/>

# How to Use SSH keys with Windows on Azure

> [AZURE.SELECTOR]
- [Windows](virtual-machines-linux-ssh-from-windows.md)
- [Linux/Mac](virtual-machines-linux-mac-create-ssh-keys.md)

When you connect to Linux virtual machines (VMs) in Azure, you can use secure shell (SSH) keys to authenticate yourself rather than a username and password. Public-key cryptography provides a more secure way to log in to your Linux VM in Azure than Azure. Passwords are vulnerable to brute-force attacks, especially on Internet-facing VMs such as web servers. This article provides an overview of cryptographic keys and how to generate the appropriate keys on a Windows computer.


## Overview of SSH keys

**SSH** &#8212; or [secure shell](https://en.wikipedia.org/wiki/Secure_Shell) &#8212; is an encrypted connection protocol that allows secure logins over unsecured connections. It is the default connection protocol for Linux VMs hosted in Azure. 

You log in to your Linux VM through the use of public and private keys:

- The **public key** is placed on your Linux VM, or any other service you use with public-key cryptography.
- The **private key** is what you present to your Linux VM when you log in, to verify your credentials.

For a more detail overview of public-key cryptography, see [need reference]().

You connect to and manage Linux VMs in Azure using an **ssh** client. Windows computers do not typically have an **ssh** client installed. Common Windows clients you can install include:

- [puTTY and puTTYgen](http://www.chiark.greenend.org.uk/~sgtatham/putty/)
- [Git For Windows](https://git-for-windows.github.io/), which comes with the environment and tools
- [MobaXterm](http://mobaxterm.mobatek.net/)
- [Cygwin](https://cygwin.com/)

> [AZURE.NOTE] The latest Windows 10 Anniversary Update includes Bash for Windows. This allows you to run the Windows Subsytem for Linux and access utilities such as an SSH client. Bash for Windows is still under development, and is considered a beta release. For more information about Bash for Windows, see [Bash on Ubuntu on Windows](https://msdn.microsoft.com/commandline/wsl/about).


## Which key files do you need to create?

Azure requires at least 2048-bit, **ssh-rsa** format public and private keys. If you are managing resources using the Classic deployment model, you also need to generate a PEM (`.pem` file).

Here are the deployment scenarios, and the types of files you use in each:

1. **ssh-rsa** keys are required for any deployment using the [Azure portal](https://portal.azure.com), and Resource Manager deployments using the [Azure CLI](../xplat-cli-install.md).
    - This is usually all most people need.
2. `.pem` file is required to create VMs using the [Classic portal](https://manage.windowsazure.com). These keys are also supported in Classic deployments that use the [Azure CLI](../xplat-cli-install.md).
    - You only need to create these additional keys and certificates if you are managing resources created using the Classic deployment model.


## Get ssh-keygen and openssl on Windows ##

The preceding section listed several utilities that include an `ssh-keygen` and `openssl` for Windows. A couple of examples are listed below:

###Use Git for Windows###

1.	Download and install Git for Windows from the following location: [https://git-for-windows.github.io/](https://git-for-windows.github.io/)
2.	Run Git Bash from the Start Menu > All Apps > Git Shell

> [AZURE.NOTE] You may encounter the following error when running the `openssl` commands above:

        Unable to load config info from /usr/local/ssl/openssl.cnf

The easiest way to resolve this is to set the `OPENSSL_CONF` environment variable. The process for setting this variable will vary depending on the shell that you have configured in Github:

**Powershell:**

        $Env:OPENSSL_CONF="$Env:GITHUB_GIT\ssl\openssl.cnf"

**CMD:**

        set OPENSSL_CONF=%GITHUB_GIT%\ssl\openssl.cnf

**Git Bash:**

        export OPENSSL_CONF=$GITHUB_GIT/ssl/openssl.cnf
	

###Use Cygwin###

1.	Download and install Cygwin from the following location: [http://cygwin.com/](http://cygwin.com/)
2.	Ensure that the OpenSSL package and all of its dependencies are installed.
3.	Run `cygwin`

## Create a Private Key##

1.	Follow one of the set of instructions above to be able to run `openssl.exe`
2.	Type in the following command:

  ```
  openssl.exe req -x509 -nodes -days 365 -newkey rsa:2048 -keyout myPrivateKey.key -out myCert.pem
  ```
3.	Your screen should look like the following:

  ```
  $ openssl.exe req -x509 -nodes -days 365 -newkey rsa:2048 -keyout myPrivateKey.key -out myCert.pem
  Generating a 2048 bit RSA private key
  .......................................+++
  .......................+++
  writing new private key to 'myPrivateKey.key'
  -----
  You are about to be asked to enter information that will be incorporated
  into your certificate request.
  What you are about to enter is what is called a Distinguished Name or a DN.
  There are quite a few fields but you can leave some blank
  For some fields there will be a default value,
  If you enter '.', the field will be left blank.
  -----
  Country Name (2 letter code) [AU]:
  ```

4.	Answer the questions that are asked.
5.	It would have created two files: `myPrivateKey.key` and `myCert.pem`.
6.	If you are going to use the API directly, and not use the Management Portal, convert the `myCert.pem` to `myCert.cer` (DER encoded X509 certificate) using the following command:

  ```
  openssl.exe  x509 -outform der -in myCert.pem -out myCert.cer
  ```

## Create a PPK for Putty ##

1. Download and install Puttygen from the following location: [http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html)

2. Puttygen may not be able to read the private key that was created earlier (`myPrivateKey.key`). Run the following command to translate it into an RSA private key that Puttygen can understand:

		# openssl rsa -in ./myPrivateKey.key -out myPrivateKey_rsa
		# chmod 600 ./myPrivateKey_rsa

	The command above should produce a new private key called myPrivateKey_rsa.

3. Run `puttygen.exe`

4. Click the menu: File > Load a Private Key

5. Find your private key, which we named `myPrivateKey_rsa` above. You will need to change the file filter to show **All Files (\*.\*)**

6. Click **Open**. You will receive a prompt which should look like this:

	![linuxgoodforeignkey](./media/virtual-machines-linux-ssh-from-windows/linuxgoodforeignkey.png)

7. Click **OK**

8. Click **Save Private Key**, which is highlighted in the screenshot below:

	![linuxputtyprivatekey](./media/virtual-machines-linux-ssh-from-windows/linuxputtygenprivatekey.png)

9. Save the file as a PPK


## Use Putty to Connect to a Linux Machine ##

1.	Download and install putty from the following location: [http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html)
2.	Run putty.exe
3.	Fill in the host name using the IP from the Management Portal:

	![linuxputtyconfig](./media/virtual-machines-linux-ssh-from-windows/linuxputtyconfig.png)

4.	Before selecting **Open**, click the Connection > SSH > Auth tab to choose your private key. See the screenshot below for the field to fill in:

	![linuxputtyprivatekey](./media/virtual-machines-linux-ssh-from-windows/linuxputtyprivatekey.png)

5.	Click **Open** to connect to your virtual machine
 
