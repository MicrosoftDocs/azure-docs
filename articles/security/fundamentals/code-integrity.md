---
title: Platform code integrity - Azure Security
description: Learn how Microsoft ensures that only authorized software is running.
author: yosharm
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: terrylan
manager: rkarlin
ms.date: 11/10/2022
---

# Platform code integrity

A significant challenge in operating a complex system like Microsoft Azure is ensuring that only authorized software is running in the system. Unauthorized software presents several risks to any business:

- Security risks such as dedicated attack tools, custom malware, and third-party software with known vulnerabilities
- Compliance risks when the approved change management process isn't used to bring in new software
- Quality risk from externally developed software, which may not meet the operational requirements of the business

In Azure, we face the same challenge and at significant complexity. We have thousands of servers running software developed and maintained by thousands of engineers. This presents a large attack surface that cannot be managed through business processes alone.

## Adding an authorization gate

Azure uses a rich engineering process that implements gates on the security, compliance, and quality of the software we deploy. This process includes access control to source code, conducting peer code reviews, doing static analysis for security vulnerabilities, following Microsoft’s [Security Development Lifecycle](https://www.microsoft.com/securityengineering/sdl/) (SDL), and conducting functional and quality testing. We need to guarantee that the software we deploy has flowed through this process. Code integrity helps us achieve that guarantee.

## Code integrity as an authorization gate

Code integrity is a kernel level service that became available starting in Windows Server 2016. Code integrity can apply a strict execution control policy whenever a driver or a dynamically linked library (DLL) is loaded, an executable binary is executed, or a script is run. Similar systems, such as [DM-Verity](https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html), exist for Linux. A code integrity policy consists of a set of authorization indicators, either code signing certificates or [SHA256](https://en.wikipedia.org/wiki/Secure_Hash_Algorithms) file hashes, which the kernel matches before loading or executing a binary or script.

Code Integrity allows a system administrator to define a policy that authorizes only binaries and scripts that have been signed by particular certificates or match specified SHA256 hashes. The kernel enforces this policy by blocking execution of everything that doesn't meet the set policy.

A concern with a code integrity policy is that unless the policy is perfectly correct, it can block critical software in production and cause an outage. Given this concern, one may ask why it isn’t sufficient to use security monitoring to detect when unauthorized software has executed. Code integrity has an audit mode that, instead of preventing execution, can alert when unauthorized software is run. Alerting certainly can add much value in addressing compliance risks, but for security risks such as ransomware or custom malware, delaying the response by even a few seconds can be the difference between protection and an adversary gaining a persistent foothold in your fleet. In Azure, we've invested significantly to manage any risk of code integrity contributing to a customer impacting outage.

## Build process

As discussed above, the Azure build system has a rich set of tests to ensure software changes are secure and compliant. Once a build has progressed through validation, the build system signs it using an Azure build certificate. The certificate indicates the build has passed through the entire change management process. The final test that the build goes through is called Code Signature Validation (CSV). CSV confirms the newly built binaries meet the code integrity policy before we deploy to production. This gives us high confidence that we won't cause a customer impacting outage because of incorrectly signed binaries. If CSV finds a problem, the build breaks and the relevant engineers are paged to investigate and fix the issue.

## Safety during deployment

Even though we perform CSV for every build, there's still a chance that some change or inconsistency in production may cause a code integrity related outage. For example, a machine may be running an old version of the code integrity policy or it may be in an unhealthy state that produces false positives in code integrity. (At Azure scale, we’ve seen it all.) As such, we need to continue to protect against the risk of an outage during deployment.

All changes in Azure are required to deploy through a series of stages. The first of these are internal Azure testing instances. The next stage is used only to serve other Microsoft product teams. The final stage serves third-party customers. When a change is deployed, it moves to each of these stages in turn, and pauses to measure the health of the stage. If the change is found to have no negative impact, then it moves to the next stage. If we make a bad change to a code integrity policy, the change is detected during this staged deployment and rolled back.

## Incident response

Even with this layered protection, it's still possible that some server in the fleet may block properly authorized software and cause a customer facing issue, one of our worst-case scenarios. Our final layer of defense is human investigation. Each time code integrity blocks a file, it raises an alert for the on-call engineers to investigate. The alert allows us to start security investigations and intervene, whether the issue is an indicator of a real attack, a false positive, or other customer-impacting situation. This minimizes the time it takes to mitigate any code integrity related issues.  

## Next steps

Learn how [Windows 10](/windows/security/threat-protection/device-guard/introduction-to-device-guard-virtualization-based-security-and-windows-defender-application-control) uses configurable code integrity.

To learn more about what we do to drive platform integrity and security, see:

- [Firmware security](firmware.md)
- [Secure boot](secure-boot.md)
- [Measured boot and host attestation](measured-boot-host-attestation.md)
- [Project Cerberus](project-cerberus.md)
- [Encryption at rest](encryption-atrest.md)
- [Hypervisor security](hypervisor.md)