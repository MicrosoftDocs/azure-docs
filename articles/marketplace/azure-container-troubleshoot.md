---
title: Troubleshoot publishing issues for a Kubernetes application based Container offer in Microsoft AppSource.
description: Learn about potential issue and solutions when publishing a Kubernetes application based Container offer in Microsoft AppSource.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: nickomang
ms.author: nickoman
ms.date: 11/14/2022
---

# Troubleshoot issues while publishing a Kubernetes application-based Container offer

Once published, a Kubernetes application based Container offer goes through the following high level flow for bundle processing. 

:::image type="content" source="./media/azure-container/bundle-processing.png" alt-text="A diagram showing the three stages of bundle processing, flowing from 'Copy the bundle to a Microsoft-owned registry' to 'Vulnerability scanning' to 'Extension type registration'.":::

First, the contents of the Cloud Native Application Bundle (CNAB) are copied from your own registry to a Microsoft-owned Azure Container Registry (ACR). From there, vulnerability scanning is performed to ensure images are secure. Finally, the Kubernetes application is registered as an [extension][cluster-extension] type for an Azure Kubernetes Service (AKS) cluster. If the publish fails, it may be an issue with one of these components. See below for common errors and related mitigation steps.

## Common issues

### Publishing fails with missing artifacts in the CNAB

|Error|Description|Action|
|--|:--|--|
|"extensionRegistrationParameters cannot be null or empty in manifest.yaml of your package. For more details, please refer to https://aka.ms/K8sOfferAssets#create-the-manifest-file"|Kubernetes applications are packaged as AKS cluster extensions. The manifest file provides input for the Extension Type creation.|Read the description for each property and provide the information.|
|"namespace cannot be null or empty for defaultScope as cluster in extensionRegistrationParameters in manifest.yaml of your package. For more details, please refer to https://aka.ms/K8sOfferAssets#create-the-manifest-file"|Kubernetes applications that are installed at Cluster scope will use the default scope provided as the namespace.|Be sure to provide a namespace in the `extensionRegistrationParameters` section in your manifest file|

### Publishing fails while copying the artifacts from your ACR to a Microsoft-owned ACR

|Error|Description|Action|
|--|--|--|
|"Access to registry {sourceACRName} was denied. Please provide MarketPlace access to registry. please refer: https://aka.ms/K8sOfferAssets#grant-access-to-your-azure-container-registry"|During the publishing process, Microsoft moves your Kubernetes application, which is packaged as a CNAB and uploaded to an ACR, to a Microsoft-owned registry. <br><br/> To do so, Microsoft's first party app responsible for this process must be provided with permissions. This error appears if the Marketplace publishing was done without providing the permissions.|[Provide Microsoft's first party app with the proper permissions][grant-access].|
|"CNAB repository {cnabBundle} cannot be found in registry {sourceACRName}. Please provide MarketPlace access to registry. please refer: https://aka.ms/K8sOfferAssets#grant-access-to-your-azure-container-registry"|The Kubernetes application that has been packaged using the CPA tool can't be found in your ACR.|Ensure the bundle has been successfully uploaded to your registry, and [provide Microsoft's first party app with the proper permissions][grant-access].|
|"The CNAB repository name {cnabBundle} with digest {targetDigest} already exists and is different than your provided CNAB digest {sourcedigest}."|A plan with the same version is already published using a different CNAB.|If your CNAB contents have changed, increment the plan version and try publishing again.|

### Publishing fails with Platform errors

|Error|Description|Action|
|--|--|--|
|Internal server error|May be a transient error.|Try publishing again.|

### Vulnerability scanning

You may also encounter errors due to vulnerabilities in your images. For more information on vulnerability scanning and how to mitigate issues, see [Container certification troubleshooting][container-certification-troubleshooting].

<!-- LINKS -->
[container-certification-troubleshooting]: ./azure-container-certification-faq.yml
[cluster-extension]: ../aks/integrations.md#extensions
[grant-access]: ./azure-container-technical-assets-kubernetes.md#grant-access-to-your-azure-container-registry
