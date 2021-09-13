---
title: Quickstart - Deploy a connected registry to a nested IoT Edge device
description: Use Azure Container Registry CLI commands and Azure portal to deploy a connected registry to a nested Azure IoT Edge device.
ms.topic: quickstart
ms.date: 09/01/2021
ms.author: memladen
author: toddysm
ms.custom:
---

# Quickstart: Deploy a connected registry to a nested IoT Edge device

In this quickstart, you use Azure CLI commands to create a two-layer hierarchy of Azure IoT Edge device and deploy a [connected registry](intro-connected-registry.md) as a module at each layer.

For an overview of using a connected registry with IoT Edge, see [Using connected registry with Azure IoT Edge](overview-connected-registry-and-iot-edge.md). This scenario corresponds to an IoT Edge hierarchy consisting of two layers: a device in the [top layer](overview-connected-registry-and-iot-edge.md#top-layer) that communicates with a cloud registry, and a device in the [lower layer](overview-connected-registry-and-iot-edge.md#top-layer) that communicates with a connected registry parent in the top layer. 

[!INCLUDE [Prepare Azure CLI environment](../../includes/azure-cli-prepare-your-environment.md)]
* Two connected registry resources in Azure. For deployment steps, see [Quickstart: Create a connected registry using the Azure CLI][quickstart-connected-registry-cli]. 

    * For the top layer, the connected registry may be in either `registry` or `mirror` mode
    * For the lower layer, the connected registry must be in `mirror` mode.

## Create client tokens for access to the parent registries

The IoT Edge runtime on each device will need to authenticate with its parent registry to pull the images and deploy them. rview-connected-registry-access.md) is used for authentication.

