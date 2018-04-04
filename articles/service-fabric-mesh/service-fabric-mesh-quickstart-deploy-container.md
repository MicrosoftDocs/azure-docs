---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Intent and product brand in a unique string of 43-59 chars including spaces - do not include site identifier (it is auto-generated.)
description: 115-145 characters including spaces. Edit the intro para describing article intent to fit here. This abstract displays in the search result.
services: Azure SeaBreeze
keywords: Don’t add or edit keywords without consulting your SEO champ.
author: david-stanford
ms.author: dastanfo
ms.date: 04/05/2018
ms.topic: quickstart
ms.service: service-fabric-mesh
manager: timlt
---
# Service fabric mesh: deploy a container

Service fabric mesh makes it easy to create and manage Docker containers in Azure, without having to provision virtual machines. In this quickstart, you create a container in Azure and expose it to the internet. This operation is completed in a single command. Within just a few seconds, you'll see this in your browser:

## ADD Final product image

To read more about applications and service fabric mesh, head over to the [service fabric mesh Overview](./service-fabric-mesh-overview.md)

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete this quickstart. If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.27 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0][azure-cli-install].

## Create a resource group

Create a resource group (RG) to deploy the application to. Alternatively, you can use an existing RG and skip this step.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Deploy the container

Create your application using the following deployment command:

```azurecli-interactive
az sbz deployment create --resource-group myResourceGroup --template-uri https://seabreezequickstart.blob.core.windows.net/quickstart/application-quickstart.json

```

In a few seconds, your command should return with "provisioningState": "Succeeded" . Given below is the output from the command when using [Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview). 

## Check application deployment status

At this point, your application has been deployed. You can check to see its status by using the `app show` command. This command is useful, if you wanted to followup on a application deployment.

The application name for our quickstart application is SbzVoting, so let us fetch its details.

```azurecli-interactive
az sbz app show --resource-group myResourceGroup --name SbzVoting
```

## Browse to the application

Once the application status is returned as ""provisioningState": "Succeeded", we need the ingress endpoint of the service, so let us query the network resource, so get IP address to the container where the service is deployed, and open it on a browser.

The network resource for our quickstart application is SbzVotingNetwork, so let us fetch its details.

```azurecli-interactive
az sbz network show --resource-group myResourceGroup --name SbzVotingNetwork
```

The command should now return, with information like the screen shot below when running the command in [Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview).
From the output, copy the IP address .
![ingress]

For example, my service end point IP is 13.90.141.214 and I just open the URL - http://13.90.141.214:80 in your favorite browser.

You can now add voting options to the application and vote on it, or delete the voting options.

## Quick review of the quick start application details

For a detailed review of this quick start application and its source code, go to the [Samples includes in the Repo](https://github.com/Azure/seabreeze-preview-pr/tree/master/samples) folder.

Let us quickly review the [Application-quickstart.Json](https://seabreezequickstart.blob.core.windows.net/quickstart/application-quickstart.json)

This application has two Services : VotingWeb  and VotingData . They are marked by the red boxes in the picture below.

Let us now review the VotingWeb service. Its code package is in a container called "VotingWeb.Code". The container details are  marked by the red boxes in the picture below.

## See all the application you have currently deployed to your subscription

You can use the "app list" command to get a list of applications you have deployed to your subscription.

```cli
az sbz app list -o table
```

## See the application logs

For this preview, we have not enabled the ability for you to pump the logs, events and performance counters to azure storage for later diagnostics. That functionality will be enabled as we progress along towards public preview.

For each codepackage (container) in your service instance, you can check its status as well as the logs coming from the containers in the service.

Check the logs for each container instance in a CGS. In this example, we are going to fetch the logs from the container VotingWeb.Code, which is in the first replica of the service VotingWeb

```azurecli-interactive
az sbz container logs --resource-group myResourceGroup --application-name SbzVoting --service-name VotingWeb --replica-name 0 --code-package-name VotingWeb.Code
```

## Clean up resources

When you are ready to delete the application run the following command.

```azurecli-interactive
az sbz app delete --resource-group myResourceGroup
```

If you no longer need any of the resources you created in this quickstart, you can execute the [az group delete][az-group-delete] command to remove the resource group and all resources it contains. This command deletes the container registry you created, as well as the running container, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

A brief sentence with a link surrounded by the blue box

Advance to the next article to learn more
> [!div class="nextstepaction"]
> [Next steps button](contribute-get-started-mvc.md)

<!-- Images -->

<!-- Links / Internal -->
[az-group-delete]: /cli/azure/group#az_group_delete
[azure-cli-install]: /cli/azure/install-azure-cli