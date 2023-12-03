---
title: Get started with enterprise IoT monitoring in Microsoft 365 Defender | Microsoft Defender for IoT
description: Learn how to get added value for enterprise IoT devices in Microsoft 365 Defender.
ms.topic: quickstart
ms.date: 09/13/2023
ms.custom: enterprise-iot
#CustomerIntent: As a Microsoft 365 administrator, I want to understand how to turn on support for enterprise IoT monitoring in Microsoft 365 Defender and where I can find the added security value so that I can keep my EIoT devices safe.
---

# Get started with enterprise IoT monitoring in Microsoft 365 Defender

This article describes how [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/) customers can monitor enterprise IoT devices in their environment, using added security value in Microsoft 365 Defender.

While IoT device inventory is already available for Defender for Endpoint P2 customers, turning on enterprise IoT security adds alerts, recommendations, and vulnerability data, purpose-built for IoT devices in your enterprise network.

IoT devices include printers, cameras, VOIP phones, smart TVs, and more. Turning on enterprise IoT security means, for example, that you can use a recommendation in Microsoft 365 Defender to open a single IT ticket for patching vulnerable applications across both servers and printers.

## Prerequisites

Before you start the procedures in this article, read through [Secure IoT devices in the enterprise](concept-enterprise.md) to understand more about the integration between Defender for Endpoint and Defender for IoT.

Make sure that you have:

- IoT devices in your network, visible in the Microsoft 365 Defender **Device inventory**

