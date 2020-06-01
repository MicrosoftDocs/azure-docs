---
title: Azure Service Fabric application resource model  
description: This article provides an overview of managing an Azure Service Fabric application by using Azure Resource Manager.
ms.topic: conceptual 
ms.date: 10/21/2019
ms.custom: sfrev
---

# Service Fabric application resource model

You have multiple options for deploying Azure Service Fabric applications on your Service Fabric cluster. We recommend using Azure Resource Manager. If you use Resource Manager, you can describe applications and services in JSON, and then deploy them in the same Resource Manager template as your cluster. Unlike using PowerShell or Azure CLI to deploy and manage applications, if you use Resource Manager, you don't have to wait for the cluster to be ready; application registration, provisioning, and deployment can all happen in one step. Using Resource Manager is the best way to manage the application life cycle in your cluster. For more information, see [Best practices: Infrastructure as code](service-fabric-best-practices-infrastructure-as-code.md#azure-service-fabric-resources).

Managing your applications as resources in Resource Manager can help you gain improvements in these areas:

* Audit trail: Resource Manager audits every operation and keeps a detailed activity log. An activity log  can help you trace any changes made to the applications and to your cluster.
* Role-based access control: You can manage access to clusters and to applications deployed on the cluster by using the same Resource Manager template.
* Management efficiency: Using Resource Manager gives you a single location (the Azure portal) for managing your cluster and critical application deployments.

In this document, you will learn how to:

> [!div class="checklist"]
>
> * Deploy application resources by using Resource Manager.
> * Upgrade application resources by using Resource Manager.
> * Delete application resources.

## Deploy application resources

The high-level steps you take to deploy an application and its services by using the Resource Manager application resource model are:
1. Package the application code.
1. Upload the package.
1. Reference the location of the package in a Resource Manager template as an application resource. 

