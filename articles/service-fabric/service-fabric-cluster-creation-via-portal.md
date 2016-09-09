<properties
   pageTitle="Create a Service Fabric cluster from the Azure portal | Microsoft Azure"
   description="Create a Service Fabric cluster from the Azure Portal."
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
   ms.date="05/02/2016"
   ms.author="chackdan"/>


# Create a Service Fabric cluster from the Azure portal

This page helps you set up an Azure Service Fabric cluster. Your subscription must have enough cores to deploy the IaaS VMs that will make up this cluster.


## Search for the Service Fabric cluster resource

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Click **+ New** to add a new resource template. Search for your template in the **Marketplace** under **Everything**--it is called **Service Fabric Cluster**.

    a. At the top level, click **Marketplace**.

    b. Under **Everything**, enter "Fabric" and press Enter. Sometimes the auto filter does not work, so be sure to press Enter.
    ![Screen shot of searching for Service Fabric cluster template on the Azure portal.][SearchforServiceFabricClusterTemplate]

3. Select **Service Fabric Cluster** from the list.

4. Navigate to the **Service Fabric Cluster** blade, click **Create**,

5. You will now be presented with a **Create Service Fabric cluster** blade that lists out 4 steps.

## Step 1 - Basics

In the Basics blade you need to provide the basic details for your cluster.

1. Enter the name of your cluster.

2. Choose the **User Name** and **Password** for the VM remote desktop.

3. Make sure to select the **Subscription** that you want your cluster to be deployed to, especially if you have multiple subscriptions.

4. Create a **new resource group**, it is best to give it the same name as the cluster, since it helps in finding them later, especially when you are trying to make changes to your deployment or delete your cluster.

    >[AZURE.NOTE] Although you can decide to use an existing resource group, it is a good practice to create a new resource group. This makes it easy to delete clusters that you do not need.

 	![Screen shot of creating a new resource group.][CreateRG]


5. Select a **Location** from the drop-down list. The default value is **West US**. Press OK.

## Step 2 - Configure the cluster

10. Let me first tell you what a **Node Type** is. The node type can be seen as equivalent to roles in cloud services. Node types define the VM sizes, the number of VMs, and their properties. Your cluster can have more than one node type, but the primary node type (the first one that you define on the portal) must have at least five VMs. this is the node type were Service Fabric system services are placed. Consider the following to decide on your need for multiple Node types.

	* The application that you want to deploy contains a front-end service and a back-end service. You want to put the front-end service on smaller VMs (VM sizes like D2), and they have ports open to the Internet, but you want to put the back-end service, which is computation intensive, on larger VMs (with VM sizes like D4, D6, D15, and so on) that are not Internet facing.

	* Although you can put both the services on one node type, we recommended that you place them in a cluster with two node types. Each node type can have distinct properties like Internet connectivity, VM size, and the number of VMs that can be scaled independently.

	* Define a node type that will have at least five VMs first. The other node types can have a minimum of one VM.

13.  To configure your node type:

	a. Choose a name for your node type (1 to 12 characters containing only letters and numbers).

	b. The minimum size of VMs for the primary node type is driven by the durablity tier you choose for the cluster. The default for the durablity tier is Bronze. Read more on how to [choose the Service Fabric cluster reliability and durability](service-fabric-cluster-capacity.md) document.

	b. Select the VM size/pricing tier. The default is D4 Standard, but if you are just going to use this cluster for testing your application, you can select D2 or any smaller VM.

	c. The minimum number of VMs for the primary node type is driven by the reliablity tier you choose. The default for the reliablity tier is Silver. Read more on how to [choose the Service Fabric cluster reliability and durability](service-fabric-cluster-capacity.md) document.

	c. Choose the number of VMs for the node type. You can scale up or down the number of VMs in a node type later on, but on the primary node type, the minimum is driven by the reliablity level that you have choosen. Other node types can have a minimum of 1 VM.


  	![Screen shot of creating a node type.][CreateNodeType]

