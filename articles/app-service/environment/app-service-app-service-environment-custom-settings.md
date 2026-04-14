---
title: Configure custom settings
description: Configure settings that apply to the entire Azure App Service environment. Learn how to do it with Azure Resource Manager templates.
author: seligj95

ms.assetid: 1d1d85f3-6cc6-4d57-ae1a-5b37c642d812
ms.topic: tutorial
ms.date: 11/26/2025
ms.author: jordanselig
ms.custom: mvc, devx-track-arm-template
ms.service: azure-app-service
---

# Custom configuration settings for App Service Environments

Because App Service Environments are isolated to a single customer, there are certain configuration settings that can be applied exclusively to App Service Environments. This article documents the various specific customizations that are available for App Service Environments.

If you don't have an App Service Environment, see [How to Create an App Service Environment v3](./creation.md).

You can store App Service Environment customizations by using an array in the **clusterSettings** attribute. This attribute is found in the "Properties" dictionary of the *hostingEnvironments* Azure Resource Manager entity.

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

The **clusterSettings** attribute can be included in a Resource Manager template or with the Azure CLI to update the App Service Environment. Certain settings are available in the Azure portal.

However you submit the change, the change isn't immediate and it can take up to 24 hours for the change to take full effect. Some settings have specific details on the time and effect of configuring the specific setting.

## Enable internal encryption

The App Service Environment operates as a black box system where you can't see the internal components or the communication within the system. To enable higher throughput, encryption isn't enabled by default between internal components. The system is secure as the traffic is inaccessible to being monitored or accessed. If you have a compliance requirement though that requires complete encryption of the data path from end to end, there's a way to enable encryption of the complete data path with a clusterSetting.

```json
"clusterSettings": [
    {
        "name": "InternalEncryption",
        "value": "true"
    }
],
```

You can also enable internal encryption using the Azure portal by going to the **Configuration** page for your App Service Environment.

:::image type="content" source="./media/app-service-app-service-environment-custom-settings/app-service-environment-portal-internal-encryption.png" alt-text="Screenshot of the Configuration page in the Azure portal for an App Service Environment showing where to enable internal encryption." border="false":::

Setting InternalEncryption to true encrypts internal network traffic in your App Service Environment between the front ends and workers, encrypts the pagefile and also encrypts the worker disks. After the InternalEncryption clusterSetting is enabled, there can be an effect to your system performance. When you make the change to enable InternalEncryption, your App Service Environment is in an unstable state until the change is fully propagated. Complete propagation of the change can take a few hours to complete, depending on how many instances you have in your App Service Environment. We highly recommend that you don't enable InternalEncryption on an App Service Environment while it is in use. If you need to enable InternalEncryption on an actively used App Service Environment, we highly recommend that you divert traffic to a backup environment until the operation completes.

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

You can also disable TLS 1.0 and TLS 1.1 using the Azure portal by going to the **Configuration** page for your App Service Environment and unchecking the checkbox.

:::image type="content" source="./media/app-service-app-service-environment-custom-settings/app-service-environment-portal-disable-tls.png" alt-text="Screenshot of the Configuration page in the Azure portal for an App Service Environment showing where to disable TLS 1.0 and TLS 1.1." border="false":::

## Change TLS cipher suite order

App Service Environment supports changing the cipher suite from the default. The default set of ciphers is the same set that is used in the multitenant App Service. Changing the cipher suite is only possible with App Service Environment, the single-tenant offering, not the multitenant offering, because changing it affects the entire App Service deployment. There are two cipher suites that are required for an App Service Environment: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 and TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256. Additionally, you should include the following cipher suites, which are required for TLS 1.3: TLS_AES_256_GCM_SHA384 and TLS_AES_128_GCM_SHA256.

> [!IMPORTANT]
> The `FrontEndSSLCipherSuiteOrder` App Service Environment cluster setting isn't compatible with the app-level `minTlsCipherSuite` setting. If you configure the cipher suite order at the App Service Environment level using `FrontEndSSLCipherSuiteOrder`, don't also configure the minimum TLS cipher suite at the individual app level. You must use one or the other, not both. Configuring both settings can cause SSL errors and rejected requests.

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
> If incorrect values are set for the cipher suite that SChannel can't understand, all TLS communication to your server might stop functioning. In such a case, you'll need to remove the *FrontEndSSLCipherSuiteOrder* entry from **clusterSettings** and submit the updated Resource Manager template to revert back to the default cipher suite settings. Use this functionality with caution.

## Enable FIPS mode

This setting applies to Linux-based workloads in your App Service Environment. You can configure your Linux-based workloads running on App Service Environment to operate in FIPS (Federal Information Processing Standards) mode. When enabled, FIPS mode ensures that cryptographic operations comply with FIPS 140-2 standards.

To enable FIPS mode on your App Service Environment, you can set the following **clusterSettings** entry:

```json
"clusterSettings": [
    {
        "name": "LinuxFipsModeEnabled",
        "value": "true"
    }
],
```

When LinuxFipsModeEnabled is set to true, your App Service Environment uses FIPS-compliant cryptographic modules for cryptographic operations.

## Get started

The Azure Quickstart Resource Manager template site includes a template with the base definition for [creating an App Service Environment](https://azure.microsoft.com/resources/templates/web-app-asp-app-on-asev3-create/).
