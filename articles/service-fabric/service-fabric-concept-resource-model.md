---
title: Azure Service Fabric application resource model  
description: This article provides an overview of managing an Azure Service Fabric application by using Azure Resource Manager.
ms.topic: conceptual 
ms.date: 10/21/2019
ms.custom: sfrev
---

# Service Fabric application resource model

To deploy Service Fabric applications on your Service Fabric cluster, we recommend using Azure Resource Manager. If you use Resource Manager, you can describe applications and services in JSON, and then deploy them in the same Resource Manager template as your cluster. Unlike using PowerShell or Azure CLI to deploy and manage applications, if you use Resource Manager, you don't have to wait for the cluster to be ready; application registration, provisioning, and deployment can all happen in one step. This is the best way to manage the application life cycle in your cluster. For more information, see [Best practices: Infrastructure as code](service-fabric-best-practices-infrastructure-as-code#azure-service-fabric-resources).

When applicable, manage your applications as Resource Manager resources for improvements in these areas:

* Audit trail: Resource Manager audits every operation and keeps a detailed *Activity Log*, which can help you trace any changes made to these applications and to your cluster.
* Role-based access control: You can manage access to clusters and to the applications deployed on the cluster by using the same Resource Manager template.
* Resource Manager (via the Azure portal) offers a single location for managing your cluster and critical application deployments.

In this document, you will learn how to:

> [!div class="checklist"]
>
> * Deploy application resources by using Azure Resource Manager.
> * Upgrade application resources by using Azure Resource Manager.
> * Delete application resources.

## Deploy application resources

To deploy an application and its services by using the Resource Manager application resource model:
1. Package the application code.
1. Upload the package.
1. Reference the location of the package in a Resource Manager template as an application resource. 

For more information, view [Package an application](service-fabric-package-apps#create-an-sfpkg).

Then, create a Resource Manager template, update the parameters file with application details, and deploy it on the Service Fabric cluster. Explore [samples](https://github.com/Azure-Samples/service-fabric-dotnet-quickstart/tree/master/ARM).

### Create a storage account

To deploy an application from a Resource Manager template, you must have a storage account, for staging the application image. You can reuse an existing storage account or create a new storage account to stage your applications. If you use an existing storage account, you can skip this step. 

![Create a storage account][CreateStorageAccount]

### Configure your storage account

After the storage account is created, you need to create a blob container where the applications can be staged. In the Azure portal, go to the Azure Storage account where you want to store your applications. Select **Blobs** > **Add Container**. Resources in your cluster can be secured by setting the public access level to **private**. You can grant access in multiple ways:

* Authorize access to blobs and queues with [Azure Active Directory](../storage/common/storage-auth-aad-app.md).
* Grant access to Azure blob and queue data with [RBAC in the Azure portal](../storage/common/storage-auth-aad-rbac-portal.md).
* Delegate access with [Shared Access Signature](https://docs.microsoft.com/rest/api/storageservices/delegate-access-with-shared-access-signature).

This example uses anonymous read access for blobs.

![Create blob][CreateBlob]

### Stage application in your storage account

Before the application can be deployed, it must be staged in blob storage. In this tutorial we will create the application package manually, however this step can be automated.  For more information, view [Package an application](https://docs.microsoft.com/azure/service-fabric/service-fabric-package-apps#create-an-sfpkg). In the following steps the [Voting sample application](https://github.com/Azure-Samples/service-fabric-dotnet-quickstart) will be used.

1. In Visual Studio, right-click the **Voting** project, and then select the package.

   ![Package Application][PackageApplication]  
2. Go to the *.\service-fabric-dotnet-quickstart\Voting\pkg\Debug* directory that was created. Zip the contents into a file called Voting.zip so that the ApplicationManifest.xml file is at the root of the zip file.

   ![Zip Application][ZipApplication]  
3. Rename the extension of the file from .zip to *.sfpkg*.

4. In the Azure portal, in the **apps** container for your storage account, select **Upload** and upload **Voting.sfpkg**.  
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

2. A new version of an existing service is added to the application. This involves application code changes and updates to app type version and name.

    ```json
     "applicationTypeVersion": {
        "value": "1.0.1"
    },
    ```

## Delete application resources

Applications deployed using the application resource model in Azure Resource Manager can be deleted from cluster using below steps

1) Get resource ID for application using [Get-AzResource](https://docs.microsoft.com/powershell/module/az.resources/get-azresource?view=azps-2.5.0):

    ```powershell
    Get-AzResource  -Name <String> | f1
    ```

2) Delete the application resources using [Remove-AzResource](https://docs.microsoft.com/powershell/module/az.resources/remove-azresource?view=azps-2.5.0):

    ```powershell
    Remove-AzResource  -ResourceId <String> [-Force] [-ApiVersion <String>]
    ```

## Next steps

Get information about the application resource model:

* [Model an application in Service Fabric](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-model)
* [Service Fabric application and service manifests](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-and-service-manifests)

## See Also

* [Best practices](https://docs.microsoft.com/azure/service-fabric/service-fabric-best-practices-infrastructure-as-code)
* [Manage applications and services as Azure Resources](https://docs.microsoft.com/azure/service-fabric/service-fabric-best-practices-infrastructure-as-code)

<!--Image references-->
[CreateStorageAccount]: ./media/service-fabric-application-model/create-storage-account.png
[CreateBlob]: ./media/service-fabric-application-model/create-blob.png
[PackageApplication]: ./media/service-fabric-application-model/package-application.png
[ZipApplication]: ./media/service-fabric-application-model/zip-application.png
[UploadAppPkg]: ./media/service-fabric-application-model/upload-app-pkg.png