9. If you plan to deploy your applications to the cluster right away, then add ports that you want to open for your applications on an **Application ports** node type (or on node types that you created). You can add ports to the node type later by modifying the load balancer that is associated with this node type. (Add a probe and then add the probe to the load balancer rules.) Doing it now is a bit easier, since the portal automation will add the needed probes and rules to the load balancer:

	a. You can find the application ports in your service manifests, which are a part of the application package. Go to each of your applications, open the service manifests, and take note of all the input endpoints that your applications needs to communicate with the outside world.

	b. Add all the ports, comma separated, in the **Application input endpoints** field. The TCP client connection endpoint is 19000 by default, so you do not need to specify them. For example, the sample application WordCount needs port 83 to be open. You will find this in the servicemanifest.xml file in your application package. (There could be more than one servicemanifest.xml file.)

    c. Most of the sample applications use port 80 and 8081, so add them if you plan to deploy samples to this cluster.
    ![Ports][Ports]

10. You do not need to configure **Placement Properties** because a default placement property of "NodeTypeName" is added by the system. You can add more if your application requires it.

11. You do not need to configure **Capacity Properties** ,but is recommended, since you can use it in your applications to report load to the system and there by influencing the placement and resource balancing decisions that the system makes in the Service Fabric cluster. Read more on Service Fabric resource balancing starting with  [this document](service-fabric-cluster-resource-manager-architecture.md).

12. Continue the above steps for all the node types.

14. Configure cluster **diagnostics**. By default, diagnostics are enabled on your cluster to assist with troubleshooting issues. If you want to disable diagnostics change the **Status** toggle to **Off**. Turning off diagnostics is **not** recommended.

15. Optionally: Set the Service **Fabric cluster settings**, With this is advanced option, you can change the default settings for the Service Fabric cluster. We recommended that you do not change the defaults unless you are certain that your application or cluster requires it.

## Step 3- Configure security

Security scenarios and concepts are documented at [Service Fabric cluster security](service-fabric-cluster-security.md). At this time, Service Fabric supports securing clusters only via an X509 certificate, refer to [Secure a Service Fabric cluster on Azure using certificates](service-fabric-secure-azure-cluster-with-certs.md) for steps on how to do this.

Securing your cluster is optional but is highly recommended. If you choose not to secure your cluster, toggle the **Security Mode** to **Unsecure**. Please note - you **will not** be able to update an unsecure cluster to a secure one at a later time.

![Screen shot of security configurations on Azure portal.][SecurityConfigs]


## Step 4- Complete the cluster creation

To complete the cluster creation, click **Summary** to see the configurations that you have provided, or download the Azure Resource Manager template that will be used to deploy your cluster. After you have provided the mandatory settings, the **OK** button will be enabled and you can start the cluster creation process by clicking it.

You can see the creation progress in the notifications. (Click the "Bell" icon near the status bar at the upper-right of your screen.) If you clicked **Pin to Startboard** while creating the cluster, you will see **Deploying Service Fabric Cluster** pinned to the **Start** board.

![Screen shot of the start board displaying "Deploying Service Fabric Cluster." ][Notifications]

## View your cluster status

Once your cluster is created, you can inspect your cluster in the portal:

1. Go to **Browse** and click **Service Fabric Clusters**.

2. Locate your cluster and click it.
  ![Screen shot of finding your cluster in the portal.][BrowseCluster]

3. You can now see the details of your cluster in the dashboard, including the cluster's public IP address. Hovering over **Cluster Public IP Address** will bring up a clipboard, which you can click to copy the address.
  ![Screen shot of cluster details in the dashboard.][ClusterDashboard]

  The **Node Monitor** section on the cluster's dashboard blade indicates the number of VMs that are healthy and not healthy. You can find more details about the cluster's health at [Service Fabric health model introduction](service-fabric-health-introduction.md).

