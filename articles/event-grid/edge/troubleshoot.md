---
title: Troubleshoot - Azure Event Grid IoT Edge | Microsoft Docs 
description: Troubleshooting in Event Grid on IoT Edge.  
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 07/08/2020
ms.topic: article
---

# Common Issues

If you experience issues using Azure Event Grid on IoT Edge in your environment, use this article as a guide for troubleshooting and resolution.

## View Event Grid module logs

To troubleshoot, you might need to access Event Grid module logs. To do this, on the VM where the module is deployed run the following command:

On Windows,

```sh
docker -H npipe:////./pipe/iotedge_moby_engine container logs eventgridmodule
```

On Linux,

```sh
sudo docker logs eventgridmodule
```

## Unable to make HTTPS requests

* First make sure Event Grid module has **inbound:serverAuth:tlsPolicy** set to **strict** or **enabled**.

* If its module-to-module communications, make sure that you are making the call on port **4438** and the name of the module matches what is deployed. 

  For e.g., if Event Grid module was deployed with name **eventgridmodule** then your URL should be **https://eventgridmodule:4438**. Make sure casing and port number are correct.
    
* If it's from non-IoT module, make sure Event Grid port is mapped on to the Host machine during deployment for example,

    ```json
    "HostConfig": {
                "PortBindings": {
                  "4438/tcp": [
                    {
                        "HostPort": "4438"
                    }
                  ]
                }
     }
    ```

## Unable to make HTTP requests

* First make sure Event Grid module has **inbound:serverAuth:tlsPolicy** set to **enabled** or **disabled**.

* If its module-to-module communications, make sure that you are making the call on port **5888** and the name of the module matches what is deployed. 

  For e.g., if Event Grid module was deployed with name **eventgridmodule** then your URL should be **http://eventgridmodule:5888**. Make sure casing and port number are correct.
    
* If it's from non-IoT module, make sure Event Grid port is mapped on to the Host machine during deployment for example,

    ```json
    "HostConfig": {
                "PortBindings": {
                  "5888/tcp": [
                    {
                        "HostPort": "5888"
                    }
                  ]
                }
    }
    ```

## Certificate chain was issued by an authority that's not trusted

By default, Event Grid module is configured to authenticate clients with certificate issued by the IoT Edge security daemon. Make sure the client is presenting a certificate that is rooted to this chain.

**IoTSecurity** class in [https://github.com/Azure/event-grid-iot-edge](https://github.com/Azure/event-grid-iot-edge) shows how to retrieve certificates from IoT Edge Security daemon and use that to configure outgoing calls.

If it is non-production environment, you have the option to turn off client authentication. Refer to [Security and Authentication](security-authentication.md) for details on how to do this.

## Debug Events not received by subscriber

Typical reasons for this are:

* The event was never successfully posted. An HTTP StatusCode of 200(OK) should been received on posting an event to Event Grid module.

* Check the event subscription to verify:
    * Endpoint URL is valid
    * Any filters in the subscription are not causing the event to be "dropped".

* Verify if the subscriber module is running

* Log on to the VM where Event Grid module is deployed and view its logs.

* Turn on per delivery logging by setting **broker:logDeliverySuccess=true** and redeploying Event Grid module and retrying the request. Turning on logging per delivery can impact throughput and latency so once debugging is complete our recommendation is to turn this back to **broker:logDeliverySuccess=false**  and redeploying  Event Grid module.

* Turn on metrics by setting **metrics:reportertype=console** and redeploy Event Grid module. Any operations after that will result in metrics being logged on the console of Event Grid module, which can be used to debug further. Our recommendation is to turn on metrics only for debugging and once complete to turn it off by setting **metrics:reportertype=none** and redeploying  Event Grid module.

## Next steps

Report any issues, suggestions with using Event Grid on IoT Edge at [https://github.com/Azure/event-grid-iot-edge/issues](https://github.com/Azure/event-grid-iot-edge/issues).