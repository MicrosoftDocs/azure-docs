---
title: Add , rollover and remove certificates used in a Service Fabric cluster in Azure | Microsoft Docs
description: Describes how to upload a secondary cluster certificate and then rollover the old primary certificate.
services: service-fabric
documentationcenter: .net
author: ChackDan
manager: timlt
editor: ''

ms.assetid: 91adc3d3-a4ca-46cf-ac5f-368fb6458d74
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/06/2017
ms.author: chackdan

---
# Add or remove certificates for a Service Fabric cluster in Azure
It is recommended that you familiarize yourself with how Service Fabric uses X.509 certificates, read [Cluster security scenarios](service-fabric-cluster-security.md). You must understand what a cluster certificate is and what is used for, before you proceed further.

Service fabric lets you specify two cluster certificates, a primary and a secondary, when you configure certificate security during cluster creation. Refer to [creating an azure cluster via portal](service-fabric-cluster-creation-via-portal.md) or [creating an azure cluster via Azure Resource Manager](service-fabric-cluster-creation-via-arm.md) for details. If deploying via Resource Manager, and you specify only one cluster certificate, then that is used as the primary certificate. After cluster creation, you can add a new certificate as a secondary.

> [!NOTE]
> For a secure cluster, you will always need at least one valid (not revoked and not expired) certificate (primary or secondary) deployed if not, the cluster stops functioning. 90 days before all valid certificates reach expiration, the system generates a warning trace and also a warning health event on the node. There is currently no email or any other notification that service fabric sends out on this topic. 
> 
> 

## Add a secondary cluster certificate using the portal

Secondary cluster certificate cannot be added through the Azure portal. You have to use Azure powershell for that. The process is outlined later in this document.

## Swap the cluster certificates using the portal

Navigate to the Security blade, and select the 'Swap with primary' option from the context menu to swap the secondary cert with the primary cert.

![Swap certificate][Delete_Swap_Cert]

## Remove a cluster certificate using the portal

For a secure cluster, you will always need at least one valid (not revoked and not expired) certificate (primary or secondary) deployed if not, the cluster stops functioning.

To remove a secondary certificate from being used for cluster security, Navigate to the Security blade and select the 'Delete' option from the context menu on the secondary certificate.

If your intent is to remove the certificate that is marked primary, then you will need to swap it with the secondary first, and then delete the secondary after the upgrade has completed.


## Client certificates - Admin or Read-Only

Optionally, Client certificates can added in addition to the cluster certificates to perform management operations on a service fabric cluster.

You can add two kinds of client certificates - Admin or Read-only. These then can be used to control access to the admin operations and Query operations on the cluster. By default, the cluster certificates are added to the allowed Admin certificates list.

you can specify any number of client certificates. Each addition/deletion will result in a configuration update to the service fabric cluster


### Adding client certificates - Admin or Read-Only

1. Navigate to the Security blade, and select the '+ Authentication' button on top of the security blade.
2. On the 'Add Authentication' blade,  choose the 'Authentication Type' - 'Read-only client' or 'Admin client'
3. Now choose the Authorization method, This indicates to Service Fabric whether it should look up this certificate by using the subject name or the thumbprint. In general, it is not a good security practice to use the authorization method of subject name. 

![Add Client certificate][Add_Client_Cert]

### Deletion of Client Certificates - Admin or Read-Only

To remove a secondary certificate from being used for cluster security, Navigate to the Security blade and select the 'Delete' option from the context menu on the specific certificate.

## Add a secondary certificate using Resource Manager Powershell

These steps assume that you are familiar with how Resource Manager works and have deployed atleast one Service Fabric cluster using an Resource Manager template, and have the template that you used to set up the cluster handy. it is also assumed that you are comfortable using JSON.

