---
title: Quickstart - Deploy a connected registry to a nested IoT Edge device
description: Use Azure Container Registry CLI commands and Azure portal to deploy a connected registry to a mested Azure IoT Edge device.
ms.topic: quickstart
ms.date: 04/28/2021
ms.author: memladen
author: toddysm
ms.custom:
---

# Quickstart: Deploy a connected registry to a nested IoT Edge device

In this quickstart, you use [Azure Container Registry][container-registry-intro] commands to deploy a connected registry to a nested Azure IoT Edge device. You can review the [ACR connected registry introduction](intro-connected-registry.md) for details about the connected registry feature of Azure Container Registry.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

## Before you begin

This tutorial requires a nested Azure IoT Edge device to be set up upfront. You can use the [Deploy your first IoT Edge module to a virtual Linux device](../iot-edge/quickstart-linux.md) quickstart guide to learn how to deploy a virtual IoT Edge device. You can also look at [Tutorial: Create a hierarchy of IoT Edge devices](../iot-edge/tutorial-nested-iot-edge.md) to learn how to configure hierarchical IoT edge devices. The connected registry is deployed as a module on the nested IoT Edge device.

This tutorial also requires that you have set up a connected registry on a top level IoT Edge device by following the [Quickstart: Deploy a connected registry to an IoT Edge device](quickstart-deploy-connected-registry-iot-edge-cli.md).

Also, make sure that you have created the connected registry resource in Azure as described in the [Create connected registry using the CLI][quickstart-connected-registry-cli] quickstart guide. Only `mirror` mode will work for this scenario.

## Create a client token for access to the parent registry

The IoT Edge runtime will need to authenticate with the top level registry to pull the connected registry image and deploy it. First, use the following command to create a scope map for the connected registry image repository:

```azurecli
az acr scope-map create \
  --description "Nested connected registry repo pull scope map." \
  --name nested-connected-registry-pull \
  --registry mycontainerregistry001 \
  --repository "acr/connected-registry" content/read
```

Next, use the following command to create a client token for the IoT Edge device and associate it to the scope map:

```azurecli
az acr token create \
  --name nestedcrimagepulltoken \
  --registry mycontainerregistry001 \
  --scope-map connected-registry-pull
```

This command will print a JSON that will include credential information similar to the following:

```json
  ...
  "credentials": {
    "activeDirectoryObject": null,
    "certificates": [],
    "passwords": [
      {
        "creationTime": "2020-12-10T00:06:15.356846+00:00",
        "expiry": null,
        "name": "password1",
        "value": "$$$0meCoMPL3xP4$$W0rd001!@#$$"
      },
      {
        "creationTime": "2020-12-10T00:06:15.356846+00:00",
        "expiry": null,
        "name": "password2",
        "value": "#$an0TH3rCoMPL3xP4ssW0rd002!#$"
      }
    ],
    "username": "nestedcrimagepulltoken"
  }
  ...
```

You will need the `username` and one of the `passwords` values for the IoT Edge manifest below.

  > [!IMPORTANT]
  > Make sure that you save the generated passwords. Those are one-time passwords and cannot be retrieved. You can generate new passwords using the [az acr token credential generate][az-acr-token-credential-generate] command.

More details about tokens and scope maps are available in [Create a token with repository-scoped permissions](container-registry-repository-scoped-permissions.md).

Last, add the client token to the top level connected registry using the following command:

```azurecli
az acr connected-registry update \
  --name myconnectedregistry \
  --registry mycontainerregistry001 \
  --add-client-tokens nestedcrimagepulltoken
```
  > [!IMPORTANT]
  > The client token must be added to the parent connected registry, `myconnectedregistry` in this case.

## Retrieve connected registry configuration information

Before deploying the connected registry to the nested IoT Edge device, you will need to retrieve the configuration from the connected registry resource in Azure. Use the [az acr connected-registry install][az-acr-connected-registry-install] command to retrieve the configuration.

```azurecli
az acr connected-registry install renew-credentials \
  --registry mycontainerregistry001 \
  --name myconnectedmirror \
```

This will return the connection string for the connected registry including the newly generated passwords.

```json
{
  "ACR_REGISTRY_CONNECTION_STRING": "ConnectedRegistryName=myconnectedmirror;SyncTokenName=myconnectedmirror-sync-token;SyncTokenPassword=s0meCoMPL3xP4$$W0rd001!@#;ParentGatewayEndpoint=mycontainerregistry001.westus2.data.azurecr.io;ParentEndpointProtocol=https",
  "ACR_REGISTRY_LOGIN_SERVER": "<Optional: connected registry login server. More info at https://aka.ms/acr/connected-registry>"
}
```

The JSON above lists the environment variables that need to be passed to the connected registry container at run time. The following environment variables are optional:

- `ACR_REGISTRY_LOGIN_SERVER` - this is the hostname or FQDN of the IoT Edge device that hosts the connected registry.

You will need the information for the IoT Edge manifest below.

  > [!IMPORTANT]
  > Make sure that you save the generated connection string. The connection string contains one-time password that cannot be retrieved. If you issue the command again, new passwords will be generated. You can generate new passwords using the [az acr token credential generate][az-acr-token-credential-generate] command.

## Configure a deployment manifest for the nested IoT Edge

A deployment manifest is a JSON document that describes which modules to deploy to the IoT Edge device. For more information about how deployment manifests work and how to create them, see [Understand how IoT Edge modules can be used, configured, and reused](../iot-edge/module-composition.md).

To deploy the connected registry module using the Azure CLI, save the following deployment manifest locally as a `.json` file. 

