---
title: How to create remote networks for Global Secure Access (preview)
description: Learn how to create remote networks for Global Secure Access (preview).
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 06/09/2023
ms.service: network-access
ms.custom: 
---
# How to create a remote network

Remote networks are remote locations, such as a branch office, or networks that require internet connectivity. Setting up remote networks connects your users in remote locations to Global Secure Access (preview). Once a remote network is configured, you can assign a traffic forwarding profile to manage your corporate network traffic.

Global Secure Access provides remote network connectivity so you can connect a remote network to Global Secure Access. Network security policies are then applied on all outbound traffic. 

There are multiple ways to connect remote networks to Global Secure Access. In a nutshell, you're creating an Internet Protocol Security (IPSec) tunnel between a core router at your remote network and the nearest Global Secure Access endpoint. All internet-bound traffic is routed through the core router of the remote network for security policy evaluation in the cloud. Installation of a client isn't required on individual devices.

This article explains how to create a remote network for Global Secure Access (preview).

## Prerequisites

- **Global Secure Access Administrator** role in Microsoft Entra ID
- Complete the onboarding process for remote networks

### Known limitations

- At this time, the number of remote networks per tenant is limited to 10, and the number of device links per remote network is limited to four.
- Customer premises equipment (CPE) devices must support the following protocols:
    - Internet Protocol Security (IPSec)
    - Internet Key Exchange Version 2 (IKEv2)
    - Border Gateway Protocol (BGP)
- Remote network connectivity solution uses *RouteBased* and *Responder* modes.
<!--- validate the above limitation with Sumit--->

## Onboard your tenant for remote networks

Before you can set up remote networks, you need to onboard your tenant information with Microsoft. This one-time process enables your tenant to use remote network connectivity.

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a Global Secure Access Administrator. 
1. Go to **Global Secure Access (preview)** > **Devices** > **Remote network**.
1. Select the link to the **Onboarding form** in the message at the top of the page.

    ![Screenshot of the onboarding form link.](media/how-to-create-remote-networks/create-remote-network-onboarding-form-link.png)

1. In the window that opens, review the Tenant ID and remote network region details.
1. Select the **Next** button.
    
    ![Screenshot of the first tab of the onboarding form.](media/how-to-create-remote-networks/onboard-tenant-info.png)

1. Select the email address link. It sends a predrafted email in your default mail client on your device. Send that email to the Global Secure Access team. Once your tenant is processed - which may take up to seven business days - we'll send IPsec tunnel and BDG connectivity details to the email you used.

    ![Screenshot of the send email steps for the onboard tenant process.](media/how-to-create-remote-networks/onboard-tenant-send-email.png)

1. Once the email step is complete, return to this form, select the acknowledgment checkbox, and select the **Submit** button.

You MUST complete the email step before selecting the checkbox. 

## Create a remote network with the Microsoft Entra admin center

Remote networks are configured on three tabs. You must complete each tab in order. After completing the tab either select the next tab from the top of the page, or select the **Next** button at the bottom of the page.

### Basics
The first step is to provide the basic details of your remote network, including the name, location, and bandwidth capacity. Completing this tab is required to create a new remote network.

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a Global Secure Access Administrator. 
1. Go to **Global Secure Access (preview)** > **Devices** > **Remote network**.
1. Select the **Create remote network** button and provide the following details:
    - **Name**
    - **Region**

![Screenshot of the General tab of the create device link process.](media/how-to-create-remote-networks/create-basics-tab.png)

### Connectivity

The connectivity tab is where you add the device links for the remote network. You need to provide the device type, IP address, border gateway protocol (BGP) address, and autonomous system number (ASN) for each device link. You can also add device links after creating the remote network. For more information on device links, see [How to manage remote network device links](how-to-manage-remote-network-device-links.md).

1. Select the **Add a link** button. The **Add a link pane** opens with three tabs to complete.

**General**

1. Enter the following details: 
    - **Link name**: Name of your CPE.
    - **Device type**: Choose one of the options from the dropdown list.
    - **IP address**: Public IP address of your device.
    - **Peer BGP address**: The border gateway protocol address of the CPE.
    - **Link ASN**: Provide the autonomous system number of the CPE. For more information, see the **Valid ASNs** section of the [Remote network configurations](reference-remote-network-configurations.md) article.
    - **Redundancy**: Select either *No redundancy* or *Zone redundancy* for your IPSec tunnel.
    - **Bandwidth capacity (Mbps)**: Choose the bandwidth for your IPSec tunnel.
