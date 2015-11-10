<properties
   pageTitle="Setting up a Service Fabric Cluster from the Azure Portal | Microsoft Azure"
   description="Setting up a Service Fabric Cluster from the Azure Portal."
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
   ms.date="11/10/2015"
   ms.author="chackdan"/>

# Setting up a Service Fabric Cluster from the Azure Portal

This page helps you with setting up of a Service Fabric cluster. It is assumed that your subscription has enough cores to deploy the IaaS VMs that will make up this cluster

## Prerequisites for setting up a secure cluster

- If you want to set up a secure cluster, make sure to have uploaded the X509 certificates to your key vault. 
- Instructions on how to upload/Add  a certificate to key vault is here [link to key vault documentation](https://azure.microsoft.com/en-us/documentation/articles/key-vault-get-started/). You do not need to the "Register an application" or "Authorize the application.." Steps described in the above link. 

Make sure to take a note of the Source Vault URL, Certificate URL and the Certificate thumbprint. you will need these in setting up the secure service fabric cluster.The data you need will look like the following


1. **Resource ID of the KeyVault/Source Vault URL** : /subscriptions/6c653126-e4ba-42cd-a1dd-f7bf96af7a47/resourceGroups/chackdan-keyvault/providers/Microsoft.KeyVault/vaults/chackdan-kmstest
2. **URL to the Certificate location in the key Vault** : https://chackdan-kmstest.vault.azure.net:443/secrets/MyCert/dcf17bdbb86b42ad864e8e827c268431 
3. **Certificate ThumbPrint** : 2118C3BCE6541A54A0236E14ED2CCDD77EA4567A


## Creating the cluster

1. Log on to the Azure Portal [http://aka.ms/servicefabricportal](http://aka.ms/servicefabricportal).

2. Click on the **+ New** to add a new Resource Template. Search for our Template in the Marketplace under Everything - it is called **Service Fabric Cluster**
(you can navigate to **Everything** by clicking into the top level category - Marketplace > and then search for "Fabric" under "Everything" and press enter - Sometimes the auto filter does not work, so make sure to **press enter**)  
    ![SearchforServiceFabricClusterTemplate][SearchforServiceFabricClusterTemplate]

3. Select "Service Fabric Cluster" from the list
4. Navigate to the Service Fabric Cluster Blade and click on **Create** and provide details on your cluster
5. Create a **new Resource Group (RG)** - make it the same as the Cluster name - it is better for finding them later. it is especially useful, when you are trying to make changes to your deployment and/or delete your cluster.

  	Note - Although you can decide to use an existing resource group, it is a good practice to create a new resource group. 

 	 ![CreateRG][CreateRG]


6. Make sure to select the **subscription** you want your cluster to be deployed to, especially if you have multiple subsciptions..

7. Select a **location** from the dropdown (if you want to create it another location, else it will default to West US)

8. Configure your **Node Type**. The Node Type can be seen as equivalents to "Roles" in Cloud Services or PaaS v1. Your cluster can have more than one Node Type. The only constraint is that you will need atleast one NodeType (primary or the first one you define on the portal) to be of atleast 5 VMs.
	1. Select the VM size /Pricing tier you need. (default is D4 Standard, if you are just going to use this cluster for testing your application, it is fine to select D2 or any smaller size VM )	
	2. Choose the number of VMs, You can scale up or down the number of VMs in a NodeType later on, however the primary or the first node type has to have atleast 5 VMs
	3. Choose a name for your NodeType (1 to 12  characters in length containing only alphabets and numbers)	
	4. Choose the VM remote desktop User Name and Password
	5. **Node type considerations when you have multiple node types**. If you are planning to deploy a single Node type cluster, then skip to the next step.

		- To explain this concept, let us take an example.  If you wanted to deploy an application that contains  a "Front End" service and a "Back End" service and You want to put  the "Front End" service  on smaller VMs (VM sizes like A2, D2 etc) that have ports open to the internet and the "Back End" service that is compute intensive on larger VMs (with VM sizes like D4, D6, D12 etc) that are not internet facing.
		- Although, you can put both the services on one NodeType, it is recommended that you place them in a cluster with two node types, each node type can have distinct properties like internet connectivity and VM size and number of VMs that can be scalled independently.
		- Define the Node type that will end up having atleast 5 VMs first. The other node types can have a minimum of 1 VMs.
					

  	![CreateNodeType][CreateNodeType]

9. **Application ports**- If you plan to deploy your applications to the cluster right away, then Let us now add ports you want to open for your applications on this Node type (or the nodeTypes you have created). You can add  ports to the Node Type later on by  modifying the load balancer assocaited with this Node Type (you need to add a probe and then add the probe to the load blanancer rules). Doing it now, it a bit easier, since the portal automation will add the needed probes and rules to the LB. 
	1. You can find the application ports in your service manifests that are a part of the application package. Go to each of your applications, open up the service manifests and take note of all the  "input" endpoints your applications needs to communicate to the outside world.
	2. Add all the ports , comma separated  in the "Application input endpoints" field. The  TCP client connection end point - 19000 by default, so you do not need to specify them. For example my application needs port "83" to be open. You will find this in the servicemanifest.xml in your  application package (there could be more than one servicemanifest.xml).

  Most of the sample application use port 80 and 8081, so add them if you plan to deploy samples to this cluster.

  ![Ports][Ports]



1. **Optional:  Placement Properties**- you do not need to add any configurations here, a default placement property of the "NodeTypeName" is added by the sytem. If can choose to add more if your applcication has a need. 

  
## Security Configurations

Securing your cluster is optional but is highly recommended. If you choose not to secure your cluster, Then you need to set the Security Mode to "None".   

Details on security considerations and how to are documented at [Service Fabric Cluster security](service-fabric-cluster-security.md)

![SecurityConfigs][SecurityConfigs]


## Optional: Configuring diagnostics

By default, diagnostics are enabled on your cluster to assist with troubleshooting issues. If you would like to disable diagnostics:

1. Navigate to the Diagnostics Configurations blade.

2. Change the Status toggle to Off.

## Optional: Fabric Settings

This is an advanced option, that allows you to change the default settings for the service fabric cluster. it is recommended that you **not change** the defaults unless you are certain that your application and/or Cluster must have it.

## Completing cluster creation

After you have provided the mandatory settings, the create button will be enabled and you can start the cluster creation process.

You can see the progress in the NOTIFICATIONS (Click on the "Bell" icon near the status bar towards right of your screen). If you had clicked on the "Pin to Startboard" while creating the cluster, you will see "Deploying Service Fabric Cluster" pinned to the start board

![Notifications][Notifications]

## Viewing your cluster status

Once your deployment is complete, you can inspect your cluster in the portal.

1. Go to **Browse** and click on the resource - **Service  Fabric Clusters**.

2. Locate your cluster and click on it.

  ![BrowseCluster][BrowseCluster]

3. You can now see the details of your cluster in the dashboard, including the cluster's public IP Address. Note that hovering over **Cluster Public IP Address** will bring up a clipboard, which you can click to copy it.

  ![ClusterDashboard][ClusterDashboard]

  The Node Monitor Part on the Cluster Dashboard Blade, indicates the number of VMs that are healthy vs not healthy. you can find more details on the health state in the section [Service Fabric Health model introduction](service-fabric-health-introduction.md) of our documentation


## Connecting to the cluster and deploying an application

With the cluster setup, you can now connect and begin deploying applications.

1. On a machine that has the Service Fabric SDK installed, launch Windows PowerShell.

2. Run one of the following sets of PS commands depending on whether you created a secure or non-secure cluster.
 

	- Step 1 **connecting to an unsecure cluster**. 

````
Connect-serviceFabricCluster -ConnectionEndpoint <Cluster FQDN>:19000 -KeepAliveIntervalInSec 10 
````

Skip to the next step, if you not not connecting to a secure cluster.



- Step 2 **Connecting to a secure cluster**

Run the following to set up the certificate on the machine that you are going to use to run the "Connect-serviceFabricCluster" PS cmd

````
Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\My `
            -FilePath C:\docDemo\certs\DocDemoClusterCert.pfx `
            -Password (ConvertTo-SecureString -String test -AsPlainText -Force)
````

Run the following PS to now connect to a secure cluster. The cert details are the same ones that you gave on the portal

````
Connect-serviceFabricCluster -ConnectionEndpoint <Cluster FQDN>:19000 `
            -KeepAliveIntervalInSec 10 `
            -X509Credential -ServerCertThumbprint <Certificate Thumbprint> `
            -FindType FindByThumbprint -FindValue <Certificate Thumbprint> `
            -StoreLocation CurrentUser -StoreName My
````
For example the PS command above should look similar to the following.

````
Connect-serviceFabricCluster -ConnectionEndpoint sfcluster4doc.westus.cloudapp.azure.com:19000 `
            -KeepAliveIntervalInSec 10 `
            -X509Credential -ServerCertThumbprint C179E609BBF0B227844342535142306F3913D6ED `
            -FindType FindByThumbprint -FindValue C179E609BBF0B227844342535142306F3913D6ED `
            -StoreLocation CurrentUser -StoreName My
````


3. Run the following commands to deploy your application, replacing the paths shown with the appropriate ones on your machine.

  ![DeployApplication][DeployApplication]


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
- [Managing your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).
- [Service Fabric Cluster security](service-fabric-cluster-security.md)
- [Service Fabric Health model introduction](service-fabric-health-introduction.md)

<!--Image references-->
[SearchforServiceFabricClusterTemplate]: ./media/service-fabric-cluster-creation-via-portal/SearchforServiceFabricClusterTemplate.png
[CreateRG]: ./media/service-fabric-cluster-creation-via-portal/CreateRG.png
[CreateNodeType]: ./media/service-fabric-cluster-creation-via-portal/NodeType.png
[Ports]: ./media/service-fabric-cluster-creation-via-portal/ports.png
[SFConfigurations]: ./media/service-fabric-cluster-creation-via-portal/SFConfigurations.png
[SecurityConfigs]: ./media/service-fabric-cluster-creation-via-portal/SecurityConfigs.png
[Notifications]: ./media/service-fabric-cluster-creation-via-portal/notifications.png
[BrowseCluster]: ./media/service-fabric-cluster-creation-via-portal/browse.png
[ClusterDashboard]: ./media/service-fabric-cluster-creation-via-portal/ClusterDashboard.png
[SecureConnection]: ./media/service-fabric-cluster-creation-via-portal/SecureConnection.png
[DeployApplication]: ./media/service-fabric-cluster-creation-via-portal/DeployApplication.png
