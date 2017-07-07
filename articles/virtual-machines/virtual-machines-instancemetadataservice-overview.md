---
title: Azure Instance Metadata Service Overview | Microsoft Docs
description: RESTful interface to get information about VM's compute, network and upcoming maintenance events.
services: virtual-machines-windows, virtual-machines-linux,virtual-machines-scale-sets, cloud-services
documentationcenter: ''
author: harijay
manager: timlt
editor: ''
tags: ''

ms.service: azure-instancemetadataservice
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/27/2017
ms.author: harijay
---

# Azure Instance Metadata Service 


The Azure Instance Metadata Service provides information about running virtual machine instances that can be used to manage and configure your virtual machines.
This includes information such as SKU, network configuration, and upcoming maintenance events. For more information on what type of information is available, see [metadata categories](#instance-metadata-data-categories).

Azure's Instance Metadata Service is a REST Endpoint accessible to all IaaS VMs created via the [Azure Resource Manager](https://docs.microsoft.com/rest/api/resources/). 
The endpoint is available at a well-known non-routable IP address (`169.254.169.254`) that can be accessed only from within the VM.

### Important information

This service is  **generally available** in Global Azure Regions. It is in Public preview for Government, China, and German Azure Cloud. It regularly receives updates to expose new information about virtual machine instances. This page reflects the up-to-date [data categories](#instance-metadata-data-categories) available.

## Service Availability
The service is available in all generally available Global Azure regions. The service is in public preview  in the Government, China, or Germany regions.

Regions                                        | Availability?
-----------------------------------------------|-----------------------------------------------
[All Generally Available Global Azure Regions](https://azure.microsoft.com/en-us/regions/)     | Generally Available 
[Azure Government](https://azure.microsoft.com/en-us/overview/clouds/government/)              | In Preview 
[Azure China](https://www.azure.cn/)                                                           | In Preview
[Azure Germany](https://azure.microsoft.com/en-us/overview/clouds/germany/)                    | In Preview

This table is updated when the service becomes available in other Azure clouds.

To try out the Instance Metadata Service, create a VM from [Azure Resource Manager](https://docs.microsoft.com/rest/api/resources/) or the [Azure portal](http://portal.azure.com) in the above regions and follow the examples below.

## Usage

### Versioning
The Instance Metadata Service is versioned. Versions are mandatory and the current version is `2017-04-02`.

> [!NOTE] 
> Previous preview releases of scheduled events supported {latest} as the api-version. This format is no longer supported and will be deprecated in the future.

As we add newer versions, older versions can still be accessed for compatibility if your scripts have dependencies on specific data formats. However, note that the current preview version(2017-03-01) may not be available once the service is generally available.

### Using Headers
When you query the Instance Metadata Service, you must provide the header `Metadata: true` to ensure the request was not unintentionally redirected.

### Retrieving metadata

Instance metadata is available for running VMs created/managed using [Azure Resource Manager](https://docs.microsoft.com/rest/api/resources/). 
Access all data categories for a virtual machine instance using the following request:

```
curl -H Metadata:true "http://169.254.169.254/metadata/instance?api-version=2017-04-02"
```

> [!NOTE] 
> All instance metadata queries are case-sensitive.

### Data output
By default, the Instance Metadata Service returns data in JSON format (`Content-Type: application/json`). However, different APIs can return data in different formats if requested.
The following table is a reference of other data formats APIs may support.

API | Default Data Format | Other Formats
--------|---------------------|--------------
/instance | json | text
/scheduledevents | json | none

To access a non-default response format, specify the requested format as a querystring parameter in the request. For example:

```
curl -H Metadata:true "http://169.254.169.254/metadata/instance?api-version=2017-04-02&format=text"
```

### Security
The Instance Metadata Service endpoint is accessible only from within the running virtual machine instance on a non-routable IP address. In addition, any request with a `X-Forwarded-For` header is rejected by the service.
We also require requests to contain a `Metadata: true` header to ensure that the actual request was directly intended and not a part of unintentional redirection. 

### Error
If there is a data element not found or a malformed request, the Instance Metadata Service returns standard HTTP errors. For example:

HTTP Status Code | Reason
----------------|-------
200 OK |
400 Bad Request | Missing `Metadata: true` header
404 Not Found | The requested element does't exist 
405 Method Not Allowed | Only `GET` and `POST` requests are supported
429 Too Many Requests | The API currently supports a maximum of 5 queries per second
500 Service Error     | Retry after some time

### Examples

> [!NOTE] 
> All API responses are JSON strings. All following example responses  are pretty-printed for readability.

#### Retrieving network information

**Request**

```
curl -H Metadata:true "http://169.254.169.254/metadata/instance/network?api-version=2017-04-02"
```

**Response**

> [!NOTE] 
> The response is a JSON string. The following example response is pretty-printed for readability.

```
{
  "interface": [
    {
      "ipv4": {
        "ipAddress": [
          {
            "privateIpAddress": "10.1.0.4",
            "publicIpAddress": "X.X.X.X"
          }
        ],
        "subnet": [
          {
            "address": "10.1.0.0",
            "prefix": "24"
          }
        ]
      },
      "ipv6": {
        "ipAddress": []
      },
      "macAddress": "000D3AF806EC"
    }
  ]
}

```

#### Retrieving public IP address

```
curl -H Metadata:true "http://169.254.169.254/metadata/instance/network/interface/0/ipv4/ipAddress/0/publicIpAddress?api-version=2017-04-02&format=text"
```

#### Retrieving all metadata for an instance

**Request**

```
curl -H Metadata:true "http://169.254.169.254/metadata/instance?api-version=2017-04-02"
```

**Response**

> [!NOTE] 
> The response is a JSON string. The following example response is pretty-printed for readability.

```
{
  "compute": {
    "location": "westcentralus",
    "name": "IMDSSample",
    "offer": "UbuntuServer",
    "osType": "Linux",
    "platformFaultDomain": "0",
    "platformUpdateDomain": "0",
    "publisher": "Canonical",
    "sku": "16.04.0-LTS",
    "version": "16.04.201610200",
    "vmId": "5d33a910-a7a0-4443-9f01-6a807801b29b",
    "vmSize": "Standard_A1"
  },
  "network": {
    "interface": [
      {
        "ipv4": {
          "ipAddress": [
            {
              "privateIpAddress": "10.1.0.4",
              "publicIpAddress": "X.X.X.X"
            }
          ],
          "subnet": [
            {
              "address": "10.1.0.0",
              "prefix": "24"
            }
          ]
        },
        "ipv6": {
          "ipAddress": []
        },
        "macAddress": "000D3AF806EC"
      }
    ]
  }
}
```

#### Retrieving metadata in Windows Virtual Machine

**Request**

Instance metadata can be retrieved in Windows via the PowerShell utility `curl`: 

```
curl -H @{'Metadata'='true'} http://169.254.169.254/metadata/instance?api-version=2017-04-02 | select -ExpandProperty Content
```

Or through the `Invoke-RestMethod` cmdlet:
    
```
Invoke-RestMethod -Headers @{"Metadata"="true"} -URI http://169.254.169.254/metadata/instance?api-version=2017-04-02 -Method get 
```

**Response**

> [!NOTE] 
> The response is a JSON string. The following example response  is pretty-printed for readability.

```
{
  "compute": {
    "location": "westus",
    "name": "SQLTest",
    "offer": "SQL2016SP1-WS2016",
    "osType": "Windows",
    "platformFaultDomain": "0",
    "platformUpdateDomain": "0",
    "publisher": "MicrosoftSQLServer",
    "sku": "Enterprise",
    "version": "13.0.400110",
    "vmId": "453945c8-3923-4366-b2d3-ea4c80e9b70e",
    "vmSize": "Standard_DS2"
  },
  "network": {
    "interface": [
      {
        "ipv4": {
          "ipAddress": [
            {
              "privateIpAddress": "10.0.1.4",
              "publicIpAddress": "X.X.X.X"
            }
          ],
          "subnet": [
            {
              "address": "10.0.1.0",
              "prefix": "24"
            }
          ]
        },
        "ipv6": {
          "ipAddress": [
            
          ]
        },
        "macAddress": "002248020E1E"
      }
    ]
  }
}
```

## Instance metadata data categories
The following data categories are available through the Instance Metadata Service:

Data | Description
-----|------------
location | Azure Region the VM is running in
name | Name of the VM 
offer | Offer information for the VM image. This value is only present for images deployed from Azure image gallery.
publisher | Publisher of the VM image
sku | Specific SKU for the VM image  
version | Version of the VM image 
osType | Linux or Windows 
platformUpdateDomain |  [Update domain](virtual-machines-windows-manage-availability.md) the VM is running in
platformFaultDomain | [Fault domain](virtual-machines-windows-manage-availability.md) the VM is running in
vmId | [Unique identifier](https://azure.microsoft.com/blog/accessing-and-using-azure-vm-unique-id/) for the VM
vmSize | [VM size](virtual-machines-windows-sizes.md)
ipv4/privateIpAddress | Local IPv4 address of the VM 
ipv4/publicIpAddress | Public IPv4 address of the VM
subnet/address | Subnet address of the VM
subnet/prefix | Subnet prefix, example 24
ipv6/ipAddress | Local IPv6 address of the VM
macAddress | VM mac address 
scheduledevents | Currently in Public Preview See [scheduledevents](virtual-machines-scheduled-events.md)

## Example Scenarios for usage  

### Tracking VM running on Azure

As a service provider, you may require to track the number of VMs running your software or have agents that need to track uniqueness of the VM. To be able to get a unique ID for a VM, use the `vmId` field from Instance Metadata Service.

**Request**

```
curl -H Metadata:true "http://169.254.169.254/metadata/instance/compute/vmId?api-version=2017-04-02&format=text"
```

**Response**

```
5c08b38e-4d57-4c23-ac45-aca61037f084
```

### Placement of containers, data-partitions based Fault/Update domain 

For certain scenarios, placement of different data replicas is of prime importance. For example, [HDFS replica placement](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html#Replica_Placement:_The_First_Baby_Steps)
or container placement via an [orchestrator](https://kubernetes.io/docs/user-guide/node-selection/) may you require to know the `platformFaultDomain` and `platformUpdateDomain` the VM is running on.
You can query this data directly via the Instance Metadata Service.

**Request**

```
curl -H Metadata:true "http://169.254.169.254/metadata/instance/compute/platformFaultDomain?api-version=2017-04-02&format=text" 
```

**Response**

```
0
```

### Getting more information about the VM during support case 

As a service provider, you may get a support call where you would like to know more information about the VM. Asking the customer to share the compute metadata can provide basic information for the support professional to know about the kind of VM on Azure. 

**Request**

```
curl -H Metadata:true "http://169.254.169.254/metadata/instance/compute?api-version=2017-04-02"
```

**Response**

> [!NOTE] 
> The response is a JSON string. The following example response is pretty-printed for readability.

```
{
  "compute": {
    "location": "CentralUS",
    "name": "IMDSCanary",
    "offer": "RHEL",
    "osType": "Linux",
    "platformFaultDomain": "0",
    "platformUpdateDomain": "0",
    "publisher": "RedHat",
    "sku": "7.2",
    "version": "7.2.20161026",
    "vmId": "5c08b38e-4d57-4c23-ac45-aca61037f084",
    "vmSize": "Standard_DS2"
  }
}
```

### Examples of calling metadata service using different languages inside the VM 

Language | Example 
---------|----------------
Ruby     | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.rb
Go Lan   | https://github.com/Microsoft/azureimds/blob/master/imdssample.go            
python   | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.py
C++      | https://github.com/Microsoft/azureimds/blob/master/IMDSSample-windows.cpp
C#       | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.cs
Javascript | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.js
Powershell | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.ps1
Bash       | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.sh
    

## FAQ
1. I am getting the error `400 Bad Request, Required metadata header not specified`. What does this mean?
   * The Instance Metadata Service requires the header `Metadata: true` to be passed in the request. Passing this header in the REST call allows access to the Instance Metadata Service. 
2. Why am I not getting compute information for my VM?
   * Currently the Instance Metadata Service only supports instances created with Azure Resource Manager. In the future, we may add support for Cloud Service VMs.
3. I created my Virtual Machine through Azure Resource Manager a while back. Why am I not see compute metadata information?
   * For any VMs created after Sep 2016, add a [Tag](../azure-resource-manager/resource-group-using-tags.md) to start seeing compute metadata. For older VMs (created before Sep 2016), add/remove extensions or data disks to the VM to refresh metadata.
4. Why am I getting the error `500 Internal Server Error`?
   * Please retry your request based on exponential back off system. If the issue persists contact  Azure support.
5. Where do I share additional questions/comments?
   * Send your comments on http://feedback.azure.com.
7. Would this work for Virtual Machine Scale Set Instance?
   * Yes Metadata service is available for Scale Set Instances. 
6. How do I get support for the service?
   * To get support for the service, create a support issue in Azure portal for the VM where you are not able to get metadata response after long retries 

   ![Instance Metadata Support](./media/virtual-machines-instancemetadataservice-overview/InstanceMetadata-support.png)
    
## Next Steps

- Learn more about the [scheduledevents](virtual-machines-scheduled-events.md) API **In Public Preview** provided by the Instance Metadata Service.
