---
title: Persist state in Windows - Azure Event Grid IoT Edge | Microsoft Docs 
description: Persist state in Windows
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 10/06/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Persist state in Windows

Topics and subscriptions created in the Event Grid module are stored in the container file system by default. Without persistence, if the module is redeployed, all the metadata created would be lost. To preserve the data across deployments and restarts, you need to persist the data outside the container file system. 

By default only metadata is persisted and events are still stored in-memory for improved performance. Follow the persist events section to enable event persistence as well.

This article provides the steps needed to deploy Event Grid module with persistence in Windows deployments.

> [!NOTE]
>The Event Grid module runs as a low-privileged user **ContainerUser** in Windows.

## Persistence via volume mount

[Docker volumes](https://docs.docker.com/storage/volumes/) are used to preserve data across deployments. To mount a volume, you need to create it using docker commands, give permissions so that the container can read, write to it, and then deploy the module.

1. Create a volume by running the following command:

    ```sh
    docker -H npipe:////./pipe/iotedge_moby_engine volume create <your-volume-name-here>
    ```

    For example,

   ```sh
   docker -H npipe:////./pipe/iotedge_moby_engine volume create myeventgridvol
   ```
1. Get the host directory that the volume maps to by running the below command

    ```sh
    docker -H npipe:////./pipe/iotedge_moby_engine volume inspect <your-volume-name-here>
    ```

    For example,

   ```sh
   docker -H npipe:////./pipe/iotedge_moby_engine volume inspect myeventgridvol
   ```

   Sample Output:-

   ```json
   [
          {
            "CreatedAt": "2019-07-30T21:20:59Z",
            "Driver": "local",
            "Labels": {},
            "Mountpoint": "C:\\ProgramData\\iotedge-moby\u000bolumes\\myeventgridvol\\_data",
            "Name": "myeventgridvol",
            "Options": {},
            "Scope": "local"
          }
   ]
   ```
1. Add the **Users** group to value pointed by **Mountpoint** as follows:
    1. Launch File Explorer.
    1. Navigate to the folder pointed by **Mountpoint**.
    1. Right-click, and then select **Properties**.
    1. Select **Security**.
    1. Under *Group or user names, select **Edit**.
    1. Select **Add**, enter `Users`, select **Check Names**, and select **Ok**.
    1. Under *Permissions for Users*, select **Modify**, and select **Ok**.
1. Use **Binds** to mount this volume and redeploy Event Grid module from Azure portal

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
                  "<your-volume-name-here>:C:\\app\\metadataDb"
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
   >Do not change the second part of the bind value. It points to a specific location in the module. For Event Grid module on windows, it has to be **C:\\app\\metadataDb**.


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
                "myeventgridvol:C:\\app\\metadataDb",
                "C:\\myhostdir2:C:\\app\\eventsDb"
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

## Persistence via host directory mount

Instead of mounting a volume, you can create a directory on the host system and mount that directory.

1. Create a directory on the host filesystem by running the following command.

   ```sh
   mkdir <your-directory-name-here>
   ```

   For example,

   ```sh
   mkdir C:\myhostdir
   ```
1. Use **Binds** to mount your directory and redeploy the Event Grid module from Azure portal.

    ```json
    {
         "HostConfig": {
            "Binds": [
                "<your-directory-name-here>:C:\\app\\metadataDb"
             ]
         }
    }
    ```

    >[!IMPORTANT]
    >Do not change the second part of the bind value. It points to a specific location in the module. For the Event Grid module on windows, it has to be **C:\\app\\metadataDb**.

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
                "C:\\myhostdir:C:\\app\\metadataDb",
                "C:\\myhostdir2:C:\\app\\eventsDb"
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
## Persist events

To enable event persistence, you must first enable events persistence either via volume mount or host directory mount using the above sections.

Important things to note about persisting events:

* Persisting events is enabled on a per Event Subscription basis and is opt-in once a volume or directory has been mounted.
* Event persistence is configured on an Event Subscription at creation time and cannot be modified once the Event Subscription is created. To toggle event persistence, you must delete and re-create the Event Subscription.
* Persisting events is almost always slower than in memory operations, however the speed difference is highly dependent on the characteristics of the drive. The tradeoff between speed and reliability is inherent to all messaging systems but only becomes a noticeable at large scale.

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