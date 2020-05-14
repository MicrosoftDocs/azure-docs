# Create a test cluster using the AKS-Engine

To help with testing here are instructions for creating clusters in Azure using AKS-Engine.

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
# Set the local absolute file path of the API model (download this from https://github.com/Azure/aks-engine/blob/master/examples/kubernetes.json)
# For example, "C:\Users\<you>\aks-engine-v0.48.0-windows-amd64\kubernetes.json"
$apimodel = "<file location>"
# You can edit this file to modify the Kubernetes version size of VMs and the number of worker nodes (see example file below).

# Create the cluster
aks-engine deploy --subscription-id $subscriptionId --resource-group $resourceGroupName --client-id $spnAppId  --client-secret $spnAppPassword  --dns-prefix $dnsPrefix --location $location --api-model $apimodel --force-overwrite

# Verify that the cluster was created
# First set KUBECONFIG (AKS-Engine creates this file)
# Example: 'C:\Windows\System32\_output\<resource group name>\kubeconfig\kubeconfig.eastus.json'
$env:KUBECONFIG = <absolute file location>
kubectl cluster-info
```

## Example kubernetes.json file to use for the --api-model

This file has been modified to include the "orchestratorRelease" (Kubernetes 1.17), the "vmSize" set to less expensive VMs, and the "count" of agent pool nodes to 1.

```
{
  "apiVersion": "vlabs",
  "properties": {
    "orchestratorProfile": {
      "orchestratorType": "Kubernetes",
      "orchestratorRelease": "1.17"
    },
    "masterProfile": {
      "count": 1,
      "dnsPrefix": "",
      "vmSize": "Standard_B2s"
    },
    "agentPoolProfiles": [
      {
        "name": "agentpool1",
        "count": 1,
        "vmSize": "Standard_B2s"
      }
    ],
    "linuxProfile": {
      "adminUsername": "azureuser",
      "ssh": {
        "publicKeys": [
          {
            "keyData": ""
          }
        ]
      }
    },
    "servicePrincipalProfile": {
      "clientId": "",
      "secret": ""
    }
  }
}
```
## Next

* Return to the [README](../README.md)
* [Connect a cluster to Azure](./connect-a-cluster.md)
