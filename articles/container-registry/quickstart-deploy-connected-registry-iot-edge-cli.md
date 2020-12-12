---
title: Quickstart - Deploy a connected registry to an IoT Edge device
description: Use Azure Container Registry CLI commands and Azure portal to deploy a connected registry to an Azure IoT Edge device.
ms.topic: quickstart
ms.date: 12/04/2020
ms.author: memladen
author: toddysm
ms.custom:
---

# Quickstart: Deploy a connected registry to an IoT Edge device

In this quickstart, you use [Azure Container Registry][container-registry-intro] commands to deploy a connected registry to an Azure IoT Edge device. You can review the [ACR connected registry introduction](intro-connected-registry.md) for details about the connected registry feature of Azure Container Registry.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

## Before you begin

This tutorial requires an Azure IoT Edge device to be set up upfront. You can use the [Deploy your first IoT Edge module to a virtual Linux device](../iot-edge/quickstart-linux.md) quickstart guide to learn how to deploy a virtual IoT Edge device. The connected registry is deployed as a module on the IoT Edge device.

Also, make sure that you have created the connected registry resource in Azure as described in the [Create connected registry using the CLI][quickstart-connected-registry-cli] quickstart guide.

## Import the connected registry image to your registry

To support nested IoT Edge scenarios, the container image for the connected registry runtime must be available in your private Azure Container Registry. Use the [az acr import][az-acr-import] command to import the connected registry image into your private registry.

```azurecli-interactive
az acr import \
  --name mycontainerregistry001 \
  --source mcr.microsoft.com/acr/connected-registry:latest
```

## Create a client token for access to the cloud registry

The IoT Edge runtime will need to authenticate with the cloud registry to pull the connected registry image and deploy it. First, use the following command to create a scope map for the connected registry image repository:

```azurecli-interactive
az acr scope-map create \
  --description "Connected registry repo pull scope map." \
  --name conected-registry-pull \
  --registry mycontainerregistry001 \
  --repository acr/connected-registry content/read
```

Next, use the following command to create a client token for the IoT Edge device and associate it to the scope map:

```azurecli-interactive
az acr token create \
  --name crimagepulltoken \
  --registry mycontainerregistry001 \
  --scope-map conected-registry-pull
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
    "username": "crimagepulltoken"
  }
  ...
```

You will need the `username` and one of the `passwords` values for the IoT Edge manifest below.

  > [!IMPORTANT]
  > Make sure that you save the generated passwords. Those are one-time passwords and cannot be retrieved.

## Retrieve connected registry configuration information

Before deploying the connected registry to the IoT Edge device, you will need to retrieve the configuration from the connected registry resource in Azure. Use the [az acr connected-registry install][az-acr-connected-registry-install] command to retrieve the configuration.

```azurecli-interactive
az acr connected-registry install \
  --registry mycontainerregistry001 \
  --name myconnectedregistry \
  --fresh-install
```

This will return the configuration for the connected registry including the newly generated passwords.

```json
{
  "ACR_PARENT_GATEWAY_ENDPOINT": "mycontainerregistry001.westus2.data.azurecr.io",
  "ACR_PARENT_LOGIN_SERVER": "mycontainerregistry001.azurecr.io",
  "ACR_PARENT_PROTOCOL": "https",
  "ACR_REGISTRY_CERTIFICATE_VOLUME": "<myvolume>",
  "ACR_REGISTRY_DATA_VOLUME": "<myvolume>",
  "ACR_REGISTRY_LOGIN_SERVER": "<myloginservername>",
  "ACR_REGISTRY_NAME": "myconnectedregistry",
  "ACR_SYNC_TOKEN_NAME": "myconnectedregistry-sync-token",
  "ACR_SYNC_TOKEN_PASSWORD": {
    "password1": "s0meCoMPL3xP4$$W0rd001!@#",
    "password2": "an0TH3rCoMPL3xP4ssW0rd002!"
  },
  "ACR_SYNC_TOKEN_USERNAME": "myconnectedregistry-sync-token"
}
```

The JSON above lists the environment variables that need to be passed to the connected registry container at the run time. The following environment variables are optional:

- `ACR_REGISTRY_CERTIFICATE_VOLUME` - this is required if your connected registry will be accessible via HTTPS. The volume should point to the location where the HTTPS certificates are stored.
- `ACR_REGISTRY_DATA_VOLUME` - this can optionally be used to overwrite the default location `/var/acr/data` where the images will be stored byt the connected registry. This location must match the volume bind for the container.

You will need the information for the IoT Edge manifest below.

  > [!IMPORTANT]
  > Make sure that you save the generated passwords. Those are one-time passwords and cannot be retrieved. If you issue the command again, new passwords will be generated.

## Configure a deployment manifest for IoT Edge

A deployment manifest is a JSON document that describes which modules to deploy to the IoT Edge device. For more information about how deployment manifests work and how to create them, see [Understand how IoT Edge modules can be used, configured, and reused](../iot-edge/module-composition.md).

To deploy the connected registry module using the Azure CLI, save the following deployment manifest locally as a `.json` file. 

```json
{
    "modulesContent": {
        "$edgeAgent": {
            "properties.desired": {
                "modules": {
                    "connected-registry": {
                        "settings": {
                            "image": "mycontainerregistry001.azurecr.io/acr/connected-registry:latest",
                            "createOptions": "{\"HostConfig\":{\"Binds\":[\"/home/azureuser/connected-registry:/var/acr/data\"],\"PortBindings\":{\"8080/tcp\":[{\"HostPort\":\"8080\"}]}}}"
                        },
                        "type": "docker",
                        "env": {
                            "ACR_REGISTRY_NAME": {
                                "value": "myconnectedregistry"
                            },
                            "ACR_PARENT_GATEWAY_ENDPOINT": {
                                "value": "mycontainerregistry001.westus2.data.azurecr.io"
                            },
                            "ACR_SYNC_TOKEN_NAME": {
                                "value": "myconnectedregistry-sync-token"
                            },
                            "ACR_SYNC_TOKEN_PASSWORD": {
                                "value": "s0meCoMPL3xP4$$W0rd001!@#"
                            },
                            "ACR_REGISTRY_LOGIN_SERVER": {
                                "value": "<use_the_ip_address_of_the_iot_edge_device>"
                            },
                            "ACR_PARENT_PROTOCOL": {
                                "value": "https"
                            },
                            "ACR_PARENT_LOGIN_SERVER": {
                                "value": "mycontainerregistry001.azurecr.io"
                            }
                        },
                        "status": "running",
                        "restartPolicy": "always",
                        "version": "1.0"
                    }
                },
                "runtime": {
                    "settings": {
                        "minDockerVersion": "v1.25",
                        "registryCredentials": {
                            "tsmregistry": {
                                "address": "mycontainerregistry001.azurecr.io",
                                "password": "$$$0meCoMPL3xP4$$W0rd001!@#$$",
                                "username": "crimagepulltoken"
                            }
                        }
                    },
                    "type": "docker"
                },
                "schemaVersion": "1.1",
                "systemModules": {
                    "edgeAgent": {
                        "settings": {
                            "image": "mcr.microsoft.com/azureiotedge-agent:1.0",
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
                            "image": "mcr.microsoft.com/azureiotedge-hub:1.0",
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

```azurecli-interactive
az iot edge set-modules \
  --device-id [device id] \
  --hub-name [hub name] \
  --content [file path]
```

For more details you can refer to the [Deploy Azure IoT Edge modules with Azure CLI](../iot-edge/how-to-deploy-modules-cli.md) article.

## Next steps

In this quickstart, you learned how to deploy a connected registry to an IoT Edge device. Continue to the next guide to learn how to pull images from the newly deployed connected registry.

> [!div class="nextstepaction"]
> [Quickstart: Pull images from a connected registry][quickstart-pull-images-from-connected-registry]

<!-- LINKS - internal -->
[az-acr-connected-registry-install]: /cli/azure/acr#az-acr-connected-registry-install
[az-acr-import]: /cli/azure/acr#az-acr-import
[container-registry-intro]: container-registry-intro.md
[quickstart-pull-images-from-connected-registry]: quickstart-pull-images-from-connected-registry.md
[quickstart-connected-registry-cli]: quickstart-connected-registry-cli.md