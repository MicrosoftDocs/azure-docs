<properties 
	pageTitle="Use SSH on Linux and Mac | Microsoft Azure" 
	description="Generate and use SSH keys on Linux and Mac for the Resource Manager and classic deployment models on Azure." 
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
	ms.date="04/15/2016" 
	ms.author="rasquill"/>

#How to Use SSH with Linux and Mac on Azure

> [AZURE.SELECTOR]
- [Windows](virtual-machines-linux-ssh-from-windows.md)
- [Linux/Mac](virtual-machines-linux-ssh-from-linux.md)

This topic describes how to use **ssh-keygen** and **openssl** on Linux and Mac to create and use **ssh-rsa** format and **.pem** format files to secure communication with Azure VMs based on Linux. Creating Linux-based Azure Virtual Machines using the Resource Manager deployment model is recommended for new deployments and takes an *ssh-rsa* type public key file or string (depending on the deployment client). The [Azure portal](https://portal.azure.com) currently accepts only the **ssh-rsa** format strings, whether for classic or Resource Manager deployments.

> [AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]
To create these types of files for use on a Windows computer to communicate securely with Linux VMs in Azure, see [Use SSH keys on Windows](virtual-machines-linux-ssh-from-windows.md). 

## Which files do you need?

A basic ssh setup for Azure includes an **ssh-rsa** public and private key pair of 2048 bits (by default, **ssh-keygen** stores these files as **~/.ssh/id_rsa** and **~/.ssh/id-rsa.pub** unless you change the defaults) as well as a `.pem` file generated from the **id_rsa** private key file for use with the classic deployment model of the classic portal. 

Here are the deployment scenarios, and the types of files you use in each:

1. **ssh-rsa** keys are required for any deployment using the [Azure portal](https://portal.azure.com), regardless of the deployment model.
2. .pem file are required to create VMs using the [classic portal](https://manage.windowsazure.com). .pem files are also supported in classic deployments that use the [Azure CLI](../xplat-cli-install.md). 

## Create keys for use with SSH

If you already have SSH keys, pass the public key file when creating your Azure VM. 

If you need to create the files:

1. Make sure your implementation of **ssh-keygen** and **openssl** is up to date. This varies by platform. 

	- For Mac, be sure to visit the [Apple Product Security web site](https://support.apple.com/HT201222) and choose the proper updates if necessary.
	- For Debian-based Linux distributions such as Ubuntu, Debian, Mint, and so on:

			sudo apt-get install --upgrade-only openssl

	- For RPM-based Linux distributions such as CentOS and Oracle Linux:

			sudo yum update openssl

	- For SLES and OpenSUSE

			sudo zypper update openssl

2. Use **ssh-keygen** to create a 2048-bit RSA public and private key files, and unless you have a specific location or specific names for the files, accept the default location and name of `~/.ssh/id_rsa`. The basic command is:

		ssh-keygen -t rsa -b 2048 

	Typically, your **ssh-keygen** implementation adds a comment, often the username and host name of the computer. You can specify a specific comment using the `-C` option.

3. Create a .pem file from your `~/.ssh/id_rsa` file to enable you to work with the classic portal. Use the **openssl** as follows:

		openssl req -x509 -key ~/.ssh/id_rsa -nodes -days 365 -newkey rsa:2048 -out myCert.pem

	If you want to create a .pem file from a different private key file, modify the `-key` argument. 

> [AZURE.NOTE] If you plan to manage services deployed with the classic deployment model, you may also want to create a **.cer** format file to upload to the portal -- although this doesn't involve **ssh** or connecting to Linux VMS, which is the subject of this article. To convert your .pem file into a DER encoded X509 certificate file on Linux or Mac, type:
<br />
  openssl  x509 -outform der -in myCert.pem -out myCert.cer

## Use SSH keys you already have

You can use ssh-rsa (`.pub`) keys for all new work, especially with the Resource Manager deployment model and the preview portal; you may need to create a `.pem` file from your keys if you need to use the classic portal.

## Create a VM with your public key file

Once you've created the files you need, there are many ways to create a VM to which you can securely connect using a public-private key exchange. In almost all situations, especially using Resource Manager deployments, pass the .pub file when prompted for an ssh key file path or the contents of a file as a string. 

### Example: Creating a VM with the id_rsa.pub file

The most common usage is when imperatively creating a VM -- or uploading a template to create a VM. The following code example shows creating a new, secure Linux VM in Azure by passing the public file name (in this case, the default `~/.ssh/id_rsa.pub` file) to the `azure vm create` command. (The other arguments, such as resource group and storage account, were previously created.). This example uses the Resource Manager deployment method, so ensure your Azure CLI is set accordingly with `azure config mode arm`:

	azure vm create \
	--nic-name testnic \
	--public-ip-name testpip \
	--vnet-name testvnet \
	--vnet-subnet-name testsubnet \
	--storage-account-name computeteststore 
	--image-urn canonical:UbuntuServer:14.04.4-LTS:latest \
	--username ops \
	-ssh-publickey-file ~/.ssh/id_rsa.pub \
	testrg testvm westeurope linux

The next example shows the use of the **ssh-rsa** format with a Resource Manager template and the Azure CLI to create an Ubuntu VM that is secured by a username and the contents of the `~/.ssh/id_rsa.pub` as a string. (In this case, the public key string is shortened to be more readable.) 

	azure group deployment create \
	--resource-group test-sshtemplate \
	--template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-sshkey/azuredeploy.json \
	--name mysshdeployment
	info:    Executing command group deployment create
	info:    Supply values for the following parameters
	testnewStorageAccountName: testsshvmtemplate3
	adminUserName: ops
	sshKeyData: ssh-rsa AAAAB3NzaC1yc2EAAAADAQA+/L+rHIjz+nXTzxApgnP+iKDZco9 user@macbookpro
	dnsNameForPublicIP: testsshvmtemplate
	location: West Europe
	vmName: sshvm
	+ Initializing template configurations and parameters
	+ Creating a deployment
	info:    Created template deployment "mysshdeployment"
	+ Waiting for deployment to complete
	data:    DeploymentName     : mysshdeployment
	data:    ResourceGroupName  : test-sshtemplate
	data:    ProvisioningState  : Succeeded
	data:    Timestamp          : 2015-10-08T00:12:12.2529678Z
	data:    Mode               : Incremental
	data:    TemplateLink       : https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-vm-sshkey/azuredeploy.json
	data:    ContentVersion     : 1.0.0.0
	data:    Name                   Type    Value

	data:    newStorageAccountName  String  testtestsshvmtemplate3
	data:    adminUserName          String  ops
	data:    sshKeyData             String  ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDAkek3P6V3EhmD+xP+iKDZco9 user@macbookpro
	data:    dnsNameForPublicIP     String  testsshvmtemplate
	data:    location               String  West Europe
	data:    vmSize                 String  Standard_A2
	data:    vmName                 String  sshvm
	data:    ubuntuOSVersion        String  14.04.4-LTS
	info:    group deployment create command OK


### Example: Creating a VM with a .pem file

You can then use the .pem file with either the classic portal or with the classic deployment mode (`azure config mode asm`) and `azure vm create`, as in the following example:

	azure vm create \
	-l "West US" -n testpemasm \
	-P -t myCert.pem -e 22 \
	testpemasm \
	b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_04_4-LTS-amd64-server-20160406-en-us-30GB \
	ops
	info:    Executing command vm create
	warn:    --vm-size has not been specified. Defaulting to "Small".
	+ Looking up image b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_04_4-LTS-amd64-server-20160406-en-us-30GB
	+ Looking up cloud service
	info:    cloud service testpemasm not found.
	+ Creating cloud service
	+ Retrieving storage accounts
	+ Configuring certificate
	+ Creating VM
	info:    vm create command OK


## Connect to your VM

The **ssh** command takes a username to log on with, the network address of the computer, and the port at which to connect to the address -- as well as many other special variations. (For more information about **ssh**, you might start with this [article on Secure Shell](https://en.wikipedia.org/wiki/Secure_Shell)) 

A typical usage with Resource Manager deployment might look like the following, if you've merely specified a subdomain and a deployment location:

	ssh user@subdomain.westus.cloudapp.azure.com -p 22

or, if you are connecting to a classic deployment cloud service the address you would use might look like this:

	ssh user@subdomain.cloudapp.net -p 22

Because the address form can change -- you can always use the IP address or perhaps you have a custom domain name assigned -- you'll need to discover the address of your Azure VM. 

### Discovering your Azure VM SSH address with classic deployments

You can discover the address to use with a VM and the classic deployment model by using the `azure vm show` command with the VM name:

	azure vm show testpemasm
	info:    Executing command vm show
	+ Getting virtual machines
	data:    DNSName "testpemasm.cloudapp.net"
	data:    Location "West US"
	data:    VMName "testpemasm"
	data:    IPAddress "100.116.160.154"
	data:    InstanceStatus "ReadyRole"
	data:    InstanceSize "Small"
	data:    Image "b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_04_3-LTS-amd64-server-20150908-en-us-30GB"
	data:    OSDisk hostCaching "ReadWrite"
	data:    OSDisk name "testpemasm-testpemasm-0-201510102050230517"
	data:    OSDisk mediaLink "https://portalvhds4blttsxgjj1rf.blob.core.windows.net/vhd-store/testpemasm-2747c9c432b043ff.vhd"
	data:    OSDisk sourceImageName "b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_04_3-LTS-amd64-server-20150908-en-us-30GB"
	data:    OSDisk operatingSystem "Linux"
	data:    OSDisk iOType "Standard"
	data:    ReservedIPName ""
	data:    VirtualIPAddresses 0 address "40.83.178.221"
	data:    VirtualIPAddresses 0 name "testpemasmContractContract"
	data:    VirtualIPAddresses 0 isDnsProgrammed true
	data:    Network Endpoints 0 localPort 22
	data:    Network Endpoints 0 name "ssh"
	data:    Network Endpoints 0 port 22
	data:    Network Endpoints 0 protocol "tcp"
	data:    Network Endpoints 0 virtualIPAddress "40.83.178.221"
	data:    Network Endpoints 0 enableDirectServerReturn false
	info:    vm show command OK

### Discovering your Azure VM SSH address with Resource Manager deployments

	azure vm show testrg testvm
	info:    Executing command vm show
	+ Looking up the VM "testvm"
	+ Looking up the NIC "testnic"
	+ Looking up the public ip "testpip"

Examine the network profile section:

	data:    Network Profile:
	data:      Network Interfaces:
	data:        Network Interface #1:
	data:          Id                        :/subscriptions/<guid>/resourceGroups/testrg/providers/Microsoft.Network/networkInterfaces/testnic
	data:          Primary                   :true
	data:          MAC Address               :00-0D-3A-21-8E-AE
	data:          Provisioning State        :Succeeded
	data:          Name                      :testnic
	data:          Location                  :westeurope
	data:            Private IP alloc-method :Static
	data:            Private IP address      :192.168.1.101
	data:            Public IP address       :40.115.48.189
	data:            FQDN                    :testsubdomain.westeurope.cloudapp.azure.com
	data:
	data:    Diagnostics Instance View:
	info:    vm show command OK

If you didn't use the default SSH port of 22 when you created the VM, you can discover what ports have inbound rules with the `azure network nsg show` command, like the following example:

	azure network nsg show testrg testnsg
	info:    Executing command network nsg show
	+ Looking up the network security group "testnsg"
	data:    Id                              : /subscriptions/<guid>/resourceGroups/testrg/providers/Microsoft.Network/networkSecurityGroups/testnsg
	data:    Name                            : testnsg
	data:    Type                            : Microsoft.Network/networkSecurityGroups
	data:    Location                        : westeurope
	data:    Provisioning state              : Succeeded
	data:    Security group rules:
	data:    Name                           Source IP          Source Port  Destination IP  Destination Port  Protocol  Direction  Access  Priority
	data:    -----------------------------  -----------------  -----------  --------------  ----------------  --------  ---------  ------  --------
	data:    testnsgrule                    *                  *            *               22                Tcp       Inbound    Allow   1000
	data:    AllowVnetInBound               VirtualNetwork     *            VirtualNetwork  *                 *         Inbound    Allow   65000
	data:    AllowAzureLoadBalancerInBound  AzureLoadBalancer  *            *               *                 *         Inbound    Allow   65001
	data:    DenyAllInBound                 *                  *            *               *                 *         Inbound    Deny    65500
	data:    AllowVnetOutBound              VirtualNetwork     *            VirtualNetwork  *                 *         Outbound   Allow   65000
	data:    AllowInternetOutBound          *                  *            Internet        *                 *         Outbound   Allow   65001
	data:    DenyAllOutBound                *                  *            *               *                 *         Outbound   Deny    65500
	info:    network nsg show command OK

### Example: Output of SSH session using .pem keys and classic deployment

If you created a VM using a .pem file created from your `~/.ssh/id_rsa` file, you can directly ssh into that VM. Note that when you do, the certificate handshake will use your private key at `~/.ssh/id_rsa`. (The VM creation process computes the public key from the .pem and places the ssh-rsa form of the public key in `~/.ssh/authorized_users`.) Connecting might look like the following example:

	ssh ops@testpemasm.cloudapp.net -p 22
	The authenticity of host 'testpemasm.cloudapp.net (40.83.178.221)' can't be established.
	RSA key fingerprint is dc:bb:e4:cc:59:db:b9:49:dc:71:a3:c8:37:36:fd:62.
	Are you sure you want to continue connecting (yes/no)? yes
	Warning: Permanently added 'testpemasm.cloudapp.net,40.83.178.221' (RSA) to the list of known hosts.
	
    Welcome to Ubuntu 14.04.4 LTS (GNU/Linux 3.19.0-49-generic x86_64)
	
	* Documentation:  https://help.ubuntu.com/

    System information as of Fri Apr 15 18:51:42 UTC 2016

    System load: 0.31              Memory usage: 2%   Processes:       213
    Usage of /:  42.1% of 1.94GB   Swap usage:   0%   Users logged in: 0

    Graph this data and manage this system at:
    https://landscape.canonical.com/

    Get cloud support with Ubuntu Advantage Cloud Guest:
    http://www.ubuntu.com/business/services/cloud

    0 packages can be updated.
	0 updates are security updates.
	
	The programs included with the Ubuntu system are free software;
	the exact distribution terms for each program are described in the
	individual files in /usr/share/doc/*/copyright.
	
	Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
	applicable law.


## If you have trouble connecting

You can read the suggestions at [Troubleshooting SSH Connections](virtual-machines-linux-troubleshoot-ssh-connection.md) to see if they can help resolve the situation.

## Next steps
 
Now that you've connected to your VM, make sure to update your chosen distribution before continuing to use it.
