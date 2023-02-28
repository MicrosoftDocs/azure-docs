---
title: Deploy a Service Fabric managed cluster using the Azure portal
description: Learn how to create a Service Fabric managed cluster using the Azure portal
author: tomvcassidy
ms.topic: quickstart
ms.service: service-fabric
services: service-fabric
ms.author: tomcassidy
ms.date: 03/02/2022
---

# Quickstart: Deploy a Service Fabric managed cluster using the Azure portal

Test out Service Fabric managed clusters in this quickstart by creating a **three-node Basic SKU cluster**.

Azure Service Fabric is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices and containers. A Service Fabric cluster is a network-connected set of virtual machines onto which your microservices are deployed and managed.

Service Fabric managed clusters are an evolution of the Azure Service Fabric cluster resource model. Managed clusters streamline your deployment and cluster management experience. Service Fabric managed clusters are fully-encapsulated resources that save you the effort of manually deploying all the underlying resources that make up a Service Fabric cluster.

In this quickstart, you learn how to:

* Use Azure Key Vault to create a client certificate for your managed cluster
* Deploy a Service Fabric managed cluster
* View your managed cluster in Service Fabric Explorer

This article describes how to deploy a Service Fabric managed cluster for testing in Azure using the **Azure portal**. There is also a quickstart for [Azure Resource Manager templates](quickstart-managed-cluster-template.md).

The three-node Basic SKU cluster created in this tutorial is only intended for instructional purposes. The cluster will use a self-signed certificate for authentication and will operate in the bronze reliability tier, so it's not suitable for production workloads. For more information on SKUs, see [Service Fabric managed cluster SKUs](overview-managed-cluster.md#service-fabric-managed-cluster-skus). For more information about reliability tiers, see [Reliability characteristics of the cluster](service-fabric-cluster-capacity.md#reliability-characteristics-of-the-cluster).

## Prerequisites

