<properties urlDisplayName="Service Management API" pageTitle="How to use the service management API for VMs - Azure" metaKeywords="" description="Learn how to use the Azure Service Management API for a Linux virtual machine." metaCanonical="" services="virtual-machines" documentationCenter="" title="How to Use the Service Management API" authors="timlt" solutions="" manager="timlt" editor="" />

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-linux" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="timlt" />




#How to Use the Service Management API

##Initialization##

To invoke the Azure IaaS service management API from NodeJS, the `azure` module is used.

	var azure = require('azure');

First create an instance of the ServiceManagementService. All calls to the API will use this object. The subscription id, credentials, and other connection options are established at this time. To manage more than one subscription, create more than one ServiceManagementService.

	var iaasClient = azure.createServiceManagementService(subscriptionid, auth, options);

- Subscriptionid is a required string. It should be the subscription id of the account being accessed.
- Auth is an optional object that specifies the private key and public certificate to be used with this account.	
	- keyfile - file path of .pem file that has private key. Ignored if keyvalue is specified.
	- keyvalue - actual value of private key as stored in a .pem file.
	- certfile - file path of .pem file that has public certificate. Ignored if cervalue is specified.
	- certvalue - actual value of public certificate as stored in a .pem file.
	- If the above values are not specified, then process environment variable values `CLIENT_AUTH_KEYFILE` and `CLIENT_AUTH_CERTFILE` are read and used. If these are not set, then default values for the files are tried: priv.pem and pub.pem.
	- If it is not possible to load the private key and public certificate, then an error is thrown.

- Options is an optional object that may be used to control properties used by the client.	
	- host - host name of Azure management server. If not specified, it uses the default host.
	- apiversion - version string to use in the HTTP header. If not specified uses default version.
	- serializetype - may be XML or JSON. If not specified uses default serialization.

Optionally a tunneling proxy may be used to enable the HTTPS request to go through a proxy. When the IaasClient is created it will process the environment variable `HTTPS_PROXY`. If it is set to a valid URL, then the host name and port are parsed from the URL and are used in subsequent requests to identify the proxy.

		iaasClient.SetProxyUrl(proxyurl)

The SetProxyUrl may be called to explicitly set the proxy host and port. It has the same effect as setting the `HTTPS_PROXY` environment variable, and will override the environment setting.

##Callbacks##

All the APIs have a required callback argument. Completion of the request is signaled by calling the function passed in the callback. 

	callback(rsp)

- The callback has a single parameter which is the response object.
- isSuccessful - true or false
- statusCode - HTTP Status code from the response
- response - the response parsed into a javascript object. Set if isSuccessful is true.
- error - a javascript object holding error information set if isSuccessful is false.
- body - the actual body of the response as a string
- headers - the actual HTTP headers of the response
- reqopts - the Node HTTP request options used to make the request.

Note that in some cases completion may only indicate that the request was accepted. In this case use **GetOperationStatus** to get the final status.

##APIs##

**iaasClient.GetOperationStatus(requested, callback)**

- Many management calls return before the operation is completed. These return a value of 202 Accepted, and place a requested in the ms-request-id HTPP Header. To poll for completion of the request, use this API and pass in the requested value.
- callback is required.

**iaasClient.GetOSImage(imagename, callback)**

- imagename is a required string name of the image.
- callback is required.
- The response object will contain properties of the named image if successful.

**iaasClient.ListOSImages(callback)**

- callback is required.
- The response object will contain an array of image objects if successful.

**iaasClient.CreateOSImage(imageName, mediaLink, imageOptions, callback)**

- imageName is a required string name of the image.
- mediaLink is a required string name of the mediaLink to use.
- imageOptions is an optional object. It may contain these properties
	- Category
	- Label - default to imageName if not set.
	- Location
	- RoleSize

- callback is required. (If imageOptions is not set, this may be the third parameter.)
- The response object will contain properties of the created image if successful.

**iaasClient.ListHostedServices(callback)**

- callback is required.
- The response object will contain an array of hosted service objects if successful.

**iaasClient.GetHostedService(serviceName, callback)**

- serviceName is a required string name of the hosted service.
- callback is required.
- The response object will contain properties of the hosted service if successful.

**iaasClient.CreateHostedService(serviceName, serviceOptions, callback)**

- serviceName is a required string name of the hosted service.
- serviceOptions is an optional object. It may contain these properties
	- Description - default to 'Service host'
	- Label - default to serviceName if not set.
	- Location - the region to create the service in
-	callback is required.

**iaasClient.GetStorageAccountKeys(serviceName, callback)**

- serviceName is a required string name of the hosted service.
- callback is required.
- The response object will contain storage access keys if successful.

**iaasClient.GetDeployment(serviceName, deploymentName, callback)**

- serviceName is a required string name of the hosted service.
- deploymentName is a required string name of the deployment.
- callback is required.
- The response object will contain properties of the named deployment if successful.

