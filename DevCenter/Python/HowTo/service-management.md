<properties linkid="develop-python-service-management" urlDisplayName="Service Management" pageTitle="How to use the service management API (Python) - feature guide" metaKeywords="" metaDescription="Learn how to programmatically perform common service management tasks from Python." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />

<div chunk="../chunks/article-left-menu.md" />

# How to use Service Management from Python

This guide will show you how to programmatically perform common service management tasks from Python. The **ServiceManagementService** class in the [Windows Azure SDK for Python][download-SDK-Python] supports programmatic access to much of the service management-related functionality that is available in the [management portal][management-portal] (such as **creating, updating, and deleting cloud services, deployments, storage services, virtual machines and affinity groups**). This functionality can be useful in building applications that need programmatic access to service management. 

##Table of Contents

* [What is Service Management](#WhatIs)
* [Concepts](#Concepts)
* [How to: Connect to service management](#Connect)
* [How to: List available locations](#ListAvailableLocations)
* [How to: Create a cloud service](#CreateCloudService)
* [How to: Delete a cloud service](#DeleteCloudService)
* [How to: Create a deployment](#CreateDeployment)
* [How to: Update a deployment](#UpdateDeployment)
* [How to: Move deployments between staging and production](#MoveDeployments)
* [How to: Delete a deployment](#DeleteDeployment)
* [How to: Create a storage service](#CreateStorageService)
* [How to: Delete a storage service](#DeleteStorageService)
* [How to: Create an affinity group](#CreateAffinityGroup)
* [How to: Delete an affinity group](#DeleteAffinityGroup)
* [How to: List available operating systems](#ListOperatingSystems)
* [How to: Create an operating system image](#CreateVMImage)
* [How to: Delete an operating system image](#DeleteVMImage)
* [How to: Create a virtual machine](#CreateVM)
* [How to: Delete a virtual machine](#DeleteVM)
* [Next Steps](#NextSteps)

<h2 id="WhatIs">What is Service Management</h2>
The Service Management API provides programmatic access to much of the service management functionality available through the [management portal][management-portal]. The Windows Azure SDK for Python allows you to manage your cloud services, storage accounts, and affinity groups.

To use the Service Management API, you will need to [create a Windows Azure account](http://www.windowsazure.com/en-us/pricing/free-trial/). 

<h2 id="Concepts">Concepts</h2>
The Windows Azure SDK for Python wraps the [Windows Azure Service Management API][svc-mgmt-rest-api], which is a REST API. All API operations are performed over SSL and mutually authenticated using X.509 v3 certificates. The management service may be accessed from within a service running in Windows Azure, or directly over the Internet from any application that can send an HTTPS request and receive an HTTPS response.

<h2 id="Connect">How to: Connect to service management</h2>
To connect to the Service Management endpoint, you need your Windows Azure subscription ID and the path to a valid management certificate. You can obtain your subscription ID through the [management portal][management-portal], and you can create management certificates in a number of ways. In this guide [OpenSSL](http://www.openssl.org/) is used, which you can [download for Windows](http://www.openssl.org/related/binaries.html) and run in a console.

You actually need to create two certificates, one for the server (a `.cer` file) and one for the client (a `.pem` file). To create the `.pem` file, execute this:

	`openssl req -x509 -nodes -days 365 -newkey rsa:1024 -keyout mycert.pem -out mycert.pem`

To create the `.cer` certificate, execute this:

	`openssl x509 -inform pem -in mycert.pem -outform der -out mycert.cer`

For more information about Windows Azure certificates, see [Overview of Certificates in Windows Azure](http://msdn.microsoft.com/en-us/library/windowsazure/gg981935.aspx). For a complete description of OpenSSL parameters, see the documentation at [http://www.openssl.org/docs/apps/openssl.html](http://www.openssl.org/docs/apps/openssl.html).

After you have created these files, you will need to upload the `.cer` file to Windows Azure via the [management portal][management-portal], and you will need to make note of where you saved the `.pem` file.

After you have obtained your subscription ID, created a certificate, and uploaded the `.cer` file to Windows Azure, you can connect to the Windows Azure managent endpoint by passing the subscription id and the path to the `.pem` file to **ServiceManagementService**:

	from azure import *
	from azure.servicemanagement import *

	subscription_id = '<your_subscription_id>'
	certificate_path = '<path_to_.pem_certificate>'
	
	sms = ServiceManagementService(subscription_id, certificate_path)

In the example above, `sms` is a **ServiceManagementService** object. The **ServiceManagementService** class is the primary class used to manage Windows Azure services. 

<h2 id="ListAvailableLocations">How to: List available locations</h2>

To list the locations that are available for hosting services, use the **list\_locations** method:

	from azure import *
	from azure.servicemanagement import *

	sms = ServiceManagementService(subscription_id, certificate_path)

	result = sms.list_locations()
	for location in result:
		print(location.name)

When you create a cloud service, storage service, or affinity group, you will need to provide a valid location. The **list\_locations** method will always return an up-to-date list of the currently available locations. As of this writing, the available locations are:

- West Europe 
- Southeast Asia 
- East Asia 
- North Central US 
- North Europe 
- South Central US 
- West US 
- East US

<h2 id="CreateCloudService">How to: Create a cloud service</h2>

When you create an application and run it in Windows Azure, the code and configuration together are called a Windows Azure [cloud service] (known as a *hosted service* in earlier Windows Azure releases). The **create\_hosted\_service** method allows you to create a new hosted service by providing a hosted service name (which must be unique in Windows Azure), a label (automatically encoded to base64), a description and a location. You can specify an affinity group instead of a location for your service. 

	from azure import *
	from azure.servicemanagement import *

	sms = ServiceManagementService(subscription_id, certificate_path)

	name = 'myhostedservice'
	label = 'myhostedservice'
	desc = 'my hosted service'
	location = 'West US'

	# You can either set the location or an affinity_group
	sms.create_hosted_service(name, label, desc, location)

You can list all the hosted services for your subscription with the **list\_hosted\_services** method:

	result = sms.list_hosted_services()

	for hosted_service in result:
		print('Service name: ' + hosted_service.service_name)
		print('Management URL: ' + hosted_service.url)
		print('Affinity group: ' + hosted_service.hosted_service_properties.affinity_group)
		print('Location: ' + hosted_service.hosted_service_properties.location)
		print('')

If you want to get information about a particular hosted service, you can do so by passing the hosted service name to the **get\_hosted\_service\_properties** method:

	hosted_service = sms.get_hosted_service_properties('myhostedservice')

	print('Service name: ' + hosted_service.service_name)
	print('Management URL: ' + hosted_service.url)
	print('Affinity group: ' + hosted_service.hosted_service_properties.affinity_group)
	print('Location: ' + hosted_service.hosted_service_properties.location)
			
After you have created a cloud service, you can deploy your code to the service with the **create\_deployment** method.

<h2 id="DeleteCloudService">How to: Delete a cloud service</h2>

You can delete a cloud service by passing the service name to the **delete\_hosted\_service** method:

	sms.delete_hosted_service('myhostedservice')

Note that before you can delete a service, all deployments for the the service must first be deleted. (See [How to: Delete a deployment](#DeleteDeployment) for details.)

<h2 id="CreateDeployment">How to: Create a deployment</h2>

The **create\_deployment** method uploads a new [service package] and creates a new deployment in the staging or production environment. The parameters for this method are as follows:

* **name**: The name of the hosted service.
* **deployment\_name**: The name of the deployment.
* **slot**: A string indicating the `staging` or `production` slot.
* **package_url**: The URL for the deployment package (a .cspgk file). The package file must be stored in a Windows Azure Blob Storage account under the same subscription as the hosted service to which the package is being uploaded. You can create a deployment package with the [Windows Azure PowerShell cmdlets], or with the [cspack commandline tool].
* **configuration**: The service configuration file (.cscfg file) encoded to base64.
* **label**: The label for the hosted service name (automatically encoded to base64).

The following example creates a new deployment `v1` for a hosted service called `myhostedservice`:

	from azure import *
	from azure.servicemanagement import *
	import base64

	sms = ServiceManagementService(subscription_id, certificate_path)

	name = 'myhostedservice'
	deployment_name = 'v1'
	slot = 'production'
	package_url = 'URL_for_.cspkg_file'
	configuration = base64.b64encode(open('path_to_cscfg', 'rb'))
	label = 'myhostedservice'

	result = sms.create_deployment(name, slot, deployment_name, package_url, label, configuration)

	operation_result = sms.get_operation_status(result.request_id)
	print('Operation status: ' + operation_result.status)

Note in the example above that the status of the **create\_deployment** operation can be retrieved by passing the result returned by **create\_deployment** to the **get\_operation\_status** method.

You can access deployment properties with the **get\_deployment\_by\_slot** or **get\_deployment\_by\_name** methods. The following example retrieves a deployment by specifying the deployment slot. The example also iterates through all the instances for the deployment:

	result = sms.get_deployment_by_slot('myhostedservice', 'production')

	print('Name: ' + result.name)
	print('Slot: ' + result.deployment_slot)
	print('Private ID: ' + result.private_id)
	print('Status: ' + result.status)
	print('Instances:')
	for instance in result.role_instance_list:
		print('Instance name: ' + instance.instance_name)
		print('Instance status: ' + instance.instance_status)
		print('Instance size: ' + instance.instance_size)

<h2 id="UpdateDeployment">How to: Update a deployment</h2>

A deployment can be updated by using the **change\_deployment\_configuration** method or the **update\_deployment\_status** method.

The **change\_deployment\_configuration** method allows you to upload a new service configuration (`.cscfg`) file, which will change any of several service settings (including the number of instances in a deployment). For more information, see [Windows Azure Service Configuration Schema (.cscfg)]. The following example demonstrates how to upload a new service configuration file:

	from azure import *
	from azure.servicemanagement import *
	import base64

	sms = ServiceManagementService(subscription_id, certificate_path)

	name = 'myhostedservice'
	deployment_name = 'myhostedservice'
	configuration = base64.b64encode(open('path_to_cscfg', 'rb'))

	result = sms.change_deployment_configuration(name, deployment_name, configuration)

	operation_result = sms.get_operation_status(result.request_id)
	print('Operation status: ' + operation_result.status)


Note in the example above that the status of the **change\_deployment\_configuration** operation can be retrieved by passing the result returned by **change\_deployment\_configuration** to the **get\_operation\_status** method.

The **update\_deployment\_status** method allows you to set a deployment status to RUNNING or SUSPENDED. The following example demonstrates how to set the status to RUNNING for a deployment named `v1` of a hosted service called `myhostedservice`:

	from azure import *
	from azure.servicemanagement import *

	sms = ServiceManagementService(subscription_id, certificate_path)

	name = 'myhostedservice'
	deployment_name = 'v1'

	result = update_deployment_status(name, deployment_name, 'Running')

<h2 id="MoveDeployments">How to: Move deployments between staging and production</h2>

Windows Azure provides two deployment environments: staging and production. Typically a service is deployed to the staging environment to test it before deploying the service to the production environment. When it is time to promote the service in staging to the production environment, you can do so without redeploying the service. This can be done by swapping the deployments. (For more information on swapping deployments, see [Overview of Managing Deployments in Windows Azure].)

The following example shows how to use the **swap\_deployment** method to swap two deployments (with deployment names `v1` and `v2`). In the example, prior to calling **swap\_deployment**, deployment `v1` is in the production slot and deployment `v2` is in the staging slot. After calling **swap\_deployment**, `v2` is in production and `v1` is in staging.  

	from azure import *
	from azure.servicemanagement import *

	sms = ServiceManagementService(subscription_id, certificate_path)

	result = sms.swap_deployment('myhostedservice', 'v1', 'v2')

<h2 id="DeleteDeployment">How to: Delete a deployment</h2>

To delete a deployment, use the **delete\_deployment** method. The following example shows how to delete a deployment named `v1`.

	from azure import *
	from azure.servicemanagement import *

	sms = ServiceManagementService(subscription_id, certificate_path)

	sms.delete_deployment('myhostedservice', 'v1')

<h2 id="CreateStorageService">How to: Create a storage service</h2>

A [storage service] gives you access to Windows Azure [Blobs][azure-blobs], [Tables][azure-tables], and [Queues][azure-queues]. To create a storage service, you need a name for the service (between 3 and 24 lowercase characters and unique within Windows Azure), a description, a label (up to 100 characters, automatically encoded to base64), and either a location or an affinity group. The following example shows how to create a storage service by specifying a location. If you want to use an affinity group, you have to create an affinity group first (see [How to: Create an affinity group](#CreateAffinityGroup)) and set it with the **affinity\_group** parameter.

	from azure import *
	from azure.servicemanagement import *

	sms = ServiceManagementService(subscription_id, certificate_path)

	name = 'mystorageaccount'
	label = 'mystorageaccount'
	location = 'West US'
	desc = 'My storage account description.'

	result = sms.create_storage_account(name, desc, label, location=location)

	operation_result = sms.get_operation_status(result.request_id)
	print('Operation status: ' + operation_result.status)

Note in the example above that the status of the **create\_storage\_account** operation can be retrieved by passing the result returned by **create\_storage\_account** to the **get\_operation\_status** method.  

You can list your storage accounts and their properties with the **list\_storage\_accounts** method:

	from azure import *
	from azure.servicemanagement import *

	sms = ServiceManagementService(subscription_id, certificate_path)

	result = sms.list_storage_accounts()
	for account in result:
		print('Service name: ' + account.service_name)
		print('Affinity group: ' + account.storage_service_properties.affinity_group)
		print('Location: ' + account.storage_service_properties.location)
		print('')

<h2 id="DeleteStorageService">How to: Delete a storage service</h2>

You can delete a storage service by passing the storage service name to the **delete\_storage\_account** method. Deleting a storage service will delete all data stored in the service (blobs, tables and queues).

	from azure import *
	from azure.servicemanagement import *

	sms = ServiceManagementService(subscription_id, certificate_path)

	sms.delete_storage_account('mystorageaccount')

<h2 id="CreateAffinityGroup">How to: Create an affinity group</h2>

An affinity group is a logical grouping of Azure services that tells Windows Azure to locate the services for optimized performance. For example, you might create an affinity group in the “West US” location, then create a [cloud service](#CreateCloudService) in that affinity group. If you then create a storage service in the same affinity group, Windows Azure knows to put it in the “West US” location and optimize within the data center for the best performance with the cloud services in the same affinity group.

To create an affinity group, you need a name, label (automatically encoded to base64), and location. You can optionally provide a description:

	from azure import *
	from azure.servicemanagement import *

	sms = ServiceManagementService(subscription_id, certificate_path)

	name = 'myAffinityGroup'
	label = 'myAffinityGroup'
	location = 'West US'
	desc = 'my affinity group'

	sms.create_affinity_group(name, label, location, desc)

After you have created an affinity group, you can specify the group (instead of a location) when [creating a storage service](#CreateStorageService).

You can list affinity groups and inspect their properties by calling the **list\_affinity\_groups** method:

	result = sms.list_affinity_groups()

	for group in result:
		print('Name: ' + group.name)
		print('Description: ' + group.description)
		print('Location: ' + group.location)
		print('')

<h2 id="DeleteAffinityGroup">How to: Delete an affinity group</h2>
	
You can delete an affinity group by passing the group name to the **delete\_affinity\_group** method. Note that before you can delete an affinity group, the affinity group must be disassociated from any services (or services that use the affinity group must be deleted).

	from azure import *
	from azure.servicemanagement import *

	sms = ServiceManagementService(subscription_id, certificate_path)

	sms.delete_affinity_group('myAffinityGroup')

<h2 id="ListOperatingSystems">How to: List available operating systems</h2>

To list the operating systems that are available for hosting services, use the **list\_operating\_systems** method:

	from azure import *
	from azure.servicemanagement import *

	sms = ServiceManagementService(subscription_id, certificate_path)

	result = sms.list_operating_systems()

	for os in result:
		print('OS: ' + os.label)
		print('Family: ' + os.family_label)
		print('Active: ' + str(os.is_active))

Alternatively, you can use the **list\_operating\_system\_families** method, which groups the operating systems by family:

	result = sms.list_operating_system_families()

	for family in result:
		print('Family: ' + family.label)
		for os in family.operating_systems:
			if os.is_active:
				print('OS: ' + os.label)
				print('Version: ' + os.version)
		print('')

<h2 id="CreateVMImage">How to: Create an operating system image</h2>

To add an operating system image to the image repository, use the **add\_os\_image** method:

	from azure import *
	from azure.servicemanagement import *

	sms = ServiceManagementService(subscription_id, certificate_path)

	name = 'mycentos'
	label = 'mycentos'
	os = 'Linux' # Linux or Windows
	media_link = 'url_to_storage_blob_for_source_image_vhd'

	result = sms.add_os_image(label, media_link, name, os)

	operation_result = sms.get_operation_status(result.request_id)
	print('Operation status: ' + operation_result.status)

To list the operating system images that are available, use the **list\_os\_images** method. This includes all platform images and user images:

	result = sms.list_os_images()

	for image in result:
		print('Name: ' + image.name)
		print('Label: ' + image.label)
		print('OS: ' + image.os)
		print('Category: ' + image.category)
		print('Description: ' + image.description)
		print('Location: ' + image.location)
		print('Affinity group: ' + image.affinity_group)
		print('Media link: ' + image.media_link)
		print('')

<h2 id="DeleteVMImage">How to: Delete an operating system image</h2>

To delete a user image, use the **delete\_os\_image** method:

	from azure import *
	from azure.servicemanagement import *

	sms = ServiceManagementService(subscription_id, certificate_path)

	result = sms.delete_os_image('mycentos')

	operation_result = sms.get_operation_status(result.request_id)
	print('Operation status: ' + operation_result.status)

<h2 id="CreateVM">How to: Create a virtual machine</h2>

To create a virtual machine, you first need to create a [cloud service](#CreateCloudService).  Then create the virtual machine deployment using the **create\_virtual\_machine\_deployment** method:

	from azure import *
	from azure.servicemanagement import *

	sms = ServiceManagementService(subscription_id, certificate_path)

	name = 'myvm'
	location = 'West US'

	# You can either set the location or an affinity_group
	sms.create_hosted_service(service_name=name,
		label=name,
		location=location)

	# Name of an os image as returned by list_os_images
	image_name = 'OpenLogic__OpenLogic-CentOS-62-20120531-en-us-30GB.vhd'

	# Destination storage account container/blob where the VM disk
	# will be created
	media_link = 'url_to_target_storage_blob_for_vm_hd'

	# Linux VM configuration, you can use WindowsConfigurationSet
	# for a Windows VM instead
	linux_config = LinuxConfigurationSet('myhostname', 'myuser', 'mypassword', True)

	os_hd = OSVirtualHardDisk(image_name, media_link)

	sms.create_virtual_machine_deployment(service_name=name,
		deployment_name=name,
		deployment_slot='production',
		label=name,
		role_name=name,
		system_config=linux_config,
		os_virtual_hard_disk=os_hd,
		role_size='Small')

<h2 id="DeleteVM">How to: Delete a virtual machine</h2>

To delete a virtual machine, you first delete the deployment using the **delete\_deployment** method:

	from azure import *
	from azure.servicemanagement import *

	sms = ServiceManagementService(subscription_id, certificate_path)

	sms.delete_deployment(service_name='myvm',
		deployment_name='myvm')

The cloud service can then be deleted using the **delete\_hosted\_service** method:

	sms.delete_hosted_service(service_name='myvm')

<h2 id="NextSteps">Next Steps</h2>

Now that you've learned the basics of service management, follow these links to do more complex tasks.

-   See the MSDN Reference: [Cloud Services][]
-   See the MSDN Reference: [Virtual Machines][]

[management-portal]: https://manage.windowsazure.com/
[svc-mgmt-rest-api]: http://msdn.microsoft.com/en-us/library/windowsazure/ee460799.aspx
[win-azure-account]: http://www.windowsazure.com/en-us/pricing/free-trial/
[storage-account]: https://www.windowsazure.com/en-us/manage/services/storage/how-to-create-a-storage-account/
[download-SDK-Python]: https://www.windowsazure.com/en-us/develop/python/common-tasks/install-python/
[cloud service]: http://www.windowsazure.com/en-us/manage/services/cloud-services/what-is-a-cloud-service/
[service package]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433093
[Windows Azure PowerShell cmdlets]: https://www.windowsazure.com/en-us/develop/php/how-to-guides/powershell-cmdlets/
[cspack commandline tool]: http://msdn.microsoft.com/en-us/library/windowsazure/gg432988.aspx
[Overview of Managing Deployments in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/hh386336.aspx
[storage service]: https://www.windowsazure.com/en-us/manage/services/storage/what-is-a-storage-account/
[azure-blobs]: https://www.windowsazure.com/en-us/develop/python/how-to-guides/blob-service/
[azure-tables]: https://www.windowsazure.com/en-us/develop/python/how-to-guides/table-service/
[azure-queues]: https://www.windowsazure.com/en-us/develop/python/how-to-guides/queue-service/
[Windows Azure Service Configuration Schema (.cscfg)]: http://msdn.microsoft.com/en-us/library/windowsazure/ee758710.aspx
[Cloud Services]: http://msdn.microsoft.com/en-us/library/windowsazure/jj155995.aspx
[Virtual Machines]: http://msdn.microsoft.com/en-us/library/windowsazure/jj156003.aspx