> [!NOTE]
> If you are looking for a sample template and parameters that you can use to follow along or as a starting point, then download it from this [git-repo](https://github.com/ChackDan/Service-Fabric/tree/master/ARM%20Templates/Cert%20Rollover%20Sample). 
> 
> 

#### Edit your Resource Manager template

For ease of following along, sample 5-VM-1-NodeTypes-Secure_Step2.JSON contains all the edits we will be making. the sample is avaialbe at [git-repo](https://github.com/ChackDan/Service-Fabric/tree/master/ARM%20Templates/Cert%20Rollover%20Sample).

**Make sure to follow all the steps**

1. Open up the Resource Manager template you used to deploy you Cluster.  (If you have downloaded the sample from the above repo, then Use 5-VM-1-NodeTypes-Secure_Step1.JSON to deploy a secure cluster and then open up that template).

2. Add **two new parameters**  "secCertificateThumbprint" and "secCertificateUrlValue" of type "string" to the parameter section of your template. You can copy the code snippet below and add to the template. Depending on the source of your template, you may already have these defined, if so just move on to the next step. 
 
```JSON
   "secCertificateThumbprint": {
      "type": "string",
      "metadata": {
        "description": "Certificate Thumbprint"
      }
    },
    "secCertificateUrlValue": {
      "type": "string",
      "metadata": {
        "description": "Refers to the location URL in your key vault where the certificate was uploaded, it is should be in the format of https://<name of the vault>.vault.azure.net:443/secrets/<exact location>"
      }
    },

```

3. Changes to the **Microsoft.ServiceFabric/clusters** resource- Locate the "Microsoft.ServiceFabric/clusters" resource definition in your template. Under properties of that definition, you will find "Certificate" JSON tag, which should look something like the following JSON snippet.
   
```JSON
      "properties": {
        "certificate": {
          "thumbprint": "[parameters('certificateThumbprint')]",
          "x509StoreName": "[parameters('certificateStoreValue')]"
     }
``` 

Add a new tag "thumbprintSecondary" and give it a value "[parameters('secCertificateThumbprint')]".  

So now the resource definition should look like the following (depending on your source of the template, it may not be exactly like the snippet below). 

```JSON
      "properties": {
        "certificate": {
          "thumbprint": "[parameters('certificateThumbprint')]",
		  "thumbprintSecondary": "[parameters('secCertificateThumbprint')]",
          "x509StoreName": "[parameters('certificateStoreValue')]"
     }
``` 

If you do not want to **rollover the cert**, then just specify the new cert as primary and moving the current primary as secondary.  This results in the rollover of your current primary certificate to the new certificate in one deployment step.

```JSON
      "properties": {
        "certificate": {
          "thumbprint": "[parameters('secCertificateThumbprint')]",
		  "thumbprintSecondary": "[parameters('certificateThumbprint')]",
          "x509StoreName": "[parameters('certificateStoreValue')]"
     }
``` 

1. Changes to the **Microsoft.Compute/virtualMachineScaleSets** resource - Locate the Microsoft.Compute/virtualMachineScaleSets resource defintion. Scroll to the  "publisher": "Microsoft.Azure.ServiceFabric", under "virtualMachineProfile"   

In the service fabric publisher settings you will see something like this.

![Json_Pub_Setting1][Json_Pub_Setting1]

Add the new cert entries to it

```JSON
               "certificateSecondary": {
                    "thumbprint": "[parameters('secCertificateThumbprint')]",
                    "x509StoreName": "[parameters('certificateStoreValue')]"
                    }
                  },

```
The properties should now look like this

![Json_Pub_Setting2][Json_Pub_Setting2]

if you do not want to **rollover the cert**, then just specify the new cert as primary and moving the current primary as secondary.  This results in the rollover of your current certificate to the new certificate in one deployment step. 


```JSON
               "certificate": {
                   "thumbprint": "[parameters('secCertificateThumbprint')]",
                   "x509StoreName": "[parameters('certificateStoreValue')]"
                     },
               "certificateSecondary": {
                    "thumbprint": "[parameters('certificateThumbprint')]",
                    "x509StoreName": "[parameters('certificateStoreValue')]"
                    }
                  },

```
The properties should now look like this

![Json_Pub_Setting3][Json_Pub_Setting3]


1. Changes to the **Microsoft.Compute/virtualMachineScaleSets** resource - Locate the Microsoft.Compute/virtualMachineScaleSets resource definition. Scroll to the  "vaultCertificates": , under "OSProfile". it should look something like this.


![Json_Pub_Setting4][Json_Pub_Setting4]

Add the secCertificateUrlValue to it. use the following snippet.

```Json
                  {
                    "certificateStore": "[parameters('certificateStoreValue')]",
                    "certificateUrl": "[parameters('secCertificateUrlValue')]"
                  }

```
Now the resulting Json should look something like this.
![Json_Pub_Setting5][Json_Pub_Setting5]

6. If you have only one Nodetype, then you are done with all the editing, else repeat the steps for all the Microsoft.Compute/virtualMachineScaleSets resource defnitions.


#### Edit your template file to reflect the new parameters you added above
If you were using the sample from the [git-repo](https://github.com/ChackDan/Service-Fabric/tree/master/ARM%20Templates/Cert%20Rollover%20Sample) to follow along, you can start to make changes in The sample 5-VM-1-NodeTypes-Secure.paramters_Step2.JSON 

Edit the Resource Manager Template parameter File, add the new parameters for the secCertificate and swap the existing primary cert details with the secondary and replace the primary cert details with the new cert details. 

```JSON
    "secCertificateThumbprint": {
      "value": "new Certificate Thumbprint"
    },
   "secSourceVaultValue": {
      "value": "new Certificate Key Vault location"
    },
    "secCertificateUrlValue": {
      "value": "OLD Primary Certificate location in the key vault"
     },
    "certificateThumbprint": {
      "value": "New Certificate Thumbprint"
    },
    "sourceVaultValue": {
      "value": "New Certificate Key Vault location"
    },
    "certificateUrlValue": {
      "value": "New Certificate location in the key vault"
     },

```

### Deploy the template to Azure
1. You are now ready to deploy your template to Azure. Open an Azure PS version 1+ command prompt.
2. Login to your Azure Account and select the specific azure subscription. This is an important step for folks who have access to more than one azure subscription.

```powershell
Login-AzureRmAccount
Select-AzureRmSubscription -SubscriptionId <Subcription ID> 

```

Test the template prior to deploying it. Use the same Resource Group that your cluster is currently deployed to.

```powershell
Test-AzureRmResourceGroupDeployment -ResourceGroupName <Resource Group that your cluster is currently deployed to> -TemplateFile <PathToTemplate>

```

Deploy the template to your resource group. Use the same Resource Group that your cluster is currently deployed to. Run the New-AzureRmResourceGroupDeployment command. You do not need to specify the mode, since the default value is **incremental**.

> [!NOTE]
> If you set Mode to Complete, you can inadvertently delete resources that are not in your template. So do not use it in this scenario.
> 
> 

```powershell
New-AzureRmResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName <Resource Group that your cluster is currently deployed to> -TemplateFile <PathToTemplate>
```

Here is a filled out example of the same powershell.

```powershell
$ResouceGroup2 = "chackosecure5"
$TemplateFile = "C:\GitHub\Service-Fabric\ARM Templates\Cert Rollover Sample\5-VM-1-NodeTypes-Secure_Step2.json"
$TemplateParmFile = "C:\GitHub\Service-Fabric\ARM Templates\Cert Rollover Sample\5-VM-1-NodeTypes-Secure.parameters_Step2.json"

New-AzureRmResourceGroupDeployment -ResourceGroupName $ResouceGroup2 -TemplateParameterFile $TemplateParmFile -TemplateUri $TemplateFile -clusterName $ResouceGroup2

```

Once the deployment is complete, connect to your cluster using the new Certificate and perform some queries. If you are able to do. Then you can delete the old primary certificate. 

If you are using a self-signed certificate, do not forget to import them into your local TrustedPeople cert store.

```powershell
######## Set up the certs on your local box
Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\TrustedPeople -FilePath c:\Mycertificates\chackdanTestCertificate9.pfx -Password (ConvertTo-SecureString -String abcd123 -AsPlainText -Force)
Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\My -FilePath c:\Mycertificates\chackdanTestCertificate9.pfx -Password (ConvertTo-SecureString -String abcd123 -AsPlainText -Force)

```
For quick reference here is the command to connect to a secure cluster 

```powershell
$ClusterName= "chackosecure5.westus.cloudapp.azure.com:19000"
$CertThumbprint= "70EF5E22ADB649799DA3C8B6A6BF7SD1D630F8F3" 

Connect-serviceFabricCluster -ConnectionEndpoint $ClusterName -KeepAliveIntervalInSec 10 `
    -X509Credential `
    -ServerCertThumbprint $CertThumbprint  `
    -FindType FindByThumbprint `
    -FindValue $CertThumbprint `
    -StoreLocation CurrentUser `
    -StoreName My
```
For quick reference here is the command to get cluster health

```powershell
Get-ServiceFabricClusterHealth 
```

## Remove the old certificate using the portal
Here is the process to remove an old certificate so that the cluster does not use it:

1. Sign in to the [Azure portal](https://portal.azure.com/) and navigate to your cluster's security settings.
2. Right Click on the certificate you want to remove
3. Select Delete and follow the prompts. 

[SecurityConfigurations_05]: ./media/service-fabric-cluster-security-update-certs-azure/SecurityConfigurations_05.png


## Next steps
Read these articles for more information on cluster management:

* [Service Fabric Cluster upgrade process and expectations from you](service-fabric-cluster-upgrade.md)
* [Setup role-based access for clients](service-fabric-cluster-security-roles.md)

<!--Image references-->
[Delete_Swap_Cert]: ./media/service-fabric-cluster-security-update-certs-azure/SecurityConfigurations_09.PNG
[Add_Client_Cert]: ./media/service-fabric-cluster-security-update-certs-azure/SecurityConfigurations_13.PNG
[Json_Pub_Setting1]: ./media/service-fabric-cluster-security-update-certs-azure/SecurityConfigurations_14.PNG
[Json_Pub_Setting2]: ./media/service-fabric-cluster-security-update-certs-azure/SecurityConfigurations_15.PNG
[Json_Pub_Setting3]: ./media/service-fabric-cluster-security-update-certs-azure/SecurityConfigurations_16.PNG
[Json_Pub_Setting4]: ./media/service-fabric-cluster-security-update-certs-azure/SecurityConfigurations_17.PNG
[Json_Pub_Setting5]: ./media/service-fabric-cluster-security-update-certs-azure/SecurityConfigurations_18.PNG
[SecurityConfigurations_03]: ./media/service-fabric-cluster-security-update-certs-azure/SecurityConfigurations_03.png
[SecurityConfigurations_05]: ./media/service-fabric-cluster-security-update-certs-azure/SecurityConfigurations_05.png
[SecurityConfigurations_08]: ./media/service-fabric-cluster-security-update-certs-azure/SecurityConfigurations_08.png
