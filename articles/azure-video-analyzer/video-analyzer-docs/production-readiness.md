---
title: Production readiness and best practices
description: This article provides guidance on how to configure and deploy the Azure Video Analyzer module in production environments.
ms.topic: reference
ms.date: 06/01/2021

---
# Production readiness and best practices

This article provides guidance on how to configure and deploy the Azure Video Analyzer edge module and cloud service in production environments. You should also review [Prepare to deploy your IoT Edge solution in production](../../iot-edge/production-checklist.md) article on preparing your IoT Edge solution.

> [!NOTE]
> You should consult your organizations’ IT departments on aspects related to security.

## Creating the Video Analyzer account
When you [create](create-video-analyzer-account.md) a Video Analyzer account, the following is recommended:
1. The subscription owner should create a resource group under which all resources needed by Video Analyzer are to be created.
1. Then, the owner should grant you [Contributor](../../role-based-access-control/built-in-roles.md#contributor) and [User Access Administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) roles to that resource group.
1. You can then create the relevant resources: Storage account, user-assigned managed identity, and Video Analyzer account under that resource group.

## Running the module as a local user

When you deploy the Video Analyzer edge module to an IoT Edge device, by default it runs with elevated privileges. You can check this using the logs from the module (`sudo iotedge logs {name-of-module}`) which would show:

```
!! production readiness: user accounts – Warning
       LOCAL_USER_ID and LOCAL_GROUP_ID environment variables are not set. The program will run as root!
       For optimum security, make sure to set LOCAL_USER_ID and LOCAL_GROUP_ID environment variables to a non-root user and group.
```

The sections below discuss how you can address the above warning.

### Creating and using a local user account

You can and should run the Video Analyzer edge module in production using an account with as few privileges as possible. The following commands, for example, show how you can create a local user account on a Linux VM:

```
sudo groupadd -g 1010 localedgegroup
sudo useradd --home-dir /home/localedgeuser --uid 1010 --gid 1010 localedgeuser
```

Next, in the deployment manifest, you can set the LOCAL_USER_ID and LOCAL_GROUP_ID environment variables to that non-root user and group:

```
"avaedge": {
"version": "1.0",
…
"env": {
    "LOCAL_USER_ID": 
    {
        "value": "1010"
    },
    "LOCAL_GROUP_ID": {
        "value": "1010"
    }
}
},
…
```

### Granting permissions to device storage

The Video Analyzer edge module requires the ability to write files to the local file system when:

- Using a module twin property [`applicationDataDirectory`](module-twin-configuration-schema.md), where you should specify a directory on the local file system for storing configuration data.
- Using a pipeline to record video to the cloud, the module requires the use of a directory on the edge device as a cache (see [Continuous video recording](continuous-video-recording.md) article for more information).
- [Recording to a local file](event-based-video-recording-concept.md), where you specify a file path for the recorded video.

If you intend to make use of any of the above, you should ensure that the above user account has access to the relevant directory. Consider `applicationDataDirectory` for example. You can create a directory on the edge device and link device storage to module storage.

```
sudo mkdir /var/lib/videoanalyzer
sudo chown -R localedgeuser:localedgegroup /var/lib/videoanalyzer
```

Next, in the create options for the edge module in the deployment manifest, you can add a `binds` setting mapping the directory ("/var/lib/videoanalyzer") above to a directory in the module (such as "/var/lib/videoanalyzer"). And you would use the latter directory as the value for `applicationDataDirectory`.

```
        "modules": {
          "avaedge": {
            "version": "1.1",
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "settings": {
              "image": "mcr.microsoft.com/media/video-analyzer:1",
              "createOptions": "{ \"HostConfig\": { \"LogConfig\": { \"Type\": \"\", \"Config\": { \"max-size\": \"10m\", \"max-file\": \"10\" } }, \"Binds\": [ \"/var/media/:/var/media/\", \"/var/lib/videoanalyzer/:/var/lib/videoanalyzer\" ], \"IpcMode\": \"host\", \"ShmSize\": 1536870912 } }"
            },
            "env": {
              "LOCAL_USER_ID": {
                "value": "1010"
              },
              "LOCAL_GROUP_ID": {
                "value": "1010"
              }
            }
          },
          …
        },
        
    …
    
    "avaedge": {
       "properties.desired": {
          "applicationDataDirectory": "/var/lib/videoanalyzer",
          "ProvisioningToken": "{your-token}",
          "diagnosticsEventsOutputName": "diagnostics",
          "operationalEventsOutputName": "operational",
          "logLevel": "information",
          "LogCategories": "Application,Events",
          "allowUnsecuredEndpoints": true,
          "telemetryOptOut": false
          "allowUnsecuredEndpoints": false
    }
}
```

If you look at the sample pipelines for the quickstart, and tutorials such as [continuous video recording](use-continuous-video-recording.md), you will note that the media cache directory (`localMediaCachePath`) uses a subdirectory under `applicationDataDirectory`. This is the recommended approach, since the cache contains transient data.

Also note that `allowedUnsecuredEndpoints` is set to `true`, as recommended for production environments where you will use TLS encryption to secure traffic.

### Tips about maintaining your edge device

> [!Note]
> The tips below are not an exhaustive list but should help with commonly known issues we have encountered.

The Linux VM that you are using as an IoT Edge device can become unresponsive if it is not managed on a periodic basis. It is essential to keep the caches clean, eliminate unnecessary packages and remove unused containers from the VM as well. To do this here is a set of recommended commands, you can use on your edge VM.

- `sudo apt-get clean`

The apt-get clean command clears the local repository of retrieved package files that are left in /var/cache. The directories it cleans out are /var/cache/apt/archives/ and /var/cache/apt/archives/partial/. The only files it leaves in /var/cache/apt/archives are the lock file and the partial subdirectory. The apt-get clean command is generally used to clear disk space as needed, generally as part of regularly scheduled maintenance. For more information, see [Cleaning up with apt-get](https://www.networkworld.com/article/3453032/cleaning-up-with-apt-get.html).

- `sudo apt-get autoclean`

The apt-get autoclean option, like apt-get clean, clears the local repository of retrieved package files, but it only removes files that can no longer be downloaded and are not useful. It helps to keep your cache from growing too large.

- `sudo apt-get autoremove`

The auto remove option removes packages that were automatically installed because some other package required them but, with those other packages removed, they are no longer needed

- `sudo docker image ls` – Provides a list of Docker images on your edge system

- `sudo docker system prune`

Docker takes a conservative approach to cleaning up unused objects (often referred to as “garbage collection”), such as images, containers, volumes, and networks: these objects are generally not removed unless you explicitly ask Docker to do so. This can cause Docker to use extra disk space. For each type of object, Docker provides a prune command. In addition, you can use `docker system prune` to clean up multiple types of objects at once. For more information, see [Prune unused Docker objects](https://docs.docker.com/config/pruning/).

- `sudo docker rmi REPOSITORY:TAG`

As updates happen on the edge module, your docker can have older versions of the edge module still present. In such a case, it is advisable to use the `docker rmi` command to remove specific images identified by the image version tag.

## Next steps

[Quickstart: Get started – Azure Video Analyzer](get-started-detect-motion-emit-events.md)
