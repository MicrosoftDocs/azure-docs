---
title: Azure Policy definitions for Azure NetApp Files  | Microsoft Docs
description: Describes the Azure Policy custom definitions and built-in definitions that you can use with Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/02/2022
ms.author: anfdocs
---
# Azure Policy definitions for Azure NetApp Files  

[Azure Policy](../governance/policy/overview.md) helps to enforce organizational standards and to assess compliance at-scale. Through its compliance dashboard, it provides an aggregated view to evaluate the overall state of the environment, with the ability to drill down to the per-resource, per-policy granularity. It also helps to bring your resources to compliance through bulk remediation for existing resources and automatic remediation for new resources. 

Common use cases for Azure Policy include implementing governance for resource consistency, regulatory compliance, security, cost, and management. Policy definitions for these common use cases are already available in your Azure environment as built-ins to help you get started.

The process of [creating and implementing a policy in Azure Policy](../governance/policy/tutorials/create-and-manage.md) begins with creating a (built-in or custom) [policy definition](../governance/policy/overview.md#policy-definition). Every policy definition has conditions under which it's enforced. It also has a defined [***effect***](../governance/policy/concepts/effects.md) that takes place if the conditions are met. Azure NetApp Files is supported with both Azure Policy custom and built-in policy definitions.

## Custom policy definitions

Azure NetApp Files supports Azure Policy. You can integrate Azure NetApp Files with Azure Policy through [creating custom policy definitions](../governance/policy/tutorials/create-custom-policy-definition.md). You can find examples in [Enforce Snapshot Policies with Azure Policy](https://anfcommunity.com/2021/08/30/enforce-snapshot-policies-with-azure-policy/) and [Azure Policy now available for Azure NetApp Files](https://anfcommunity.com/2021/04/19/azure-policy-now-available-for-azure-netapp-files/).

## Built-in policy definitions

The Azure Policy built-in definitions for Azure NetApp Files enable organization admins to restrict creation of unsecure volumes or audit existing volumes. Each policy definition in Azure Policy has a single *effect*. That effect determines what happens when the policy rule is evaluated to match.  

The following effects of Azure Policy can be used with Azure NetApp Files:

* *Deny* creation of non-compliant volumes
* *Audit* existing volumes for compliance
* *Disable* a policy definition

The following Azure Policy built-in definitions are available for use with Azure NetApp Files:

* *Azure NetApp Files volumes should not use NFSv3 protocol type.*   
    This policy definition disallows the use of the NFSv3 protocol type to prevent unsecure access to volumes. NFSv4.1 or NFSv4.1 with Kerberos protocol should be used to access NFS volumes to ensure data integrity and encryption.
 
* *Azure NetApp Files volumes of type NFSv4.1 should use Kerberos data encryption.*   
    This policy definition allows only the use of Kerberos privacy (`krb5p`) security mode to ensure that data is encrypted.
 
* *Azure NetApp Files volumes of type NFSv4.1 should use Kerberos data integrity or data privacy.*   
    This policy definition ensures that either Kerberos integrity (`krb5i`) or Kerberos privacy (`krb5p`) is selected to ensure data integrity and data privacy.

* *Azure NetApp Files SMB volumes should use SMB3 encryption.*   
    This policy definition disallows the creation of SMB volumes without SMB3 encryption to ensure data integrity and data privacy.

To learn how to assign a policy to resources and view compliance report, see [Assign the Policy](../storage/common/transport-layer-security-configure-minimum-version.md#assign-the-policy).

## Next steps

* [Azure Policy documentation](../governance/policy/index.yml)