**iaasClient.GetDeploymentBySlot(serviceName, deploymentSlot, callback)**

- serviceName is a required string name of the hosted service.
- deploymentSlot is a required string name of the slot (Staged or Production).
- callback is required.
- The response object will contain properties of deployments in the slot if successful.

**iaasClient.CreateDeployment(serviceName, deploymentName, VMRole, deployOptions, callback)**

- serviceName is a required string name of the hosted service.
- deploymentName is a required string name of the deployment.
- VMRole is a required object that has properties of the Role to be created for the deployment.
- deployOptions is an optional object. It may contain these properties
	- DeploymentSlot - default to 'Production'
	- Label - default to deploymentName if not set.
	- UpgradeDomainCount - no default
- callback is required.

**iaasClient.GetRole(serviceName, deploymentName, roleName, callback)**

- serviceName is a required string name of the hosted service.
- deploymentName is a required string name of the deployment.
- roleName is a required string name of the role.
- callback is required.
- The response object will contain properties of the named role if successful.

**iaasClient.AddRole(serviceName, deploymentName, VMRole, callback)**

- serviceName is a required string name of the hosted service.
- deploymentName is a required string name of the deployment.
- VMRole is a required object that has properties of the Role to be added to the deployment.
- callback is required.

**iaasClient.ModifyRole(serviceName, deploymentName, roleName, VMRole, callback)**

- serviceName is a required string name of the hosted service.
- deploymentName is a required string name of the deployment.
- roleName is a required string name of the role.
- VMRole is a required object that has properties to be modified in the role.
- callback is required.

**iaasClient.DeleteRole(serviceName, deploymentName, roleName, callback)**

- serviceName is a required string name of the hosted service.
- deploymentName is a required string name of the deployment.
- roleName is a required string name of the role.
- callback is required.

**iaasClient.AddDataDisk(serviceName, deploymentName, roleName, datadisk, callback)**

- serviceName is a required string name of the hosted service.
- deploymentName is a required string name of the deployment.
- roleName is a required string name of the role.
- Datadisk is a required object used to specify how the data disk will be created.
- callback is required.

**iaasClient.ModifyDataDisk(serviceName, deploymentName, roleName, LUN, datadisk, callback)**

- serviceName is a required string name of the hosted service.
- deploymentName is a required string name of the deployment.
- roleName is a required string name of the role.
- LUN is the number that identifies the data disk
- Datadisk is a required object used to specify how the data disk will be modified.
- callback is required.

**iaasClient.RemoveDataDisk(serviceName, deploymentName, roleName, LUN, callback)**

- serviceName is a required string name of the hosted service.
- deploymentName is a required string name of the deployment.
- roleName is a required string name of the role.
- LUN is the number that identifies the data disk
- callback is required.

**iaasClient.ShutdownRoleInstance(serviceName, deploymentName, roleInstance, callback)**

- serviceName is a required string name of the hosted service.
- deploymentName is a required string name of the deployment.
- roleInstance is a required string name of the role instance.
- callback is required.

**iaasClient.RestartRoleInstance(serviceName, deploymentName, roleInstance, callback)**

- serviceName is a required string name of the hosted service.
- deploymentName is a required string name of the deployment.
- roleInstance is a required string name of the role instance.
- callback is required.

**iaasClient.CaptureRoleInstance(serviceName, deploymentName, roleInstance, captOptions, callback)**

- serviceName is a required string name of the hosted service.
- deploymentName is a required string name of the deployment.
- roleInstance is a required string name of the role instance.
- captOptions is a required object that defines the capture actions
	- PostCaptureActions
	- ProvisioningConfiguration
	- SupportsStatelessDeployment
	- TargetImageLabel
	- TargetImageName
- callback is required.

##Data objects##

The APIs take objects as input when creating or modifying a deployment, a role, or a disk. Other APIs will return similar objects on a Get or List operation.
This section sketches out the object properties.
Deployment

- Name - string
- DeploymentSlot - 'Staging' or 'Production'
- Status - string - output only
- PrivateID - string - output only
- Label - string
- UpgradeDomainCount - number
- SdkVersion - string
- Locked - true or false
- RollbackAllowed - true or false
- RoleInstance - object - output only
- Role - VMRole object
- InputEndpointList - array of InputEndpoint

**VMRole**

- RoleName - string. Required for create.
- RoleSize - string. Optional for create.
- RoleType - string. Defaults to 'PersistentVMRole' if not specified in create.
- OSDisk - object. Required for create
- DataDisks - array of objects. Optional for create.
- ConfigurationSets - array of Configuration objects.

**RoleInstance**

- RoleName - string
- InstanceName - string
- InstanceStatus - string
- InstanceUpgradeDomain - number
- InstanceFaultDomain - number
- InstanceSize - string
- IpAddress - string

**OSDisk**

