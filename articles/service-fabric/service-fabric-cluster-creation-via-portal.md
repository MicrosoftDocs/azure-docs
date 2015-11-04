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
   ms.date="10/29/2015"
   ms.author="chackdan"/>

# Setting up a Service Fabric Cluster from the Azure Portal

This page helps you with setting up of a Service Fabric Cluster. It is assumed that your subscription has enough cores to deploy the IaaS VMs that will make up this cluster

## Prerequisites

- If you want to set up a secure cluster, make sure to have uploaded an X509 certificate to your key vault. you will need the Source Vault URL, Certificate URL and the Certificate thumbprint
- instructions on how to is here (link to key vault documentation)

## Creating the cluster

1. Log on to the Azure Portal [http://aka.ms/servicefabricportal](http://aka.ms/servicefabricportal).

2. Click on the **+** to add a new Resource Template. Search for our Template under Everything - **Service Fabric Cluster**
(you can navigate to **Everything** by clicking into the top level category - Marketplace > and then search for "Fabric" and press enter - Sometimes the auto filter does not work, so make sure to press enter)  
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

9. **Application ports**- Let us now add ports you want to open for your applications. This is *not an optional step*.  Go to each of your applications, open up the service manifests and take note of all the  "input" endpoints your applications needs to communicate to the outside world…

10. Add all the ports , comma separated  in the "Application input endpoints" field. The  TCP client connection end point - 19000 by default, so you do not need to specify them. For example my application needs port "83" to be open. You will find this in the servicemanifest.xml in your  application package (there could be more than one servicemanifest.xml).

  Most of the sample application use port 80 and 8081, so add them if you plan to deploy samples to this cluster.

  ![Ports][Ports]

  Optionally, you can use the fabric settings to override some of the cluster configurations. If you are unsure, it is best not to override any values here.
  >[AZURE.NOTE] Note once you add a name value pair, clicking on **...** will open up another empty set that you can use to add new ones.

  ![SFConfigurations][SFConfigurations]

## Optional: Securing the cluster

Securing your cluster is optional but is highly recommended. If you choose not to secure your cluster, it will be open to anyone who knows your endpoint URL.

At this time, Service Fabric only supports securing clusters via an X509 certificate. Before starting this process, you will need to upload your certificate to KeyVault.

1. Navigate to the Security Configurations blade.

2. Fill in the details for the certificate that you uploaded to KeyVault. Use the help icon beside each field for formatting instructions.

  ![SecurityConfigs][SecurityConfigs]

## Optional: Configuring diagnostics

By default, diagnostics are enabled on your cluster to assist with troubleshooting issues. If you would like to disable diagnostics:

1. Navigate to the Diagnostics Configurations blade.

2. Change the Status toggle to Off.

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

2. Run one of the following sets of commands depending on whether you created a secure or non-secure cluster.

  ![SecureConnection][SecureConnection]

3. Run the following commands to deploy your application, replacing the paths shown with the appropriate ones on your machine.

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
