---
title: Tutorial - Use Microsoft.Identity.Web library to leverage workload identity with an application on Azure Kubernetes Service (AKS)
description: In this Azure Kubernetes Service (AKS) tutorial, you deploy an Azure Kubernetes Service cluster and configure an application to use a workload identity with Microsoft.Identity.Web.
ms.topic: tutorial
ms.custom: devx-track-azurecli
ms.date: 05/31/2023
---

# Tutorial: Use Microsoft.Identity.Web library to leverage workload identity with an application on Azure Kubernetes Service (AKS)

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage Kubernetes clusters. In this tutorial, will:

* Deploy an AKS cluster using the Azure CLI with OpenID Connect (OIDC) Issuer and managed identity.
* Create an Azure Key Vault and secret.
* Create an Azure Active Directory (Azure AD) workload identity and Kubernetes service account.
* Configure the managed identity for token federation.
* Deploy the workload and verify authentication with the workload identity.

## Before you begin

* This tutorial assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].
* If you aren't familiar with Azure AD workload identity, see the [Azure AD workload identity overview][workload-identity-overview].
* When you create an AKS cluster, a second resource group is automatically created to store the AKS resources. For more information, see [Why are two resource groups created with AKS?][aks-two-resource-groups].

## Prerequisites

* [!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]
* This article requires version 2.47.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
* The identity you use to create your cluster must have the appropriate minimum permissions. For more information on access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)][aks-identity-concepts].
* If you have multiple Azure subscriptions, select the appropriate subscription ID in which the resources should be billed using the [`az account`][az-account] command.

## Create a resource group

An [Azure resource group][azure-resource-group] is a logical group in which Azure resources are deployed and managed. When you create a resource group, you're prompted to specify a location. This location is the storage location of your resource group metadata and where your resources run in Azure if you don't specify another region during resource creation.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

* Create a resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    ```

    The following output example resembles successful creation of the resource group:

    ```json
    {
      "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup",
      "location": "eastus",
      "managedBy": null,
      "name": "myResourceGroup",
      "properties": {
        "provisioningState": "Succeeded"
      },
      "tags": null
    }
    ```

## Export environmental variables

To help simplify steps to configure the identities required, the steps below define environmental variables for reference on the cluster.

* Create these variables using the following commands. Replace the default values for `RESOURCE_GROUP`, `LOCATION`, `SERVICE_ACCOUNT_NAME`, `SUBSCRIPTION`, `USER_ASSIGNED_IDENTITY_NAME`, and `FEDERATED_IDENTITY_CREDENTIAL_NAME`.

    ```bash
    export RESOURCE_GROUP="myResourceGroup"
    export LOCATION="westcentralus"
    export SERVICE_ACCOUNT_NAMESPACE="default"
    export SERVICE_ACCOUNT_NAME="workload-identity-sa"
    export SUBSCRIPTION="$(az account show --query id --output tsv)"
    export USER_ASSIGNED_IDENTITY_NAME="myIdentity"
    export FEDERATED_IDENTITY_CREDENTIAL_NAME="myFedIdentity"
    export KEYVAULT_NAME="azwi-kv-tutorial"
    export KEYVAULT_SECRET_NAME="my-secret"
    ```

## Create an AKS cluster

1. Create an AKS cluster using the [`az aks create`][az-aks-create] command with the `--enable-oidc-issuer` parameter to use the OIDC Issuer.

    ```azurecli-interactive
    az aks create -g "${RESOURCE_GROUP}" -n myAKSCluster --node-count 1 --enable-oidc-issuer --enable-workload-identity --generate-ssh-keys
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

2. Get the OIDC Issuer URL and save it to an environmental variable using the following command. Replace the default value for the arguments `-n`, which is the name of the cluster.

    ```azurecli-interactive
    export AKS_OIDC_ISSUER="$(az aks show -n myAKSCluster -g "${RESOURCE_GROUP}" --query "oidcIssuerProfile.issuerUrl" -otsv)"
    ```

## Create a managed identity

