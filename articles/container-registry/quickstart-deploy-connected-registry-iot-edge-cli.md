---
title: Quickstart - Deploy a connected registry to an IoT Edge device
description: Use Azure Container Registry CLI commands and Azure portal to deploy a connected registry to an Azure IoT Edge device.
ms.topic: quickstart
ms.date: 08/26/2021
ms.author: memladen
author: toddysm
ms.custom:
---

# Quickstart: Deploy a connected registry to an IoT Edge device

In this quickstart, you use the Azure CLI to deploy a [connected registry](intro-connected-registry.md) as a module on an Azure IoT Edge device. 

For an overview of using a connected registry with IoT Edge, see [Using connected registry with Azure IoT Edge](overview-connected-registry-and-iot-edige.md).

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]
* Azure IoT Edge device. For deployment steps, see [Quickstart: Deploy your first IoT Edge module to a virtual Linux device](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/iot-edge/quickstart-linux.md) quickstart guide to learn how to deploy a virtual IoT Edge device. 
* Connected registry resource in Azure. For deployment steps, see [Create connected registry using the CLI][quickstart-connected-registry-cli]. A connected registry in either `registry` or `mirror` mode can be used in this scenario.

## Import the connected registry image to your registry

To support nested IoT Edge scenarios, the container image for the connected registry runtime must be available in your private Azure Container Registry. Use the [az acr import][az-acr-import] command to import the connected registry image into your private registry. 

```azurecli
# Use the following variable in Azure CLI commands
REGISTRY_NAME=<container-registry-name>

az acr import \
  --name $REGISTRY_NAME \
  --source mcr.microsoft.com/acr/connected-registry:0.3.0
```

To learn more about nested IoT Edge scenarios, please visit [Tutorial: Create a hierarchy of IoT Edge devices](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/iot-edge/tutorial-nested-iot-edge.md).

## Import the IotEdge and API Proxy images into your registry

To support the connected registry on nested IoT Edge, you need to import and set up the IoT and API proxy using the private images from the `acronpremiot` registry.  

> [!NOTE]
> You can import these images from Microsoft Container Registry if you don't need to create a nested connected registry. 

```azurecli
az acr import \
  --name $REGISTRY_NAME \
  --source acronpremiot.azurecr.io/acr/microsoft/azureiotedge-agent:20210609.5 -t azureiotedge-agent:20210609.5

az acr import \
  --name $REGISTRY_NAME \
  --source acronpremiot.azurecr.io/acr/microsoft/azureiotedge-hub:20210609.5 -t azureiotedge-hub:20210609.5

az acr import \
  --name $REGISTRY_NAME \
  --source acronpremiot.azurecr.io/acr/microsoft/azureiotedge-api-proxy:9.9.9-dev -t azureiotedge-api-proxy:9.9.9-dev
```
## Create a client token for access to the cloud registry

The IoT Edge runtime will need to authenticate with the cloud registry to pull the images and deploy them. First, use the following command to create a scope map for the required repositories:

```azurecli
az acr scope-map create \
  --description "Connected registry repo pull scope map" \
  --name connected-registry-pull \
  --registry $REGISTRY_NAME \
  --repository "acr/connected-registry" content/read \
  --repository "azureiotedge-api-proxy" content/read \
  --repository "azureiotedge-agent" content/read \
  --repository "azureiotedge-hub" content/read
```

Next, use the following command to create a client token for the IoT Edge device and associate it to the scope map:

```azurecli
az acr token create \
  --name crimagepulltoken \
  --registry $REGISTRY_NAME \
  --scope-map connected-registry-pull
```

Output includes credential information similar to the following:

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
        "value": "xxxxxxxxxxxxxxxxxxxxx"
      },
      {
        "creationTime": "2020-12-10T00:06:15.356846+00:00",
        "expiry": null,
        "name": "password2",
        "value": "xxxxxxxxxxxxxxxxxxxxx
      }
    ],
    "username": "crimagepulltoken"
  }
  ...
```

You will need the `username` and one of the `passwords` values for the IoT Edge manifest below.

  > [!IMPORTANT]
  > Make sure that you save the generated passwords. Those are one-time passwords and cannot be retrieved. You can generate new passwords using the [az acr token credential generate][az-acr-token-credential-generate] command.

More details about tokens and scope maps are available in [Create a token with repository-scoped permissions](container-registry-repository-scoped-permissions.md).

## Retrieve connected registry configuration information

Before deploying the connected registry to the IoT Edge device, you will need to retrieve the configuration from the connected registry resource in Azure. Use the [az acr connected-registry install][az-acr-connected-registry-install] command to retrieve the configuration. The following example specifies HTTPS as the parent protocol. This protocol is required when the parent registry is a cloud registry.

```azurecli
az acr connected-registry install renew-credentials \
  --registry $REGISTRY_NAME \
  --name myconnectedregistry \
  --parent-protocol https
