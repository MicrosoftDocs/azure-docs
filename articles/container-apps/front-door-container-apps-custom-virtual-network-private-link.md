---
title: Azure Container Apps with Azure Front Door Premium using Private Link
description: Deploy Azure Container Apps in a custom virtual network with internal ingress and expose them securely using Azure Front Door Premium via Private Link.
author: kkaushal24011982
ms.author: kkaushal
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 03-02-2026
---


# Azure Front Door (AFD) + Azure Container Apps (ACA) with Custom VNet and Private Endpoints

Technical implementation guide for deploying a zone-redundant, internal ACA environment integrated with Azure Front Door Premium via Private Link.

## 1. Overview

This document explains how to deploy an Azure Container Apps environment using workload profiles, integrated into a custom virtual network with an internal virtual IP (ILB), with public network access disabled. It then shows how to expose the apps privately through Azure Front Door Premium using Private Link and private endpoints, enabling a locked-down inbound path while keeping zone redundancy.

### 1.1 Goals

1. Disable public network access on the Azure Container Apps environment.
2. Deploy a zone-redundant ACA environment into a custom VNet using an internal virtual IP so the environment receives an IP from the VNet (internal load balancer).
3. Enable and configure private endpoints for the ACA environment.
4. Integrate Azure Front Door (AFD) Premium with the ACA environment using Private Link.

## 2. Prerequisites and Constraints

- An Azure account with permissions to create Resource Groups, VNets, Private Endpoints, Azure Container Apps, Log Analytics workspaces, and Azure Front Door profiles.
- Azure Container Apps environment must be a workload profiles environment to use private endpoints and VNet integration together (per current platform limitations).
- The delegated ACA subnet must meet subnet address range restrictions documented by Microsoft: [Custom VNet subnet address range restrictions (workload profiles)](../custom-virtual-networks.md)
- Azure Front Door must use the Premium SKU to configure Private Link origins.
- Private Endpoints must be deployed into a separate subnet (they cannot share the delegated ACA subnet).

## 3. Architecture

### 3.1 ACA environment types (context)

Azure Container Apps supports different environment types. This guide focuses on a workload profiles environment because it is required for the combination of VNet integration, private endpoints, and zone redundancy described here.

Reference: [ACA networking environment selection](../networking.md)


### 3.2 End-to-end traffic flow

1. User connects to Azure Front Door (edge).
2. AFD forwards traffic to the origin over Private Link.
3. Traffic lands on the private endpoint IP in the workload VNet (example: 10.0.2.4).
4. The private endpoint connects to the ACA environment (internal).
5. Within the VNet, the ACA environment uses an internal load balancer VIP (example: 10.0.0.165) to reach Envoy.
6. Envoy routes to the correct container app/revision/replica based on host headers and ingress configuration.

## 4. Key Design Decisions

The following decisions are used throughout this implementation and are called out explicitly to avoid common deployment failures (subnet sizing, SKU requirements, and network access constraints).

The table below summarizes the design choices and rationale.


| Decision | Value | Reason |
|---------|-------|--------|
| ACA subnet size | /23 | Allows room for scaling |
| AFD SKU | Premium | Required for Private Link |



### Architecture (logical)


Internet client
	| HTTPS
	v
+---------------------------+
| Azure Front Door (Edge)   |
| (Premium + WAF optional)  |
+---------------------------+
	| Private Link (AFD origin)
	v
+-----------------------------------+
| Private Endpoint (PE subnet)      |
| Private IP: 10.0.2.4 (example)    |
+-----------------------------------+
	| via Private DNS resolution
	v
+-----------------------------------+
| ACA Environment (internal)        |
| ILB VIP: 10.0.0.165 (example)     |
| Delegated subnet (Microsoft.App)  |
+-----------------------------------+
	|
	v
+---------------------------+
| Envoy ingress (ACA)       |
+---------------------------+
	| host header / ingress rules
	v
+---------------------------+
| Container App             |
| revision / replicas       |
+---------------------------+


## 5. Deployment Procedure