* An Azure subscription. If you don't already have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* A resource group to manage all the resources you use in this quickstart. We use the example resource group name **ServiceFabricResources** throughout this quickstart.

   1. Sign in to the [Azure portal](https://portal.azure.com).

   1. Select **Resource groups** under **Azure services**.

   1. Choose **+ Create**, select your Azure subscription, enter a name for your resource group, and pick your preferred region from the dropdown menu.

   1. Select **Review + create** and, once the validation passes, choose **Create**.

## Create a client certificate

Service Fabric managed clusters use a client certificate as a key for access control.

In this quickstart, we use a client certificate called **ExampleCertificate** from an Azure Key Vault named **QuickstartSFKeyVault**.

To create your own Azure Key Vault:

1. In the [Azure portal](https://portal.azure.com), select **Key vaults** under **Azure services** and select **+ Create**. Alternatively, select **Create a resource**, enter **Key Vault** in the `Search services and marketplace` box, choose **Key Vault** from the results, and select **Create**.

1. On the **Create a key vault** page, provide the following information:
    - `Subscription`: Choose your Azure subscription.
    - `Resource group`: Choose the resource group you created in the prerequisites or create a new one if you didn't already. For this quickstart, we use **ServiceFabricResources**.
    - `Name`: Enter a unique name. For this quickstart, we use **QuickstartSFKeyVault**.
    - `Region`: Choose your preferred region from the dropdown menu.
    - Leave the other options as their defaults.

1. Select **Review + create** and, once the validation passes, choose **Create**.

To generate and retrieve your client certificate:

1. In the [Azure portal](https://portal.azure.com), navigate to your Azure Key Vault.

1. Under **Settings** in the pane on the left, select **Certificates**.

   ![Screenshot of Certificates tab under Settings in the left pane, PNG.](./media/quickstart-managed-cluster-portal/key-vault-settings-certificates.png)

1. Choose **+ Generate/Import**.

1. On the **Create a certificate** page, provide the following information:
    - `Method of Certificate Creation`: Choose **Generate**.
    - `Certificate Name`: Use a unique name. For this quickstart, we use **ExampleCertificate**.
    - `Type of Certificate Authority (CA)`: Choose **Self-signed certificate**.
    - `Subject`: Use a unique domain name. For this quickstart, we use **CN=ExampleDomain**.
    - Leave the other options as their defaults.

1. Select **Create**.

1. Your certificate will appear under **In progress, failed or canceled**. You may need to refresh the list for it to appear under **Completed**. Once it's completed, select it and choose the version under **CURRENT VERSION**.

1. Select **Download in PFX/PEM format** and select **Download**. The certificate's name will be formatted as `yourkeyvaultname-yourcertificatename-yyyymmdd.pfx`.

   ![Screenshot of Download in PFX/PEM format button used to retrieve your certificate so you can import it into your computer's certificate store, PNG.](./media/quickstart-managed-cluster-portal/download-pfx.png)

1. Import the certificate to your computer's certificate store so that you may use it to access your Service Fabric managed cluster later.

   >[!NOTE]
   >The private key included in this certificate doesn't have a password. If your certificate store prompts you for a private key password, leave the field blank.

Before you create your Service Fabric managed cluster, you need to make sure Azure Virtual Machines can retrieve certificates from your Azure Key Vault. To do so:

1. In the [Azure portal](https://portal.azure.com), navigate to your Azure Key Vault.

1. Under **Settings** in the pane on the left, select **Access configuration**.

   ![Screenshot of Access policies tab under Settings in the left pane, PNG.](./media/quickstart-managed-cluster-portal/key-vault-settings-access-policies.png)

1. Toggle **Azure Virtual Machines for deployment** under **Enable access to:**.

1. Save your changes.

## Create your Service Fabric managed cluster

In this quickstart, we use a Service Fabric managed cluster named **quickstartsfcluster**.

1. In the [Azure portal](https://portal.azure.com), select **Create a resource**, enter **Service Fabric** in the `Search services and marketplace` box, choose **Service Fabric Managed Cluster** from the results, and select **Create**.

1. On the **Create a Service Fabric managed cluster** page, provide the following information:
    - `Subscription`: Choose your Azure subscription.
    - `Resource group`: Choose the resource group you created in the prerequisites or create a new one if you didn't already. For this quickstart, we use **ServiceFabricResources**.
    - `Name`: Enter a unique name. For this quickstart, we use **quickstartsfcluster**.
    - `Region`: Choose your preferred region from the dropdown menu. This must be the same region as your Azure Key Vault.
    - `SKU`: Toggle **Basic** for your SKU option.
    - `Username`: Enter a username for your managed cluster's administrator account.
    - `Password`: Enter a password for your managed cluster's administrator account.
    - `Confirm password`: Reenter the password you chose.
    - `Key vault and primary certificate`: Choose **Select a certificate**, pictured below. Select your Azure Key Vault from the **Key vault** dropdown menu and your certificate from the **Certificate** dropdown menu, pictured below.
    - Leave the other options as their defaults.

   ![Screenshot of Select a certificate button in the Authentication method section of the settings, PNG.](./media/quickstart-managed-cluster-portal/create-a-service-fabric-managed-cluster-authentication-method.png)

   ![Screenshot of Azure Key Vault and certificate dropdown menus, PNG.](./media/quickstart-managed-cluster-portal/select-a-certificate-from-azure-key-vault.png)

   If you didn't already change your Azure Key Vault's access policies, you may get text prompting you to do so after you select your key vault and certificate. If so, choose **Edit access policies for yourkeyvaultname**, select **Click to show advanced access policies**, toggle **Azure Virtual Machines for deployment**, and save your changes. Click **Create a Service Fabric managed cluster** to return to the creation page.

1. Select **Review + create** and, once the validation passes, choose **Create**.

Now, your managed cluster's deployment is in progress. The deployment will likely take around 20 minutes to complete.

## Validate the deployment

Once the deployment completes, you're ready to view your new Service Fabric managed cluster.

1. In the [Azure portal](https://portal.azure.com), navigate to your managed cluster.

1. On your managed cluster's **Overview** page, find the **SF Explorer** link and select it.

   ![Screenshot of SF Explorer link on your managed cluster's Overview page, PNG.](./media/quickstart-managed-cluster-portal/service-fabric-explorer-address.png)

   >[!NOTE]
   >You may get a warning that your connection to your cluster isn't private. Select **Advanced** and choose **continue to yourmanagedclusterfqdn (unsafe)**.

1. When prompted for a certificate, choose the certificate you created, downloaded, and stored for this quickstart and select **OK**. If you completed those steps successfully, the certificate should be in the list of certificates.

1. You'll arrive at the Service Fabric Explorer display for your cluster, pictured below.

   ![Screenshot of your managed cluster's page in the Service Fabric Explorer, PNG.](./media/quickstart-managed-cluster-portal/service-fabric-explorer.png)

Your Service Fabric managed cluster consists of three nodes. These nodes are WindowsServer 2019-Datacenter virtual machines with 2 vCPUs, 8 GiB of RAM, and four 256-GiB disks. These features are determined by the **Basic SKU** option and the default values in the **Primary node type** settings on the **Create a Service Fabric managed cluster** page.

## Clean up resources

When no longer needed, delete the resource group for your Service Fabric managed cluster. To delete your resource group:

1. In the [Azure portal](https://portal.azure.com), navigate to your resource group.

1. Select **Delete resource group**.

1. In the `TYPE THE RESOURCE GROUP NAME:` box, type the name of your resource group and select **Delete**.

## Next steps

In this quickstart, you deployed a managed Service Fabric cluster. To learn more about how to scale a cluster, see:

> [!div class="nextstepaction"]
> [Scale out a Service Fabric managed cluster](tutorial-managed-cluster-scale.md)
