---
title: "GitHub Actions & Azure Kubernetes Service"
titleSuffix: Azure Dev Spaces
author: zr-msft
services: azure-dev-spaces
ms.service: azure-dev-spaces
ms.author: zarhoads
ms.date: 10/24/2019
ms.topic: conceptual
description: "Review and test changes from a pull request directly in Azure Kubernetes Service using GitHub Actions and Azure Dev Spaces."
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, GitHub Actions, Helm, service mesh, service mesh routing, kubectl, k8s"
manager: gwallace
---
# GitHub Actions & Azure Kubernetes Service (preview)

Azure Dev Spaces provides a workflow using GitHub Actions that allows you to test changes from a pull request directly in AKS before the pull request is merged into your repository’s main branch. Having a running application to review changes of a pull request can increase the confidence of both the developer as well as team members. This running application can also help team members such as, product managers and designers, become part of the review process during early stages of development.

In this guide, you will learn how to:

- Set up Azure Dev Spaces on a managed Kubernetes cluster in Azure.
- Deploy a large application with multiple microservices to a dev space.
- Set up CI/CD with GitHub actions.
- Test a single microservice in an isolated dev space within the context of the full application.

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA).

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- [Azure CLI installed][azure-cli-installed].
- [Helm 2.13 or greater installed][helm-installed].
- A GitHub Account with [GitHub Actions enabled][github-actions-beta-signup].

## Create an Azure Kubernetes Service cluster

You must create an AKS cluster in a [supported region][supported-regions]. The below commands create a resource group called *MyResourceGroup* and an AKS cluster called *MyAKS*.

```cmd
az group create --name MyResourceGroup --location eastus
az aks create -g MyResourceGroup -n MyAKS --location eastus --disable-rbac --generate-ssh-keys
```

## Enable Azure Dev Spaces on your AKS cluster

Use the `use-dev-spaces` command to enable Dev Spaces on your AKS cluster and follow the prompts. The below command enables Dev Spaces on the *MyAKS* cluster in the *MyResourceGroup* group and creates a dev space called *dev*.

> [!NOTE]
> The `use-dev-spaces` command will also install the Azure Dev Spaces CLI if its not already installed. You cannot install the Azure Dev Spaces CLI in the Azure Cloud Shell.

```cmd
az aks use-dev-spaces -g MyResourceGroup -n MyAKS --space dev --yes
```

## Create an Azure Container Registry

Create an Azure Container Registry (ACR):

```cmd
az acr create --resource-group MyResourceGroup --name <acrName> --sku Basic
```

> [!IMPORTANT]
> The name your ACR must be unique within Azure and contain 5-50 alphanumeric characters. Any letters you use must be lower case.

Save the *loginServer* value from the output because it is used in a later step.

## Create a service principal for authentication

Use [az ad sp create-for-rbac][az-ad-sp-create-for-rbac] to create a service principal. For example:

```cmd
az ad sp create-for-rbac --sdk-auth --skip-assignment
```

Save the JSON output because it is used in a later step.


Use [az aks show][az-aks-show] to display the *id* of your AKS cluster:

```cmd
az aks show -g MyResourceGroup -n MyAKS  --query id
```

Use [az acr show][az-acr-show] to display the *id* of the ACR:

```cmd
az acr show --name <acrName> --query id
```

Use [az role assignment create][az-role-assignment-create] to give *Contributor* access to your AKS cluster and *AcrPush* access to your ACR.

```cmd
az role assignment create --assignee <ClientId> --scope <AKSId> --role Contributor
az role assignment create --assignee <ClientId>  --scope <ACRId> --role AcrPush
```

> [!IMPORTANT]
> You must be the owner of both your AKS cluster and ACR in order to give your service principal access to those resources.

## Get sample application code

In this article, you use the [Azure Dev Spaces Bike Sharing sample application][bike-sharing-gh] to demonstrate using Azure Dev Spaces with GitHub actions.

