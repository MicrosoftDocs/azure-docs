---
title: Ransomware protection in Azure
description: Ransomware protection in Azure
author: TerryLanfear
manager: rkarlin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: terrylan
ms.date: 8/31/2023

---

# Ransomware protection in Azure

Ransomware and extortion are a high profit, low-cost business, which has a debilitating impact on targeted organizations, national/regional security, economic security, and public health and safety. What started as simple, single-PC ransomware has grown to include a variety of extortion techniques directed at all types of corporate networks and cloud platforms.

To ensure customers running on Azure are protected against ransomware attacks, Microsoft has invested heavily on the security of our cloud platforms, and provides security controls you need to protect your Azure cloud workloads

By leveraging Azure native ransomware protections and implementing the best practices recommended in this article, you're taking measures that ensure your organization is optimally positioned to prevent, protect, and detect potential ransomware attacks on your Azure assets.

This article lays out key Azure native capabilities and defenses for ransomware attacks and guidance on how to proactively leverage these to protect your assets on Azure cloud.

## A growing threat

Ransomware attacks have become one of the biggest security challenges facing businesses today. When successful, ransomware attacks can disable a business core IT infrastructure, and cause destruction that could have a debilitating impact on the physical, economic security or safety of a business. Ransomware attacks are targeted to businesses of all types. This requires that all businesses take preventive measures to ensure protection.

Recent trends on the number of attacks are quite alarming. While 2020 wasn't a good year for ransomware attacks on businesses, 2021 started on a bad trajectory.  On May 7, the Colonial pipeline (Colonial) attack shut down services such as pipeline transportation of diesel, gasoline, and jet fuel were temporary halted. Colonial shut the critical fuel network supplying the populous eastern states.

Historically, cyberattacks were seen as a sophisticated set of actions targeting particular industries, which left the remaining industries believing they were outside the scope of cybercrime, and without context about which cybersecurity threats they should prepare for. Ransomware represents a major shift in this threat landscape, and it's made cyberattacks a very real and omnipresent danger for everyone. Encrypted and lost files and threatening ransom notes have now become the top-of-mind fear for most executive teams.

Ransomware's economic model capitalizes on the misperception that a ransomware attack is solely a malware incident. Whereas in reality ransomware is a breach involving human adversaries attacking a network. 

For many organizations, the cost to rebuild from scratch after a ransomware incident far outweighs the original ransom demanded. With a limited understanding of the threat landscape and how ransomware operates, paying the ransom seems like the better business decision to return to operations. However, the real damage is often done when the cybercriminal exfiltrates files for release or sale, while leaving backdoors in the network for future criminal activity—and these risks persist whether or not the ransom is paid. 

## What is ransomware

Ransomware is a type of malware that infects a computer and restricts a user's access to the infected system or specific files in order to extort them for money. After the target system has been compromised, it typically locks out most interaction and displays an on-screen alert, typically stating that the system has been locked or that all of their files have been encrypted.  It then demands a substantial ransom be paid before the system is released or files decrypted.  

Ransomware will typically exploit the weaknesses or vulnerabilities in your organization's IT systems or infrastructures to succeed. The attacks are so obvious that it does not take much investigation to confirm that your business has been attacked or that an incident should be declared.  The exception would be a spam email that demands ransom in exchange for supposedly compromising materials.  In this case, these types of incidents should be dealt with as spam unless the email contains highly specific information.

Any business or organization that operates an IT system with data in it can be attacked.   Although individuals can be targeted in a ransomware attack,  most attacks are targeted at businesses. While the Colonial ransomware attack of May 2021 drew considerable public attention, our Detection and Response team (DART)'s ransomware engagement data shows that the energy sector represents one of the most targeted sectors, along with the financial, healthcare, and entertainment sectors.  And despite continued promises not to attack hospitals or healthcare companies during a pandemic, healthcare remains the number one target of human operated ransomware.

:::image type="content" source="./media/ransomware/ransomware-1.png" alt-text="Pie chart illustrating industries that are targeted by ransomware":::

## How your assets are targeted

When attacking cloud infrastructure, adversaries often attack multiple resources to try to obtain access to customer data or company secrets. The cloud "kill chain" model explains how attackers attempt to gain access to any of your resources running in the public cloud through a four-step process: exposure, access, lateral movement, and actions.

