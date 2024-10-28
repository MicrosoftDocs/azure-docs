---
title: Perform secure multiparty data collaboration on Azure
description: Learn about Intel SGX hardware to enable your confidential computing workloads.
author: mathapli
ms.service: azure-confidential-clean-rooms
ms.subservice: workloads
ms.topic: conceptual
ms.date: 10/28/2024
ms.author: mathapli
---

# Azure Confidential Clean Rooms

> [!NOTE]
> Azure Confidential Clean Rooms is currently in Gated Preview. Please fill the form at https://aka.ms/ACCRPreview and we will reach out to you with next steps.

Azure Confidential Clean Rooms, aka ACCR, offers a secure and compliant environment that helps organizations overcome the challenges of using privacy-sensitive data for AI model development. This solution ensures that the model's intellectual property remains intact while also enabling advanced data analytics.

With advanced privacy-enhancing technologies such as secure governance & audit , secure collaboration (TEE), verifiable trust, differential privacy and controlled access, organizations can safely collaborate and analyze sensitive data without violating compliance standards or risking data breaches. This capability is essential for unlocking the full potential of AI and data analytics while ensuring adherence to evolving data privacy laws.

## Who should use Azure Confidential Clean Rooms?
Azure, Confidential Clean Rooms could be a great choice for you if you have one or more scenarios such as the ones below: 

- Data analytics and inferencing: Organizations looking to build insights on second-party data while ensuring data privacy can leverage ACCR. This is particularly useful when data providers are concerned about data exfiltration. ACCR ensures that data is only used for agreed purposes and safeguards against unauthorized access or egress (as it is a sandboxed environment). 
- Data privacy ISVs: Independent Software Vendors (ISVs) who provide secure multiparty data collaboration services can use ACCR as an extensible platform. It allows them to add enforceable tamperproof contracts with governance and audit capabilities, as well as uses confidential hardware underneath to ensure data is encrypted during processing so that their customers' data remains secure.
- ML fine tuning: For organizations that require data from various sources to train or fine-tune machine learning models but face data sharing regulations, ACCR provides a solution. It allows any party to audit and confirm that data is being used only for the agreed purpose, such as ML modeling
- ML inferencing: For organizations that require data from various sources to train or fine-tune machine learning models but face data sharing regulations, ACCR provides a solution. It allows any party to audit and confirm that data is being used only for the agreed purpose, such as ML modeling

### Industries which can successfully leverage ACCR
1. Healthcare- In the healthcare industry, Azure Confidential Clean Rooms enable secure collaboration on sensitive patient data. For example, healthcare providers can use clean rooms to train and fine-tune AI/ML models for predictive diagnostics, personalized medicine, and clinical decision support. By leveraging confidential computing, healthcare organizations can protect patient privacy while collaborating with other institutions to improve healthcare outcomes.
Subsequently, ACCR can also be used for ML inferencing where partner hospitals can leverage power of these models for early detection.
2. Advertising- In the advertising industry, Azure Confidential Clean Rooms facilitate secure data sharing between advertisers and publishers. This enables targeted advertising and campaign effectiveness measurement without exposing sensitive user data.
3. BFSI- The BFSI sector can leverage Azure Confidential Clean Rooms to securely collaborate on financial data, ensuring compliance with regulatory requirements. This enables financial institutions to perform joint data analysis and develop risk models, fraud detection models, lending scenarios amongst others without exposing sensitive customer information.
4. Retail- In the retail industry, Azure Confidential Clean Rooms enable secure collaboration on customer data to enhance personalized marketing and inventory management. Retailers can use clean rooms to analyze customer behavior and preferences to create personalized marketing campaigns without compromising data privacy.

## Benefits

:::image type="content" source="./media/confidential-clean-rooms/accr-benefits.png" alt-text="Graphic of Azure Confidential Clean Rooms benefits, showing zero trust, no data duplicationm container workloads, and managed governance.":::

Azure Confidential Clean Rooms (ACCR) provide a secure and compliant environment for multi-party data collaboration. Built on confidential hardware, ACCR ensures that sensitive data remains protected throughout the collaboration process. Here are some key benefits of using Azure Confidential Clean Rooms:

- Secure collaboration and governance:
ACCR allows collaborators to create tamper-proof contracts that contain the constraints which are enforced by the clean room. Governance ensures validity of constraints before allowing data to be released into clean rooms and drives transparency amongst collaborators by generating tamper-proof audit trails. This is made possible with the help of the open-source confidential consortium framework used by Azure Confidential Clean Rooms.
- Compliance:
Confidential computing can address some of the regulatory and privacy concerns by providing a secure environment for data collaboration. This is particularly beneficial for industries such as financial services, healthcare, and telecom, which deal with highly sensitive data and personally identifiable information (PII).
- Enhanced data security:
ACCR leverages confidential computing to provide a hardware-based, trusted execution environment (TEE). This environment is sandboxed and allows only authorized workloads to execute. This prevents unauthorized access to data or code during processing, ensuring that sensitive information remains secure.
- Verifiable trust at each step with the help of cryptographic remote attestation forms the cornerstone of Azure Confidential Clean Rooms.

:::image type="content" source="./media/confidential-clean-rooms/accr-illustration.png" alt-text="Graphic of Azure Confidential Clean Rooms benefits, showing zero trust, no data duplicationm container workloads, and managed governance.":::

- Cost-effective: 
By providing a secure and compliant environment for data collaboration, ACCR reduces the need for costly and complex data protection measures. This makes it a cost-effective solution for organizations looking to leverage sensitive data for analysis and insights


##Onboarding to Azure Confidential Clean Rooms
ACCR is currently in Gated Preview. To express your interest in joining the gated preview, please follow below steps:
- Fill the form at https://aka.ms/ACCR-Preview-Onboarding (or use QR code on the right)
- Once you fill in the form, further steps will be shared with you on onboarding. 
- For further questions on onboarding reach out to  CleanRoomPMTeam@microsoft.com.
- After reviewing details, we will reach out to you with detailed steps for onboarding.

##Frequently asked questions

- Question: Where is the location Microsoft published side cars?
- Answer: The Microsoft published side cars are available at: https://mcr.microsoft.com/cleanroom 

- Question: Can more than 2 collaborators participate in a collaboration?
- Answer: Yes, more than 2 collaborators can become part of collaboration. This allows multiple data providers to share data in the clean room.

If you have questions about Azure Confidential Clean Rooms, please reach out to <accrsupport@microsoft.com>.

## Next steps

- [Deploy Confidential container group with Azure Container Instances](/azure/container-instances/container-instances-tutorial-deploy-confidential-containers-cce-arm)
- [Microsoft Azure Attestation](/azure/attestation/overview)