### 5.1 Create the virtual network and subnets

Create a VNet that will host:

1. The delegated ACA environment subnet.
2. A separate private endpoint subnet.

In the Azure portal:

1. Go to **Virtual networks** and select **Create**.
2. Choose the Resource group.
3. Enter a Virtual network name and select the target Region.
4. Proceed to **IP addresses** to define the address space and subnets.

Example configuration used in this walkthrough:

- VNet address space: `10.0.0.0/16`
- ACA delegated subnet: sized per the decision table (example: `10.0.0.0/23`)
- Private Endpoint subnet: separate subnet (example: `10.0.2.0/24`)

On the **IP addresses** tab, configure the address space and create two subnets:

- Subnet 1 (ACA delegated subnet): size per your scaling requirements (example: `/23`). Delegate this subnet to `Microsoft.App/environments` when prompted during ACA environment creation.
- Subnet 2 (Private Endpoint subnet): separate subnet for private endpoints (example: `/24`). Do not delegate this subnet.

Select **Review + create**, then **Create**. After deployment completes, confirm the virtual network and both subnets appear in the Virtual network resource.

### 5.2 Create the Container App and Container Apps environment

1. Search for **Container Apps** in the portal and select **Create**.
2. Provide a Resource group and a Container app name.
3. For **Container Apps environment**, select **Create new**.

On the **Basics** tab:

1. Select the Resource group.
2. Enter the Container app name.
3. For **Container Apps environment**, select **Create new**.
4. Choose the target Region for the environment.

In the environment configuration, enable **Zone redundancy** (if available in your selected region) and verify it is enabled before proceeding to the next tabs.

#### 5.2.1 Configure workload profiles

Under **Workload profiles**, add at least one profile by specifying the profile name, selecting the workload profile size (VM size), and configuring the autoscaling instance count range.

1. Open the **Workload profiles** tab.
2. Select **Add** to add a new profile.
3. Enter a Profile name.
4. Choose the Workload profile size (VM size).
5. Set the Instance count range (minimum and maximum) for autoscaling.
6. Select **Add** to save the profile.

(Optional) On the **Monitoring** tab, enable monitoring and select a Log Analytics workspace to collect logs and metrics for the environment.

#### 5.2.2 Configure environment networking (lock down inbound)

On the **Networking** tab, configure the environment for private, internal ingress:

1. Set **Public network access** to **Disabled**.
2. Enable VNet integration and select the delegated ACA subnet you created earlier.
3. Set **Virtual IP** to **Internal** to use an internal load balancer VIP from the delegated subnet.
4. Enable **Private endpoints**, and select Azure Private DNS zone for DNS integration.
5. Verify the configuration summary shows VNet integration enabled, the virtual IP set to internal, and private endpoints enabled before proceeding.

Select **Create** to create the environment. The portal returns you to the Container App Basics page so you can continue configuring the container app.

### 5.3 Configure the Container App

On the **Container** tab, configure the container image for your app (example used here: Quickstart image) and proceed through **Tags** and **Review + create** to deploy.

1. Open the **Container** tab.
2. Select the Image source (for example, Quickstart for a test deployment, or a registry for your own image).
3. Provide the Image details (registry, repository, tag) if not using a quickstart.
4. Configure app settings as needed (CPU/memory, environment variables, and scaling defaults).

Complete the **Tags** step, then select **Review + create** to deploy.

### 5.4 Post-deployment verification (ACA)

- Verify that the expected resources were created in the resource group (Container App, Container Apps environment, managed infrastructure resources).
- Confirm the environment is using an internal virtual IP (ILB VIP) from the delegated subnet.
- In the resource group, confirm the Container App and Container Apps environment resources exist.
- Open the Container Apps environment resource and verify **Public network access** is **Disabled**.
- Under environment networking, confirm **Virtual IP** is **Internal** and note the ILB VIP assigned from the delegated subnet. Because Virtual IP was set to Internal, the environment creates an internal load balancer. Example ILB VIP used in this walkthrough: `10.0.0.165`.
- Confirm the Private DNS zone used for the ACA private endpoint is present, linked to the workload VNet, and contains the required A record for the Container Apps environment domain. (Depending on the option selected during deployment, Azure may create/link the zone and records automatically—verify the outcome.)

