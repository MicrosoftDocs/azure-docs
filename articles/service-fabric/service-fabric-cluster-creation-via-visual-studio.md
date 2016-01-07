<properties
   pageTitle="Setting up a Service Fabric cluster using Visual Studio | Microsoft Azure"
   description="Describes how to set up a Service Fabric cluster by using Azure Resource Manager (ARM) template created by an Azure Resource Group project in Visual Studio"
   services="service-fabric"
   documentationCenter=".net"
   authors="karolz-ms"
   manager="adegeo"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="11/13/2015"
   ms.author="karolz@microsoft.com"/>

# Set up a Service Fabric cluster by using Visual Studio
This article describes how to set up an Azure Service Fabric cluster by using Visual Studio and an Azure Resource Manager (ARM) template. We will use a Visual Studio Azure resource group project to create the template. After the template has been created, it can be deployed directly to Azure from Visual Studio, but it can also be used from a script or as part of continuous integration (CI) facility.

## Create a Service Fabric cluster template by using an Azure resource group project
To get started, open Visual Studio and create an Azure resource group project (it is available in the **Cloud** folder):

![New Project dialog with Azure Resource Group project selected][1]

You can create a new Visual Studio solution for this project or add it to an existing solution.

>[AZURE.NOTE] If you do not see the Azure resource group project under the Cloud node, you do not have the Azure SDK installed. Launch Web Platform Installer ([install it now](http://www.microsoft.com/web/downloads/platform.aspx) if you have not already), and then search for "Azure SDK for .NET" and install the version that is compatible with your version of Visual Studio.

After you hit the OK button, Visual Studio will ask you to select the Resource Manager template you want to create:

![Select Azure Template dialog with Service Fabric Cluster template selected][2]

Select the Service Fabric Cluster template and hit the OK button again. The project and the Resource Manager template have now been created.

## Prepare the template for deployment
Before the template is deployed to create the cluster, you must provide values for the required template parameters. These parameter values are read from the `ServiceFabricCluster.param.dev.json` file, which is in the `Templates` folder of the resource group project. Open the file and provide the following values:

|Parameter name           |Description|
|-----------------------  |--------------------------|
|clusterLocation          |The name of the **Azure region** where the Service Fabric cluster will be located. For example, "East US."|
|clusterName              |The Domain Name System (DNS) name of the Service Fabric cluster that will be created by the template. <br /><br /> For example, if you set this parameter to `myBigCluster`, and the `clusterLocation` parameter is set to East US, the name of the cluster will be `myBigCluster.eastus.cloudapp.azure.com`.|
|certificateThumbprint    |The thumbprint of the certificate that will secure the cluster.|
|sourceVaultValue         |The *resource ID* of the key vault where the certificate that secures the cluster is stored.|
|certificateUrlValue      |The URL of the cluster security certificate.|

The Visual Studio Service Fabric Resource Manager template creates a secure cluster that is protected by a certificate. This certificate is identified by the last three template parameters (`certificateThumbprint`, `sourceVaultValue`, and `certificateUrlValue`), and it must exist in an **Azure Key Vault**. For more information on how to create the cluster security certificate, see [How to secure a Service Fabric cluster using certificates](service-fabric-cluster-security.md) article.

## Optional: Add public application ports
You may also want to change the public application ports for the cluster before you deploy it. By default, the template opens up just two public TCP ports (80 and 8081). If you need more for your applications, modify the Azure Load Balancer definition in the template. The definition is stored in the main template file (`SecureFabricCluster.json`). Open that file and search for `loadBalancedAppPort`. You will notice that each port is associated with three artifacts:

1. A template parameter that defines the TCP port value for the port:
	```json
	"loadBalancedAppPort1": {
	    "type": "int",
	    "defaultValue": 80
	}
	```

2. A *probe* that defines how frequently and for how long the Azure load balancer will attempt to use a specific Service Fabric node before failing over to another one. The probes are part of the Load Balancer resource. Here is the probe definition for the first default application port:
	```json
	{
        "name": "AppPortProbe1",
        "properties": {
            "intervalInSeconds": 5,
            "numberOfProbes": 2,
            "port": "[parameters('loadBalancedAppPort1')]",
            "protocol": "tcp"
        }
    }
	```

3. A *load-balancing rule* that ties together the port and the probe, which enables load balancing across a set of Service Fabric cluster nodes:
    ```json
	{
	    "name": "AppPortLBRule1",
	    "properties": {
	        "backendAddressPool": {
	            "id": "[variables('lbPoolID0')]"
	        },
	        "backendPort": "[parameters('loadBalancedAppPort1')]",
	        "enableFloatingIP": false,
	        "frontendIPConfiguration": {
	            "id": "[variables('lbIPConfig0')]"
	        },
	        "frontendPort": "[parameters('loadBalancedAppPort1')]",
	        "idleTimeoutInMinutes": 5,
	        "probe": {
	            "id": "[concat(variables('lbID0'),'/probes/AppPortProbe1')]"
	        },
	        "protocol": "tcp"
	    }
	}
    ```
If the applications that you plan to deploy to the cluster need more ports, you can add them by creating additional probe and load-balancing rule definitions. For more information on how to work with Azure Load Balancer through Resource Manager templates, see [Get started configuring an internal Load Balancer using Azure Resource Manager](https://azure.microsoft.com/documentation/articles/load-balancer-internal-arm-powershell/).

## Deploy the template by using Visual Studio
After you have saved all the required parameter values in the`ServiceFabricCluster.param.dev.json` file, you are ready to deploy the template and create your Service Fabric cluster. Right-click the resource group project in Visual Studio Solution Explorer and choose **Deploy**. Visual Studio will show the **Deploy to Resource Group** dialog box, asking you to authenticate to Azure, if necessary:

![Deploy to Resource Group dialog][3]

The dialog box lets you choose an existing Resource Manager resource group for the cluster and gives you the option to create a new one. It normally makes sense to use a separate resource group for a Service Fabric cluster.

After you hit the Deploy button, Visual Studio will prompt you to confirm the template parameter values. Hit the **Save** button. One parameter does not have a persisted value: the administrative account password for the cluster. You will need to provide a password value when Visual Studio prompts you for one.

>[AZURE.NOTE] If PowerShell was never used to administer Azure from the machine that you are using now, you will need to do a little housekeeping.
>1. Enable PowerShell scripting by running the [`Set-ExecutionPolicy`](https://technet.microsoft.com/library/hh849812.aspx) command. For development machines, "unrestricted" policy is usually acceptable.
>2. Decide whether to allow diagnostic data collection from Azure PowerShell commands, and run [`Enable-AzureRmDataCollection`](https://msdn.microsoft.com/library/mt619303.aspx) or [`Disable-AzureRmDataCollection`](https://msdn.microsoft.com/library/mt619236.aspx) as necessary. If you are using Azure PowerShell version 0.9.8 or older, these commands are named `Enable-AzureDataCollection` and `Discable-AzureDataCollection`, respectively. This will avoid unnecessary prompts during template deployment.

You can monitor the progress of the deployment process in the Visual Studio output window. Once the template deployment is completed, your new cluster is ready to use!

If there are any errors, go to the [Azure portal](https://portal.azure.com/) and check **Notifications**. A failed resource-group deployment will leave detailed diagnostic information there.

## Next steps
- [Learn about setting up Service Fabric cluster using the Azure portal](service-fabric-cluster-creation-via-portal.md)
- [Learn how to manage and deploy Service Fabric applications using Visual Studio](service-fabric-manage-application-in-visual-studio.md)

<!--Image references-->
[1]: ./media/service-fabric-cluster-creation-via-visual-studio/azure-resource-group-project-creation.png
[2]: ./media/service-fabric-cluster-creation-via-visual-studio/selecting-azure-template.png
[3]: ./media/service-fabric-cluster-creation-via-visual-studio/deploy-to-azure.png
