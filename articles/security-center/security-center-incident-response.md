<properties
   pageTitle="Leveraging Azure Security Center for Incident Response | Microsoft Azure"
   description="This document explains how to leverage Azure Security Center for an Incident Response scenario."
   services="security-center"
   documentationCenter="na"
   authors="YuriDio"
   manager="swadhwa"
   editor=""/>

<tags
   ms.service="security-center"
   ms.topic="hero-article"
   ms.devlang="na"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="09/20/2016"
   ms.author="yurid"/>

# Leveraging Azure Security Center for Incident Response
Many organizations learn how to respond to security incidents only after suffering an attack. In order to reduce costs and damage, it’s important to have an incident response plan in place before an attack takes place. Azure Security Center can be leveraged in different stages of an incident response.

## Incident response

An effective plan depends on three core capabilities: the abilities to protect, detect and respond to threats. Protection is about preventing incidents, detection is about identifying threats early and response is about evicting the attacker and restoring systems to mitigate the impacts of a breach. 

This article will use the security incident response stages from the  [Microsoft Azure Security Response in the Cloud](https://gallery.technet.microsoft.com/Azure-Security-Response-in-dd18c678) article as shown in the following diagram:

![Incident response lifecycle](./media/security-center-incident-response/security-center-incident-response-fig1.png)

Security Center can be leveraged during the Detection, Assessment and Diagnose stages. To learn more about each of these stages. Here an example of how Security Center can be useful during the three initial incident response stages:

- **Detect**: first indication of an event investigation
	- Example: initial verification that a high priority security alert was raised in the Security Center dashboard.
- **Assess**: perform the initial assessment to obtain more information about the suspicious activity.
	- Example: obtaining more information about the security alert.
- **Diagnose**: conduct a technical investigation, identify containment, mitigation, and workaround strategies
	- Example: follow the remediation steps described by Security Center in that particular security alert.

The scenario that follows shows you how to leverage Security Center during the detection, assessment, and diagnose/respond stages of a security incident.  In Security Center, a [security incident](security-center-incident.md) is an aggregation of all alerts for a resource that align with [kill chain](https://blogs.technet.microsoft.com/office365security/addressing-your-cxos-top-five-cloud-security-concerns/) patterns. Incidents appear in the [Security Alerts](security-center-managing-and-responding-alerts.md) tile and blade. An Incident will reveal the list of related alerts, which enables you to obtain more information about each occurrence. Security Center also present standalone security alerts that can also be used to track down a suspicious activity.

## Scenario

Contoso recently migrated some of their on-premises resources to Azure, including some virtual machine-based line of business workloads and SQL databases. Currently Contoso's Core Computer Security Incident Response Team (CSIRT) has a problem to investigate security issues, due the lack of security intelligence integrated with their current incident response tools. This lack of integration introduces a problem during the detection (too many false positives) and during the assessment and diagnose stages. As part of this migration, they decided to opt in for Security Center to help them address this problem. 

The first phase of this migration finished after onboarding all resources, and addressing all security recommendations from Security Center. Contoso CSIRT is the focal point for dealing with computer security incidents. The team consists of a group of people with responsibilities for dealing with any security incident. The team members have clearly defined duties to ensure that no area of response is left uncovered. 

For the purpose of this scenario, we are going to focus on the roles of the following personas that are part of Contoso CSIRT:

![Incident response lifecycle](./media/security-center-incident-response/security-center-incident-response-fig2.png)

Judy is in security operations and her responsibilities include:
- Monitoring and responding to security threats around-the-clock
- Escalating to the cloud workloads owner or security analyst as needed

Sam is a security analyst and his responsibilities include:
- Investigating attacks
- Remediating alerts 
- Working with workload owners to determine and apply mitigations

As you can see, Judy and Sam have different responsibilities, and they must work together sharing information obtained from Security Center. 

## Recommended solution

Since Judy and Sam have different roles, they will be using different areas of Security Center to obtain relevant information for their daily activities. Judy will use Security Alerts as part of her daily monitoring. 

![Security Alert](./media/security-center-incident-response/security-center-incident-response-fig3.png)

Judy will use Security Alerts during the Detection and Assessment stages. Once Judy finishes the initial assessment she may escalate the issue to Sam if additional investigation is required. At this point Sam will have use the information provided by Security Center, sometimes in conjunction with other data sources, to move on to the Diagnose stage.


## How to implement this solution 

To see how you would use Azure Security Center in an incident response scenario, we’ll follow Judy’s steps in the Detect and Assess stages, and then see what Sam does to diagnose the issue. 

### Detection and assessment incident response stages 

Judy signed in to Azure portal and is in the Security Center console. As part of her daily monitoring activities she started reviewing high priority security alerts by performing the following steps:

1. Click the **Security Alerts** tile and access **Security Alerts** blade.
	![Security Alert blade](./media/security-center-incident-response/security-center-incident-response-fig4.png)

	> [AZURE.NOTE] For the purpose of this scenario, Judy is going to perform an assessment on the Malicious SQL activity alert, as seen in the figure above. 
2. Click **Malicious SQL activity** alert and review the attacked resources in the **Malicious SQL Activity** blade:
	![Incident details](./media/security-center-incident-response/security-center-incident-response-fig5.png)
	
	In this blade Judy can take notes regarding the attacked resources, how many times did this attack happen and when it was detected.
3. Click the **attacked resource** to obtain more information about this attack. 

After reading the description, Judy is convinced that this is not a false positive and that she should escalate this case to Sam.

### Diagnose incident response stage 

Sam receives the case from Judy and started reviewing the remediation steps suggested by Security Center.

![Incident response lifecycle](./media/security-center-incident-response/security-center-incident-response-fig6.png)

### Additional resources

The incident response team can also take advantage of [Security Center Power BI](security-center-powerbi.md) capability to see different types of reports that can help them during further investigation to visualize, analyze, and filter recommendations and security alerts. For companies that use their Security Information and Event Management (SIEM) solution during the investigation process, they can also [integrate Security Center with their solution](security-center-integrating-alerts-with-log-integration.md). Azure audit logs and VM security events can also be integrated using the [Azure log integration tool](https://blogs.msdn.microsoft.com/azuresecurity/2016/07/21/microsoft-azure-log-integration-preview/). This info can be used in conjunction with the information provided by Security Center to investigate an attack.


## Conclusion

Assembling a team before an incident occurs is very important to your organization and will positively influence how incidents are handle. Having the right tools to monitor resources can help this team to take accurate steps to remediate a security incident. Security Center [detection capabilities](security-center-detection-capabilities.md) will assist IT to quickly respond to security incidents and remediate security issues.


