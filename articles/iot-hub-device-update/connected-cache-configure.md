---
title: Configure Microsoft Connected Cache for Device Update for Azure IoT Hub | Microsoft Docs
titleSuffix:  Device Update for Azure IoT Hub
description: Overview of Microsoft Connected Cache for Device Update for Azure IoT Hub
author: andyriv
ms.author: andyriv
ms.date: 08/19/2022
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Configure Microsoft Connected Cache for Device Update for IoT Hub

> [!NOTE]
> This information relates to a preview feature that's available for early testing and use in a production environment. This feature is fully supported but it's still in active development and may receive substantial changes until it becomes generally available.

Microsoft Connected Cache (MCC) is deployed to Azure IoT Edge gateways as an IoT Edge module. Like other IoT Edge modules, environment variables and container create options are used to configure MCC modules. This article defines the environment variables and container create options that are required for a customer to successfully deploy the Microsoft Connected Cache module for use by Device Update for IoT Hub.

## Module deployment details

There's no naming requirement for the Microsoft Connected Cache module since no other module or service interactions rely on the name of the MCC module for communication. Additionally, the parent-child relationship of the Microsoft Connected Cache servers isn't dependent on this module name, but rather the FQDN or IP address of the IoT Edge gateway.

Microsoft Connected Cache module environment variables are used to pass basic module identity information and functional module settings to the container.

| Variable name | Value format | Description |
|--|--|--|--|
| CUSTOMER_ID | Azure subscription ID GUID | Required <br><br> This is the customer's key, which provides secure authentication of the cache node to Delivery Optimization services. |
| CACHE_NODE_ID | Cache node ID GUID | Required <br><br> Uniquely identifies the MCC node to Delivery Optimization services. |
| CUSTOMER_KEY | Customer Key GUID | Required <br><br> This is the customer's key, which provides secure authentication of the cache node to Delivery Optimization services. |
| STORAGE_*N*_SIZE_GB (Where *N* is the cache drive) | Integer | Required <br><br> Specify up to nine drives to cache content and specify the maximum space in gigabytes to allocate for content on each cache drive. The number of the drive must match the cache drive binding values specified in the container create option MicrosoftConnectedCache*N* value.<br><br>Examples:<br>STORAGE_1_SIZE_GB = 150<br>STORAGE_2_SIZE_GB = 50<br><br>Minimum size of the cache is 10 GB. |
| UPSTREAM_HOST | FQDN/IP | Optional <br><br> This value can specify an upstream MCC node that acts as a proxy if the Connected Cache node is disconnected from the internet. This setting is used to support the nested IoT scenario.<br><br>**Note:** MCC listens on http default port 80. |
| UPSTREAM_PROXY | FQDN/IP:PORT | Optional <br><br> The outbound internet proxy. This could also be the OT DMZ proxy of an ISA 95 network. |
| CACHEABLE_CUSTOM_*N*_HOST | HOST/IP<br>FQDN | Optional <br><br> Required to support custom package repositories. Repositories could be hosted locally or on the internet. There's no limit to the number of custom hosts that can be configured.<br><br>Examples:<br>Name = CACHEABLE_CUSTOM_1_HOST Value = packages.foo.com<br> Name = CACHEABLE_CUSTOM_2_HOST Value = packages.bar.com |
| CACHEABLE_CUSTOM_*N*_CANONICAL | Alias | Optional <br><br> Required to support custom package repositories. This value can be used as an alias and will be used by the cache server to reference different DNS names. For example, repository content hostname may be packages.foo.com, but for different regions there could be an extra prefix that is added to the hostname like westuscdn.packages.foo.com and eastuscdn.packages.foo.com. By setting the canonical alias, you ensure that content isn't duplicated for content coming from the same host, but different CDN sources. The format of the canonical value isn't important, but it must be unique to the host. It may be easiest to set the value to match the host value.<br><br>Examples based on Custom Host examples above:<br>Name = CACHEABLE_CUSTOM_1_CANONICAL Value = foopackages<br> Name = CACHEABLE_CUSTOM_2_CANONICAL Value = packages.bar.com |
| IS_SUMMARY_PUBLIC | True or False | Optional <br><br> Enables viewing of the summary report on the local network or internet. Use of an API key (discussed later) is required to view the summary report if set to true. |
| IS_SUMMARY_ACCESS_UNRESTRICTED | True or False | Optional <br><br> Enables viewing of summary report on the local network or internet without use of API key from any device in the network. Use if you don't want to lock down access to viewing cache server summary data via the browser. |

## Module container create options

Container create options provide control of the settings related to storage and ports used by the Microsoft Connected Cache module.

Sample container create options:

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

The following sections list the required container create variables used to deploy the MCC module.

### HostConfig

The `HostConfig` parameters are required to map the container storage location to the storage location on the disk. Up to nine locations can be specified.

>[!Note]
>The number of the drive must match the cache drive binding values specified in the environment variable STORAGE_*N*_SIZE_GB value, `/MicrosoftConnectedCache*N*/:/nginx/cache*N*/`.

### PortBindings

The `PortBindings` parameters map container ports to ports on the host device.

The first port binding specifies the external machine HTTP port that MCC listens on for content requests. The default HostPort is port 80 and other ports aren't supported at this time as the ADU client makes requests on port 80 today. TCP port 8081 is the internal container port that the MCC listens on and can't be changed.

The second port binding ensures that the container isn't listening on host port 5000. The Microsoft Connected Cache module has a .NET Core service, which is used by the caching engine for various functions. To support nested edge, the HostPort must not be set to 5000 because the registry proxy module is already listening on host port 5000.

## Microsoft Connected Cache summary report

The summary report is currently the only way for a customer to view caching data for the Microsoft Connected Cache instances deployed to IoT Edge gateways. The report is generated at 15-second intervals and includes averaged stats for the period and aggregated stats for the lifetime of the module. The key stats that customers will be interested in are:

* **hitBytes** - The sum of bytes delivered that came directly from cache.
* **missBytes** - The sum of bytes delivered that Microsoft Connected Cache had to download from CDN to see the cache.
* **eggressBytes** - The sum of hitBytes and missBytes and is the total bytes delivered to clients.
* **hitRatioBytes** - The ratio of hitBytes to egressBytes. For example, if 100% of eggressBytes delivered in a period were equal to the hitBytes, this value would be 1.


The summary report is available at `http://<IoT Edge gateway>:5001/summary` Replace \<IoT Edge Gateway\> with the IP address or hostname of the IoT Edge gateway hosting the MCC module.
