---
title: How to enable Micro-BFD on CE and PE devices
description: Process of enabling Micro-BFD On CE and PE devices.
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 08/12/2024
ms.custom: template-how-to, devx-track-azurecli
---

# Enabling Micro-BFD

Micro-BFD (Bidirectional Forwarding Detection) is a lightweight protocol designed to rapidly detect failures between adjacent network devices, such as routers or switches, with minimal overhead. This guide provides step-by-step instructions to enable Micro-BFD on Customer Edge (CE) and Provider Edge (PE) devices.

## Prerequisites

Ensure the following prerequisites are met before enabling Micro-BFD:

- Both CE and PE devices are preconfigured with the required Micro-BFD settings.

- The feature flag `MicroBFDEnabled` is turned off by default.

>[!Note]
> It is required to contact Microsoft support through a support incident to enable the feature flag once necessary configurations has been performed to devices as explained in this article.

- It's necessary to [put the device in maintenance mode](.\howto-put-device-in-maintenance-mode.md) to apply below the configuration changes. 

## Configuration steps for enabling Micro-BFD

### Steps for existing deployments

To enable Micro-BFD, follow these steps, starting with the secondary devices. Once verified, proceed with the primary devices using the instructions provided. This ensures that the Micro BFD feature is enabled correctly without causing any disruptions to the network. This sequence helps in maintaining the stability and reliability of the network during the configuration process. 

#### Step 1: Place CE2 in Maintenance Mode 

Run the following Azure CLI command to place the CE2 device in maintenance mode:

```Azure CLI
az networkfabric device update-admin-state --resource-group <resource-group> --resource-name <resource-name> --state UnderMaintenance
```

#### Step 2.1: Configure Micro-BFD on CE2

Use the following Azure CLI command to configure Micro-BFD under Port-Channel1 on CE2.

```Azure CLI 
az networkfabric device run-rw \
  --ids "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.ManagedNetworkFabric/NetworkDevices/<device>-AggrRack-CE2" \
  --rw-command "interface Port-Channel1
    ip address 10.30.0.69/30
    mtu 9124
    no switchport
    bfd neighbor 10.30.0.70
    bfd interval 50 min-rx 50 multiplier 3
    bfd per-link rfc-7130
!" \
  --debug
```

```Example IP address allocation
  Example1: NFIPv4Addr : 10.30.0.0/19 then 10.30.0.0/24 is reserved for TS<->PE and CE<->PE interaction
            CE<->PE MicroBFD : 10.30.0.64/30  --> CE1: 10.30.0.65/30 & PE1: 10.30.0.66/30
 		               10.30.0.68/30  --> CE2: 10.30.0.69/30 & PE2: 10.30.0.70/30
 							  
  Example2: NFIPv4Addr : 10.30.32.0/19 then 10.30.32.0/24 is reserved for TS<->PE and CE<->PE interaction
            CE<->PE MicroBFD : 10.30.32.64/30  --> CE1: 10.30.32.65/30 & PE1: 10.30.32.66/30
 		               10.30.32.68/30  --> CE2: 10.30.32.69/30 & PE2: 10.30.32.70/30
```

Verify the changes using the following command and check that the configured IP address, BFD interval, and neighbor details match the intended configuration.

```Example show output after configuring MicroBFD on CE2
Example show output after configuring MicroBFD in CE2 :							  
 		CE2#show running-config interfaces  pox
 				interface pox  					   
                                   description "Port pox Connected to PE-01"
 				   mtu 9124
 				   no switchport
 				   ip address 10.30.0.69/30
 				   bfd interval 50 min-rx 50 multiplier 3
 				   bfd neighbor 10.30.0.70
 				   bfd per-link rfc-7130
```

#### Step 2.2: Configure Micro-BFD on PE2

Configure PE2 device to enable Micro-BFD. Consider min-links under PE device for respective port-channel. 
 
Verify the changes using the following command and check that the configured IP address, BFD interval, and neighbor details match the intended configuration 

```Example Show Output After Configuring MicroBFD on PE2
PE2#show running-config interfaces pox
    interface pox
        description "Port pox Connected to CE-02"
        mtu 9124
        no switchport
        ip address 10.30.0.70/30
        bfd interval 50 min-rx 50 multiplier 3
        bfd neighbor 10.30.0.69
        bfd per-link rfc-7130
```

#### Step 3: Move device CE2 into enabled state

Use the following command to re-enable the device and make it operational after configuration.

```Azure CLI
az networkfabric device update-admin-state --resource-group <resource-group> --resource-name <resource-name> --state Enable
```

```Example show command to check bfd details		 
CE1#show bfd peers dest-ip 10.30.0.69 detail
```

#### Step 4: Place CE1 in Maintenance Mode 

Run the following Azure CLI command to place the CE1 device in maintenance mode:

```Azure CLI
az networkfabric device update-admin-state --resource-group <resource-group> --resource-name <resource-name> --state UnderMaintenance
```

#### Step 5.1: Configure Micro-BFD on CE1

Use the following Azure CLI command to configure Micro-BFD under Port-Channel1 on CE1.

```Azure CLI 
az networkfabric device run-rw \
  --ids "/subscriptions<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.ManagedNetworkFabric/NetworkDevices/<device>-AggrRack-CE1" \
  --rw-command "interface Port-Channel1
    ip address 10.30.0.65/30
    mtu 9124
    no switchport
    bfd neighbor 10.30.0.66
    bfd interval 50 min-rx 50 multiplier 3
    bfd per-link rfc-7130
!" \
  --debug
```

