<properties
   pageTitle="Deploy an Azure Container Service cluster | Microsoft Azure"
   description="Deploy an Azure Container Service cluster by using the Azure portal, the Azure CLI, or PowerShell."
   services="container-service"
   documentationCenter=""
   authors="rgardler"
   manager="timlt"
   editor=""
   tags="acs, azure-container-service"
   keywords="Docker, Containers, Micro-services, Mesos, Azure"/>

<tags
   ms.service="container-service"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="02/16/2016"
   ms.author="rogardle"/>

# Deploy an Azure Container Service cluster

Azure Container Service provides rapid deployment of popular open-source container clustering and orchestration solutions. By using Azure Container Service, you can deploy Marathon Mesos and Docker Swarm clusters with Azure Resource Manager templates or the Azure portal. You deploy these clusters by using Azure Virtual Machine Scale Sets--and the clusters take advantage of Azure networking and storage offerings. To access Azure Container Service, you need an Azure subscription. If you don't have one, then you can sign up for a [free trial](http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=AA4C1C935).

This document walks you through deploying an Azure Container Service cluster by using the [Azure portal](#creating-a-service-using-the-azure-portal), the [Azure command-line interface (CLI)](#creating-a-service-using-the-azure-cli), and the [Azure PowerShell module](#creating-a-service-using-powershell).  

## Create a service by using the Azure portal

To deploy a Mesos or Docker Swarm cluster, select one of the following templates from GitHub. Note that both of these templates are the same, with the exception of the default orchestrator selection.

* [Mesos template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-acs-mesos)
* [Swarm template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-acs-swarm)

When you select the **Deploy to Azure** button on either template page, the Azure portal opens with a form that looks something like this: <br />

![Create deployment by using form](media/create-mesos-params.png)  <br />

Complete the form by using this guidance, and select **OK** when you're done. <br />

Field           | Description
----------------|-----------
DNSNAMEPREFIX   | This must be a world unique value. It will be used to create DNS names for each of the key parts of the service. See more information later in this article.
AGENTCOUNT      | This is the number of virtual machines that will be created in the Azure Container Service agent scale set.
AGENTVMSIZE     | This is the size of your agent virtual machines. Be careful to select a size that provides enough resources to host your largest containers.
ADMINUSERNAME   | This is the user name that will be used for an account on each of the virtual machines and virtual machine scale sets in the Azure Container Service cluster.
ORCHESTRATORTYPE| This is the orchestrator type to use in your Azure Container Service cluster.
MASTERCOUNT     | This is the number of virtual machines to configure as masters for your cluster. You can select 1, but this will not provide any resilience in your cluster--we only recommend it for testing. We recommend 3 or 5 for a production cluster.
SSHRSAPUBLICKEY	| You must use Secure Shell (SSH) for authentication against the virtual machines. This is where you add your public key. It is very important that you're careful when you paste your key value into this box. Some editors will insert line breaks into the content, and this will break the key. Verify that your key has no line breaks, and that it includes the 'ssh-rsa' prefix and the 'username@domain' postfix. It should look something like 'ssh-rsa AAAAB3Nz...SNIPPEDCONTENT...UcyupgH azureuser@linuxvm'. If you need to create an SSH key, you can find guidance for [Windows](../virtual-machines/virtual-machines-linux-ssh-from-windows.md) and [Linux](../virtual-machines/virtual-machines-linux-ssh-from-linux.md) on the Azure documentation site.

After you set appropriate values for your parameters, select
**OK**. Next, provide a resource group name, select a region, and review and agree to the legal terms.

> [AZURE.NOTE] During preview, there is no charge for Azure Container Service. There are only standard compute charges, such as virtual machine, storage, and networking charges.

![Select resource group](media/resourcegroup.png)

Finally, select **Create**. Return to your dashboard. Assuming that you did not clear the **Pin to dashboard** check box on the deployment blade, you will see an animated tile that looks something like this:

![Deploying template tile](media/deploy.png)

Now sit back and relax while the cluster is created. After the cluster is created, you will see some blades that show the resources that make up the Azure Container Service cluster.

![Finished](media/final.png)

## Create a service by using the Azure CLI

To create an instance of Azure Container Service by using the command line, you need an Azure subscription. If you don't have one, then you can sign up for a [free trial](http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=AA4C1C935). You also need to have installed and configured the Azure CLI.

To deploy a Mesos or Docker Swarm cluster, select one of the following templates from GitHub. Note that both of these templates are the same, with the exception of the default orchestrator selection.

* [Mesos template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-acs-mesos)
* [Swarm template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-acs-swarm)

Next, make sure that the Azure CLI has been connected to an Azure subscription. You can do this by using the following command:

```bash
Azure account show
```
If an Azure account is not returned, use the following command to sign the CLI in to Azure.

```bash
azure login -u user@domain.com
```

Next, configure the Azure CLI tools to use Azure Resource Manager.

```bash
azure config mode arm
```

If you want to create your cluster in a new resource group, you must first create the resource group. Use the following command, where `GROUP_NAME` is the name of the resource group that you want to create, and `REGION` is the region where you want to create the resource group:

```bash
azure group create GROUP_NAME REGION
```

After you have created a resource group, you can create your cluster with this command, where:

- **RESOURCE_GROUP** is the name of the resource group that you want to use for this service.
- **DEPLOYMENT_NAME** is the name of this deployment.
- **TEMPLATE_URI** is the location of the deployment file. Note that this must be the RAW file, *not* a pointer to the GitHub UI. To find this URL, select the azuredeploy.json file in GitHub, and select the **RAW** button.

> [AZURE.NOTE] When you run this command, the shell will prompt you for deployment parameter values.

```bash
azure group deployment create RESOURCE_GROUP DEPLOYMENT_NAME --template-uri TEMPLATE_URI
```

### Provide template parameters

This version of the command requires you to define parameters interactively. If you want to provide parameters, such as a JSON-formatted string, you can do so by using the `-p` switch. For example:

 ```bash
azure group deployment create RESOURCE_GROUP DEPLOYMENT_NAME --template-uri TEMPLATE_URI -p '{ "param1": "value1" … }'
 ```

Alternatively, you can provide a JSON-formatted parameters file by using the `-e` switch:

 ```bash
azure group deployment create RESOURCE_GROUP DEPLOYMENT_NAME --template-uri TEMPLATE_URI -e PATH/FILE.JSON
 ```

To see an example parameters file named `azuredeploy.parameters.json`, look for it with the Azure Container Service templates in GitHub.

## Create a service by using PowerShell

You can also deploy an Azure Container Service cluster with PowerShell. This document is based on the version 1.0 [Azure PowerShell module](https://azure.microsoft.com/blog/azps-1-0/).

To deploy a Mesos or Docker Swarm cluster, select one of the following templates. Note that both of these templates are the same, with the exception of the default orchestrator selection.

* [Mesos template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-acs-mesos)
* [Swarm template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-acs-swarm)

Before creating a cluster in your Azure subscription, verify that your PowerShell session has been signed in to Azure. You can do this with the `Get-AzureRMSubscription` command:

```powershell
Get-AzureRmSubscription
```

If you need to sign in to Azure, use the `Login-AzureRMAccount` command:

```powershell
Login-AzureRmAccount
```

If you are deploying to a new resource group, you must first create the resource group. To create a new resource group, use the `New-AzureRmResourceGroup` command, specifying a resource group name and destination region:

```powershell
New-AzureRmResourceGroup -Name GROUP_NAME -Location REGION
```

After you create a resource group, you can create your cluster with the following command. The URI of the desired template will be specified for the `-TemplateUri` parameter. When you run this command, PowerShell will prompt you for deployment parameter values.

```powershell
New-AzureRmResourceGroupDeployment -Name DEPLOYMENT_NAME -ResourceGroupName RESOURCE_GROUP_NAME -TemplateUri TEMPLATE_URI
 ```

### Provide template parameters

If you are familiar with PowerShell, you know that you can cycle through the available parameters for a cmdlet by typing a minus sign (-) and then pressing the TAB key. This same functionality also works with parameters that you define in your template. As soon as you type the template name, the cmdlet fetches the template, parses the parameters, and adds the template parameters to the command dynamically. This makes it very easy to specify the template parameter values. And, if you forget a required parameter value, PowerShell prompts you for the value.

Below is the full command, with parameters included. You can provide your own values for the names of the resources.

```
New-AzureRmResourceGroupDeployment -ResourceGroupName RESOURCE_GROUP_NAME-TemplateURI TEMPLATE_URI -adminuser value1 -adminpassword value2 ....
```

## Next steps

Now that you have a functioning cluster, see these articles for connection and management details.

- [Connect to an Azure Container Service cluster](./container-service-connect.md)
- [Working with Azure Container Service and Mesos](./container-service-mesos-marathon-rest.md)
