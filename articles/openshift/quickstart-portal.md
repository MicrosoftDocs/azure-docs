---
title: Deploy an Azure Red Hat OpenShift cluster using the Azure portal
description: Deploy an Azure Red Hat OpenShift cluster using the Azure portal
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: quickstart
ms.date: 02/14/2023
ms.custom: mode-ui
---

# Quickstart: Deploy an Azure Red Hat OpenShift cluster using the Azure portal  

Azure Red Hat OpenShift is a managed OpenShift service that lets you quickly deploy and manage clusters. In this quickstart, we'll deploy an Azure Red Hat OpenShift cluster using the Azure portal.           

## Prerequisites
Sign in to the [Azure portal](https://portal.azure.com). 

Create a service principal, as explained in [Use the portal to create an Azure AD application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md). **Be sure to save the client ID and the appID.** 

Register the `Microsoft.RedHatOpenShift` resource provider. For instructions on registering resource providers using Azure portal, see [Register resource provider](/azure/azure-resource-manager/management/resource-providers-and-types#register-resource-provider).

## Create an Azure Red Hat OpenShift cluster
1.	On the Azure portal menu or from the **Home** page, select **All Services** under three horizontal bars on the top left hand page.
2.	Select **Containers** > **Azure Red Hat OpenShift**.
3.	On the **Basics** tab, configure the following options:
    * **Project details**:
        *	Select an **Azure Subscription**.
        *	Select or create an **Azure Resource group**, such as *myResourceGroup*.
    * **Cluster details**:
        * Select a **Region** for the Azure Red Hat OpenShift cluster.
        *	Enter a OpenShift **cluster name**, such as *myAROCluster*.
        *	Enter **Domain name**.
        *	Select **Master VM Size** and **Worker VM Size**.

    ![**Basics** tab on Azure portal](./media/Basics.png)
    
    > [!NOTE]
    > In the **Domain name** field, you can either specify a domain name (e.g., *example.com*) or a prefix (e.g., *abc*) that will be used as part of the auto-generated DNS name for OpenShift console and API servers. This prefix is also used as part of the name of the resource group (e.g., *aro-abc*) that is created to host the cluster VMs.

4. On the **Authentication** tab of the **Azure Red Hat OpenShift** dialog, complete the following sections.

    In the **Service principal information** section:

   - **Service principal client ID** is your appId. 
   - **Service principal client secret** is the service principal's decrypted Secret value.

    If you need to create a service principal, see  [Creating and using a service principal with an Azure Red Hat OpenShift cluster](howto-create-service-principal.md).
    
   In the **Cluster pull secret** section:

   - **Pull secret** is your cluster's pull secret's decrypted value. If you don't have a pull secret, leave this field blank.

   :::image type="content" source="./media/openshift-service-principal-portal.png" alt-text="Screenshot that shows how to use the Authentication tab with Azure portal to create a service principal." lightbox="./media/openshift-service-principal-portal.png":::

5.	On the **Networking** tab, which follows, make sure to configure the required options.

   **Note**: Azure Red Hat OpenShift clusters running OpenShift 4 require a virtual network with two empty subnets: one for the control plane and one for worker nodes.

![**Networking** tab on Azure portal](./media/Networking.png)

6.	On the **Tags** tab, add tags to organize your resources.

![**Tags** tab on Azure portal](./media/Tags.png)
 
7.	Check **Review + create** and then **Create** when validation completes.   

![**Review + create** tab on Azure portal](./media/Review+Create.png)
 
8.	It takes approximately 35 to 45 minutes to create the Azure Red Hat OpenShift cluster. When your deployment is complete, navigate to your resource by either:
    *	Clicking **Go to resource**, or
    *	Browsing to the Azure Red Hat OpenShift cluster resource group and selecting the Azure Red Hat OpenShift resource.
        *	Per example cluster dashboard below: browsing for *myResourceGroup* and selecting *myAROCluster* resource.