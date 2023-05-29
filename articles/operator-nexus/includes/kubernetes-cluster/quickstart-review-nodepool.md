> [!NOTE]
> You can add multiple agent pools during the initial creation of your cluster itself by using the initial agent pool configurations. However, if you want to add agent pools after the initial creation, you can utilize the above command to create additional agent pools for your Kubernetes cluster.

The following output example resembles successful creation of the agent pool.

```bash
$ az networkcloud kubernetescluster agentpool list --kubernetes-cluster-name myNexusAKSCluster --resource-group myResourceGroup --output tsv --query '[].name'
myNexusAKSCluster-nodepool-1
myNexusAKSCluster-nodepool-2
```