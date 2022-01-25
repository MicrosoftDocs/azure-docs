---
title: What is Azure Payment HSM?
description: Learn how Azure Payment HSM is an Azure service that xxx.
services: payment-hsm
author: msmbaldwin
tags: azure-resource-manager

ms.service: payment-hsm
ms.workload: security
ms.topic: overview
ms.date: 01/20/2022
ms.author: mbaldwin


---
# Public Preview

Here are the details of the Azure Payment HSM public preview.

## Availability

The Azure Public Preview is currently available in **East US** and **North Europe**.

## Prerequisites 

Azure Payment HSM customers must have the following:

- Access to the Thales Customer Portal (Customer ID)
- Thales smart cards and card reader for payShield Manager

## Cost

The HSM devices will be charged based on the above service pricing table. All other Azure resources for networking and virtual machines will incur regular Azure costs too.

## payShield customization considerations

If you are using payShield on-prem today with a custom firmware a porting exercise is required to update the firmware to a version compatible with the Azure deployment. Please contact your Thales account manager to request a quote.
Please ensure that the following information is provided:
- Customization hardware platform (e.g., payShield 9000 or payShield 10K)
- Customization firmware number

## Public Preview disclaimers

- There is no SLA. 
- Use of this service for production workloads is not supported
- License level is set during resource creation via the SKU specified in the command License upgrade or downgrade will require resource deletion and creation of a new resource with the desired license level. 
- Customer onboarding experience:
    - Customer can create HSM resource using Azure CLI to create Data and MGMT in same VNET, supports customer using existing VNET
    - Customer can create HSM resource use ARM template to create Data and MGMT in different VNET, does not support customer using existing VNET
    - Customer must create appropriate subnets for the VMs
    - Cross region VNET peering is not supported
    - HSM resource’s network connectivity is manually enabled by Microsoft, customer will need to work with Microsoft support in some steps closely to complete the onboarding process. There might be 1-3 business day delay between successful resource creation and network connectivity to work. Due to this reason, the billing on public preview is delayed by 71 hours after the resource is created.
- HSM devices are deployed in two stamps in each region (East US, North Europe) stamp1 and stamp2. Customer can test HA by allocating HSM from these two stamps. 
- Customer can allocate max 2 HSMs from each stamp in one region.
- Customer can keep the allocated HSM till GA if needed

## Next steps

- Learn more about [Azure Payment HSM](overview.md)
- [Get started with Azure Payment HSM](getting-started.md)
- See some common [deployment scenarios](deployment-scenarios.md)
- Read the [frequently asked questions](faq.yml)
