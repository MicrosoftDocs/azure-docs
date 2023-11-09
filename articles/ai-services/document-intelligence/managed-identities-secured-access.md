---
title: "Configure secure access with managed identities and private endpoints"
titleSuffix: Azure AI services
description: Learn how to configure secure communications between Document Intelligence and other Azure Services.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: how-to
ms.date: 07/18/2023
ms.author: vikurpad
monikerRange: '<=doc-intel-4.0.0'
---


# Configure secure access with managed identities and private endpoints

[!INCLUDE [applies to v4.0, v3.1, v3.0, and v2.1](includes/applies-to-v40-v31-v30-v21.md)]

This how-to guide walks you through the process of enabling secure connections for your Document Intelligence resource. You can secure the following connections:

* Communication between a client application within a Virtual Network (`VNET`) and your Document Intelligence Resource.

* Communication between Document Intelligence Studio and your Document Intelligence resource.

* Communication between your Document Intelligence resource and a storage account (needed when training a custom model).

 You're setting up your environment to secure the resources:

  :::image type="content" source="media/managed-identities/secure-config.png" alt-text="Screenshot of secure configuration with managed identity and private endpoints.":::

## Prerequisites

To get started, you need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/)—if you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**Document Intelligence**](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [**Azure AI services**](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource in the Azure portal. For detailed steps, _see_ [Create a multi-service resource](../../ai-services/multi-service-resource.md?pivots=azportal).

* An [**Azure blob storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM) in the same region as your Document Intelligence resource. Create containers to store and organize your blob data within your storage account.

* An [**Azure virtual network**](https://portal.azure.com/#create/Microsoft.VirtualNetwork-ARM) in the same region as your Document Intelligence resource. Create a virtual network to deploy your application resources to train models and analyze documents.

* An **Azure data science VM** for [**Windows**](../../machine-learning/data-science-virtual-machine/provision-vm.md) or [**Linux/Ubuntu**](../../machine-learning/data-science-virtual-machine/dsvm-ubuntu-intro.md) to optionally deploy a data science VM in the virtual network to test the secure connections being established.

## Configure resources

Configure each of the resources to ensure that the resources can communicate with each other:

* Configure the Document Intelligence Studio to use the newly created Document Intelligence resource by accessing the settings page and selecting the resource.

* Validate that the configuration works by selecting the Read API and analyzing a sample document. If the resource was configured correctly, the request successfully completes.

* Add a training dataset to a container in the Storage account you created.

* Select the custom model tile to create a custom project. Ensure that you select the same Document Intelligence resource and the storage account you created in the previous step.

* Select the container with the training dataset you uploaded in the previous step. Ensure that if the training dataset is within a folder, the folder path is set appropriately.

* If you have the required permissions, the Studio sets the CORS setting required to access the storage account. If you don't have the permissions, you need to ensure that the CORS settings are configured on the Storage account before you can proceed.

* Validate that the Studio is configured to access your training data, if you can see your documents in the labeling experience, all the required connections are established.

You now have a working implementation of all the components needed to build a Document Intelligence solution with the default security model:

  :::image type="content" source="media/managed-identities/default-config.png" alt-text="Screenshot of default security configuration.":::

Next, complete the following steps:

* Setup managed identity on the Document Intelligence resource.

* Secure the storage account to restrict traffic from only specific virtual networks and IP addresses.

* Configure the Document Intelligence managed identity to communicate with the storage account.

* Disable public access to the Document Intelligence resource and create a private endpoint to make it accessible from the virtual network.

* Add a private endpoint for the storage account in a selected virtual network.

* Validate that you can train models and analyze documents from within the virtual network.

## Setup managed identity for Document Intelligence

Navigate to the Document Intelligence resource in the Azure portal and select the **Identity** tab. Toggle the **System assigned** managed identity to **On** and save the changes:

  :::image type="content" source="media/managed-identities/v2-fr-mi.png" alt-text="Screenshot of configure managed identity.":::

## Secure the Storage account to limit traffic

Start configuring secure communications by navigating to the **Networking** tab on your **Storage account** in the Azure portal.

1. Under **Firewalls and virtual networks**, choose **Enabled from selected virtual networks and IP addresses** from the **Public network access** list.

1. Ensure that **Allow Azure services on the trusted services list to access this storage account** is selected from the **Exceptions** list.

1. **Save** your changes.

  :::image type="content" source="media/managed-identities/v2-stg-firewall.png" alt-text="Screenshot of configure storage firewall.":::

> [!NOTE]
>
> Your storage account won't be accessible from the public internet.
>
> Refreshing the custom model labeling page in the Studio will result in an error message.

## Enable access to storage from Document Intelligence

To ensure that the Document Intelligence resource can access the training dataset, you need to add a role assignment for your [managed identity](#setup-managed-identity-for-document-intelligence).

1. Staying on the storage account window in the Azure portal, navigate to the **Access Control (IAM)** tab in the left navigation bar.

1. Select the **Add role assignment** button.

    :::image type="content" source="media/managed-identities/v2-stg-role-assign-role.png" alt-text="Screenshot of add role assignment window.":::

1. On the **Role** tab, search for and select the **Storage Blob Data Reader** permission and select **Next**.

    :::image type="content" source="media/managed-identities/v2-stg-role-assignment.png" alt-text="Screenshot of choose a role tab.":::

1. On the **Members** tab, select the **Managed identity** option and choose **+ Select members**

1. On the **Select managed identities** dialog window, select the following options:

   * **Subscription**. Select your subscription.

   * **Managed Identity**. Select Form **Recognizer**.

   * **Select**. Choose the Document Intelligence resource you enabled with a managed identity.

    :::image type="content" source="media/managed-identities/v2-stg-role-assign-resource.png" alt-text="Screenshot of managed identities dialog window.":::

1. **Close** the dialog window.

1. Finally, select **Review + assign** to save your changes.

Great! You configured your Document Intelligence resource to use a managed identity to connect to a storage account.

> [!TIP]
>
> When you try the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio), you'll see the READ API and other prebuilt models don't require storage access to process documents. However, training a custom model requires additional configuration because the Studio can't directly communicate with a storage account.
  > You can enable storage access by selecting **Add your client IP address** from the **Networking** tab of the storage account to configure your machine to access the storage account via IP allowlisting.

## Configure private endpoints for access from VNETs

> [!NOTE]
>
> * The resources are only accessible from the virtual network.
>
> * Some Document Intelligence features in the Studio like auto label require the Document Intelligence Studio to have access to your storage account.
>
> * Add our Studio IP address, 20.3.165.95, to the firewall allowlist for both Document Intelligence and Storage Account resources. This is Document Intelligence Studio's dedicated IP address and can be safely allowed.

When you connect to resources from a virtual network, adding private endpoints ensures both the storage account, and the Document Intelligence resource are accessible from the virtual network.

Next, configure the virtual network to ensure only resources within the virtual network or traffic router through the network have access to the Document Intelligence resource and the storage account.

### Enable your virtual network and private endpoints

1. In the Azure portal, navigate to your Document Intelligence resource.

1. Select the **Networking** tab from the left navigation bar.

1. Enable the **Selected Networking and Private Endpoints** option from the **Firewalls and virtual networks** tab and select save.

> [!NOTE]
>
>If you try accessing any of the Document Intelligence Studio features, you'll see an access denied message. To enable access from the Studio on your machine, select the **client IP address checkbox** and **Save** to restore access.

  :::image type="content" source="media/managed-identities/v2-fr-network.png" alt-text="Screenshot showing how to disable public access to Document Intelligence.":::

### Configure your private endpoint

1. Navigate to the **Private endpoint connections** tab and select the **+ Private endpoint**. You're navigated to the **Create a private endpoint** dialog page.

1. On the **Create private endpoint** dialog page, select the following options:

    * **Subscription**. Select your billing subscription.

    * **Resource group**. Select the appropriate resource group.

    * **Name**. Enter a name for your private endpoint.

    * **Region**. Select the same region as your virtual network.

    * Select **Next: Resource**.

    :::image type="content" source="media/managed-identities/v2-fr-private-end-basics.png" alt-text="Screenshot showing how to set-up a private endpoint":::

### Configure your virtual network

1. On the **Resource** tab, accept the default values and select **Next: Virtual Network**.

1. On the **Virtual Network** tab, make sure that you select the virtual network that you created.

1. If you have multiple subnets, select the subnet where you want the private endpoint to connect. Accept the default value to **Dynamically allocate IP address**.

1. Select **Next: DNS**

1. Accept the default value **Yes** to **integrate with private DNS zone**.

    :::image type="content" source="media/managed-identities/v2-fr-private-end-vnet.png" alt-text="Screenshot showing how to configure private endpoint":::

1. Accept the remaining defaults and select **Next: Tags**.

1. Select **Next: Review + create** .

Well done! Your Document Intelligence resource now is only accessible from the virtual network and any IP addresses in the IP allowlist.

### Configure private endpoints for storage

Navigate to your **storage account** on the Azure portal.

1. Select the **Networking** tab from the left navigation menu.

1. Select the **Private endpoint connections** tab.

1. Choose add **+ Private endpoint**.

1. Provide a name and choose the same region as the virtual network.

1. Select **Next: Resource**.

    :::image type="content" source="media/managed-identities/v2-stg-private-end-basics.png" alt-text="Screenshot showing how to create a private endpoint":::

1. On the resource tab, select **blob** from the **Target sub-resource** list.

1. select **Next: Virtual Network**.

   :::image type="content" source="media/managed-identities/v2-stg-private-end-resource.png" alt-text="Screenshot showing how to configure a private endpoint for a blob.":::

1. Select the **Virtual network** and **Subnet**. Make sure **Enable network policies for all private endpoints in this subnet** is selected and the **Dynamically allocate IP address** is enabled.

1. Select **Next: DNS**.

1. Make sure that **Yes** is enabled for **Integrate with private DNS zone**.

1. Select **Next: Tags**.

1. Select **Next: Review + create**.

Great work! You now have all the connections between the Document Intelligence resource and storage configured to use managed identities.

> [!NOTE]
> The resources are only accessible from the virtual network.
>
> Studio access and analyze requests to your Document Intelligence resource will fail unless the request originates from the virtual network or is routed via the virtual network.

## Validate your deployment

To validate your deployment, you can deploy a virtual machine (VM) to the virtual network and connect to the resources.

1. Configure a [Data Science VM](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview) in the virtual network.

1. Remotely connect into the VM from your desktop to launch a browser session to access Document Intelligence Studio.

1. Analyze requests and the training operations should now work successfully.

That's it! You can now configure secure access for your Document Intelligence resource with managed identities and private endpoints.

## Common error messages

* **Failed to access Blob container**:

   :::image type="content" source="media/managed-identities/cors-error.png" alt-text="Screenshot of error message when CORS config is required":::

  **Resolution**: [Configure CORS](quickstarts/try-document-intelligence-studio.md#prerequisites-for-new-users).

* **AuthorizationFailure**:

  :::image type="content" source="media/managed-identities/auth-failure.png" alt-text="Screenshot of authorization failure error.":::

  **Resolution**: Ensure that there's a network line-of-sight between the computer accessing the Document Intelligence Studio and the storage account. For example, you can add the client IP address in the storage account's networking tab.

* **ContentSourceNotAccessible**:

   :::image type="content" source="media/managed-identities/content-source-error.png" alt-text="Screenshot of content source not accessible error.":::

    **Resolution**: Make sure you grant your Document Intelligence managed identity the role of **Storage Blob Data Reader** and enabled **Trusted services** access or **Resource instance** rules on the networking tab.

* **AccessDenied**:

  :::image type="content" source="media/managed-identities/access-denied.png" alt-text="Screenshot of an access denied error.":::

  **Resolution**: Check to make sure there's connectivity between the computer accessing the Document Intelligence Studio and the Document Intelligence service. For example, you might need to add the client IP address to the Document Intelligence service's networking tab.

## Next steps

> [!div class="nextstepaction"]
> [Access Azure Storage from a web app using managed identities](../../app-service/scenario-secure-app-access-storage.md?bc=%2fazure%2fapplied-ai-services%2fform-recognizer%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fapplied-ai-services%2fform-recognizer%2ftoc.json)
