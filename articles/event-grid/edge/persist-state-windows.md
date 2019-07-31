---
title: Persist state in Windows - Azure Event Grid IoT Edge | Microsoft Docs 
description: Persist state in Windows
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: 
ms.date: 07/22/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Persist state in Windows

Topics and subscriptions created in the Event Grid module are by default stored in the container filesystem. Without persistence, if the module were redeployed then all the metadata created would be lost. To preserve the data across deployments, you will need to persist the data outside the container filesystem. The rest of the document details the steps needed to deploy Event Grid module with persistence in Windows deployments.

> [!NOTE]
>Currently only metadata is persisted. Events are stored in-memory. If Event Grid module is redeployed or restarted then any undelivered events will be lost.

Unlike Linux deployments, on Windows Event Grid module runs under **ContainerUser**, a low-privileged user already available in Windows and is part of the local machine's Users No extra setup is required.

We make use of [docker volumes](https://docs.docker.com/storage/volumes/) to enable persistence. Persistence in docker basically involves mounting a host directory onto the container. There are a couple of ways to mount host directory onto a container.

## Option 1: Explicitly mount a container host directory

1. Create a directory on the host filesystem by running the below command.

   ```sh
   mkdir <your-directory-name-here>
   ```

    For example,

      ```sh
      mkdir C:\myhostdir
      ```

1. Use **Binds** to mount your directory and redeploy Event Grid module from Azure portal

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
    >Do not change the second part of the bind value. It points to a specific location in the module. For Event Grid module on windows it has to be **C:\\app\\metadataDb**.

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

## Option 2: Mount host directory via docker volume

Alternatively you can create a docker volume, map the volume onto the container as follows.

1. Create a volume by running the below command

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

   ```sh
   [
    {
        "CreatedAt": "2019-07-30T21:20:59Z",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "C:\\ProgramData\\iotedge-moby\\volumes\\myeventgridvol\\_data",
        "Name": "myeventgridvol",
        "Options": {},
        "Scope": "local"
    }
   ]
   ```

1. Add the group **Users** to value pointed by **Mountpoint** as follows:
    1. Open File Explorer
    1. Navigate to the folder pointed by **Mountpoint**
    1. Right click and go to properties
    1. Select **Security**
    1. Under *Group or user names:*, click on **Edit**
    1. Click on **Add** and enter `Users` and click on **Check Names** and click **Ok**
    1. Under *Permissions for Users*, select `Modify` and click **Ok**

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
    >Do not change the second of the bind value. It points to a specific location in the module. For Event Grid module on windows it has to be **C:\\app\\metadataDb**.

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