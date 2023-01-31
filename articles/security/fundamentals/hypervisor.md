---
title: Hypervisor security on the Azure fleet - Azure Security
description: Technical overview of hypervisor security on the Azure fleet.
author: yosharm
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: terrylan
manager: rkarlin
ms.date: 11/10/2022
---

# Hypervisor security on the Azure fleet

The Azure hypervisor system is based on Windows Hyper-V. The hypervisor system enables the computer administrator to specify guest partitions that have separate address spaces. The separate address spaces allow you to load an operating system and applications operating in parallel of the (host) operating system that executes in the root partition of the computer. The host OS (also known as privileged root partition) has direct access to all the physical devices and peripherals on the system (storage controllers, networking adaptions). The host OS allows guest partitions to share the use of these physical devices by exposing “virtual devices” to each guest partition. Thus, an operating system executing in a guest partition has access to virtualized peripheral devices that are provided by virtualization services executing in the root partition.

The Azure hypervisor is built keeping the following security objectives in mind:

| Objective | Source |
|--|--|
| Isolation | A security policy mandates no information transfer between VMs. This constraint requires capabilities in the Virtual Machine Manager (VMM) and hardware for isolation of memory, devices, the network, and managed resources such as persisted data. |
| VMM integrity | To achieve overall system integrity, the integrity of individual hypervisor components is established and maintained. |
| Platform integrity | The integrity of the hypervisor depends on the integrity of the hardware and software on which it relies. Although the hypervisor doesn't have direct control over the integrity of the platform, Azure relies on hardware and firmware mechanisms such as the [Cerberus](project-cerberus.md) chip to protect and detect the underlying platform integrity. The VMM and guests are prevented from running if platform integrity is compromised. |
| Restricted access | Management functions are exercised only by authorized administrators connected over secure connections. A principle of least privilege is enforced by Azure role-based access control (Azure RBAC) mechanisms. |
| Audit | Azure enables audit capability to capture and protect data about what happens on a system so that it can later be inspected. |

Microsoft’s approach to hardening the Azure hypervisor and the virtualization subsystem can be broken down into the following three categories.

## Strongly defined security boundaries enforced by the hypervisor

The Azure hypervisor enforces multiple security boundaries between:

- Virtualized “guest” partitions and privileged partition (“host”)
- Multiple guests
- Itself and the host
- Itself and all guests

Confidentiality, integrity, and availability are assured for the hypervisor security boundaries. The boundaries defend against a range of attacks including side-channel information leaks, denial-of-service, and elevation of privilege.

The hypervisor security boundary also provides segmentation between tenants for network traffic, virtual devices, storage, compute resources, and all other VM resources.

## Defense-in-depth exploit mitigations

In the unlikely event a security boundary has a vulnerability, the Azure hypervisor includes multiple layers of mitigations including:

- Isolation of host-based process hosting cross-VM components
- Virtualization-based security (VBS) for ensuring the integrity of user and kernel mode components from a secure world
- Multiple levels of exploit mitigations. Mitigations include address space layout randomization (ASLR), data execution prevention (DEP), arbitrary code guard, control flow integrity, and data corruption prevention
- Automatic initialization of stack variables at the compiler level
- Kernel APIs that automatically zero-initialize kernel heap allocations made by Hyper-V

These mitigations are designed to make the development of an exploit for a cross-VM vulnerability infeasible.

## Strong security assurance processes

The attack surface related to the hypervisor includes software networking, virtual devices, and all cross-VM surfaces. The attack surface is tracked through automated build integration, which triggers periodic security reviews.

All VM attack surfaces are threat modeled, code reviewed, fuzzed, and tested by our RED team for security boundary violations. Microsoft has a [bug bounty program](https://www.microsoft.com/msrc/bounty-hyper-v) that pays an award for relevant vulnerabilities in eligible product versions for Microsoft Hyper-V.

> [!NOTE]
> Learn more about [strong security assurance processes](../../azure-government/azure-secure-isolation-guidance.md#strong-security-assurance-processes) in Hyper-V.

## Next steps
To learn more about what we do to drive platform integrity and security, see:

- [Firmware security](firmware.md)
- [Platform code integrity](code-integrity.md)
- [Secure boot](secure-boot.md)
- [Measured boot and host attestation](measured-boot-host-attestation.md)
- [Project Cerberus](project-cerberus.md)
- [Encryption at rest](encryption-atrest.md)