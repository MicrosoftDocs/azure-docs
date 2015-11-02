<properties
   pageTitle="Setting up a Service Fabric Cluster from the Azure Portal"
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
   ms.date="09/22/2015"
   ms.author="chackdan"/>

# Setting up a Service Fabric Cluster from the Azure Portal

This page helps you with setting up of a Service Fabric Cluster. It is assumed that your subscription has enough cores to deploy the IaaS VMs that will make up this cluster

**Prerequisite**
- If you want to set up a secure cluster, make sure to have uploaded an X509 certificate to your key vault. you will need the Source Vault URL, Certificate URL and the Certificate thumbprint 
- instructions on how to is here (link to key vault documentation)

**Instructions to set up a service fabric cluster using the portal**

1. Log on to the Azure Portal [http://aka.ms/servicefabricportal](http://aka.ms/servicefabricportal).

2. Click on the **+** to add a new Resource Template. Search for our Template under Everything - **Service Fabric Cluster**
(you can navigate to **Everything** by clicking into the top level category - Marketplace > and then search for "Fabric" and press enter - Sometimes the auto filter does not work, so make sure to press ent)  
    ![SearchforServiceFabricClusterTemplate][SearchforServiceFabricClusterTemplate]
 
3. Select "Service Fabric Cluster" from the list
4. Navigate to the Service Fabric Cluster Blade and click on **Create**
5. Create a **new Resource Group (RG)** - make it the same as the Cluster name - it is better for finding them later.

  Note - Although you can decide to use an existing resource group, it is a good practice to create a new resource group 


![CreateRG][CreateRG] 

6. Make sure to select the a **subscription** (if you have multiple, or a default was not selected by the system).
7. Select a **location** from the dropdown (if you want to create it another location, else it will default to West US)
8. Configure your **Node Type**
	- Select the VM size /Pricing tier you need. (default is D4, if you are just going to use this for testing your application, it is fine to select D2 or any smaller size VM )
	- Choose the number of VMs (if you are unsure, just select 5 to start with)
	- Choose the VM remote desktop User Name and Password
	
![CreateNodeType][CreateNodeType]

8. **Application ports**- Let us now add ports you want to open for your applications. This is *not an optional step*.  Go to each of your applications, open up the service manifests and take note of all the  "input" endpoints your applications needs to communicate to the outside world… 
9. Add all the ports , comma separated  in the "Application input endpoints" field. The  TCP client connection end point - 19000 by default, so you do not need to specify them.

- for example my application needs port "83" to be open. You will find this in the servicemanifest.xml in your  application package (there could be more than one servicemanifest.xml).
	
Most of the sample application use port 80 and 8081, so add them if you plan to deploy samples to this cluster.

![Ports][Ports] 

Optionally, you can use the fabric settings to override some of the cluster configurations. If you are unsure, it is best not to override any values here. 
Note - once you add a name value pair, clicking on **...** will open up another empty set that you can use to add new ones.

![SFConfigurations][SFConfigurations]


9. **Securing your cluster** (*optional , but recommended step*)
	
-  Navigate to the Security Configurations blade
-  Default security for the cluster is "None".
-  It is strongly recommended that you secure your cluster. Use a x509 cert for this. you need to upload your cert to key vault.
**Note** -  click on the "Balloon help Icon" beside the fields for the format in which you will need to enter the values.
![SecurityConfigs][SecurityConfigs]
10. **Diagonstics Configurations** (*optional *) 
	-  Navigate to the Diagnostics Configurations blade
	-  Default is "On". This will enable Azure Diagnostics (WAD) extension in your VM, with default parameters.
	-  If you change the value to "Off", then the WAD will not be enabled for your VM.

10. After you have provided the mandatory settings, the create button will be enabled and you can start the cluster creation process.
11. You can see the progress in the NOTIFICATIONS (Click on the "Bell" icon near the status bar towards right of your screen). If you had clicked on the "Pin to Startboard" while creating the cluster, you will see "Deploying Service Fabric Cluster" pinned to the start board

![Notifications][Notifications]

12. Once your deployment is complete, Go to **Browse** and click on the resource - **Service  Fabric Clusters**
Locate your cluster and click on it.. 

![BrowseCluster][BrowseCluster]

13. You can now see the details of your cluster on the Cluster Dashboard Essentials part.. You can now deploy to the cluster using the Cluster Public IP Address. 
 Note - you may have to scroll down in the essentials part to locate the **Cluster Public IP Address**, hovering over that value will bring up a clipboard, which you can click to copy it.
![ClusterDashboard][ClusterDashboard]

The Node Monitor Part on the Cluster Dashboard Blade, indicates the number of VMs that are healthy vs not healthy. you can find more details on the health state in the section [Service Fabric Health model introduction](service-fabric-health-introduction.md) of our documentation



14.
 **connect to the Azure Service Fabric Cluster** - Now let us connect to the cluster and deploy your applications 

- From a machine that has the service fabric SDK installed or have the service fabric client package installed, run the following
- Open up PS/PS ISE and run the following commands. Run only one set (unsecure or secure)

![SecureConnection][SecureConnection]

15.**Deploying Applications to an azure cluster** - you are now ready to deploy to cluster that you are now connected. I have used the word count sample application to illustrate the Powershell commands you can use to deploy your application to the cluster.

![DeployApplication][DeployApplication]


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
- [Managing your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).
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
