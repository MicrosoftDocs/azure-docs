# How to configure a custom container on Azure Spring Cloud

This article shows you how to configure a custom container to run on Azure Spring Cloud service.
This guide provides key concepts and instructions for containerization of apps written in any language in Azure Spring Cloud.



## Prerequisites

Before you begin, ensure that your Azure subscription has the required dependencies:

1. [Install Git](https://git-scm.com/)
4. [Install the Azure CLI](/cli/azure/install-azure-cli)
3. [Sign up for an Azure subscription](https://azure.microsoft.com/free/)
4. Push your container image to any docker registry



> [!TIP]
> In the current stage, please ensure your application listens to port 1025. It will be used for all inbound traffic communication.



## Install the Azure CLI extension

Install the Azure Spring Cloud extension for the Azure CLI with the following command

```azurecli
az extension add --name spring-cloud
```



## Provision a service instance using the Azure CLI

Login to the Azure CLI and choose your active subscription. 

```azurecli
az login
az account list -o table
az account set --subscription
```

Create a resource group to contain your Azure Spring Cloud service. You can learn more about [Azure Resource Groups](../azure-resource-manager/management/overview.md).

```azurecli
az group create --location eastus --name <resource group name>
```

Run the following commands to provision an instance of Azure Spring Cloud. Prepare a name for your Azure Spring Cloud service. The name must be between 4 and 32 characters and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.

```azurecli
az spring-cloud create -n <resource name> -g <resource group name>
```

The service instance will take about five minutes to deploy.

Set your default resource group name and Azure Spring Cloud instance name using the following commands:

```azurecli
az configure --defaults group=<service group name>
az configure --defaults spring-cloud=<service instance name>
```



## Create the Azure Spring Cloud application

The following command creates an Azure Spring Cloud application in your subscription.  This creates an empty service to which we can upload our application.

```azurecli
az spring-cloud app create -n <app-name>
```



## Deploy your custom container application

You can deploy your custom container application with images from public or private registries. 

```azurecli
az spring-cloud app deployment create --app <app-name> -n <deployment-name> --registry-server-url <repo-url e.g. "docker.io" or "xxx.azurecr.io"> --container-image-name <image-name e.g. nodejsapp:v1> --username <username-of-private-repo> --password <password-of-private-repo> --command <list-of-commands> --args <list-of-args>

```



> [!TIP]
>
> This table summarizes and compares the field names used by Docker and Custom Container.
>
> | Description                         | Docker field name | Custom Container field name |
> | ----------------------------------- | ----------------- | --------------------------- |
> | The command run by the container    | Entrypoint        | command                     |
> | The arguments passed to the command | Cmd               | args                        |
>
> When you override the default Entrypoint and Cmd, these rules apply:
>
> - If you do not supply `command` or `args` for a Custom Container, the defaults defined in the Docker image are used.
> - If you supply a `command` but no `args` for a Custom Container, only the supplied `command` is used. The default EntryPoint and the default Cmd defined in the Docker image are ignored.
> - If you supply only `args` for a Custom Container, the default Entrypoint defined in the Docker image is run with the `args` that you supplied.
> - If you supply a `command` and `args`, the default Entrypoint and the default Cmd defined in the Docker image are ignored. Your `command` is run with your `args`.
>
> Here are some examples:
>
> | Image Entrypoint | Image Cmd   | Custom Container command | Custom Container args | Command run      |
> | ---------------- | ----------- | ------------------------ | --------------------- | ---------------- |
> | `[/ep-1]`        | `[foo bar]` | <not set>                | <not set>             | `[ep-1 foo bar]` |
> | `[/ep-1]`        | `[foo bar]` | `[/ep-2]`                | <not set>             | `[ep-2]`         |
> | `[/ep-1]`        | `[foo bar]` | <not set>                | `[zoo boo]`           | `[ep-1 zoo boo]` |
> | `[/ep-1]`        | `[foo bar]` | `[/ep-2]`                | `[zoo boo]`           | `[ep-2 zoo boo]` |



## Streaming logs in real time

Use the following command to get real time logs from the App to verify the app is running as expected.

```azurecli
az spring-cloud app logs -n hello-world -s <service instance name> -g <resource group name> --lines 100 -f
```

