---
title: Perform secure multiparty data collaboration on Azure
description: Learn how Azure Confidential Clean Rooms enables multiparty collaborations while keeping your data safe from other collaborators.
author: mathapli
ms.service: azure
ms.subservice: confidential-computing
ms.topic: conceptual
ms.date: 10/28/2024
ms.author: mathapli
---

# Azure Confidential Clean Rooms (PREVIEW)

> [!NOTE]
> Azure Confidential Clean Rooms is currently in Limited Preview. The Preview is subject to the Supplemental Terms of Use for Microsoft Azure Previews. Customer should not use the Preview to process Personal Data or other data that is subject to legal or regulatory compliance requirements. The Preview is intended for testing, evaluation and feedback and should not be used in production. 

Azure Confidential Clean Rooms, aka ACCR, offers a protected environment that helps organizations overcome security and privacy challenges of using sensitive data for AI model development, inferencing, and data analytics. Built on top of [Confidential containers or C-ACI](../confidential-computing/confidential-containers.md), this service helps secure the data and the model from exfiltration outside the clean room boundary.
Organizations can safely collaborate and analyze data within the sandbox and use advanced privacy-enhancing technologies like secure governance & audit, secure collaboration (TEE), verifiable trust, differential privacy, and controlled access.

## Who could benefit from Azure Confidential Clean Rooms?
Azure Confidential Clean Rooms could be a great choice for you if you have these scenarios: 

- Data analytics and inferencing: Organizations looking to build insights on second-party data while helping ensure data privacy can use ACCR. ACCR is useful when data providers are concerned about data exfiltration. ACCR helps ensure that data is only used for agreed purposes and helps safeguard against unauthorized access or egress (as it's a sandboxed environment). 
- Data privacy ISVs: Independent Software Vendors (ISVs) who provide secure multiparty data collaboration services can use ACCR as an extensible platform. It allows them to add enforceable tamper-resistant contracts with governance and audit capabilities, and uses [Confidential containers or C-ACI](../confidential-computing/confidential-containers.md) underneath to help ensure data is protected during processing so that their customers' data remains protected.
- ML fine tuning: ACCR provides a solution to organizations that require data from various sources to train or fine-tune machine learning models but face data sharing regulations. It allows parties to audit and confirm that data is being used for the agreed purpose, such as ML modeling.
- ML inferencing: Organizations can use ACCR in machine learning (ML) inferencing to enable more secure, collaborative data analysis without compromising privacy or data ownership. ACCR acts as protected environment where multiple parties can combine sensitive data and apply ML models for inferencing while keeping raw data inaccessible to others.

### Industries that could benefit from  ACCR
- Healthcare- In the healthcare industry, Azure Confidential Clean Rooms enable multi-party collaboration on sensitive patient data. For example, healthcare providers can use clean rooms to train and fine-tune AI/ML models for predictive diagnostics, personalized medicine, and clinical decision support. By using confidential computing, healthcare organizations can protect patient privacy while collaborating with other institutions to improve healthcare outcomes.
ACCR can also be used for ML inferencing where partner hospitals can utilize the power of these models for early detection.
- Advertising- In the advertising industry, Azure Confidential Clean Rooms facilitates data sharing between advertisers and publishers. ACCR enables targeted advertising and campaign effectiveness measurement without exposing sensitive user data.
- Banking, Financial Services and Insurance (BFSI) - The BFSI sector can use Azure Confidential Clean Rooms to collaborate on financial data, and comply with regulatory requirements. This enables financial institutions to perform joint data analysis and develop risk models, fraud detection models, and lending scenarios among others without exposing sensitive customer information.
- Retail- In the retail industry, Azure Confidential Clean Rooms enables collaboration on customer data to enhance personalized marketing and inventory management. Retailers can use clean rooms to analyze customer behavior and preferences to create personalized marketing campaigns while maintaining data privacy.

## Benefits

:::image type="content" source="./media/confidential-clean-rooms/accr-benefits.png" alt-text="Diagram of Azure Confidential Clean Rooms benefits, showing zero trust, no data duplication of container workloads, and managed governance.":::

Azure Confidential Clean Rooms (ACCR) provides a protected environment for multi-party data collaboration. Built on [Confidential containers or C-ACI](../confidential-computing/confidential-containers.md), ACCR helps ensure that sensitive data remains protected throughout the collaboration process. Here are some key benefits of using Azure Confidential Clean Rooms:

- Multiparty collaboration and governance:
ACCR allows collaborators to create tamper-resistant contracts where constraints are enforced by ACCR. Governance helps ensure validity of constraints before allowing data to be released into clean rooms and drives transparency among collaborators by generating protected audit trails. ACCR uses the open-sourced [confidential consortium framework](https://microsoft.github.io/CCF/main/overview/what_is_ccf.html) to enable these capabilities.
- Compliance:
Confidential computing can help meet certain regulatory and privacy concerns by providing a secure environment for data collaboration. This capability can be beneficial for industries such as financial services, healthcare, and telecom, which deal with sensitive data and personal information.
- Enhanced data security:
ACCR is built using confidential computing. This environment is sandboxed and helps in allowing authorized workloads to execute, and also helps in preventing unauthorized access to data or code during processing, and helping ensure that sensitive information remains secure.
- Verifiable trust at each step with the help of cryptographic remote attestation forms the cornerstone of Azure Confidential Clean Rooms.

:::image type="content" source="./media/confidential-clean-rooms/accr-illustration.png" alt-text="Diagram of Azure Confidential Clean Rooms benefits, showing all steps of clean room creation.":::


## Onboarding to Azure Confidential Clean Rooms
ACCR is currently in Limited Preview. To express your interest in joining the gated preview, follow these steps:
- Fill and submit the form at https://aka.ms/ACCR-Preview-Onboarding.
- Once you submit, we will review your submission and further steps will be shared with you on onboarding (we will try to onboard most customers but as it is limited preview, we may only be able to allow limited customers). 
- For further questions on onboarding reach out to  CleanRoomPMTeam@microsoft.com.

## Frequently asked questions

- Question: What is the location Microsoft published side cars?
  Answer: The Microsoft published side cars are available at: mcr.microsoft.com/cleanroom. The code repository for the sidecars is present [here](https://github.com/Azure/azure-cleanroom/).

- Question: Is there a sampleclean room application to try out?
  Answer: You can find the clean room sample application [here](https://github.com/Azure-Samples/azure-cleanroom-samples). Please feel free to try out the sample after signing up for the Preview and receiving our response. 

- Question: Can more than two collaborators participate in a collaboration?
  Answer: Yes, more than two collaborators can become part of the collaboration. This allows multiple data providers to share data in the clean room.

If you have questions about Azure Confidential Clean Rooms, reach out to <accrsupport@microsoft.com>.

## Next steps

- [Deploy Confidential container group with Azure Container Instances](/azure/container-instances/container-instances-tutorial-deploy-confidential-containers-cce-arm)
- [Microsoft Azure Attestation](/azure/attestation/overview)
