---
title: Deploy multi-container groups in Azure Container Instances with Azure CLI and YAML
description: Learn how to deploy a container group with multiple containers in Azure Container Instances by using the Azure CLI and a YAML file.
services: container-instances
author: dlepow

ms.service: container-instances
ms.topic: article
ms.date: 07/17/2018
ms.author: danlep
---

# Deploy a multi-container container group with YAML

Azure Container Instances supports the deployment of multiple containers onto a single host by using a [container group](container-instances-container-groups.md). Multi-container container groups are useful when building an application sidecar for logging, monitoring, or any other configuration where a service needs a second attached process.

There are two methods for deploying multi-container groups using the Azure CLI:

* YAML file deployment (this article)
* [Resource Manager template deployment](container-instances-multi-container-group.md)

Due to the YAML format's more concise nature, deployment with a YAML file is recommended when your deployment includes *only* container instances. If you need to deploy additional Azure service resources (for example, an Azure Files share) at the time of container instance deployment, Resource Manager template deployment is recommended.

> [!NOTE]
> Multi-container groups are currently restricted to Linux containers. While we're working to bring all features to Windows containers, you can find current platform differences in [Quotas and region availability for Azure Container Instances](container-instances-quotas.md).

## Configure the YAML file

To deploy a multi-container container group with the [az container create][az-container-create] command in the Azure CLI, you must specify the container group configuration in a YAML file, then pass the YAML file as a parameter to the  command.

Start by copying the following YAML into a new file named **deploy-aci.yaml**.

This YAML file defines a container group named "myContainerGroup" with two containers, a public IP address, and two exposed ports. The first container in the group runs an internet-facing web application. The second container, the sidecar, periodically makes HTTP requests to the web application running in the first container via the container group's local network.

```YAML
apiVersion: 2018-06-01
location: eastus
name: myContainerGroup
properties:
  containers:
  - name: aci-tutorial-app
    properties:
      image: microsoft/aci-helloworld:latest
      resources:
        requests:
          cpu: 1
          memoryInGb: 1.5
      ports:
      - port: 80
      - port: 8080
  - name: aci-tutorial-sidecar
    properties:
      image: microsoft/aci-tutorial-sidecar
      resources:
        requests:
          cpu: 1
          memoryInGb: 1.5
  osType: Linux
  ipAddress:
    type: Public
    ports:
    - protocol: tcp
      port: '80'
    - protocol: tcp
      port: '8080'
tags: null
type: Microsoft.ContainerInstance/containerGroups
```

## Deploy the container group

Create a resource group with the [az group create][az-group-create] command:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Deploy the container group with the [az container create][az-container-create] command, passing the YAML file as an argument:

```azurecli-interactive
az container create --resource-group myResourceGroup --file deploy-aci.yaml
```

Within a few seconds, you should receive an initial response from Azure.

## View deployment state

To view the state of the deployment, use the following [az container show][az-container-show] command:

```azurecli-interactive
az container show --resource-group myResourceGroup --name myContainerGroup --output table
```

If you'd like to view the running application, navigate to its IP address in your browser. For example, the IP is `52.168.26.124` in this example output:

```bash
Name              ResourceGroup    ProvisioningState    Image                                                           IP:ports               CPU/Memory       OsType    Location
----------------  ---------------  -------------------  --------------------------------------------------------------  ---------------------  ---------------  --------  ----------
myContainerGroup  myResourceGroup  Succeeded            microsoft/aci-helloworld:latest,microsoft/aci-tutorial-sidecar  52.168.26.124:80,8080  1.0 core/1.5 gb  Linux     eastus
```

## View logs

View the log output of a container using the [az container logs][az-container-logs] command. The `--container-name` argument specifies the container from which to pull logs. In this example, the first container is specified.

```azurecli-interactive
az container logs --resource-group myResourceGroup --name myContainerGroup --container-name aci-tutorial-app
```

Output:

