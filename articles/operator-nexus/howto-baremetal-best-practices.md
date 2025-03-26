---
title: Best Practices for NC/NF Device Recovery, Reimage, and Replacement
description: Steps that should be taken before executing any BMM replace, retry, or reimage actions and highlights common pitfalls to avoid and essential prerequisites to ensure a smooth process.
ms.date: 03/25/2025
ms.topic: how-to
ms.service: azure-operator-nexus
ms.custom: template-how-to, best-practices
author: omarrivera
ms.author: omarrivera
ms.reviewer: bartpinto
---

# Best Practices for NC/NF Device Recovery, Reimage, and Replacement

## Introduction

This article provides best practices for [Operator Nexus] Bare Metal Machine device recovery, reimage, and replacement.
Covered in this document are steps customers should take before executing any BMM replace, retry, or reimage and highlight common pitfalls and essential prerequisites to ensure a smooth process.
In addition, always refer to the latest documentation and stay informed about updates to maintain optimal performance.

## Prerequisites

Before initiating any recovery or replacement process, ensure the following prerequisites are met:

1. **Ensure Latest Az CLI Extension**: Install the latest version of the [appropriate CLI extensions](./howto-install-cli-extensions.md).
1. **Backup Data**: Always back up critical data to prevent data loss during the recovery or replacement process.
2. **Verify Network Connectivity**: Ensure stable network connectivity to avoid interruptions during the process.
3. **Check Firmware and Software Versions**: Verify that the firmware and software versions are up-to-date to prevent compatibility issues.
4. **Review Documentation**: Familiarize yourself with the relevant documentation, including troubleshooting guides and how-to articles.

## Common Pitfalls to Avoid

1. **Skipping Backups**: Never skip the backup step, as it is crucial for data recovery in case of failures.
2. **Ignoring Network Stability**: Ensure network stability to avoid disruptions during the process.
3. **Overlooking Compatibility**: Check for compatibility issues between hardware and software versions.
4. **Neglecting Documentation**: Always refer to the latest documentation to stay informed about best practices and updates.

## Best Practices

1. **Disruptive Commands**:
   - All commands (power off, restart, reimage, replace) are disruptive.
   - Execute these commands with caution and in consultation with Microsoft support personnel to avoid affecting the integrity of the Operator Nexus Cluster.
   - Running multiple disruptive commands simultaneously can leave servers in a nonworking state.

2. **BMM Reimage Best Practices**:
   - Pre-condition for BMMs: They should be in powerState On and readyState True.
   - Ensure the BMM is cordon with evacuate "True" before executing the reimage command.
   - Do not run multiple reimage and/or replace commands on the same server/BMM.

3. **BMM Replace**:
   - Similar to Reimage.
   - Should be executed after any hardware maintenance event.
   - Multiple maintenance events should be done as multiple replaces.

4. **Caution**:
   - Do not perform any action against management servers without first consulting with Microsoft support personnel. Doing so could affect the integrity of the Operator Nexus Cluster.

5. **Kubernetes Control Plane (KCP) Node**:
   - Powering off a KCP node is the only nexusctl action considered disruptive in the context of this check.
   - If multiple nodes become non-operational, it will break the healthy quorum threshold of the Kubernetes Control Plane.

6. **Usage of `nexusctl` vs `az cli`**:
   - It is not clear when `nexusctl` should be used instead of the `az cli` to power off or start a BMM.
   - The two articles expose these capabilities without signaling which one should be used and when.

