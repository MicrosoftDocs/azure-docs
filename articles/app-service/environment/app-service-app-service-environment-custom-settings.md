---
title: Configure custom settings
description: Configure settings that apply to the entire Azure App Service environment. Learn how to do it with Azure Resource Manager templates.
author: madsd

ms.assetid: 1d1d85f3-6cc6-4d57-ae1a-5b37c642d812
ms.topic: tutorial
ms.date: 03/06/2024
ms.author: madsd
ms.custom: mvc, devx-track-arm-template
---

# Custom configuration settings for App Service Environments

## Overview

Because App Service Environments are isolated to a single customer, there are certain configuration settings that can be applied exclusively to App Service Environments. This article documents the various specific customizations that are available for App Service Environments.

If you do not have an App Service Environment, see [How to Create an App Service Environment v3](./creation.md).

You can store App Service Environment customizations by using an array in the new **clusterSettings** attribute. This attribute is found in the "Properties" dictionary of the *hostingEnvironments* Azure Resource Manager entity.

The following abbreviated Resource Manager template snippet shows the **clusterSettings** attribute:

```json
"resources": [
{
    "apiVersion": "2021-03-01",
    "type": "Microsoft.Web/hostingEnvironments",
    "name": ...,
    "location": ...,
    "properties": {
        "clusterSettings": [
            {
                "name": "nameOfCustomSetting",
                "value": "valueOfCustomSetting"
            }
        ],
        "internalLoadBalancingMode": ...,
        etc...
    }
}
```

The **clusterSettings** attribute can be included in a Resource Manager template to update the App Service Environment.

## Use Azure Resource Explorer to update an App Service Environment

Alternatively, you can update the App Service Environment by using [Azure Resource Explorer](https://resources.azure.com).

1. In Resource Explorer, go to the node for the App Service Environment (**subscriptions** > **{your Subscription}** > **resourceGroups** > **{your Resource Group}** > **providers** > **Microsoft.Web** > **hostingEnvironments**). Then click the specific App Service Environment that you want to update.
2. In the right pane, click **Read/Write** in the upper toolbar to allow interactive editing in Resource Explorer.  
3. Click the blue **Edit** button to make the Resource Manager template editable.
4. Scroll to the bottom of the right pane. The **clusterSettings** attribute is at the very bottom, where you can enter or update its value.
5. Type (or copy and paste) the array of configuration values you want in the **clusterSettings** attribute.  
6. Click the green **PUT** button that's located at the top of the right pane to commit the change to the App Service Environment.

However you submit the change, the change is not immediate and it can take up to 24 hours for the change to take full effect. Some settings have specific details on the time and impact of configuring the specific setting.

## Enable internal encryption

The App Service Environment operates as a black box system where you cannot see the internal components or the communication within the system. To enable higher throughput, encryption is not enabled by default between internal components. The system is secure as the traffic is inaccessible to being monitored or accessed. If you have a compliance requirement though that requires complete encryption of the data path from end to end, there is a way to enable encryption of the complete data path with a clusterSetting.

```json
"clusterSettings": [
    {
        "name": "InternalEncryption",
        "value": "true"
    }
],
```

Setting InternalEncryption to true encrypts internal network traffic in your App Service Environment between the front ends and workers, encrypts the pagefile and also encrypts the worker disks. After the InternalEncryption clusterSetting is enabled, there can be an impact to your system performance. When you make the change to enable InternalEncryption, your App Service Environment will be in an unstable state until the change is fully propagated. Complete propagation of the change can take a few hours to complete, depending on how many instances you have in your App Service Environment. We highly recommend that you do not enable InternalEncryption on an App Service Environment while it is in use. If you need to enable InternalEncryption on an actively used App Service Environment, we highly recommend that you divert traffic to a backup environment until the operation completes.

## Disable TLS 1.0 and TLS 1.1

If you want to manage TLS settings on an app by app basis, then you can use the guidance provided with the [Enforce TLS settings](../configure-ssl-bindings.md#enforce-tls-versions) documentation.

If you want to disable all inbound TLS 1.0 and TLS 1.1 traffic for all of the apps in an App Service Environment, you can set the following **clusterSettings** entry:

```json
"clusterSettings": [
    {
        "name": "DisableTls1.0",
        "value": "1"
    }
],
```

The name of the setting says 1.0 but when configured, it disables both TLS 1.0 and TLS 1.1.

## Change TLS cipher suite order

App Service Environment supports changing the cipher suite from the default. The default set of ciphers is the same set that is used in the multi-tenant App Service. Changing the cipher suite is only possible with App Service Environment, the single-tenant offering, not the multi-tenant offering, because changing it affects the entire App Service deployment. There are two cipher suites that are required for an App Service Environment: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 and TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256. Additionally, you should include the following cipher suites, which are required for TLS 1.3: TLS_AES_256_GCM_SHA384 and TLS_AES_128_GCM_SHA256.

To configure your App Service Environment to use just the ciphers that it requires, modify the **clusterSettings** as shown in the following sample. **Ensure that the TLS 1.3 ciphers are included at the beginning of the list**.

```json
"clusterSettings": [
    {
        "name": "FrontEndSSLCipherSuiteOrder",
        "value": "TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256"
    }
],
```

> [!WARNING]
> If incorrect values are set for the cipher suite that SChannel cannot understand, all TLS communication to your server might stop functioning. In such a case, you will need to remove the *FrontEndSSLCipherSuiteOrder* entry from **clusterSettings** and submit the updated Resource Manager template to revert back to the default cipher suite settings. Please use this functionality with caution.

## Get started

The Azure Quickstart Resource Manager template site includes a template with the base definition for [creating an App Service Environment](https://azure.microsoft.com/resources/templates/web-app-asp-app-on-asev3-create/).
