---
title: Connect applications in Azure Container Apps
description: Learn to deploy multiple applications that communicate together in Azure Container Apps.
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  conceptual
ms.date: 09/16/2021
ms.author: cshoe
---

# Connect applications in Azure Container Apps

Azure Container Apps exposes each container app through a domain name. If [ingress](overview.md) is enabled, this location is publicly available. If ingress is disabled, the location is internal and only available to other container apps in the same [environment](environment.md).

Once you know a container app's domain name, then you can call the location within your application code to connect multiple container apps together.

## Location anatomy

A container apps' location is composed of values associated with it's environment, name, and location. Available through the `containerapps.io` top-level domain, the fully qualified domain name uses:

- the container app name
- the environment name
- the environment unique identifier
- region name

The following diagram shows how these values are used to compose a container app's fully qualified domain name.

:::image type="content" source="media/connect-apps/azure-container-apps-location.png" alt-text="Azure Container Apps: Container app location":::

### Dapr

When using Dapr, the location is available through a port off localhost. The settings needed for a Dapr location include:

- the Dapr port number
- the container app name

:::image type="content" source="media/connect-apps/azure-container-apps-location-dapr.png" alt-text="Azure Container Apps: Container app location with Dapr":::

## Query for environment settings

The `az containerapp env show` command returns the fully qualified domain name of an application's environment. This location includes the environment's name and unique identifier, which is required to build a container app's location.

```azurecli
az containerapp env show \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <ENVIRONMENT_NAME> \
  --query defaultDomain
```

In this example, replace the placeholders surrounded `<>` with your values.


```sh
env-eqpz7npiyf7p6ul3cq8f.centraluseuap.containerapps.io
```

<!-- PRELIMINARY OUTLINE
- Microservices conceptual leads into this one
- Deploy multiple application and have them communicate together
- microservices with and without dapr

- Internal application endpoints
    - service discovery with DNS
    - Load balancing
- Traffic splitting (manage revisions)
- Dapr (see Yaron)
-->

## Introduction

- all communication between services HTTP/2
- built-in service discovery
    - every pod gets a unique IP
    - IP address is ephemeral (not static)
    - when app scales out - each pod gets an IP
    - challenges to service discover
        - how to get IP address for each pod
        - when you have multiple pods, how do you load balance?
    - answer to challenges
        - built-in DNS
            - every container app has a domain name
                - can be public or internal (depending on ingress)
                    - internal means only available in VNET or environment
            - the domain name is assigned to a proxy
                - the proxy handles load balancing request among pods
            - you have to know the DNS name, then you can call it


https://httpapi.env-y5s6sul6p8qtodngvvki.centraluseuap.workerapps.k4apps.io

-- public
https://<appname>.<envname>-<random_string>.<region>.containerapps.io
        env-eqpz7npiyf7p6ul3cq8f.centraluseuap.workerapps.k4apps.io


-- internal
https://<appname>.internal-<envname>-<random_string>.<region>.containerapps.io

```json
 "template": {
                "containers": [
                    {
                        "image": "vturecek.azurecr.io/queuereader:v2",
                        "name": "queuereader",
                        "env": [
                            {
                                "name": "QueueName",
                                "value": "demoqueue"
                            },
                            {
                                "name": "QueueConnectionString",
                                "secretref": "queueconnection"
                            },
                            {
                                "name": "myappDomain",
                                "value": "<appname>.<envname>-<random_string>.<region>.containerapps.io"
                            }
                        ]
                    }
                ],

```



pass domain name through environment variable

doing load balancing through the domain name, but not much more

the container app making a call to the other container app has to do retires, connection verification, etc.

Dapr helps with these problems

link to info on service to service communication challenges?

## Dapr

```csharp
 private Uri getStoreUrl()
        {
            string daprPort = this.config["DAPR_HTTP_PORT"];
            string targetApp = this.config["TargetApp"];
            if (string.IsNullOrEmpty(daprPort))
            {
                throw new ArgumentNullException("'DaprPort' config value is required. Please add an environemnt variable or app setting.");
            }
            if (string.IsNullOrEmpty(targetApp))
            {
                throw new ArgumentNullException("'TargetApp' config value is required. Please add an environemnt variable or app setting.");
            }
            Uri storeUrl = new Uri($"http://localhost:{daprPort}/v1.0/invoke/{targetApp}/method/store");
            logger.LogInformation($"Ready to send messages to '{storeUrl}'.");
            return storeUrl;
        }
```

## Next steps

> [!div class="nextstepaction"]
> [Get started](get-started.md)
