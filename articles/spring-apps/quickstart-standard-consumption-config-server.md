# Enable and Disable Spring Cloud Config Server in Azure Spring Apps

**This article applies to:** ✔️ Standard consumption (Preview) ❌ Basic/Standard ❌ Enterprise

Config Server is a centralized configuration service for distributed systems. It uses a pluggable repository layer that currently supports local storage, Git, and Subversion. In this quickstart, you set up the Config Server to get data from a Git repository.

## Prerequisites

- Completion of the previous quickstart in this series: [Provision Standard Consumption Azure Spring Apps service](./quickstart-provision-standard-consumption-service-instance.md).

## Config Server procedures

Enable your Config Server and set up your Config Server with the location of the git repository for the project by running the following command. Replace *\<service instance name>* with the name of the service you created earlier. The default value for service instance name that you set in the preceding quickstart doesn't work with this command.


### Enable the Config Server
```azurecli
az spring config-server enable -n <service instance name>
```

### Set the Config Server
```azurecli
az spring config-server git set -n <service instance name> --uri https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples --search-paths steeltoe-sample/config
```

> [!TIP]
> For information on using a private repository for Config Server, see [Configure a managed Spring Cloud Config Server in Azure Spring Apps](./how-to-config-server.md).


### Disable the Config Server

```azurecli
az spring config-server disable -n <service instance name>
```