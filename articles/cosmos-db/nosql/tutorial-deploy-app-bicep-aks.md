---
title: 'Tutorial: Deploy an ASP.NET web application using Azure Cosmos DB for NoSQL, managed identity, and Azure Kubernetes Service via Bicep'
description: Learn how to deploy an ASP.NET MVC web application with Azure Cosmos DB for NoSQL, managed identity, and Azure Kubernetes Service by using Bicep.
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: tutorial-develop, mvc, devx-track-azurecli, devx-track-bicep, build-2023, build-2023-dataai
author: sandnair
ms.author: sandnair
ms.topic: tutorial
ms.date: 10/17/2022
---

# Tutorial: Deploy an ASP.NET web application by using Azure Cosmos DB for NoSQL, managed identity, and AKS via Bicep

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

In this tutorial, you'll deploy a reference ASP.NET web application on an Azure Kubernetes Service (AKS) cluster that connects to Azure Cosmos DB for NoSQL.

[Azure Cosmos DB](../introduction.md) is a fully managed distributed database platform for modern application development with NoSQL or relational databases.

[AKS](../../aks/intro-kubernetes.md) is a managed Kubernetes service that helps you quickly deploy and manage clusters.

> [!IMPORTANT]
> - This article requires the latest version of the Azure CLI. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli). If you're using Azure Cloud Shell, the latest version is already installed.
> - This article also requires the latest version of the Bicep CLI within the Azure CLI. For more information, see [Install Bicep tools](../../azure-resource-manager/bicep/install.md#azure-cli).
> - If you're running the commands in this tutorial locally instead of in Azure Cloud Shell, ensure that you use an administrator account.

## Prerequisites

The following tools are required to compile the ASP.NET web application and create its container image:

- [Docker Desktop](https://docs.docker.com/desktop/)
- [Visual Studio Code](https://code.visualstudio.com/)
  - [C# extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)
  - [Docker extension for Visual Studio Code](https://code.visualstudio.com/docs/containers/overview)
  - [Azure Account extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account)

## Overview

This tutorial uses an [infrastructure as code (IaC)](/devops/deliver/what-is-infrastructure-as-code) approach to deploy the resources to Azure. You'll use [Bicep](../../azure-resource-manager/bicep/overview.md), which is a new declarative language that offers the same capabilities as [Azure Resource Manager templates](../../azure-resource-manager/templates/overview.md). However, Bicep includes a syntax that's more concise and easier to use.

The Bicep modules will deploy the following Azure resources within the targeted subscription scope:

- A [resource group](../../azure-resource-manager/management/overview.md#resource-groups) to organize the resources
-  A [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for authentication
- A [container registry](../../container-registry/container-registry-intro.md) for storing container images
- An [AKS](../../aks/intro-kubernetes.md) cluster
- A [virtual network](../../virtual-network/network-overview.md) for configuring AKS
- An [Azure Cosmos DB for NoSQL account](../introduction.md), along with a database, a container, and the [SQL role](/cli/azure/cosmosdb/sql/role)
- A [key vault](../../key-vault/general/overview.md) to store secure keys
- (Optional) A [Log Analytics workspace](../../azure-monitor/logs/log-analytics-overview.md)

This tutorial uses the following security best practices with Azure Cosmos DB:

- Implement access control by using [role-based access control (RBAC)](../../role-based-access-control/overview.md) and a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md). These features eliminate the need for developers to manage secrets, credentials, certificates, and keys for secure communication between services.
- Limit Azure Cosmos DB access to the AKS subnet by [configuring a virtual network service endpoint](../how-to-configure-vnet-service-endpoint.md).
- Set `disableLocalAuth = true` in the `databaseAccount` resource to [enforce RBAC as the only authentication method](../how-to-setup-rbac.md#disable-local-auth).

> [!TIP]
> The steps in this tutorial use [Azure Cosmos DB for NoSQL](./quickstart-dotnet.md). However, you can apply the same concepts to [Azure Cosmos DB for MongoDB](../mongodb/introduction.md).

## Download the Bicep modules

Download or [clone](https://docs.github.com/repositories/creating-and-managing-repositories/cloning-a-repository) the Bicep modules from the *Bicep* folder of the [azure-samples/cosmos-aks-samples](https://github.com/Azure-Samples/cosmos-aks-samples/tree/main/Bicep) GitHub repository:

```bash
git clone https://github.com/Azure-Samples/cosmos-aks-samples.git

cd Bicep/
```

## Connect to your Azure subscription

Use [az login](/cli/azure/authenticate-azure-cli) to connect to your default Azure subscription:

```azurecli
az login
```

Optionally, use [az account set](/cli/azure/account#az-account-set) with the name or ID of a specific subscription to set the active subscription if you have multiple subscriptions:

```azurecli
az account set \
  --subscription <subscription-id>
```

## Initialize the deployment parameters

Create a *param.json* file by using the JSON in the following example. Replace the `{resource group name}`, `{Azure Cosmos DB account name}`, and `{Azure Container Registry instance name}` placeholders with your own values.

> [!IMPORTANT]
> All resource names that you use in the following code should comply with the [naming rules and restrictions for Azure resources](../../azure-resource-manager/management/resource-name-rules.md). Also ensure that the placeholder values are replaced consistently and match the values in *param.json*.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "rgName": {
      "value": "{resource group name}"
    },    
    "cosmosName" :{
      "value": "{Azure Cosmos DB account name}"
    },
    "acrName" :{
      "value": "{Azure Container Registry instance name}"
    }
  }
}
```

## Create a Bicep deployment

Set shell variables by using the following commands. Replace the `{deployment name}` and `{location}` placeholders with your own values.

```bash
deploymentName='{deployment name}'  # Name of the deployment
location='{location}' # Location for deploying the resources
```

Within the *Bicep* folder, use [az deployment sub create](/cli/azure/deployment/sub#az-deployment-sub-create) to deploy the template to the current subscription scope:

```azurecli
az deployment sub create \
  --name $deploymentName \
  --location $location \
  --template-file main.bicep \
  --parameters @param.json
```

During deployment, the console will output a message indicating that the deployment is still running:

```output
 / Running ..
```

The deployment could take 20 to 30 minutes. After provisioning is completed, the console will output JSON with `Succeeded` as the provisioning state:

```output
      }
    ],
    "provisioningState": "Succeeded",
    "templateHash": "0000000000000000",
    "templateLink": null,
    "timestamp": "2022-01-01T00:00:00.000000+00:00",
    "validatedResources": null
  },
  "tags": null,
  "type": "Microsoft.Resources/deployments"
}
```

You can also see the deployment status in the resource group:

:::image type="content" source="./media/tutorial-deploy-app-bicep-aks/deployed-resource-group.png" lightbox="./media/tutorial-deploy-app-bicep-aks/deployed-resource-group.png" alt-text="Screenshot of the deployment status for the resource group in the Azure portal.":::

> [!NOTE]
> When you create an AKS cluster, a second resource group is automatically created to store the AKS resources. For more information, see [Why are two resource groups created with AKS?](../../aks/faq.md#why-are-two-resource-groups-created-with-aks).

## Link Azure Container Registry with AKS

Use the following commands to link your Azure Container Registry instance with AKS. Replace the `{Azure Container Registry instance name}` and `{resource group name}` placeholders with your own values.

```bash
acrName='{Azure Container Registry instance name}'
rgName='{resource group name}'
aksName=$rgName'aks'
```

Run [az aks update](/cli/azure/aks#az-aks-update) to attach the existing Azure Container Registry resource with the AKS cluster:

```azurecli
az aks update \
  --resource-group $rgName \
  --name $aksName \
  --attach-acr $acrName
```

## Connect to the AKS cluster

To manage a Kubernetes cluster, you use [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), the Kubernetes command-line client. If you use Azure Cloud Shell, `kubectl` is already installed. To install `kubectl` locally, use [az aks install-cli](/cli/azure/aks#az-aks-install-cli):

```azurecli
az aks install-cli
```

To configure `kubectl` to connect to your Kubernetes cluster, use [az aks get-credentials](/cli/azure/aks#az-aks-get-credentials). This command downloads credentials and configures the Kubernetes CLI to use them.

```azurecli
az aks get-credentials \
  --resource-group $rgName \
  --name $aksName
```

## Connect the AKS pods to Azure Key Vault

Azure Active Directory (Azure AD) pod-managed identities use AKS primitives to associate managed identities for Azure resources and identities in Azure AD with pods. You'll use these identities to grant access to the Azure Key Vault Provider for Secrets Store CSI Driver.

Use the following command to find the values of the tenant ID (`homeTenantId`):

```azurecli
az account show
```

Use the following YAML template to create a *secretproviderclass.yml* file. Replace the `{Tenant Id}` and `{resource group name}` placeholders with your own values. Also ensure that the value for `{resource group name}` matches the value in *param.json*. 

```yml
# This is a SecretProviderClass example that uses aad-pod-identity to access the key vault
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: azure-kvname-podid
spec:
  provider: azure
  parameters:
    usePodIdentity: "true"               
    keyvaultName: "{resource group name}kv"       # Replace resource group name. Bicep generates the key vault name.
    tenantId: "{Tenant Id}"              # The tenant ID of your account. Use the 'homeTenantId' attribute value from  the 'az account show' command output.
```

## Apply the SecretProviderClass to the AKS cluster

Use [kubectl apply](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) to install the Secrets Store CSI Driver by using the YAML:

```bash
kubectl apply \
  --filename secretproviderclass.yml
```

## Build the ASP.NET web application

Download or clone the web application's source code from the *Application* folder of the [azure-samples/cosmos-aks-samples](https://github.com/Azure-Samples/cosmos-aks-samples/tree/main/Application) GitHub repository:

```bash
git clone https://github.com/Azure-Samples/cosmos-aks-samples.git

cd Application/
```

Open the *Application* folder in Visual Studio Code. Run the application by using either the F5 key or the **Debug: Start Debugging** command.

## Push the Docker container image to Azure Container Registry

1. To create a container image from the **Explorer** tab in Visual Studio Code, right-click **Dockerfile**, and then select **Build Image**. 

    :::image type="content" source="./media/tutorial-deploy-app-bicep-aks/context-menu-build-docker-image.png" alt-text="Screenshot of the context menu in Visual Studio Code with the Build Image option selected.":::

1. In the prompt that asks for the name and version to tag the image, enter the name **todo:latest**.

1. Use the **Docker** pane to push the built image to Azure Container Registry. You'll find the built image under the **Images** node. Open the **todo** node, right-click **latest**, and then select **Push**.

    :::image type="content" source="./media/tutorial-deploy-app-bicep-aks/context-menu-push-docker-image.png" alt-text="Screenshot of the context menu in Visual Studio Code with the Push option selected.":::

1. In the prompts, select your Azure subscription, Azure Container Registry resource, and image tags. The image tag format should be `{acrname}.azurecr.io/todo:latest`.

1. Wait for Visual Studio Code to push the container image to Azure Container Registry.

## Prepare the deployment YAML

Use the following YAML template to create an *akstododeploy.yml* file. Replace the `{ACR name}`, `{Image name}`, `{Version}`, and `{resource group name}` placeholders with your own values.

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo
  labels:
    aadpodidbinding: "cosmostodo-apppodidentity"
    app: todo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: todo
  template:
    metadata:
      labels:
        app: todo
        aadpodidbinding: "cosmostodo-apppodidentity"
    spec:
      containers:
      - name: mycontainer
        image: "{ACR name}/{Image name}:{Version}"   # Update per your environment; for example, myacrname.azurecr.io/todo:latest. Do not add https:// in ACR Name.
        ports:
        - containerPort: 80
        env:
        - name: KeyVaultName
          value: "{resource group name}kv"       # Replace resource group name. Key Vault name is generated by Bicep.
      nodeSelector:
        kubernetes.io/os: linux
      volumes:
        - name: secrets-store01-inline
          csi:
            driver: secrets-store.csi.k8s.io
            readOnly: true
            volumeAttributes:
              secretProviderClass: "azure-kvname-podid"       
---
    
kind: Service
apiVersion: v1
metadata:
  name: todo
spec:
  selector:
    app: todo
    aadpodidbinding: "cosmostodo-apppodidentity"    
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
```

## Apply the deployment YAML

Use `kubectl apply` again to deploy the application pods and expose the pods via a load balancer:

```bash
kubectl apply \
  --filename akstododeploy.yml \
  --namespace 'my-app'
```

## Test the application

When the application runs, a Kubernetes service exposes the application's front end to the internet. This process can take a few minutes to complete.

Use [kubectl get](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) to view the external IP that the load balancer exposes:

```bash
kubectl get services \
  --namespace "my-app"
```

To access the application, open the IP address that you received as output in a browser.

## Clean up the resources

To avoid Azure charges, clean up unneeded resources when you no longer need the cluster. Use [az group delete](/cli/azure/group#az-group-delete) and [az deployment sub delete](/cli/azure/deployment/sub#az-deployment-sub-delete) to delete the resource group and subscription deployment, respectively:

```azurecli
az group delete \
  --resource-group $rgName 
  --yes

az deployment sub delete \
  --name $deploymentName
```

## Next steps

- Learn how to [develop a web application with Azure Cosmos DB](./tutorial-dotnet-web-app.md).
- Learn how to [query Azure Cosmos DB for NoSQL](./tutorial-query.md).
- Learn how to [upgrade your cluster](../../aks/tutorial-kubernetes-upgrade-cluster.md).
- Learn how to [scale your cluster](../../aks/tutorial-kubernetes-scale.md).
- Learn how to [enable continuous deployment](../../aks/deployment-center-launcher.md).