1. Set a specific subscription as the current active subscription using the [`az account set`][az-account-set] command.

    ```azurecli-interactive
    az account set --subscription "${SUBSCRIPTION}"
    ```

2. Create a managed identity using the [`az identity create`][az-identity-create] command.

    ```azurecli-interactive
    az identity create --name "${USER_ASSIGNED_IDENTITY_NAME}" --resource-group "${RESOURCE_GROUP}" --location "${LOCATION}" --subscription "${SUBSCRIPTION}"
    ```

### Create Kubernetes service account

1. Create a Kubernetes service account and annotate it with the client ID of the managed identity created in the previous step using the [`az aks get-credentials`][az-aks-get-credentials] command. Replace the default value for the cluster name and the resource group name.

    ```azurecli-interactive
    az aks get-credentials -n myAKSCluster -g "${RESOURCE_GROUP}"
    ```

2. Copy the following multi-line input into your terminal and run the command to create the service account.

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      annotations:
        azure.workload.identity/client-id: ${USER_ASSIGNED_CLIENT_ID}
      labels:
        azure.workload.identity/use: "true"
      name: ${SERVICE_ACCOUNT_NAME}
      namespace: ${SERVICE_ACCOUNT_NAMESPACE}
    EOF
    ```

    The following output resembles successful creation of the identity:

    ```output
    Serviceaccount/workload-identity-sa created
    ```

## Establish federated identity credential

* Create the federated identity credential between the managed identity, service account issuer, and subject using the [`az identity federated-credential create`][az-identity-federated-credential-create] command.

    ```azurecli-interactive
    az identity federated-credential create --name ${FEDERATED_IDENTITY_CREDENTIAL_NAME} --identity-name ${USER_ASSIGNED_IDENTITY_NAME} --resource-group ${RESOURCE_GROUP} --issuer ${AKS_OIDC_ISSUER} --subject system:serviceaccount:${SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}
    ```

    > [!NOTE]
    > It takes a few seconds for the federated identity credential to propagate after it's initially added. If a token request is immediately available after adding the federated identity credential, you may experience failure for a couple minutes, as the cache is populated in the directory with old data. To avoid this issue, you can add a slight delay after adding the federated identity credential.

## Create a .NET Core Web API that leverages IdWeb and calls Microsoft Graph downstream using workload identity federation

1. Create a new project, select ASP.NET Core Web API
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/asp-net-webapi-create-project.png" alt-text="Screenshot showing how to create ASP.NET Core Web API project.":::
2. Give a project name, location and configure your project
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/asp-net-webapi-configure-project.png" alt-text="Screenshot showing how to configure ASP.NET Core Web API project.":::
3. Pick 'Microsoft Identity Platform' from 'Authentication type' dropdown, check 'Enable Docker' option and Keep 'Linux' as 'Docker OS'
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/asp-net-webapi-additional-info.png" alt-text="Screenshot showing adding additional info for ASP.NET Core Web API project.":::
4. MsIdentity tool pops up automatically
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/asp-net-webapi-required-components.png" alt-text="Screenshot showing required components for ASP.NET Core Web API project.":::
5. Pick your tenant and register a new application
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/asp-net-webapi-register-app.png" alt-text="Screenshot showing how to register the app.":::
6. Check 'Add Microsoft Graph Permissions'
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/asp-net-webapi-add-graph.png" alt-text="Screenshot showing how to add graph for downstream app.":::
7. You can find the appsettings.json file created as below
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/asp-net-webapi-appsettings.png" alt-text="Screenshot showing Web API appsettings.":::
8. Update the appsettings.json file with 'Client Credentials' section as shown below
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/asp-net-webapi-appsettings-client-creds.png" alt-text="Screenshot showing updating Web API appsettings.":::

### Create federated credential for the Web API in Azure portal

1. Go to 'App registrations' and select the Web API
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/azure-portal-app-registrations.png" alt-text="Screenshot showing app registrations in Azure portal.":::
2. Go to 'Certificates & Secrets' section, open 'Federated credentials' tab and click on 'Add credential'
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/azure-portal-certs.png" alt-text="Screenshot showing how to add Federated credential.":::
3. Select 'Kubernetes accessing Azure resources' from the drop down
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/azure-portal-kubernetes-creds.png" alt-text="Screenshot showing picking Federated credential scenario.":::
4. Get the cluster issuer URL using below command

    ```azurecli-interactive
    az aks show -n myAKSCluster -g "${RESOURCE_GROUP}" --query "oidcIssuerProfile.issuerUrl" -otsv
    ```

5. Provide the cluster issuer URL, service account name, namespace and add the credential
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/azure-portal-cred-info.png" alt-text="Screenshot showing adding details for Federated credential.":::

## Create a .NET Core Web App that calls the Web API

1. Create a new project, select ASP.NET Core Web App.
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/asp-net-webapp-create-project.png" alt-text="Screenshot showing how to create ASP.NET Core Web App project.":::
2. Give a project name, location and configure your project.
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/asp-net-webapp-configure-project.png" alt-text="Screenshot showing how to configure ASP.NET Core Web App project.":::
3. Pick 'Microsoft Identity Platform' from 'Authentication type' dropdown.
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/asp-net-webapp-additional-info.png" alt-text="Screenshot showing adding additional info for ASP.NET Core Web App project.":::
4. MsIdentity tool pops up automatically.
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/asp-net-webapi-required-components.png" alt-text="Screenshot showing required components for ASP.NET Core Web App project.":::
5. Pick your tenant and register a new application.
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/asp-net-webapi-register-app.png" alt-text="Screenshot showing how to register the app.":::
6. Check 'Add permissions to another API' and select the Web API created in previous section.
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/asp-net-webapp-add-webapi.png" alt-text="Screenshot showing how to add a downstream Web API.":::
7. You can find the appsettings.json file created as below.
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/asp-net-webapp-appsettings.png" alt-text="Screenshot showing Web App appsettings.":::

In Azure portal for the Web API make sure Microsoft Graph is granted admin consent. For Web App, make sure the Web API is granted admin consent.
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/app-portal-settings.png" alt-text="Screenshot showing API permissions in Azure portal.":::

## Create a Azure Container Registry(ACR)

1. Right click on the Web API project and select publish.
2. Select 'Docker Container Registry'.
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/create-publish-profile.png" alt-text="Screenshot showing selecting type of publish profile.":::

3. Select 'Azure Container Registry'.
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/select-acr.png" alt-text="Screenshot showing selection of Azure container registry for the publish profile.":::

4. Select your subscription from the dropdown and create a new instance.
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/create-acr-instance.png" alt-text="Screenshot showing creation of Azure container registry.":::

## Publish application image to ACR

1. Right click on the Web API project and select publish.
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/publish-to-acr.png" alt-text="Screenshot showing publishing an app from Visual Studio.":::
2. Once is publish is completes, you should see a publish succeeded message.
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/acr-publish-success.png" alt-text="Screenshot showing publish succeeded message.":::

## Attach the ACR to the AKS cluster

Use the following command to attach the ACR to the AKS. Replace the default value for the cluster name and the resource group name.

```azurecli-interactive
# Attach using acr-name
az aks update -n myAKSCluster -g "${RESOURCE_GROUP}" --attach-acr <acr-name>

