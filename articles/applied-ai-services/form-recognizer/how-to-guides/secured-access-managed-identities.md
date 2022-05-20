---
title: "Secure communication with Form Recognizer using managed identities and private endpoints"
titleSuffix: Azure Applied AI Services
description: Learn how to configure secure communications between Form Recognizer and other Azure Services.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 05/20/2022
ms.author: vikurpad
---

# Configuring secure access to your Form Recognizer resource

This how-to guide will walk you through the process of enabling secure connections for your Form Recognizer resource. You can secure the following connections:

* Communication between a client application within a Virtual Network (VNET) and your Form Recognizer Resource.

* Communication between Form Recognizer Studio or the sample labeling tool (FOTT) and your Form Recognizer resource.

* Communication between your Form Recognizer resource and a storage account (needed when training a custom model).

You'll be setting up your environment to secure the resources:

  :::image type="content" source="../media/managed-identities/secure-config.png" alt-text="Secure configuration with managed identity and private endpoints.":::

## Prerequisites

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/)—if you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**Form Recognizer**](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) or [**Cognitive Services**](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource in the Azure portal. For detailed steps, _see_ [Create a Cognitive Services resource using the Azure portal](../../../cognitive-services/cognitive-services-apis-create-account.md?tabs=multiservice%2cwindows).

* An [**Azure blob storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM) in the same region as your Form Recognizer resource. You'll create containers to store and organize your blob data within your storage account.

* An [**Azure virtual network**](https://portal.azure.com/#create/Microsoft.VirtualNetwork-ARM) in the same region as your Form Recognizer resource. You'll create a virtual network to deploy your application resources to train models and analyze documents.

* An [**Azure data science VM**](https://portal.azure.com/#create/Microsoft.VirtualNetwork-ARM) optionally deploy a data science VM in the virtual network to test the secure connections being established.

## Configure resources

Configure each of the resources to ensure that the resources can communicate with each other:

* Configure the Form Recognizer Studio to use the newly created Form Recognizer resource by accessing the settings page and selecting the resource.

* Validate that the configuration works by selecting the Read API and analyzing a sample document. If the resource was configured correctly, the request will successfully complete.

* Add a training dataset to a container in the Storage account you created.

* Select the custom model tile to create a custom project. Ensure that you select the same Form Recognizer resource and the storage account you created in the previous step.

* Select the container with the training dataset you uploaded in the previous step. Ensure that if the training dataset is within a folder, the folder path is set appropriately.

* If you have the required permissions, the Studio will set the CORS setting required to access the storage account. If you don't have the permissions, you'll need to ensure that the CORS settings are configured on the Storage account before you can proceed.

* Validate that the Studio is configured to access your training data, if you can see your documents in the labeling experience, all the required connections have been established.

You now have a working implementation of all the components needed to build a Form Recognizer solution with the default security model:

  :::image type="content" source="../media/managed-identities/default-config.png" alt-text="Default security configuration.":::

Next, you'll complete the following steps:

* Setup managed identity on the Form Recognizer resource.

* Secure the storage account to restrict traffic from only specific virtual networks and IP addresses.

* Configure the Form Recognizer managed identity to communicate with the storage account.

* Disable public access to the Form Recognizer resource and create a private endpoint to make it accessible from the virtual network.

* Add a private endpoint for the storage account in a selected virtual network.

* Validate that you can train models and analyze documents from within the virtual network.

## Setup managed identity for Form Recognizer

Navigate to the Form Recognizer resource in the Azure portal and select the **Identity** tab. Toggle the **System assigned** managed identity to **On** and save the changes:

  :::image type="content" source="../media/managed-identities/v2-fr-mi.png" alt-text="Configure managed identity.":::

## Secure the Storage account to limit traffic

Start configuring secure communications by navigating to the **Networking** tab on the Storage account in the Azure portal.

1. Under **Firewalls and virtual networks**, select **Enabled from selected virtual networks and IP addresses**

1. Ensure that **Allow Azure services on the trusted services list to access this storage account** is selected

1. Save your changes.

  :::image type="content" source="../media/managed-identities/v2-stg-firewall.png" alt-text="Configure storage firewall.":::

> [!NOTE]
>
> Your storage account won't be accessible from the public internet.
>
> Refreshing the custom model labeling page in the Studio will result in an error message.

## Enable access to storage from Form Recognizer

To ensure that the Form Recognizer resource can access the training dataset, you'll need to add a role assignment for the managed identity that was created earlier.

1. Staying on the Storage account window in the portal, navigate to the **Access Control (IAM)** tab.

1. Select on the **Add role assignment** button

    :::image type="content" source="../media/managed-identities/v2-stg-role-assign-role.png" alt-text="Screenshot of add role assignment window.":::

1. On the **Role** tab, search for and select the**Storage Blob Reader** permission and select **next**.

    :::image type="content" source="../media/managed-identities/v2-stg-role-assignment.png" alt-text="Screenshot of role tab.":::

1. On the **Members** tab, select the **Managed identity** option and select **+ Select members**

1. On the **Select managed identities** dialog, select your subscription, from the **Managed Identity** drop-down list, select Form Recognizer, select the Form Recognizer resource you just enabled managed identities for.

    :::image type="content" source="../media/managed-identities/v2-stg-role-assign-resource.png" alt-text="Screenshot of managed identities dialog window.":::

1. Finally, select **Review + assign** to save your changes.

Great! You've configured for your Form Recognizer resource to use a managed identity to connect to a storage account.

> [!TIP]
>
> When you try the [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio), you'll see the READ API and other prebuilt models don't require storage access to process documents. However, training a custom model requires additional configuration because the Studio can't directly communicate with a storage account.
 > You can enable storage access by selecting **Add your client IP address** from the **Networking** tab of the storage account to configure your machine to access the storage account via IP whitelisting.

## Configure private endpoints for access from VNETs

When you connect to resources from a virtual network, adding private endpoints will ensure both the storage account and the Form Recognizer resource are accessible from the virtual network.

You'll now configure the virtual network to ensure only resources within the virtual network or traffic router through the network will have access to the Form Recognizer resource and the storage account.

* On the Azure portal navigate to the Form Recognizer resource, on the **Networking** tab, enable **Selected Networking and Private Endpoints** option on the **Firewalls and virtual networks** tab and hit save. If you try accessing any of the Studio features, you'll see an access denied message. To enable access from the Studio on your machine, selecting the client IP address checkbox and saving will restore access.

  :::image type="content" source="../media/managed-identities/v2-fr-network.png" alt-text="Screenshot showing how to disable public access to Form Recognizer.":::

* Navigate to the **Private endpoint connections** tab and select the **add private endpoint** button.

* On the **create private endpoint** dialog page, start by selecting the subscription and resource group, name your private endpoint and add it to the same region as the virtual network before clicking next.

  :::image type="content" source="../media/managed-identities/v2-fr-private-end-basics.png" alt-text="Screenshot showing how to set-up a private endpoint":::

* On the **Resource** tab, accept the default values and select **Next**.

* On the **Virtual Network** tab, ensure that the VNET you created is selected in the virtual network. If you have multiple subnets, select the subnet where you want the private endpoint to connect. Accept the default value of yes for integrating with private DNS zone.

  :::image type="content" source="../media/managed-identities/v2-fr-private-end-vnet.png" alt-text="Screenshot showing how to configure private endpoint":::

* Accept the remaining defaults and continue to select **Next** until you can review and create the private endpoint.

Your Form Recognizer resource now is only accessible from the virtual network and any IP addresses in the IP allowlist.

### Configure private endpoints for storage

Navigate to your storage account on the portal, select the **Networking** tab.

1. On the **Private endpoint connections** tab, add a private endpoint.

1. Provide a name and pick the same region as the virtual network, select **Next**.

  :::image type="content" source="../media/managed-identities/v2-stg-private-end-basics.png" alt-text="Screenshot showing how to create a private endpoint":::

1. On the resource tab, select **blob** from the target **sub-resource** list and select **Next**.

   :::image type="content" source="../media/managed-identities/v2-stg-private-end-resource.png" alt-text="Screenshot showing how to configure a private endpoint for a blob.":::

1. As with the Form Recognizer resource, select the virtual network and subnet, validate that the private DNS zone is selected.

1. Select **Next** on the tabs to create the private endpoint.

You now have all the connections between the Form Recognizer resource and storage configured to use managed identities. 

> [!NOTE]
> The resources are only accessible from the virtual network.
>
> Studio access and analyze requests to your Form Recognizer resource will fail unless the request originates from the virtual network or is routed via the virtual network.

## Validate your deployment

To validate your deployment, you can deploy a VM to the virtual network and connect to the resources.

1. Configure a [Data Science VM](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.dsvm-win-2019?tab=Overview) in the virtual network.

1. Remote desktop into the VM to launch a browser session to access the Studio.

1. Analyze requests and the training operations should now work successfully.

## Common error messages

* **Failed to access Blob container**:

   :::image type="content" source="../media/managed-identities/cors-error.png" alt-text="Error message when CORS config is required"::: 

  **Resolution**: [Configure CORS](../quickstarts/try-v3-form-recognizer-studio.md#prerequisites-for-new-users)|

* **AuthorizationFailure**:

  :::image type="content" source="../media/managed-identities/auth-failure.png" alt-text="Authorization failure":::

  **Resolution**: Ensure that there's network line-of-sight between the computer accessing the form recognizer studio and the storage account. For example, you may need  to add the client IP address in the storage account's networking tab.

* **ContentSourceNotAccessible**:

   :::image type="content" source="../media/managed-identities/content-source-error.png" alt-text="Content Source Not Accessible":::

    **Resolution**: Make sure you have given the form recognizer service's managed identity  the role of" Storage Blob Data Reader" and enable Trusted services access or Resource instance rules on the networking tab.

* **AccessDenied**:

  :::image type="content" source="../media/managed-identities/access-denied.png" alt-text="AccessDenied":::

  **Resolution**: Check to make sure there's connectivity between the computer accessing the form recognizer studio and the form recognizer service. For example, you may need to add the client IP address to the Form Recognizer service's networking tab.