1. Select the **Next** button.

![Screenshot of the general tab of the create device link process.](media/how-to-create-remote-networks/device-link-general-tab.png)

**Details**

1. **IKEv2** is selected by default. At this time, only IKEv2 is supported.
1. The IPSec/IKE policy is set to **Default** but you can change to **Custom**.
    - If you select **Custom**, you must use a combination of settings that are supported by Global Secure Access.
    - The valid configurations you can use are mapped out in the [Remote network valid configurations](reference-remote-network-configurations.md) reference article.
    - Whether you choose Default or Custom, the IPSec/IKE policy you specify must match the policy on your CPE.
    - View the [remote network valid configurations](reference-remote-network-configurations.md).
1. Select the **Next** button.

The following screenshot displays the **Details** tab, with the **Custom** option selected.

![Screenshot of the custom details for the device link.](media/how-to-create-remote-networks/device-link-details.png)

**Security**

1. Enter a preshared key to be used on your CPE.
1. Select the **Add link** button. 

### Traffic forwarding profiles

You can assign the remote network to a traffic forwarding profile when you create the remote network. You can also assign the remote network at a later time. For more information, see [Traffic forwarding profiles](concept-traffic-forwarding.md).

1. Either select the **Next** button or select the **Traffic profiles** tab.
1. Select the appropriate traffic forwarding profile.
1. Select the **Review + Create** button.

### Review and create

The final tab in the process is to review all of the settings that you provided. Review the details provided here and select the **Create remote network** button.

## Create remote networks using the Microsoft Graph API

Global Secure Access remote networks can be viewed and managed using Microsoft Graph on the `/beta` endpoint. Creating a remote network and assigning a traffic forwarding profile are separate API calls.

### Create a remote network

1. Sign in to [Graph Explorer](https://aka.ms/ge).
1. Select POST as the HTTP method. 
1. Select BETA as the API version. 
1. Add the following query to use Create Branches API (add hyperlink to the Graph API) 
    ```
    POST https://graph.microsoft.com/beta/networkaccess/branches 
    { 
        "name": "ContosoBranch", 
        "country": "United States ", //must be removed 
        "region": "East US", 
        "bandwidthCapacity": 1000, //must be removed. This goes under deviceLink. 
        "deviceLinks": [ 
        { 
            "name": "CPE Link 1", 
            "ipAddress": "20.125.118.219", 
            "version": "1.0.0", 
            "deviceVendor": "Other", 
            "bgpConfiguration": { 
                "ipAddress": "172.16.11.5", 
                "asn": 8888 
              }, 
              "tunnelConfiguration": { 
                  "@odata.type": "#microsoft.graph.networkaccess.tunnelConfigurationIKEv2Default", 
                  "preSharedKey": "Detective5OutgrowDiligence" 
              } 
        }] 
    }  
    ```
1. Select **Run query** to create a remote network.

### Assign a traffic forwarding profile

Associating a traffic forwarding profile to your remote network using the Microsoft Graph API is two step process. First, locate the ID of the traffic profile. The ID is different for all tenants. Second, associate the traffic forwarding profile with your desired remote network.

1. Sign in to [Graph Explorer](https://aka.ms/ge).
1. Select **PATCH** as the HTTP method from the dropdown. 
1. Select the API version to **beta**. 
1. Enter the query:
    ```
    GET https://graph.microsoft.com/beta/networkaccess/forwardingprofiles 
    ```
1. Select **Run query**. 
1. Find the ID of the desired traffic forwarding profile. 
1. Select PATCH as the HTTP method from the dropdown. 
1. Enter the query:
    ```
        PATCH https://graph.microsoft.com/beta/networkaccess/branches/d2b05c5-1e2e-4f1d-ba5a-1a678382ef16/forwardingProfiles
        {
            "@odata.context": "#$delta",
            "value":
            [{
                "ID": "1adaf535-1e31-4e14-983f-2270408162bf"
            }]
        }
    ```
1. Select **Run query** to update the remote network.

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Next steps

- [List remote networks](how-to-list-remote-networks.md)
- [Manage remote networks](how-to-manage-remote-networks.md)
- [Learn how to add remote network device links](how-to-manage-remote-network-device-links.md)
