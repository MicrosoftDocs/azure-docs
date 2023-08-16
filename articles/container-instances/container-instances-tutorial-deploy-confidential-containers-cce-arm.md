---
title: Tutorial - Prepare a deployment for a confidential container on Azure Container Instances
description: Azure Container Instances tutorial deploys a confidential container - ARM
ms.topic: tutorial
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
services: container-instances
ms.date: 05/23/2023
ms.custom: seodec18, mvc, devx-track-arm-template, devx-track-linux
---

# Tutorial: Create an ARM template for a confidential container deployment with custom confidential computing enforcement policy

Confidential containers on ACI is a SKU on the serverless platform that enables customers to run container applications in a hardware-based and attested trusted execution environment (TEE), which can protect data in use and provides in-memory encryption via Secure Nested Paging. 

In this article, you'll:

> [!div class="checklist"]
> * Create an ARM template for a confidential container group
> * Generate a confidential computing enforcement (CCE) policy
> * Deploy the confidential container group to Azure 

## Before you begin

[!INCLUDE [container-instances-tutorial-prerequisites-confidential-containers](../../includes/container-instances-tutorial-prerequisites-confidential-containers.md)]

## Create an ACI container group ARM Template

In this tutorial, you deploy a hello world application that generates a hardware attestation report. You start by creating an ARM template with a container group resource to define the properties of this application. You'll use this ARM template with the Azure CLI confcom tooling to generate a confidential computing enforcement (CCE) policy for attestation. In this tutorial, we use this [ARM template](https://raw.githubusercontent.com/Azure-Samples/aci-confidential-hello-world/main/template.json?token=GHSAT0AAAAAAB5B6SJ7VUYU3G6MMQUL7KKKY7QBZBA). To view the source code for this application, visit [ACI Confidential Hello World](https://aka.ms/ccacihelloworld).

> [!NOTE] 
> The ccePolicy parameter of the template is blank and needs to be updated based on the next step of this tutorial. 

There are two properties added to the Azure Container Instance resource definition to make the container group confidential: 

1. **sku**: The SKU property enables you to select between confidential and standard container group deployments. If this property isn't added, the container group will be deployed as standard SKU. 
2. **confidentialComputeProperties**: The confidentialComputeProperties object enables you to pass in a custom confidential computing enforcement policy for attestation of your container group. If this object isn't added to the resource there will be no validation of the software components running within the container group.

Use your preferred text editor to save this ARM template on your local machine as **template.json**.

You can see under **confidentialComputeProperties**, we have left a blank **ccePolicy** for you to fill in once you generate the policy in the next step.