1. Exposure is where attackers look for opportunities to gain access to your infrastructure. For example, attackers know customer-facing applications must be open for legitimate users to access them. Those applications are exposed to the Internet and therefore susceptible to attacks. 
1. Attackers will try to exploit an exposure to gain access to your public cloud infrastructure. This can be done through compromised user credentials, compromised instances, or misconfigured resources. 
1. During the lateral movement stage, attackers discover what resources they have access to and what the scope of that access is. Successful attacks on instances give attackers access to databases and other sensitive information. The attacker then searches for additional credentials. Our Microsoft Defender for Cloud data shows that without a security tool to quickly notify you of the attack, it takes organizations on average 101 days to discover a breach. Meanwhile, in just 24-48 hours after a breach, the attacker will usually have complete control of the network. 
1. The actions an attacker takes after lateral movement are largely dependent on the resources they were able to gain access to during the lateral movement phase. Attackers can take actions that cause data exfiltration, data loss or launch other attacks. For enterprises, the average financial impact of data loss is now reaching $1.23 million.

:::image type="content" source="./media/ransomware/ransomware-2.png" alt-text="Flowcharting showing how cloud infrastructure is attacked: Exposure, Access, Lateral movement, and Actions":::

## Why attacks succeed

There are several reasons why ransomware attacks succeed. Businesses that are vulnerable often fall victim to ransomware attacks. The following are some of the attack's critical success factors:

- The attack surface has increased as more and more businesses offer more services through digital outlets
- There's a considerable ease of obtaining off-the-shelf malware, Ransomware-as-a-Service (RaaS)
- The option to use cryptocurrency for blackmail payments has opened new avenues for exploit 
- Expansion of computers and their usage in different workplaces (local school districts, police departments, police squad cars, etc.) each of which is a potential access point for malware, resulting in potential attack surface
- Prevalence of old, outdated, and antiquated infrastructure systems and software 
- Poor patch-management regimens
- Outdated or very old operating systems that are close to or have gone beyond end-of-support dates
- Lack of resources to modernize the IT footprint
- Knowledge gap 
- Lack of skilled staff and key personnel overdependency
- Poor security architecture

Attackers use different techniques, such as Remote Desktop Protocol (RDP) brute force attack to exploit vulnerabilities.

:::image type="content" source="./media/ransomware/ransomware-3.png" alt-text="Swimlane diagram illustrating the different techniques used by attackers":::

## Should you pay?

There are varying opinions on what the best option is when confronted with this vexing demand.  The Federal Bureau of Investigation (FBI) advises victims not to pay ransom but to instead be vigilant and take proactive measures to secure their data before an attack.  They contend that paying doesn't guarantee that locked systems and encrypted data will be released again. The FBI says another reason not to pay is that payments to cyber criminals incentivizes them to continue to attack organizations. 

Nevertheless, some victims elect to pay the ransom demand even though system and data access isn't guaranteed after paying the ransom. By paying, such organizations take the calculated risk to pay in hopes of getting back their system and data and quickly resuming normal operations.  Part of the calculation is reduction in collateral costs such as lost productivity, decreased revenue over time, exposure of sensitive data, and potential reputational damage.

The best way to prevent paying ransom is not to fall victim by implementing preventive measures and having tool saturation to protect your organization from every step that attacker takes wholly or incrementally to hack into your system. In addition, having the ability to recover impacted assets will ensure restoration of business operations in a timely fashion. Azure Cloud has a robust set of tools to guide you all the way.

### What is the typical cost to a business?

The impact of a ransomware attack on any organization is difficult to quantify accurately. However, depending on the scope and type, the impact is multi-dimensional and is broadly expressed in:
- Loss of data access
- Business operation disruption
- Financial loss
- Intellectual property theft 
- Compromised customer trust and a tarnished reputation

Colonial Pipeline paid about $4.4 Million in ransom to have their data released.  This doesn't include the cost of downtime, lost productive, lost sales and the cost of restoring services. More broadly, a significant impact is the "knock-on effect" of impacting high numbers of businesses and organizations of all kinds including towns and cities in their local areas. The financial impact is also staggering. According to Microsoft, the global cost associated with ransomware recovery is projected to exceed $20 billion in 2021. 

:::image type="content" source="./media/ransomware/ransomware-4.png" alt-text="Bar chart showing impact to business":::

## Next steps

See the white paper: [Azure defenses for ransomware attack whitepaper](https://azure.microsoft.com/resources/azure-defenses-for-ransomware-attack).

Other articles in this series:
- [Prepare for a ransomware attack](ransomware-prepare.md)
- [Detect and respond to ransomware attack](ransomware-detect-respond.md)
- [Azure features and resources that help you protect, detect, and respond](ransomware-features-resources.md)


