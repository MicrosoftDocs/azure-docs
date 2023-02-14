---
title: Tutorial - Prepare a deployment for a confidential container on Azure Container Instances
description: Azure Container Instances tutorial deploys a confidential container - ARM
ms.topic: tutorial
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.date: 02/28/2023
ms.custom: "seodec18, mvc, devx-track-js"
---

# Tutorial: Create an ARM template for a confidential container deployment with custom confidential computing enforcement policy 

Confidential containers on ACI is a SKU on the serverless platform that enables customers to run container applications in a hardware-based trusted execution environment (TEE) with in-memory encryption via Secure Nested Paging. 

In this article, you'll:

> [!div class="checklist"]
> * Create an ARM template for a confidential container group
> * Generate a confidential computing enforcement (CCE) policy
> * Deploy the confidential container group to Azure 

## Before you begin

[!INCLUDE [container-instances-tutorial-prerequisites-confidential-containers](../../includes/container-instances-tutorial-prerequisites-confidential-containers.md)]

## Create an ACI container group ARM Template

In this tutorial, you are deploying a hello world application that generates a hardware attestation report. We start by creating an ARM template with a container group resource to define the properties of this application. This ARM is used with the Azure CLI confcom tooling to generate a confidential computing enforcement (CCE) policy for software attestation. In this tutorial, this [ARM template](https://acidocs.blob.core.windows.net/documentation/template.json) is used.  

There are two properties added to the ACI resource definition to make the container group confidential: 

1. **sku**: The SKU property enables you to select between Confidential and Standard container group deployments. If this property is not added, the container group will is deployed as Standard SKU. 
2. **confidentialComputePropeties**: The confidentialComputeProperties object enables you to pass in a custom confidential computing enforcement policy for software attestation of your container group. If this object is not added to the resource, you'll only receive hardware attestation, and all software is allowed to run within the container group.

Save this ARM template on your local machine as **template.json**.

```ARM
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "name": {
        "type": "string",
        "defaultValue": "aci-hello-world",
        "metadata": {
          "description": "Name for the container group"
        }
      },
      "location": {
        "type": "string",
        "defaultValue": "eastus2euap",
        "metadata": {
          "description": "Location for all resources."
        }
      },
      "image": {
        "type": "string",
        "defaultValue": "acicc.azurecr.io/aci/cc-hello-world:latest",
        "metadata": {
          "description": "Container image to deploy. Should be of the form repoName/imagename:tag for images stored in public Docker Hub, or a fully qualified URI for other registries. Images from private registries require additional registry credentials."
        }
      },
      "port": {
        "type": "int",
        "defaultValue": 8080,
        "metadata": {
          "description": "Port to open on the container and the public IP address."
        }
      },
      "cpuCores": {
        "type": "int",
        "defaultValue": 1,
        "metadata": {
          "description": "The number of CPU cores to allocate to the container."
        }
      },
      "memoryInGb": {
        "type": "int",
        "defaultValue": 1,
        "metadata": {
          "description": "The amount of memory to allocate to the container in gigabytes."
        }
      },
      "restartPolicy": {
        "type": "string",
        "defaultValue": "Never",
        "allowedValues": [
          "Always",
          "Never",
          "OnFailure"
        ],
        "metadata": {
          "description": "The behavior of Azure runtime if container has stopped."
        }
      }
    },
    "resources": [
      {
        "type": "Microsoft.ContainerInstance/containerGroups",
        "apiVersion": "2022-10-01-preview",
        "name": "[parameters('name')]",
        "location": "[parameters('location')]",
        "properties": {
          "confidentialComputeProperties": {
            "ccePolicy": ""
          },
          "containers": [
            {
              "name": "[parameters('name')]",
              "properties": {
                "image": "[parameters('image')]",
                "ports": [
                  {
                    "port": "[parameters('port')]",
                    "protocol": "TCP"
                  }
                ],
                "resources": {
                  "requests": {
                    "cpu": "[parameters('cpuCores')]",
                    "memoryInGB": "[parameters('memoryInGb')]"
                  }
                }
              }
            }
          ],
          "sku": "Confidential",
          "osType": "Linux",
          "restartPolicy": "[parameters('restartPolicy')]",
          "ipAddress": {
            "type": "Public",
            "ports": [
              {
                "port": "[parameters('port')]",
                "protocol": "TCP"
              }
            ]
          }
        }
      }
    ],
    "outputs": {
      "containerIPv4Address": {
        "type": "string",
        "value": "[reference(resourceId('Microsoft.ContainerInstance/containerGroups', parameters('name'))).ipAddress.ip]"
      }
    }
  }
```

## Create a custom CCE Policy 

With the ARM template that you have crafted and the Azure CLI confcom extension, you are able to generate a custom CCE policy. the CCE policy is used for software attestation. The tool takes the ARM template as an input to generate the policy. The policy enforces the specific container images, environment variables, mounts, and commands which can then be validated when the container group starts up. For more information on the Azure CLI confcom extension, see (article to be added)[../../includes/container-instances-tutorial-prerequisites-confidential-containers.md].


1. To generate the CCE policy, you'll run the following command using the ARM template as input: 

```bash
az confcom acipolicygen -a .\template.json --print-policy
``` 

When this command completes, you should see a Base 64 encoded string as output. This string is the CCE policy that is added to your ARM template. 

```bash
cGFja2FnZSBwb2xpY3kKCmFwaV9zdm4gOj0gIjAuOS4wIgoKaW1wb3J0IGZ1dHVyZS5rZXl3b3Jkcy5ldmVyeQppbXBvcnQgZnV0dXJlLmtleXdvcmRzLmluCgpmcmFnbWVudHMgOj0gWwpdCgpjb250YWluZXJzIDo9IFsKICAgIHsKICAgICAgICAiY29tbWFuZCI6IFsiL3BhdXNlIl0sCiAgICAgICAgImVudl9ydWxlcyI6IFt7InBhdHRlcm4iOiAiUEFUSD0vdXNyL2xvY2FsL3NiaW46L3Vzci9sb2NhbC9iaW46L3Vzci9zYmluOi91c3IvYmluOi9zYmluOi9iaW4iLCAic3RyYXRlZ3kiOiAic3RyaW5nIiwgInJlcXVpcmVkIjogdHJ1ZX0seyJwYXR0ZXJuIjogIlRFUk09eHRlcm0iLCAic3RyYXRlZ3kiOiAic3RyaW5nIiwgInJlcXVpcmVkIjogZmFsc2V9XSwKICAgICAgICAibGF5ZXJzIjogWyIxNmI1MTQwNTdhMDZhZDY2NWY5MmMwMjg2M2FjYTA3NGZkNTk3NmM3NTVkMjZiZmYxNjM2NTI5OTE2OWU4NDE1Il0sCiAgICAgICAgIm1vdW50cyI6IFtdLAogICAgICAgICJleGVjX3Byb2Nlc3NlcyI6IFtdLAogICAgICAgICJzaWduYWxzIjogW10sCiAgICAgICAgImFsbG93X2VsZXZhdGVkIjogZmFsc2UsCiAgICAgICAgIndvcmtpbmdfZGlyIjogIi8iCiAgICB9LApdCmFsbG93X3Byb3BlcnRpZXNfYWNjZXNzIDo9IHRydWUKYWxsb3dfZHVtcF9zdGFja3MgOj0gdHJ1ZQphbGxvd19ydW50aW1lX2xvZ2dpbmcgOj0gdHJ1ZQphbGxvd19lbnZpcm9ubWVudF92YXJpYWJsZV9kcm9wcGluZyA6PSB0cnVlCmFsbG93X3VuZW5jcnlwdGVkX3NjcmF0Y2ggOj0gdHJ1ZQoKCm1vdW50X2RldmljZSA6PSB7ICJhbGxvd2VkIiA6IHRydWUgfQp1bm1vdW50X2RldmljZSA6PSB7ICJhbGxvd2VkIiA6IHRydWUgfQptb3VudF9vdmVybGF5IDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CnVubW91bnRfb3ZlcmxheSA6PSB7ICJhbGxvd2VkIiA6IHRydWUgfQpjcmVhdGVfY29udGFpbmVyIDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CmV4ZWNfaW5fY29udGFpbmVyIDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CmV4ZWNfZXh0ZXJuYWwgOj0geyAiYWxsb3dlZCIgOiB0cnVlIH0Kc2h1dGRvd25fY29udGFpbmVyIDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CnNpZ25hbF9jb250YWluZXJfcHJvY2VzcyA6PSB7ICJhbGxvd2VkIiA6IHRydWUgfQpwbGFuOV9tb3VudCA6PSB7ICJhbGxvd2VkIiA6IHRydWUgfQpwbGFuOV91bm1vdW50IDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CmdldF9wcm9wZXJ0aWVzIDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CmR1bXBfc3RhY2tzIDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CnJ1bnRpbWVfbG9nZ2luZyA6PSB7ICJhbGxvd2VkIiA6IHRydWUgfQpsb2FkX2ZyYWdtZW50IDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CnNjcmF0Y2hfbW91bnQgOj0geyAiYWxsb3dlZCIgOiB0cnVlIH0Kc2NyYXRjaF91bm1vdW50IDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CnJlYXNvbiA6PSB7ImVycm9ycyI6IGRhdGEuZnJhbWV3b3JrLmVycm9yc30K
```

2. Copy the string and paste under the ccePolicy property in your ARM template. 

```ARM
"confidentialComputeProperties": {
    "ccePolicy": "cGFja2FnZSBwb2xpY3kKCmFwaV9zdm4gOj0gIjAuOS4wIgoKaW1wb3J0IGZ1dHVyZS5rZXl3b3Jkcy5ldmVyeQppbXBvcnQgZnV0dXJlLmtleXdvcmRzLmluCgpmcmFnbWVudHMgOj0gWwpdCgpjb250YWluZXJzIDo9IFsKICAgIHsKICAgICAgICAiY29tbWFuZCI6IFsiL3BhdXNlIl0sCiAgICAgICAgImVudl9ydWxlcyI6IFt7InBhdHRlcm4iOiAiUEFUSD0vdXNyL2xvY2FsL3NiaW46L3Vzci9sb2NhbC9iaW46L3Vzci9zYmluOi91c3IvYmluOi9zYmluOi9iaW4iLCAic3RyYXRlZ3kiOiAic3RyaW5nIiwgInJlcXVpcmVkIjogdHJ1ZX0seyJwYXR0ZXJuIjogIlRFUk09eHRlcm0iLCAic3RyYXRlZ3kiOiAic3RyaW5nIiwgInJlcXVpcmVkIjogZmFsc2V9XSwKICAgICAgICAibGF5ZXJzIjogWyIxNmI1MTQwNTdhMDZhZDY2NWY5MmMwMjg2M2FjYTA3NGZkNTk3NmM3NTVkMjZiZmYxNjM2NTI5OTE2OWU4NDE1Il0sCiAgICAgICAgIm1vdW50cyI6IFtdLAogICAgICAgICJleGVjX3Byb2Nlc3NlcyI6IFtdLAogICAgICAgICJzaWduYWxzIjogW10sCiAgICAgICAgImFsbG93X2VsZXZhdGVkIjogZmFsc2UsCiAgICAgICAgIndvcmtpbmdfZGlyIjogIi8iCiAgICB9LApdCmFsbG93X3Byb3BlcnRpZXNfYWNjZXNzIDo9IHRydWUKYWxsb3dfZHVtcF9zdGFja3MgOj0gdHJ1ZQphbGxvd19ydW50aW1lX2xvZ2dpbmcgOj0gdHJ1ZQphbGxvd19lbnZpcm9ubWVudF92YXJpYWJsZV9kcm9wcGluZyA6PSB0cnVlCmFsbG93X3VuZW5jcnlwdGVkX3NjcmF0Y2ggOj0gdHJ1ZQoKCm1vdW50X2RldmljZSA6PSB7ICJhbGxvd2VkIiA6IHRydWUgfQp1bm1vdW50X2RldmljZSA6PSB7ICJhbGxvd2VkIiA6IHRydWUgfQptb3VudF9vdmVybGF5IDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CnVubW91bnRfb3ZlcmxheSA6PSB7ICJhbGxvd2VkIiA6IHRydWUgfQpjcmVhdGVfY29udGFpbmVyIDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CmV4ZWNfaW5fY29udGFpbmVyIDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CmV4ZWNfZXh0ZXJuYWwgOj0geyAiYWxsb3dlZCIgOiB0cnVlIH0Kc2h1dGRvd25fY29udGFpbmVyIDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CnNpZ25hbF9jb250YWluZXJfcHJvY2VzcyA6PSB7ICJhbGxvd2VkIiA6IHRydWUgfQpwbGFuOV9tb3VudCA6PSB7ICJhbGxvd2VkIiA6IHRydWUgfQpwbGFuOV91bm1vdW50IDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CmdldF9wcm9wZXJ0aWVzIDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CmR1bXBfc3RhY2tzIDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CnJ1bnRpbWVfbG9nZ2luZyA6PSB7ICJhbGxvd2VkIiA6IHRydWUgfQpsb2FkX2ZyYWdtZW50IDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CnNjcmF0Y2hfbW91bnQgOj0geyAiYWxsb3dlZCIgOiB0cnVlIH0Kc2NyYXRjaF91bm1vdW50IDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CnJlYXNvbiA6PSB7ImVycm9ycyI6IGRhdGEuZnJhbWV3b3JrLmVycm9yc30K"
}
```

3. Save the ARM template locally. 

## Deploy the template

1. Select the following image to sign in to Azure and open a template. Click edit template, load file, and upload the template that you have crafted. 

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.containerinstance%2Faci-linuxcontainer-public-ip%2Fazuredeploy.json)

