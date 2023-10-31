---
 title: include file
 description: include file
 services: event-grid
 author: jfggdl
 ms.service: event-grid
 ms.topic: include
 ms.date: 11/02/2023
 ms.author: jafernan
ms.custom: include file, ignite-2023
---


### Data shape when receiving events using pull delivery

When **delivering events using pull delivery**, Event Grid includes an array of objects that in turn includes the *event* and *brokerProperties* objects. The value of the *event* property is the CloudEvent delivered in structured content mode. The *brokerProperties* object contains the lock token associated to the CloudEvent delivered. The following json object is a sample response from a *receive* operation that returns two events:

```json
{
    "value": [
        {
            "brokerProperties": {
                "lockToken": "CiYKJDUwNjE4QTFFLUNDODQtNDZBQy1BN0Y4LUE5QkE3NjEwNzQxMxISChDXYS23Z+5Hq754VqQjxywE",
                "deliveryCount": 2
            },
            "event": {
                "specversion": "1.0",
                "id": "A234-1234-1235",
                "source": "/mycontext",
                "time": "2018-04-05T17:31:00Z",
                "type": "com.example.someeventtype",
                "data": "some data"
            }
        },
        {
            "brokerProperties": {
                "lockToken": "CiYKJDUwNjE4QTFFLUNDODQtNDZBQy1BN0Y4LUE5QkE3NjEwNzQxMxISChDLeaL+nRJLNq3/5NXd/T0b",
                "deliveryCount": 1
            },
            "event": {
                "specversion": "1.0",
                "id": "B688-1234-1235",
                "source": "/mycontext",
                "type": "com.example.someeventtype",
                "time": "2018-04-05T17:31:00Z",
                "data": {
                    "somekey" : "value",
                    "someOtherKey" : 9
                }
            }
        }
    ]
}
```