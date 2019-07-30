---
title: Persist state in Linux - Azure Event Grid IoT Edge | Microsoft Docs 
description: Persist metadata in Linux 
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: 
ms.date: 07/22/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Persist state in Linux

Topics and subscriptions created in the Event Grid module are by default stored in the container filesystem. Without persistence, if the module were redeployed then all the metadata created would be lost. To preserve the data across deployments, you will need to persist the data outside the container filesystem. The rest of the document details the steps needed to deploy Event Grid module with persistence in Linux deployments.

> [!NOTE]
>Currently only metadata is persisted. Events are stored in-memory. If Event Grid module is redeployed, restarted then any undelivered events will be lost.

## Step 1: Create **eventgriduser** on the host machine

Event Grid container runs as **eventgriduser**, a low-privileged user.
To persist data, you will first need to ensure that this user exists on the host machine where the container is running. This step needs to happen only one time on the host machine.

To create **eventgriduser**, run the following command on the host machine.

```sh
sudo useradd -u 5000 eventgriduser
```

## Step 2: Mount a host folder onto the Event Grid container

We make use of [docker volumes](https://docs.docker.com/storage/volumes/) to enable persistence. Persistence in docker basically involves mounting a host directory onto the container. There are a couple of ways to mount host directory onto a container.

### Option 1: Explicitly mount a container host directory

1. Create a directory on the host filesystem by running the below command.

   ```sh
   sudo mkdir <your-directory-name-here>
   ```

    For example,

    ```sh
    sudo mkdir /myhostdir
    ```

1. Next, make everyone be able to read, write on this folder by running the below command.

    ```sh
   sudo chmod a+rwx -R <your-directory-name-here>
   ```

   >[!IMPORTANT]
   >In production you will typically add the user to the group that owns the folder instead of giving everyone access to this folder.

    For example,
    ```sh
    sudo chmod a+rwx -R /myhostdir
    ```

1. Use **Binds** to mount your directory and redeploy Event Grid module from Azure portal

    ```json
    {
         "HostConfig": {
            "Binds": [
                "<your-directory-name-here>:/app/metadataDb"
             ]
         }
    }
    ```

    >[!IMPORTANT]
    >Do not change the second part of the bind value. It points to a specific location in the module. For Event Grid module on linux it has to be **/app/metadata**.

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

### Option 2: Mount host directory via docker volume

Alternatively you can create a docker volume, map the volume onto the container as follows.

1. Create a volume by running the below command

    ```sh
    sudo docker volume create <your-volume-name-here>
    ```
    For example,

   ```sh
   sudo docker volume create myeventgridvol
   ```

2. Get the host directory that the volume maps to by running the below command

    ```sh
    sudo docker volume inspect <your-volume-name-here>
    ```

    For example,
    
    ```sh
    sudo docker volume inspect myeventgridvol
    ```
    Sample output:-
    
    ```json
       [
             {
                "CreatedAt": "2019-06-28T00:19:43Z",
                "Driver": "local",
                "Labels": {},
                "Mountpoint": "/var/lib/docker/volumes/myeventgridvol/_data",
                "Name": "metadataDb",
                "Options": {},
                "Scope": "local"
              }
       ]
    ```

1. Next, make everyone be able to read, write on this folder by running the below command.

    ```sh
   sudo chmod a+rwx -R <your-directory-name-here>
   ```

   >[!IMPORTANT]
   >In production you will typically add the user to the group that owns the folder instead of giving everyone access to this folder.

    For example,
    
    ```sh
    sudo chmod a+rwx -R /var/lib/docker/volumes/myeventgridvol/_data
    ```

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
                "<your-volume-name-here>:/app/metadataDb"
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
    >Do not change the second of the bind value. It points to a specific location in the module. For Event Grid module on linux it has to be **/app/metadata**.

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
                "myeventgridvol:/app/metadataDb"
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