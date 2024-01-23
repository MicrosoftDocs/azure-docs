---
title: Manage HDInsight on AKS clusters using .NET SDK (Preview)
description: Manage HDInsight on AKS clusters using .NET SDK.
ms.service: hdinsight-aks
ms.custom: devx-track-dotnet
ms.topic: how-to
ms.date: 11/23/2023
---
# Manage HDInsight on AKS clusters using .NET SDK

This article describes how you can create and manage cluster in Azure HDInsight on AKS using .NET SDK.
 
The HDInsight .NET SDK provides .NET client libraries, so that it's easier to work with HDInsight clusters from .NET. 

## Prerequisites

- Visual Studio 
- Create a Resource group in your Azure Subscription 
- Create an [ADLS Gen2](/azure/storage/blobs/data-lake-storage-introduction) storage account in the same resource group 
- Create a Managed Identity in the same resource group

## Steps to create a cluster using .NET SDK

1. Log in to Visual Studio and create a project folder 
1. In project folder, add the following dependencies  
	- Azure Identity 
	- Azure Resource Manager 
	- Azure.ResourceManager.HDinsight.Containers

	:::image type="content" source="./media/sdk-cluster-creation/solution-explorer.png" alt-text="Screenshot shows solution explorer." lightbox="./media/sdk-cluster-creation/solution-explorer.png":::

1. Provide the required parameters to config the cluster pool and cluster in the script: 
	- Cluster Name 
	- Cluster Pool Name 
	- Subscription ID 
	- Resource Group Name 
	- Region Name 
	- Cluster Type 
	- SKU 
	- Worker Node count 
	- MSI resource ID: 
	  `/subscriptions/<subscription ID>/resourcegroups/{resource group 	name}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{Managed identity name}`
	- MSI client ID
	- MSI object ID
	  
		:::image type="content" source="./media/sdk-cluster-creation/overview.png" alt-text="Screenshot shows overview." lightbox="./media/sdk-cluster-creation/overview.png":::
	  
	- Microsoft Entra user ID: [Find tenant ID, domain name, user object ID - Partner Center | Microsoft Learn](/partner-center/find-ids-and-domain-names)
	- [HDInsight on AKS VM list](/azure/hdinsight-aks/virtual-machine-recommendation-capacity-planning)

Copy the following .NET code to the Visual Studio project file 