In this section, create a [client token](overview-connected-regstry-access.md#client-tokens) for each device. You will configure the token credentials in the deployment manifest for the device, shown later in this article.

[!INCLUDE [container-registry-connected-client-token](../../includes/container-registry-connected-client-token.md)]

## Retrieve connected registry configuration information

Before deploying each connected registry to the IoT Edge device in the hierarchy, you need to retrieve the configuration from the connected registry resource in Azure. Run the [az acr connected-registry install renew-credentials][az-acr-connected-registry-install-renew-credentials] command for each connected registry to retrieve the configuration.

```azurecli
# Use the REGISTRY_NAME variable in the following Azure CLI commands to identify the registry
REGISTRY_NAME=<container-registry-name>

# Run the command for both connected registry resources in the hierarchy

az acr connected-registry install renew-credentials \
  --registry $REGISTRY_NAME \
  --name myconnectedregistry 
  --parent-protocol https

az acr connected-registry install renew-credentials \
  --registry $REGISTRY_NAME \
  --name myconnectedmirror 
  --parent-protocol https
```

This command returns the connection string for the connected registry, including a newly generated password for the [sync token](overview-connected-registry-access.md#sync-token). The following example shows the connection string for the *myconnectedregistry* connected registry with parent registry *contosoregistry*:

```json
{
  "ACR_REGISTRY_CONNECTION_STRING": "ConnectedRegistryName=myconnectedregistry;SyncTokenName=myconnectedregistry-sync-token;SyncTokenPassword=xxxxxxxxxxxxxxxx;ParentGatewayEndpoint=contosoregistry.eastus.data.azurecr.io;ParentEndpointProtocol=https",
  "ACR_REGISTRY_LOGIN_SERVER": "<Optional: connected registry login server>."
}
```

The preceding JSON lists the environment variables that need to be passed to the connected registry container at runtime. You will need the information for the IoT Edge manifests described in the next section.

> [!NOTE]
> For a connected registry at a lower layer in the hierarchy, `ACR_REGISTRY_LOGIN_SERVER` is the hostname or FQDN of the IoT Edge device that hosts the parent connected registry.

The following additional environment variables are optional in the top layer only:

- `ACR_REGISTRY_CERTIFICATE_VOLUME` - Use if your connected registry will be accessible via HTTPS. The volume should point to the location where the HTTPS certificates are stored. If not set, the default location is `/var/acr/certs`.
- `ACR_REGISTRY_DATA_VOLUME` - Optionally use to overwrite the default location `/var/acr/data` where the images will be stored by the connected registry. This location must match the volume bind for the container.

> [!IMPORTANT]
> Make sure that you save each generated connection string. The connection string contains a one-time password that cannot be retrieved. If you issue the command again, a new password will be generated.

## Configure deployment manifests for the nested IoT Edge devices

A deployment manifest is a JSON document that describes which modules to deploy to an IoT Edge device. For more information about how deployment manifests work and how to create them, see [Understand how IoT Edge modules can be used, configured, and reused](../iot-edge/module-composition.md).

To deploy the connected registry module on each IoT Edge device using the Azure CLI, save the following deployment manifests locally as JSON files. Use the information from the previous sections to update the relevant JSON values in each manifest. You will use the file paths in the next section when you run the command to apply the configuration to your device.

### Deployment manifest for the top layer

For this scenario create a deployment manifest file `deploymentTopLayer.json` with the following content.

[!INCLUDE [container-registry-connected-iot-edge-manifest](../../includes/container-registry-connected-iot-edge-manifest.md)]

### Deployment manifest for the lower layer

For this scenario create a deployment manifest file `deploymentLowerLayer.json` with the following content.

Overall, the lower layer deployment file is similar to the top level deployment file. The differences are: 

- It pulls all the images required from top layer connected registry instead of from the cloud registry. 
    
    When you set up the top layer connected registry, make sure it will sync up all the reqiured images locally (`azureiotedge-agent`, `azureiotedge-hub`, `connected-registry`). The lower layer IoT device needs to pull these images from the top level connected registry.
- It configures the parent gateway endpoint with the top layer connected registry IP address or FQDN instead of with the cloud registry. 

> [!IMPORTANT]
> In the following deployment manifest, `$upstream` is used as the IP address or FQDN of the device hosting the parent connected registry. However, `$upstream` is not supported in an environment variable. The connected registry needs to read the environment variable `ACR_PARENT_GATEWAY_ENDPOINT` to get the parent gateway endpoint. Instead of using `$upstream`, the connected registry supports dynamically resolving the IP or FQDN from another environment variable. On the nested IoT Edge, there's an environment variable `$IOTEDGE_PARENTHOSTNAME` on the lower layer that is equal to the IP address or FQDN of the parent device. Manually replace the environment variable as the value of `ParentGatewayEndpoint` in the connection string to avoid hard-coding the parent IP address or FQDN. You also need to select the proper protocol in `ParentEndpointProtocol`.

```json
{
    "modulesContent": {
        "$edgeAgent": {
            "properties.desired": {
                "modules": {
                    "connected-registry": {
                        "settings": {
                            "image": "$upstream:8000/acr/connected-registry:0.3.0",
                            "createOptions": "{\"HostConfig\":{\"Binds\":[\"/home/azureuser/connected-registry:/var/acr/data\",\"/usr/local/share/ca-certificates:/usr/local/share/ca-certificates\",\"/etc/ssl/certs:/etc/ssl/certs\",\"LogConfig\":{ \"Type\": \"json-file\", \"Config\": {\"max-size\": \"10m\",\"max-file\": \"3\"}}]}}"
                        },
                        "type": "docker",
                        "env": {
                            "ACR_REGISTRY_CONNECTION_STRING": {
                                "value": "ConnectedRegistryName=<REPLACE_WITH_YOUR_CONNECTED_REGISTRY_NAME>;SyncTokenName=<REPLACE_WITH_YOUR_SYNC_TOKEN_NAME>;SyncTokenPassword=<REPLACE_WITH_YOUR_SYNC_TOKEN_PASSWORD>;ParentGatewayEndpoint=$IOTEDGE_PARENTHOSTNAME;ParentEndpointProtocol=https"
                            }
                        },
                        "status": "running",
                        "restartPolicy": "always",
                        "version": "1.0"
                    },
                    "IoTEdgeApiProxy": {
                        "settings": {
                            "image": "$upstream:8000/azureiotedge-api-proxy:9.9.9-dev",
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
                                "address": "$upstream:8000",
                                "password": "<REPLACE_WITH_YOUR_CLIENT_TOKEN_PASSWORD>",
                                "username": "<REPLACE_WITH_YOUR_CLIENT_TOKEN_NAME>"
                            }
                        }
                    },
                    "type": "docker"
                },
                "schemaVersion": "1.1",
                "systemModules": {
                    "edgeAgent": {
                        "settings": {
                            "image": "$upstream:8000/azureiotedge-agent:20210609.5",
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
                            "image": "$upstream:8000/azureiotedge-hub:20210609.5",
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

## Set up and deploy connected registry modules on nested IoT Edge devices

The following steps are adapted from [Tutorial: Create a hierarchy of IoT Edge devices](../iot-edge/tutorial-nested-iot-edge.md) and are specific to deploying connected registry modules in the IoT Edge hierarchy. See that tutorial for details about individual steps.

### Create top layer and lower layer devices

Create top layer and lower layer VMs using an existing [ARM template](https://raw.githubusercontent.com/Azure/iotedge-vm-deploy/1.2.0/edgeDeploy.json). The template also installs the IoT Edge agent. If you want to deploy from your own devices instead, see [Tutorial: Install or uninstall Azure IoT Edge for Linux](../iot-edge/how-to-install-iot-edge.md) to learn how to manually set up the device.

Open the following ports inbound on the top layer device: 8000, 443, 5671, 8883. For configuration steps, see [How to open ports to a virtual machine with the Azure portal](../virtual-machines/windows/nsg-quickstart-portal.md).

### Create and configure the hierarchy

Use the `iotedge-config` tool to create and configure your hierarchy by following these in the Azure CLI or Azure Cloud Shell:

1. Download the configuration tool.
    ```bash
    mkdir nestedIotEdgeTutorial
    cd ~/nestedIotEdgeTutorial
    wget -O iotedge_config.tar "https://github.com/Azure-Samples/iotedge_config_cli/releases/download/latest/iotedge_config_cli.tar.gz"
    tar -xvf iotedge_config.tar
    ```

    This step creates the `iotedge_config_cli_release` folder in your tutorial directory. The template file used to create your device hierarchy is the `iotedge_config.yaml` file found in `~/nestedIotEdgeTutorial/iotedge_config_cli_release/templates/tutorial`. In the same directory, there're two deployment manifests for top and lower layers: `deploymentTopLayer.json` and `deploymentLowerLayer.json` files. 

1. Edit `iotedge_config.yaml` with your information. This includes the `iothub_hostname`, `iot_name`, deployment manifest filenames for the top layer and lower layer, and the client token credentials you created to pull images from upstream from each layer. The following is a sample configuration

    ```yaml
    config_version: "1.0"

    iothub:
        iothub_hostname: <REPLACE_WITH_YOUR_HUB_NAME>.azure-devices.net
        iothub_name: <REPLACE_WITH_YOUR_HUB_NAME>
        ## Authentication method used by IoT Edge devices: symmetric_key or x509_certificate
        authentication_method: symmetric_key 

        ## Root certificate used to generate device CA certificates. Optional. If not provided a self-signed CA will be generated
        # certificates:
        #   root_ca_cert_path: ""
        #   root_ca_cert_key_path: ""

        ## IoT Edge configuration template to use
    configuration:
        template_config_path: "./templates/tutorial/device_config.toml"
        default_edge_agent: "$upstream:8000/azureiotedge-agent:20210609.5"

        ## Hierarchy of IoT Edge devices to create
    edgedevices:
        device_id: top-layer
        edge_agent: "<REPLACE_WITH_YOUR_REGISTRY_NAME>.azurecr.io/azureiotedge-agent:20210609.5" ## Optional. If not provided, default_edge_agent will be used
        deployment: "./templates/tutorial/deploymentTopLayer.json" ## Optional. If provided, the given deployment file will be applied to the newly created device
            # hostname: "FQDN or IP" ## Optional. If provided, install.sh will not prompt user for this value nor the parent_hostname value
        container_auth: ## The token used to pull the image from cloud registry
            serveraddress: "<REPLACE_WITH_YOUR_REGISTRY_NAME>.azurecr.io"
            username: "<REPLACE_WITH_YOUR_PULL_TOKEN_NAME_FOR_TOP_LAYER>"
            password: "<REPLACE_WITH_YOUR_PULL_TOKEN_PASSWORD_FOR_TOP_LAYER>"
        child:
            - device_id: lower-layer
              deployment: "./templates/tutorial/deploymentLowerLayer.json" ## Optional. If provided, the given deployment file will be applied to the newly created device
               # hostname: "FQDN or IP" ## Optional. If provided, install.sh will not prompt user for this value nor the parent_hostname value
              container_auth: ## The token used to pull the image from parent connected registry
                serveraddress: "$upstream:8000"
                username: "<REPLACE_WITH_YOUR_PULL_TOKEN_NAME_FOR_LOWER_LAYER>"
                password: "<REPLACE_WITH_YOUR_PULL_TOKEN_PASSWORD_FOR_LOWER_LAYER>"
    ```


1. Prepare the top layer and lower layer deployment files (deploymentTopLayer.json and deploymentLowerLayer.json). Copy the [deployment manifest files](#configure-deployment-manifests-for-the-nested-iot-edge-devices) you created earlier in this article.

1. Navigate to your `iotedge_config_cli_release` directory and run the tool to create your hierarchy of IoT Edge devices.

    ```bash
    cd ~/nestedIotEdgeTutorial/iotedge_config_cli_release
    ./iotedge_config --config ~/nestedIotEdgeTutorial/iotedge_config_cli_release/templates/tutorial/iotedge_config.yaml --output ~/nestedIotEdgeTutorial/iotedge_config_cli_release/outputs -f
    ```

    With the `--output` flag, the tool creates the device certificates, certificate bundles, and a log file in a directory of your choice. With the `-f` flag set, the tool will automatically look for existing IoT Edge devices in your IoT Hub and remove them, to avoid errors and keep your hub clean.

    The tool could run for several minutes.

1. Copy the generated `top-layer.zip` and `lower-layer.zip` files generated in the previous step to the corresponding top and lower layer VMs using `scp`。

    ```bash
    scp <PATH_TO_CONFIGURATION_BUNDLE>   <USER>@<VM_IP_OR_FQDN>:~
    ```

1. Connect to the top layer device to install the configuration bundle.
    1. Unzip the configuration bundle. You'll need to install zip first.

        ```bash
        sudo apt install zip
        unzip ~/<PATH_TO_CONFIGURATION_BUNDLE>/<CONFIGURATION_BUNDLE>.zip (unzip top-layer.zip)
        ```
    1. Run `sudo ./install.sh`, input the hostname.
    1. Run `sudo iotedge list` to confirm that all modules are running.

1. Connect to the lower layer device to install the configuration bundle.
    1. Unzip the configuration bundle. You'll need to install zip first.

        ```bash
        sudo apt install zip
        unzip ~/<PATH_TO_CONFIGURATION_BUNDLE>/<CONFIGURATION_BUNDLE>.zip (unzip lower-layer.zip)
        ```
    1. Run `sudo ./install.sh`, input the hostname and parent hostname.
    1. Run `sudo iotedge list` to confirm that all modules are running.
 
    
If you did not specify a deployment file for device configuration, or if deployment problems occur such as an invalid deployment manifest on the top or lower layer device, manually deploy the modules. See the following section.

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

For details, see [Deploy Azure IoT Edge modules with Azure CLI](../iot-edge/how-to-deploy-modules-cli.md).

To check the status of the connected registry, use the following [az acr connected-registry show][az-acr-connected-registry-show] command:

```azurecli
az acr connected-registry show \
  --registry $REGISTRY_NAME \
  --name myconnectedmirror \
  --output table
```

You may need to a wait a few minutes until the deployment of the connected registry completes.

After successful deployment, the connected registry shows a status of `Online`.

## Next steps

In this quickstart, you learned how to deploy a connected registry to a nested IoT Edge device. Continue to the next guide to learn how to pull images from the newly deployed connected registry.

> [Quickstart: Pull images from a connected registry][quickstart-pull-images-from-connected-registry]

<!-- LINKS - internal -->
[az-acr-connected-registry-install-renew-credentials]: /cli/azure/acr/connected-registry/install#az_acr_connected_registry_install_renew_credentials
[az-acr-connected-registry-show]: /cli/azure/acr/connected-registr#az_acr_connected_registry_show
[az-acr-import]: /cli/azure/acr#az-acr-import
[az-acr-token-credential-generate]: /cli/azure/acr/credential#az-acr-token-credential-generate
[container-registry-intro]: container-registry-intro.md
[quickstart-pull-images-from-connected-registry]: quickstart-pull-images-from-connected-registry.md
[quickstart-connected-registry-cli]: quickstart-connected-registry-cli.md