For more information, view [Package an application](service-fabric-package-apps.md#create-an-sfpkg).

Then, you create a Resource Manager template, update the parameters file with application details, and deploy the template on the Service Fabric cluster. [Explore samples](https://github.com/Azure-Samples/service-fabric-dotnet-quickstart/tree/master/ARM).

### Create a storage account

To deploy an application from a Resource Manager template, you must have a storage account. The storage account is used to stage the application image. 

You can reuse an existing storage account or you can create a new storage account for staging your applications. If you use an existing storage account, you can skip this step. 

![Create a storage account][CreateStorageAccount]

### Configure your storage account

After the storage account is created, you create a blob container where the applications can be staged. In the Azure portal, go to the Azure Storage account where you want to store your applications. Select **Blobs** > **Add Container**. 

Resources in your cluster can be secured by setting the public access level to **private**. You can grant access in multiple ways:

* Authorize access to blobs and queues by using [Azure Active Directory](../storage/common/storage-auth-aad-app.md).
* Grant access to Azure blob and queue data by using [RBAC in the Azure portal](../storage/common/storage-auth-aad-rbac-portal.md).
* Delegate access by using a [shared access signature](https://docs.microsoft.com/rest/api/storageservices/delegate-access-with-shared-access-signature).

The example in the following screenshot uses anonymous read access for blobs.

![Create blob][CreateBlob]

### Stage the application in your storage account

Before you can deploy an application, you must stage the application in blob storage. In this tutorial, we create the application package manually. Keep in  mind that this step can be automated. For more information, see [Package an application](service-fabric-package-apps.md#create-an-sfpkg). 

In this tutorial, we use the [Voting sample application](https://github.com/Azure-Samples/service-fabric-dotnet-quickstart).

1. In Visual Studio, right-click the **Voting** project, and then select **Package**.

   ![Package Application][PackageApplication]  
1. Go to the *.\service-fabric-dotnet-quickstart\Voting\pkg\Debug* directory. Zip the contents into a file called *Voting.zip*. The *ApplicationManifest.xml* file should be at the root in the zip file.

   ![Zip Application][ZipApplication]  
1. Rename the file to change the extension from .zip to *.sfpkg*.

1. In the Azure portal, in the **apps** container for your storage account, select **Upload**, and then upload **Voting.sfpkg**. 

   ![Upload App Package][UploadAppPkg]

Now, the application is now staged and you can create the Resource Manager template to deploy the application.

### Create the Resource Manager template

The sample application contains [Azure Resource Manager templates](https://github.com/Azure-Samples/service-fabric-dotnet-quickstart/tree/master/ARM) you can use to deploy the application. The template file names are *UserApp.json* and *UserApp.Parameters.json*.

> [!NOTE]
> The *UserApp.Parameters.json* file must be updated with the name of your cluster.
>
>

| Parameter              | Description                                 | Example                                                      | Comments                                                     |
| ---------------------- | ------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| clusterName            | The name of the cluster you're deploying to | sf-cluster123                                                |                                                              |
| application            | The name of the application                 | Voting                                                       |
| applicationTypeName    | The type name of the  application           | VotingType                                                   | Must match ApplicationManifest.xml                 |
| applicationTypeVersion | The version of the application type         | 1.0.0                                                        | Must match ApplicationManifest.xml                 |
| serviceName            | The name of the service         | Voting~VotingWeb                                             | Must be in the format ApplicationName~ServiceType            |
| serviceTypeName        | The type name of the service                | VotingWeb                                                    | Must match ServiceManifest.xml                 |
| appPackageUrl          | The blob storage URL of the application     | https:\//servicefabricapps.blob.core.windows.net/apps/Voting.sfpkg | The URL of the application package in blob storage (the procedure to set the URL is described later in the article) |

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

Run the **New-AzResourceGroupDeployment** cmdlet to deploy the application to the resource group that contains your cluster:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName "sf-cluster-rg" -TemplateParameterFile ".\UserApp.Parameters.json" -TemplateFile ".\UserApp.json" -Verbose
```

## Upgrade the Service Fabric application by using Resource Manager

You might upgrade an application that's already deployed to a Service Fabric cluster for one of these reasons:

* A new service is added to the application. A service definition must be added to *service-manifest.xml* and *application-manifest.xml* files when a service is added to the application. To reflect a new version of an application, you also must change the application type version from 1.0.0 to 1.0.1 in [UserApp.Parameters.json](https://github.com/Azure-Samples/service-fabric-dotnet-quickstart/blob/master/ARM/UserApp.Parameters.json):

    ```json
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

* A new version of an existing service is added to the application. Examples include application code changes and updates to app type version and name. For this upgrade, update UserApp.Parameters.json like this:

    ```json
     "applicationTypeVersion": {
        "value": "1.0.1"
    },
    ```

## Delete application resources

To delete an application that was deployed by using the application resource model in Resource Manager:

1. Use the [Get-AzResource](https://docs.microsoft.com/powershell/module/az.resources/get-azresource?view=azps-2.5.0) cmdlet to get the resource ID for the application:

    ```powershell
    Get-AzResource  -Name <String> | f1
    ```

1. Use the [Remove-AzResource](https://docs.microsoft.com/powershell/module/az.resources/remove-azresource?view=azps-2.5.0) cmdlet to delete the application resources:

    ```powershell
    Remove-AzResource  -ResourceId <String> [-Force] [-ApiVersion <String>]
    ```

## Next steps

Get information about the application resource model:

* [Model an application in Service Fabric](service-fabric-application-model.md)
* [Service Fabric application and service manifests](service-fabric-application-and-service-manifests.md)
* [Best practices: Infrastructure as code](service-fabric-best-practices-infrastructure-as-code.md#azure-service-fabric-resources)
* [Manage applications and services as Azure resources](service-fabric-best-practices-infrastructure-as-code.md)


<!--Image references-->
[CreateStorageAccount]: ./media/service-fabric-application-model/create-storage-account.png
[CreateBlob]: ./media/service-fabric-application-model/create-blob.png
[PackageApplication]: ./media/service-fabric-application-model/package-application.png
[ZipApplication]: ./media/service-fabric-application-model/zip-application.png
[UploadAppPkg]: ./media/service-fabric-application-model/upload-app-pkg.png