- SourceImageName - string. Required for create
- DisableWriteCache - true or false
- DiskName - string.
- MediaLink - string

**DataDisk**

- DisableReadCache - true or false
- EnableWriteCache - true or false
- DiskName - string
- MediaLink - string
- LUN - number (0-15)
- LogicalDiskSizeInGB - number
- SourceMediaLink - string
- There are 3 ways to specify the disk during creation - by name, by media, or by size. The options specified will determine how it works. See RDFE API document for details.

**ProvisioningConfiguration**

- ConfigurationSetType - 'ProvisioningConfiguration'
- AdminPassword - string
- MachineName - string
- ResetPasswordOnFirstLogon - true or false

**NetworkConfiguration**

- ConfigurationSetType - 'NetworkConfiguration'
- InputEndpoints - array of ExternalEndpoints

**InputEndpoint**

- RoleName
- Vip
- Port

**ExternalEndpoint**

- LocalPort
- Name
- Port
- Protocol

##Sample code##

Here is a sample javascript code that creates a hosted service and a deployment, and then polls for the completion status of the deployment.

	var azure = require('azure');
	
	// specify where certificate files are located
	var auth = {
	  keyfile : '../certs/priv.pem',
	  certfile : '../certs/pub.pem'
	}
	
	// names and IDs for subscription, service, deployment
	var subscriptionId = '167a0c69-cb6f-4522-ba3e-d3bdc9c504e1';
	var serviceName = 'sampleService2';
	var deploymentName = 'sampleDeployment';
	
	// poll for completion every 10 seconds
	var pollPeriod = 10000;
	
	// data used to define deployment and role
	
	var deploymentOptions = {
	  DeploymentSlot: 'Staging',
	  Label: 'Deployment Label'
	}
	
	var osDisk = {
	  SourceImageName : 'Win2K8SP1.110809-2000.201108-01.en.us.30GB.vhd',
	};
	
	var dataDisk1 = {
	  LogicalDiskSizeInGB : 10,
	  LUN : '0'
	};
	
	var provisioningConfigurationSet = {
	  ConfigurationSetType: 'ProvisioningConfiguration',
	  AdminPassword: 'myAdminPwd1',
	  MachineName: 'sampleMach1',
	  ResetPasswordOnFirstLogon: false
	};
	
	var externalEndpoint1 = {
	  Name: 'endpname1',
	  Protocol: 'tcp',
	  Port: '59919',
	  LocalPort: '3395'
	};
	
	var networkConfigurationSet = {
	  ConfigurationSetType: 'NetworkConfiguration',
	  InputEndpoints: [externalEndpoint1]
	};
	
	var VMRole = {
	  RoleName: 'sampleRole',
	  RoleSize: 'Small',
	  OSDisk: osDisk,
	  DataDisks: [dataDisk1],
	  ConfigurationSets: [provisioningConfigurationSet, networkConfigurationSet]
	}
	
	
	// function to show error messages if failed
	function showErrorResponse(rsp) {
	  console.log('There was an error response from the service');
	  console.log('status code=' + rsp.statusCode);
	  console.log('Error Code=' + rsp.error.Code);
	  console.log('Error Message=' + rsp.error.Message);
	}
	
	// polling for completion
	function PollComplete(reqid) {
	  iaasCli.GetOperationStatus(reqid, function(rspobj) {
	    if (rspobj.isSuccessful && rspobj.response) {
	      var rsp = rspobj.response;
	      if (rsp.Status == 'InProgress') {
	        setTimeout(PollComplete(reqid), pollPeriod);
	        process.stdout.write('.');
	      } else {
	        console.log(rsp.Status);
	        if (rsp.HttpStatusCode) console.log('HTTP Status: ' + rsp.HttpStatusCode);
	        if (rsp.Error) {      
	          console.log('Error code: ' + rsp.Error.Code);
	          console.log('Error Message: ' + rsp.Error.Message);
	        }
	      }
	    } else {
	      showErrorResponse(rspobj);
	    }
	  });
	}
	
	
	// create the client object
	var iaasCli = azure.createServiceManagementService(subscriptionId, auth);
	
	// create a hosted service.
	// if successful, create deployment
	// if accepted, poll for completion
	iaasCli.CreateHostedService(serviceName, function(rspobj) {
	  if (rspobj.isSuccessful) {
	    iaasCli.CreateDeployment(serviceName, 
	                             deploymentName,
	                             VMRole, deploymentOptions,
	                              function(rspobj) {
	      if (rspobj.isSuccessful) {
	      // get request id, and start polling for completion
	        var reqid = rspobj.headers['x-ms-request-id'];
	        process.stdout.write('Polling');
	        setTimeout(PollComplete(reqid), pollPeriod);
	      } else {
	        showErrorResponse(rspobj);
	      }
	    });
	  } else {
	    showErrorResponse(rspobj);
	  }
	});