# Attach using acr-resource-id
az aks update -n myAKSCluster -g "${RESOURCE_GROUP}" --attach-acr <acr-resource-id>
 ```

## Deploy the workload

1. Deploy a pod that references the service account created in the previous step using the following command. Replace the values for acr-name, image-name and image-tag.

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: Pod
    metadata:
    name: weather-forecast-app-preview
    namespace: ${SERVICE_ACCOUNT_NAMESPACE}
    labels:
        app: weatherforecast-aks-preview
        component: weatherforecast-app-preview
        azure.workload.identity/use: "true"
    spec:
    serviceAccountName: ${SERVICE_ACCOUNT_NAME}
    containers:
      image: <acr-name>.azurecr.io/<image-name>:<image-tag>
      name: weatherforecast-webapi-preview
    ports:
      containerPort: 80
    EOF
    ```

    The following output resembles successful creation of the pod:

    ```output
    pod/weather-forecast-app-preview created
    ```

2. Deploy a service with the app created in the pod.

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: Service
    metadata:
    labels:
    app: weatherforecast-aks-preview
    name: weatherforecast-aks-preview
    spec:
    ports:
      port: 8080
      protocol: TCP
      targetPort: 80
    selector:
    app: weatherforecast-aks-preview
    component: weatherforecast-app-preview
    type: LoadBalancer
    EOF
    ```

    The following output resembles successful creation of the pod:

    ```output
    service/weatherforecast-aks-preview created
    ```

3. Check whether the pod and service are running.

    ```bash
    kubectl get all
    ```

    The following output shows the status of the pod, service and provides the external IP of the service:

    ```output
    NAME                               READY   STATUS    RESTARTS   AGE
    pod/weather-forecast-app-preview   1/1     Running   0          12d

    NAME                                  TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)          AGE
    service/kubernetes                    ClusterIP      10.0.0.1      <none>        443/TCP          22d
    service/weatherforecast-aks-preview   LoadBalancer   10.0.127.18   13.83.1.248   8080:30604/TCP   12d
    ```

## Call Web API running on AKS from Web App that's running locally

1. Update BaseUrl in the appsettings.json file of Web App to the external-ip of the service running on AKS.
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/asp-net-webapp-appsettings-update-baseurl.png" alt-text="Screenshot showing updating Web App appsettings.":::
2. Run the Web App.
3. You should see the weatherforecast results.
:::image type="content" source="media/tutorial-kubernetes-workload-identity-IdWeb/webapp-call-webapi.png" alt-text="Screenshot showing results of Web Appcalling Web API.":::

## Clean up resources

You may wish to leave these resources in place. If you no longer need these resources, use the following commands to delete them.

1. Delete the pod using the `kubectl delete pod` command.

    ```bash
    kubectl delete pod weather-forecast-app-preview
    ```

2. Delete the pod using the `kubectl delete service` command.

    ```bash
    kubectl delete service weatherforecast-aks-preview
    ```

3. Delete the service account using the `kubectl delete sa` command.

    ```bash
    kubectl delete sa "${SERVICE_ACCOUNT_NAME}" --namespace "${SERVICE_ACCOUNT_NAMESPACE}"
    ```

4. Delete the Azure resource group and all its resources using the [`az group delete`][az-group-delete] command.

    ```azurecli-interactive
    az group delete --name "${RESOURCE_GROUP}"
    ```

## Next steps

In this tutorial, you deployed a Kubernetes cluster and deployed a simple container application to test working with an Azure AD workload identity.

This tutorial is for introductory purposes. For guidance on a creating full solutions with AKS for production, see [AKS solution guidance][aks-solution-guidance].

<!-- EXTERNAL LINKS -->

<!-- INTERNAL LINKS -->
[kubernetes-concepts]: ../concepts-clusters-workloads.md
[aks-identity-concepts]: ../concepts-identity.md
[az-account]: /cli/azure/account
[azure-resource-group]: ../../azure-resource-manager/management/overview.md
[az-group-create]: /cli/azure/group#az-group-create
[az-group-delete]: /cli/azure/group#az-group-delete
[az-aks-create]: /cli/azure/aks#az-aks-create
[aks-two-resource-groups]: ../faq.md#why-are-two-resource-groups-created-with-aks
[az-account-set]: /cli/azure/account#az-account-set
[az-identity-create]: /cli/azure/identity#az-identity-create
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-identity-federated-credential-create]: /cli/azure/identity/federated-credential#az-identity-federated-credential-create
[aks-solution-guidance]: /azure/architecture/reference-architectures/containers/aks-start-here
[workload-identity-overview]: ../../active-directory/workload-identities/workload-identities-overview.md
