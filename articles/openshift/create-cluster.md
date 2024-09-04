---
title: Create an Azure Red Hat OpenShift 4 cluster
description: Learn how to create a Microsoft Azure Red Hat OpenShift cluster using the Azure CLI
author: johnmarco
ms.author: johnmarc
ms.topic: article
ms.service: azure-redhat-openshift
ms.custom: devx-track-azurecli
ms.date: 06/12/2024
#Customer intent: As a developer, I want learn how to create an Azure Red Hat OpenShift cluster, scale it, and then clean up resources so that I am not charged for what I'm not using.
---

# Create an Azure Red Hat OpenShift 4 cluster

Azure Red Hat OpenShift is a managed OpenShift service that lets you quickly deploy and manage clusters. This article shows you how to deploy an Azure Red Hat OpenShift cluster using either Azure CLI or the Azure portal.           

#### [Azure CLI](#tab/azure-cli)

## Before you begin

If you choose to install and use the CLI locally, you'll need to run Azure CLI version 2.30.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

Azure Red Hat OpenShift requires a minimum of 40 cores to create and run an OpenShift cluster. The default Azure resource quota for a new Azure subscription doesn't meet this requirement. To request an increase in your resource limit, see [Standard quota: Increase limits by VM series](../azure-portal/supportability/per-vm-quota-requests.md).

* For example, to check the current subscription quota of the smallest supported virtual machine family SKU "Standard DSv3":

    ```azurecli-interactive
    LOCATION=eastus
    az vm list-usage -l $LOCATION \
    --query "[?contains(name.value, 'standardDSv3Family')]" \
    -o table
    ```

### Verify your permissions

In this article, you'll create a resource group which contains the virtual network for the cluster. To do this, you'll need Contributor and User Access Administrator permissions or Owner permissions, either directly on the virtual network or on the resource group or subscription containing it.

You'll also need sufficient Microsoft Entra permissions (either a member user of the tenant, or a guest assigned with role **Application administrator**) for the tooling to create an application and service principal on your behalf for the cluster. See [Member and guests](../active-directory/fundamentals/users-default-permissions.md#member-and-guest-users) and [Assign administrator and non-administrator roles to users with Microsoft Entra ID](../active-directory/fundamentals/active-directory-users-assign-role-azure-portal.md) for more details.

### Register the resource providers

1. If you have multiple Azure subscriptions, specify the relevant subscription ID:

    ```azurecli-interactive
    az account set --subscription <SUBSCRIPTION ID>
    ```

1. Register the `Microsoft.RedHatOpenShift` resource provider:

    ```azurecli-interactive
    az provider register -n Microsoft.RedHatOpenShift --wait
    ```
    
1. Register the `Microsoft.Compute` resource provider:

    ```azurecli-interactive
    az provider register -n Microsoft.Compute --wait
    ```
    
1. Register the `Microsoft.Storage` resource provider:

    ```azurecli-interactive
    az provider register -n Microsoft.Storage --wait
    ```
    
1. Register the `Microsoft.Authorization` resource provider:

    ```azurecli-interactive
    az provider register -n Microsoft.Authorization --wait
    ```
    

### Get a Red Hat pull secret (optional)

   > [!NOTE] 
   > ARO pull secret doesn't change the cost of the RH OpenShift license for ARO.

