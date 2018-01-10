## Create a service principal

Azure Active Directory *service principals* provide secure access to Azure resources within your subscription. Think of a service principal as a user identity for a service, where "service" is any application, service, or platform that needs access to the resources (for example, a Kubernetes cluster).

You can configure a service principal with access rights scoped only to those resources you specify. Then, you can configure your application or service to use the service principal's credentials to access those resources.

### Service principals and Azure Container Registry

In the context of Azure Container Registry, you can create an Azure service principal with pull, push and pull, or owner permissions to your private Docker registry in Azure.

```azurecli
# create SP
```

```azurecli
# assign role
```