```ARM
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "name": {
        "type": "string",
        "defaultValue": "helloworld",
        "metadata": {
          "description": "Name for the container group"
        }
      },
      "location": {
        "type": "string",
        "defaultValue": "North Europe",
        "metadata": {
          "description": "Location for all resources."
        }
      },
      "image": {
        "type": "string",
        "defaultValue": "mcr.microsoft.com/aci/aci-confidential-helloworld:v1",
        "metadata": {
          "description": "Container image to deploy. Should be of the form repoName/imagename:tag for images stored in public Docker Hub, or a fully qualified URI for other registries. Images from private registries require additional registry credentials."
        }
      },
      "port": {
        "type": "int",
        "defaultValue": 80,
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
        "apiVersion": "2023-05-01",
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

With the ARM template that you've crafted and the Azure CLI confcom extension, you're able to generate a custom CCE policy. the CCE policy is used for attestation. The tool takes the ARM template as an input to generate the policy. The policy enforces the specific container images, environment variables, mounts, and commands, which can then be validated when the container group starts up. For more information on the Azure CLI confcom extension, see [Azure CLI confcom extension](https://github.com/Azure/azure-cli-extensions/blob/main/src/confcom/azext_confcom/README.md).


1. To generate the CCE policy, you'll run the following command using the ARM template as input: 

   ```azurecli-interactive
   az confcom acipolicygen -a .\template.json --print-policy
   ``` 

   When this command completes, you should see a Base 64 string generated as output in the format seen below. This string is the CCE policy that you will copy and paste into your ARM template under the ccePolicy property. 

   ```output
   cGFja2FnZSBwb2xpY3kKCmFwaV9zdm4gOj0gIjAuOS4wIgoKaW1wb3J0IGZ1dHVyZS5rZXl3b3Jkcy5ldmVyeQppbXBvcnQgZnV0dXJlLmtleXdvcmRzLmluCgpmcmFnbWVudHMgOj0gWwpdCgpjb250YWluZXJzIDo9IFsKICAgIHsKICAgICAgICAiY29tbWFuZCI6IFsiL3BhdXNlIl0sCiAgICAgICAgImVudl9ydWxlcyI6IFt7InBhdHRlcm4iOiAiUEFUSD0vdXNyL2xvY2FsL3NiaW46L3Vzci9sb2NhbC9iaW46L3Vzci9zYmluOi91c3IvYmluOi9zYmluOi9iaW4iLCAic3RyYXRlZ3kiOiAic3RyaW5nIiwgInJlcXVpcmVkIjogdHJ1ZX0seyJwYXR0ZXJuIjogIlRFUk09eHRlcm0iLCAic3RyYXRlZ3kiOiAic3RyaW5nIiwgInJlcXVpcmVkIjogZmFsc2V9XSwKICAgICAgICAibGF5ZXJzIjogWyIxNmI1MTQwNTdhMDZhZDY2NWY5MmMwMjg2M2FjYTA3NGZkNTk3NmM3NTVkMjZiZmYxNjM2NTI5OTE2OWU4NDE1Il0sCiAgICAgICAgIm1vdW50cyI6IFtdLAogICAgICAgICJleGVjX3Byb2Nlc3NlcyI6IFtdLAogICAgICAgICJzaWduYWxzIjogW10sCiAgICAgICAgImFsbG93X2VsZXZhdGVkIjogZmFsc2UsCiAgICAgICAgIndvcmtpbmdfZGlyIjogIi8iCiAgICB9LApdCmFsbG93X3Byb3BlcnRpZXNfYWNjZXNzIDo9IHRydWUKYWxsb3dfZHVtcF9zdGFja3MgOj0gdHJ1ZQphbGxvd19ydW50aW1lX2xvZ2dpbmcgOj0gdHJ1ZQphbGxvd19lbnZpcm9ubWVudF92YXJpYWJsZV9kcm9wcGluZyA6PSB0cnVlCmFsbG93X3VuZW5jcnlwdGVkX3NjcmF0Y2ggOj0gdHJ1ZQoKCm1vdW50X2RldmljZSA6PSB7ICJhbGxvd2VkIiA6IHRydWUgfQp1bm1vdW50X2RldmljZSA6PSB7ICJhbGxvd2VkIiA6IHRydWUgfQptb3VudF9vdmVybGF5IDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CnVubW91bnRfb3ZlcmxheSA6PSB7ICJhbGxvd2VkIiA6IHRydWUgfQpjcmVhdGVfY29udGFpbmVyIDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CmV4ZWNfaW5fY29udGFpbmVyIDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CmV4ZWNfZXh0ZXJuYWwgOj0geyAiYWxsb3dlZCIgOiB0cnVlIH0Kc2h1dGRvd25fY29udGFpbmVyIDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CnNpZ25hbF9jb250YWluZXJfcHJvY2VzcyA6PSB7ICJhbGxvd2VkIiA6IHRydWUgfQpwbGFuOV9tb3VudCA6PSB7ICJhbGxvd2VkIiA6IHRydWUgfQpwbGFuOV91bm1vdW50IDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CmdldF9wcm9wZXJ0aWVzIDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CmR1bXBfc3RhY2tzIDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CnJ1bnRpbWVfbG9nZ2luZyA6PSB7ICJhbGxvd2VkIiA6IHRydWUgfQpsb2FkX2ZyYWdtZW50IDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CnNjcmF0Y2hfbW91bnQgOj0geyAiYWxsb3dlZCIgOiB0cnVlIH0Kc2NyYXRjaF91bm1vdW50IDo9IHsgImFsbG93ZWQiIDogdHJ1ZSB9CnJlYXNvbiA6PSB7ImVycm9ycyI6IGRhdGEuZnJhbWV3b3JrLmVycm9yc30K
   ```

2. Save the changes to your local copy of the ARM template.

## Deploy the template

1. Select the following **Deploy to Azure** button to sign in to Azure and begin an Azure Container Instances deployment.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://ms.portal.azure.com/#create/Microsoft.Template)

1. Choose **Build your own template in the editor**. You'll see a mostly blank template JSON.

   ![Screenshot of Build your own template in the editor button on deployment screen, PNG.](./media/container-instances-confidential-containers-tutorials/confidential-containers-cce-build-template.png)

1. Select **Load file** and upload **template.json**, which you've modified by adding the CCE policy you generated in the previous steps. 

   ![Screenshot of Load file button on template screen, PNG.](./media/container-instances-confidential-containers-tutorials/confidential-containers-cce-load-file.png)

1. Click **Save**. 

1. Select or enter the following values.

   * **Subscription**: select an Azure subscription.
   * **Resource group**: select **Create new**, enter a unique name for the resource group, and then select **OK**.
   * **Location**: select a location for the resource group. Choose a region where the [Confidential SKU is supported](./container-instances-region-availability.md#linux-container-groups). Example: **North Europe**.
   * **Name**: accept the generated name for the instance, or enter a name.
   * **Image**: accept the default image name. This sample Linux image displays a hardware attestation.

   Accept default values for the remaining properties.

   Review the terms and conditions. If you agree, select **I agree to the terms and conditions stated above**.

   ![Screenshot of custom ARM template deployment, PNG.](media/container-instances-confidential-containers-tutorials/confidential-containers-cce-custom-arm-deployment.png)

1. After the instance has been created successfully, you get a notification:

   ![Screenshot of portal notification for successful deployment, PNG.](media/container-instances-confidential-containers-tutorials/confidential-containers-cce-deployment-succeed.png)

The Azure portal is used to deploy the template. In addition to the Azure portal, you can use the Azure PowerShell, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-cli.md).

## Review deployed resources

Use the Azure portal or a tool such as the [Azure CLI](container-instances-quickstart.md) to review the properties of the container instance.

1. In the portal, search for Container Instances, and select the container instance you created.

2. On the **Overview** page, note the **Status** of the instance and its **IP address**.

    ![Screenshot of overview page for container group instance, PNG.](media/container-instances-confidential-containers-tutorials/confidential-containers-cce-portal.png)

3. Once its status is *Running*, navigate to the IP address in your browser. 

    ![Screenshot of browser view of app deployed using Azure Container Instances, PNG.](media/container-instances-confidential-containers-tutorials/confidential-containers-aci-hello-world.png)

    The presence of the attestation report below the Azure Container Instances logo confirms that the container is running on hardware that supports a TEE.
    If you deploy to hardware that does not support a TEE, for example by choosing a region where the ACI Confidential SKU is not available, no attestation report will be shown.

## Next Steps  

Now that you have deployed a confidential container group on ACI, you can learn more about how policies are enforced. 

* [Confidential computing enforcement policies overview](./container-instances-confidential-overview.md)
* [Azure CLI confcom extension examples](https://github.com/Azure/azure-cli-extensions/blob/main/src/confcom/azext_confcom/README.md)
* [Confidential Hello World application](https://aka.ms/ccacihelloworld)