```Example show output after configuring MicroBFD in CE1 :		                    
 		CE1#show running-config interfaces  pox
 			interface pox
 			   description "Port pox Connected to PE-01"
 			   mtu 9124
 			   no switchport
 			   ip address 10.30.0.65/30
 			   bfd interval 50 min-rx 50 multiplier 3
 			   bfd neighbor 10.30.0.66
 			   bfd per-link rfc-7130
```

#### Step 5.2: Configure Micro-BFD on PE1

Configure PE1 device to enable Micro-BFD. Consider min-links under PE device for respective port-channel. 
 
Verify the changes using the following command and check that the configured IP address, BFD interval, and neighbor details match the intended configuration 
 

``` Example show output after configuring MicroBFD in CE1
 		PE1#show running-config interfaces  pox
 			interface xyz
 			   description "Port xyz Connected to CE-01"
 			   mtu 9124
 			   no switchport
 			   ip address 10.30.0.66/30
 			   bfd interval 50 min-rx 50 multiplier 3
 			   bfd neighbor 10.30.0.65
 			   bfd per-link rfc-7130
 			PE1#
```

#### Step 6: Move device CE1 into enabled state

Use the following command to re-enable the device and make it operational after configuration.

```Azure CLI
az networkfabric device update-admin-state --resource-group <resource-group> --resource-name <resource-name> --state Enable
```

```Example show command to check bfd details		 
CE1#show bfd peers dest-ip 10.30.0.66 detail
```

#### Step 7: Ensure connectivity and BGP sessions

Ensure connectivity between CE and PE devices is stable, and BGP sessions are established with the appropriate routes.


#### Step 8: Enable Micro-BFD Flag

Contact Microsoft Support by raising a support incident to enable the Micro-BFD feature flag, after verifying that all prerequisite steps are completed and the Micro-BFD session is `Up`. Once the feature flag is enabled, perform a full reconciliation with the base configuration, ensuring that the NPB property is set to `true`.

#### Step 9: Verify Connectivity and BGP Sessions

After enabling the feature flag, confirm that connectivity and BGP sessions remain stable.

#### Step 10: Remove configuration from RW config

After the BFD sessions are up, run the following Azure CLI command to remove BFD configurations. This process ensures that every full reconcile request avoids reapplying configurations to the devices.

```Azure CLI 
az networkfabric device run-rw --ids /subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.ManagedNetworkFabric/NetworkDevices/<device-name>-AggrRack-CE1\PE1\CE2\PE2 --rw-command " "
```

#### Step 11: Ensure devices aren't disturbed

Ensure that devices aren't disturbed for Micro-BFD configuration.

### Steps for new deployments

#### **Prerequisites**  

Before enabling the **Micro BFD** feature flag, ensure the following:  

- The **Provider Edge (PE)** is configured with the required **Micro BFD settings**.  

- Configure **PE devices** to enable Micro BFD and ensure the **min-links** under the PE device for the respective port-channel are considered.

- Inform the **Microsoft Support team** about the planned Micro BFD feature flag enablement.  

> [Note]
> Ensure that Micro-BFD is enabled by reviewing the Provider Edge (PE) configuration as part of the standard validation checks. Include a confirmation statement in the support ticket indicating that Micro-BFD is enabled.

#### **Configuring Micro BFD on PE devices**  

Below are example configurations for enabling **Micro BFD** on PE devices.  

```Example: PE2 configuration
PE2# show running-config interfaces pox  
interface pox  
   description "Port pox Connected to CE-02"  
   mtu 9124  
   no switchport  
   ip address 10.30.0.70/30  
   bfd interval 50 min-rx 50 multiplier 3  
   bfd neighbor 10.30.0.69  
   bfd per-link rfc-7130  
PE2#
```

```Example: PE1 Configuration
PE1# show running-config interfaces pox  
interface pox  
   description "Port xyz Connected to CE-01"  
   mtu 9124  
   no switchport  
   ip address 10.30.0.66/30  
   bfd interval 50 min-rx 50 multiplier 3  
   bfd neighbor 10.30.0.65  
   bfd per-link rfc-7130 
```

#### **Step 1: Create the Network Fabric** 

Proceed with creating the **Network Fabric** as per the standard provisioning procedures.

#### **Step 2: Customer approval for geneva action**  

The customer must approve the **lockbox enabled geneva action** before proceeding further.

#### **Step 3: Network provisioning operation**  

Once the **Micro BFD** feature is enabled, validate the **BFD status** on the **CE devices** using the following CLI commands.

```Example: Checking BFD details on CE2
CE2# show bfd peers dest-ip 10.30.0.70 detail  
```

```Example: Checking BFD details on CE1
CE1# show bfd peers dest-ip 10.30.0.66 detail  
```

>[!Note]
> Check the BFD status using the provided commands on both CE devices or same can be requested from Microsoft support team to share once the configuration is completed.  

## Recovery steps if Micro-BFD is misconfigured

In cases like reconfiguration, where Micro-BFD is disabled by default but the Provider Edge (PE) device still has settings from a previous deployment, it's important to remove the Micro-BFD configuration from the PE device.

Follow these steps to ensure that Micro-BFD is disabled on your PE devices:

### Step1: Identify the PE devices

Determine which PE devices have the Micro-BFD configuration from the previous deployment.

### Step2: Remove Micro-BFD configuration

Access the configuration settings of each identified PE device and remove any existing Micro-BFD settings.

### Verify configuration

Ensure that the Micro-BFD settings have been successfully removed and that the PE device is operating without Micro-BFD enabled.
