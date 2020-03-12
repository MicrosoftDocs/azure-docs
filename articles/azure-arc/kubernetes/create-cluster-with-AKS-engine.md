# Create a test cluster using the AKS-Engine

To help you with testing here are instructions for creating clusters in Azure using AKS-Engine.

## Install AKS-Engine on your client machine

Follow these instructions to [install the AKS-Engine](https://github.com/Azure/aks-engine/blob/master/docs/tutorials/deploy.md).

## Create a cluster

The following assumes that you have also [enabled providers](./enable-providers.md) and [installed the Azure CLI](./install-cli-extension.md) on your client machine.

```console
# Login to az and set Azure subscription
$subscriptionId = '<the guid for the Azure subscription you are using>'
az login
az account set --subscription $subscriptionId

# Create a service principal in this subscription and capture the properties that are output
az ad sp create-for-rbac --skip-assignment

# Copy spn property values here 
$spnAppId = "<client id guid>"
$spnAppPassword = "<client secret guid>"

# Assign the spn to the Contributor role on the subscription (need permissions to create cluster resources in the subscription)
az role assignment create --role Contributor --assignee $spnAppId --scope '/subscriptions/<subscriptionId>'

# Set the Azure location for the cluster. Supported locations during preview are (eastus, westeurope).
$location = 'eastus'
# Set the name for the resource group that will be created by the AKS Engine. The name must be unique within the subscription.
$resourceGroupName = "<unique name>" 
$dnsPrefix = $resourceGroupName
# Set the local absolute file path of the API model (this was installed in your client machine during install of AKS-Engine)
# For example, "C:\Users\<you>\aks-engine-v0.41.5-windows-amd64\kubernetes.json"
$apimodel = "<file location>"

# Create the cluster
aks-engine deploy --subscription-id $subscriptionId --resource-group $resourceGroupName --client-id $spnAppId  --client-secret $spnAppPassword  --dns-prefix $dnsPrefix --location $location --api-model $apimodel --force-overwrite

# Verify that the cluster was created
# First set KUBECONFIG (AKS-Engine creates this file)
# Example: 'C:\Windows\System32\_output\<resource group name>\kubeconfig\kubeconfig.eastus.json'
$env:KUBECONFIG = <absolute file location>
kubectl cluster-info
```

## Next

* Return to the [README](../README.md)
* [Connect a cluster to Azure](./connect-a-cluster.md)
