<properties
   pageTitle="Add , rollover and remove certificates used in a Service Fabric cluster in Azure | Microsoft Azure"
   description="Describes how to upload a secondary cluster certificate and then rollover the old primary certificate."
   services="service-fabric"
   documentationCenter=".net"
   authors="ChackDan"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/09/2016"
   ms.author="chackdan"/>

# Add or remove certificates for a Service Fabric cluster in Azure

It is strongly recommended that you familiarize yourself with how Service Fabric uses X.509 certificates, read [Cluster security scenarios](service-fabric-cluster-security.md). You must understand what a cluster certificate is and what is is used for, before you proceed further.

Service fabric lets you specify two cluster certificates, a primary and a secondary, when you configure certificate security during cluster creation. refer to [Securing an azure cluster with certs](service-fabric-cluster-azure-secure-azure-with-certs.md) for details. If deploying via ARM, and you specify only one cluster certificate, then that is used as the primary certificate. After cluster creation, you can add a new certificate as a secondary.

>[AZURE.NOTE] For a secure cluster, you will always need at least one valid (not revoked and not expired) certificate (primary or secondary) deployed if not, the cluster will stop functioning. 90 days before all valid certificates reach expiration, the system generates a warning trace and also a warning health event on the node. There is currently no email or any other notification that service fabric sends out on this topic. 


