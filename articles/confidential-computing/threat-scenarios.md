---
title: Threat scenarios and protection goals
description: Understanding what you are trying to protect against and where Confidential computing can help.
author: sgallagher
ms.author: sgallagher
ms.service: confidential-computing
ms.topic: conceptual
ms.date: 6/09/2023
ms.custom: template-concept
---
# Threat Scenarios and Protection Goals
> Understanding what you are protecting, and from whom

In all designs, it's important to understand what threats you're protecting against, commonly called threat modeling.
There's a widely used principle of "the five W's" : Who, What, When, Where and Why that is useful in clearly articulating threat models.

For example, if you were modeling the potential threat of someone burgling your home whilst you were on holiday you could define it as follows;

|Element    |Definition    |Scope
|:---       |:---            |:---
|**Who**     |..are you protecting against?|A person who isn't entitled or authorized to enter your property.
|**What**    |..are you protecting against happening to?| Theft or vandalism of personal property.
|**When**    |..are you worried this may happen?| Whilst property is unattended for >24 hrs
|**Where**   |..could this happen?| At my home, one Acacia Avenue, Londontown, UK.
|**Why**     |..are you worried about this, what is the effect?| Financial loss as a result of theft or vandalism of property.

This format helps you to unambiguously define a potential threat. You can use this definition to develop suitable preventative measures to stop it happening. Or, where maybe you can't fully prevent something you can use it to develop a suitable mitigation to reduce the effect if the threat scenario occurs.

From this example you see that it reduces ambiguity, for example clearly calling out the difference between protecting a home whilst it's unattended vs. whilst it's occupied - which could both have different preventative measures and mitigations.

Some of the common threat scenarios you can address using Confidential Compute are as follows (note, this isn't an exhaustive list)..

### Protect data from cloud provider

Azure confidential computing is designed to help customers protect data in use, many customers are seeking a higher level of protection than the standard offering to prevent possible access by the cloud provider, for example to satisfy a legal request.

|Who    |What    |Where    |When    |Why
|:---   |:---    |:---     |:---    |:---
|Cloud Provider |Access to customer data    |Resources in Azure    |24x7x365    |Regulatory, Reputational damage, Customer trust

Azure already encrypts data at rest and in transit, and confidential computing helps protect data in use, including cryptographic keys.  Azure confidential computing helps customers prevent unauthorized access to data in use, including from the cloud operator, by processing data in a hardware-based and attested Trusted Execution Environment (TEE).  When Azure confidential computing is enabled and properly configured, Microsoft is not able to access unencrypted customer data.  

Microsoft will not attempt to defeat customer-controlled data protection of confidential computing with customer-managed keys and verification policies in order to view or extract data in use. If faced with a legal demand to do so, we would challenge such a demand on any lawful basis, consistent with our customer commitments as outlined in this [blog] (https://blogs.microsoft.com/on-the-issues/2020/11/19/defending-your-data-edpb-gdpr/).

Azure is also protected by a comprehensive defense in depth strategy offering customer protections through contractual and privacy transparency through to technical controls operated on-behalf of the customer that are independently audited. A comprehensive set of technical and infrastructure tools are provided to allow customers to define their security posture.

Confidential computing complements the already comprehensive defense strategy offered in Azure by allowing customers to further protect their data in-use from the cloud provider.

:::image type="content" source="media/overview/builds-on-azure-security-foundations.jpg" alt-text="Graphic showing the defense in depth strategy of Azure complemented by confidential computing.":::


### External Threat

All customers seek to protect against external actors like hackers who seek to obtain unauthorized access to resources.

|Who    |What    |Where    |When    |Why
|:---   |:---    |:---     |:---    |:---
|External threat actor (hacker, espionage) |Obtain unauthorized access to resources    |Resources in Azure    |24x7x365    |Regulatory, Reputational damage, Damage to systems requiring remediation

Azure adopts an 'assume breach' position on security, significant investment is made in security but in the event of a zero-day type attack against the hypervisor the memory of workloads protected by Azure Confidential Computing is encrypted and not readable without the encryption keys that are protected by the system security processor.

:::image type="content" source="media/trusted-compute-base/acc-zero-trust-architecture.jpg" alt-text="Graphic showing the ACC zero trust architecture does not trust the Azure controlled hypervisor":::

### Insider-Threat

Many customers have a requirement to protect their workloads from internal threats where, for example customer administrators misuse their administrative access to obtain and possibly exfiltrate sensitive data.

|Who    |What    |Where    |When    |Why
|:---   |:---    |:---     |:---    |:---
|Malicious insider |Deliberate or accidental exfiltration of data    |Resources in Azure    |24x7x365    |Regulatory, Reputational damage

### Multi-party collaboration

Many new scenarios are evolving where multiple parties collaborate together on combined data-sets, in this case there's usually a desire to retain control over proprietary data and IP.

|Who    |What    |Where    |When    |Why
|:---   |:---    |:---     |:---    |:---
|Multiple parties |Protect my data from other parties I am collaborating with   |Resources in Azure    |24x7x365    |Regulatory, Reputational damage

For more details on multi-party solutions see [Multi-Party Data Solutions](./multi-party-data.md)

### Compliance with regulatory requirements

In order to comply with regulations like GDPR or SCHREMS II it's often required that the customer has granular control over access to data, for example ensuring that data is analyzed in an 'eyes-off' manner where data scientists collaborate without having direct access to entire data sets.

|Who    |What    |Where    |When    |Why
|:---   |:---    |:---     |:---    |:---
|Organization |Comply with regulatory requirement    |Resources in Azure    |24x7x365    |Regulatory, Reputational damage


























