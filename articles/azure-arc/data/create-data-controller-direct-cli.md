---

title: Create Azure Arc data controller | Direct connect mode
description: Explains how to create the data controller in direct connect mode. 
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 05/27/2022
ms.topic: overview
---

#  Create Azure Arc data controller in direct connectivity mode using CLI

This article describes how to create the Azure Arc data controller in direct connectivity mode using Azure CLI. 

## Complete prerequisites

Before you begin, verify that you have completed the prerequisites in [Deploy data controller - direct connect mode - prerequisites](create-data-controller-direct-prerequisites.md).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../../includes/azure-cli-prepare-your-environment-no-header.md)]

## Deploy Arc data controller

Creating an Azure Arc data controller in direct connectivity mode involves the following steps:

1. Create an Azure Arc-enabled data services extension.
1. Create a custom location.
1. Create the data controller.

You can create them individually or in a unified experience. 

## Deploy - unified experience

In the unified experience, you can create the Arc data controller extension, custom location, and Arc data controller all in one command as follows: 


##### [Linux](#tab/linux)

```console
## variables for Azure subscription, resource group, cluster name, location, extension, and namespace.
export resourceGroup=<Your resource group>
export clusterName=<name of your connected Kubernetes cluster>
export customLocationName=<name of your custom location>

## variables for logs and metrics dashboard credentials
export AZDATA_LOGSUI_USERNAME=<username for Kibana dashboard>
export AZDATA_LOGSUI_PASSWORD=<password for Kibana dashboard>
export AZDATA_METRICSUI_USERNAME=<username for Grafana dashboard>
export AZDATA_METRICSUI_PASSWORD=<password for Grafana dashboard>
```

##### [Windows (PowerShell)](#tab/windows)

``` PowerShell
## variables for Azure location, extension and namespace
$ENV:resourceGroup="<Your resource group>"
$ENV:clusterName="<name of your connected Kubernetes cluster>"
$ENV:customLocationName="<name of your custom location>" 

## variables for Metrics and Monitoring dashboard credentials
$ENV:AZDATA_LOGSUI_USERNAME="<username for Kibana dashboard>"
$ENV:AZDATA_LOGSUI_PASSWORD="<password for Kibana dashboard>"
$ENV:AZDATA_METRICSUI_USERNAME="<username for Grafana dashboard>"
$ENV:AZDATA_METRICSUI_PASSWORD="<password for Grafana dashboard>"
```

--- 

Deploy the Azure Arc data controller using released profile
##### [Linux](#tab/linux)

```azurecli
az arcdata dc create -name <name> -g ${resourceGroup} --custom-location ${customLocationName} --cluster-name ${clusterName} --connectivity-mode direct --profile-name <the-deployment-profile> --auto-upload-metrics true --auto-upload-logs true --storage-class <storageclass>

# Example
az arcdata dc create --name arc-dc1 --resource-group my-resource-group ----custom-location cl-name --connectivity-mode direct --profile-name azure-arc-aks-premium-storage  --auto-upload-metrics true --auto-upload-logs true --storage-class mystorageclass
```

##### [Windows (PowerShell)](#tab/windows)

```azurecli
az arcdata dc create -name <name> -g $ENV:resourceGroup --custom-location $ENV:customLocationName --cluster-name $ENV:clusterName --connectivity-mode direct --profile-name <the-deployment-profile> --auto-upload-metrics true --auto-upload-logs true --storage-class <storageclass>

# Example
az arcdata dc create --name arc-dc1 --g $ENV:resourceGroup --custom-location $ENV:customLocationName --cluster-name $ENV:clusterName --connectivity-mode direct --profile-name azure-arc-aks-premium-storage  --auto-upload-metrics true --auto-upload-logs true --storage-class mystorageclass

```

---
If you want to create the Azure Arc data controller using a custom configuration template, follow the steps described in [Create custom configuration profile](create-custom-configuration-template.md) and provide the path to the file as follows:
##### [Linux](#tab/linux)