Fork the Azure Dev Spaces sample repository then navigate to your forked repository. Click on the *Actions* tab and choose to enable actions for this repository.

Clone your forked repository and navigate into its directory:

```cmd
git clone https://github.com/USERNAME/dev-spaces
cd dev-spaces/samples/BikeSharingApp/
```

## Retrieve the HostSuffix for *dev*

Use the `azds show-context` command to show the HostSuffix for *dev*.

```cmd
$ azds show-context

Name                ResourceGroup     DevSpace  HostSuffix
------------------  ----------------  --------  -----------------------
MyAKS               MyResourceGroup   dev       fedcab0987.eus.azds.io
```

## Update the Helm chart with your HostSuffix

Open [charts/values.yaml][bike-sharing-values-yaml] and replace all instances of `<REPLACE_ME_WITH_HOST_SUFFIX>` with the HostSuffix value you retrieved earlier. Save your changes and close the file.

## Run the sample application in Kubernetes

The commands for running the sample application on Kubernetes are part of an existing process and have no dependency on Azure Dev Spaces tooling. In this case, Helm is the tooling used to run this sample application but other tooling could be used to run your entire application in a namespace within a cluster. The Helm commands are targeting the dev space named *dev* you created earlier, but this dev space is also a Kubernetes namespace. As a result, dev spaces can be targeted by other tooling the same as other namespaces.

You can use Azure Dev Spaces for development after an application is running in a cluster regardless of the tooling used to deploy it.

Use the `helm init` and `helm install` commands to set up and install the sample application on your cluster.

```cmd
cd charts/
helm init --wait
helm install -n bikesharing . --dep-up --namespace dev --atomic
```

> [!Note]
> **If you are using an RBAC-enabled cluster**, be sure to configure [a service account for Tiller][tiller-rbac]. Otherwise, `helm` commands will fail.

The `helm install` command may take several minutes to complete. The output of the command shows the status of all the services it deployed to the cluster when completed:

```cmd
$ cd charts/
$ helm init --wait
...
Happy Helming!

$ helm install -n bikesharing . --dep-up --namespace dev --atomic

Hang tight while we grab the latest from your chart repositories...
...
NAME               READY  UP-TO-DATE  AVAILABLE  AGE
bikes              1/1    1           1          4m32s
bikesharingweb     1/1    1           1          4m32s
billing            1/1    1           1          4m32s
gateway            1/1    1           1          4m32s
reservation        1/1    1           1          4m32s
reservationengine  1/1    1           1          4m32s
users              1/1    1           1          4m32s
```

After the sample application is installed on your cluster and since you have Dev Spaces enabled on your cluster, use the `azds list-uris` command to display the URLs for the sample application in *dev* that is currently selected.

```cmd
$ azds list-uris
Uri                                                 Status
--------------------------------------------------  ---------
http://dev.bikesharingweb.fedcab0987.eus.azds.io/  Available
http://dev.gateway.fedcab0987.eus.azds.io/         Available
```

Navigate to the *bikesharingweb* service by opening the public URL from the `azds list-uris` command. In the above example, the public URL for the *bikesharingweb* service is `http://dev.bikesharingweb.fedcab0987.eus.azds.io/`. Select *Aurelia Briggs (customer)* as the user, then select a bike to rent. Verify you see a placeholder image for the bike.

## Configure your GitHub action

Navigate to your forked repository and click *Settings*. Click on *Secrets* in the left sidebar. Click *Add a new secret* to add each new secret below:

1. *AZURE_CREDENTIALS*: the entire output from the service principal creation.
1. *RESOURCE_GROUP*: the resource group for your AKS cluster, which in this example is *MyResourceGroup*.
1. *CLUSTER_NAME*: the name of your AKS cluster, which in this example is *MyAKS*.
1. *CONTAINER_REGISTRY*: the *loginServer* for the ACR.
1. *HOST*: the host for your Dev Space, which takes the form *<MASTER_SPACE>.<APP_NAME>.<HOST_SUFFIX>*, which in this example is *dev.bikesharingweb.fedcab0987.eus.azds.io*.
1. *IMAGE_PULL_SECRET*: the name of the secret you wish to use, for example *demo-secret*.
1. *MASTER_SPACE*: the name of your parent Dev Space, which in this example is *dev*.
1. *REGISTRY_USERNAME*: the *clientId* from the JSON output from the service principal creation.
1. *REGISTRY_PASSWORD*: the *clientSecret* from the JSON output from the service principal creation.