A Red Hat pull secret enables your cluster to access Red Hat container registries, along with other content such as operators from [OperatorHub](https://operatorhub.io/). This step is optional but recommended. If you decide to add the pull secret later, follow [this guidance](howto-add-update-pull-secret.md). The field `cloud.openshift.com` is removed from your secret even if your pull-secret contains that field. This field enables an extra monitoring feature, which sends data to RedHat and is thus disabled by default. To enable this feature, see https://docs.openshift.com/container-platform/4.11/support/remote_health_monitoring/enabling-remote-health-reporting.html .

1. [Navigate to your Red Hat OpenShift cluster manager portal](https://console.redhat.com/openshift/install/azure/aro-provisioned) and sign-in.

   You'll need to log in to your Red Hat account or create a new Red Hat account with your business email and accept the terms and conditions.

1. Select **Download pull secret** and download a pull secret to be used with your ARO cluster.

    Keep the saved `pull-secret.txt` file somewhere safe. The file will be used in each cluster creation if you need to create a cluster that includes samples or operators for Red Hat or certified partners.

    When running the `az aro create` command, you can reference your pull secret using the `--pull-secret @pull-secret.txt` parameter. Execute `az aro create` from the directory where you stored your `pull-secret.txt` file. Otherwise, replace `@pull-secret.txt` with `@/path/to/my/pull-secret.txt`.

    If you're copying your pull secret or referencing it in other scripts, your pull secret should be formatted as a valid JSON string.

### Prepare a custom domain for your cluster (optional)

When running the `az aro create` command, you can specify a custom domain for your cluster by using the `--domain foo.example.com` parameter.

> [!NOTE]
> Although adding a domain name is optional when creating a cluster through Azure CLI, a domain name (or a prefix used as part of the auto-generated DNS name for OpenShift console and API servers) is needed when adding a cluster through the portal. See [Quickstart: Deploy an Azure Red Hat OpenShift cluster using the Azure portal](quickstart-portal.md#create-an-azure-red-hat-openshift-cluster) for more information. 

If you provide a custom domain for your cluster, note the following points:

* After creating your cluster, you must create two DNS A records in your DNS server for the `--domain` specified:
    * **api** - pointing to the api server IP address
    * **\*.apps** - pointing to the ingress IP address
    * Retrieve these values by executing the following command after cluster creation: `az aro show -n -g --query '{api:apiserverProfile.ip, ingress:ingressProfiles[0].ip}'`.

* The OpenShift console will be available at a URL such as `https://console-openshift-console.apps.example.com`, instead of the built-in domain `https://console-openshift-console.apps.<random>.<location>.aroapp.io`.

* By default, OpenShift uses self-signed certificates for all of the routes created on custom domains `*.apps.example.com`.  If you choose to use custom DNS after connecting to the cluster, you will need to follow the OpenShift documentation to [configure a custom CA for your ingress controller](https://docs.openshift.com/container-platform/4.6/security/certificates/replacing-default-ingress-certificate.html) and a [custom CA for your API server](https://docs.openshift.com/container-platform/4.6/security/certificates/api-server.html).

### Create a virtual network containing two empty subnets

Next, you'll create a virtual network containing two empty subnets. If you have existing virtual network that meets your needs, you can skip this step.

1. **Set the following variables in the shell environment in which you will execute the `az` commands.**

   ```console
   LOCATION=eastus                 # the location of your cluster
   RESOURCEGROUP=aro-rg            # the name of the resource group where you want to create your cluster
   CLUSTER=cluster                 # the name of your cluster
   ```

2. **Create a resource group.**

   An Azure resource group is a logical group in which Azure resources are deployed and managed. When you create a resource group, you're asked to specify a location. This location is where resource group metadata is stored, and it is also where your resources run in Azure if you don't specify another region during resource creation. Create a resource group using the [az group create](/cli/azure/group#az-group-create) command.
    
   > [!NOTE] 
   > Azure Red Hat OpenShift is not available in all regions where an Azure resource group can be created. See [Available regions](https://azure.microsoft.com/global-infrastructure/services/?products=openshift) for information on where Azure Red Hat OpenShift is supported.

   ```azurecli-interactive
   az group create \
     --name $RESOURCEGROUP \
     --location $LOCATION
   ```

   The following example output shows the resource group created successfully:

   ```json
   {
     "id": "/subscriptions/<guid>/resourceGroups/aro-rg",
     "location": "eastus",
     "name": "aro-rg",
     "properties": {
       "provisioningState": "Succeeded"
     },
     "type": "Microsoft.Resources/resourceGroups"
   }
   ```

2. **Create a virtual network.**

   Azure Red Hat OpenShift clusters running OpenShift 4 require a virtual network with two empty subnets, for the master and worker nodes. You can either create a new virtual network for this, or use an existing virtual network.

   Create a new virtual network in the same resource group you created earlier:

   ```azurecli-interactive
   az network vnet create \
      --resource-group $RESOURCEGROUP \
      --name aro-vnet \
      --address-prefixes 10.0.0.0/22
   ```

   The following example output shows the virtual network created successfully:

   ```json
   {
     "newVNet": {
       "addressSpace": {
         "addressPrefixes": [
           "10.0.0.0/22"
         ]
       },
       "dhcpOptions": {
         "dnsServers": []
       },
       "id": "/subscriptions/<guid>/resourceGroups/aro-rg/providers/Microsoft.Network/virtualNetworks/aro-vnet",
       "location": "eastus",
       "name": "aro-vnet",
       "provisioningState": "Succeeded",
       "resourceGroup": "aro-rg",
       "type": "Microsoft.Network/virtualNetworks"
     }
   }
   ```

3. **Add an empty subnet for the master nodes.**

   ```azurecli-interactive
   az network vnet subnet create \
     --resource-group $RESOURCEGROUP \
     --vnet-name aro-vnet \
     --name master-subnet \
     --address-prefixes 10.0.0.0/23
   ```

4. **Add an empty subnet for the worker nodes.**

   ```azurecli-interactive
   az network vnet subnet create \
     --resource-group $RESOURCEGROUP \
     --vnet-name aro-vnet \
     --name worker-subnet \
     --address-prefixes 10.0.2.0/23
   ```

## Create the cluster

Run the following command to create a cluster. If you choose to use either of the following options, modify the command accordingly:
* Optionally, you can [pass your Red Hat pull secret](#get-a-red-hat-pull-secret-optional), which enables your cluster to access Red Hat container registries along with other content. Add the `--pull-secret @pull-secret.txt` argument to your command.
* Optionally, you can [use a custom domain](#prepare-a-custom-domain-for-your-cluster-optional). Add the `--domain foo.example.com` argument to your command, replacing `foo.example.com` with your own custom domain.

> [!NOTE]
> If you're adding any optional arguments to your command, be sure to close the argument on the preceding line of the command with a trailing backslash.

```azurecli-interactive
az aro create \
  --resource-group $RESOURCEGROUP \
  --name $CLUSTER \
  --vnet aro-vnet \
  --master-subnet master-subnet \
  --worker-subnet worker-subnet
```

After executing the `az aro create` command, it normally takes about 35 minutes to create a cluster.

#### Selecting a different ARO version

You can select to use a specific version of ARO when creating your cluster. First, use the CLI to query for available ARO versions:

`az aro get-versions --location <region>`

Once you've chosen the version, specify it using the `--version` parameter in the `az aro create` command:

```azurecli-interactive
az aro create \
  --resource-group $RESOURCEGROUP \
  --name $CLUSTER \
  --vnet aro-vnet \
  --master-subnet master-subnet \
  --worker-subnet worker-subnet \
  --version <x.y.z>
```

#### [Azure portal](#tab/azure-portal)

## Before you begin
Sign in to the [Azure portal](https://portal.azure.com). 

Register the `Microsoft.RedHatOpenShift` resource provider. For instructions on registering resource providers using Azure portal, see [Register resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).

## Create an Azure Red Hat OpenShift cluster
1.	On the Azure portal menu or from the **Home** page, select **All Services** under three horizontal bars on the top left hand page.
2.	Search for and select **Azure Red Hat OpenShift clusters**.
3.  Select **Create**.
4.	On the **Basics** tab, configure the following options:
    * **Project details**:
        *	Select an Azure **Subscription**.
        *	Select or create an Azure **Resource group**, such as *myResourceGroup*.
    * **Instance details**:
        * Select a **Region** for the Azure Red Hat OpenShift cluster.
        *	Enter an **OpenShift cluster name**, such as *myAROCluster*.
        *	Enter a **Domain name**.
        *	Select **Master VM Size** and **Worker VM Size**.
        *   Select **Worker node count** (i.e., the number of worker nodes to create). 

     > [!div class="mx-imgBorder"]
     > [ ![Screenshot of **Basics** tab on Azure portal.](./media/Basics.png) ](./media/Basics.png#lightbox)
    
    > [!NOTE]
    > The **Domain name** field is pre-populated with a random string. You can either specify a domain name (e.g., *example.com*) or a string/prefix (e.g., *abc*) that will be used as part of the auto-generated DNS name for OpenShift console and API servers. This prefix is also used as part of the name of the resource group that is created to host the cluster VMs if a resource group name is not specified.

5. On the **Authentication** tab, complete the following sections.

    Under **Service principal information**, select either **Create new** or **Existing**. If you choose to use an existing service principal, enter the following information:

   - **Service principal client ID** is your appId. 
   - **Service principal client secret** is the service principal's decrypted Secret value.

    > [!NOTE]
    > If you need to create a service principal, see  [Creating and using a service principal with an Azure Red Hat OpenShift cluster](howto-create-service-principal.md).
    
   Under **Pull secret**, enter the **Red Hat pull secret** (i.e., your cluster's pull secret's decrypted value). If you don't have a pull secret, leave this field blank.

   :::image type="content" source="./media/openshift-service-principal-portal.png" alt-text="Screenshot that shows how to use the Authentication tab with Azure portal to create a service principal." lightbox="./media/openshift-service-principal-portal.png":::

6.	On the **Networking** tab, configure the required options.

       > [!NOTE]
       > Azure Red Hat OpenShift clusters running OpenShift 4 require a virtual network with two empty subnets: one for the control plane and one for worker nodes.


> [!div class="mx-imgBorder"]
> [ ![Screenshot of **Networking** tab on Azure portal.](./media/Networking.png) ](./media/Networking.png#lightbox)

7.	On the **Tags** tab, add tags to organize your resources.

> [!div class="mx-imgBorder"]
> [ ![Screenshot of **Tags** tab on Azure portal.](./media/Tags.png) ](./media/Tags.png#lightbox)
 
8.	Check **Review + create** and then **Create** when validation completes.   

![Screenshot of **Review + create** tab on Azure portal.](./media/Review+Create.png)
 
9.	It takes approximately 35 to 45 minutes to create the Azure Red Hat OpenShift cluster. When your deployment is complete, navigate to your resource by either:
    *	Clicking **Go to resource**, or
    *	Browsing to the Azure Red Hat OpenShift cluster resource group and selecting the Azure Red Hat OpenShift resource.
        *	Per example cluster dashboard below: browsing for *myResourceGroup* and selecting *myAROCluster* resource.

## Next steps

Learn how to [connect to an Azure Red Hat OpenShift cluster](connect-cluster.md).
