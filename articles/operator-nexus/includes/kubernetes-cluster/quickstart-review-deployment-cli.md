After the deployment finishes, you can view the resources using the CLI or the Azure portal.

To view the details of the ```myNexusAKSCluster``` Nexus Kubernetes cluster in the ```myResourceGroup``` resource group, execute the following Azure CLI command:

```azurecli
az networkcloud kubernetescluster show \
  --name myNexusAKSCluster \
  --resource-group myResourceGroup
```

Additionally, to get a list of agent pool names associated with the ```myNexusAKSCluster``` Kubernetes cluster in the ```myResourceGroup``` resource group, you can use the following Azure CLI command, which uses the ```--query``` parameter to return only the agent pool names.

```azurecli
az networkcloud kubernetescluster agentpool list \
  --kubernetes-cluster-name myNexusAKSCluster \
  --resource-group myResourceGroup \
  --output tsv \
  --query '[].name'
```