> [!NOTE]
> All of these secrets are used by the GitHub action and are configured in [.github/workflows/bikes.yml][github-action-yaml].

## Create a new branch for code changes

Navigate back to `BikeSharingApp/` and create a new branch called *bike-images*.

```cmd
cd ..
git checkout -b bike-images
```

Edit [Bikes/server.js][bikes-server-js] to remove lines 232 and 233:

```javascript
    // Hard code image url *FIX ME*
    theBike.imageUrl = "/static/logo.svg";
```

The section should now look like:

```javascript
    var theBike = result;
    theBike.id = theBike._id;
    delete theBike._id;
```

Save the file then use `git add` and `git commit` to stage your changes.

```cmd
git add Bikes/server.js 
git commit -m "Removing hard coded imageUrl from /bikes/:id route"
```

## Push your changes

Use `git push` to push your new branch to your forked repository:

```cmd
git push origin bike-images
```

After the push is complete, navigate to your forked repository on GitHub create a pull request with the *master* in your forked repository as the base branch compared to the *bike-images* branch.

After your pull request is opened, navigate to the *Actions* tab. Verify a new action has started and is building the *Bikes* service.

## View the child space with your changes

After the action has completed, you will see a comment with a URL to your new child space based the changes in the pull request.

> [!div class="mx-imgBorder"]
> ![GitHub Action Url](../media/github-actions/github-action-url.png)

Navigate to the *bikesharingweb* service by opening the URL from the comment. Select *Aurelia Briggs (customer)* as the user, then select a bike to rent. Verify you no longer see the placeholder image for the bike.

## Clean up your Azure resources

```cmd
az group delete --name MyResourceGroup --yes --no-wait
```

## Next steps

Learn how Azure Dev Spaces helps you develop more complex applications across multiple containers, and how you can simplify collaborative development by working with different versions or branches of your code in different spaces.

> [!div class="nextstepaction"]
> [Team development in Azure Dev Spaces][team-quickstart]

[azure-cli-installed]: /cli/azure/install-azure-cli?view=azure-cli-latest
[az-ad-sp-create-for-rbac]: /cli/azure/ad/sp#az-ad-sp-create-for-rbac
[az-acr-show]: /cli/azure/acr#az-acr-show
[az-aks-show]: /cli/azure/aks?view=azure-cli-latest#az-aks-show
[az-role-assignment-create]: /cli/azure/role/assignment#az-role-assignment-create
[bikes-server-js]: https://github.com/Azure/dev-spaces/blob/master/samples/BikeSharingApp/Bikes/server.js#L232-L233
[bike-sharing-gh]: https://github.com/Azure/dev-spaces/
[bike-sharing-values-yaml]: https://github.com/Azure/dev-spaces/blob/master/samples/BikeSharingApp/charts/values.yaml
[github-actions-beta-signup]: https://github.com/features/actions
[github-action-yaml]: https://github.com/Azure/dev-spaces/blob/master/.github/workflows/bikes.yml
[github-action-bikesharing-yaml]: https://github.com/Azure/dev-spaces/blob/master/.github/workflows/bikesharing.yml
[helm-installed]: https://helm.sh/docs/using_helm/#installing-helm
[tiller-rbac]: https://helm.sh/docs/using_helm/#role-based-access-control
[supported-regions]: ../about.md#supported-regions-and-configurations
[sp-acr]: ../../container-registry/container-registry-auth-service-principal.md
[sp-aks]: ../../aks/kubernetes-service-principal.md
[team-quickstart]: ../quickstart-team-development.md