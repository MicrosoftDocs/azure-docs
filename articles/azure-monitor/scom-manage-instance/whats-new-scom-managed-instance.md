---
ms.assetid: 
title: What’s new in Azure Monitor SCOM Managed Instance
description: This article provides details of what's new in each version of Azure Monitor SCOM Managed Instance.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 08/12/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: whats-new
---

# What’s new in Azure Monitor SCOM Managed Instance 

This article provides details of what's new in each version of Azure Monitor SCOM Managed Instance.

## Version 1.0.103

- Bug fix in domain connectivity checks of validation to prevent timeouts.

## Version 1.0.100

- Bug fix in pre-patch/pre-scale validations.

## Version 1.0.99

- Enhanced checks for domain connectivity to handle multiple domain controllers during onboarding, pre-patching, and pre-scaling validations.

## Version 1.0.98

- Improved onboarding telemetry and bug fixes in prerequisite validations.

- Improved reliability of clean-up actions after update and scale-down operations.

- Updated troubleshooting script.

## Version 1.0.97

- Improved onboarding telemetry.

- Bug fix to remove stale AD objects associated with deallocated VMs after the scale down/update operation.

## Version 1.0.96

- Pre-patch validation bug fix for machines that have unresolved accounts in the admin group.

## Version 1.0.95

- Enhance onboarding/pre-patching/pre-scaling validations to check the connectivity to required endpoints as described in [firewall requirements](configure-network-firewall.md#firewall-requirements).

## Version 1.0.94

- Installation bug fix for domain joined machines.

- Fixed issue in scale down operation where incorrect management server was being assigned as RMS.

- Enhanced system resiliency by executing the SCOM managed gateway onboard and offboard commands exclusively on the present RMS.

- Bug fix in scale management server script to handle right reallocation of agents.

## Version 1.0.91

- **Implemented pre-patching validations**: Conducted essential checks before initiating the patching operation, ensuring optimal conditions for existing management servers, verifying SQL connectivity, confirming active directory accessibility, and validating the accuracy of domain account credentials.

- Bug fix to handle the concurrency in extension installation.

## Version 1.0.89

- The Log Analytics workspace feature is available for existing and new SCOM Managed Instances.

## Version 1.0.88

- Bug fixes for onboarding validation.

- Fixed issue where Static IP and LB association check fails with error **The property `IP4Address` cannot be found on this object**.

## Version 1.0.87

- Bug fixes for onboarding validation.

- Fixed issue where Domain Connectivity check fails with error **The property `TcpTestSucceeded` cannot be found on this object**.

## Version 1.0.86

- Introduced [Resource Health feature](/azure/service-health/resource-health-overview?WT.mc_id=Portal-Microsoft_Azure_Health) for SCOM Managed Instance.

- Introduced Log Analytics Integration feature for SCOM Managed Instance.

## Version 1.0.85

- Improved performance of extension for onboarding, scaling, and patching operations.

## Next steps

[Migrate from Operations Manager on-premises to Azure Monitor SCOM Managed Instance](migrate-to-operations-manager-managed-instance.md)