---
title: Data sovereignty and China regulations | Azure China
description: Learn about data sovereignty and China regulations for Azure in China. Make sure you take the necessary steps to comply with regulatory requirements.
ms.topic: concept-article
ms.date: 07/20/2020
---

# Data sovereignty and China regulations

It's ultimately your obligation to comply with your own regulatory requirements. We commit to compliance with data protection and privacy laws generally applicable to IT service providers. If you're subject to any specific data sovereignty requirement, or other industrial or jurisdictional requirements, you need to make your own assessment and take necessary steps to ensure compliance. 

## Real name verification

Per the China legal requirement, online service providers have an obligation to verify the real name of users. For business entity users, a State-registered business license is required for real name verification. 

## ICP Filing

According to Administrative Measures on Internet Information Services and Measures on the Administration of Filings for Non-operating Internet Information Services of the People’s Republic of China, all websites operating in China (where domain name resolution is involved) must complete the ICP filing with the Ministry of Industry and Information Technology. As required by the communications administrations, a domain name without ICP filing is not allowed to be online, and a filed domain name must be resolved to a filed IP address.  

**ICP Filing Process**

![Diagram of ICPProcess](media/sovereignty-and-regulations/icp-process.png)

In addition, according to Article 12 of Administrative Measures on Security Protection of the International Networking of Computer Information Networks (Decree No. 33 of the Ministry of Public Security), after a website is successfully completed ICP filing with at the Ministry of Industry and Information Technology, the public security filing formalities should also be performed at the public security authority in the place where the company actually operates or where the individual currently lives within 30 days of the website launching. For consultation, please contact the network security department of the local public security authority. Please complete the public security filing for your website as soon as possible according to the above requirements. If you fail to complete the filing within 30 days, 21Vianet Blue Cloud will take relevant measures (including but not limited to suspension of access services) according to applicable laws, regulations and the requirements of the public security authority.