## Add a secondary certificate using the portal
To add another certificate as a secondary, you must upload the certificate to an Azure key vault and then deploy it to the VMs in the cluster.  For additional information, see [Deploy certificates to VMs from a customer-managed key vault](http://blogs.technet.com/b/kv/archive/2015/07/14/vm_2d00_certificates.aspx).

1. Refer to [Upload a X.509 certificate to the key vault](service-fabric-secure-azure-cluster-with-certs.md#step-2-upload-the-x509-certificate-to-the-key-vault) on how to.

2. Sign in to the [Azure portal](https://portal.azure.com/) and browse to the cluster resource that you want add this certificate to.
3. Under **SETTINGS**, click on  **Security** to bring up the Cluster Security Blade.
4. Click on the **"+Certificate"** Button on top of the blade to get to the **"Add Certificate"** blade.
5. Select "Secondary certificate thumbprint" from the dropdown and fill out the certificate thumbprint of the secondary certificate you uploaded to the keyvault.

>[AZURE.NOTE]
Unlike during the cluster creation workflow, We do not take in the details on the keyvault information here, because, it is assumed that by the time you are on this blade, you have already deployed the certificate to the VMs and the certificate is already available in the local cert store in the VMSS instance.

4. Click **Certificate**. A deployment will be started, and a blue Status bar will show up on the Cluster Security Blade.
![Screen shot of certificate thumbprints in the portal][SecurityConfigurations_02]
5. And on successful completion of that deployment, you will be able to use either the primary or the secondary certificate to perform management operations on the cluster.

![Screen shot of certificate deployment in progress][SecurityConfigurations_03]

here is a screen shot on how the security blade will look once the deployment is complete.

![Screen shot of certificate thumbprints after deployment][SecurityConfigurations_04]

Can now use the new cert you just added to connect and perform operations on the cluster.

>[AZURE.NOTE]
Currently there is no way to swap the primary and secondary certificates, that feature is in the works. as long as there is a valid cluster certificate, the cluster will operate fine.

## Add a secondary certificate and swamp it to be the primary using  ARM Powershell

These steps assume that you are familiar with how ARM works and have deployed atleast one Service Fabric cluster using an ARM template, and have the template that you used to set up the cluster handy. it is also assumed that you are comfortable using JSON. If any of the above assumptions is not true, it is best to use the portal.


>[AZURE.NOTE]
If you would like to try this out and you are looking for a sample template and parameters that you can use to follow along, then download it from this [git-repo](https://github.com/ChackDan/Service-Fabric/tree/master/ARM%20Templates/Cert%20Rollover%20Sample). 

#### Edit your ARM template 

If you were using the sample from the [git-repo](https://github.com/ChackDan/Service-Fabric/tree/master/ARM%20Templates/Cert%20Rollover%20Sample) to follow along, you will find these changes in The sample 5-VM-1-NodeTypes-Secure_Step2.JSON 

1. Open up the ARM template you used to deploy you Cluster.
2. Add a new parameter "secCertificateThumbprint" of type "string". If you are using the ARM template that you downloaded from the portal during the creation time or from the quickstart templates, then just search for that parameter, you should find it already defined.  
3. Locate the "Microsoft.ServiceFabric/clusters" Resource definition. Under properties  you will find "Certificate" JSON tag, which should look something like this.
```JSON
      "properties": {
        "certificate": {
          "thumbprint": "[parameters('certificateThumbprint')]",
          "x509StoreName": "[parameters('certificateStoreValue')]"
        }
``` 

4. Add a new tag "thumbprintSecondary" and give it a value "[parameters('secCertificateThumbprint')]".  

So now the resource definition should look sort of like this (depending on your source of the template, this may not be exactly like below). As you can see below what you are doing here is specifying a new cert as primary and moving the current primary as secondary.  This results in the rollover of your current certificate to the new certificate in one deployment step.

```JSON

      "properties": {
        "certificate": {
            "thumbprint": "[parameters('certificateThumbprint')]",
            "thumbprintSecondary": "[parameters('secCertificateThumbprint')]",
            "x509StoreName": "[parameters('certificateStoreValue')]"
        },

```

### Edit your template file to reflect the new parameters you added above

If you were using the sample from the [git-repo](https://github.com/ChackDan/Service-Fabric/tree/master/ARM%20Templates/Cert%20Rollover%20Sample) to follow along, you can start to make changes in The sample 5-VM-1-NodeTypes-Secure.paramters_Step2.JSON 


1. Edit the ARM Template parameter File, add the new parameters for the secCertificate and swap the existing primary cert details with the secondary and replace the primary cert details with the new cert details. 

```JSON
    "secCertificateThumbprint": {
      "value": "OLD Primary Certificate Thumbprint"
    },
   "secSourceVaultValue": {
      "value": "OLD Primary Certificate Key Vault location"
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

1. You are now ready to deploy your template to Azure. Open a Azure PS version 1+ command prompt.
1. Login to your Azure Account and select the specific azure subscription. This is an important step for folks who have access to more than one azure subsctiption.

```powershell
Login-AzureRmAccount
Select-AzureRmSubscription -SubscriptionId <Subcription ID> 

```
1. Test the template prior to deploying it. Use the same Resource Group that your cluster is currently deployed to.

```powershell
Test-AzureRmResourceGroupDeployment -ResourceGroupName <Resource Group that your cluster is currently deployed to> -TemplateFile <PathToTemplate>

```

3.  Deploy the template to your resource group. Use the same Resource Group that your cluster is currently deployed to. Run the New-AzureRmResourceGroupDeployment command. You do not need to specify the mode, since the default value is **incremental**.

>[AZURE.NOTE]
If you set Mode to Complete, you can inadvertently delete resources that are not in your template. So do not use it in this scenario.
   

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

If you are using a self signed certificate, do not forget to import them into your local TrustedPeople cert store.

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
3. Right Click on the certificate you want to remove
4. Select Delete and follow the prompts. 



## Next steps
Read these articles for more information on cluster management:

- [Service Fabric Cluster upgrade process and expectations from you](service-fabric-cluster-upgrade.md)
- [Setup role-based access for clients](service-fabric-cluster-security-roles.md)


<!--Image references-->
[SecurityConfigurations_02]: ./media/service-fabric-cluster-security-update-certs-azure/SecurityConfigurations_02.png
[SecurityConfigurations_03]: ./media/service-fabric-cluster-security-update-certs-azure/SecurityConfigurations_03.png
[SecurityConfigurations_04]: ./media/service-fabric-cluster-security-update-certs-azure/SecurityConfigurations_04.png
