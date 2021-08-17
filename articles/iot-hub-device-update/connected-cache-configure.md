---
title: Configure Microsoft Connected Cache for Device Update for Azure IoT Hub | Microsoft Docs
titleSuffix:  Device Update for Azure IoT Hub
description: Overview of Microsoft Connected Cache for Device Update for Azure IoT Hub
author: andyriv
ms.author: andyriv
ms.date: 2/16/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Configure Microsoft Connected Cache for Device Update for Azure IoT Hub

Microsoft Connected Cache is deployed to Azure IoT Edge gateways as an Azure IoT Edge Module. Like other Azure IoT Edge modules, MCC module deployment environment variables and container create options are used to configure Microsoft Connected Cache modules.  This section defines the environment variables and container create options that are required for a customer to successfully deploy the Microsoft Connected Cache module for use by Device Update for Azure IoT Hub.

## Microsoft Connected Cache Azure IoT Edge module deployment details

Naming of the Microsoft Connected Cache module is at the discretion of the administrator. There are no other module or service interactions that rely on the name of the module for communication. Additionally, the parent child relationship of the Microsoft Connected Cache servers is not dependent on this module name, but rather the FQDN or Ip address of the Azure IoT Edge gateway that has been configured as discussed earlier.

Microsoft Connected Cache Azure IoT Edge Module Environment Variables are used to pass basic module identity information and functional module settings to the container.

| Variable Name                 | Value Format                           | Required/Optional | Functionality                                    |
| ----------------------------- | ---------------------------------------| ----------------- | ------------------------------------------------ |
| CUSTOMER_ID                   | Azure Subscription ID GUID             | Required          | This is the customer's key, which provides secure<br>authentication of the cache node to Delivery Optimization<br>Services.<br>Required in order  for module to function. |
| CACHE_NODE_ID                 | Cache Node ID GUID                     | Required          | Uniquely identifies the Microsoft Connected Cache<br>node to Delivery Optimization Services.<br>Required in order<br> for module to function. |
| CUSTOMER_KEY                  | Customer Key  GUID                     | Required          | This is the customer's key, which provides secure<br>authentication of the cache node to Delivery Optimization Services.<br>Required in order for module to function.|
| STORAGE_*N*_SIZE_GB           | Where N is the cache drive   | Required          | Specify up to 9 drives to cache content and specify the maximum space in<br>Gigabytes to allocate for content on each cache drive. Examples:<br>STORAGE_1_SIZE_GB = 150<br>STORAGE_2_SIZE_GB = 50<br>The number of the drive must match the cache drive binding values specified<br>in the Container Create Option MicrosoftConnectedCache*N* value<br>Minimum size of the cache is 10GB.|
| UPSTREAM_HOST                 | FQDN/IP                                | Optional          | This value can specify an upstream Microsoft Connected<br>Cache node that acts as a proxy if the Connected Cache node<br> is disconnected from the internet. This setting is used to support<br> the Nested IoT scenario.<br>**Note:** Microsoft Connected Cache listens on http default port 80.|
| UPSTREAM_PROXY                | FQDN/IP:PORT                           | Optional          | The outbound internet proxy.<br>This could also be the OT DMZ proxy if an ISA 95 network. |
| CACHEABLE_CUSTOM_*N*_HOST     | HOST/IP<br>FQDN                        | Optional          | Required to support custom package repositories.<br>Repositories could be hosted locally or on the internet.<br>There is no limit to the number of custom hosts that can be configured.<br><br>Examples:<br>Name = CACHEABLE_CUSTOM_1_HOST Value = packages.foo.com<br> Name = CACHEABLE_CUSTOM_2_HOST Value = packages.bar.com    |
| CACHEABLE_CUSTOM_*N*_CANONICAL| Alias                                  | Optional          | Required to support custom package repositories.<br>This value can be used as an alias and will be used by the cache server to reference<br>different DNS names. For example, repository content hostname may be packages.foo.com,<br>but for different regions there could be an additional prefix that is added to the hostname<br>like westuscdn.packages.foo.com and eastuscdn.packages.foo.com.<br>By setting the canonical alias, you ensure that content is not duplicated<br>for content coming from the same host, but different CDN sources.<br>The format of the canonical value is not important, but it must be unique to the host.<br>It may be easiest to set the value to match the host value.<br><br>Examples based on Custom Host examples above:<br>Name = CACHEABLE_CUSTOM_1_CANONICAL Value = foopackages<br> Name = CACHEABLE_CUSTOM_2_CANONICAL Value = packages.bar.com  |
| IS_SUMMARY_PUBLIC             | True or False                          | Optional          | Enables viewing of the summary report on the local network or internet.<br>Use of an API key (discussed later) is required to view the summary report if set to true. |
| IS_SUMMARY_ACCESS_UNRESTRICTED| True or False                          | Optional          | Enables viewing of summary report on the local network or internet without<br>use of API key from any device in the network. Use if you don't want to lock down access<br>to viewing cache server summary data via the browser. |
			
## Microsoft Connected Cache Azure IoT Edge module container create options

Container create options for MCC module deployment provide control of the settings related to storage and ports used by the MCC module. This is the list of required container created variables used to deploy MCC.

### Container to host OS drive mappings

Required to map the container storage location to the storage location on the disk.< Up to nine locations can be specified.

>[!Note]
>The number of the drive must match the cache drive binding values specified in the environment variable STORAGE_*N*_SIZE_GB value, ```/MicrosoftConnectedCache*N*/:/nginx/cache*N*/```

### Container to host TCP port mappings

This option specifies the external machine http port that MCC listens on for content requests. The default HostPort is port 80 and other ports are not supported at this time as the ADU client makes requests on port 80 today. TCP port 8081 is the internal container port that the MCC listens on and cannot be changed.

### Container service TCP port mappings

The Microsoft Connected Cache module has a .NET Core service, which is used by the caching engine for various functions.

>[!Note]
>To support Azure IoT Nested Edge the HostPort must not be set to 5000 because the Registry proxy module is already listening on host port 5000.


Sample Container Create Options

```json
{
    "HostConfig": {
        "Binds": [
            "/microsoftConnectedCache1/:/nginx/cache1/"
        ],
        "PortBindings": {
            "8081/tcp": [
                {
                    "HostPort": "80"
                }
            ],
            "5000/tcp": [
                {
                    "HostPort": "5100"
                }
            ]
        }
    }
}
```

## Microsoft Connected Cache summary report

The summary report is currently the only way for a customer to view caching data for the Microsoft Connected Cache instances deployed to Azure IoT Edge gateways. The report is generated at 15-second intervals and includes averaged stats for the period as well as aggregated stats for the lifetime of the module. The key stats that customers will be interested in are:

* **hitBytes** - This is the sum of bytes delivered that came directly from cache.
* **missBytes** - This is the sum of bytes delivered that Microsoft Connected Cache had to download from CDN to see the cache.
* **eggressBytes** - This is the sum of hitBytes and missBytes and is the total bytes delivered to clients.
* **hitRatioBytes** - This is the ratio of hitBytes to egressBytes.  If 100% of eggressBytes delivered in a period were equal to the hitBytes this would be 1 for example.


The summary report is available at `http://<FQDN/IP of Azure IoT Edge Gateway hosting MCC>:5001/summary` Replace \<Azure IoT Edge Gateway IP\> with the IP address or hostname of your IoT Edge gateway. (see environment variable details for information on visibility of this report).