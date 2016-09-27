<properties
 pageTitle="Developer guide - query language | Microsoft Azure"
 description="Azure IoT Hub developer guide - description of query language used to retrieve information about twins, methods, and jobs from your IoT hub"
 services="iot-hub"
 documentationCenter=".net"
 authors="fsautomata"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/30/2016" 
 ms.author="elioda"/>

# Reference - query language for twins, methods, and jobs

## Overview

## Reference sections
organization.

Examples (twins)

        {                                                                      
            "deviceId": "myDeviceId",                                            
            "etag": "AAAAAAAAAAc=",                                              
            "tags": {                                                            
                "location": {                                                      
                    "region": "US",                                                  
                    "plant": "Redmond43"                                             
                }                                                                  
            },                                                                   
            "properties": {                                                      
                "desired": {                                                       
                    "telemetryConfig": {                                             
                        "configId": "db00ebf5-eeeb-42be-86a1-458cccb69e57",            
                        "sendFrequencyInSecs": 300                                          
                    },                                                               
                    "$metadata": {                                                   
                    ...                                                     
                    },                                                               
                    "$version": 4                                                    
                },                                                                 
                "reported": {                                                      
                    "connectivity": {                                                
                        "type": "cellular"                            
                    },                                                               
                    "telemetryConfig": {                                             
                        "configId": "db00ebf5-eeeb-42be-86a1-458cccb69e57",            
                        "sendFrequencyInSecs": 300,                                         
                        "status": "Success"                                            
                    },                                                               
                    "$metadata": {                                                   
                    ...                                                
                    },                                                               
                    "$version": 7                                                    
                }                                                                  
            }                                                                    
        }

// Running example and snippets (filters, projection, aggregation)
number operators, string = and IN (array) on tags and prop.
project and aggregation (simple and group by).

SELECT * FROM devices

SELECT * FROM devices WHERE tags.location.region = 'US'

SELECT * FROM devices WHERE tags.location.region = 'US' AND NOT plant = 'Redmond43'

SELECT 

// job example
select from single device, from multiple devices, aggregate

// Detailed.

Follow docdb/specs.
select
from
Where




## Next steps

Other reference topics in this IoT Hub developer guide include:

- [IoT Hub endpoints][lnk-devguide-endpoints]
- [Quotas and throttling][lnk-devguide-quotas]
- [IoT Hub MQTT support][lnk-devguide-mqtt]


[lnk-devguide-endpoints]: iot-hub-devguide-endpoints.md
[lnk-devguide-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md