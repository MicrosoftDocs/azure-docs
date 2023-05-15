Now that the Azure Nexus Kubernetes cluster has been successfully created and connected to Azure Arc, you can connect to it using ```kubectl```, the Kubernetes command-line client. To connect, you need to download the cluster's credentials and configure kubectl to use them.

For the specific steps to connect to an Azure Arc-connected Kubernetes cluster, refer [how to connect to an Azure Arc-enabled Kubernetes cluster](../../../azure-arc/kubernetes/cluster-connect.md).

This documentation provides a detailed, step-by-step guide to help you connect to your cluster. It includes instructions on how to install the necessary Azure CLI extensions, retrieve your cluster's credentials, and configure kubectl.

Remember, whenever you interact with the cluster, you should make sure that you have the correct permissions and that the cluster is running. If you encounter any issues, refer to the troubleshooting section of the Azure Arc documentation or contact Azure support.