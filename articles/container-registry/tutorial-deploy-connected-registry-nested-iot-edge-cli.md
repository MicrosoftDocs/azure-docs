---
title: 'Tutorial: Deploy a connected registry to an IoT Edge hierarchy'
description: In this tutorial, use Azure CLI commands to create a two-layer hierarchy of Azure IoT Edge devices and deploy a connected registry as a module at each layer.
ms.topic: tutorial
ms.date: 10/11/2022
ms.author: memladen
author: toddysm
ms.custom: [ignite-fall-2021, mode-other, devx-track-azurecli, kr2b-contr-experiment]
---

# Tutorial: Deploy a connected registry to a nested IoT Edge hierarchy

In this tutorial, you use Azure CLI commands to create a two-layer hierarchy of Azure IoT Edge devices and deploy a [connected registry](intro-connected-registry.md) as a module at each layer. In this scenario, a device in the [top layer](overview-connected-registry-and-iot-edge.md#top-layer) communicates with a cloud registry. A device in the [lower layer](overview-connected-registry-and-iot-edge.md#nested-layers) communicates with its connected registry parent in the top layer.

For an overview of using a connected registry with IoT Edge, see [Using connected registry with Azure IoT Edge](overview-connected-registry-and-iot-edge.md).

[!INCLUDE [Prepare Azure CLI environment](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

* Azure IoT Hub. For deployment steps, see [Create an IoT hub using the Azure portal](../iot-hub/iot-hub-create-through-portal.md).
* Two connected registry resources in Azure. For deployment steps, see quickstarts using the [Azure CLI][quickstart-connected-registry-cli] or [Azure portal][quickstart-connected-registry-portal].

  * For the top layer, the connected registry can be in either ReadWrite or ReadOnly mode. This article assumes ReadWrite mode, and the connected registry name is stored in the environment variable `$CONNECTED_REGISTRY_RW`.
  * For the lower layer, the connected registry must be in ReadOnly mode. This article assumes the connected registry name is stored in the environment variable `$CONNECTED_REGISTRY_RO`.

[!INCLUDE [container-registry-connected-import-images](../../includes/container-registry-connected-import-images.md)]

## Retrieve connected registry configuration

To deploy each connected registry to the IoT Edge device in the hierarchy, you need to retrieve configuration settings from the connected registry resource in Azure. If needed, run the [az acr connected-registry get-settings][az-acr-connected-registry-get-settings] command for each connected registry to retrieve the configuration. 

By default, the settings information doesn't include the [sync token](overview-connected-registry-access.md#sync-token) password, which is also needed to deploy the connected registry. Optionally, generate one of the passwords by passing the `--generate-password 1` or `--generate-password 2` parameter. Save the generated password to a safe location. It can't be retrieved again.

> [!WARNING]
> Regenerating a password rotates the sync token credentials. If you configured a device using the previous password, you need to update the configuration.

```azurecli
# Use the REGISTRY_NAME variable in the following Azure CLI commands to identify the registry
REGISTRY_NAME=<container-registry-name>

# Run the command for each registry resource in the hierarchy

az acr connected-registry get-settings \
  --registry $REGISTRY_NAME \
  --name $CONNECTED_REGISTRY_RW \
  --parent-protocol https

az acr connected-registry get-settings \
  --registry $REGISTRY_NAME \
  --name $CONNECTED_REGISTRY_RO \
  --parent-protocol https
```

[!INCLUDE [container-registry-connected-connection-configuration](../../includes/container-registry-connected-connection-configuration.md)]

## Configure deployment manifests

A deployment manifest is a JSON document that describes which modules to deploy to an IoT Edge device. For more information, see [Understand how IoT Edge modules can be used, configured, and reused](../iot-edge/module-composition.md).

To deploy the connected registry module on each IoT Edge device using the Azure CLI, save the following deployment manifests locally as JSON files. Use the information from the previous sections to update the relevant JSON values in each manifest. Use the file paths in the next section when you run the command to apply the configuration to your device.

### Deployment manifest for the top layer

For the device at the top layer, create a deployment manifest file `deploymentTopLayer.json` with the following content. This manifest is similar to the one used in [Quickstart: Deploy a connected registry to an IoT Edge device](quickstart-deploy-connected-registry-iot-edge-cli.md). 

> [!NOTE]
> If you already deployed a connected registry to a top layer IoT Edge device using the [quickstart](quickstart-deploy-connected-registry-iot-edge-cli.md), you can use it at the top layer of a nested hierarchy. Modify the deployment steps in this tutorial to configure it in the hierarchy (not shown).

[!INCLUDE [container-registry-connected-iot-edge-manifest](../../includes/container-registry-connected-iot-edge-manifest.md)]

### Deployment manifest for the lower layer

For the device at the lower layer, create a deployment manifest file *deploymentLowerLayer.json* with the following content.

Overall, the lower layer deployment file is similar to the top layer deployment file. The differences are: 

* It pulls the required images from the top layer connected registry instead of from the cloud registry.

  When you set up the top layer connected registry, make sure that it syncs all the required images locally, including `azureiotedge-agent`, `azureiotedge-hub`, `azureiotedge-api-proxy`, and `acr/connected-registry`. The lower layer IoT device needs to pull these images from the top layer connected registry.
* It uses the sync token configured at the lower layer to authenticate with the top layer connected registry.
* It configures the parent gateway endpoint with the top layer connected registry's IP address or FQDN instead of with the cloud registry's FQDN.

> [!IMPORTANT]
> In the following deployment manifest, `$upstream` is used as the IP address or FQDN of the device hosting the parent connected registry. However, `$upstream` is not supported in an environment variable. The connected registry needs to read the environment variable `ACR_PARENT_GATEWAY_ENDPOINT` to get the parent gateway endpoint. Instead of using `$upstream`, the connected registry supports dynamically resolving the IP address or FQDN from another environment variable.
>
> On the nested IoT Edge, there's an environment variable `$IOTEDGE_PARENTHOSTNAME` on the lower layer that is equal to the IP address or FQDN of the parent device. Manually replace the environment variable as the value of `ParentGatewayEndpoint` in the connection string to avoid hard-coding the parent IP address or FQDN. Because the parent device in this example is running `nginx` on port 8000, pass `$IOTEDGE_PARENTHOSTNAME:8000`. You also need to select the proper protocol in `ParentEndpointProtocol`.

```json
{
    "modulesContent": {
        "$edgeAgent": {
            "properties.desired": {
                "modules": {
                    "connected-registry": {
                        "settings": {
                            "image": "$upstream:8000/acr/connected-registry:0.8.0",
                            "createOptions": "{\"HostConfig\":{\"Binds\":[\"/home/azureuser/connected-registry:/var/acr/data\"]}}"
                        },
                        "type": "docker",
                        "env": {
                            "ACR_REGISTRY_CONNECTION_STRING": {
                                "value": "ConnectedRegistryName=<REPLACE_WITH_CONNECTED_REGISTRY_NAME>;SyncTokenName=<REPLACE_WITH_SYNC_TOKEN_NAME>;SyncTokenPassword=<REPLACE_WITH_SYNC_TOKEN_PASSWORD>;ParentGatewayEndpoint=$IOTEDGE_PARENTHOSTNAME:8000;ParentEndpointProtocol=https"
                            }
                        },
                        "status": "running",
                        "restartPolicy": "always",
                        "version": "1.0"
                    },
                    "IoTEdgeApiProxy": {
                        "settings": {
                            "image": "$upstream:8000/azureiotedge-api-proxy:1.1.2",
                            "createOptions": "{\"HostConfig\": {\"PortBindings\": {\"8000/tcp\": [{\"HostPort\": \"8000\"}]}}}"
                        },
                        "type": "docker",
                        "version": "1.0",
                        "env": {
                            "NGINX_DEFAULT_PORT": {
                                "value": "8000"
                            },
                            "CONNECTED_ACR_ROUTE_ADDRESS": {
                                "value": "connected-registry:8080"
                            },
                            "NGINX_CONFIG_ENV_VAR_LIST": {
                                    "value": "NGINX_DEFAULT_PORT,BLOB_UPLOAD_ROUTE_ADDRESS,CONNECTED_ACR_ROUTE_ADDRESS,IOTEDGE_PARENTHOSTNAME,DOCKER_REQUEST_ROUTE_ADDRESS"
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
                            "connectedregistry": {
                                "address": "$upstream:8000",
                                "password": "<REPLACE_WITH_SYNC_TOKEN_PASSWORD>",
                                "username": "<REPLACE_WITH_SYNC_TOKEN_NAME>"
                            }
                        }
                    },
                    "type": "docker"
                },
                "schemaVersion": "1.1",
                "systemModules": {
                    "edgeAgent": {
                        "settings": {
                            "image": "$upstream:8000/azureiotedge-agent:1.2.4",
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
                            "image": "$upstream:8000/azureiotedge-hub:1.2.4",
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

## Set up and deploy connected registry modules

The following steps are adapted from [Tutorial: Create a hierarchy of IoT Edge devices](../iot-edge/tutorial-nested-iot-edge.md) and are specific to deploying connected registry modules in the IoT Edge hierarchy. See that tutorial for details about individual steps.

### Create top layer and lower layer devices

Create top layer and lower layer virtual machines using an existing [ARM template](https://raw.githubusercontent.com/Azure/iotedge-vm-deploy/1.2.0/edgeDeploy.json). The template also installs the IoT Edge agent. If you want to deploy from your own devices instead, see [Tutorial: Install or uninstall Azure IoT Edge for Linux](../iot-edge/how-to-install-iot-edge.md) to learn how to manually set up the device.

> [!IMPORTANT]
> For later access to the modules deployed on the top layer device, make sure that you open the following ports inbound: 8000, 443, 5671, 8883. For configuration steps, see [How to open ports to a virtual machine with the Azure portal](../virtual-machines/windows/nsg-quickstart-portal.md).

### Create and configure the hierarchy

Use the `iotedge-config` tool to create and configure your hierarchy by following these steps in the Azure CLI or Azure Cloud Shell:

1. Download the configuration tool.

   ```bash
    mkdir nested_iot_edge_tutorial
    cd ~/nested_iot_edge_tutorial
    wget -O iotedge_config.tar "https://github.com/Azure-Samples/iotedge_config_cli/releases/download/latest/iotedge_config_cli.tar.gz"
    tar -xvf iotedge_config.tar
    ```

    This step creates the `iotedge_config_cli_release` folder in your tutorial directory. The template file used to create your device hierarchy is the `iotedge_config.yaml` file found in `~/nested_iot_edge_tutorial/iotedge_config_cli_release/templates/tutorial`. In the same directory, there are two deployment manifests for top and lower layers: `deploymentTopLayer.json` and `deploymentLowerLayer.json` files. 

1. Edit `iotedge_config.yaml` with your information. Edit the `iothub_hostname`, `iot_name`, deployment manifest filenames for the top layer and lower layer, and the client token credentials you created to pull images from upstream from each layer. The following example is a sample configuration file:

    ```yaml
    config_version: "1.0"

    iothub:
        iothub_hostname: <REPLACE_WITH_HUB_NAME>.azure-devices.net
        iothub_name: <REPLACE_WITH_HUB_NAME>
        ## Authentication method used by IoT Edge devices: symmetric_key or x509_certificate
        authentication_method: symmetric_key 

        ## Root certificate used to generate device CA certificates. Optional. If not provided a self-signed CA will be generated
        # certificates:
        #   root_ca_cert_path: ""
        #   root_ca_cert_key_path: ""

        ## IoT Edge configuration template to use
    configuration:
        template_config_path: "./templates/tutorial/device_config.toml"
        default_edge_agent: "$upstream:8000/azureiotedge-agent:1.2.4"

        ## Hierarchy of IoT Edge devices to create
    edgedevices:
        device_id: top-layer
        edge_agent: "<REPLACE_WITH_REGISTRY_NAME>.azurecr.io/azureiotedge-agent:1.2.4" ## Optional. If not provided, default_edge_agent will be used
        deployment: "./templates/tutorial/deploymentTopLayer.json" ## Optional. If provided, the given deployment file will be applied to the newly created device
            # hostname: "FQDN or IP" ## Optional. If provided, install.sh will not prompt user for this value nor the parent_hostname value
        container_auth: ## The token used to pull the image from cloud registry
            serveraddress: "<REPLACE_WITH_REGISTRY_NAME>.azurecr.io"
            username: "<REPLACE_WITH_SYNC_TOKEN_NAME_FOR_TOP_LAYER>"
            password: "<REPLACE_WITH_SYNC_TOKEN_PASSWORD_FOR_TOP_LAYER>"
        child:
            - device_id: lower-layer
              deployment: "./templates/tutorial/deploymentLowerLayer.json" ## Optional. If provided, the given deployment file will be applied to the newly created device
               # hostname: "FQDN or IP" ## Optional. If provided, install.sh will not prompt user for this value nor the parent_hostname value
              container_auth: ## The token used to pull the image from parent connected registry
                serveraddress: "$upstream:8000"
                username: "<REPLACE_WITH_SYNC_TOKEN_NAME_FOR_LOWER_LAYER>"
                password: "<REPLACE_WITH_SYNC_TOKEN_PASSWORD_FOR_LOWER_LAYER>"
    ```

1. Prepare the top layer and lower layer deployment files: *deploymentTopLayer.json* and *deploymentLowerLayer.json*. Copy the [deployment manifest files](#configure-deployment-manifests) you created earlier in this article to the following folder: `~/nestedIotEdgeTutorial/iotedge_config_cli_release/templates/tutorial`.

1. Navigate to your *iotedge_config_cli_release* directory and run the tool to create your hierarchy of IoT Edge devices.

    ```bash
    cd ~/nestedIotEdgeTutorial/iotedge_config_cli_release
    ./iotedge_config --config ~/nestedIotEdgeTutorial/iotedge_config_cli_release/templates/tutorial/iotedge_config.yaml --output ~/nestedIotEdgeTutorial/iotedge_config_cli_release/outputs -f
    ```

    With the `--output` parameter, the tool creates the device certificates, certificate bundles, and a log file in a directory of your choice. With the `-f` parameter, the tool automatically looks for existing IoT Edge devices in your IoT Hub and removes them, to avoid errors and keep your hub clean.

    The tool could run for several minutes.

1. Copy the generated *top-layer.zip* and *lower-layer.zip* files generated in the previous step to the corresponding top and lower layer virtual machines using `scp`:

    ```bash
    scp <PATH_TO_CONFIGURATION_BUNDLE>   <USER>@<VM_IP_OR_FQDN>:~
    ```

1. Connect to the top layer device to install the configuration bundle.

    1. Unzip the configuration bundle. You'll need to install zip first.

        ```bash
        sudo apt install zip
        unzip ~/<PATH_TO_CONFIGURATION_BUNDLE>/<CONFIGURATION_BUNDLE>.zip #unzip top-layer.zip
        ```

    1. Run `sudo ./install.sh`. Input the IP address or hostname. We recommend using the IP address.
    1. Run `sudo iotedge list` to confirm that all modules are running.

1. Connect to the lower layer device to install the configuration bundle.
    1. Unzip the configuration bundle. You'll need to install zip first.

        ```bash
        sudo apt install zip
        unzip ~/<PATH_TO_CONFIGURATION_BUNDLE>/<CONFIGURATION_BUNDLE>.zip #unzip lower-layer.zip
        ```

    1. Run `sudo ./install.sh`. Input the device and parent IP addresses or hostnames. We recommend using the IP addresses.
    1. Run `sudo iotedge list` to confirm that all modules are running.

If you didn't specify a deployment file for device configuration, or if deployment problems occur such as an invalid deployment manifest on the top or lower layer device, manually deploy the modules. See the following section.

## Manually deploy the connected registry module

Use the following command to deploy the connected registry module manually on an IoT Edge device:

```azurecli
az iot edge set-modules \
  --device-id <device-id> \
  --hub-name <hub-name> \
  --content <deployment-manifest-filename>
```

For details, see [Deploy Azure IoT Edge modules with Azure CLI](../iot-edge/how-to-deploy-modules-cli.md).

After successful deployment, the connected registry shows a status of `Online`.

To check the status of the connected registry, use the following [az acr connected-registry show][az-acr-connected-registry-show] command:

```azurecli
az acr connected-registry show \
  --registry $REGISTRY_NAME \
  --name $CONNECTED_REGISTRY_RO \
  --output table
```

You might need to a wait a few minutes until the deployment of the connected registry completes.

After successful deployment, the connected registry shows a status of `Online`.

To troubleshoot a deployment, run `iotedge check` on the affected device. For more information, see [Troubleshooting](../iot-edge/tutorial-nested-iot-edge.md#troubleshooting).

## Next steps

In this quickstart, you learned how to deploy a connected registry to a nested IoT Edge device. Continue to the next guide to learn how to pull images from the newly deployed connected registry.

> [!div class="nextstepaction"]
> [Pull images from a connected registry][pull-images-from-connected-registry]

<!-- LINKS - internal -->
[az-acr-connected-registry-get-settings]: /cli/azure/acr/connected-registry/install#az_acr_connected_registry_get_settings
[az-acr-connected-registry-show]: /cli/azure/acr/connected-registry#az_acr_connected_registry_show
[az-acr-import]: /cli/azure/acr#az-acr-import
[az-acr-token-credential-generate]: /cli/azure/acr/credential#az-acr-token-credential-generate
[container-registry-intro]: container-registry-intro.md
[pull-images-from-connected-registry]: pull-images-from-connected-registry.md
[quickstart-connected-registry-cli]: quickstart-connected-registry-cli.md
[quickstart-connected-registry-portal]: quickstart-connected-registry-portal.md