7. **General Description of Steps**:
   - The article [Troubleshoot Azure Operator Nexus server problems](https://learn.microsoft.com/en-us/azure/operator-nexus/troubleshoot-reboot-reimage-replace) already has a general description of the steps that should be done prior to working with BMM[1](https://learn.microsoft.com/en-us/azure/operator-nexus/troubleshoot-reboot-reimage-replace).
   - Similarly, the article section [Troubleshoot with a replace action](https://learn.microsoft.com/en-us/azure/operator-nexus/troubleshoot-reboot-reimage-replace) has steps that should be followed for the BMM replace action that act as prerequisites or best practices to follow[1](https://learn.microsoft.com/en-us/azure/operator-nexus/troubleshoot-reboot-reimage-replace).

### Attempting Retry on Any Actions

- **Identify the Issue**: Before retrying, identify the root cause of the failure to avoid repeating the same mistake.
- **Monitor Logs**: Keep an eye on system logs to detect any anomalies during the retry process.
- **Incremental Steps**: Perform the retry in incremental steps to isolate and address specific issues.

### Delete/Recreate

- **Plan the Process**: Plan the delete/recreate process carefully to minimize downtime and data loss.
- **Clear Instructions**: Follow clear and detailed instructions to avoid errors during the process.
- **Validation**: Validate the recreated environment to ensure it meets the required specifications.

### Deprovision, Update, Provision

- **Deprovision Safely**: Ensure safe deprovisioning of devices to prevent data corruption.
- **Update Regularly**: Keep devices updated with the latest firmware and software versions.
- **Provision Correctly**: Follow best practices for provisioning to ensure devices are configured correctly.

### Cordoning/Maintenance

- **Schedule Maintenance**: Schedule maintenance during off-peak hours to minimize impact on operations.
- **Notify Stakeholders**: Inform stakeholders about the maintenance schedule to avoid disruptions.
- **Monitor Progress**: Monitor the progress of maintenance activities to address any issues promptly.

### Success/Validation

- **Test Thoroughly**: Conduct thorough testing to validate the success of the recovery or replacement process.
- **Document Results**: Document the results of the validation process for future reference.
- **Continuous Improvement**: Use the insights gained from the process to improve future recovery and replacement activities.

## References

- [Manage the lifecycle of bare metal machines][howto baremetal functions]
- [Restart Azure Operator Nexus Kubernetes cluster node][howto kubernetes cluster action restart]
- [Run emergency bare metal actions outside of Azure using nexusctl][howto baremetal nexusctl]
- [Troubleshoot Azure Operator Nexus Server Problems][troubleshoot reboot, reimage, replace]
- [Troubleshoot Bare Metal Machine Provisioning][troubleshoot bare metal machine provisioning]
- [Troubleshoot Bare Metal Machine Warning Status][troubleshoot bare metal machine warning status]
- [Troubleshoot Degraded Status Errors on Bare Metal Machines][troubleshoot bare metal machine degraded]
- [Troubleshoot Hardware Validation Failure][troubleshoot hardware validation failure]

[howto baremetal functions]: https://learn.microsoft.com/en-us/azure/operator-nexus/howto-baremetal-functions
[howto baremetal nexusctl]: https://learn.microsoft.com/en-us/azure/operator-nexus/howto-baremetal-nexusctl
[howto kubernetes cluster action restart]: https://learn.microsoft.com/en-us/azure/operator-nexus/howto-kubernetes-cluster-action-restart
[troubleshoot bare metal machine degraded]: https://learn.microsoft.com/en-us/azure/operator-nexus/troubleshoot-bare-metal-machine-degraded
[troubleshoot bare metal machine provisioning]: https://learn.microsoft.com/en-us/azure/operator-nexus/troubleshoot-bare-metal-machine-provisioning
[troubleshoot bare metal machine warning status]: https://learn.microsoft.com/en-us/azure/operator-nexus/troubleshoot-bare-metal-machine-warning
[troubleshoot hardware validation failure]: https://learn.microsoft.com/en-us/azure/operator-nexus/troubleshoot-hardware-validation-failure
[troubleshoot reboot, reimage, replace]: https://learn.microsoft.com/en-us/azure/operator-nexus/troubleshoot-reboot-reimage-replace

> [!CAUTION]
> Do not perform any action against management servers without first consulting with Microsoft support personnel. Doing so could affect the integrity of the Operator Nexus Cluster.

> [!IMPORTANT]
> - Disruptive commands (power off, restart, reimage, replace) should be executed with caution and in consultation with Microsoft support personnel to avoid affecting the integrity of the Operator Nexus Cluster.
> - Running multiple disruptive commands simultaneously can leave servers in a nonworking state.