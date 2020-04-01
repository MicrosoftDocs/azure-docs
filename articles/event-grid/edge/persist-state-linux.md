---
title: Persist state in Linux - Azure Event Grid IoT Edge | Microsoft Docs 
description: Persist metadata in Linux 
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 10/06/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Persist state in Linux

Topics and subscriptions created in the Event Grid module are stored in the container file system by default. Without persistence, if the module is redeployed, all the metadata created would be lost. To preserve the data across deployments and restarts, you  need to persist the data outside the container file system.

By default only metadata is persisted and events are still stored in-memory for improved performance. Follow the persist events section to enable event persistence as well.

This article provides the steps to deploy the Event Grid module with persistence in Linux deployments.

> [!NOTE]
>The Event Grid module runs as a low-privileged user with UID `2000` and name `eventgriduser`.

## Persistence via volume mount

 [Docker volumes](https://docs.docker.com/storage/volumes/) are used to preserve the data across deployments. You can let docker automatically create a named volume as part of deploying the Event Grid module. This option is the simplest option. You can specify the volume name to be created in the **Binds** section as follows:

```json
  {
     "HostConfig": {
          "Binds": [
                 "<your-volume-name-here>:/app/metadataDb"
           ]
      }
   }
```

>[!IMPORTANT]
>Do not change the second part of the bind value. It points to a specific location within the module. For the Event Grid module on Linux, it has to be **/app/metadataDb**.

For example, the following configuration will result in the creation of the volume **egmetadataDbVol** where metadata will be persisted.

```json
 {
  "Env": [
    "inbound__serverAuth__tlsPolicy=strict",
    "inbound__serverAuth__serverCert__source=IoTEdge",
    "inbound__clientAuth__sasKeys__enabled=false",
    "inbound__clientAuth__clientCert__enabled=true",
    "inbound__clientAuth__clientCert__source=IoTEdge",
    "inbound__clientAuth__clientCert__allowUnknownCA=true",
    "outbound__clientAuth__clientCert__enabled=true",
    "outbound__clientAuth__clientCert__source=IoTEdge",
    "outbound__webhook__httpsOnly=true",
    "outbound__webhook__skipServerCertValidation=false",
    "outbound__webhook__allowUnknownCA=true"
  ],
  "HostConfig": {
    "Binds": [
      "egmetadataDbVol:/app/metadataDb",
      "egdataDbVol:/app/eventsDb"
    ],
    "PortBindings": {
      "4438/tcp": [
        {
          "HostPort": "4438"
        }
      ]
    }
  }
}
```

Instead of mounting a volume, you can create a directory on the host system and mount that directory.

## Persistence via host directory mount

Instead of a docker volume, you also have the option to mount a host folder.

1. First create a user with name **eventgriduser** and ID **2000** on the host machine by running the following command:

    ```sh
    sudo useradd -u 2000 eventgriduser
    ```
1. Create a directory on the host file system by running the following command.

   ```sh
   md <your-directory-name-here>
   ```

    For example, running the following command will create a directory called **myhostdir**.

    ```sh
    md /myhostdir
    ```
1. Next, make **eventgriduser** owner of this folder by running the following command.

   ```sh
   sudo chown eventgriduser:eventgriduser -hR <your-directory-name-here>
   ```

    For example,

    ```sh
    sudo chown eventgriduser:eventgriduser -hR /myhostdir
    ```
1. Use **Binds** to mount the directory and redeploy the Event Grid module from Azure portal.

    ```json
    {
         "HostConfig": {
            "Binds": [
                "<your-directory-name-here>:/app/metadataDb",
                "<your-directory-name-here>:/app/eventsDb",
             ]
         }
    }
    ```

    For example,

    ```json
    {
          "Env": [
            "inbound__serverAuth__tlsPolicy=strict",
            "inbound__serverAuth__serverCert__source=IoTEdge",
            "inbound__clientAuth__sasKeys__enabled=false",
            "inbound__clientAuth__clientCert__enabled=true",
            "inbound__clientAuth__clientCert__source=IoTEdge",
            "inbound__clientAuth__clientCert__allowUnknownCA=true",
            "outbound__clientAuth__clientCert__enabled=true",
            "outbound__clientAuth__clientCert__source=IoTEdge",
            "outbound__webhook__httpsOnly=true",
            "outbound__webhook__skipServerCertValidation=false",
            "outbound__webhook__allowUnknownCA=true"
          ],
          "HostConfig": {
                "Binds": [
                  "/myhostdir:/app/metadataDb",
                  "/myhostdir2:/app/eventsDb"
                ],
                "PortBindings": {
                      "4438/tcp": [
                        {
                          "HostPort": "4438"
                        }
                      ]
                }
          }
    }
    ```

    >[!IMPORTANT]
    >Do not change the second part of the bind value. It points to a specific location within the module. For the Event Grid module on linux, it has to be **/app/metadataDb** and **/app/eventsDb**


## Persist events

To enable event persistence, you must first enable metadata persistence either via volume mount or host directory mount using the above sections.

Important things to note about persisting events:

* Persisting events is enabled on a per Event Subscription basis and is opt-in once a volume or directory has been mounted.
* Event persistence is configured on an Event Subscription at creation time and cannot be modified once the Event Subscription is created. To toggle event persistence, you must delete and re-create the Event Subscription.
* Persisting events is almost always slower than in memory operations, however the speed difference is highly dependent on the characteristics of the drive. The tradeoff between speed and reliability is inherent to all messaging systems but generally only becomes a noticeable at large scale.

To enable event persistence on an Event Subscription, set `persistencePolicy` to `true`:

 ```json
        {
          "properties": {
            "persistencePolicy": {
              "isPersisted": "true"
            },
            "destination": {
              "endpointType": "WebHook",
              "properties": {
                "endpointUrl": "<your-webhook-url>"
              }
            }
          }
        }
 ```