[!IMPORTANT] In the bellow deployment manifest, the IP address `10.16.7.4` is the IP address of the device hosting parent connected registry. Make sure you replace this IP address with the one your parent device uses.

```json
{
    "modulesContent": {
        "$edgeAgent": {
            "properties.desired": {
                "modules": {
                    "connected-registry": {
                        "settings": {
                            "image": "10.16.7.4/acr/connected-registry:0.2.0",
                            "createOptions": "{\"HostConfig\":{\"Binds\":[\"/home/azureuser/connected-registry:/var/acr/data\",,\"/usr/local/share/ca-certificates:/usr/local/share/ca-certificates\",\"/etc/ssl/certs:/etc/ssl/certs\"]}}"
                        },
                        "type": "docker",
                        "env": {
                            "ACR_REGISTRY_CONNECTION_STRING": {
                                "value": "ConnectedRegistryName=myconnectedmirror;SyncTokenName=myconnectedmirror-sync-token;SyncTokenPassword=s0meCoMPL3xP4$$W0rd001!@#;ParentGatewayEndpoint=10.16.7.4;ParentEndpointProtocol=https"
                            }
                        },
                        "status": "running",
                        "restartPolicy": "always",
                        "version": "1.0"
                    },
                    "IoTEdgeApiProxy": {
                        "settings": {
                            "image": "10.16.7.4/azureiotedge-api-proxy:latest",
                            "createOptions": "{\"HostConfig\": {\"PortBindings\": {\"443/tcp\": [{\"HostPort\": \"443\"}]}}}"
                        },
                        "type": "docker",
                        "version": "1.0",
                        "env": {
                            "NGINX_DEFAULT_PORT": {
                                "value": "443"
                            },
                            "CONNECTED_ACR_ROUTE_ADDRESS": {
                                "value": "connectedRegistry:8080"
                            },
                            "NGINX_CONFIG_ENV_VAR_LIST": {
                                    "value": "NGINX_DEFAULT_PORT,BLOB_UPLOAD_ROUTE_ADDRESS,CONNECTED_ACR_ROUTE_ADDRESS,IOTEDGE_PARENTHOSTNAME,DOCKER_REQUEST_ROUTE_ADDRESS"
                            },
                            "DOCKER_REQUEST_ROUTE_ADDRESS": {
                                "value": "registry:5000"
                            },
                            "BLOB_UPLOAD_ROUTE_ADDRESS": {
                                "value": "AzureBlobStorageonIoTEdge:11002"
                            }
                        },
                        "status": "running",
                        "restartPolicy": "always",
                        "startupOrder": 3
                    }
                },
                "runtime": {
                    "settings": {
                        "minDockerVersion": "v1.25",
                        "registryCredentials": {
                            "tsmregistry": {
                                "address": "10.16.7.4",
                                "password": "$$$0meCoMPL3xP4$$W0rd001!@#$$",
                                "username": "nestedcrimagepulltoken"
                            }
                        }
                    },
                    "type": "docker"
                },
                "schemaVersion": "1.1",
                "systemModules": {
                    "edgeAgent": {
                        "settings": {
                            "image": "10.16.7.4/azureiotedge-agent:1.0",
                            "createOptions": ""
                        },
                        "type": "docker",
                        "env": {
                            "SendRuntimeQualityTelemetry": {
                                "value": "false"
                            }
                        }
                    },
                    "edgeHub": {
                        "settings": {
                            "image": "10.16.7.4/azureiotedge-hub:1.0",
                            "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"443/tcp\":[{\"HostPort\":\"443\"}],\"5671/tcp\":[{\"HostPort\":\"5671\"}],\"8883/tcp\":[{\"HostPort\":\"8883\"}]}}}"
                        },
                        "type": "docker",
                        "status": "running",
                        "restartPolicy": "always"
                    }
                }
            }
        },
        "$edgeHub": {
            "properties.desired": {
                "routes": {
                    "route": "FROM /messages/* INTO $upstream"
                },
                "schemaVersion": "1.1",
                "storeAndForwardConfiguration": {
                    "timeToLiveSecs": 7200
                }
            }
        }
    }
}
```

Use the information from the previous sections to update the relevant JSON values.

You will use the file path in the next section when you run the command to apply the configuration to your device.

## Deploy the connected registry module on IoT Edge

Use the following command to deploy the connected registry module on the IoT Edge device:

```azurecli
az iot edge set-modules \
  --device-id [device id] \
  --hub-name [hub name] \
  --content [file path]
```

For more details you can refer to the [Deploy Azure IoT Edge modules with Azure CLI](../iot-edge/how-to-deploy-modules-cli.md) article.

To check the status of the connected registry, use the following CLI command:

```azurecli
az acr connected-registry show \
  --registry mycontainerregistry001 \
  --name myconnectedmirror \
  --output table
```

You may need to a wait few minutes until the deployment of the connected registry completes.

## Next steps

In this quickstart, you learned how to deploy a connected registry to an IoT Edge device. Continue to the next guide to learn how to pull images from the newly deployed connected registry.

> [!div class="nextstepaction"]
> [Quickstart: Pull images from a connected registry][quickstart-pull-images-from-connected-registry]

<!-- LINKS - internal -->
[az-acr-connected-registry-install]: /cli/azure/acr#az-acr-connected-registry-install
[az-acr-import]: /cli/azure/acr#az-acr-import
[az-acr-token-credential-generate]: /cli/azure/acr/credential#az-acr-token-credential-generate
[container-registry-intro]: container-registry-intro.md
[quickstart-pull-images-from-connected-registry]: quickstart-pull-images-from-connected-registry.md
[quickstart-connected-registry-cli]: quickstart-connected-registry-cli.md