- Access to the Microsoft 365 Defender portal as a [Security administrator](../../active-directory/roles/permissions-reference.md#security-administrator)

- One of the following licenses:

    - A Microsoft 365 E5 (ME5) or E5 Security license

    - Microsoft Defender for Endpoint P2, with an extra, standalone **Microsoft Defender for IoT - EIoT Device License - add-on** license, available for purchase or trial from the Microsoft 365 admin center.

    > [!TIP]
    > If you have a standalone license, you don't need to toggle on **Enterprise IoT Security** and can skip directly to [View added security value in Microsoft 365 Defender](#view-added-security-value-in-microsoft-365-defender).
    >

    For more information, see [Enterprise IoT security in Microsoft 365 Defender](concept-enterprise.md#enterprise-iot-security-in-microsoft-365-defender).


## Turn on enterprise IoT monitoring

This procedure describes how to turn on enterprise IoT monitoring in Microsoft 365 Defender, and is relevant only for ME5/E5 Security customers.

Skip this procedure if you have one of the following types of licensing plans:

- Customers with legacy Enterprise IoT pricing plan and an ME5/E5 Security license.
- Customers with standalone, per-device licenses added on to Microsoft Defender for Endpoint P2. In such cases, the Enterprise IoT security setting is turned on as read-only.

**To turn on enterprise IoT monitoring**:

1. In [Microsoft 365 Defender](https://security.microsoft.com/), select **Settings** \> **Device discovery** \> **Enterprise IoT**.

1. Toggle the Enterprise IoT security option to **On**. For example:

    :::image type="content" source="media/enterprise-iot/eiot-toggle-on.png" alt-text="Screenshot of Enterprise IoT toggled on in Microsoft 365 Defender.":::

## View added security value in Microsoft 365 Defender

This procedure describes how to view related alerts, recommendations, and vulnerabilities for a specific device in Microsoft 365 Defender, when the **Enterprise IoT security** option is turned on.

**To view added security value**:

1. In [Microsoft 365 Defender](https://security.microsoft.com/), select **Assets** \> **Devices** to open the **Device inventory** page.

1. Select the **IoT devices** tab and select a specific device **IP** to drill down for more details. For example:

    :::image type="content" source="media/enterprise-iot/select-a-device.png" alt-text="Screenshot of the IoT devices tab in Microsoft 365 Defender." lightbox="media/enterprise-iot/select-a-device.png":::

1. On the device details page, explore the following tabs to view data added by the enterprise IoT security for your device:

    - On the **Alerts** tab, check for any alerts triggered by the device. Simulate alerts in Microsoft 365 Defender for Enterprise IoT using the Raspberry Pi scenario available in the Microsoft 365 Defender [Evalutation & Tutorials](https://security.microsoft.com/tutorials/all) page.

        You might also set up advanced hunting queries to create custom alert rules. For more information, see [Advanced Hunting Queries](#sample-of-advanced-hunting-queries-for-enterprise-iot-monitoring). 

    - On the **Security recommendations** tab, check for any recommendations available for the device to reduce risk and maintain a smaller attack surface.

    - On the **Discovered vulnerabilities** tab, check for any known CVEs associated with the device. Known CVEs can help decide whether to patch, remove, or contain the device and mitigate risk to your network. Alternately, use [advanced hunting queries](#sample-of-advanced-hunting-queries-for-enterprise-iot-monitoring) to collect vulnerabilities across all your devices.

**To hunt for threats**:

On the **Device inventory** page, select **Go hunt** to query devices using tables like the *[DeviceInfo](/microsoft-365/security/defender/advanced-hunting-deviceinfo-table)* table. On the **Advanced hunting** page, query data using other schemas. 

## Sample of advanced hunting queries for Enterprise IoT monitoring

Some examples of advanced hunting queries to find rogue devices with Microsoft 365 Defender

### To find devices within a subnet:

Use the query below to help find devices that were discovered on a specific subnet in your network (replace the values “IpV4Range” or “IpV6Range” with the value you are searching for):  

```kusto
let IpV6Range = “2001:4898::1050:1050/127”;  

DeviceNetworkInfo  
| where Timestamp > ago(7d)  
| summarize arg_max(Timestamp, *) by DeviceId  
| mv-expand IPAddressEntry=todynamic(IPAddresses)  
| extend IPAddress=tostring(IPAddressEntry.IPAddress)  
| where ipv6_is_match(IPAddress, IpV6Range)  
```

```kusto
let IpV4Range = “172.22.138.0/24”;  

DeviceNetworkInfo  
| where Timestamp > ago(7d)  
| summarize arg_max(Timestamp, *) by DeviceId  
| mv-expand IPAddressEntry=todynamic(IPAddresses)  
| extend IPAddress=tostring(IPAddressEntry.IPAddress)  
| where ipv4_is_in_range(IPAddress, IpV4Range)  
```

### Find devices that you can better protect by onboarding them to MDE:

Some devices on your network support Microsoft Defender for Endpoint but for some reason were not onboarded. Onboarding these devices to Microsoft Defender for Endpoint will ensure that they are better protected, will have detection and response capabilities and vulnerability assessments.  

Run the following query in your tenant to understand which of your devices can be onboarded:

```kusto
DeviceInfo  

| summarize arg_max(Timestamp, *) by DeviceId  
| where OnboardingStatus == "Can be onboarded"  
```

### Find devices by specific type or subtype:

To find which devices exist in your corporate network by type of device (i.e. router), you can use the following query:  

```kusto
DeviceInfo  

| summarize arg_max(Timestamp, *) by DeviceId  
| where DeviceType == "NetworkDevice" and DeviceSubtype  == "Router"  
```

### Find devices with a prefix or suffix in the host name 

If you manage your devices with a specific naming convention, you can query devices based on names as well. Change the highlighted values after “startswith” or “endswith” accordingly:  

```kusto
DeviceInfo  

| summarize arg_max(Timestamp, *) by DeviceId  
| where OnboardingStatus != "Onboarded"  
| where DeviceName startswith "minint"  
```

// Suffix  

```kusto
DeviceInfo  

summarize arg_max(Timestamp, *) by DeviceId  
where OnboardingStatus != "Onboarded"  
where DeviceName endswith "-pc"  
```

### Find specific device models   
To find specific models of devices, leveraging the following query:   

```kusto
DeviceInfo  

| summarize arg_max(Timestamp, *) by DeviceId  
| summarize ModelCount=dcount(DeviceId) by Model  
| where ModelCount < 5  
```

## Find and export vulnerabilities for your IoT devices

The following query collects all vulnerabilities on your IoT devices:

```kusto
| where DeviceCategory =~ "iot"
| join kind=inner DeviceTvmSoftwareVulnerabilities on DeviceId 
```

For more information, see [Advanced hunting](/microsoft-365/security/defender/advanced-hunting-overview) and [Understand the advanced hunting schema](/microsoft-365/security/defender/advanced-hunting-schema-tables).

## Next steps

> [!div class="nextstepaction"]
> [Device discovery overview](/microsoft-365/security/defender-endpoint/device-discovery)
