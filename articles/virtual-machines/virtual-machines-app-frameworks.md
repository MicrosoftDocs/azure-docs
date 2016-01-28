<properties
   pageTitle="Deploy popular applications using templates | Microsoft Azure"
   description="Create popular workloads by using Azure Resource Manager templates to install applications such as Active Directory, Docker, and many more."
   services="virtual-machines"
   documentationCenter="virtual-machines"
   authors="squillace"
   manager="timlt"
   editor=""
   tags="azure-resource-manager" />

<tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="infrastructure"
   ms.date="10/21/2015"
   ms.author="rasquill"/>

# Deploy applications by using templates

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.

Workloads usually require many resources to function according to design. Azure Resource Manager templates make it possible for you to not only define how applications are configured, but also how the resources are deployed to support configured applications. This article introduces you to the most popular templates in the gallery and gives you information for using the Azure portal, Azure PowerShell, or Azure CLI to deploy them.

From this table you can find more information about the parameters that are used in the template, you can inspect the template before you deploy it, or you can deploy the template directly from the Azure portal.

| Technology | Description | Learn more | View the template | Deploy it now |
|:---|:---|:---:|:---:|
| Active Directory | Deploys two new VMs (along with a new virtual network, storage account, and load balancer) and creates a new Active Directory forest and domain. Each VM is created as a DC for the new domain and placed in an availability set and has an RDP endpoint added with a public load-balanced IP address. | [Gallery](https://azure.microsoft.com/en-us/documentation/templates/active-directory-new-domain-ha-2-dc/) | [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/active-directory-new-domain-ha-2-dc) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Factive-directory-new-domain-ha-2-dc%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Apache | Deploys an Apache web server on an Ubuntu VM. | [Gallery](https://azure.microsoft.com/en-us/documentation/templates/apache2-on-ubuntu-vm/) | [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/apache2-on-ubuntu-vm) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fapache2-on-ubuntu-vm%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a>
| Couchbase | Deploys a Couchbase cluster on Ubuntu virtual machines. | [Gallery](https://azure.microsoft.com/en-us/documentation/templates/couchbase-on-ubuntu/) | [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/couchbase-on-ubuntu) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fcouchbase-on-ubuntu%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| DataStax | Deploys a DataStax cluster on Ubuntu VMs. | [Gallery](https://azure.microsoft.com/en-us/documentation/templates/datastax-on-ubuntu/) | [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/datastax-on-ubuntu) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fdatastax-on-ubuntu%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Django | Deploys a Django application on an Ubuntu VM. It does a silent install of Python and Apache. | [Gallery](https://azure.microsoft.com/en-us/documentation/templates/django-app/) | [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/django-app) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fdjango-app%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Docker | Deploys an Ubuntu VM with Docker and three Docker containers pulled directly from Docker Hub and deployed via Docker Compose. | [Gallery](https://azure.microsoft.com/en-us/documentation/templates/docker-simple-on-ubuntu/) | [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/docker-simple-on-ubuntu) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fdocker-simple-on-ubuntu%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Elasticsearch | Deploys an Elasticsearch cluster on Ubuntu VMs and uses template linking to create data node scale units. | [Gallery](https://azure.microsoft.com/en-us/documentation/templates/elasticsearch/) | [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/elasticsearch) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Felasticsearch%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Jenkins | Deploys a Jenkins master node on an Ubuntu VM and multiple Jenkins slave nodes on two additional VMs. | [Gallery](https://azure.microsoft.com/en-us/documentation/templates/jenkins-on-ubuntu/) | [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/jenkins-on-ubuntu) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fjenkins-on-ubuntu%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Kafka | Deploys a Kafka cluster on Ubuntu VMs with a publicly accessible VM that you can use to SSH into the Kafka nodes for diagnostics or troubleshooting purposes. | [Gallery](https://azure.microsoft.com/en-us/documentation/templates/kafka-ubuntu-multidisks/) | [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/kafka-on-ubuntu) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%kafka-on-ubuntu%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| LAMP | Deploys a LAMP application by creating an Ubuntu VM, doing a silent install of MySQL, Apache, and PHP, and then creating a simple PHP script. | [Gallery](https://azure.microsoft.com/en-us/documentation/templates/lamp-app/) | [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/lamp-app) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Flamp-app%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| MongoDB | Deploys MongoDB on an Ubuntu VM. | [Gallery](https://azure.microsoft.com/en-us/documentation/templates/mongodb-on-ubuntu/) | [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/mongodb-on-ubuntu) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fmongodb-on-ubuntu%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Redis | Deploys a Redis cluster on Ubuntu virtual machines with a publicly accessible VM that you can use to SSH into the Redis nodes for diagnostics or troubleshooting purposes. | [Gallery](https://azure.microsoft.com/en-us/documentation/templates/redis-high-availability/) | [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/redis-high-availability) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fredis-high-availability%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| SharePoint | Deploys three Azure VMs, each with a public IP address, a load balancer, and a virtual network. It configures one VM to be an Active Directory DC for a new forest and domain, one with SQL Server domain joined, and the third with a SharePoint farm and site. | [Gallery](https://azure.microsoft.com/en-us/documentation/templates/sharepoint-three-vm/) | [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/sharepoint-three-vm) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsharepoint-three-vm%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Spark | Deploys a Spark cluster on Ubuntu virtual machines with a publicly accessible VM that you can use to SSH into the Spark nodes for diagnostics or troubleshooting purposes. | [Gallery](https://azure.microsoft.com/en-us/documentation/templates/spark-ubuntu-multidisks/) | [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/spark-ubuntu-multidisks) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fspark-ubuntu-multidisks%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| Tomcat | Deploys OpenJDK and Tomcat on an Ubuntu VM. | [Gallery](https://azure.microsoft.com/en-us/documentation/templates/openjdk-tomcat-ubuntu-vm/) | [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/openjdk-tomcat-ubuntu-vm) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fopenjdk-tomcat-ubuntu-vm%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| WordPress | Deploys a LAMP stack to a single Ubuntu VM and then installs and initializes WordPress. | [Gallery](https://azure.microsoft.com/en-us/documentation/templates/wordpress-single-vm-ubuntu/) | [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/wordpress-single-vm-ubuntu) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fwordpress-single-vm-ubuntu%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |
| ZooKeeper | Deploys a three-node ZooKeeper cluster on Ubuntu VMs. | [Gallery](https://azure.microsoft.com/en-us/documentation/templates/zookeeper-cluster-ubuntu-vm/) | [GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/zookeeper-cluster-ubuntu-vm) | <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fzookeeper-cluster-ubuntu-vm%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a> |

In addition to these templates, you can search through the [gallery templates](https://azure.microsoft.com/documentation/templates/).

## Azure portal

Deploying a template by using the Azure portal is easy to do by just sending a URL to it. You need the name of the template file to deploy it. You can find the name by looking at the pages in the template gallery or by looking in the Github repository. Change {template name} in this URL to the name of the template that you want to deploy and then enter it into your browser:

https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F{template name}%2Fazuredeploy.json

You should see the custom deployment blade:

![](./media/virtual-machines-workload-template-ad-domain/azure-portal-template.png)

1.	For the **Template** pane, click **Save**.
2.	Click **Parameters**. On the **Parameters** pane, enter new values, select from allowed values, or accept default values, and then click **OK**.
3.	If needed, click **Subscription** and select the correct Azure subscription.
4.	Click **Resource group** and select an existing resource group. Alternately, click **Or create new** to create a new one for this deployment.
5.	If needed, click **Location** and select the correct Azure location.
6.	If needed, click **Legal terms** to review the terms and agreement for using the template.
7.	Click **Create**.

Depending on the template, it can take some time for Azure to deploy the resources.

## Azure PowerShell

[AZURE.INCLUDE [powershell-preview](../../includes/powershell-preview-inline-include.md)]

Run these commands to create the resource group and the deployment after you replace the text in brackets with the resource group name, location, deployment name, and template name:

	New-AzureRmResourceGroup -Name {resource-group-name} -Location {location}
	New-AzureRmResourceGroupDeployment -Name {deployment-name} -ResourceGroupName {resource-group-name} -TemplateUri "https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/{template-name}/azuredeploy.json"

When you run the **New-AzureRmResourceGroupDeployment** command, you are prompted to enter values for the parameters in the template. Depending on the template, it can take some time for Azure to deploy the resources.

## Azure CLI

[Install Azure CLI](https://azure.microsoft.com/en-us/documentation/articles/xplat-cli-install/), log in, and make sure you enable Resource Manager commands. For information about how to do this, see [Use the Azure CLI for Mac, Linux, and Windows with Azure Resource Manager](https://azure.microsoft.com/en-us/documentation/articles/xplat-cli-azure-resource-manager/).

Run these commands to create the resource group and the deployment after you replace the text in brackets with the resource group name, location, deployment name, and template name:

	azure group create {resource-group-name} {location}
	azure group deployment create --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/{template-name}/azuredeploy.json {resource-group-name} {deployment-name}

When you run the **azure group deployment create** command, you are prompted to enter values for the parameters in the template. Depending on the template, it can take some time for Azure to deploy the resources.

## Next steps

Discover all the templates at your disposal on [GitHub](https://github.com/Azure/azure-quickstart-templates).

Learn more about [Azure Resource Manager](../resource-group-template-deploy.md).
