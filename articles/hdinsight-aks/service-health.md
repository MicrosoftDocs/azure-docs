---
title: Manage service health.
description: Learn how to check the health of the services running in a cluster.
ms.service: hdinsight-aks
ms.topic: conceptual
ms.date: 08/29/2023
---

# Manage service health

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This article describes how to check the health of the services running in HDInsight on AKS cluster. It includes the collection of the services and the status of each service running in the cluster. 
You can drill down on each service to check instance level details.

There are two categories of services:

* **Main Services:** Core services with respect to each cluster type.

* **Internal Services:** Ancillary services, which help in the proper functioning of the cluster directly/indirectly.

> [!NOTE]
> To view details in the Services tab, a user should be assigned [Azure Kubernetes Service Cluster User Role](/azure/role-based-access-control/built-in-roles#azure-kubernetes-service-cluster-user-role) and [Azure Kubernetes Service RBAC Reader](/azure/role-based-access-control/built-in-roles#azure-kubernetes-service-rbac-reader) roles to an AKS cluster corresponding to the cluster pool. Go to Kubernetes services in the Azure portal and search for AKS cluster with your cluster pool name and then navigate to Access control (IAM) tab to assign the roles.
>
> If you don't have permission to assign the roles, please contact your admin.

To check the service health, 

1. Sign in to [Azure portal](https://portal.azure.com).
  
1. In the Azure portal search bar, type "HDInsight on AKS cluster" and select "Azure HDInsight on AKS clusters" from the drop-down list.
  
   :::image type="content" source="./media/service-health/get-started-portal-search-step-1.png" alt-text="Screenshot showing search option for getting started with HDInsight on AKS Cluster." border="true" lightbox="./media/service-health/get-started-portal-search-step-1.png":::
  
1. Select your cluster name from the list page.
  
   :::image type="content" source="./media/service-health/get-started-portal-list-view-step-2.png" alt-text="Screenshot showing selecting the HDInsight on AKS Cluster you require from the list." border="true" lightbox="./media/service-health/get-started-portal-list-view-step-2.png"::: 
   
1. Go to the **Services** blade for your cluster in the Azure portal.
   
    :::image type="content" source="./media/service-health/list-of-workload-servers.png" alt-text="Screenshot showing list of workload servers." border="true" lightbox="./media/service-health/list-of-workload-servers.png":::
   
1. Click on one of the listed services to drill down and view.
   
    :::image type="content" source="./media/service-health/zookeeper-service-health.png" alt-text="Screenshot showing Zookeeper's service health." lightbox="./media/service-health/zookeeper-service-health.png":::

            
   In case when some of the instances of the services aren't ready then, the **Ready** column indicates the warning sign for the unhealthy instances running in the cluster out of total instances. 

   You can drill down further to see the details.
   
    :::image type="content" source="./media/service-health/trino-service-health.png" alt-text="Screenshot showing Trino's service health." lightbox="./media/service-health/trino-service-health.png":::
      