2. Click Save. 

 3. Select or enter the following values.

    * **Subscription**: select an Azure subscription.
    * **Resource group**: select **Create new**, enter a unique name for the resource group, and then select **OK**.
    * **Location**: select a location for the resource group. Example: **West Europe**.
    * **Name**: accept the generated name for the instance, or enter a name.
    * **Image**: accept the default image name. This sample Linux image packages a small web app written in Node.js that serves a static HTML page. 

    Accept default values for the remaining properties.

    Review the terms and conditions. If you agree, select **I agree to the terms and conditions stated above**.

    ![Template properties](media/container-instances-quickstart-template/template-properties.png)

 3. After the instance has been created successfully, you get a notification:

    ![Portal notification](media/container-instances-quickstart-template/deployment-notification.png)

 The Azure portal is used to deploy the template. In addition to the Azure portal, you can use the Azure PowerShell, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-cli.md).

## Review deployed resources

Use the Azure portal or a tool such as the [Azure CLI](container-instances-quickstart.md) to review the properties of the container instance.

1. In the portal, search for Container Instances, and select the container instance you created.

1. On the **Overview** page, note the **Status** of the instance and its **IP address**.

    ![Instance overview](media/container-instances-quickstart-template/aci-overview.png)

2. Once its status is *Running*, navigate to the IP address in your browser. 

    ![App deployed using Azure Container Instances viewed in browser](media/container-instances-quickstart-template/view-application-running-in-an-azure-container-instance.png)

