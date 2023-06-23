---
title: Azure HDInsight clusters with disk encryption lose Key Vault access
description: Troubleshooting steps and possible resolutions for Key Vault access issues when interacting with Azure HDInsight clusters.
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 06/08/2023
---

# Scenario: Azure HDInsight clusters with disk encryption lose Key Vault access

This article describes troubleshooting steps and possible resolutions for issues when interacting with Azure HDInsight clusters.

## Issue

The Resource Health Center (RHC) alert, `The HDInsight cluster is unable to access the key for BYOK encryption at rest`, is shown for Bring Your Own Key (BYOK) clusters where the cluster nodes have lost access to customers Key Vault (KV). Similar alerts can also be seen on Apache Ambari UI.

## Cause

The alert ensures that KV is accessible from the cluster nodes, thereby ensuring the network connection, KV health, and access policy for the user assigned Managed Identity. This alert is only a warning of impending broker shutdown on subsequent node reboots, the cluster continues to function until nodes reboot.

Navigate to Apache Ambari UI to find more information about the alert from **Disk Encryption Key Vault Status**. This alert will have details about the reason for verification failure.

## Resolution

### KV/AAD outage

Look at [Azure Key Vault availability and redundancy](../../key-vault/general/disaster-recovery-guidance.md) and Azure status page for more details https://azure.status.microsoft/

### KV accidental deletion

* Restore deleted key on KV to auto recover. For more information, see [Recover Deleted Key](/rest/api/keyvault/keys/recover-deleted-key).
* Reach out to KV team to recover from accidental deletions.

### KV access policy changed

Restore the access policies for the user assigned Managed Identity that is assigned to HDI cluster for accessing the KV.

### Key permitted operations

For each key in KV, you can choose the set of permitted operations. Ensure that you have wrap and unwrap operations enabled for the BYOK key

### Expired key

If the expiry has passed and key isn't rotated, restore key from backup HSM or contact KV team to clear the expiry date.

### KV firewall blocking access

Fix the KV firewall settings to allow BYOK cluster nodes to access the KV.

### NSG rules on virtual network blocking access

Check the NSG rules associated with the virtual network attached to the cluster.

## Mitigation and prevention steps

### KV accidental deletion

* Configure Key Vault with [Resource Lock set](../../azure-resource-manager/management/lock-resources.md).
* Back up keys to their Hardware Security Module.

### Key deletion

Cluster should be deleted before key deletion.

### KV access policy changed

Regularly audit and test access policies.

### Expired key

* Back up keys to your HSM.
* Use a key without any expiry set.
* If expiry needs to be set, rotate the keys before the expiration date.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
