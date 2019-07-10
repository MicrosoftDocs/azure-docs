---
title: Azure Instance Metadata Service | Microsoft Docs
description: RESTful interface to get information about Windows VM's compute, network, and upcoming maintenance events.
services: virtual-machines-windows
documentationcenter: ''
author: KumariSupriya
manager: harijayms
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 04/25/2019
ms.author: sukumari
ms.reviewer: azmetadata
---

# Azure Instance Metadata service

The Azure Instance Metadata Service provides information about running virtual machine instances that can be used to manage and configure your virtual machines.
This includes information such as SKU, network configuration, and upcoming maintenance events. For more information on what type of information is available, see [metadata APIs](#metadata-apis).

Azure's Instance Metadata Service is a REST Endpoint accessible to all IaaS VMs created via the [Azure Resource Manager](https://docs.microsoft.com/rest/api/resources/).
The endpoint is available at a well-known non-routable IP address (`169.254.169.254`) that can be accessed only from within the VM.

> [!IMPORTANT]
> This service is  **generally available** in all Azure Regions.  It regularly receives updates to expose new information about virtual machine instances. This page reflects the up-to-date [metadata APIs](#metadata-apis) available.

## Service availability

The service is available in generally available Azure regions. Not all API version may be available in all Azure Regions.

Regions                                        | Availability?                                 | Supported Versions
-----------------------------------------------|-----------------------------------------------|-----------------
[All Generally Available Global Azure Regions](https://azure.microsoft.com/regions/)     | Generally Available | 2017-04-02, 2017-08-01, 2017-12-01, 2018-02-01, 2018-04-02, 2018-10-01, 2019-02-01, 2019-03-11 
[Azure Government](https://azure.microsoft.com/overview/clouds/government/)              | Generally Available | 2017-04-02, 2017-08-01, 2017-12-01, 2018-02-01, 2018-04-02, 2018-10-01, 2019-02-01, 2019-03-11
[Azure China](https://www.azure.cn/)                                                     | Generally Available | 2017-04-02, 2017-08-01, 2017-12-01, 2018-02-01, 2018-04-02, 2018-10-01, 2019-02-01, 2019-03-11
[Azure Germany](https://azure.microsoft.com/overview/clouds/germany/)                    | Generally Available | 2017-04-02, 2017-08-01, 2017-12-01, 2018-02-01, 2018-04-02, 2018-10-01, 2019-02-01, 2019-03-11

This table is updated when there are service updates and or new supported versions are available.

To try out the Instance Metadata Service, create a VM from [Azure Resource Manager](https://docs.microsoft.com/rest/api/resources/) or the [Azure portal](https://portal.azure.com) in the above regions and follow the examples below.

## Usage

### Versioning

The Instance Metadata Service is versioned and specifying the API version in the HTTP request is mandatory.

You can see the newest versions listed in this [availability table](#service-availability).

As newer versions are added, older versions can still be accessed for compatibility if your scripts have dependencies on specific data formats.

When no version is specified, an error is returned with a list of the newest supported versions.

> [!NOTE]
> The response is a JSON string. The following example response is pretty-printed for readability.

**Request**

```bash
curl -H Metadata:true "http://169.254.169.254/metadata/instance"
```

**Response**

```json
{
    "error": "Bad request. api-version was not specified in the request. For more information refer to aka.ms/azureimds",
    "newest-versions": [
        "2018-10-01",
        "2018-04-02",
        "2018-02-01"
    ]
}
```

### Using headers

When you query the Instance Metadata Service, you must provide the header `Metadata: true` to ensure the request was not unintentionally redirected.

### Retrieving metadata

Instance metadata is available for running VMs created/managed using [Azure Resource Manager](https://docs.microsoft.com/rest/api/resources/). 
Access all data categories for a virtual machine instance using the following request:

```bash
curl -H Metadata:true "http://169.254.169.254/metadata/instance?api-version=2017-08-01"
```

> [!NOTE]
> All instance metadata queries are case-sensitive.

### Data output

By default, the Instance Metadata Service returns data in JSON format (`Content-Type: application/json`). However, different APIs return data in different formats if requested.
The following table is a reference of other data formats APIs may support.

API | Default Data Format | Other Formats
--------|---------------------|--------------
/instance | json | text
/scheduledevents | json | none
/attested | json | none

To access a non-default response format, specify the requested format as a query string parameter in the request. For example:

```bash
curl -H Metadata:true "http://169.254.169.254/metadata/instance?api-version=2017-08-01&format=text"
```

> [!NOTE]
> For leaf nodes the `format=json` doesn't work. For these queries `format=text` needs to be explicitly specified if the default format is json.

### Security

The Instance Metadata Service endpoint is accessible only from within the running virtual machine instance on a non-routable IP address. In addition, any request with a `X-Forwarded-For` header is rejected by the service.
Requests must also contain a `Metadata: true` header to ensure that the actual request was directly intended and not a part of unintentional redirection.

### Error

If there is a data element not found or a malformed request, the Instance Metadata Service returns standard HTTP errors. For example:

HTTP Status Code | Reason
----------------|-------
200 OK |
400 Bad Request | Missing `Metadata: true` header or missing the format when querying a leaf node
404 Not Found | The requested element doesn't exist
405 Method Not Allowed | Only `GET` and `POST` requests are supported
429 Too Many Requests | The API currently supports a maximum of 5 queries per second
500 Service Error     | Retry after some time

### Examples

> [!NOTE]
> All API responses are JSON strings. All following example responses are pretty-printed for readability.

#### Retrieving network information

**Request**

```bash
curl -H Metadata:true "http://169.254.169.254/metadata/instance/network?api-version=2017-08-01"
```

**Response**

> [!NOTE]
> The response is a JSON string. The following example response is pretty-printed for readability.

```json
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

```bash
curl -H Metadata:true "http://169.254.169.254/metadata/instance/network/interface/0/ipv4/ipAddress/0/publicIpAddress?api-version=2017-08-01&format=text"
```

#### Retrieving all metadata for an instance

**Request**

```bash
curl -H Metadata:true "http://169.254.169.254/metadata/instance?api-version=2019-03-11"
```

**Response**

> [!NOTE]
> The response is a JSON string. The following example response is pretty-printed for readability.

```json
{
  "compute": {
    "azEnvironment": "AzurePublicCloud",
    "customData": "",
    "location": "westus",
    "name": "jubilee",
    "offer": "Windows-10",
    "osType": "Windows",
    "placementGroupId": "",
    "plan": {
        "name": "",
        "product": "",
        "publisher": ""
    },
    "platformFaultDomain": "1",
    "platformUpdateDomain": "1",
    "provider": "Microsoft.Compute",
    "publicKeys": [],
    "publisher": "MicrosoftWindowsDesktop",
    "resourceGroupName": "myrg",
    "resourceId": "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/myrg/providers/Microsoft.Compute/virtualMachines/negasonic",
    "sku": "rs4-pro",
    "subscriptionId": "xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx",
    "tags": "Department:IT;Environment:Prod;Role:WorkerRole",
    "version": "17134.345.59",
    "vmId": "13f56399-bd52-4150-9748-7190aae1ff21",
    "vmScaleSetName": "",
    "vmSize": "Standard_D1",
    "zone": "1"
  },
  "network": {
    "interface": [
      {
        "ipv4": {
          "ipAddress": [
            {
              "privateIpAddress": "10.1.2.5",
              "publicIpAddress": "X.X.X.X"
            }
          ],
          "subnet": [
            {
              "address": "10.1.2.0",
              "prefix": "24"
            }
          ]
        },
        "ipv6": {
          "ipAddress": []
        },
        "macAddress": "000D3A36DDED"
      }
    ]
  }
}
```

#### Retrieving metadata in Windows Virtual Machine

**Request**

Instance metadata can be retrieved in Windows via the `curl` program:

```bash
curl -H @{'Metadata'='true'} http://169.254.169.254/metadata/instance?api-version=2019-03-11 | select -ExpandProperty Content
```

Or through the `Invoke-RestMethod` PowerShell cmdlet:

```powershell

Invoke-RestMethod -Headers @{"Metadata"="true"} -URI http://169.254.169.254/metadata/instance?api-version=2019-03-11 -Method get
```

**Response**

> [!NOTE]
> The response is a JSON string. The following example response is pretty-printed for readability.

```json
{
  "compute": {
    "azEnvironment": "AzurePublicCloud",
    "customData": "",
    "location": "westus",
    "name": "SQLTest",
    "offer": "SQL2016SP1-WS2016",
    "osType": "Windows",
    "placementGroupId": "",
    "plan": {
        "name": "",
        "product": "",
        "publisher": ""
    },
    "platformFaultDomain": "0",
    "platformUpdateDomain": "0",
    "provider": "Microsoft.Compute",
    "publicKeys": [],
    "publisher": "MicrosoftSQLServer",
    "resourceGroupName": "myrg",
    "resourceId": "/subscriptions/xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx/resourceGroups/myrg/providers/Microsoft.Compute/virtualMachines/negasonic",
    "sku": "Enterprise",
    "subscriptionId": "xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx",
    "tags": "Department:IT;Environment:Test;Role:WebRole",
    "version": "13.0.400110",
    "vmId": "453945c8-3923-4366-b2d3-ea4c80e9b70e",
    "vmScaleSetName": "",
    "vmSize": "Standard_DS2",
    "zone": ""
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
          "ipAddress": []
        },
        "macAddress": "002248020E1E"
      }
    ]
  }
}
```

## Metadata APIs

#### The following APIs are available through the metadata endpoint:

Data | Description | Version Introduced
-----|-------------|-----------------------
attested | See [Attested Data](#attested-data) | 2018-10-01
identity | Managed identities for Azure resources. See [acquire an access token](../../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md) | 2018-02-01
instance | See [Instance API](#instance-api) | 2017-04-02
scheduledevents | See [Scheduled Events](scheduled-events.md) | 2017-08-01

#### Instance API
##### The following Compute categories are available through the Instance API:

> [!NOTE]
> Through the metadata endpoint, the following categories are accessed through instance/compute

Data | Description | Version Introduced
-----|-------------|-----------------------
azEnvironment | Azure Environment where the VM is running in | 2018-10-01
customData | See [Custom Data](#custom-data) | 2019-02-01
location | Azure Region the VM is running in | 2017-04-02
name | Name of the VM | 2017-04-02
offer | Offer information for the VM image and is only present for images deployed from Azure image gallery | 2017-04-02
osType | Linux or Windows | 2017-04-02
placementGroupId | [Placement Group](../../virtual-machine-scale-sets/virtual-machine-scale-sets-placement-groups.md) of your virtual machine scale set | 2017-08-01
plan | [Plan](https://docs.microsoft.com/rest/api/compute/virtualmachines/createorupdate#plan) containing name, product, and publisher for a VM if its an Azure Marketplace Image | 2018-04-02
platformUpdateDomain |  [Update domain](manage-availability.md) the VM is running in | 2017-04-02
platformFaultDomain | [Fault domain](manage-availability.md) the VM is running in | 2017-04-02
provider | Provider of the VM | 2018-10-01
publicKeys | [Collection of Public Keys](https://docs.microsoft.com/rest/api/compute/virtualmachines/createorupdate#sshpublickey) assigned to the VM and paths | 2018-04-02
publisher | Publisher of the VM image | 2017-04-02
resourceGroupName | [Resource group](../../azure-resource-manager/resource-group-overview.md) for your Virtual Machine | 2017-08-01
resourceId | The [fully qualified](https://docs.microsoft.com/en-us/rest/api/resources/resources/getbyid) ID of the resource | 2019-03-11
sku | Specific SKU for the VM image | 2017-04-02
subscriptionId | Azure subscription for the Virtual Machine | 2017-08-01
tags | [Tags](../../azure-resource-manager/resource-group-using-tags.md) for your Virtual Machine  | 2017-08-01
version | Version of the VM image | 2017-04-02
vmId | [Unique identifier](https://azure.microsoft.com/blog/accessing-and-using-azure-vm-unique-id/) for the VM | 2017-04-02
vmScaleSetName | [Virtual Machine ScaleSet Name](../../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md) of your virtual machine scale set | 2017-12-01
vmSize | [VM size](sizes.md) | 2017-04-02
zone | [Availability Zone](../../availability-zones/az-overview.md) of your virtual machine | 2017-12-01

##### The following Network categories are available through the Instance API:

> [!NOTE]
> Through the metadata endpoint, the following categories are accessed through instance/network/interface

Data | Description | Version Introduced
-----|-------------|-----------------------
ipv4/privateIpAddress | Local IPv4 address of the VM | 2017-04-02
ipv4/publicIpAddress | Public IPv4 address of the VM | 2017-04-02
subnet/address | Subnet address of the VM | 2017-04-02
subnet/prefix | Subnet prefix, example 24 | 2017-04-02
ipv6/ipAddress | Local IPv6 address of the VM | 2017-04-02
macAddress | VM mac address | 2017-04-02

## Attested Data

Instance Metadata responds at http endpoint on 169.254.169.254. Part of the scenario served by Instance Metadata Service is to provide guarantees that the data responded is coming from Azure. We sign part of this information so that marketplace images can be sure that it's their image running on Azure.

### Example Attested Data

> [!NOTE]
> All API responses are JSON strings. The following example responses are pretty-printed for readability.

 **Request**

 ```bash
curl -H Metadata:true "http://169.254.169.254/metadata/attested/document?api-version=2018-10-01&nonce=1234567890"

```

Api-version is a mandatory field. Refer to the [service availability section](#service-availability) for supported API versions.
Nonce is an optional 10-digit string provided. Nonce can be used to track the request and if not provided, in response encoded string the current UTC timestamp is returned.

 **Response**

> [!NOTE]
> The response is a JSON string. The following example response is pretty-printed for readability.

 ```json
{
 "encoding":"pkcs7","signature":"MIIEEgYJKoZIhvcNAQcCoIIEAzCCA/8CAQExDzANBgkqhkiG9w0BAQsFADCBugYJKoZIhvcNAQcBoIGsBIGpeyJub25jZSI6IjEyMzQ1NjY3NjYiLCJwbGFuIjp7Im5hbWUiOiIiLCJwcm9kdWN0IjoiIiwicHVibGlzaGVyIjoiIn0sInRpbWVTdGFtcCI6eyJjcmVhdGVkT24iOiIxMS8yMC8xOCAyMjowNzozOSAtMDAwMCIsImV4cGlyZXNPbiI6IjExLzIwLzE4IDIyOjA4OjI0IC0wMDAwIn0sInZtSWQiOiIifaCCAj8wggI7MIIBpKADAgECAhBnxW5Kh8dslEBA0E2mIBJ0MA0GCSqGSIb3DQEBBAUAMCsxKTAnBgNVBAMTIHRlc3RzdWJkb21haW4ubWV0YWRhdGEuYXp1cmUuY29tMB4XDTE4MTEyMDIxNTc1N1oXDTE4MTIyMDIxNTc1NlowKzEpMCcGA1UEAxMgdGVzdHN1YmRvbWFpbi5tZXRhZGF0YS5henVyZS5jb20wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAML/tBo86ENWPzmXZ0kPkX5dY5QZ150mA8lommszE71x2sCLonzv4/UWk4H+jMMWRRwIea2CuQ5RhdWAHvKq6if4okKNt66fxm+YTVz9z0CTfCLmLT+nsdfOAsG1xZppEapC0Cd9vD6NCKyE8aYI1pliaeOnFjG0WvMY04uWz2MdAgMBAAGjYDBeMFwGA1UdAQRVMFOAENnYkHLa04Ut4Mpt7TkJFfyhLTArMSkwJwYDVQQDEyB0ZXN0c3ViZG9tYWluLm1ldGFkYXRhLmF6dXJlLmNvbYIQZ8VuSofHbJRAQNBNpiASdDANBgkqhkiG9w0BAQQFAAOBgQCLSM6aX5Bs1KHCJp4VQtxZPzXF71rVKCocHy3N9PTJQ9Fpnd+bYw2vSpQHg/AiG82WuDFpPReJvr7Pa938mZqW9HUOGjQKK2FYDTg6fXD8pkPdyghlX5boGWAMMrf7bFkup+lsT+n2tRw2wbNknO1tQ0wICtqy2VqzWwLi45RBwTGB6DCB5QIBATA/MCsxKTAnBgNVBAMTIHRlc3RzdWJkb21haW4ubWV0YWRhdGEuYXp1cmUuY29tAhBnxW5Kh8dslEBA0E2mIBJ0MA0GCSqGSIb3DQEBCwUAMA0GCSqGSIb3DQEBAQUABIGAld1BM/yYIqqv8SDE4kjQo3Ul/IKAVR8ETKcve5BAdGSNkTUooUGVniTXeuvDj5NkmazOaKZp9fEtByqqPOyw/nlXaZgOO44HDGiPUJ90xVYmfeK6p9RpJBu6kiKhnnYTelUk5u75phe5ZbMZfBhuPhXmYAdjc7Nmw97nx8NnprQ="
}
```

> The signature blob is a [pkcs7](https://aka.ms/pkcs7) signed version of document. It contains the certificate used for signing along with the VM details like vmId, nonce, timeStamp for creation and expiry of the document and the plan information about the image. The plan information is only populated for Azure Market place images. The certificate can be extracted from the response and used to validate that the response is valid and is coming from Azure.

#### Retrieving attested metadata in Windows Virtual Machine

 **Request**

Instance metadata can be retrieved in Windows via the PowerShell utility `curl`:

 ```bash
curl -H @{'Metadata'='true'} "http://169.254.169.254/metadata/attested/document?api-version=2018-10-01&nonce=1234567890" | select -ExpandProperty Content
```

 Or through the `Invoke-RestMethod` cmdlet:

 ```powershell
Invoke-RestMethod -Headers @{"Metadata"="true"} -URI "http://169.254.169.254/metadata/attested/document?api-version=2018-10-01&nonce=1234567890" -Method get
```

Api-version is a mandatory field. Refer to the service availability section for supported API versions.
Nonce is an optional 10-digit string provided. Nonce can be used to track the request and if not provided, in response encoded string the current UTC timestamp is returned.

 **Response**

> [!NOTE]
> The response is a JSON string. The following example response  is pretty-printed for readability.

 ```json
{
 "encoding":"pkcs7","signature":"MIIEEgYJKoZIhvcNAQcCoIIEAzCCA/8CAQExDzANBgkqhkiG9w0BAQsFADCBugYJKoZIhvcNAQcBoIGsBIGpeyJub25jZSI6IjEyMzQ1NjY3NjYiLCJwbGFuIjp7Im5hbWUiOiIiLCJwcm9kdWN0IjoiIiwicHVibGlzaGVyIjoiIn0sInRpbWVTdGFtcCI6eyJjcmVhdGVkT24iOiIxMS8yMC8xOCAyMjowNzozOSAtMDAwMCIsImV4cGlyZXNPbiI6IjExLzIwLzE4IDIyOjA4OjI0IC0wMDAwIn0sInZtSWQiOiIifaCCAj8wggI7MIIBpKADAgECAhBnxW5Kh8dslEBA0E2mIBJ0MA0GCSqGSIb3DQEBBAUAMCsxKTAnBgNVBAMTIHRlc3RzdWJkb21haW4ubWV0YWRhdGEuYXp1cmUuY29tMB4XDTE4MTEyMDIxNTc1N1oXDTE4MTIyMDIxNTc1NlowKzEpMCcGA1UEAxMgdGVzdHN1YmRvbWFpbi5tZXRhZGF0YS5henVyZS5jb20wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAML/tBo86ENWPzmXZ0kPkX5dY5QZ150mA8lommszE71x2sCLonzv4/UWk4H+jMMWRRwIea2CuQ5RhdWAHvKq6if4okKNt66fxm+YTVz9z0CTfCLmLT+nsdfOAsG1xZppEapC0Cd9vD6NCKyE8aYI1pliaeOnFjG0WvMY04uWz2MdAgMBAAGjYDBeMFwGA1UdAQRVMFOAENnYkHLa04Ut4Mpt7TkJFfyhLTArMSkwJwYDVQQDEyB0ZXN0c3ViZG9tYWluLm1ldGFkYXRhLmF6dXJlLmNvbYIQZ8VuSofHbJRAQNBNpiASdDANBgkqhkiG9w0BAQQFAAOBgQCLSM6aX5Bs1KHCJp4VQtxZPzXF71rVKCocHy3N9PTJQ9Fpnd+bYw2vSpQHg/AiG82WuDFpPReJvr7Pa938mZqW9HUOGjQKK2FYDTg6fXD8pkPdyghlX5boGWAMMrf7bFkup+lsT+n2tRw2wbNknO1tQ0wICtqy2VqzWwLi45RBwTGB6DCB5QIBATA/MCsxKTAnBgNVBAMTIHRlc3RzdWJkb21haW4ubWV0YWRhdGEuYXp1cmUuY29tAhBnxW5Kh8dslEBA0E2mIBJ0MA0GCSqGSIb3DQEBCwUAMA0GCSqGSIb3DQEBAQUABIGAld1BM/yYIqqv8SDE4kjQo3Ul/IKAVR8ETKcve5BAdGSNkTUooUGVniTXeuvDj5NkmazOaKZp9fEtByqqPOyw/nlXaZgOO44HDGiPUJ90xVYmfeK6p9RpJBu6kiKhnnYTelUk5u75phe5ZbMZfBhuPhXmYAdjc7Nmw97nx8NnprQ="
}
```

> The signature blob is a [pkcs7](https://aka.ms/pkcs7) signed version of document. It contains the certificate used for signing along with the VM details like vmId, nonce, timeStamp for creation and expiry of the document and the plan information about the image. The plan information is only populated for Azure Market place images. The certificate can be extracted from the response and used to validate that the response is valid and is coming from Azure.


## Example scenarios for usage  

### Tracking VM running on Azure

As a service provider, you may require to track the number of VMs running your software or have agents that need to track uniqueness of the VM. To be able to get a unique ID for a VM, use the `vmId` field from Instance Metadata Service.

**Request**

```bash
curl -H Metadata:true "http://169.254.169.254/metadata/instance/compute/vmId?api-version=2017-08-01&format=text"
```

**Response**

```text
5c08b38e-4d57-4c23-ac45-aca61037f084
```

### Placement of containers, data-partitions based fault/update domain 

For certain scenarios, placement of different data replicas is of prime importance. For example, [HDFS replica placement](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html#Replica_Placement:_The_First_Baby_Steps)
or container placement via an [orchestrator](https://kubernetes.io/docs/user-guide/node-selection/) may you require to know the `platformFaultDomain` and `platformUpdateDomain` the VM is running on.
You can also use [Availability Zones](../../availability-zones/az-overview.md) for the instances to make these decisions.
You can query this data directly via the Instance Metadata Service.

**Request**

```bash
curl -H Metadata:true "http://169.254.169.254/metadata/instance/compute/platformFaultDomain?api-version=2017-08-01&format=text"
```

**Response**

```text
0
```

### Getting more information about the VM during support case

As a service provider, you may get a support call where you would like to know more information about the VM. Asking the customer to share the compute metadata can provide basic information for the support professional to know about the kind of VM on Azure. 

**Request**

```bash
curl -H Metadata:true "http://169.254.169.254/metadata/instance/compute?api-version=2017-08-01"
```

**Response**

> [!NOTE]
> The response is a JSON string. The following example response is pretty-printed for readability.

```json
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

### Getting Azure Environment where the VM is running

Azure has various sovereign clouds like [Azure Government](https://azure.microsoft.com/overview/clouds/government/). Sometimes you need the Azure Environment to make some runtime decisions. The following sample shows you how you can achieve this behavior.

**Request**
```bash
curl -H Metadata:true "http://169.254.169.254/metadata/instance/compute/azEnvironment?api-version=2018-10-01&format=text"
```

**Response**
```bash
AzurePublicCloud
```

The regions and the values of the Azure Environment are listed below.

 Regions | Azure Environment
---------|-----------------
[All Generally Available Global Azure Regions](https://azure.microsoft.com/regions/)     | AzurePublicCloud
[Azure Government](https://azure.microsoft.com/overview/clouds/government/)              | AzureUSGovernmentCloud
[Azure China](https://azure.microsoft.com/global-infrastructure/china)                   | AzureChinaCloud
[Azure Germany](https://azure.microsoft.com/overview/clouds/germany/)                    | AzureGermanCloud

### Getting the tags for the VM

Tags may have been applied to your Azure VM to logically organize them into a taxonomy. The tags assigned to a VM can be retrieved by using the request below.

**Request**

```bash
curl -H Metadata:true "http://169.254.169.254/metadata/instance/compute/tags?api-version=2018-10-01&format=text"
```

**Response**

```text
Department:IT;Environment:Test;Role:WebRole
```

> [!NOTE]
> The tags are semicolon separated. If a parser is written to programmatically extract the tags, the tag names and values shouldn't contain semicolons in order for the parser to work correctly.

### Validating that the VM is running in Azure

Marketplace vendors want to ensure that their software is licensed to run only in Azure. If someone copies the VHD out to on-premise, then they should have the ability to detect that. By calling into Instance Metadata Service, Marketplace vendors can get signed data that guarantees response only from Azure.

> [!NOTE]
> Requires jq to be installed.

**Request**

 ```bash
  # Get the signature
   curl  --silent -H Metadata:True http://169.254.169.254/metadata/attested/document?api-version=2018-10-01 | jq -r '.["signature"]' > signature
  # Decode the signature
  base64 -d signature > decodedsignature
  #Get PKCS7 format
  openssl pkcs7 -in decodedsignature -inform DER -out sign.pk7
  # Get Public key out of pkc7
  openssl pkcs7 -in decodedsignature -inform DER  -print_certs -out signer.pem
  #Get the intermediate certificate
  wget -q -O intermediate.cer "$(openssl x509 -in signer.pem -text -noout | grep " CA Issuers -" | awk -FURI: '{print $2}')"
  openssl x509 -inform der -in intermediate.cer -out intermediate.pem
  #Verify the contents
  openssl smime -verify -in sign.pk7 -inform pem -noverify
 ```

 **Response**

```json
Verification successful
{"nonce":"20181128-001617",
  "plan":
    {
     "name":"",
     "product":"",
     "publisher":""
    },
"timeStamp":
  {
    "createdOn":"11/28/18 00:16:17 -0000",
    "expiresOn":"11/28/18 06:16:17 -0000"
  },
"vmId":"d3e0e374-fda6-4649-bbc9-7f20dc379f34"
}
```

Data | Description
-----|------------
nonce | User supplied optional string with the request. If no nonce was supplied in the request, the current UTC timestamp is returned
plan | [Plan](https://docs.microsoft.com/rest/api/compute/virtualmachines/createorupdate#plan) for a VM in it's an Azure Marketplace Image, contains name, product, and publisher
timestamp/createdOn | The timestamp at which the first signed document was created
timestamp/expiresOn | The timestamp at which the signed document expires
vmId |  [Unique identifier](https://azure.microsoft.com/blog/accessing-and-using-azure-vm-unique-id/) for the VM

#### Verifying the signature

Once you get the signature above, you can verify that the signature is from Microsoft. Also you can verify the intermediate certificate and the certificate chain.

> [!NOTE]
> The certificate for Public cloud and sovereign cloud will be different.

 Cloud | Certificate
---------|-----------------
[All Generally Available Global Azure Regions](https://azure.microsoft.com/regions/)     | metadata.azure.com
[Azure Government](https://azure.microsoft.com/overview/clouds/government/)              | metadata.azure.us
[Azure China](https://azure.microsoft.com/global-infrastructure/china/)                  | metadata.azure.cn
[Azure Germany](https://azure.microsoft.com/overview/clouds/germany/)                    | metadata.microsoftazure.de

```bash

# Verify the subject name for the main certificate
openssl x509 -noout -subject -in signer.pem
# Verify the issuer for the main certificate
openssl x509 -noout -issuer -in signer.pem
#Validate the subject name for intermediate certificate
openssl x509 -noout -subject -in intermediate.pem
# Verify the issuer for the intermediate certificate
openssl x509 -noout -issuer -in intermediate.pem
# Verify the certificate chain
openssl verify -verbose -CAfile /etc/ssl/certs/Baltimore_CyberTrust_Root.pem -untrusted intermediate.pem signer.pem
```

In cases where the intermediate certificate cannot be downloaded due to network constraints during validation, the intermediate certificate can be pinned. However, Azure will roll over the certificates as per standard PKI practice. The pinned certificates would need to be updated when roll over happens. Whenever a change to update the intermediate certificate is planned, the Azure blog will be updated and Azure customers will be notified. The intermediate certificates can be found [here](https://www.microsoft.com/pki/mscorp/cps/default.htm). The intermediate certificates for each of the regions can be different.

### Failover Clustering in Windows Server

For certain scenarios, when querying Instance Metadata Service with Failover Clustering, it is necessary to add a route to the routing table.

1. Open command prompt with administrator privileges.

2. Run the following command and note the address of the Interface for Network Destination (`0.0.0.0`) in the IPv4 Route Table.

```bat
route print
```

> [!NOTE]
> The following example output from a Windows Server VM with Failover Cluster enabled contains only the IPv4 Route Table for simplicity.

```bat
IPv4 Route Table
===========================================================================
Active Routes:
Network Destination        Netmask          Gateway       Interface  Metric
          0.0.0.0          0.0.0.0         10.0.1.1        10.0.1.10    266
         10.0.1.0  255.255.255.192         On-link         10.0.1.10    266
        10.0.1.10  255.255.255.255         On-link         10.0.1.10    266
        10.0.1.15  255.255.255.255         On-link         10.0.1.10    266
        10.0.1.63  255.255.255.255         On-link         10.0.1.10    266
        127.0.0.0        255.0.0.0         On-link         127.0.0.1    331
        127.0.0.1  255.255.255.255         On-link         127.0.0.1    331
  127.255.255.255  255.255.255.255         On-link         127.0.0.1    331
      169.254.0.0      255.255.0.0         On-link     169.254.1.156    271
    169.254.1.156  255.255.255.255         On-link     169.254.1.156    271
  169.254.255.255  255.255.255.255         On-link     169.254.1.156    271
        224.0.0.0        240.0.0.0         On-link         127.0.0.1    331
        224.0.0.0        240.0.0.0         On-link     169.254.1.156    271
        224.0.0.0        240.0.0.0         On-link         10.0.1.10    266
  255.255.255.255  255.255.255.255         On-link         127.0.0.1    331
  255.255.255.255  255.255.255.255         On-link     169.254.1.156    271
  255.255.255.255  255.255.255.255         On-link         10.0.1.10    266
```

1. Run the following command and use the address of the Interface for Network Destination (`0.0.0.0`) which is (`10.0.1.10`) in this example.

```bat
route add 169.254.169.254/32 10.0.1.10 metric 1 -p
```

### Custom Data
Instance Metadata Service provides the ability for the VM to have access to its custom data. The binary data must be less than 64 KB and is provided to the VM in base64 encoded form.

Azure custom data can be inserted to the VM through REST APIs, PowerShell Cmdlets, Azure Command Line Interface (CLI), or an ARM template.

For an Azure Command Line Interface example, see [Custom Data and Cloud-Init on Microsoft Azure](https://azure.microsoft.com/blog/custom-data-and-cloud-init-on-windows-azure/).

For an ARM template example, see [Deploy a Virtual Machine with CustomData](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-customdata).

Custom data is available to all processes running in the VM. It is suggested that customers do not insert secret information into custom data.

Currently, custom data is guaranteed to be available during bootstrap of a VM. If updates are made to the VM such as adding disks or resizing the VM, Instance Metadata Service will not provide custom data. Providing custom data persistently through Instance Metadata Service is currently in progress.

#### Retrieving custom data in Virtual Machine
Instance Metadata Service provides custom data to the VM in base64 encoded form. The following example decodes the base64 encoded string.

> [!NOTE]
> The custom data in this example is interpreted as an ASCII string that reads, "My custom data.".

**Request**

```bash
curl -H "Metadata:true" "http://169.254.169.254/metadata/instance/compute/customData?api-version=2019-02-01&&format=text" | base64 --decode
```

**Response**

```text
My custom data.
```

### Examples of calling metadata service using different languages inside the VM 

Language | Example
---------|----------------
Ruby     | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.rb
Go  | https://github.com/Microsoft/azureimds/blob/master/imdssample.go
Python   | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.py
C++      | https://github.com/Microsoft/azureimds/blob/master/IMDSSample-windows.cpp
C#       | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.cs
JavaScript | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.js
PowerShell | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.ps1
Bash       | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.sh
Perl       | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.pl
Java       | https://github.com/Microsoft/azureimds/blob/master/imdssample.java
Visual Basic | https://github.com/Microsoft/azureimds/blob/master/IMDSSample.vb
Puppet | https://github.com/keirans/azuremetadata

## FAQ

1. I am getting the error `400 Bad Request, Required metadata header not specified`. What does this mean?
   * The Instance Metadata Service requires the header `Metadata: true` to be passed in the request. Passing this header in the REST call allows access to the Instance Metadata Service.
2. Why am I not getting compute information for my VM?
   * Currently the Instance Metadata Service only supports instances created with Azure Resource Manager. In the future, support for  Cloud Service VMs might be added.
3. I created my Virtual Machine through Azure Resource Manager a while back. Why am I not see compute metadata information?
   * For any VMs created after Sep 2016, add a [Tag](../../azure-resource-manager/resource-group-using-tags.md) to start seeing compute metadata. For older VMs (created before Sep 2016), add/remove extensions or data disks to the VM to refresh metadata.
4. I am not seeing all data populated for new version
   * For any VMs created after Sep 2016, add a [Tag](../../azure-resource-manager/resource-group-using-tags.md) to start seeing compute metadata. For older VMs (created before Sep 2016), add/remove extensions or data disks to the VM to refresh metadata.
5. Why am I getting the error `500 Internal Server Error`?
   * Retry your request based on exponential back off system. If the issue persists contact  Azure support.
6. Where do I share additional questions/comments?
   * Send your comments on https://feedback.azure.com.
7. Would this work for Virtual Machine Scale Set Instance?
   * Yes Metadata service is available for Scale Set Instances.
8. How do I get support for the service?
   * To get support for the service, create a support issue in Azure portal for the VM where you are not able to get metadata response after long retries.
9. I get request timed out for my call to the service?
   * Metadata calls must be made from the primary IP address assigned to the network card of the VM, in addition in case you have changed your routes there must be a route for 169.254.0.0/16 address out of your network card.
10. I updated my tags in virtual machine scale set but they don't appear in the instances unlike VMs?
    * Currently for ScaleSets tags only show to the VM on a reboot/reimage/or a disk change to the instance.

    ![Instance Metadata Support](./media/instance-metadata-service/InstanceMetadata-support.png)

## Next steps

- Learn more about [Scheduled Events](scheduled-events.md)
