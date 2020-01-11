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

Topics and subscriptions created in the Event Grid module are by default stored in the container file system. Without persistence, if the module is redeployed, all the metadata created would be lost. To preserve the data across deployments, you will need to persist the data outside the container file system. Currently, only metadata is persisted. Events are stored in-memory. If Event Grid module is redeployed or restarted, then any undelivered events will be lost.

This article provides the steps needed to deploy Event Grid module with persistence in Windows deployments.

> [!NOTE]
>The Event Grid module runs as a low-privileged user **ContainerUser** in Windows.

## Persistence via volume mount

[Docker volumes](https://docs.docker.com/storage/volumes/) are used to preserve data across deployments. To mount a volume, you need to create it using docker commands, give permissions so that the container can read, write to it, and then deploy the module. There is no provision to automatically create a volume with necessary permissions on Windows. It needs to be created before deploying.

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
                "myeventgridvol:C:\\app\\metadataDb"
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

Alternatively, you can choose to create a directory on the host system and mount that directory.

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
                "C:\\myhostdir:C:\\app\\metadataDb"
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
