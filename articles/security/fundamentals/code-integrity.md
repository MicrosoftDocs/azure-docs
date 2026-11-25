---
title: Platform code integrity - Azure Security
description: Learn how Microsoft Azure uses code integrity as an authorization gate to help ensure that only authorized software runs in production.
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: mbaldwin
ms.date: 12/03/2025
ai-usage: ai-assisted
---

# Platform code integrity

A significant challenge in operating a complex system like Microsoft Azure is ensuring that only authorized software is running in the system. Unauthorized software presents several risks to any business:

- Security risks such as dedicated attack tools, custom malware, and third-party software with known vulnerabilities
- Compliance risks when the approved change management process isn't used to bring in new software
- Quality risk from externally developed software, which might not meet the operational requirements of the business

Azure faces the same challenge at significant complexity. Thousands of servers run software that thousands of engineers develop and maintain. This scale presents a large attack surface that business processes alone can't manage.

## Adding an authorization gate

Azure uses a rich engineering process that implements gates on the security, compliance, and quality of deployed software. This process includes access control to source code, peer code reviews, static analysis for security vulnerabilities, Microsoft’s [Security Development Lifecycle](https://www.microsoft.com/securityengineering/sdl/) (SDL), and functional and quality testing. Microsoft needs to guarantee that deployed software flows through this process. Code integrity helps achieve that guarantee.

## Code integrity as an authorization gate

Code integrity is a kernel-level service that became available starting in Windows Server 2016. Code integrity can apply a strict execution control policy whenever a driver or a dynamically linked library (DLL) is loaded, an executable binary is executed, or a script is run. Similar systems, such as [DM-Verity](https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html), exist for Linux. A code integrity policy consists of a set of authorization indicators, either code signing certificates or [SHA-256](https://en.wikipedia.org/wiki/Secure_Hash_Algorithms) file hashes, which the kernel matches before loading or executing a binary or script.

Code integrity allows system administrators to define a policy that authorizes only binaries and scripts that particular certificates sign or that match specified SHA-256 hashes. The kernel enforces this policy by blocking execution of everything that doesn't meet the set policy.

A code integrity policy can block critical software in production and cause an outage unless the policy is perfectly correct. Given this concern, you might ask why security monitoring isn’t sufficient to detect unauthorized software execution. Code integrity has an audit mode that, instead of preventing execution, can alert when unauthorized software runs. Alerting can add much value in addressing compliance risks. However, for security risks such as ransomware or custom malware, delaying the response by even a few seconds can be the difference between protection and an adversary gaining a persistent foothold in your fleet. In Azure, Microsoft invests significantly to manage any risk of code integrity contributing to a customer-impacting outage.

## Build process

As previously described, the Azure build system has a rich set of tests to ensure software changes are secure and compliant. After a build progresses through validation, the build system signs it by using an Azure build certificate. The certificate indicates that the build passed through the entire change management process. The final test that the build goes through is Code Signature Validation (CSV). CSV confirms that the newly built binaries meet the code integrity policy before Microsoft deploys them to production. This validation gives Microsoft high confidence that incorrectly signed binaries won't cause a customer-impacting outage. If CSV finds a problem, the build breaks and the relevant engineers are paged to investigate and fix the problem.

## Safety during deployment

Even though Azure performs CSV for every build, some change or inconsistency in production might still cause a code integrity-related outage. For example, a machine might run an old version of the code integrity policy, or it might be in an unhealthy state that produces false positives in code integrity. At Azure scale, Microsoft has seen it all. Azure continues to protect against the risk of an outage during deployment.

All changes in Azure must deploy through a series of stages. The first stages are internal Azure testing instances. The next stage serves only other Microsoft product teams. The final stage serves third-party customers. When Azure deploys a change, the change moves to each stage in turn and pauses to measure the health of the stage. If the change has no negative impact, it moves to the next stage. If Microsoft makes a bad change to a code integrity policy, the staged deployment detects the change and rolls it back.

## Incident response

Even with this layered protection, a server in the fleet might block properly authorized software and cause a customer-facing problem, one of Microsoft’s worst-case scenarios. The final layer of defense is human investigation. Each time code integrity blocks a file, it raises an alert for the on-call engineers to investigate. The alert allows engineers to start security investigations and intervene, whether the problem is an indicator of a real attack, a false positive, or another customer-impacting situation. This alerting minimizes the time it takes to mitigate any code integrity-related problems.

## Next steps

To learn more about how Microsoft drives platform integrity and security, see:

- [Firmware security](firmware.md)
- [Secure boot](secure-boot.md)
- [Measured boot and host attestation](measured-boot-host-attestation.md)
- [Project Cerberus](project-cerberus.md)
- [Encryption at rest](encryption-atrest.md)
- [Hypervisor security](hypervisor.md)