```azurecli
az arcdata dc create --name  -g ${resourceGroup} --custom-location ${customLocationName} --cluster-name ${clusterName} --connectivity-mode direct --path ./azure-arc-custom --auto-upload-metrics true --auto-upload-logs true

# Example
az arcdata dc create --name arc-dc1 --resource-group my-resource-group ----custom-location cl-name --connectivity-mode direct --path ./azure-arc-custom  --auto-upload-metrics true --auto-upload-logs true
```

##### [Windows (PowerShell)](#tab/windows)

```azurecli
az arcdata dc create --name <name> -g $ENV:resourceGroup --custom-location $ENV:customLocationName --cluster-name $ENV:clusterName --connectivity-mode direct --path ./azure-arc-custom  --auto-upload-metrics true --auto-upload-logs true --storage-class <storageclass>

# Example
az arcdata dc create --name arc-dc1 --resource-group $ENV:resourceGroup --custom-location $ENV:customLocationName --cluster-name $ENV:clusterName --connectivity-mode direct --path ./azure-arc-custom --auto-upload-metrics true --auto-upload-logs true --storage-class mystorageclass

```

---

## Deploy - individual experience
 
### Step 1: Create an Azure Arc-enabled data services extension

Use the k8s-extension CLI to create a data services extension.

#### Set environment variables

Set the following environment variables, which will be then used in later steps.

Following are two sets of environment variables. The first set of variables identifies your Azure subscription, resource group, cluster name, location, extension, and namespace. The second defines credentials to access the metrics and logs dashboards.

The environment variables include passwords for log and metric services. The passwords must be at least eight characters long and contain characters from three of the following four categories: Latin uppercase letters, Latin lowercase letters, numbers, and non-alphanumeric characters.


##### [Linux](#tab/linux)

```console
## variables for Azure subscription, resource group, cluster name, location, extension, and namespace.
export subscription=<Your subscription ID>
export resourceGroup=<Your resource group>
export clusterName=<name of your connected Kubernetes cluster>
export location=<Azure location>
export adsExtensionName="<extension name>" 
export namespace="<namespace>"
## variables for logs and metrics dashboard credentials
export AZDATA_LOGSUI_USERNAME=<username for Kibana dashboard>
export AZDATA_LOGSUI_PASSWORD=<password for Kibana dashboard>
export AZDATA_METRICSUI_USERNAME=<username for Grafana dashboard>
export AZDATA_METRICSUI_PASSWORD=<password for Grafana dashboard>
```

##### [Windows (PowerShell)](#tab/windows)

``` PowerShell
## variables for Azure location, extension and namespace
$ENV:subscription="<Your subscription ID>"
$ENV:resourceGroup="<Your resource group>"
$ENV:clusterName="<name of your connected Kubernetes cluster>"
$ENV:location="<Azure location>"
$ENV:adsExtensionName="<name of Data controller extension" 
$ENV:namespace="<namespace where you will deploy the extension and data controller>"
## variables for Metrics and Monitoring dashboard credentials
$ENV:AZDATA_LOGSUI_USERNAME="<username for Kibana dashboard>"
$ENV:AZDATA_LOGSUI_PASSWORD="<password for Kibana dashboard>"
$ENV:AZDATA_METRICSUI_USERNAME="<username for Grafana dashboard>"
$ENV:AZDATA_METRICSUI_PASSWORD="<password for Grafana dashboard>"
```

--- 

#### Create the Arc data services extension

The following command creates the Arc data services extension.

##### [Linux](#tab/linux)

```azurecli
az k8s-extension create --cluster-name ${clusterName} --resource-group ${resourceGroup} --name ${adsExtensionName} --cluster-type connectedClusters --extension-type microsoft.arcdataservices --auto-upgrade false --scope cluster --release-namespace ${namespace} --config Microsoft.CustomLocation.ServiceAccount=sa-arc-bootstrapper
az k8s-extension show --resource-group ${resourceGroup} --cluster-name ${resourceName} --name ${adsExtensionName} --cluster-type connectedclusters
```

