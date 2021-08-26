---
title: Quickstart - Deploy a connected registry to a nested IoT Edge device
description: Use Azure Container Registry CLI commands and Azure portal to deploy a connected registry to a nested Azure IoT Edge device.
ms.topic: quickstart
ms.date: 08/25/2021
ms.author: memladen
author: toddysm
ms.custom:
---

# Quickstart: Deploy a connected registry to a nested IoT Edge device

In this quickstart, you use Azure CLI commands to deploy a [connected registry](intro-connected-registry.md) to a nested Azure IoT Edge device.
 
For an overview of using a connected registry with IoT Edge, see [Using connected registry with Azure IoT Edge](overview-connected-registry-and-iot-edige.md).

[!INCLUDE [quickstarts](https://docs.microsoft.com/en-us/azure/iot-edge/quickstart-linux?view=iotedge-2018-06)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

## Before you begin

This tutorial also requires that you have the knowledge about set up a connected registry on a IoT Edge device by following the [Quickstart: Deploy a connected registry to an IoT Edge device](quickstart-deploy-connected-registry-iot-edge-cli.md). 

Also, make sure that you have created the connected registry resource in Azure as described in the [Create connected registry using the CLI][quickstart-connected-registry-cli] quickstart guide. Only `mirror` mode will work for this scenario.

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
  "ACR_REGISTRY_CONNECTION_STRING": "ConnectedRegistryName=myconnectedmirror;SyncTokenName=myconnectedmirror-sync-token;SyncTokenPassword=s0meCoMPL3xP4$$W0rd001!@#;ParentGatewayEndpoint=<parent gateway endpoint>;ParentEndpointProtocol=<http or https>",
  "ACR_REGISTRY_LOGIN_SERVER": "<Optional: connected registry login server. More info at https://aka.ms/acr/connected-registry>"
}
```

The JSON above lists the environment variables that need to be passed to the connected registry container at run time. The following environment variables are optional:

- `ACR_REGISTRY_LOGIN_SERVER` - this is the hostname or FQDN of the IoT Edge device that hosts the connected registry.

You will need the information for the IoT Edge manifest below.

  > [!IMPORTANT]
  > Make sure that you save the generated connection string. The connection string contains one-time password that cannot be retrieved. If you issue the command again, new passwords will be generated. You can generate new passwords using the [az acr token credential generate][az-acr-token-credential-generate] command.

## Configure a deployment manifest for the nested IoT Edge

A deployment manifest is a JSON document that describes which modules to deploy to the IoT Edge device. For more information about how deployment manifests work and how to create them, see [Understand how IoT Edge modules can be used, configured, and reused](https://docs.microsoft.com/en-us/azure/iot-edge/module-composition?view=iotedge-2020-11#:~:text=The%20IoT%20Edge%20agent%20module,should%20be%20created%20and%20managed.).

To deploy the connected registry module using the Azure CLI, save the following deployment manifest locally as a `.json` file. 

[!IMPORTANT] In the following deployment manifest, $upstream will be used as the IP or FQDN of the device hosting parent connected registry. However $upstream is not supported in env variable. The connected registry need read env variable ACR_PARENT_GATEWAY_ENDPOINT to get the parent gateway endpoint. Instead of using $upstream, connected registry supports dynamically resolving the IP or FQDN from another env variable. On the nested IoT, there's env variable $IOTEDGE_PARENTHOSTNAME on lower level that is equal to IP or FQDN of the parent device. We can pass this env variable as the value of ACR_PARENT_GATEWAY_ENDPOINT to avoid hardcode the parent IP or FQDN.

```json
{
    "modulesContent": {
        "$edgeAgent": {
            "properties.desired": {
                "modules": {
                    "connected-registry": {
                        "settings": {
                            "image": "$upstream/acr/connected-registry:0.3.0",
                            "createOptions": "{\"HostConfig\":{\"Binds\":[\"/home/azureuser/connected-registry:/var/acr/data\",\"/usr/local/share/ca-certificates:/usr/local/share/ca-certificates\",\"/etc/ssl/certs:/etc/ssl/certs\",\"LogConfig\":{ \"Type\": \"json-file\", \"Config\": {\"max-size\": \"10m\",\"max-file\": \"3\"}}]}}"
                        },
                        "type": "docker",
                        "env": {
                            "ACR_REGISTRY_CONNECTION_STRING": {
                                "value": "ConnectedRegistryName=myconnectedmirror;SyncTokenName=myconnectedmirror-sync-token;SyncTokenPassword=s0meCoMPL3xP4$$W0rd001!@#;ParentGatewayEndpoint=$IOTEDGE_PARENTHOSTNAME;ParentEndpointProtocol=https"
                            }
                        },
                        "status": "running",
                        "restartPolicy": "always",
                        "version": "1.0"
                    },
                    "IoTEdgeApiProxy": {
                        "settings": {
                            "image": "$upstream/azureiotedge-api-proxy:9.9.9-dev",
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
                                "address": "$upstream",
                                "password": "$$$0meCoMPL3xP4$$W0rd001!@#$$",
                                "username": "myconnectedmirror-sync-token"
                            }
                        }
                    },
                    "type": "docker"
                },
                "schemaVersion": "1.1",
                "systemModules": {
                    "edgeAgent": {
                        "settings": {
                            "image": "$upstream/azureiotedge-agent:20210609.5",
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
                            "image": "$upstream/azureiotedge-hub:20210609.5",
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

Use the information from the previous sections to update the relevant JSON values:

- The environment variable `ACR_REGISTRY_CONNECTION_STRING` needs to be updated with the output from the `az acr connected-registry install renew-credentials` command above. You will need to manually replace the `ParentGatewayEndpoint` with the $IOTEDGE_PARENTHOSTNAME. You will also need to select the proper protocol in `ParentEndpointProtocol`.
- For each module in the manifest, you should update the registry endpoint to the $upstream.

You will use the file path in the next section when you run the command to apply the configuration to your device.

## Setup and deploy the connected registry module on nested IoT Edge
This tutorial requires a nested Azure IoT Edge device to be set up upfront. You can use the [Deploy your first IoT Edge module to a virtual Linux device](https://docs.microsoft.com/en-us/azure/iot-edge/quickstart-linux?view=iotedge-2020-11) quickstart guide to learn how to deploy a virtual IoT Edge device. To create a nested IoT Edge devices, follow the instructions [Tutorial: Create a hierarchy of IoT Edge devices](https://docs.microsoft.com/en-us/azure/iot-edge/tutorial-nested-iot-edge?view=iotedge-2020-11) to learn how to configure hierarchical IoT edge devices. The connected registry is deployed as a module on the nested IoT Edge device.

Based on the tutorial, it overall includes the following steps:
1. Create top level and lower level vms from existing template. The template will also install the iot agent on it. You can use the [Tutorial: Install or uninstall Azure IoT Edge for Linux](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-install-iot-edge?view=iotedge-2020-11) to learn how to manually set up the machine if you need deploy from your own devices.

2. Use the iotedge-config tool to create and configure your hierarchy, follow the steps below in the Azure CLI:

    ```json
    mkdir nestedIotEdgeTutorial
    cd ~/nestedIotEdgeTutorial
    wget -O iotedge_config.tar "https://github.com/Azure-Samples/iotedge_config_cli/releases/download/latest/iotedge_config_cli.tar.gz"
    tar -xvf iotedge_config.tar
    ```

    This will create the iotedge_config_cli_release folder in your tutorial directory. The template file used to create your device hierarchy is the iotedge_config.yaml file found in ~/nestedIotEdgeTutorial/iotedge_config_cli_release/templates/tutorial. In the same directory, there're two deployment manifests for top and lower level deploymentTopLayer.json and deploymentLowerLayer.json files. Refer the #4 below on how to prepare them.

3. Edit iotedge_config.yaml with your information. This include the iothub_hostname, iot_name, deployment template file for both top layer and child as well as the credentials used to pull the image from upstream. Please refer [Quickstart: Deploy a connected registry to an IoT Edge device](quickstart-deploy-connected-registry-iot-edge-cli.md) if you are not familar how to create a client token. And you also make sure the client token get the permissions to pull all the required images. Below is a sample config.

    ```json
    config_version: "1.0"

    iothub:
    iothub_hostname: myiothub.azure-devices.net
    iothub_name: myiothub
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
    device_id: top-layerx
    edge_agent: "mycontainerregistry001.azurecr.io/azureiotedge-agent:20210609.5" ## Optional. If not provided, default_edge_agent will be used
    deployment: "./templates/tutorial/deploymentTopLayer.json" ## Optional. If provided, the given deployment file will be applied to the newly created device
    # hostname: "FQDN or IP" ## Optional. If provided, install.sh will not prompt user for this value nor the parent_hostname value
    container_auth: // The token used to pull the image from cloud registry
        serveraddress: "mycontainerregistry001.azurecr.io"
        username: "crimagepulltokentop"
        password: "HwBU+ZhB+X9AOmeAq6ZG2G/y2QD=8sfT"
    child:
        - device_id: lower-layerx
        deployment: "./templates/tutorial/deploymentLowerLayer.json" ## Optional. If provided, the given deployment file will be applied to the newly created device
        # hostname: "FQDN or IP" ## Optional. If provided, install.sh will not prompt user for this value nor the parent_hostname value
        container_auth: //The token used to pull the image from parent connected registry
            serveraddress: "$upstream:8000"
            username: "crimagepulltokenlower"
            password: "$$$0meCoMPL3xP4$$W0rd001!@#$$"
    ```


4. Prepare the top level and lower level deployment files (deploymentTopLayer.json and deploymentLowerLayer.json). 

    The top level deployment file is the same as the one you used to set up a connected registry on a IoT Edge device. Refer [Quickstart: Deploy a connected registry to an IoT Edge device](quickstart-deploy-connected-registry-iot-edge-cli.md). Make sure you do have API proxy module deployed on top layer and open the port `8000`, `5671`, `8883`. 

    For the lower level deployment file, please refer the above section 'Configure a deployment manifest for the nested IoT Edge' about the difference to the top level deployment file. Overall, the lowever level deployment file is similar as the top level deployment file. The differences are: 

    - It need pull all the images required from top level connected registry instead of from cloud registry or MCR. 
    When you set up the top level connected registry, you need make sure it will sync up all the IoT agent, hub and connected registry images locally (azureiotedge-agent, azureiotedge-hub, connected-registry). The lower level IoT device need pull these images from the top level connected registry.
    - It need configure the parent gateway endpoint with the top level connected registry IP or FQDN instead of cloud registry. 

5. Install in the top and lower level devices.
    Navigate to your iotedge_config_cli_releae directory and run the tool to create your hierarchy of IoT Edge devices.
    ```json
    cd ~/nestedIotEdgeTutorial/iotedge_config_cli_release
    ./iotedge_config --config ~/nestedIotEdgeTutorial/iotedge_config_cli_release/templates/tutorial/iotedge_config.yaml --output ~/nestedIotEdgeTutorial/iotedge_config_cli_release/outputs -f
    ```

    With the --output flag, the toos creates the device certificates, certificate bundles, and a log file in a directory of your choice. With the -f flag set, the tool will automatically look for existing IoT Edge devices in your IoT Hub and remove them, to avoid errors and keep your hub clean.

    Copy the generated top-layer.zip and lower-layer.zip in above steps to the corresponding top and lower vms using scp。

    ```json
    scp <PATH_TO_CONFIGURATION_BUNDLE>   <USER>@<VM_IP_OR_FQDN>:~
    ```

    Go to each device, unzip the configuration bundle. You'll need to install zip first.
    ```json
    sudo apt install zip
    unzip ~/<PATH_TO_CONFIGURATION_BUNDLE>/<CONFIGURATION_BUNDLE>.zip (unzip top-layer.zip)
    ```

    Unzip the installation files and run ./install.sh, input the ip and host name. All are done for top layer device deployment. Run iotedge list to double check if all modules are running well.

    Repeat the same steps in lower level device. Unzip files and run ./install.sh. Input the ip, host name and parent hostname. 
    All are done for lower layer deployment. Run iotedge list to double check if all modules are running well. 
    
    If there're any problems e.g. invalid deployment manifest. You need manually redeploy the modules. Refer the next session on how to make a deployment manually on top or lower device.

## Manully Deploy the connected registry module on IoT Edge

The following step might be covered during nested iot setup after you run install.sh on top and lower level devices. However, it is also possible the previous deployment doesn't success and you can use the following way to redeploy it. 

Use the following command to deploy the connected registry module on the IoT Edge device:

```azurecli
az iot edge set-modules \
  --device-id [device id] \
  --hub-name [hub name] \
  --content [file path]
```

For more details you can refer to the [Deploy Azure IoT Edge modules with Azure CLI](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-deploy-modules-cli?view=iotedge-2020-11) article.

To check the status of the connected registry, use the following CLI command:

```azurecli
az acr connected-registry show \
  --registry mycontainerregistry001 \
  --name myconnectedmirror \
  --output table
```

You may need to a wait few minutes until the deployment of the connected registry completes.

Successful response from the command will include the following:

```azurecli
connectionState: Online
```

## Next steps

In this quickstart, you learned how to deploy a connected registry to an IoT Edge device. Continue to the next guide to learn how to pull images from the newly deployed connected registry.

> [Quickstart: Pull images from a connected registry][quickstart-pull-images-from-connected-registry]

<!-- LINKS - internal -->
[az-acr-connected-registry-install]: /cli/azure/acr#az-acr-connected-registry-install
[az-acr-import]: /cli/azure/acr#az-acr-import
[az-acr-token-credential-generate]: /cli/azure/acr/credential#az-acr-token-credential-generate
[container-registry-intro]: container-registry-intro.md
[quickstart-pull-images-from-connected-registry]: quickstart-pull-images-from-connected-registry.md
[quickstart-connected-registry-cli]: quickstart-connected-registry-cli.md