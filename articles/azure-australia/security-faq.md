---
title: Azure Australia Security Frequently Asked Questions
description: The most commonly asked questions and answers relating to the Australian regions and meeting the specific requirements of Australian Government policy, regulations, and legislation.
author: galey801
ms.service: azure-australia
ms.topic: conceptual
ms.date: 04/25/2019
ms.author: grgale
---

# Azure Australia Security

## IRAP assessment and Certified Cloud Services List (CCSL) certification documents

When a service is added to the CCSL the Australian Cyber Security Centre (ACSC) provides a Letter of Certification, the ACSC Certification Report, and the ACSC Consumer Guide to the owner of the service for them to make available to their customers and partners.

Microsoft publishes all audit, assessment, and certification-related material on the [Microsoft Service Trust Portal](https://servicetrust.microsoft.com). We have created an Australia-specific page on the STP that contains all of the IRAP assessments reports, certification documents provided by the ACSC to Microsoft, and the PROTECTED Risk Management Guides for Azure and Office 365.

The Australia page can be found at [https://servicetrust.microsoft.com/ViewPage/Australia](https://servicetrust.microsoft.com/ViewPage/Australia) and a shortened URL has also been created which is easier to remember and type that is [https://aka.ms/au-irap](https://aka.ms/au-irap).

## Dissemination Limiting Markers (DLM) and PROTECTED certification

The process of having systems, including cloud services, approved for use by Government organisations is defined in the [Information Security Manual (ISM)](https://acsc.gov.au/infosec/ism/) produced and published by the Australian Cyber Security Centre (ACSC). The Australian Cyber Security Centre (ACSC) is the entity within ASD responsible for cyber security and cloud certification.

There are three steps to the approval process:

1. IRAP assessment - A process where registered professionals assess systems, services, and solutions against the technical controls in the ISM to produce an Assessment Report.

1. Certification – A certification authority (in the context of cloud services this is the ACSC) evaluates whether the controls have been implemented effectively and identifies any specific risks for the accreditation authority to consider. The conclusion is a Certification Report. For cloud services the ACSC also produces a Consumer Guide with specific implementation recommendations for the services.

1. Accreditation – The process where a senior officer of a government agency formally recognises and accepts the residual risk of a system to the information it processes, stores, and communicates.  An input to this process is the Certification Report.

The certification of Azure services by ACSC at the DLM and PROTECTED levels means that the implementation of the security controls required for the storage and processing of DLM and PROTECTED data have been assessed and confirmed to be in place and operating effectively. Any service certified for PROTECTED can also be used for DLM.

## On 1 January 2019 PSPF data classification changes came into effect

On October 1, 2018 the Attorney General’s Department publicly announced changes to the Protective Security Policy Framework (PSPF), specifically a new [Sensitive and Classified Information system](https://www.protectivesecurity.gov.au/information/sensitive-classified-information/Pages/default.aspx).

![Revised PSPF Classifications](media/pspf_classifications.jpg)

All Australian agencies and organisations that operate under the PSPF are impacted by these the changes. The primary change that impacts our current IRAP/CCSL certifications is the current Dissemination Limiting Markings (DLM) have been retired. The marking **OFFICIAL: Sensitive** replaces the various DLMs used for the protection of sensitive information. The change also introduced three information management markers that can be applied to all Official information at all levels of sensitivity and classification. The **PROTECTED** classification remains unchanged.

The term Unclassified is removed from the new system and the term Unofficial is applied to non-Government information although it does not require a formal marking.

## Choosing as Azure region for my OFFICIAL: Sensitive and PROTECTED workloads

The Azure **OFFICIAL: Sensitive** and **PROTECTED** certified services are deployed to all four Australian Data Centre Regions (Australia East, Australia South East, Australia Central, and Australia Central 2); however, the certification report issued by the ACSC recommends that **PROTECTED** data be deployed to the Azure Government regions in Canberra if a service is available there. More detailed information about the **PROTECTED** certified Azure services is available from [Australia page on the STP](https://aka.ms/au-irap).

**Microsoft recommends government data of all sensitivities and classifications is deployed to the Australia Central and Australia Central 2 regions, as they are designed and operated specifically for the needs of government.**

More information on the special nature of the Azure Australian regions is available at [Azure Australia Central Regions](https://azure.microsoft.com/en-us/global-infrastructure/australia/).

## How Microsoft separates **PROTECTED**, **OFFICIAL**, **OFFICIAL: Sensitive** and **Unofficial** data

Microsoft operates Azure and Office 365 in Australia as if all data is sensitive and/or classified, raising our security controls to that high bar.

The infrastructure supporting Azure is potentially serving data of multiple classifications.  But as our assumption is that customer data is classified, the appropriate controls are in place as such. Microsoft has adopted a baseline security posture for our services that complies with the PSPF requirements to store and process **PROTECTED** classified information.

To assure our customers that one tenant in Azure is not at risk from other tenants, Microsoft implements comprehensive defence-in-depth controls.

Beyond the capabilities implemented within the Microsoft Azure platform, additional customer configurable controls such as encryption with customer-managed keys, nested virtualisation, and Just-in-Time administrative access can further reduce the risk. Within the Azure Government Australia regions in Canberra, a process for formal whitelisting only Australian & New Zealand government and national critical infrastructure organisations is in place. This community cloud provides additional assurance to organisations that are sensitive to co-tenant risks.

The Microsoft Azure **PROTECTED** Certification Report confirms that these controls are effective for the storage and processing of **PROTECTED** classified data and their isolation.

## Relevance of the Azure IRAP/CCSL certifications to State Government and critical infrastructure providers like transport, utilities, and banks

Many state government and critical infrastructure providers incorporate federal government requirements into their security policy and assurance framework. These organisations also handle **OFFICIAL**, **OFFICIAL: Sensitive** and some amount of **PROTECTED** classified data, either from their interaction with federal government or in their own right.

The Australian Government is increasingly focussing policy and legislation on the protection of non-Government data that fundamentally impact the security and economic prosperity of Australia. As such the Azure Australia regions and the CCSL certification are relevant to all of those industries.

![Critical Infrastructure Sectors](media/nci_sectors.jpg)

The Microsoft certifications demonstrate that Azure services have been subjected to a thorough, rigorous, and formal assessment of the security protections in place and they have been approved for handling such highly sensitive data.

## Location and control of Microsoft data centres

It is a mandatory requirement of government and critical infrastructure to explicitly know the data centre location and ownership for cloud services processing their data.  Microsoft is unique as a hyperscale cloud provider in providing extensive transparency into location and ownership.

Microsoft’s Azure Government Australia regions (Australia Central and Australia Central 2) are operated within the facilities of CDC Datacentres.  The ownership of CDC Datacentres is Australian controlled with 48% ownership from the Commonwealth Superannuation Corporation, 48% ownership from Infratil (a NZ based, dual Australian, and New Zealand Stock Exchange listed long-term infrastructure asset fund) and 4% Australian management.  

The management of CDC Datacentres has contractual assurances in place with the Australian government restricting future transfer of ownership and control. This transparency of supply chain and ownership via Microsoft’s partnership with CDC Data Centres, is in line with the principles of the newly published [Whole of Government Hosting Strategy](https://www.dta.gov.au/our-projects/whole-government-hosting-strategy) and the definition of a **Certified Sovereign Datacentre**.

## The Azure services that are included in the CCSL certification

In June 2017 the ACSC certified 40 Azure services for the storage and processing of data at the **Unclassified: DLM** level. In April 2018, 24 of those services were certified for **PROTECTED** classified data. Microsoft is the only public hyperscale cloud available in Australia that has achieved this level of certification for inclusion on the Certified Cloud Services List (CCSL) at the **PROTECTED** classification.

The availability of ACSC certified Azure services across our Azure regions in Australia are as follows (those in bold are certified at **PROTECTED**):

|Azure Australia Central Regions|Non-regional services and Other Regions|
|---|---|
|API Management, App Gateway, Application Services, **Automation, Azure portal, Backup, Batch, Cloud Services**, Cosmos DB, Event Hubs, **ExpressRoute**, HDInsight, **Key Vault**, Load Balancer, Log Analytics, **Multi-factor Authentication**, Redis Cache,  **Resource Manager, Service Bus, Service Fabric, Site Recovery, SQL Database, Storage**, Traffic Manager, **Virtual Machines, Virtual Network, VPN Gateway**|**Azure Active Directory**, CDN, Data Catalog, **Import Export, Information Protection, IOT Hub**, Machine Learning, Media Services, **Notification Hubs**, Power BI, **Security Centre, Scheduler**, Search, Stream Analytics|
|

Microsoft publishes [Overview of Microsoft Azure Compliance that lists all in-scope services for all of the Global, Government, Industry, and Regional compliance and assessment processes Azure goes through, including IRAP/CCSL.

## Using an Azure service that is not in this list or that is certified at a lower level than I need

Services that are not certified, or that have been certified at **OFFICIAL: Sensitive** but not **PROTECTED**, can be used alongside or as part of a solution hosting **PROTECTED** data provided the services are either not storing or processing **PROTECTED** data unencrypted or the agency has completed a risk assessment and certified and accredited the service to store **PROTECTED** data themselves.

If a Commonwealth agency wants to use a service that is not included on the CCSL to store and process **OFFICIAL** data, they are able to, but they must notify the ACSC in writing that they are doing so, before entering into or renewing a contract with a cloud service provider.

Any service being used by an agency for **PROTECTED** workloads still needs to be accredited in line with the certification and accreditation processes outlined in the ISM. In the case of a service that does not appear on the CCSL, the agency consuming the service will need to undertake both the certification and accreditation processes for that service.

Services are being continually assessed by Microsoft to increase their levels of certification, so reach out to Microsoft if you require assistance with a service that is not currently listed under the **PROTECTED** certification.

If a service an agency wants to use has not currently been IRAP assessed or certified by the Australian Cyber Security Centre (ACSC), they can still use it. To do this they go through the Agency-managed IRAP Assessments process defined in the [DTA Secure Cloud Strategy](https://www.dta.gov.au/files/cloud-strategy/secure-cloud-strategy.pdf). Once assessed, the agency certifies the service and after completing their own risk assessment accredits the service for use by that agency. The outcomes of that process can be shared with other agencies to conduct their own risk process.

![DTA Secure Cloud Strategy Certification Process](media/certification.png)

Since Microsoft has a range of services certified on the CCSL at both the **OFFICIAL: Sensitive** and **PROTECTED** classifications the ACSC requires that we undertake an annual IRAP assessment and recertification of our services. That annual assessment is also the opportunity to include additional services for certification consideration.

## Certified PROTECTED gateway in Azure

Microsoft does not operate a Government certified Secure Internet Gateway (SIG) due to restrictions on the number of SIGs permissible under the Gateway Consolidation Program.  But the expected and necessary capabilities of a SIG can be configured within Microsoft Azure.

Through the **PROTECTED** certification of Azure services, the ACSC has specific recommendations to agencies for connecting to Azure, and when implementing network segmentation between security domains, for example between **PROTECTED** and the Internet. These recommendations include the use of Network Security Groups, firewalls, and Virtual Private Networks.  The ACSC recommend the use of a virtual gateway appliance. There are several virtual appliances available in Azure that have a physical equivalent on the ASD Evaluated Products List or have been evaluated against the Common Criteria Protection Profiles and are listed on the Common Criteria portal. These products are mutually recognised by ASD as a signatory to the Common Criteria Recognition Arrangement (CCRA).

Microsoft has produced guidance on implementing Azure-based capabilities that provide the security functions required to protect the boundary between different security domains which when combined, form the equivalent to a certified SIG. There are a number of partners who can assist with design and implementation of these capabilities as well as a number of partner solutions available that do the same.

## Security clearances and citizenship of Microsoft support personnel

Microsoft operates our services globally with screened and trained security personnel.  Personnel that have unescorted physical access to facilities in Sydney and Melbourne have Australian government Baseline security clearances. Personnel within the Australia Central and Australia Central 2 regions have minimum Negative Vetting 1 (NV1) clearances (as appropriate for **SECRET** data). This provides additional assurance to customers that personnel within data centres operating Azure are highly trustworthy.

Microsoft has a zero standing access policy with access granted through a system of Just-In-Time and Just-Enough-Administration based on Role-Based Access Controls. In the vast majority of cases, our administrators neither access nor require the privileges to access customer data in order to troubleshoot and maintain the service.  High degrees of automation and scripting of tasks for remote execution negate the need for direct access to customer data.

The Attorney-General’s Department has confirmed that Microsoft’s personnel security policies and procedures within Azure are consistent with the intent of the PSPF Access to Information provisions in INFOSEC-9.

## Storing International Traffic of Arms Regulations (ITAR) or Export Administration Regulations (EAR) data in Azure in Australia

The Azure technical controls that assist customers with meeting their obligations for export controlled data are the same globally in Azure. Importantly there is no “ticks the ITAR/EAR box” as there is no formal assessment and certification framework for export-controlled data.

For Azure Government and Office 365 US Government for Defense we have put additional contractual and process measures in place to support customers subject to export controls. Those additional contractual clauses and the guaranteed US national support and administration of the Azure regions is not in place for Australia.

That doesn’t mean that Azure in Australia cannot be used for ITAR/EAR, but you need to clearly understand the restrictions imposed on you through your export licence and you must implement additional protections to meet those obligations before using Azure to store that data. For example you might need to build nationality as an attribute into Azure Active Directory, use Azure Information Protection to enforce encryption rules over the data and limit it to only US and whatever other nationalities are included on the export licence, encrypt all data on premises before storing in Azure, using customer key or Hold Your Own Key for ITAR data, and the list goes on......

Because ITAR is not a formal certification, you need to understand what the restrictions and limitations associated with the export licence are and then work through whether there are sufficient controls in Azure to meet those requirements. In this case one of the issues to closely consider is the access by our engineers who may not be a nationality approved on the export licence.

## Further information and resources

|Resource|Link|
|---|---|
|Microsoft Service Trust Portal Australia Page|[https://servicetrust.microsoft.com/ViewPage/Australia](https://servicetrust.microsoft.com/ViewPage/Australia) or [https://aka.ms/au-irap](https://aka.ms/au-irap)|
|Microsoft Trust Center CCSL Page|[https://www.microsoft.com/en-us/trustcenter/compliance/ccsl](https://www.microsoft.com/en-us/trustcenter/compliance/ccsl)|
|Azure Security and Compliance Blueprints for PROTECTED|[https://aka.ms/au-protected](https://aka.ms/au-protected)|
|Tenant Isolation in Microsoft Azure|[https://docs.microsoft.com/en-us/azure/security/azure-isolation](https://docs.microsoft.com/en-us/azure/security/azure-isolation)|
|Australian Information Security Manual|[https://acsc.gov.au/infosec/ism](https://acsc.gov.au/infosec/ism)|
|Australian Cyber Security Centre (ACSC) Certified Cloud List|[https://acsc.gov.au/infosec/irap/certified_clouds.htm](https://acsc.gov.au/infosec/irap/certified_clouds.htm)|
|