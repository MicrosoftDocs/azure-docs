---
title: Persist state in Linux - Azure Event Grid IoT Edge | Microsoft Docs 
description: Persist metadata in Linux 
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: 
ms.date: 08/30/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Persist state in Linux

Topics and subscriptions created in the Event Grid module are by default stored in the container filesystem. Without persistence, if the module were redeployed then all the metadata created would be lost. Currently only metadata is persisted. Events are stored in-memory. If Event Grid module is redeployed or restarted, then any undelivered events will be lost.

The rest of the document details the steps needed to deploy Event Grid module with persistence in Linux deployments.

> [!NOTE]
>The Event Grid module runs as a low-privileged user with UID **2000** and name **eventgriduser**.

## Option 1: Persistence via volume mount

 We make use of [docker volumes](https://docs.docker.com/storage/volumes/) to preserve the data across deployments. You can let docker automatically create a named volume as part of deploying Event Grid module. This is the simplest option. You can specify the volume name to be created in the **Binds** section as follows:

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
>Do not change the second part of the bind value. It points to a specific location within the module. For Event Grid module on linux it has to be **/app/metadata**.

For example, below configuration will result in the creation of  volume **egmetadataDbVol** where metadata will be persisted.

```json
 {
  "Env": [
    "inbound:serverAuth:tlsPolicy=strict",
    "inbound:serverAuth:serverCert:source=IoTEdge",
    "inbound:clientAuth:sasKeys:enabled=false",
    "inbound:clientAuth:clientCert:enabled=true",
    "inbound:clientAuth:clientCert:source=IoTEdge",
    "inbound:clientAuth:clientCert:allowUnknownCA=true",
    "outbound:clientAuth:clientCert:enabled=true",
    "outbound:clientAuth:clientCert:source=IoTEdge",
    "outbound:webhook:httpsOnly=true",
    "outbound:webhook:skipServerCertValidation=false",
    "outbound:webhook:allowUnknownCA=true"
  ],
  "HostConfig": {
    "Binds": [
      "egmetadataDbVol:/app/metadataDb"
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

Alternatively you can create a docker volume using docker client commands. Refer to docker documentation on how to do this.

## Option 2: Persistence via host directory mount

Instead of docker volume, you also have the option to mount a host folder.

1. First create a user with name **eventgriduser** and ID **2000** on the host machine by running the following command:

    ```sh
    sudo useradd -u 2000 eventgriduser
    ```

1. Create a directory on the host filesystem by running the below command.

   ```sh
   md <your-directory-name-here>
   ```

    For example, running the below command will create a directory called **myhostdir**.

    ```sh
    md /myhostdir
    ```

1. Next, make **eventgriduser** owner of this folder by running the below command.

   ```sh
   sudo chown eventgriduser:eventgriduser -hR <your-directory-name-here>
   ```

    For example,

    ```sh
    sudo chown eventgriduser:eventgriduser -hR /myhostdir
    ```

1. Use **Binds** to mount the directory and redeploy Event Grid module from Azure portal

    ```json
    {
         "HostConfig": {
            "Binds": [
                "<your-directory-name-here>:/app/metadataDb"
             ]
         }
    }
    ```

    For example,

    ```json
    {
          "Env": [
            "inbound:serverAuth:tlsPolicy=strict",
            "inbound:serverAuth:serverCert:source=IoTEdge",
            "inbound:clientAuth:sasKeys:enabled=false",
            "inbound:clientAuth:clientCert:enabled=true",
            "inbound:clientAuth:clientCert:source=IoTEdge",
            "inbound:clientAuth:clientCert:allowUnknownCA=true",
            "outbound:clientAuth:clientCert:enabled=true",
            "outbound:clientAuth:clientCert:source=IoTEdge",
            "outbound:webhook:httpsOnly=true",
            "outbound:webhook:skipServerCertValidation=false",
            "outbound:webhook:allowUnknownCA=true"
          ],
          "HostConfig": {
                "Binds": [
                  "/myhostdir:/app/metadataDb"
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
    >Do not change the second part of the bind value. It points to a specific location within the module. For Event Grid module on linux it has to be **/app/metadata**.