```

This will return the connection string for the connected registry including the newly generated passwords.

```json
{
  "ACR_REGISTRY_CONNECTION_STRING": "ConnectedRegistryName=myconnectedregistry;SyncTokenName=myconnectedregistry-sync-token;SyncTokenPassword=xxxxxxxxxxxxxxxx;ParentGatewayEndpoint=$REGISTRY_NAME.westus2.data.azurecr.io;ParentEndpointProtocol=https",
  "ACR_REGISTRY_LOGIN_SERVER": "<Optional: connected registry login server. More info at https://aka.ms/acr/connected-registry>"
}
```

The preceding JSON lists the environment variables that need to be passed to the connected registry container at run time. The following environment variables are optional:

- `ACR_REGISTRY_CERTIFICATE_VOLUME` - Use if your connected registry will be accessible via HTTPS. The volume should point to the location where the HTTPS certificates are stored. If not set, the default location is `/var/acr/certs`.
- `ACR_REGISTRY_DATA_VOLUME` - Optionally use to overwrite the default location `/var/acr/data` where the images will be stored by the connected registry. This location must match the volume bind for the container.

You will need the information for the following IoT Edge manifest.

  > [!IMPORTANT]
  > Make sure that you save the generated passwords. Those are one-time passwords and cannot be retrieved. If you run the command again, new passwords will be generated. You can generate new passwords using the [az acr token credential generate][az-acr-token-credential-generate] command.

## Configure a deployment manifest for IoT Edge

A deployment manifest is a JSON document that describes which modules to deploy to the IoT Edge device. For more information about how deployment manifests work and how to create them, see [Understand how IoT Edge modules can be used, configured, and reused](../iot-edge/module-composition.md).

To deploy the connected registry and api proxy modules using the Azure CLI, save the following deployment manifest locally as a `.json` file. 

```json
{
    "modulesContent": {
        "$edgeAgent": {
            "properties.desired": {
                "modules": {
                    "connected-registry": {
                        "settings": {
                            "image": "$REGISTRY_NAME.azurecr.io/acr/connected-registry:0.3.0",
                            "createOptions": "{\"HostConfig\":{\"Binds\":[\"/home/azureuser/connected-registry:/var/acr/data\"],\"PortBindings\":{\"8080/tcp\":[{\"HostPort\":\"8080\"}]}}}"
                        },
                        "type": "docker",
                        "env": {
                            "ACR_REGISTRY_CONNECTION_STRING": {
                                "value": "ConnectedRegistryName=myconnectedregistry;SyncTokenName=myconnectedregistry-sync-token;SyncTokenPassword=s0meCoMPL3xP4$$W0rd001!@#;ParentGatewayEndpoint=$REGISTRY_NAME.westus2.data.azurecr.io;ParentEndpointProtocol=http"
                            }
                        },
                        "status": "running",
                        "restartPolicy": "always",
                        "version": "1.0"
                    },
                    "IoTEdgeAPIProxy": {
                        "settings": {
                            "image": "$REGISTRY_NAME.azurecr.io/azureiotedge-api-proxy:9.9.9-dev",
                            "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"8000/tcp\":[{\"HostPort\":\"8000\"}]}}}"
                        },
                        "type": "docker",
                        "env": {
                            "NGINX_DEFAULT_PORT": {
                                "value": "8000"
                            },
                            "CONNECTED_ACR_ROUTE_ADDRESS": {
                                "value": "connected-registry:8080"
                            },
                            "BLOB_UPLOAD_ROUTE_ADDRESS": {
                                "value": "AzureBlobStorageonIoTEdge:11002"
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
                                "address": "$REGISTRY_NAME.azurecr.io",
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
                            "image": "$REGISTRY_NAME.azurecr.io/azureiotedge-agent:20210609.5",
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
                            "image": "$REGISTRY_NAME.azurecr.io/azureiotedge-hub:20210609.5",
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

  > [!IMPORTANT]
  > If the connected registry listens on a port different from 80 and 443, the `ACR_REGISTRY_LOGIN_SERVER` value must include the port, eg. `192.168.0.100:8080`.

[TODO: FIND OUT IF ACR_REGISTRY_LOGIN_SERVER should be in manifest?]

Use the information from the previous sections to update the relevant JSON values.

You will use the file path in the next section when you run the command to apply the configuration to your device.

## Deploy the connected registry and api proxy modules on IoT Edge

Use the following command to deploy the connected registry and api proxy modules on the IoT Edge device:

```azurecli
az iot edge set-modules \
  --device-id [device id] \
  --hub-name [hub name] \
  --content [file path]
```

For details, see [Deploy Azure IoT Edge modules with Azure CLI](../iot-edge/how-to-deploy-modules-cli.md).

To check the status of the connected registry, use the following CLI command:

```azurecli
az acr connected-registry show \
  --registry $REGISTRY_NAME \
  --name myconnectedregistry \
  --output table
```

You may need to a wait few minutes until the deployment of the connected registry and api proxy complete.

[TODO: WHAT IS EXPECTED STATUS?]

Make sure you open the the ports `8000`, `5671`, `8883`. The API proxy will listen on port 8000 configued as `NGINX_DEFAULT_PORT`.

You can find more information about API Proxy in the [https://github.com/Azure/iotedge/tree/master/edge-modules/api-proxy-module]

## Next steps

In this quickstart, you learned how to deploy a connected registry to an IoT Edge device. Continue to the next guide to learn how to pull images from the newly deployed connected registry.

> [Quickstart: Pull images from a connected registry][quickstart-pull-images-from-connected-registry]

> [Quickstart: Deploy connected registry on nested IoT Edge device][quickstart-connected-registry-nested]

<!-- LINKS - internal -->
[az-acr-connected-registry-install]: /cli/azure/acr/connected-registry/#az_acr_connected_regitryinstall
[az-acr-import]:/cli/azure/acr#az_acr_import
[az-acr-token-credential-generate]: /cli/azure/acr/token/credential?#az_acr_token_credential_generate
[container-registry-intro]: container-registry-intro.md
[quickstart-pull-images-from-connected-registry]: quickstart-pull-images-from-connected-registry.md
[quickstart-connected-registry-cli]: quickstart-connected-registry-cli.md
[quickstart-connected-registry-nested]: quickstart-deploy-connected-registry-nested-iot-edge-cli.md