>[AZURE.NOTE] Service Fabric clusters require a certain number of nodes to be up at all times in order to maintain availability and preserve state - referred to as "maintaining quorum". Consequently, it is typically not safe to shut down all of the machines in the cluster unless you have first performed a [full backup of your state](service-fabric-reliable-services-backup-restore.md).

## Connect to the cluster and deploy an application

With the cluster setup completed, you can now connect and begin deploying applications. Start by starting Windows PowerShell on a machine that has the Service Fabric SDK installed. Then, to connect to the cluster, run one of the following sets of PowerShell commands depending on whether you created a secure or unsecure cluster:

### Connect to an unsecure cluster

```powershell
Connect-serviceFabricCluster -ConnectionEndpoint <Cluster FQDN>:19000 -KeepAliveIntervalInSec 10
```

### Connect to a secure cluster

1. Run the following to set up the certificate on the machine that you are going to use to run the "Connect-serviceFabricCluster" PowerShell command.

    ```powershell
    Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\My `
            -FilePath C:\docDemo\certs\DocDemoClusterCert.pfx `
            -Password (ConvertTo-SecureString -String test -AsPlainText -Force)
    ```

2. Run the following PowerShell command to connect to a secure cluster. The certificate details are the same ones that you gave on the portal.

    ```powershell
    Connect-serviceFabricCluster -ConnectionEndpoint <Cluster FQDN>:19000 `
              -KeepAliveIntervalInSec 10 `
              -X509Credential -ServerCertThumbprint <Certificate Thumbprint> `
              -FindType FindByThumbprint -FindValue <Certificate Thumbprint> `
              -StoreLocation CurrentUser -StoreName My
    ```

    For example, the PowerShell command above should look similar to the following:

    ```powershell
    Connect-serviceFabricCluster -ConnectionEndpoint sfcluster4doc.westus.cloudapp.azure.com:19000 `
              -KeepAliveIntervalInSec 10 `
              -X509Credential -ServerCertThumbprint C179E609BBF0B227844342535142306F3913D6ED `
              -FindType FindByThumbprint -FindValue C179E609BBF0B227844342535142306F3913D6ED `
              -StoreLocation CurrentUser -StoreName My
    ```

### Deploy your app
Now that you are connected, run the following commands to deploy your application, replacing the paths shown with the appropriate ones on your machine. The example below deploys the word count sample application:

1. Copy the package to the cluster that you connected to previously.

    ```powershell
    $applicationPath = "C:\VS2015\WordCount\WordCount\pkg\Debug"
    ```

    ```powershell
    Copy-ServiceFabricApplicationPackage -ApplicationPackagePath $applicationPath -ApplicationPackagePathInImageStore "WordCount" -ImageStoreConnectionString fabric:ImageStore
    ```
2. Register your application type with Service Fabric.

    ```powershell
    Register-ServiceFabricApplicationType -ApplicationPathInImageStore "WordCount"
    ```

3. Create a new instance on the application type that you just registered.

    ```powershell
    New-ServiceFabricApplication -ApplicationName fabric:/WordCount -ApplicationTypeName WordCount -ApplicationTypeVersion 1.0.0.0
    ```

4. Now open the browser of your choice and connect to the endpoint that the application is listening on. For the sample application WordCount, the URL looks like this:

    http://sfcluster4doc.westus.cloudapp.azure.com:31000

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->

## Remote connect to a Virtual Machine Scale Set instance or a cluster node

Each of the NodeTypes you specify in your cluster results in a VM Scale Set getting set up. Refer to [Remote connect to a VM Scale Set instance](service-fabric-cluster-nodetypes.md#remote-connect-to-a-vm-scale-set-instance-or-a-cluster-node) for details.

## Next steps

After you've created a cluster, learn more about securing it and deploying apps:
- [Managing your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md)
- [Service Fabric cluster security](service-fabric-cluster-security.md)
- [Service Fabric health model introduction](service-fabric-health-introduction.md)


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