```
using Azure.Core; 

using Azure.Identity; 

using Azure.ResourceManager.HDInsight.Containers.Models; 

using Azure.ResourceManager.HDInsight.Containers; 

using Azure.ResourceManager.Resources; 

using Azure.ResourceManager; 

 

namespace HDInsightOnAksManagementPlanSdkDemo 

{ 

    public class Program 

    { 

        public static void Main(string[] args) 

        { 

            Demo_CreateClusterPool(); 

 

            Demo_CreateClusterWithExistingClusterPool(); 

 

        } 

 

 

        public static void Demo_CreateClusterPool() 

        { 

            /** 

             * Create HDInsight On Aks cluster pool steps: 

             *  

             * step1: create an authenticated client to interact with HDInsight On Aks resources 

             * step2: provide the subscription id, resource group and location where you want to create the cluster pool resource 

             * step3: provide the required parameters to config the cluster pool like cluster pool name, cluster pool VM size, cluster pool version and so on. 

             * step4: then call clusterPoolCollection.CreateOrUpdate method to create cluster pool 

             */ 

 

            // Authenticate the client 

            var credential = new AzurePowerShellCredential(); 

            var armClient = new ArmClient(credential); 

 

            // define the prerequisites information: subscription, resource group and location where you want to create the resource 

            string subscriptionResourceId = "{your subscription id}"; // your subscription resource id like /subscriptions/{subscription id} 

            string resourceGroupName = "{your resource group name}"; // your resource group name 

            AzureLocation location = AzureLocation.WestUS2; 

 

            SubscriptionResource subscription = armClient.GetSubscriptionResource(new ResourceIdentifier(resourceId: subscriptionResourceId)); 

            ResourceGroupResource resourceGroupResource = subscription.GetResourceGroup(resourceGroupName); 

            HDInsightClusterPoolCollection clusterPoolCollection = resourceGroupResource.GetHDInsightClusterPools(); 

 

            // create the cluster pool 

            string clusterPoolName = "{your cluster pool name}"; 

            string clusterPoolVmSize = "Standard_E4s_v3"; 

 

            // get the available cluster pool version 

            var availableClusterPoolVersion = subscription.GetAvailableClusterPoolVersionsByLocation(location).FirstOrDefault(); 

 

            // initialize the ClusterPoolData instance 

            HDInsightClusterPoolData clusterPoolData = new HDInsightClusterPoolData(location) 

            { 

                ComputeProfile = new ClusterPoolComputeProfile(clusterPoolVmSize), 

                ClusterPoolVersion = availableClusterPoolVersion?.ClusterPoolVersionValue, 

            }; 

 

            System.Console.WriteLine("Start to create cluster pool..."); 

 

            var clusterPoolResult = clusterPoolCollection.CreateOrUpdate(Azure.WaitUntil.Completed, clusterPoolName, clusterPoolData); 

 

            System.Console.WriteLine($"Created cluster pool with name {clusterPoolResult.Value.Data.Name} successfully."); 

        } 

 

        public static void Demo_CreateClusterWithExistingClusterPool() 

        { 

            /** 

             * Create HDInsight On Aks cluster under existing cluster pool: 

             *  

             * step1: create an authenticated client to interact with HDInsight On Aks resources 

             * step2: provide the subscription id, resource group and location where you want to create the cluster pool resource 

             * step3: provide the required parameters to create cluster: cluster pool name, cluster name, cluster type, cluster version, identity profile, authorization profile 

             * cluster node profile and so on. 

             * step4: then call clusterCollection.CreateOrUpdate method to create cluster 

             */ 

 

            // Authenticate the client 

            var credential = new AzurePowerShellCredential(); //new DefaultAzureCredential(); 

            var armClient = new ArmClient(credential); 

 

            // define the prerequisites information: subscription, resource group and location where you want to create the resource 

            string subscriptionResourceId = "{your subscription resource id}"; // your subscription resource id like /subscriptions/{subscription id} 

            string resourceGroupName = "{your resource group name}"; // your resource group name 

            string location = AzureLocation.WestUS2; 

 

            SubscriptionResource subscription = armClient.GetSubscriptionResource(new ResourceIdentifier(resourceId: subscriptionResourceId)); 

            ResourceGroupResource resourceGroupResource = subscription.GetResourceGroup(resourceGroupName); 

            HDInsightClusterPoolCollection clusterPoolCollection = resourceGroupResource.GetHDInsightClusterPools(); 

 

            // create the cluster 

            string clusterPoolName = "{your cluster pool name}"; 

            string clusterName = "{your cluster name}"; 

            string clusterType = "Trino"; 

 

            // get the available cluster version 

            var availableClusterVersion = subscription.GetAvailableClusterVersionsByLocation(location).Where(version => version.ClusterType.Equals(clusterType, StringComparison.OrdinalIgnoreCase)).FirstOrDefault(); 

 

            // set the identity profile 

            string msiResourceId = "{your msi resource id}"; // your user msi resource id pre created 

            string msiClientId = "{your msi client id}"; 

            string msiObjectId = "{your msi object id}"; 

            var identityProfile = new HDInsightIdentityProfile(msiResourceId: new ResourceIdentifier(msiResourceId), msiClientId: msiClientId, msiObjectId: msiObjectId); 

 

 

            // set the authorization profile 

            var userId = "{your aad user id}"; 

            var authorizationProfile = new AuthorizationProfile(); 

            authorizationProfile.UserIds.Add(userId); 

 

            // set the cluster node profile 

            string vmSize = "Standard_D8d_v5"; 

            int workerCount = 5; 

            ClusterComputeNodeProfile nodeProfile = new ClusterComputeNodeProfile(nodeProfileType: "worker", vmSize: vmSize, count: workerCount); 

 

            // initialize the ClusterData instance 

            var clusterData = new HDInsightClusterData(location) 

            { 

                ClusterType = clusterType, 

 

                ComputeNodes = new List<ClusterComputeNodeProfile>() { nodeProfile }, 

 

                ClusterProfile = new ClusterProfile(clusterVersion: availableClusterVersion?.ClusterVersion, ossVersion: availableClusterVersion?.OssVersion, identityProfile: identityProfile, authorizationProfile: authorizationProfile) 

                { 

                    TrinoProfile = new TrinoProfile(), 

                }, 

 

            }; 

 

            var clusterCollection = clusterPoolCollection.Get(clusterPoolName).Value.GetHDInsightClusters(); 

 

            System.Console.WriteLine("Start to create cluster..."); 

 

            var clusterResult = clusterCollection.CreateOrUpdate(Azure.WaitUntil.Completed, clusterName, clusterData); 

 

            System.Console.WriteLine($"Created cluster with name {clusterResult.Value.Data.Name} successfully."); 

        }

```

Click on the Run button.
 
## Management plane SDKs 

#### .NET   
- [.NET SDK Package](https://www.nuget.org/packages/Azure.ResourceManager.HDInsight.Containers/1.0.0-beta.1)
- [Azure HDInsight Containers SDK for .NET - Azure for .NET Developers](/dotnet/api/overview/azure/hdinsight-containers) 

#### Java 
- [Java SDK Package](https://mvnrepository.com/artifact/com.azure.resourcemanager/azure-resourcemanager-hdinsight-containers)
- [Azure Hdinsight-Containers SDK for Java](/java/api/overview/azure/hdinsight-containers) 

#### TypeScript 

- [TypeScript SDK Package](https://www.npmjs.com/package/@azure/arm-hdinsightcontainers) 
- [Azure Hdinsightcontainers SDK for JavaScript](/javascript/api/overview/azure/hdinsightcontainers) 

#### Python 
- [Python SDK Package](https://pypi.org/project/azure-mgmt-hdinsightcontainers/) 
- [Azure Hdinsightcontainers SDK for Python](/python/api/overview/azure/hdinsightcontainers) 

#### GO
- [GO SDK Package](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/resourcemanager/hdinsightcontainers/armhdinsightcontainers)
- [Azure Hdinsightcontainers SDK for GO](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/hdinsightcontainers/armhdinsightcontainers)

## Next steps

There are extensive ways supported to customize and manage cluster using .NET SDK. Review the following documentation: 
- [Azure Resource Manager HDInsight Containers](/dotnet/api/overview/azure/resourcemanager.hdinsight.containers-readme) 
- [Azure.ResourceManager.HDInsight.Containers GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/hdinsight/Azure.ResourceManager.HDInsight.Containers) 

 
 

 

 