## Next steps

Advance to the next tutorial in the series to learn about storing your container image in Azure Container Registry:

> [!div class="nextstepaction"]
> [Push image to Azure Container Registry](container-instances-tutorial-prepare-acr.md)

<!--- IMAGES --->
[aci-tutorial-app]:./media/container-instances-quickstart/aci-app-browser.png
[aci-tutorial-app-local]: ./media/container-instances-tutorial-prepare-app/aci-app-browser-local.png

<!-- LINKS - External -->
[aci-helloworld-zip]: https://github.com/Azure-Samples/aci-helloworld/archive/master.zip
[alpine-linux]: https://alpinelinux.org/
[docker-build]: https://docs.docker.com/engine/reference/commandline/build/
[docker-get-started]: https://docs.docker.com/get-started/
[docker-hub-nodeimage]: https://store.docker.com/images/node
[docker-images]: https://docs.docker.com/engine/reference/commandline/images/
[docker-linux]: https://docs.docker.com/engine/installation/#supported-platforms
[docker-login]: https://docs.docker.com/engine/reference/commandline/login/
[docker-mac]: https://docs.docker.com/docker-for-mac/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-run]: https://docs.docker.com/engine/reference/commandline/run/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[docker-windows]: https://docs.docker.com/docker-for-windows/
[nodejs]: https://nodejs.org

<!-- LINKS - Internal -->
[azure-cli-install]: /cli/azure/install-azure-cli