```console
listening on port 80
::1 - - [09/Jan/2018:23:17:48 +0000] "HEAD / HTTP/1.1" 200 1663 "-" "curl/7.54.0"
::1 - - [09/Jan/2018:23:17:51 +0000] "HEAD / HTTP/1.1" 200 1663 "-" "curl/7.54.0"
::1 - - [09/Jan/2018:23:17:54 +0000] "HEAD / HTTP/1.1" 200 1663 "-" "curl/7.54.0"
```

To see the logs for the side-car container, run the same command specifying the second container name.

```azurecli-interactive
az container logs --resource-group myResourceGroup --name myContainerGroup --container-name aci-tutorial-sidecar
```

Output:

```console
Every 3s: curl -I http://localhost                          2018-01-09 23:25:11

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0  1663    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
HTTP/1.1 200 OK
X-Powered-By: Express
Accept-Ranges: bytes
Cache-Control: public, max-age=0
Last-Modified: Wed, 29 Nov 2017 06:40:40 GMT
ETag: W/"67f-16006818640"
Content-Type: text/html; charset=UTF-8
Content-Length: 1663
Date: Tue, 09 Jan 2018 23:25:11 GMT
Connection: keep-alive
```

As you can see, the sidecar is periodically making an HTTP request to the main web application via the group's local network to ensure that it is running. This sidecar example could be expanded to trigger an alert if it received an HTTP response code other than 200 OK.

## Deploy from private registry

To use a private container image registry, include the following YAML with values modified for your environment:

```YAML
  imageRegistryCredentials:
  - server: imageRegistryLoginServer
    username: imageRegistryUsername
    password: imageRegistryPassword
```

For example, the following YAML deploys a container group with a single container whose image is pulled from a private Azure Container Registry named "myregistry":

```YAML
apiVersion: 2018-06-01
location: eastus
name: myContainerGroup2
properties:
  containers:
  - name: aci-tutorial-app
    properties:
      image: myregistry.azurecr.io/aci-helloworld:latest
      resources:
        requests:
          cpu: 1
          memoryInGb: 1.5
      ports:
      - port: 80
  osType: Linux
  ipAddress:
    type: Public
    ports:
    - protocol: tcp
      port: '80'
  imageRegistryCredentials:
  - server: myregistry.azurecr.io
    username: myregistry
    password: REGISTRY_PASSWORD
tags: null
type: Microsoft.ContainerInstance/containerGroups
```

## Export container group to YAML

You can export the configuration of an existing container group to a YAML file by using the Azure CLI command [az container export][az-container-export].

Useful for preserving a container group's configuration, export allows you to store your container group configurations in version control for "configuration as code." Or, use the exported file as a starting point when developing a new configuration in YAML.

Export the configuration for the container group you created earlier by issuing the following [az container export][az-container-export] command:

```azurecli-interactive
az container export --resource-group myResourceGroup --name myContainerGroup --file deployed-aci.yaml
```

No output is displayed if the command is successful, but you can view the contents of the file to see the result. For example, the first few lines with `head`:

```console
$ head deployed-aci.yaml
additional_properties: {}
apiVersion: '2018-06-01'
location: eastus
name: myContainerGroup
properties:
  containers:
  - name: aci-tutorial-app
    properties:
      environmentVariables: []
      image: microsoft/aci-helloworld:latest
```

## Next steps

This article covered the steps needed for deploying a multi-container Azure container instance. For an end-to-end Azure Container Instances experience, including using a private Azure container registry, see the Azure Container Instances tutorial.

> [!div class="nextstepaction"]
> [Azure Container Instances tutorial][aci-tutorial]

<!-- LINKS - External -->
[cli-issue-6525]: https://github.com/Azure/azure-cli/issues/6525

<!-- LINKS - Internal -->
[aci-tutorial]: ./container-instances-tutorial-prepare-app.md
[az-container-create]: /cli/azure/container#az-container-create
[az-container-export]: /cli/azure/container#az-container-export
[az-container-logs]: /cli/azure/container#az-container-logs
[az-container-show]: /cli/azure/container#az-container-show
[az-group-create]: /cli/azure/group#az-group-create
[az-group-deployment-create]: /cli/azure/group/deployment#az-group-deployment-create
[template-reference]: https://docs.microsoft.com/azure/templates/microsoft.containerinstance/containergroups
