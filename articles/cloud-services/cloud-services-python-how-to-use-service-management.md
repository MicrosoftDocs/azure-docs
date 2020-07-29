---
title: Use the Service Management API (Python) - feature guide
description: Learn how to programmatically perform common service management tasks from Python.
services: cloud-services
documentationcenter: python
author: tanmaygore
manager: vashan
editor: ''

ms.assetid: 61538ec0-1536-4a7e-ae89-95967fe35d73
ms.service: cloud-services
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: python
ms.topic: article
ms.date: 05/30/2017
ms.author: tagore
ms.custom: tracking-python

---
# Use service management from Python
This guide shows you how to programmatically perform common service management tasks from Python. The **ServiceManagementService** class in the [Azure SDK for Python](https://github.com/Azure/azure-sdk-for-python) supports programmatic access to much of the service management-related functionality that is available in the [Azure portal][management-portal]. You can use this functionality to create, update, and delete cloud services, deployments, data management services, and virtual machines. This functionality can be useful in building applications that need programmatic access to service management.

## <a name="WhatIs"> </a>What is service management?
The Azure Service Management API provides programmatic access to much of the service management functionality available through the [Azure portal][management-portal]. You can use the Azure SDK for Python to manage your cloud services and storage accounts.

To use the Service Management API, you need to [create an Azure account](https://azure.microsoft.com/pricing/free-trial/).

## <a name="Concepts"> </a>Concepts
The Azure SDK for Python wraps the [Service Management API][svc-mgmt-rest-api], which is a REST API. All API operations are performed over TLS and mutually authenticated by using X.509 v3 certificates. The management service can be accessed from within a service running in Azure. It also can be accessed directly over the Internet from any application that can send an HTTPS request and receive an HTTPS response.

## <a name="Installation"> </a>Installation
All the features described in this article are available in the `azure-servicemanagement-legacy` package, which you can install by using pip. For more information about installation (for example, if you're new to Python), see [Install Python and the Azure SDK](/azure/developer/python/azure-sdk-install).

## <a name="Connect"> </a>Connect to service management
To connect to the service management endpoint, you need your Azure subscription ID and a valid management certificate. You can obtain your subscription ID through the [Azure portal][management-portal].

> [!NOTE]
> You now can use certificates created with OpenSSL when running on Windows. Python 2.7.4 or later is required. We recommend that you use OpenSSL instead of .pfx, because support for .pfx certificates is likely to be removed in the future.
>
>

### Management certificates on Windows/Mac/Linux (OpenSSL)
You can use [OpenSSL](https://www.openssl.org/) to create your management certificate. You need to create two certificates, one for the server (a `.cer` file) and one for the client (a `.pem` file). To create the `.pem` file, execute:

    openssl req -x509 -nodes -days 365 -newkey rsa:1024 -keyout mycert.pem -out mycert.pem

To create the `.cer` certificate, execute:

    openssl x509 -inform pem -in mycert.pem -outform der -out mycert.cer

For more information about Azure certificates, see [Certificates overview for Azure Cloud Services](cloud-services-certs-create.md). For a complete description of OpenSSL parameters, see the documentation at [https://www.openssl.org/docs/apps/openssl.html](https://www.openssl.org/docs/apps/openssl.html).

After you create these files, upload the `.cer` file to Azure. In the [Azure portal][management-portal], on the **Settings** tab, select **Upload**. Note where you saved the `.pem` file.

After you obtain your subscription ID, create a certificate, and upload the `.cer` file to Azure, connect to the Azure management endpoint. Connect by passing the subscription ID and the path to the `.pem` file to **ServiceManagementService**.

    from azure import *
    from azure.servicemanagement import *

    subscription_id = '<your_subscription_id>'
    certificate_path = '<path_to_.pem_certificate>'

    sms = ServiceManagementService(subscription_id, certificate_path)

In the preceding example, `sms` is a **ServiceManagementService** object. The **ServiceManagementService** class is the primary class used to manage Azure services.

### Management certificates on Windows (MakeCert)
You can create a self-signed management certificate on your machine by using `makecert.exe`. Open a **Visual Studio command prompt** as an **administrator** and use the following command, replacing *AzureCertificate* with the certificate name you want to use:

    makecert -sky exchange -r -n "CN=AzureCertificate" -pe -a sha1 -len 2048 -ss My "AzureCertificate.cer"

The command creates the `.cer` file and installs it in the **Personal** certificate store. For more information, see [Certificates overview for Azure Cloud Services](cloud-services-certs-create.md).

After you create the certificate, upload the `.cer` file to Azure. In the [Azure portal][management-portal], on the **Settings** tab, select **Upload**.

After you obtain your subscription ID, create a certificate, and upload the `.cer` file to Azure, connect to the Azure management endpoint. Connect by passing the subscription ID and the location of the certificate in your **Personal** certificate store to **ServiceManagementService** (again, replace *AzureCertificate* with the name of your certificate).

    from azure import *
    from azure.servicemanagement import *

    subscription_id = '<your_subscription_id>'
    certificate_path = 'CURRENT_USER\\my\\AzureCertificate'

    sms = ServiceManagementService(subscription_id, certificate_path)

In the preceding example, `sms` is a **ServiceManagementService** object. The **ServiceManagementService** class is the primary class used to manage Azure services.

## <a name="ListAvailableLocations"> </a>List available locations
To list the locations that are available for hosting services, use the **list\_locations** method.

    from azure import *
    from azure.servicemanagement import *

    sms = ServiceManagementService(subscription_id, certificate_path)

    result = sms.list_locations()
    for location in result:
        print(location.name)

When you create a cloud service or storage service, you need to provide a valid location. The **list\_locations** method always returns an up-to-date list of the currently available locations. As of this writing, the available locations are:

* West Europe
* North Europe
* Southeast Asia
* East Asia
* Central US
* North Central US
* South Central US
* West US
* East US
* Japan East
* Japan West
* Brazil South
* Australia East
* Australia Southeast

## <a name="CreateCloudService"> </a>Create a cloud service
When you create an application and run it in Azure, the code and configuration together are called an Azure [cloud service][cloud service]. (It was known as a *hosted service* in earlier Azure releases.) You can use the **create\_hosted\_service** method to create a new hosted service. Create the service by providing a hosted service name (which must be unique in Azure), a label (automatically encoded to base64), a description, and a location.

    from azure import *
    from azure.servicemanagement import *

    sms = ServiceManagementService(subscription_id, certificate_path)

    name = 'myhostedservice'
    label = 'myhostedservice'
    desc = 'my hosted service'
    location = 'West US'

    sms.create_hosted_service(name, label, desc, location)

You can list all the hosted services for your subscription with the **list\_hosted\_services** method.

    result = sms.list_hosted_services()

    for hosted_service in result:
        print('Service name: ' + hosted_service.service_name)
        print('Management URL: ' + hosted_service.url)
        print('Location: ' + hosted_service.hosted_service_properties.location)
        print('')

To get information about a particular hosted service, pass the hosted service name to the **get\_hosted\_service\_properties** method.

    hosted_service = sms.get_hosted_service_properties('myhostedservice')

    print('Service name: ' + hosted_service.service_name)
    print('Management URL: ' + hosted_service.url)
    print('Location: ' + hosted_service.hosted_service_properties.location)

After you create a cloud service, deploy your code to the service with the **create\_deployment** method.

## <a name="DeleteCloudService"> </a>Delete a cloud service
You can delete a cloud service by passing the service name to the **delete\_hosted\_service** method.

    sms.delete_hosted_service('myhostedservice')

Before you can delete a service, all deployments for the service must first be deleted. For more information, see [Delete a deployment](#DeleteDeployment).

## <a name="DeleteDeployment"> </a>Delete a deployment
To delete a deployment, use the **delete\_deployment** method. The following example shows how to delete a deployment named `v1`:

    from azure import *
    from azure.servicemanagement import *

    sms = ServiceManagementService(subscription_id, certificate_path)

    sms.delete_deployment('myhostedservice', 'v1')

## <a name="CreateStorageService"> </a>Create a storage service
A [storage service](../storage/common/storage-create-storage-account.md) gives you access to Azure [blobs](../storage/blobs/storage-python-how-to-use-blob-storage.md), [tables](../cosmos-db/table-storage-how-to-use-python.md), and [queues](../storage/queues/storage-python-how-to-use-queue-storage.md). To create a storage service, you need a name for the service (between 3 and 24 lowercase characters and unique within Azure). You also need a description, a label (up to 100 characters, automatically encoded to base64), and a location. The following example shows how to create a storage service by specifying a location:

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

In the preceding example, the status of the **create\_storage\_account** operation can be retrieved by passing the result returned by **create\_storage\_account** to the **get\_operation\_status** method. 

You can list your storage accounts and their properties with the **list\_storage\_accounts** method.

    from azure import *
    from azure.servicemanagement import *

    sms = ServiceManagementService(subscription_id, certificate_path)

    result = sms.list_storage_accounts()
    for account in result:
        print('Service name: ' + account.service_name)
        print('Location: ' + account.storage_service_properties.location)
        print('')

## <a name="DeleteStorageService"> </a>Delete a storage service
To delete a storage service, pass the storage service name to the **delete\_storage\_account** method. Deleting a storage service deletes all data stored in the service (blobs, tables, and queues).

    from azure import *
    from azure.servicemanagement import *

    sms = ServiceManagementService(subscription_id, certificate_path)

    sms.delete_storage_account('mystorageaccount')

## <a name="ListOperatingSystems"> </a>List available operating systems
To list the operating systems that are available for hosting services, use the **list\_operating\_systems** method.

    from azure import *
    from azure.servicemanagement import *

    sms = ServiceManagementService(subscription_id, certificate_path)

    result = sms.list_operating_systems()

    for os in result:
        print('OS: ' + os.label)
        print('Family: ' + os.family_label)
        print('Active: ' + str(os.is_active))

Alternatively, you can use the **list\_operating\_system\_families** method, which groups the operating systems by family.

    result = sms.list_operating_system_families()

    for family in result:
        print('Family: ' + family.label)
        for os in family.operating_systems:
            if os.is_active:
                print('OS: ' + os.label)
                print('Version: ' + os.version)
        print('')

## <a name="CreateVMImage"> </a>Create an operating system image
To add an operating system image to the image repository, use the **add\_os\_image** method.

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

To list the operating system images that are available, use the **list\_os\_images** method. It includes all platform images and user images.

    result = sms.list_os_images()

    for image in result:
        print('Name: ' + image.name)
        print('Label: ' + image.label)
        print('OS: ' + image.os)
        print('Category: ' + image.category)
        print('Description: ' + image.description)
        print('Location: ' + image.location)
        print('Media link: ' + image.media_link)
        print('')

## <a name="DeleteVMImage"> </a>Delete an operating system image
To delete a user image, use the **delete\_os\_image** method.

    from azure import *
    from azure.servicemanagement import *

    sms = ServiceManagementService(subscription_id, certificate_path)

    result = sms.delete_os_image('mycentos')

    operation_result = sms.get_operation_status(result.request_id)
    print('Operation status: ' + operation_result.status)

## <a name="CreateVM"> </a>Create a virtual machine
To create a virtual machine, you first need to create a [cloud service](#CreateCloudService). Then create the virtual machine deployment by using the **create\_virtual\_machine\_deployment** method.

    from azure import *
    from azure.servicemanagement import *

    sms = ServiceManagementService(subscription_id, certificate_path)

    name = 'myvm'
    location = 'West US'

    #Set the location
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

## <a name="DeleteVM"> </a>Delete a virtual machine
To delete a virtual machine, you first delete the deployment by using the **delete\_deployment** method.

    from azure import *
    from azure.servicemanagement import *

    sms = ServiceManagementService(subscription_id, certificate_path)

    sms.delete_deployment(service_name='myvm',
        deployment_name='myvm')

The cloud service can then be deleted by using the **delete\_hosted\_service** method.

    sms.delete_hosted_service(service_name='myvm')

## Create a virtual machine from a captured virtual machine image
To capture a VM image, you first call the **capture\_vm\_image** method.

    from azure import *
    from azure.servicemanagement import *

    sms = ServiceManagementService(subscription_id, certificate_path)

    # replace the below three parameters with actual values
    hosted_service_name = 'hs1'
    deployment_name = 'dep1'
    vm_name = 'vm1'

    image_name = vm_name + 'image'
    image = CaptureRoleAsVMImage    ('Specialized',
        image_name,
        image_name + 'label',
        image_name + 'description',
        'english',
        'mygroup')

    result = sms.capture_vm_image(
            hosted_service_name,
            deployment_name,
            vm_name,
            image
        )

To make sure that you successfully captured the image, use the **list\_vm\_images** API. Make sure your image is displayed in the results.

    images = sms.list_vm_images()

To finally create the virtual machine by using the captured image, use the **create\_virtual\_machine\_deployment** method as before, but this time pass in the vm_image_name instead.

    from azure import *
    from azure.servicemanagement import *

    sms = ServiceManagementService(subscription_id, certificate_path)

    name = 'myvm'
    location = 'West US'

    #Set the location
    sms.create_hosted_service(service_name=name,
        label=name,
        location=location)

    sms.create_virtual_machine_deployment(service_name=name,
        deployment_name=name,
        deployment_slot='production',
        label=name,
        role_name=name,
        system_config=linux_config,
        os_virtual_hard_disk=None,
        role_size='Small',
        vm_image_name = image_name)

To learn more about how to capture a Linux virtual machine in the classic deployment model, see [Capture a Linux virtual machine](../virtual-machines/linux/classic/capture-image-classic.md).

To learn more about how to capture a Windows virtual machine in the classic deployment model, see [Capture a Windows virtual machine](../virtual-machines/windows/classic/capture-image-classic.md).

## <a name="What's Next"> </a>Next steps
Now that you've learned the basics of service management, you can access the [Complete API reference documentation for the Azure Python SDK](https://azure-sdk-for-python.readthedocs.org/) and perform complex tasks easily to manage your Python application.

For more information, see the [Python Developer Center](https://azure.microsoft.com/develop/python/).

[What is service management?]: #WhatIs
[Concepts]: #Concepts
[Connect to service management]: #Connect
[List available locations]: #ListAvailableLocations
[Create a cloud service]: #CreateCloudService
[Delete a cloud service]: #DeleteCloudService
[Create a deployment]: #CreateDeployment
[Update a deployment]: #UpdateDeployment
[Move deployments between staging and production]: #MoveDeployments
[Delete a deployment]: #DeleteDeployment
[Create a storage service]: #CreateStorageService
[Delete a storage service]: #DeleteStorageService
[List available operating systems]: #ListOperatingSystems
[Create an operating system image]: #CreateVMImage
[Delete an operating system image]: #DeleteVMImage
[Create a virtual machine]: #CreateVM
[Delete a virtual machine]: #DeleteVM
[Next steps]: #NextSteps
[management-portal]: https://portal.azure.com/
[svc-mgmt-rest-api]: https://msdn.microsoft.com/library/windowsazure/ee460799.aspx


[cloud service]:/azure/cloud-services/
