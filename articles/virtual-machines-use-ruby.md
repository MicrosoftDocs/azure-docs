<properties urlDisplayName="What is Azure Multi-Factor Authentication?" pageTitle="What is Azure Multi-Factor Authentication?" metaKeywords="" description="Learn more about Azure Multi-Factor Authentication, a method of authentication that requires the use of more than one verification method and adds a critical second layer of security to user sign-ins and transactions." metaCanonical="" services="active-directory,multi-factor-authentication" documentationCenter="" title="How to Manage Azure Virtual Machines using Ruby" authors="larryfr" solutions="" manager="wpickett" editor="" />

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="na" ms.devlang="ruby" ms.topic="article" ms.date="09/17/2014" ms.author="larryfr" />



#How to Manage Azure Virtual Machines using Ruby

This guide will show you how to programmatically perform common management tasks for Azure Virtual Machines, such as creating and configuring VMs and adding data disks. The Azure SDK for Ruby provides access to service management functionality for a variety of Azure Services, including Azure Virtual machines.

##Table of Contents

* [What is service management?](#what-is)
* [Concepts](#concepts)
* [Create a management certificate](#setup-certificate)
* [Create a Ruby application](#create-app)
* [Configure your application to use the SDK](#configure-access)
* [Setup an Azure management connection](#setup-connection)
* [How To: Work with Virtual Machines](#virtual-machine)
* [How To: Work with images and disks](#vm-images)
* [How To: Work with Cloud Services](#cloud-services)
* [How To: Work with Storage Services](#storage-services)
* [Next steps](#next-steps)

## <a name="what-is"> </a>What is service management?

Azure provides [REST APIs for service management operations](http://msdn.microsoft.com/en-us/library/windowsazure/ee460799.aspx), including management of Azure Virtual Machines. The Azure SDK for ruby exposes management operations for Virtual Machines through the **Azure::VirtualMachineSerivce** class. Much of the virtual machine management functionality available through the [Azure Management Portal](https://manage.windowsazure.com) is accessible using this class.

While the service management API can be used to manage a variety of services hosted on Azure, this document only provides details for the management of Azure Virtual machines.

## <a name="concepts"> </a>Concepts

Azure Virtual Machines are implemented as 'roles' within a Cloud Service. Each Cloud Service can contain one or more roles, which are logically grouped into deployments. The role defines the overall physical characteristics of the VM, such as how much memory is available, how many CPU cores, etc.

Each VM also has an OS disk, which contains the bootable operating system. A VM can have one or more data disks, which are additional disks that should be used to store application data. Disks are implemented as virtual hard drives (VHD) stored in Azure Blob Storage. VHDs can also be exposed as 'images', which are templates that are used to create disks used by a VM during the VM creation. For example, creating a new VM that uses an Ubuntu image will result in a new OS disk being created from the Ubuntu image.

Most images are provided by Microsoft or partners, however you can create your own images or create an image from a VM hosted in Azure.

## <a name="setup-certificate"> </a>Create an Azure management certificate

When performing service management operations, such as those exposed through the **Azure::VirtualMachineService** class, you must provide your Azure Subscription ID and a file containing a management certificate for your subscription. Both are used by the SDK when authenticating to the Azure REST API.

You can obtain the subscription Id and a management certificate by using the Azure Cross-Platform Command-Line Interface (xplat-cli). See [Install and configure the Azure Cross-platform Command-Line Interface](http://www.windowsazure.com/en-us/manage/install-and-configure-cli/) for information on installing and configuring the xplat-cli.

Once the xplat-cli is configured, you can perform the following steps to retrieve your Azure subscription ID and export a management certificate:

1. To retrieve the subscription ID, use:

		azure account list

2. To export the management certificate, use the following command:

		azure account cert export

	After the command completes, the certificate will be exported to a file named &lt;azure-subscription-name&gt;.pem. For example, if your subscription is named **mygreatsubscription**, the file created will be named **mygreatsubscription.pem**.

Make note of the subscription ID and the location of the PEM file containing the exported certificate, as these will be used later in this document.

## <a name="create-app"></a>Create a Ruby application

Create a new Ruby application. The examples used in this document can be implemented in a single **.rb** file.

## <a name="configure-access"></a>Configure your application

To manage Azure Services, you need to download and use the Azure gem, which contains the Azure SDK for Ruby.

### Use the gem command to install the package

1.  Use a command-line interface such as **PowerShell** (Windows,) **Terminal** (Mac,) or **Bash** (UNIX), navigate to the folder where you created your sample application.

2. Use the following to install the azure gem:

		gem install azure

	You should see output similar to the following:

		Fetching: mini_portile-0.5.1.gem (100%)
		Fetching: nokogiri-1.6.0-x86-mingw32.gem (100%)
		Fetching: mime-types-1.25.gem (100%)
		Fetching: systemu-2.5.2.gem (100%)
		Fetching: macaddr-1.6.1.gem (100%)
		Fetching: uuid-2.3.7.gem (100%)
		Fetching: azure-0.5.0.gem (100%)
		Successfully installed mini_portile-0.5.1
		Successfully installed nokogiri-1.6.0-x86-mingw32
		Successfully installed mime-types-1.25
		Successfully installed systemu-2.5.2
		Successfully installed macaddr-1.6.1
		Successfully installed uuid-2.3.7
		Successfully installed azure-0.5.0
		7 gems installed

	<div class="dev-callout">
	<b>Note</b>
	<p>If you receive a permissions related error, use <code>sudo gem install azure</code> instead.</p>
	</div>

### Require the gem

Using a text editor, add the following to the top of your Ruby application file. This will load the azure gem and make the Azure SDK for Ruby available to your application:

	require 'azure'

## <a name="setup-connection"> </a>How to: Connect to service management

To successfully perform service management operations with Azure, you must specify the subscription ID and certificate obtained in the [Create an Azure management certificate](#setup-certificate) section. The easiest way to do this is to specify the ID and path to the certificate file using the following environment variables:

* AZURE\_MANAGEMENT\_CERTIFICATE - The path to the .PEM file containing the management certificate.

* AZURE\_SUBSCRIPTION\_ID - The subscription ID for your Azure subscription.

You can also set these values programmatically in your application by using the following:

	Azure.configure do |config|
	  config.management_certificate = 'path/to/certificate'
	  config.subscription_id = 'subscription ID'
	end

##<a name="virtual-machine"> </a>How to: Work with virtual machines

Management operations for Azure Virtual Machines are performed using the **Azure::VirtualMachineService** class.

###How to: Create a new virtual machine

To create a new virtual machine, use the **create\_virtual\_machine** method. This method accpets a hash containing the following parameters and returns a **Azure::VirtualMachineManagement::VirtualMachine** instance that describes the VM that was created:

**Paramaters**

* **:vm\_name** - The name of the virtual machine

* **:vm\_user** - The root or admin user name

* **:password** - The password to use for the root or admin user

* **:image** - The OS image that will be used to create the OS Disk for this VM. The OS disk will be stored in a VHD created in blob storage.

* **:location** - The region in which the VM will be created. This should be the same region as the storage account that contains the disks used by this VM.

The following is an example of creating a new virtual machine using these parameters:

	vm_params = {
	  :vm_name => 'mygreatvm',
	  :vm_user => 'myuser',
	  :password => 'mypassword',
	  :image => 'b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-13_04-amd64-server-20130824-en-us-30GB',
	  :location = 'East US'
	}

	vm_mgr = Azure::VirtualMachineService.new
	vm = vm_mgr.create_virtual_machine(vm_params)

	puts "A VM named #{vm.vm_name} was created in a cloud service named #{vm.cloud_service_name}."
	puts "It uses a disk named #{vm.disk_name}, which was created from a #{vm.os_type}-based image."
	puts "The virtual IP address of the machine is #{vm.ipaddress}."
    puts "The fully qualified domain name is #{vm.cloud_service_name}.cloudapp.net."

**Options**

You can supply a hash of optional parameters that allow you to override default behavior of the VM creation, such as specifying an existing storage account instead of creating a new one.

The following are the options that are available when using the **create\_virtual\_machine** method:

* **:storage\_account\_name** - The name of the storage account to use for storing disk images. If the storage account does not already exist, a new one is created. If ommitted, a new storage account is created with a name based on the :vm\_name param.

* **:cloud\_service\_name** - The name of the cloud service to use for hosting the virtual machine. If the cloud service does not already exist, a new one is created. If ommitted, a new cloud service account is created with a name based on the :vm\_name param.

* **:deployment\_name** - The name of the deployment to use when deploying the virtual machine configuration

* **:tcp\_endpoints** - The TCP ports to publicly expose for this VM. The SSH endpoint (for Linux-based VMs,) and WinRM endpoint (for Windows-based VMs) do not need to be specified, and will be created automatically. Multiple ports can be specified, seperated by a comma. To associate an internal port with a public port using a different port number, use the format **public port:internal port**. For example, 80:8080 exposes the internal port 8080 as public port 80.

* **:service\_location** - The target certificate store location on the VM. Only applies to Windows-based VMs.

* **:ssh\_private\_key\_file** - The file containing the private key, which will be used to secure SSH access to the Linux-based VM. It is also used to specify the certificate used to secure WinRM if the HTTPS transport is selected. If **:ssh\_private\_key\_file** and **:ssh\_certificate\_file** are omitted, SSH will use only password authentication

* **:ssh\_certificate\_file** - The file containing the certificate file, which will be used to secure SSH access to the Linux-based VM. It is also used to specify the certificate used to secure WinRM if the HTTPS transport is selected. If **:ssh\_private\_key\_file** and **:ssh\_certificate\_file** are omitted, SSH will use only password authentication

* **:ssh\_port** - The public port that will be used for SSH communication. If omitted, the SSH port defaults to 22.

* **:vm\_size** - The size of the VM. This determines memory size, number of cores, bandwidth, and other physical characteristics of the VM. See [Virtual Machine and Cloud Services sizes for Azure](http://msdn.microsoft.com/en-us/library/windowsazure/dn197896.aspx) for available sizes and physical characteristics.

* **:winrm_transport** - An array of the transports available for use with WinRM. Valid transports are 'http' and 'https'. If 'https' is specified as a transport, you must also use **:ssh\_private\_key\_file** and **:ssh\_certificate\_file** to specify the certificate used to secure the HTTPS communications.

The following is an example of creating a new virtual machine that uses a small compute instance, publicly exposes ports for HTTP(local port 8080, public port 80) and HTTPS(443) traffic, and enables certificate authentication for SSH sessions using the specified certificate files:

	vm_params = {
	  :vm_name => 'myvm',
	  :vm_user => 'myuser',
	  :password => 'mypassword',
	  :image => 'b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-13_04-amd64-server-20130824-en-us-30GB',
	  :location = 'East US'
	}

	vm_opts = {
      :tcp_endpoints => '80:8080,443',
      :vm_size => 'Small',
      :ssh_private_key_file => '../sshkey/mykey.key',
      :ssh_certificate_file => '../sshkey/mykey.pem'
	}

	vm_mgr = Azure::VirtualMachineService.new
	vm = vm_mgr.create_virtual_machine(vm_params, vm_opts)

###How to: List virtual machines

To list existing virtual machines for your Azure Subscription, use the **list\_virtual\_machines** method. This method returns an array of **Azure::VirtualMachineManagement::VirtualMachine** objects:

	vm_mgr = Azure::VirtualMachineService.new
	virtual_machines = vm_mgr.list_virtual_machines

###How to: Get information on a virtual machine

To get an instance of **Azure::VirtualMachineManagement::VirtualMachine** for a specific virtual machine, use the **get\_virtual\_machine** mathod and provide the virtual machine and cloud service names:

	vm_mgr = Azure::VirtualMachineService.new
	vm = vm_mgr.get_virtual_machine('myvm', 'mycloudservice')

###How to: Delete a virtual machine

To delete a virtual machine, use the **delete\_virtual\_machine** method and provide the virtual machine and cloud service names:

	vm_mgr = Azure::VirtualMachineService.new
	vm = vm_mgr.delete_virtual_machine('myvm', 'mycloudservice')

<div class="dev-callout">
<b>Warning</b>
<p>The <b>delete_virtual_machine</b> method deletes the cloud service and any disks associated with the virtual machine.</p>
</div>

###How to: Shutdown a virtual machine

To shut down a virtual machine, use the **shutdown\_virtual\_machine** method and provide the virtual machine and cloud service names:

	vm_mgr = Azure::VirtualMachineService.new
	vm = vm_mgr.shutdown_virtual_machine('myvm', 'mycloudservice')

###How to: Start a virtual machine

To start a virtual machine, use the **start\_virtual\_machine** method and provide the virtual machine and cloud service names:

	vm_mgr = Azure::VirtualMachineService.new
	vm = vm_mgr.start_virtual_machine('myvm', 'mycloudservice')

##<a name="vm-images"> </a>How to: Work with virtual machine images and disks

Operations on virtual machine images are performed using the **Azure::VirtualMachineImageService** class. Operations on disks are performed using the **Azure::VirtualMachineImageManagement::VirtualMachineDiskManagementService** class.

###How to: List virtual machine images

To list available virtual machine images, use the **list\_virtual\_machine\_images** method. This returns an array of **Azure::VirtualMachineImageService** objects.

	image_mgr = Azure::VirtualMachineImageService.new
	images = image_mgr.list_virtual_machine_images

###How to: List disks

To list disks for your Azure subscription, use the **list\_virtual\_machine\_disks** method. This returns an array of **Azure::VirtualMachineImageManagement::VirtualMachineDisk** objects.

	disk_mgr = Azure::VirtualMachineImageManagement::VirtualMachineDiskManagementService.new
	disks = disk_mgr.list_virtual_machine_disks

###How to: Delete a disk

To delete a disk, use the **delete\_virtual\_machine\_disk** method and specify the name of the disk to be deleted:

	disk_mgr = Azure::VirtualMachineImageManagement::VirtualMachineDiskManagementService.new
	disk_mgr.delete_virtual_machine_disk

##<a name="cloud-services"> </a>How to: Work with cloud Services

Management operations for Azure Cloud Services are performed using the **Azure::CloudService** class.

###How to: Create a cloud service

To create a new cloud service, use the **create\_cloud\_service** method and provide a name and a hash of options. Valid options are:

* **:location** - *Required*. The region in which the cloud service will be created.

* **:description** - A description of the cloud service.

The following creates a new cloud service in the East US region:

	cs_mgr = Azure::CloudService.new
	cs_mgr.create_cloud_service('mycloudservice', { :location => 'East US' })

###How to: List cloud services

To list the cloud services for your Azure subscription, use the **list\_cloud\_services** method. This method returns an array of **Azure::CloudServiceManagement::CloudService** objects:

	cs_mgr = Azure::CloudService.new
	cloud_services = cs_mgr.list_cloud_services

###How to: See if a cloud service already exists

To check if a specific cloud service already exists, use the **get\_cloud\_service** method and provide the name of the cloud service. Returns **true** if a cloud service of the specified name exists; otherwise, **false**.

	cs_mgr = Azure::CloudService.new
	cs_exists = cs_mgr.get_cloud_service('mycloudservice')

###How to: Delete a cloud service

To delete a cloud service, use the **delete\_cloud\_service** method and provide the name of the cloud service:

	cs_mgr = Azure::CloudService.new
	cs_mgr.delete_cloud_service('mycloudservice')

###How to: Delete a deployment

To delete a deployment for a cloud service, use the **delete\_cloud\_service\_deployment** method and provide the cloud service name:

	cs_mgr = Azure::CloudService.new
	cs_mgr.delete_cloud_service_deployment('mycloudservice')

##<a name="storage-services"> </a>How to: Work with storage services

Management operations for Azure Cloud Services are performed using the **Azure::StorageService** class.

###How to: Create a storage account

To create a new storage account, use the **create\_storage\_account** method and provide a name and a hash of options. Valid options are:

* **:location** - *Required*. The region in which the storage account will be created.

* **:description** - A description of the storage account.

The following creates a new storage account in the 'East US' region:

	storage_mgr = Azure::StorageService.new
	storage_mgr.create_storage_account('mystorage', { :location => 'East US' })

###How to: List storage accounts

To get a list of storage accounts for your Azure subscription, use the **list\_storage\_accounts** method. This method returns an array of **Azure::StorageManagement::StorageAccount** objects.

	storage_mgr = Azure::StorageService.new
	accounts = storage_mgr.list_storage_accounts

###How to: See if a storage account exists

To see if a specific storage account exists, use the **get\_storage\_account** method and specify the name of the storage account. Returns **true** if the storage account exists; otherwise, **false**.

	storage_mgr = Azure::StorageService.new
	store_exists = storage_mgr.get_storage_account('mystorage')

###How to: Delete a storage account

To delete a storage account, use the **delete\_storage\_account** method and specify the name of the storage account:

	storage_mgr = Azure::StorageService.new
	storage_mgr.delete_storage_account('mystorage')

##<a name="next-steps"> </a>Next Steps

Now that you've learned the basics of programmatically creating Azure Virtual machines, follow these links to learn how to do more about working with VMs.

* Visit the [Virtual Machines](http://www.windowsazure.com/en-us/documentation/services/virtual-machines/) feature page
*  See the MSDN Reference: [Virtual Machines](http://msdn.microsoft.com/en-us/library/windowsazure/jj156003.aspx)
* Learn how to host a [Ruby on Rails application on a Virtual Machine](http://www.windowsazure.com/en-us/develop/ruby/tutorials/web-app-with-linux-vm/)