#### 5.4.1 Private DNS configuration

Ensure the Private DNS zone is linked to the VNet and that required A records exist for name resolution from within the private network.

- Verify the zone contains the required A records for the Container Apps environment domain so that the origin name resolves to the private endpoint IP from within the VNet.
- From a VM or other test client in the VNet, validate DNS resolution (for example, using `nslookup`) and confirm it returns the private endpoint IP.

### 5.5 Create Azure Front Door Premium with Private Link origin

Create an Azure Front Door profile using the Premium SKU to enable Private Link connectivity to the private ACA origin.

1. Search for **Azure Front Door** in the portal and select **Quick create** (or **Create profile**).
2. Choose a profile name and set SKU to **Premium**.
3. Create an endpoint name and set Origin type to **Container Apps**, then select/provide the Container Apps origin host name.
4. Enable Private Link service for the origin.
5. Provide the region, target sub-resource, and an approval message. AFD will create a private endpoint connection request that must be approved on the ACA environment side.

Create an Azure Front Door profile (Premium) and add the ACA environment as a Private Link origin:

1. Search for **Azure Front Door and CDN profiles** (or **Azure Front Door**) and select **Create** (or **Quick create**).
2. Set the SKU to **Premium**.
3. Create (or select) an Endpoint name.
4. Add an Origin group and create an Origin with Origin type set to **Container Apps**.
5. Select the target Container Apps (or provide the origin hostname) for the origin.
6. Enable Private Link for the origin, then choose the Region, Target sub-resource, and provide an Approval message.
7. Select **Review + create**, then **Create**.

When adding the origin, confirm Origin type is set to **Container Apps** and Private Link is enabled for the origin.In the Private Link settings, choose the origin Region, select the correct Sub-resource, and enter an Approval message so the target can identify the request.Select **Review + create** to deploy the Azure Front Door profile.

After Azure Front Door is created, go to the Container Apps environment → Networking and review the Private endpoint connections. Approve the pending request created by Azure Front Door.

1. After Front Door deploys, open the Container Apps environment.
2. Go to **Networking → Private endpoint connections**.
3. Locate the pending connection request created by Azure Front Door and select **Approve**.

Confirm the private endpoint connection status changes to **Approved**.

In the private endpoint resource (or the Private Endpoint subnet), note the private IP assigned to the endpoint. This is the IP Front Door uses via Private Link to reach the internal ACA origin.

Optionally harden the configuration by updating the default route and origin group to allow HTTPS-only traffic. Allow time for Front Door configuration propagation (often ~25–40 minutes).

## 6. Validation

- From a client that can reach the Front Door endpoint, verify the application is reachable over HTTPS and returns expected responses.
- Confirm the ACA environment shows **Public network access: Disabled**.
- Confirm the Front Door private endpoint connection is in **Approved** state.
- Confirm DNS resolution for the origin occurs privately (Private DNS zone linked to the VNet) and that traffic reaches the internal ILB VIP.
- Review Container Apps logs (and Log Analytics if enabled) to confirm requests are arriving as expected.

## 7. Troubleshooting

- ACA environment creation fails with subnet validation errors: re-check the delegated subnet address range restrictions and ensure the subnet is exclusively used for the ACA environment.
- Private endpoint deployment fails: verify the private endpoint is being created in a non-delegated subnet and that network policies for private endpoints are configured as required in your environment.
- Front Door origin health probe fails: confirm the origin is reachable through Private Link, the private endpoint connection is approved, and DNS resolves to the private endpoint IP from within the relevant network path.
- Unexpected public reachability: validate that Public network access is disabled on the ACA environment and that no other ingress path (public app ingress, other gateways) is exposed.

## 8. References

- [ACA networking environment selection](../networking.md)
- [Custom VNet subnet address range restrictions (workload profiles)](../custom-virtual-networks.md)










