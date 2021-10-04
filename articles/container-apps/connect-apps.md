---
title: Connect different applications in Azure Container Apps
description: Learn to deploy multiple applications that communicate together in Azure Container Apps.
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  conceptual
ms.date: 09/16/2021
ms.author: cshoe
---

# Connect different applications in Azure Container Apps

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

```sh
az workerapp env show -g demo -n env --query defaultDomain
```


Command group 'workerapp env' is in preview and under development. Reference and support levels: https://aka.ms/CLI_refstatus
"   env-eqpz7npiyf7p6ul3cq8f.centraluseuap.workerapps.k4apps.io"

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
