---
title: Azure Service Fabric application resource model  | Microsoft Docs
description: This article provides an overview of managing an Azure Service Fabric application with Azure Resource Manager
services: service-fabric
author: athinanthny 

ms.service: service-fabric
ms.topic: conceptual 
ms.date: 08/07/2019
ms.author: atsenthi 
---

# What is the Service Fabric application resource model?
It is recommended that Service Fabric applications are deployed onto your Service Fabric cluster via Azure Resource Manager. This method makes it possible to describe applications and services in JSON and deploy them in the same Resource Manager template as your cluster. As opposed to deploying and managing applications via PowerShell or Azure CLI, there is no need to wait for the cluster to be ready. The process of application registration, provisioning, and deployment can all happen in one step. This is the best practice to manage application life cycle in your cluster. For more information, look at [best practices](https://docs.microsoft.com/azure/service-fabric/service-fabric-best-practices-infrastructure-as-code#azure-service-fabric-resources).

When applicable, manage your applications as Resource Manager resources to improve:
* Audit trail: Resource Manager audits every operation and keeps a detailed *Activity Log* that can help you trace any changes made to these applications and your cluster.
* Role-based access control: Managing access to clusters as well as applications deployed on the cluster can be done via the same Resource Manager template.
* Azure Resource Manager (via the Azure portal) becomes a one-stop-shop for managing your cluster and critical application deployments.

## Service Fabric application life cycle with Azure Resource Manager 
In this document, you will learn how to:

> [!div class="checklist"]
> * Deploy application resources using Azure Resource Manager 
> * Upgrade application resources using Azure Resource Manager
> * Delete application resources

## Deploy application resources using Azure Resource Manager  
To deploy an application and its services using the Azure Resource Manager application resource model, you need to package application code, upload the package, and then reference the location of package in an Azure Resource Manager template as an application resource. For more information, view [Package an application](https://docs.microsoft.com/azure/service-fabric/service-fabric-package-apps#create-an-sfpkg).
          
Then, create an Azure Resource Manager template, update the parameters file with application details, and deploy it on the Service Fabric cluster. Refer to samples here

### Create a Storage account 
Deploying an application from a Resource Manager template requires a storage account to stage the application image. You can re-use an existing storage account or create a new storage account to stage your applications. If you would like to use an existing storage account, you can skip this step. 

![Create a storage account][CreateStorageAccount]

### Configure Storage account 
Once the storage account has been created, you need to create a blob container where the applications can be staged. In the Azure portal, navigate to the storage account that you would like to store your applications. Select the **Blobs** blade, and click the **Add Container** button. Add a new container with Blob Public access level.
   
![Create blob][CreateBlob]

### Stage application in a Storage account
Before the application can be deployed, it must be staged in blob storage. In this tutorial we will create the application package manually, however this step can be automated.  For more information, view [Package an application](https://docs.microsoft.com/azure/service-fabric/service-fabric-package-apps#create-an-sfpkg). In the following steps the [Voting sample application](https://github.com/Azure-Samples/service-fabric-dotnet-quickstart) will be used.

1. In Visual Studio right-click on the Voting project and select package.   
![Package Application][PackageApplication]  
2. Open the **.\service-fabric-dotnet-quickstart\Voting\pkg\Debug** directory that was just create, and zip the contents into a file called **Voting.zip** such that the ApplicationManifest.xml is at the root of the zip file.  
![Zip Application][ZipApplication]  
3. Rename the extension of the file from .zip to **.sfpkg**.
4. In the Azure portal, in the **apps** container of your storage account, click **Upload** and upload **Voting.sfpkg**.  
![Upload App Package][UploadAppPkg]

The application is now staged. We are now ready to create the Azure Resource Manager template to deploy the application.      
   
### Create the Azure Resource Manager template
The sample application contains [Azure Resource Manager Templates](https://github.com/Azure-Samples/service-fabric-dotnet-quickstart/tree/master/ARM) that can be used to deploy the application. The template files are named **UserApp.json** and **UserApp.Parameters.json**. 

> [!NOTE] 
> The **UserApp.Parameters.json** file must be updated with the name of your cluster.
>
>

| Parameter              | Description                                 | Example                                                      | Comments                                                     |
| ---------------------- | ------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| clusterName            | The name of the cluster you're deploying to | sf-cluster123                                                |                                                              |
| application            | The name of the application                 | Voting                                                       |
| applicationTypeName    | The type name of the  application           | VotingType                                                   | Must match what's in ApplicationManifest.xml                 |
| applicationTypeVersion | The version of the application type         | 1.0.0                                                        | Must match what's in ApplicationManifest.xml                 |
| serviceName            | The name of the service the service         | Voting~VotingWeb                                             | Must be in the format ApplicationName~ServiceType            |
| serviceTypeName        | The type name of the service                | VotingWeb                                                    | Must match what's in the ServiceManifest.xml                 |
| appPackageUrl          | The blob storage URL of the application     | https://servicefabricapps.blob.core.windows.net/apps/Voting.sfpkg | The URL of the application package in blob storage (the procedure to set this is described below) |
       
```json
{
    "apiVersion": "2019-03-01",
    "type": "Microsoft.ServiceFabric/clusters/applications",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationName'))]",
    "location": "[variables('clusterLocation')]",
},
{
    "apiVersion": "2019-03-01",
    "type": "Microsoft.ServiceFabric/clusters/applicationTypes",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationTypeName'))]",
    "location": "[variables('clusterLocation')]",
},
{
    "apiVersion": "2019-03-01",
    "type": "Microsoft.ServiceFabric/clusters/applicationTypes/versions",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationTypeName'), '/', parameters('applicationTypeVersion'))]",
    "location": "[variables('clusterLocation')]",
},
{
    "apiVersion": "2019-03-01",
    "type": "Microsoft.ServiceFabric/clusters/applications/services",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationName'), '/', parameters('serviceName'))]",
    "location": "[variables('clusterLocation')]"
}
```

### Deploy the application 
To deploy the application, run the New-AzResourceGroupDeployment to deploy to the resource group which contains your cluster.
```powershell
New-AzResourceGroupDeployment -ResourceGroupName "sf-cluster-rg" -TemplateParameterFile ".\UserApp.Parameters.json" -TemplateFile ".\UserApp.json" -Verbose
```

## Upgrade Service Fabric application using Azure Resource Manager
Applications already deployed to a Service Fabric cluster will be upgraded for the following reasons:

1. A new service is added to the application. A service definition must be added to service-manifest.xml and application-manifest.xml file. Then to reflect new version of application, you need to update the application type version from 1.0.0 to 1.0.1 [UserApp.parameters.json](https://github.com/Azure-Samples/service-fabric-dotnet-quickstart/blob/master/ARM/UserApp.Parameters.json).

    ```
    "applicationTypeVersion": {
        "value": "1.0.1"
    },
    "serviceName2": {
        "value": "Voting~VotingData"
    },
    "serviceTypeName2": {
        "value": "VotingDataType"
    }
    ```
2. A new version of an existing service is added to the application. This involves application code changes and updates to app type version and name.

    ```
     "applicationTypeVersion": {
        "value": "1.0.1"
    },
    ```

## Delete application resources
Applications deployed using the application resource model in Azure Resource Manager can be deleted from cluster using below steps

1) Get resource id for application using [Get-AzResource](https://docs.microsoft.com/powershell/module/az.resources/get-azresource?view=azps-2.5.0) command  

    #### Get Resource ID for application
    ```
    Get-AzResource  -Name <String> | f1
    ```
2) Delete the application resources using [Remove-AzResource](https://docs.microsoft.com/powershell/module/az.resources/remove-azresource?view=azps-2.5.0)  

    #### Delete application resource using its Resource ID
    ```
    Remove-AzResource  -ResourceId <String> [-Force] [-ApiVersion <String>]
    ```

## Next steps
Get information about the application resource model:

* [Model an application in Service Fabric](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-model)
* [Service Fabric application and service manifests](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-and-service-manifests)

<!--Image references-->
[CreateStorageAccount]: ./media/service-fabric-application-model/create-storage-account.png
[CreateBlob]: ./media/service-fabric-application-model/create-blob.png
[PackageApplication]: ./media/service-fabric-application-model/package-application.png
[ZipApplication]: ./media/service-fabric-application-model/zip-application.png
[UploadAppPkg]: ./media/service-fabric-application-model/upload-app-pkg.png