---
title: Requirements and Considerations for Azure NetApp Files advanced ransomware protection 
description: Understand the considerations and requirements for Azure NetApp Files advanced ransomware protection. 
services: azure-netapp-files
author: netapp-manishc
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 03/09/2026
ms.author: anfdocs
ms.custom: references_regions
---
# Requirements and considerations for Azure NetApp Files advanced ransomware protection 

Before you configure [Azure NetApp Files advanced ransomware protection](ransomware-configure.md), make sure that you understand the requirements.

## Considerations 

* Attack reports are retained for 30 days.  
* Ransomware threat notifications are sent in the Azure Activity log.  
* It’s recommended that you enable no more than five volumes per Azure region with advanced ransomware protection to mitigate performance issues. 
* It's recommended you increase QoS capacity by 5 to 10 percent due to potential performance impacts of advanced ransomware protection. The scale of the impact can vary based on the configurations across your Azure NetApp Files deployment.  

## Usage guidelines

Before using advanced ransomware protection, there are a few important points and limitations to understand:

* **Enrollment per volume**: You must explicitly enable advanced ransomware protection on each volume that you want protected – it is not "on" by default. This can be done easily using the Azure portal (a toggle option in the volume settings) or through the Azure API/CLI by setting the ransomware protection property on the volume. Only volumes with advanced ransomware protection enabled will be monitored and automatically snapshotted on threats.

* **Storage capacity planning**: Advanced ransomware protection’s automatic snapshots use your existing Azure NetApp Files volume capacity ensuring sufficient space for at least one extra snapshot per protected volume. Actual storage used depends on data changes before a snapshot. Advanced ransomware protection itself has no extra cost or separate SKU, but may increase storage usage as protection snapshots are created. Monitor your volumes and capacity pools to manage capacity during ransomware events.

* **Operational visibility**: When advanced ransomware protection triggers, it logs alerts in Azure NetApp Files events and Azure Monitor. Make sure your operations team is monitoring these channels or has set up automated alert rules, so that a ransomware alert isn't missed. Treat an advanced ransomware protection alert as urgent, investigate the possibly compromised client or user account immediately, since the snapshot indicates suspicious activity was indeed happening. Early investigation can help you contain the threat (for example, by isolating a VM or revoking credentials) while the snapshot protects your data.

* **Data restoration process**: In the event of a real ransomware attack, the recommended recovery method is to revert the entire volume to the protected snapshot using Azure NetApp Files’ restore capability. This essentially turns back the clock on that volume to the preattack state captured by the snapshot. Volume revert is fast (usually seconds) regardless of volume size. If a full revert isn't desirable (say other parts of the volume had important recent changes you want to keep), you can also mount the snapshot as a new volume or use the single-file restore from snapshot capability to copy back only selected files that were encrypted. Azure NetApp Files gives flexibility in recovery, but in all cases the snapshot ensures you do not have to rebuild data from scratch.

* **Coexistence with other protection features**: Advanced ransomware protection is designed to complement, not replace, existing data protection features like scheduled snapshots, backups, and cross-region replication. We recommend using advanced ransomware protection alongside a robust backup strategy. For example, you might keep daily snapshots and weekly backups for general data recovery and compliance, while advanced ransomware protection watches for the exceptional case of ransomware in between those scheduled snapshots and backups. Advanced ransomware protection also works in tandem with Azure’s security services, for instance, you might get an alert from Microsoft Defender for Storage or an antivirus at around the same time. Using multiple layers of defense is the best practice for comprehensive protection.

* **User access and permissions**: Only subscription owners or contributors with the right Azure role can enable or disable advanced ransomware protection on a volume. 

* **Immutable protection snapshots**: When an advanced ransomware protection snapshot is created, remember that its immutability is a crucial safeguard as the protection snapshots are designed to be read-only, ensuring they cannot be altered or deleted even by privileged accounts. While this locked-down design keeps your backup safe from tampering or further ransomware attempts, it’s still essential to strictly control who can access and restore from these snapshots. Use Azure NetApp Files’ integration with Azure RBAC to restrict snapshot recovery permissions to only a trusted group of administrators.

* **Testing the feature**: It’s a good idea to become familiar with how advanced ransomware protection works by testing it in a nonproduction environment. You might simulate a ransomware-like workload (for example, encrypt a set of test files on a volume) to see how and when an alert is generated and how the snapshot and restore process works. Testing helps validate your operational runbooks for responding to advanced ransomware protection alerts, so in a real incident everyone knows what to do. Keep in mind that the detection algorithms might not trigger on every possible change – they're tuned to catch common ransomware patterns – so avoid trying this in a way that could create false confidence. Microsoft’s internal testing has covered many scenarios, but real-world validation in your environment is valuable too.

By considering these aspects, you can deploy advanced ransomware protection effectively and be prepared to use it when needed. The capability significantly strengthens the resiliency of your Azure NetApp Files volumes against one of the most damaging types of cyberattacks today. With it enabled, you gain a dependable recovery fallback that operates automatically, letting you focus on preventing attacks and running your business – and knowing that if ransomware strikes, Azure NetApp Files advanced ransomware protection has you covered with a rapid, storage-integrated response.
