# Plug and Limits, Quotas and Throttling

This article explains the Limits, quotas and throttling for Plug and Play public preview. There are existing [quotas and throttling](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-quotas-throttling) for an IoT Hub, this will also apply to Plug and Play. In addition, here are the Plug and Play specific limits, quotas and throttling.

## IoT Hub
For public preview, we have these known limits and quotas that apply to an IoT Hub
| Limits, restrictions & throttles | Value | Notes |
|-----|-----|-----|
| # of DCMs or Interfaces that can be registered per Hub | 1500 ||
| Max # of interfaces that can be registered per device | 40 ||
| Max # of DCMs that can be registered per device| 1 ||
| Max size of an interface name| 256 chars ||
| Max size of a property name - regular twin  | 64 bytes, 5 levels in depth (and the first level is reserved for $iotin) |Restricted characters:  '.', '$', '#' and whitespace.|
| Max size of a property name - large twin  | 4096 bytes, 10 levels in depth (and the first level is reserved for $iotin) |Restricted characters:  '.', '$', '#' and whitespace.|
| Max size of a property value - regular twin | 512 bytes ||
| Max size of a property value - large twin | 4096 bytes ||
| Max size of a command name | 100 bytes ||
| Resolution API calls across SKU (regardless of units) | 100 request/sec |

## Model Repository
| Limits, restrictions & throttles| Value |
|-----|-----|
| # of company model repositories per AAD tenant | 1 |
| # of auth keys per model repository | 10  |
| # of models (DCMs or Interfaces) per company model repository| 1500  |
| # of models (DCMs or Interfaces) in the public model repository per AAD tenant| 1500  |
|# of DCM or Interface being deleted in a company model repository| 10 qps (query per second)|
|# of model repositories being created/updated by a tenant|	1 qps |
|# of auth keys being created/updated/deleted in a model repository |	1 qps|
|# of DCMs being created in a company model repository |	 10 qps|
|# of Interfaces being created in a company model repository | 10 qps|
|# of DCMs being created in a public model repository |	 10 qps|
|# of Interfaces being created in a public model repository | 10 qps|


## Parser Library
Parser library follows the limits that apply to the [Digital Twin Definition Language](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL). 