For details on ICP filing, see [ICP Filing – Azure Cloud Computing](https://www.azure.cn/en-us/support/icp/).


## VPN and dedicated lines

You may use a VPN or dedicated lines for your own office or operation purpose, as long as it is purchased from a qualified vendor with a valid operating license.

## Cross-Border Data Transfer and Security Assessment FAQs —— Updated Jan 2023
**Q: Am I allowed to transfer data outside of China?**

A： Yes, to the extent data localization requirements under Chinese law do not apply to you or you have satisfied the cross-border data transfer conditions. PRC data laws strictly regulate transfers of personal information, important data and other specially regulated data that was collected and generated in China from China to destinations outside China (including to Hong Kong SAR and Macao SAR). You may need to pass a government-led security assessment, enter into a standard contract, or obtain a certification for personal information protection in order to enable these transfers. There may also be industry- or sector-specific rules that apply to you. 

**Q: What are the data localization and security assessment requirements under Chinese law?**

A： Under the three key data laws in China – i.e. the PRC Cybersecurity Law (“CSL”), the PRC Data Security Law (“DSL”) and the PRC Personal Information Protection Law (“PIPL”) – certain data that was collected and generated in China must be stored within China by default, and the cross-border transfer of that data - as specified below - are only permitted after passing a security assessment organized by the Cyberspace Administration of China (the “CAC”): 
•	Cross-border transfer of personal information and “important data” by a CIIO;
•	Cross-border transfer of “important data”; 
•	Cross-border transfer of personal information by a data processor that has processed personal information of more than 1 million individuals; or
•	Cross-border transfer of personal information by a data processor that has transferred overseas the personal information exceeding the designated threshold amounts within a certain period.

Data processors that meet one of the above scenarios need to first conduct a risk self-assessment for the intended cross-border data transfer and then apply for the security assessment organized by the CAC by submitting documents through the provincial cyberspace administrations. The security assessment results are valid for two years, and if the circumstances affecting the security of the transferred data change, a new declaration for assessment is required.

Depending on industry or sector you belong to, you may also be subject to further restrictions under industry- or sector-specific rules.

**Q: Am I a CIIO?**

A：PRC’s Regulation on Security Protection of Critical Information Infrastructures (the “Regulation on CII”) defines CII as “important network facilities and information systems whose destruction or incapacity or data breach may have a debilitating impact on national security, national economy and the people's livelihood, and public interests”. An operator of such important network facilities and information systems is called “CIIO”. Operators of those important network facilities and information systems in the important industries and fields such as public communication and information services, energy, transportation, water resources, finance, public services, e-government and national defense-related science and technology industry will be more likely to be identified as CIIOs.

Under the Regulation on CII, industry regulators are empowered to formulate further rules to determine CII and organize this determination within their respective industries and sectors. CIIOs will be notified of the results of this determination so you should check internally whether any such notice has been received.

**Q: Am I processing any important data?**

A： The term “important data” is defined by the Administrative Regulation on the Security of Network Data (draft for comment) as “any data that, once tampered with, damaged, leaked or illegally obtained or used, may endanger national security or public interests”. Currently, although there are draft rules and draft national standards aimed at providing guidance on how to identify important data, these rules and standards have yet to be finalized.
Subject to further implementation rules and the industry-specific important data catalogues, the current definition remains open to interpretation, although on a common sense application, you might expect that most data handled by enterprises on a day-to-day basis would not meet the seemingly high threshold of the definition. Conducting a data mapping exercise with your internal and external legal teams will help you better understand your position. 

**Q: Am I processing any personal information? If so, what are the thresholds that will trigger the security assessment for cross-border data transfer?**

A：For your reference, the PIPL defines personal information as “various types of electronic or otherwise recorded information related to identified or identifiable natural persons, excluding anonymized information”. This broadly includes, for example, natural persons’ names, dates of birth, ID numbers, addresses and telephone numbers, etc. which are related to identified or identifiable natural persons. With more stringent data protection obligations applying to it, "sensitive personal information" is defined as “personal information that once leaked or illegally used, may easily lead to the infringement of the personal dignity of a natural person or may endanger his or her personal safety or property”, including information about biometrics, religious belief, specific identities, medical health status, financial accounts and whereabouts and tracks, as well as the personal information of minors under the age of 14. If the data you collect, store, or use falls within the above definitions, you will be considered as processing the personal information.

When a non-CIIO processor conducts any of the following transfers of personal information from China to destinations outside China, it must pass a prior security assessment for cross-border data transfer organized by the CAC: 
•	Cross-border transfer of personal information where you have processed personal information of more than 1 million individuals.
•	Cross-border transfer of personal information continuously, where you have transferred overseas personal information of more than 100,000 individuals cumulatively since 1 January of the previous year.
•	Cross-border transfer of personal information continuously, where you have transferred overseas the sensitive personal information of more than 10,000 individuals cumulatively since 1 January of the previous year. 

**Q：Can I transfer data overseas from China if the data I handled is subject to data localization requirements?**

A： Maybe. Cross-border transfer of data for a business need is still allowed, on the condition that you observe the requirements under PRC data laws and pass the security assessments administered by the PRC cyberspace authority. 
The implementation rules for these security assessments – i.e. the Security Assessment Measures for Cross-Border Data Transfer that were released on 7 July 2022 – have taken effect from 1 September 2022. However, you should also be aware that there is also retrospective effect in the case that cross-border data transfers occurred prior to 1 September 2022 are found not to comply with the rules. You may need to make rectification and apply for the assessment before March 2023.

**Q：How can I transfer personal information overseas from China if it will not trigger the obligation to apply for security assessment?**

A： The PIPL and its implementation rules will apply to your cross-border transfers of personal information. If your envisaged transfers of personal information will not trigger the obligation to apply for security assessment, you can follow the other two transfer mechanisms under the PIPL, i.e., obtaining a certification for personal information protection from authorized institutions or signing a standard contract with the overseas recipients of your data. 

In respect of the certification mechanism, the CAC and the State Administration for Market Regulation have promulgated the Implementation Rules of Certification for Personal Information Protection, while a set of practical guidelines has been released and updated, although a number of operational issues on implementing the certification remain to be further clarified by the regulatory authorities; in respect of the standard contract mechanism, a draft of these model clauses, together with rules about the filing requirements, has been released for public consultation but remains to be finalized. 

**Q：What does this mean for my deployment of cloud services for China?**

A： Given the above, we ask you to assess whether your on-going or envisaged data export activities are likely subject to the data localization/cross-border transfer requirements. It may be a case of seeking expert advice from both legal and technical specialists for accurate and up-to-date information on the CSL, DSL and PIPL’s requirements and other applicable PRC laws. 

Based on your informed assessment:
•	If you have been or are likely to be identified as a CII operator, you should store in China important data and personal information collected and generated in China. In this case, the use of the cloud services operated by 21Vianet in China will help you meet the localization requirements under PRC data laws.
•	If you are unlikely to be identified as a CII operator, or if the data you plan to transfer overseas does not contain important data or personal information collected and generated in China, or if you are confident that your cross-border data transfer can pass the applicable security assessments (where the cross-border data transfer triggers the obligation to apply for security assessment) or meet the other applicable requirements for cross-border data transfers (obtaining a certification for personal information protection from authorized institutions or signing a standard contract with the overseas recipients of customer data), you may want to use global cloud services based on your own business needs and financial considerations.


***Disclaimer: The statements above are provided as-is, and no representations are made that they are accurate or up-to-date. Please consult your legal experts, as all liability with respect to actions taken or not taken based on the statements above are hereby expressly disclaimed.***