##### [Windows (PowerShell)](#tab/windows)

```azurecli
az k8s-extension create --cluster-name $ENV:clusterName --resource-group $ENV:resourceGroup --name $ENV:adsExtensionName --cluster-type connectedClusters --extension-type microsoft.arcdataservices --auto-upgrade false --scope cluster --release-namespace $ENV:namespace --config Microsoft.CustomLocation.ServiceAccount=sa-arc-bootstrapper
az k8s-extension show --resource-group $ENV:resourceGroup --cluster-name $ENV:clusterName --name $ENV:adsExtensionName --cluster-type connectedclusters
```

---

##### Deploy Azure Arc data services extension using private container registry and credentials

Use the below command if you are deploying from your private repository:

```azurecli
az k8s-extension create --cluster-name "<connected cluster name>" --resource-group "<resource group>" --name "<extension name>" --cluster-type connectedClusters --extension-type microsoft.arcdataservices --scope cluster --release-namespace "<namespace>" --config Microsoft.CustomLocation.ServiceAccount=sa-arc-bootstrapper --config imageCredentials.registry=<registry info> --config imageCredentials.username=<username> --config systemDefaultValues.image=<registry/repo/arc-bootstrapper:<imagetag>> --config-protected imageCredentials.password=$ENV:DOCKER_PASSWORD --debug
```

For example:

```azurecli
az k8s-extension create --cluster-name "my-connected-cluster" --resource-group "my-resource-group" --name "arc-data-services" --cluster-type connectedClusters --extension-type microsoft.arcdataservices --scope cluster --release-namespace "arc" --config Microsoft.CustomLocation.ServiceAccount=sa-bootstrapper --config imageCredentials.registry=mcr.microsoft.com --config imageCredentials.username=arcuser --config systemDefaultValues.image=mcr.microsoft.com/arcdata/arc-bootstrapper:latest --config-protected imageCredentials.password=$ENV:DOCKER_PASSWORD --debug
```


> [!NOTE]
> The Arc data services extension install can take a few minutes to complete.

#### Verify the Arc data services extension is created

You can verify the status of the deployment of Azure Arc-enabled data services extension. Use the Azure portal or Cube

##### Check status from Azure portal

1. Log in to the Azure portal and browse to the resource group where the Kubernetes connected cluster resource is located.
1. Select the Azure Arc-enabled Kubernetes cluster (Type = "Kubernetes - Azure Arc") where the extension was deployed.
1. In the navigation on the left side, under **Settings**, select **Extensions**.
1. The portal shows the extension that was created earlier in an installed state.

##### Check status using kubectl CLI

1. Connect to your Kubernetes cluster via a Terminal window.
1. Run the below command and ensure:
   -  The namespace mentioned above is created 

    and 

   - The `bootstrapper` pod state is **running** before proceeding to the next step.

   ``` console
   kubectl get pods --name <name of namespace used in the json template file above>
   ```

For example, the following example gets the pods from `arc` namespace.

```console
#Example:
kubectl get pods --name arc
```

### Retrieve the managed identity and grant roles

When the Arc data services extension is created, Azure creates a managed identity. You need to assign certain roles to this managed identity for usage and/or metrics to be uploaded. 

#### Retrieve managed identity of the Arc data controller extension

```azurecli
$Env:MSI_OBJECT_ID = (az k8s-extension show --resource-group <resource group>  --cluster-name <connectedclustername> --cluster-type connectedClusters --name <name of extension> | convertFrom-json).identity.principalId
#Example
$Env:MSI_OBJECT_ID = (az k8s-extension show --resource-group myresourcegroup  --cluster-name myconnectedcluster --cluster-type connectedClusters --name ads-extension | convertFrom-json).identity.principalId
```

#### Assign role to the managed identity

Run the below command to assign the **Contributor** and **Monitoring Metrics Publisher** roles:

```azurecli
az role assignment create --assignee $Env:MSI_OBJECT_ID --role "Contributor" --scope "/subscriptions/$ENV:subscription/resourceGroups/$ENV:resourceGroup"
az role assignment create --assignee $Env:MSI_OBJECT_ID --role "Monitoring Metrics Publisher" --scope "/subscriptions/$ENV:subscription/resourceGroups/$ENV:resourceGroup"
```

### Step 2: Create a custom location using `customlocation` CLI extension

A custom location is an Azure resource that is equivalent to a namespace in a Kubernetes cluster.  Custom locations are used as a target to deploy resources to or from Azure. Learn more about custom locations in the [Custom locations on top of Azure Arc-enabled Kubernetes documentation](../kubernetes/conceptual-custom-locations.md).

#### Set environment variables

##### [Linux](#tab/linux)

```azurecli
export clName=mycustomlocation
export hostClusterId=$(az connectedk8s show --resource-group ${resourceGroup} --name ${clusterName} --query id -o tsv)
export extensionId=$(az k8s-extension show --resource-group ${resourceGroup} --cluster-name ${clusterName} --cluster-type connectedClusters --name ${adsExtensionName} --query id -o tsv)
az customlocation create --resource-group ${resourceGroup} --name ${clName} --namespace ${namespace} --host-resource-id ${hostClusterId} --cluster-extension-ids ${extensionId} --location ${location}
```

##### [Windows (PowerShell)](#tab/windows)

```azurecli
$ENV:clName="mycustomlocation"
$ENV:hostClusterId=(az connectedk8s show --resource-group $ENV:resourceGroup --name $ENV:clusterName --query id -o tsv)
$ENV:extensionId=(az k8s-extension show --resource-group $ENV:resourceGroup --cluster-name $ENV:clusterName --cluster-type connectedClusters --name $ENV:adsExtensionName --query id -o tsv)
az customlocation create --resource-group $ENV:resourceGroup --name $ENV:clName --namespace $ENV:namespace --host-resource-id $ENV:hostClusterId --cluster-extension-ids $ENV:extensionId
```

---

### Validate  the custom location is created

From the terminal, run the below command to list the custom locations, and validate that the **Provisioning State** shows Succeeded:

```azurecli
az customlocation list -o table
```

### Create certificates for logs and metrics UI dashboards

Optionally, you can specify certificates for logs and metrics UI dashboards. See [Provide certificates for monitoring](monitor-certificates.md) for examples. The December, 2021 release introduces this option.

### Step 3: Create the Azure Arc data controller

After the extension and custom location are created, proceed to deploy the Azure Arc data controller as follows.

```azurecli
az arcdata dc create --name <name> --resource-group <resourcegroup> --location <location> --connectivity-mode direct --profile-name <profile name>  --auto-upload-metrics true --custom-location <name of custom location> --storage-class <storageclass>
# Example
az arcdata dc create --name arc-dc1 --resource-group my-resource-group --location eastasia --connectivity-mode direct --profile-name azure-arc-aks-premium-storage  --auto-upload-metrics true --custom-location mycustomlocation --storage-class mystorageclass
```

If you want to create the Azure Arc data controller using a custom configuration template, follow the steps described in [Create custom configuration profile](create-custom-configuration-template.md) and provide the path to the file as follows:


```azurecli
az arcdata dc create --name <name> --resource-group <resourcegroup> --location <location> --connectivity-mode direct --path ./azure-arc-custom --auto-upload-metrics true --custom-location <name of custom location>
# Example
az arcdata dc create --name arc-dc1 --resource-group my-resource-group --location eastasia --connectivity-mode direct --path ./azure-arc-custom --auto-upload-metrics true --custom-location mycustomlocation
```

## Monitor the status of Azure Arc data controller deployment

The deployment status of the Arc data controller on the cluster can be monitored as follows:

```console
kubectl get datacontrollers --namespace arc
```

## Next steps

[Create an Azure Arc-enabled PostgreSQL server](create-postgresql-server.md)

[Create an Azure SQL managed instance on Azure Arc](create-sql-managed-instance.md)
