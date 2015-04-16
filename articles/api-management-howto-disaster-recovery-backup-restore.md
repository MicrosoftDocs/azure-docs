<properties 
	pageTitle="How to implement disaster recovery using service backup and restore in Azure API Management" 
	description="Learn how to use backup and restore to perform disaster recovery in Azure API Management." 
	services="api-management" 
	documentationCenter="" 
	authors="steved0x" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="api-management" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/24/2015" 
	ms.author="sdanie"/>

# How to implement disaster recovery using service backup and restore in Azure API Management
By choosing to publish and manage your APIs via Azure API Management you are taking advantage of many fault tolerance and infrastructure capabilities that you would otherwise have to design, implement, and manage. The Azure platform mitigates a large fraction of potential failures at a fraction of the cost.

To recover from availability problems affecting the region where your API Management service is hosted you should be ready to reconstitute your service in a different region at any time. Depending on your availability goals and recovery time objective  you might want to reserve a backup service in one or more regions and try to maintain their configuration and content in sync with the active service. The service backup and restore feature provides the necessary building block for implementing your disaster recovery strategy.

The service backup and restore feature is available via the Service Management REST API. See [Authenticating Azure Resource Manager requests][] for instructions on how to obtain access to the API.

## <a name="step1"> </a>Backup an API Management service
To backup an API Management service issue the following HTTP request:

`POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{serviceName}/backup?api-version={api-version}`

where:

* `subscriptionId` - id of the subscription containing the API Management service you are attempting to backup
* `resourceGroupName` - a string in the form of 'Api-Default-{service-region}' where `service-region` identifies the Azure region where the API Management service you are trying to backup is hosted, e.g. `North-Central-US`
* `serviceName` - the name of the API Management service you are making a backup of specified at the time of its creation
* `api-version` - replace  with `2014-02-14`

In the body of the request, specify the target Azure storage account name, access key, blob container name, and backup name:

	'{  
	    storageAccount : "{storage account name for the backup}",  
	    accessKey : "{access key for the account}",  
	    containerName : "{backup container name}",  
	    backupName : "{backup blob name}"  
	}'

Set the value of the `Content-Type` request header to `application\json`.

Backup is a long running operation that may take multiple minutes to complete.  If the request was successful and the backup process was initiated you’ll receive a `202 Accepted` response status code with a `Location` header.  Make 'GET' requests to the URL in the `Location` header to find out the status of the operation. While the backup is in progress you will continue to receive a '202 Accepted' status code. A Response code of `200 OK` will indicate successful completion of the backup operation.

**Note**:

- **Container** specified in the request body **must exist**.
* While backup is in progress you **should not attempt any service management operations** such as tier upgrade or downgrade, domain name change, etc. 
* Restore of a **backup is guaranteed only for 7 days** since the moment of its creation. 
* **Usage data** used for creating analytics reports **is not included** in the backup. Use [Azure API Management REST API][] to periodically retrieve analytics reports for safekeeping.
* The frequency with which you perform service backups will affect your recovery point objective. To minimize it we advise implementing regular backups as well as performing on-demand backups after making important changes to your API Management service.
* **Changes** made to the service configuration (e.g. APIs, policies, developer portal appearance) while backup operation is in process **might not be included in the backup and therefore will be lost**.

## <a name="step2"> </a>Restore an API Management service
To restore an API Management service from a previously created backup make the following HTTP request:

`POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{serviceName}/restore?api-version={api-version}`

where:

* `subscriptionId` - id of the subscription containing the API Management service you are restoring a backup into
* `resourceGroupName` - a string in the form of 'Api-Default-{service-region}' where `service-region` identifies the Azure region where the API Management service you are restoring a backup into is hosted, e.g. `North-Central-US`
* `serviceName` - the name of the API Management service being restored into specified at the time of its creation
* `api-version` - replace  with `2014-02-14`

In the body of the request, specify the backup file location, i.e. Azure storage account name, access key, blob container name, and backup name:

	'{  
	    storageAccount : "{storage account name for the backup}",  
	    accessKey : "{access key for the account}",  
	    containerName : "{backup container name}",  
	    backupName : "{backup blob name}"  
	}'

Set the value of the `Content-Type` request header to `application\json`.

Restore is a long running operation that may take up to 30 or more minutes to complete.  If the request was successful and the restore process was initiated you’ll receive a `202 Accepted` response status code with a `Location` header.  Make 'GET' requests to the URL in the `Location` header to find out the status of the operation. While the restore is in progress you will continue to receive '202 Accepted' status code. A response code of `200 OK` will indicate successful completion of the restore operation.

**Note**:

- **The tier** of the service being restored into **must match** the tier of the backed up service being restored.
- **Changes** made to the service configuration (e.g. APIs, policies, developer portal appearance) while restore operation is in progress **could be overwritten**.

[Backup an API Management service]: #step1
[Restore an API Management service]: #step2

[Authenticating Azure Resource Manager requests]: http://msdn.microsoft.com/library/dn790557.aspx
[Azure API Management REST API]: http://msdn.microsoft.com/library/azure/dn781421.aspx
